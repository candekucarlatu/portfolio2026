'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Drawer } from 'vaul'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface ProjectSheetProps {
  children: React.ReactNode
  closeLabel: string
}

export function ProjectSheet({ children, closeLabel }: ProjectSheetProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)', true)
  const isVeryWide = useMediaQuery('(min-width: 1537px)', false)
  const isMediumWide = useMediaQuery('(min-width: 1251px)', false)
  const sidePadding = isVeryWide ? 360 : isMediumWide ? 120 : 0
  const [open, setOpen] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const closingRef = useRef(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setOpen(false)
    window.setTimeout(() => router.back(), reduceMotion ? 0 : isDesktop ? 520 : 280)
  }, [router, reduceMotion, isDesktop])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  // Track scroll position to collapse top gap when user scrolls down
  useEffect(() => {
    if (!isDesktop) return
    const el = panelRef.current
    if (!el) return
    const handler = () => setScrolled(el.scrollTop > 20)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [isDesktop])

  if (isDesktop) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop — diagonal gradient white → orange + blur, click to close */}
            <motion.div
              key="sheet-backdrop"
              className="fixed inset-0 z-40 backdrop-blur-[4px]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,62,0,0.28) 100%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
              onClick={close}
            />

            {/*
             * Panel — starts at 88px from top. Shrinks to top:0 as user scrolls,
             * giving the appearance the content is "taking over" the screen.
             * Rounded corners stay visible at all times (sides are always 360px).
             *
             * overflow-hidden clips rounded corners on scrollable content.
             * overflow-y-auto scrolls content inside.
             */}
            <motion.div
              ref={panelRef}
              key="sheet-panel"
              className="canvas-scroll-hidden fixed z-50 overflow-hidden overflow-y-auto overscroll-contain shadow-2xl"
              style={{ left: sidePadding, right: sidePadding, bottom: 128 }}
              initial={{ top: 88, y: reduceMotion ? 0 : '100%', borderRadius: '20px' }}
              animate={{
                top: scrolled ? 0 : 88,
                y: 0,
                // When scrolled: no corners at all (panel fills edge-to-edge)
                // When at top: all 4 corners rounded (floating card)
                // Bottom corners always rounded — visible against the backdrop
                borderRadius: scrolled ? '0 0 20px 20px' : '20px',
              }}
              exit={{ top: 88, y: reduceMotion ? 0 : '100%', borderRadius: '20px' }}
              transition={{
                y: {
                  duration: reduceMotion ? 0.01 : 0.52,
                  ease: [0.16, 1, 0.3, 1],
                },
                top: {
                  duration: reduceMotion ? 0.01 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
                borderRadius: {
                  duration: reduceMotion ? 0.01 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
            >
              {/* bg-paper wrapper — overflow-hidden clips rounded corners, pb gives breathing room at end */}
              <div className="bg-paper text-ink overflow-hidden pb-[88px]">
                {/* Close button — scrolls with content, like Stripe */}
                <div className="flex justify-end px-4 pt-4">
                  <button
                    type="button"
                    aria-label={closeLabel}
                    onClick={close}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/15 bg-paper transition-colors hover:border-ink/30 hover:bg-cork focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{ color: '#FF3E00' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                      <path
                        d="M1 1L13 13M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                {children}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Mobile — vaul bottom sheet
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) close()
      }}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="bg-ink/40 fixed inset-0 z-40" />
        <Drawer.Content className="bg-paper text-ink fixed inset-x-0 bottom-0 z-50 mt-24 flex h-[92vh] flex-col rounded-t-2xl outline-none">
          <Drawer.Title className="sr-only">Project</Drawer.Title>
          <div className="bg-ink/15 mx-auto mt-3 mb-1 h-1.5 w-[44px] flex-shrink-0 rounded-full" />
          <div className="canvas-scroll-hidden flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
