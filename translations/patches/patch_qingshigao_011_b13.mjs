#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    'On day renwu, E Leshun was transferred to Shandong governor, Gao Jin to Anhui governor, and Xitek to commander-in-chief at Barkol.',
    'On renwu day, E Leshun, Gao Jin, and Xitek were reassigned to Shandong, Anhui, and Barkol posts.',
  ],
  s1202: [
    'On day guimi, Dawachi\'s crimes were pardoned; he was enfeoffed as imperial prince and granted a residence in the capital.',
    'On guimi day, Dawachi was pardoned, made imperial prince, and given a house in Beijing.',
  ],
  s1203: [
    'On day jiawu, Galazat Demuqidanbi came to submit.',
    'On jiawu day, Galazat Demuqidanbi submitted.',
  ],
  s1204: [
    'Twelfth month, day guimao: Uludeng was recalled as staff commander.',
    'In the twelfth month, on guimao day, Uludeng was reinstated as staff commander.',
  ],
  s1205: [
    'Lu Chao was appointed acting Shaanxi governor.',
    'Lu Chao acted as Shaanxi governor.',
  ],
  s1206: [
    'On day bingwu, Vice Minister Liu Lun was ordered to Zhejiang to investigate former governor E Leshun and to review relief affairs in Jiangnan and Zhejiang.',
    'On bingwu day, Liu Lun was sent to Zhejiang to investigate E Leshun and Jiangnan-Zhejiang relief.',
  ],
  s1207: [
    'On day wushen, Yili\'s tribute and levies for the year were remitted.',
    'On wushen day, Yili\'s annual tribute and levies were exempted.',
  ],
  s1208: [
    'Jilin General Fusen was made Minister of War; Eledeng replaced him.',
    'Fusen became Minister of War and Eledeng succeeded him as Jilin general.',
  ],
  s1209: [
    'On day jiwei, flood and frost disaster relief was given in Solon and Daur.',
    'On jiwei day, Solon and Daur received flood and frost relief.',
  ],
  s1210: [
    'Flood relief was given in six prefectures, counties, and guards of Hubei including Qianjiang.',
    'Hubei flood districts including Qianjiang and five other jurisdictions were relieved.',
  ],
  s1211: [
    'Flood relief was granted in varying degrees for twelve saltern fields including Xu Du in the Two Huai region and for this year\'s flood at Kelan prefecture in Shanxi.',
    'Varying flood relief went to twelve Liang-Huai salterns including Xu Du and to Shanxi\'s Kelan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b13.mjs <translation.json>'
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
