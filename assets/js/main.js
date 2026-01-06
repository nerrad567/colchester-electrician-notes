(function () {
  const THEME_STORAGE_KEY = "theme";

  const safeGetStoredTheme = () => {
    try {
      const value = window.localStorage.getItem(THEME_STORAGE_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  const safeSetStoredTheme = (theme) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage failures (private mode / blocked).
    }
  };

  const getSystemTheme = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";

  const getActiveTheme = () => {
    const explicit = document.documentElement.getAttribute("data-theme");
    if (explicit === "light" || explicit === "dark") return explicit;
    return getSystemTheme();
  };

  const applyTheme = (theme, { persist } = { persist: false }) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) safeSetStoredTheme(theme);
  };

  const storedTheme = safeGetStoredTheme();
  if (storedTheme) {
    applyTheme(storedTheme, { persist: false });
  }

  const getThemeIconSvg = (theme) => {
    // Minimal, abstract-ish icons using currentColor.
    if (theme === "dark") {
      // Moon
      return (
        '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
        '<path d="M20.6 14.6c-1 .5-2.1.8-3.3.8-4 0-7.2-3.2-7.2-7.2 0-1.2.3-2.3.8-3.3-4 .5-7.1 3.9-7.1 8 0 4.5 3.6 8.1 8.1 8.1 4.1 0 7.5-3.1 8-7.1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
      );
    }

    // Sun
    return (
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
      '<path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '</svg>'
    );
  };

  // Update footer year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Smooth scroll for internal nav links (e.g. "Read the latest notes")
  const navLinks = document.querySelectorAll(
    '.nav a[href^="#"], a.btn[href^="#"]'
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

  // Global header: Browse articles dropdown
  const headerNav = document.querySelector(".site-header .nav");
  const headerInner = document.querySelector(".site-header .site-header-inner");

  if (headerInner) {
    // Theme toggle (top-left, before logo)
    const existingToggle = headerInner.querySelector("[data-theme-toggle]");
    const themeToggle = existingToggle || document.createElement("button");

    if (!existingToggle) {
      themeToggle.type = "button";
      themeToggle.className = "theme-toggle";
      themeToggle.setAttribute("data-theme-toggle", "");
      themeToggle.setAttribute("title", "Toggle theme");

      const logo = headerInner.querySelector(".logo");
      if (logo) {
        headerInner.insertBefore(themeToggle, logo);
      } else {
        headerInner.insertBefore(themeToggle, headerInner.firstChild);
      }
    }

    const syncThemeToggleUi = () => {
      const active = getActiveTheme();
      themeToggle.innerHTML = getThemeIconSvg(active);
      themeToggle.setAttribute(
        "aria-label",
        active === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      themeToggle.setAttribute("aria-pressed", active === "dark" ? "true" : "false");
    };

    themeToggle.addEventListener("click", () => {
      const next = getActiveTheme() === "dark" ? "light" : "dark";
      applyTheme(next, { persist: true });
      syncThemeToggleUi();
    });

    syncThemeToggleUi();

    const themeQuery =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");
    if (themeQuery) {
      themeQuery.addEventListener("change", () => {
        // Only react to system changes if the user hasn't explicitly chosen.
        if (!safeGetStoredTheme()) {
          syncThemeToggleUi();
        }
      });
    }
  }

  if (headerNav) {
    const browse = document.createElement("details");
    browse.className = "nav-browse";
    browse.setAttribute("data-nav-browse", "");

    const summary = document.createElement("summary");
    summary.className = "nav-link nav-link--browse";
    summary.textContent = "Browse articles";

    const panel = document.createElement("div");
    panel.className = "nav-browse-panel";
    panel.setAttribute("role", "menu");
    panel.innerHTML =
      '<div class="nav-browse-heading">Latest posts</div>' +
      '<ul class="nav-browse-list" data-nav-browse-list><li class="nav-browse-loading">Loading…</li></ul>' +
      '<div class="nav-browse-footer"><a class="nav-browse-all" href="/index.html#articles">All articles →</a></div>';

    browse.appendChild(summary);
    browse.appendChild(panel);

    // Insert before the external link if present (keeps the CTA at the end)
    const external = headerNav.querySelector(".nav-link--accent");
    if (external) {
      headerNav.insertBefore(browse, external);
    } else {
      headerNav.appendChild(browse);
    }

    const indexUrl = new URL("/index.html", window.location.origin).toString();
    const listEl = browse.querySelector("[data-nav-browse-list]");

    const positionBrowsePanel = () => {
      if (!browse.open) return;
      if (!panel) return;

      const margin = 16; // px
      const gap = 8; // px below the trigger

      const viewportW = window.innerWidth || 0;
      const viewportH = window.innerHeight || 0;
      const triggerRect = summary.getBoundingClientRect();

      const desiredWidth = 520;
      const width = Math.max(240, Math.min(desiredWidth, viewportW - margin * 2));

      // Prefer aligning to the trigger's left edge, but clamp into viewport.
      const left = Math.min(
        Math.max(triggerRect.left, margin),
        Math.max(margin, viewportW - margin - width)
      );

      const top = Math.min(triggerRect.bottom + gap, Math.max(margin, viewportH - margin));
      const maxHeight = Math.max(180, viewportH - top - margin);

      panel.style.position = "fixed";
      panel.style.left = `${left}px`;
      panel.style.right = "auto";
      panel.style.top = `${top}px`;
      panel.style.transform = "none";
      panel.style.width = `${width}px`;
      panel.style.maxWidth = "none";
      panel.style.maxHeight = `${maxHeight}px`;
      panel.style.zIndex = "1100";
    };

    const buildListFromIndexHtml = async () => {
      if (!listEl) return;

      try {
        const res = await fetch(indexUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch index: ${res.status}`);

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const cards = Array.from(
          doc.querySelectorAll(".articles-grid .card-article")
        );
        const items = cards
          .map((card) => {
            const link = card.querySelector(".card-title a");
            if (!link) return null;

            const kicker = card.querySelector(".card-kicker");
            const href = link.getAttribute("href") || "";
            const absoluteHref = new URL(href, indexUrl).toString();

            return {
              title: (link.textContent || "").trim(),
              href: absoluteHref,
              kicker: (kicker?.textContent || "").trim(),
            };
          })
          .filter(Boolean);

        // Show a compact list (the homepage remains the full list)
        const maxItems = 8;
        const subset = items.slice(0, maxItems);

        listEl.innerHTML = "";
        subset.forEach((item) => {
          const li = document.createElement("li");
          li.className = "nav-browse-item";

          const a = document.createElement("a");
          a.className = "nav-browse-link";
          a.href = item.href;
          a.innerHTML =
            (item.kicker ? `<span class="nav-browse-kicker">${item.kicker}</span>` : "") +
            `<span class="nav-browse-title">${item.title}</span>`;

          li.appendChild(a);
          listEl.appendChild(li);
        });
      } catch (e) {
        if (listEl) {
          listEl.innerHTML =
            '<li class="nav-browse-loading">Couldn’t load articles. <a href="/index.html#articles">Open the homepage list</a>.</li>';
        }
      }
    };

    // Populate lazily when first opened
    let loaded = false;
    browse.addEventListener("toggle", () => {
      if (browse.open && !loaded) {
        loaded = true;
        buildListFromIndexHtml();
      }

      if (browse.open) {
        positionBrowsePanel();
      }
    });

    window.addEventListener("resize", () => {
      if (browse.open) positionBrowsePanel();
    });

    window.addEventListener(
      "scroll",
      () => {
        if (browse.open) positionBrowsePanel();
      },
      { passive: true }
    );

    // Close on Escape
    document.addEventListener("keydown", (evt) => {
      if (!browse.open) return;
      if (evt.key === "Escape") {
        browse.open = false;
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (evt) => {
      if (!browse.open) return;
      const target = evt.target;
      if (!(target instanceof Node)) return;
      if (!browse.contains(target)) {
        browse.open = false;
      }
    });
  }

  // Expandable technical notes (side panel)
  const noteToggles = document.querySelectorAll(".article-note-toggle");
  const closeBtn = document.querySelector(".article-note-close");
  
  const togglePanel = (expand) => {
    const note = document.querySelector(".article-note--expandable");
    const toggle = document.querySelector(".article-note-toggle");
    const icon = toggle.querySelector(".toggle-icon");
    
    if (expand) {
      // Slide in from right
      note.style.transform = "translateY(-50%)";
      toggle.setAttribute("aria-expanded", "true");
      toggle.style.zIndex = "999";
    } else {
      // Slide out to right
      note.style.transform = "translateY(-50%) translateX(100%)";
      toggle.setAttribute("aria-expanded", "false");
      toggle.style.zIndex = "1001";
    }
  };
  
  noteToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      togglePanel(!isExpanded);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      togglePanel(false);
    });
  }

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

    // Mouse wheel support: treat each wheel gesture as "advance by ~one card".
    // Keeps normal page scrolling when the rail can't scroll further.
    let wheelAccum = 0;
    track.addEventListener(
      "wheel",
      (evt) => {
        // If the user is already scrolling horizontally (trackpad), don't interfere.
        if (Math.abs(evt.deltaX) > Math.abs(evt.deltaY)) return;

        const maxScrollLeft = track.scrollWidth - track.clientWidth - 1;
        if (maxScrollLeft <= 0) return;

        wheelAccum += evt.deltaY;

        // Require a small threshold so tiny/continuous deltas don't trigger multiple jumps.
        const threshold = 35;
        if (Math.abs(wheelAccum) < threshold) return;

        const direction = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;

        const firstCard = track.querySelector(".card-article");
        const cardWidth = firstCard
          ? firstCard.getBoundingClientRect().width
          : track.clientWidth;

        const styles = window.getComputedStyle(track);
        const gap =
          parseFloat(styles.columnGap || styles.gap || "0") || 0;

        const step = Math.max(cardWidth + gap, 240);

        const canScrollRight = direction > 0 && track.scrollLeft < maxScrollLeft;
        const canScrollLeft = direction < 0 && track.scrollLeft > 0;

        if (canScrollRight || canScrollLeft) {
          evt.preventDefault();
          track.scrollBy({ left: direction * step, behavior: "smooth" });
        }
      },
      { passive: false }
    );

    // Initial state
    updateButtons();
  });
})();
