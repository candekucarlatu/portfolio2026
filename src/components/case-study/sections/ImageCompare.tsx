'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import type { ProjectImage } from '@/lib/content/schema'

interface ImageCompareProps {
  before: ProjectImage
  after: ProjectImage
  background?: string
  beforeLabel?: string
  afterLabel?: string
  height?: number
}

export function ImageCompare({
  before,
  after,
  background = '#ede8dd',
  beforeLabel = 'Before',
  afterLabel = 'After',
  height = 664,
}: ImageCompareProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true
      e.preventDefault()
      const onMove = (ev: MouseEvent) => {
        if (dragging.current) move(ev.clientX)
      }
      const onUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [move],
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      move(e.touches[0].clientX)
    },
    [move],
  )

  return (
    <section className="mx-[56px] overflow-hidden">
      <div
        className={`relative flex w-full items-center justify-center ${height ? 'py-[91px]' : 'h-[664px]'}`}
        style={{ backgroundColor: background }}
      >
        {/* Compare container */}
        <div
          ref={containerRef}
          className="relative w-[90%] max-w-[848px] select-none overflow-hidden"
          style={{
            ...(height ? { height } : { aspectRatio: '848/477' }),
            borderRadius: 12,
            border: '5px solid #e8e8e8',
            boxShadow: '12px 12px 20px 0px rgba(0,0,0,0.1)',
            cursor: 'ew-resize',
          }}
          onMouseDown={onMouseDown}
          onTouchMove={onTouchMove}
        >
          {/* After image — full width, shown on the right */}
          <div className="pointer-events-none absolute inset-0">
            <Image
              src={after.src}
              alt={after.alt}
              fill
              sizes="848px"
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Before image — clipped from the right to show only left portion */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={before.src}
              alt={before.alt}
              fill
              sizes="848px"
              className="object-cover"
              draggable={false}
            />
          </div>

          {/* Divider line + handle */}
          <div
            className="pointer-events-none absolute inset-y-0 flex flex-col items-center"
            style={{ left: `${position}%`, transform: 'translateX(-50%)', width: 2 }}
          >
            {/* Vertical line */}
            <div className="absolute inset-0 bg-[#1f1a14]/60" />
            {/* Handle circle */}
            <div className="absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1f1a14] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
                <path
                  d="M5 1L1 6L5 11M13 1L17 6L13 11"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Labels */}
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-[3px] bg-black/70 px-2 py-[3px] text-[11px] font-semibold uppercase tracking-wide text-white">
            {beforeLabel}
          </div>
          <div className="pointer-events-none absolute right-3 bottom-3 rounded-[3px] bg-black/70 px-2 py-[3px] text-[11px] font-semibold uppercase tracking-wide text-white">
            {afterLabel}
          </div>
        </div>
      </div>
    </section>
  )
}
