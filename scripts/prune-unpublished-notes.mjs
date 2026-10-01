// Runs after `next build`. With no published note, the export still contains
// /notes/ and the sentinel /notes/placeholder/ (generateStaticParams needs at
// least 1 param under output: export) as HTTP 200 shells that render the 404
// component. Drop them so Apache serves a real 404 until a note is published.
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const notesDir = join(root, "content", "notes");
const outNotes = join(root, "out", "notes");

const hasPublishedNote =
  existsSync(notesDir) &&
  readdirSync(notesDir)
    .filter((f) => f.endsWith(".mdx"))
    .some((f) => /^published:\s*true\b/m.test(readFileSync(join(notesDir, f), "utf8")));

if (hasPublishedNote) {
  console.log("prune-unpublished-notes: published notes present, keeping out/notes");
} else if (existsSync(outNotes)) {
  rmSync(outNotes, { recursive: true, force: true });
  console.log("prune-unpublished-notes: no published note, removed out/notes");
} else {
  console.log("prune-unpublished-notes: nothing to prune");
}
