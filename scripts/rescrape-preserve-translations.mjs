#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";

function normalizeText(text) {
  return (text || "").replace(/[\p{P}\p{S}\s]+/gu, "").trim();
}

function flattenItems(chapter) {
  const out = [];
  for (const block of chapter.content || []) {
    if (block.type === "table_row") {
      for (const cell of block.cells || []) {
        out.push({ block, item: cell, kind: "cell" });
      }
    } else {
      for (const sentence of block.sentences || []) {
        out.push({ block, item: sentence, kind: "sentence" });
      }
    }
  }
  return out;
}

function keyOf(item) {
  return normalizeText(item?.zh || item?.content || "");
}

function hasTranslations(item) {
  if (!item) return false;
  if (Array.isArray(item.translations)) {
    return item.translations.some((t) =>
      Object.values(t || {}).some((v) => typeof v === "string" && v.trim())
    );
  }
  return Object.values(item).some((v) => typeof v === "string" && v.trim());
}

function copyTranslations(oldItem, newItem) {
  if (Array.isArray(oldItem.translations)) {
    newItem.translations = JSON.parse(JSON.stringify(oldItem.translations));
  } else {
    for (const key of ["literal", "idiomatic", "translator", "reviewed"]) {
      if (Object.prototype.hasOwnProperty.call(oldItem, key)) {
        newItem[key] = JSON.parse(JSON.stringify(oldItem[key]));
      }
    }
  }
}

function lcsMatches(oldSeq, newSeq) {
  const n = oldSeq.length;
  const m = newSeq.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i][j] = oldSeq[i] === newSeq[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (oldSeq[i] === newSeq[j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }
  return pairs;
}

function preserveTranslations(oldChapter, newChapter) {
  const oldFlat = flattenItems(oldChapter);
  const newFlat = flattenItems(newChapter);

  const oldSeq = [];
  const newSeq = [];
  const oldIndexMap = [];
  const newIndexMap = [];

  for (let i = 0; i < oldFlat.length; i += 1) {
    const key = keyOf(oldFlat[i].item);
    if (key) {
      oldSeq.push(key);
      oldIndexMap.push(i);
    }
  }

  for (let i = 0; i < newFlat.length; i += 1) {
    const key = keyOf(newFlat[i].item);
    if (key) {
      newSeq.push(key);
      newIndexMap.push(i);
    }
  }

  const pairs = lcsMatches(oldSeq, newSeq);
  let transferred = 0;

  for (const [oldPos, newPos] of pairs) {
    const oldItem = oldFlat[oldIndexMap[oldPos]].item;
    const newItem = newFlat[newIndexMap[newPos]].item;
    if (!hasTranslations(oldItem)) continue;
    copyTranslations(oldItem, newItem);
    transferred += 1;
  }

  if (oldChapter?.meta && newChapter?.meta) {
    for (const key of ["reviewed", "reviewedAt", "reviewedBy"]) {
      if (Object.prototype.hasOwnProperty.call(oldChapter.meta, key)) {
        newChapter.meta[key] = oldChapter.meta[key];
      }
    }
  }

  return transferred;
}

function countTranslated(chapter) {
  let count = 0;
  for (const block of chapter.content || []) {
    if (block.type === "table_row") {
      for (const cell of block.cells || []) {
        const t = cell.translations?.[0] || cell;
        if ((t.idiomatic || t.literal || "").trim()) count += 1;
      }
    } else {
      for (const sentence of block.sentences || []) {
        const t = sentence.translations?.[0] || sentence;
        if ((t.idiomatic || t.literal || "").trim()) count += 1;
      }
    }
  }
  return count;
}

function main() {
  const [book, chapter] = process.argv.slice(2);
  if (!book || !chapter) {
    console.error("Usage: node scripts/rescrape-preserve-translations.mjs <book> <chapter>");
    process.exit(1);
  }

  const chapterFile = `data/${book}/${chapter}.json`;
  if (!fs.existsSync(chapterFile)) {
    console.error(`Chapter file not found: ${chapterFile}`);
    process.exit(1);
  }

  const backup = fs.readFileSync(chapterFile, "utf8");
  const oldChapter = JSON.parse(backup);

  const scrape = spawnSync("node", ["scrape.js", book, chapter, "--glossary", "data/glossary.json"], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (scrape.status !== 0) {
    fs.writeFileSync(chapterFile, backup, "utf8");
    process.stderr.write(scrape.stderr || "");
    process.exit(scrape.status || 1);
  }

  const newChapter = JSON.parse(fs.readFileSync(chapterFile, "utf8"));
  const transferred = preserveTranslations(oldChapter, newChapter);
  newChapter.meta.translatedCount = countTranslated(newChapter);
  fs.writeFileSync(chapterFile, `${JSON.stringify(newChapter, null, 2)}\n`, "utf8");

  console.log(JSON.stringify({
    book,
    chapter,
    transferred,
    sentenceCount: newChapter?.meta?.sentenceCount ?? null,
    translatedCount: newChapter?.meta?.translatedCount ?? null,
  }, null, 2));
}

main();
