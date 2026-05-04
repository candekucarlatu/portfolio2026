import type { NoteColor, ProjectSlug } from '@/lib/content/loader'

export const BOARD_WIDTH = 2500
export const BOARD_HEIGHT = 1800

export type Rect = { x: number; y: number; w: number; h: number }

export type DecorItem = {
  id: string
  src: string
  alt: string
  /** Parallax depth: 0 = flat on board, higher = floats further above */
  depth?: number
} & Rect

export type ProjectItem = {
  slug: ProjectSlug
  src: string
  /** Visual position+size of the photo group (not the note) */
  photo: Rect
  /** Position+size of the sticky note overlay (rendered as HTML) */
  note: Rect & { rotation: number; color: NoteColor }
}

export const ABOUT_ME_RECT: Rect = { x: 986, y: 625, w: 580, h: 430 }

export const PROJECTS: readonly ProjectItem[] = [
  {
    slug: 'tacobell',
    src: '/canvas/groups/tacobell.png',
    photo: { x: 372, y: 74, w: 508, h: 714 },
    note: { x: 449, y: 369, w: 254, h: 198, rotation: -1.5, color: 'purple' },
  },
  {
    slug: 'kaplan',
    src: '/canvas/groups/kaplan.png',
    photo: { x: 1588, y: 186, w: 695, h: 658 },
    note: { x: 1632, y: 288, w: 282, h: 190, rotation: -1.5, color: 'blue' },
  },
  {
    slug: 'slideshare',
    src: '/canvas/groups/slideshare.png',
    photo: { x: 203, y: 840, w: 652, h: 812 },
    note: { x: 601, y: 1096, w: 254, h: 198, rotation: -1.5, color: 'orange' },
  },
  {
    slug: 'scribd',
    src: '/canvas/groups/scribd.png',
    photo: { x: 1613, y: 965, w: 688, h: 662 },
    note: { x: 2030, y: 1349, w: 271, h: 220, rotation: -7, color: 'green' },
  },
] as const

export const DECOR: readonly DecorItem[] = [
  {
    id: 'wow',
    src: '/canvas/groups/wow.png',
    alt: 'WOW sticker',
    x: 132,
    y: 74,
    w: 153,
    h: 249,
    depth: 2.5,
  },
  {
    id: 'lettering',
    src: '/canvas/groups/lettering.png',
    alt: 'Hand lettering',
    x: 1100,
    y: 148,
    w: 351,
    h: 301,
    depth: 0.6,
  },
  {
    id: 'gastly',
    src: '/canvas/groups/gastly.png',
    alt: 'Sticker',
    x: 2180,
    y: 113,
    w: 189,
    h: 257,
    depth: 2.5,
  },
  {
    id: 'collage',
    src: '/canvas/groups/collage.png',
    alt: 'Collage',
    x: 996,
    y: 1195,
    w: 311,
    h: 384,
    depth: 0.4,
  },
] as const
