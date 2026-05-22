import { z } from 'zod'

export const CanvasItemSchema = z.object({
  id: z.string(),
  src: z.string(),
  /** Top-left X in board design coords (2500×1800). For pin items this is the wrapper (pin+PNG) top-left. */
  x: z.number(),
  /** Top-left Y in board design coords. For pin items this is the pin top (wrapper top). */
  y: z.number(),
  /** Wrapper width in design coords (PNG width unless wider needed). */
  w: z.number().positive(),
  /** Wrapper height in design coords (PIN_OVERHEAD + PNG height for pin items). */
  h: z.number().positive(),
  /** Anchor offset (relative to wrapper top-left) — the snap point that aligns with a pegboard hole. */
  anchor: z.object({
    x: z.number(),
    y: z.number(),
  }),
  zIndex: z.number().int().default(1),
  /** Rotation in degrees, applied around the anchor point. */
  rotation: z.number().default(0),
  /** When true, render a CSS pin at the top of the wrapper (centered on anchor.x). PNG renders below the pin. */
  pin: z.boolean().default(false),
  /** When true, this item is a paper element (sticky note, document). Visited paper items get brightness shift. */
  paper: z.boolean().default(false),
  /** When true, this is the primary sticker item for its project group — the visited sticker renders here. */
  stickerItem: z.boolean().default(false),
  /**
   * Optional clickable overlay regions (e.g. links inside a paper PNG).
   * Each entry positions an `<a>` tag at (x, y) with (w, h), relative to the PNG top-left.
   */
  links: z
    .array(
      z.object({
        href: z.string(),
        /** Locale-specific override for the href (e.g. Spanish CV URL). Falls back to `href`. */
        hrefEs: z.string().optional(),
        x: z.number(),
        y: z.number(),
        w: z.number().positive(),
        h: z.number().positive(),
        ariaLabel: z.string().optional(),
      }),
    )
    .optional(),
})
export type CanvasItem = z.infer<typeof CanvasItemSchema>

export const CanvasLayoutSchema = z.object({
  slug: z.string(),
  items: z.array(CanvasItemSchema).min(1),
})
export type CanvasLayout = z.infer<typeof CanvasLayoutSchema>
