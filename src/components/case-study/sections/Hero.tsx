interface HeroProps {
  title: string
  subtitle: string
  meta: { duration: string; team: string; role?: string }
  metaLabels: { duration: string; team: string; role: string }
}

export function Hero({ title, subtitle, meta, metaLabels }: HeroProps) {
  const items = [
    { label: metaLabels.duration, value: meta.duration },
    { label: metaLabels.team, value: meta.team },
    ...(meta.role ? [{ label: metaLabels.role, value: meta.role }] : []),
  ]
  return (
    <header className="mx-auto flex max-w-[640px] flex-col gap-6 px-6 pt-10 md:px-0 md:pt-20">
      <h1 className="text-ink text-[36px] leading-[1.12] font-bold tracking-[-0.01em] md:text-[52px]">
        {title}
      </h1>
      <p className="text-muted text-[16px] leading-[1.6]">{subtitle}</p>
      <dl className="text-muted mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[13px] leading-5">
        {items.map((item) => (
          <div key={item.label} className="flex items-baseline gap-1.5">
            <dt className="text-ink font-bold">{item.label}:</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
