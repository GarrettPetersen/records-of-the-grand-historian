#!/usr/bin/env node
import fs from 'node:fs';

const file = process.argv[2];
const translations = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

for (const s of data.sentences) {
  const t = translations[s.id];
  if (t) {
    s.literal = t.literal;
    s.idiomatic = t.idiomatic;
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${Object.keys(translations).length} translations`);
