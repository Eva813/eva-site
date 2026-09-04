import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Panel 維持直角，不套 radius。screen-line-top/bottom 是 200vw 的滿版 hairline，
// 會一路延伸出視窗，根本不存在可以收圓的「角」。這也是全站的分層原則：
// 版面骨架（格線、滿版線、分隔線）保持正交，只有坐落在骨架上的物件收 3–4px 圓角。
function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn("screen-line-top screen-line-bottom border-x border-line", className)}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn("screen-line-bottom flex items-center gap-2 px-4 py-3", className)}
      {...props}
    />
  );
}

function PanelTitle({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="panel-title"
      className={cn("text-sm font-medium tracking-wide text-muted-foreground uppercase", className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="panel-content" className={cn("p-4", className)} {...props} />;
}

export { Panel, PanelContent, PanelHeader, PanelTitle };
