import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Pin the workspace root so Turbopack doesn't pick up a stray lockfile
  // higher up the directory tree.
  turbopack: {
    root: fileURLToPath(new URL('.', import.meta.url)),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
}

export default nextConfig
