"use client";

import { useMemo, useState } from "react";
import { site } from "@/site.config";
import type { Repo } from "@/lib/github";
import { ProjectCard } from "./ProjectCard";

// Reuse the blurbs/demo links from site.config so cards match the Featured section.
const featuredInfo = new Map(site.featured.map(({ repo, ...info }) => [repo, info]));

export function ProjectGrid({ repos }: { repos: Repo[] }) {
  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language ?? "Other"));
    return ["All", ...Array.from(set).sort()];
  }, [repos]);
  const [lang, setLang] = useState("All");

  const shown = lang === "All" ? repos : repos.filter((r) => (r.language ?? "Other") === lang);

  return (
    <>
      <div className="filters" aria-label="Filter by language">
        {languages.map((l) => (
          <button
            key={l}
            aria-pressed={lang === l}
            className={`chip${lang === l ? " chip--on" : ""}`}
            onClick={() => setLang(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.map((r) => (
          <ProjectCard key={r.name} repo={r} {...featuredInfo.get(r.name)} />
        ))}
      </div>
    </>
  );
}
