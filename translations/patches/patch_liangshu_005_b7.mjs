#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'He falsely inflated outside reinforcements; the affair differed from rallying troops to rescue the throne; in taking the field, he did not even travel a hundred overnight stops.',
    'He trumpeted outside aid that was not real; his campaign was not true rescue of the throne; on the march he did not even go a hundred stops.',
  ],
  s0602: [
    'Only afterward did he destroy the great villain and secure altars and state; grasping the map facing south, he inaugurated restoration—this too was Shizu\'s heroic talent and brilliant strategy, continuing this precious mandate.',
    'Only later did he destroy the great villain and settle the realm; turning south to rule, he opened a restoration—a credit to Shizu\'s ability and strategy and to the mandate he inherited.',
  ],
  s0603: [
    'But by nature suspicious, making no distinction between distant and near, inept in governing subordinates, treading ice yet unafraid—therefore the Phoenix Tower dawn-watching achievement lacked fire\'s inner shining beauty.',
    'Yet he was suspicious by nature, alike toward kin near and far, inept with subordinates, reckless on thin ice—so the merit of watching dawn at the Phoenix Tower showed fire without inner light.',
  ],
  s0604: [
    'Given Shizu\'s divine wisdom and extraordinary penetration, his attention to governance and the Way, not cowed by heterodox doctrines—moving the imperial procession to Jinling with powerful enemies on the left, what could he accomplish?',
    'For all Shizu\'s brilliance and care for government, his refusal to heed bad counsel, and the move of the court to Jinling with strong foes beside him—what could he achieve?',
  ],
  s0605: [
    'Thus Heaven had not yet repented of disaster; ruin overturned this life—alas!',
    'So Heaven had not yet turned from calamity, and ruin engulfed his reign—alas!',
  ],
  s0606: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0607: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b7.mjs <translation.json>'
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
