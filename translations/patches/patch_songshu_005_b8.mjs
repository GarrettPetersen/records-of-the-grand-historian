#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Relocating Han River refugees to the bank at Mian. "Han River" in all editions reads "Han Prefecture"; at the time there was no "Han Prefecture"—changed according to Yuan gui 486.',
    'Resettling Hanchuan refugees on the Han shore: every edition has Hanzhou instead of Hanchuan, but no Hanzhou existed then; emended per Yuan gui 486.',
  ],
  s0702: [
    'Third month, dingsi; below it is yichou.',
    'Third month dingsi; yichou follows below.',
  ],
  s0703: [
    'All editions agree.',
    'Every edition is the same.',
  ],
  s0704: [
    'According to the calendar, in the third month the new moon was on dingmao; there was no dingsi, and no yichou.',
    'Per the calendar the third-month new moon fell on dingmao; neither dingsi nor yichou could occur.',
  ],
  s0705: [
    'In the fourth month the new moon was on bingchen; the twenty-second day was dingsi, and the thirtieth day yichou.',
    'Fourth-month new moon bingchen; day 22 was dingsi and day 30 yichou.',
  ],
  s0706: [
    'Xinhai. All editions read xinsi.',
    'Xinhai: all editions have xinsi.',
  ],
  s0707: [
    'Tongjian Kaoyi says: "According to the long calendar, in the second month the new moon was on renchen, the tenth day xinchou, and the twentieth day xinhai.',
    'Zizhi Tongjian Collation says: "Per the long calendar, second-month new moon renchen, tenth day xinchou, twentieth day xinhai.',
  ],
  s0708: [
    'Xinsi should be emended to xinhai."',
    'Xinsi should read xinhai."',
  ],
  s0709: [
    'Now changed accordingly.',
    'Emended accordingly.',
  ],
  s0710: [
    'Pacifying-North General and Inspector of Xu and Yan provinces Prince of Wuling Jun was reduced in rank to Pacifying Army General. "Jun" in the Song edition reads "taboo."',
    'Pacifying-north general and Xu-Yan inspector Prince of Wuling Jun was demoted to pacifying-army general; the Song edition uses the taboo form for Jun.',
  ],
  s0711: [
    'The Sanchao, Northern Directorate, Mao, and Hall editions read "Zan"; now corrected according to the Annals of Emperor Xiaowu.',
    'Sanchao, Beijian, Mao, and Dian editions read Zan; corrected per the Xiaowu annals.',
  ],
  s0712: [
    'Explanation in textual collation note 30 of this juan.',
    'See textual collation note 30 in this juan.',
  ],
  s0713: [
    'Fifth month yiyou: outlaw Sima Shunze styled himself King of Qi and held Liangzhou city; dingsi Poluo Huang nation; wuxu Henan King—all sent envoys presenting tribute goods. According to that year\u2019s fifth month, new moon on jiashen, second day yiyou, fifteenth day wuxu; there was no dingsi.',
    'Fifth month yiyou: rebel Sima Shunze declared himself King of Qi and seized Liangzhou; entries for dingsi (Poluo Huang) and wuxu (Henan King) with tribute missions cannot stand—that month\u2019s new moon was jiashen (day 2 yiyou, day 15 wuxu), with no dingsi.',
  ],
  s0714: [
    'The dingsi day-entry must be in error.',
    'The dingsi date is certainly wrong.',
  ],
  s0715: [
    'Livelihoods not yet established. "Established" in all editions reads "able"; changed according to Yuan gui 195.',
    '"Livelihoods not yet established": every edition has neng (able) for li (established); emended per Yuan gui 195.',
  ],
  s0716: [
    'Wuwu. All editions read gengwu; changed according to the History of the Southern Dynasties.',
    'Wuwu: all editions read gengwu; corrected per Nanshi.',
  ],
  s0717: [
    'According to the calendar, that month\u2019s new moon was on gengxu; there was no gengwu.',
    'That month\u2019s new moon was gengxu; gengwu is impossible.',
  ],
  s0718: [
    'The ninth day was wuwu.',
    'Day 9 was wuwu.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b8.mjs <translation.json>'
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
