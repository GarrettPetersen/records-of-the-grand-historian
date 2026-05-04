#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const BOOKS = ["qingshigao", "zizhitongjian"];
const ENDINGS = new Set(["。", "！", "？", "；", "〈", "〉", "(", ")", "（", "）"]);

function normalize(s) {
  return (s || "").replace(/\s+/g, "").trim();
}

function splitSentences(text) {
  const out = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (ENDINGS.has(ch)) {
      const s = normalize(buf);
      if (s) out.push(s);
      buf = "";
    }
  }
  const tail = normalize(buf);
  if (tail) out.push(tail);
  return out;
}

function stripMarkup(text) {
  let s = text;
  // Remove templates repeatedly.
  for (let i = 0; i < 5; i += 1) {
    const next = s.replace(/{{[^{}]*}}/g, "");
    if (next === s) break;
    s = next;
  }
  s = s.replace(/\[\[([^|\]]*\|)?([^\]]+)\]\]/g, "$2");
  s = s.replace(/'''?/g, "");
  return s;
}

function parseRawParagraphs(raw) {
  const lines = raw.split(/\r?\n/);
  const paras = [];
  let buf = [];

  const flush = () => {
    if (buf.length === 0) return;
    const merged = stripMarkup(buf.join("")).trim();
    if (merged) paras.push(merged);
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

function fetchRaw(url) {
  const r = spawnSync("curl", ["-k", "-s", url], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`curl-failed status=${r.status}`);
  return r.stdout || "";
}

function flatSentenceCount(data) {
  let n = 0;
  for (const b of data.content || []) n += (b.sentences || []).length;
  return n;
}

function main() {
  const report = { fixed: [], failed: [] };

  for (const book of BOOKS) {
    const dir = path.join(ROOT, "data", book);
    for (const file of fs.readdirSync(dir).filter((f) => /^\d{3}\.json$/.test(f)).sort()) {
      const filePath = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!Array.isArray(data.content) || data.content.length !== 1 || data.content[0]?.type !== "paragraph") continue;

      const ref = `${book}/${file.replace(".json", "")}`;
      const url = data?.meta?.url || "";
      if (!url.includes("wikisource.org")) {
        report.failed.push({ chapter: ref, reason: "non-wikisource-url" });
        continue;
      }

      let raw = "";
      try {
        raw = fetchRaw(url);
      } catch (err) {
        report.failed.push({ chapter: ref, reason: `fetch-failed ${err.message}` });
        continue;
      }

      const paras = parseRawParagraphs(raw);
      const sentenceBuckets = paras
        .map((p) => splitSentences(p))
        .filter((arr) => arr.length > 0);

      const newSentenceCount = sentenceBuckets.reduce((a, b) => a + b.length, 0);
      const oldSentenceCount = flatSentenceCount(data);

      if (sentenceBuckets.length <= 1) {
        report.failed.push({ chapter: ref, reason: "source-has-no-paragraph-breaks" });
        continue;
      }
      if (newSentenceCount < Math.max(10, Math.floor(oldSentenceCount * 0.5))) {
        report.failed.push({
          chapter: ref,
          reason: `sanity-check-failed old=${oldSentenceCount} new=${newSentenceCount}`,
        });
        continue;
      }

      let idCounter = 1;
      const content = sentenceBuckets.map((bucket) => ({
        type: "paragraph",
        sentences: bucket.map((zh) => ({
          id: `s${String(idCounter++).padStart(4, "0")}`,
          zh,
          translations: [],
        })),
        translations: [],
      }));

      data.content = content;
      data.meta.sentenceCount = newSentenceCount;
      data.meta.translatedCount = 0;
      data.meta.scrapedAt = new Date().toISOString();

      fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
      report.fixed.push({
        chapter: ref,
        paragraphs: content.length,
        oldSentenceCount,
        newSentenceCount,
      });
    }
  }

  const outPath = path.join(ROOT, "translations", "wikisource_rescrape_report.json");
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ fixed: report.fixed.length, failed: report.failed.length, report: outPath }, null, 2));
}

main();
