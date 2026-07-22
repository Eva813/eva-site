import { defineConfig } from 'vite-plus'

// Root Vite+ config. Next.js does the actual bundling (Turbopack); `vp` acts as
// task runner + unified check (Oxlint / Oxfmt / types). Keep this minimal for M1
// and tune lint/fmt rules once `vp check` is confirmed working.
export default defineConfig({
  fmt: {
    ignores: ['**/.next/**', '**/out/**'],
  },
  run: {
    cache: true,
  },
})
