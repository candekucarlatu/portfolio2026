import Image from 'next/image'
import clsx from 'clsx'
import type { ProjectImage } from '@/lib/content/schema'

interface ImageBlockProps {
  image: ProjectImage
  caption?: string
  width: 'default' | 'wide' | 'full'
  variant?: 'framed' | 'plain'
}

const widthClasses: Record<ImageBlockProps['width'], string> = {
  default: 'mx-auto max-w-[680px] px-6 md:px-0',
  wide: 'mx-auto max-w-[960px] px-6 md:px-8',
  full: 'px-6 md:px-0 md:mx-[24px] lg:mx-[56px]',
}

export function ImageBlock({ image, caption, width, variant = 'framed' }: ImageBlockProps) {
  return (
    <figure
      className={clsx(
        'flex w-auto flex-col items-center gap-3',
        widthClasses[width],
      )}
    >
      <div
        className={clsx(
          'relative w-full overflow-hidden',
          variant === 'framed' && 'bg-cork rounded-lg',
        )}
      >
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
