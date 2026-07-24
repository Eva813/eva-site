import { About } from "@/features/portfolio/components/about";
import { Hero } from "@/features/portfolio/components/hero";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
      <Hero />
      <About />
    </div>
  );
}
