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
  const isDesktop = useMediaQuery('(min-width: 768px)', true)
  const [open, setOpen] = useState(true)
  const closingRef = useRef(false)

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

  if (isDesktop) {
    return (
      <AnimatePresence>
        {open && (
          <>
            {/* Full-screen white backdrop — dims the canvas, closes on click */}
            <motion.div
              key="sheet-backdrop"
              className="fixed inset-0 z-40 bg-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
              onClick={close}
            />

            {/*
             * Scrollable column — centered at max 720px (≈ 360px side gaps on 1440px screens).
             * Structure:
             *   - 88px top spacer  → the "air at top" on open; scrolls away as you read
             *   - White card       → fills min 100vh - 88px; slides up on enter
             *   - 88px bottom pad  → the "air at bottom" at end of content
             *
             * This gives the Stripe-style: gap at top when opened, full-height while
             * reading, gap at bottom when you reach the end.
             */}
            <motion.div
              key="sheet-panel"
              className="canvas-scroll-hidden fixed inset-x-0 inset-y-0 z-50 mx-auto w-full max-w-[720px] overflow-y-auto overscroll-contain"
              initial={{ y: reduceMotion ? 0 : '100%' }}
              animate={{ y: 0 }}
              exit={{ y: reduceMotion ? 0 : '100%' }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.52,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Top spacer — clicking it closes the modal (same as clicking backdrop) */}
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              <div className="h-[88px] flex-shrink-0" onClick={close} />

              {/* White card */}
              <div className="bg-paper text-ink relative min-h-[calc(100vh-88px)] rounded-t-2xl shadow-2xl">
                {/*
                 * Sticky close button — uses a zero-height sticky container so it doesn't
                 * push content down. The button floats in the top-right corner and stays
                 * visible while scrolling.
                 */}
                <div className="pointer-events-none sticky top-0 z-10 h-0">
                  <button
                    type="button"
                    aria-label={closeLabel}
                    onClick={close}
                    className="pointer-events-auto absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-md border border-ink/15 bg-paper transition-colors hover:border-ink/30 hover:bg-cork focus-visible:outline-2 focus-visible:outline-offset-2"
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

                {/* Case study content */}
                {children}

                {/* Bottom spacer — creates "air at bottom" visible at end of content */}
                <div className="h-[88px]" />
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
