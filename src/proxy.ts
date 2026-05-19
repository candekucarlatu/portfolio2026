import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/lib/i18n/config'

function pickLocale(_request: NextRequest): Locale {
  // Always default to English regardless of browser language.
  // Visitors can switch to Spanish via the language toggle.
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
