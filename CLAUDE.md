# Colchester Electrician Notes — CLAUDE.md

**Type:** client-website (see master CLAUDE.md in parent directory for full standards)

## Client Details
- **Business:** Gray Logic Electrical — NICEIC-registered electrician, field notes blog
- **Domain:** www.colchester-electrician.com
- **Contact:** Darren Gray, darren@graylogic.uk
- **Tier:** Internal (Darren's own site)

## Brand
- **Primary colour:** #fbbf24 (amber/gold accent)
- **Secondary colour:** #f97316 (orange)
- **Font:** JetBrains Mono (self-hosted WOFF2) — monospace-first technical aesthetic
- **Theme:** dark (default, with light mode toggle)
- **Background dark:** #050507 (near-black)

## Architecture
This is a **content/notes site**, not a lead-gen site. No contact form — clients book via graylogic.uk.

- **Admin dashboard** with magic link auth (Jose JWT, no passwords)
- **TipTap rich text editor** for post creation
- **Neon Postgres** database for articles
- **SSE live updates** for published articles on homepage
- **Nodemailer + Migadu SMTP** for magic link emails

## Key Routes
- `/` — Homepage with dynamic article rail
- `/posts/[slug]` — Individual article pages
- `/admin` — Protected admin dashboard (magic link auth)
- `/disclaimer` — Static disclaimer page

## Environment Variables
```
DATABASE_URL=<neon postgres connection string>
AUTH_SECRET=<JWT signing key>
ADMIN_EMAIL=darren@graylogic.uk
SMTP_HOST=smtp.migadu.com
SMTP_PORT=465
SMTP_USER=<migadu user>
SMTP_PASS=<migadu password>
```

## Project-Specific Notes
- Tone is technical, direct, no marketing fluff — real job notes from the field
- Grain filter + monospace font is a deliberate aesthetic choice
- Dark/light toggle with localStorage persistence and anti-flash script
- Force-dynamic homepage for live article updates
- Related to but separate from graylogic-web (the main electrician service site)
