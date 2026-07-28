import { SiteFooterInteractiveWordmark } from "@/components/site-footer-brand";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="screen-line-top mx-auto flex w-full max-w-3xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p>Built with Next.js + Vite+</p>
      </div>

      <SiteFooterInteractiveWordmark />
    </footer>
  );
}
