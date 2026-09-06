(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const videoModal = document.getElementById("video-modal");
  const videoFrame = document.getElementById("intro-video");
  const INTRO_VIDEO =
    "https://www.youtube-nocookie.com/embed/4VA50Fh3YYA?rel=0&modestbranding=1&autoplay=1";

  let lastFocus = null;

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Open menu");
    });
  });

  document.querySelectorAll("[data-open-video]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      lastFocus = el;
      if (videoFrame) videoFrame.src = INTRO_VIDEO;
      openModal(videoModal);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModal());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab" && videoModal?.classList.contains("is-open")) {
      trapFocus(event, videoModal);
    }
  });

  function getFocusable(modal) {
    return [...modal.querySelectorAll("button, [href], iframe, [tabindex]:not([tabindex='-1'])")].filter(
      (node) => !node.hasAttribute("disabled") && node.getAttribute("aria-hidden") !== "true"
    );
  }

  function trapFocus(event, modal) {
    const focusable = getFocusable(modal);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    document.body.classList.add("is-locked");
    const closeBtn = modal.querySelector("[data-close-modal].modal__close, .modal__close");
    closeBtn?.focus();
  }

  function closeModal() {
    if (!videoModal?.classList.contains("is-open")) return;
    videoModal.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (videoFrame) videoFrame.src = "";
    lastFocus?.focus();
  }

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const open = button.getAttribute("aria-expanded") === "true";
      item.classList.toggle("is-open", !open);
      button.setAttribute("aria-expanded", String(!open));
      if (panel) {
        if (open) panel.setAttribute("hidden", "");
        else panel.removeAttribute("hidden");
      }
    });
  });
})();
