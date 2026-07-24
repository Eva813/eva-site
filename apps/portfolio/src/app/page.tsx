import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 text-center font-sans text-foreground">
      <div className="flex max-w-2xl flex-col items-center gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {siteConfig.name}
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {siteConfig.description}
        </p>
        <p className="rounded-full border border-black/[.08] px-4 py-1 text-sm text-zinc-500 dark:border-white/[.145] dark:text-zinc-500">
          M1 骨架 · Next.js 16 + Vite+ · 靜態匯出到 GitHub Pages
        </p>
      </div>
    </div>
  );
}
