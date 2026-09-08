/**
 * @file shared/ui/mesh-background-horizontal/mesh-background.tsx
 *
 * Purpose: Decorative gradient-mesh plane along the bottom edge.
 * Used in: App shell (behind layout chrome).
 * Used for: Soft color clusters under the layout without covering header/sidebar.
 *
 * Steps:
 * 1. Absolute fill clipped to the parent.
 * 2. Soft radial mesh clusters along the bottom edge only (light + dark palettes).
 * 3. Top fade so color stays near the baseline.
 */

import { cn } from "@/lib/utils";

import styles from "./mesh-background.module.css";

const MESH_LAYER_CLASS = "absolute inset-x-0 h-[42%] blur-[50px]";

/** Light: amber / cyan / blue clusters (unchanged). */
const LEFT_MESH_LIGHT = `
  radial-gradient(circle at 0% 80%, #f59e0b 0%, transparent 8%),
  radial-gradient(circle at -5% 68%, #22d3ee 0%, transparent 9%),
  radial-gradient(circle at 10% 97%, #2563eb 0%, #3b82f6 4%, transparent 10%)
`;

const CENTER_MESH_LIGHT = `
  radial-gradient(circle at 32% 90%, #f59e0b 0%, transparent 8%),
  radial-gradient(circle at 40% 95%, #22d3ee 0%, #06b6d4 4%, transparent 10%),
  radial-gradient(circle at 48% 100%, #3b82f6 0%, #1d4ed8 4%, transparent 10%)
`;

const RIGHT_MESH_LIGHT = `
  radial-gradient(circle at 58% 90%, #1d4ed8 0%, transparent 9%),
  radial-gradient(circle at 68% 101%, #f59e0b 0%, #22d3ee 4%, transparent 10%),
  radial-gradient(circle at 78% 95%, #22d3ee 0%, #3b82f6 4%, transparent 10%),
  radial-gradient(circle at 90% 95%, #2563eb 0%, #1d4ed8 5%, transparent 10%),
  radial-gradient(circle at 100% 95%, #06b6d4 0%, transparent 9%)
`;

/**
 * Dark: mint primary (`--primary` 158 45% 59%) + related teal / cyan / soft blue.
 */
const LEFT_MESH_DARK = `
  radial-gradient(circle at 0% 80%, hsl(158 45% 45%) 0%, transparent 8%),
  radial-gradient(circle at -5% 68%, hsl(199 70% 42%) 0%, transparent 9%),
  radial-gradient(circle at 10% 97%, hsl(158 45% 59%) 0%, hsl(160 50% 40%) 4%, transparent 10%)
`;

const CENTER_MESH_DARK = `
  radial-gradient(circle at 32% 90%, hsl(160 55% 38%) 0%, transparent 8%),
  radial-gradient(circle at 40% 95%, hsl(158 45% 59%) 0%, hsl(199 65% 45%) 4%, transparent 10%),
  radial-gradient(circle at 48% 100%, hsl(170 40% 35%) 0%, hsl(158 40% 30%) 4%, transparent 10%)
`;

const RIGHT_MESH_DARK = `
  radial-gradient(circle at 58% 90%, hsl(170 45% 32%) 0%, transparent 9%),
  radial-gradient(circle at 68% 101%, hsl(158 45% 59%) 0%, hsl(199 70% 42%) 4%, transparent 10%),
  radial-gradient(circle at 78% 95%, hsl(199 65% 40%) 0%, hsl(158 45% 48%) 4%, transparent 10%),
  radial-gradient(circle at 90% 95%, hsl(158 40% 36%) 0%, hsl(160 50% 28%) 5%, transparent 10%),
  radial-gradient(circle at 100% 95%, hsl(199 70% 38%) 0%, transparent 9%)
`;

type MeshTriplet = {
  left: string;
  center: string;
  right: string;
  /** Tailwind visibility for this palette. */
  visibility: string;
};

const MESH_PALETTES: readonly MeshTriplet[] = [
  {
    left: LEFT_MESH_LIGHT,
    center: CENTER_MESH_LIGHT,
    right: RIGHT_MESH_LIGHT,
    visibility: "dark:hidden",
  },
  {
    left: LEFT_MESH_DARK,
    center: CENTER_MESH_DARK,
    right: RIGHT_MESH_DARK,
    visibility: "hidden dark:block",
  },
];

/**
 * Bottom-aligned mesh background (aria-hidden, non-interactive).
 * Parent must be `relative` (and usually `overflow-hidden`).
 *
 * @example
 * <div className="relative">
 *   <MeshBackgroundHorizontal />
 *   …
 * </div>
 */
export function MeshBackgroundHorizontal() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30 dark:opacity-30 bg-background"
    >
      {MESH_PALETTES.map((palette) => (
        <div key={palette.visibility} className={cn("absolute inset-0", palette.visibility)}>
          <div
            className={cn(MESH_LAYER_CLASS, styles.meshLayerLeft)}
            style={{ background: palette.left }}
          />
          <div
            className={cn(MESH_LAYER_CLASS, styles.meshLayerCenter)}
            style={{ background: palette.center }}
          />
          <div
            className={cn(MESH_LAYER_CLASS, styles.meshLayerRight)}
            style={{ background: palette.right }}
          />
        </div>
      ))}

      {/* Fade mesh out toward the top of the section */}
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}

/** @deprecated Prefer {@link MeshBackgroundHorizontal}. */
export const ContactMeshBackground = MeshBackgroundHorizontal;
