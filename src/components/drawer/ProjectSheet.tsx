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
    // Wait for exit animation, then navigate back
    window.setTimeout(() => router.back(), reduceMotion ? 0 : isDesktop ? 520 : 280)
  }, [router, reduceMotion])

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
          <motion.div
            className="bg-paper text-ink fixed inset-0 z-50 flex flex-col"
            initial={{ y: reduceMotion ? 0 : '100%' }}
            animate={{ y: 0 }}
            exit={{ y: reduceMotion ? 0 : '100%' }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.52,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={close}
              className="border-ink/15 bg-paper hover:border-ink/30 hover:bg-cork focus-visible:outline-accent absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-md border text-[#5e22ed] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
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
            <div className="canvas-scroll-hidden flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

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
