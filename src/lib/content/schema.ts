import { z } from 'zod'

export const NoteColor = z.enum(['green', 'blue', 'orange', 'purple'])
export type NoteColor = z.infer<typeof NoteColor>

export const ProjectImage = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
})
export type ProjectImage = z.infer<typeof ProjectImage>

const Hero = z.object({
  type: z.literal('hero'),
  title: z.string(),
  subtitle: z.string(),
  meta: z.object({
    duration: z.string(),
    team: z.string(),
    role: z.string(),
  }),
})

const SectionLabel = z.object({
  type: z.literal('section'),
  label: z.string(),
  title: z.string(),
  body: z.string(),
})

const StatCards = z.object({
  type: z.literal('stat-cards'),
  cards: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        color: NoteColor,
      }),
    )
    .min(1)
    .max(4),
})

const Highlight = z.object({
  type: z.literal('highlight'),
  body: z.string(),
})

const ImageBlock = z.object({
  type: z.literal('image'),
  image: ProjectImage,
  caption: z.string().optional(),
  width: z.enum(['default', 'wide', 'full']).default('default'),
})

const Insight = z.object({
  type: z.literal('insight'),
  title: z.string(),
  body: z.string(),
  image: ProjectImage,
  reverse: z.boolean().default(false),
})

const NextProject = z.object({
  type: z.literal('next-project'),
  slug: z.string(),
  title: z.string(),
  image: ProjectImage.optional(),
})

export const Section = z.discriminatedUnion('type', [
  Hero,
  SectionLabel,
  StatCards,
  Highlight,
  ImageBlock,
  Insight,
  NextProject,
])
export type Section = z.infer<typeof Section>

export const ProjectCard = z.object({
  title: z.string(),
  subtitle: z.string(),
  color: NoteColor,
})
export type ProjectCard = z.infer<typeof ProjectCard>

export const Project = z.object({
  slug: z.string(),
  card: ProjectCard,
  sections: z.array(Section).min(1),
})
export type Project = z.infer<typeof Project>
