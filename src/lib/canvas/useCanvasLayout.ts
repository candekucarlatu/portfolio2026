'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'cande:canvas-layout:v1'
const LAYOUT_EVENT = 'cande:canvas-layout-update'

export interface ItemPosition {
  x: number
  y: number
}

type LayoutMap = Record<string, ItemPosition>

function readStored(): LayoutMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? (parsed as LayoutMap) : {}
  } catch {
    return {}
  }
}

function keyFor(slug: string, itemId: string) {
  return `${slug}/${itemId}`
}

export function useCanvasLayout() {
  const [layout, setLayout] = useState<LayoutMap>({})
  const layoutRef = useRef<LayoutMap>({})

  const updateLayout = useCallback((next: LayoutMap) => {
    layoutRef.current = next
    setLayout(next)
  }, [])

  // Hydrate from storage on mount
  useEffect(() => {
    const stored = readStored()
    layoutRef.current = stored
    setLayout(stored)
  }, [])

  // Sync from other hook instances in the same page via custom event
  useEffect(() => {
    const handler = () => {
      const stored = readStored()
      // Only update if different to avoid a redundant re-render on the source instance
      if (JSON.stringify(stored) !== JSON.stringify(layoutRef.current)) {
        updateLayout(stored)
      }
    }
    window.addEventListener(LAYOUT_EVENT, handler)
    return () => window.removeEventListener(LAYOUT_EVENT, handler)
  }, [updateLayout])

  const getPosition = useCallback(
    (slug: string, itemId: string): ItemPosition | null => layoutRef.current[keyFor(slug, itemId)] ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [layout], // re-derive when layout state updates so consumers re-render
  )

  const setPosition = useCallback(
    (slug: string, itemId: string, pos: ItemPosition) => {
      const next = { ...layoutRef.current, [keyFor(slug, itemId)]: pos }
      updateLayout(next) // local update first (sets layoutRef before the event fires)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        window.dispatchEvent(new CustomEvent(LAYOUT_EVENT))
      } catch {
        // ignore storage errors (quota, private mode)
      }
    },
    [updateLayout],
  )

  const reset = useCallback(() => {
    updateLayout({})
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.dispatchEvent(new CustomEvent(LAYOUT_EVENT))
    } catch {
      // ignore storage errors
    }
  }, [updateLayout])

  const hasCustomLayout = Object.keys(layout).length > 0

  return { getPosition, setPosition, reset, hasCustomLayout }
}
