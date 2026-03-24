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
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { DBPost } from "@/lib/db";

export function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [posts, setPosts] = useState<DBPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<DBPost | null>(null);

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

  async function handleTogglePublish(post: DBPost) {
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, published: !post.published }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p.slug === post.slug ? { ...p, published: !p.published } : p
        )
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: deleteTarget.slug }),
    });
    setPosts((prev) => prev.filter((p) => p.slug !== deleteTarget.slug));
    setDeleteTarget(null);
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
                    <button
                      onClick={() => handleTogglePublish(post)}
                      title={post.published ? "Click to unpublish" : "Click to publish"}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium transition-all ${
                        post.published
                          ? "border-accent/30 bg-accent/10 text-accent hover:border-accent/60 hover:bg-accent/25"
                          : "border-border bg-muted/10 text-muted hover:border-muted hover:bg-muted/20"
                      }`}
                    >
                      {post.published ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
                          Live
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
                          Draft
                        </>
                      )}
                    </button>
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
                    onClick={() => setDeleteTarget(post)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this post?"
        message={deleteTarget ? `"${deleteTarget.title}" will be permanently removed.` : ""}
        advice={
          deleteTarget?.published
            ? "This post is currently live on your site. Deleting it will immediately remove it — any existing links to this article will show a 404 page."
            : "This is a draft and hasn't been published. No visitors will be affected."
        }
        confirmLabel="Delete permanently"
        cancelLabel="Keep post"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
