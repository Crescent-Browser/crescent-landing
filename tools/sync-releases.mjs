import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import '../public/scripts/release-routing.js';
const routing = globalThis.CrescentReleaseRouting;
export function catalogFromRelease(release) {
  if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) throw new Error('A stable published release is required.');
  const downloads = [];
  for (const [target, spec] of Object.entries(routing.targets)) {
    const name = `Crescent-Browser-${release.tag_name}-${target}${spec[2]}`;
    const assets = release.assets.filter(asset => asset.name === name);
    if (assets.length > 1) throw new Error('Duplicate installer asset.');
    if (!assets.length) continue;
    const asset = assets[0];
    if (asset.state !== 'uploaded' || !/^sha256:[a-f0-9]{64}$/.test(asset.digest || '')) throw new Error('Installer upload or digest is incomplete.');
    downloads.push({ target, name, url: asset.browser_download_url, size: asset.size, sha256: asset.digest.slice(7) });
  }
  return routing.validate({ schemaVersion: 1, repository: routing.repository, release: { tag: release.tag_name, url: release.html_url }, downloads });
}
if (process.argv[1]?.endsWith('sync-releases.mjs')) {
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/${routing.repository}/releases/latest`, { headers });
  let catalog;
  if (response.status === 404) catalog = { schemaVersion: 1, repository: routing.repository, release: null, downloads: [] };
  else {
    if (!response.ok) throw new Error(`Release metadata request failed (${response.status}); refusing to replace the catalog.`);
    catalog = catalogFromRelease(await response.json());
  }
  await writeFile(new URL('../public/releases.json', import.meta.url), JSON.stringify(catalog, null, 2) + '\n');
  console.log(catalog.release ? `Indexed ${catalog.downloads.length} installers for ${catalog.release.tag}` : 'No public release; download buttons remain in release-updates mode.');
}
