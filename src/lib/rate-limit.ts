/**
 * DB-backed rate limiter using Neon Postgres.
 * Works reliably across Vercel function instances.
 */

import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

/**
 * Check if a request should be allowed.
 * Counts hits within the window and rejects if over the limit.
 * @returns `true` if allowed, `false` if rate-limited.
 */
export async function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  const sql = getSQL();
  const windowStart = new Date(Date.now() - windowMs).toISOString();

  // Count recent hits and insert new one in a single round-trip
  const rows = await sql`
    WITH recent AS (
      SELECT count(*) AS cnt FROM rate_limits
      WHERE key = ${key} AND created_at > ${windowStart}::timestamptz
    ),
    cleanup AS (
      DELETE FROM rate_limits WHERE created_at < ${windowStart}::timestamptz
    )
    SELECT cnt FROM recent
  ` as unknown as { cnt: number }[];

  const count = Number(rows[0]?.cnt ?? 0);

  if (count >= maxRequests) {
    return false;
  }

  // Record this hit
  await sql`INSERT INTO rate_limits (key, created_at) VALUES (${key}, now())`;
  return true;
}
