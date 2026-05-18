'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cande:canvas-layout:v1'

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

function writeStored(layout: LayoutMap) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout))
  } catch {
    // ignore storage errors (quota, private mode)
  }
}

function keyFor(slug: string, itemId: string) {
  return `${slug}/${itemId}`
}

export function useCanvasLayout() {
  const [layout, setLayout] = useState<LayoutMap>(() => readStored())

  useEffect(() => {
    writeStored(layout)
  }, [layout])

  const getPosition = useCallback(
    (slug: string, itemId: string): ItemPosition | null => layout[keyFor(slug, itemId)] ?? null,
    [layout],
  )

  const setPosition = useCallback((slug: string, itemId: string, pos: ItemPosition) => {
    setLayout((prev) => ({ ...prev, [keyFor(slug, itemId)]: pos }))
  }, [])

  const reset = useCallback(() => {
    setLayout({})
  }, [])

  const hasCustomLayout = Object.keys(layout).length > 0

  return { getPosition, setPosition, reset, hasCustomLayout }
}
