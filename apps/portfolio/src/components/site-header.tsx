import Link from "next/link";
import { EvaWordmark } from "@/components/eva-wordmark";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="screen-line-bottom mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 sm:px-6">
        {/* 小尺寸的 EVA mark，與 footer 的巨型字是同一個標記的兩種尺度。 */}
        <Link href="/" aria-label={siteConfig.name} className="inline-flex items-center">
          <EvaWordmark className="h-4 w-auto text-primary-800 dark:text-primary-200" />
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
