import type { NoteColor } from '@/lib/content/schema'

const colorHex: Record<NoteColor, string> = {
  purple: '#e5dbfc',
  pink: '#fcd3c9',
  yellow: '#fff5b8',
  green: '#d6f5db',
  blue: '#d3eefe',
  orange: '#ffebc9',
}

// Figma rotations: card 0=+2°, card 1=−2°, card 2=+1°, card 3=−1°
const rotations = [2, -2, 1, -1]

interface StatCardsProps {
  cards: { value: string; label: string; color: NoteColor }[]
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <section className="mx-auto flex w-full max-w-[680px] flex-wrap justify-center gap-6 px-6 md:px-0">
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
                {/* Value — Caveat Bold 40px */}
                <p
                  className="font-script absolute font-bold text-ink"
                  style={{ fontSize: 40, lineHeight: 'normal', top: 34, left: 20, whiteSpace: 'pre-wrap' }}
                >
                  {card.value}
                </p>
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
