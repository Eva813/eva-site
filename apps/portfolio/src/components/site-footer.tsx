import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-1 px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p>Built with Next.js + Vite+</p>
      </div>
    </footer>
  );
}
