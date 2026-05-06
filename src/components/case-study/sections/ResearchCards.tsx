import Image from 'next/image'
import type { ProjectImage } from '@/lib/content/schema'

interface ResearchCardsProps {
  cards: { title: string; body: string; image: ProjectImage }[]
}

/**
 * Research insight cards — Figma 358:9101
 * White cards with drop-shadow. Alternating layout: odd cards → text then image,
 * even cards → image then text. Fully stacked (flex-col) to work within the panel width.
 */
export function ResearchCards({ cards }: ResearchCardsProps) {
  return (
    <section className="mx-auto w-full max-w-[1180px] flex flex-col gap-[54px]">
      {cards.map((card, i) => {
        const imageFirst = i % 2 === 1 // index 1 → image on top

        return (
          <div key={i} className="bg-white shadow-[0px_6px_20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
            {imageFirst && (
              <div className="relative w-full" style={{ aspectRatio: '599/446' }}>
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            <div className={imageFirst ? 'flex flex-col gap-5 p-[40px]' : 'flex flex-col gap-5 px-[56px] py-[40px]'}>
              <h3 className="text-ink text-[22px] leading-[1.4] font-bold md:text-[28px]">
                {card.title}
              </h3>
              <p className="text-muted text-[17px] leading-[1.58]">{card.body}</p>
            </div>

            {!imageFirst && (
              <div className="relative w-full" style={{ aspectRatio: '599/446' }}>
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
