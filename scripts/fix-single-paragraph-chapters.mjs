#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const BOOKS = new Set([
  "houhanshu",
  "mingshi",
  "qingshigao",
  "songshi",
  "yuanshi",
  "zizhitongjian",
]);

function isChapterFile(name) {
  return /^\d{3}\.json$/.test(name);
}

function isSingleParagraph(data) {
  if (!Array.isArray(data?.content) || data.content.length !== 1) return false;
  return data.content[0]?.type === "paragraph";
}

function flattenSentences(data) {
  const flat = [];
  for (const block of data.content || []) {
    if (!Array.isArray(block?.sentences)) continue;
    for (const sentence of block.sentences) {
      flat.push(sentence);
    }
  }
  return flat;
}

function hasAnyTranslations(flatSentences) {
  return flatSentences.some((s) => Array.isArray(s?.translations) && s.translations.length > 0);
}

function hasGarrettTranslations(flatSentences) {
  for (const s of flatSentences) {
    for (const t of s?.translations || []) {
      if ((t?.translator || "").includes("Garrett")) return true;
    }
  }
  return false;
}

function chapterRefFromFile(filePath) {
  const rel = path.relative(DATA_DIR, filePath);
  const [book, file] = rel.split(path.sep);
  return { book, chapter: file.replace(/\.json$/, "") };
}

function collectSingleParagraphFiles() {
  const matches = [];
  for (const entry of fs.readdirSync(DATA_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || !BOOKS.has(entry.name)) continue;
    const bookDir = path.join(DATA_DIR, entry.name);
    for (const f of fs.readdirSync(bookDir, { withFileTypes: true })) {
      if (!f.isFile() || !isChapterFile(f.name)) continue;
      const filePath = path.join(bookDir, f.name);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (isSingleParagraph(data)) matches.push(filePath);
    }
  }
  return matches.sort();
}

function restoreFile(filePath, backupText) {
  fs.writeFileSync(filePath, backupText, "utf8");
}

function runScrape(book, chapter) {
  const result = spawnSync("node", ["scrape.js", book, chapter], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  return result;
}

function transferSentenceTranslations(oldData, newData) {
  const oldFlat = flattenSentences(oldData);
  const newFlat = flattenSentences(newData);
  const oldHasGarrett = hasGarrettTranslations(oldFlat);

  // If chapter does not contain Garrett-authored translations, accept re-scraped output as-is.
  if (!oldHasGarrett) {
    return { ok: true, preserved: false, untranslatedFastPath: true, protectedChapter: false };
  }

  if (oldFlat.length !== newFlat.length) {
    return { ok: false, reason: `sentence-count-mismatch old=${oldFlat.length} new=${newFlat.length}` };
  }

  for (let i = 0; i < oldFlat.length; i += 1) {
    if ((oldFlat[i]?.zh || "") !== (newFlat[i]?.zh || "")) {
      return { ok: false, reason: `sentence-text-mismatch at index ${i}` };
    }
  }

  for (let i = 0; i < oldFlat.length; i += 1) {
    if (Array.isArray(oldFlat[i]?.translations) && oldFlat[i].translations.length > 0) {
      newFlat[i].translations = oldFlat[i].translations;
    }
  }

  // Preserve any non-derived metadata fields from existing chapter.
  const preserveMetaKeys = ["reviewed", "reviewedAt", "reviewedBy"];
  for (const key of preserveMetaKeys) {
    if (Object.prototype.hasOwnProperty.call(oldData.meta || {}, key)) {
      newData.meta[key] = oldData.meta[key];
    }
  }

  return { ok: true, preserved: true, untranslatedFastPath: false, protectedChapter: true };
}

function main() {
  const files = collectSingleParagraphFiles();
  const report = {
    startedAt: new Date().toISOString(),
    targetCount: files.length,
    fixed: [],
    stillSingleParagraph: [],
    failed: [],
  };

  console.error(`Found ${files.length} single-paragraph chapters to process.`);

  for (const filePath of files) {
    const { book, chapter } = chapterRefFromFile(filePath);
    const ref = `${book}/${chapter}`;
    const backupText = fs.readFileSync(filePath, "utf8");
    const oldData = JSON.parse(backupText);
    const oldFlat = flattenSentences(oldData);
    const oldHadTranslations = hasAnyTranslations(oldFlat);
    const oldHasGarrett = hasGarrettTranslations(oldFlat);

    const scrapeResult = runScrape(book, chapter);
    if (scrapeResult.status !== 0) {
      restoreFile(filePath, backupText);
      report.failed.push({
        chapter: ref,
        reason: "scrape-failed",
        stderr: (scrapeResult.stderr || "").split("\n").slice(-8).join("\n"),
      });
      continue;
    }

    let newData;
    try {
      newData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (err) {
      restoreFile(filePath, backupText);
      report.failed.push({
        chapter: ref,
        reason: `parse-failed ${err instanceof Error ? err.message : String(err)}`,
      });
      continue;
    }

    const transfer = transferSentenceTranslations(oldData, newData);
    if (!transfer.ok) {
      restoreFile(filePath, backupText);
      report.failed.push({ chapter: ref, reason: transfer.reason });
      continue;
    }

    fs.writeFileSync(filePath, `${JSON.stringify(newData, null, 2)}\n`, "utf8");

    if (isSingleParagraph(newData)) {
      report.stillSingleParagraph.push({
        chapter: ref,
        sentenceCount: flattenSentences(newData).length,
      });
    } else {
      report.fixed.push({
        chapter: ref,
        sentenceCount: flattenSentences(newData).length,
        preservedTranslations: !!transfer.preserved,
        untranslatedFastPath: !!transfer.untranslatedFastPath,
        oldHadTranslations,
        oldHasGarrett,
      });
    }
  }

  report.completedAt = new Date().toISOString();
  const reportPath = path.join(ROOT, "translations", "single_paragraph_fix_report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.error(`Report written to ${reportPath}`);
}

main();
