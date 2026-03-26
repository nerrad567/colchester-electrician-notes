import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardPost {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  readTime: string;
}

export function ArticleCard({ post }: { post: CardPost }) {
  return (
    <article
      data-card
      className="group relative flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border border-l-[3px] border-l-accent-border bg-gradient-to-br from-panel-soft via-panel to-bg-soft p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-1 hover:border-accent-border hover:shadow-[var(--shadow-lg)] sm:w-[calc(50%-10px)] sm:p-8 lg:rounded-2xl lg:border-l-4 lg:p-10 xl:p-12"
    >
      <Link
        href={`/posts/${post.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Read: ${post.title}`}
      />
      <p className="mb-2 text-[0.72rem] uppercase tracking-[0.16em] text-accent lg:text-[0.78rem]">
        {post.kicker}
      </p>
      <h3 className="mb-3 text-base font-bold leading-snug text-text sm:text-lg lg:text-xl xl:text-2xl">
        {post.title}
      </h3>
      <p className="mb-auto text-[0.84rem] leading-[1.7] text-muted sm:text-[0.88rem] lg:text-[0.95rem] lg:leading-[1.8] xl:text-base">
        {post.excerpt}
      </p>
      <footer className="mt-5 flex items-center justify-between border-t border-border-soft pt-4 text-[0.78rem] lg:mt-8 lg:pt-5 lg:text-[0.84rem]">
        <span className="text-muted">{post.readTime}</span>
        <span className="flex items-center gap-1.5 text-accent transition-colors group-hover:text-accent-strong">
          Read note <ArrowRight size={14} className="lg:h-4 lg:w-4" />
        </span>
      </footer>
    </article>
  );
}

export function PlaceholderCard({
  kicker,
  title,
  excerpt,
}: {
  kicker: string;
  title: string;
  excerpt: string;
}) {
  return (
    <article
      data-card
      className="flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-dashed border-border bg-gradient-to-br from-panel to-panel-soft p-5 opacity-60 sm:w-[calc(50%-10px)] sm:p-8 lg:rounded-2xl lg:p-10 xl:p-12"
    >
      <p className="mb-2 text-[0.72rem] uppercase tracking-[0.16em] text-accent/60 lg:text-[0.78rem]">
        {kicker}
      </p>
      <h3 className="mb-3 text-base font-bold leading-snug text-muted-strong sm:text-lg lg:text-xl xl:text-2xl">
        {title}
      </h3>
      <p className="mb-auto text-[0.84rem] leading-[1.7] text-muted sm:text-[0.88rem] lg:text-[0.95rem] lg:leading-[1.8] xl:text-base">
        {excerpt}
      </p>
      <footer className="mt-5 border-t border-border-soft pt-4 text-[0.78rem] text-muted lg:mt-8 lg:pt-5 lg:text-[0.84rem]">
        Coming soon
      </footer>
    </article>
  );
}
