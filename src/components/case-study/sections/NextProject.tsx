import Image from 'next/image'
import Link from 'next/link'
import type { ProjectImage } from '@/lib/content/schema'
import type { Locale } from '@/lib/i18n/config'

interface NextProjectProps {
  slug: string
  title: string
  cta?: string
  image?: ProjectImage
  ctaLabel: string
  locale: Locale
}

export function NextProject({ slug, title, image, ctaLabel, locale }: NextProjectProps) {
  return (
    <section
      className="relative w-full overflow-hidden border-t border-dashed pb-[88px]"
      style={{ backgroundColor: '#ede8dd', borderColor: '#bfb8b2' }}
    >
      {/* Content — padded left column: tag + title */}
      <div className="relative px-[64px] py-[88px] md:px-[106px]">
        <div className="flex flex-col gap-5 max-w-[450px]">
          {/* Tag */}
          <div className="inline-flex h-[25px] self-start items-center rounded-[2px] bg-white px-[10px]">
            <span className="text-ink text-[11px] font-bold tracking-[0.8px] whitespace-nowrap uppercase">
              {ctaLabel}
            </span>
          </div>

          {/* Title — the whole heading is the link */}
          <Link
            href={`/${locale}/work/${slug}`}
            className="group"
          >
            <h3 className="text-ink text-[28px] leading-[1.4] font-bold transition-colors duration-200 group-hover:text-[#FF3E00] md:text-[36px]">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Image — absolute, overflows right edge (clipped by overflow-hidden on section) */}
      {image ? (
        <Link
          href={`/${locale}/work/${slug}`}
          className="absolute top-[53px] right-0 overflow-hidden"
          style={{ width: '55%', height: 513 }}
          aria-hidden
          tabIndex={-1}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 530px, 55vw"
            className="object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </Link>
      ) : null}
    </section>
  )
}
