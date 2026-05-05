'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Project } from '@/lib/content/schema'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { StickyNote } from './StickyNote'
import { PROJECTS } from './itemPositions'

interface PortfolioMobileProps {
  projects: Project[]
  dict: Dictionary
  locale: Locale
}

export function PortfolioMobile({ projects, dict, locale }: PortfolioMobileProps) {
  const projectMap = new Map(projects.map((p) => [p.slug, p]))
  const links = [
    { label: dict.contact.linkedin, href: dict.contact.linkedinUrl },
    { label: dict.contact.email, href: `mailto:${dict.contact.emailAddress}` },
    { label: dict.contact.resume, href: dict.contact.resumeUrl },
  ]

  return (
    <div
      className="bg-paper fixed inset-0 overflow-y-auto"
      style={{
        backgroundImage: 'url(/canvas/bg-pegboard-tile.png)',
        backgroundSize: '305px 232px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* About Me section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 pt-14 pb-8 flex flex-col items-center"
      >
        {/* Photo + sticker */}
        <div className="relative mb-4" style={{ width: 168, height: 194 }}>
          <div style={{ transform: 'rotate(6deg)', transformOrigin: 'center' }}>
            <Image
              src="/canvas/aboutme/photo.png"
              alt={dict.about.tagline}
              width={168}
              height={194}
              sizes="168px"
              quality={90}
              className="block object-contain"
              priority
            />
          </div>
          {/* Argentina sticker */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: -28,
              top: -18,
              width: 80,
              height: 48,
              transform: 'rotate(-12.99deg)',
            }}
          >
            <Image
              src="/canvas/aboutme/sticker-arg.png"
              alt="Argentina sticker"
              width={95}
              height={95}
              sizes="95px"
              quality={90}
              className="absolute pointer-events-none select-none"
              style={{ left: '-10.1%', top: '-48.18%', width: '118.81%', height: '198.02%' }}
            />
          </div>
        </div>

        {/* Paper note with bio */}
        <div
          className="relative bg-paper rounded shadow-card px-6 py-5 max-w-[300px] w-full"
          style={{ transform: 'rotate(-1.5deg)' }}
        >
          <div className="font-script text-xl leading-snug text-black/85 space-y-0.5">
            <p>{dict.about.headline}</p>
            {dict.about.bodyLines.map((line: string) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* Stars */}
          <div className="flex justify-end mt-1">
            <Image
              src="/canvas/aboutme/stars.png"
              alt=""
              width={36}
              height={36}
              sizes="36px"
              quality={90}
              className="pointer-events-none object-contain select-none"
              style={{ transform: 'rotate(-16.52deg)' }}
              aria-hidden
            />
          </div>

          {/* Contact links */}
          <div className="font-script flex flex-wrap gap-x-4 gap-y-1 mt-2 text-lg text-black/85">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="underline underline-offset-2 decoration-black/50 hover:text-black transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Projects list */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        className="px-4 pb-24 flex flex-col gap-6"
      >
        {PROJECTS.map((item, i) => {
          const project = projectMap.get(item.slug)
          if (!project) return null
          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/${locale}/work/${item.slug}`}
                aria-label={`${dict.ui.openProject}: ${project.card.title}`}
                className="focus-visible:outline-accent block focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={item.src}
                    alt=""
                    width={item.photo.w}
                    height={item.photo.h}
                    sizes="(max-width: 767px) calc(100vw - 32px)"
                    quality={90}
                    className="w-full h-auto object-contain"
                    priority={i < 2}
                  />
                  {/* Sticky note overlay — positioned relative to the photo group */}
                  <div
                    className="absolute"
                    style={{
                      left: `${((item.note.x - item.photo.x) / item.photo.w) * 100}%`,
                      top: `${((item.note.y - item.photo.y) / item.photo.h) * 100}%`,
                      width: `${(item.note.w / item.photo.w) * 100}%`,
                      paddingTop: `${(item.note.h / item.photo.h) * 100}%`,
                      transform: `rotate(${item.note.rotation}deg)`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <div className="absolute inset-0">
                      <StickyNote
                        title={project.card.title}
                        subtitle={project.card.subtitle}
                        color={item.note.color}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.section>
    </div>
  )
}
