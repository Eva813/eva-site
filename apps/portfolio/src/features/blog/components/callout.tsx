import type { ReactNode } from "react";

/** MDX 用的補充說明區塊：<Callout>…</Callout> */
export function Callout({ children }: { children: ReactNode }) {
  return (
    <aside className="not-prose my-6 rounded-md border-l-2 border-primary bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </aside>
  );
}
