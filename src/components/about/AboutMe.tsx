'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — Figma 486:9277 (redesigned canvas)
 *
 * DESKTOP: absolute-positioned canvas (1440×1143px proportions)
 * MOBILE:  stacked — Profile card (top) + Design Principles card (bottom)
 *
 * Z-order desktop (back→front): Decoration 1 (z-0) → DP panel+text (z-10)
 *   → Profile (z-20) → Collage+bio+links (z-30)
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,          href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                        href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                 href: dict.contact.resumeUrl },
  ]

  // DP text positions: canvas coords → percentage of canvas (1440×1143)
  const dpTexts = [
    { left: '51.45%', top: '33.52%' },
    { left: '51.76%', top: '46.99%' },
    { left: '52.07%', top: '59.58%' },
    { left: '52.38%', top: '72.87%' },
  ]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          MOBILE LAYOUT — single absolute-positioned canvas, Figma 502:158
          Canvas 390×1063. All elements positioned as % of canvas size.
          Rotations: Profile −1°, DP +2°, Collage −1°, Bio −1°, Links −1°, DP texts +2°
          ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-x-hidden overflow-y-auto md:hidden">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '390 / 1063' }}
        >

          {/* ── Profile background ─────────────────────────────────────── */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '1.7%', top: '2.7%', width: '98.4%', transform: 'rotate(-1deg)', transformOrigin: 'top center' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Profile.png"
              alt="" aria-hidden
              width={1294} height={1868}
              className="h-auto w-full"
              priority
            />
          </div>

          {/* ── Design Principles background ───────────────────────────── */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '0.5%', top: '53.3%', width: '113.2%', transform: 'rotate(2deg)', transformOrigin: 'top left' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Design%20Principles.png"
              alt="" aria-hidden
              width={1285} height={1389}
              className="h-auto w-full"
            />
          </div>

          {/* ── Collage ────────────────────────────────────────────────── */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '11.9%', top: '1.5%', width: '80.3%', transform: 'rotate(-1deg)' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Collage.png"
              alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
              width={986} height={430}
              className="h-auto w-full"
            />
          </div>

          {/* ── Bio text ───────────────────────────────────────────────── */}
          <div
            className="absolute"
            style={{ left: '14.8%', top: '15.5%', width: '72.8%', transform: 'rotate(-1deg)' }}
          >
            <div
              className="font-script flex flex-col gap-[0.5em] leading-[1.4] text-black"
              style={{ fontSize: 'clamp(12px, 4.1vw, 16px)' }}
            >
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* ── Links — each anchored to its exact Figma Y position ──────
               Canvas Y values: Email=421, Linkedin=456, Instagram=493, Resume=528
               topPct = Y / 1063. Left=52/390=13.3%, width=293/390=75.1%. ──── */}
          {[
            { topPct: '39.6%' }, // Email      y=421
            { topPct: '42.9%' }, // Linkedin   y=456
            { topPct: '46.4%' }, // Instagram  y=493
            { topPct: '49.7%' }, // Resume     y=528
          ].map(({ topPct }, i) => {
            const { label, value, href } = links[i]
            return (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="absolute flex items-center"
                style={{ left: '13.3%', top: topPct, width: '75.1%', gap: 'clamp(8px, 3vw, 12px)', transform: 'rotate(-1deg)' }}
              >
                <span
                  className="text-ink shrink-0 font-semibold"
                  style={{ fontSize: 'clamp(9px, 3.08vw, 12px)', width: '28%' }}
                >
                  {label}
                </span>
                <span
                  className="font-script text-black transition-colors hover:text-[#FF3E00]"
                  style={{ fontSize: 'clamp(12px, 4.1vw, 16px)', lineHeight: 1.3 }}
                >
                  {value}
                </span>
              </a>
            )
          })}

          {/* ── Design Principles texts ─────────────────────────────────── */}
          {[
            { left: '10.8%', top: '60.2%' },
            { left: '11.3%', top: '68.9%' },
            { left: '11.8%', top: '77.2%' },
            { left: '13.1%', top: '85.8%' },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: pos.left, top: pos.top, width: '84.9%', transform: 'rotate(2deg)' }}
            >
              <div className="flex flex-col gap-[0.25em]">
                <p
                  className="font-bold leading-[1.2]"
                  style={{ fontSize: 'clamp(10px, 3.59vw, 14px)', color: '#1f1a14' }}
                >
                  {s.principles[i].title}
                </p>
                <p
                  className="leading-[1.5]"
                  style={{ fontSize: 'clamp(9px, 3.08vw, 12px)', color: '#666159' }}
                >
                  {s.principles[i].body}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TABLET LAYOUT — scrollable, Figma 537:9856
          Canvas 834×1700. Profile top (+1°) → DP bottom (−2°). No Decoration 1.
          Text: Inter 16px / Caveat 20px fixed. All positions as % of canvas.
          ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-x-hidden overflow-y-auto hidden md:block lg:hidden">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '834 / 1700' }}
        >

          {/* ── Profile background ─────────────────────────────────────── */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '10.2%', top: '2.35%', width: '77.6%', transform: 'rotate(1deg)', transformOrigin: 'top center' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Profile.png"
              alt="" aria-hidden
              width={1294} height={1868}
              className="h-auto w-full"
              priority
            />
          </div>

          {/* ── Collage ────────────────────────────────────────────────── */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '20.5%', top: '8.53%', width: '62.6%', transform: 'rotate(1deg)' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Collage.png"
              alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
              width={986} height={430}
              className="h-auto w-full"
            />
          </div>

          {/* ── Bio text ───────────────────────────────────────────────── */}
          <div
            className="absolute"
            style={{ left: '22.8%', top: '25.74%', width: '56.8%', transform: 'rotate(1deg)' }}
          >
            <div
              className="font-script flex flex-col gap-[12px] text-black"
              style={{ fontSize: 20, lineHeight: 1.3 }}
            >
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* ── Links — each anchored to its Figma Y position ──────────
               Canvas Y: Email=700, Linkedin=763, Instagram=825, Resume=890
               topPct = Y / 1700. Left unified at ~22.5% of canvas.        */}
          {[
            { topPct: '41.2%',  labelW: 54, gap: 63 },  // Email      y=700
            { topPct: '44.86%', labelW: 88, gap: 29 },  // Linkedin   y=763
            { topPct: '48.5%',  labelW: 88, gap: 29 },  // Instagram  y=825
            { topPct: '52.33%', labelW: 88, gap: 29 },  // Resume     y=890
          ].map(({ topPct, labelW, gap }, i) => {
            const { label, value, href } = links[i]
            return (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="absolute flex items-center"
                style={{ left: '22.5%', top: topPct, transform: 'rotate(1deg)' }}
              >
                <span
                  className="shrink-0 font-semibold text-ink"
                  style={{ fontSize: 16, width: labelW }}
                >
                  {label}
                </span>
                <span
                  className="font-script text-black transition-colors hover:text-[#FF3E00]"
                  style={{ fontSize: 20, lineHeight: 1.5, marginLeft: gap }}
                >
                  {value}
                </span>
              </a>
            )
          })}

          {/* ── Design Principles background ───────────────────────────── */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '10.07%', top: '54.53%', width: '77.0%', transform: 'rotate(-2deg)', transformOrigin: 'top left' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Design%20Principles.png"
              alt="" aria-hidden
              width={1285} height={1389}
              className="h-auto w-full"
            />
          </div>

          {/* ── Design Principles texts ─────────────────────────────────── */}
          {[
            { left: '18.78%', top: '62.06%' },  // Use research
            { left: '19.31%', top: '69.59%' },  // Work end-to-end
            { left: '19.85%', top: '77.12%' },  // Ship to learn
            { left: '20.39%', top: '84.64%' },  // Treat efficiency
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: pos.left, top: pos.top, width: '59.26%', transform: 'rotate(-2deg)' }}
            >
              <div className="flex flex-col" style={{ gap: 12 }}>
                <p
                  className="font-bold leading-[1.25]"
                  style={{ fontSize: 16, color: '#1f1a14' }}
                >
                  {s.principles[i].title}
                </p>
                <p
                  className="leading-[1.65]"
                  style={{ fontSize: 16, color: '#666159' }}
                >
                  {s.principles[i].body}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT — absolute-positioned canvas (unchanged)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="relative hidden h-full w-full overflow-hidden lg:block">

        {/* ── DECORATION 1 — top-right ────────────────────────────────────── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/aboutme/sheet/Decoration%201.png"
          alt="" aria-hidden
          className="pointer-events-none absolute z-0"
          style={{ left: '54.51%', top: '0%', width: '37.15%' }}
        />

        {/* ── DESIGN PRINCIPLES PANEL — z-10 ─────────────────────────────── */}
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

        {/* ── DESIGN PRINCIPLES TEXT — z-10 ───────────────────────────────── */}
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

        {/* ── PROFILE PANEL — z-20 ────────────────────────────────────────── */}
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

        {/* ── COLLAGE — z-30 ──────────────────────────────────────────────── */}
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

        {/* ── BIO TEXT — z-30 ─────────────────────────────────────────────── */}
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

        {/* ── LINKS — z-30 ────────────────────────────────────────────────── */}
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
    </>
  )
}
