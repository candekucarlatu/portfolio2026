interface HeroProps {
  title: string
  subtitle: string
  meta: { duration: string; team: string; role?: string }
  metaLabels: { duration: string; team: string; role: string }
}

export function Hero({ title, subtitle, meta, metaLabels }: HeroProps) {
  return (
    <header className="mx-auto flex max-w-[680px] flex-col gap-[32px] px-6 pt-10 md:max-w-[580px] md:px-0 md:pt-20 lg:max-w-[680px]">
      <h1 className="text-ink text-[36px] leading-[1.15] font-bold tracking-[-0.01em] md:text-[48px] lg:text-[52px]">
        {title}
      </h1>
      <div className="flex flex-col gap-[20px]">
        <p className="text-muted text-[16px] leading-[1.62] md:text-[17px]">{subtitle}</p>
        <p className="text-muted text-[16px] leading-[1.62] md:text-[13px] md:leading-5">
          <span className="font-semibold">{metaLabels.duration}: </span>
          {meta.duration}
          {' · '}
          <span className="font-semibold">{metaLabels.team}: </span>
          {meta.team}
          {meta.role && (
            <>
              {' · '}
              <span className="font-semibold">{metaLabels.role}: </span>
              {meta.role}
            </>
          )}
        </p>
      </div>
    </header>
  )
}
