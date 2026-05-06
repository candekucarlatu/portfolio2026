import type { Project, Section } from '@/lib/content/schema'
import type { Dictionary } from '@/lib/i18n/dictionaries'
import type { Locale } from '@/lib/i18n/config'
import { Hero } from './sections/Hero'
import { SectionBlock } from './sections/SectionBlock'
import { StatCards } from './sections/StatCards'
import { HighlightBlock } from './sections/HighlightBlock'
import { ImageBlock } from './sections/ImageBlock'
import { Insight } from './sections/Insight'
import { CalloutList } from './sections/CalloutList'
import { VideoMockup } from './sections/VideoMockup'
import { NextProject } from './sections/NextProject'

interface CaseStudyProps {
  project: Project
  dict: Dictionary
  locale: Locale
}

/**
 * Returns the top margin class for a section based on what precedes it.
 *
 * Spacing rules (from Figma 156:373):
 *  - Hero → first section group:            88 px
 *  - Section label → stat-cards / callout-list / highlight: 48 px
 *  - Section label → image / video:         64 px
 *  - Content block → next section group:   104 px
 *  - next-project has its own border — no extra margin
 */
function getTopSpacing(prev: Section | null, curr: Section): string {
  if (!prev) return '' // Hero is the first item — handled by its own pt

  const p = prev.type
  const c = curr.type

  // Hero → first section group
  if (p === 'hero') return 'mt-[88px]'

  // Inside a section group: section label → its content
  if (p === 'section') {
    if (c === 'stat-cards' || c === 'highlight' || c === 'callout-list' || c === 'insight')
      return 'mt-[48px]'
    if (c === 'image' || c === 'video') return 'mt-[64px]'
  }

  // Between groups: any content block → next section label
  if (c === 'section') return 'mt-[104px]'

  // Next project lives at the bottom — no extra margin (has its own border-t)
  if (c === 'next-project') return 'mt-0'

  // Default fallback
  return 'mt-[48px]'
}

export function CaseStudy({ project, dict, locale }: CaseStudyProps) {
  return (
    <article className="bg-paper text-ink mx-auto flex w-full flex-col pb-0">
      {project.sections.map((section, idx) => {
        const prev = idx > 0 ? project.sections[idx - 1] : null
        const spacing = getTopSpacing(prev, section)

        const rendered = (() => {
          switch (section.type) {
            case 'hero':
              return (
                <Hero
                  title={section.title}
                  subtitle={section.subtitle}
                  meta={section.meta}
                  metaLabels={dict.meta}
                />
              )
            case 'section':
              return (
                <SectionBlock
                  label={section.label}
                  title={section.title}
                  body={section.body}
                />
              )
            case 'stat-cards':
              return <StatCards cards={section.cards} />
            case 'highlight':
              return <HighlightBlock body={section.body} />
            case 'image':
              return (
                <ImageBlock
                  image={section.image}
                  caption={section.caption}
                  width={section.width}
                />
              )
            case 'insight':
              return (
                <Insight
                  title={section.title}
                  body={section.body}
                  image={section.image}
                  reverse={section.reverse}
                />
              )
            case 'callout-list':
              return <CalloutList items={section.items} />
            case 'video':
              return (
                <VideoMockup
                  src={section.src}
                  poster={section.poster}
                  background={section.background}
                />
              )
            case 'next-project':
              return (
                <NextProject
                  slug={section.slug}
                  title={section.title}
                  cta={section.cta}
                  image={section.image}
                  ctaLabel={dict.ui.nextCaseStudy}
                  locale={locale}
                />
              )
          }
        })()

        return (
          <div key={idx} className={spacing}>
            {rendered}
          </div>
        )
      })}
    </article>
  )
}
