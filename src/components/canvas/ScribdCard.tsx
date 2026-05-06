'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ProjectCard as ProjectCardData } from '@/lib/content/schema'

interface ScribdCardProps {
  card: ProjectCardData
  href: string
  ariaLabel: string
}

// Group bounding box on canvas: x=1613, y=965, w=688, h=662
// Figma bbox: left=1046, top=534 → container_x = figma_x - 1046, container_y = figma_y - 534
const W = 688
const H = 662

function Inner({ card, href, ariaLabel }: ScribdCardProps) {
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
      {/* Covers the full card bounding box: 688×662, transparent bg shows pegboard */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/scribd/shelf.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{ left: 0, top: 0, width: 688, height: 662, maxWidth: 'none', objectFit: 'contain', objectPosition: 'top left' }}
      />

      {/* 8 ── Green sticky note (Evidence 1) */}
      {/* Figma 439:12759: inner 305×200 rotated 6.98° → outer ~325×236, pos left=390 top=377 */}
      <div className="absolute" style={{ left: 390, top: 377, width: 325, height: 236 }}>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative"
            style={{
              width: 305,
              height: 200,
              backgroundColor: '#d6f5db',
              filter: 'drop-shadow(2px 5px 5px rgba(0,0,0,0.1))',
              transform: 'rotate(6.98deg)',
              transformOrigin: 'center',
            }}
          >
            {/* Title — Caveat Bold 20px #1f1a14 line-height:normal */}
            <p
              className="font-script absolute font-bold"
              style={{ left: 22.38, top: 37.23, width: 260.88, fontSize: 20, color: '#1f1a14', lineHeight: 'normal' }}
            >
              {card.title}
            </p>

            {/* Line 1 — Figma: left=25.12 top=55.39 w=269.54 h=2.652 */}
            <div className="absolute" style={{ left: 25.12, top: 55.39, width: 269.54, height: 2.652, overflow: 'visible' }}>
              <div style={{ position: 'absolute', inset: '-37.71% -0.37% -37.72% -0.37%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/canvas/scribd/linea.svg"
                  alt=""
                  aria-hidden
                  style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
                />
              </div>
            </div>

            {/* Line 2 — Figma: left=23.68 top=84.94 w=273.837 h=3.578 */}
            <div className="absolute" style={{ left: 23.68, top: 84.94, width: 273.837, height: 3.578, overflow: 'visible' }}>
              <div style={{ position: 'absolute', inset: '-27.95% -0.37%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/canvas/scribd/linea1.svg"
                  alt=""
                  aria-hidden
                  style={{ display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
                />
              </div>
            </div>

            {/* Subtitle — Caveat Regular 18px #1f1a14 leading-1.35 */}
            <p
              className="font-script absolute font-normal"
              style={{ left: 21.09, top: 100.16, width: 245.63, fontSize: 18, lineHeight: 1.35, color: '#1f1a14' }}
            >
              {card.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 9 ── Pinza for sticky — ABOVE the sticky (z-order) */}
      {/* Figma: left=1640 top=838 → container left=594 top=304 */}
      <Image
        src="/canvas/scribd/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 594, top: 304 }}
        aria-hidden
      />

      {/* 10 ── Sticker (circular "ask me what I'm reading") */}
      {/* Figma flex: left=1141 top=942 size=91.05 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 95, top: 408, width: 91, height: 91 }}
      >
        <div style={{ transform: 'rotate(-7.64deg)', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canvas/scribd/sticker.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none"
            style={{ width: 81, height: 81, objectFit: 'cover', maxWidth: 'none' }}
          />
        </div>
      </div>

      {/* 11 ── Image 26 (document page screenshot, slightly tilted) */}
      {/* Figma 439:12766: left=1365 top=599 w=208.708 h=276.607 → container left=319 top=65 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 319, top: 65, width: 209, height: 277 }}
      >
        <div style={{ transform: 'rotate(-2.83deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 196,
              height: 267,
              position: 'relative',
              boxShadow: '4px 4px 4px 0px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/scribd/image26.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{
                position: 'absolute',
                top: '-6.53%',
                left: '-13.41%',
                width: '126.47%',
                height: '115.79%',
                maxWidth: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* 12 ── Image 25 (research notes screenshot) */}
      {/* Figma: left=1435.1 top=618.92 w=160.303 h=299.378 → container left=389 top=85 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 389, top: 85, width: 160, height: 299 }}
      >
        <div style={{ transform: 'rotate(-4.83deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 136,
              height: 289,
              position: 'relative',
              boxShadow: '2px 2px 6px 0px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/scribd/image25.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* 13 ── Pinza for screenshots — ABOVE screenshots (z-order) */}
      {/* Figma: left=1486 top=534 → container left=440 top=0 */}
      <Image
        src="/canvas/scribd/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 440, top: 0 }}
        aria-hidden
      />

    </Link>
  )
}

// ── Canvas version ──────────────────────────────────────────────────────────
export function ScribdCard({ card, href, ariaLabel }: ScribdCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="absolute touch-none"
      style={{ left: 1613, top: 965, width: W, height: H, zIndex: hovered ? 10 : 1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.015, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
    >
      <Inner card={card} href={href} ariaLabel={ariaLabel} />
    </motion.div>
  )
}

