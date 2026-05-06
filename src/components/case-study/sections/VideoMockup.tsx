interface VideoMockupProps {
  src?: string
  poster?: string
  background?: string
}

export function VideoMockup({ src, poster, background = '#ede5fa' }: VideoMockupProps) {
  return (
    <section className="w-full overflow-hidden">
      <div
        className="relative flex h-[520px] w-full items-center justify-center lg:h-[664px]"
        style={{ backgroundColor: background }}
      >
        {/* iPhone frame — 236×481px per Figma 392:98 */}
        <div className="relative" style={{ width: 236, height: 481 }}>
          {src ? (
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              className="absolute object-cover"
              style={{ top: 6, left: 7, width: 222, height: 468, borderRadius: 36 }}
            />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/canvas/projects/tacobell/iphone-frame.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full select-none"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </section>
  )
}
