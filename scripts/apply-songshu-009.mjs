#!/usr/bin/env node
import fs from "fs";
import { part1 } from "./songshu-009-translations-part1.mjs";

const parts = [part1];
try {
  const { part2 } = await import("./songshu-009-translations-part2.mjs");
  parts.push(part2);
} catch {
  /* optional */
}
try {
  const { part3 } = await import("./songshu-009-translations-part3.mjs");
  parts.push(part3);
} catch {
  /* optional */
}

const all = Object.assign({}, ...parts);
const path = "translations/current_translation_songshu.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

let applied = 0;
for (const s of data.sentences) {
  const t = all[s.id];
  if (!t) {
    console.error(`Missing translation for ${s.id}`);
    process.exit(1);
  }
  s.literal = t.literal;
  s.idiomatic = t.idiomatic;
  applied++;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
console.log(`Applied ${applied} translations to ${path}`);
console.log(`Total keys available: ${Object.keys(all).length}`);
