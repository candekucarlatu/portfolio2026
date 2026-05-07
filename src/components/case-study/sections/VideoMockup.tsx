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
        <div style={{ backgroundColor: background }}>
          <div className="relative flex h-[664px] w-full items-center justify-center">
            <div
              className="overflow-hidden shadow-[12px_12px_20px_0px_rgba(0,0,0,0.1)] w-[90%] max-w-[848px]"
              style={{
                borderRadius: 12,
                border: '5px solid #e8e8e8',
                aspectRatio: '848/477',
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
                    sizes="848px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-full w-full bg-white" />
              )}
            </div>
          </div>
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
        {/* Phone container at the frame's native size */}
        <div style={{ position: 'relative', width: FRAME_W, height: FRAME_H, flexShrink: 0 }}>
          {/* Video clipped to the exact screen area of iphone-frame.png */}
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
            ) : null}
          </div>

          {/* iPhone frame overlay — sits on top of the video */}
          {frameSrc && (
            <Image
              src={frameSrc}
              alt=""
              width={FRAME_W}
              height={FRAME_H}
              className="pointer-events-none select-none relative"
              aria-hidden
            />
          )}
        </div>
      </div>
    </section>
  )
}
