"use client";

import type { PointerEvent } from "react";
import { useId, useMemo, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { WORDMARK_CELL_SIZE, WORDMARK_RECTS } from "@/components/eva-wordmark";
import { cn } from "@/lib/utils";

/**
 * 三層結構：
 *   1. 字身 —— 合併矩形實心填墨藍。負責量體，讓 EVA 任何情況下都可讀。
 *   2. 網格 —— 拆回 32×32 單元格畫 hairline。是紋理，不是主體。
 *   3. 掛光 —— 斜向光帶，中心跟著游標走，把掃過的區域提到 --foreground 全對比。
 */
const BASE_FILL_OPACITY = 0.28;
const GRID_STROKE_OPACITY = 0.55;
const PEAK_OPACITY = 0.95;

// 字距（單位：格）。字高固定 7 格，拉開字距只增加總格數，
// 所以「字距越寬 → 同樣容器寬度下字越矮」。這是控制 footer 區塊高度的主要旋鈕：
//   字距 1 格 = 17 格寬（原始緊排）→ 720px 容器下字高 296px
//   字距 10 格 = 35 格寬          → 720px 容器下字高 144px
const TRACKING_CELLS = 10;

// 依字距重新排列三個字母（E 不動，V 與 A 依序右移）。
const TRACKED_RECTS = WORDMARK_RECTS.map(([x, y, w, h]): [number, number, number, number] => {
  const letterIndex = x < 224 ? 0 : x < 416 ? 1 : 2;
  const shift = letterIndex * (TRACKING_CELLS - 1) * WORDMARK_CELL_SIZE;
  return [x + shift, y, w, h];
});

// viewBox 裁到字身的實際範圍（原始資料四周留了空白：左右各 32、上下各 16），
// E 的左緣與 A 的右緣才會正好壓在內容欄的邊界上。
const GLYPH = TRACKED_RECTS.reduce(
  (box, [x, y, w, h]) => ({
    minX: Math.min(box.minX, x),
    minY: Math.min(box.minY, y),
    maxX: Math.max(box.maxX, x + w),
    maxY: Math.max(box.maxY, y + h),
  }),
  { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
);
const GLYPH_WIDTH = GLYPH.maxX - GLYPH.minX;
const GLYPH_HEIGHT = GLYPH.maxY - GLYPH.minY;

// 光帶半寬。約等於整個字寬，所以任何時候都有一段在字上。
const HALF_BAND = GLYPH_WIDTH * 0.5;

export function SiteFooterInteractiveWordmark({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const gradientId = useId();

  // 把合併過的矩形拆回 32×32 單元格，只給網格層用。
  const cells = useMemo(() => {
    const result: [x: number, y: number][] = [];
    for (const [x, y, w, h] of TRACKED_RECTS) {
      for (let cx = x; cx < x + w; cx += WORDMARK_CELL_SIZE) {
        for (let cy = y; cy < y + h; cy += WORDMARK_CELL_SIZE) {
          result.push([cx, cy]);
        }
      }
    }
    return result;
  }, []);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // footer 在頁尾，多數時間不在視窗內；不在畫面上就不要每幀重算。
  const isInView = useInView(containerRef, { amount: 0.2 });
  const isPointerInside = useRef(false);

  const lightRatio = useMotionValue(0.5);
  const light = useSpring(useTransform(lightRatio, [0, 1], [GLYPH.minX, GLYPH.maxX]), {
    stiffness: 130,
    damping: 26,
    mass: 0.6,
  });
  const x1 = useTransform(light, (value) => value - HALF_BAND);
  const x2 = useTransform(light, (value) => value + HALF_BAND);

  // 沒有指標時（含觸控裝置）讓光緩慢來回，footer 才不是一塊死掉的字。
  useAnimationFrame((time) => {
    if (shouldReduceMotion || isPointerInside.current || !isInView) return;
    lightRatio.set(0.5 + 0.45 * Math.sin(time / 3000));
  });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !svgRef.current) return;
    isPointerInside.current = true;
    const box = svgRef.current.getBoundingClientRect();
    lightRatio.set((event.clientX - box.left) / box.width);
  };

  const handlePointerLeave = () => {
    isPointerInside.current = false;
  };

  return (
    <div
      ref={containerRef}
      className={cn("text-primary-700 dark:text-primary-300", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
    >
      <svg
        ref={svgRef}
        className="h-auto w-full"
        viewBox={`${GLYPH.minX} ${GLYPH.minY} ${GLYPH_WIDTH} ${GLYPH_HEIGHT}`}
        fill="none"
        role="img"
        aria-label="EVA"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor" fillOpacity={BASE_FILL_OPACITY}>
          {TRACKED_RECTS.map(([x, y, w, h]) => (
            <rect key={`fill-${x}-${y}`} x={x} y={y} width={w} height={h} />
          ))}
        </g>

        <g stroke="currentColor" strokeOpacity={GRID_STROKE_OPACITY} strokeWidth={1}>
          {cells.map(([x, y]) => (
            <rect
              key={`grid-${x}-${y}`}
              x={x}
              y={y}
              width={WORDMARK_CELL_SIZE}
              height={WORDMARK_CELL_SIZE}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g
          fill={shouldReduceMotion ? "var(--foreground)" : `url(#${gradientId})`}
          fillOpacity={shouldReduceMotion ? 0.65 : 1}
        >
          {TRACKED_RECTS.map(([x, y, w, h]) => (
            <rect key={`lit-${x}-${y}`} x={x} y={y} width={w} height={h} />
          ))}
        </g>

        <defs>
          <motion.linearGradient
            id={gradientId}
            x1={x1}
            y1={GLYPH.minY}
            x2={x2}
            y2={GLYPH.maxY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--foreground)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--foreground)" stopOpacity={PEAK_OPACITY} />
            <stop offset="1" stopColor="var(--foreground)" stopOpacity="0" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
}
