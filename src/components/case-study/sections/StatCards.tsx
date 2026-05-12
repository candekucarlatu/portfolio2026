'use client'

import { useEffect, useRef } from 'react'
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

function Card({ card, rotation }: { card: StatCardsProps['cards'][number]; rotation: number }) {
  return (
    <div style={{ transform: `rotate(${rotation}deg)` }}>
      <div
        className="relative overflow-hidden"
        style={{
          width: 206,
          height: 169,
          backgroundColor: colorHex[card.color],
          boxShadow: '2px 5px 10px 0px rgba(0,0,0,0.1)',
        }}
      >
        <CardValue value={card.value} />
        <p
          className="font-script absolute font-normal text-ink"
          style={{ fontSize: 16, lineHeight: 1.35, top: 96, left: 19, width: 165 }}
        >
          {card.label}
        </p>
      </div>
    </div>
  )
}

export function StatCards({ cards }: StatCardsProps) {
  // Card slot matches Figma 493:217: 180×148px (scale ≈ 0.85× the base 212×176 wrapper)
  const slotW = 180
  const slotH = 148
  const gap = 16
  const carouselRef = useRef<HTMLDivElement>(null)

  // Start with the middle card centered
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const middleIndex = Math.floor(cards.length / 2)
    el.scrollLeft = middleIndex * (slotW + gap)
  }, [cards.length])

  return (
    <section className="mx-auto w-full max-w-[700px]">
      {/* Mobile: horizontal snap carousel — one card centered, adjacent ones peek */}
      <div
        ref={carouselRef}
        className="md:hidden overflow-x-auto flex scrollbar-none"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          gap,
          paddingLeft: `calc(50% - ${slotW / 2}px)`,
          paddingRight: `calc(50% - ${slotW / 2}px)`,
          paddingBottom: 12,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              scrollSnapAlign: 'center',
              flexShrink: 0,
              width: slotW,
              height: slotH,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Scale up the base card to fill the slot */}
            <div style={{ transform: `scale(${slotW / 212})` }}>
              <Card card={card} rotation={rotations[i % rotations.length]} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: wrapped row */}
      <div className="hidden flex-wrap justify-center gap-6 md:flex">
        {cards.map((card, i) => (
          <div key={i} className="flex items-center justify-center" style={{ width: 212, height: 176 }}>
            <Card card={card} rotation={rotations[i % rotations.length]} />
          </div>
        ))}
      </div>
    </section>
  )
}
