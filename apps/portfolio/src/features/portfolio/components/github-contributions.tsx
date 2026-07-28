import { GitHubContributions } from "@/components/github-contributions";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "@/components/panel";
import { getGithubContributions } from "@/features/portfolio/lib/github-contributions";

export async function GithubContributionsSection({ username }: { username: string }) {
  const data = await getGithubContributions(username);
  if (data.length === 0) return null;

  return (
    <Panel id="contributions">
      <PanelHeader>
        <span className="h-px w-4 bg-primary" aria-hidden />
        <PanelTitle>GitHub Contributions</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <GitHubContributions data={data} githubProfileUrl={`https://github.com/${username}`} />
      </PanelContent>
    </Panel>
  );
}
