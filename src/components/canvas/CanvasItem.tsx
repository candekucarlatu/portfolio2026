'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { useMemo, useRef } from 'react'
import type { CanvasItem as CanvasItemData } from '@/lib/canvas/manifest'
import { getNearestHole } from './pegboardGrid'

const PIN_W = 28
const PIN_H = 139

// ─── Visited sticker shapes ───────────────────────────────────────────────────
export type StickerShape = 'burst' | 'blob' | 'nametag' | 'seal' | 'badge'

const STICKER_META: Record<StickerShape, { rotation: number }> = {
  burst:   { rotation: -6  },
  blob:    { rotation: 10  },
  nametag: { rotation: -10 },
  seal:    { rotation: 8   },
  badge:   { rotation: -14 },
}

function VisitedSticker({ shape, label }: { shape: StickerShape; label: string }) {
  const O = '#f2612e'
  // Soft sticker shadow — works on clip-path shapes via filter
  const shadow = 'drop-shadow(1px 2px 4px rgba(0,0,0,0.18))'
  // Text block always fills container width so textAlign:center works on all lines
  const txt: React.CSSProperties = {
    display: 'block',
    width: '100%',
    fontFamily: 'var(--font-caveat), cursive',
    fontWeight: 700,
    fontSize: 13,
    lineHeight: 1.25,
    color: '#fff',
    textAlign: 'center',
    pointerEvents: 'none',
    userSelect: 'none',
  }

  if (shape === 'burst') {
    const clipPath = 'polygon(50% 0%, 54% 16%, 63% 5%, 65% 22%, 76% 13%, 74% 30%, 88% 25%, 82% 41%, 99% 42%, 89% 55%, 100% 62%, 87% 67%, 95% 77%, 80% 78%, 84% 91%, 69% 88%, 68% 100%, 55% 92%, 50% 100%, 45% 92%, 32% 100%, 31% 88%, 16% 91%, 20% 78%, 5% 77%, 13% 67%, 0% 62%, 11% 55%, 1% 42%, 18% 41%, 12% 25%, 26% 30%, 24% 13%, 35% 22%, 37% 5%, 46% 16%)'
    return (
      <div style={{ filter: `drop-shadow(0 0 2.5px #fff) drop-shadow(0 0 1.5px #fff) ${shadow}` }}>
        <div style={{
          width: 118, height: 118,
          background: O,
          clipPath,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '28px 22px',
          boxSizing: 'border-box',
        }}>
          <div style={txt}>{label}</div>
        </div>
      </div>
    )
  }

  if (shape === 'blob') {
    return (
      <div style={{ filter: shadow }}>
        <div style={{
          background: O,
          borderRadius: '42% 58% 70% 30% / 42% 50% 60% 52%',
          border: '2.5px solid rgba(255,255,255,0.9)',
          padding: '18px 26px',
          width: 140,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          <div style={{ ...txt, fontSize: 14 }}>{label}</div>
        </div>
      </div>
    )
  }

  if (shape === 'nametag') {
    return (
      <div style={{ filter: shadow }}>
        <div style={{
          background: O,
          borderRadius: 7,
          border: '2.5px solid rgba(255,255,255,0.9)',
          padding: '13px 20px',
          width: 128,
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          <div style={{
            position: 'absolute', inset: 6,
            border: '1.5px solid rgba(255,255,255,0.5)',
            borderRadius: 3,
            pointerEvents: 'none',
          }} />
          <div style={{ ...txt, fontSize: 14, position: 'relative' }}>{label}</div>
        </div>
      </div>
    )
  }

  if (shape === 'seal') {
    const clipPath = 'polygon(50% 0%, 56% 5%, 63% 2%, 68% 8%, 75% 6%, 79% 13%, 87% 12%, 89% 20%, 97% 21%, 97% 29%, 100% 32%, 98% 40%, 100% 44%, 97% 50%, 100% 56%, 98% 60%, 100% 68%, 97% 71%, 97% 79%, 89% 80%, 87% 88%, 79% 87%, 75% 94%, 68% 92%, 63% 98%, 56% 95%, 50% 100%, 44% 95%, 37% 98%, 32% 92%, 25% 94%, 21% 87%, 13% 88%, 11% 80%, 3% 79%, 3% 71%, 0% 68%, 2% 60%, 0% 56%, 3% 50%, 0% 44%, 2% 40%, 0% 32%, 3% 29%, 3% 21%, 11% 20%, 13% 12%, 21% 13%, 25% 6%, 32% 8%, 37% 2%, 44% 5%)'
    return (
      <div style={{ filter: `drop-shadow(0 0 2.5px #fff) drop-shadow(0 0 1.5px #fff) ${shadow}` }}>
        <div style={{
          width: 116, height: 116,
          background: O,
          clipPath,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '26px 20px',
          boxSizing: 'border-box',
        }}>
          <div style={txt}>{label}</div>
        </div>
      </div>
    )
  }

  // badge — About Me
  return (
    <div style={{ filter: shadow }}>
      <div style={{
        width: 98, height: 98,
        background: O,
        borderRadius: '50%',
        border: '2.5px solid rgba(255,255,255,0.9)',
        boxShadow: 'inset 0 0 0 5px rgba(255,255,255,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '18px',
        boxSizing: 'border-box',
      }}>
        <div style={{ ...txt, fontSize: 13.5 }}>{label}</div>
      </div>
    </div>
  )
}

interface CanvasItemProps {
  item: CanvasItemData
  slug: string
  /** When omitted, item is drag-only (no click navigation). */
  href?: string
  ariaLabel: string
  /** Persisted position override (falls back to item.x / item.y). */
  position: { x: number; y: number } | null
  onPositionChange: (pos: { x: number; y: number }) => void
  /** Called when drag starts (true) or ends (false) so the parent can pause edge-pan. */
  onDragStateChange?: (dragging: boolean) => void
  /** Whether this item can be individually dragged. False on mobile so canvas pan works freely. */
  itemDragEnabled?: boolean
  /** Short label shown in the hover chip (desktop) and always-visible chip (mobile). */
  chipLabel?: string
  /** Whether this slug has been visited. */
  visited?: boolean
  /** Text shown in the visited sticker (only on stickerItem items). */
  visitedLabel?: string
  /** Shape variant for the visited sticker. */
  stickerShape?: StickerShape
  /** When true, converts this item to grayscale on visit. */
  grayscaleOnVisit?: boolean
  /** Vertical position of the sticker as a fraction of item height (default 0.28). */
  stickerTopRatio?: number
  /** Whether we're on desktop (≥1025px). Controls chip visibility. */
  isDesktop?: boolean
  /** Called on desktop hover with label + cursor client coords. */
  onChipHover?: (label: string, x: number, y: number) => void
  /** Called when cursor moves while hovering. */
  onChipHoverMove?: (x: number, y: number) => void
  /** Called when hover ends. */
  onChipHoverEnd?: () => void
}

export function CanvasItem({
  item,
  href,
  ariaLabel,
  position,
  onPositionChange,
  onDragStateChange,
  itemDragEnabled = true,
  chipLabel,
  visited = false,
  visitedLabel,
  stickerShape,
  grayscaleOnVisit = false,
  stickerTopRatio = 0.28,
  isDesktop = false,
  onChipHover,
  onChipHoverMove,
  onChipHoverEnd,
}: CanvasItemProps) {
  const router = useRouter()

  // For pin items: anchor.y can be negative (pin above PNG). Wrapper extends to include pin.
  const pinTopRelToPng = item.pin ? item.anchor.y : 0
  const pngTopInWrapper = Math.max(0, -pinTopRelToPng)
  const pinTopInWrapper = Math.max(0, pinTopRelToPng)
  const wrapperHeight = item.pin
    ? Math.max(item.h + pngTopInWrapper, pinTopInWrapper + PIN_H)
    : item.h

  // Initial position: auto-snap to nearest pegboard hole using anchor.
  const defaultSnapped = useMemo(() => {
    if (!item.pin) return { x: item.x, y: item.y }
    const anchorX = item.x + item.anchor.x
    const anchorY = item.y + item.anchor.y
    const hole = getNearestHole(anchorX, anchorY)
    return { x: hole.x - item.anchor.x, y: hole.y - item.anchor.y }
  }, [item])
  const baseX = position?.x ?? defaultSnapped.x
  const baseY = position?.y ?? defaultSnapped.y
  const offsetX = useMotionValue(0)
  const offsetY = useMotionValue(0)
  const draggedRef = useRef(false)

  const wrapperOffsetY = -pngTopInWrapper

  // Dog-ear size scales with item width: larger items get a bigger fold
  const dogEarSize = Math.round(Math.min(28, Math.max(18, item.w * 0.09)))

  return (
    <motion.div
      role={href ? 'link' : undefined}
      tabIndex={href ? 0 : undefined}
      aria-label={ariaLabel}
      drag={itemDragEnabled}
      dragMomentum={false}
      dragElastic={0}
      onPointerDownCapture={() => {
        draggedRef.current = false
      }}
      onDragStart={() => {
        draggedRef.current = true
        onDragStateChange?.(true)
      }}
      onDragEnd={() => {
        const dx = offsetX.get()
        const dy = offsetY.get()
        onDragStateChange?.(false)
        if (!draggedRef.current) {
          animate(offsetX, 0, { duration: 0.25, ease: [0.16, 1, 0.3, 1] })
          animate(offsetY, 0, { duration: 0.25, ease: [0.16, 1, 0.3, 1] })
          return
        }
        const newBaseX = baseX + dx
        const newBaseY = baseY + dy
        const anchorX = newBaseX + item.anchor.x
        const anchorY = newBaseY + item.anchor.y
        const hole = getNearestHole(anchorX, anchorY)
        const snappedX = hole.x - item.anchor.x
        const snappedY = hole.y - item.anchor.y
        const baseShiftX = snappedX - baseX
        const baseShiftY = snappedY - baseY
        offsetX.set(dx - baseShiftX)
        offsetY.set(dy - baseShiftY)
        onPositionChange({ x: snappedX, y: snappedY })
        animate(offsetX, 0, { duration: 0.28, ease: [0.16, 1, 0.3, 1] })
        animate(offsetY, 0, { duration: 0.28, ease: [0.16, 1, 0.3, 1] })
      }}
      onTap={() => {
        if (!draggedRef.current && href) {
          router.push(href)
        }
      }}
      onKeyDown={(event) => {
        if (href && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          router.push(href)
        }
      }}
      onHoverStart={() => {
        if (isDesktop && href && chipLabel) {
          // Initial position reported via onMouseMove below
        }
      }}
      onHoverEnd={() => {
        if (isDesktop) onChipHoverEnd?.()
      }}
      onMouseMove={(e: React.MouseEvent) => {
        if (!isDesktop || !href || !chipLabel) return
        onChipHoverMove
          ? onChipHoverMove(e.clientX, e.clientY)
          : onChipHover?.(chipLabel, e.clientX, e.clientY)
        // Fire hover with label on first move (covers onHoverStart timing)
        onChipHover?.(chipLabel, e.clientX, e.clientY)
      }}
      whileHover={
        item.pin && !item.links
          ? {
              rotate: [item.rotation - 2.5, item.rotation + 2.5, item.rotation - 1.5, item.rotation + 1.5, item.rotation],
              transition: {
                rotate: { duration: 1.4, ease: 'easeInOut' },
              },
            }
          : { scale: 1.015, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }
      }
      whileTap={{ scale: 0.985 }}
      style={{
        position: 'absolute',
        left: baseX,
        top: baseY + wrapperOffsetY,
        width: item.w,
        height: wrapperHeight,
        x: offsetX,
        y: offsetY,
        '--item-z': item.zIndex,
        rotate: item.rotation,
        transformOrigin: `${item.anchor.x}px ${pinTopInWrapper + 4}px`,
      } as unknown as React.CSSProperties}
      className={`canvas-item touch-none ${href ? 'cursor-pointer' : 'cursor-grab'} focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4 active:cursor-grabbing`}
    >
      {item.pin && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: item.anchor.x - PIN_W / 2,
            top: pinTopInWrapper,
            width: PIN_W,
            height: PIN_H,
            borderRadius: 999,
            background: 'linear-gradient(to right, #eeedea 89%, #f6f5ef 103.59%)',
            boxShadow:
              '4px 2px 8px rgba(0, 0, 0, 0.15), inset -2px -2px 4px rgba(214, 208, 198, 0.6)',
            zIndex: 1,
          }}
        />
      )}
      <Image
        src={item.src}
        alt=""
        width={item.w}
        height={item.h}
        sizes={`${item.w}px`}
        quality={90}
        style={{
          position: 'absolute',
          left: 0,
          top: pngTopInWrapper,
          width: item.w,
          height: item.h,
          pointerEvents: 'none',
          userSelect: 'none',
          filter: visited && grayscaleOnVisit ? 'grayscale(1)' : undefined,
          transition: 'filter 0.5s ease',
        }}
        draggable={false}
        priority
      />

      {/* Visited sticker — only on the primary stickerItem, drops in with bounce */}
      <AnimatePresence>
        {visited && item.stickerItem && visitedLabel && stickerShape && (
          <motion.div
            aria-hidden="true"
            key="visited-sticker"
            initial={{ y: -40, opacity: 0, rotate: STICKER_META[stickerShape].rotation, scale: 0.75 }}
            animate={{ y: 0, opacity: 1, rotate: STICKER_META[stickerShape].rotation, scale: 1 }}
            transition={{ type: 'spring', damping: 8, stiffness: 160, delay: 0.15 }}
            style={{
              position: 'absolute',
              top: pngTopInWrapper + Math.round(item.h * stickerTopRatio),
              left: '50%',
              translateX: '-50%',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <VisitedSticker shape={stickerShape} label={visitedLabel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile chip is now a global bottom chip in PortfolioCanvas — no per-item chip here */}

      {item.links?.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={link.ariaLabel}
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseEnter={() => onChipHoverEnd?.()}
          onMouseMove={(e) => e.stopPropagation()}
          className="canvas-link"
          style={{
            position: 'absolute',
            left: link.x,
            top: pngTopInWrapper + link.y,
            width: link.w,
            height: link.h,
            cursor: 'pointer',
            zIndex: 2,
          }}
        />
      ))}
      {/* On mobile (itemDragEnabled=false), use a real Link so Next.js
          intercepts the navigation and shows the drawer instead of the
          standalone page. Link hotspots above (z-index:2) take priority. */}
      {!itemDragEnabled && href && (
        <Link
          href={href}
          aria-hidden
          tabIndex={-1}
          style={{ position: 'absolute', inset: 0, zIndex: 1 }}
        />
      )}
    </motion.div>
  )
}
