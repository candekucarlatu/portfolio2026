'use client'

import { useRef, useEffect, useState } from 'react'
import type { NoteColor } from '@/lib/content/schema'

const colorHex: Record<NoteColor, string> = {
  purple: '#e5dbfc',
  pink: '#fcd3c9',
  yellow: '#fff5b8',
  green: '#d6f5db',
  blue: '#b8def2',
  orange: '#ffebc9',
}

const rotations = [2, -2, 1, -1]

interface StatCardsProps {
  cards: { value: string; label: string; color: NoteColor }[]
}

function CardValue({ value }: { value: string }) {
  if (value.includes('★')) {
    const parts = value.split('★')
    return (
      <p className="font-script absolute font-bold text-ink"
        style={{ top: 38, left: 20, lineHeight: 0, fontSize: 0, whiteSpace: 'nowrap' }}>
        <span style={{ fontSize: 40, lineHeight: 'normal' }}>{parts[0]}</span>
        <span style={{ fontSize: 24, lineHeight: 'normal', fontWeight: 400 }}>★</span>
        {parts[1]}
      </p>
    )
  }
  if (value.length > 8) {
    return (
      <p className="font-script absolute font-bold text-ink"
        style={{ fontSize: 24, lineHeight: 'normal', top: 24, left: 20, width: 165 }}>
        {value}
      </p>
    )
  }
  return (
    <p className="font-script absolute font-bold text-ink"
      style={{ fontSize: 40, lineHeight: 'normal', top: 34, left: 20, whiteSpace: 'nowrap' }}>
      {value}
    </p>
  )
}

function CardList({ cards }: StatCardsProps) {
  return (
    <>
      {cards.map((card, i) => {
        const rotation = rotations[i % rotations.length]
        return (
          <div key={i} className="flex items-center justify-center"
            style={{ width: 212, height: 176 }}>
            <div style={{ transform: `rotate(${rotation}deg)` }}>
              <div className="relative overflow-hidden"
                style={{
                  width: 206, height: 169,
                  backgroundColor: colorHex[card.color],
                  boxShadow: '2px 5px 10px 0px rgba(0,0,0,0.1)',
                }}>
                <CardValue value={card.value} />
                <p className="font-script absolute font-normal text-ink"
                  style={{ fontSize: 16, lineHeight: 1.35, top: 96, left: 19, width: 165 }}>
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export function StatCards({ cards }: StatCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Default to 327px (375px viewport − 48px padding) for SSR
  const [containerW, setContainerW] = useState(327)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = Math.min(cards.length, 4)
  const gapPx = 8
  const rawW = n * 212 + (n - 1) * gapPx
  const scale = Math.min(0.95, containerW / rawW)
  const scaledH = Math.round(176 * scale)

  return (
    <section className="mx-auto w-full max-w-[700px] px-6 md:px-0">
      {/* Mobile: measure container, scale all cards into one row */}
      <div ref={containerRef} className="md:hidden overflow-hidden flex justify-center"
        style={{ height: scaledH }}>
        <div style={{
          display: 'flex',
          gap: gapPx,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          flexShrink: 0,
        }}>
          <CardList cards={cards} />
        </div>
      </div>

      {/* Desktop: wrapped layout */}
      <div className="hidden flex-wrap justify-center gap-6 md:flex">
        <CardList cards={cards} />
      </div>
    </section>
  )
}
