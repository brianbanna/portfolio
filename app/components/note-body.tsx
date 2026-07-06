"use client";
import { useMDXComponent } from "next-contentlayer/hooks";

export function NoteBody({ code }: { code: string }) {
  const MDX = useMDXComponent(code);
  return (
    <div
      className={[
        "max-w-[62ch]",
        "prose prose-invert",
        "prose-p:prose-p:text-[18px] prose-p:md:text-[19px] prose-p:leading-[1.7] prose-p:text-fg/85",
        "prose-li:prose-li:text-fg/85",
        "prose-h2:prose-h2:text-[11px] prose-h2:uppercase prose-h2:tracking-[0.18em] prose-h2:font-medium prose-h2:text-fg/55 prose-h2:mt-12 prose-h2:mb-4",
        "prose-h3:prose-h3:text-fg",
        "prose-strong:text-fg prose-a:text-fg prose-a:underline-offset-4 hover:prose-a:text-accent",
        "prose-blockquote:border-fg/20 prose-blockquote:text-fg/70",
        "prose-code:text-fg/90",
      ].join(" ")}
    >
      <MDX />
    </div>
  );
}
