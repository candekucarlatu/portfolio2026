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

export function NextProject({ slug, title, cta, image, ctaLabel, locale }: NextProjectProps) {
  return (
    <section
      className="relative w-full overflow-hidden border-t border-dashed"
      style={{ backgroundColor: '#ede8dd', borderColor: '#bfb8b2' }}
    >
      <div className="relative mx-auto flex min-h-[400px] w-full max-w-[960px] items-center gap-16 px-6 py-16 md:min-h-[480px] md:px-8 md:py-20">
        {/* Left: tag + title + cta */}
        <div className="relative z-10 flex max-w-[420px] flex-col gap-5">
          <div className="inline-flex h-[25px] items-center overflow-hidden rounded-[2px] bg-white px-2">
            <span className="text-ink text-[11px] font-bold tracking-[0.8px] whitespace-nowrap uppercase">
              {ctaLabel}
            </span>
          </div>
          <Link href={`/${locale}/work/${slug}`} className="group flex flex-col gap-3">
            <h3 className="text-ink text-[28px] leading-[1.4] font-bold md:text-[36px]">{title}</h3>
            <p
              className="font-script mt-2 inline-block text-[20px] font-bold transition-colors duration-200 group-hover:text-[#FF3E00]"
              style={{ color: '#1F1A14' }}
            >
              {cta ?? `${slug.charAt(0).toUpperCase() + slug.slice(1)} →`}
            </p>
          </Link>
        </div>

        {/* Right: image — positioned to overflow right/bottom edge */}
        {image ? (
          <Link
            href={`/${locale}/work/${slug}`}
            className="absolute right-0 top-6 h-[85%] w-[55%] overflow-hidden md:right-0 md:top-8"
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
      </div>
    </section>
  )
}
