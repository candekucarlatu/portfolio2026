import { BOARD_HEIGHT, BOARD_WIDTH } from './itemPositions'

/**
 * Pegboard grid in board design coords (2500×1800).
 *
 * Layout: half-drop staggered pattern matching the original Figma pegboard tile (305×232).
 * Each tile contains 5 columns × 4 rows of slot-shaped pinholes, with odd rows offset
 * horizontally by half the column spacing so the pattern repeats seamlessly.
 *
 * Coordinates are slot centers, used both for SVG rendering and for snap-to-hole math.
 */

export const PEGBOARD = {
  TILE_W: 305,
  TILE_H: 232,
  COL_SPACING: 61,
  ROW_SPACING: 58,
  OFFSET_X: 30.5,
  OFFSET_Y: 29,
  SLOT_W: 14,
  SLOT_H: 32,
} as const

export interface Hole {
  col: number
  row: number
  x: number
  y: number
}

function holeXForRow(col: number, row: number): number {
  const isOddRow = row % 2 !== 0
  return PEGBOARD.OFFSET_X + col * PEGBOARD.COL_SPACING + (isOddRow ? PEGBOARD.COL_SPACING / 2 : 0)
}

export function getHolePosition(col: number, row: number): { x: number; y: number } {
  return {
    x: holeXForRow(col, row),
    y: PEGBOARD.OFFSET_Y + row * PEGBOARD.ROW_SPACING,
  }
}

/**
 * Returns the nearest pinhole to a given point on the board.
 * Result is clamped so the returned col/row is always within the board.
 */
export function getNearestHole(x: number, y: number): Hole {
  const rowFloat = (y - PEGBOARD.OFFSET_Y) / PEGBOARD.ROW_SPACING
  const row = Math.max(0, Math.min(rowsPerBoard() - 1, Math.round(rowFloat)))
  const isOddRow = row % 2 !== 0
  const xOrigin = PEGBOARD.OFFSET_X + (isOddRow ? PEGBOARD.COL_SPACING / 2 : 0)
  const colFloat = (x - xOrigin) / PEGBOARD.COL_SPACING
  const maxCol = colsPerBoard() - (isOddRow ? 2 : 1)
  const col = Math.max(0, Math.min(maxCol, Math.round(colFloat)))
  return {
    col,
    row,
    x: xOrigin + col * PEGBOARD.COL_SPACING,
    y: PEGBOARD.OFFSET_Y + row * PEGBOARD.ROW_SPACING,
  }
}

export function colsPerBoard(): number {
  return Math.floor((BOARD_WIDTH - PEGBOARD.OFFSET_X) / PEGBOARD.COL_SPACING) + 1
}

export function rowsPerBoard(): number {
  return Math.floor((BOARD_HEIGHT - PEGBOARD.OFFSET_Y) / PEGBOARD.ROW_SPACING) + 1
}

export function listAllHoles(): Hole[] {
  const holes: Hole[] = []
  const rows = rowsPerBoard()
  const cols = colsPerBoard()
  for (let row = 0; row < rows; row++) {
    const isOddRow = row % 2 !== 0
    const xOrigin = PEGBOARD.OFFSET_X + (isOddRow ? PEGBOARD.COL_SPACING / 2 : 0)
    const colLimit = isOddRow ? cols - 1 : cols
    for (let col = 0; col < colLimit; col++) {
      const x = xOrigin + col * PEGBOARD.COL_SPACING
      if (x > BOARD_WIDTH - PEGBOARD.COL_SPACING / 4) break
      holes.push({
        col,
        row,
        x,
        y: PEGBOARD.OFFSET_Y + row * PEGBOARD.ROW_SPACING,
      })
    }
  }
  return holes
}
