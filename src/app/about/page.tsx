import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About this site",
  description:
    "About Colchester Electrician Notes — who writes these, why they exist, and how they connect to Gray Logic Electrical.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[920px] px-4">
      <div className="mt-5 rounded-[14px] border border-border bg-[radial-gradient(circle_at_top_left,#1e293b_0,#020617_55%,#020617_100%)] p-5 shadow-[0_0_0_1px_#050509,0_16px_32px_rgba(0,0,0,0.9)] [html.light_&]:bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f8fafc_65%,#f1f5f9_100%)] [html.light_&]:shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_16px_32px_rgba(15,23,42,0.12)]">
        <section className="mb-6">
          <h1 className="mb-1 text-[1.5rem] font-bold text-text">
            About this site
          </h1>
          <p className="text-[0.72rem] uppercase tracking-[0.16em] text-accent">
            Who writes these &middot; Why they exist
          </p>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-panel p-4 text-[0.82rem] text-muted-strong">
            <h2 className="mb-2 text-[0.9rem] font-semibold uppercase tracking-[0.16em] text-muted-strong">
              Who I am
            </h2>
            <p className="leading-relaxed">
              I&apos;m Darren — a NICEIC-registered electrician based in
              Colchester, Essex. I run{" "}
              <a
                href={SITE.businessUrl}
                target="_blank"
                rel="noreferrer"
                className="border-b border-dotted border-accent text-accent hover:border-solid"
              >
                Gray Logic Electrical
              </a>
              , covering domestic and commercial work across North Essex.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-panel p-4 text-[0.82rem] text-muted-strong">
            <h2 className="mb-2 text-[0.9rem] font-semibold uppercase tracking-[0.16em] text-muted-strong">
              Why this exists
            </h2>
            <p className="leading-relaxed">
              Most electrician websites are sales-first. This one isn&apos;t. These
              are real job notes — what I actually find, test, and fix. Written
              for other sparks, landlords, and anyone tired of vague answers.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-panel p-4 text-[0.82rem] text-muted-strong sm:col-span-2">
            <h2 className="mb-2 text-[0.9rem] font-semibold uppercase tracking-[0.16em] text-muted-strong">
              How this links to Gray Logic
            </h2>
            <p className="leading-relaxed">
              This notes site runs alongside the main Gray Logic Electrical website.
              If you&apos;re in Colchester and need an electrician, head to{" "}
              <a
                href={SITE.businessUrl}
                target="_blank"
                rel="noreferrer"
                className="border-b border-dotted border-accent text-accent hover:border-solid"
              >
                graylogic.uk
              </a>{" "}
              — that&apos;s where you book work, get quotes, and find contact details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
