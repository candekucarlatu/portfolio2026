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
        className="flex pl-[56px] pr-[106px] py-[88px]"
        style={{ minHeight: 621 }}
      >
        {/* ── Left column: tag + title + CTA ──────────────────────────────── */}
        <div
          className="self-center relative z-10 flex flex-col gap-5"
          style={{ width: 450, flexShrink: 0 }}
        >
          {/* Tag */}
          <div className="inline-flex h-[25px] self-start items-center rounded-[2px] bg-white px-[10px]">
            <span className="text-ink text-[11px] font-bold tracking-[0.8px] whitespace-nowrap uppercase">
              {ctaLabel}
            </span>
          </div>

          {/* Title */}
          <Link href={href}>
            <h3 className="text-ink text-[36px] leading-[1.4] font-bold">
              {title}
            </h3>
          </Link>

          {/* CTA — Caveat script, ink by default, orange on hover */}
          {cta && (
            <Link
              href={href}
              className="font-script font-bold text-ink text-[22px] leading-[1.3] transition-colors hover:text-[#FF3E00]"
            >
              {cta}
            </Link>
          )}
        </div>

        {/* ── Right area: wide layout ──────────────────────────────────────── */}
        {image && imageLayout === 'wide' && (
          /*
           * Figma: 1440px frame, image at 666×513 fully visible.
           * -mr-[106px] extends the right area to the section edge so
           * justify-center places the tablet between the text column and
           * the actual modal edge, not the padded edge.
           * max-w-[85%] keeps it from filling the full area, matching
           * the Figma proportions (666 / 778 ≈ 86%).
           */
          <div className="flex-1 flex items-center justify-center min-w-0 -mr-[106px]">
            <Link
              href={href}
              className="block"
              style={{ maxWidth: '85%' }}
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
          <div className="flex-1 flex items-center justify-center">
            <Link
              href={href}
              aria-hidden
              tabIndex={-1}
              className="relative block"
              style={{ width: 252, height: 513 }}
            >
              {/* Inner screen content */}
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

              {/* iPhone frame overlay */}
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
          /*
           * The image already contains the iPhone frame — show it directly
           * at its natural dimensions, centered in the right half.
           * width/height from the JSON drive the display size.
           */
          <div className="flex-1 flex items-center justify-center">
            <Link href={href} aria-hidden tabIndex={-1}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 252}
                height={image.height ?? 513}
                className="pointer-events-none select-none"
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
