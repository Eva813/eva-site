import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/components/panel";
import { siteConfig } from "@/config/site";

export function About() {
  return (
    <Panel id="about">
      <PanelHeader>
        <span className="h-px w-4 bg-primary" aria-hidden />
        <PanelTitle>About</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <p className="leading-7 text-foreground/90">{siteConfig.author.bio}</p>
      </PanelContent>
    </Panel>
  );
}
