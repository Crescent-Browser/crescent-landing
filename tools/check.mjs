import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = resolve('public');
const errors = [];
let checked = 0;
async function exists(path) {
  try { return (await stat(path)).isFile(); } catch { return false; }
}
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(path));
    else result.push(path);
  }
  return result;
}
async function checkLocal(ref, from) {
  if (!ref || /^(https?:|mailto:|data:)/.test(ref)) return;
  const [file, fragment] = ref.split('#');
  const target = file ? resolve(dirname(from), file) : from;
  if (!target.startsWith(root + sep)) { errors.push(`Reference leaves public/: ${ref}`); return; }
  if (!(await exists(target))) { errors.push(`Missing ${ref} from ${from}`); return; }
  if (fragment) {
    const html = await readFile(target, 'utf8');
    if (!html.includes(`id="${fragment}"`)) errors.push(`Missing anchor ${ref}`);
  }
  checked++;
}
for (const path of await files(root)) {
  const ext = extname(path);
  const content = ['.html', '.css', '.js'].includes(ext) ? await readFile(path, 'utf8') : '';
  if (ext === '.html') {
    const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    if (ids.length !== new Set(ids).size) errors.push(`${path}: duplicate IDs`);
    if (!content.includes('name="viewport"')) errors.push(`${path}: missing viewport`);
    for (const match of content.matchAll(/\b(?:src|href)="([^"]*)"/g)) await checkLocal(match[1], path);
    if (/<script[^>]+src="https?:/i.test(content)) errors.push(`${path}: external runtime script`);
    if (/design\/|refinement\/|playground-refined|landing-directions/.test(content)) errors.push(`${path}: stale review path`);
  }
  if (ext === '.css') {
    const resourceCss = content.replace(/url\(\s*(?:"data:[^"]*"|'data:[^']*')\s*\)/gi, '');
    for (const match of resourceCss.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) {
      if (/^https?:/.test(match[1])) errors.push(`${path}: external runtime CSS resource`);
      else if (!/^(data:|#)/.test(match[1])) await checkLocal(match[1], path);
    }
  }
  if (ext === '.js') {
    execFileSync(process.execPath, ['--check', path], { stdio: 'inherit' });
    const permittedCatalog = path === resolve(root, 'scripts/downloads.js') && content.includes("fetch(new URL('releases.json', document.baseURI)");
    if (/localStorage|sessionStorage|document\.cookie/.test(content) || (/\bfetch\(/.test(content) && !permittedCatalog)) errors.push(`${path}: unexpected storage/network API`);
  }
}
const data = await readFile(resolve(root, 'data.js'), 'utf8');
const assetMap = JSON.parse(data.match(/window\.CrescentBrandAssets = (\{[\s\S]*?\});/)[1]);
for (const ref of Object.values(assetMap)) await checkLocal(ref, resolve(root, 'index.html'));
const manifest = JSON.parse(await readFile(resolve(root, 'assets/brands/sources.json'), 'utf8'));
for (const asset of manifest.assets) {
  const path = resolve(root, 'assets/brands', asset.file);
  const hash = createHash('sha256').update(await readFile(path)).digest('hex');
  if (hash !== asset.sha256) errors.push(`Brand artwork changed: ${asset.file}`);
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Verified ${checked} local references, page anchors, JavaScript syntax, and ${manifest.assets.length} original brand asset hashes.`);
