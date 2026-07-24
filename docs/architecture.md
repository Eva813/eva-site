# eva-site 技術與架構學習筆記

> 這份文件記錄 **eva-site** 這次 scaffold(M1 骨架)用到的每一項技術、專案結構、以及日常怎麼操作。
> 目的是讓你**邊做邊學前端 infra**。看不懂的名詞先看最後的「名詞小辭典」。

---

## 0. 一句話總覽

把原本的 **Hexo 部落格**,用 **Next.js 16 + Vite+(vp)工具鏈** 重建成一個 **monorepo**,
`next build` 產出**純靜態網站**,推到 **GitHub Pages** 免費託管、自動部署。

技術版本快照(本次實際安裝):

| 項目 | 版本 | 角色 |
|---|---|---|
| Node.js | 24.18.0 | JS 執行環境(用 nvm 管理,`.nvmrc` 固定) |
| pnpm | 11.15.1 | 套件管理 + monorepo workspace |
| Vite+(`vp`) | 0.2.5 | 統一工具鏈:任務調度 + lint/format/型別 check |
| Next.js | 16.2.10 | React 框架(App Router + 靜態匯出) |
| React | 19.2.4 | UI 函式庫 |
| Tailwind CSS | v4 | 樣式(utility-first CSS) |
| TypeScript | v5 | 型別 |

---

## 1. 專案結構逐檔解說

```
eva-site/
├── apps/
│   └── portfolio/              # ← Next.js 主站(未來的 blog + 作品集)
│       ├── src/
│       │   ├── app/            # App Router:路由 = 資料夾結構
│       │   │   ├── layout.tsx  # 全站外框(<html><body>)+ metadata
│       │   │   ├── page.tsx    # 首頁 "/"
│       │   │   └── globals.css # 全域樣式(Tailwind 進入點)
│       │   ├── components/     # (待建)共用 UI 元件(shadcn)
│       │   ├── features/       # 功能模組
│       │   │   ├── blog/       # blog 相關元件(待填)
│       │   │   └── portfolio/  # 個人資料/專案(待填)
│       │   ├── config/
│       │   │   └── site.ts     # 站台常數(標題、描述、網址)
│       │   └── lib/
│       │       └── utils.ts    # cn() — 合併 Tailwind class 的工具
│       ├── content/            # (待建)MDX 文章放這
│       ├── public/images/      # 圖片(commit 進 repo)
│       └── next.config.ts      # ★ output:'export' 靜態匯出設定
├── packages/
│   └── utils/                  # 共用套件 @eva/utils(monorepo 示範)
├── .github/workflows/deploy.yml # ★ GitHub Actions 自動部署
├── vite.config.ts              # ★ Vite+ 設定(lint/format 規則)
├── pnpm-workspace.yaml         # ★ 定義 monorepo 有哪些 package
├── tsconfig.json               # 根 TypeScript 設定
├── package.json                # 根:scripts + 工具鏈依賴
├── .nvmrc / .node-version      # 固定 Node 版本 = 24.18.0
└── docs/architecture.md        # ← 你正在看的這份
```

**為什麼是 monorepo(一個 repo 裝多個 package)?**
現在只有一個 app(`portfolio`),但保留 `apps/` + `packages/` 結構,日後要加東西(例如一個真正的 Vite app、共用元件庫)就直接放進去,不用另開 repo。`@eva/utils` 就是示範:一個能被各 app 共用的小套件。

---

## 2. 核心技術逐項(學習重點)

### 2.1 pnpm workspace(monorepo 的地基)

- `pnpm-workspace.yaml` 裡的 `packages: [apps/*, packages/*]` 告訴 pnpm:「這些資料夾各自是一個 package」。
- 好處:依賴**只裝一份**(hoist 到根 `node_modules`),package 之間可以互相 import(例如 app 用 `@eva/utils`)。
- `ignoredBuiltDependencies` / `allowBuilds`:pnpm 預設會擋掉套件的原生 build script(安全考量),需要的才手動開。我們把 `sharp` 設 `false`,因為靜態匯出用不到它。

