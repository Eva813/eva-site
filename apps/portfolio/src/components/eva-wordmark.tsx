import type { ComponentProps } from "react";

// 5x7 點陣網格手工設計「EVA」，每格 32 單位，用連續填色合併成矩形（非手繪貝茲曲線，
// 幾何正確性可用簡單的柵格陣列驗證，不會有畫崩風險）。
const WORDMARK_RECTS: [x: number, y: number, w: number, h: number][] = [
  [32, 16, 160, 32],
  [32, 48, 32, 32],
  [32, 80, 32, 32],
  [32, 112, 128, 32],
  [32, 144, 32, 32],
  [32, 176, 32, 32],
  [32, 208, 160, 32],
  [224, 16, 32, 32],
  [352, 16, 32, 32],
  [224, 48, 32, 32],
  [352, 48, 32, 32],
  [224, 80, 32, 32],
  [352, 80, 32, 32],
  [224, 112, 32, 32],
  [352, 112, 32, 32],
  [224, 144, 32, 32],
  [352, 144, 32, 32],
  [256, 176, 32, 32],
  [320, 176, 32, 32],
  [288, 208, 32, 32],
  [448, 16, 96, 32],
  [416, 48, 32, 32],
  [544, 48, 32, 32],
  [416, 80, 32, 32],
  [544, 80, 32, 32],
  [416, 112, 160, 32],
  [416, 144, 32, 32],
  [544, 144, 32, 32],
  [416, 176, 32, 32],
  [544, 176, 32, 32],
  [416, 208, 32, 32],
  [544, 208, 32, 32],
];

export const WORDMARK_VIEWBOX_WIDTH = 608;
export const WORDMARK_VIEWBOX_HEIGHT = 256;

export function EvaWordmark({
  fill = "currentColor",
  ...props
}: ComponentProps<"svg"> & { fill?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WORDMARK_VIEWBOX_WIDTH} ${WORDMARK_VIEWBOX_HEIGHT}`}
      fill="none"
      {...props}
    >
      {WORDMARK_RECTS.map(([x, y, w, h]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill={fill} />
      ))}
    </svg>
  );
}

export { WORDMARK_RECTS };
