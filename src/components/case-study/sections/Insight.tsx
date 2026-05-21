import Image from 'next/image'
import type { ProjectImage } from '@/lib/content/schema'

interface InsightProps {
  title: string
  body: string
  image: ProjectImage
  reverse?: boolean
}

/**
 * Insight card — matches ResearchCards horizontal layout (Figma 358:9101).
 * White card with drop-shadow. reverse=false → text left / image right;
 * reverse=true → image left / text right.
 *
 * Mobile: image always stacked on top, text below, smaller typography.
 * Image is rendered first in DOM; on desktop `lg:order-last` moves it
 * to the right when reverse=false.
 */
export function Insight({ title, body, image, reverse }: InsightProps) {
  return (
    <section className="mx-[24px] lg:mx-[56px]">
      <div
        className="bg-white overflow-hidden flex flex-col md:flex-row md:items-center lg:shadow-[0px_6px_20px_rgba(0,0,0,0.1)]"
      >
        {/* Image — always first on mobile; on tablet+ moves right when reverse=false */}
        <div className={`w-full shrink-0 overflow-hidden md:w-1/2 xl:w-[599px] ${!reverse ? 'md:order-last' : ''}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 599}
            height={image.height ?? 446}
            className="w-full h-auto"
          />
        </div>

        {/* Text */}
        <div
          className={`flex flex-1 flex-col justify-center gap-3 px-6 py-6 md:gap-4 lg:gap-5 ${
            !reverse
              ? 'md:pl-[32px] md:pr-[24px] md:py-[32px] lg:pl-[56px] lg:pr-[40px] lg:py-[40px]'
              : 'md:p-[32px] lg:p-[40px]'
          }`}
        >
          <h3 className="text-ink text-[18px] leading-[1.35] font-bold lg:text-[24px] lg:leading-[1.4]">
            {title}
          </h3>
          <p className="text-muted text-[14px] leading-[1.55] lg:text-[16px] lg:leading-[1.58]">
            {body}
          </p>
        </div>
      </div>
    </section>
  )
}
