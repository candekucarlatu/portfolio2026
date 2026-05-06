'use client'

import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/content/schema'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { AboutMeCard } from './AboutMeCard'
import { WowDecor, LetteringDecor, GastlyDecor, CollageDecor } from './DecorItems'
import { ProjectCard } from './ProjectCard'
import { TacoBellCard } from './TacoBellCard'
import { SlideShareCard } from './SlideShareCard'
import { ScribdCard } from './ScribdCard'
import { KaplanCard } from './KaplanCard'
import { ABOUT_ME_RECT, BOARD_HEIGHT, BOARD_WIDTH, PROJECTS } from './itemPositions'

interface PortfolioCanvasProps {
  projects: Project[]
  dict: Dictionary
  locale: Locale
}

interface ViewportSize {
  width: number
  height: number
}

/**
 * Canvas scale for all viewport sizes.
 *
 * Phone  (<768px):  scale = viewport.width / 480  → board ≈2031px at 390px (Figma ref 463:116)
 * Tablet (768-1023px): scale = viewport.width / 625 → board ≈3073px at 768px (Figma ref 464:119)
 * Desktop (≥1024px): max(byWidth, byHeight), clamped to [0.38, 1.0]
 */
function getScale(viewport: ViewportSize): number {
  if (viewport.width < 768) return Math.max(0.5, viewport.width / 480)
  if (viewport.width < 1024) return Math.max(0.8, viewport.width / 625)
  const byWidth = viewport.width / 1280
  const byHeight = viewport.height / 1800
  return Math.min(1, Math.max(0.38, Math.max(byWidth, byHeight)))
}

function getCenteredOffset(viewport: ViewportSize, scale: number) {
  const cx = ABOUT_ME_RECT.x + ABOUT_ME_RECT.w / 2
  const cy = ABOUT_ME_RECT.y + ABOUT_ME_RECT.h / 2
  return {
    x: viewport.width / 2 - cx * scale,
    y: viewport.height / 2 - cy * scale,
  }
}

function getDragConstraints(viewport: ViewportSize, scale: number) {
  const scaledW = BOARD_WIDTH * scale
  const scaledH = BOARD_HEIGHT * scale
  return {
    left: Math.min(0, viewport.width - scaledW),
    top: Math.min(0, viewport.height - scaledH),
    right: Math.max(0, viewport.width - scaledW),
    bottom: Math.max(0, viewport.height - scaledH),
  }
}

/**
 * Edge-proximity pan speed: 0 in center, increases cubically toward edge.
 * EDGE_ZONE = distance from edge (px) where panning starts.
 * Returns velocity in the canvas-pan direction (+x = pan left/up = show right/down).
 */
function edgePanVelocity(pos: number, size: number, edgeZone: number, maxSpeed: number): number {
  if (pos < edgeZone) return maxSpeed * Math.pow(1 - pos / edgeZone, 2)
  if (pos > size - edgeZone) return -maxSpeed * Math.pow(1 - (size - pos) / edgeZone, 2)
  return 0
}

