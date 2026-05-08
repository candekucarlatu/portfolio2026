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
 * Adjusted top positions so Profile is ≈48px from component top and DP bottom
 * is ≈52px from component bottom (calibrated at 1200px modal width / 1138px height).
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

  // DP text top positions: original (figma_y + 164) / 1366, then shifted +14.09% to match DP panel move
  const dpTexts = [
    { left: '53.45%', top: '52%' },
    { left: '53.76%', top: '62%' },
    { left: '54.07%', top: '71%' },
    { left: '54.38%', top: '80%' },
  ]

  return (
    /*
     * Outer container: relative, height driven by padding-bottom=94.86%
     * (= 1366/1440 — matches Figma canvas aspect ratio after y-shift).
     * overflow-hidden clips decorations that bleed past the edges.
     * All children are absolute and scale proportionally with container width.
     */
    <div className="relative w-full overflow-hidden" style={{ paddingBottom: '94.86%' }}>

      {/* ── DECORATION 1 — top-right, z behind panels ────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%201.png"
        alt="" aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: '54.51%', top: '-15%', width: '37.15%' }}
      />

      {/* ── DECORATION 2 — bottom-left, below Profile ────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%202.png"
        alt="" aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: '10.76%', top: '83%', width: '34.86%' }}
      />

      {/* ── DESIGN PRINCIPLES PANEL — z-10 ───────────────────────────── */}
      {/* top: 43% ≈ DP bottom 52px from component bottom at 1200px modal */}
      <div
        className="absolute z-10"
        style={{ left: '48.40%', top: '43%', width: '46.27%' }}
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

      {/* ── PROFILE PANEL — z-20 ─────────────────────────────────────── */}
      {/* top: 4% ≈ 48px from component top at 1200px modal */}
      <div
        className="absolute z-20"
        style={{ left: '6.67%', top: '4%', width: '45.89%' }}
      >
        <Image
          src="/canvas/aboutme/sheet/Profile.png"
          alt="" aria-hidden
          width={1294}
          height={1868}
          className="pointer-events-none h-auto w-full"
          style={{ transform: 'rotate(1deg)', transformOrigin: 'top left' }}
          priority
        />
      </div>

      {/* ── COLLAGE — z-30 ───────────────────────────────────────────── */}
      {/* top shifted -11.52% to follow Profile; width +5% per user request */}
      <div
        className="pointer-events-none absolute z-30"
        style={{ left: '13.26%', top: '8%', width: '35.95%', transform: 'rotate(1deg)' }}
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
      <div
        className="absolute z-30"
        style={{ left: '13.42%', top: '25%', width: '32.71%', transform: 'rotate(1deg)' }}
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
      <div
        className="absolute z-30"
        style={{ left: '13.10%', top: '42%', width: '28.23%', transform: 'rotate(1deg)' }}
      >
        {links.map(({ label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-baseline gap-[6%] py-[2.2%]"
          >
            <span
              className="text-ink shrink-0 font-semibold leading-[1.25]"
              style={{ fontSize: 'clamp(8px, 1.1vw, 16px)', width: '30%' }}
            >
              {label}
            </span>
            <span
              className="font-script text-black transition-colors hover:text-[#FF3E00]"
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
