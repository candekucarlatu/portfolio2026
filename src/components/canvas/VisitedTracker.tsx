'use client'

import { useEffect } from 'react'
import { useVisitedSlugs } from '@/lib/canvas/useVisitedSlugs'

/**
 * Invisible client component. Add to any case-study page to mark its slug
 * as visited in localStorage so the home canvas can show the visited state.
 */
export function VisitedTracker({ slug }: { slug: string }) {
  const { markVisited } = useVisitedSlugs()
  useEffect(() => {
    markVisited(slug)
  }, [slug, markVisited])
  return null
}
