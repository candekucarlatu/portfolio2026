import Image from 'next/image'
import clsx from 'clsx'
import type { ProjectImage } from '@/lib/content/schema'

interface ImageBlockProps {
  image: ProjectImage
  caption?: string
  width: 'default' | 'wide' | 'full'
}

const widths: Record<ImageBlockProps['width'], string> = {
  default: 'max-w-[640px]',
  wide: 'max-w-[960px]',
  full: 'max-w-[1200px]',
}

export function ImageBlock({ image, caption, width }: ImageBlockProps) {
  return (
    <figure
      className={clsx(
        'mx-auto flex w-full flex-col items-center gap-3 px-6 md:px-8',
        widths[width],
      )}
    >
      <div className="bg-cork relative w-full overflow-hidden rounded-lg">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width ?? 1200}
          height={image.height ?? 720}
          sizes="(min-width: 768px) 960px, 100vw"
          className="h-auto w-full object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="text-muted text-[13px] leading-5">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
