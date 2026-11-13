/* Original Crescent preview. Synthetic content; no storage or network transport. */
(() => {
  const tokens = window.CrescentNativeThemes;
  const assets = window.CrescentBrandAssets;
  const root = document.querySelector(".refined-page");
  const state = {
    theme: "prism",
    view: "browse",
    profile: "work",
    space: 0,
    tab: 0,
    query: "",
    folder: null,
    keyboard: true,
    pins: {work: [], personal: [], creative: []},
    pinNotice: false,
    toastProfile: "work",
  };
  const themeMemory = {
    prism: { preset: "spectrum", scheme: "dark" },
    afterglow: { preset: "rose", scheme: "light" },
    lumen: { preset: "blue", scheme: "light" },
    eclipse: { preset: "ice", scheme: "dark" },
    meridian: { preset: "plum", scheme: "light" },
  };
  const themeNames = {
    prism: "Prism",
    afterglow: "Afterglow",
    lumen: "Lumen",
    eclipse: "Eclipse",
    meridian: "Meridian",
  };
  const profiles = {
    work: { name: "Work", spaces: ["Studio", "Research", "Ideas"] },
    personal: { name: "Personal", spaces: ["Everyday", "Reading", "Weekend"] },
    creative: {
      name: "Creative",
      spaces: ["Design", "Inspiration", "Side projects"],
    },
  };
  const tabs = [
    {
      title: "The art of paying attention",
      service: "medium",
      publisher: "CURIOSITY JOURNAL · MEDIUM",
      domain: "medium.com",
      headline: "The art of paying attention.",
      subtitle: "Sometimes the best thing to find is a little space to think.",
    },
    {
      title: "Design notes",
      service: "figma",
      publisher: "STUDIO / FIELD NOTES",
      domain: "design.example.org",
      headline: "Make something worth opening.",
      subtitle: "A little color. A clear idea. A new perspective.",
    },
    {
      title: "Crescent Browser",
      service: "github",
      publisher: "CRESCENT / OPEN WORK",
      domain: "github.com/Crescent-Browser",
      headline: "A browser with room for you.",
      subtitle: "Built for the web, and the people who make it.",
    },
  ];
  const path = {
    pin: '<path d="M8 3h8v4l3 5v2H5v-2l3-5Zm4 11v7"/>',
    arrow: '<path d="m9 5 7 7-7 7"/>',
    up: '<path d="m5 15 7-7 7 7"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    monitor:
      '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
    settings:
      '<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11H3Z"/>',
    stack:
      '<rect x="5" y="3" width="14" height="17" rx="2"/><path d="M3 6v16h13"/>',
    star: '<path d="m12 3 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1-5.5-3.1-5.5 3.1 1.3-6.1L3.2 9.4l6.2-.7Z"/>',
    share: '<path d="M12 15V3m-4 4 4-4 4 4M6 11H4v10h16V11h-2"/>',
    heart: '<path d="M12 20 4 12C-2 5 7 0 12 7c5-7 14-2 8 5Z"/>',
    comment: '<path d="M21 11a8 8 0 0 1-8 8H6l-4 3 1-7a8 8 0 1 1 18-4Z"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
    archive: '<path d="M3 4h18v4H3zm2 4h14v13H5zm4 5h6"/>',
    keyboard:
      '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h1m4 0h1m4 0h1M6 12h1m4 0h1m4 0h1M7 16h10"/>',
    phone:
      '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 5h4m-4 14h4"/>',
    moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10Z"/>',
  };
  const svg = (name) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    path[name] +
    "</svg>";
  const esc = (text) =>
    String(text).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const logo = (service) =>
    '<img src="' +
    assets[service] +
    '" alt="' +
(window.CrescentBrandNames[service] || service) +
    '" class="tab-brand" data-brand="' +
    service +
    '">';
  function currentRow() {
    const m = themeMemory[state.theme];
    return tokens.find(
      (r) =>
        r.theme === state.theme &&
        r.preset === m.preset &&
        r.scheme === m.scheme,
    );
  }
  function applyTheme() {
    const row = currentRow(),
      t = row.tokens;
    const mobileBg = t.dark ? t.panel : t.sidebar_top;
    const values = {
      "--sidebar": t.sidebar_top,
      "--sidebar-bottom": t.sidebar_bottom,
      "--chrome": t.frame,
      "--ui-ink": t.text,
      "--ui-pale": t.omnibox,
      "--ui-active": t.tab_selected,
      "--mock-accent": t.accent,
      "--frame": t.separator,
      "--native-toolbar": t.toolbar,
      "--native-toolbar-ink": t.text,
      "--native-omnibox": t.omnibox,
      "--native-line": t.separator,
      "--native-grain": String(t.grainAlpha / 255),
      "--native-selected-ink": t.tab_selected_text,
      "--native-inset": t.contentInset / 6 + "cqw",
      "--native-radius": t.contentRadius / 8 + "cqw",
      "--mobile-bg": mobileBg,
      "--mobile-surface": t.dark ? t.sidebar_bottom : t.sidebar_bottom,
      "--mobile-ink": t.text,
      "--mobile-muted": t.text_dim,
      "--mobile-line": t.separator,
      "--mobile-control": t.dark ? t.omnibox : t.omnibox_hover,
      "--mobile-accent": t.accent,
      "--page": "#fff6fc",
      "--page-ink": "#38224d",
      "--page-line": "#7041ff20",
      "--page-muted": "#8963ad",
    };
    document
      .querySelectorAll(".device-theme:not(.spaces-showcase),.mobile-modal")
      .forEach((el) =>
        Object.entries(values).forEach(([name, value]) =>
          el.style.setProperty(name, value),
        ),
      );
    document.querySelectorAll(".browser:not([data-showcase-browser])").forEach((el) => {
      el.dataset.nativeTheme = state.theme;
      el.dataset.nativeMode = row.preset;
      el.dataset.nativeToolbar = ["standard", "title", "hidden"][
        t.toolbarStyle
      ];
    });
    window.CrescentPaintPrism?.();
    document.querySelectorAll("[data-native-theme-button]").forEach((b) => {
      const on = b.dataset.nativeThemeButton === state.theme;
      b.setAttribute("aria-checked", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    const rows = tokens.filter((r) => r.theme === state.theme);
    const presets = [...new Map(rows.map((r) => [r.preset, r])).values()];
    const preset = document.querySelector("#native-preset");
    preset.innerHTML = presets
      .map(
        (r) => '<option value="' + r.preset + '">' + r.presetName + "</option>",
      )
      .join("");
    preset.value = row.preset;
    document.querySelector("#preset-label").textContent =
      state.theme === "prism"
        ? "Color mode"
        : state.theme === "afterglow"
          ? "Space color"
          : state.theme === "meridian"
            ? "Tint"
            : "Accent";
    const scheme = document.querySelector("#native-scheme");
    scheme.value = row.scheme;
    scheme.disabled = !["afterglow", "meridian"].includes(state.theme);
    const label =
      row.name + " · " + row.presetName + " · " + (t.dark ? "Dark" : "Light");
    document.querySelector("#native-theme-status").textContent = label;
    document
      .querySelectorAll(".native-theme-caption")
      .forEach((el) => (el.textContent = "Browser appearance: " + label));
    document
      .querySelectorAll(".theme-name-value")
      .forEach((el) => (el.textContent = row.name));
    root.dataset.previewTheme = state.theme;
    root.dataset.previewPreset = row.preset;
    root.dataset.previewScheme = row.scheme;
  }
  document
    .querySelectorAll("[data-native-theme-button]")
    .forEach((button, index, list) => {
      button.addEventListener("click", () => {
        state.theme = button.dataset.nativeThemeButton;
        applyTheme();
        renderMobile();
      });
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        const next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? list.length - 1
              : (index + (event.key === "ArrowRight" ? 1 : -1) + list.length) %
                list.length;
        list[next].click();
        list[next].focus();
      });
    });
  document
    .querySelector("#native-preset")
    .addEventListener("change", (event) => {
      themeMemory[state.theme].preset = event.target.value;
      applyTheme();
      renderMobile();
    });
  document
    .querySelector("#native-scheme")
    .addEventListener("change", (event) => {
      themeMemory[state.theme].scheme = event.target.value;
      applyTheme();
      renderMobile();
    });
  const artwork =
    '<svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="300" fill="#ecd9ef"/><circle cx="445" cy="92" r="65" fill="#ffc6a6"/><path d="M0 240Q130 100 260 207T600 140V300H0" fill="#c0a7df"/><path d="M0 286Q140 202 280 253T600 200V300H0" fill="#9470ba"/><path d="M0 300Q220 250 360 290T600 252V300H0" fill="#60447d"/></svg>';
  function article(index = state.tab) {
    const tab = tabs[index];
    return (
      '<div class="arc-page '+(index===0?'medium-page':'')+'"><header class="article-masthead"><strong>' +
      (index === 0
        ? "Medium"
        : index === 1
          ? "Studio notes."
          : "crescent / open") +
      '</strong><span>READ &amp; EXPLORE</span></header><div class="article-content"><p class="article-kicker">' +
      tab.publisher +
      "</p><h4>" +
      tab.headline +
      '</h4><p class="article-deck">' +
      tab.subtitle +
      '</p><div class="article-art">' +
      artwork +
      '</div><p class="article-byline">A SMALL NOTE ON CURIOSITY &nbsp; / &nbsp; 4 MIN READ</p><p class="article-copy">Some of the best ideas begin without a plan. Follow a link. Keep a note. Leave a little room for the unexpected.</p><p class="article-copy" style="margin-top:4cqw">Curiosity is not always a straight path. Sometimes it is a page you return to, or an idea you carry into tomorrow.</p><p class="article-copy" style="margin-top:4cqw">A good place to start is simply to keep exploring.</p></div><footer class="article-actions"><span>' +
      svg("heart") +
      "</span><span>" +
      svg("comment") +
      '</span><button data-mobile-action="share" aria-label="Share this page">' +
      svg("share") +
      "</button></footer></div>"
    );
  }
  function isPinned() { return state.pins[state.profile].some(pin => pin.tab === state.tab); }
  let pinToastTimer=null;
  function pinPage(profile) {
    if(!state.pins[profile].some(pin=>pin.tab===state.tab))state.pins[profile].push({tab:state.tab,space:0});
    state.toastProfile=profile;state.pinNotice=true;state.view='browse';
    clearTimeout(pinToastTimer);pinToastTimer=setTimeout(()=>{if(state.pinNotice){state.pinNotice=false;renderMobile();}},3200);
  }
  function toolbar(deck = false) {
    return '<div class="mobile-browser-address">'+svg('lock')+'<span>'+tabs[state.tab].domain+'</span></div><div class="arc-bottom"><button data-mobile-action="' + (deck ? 'spaces' : 'tabs') + '" aria-label="' + (deck ? 'Show desktop Spaces' : 'Show tab cards') + '">' + (deck ? svg('monitor') : '<span class="arc-stack-icon"></span>') + '</button><button class="arc-add" data-mobile-action="search" aria-label="Search or open a tab">+</button>' + (deck ? '<button data-mobile-action="settings" aria-label="Show mobile settings">'+svg('settings')+'</button>' : '<button class="arc-share-button" data-mobile-action="share" aria-label="Share this page">'+svg('share')+'</button>') + '</div>';
  }
  function pinToast() {
    return state.pinNotice?'<div class="pin-success-toast" role="status"><span class="pin-success-icon">✓</span><span><strong>Pinned successfully</strong><small>'+profiles[state.toastProfile].name+' Profile · '+profiles[state.toastProfile].spaces[0]+'</small></span></div>':'';
  }
  function browse() { return article() + toolbar() + pinToast(); }
  function shareView(chooseProfile=false) {
    const profileRows=Object.entries(profiles).map(([key,p])=>'<button class="share-profile-row" data-mobile-action="pin-to-profile" data-pin-profile="'+key+'"><span class="share-profile-avatar profile-'+key+'">'+p.name[0]+'</span><span><strong>'+p.name+'</strong><small>'+p.spaces[0]+' Space</small></span>'+svg('pin')+'</button>').join('');
    return article()+toolbar()+'<div class="share-sheet-shade" data-mobile-action="browse"></div><section class="mobile-share-sheet"><div class="arc-sheet-handle"></div><header><div><strong>'+(chooseProfile?'Pin to a Profile':'Share this page')+'</strong><small>'+(chooseProfile?'PROFILES IN YOUR ACCOUNT':tabs[state.tab].domain)+'</small></div><button data-mobile-action="browse" aria-label="Close share sheet">×</button></header>'+(chooseProfile?'<div class="share-account"><span>C</span><div>Your Crescent account<small>Choose where this page belongs.</small></div></div><div class="share-profiles">'+profileRows+'</div>':'<div class="share-page-card"><span class="share-medium-mark"><img src="'+assets.medium+'" alt="Medium"></span><div><strong>'+tabs[state.tab].headline+'</strong><small>'+tabs[state.tab].domain+'</small></div></div><button class="share-pin-action" data-mobile-action="choose-pin-profile">'+svg('pin')+'<span>Pin to a Profile<small>Keep it with your tabs, across devices.</small></span>'+svg('arrow')+'</button><button class="share-cancel" data-mobile-action="browse">Cancel</button>')+'</section>';
  }
  function deck() {
    return (
      '<div class="deck-heading"><span>Open tabs <small style="opacity:.5;font-size:2.2cqw">/ 3</small></span><button data-mobile-action="profiles">' +
      profiles[state.profile].name +
      ' Profile ⌄</button></div><div class="deck-stage" aria-label="Swipe between demo tab cards">' +
      tabs
        .map((tab, index) => {
          let relative = (index - state.tab + 3) % 3;
          if (relative === 2) relative = -1;
          return (
            '<button class="deck-card" data-mobile-action="open-tab" data-tab="' +
            index +
            '" data-relative="' +
            relative +
            '" aria-label="Open ' +
            tab.title +
            '"><span class="deck-card-title">' +
            logo(tab.service) +
            "<span>" +
            tab.title +
            "</span></span>" +
            article(index) +
            "</button>"
          );
        })
        .join("") +
      '</div><div class="deck-progress">' +
      tabs
        .map(
          (t, index) =>
            '<button data-mobile-action="select-card" data-tab="' +
            index +
            '" aria-label="Show ' +
            t.title +
            ' card" aria-pressed="' +
            (index === state.tab) +
            '"></button>',
        )
        .join("") +
      '</div><p class="deck-swipe-note">Swipe through your open tabs.</p>' +
      toolbar(true)
    );
  }
  function closeButton() {
    return '<button class="arc-sheet-close" data-mobile-action="browse" aria-label="Close sheet">×</button>';
  }
  function sheetHead(title, caption, profileLink = false) {
    return (
      '<div class="arc-sheet-handle"></div><header class="arc-sheet-header">' +
      (profileLink
        ? '<button class="arc-profile-switch" data-mobile-action="profiles" aria-label="Switch Profile">'
        : "<div>") +
      "<h4>" +
      title +
      (profileLink ? " ⌄" : "") +
      "</h4><p>" +
      caption +
      "</p>" +
      (profileLink ? "</button>" : "</div>") +
      closeButton() +
      "</header>"
    );
  }
  function spaces() {
    const p = profiles[state.profile],
      space = p.spaces[state.space];
    const folders =
      state.space === 0
        ? [
            "Launch notes",
            "Design system",
            "Reading list",
            "Side projects",
            "Inspiration",
          ]
        : state.space === 1
          ? [
              "Research notes",
              "Reference links",
              "Saved for later",
              "Ideas to revisit",
            ]
          : ["Weekend plans", "Projects to try", "Places to explore"];
    return (
      '<section class="arc-sheet">' +
      sheetHead(
        space,
        p.name.toUpperCase() + " PROFILE · FROM YOUR COMPUTER",
        true,
      ) +
      '<div class="arc-sheet-list">' +
      tabs
        .map(
          (tab, index) =>
            '<button class="arc-space-link" data-mobile-action="open-tab" data-tab="' +
            index +
            '">' +
            logo(tab.service) +
            "<span>" +
            tab.title +
            "</span></button>",
        )
        .join("") +
      '<div class="arc-divider"></div>' +
      folders
        .map(
          (folder, index) =>
            '<button class="arc-space-link" data-folder="true" data-mobile-action="folder" data-folder-index="' +
            index +
            '">' +
            svg("folder") +
            "<span>" +
            folder +
            "</span></button>" +
            (state.folder === index
              ? '<div style="padding-left:8cqw;font-size:2.6cqw;line-height:2.5;color:var(--mobile-muted)">Project notes<br>Links to come back to</div>'
              : ""),
        )
        .join("") +
      '</div><nav class="arc-space-dock" aria-label="Mobile Spaces">' +
      p.spaces
        .map(
          (space, index) =>
            '<button data-mobile-action="space" data-space="' +
            index +
            '" aria-pressed="' +
            (state.space === index) +
            '">' +
            svg(index === 0 ? "archive" : index === 1 ? "folder" : "star") +
            "<span>" +
            space +
            "</span></button>",
        )
        .join("") +
      "</nav></section>"
    );
  }
  function profilesView() {
    return (
      '<section class="arc-sheet">' +
      sheetHead("Your Profiles.", "A SPACE FOR EACH PART OF YOUR DAY") +
      '<div class="arc-profile-list">' +
      Object.entries(profiles)
        .map(
          ([key, p]) =>
            '<button class="arc-profile-card" data-mobile-action="profile" data-profile="' +
            key +
            '" aria-pressed="' +
            (state.profile === key) +
            '"><span class="arc-profile-avatar">' +
            p.name[0] +
            "</span><span><strong>" +
            p.name +
            "</strong><small>" +
            p.spaces.join(" · ") +
            "</small></span><em>" +
            (key === state.profile ? "✓" : "›") +
            "</em></button>",
        )
        .join("") +
      '</div><p class="arc-private-note">Profiles organize your tabs and Spaces. Website sessions stay on each device.</p></section>'
    );
  }
  const suggestions = [
    { title: "The scenic route", service: "crescent", tab: 0 },
    { title: "Figma — Design notes", service: "figma", tab: 1 },
    { title: "GitHub — Crescent Browser", service: "github", tab: 2 },
    { title: "Google Fonts", service: "google", tab: 1 },
  ];
  function results() {
    const matches = suggestions.filter((s) =>
      s.title.toLowerCase().includes(state.query.toLowerCase()),
    );
    return matches.length
      ? matches
          .map(
            (s) =>
              '<button class="arc-search-row" data-mobile-action="open-tab" data-tab="' +
              s.tab +
              '">' +
              logo(s.service) +
              "<span>" +
              s.title +
              "</span></button>",
          )
          .join("")
      : '<p class="arc-private-note">No demo tabs match that search.</p>';
  }
  function keyboard() {
    return (
      '<div class="arc-keyboard" aria-label="Illustrative keyboard">' +
      ["qwertyuiop", "asdfghjkl", "zxcvbnm"]
        .map(
          (row, index) =>
            '<div class="arc-key-row">' +
            (index === 2
              ? '<button data-mobile-action="key" data-key="backspace" aria-label="Delete character">⌫</button>'
              : "") +
            [...row]
              .map(
                (key) =>
                  '<button data-mobile-action="key" data-key="' +
                  key +
                  '">' +
                  key +
                  "</button>",
              )
              .join("") +
            "</div>",
        )
        .join("") +
      '<div class="arc-key-row arc-key-bottom"><button data-mobile-action="key" data-key=" ">space</button><button data-mobile-action="open-tab" data-tab="0" aria-label="Open first demo tab">↵</button></div></div>'
    );
  }
  function search() {
    return (
      article() +
      '<div class="arc-search-shade"></div><section class="arc-search-sheet"><div class="arc-sheet-handle"></div><div class="arc-search-input">' +
      svg("search") +
      '<input aria-label="Search demo tabs" placeholder="Search…" value="' +
      esc(state.query) +
      '"><button data-mobile-action="browse" aria-label="Close search" class="arc-sheet-close">×</button></div><div class="arc-search-results">' +
      results() +
      '</div><p class="arc-search-caption">Find a tab, or follow your next thought.</p>' +
      (state.keyboard ? keyboard() : "") +
      "</section>"
    );
  }
  function settingRow(iconName, title, value, action, sub = "") {
    return (
      '<button class="arc-settings-row" data-mobile-action="' +
      action +
      '"><span class="arc-setting-icon">' +
      svg(iconName) +
      '</span><span class="arc-setting-copy">' +
      title +
      (sub ? "<small>" + sub + "</small>" : "") +
      "</span>" +
      (value ? '<span class="arc-settings-value">' + value + "</span>" : "") +
      svg("arrow") +
      "</button>"
    );
  }
  function settings() {
    return (
      '<section class="arc-settings"><header class="arc-settings-top"><h4>Settings</h4><button class="arc-done" data-mobile-action="browse">Done</button></header><div class="arc-settings-scroller"><div class="arc-settings-group">' +
      settingRow(
        "monitor",
        "Connect with computer",
        "",
        "devices",
        "Profiles, Spaces, and tabs",
      ) +
      '</div><div class="arc-settings-group">' +
      settingRow("moon", "Appearance", themeNames[state.theme], "theme") +
      settingRow("globe", "Search engine", "Google", "search") +
      settingRow(
        "lock",
        "Your Profiles",
        profiles[state.profile].name,
        "profiles",
      ) +
      '</div><div class="arc-settings-group"><div class="arc-settings-row"><span class="arc-setting-icon">' +
      svg("keyboard") +
      '</span><span class="arc-setting-copy">Auto-open keyboard</span><button role="switch" class="arc-setting-toggle" data-mobile-action="toggle-keyboard" aria-label="Auto-open keyboard" aria-checked="' +
      state.keyboard +
      '"></button></div>' +
      settingRow(
        "archive",
        "Archive",
        "On this device",
        "archive",
        "Local browser-state recovery",
      ) +
      '</div><p class="arc-private-note">Your settings. Your way. Cookies and site storage stay on each device.</p></div></section>'
    );
  }
  function devices() {
    return (
      '<section class="arc-sheet">' +
      sheetHead("Your connection.", "CRESCENT HUB · YOUR CONNECTION") +
      '<div class="arc-device-plan"><strong>Your tabs.<br>From desk to pocket.</strong><div class="arc-device-graphic">' +
      svg("monitor") +
      "<span>YOUR PERSONAL HUB</span>" +
      svg("phone") +
      "</div><p>Your computer holds the connection. Your phone picks up the Profiles, Spaces, and tabs you choose to carry.</p><p>Explore the connection between your computer and your phone.</p><p>Cookies and site storage stay local.</p></div></section>"
    );
  }
  function archive() {
    return (
      '<section class="arc-sheet">' +
      sheetHead("Archive", "ON THIS DEVICE") +
      '<div class="arc-device-plan"><strong>A little room<br>to come back.</strong><p>A place for recently closed tabs. Local recovery stays separate from cross-device continuity.</p></div></section>'
    );
  }
  function syncDesktop() {
    const p = profiles[state.profile];
    document
      .querySelectorAll(".browser:not([data-showcase-browser]) .space-title")
      .forEach((el) => (el.innerHTML = "<i></i>" + p.spaces[state.space]));
    document.querySelectorAll(".browser:not([data-showcase-browser])").forEach((browser) => {
      const rows = browser.querySelectorAll(".tab-row:not(.faint)");
      tabs.forEach((tab, index) => {
        if (rows[index])
          rows[index].innerHTML =
            logo(tab.service) + "<span>" + tab.title + "</span>";
      });
    });
  }
  function renderMobile() {
    const views = {
      browse,
      share: ()=>shareView(false),
      "pin-profile": ()=>shareView(true),
      tabs: deck,
      spaces,
      profiles: profilesView,
      search,
      settings,
      devices,
      archive,
    };
    document.querySelectorAll(".arc-mobile-app").forEach((el) => {
      el.dataset.view = state.view;
      el.innerHTML = views[state.view]();
    });
    document
      .querySelectorAll("[data-mobile-view]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.mobileView === state.view),
        ),
      );
    document.querySelectorAll(".mobile-state-tag").forEach(
      (el) =>
        (el.textContent = {
          browse: "01 / Read here. Keep it in your Profile.",
          tabs: "02 / Your open tabs, as a stack",
          spaces: "03 / The same Profile. The same Spaces.",
          profiles: "04 / A Profile for each part of your day",
          search: "05 / A search sheet within reach",
          settings: "06 / Simple, familiar settings",
          devices: "07 / Your desktop connection",
          archive: "08 / Local browser recovery",
        }[state.view]),
    );
    const story=state.pinNotice?'pin-success':state.view;
    document.querySelectorAll('[data-mobile-story-state]').forEach(el=>{el.textContent={browse:'Reading on '+tabs[state.tab].domain,share:'Share the page', 'pin-profile':'Choose a Profile in your account','pin-success':'Pinned successfully',tabs:'Your open tabs',spaces:'Your Spaces, together',profiles:'A Profile for every part of your day',search:'Find your next page',settings:'Make it yours',devices:'Your devices',archive:'Your local archive'}[story];});
    document.querySelectorAll('[data-story-step]').forEach(el=>{if(el.dataset.storyStep===story)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    root.dataset.mobileStoryStep=story;
    syncDesktop();
  }
  document.addEventListener("click", (event) => {
    const view = event.target.closest("[data-mobile-view]");
    if (view) {
      document.dispatchEvent(new Event("crescent-preview-interact"));
      state.pinNotice = false;
      state.view = view.dataset.mobileView;
      renderMobile();
      return;
    }
    const button = event.target.closest("[data-mobile-action]");
    if (!button) return;
    document.dispatchEvent(new Event("crescent-preview-interact"));
    const originPhone=button.closest(".phone-unit");
    const action = button.dataset.mobileAction;
    state.pinNotice = false;
    if (
      [
        "browse",
        "tabs",
        "spaces",
        "profiles",
        "search",
        "settings",
        "devices",
        "archive",
      ].includes(action)
    )
      state.view = action;
    else if (action === "share") state.view="share";
    else if (action === "choose-pin-profile") state.view="pin-profile";
    else if (action === "pin-to-profile") pinPage(button.dataset.pinProfile);
    else if (action === "pin") {
      const index=state.pins[state.profile].findIndex(pin=>pin.tab===state.tab);
      if(index<0)state.pins[state.profile].push({tab:state.tab,space:state.space});
      else state.pins[state.profile].splice(index,1);
      state.pinNotice=true;
      state.view="browse";
    } else if (action === "profile") {
      state.profile = button.dataset.profile;
      state.space = 0;
      state.folder = null;
      state.view = "spaces";
    } else if (action === "space") {
      state.space = Number(button.dataset.space);
      state.folder = null;
      state.view = "spaces";
    } else if (action === "folder")
      state.folder =
        state.folder === Number(button.dataset.folderIndex)
          ? null
          : Number(button.dataset.folderIndex);
    else if (action === "open-tab") {
      state.tab = Number(button.dataset.tab);
      state.view = "browse";
    } else if (action === "select-card") {
      state.tab = Number(button.dataset.tab);
      state.view = "tabs";
    } else if (action === "toggle-keyboard") state.keyboard = !state.keyboard;
    else if (action === "key") {
      state.query =
        button.dataset.key === "backspace"
          ? state.query.slice(0, -1)
          : state.query + button.dataset.key;
    } else if (action === "theme") {
      state.view = "settings";
      document
        .querySelector("#try-themes")
        .scrollIntoView({ behavior: "smooth", block: "center" });
      document
        .querySelector("[data-native-theme-button][aria-checked=true]")
        .focus({ preventScroll: true });
    }
    renderMobile();
    if(event.detail===0 && originPhone){
      const focusTarget=action==="share" ? '[data-mobile-action="choose-pin-profile"]' : action==="choose-pin-profile" ? '[data-pin-profile]' : action==="pin-to-profile" ? '[data-mobile-action="share"]' : null;
      if(focusTarget)originPhone.querySelector(focusTarget)?.focus({preventScroll:true});
    }
  });
  document.addEventListener("input", (event) => {
    if (!event.target.matches(".arc-search-input input")) return;
    state.query = event.target.value;
    document
      .querySelectorAll(".arc-search-results")
      .forEach((el) => (el.innerHTML = results()));
    document.querySelectorAll(".arc-search-input input").forEach((el) => {
      if (el !== event.target) el.value = state.query;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.target.matches(".arc-search-input input") &&
      event.key === "Enter"
    ) {
      state.view = "browse";
      renderMobile();
    }
  });
  let swipe = null;
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".deck-stage"))
      swipe = { x: event.clientX, y: event.clientY };
  });
  document.addEventListener("pointerup", (event) => {
    if (!swipe) return;
    const dx = event.clientX - swipe.x,
      dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy)) {
      state.tab = (state.tab + (dx < 0 ? 1 : 2)) % 3;
      state.view = "tabs";
      renderMobile();
    }
  });
  const dialog = document.querySelector("#mobile-dialog"),
    mount = document.querySelector("#mobile-dialog-mount");
  document.querySelectorAll("[data-inspect-mobile]").forEach((button) =>
    button.addEventListener("click", () => {
      const source = document.querySelector(".concept-stage .phone-unit");
      mount.replaceChildren(source.cloneNode(true));
      applyTheme();
      renderMobile();
      dialog.showModal();
    }),
  );
  dialog
    .querySelector(".mobile-modal-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      event.clientX < r.left ||
      event.clientX > r.right ||
      event.clientY < r.top ||
      event.clientY > r.bottom
    )
      dialog.close();
  });
  document.addEventListener("crescent-preview-select", event => {
    const view=event.detail?.view;
    if(!['browse','share','pin-profile','pin-success','tabs','spaces','profiles','search','settings'].includes(view))return;
    state.pinNotice=false;
    if(view==='pin-success')pinPage('personal');
    else state.view=view;
    renderMobile();
  });
  applyTheme();
  renderMobile();
})();
