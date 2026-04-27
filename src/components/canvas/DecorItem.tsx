import Image from 'next/image'
import type { DecorItem as DecorItemType } from './itemPositions'

interface DecorItemProps {
  item: DecorItemType
  priority?: boolean
}

export function DecorItem({ item, priority }: DecorItemProps) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
      aria-hidden
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.w}
        height={item.h}
        sizes={`${item.w}px`}
        className="h-full w-full object-contain select-none"
        priority={priority}
        draggable={false}
      />
    </div>
  )
}
