import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allNotes } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Footer } from "../components/footer";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function publishedNotes() {
  return allNotes
    .filter((n) => n.published)
    .sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function generateMetadata(): Metadata {
  if (publishedNotes().length === 0) {
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: "Notes",
    description: "Dated market notes.",
    alternates: { canonical: "https://brianbanna.com/notes/" },
  };
}

export default function NotesPage() {
  const notes = publishedNotes();
  if (notes.length === 0) notFound();

  return (
    <div className="bg-bg min-h-screen flex flex-col">
      <Navigation notesEnabled />
      <main className="flex-1">
        <section className="relative bg-bg overflow-hidden border-b border-fg/5">
          <div className="noise" aria-hidden />
          <div className="editorial relative pt-36 md:pt-44 pb-12 md:pb-16">
            <h1 className="display text-[clamp(3rem,9vw,8rem)] text-fg leading-[0.9]">
              Notes.
            </h1>
          </div>
        </section>

        <section className="editorial py-12 md:py-16">
          <div className="border-t border-fg/15">
            {notes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="group grid grid-cols-12 gap-3 md:gap-6 py-7 md:py-8 border-b border-fg/15 transition-colors hover:bg-fg/[0.02] items-baseline"
              >
                <div className="col-span-12 md:col-span-2 text-[11px] uppercase tracking-[0.16em] text-fg/55 tabular-nums">
                  {dateFmt.format(new Date(note.date))}
                </div>
                <div className="col-span-12 md:col-span-7">
                  <h2 className="text-xl md:text-2xl text-fg/90 group-hover:text-fg leading-snug transition-colors">
                    {note.title}
                  </h2>
                  <p className="mt-3 text-[15px] md:text-base leading-[1.6] text-fg/60 max-w-xl">
                    {note.summary}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-3 flex md:justify-end">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-fg/55 border border-fg/15 px-2 py-1">
                    {note.market}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
