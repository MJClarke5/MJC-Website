import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/site.config";
import { getReadmeHtml, getRepos, prettyName, splitDescription, type Repo } from "@/lib/github";

export const revalidate = 3600;

type Props = { params: Promise<{ repo: string }> };

async function findRepo(name: string): Promise<Repo | undefined> {
  return (await getRepos()).find((r) => r.name === name);
}

function titleFor(repo: Repo) {
  const { term, text } = splitDescription(repo.description);
  return term && text ? text : prettyName(repo.name);
}

export async function generateStaticParams() {
  return (await getRepos()).map((r) => ({ repo: r.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const repo = await findRepo((await params).repo);
  if (!repo) return {};
  return { title: `${titleFor(repo)} | ${site.name}`, description: repo.description ?? undefined };
}

export default async function ProjectPage({ params }: Props) {
  const repo = await findRepo((await params).repo);
  if (!repo) notFound();

  const featured = site.featured.find((f) => f.repo === repo.name);
  const live = featured?.demo || repo.homepage || null;
  const { term } = splitDescription(repo.description);
  const readme = await getReadmeHtml(repo.name, repo.default_branch);

  return (
    <main className="wrap project">
      <Link href="/projects" className="back">
        ← All projects
      </Link>

      <header className="project__head">
        {term && <p className="eyebrow">{term}</p>}
        <h1>{titleFor(repo)}</h1>
        {(featured?.blurb ?? repo.description) && (
          <p className="lede">{featured?.blurb ?? repo.description}</p>
        )}
        <div className="hero__links">
          {live && (
            <a href={live} target="_blank" rel="noreferrer" className="pill pill--accent">
              Live demo ↗
            </a>
          )}
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="pill">
            View code on GitHub ↗
          </a>
          {repo.language && <span className="pill pill--static">{repo.language}</span>}
        </div>
      </header>

      {readme ? (
        <article className="readme" dangerouslySetInnerHTML={{ __html: readme }} />
      ) : (
        <p className="muted">
          This project doesn&apos;t have a README yet. <a href={repo.html_url}>Browse the code on GitHub</a>.
        </p>
      )}
    </main>
  );
}
