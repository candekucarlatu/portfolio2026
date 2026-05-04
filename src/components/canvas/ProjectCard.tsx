'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import type { ProjectCard as ProjectCardData } from '@/lib/content/schema'
import type { ProjectItem } from './itemPositions'
import { StickyNote } from './StickyNote'

interface ProjectCardProps {
  item: ProjectItem
  card: ProjectCardData
  href: string
  ariaLabel: string
}

export function ProjectCard({ item, card, href, ariaLabel }: ProjectCardProps) {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  return (
    <motion.div
      className="absolute touch-none"
      style={{ left: item.photo.x, top: item.photo.y, width: item.photo.w, height: item.photo.h }}
      whileHover={{ scale: 1.015, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        className="focus-visible:outline-accent relative block h-full w-full focus-visible:outline-2 focus-visible:outline-offset-8"
        onPointerDown={(event) => {
          dragStartRef.current = { x: event.clientX, y: event.clientY }
        }}
        onClickCapture={(event) => {
          const start = dragStartRef.current
          if (!start) return
          const dx = event.clientX - start.x
          const dy = event.clientY - start.y
          if (Math.hypot(dx, dy) > 8) {
            event.preventDefault()
            event.stopPropagation()
          }
          dragStartRef.current = null
        }}
      >
        <Image
          src={item.src}
          alt=""
          width={item.photo.w}
          height={item.photo.h}
          sizes={`${item.photo.w}px`}
          quality={90}
          className="pointer-events-none h-full w-full object-contain select-none"
          draggable={false}
          priority
        />

        <motion.div
          className="absolute"
          style={{
            left: item.note.x - item.photo.x,
            top: item.note.y - item.photo.y,
            width: item.note.w,
            height: item.note.h,
            transform: `rotate(${item.note.rotation}deg)`,
            transformOrigin: 'top left',
          }}
        >
          <StickyNote title={card.title} subtitle={card.subtitle} color={item.note.color} />
        </motion.div>
      </Link>
    </motion.div>
  )
}
