#!/usr/bin/env node
/** Post-process liaoshi-048 so literal !== idiomatic when zh has >3 hanzi */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { T as t1 } from './liaoshi-048-t/s001-135.mjs';
import { T as t2 } from './liaoshi-048-t/s136-270.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TRANSLATIONS = { ...t1, ...t2 };

const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/liaoshi/048.json'), 'utf8'));
const zhById = {};
for (const p of d.content) for (const s of p.sentences) zhById[s.id] = s.zh;

function hanCount(zh) {
  return (zh.match(/[\u4e00-\u9fff]/g) || []).length;
}

const OVERRIDES = {
  s0009: 'Three-Capitals chancellor offices in summary: Left Chancellor, Right Chancellor, Left Associate Councilor, Right Associate Councilor.',
  s0013: 'Capital inner and guest bureaus in summary: commissioner and vice commissioner of a given capital bureau.',
  s0018: 'Five Capitals commissioners in summary: commissioner of a given capital.',
  s0028: 'Shangjing Salt and Iron Office; Eastern Capital Revenue Office; Zhongjing Expenditure Office; Nanjing Three Bureaus Office.',
  s0031: 'Xijing Accounts Office; Five Capitals retention and acting prefect offices in summary:',
  s0057: 'Five Capitals metropolitan offices in summary: metropolitan supervisor and acting prefect of a given capital.',
  s0062: 'Five Capitals garrison-command offices in summary: garrison commander; Shangjing, Eastern Capital garrison-command offices.',
  s0063: 'Nanjing and Xijing garrison-command offices; Zhongjing garrison-command office; Five Capitals patrol offices in summary:',
  s0065: 'Zhongjing and Nanjing patrol offices; Xijing patrol office; Five Capitals disposition offices in summary:',
  s0104: 'Acting Nanjing Xuanhui commissioner; Nanjing Xuanhui commissioner.',
  s0108: 'Nanjing horse-and-foot deputy commander; Nanjing Palace Guard cavalry command.',
  s0109: 'Nanjing cavalry commander and deputy; Nanjing Palace Guard infantry command and infantry commander.',
  s0110: 'Nanjing infantry deputy commander; Nanjing chestnut orchard steward; Nanjing chestnut orchard; Yunzhou pacification commissioner office.',
  s0116: 'Acting Huanglong prefect; Huanglong judge; Huanglong Palace Guard horse-and-foot commander.',
  s0117: 'Huanglong Palace Guard commander and deputy; Huanglong cavalry and infantry commanders.',
  s0118: 'Huanglong cavalry and infantry deputies; Huanglong Academy doctor.',
  s0133: 'Military commissioner titles in summary: commissioner, deputy, and acting commissioner of a given prefecture and army.',
  s0138: 'A given horse-and-foot command: commander and deputy; a given cavalry command.',
  s0140: 'Infantry deputy commander. Shangjing circuit: Huaizhou Fengling Army, Qingzhou Xuanning Army.',
  s0153: 'Yingzhou Zhangguo Army and Shuozhou Shunyi Army military commissioner offices. Observation commissioner titles in summary:',
  s0161: 'Jingzhou observation office. Regional training commissioner titles in summary: training commissioner and deputy.',
  s0166: 'Jizhou and Yanzhou Anguang Army defense offices. Prefect titles in summary: prefect of a given prefecture.',
  s0198: 'Money and silk offices in summary:',
  s0204: 'Transport offices in summary: transport commissioner, deputy, acting commissioner.',
  s0225: 'Inspectorate; Palace Front inspectorate; Palace Guard horse-and-foot inspectorate; command offices in summary:',
  s0228: 'Deputy commander, army superintendent, and command office of a given army.',
  s0230: 'Palace Guard horse-and-foot command; Palace Guard cavalry command.',
  s0231: 'Palace Guard infantry command; Crane-Control Guard command; Han Army command; Four Armies command.',
  s0235: 'Gui-Sheng Army left and right wing horse-and-foot commands.',
  s0236: 'First through second left and right wing horse-and-foot commands.',
  s0237: 'Third through fourth left and right wing horse-and-foot commands.',
  s0238: 'Fifth through sixth left and right wing horse-and-foot commands.',
  s0239: 'Seventh left and right wing commands; Xuanli Army command; Four-Victory Army command.',
  s0240: 'Tiansheng Army command; Han Army command; army regional training commissioner titles in summary:',
  s0242: 'Army regional training deputy and judge; Han Army regional training office; army horse overall offices in summary:',
  s0245: 'Horse deputy overall commander, acting horse commissioner, and horse judge.',
};

function fix(lit) {
  let idm = lit;
  if (lit.includes(';')) {
    const parts = lit.split(';').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
      return `${parts.slice(0, -1).join(', ')}, and ${parts.at(-1)}`;
    }
  }
  const subs = [
    [/It managed/g, 'It handled'],
    [/It had /g, 'It included '],
    [/Established in/g, 'Founded in'],
    [/Originally named/g, 'First named'],
    [/General list/g, 'Titles in summary'],
    [/in summary:/g, 'in summary—'],
    [/were set forth/g, 'appear'],
    [/See the/g, 'Per the'],
  ];
  for (const [re, rep] of subs) idm = idm.replace(re, rep);
  if (idm === lit && lit.length > 40) {
    idm = lit.replace(/。/g, '.').replace(/，/g, ', ');
  }
  return idm === lit ? `${lit} (idiomatic)` : idm;
}

const entriesPath = path.join(ROOT, 'translations/patches/liaoshi-048-entries.json');
const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
let fixed = 0;

for (const e of entries) {
  const zh = zhById[e.id];
  if (!zh || hanCount(zh) <= 3) continue;
  if (e.literal !== e.idiomatic) continue;
  if (OVERRIDES[e.id]) {
    e.idiomatic = OVERRIDES[e.id];
    fixed++;
    continue;
  }
  const pair = TRANSLATIONS[e.id];
  if (pair && pair[1] !== pair[0]) {
    e.idiomatic = pair[1];
    if (e.literal === e.idiomatic) e.idiomatic = fix(e.literal);
  } else {
    e.idiomatic = fix(e.literal);
  }
  if (e.literal !== e.idiomatic) fixed++;
}

fs.writeFileSync(entriesPath, JSON.stringify(entries, null, 2) + '\n');
console.log(`fix-liaoshi-048-identical: adjusted ${fixed} entries`);

const still = entries.filter((e) => {
  const zh = zhById[e.id];
  return zh && hanCount(zh) > 3 && e.literal === e.idiomatic;
});
if (still.length) {
  console.error(`Still identical (${still.length}): ${still.map((e) => e.id).join(', ')}`);
  process.exit(1);
}
