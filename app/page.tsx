import { site } from "@/site.config";
import { getRepos } from "@/lib/github";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";

export const revalidate = 3600;

export default async function Home() {
  const repos = await getRepos();
  const byName = new Map(repos.map((r) => [r.name, r]));
  const featured = site.featured.flatMap((f) => {
    const repo = byName.get(f.repo);
    return repo ? [{ ...f, repo }] : [];
  });
  const languageCount = new Set(repos.map((r) => r.language).filter(Boolean)).size;

  return (
    <main className="wrap">
      <section className="hero">
        <p className="eyebrow">{site.title}</p>
        <h1>{site.name}</h1>
        <p className="lede">{site.tagline}</p>
        <nav className="hero__links">
          <Link className="pill pill--accent" href="/projects">
            View projects
          </Link>
          <a className="pill" href={site.links.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          {site.links.linkedin && (
            <a className="pill" href={site.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          )}
          {site.links.email && (
            <a className="pill" href={`mailto:${site.links.email}`}>
              Email
            </a>
          )}
        </nav>
        {repos.length > 0 && (
          <dl className="stats">
            <div>
              <dt>Public projects</dt>
              <dd>{repos.length}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{languageCount}</dd>
            </div>
            <div>
              <dt>Live apps</dt>
              <dd>{repos.filter((r) => r.homepage).length}</dd>
            </div>
          </dl>
        )}
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="section-title">Featured</h2>
          <div className="grid grid--featured">
            {featured.map((f) => (
              <ProjectCard key={f.repo.name} repo={f.repo} blurb={f.blurb} demo={f.demo} featured />
            ))}
          </div>
        </section>
      )}

      <section className="cta">
        <h2 className="section-title">More projects</h2>
        <p className="muted">
          {repos.length > 0
            ? `Browse all ${repos.length} projects, filterable by language, each with its full write-up.`
            : "Browse all projects, each with its full write-up."}
        </p>
        <Link className="pill pill--accent" href="/projects">
          See all projects →
        </Link>
      </section>
    </main>
  );
}
