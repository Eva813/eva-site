import { defineConfig } from "vite-plus";

// Root Vite+ config. Next.js does the actual bundling (Turbopack); `vp` acts as
// task runner + unified check (Oxlint / Oxfmt / types). Keep this minimal for M1
// and tune lint/fmt rules once `vp check` is confirmed working.
export default defineConfig({
  fmt: {
    // Build outputs, generated files, lockfiles + prose docs we don't want
    // Oxfmt to reflow (the key is `ignorePatterns`, per milo.me).
    ignorePatterns: [
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/next-env.d.ts",
      "**/pnpm-lock.yaml",
      "**/CHANGELOG.md",
      "spec.md",
      "**/content/**",
    ],
  },
  run: {
    cache: true,
  },
});
