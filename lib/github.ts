import { site } from "@/site.config";

export type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  topics: string[];
  pushed_at: string;
};

export async function getRepos(): Promise<Repo[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${site.githubUser}/repos?per_page=100&sort=pushed`,
      { headers, next: { revalidate: 3600 } } // refresh at most hourly
    );
    if (!res.ok) {
      console.error(`GitHub API ${res.status}: ${await res.text()}`);
      return [];
    }
    const repos: Repo[] = await res.json();
    return repos.filter((r) => !site.hidden.includes(r.name) && !(site.hideForks && r.fork));
  } catch (err) {
    console.error("GitHub fetch failed", err);
    return [];
  }
}

// Turns "DS-810" / "Text-Analysis-Amazon-Annual-Report" into readable titles.
export function prettyName(name: string) {
  return name.replace(/-{2,}/g, " – ").replace(/[-_]/g, " ");
}

// Pulls the term out of descriptions like "Spring 2025 Term 2 Project - Airbnb ..."
export function splitDescription(desc: string | null) {
  if (!desc) return { term: null, text: null };
  const m = desc.match(/^((?:Spring|Summer|Fall|Winter) \d{4})[^-–]*[-–]\s*(.+)$/i);
  return m ? { term: m[1], text: m[2] } : { term: null, text: desc };
}
