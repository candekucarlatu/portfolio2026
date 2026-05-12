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

          {/* CTA — hidden on mobile, 24px below title on tablet, 40px on desktop */}
          {cta && (
            <Link
              href={href}
              className="hidden md:block md:mt-[24px] lg:mt-[40px] font-script font-bold text-ink text-[22px] leading-[1.3] transition-colors hover:text-[#FF3E00]"
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
        {/* Tablet: 142×289, ml-[96px] gap from left column (Figma 537:9828)   */}
        {/* Desktop: 252×513, flex-1 centered                                  */}
        {image && imageLayout === 'phone' && (
          <div className="hidden md:flex md:ml-[96px] md:self-center md:shrink-0 lg:ml-0 lg:flex-1 lg:justify-center">
            <Link
              href={href}
              aria-hidden
              tabIndex={-1}
              className="relative block md:w-[142px] md:h-[289px] lg:w-[252px] lg:h-[513px]"
            >
              {/* Screenshot positioned as % so it scales at both 142×289 and 252×513 */}
              <div
                className="pointer-events-none absolute overflow-hidden md:rounded-[18px] lg:rounded-[32px]"
                style={{ top: '1.95%', left: '5.16%', width: '89.3%', height: '96.1%' }}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 225px, 127px"
                    className="object-cover"
                  />
                </div>
              </div>
              <Image
                src="/canvas/shared/iphone-frame.png"
                alt=""
                width={252}
                height={513}
                className="pointer-events-none relative select-none h-full w-full"
                aria-hidden
              />
            </Link>
          </div>
        )}

        {/* ── Right area: phone-framed (image already includes the frame) ─── */}
        {/* Tablet: 142px wide (scales height proportionally), ml-[96px] gap  */}
        {/* Desktop: original dimensions, flex-1 centered                      */}
        {image && imageLayout === 'phone-framed' && (
          <div className="hidden md:flex md:ml-[96px] md:self-center md:shrink-0 lg:ml-0 lg:flex-1 lg:justify-center">
            <Link href={href} aria-hidden tabIndex={-1} className="block">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 252}
                height={image.height ?? 513}
                className="pointer-events-none select-none h-auto md:w-[142px] lg:w-auto lg:max-w-full"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
