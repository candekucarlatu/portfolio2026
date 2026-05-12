import Image from 'next/image'
import Link from 'next/link'
import type { ProjectImage } from '@/lib/content/schema'
import type { Locale } from '@/lib/i18n/config'

interface NextProjectProps {
  slug: string
  title: string
  cta?: string
  image?: ProjectImage
  imageLayout?: 'wide' | 'phone' | 'phone-framed'
  /** Separate image for mobile only. Falls back to `image` when not provided. */
  mobileImage?: ProjectImage
  /** Gap (px) between title and mobile image. Defaults to 24. */
  mobileImageGap?: number
  ctaLabel: string
  locale: Locale
}

/**
 * Three layouts (Figma 472:9465):
 *
 * wide          — landscape tablet/desktop mockup.
 *                 Left column 450px fixed + flex-1 right area with image centered.
 *                 Section py-[54px] so image has 54px above and below.
 *
 * phone         — app screenshot inside iphone-frame.png overlay, centered
 *                 in the right half.
 *
 * phone-framed  — portrait image that already includes the iPhone frame,
 *                 shown directly without any overlay, centered in right half.
 */
export function NextProject({
  slug,
  title,
  cta,
  image,
  imageLayout = 'wide',
  mobileImage,
  mobileImageGap = 24,
  ctaLabel,
  locale,
}: NextProjectProps) {
  const mobileImg = mobileImage ?? image
  const href = `/${locale}/work/${slug}`

  return (
    <section
      className="relative w-full border-t border-dashed overflow-hidden"
      style={{ backgroundColor: '#ede8dd', borderColor: '#bfb8b2' }}
    >
      {/*
       * Mobile  (Figma 496:343 / 496:357):
       *   pt-[32px] px-[24px] pb-[24px]; tag → title 16px; title → image 24px; no CTA.
       * Desktop: left column (tag + title + CTA) + right column (image), min-h 621px.
       */}
      <div className="flex flex-col pt-[32px] px-[24px] pb-[24px] md:flex-row md:p-[40px] lg:pl-[56px] lg:pr-[106px] lg:py-[54px] lg:min-h-[621px]">
        {/* ── Left column: tag + title + CTA ──────────────────────────────── */}
        <div className="relative z-10 flex flex-col self-start md:w-[450px] md:shrink-0">
          {/* Tag */}
          <div className="inline-flex h-[25px] self-start items-center rounded-[2px] bg-white px-[10px]">
            <span className="text-ink text-[11px] font-bold tracking-[0.8px] whitespace-nowrap uppercase">
              {ctaLabel}
            </span>
          </div>

          {/* Title — 16px below tag on mobile, 20px on desktop */}
          <Link href={href} className="mt-[16px] md:mt-[20px]">
            <h3 className="text-ink text-[24px] leading-[1.25] font-bold md:text-[32px] md:leading-[1.4]">
              {title}
            </h3>
          </Link>

          {/* CTA — hidden on mobile, 40px below title on desktop */}
          {cta && (
            <Link
              href={href}
              className="hidden md:block mt-[40px] font-script font-bold text-ink text-[22px] leading-[1.3] transition-colors hover:text-[#FF3E00]"
            >
              {cta}
            </Link>
          )}
        </div>

        {/* ── Mobile image — shown on mobile only, below title ─────────────── */}
        {mobileImg && (
          <Link href={href} aria-hidden tabIndex={-1} className="md:hidden block w-full" style={{ marginTop: mobileImageGap }}>
            <Image
              src={mobileImg.src}
              alt={mobileImg.alt}
              width={mobileImg.width ?? 666}
              height={mobileImg.height ?? 513}
              className="w-full h-auto"
            />
          </Link>
        )}

        {/* ── Right area: wide layout ──────────────────────────────────────── */}
        {image && imageLayout === 'wide' && (
          // Tablet: ml-[48px] + fixed 378px width — image overflows right edge (clipped by section overflow-hidden)
          // Desktop: flex-1 right column, image max-w-[666px] centered
          <div className="hidden md:flex md:ml-[48px] md:items-center md:shrink-0 lg:ml-0 lg:flex-1 lg:justify-center">
            <Link href={href} aria-hidden tabIndex={-1} className="block">
              <Image
                src={image.src}
                alt={image.alt}
                width={666}
                height={513}
                className="h-auto md:w-[378px] lg:w-full lg:max-w-[666px]"
              />
            </Link>
          </div>
        )}

        {/* ── Right area: phone layout (screenshot + frame overlay) ───────── */}
        {image && imageLayout === 'phone' && (
          <div className="hidden md:flex mt-8 justify-center md:mt-0 md:flex-1 md:items-center">
            <Link
              href={href}
              aria-hidden
              tabIndex={-1}
              className="relative block"
              style={{ width: 252, height: 513 }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 13,
                  width: 225,
                  height: 493,
                  borderRadius: 32,
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="225px"
                    className="object-cover"
                  />
                </div>
              </div>
              <Image
                src="/canvas/shared/iphone-frame.png"
                alt=""
                width={252}
                height={513}
                className="pointer-events-none relative select-none"
                aria-hidden
              />
            </Link>
          </div>
        )}

        {/* ── Right area: phone-framed (image already includes the frame) ─── */}
        {image && imageLayout === 'phone-framed' && (
          <div className="hidden md:flex mt-8 justify-center md:mt-0 md:flex-1 md:items-center">
            <Link href={href} aria-hidden tabIndex={-1} className="block">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 252}
                height={image.height ?? 513}
                className="pointer-events-none select-none max-w-full h-auto"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
