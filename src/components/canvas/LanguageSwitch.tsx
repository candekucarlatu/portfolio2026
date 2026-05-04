'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { otherLocale, type Locale } from '@/lib/i18n/config'

interface LanguageSwitchProps {
  current: Locale
  label: string
}

export function LanguageSwitch({ current, label }: LanguageSwitchProps) {
  const pathname = usePathname() ?? `/${current}`
  const target = otherLocale(current)

  const href = useMemo(() => {
    const segments = pathname.split('/')
    if (segments[1] === current) {
      segments[1] = target
      return segments.join('/') || `/${target}`
    }
    return `/${target}${pathname}`
  }, [pathname, current, target])

  return (
    <Link
      href={href}
      className="border-ink/15 bg-paper/85 text-ink hover:border-ink/30 hover:bg-paper focus-visible:outline-accent fixed top-4 right-4 z-50 rounded-full border px-3 py-1.5 text-[13px] font-medium tracking-wide uppercase shadow-sm backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:top-6 md:right-6"
      aria-label={`Switch to ${target.toUpperCase()}`}
    >
      {label}
    </Link>
  )
}
