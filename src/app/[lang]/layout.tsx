import type { Metadata, Viewport } from 'next'
import { Inter, Caveat } from 'next/font/google'
import { notFound } from 'next/navigation'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.site.title,
    description: dict.site.description,
    openGraph: {
      title: dict.site.title,
      description: dict.site.description,
      locale: lang,
      type: 'website',
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#fbfaf6',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
  drawer,
  params,
}: LayoutProps<'/[lang]'> & { drawer: React.ReactNode }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const locale = lang as Locale

  return (
    <html lang={locale} className={`${inter.variable} ${caveat.variable} h-full antialiased`}>
      <body className="bg-paper text-ink min-h-full overflow-hidden">
        {children}
        {drawer}
      </body>
    </html>
  )
}
