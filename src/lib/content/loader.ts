import 'server-only'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { Project } from './schema'
import type { Locale } from '@/lib/i18n/config'

const projectLoaders = {
  scribd: {
    es: () => import('../../../content/projects/scribd/es.json').then((m) => m.default),
    en: () => import('../../../content/projects/scribd/en.json').then((m) => m.default),
  },
  slideshare: {
    es: () => import('../../../content/projects/slideshare/es.json').then((m) => m.default),
    en: () => import('../../../content/projects/slideshare/en.json').then((m) => m.default),
  },
  kaplan: {
    es: () => import('../../../content/projects/kaplan/es.json').then((m) => m.default),
    en: () => import('../../../content/projects/kaplan/en.json').then((m) => m.default),
  },
  tacobell: {
    es: () => import('../../../content/projects/tacobell/es.json').then((m) => m.default),
    en: () => import('../../../content/projects/tacobell/en.json').then((m) => m.default),
  },
} as const

export const PROJECT_SLUGS = Object.keys(projectLoaders) as readonly (keyof typeof projectLoaders)[]
export type ProjectSlug = (typeof PROJECT_SLUGS)[number]

export function isProjectSlug(slug: string): slug is ProjectSlug {
  return slug in projectLoaders
}

export const getProject = cache(async (slug: string, locale: Locale) => {
  if (!isProjectSlug(slug)) notFound()
  const raw = await projectLoaders[slug][locale]()
  const result = Project.safeParse(raw)
  if (!result.success) {
    console.error(`[content] invalid project ${slug}/${locale}:`, result.error.format())
    notFound()
  }
  return result.data
})

export const getAllProjects = cache(async (locale: Locale) => {
  return Promise.all(PROJECT_SLUGS.map((slug) => getProject(slug, locale)))
})
