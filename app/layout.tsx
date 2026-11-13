import type { Metadata } from "next";
import { site } from "@/site.config";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name} | ${site.title}`,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
        <footer className="wrap foot">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className="muted">Projects synced from GitHub hourly</span>
        </footer>
      </body>
    </html>
  );
}
