interface HeroProps {
  title: string
  subtitle: string
  meta: { duration: string; team: string; role?: string }
  metaLabels: { duration: string; team: string; role: string }
}

export function Hero({ title, subtitle, meta, metaLabels }: HeroProps) {
  return (
    <header className="ml-[56px] flex max-w-[680px] flex-col gap-[32px] pt-10 md:pt-20">
      <h1 className="text-ink text-[36px] leading-[1.15] font-bold tracking-[-0.01em] md:text-[52px]">
        {title}
      </h1>
      <div className="flex flex-col gap-[20px]">
        <p className="text-muted text-[17px] leading-[1.62]">{subtitle}</p>
        <p className="text-muted text-[13px] leading-5">
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
