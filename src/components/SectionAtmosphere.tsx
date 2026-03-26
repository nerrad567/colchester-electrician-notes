/**
 * Reusable atmospheric background layers — grain, grid, glow.
 * References shared SVG filter #grain-filter defined in layout.tsx.
 *
 * Intensity scales via --atmo-* CSS variables so light mode gets
 * the same texture at reduced intensity — no per-element overrides.
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {vignette && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 40%, var(--atmo-vignette) 100%)`,
          }}
        />
      )}

      {/* Film grain — references shared filter from layout */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: `calc(${grain} * var(--atmo-grain))` }}
      >
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* Fine grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: `calc(${gridOpacity} * var(--atmo-grid))`,
          backgroundImage:
            "linear-gradient(var(--atmo-grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--atmo-grid-color) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Central glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          backgroundColor: `${glow}${glowIntensity})`,
          opacity: "var(--atmo-glow)",
        }}
      />
    </div>
  );
}
