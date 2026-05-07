'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — Figma 327:558
 *
 * Two sections stacked vertically:
 *  1. Profile  — white notebook paper (Profile.png), photo collage + bio + links overlaid
 *  2. Design Principles — yellow notepad (Design Principles.png), 4 principles overlaid
 *
 * Plus two decorative images (Decoration 1 + 2) positioned around the sections.
 *
 * Text positions are percentage-based, derived from Figma canvas coordinates
 * normalized to each panel's bounding box.
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,         href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                       href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                href: dict.contact.resumeUrl },
  ]

  return (
    <article className="bg-paper relative flex flex-col" style={{ overflow: 'visible' }}>

      {/* ── DECORATION 1 — top-right, behind panels ───────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%201.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ right: '-6%', top: '-4%', width: '42%' }}
      />

      {/* ── PROFILE SECTION ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full">
        {/* Background — drives container height */}
        <Image
          src="/canvas/aboutme/sheet/Profile.png"
          alt=""
          aria-hidden
          width={647}
          height={801}
          className="pointer-events-none w-full h-auto"
          priority
        />

        {/* Photo collage — top section of the paper */}
        <div
          className="pointer-events-none absolute"
          style={{ left: '14.9%', top: '6.6%', width: '77.5%' }}
        >
          <Image
            src="/canvas/aboutme/sheet/Collage.png"
            alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
            width={493}
            height={215}
            className="w-full h-auto"
          />
        </div>

        {/* Bio text */}
        <div
          className="absolute"
          style={{ left: '15.2%', top: '35.8%', width: '74%', transform: 'rotate(1deg)' }}
        >
          <div className="font-script flex flex-col gap-3 text-[20px] leading-[1.3] text-black">
            <p>{s.bio1}</p>
            <p>{s.bio2}</p>
          </div>
        </div>

        {/* Links */}
        <div
          className="absolute"
          style={{ left: '8.2%', top: '64%', width: '86.5%', transform: 'rotate(1deg)' }}
        >
          {links.map(({ label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-baseline gap-[29px] py-[10px] transition-opacity hover:opacity-70"
            >
              <span className="text-ink w-[88px] shrink-0 text-[16px] font-semibold leading-[1.25]">
                {label}
              </span>
              <span className="font-script text-[20px] leading-[1.5] text-black">
                {value}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── DECORATION 2 — left side, between panels ───────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/canvas/aboutme/sheet/Decoration%202.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{ left: '-5%', top: '53%', width: '40%' }}
      />

      {/* ── DESIGN PRINCIPLES SECTION ───────────────────────────────────── */}
      <div className="relative z-10 w-full">
        {/* Background — drives container height */}
        <Image
          src="/canvas/aboutme/sheet/Design%20Principles.png"
          alt=""
          aria-hidden
          width={642}
          height={694}
          className="pointer-events-none w-full h-auto"
        />

        {/* 4 principles, one per notepad row */}
        {s.principles.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${10.7 + i * 0.5}%`,
              top: `${[12.8, 31.2, 49.6, 68][i]}%`,
              width: '77%',
              transform: 'rotate(-2deg)',
            }}
          >
            <div className="flex flex-col gap-3">
              <p className="text-[16px] font-bold leading-[1.25]" style={{ color: '#1f1a14' }}>
                {p.title}
              </p>
              <p className="text-[16px] leading-[1.65]" style={{ color: '#666159' }}>
                {p.body}
              </p>
            </div>
          </div>
        ))}
      </div>

    </article>
  )
}