### 2.2 Vite+(`vp`)— 這次的主角工具鏈

Vite+ 是「統一工具鏈」,把一堆工具收進一個 `vp` 指令:
- **任務調度**:`vp run <package>#<script>` 去跑各 package 的 npm script。
- **套件管理**:`vp install` 底層就是 pnpm。
- **統一 check**:`vp check` 一次跑 **Oxlint(lint)+ Oxfmt(格式)+ 型別檢查**,比分開裝 ESLint/Prettier 快。

> ⚠️ **重要分工**:Vite+ **不負責** bundle 這個 Next.js app。實際打包是 Next 內建的 **Turbopack** 做的。`vp` 在這裡只是「調度器 + 品管」。這就是為什麼 `vp run eva-portfolio#dev` 印出來其實是在跑 `next dev`。

`vp` 架構小知識:`vp` 本身是個 Rust 二進位(啟動器),真正的 `create`/`check`/`dev` 邏輯在 `vite-plus` 這個 **npm 套件**裡 —— 所以專案一定要把 `vite-plus` 裝進 devDependencies,`vp` 指令才會動。

### 2.3 Next.js 16 — App Router

- **路由即資料夾**:`src/app/` 底下的資料夾結構 = 網址路徑。`app/page.tsx` → `/`,`app/blog/page.tsx` → `/blog`。
- **`layout.tsx`**:包住底下所有頁面的共用外框(這裡放 `<html>`、`<body>`、字型、全站 `metadata`)。
- **Server Components(預設)**:App Router 的元件預設在 **build/server 端**執行,不會把 JS 送到瀏覽器,對靜態網站很理想。要互動(useState 等)才在檔案頂端加 `"use client"`。
- **metadata**:`export const metadata` 就是 SEO 的 `<title>`/`<meta>`,不用手寫 `<head>`。

### 2.4 靜態匯出(這次的部署關鍵)

`apps/portfolio/next.config.ts`:
```ts
output: "export",              // next build 產出純 HTML/CSS/JS 到 out/
images: { unoptimized: true }, // 靜態主機沒有伺服器,關掉即時圖片最佳化
basePath / assetPrefix         // 依 DEPLOY_TARGET 切換(見第 4 節)
```
- 一般 Next.js 需要 Node 伺服器;`output: 'export'` 讓它變成**純靜態**,才能丟進 GitHub Pages(只服務靜態檔)。
- 代價:用不到需要伺服器的功能(SSR、API routes 等)。對純內容型 blog 剛好夠用。

### 2.5 Tailwind CSS v4

- **Utility-first**:不寫 CSS 檔,直接在 JSX 用 class,例如 `flex items-center text-lg dark:bg-black`。
- v4 的設定變簡單了:`globals.css` 裡一行 `@import "tailwindcss";`,搭配 `postcss.config.mjs` 的 `@tailwindcss/postcss`。
- `dark:` 前綴 = 深色模式樣式。

### 2.6 `cn()` 工具(`src/lib/utils.ts`)

```ts
cn("px-4", isActive && "bg-black", className)
```
用 `clsx`(條件組合 class)+ `tailwind-merge`(解決 class 衝突,例如 `px-4 px-2` 會保留後者)。這是 **shadcn/ui** 元件的標準配件,M3 套樣式時會大量用到。

### 2.7 TypeScript 設定

- 根 `tsconfig.json` 是共用基底;`packages/utils/tsconfig.json` 用 `extends` 繼承它。
- `apps/portfolio/tsconfig.json` 由 create-next-app 產生,含 `@/*` 路徑別名(所以能寫 `import { siteConfig } from "@/config/site"`)。

---

## 3. 日常指令速查

> 前提:先 `nvm use v24.18.0`(把 Node 鎖在 24)。互動終端機因為 `.zshenv` 已 source vp,`vp` 直接可用。

```bash
vp install                      # 裝/更新所有依賴(= pnpm install)
vp run eva-portfolio#dev        # 本機開發 → http://localhost:3000
vp run eva-portfolio#build      # 建置,靜態匯出到 apps/portfolio/out/
vp check                        # lint + format + 型別,一次檢查
vp check --fix                  # 自動修好可修的(主要是格式)
```

