import { NextRequest } from "next/server";

/**
 * Verify the request Origin header matches the expected site origin.
 * Returns true if the request is safe, false if it looks like CSRF.
 */
export function verifyCsrf(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const expected = new URL(siteUrl).origin;

  return origin === expected;
}
