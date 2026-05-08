'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — Figma 327:558
 *
 * Two-column layout adapted from the 1440px Figma canvas.
 *
 * Figma canvas coordinates used for derivation (all @1x logical):
 *   Profile panel      left:96,    top:48,    w:640,  h:791
 *   Design Principles  left:699,   top:235,   w:646,  h:700  (bounding box incl. stars)
 *     └─ Background    left:700,   top:270                    (panel starts 35px below bbox top)
 *   Decoration 1       right side, top:-157   (photos — top-right)
 *   Decoration 2       left:155,   top:870    (cards  — moved to top-left for modal)
 *
 * DP marginTop derivation:
 *   Figma DP offset from Profile top = 270 - 48 = 222px on 640px panel
 *   Panel height = panel_width × 1.236  (791/640 aspect ratio)
 *   marginTop needed = 222/791 × panel_height = 28% × panel_width × 1.236 / 2 ≈ 17% of container width
 *
 * DP text positions are relative to the full Design Principles PNG bounding box (top:235):
 *   Text 1 top = (359 - 235) / 700 = 17.7%
 *   Text 2 top = (487 - 235) / 700 = 35.9%
 *   Text 3 top = (614 - 235) / 700 = 54.2%
 *   Text 4 top = (742 - 235) / 700 = 72.4%
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,          href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                        href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                 href: dict.contact.resumeUrl },
  ]

  // Principle top positions as % of Design Principles PNG bounding-box height
  // Derived from Figma: text y coords relative to bbox top (235.22)
  const principlePositions = [17.7, 35.9, 54.2, 72.4] as const

  return (
    <div className="relative">

      {/* ── DECORATION 2 — top-left, z below panels and X button ─────── */}
      {/* Moved from bottom to top for modal adaptation per user request  */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%202.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: 0, top: 0, width: '28%', maxWidth: 280 }}
      />

      {/* ── DECORATION 1 — top-right, z below panels ─────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%201.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ right: 0, top: 0, width: '32%', maxWidth: 380 }}
      />

      {/* ── TWO-COLUMN LAYOUT ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-row items-start justify-center gap-2 px-4 pt-2 pb-10 md:gap-3 md:px-6 md:pt-3 md:pb-14">

        {/* ── PROFILE PANEL (left) ──────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1" style={{ maxWidth: 647 }}>

          {/* Background — drives this panel's height */}
          <Image
            src="/canvas/aboutme/sheet/Profile.png"
            alt=""
            aria-hidden
            width={1294}
            height={1602}
            className="pointer-events-none h-auto w-full"
            priority
          />

          {/* Photo collage — top of paper */}
          {/* Figma: collage left=(191-96)/640=14.8%, top=(100-48)/791=6.6%, w=496/640=77.5% */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '14.8%', top: '6.6%', width: '77.5%' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Collage.png"
              alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
              width={986}
              height={430}
              className="h-auto w-full"
            />
          </div>

          {/* Bio text */}
          {/* Figma: left=(193-96)/640=15.2%, top=(331-48)/791=35.8%, rotate(1deg) */}
          <div
            className="absolute"
            style={{ left: '15.2%', top: '35.8%', width: '74%', transform: 'rotate(1deg)' }}
          >
            <div className="font-script flex flex-col gap-[0.6em] leading-[1.3] text-black"
              style={{ fontSize: 'clamp(10px, 1.6vw, 20px)' }}>
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* Links */}
          {/* Figma: left=(148-96)/640=8.2%, top=(554-48)/791=64%, rotate(1deg) */}
          <div
            className="absolute"
            style={{ left: '8.2%', top: '64%', width: '87%', transform: 'rotate(1deg)' }}
          >
            {links.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-baseline gap-[4%] py-[1.2%] transition-opacity hover:opacity-70"
              >
                <span
                  className="text-ink shrink-0 font-semibold leading-[1.25]"
                  style={{ fontSize: 'clamp(8px, 1.25vw, 16px)', width: '22%' }}
                >
                  {label}
                </span>
                <span
                  className="font-script text-black"
                  style={{ fontSize: 'clamp(9px, 1.5vw, 20px)', lineHeight: 1.5 }}
                >
                  {value}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* ── DESIGN PRINCIPLES PANEL (right) ──────────────────────────── */}
        {/* marginTop 17% ≈ Figma DP vertical offset (222px) scaled to container */}
        <div className="relative min-w-0 flex-1" style={{ maxWidth: 642, marginTop: '17%' }}>

          {/* Background — drives this panel's height (includes stars at top) */}
          <Image
            src="/canvas/aboutme/sheet/Design%20Principles.png"
            alt=""
            aria-hidden
            width={1285}
            height={1389}
            className="pointer-events-none h-auto w-full"
          />

          {/* 4 principles — text positioned relative to full PNG bounding box */}
          {s.principles.map((p, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${10.8 + i * 0.7}%`,
                top: `${principlePositions[i]}%`,
                width: '76.4%',
                transform: 'rotate(-2deg)',
              }}
            >
              <div className="flex flex-col gap-[0.5em]">
                <p
                  className="font-bold leading-[1.25]"
                  style={{ fontSize: 'clamp(8px, 1.25vw, 16px)', color: '#1f1a14' }}
                >
                  {p.title}
                </p>
                <p
                  className="leading-[1.65]"
                  style={{ fontSize: 'clamp(7px, 1.2vw, 16px)', color: '#666159' }}
                >
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
