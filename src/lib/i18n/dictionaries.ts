import 'server-only'
import type { Locale } from './config'

const loaders = {
  es: () => import('./dictionaries/es.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
} satisfies Record<Locale, () => Promise<unknown>>

export type Dictionary = Awaited<ReturnType<(typeof loaders)['es']>>

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return (await loaders[locale]()) as Dictionary
}
