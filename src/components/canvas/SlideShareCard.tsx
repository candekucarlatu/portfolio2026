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

const cuadernoMask = {
  maskImage: 'url(/canvas/slideshare/cuaderno-mask.svg)',
  maskRepeat: 'no-repeat' as const,
  maskPosition: '-20.892px -24.382px',
  maskSize: '287.085px 311.061px',
  maskMode: 'alpha' as const,
  maskComposite: 'intersect' as const,
  maskClip: 'no-clip' as const,
  WebkitMaskImage: 'url(/canvas/slideshare/cuaderno-mask.svg)',
  WebkitMaskRepeat: 'no-repeat' as const,
  WebkitMaskPosition: '-20.892px -24.382px',
  WebkitMaskSize: '287.085px 311.061px',
  WebkitMaskComposite: 'source-in' as const,
}

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

      {/* 1 ── Cuaderno (notebook) — BELOW shelf */}
      {/* Figma flex container: left=-310.66 top=792.82 w=278.977 h=351.891 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 53, top: 384, width: 279, height: 352 }}
      >
        <div style={{ transform: 'rotate(-3.84deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 257,
              height: 335,
              position: 'relative',
              ...cuadernoMask,
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/cuaderno-img.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none"
                style={{
                  position: 'absolute',
                  top: '-12.99%',
                  left: '-21.63%',
                  width: '131.98%',
                  height: '126.44%',
                  maxWidth: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2 ── Slides (cover + binder clip — single composite asset 779×435) */}
      {/* Rendered BEFORE the shelf so the estante front lip clips the bottom */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 225, top: 491, width: 358, height: 200 }}
      >
        <div style={{ transform: 'rotate(1deg)', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canvas/slideshare/Slides.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none"
            style={{ width: 358, height: 200, maxWidth: 'none', objectFit: 'fill', display: 'block' }}
          />
        </div>
      </div>

      {/* 3 ── Estante shadow */}
      {/* Figma: left=-286 top=1127 w=527 h=94 */}
      <div
        className="absolute bg-black blur-[50px] opacity-20"
        style={{ left: 78, top: 718, width: 527, height: 94 }}
      />

      {/* 4 ── Estante (shelf) — renders ON TOP of slides+cuaderno to clip their bottoms */}
      {/* Figma: left=-364 top=990 w=639 h=225 */}
      <div className="absolute" style={{ left: 0, top: 581, width: 639, height: 225 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/slideshare/estante.png"
          alt=""
          aria-hidden
          className="pointer-events-none select-none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
        />
      </div>

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

            {/* Line 1 — Figma: outer left=24.68 top=62.21 w=291.035 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 24.68, top: 62.21, width: 291.035, height: 3.774, overflow: 'visible' }}
            >
              <div style={{ transform: 'rotate(-0.29deg) skewX(-0.65deg)', flexShrink: 0 }}>
                <div style={{ width: 291.024, height: 2.29, position: 'relative' }}>
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

            {/* Line 2 — Figma: outer left=22.96 top=87.11 w=292.815 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ left: 22.96, top: 87.11, width: 292.815, height: 4.584, overflow: 'visible' }}
            >
              <div style={{ transform: 'rotate(-0.29deg) skewX(-0.65deg)', flexShrink: 0 }}>
                <div style={{ width: 292.799, height: 3.09, position: 'relative' }}>
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

      {/* 9 ── Pinza for sticky note */}
      {/* Figma: left=151 top=567 w=46 h=138.5 → container: left=515 top=158 */}
      <Image
        src="/canvas/slideshare/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 515, top: 158 }}
        aria-hidden
      />

      {/* 10 ── Poster (illustration pinned to board) */}
      {/* Figma flex container: left=-273.81 top=510 w=240.848 h=239.704 */}
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

      {/* 11 ── Pinza for poster */}
      {/* Figma: left=-228 top=409 w=46 h=138.5 → container: left=136 top=0 */}
      <Image
        src="/canvas/slideshare/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 136, top: 0 }}
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

