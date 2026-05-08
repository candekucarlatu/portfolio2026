import Image from 'next/image'

interface VideoMockupProps {
  src?: string
  imageSrc?: string
  poster?: string
  background?: string
  variant?: 'phone' | 'desktop'
}

/**
 * Phone variant — Figma 488:116 (TacoBell)
 * Portrait video at 221×480, rounded-[32px], border 5px #e0e0e0,
 * centered in a colored background with py-[92px]. No frame overlay.
 *
 * Desktop variant — Figma 406:9668 (Scribd)
 * Landscape browser-style video at max-w-[820px], rounded-[12px],
 * centered in a colored background with py-[54px].
 */
export function VideoMockup({
  src,
  imageSrc,
  poster,
  background = '#ede5fa',
  variant = 'phone',
}: VideoMockupProps) {
  if (variant === 'desktop') {
    return (
      <section className="mx-[56px]">
        <div
          className="flex w-full items-center justify-center py-[54px]"
          style={{ backgroundColor: background }}
        >
          <div
            className="w-full max-w-[820px] overflow-hidden"
            style={{
              borderRadius: 12,
              border: '5px solid #e8e8e8',
              aspectRatio: '820/477',
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
                className="h-full w-full object-cover scale-[1.01]"
              />
            ) : imageSrc ? (
              <div className="relative h-full w-full">
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 820px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-full w-full bg-white" />
            )}
          </div>
        </div>
      </section>
    )
  }

  // Phone variant (default) — Figma 488:116
  return (
    <section className="mx-[56px]">
      <div
        className="flex w-full items-center justify-center py-[92px]"
        style={{ backgroundColor: background }}
      >
        {src && (
          <div
            style={{
              width: 250,
              height: 543,
              borderRadius: 30,
              border: '5px solid #e0e0e0',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
            }}
          >
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                transform: 'scale(1.3) translateY(-12.3px)',
                transformOrigin: '50% 47%',
              }}
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
