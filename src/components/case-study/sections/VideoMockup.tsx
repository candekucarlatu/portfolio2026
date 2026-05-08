import Image from 'next/image'

interface VideoMockupProps {
  src?: string
  imageSrc?: string
  poster?: string
  background?: string
  variant?: 'phone' | 'desktop'
  /** Optional PNG frame to overlay on the phone video (e.g. an iPhone shell asset). */
  frameSrc?: string
}

/**
 * Phone variant — Figma 392:86 (TacoBell)
 * Portrait video at 222×468 with rounded-36, centered in a colored background.
 * If frameSrc is provided, an iPhone frame PNG is layered on top.
 * 120px of bottom padding is included inside the background section.
 *
 * Desktop variant — Figma 360:128 (Scribd / SlideShare)
 * Landscape browser-style image/video at up to 848px wide, rounded-12,
 * centered in a 664px-tall colored background.
 */
export function VideoMockup({
  src,
  imageSrc,
  poster,
  background = '#ede5fa',
  variant = 'phone',
  frameSrc,
}: VideoMockupProps) {
  if (variant === 'desktop') {
    return (
      <section className="mx-[56px]">
        <div
          className="w-full overflow-hidden"
          style={{
            borderRadius: 12,
            border: '5px solid #e8e8e8',
            aspectRatio: '848/477',
            boxShadow: '12px 12px 20px 0px rgba(0,0,0,0.1)',
          }}
        >
          {src ? (
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          ) : imageSrc ? (
            <div className="relative h-full w-full">
              <Image
                src={imageSrc}
                alt=""
                fill
                sizes="(min-width: 1024px) 1068px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-full w-full bg-white" />
          )}
        </div>
      </section>
    )
  }

  // Phone variant (default)
  // iphone-frame.png is natively 252×513. Screen cutout: top 10, left 13, w 225, h 493, r 32.
  // Using the frame at its native size avoids the scaling mismatch that causes the double-frame.
  // The 120px gap to next-project is handled externally by CaseStudy getTopSpacing.
  const FRAME_W = 252
  const FRAME_H = 513

  return (
    <section className="mx-[56px]">
      <div
        className="relative flex w-full items-center justify-center pt-[91px] pb-[92px]"
        style={{ backgroundColor: background }}
      >
        {/* Phone container — video fills it directly with object-cover */}
        {src && (
          <video
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: FRAME_W, height: FRAME_H, borderRadius: 46, flexShrink: 0, display: 'block' }}
            className="object-cover"
          />
        )}
      </div>
    </section>
  )
}
