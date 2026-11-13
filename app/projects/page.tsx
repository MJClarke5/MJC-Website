import type { Metadata } from "next";
import { site } from "@/site.config";
import { getRepos } from "@/lib/github";
import { ProjectGrid } from "@/components/ProjectGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Projects | ${site.name}`,
  description: `All of ${site.name}'s public projects, synced from GitHub.`,
};

export default async function ProjectsPage() {
  const repos = await getRepos();

  // Featured projects first (in site.config order), then the rest by most recent push.
  const order = new Map(site.featured.map((f, i) => [f.repo, i]));
  const sorted = [...repos].sort(
    (a, b) => (order.get(a.name) ?? Infinity) - (order.get(b.name) ?? Infinity)
  );

  return (
    <main className="wrap page">
      <header className="page__head">
        <p className="eyebrow">Projects</p>
        <h1>Everything I&apos;ve built</h1>
        <p className="lede">
          {repos.length > 0
            ? `${repos.length} projects across coursework, analysis and live apps. Pick one to read the write-up.`
            : "Projects synced from GitHub."}
        </p>
      </header>

      {sorted.length > 0 ? (
        <ProjectGrid repos={sorted} />
      ) : (
        <p className="muted">
          Couldn&apos;t load projects right now. See them on <a href={site.links.github}>GitHub</a>.
        </p>
      )}
    </main>
  );
}
