'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Drawer } from 'vaul'
import { useMediaQuery } from '@/lib/useMediaQuery'

interface ProjectSheetProps {
  children: React.ReactNode
  closeLabel: string
  noScroll?: boolean
}

export function ProjectSheet({ children, closeLabel, noScroll = false }: ProjectSheetProps) {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 1024px)', true)
  const isVeryWide = useMediaQuery('(min-width: 1537px)', false)
  const isMediumWide = useMediaQuery('(min-width: 1251px)', false)
  // noScroll only applies at ≥1537px (AboutMe fixed side-by-side layout).
  // Below that, About Me scrolls just like a case study modal.
  const effectiveNoScroll = noScroll && isVeryWide
  const sidePadding = isVeryWide ? 360 : isMediumWide ? 120 : 0
  const [open, setOpen] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
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
  // and reveal bottom gap when user reaches the end of content
  useEffect(() => {
    if (!isDesktop || effectiveNoScroll) return
    const el = panelRef.current
    if (!el) return
    const handler = () => {
      setScrolled(el.scrollTop > 20)
      setAtBottom((prev) => {
        const nearEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
        if (nearEnd) return true
        // Hysteresis: only unset when well past the end threshold (>150px buffer
        // absorbs the 128px panel shrink that would otherwise cause oscillation)
        const farFromEnd = el.scrollTop + el.clientHeight < el.scrollHeight - 150
        return prev && !farFromEnd
      })
    }
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
              className={`canvas-scroll-hidden fixed z-50 overflow-hidden shadow-2xl${effectiveNoScroll ? '' : ' overflow-y-auto overscroll-contain'}`}
              style={{ left: sidePadding, right: sidePadding }}
              initial={{ top: 88, bottom: 0, y: reduceMotion ? 0 : '100%', borderRadius: effectiveNoScroll ? '20px 20px 0 0' : '20px' }}
              animate={{
                top: effectiveNoScroll ? 88 : scrolled ? 0 : 88,
                bottom: effectiveNoScroll ? 0 : atBottom ? 128 : 0,
                y: 0,
                borderRadius: effectiveNoScroll
                  ? '20px 20px 0 0'
                  : !scrolled ? '20px' : atBottom ? '0 0 20px 20px' : '0px',
              }}
              exit={{ top: 88, bottom: 0, y: reduceMotion ? 0 : '100%', borderRadius: effectiveNoScroll ? '20px 20px 0 0' : '20px' }}
              transition={{
                y: {
                  duration: reduceMotion ? 0.01 : 0.52,
                  ease: [0.16, 1, 0.3, 1],
                },
                top: {
                  duration: reduceMotion ? 0.01 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
                bottom: {
                  duration: reduceMotion ? 0.01 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
                borderRadius: {
                  duration: reduceMotion ? 0.01 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
            >
              {/* bg-paper wrapper */}
              {effectiveNoScroll ? (
                <div className="bg-paper text-ink relative h-full overflow-y-auto canvas-scroll-hidden overscroll-contain">
                  {/* Close button floats over content so children fill full height */}
                  <div className="absolute right-4 top-4 z-50">
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
                  <div className="h-full">{children}</div>
                </div>
              ) : (
                <div className="bg-paper text-ink overflow-hidden pb-0">
                  {/* Close button */}
                  <div className="flex flex-shrink-0 justify-end px-4 pt-4">
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
              )}

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
        <Drawer.Overlay
          className="fixed inset-0 z-40 backdrop-blur-[4px]"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,62,0,0.28) 100%)' }}
        />
        <Drawer.Content className="bg-paper text-ink fixed inset-x-0 bottom-6 z-50 mt-24 flex h-[92vh] flex-col rounded-t-2xl outline-none">
          <Drawer.Title className="sr-only">Project</Drawer.Title>
          <div className="flex-shrink-0 pt-4" />
          {/* noScroll is a desktop-only concept — mobile always scrolls */}
          <div className="canvas-scroll-hidden flex-1 overflow-y-auto overscroll-contain">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
