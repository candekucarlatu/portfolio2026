interface VideoMockupProps {
  src?: string
  poster?: string
  background?: string
}

export function VideoMockup({ src, poster, background = '#ede5fa' }: VideoMockupProps) {
  return (
    <section className="mx-auto w-full max-w-[1180px] overflow-hidden px-6 md:px-8">
      <div
        className="relative flex h-[520px] w-full items-center justify-center lg:h-[664px]"
        style={{ backgroundColor: background }}
      >
        {src ? (
          <video
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover"
            style={{ width: 280, height: 560, borderRadius: 36 }}
          />
        ) : null}
      </div>
    </section>
  )
}
