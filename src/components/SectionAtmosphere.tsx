/**
 * Reusable atmospheric background layers — grain, grid, glow.
 * References shared SVG filter #grain-filter defined in layout.tsx.
 *
 * In light mode, all effects are hidden to keep the page clean.
 */
export function SectionAtmosphere({
  grain = 0.12,
  gridOpacity = 0.04,
  glowColor = "amber",
  glowIntensity = 0.07,
  vignette = true,
}: {
  grain?: number;
  gridOpacity?: number;
  glowColor?: "amber" | "blue" | "neutral";
  glowIntensity?: number;
  vignette?: boolean;
}) {
  const glowColors = {
    amber: "rgba(251, 191, 36,",
    blue: "rgba(59, 130, 246,",
    neutral: "rgba(148, 163, 184,",
  };
  const glow = glowColors[glowColor];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [html.light_&]:hidden" aria-hidden="true">
      {vignette && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
      )}

      {/* Film grain — references shared filter from layout */}
      <svg className="absolute inset-0 h-full w-full" style={{ opacity: grain }}>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: gridOpacity,
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Central glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: `${glow}${glowIntensity})` }}
      />
    </div>
  );
}
