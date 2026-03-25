import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getAllPostsFromDB() {
  const sql = getSQL();
  return sql.query(
    "SELECT id, slug, title, kicker, excerpt, body, tech_note, read_time, published, created_at, updated_at FROM posts ORDER BY created_at DESC"
  ) as unknown as Promise<DBPost[]>;
}

export async function getPublishedPosts() {
  const sql = getSQL();
  return sql.query(
    "SELECT id, slug, title, kicker, excerpt, read_time, created_at FROM posts WHERE published = true ORDER BY created_at DESC"
  ) as unknown as Promise<DBPost[]>;
}

export async function getPostBySlug(slug: string) {
  const sql = getSQL();
  const rows = await sql.query("SELECT * FROM posts WHERE slug = $1", [slug]) as unknown as DBPost[];
  return rows[0] ?? null;
}

export async function upsertPost(post: {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  body: string;
  tech_note: string;
  read_time: string;
  published: boolean;
}) {
  const sql = getSQL();
  return sql.query(
    `INSERT INTO posts (slug, title, kicker, excerpt, body, tech_note, read_time, published, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
     ON CONFLICT (slug) DO UPDATE SET
       title = $2, kicker = $3, excerpt = $4, body = $5, tech_note = $6,
       read_time = $7, published = $8, updated_at = now()
     RETURNING *`,
    [post.slug, post.title, post.kicker, post.excerpt, post.body, post.tech_note, post.read_time, post.published]
  );
}

export async function deletePost(slug: string) {
  const sql = getSQL();
  return sql.query("DELETE FROM posts WHERE slug = $1", [slug]);
}

// ─── Enquiries ───────────────────────────────────────────────────────────────

export async function getEnquiries() {
  const sql = getSQL();
  return sql.query(
    "SELECT * FROM enquiries ORDER BY created_at DESC"
  );
}

export async function markEnquiryRead(id: number) {
  const sql = getSQL();
  return sql.query("UPDATE enquiries SET read = true WHERE id = $1", [id]);
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function getSetting(key: string) {
  const sql = getSQL();
  const rows = await sql.query("SELECT value FROM settings WHERE key = $1", [key]) as unknown as { value: string }[];
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const sql = getSQL();
  return sql.query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, value]
  );
}

// ─── Magic Tokens (single-use enforcement) ──────────────────────────────────

export async function storeMagicToken(jti: string, expiresAt: Date) {
  const sql = getSQL();
  await sql.query(
    "INSERT INTO magic_tokens (jti, expires_at) VALUES ($1, $2)",
    [jti, expiresAt.toISOString()]
  );
}

/** Consume a token. Returns true if it existed and was unused, false otherwise. */
export async function consumeMagicToken(jti: string): Promise<boolean> {
  const sql = getSQL();
  const rows = await sql.query(
    "DELETE FROM magic_tokens WHERE jti = $1 AND consumed = false AND expires_at > now() RETURNING jti",
    [jti]
  ) as unknown as { jti: string }[];
  return rows.length > 0;
}

/** Clean up expired tokens (called opportunistically) */
export async function pruneExpiredTokens() {
  const sql = getSQL();
  await sql.query("DELETE FROM magic_tokens WHERE expires_at < now()");
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DBPost {
  id: number;
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  body: string;
  tech_note: string;
  read_time: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
