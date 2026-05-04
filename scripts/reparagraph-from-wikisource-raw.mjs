#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const BOOKS = new Set(["qingshigao", "zizhitongjian"]);
const SENT_END = new Set(["。", "！", "？", "；", "〈", "〉", "(", ")", "（", "）"]);

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
  return (s || "").replace(/\s+/g, "").trim();
}

function stripWikiMarkup(line) {
  let s = line;
  s = s.replace(/{{[^{}]*}}/g, "");
  s = s.replace(/\[\[([^|\]]*\|)?([^\]]+)\]\]/g, "$2");
  s = s.replace(/'''?/g, "");
  return s.trim();
}

function extractParagraphsFromRaw(raw) {
  const lines = raw.split(/\r?\n/);
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

function fetchRaw(url) {
  const r = spawnSync("curl", ["-k", "-s", url], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`curl failed: ${url}`);
  return r.stdout || "";
}

function flattenSentenceObjects(data) {
  const flat = [];
  for (const block of data.content || []) {
    for (const s of block.sentences || []) flat.push(s);
  }
  return flat;
}

function main() {
  const report = { fixed: [], failed: [] };

  for (const book of BOOKS) {
    const dir = path.join(ROOT, "data", book);
    if (!fs.existsSync(dir)) continue;
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

      const paras = extractParagraphsFromRaw(raw);
      const srcSentences = paras.flatMap((p) => splitSentences(p).map(normalizeText)).filter(Boolean);
      const flat = flattenSentenceObjects(data);
      const curSentences = flat.map((s) => normalizeText(s?.zh || "")).filter(Boolean);

      if (paras.length <= 1) {
        report.failed.push({ chapter: ref, reason: "source-has-no-paragraph-breaks" });
        continue;
      }

      if (srcSentences.length !== curSentences.length) {
        report.failed.push({
          chapter: ref,
          reason: `sentence-count-mismatch source=${srcSentences.length} current=${curSentences.length}`,
        });
        continue;
      }

      let mismatch = -1;
      for (let i = 0; i < srcSentences.length; i += 1) {
        if (srcSentences[i] !== curSentences[i]) {
          mismatch = i;
          break;
        }
      }
      if (mismatch !== -1) {
        report.failed.push({ chapter: ref, reason: `sentence-text-mismatch at index ${mismatch}` });
        continue;
      }

      const rebuilt = [];
      let idx = 0;
      for (const p of paras) {
        const len = splitSentences(p).map(normalizeText).filter(Boolean).length;
        if (len === 0) continue;
        rebuilt.push({
          type: "paragraph",
          sentences: flat.slice(idx, idx + len),
          translations: [],
        });
        idx += len;
      }

      if (idx !== flat.length || rebuilt.length <= 1) {
        report.failed.push({ chapter: ref, reason: "rebuild-length-check-failed" });
        continue;
      }

      data.content = rebuilt;
      fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
      report.fixed.push({ chapter: ref, paragraphs: rebuilt.length, sentences: flat.length });
    }
  }

  const outPath = path.join(ROOT, "translations", "wikisource_reparagraph_report.json");
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ fixed: report.fixed.length, failed: report.failed.length, report: outPath }, null, 2));
}

main();
