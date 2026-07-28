import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, getAllPosts } from "@/features/blog/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "文章列表",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Blog</h1>
        <p className="text-muted-foreground">寫程式、前端 infra、與雜記。</p>
      </header>

      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post, i) => (
          <li key={post.slug} className="group relative">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100"
            />
            <Link href={`/blog/${post.slug}`} className="flex gap-4 py-5 pl-4 first:pt-0">
              <span className="shrink-0 pt-1 font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <article className="flex flex-1 flex-col gap-1">
                <span className="text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </span>
                <time dateTime={post.date} className="text-sm text-muted-foreground">
                  {formatPostDate(post.date)}
                </time>
                <p className="text-muted-foreground">{post.description}</p>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
