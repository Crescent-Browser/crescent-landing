const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
menuToggle?.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute(
    "aria-label",
    expanded ? "Close navigation" : "Open navigation",
  );
  mobileNav.hidden = !expanded;
});
mobileNav?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.focus();
  }
});
const themes = {
  afterglow: {
    image: "afterglow-native.png",
    label: "Afterglow",
    text: "Soft color. A quieter frame. A little room to breathe.",
  },
  prism: {
    image: "prism-native.png",
    label: "Prism",
    text: "Crescent’s signature facets. A different perspective.",
  },
  meridian: {
    image: "meridian-native.png",
    label: "Meridian",
    text: "Clean lines. A gentle tint. Everything in its place.",
  },
};
const tabs = [...document.querySelectorAll("[data-theme]")];
function chooseTheme(tab) {
  tabs.forEach((button) => {
    const selected = button === tab;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  const key = tab.dataset.theme;
  const theme = themes[key];
  document.querySelector("#theme-panel").dataset.theme = key;
  document
    .querySelector("#theme-panel")
    .setAttribute("aria-labelledby", tab.id);
  const image = document.querySelector("#theme-image");
  image.src = `assets/${theme.image}`;
  image.alt = `Actual Crescent macOS development build in the ${theme.label} theme, showing a sample example.org page.`;
  document.querySelector("#theme-description").textContent = theme.text;
  const expand = document.querySelector("#theme-expand");
  expand.dataset.lightbox = image.getAttribute("src");
  expand.dataset.caption = `${theme.label} · actual macOS development build, sample example.org page`;
  expand.setAttribute("aria-label", `Enlarge ${theme.label} theme screenshot`);
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => chooseTheme(tab));
  tab.addEventListener("keydown", (event) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) %
            tabs.length;
    chooseTheme(tabs[next]);
    tabs[next].focus();
  });
});
const platforms = {
  macos: {
    name: "macOS",
    description:
      "Crescent’s macOS development app is running and has passed selected native checks. We’re still working through feature parity, security updates, packaging, and release testing before a public beta.",
    status: "Development builds tested · public beta pending",
  },
  windows: {
    name: "Windows",
    description:
      "Windows is a first-class target for Crescent Browser and the personal Hub. Builds and platform testing are still ahead; there isn’t a Windows download to install yet.",
    status: "Planned · Windows builds pending",
  },
  linux: {
    name: "Linux",
    description:
      "Linux is a first-class target for Crescent Browser and the personal Hub. Distribution packaging and native validation are still ahead; there isn’t a Linux download to install yet.",
    status: "Planned · Linux builds pending",
  },
};
const platformDialog = document.querySelector("#platform-dialog");
document.querySelectorAll("[data-platform]").forEach((button) =>
  button.addEventListener("click", () => {
    const platform = platforms[button.dataset.platform];
    document.querySelector("#platform-title").textContent =
      `Crescent for ${platform.name}`;
    document.querySelector("#platform-description").textContent =
      platform.description;
    document.querySelector("#platform-status").textContent = platform.status;
    platformDialog.showModal();
  }),
);
const imageDialog = document.querySelector("#image-dialog");
document.querySelectorAll("[data-lightbox]").forEach((button) =>
  button.addEventListener("click", () => {
    document.querySelector("#lightbox-image").src = button.dataset.lightbox;
    document.querySelector("#lightbox-image").alt = button.dataset.caption;
    document.querySelector("#lightbox-caption").textContent =
      button.dataset.caption;
    imageDialog.showModal();
  }),
);
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelector(".dialog-close")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
});
