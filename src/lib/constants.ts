export const SITE = {
  name: "Colchester Electrician Notes",
  description:
    "On-site notes from a NICEIC-registered electrician in Colchester and North Essex. Real faults, real fixes — no stock photos, no fluff.",
  url: "https://www.colchester-electrician.com",
  author: "Darren Gray",
  business: "Gray Logic Electrical",
  businessUrl: "https://www.graylogic.uk",
  locale: "en_GB",
} as const;

export const COMING_SOON = [
  {
    kicker: "Coming soon · RCDs · Older properties",
    title: "RCD vs RCBO upgrades in older Colchester homes",
    excerpt:
      "When a split-load board starts becoming a nuisance — what the options actually are, and what the regs say.",
  },
  {
    kicker: "Coming soon · Bonding · EICR",
    title: "Main bonding: what gets checked (and why it matters)",
    excerpt:
      "Gas, water, oil — what needs connecting, what doesn't, and why the EICR cares so much about 10mm².",
  },
  {
    kicker: "Coming soon · Outdoors · Fault finding",
    title: "Garden sockets & outside lights: the usual faults",
    excerpt:
      "IP ratings, buried cables, and why outdoor circuits trip the RCD more than any other.",
  },
  {
    kicker: "Coming soon · EV · Earthing",
    title: "EV chargers and earthing: what changes compared to 'normal' circuits",
    excerpt:
      "Rod electrodes, PME disconnection, and the reg that catches most installers off guard.",
  },
] as const;
