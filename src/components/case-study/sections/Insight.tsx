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
 * reverse=true → image left / text right. Stacks on mobile.
 */
export function Insight({ title, body, image, reverse }: InsightProps) {
  return (
    <section className="mx-[24px] lg:mx-[56px]">
      <div
        className="bg-white overflow-hidden flex flex-col lg:flex-row lg:items-center"
        style={{ boxShadow: '0px 6px 20px rgba(0,0,0,0.1)' }}
      >
        {/* Image on left (reverse=true) — hidden on mobile */}
        {reverse && (
          <div className="hidden lg:block w-full shrink-0 overflow-hidden lg:w-[599px]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 599}
              height={image.height ?? 446}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Text content */}
        <div
          className={`flex flex-1 flex-col justify-center gap-5 px-6 py-8 ${
            !reverse
              ? 'lg:pl-[56px] lg:pr-[40px] lg:py-[40px]'
              : 'lg:p-[40px]'
          }`}
        >
          <h3 className="text-ink text-[20px] leading-[1.4] font-bold lg:text-[24px]">
            {title}
          </h3>
          <p className="text-muted text-[15px] leading-[1.58] lg:text-[16px]">{body}</p>
        </div>

        {/* Image on right (reverse=false) — hidden on mobile */}
        {!reverse && (
          <div className="hidden lg:block w-full shrink-0 overflow-hidden lg:w-[599px]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 599}
              height={image.height ?? 446}
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
    </section>
  )
}
