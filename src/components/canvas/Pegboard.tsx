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
    <div
      className="pointer-events-none absolute top-0 left-0 select-none"
      aria-hidden="true"
      style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT, background: '#F8F7F2' }}
    >
      {holes.map(({ col, row, x, y }) => (
        <div
          key={`${row}-${col}`}
          style={{
            position: 'absolute',
            left: x - SLOT_W / 2,
            top: y - SLOT_H / 2,
            width: SLOT_W,
            height: SLOT_H,
            borderRadius: rx,
            background: '#FFFFFF',
            boxShadow: 'inset 2px 3px 2px -1px rgba(0,0,0,0.25)',
          }}
        />
      ))}
      {debug && holes.map(({ col, row, x, y }) => (
        <div
          key={`dbg-${row}-${col}`}
          style={{
            position: 'absolute',
            left: x - 2,
            top: y - 2,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: '#ff0066',
          }}
        />
      ))}
    </div>
  )
}

export const Pegboard = memo(PegboardBase)
