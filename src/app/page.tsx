import { SITE } from "@/lib/constants";
import { getPublishedPosts } from "@/lib/db";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleRail } from "@/components/ArticleRail";
import { getHomeStructuredData } from "@/app/structured-data";
import { SectionAtmosphere } from "@/components/SectionAtmosphere";
import { WalkingStickman } from "@/components/WalkingStickman";
import { RefreshListener } from "@/components/RefreshListener";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbPosts = await getPublishedPosts();
  const posts = dbPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    kicker: p.kicker,
    excerpt: p.excerpt,
    readTime: p.read_time,
  }));

  return (
    <>
      <RefreshListener />
      <WalkingStickman />

      {/* Structured data — static JSON, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getHomeStructuredData()),
        }}
      />

      {/* Hero — full width, generous spacing */}
      <section className="relative overflow-hidden border-b border-border-soft bg-[radial-gradient(ellipse_at_top,#1e293b_0%,#020617_60%,#000_100%)] px-6 pb-10 pt-8 [html.light_&]:bg-[radial-gradient(ellipse_at_top,#ffffff_0%,#f1f5f9_60%,#e2e8f0_100%)] md:px-10 md:pb-12 md:pt-10 xl:px-16">
        <SectionAtmosphere grain={0.08} gridOpacity={0.03} glowColor="amber" glowIntensity={0.05} />
        <div className="relative mx-auto max-w-[1400px]">
          <div className="mb-4 inline-flex items-center gap-2.5 rounded-lg border border-border bg-bg/60 px-4 py-2 text-[0.74rem] uppercase tracking-[0.12em] text-muted backdrop-blur-sm">
            <span
              className="h-2 w-5 rounded-sm shadow-[0_0_0_1px_rgba(15,23,42,0.8)]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #fbbf24 0, #fbbf24 25%, transparent 25%, transparent 50%, #fbbf24 50%, #fbbf24 75%, transparent 75%, transparent 100%)",
                backgroundSize: "0.8rem 0.8rem",
              }}
              aria-hidden="true"
            />
            On-site notes from a working electrician in Colchester
          </div>

          <h1 className="mb-4 text-3xl font-bold leading-[1.2] text-text md:text-4xl">
            Job notes from a Colchester electrician
          </h1>

          <p className="mb-6 max-w-[580px] text-[0.92rem] leading-relaxed text-muted-strong">
            <strong className="text-text">Gray Logic Electrical</strong> —
            NICEIC-registered, covering Colchester and North Essex.
            This is where I write up what I find on jobs: EICRs, fault-finding,
            consumer units, wiring that should have been sorted years ago.
          </p>

          <a
            href={SITE.businessUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-transparent bg-gradient-to-br from-accent to-accent-strong px-6 py-3 text-[0.82rem] font-semibold text-[#111827] shadow-[0_12px_28px_rgba(248,181,0,0.45)] transition-all hover:-translate-y-px hover:shadow-[0_18px_36px_rgba(248,181,0,0.6)]"
          >
            Visit Gray Logic Electrical
          </a>
        </div>
      </section>

      {/* Articles — book-style two-up layout */}
      <section
        id="articles"
        aria-label="Latest articles"
        className="relative overflow-hidden px-6 py-10 md:px-10 md:py-14 xl:px-16"
      >
        <SectionAtmosphere grain={0.12} gridOpacity={0.04} glowColor="amber" glowIntensity={0.07} />
        <div className="mx-auto max-w-full sm:max-w-[90vw] xl:max-w-[1400px]">
          <header className="mb-8 text-center">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-strong lg:text-base xl:text-lg">
              Latest from the jobs
            </h2>
            <p className="mx-auto max-w-[480px] text-[0.88rem] leading-relaxed text-muted lg:max-w-[560px] lg:text-[0.95rem] xl:text-base">
              Short, straight write-ups from real work around Colchester —
              written in between call-outs and getting the power back on.
            </p>
          </header>

          <ArticleRail>
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </ArticleRail>
        </div>
      </section>

      {/* Meta — wider two-column with breathing room */}
      <section className="relative overflow-hidden border-t border-border-soft px-6 py-12 md:px-10 md:py-16">
        <SectionAtmosphere grain={0.06} gridOpacity={0.02} glowColor="neutral" glowIntensity={0.03} vignette={false} />
        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-[1.2fr_1fr] md:gap-10">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted-strong">
              Notes from the job
            </h2>
            <p className="mb-4 text-[0.88rem] leading-relaxed text-muted">
              This is my note-taking space as a working electrician in
              Colchester — a place to break down EICRs, real jobs, and the
              details that don&apos;t fit on a standard business website.
            </p>
            <ul className="space-y-1.5 text-[0.84rem] leading-relaxed text-muted-strong">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                No sponsored rankings. No paid listings.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                No stock photos of handshakes and perfect lofts.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Just the reality of testing, fault finding and upgrading
                installations in and around Colchester.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-panel/50 p-6 backdrop-blur-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted-strong">
              Where to book work
            </h2>
            <p className="mb-4 text-[0.88rem] leading-relaxed text-muted">
              If you&apos;re in Colchester and need an electrician, this blog
              sits alongside my main site:
            </p>
            <a
              href={SITE.businessUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-[0.84rem] font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/20"
            >
              graylogic.uk
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