`eva-portfolio` 是 `apps/portfolio/package.json` 裡的 `name`;`#dev` 是它的 script 名。
根 `package.json` 也包了捷徑:`pnpm dev` / `pnpm build` / `pnpm check` 會轉呼上面那些。

---

## 4. 部署流程(GitHub Pages)

### 自動部署:`.github/workflows/deploy.yml`
push 到 `main` → GitHub Actions 依序跑三個 job:
1. **check** — `vp check`(品管:lint/format/型別)
2. **build** — `vp run eva-portfolio#build`,把 `out/` 上傳成 Pages artifact
3. **deploy** — 發佈到 GitHub Pages

設定一次後,之後 `git push` 就自動上線,連指令都不用打。

### basePath 的兩種網址(重要觀念)
GitHub Pages 有兩種網址規則,`next.config.ts` 用 `DEPLOY_TARGET` 旗標自動切:
- **使用者頁面**(repo 名 = `Eva813.github.io`)→ 網址 `eva813.github.io`,在**根目錄**,不需 basePath。→ 不設 `DEPLOY_TARGET`。
- **專案頁面**(其他 repo 名,如現在的 `eva-site`)→ 網址 `eva813.github.io/eva-site`,在**子路徑**,所有資源要加 `/eva-site` 前綴。→ 設 `DEPLOY_TARGET=project`。

同一份程式碼,靠旗標兩邊都能對。**注意**:這個旗標不是靠 workflow 的 `env:` 傳(`vp run` 會吃掉,見 6.1),而是放在 `apps/portfolio/.env.production` 由 Next 自己載入。

---

## 5. Git 與 commit 規範

- 本 repo 用 **conventional commits**:`feat:`(功能)、`chore:`(雜項/設定)、`ci:`(CI)、`style:`(格式)、`docs:`(文件)、`fix:`(修 bug)。
- 好處:語意清楚,日後可接 **release-please** 自動產生版本號與 CHANGELOG(spec §8 的進階目標)。
- 本地 git 身分已設(`--local`):`Eva813 <as45986@gmail.com>`。

---

## 6. 工具鏈地圖(M0 觀察筆記)

spec 要求記錄「哪些 `vp` 指令直接命中、哪些 fallback 回 `next`」。目前觀察:

| 指令 | 實際行為 | 狀態 |
|---|---|---|
| `vp run eva-portfolio#dev` | 調度 `next dev`(Turbopack),`Ready in ~3s` | ✅ 命中 |
| `vp check` | Oxlint + Oxfmt + 型別,自己處理 | ✅ 原生 |
| `vp run eva-portfolio#build` | 調度 `next build`(靜態匯出到 `out/`) | ✅ 命中 |

**已知毛邊(踩過)**:
- `vp run` **不轉發環境變數**給子行程(見 6.1)。
- `vp run …#build` 會顯示 `not cached because it modified its input` —— 因為 `next build` 會寫回輸入樹(`next-env.d.ts`、`.next/`),vp 的 task cache 因此失效。無害,只是每次都真跑、不會 cache-hit。

> Vite+ 是 beta,接 Next.js 這種自帶 bundler 的框架偶爾有毛邊。遇到就把錯誤記進這張表,就是最好的 infra 筆記。

### 6.1 踩坑筆記:上線後「有文字、沒樣式」

**現象**:push 部署到 GitHub Pages(`eva813.github.io/eva-site`)後,頁面只有文字、完全沒有 Tailwind 樣式。

**診斷步驟**:
1. 抓線上 HTML,發現 CSS/JS 全指向**根路徑** `/_next/...`,但網站掛在 `/eva-site/` 底下 → 瀏覽器實際去要 `eva813.github.io/_next/...` → **404**。
2. 對照實驗(關鍵):

   | build 方式 | 產出的 CSS 路徑 |
   |---|---|
   | `DEPLOY_TARGET=project vp run …#build` | `/_next/...`(❌ 無前綴) |
   | `DEPLOY_TARGET=project next build`(繞過 vp) | `/eva-site/_next/...`(✅) |

