import Link from "next/link";
import { SectionAtmosphere } from "@/components/SectionAtmosphere";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden px-6">
      <SectionAtmosphere grain={0.14} gridOpacity={0.05} glowColor="amber" glowIntensity={0.04} />
      <div className="relative text-center">
        <p className="mb-3 text-[0.72rem] uppercase tracking-[0.16em] text-accent">
          Nothing here
        </p>
        <h1 className="mb-2 text-6xl font-bold text-text">404</h1>
        <p className="mb-8 text-sm text-muted">
          Page not found. Might&apos;ve been removed, or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg border border-accent/30 bg-accent/10 px-5 py-2.5 text-[0.84rem] font-medium text-accent transition-colors hover:border-accent/50 hover:bg-accent/20"
        >
          Back to notes
        </Link>
      </div>
    </section>
  );
}
