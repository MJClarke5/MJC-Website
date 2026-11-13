import type { Metadata } from "next";
import { site } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.name} | ${site.title}`,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