**根因**:**`vp run` 不會把 step/shell 設定的環境變數轉發給它呼叫的子行程 `next build`**。所以 workflow 裡用 `env: DEPLOY_TARGET: project` 傳進去的值,傳到 `vp run` 這一層就被擋下來、沒有繼續往下傳 → `next.config.ts` 裡的 `process.env.DEPLOY_TARGET` 讀不到值 → `basePath` 變成空字串 → 所有資源路徑都掛在根路徑,而不是 `/eva-site/` 底下 → 子路徑網站的頁面全部 404。

**解法**:改用 Next.js **自己會主動讀取**的 `apps/portfolio/.env.production`(內容是 `DEPLOY_TARGET=project`)。`next build` 執行時會自己載入這個檔案,不需要經過 vp 傳遞環境變數,所以能穩定生效,不受 `vp run` 影響。
- `.gitignore` 預設會擋掉所有 `.env*` 檔案,所以要加一行例外規則 `!.env.production`,讓它能進版本控制(CI 才拿得到);這個檔案沒有機密資訊,只存了部署目標的旗標。
- 之後如果把 repo 改名成 `Eva813.github.io`(GitHub 使用者主頁專用的 repo,網址走根路徑),就把這個檔案刪掉即可,`basePath` 會自動變回空字串。

**教訓**:當中間層工具(這裡是 `vp run`)沒有把環境變數往下傳遞時,與其想辦法讓中間層正確轉發,不如改成「餵給最終工具自己會主動讀取的設定檔」,這樣就直接繞過中間層,不受它的行為影響。

---

## 7. 名詞小辭典

- **Monorepo**:一個 git repo 裝多個彼此相關的專案/套件。
- **Workspace**:pnpm 用來管理 monorepo 內多 package 的機制。
- **Bundler**:把一堆原始碼打包成瀏覽器能跑的檔案的工具(Turbopack、Vite、Rolldown 都是)。
- **App Router**:Next.js 用資料夾結構定義路由的新架構(相對於舊的 Pages Router)。
- **Server Component / Client Component**:前者在伺服器/build 端執行不送 JS;後者(`"use client"`)在瀏覽器執行、可互動。
- **Static Export**:把網站預先產生成純靜態檔,不需要伺服器。
- **Lint / Format**:lint 找程式碼問題(Oxlint);format 統一排版(Oxfmt)。
- **basePath**:網站掛在子路徑時,所有連結/資源要加的前綴。
- **shadcn/ui**:一套「複製貼上」型的 React 元件(基於 Radix + Tailwind),M3 會導入。

---

## 8. 延伸學習資源

- Vite+:https://viteplus.dev/guide/
- Next.js App Router:https://nextjs.org/docs/app
- Next.js 靜態匯出:https://nextjs.org/docs/app/guides/static-exports
- Tailwind CSS v4:https://tailwindcss.com/docs
- 參考範本(chanhdai + Vite+):https://github.com/Michael0520/milo.me
- 樣式來源:https://github.com/ncdai/chanhdai.com
- pnpm workspace:https://pnpm.io/workspaces

---

## 9. 下一步(對照 spec 里程碑)

- ~~**M1 收尾**:`vp run eva-portfolio#build` 產出 `out/`~~ ✅ 完成。
- ~~**接遠端 + 上線**:push 到 `github.com/Eva813/eva-site` → Actions 自動部署 → `eva813.github.io/eva-site` 已上線(含 6.1 的 basePath 修正)~~ ✅ 完成。
- **M2 內容**:把 Hexo `_posts/` 的 Markdown 搬進 `content/`,設 MDX 路由。
- **M3 樣式**:導入 shadcn/ui,複刻 chanhdai 的 design token 與版型。
- **M4 圖片**:圖片進 `public/images/` + 壓縮流程。
- **M5/M6 部署與切換**:正式接根網址、封存舊 Hexo 站。

（此文件為 M1 當下快照;技術版本與 Vite+ beta 行為之後可能變動,以官方文件為準。）
