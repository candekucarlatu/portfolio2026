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
  height,
}: ImageCompareProps) {
  const [position, setPosition] = useState(50)
  const mobileRef = useRef<HTMLDivElement>(null)
  const tabletRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const move = useCallback((clientX: number) => {
    // Use whichever container is currently visible
    const w = typeof window !== 'undefined' ? window.innerWidth : 0
    const el = w < 768 ? mobileRef.current : w < 1024 ? tabletRef.current : desktopRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true
      e.preventDefault()
      const onMove = (ev: MouseEvent) => { if (dragging.current) move(ev.clientX) }
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
    (e: React.TouchEvent) => { move(e.touches[0].clientX) },
    [move],
  )

  const sliderContent = (label: 'mobile' | 'desktop') => (
    <>
      {/* After image — shown on the right */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src={after.src} alt={after.alt} fill
          sizes={label === 'mobile' ? '100vw' : '848px'}
          className="object-cover" draggable={false}
        />
      </div>
      {/* Before image — clipped to show left portion */}
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image
          src={before.src} alt={before.alt} fill
          sizes={label === 'mobile' ? '100vw' : '848px'}
          className="object-cover" draggable={false}
        />
      </div>
      {/* Divider line + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 flex flex-col items-center"
        style={{ left: `${position}%`, transform: 'translateX(-50%)', width: 2 }}
      >
        <div className="absolute inset-0 bg-[#1f1a14]/60" />
        <div className="absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#1f1a14] shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
            <path d="M5 1L1 6L5 11M13 1L17 6L13 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    </>
  )

  return (
    <section className="mx-[24px] overflow-hidden lg:mx-[56px]">
      {/* Mobile: no background, full-width slider */}
      <div
        ref={mobileRef}
        className="relative w-full select-none overflow-hidden md:hidden"
        style={{ aspectRatio: '848/477', borderRadius: 12, cursor: 'ew-resize' }}
        onMouseDown={onMouseDown}
        onTouchMove={onTouchMove}
      >
        {sliderContent('mobile')}
      </div>

      {/* Tablet + Desktop: colored background with slider */}
      <div
        className={`hidden md:flex relative w-full items-center justify-center py-[40px] ${height != null ? 'lg:py-[91px]' : 'lg:py-0 lg:h-[664px]'}`}
        style={{ backgroundColor: background }}
      >
        {/* Tablet slider (md to lg): always aspect-ratio, fixes fixed-height layouts */}
        <div
          ref={tabletRef}
          className="relative w-[90%] max-w-[848px] select-none overflow-hidden lg:hidden"
          style={{
            aspectRatio: '848/477',
            borderRadius: 12,
            border: '5px solid #e8e8e8',
            boxShadow: '12px 12px 20px 0px rgba(0,0,0,0.1)',
            cursor: 'ew-resize',
          }}
          onMouseDown={onMouseDown}
          onTouchMove={onTouchMove}
        >
          {sliderContent('desktop')}
        </div>

        {/* Desktop slider (lg+): uses height prop when provided */}
        <div
          ref={desktopRef}
          className="relative w-[90%] max-w-[848px] select-none overflow-hidden hidden lg:block"
          style={{
            ...(height != null ? { height } : { aspectRatio: '848/477' }),
            borderRadius: 12,
            border: '5px solid #e8e8e8',
            boxShadow: '12px 12px 20px 0px rgba(0,0,0,0.1)',
            cursor: 'ew-resize',
          }}
          onMouseDown={onMouseDown}
          onTouchMove={onTouchMove}
        >
          {sliderContent('desktop')}
        </div>
      </div>
    </section>
  )
}
