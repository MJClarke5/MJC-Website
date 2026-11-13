import { prettyName, splitDescription, type Repo } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  R: "#198CE7",
  HTML: "#e34c26",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  AMPL: "#9a9a3a",
  "Jupyter Notebook": "#DA5B0B",
};

export function ProjectCard({
  repo,
  blurb,
  demo,
  featured = false,
}: {
  repo: Repo;
  blurb?: string;
  demo?: string;
  featured?: boolean;
}) {
  const { term, text } = splitDescription(repo.description);
  const live = demo || repo.homepage || null;
  // Coursework repos ("DS-810") read better titled by their description.
  const title = term && text ? text : prettyName(repo.name);
  const desc = blurb ?? (term ? null : text);

  return (
    <article className={`card${featured ? " card--featured" : ""}`}>
      <header className="card__head">
        <h3 className="card__title">
          <a href={repo.html_url} target="_blank" rel="noreferrer">
            {title}
          </a>
        </h3>
        {term && <span className="card__term">{term}</span>}
      </header>

      {desc && <p className="card__desc">{desc}</p>}

      <footer className="card__meta">
        <span className="card__repo">{repo.name}</span>
        {repo.language && (
          <span className="card__lang">
            <i style={{ background: LANG_COLORS[repo.language] ?? "#888" }} />
            {repo.language}
          </span>
        )}
        {repo.stargazers_count > 0 && <span>★ {repo.stargazers_count}</span>}
        <span className="card__links">
          {live && (
            <a href={live} target="_blank" rel="noreferrer" className="pill pill--accent">
              Live demo ↗
            </a>
          )}
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="pill">
            Code
          </a>
        </span>
      </footer>
    </article>
  );
}
