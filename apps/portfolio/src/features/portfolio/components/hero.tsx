"use client";

import { ArrowRight, Globe, Mail } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { motion } from "framer-motion";
import avatar from "@/assets/avatar.jpg";
import { Panel } from "@/components/panel";
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

// 只放不會跟其他區塊重複的資訊：技術棧有自己的 Tech Stack 區，這裡就不再列一次。
const specs: { label: string; value: ReactNode }[] = [
  { label: "ROLE", value: author.title },
  { label: "HANDLE", value: `@${author.handle}` },
  { label: "SITE", value: links.website.replace(/^https?:\/\//, "") },
];

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  return (
    <Panel id="profile">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 p-4 sm:flex-row sm:items-start sm:gap-8 sm:p-6"
      >
        <motion.div variants={item}>
          <AvatarPlate />
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <motion.div variants={item}>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{author.name}</h1>
          </motion.div>

          {/* 規格列：靠左、等寬字、hairline 分隔，跟全站的格線語彙一致 */}
          <motion.dl variants={item} className="grid grid-cols-[5.5rem_1fr] font-mono text-sm">
            {specs.map(({ label, value }) => (
              <div
                key={label}
                className="col-span-2 grid grid-cols-subgrid border-t border-line py-2"
              >
                <dt className="text-xs tracking-widest text-muted-foreground">{label}</dt>
                <dd className="min-w-0 truncate text-foreground/90">{value}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <ul className="flex items-center">
              {contacts.map(({ href, label, icon: Icon }, index) => (
                <li key={label} className="flex items-center">
                  {index > 0 && <span className="mx-3 h-4 w-px bg-line" aria-hidden />}
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="/blog"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-line px-4 py-2 text-sm font-medium sm:ms-auto sm:w-auto text-primary-700 transition-colors hover:border-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:border-primary-300 dark:hover:bg-primary-900/40"
            >
              探索文章
              <ArrowRight className="size-4" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </Panel>
  );
}

// 方形頭像 + 疊上 4×4 格線，與 wordmark 用的是同一套像素格。
// 刻意不加 radius：格線是用 repeating-linear-gradient 畫到邊的，收圓角會把四個角的
// 交叉點切掉而看起來像破圖；而且這塊本身就是 pixel grid 的品牌延伸，不屬於 UI chrome。
function AvatarPlate() {
  return (
    <div className="relative size-28 shrink-0 border border-line sm:size-32">
      <Image src={avatar} alt={author.name} priority className="size-full object-cover" />
      {/* mix-blend-overlay：亮處變亮、暗處變暗，所以格線在任何照片上都看得見 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.55) 0 1px, transparent 1px 25%), repeating-linear-gradient(to bottom, rgba(255,255,255,0.55) 0 1px, transparent 1px 25%)",
        }}
      />
    </div>
  );
}
