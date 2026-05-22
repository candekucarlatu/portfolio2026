'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { otherLocale, type Locale } from '@/lib/i18n/config'
import { useCanvasLayout } from '@/lib/canvas/useCanvasLayout'

interface TopRightControlsProps {
  current: Locale
  langLabel: string
  resetLabel: string
}

/** Base button styles shared by both buttons. */
const btnBase =
  'rounded-full border px-3 py-1.5 text-[13px] font-medium tracking-wide uppercase backdrop-blur transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/** Full-opacity style — used on the home canvas. */
const btnNormal = `${btnBase} border-ink/15 bg-paper/85 text-ink hover:border-ink/30 hover:bg-paper`

/** Subtle/ghost style — used when a project or About page is open (less distracting). */
const btnSubtle = `${btnBase} border-ink/10 bg-paper/40 text-ink/60 hover:bg-paper/65 hover:text-ink`

export function TopRightControls({ current, langLabel, resetLabel }: TopRightControlsProps) {
  const pathname = usePathname() ?? `/${current}`
  const target = otherLocale(current)
  const { hasCustomLayout, reset } = useCanvasLayout()

  const href = useMemo(() => {
    const segments = pathname.split('/')
    if (segments[1] === current) {
      segments[1] = target
      return segments.join('/') || `/${target}`
    }
    return `/${target}${pathname}`
  }, [pathname, current, target])

  // Use subtle style when a project drawer or about page is overlaid on the canvas
  const isInsidePage = pathname.split('/').filter(Boolean).length > 1
  const btnClass = isInsidePage ? btnSubtle : btnNormal

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-4 md:top-6 md:right-6">
      {/* Reset layout — animates in/out, appears to the left of the lang switch */}
      <AnimatePresence>
        {hasCustomLayout && (
          <motion.button
            key="reset-layout"
            type="button"
            onClick={reset}
            className={`inline-flex items-center gap-1.5 ${btnClass}`}
            initial={{ opacity: 0, scale: 0.9, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-label={resetLabel}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 12a9 9 0 0 1 15.4-6.36L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.4 6.36L3 16m0 5v-5h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {resetLabel}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Language switch — always visible */}
      <Link
        href={href}
        className={btnClass}
        aria-label={`Switch to ${target.toUpperCase()}`}
      >
        {langLabel}
      </Link>
    </div>
  )
}
