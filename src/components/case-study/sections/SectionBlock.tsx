interface SectionBlockProps {
  label: string
  title: string
  body: string
}

export function SectionBlock({ label, title, body }: SectionBlockProps) {
  return (
    <section className="mx-auto flex max-w-[640px] flex-col gap-5 px-6 md:px-0">
      <div className="inline-flex h-[25px] items-center overflow-hidden rounded-[2px] bg-white px-[10px]">
        <span className="text-ink text-[11px] font-bold tracking-[0.8px] whitespace-nowrap">
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-ink text-[24px] leading-[1.25] font-bold md:text-[32px]">{title}</h2>
        <p className="text-muted text-[16px] leading-[1.65]">{body}</p>
      </div>
    </section>
  )
}
