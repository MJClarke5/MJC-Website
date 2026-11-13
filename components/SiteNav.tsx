"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/site.config";

export function SiteNav() {
  const path = usePathname();
  const onProjects = path.startsWith("/projects");

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <Link href="/" className="nav__brand">
          {site.name}
        </Link>
        <nav className="nav__links" aria-label="Main">
          <Link href="/" aria-current={path === "/" ? "page" : undefined}>
            Home
          </Link>
          <Link href="/projects" aria-current={onProjects ? "page" : undefined}>
            Projects
          </Link>
          <a href={site.links.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
