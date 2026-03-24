"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";

// ─── Limb animation helpers ──────────────────────────────────────────────────

const legWalk = {
  leftX: { duration: 0.4, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const },
  rightX: { duration: 0.4, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const, delay: 0.2 },
};

// ─── Scenes ──────────────────────────────────────────────────────────────────

function WalkAcross() {
  // Walks left to right across the full screen bottom
  return (
    <motion.div
      className="pointer-events-none fixed bottom-2 left-0 z-40 hidden md:block"
      initial={{ x: -60 }}
      animate={{ x: "calc(100vw + 60px)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 16, ease: "linear" }}
    >
      <svg viewBox="0 0 40 44" className="h-11 w-11 text-muted/30" fill="none" aria-hidden="true">
        {/* Hard hat */}
        <motion.g animate={{ y: [0, -1.5, 0] }} transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="20" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 10h12" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
          <path d="M15 10Q20 4 25 10" stroke="#fbbf24" strokeWidth="1.5" opacity="0.5" fill="none" />
          {/* Body */}
          <line x1="20" y1="15" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        {/* Left arm + toolbox */}
        <motion.g animate={{ rotate: [-25, 25] }} transition={legWalk.leftX} style={{ originX: "20px", originY: "18px" }}>
          <line x1="20" y1="18" x2="12" y2="26" stroke="currentColor" strokeWidth="1.5" />
          <rect x="9" y="25" width="5" height="3.5" rx="0.5" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" />
        </motion.g>
        {/* Right arm */}
        <motion.g animate={{ rotate: [25, -25] }} transition={legWalk.rightX} style={{ originX: "20px", originY: "18px" }}>
          <line x1="20" y1="18" x2="28" y2="26" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        {/* Left leg */}
        <motion.g animate={{ rotate: [-20, 20] }} transition={legWalk.leftX} style={{ originX: "20px", originY: "28px" }}>
          <line x1="20" y1="28" x2="14" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="40" x2="10" y2="40" stroke="currentColor" strokeWidth="2" />
        </motion.g>
        {/* Right leg */}
        <motion.g animate={{ rotate: [20, -20] }} transition={legWalk.rightX} style={{ originX: "20px", originY: "28px" }}>
          <line x1="20" y1="28" x2="26" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="40" x2="30" y2="40" stroke="currentColor" strokeWidth="2" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

function AbseilAndFixLight() {
  // Drops from top-right on a rope, fiddles, light turns on
  return (
    <motion.div
      className="pointer-events-none fixed right-12 z-40 hidden md:block"
      initial={{ top: -80, opacity: 0 }}
      animate={{ top: 80, opacity: 1 }}
      exit={{ top: 200, opacity: 0 }}
      transition={{ duration: 4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Rope */}
      <motion.div
        className="absolute left-[18px] -top-[200px] w-px bg-muted/15"
        initial={{ height: 0 }}
        animate={{ height: 280 }}
        transition={{ duration: 4, ease: "linear" }}
      />
      <svg viewBox="0 0 50 50" className="h-12 w-12 text-muted/30" fill="none" aria-hidden="true">
        {/* Head */}
        <circle cx="20" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 10h12" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
        {/* Body */}
        <line x1="20" y1="15" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" />
        {/* Left arm gripping rope above */}
        <motion.line x1="20" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="1.5"
          animate={{ x2: [18, 16, 18] }} transition={{ duration: 2, repeat: Infinity }} />
        {/* Right arm reaching to install */}
        <motion.g animate={{ rotate: [0, -15, 0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 4 }} style={{ originX: "20px", originY: "18px" }}>
          <line x1="20" y1="18" x2="34" y2="16" stroke="currentColor" strokeWidth="1.5" />
          {/* Screwdriver */}
          <line x1="34" y1="16" x2="40" y2="14" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
        </motion.g>
        {/* Legs dangling with sway */}
        <motion.g animate={{ rotate: [-5, 5, -3, 4, -5] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ originX: "20px", originY: "28px" }}>
          <line x1="20" y1="28" x2="14" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="28" x2="24" y2="38" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        {/* Light fixture — turns on after delay */}
        <circle cx="40" cy="10" r="3" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        <motion.circle cx="40" cy="10" r="3" fill="#fbbf24"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0, 0, 0.4, 0.1, 0.5, 0.2, 0.6] }}
          transition={{ duration: 8, times: [0, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 1] }}
        />
        {/* Glow rays appear with light */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 0, 0, 0, 0.3] }} transition={{ duration: 8, times: [0, 0.5, 0.6, 0.7, 0.85, 1] }}>
          <line x1="36" y1="10" x2="33" y2="10" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="44" y1="10" x2="47" y2="10" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="40" y1="14" x2="40" y2="17" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="37" y1="7" x2="35" y2="5" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="43" y1="7" x2="45" y2="5" stroke="#fbbf24" strokeWidth="0.5" />
        </motion.g>
      </svg>
    </motion.div>
  );
}

function InspectAndHeadshake() {
  // Walks in from left, stops, inspects a mess, shakes head, fixes it, walks out right
  return (
    <motion.div
      className="pointer-events-none fixed bottom-2 z-40 hidden md:block"
      initial={{ left: -60 }}
      animate={{
        left: ["calc(0vw - 60px)", "25vw", "25vw", "25vw", "25vw", "calc(100vw + 60px)"],
      }}
      transition={{
        duration: 14,
        times: [0, 0.2, 0.35, 0.65, 0.8, 1],
        ease: "easeInOut",
      }}
      exit={{ opacity: 0 }}
    >
      <svg viewBox="0 0 70 44" className="h-11 w-[70px] text-muted/30" fill="none" aria-hidden="true">
        {/* Head — shakes in the middle of the timeline */}
        <motion.g
          animate={{ x: [0, 0, 0, -2, 2, -2, 2, -1, 0, 0, 0, 0] }}
          transition={{ duration: 14, times: [0, 0.2, 0.35, 0.38, 0.41, 0.44, 0.47, 0.49, 0.5, 0.65, 0.8, 1] }}
        >
          <circle cx="20" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 10h12" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
        </motion.g>
        {/* Body */}
        <line x1="20" y1="15" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" />
        {/* Arms — start walking, go to hips during inspect, then work, then walk out */}
        <motion.g
          animate={{ rotate: [-20, -20, 0, 0, 0, -15, -20, -20] }}
          transition={{ duration: 14, times: [0, 0.18, 0.22, 0.5, 0.65, 0.7, 0.78, 1] }}
          style={{ originX: "20px", originY: "18px" }}
        >
          <line x1="20" y1="18" x2="12" y2="24" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        <motion.g
          animate={{ rotate: [20, 20, 0, 0, -30, -30, 20, 20] }}
          transition={{ duration: 14, times: [0, 0.18, 0.22, 0.5, 0.55, 0.7, 0.78, 1] }}
          style={{ originX: "20px", originY: "18px" }}
        >
          <line x1="20" y1="18" x2="28" y2="24" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        {/* Left leg — walks, stops, walks */}
        <motion.g
          animate={{ rotate: [-18, 18, -18, 18, 0, 0, 0, -18, 18, -18] }}
          transition={{ duration: 14, times: [0, 0.05, 0.1, 0.18, 0.22, 0.5, 0.78, 0.84, 0.9, 1], ease: "linear" }}
          style={{ originX: "20px", originY: "28px" }}
        >
          <line x1="20" y1="28" x2="14" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="14" y1="40" x2="10" y2="40" stroke="currentColor" strokeWidth="2" />
        </motion.g>
        {/* Right leg */}
        <motion.g
          animate={{ rotate: [18, -18, 18, -18, 0, 0, 0, 18, -18, 18] }}
          transition={{ duration: 14, times: [0, 0.05, 0.1, 0.18, 0.22, 0.5, 0.78, 0.84, 0.9, 1], ease: "linear" }}
          style={{ originX: "20px", originY: "28px" }}
        >
          <line x1="20" y1="28" x2="26" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="40" x2="30" y2="40" stroke="currentColor" strokeWidth="2" />
        </motion.g>
        {/* Messy wire — visible during inspect phase */}
        <motion.path
          d="M36 34 Q42 28 38 22 Q44 18 40 12 Q46 8 42 4"
          stroke="#f97316" strokeWidth="1" fill="none"
          animate={{ opacity: [0, 0, 0.3, 0.3, 0.3, 0, 0, 0] }}
          transition={{ duration: 14, times: [0, 0.2, 0.25, 0.5, 0.55, 0.65, 0.7, 1] }}
        />
        {/* Clean cable — appears after fix */}
        <motion.line
          x1="38" y1="4" x2="38" y2="36"
          stroke="#fbbf24" strokeWidth="1"
          animate={{ opacity: [0, 0, 0, 0, 0, 0, 0.4, 0.4, 0.4, 0] }}
          transition={{ duration: 14, times: [0, 0.2, 0.35, 0.5, 0.55, 0.65, 0.68, 0.75, 0.78, 1] }}
        />
        {/* Tick when done */}
        <motion.path
          d="M34 22 L38 26 L46 14"
          stroke="#fbbf24" strokeWidth="1.5" fill="none"
          animate={{ opacity: [0, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 0], pathLength: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1] }}
          transition={{ duration: 14, times: [0, 0.2, 0.35, 0.5, 0.55, 0.65, 0.68, 0.72, 0.78, 1] }}
        />
      </svg>
    </motion.div>
  );
}

