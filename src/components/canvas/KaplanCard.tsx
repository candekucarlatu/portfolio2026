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

// Shared mask for all shelf objects (trapezoid shape, 582×330)
// mask-mode: alpha — use alpha channel of mask SVG
// mask-composite: intersect — intersect with element alpha
// mask-clip: no-clip — allow mask to extend beyond element border-box
const shelfMask = (pos: string) => ({
  maskImage: 'url(/canvas/kaplan/mask.svg)',
  maskRepeat: 'no-repeat' as const,
  maskPosition: pos,
  maskSize: '582px 330px',
  maskMode: 'alpha' as const,
  maskComposite: 'intersect' as const,
  maskClip: 'no-clip' as const,
  WebkitMaskImage: 'url(/canvas/kaplan/mask.svg)',
  WebkitMaskRepeat: 'no-repeat' as const,
  WebkitMaskPosition: pos,
  WebkitMaskSize: '582px 330px',
  WebkitMaskComposite: 'source-in' as const,
})

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

      {/* 3 ── Estante shadow */}
      {/* Figma: left=1074 top=267 w=554 h=134 */}
      <div
        className="absolute bg-black opacity-35"
        style={{ left: 53, top: 512, width: 554, height: 134, filter: 'blur(50px)' }}
      />

      {/* 4 ── Estante (shelf) */}
      {/* Figma: left=1021 top=187.6 w=695.195 h=225.404 */}
      <div className="absolute" style={{ left: 0, top: 433, width: 695, height: 225 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/kaplan/estante.png"
          alt=""
          aria-hidden
          className="pointer-events-none select-none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
        />
      </div>

      {/* 5 ── Notebook (image 19 — masked, slightly rotated) */}
      {/* Figma flex: left=1290.88 top=-58.36 w=296.796 h=389.355 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 270, top: 187, width: 297, height: 389 }}
      >
        <div style={{ transform: 'rotate(-1.64deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 286,
              height: 381,
              position: 'relative',
              ...shelfMask('-244.881px -4.642px'),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/kaplan/notebook.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'bottom' }}
            />
          </div>
        </div>
      </div>

      {/* 6 ── Certificate (image 21 — masked) */}
      {/* Figma: absolute left=1073 top=50 w=413 h=276 */}
      <div
        className="absolute"
        style={{
          left: 52,
          top: 295,
          width: 413,
          height: 276,
          ...shelfMask('-27px -113px'),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/kaplan/certificate.png"
          alt=""
          aria-hidden
          className="pointer-events-none select-none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'bottom' }}
        />
      </div>

      {/* 7 ── Pencil shadow — clipPath clips at shelf surface (card y=433, container top=268 → 49% from bottom) */}
      {/* Figma flex: left=1511.16 top=22.99 w=109.636 h=321.8 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 490, top: 268, width: 110, height: 322, clipPath: 'inset(0 0 49% 0)' }}
      >
        <div style={{ transform: 'rotate(-102.25deg) skewX(0.16deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 320,
              height: 43,
              position: 'relative',
              filter: 'blur(4px)',
              opacity: 0.15,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/kaplan/lapiz-shadow.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* 8 ── Pencil — clipPath clips at shelf surface (card y=433, container top=254 → 44.6% from bottom) */}
      {/* Figma flex: left=1517 top=9 w=95.12 h=322.686 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 496, top: 254, width: 95, height: 323, clipPath: 'inset(0 0 44.6% 0)' }}
      >
        <div style={{ transform: 'rotate(-99.55deg) skewX(0.15deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 320,
              height: 43,
              position: 'relative',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/kaplan/lapiz.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
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

