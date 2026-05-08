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
  ctaLabel: string
  locale: Locale
}

/**
 * Three layouts (Figma 472:9465):
 *
 * wide          — landscape tablet/desktop mockup that overflows right.
 *                 Flex row: left column 450px + flex-1 right area.
 *                 Image (666×513) absolutely positioned, overflows right edge.
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
  ctaLabel,
  locale,
}: NextProjectProps) {
  const href = `/${locale}/work/${slug}`

  // phone-framed uses same padding as phone; wide uses its own
  const isPhoneVariant = imageLayout === 'phone' || imageLayout === 'phone-framed'

  return (
    <section
      className="relative w-full border-t border-dashed overflow-hidden"
      style={{ backgroundColor: '#ede8dd', borderColor: '#bfb8b2' }}
    >
      {/*
       * Centering: outer row uses default align-items (stretch) so the right
       * area fills the full row height. The left column uses self-center so
       * its text stays vertically centered within the row.
       */}
      <div
        className="flex flex-col px-6 py-[48px] md:flex-row md:pl-[56px] md:pr-[106px] md:py-[88px]"
        style={{ minHeight: undefined }}
      >
        {/* ── Left column: tag + title + CTA ──────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col self-start md:self-center"
          style={{ width: undefined, flexShrink: 0 }}
        >
          {/* Tag */}
          <div className="inline-flex h-[25px] self-start items-center rounded-[2px] bg-white px-[10px]">
            <span className="text-ink text-[11px] font-bold tracking-[0.8px] whitespace-nowrap uppercase">
              {ctaLabel}
            </span>
          </div>

          {/* Title — 20px below tag */}
          <Link href={href} className="mt-[20px]">
            <h3 className="text-ink text-[32px] leading-[1.4] font-bold">
              {title}
            </h3>
          </Link>

          {/* CTA — 40px below title */}
          {cta && (
            <Link
              href={href}
              className="mt-[40px] font-script font-bold text-ink text-[22px] leading-[1.3] transition-colors hover:text-[#FF3E00]"
            >
              {cta}
            </Link>
          )}
        </div>

        {/* ── Right area: wide layout ──────────────────────────────────────── */}
        {image && imageLayout === 'wide' && (
          <div className="mt-8 flex justify-center md:mt-0 md:flex-1 md:items-center md:-mr-[106px] md:min-w-0">
            <Link
              href={href}
              className="block w-full md:max-w-[85%]"
              aria-hidden
              tabIndex={-1}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={666}
                height={513}
                className="w-full h-auto"
              />
            </Link>
          </div>
        )}

        {/* ── Right area: phone layout (screenshot + frame overlay) ───────── */}
        {image && imageLayout === 'phone' && (
          <div className="mt-8 flex justify-center md:mt-0 md:flex-1 md:items-center">
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
          <div className="mt-8 flex justify-center md:mt-0 md:flex-1 md:items-center">
            <Link href={href} aria-hidden tabIndex={-1}>
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
