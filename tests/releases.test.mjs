import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../public/scripts/release-routing.js';
import { catalogFromRelease } from '../tools/sync-releases.mjs';
const r = globalThis.CrescentReleaseRouting;
function release(target = 'macos-universal') {
  const tag = 'v0.1.0', name = `Crescent-Browser-${tag}-${target}${r.targets[target][2]}`;
  return { tag_name: tag, html_url: `https://github.com/${r.repository}/releases/tag/${tag}`, draft: false, prerelease: false,
    assets: [{ name, state: 'uploaded', size: 1024, digest: 'sha256:' + 'a'.repeat(64), browser_download_url: `https://github.com/${r.repository}/releases/download/${tag}/${name}` }] };
}
test('only real, correctly named published assets enter the catalog', () => {
  const catalog = catalogFromRelease(release());
  assert.equal(catalog.downloads.length, 1);
  assert.equal(r.select(catalog, 'macos', null).target, 'macos-universal');
  assert.equal(r.select(catalog, 'windows', 'x64'), null);
});
test('does not guess Mac architecture from Intel-looking Safari user agent', () => {
  const catalog = catalogFromRelease(release('macos-arm64'));
  assert.equal(r.platform({ userAgent: 'Macintosh; Intel Mac OS X', platform: 'MacIntel' }), 'macos');
  assert.equal(r.select(catalog, 'macos', null), null);
  assert.equal(r.select(catalog, 'macos', 'arm64').target, 'macos-arm64');
});
test('mobile, iPad desktop mode, and ChromeOS never receive a desktop binary automatically', () => {
  for (const nav of [{ userAgent: 'Android Linux', platform: 'Linux' }, { userAgent: 'iPhone' }, { userAgent: 'Macintosh', platform: 'MacIntel', maxTouchPoints: 5 }, { userAgent: 'CrOS x86_64', userAgentData: { platform: 'Linux' } }]) assert.equal(r.platform(nav), null);
});
test('uses explicit CPU hints and leaves unknown architectures for manual selection', () => {
  assert.equal(r.architecture({ architecture: 'arm', bitness: '64' }), 'arm64');
  assert.equal(r.architecture({ architecture: 'x86', bitness: '64' }), 'x64');
  assert.equal(r.architecture({}), null);
  assert.equal(r.platform({ userAgentData: { platform: 'Windows' } }), 'windows');
});
test('rejects draft, prerelease, incomplete uploads, and missing checksums', () => {
  for (const patch of [{ draft: true }, { prerelease: true }, { tag_name: 'v1.0.0-beta.1' }]) assert.throws(() => catalogFromRelease({ ...release(), ...patch }));
  for (const patch of [{ state: 'new' }, { digest: null }]) { const source = release(); Object.assign(source.assets[0], patch); assert.throws(() => catalogFromRelease(source)); }
});
test('rejects redirected/malicious/cross-repository URLs and duplicate targets', () => {
  const source = release(); source.assets[0].browser_download_url = 'https://example.com/installer.dmg';
  assert.throws(() => catalogFromRelease(source));
  const catalog = catalogFromRelease(release()); catalog.downloads.push(catalog.downloads[0]); assert.throws(() => r.validate(catalog));
});
test('safe empty catalog and no invented assets for source-only releases', () => {
  assert.equal(r.validate({ schemaVersion: 1, repository: r.repository, release: null, downloads: [] }).release, null);
  assert.equal(catalogFromRelease({ ...release(), assets: [] }).downloads.length, 0);
});
