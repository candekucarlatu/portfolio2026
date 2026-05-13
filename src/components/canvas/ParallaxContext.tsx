'use client'

import { createContext, useContext } from 'react'
import type { MotionValue } from 'framer-motion'

export interface ParallaxValues {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export const ParallaxContext = createContext<ParallaxValues | null>(null)

export function useParallax(): ParallaxValues {
  const ctx = useContext(ParallaxContext)
  if (!ctx) throw new Error('useParallax must be used within PortfolioCanvas')
  return ctx
}
