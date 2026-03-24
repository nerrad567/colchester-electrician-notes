/**
 * One-off script to seed "coming soon" placeholders into the DB as draft posts.
 * Run with: npx tsx scripts/seed-drafts.ts
 */
import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

// Load .env.local manually (no dotenv dependency)
const envFile = readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
}

const drafts = [
  {
    slug: "rcd-rcbo-upgrades-older-homes",
    title: "RCD vs RCBO upgrades in older Colchester homes",
    kicker: "RCDs · Older properties",
    excerpt:
      "When a split-load board starts becoming a nuisance — what the options actually are, and what the regs say.",
    body: "",
    tech_note: "",
    read_time: "",
    published: false,
  },
  {
    slug: "main-bonding-what-gets-checked",
    title: "Main bonding: what gets checked (and why it matters)",
    kicker: "Bonding · EICR",
    excerpt:
      "Gas, water, oil — what needs connecting, what doesn't, and why the EICR cares so much about 10mm².",
    body: "",
    tech_note: "",
    read_time: "",
    published: false,
  },
  {
    slug: "garden-sockets-outside-lights-faults",
    title: "Garden sockets & outside lights: the usual faults",
    kicker: "Outdoors · Fault finding",
    excerpt:
      "IP ratings, buried cables, and why outdoor circuits trip the RCD more than any other.",
    body: "",
    tech_note: "",
    read_time: "",
    published: false,
  },
  {
    slug: "ev-chargers-earthing",
    title: "EV chargers and earthing: what changes compared to 'normal' circuits",
    kicker: "EV · Earthing",
    excerpt:
      "Rod electrodes, PME disconnection, and the reg that catches most installers off guard.",
    body: "",
    tech_note: "",
    read_time: "",
    published: false,
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const sql = neon(url);

  for (const draft of drafts) {
    await sql.query(
      `INSERT INTO posts (slug, title, kicker, excerpt, body, tech_note, read_time, published, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
       ON CONFLICT (slug) DO NOTHING`,
      [draft.slug, draft.title, draft.kicker, draft.excerpt, draft.body, draft.tech_note, draft.read_time, draft.published]
    );
    console.log(`✓ Seeded draft: ${draft.slug}`);
  }

  console.log("\nDone — 4 drafts seeded.");
}

main().catch(console.error);
