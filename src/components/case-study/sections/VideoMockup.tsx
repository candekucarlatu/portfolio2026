'use client'

import Image from 'next/image'

interface VideoMockupProps {
  src?: string
  imageSrc?: string
  poster?: string
  background?: string
  variant?: 'phone' | 'desktop'
  frameSrc?: string
}

/**
 * Phone variant — Figma 488:116 (TacoBell)
 * Portrait video at 234×505, borderRadius 32px, border 5px #e0e0e0,
 * centered in a colored background with py-[98px]. No frame overlay.
 * Video scaled 1.35 + translateY(-12px) to crop baked-in device bezels.
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
      <section className="mx-[24px] lg:mx-[56px]">
        {/* Mobile: external border wrapper so the border doesn't eat into the video area */}
        <div className="block md:hidden" style={{ borderRadius: 12, border: '3px solid #e8e8e8' }}>
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '848/440', borderRadius: 9 }}
          >
            {src ? (
              <video
                src={src}
                poster={poster}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-bottom scale-[1.04]"
              />
            ) : imageSrc ? (
              <div className="relative w-full h-full scale-[1.04]">
                <Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover object-bottom" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Desktop: colored background + browser frame */}
        <div
          className="hidden md:flex w-full items-center justify-center py-[40px] lg:py-[54px]"
          style={{ backgroundColor: background }}
        >
          <div
            className="md:w-[90%] lg:w-full max-w-[820px] overflow-hidden"
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

  // Phone variant (default) — Figma 488:116 / 495:273
  // Mobile: 24px side margins, 16px top/bottom, phone 125×257px.
  // Desktop: 56px side margins, 98px top/bottom, phone 234×505px.
  // Two separate phone divs so each breakpoint gets its own size + transform.
  return (
    <section className="mx-[24px] lg:mx-[56px]">
      <div
        className="flex w-full items-center justify-center py-[16px] md:py-[98px]"
        style={{ backgroundColor: background }}
      >
        {src && (
          <div
            className="w-[125px] md:w-[234px]"
            style={{
              borderRadius: 'clamp(17px, 4vw, 32px)',
              border: 'clamp(3px, 0.5vw, 5px) solid #e0e0e0',
              boxShadow: '12px 12px 20px 0px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.01)' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}
