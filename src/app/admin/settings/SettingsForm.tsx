"use client";

import { useState } from "react";
import { Save, Loader2, CheckCircle } from "lucide-react";

export function SettingsForm({
  currentEmail,
  currentSessionDays,
  currentAuthorName,
  currentBusinessName,
}: {
  currentEmail: string;
  currentSessionDays: string;
  currentAuthorName: string;
  currentBusinessName: string;
}) {
  const [email, setEmail] = useState(currentEmail);
  const [days, setDays] = useState(currentSessionDays);
  const [authorName, setAuthorName] = useState(currentAuthorName);
  const [businessName, setBusinessName] = useState(currentBusinessName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_email: email,
        session_days: days,
        author_name: authorName,
        business_name: businessName,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-panel/50 p-5">
        <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">
          Admin email (magic links sent here)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.88rem] text-text outline-none focus:border-accent-border"
        />
      </div>

      <div className="rounded-xl border border-border bg-panel/50 p-5 space-y-4">
        <div>
          <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">
            Author name (shown on articles)
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.88rem] text-text outline-none focus:border-accent-border"
          />
        </div>
        <div>
          <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">
            Business name (shown on articles)
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.88rem] text-text outline-none focus:border-accent-border"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-panel/50 p-5">
        <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">
          Session duration (days)
        </label>
        <select
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.88rem] text-text outline-none focus:border-accent-border"
        >
          <option value="1">1 day</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent to-accent-strong px-4 py-2.5 text-[0.82rem] font-semibold text-on-accent transition-all hover:-translate-y-px disabled:opacity-50"
      >
        {saving ? (
          <Loader2 size={14} className="animate-spin" />
        ) : saved ? (
          <CheckCircle size={14} />
        ) : (
          <Save size={14} />
        )}
        {saved ? "Saved" : "Save settings"}
      </button>
    </div>
  );
}
