import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/features/blog/lib/posts";

type Params = { slug: string };

// 靜態匯出：預先列出所有文章路徑。
export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

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
        <time
          dateTime={post.date}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="h-px w-4 bg-primary" aria-hidden />
          {formatPostDate(post.date)}
        </time>
      </header>

      {/* prose 容器：M2 會把 body 換成 compiled MDX，這層外框不變。 */}
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </article>
    </div>
  );
}
