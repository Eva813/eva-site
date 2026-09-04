import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { renderMDX } from "@/features/blog/lib/mdx";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/features/blog/lib/posts";

type Params = { slug: string };

// 靜態匯出：預先列出所有文章路徑。
export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const found = getPostBySlug(slug);
  if (!found) return {};
  return { title: found.post.title, description: found.post.description };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const found = getPostBySlug(slug);
  if (!found) notFound();

  const { post } = found;
  const content = await renderMDX(found.content);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/blog"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← 回文章列表
      </Link>

      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <time dateTime={post.date} className="inline-flex items-center gap-2">
            <span className="h-px w-4 bg-primary" aria-hidden />
            {formatPostDate(post.date)}
          </time>
          <span className="font-mono text-xs text-primary-700 dark:text-primary-300">
            #{post.category}
          </span>
          {post.readTime && <span className="font-mono text-xs">{post.readTime} min</span>}
        </div>
      </header>

      <article className="prose prose-neutral max-w-none dark:prose-invert">{content}</article>
    </div>
  );
}
