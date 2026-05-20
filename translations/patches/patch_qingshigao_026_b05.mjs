#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Tashkent, west of the capital by forty-seven degrees forty-three minutes;',
    'Tashkent lies forty-seven degrees forty-three minutes west of the capital;',
  ],
  s0402: [
    'Wasi, west of the capital by twelve degrees fifty-eight minutes;',
    'Wasi lies twelve degrees fifty-eight minutes west of the capital;',
  ],
  s0403: [
    'Muping, west of the capital by thirteen degrees thirty-seven minutes;',
    'Muping lies thirteen degrees thirty-seven minutes west of the capital;',
  ],
  s0404: [
    'Wakhan, west of the capital by thirteen degrees fifty-one minutes;',
    'Wakhan lies thirteen degrees fifty-one minutes west of the capital;',
  ],
  s0405: [
    'Sanzagou, west of the capital by thirteen degrees fifty-six minutes;',
    'Sanzagou lies thirteen degrees fifty-six minutes west of the capital;',
  ],
  s0406: [
    'Lesser Jinchuan, Meinuo, west of the capital by fourteen degrees seven minutes;',
    'Lesser Jinchuan at Meinuo lies fourteen degrees seven minutes west of the capital;',
  ],
  s0407: [
    'Bulake, west of the capital by fourteen degrees twenty-two minutes;',
    'Bulake lies fourteen degrees twenty-two minutes west of the capital;',
  ],
  s0408: [
    'Jinchuan, Galaiyi, west of the capital by fourteen degrees twenty-nine minutes;',
    'Jinchuan at Galaiyi lies fourteen degrees twenty-nine minutes west of the capital;',
  ],
  s0409: [
    'Dangba, west of the capital by fourteen degrees twenty-nine minutes;',
    'Dangba lies fourteen degrees twenty-nine minutes west of the capital;',
  ],
  s0410: [
    'Jinchuan, Lewuwei, west of the capital by fourteen degrees thirty-four minutes;',
    'Jinchuan at Lewuwei lies fourteen degrees thirty-four minutes west of the capital;',
  ],
  s0411: [
    'Bawang, west of the capital by fourteen degrees thirty-four minutes;',
    'Bawang lies fourteen degrees thirty-four minutes west of the capital;',
  ],
  s0412: [
    'Chosjiabu, west of the capital by fourteen degrees forty-four minutes;',
    'Chosjiabu lies fourteen degrees forty-four minutes west of the capital;',
  ],
  s0413: [
    'Mingzheng, west of the capital by fourteen degrees forty-nine minutes;',
    'Mingzheng lies fourteen degrees forty-nine minutes west of the capital;',
  ],
  s0414: [
    'Geshizhaizan, west of the capital by fourteen degrees fifty-one minutes.',
    'Geshizhaizan lies fourteen degrees fifty-one minutes west of the capital.',
  ],
  s0415: [
    'Right: additions under the Qianlong Directorate of Astronomy.',
    'The above were additions of the Qianlong Board of Astronomy.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_026_b05.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
