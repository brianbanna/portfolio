import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: null,
  alternates: null,
  openGraph: null,
  twitter: null,
  keywords: null,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center gap-6">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg/55">
        404
      </span>
      <h1 className="display text-4xl md:text-6xl text-fg">Page not found</h1>
      <Link
        href="/"
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg/55 hover:text-fg transition-colors link-draw"
      >
        Back to index
      </Link>
    </div>
  );
}
