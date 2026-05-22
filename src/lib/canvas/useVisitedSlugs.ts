'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio-visited'
const EVENT_NAME = 'portfolio-visited-update'

function readFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

/**
 * Tracks which project slugs the user has visited.
 * Persists to localStorage. Uses a custom DOM event so all hook instances
 * on the same page stay in sync without needing a context provider.
 */
export function useVisitedSlugs() {
  const [visited, setVisited] = useState<Set<string>>(() => new Set())

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setVisited(readFromStorage())
  }, [])

  // Listen for updates dispatched by markVisited (same tab)
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail
      setVisited((prev) => {
        if (prev.has(slug)) return prev
        const next = new Set(prev)
        next.add(slug)
        return next
      })
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  const markVisited = useCallback((slug: string) => {
    const current = readFromStorage()
    if (current.has(slug)) return
    current.add(slug)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]))
    } catch {
      // localStorage unavailable (private browsing, storage full, etc.)
    }
    window.dispatchEvent(new CustomEvent<string>(EVENT_NAME, { detail: slug }))
  }, [])

  return { visited, markVisited }
}
