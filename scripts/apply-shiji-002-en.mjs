/**
 * Merges sentence-level English from data/shiji/002-translations.json into data/shiji/002.json,
 * rebuilds paragraph block translations, and normalizes translator/model metadata.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const chapterPath = path.join(root, 'data/shiji/002.json');
const mapPath = path.join(root, 'scripts/shiji-002-translations.json');

const TRANSLATOR = 'Garrett M. Petersen (2026)';
const MODEL = 'Composer 2';

const T = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(chapterPath, 'utf8'));

function joinBlock(parts) {
  return parts.filter(Boolean).join(' ');
}

for (const block of data.content) {
  if (block.type !== 'paragraph') continue;
  const sentences = block.sentences || [];
  const idiomParts = [];
  const litParts = [];
  for (const s of sentences) {
    const pair = T[s.id];
    if (!pair) throw new Error(`Missing translation for ${s.id}`);
    const { literal, idiomatic } = pair;
    if (!literal || !idiomatic) throw new Error(`Incomplete entry for ${s.id}`);
    s.translations = [
      {
        lang: 'en',
        translator: TRANSLATOR,
        literal,
        idiomatic,
        model: MODEL,
      },
    ];
    idiomParts.push(idiomatic);
    litParts.push(literal);
  }
  block.translations = [
    {
      lang: 'en',
      translator: TRANSLATOR,
      literal: joinBlock(litParts),
      idiomatic: joinBlock(idiomParts),
      model: MODEL,
    },
  ];
}

fs.writeFileSync(chapterPath, JSON.stringify(data, null, 2) + '\n');
console.log('Updated', chapterPath, 'keys', Object.keys(T).length);
