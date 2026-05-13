import 'server-only'
import type { Locale } from './config'

const esLoader = () => import('./dictionaries/es.json').then((m) => m.default)

export type Dictionary = Awaited<ReturnType<typeof esLoader>>

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  es: esLoader,
  en: () => import('./dictionaries/en.json').then((m) => m.default as Dictionary),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return loaders[locale]()
}
