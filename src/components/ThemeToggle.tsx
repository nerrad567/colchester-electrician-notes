"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const Icon = icons[theme];

  return (
    <button
      onClick={cycle}
      className="text-muted hover:text-accent transition-colors"
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      <Icon size={16} />
    </button>
  );
}
