import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllSlugs, getPostBySlug, getPosts } from "@/lib/posts";
import { SITE } from "@/lib/constants";
import { getArticleStructuredData } from "@/app/structured-data";
import { SectionAtmosphere } from "@/components/SectionAtmosphere";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/posts/${post.slug}`,
    },
  };
}

/**
 * Simple markdown to HTML — renders our own local content files only.
 * No user-generated input passes through this function.
 */
function markdownToHtml(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("### ")) return `<h3>${inline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith("## ")) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("> ")) {
        const text = trimmed.split("\n").map((l) => l.replace(/^>\s?/, "")).join(" ");
        return `<blockquote>${inline(text)}</blockquote>`;
      }
      if (trimmed.match(/^[-*] /m)) {
        const items = trimmed.split("\n").filter((l) => l.match(/^[-*] /));
        return `<ul>${items.map((li) => `<li>${inline(li.replace(/^[-*] /, ""))}</li>`).join("")}</ul>`;
      }
      if (trimmed.match(/^\d+\. /m)) {
        const items = trimmed.split("\n").filter((l) => l.match(/^\d+\. /));
        return `<ol>${items.map((li) => `<li>${inline(li.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
      }
      return `<p>${inline(trimmed.replace(/\n/g, " "))}</p>`;
    })
    .join("\n");
}

function inline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    const basicPost = getPosts().find((p) => p.slug === slug);
    if (!basicPost) notFound();

    return (
      <ArticleShell post={{ ...basicPost, slug }}>
        <p>Article content coming soon — MDX migration in progress.</p>
      </ArticleShell>
    );
  }

  return (
    <ArticleShell post={post}>
      {/* Render local markdown content as HTML */}
      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
    </ArticleShell>
  );
}

function ArticleShell({
  post,
  children,
}: {
  post: { title: string; kicker: string; readTime: string; slug: string; excerpt: string; techNote?: string };
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured data — static JSON from local content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getArticleStructuredData({
              title: post.title,
              description: post.excerpt,
              slug: post.slug,
              readTime: post.readTime,
            })
          ),
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 xl:px-16">
        <Link
          href="/#articles"
          className="mt-6 inline-flex items-center gap-1.5 text-[0.78rem] text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} /> Back to notes
        </Link>

        <header className="relative mt-4 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-panel to-panel-soft p-6 shadow-[0_2px_16px_rgba(0,0,0,0.3)] md:p-8 lg:p-10">
          <SectionAtmosphere grain={0.06} gridOpacity={0.02} glowColor="amber" glowIntensity={0.04} vignette={false} />
          <div className="relative">
            <p className="mb-2 text-[0.72rem] uppercase tracking-[0.16em] text-accent lg:text-[0.78rem]">
              {post.kicker}
            </p>
            <h1 className="mb-3 text-xl font-bold leading-tight text-text md:text-2xl lg:text-3xl">
              {post.title}
            </h1>
            <p className="text-[0.78rem] text-muted lg:text-[0.84rem]">
              {post.readTime} &middot; {SITE.author} &middot; {SITE.business}
            </p>
          </div>
        </header>

        <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_top_left,#1e293b_0,#020617_55%,#020617_100%)] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.3)] [html.light_&]:bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f8fafc_65%,#f1f5f9_100%)] md:p-8 lg:p-10 xl:p-12">
          <SectionAtmosphere grain={0.08} gridOpacity={0.02} glowColor="amber" glowIntensity={0.04} />
          <div className="article-body relative max-w-[720px]">
            {children}
          </div>

          {post.techNote && (
            <aside className="relative mt-8 rounded-lg border border-border-soft bg-panel/50 p-5 backdrop-blur-sm lg:p-6">
              <h2 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Technical note
              </h2>
              <div
                className="text-[0.84rem] leading-[1.7] text-muted"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(post.techNote) }}
              />
            </aside>
          )}

          <div className="relative mt-8 rounded-lg border border-border bg-panel/50 p-5 backdrop-blur-sm">
            <p className="text-[0.88rem] text-muted">
              Need an electrician in Colchester?{" "}
              <a
                href={SITE.businessUrl}
                target="_blank"
                rel="noreferrer"
                className="border-b border-dotted border-accent text-accent hover:border-solid"
              >
                Visit graylogic.uk
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
