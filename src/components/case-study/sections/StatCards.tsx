import type { NoteColor } from '@/lib/content/schema'

const colorHex: Record<NoteColor, string> = {
  purple: '#e5dbfc',
  pink: '#fcd3c9',
  yellow: '#fff5b8',
  green: '#d6f5db',
  blue: '#b8def2',
  orange: '#ffebc9',
}

// Figma rotations: card 0=+2°, card 1=−2°, card 2=+1°, card 3=−1°
const rotations = [2, -2, 1, -1]

interface StatCardsProps {
  cards: { value: string; label: string; color: NoteColor }[]
}

/**
 * Renders the value text for a sticky note card.
 *
 * Rules (from Figma 170:846–855):
 *  - Value with ★ → number at 40px, star at 24px (e.g. "1.9 ★")
 *  - Long value (>8 chars, typically a quote) → 24px, positioned higher (top=24)
 *  - Short stat → 40px (default, top=34)
 */
function CardValue({ value }: { value: string }) {
  // Case: "1.9 ★" — split at the star, render star smaller
  if (value.includes('★')) {
    const parts = value.split('★')
    return (
      <p
        className="font-script absolute font-bold text-ink"
        style={{ top: 38, left: 20, lineHeight: 0, fontSize: 0, whiteSpace: 'nowrap' }}
      >
        <span style={{ fontSize: 40, lineHeight: 'normal' }}>{parts[0]}</span>
        <span style={{ fontSize: 24, lineHeight: 'normal', fontWeight: 400 }}>★</span>
        {parts[1]}
      </p>
    )
  }

  // Case: long text / quote (e.g. "\"just another coupon app.\"")
  if (value.length > 8) {
    return (
      <p
        className="font-script absolute font-bold text-ink"
        style={{ fontSize: 24, lineHeight: 'normal', top: 24, left: 20, width: 165 }}
      >
        {value}
      </p>
    )
  }

  // Default: short stat (84%, etc.)
  return (
    <p
      className="font-script absolute font-bold text-ink"
      style={{ fontSize: 40, lineHeight: 'normal', top: 34, left: 20, whiteSpace: 'nowrap' }}
    >
      {value}
    </p>
  )
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <section className="mx-auto flex w-full max-w-[700px] flex-wrap justify-center gap-6 px-6 md:px-0">
      {cards.map((card, i) => {
        const rotation = rotations[i % rotations.length]
        return (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ width: 212, height: 176 }}
          >
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
                {/* Label — Caveat Regular 16px */}
                <p
                  className="font-script absolute font-normal text-ink"
                  style={{ fontSize: 16, lineHeight: 1.35, top: 96, left: 19, width: 165 }}
                >
                  {card.label}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
