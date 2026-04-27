import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/config'

function pickLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') ?? ''
  const candidates = header.split(',').map((part) => part.split(';')[0].trim().toLowerCase())
  for (const candidate of candidates) {
    const base = candidate.split('-')[0]
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale
  }
  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return

  const locale = pickLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|favicon\\.ico|icon\\.svg|robots\\.txt|sitemap\\.xml|.*\\.[\\w]+$).*)'],
}
