/* Browser-specific migration illustrations. Synthetic sample data, not an importer. */
(() => {
  const scene = document.querySelector('[data-import-scene]');
  const sourceWindow = scene.querySelector('[data-source-browser]');
  const targetWindow = scene.querySelector('[data-crescent-import]');
  const feedback = scene.querySelector('[data-import-feedback]');
  const playButton = scene.querySelector('[data-preview-import]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const assets = window.CrescentBrandAssets;
  const sources = {
    Arc: { id: 'arc', logo: 'arc-browser', detail: 'Favorites, pinned tabs, folders, and Spaces' },
    Chrome: { id: 'chrome', logo: 'chrome', detail: 'Horizontal tabs, tab groups, and the bookmarks bar' },
    Zen: { id: 'zen', logo: 'zen-browser', detail: 'Essentials, vertical tabs, and Workspaces' },
    Dia: { id: 'dia', logo: 'dia', detail: 'Sidebar tabs, Favorites, tab groups, and Chats' },
    Firefox: { id: 'firefox', logo: 'firefox', detail: 'Horizontal tabs, bookmarks, and tracking protection' }
  };
  const paths = {
    back: 'm14 5-7 7 7 7', next: 'm10 5 7 7-7 7',
    reload: 'M20 7V3m0 4h-4M20 7a8 8 0 1 0 1 8',
    sidebar: 'M9 4v16M4 4h16v16H4Z', search: 'M15 15l5 5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
    star: 'm12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z',
    lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5Z',
    menu: 'M4 6h16M4 12h16M4 18h16',
    folder: 'M3 6h7l2 3h9v11H3Z',
    grid: 'M3 3h7v7H3ZM14 3h7v7h-7ZM3 14h7v7H3ZM14 14h7v7h-7Z',
    chat: 'M4 4h16v13H9l-5 4Z',
    puzzle: 'M4 4h5a3 3 0 1 1 6 0h5v5a3 3 0 1 0 0 6v5h-5a3 3 0 1 0-6 0H4Z'
  };
  const ui = name => '<svg class="source-control" viewBox="0 0 24 24" aria-hidden="true"><path d="' + paths[name] + '"/></svg>';
  const icon = service => '<img src="' + assets[service] + '" alt="" width="14" height="14">';
  const dots = '<span class="mini-traffic" aria-hidden="true"><i></i><i></i><i></i></span>';
  const nav = () => '<span class="source-nav">' + ui('back') + ui('next') + ui('reload') + '</span>';
  const favorites = (services = ['github', 'figma', 'notion', 'google']) => services.map(service => '<span>' + icon(service) + '</span>').join('');
  const sampleTabs = [ ['github', 'Launch notes'], ['figma', 'Brand ideas'], ['notion', 'Weekend reads'] ];
  const tabs = () => sampleTabs.map(([service, title], index) => '<div class="mini-tab' + (index === 0 ? ' is-active' : '') + '"><span>' + icon(service) + '</span><span class="source-tab-title">' + title + '</span><b class="source-tab-close">×</b></div>').join('');
  const page = () => '<article class="mini-document"><div class="mini-site-heading">' + icon('github') + '<span>STUDIO / FIELD NOTES</span><b>☆</b></div><small>A LITTLE ROOM TO CREATE</small><h4>The next<br>good idea.</h4><p>Keep the things that spark something.</p><div class="mini-document-art"><i></i><b></b><span>↗</span></div><div class="mini-document-lines"><i></i><i></i><i></i></div></article>';
  const url = () => '<div class="mini-address"><span aria-hidden="true">‹ &nbsp; › &nbsp; ⟳</span><span>github.com/studio</span><b aria-hidden="true">···</b></div>';
  const group = label => '<small class="source-group">' + ui('folder') + label + '<span>⌄</span></small>';
  const address = (leading, trailing) => '<div class="source-address">' + (leading || '') + '<span>github.com/studio</span>' + (trailing || '') + '</div>';

  function renderSource(name) {
    if (name === 'Arc') {
      return '<div class="mini-shell source-shell arc-shell" aria-hidden="true"><aside class="source-sidebar"><div class="source-window-controls">' + dots + ui('sidebar') + '</div>' + address(ui('search')) + '<div class="source-favorites">' + favorites() + '</div><strong class="source-workspace"><i></i>Work<span>⌄</span></strong>' + group('The good stuff') + tabs() + '<div class="source-divider"></div><span class="source-new-tab">+ &nbsp; New Tab</span><div class="source-sidebar-foot"><span>▤</span><span class="source-space-dots"><i></i><i></i><i></i></span><b>+</b></div></aside><div class="source-page"><div class="source-page-toolbar">' + nav() + '<span>github.com</span>' + ui('grid') + '</div>' + page() + '</div></div>';
    }
    if (name === 'Zen') {
      return '<div class="mini-shell source-shell zen-shell" aria-hidden="true"><aside class="source-sidebar"><div class="source-window-controls">' + dots + nav() + '</div>' + address(ui('search')) + '<div class="source-favorites zen-essentials">' + favorites(['github', 'figma', 'notion', 'google', 'youtube', 'spotify']) + '</div><strong class="source-workspace"><i></i>Personal<span>⌄</span></strong><div class="source-pinned">' + icon('google') + '<span>Google</span><b>⌑</b></div><div class="source-divider"></div>' + tabs() + '<span class="source-new-tab">+ &nbsp; New Tab</span><div class="source-sidebar-foot"><span>⚙</span><span class="source-space-dots"><i></i><i></i></span><span>↓</span></div></aside><div class="source-page">' + page() + '</div></div>';
    }
    if (name === 'Dia') {
      return '<div class="mini-shell source-shell dia-shell" aria-hidden="true"><aside class="source-sidebar"><div class="source-window-controls">' + dots + '</div><div class="source-favorites dia-favorites">' + favorites(['google', 'google-calendar', 'slack']) + '</div><strong class="source-workspace">Work<span>⌄</span></strong>' + tabs() + group('Brand launch') + '<span class="source-new-tab">+ &nbsp; New Tab</span><div class="source-sidebar-foot">' + ui('chat') + '<span>Chats</span><b>⌄</b></div></aside><div class="source-page"><div class="source-page-toolbar">' + ui('sidebar') + nav() + '<span class="dia-chat-label">' + ui('chat') + ' Chat</span></div>' + page() + '</div></div>';
    }
    const firefox = name === 'Firefox';
    const strip = '<div class="source-tabstrip">' + dots + (firefox ? '' : '<span class="source-tab-group">Work</span>') + sampleTabs.map(([service, title], index) => '<span class="source-horizontal-tab' + (index === 0 ? ' is-active' : '') + '">' + icon(service) + '<span>' + title + '</span>' + (index === 0 ? '<b>×</b>' : '') + '</span>').join('') + '<b>+</b></div>';
    const toolbar = '<div class="source-toolbar">' + nav() + address(ui(firefox ? 'shield' : 'grid') + (firefox ? ui('lock') : ''), ui('star')) + ui('puzzle') + (firefox ? ui('menu') : '<span class="source-avatar">W</span><b>⋮</b>') + '</div>';
    const bookmarks = '<div class="source-bookmarks">' + ui(firefox ? 'sidebar' : 'grid') + '<span>' + ui('folder') + (firefox ? 'Bookmarks Toolbar' : 'The good stuff') + '</span><span>' + icon('notion') + ' Reading</span><span>' + icon('google') + ' Google</span></div>';
    return '<div class="mini-shell source-shell ' + (firefox ? 'firefox-shell' : 'chrome-shell') + '" aria-hidden="true">' + strip + toolbar + bookmarks + page() + '</div>';
  }
  targetWindow.innerHTML = '<div class="mini-shell sidebar-shell" aria-hidden="true"><aside class="mini-sidebar crescent-mini-sidebar">' + dots + '<div class="mini-search">⌕ &nbsp; Search</div><div class="mini-favorites">' + favorites() + '</div><strong class="mini-space">◉ &nbsp; Work</strong><small class="mini-folder">⌑ &nbsp; The good stuff</small><div class="migrated-tabs">' + tabs() + '</div><span class="mini-new-tab">+ &nbsp; New tab</span><span class="mini-profile">W <i>Work</i><b>+</b></span></aside><div class="mini-content">' + url() + page() + '</div></div>';
  let current = 'Arc';
  let finishTimer = null;
  function description(name) {
    return name + ': ' + sources[name].detail + '. Illustration · migration in development.';
  }
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
    sourceWindow.setAttribute('aria-label', name + ' browser illustration: ' + source.detail + ', using sample content');
    sourceWindow.innerHTML = renderSource(name);
    scene.querySelector('[data-import-name]').textContent = name;
    scene.querySelector('[data-import-logo]').src = 'assets/brands/' + source.logo + '.svg';
    document.querySelectorAll('[data-import-source]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.importSource === name)));
    feedback.textContent = description(name);
  }
  function playMove() {
    stopMove();
    feedback.textContent = 'Previewing the move: the same favorite tabs and custom names…';
    if (reduce.matches) {
      feedback.textContent = current + ' → Crescent Browser · sample setup preview. Migration in development.';
      return;
    }
    // Restart the CSS animation even when switching sources mid-move.
    void scene.offsetWidth;
    scene.classList.add('is-transferring');
    playButton.disabled = true;
    finishTimer = setTimeout(() => {
      stopMove();
      feedback.textContent = current + ' → Crescent Browser · sample setup preview. Migration in development.';
    }, 2100);
  }
  document.querySelectorAll('[data-import-source]').forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.importSource;
    if (name === current) return;
    select(name);
    playMove();
  }));
  playButton.addEventListener('click', playMove);
  reduce.addEventListener('change', () => {
    if (reduce.matches) {
      stopMove();
      feedback.textContent = description(current);
    }
  });
  select(current);
})();
