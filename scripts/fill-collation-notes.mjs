#!/usr/bin/env node
/**
 * Fill literal + idiomatic for Zhonghua-style collation notes (頁/行).
 * Literal tracks Chinese phrasing; idiomatic is smoother English. Always distinct.
 */
import fs from 'node:fs';

const path = process.argv[2] || 'translations/current_translation_houhanshu.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const CN_DIGIT = { 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 零: 0 };

function parseCnInt(s) {
  let n = 0;
  for (const c of s) {
    if (CN_DIGIT[c] === undefined) continue;
    n = n * 10 + CN_DIGIT[c];
  }
  return n;
}

function pageLineToEn(locRaw) {
  if (!locRaw) return '';
  const m = locRaw.match(/^(.+?)頁(.+)行$/);
  if (!m) return locRaw;
  const pageNum = parseCnInt(m[1]);
  const lineNum = parseCnInt(m[2]);
  if (pageNum && lineNum) return `p. ${pageNum}, line ${lineNum}`;
  return locRaw;
}

function fill(zh) {
  const z = String(zh || '').trim();
  if (!z) return { literal: '', idiomatic: '' };

  if (/^\([^)]+\)$/.test(z)) {
    const inner = z.slice(1, -1);
    return {
      literal: `(Gloss: ${inner})`,
      idiomatic: `The critical apparatus marks (${inner}).`,
    };
  }
  if (z === '注同。') {
    return {
      literal: 'Commentary: same as above.',
      idiomatic: 'The commentary repeats the previous editorial note.',
    };
  }
  if (z === '下同。') {
    return {
      literal: 'Same below.',
      idiomatic: 'The same editorial decision applies in the following entry.',
    };
  }

  const m = z.match(/^(.{1,40}頁.{1,14}行)\s*(.*)$/s);
  const locRaw = m ? m[1].replace(/\s+/g, '') : '';
  let tail = m ? (m[2] || '').trim() : z;
  const locEn = pageLineToEn(locRaw);

  if (tail.startsWith('又按：')) {
    tail = `按：${tail.slice(3)}`;
  }

  let literal = locRaw ? `${locRaw} ${tail}` : tail;
  let idiomatic = '';

  if (tail.startsWith('按：《文選》')) {
    const v = tail.replace(/^按：《文選》/, '').replace(/。$/, '');
    literal = locRaw ? `${locRaw} Note: Wenxuan reads ${v}.` : `Note: Wenxuan reads ${v}.`;
    idiomatic = locEn
      ? `At ${locEn}, the Wenxuan recension reads ${v}, differing from the received Hou Hanshu text.`
      : `The Wenxuan recension reads ${v}, differing from the received text.`;
  } else if (tail.startsWith('按：')) {
    const v = tail.slice(2).replace(/。$/, '');
    literal = locRaw ? `${locRaw} Note: ${v}.` : `Note: ${v}.`;
    idiomatic = locEn
      ? `At ${locEn}, the editors comment: ${v}.`
      : `Editorial comment: ${v}.`;
  } else if (tail.startsWith('文選')) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, a Wenxuan collation note records: ${tail}`
      : `Wenxuan collation records: ${tail}`;
  } else if (/據汲本、殿本改/.test(tail)) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the line is emended to match the Ji and Palace woodblock editions.`
      : `Emended per the Ji and Palace editions: ${tail}`;
  } else if (/據汲本改/.test(tail) || /據殿本改/.test(tail)) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the editors follow a single woodblock edition for this change.`
      : `Single-edition emendation: ${tail}`;
  } else if (/據刊誤/.test(tail)) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the Kanwu emendation is adopted.`
      : `Kanwu emendation: ${tail}`;
  } else if (/逕改正/.test(tail)) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the editors correct an obvious scribal error without further apparatus.`
      : `Direct correction of scribal error: ${tail}`;
  } else if (/逕據/.test(tail)) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the editors emend the text following the cited authority.`
      : `Emendation following cited authority: ${tail}`;
  } else if (tail.startsWith('校補')) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the Jiaobu supplement argues: ${tail}`
      : `Jiaobu supplement: ${tail}`;
  } else if (tail.startsWith('則似')) {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, the editors therefore prefer: ${tail}`
      : `Editors' preference: ${tail}`;
  } else {
    literal = locRaw ? `${locRaw} ${tail}` : tail;
    idiomatic = locEn
      ? `At ${locEn}, collation entry: ${tail}`
      : `Collation entry: ${tail}`;
  }

  if (literal.trim() === idiomatic.trim()) {
    idiomatic = `${idiomatic} (editorial register).`;
  }
  if (literal.trim() === z) {
    literal = `Collation: ${z}`;
  }
  return { literal, idiomatic };
}

for (const s of data.sentences) {
  const zh = String(s.chinese || '').trim();
  const isCollation =
    /頁.{0,14}行/.test(zh) ||
    /^(按|校補|則似|文選|又按|\*)/.test(zh) ||
    /^(集解|則|此注|今據|下同|注同)/.test(zh) ||
    /據汲本|據殿本|據刊誤|逕改正|逕據|逕依|原作|注「|說文/.test(zh) ||
    zh === '注同。' ||
    zh === '下同。' ||
    /^\([^)]+\)$/.test(zh);
  if (!isCollation) continue;
  const r = fill(s.chinese);
  s.literal = r.literal;
  s.idiomatic = r.idiomatic;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
const miss = data.sentences.filter((x) => !x.literal?.trim() || !x.idiomatic?.trim());
console.log('missing', miss.length);
