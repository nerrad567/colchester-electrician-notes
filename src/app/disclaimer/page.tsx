import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for Colchester Electrician Notes — important safety information about the content on this site.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-[920px] px-4">
      <div className="mt-5 rounded-[14px] border border-border bg-[radial-gradient(circle_at_top_left,#1e293b_0,#020617_55%,#020617_100%)] p-5 shadow-[0_0_0_1px_#050509,0_16px_32px_rgba(0,0,0,0.9)] [html.light_&]:bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f8fafc_65%,#f1f5f9_100%)] [html.light_&]:shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_16px_32px_rgba(15,23,42,0.12)]">
        <section className="mb-4">
          <h1 className="mb-1 text-[1.5rem] font-bold text-text">
            Disclaimer
          </h1>
          <p className="text-[0.72rem] uppercase tracking-[0.16em] text-accent">
            Important safety information
          </p>
        </section>

        <div className="max-w-[640px] space-y-4 text-[0.84rem] leading-relaxed text-muted-strong">
          <p>
            The content on this site is written from my experience as a
            practising electrician. It&apos;s intended as general information and
            real-world context — not as instruction or advice for carrying out
            electrical work.
          </p>
          <p>
            <strong className="text-text">
              Electrical work is dangerous and regulated.
            </strong>{" "}
            Incorrect work can cause fire, electric shock, and death. If
            you&apos;re not a qualified electrician, do not attempt any of the
            work described on this site.
          </p>
          <p>
            Regulations, guidance, and best practice change over time. While I
            make every effort to be accurate, nothing here should be treated as
            a substitute for the current edition of BS 7671, relevant guidance
            notes, or the advice of a qualified professional on site.
          </p>
          <p>
            <a
              href={SITE.businessUrl}
              target="_blank"
              rel="noreferrer"
              className="border-b border-dotted border-accent text-accent hover:border-solid"
            >
              {SITE.business}
            </a>{" "}
            accepts no liability for any loss, damage, or injury arising from
            the use of information published on this site.
          </p>
        </div>
      </div>
    </div>
  );
}
