import { SiteFooterInteractiveWordmark } from "@/components/site-footer-brand";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="screen-line-top mx-auto flex w-full max-w-3xl flex-col items-center gap-1 px-4 py-6 text-center font-mono text-xs text-muted-foreground sm:px-6">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p>Built with Next.js + Vite+</p>
      </div>

      {/* 兩個決定寫在這裡，之後不要無意間改回去：
          1. 不加底緣裁切。E 的下橫槓 [32,208,160,32] 整條就在最後一行，裁一行 E 就變成 F；
             V 的收斂（[256,176]/[320,176] → [288,208]）也全在最後兩行。參考站敢裁三成，
             是因為它們有 7–8 個字母，單一字母被切仍能從整體輪廓辨認。
          2. 區塊高度改用「寬字距」控制，字寬則佔滿內容欄。字高固定 7 格，拉開字距只增加
             總格數，所以同樣容器寬度下字距越寬字越矮。旋鈕是 site-footer-brand.tsx
             的 TRACKING_CELLS，不要在這裡用 max-w 縮字（那會讓字縮回欄裡的一小塊）。 */}
      <div className="screen-line-top py-3">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <SiteFooterInteractiveWordmark className="w-full" />
        </div>
      </div>
    </footer>
  );
}
