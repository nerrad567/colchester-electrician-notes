(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Smooth scroll for internal links
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (evt) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.charAt(0) !== "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      evt.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
