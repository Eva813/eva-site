export type TechStackGroup = {
  category: string;
  items: string[];
};

// TODO(Eva): 換成你實際熟悉的技術／工具，分類可自由增減
export const techStack: TechStackGroup[] = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
  { category: "Tooling", items: ["Vite", "pnpm", "Git"] },
];
