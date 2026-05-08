interface CalloutListProps {
  items: { title: string; body: string }[]
}

export function CalloutList({ items }: CalloutListProps) {
  return (
    <section className="mx-auto flex w-full max-w-[680px] flex-col gap-4 px-6 md:gap-8 md:px-0">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 bg-white p-6 md:gap-4 md:p-10"
          style={{}}
        >
          <h3 className="text-ink text-[18px] leading-[1.3] font-bold md:text-[24px] md:leading-[1.4]">{item.title}</h3>
          <p className="text-muted text-[15px] leading-[1.58] md:text-[16px]">{item.body}</p>
        </div>
      ))}
    </section>
  )
}
