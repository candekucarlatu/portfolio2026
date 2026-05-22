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
import { ImageCompare } from './sections/ImageCompare'
import { ResearchCards } from './sections/ResearchCards'
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
  if (p === 'hero') return 'mt-[40px] md:mt-[48px] lg:mt-[88px]'

  // Inside a section group: section label → its content
  if (p === 'section') {
    if (c === 'callout-list') return 'mt-[20px] md:mt-[48px]'
    if (c === 'stat-cards' || c === 'highlight' || c === 'insight')
      return 'mt-[40px] md:mt-[48px]'
    if (c === 'image' || c === 'video' || c === 'image-compare' || c === 'research-cards') return 'mt-[20px] md:mt-[40px] lg:mt-[64px]'
  }

  // Consecutive insights: tighter gap on tablet
  if (p === 'insight' && c === 'insight') return 'mt-[24px] lg:mt-[48px]'

  // Between groups: any content block → next section label
  if (c === 'section') return 'mt-[40px] md:mt-[48px] lg:mt-[104px]'

  // All sections get 120px gap before next-project (gap is outside the background block)
  if (c === 'next-project') return 'mt-[40px] md:mt-[48px] lg:mt-[120px]'

  // Default fallback
  return 'mt-[40px] md:mt-[48px]'
}

export function CaseStudy({ project, dict, locale }: CaseStudyProps) {
  return (
    <article className="bg-paper text-ink mx-auto mb-0 flex w-full flex-col pb-0">
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
                  variant={section.variant}
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
                  imageSrc={section.imageSrc}
                  poster={section.poster}
                  background={section.background}
                  variant={section.variant}
                  frameSrc={section.frameSrc}
                />
              )
            case 'image-compare':
              return (
                <ImageCompare
                  before={section.before}
                  after={section.after}
                  background={section.background}
                  beforeLabel={section.beforeLabel}
                  afterLabel={section.afterLabel}
                  height={section.height}
                  imageAspectRatio={section.imageAspectRatio}
                />
              )
            case 'research-cards':
              return <ResearchCards cards={section.cards} layout={section.layout} />
            case 'next-project':
              return (
                <NextProject
                  slug={section.slug}
                  title={section.title}
                  cta={section.cta}
                  image={section.image}
                  imageLayout={section.imageLayout}
                  mobileImage={section.mobileImage}
                  mobileImageGap={section.mobileImageGap}
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
