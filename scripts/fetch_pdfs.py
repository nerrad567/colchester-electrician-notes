#!/usr/bin/env python3
"""Fetch external PDF links referenced by this site.

- Scans all .html files in the repo for http(s) links ending in .pdf
- Downloads the PDFs into assets/pdf/
- Optionally rewrites the HTML to point to local /assets/pdf/<file>

Usage:
  python3 scripts/fetch_pdfs.py
  python3 scripts/fetch_pdfs.py --rewrite

Notes:
- This is a best-effort helper. Always review downloaded files and licensing.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path


PDF_URL_RE = re.compile(r"https?://[^\s\"']+?\.pdf", re.IGNORECASE)


def _iter_html_files(root: Path) -> list[Path]:
    return sorted(p for p in root.rglob("*.html") if p.is_file())


def _extract_pdf_urls(html_text: str) -> list[str]:
    return PDF_URL_RE.findall(html_text)


def _safe_filename_from_url(url: str) -> str:
    parsed = urllib.parse.urlparse(url)
    base = Path(urllib.parse.unquote(parsed.path)).name or "document.pdf"
    base = base.replace(" ", "-")
    base = re.sub(r"[^A-Za-z0-9._-]+", "", base)
    if not base.lower().endswith(".pdf"):
        base += ".pdf"
    return base or "document.pdf"


def _hash_suffix(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:10]


def _download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "colchester-electrician-notes/1.0 (+https://www.colchester-electrician.com/)"
        },
    )

    with urllib.request.urlopen(req, timeout=60) as r:
        content_type = (r.headers.get("Content-Type") or "").lower()
        data = r.read()

    # Basic sanity check: PDFs usually start with %PDF-
    if not data.startswith(b"%PDF-"):
        raise RuntimeError(
            f"Downloaded content does not look like a PDF for {url} (Content-Type: {content_type})"
        )

    dest.write_bytes(data)


def _looks_like_pdf(path: Path) -> bool:
    try:
        with path.open("rb") as f:
            return f.read(5) == b"%PDF-"
    except OSError:
        return False


def _repo_root() -> Path:
    # scripts/ is at repo-root/scripts; go up one
    return Path(__file__).resolve().parents[1]


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Fetch external PDF links into assets/pdf")
    parser.add_argument(
        "--rewrite",
        action="store_true",
        help="Rewrite HTML links to local /assets/pdf/... after downloading",
    )
    args = parser.parse_args(argv)

    root = _repo_root()
    out_dir = root / "assets" / "pdf"

    html_files = _iter_html_files(root)
    url_sources: dict[str, set[Path]] = {}

    for path in html_files:
        text = path.read_text(encoding="utf-8", errors="replace")
        for url in _extract_pdf_urls(text):
            url_sources.setdefault(url, set()).add(path)

    urls = sorted(url_sources)

    if not urls:
        print("No external PDF links found.")
        return 0

    print(f"Found {len(urls)} external PDF link(s).")

    url_to_local: dict[str, str] = {}
    failures: list[str] = []

    for url in urls:
        name = _safe_filename_from_url(url)
        dest = out_dir / name

        if dest.exists() and _looks_like_pdf(dest):
            url_to_local[url] = f"/assets/pdf/{dest.name}"
            continue
        elif dest.exists() and not _looks_like_pdf(dest):
            print(f"Existing file does not look like a PDF, re-downloading: {dest.relative_to(root)}")

        print(f"Downloading: {url}")
        try:
            _download(url, dest)
        except Exception as e:
            sources = ", ".join(str(p.relative_to(root)) for p in sorted(url_sources[url]))
            print(f"  ERROR: {e}\n  Referenced in: {sources}")
            failures.append(url)
            continue

        print(f"  Saved: {dest.relative_to(root)}")
        url_to_local[url] = f"/assets/pdf/{dest.name}"

    if args.rewrite and url_to_local:
        for path in html_files:
            original = path.read_text(encoding="utf-8", errors="replace")
            updated = original
            for url, local in url_to_local.items():
                updated = updated.replace(url, local)
            if updated != original:
                path.write_text(updated, encoding="utf-8")
                print(f"Rewrote links in: {path.relative_to(root)}")

    if failures:
        print("\nSome PDFs could not be downloaded (leaving those links as external):")
        for url in failures:
            print(f"- {url}")

    print("Done.")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
