import Image from 'next/image'
import Link from 'next/link'
import type { ProjectImage } from '@/lib/content/schema'
import type { Locale } from '@/lib/i18n/config'

interface NextProjectProps {
  slug: string
  title: string
  image?: ProjectImage
  ctaLabel: string
  locale: Locale
}

export function NextProject({ slug, title, image, ctaLabel, locale }: NextProjectProps) {
  return (
    <section className="bg-cork/40 border-ink/8 mt-12 border-t">
      <div className="mx-auto grid w-full max-w-[960px] grid-cols-1 items-center gap-8 px-6 py-14 md:grid-cols-2 md:gap-12 md:px-8 md:py-20">
        <Link href={`/${locale}/work/${slug}`} className="group flex flex-col gap-3">
          <p className="text-muted text-[11px] font-bold tracking-[0.18em] uppercase">
            {slug.toUpperCase()}
          </p>
          <h3 className="text-ink text-[22px] leading-[1.2] font-bold md:text-[28px]">{title}</h3>
          <p className="font-script text-accent mt-2 inline-block text-[20px] font-bold transition-transform group-hover:translate-x-1">
            {ctaLabel}
          </p>
        </Link>
        {image ? (
          <Link
            href={`/${locale}/work/${slug}`}
            className="bg-cork relative aspect-[4/3] w-full overflow-hidden rounded-md"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </Link>
        ) : null}
      </div>
    </section>
  )
}
