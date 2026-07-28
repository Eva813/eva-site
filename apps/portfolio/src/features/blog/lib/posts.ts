// 部落格文章資料層。
//
// ⚠️ M3 骨架階段：這裡是「假文章」，只為撐出列表 + 文章頁的版型。
// M2 會把資料來源換成真正的 MDX（讀 content/*.mdx、gray-matter 解 frontmatter、
// next-mdx-remote 渲染），介面（Post 型別、getAllPosts、getPostBySlug）盡量保持不變。

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO，如 "2026-07-20"
  description: string;
  category: "技術" | "設計" | "運營" | "思考";
  readTime?: number; // 分鐘
  featured?: boolean;
  difficulty?: "入門" | "中級" | "進階";
  /** 佔位內文；M2 換成 compiled MDX。 */
  body: string[];
};

const posts: Post[] = [
  {
    slug: "hello-world",
    title: "從 Hexo 搬到 Next.js",
    date: "2026-07-20",
    description: "把用了好幾年的 Hexo 部落格，重建成 Next.js + Vite+ 的靜態站，順便練前端 infra。",
    category: "技術",
    readTime: 8,
    featured: true,
    difficulty: "進階",
    body: [
      "這是一篇佔位文章，用來把文章頁的版型（標題、日期、prose 內文）撐出來。",
      "M2 階段會把這個資料來源換成真正的 MDX：讀 content/ 底下的 .mdx，用 gray-matter 解 frontmatter，再用 next-mdx-remote 渲染。到時候這段內文會換成編譯後的 MDX，外層的 prose 容器不變。",
      "在那之前，先確認列表頁、文章頁、深淺色、以及 /blog/[slug] 的靜態匯出都通。",
    ],
  },
  {
    slug: "why-vite-plus",
    title: "為什麼用 Vite+ 當工具鏈",
    date: "2026-07-10",
    description:
      "Vite+（vp）在這個專案不負責 bundling，而是任務調度 + 統一 lint/format/型別 check。",
    category: "技術",
    readTime: 6,
    featured: true,
    difficulty: "中級",
    body: [
      "Next.js 的實際 bundling 由 Turbopack 做，vp 當任務調度器與統一 check。",
      "這篇同樣是骨架用的佔位內容。",
    ],
  },
  {
    slug: "design-thinking",
    title: "設計思維在工程上的應用",
    date: "2026-07-05",
    description: "工程師如何用設計思維來解決複雜問題。",
    category: "設計",
    readTime: 7,
    featured: true,
    difficulty: "中級",
    body: ["這是一篇設計相關的佔位文章。", "內容會在 M2 更新。"],
  },
  {
    slug: "growth-lessons",
    title: "個人成長與運營經驗分享",
    date: "2026-06-28",
    description: "這一年來在寫作、開源、和社群互動上的經驗教訓。",
    category: "思考",
    readTime: 10,
    featured: false,
    difficulty: "入門",
    body: ["個人思考的文章。", "內容會在 M2 更新。"],
  },
];

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPosts(limit = 5): Post[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getPostsByCategory(category: Post["category"]): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
