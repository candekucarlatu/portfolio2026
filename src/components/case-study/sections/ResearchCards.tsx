import Image from 'next/image'
import type { ProjectImage } from '@/lib/content/schema'

interface ResearchCardsProps {
  cards: { title: string; body: string; image: ProjectImage; imageEdge?: boolean }[]
  layout?: 'stacked' | 'horizontal'
}

/**
 * Research insight cards.
 *
 * stacked (default) — Figma 358:9101 (Scribd)
 *   White cards with drop-shadow. Alternating: odd cards → image top, text bottom;
 *   even cards → text top, image bottom. Fully stacked (flex-col).
 *
 * horizontal — Figma 329:8676 (Kaplan)
 *   White cards with drop-shadow. Alternating: even cards (0, 2) → text left, image right;
 *   odd cards (1) → image left, text right. Responsive: stacks on mobile.
 */
export function ResearchCards({ cards, layout = 'stacked' }: ResearchCardsProps) {
  if (layout === 'horizontal') {
    return (
      <section className="mx-[24px] lg:mx-[56px] flex flex-col gap-[24px] lg:gap-[54px]">
        {cards.map((card, i) => {
          const imageRight = i % 2 === 0 // 0, 2 → text left / image right; 1 → image left / text right

          return (
            <div
              key={i}
              className="bg-white overflow-hidden flex flex-col md:flex-row md:items-center lg:shadow-[0px_6px_20px_rgba(0,0,0,0.1)]"
            >
              {/* Image — always first on mobile; on tablet+ moves right for even cards */}
              <div className={`w-full shrink-0 overflow-hidden md:w-1/2 lg:w-[599px] ${imageRight ? 'md:order-last' : ''}`}>
                <Image
                  src={card.image.src}
                  alt={card.image.alt}
                  width={card.image.width ?? 599}
                  height={card.image.height ?? 446}
                  className="w-full h-auto block"
                />
              </div>

              {/* Text content */}
              <div
                className={`flex flex-1 flex-col gap-3 px-6 py-6 md:gap-4 lg:gap-5 ${
                  imageRight
                    ? 'md:pl-[32px] md:pr-[24px] md:py-[32px] lg:pl-[56px] lg:pr-[40px] lg:py-[40px]'
                    : 'md:p-[32px] lg:p-[40px]'
                }`}
              >
                <h3 className="text-ink text-[18px] leading-[1.35] font-bold lg:text-[28px] lg:leading-[1.4]">
                  {card.title}
                </h3>
                <p className="text-muted text-[14px] leading-[1.55] lg:text-[18px]">{card.body}</p>
              </div>
            </div>
          )
        })}
      </section>
    )
  }

  // stacked layout (default — Scribd)
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
