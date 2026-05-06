interface VideoMockupProps {
  src?: string
  poster?: string
  background?: string
}

export function VideoMockup({ src, poster, background = '#ede5fa' }: VideoMockupProps) {
  return (
    <section className="w-full overflow-hidden">
      <div
        className="relative mx-auto flex h-[320px] w-full items-center justify-center md:h-[520px] lg:h-[664px]"
        style={{ backgroundColor: background }}
      >
        {/* iPhone frame */}
        <div className="relative" style={{ width: 178, height: 361 }}>
          {src ? (
            <video
              src={src}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              className="absolute rounded-[28px] object-cover"
              style={{ top: 7, left: 13, width: 152, height: 328 }}
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
