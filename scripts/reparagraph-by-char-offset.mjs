#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";

const REMAINING_LIST = "/private/tmp/single_final_after_update.txt";

function normalize(s) {
  return (s || "").replace(/\s+/g, "").trim();
}

function loadRefs() {
  return fs
    .readFileSync(REMAINING_LIST, "utf8")
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split("\t")[0]);
}

function flattenSentenceObjects(chapter) {
  const out = [];
  for (const block of chapter.content || []) {
    for (const s of block.sentences || []) out.push(s);
  }
  return out;
}

function runScrapeGetBlocks(book, chapter, chapterPath) {
  const backup = fs.readFileSync(chapterPath, "utf8");
  const r = spawnSync("node", ["scrape.js", book, chapter], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (r.status !== 0) {
    fs.writeFileSync(chapterPath, backup, "utf8");
    return { ok: false, reason: "scrape-failed" };
  }
  const scraped = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
  fs.writeFileSync(chapterPath, backup, "utf8");
  return { ok: true, blocks: scraped.content || [] };
}

function extractWikiParagraphs(raw) {
  const lines = raw.split(/\r?\n/);
  const paras = [];
  let buf = [];
  const flush = () => {
    if (!buf.length) return;
    let s = buf.join("");
    for (let i = 0; i < 5; i += 1) {
      const next = s.replace(/{{[^{}]*}}/g, "");
      if (next === s) break;
      s = next;
    }
    s = s.replace(/\[\[([^|\]]*\|)?([^\]]+)\]\]/g, "$2");
    s = s.replace(/'''?/g, "");
    s = normalize(s);
    if (s) paras.push(s);
    buf = [];
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith("{{") || t.startsWith("}}") || t.startsWith("|")) continue;
    if (/^==.*==$/.test(t)) continue;
    if (t.startsWith("[[Category:") || t.startsWith("[[分類:")) continue;
    buf.push(t);
  }
  flush();
  return paras;
}

function curl(url) {
  const r = spawnSync("curl", ["-L", "-k", "-s", url], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  return { ok: r.status === 0, text: r.stdout || "" };
}

function sourceParagraphsForChapter(book, chapter, chapterPath, data) {
  if (data.meta?.url?.includes("wikisource.org")) {
    const res = curl(data.meta.url);
    if (!res.ok) return { ok: false, reason: "wikisource-fetch-failed" };
    const paras = extractWikiParagraphs(res.text);
    return { ok: true, paras, source: "wikisource" };
  }
  // For ChineseNotes-backed chapters, use scraper's parsed blocks as source of paragraph boundaries.
  const scraped = runScrapeGetBlocks(book, chapter, chapterPath);
  if (!scraped.ok) return { ok: false, reason: scraped.reason };
  const paras = (scraped.blocks || [])
    .filter((b) => b.type === "paragraph")
    .map((b) => normalize((b.sentences || []).map((s) => s.zh || "").join("")));
  return { ok: true, paras, source: "scrape-js" };
}

function reparagraphByCharOffset(flatSentences, sourceParas) {
  const sentenceTexts = flatSentences.map((s) => normalize(s.zh));
  const chapterText = sentenceTexts.join("");
  if (!chapterText) return { ok: false, reason: "empty-chapter-text" };

  const cleanedParas = sourceParas.map(normalize).filter(Boolean);
  if (cleanedParas.length <= 1) return { ok: false, reason: "source-has-no-paragraph-breaks" };

  const ends = [];
  let cursor = 0;
  for (const p of cleanedParas) {
    const idx = chapterText.indexOf(p, cursor);
    if (idx < 0) return { ok: false, reason: "paragraph-substring-not-found" };
    const end = idx + p.length;
    ends.push(end);
    cursor = end;
  }

  const sentenceEnds = [];
  let acc = 0;
  for (const s of sentenceTexts) {
    acc += s.length;
    sentenceEnds.push(acc);
  }

  const buckets = [];
  let sentStart = 0;
  for (const pEnd of ends) {
    let sentEnd = sentStart;
    while (sentEnd < sentenceEnds.length && sentenceEnds[sentEnd] <= pEnd) sentEnd += 1;
    if (sentEnd <= sentStart) return { ok: false, reason: "empty-bucket-after-mapping" };
    buckets.push(flatSentences.slice(sentStart, sentEnd));
    sentStart = sentEnd;
  }
  if (sentStart < flatSentences.length) {
    if (buckets.length === 0) return { ok: false, reason: "no-buckets" };
    buckets[buckets.length - 1] = buckets[buckets.length - 1].concat(flatSentences.slice(sentStart));
  }
  if (buckets.length <= 1) return { ok: false, reason: "still-single-paragraph" };
  return { ok: true, buckets };
}

function main() {
  const refs = loadRefs();
  const report = { fixed: [], failed: [] };

  for (const ref of refs) {
    const [book, chapter] = ref.split("/");
    const chapterPath = `data/${book}/${chapter}.json`;
    const data = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
    const flat = flattenSentenceObjects(data);

    const src = sourceParagraphsForChapter(book, chapter, chapterPath, data);
    if (!src.ok) {
      report.failed.push({ chapter: ref, reason: src.reason });
      continue;
    }
    const mapped = reparagraphByCharOffset(flat, src.paras);
    if (!mapped.ok) {
      report.failed.push({ chapter: ref, reason: mapped.reason, source: src.source });
      continue;
    }

    data.content = mapped.buckets.map((sentences) => ({
      type: "paragraph",
      sentences,
      translations: [],
    }));
    fs.writeFileSync(chapterPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    report.fixed.push({ chapter: ref, source: src.source, paragraphs: data.content.length });
  }

  fs.writeFileSync("translations/reparagraph_char_offset_report.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ fixed: report.fixed.length, failed: report.failed.length }, null, 2));
}

main();
