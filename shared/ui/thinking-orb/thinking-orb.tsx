/**
 * @file shared/ui/thinking-orb/thinking-orb.tsx
 * Local ThinkingOrb shell — canvas renders at any CSS px size; preset tuning
 * falls back to the nearest shipped bucket (20 or 64) from `thinking-orbs`.
 *
 * Used in: widgets/footer/footer-thinking-orb.tsx
 *
 * ── How this file got here ────────────────────────────────────────────────
 * The npm package `thinking-orbs` only ships two tuned sizes (64 and 20) and
 * only publishes compiled `dist/` — not editable TypeScript source. We needed
 * arbitrary sizes (e.g. 128) without CSS scale blur.
 *
 * Option chosen: light extract (see chat / project notes):
 * 1. Keep `thinking-orbs` installed — it supplies the canvas engine only.
 * 2. Copy the small React shell from `node_modules/thinking-orbs/dist/index.es.js`
 *    (or the upstream repo) into this file and adapt it.
 * 3. Import draw logic from `thinking-orbs/engine`:
 *    `MODE_DRAWS`, `resolvePreset`, `STATE_TO_MODE`, etc.
 * 4. Render the canvas at any `size` prop; call `resolvePreset(state, presetSize)`
 *    where `presetSize` is 20 when size ≤ 20, else 64 — geometry still scales
 *    with the actual canvas dimension passed to `MODE_DRAWS[mode](ctx, size, …)`.
 * 5. MIT attribution kept in ./LICENSE (Jakub Antalik, v0.3.1).
 *
 * To reach for other orbs — change the `state` prop (all nine ship in the engine):
 *   working | searching | solving | listening | connecting
 *   weaving | composing | breathing | shaping
 *
 * @example
 * import { ThinkingOrb } from "@/shared/ui/thinking-orb/thinking-orb"
 * <ThinkingOrb state="searching" size={128} speed={0.1} theme="auto" />
 *
 * Upstream: https://github.com/Jakubantalik/thinking-orbs
 * Demo:     https://orbs.jakubantalik.com
 * Engine:   `import { … } from "thinking-orbs/engine"` for lower-level APIs.
 */

"use client"

import {
  useEffect,
  useRef,
  useState,
  type CanvasHTMLAttributes,
  type CSSProperties,
  type RefObject,
} from "react"
import { MODE_DRAWS, resolvePreset, type OrbSize } from "thinking-orbs/engine"
import type { OrbState, OrbTheme } from "thinking-orbs"

const STATE_LABELS: Record<OrbState, string> = {
  working: "Working…",
  searching: "Searching…",
  solving: "Solving…",
  listening: "Listening…",
  connecting: "Connecting…",
  weaving: "Weaving…",
  composing: "Composing…",
  breathing: "Thinking…",
  shaping: "Shaping…",
}

/** Map render size to the nearest tuned preset bucket shipped by thinking-orbs. */
function resolvePresetSize(size: number): OrbSize {
  return size <= 20 ? 20 : 64
}

function readAncestorTheme(node: HTMLElement | null): boolean | null {
  let current: HTMLElement | null = node

  while (current) {
    const dataTheme = current.getAttribute("data-theme")
    if (dataTheme === "dark") return true
    if (dataTheme === "light") return false
    if (current.classList.contains("dark")) return true
    if (current.classList.contains("light")) return false
    current = current.parentElement
  }

  return null
}

function readSystemDarkTheme(): boolean {
  return (
    typeof matchMedia === "undefined" ||
    matchMedia("(prefers-color-scheme: dark)").matches
  )
}

function useOrbDarkTheme(theme: OrbTheme, ref: RefObject<HTMLCanvasElement | null>) {
  const [isDark, setIsDark] = useState(true)

  useEffect(function syncOrbTheme() {
    if (theme === "dark") {
      setIsDark(true)
      return
    }

    if (theme === "light") {
      setIsDark(false)
      return
    }

    function updateTheme() {
      const ancestorTheme = readAncestorTheme(ref.current)
      setIsDark(ancestorTheme ?? readSystemDarkTheme())
    }

    updateTheme()

    const colorSchemeQuery =
      typeof matchMedia !== "undefined"
        ? matchMedia("(prefers-color-scheme: dark)")
        : null

    colorSchemeQuery?.addEventListener("change", updateTheme)

    let observer: MutationObserver | null = null
    if (typeof MutationObserver !== "undefined" && ref.current) {
      observer = new MutationObserver(updateTheme)
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
        subtree: true,
      })
    }

    return function cleanupOrbTheme() {
      colorSchemeQuery?.removeEventListener("change", updateTheme)
      observer?.disconnect()
    }
  }, [theme, ref])

  return isDark
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(function syncReducedMotion() {
    if (typeof matchMedia === "undefined") return

    const query = matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(query.matches)

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches)
    }

    query.addEventListener("change", handleChange)
    return function cleanupReducedMotion() {
      query.removeEventListener("change", handleChange)
    }
  }, [])

  return prefersReducedMotion
}

export interface ThinkingOrbProps
  extends Omit<CanvasHTMLAttributes<HTMLCanvasElement>, "style"> {
  state?: OrbState
  /** Render size in CSS px — any value; tuning uses nearest 20 or 64 preset. */
  size?: number
  theme?: OrbTheme
  speed?: number
  paused?: boolean
  style?: CSSProperties
}

/**
 * Renders a thinking-orb canvas at the requested size.
 *
 * @example
 * <ThinkingOrb state="working" size={128} speed={0.1} />
 */
export function ThinkingOrb({
  state = "working",
  size = 64,
  theme = "auto",
  speed = 1,
  paused = false,
  style,
  "aria-label": ariaLabel,
  ...rest
}: ThinkingOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDark = useOrbDarkTheme(theme, canvasRef)
  const prefersReducedMotion = usePrefersReducedMotion()
  const presetSize = resolvePresetSize(size)

  useEffect(function syncOrbCanvas() {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(
      2,
      (typeof devicePixelRatio !== "undefined" && devicePixelRatio) || 1,
    )
    canvas.width = Math.round(size * dpr)
    canvas.height = Math.round(size * dpr)

    const context = canvas.getContext("2d")
    if (!context) return

    const ctx = context
    const { mode, speed: presetSpeed, opts } = resolvePreset(state, presetSize)
    const draw = MODE_DRAWS[mode]
    const animationSpeed = presetSpeed * speed

    function paintFrame(time: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, size, size)
      draw(ctx, size, time, isDark, opts)
    }

    if (prefersReducedMotion) {
      paintFrame(0.6)
      return
    }

    let frameId = 0
    let isRunning = false

    function tick() {
      paintFrame((performance.now() / 1000) * animationSpeed)
      if (isRunning) frameId = requestAnimationFrame(tick)
    }

    function start() {
      if (isRunning || paused) return
      isRunning = true
      frameId = requestAnimationFrame(tick)
    }

    function stop() {
      isRunning = false
      cancelAnimationFrame(frameId)
    }

    paintFrame((performance.now() / 1000) * animationSpeed)

    let isVisible = true
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(function handleIntersection([entry]) {
            isVisible = entry.isIntersecting
            if (isVisible && document.visibilityState !== "hidden") start()
            else stop()
          })
        : null

    observer?.observe(canvas)

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") stop()
      else if (isVisible) start()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    if (!observer) start()

    return function cleanupOrbCanvas() {
      stop()
      observer?.disconnect()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [state, size, presetSize, isDark, speed, paused, prefersReducedMotion])

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel ?? STATE_LABELS[state]}
      style={{ width: size, height: size, display: "block", ...style }}
      {...rest}
    />
  )
}
