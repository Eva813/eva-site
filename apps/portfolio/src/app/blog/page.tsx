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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Blog</h1>
        <p className="text-muted-foreground">寫程式、前端 infra、與雜記。</p>
      </header>

      <ul className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug} className="py-5 first:pt-0">
            <article className="flex flex-col gap-1">
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-medium tracking-tight transition-colors hover:text-primary"
              >
                {post.title}
              </Link>
              <time dateTime={post.date} className="text-sm text-muted-foreground">
                {formatPostDate(post.date)}
              </time>
              <p className="text-muted-foreground">{post.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
