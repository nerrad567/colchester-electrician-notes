"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function LoginForm({
  error,
}: {
  error?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    error ? "error" : "idle"
  );

  async function handleLogin() {
    setStatus("sending");
    try {
      const res = await fetch("/api/admin/login", { method: "POST" });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-panel p-8 text-center shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <Mail className="h-6 w-6 text-accent" />
        </div>

        <h1 className="mb-2 text-lg font-bold text-text">Admin Login</h1>

        <p className="mb-6 text-[0.84rem] text-muted">
          We&apos;ll send a login link to the configured admin email.
        </p>

        {status === "idle" && (
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-gradient-to-br from-accent to-accent-strong px-4 py-3 text-[0.84rem] font-semibold text-[#111827] transition-all hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(248,181,0,0.4)]"
          >
            Send login link
          </button>
        )}

        {status === "sending" && (
          <div className="flex items-center justify-center gap-2 py-3 text-[0.84rem] text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </div>
        )}

        {status === "sent" && (
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
            <CheckCircle className="mx-auto mb-2 h-5 w-5 text-accent" />
            <p className="text-[0.84rem] text-text">Check your inbox</p>
            <p className="mt-1 text-[0.78rem] text-muted">
              Click the link in the email to log in. It expires in 15 minutes.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <AlertCircle className="mx-auto mb-2 h-5 w-5 text-red-400" />
            <p className="text-[0.84rem] text-text">
              {error === "invalid-token"
                ? "Link expired or invalid"
                : error === "missing-token"
                  ? "Invalid login link"
                  : "Something went wrong"}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-[0.78rem] text-accent hover:underline"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
