import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { ProjectSheet } from '@/components/drawer/ProjectSheet'
import { AboutMe } from '@/components/about/AboutMe'
import { VisitedTracker } from '@/components/canvas/VisitedTracker'

export default async function InterceptedAboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <ProjectSheet closeLabel={dict.ui.closeProject} noScroll>
      <VisitedTracker slug="aboutme" />
      <AboutMe dict={dict} />
    </ProjectSheet>
  )
}
