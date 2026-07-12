// Til almashtirish, mobil menyu va smooth scroll
(function () {
  const LANG_KEY = "b5somsa_lang";
  const THEME_KEY = "b5somsa_theme";
  const supportedLangs = ["uz", "ru", "en"];

  function applyLanguage(lang) {
    if (!supportedLangs.includes(lang)) lang = "uz";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = translations[lang][key];
      if (value !== undefined) {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = translations[lang][key];
      if (value !== undefined) {
        el.setAttribute("placeholder", value);
      }
    });

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    localStorage.setItem(LANG_KEY, lang);
  }

  function initLanguage() {
    const saved = localStorage.getItem(LANG_KEY);
    const initial = supportedLangs.includes(saved) ? saved : "uz";
    applyLanguage(initial);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyLanguage(btn.getAttribute("data-lang"));
        closeMobileMenu();
      });
    });
  }

  function initTheme() {
    const toggle = document.querySelector(".theme-toggle");
    const saved = localStorage.getItem(THEME_KEY);

    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }

    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const current = document.documentElement.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  function closeMobileMenu() {
    const nav = document.querySelector(".nav-links");
    const toggle = document.querySelector(".menu-toggle");
    if (nav) nav.classList.remove("open");
    if (toggle) toggle.classList.remove("open");
  }

  function initMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav-links");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId.length <= 1) return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function initActiveNavOnScroll() {
    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLanguage();
    initMobileMenu();
    initSmoothScroll();
    initActiveNavOnScroll();
  });
})();
