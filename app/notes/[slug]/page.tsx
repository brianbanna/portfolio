import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allNotes } from "contentlayer/generated";
import { Navigation } from "../../components/nav";
import { Footer } from "../../components/footer";
import { NoteBody } from "../../components/note-body";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function findNote(slug: string) {
  return allNotes.find((n) => n.published && n.slug === slug);
}

export function generateStaticParams() {
  const published = allNotes
    .filter((n) => n.published)
    .map((n) => ({ slug: n.slug }));
  // output: export rejects an empty param list; with 0 published notes emit
  // 1 sentinel slug whose page resolves to a noindexed 404
  return published.length > 0 ? published : [{ slug: "placeholder" }];
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const note = findNote(params.slug);
  if (!note) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }
  const url = `https://brianbanna.com/notes/${note.slug}/`;
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${note.title} | Brian Banna`,
      description: note.summary,
      url,
      siteName: "Brian Banna",
      locale: "en-US",
      type: "article",
      images: [
        {
          url: "https://brianbanna.com/og-home.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${note.title} | Brian Banna`,
      description: note.summary,
      images: ["https://brianbanna.com/og-home.png"],
    },
  };
}

export default function NotePage({ params }: { params: { slug: string } }) {
  const note = findNote(params.slug);
  if (!note) notFound();

  return (
    <div className="bg-bg min-h-screen flex flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-fg focus:text-bg label"
      >
        Skip to content
      </a>
      <Navigation notesEnabled />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <article className="editorial pt-36 md:pt-44 pb-16 md:pb-24">
          <h1 className="chapter text-fg text-balance max-w-4xl">
            {note.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-sans text-[15px] text-muted">
            <span className="tabular-nums">
              {dateFmt.format(new Date(note.date))}
            </span>
            <span className="text-fg/25">/</span>
            <span>{note.market}</span>
            {note.instruments && note.instruments.length > 0 && (
              <>
                <span className="text-fg/25">/</span>
                <span>{note.instruments.join(", ")}</span>
              </>
            )}
          </div>

          <p className="mt-10 max-w-[40rem] font-sans text-xl font-medium leading-[1.45] tracking-[-0.02em] text-fg md:text-2xl">
            {note.summary}
          </p>

          <div className="hairline my-12" />

          <NoteBody code={note.body.code} />

          <div className="hairline my-12" />

          <p className="max-w-[40rem] font-sans text-[15px] leading-relaxed text-muted">
            Personal market notes based on public information only. Not
            investment advice.
          </p>

          <div className="mt-12">
            <Link
              href="/notes"
              className="font-sans text-[15px] text-muted transition-colors hover:text-fg link-draw"
            >
              All notes
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
