import { site } from "@/site.config";
import { getRepos } from "@/lib/github";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectGrid } from "@/components/ProjectGrid";

export const revalidate = 3600;

export default async function Home() {
  const repos = await getRepos();
  const byName = new Map(repos.map((r) => [r.name, r]));
  const featured = site.featured.flatMap((f) => {
    const repo = byName.get(f.repo);
    return repo ? [{ ...f, repo }] : [];
  });
  const featuredNames = new Set(featured.map((f) => f.repo.name));
  const rest = repos.filter((r) => !featuredNames.has(r.name));
  const languageCount = new Set(repos.map((r) => r.language).filter(Boolean)).size;

  return (
    <main className="wrap">
      <section className="hero">
        <p className="eyebrow">{site.title}</p>
        <h1>{site.name}</h1>
        <p className="lede">{site.tagline}</p>
        <nav className="hero__links">
          <a className="pill pill--accent" href={site.links.github} target="_blank" rel="noreferrer">
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

      <section>
        <h2 className="section-title">All projects</h2>
        {rest.length > 0 ? (
          <ProjectGrid repos={rest} />
        ) : (
          <p className="muted">
            Couldn&apos;t load projects right now. See them on <a href={site.links.github}>GitHub</a>.
          </p>
        )}
      </section>

      <footer className="foot">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="muted">Projects synced from GitHub hourly</span>
      </footer>
    </main>
  );
}
