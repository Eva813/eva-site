# eva-site 決策紀錄與技術棧

> 這份文件記錄專案重建過程中「拍板的關鍵決策」與「實際使用的技術」，
> 以及接下來的實作路線。決策以 grilling（逐題訪談）方式定案，每條附上理由與影響。
> 姊妹文件：[architecture.md](./architecture.md)（M1 骨架逐檔解說）。

最後更新：2026-07-24

---

## 0. 一句話目標

把現有 Hexo 部落格（`eva813.github.io`）用 **Next.js 16 + Vite+（vp）** 重建成
**monorepo → 靜態匯出 → GitHub Pages** 免費自動部署，樣式複刻 **chanhdai**，順帶練前端 infra。

---

## 1. 關鍵決策紀錄（ADR-lite）

### D1 — 實作順序：M1 收尾 → M3 樣式 → M2 內容
**決定**：先把 M1 骨架徹底收乾淨，再做 M3 樣式地基，最後灌 M2 內容。
**理由**：M3 先把 theme + 外框 + prose 排版立起來，M2 文章一進來就是漂亮的，避免「醜版 → 有內容 → 回頭重刷樣式」做兩次工。字型/暗色本來就得在 M3 一起定。
**影響**：blog 的版型骨架在 M3 先做（空殼），M2 只負責倒內容。

### D2 — 上線策略：先上「專案頁預覽」，內容齊了再改名切根網址
**決定**：保持 `DEPLOY_TARGET=project`（basePath `/eva-site`），部署到 `eva813.github.io/eva-site` 當預覽；等 M2 內容滿意後，再照 spec §9.4 改名對調 checklist 切到根網址。
**理由**：repo 現在叫 `eva-site`、[.env.production](../apps/portfolio/.env.production) 已設好；根網址目前仍被舊 Hexo 站佔用，不該現在搶。預覽能真的測到 Pages 靜態部署流程。
**影響**：現階段所有連結/資產要能吃到 basePath；切根網址時要刪掉 `.env.production` 並跑改名 SOP。

### D3 — 暗色模式：class 策略 + `next-themes`（手動切換鈕）
**決定**：改用 `.dark` class 策略搭 `next-themes` 的 ThemeProvider，提供暗黑/一般手動切換。
**理由**：使用者需求就是要能手動切換；chanhdai/shadcn 全走 class 策略，整包複刻才不打架。`next-themes` 與靜態匯出相容、體積極小。
**影響**：要移除 [globals.css](../apps/portfolio/src/app/globals.css) 現有的 `prefers-color-scheme` 寫法，改成 shadcn 的 `:root` / `.dark` CSS 變數；順帶修掉 body 被 `Arial` 蓋掉 Geist 的問題。

### D4 — shadcn 導入方式：`shadcn init` 後逐塊複刻 chanhdai
**決定**：先 `shadcn init` 建 `components.json` + design token + 暗色變數，再從 chanhdai 一塊一塊複製需要的區塊；不整包 clone。
**理由**：先立 token 地基，元件才有依據。chanhdai 有很多現在用不到的功能（作品牆、技能表、書籤），整包搬進來反而要花時間拆。
**影響**：`src/components/ui/` 逐步長出；chanhdai 區塊按需搬。

### D5 — M3 首批範圍：外框 + 首頁 + blog 版型骨架（作品集/技能表延後）
**決定**：M3 先做 header/nav/theme-toggle/footer 外框、首頁 hero/自介、`/blog` 列表與 `/blog/[slug]` prose 版型骨架（用假文章撐版）。作品集與技能表等有內容再做。
**理由**：外框全站共用必先有；首頁是門面；blog 版型屬樣式（M3），先做好 M2 就純灌內容。作品集現在做會是空殼。

