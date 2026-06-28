#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-songshu.json';
const ITEM_ID = 'source-songshu-095-wikisource-dbe5e2f019e0';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const manualTranslations = [
  {
    zh: '鄭兵與公孫表及宋兵將軍、交州刺史交阯侯普幾萬五千騎，復向虎牢，於城東南五里結營，分步騎自成臯開向虎牢外郭西門，德祖逆擊，殺傷百餘人，虜退還保營。',
    literal:
      'Zheng troops with Gongsun Biao and General of Song Soldiers, Inspector of Jiaozhou, Marquis Pu Ji of Jiaozhi, nearly fifteen thousand horse, again marched on Hulao, encamped five li southeast of the city, divided infantry and cavalry to set out from Chenggao toward the outer western gate of Hulao, Dezu met them in counterattack, killed and wounded more than a hundred, and the barbarians withdrew to hold their camp.',
    idiomatic:
      'Zheng troops with Gongsun Biao, General of Song Soldiers, Jiaozhou inspector and Jiaozhi marquis Pu Ji, and nearly fifteen thousand horse again marched on Hulao, encamped five li southeast of the city, and sent foot and horse from Chenggao toward the outer western gate of Hulao. Dezu counterattacked, killed and wounded more than a hundred, and the barbarians withdrew to their camp.',
  },
  {
    zh: '鎮北將軍檀道濟率水軍北救，車騎將軍廬陵王義真遣龍驤將軍沈叔狸三千人就豫州刺史劉粹，量宜赴援。',
    literal:
      'General Who Pacifies the North Tan Daoji led river forces north to relieve them; General of Chariots and Cavalry Prince Yizhen of Luling sent Dragon-Flight General Shen Shuli with three thousand men to join Inspector of Yu Liu Cui, to aid as circumstances required.',
    idiomatic:
      'General Who Pacifies the North Tan Daoji led a river fleet north to relieve them, and General of Chariots and Cavalry Prince Yizhen of Luling sent Dragon-Flight general Shen Shuli with three thousand men to Liu Cui, inspector of Yu, to reinforce as needed.',
  },
  {
    zh: '少帝景平元年正月，鄭兵分軍向洛，攻小壘，小壘守將竇晃拒戰，陷沒，河南太守王涓之棄金墉出奔。',
    literal:
      'In the first month of the first year of Jingping under the Young Emperor, Zheng troops divided their army toward Luoyang, attacked Xiao Fort, its garrison commander Dou Huang resisted in battle and fell, and Administrator of Henan Wang Juanzhi abandoned Jinyong and fled.',
    idiomatic:
      'In the first month of Jingping year one under the Young Emperor, Zheng troops sent a detachment toward Luoyang, attacked Xiao Fort, and overran its garrison commander Dou Huang in battle; Henan administrator Wang Juanzhi abandoned Jinyong and fled.',
  },
];

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const item = queue.items.find((x) => x.id === ITEM_ID);
if (!item) throw new Error(`Missing ${ITEM_ID}`);

item.manualTranslations = manualTranslations.map((row) => ({
  ...row,
  translator: T,
  model: M,
}));
item.status = 'approved';
item.decision = 'approved';
item.notes = 'Restored three missing sentences between s0063 and s0064 with manual translations.';
item.reviewedAt = new Date().toISOString();
item.reviewer = 'sdk-repair-chapter';

fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

execSync(
  `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${ITEM_ID} --item ${ITEM_ID} --reviewer sdk-repair-chapter`,
  { stdio: 'inherit' },
);

console.log('Applied songshu/095 source correspondence repair.');
