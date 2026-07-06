import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allNotes } from "contentlayer/generated";
import { Navigation } from "../../components/nav";
import { Footer } from "../../components/footer";
import { NoteBody } from "../../components/note-body";

export const dynamicParams = false;

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
      <Navigation notesEnabled />
      <main className="flex-1">
        <article className="editorial pt-36 md:pt-44 pb-16 md:pb-24">
          <h1 className="display text-[clamp(2.4rem,6vw,5rem)] text-fg leading-[0.95] text-balance max-w-4xl">
            {note.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.16em] text-fg/55">
            <span className="tabular-nums">
              {dateFmt.format(new Date(note.date))}
            </span>
            <span className="text-fg/25">/</span>
            <span>{note.market}</span>
            {note.instruments && note.instruments.length > 0 && (
              <>
                <span className="text-fg/25">/</span>
                <span>{note.instruments.join(" · ")}</span>
              </>
            )}
          </div>

          <p className="mt-10 font-medium text-xl md:text-2xl leading-[1.45] text-fg/90 max-w-[58ch]">
            {note.summary}
          </p>

          <div className="hairline my-12" />

          <NoteBody code={note.body.code} />

          <div className="hairline my-12" />

          <p className="text-[11px] uppercase tracking-[0.16em] text-fg/55">
            Personal market notes based on public information only. Not
            investment advice.
          </p>

          <div className="mt-12">
            <Link
              href="/notes"
              className="text-[11px] uppercase tracking-[0.18em] text-fg/55 hover:text-fg transition-colors link-draw"
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
