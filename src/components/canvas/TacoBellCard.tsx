'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ProjectCard as ProjectCardData } from '@/lib/content/schema'

interface TacoBellCardProps {
  card: ProjectCardData
  href: string
  ariaLabel: string
}

// Group bounding box on canvas: x=372, y=74, w=508, h=714
// Group origin (MCP 0,0) in container coords: (196, 357)
// container_x = 196 + mcp_left, container_y = 357 + mcp_top
const W = 508
const H = 714

function Inner({ card, href, ariaLabel }: TacoBellCardProps) {
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

      {/* 1 ── Case Study sticky (bottom layer) */}
      {/* MCP: left=-118 top=-61.78 wrapper w=254 h=198 */}
      <div className="absolute" style={{ left: 78, top: 295, width: 254, height: 198 }}>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative"
            style={{
              width: 249,
              height: 191,
              backgroundColor: '#e5dbfc',
              boxShadow: '2px 5px 5px rgba(0,0,0,0.1)',
              transform: 'rotate(1.51deg)',
              transformOrigin: 'center',
            }}
          >
            {/* Title — Caveat Bold 18px #1f1a14 line-height:normal */}
            <p
              className="font-script absolute font-bold"
              style={{ left: 22, top: 33, width: 212, fontSize: 18, color: '#1f1a14', lineHeight: 'normal' }}
            >
              {card.title}
            </p>

            {/* Line 1 — at top=51.53, h=2.29 */}
            <div className="absolute" style={{ left: 24, top: 51, width: 208, height: 2, overflow: 'visible' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/tacobell/linea.svg"
                alt=""
                aria-hidden
                style={{ position: 'absolute', inset: '-43.67% -0.48% -43.68% -0.48%', display: 'block', width: '100%', height: '100%' }}
              />
            </div>

            {/* Line 2 — at top=77.04, h=3.09 */}
            <div className="absolute" style={{ left: 23, top: 77, width: 202, height: 3, overflow: 'visible' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/canvas/tacobell/linea1.svg"
                alt=""
                aria-hidden
                style={{ position: 'absolute', inset: '-32.37% -0.49%', display: 'block', width: '100%', height: '100%' }}
              />
            </div>

            {/* Subtitle — Caveat Regular 16px #1f1a14 leading-1.35 */}
            <p
              className="font-script absolute font-normal"
              style={{ left: 19, top: 92, width: 203, fontSize: 16, lineHeight: 1.35, color: '#1f1a14' }}
            >
              {card.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 2 ── Pinza for sticky */}
      <Image
        src="/canvas/tacobell/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 156, top: 230 }}
        aria-hidden
      />

      {/* 3 ── Shadow Card 02 */}
      {/* MCP: centered left=127.67 top=95.75 w=185 h=247 rotate(-0.19deg) */}
      <div className="absolute" style={{ left: 324, top: 453, width: 185, height: 247 }}>
        <div className="flex h-full w-full items-center justify-center" style={{ transform: 'rotate(-0.19deg)' }}>
          <div className="bg-black opacity-15 blur-[10px]" style={{ width: 184, height: 246 }} />
        </div>
      </div>

      {/* 4 ── Card 02 */}
      {/* MCP: left=120.47 top=90.41 w=186 h=248 */}
      <Image
        src="/canvas/tacobell/card02.png"
        alt=""
        width={186}
        height={248}
        sizes="186px"
        quality={100}
        className="pointer-events-none absolute select-none rounded-[11px] object-contain"
        style={{ left: 316, top: 447 }}
        aria-hidden
      />

      {/* 5 ── Shadow Card 01 */}
      {/* MCP: centered left=75.35 top=87.13 w=219 h=270 rotate(9.81deg) */}
      <div className="absolute" style={{ left: 271, top: 444, width: 219, height: 270 }}>
        <div className="flex h-full w-full items-center justify-center" style={{ transform: 'rotate(9.81deg)' }}>
          <div className="bg-black opacity-15 blur-[10px]" style={{ width: 180, height: 243 }} />
        </div>
      </div>

      {/* 6 ── Card 01 (rotated front card) */}
      {/* MCP: centered left=67 top=76 w=226 h=276 rotate(10deg) */}
      <div className="absolute" style={{ left: 263, top: 433, width: 226, height: 276 }}>
        <div className="flex h-full w-full items-center justify-center" style={{ transform: 'rotate(10deg)' }}>
          <Image
            src="/canvas/tacobell/card01.png"
            alt=""
            width={185}
            height={248}
            sizes="185px"
            quality={100}
            className="pointer-events-none block object-contain select-none"
          />
        </div>
      </div>

      {/* 8 ── Pinza for Paconaut cards */}
      <Image
        src="/canvas/tacobell/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 416, top: 351 }}
        aria-hidden
      />

      {/* 9 ── Kiosk photo (polaroid) */}
      {/* MCP: centered left=76.04 top=-262.47 w=226 h=253 rotate(6.36deg) */}
      <div className="absolute" style={{ left: 272, top: 95, width: 226, height: 253 }}>
        <div className="flex h-full w-full items-center justify-center" style={{ transform: 'rotate(6.36deg)' }}>
          <div style={{ width: 202, height: 232, overflow: 'hidden' }}>
            <Image
              src="/canvas/tacobell/photo.png"
              alt=""
              width={202}
              height={232}
              sizes="202px"
              quality={100}
              className="pointer-events-none block h-full w-full object-cover select-none"
            />
          </div>
        </div>
      </div>

      {/* 10 ── Image 377 (phone screenshot) */}
      {/* MCP: centered left=221.38 top=-256.37 w=115 h=217 rotate(-7.32deg) */}
      <div className="absolute flex items-center justify-center" style={{ left: 417, top: 101, width: 115, height: 217 }}>
        <div style={{ transform: 'rotate(-7.32deg)', flexShrink: 0 }}>
          <div style={{ width: 90, height: 207, position: 'relative', boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.1)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/tacobell/image377.png"
              alt=""
              aria-hidden
              className="pointer-events-none select-none"
              style={{ position: 'absolute', inset: 0, maxWidth: 'none', width: '100%', height: '100%', objectPosition: 'bottom' }}
            />
          </div>
        </div>
      </div>

      {/* 11 ── Pinza for kiosk */}
      <Image
        src="/canvas/tacobell/pinza.png"
        alt=""
        width={46}
        height={139}
        sizes="46px"
        quality={100}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 416, top: 42 }}
        aria-hidden
      />

      {/* 12 ── Llavero */}
      {/* MCP: centered left=-220.85 top=-34.97 w=162 h=326 rotate(-9.5deg) */}
      <div className="absolute" style={{ left: -25, top: 322, width: 162, height: 326 }}>
        <div
          className="flex h-full w-full items-center justify-center"
          style={{ transform: 'rotate(-9.5deg)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canvas/tacobell/llavero.png"
            alt=""
            aria-hidden
            className="pointer-events-none select-none"
            style={{ width: 112, height: 312, objectFit: 'contain', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* 13 ── Gancho (llavero hook) — top of z-order, above sticky */}
      {/* MCP: left=-195 top=-33 w=48 h=49 */}
      <div className="absolute" style={{ left: 1, top: 324, width: 48, height: 49 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/tacobell/gancho.png"
          alt=""
          aria-hidden
          className="pointer-events-none select-none"
          style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
        />
      </div>
    </Link>
  )
}

// ── Canvas version ──────────────────────────────────────────────────────────
export function TacoBellCard({ card, href, ariaLabel }: TacoBellCardProps) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="absolute touch-none"
      style={{ left: 372, top: 74, width: W, height: H, zIndex: hovered ? 10 : 1 }}
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
export function TacoBellCardMobile({ card, href, ariaLabel }: TacoBellCardProps) {
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
