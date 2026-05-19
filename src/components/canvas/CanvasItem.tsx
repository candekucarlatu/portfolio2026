'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { animate, motion, useMotionValue } from 'framer-motion'
import { useMemo, useRef } from 'react'
import type { CanvasItem as CanvasItemData } from '@/lib/canvas/manifest'
import { getNearestHole } from './pegboardGrid'

const PIN_W = 28
const PIN_H = 139

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
}

export function CanvasItem({
  item,
  href,
  ariaLabel,
  position,
  onPositionChange,
  onDragStateChange,
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
  // This ensures pins align with slots even when manifest positions are slightly off-grid.
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

  // motion.div spans the wrapper bounds, but is positioned by PNG top-left.
  // Use negative top offset for items with pin above PNG.
  const wrapperOffsetY = -pngTopInWrapper

  return (
    <motion.div
      role={href ? 'link' : undefined}
      tabIndex={href ? 0 : undefined}
      aria-label={ariaLabel}
      drag
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
        }}
        draggable={false}
        priority
      />
      {item.links?.map((link, i) => (
        <a
          key={i}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          aria-label={link.ariaLabel}
          onPointerDownCapture={(e) => e.stopPropagation()}
          className="canvas-link"
          style={{
            position: 'absolute',
            left: link.x,
            top: pngTopInWrapper + link.y,
            width: link.w,
            height: link.h,
            cursor: 'pointer',
          }}
        />
      ))}
    </motion.div>
  )
}
