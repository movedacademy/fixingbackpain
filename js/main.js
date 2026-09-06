(() => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const applyModal = document.getElementById("apply-modal");
  const videoModal = document.getElementById("video-modal");
  const videoFrame = document.getElementById("method-video");
  const METHOD_VIDEO = "https://www.youtube-nocookie.com/embed/4H5tdaAvLyk?autoplay=1&rel=0";

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-open-apply]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const href = el.getAttribute("href");
      if (href === "#apply" && window.matchMedia("(min-width: 980px)").matches) {
        return;
      }
      if (el.tagName === "A") event.preventDefault();
      openModal(applyModal);
    });
  });

  document.querySelectorAll("[data-open-video]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      if (videoFrame) videoFrame.src = METHOD_VIDEO;
      openModal(videoModal);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((el) => {
    el.addEventListener("click", () => closeModals());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModals();
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("is-open");
    document.body.classList.add("is-locked");
    const focusable = modal.querySelector("button, input, textarea, [href]");
    focusable?.focus();
  }

  function closeModals() {
    applyModal?.classList.remove("is-open");
    videoModal?.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    if (videoFrame) videoFrame.src = "";
  }

  document.querySelectorAll(".faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector("button")?.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const applySection = document.getElementById("apply");
  const mobileBar = document.querySelector(".mobile-bar");
  if (applySection && mobileBar && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        mobileBar.classList.toggle("is-hidden", entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(applySection);
  }

  document.querySelectorAll("form[data-assessment-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const story = String(data.get("story") || "").trim();
      const tried = data.getAll("tried").join(", ");

      if (!name || !email) return;

      const subject = encodeURIComponent("Fixing Back Pain For Good — Assessment request");
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nAlready tried: ${tried || "Not listed"}\n\nWhat's going on:\n${story || "(not provided)"}`
      );

      const card = form.closest(".apply-card, .modal__panel");
      form.classList.add("is-sent");
      card?.querySelector(".form-success")?.classList.add("is-visible");

      window.location.href = `mailto:info@richardaceves.com?subject=${subject}&body=${body}`;
    });
  });
})();
