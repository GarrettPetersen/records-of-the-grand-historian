#!/usr/bin/env node
import fs from "fs";
import { part1 } from "./songshu-007-translations-part1.mjs";
import { part2 } from "./songshu-007-translations-part2.mjs";

const all = { ...part1, ...part2 };
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
console.log(`Total keys in bundle: ${Object.keys(all).length}`);
