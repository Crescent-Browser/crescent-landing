import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";
import { execFileSync } from "node:child_process";
const root = resolve("public");
const errors = [];
let checked = 0;
async function exists(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}
for (const name of await readdir(root)) {
  if (extname(name) !== ".html") continue;
  const path = resolve(root, name);
  const html = await readFile(path, "utf8");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (ids.length !== new Set(ids).size) errors.push(`${name}: duplicate IDs`);
  if (!html.includes('name="viewport"'))
    errors.push(`${name}: missing viewport`);
  for (const match of html.matchAll(/\b(?:src|href)="([^"]*)"/g)) {
    const ref = match[1];
    if (!ref || /^(https?:|mailto:|data:)/.test(ref)) continue;
    if (ref.startsWith("#")) {
      if (ref.length > 1 && !ids.includes(ref.slice(1)))
        errors.push(`${name}: missing target ${ref}`);
      continue;
    }
    const [file, fragment] = ref.split("#");
    const dest = resolve(dirname(path), file);
    if (!(await exists(dest))) errors.push(`${name}: missing ${ref}`);
    else if (fragment) {
      const target = await readFile(dest, "utf8");
      if (!target.includes(`id="${fragment}"`))
        errors.push(`${name}: missing fragment ${ref}`);
    }
    checked++;
  }
}
const css = await readFile(resolve(root, "styles.css"), "utf8");
for (const match of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
  if (!(await exists(resolve(root, match[1]))))
    errors.push(`CSS missing ${match[1]}`);
  checked++;
}
execFileSync(process.execPath, ["--check", "public/app.js"], {
  stdio: "inherit",
});
const js = await readFile(resolve(root, "app.js"), "utf8");
for (const match of js.matchAll(/image:\s*["']([^"']+)["']/g)) {
  if (!(await exists(resolve(root, "assets", match[1]))))
    errors.push(`Theme missing ${match[1]}`);
  checked++;
}
if (
  /https?:\/\//.test(css) ||
  /<script[^>]+src="https?:/i.test(
    await readFile(resolve(root, "index.html"), "utf8"),
  )
)
  errors.push("Unexpected external runtime dependency");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `Verified ${checked} local asset/link references, all anchors, unique IDs, bundled CSS resources and JavaScript syntax.`,
);
