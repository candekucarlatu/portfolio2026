'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — Figma 486:9277
 *
 * Canvas coordinates (1440px wide):
 *   Profile image      left:96,   top:48,   w:647,  h:801   rotate(1deg)
 *   Design Principles  left:697,  top:231,  w:642,  h:694   rotate(-2deg)
 *   Decoration 1       left:785,  top:-164, w:535,  h:387   (top-right)
 *   Decoration 2       left:155,  top:870,  w:502,  h:332   (bottom → moved to top-left)
 *   Collage            left:191,  top:103,  w:493,  h:215   rotate(1deg)
 *
 * DP marginTop derivation:
 *   Figma DP top offset from Profile top = 231 - 48 = 183px on 801px tall Profile
 *   = 22.8% of Profile height = 22.8% × 1.237 aspect × 0.5 column ratio ≈ 14% of container width
 *
 * Text % coords are relative to the panel image bounding box.
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,          href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                        href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                 href: dict.contact.resumeUrl },
  ]

  // Figma: text y coords relative to DP image top (231)
  // Text 1: (359-231)/694 = 18.4%
  // Text 2: (487-231)/694 = 36.9%
  // Text 3: (614-231)/694 = 55.1%
  // Text 4: (742-231)/694 = 73.6%
  const principlePositions = [18.4, 36.9, 55.1, 73.6] as const

  // Text x: (769-697)/642=11.2%, each item shifts +0.7%
  // Text width: 494/642 = 76.9%

  return (
    <div className="relative">

      {/* ── DECORATION 2 — top-left, z below panels and X button ─────── */}
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
      <div className="relative z-10 flex flex-row items-start justify-center gap-0 px-4 pt-2 pb-10 md:px-6 md:pt-3 md:pb-14">

        {/* ── PROFILE PANEL (left) ──────────────────────────────────────── */}
        <div className="relative min-w-0 flex-1" style={{ maxWidth: 647 }}>

          {/* Background PNG — 2x: 1294×1602 → 647×801 logical */}
          <Image
            src="/canvas/aboutme/sheet/Profile.png"
            alt=""
            aria-hidden
            width={1294}
            height={1602}
            className="pointer-events-none h-auto w-full"
            priority
          />

          {/* Photo collage */}
          {/* Figma: left=(191-96)/647=14.7%, top=(103-48)/801=6.9%, w=493/647=76.2%, rotate(1deg) */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '14.7%', top: '6.9%', width: '76.2%', transform: 'rotate(1deg)' }}
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
          {/* Figma: left=(193-96)/647=15.0%, top=(331-48)/801=35.3%, rotate(1deg) */}
          <div
            className="absolute"
            style={{ left: '15.0%', top: '35.3%', width: '73%', transform: 'rotate(1deg)' }}
          >
            <div
              className="font-script flex flex-col gap-[0.6em] leading-[1.3] text-black"
              style={{ fontSize: 'clamp(10px, 1.6vw, 20px)' }}
            >
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* Links */}
          {/* Figma: top=(571-48)/801=65.3%, left=(188-96)/647=14.2%, rotate(1deg) */}
          <div
            className="absolute"
            style={{ left: '8.2%', top: '65.3%', width: '87%', transform: 'rotate(1deg)' }}
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
        {/* marginTop: 14% ≈ Figma DP offset (183px) scaled to container width */}
        <div className="relative min-w-0 flex-1" style={{ maxWidth: 642, marginTop: '14%' }}>

          {/* Background PNG — 2x: 1285×1389 → 642×694 logical */}
          <Image
            src="/canvas/aboutme/sheet/Design%20Principles.png"
            alt=""
            aria-hidden
            width={1285}
            height={1389}
            className="pointer-events-none h-auto w-full"
          />

          {/* 4 principles */}
          {s.principles.map((p, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${11.2 + i * 0.7}%`,
                top: `${principlePositions[i]}%`,
                width: '76.9%',
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
