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
            {/* Backdrop — warm orange tint + blur, click to close */}
            <motion.div
              key="sheet-backdrop"
              className="fixed inset-0 z-40 backdrop-blur-[4px]"
              style={{ backgroundColor: 'rgba(255, 62, 0, 0.12)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.25 }}
              onClick={close}
            />

            {/*
             * Panel — fixed at 88px from top, 360px from each side, flush at bottom.
             * overflow-hidden clips the rounded-[20px] corners on the scrollable content.
             * overflow-y-auto scrolls the content inside.
             *
             * Structure inside:
             *   - bg-paper div: close button + case study content
             *   - transparent spacer at end: reveals the backdrop below (no white square)
             */}
            <motion.div
              key="sheet-panel"
              className="canvas-scroll-hidden fixed z-50 overflow-hidden overflow-y-auto overscroll-contain rounded-[20px] shadow-2xl"
              style={{ left: 360, right: 360, top: 88, bottom: 0 }}
              initial={{ y: reduceMotion ? 0 : '100%' }}
              animate={{ y: 0 }}
              exit={{ y: reduceMotion ? 0 : '100%' }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.52,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* bg-paper wrapper — content only, ends with the last section */}
              <div className="bg-paper text-ink">
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

              {/*
               * Transparent bottom spacer — sits outside bg-paper so the backdrop
               * shows through here instead of a white rectangle.
               */}
              <div className="h-[88px]" />
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
