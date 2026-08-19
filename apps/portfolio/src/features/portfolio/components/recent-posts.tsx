"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/components/panel";
import { getFeaturedPosts } from "@/features/blog/lib/posts";
import type { Post } from "@/features/blog/lib/posts";

const categories: Post["category"][] = ["技術", "設計", "運營", "思考"];

export function RecentPosts() {
  const [selectedCategory, setSelectedCategory] = useState<Post["category"] | null>(null);
  const featuredPosts = getFeaturedPosts(5);
  const displayedPosts = selectedCategory
    ? featuredPosts.filter((p) => p.category === selectedCategory)
    : featuredPosts;

  return (
    <Panel id="posts">
      <PanelHeader>
        <span className="h-px w-4 bg-primary" aria-hidden />
        <PanelTitle>最新文章</PanelTitle>
      </PanelHeader>

      <PanelContent className="flex flex-col gap-4">
        {/* Category Filter - 功能性 */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-700"
            }`}
          >
            全部
          </motion.button>
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05, duration: 0.3 }}
              viewport={{ once: true }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Posts List - 內容優先設計 + 交錯進入 */}
        <motion.div
          key={selectedCategory}
          className="grid gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
              },
            },
          }}
        >
          {displayedPosts.map((post) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 pl-5 transition-colors hover:border-primary/40"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover:scale-y-100"
              />
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="font-semibold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    {post.title}
                  </motion.h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <motion.span
                      className="inline-block rounded px-2 py-0.5 bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 text-xs font-medium"
                      whileHover={{ scale: 1.1 }}
                    >
                      #{post.category}
                    </motion.span>
                    {post.readTime && (
                      <span className="inline-block text-xs text-muted-foreground">
                        {post.readTime} min
                      </span>
                    )}
                    {post.difficulty && (
                      <span className="inline-block text-xs text-muted-foreground">
                        {post.difficulty}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(post.date).toLocaleDateString("zh-TW", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA to Full Blog */}
        <motion.a
          href="/blog"
          whileHover={{ x: 4 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm pt-2 transition-colors"
        >
          查看全部文章
          <ArrowRight className="size-4" />
        </motion.a>
      </PanelContent>
    </Panel>
  );
}
