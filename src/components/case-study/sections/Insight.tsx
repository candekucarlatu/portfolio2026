import Image from 'next/image'
import clsx from 'clsx'
import type { ProjectImage } from '@/lib/content/schema'

interface InsightProps {
  title: string
  body: string
  image: ProjectImage
  reverse?: boolean
}

export function Insight({ title, body, image, reverse }: InsightProps) {
  return (
    <section
      className={clsx(
        'mx-0 grid grid-cols-1 items-center gap-6 px-6 md:mx-[56px] md:grid-cols-2 md:gap-10 md:px-0',
        reverse && 'md:[&>*:first-child]:order-2',
      )}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-ink text-[22px] leading-[1.25] font-bold tracking-[-0.005em] md:text-[28px]">
          {title}
        </h3>
        <p className="text-muted text-[16px] leading-[1.6] md:text-[17px]">{body}</p>
      </div>
      <div className="bg-cork relative aspect-[3/2] w-full overflow-hidden rounded-md">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 768px) 480px, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}
