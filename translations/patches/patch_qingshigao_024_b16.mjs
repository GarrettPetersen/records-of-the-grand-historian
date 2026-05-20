#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1501: [
    'On day xinwei, Jiang Guiti was ordered to take overall command of the Left Guard Army of the Martial Guard.',
    'On xinwei day, Jiang Guiti was made commander of the Left Martial Guard Army.',
  ],
  s1502: [
    'On day wuyin, the Russian envoy Korostovitz, the Dutch envoy Hitters, and others were received at Renshou Hall.',
    'On wuyin day, Korostovitz of Russia, Hitters of the Netherlands, and others were received at Renshou Hall.',
  ],
  s1503: [
    'On day jimao, Yin Chang and Duan Fang were ordered to inspect the autumn maneuvers.',
    'On jimao day, Yin Chang and Duan Fang were told to review autumn field exercises.',
  ],
  s1504: [
    'On day gengchen, Ma Yukun died; he was posthumously promoted to second-class Commandant of Cavalry.',
    'On gengchen day, Ma Yukun died and was given second-class Commandant of Cavalry.',
  ],
  s1505: [
    'On day xinsi, Yin Chang was appointed envoy minister to Germany.',
    'On xinsi day, Yin Chang was sent as minister to Germany.',
  ],
  s1506: [
    'On day renwu, Imperial Presence Minister Bodisu was dispatched to Baoding to welcome and entertain the Dalai Lama.',
    'On renwu day, Bodisu went to Baoding to welcome the Dalai Lama.',
  ],
  s1507: [
    'Ninth month, new moon on guimao: the former scholars Gu Yanwu, Wang Fuzhi, and Huang Zongxi were granted posthumous worship in the Confucian temple.',
    'In month 9, guimao new moon, Gu Yanwu, Wang Fuzhi, and Huang Zongxi were admitted to Confucian temple worship.',
  ],
  s1508: [
    'On day yiyou, American warships on a tour of inspection reached Xiamen; Prince Beile Yulang and Liang Dunyan were sent to extend greetings.',
    'On yiyou day, U.S. warships called at Xiamen; Yulang and Liang Dunyan were sent to greet them.',
  ],
  s1509: [
    'On day jichou, land reclamation was opened along the Ningxia canal.',
    'On jichou day, canal land reclamation began in Ningxia.',
  ],
  s1510: [
    'On day gengyin, the Dalai Lama arrived in the capital and was soon received in audience at Renshou Hall.',
    'On gengyin day, the Dalai Lama reached Beijing and was soon received at Renshou Hall.',
  ],
  s1511: [
    'On day guisi, a unified currency system was promulgated.',
    'On guisi day, a unified currency system was issued.',
  ],
  s1512: [
    'On day bingshen, the Postal Ministry\'s request was approved to trial issue domestic government bonds.',
    'On bingshen day, the court approved a trial issue of domestic government bonds.',
  ],
  s1513: [
    'On day wuxu, Jinshi Hall graduates Chen Yunhao and others were granted differential promotions.',
    'On wuxu day, Chen Yunhao and other Jinshi Hall graduates received graded promotions.',
  ],
  s1514: [
    'On day gengzi, the British envoy Jordan and others were received at Renshou Hall.',
    'On gengzi day, Jordan of Britain and others were received at Renshou Hall.',
  ],
  s1515: [
    'On day guimao, study-abroad graduates Chen Zhenxian and others were granted official status; Jinshi Hall graduates Ye Guangqi and others received differential promotions.',
    'On guimao day, Chen Zhenxian and other returned students were given rank, and Ye Guangqi and other Jinshi Hall graduates were promoted.',
  ],
  s1516: [
    'On day jiyou, the Chengyu Longmao circuit in Sichuan was abolished and patrol and encouragement-of-industry circuits were added.',
    'On jiyou day, Sichuan\'s Chengyu Longmao circuit was cut and patrol and industry-promotion circuits were added.',
  ],
  s1517: [
    'On day xinhai, an edict stated that matters in the earlier constitutional preparation still remained incomplete; each ministry and bureau was instructed, according to the prior format and each office\'s responsibilities, to report in stages for the Compilation and Review Office to check, after which imperial approval would be followed.',
    'On xinhai day, an edict said constitutional prep was unfinished and told each ministry to report in stages to the Compilation and Review Office for approval.',
  ],
  s1518: [
    'That autumn, flood arrears in Huize, Yunnan, and quota grain in Chuxiong and other counties and in Xupu, Hunan, were remitted.',
    'That autumn, flood taxes were forgiven in Huize, Chuxiong, and Xupu.',
  ],
  s1519: [
    'A hundred thousand taels from the treasury were issued to relieve disaster victims in Hubei and Hunan.',
    '100,000 taels were sent to relieve flood victims in Hubei and Hunan.',
  ],
  s1520: [
    'Relief was again given for disasters in Gansu; wind and flood disasters in Guangdong; and flood disasters in Guangxi, Zhejiang, Heilongjiang, and Fujian.',
    'More relief went to Gansu, Guangdong wind and flood victims, and flooded Guangxi, Zhejiang, Heilongjiang, and Fujian.',
  ],
  s1521: [
    'Winter, tenth month, day jiayin: the Japanese envoy Ijuin Hikokichi was received at Qinzheng Hall.',
    'In month 10, jiayin, Ijuin Hikokichi of Japan was received at Qinzheng Hall.',
  ],
  s1522: [
    'Guangzhou, Zhaoqing, and other districts suffered hurricane disaster; urgent relief was ordered.',
    'Hurricanes hit Guangzhou and Zhaoqing; the court ordered urgent relief.',
  ],
  s1523: [
    'On day wuwu, a banquet was given the Dalai Lama at Ziguang Pavilion.',
    'On wuwu day, the Dalai Lama was feasted at Ziguang Pavilion.',
  ],
  s1524: [
    'On day renxu, the empress dowager\'s birthday; banquets were suspended.',
    'On renxu day, the empress dowager\'s birthday, court banquets were canceled.',
  ],
  s1525: [
    'The Dalai Lama offered birthday congratulations and presented tribute; by empress-dowager rescript he was further ennobled as the Buddha "Sincere and Obedient, Praising Transformation, Great Benevolent Lord of the Western Heaven," granted ten thousand taels in annual stipend, and sent back to Tibet.',
    'The Dalai Lama congratulated the empress dowager and brought gifts; she gave him a new Buddhist title, 10,000 taels a year, and sent him back to Tibet.',
  ],
  s1526: [
    'On day renshen, the emperor\'s illness became grave.',
    'On renshen day, the emperor fell gravely ill.',
  ],
  s1527: [
    'By empress-dowager rescript, Prince Chun Zaifeng\'s son Puyi was to be raised in the palace; Zaifeng was again ordered to supervise the realm as regent.',
    'Cixi ordered Puyi, son of Prince Chun Zaifeng, raised in the palace and made Zaifeng regent.',
  ],
  s1528: [
    'On day guiyou, the emperor\'s illness reached its crisis; he died at Hanyuan Hall on Ying Terrace at the age of thirty-eight.',
    'On guiyou day, the emperor died at Hanyuan Hall on Ying Terrace, aged thirty-eight.',
  ],
  s1529: [
    'The testamentary edict named Regent Zaifeng\'s son Puyi to enter and succeed to the great succession as heir emperor.',
    'The death edict made Zaifeng\'s son Puyi heir emperor.',
  ],
  s1530: [
    'By empress-dowager rescript, the heir emperor was ordered to succeed as heir to Muzong and also to carry the line of the late emperor.',
    'Cixi ordered the new emperor to succeed Muzong\'s line and Dezong\'s line together.',
  ],
  s1531: [
    'First year of Xuantong, first month, day jiyou: the posthumous title Tongtian Chongyun Dazhong Zhizheng Jingwen Jingwu Renxiao Ruizhi Duanjian Kuanqin Jing Emperor was conferred, the temple name Dezong was fixed, and burial was at Chongling.',
    'Xuantong 1, month 1, jiyou: the full posthumous title was granted, the temple name Dezong was fixed, and he was buried at Chongling.',
  ],
  s1532: [
    'Commentary: When Emperor Dezong personally held government, he was still in the prime of life, cherished great ambitions of achievement, and wished to raise the whip of punishment to wash away the nation\'s humiliation.',
    'Commentary: When Dezong ruled in person, still young, he aimed to strike hard and wipe away national shame.',
  ],
  s1533: [
    'Soon afterward armies and teachers were broken in defeat, territory was ceded and peace bought, and he then brought in newly risen junior ministers, keen to remake policy, as a plan for vigorous self-strengthening.',
    'After defeat and ceded territory, he turned to new ministers for a bold reform program.',
  ],
  s1534: [
    'Yet men seeking fame were rash and self-conceited, forgot the caution of not striking the rat lest the vessel be broken, and did not care that their plans could not succeed — to speak of it is enough to wring the heart.',
    'Yet ambitious reformers were reckless, ignored the risks, and pressed plans that could not work — a painful story.',
  ],
  s1535: [
    'When the curtain was drawn again and rule resumed from behind the screen, he withdrew in obscurity to Ying Terrace.',
    'When the empress dowager ruled again, he was confined in seclusion on Ying Terrace.',
  ],
  s1536: [
    'When foreign insult came, the provocation arose from within.',
    'Foreign aggression came with trouble stirred at home.',
  ],
  s1537: [
    'In the end eight powers joined arms and the imperial carriage went west on campaign.',
    'At last the Eight-Nation Alliance marched and the court fled west.',
  ],
  s1538: [
    'After the year gengzi, depressed and wounded in spirit, he suddenly met his end, and the dynasty\'s fortune also tilted because of it.',
    'After 1900, brooding and broken, he died suddenly — and the dynasty\'s fate turned with him.',
  ],
  s1539: [
    'Alas — was it not Heaven\'s doing!',
    'Alas — was it not Heaven\'s will!',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b16.mjs <translation.json>'
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
