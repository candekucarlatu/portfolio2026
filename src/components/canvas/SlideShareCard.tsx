'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
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

// CSS mask helpers (paper02-mask is a plain rectangle — clips bottom of slides)
const paperMask = (pos: string) => ({
  maskImage: 'url(/canvas/slideshare/paper02-mask.svg)',
  maskRepeat: 'no-repeat' as const,
  maskPosition: pos,
  maskSize: '389.097px 217.475px',
  WebkitMaskImage: 'url(/canvas/slideshare/paper02-mask.svg)',
  WebkitMaskRepeat: 'no-repeat' as const,
  WebkitMaskPosition: pos,
  WebkitMaskSize: '389.097px 217.475px',
})

const clipMask = (pos: string) => ({
  maskImage: 'url(/canvas/slideshare/clip-shadow-mask.svg)',
  maskRepeat: 'no-repeat' as const,
  maskPosition: pos,
  maskSize: '51.108px 90.44px',
  WebkitMaskImage: 'url(/canvas/slideshare/clip-shadow-mask.svg)',
  WebkitMaskRepeat: 'no-repeat' as const,
  WebkitMaskPosition: pos,
  WebkitMaskSize: '51.108px 90.44px',
})

const cuadernoMask = {
  maskImage: 'url(/canvas/slideshare/cuaderno-mask.svg)',
  maskRepeat: 'no-repeat' as const,
  maskPosition: '-20.892px -24.382px',
  maskSize: '287.085px 311.061px',
  WebkitMaskImage: 'url(/canvas/slideshare/cuaderno-mask.svg)',
  WebkitMaskRepeat: 'no-repeat' as const,
  WebkitMaskPosition: '-20.892px -24.382px',
  WebkitMaskSize: '287.085px 311.061px',
}

function Inner({ card, href, ariaLabel }: SlideShareCardProps) {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="focus-visible:outline-accent relative block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-8"
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

      {/* 1 ── Estante shadow */}
      {/* Figma: left=-286 top=1127 w=527 h=94 */}
      <div
        className="absolute bg-black blur-[50px] opacity-20"
        style={{ left: 78, top: 718, width: 527, height: 94 }}
      />

      {/* 2 ── Estante (shelf) */}
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

      {/* 3 ── Paper 02 (back blank slide) */}
      {/* Figma flex container: left=-133.86 top=921.88 w=352.135 h=196.466 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 230, top: 513, width: 352, height: 197 }}
      >
        <div style={{ transform: 'rotate(0.42deg)', flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: '#fff1de',
              width: 351,
              height: 194,
              boxShadow: '0px 4px 14px 0px rgba(0,0,0,0.15)',
              ...paperMask('-25.408px -58.965px'),
            }}
          />
        </div>
      </div>

      {/* 4 ── Paper 01 (middle blank slide) */}
      {/* Figma flex container: left=-124.38 top=924.29 w=348.853 h=196.916 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 240, top: 515, width: 349, height: 197 }}
      >
        <div style={{ transform: 'rotate(0.5deg)', flexShrink: 0 }}>
          <div
            style={{
              backgroundColor: '#fff1de',
              width: 347,
              height: 194,
              boxShadow: '0px 3px 10px 0px rgba(0,0,0,0.15)',
              ...paperMask('-34.889px -61.373px'),
            }}
          />
        </div>
      </div>

      {/* 5 ── Cover (front slide with SlideShare artwork) */}
      {/* Figma flex container: left=-133.07 top=926.72 w=350.505 h=199.923 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 231, top: 518, width: 351, height: 200 }}
      >
        <div style={{ transform: 'rotate(1deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 347,
              height: 194,
              position: 'relative',
              boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.2)',
              ...paperMask('-26.202px -63.8px'),
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/cover.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover' }}
              />
              {/* Texture overlay — mix-blend-mode overlay */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/texture.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', opacity: 0.4, mixBlendMode: 'overlay' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6 ── Binder clip shadow */}
      {/* Figma flex container: left=161.55 top=899.95 w=43.438 h=77.559 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 526, top: 491, width: 43, height: 78 }}
      >
        <div style={{ transform: 'rotate(-165deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 25,
              height: 74,
              position: 'relative',
              filter: 'blur(2px)',
              opacity: 0.1,
              ...clipMask('-1.43px -4.95px'),
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/shadow1.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', maxWidth: 'none', objectFit: 'cover', objectPosition: 'bottom' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7 ── Binder clip object */}
      {/* Figma flex container: left=160.43 top=899.95 w=43.438 h=77.559 */}
      <div
        className="absolute flex items-center justify-center"
        style={{ left: 524, top: 491, width: 43, height: 78 }}
      >
        <div style={{ transform: 'rotate(-165deg)', flexShrink: 0 }}>
          <div
            style={{
              width: 25,
              height: 74,
              position: 'relative',
              ...clipMask('-2.553px -4.95px'),
            }}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/clip-object.png"
                alt=""
                aria-hidden
                className="pointer-events-none select-none"
                style={{
                  position: 'absolute',
                  top: '-27.95%',
                  left: '-80.12%',
                  width: '409.64%',
                  height: '140.79%',
                  maxWidth: 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 8 ── Case Study sticky note */}
      {/* Figma flex container: left=34 top=665 w=254.296 h=197.897 */}
      <div className="absolute" style={{ left: 398, top: 256, width: 254, height: 198 }}>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative"
            style={{
              width: 249,
              height: 191,
              backgroundColor: '#ffebca',
              filter: 'drop-shadow(2px 5px 5px rgba(0,0,0,0.1))',
              transform: 'rotate(1.51deg)',
              transformOrigin: 'center',
            }}
          >
            {/* Title — Caveat Bold 18px #1f1a14 line-height:normal */}
            <p
              className="font-script absolute font-bold"
              style={{ left: 22.13, top: 42.43, width: 248.265, fontSize: 18, color: '#1f1a14', lineHeight: 'normal' }}
            >
              {card.title}
            </p>

            {/* Line 1 — h=2.29 */}
            <div className="absolute" style={{ left: 24.13, top: 60.7, width: 234.57, height: 2, overflow: 'visible' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/linea.svg"
                alt=""
                aria-hidden
                style={{ position: 'absolute', inset: '-43.67% -0.43% -43.68% -0.43%', display: 'block', width: '100%', height: '100%' }}
              />
            </div>

            {/* Line 2 — h=3.09 */}
            <div className="absolute" style={{ left: 22.88, top: 85.61, width: 236.001, height: 3, overflow: 'visible' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/slideshare/linea1.svg"
                alt=""
                aria-hidden
                style={{ position: 'absolute', inset: '-32.37% -0.42%', display: 'block', width: '100%', height: '100%' }}
              />
            </div>

            {/* Subtitle — Caveat Regular 16px #1f1a14 leading-1.35 */}
            <p
              className="font-script absolute font-normal"
              style={{ left: 18.88, top: 104.54, width: 248.582, fontSize: 16, lineHeight: 1.35, color: '#1f1a14' }}
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

      {/* 12 ── Cuaderno (notebook) */}
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

// ── Mobile version (scales to container width) ──────────────────────────────
export function SlideShareCardMobile({ card, href, ariaLabel }: SlideShareCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const measure = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    setScale(el.getBoundingClientRect().width / W)
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: H * scale }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: W,
          height: H,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Inner card={card} href={href} ariaLabel={ariaLabel} />
      </div>
    </div>
  )
}
