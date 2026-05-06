import type { Project } from '@/lib/content/schema'
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

export function CaseStudy({ project, dict, locale }: CaseStudyProps) {
  return (
    <article className="bg-paper text-ink mx-auto flex w-full flex-col gap-10 pt-2 pb-0 md:gap-16">
      {project.sections.map((section, idx) => {
        switch (section.type) {
          case 'hero':
            return (
              <Hero
                key={idx}
                title={section.title}
                subtitle={section.subtitle}
                meta={section.meta}
                metaLabels={dict.meta}
              />
            )
          case 'section':
            return (
              <SectionBlock
                key={idx}
                label={section.label}
                title={section.title}
                body={section.body}
              />
            )
          case 'stat-cards':
            return <StatCards key={idx} cards={section.cards} />
          case 'highlight':
            return <HighlightBlock key={idx} body={section.body} />
          case 'image':
            return (
              <ImageBlock
                key={idx}
                image={section.image}
                caption={section.caption}
                width={section.width}
              />
            )
          case 'insight':
            return (
              <Insight
                key={idx}
                title={section.title}
                body={section.body}
                image={section.image}
                reverse={section.reverse}
              />
            )
          case 'callout-list':
            return <CalloutList key={idx} items={section.items} />
          case 'video':
            return (
              <VideoMockup
                key={idx}
                src={section.src}
                poster={section.poster}
                background={section.background}
              />
            )
          case 'next-project':
            return (
              <NextProject
                key={idx}
                slug={section.slug}
                title={section.title}
                image={section.image}
                ctaLabel={dict.ui.nextCaseStudy}
                locale={locale}
              />
            )
        }
      })}
    </article>
  )
}
