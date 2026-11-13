/* Browser-specific migration illustrations. Uses sample data only. */
(() => {
  const scene = document.querySelector('[data-import-scene]');
  const sourceWindow = scene.querySelector('[data-source-browser]');
  const targetWindow = scene.querySelector('[data-crescent-import]');
  const feedback = scene.querySelector('[data-import-feedback]');
  const playButton = scene.querySelector('[data-preview-import]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const assets = window.CrescentBrandAssets;
  const sources = {
    Arc: { id: 'arc', logo: 'arc-browser', layout: 'sidebar', space: 'Work', folder: 'The good stuff' },
    Chrome: { id: 'chrome', logo: 'chrome', layout: 'horizontal', folder: 'Bookmarks' },
    Zen: { id: 'zen', logo: 'zen-browser', layout: 'sidebar', space: 'Workspace', folder: 'Essentials' },
    Dia: { id: 'dia', logo: 'dia', layout: 'horizontal', folder: 'Favorites' },
    Firefox: { id: 'firefox', logo: 'firefox', layout: 'horizontal', folder: 'Bookmarks Toolbar' }
  };
  let current = 'Arc';
  let finishTimer = null;
  const icon = (service) => '<img src="' + assets[service] + '" alt="" width="14" height="14">';
  const dots = '<span class="mini-traffic" aria-hidden="true"><i></i><i></i><i></i></span>';
  const favorites = () => ['github', 'figma', 'notion', 'google'].map(service => '<span>' + icon(service) + '</span>').join('');
  const tabs = () => '<div class="mini-tab"><span>' + icon('github') + '</span>Launch notes</div><div class="mini-tab"><span>' + icon('figma') + '</span>Brand ideas</div><div class="mini-tab"><span>' + icon('notion') + '</span>Weekend reads</div>';
  const page = () => '<article class="mini-document"><div class="mini-site-heading">' + icon('github') + '<span>STUDIO / FIELD NOTES</span><b>☆</b></div><small>A LITTLE ROOM TO CREATE</small><h4>The next<br>good idea.</h4><p>Keep the things that spark something.</p><div class="mini-document-art"><i></i><b></b><span>↗</span></div><div class="mini-document-lines"><i></i><i></i><i></i></div></article>';
  const url = (search) => '<div class="mini-address"><span aria-hidden="true">‹ &nbsp; › &nbsp; ⟳</span><span>' + (search || 'github.com/studio') + '</span><b aria-hidden="true">···</b></div>';
  function renderSource(name) {
    const source = sources[name];
    if (source.layout === 'sidebar') {
      return '<div class="mini-shell sidebar-shell"><aside class="mini-sidebar">' + dots + '<div class="mini-search">⌕ &nbsp; Search</div><div class="mini-favorites">' + favorites() + '</div><strong class="mini-space">◉ &nbsp; ' + source.space + '</strong><small class="mini-folder">⌑ &nbsp; ' + source.folder + '</small>' + tabs() + '<span class="mini-new-tab">+ &nbsp; New tab</span><span class="mini-profile">W <i>Work</i><b>+</b></span></aside><div class="mini-content">' + url() + page() + '</div></div>';
    }
    return '<div class="mini-shell horizontal-shell"><div class="mini-tabs-strip">' + dots + '<span class="mini-top-tab">' + icon('github') + ' Launch notes <b>×</b></span><span class="mini-background-tab">' + icon('figma') + ' Ideas</span><b>+</b></div>' + url(name === 'Dia' ? 'Search or enter a URL' : '') + '<div class="mini-bookmarks"><span>⌑ ' + source.folder + '</span>' + icon('notion') + '<span>Reading</span>' + icon('google') + '</div>' + page() + '</div>';
  }
  targetWindow.innerHTML = '<div class="mini-shell sidebar-shell"><aside class="mini-sidebar crescent-mini-sidebar">' + dots + '<div class="mini-search">⌕ &nbsp; Search</div><div class="mini-favorites">' + favorites() + '</div><strong class="mini-space">◉ &nbsp; Studio</strong><small class="mini-folder">⌑ &nbsp; The good stuff</small><div class="migrated-tabs">' + tabs() + '</div><span class="mini-new-tab">+ &nbsp; New tab</span><span class="mini-profile">W <i>Work</i><b>+</b></span></aside><div class="mini-content">' + url() + page() + '</div></div>';
  function stopMove() {
    clearTimeout(finishTimer);
    finishTimer = null;
    scene.classList.remove('is-transferring');
    playButton.disabled = false;
  }
  function select(name) {
    stopMove();
    current = name;
    const source = sources[name];
    scene.dataset.source = source.id;
    sourceWindow.setAttribute('aria-label', name + ' browser window illustration');
    sourceWindow.innerHTML = renderSource(name);
    scene.querySelector('[data-import-name]').textContent = name;
    scene.querySelector('[data-import-logo]').src = 'assets/brands/' + source.logo + '.svg';
    document.querySelectorAll('[data-import-source]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.importSource === name)));
    feedback.textContent = name + ' → Crescent · illustrated with sample Profiles and tabs.';
  }
  document.querySelectorAll('[data-import-source]').forEach(button => button.addEventListener('click', () => select(button.dataset.importSource)));
  playButton.addEventListener('click', () => {
    stopMove();
    feedback.textContent = 'Your favorites are making themselves at home…';
    if (reduce.matches) {
      feedback.textContent = current + ' → Crescent · your sample tabs, in their new home.';
      return;
    }
    scene.classList.add('is-transferring');
    playButton.disabled = true;
    finishTimer = setTimeout(() => {
      stopMove();
      feedback.textContent = current + ' → Crescent · your sample tabs, in their new home.';
    }, 2100);
  });
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      stopMove();
      feedback.textContent = current + ' → Crescent · illustrated with sample Profiles and tabs.';
    }
  });
  select(current);
})();
