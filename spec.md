# Blog / Portfolio 重建 Spec — Next.js + Vite+（v2）
1.我需要你在目前所在專案來建置
2.要用 vite plus : https://viteplus.dev/guide/
3.認同 保留 monorepo 結構以便日後擴充: 詳細結構我認為可以參考 https://github.com/Michael0520/milo.me
> 目標:把現有 Hexo blog(`eva813.github.io`）重建成 **Next.js + shadcn(chanhdai 樣式)**,用 **Vite+（`vp`）** 當工具鏈,靜態匯出後部署到 **GitHub Pages**,做到跟 Hexo 一樣「一鍵 / 自動」的部署,全程免費。順帶練前端 infra。
>
> 參考:[Michael0520/milo.me](https://github.com/Michael0520/milo.me)（chanhdai + Vite+ 範本）、[ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com)（樣式來源）。
>
> **v2 變更:** 框架定為 Next.js（要 chanhdai 樣式）；部署改為「靜態匯出 → GitHub Pages via Actions」（取代 Vercel）；圖片改以「commit 進 repo」為主、R2 降為可選；新增 repo/網址/命名一節。

---

## 1. 設計目標與範圍

| 項目 | 決定 |
|---|---|
| 主目的 | 練 frontend infra + 取代 Hexo blog |
| 框架 | **Next.js 16（App Router）+ shadcn/ui** — 複刻 chanhdai 樣式 |
| 工具鏈 | **Vite+（`vp`）** 統一管理（任務調度 / 套件 / 統一 check） |
| 部署 | **靜態匯出 → GitHub Pages**（Actions push 即部署,或一鍵 script） |
| 費用 | 全免費（等同現在的 Hexo + GitHub Pages） |
| 圖片 | 以 commit 進 repo 為主（靜態主機免費服務）；R2 可選 |
| Vite app（選配） | 想摸 Vite+ 的 bundler 核心時再加,非必要 |

**Vite+ 在這裡的角色:** Next.js 的實際 bundling 由 Turbopack 做,`vp` 當**任務調度器 + 套件管理 + 統一 check（Oxlint/Oxfmt/型別）**。若日後想讓 Vite+ 親自 bundle,再在 monorepo 裡加一個真正的 Vite app（見第 9 節「選配」）。

---

## 2. 專案結構

起手可以是**單一 app**（最簡單),保留 monorepo 結構以便日後擴充:

```
eva-site/
├── apps/
│   └── portfolio/              # Next.js 主站(blog + 作品集)
│       ├── src/
│       │   ├── app/            # App Router 路由
│       │   ├── components/     # 共用 UI（shadcn）
│       │   ├── features/
│       │   │   ├── blog/       # blog 元件
│       │   │   └── portfolio/  # 個人資料 / 專案
│       │   └── lib/
│       ├── content/            # MDX 文章(從 Hexo 搬來)
│       ├── public/
│       │   └── images/         # 圖片(commit 進 repo)
│       └── next.config.ts      # output: 'export'
├── .github/workflows/deploy.yml
├── pnpm-workspace.yaml
├── vite.config.ts
├── package.json
└── tsconfig.json
```

> 若不想要 monorepo,可直接單一 Next.js 專案 + Vite+,結構更扁。monorepo 只是為了日後好加東西（Vite app、共用 packages）。

---

## 3. 工具鏈與套件

| 類別 | 選用 |
|---|---|
| Runtime | Node.js 22 LTS（`.nvmrc` 固定） |
| 套件管理 | pnpm，日常用 `vp install` |
| 工具鏈 | **Vite+（`vp`）** |
| 框架 | Next.js 16（App Router，**static export**） |
| 樣式 | Tailwind CSS v4 + shadcn/ui + Radix |
| 內容 | MDX（`next-mdx-remote` 或 App Router MDX） |
| 型別 | TypeScript |
| 部署 | GitHub Pages（Actions） |

**Vite+ 常用命令:**
```bash
vp install                 # 裝依賴
vp run portfolio#dev       # 開發(調度 next dev)
vp run portfolio#build     # 建置(next build，靜態匯出到 out/)
vp check --fix             # Oxlint + Oxfmt + 型別，一鍵
vp test                    # Vitest（選配）
```

---

## 4. 從零起專案

### Step 0 — 驗證整合（別跳過）
先確認 `vp` 能起 Next.js 的 dev/build/check,把「哪些命令直接命中、哪些 fallback 回 `next`」記下來，當工具鏈地圖。

### Step 1 — 建立專案
```bash
npm install -g vite-plus         # 或依 https://viteplus.dev 最新安裝方式
vp --version                     # 記下版本
vp create eva-site               # 選 monorepo（或單一 app）
cd eva-site && vp install
```

### Step 2 — 放入 Next.js 主站
把 chanhdai / milo.me 的 `src` 結構搬進 `apps/portfolio`，或用 `create-next-app` 起底再接 Vite+。在 `package.json` 定義 `dev`、`build` scripts，讓 `vp run portfolio#dev` 能調度。

### Step 3 — 開啟靜態匯出
`apps/portfolio/next.config.ts`：
```ts
const nextConfig = {
  output: 'export',           // 產出純靜態到 out/
  images: { unoptimized: true }, // 靜態匯出不做線上最佳化
  // 使用者頁面(根網址)不需要 basePath；
  // 若走專案頁面 eva813.github.io/<repo>，需設 basePath: '/<repo>'
};
export default nextConfig;
```

### Step 4 — 日常
```bash
vp run portfolio#dev       # 本機預覽
vp check --fix             # lint/format/型別
vp run portfolio#build     # 產出 out/
```

> ⚠️ Vite+ 是 beta，Next.js 這種自帶 bundler 的框架接進 `vp run` 是 milo.me 已驗證的做法，但遇毛邊要有心理準備；把踩到的相容問題記下來就是 infra 筆記。

---

## 5. 樣式與結構

- **Tailwind v4 + shadcn/ui + Radix** — 直接搬 chanhdai 的元件與 design token（同為 React，可複製貼上再改）。
- **Light / Dark** — 沿用 chanhdai 的 CSS 變數策略。
- **內容層** — 文章用 **MDX** 放 `content/`，frontmatter 定 `title / date / tags / cover / description`。
- **加分項（chanhdai 有的，逐一實作當練習）** — RSS、sitemap、JSON-LD SEO、PWA。動態 OG image 在靜態匯出下改成 **build 時預先產生**。

### Hexo 內容遷移
1. 從 `eva-blog/source/_posts/` 取出 Markdown。
2. 調整 frontmatter 欄位對齊新格式。
3. 圖片路徑改指 `public/images/`（見第 7 節）。
4. **保留舊網址**：為每篇設對應路由，或用 redirect 對照表，保 SEO。

---

## 6. 部署（免費，跟 Hexo 一樣一鍵/自動）

### 6.1 前提：靜態匯出 → GitHub Pages
GitHub Pages 只服務靜態檔，所以用 `output: 'export'` 產出 `out/`。blog 是純內容、不需 server 功能，完全合適。

### 6.2 方式 A — GitHub Actions（零指令，push 即部署，建議）
`.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: voidzero-dev/setup-vp@v1
        with:
          node-version: '22'
          cache: true
      - run: vp install
      - run: vp run portfolio#build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/portfolio/out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
設定一次後：`git push` → 自動 build → 自動上線。連 deploy 指令都不用打，比 Hexo 還省。
（在 repo Settings → Pages → Source 選「GitHub Actions」。）

### 6.3 方式 B — 一個指令（對應 `hexo g -d`）
若偏好手動一鍵，用 `gh-pages` 套件：
```jsonc
// package.json
"scripts": {
  "deploy": "vp run portfolio#build && gh-pages -d apps/portfolio/out -b gh-pages -t true"
}
```
之後 `npm run deploy` 一鍵搞定。（`-t true` 會帶 `.nojekyll`，避免 GitHub 的 Jekyll 忽略 `_next` 資料夾。）

### 6.4 替代託管
- **Cloudflare Pages** — 免費、頻寬無上限、連 repo 後 push 自動部署,適合開發期預覽而不動到根網址的舊站。
- **Vercel** — 最自動,但 Hobby 有 100GB 頻寬/暫停/非商業限制。blog 不需要它的動態功能，故降為可選。

---

## 7. 圖片處理

### 7.1 主方案：commit 進 repo（跟你現在一樣）
你的 Hexo blog 本來就把圖片 commit 進 repo、由 GitHub Pages 免費服務。新站照舊：圖片放 `apps/portfolio/public/images/`，靜態主機免費送。**最單純、零外部依賴、無頻寬帳單。**

- 上傳前先壓成 WebP/AVIF（手動，或 build script 用 `sharp` 批次）以縮小 repo 與加速載入。
- `next/image` 在靜態匯出下設 `unoptimized`，或直接用 `<img>`。

### 7.2 可選：Cloudflare R2（repo 被圖撐大再考慮）
若圖片多到讓 repo 太肥，改放 R2：10GB 儲存、**零 egress（下載永久免費）**，圖片 URL 指向 R2 自訂網域。非起步必需。

---

## 8. CI（部署即 CI）

第 6.2 的 workflow 已把 build + 發佈串起來。可再加一個 check job 把關品質：
```yaml
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: voidzero-dev/setup-vp@v1
        with: { node-version: '22', cache: true }
      - run: vp install
      - run: vp check
```
進階：仿 milo.me 加 release-please 做自動版本/CHANGELOG；研究 `vp run` 的 remote caching。

---

## 9. Repo、網址與命名

### 9.1 GitHub Pages 網址規則
- **使用者頁面**：repo 名必須是 `Eva813.github.io` → 網址 `eva813.github.io`（根目錄，**無 basePath**，最乾淨；每人限一個）。你現在的 Hexo 就掛在這。
- **專案頁面**：任何其他 repo 名（如 `evaBlog`）→ 網址 `eva813.github.io/<repo>`（要設 `basePath`）。

### 9.2 你現在的架構（其實已經是「兩個 repo」）
| Repo | 角色 | 特徵 |
|---|---|---|
| `eva-blog` | **原始碼**（你寫作的地方） | `_config.yml`、`source/`、`themes/`、`hexo-theme-livemylife`、`package.json`（114 commits） |
| `Eva813.github.io` | **產生的 HTML 輸出**（被服務的地方） | 幾乎全 HTML、`2020~2026/` 日期資料夾、`atom.xml`、`search.xml`（6 commits） |

流程：在 `eva-blog` 寫 → `hexo deploy` → 把 HTML 推到 `Eva813.github.io` → 服務於 `eva813.github.io`。你早就在用「源 + 輸出」兩個 repo 的模式。

**新做法可以少一個 repo：** 改用 GitHub Actions 後，build 在 GitHub 上做、直接服務，不必把 HTML commit 到任何地方 → **「輸出 repo」消失，收成一個 repo**（原始碼 + 部署同一個），比現在還簡單。

### 9.3 開發期預覽（全 GitHub 即可，不必引入 Cloudflare）
- **選擇 1 — 純本機（最單純，建議）**：開發期只 `vp run portfolio#dev` 看 localhost，不開線上預覽；等要上線才切根網址。零 basePath、零額外服務。
- **選擇 2 — `eva-site` 專案頁面當線上預覽**：預覽於 `eva813.github.io/eva-site`，能真的測到 Pages 靜態部署流程。代價是子路徑要 `basePath`；用環境變數自動切，避免手改：
  ```ts
  // next.config.ts
  const isPreview = process.env.DEPLOY_TARGET === 'project'
  const nextConfig = {
    output: 'export',
    basePath: isPreview ? '/eva-site' : '',
    assetPrefix: isPreview ? '/eva-site/' : '',
    images: { unoptimized: true },
  }
  export default nextConfig
  ```
  預覽的 workflow 設 `DEPLOY_TARGET=project`，正式的不設。同一份碼、兩邊自動用對路徑。

### 9.4 切換上線 SOP（改名對調 checklist）
新站滿意、要佔用根網址時，照這順序做（零損失）：

- [ ] 1. **確認備份**：文章原始碼一直在 `eva-blog`。如還想保留舊站 HTML，續下一步。
- [ ] 2. **封存舊站**：把 `Eva813.github.io` **改名**成 `eva-hexo-archive`（Settings → Rename）。舊 HTML 整份保留，可當備份或隨時再開 Pages。
- [ ] 3. **讓新站佔名**：把新 repo **改名**成 `Eva813.github.io`。
- [ ] 4. **關掉 basePath**：正式部署不要帶 `DEPLOY_TARGET=project`（`basePath` 為空）。
- [ ] 5. **設 Pages 來源**：新 repo 的 Settings → Pages → Source 選 **GitHub Actions**。
- [ ] 6. **push 觸發**：確認 workflow 綠燈，開 `eva813.github.io` 驗收。
- [ ] 7. **收尾**：`eva-hexo-archive` 若不再需要對外，可在 Settings 關掉它的 Pages。

> 全程雙重保險：`eva-blog`（源）+ `eva-hexo-archive`（舊輸出）。

### 9.5 命名方向（不限前端）
三個層次分開:**網址**（`eva813.github.io` 固定，除非買網域）、**repo 名**、**站台品牌/標題**（自由）。

品牌建議走**個人品牌**（像 chanhdai 用人名,不綁角色、隨你成長）:
- 人名/代號:`Eva`、`Eva Lin`、`eva813`
- 個人空間感:`Eva's Notes` / `Eva's Garden` / `eva.log` / `Eva's Corner`（digital garden 天生不限主題）
- 或另想一個好記可品牌化的短字

repo 名用中性的 `eva-site` / `eva-web`；站台標題再套上面的品牌。

---

## 10. 分階段里程碑

| 階段 | 產出 | infra 練點 |
|---|---|---|
| M0 驗證整合 | `vp` 能起 Next.js dev/build/check | 工具鏈邊界 |
| M1 骨架 | 專案 + Vite+ + 靜態匯出通 | monorepo / 匯出設定 |
| M2 內容 | Hexo 文章搬進 MDX、路由通 | 內容層、遷移、redirect |
| M3 樣式 | 套上 chanhdai 的 Tailwind + shadcn | 設計系統、主題 |
| M4 圖片 | 圖片進 repo + 壓縮流程 | 資產管線 |
| M5 部署 | Actions push 即部署到 Pages | CI/CD、靜態託管 |
| M6 切換 | 接上根網址、封存舊站 | 網域/發佈策略 |

---

## 11. Open Questions（開工前拍板）

1. **repo 名 + 站台品牌**（見 9.3）— 例如 repo `eva-site` + 標題 `Eva's Garden`？
2. **起步要 monorepo 還是單一 app**？想早點練 Vite+ bundler 就 monorepo + 之後加 Vite app；只想快點上線就單一 app。
3. **圖片壓縮自動化（build script + sharp）還是先手動**？圖少可先手動。
4. **舊站切換時機** — 先並存預覽，還是直接佔根網址？

---

## 12. 參考連結
- Vite+：https://viteplus.dev
- 範本（chanhdai + Vite+）：https://github.com/Michael0520/milo.me
- 樣式來源：https://github.com/ncdai/chanhdai.com
- Next.js 靜態匯出：https://nextjs.org/docs/app/guides/static-exports
- GitHub Pages（Actions 部署）：https://docs.github.com/pages

---

*免費額度與平台行為為 2026 年中快照，開工前以官方文件為準。*