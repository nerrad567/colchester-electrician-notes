"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Settings, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SITE } from "@/lib/constants";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin session cookie exists (httpOnly cookies aren't readable,
    // so we ping the API to check auth status)
    fetch("/api/admin/posts", { method: "GET" })
      .then((r) => setIsAdmin(r.ok))
      .catch(() => setIsAdmin(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-text hover:text-accent transition-colors">
          <span className="inline-block h-3 w-3 rounded-sm bg-accent" aria-hidden="true" />
          {SITE.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-xs text-muted md:flex">
          <Link href="/" className="hover:text-text transition-colors">Home</Link>
          <Link href="/about" className="hover:text-text transition-colors">About</Link>
          <Link href="/disclaimer" className="hover:text-text transition-colors">Disclaimer</Link>
          <a href={SITE.businessUrl} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
            graylogic.uk
          </a>
          {isAdmin && (
            <>
              <Link href="/admin" className="flex items-center gap-1 text-accent hover:text-accent-strong transition-colors">
                <LayoutDashboard size={12} /> Admin
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-1 text-accent hover:text-accent-strong transition-colors">
                <Settings size={12} /> Settings
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-muted hover:text-text transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-border bg-bg px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-muted">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-text transition-colors">Home</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-text transition-colors">About</Link>
            <Link href="/disclaimer" onClick={() => setMenuOpen(false)} className="hover:text-text transition-colors">Disclaimer</Link>
            <a href={SITE.businessUrl} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
              graylogic.uk
            </a>
            {isAdmin && (
              <>
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-accent hover:text-accent-strong transition-colors">
                  <LayoutDashboard size={14} /> Admin
                </Link>
                <Link href="/admin/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-accent hover:text-accent-strong transition-colors">
                  <Settings size={14} /> Settings
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
