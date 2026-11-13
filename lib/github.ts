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
  default_branch: string;
};

function githubHeaders(accept: string) {
  const headers: Record<string, string> = { Accept: accept };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

export async function getRepos(): Promise<Repo[]> {
  const headers = githubHeaders("application/vnd.github+json");

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

// README rendered to HTML by GitHub (already sanitised), with relative links fixed.
export async function getReadmeHtml(repo: string, branch: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${site.githubUser}/${repo}/readme`, {
      headers: githubHeaders("application/vnd.github.html"),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null; // 404 = no README
    return absolutizeUrls(await res.text(), repo, branch);
  } catch (err) {
    console.error(`README fetch failed for ${repo}`, err);
    return null;
  }
}

// Relative paths like "images/plot.png" only work on github.com. Point images at the
// raw file and links at the file's GitHub page. Absolute URLs, data:, mailto: and
// #anchors are left alone.
function absolutizeUrls(html: string, repo: string, branch: string) {
  const owner = site.githubUser;
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`;

  return html.replace(/\b(src|href)="([^"]+)"/g, (match, attr: string, url: string) => {
    if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return match;
    try {
      const resolved = new URL(url.replace(/^\//, ""), attr === "src" ? rawBase : blobBase);
      return `${attr}="${resolved.href}"`;
    } catch {
      return match;
    }
  });
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