export function PortfolioCanvas({ projects, dict, locale }: PortfolioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [viewport, setViewport] = useState<ViewportSize | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Cursor position for edge-panning (no re-render needed — read in RAF)
  const cursorRef = useRef({ x: 0, y: 0 })
  // Whether cursor is currently inside the container (don't pan when outside)
  const cursorInsideRef = useRef(false)

  useEffect(() => {
    const measure = () => {
      const node = containerRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      setViewport({ width: rect.width, height: rect.height })
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!viewport) return
    const scale = getScale(viewport)
    const initial = getCenteredOffset(viewport, scale)
    const constraints = getDragConstraints(viewport, scale)
    const clampedX = Math.max(constraints.left, Math.min(constraints.right, initial.x))
    const clampedY = Math.max(constraints.top, Math.min(constraints.bottom, initial.y))
    x.set(clampedX)
    y.set(clampedY)
    // Seed cursor at center so panning doesn't start immediately on load
    cursorRef.current = { x: viewport.width / 2, y: viewport.height / 2 }
  }, [viewport, x, y])

  // Trackpad / wheel panning (all viewports)
  useEffect(() => {
    const el = containerRef.current
    if (!el || !viewport) return
    const scale = getScale(viewport)
    const constraints = getDragConstraints(viewport, scale)

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      x.set(Math.max(constraints.left, Math.min(constraints.right, x.get() - e.deltaX)))
      y.set(Math.max(constraints.top, Math.min(constraints.bottom, y.get() - e.deltaY)))
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [viewport, x, y])

  // Edge-proximity cursor panning — desktop only (≥1024px), disabled with reduceMotion
  useEffect(() => {
    if (!viewport || viewport.width < 1024 || reduceMotion) return

    const scale = getScale(viewport)
    const constraints = getDragConstraints(viewport, scale)
    const EDGE_ZONE = Math.round(Math.min(180, viewport.width * 0.14))
    const MAX_SPEED = 8

    let rafId: number

    const tick = () => {
      if (cursorInsideRef.current) {
        const { x: cx, y: cy } = cursorRef.current
        const vx = edgePanVelocity(cx, viewport.width, EDGE_ZONE, MAX_SPEED)
        const vy = edgePanVelocity(cy, viewport.height, EDGE_ZONE, MAX_SPEED)

        if (vx !== 0 || vy !== 0) {
          x.set(Math.max(constraints.left, Math.min(constraints.right, x.get() + vx)))
          y.set(Math.max(constraints.top, Math.min(constraints.bottom, y.get() + vy)))
          if (!hasInteracted) setHasInteracted(true)
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [viewport, x, y, reduceMotion, hasInteracted])

  const handleDragStart = useCallback(() => setHasInteracted(true), [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      cursorInsideRef.current = true
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      // Update cursor position for edge panning
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    },
    [],
  )

  const handleMouseLeave = useCallback(() => {
    cursorInsideRef.current = false
  }, [])

  const projectMap = new Map(projects.map((p) => [p.slug, p]))
  const scale = viewport ? getScale(viewport) : 1
  const constraints = viewport ? getDragConstraints(viewport, scale) : undefined
  // Desktop uses cursor panning; tablet/mobile uses touch drag
  const isDesktop = viewport ? viewport.width >= 1024 : false
  const dragEnabled = !reduceMotion && !isDesktop

  return (
      <div
        ref={containerRef}
        className="bg-paper canvas-scroll-hidden fixed inset-0 touch-none overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          drag={dragEnabled}
          dragConstraints={dragEnabled ? constraints : undefined}
          dragElastic={0.06}
          dragMomentum
          dragTransition={{ power: 0.18, timeConstant: 320, bounceStiffness: 280, bounceDamping: 28 }}
          onDragStart={handleDragStart}
          style={{
            x,
            y,
            scale,
            transformOrigin: '0% 0%',
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            backgroundImage: 'url(/canvas/bg-pegboard-tile.png)',
            backgroundSize: '305px 232px',
            backgroundRepeat: 'repeat',
          }}
          className={`motion-safe:animate-board-fade-in absolute top-0 left-0 will-change-transform ${
            dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        >
          {/* Decorative elements — static, no parallax */}
          <WowDecor />
          <LetteringDecor />
          <GastlyDecor />
          <CollageDecor />

          <AboutMeCard dict={dict} locale={locale} />

          {PROJECTS.map((item) => {
            const project = projectMap.get(item.slug)
            if (!project) return null
            if (item.slug === 'tacobell') {
              return (
                <TacoBellCard
                  key={item.slug}
                  card={project.card}
                  href={`/${locale}/work/${item.slug}`}
                  ariaLabel={`${dict.ui.openProject}: ${project.card.title}`}
                />
              )
            }
            if (item.slug === 'slideshare') {
              return (
                <SlideShareCard
                  key={item.slug}
                  card={project.card}
                  href={`/${locale}/work/${item.slug}`}
                  ariaLabel={`${dict.ui.openProject}: ${project.card.title}`}
                />
              )
            }
            if (item.slug === 'scribd') {
              return (
                <ScribdCard
                  key={item.slug}
                  card={project.card}
                  href={`/${locale}/work/${item.slug}`}
                  ariaLabel={`${dict.ui.openProject}: ${project.card.title}`}
                />
              )
            }
            if (item.slug === 'kaplan') {
              return (
                <KaplanCard
                  key={item.slug}
                  card={project.card}
                  href={`/${locale}/work/${item.slug}`}
                  ariaLabel={`${dict.ui.openProject}: ${project.card.title}`}
                />
              )
            }
            return (
              <ProjectCard
                key={item.slug}
                item={item}
                card={project.card}
                href={`/${locale}/work/${item.slug}`}
                ariaLabel={`${dict.ui.openProject}: ${project.card.title}`}
              />
            )
          })}
        </motion.div>

      </div>
  )
}
