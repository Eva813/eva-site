import { About } from "@/features/portfolio/components/about";
import { GithubContributionsSection } from "@/features/portfolio/components/github-contributions";
import { Hero } from "@/features/portfolio/components/hero";
import { RecentPosts } from "@/features/portfolio/components/recent-posts";
import { TechStack } from "@/features/portfolio/components/tech-stack";
import { getFeaturedPosts } from "@/features/blog/lib/posts";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-10 sm:px-6">
      <Hero />
      <About />
      <GithubContributionsSection username={siteConfig.author.handle} />
      <TechStack />
      <RecentPosts posts={getFeaturedPosts(5)} />
    </div>
  );
}
