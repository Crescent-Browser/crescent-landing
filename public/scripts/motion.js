/* Reversible scroll motion and a pausable mobile preview tour. No persisted state. */
(() => {
  const root = document.querySelector(".refined-page");
  const scrollHost = document.querySelector("[data-preview-scroll]");
  function viewport() {
    return {
      height: scrollHost ? scrollHost.clientHeight : innerHeight,
      offset: scrollHost ? scrollHost.getBoundingClientRect().top : 0,
      scroll: scrollHost ? scrollHost.scrollTop : scrollY,
    };
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const hero = document.querySelector(".product-composition");
  const lab = document.querySelector(".mobile-lab-frame");
  const dialog = document.querySelector("#mobile-dialog");
  const reveals = [
    {
      element: document.querySelector(".browser-reveal"),
      scene: hero,
      hero: true,
    },
    {
      element: document.querySelector(".hero-phone-reveal"),
      scene: hero,
      hero: true,
    },
    {
      element: document.querySelector(".lab-phone-reveal"),
      scene: lab,
      hero: false,
    },
  ];
  const tour = [
    {view:'browse',dwell:3400},{view:'share',dwell:1900},
    {view:'pin-profile',dwell:2400},{view:'pin-success',dwell:2800},
    {view:'tabs',dwell:5000},{view:'spaces',dwell:5000},
    {view:'profiles',dwell:4500},{view:'search',dwell:4500},{view:'settings',dwell:4500}
  ];
  let tourIndex=0;
  let autoWanted = !reduce.matches;
  let timer = null;
  let hovered = false;
  let revealReady = false;
  let scrollFrame = null;
  root.classList.add("scroll-animated");
  root.classList.toggle("reduce-motion", reduce.matches);
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const ease = (value) => value * value * (3 - 2 * value);
  function updateButtons() {
    root.dataset.autoRotation = reduce.matches
      ? "reduced"
      : autoWanted
        ? "on"
        : "off";
    document.querySelectorAll("[data-toggle-rotation]").forEach((button) => {
      button.disabled = reduce.matches;
      button.setAttribute(
        "aria-label",
        reduce.matches
          ? "Automatic previews disabled by reduced motion preference"
          : autoWanted
            ? "Pause automatic mobile previews"
            : "Play automatic mobile previews",
      );
      button.title = reduce.matches
        ? "Reduced motion preference"
        : autoWanted
          ? "Pause mobile rotation"
          : "Play mobile rotation";
      button.querySelector(".rotation-label").textContent = autoWanted
        ? "Pause"
        : "Play";
      button.querySelector(".rotation-icon").innerHTML = autoWanted
        ? '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="3" width="3" height="10" rx=".7"/><rect x="9" y="3" width="3" height="10" rx=".7"/></svg>'
        : '<svg viewBox="0 0 16 16" fill="currentColor"><path d="m5 3 8 5-8 5z"/></svg>';
    });
  }
  function focusedOnPreview() {
    const focused = document.activeElement;
    if (
      !focused ||
      focused.closest("[data-toggle-rotation]") ||
      !focused.closest(".phone-unit,.mobile-view-controls,.theme-controls")
    )
      return false;
    const rect = focused.getBoundingClientRect();
    const view = viewport();
    return rect.bottom > view.offset && rect.top < view.offset + view.height;
  }
  function canRotate() {
    return (
      autoWanted &&
      !reduce.matches &&
      !document.hidden &&
      !hovered &&
      !focusedOnPreview() &&
      !dialog.open &&
      revealReady
    );
  }
  function syncTimer() {
    const running = canRotate();
    root.dataset.rotationRunning = String(running);
    if (!running) {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      return;
    }
    if (timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      if (!canRotate()) {
        syncTimer();
        return;
      }
      tourIndex=(tourIndex+1)%tour.length;
      const next=tour[tourIndex].view;
      document.dispatchEvent(
        new CustomEvent("crescent-preview-select", { detail: { view: next } }),
      );
      document.querySelectorAll(".arc-mobile-app").forEach((app) =>
        app.animate(
          [
            { opacity: 0.25, transform: "translateY(4px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 340, easing: "ease-out" },
        ),
      );
      root.dataset.lastAutomaticView = next;
      syncTimer();
    }, tour[tourIndex].dwell);
  }
  function updateReveal() {
    scrollFrame = null;
    const { height, offset, scroll } = viewport();
    const topGate = clamp(scroll / 100);
    revealReady = false;
    for (const item of reveals) {
      const sceneRect = item.scene.getBoundingClientRect();
      const rect = {
        top: sceneRect.top - offset,
        bottom: sceneRect.bottom - offset,
      };
      const within = clamp((height * 0.94 - rect.top) / (height * 0.34));
      const raw = reduce.matches
        ? 1
        : Math.min(within, item.hero ? topGate : 1);
      const progress = ease(raw);
      const visible = rect.bottom > 0 && rect.top < height && progress > 0.6;
      item.element.style.setProperty("--reveal-progress", progress.toFixed(4));
      item.element.dataset.revealVisible = String(visible);
      item.element.inert = progress < 0.03;
      item.element.style.pointerEvents = progress < 0.03 ? "none" : "";
      if (visible) revealReady = true;
    }
    syncTimer();
  }
  function queueReveal() {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateReveal);
  }
  document.addEventListener("crescent-preview-interact", () => {
    autoWanted = false;
    updateButtons();
    syncTimer();
  });
  document.querySelectorAll("[data-toggle-rotation]").forEach((button) =>
    button.addEventListener("click", () => {
      autoWanted = !autoWanted;
      if(autoWanted){const current=root.dataset.mobileStoryStep;const found=tour.findIndex(step=>step.view===current);tourIndex=found<0?0:found;}
      updateButtons();
      syncTimer();
    }),
  );
  function previewTarget(element) {
    return (
      element?.closest &&
      !element.closest("[data-toggle-rotation]") &&
      !!element.closest(".phone-unit,.mobile-view-controls")
    );
  }
  document.addEventListener("pointerover", (event) => {
    hovered = !!previewTarget(event.target);
    syncTimer();
  });
  document.addEventListener("pointerout", (event) => {
    hovered = !!previewTarget(event.relatedTarget);
    syncTimer();
  });
  document.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".deck-stage")) {
      autoWanted = false;
      updateButtons();
      syncTimer();
    }
  });
  document.addEventListener("focusin", syncTimer);
  document.addEventListener("focusout", () => queueMicrotask(syncTimer));
  document.addEventListener("visibilitychange", syncTimer);
  document.addEventListener("click", (event) =>
    document.querySelectorAll(".theme-options[open]").forEach((details) => {
      if (!details.contains(event.target)) details.open = false;
    }),
  );
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape")
      document.querySelectorAll(".theme-options[open]").forEach((details) => {
        details.open = false;
      });
  });
  new MutationObserver(syncTimer).observe(dialog, {
    attributes: true,
    attributeFilter: ["open"],
  });
  reduce.addEventListener("change", () => {
    root.classList.toggle("reduce-motion", reduce.matches);
    if (reduce.matches) autoWanted = false;
    updateButtons();
    queueReveal();
  });
  (scrollHost || window).addEventListener("scroll", queueReveal, {
    passive: true,
  });
  addEventListener("resize", queueReveal, { passive: true });
  addEventListener("load", queueReveal, { once: true });
  document.fonts.ready.then(queueReveal);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(queueReveal);
    observer.observe(hero);
    observer.observe(lab);
  }
  updateButtons();
  updateReveal();
})();
