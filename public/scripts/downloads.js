/* Only a same-origin static catalog is requested. Downloading requires a click. */
(() => {
  const routing = globalThis.CrescentReleaseRouting;
  const status = document.querySelector('[data-download-status]');
  const list = document.querySelector('[data-download-list]');
  const names = { macos: 'macOS', windows: 'Windows', linux: 'Linux' };
  async function load() {
    try {
      const response = await fetch(new URL('releases.json', document.baseURI), { credentials: 'omit', cache: 'no-store', redirect: 'error' });
      if (!response.ok) throw new Error('Catalog unavailable');
      const catalog = routing.validate(await response.json());
      if (!catalog.release || !catalog.downloads.length) {
        status.textContent = 'Public installers are not available yet. Follow the project for release updates.';
        document.querySelectorAll('[data-download-label]').forEach(el => { el.textContent = 'Get release updates'; });
        return;
      }
      status.textContent = `Crescent Browser ${catalog.release.tag} · Choose your installer below.`;
      const faq = document.querySelector('[data-release-status]');
      if (faq) faq.textContent = `Crescent Browser ${catalog.release.tag} is available. The Downloads section lists the platforms included in this release.`;
      for (const asset of catalog.downloads) {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = asset.url; link.textContent = routing.targets[asset.target][3];
        const detail = document.createElement('small');
        detail.textContent = `${(asset.size / 1024 / 1024).toFixed(1)} MB · SHA-256: ${asset.sha256}`;
        item.append(link, detail); list.append(item);
      }
      const releaseLink = document.createElement('a'); releaseLink.href = catalog.release.url; releaseLink.textContent = 'Release notes and checksums ↗';
      document.querySelector('[data-release-notes]').append(releaseLink);
      let hints = {};
      if (navigator.userAgentData?.getHighEntropyValues) {
        try { hints = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness']); } catch { /* Manual choices remain available. */ }
      }
      const os = routing.platform(navigator);
      const target = routing.select(catalog, os, routing.architecture(hints));
      document.querySelectorAll('[data-download-primary]').forEach(link => {
        const label = link.querySelector('[data-download-label]');
        if (target) {
          link.href = target.url; label.textContent = `Download for ${names[os]}`;
          link.setAttribute('aria-label', `Download Crescent Browser ${catalog.release.tag} for ${routing.targets[target.target][3]}`);
        } else {
          label.textContent = os ? `Choose ${names[os]} download` : 'View desktop downloads';
        }
      });
    } catch {
      status.textContent = 'Download information is temporarily unavailable. Please try again later.';
    }
  }
  load();
})();
