import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  readTime: string;
  techNote?: string;
  content: string;
}

const contentDir = path.join(process.cwd(), "src/content/posts");

/**
 * Read all .mdx files from the content directory,
 * parse frontmatter, return sorted by file order (newest first).
 */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const filePath = path.join(contentDir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      slug: data.slug ?? filename.replace(/\.mdx$/, ""),
      title: data.title ?? "",
      kicker: data.kicker ?? "",
      excerpt: data.excerpt ?? "",
      readTime: data.readTime ?? "",
      techNote: data.techNote ?? undefined,
      content,
    };
  });
}

/**
 * Get a single post by slug.
 */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * Get all slugs for static generation.
 */
export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

// Re-export for backward compat while MDX files are being created
// Falls back to hardcoded data if no .mdx files exist yet
const fallbackPosts: Omit<Post, "content">[] = [
  {
    slug: "tn-s-service-head-pme-street",
    title: 'TN-S at the service head\u2026 PME in the street? Why both can be "true" (and when it matters)',
    kicker: "Earthing \u00b7 EICR \u00b7 Outbuildings \u00b7 EV charging",
    excerpt: 'Why an intake can present TN-S while guidance still says "treat it as PME" for exported earth.',
    readTime: "~9 min read",
  },
  {
    slug: "meter-box-ev-charger-wiring",
    title: "Why you shouldn\u2019t put customer wiring inside a meter box",
    kicker: "Meter boxes \u00b7 EV charging \u00b7 BS 7671",
    excerpt: "Why meter boxes aren\u2019t accepted as customer wiring spaces, and the clean fix.",
    readTime: "~7 min read",
  },
  {
    slug: "eicr-in-colchester",
    title: "What actually happens on an EICR in Colchester?",
    kicker: "EICR \u00b7 Colchester",
    excerpt: "Here\u2019s what I actually do on site: the walk-through, safe isolation, proper circuit testing.",
    readTime: "~6 min read",
  },
  {
    slug: "dmx-stage-lighting-colchester",
    title: "DMX stage lighting faults in a Colchester public building",
    kicker: "DMX lighting \u00b7 Public building",
    excerpt: "Fault-finding possessed stage lights: intermittent DMX, lost addresses and a control desk.",
    readTime: "~8 min read",
  },
  {
    slug: "tripping-rcd-terrace-colchester",
    title: "A tripping RCD in a Colchester terrace \u2013 where the fault actually was",
    kicker: "Fault finding \u00b7 Terraced house",
    excerpt: "One 30\u00a0mA RCD covering most sockets, with outside loads tipping it over.",
    readTime: "~7 min read",
  },
  {
    slug: "consumer-unit-failures-colchester",
    title: "Your consumer unit looks fine \u2014 why the EICR still flagged it",
    kicker: "Consumer units \u00b7 EICR \u00b7 Colchester",
    excerpt: "A fuseboard can look tidy and still be flagged. What the codes actually mean.",
    readTime: "~10 min read",
  },
];

/**
 * Get posts — uses MDX files if they exist, falls back to hardcoded data.
 */
export function getPosts(): Omit<Post, "content">[] {
  const mdxPosts = getAllPosts();
  if (mdxPosts.length > 0) return mdxPosts;
  return fallbackPosts;
}

// Default export for backward compatibility
export const posts = fallbackPosts;
