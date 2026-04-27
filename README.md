# Candela Kucar Latu — Portfolio

A pannable bulletin-board portfolio: drag the canvas to explore four case studies, each opening as a Stripe-style modal on desktop and a bottom sheet on mobile. Built with Next.js 16, Tailwind v4, and Framer Motion.

→ **For coding agents (Claude / Codex / Cursor):** start with [`AGENTS.md`](./AGENTS.md). It covers conventions, structure, and the most common task (editing project content).

## Quick start

```bash
nvm use 20
npm install
npm run dev
```

Open <http://localhost:3000>. The proxy redirects you to `/es` or `/en` based on your browser's `Accept-Language`.

## Editing content

Project copy lives in JSON files keyed by slug + locale:

```
content/projects/<slug>/{es,en}.json
```

Schema is enforced by Zod (`src/lib/content/schema.ts`). Add/edit sections, drop images into `public/canvas/projects/<slug>/`, and the dev server hot-reloads. See [`AGENTS.md`](./AGENTS.md#editing-project-content) for the full recipe.

## Stack

Next.js 16 (App Router, Turbopack, React Compiler) · TypeScript · Tailwind v4 · Framer Motion · vaul · Zod · Inter + Caveat (`next/font/google`).

## Structure

```
content/projects/   ← editable content per project per locale
public/canvas/      ← all canvas/case-study images
src/app/[lang]/     ← localized routes; @drawer slot intercepts /work/[slug]
src/components/     ← canvas/, drawer/, case-study/
src/lib/i18n/       ← dictionaries, locale config
src/lib/content/    ← Zod schema + project loader
src/proxy.ts        ← Accept-Language → /es | /en
```

## Scripts

| Script                   | What it does                                |
| ------------------------ | ------------------------------------------- |
| `npm run dev`            | Dev server (Turbopack)                      |
| `npm run build`          | Production build                            |
| `npm run start`          | Run the production build                    |
| `npm run lint`           | ESLint (Next + TS + Prettier compatibility) |
| `npx prettier --write .` | Format the repo                             |

## Deploy

Drop into Vercel. No env vars required. Static pages are pre-rendered for both locales.

## License

All rights reserved © Candela Kucar Latu. Code structure is reusable; designs and copy are not.
