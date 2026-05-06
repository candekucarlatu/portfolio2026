interface CalloutListProps {
  items: { title: string; body: string }[]
}

export function CalloutList({ items }: CalloutListProps) {
  return (
    <section className="mx-auto flex w-full max-w-[640px] flex-col gap-8 px-6 md:px-0">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 bg-white p-10"
          style={{ boxShadow: '0px 0px 24px rgba(39, 39, 39, 0.1)' }}
        >
          <h3 className="text-ink text-[24px] leading-[1.4] font-bold">{item.title}</h3>
          <p className="text-muted text-[16px] leading-[1.58]">{item.body}</p>
        </div>
      ))}
    </section>
  )
}
