import { siteConfig } from "@/config/site";

export function About() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">About</h2>
      <p className="leading-7 text-foreground/90">{siteConfig.author.bio}</p>
    </section>
  );
}
