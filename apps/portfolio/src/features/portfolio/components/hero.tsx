"use client";

import { Globe, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import avatar from "@/assets/avatar.jpg";
import { Panel, PanelContent } from "@/components/panel";
import { siteConfig } from "@/config/site";

const { author, links } = siteConfig;

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

export function Hero() {
  return (
    <Panel id="profile">
      <PanelContent className="flex flex-col items-center gap-6 p-6 text-center sm:p-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
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
            <p className="text-base text-muted-foreground">Technologist × Designer × Creator</p>
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
          <motion.ul
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm"
          >
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
      </PanelContent>
    </Panel>
  );
}
