#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Writing stirs one\'s nature to spirit and lifts the breast alone; easy to overlook equals, it always breeds display.',
    'Writing stirs nature to spirit and lifts the breast alone; overlooking equals, it always breeds display.',
  ],
  s0702: [
    'Greatly they insult lords and kings; in small things they scorn their circle;',
    'Greatly they insult lords and kings; in small things they scorn their circle;',
  ],
  s0703: [
    'quick resentment and factional strife begin here.',
    'quick resentment and factional strife begin here.',
  ],
  s0704: [
    'Qu Yuan and Jia Yi were driven off; Huan Tan and Feng Yan were cast out—was it only one age?',
    'Qu Yuan and Jia Yi were driven off; Huan Tan and Feng Yan were cast out—was it only one age?',
  ],
  s0705: [
    'It is the disaster of relying on talent.',
    'It is the disaster of relying on talent.',
  ],
  s0706: [
    'These gentlemen met a civilizing age and spread ornate phrasing; they had no depression or woes and did not suffer former ills—beautiful indeed.',
    'These gentlemen met a civilizing age and spread ornate phrasing; they had no depression and did not suffer former ills—beautiful indeed.',
  ],
  s0707: [
    'Liu\'s discourse is a disciple of fate.',
    'Liu\'s discourse is a disciple of fate.',
  ],
  s0708: [
    'Fate is what sages rarely discuss; to insist on it from their words is not what the classics mean.',
    'Fate is what sages rarely discuss; to insist on it from their words is not what the classics mean.',
  ],
  s0709: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker in the source text.',
  ],
  s0710: [
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
    'The full text has been collated against the Zhonghua Shuju edition of the Book of Liang, May 1973.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b8.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
