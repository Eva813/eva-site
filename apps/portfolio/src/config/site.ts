export const siteConfig = {
  name: "Eva's Garden",
  title: "Eva's Garden",
  description: "Eva 的個人網站與部落格 — 用 Next.js + Vite+ 重建。",
  url: "https://eva813.github.io",

  // 個人資料（取自 GitHub @Eva813，可自由編輯）
  author: {
    name: "Eva",
    handle: "Eva813",
    title: "Front-End Developer",
    // 頭像用靜態 import（src/assets/avatar.jpg）才吃得到 basePath，見 hero.tsx
    // TODO(Eva): 換成你想放的自我介紹
    bio: "前端工程師，專注於用 React / Next.js / TypeScript 打造清晰、好維護的介面。喜歡把重複的事自動化，順手練前端 infra。",
  },

  links: {
    github: "https://github.com/Eva813",
    website: "https://eva813.github.io",
    email: "as45986@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
