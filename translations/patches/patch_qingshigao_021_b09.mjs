#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Government troops sent to relieve Pingliang were defeated; Duo Longa was urged to divide his army and hurry to reinforce.',
    'Relief forces for Pingliang failed; Duo Longa was told to split his army and rush reinforcements.',
  ],
  s0802: [
    'On day yichou, pacified Hui in Ningxia rebelled again.',
    'On yichou day, Ningxia\'s pacified Hui rose again.',
  ],
  s0803: [
    'Bao Chao\'s army again recovered Chao, He, and Hanshan.',
    'Bao Chao retook Chao, He, and Hanshan.',
  ],
  s0804: [
    'Yan Duanshu was summoned to the capital; Mao Hongbin was made Liang-Guang governor-general and Yun Shilin Hunan governor.',
    'Yan Duanshu was called to court; Mao Hongbin took Liang-Guang and Yun Shilin Hunan.',
  ],
  s0805: [
    'The Ming minister Fang Xiaoru was granted collateral sacrifice in the Confucian temple.',
    'Fang Xiaoru of the Ming was admitted to collateral temple sacrifice.',
  ],
  s0806: [
    'On day wuchen, an edict ordered steamships purchased under the command of Zeng Guofan and Li Hongzhang.',
    'On wuchen day, steamships were to be bought under Zeng Guofan and Li Hongzhang.',
  ],
  s0807: [
    'On day jisi, Zeng Guofan declined the Zhejiang governorship on behalf of his brother Guoquan; the throne praised him and refused the resignation.',
    'On jisi day, Zeng Guofan asked out of the Zhejiang post for Guoquan; the court praised him and kept Guoquan in office.',
  ],
  s0808: [
    'Xining Hui joined Sal bandits to attack Dan\'gaer.',
    'Xining Hui and Sal raiders struck Dan\'gaer.',
  ],
  s0809: [
    'Hui rebels rose at Huiyuan; government troops captured and executed them.',
    'Hui rebels at Huiyuan were hunted down and killed.',
  ],
  s0810: [
    'A commercial treaty with Denmark was concluded.',
    'The Danish commercial treaty was settled.',
  ],
  s0811: [
    'On day renshen, Peng Yulin\'s army recovered Jiangpu, Pukou, and Jiufuzhou.',
    'On renshen day, Peng Yulin retook Jiangpu, Pukou, and Jiufuzhou.',
  ],
  s0812: [
    'On day yihai, Guangxi troops recovered Xunzhou.',
    'On yihai day, Guangxi forces retook Xunzhou.',
  ],
  s0813: [
    'Sixth month, new moon day bingzi: Guizhou troops recovered Pu\'an and Annan.',
    'In month 6, on the new moon bingzi, Guizhou forces retook Pu\'an and Annan.',
  ],
  s0814: [
    'On day dingchou, Mingyi was ordered to Tashkent to meet Mingxu and others to handle boundary affairs.',
    'On dingchou day, Mingyi was sent to Tashkent to join Mingxu in fixing the border.',
  ],
  s0815: [
    'On day wuyin, an edict ordered Zeng Guofan, Zuo Zongtang, and others to discuss reducing grain-transport quotas for Chang and Zhen in Jiangsu and Hang, Jia, and Hu in Zhejiang.',
    'On wuyin day, Zeng Guofan and Zuo Zongtang were to plan cuts in Jiangsu and Zhejiang transport grain.',
  ],
  s0816: [
    'On day gengchen, for recovering cities Li Chaobin and others and Song Guoyong and others were granted yellow riding jackets.',
    'On gengchen day, Li Chaobin, Song Guoyong, and others received yellow riding jackets for retaking cities.',
  ],
  s0817: [
    'Shaanxi quota tribute graduates were suspended.',
    'Shaanxi purchase-degree graduates were halted.',
  ],
  s0818: [
    'On day dinghai, Sichuan troops fought bandits at the Dadu River, captured Shi Dakai, and executed him.',
    'On dinghai day, Sichuan forces took Shi Dakai on the Dadu and put him to death.',
  ],
  s0819: [
    'Luo Bingzhang was promoted to Junior Guardian of the Heir Apparent rank and Brigadier Tang Yougeng was raised to provincial military commander.',
    'Luo Bingzhang received Junior Guardian rank and Tang Yougeng was made provincial commander.',
  ],
  s0820: [
    'On day xinmao, pacified Hui at Pingluo rebelled again.',
    'On xinmao day, Pingluo\'s pacified Hui rose again.',
  ],
  s0821: [
    'Hui rebels at Wating besieged Longde and were beaten back.',
    'Wating Hui besieged Longde and were driven off.',
  ],
  s0822: [
    'The Yellow River broke its banks at Kaizhou, Kaocheng, and Heze.',
    'The Yellow River burst at Kaizhou, Kaocheng, and Heze.',
  ],
  s0823: [
    'On day jiawu, Miao Peilin took Shouzhou and magistrate Mao Weiyi died defending it.',
    'On jiawu day, Miao Peilin seized Shouzhou and Mao Weiyi was killed.',
  ],
  s0824: [
    'On day yiwei, Shaanxi troops recovered Ningqiang.',
    'On yiwei day, Shaanxi forces retook Ningqiang.',
  ],
  s0825: [
    'On day jihai, because Russians forcibly occupied pastures, Chang Qing and others were urged to fix boundaries, persuade Russian troops to withdraw, and pacify Kazakhs and Kirghiz seeking to submit.',
    'On jihai day, Chang Qing was told to settle borders, get Russian troops back, and win over submitting Kazakhs and Kirghiz.',
  ],
  s0826: [
    'On day renyin, government troops recovered Zichuan, captured Liu Depei and others, and executed them.',
    'On renyin day, Zichuan was retaken and Liu Depei and others were captured and killed.',
  ],
  s0827: [
    'On day jiachen, Baoxing bandits were pacified.',
    'On jiachen day, Baoxing bandits were cleared.',
  ],
  s0828: [
    'Sichuan administration commissioner Liu Rong was ordered to supervise Hanzhong military affairs.',
    'Liu Rong was put in charge of Hanzhong military affairs.',
  ],
  s0829: [
    'That month, quota levies were remitted for Shunchang and other Fujian counties disturbed by rebels, and arrears in miscellaneous levies for Yining and other Jiangxi districts.',
    'That month, Fujian and Jiangxi districts hit by rebels had taxes and arrears remitted.',
  ],
  s0830: [
    'Autumn, seventh month, day yisi: Miao Peilin pressed Linhuai; Tang Xunfang attacked him.',
    'In autumn month 7, yisi, Miao Peilin threatened Linhuai and Tang Xunfang struck back.',
  ],
  s0831: [
    'On day bingwu, Li Hongzhang\'s army recovered Wujiang and Zhenze.',
    'On bingwu day, Li Hongzhang retook Wujiang and Zhenze.',
  ],
  s0832: [
    'Henan troops stormed the bandit nest at Zhanggang.',
    'Henan forces took the Zhanggang bandit lair.',
  ],
  s0833: [
    'Ying Qi was found guilty and stripped of office.',
    'Ying Qi was dismissed for misconduct.',
  ],
  s0834: [
    'Liu Rong was made Shaanxi governor and Zhang Jixin acted for him.',
    'Liu Rong became Shaanxi governor with Zhang Jixin acting.',
  ],
  s0835: [
    'On day jiayin, Li Hongzhang was temporarily also made Southern Ocean trade commissioner.',
    'On jiayin day, Li Hongzhang was given the Southern Ocean trade post as well.',
  ],
  s0836: [
    'On day wuwu, Guizhou troops recovered Guzhou.',
    'On wuwu day, Guizhou forces retook Guzhou.',
  ],
  s0837: [
    'On day xinyou, Yuan Jiasan died in camp.',
    'On xinyou day, Yuan Jiasan died on campaign.',
  ],
  s0838: [
    'On day renxu, Sheng Bao was granted suicide.',
    'On renxu day, Sheng Bao was allowed to take his own life.',
  ],
  s0839: [
    'On day jiazi, government troops stormed bandit nests at Shawo and elsewhere.',
    'On jiazi day, Shawo and other bandit nests were taken.',
  ],
  s0840: [
    'North-of-the-Yangtze grain transport commutation in money was again permitted.',
    'Jiangbei transport grain could again be collected as cash.',
  ],
  s0841: [
    'On day yichou, Liu Rong was also given command over Hubei relief forces.',
    'On yichou day, Liu Rong was placed over Hubei relief troops as well.',
  ],
  s0842: [
    'On day dingmao, government troops beat back Miao at Langshan and the Mengcheng route was reopened.',
    'On dingmao day, Langshan Miao were driven off and the road to Mengcheng opened.',
  ],
  s0843: [
    'Chonghou was made plenipotentiary to negotiate the Dutch commercial treaty.',
    'Chonghou was sent as plenipotentiary for the Dutch treaty.',
  ],
  s0844: [
    'Yunnan Hui took Pingyi; Cen Yuying\'s army recovered it.',
    'Pingyi fell to Yunnan Hui but Cen Yuying retook it.',
  ],
  s0845: [
    'On day guiyou, Mingyi and others were ordered to handle boundary affairs jointly with the Russian envoy.',
    'On guiyou day, Mingyi was to settle borders with the Russian minister.',
  ],
  s0846: [
    'Shandong White Lotus Pool sect rebels were pacified.',
    'Shandong\'s Bailianchi sect rebels were suppressed.',
  ],
  s0847: [
    'Wen Yu was granted release.',
    'Wen Yu was freed.',
  ],
  s0848: [
    'Nian bandits pressed Kaifeng.',
    'Nian rebels threatened Kaifeng.',
  ],
  s0849: [
    'That month, old and new quota levies were remitted for Duyun and other districts disturbed by rebels, and accumulated rent arrears on tidal lands at Fenghuang and other stations.',
    'That month, Duyun and other stricken districts had taxes remitted and Fenghuang tidal-land arrears forgiven.',
  ],
  s0850: [
    'Eighth month, day bingzi: Cheng Xueqi\'s army heavily defeated rebels at Taihu, Fengjing, and elsewhere and pressed toward Suzhou.',
    'In month 8, bingzi, Cheng Xueqi routed rebels at Taihu and Fengjing and closed on Suzhou.',
  ],
  s0851: [
    'On day dingchou, Cao Kezhong\'s Shaanxi army stormed bandit nests near the provincial capital and elsewhere.',
    'On dingchou day, Cao Kezhong cleared bandit nests around the Shaanxi capital.',
  ],
  s0852: [
    'On day wuyin, Han and Hui fought each other at Xining, Didao, and Hezhou.',
    'On wuyin day, Han and Hui clashed at Xining, Didao, and Hezhou.',
  ],
  s0853: [
    'Kazakhs joined Russians to harass Ili.',
    'Kazakhs aided Russian troops raiding Ili.',
  ],
  s0854: [
    'He Sheng Bi\'s Sichuan army was urged to aid Gansu.',
    'He Sheng Bi was told to hurry his Sichuan troops to Gansu.',
  ],
  s0855: [
    'On day gengchen, Anhui troops took Changhuai Guard.',
    'On gengchen day, Anhui forces captured Changhuai Guard.',
  ],
  s0856: [
    'On day xinsi, Ma Dezhao was stripped of office for cowardice.',
    'On xinsi day, Ma Dezhao lost his post for timidity.',
  ],
  s0857: [
    'Duo Longa\'s army reached Xi\'an and Weinan was cleared.',
    'Duo Longa reached Xi\'an and pacified Weinan.',
  ],
  s0858: [
    'Chen Guorui was ordered to assist Wu Tang in military affairs.',
    'Chen Guorui was assigned to help Wu Tang with the army.',
  ],
  s0859: [
    'On day bingxu, Jiangsu troops took Jiangyin.',
    'On bingxu day, Jiangsu forces captured Jiangyin.',
  ],
  s0860: [
    'On day dinghai, Ying Qi was posted to Xinjiang.',
    'On dinghai day, Ying Qi was sent to garrison Xinjiang.',
  ],
  s0861: [
    'Duxing\'a sent troops to aid Linhuai.',
    'Duxing\'a dispatched forces to relieve Linhuai.',
  ],
  s0862: [
    'On day jichou, for mishandling Taiwan bandit suppression Wu Hongyuan was stripped of office and arrested for trial.',
    'On jichou day, Wu Hongyuan was dismissed and arrested for botching Taiwan suppression.',
  ],
  s0863: [
    'On day xinmao, Li Hongzhang went to Jiangyin to supervise suppression.',
    'On xinmao day, Li Hongzhang took command at Jiangyin.',
  ],
  s0864: [
    'Chen Guorui was instructed to aid Mengcheng.',
    'Chen Guorui was told to relieve Mengcheng.',
  ],
  s0865: [
    'Shanqing\'s cavalry was transferred to aid Linhuai.',
    'Shanqing\'s horse column was sent to Linhuai.',
  ],
  s0866: [
    'Xi Lin sent troops to aid Pingliang.',
    'Xi Lin dispatched an army to Pingliang.',
  ],
  s0867: [
    'On day yiwei, Duo Longa\'s request was granted: Cao Kezhong was appointed Hezhou brigade commander, and hereafter provincial commanders were not to seek appointments on their own.',
    'On yiwei day, Cao Kezhong became Hezhou commander and future commander posts were not to be solicited privately.',
  ],
  s0868: [
    'Song Jingshi fled into Kaizhou.',
    'Song Jingshi slipped into Kaizhou.',
  ],
  s0869: [
    'Zhang Jixin was ordered to join Mu Teng\'a in planning Xi\'an\'s defense.',
    'Zhang Jixin and Mu Teng\'a were to organize Xi\'an\'s defense.',
  ],
  s0870: [
    'On day dingyou, Guizhou troops stormed the bandit nest at Tongzi.',
    'On dingyou day, Guizhou forces took the Tongzi bandit nest.',
  ],
  s0871: [
    'Pu\'an fell but was soon recovered.',
    'Pu\'an was lost and quickly retaken.',
  ],
  s0872: [
    'Liu Rong was given command over Mao Zhenshou\'s and Li Yunlin\'s armies.',
    'Liu Rong took charge of Mao Zhenshou\'s and Li Yunlin\'s forces.',
  ],
  s0873: [
    'Troops from Urumqi and Aksu were transferred to help the Ili army resist Russia.',
    'Urumqi and Aksu troops were sent to reinforce Ili against Russia.',
  ],
  s0874: [
    'The Kazakh Khan Chuo Tan was permitted to succeed to the khanate.',
    'Kazakh Khan Chuo Tan was allowed to inherit the title.',
  ],
  s0875: [
    'On day jihai, Lin Wencha was urged to cross to Taiwan to suppress bandits.',
    'On jihai day, Lin Wencha was told to cross to Taiwan and fight bandits.',
  ],
  s0876: [
    'On day gengzi, Hui rebels took Pingliang.',
    'On gengzi day, Hui rebels captured Pingliang.',
  ],
  s0877: [
    'On day xinchou, Yan Jingming moved his army to Dongchang.',
    'On xinchou day, Yan Jingming shifted his force to Dongchang.',
  ],
  s0878: [
    'The Dutch treaty revision was concluded.',
    'The Dutch treaty exchange was settled.',
  ],
  s0879: [
    'Liu Changyou went to Jingzhou to supervise suppression.',
    'Liu Changyou took command at Jingzhou.',
  ],
  s0880: [
    'That month, tax arrears were remitted for Qinzhou and other districts.',
    'That month, Qinzhou and other districts had overdue taxes forgiven.',
  ],
  s0881: [
    'Ninth month, new moon day yisi: Ma Dezhao was ordered to the Qingyang camp.',
    'In month 9, on the new moon yisi, Ma Dezhao was sent to the Qingyang camp.',
  ],
  s0882: [
    'Shen Baozhen asked leave for illness; he was comforted, retained, and granted leave.',
    'Shen Baozhen sought sick leave; the court kept him in post and granted time off.',
  ],
  s0883: [
    'On day wushen, Li Hongzhang\'s request to transfer magistrate Ding Richang to Shanghai to supervise firearms manufacture was granted.',
    'On wushen day, Ding Richang was sent to Shanghai under Li Hongzhang to make firearms.',
  ],
  s0884: [
    'Shiquan magistrate Lu Kunlian led militia to suppress bandits; an edict praised him.',
    'Lu Kunlian of Shiquan led militia against bandits and was praised by edict.',
  ],
  s0885: [
    'On day gengxu, Zhejiang troops took Fuyang.',
    'On gengxu day, Zhejiang forces captured Fuyang.',
  ],
  s0886: [
    'On day xinhai, Guangdong troops took Guanghaizhai city.',
    'On xinhai day, Guangdong forces seized Guanghaizhai.',
  ],
  s0887: [
    'On day guichou, Sengge Rinchen was told to send artillery to Mengcheng to help suppress bandits.',
    'On guichou day, Sengge Rinchen was ordered to bring guns to Mengcheng.',
  ],
  s0888: [
    'On day jiayin, Guangdong rebels took Chenggu.',
    'On jiayin day, Cantonese rebels seized Chenggu.',
  ],
  s0889: [
    'Nian chieftain Zhang Zongyu and others fled south from Ruzhou.',
    'Zhang Zongyu and other Nian leaders broke south from Ruzhou.',
  ],
  s0890: [
    'On day yimao, Duo Longa\'s army recovered Gaoling.',
    'On yimao day, Duo Longa retook Gaoling.',
  ],
  s0891: [
    'On day bingchen, Mu Long\'a was stripped of office for an untruthful memorial reply.',
    'On bingchen day, Mu Long\'a was dismissed for a false report.',
  ],
  s0892: [
    'Duo Longa was transferred as Xi\'an general.',
    'Duo Longa became Xi\'an general.',
  ],
  s0893: [
    'Fuming\'a was made Jingzhou general.',
    'Fuming\'a took Jingzhou as general.',
  ],
  s0894: [
    'On day xinyou, Duo Longa\'s army stormed bandit nests at Sujiagou and Weicheng.',
    'On xinyou day, Duo Longa cleared Sujiagou and Weicheng bandit nests.',
  ],
  s0895: [
    'On day jiazi, Guangdong rebels took Huitong and Suining but they were soon recovered.',
    'On jiazi day, Huitong and Suining fell to Cantonese rebels but were quickly retaken.',
  ],
  s0896: [
    'Shaanxi militia recovered Mian county.',
    'Shaanxi local forces retook Mian county.',
  ],
  s0897: [
    'On day yichou, Li Xiucheng aided Wuxi; Cheng Xueqi and others drove him back.',
    'On yichou day, Li Xiucheng relieved Wuxi and Cheng Xueqi beat him off.',
  ],
  s0898: [
    'On day jisi, Sengge Rinchen fully pacified Song Jingshi\'s band.',
    'On jisi day, Sengge Rinchen wiped out Song Jingshi\'s force.',
  ],
  s0899: [
    'Jingshi escaped.',
    'Song Jingshi fled.',
  ],
  s0900: [
    'For the defeat of the Sichuan relief army to Shaanxi, brigade commander Xiao Qinggao was stripped of rank but kept in camp.',
    'After the Sichuan relief force failed in Shaanxi, Xiao Qinggao lost his command but remained with the army.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b09.mjs <translation.json>'
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
