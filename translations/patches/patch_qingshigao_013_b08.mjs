#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Sixth month, new moon on day dingchou: quota land tax from the thirty-ninth year\'s drought was remitted for fifteen prefectures and counties including Hanyang in Hubei and six guards and one post including Wuchang.',
    'At the sixth-month new moon, thirty-ninth-year drought taxes were remitted in Hubei districts including Hanyang and Wuchang guard units.',
  ],
  s0702: [
    'On day wuyin, the Emperor halted at the Mountain Resort for Avoiding Summer Heat.',
    'On wuyin day, the Emperor stayed at the Summer Resort.',
  ],
  s0703: [
    'On day guimao, the Emperor went to Wanshou Pavilion at Guangren Ridge to welcome the Empress Dowager to halt at the Mountain Resort.',
    'On guimao day, the Emperor welcomed the Empress Dowager to the Summer Resort at Wanshou Pavilion.',
  ],
  s0704: [
    'On day renchen, Feng Sheng\'e was made Minister of War.',
    'On renchen day, Feng Sheng\'e became Minister of War.',
  ],
  s0705: [
    'On day bingshen, expedition leader E\'erte was stripped of office and arrested for trial.',
    'On bingshen day, expedition leader E\'erte was dismissed and taken into custody.',
  ],
  s0706: [
    'On day gengzi, a post of expedition leader managing Oirat tribes at Urumqi was established, with Quanjian appointed.',
    'On gengzi day, Quanjian became expedition leader over Oirat tribes at Urumqi.',
  ],
  s0707: [
    'Autumn, seventh month, day renxu: Agui and others memorialized the capture of mountain-ridge blockhouses and forts at Kunse\'er and elsewhere.',
    'In the seventh month, Agui reported taking Kunse\'er ridge forts.',
  ],
  s0708: [
    'On day dingmao, Agui and others captured blockhouse forts at Zhangga and elsewhere.',
    'On dingmao day, Agui took Zhangga blockhouses.',
  ],
  s0709: [
    'Geshiamucan, headman of E\'luomu stockade, and others led their people to surrender.',
    'E\'luomu headman Geshiamucan and others surrendered.',
  ],
  s0710: [
    'On day gengwu, quota land tax from the thirty-ninth year\'s flood and drought was remitted for seven departments and counties including Gaolan in Gansu.',
    'On gengwu day, thirty-ninth-year flood and drought taxes were remitted in seven Gansu districts including Gaolan.',
  ],
  s0711: [
    'Agui and others captured blockhouse forts along Zhigunao.',
    'Agui took Zhigunao blockhouses.',
  ],
  s0712: [
    'Eighth month, new moon on day bingzi: there was a solar eclipse.',
    'At the eighth-month new moon, there was a solar eclipse.',
  ],
  s0713: [
    'On day dingchou, Agui and others captured Longside stockade.',
    'On dingchou day, Agui took Longside stockade.',
  ],
  s0714: [
    'Mingliang and others captured the mountain ridge at Zhawugu.',
    'Mingliang seized the Zhawugu ridge.',
  ],
  s0715: [
    'On day jimao, because more than thirty prefectures and counties including Bazhou were flooded, five hundred thousand taels from the Zhili treasury were allocated for relief.',
    'On jimao day, five hundred thousand taels were sent to flood-stricken Zhili districts including Bazhou.',
  ],
  s0716: [
    'On day xinmao, the Emperor went to Mulan for the enclosure hunt.',
    'On xinmao day, the Emperor hunted at Mulan.',
  ],
  s0717: [
    'On day jihai, Agui and others memorialized victory at Lewei and an advance against the rebel stockade at Garzhi.',
    'On jihai day, Agui reported victory at Lewei and pressed Garzhi.',
  ],
  s0718: [
    'The Emperor ordered preferential recognition of the achievements of General Agui, Deputy General Feng Sheng\'e, and participating ministers Hai Lancha and Esente.',
    'The court honored Agui, Feng Sheng\'e, Hai Lancha, and Esente for their service.',
  ],
  s0719: [
    'On day xinchou, Shuhede was summoned to the traveling court at Rehe.',
    'On xinchou day, Shuhede was called to the Rehe traveling court.',
  ],
  s0720: [
    'On day guimao, Lobzang Silebu was enfeoffed as beile.',
    'On guimao day, Lobzang Silebu received the rank of beile.',
  ],
  s0721: [
    'On day yisi, Vice Ministers Yuan Shoutong and others were ordered to Guizhou to try the case of prefect Su Shan\'s memorial accusing the governor-general, provincial treasurer, and provincial judge of shielding subprefect Xi Zuan.',
    'On yisi day, Yuan Shoutong and others were sent to try Su Shan\'s charges against Guizhou officials who shielded Xi Zuan.',
  ],
  s0722: [
    'Ninth month, day gengxu: quota land tax from the thirty-ninth year\'s drought was remitted for twelve prefectures and counties including Zhongxiang in Hubei and seven guards including Wuchang.',
    'In the ninth month, thirty-ninth-year drought taxes were remitted in Hubei districts including Zhongxiang and Wuchang.',
  ],
  s0723: [
    'On day guichou, the Emperor returned to halt at the Mountain Resort.',
    'On guichou day, the Emperor returned to the Summer Resort.',
  ],
  s0724: [
    'On day dingsi, the Emperor escorted the Empress Dowager on her return journey.',
    'On dingsi day, the Emperor escorted the Empress Dowager homeward.',
  ],
  s0725: [
    'On day xinyou, because Tusi De impeached Su Shan for extorting levies beyond tax quotas, Yuan Shoutong and others were ordered to try him strictly.',
    'On xinyou day, Yuan Shoutong and others were ordered to try Su Shan rigorously after Tusi De\'s impeachment.',
  ],
  s0726: [
    'On day bingyin, because Mingliang had requested to go to the western route and missed his opportunity, he was severely rebuked and again stripped of the Guangzhou generalship.',
    'On bingyin day, Mingliang was rebuked and again lost the Guangzhou generalship for bungling the western route.',
  ],
  s0727: [
    'On day dingmao, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On dingmao day, the court returned to Beijing with the Empress Dowager.',
  ],
  s0728: [
    'Agui and others captured blockhouse forts at Danggakdi and elsewhere.',
    'Agui took Danggakdi blockhouses.',
  ],
  s0729: [
    'Winter, tenth month, day jimao: Wu Mitai, stationed in Tibet on affairs, was recalled; Liubao Zhu replaced him.',
    'In the tenth month, Wu Mitai left Tibet and Liubao Zhu took his post.',
  ],
  s0730: [
    'On day jichou, because six prefectures and counties including Bazhou had suffered heavier disaster, orders were given to distribute relief in the intercalary tenth month.',
    'On jichou day, intercalary-tenth-month relief was ordered for six flood-hit districts including Bazhou.',
  ],
  s0731: [
    'On day gengyin, quota land tax was remitted for seventeen prefectures, counties, and departments including Gaolan in Gansu on account of flood, hail, and frost disasters.',
    'On gengyin day, flood, hail, and frost taxes were remitted in seventeen Gansu districts including Gaolan.',
  ],
  s0732: [
    'On day renchen, the Emperor returned to the palace.',
    'On renchen day, the Emperor returned to the palace.',
  ],
  s0733: [
    'On day bingshen, Pei Zongxi was transferred to Guizhou governor; Yuan Shoutong was ordered to act in that post; Tusi De acted Yunnan governor; Li Zhiying was made Anhui governor.',
    'On bingshen day, Pei Zongxi, Yuan Shoutong, Tusi De, and Li Zhiying received new governorships.',
  ],
  s0734: [
    'Intercalary tenth month, day renzi: Su Shan was executed for embezzling tax and making false accusations.',
    'In the intercalary tenth month, Su Shan was executed for tax fraud and false charges.',
  ],
  s0735: [
    'On day renxu, Mingliang and others memorialized the capture of the mountain ridge at Zhawugu.',
    'On renxu day, Mingliang reported taking the Zhawugu ridge.',
  ],
  s0736: [
    'On day jiazi, Agui and others memorialized capturing blockhouses and posts at Xili Mountain Huangcaoping and elsewhere; Major Cao Shun died in action.',
    'On jiazi day, Agui reported Huangcaoping forts taken; Cao Shun was killed.',
  ],
  s0737: [
    'Yuan Shoutong was ordered to Sichuan to try the case of Ji Guoxun together with Ayang\'a.',
    'Yuan Shoutong went to Sichuan with Ayang\'a to try Ji Guoxun.',
  ],
  s0738: [
    'Qing Heng was again enfeoffed as Prince Keqin of the Commandery.',
    'Qing Heng was restored as Prince Keqin of the Commandery.',
  ],
  s0739: [
    'On day renshen, Mingliang and others captured Erdegu stockade.',
    'On renshen day, Mingliang took Erdegu stockade.',
  ],
  s0740: [
    'Eleventh month: Mingliang and others captured blockhouses and posts at Jiasuo and elsewhere.',
    'In the eleventh month, Mingliang took Jiasuo blockhouses.',
  ],
  s0741: [
    'On day yiyou, Fulu was dismissed and exiled to Yili because he had failed to establish the facts in the Lita\'er case.',
    'On yiyou day, Fulu was banished to Yili for failing to try the Lita\'er case properly.',
  ],
  s0742: [
    'On day jichou, Agui captured the second peak of Xili Mountain and advanced to besiege Yamabeng stockades.',
    'On jichou day, Agui took Xili\'s second peak and besieged Yamabeng.',
  ],
  s0743: [
    'On day renchen, Mingliang and others memorialized capturing blockhouses and posts at Ke\'erjia\'ergu and elsewhere.',
    'On renchen day, Mingliang reported Ke\'erjia\'ergu forts taken.',
  ],
  s0744: [
    'On day renyin, Agui and others memorialized capturing blockhouses and stockades at Sheleguzu, Kesiguomu, A\'ergu, and elsewhere.',
    'On renyin day, Agui reported forts taken at Sheleguzu, Kesiguomu, and A\'ergu.',
  ],
  s0745: [
    'Twelfth month, new moon on day jiachen: there was a solar eclipse.',
    'At the twelfth-month new moon, there was a solar eclipse.',
  ],
  s0746: [
    'On day dingwei, Works Minister Yan Xunqi died; Ji Huang was transferred to Works Minister, Cai Xin to War Minister, and Cao Xiuxian to Rites Minister.',
    'On dingwei day, Yan Xunqi died; Ji Huang, Cai Xin, and Cao Xiuxian received ministerial posts.',
  ],
  s0747: [
    'Agui and others captured stockades at Sa\'erwai and elsewhere.',
    'Agui took Sa\'erwai stockades.',
  ],
  s0748: [
    'On day bingchen, Agui was made Inner Grand Minister of the Attendant Guard of the Bordered Yellow Banner.',
    'On bingchen day, Agui became an inner grand minister of the Bordered Yellow Banner guard.',
  ],
  s0749: [
    'Xiong Xuepeng was transferred to Guangdong governor and Wu Hubing was made Guangxi governor.',
    'Xiong Xuepeng and Wu Hubing received Guangdong and Guangxi governorships.',
  ],
  s0750: [
    'On day jiazi, Mingliang and others advanced from Dasagu, in succession capturing perilous mountain ridges and stockades along the river at Ge\'erze.',
    'On jiazi day, Mingliang advanced from Dasagu and took Ge\'erze river stockades.',
  ],
  s0751: [
    'On day bingyin, Agui and others captured stockades at Gelonggu and elsewhere.',
    'On bingyin day, Agui took Gelonggu stockades.',
  ],
  s0752: [
    'On day gengwu, Agui and others advanced from Suolonggu and took position on the Garzhan mountain ridge, thrusting straight at Garzhi.',
    'On gengwu day, Agui moved from Suolonggu onto Garzhan ridge toward Garzhi.',
  ],
  s0753: [
    'Headmen Semli Yongzhong and Bulongpu Anamu came to surrender.',
    'Semli Yongzhong and Bulongpu Anamu surrendered.',
  ],
  s0754: [
    'On day renshen, Mingliang and others captured passes at Jiaza and elsewhere, and on the rear route Babuli and Rigaiguluo, advancing to Dusong Pass; a date was set to join in storming Garzhi.',
    'On renshen day, Mingliang took Jiaza passes and reached Dusong, planning a joint assault on Garzhi.',
  ],
  s0755: [
    'Headmen Dagulade\'erwa and others came to surrender.',
    'Dagulade\'erwa and other headmen surrendered.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b08.mjs <translation.json>'
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
