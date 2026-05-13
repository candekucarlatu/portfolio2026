'use client'

import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me — responsive canvas layout
 *
 * MOBILE  (0–767)     absolute canvas 390×1063. Figma 502:158.
 * TABLET  (768–1439)  absolute canvas 834×1700, scrollable. Figma 537:9856.
 *                     Fonts in vw so they scale with the canvas.
 * DESKTOP XL (1440+) absolute canvas 1440×1010, vertically centered. Figma 502:9600.
 *
 * Rotation conventions (matching Figma):
 *   Profile section (bg, collage, bio, links): +1 deg
 *   DP section (bg, texts):                   −2 deg
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,          href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu', href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                        href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                 href: dict.contact.resumeUrl },
  ]

  // ── Desktop XL positions (canvas 1440×1010) ─────────────────────────────
  const xlDpTexts = [
    { left: '53.45%', top: '35.55%' },  // Use research   — Figma 769.65/1440, 359.1/1010
    { left: '53.76%', top: '48.22%' },  // Work end-to-end
    { left: '54.06%', top: '60.88%' },  // Ship to learn
    { left: '54.37%', top: '73.55%' },  // Treat efficiency
  ]

  // Desktop XL link rows (canvas 1440×1010, rotate +1deg)
  // Figma: Email gap=63 labelW=54 / others gap=29 labelW=88
  const xlLinkRows = [
    { left: '13.33%', top: '69.60%', labelW: 54, gap: 63 },  // Email   — 191.98/1440, 703/1010
    { left: '13.26%', top: '75.74%', labelW: 88, gap: 29 },  // Linkedin
    { left: '13.18%', top: '81.88%', labelW: 88, gap: 29 },  // Instagram
    { left: '13.10%', top: '88.31%', labelW: 88, gap: 29 },  // Resume
  ]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          MOBILE LAYOUT — 0–767px
          Canvas 390×1063. Figma 502:158.
          Profile section: +1 deg. DP section: −2 deg.
          ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-x-hidden overflow-y-auto md:hidden">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '390 / 1063' }}
        >

          {/* ── Profile background ──────────────────────────────────────── */}
          {/* Figma: wrapper left=−3.16px, w=393.552px → image (383.93px)  */}
          {/* centered ⟹ image left = (−3.16 + (393.552−383.93)/2) = 1.65px */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '0.42%', top: '2.7%', width: '98.4%', transform: 'rotate(1deg)', transformOrigin: 'top center' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Profile.png"
              alt="" aria-hidden
              width={1294} height={1868}
              className="h-auto w-full"
              priority
            />
          </div>

          {/* ── Collage ─────────────────────────────────────────────────── */}
          {/* Figma: wrapper left=43.9px → image left=43.9+(315.46−313.14)/2=45.1px=11.55% */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '11.55%', top: '1.5%', width: '80.3%', transform: 'rotate(1deg)' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Collage.png"
              alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
              width={986} height={430}
              className="h-auto w-full"
            />
          </div>

          {/* ── Bio text ────────────────────────────────────────────────── */}
          {/* Figma: left=54px=13.85%, top=165px=15.52% */}
          <div
            className="absolute"
            style={{ left: '13.85%', top: '15.5%', width: '72.8%', transform: 'rotate(1deg)' }}
          >
            <div
              className="font-script flex flex-col text-black"
              style={{ fontSize: 'clamp(12px, 4.1vw, 16px)', gap: 'clamp(6px, 3.08vw, 12px)', lineHeight: 1.3 }}
            >
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* ── Links ───────────────────────────────────────────────────────
               Each row anchored to its Figma Y. Per-row labelW + gap in vw
               so the value column aligns correctly at all widths.
               Figma: Email labelW=54px gap=53px / others labelW=88px gap=15-16px */}
          {[
            { topPct: '39.6%', labelW: 'clamp(11px, 13.85vw, 54px)', valGap: 'clamp(11px, 13.59vw, 53px)' }, // Email   y=421
            { topPct: '42.9%', labelW: 'clamp(18px, 22.56vw, 88px)', valGap: 'clamp(3px, 3.85vw, 15px)'  }, // Linkedin y=456
            { topPct: '46.4%', labelW: 'clamp(18px, 22.56vw, 88px)', valGap: 'clamp(3px, 3.85vw, 15px)'  }, // Instagram y=493
            { topPct: '49.7%', labelW: 'clamp(18px, 22.56vw, 88px)', valGap: 'clamp(3px, 4.1vw, 16px)'   }, // Resume   y=528
          ].map(({ topPct, labelW, valGap }, i) => {
            const { label, value, href } = links[i]
            return (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="absolute flex items-center"
                style={{ left: '13.3%', top: topPct, transform: 'rotate(1deg)' }}
              >
                <span
                  className="shrink-0 font-semibold text-ink"
                  style={{ fontSize: 'clamp(9px, 3.08vw, 12px)', width: labelW }}
                >
                  {label}
                </span>
                <span
                  className="font-script text-black transition-colors hover:text-[#FF3E00]"
                  style={{ fontSize: 'clamp(12px, 4.1vw, 16px)', lineHeight: 1.5, marginLeft: valGap }}
                >
                  {value}
                </span>
              </a>
            )
          })}

          {/* ── Design Principles background ────────────────────────────── */}
          {/* Figma: left=2px=0.5%, top=551px=51.84%, rotation=−2deg */}
          <div
            className="pointer-events-none absolute"
            style={{ left: '0.5%', top: '51.84%', width: '113.2%', transform: 'rotate(-2deg)', transformOrigin: 'top left' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Design%20Principles.png"
              alt="" aria-hidden
              width={1285} height={1389}
              className="h-auto w-full"
            />
          </div>

          {/* ── Design Principles texts ──────────────────────────────────── */}
          {/* Figma tops (wrapper): 628.54/1063, 721/1063, 809/1063, 901/1063  */}
          {/* −1.3% to account for Figma's items-center offset inside wrapper  */}
          {[
            { left: '10.8%', top: '57.83%' },  // Use research    y=628.54 − 1.3%
            { left: '11.3%', top: '66.53%' },  // Work end-to-end y=721
            { left: '11.8%', top: '74.81%' },  // Ship to learn   y=809
            { left: '13.1%', top: '83.46%' },  // Treat efficiency y=901
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: pos.left, top: pos.top, width: '84.9%', transform: 'rotate(-2deg)' }}
            >
              <div className="flex flex-col" style={{ gap: 'clamp(2px, 2.05vw, 8px)' }}>
                <p
                  className="font-bold leading-[1.25]"
                  style={{ fontSize: 'clamp(10px, 3.59vw, 14px)', color: '#1f1a14' }}
                >
                  {s.principles[i].title}
                </p>
                <p
                  className="leading-[1.65]"
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
          TABLET LAYOUT — 768–1439px
          Canvas 834×1700, scrollable. Figma 537:9856.
          Fonts in vw so text scales proportionally as canvas grows.
          (2.4vw = 20px at 834px; 1.92vw = 16px at 834px)
          ══════════════════════════════════════════════════════════════════ */}
      <div className="overflow-x-hidden overflow-y-auto hidden md:block at-wide-hidden lg:h-full">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '834 / 1700', maxWidth: 834, marginLeft: 'auto', marginRight: 'auto' }}
        >

          {/* ── Profile background ──────────────────────────────────────── */}
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

          {/* ── Collage ─────────────────────────────────────────────────── */}
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

          {/* ── Bio text ────────────────────────────────────────────────── */}
          <div
            className="absolute"
            style={{ left: '22.8%', top: '25.74%', width: '56.8%', transform: 'rotate(1deg)' }}
          >
            <div
              className="font-script flex flex-col text-black"
              style={{ fontSize: 20, gap: 12, lineHeight: 1.3 }}
            >
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* ── Links ───────────────────────────────────────────────────── */}
          {/* Figma: Email labelW=54px gap=63px / others labelW=88px gap=29px */}
          {[
            { topPct: '41.2%',  labelW: 54, valGap: 63 },   // Email      y=700
            { topPct: '44.86%', labelW: 88, valGap: 29 },   // Linkedin   y=763
            { topPct: '48.5%',  labelW: 88, valGap: 29 },   // Instagram  y=825
            { topPct: '52.33%', labelW: 88, valGap: 29 },   // Resume     y=890
          ].map(({ topPct, labelW, valGap }, i) => {
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
                  style={{ fontSize: 20, lineHeight: 1.5, marginLeft: valGap }}
                >
                  {value}
                </span>
              </a>
            )
          })}

          {/* ── Design Principles background ────────────────────────────── */}
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

          {/* ── Design Principles texts ──────────────────────────────────── */}
          {/* Figma tops (wrapper): 62.06/69.59/77.12/84.64%             */}
          {/* −1% to account for Figma's items-center offset in wrapper  */}
          {[
            { left: '18.78%', top: '61.06%' },  // Use research
            { left: '19.31%', top: '68.59%' },  // Work end-to-end
            { left: '19.85%', top: '76.12%' },  // Ship to learn
            { left: '20.39%', top: '83.64%' },  // Treat efficiency
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
          DESKTOP XL LAYOUT — 1440px+
          Canvas 1440×1010, centered vertically in the container.
          Figma 502:9600. Side-by-side Profile (left) + DP (right).
          When viewport is taller than 1010px the canvas floats in the middle.
          ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden at-wide-flex h-full w-full items-center justify-center overflow-hidden">
        <div
          className="relative shrink-0"
          style={{ aspectRatio: '1440 / 1010', height: '100%', maxHeight: '1010px', maxWidth: '100%' }}
        >

          {/* ── DECORATION 1 — clipping wrapper, image peeks from top edge ─── */}
          {/* Figma: container h=223/1010=22.08%, image h=173.54% container, top=−73.54% */}
          <div
            className="pointer-events-none absolute z-0 overflow-hidden"
            style={{ left: '54.51%', top: '0%', width: '37.15%', height: '22.08%' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/canvas/aboutme/sheet/Decoration%201.png"
              alt="" aria-hidden
              className="absolute w-full"
              style={{ height: '173.54%', top: '-73.54%', left: 0 }}
            />
          </div>

          {/* ── DESIGN PRINCIPLES PANEL — z-10 ──────────────────────────── */}
          {/* Figma: left=697/1440=48.40%, top=231/1010=22.87%, width=46.27% */}
          <div
            className="absolute z-10"
            style={{ left: '48.40%', top: '22.87%', width: '46.27%' }}
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

          {/* ── DESIGN PRINCIPLES TEXT — z-10 ───────────────────────────── */}
          {xlDpTexts.map((pos, i) => (
            <div
              key={i}
              className="absolute z-10"
              style={{ left: pos.left, top: pos.top, width: '34.32%', transform: 'rotate(-2deg)' }}
            >
              <div className="flex flex-col" style={{ gap: 'clamp(8px, 0.83vw, 12px)' }}>
                <p
                  className="font-bold leading-[1.25]"
                  style={{ fontSize: 'clamp(8px, 1.1vw, 16px)', color: '#1f1a14' }}
                >
                  {s.principles[i].title}
                </p>
                <p
                  className="leading-[1.65]"
                  style={{ fontSize: 'clamp(8px, 1.1vw, 16px)', color: '#666159' }}
                >
                  {s.principles[i].body}
                </p>
              </div>
            </div>
          ))}

          {/* ── PROFILE PANEL — z-20 ─────────────────────────────────────── */}
          {/* Figma: left=87.9/1440=6.10%, top=42.42/1010=4.20%, width=647/1440=44.93% */}
          <div
            className="absolute z-20"
            style={{ left: '6.10%', top: '4.20%', width: '44.93%' }}
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
          {/* Figma: left=184.2/1440=12.79%, top=156/1010=15.45%, width=499.753/1440=34.70% */}
          <div
            className="pointer-events-none absolute z-30"
            style={{ left: '12.79%', top: '15.45%', width: '34.70%', transform: 'rotate(1deg)' }}
          >
            <Image
              src="/canvas/aboutme/sheet/Collage.png"
              alt={`${s.collage1} ${s.collage2} ${s.collage3}`}
              width={986}
              height={430}
              className="h-auto w-full"
            />
          </div>

          {/* ── BIO TEXT — z-30 ──────────────────────────────────────────── */}
          {/* Figma: left=193.27/1440=13.42%, top=440/1010=43.56%, width=471/1440=32.71% */}
          <div
            className="absolute z-30"
            style={{ left: '13.42%', top: '43.56%', width: '32.71%', transform: 'rotate(1deg)' }}
          >
            <div
              className="font-script flex flex-col gap-[0.6em] leading-[1.3] text-black"
              style={{ fontSize: 'clamp(10px, 1.4vw, 20px)' }}
            >
              <p>{s.bio1}</p>
              <p>{s.bio2}</p>
            </div>
          </div>

          {/* ── LINKS — z-30 (individual rows, matching Figma absolute layout) */}
          {/* Figma: Email left=191.98/1440=13.33% top=703/1010=69.6% labelW=54 gap=63  */}
          {/*        others left≈13.1–13.3% labelW=88 gap=29                            */}
          {xlLinkRows.map(({ left, top, labelW, gap }, i) => {
            const { label, value, href } = links[i]
            return (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="absolute z-30 flex items-center"
                style={{ left, top, transform: 'rotate(1deg)' }}
              >
                <span
                  className="shrink-0 font-semibold text-ink leading-[1.25]"
                  style={{ fontSize: 'clamp(8px, 1.1vw, 16px)', width: labelW }}
                >
                  {label}
                </span>
                <span
                  className="font-script text-black transition-colors hover:text-[#FF3E00]"
                  style={{ fontSize: 'clamp(9px, 1.4vw, 20px)', lineHeight: 1.5, marginLeft: gap }}
                >
                  {value}
                </span>
              </a>
            )
          })}

        </div>
      </div>
    </>
  )
}
