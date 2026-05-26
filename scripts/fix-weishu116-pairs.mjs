#!/usr/bin/env node
/** Post-process weishu116-s1601-2587-pairs.mjs for common fixes. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pairsPath = path.join(__dirname, 'weishu116-s1601-2587-pairs.mjs');

const mod = await import(`./weishu116-s1601-2587-pairs.mjs?t=${Date.now()}`);
const PAIRS = { ...mod.PAIRS };

function fix(id, lit, idm) {
  PAIRS[id] = [lit, idm];
}

fix('s1601', "(It had Ping'a Mountain.)", "Within its bounds was Ping'a Mountain.");
fix('s1603', 'Longkang Commandery', 'Longkang Commandery');
fix('s1611', 'Qicheng Commandery', 'Qicheng Commandery');
fix('s1617', '(Established in the sixth year of Wuding (548).', 'Established in the sixth year of Wuding (548).');
fix('s1617', '(Established in the sixth year of Wuding (548). It had Aiping City and Huangqiu.)', 'Established in the sixth year of Wuding (548). Within its bounds were Aiping City and Huangqiu.');
// s1616+s1617 combined in source - fix individually if split
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/weishu/116.json'), 'utf8'));
const byId = new Map();
for (const b of d.content) for (const s of b.sentences || []) byId.set(s.id, s.zh);

if (byId.get('s1616') === '〈武定六年置。') {
  fix('s1616', '(Established in the sixth year of Wuding (548).', 'Established in the sixth year of Wuding (548).');
  fix('s1617', 'It had Aiping City and Huangqiu.)', 'Within its bounds were Aiping City and Huangqiu.');
}

fix('s1622', "(Xiao Yan's Yingchuan Commandery; renamed and established in the sixth year of Wuding (548).)", "Xiao Yan's Yingchuan Commandery; renamed and established in the sixth year of Wuding (548).");
fix('s1626', "(Xiao Yan's Huangcheng Garrison; renamed and established in the sixth year of Wuding (548).)", "Xiao Yan's Huangcheng Garrison; renamed and established in the sixth year of Wuding (548).");
fix('s1628', "(Xiao Yan's Ningling County; changed in the sixth year of Wuding (548).", "Xiao Yan's Ningling County; changed in the sixth year of Wuding (548).");
fix('s1629', 'It had Dafu City and Shizi Stream.)', 'Within its bounds were Dafu City and Shizi Stream.');
fix('s1655', '(Later lost; the seat was lodged at the provincial capital.)', 'Later lost; the seat was lodged at the provincial capital.');
fix('s1662', '(Later lost; the seat was moved to the provincial capital.)', 'Later lost; the seat was moved to the provincial capital.');
fix('s2221', [
  'The foregoing twenty-three provinces from Yangzhou downward were all newly attached frontier territories; the terrain was rugged and remote, so commandery and county household registers were sometimes incomplete.',
  'The foregoing twenty-three provinces from Yangzhou downward were all newly attached frontier territories; the terrain was rugged and remote, so commandery and county household registers were sometimes incomplete.',
]);
fix('s2223', [
  'Wei and Jin administered from Linqiu. All editions have a box or note "missing" for the character 廩.',
  'Wei and Jin administered from Linqiu. All editions have a box or note "missing" for the character lin.',
]);
fix('s2224', [
  'Yang\'s collation: "Song Annals,',
  'Yang\'s collation: "Song Annals,',
]);
fix('s2226', [
  '"Wei and Jin administered from Linqiu"—thus the missing character 廩 is supplied here.',
  '"Wei and Jin administered from Linqiu"—thus the missing character lin is supplied here.',
]);
fix('s2582', [
  'Seat at Dazhi Pass City. Yang\'s collation: "Yuanhe Gazetteer,',
  'Seat at Dazhi Pass City. Yang\'s collation: "Yuanhe Gazetteer,',
]);
fix('s2584', [
  '"Dahuo Pass" is two hundred li north of Huangpi County;',
  '"Dahuo Pass" is two hundred li north of Huangpi County;',
]);
fix('s2587', [
  '"Dakuo Pass" is one hundred ninety paces southeast of the county.',
  '"Dakuo Pass" is one hundred ninety paces southeast of the county.',
]);

for (const [id, pair] of Object.entries(PAIRS)) {
  let [lit, idm] = pair;
  lit = lit.replace(/one counties/g, 'one county');
  idm = idm.replace(/one counties/g, 'one county');
  lit = lit.replace(/two counties\./g, (m, o) => m);
  PAIRS[id] = [lit, idm];
}

const lines = ['/** Translation pairs for weishu 116 s1601–s2587. [literal, idiomatic] */', 'export const PAIRS = {'];
for (const [id, [lit, idm]] of Object.entries(PAIRS).sort((a, b) => a[0].localeCompare(b[0]))) {
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  lines.push(`  ${id}: ['${esc(lit)}', '${esc(idm)}'],`);
}
lines.push('};', '');
fs.writeFileSync(pairsPath, lines.join('\n'));
console.log('Fixed pairs file');
