'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — Figma 486:9277
 *
 * Proportional absolute-position layout based on Figma canvas (1440px wide).
 * Y-axis shifted by +164px so Decoration 1 (top=-164 in Figma) starts at y=0.
 * Effective canvas size: 1440 × 1366px  →  padding-bottom: 94.86%
 *
 * All left/top/width values are % of container width (1440px base).
 * top% values are % of container HEIGHT (= 94.86% × container width ≡ 1366px scale).
 *
 * Figma source coordinates:
 *   Decoration 1   left:785  top:-164  w:535  h:387
 *   Decoration 2   left:155  top:870   w:502  h:332
 *   Profile bbox   left:96   top:48    w:661  h:812   rotate(1deg)  inner:647×801
 *   DP bbox        left:697  top:231   w:666  h:717   rotate(-2deg) inner:642×694
 *   Collage        left:191  top:103   w:493  h:215   rotate(1deg)
 *   Bio text       left:193  top:331   w:471
 *   Links          left:189  top:571   w:406
 *   DP Text 1      left:769  top:359   w:494
 *   DP Text 2      left:774  top:487
 *   DP Text 3      left:778  top:614
 *   DP Text 4      left:783  top:742
 *
 * Z-order (back→front): Decoration 1/2 (z-0) → DP panel+text (z-10) → Profile panel+text (z-20) → Collage+overlay (z-30)
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,          href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                        href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                 href: dict.contact.resumeUrl },
  ]

  // DP text top positions shifted: (figma_y + 164) / 1366
  const dpTexts = [
    { left: '53.45%', top: '38.28%' }, // (359+164)/1366
    { left: '53.76%', top: '47.63%' }, // (487+164)/1366
    { left: '54.07%', top: '57.01%' }, // (614+164)/1366
    { left: '54.38%', top: '66.39%' }, // (742+164)/1366
  ]

  return (
    /*
     * Outer container: relative, height driven by padding-bottom=94.86%
     * (= 1366/1440 — matches Figma canvas aspect ratio after y-shift).
     * All children are absolute and scale proportionally with container width.
     */
    <div className="relative w-full" style={{ paddingBottom: '94.86%' }}>

      {/* ── DECORATION 1 — top-right, z behind panels ────────────────── */}
      {/* Figma: left=785, top=-164 → shifted top=0. w=535 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%201.png"
        alt="" aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: '54.51%', top: '0%', width: '37.15%' }}
      />

      {/* ── DECORATION 2 — bottom-left, below Profile ────────────────── */}
      {/* Figma: left=155, top=870 → shifted top=1034. w=502 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%202.png"
        alt="" aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: '10.76%', top: '75.69%', width: '34.86%' }}
      />

      {/* ── DESIGN PRINCIPLES PANEL — z-10 ───────────────────────────── */}
      {/* Figma bbox: left=697, top=231 → shifted 395. w=666. rotate(-2deg) */}
      <div
        className="absolute z-10"
        style={{ left: '48.40%', top: '28.91%', width: '46.27%' }}
      >
        <Image
          src="/canvas/aboutme/sheet/Design%20Principles.png"
          alt="" aria-hidden
          width={1285}
          height={1389}
          className="pointer-events-none h-auto w-full"
          style={{ transform: 'rotate(-2deg)', transformOrigin: 'top left' }}
        />
      </div>

      {/* ── DESIGN PRINCIPLES TEXT — z-10 ────────────────────────────── */}
      {dpTexts.map((pos, i) => (
        <div
          key={i}
          className="absolute z-10"
          style={{ left: pos.left, top: pos.top, width: '34.32%', transform: 'rotate(-2deg)' }}
        >
          <div className="flex flex-col gap-[0.5em]">
            <p
              className="font-bold leading-[1.25]"
              style={{ fontSize: 'clamp(8px, 1.1vw, 16px)', color: '#1f1a14' }}
            >
              {s.principles[i].title}
            </p>
            <p
              className="leading-[1.65]"
              style={{ fontSize: 'clamp(7px, 1.1vw, 16px)', color: '#666159' }}
            >
              {s.principles[i].body}
            </p>
          </div>
        </div>
      ))}

      {/* ── PROFILE PANEL — z-20 (above DP, they touch) ─────────────── */}
      {/* Figma bbox: left=96, top=48 → shifted 212. w=661. rotate(1deg) */}
      <div
        className="absolute z-20"
        style={{ left: '6.67%', top: '15.52%', width: '45.89%' }}
      >
        <Image
          src="/canvas/aboutme/sheet/Profile.png"
          alt="" aria-hidden
          width={1294}
          height={1602}
          className="pointer-events-none h-auto w-full"
          style={{ transform: 'rotate(1deg)', transformOrigin: 'top left' }}
          priority
        />
      </div>

      {/* ── COLLAGE — z-30 ───────────────────────────────────────────── */}
      {/* Figma: left=191, top=103 → shifted 267. w=493. rotate(1deg) */}
      <div
        className="pointer-events-none absolute z-30"
        style={{ left: '13.26%', top: '19.54%', width: '34.24%', transform: 'rotate(1deg)' }}
      >
        <Image
          src="/canvas/aboutme/sheet/Collage.png"
          alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
          width={986}
          height={430}
          className="h-auto w-full"
        />
      </div>

      {/* ── BIO TEXT — z-30, rotate(1deg) ────────────────────────────── */}
      {/* Figma: left=193, top=331 → shifted 495. w=471 */}
      <div
        className="absolute z-30"
        style={{ left: '13.42%', top: '36.27%', width: '32.71%', transform: 'rotate(1deg)' }}
      >
        <div
          className="font-script flex flex-col gap-[0.6em] leading-[1.3] text-black"
          style={{ fontSize: 'clamp(10px, 1.4vw, 20px)' }}
        >
          <p>{s.bio1}</p>
          <p>{s.bio2}</p>
        </div>
      </div>

      {/* ── LINKS — z-30, rotate(1deg) ───────────────────────────────── */}
      {/* Figma: first item left=189, top=571 → shifted 735. w=406 */}
      <div
        className="absolute z-30"
        style={{ left: '13.10%', top: '53.85%', width: '28.23%', transform: 'rotate(1deg)' }}
      >
        {links.map(({ label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-baseline gap-[6%] py-[2.2%] transition-opacity hover:opacity-70"
          >
            <span
              className="text-ink shrink-0 font-semibold leading-[1.25]"
              style={{ fontSize: 'clamp(8px, 1.1vw, 16px)', width: '30%' }}
            >
              {label}
            </span>
            <span
              className="font-script text-black"
              style={{ fontSize: 'clamp(9px, 1.4vw, 20px)', lineHeight: 1.5 }}
            >
              {value}
            </span>
          </a>
        ))}
      </div>

    </div>
  )
}
