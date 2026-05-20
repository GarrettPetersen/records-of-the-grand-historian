#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Relief was given for flood and drought disasters in sixteen Zhili prefectures and counties including Pingxiang, and for drought disasters in twelve Henan prefectures and counties including Yongcheng.',
    'Sixteen Zhili units including Pingxiang were relieved for flood and drought, and twelve Henan units including Yongcheng for drought.',
  ],
  s0802: [
    'Eleventh month, day yihai: because a solar eclipse was calculated for New Year\'s Day of the sixtieth year of the Qianlong reign (yimao), the Emperor proclaimed and fixed abdication for the following year.',
    'In the eleventh month, on yihai day, the Emperor announced abdication the next year after calculating an eclipse on Qianlong 60 New Year\'s Day.',
  ],
  s0803: [
    'That month, drought relief was given for nine Shandong prefectures and counties including Yixian, and flood and hail relief for seven Gansu prefectures and counties including Hezhou.',
    'That month, Shandong units including Yixian received drought relief and Gansu units including Hezhou relief for flood and hail.',
  ],
  s0804: [
    'Twelfth month, day dingchou: because Censor Fusen\'a memorialized requesting that land-and-service tax grain be collected in kind, an edict rebuked this as absolutely unfeasible and he was dismissed.',
    'On dingchou day in the twelfth month, Fusen\'a was dismissed after proposing in-kind land-tax collection was denounced as impossible.',
  ],
  s0805: [
    'On day bingxu, Mingliang was made participating minister at Ush, and Qing Gui participating minister at Tarbaghatai.',
    'On bingxu day, Mingliang became Ush participating minister and Qing Gui Tarbaghatai participating minister.',
  ],
  s0806: [
    'On day renyin, presentation of tribute by Guangdong foreign traders and the superintendent of the Guangdong Maritime Customs was forbidden.',
    'On renyin day, Guangdong foreign merchants and the Canton customs superintendent were forbidden to send tribute.',
  ],
  s0807: [
    'That month, flood relief was given for three Shaanxi counties including Chaoyi.',
    'That month, three Shaanxi counties including Chaoyi were relieved for flood.',
  ],
  s0808: [
    'That year, Korea presented tribute.',
    'That year Korea sent tribute.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b09.mjs <translation.json>'
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