function LunchBreakScene() {
  // Walks to a spot, sits down, eats sandwich, drinks from thermos
  return (
    <motion.div
      className="pointer-events-none fixed bottom-2 z-40 hidden md:block"
      initial={{ right: -60 }}
      animate={{ right: ["calc(0vw - 60px)", "18vw", "18vw", "18vw"] }}
      transition={{ duration: 14, times: [0, 0.15, 0.9, 1], ease: "easeInOut" }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <svg viewBox="0 0 60 48" className="h-11 w-[60px] text-muted/30" fill="none" aria-hidden="true">
        {/* Head — face flips to look at sandwich then thermos */}
        <circle cx="24" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 10h12" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
        {/* Body — transitions from standing to sitting */}
        <motion.line x1="24" y1="15" x2="24" y2="28" stroke="currentColor" strokeWidth="1.5"
          animate={{ x2: [24, 24, 22, 22], y2: [28, 28, 26, 26] }}
          transition={{ duration: 14, times: [0, 0.15, 0.25, 1] }}
        />
        {/* Right arm — walks, then lifts sandwich, then brings to mouth */}
        <motion.g
          animate={{ rotate: [20, 20, -40, -60, -40, -60, -40, 20] }}
          transition={{ duration: 14, times: [0, 0.15, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85], ease: "easeInOut" }}
          style={{ originX: "24px", originY: "18px" }}
        >
          <line x1="24" y1="18" x2="32" y2="14" stroke="currentColor" strokeWidth="1.5" />
          {/* Sandwich */}
          <rect x="31" y="11" width="6" height="4" rx="1" stroke="#fbbf24" strokeWidth="0.8" opacity="0.5" fill="none" />
        </motion.g>
        {/* Left arm — resting then picks up thermos */}
        <motion.g
          animate={{ rotate: [-20, -20, 10, 10, -50, -50, 10, -20] }}
          transition={{ duration: 14, times: [0, 0.15, 0.25, 0.5, 0.55, 0.65, 0.7, 0.85] }}
          style={{ originX: "24px", originY: "18px" }}
        >
          <line x1="24" y1="18" x2="14" y2="24" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        {/* Legs — walking then bend to sit */}
        <motion.g
          animate={{ rotate: [-18, 18, 0, 0] }}
          transition={{ duration: 14, times: [0, 0.08, 0.2, 1] }}
          style={{ originX: "24px", originY: "28px" }}
        >
          <line x1="24" y1="28" x2="16" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <motion.line x1="16" y1="40" x2="20" y2="44" stroke="currentColor" strokeWidth="1.5"
            animate={{ x2: [20, 20, 24, 24], y2: [44, 44, 40, 40] }}
            transition={{ duration: 14, times: [0, 0.15, 0.25, 1] }}
          />
        </motion.g>
        <motion.g
          animate={{ rotate: [18, -18, 0, 0] }}
          transition={{ duration: 14, times: [0, 0.08, 0.2, 1] }}
          style={{ originX: "24px", originY: "28px" }}
        >
          <line x1="24" y1="28" x2="30" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="40" x2="28" y2="44" stroke="currentColor" strokeWidth="1.5" />
        </motion.g>
        {/* Thermos on ground */}
        <rect x="40" y="38" width="4" height="7" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
        {/* Steam */}
        <motion.path d="M42 36 Q43 33 41 31" stroke="currentColor" strokeWidth="0.6" fill="none"
          animate={{ opacity: [0.05, 0.15, 0.05], y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

function ZappedReaction() {
  // Standing near something, touches it, gets zapped, jumps back
  return (
    <motion.div
      className="pointer-events-none fixed bottom-2 z-40 hidden md:block"
      style={{ left: "60%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ x: [0, 0, 0, -20, -20, -20] }}
        transition={{ duration: 8, times: [0, 0.3, 0.35, 0.45, 0.8, 1] }}
      >
        <svg viewBox="0 0 55 48" className="h-11 w-14 text-muted/30" fill="none" aria-hidden="true">
          {/* Head */}
          <motion.g
            animate={{ y: [0, 0, 0, -6, -6, 0] }}
            transition={{ duration: 8, times: [0, 0.3, 0.35, 0.4, 0.6, 0.8] }}
          >
            <circle cx="20" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 10h12" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
          </motion.g>
          {/* Body */}
          <line x1="20" y1="15" x2="20" y2="28" stroke="currentColor" strokeWidth="1.5" />
          {/* Arms — reaching then thrown back */}
          <motion.g
            animate={{ rotate: [0, 0, -30, 30, 30, 0] }}
            transition={{ duration: 8, times: [0, 0.3, 0.35, 0.4, 0.6, 0.8] }}
            style={{ originX: "20px", originY: "18px" }}
          >
            <line x1="20" y1="18" x2="32" y2="16" stroke="currentColor" strokeWidth="1.5" />
          </motion.g>
          <motion.g
            animate={{ rotate: [10, 10, 60, -40, -40, 10] }}
            transition={{ duration: 8, times: [0, 0.3, 0.35, 0.4, 0.6, 0.8] }}
            style={{ originX: "20px", originY: "18px" }}
          >
            <line x1="20" y1="18" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" />
          </motion.g>
          {/* Legs */}
          <line x1="20" y1="28" x2="14" y2="40" stroke="currentColor" strokeWidth="1.5" />
          <line x1="20" y1="28" x2="26" y2="40" stroke="currentColor" strokeWidth="1.5" />
          {/* Socket on wall */}
          <rect x="36" y="16" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
          <circle cx="39" cy="19" r="0.8" fill="currentColor" opacity="0.2" />
          <circle cx="41" cy="19" r="0.8" fill="currentColor" opacity="0.2" />
          {/* Lightning on zap */}
          <motion.g
            animate={{ opacity: [0, 0, 0, 1, 0.5, 0, 0] }}
            transition={{ duration: 8, times: [0, 0.3, 0.34, 0.36, 0.42, 0.5, 1] }}
          >
            <polyline points="33,12 29,18 35,18 30,26" stroke="#fbbf24" strokeWidth="2" fill="none" />
            <polyline points="38,8 36,14 40,14 37,20" stroke="#f97316" strokeWidth="1.2" fill="none" opacity="0.7" />
            {/* Spark particles */}
            <motion.circle cx="28" cy="14" r="1.5" fill="#fbbf24"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 2] }}
              transition={{ duration: 0.4, delay: 2.8 }}
            />
            <motion.circle cx="34" cy="24" r="1" fill="#f97316"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 1.5] }}
              transition={{ duration: 0.3, delay: 2.9 }}
            />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

// ─── Scene Orchestrator ──────────────────────────────────────────────────────

type Scene = "walker" | "abseiler" | "inspector" | "lunch" | "zapped";

const allScenes: Scene[] = ["walker", "abseiler", "inspector", "lunch", "zapped"];

const sceneComponents: Record<Scene, React.ComponentType> = {
  walker: WalkAcross,
  abseiler: AbseilAndFixLight,
  inspector: InspectAndHeadshake,
  lunch: LunchBreakScene,
  zapped: ZappedReaction,
};

const sceneDurations: Record<Scene, number> = {
  walker: 18000,
  abseiler: 12000,
  inspector: 16000,
  lunch: 16000,
  zapped: 10000,
};

export function WalkingStickman() {
  const prefersReducedMotion = useReducedMotion();
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [usedScenes, setUsedScenes] = useState<Scene[]>([]);

  const pickNextScene = useCallback(() => {
    const available = allScenes.filter((s) => !usedScenes.includes(s));
    const pool = available.length > 0 ? available : allScenes;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setUsedScenes((prev) => [...prev.slice(-2), next]);
    setCurrentScene(next);
  }, [usedScenes]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t = setTimeout(pickNextScene, 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!currentScene || prefersReducedMotion) return;
    const duration = sceneDurations[currentScene];
    const gap = 6000 + Math.random() * 8000;
    const t = setTimeout(() => {
      setCurrentScene(null);
      setTimeout(pickNextScene, gap);
    }, duration);
    return () => clearTimeout(t);
  }, [currentScene, prefersReducedMotion, pickNextScene]);

  if (prefersReducedMotion) return null;

  const SceneComponent = currentScene ? sceneComponents[currentScene] : null;

  return (
    <AnimatePresence mode="wait">
      {SceneComponent && <SceneComponent key={currentScene} />}
    </AnimatePresence>
  );
}
