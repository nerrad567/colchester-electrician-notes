import { neon } from "@neondatabase/serverless";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_SSE_CONNECTIONS_PER_IP = 3;
const SSE_RATE_WINDOW_MS = 60 * 1000; // 1 minute
const SSE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes — force reconnect

/**
 * SSE endpoint — client opens one connection, server pushes when
 * published posts change. Checks DB every 3s with a tiny query
 * (just count + latest timestamp, not full post data).
 */
export async function GET(req: Request) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return new Response("Service unavailable", { status: 503 });
  }

  // Rate limit SSE connections per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await rateLimit(`sse:${ip}`, MAX_SSE_CONNECTIONS_PER_IP, SSE_RATE_WINDOW_MS))) {
    return new Response("Too many connections", { status: 429 });
  }

  const sql = neon(url);
  const encoder = new TextEncoder();
  let lastHash = "";
  let interval: ReturnType<typeof setInterval>;
  let timeout: ReturnType<typeof setTimeout>;

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

      // Force close after timeout — client will auto-reconnect
      timeout = setTimeout(() => {
        controller.enqueue(encoder.encode(": timeout\n\n"));
        controller.close();
      }, SSE_TIMEOUT_MS);
    },
    cancel() {
      clearInterval(interval);
      clearTimeout(timeout);
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
