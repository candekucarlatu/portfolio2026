'use client'

import { memo, useMemo } from 'react'
import { BOARD_HEIGHT, BOARD_WIDTH } from './itemPositions'
import { PEGBOARD, listAllHoles } from './pegboardGrid'

interface PegboardProps {
  /** When true, overlays each hole center with a small red dot for visual debugging. */
  debug?: boolean
}

function PegboardBase({ debug = false }: PegboardProps) {
  const holes = useMemo(() => listAllHoles(), [])
  const { SLOT_W, SLOT_H } = PEGBOARD
  const rx = SLOT_W / 2

  return (
    <svg
      width={BOARD_WIDTH}
      height={BOARD_HEIGHT}
      viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
      className="pointer-events-none absolute top-0 left-0 select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Replicates CSS: box-shadow: 2px 3px 2px -1px rgba(0,0,0,0.25) inset */}
        <filter id="pegboard-inner-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feMorphology in="SourceAlpha" operator="erode" radius="1" result="alphaShrunk" />
          <feOffset in="alphaShrunk" dx="2" dy="3" result="offsetAlpha" />
          <feComposite in="SourceAlpha" in2="offsetAlpha" operator="out" result="shadowMask" />
          <feGaussianBlur in="shadowMask" stdDeviation="1" result="shadowBlurred" />
          <feComposite in="shadowBlurred" in2="SourceAlpha" operator="in" result="shadowClipped" />
          <feFlood floodColor="#000000" floodOpacity="0.25" result="black" />
          <feComposite in="black" in2="shadowClipped" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="shadow" />
          </feMerge>
        </filter>
      </defs>
      <rect x={0} y={0} width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="#F8F7F2" />
      <g filter="url(#pegboard-inner-shadow)">
        {holes.map(({ col, row, x, y }) => (
          <rect
            key={`${row}-${col}`}
            x={x - SLOT_W / 2}
            y={y - SLOT_H / 2}
            width={SLOT_W}
            height={SLOT_H}
            rx={rx}
            ry={rx}
            fill="#FFFFFF"
          />
        ))}
      </g>
      {debug && (
        <g>
          {holes.map(({ col, row, x, y }) => (
            <circle key={`dbg-${row}-${col}`} cx={x} cy={y} r={2} fill="#ff0066" />
          ))}
        </g>
      )}
    </svg>
  )
}

export const Pegboard = memo(PegboardBase)
