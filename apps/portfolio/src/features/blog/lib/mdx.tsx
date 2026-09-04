// MDX 編譯設定：remark/rehype 管線 + 自訂元件對應。
//
// 語法高亮由 rehype-pretty-code 呼叫 Shiki，在 build 時就把顏色算完寫進 HTML，
// 高亮本身不帶任何 client JS。雙主題會輸出 --shiki-light / --shiki-dark 兩組 CSS
// 變數，深淺色切換由 globals.css 的 .dark 規則接手。
// 唯一的 client component 是複製按鈕（見 components/code-block.tsx）。

import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Callout } from "@/features/blog/components/callout";
import { CodeBlock } from "@/features/blog/components/code-block";

// pre 換成自己的 wrapper，才能在右上角掛複製按鈕（參考 milo.me / miniasp 的做法）。
const components = { Callout, pre: CodeBlock };

export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: { light: "github-light", dark: "github-dark" },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  return content;
}
