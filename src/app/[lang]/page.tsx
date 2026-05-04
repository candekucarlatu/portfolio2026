import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getAllProjects } from '@/lib/content/loader'
import { PortfolioCanvas } from '@/components/canvas/PortfolioCanvas'
import { LanguageSwitch } from '@/components/canvas/LanguageSwitch'

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const projects = await getAllProjects(lang)

  return (
    <main>
      <PortfolioCanvas projects={projects} dict={dict} locale={lang} />
      <LanguageSwitch current={lang} label={dict.ui.languageSwitch} />
    </main>
  )
}
