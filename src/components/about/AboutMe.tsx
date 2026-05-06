import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'

interface AboutMeProps {
  dict: Dictionary
}

/**
 * About Me page content — Figma 327:558
 *
 * Two sections stacked vertically (matching panel width):
 *  1. Profile  — notebook paper aesthetic, photo collage, bio, links
 *  2. Design Principles — yellow notepad aesthetic, 4 principles
 */
export function AboutMe({ dict }: AboutMeProps) {
  const s = dict.aboutSheet

  const links = [
    { label: s.links.email,     value: dict.contact.emailAddress,                href: `mailto:${dict.contact.emailAddress}` },
    { label: s.links.linkedin,  value: 'linkedin.com/in/candelakucarlatu',        href: dict.contact.linkedinUrl },
    { label: s.links.instagram, value: '@kucarlatu',                              href: 'https://instagram.com/kucarlatu' },
    { label: s.links.resume,    value: s.links.resumeValue,                       href: dict.contact.resumeUrl },
  ]

  return (
    <article className="bg-paper flex flex-col">

      {/* ── PROFILE SECTION ─────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        {/* SVG notebook paper background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/aboutme/sheet/paper-profile.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
        />

        <div className="relative flex flex-col px-[56px] py-[48px] md:px-[96px] md:py-[64px]">

          {/* PROFILE label — top */}
          <p
            className="mb-[40px] text-center font-medium uppercase tracking-[0.08px] text-[#bfb8b2]"
            style={{ fontSize: 8 }}
          >
            {s.profileLabel}
          </p>

          {/* Photo collage */}
          <div className="relative mx-auto mb-[40px] flex items-end gap-4" style={{ height: 220 }}>

            {/* Photo 1 — left, slight CCW tilt */}
            <div
              className="relative shrink-0 overflow-hidden shadow-[2px_5px_10px_0px_rgba(0,0,0,0.1)]"
              style={{ width: 148, height: 186, transform: 'rotate(-1.5deg)', borderRadius: 4 }}
            >
              <Image
                src="/canvas/aboutme/sheet/photo-1.jpg"
                alt={s.collage2}
                fill
                sizes="148px"
                className="object-cover"
              />
              {/* tape top-center */}
              <div
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 overflow-hidden"
                style={{ top: -10, width: 70, height: 25 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/canvas/aboutme/sheet/tape.png" alt="" aria-hidden className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Photo 2 — right, slight CW tilt */}
            <div className="relative shrink-0" style={{ width: 156, height: 156, transform: 'rotate(1deg)' }}>

              {/* tape top-left corner */}
              <div
                className="pointer-events-none absolute overflow-hidden"
                style={{ top: -8, left: -8, width: 50, height: 20, transform: 'rotate(-28deg)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/canvas/aboutme/sheet/tape-2.png" alt="" aria-hidden className="h-full w-full object-cover" />
              </div>

              {/* "Hey there!" label */}
              <div
                className="pointer-events-none absolute z-10"
                style={{ top: 10, left: -16, transform: 'rotate(-11deg)' }}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/canvas/aboutme/sheet/label-hey.png"
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full"
                    style={{ objectFit: 'fill' }}
                  />
                  <p className="font-script relative px-2 py-1 text-[14px] leading-[1.5] text-black">
                    {s.collage1}
                  </p>
                </div>
              </div>

              {/* Photo */}
              <div
                className="overflow-hidden shadow-[2px_5px_10px_0px_rgba(0,0,0,0.1)]"
                style={{ width: 156, height: 156, borderRadius: 4 }}
              >
                <Image
                  src="/canvas/aboutme/sheet/photo-2.jpg"
                  alt={s.collage3}
                  width={156}
                  height={156}
                  sizes="156px"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* "I'm Cande" label */}
              <div
                className="pointer-events-none absolute z-10"
                style={{ bottom: 12, left: -20, transform: 'rotate(9deg)' }}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/canvas/aboutme/sheet/label-cande.png"
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full"
                    style={{ objectFit: 'fill' }}
                  />
                  <p className="font-script relative px-2 py-1 text-[18px] leading-[1.5] text-black">
                    {s.collage2}
                  </p>
                </div>
              </div>

              {/* "and Membrillo" label */}
              <div
                className="pointer-events-none absolute z-10"
                style={{ bottom: -14, right: -52, transform: 'rotate(-11deg)' }}
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/canvas/aboutme/sheet/label-membrillo.png"
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full"
                    style={{ objectFit: 'fill' }}
                  />
                  <p className="font-script relative px-2 py-1 text-[14px] leading-[1.5] text-black">
                    {s.collage3}
                  </p>
                </div>
              </div>

              {/* tape bottom-right corner */}
              <div
                className="pointer-events-none absolute overflow-hidden"
                style={{ bottom: -8, right: -8, width: 50, height: 20, transform: 'rotate(-28deg)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/canvas/aboutme/sheet/tape-2.png" alt="" aria-hidden className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          {/* Bio text */}
          <div className="font-script mb-[40px] flex flex-col gap-3 text-[20px] leading-[1.3] text-black">
            <p>{s.bio1}</p>
            <p>{s.bio2}</p>
          </div>

          {/* Links */}
          <div className="flex flex-col divide-y divide-[#bfb8b2]">
            {links.map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-baseline gap-[29px] py-[10px] transition-colors hover:text-[#FF3E00]"
              >
                <span
                  className="text-ink w-[88px] shrink-0 text-[16px] font-semibold leading-[1.25]"
                >
                  {label}
                </span>
                <span className="font-script text-[20px] leading-[1.5] text-black">
                  {value}
                </span>
              </a>
            ))}
          </div>

          {/* PROFILE label — bottom */}
          <p
            className="mt-[40px] text-center font-medium uppercase tracking-[0.08px] text-[#bfb8b2]"
            style={{ fontSize: 8 }}
          >
            {s.profileLabel}
          </p>
        </div>
      </div>

      {/* ── DESIGN PRINCIPLES SECTION ───────────────────────────────────── */}
      <div className="relative w-full overflow-hidden">
        {/* SVG yellow notepad background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/canvas/aboutme/sheet/paper-principles.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ objectFit: 'fill' }}
        />

        <div className="relative flex flex-col px-[56px] py-[48px] md:px-[96px] md:py-[64px]">

          <div className="flex flex-col divide-y divide-[#bfb8b2]">
            {s.principles.map((p, i) => (
              <div key={i} className="flex flex-col gap-3 py-[24px]">
                <p className="text-ink text-[16px] font-bold leading-[1.25]">{p.title}</p>
                <p className="text-muted text-[16px] font-normal leading-[1.65]">{p.body}</p>
              </div>
            ))}
          </div>

          {/* DESIGN PRINCIPLES label — bottom */}
          <p
            className="mt-[32px] text-center font-medium uppercase tracking-[0.08px] text-[#bfb8b2]"
            style={{ fontSize: 8 }}
          >
            {s.principlesLabel}
          </p>
        </div>
      </div>

    </article>
  )
}
