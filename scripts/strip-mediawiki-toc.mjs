#!/usr/bin/env node
/**
 * Remove MediaWiki __TOC__ markers from Chinese-facing strings in chapter JSON.
 *
 * Strips __TOC__ anywhere in the string. For paragraphs only: a sentence is removed
 * if stripping __TOC__ leaves it empty (never removes sentences that were already
 * empty placeholders). Table headers and table cells are only edited in place so
 * row/column counts stay aligned.
 *
 * Usage:
 *   node scripts/strip-mediawiki-toc.mjs
 *   node scripts/strip-mediawiki-toc.mjs data/zizhitongjian
 *   node scripts/strip-mediawiki-toc.mjs data/jinshu/011.json
 */

import fs from "node:fs";
import path from "node:path";
import { countChapterMetrics } from "../chapter-counts.mjs";

const ROOT = process.cwd();

function expandInputs(inputs) {
  const files = [];
  const enqueue = (entry) => {
    if (!fs.existsSync(entry)) return;
    const st = fs.statSync(entry);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(entry)) {
        enqueue(path.join(entry, child));
      }
    } else if (entry.endsWith(".json")) {
      files.push(entry);
    }
  };
  for (const arg of inputs) enqueue(arg);
  return [...new Set(files)].sort();
}

/** Remove MediaWiki TOC marker anywhere (leading, embedded, or trailing). */
function stripTocArtifacts(raw) {
  if (typeof raw !== "string" || !raw.includes("__TOC__")) return raw;
  return raw.replace(/^__TOC__\s*/, "").replace(/__TOC__/g, "").trim();
}

function stripField(obj, field) {
  if (!obj || typeof obj[field] !== "string") return false;
  const raw = obj[field];
  const next = stripTocArtifacts(raw);
  if (next === raw) return false;
  obj[field] = next;
  return true;
}

function cleanSentenceLike(s) {
  const changed = stripField(s, "zh") || stripField(s, "content");
  const text = String(s?.zh ?? s?.content ?? "").trim();
  return { changed, emptyAfterEdit: changed && text === "" };
}

/** Strip __TOC__ on each sentence; never splice (preserves empty placeholder cells). */
function stripSentencesInPlace(sentences) {
  if (!Array.isArray(sentences)) return false;
  let changed = false;
  for (const s of sentences) {
    const { changed: c } = cleanSentenceLike(s);
    if (c) changed = true;
  }
  return changed;
}

/** Remove only sentences that became empty because __TOC__ was stripped from them. */
function filterParagraphSentences(sentences) {
  if (!Array.isArray(sentences)) return false;
  let changed = false;
  const kept = [];
  for (const s of sentences) {
    const { changed: c, emptyAfterEdit } = cleanSentenceLike(s);
    if (c) changed = true;
    if (emptyAfterEdit) {
      continue;
    }
    kept.push(s);
  }
  if (kept.length !== sentences.length) {
    sentences.length = 0;
    sentences.push(...kept);
    changed = true;
  }
  return changed;
}

function processChapter(data) {
  if (!data?.meta?.book || !Array.isArray(data.content)) return false;
  let changed = false;
  const nextContent = [];

  for (const block of data.content) {
    if (block.type === "table_header") {
      if (stripSentencesInPlace(block.sentences)) changed = true;
    } else if (block.type === "paragraph") {
      if (filterParagraphSentences(block.sentences)) changed = true;
      if (!(block.sentences || []).length) {
        changed = true;
        continue;
      }
    } else if (block.type === "table_row") {
      for (const cell of block.cells || []) {
        const { changed: c } = cleanSentenceLike(cell);
        if (c) changed = true;
      }
    }
    nextContent.push(block);
  }

  if (nextContent.length !== data.content.length) {
    data.content = nextContent;
    changed = true;
  }

  if (changed) {
    const { sentenceCount, translatedCount } = countChapterMetrics(data);
    data.meta.sentenceCount = sentenceCount;
    data.meta.translatedCount = translatedCount;
  }
  return changed;
}

function main() {
  const args = process.argv.slice(2);
  const inputs = args.length ? args : [path.join(ROOT, "data")];
  let filesUpdated = 0;
  let filesSeen = 0;

  for (const fp of expandInputs(inputs)) {
    filesSeen += 1;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch {
      continue;
    }
    if (!processChapter(data)) continue;
    fs.writeFileSync(fp, JSON.stringify(data, null, 2), "utf8");
    filesUpdated += 1;
    console.log(path.relative(ROOT, fp));
  }

  console.error(`strip-mediawiki-toc: updated ${filesUpdated} of ${filesSeen} JSON files`);
}

main();
