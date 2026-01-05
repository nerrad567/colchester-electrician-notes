Purpose
-------
This document gives actionable, repository-specific guidance for AI coding agents working on this project: a small static website served via GitHub Pages. Follow these notes when editing content, styling, or light client-side behavior.

**Big Picture**
- **Type:** Static website (plain HTML, CSS, JS) — no build system, no package.json.
- **Content layout:** Top-level pages such as [index.html](index.html) and [about.html](about.html). Blog-like posts are full HTML files in the `posts/` directory (for example, [posts/dmx-stage-lighting-colchester.html](posts/dmx-stage-lighting-colchester.html)).
- **Assets:** Static assets live under `assets/` (CSS in `assets/css/main.css`, JS in `assets/js/main.js`, PDFs in `assets/pdf/`).
- **Deployment:** Presence of `CNAME` indicates GitHub Pages with a custom domain (pushes to `main` -> site published).

**When you edit content**
- Edit or add full HTML files in `posts/` for new articles — follow the existing structure (copy an existing post and update title/header/meta). Example: duplicate [posts/dmx-stage-lighting-colchester.html](posts/dmx-stage-lighting-colchester.html) and update `<title>` and visible headings.
- Preserve relative paths to assets (use `/assets/...` or `assets/...` as currently used). Breaking asset paths is the most common regression.
- Maintain DOCTYPE and `<head>` metadata; don't remove the existing meta tags or viewport configuration.

**Styling & scripts**
- Global styles in [assets/css/main.css](assets/css/main.css). Prefer adding small, focused rules rather than replacing file-wide styles.
- Client JS is minimal and lives in [assets/js/main.js](assets/js/main.js). If you add functionality, keep it progressively enhanced and avoid heavyweight frameworks.

**Local preview & basic workflow**
- There is no build step. To preview locally, run a simple static server from repo root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

- Test changes by opening the files in a browser or using the static server above. For PRs, keep changes small and focused (content edits vs. layout changes separated).

**Conventions & patterns specific to this repo**
- Posts are full HTML files (not Markdown). Expect copy-paste edits and small structural HTML changes rather than a content pipeline.
- The site uses relative linking and in-place assets; do not introduce build-time asset bundling or hashed filenames without updating every reference.
- Preserve `CNAME` if present — removing or changing it will affect the custom domain.

**Safety & external dependencies**
- Avoid adding external JS or CSS CDNs unless necessary. If required, document the purpose in the PR description.

**What not to change without approval**
- Site-wide layout or the header/footer structure in `index.html` and `about.html` without an explicit UX/design sign-off.
- The `CNAME` file and root-level files that impact publishing behavior.

If anything here is unclear or you'd like additional examples (e.g., an annotated post template or a checklist for publishing changes), say which parts you want expanded and I'll update this file.
