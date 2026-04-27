import clsx from 'clsx'
import type { NoteColor } from '@/lib/content/schema'

const noteStyles: Record<NoteColor, string> = {
  green: 'bg-note-green',
  blue: 'bg-note-blue',
  orange: 'bg-note-orange',
  purple: 'bg-note-purple',
}

interface StatCardsProps {
  cards: { value: string; label: string; color: NoteColor }[]
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <section className="mx-auto grid w-full max-w-[640px] grid-cols-1 gap-4 px-6 sm:grid-cols-3 md:px-0">
      {cards.map((card, i) => (
        <div
          key={i}
          className={clsx(
            'shadow-note text-ink flex aspect-square min-h-[170px] flex-col justify-between p-5',
            noteStyles[card.color],
          )}
          style={{ transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (i + 1) * 0.4}deg)` }}
        >
          <p className="font-script text-[26px] leading-[1.05] font-bold">{card.value}</p>
          <p className="font-script text-[15px] leading-[1.35]">{card.label}</p>
        </div>
      ))}
    </section>
  )
}
