"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  LogOut,
  FileText,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import type { DBPost } from "@/lib/db";

export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setPosts([]);
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Admin</h1>
          <p className="text-[0.78rem] text-muted">{email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent to-accent-strong px-4 py-2 text-[0.82rem] font-semibold text-[#111827] transition-all hover:-translate-y-px"
          >
            <Plus size={16} /> New post
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[0.78rem] text-muted transition-colors hover:border-accent-border hover:text-text"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Posts list */}
      <div className="rounded-xl border border-border bg-panel/50">
        <div className="border-b border-border-soft px-5 py-3">
          <h2 className="flex items-center gap-2 text-[0.82rem] font-semibold text-muted-strong">
            <FileText size={16} /> Posts
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[0.84rem] text-muted">
            Loading...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-[0.84rem] text-muted">
            No posts yet.{" "}
            <Link
              href="/admin/posts/new"
              className="text-accent hover:underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-soft">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-[0.88rem] font-medium text-text">
                      {post.title}
                    </h3>
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[0.68rem] text-accent">
                        <Eye size={10} /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted/10 px-2 py-0.5 text-[0.68rem] text-muted">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[0.75rem] text-muted">
                    /{post.slug} &middot; {post.read_time || "no read time"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/posts/${post.slug}`}
                    className="rounded-lg border border-border p-2 text-muted transition-colors hover:border-accent-border hover:text-text"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    className="rounded-lg border border-border p-2 text-muted transition-colors hover:border-red-500/50 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings link */}
      <div className="mt-6">
        <Link
          href="/admin/settings"
          className="text-[0.78rem] text-muted hover:text-accent transition-colors"
        >
          Settings (email, session length)
        </Link>
      </div>
    </div>
  );
}
