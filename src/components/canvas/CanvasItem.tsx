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

// ─── Scalloped-circle (seal) SVG path ────────────────────────────────────────
// 2n alternating valley (Ri) and peak (Ro) points connected by cubic bezier
// curves whose control points are aligned to the CW tangent at each point.
// This produces smooth, rounded scallops with no sharp cusps.
function sealSvgPath(cx: number, cy: number, Ri: number, Ro: number, n: number): string {
  const pts: Array<{ x: number; y: number; a: number }> = []
  for (let i = 0; i < n; i++) {
    const va = (2 * Math.PI * i) / n - Math.PI / 2       // valley angle
    const pa = va + Math.PI / n                            // peak angle (midpoint)
    pts.push({ x: cx + Ri * Math.cos(va), y: cy + Ri * Math.sin(va), a: va })
    pts.push({ x: cx + Ro * Math.cos(pa), y: cy + Ro * Math.sin(pa), a: pa })
  }
  const N = pts.length
  const segs: string[] = [`M ${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`]
  for (let i = 0; i < N; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % N]
    const dist = Math.sqrt((q.x - p.x) ** 2 + (q.y - p.y) ** 2)
    const k = dist * 0.45
    // CW tangent at angle a = (-sin(a), cos(a))
    const cp1x = p.x - Math.sin(p.a) * k
    const cp1y = p.y + Math.cos(p.a) * k
    const cp2x = q.x + Math.sin(q.a) * k
    const cp2y = q.y - Math.cos(q.a) * k
    segs.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${q.x.toFixed(2)},${q.y.toFixed(2)}`)
  }
  return segs.join(' ') + ' Z'
}

// ─── Stamp perforated-edge path ───────────────────────────────────────────────
// Generates an SVG path string for a postage-stamp shape:
// a rectangle with outward semicircular notches on all four sides.
// w/h: outer dimensions; r: notch radius; gap: center-to-center spacing
function stampPath(w: number, h: number, r: number): string {
  const s: string[] = []

  const topCount = Math.round((w - 2 * r) / (r * 2.5))
  const topGap   = (w - 2 * r) / topCount
  const sidCount = Math.round((h - 2 * r) / (r * 2.5))
  const sidGap   = (h - 2 * r) / sidCount

  // ── Top edge: going RIGHT at y=r, bumps UP (outward) ─────────────────────
  s.push(`M ${r},${r}`)
  for (let i = 0; i < topCount; i++) {
    const cx = r + topGap * (i + 0.5)
    s.push(`L ${cx - r},${r}`)
    s.push(`A ${r},${r} 0 0,1 ${cx + r},${r}`)
  }

  // ── Right edge: going DOWN at x=w-r, bumps RIGHT (outward) ───────────────
  s.push(`L ${w - r},${r}`)
  for (let i = 0; i < sidCount; i++) {
    const cy = r + sidGap * (i + 0.5)
    s.push(`L ${w - r},${cy - r}`)
    s.push(`A ${r},${r} 0 0,1 ${w - r},${cy + r}`)
  }

  // ── Bottom edge: going LEFT at y=h-r, bumps DOWN (outward) ───────────────
  s.push(`L ${w - r},${h - r}`)
  for (let i = topCount - 1; i >= 0; i--) {
    const cx = r + topGap * (i + 0.5)
    s.push(`L ${cx + r},${h - r}`)
    s.push(`A ${r},${r} 0 0,1 ${cx - r},${h - r}`)
  }

  // ── Left edge: going UP at x=r, bumps LEFT (outward) ─────────────────────
  s.push(`L ${r},${h - r}`)
  for (let i = sidCount - 1; i >= 0; i--) {
    const cy = r + sidGap * (i + 0.5)
    s.push(`L ${r},${cy + r}`)
    s.push(`A ${r},${r} 0 0,1 ${r},${cy - r}`)
  }

  s.push('Z')
  return s.join(' ')
}

// ─── Visited sticker shapes ───────────────────────────────────────────────────
export type StickerShape = 'burst' | 'blob' | 'nametag' | 'seal' | 'badge'

const STICKER_META: Record<StickerShape, { rotation: number; color: string; textColor: string }> = {
  burst:   { rotation: -6,  color: '#4C029C', textColor: '#fff'     }, // TacoBell — purple
  blob:    { rotation: 10,  color: '#005DE8', textColor: '#fff'     }, // Kaplan   — blue
  nametag: { rotation: -10, color: '#0B8747', textColor: '#fff'     }, // Scribd   — green
  seal:    { rotation: 8,   color: '#FDBD6F', textColor: '#1C1C1C'  }, // SlideShare — yellow (dark text for contrast)
  badge:   { rotation: -14, color: '#f2612e', textColor: '#fff'     }, // About Me — orange
}

function VisitedSticker({ shape, label }: { shape: StickerShape; label: string }) {
  const { color, textColor } = STICKER_META[shape]
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
    color: textColor,
    textAlign: 'center',
    whiteSpace: 'pre-line',
    pointerEvents: 'none',
    userSelect: 'none',
  }

  // ── burst — TacoBell: dome/taco shape via CSS border-radius ─────────────────
  // CSS border-radius '80px 80px 0 0' on a 160×80 div = perfect semicircle top.
  // Text is always inside the container — no SVG arc geometry issues.
  if (shape === 'burst') {
    return (
      <div style={{ filter: `drop-shadow(0 0 2.5px #fff) drop-shadow(0 0 1.5px #fff) ${shadow}` }}>
        <div style={{
          position: 'relative',
          width: 160,
          height: 80,
          backgroundColor: color,
          borderRadius: '80px 80px 0 0',
        }}>
          {/* Inner ring — equal 10px inset all sides */}
          <div style={{
            position: 'absolute',
            top: 10, left: 10, right: 10, bottom: 10,
            borderRadius: '70px 70px 0 0',
            border: '2px solid rgba(0,0,0,0.22)',
            pointerEvents: 'none',
          }} />
          <div style={{
            ...txt,
            position: 'absolute',
            inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px 22px 0',
          }}>
            {label}
          </div>
        </div>
      </div>
    )
  }

  // ── blob — Kaplan: horizontal oval (like "NEW ARRIVAL" reference) ────────────
  if (shape === 'blob') {
    return (
      <div style={{ filter: shadow }}>
        <div style={{
          background: color,
          borderRadius: '50%',
          border: '2.5px solid rgba(255,255,255,0.85)',
          width: 152,
          height: 96,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
          position: 'relative',
        }}>
          {/* Concentric inner oval ring — white, matching the reference */}
          <div style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            border: '1.5px solid rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }} />
          <div style={{ ...txt, fontSize: 13, position: 'relative', padding: '0 22px', whiteSpace: 'pre-line' }}>{label}</div>
        </div>
      </div>
    )
  }

  // ── nametag — Scribd: rounded rect with thick dark inner border ──────────────
  if (shape === 'nametag') {
    return (
      <div style={{ filter: shadow }}>
        <div style={{
          background: color,
          borderRadius: 8,
          border: '2.5px solid rgba(255,255,255,0.85)',
          padding: '13px 20px',
          width: 130,
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxSizing: 'border-box',
        }}>
          {/* Thick dark inner rectangle — like a badge inset */}
          <div style={{
            position: 'absolute', inset: 6,
            border: '2.5px solid rgba(0,0,0,0.25)',
            borderRadius: 4,
            pointerEvents: 'none',
          }} />
          <div style={{ ...txt, fontSize: 13, position: 'relative' }}>{label}</div>
        </div>
      </div>
    )
  }

  // ── seal — SlideShare: smooth bezier scalloped circle ──────────────────────
  // 2n alternating valley/peak points connected by bezier curves with tangent-
  // aligned control points → smooth rounded scallops, no sharp cusps.
  if (shape === 'seal') {
    const W = 136, H = 136, cx = 68, cy = 68
    const sPath = sealSvgPath(cx, cy, 55, 61, 20)
    return (
      <div style={{ filter: shadow, position: 'relative' }}>
        <svg
          width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          {/* White outer border — matches Kaplan/Scribd */}
          <path d={sPath} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3" />
          <path d={sPath} fill={color} />
          {/* Inner ring — pushed closer to edge for more text breathing room */}
          <circle cx={cx} cy={cy} r={50} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
        </svg>
        <div style={{
          ...txt,
          position: 'absolute',
          top: 0, left: 0,
          width: W, height: H,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '14px',
        }}>
          {label}
        </div>
      </div>
    )
  }

  // ── badge — About Me: postage stamp shape ────────────────────────────────────
  // White perforated outer silhouette + orange inner rect — matches reference image.
  // r=8 makes bumps clearly visible; inset=16 gives a generous white border area.
  // No white drop-shadow here — the white SVG base IS the border, glow would blur bumps.
  const SW = 112, SH = 134, NR = 4   // stamp width/height, notch radius
  const inset = 9                     // orange body inset — defines white border width
  const bodyX = inset, bodyY = inset
  const bodyW = SW - inset * 2, bodyH = SH - inset * 2
  const path = stampPath(SW, SH, NR)
  return (
    <div style={{ filter: shadow }}>
      <div style={{ position: 'relative', width: SW, height: SH }}>
        {/* SVG: white perforated silhouette + orange body */}
        <svg
          viewBox={`0 0 ${SW} ${SH}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
          aria-hidden="true"
        >
          <path d={path} fill="#fff" />
          <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} fill={color} />
          {/* Inner dark border — consistent with Scribd/TacoBell/Kaplan */}
          <rect x={bodyX + 7} y={bodyY + 7} width={bodyW - 14} height={bodyH - 14}
            fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="2" />
        </svg>
        {/* Text flex-centered inside the orange area */}
        <div style={{
          position: 'absolute',
          left: bodyX,
          top: bodyY,
          width: bodyW,
          height: bodyH,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 8px',
          boxSizing: 'border-box',
        }}>
          <div style={txt}>{label}</div>
        </div>
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
  /** Horizontal offset of the sticker in px from center (positive = right). Default 0. */
  stickerXOffset?: number
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
  stickerXOffset = 0,
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
              translateX: `calc(-50% + ${stickerXOffset}px)`,
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
