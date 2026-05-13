'use client'

import Image from 'next/image'
import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import type { DecorItem as DecorItemType } from './itemPositions'

interface DecorItemProps {
  item: DecorItemType
  priority?: boolean
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

const PARALLAX_FACTOR = 0.022

export function DecorItem({ item, priority, mouseX, mouseY }: DecorItemProps) {
  const depth = item.depth ?? 0
  const px = useTransform(mouseX, (v) => v * depth * PARALLAX_FACTOR)
  const py = useTransform(mouseY, (v) => v * depth * PARALLAX_FACTOR)

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: item.x, top: item.y, width: item.w, height: item.h, x: px, y: py }}
      aria-hidden
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.w}
        height={item.h}
        sizes={`${item.w}px`}
        quality={90}
        className="h-full w-full object-contain select-none"
        priority={priority}
        draggable={false}
      />
    </motion.div>
  )
}
