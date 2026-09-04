import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/components/panel";
import { techStack } from "@/features/portfolio/data/tech-stack";

export function TechStack() {
  return (
    <Panel id="stack">
      <PanelHeader>
        <span className="h-px w-4 bg-primary" aria-hidden />
        <PanelTitle>Tech Stack</PanelTitle>
      </PanelHeader>
      <PanelContent className="flex flex-col gap-4">
        {techStack.map((group) => (
          <div key={group.category} className="flex flex-col gap-2">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-line px-3 py-1 font-mono text-sm text-foreground/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </PanelContent>
    </Panel>
  );
}
