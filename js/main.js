(function () {
  "use strict";

  var currentPage = window.location.pathname.split("/").pop() || "index.html";
  var navLinks = document.querySelectorAll(".nav-link");
  var menuToggle = document.querySelector(".site-menu-toggle");
  var primaryNav = document.getElementById("primaryNav");
  var accordions = document.querySelectorAll("[data-accordion]");

  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (primaryNav.classList.contains("show")) {
          primaryNav.classList.remove("show");
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "Menüyü aç");
        }
      });
    });
  }

  accordions.forEach(function (accordion) {
    var buttons = accordion.querySelectorAll(".faq-question");

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var panelId = button.getAttribute("aria-controls");
        var panel = document.getElementById(panelId);
        var isOpen = button.getAttribute("aria-expanded") === "true";

        buttons.forEach(function (otherButton) {
          var otherPanelId = otherButton.getAttribute("aria-controls");
          var otherPanel = document.getElementById(otherPanelId);

          otherButton.setAttribute("aria-expanded", "false");

          if (otherPanel) {
            otherPanel.hidden = true;
          }
        });

        if (panel && !isOpen) {
          button.setAttribute("aria-expanded", "true");
          panel.hidden = false;
        }
      });
    });
  });
})();

(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var revealElements = document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) return;

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("revealed");
    });
  }
})();

(function () {
  "use strict";

  var form = document.querySelector(".contact-form");

  if (!form) return;

  var statusEl = form.querySelector(".form-status") || (function () {
    var el = document.createElement("div");
    el.className = "form-status";
    el.setAttribute("aria-live", "polite");
    form.querySelector(".form-grid").insertBefore(el, form.querySelector(".btn"));
    return el;
  })();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var accessKey = form.querySelector("[name=\"access_key\"]");
    var btn = form.querySelector("[type=\"submit\"]");
    var originalText = btn.textContent;

    if (accessKey && accessKey.value === "WEB3FORMS_ACCESS_KEY") {
      statusEl.className = "form-status form-status--info";
      statusEl.textContent = "Web3Forms access key hen\u00fcz ayarlanmam\u0131\u015f. L\u00fctfen WEB3FORMS_ACCESS_KEY de\u011ferini ger\u00e7ek anahtar\u0131n\u0131zla de\u011fi\u015ftirin.";
      console.warn("Web3Forms: ACCESS_KEY placeholder de\u011feri ile de\u011fi\u015ftirilmedi. Form g\u00f6nderimi engellendi.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "G\u00f6nderiliyor...";

    var formData = new FormData(form);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success) {
        statusEl.className = "form-status form-status--success";
        statusEl.textContent = "Mesaj\u0131n\u0131z ba\u015far\u0131yla g\u00f6nderildi. En k\u0131sa s\u00fcrede d\u00f6n\u00fc\u015f yap\u0131lacakt\u0131r.";
        form.reset();
      } else {
        statusEl.className = "form-status form-status--error";
        statusEl.textContent = "Mesaj g\u00f6nderilirken bir sorun olu\u015ftu. L\u00fctfen daha sonra tekrar deneyin.";
      }
    })
    .catch(function () {
      statusEl.className = "form-status form-status--error";
      statusEl.textContent = "Mesaj g\u00f6nderilirken bir sorun olu\u015ftu. L\u00fctfen daha sonra tekrar deneyin.";
    })
    .finally(function () {
      btn.disabled = false;
      btn.textContent = originalText;
    });
  });
})();

(function () {
  "use strict";

  var toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  var htmlEl = document.documentElement;
  var icon = toggle.querySelector(".theme-toggle__icon");
  var STORAGE_KEY = "site-theme";

  function getTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    var isDark = theme === "dark";
    if (isDark) {
      htmlEl.setAttribute("data-theme", "dark");
    } else {
      htmlEl.removeAttribute("data-theme");
    }
    if (icon) {
      icon.textContent = isDark ? "\u2600" : "\u263E";
    }
    toggle.setAttribute("aria-label", isDark ? "A\u00e7\u0131k modu a\u00e7" : "Koyu modu a\u00e7");
    toggle.setAttribute("aria-pressed", String(isDark));
  }

  applyTheme(getTheme());

  toggle.addEventListener("click", function () {
    var isDark = htmlEl.getAttribute("data-theme") === "dark";
    var next = isDark ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
})();
