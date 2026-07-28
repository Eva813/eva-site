"use client";

import type { MouseEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import {
  WORDMARK_RECTS,
  WORDMARK_VIEWBOX_HEIGHT,
  WORDMARK_VIEWBOX_WIDTH,
} from "@/components/eva-wordmark";

// 互動機制逐字取自 chanhdai.com 的 site-footer-brand.tsx（滑鼠 X 位置驅動漸層掃過文字、
// 暗色模式下方一條微光線），字型本體換成 eva-wordmark.tsx 的柵格生成矩形。
export function SiteFooterInteractiveWordmark() {
  const shouldReduceMotion = useReducedMotion();

  const gradientX1Raw = useMotionValue(0.5);
  const gradientX1 = useSpring(useTransform(gradientX1Raw, [0, 1], [0, WORDMARK_VIEWBOX_WIDTH]), {
    stiffness: 150,
    damping: 25,
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const containerRect = event.currentTarget.getBoundingClientRect();
    gradientX1Raw.set((event.clientX - containerRect.left) / containerRect.width);
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    gradientX1Raw.set(0.5);
  };

  return (
    <div className="screen-line-bottom relative after:z-1 after:bg-line">
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex w-full items-center justify-center py-6">
          <svg
            className="container size-full max-w-xs"
            viewBox={`0 0 ${WORDMARK_VIEWBOX_WIDTH} ${WORDMARK_VIEWBOX_HEIGHT}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {WORDMARK_RECTS.map(([x, y, w, h]) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={w}
                height={h}
                fill="url(#eva-wordmark-gradient)"
              />
            ))}
            <defs>
              <motion.linearGradient
                id="eva-wordmark-gradient"
                x1={gradientX1}
                y1="1"
                x2={WORDMARK_VIEWBOX_WIDTH / 2}
                y2={WORDMARK_VIEWBOX_HEIGHT}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.625" stopColor="var(--foreground)" stopOpacity="0" />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  );
}
