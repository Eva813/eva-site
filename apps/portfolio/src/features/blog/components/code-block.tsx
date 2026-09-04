"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState } from "react";

/**
 * MDX 程式碼區塊：包一層 relative 容器，右上角放複製按鈕。
 *
 * 高亮本身仍然是 build 時算好的靜態 HTML，這裡唯一需要 client 的只有複製這個動作。
 * 複製內容直接讀 <pre> 的 textContent，不必再把原始碼多傳一份到 client。
 */
export function CodeBlock({ children, className, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // rehype-pretty-code 會把空行輸出成含一個空白的 span，直接複製會帶出行尾空白。
    const text = ref.current?.textContent
      ?.split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 剪貼簿被瀏覽器擋掉（非安全來源或使用者拒絕權限）時就當作沒發生。
    }
  }

  return (
    <div className="group relative">
      <pre ref={ref} className={className} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "已複製" : "複製程式碼"}
        className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-md border border-line bg-background text-muted-foreground opacity-0 transition-all hover:border-primary-700 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100 dark:hover:border-primary-300"
      >
        {copied ? (
          <Check className="size-3.5 text-primary" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
      </button>
    </div>
  );
}
