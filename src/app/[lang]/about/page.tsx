import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isLocale, LOCALES } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { AboutMe } from '@/components/about/AboutMe'

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <main className="bg-paper text-ink min-h-screen overflow-y-auto at-wide-h-screen at-wide-overflow-hidden">
      <Link
        href={`/${lang}`}
        className="text-ink/70 hover:text-ink focus-visible:outline-accent border-ink/15 bg-paper/80 fixed top-4 left-4 z-20 inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:top-6 md:left-6"
      >
        ← {dict.ui.backHome}
      </Link>
      <AboutMe dict={dict} />
    </main>
  )
}
