#!/usr/bin/env node
/**
 * Apply Hanshu 088 translations from ./h088_data/*.mjs (default export: Record<id, [literal, idiomatic]>).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chapterPath = path.join(process.cwd(), "data/hanshu/088.json");

const chunkFiles = ["part1.mjs", "part2.mjs", "part3.mjs", "part4.mjs"];
const merged = {};
for (const f of chunkFiles) {
  const mod = await import(path.join(__dirname, "h088_data", f));
  Object.assign(merged, mod.default);
}

const data = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
let applied = 0;
for (const block of data.content) {
  if (block.type !== "paragraph") continue;
  for (const sentence of block.sentences || []) {
    const id = sentence.id;
    const pair = merged[id];
    if (!pair) continue;
    const [literal, idiomatic] = pair;
    if (!sentence.translations || sentence.translations.length === 0) {
      sentence.translations = [{}];
    }
    sentence.translations[0] = {
      lang: "en",
      translator: "Garrett M. Petersen (2026)",
      literal,
      idiomatic,
      model: "Composer 2",
    };
    applied++;
  }
}

const expected = Object.keys(merged).length;
if (applied !== expected) {
  console.error(`Applied ${applied} but data has ${expected} keys`);
  process.exit(1);
}

data.meta.translatedCount = 301;
data.meta.translators = ["Garrett M. Petersen (2026)"];

fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2) + "\n");
console.log("Applied", applied, "sentences to", chapterPath);
