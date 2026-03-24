export interface Post {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  readTime: string;
}

// Ordered newest first — matches the current site
export const posts: Post[] = [
  {
    slug: "tn-s-service-head-pme-street",
    title:
      'TN-S at the service head\u2026 PME in the street? Why both can be "true" (and when it matters)',
    kicker: "Earthing \u00b7 EICR \u00b7 Outbuildings \u00b7 EV charging",
    excerpt:
      'Why an intake can present TN-S while guidance still says "treat it as PME" for exported earth. Covers hybrid networks, EICR recording vs outdoor touch risk, metal outbuildings and EV charging.',
    readTime: "~9 min read",
  },
  {
    slug: "meter-box-ev-charger-wiring",
    title: "Why you shouldn\u2019t put customer wiring inside a meter box",
    kicker: "Meter boxes \u00b7 EV charging \u00b7 BS 7671",
    excerpt:
      "Why meter boxes aren\u2019t accepted as customer wiring spaces (industry guidance), where BS 7671 becomes relevant (basic protection, terminations, enclosure use), and the clean fix: fit a separate adjacent enclosure.",
    readTime: "~7 min read",
  },
  {
    slug: "eicr-in-colchester",
    title: "What actually happens on an EICR in Colchester?",
    kicker: "EICR \u00b7 Colchester",
    excerpt:
      '\u201cWe just need an EICR.\u201d Here\u2019s what I actually do on site: the walk-through, safe isolation, proper circuit testing, and how the codes get decided in older Colchester properties.',
    readTime: "~6 min read",
  },
  {
    slug: "dmx-stage-lighting-colchester",
    title: "DMX stage lighting faults in a Colchester public building",
    kicker: "DMX lighting \u00b7 Public building",
    excerpt:
      'Fault-finding "possessed" stage lights: intermittent DMX, lost addresses and a control desk that kept forgetting its show. Includes the control-side fixes and the BS 7671 segregation issues found in the AV wiring.',
    readTime: "~8 min read",
  },
  {
    slug: "tripping-rcd-terrace-colchester",
    title:
      "A tripping RCD in a Colchester terrace \u2013 where the fault actually was",
    kicker: "Fault finding \u00b7 Terraced house",
    excerpt:
      'A "just change the breaker" call-out in a typical Colchester terrace: one 30\u00a0mA RCD covering most sockets, with outside loads tipping it over. How we tracked down the real leakage source \u2014 and why the RCD itself wasn\u2019t the villain.',
    readTime: "~7 min read",
  },
  {
    slug: "consumer-unit-failures-colchester",
    title:
      "Your consumer unit looks fine \u2014 why the EICR still flagged it",
    kicker: "Consumer units \u00b7 EICR \u00b7 Colchester",
    excerpt:
      "A fuseboard can look tidy and still be flagged (sometimes with a C2). What the EICR codes actually mean, common board-related reasons, landlord implications, and when a replacement recommendation is genuinely justified.",
    readTime: "~10 min read",
  },
];
