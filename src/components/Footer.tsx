import { SITE } from "@/lib/constants";
import { SectionAtmosphere } from "@/components/SectionAtmosphere";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-soft bg-bg-soft">
      <SectionAtmosphere grain={0.04} gridOpacity={0.015} glowColor="neutral" glowIntensity={0.02} vignette={false} />
      <div className="relative mx-auto max-w-[1400px] px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-xs text-muted sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href={SITE.businessUrl}
              target="_blank"
              rel="noreferrer"
              className="text-accent hover:text-accent-strong transition-colors"
            >
              {SITE.business}
            </a>
          </p>
          <div className="flex gap-4">
            <a href={SITE.businessUrl} target="_blank" rel="noreferrer" className="hover:text-text transition-colors">
              graylogic.uk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
