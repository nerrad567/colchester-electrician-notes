import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { SectionAtmosphere } from "@/components/SectionAtmosphere";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer for Colchester Electrician Notes — important safety information about the content on this site.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <section className="relative overflow-hidden px-6 py-10 md:px-10 md:py-14 xl:px-16">
      <SectionAtmosphere grain={0.10} gridOpacity={0.04} glowColor="amber" glowIntensity={0.06} />
      <div className="relative mx-auto max-w-[920px]">
        <header className="mb-8">
          <p className="mb-2 text-[0.72rem] uppercase tracking-[0.16em] text-accent">
            Important safety information
          </p>
          <h1 className="text-2xl font-bold text-text md:text-3xl">
            Disclaimer
          </h1>
        </header>

        <div className="rounded-xl border border-border bg-panel p-6 md:p-8">
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
              All content relates to electrical regulations in England and
              Wales — it may not apply to other jurisdictions.
            </p>
            <p>
              Reading this site does not create a professional or contractual
              relationship between you and{" "}
              <a
                href={SITE.businessUrl}
                target="_blank"
                rel="noreferrer"
                className="border-b border-dotted border-accent text-accent hover:border-solid"
              >
                {SITE.business}
              </a>
              . For quotes, inspections, or electrical work, contact us
              directly through the main site.
            </p>
            <p>
              This site may contain links to external websites. We have no
              control over the content of those sites and accept no
              responsibility for them.
            </p>
            <p>
              {SITE.business} accepts no liability for any loss, damage, or
              injury arising from the use of information published on this site.
            </p>
            <p className="border-t border-border-soft pt-4 text-[0.78rem] text-muted">
              All content, text, and images on this site are &copy;{" "}
              {new Date().getFullYear()}{" "}
              {SITE.business}. All rights reserved. No part of this site may
              be reproduced without written permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
