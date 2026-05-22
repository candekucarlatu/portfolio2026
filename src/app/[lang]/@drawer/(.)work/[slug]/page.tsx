import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getProject, isProjectSlug } from '@/lib/content/loader'
import { ProjectSheet } from '@/components/drawer/ProjectSheet'
import { CaseStudy } from '@/components/case-study/CaseStudy'
import { VisitedTracker } from '@/components/canvas/VisitedTracker'

export default async function InterceptedWorkPage({ params }: PageProps<'/[lang]/work/[slug]'>) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()
  if (!isProjectSlug(slug)) notFound()
  const dict = await getDictionary(lang)
  const project = await getProject(slug, lang)
  return (
    <ProjectSheet closeLabel={dict.ui.closeProject}>
      <VisitedTracker slug={slug} />
      <CaseStudy project={project} dict={dict} locale={lang} />
    </ProjectSheet>
  )
}
