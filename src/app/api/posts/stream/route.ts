import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

/**
 * SSE endpoint — client opens one connection, server pushes when
 * published posts change. Checks DB every 3s with a tiny query
 * (just count + latest timestamp, not full post data).
 */
export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return new Response("DATABASE_URL not set", { status: 500 });
  }

  const sql = neon(url);
  const encoder = new TextEncoder();
  let lastHash = "";
  let interval: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(": connected\n\n"));

      // Get initial state
      const rows = await sql`
        SELECT COUNT(*)::int AS count, MAX(updated_at)::text AS latest
        FROM posts WHERE published = true
      `;
      lastHash = `${rows[0].count}-${rows[0].latest}`;

      // Check for changes every 3s
      interval = setInterval(async () => {
        try {
          const rows = await sql`
            SELECT COUNT(*)::int AS count, MAX(updated_at)::text AS latest
            FROM posts WHERE published = true
          `;
          const hash = `${rows[0].count}-${rows[0].latest}`;

          if (hash !== lastHash) {
            lastHash = hash;
            controller.enqueue(encoder.encode("data: updated\n\n"));
          }
        } catch {
          // DB error — skip this check
        }
      }, 3_000);
    },
    cancel() {
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
