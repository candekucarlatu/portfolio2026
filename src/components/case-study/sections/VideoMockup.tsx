interface VideoMockupProps {
  src?: string
  poster?: string
  background?: string
  variant?: 'phone' | 'desktop'
}

/**
 * Phone variant — Figma 392:86 (TacoBell)
 * Portrait video at 280×560 with rounded-36, centered in a colored background.
 *
 * Desktop variant — Figma 360:128 (Scribd)
 * Landscape browser-style video at 820×477 with rounded-12, border, shadow,
 * centered in a 664px-tall colored background.
 */
export function VideoMockup({ src, poster, background = '#ede5fa', variant = 'phone' }: VideoMockupProps) {
  if (variant === 'desktop') {
    return (
      <section className="mx-auto w-full max-w-[1180px] overflow-hidden">
        <div
          className="relative flex h-[664px] w-full items-center justify-center"
          style={{ backgroundColor: background }}
        >
          <div
            className="overflow-hidden shadow-[12px_12px_20px_0px_rgba(0,0,0,0.1)] w-[90%] max-w-[820px]"
            style={{
              borderRadius: 12,
              border: '5px solid #e8e8e8',
              aspectRatio: '820/477',
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
            ) : (
              <div className="h-full w-full bg-white" />
            )}
          </div>
        </div>
      </section>
    )
  }

  // Phone variant (default)
  return (
    <section className="mx-auto w-full max-w-[1180px] overflow-hidden px-6 md:px-8">
      <div
        className="relative flex h-[520px] w-full items-center justify-center lg:h-[664px]"
        style={{ backgroundColor: background }}
      >
        {/* Wrapper clips the video to rounded corners — borderRadius on <video> alone doesn't work */}
        <div style={{ width: 280, height: 560, borderRadius: 36, overflow: 'hidden', flexShrink: 0 }}>
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
      </div>
    </section>
  )
}
