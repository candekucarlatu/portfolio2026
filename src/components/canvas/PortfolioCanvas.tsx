'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '@/lib/content/schema'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { AboutMeCard } from './AboutMeCard'
import { DecorItem } from './DecorItem'
import { ProjectCard } from './ProjectCard'
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

function getCenteredOffset(viewport: ViewportSize) {
  const cx = ABOUT_ME_RECT.x + ABOUT_ME_RECT.w / 2
  const cy = ABOUT_ME_RECT.y + ABOUT_ME_RECT.h / 2
  return {
    x: viewport.width / 2 - cx,
    y: viewport.height / 2 - cy,
  }
}

function getDragConstraints(viewport: ViewportSize) {
  const left = Math.min(0, viewport.width - BOARD_WIDTH)
  const top = Math.min(0, viewport.height - BOARD_HEIGHT)
  const right = Math.max(0, viewport.width - BOARD_WIDTH)
  const bottom = Math.max(0, viewport.height - BOARD_HEIGHT)
  return { left, top, right, bottom }
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
    const initial = getCenteredOffset(viewport)
    const constraints = getDragConstraints(viewport)
    const clampedX = Math.max(constraints.left, Math.min(constraints.right, initial.x))
    const clampedY = Math.max(constraints.top, Math.min(constraints.bottom, initial.y))
    x.set(clampedX)
    y.set(clampedY)
  }, [viewport, x, y])

  // Trackpad / wheel panning
  useEffect(() => {
    const el = containerRef.current
    if (!el || !viewport) return
    const constraints = getDragConstraints(viewport)

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      x.set(Math.max(constraints.left, Math.min(constraints.right, x.get() - e.deltaX)))
      y.set(Math.max(constraints.top, Math.min(constraints.bottom, y.get() - e.deltaY)))
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [viewport, x, y])

  const handleDragStart = useCallback(() => setHasInteracted(true), [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      rawMouseX.set(e.clientX - rect.left - rect.width / 2)
      rawMouseY.set(e.clientY - rect.top - rect.height / 2)
    },
    [rawMouseX, rawMouseY, reduceMotion],
  )

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0)
    rawMouseY.set(0)
  }, [rawMouseX, rawMouseY])

  const projectMap = new Map(projects.map((p) => [p.slug, p]))
  const constraints = viewport ? getDragConstraints(viewport) : undefined

  return (
      <div
        ref={containerRef}
        className="bg-paper canvas-scroll-hidden fixed inset-0 touch-none overflow-hidden select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          drag={!reduceMotion}
          dragConstraints={constraints}
          dragElastic={0.06}
          dragMomentum
          dragTransition={{ power: 0.18, timeConstant: 320, bounceStiffness: 280, bounceDamping: 28 }}
          onDragStart={handleDragStart}
          style={{
            x,
            y,
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            backgroundImage: 'url(/canvas/bg-pegboard-tile.png)',
            backgroundSize: '305px 232px',
            backgroundRepeat: 'repeat',
          }}
          className="motion-safe:animate-board-fade-in absolute top-0 left-0 cursor-grab will-change-transform active:cursor-grabbing"
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

        {/* Drag hint — fades after first interaction */}
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
