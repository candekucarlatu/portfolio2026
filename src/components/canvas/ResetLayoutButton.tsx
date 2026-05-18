'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface ResetLayoutButtonProps {
  visible: boolean
  onReset: () => void
  label: string
}

export function ResetLayoutButton({ visible, onReset, label }: ResetLayoutButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="reset-layout"
          type="button"
          onClick={onReset}
          className="bg-ink/80 hover:bg-ink focus-visible:outline-accent fixed right-4 bottom-4 z-50 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] text-white shadow-md backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:right-6 md:bottom-6"
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
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
          {label}
        </motion.button>
      )}
    </AnimatePresence>
  )
}
