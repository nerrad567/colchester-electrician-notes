"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Opens a single SSE connection to /api/posts/stream.
 * Server pushes when published posts change — no client-side polling.
 */
export function RefreshListener() {
  const router = useRouter();

  useEffect(() => {
    const es = new EventSource("/api/posts/stream");
    es.onmessage = () => router.refresh();
    return () => es.close();
  }, [router]);

  return null;
}