### D6 — MDX 工具鏈：`next-mdx-remote` + `gray-matter`（比照 milo.me）
**決定**：用 RSC 直接讀 `content/*.mdx`、`gray-matter` 解 frontmatter、`compileMDX` 渲染，`zod` 驗證 frontmatter。排版管線比照 milo.me：`remark-gfm` + `rehype-slug` + `rehype-pretty-code`（`shiki` 語法高亮）+ `@tailwindcss/typography`（prose）。**不引入** velite/contentlayer，也**先不引入** fumadocs。
**理由**：參考 spec 指定範本 [milo.me](https://github.com/Michael0520/milo.me)，其核心正是這套（無 velite/contentlayer）；每層透明（讀檔→解析→渲染）最符合「練 infra」目的；零額外 build 步驟，與 `output:'export'` 及 `vp run` 相容。fumadocs 是文件站導向、對部落格過重。
**影響**：內容組織走 feature-module——`.mdx` 原稿放頂層 [content/](../apps/portfolio/content/)，讀取/解析放 `features/blog/lib/`，UI 放 `features/blog/components/`（與現有 scaffold 同構）。

---

## 2. 技術棧總表

### 已就位（M1）
| 項目 | 版本 | 角色 |
|---|---|---|
| Node.js | 24.18.0 | 執行環境（`.nvmrc` 固定） |
| pnpm | 11.15.1 | 套件管理 + monorepo workspace |
| Vite+（`vp`） | 0.2.5 | 任務調度 + 統一 check（Oxlint/Oxfmt/型別） |
| Next.js | 16.2.10 | React 框架（App Router + 靜態匯出） |
| React | 19.2.4 | UI |
| Tailwind CSS | v4 | 樣式引擎 |
| TypeScript | v5 | 型別 |
| GitHub Actions | — | check → build → deploy 到 Pages |

### 計畫導入（M3 / M2）
| 項目 | 里程碑 | 角色 |
|---|---|---|
| shadcn/ui + Radix | M3 | 元件與 design token（複刻 chanhdai） |
| `next-themes` | M3 | class 暗色 + 手動切換 |
| `@tailwindcss/typography` | M3 | 文章 prose 排版 |
| `next-mdx-remote` + `gray-matter` | M2 | MDX 讀取/渲染 + frontmatter |
| `zod` | M2 | frontmatter schema 驗證 |
| `remark-gfm` / `rehype-slug` / `rehype-pretty-code` + `shiki` | M2 | Markdown → HTML 管線 + 語法高亮 |

---

## 3. 實作路線

### M1 收尾（真正只有兩件）
- [x] ① 切 Node 24（`.nvmrc` 已釘 24.18.0），本機跑綠 `vp check` + `vp run eva-portfolio#build`
- [ ] ③ `git push` 觸發 Actions，確認 check→build→deploy 三段綠燈，開 `eva813.github.io/eva-site` 驗收預覽
> 註：原 ② 字型/暗色一致性不算純 M1，已併入 M3（見 D3）。
> pnpm 修復：本機 pnpm 曾是 node-18 的壞 corepack shim，已裝進 node24 bin 修好（見 memory / node24-toolchain）。

### M3 樣式（D3–D5）— ✅ 完成
- [x] `shadcn init`（Nova/Radix/neutral）+ design token / 暗色 CSS 變數（class 策略）
- [x] 裝 `next-themes`，加 ThemeProvider + 暗黑/一般切換鈕
- [x] 清理 globals.css（shadcn 一併換掉舊 prefers-color-scheme、修 body 字型）
- [x] 外框：header + nav + theme-toggle + footer
- [x] 首頁 hero / 自介區塊（用 GitHub 資料，個資集中 config）
- [x] blog 版型骨架：`/blog` 列表 + `/blog/[slug]` prose（假文章撐版、靜態匯出通）

### M2 內容（D6）
- [ ] 裝 MDX 管線（next-mdx-remote / gray-matter / zod / remark-rehype / shiki / typography）
- [ ] 定 frontmatter schema（`title / date / tags / description / cover / slug`）
- [ ] `features/blog/lib/` 寫 reader（讀 `content/`、解析、排序、標籤）
- [ ] 從 Hexo `source/_posts/` 搬 Markdown，對齊 frontmatter、改圖片路徑
- [ ] 舊網址保留 / redirect（見未決 O1）

### M4–M6（後續）
- [ ] M4 圖片：commit 進 repo + WebP/AVIF 壓縮流程
- [ ] M5 部署：已於 M1 打通，補 RSS / sitemap / robots / JSON-LD
- [ ] M6 切換：改名對調切根網址、封存舊 Hexo 站（spec §9.4）

---

## 4. 未決事項（開工前再拍板）

- **O1 — 舊網址保留策略**：Hexo 是日期路由（如 `/2020/xx/xx/title/`），新站要走 `/blog/[slug]` 還是保留舊路徑做 redirect？影響 blog 骨架的路由形狀（M3 就要定）與 SEO。
- **O2 — 首批內容範圍**：M2 先搬幾篇打通管線，還是一次全搬？
- **O3 — 圖片壓縮自動化**：build script + `sharp` 批次，還是先手動壓？（圖少可先手動）

---

## 5. 踩雷筆記（infra）

- **basePath 資產陷阱**：在 `DEPLOY_TARGET=project`（basePath `/eva-site`）下，**用字串路徑引用 `public/` 的圖片不會自動補 basePath**（例如 `next/image src="/images/x.jpg"` 會輸出成 `/images/x.jpg`，在專案頁 404）。
  - **元件內的圖片**（如首頁頭像）：改用**靜態 import**（放 `src/assets/`，`import x from "@/assets/x.jpg"`），Next 會補 basePath 並加 content hash。已套用於 [hero.tsx](../apps/portfolio/src/features/portfolio/components/hero.tsx)。
  - **M2 blog 內容圖片**：MDX 裡的 `<img src="/images/…">` / markdown 圖片同樣不會補 basePath —— 搬 Hexo 文章時要處理（rehype 插件補前綴，或改走 import）。這是 O1 之外 M2 的第二個坑。

---

*免費額度與平台行為為 2026 年中快照，開工前以官方文件為準。*
