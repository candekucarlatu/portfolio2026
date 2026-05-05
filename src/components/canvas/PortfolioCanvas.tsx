'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/content/schema'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { AboutMeCard } from './AboutMeCard'
import { DecorItem } from './DecorItem'
import { ProjectCard } from './ProjectCard'
import { TacoBellCard } from './TacoBellCard'
import { SlideShareCard } from './SlideShareCard'
import { ScribdCard } from './ScribdCard'
import { PortfolioMobile } from './PortfolioMobile'
import { ABOUT_ME_RECT, BOARD_HEIGHT, BOARD_WIDTH, DECOR, PROJECTS } from './itemPositions'

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
 * Canvas zoom: 1.0 at ≥1280px, scales linearly down to 0.65 at 768px.
 * Below 768px keeps scale=1 (mobile layout handled separately).
 */
function getScale(viewport: ViewportSize): number {
  if (viewport.width < 768) return 1
  return Math.min(1, Math.max(0.65, viewport.width / 1280))
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

  // Mouse parallax — raw values snapped immediately, springs smooth the output
  const rawMouseX = useMotionValue(0)
  const rawMouseY = useMotionValue(0)
  const mouseX = useSpring(rawMouseX, { stiffness: 55, damping: 22 })
  const mouseY = useSpring(rawMouseY, { stiffness: 55, damping: 22 })

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

      // Update parallax
      if (!reduceMotion) {
        rawMouseX.set(e.clientX - rect.left - rect.width / 2)
        rawMouseY.set(e.clientY - rect.top - rect.height / 2)
      }
    },
    [rawMouseX, rawMouseY, reduceMotion],
  )

  const handleMouseLeave = useCallback(() => {
    cursorInsideRef.current = false
    rawMouseX.set(0)
    rawMouseY.set(0)
  }, [rawMouseX, rawMouseY])

  const projectMap = new Map(projects.map((p) => [p.slug, p]))
  const scale = viewport ? getScale(viewport) : 1
  const constraints = viewport ? getDragConstraints(viewport, scale) : undefined
  // Desktop uses cursor panning; tablet/mobile uses touch drag
  const isDesktop = viewport ? viewport.width >= 1024 : false
  const dragEnabled = !reduceMotion && !isDesktop

  if (viewport && viewport.width < 768) {
    return <PortfolioMobile projects={projects} dict={dict} locale={locale} />
  }

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
          {DECOR.map((item) => (
            <DecorItem
              key={item.id}
              item={item}
              priority={item.id === 'lettering'}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}

          <AboutMeCard dict={dict} />

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

        {/* Drag/cursor hint — fades after first interaction */}
        {!reduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hasInteracted ? 0 : 1 }}
            transition={{ delay: hasInteracted ? 0 : 1.2, duration: 0.6 }}
            className="text-ink/55 pointer-events-none fixed inset-x-0 bottom-6 z-40 text-center text-xs tracking-wider uppercase md:bottom-10"
          >
            ← {dict.ui.dragHint} →
          </motion.div>
        )}
      </div>
  )
}
