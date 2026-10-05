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
      <h1 className="display text-4xl md:text-5xl font-normal text-fg">Page not found</h1>
      <Link
        href="/"
        className="font-sans text-[15px] text-muted hover:text-fg transition-colors link-draw"
      >
        Back to index
      </Link>
    </div>
  );
}
