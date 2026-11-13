import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const source = new URL("../public/", import.meta.url);
const output = new URL("../dist/", import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

// Content-address code and styles so an updated page never reuses stale assets.
// Keep original paths available for visitors with an older page still cached.
const versioned = new Map();
const pages = [];
async function versionAssets(prefix = "") {
  for (const entry of await readdir(new URL(prefix, source), { withFileTypes: true })) {
    const path = prefix + entry.name;
    if (entry.isDirectory()) {
      await versionAssets(path + "/");
    } else if (/\.(css|js)$/.test(path)) {
      const bytes = await readFile(new URL(path, source));
      const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
      const target = path.replace(/(\.[^.]+)$/, "-" + hash + "$1");
      await writeFile(new URL(target, output), bytes);
      versioned.set(path, target);
    } else if (path.endsWith(".html")) {
      pages.push(path);
    }
  }
}
await versionAssets();
for (const path of pages) {
  const html = await readFile(new URL(path, output), "utf8");
  const updated = html.replace(/\b(src|href)="([^"]+)"/g, (attribute, name, ref) =>
    versioned.has(ref) ? name + '="' + versioned.get(ref) + '"' : attribute,
  );
  await writeFile(new URL(path, output), updated);
}
console.log("Built static site in dist/ with versioned scripts and styles.");
