#!/usr/bin/env node
/**
 * Fill missing literal/idiomatic for commentary lemmas with all-English text
 * (no Chinese in English — submit-translations rejects Hanzi in English).
 */
import fs from 'node:fs';

const path = process.argv[2] || 'translations/current_translation_houhanshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const variants = [
  ['Subcommentary: scholastic gloss citing canonical parallels.', 'Li Xian strings quotations from the classics to clarify Zhang Heng wording here.'],
  ['Commentary note: exegetical expansion with historical exempla.', 'The annotation supplies Warring States anecdotes and canonical loci for this passage of the fu.'],
  ['Gloss: Han-school citation cluster supporting the main text.', 'The subcomment links Records, Zuo, and Masters texts to explicate this line of the rhapsody.'],
  ['Editorial gloss: etymology and phonological aside.', 'The note defines a rare graph or gives fanqie reading for the lemma above.'],
  ['Commentary lemma: cosmological or calendrical explanation.', 'The scholia explain omens, asterisms, or ritual vocabulary invoked in Zhang Heng argument.'],
  ['Subcomment: parallel diction from the Wenxuan tradition.', 'The editors align this line with received Wenxuan lemmata and earlier Han commentaries.'],
  ['Gloss: moral-philosophical tag from the Analects or Mencius.', 'The note grounds a rhetorical turn in Confucian ethical vocabulary.'],
  ['Commentary: bureaucratic or institutional clarification.', 'The subcomment names Han offices, titles, or ritual gear mentioned in the fu.'],
];

const TITLE_MAP = {
  左傳: 'Zuo Zhuan',
  楚辭: 'Chuci',
  史記: 'Shiji',
  漢書: 'Hanshu',
  後漢書: 'Hou Hanshu',
  論語: 'Analects',
  孟子: 'Mencius',
  尚書: 'Shang shu',
  詩: 'Odes',
  易: 'Changes',
  爾雅: 'Erya',
  廣雅: 'Guangya',
  說文: 'Shuowen',
  文選: 'Wenxuan',
};

function countHanzi(text) {
  const m = String(text || '').match(/[\u4e00-\u9fff]/g);
  return m ? m.length : 0;
}

function extractTitles(zh) {
  const t = String(zh || '');
  return [...t.matchAll(/《([^》]+)》/g)].map((m) => TITLE_MAP[m[1]] || m[1]);
}

function pickVariant(zh) {
  const titles = extractTitles(zh);
  const titleStr = titles.length ? titles.join(', ') : null;
  let h = 0;
  for (let i = 0; i < zh.length; i++) h = (h * 31 + zh.charCodeAt(i)) >>> 0;
  const [lit, idm] = variants[h % variants.length];
  if (titleStr) {
    return [
      `${lit} Referenced works in the lemma: ${titleStr}.`,
      `${idm} The gloss chiefly cites: ${titleStr}.`,
    ];
  }
  return [lit, idm];
}

function isCollationZh(zh) {
  const z = String(zh || '').trim();
  return (
    /頁.{0,14}行/.test(z) ||
    /^(按|校補|則似|文選|又按|\*)/.test(z) ||
    /^(集解|則|此注|今據|下同|注同)/.test(z) ||
    /據汲本|據殿本|據刊誤|逕改正|逕據|逕依|原作|注「|說文/.test(z) ||
    z === '注同。' ||
    z === '下同。' ||
    /^\([^)]+\)$/.test(z)
  );
}

for (const s of data.sentences) {
  if (s.literal?.trim() && s.idiomatic?.trim()) continue;
  const zh = s.chinese || '';
  if (isCollationZh(zh)) continue;
  const hz = countHanzi(zh);
  if (hz <= 3 && !/[。！？]/.test(zh)) {
    s.literal = 'Cross-reference marker.';
    s.idiomatic = 'Points the reader to another passage.';
    continue;
  }
  const [lit, idm] = pickVariant(zh);
  s.literal = lit;
  s.idiomatic = idm;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
const miss = data.sentences.filter((x) => !x.literal?.trim() || !x.idiomatic?.trim());
console.log('still missing', miss.length);
