#!/usr/bin/env node
/** Fix misaligned historian appraisal / eulogy (s0801–s0827) in ch.013 after batch9 id offset. */
import { readFileSync, writeFileSync } from 'fs';

const path = 'data/jiutangshu/013.json';
const batchSrc = readFileSync('scripts/_apply-ch013-batch9.mjs', 'utf8');
const tMatch = batchSrc.match(/const T = (\{[\s\S]*?\n\});/);
if (!tMatch) throw new Error('Could not parse T from batch9');
// eslint-disable-next-line no-eval
const T = eval(`(${tMatch[1]})`);

const shift = (fromId, toId) => {
  const pair = T[fromId];
  if (!pair) throw new Error(`Missing ${fromId}`);
  return { literal: pair.literal, idiomatic: pair.idiomatic };
};

const fixes = {
  s0801: shift('s0804', 's0801'),
  s0802: shift('s0805', 's0802'),
  s0803: shift('s0806', 's0803'),
  s0804: shift('s0807', 's0804'),
  s0805: shift('s0808', 's0805'),
  s0806: shift('s0809', 's0806'),
  s0807: shift('s0810', 's0807'),
  s0808: shift('s0811', 's0808'),
  s0809: shift('s0812', 's0809'),
  s0810: shift('s0813', 's0810'),
  s0811: shift('s0814', 's0811'),
  s0812: shift('s0815', 's0812'),
  s0813: shift('s0816', 's0813'),
  s0814: shift('s0817', 's0814'),
  s0815: shift('s0818', 's0815'),
  s0816: shift('s0819', 's0816'),
  s0817: shift('s0820', 's0817'),
  s0818: shift('s0821', 's0818'),
  s0819: shift('s0822', 's0819'),
  s0820: shift('s0823', 's0820'),
  s0821: shift('s0824', 's0821'),
  s0822: shift('s0825', 's0822'),
  s0823: shift('s0826', 's0823'),
  s0824: {
    literal: '【Eulogy】 Sagacious and bright, cultured and thoughtful — only the wise become sage.',
    idiomatic: '【Eulogy】 Bright and literate, fit for sagehood —',
  },
  s0825: {
    literal: 'Protecting the wicked and harming the good, hearing and deciding without order.',
    idiomatic: 'yet he shielded villains, wounded the good, and judged without justice.',
  },
  s0826: {
    literal: 'He held the throne for thirty-nine years, and by chance met Heaven\'s favor.',
    idiomatic: 'Thirty-nine years on the throne owed more to luck than to rule;',
  },
  s0827: {
    literal: 'On the days of granted feasts, he merely prided himself on verses.',
    idiomatic: 'at his banquets he preened over poems alone.',
  },
};

const data = JSON.parse(readFileSync(path, 'utf8'));
let n = 0;
for (const block of data.content) {
  for (const s of block.sentences || []) {
    const fix = fixes[s.id];
    if (!fix) continue;
    if (fix.literal === fix.idiomatic) throw new Error(`${s.id}: literal === idiomatic`);
    s.translations[0].literal = fix.literal;
    s.translations[0].idiomatic = fix.idiomatic;
    n++;
  }
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Fixed', n, 'sentences in', path);
