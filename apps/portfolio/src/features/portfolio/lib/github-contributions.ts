import type { Activity } from "@/components/contribution-graph";

type ContributionsResponse = {
  contributions: Activity[];
};

// Public, unauthenticated contribution-calendar API (no GitHub token needed).
// This is a static-export site, so the fetch runs once at build time.
const CONTRIBUTIONS_API_URL = "https://github-contributions-api.jogruber.de";

export async function getGithubContributions(username: string): Promise<Activity[]> {
  try {
    const res = await fetch(`${CONTRIBUTIONS_API_URL}/v4/${username}?y=last`);
    if (!res.ok) {
      throw new Error(`GitHub contributions API responded ${res.status}`);
    }
    const data = (await res.json()) as ContributionsResponse;
    return data.contributions ?? [];
  } catch (error) {
    console.error("[github-contributions]", error);
    return [];
  }
}
