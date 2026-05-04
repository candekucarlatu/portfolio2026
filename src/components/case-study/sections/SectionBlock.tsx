interface SectionBlockProps {
  label: string
  title: string
  body: string
}

export function SectionBlock({ label, title, body }: SectionBlockProps) {
  return (
    <section className="mx-auto flex max-w-[640px] flex-col gap-4 px-6 md:px-0">
      <p className="text-ink text-[11px] font-bold tracking-[0.18em] uppercase">{label}</p>
      <h2 className="text-ink text-[24px] leading-[1.18] font-bold tracking-[-0.01em] md:text-[32px]">
        {title}
      </h2>
      <p className="text-muted text-[16px] leading-[1.65]">{body}</p>
    </section>
  )
}
