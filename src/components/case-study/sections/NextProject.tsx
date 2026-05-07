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
 *         px-[106px], image 666×513 absolute right.
 *
 * phone — portrait iPhone mockup anchored to the right side.
 *         px-[160px], iPhone frame + inner screen image, ~252×513.
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
        className={`relative flex items-center ${
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

        {/* ── Right side: wide layout ──────────────────────────────────────── */}
        {image && imageLayout === 'wide' && (
          /*
           * Wide layout — landscape tablet mockup.
           * Figma: 666×513 absolute at left=683 (measured from section left edge).
           * The section has overflow-hidden so the right edge is clipped naturally.
           * The outer div handles absolute placement; the inner Link is relative
           * so Next.js Image fill has a valid containing block.
           */
          <div className="absolute inset-y-0" style={{ left: 683, width: 666 }}>
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
        )}

        {/* ── Right side: phone layout ─────────────────────────────────────── */}
        {image && imageLayout === 'phone' && (
          /*
           * Phone layout — iPhone mockup anchored to the right side.
           * right: 297 keeps it consistent distance from section right edge across
           * different modal widths (equivalent to left=891 at 1440px artboard).
           * Inner screen: 225×493, rounded-32 (clips app screenshot).
           * iPhone frame overlay on top: 252×513.
           */
          <div className="absolute" style={{ right: 297, top: 54 }}>
            <Link href={href} aria-hidden tabIndex={-1}>
              {/* Inner screen: absolute positioned within outer container */}
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
