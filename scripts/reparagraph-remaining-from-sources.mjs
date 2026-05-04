#!/usr/bin/env node

import fs from "node:fs";
import { spawnSync } from "node:child_process";

const REMAINING_LIST = "/private/tmp/single_final_after_update.txt";
const SENT_END = new Set(["。", "！", "？", "；", "〈", "〉", "(", ")", "（", "）"]);

function normalize(s) {
  return (s || "").replace(/\s+/g, "").trim();
}

function splitSentences(text) {
  const out = [];
  let buf = "";
  for (const ch of text) {
    buf += ch;
    if (SENT_END.has(ch)) {
      const s = normalize(buf);
      if (s) out.push(s);
      buf = "";
    }
  }
  const tail = normalize(buf);
  if (tail) out.push(tail);
  return out;
}

function curl(url) {
  const r = spawnSync("curl", ["-L", "-k", "-s", url], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  return { ok: r.status === 0, text: r.stdout || "" };
}

function extractParagraphsFromWikisourceRaw(raw) {
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
    s = s.trim();
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

function extractParagraphsFromChineseNotesHtml(html) {
  // Lightweight extraction by paragraph tags first.
  const paras = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const t = m[1]
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .trim();
    if (t) paras.push(t);
  }
  return paras;
}

function flattenSentenceObjects(chapter) {
  const out = [];
  for (const block of chapter.content || []) {
    for (const s of block.sentences || []) out.push(s);
  }
  return out;
}

function buildBucketsByExactAlignment(flatSentenceObjects, sourceParagraphs) {
  const expected = flatSentenceObjects.map((s) => normalize(s.zh));
  const srcBuckets = sourceParagraphs
    .map((p) => splitSentences(p))
    .map((arr) => arr.map(normalize).filter(Boolean))
    .filter((arr) => arr.length > 0);

  const srcFlat = srcBuckets.flat();
  if (srcFlat.length !== expected.length) {
    return { ok: false, reason: `sentence-count-mismatch source=${srcFlat.length} current=${expected.length}` };
  }
  for (let i = 0; i < expected.length; i += 1) {
    if (expected[i] !== srcFlat[i]) {
      return { ok: false, reason: `sentence-text-mismatch at ${i}` };
    }
  }

  const rebuilt = [];
  let idx = 0;
  for (const bucket of srcBuckets) {
    rebuilt.push({
      type: "paragraph",
      sentences: flatSentenceObjects.slice(idx, idx + bucket.length),
      translations: [],
    });
    idx += bucket.length;
  }
  if (rebuilt.length <= 1) {
    return { ok: false, reason: "source-has-no-paragraph-breaks" };
  }
  return { ok: true, rebuilt };
}

function readRemainingRefs() {
  return fs
    .readFileSync(REMAINING_LIST, "utf8")
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => line.split("\t")[0]);
}

function main() {
  const refs = readRemainingRefs();
  const report = { fixed: [], failed: [] };

  for (const ref of refs) {
    const [book, chapter] = ref.split("/");
    const filePath = `data/${book}/${chapter}.json`;
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const flat = flattenSentenceObjects(data);

    // Preserve currently translated high-value chapters unless exact alignment succeeds.
    const hasGarrett = flat.some((s) =>
      (s.translations || []).some((t) => (t.translator || "").includes("Garrett"))
    );

    let sourceParas = null;
    let sourceName = null;

    if (data.meta?.url?.includes("wikisource.org")) {
      const res = curl(data.meta.url);
      if (!res.ok) {
        report.failed.push({ chapter: ref, reason: "fetch-failed", source: data.meta.url });
        continue;
      }
      sourceParas = extractParagraphsFromWikisourceRaw(res.text);
      sourceName = "wikisource";
    } else if (data.meta?.url?.includes("chinesenotes.com")) {
      const res = curl(data.meta.url);
      if (!res.ok) {
        report.failed.push({ chapter: ref, reason: "fetch-failed", source: data.meta.url });
        continue;
      }
      sourceParas = extractParagraphsFromChineseNotesHtml(res.text);
      sourceName = "chinesenotes";
    } else {
      report.failed.push({ chapter: ref, reason: "unsupported-source-url", source: data.meta?.url || null });
      continue;
    }

    const aligned = buildBucketsByExactAlignment(flat, sourceParas);
    if (!aligned.ok) {
      report.failed.push({ chapter: ref, reason: aligned.reason, source: sourceName, protected: hasGarrett });
      continue;
    }

    data.content = aligned.rebuilt;
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    report.fixed.push({ chapter: ref, source: sourceName, paragraphs: aligned.rebuilt.length });
  }

  fs.writeFileSync("translations/remaining_reparagraph_report.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ fixed: report.fixed.length, failed: report.failed.length }, null, 2));
}

main();
