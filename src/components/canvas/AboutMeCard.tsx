import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { ABOUT_ME_RECT } from './itemPositions'

interface AboutMeCardProps {
  dict: Dictionary
}

// Positions from Figma node 201:64 (580×430). Coord offset: Figma abs (-405, -224).
// Elements use centered-rotation: position = center of bbox, translate(-50%,-50%) + rotate.
// DOM order matches Figma stacking: photo → sticker → paper+text+links → stars → pinzas.

export function AboutMeCard({ dict }: AboutMeCardProps) {
  const links = [
    { label: dict.contact.linkedin, href: dict.contact.linkedinUrl },
    { label: dict.contact.email, href: `mailto:${dict.contact.emailAddress}` },
    { label: dict.contact.resume, href: dict.contact.resumeUrl },
  ]

  return (
    <div
      className="absolute"
      style={{
        left: ABOUT_ME_RECT.x,
        top: ABOUT_ME_RECT.y,
        width: ABOUT_ME_RECT.w,
        height: ABOUT_ME_RECT.h,
      }}
    >
      {/* 1 — Polaroid photo (lowest layer) */}
      <div
        className="absolute"
        style={{
          left: 135,
          top: 281,
          transform: 'translate(-50%, -50%) rotate(9.11deg)',
        }}
      >
        <Image
          src="/canvas/aboutme/photo.png"
          alt={dict.about.tagline}
          width={231}
          height={266}
          sizes="231px"
          quality={90}
          className="pointer-events-none block object-contain select-none"
          priority
        />
      </div>

      {/* 2 — Argentina sticker (on photo) */}
      <div
        className="absolute"
        style={{
          left: 104,
          top: 170,
          width: 162,
          height: 162,
          transform: 'translate(-50%, -50%) rotate(-12.99deg)',
        }}
      >
        <Image
          src="/canvas/aboutme/shadow.png"
          alt=""
          width={162}
          height={162}
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-20 blur-[4px] select-none"
          aria-hidden
        />
        <Image
          src="/canvas/aboutme/sticker-arg.png"
          alt="Argentina sticker"
          width={162}
          height={162}
          sizes="162px"
          quality={90}
          className="pointer-events-none relative block select-none"
        />
      </div>

      {/* 3 — Paper note background (in front of photo, text sits on top) */}
      <Image
        src="/canvas/aboutme/paper.png"
        alt=""
        width={410}
        height={356}
        sizes="410px"
        quality={90}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 170, top: 63 }}
        priority
        aria-hidden
      />

      {/* 4 — Bio text lines (on paper, above photo edge) */}
      {[
        { text: dict.about.headline,       lx: 210, cy: 169, rot: -13.02 },
        { text: dict.about.bodyLines[0],   lx: 221, cy: 207, rot: -14.35 },
        { text: dict.about.bodyLines[1],   lx: 229, cy: 239, rot: -15.27 },
        { text: dict.about.bodyLines[2],   lx: 236, cy: 270, rot: -15.99 },
      ].map(({ text, lx, cy, rot }) => (
        <span
          key={text}
          className="font-script absolute whitespace-nowrap text-2xl leading-normal text-black/85 pointer-events-none select-none"
          style={{
            left: lx,
            top: cy,
            transform: `translate(0, -50%) rotate(${rot}deg)`,
          }}
          aria-hidden
        >
          {text}
        </span>
      ))}

      {/* 5 — Contact links */}
      {[
        { link: links[0], lx: 249, cy: 354 },
        { link: links[1], lx: 330, cy: 331 },
        { link: links[2], lx: 394, cy: 312 },
      ].map(({ link, lx, cy }) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="font-script absolute text-xl text-black/85 underline hover:text-[#FF3E00] transition-colors"
          style={{
            left: lx,
            top: cy,
            transform: 'translate(0, -50%) rotate(-15.99deg)',
          }}
        >
          {link.label}
        </a>
      ))}

      {/* 6 — Stars decoration */}
      <Image
        src="/canvas/aboutme/stars.png"
        alt=""
        width={66}
        height={66}
        sizes="66px"
        quality={90}
        className="pointer-events-none absolute object-contain select-none"
        style={{
          left: 510,
          top: 288,
          transform: 'translate(-50%, -50%) rotate(-16.52deg)',
        }}
        aria-hidden
      />

      {/* 7 — Left clip */}
      <Image
        src="/canvas/aboutme/pinza.png"
        alt=""
        width={48}
        height={145}
        sizes="48px"
        quality={90}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 128, top: 37 }}
        priority
        aria-hidden
      />

      {/* 8 — Right clip */}
      <Image
        src="/canvas/aboutme/pinza.png"
        alt=""
        width={48}
        height={145}
        sizes="48px"
        quality={90}
        className="pointer-events-none absolute object-contain select-none"
        style={{ left: 318, top: 0 }}
        priority
        aria-hidden
      />
    </div>
  )
}
