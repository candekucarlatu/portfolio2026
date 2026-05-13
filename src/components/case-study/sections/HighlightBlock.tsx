interface HighlightBlockProps {
  body: string
}

export function HighlightBlock({ body }: HighlightBlockProps) {
  return (
    <section className="mx-auto max-w-[680px] px-6 md:px-0">
      <div className="border-ink/10 bg-paper rounded-md border p-6 shadow-sm">
        <p className="text-ink text-[15px] leading-[1.65]">{body}</p>
      </div>
    </section>
  )
}
