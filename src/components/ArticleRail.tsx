"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ArticleRail({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const updateState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);

    // Calculate page indicators
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 0;
    const gap = 20;
    const pairWidth = cardWidth * 2 + gap;
    if (pairWidth > 0) {
      const pages = Math.ceil((el.scrollWidth - el.clientWidth) / pairWidth) + 1;
      const current = Math.round(el.scrollLeft / pairWidth);
      setTotalPages(pages);
      setCurrentPage(current);
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    const ro = new ResizeObserver(updateState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateState);
      ro.disconnect();
    };
  }, [updateState]);

  const scroll = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardWidth = card?.offsetWidth ?? el.clientWidth / 2;
    // 1 card on mobile, 2 cards on wider screens
    const isMobile = window.innerWidth < 640;
    const distance = isMobile ? cardWidth + 20 : cardWidth * 2 + 20;
    el.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  // Capture vertical wheel on the rail and convert to horizontal scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY * 2 });
      }
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  return (
    <div className="space-y-6">
      {/* Track */}
      <div
        ref={trackRef}
        className="scrollbar-hide -mx-3 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-3 py-3 lg:gap-8"
      >
        {children}
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between">
        {/* Page dots + counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentPage
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-border hover:bg-muted"
                }`}
              />
            ))}
          </div>
          {totalPages > 0 && (
            <span className="text-[0.7rem] text-muted">
              {currentPage + 1} / {totalPages}
            </span>
          )}
        </div>

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous articles"
            className="rounded-lg border border-border bg-panel/60 px-3 py-2 text-muted backdrop-blur-sm transition-all hover:border-accent-border hover:text-text disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll(1)}
            disabled={!canScrollRight}
            aria-label="Next articles"
            className="rounded-lg border border-border bg-panel/60 px-3 py-2 text-muted backdrop-blur-sm transition-all hover:border-accent-border hover:text-text disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
