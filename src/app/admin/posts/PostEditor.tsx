"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Undo,
  Redo,
  Save,
  Eye,
  Loader2,
} from "lucide-react";

interface PostData {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  body: string;
  tech_note: string;
  read_time: string;
  published: boolean;
}

export function PostEditor({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PostData>({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    kicker: initial?.kicker ?? "",
    excerpt: initial?.excerpt ?? "",
    body: initial?.body ?? "",
    tech_note: initial?.tech_note ?? "",
    read_time: initial?.read_time ?? "",
    published: initial?.published ?? false,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
      Placeholder.configure({ placeholder: "Start writing your article..." }),
    ],
    content: form.body,
    onUpdate: ({ editor: e }) => {
      setForm((prev) => ({ ...prev, body: e.getHTML() }));
    },
    editorProps: {
      attributes: {
        class: "article-body outline-none min-h-[300px]",
      },
    },
  });

  function update(field: keyof PostData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function slugify(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
  }

  async function handleSave(publish?: boolean) {
    setSaving(true);
    const data = { ...form, published: publish ?? form.published };
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      router.push("/admin");
      router.refresh();
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function addLink() {
    const url = prompt("Link URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/admin")}
          className="text-[0.78rem] text-muted hover:text-text transition-colors"
        >
          &larr; Back to admin
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-[0.78rem] text-muted transition-colors hover:border-accent-border hover:text-text disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save draft
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-accent to-accent-strong px-4 py-2 text-[0.82rem] font-semibold text-[#111827] transition-all hover:-translate-y-px disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            Publish
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left — Editor */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-panel/50 p-5">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    update("title", e.target.value);
                    if (!initial) update("slug", slugify(e.target.value));
                  }}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.88rem] text-text outline-none focus:border-accent-border"
                  placeholder="Article title"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.84rem] text-text outline-none focus:border-accent-border"
                    placeholder="url-slug"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">Read time</label>
                  <input
                    type="text"
                    value={form.read_time}
                    onChange={(e) => update("read_time", e.target.value)}
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.84rem] text-text outline-none focus:border-accent-border"
                    placeholder="~5 min read"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">Kicker</label>
                <input
                  type="text"
                  value={form.kicker}
                  onChange={(e) => update("kicker", e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-[0.84rem] text-text outline-none focus:border-accent-border"
                  placeholder="EICR · Colchester"
                />
              </div>
              <div>
                <label className="mb-1 block text-[0.72rem] uppercase tracking-wider text-muted">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => update("excerpt", e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-[0.84rem] text-text outline-none focus:border-accent-border"
                  placeholder="Short summary for the article card"
                />
              </div>
            </div>
          </div>

          {/* Rich text editor */}
          <div className="rounded-xl border border-border bg-panel/50">
            {editor && (
              <div className="flex flex-wrap items-center gap-1 border-b border-border-soft px-3 py-2">
                <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><Bold size={15} /></TBtn>
                <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><Italic size={15} /></TBtn>
                <div className="mx-1 h-4 w-px bg-border" />
                <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={15} /></TBtn>
                <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={15} /></TBtn>
                <div className="mx-1 h-4 w-px bg-border" />
                <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}><List size={15} /></TBtn>
                <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={15} /></TBtn>
                <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}><Quote size={15} /></TBtn>
                <div className="mx-1 h-4 w-px bg-border" />
                <TBtn onClick={addLink} active={editor.isActive("link")}><Link2 size={15} /></TBtn>
                <div className="ml-auto flex items-center gap-1">
                  <TBtn onClick={() => editor.chain().focus().undo().run()}><Undo size={15} /></TBtn>
                  <TBtn onClick={() => editor.chain().focus().redo().run()}><Redo size={15} /></TBtn>
                </div>
              </div>
            )}
            <div className="p-5">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Tech note */}
          <div className="rounded-xl border border-border bg-panel/50 p-5">
            <label className="mb-2 block text-[0.72rem] uppercase tracking-wider text-muted">Technical note (optional)</label>
            <textarea
              value={form.tech_note}
              onChange={(e) => update("tech_note", e.target.value)}
              rows={6}
              className="w-full resize-y rounded-lg border border-border bg-bg px-3 py-2 text-[0.84rem] leading-relaxed text-text outline-none focus:border-accent-border"
              placeholder="Technical reference content..."
            />
          </div>
        </div>

        {/* Right — Live Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-[radial-gradient(circle_at_top_left,#1e293b_0,#020617_55%,#020617_100%)] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
            <p className="mb-4 text-[0.68rem] uppercase tracking-widest text-muted">Preview</p>
            <div className="mb-4 rounded-lg border border-border bg-panel/30 p-4">
              {form.kicker && <p className="mb-1 text-[0.72rem] uppercase tracking-[0.16em] text-accent">{form.kicker}</p>}
              <h2 className="text-lg font-bold text-text">{form.title || "Untitled"}</h2>
              {form.read_time && <p className="mt-1 text-[0.75rem] text-muted">{form.read_time}</p>}
            </div>
            {/* Preview body — renders authenticated user's own editor content */}
            <div
              className="article-body max-h-[60vh] overflow-y-auto text-[0.88rem]"
              dangerouslySetInnerHTML={{
                __html: form.body || "<p style='color:var(--color-muted)'>Start typing to see preview...</p>",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TBtn({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded p-1.5 transition-colors ${active ? "bg-accent/20 text-accent" : "text-muted hover:bg-panel hover:text-text"}`}
    >
      {children}
    </button>
  );
}
