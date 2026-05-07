import Image from 'next/image'
import Link from 'next/link'
import type { ProjectImage } from '@/lib/content/schema'
import type { Locale } from '@/lib/i18n/config'

interface NextProjectProps {
  slug: string
  title: string
  cta?: string
  image?: ProjectImage
  imageLayout?: 'wide' | 'phone'
  ctaLabel: string
  locale: Locale
}

/**
 * Two layouts (Figma 472:9465):
 *
 * wide  — landscape tablet/desktop mockup that overflows right.
 *         Flex row: left column 450px fixed + flex-1 right area.
 *         Image (666×513) is absolutely positioned 127px from the
 *         right area's left edge (= 683px from the inner div's left
 *         edge), vertically centered, and overflows into the section's
 *         overflow-hidden clip zone.
 *
 * phone — portrait iPhone mockup centered in the right half.
 *         Flex row: left column 450px + flex-1 right area with
 *         flex centering so the phone sits in the middle of the
 *         available space regardless of modal width.
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

  return (
    <section
      className="relative w-full border-t border-dashed overflow-hidden"
      style={{ backgroundColor: '#ede8dd', borderColor: '#bfb8b2' }}
    >
      <div
        className={`flex items-center ${
          imageLayout === 'phone' ? 'px-[160px]' : 'px-[106px]'
        } py-[88px]`}
        style={{ minHeight: 621 }}
      >
        {/* ── Left column: tag + title + CTA ──────────────────────────────── */}
        <div
          className="relative z-10 flex flex-col gap-5"
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
              className="font-script text-ink text-[22px] leading-[1.3] transition-colors hover:text-[#FF3E00]"
            >
              {cta}
            </Link>
          )}
        </div>

        {/* ── Right area: wide layout ──────────────────────────────────────── */}
        {image && imageLayout === 'wide' && (
          /*
           * flex-1 takes all space after the left column.
           * self-stretch gives it the full height of the flex row so
           * top: 50% / translateY(-50%) can vertically center the image.
           *
           * Image is absolutely positioned at left: 127 within the right
           * area, which equals left: 683 from the padded inner div — same
           * as the Figma reference. It overflows to the right and is
           * clipped by the section's overflow-hidden.
           */
          <div className="relative flex-1 self-stretch">
            <div
              className="absolute"
              style={{
                left: 127,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 666,
                height: 513,
              }}
            >
              <Link
                href={href}
                className="relative block w-full h-full"
                aria-hidden
                tabIndex={-1}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="666px"
                  className="object-cover"
                />
              </Link>
            </div>
          </div>
        )}

        {/* ── Right area: phone layout ─────────────────────────────────────── */}
        {image && imageLayout === 'phone' && (
          /*
           * flex-1 + flex centering keeps the phone in the middle of the
           * space to the right of the left column at any modal width.
           * self-stretch ensures the area is as tall as the left column
           * so justify-center works correctly.
           */
          <div className="flex-1 flex items-center justify-center self-stretch">
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
                {/* Relative wrapper required by Next.js Image fill */}
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
      </div>
    </section>
  )
}
