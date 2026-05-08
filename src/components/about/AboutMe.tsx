'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — Figma 486:9277 (redesigned canvas)
 *
 * Canvas: 1440 × 1143px  →  padding-bottom: 79.38%
 * No y-shift needed: Decoration 1 is at top=0 in this Figma.
 *
 * All positions derived directly from Figma node 486:9277.
 * left%  = figma_x / 1440
 * top%   = figma_y / 1143
 * width% = figma_w / 1440
 *
 * Figma source coordinates (exact):
 *   Decoration 1   left:785  top:0     w:535  h:223
 *   Decoration 2   left:155  top:1013  w:502  h:130
 *   DP panel       left:697  top:231   w:666  h:716   rotate(-2deg)
 *   DP Text 1      left:769  top:359
 *   DP Text 2      left:774  top:487
 *   DP Text 3      left:778  top:614
 *   DP Text 4      left:783  top:742
 *   Profile bbox   left:96   top:48    w:642  h:924   rotate(1deg)
 *   Collage        left:184  top:156   w:499  h:217   rotate(1deg)
 *   Bio text       left:193  top:440   w:471
 *   Links          left:192  top:699   w:406
 *
 * Z-order (back→front): Decoration 1/2 (z-0) → DP panel+text (z-10) → Profile (z-20) → Collage+bio+links (z-30)
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,          href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                        href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                 href: dict.contact.resumeUrl },
  ]

  // DP text positions: figma_y / 1143
  const dpTexts = [
    { left: '51.45%', top: '33.52%' },
    { left: '51.76%', top: '46.99%' },
    { left: '52.07%', top: '59.58%' },
    { left: '52.38%', top: '72.87%' },
  ]

  return (
    /*
     * Canvas: 1440×1143px → padding-bottom: 79.38%
     * overflow-hidden clips decorations that bleed past edges.
     */
    <div className="relative h-full w-full overflow-hidden">

      {/* ── DECORATION 1 — top-right ──────────────────────────────────── */}
      {/* Figma: left=785, top=0, w=535, h=223 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%201.png"
        alt="" aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: '54.51%', top: '0%', width: '37.15%' }}
      />

      {/* ── DESIGN PRINCIPLES PANEL — z-10 ───────────────────────────── */}
      {/* Figma: left=697, top=231, w=666 → 231/1143=20.21% — shifted left 6% + down 24px */}
      <div
        className="absolute z-10"
        style={{ left: '46.40%', top: '22.31%', width: '46.27%' }}
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
      {/* Figma: left=96, top=48, w=642 → 48/1143=4.20%, 642/1440=44.58% */}
      <div
        className="absolute z-20"
        style={{ left: '6.67%', top: '4.20%', width: '44.58%' }}
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
      {/* Figma: left=184, top=156, w=499 → 156/1143=13.65%, 499/1440=34.65% */}
      <div
        className="pointer-events-none absolute z-30"
        style={{ left: '11.13%', top: '9.50%', width: '38.12%', transform: 'rotate(1deg)' }}
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
      {/* Figma: left=193, top=440 → 440/1143=38.50% */}
      <div
        className="absolute z-30"
        style={{ left: '12.59%', top: '35.70%', width: '32.71%', transform: 'rotate(1deg)' }}
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
      {/* Figma: left=192, top=699 → 699/1143=61.17% — pushed further down */}
      <div
        className="absolute z-30"
        style={{ left: '12.59%', top: '68.60%', width: '28.46%', transform: 'rotate(1deg)' }}
      >
        {links.map(({ label, value, href }, i) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-[6%]"
            style={{
              minHeight: 'clamp(30px, 3vw, 44px)',
              ...(i === 1 || i === links.length - 1 ? { marginTop: '8px' } : i === 2 ? { marginTop: '12px' } : {}),
            }}
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
