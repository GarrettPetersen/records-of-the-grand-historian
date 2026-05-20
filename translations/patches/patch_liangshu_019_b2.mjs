#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    '” That same day he was transferred to Grand Chamberlain.',
    '” That same day he was made grand chamberlain.',
  ],
  s0102: [
    'Soon he was appointed interior administrator of Nankang; ashamed to accept the name of one who yielded his salary, he declined and did not take the post.',
    'Soon named Nankang interior administrator, he refused the post rather than accept a title earned by yielding his salary.',
  ],
  s0103: [
    'Before long he was transferred to Cloud-Cavalry General and Minister of Palace Supplies.',
    'Before long he became cloud-cavalry general and minister of palace supplies.',
  ],
  s0104: [
    'He went out as chief clerk on the Trustworthy Martial staff and Jiangxia administrator.',
    'He went out as Trustworthy Martial chief clerk and Jiangxia administrator.',
  ],
  s0105: [
    'When he was replaced, he memorialized to return home by the direct route.',
    'Replaced in office, he asked leave to go home by the direct route.',
  ],
  s0106: [
    'At home he divided his residence to make a temple and lodged his heart beyond worldly affairs.',
    'At home he gave part of his house for a temple and turned his mind from the world.',
  ],
  s0107: [
    'The crown prince, since Facai was an old retainer, repeatedly sent favorable orders summoning him east; before he could set out he died, aged sixty-three.',
    'The crown prince, holding Facai an old servant, sent him generous summons east again and again; he died before he could leave, at sixty-three.',
  ],
  s0108: [
    'Chen Minister of Personnel Yao Cha said: Xiao Yingzhou raised the hosts of a great province to join the righteous cause; at that time men’s hearts had not yet understood.',
    'Chen minister of personnel Yao Cha said: Xiao Yingzhou gathered a great province’s forces for the founding cause; then few yet saw what was coming.',
  ],
  s0109: [
    'These three were Chu’s anchor.',
    'These three were Chu’s pillars.',
  ],
  s0110: [
    'In planning and building the foundation they surely had force.',
    'In planning and laying the foundations they surely did heavy work.',
  ],
  s0111: [
    'In regional achievements Tan had the greater share;',
    'On the frontier Tan did the heavier part;',
  ],
  s0112: [
    'in holding office and managing affairs Ai had both.',
    'in office and in duty Ai had both.',
  ],
  s0113: [
    'All ascended to favored rank—fitting!',
    'All rose to favored rank—as they should!',
  ],
  s0114: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0115: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_019_b2.mjs <translation.json>'
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
