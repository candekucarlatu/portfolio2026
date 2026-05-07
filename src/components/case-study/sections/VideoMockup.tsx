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
  // Figma 392:93: background 1180×664 with mx-[56px], video at 222×468 inside iPhone frame 236×481
  // Top/bottom padding matches Figma (91px top, 92px bottom = 664px total background height)
  // The 120px gap to next-project is handled externally by CaseStudy getTopSpacing
  const FRAME_W = 236
  const FRAME_H = 481
  const VIDEO_W = 222
  const VIDEO_H = 468
  const VIDEO_OFFSET_X = (FRAME_W - VIDEO_W) / 2
  const VIDEO_OFFSET_Y = (FRAME_H - VIDEO_H) / 2

  return (
    <section className="mx-[56px]">
      <div
        className="relative flex w-full items-center justify-center pt-[91px] pb-[92px]"
        style={{ backgroundColor: background }}
      >
        {/* Phone container: sized to the frame dimensions */}
        <div style={{ position: 'relative', width: FRAME_W, height: FRAME_H, flexShrink: 0 }}>
          {/* Video/content — clipped inside screen area */}
          <div
            style={{
              position: 'absolute',
              top: VIDEO_OFFSET_Y,
              left: VIDEO_OFFSET_X,
              width: VIDEO_W,
              height: VIDEO_H,
              borderRadius: 36,
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

          {/* iPhone frame — sits on top of the video */}
          {frameSrc && (
            <Image
              src={frameSrc}
              alt=""
              fill
              sizes={`${FRAME_W}px`}
              className="pointer-events-none select-none object-contain"
              aria-hidden
            />
          )}
        </div>
      </div>
    </section>
  )
}
