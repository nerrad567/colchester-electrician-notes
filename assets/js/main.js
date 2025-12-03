(function () {
  // Update footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Smooth scroll for internal nav links (e.g. "Read the latest notes")
  const navLinks = document.querySelectorAll(
    '.site-nav a[href^="#"], a.btn[href^="#"]'
  );
  navLinks.forEach((link) => {
    link.addEventListener("click", (evt) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      evt.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Horizontal article scrollers
  const scrollers = document.querySelectorAll("[data-articles-scroller]");

  scrollers.forEach((scroller) => {
    const track = scroller.querySelector("[data-articles-track]");
    if (!track) return;

    const prevBtn = scroller.querySelector(".articles-scroll-btn--prev");
    const nextBtn = scroller.querySelector(".articles-scroll-btn--next");

    // How far to scroll: about one "page" of cards
    const getScrollAmount = () => {
      const width = track.clientWidth || 0;
      return Math.max(width * 0.8, 300); // at least one card-ish
    };

    const updateButtons = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth - 1;

      if (prevBtn) {
        prevBtn.disabled = track.scrollLeft <= 0;
      }
      if (nextBtn) {
        nextBtn.disabled = track.scrollLeft >= maxScrollLeft;
      }

      // Only show buttons at all if content overflows
      const isScrollable = track.scrollWidth > track.clientWidth + 1;
      scroller.classList.toggle("articles-scroller--scrollable", isScrollable);
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        track.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth",
        });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        track.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth",
        });
      });
    }

    track.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    // Initial state
    updateButtons();
  });
})();
