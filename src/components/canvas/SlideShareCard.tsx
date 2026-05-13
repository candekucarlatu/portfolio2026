'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ProjectCard as ProjectCardData } from '@/lib/content/schema'

interface SlideShareCardProps {
  card: ProjectCardData
  href: string
  ariaLabel: string
}

// Group bounding box on canvas: x=203, y=840, w=652, h=812
// Group origin (Figma 0,0) maps to container (0,0) = top-left of bounding box
// Figma bbox: left=-364, top=409 → container_x = figma_x + 364, container_y = figma_y - 409
const W = 652
const H = 812


function Inner({ card, href, ariaLabel }: SlideShareCardProps) {
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

      {/* 10 ── Poster (illustration pinned to board) */}
      {/* Figma 439:12795: outer left=-273.81 top=510 w=240.848 h=239.704 → container left=90 top=101 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 90, top: 101, width: 241, height: 240 }}
      >
        <div style={{ transform: 'rotate(-2.57deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 231,
              height: 230,
              position: 'relative',
              boxShadow: '4px 4px 8px 0px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/slideshare/poster.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '125.68%',
                maxWidth: 'none',
                objectFit: 'cover',
                objectPosition: 'top',
              }}
            />
          </div>
        </div>
      </div>

      {/* 11 ── Pinza for poster — hole-aligned: left=129 top=14 */}
      <Image
        src="/canvas/slideshare/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 129, top: 14 }}
        aria-hidden
      />

      {/* 1 ── Shelf composite (single combined image — drop shelf.png to replace) */}
      {/* Estante group (450:9289): Figma left=-364 top=769 → container left=0 top=360 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/slideshare/shelf.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{ left: 0, top: 360, width: 652, maxWidth: 'none' }}
      />

      {/* 8 ── Case Study sticky note */}
      {/* Figma 439:12788: inner 318×178 rotated 1.51° → outer ≈324×186, pos left=363 top=262 */}
      <div className="absolute" style={{ left: 363, top: 262, width: 324, height: 186 }}>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative"
            style={{
              width: 318,
              height: 178,
              backgroundColor: '#ffebca',
              filter: 'drop-shadow(2px 5px 5px rgba(0,0,0,0.1))',
              transform: 'rotate(1.51deg)',
              transformOrigin: 'center',
            }}
          >
            {/* Title — Caveat Bold 20px #1f1a14 line-height:normal */}
            <p
              className="font-script absolute font-bold"
              style={{ left: 22.13, top: 42.43, width: 266.698, fontSize: 20, color: '#1f1a14', lineHeight: 'normal' }}
            >
              {card.title}
            </p>

            {/* Line 1 — equal margin: left=24.68, right=24.68, width=318-2×24.68=268.64 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 24.68, top: 62.21, width: 268.64, height: 3.774, overflow: 'visible' }}
            >
              <div style={{ transform: 'rotate(-0.29deg) skewX(-0.65deg)', flexShrink: 0 }}>
                <div style={{ width: 268.63, height: 2.29, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-43.66% -0.34% -43.67% -0.34%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/canvas/slideshare/linea.svg"
                      alt=""
                      aria-hidden
                      style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Line 2 — equal margin: left=22.96, right=22.96, width=318-2×22.96=272.08 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 22.96, top: 87.11, width: 272.08, height: 4.584, overflow: 'visible' }}
            >
              <div style={{ transform: 'rotate(-0.29deg) skewX(-0.65deg)', flexShrink: 0 }}>
                <div style={{ width: 272.07, height: 3.09, position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: '-32.36% -0.34%' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/canvas/slideshare/linea1.svg"
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
              style={{ left: 18.88, top: 104.54, width: 280.092, fontSize: 18, lineHeight: 1.35, color: '#1f1a14' }}
            >
              {card.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 9 ── Pinza for sticky note — hole-aligned: left=509 top=170 */}
      <Image
        src="/canvas/slideshare/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 509, top: 170 }}
        aria-hidden
      />

    </Link>
  )
}

// ── Canvas version ──────────────────────────────────────────────────────────
export function SlideShareCard({ card, href, ariaLabel }: SlideShareCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="absolute touch-none"
      style={{ left: 203, top: 840, width: W, height: H, zIndex: hovered ? 10 : 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.015, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
    >
      <Inner card={card} href={href} ariaLabel={ariaLabel} />
    </motion.div>
  )
}
