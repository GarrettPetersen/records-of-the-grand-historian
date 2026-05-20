#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'In the seventeenth year, spring, first month, day dingsi new moon, an edict said: "Music\'s origin lies in life—this is the constant nature of all sentient beings;',
    'In the seventeenth year, on the dingsi new moon of the first month of spring, an edict declared: "The source of joy is life itself—this is the constant nature of every sentient being;',
  ],
  s0502: [
    'Benevolent treatment of the lowly and secure settlement in one\'s home are the universal rules of governing the age.',
    'To treat those below with kindness and give every house a secure home is the universal law of ruling the realm.',
  ],
  s0503: [
    'I pity these common multitudes, never forgetting to await the dawn, eagerly extending policies of nurturing and gathering, frequently dispensing merciful relief—',
    'I pity the common people, rise before dawn without forgetting them, and have again and again opened policies to nurture and gather them, often dispensing lenient mercy—',
  ],
  s0504: [
    'yet registered households have not increased, migration still exists, lightly leaving the native place—is that their true intent?',
    'yet registered households have not multiplied, migration continues, and people lightly abandon their native places—is that truly what they wish?',
  ],
  s0505: [
    'Resources and livelihood are nearly exhausted, with no means to return on their own; the heart that nests to the south—how can it be stilled?',
    'Their means and livelihood are nearly gone, they cannot make their own way back, and the heart that turns homeward—how can it find rest?',
  ],
  s0506: [
    'Now the new year opens, all things are renewed; I wish to make the black-haired people each secure in their old abodes.',
    'Now a new year opens and all things are made new; I mean to let the black-haired people each settle again in their old homes.',
  ],
  s0507: [
    'This will cause commanderies to have no idle land, districts no wandering people—cocks and dogs within hearing, mulberry and paper-mulberry fields meeting at boundaries.',
    'Then no commandery need keep idle fields, no district harbor wandering folk—neighbors\' cocks and dogs will be heard, mulberry and paper-mulberry lines will meet along the lanes.',
  ],
  s0508: [
    'All people under Heaven who have drifted to other regions, before the first day of the first month of Tianjian 17, may receive grace for half a year—permit them all to return home, exempting taxes for three years.',
    'Every subject who has drifted elsewhere, if the move came before the first day of the first month of Tianjian 17, shall receive a half-year grace period, be allowed to return home, and have taxes remitted for three years.',
  ],
  s0509: [
    'For those who have sojourned very far, add days to the journey time as measured.',
    'For those who have settled far away, extra days shall be added to the allowed travel time.',
  ],
  s0510: [
    'If there are those unwilling to return, immediately have them register on local rolls as residents, paying taxes according to former rates.',
    'Whoever is unwilling to return shall at once be entered on local rolls as a resident and taxed at the old rates.',
  ],
  s0511: [
    'If after migration there is no dwelling left in the native village, village officers, three elders, and other kin shall go to the county and petition for official lands and dwellings within the village, that they may be received and accommodated—giving those who yearn for home a place to return to.',
    'If a migrant\'s home village no longer holds a dwelling, village officers, three elders, and kin shall go to the county and claim official land and dwellings in the village so they can be received—giving those who long for home somewhere to return.',
  ],
  s0512: [
    'All those convicted for market toll posts and similar offices, robbery, diminishing inheritance, or offenses warranting seizure of property—for their fields, dwellings, carts, and oxen are the tools of livelihood; they may not all be forfeited; in each case a measured portion shall be left so they can support themselves.',
    'In cases of market-toll offices, robbery, or diminishing inheritance where property should be seized, fields, dwellings, carts, and oxen—the very tools of life—may not all be confiscated; a generous portion shall be left in every case so people can support themselves.',
  ],
  s0513: [
    'Wealthy merchant households likewise may not suddenly encroach upon and merge properties.',
    'Wealthy merchant houses likewise may not suddenly swallow one another up.',
  ],
  s0514: [
    'Those who fled and rebelled, regardless of the gravity of the offense, all may surrender and be restored to the common rolls.',
    'Whether the crime was great or small, fugitives and deserters may all surrender and be restored to the common rolls.',
  ],
  s0515: [
    'If there are constraints on them, they shall return to their original corvée duty.',
    'Where there are fixed obligations, they shall return to their original service.',
  ],
  s0516: [
    'All these are established as regulations and made known throughout."',
    'Let these rules be set out and made known everywhere."',
  ],
  s0517: [
    'Second month, day guisi: General Who Pacifies the North and Yongzhou Inspector Prince of Ancheng Xiu died.',
    'In the second month, on guisi day, General Who Pacifies the North and Yongzhou inspector Prince of Ancheng Xiu died.',
  ],
  s0518: [
    'Day jiachen: a great amnesty for all under Heaven.',
    'On jiachen day, a great amnesty was proclaimed for all under Heaven.',
  ],
  s0519: [
    'Day yimao: Prince of Nankang Ji, who commanded Stone Fort garrison, was made South Yanzhou Inspector.',
    'On yimao day, Prince of Nankang Ji, who held command of Stone Fort garrison, was made inspector of South Yanzhou.',
  ],
  s0520: [
    'Third month, day jiashen: the Old Man star appeared.',
    'In the third month, on jiashen day, the Old Man star appeared.',
  ],
  s0521: [
    'Day bingshen: Prince of Jian\'an Wei was re-enfeoffed as Prince of Nanping.',
    'On bingshen day, Prince of Jian\'an Wei was re-enfeoffed as Prince of Nanping.',
  ],
  s0522: [
    'Fifth month of summer, day wuyin: Rapid Cavalry Grand General and Yangzhou Inspector Prince of Linchuan Hong was dismissed.',
    'In the fifth month of summer, on wuyin day, Rapid Cavalry Grand General and Yangzhou inspector Prince of Linchuan Hong was dismissed.',
  ],
  s0523: [
    'Day jimao: Gandhara sent envoys presenting local products.',
    'On jimao day, Gandhara sent envoys bearing tribute.',
  ],
  s0524: [
    'Commandant-of-the-Guards General Xiao Jing was made Pacification Right General and overseer of Yangzhou.',
    'Xiao Jing, Commandant-of-the-Guards, was made Pacification Right General and overseer of Yangzhou.',
  ],
  s0525: [
    'Day xinsi: Prince of Linchuan Hong was made Central Army General and Supervisor of the Secretariat.',
    'On xinsi day, Prince of Linchuan Hong was made Central Army General and Supervisor of the Secretariat.',
  ],
  s0526: [
    'Sixth month, day yiyou: Prince of Poyang Hui, Yizhou Inspector, was made Commandant-of-the-Guards General.',
    'In the sixth month, on yiyou day, Prince of Poyang Hui, inspector of Yizhou, was made Commandant-of-the-Guards.',
  ],
  s0527: [
    'Central Army General and Supervisor of the Secretariat Prince of Linchuan Hong acted as Minister of Education under his existing titles.',
    'Central Army General and Supervisor of the Secretariat Prince of Linchuan Hong served as acting Minister of Education under his existing titles.',
  ],
  s0528: [
    'Day guimao: Imperial Academy Rector Cai Zuan was made Minister of Personnel.',
    'On guimao day, Cai Zuan, Imperial Academy Rector, was made Minister of Personnel.',
  ],
  s0529: [
    'Eighth month of autumn, day renyin: the Old Man star appeared.',
    'In the eighth month of autumn, on renyin day, the Old Man star appeared.',
  ],
  s0530: [
    'An edict said: military escort slaves and servant-women, men reaching sixty and women reaching fifty, shall be freed as common people.',
    'An edict declared that military escort slaves and servant-women—men at sixty and women at fifty—should be freed as commoners.',
  ],
  s0531: [
    'Tenth month of winter, day yihai: Central Army General and acting Minister of Education Prince of Linchuan Hong was made Supervisor of the Secretariat and Minister of Education.',
    'In the tenth month of winter, on yihai day, Central Army General and acting Minister of Education Prince of Linchuan Hong was made Supervisor of the Secretariat and Minister of Education.',
  ],
  s0532: [
    'Eleventh month, day xinhai: Prince of Nanping Wei was made Left Grandee for Splendid Merit with open office at third-rank ceremonial parity.',
    'In the eleventh month, on xinhai day, Prince of Nanping Wei was made Left Grandee for Splendid Merit with an open office at third-rank ceremonial parity.',
  ],
  s0533: [
    'In spring of the eighteenth year, first month, day jiashen: Commandant-of-the-Guards General Prince of Poyang Hui was made General Who Pacifies the West with open office at third-rank ceremonial parity and Jingzhou Inspector; Jingzhou Inspector Prince of Shixing Dan was made Central Pacification General with open office at third-rank ceremonial parity and Commandant-of-the-Guards.',
    'In the eighteenth year, on jiashen day of the first month of spring, Commandant-of-the-Guards Prince of Poyang Hui was made General Who Pacifies the West with an open office at third-rank ceremonial parity and inspector of Jingzhou; and Jingzhou inspector Prince of Shixing Dan was made Central Pacification General with an open office at third-rank ceremonial parity and Commandant-of-the-Guards.',
  ],
  s0534: [
    'Left Vice Director of the Masters of Writing Yuan Ang was made Director of the Masters of Writing; Right Vice Director Wang Jian was made Left Vice Director; Crown Prince Steward Xu Mian was made Right Vice Director.',
    'Yuan Ang, Left Vice Director of the Masters of Writing, became Director of the Masters of Writing; Wang Jian, Right Vice Director, became Left Vice Director; and Xu Mian, Crown Prince Steward, became Right Vice Director.',
  ],
  s0535: [
    'Day xinmao: the imperial carriage personally sacrificed at the Southern Suburb; filial sons, obedient brothers, and strong farmers received one rank of nobility.',
    'On xinmao day, the Emperor sacrificed at the Southern Suburb in person, and filial sons, obedient brothers, and strong farmers were granted one rank of nobility.',
  ],
  s0536: [
    'Second month, day wuwu: the Old Man star appeared.',
    'In the second month, on wuwu day, the Old Man star appeared.',
  ],
  s0537: [
    'Fourth month, day dingsi: a great amnesty for all under Heaven.',
    'In the fourth month, on dingsi day, a great amnesty was proclaimed for all under Heaven.',
  ],
  s0538: [
    'Seventh month of autumn, day jiashen: the Old Man star appeared.',
    'In the seventh month of autumn, on jiashen day, the Old Man star appeared.',
  ],
  s0539: [
    'Khotan and Funan each sent envoys presenting local products.',
    'Khotan and Funan each sent envoys bearing tribute.',
  ],
  s0540: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0541: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_002_b6.mjs <translation.json>'
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
