import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getPublishedPosts, getSetting } from "@/lib/db";
import { SITE } from "@/lib/constants";
import { sanitize } from "@/lib/sanitize";
import { getArticleStructuredData } from "@/app/structured-data";
import { SectionAtmosphere } from "@/components/SectionAtmosphere";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return {};

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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || !post.published) notFound();

  const authorName = (await getSetting("author_name").catch(() => null)) ?? SITE.author;
  const businessName = (await getSetting("business_name").catch(() => null)) ?? SITE.business;

  return (
    <ArticleShell
      post={{
        title: post.title,
        kicker: post.kicker,
        readTime: post.read_time,
        slug: post.slug,
        excerpt: post.excerpt,
        techNote: post.tech_note,
      }}
      authorName={authorName}
      businessName={businessName}
    >
      <div dangerouslySetInnerHTML={{ __html: sanitize(post.body) }} />
    </ArticleShell>
  );
}

function ArticleShell({
  post,
  authorName,
  businessName,
  children,
}: {
  post: { title: string; kicker: string; readTime: string; slug: string; excerpt: string; techNote?: string };
  authorName: string;
  businessName: string;
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
          <SectionAtmosphere grain={0.10} gridOpacity={0.04} glowColor="amber" glowIntensity={0.06} vignette={false} />
          <div className="relative">
            <p className="mb-2 text-[0.72rem] uppercase tracking-[0.16em] text-accent lg:text-[0.78rem]">
              {post.kicker}
            </p>
            <h1 className="mb-3 text-xl font-bold leading-tight text-text md:text-2xl lg:text-3xl">
              {post.title}
            </h1>
            <p className="text-[0.78rem] text-muted lg:text-[0.84rem]">
              {post.readTime} &middot; {authorName} &middot; {businessName}
            </p>
          </div>
        </header>

        <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-[radial-gradient(circle_at_top_left,#1e293b_0,#020617_55%,#020617_100%)] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.3)] [html.light_&]:bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f8fafc_65%,#f1f5f9_100%)] md:p-8 lg:p-10 xl:p-12">
          <SectionAtmosphere grain={0.12} gridOpacity={0.04} glowColor="amber" glowIntensity={0.07} />
          <div className="article-body relative max-w-[720px]">
            {children}
          </div>

          {post.techNote && (
            <aside className="relative mt-8 rounded-lg border border-border-soft bg-panel/50 p-5 backdrop-blur-sm lg:p-6">
              <h2 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent">
                Technical note
              </h2>
              <div
                className="tech-note-body"
                dangerouslySetInnerHTML={{ __html: sanitize(post.techNote) }}
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
