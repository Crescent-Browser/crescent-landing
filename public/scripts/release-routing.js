/* Shared release contract and conservative platform routing. No network or storage. */
(() => {
  const repository = 'Crescent-Browser/crescent-browser';
  const targets = {
    'macos-universal': ['macos', 'universal', '.dmg', 'macOS · Universal'],
    'macos-arm64': ['macos', 'arm64', '.dmg', 'macOS · Apple silicon'],
    'macos-x64': ['macos', 'x64', '.dmg', 'macOS · Intel'],
    'windows-x64': ['windows', 'x64', '.exe', 'Windows · x64'],
    'windows-arm64': ['windows', 'arm64', '.exe', 'Windows · ARM64'],
    'linux-x64': ['linux', 'x64', '.AppImage', 'Linux · x64'],
    'linux-arm64': ['linux', 'arm64', '.AppImage', 'Linux · ARM64'],
  };
  function platform(nav) {
    const ua = nav.userAgent || '';
    if (/Android|iPhone|iPad|iPod|CrOS/i.test(ua) || (/Mac/i.test(nav.platform || '') && nav.maxTouchPoints > 1)) return null;
    const name = nav.userAgentData?.platform || nav.platform || ua;
    if (/Win/i.test(name)) return 'windows';
    if (/Mac/i.test(name)) return 'macos';
    if (/Linux|X11/i.test(name)) return 'linux';
    return null;
  }
  function architecture(hints = {}) {
    if (/^arm$/i.test(hints.architecture) && String(hints.bitness) === '64') return 'arm64';
    if (/^(x86|x64)$/i.test(hints.architecture) && String(hints.bitness) === '64') return 'x64';
    return null;
  }
  function validate(catalog) {
    if (catalog?.schemaVersion !== 1 || catalog.repository !== repository) throw new Error('Unrecognized release catalog.');
    if (catalog.release === null && Array.isArray(catalog.downloads) && catalog.downloads.length === 0) return catalog;
    const version = catalog.release?.tag;
    if (!/^v\d+\.\d+\.\d+$/.test(version) || !Array.isArray(catalog.downloads)) throw new Error('Invalid release version.');
    if (catalog.release.url !== `https://github.com/${repository}/releases/tag/${version}`) throw new Error('Invalid release page.');
    const seen = new Set();
    for (const asset of catalog.downloads) {
      const spec = targets[asset.target];
      if (!spec || seen.has(asset.target)) throw new Error('Invalid or duplicate download target.');
      seen.add(asset.target);
      const name = `Crescent-Browser-${version}-${asset.target}${spec[2]}`;
      const url = `https://github.com/${repository}/releases/download/${version}/${name}`;
      if (asset.name !== name || asset.url !== url || !/^[a-f0-9]{64}$/.test(asset.sha256) || !Number.isSafeInteger(asset.size) || asset.size <= 0) throw new Error('Invalid installer asset.');
    }
    return catalog;
  }
  function select(catalog, os, arch) {
    const list = catalog.downloads.filter(asset => targets[asset.target][0] === os);
    return list.find(asset => asset.target === `${os}-universal`) || (arch ? list.find(asset => asset.target === `${os}-${arch}`) : null) || null;
  }
  globalThis.CrescentReleaseRouting = Object.freeze({ repository, targets, platform, architecture, validate, select });
})();
