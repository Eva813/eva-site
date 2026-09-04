// 部落格資料層：讀 content/*.mdx → gray-matter 解 frontmatter → zod 驗證。
//
// 只在 server 端執行（build 時跑完，靜態匯出後就不再碰檔案系統）。
// client component 需要文章資料時，請由上層 server component 以 props 傳入。

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const CATEGORIES = ["技術", "設計", "運營", "思考"] as const;

/** frontmatter 結構。欄位打錯會在 build 時直接失敗，不會產出壞頁面。 */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.iso.date(), // "YYYY-MM-DD"
  description: z.string().min(1),
  category: z.enum(CATEGORIES),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  readTime: z.number().int().positive().optional(),
  featured: z.boolean().default(false),
  difficulty: z.enum(["入門", "中級", "進階"]).optional(),
  draft: z.boolean().default(false),
});

export type Post = z.infer<typeof frontmatterSchema> & { slug: string };

function readPost(slug: string): { post: Post; content: string } | undefined {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return undefined;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`content/${slug}.mdx frontmatter 有問題：\n${z.prettifyError(parsed.error)}`);
  }

  return { post: { ...parsed.data, slug }, content };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => readPost(name.replace(/\.mdx$/, ""))!.post)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedPosts(limit = 5): Post[] {
  return getAllPosts()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getPostsByCategory(category: Post["category"]): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

/** 文章頁用：回 frontmatter + 未編譯的 MDX 原始碼。 */
export function getPostBySlug(slug: string): { post: Post; content: string } | undefined {
  const result = readPost(slug);
  return result?.post.draft ? undefined : result;
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
