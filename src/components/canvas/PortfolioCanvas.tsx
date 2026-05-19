'use client'

import { motion, useMotionValue, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/content/schema'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { CanvasItem } from './CanvasItem'
import { WowDecor, LetteringDecor, GastlyDecor, CollageDecor } from './DecorItems'
import { Pegboard } from './Pegboard'
import { ProjectCard } from './ProjectCard'
import { ResetLayoutButton } from './ResetLayoutButton'
import { TacoBellCard } from './TacoBellCard'
import { SlideShareCard } from './SlideShareCard'
import { ScribdCard } from './ScribdCard'
import { KaplanCard } from './KaplanCard'
import { ABOUT_ME_RECT, BOARD_HEIGHT, BOARD_WIDTH, PROJECTS } from './itemPositions'
import { useCanvasLayout } from '@/lib/canvas/useCanvasLayout'
import { CanvasLayoutSchema, type CanvasLayout, type CanvasItem as CanvasItemData } from '@/lib/canvas/manifest'
import tacobellLayoutRaw from '../../../content/canvas-layout/tacobell.json'
import kaplanLayoutRaw from '../../../content/canvas-layout/kaplan.json'
import slideshareLayoutRaw from '../../../content/canvas-layout/slideshare.json'
import scribdLayoutRaw from '../../../content/canvas-layout/scribd.json'
import decorLayoutRaw from '../../../content/canvas-layout/decor.json'
import aboutmeLayoutRaw from '../../../content/canvas-layout/aboutme.json'

const CANVAS_LAYOUTS: Record<string, CanvasLayout> = {
  tacobell: CanvasLayoutSchema.parse(tacobellLayoutRaw),
  kaplan: CanvasLayoutSchema.parse(kaplanLayoutRaw),
  slideshare: CanvasLayoutSchema.parse(slideshareLayoutRaw),
  scribd: CanvasLayoutSchema.parse(scribdLayoutRaw),
}

const DECOR_LAYOUT: CanvasLayout = CanvasLayoutSchema.parse(decorLayoutRaw)
const ABOUTME_LAYOUT: CanvasLayout = CanvasLayoutSchema.parse(aboutmeLayoutRaw)

/**
 * Replaces the `-en.png` suffix with the current locale so every sticky and
 * About Me paper automatically loads the right language variant.
 * Non-locale-suffixed images (shelf, kiosk, etc.) are returned unchanged.
 */
function localizeSrc(src: string, locale: string): string {
  if (locale === 'en') return src
  return src.replace('-en.png', `-${locale}.png`)
}

/** Replaces each link's href with its locale-specific override when available. */
function localizeLinks(
  links: CanvasItemData['links'],
  locale: string,
): CanvasItemData['links'] {
  if (!links) return links
  if (locale === 'en') return links
  return links.map((l) => ({ ...l, href: l.hrefEs ?? l.href }))
}

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
 * Canvas scale: 1 on desktop (≥1024px), 0.81 on mobile/tablet (<1024px).
 * 0.81 matches the Figma "Home mobile" reference frame (2031/2500 board width ratio).
 * Only the scroll/pan offset changes to keep About Me centered on load.
 */
function getScale(viewport: ViewportSize): number {
  return viewport.width < 1024 ? 0.81 : 1
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
  // Suppresses canvas pan while a sub-item is being dragged
  const itemDragRef = useRef(false)

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
      if (cursorInsideRef.current && !itemDragRef.current) {
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
  const { getPosition, setPosition, reset, hasCustomLayout } = useCanvasLayout()
  const scale = viewport ? getScale(viewport) : 1
  const constraints = viewport ? getDragConstraints(viewport, scale) : undefined
  // Desktop uses cursor panning; mobile/tablet has no drag (canvas is static)
  const isDesktop = viewport ? viewport.width >= 1024 : false
  const dragEnabled = false

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
          initial={{ opacity: 0 }}
          animate={{ opacity: viewport ? 1 : 0 }}
          transition={{ opacity: { duration: 0.5, ease: 'easeOut', delay: 0.1 } }}
          style={{
            x,
            y,
            scale,
            transformOrigin: '0% 0%',
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
          }}
          className={`absolute top-0 left-0 will-change-transform ${
            dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
          }`}
        >
          <Pegboard />

          {/* Decor items — draggable with CSS pin, no click navigation */}
          {DECOR_LAYOUT.items.map((subItem) => (
            <CanvasItem
              key={`decor-${subItem.id}`}
              item={subItem}
              slug="decor"
              ariaLabel={subItem.id}
              position={getPosition('decor', subItem.id)}
              onPositionChange={(pos) => setPosition('decor', subItem.id, pos)}
              onDragStateChange={(dragging) => {
                itemDragRef.current = dragging
              }}
            />
          ))}

          {/* About Me — same PNG composite for all locales, paper src swapped per locale */}
          {ABOUTME_LAYOUT.items.map((subItem) => (
            <CanvasItem
              key={`aboutme-${subItem.id}`}
              item={{ ...subItem, src: localizeSrc(subItem.src, locale), links: localizeLinks(subItem.links, locale) }}
              slug="aboutme"
              href={subItem.links ? undefined : `/${locale}/about`}
              ariaLabel={dict.aboutSheet?.profileLabel ?? 'About'}
              position={getPosition('aboutme', subItem.id)}
              onPositionChange={(pos) => setPosition('aboutme', subItem.id, pos)}
              onDragStateChange={(dragging) => {
                itemDragRef.current = dragging
              }}
            />
          ))}

          {PROJECTS.map((item) => {
            const project = projectMap.get(item.slug)
            if (!project) return null
            const layout = CANVAS_LAYOUTS[item.slug]
            if (layout) {
              const href = `/${locale}/work/${item.slug}`
              const ariaLabel = `${dict.ui.openProject}: ${project.card.title}`
              return (
                <Fragment key={item.slug}>
                  {layout.items.map((subItem) => (
                    <CanvasItem
                      key={subItem.id}
                      item={{ ...subItem, src: localizeSrc(subItem.src, locale) }}
                      slug={item.slug}
                      href={href}
                      ariaLabel={ariaLabel}
                      position={getPosition(item.slug, subItem.id)}
                      onPositionChange={(pos) => setPosition(item.slug, subItem.id, pos)}
                      onDragStateChange={(dragging) => {
                        itemDragRef.current = dragging
                      }}
                    />
                  ))}
                </Fragment>
              )
            }
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

        <ResetLayoutButton
          visible={hasCustomLayout}
          onReset={reset}
          label={dict.ui.resetLayout ?? 'Reset layout'}
        />

        {/* Drag-to-explore hint — mobile/tablet only, fades out on first interaction */}
        <AnimatePresence>
          {viewport && !isDesktop && !hasInteracted && !reduceMotion && (
            <motion.div
              key="drag-hint"
              className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-white backdrop-blur-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.4, ease: 'easeOut' } }}
              exit={{ opacity: 0, y: 4, transition: { duration: 0.3, ease: 'easeIn' } }}
            >
              {/* Hand / swipe icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 11V6a2 2 0 1 1 4 0v5m0 0V9a2 2 0 1 1 4 0v2m0 0v-1a2 2 0 1 1 4 0v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6v-1a2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-sans text-sm font-medium tracking-wide">{dict.ui.dragHint}</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
  )
}
