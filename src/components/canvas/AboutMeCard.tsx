import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import { ABOUT_ME_RECT } from './itemPositions'

interface AboutMeCardProps {
  dict: Dictionary
}

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
      <Image
        src="/canvas/groups/aboutme.png"
        alt={`${dict.about.headline}. ${dict.about.body}`}
        fill
        sizes="580px"
        className="pointer-events-none object-contain"
        priority
      />
      {/* Clickable hit areas over the contact links rendered in the image */}
      <div
        className="absolute flex gap-2"
        style={{ left: '50%', top: 312, width: 240, transform: 'translateX(-32%)' }}
      >
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="font-script text-ink/0 hover:text-accent focus-visible:outline-accent w-[68px] text-center text-[16px] underline-offset-2 transition-colors hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label={link.label}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}
