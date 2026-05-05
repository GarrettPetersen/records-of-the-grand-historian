#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const BOOKS = new Set(["qingshigao", "zizhitongjian"]);
const SENT_END = new Set(["。", "！", "？", "；", "〈", "〉", "(", ")", "（", "）"]);
const BR_TAG_RE = /<br\s*\/?>/gi;
const BR_TAG_TEST_RE = /<br\s*\/?>/i;

function splitSentences(text) {
  const out = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (SENT_END.has(ch)) {
      const s = buf.trim();
      if (s) out.push(s);
      buf = "";
    }
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}

function normalizeText(s) {
  return (s || "").replace(BR_TAG_RE, "").replace(/\s+/g, "").trim();
}

function stripWikiMarkup(line) {
  let s = line;
  s = s.replace(/{{[^{}]*}}/g, "");
  s = s.replace(/\[\[([^|\]]*\|)?([^\]]+)\]\]/g, "$2");
  s = s.replace(/'''?/g, "");
  return s.trim();
}

function extractParagraphsFromRaw(raw) {
  const lines = raw.replace(BR_TAG_RE, "\n\n").split(/\r?\n/);
  const paras = [];
  let buf = [];

  const flush = () => {
    if (buf.length === 0) return;
    const text = stripWikiMarkup(buf.join(""));
    if (text) paras.push(text);
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

function flattenSentenceObjects(data) {
  const out = [];
  for (const block of data.content || []) {
    for (const sentence of block.sentences || []) out.push(sentence);
  }
  return out;
}

function hasMeaningfulTranslations(sentence) {
  return Array.isArray(sentence?.translations) && sentence.translations.some((t) =>
    Object.values(t || {}).some((v) => typeof v === "string" && v.trim())
  );
}

function copySentenceTranslations(oldSentence, newSentence) {
  if (!hasMeaningfulTranslations(oldSentence)) return false;
  newSentence.translations = JSON.parse(JSON.stringify(oldSentence.translations));
  return true;
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

function fetchRaw(url) {
  const r = spawnSync("curl", ["-k", "-s", url], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`curl failed: ${url}`);
  return r.stdout || "";
}

function main() {
  const report = { fixed: [], failed: [] };

  for (const book of BOOKS) {
    const dir = path.join(ROOT, "data", book);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => /^\d{3}\.json$/.test(f)).sort()) {
      const filePath = path.join(dir, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      if (!Array.isArray(data.content)) continue;

      const ref = `${book}/${file.replace(".json", "")}`;
      const url = data?.meta?.url || "";
      if (!url.includes("wikisource.org")) {
        report.failed.push({ chapter: ref, reason: "non-wikisource-url" });
        continue;
      }

      const flat = flattenSentenceObjects(data);
      if (!flat.some((sentence) => BR_TAG_TEST_RE.test(sentence?.zh || ""))) {
        continue;
      }

      let raw = "";
      try {
        raw = fetchRaw(url);
      } catch (err) {
        report.failed.push({ chapter: ref, reason: `fetch-failed ${err.message}` });
        continue;
      }

      const paras = extractParagraphsFromRaw(raw);
      const srcSentences = paras.flatMap((p) => splitSentences(p).map(normalizeText)).filter(Boolean);
      const oldFlat = flat;

      if (paras.length <= 1) {
        report.failed.push({ chapter: ref, reason: "source-has-no-paragraph-breaks" });
        continue;
      }

      const newFlat = [];
      const rebuilt = [];
      for (const p of paras) {
        const sentences = splitSentences(p)
          .map((zh) => zh.trim())
          .filter(Boolean)
          .map((zh) => ({
            id: `s${String(newFlat.length + 1).padStart(4, "0")}`,
            zh,
            translations: [{ lang: "en", literal: "", idiomatic: "", translator: "" }],
          }));
        if (sentences.length === 0) continue;
        newFlat.push(...sentences);
        rebuilt.push({
          type: "paragraph",
          sentences,
          translations: [],
        });
      }

      if (rebuilt.length <= 1 || newFlat.length === 0) {
        report.failed.push({ chapter: ref, reason: "rebuild-length-check-failed" });
        continue;
      }

      let transferred = 0;
      const matches = lcsMatches(
        oldFlat.map((s) => normalizeText(s?.zh || "")),
        newFlat.map((s) => normalizeText(s?.zh || ""))
      );
      for (const [oldPos, newPos] of matches) {
        if (copySentenceTranslations(oldFlat[oldPos], newFlat[newPos])) transferred += 1;
      }

      let translatedCount = 0;
      for (const sentence of newFlat) {
        if (hasMeaningfulTranslations(sentence)) translatedCount += 1;
      }

      data.content = rebuilt;
      data.meta.sentenceCount = newFlat.length;
      data.meta.translatedCount = translatedCount;
      data.meta.scrapedAt = new Date().toISOString();
      for (const key of ["reviewed", "reviewedAt", "reviewedBy"]) {
        if (Object.prototype.hasOwnProperty.call(data.meta || {}, key)) {
          data.meta[key] = data.meta[key];
        }
      }

      fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
      report.fixed.push({ chapter: ref, paragraphs: rebuilt.length, sentences: newFlat.length, transferred });
    }
  }

  const outPath = path.join(ROOT, "translations", "wikisource_reparagraph_report.json");
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ fixed: report.fixed.length, failed: report.failed.length, report: outPath }, null, 2));
}

main();
