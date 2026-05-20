#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const dataDir = path.resolve("data");

async function listBookDirs(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(rootDir, entry.name));
}

async function listChapterFiles(bookDir) {
  const entries = await fs.readdir(bookDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /^\d{3}\.json$/.test(entry.name))
    .map((entry) => path.join(bookDir, entry.name));
}

function isSingleParagraphChapter(chapter) {
  const blocks = chapter?.content;
  if (!Array.isArray(blocks) || blocks.length !== 1) return false;
  return blocks[0]?.type === "paragraph";
}

function chapterRef(chapterPath) {
  const rel = path.relative(process.cwd(), chapterPath);
  const book = path.basename(path.dirname(chapterPath));
  const chapter = path.basename(chapterPath, ".json");
  return { rel, ref: `${book}/${chapter}` };
}

async function run() {
  const matches = [];
  const bookDirs = await listBookDirs(dataDir);

  for (const bookDir of bookDirs) {
    const chapterFiles = await listChapterFiles(bookDir);
    for (const chapterFile of chapterFiles) {
      let parsed;
      try {
        parsed = JSON.parse(await fs.readFile(chapterFile, "utf8"));
      } catch (err) {
        console.error(`Failed to parse ${chapterFile}: ${err.message}`);
        process.exitCode = 1;
        continue;
      }

      if (!isSingleParagraphChapter(parsed)) continue;
      const { rel, ref } = chapterRef(chapterFile);
      const sentenceCount = parsed.content?.[0]?.sentences?.length ?? 0;
      matches.push({ rel, ref, sentenceCount });
    }
  }

  matches.sort((a, b) => a.ref.localeCompare(b.ref));

  if (matches.length === 0) {
    console.log("No single-paragraph chapters found.");
    return;
  }

  console.log(`Found ${matches.length} single-paragraph chapter(s):`);
  for (const match of matches) {
    console.log(`${match.ref}\t(${match.sentenceCount} sentence(s))\t${match.rel}`);
  }
}

await run();
