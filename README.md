# Personal Website

A portfolio site that showcases my GitHub projects. Built with Next.js and deployed on Vercel.

Repos are fetched from the GitHub API and refreshed hourly, so new public repos show up automatically.

## Customise

Everything personal lives in [`site.config.ts`](site.config.ts): name, tagline, links, which repos are featured (with optional custom blurbs/demo links), and which repos to hide.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo, then click **Deploy**. No settings needed.
3. Optional: add a `GITHUB_TOKEN` env var (a fine-grained token with no permissions) to raise the GitHub API rate limit.
