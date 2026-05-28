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
