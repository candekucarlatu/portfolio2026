'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ProjectCard as ProjectCardData } from '@/lib/content/schema'

interface KaplanCardProps {
  card: ProjectCardData
  href: string
  ariaLabel: string
}

// Group bounding box on canvas: x=1588, y=186, w=695, h=658
// Figma bbox: left=1021, top=-245 → container_x = figma_x - 1021, container_y = figma_y + 245
const W = 695
const H = 658


function Inner({ card, href, ariaLabel }: KaplanCardProps) {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="focus-visible:outline-accent relative block h-full w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8"
      onPointerDown={(e) => { dragStartRef.current = { x: e.clientX, y: e.clientY } }}
      onClickCapture={(e) => {
        const s = dragStartRef.current
        if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 8) {
          e.preventDefault()
          e.stopPropagation()
        }
        dragStartRef.current = null
      }}
    >
      {/* ── Z-ORDER: bottom → top ── */}

      {/* 0 ── Shelf composite (single combined image — drop shelf.png to replace) */}
      {/* Covers the full card bounding box: 695×658, transparent bg shows pegboard */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/kaplan/shelf.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{ left: 0, top: 0, width: 695, height: 658, maxWidth: 'none', objectFit: 'contain', objectPosition: 'top left' }}
      />

      {/* 1 ── Light-blue sticky note (Evidence 3) */}
      {/* Figma 439:12828: wrapper ~285×192 */}
      <div className="absolute" style={{ left: 43, top: 101, width: 285, height: 192 }}>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative"
            style={{
              width: 280,
              height: 185,
              backgroundColor: '#d3effe',
              filter: 'drop-shadow(2px 5px 5px rgba(0,0,0,0.1))',
              transform: 'rotate(1.51deg)',
              transformOrigin: 'center',
            }}
          >
            {/* Title — Caveat Bold 20px #1f1a14 line-height:normal */}
            <p
              className="font-script absolute font-bold"
              style={{ left: 21.89, top: 33.26, width: 237.577, fontSize: 20, color: '#1f1a14', lineHeight: 'normal' }}
            >
              {card.title}
            </p>

            {/* Line 1 — Figma: outer left=24.33 top=50.28 w=255.259 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 24.33, top: 50.28, width: 255.259, height: 3.53, overflow: 'visible' }}
            >
              <div style={{ transform: 'rotate(-0.28deg) skewX(-0.62deg)', flexShrink: 0 }}>
                <div style={{ width: 255.248, height: 2.29, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-43.66% -0.39% -43.68% -0.39%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/canvas/kaplan/linea.svg"
                      alt=""
                      aria-hidden
                      style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line 2 — Figma: outer left=22.65 top=75.84 w=248.244 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 22.65, top: 75.84, width: 248.244, height: 4.296, overflow: 'visible' }}
            >
              <div style={{ transform: 'rotate(-0.28deg) skewX(-0.62deg)', flexShrink: 0 }}>
                <div style={{ width: 248.229, height: 3.09, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-32.36% -0.4%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/canvas/kaplan/linea1.svg"
                      alt=""
                      aria-hidden
                      style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle — Caveat Regular 18px #1f1a14 leading-1.35 */}
            <p
              className="font-script absolute font-normal"
              style={{ left: 20.09, top: 94.33, width: 256.397, fontSize: 18, lineHeight: 1.35, color: '#1f1a14' }}
            >
              {card.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2 ── Pinza for sticky — ABOVE sticky (z-order) */}
      {/* Figma: left=1181 top=-245 → container left=160 top=0 */}
      <Image
        src="/canvas/kaplan/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 160, top: 0 }}
        aria-hidden
      />

    </Link>
  )
}

// ── Canvas version ──────────────────────────────────────────────────────────
export function KaplanCard({ card, href, ariaLabel }: KaplanCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="absolute touch-none"
      style={{ left: 1588, top: 186, width: W, height: H, zIndex: hovered ? 10 : 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.015, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
    >
      <Inner card={card} href={href} ariaLabel={ariaLabel} />
    </motion.div>
  )
}

