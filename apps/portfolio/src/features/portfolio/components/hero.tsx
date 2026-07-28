"use client";

import { Globe, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import avatar from "@/assets/avatar.jpg";
import { siteConfig } from "@/config/site";
import { getFeaturedPosts } from "@/features/blog/lib/posts";
import type { Post } from "@/features/blog/lib/posts";

const { author, links } = siteConfig;
const categories: Post["category"][] = ["技術", "設計", "運營", "思考"];

function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

const contacts = [
  { href: links.github, label: "GitHub", icon: GithubIcon },
  { href: links.website, label: "Website", icon: Globe },
  { href: `mailto:${links.email}`, label: "Email", icon: Mail },
];

export function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<Post["category"] | null>(null);
  const featuredPosts = getFeaturedPosts(5);
  const displayedPosts = selectedCategory
    ? featuredPosts.filter((p) => p.category === selectedCategory)
    : featuredPosts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="flex flex-col gap-12">
      {/* Hero Section - 專業簡潔設計 + 進入動畫 */}
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Avatar - 錯開進入 */}
        <motion.div variants={itemVariants}>
          <Image
            src={avatar}
            alt={author.name}
            priority
            className="size-24 rounded-full border border-border object-cover sm:size-28"
          />
        </motion.div>

        {/* Title & Subtitle - 錯開進入 */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{author.name}</h1>
          <p className="text-base text-muted-foreground">
            Technologist × Designer × Creator
          </p>
        </motion.div>

        {/* Identity Badges - 錯開進入 */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2">
          {[
            { emoji: "🔹", label: "技術深度" },
            { emoji: "🎨", label: "設計思維" },
            { emoji: "📝", label: "內容" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-medium"
            >
              <span className="mr-1">{item.emoji}</span>
              {item.label}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Links - 簡潔 */}
        <motion.ul variants={itemVariants} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
          {contacts.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary-600"
              >
                <Icon className="size-4" />
                {label}
              </a>
            </li>
          ))}
        </motion.ul>

        {/* CTA Button */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-6 py-2.5 font-medium transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            探索文章
            <ArrowRight className="size-4" />
          </a>
        </motion.div>
      </motion.div>

      {/* Featured Posts Section - 內容為王 */}
      <motion.div
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="flex items-center justify-between"
        >
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            最新文章
          </h2>
        </motion.div>

        {/* Category Filter - 功能性 */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-accent-600 text-white dark:text-neutral-900"
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
                  ? "bg-accent-600 text-white dark:text-neutral-900"
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
                delayChildren: 0.2,
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
              className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary-200 hover:bg-primary-50 dark:hover:border-primary-300 dark:hover:bg-primary-900/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="font-semibold text-foreground group-hover:text-primary-600 transition-colors"
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
          transition={{ delay: 0.4, duration: 0.4 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm pt-2 transition-colors"
        >
          查看全部文章
          <ArrowRight className="size-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
