import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next";
import { posts } from "@/lib/posts";
import { SITE } from "@/lib/constants";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-[920px] px-4">
      {/* Article header */}
      <div className="mt-5 rounded-[14px] border border-border bg-gradient-to-br from-panel to-panel-soft p-5 shadow-[0_0_0_1px_#050509,0_16px_32px_rgba(0,0,0,0.9)]">
        <p className="mb-1 text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          {post.kicker}
        </p>
        <h1 className="mb-2 text-[1.7rem] font-bold leading-tight text-text">
          {post.title}
        </h1>
        <p className="text-[0.78rem] text-muted">
          {post.readTime} &middot; {SITE.author} &middot; {SITE.business}
        </p>
      </div>

      {/* Article body — MDX content will go here */}
      <div className="mt-4 rounded-[14px] border border-border bg-[radial-gradient(circle_at_top_left,#1e293b_0,#020617_55%,#020617_100%)] p-5 shadow-[0_0_0_1px_#050509,0_16px_32px_rgba(0,0,0,0.9)] [html.light_&]:bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f8fafc_65%,#f1f5f9_100%)]">
        <div className="article-body">
          <p>Article content coming soon — MDX migration in progress.</p>
        </div>

        {/* Article CTA */}
        <div className="mt-8 rounded-lg border border-border bg-panel p-4">
          <p className="text-[0.84rem] text-muted">
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
  );
}
