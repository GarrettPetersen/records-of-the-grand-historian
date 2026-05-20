#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: ['Dragon at jisi, year sequence Shi Shen, first promulgation throughout the realm, ten thousand states forever following."', 'Dragon at jisi, year Shi Shen, first promulgated empire-wide, ten thousand states forever following."'],
  s0602: ['Sons sons grandsons grandsons, enjoying transmission for a hundred million years."', 'Sons and grandsons, enjoying transmission for a hundred million years."'],
  s0603: ['This also was made by Wang Mang.', 'This was also Wang Mang\'s work.'],
  s0604: ['At the time Grand Music Director Gongsun Chong, according to the Han Treatise first repaired the steelyard foot measure; upon seeing this weight, using the new steelyard to weigh it—weight 120 jin.', 'Grand Music Director Gongsun Chong first repaired the steelyard measure per the Han Treatise; weighing this object on the new steelyard—it weighed 120 jin.'],
  s0605: ['New steelyard and weight matched like tally and seal.', 'The new steelyard and weight matched like seal and tally.'],
  s0606: ['Thereupon entrusted to Chong to tune music.', 'Chong was then charged with tuning music.'],
  s0607: ['In Emperor Xiaowen\'s time, dou and foot measure were made entirely according to the Han Treatise.', 'Under Emperor Xiaowen, dou and foot measure were made per the Han Treatise.'],
  s0608: ['Liang and Chen followed the ancient steelyard.', 'Liang and Chen used the ancient steelyard.'],
  s0609: ['Qi used ancient steelyard one jin eight liang as one jin.', 'Qi counted eight ancient liang as one jin.'],
  s0610: ['Zhou jade steelyard four liang equals ancient steelyard four liang and a half.', 'Zhou jade steelyard four liang equaled ancient steelyard four and a half liang.'],
  s0611: ['Kaihuang used ancient steelyard three jin as one jin; in Daye, following restored ancient steelyard.', 'Kaihuang counted three ancient jin as one jin; Daye restored the ancient steelyard.'],
};

const targetPath = process.argv[2];
if (!targetPath) { console.error('Usage'); process.exit(1); }
const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;
for (const s of data.sentences) { const pair = T[s.id]; if (!pair) continue; s.literal = pair[0]; s.idiomatic = pair[1]; patched++; }
const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) { console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`); process.exit(1); }
const identical = data.sentences.filter((s) => s.literal.trim() === s.idiomatic.trim());
if (identical.length) { console.error(`Identical: ${identical.map((s) => s.id).join(', ')}`); process.exit(1); }
fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
