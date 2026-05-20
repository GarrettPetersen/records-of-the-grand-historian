#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day bingxu, the Emperor went on the hunting encirclement at Shanyanwohe.',
    'On bingxu day, the Emperor hunted at Shanyanwohe.',
  ],
  s1002: [
    'On day dinghai, the Emperor went on the hunting encirclement at Bayan.',
    'On dinghai day, the Emperor hunted at Bayan.',
  ],
  s1003: [
    'E\'mida was transferred to be general at Jingzhou.',
    'E\'mida became Jingzhou general.',
  ],
  s1004: [
    'Bodi was transferred to be Jilin general; Fusen was made Heilongjiang general.',
    'Bodi went to Jilin and Fusen to Heilongjiang as generals.',
  ],
  s1005: [
    'On day wuzi, the Emperor went on the hunting encirclement at Niyamanzhu.',
    'On wuzi day, the Emperor hunted at Niyamanzhu.',
  ],
  s1006: [
    'On day jichou, the Emperor went on the hunting encirclement at Zhudun.',
    'On jichou day, the Emperor hunted at Zhudun.',
  ],
  s1007: [
    'On day gengyin, the Emperor went on the hunting encirclement outside Ying\'e Pass.',
    'On gengyin day, the Emperor hunted outside Ying\'e Pass.',
  ],
  s1008: [
    'That day, the imperial progress halted at the Usu River.',
    'The court halted that day at the Usu River.',
  ],
  s1009: [
    'On day jiawu, Xu Rong was stripped of office because all counts in his impeachment of Xie Jishi for greed and license proved false; Sun Jiagan was also dismissed for colluding in the verdict.',
    'Xu Rong and Sun Jiagan were dismissed over the false impeachment of Xie Jishi.',
  ],
  s1010: [
    'Acting grain intendant Cang De was found guilty on public denunciation and given a merit record.',
    'Cang De was rewarded after a public denunciation proved true.',
  ],
  s1011: [
    'The Emperor halted the progress at Muqi Village.',
    'The court halted at Muqi Village.',
  ],
  s1012: [
    'On day yiwei, the Emperor, accompanying the Empress Dowager, visited Yong Mausoleum.',
    'On yiwei day, the Emperor with the Empress Dowager visited Yong Mausoleum.',
  ],
  s1013: [
    'On day bingshen, the great feast ritual was performed.',
    'On bingshen day, the great feast offering was made.',
  ],
  s1014: [
    'An order halted Gu Cong\'s proposal to limit private farmland.',
    'Gu Cong\'s plan to cap private land was stopped.',
  ],
  s1015: [
    'Drought in Xiangfu and twenty other districts of Henan, and in Qidong and eighteen other districts and guards of Shandong, was relieved; land-tax quotas were remitted in varying degrees.',
    'Henan and Shandong drought districts were relieved and taxes remitted.',
  ],
  s1016: [
    'On day xinchou, Fuling Mausoleum was visited.',
    'On xinchou day, the Emperor visited Fuling.',
  ],
  s1017: [
    'On day renyin, the great feast ritual was performed.',
    'On renyin day, the great feast offering was made.',
  ],
  s1018: [
    'Zhaoling Mausoleum was visited.',
    'The Emperor visited Zhaoling.',
  ],
  s1019: [
    'On day guimao, the great feast ritual was performed.',
    'On guimao day, the great feast offering was made.',
  ],
  s1020: [
    'The Emperor, accompanying the Empress Dowager, halted the progress at Shengjing.',
    'The court with the Empress Dowager halted at Shengjing.',
  ],
  s1021: [
    'The King of Korea, Li Yin, sent an attendant minister to Shengjing with tribute goods.',
    'Korean King Li Yin sent tribute to Shengjing.',
  ],
  s1022: [
    'On day jiachen, the Emperor led the civil and military officials to the Empress Dowager\'s palace to perform congratulations.',
    'On jiachen day, officials congratulated the Empress Dowager.',
  ],
  s1023: [
    'At Chongzheng Hall the Emperor received congratulations.',
    'Congratulations were received at Chongzheng Hall.',
  ],
  s1024: [
    'Banquets were granted to the civil and military officials and the Korean envoy.',
    'Officials and the Korean envoy were banqueted.',
  ],
  s1025: [
    'At Dazheng Hall the Emperor granted a court libation.',
    'A court libation was granted at Dazheng Hall.',
  ],
  s1026: [
    'An edict of grace was promulgated with distinctions.',
    'An edict granted grace in varying degrees.',
  ],
  s1027: [
    'On day bingwu, the Emperor offered sacrifice at the Confucian temple.',
    'On bingwu day, the Emperor sacrificed at the Confucian temple.',
  ],
  s1028: [
    'He visited the Parade Ground for a grand review.',
    'A grand martial review was held at the Parade Ground.',
  ],
  s1029: [
    'An edict ordered princes, imperial clansmen, and great ministers to keep rites pure, instruct soldiers and people, and not forget the old simple customs.',
    'Princes and ministers were urged to preserve simple Manchu customs.',
  ],
  s1030: [
    'On day dingwei, the Emperor personally offered libation at the tombs of Prince Keqin Yuetuo and Merit King Yangguli.',
    'On dingwei day, the Emperor sacrificed at Yuetuo\'s and Yangguli\'s tombs.',
  ],
  s1031: [
    'Officials were sent to offer distant sacrifice at Changbai Mountain, Beizhen Yiwulü Mountain, and the tomb of Emperor Taizu of Liao.',
    'Envoys offered distant sacrifice at Changbai, Yiwulü, and the Liao founder\'s tomb.',
  ],
  s1032: [
    'On day wushen, the Emperor personally offered libation at the tombs of Duke Hongyi E\'iyetu and Duke Zhiyi Fei Yingdong.',
    'On wushen day, the Emperor sacrificed at E\'iyetu\'s and Fei Yingdong\'s tombs.',
  ],
  s1033: [
    'Henan was exempted from arrears of supplementary levies before Qianlong year 7.',
    'Henan\'s supplementary levy arrears before year 7 were remitted.',
  ],
  s1034: [
    'Winter, tenth month, day gengxu, first day of the month: the Emperor presided at Dazheng Hall and granted a banquet to the accompanying princes and great ministers before Fenghuang Tower.',
    'On the first of the tenth month, the Emperor banqueted the entourage at Dazheng Hall.',
  ],
  s1035: [
    'An edict ordered princes and imperial clansmen to abolish corrupt practices and keep to the old regulations.',
    'Princes were told to end bad habits and follow old rules.',
  ],
  s1036: [
    'Banner lands at Shengjing, Xingjing, and fourteen other places were exempted from this year\'s quotas and from arrears of Qianlong year 7.',
    'Shengjing-area banner land tax for the year and year-7 arrears were remitted.',
  ],
  s1037: [
    'The Emperor composed the "Rhapsody on Shengjing."',
    'The Emperor wrote the Rhapsody on Shengjing.',
  ],
  s1038: [
    'On day xinhai, the Emperor, accompanying the Empress Dowager, turned the progress homeward.',
    'On xinhai day, the court with the Empress Dowager set out for home.',
  ],
  s1039: [
    'On day yichou, flood in Nanhai and six other districts of Guangdong was relieved.',
    'On yichou day, Guangdong flood districts were relieved.',
  ],
  s1040: [
    'That day, the Emperor ascended Wanghai Tower and halted at Wenshu Nunnery.',
    'The Emperor climbed Wanghai Tower and halted at Wenshu Nunnery.',
  ],
  s1041: [
    'On day dingmao, disaster districts in Zhili were ordered to sell grain at reduced prices.',
    'On dingmao day, Zhili disaster areas got subsidized grain sales.',
  ],
  s1042: [
    'On day jisi, ministers of the boards and courts in the capital evaluation were ordered each to recommend a worthy man to succeed himself.',
    'On jisi day, capital ministers were to nominate successors in their evaluations.',
  ],
  s1043: [
    'Liu Yuyi was made Minister of Revenue; Aligun was made governor of Shanxi.',
    'Liu Yuyi became Revenue minister and Aligun Shanxi governor.',
  ],
  s1044: [
    'Xu Ben was ordered to continue concurrent charge of the Ministry of Revenue.',
    'Xu Ben kept concurrent charge of Revenue.',
  ],
  s1045: [
    'Chen Hongmou was transferred to be governor of Shaanxi; Saileng\'e was made governor of Jiangxi.',
    'Chen Hongmou went to Shaanxi and Saileng\'e to Jiangxi.',
  ],
  s1046: [
    'On day gengwu, drought in Xiangfu and fourteen other districts of Henan was relieved.',
    'On gengwu day, Henan drought areas were relieved.',
  ],
  s1047: [
    'On day jiaxu, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On jiaxu day, the court with the Empress Dowager reached Beijing.',
  ],
  s1048: [
    'On day dingchou, because the tomb-visit rites were complete, the Emperor led the civil and military officials to the Empress Dowager\'s palace to perform congratulations.',
    'On dingchou day, officials congratulated the Empress Dowager after the tomb tour.',
  ],
  s1049: [
    'At the Hall of Supreme Harmony the princes, great ministers, and various officials presented memorials of felicitation in court audience.',
    'Felicitation was held at the Hall of Supreme Harmony.',
  ],
  s1050: [
    'Eleventh month: flood in Wuwei, Anhui, was relieved, and land-tax quotas were remitted.',
    'In the eleventh month, Wuwei flood victims were relieved and taxes remitted.',
  ],
  s1051: [
    'On day renwu, flood, insect, wind, and hail disasters in Didao and twenty-four other districts of Gansu were relieved.',
    'On renwu day, twenty-four Gansu districts got disaster relief.',
  ],
  s1052: [
    'On day gengyin, the King of Annam, Le Duy Yi, memorialized thanks for sacrificial grants and enfeoffment favor and presented tribute goods.',
    'On gengyin day, Annam\'s Le Duy Yi thanked the court and sent tribute.',
  ],
  s1053: [
    'On day xinchou, flood in Wanzhou and fourteen other districts of Guangdong, and drought in three districts of Taiwan, Fujian, were relieved.',
    'On xinchou day, Guangdong floods and Fujian Taiwan drought were relieved.',
  ],
  s1054: [
    'On day renyin, granary grain was lent to banner soldiers and others in Heilongjiang stricken by drought and frost.',
    'On renyin day, Heilongjiang troops got lent grain after drought and frost.',
  ],
  s1055: [
    'Drought in Quwo and ten other prefectures of Shanxi was relieved.',
    'Shanxi drought districts were relieved.',
  ],
  s1056: [
    'On day guimao, drought in Tianjin and two other districts of Zhili was relieved.',
    'On guimao day, Tianjin-area drought was relieved.',
  ],
  s1057: [
    'On day dingwei, drought in Shouzhou and nine other districts and guards of Anhui was relieved.',
    'On dingwei day, Anhui drought areas were relieved.',
  ],
  s1058: [
    'On day jiyou, one-tenth of land tax along the tomb-visit route was remitted.',
    'On jiyou day, one-tenth of transit land tax was remitted.',
  ],
  s1059: [
    'Twelfth month, day gengxu, first day of the month: drought in Wuchuan District, Guangdong, was relieved.',
    'On the first of the twelfth month, Wuchuan drought was relieved.',
  ],
  s1060: [
    'On day xinhai, Shi Yizhi was ordered to assist as Grand Secretary.',
    'On xinhai day, Shi Yizhi was made assisting Grand Secretary.',
  ],
  s1061: [
    'On day yimao, drought in Lingxian and twelve other districts and guards of Shandong was relieved.',
    'On yimao day, Shandong drought districts were relieved.',
  ],
  s1062: [
    'The Duanhui Crown Prince was buried in the garden mausoleum on Zhuhua Mountain.',
    'Crown Prince Duanhui was buried at Zhuhua Mountain.',
  ],
  s1063: [
    'On day xinyou, Grand Secretary Fumin asked to retire.',
    'On xinyou day, Grand Secretary Fumin sought retirement.',
  ],
  s1064: [
    'A warm edict urged him to remain.',
    'A warm edict kept him at post.',
  ],
  s1065: [
    'On day jiazi, Dzungar tribute envoys including Tudou arrived at the capital, thanking the favor of livestock aid for people entering Tibet by the Gas route; tribute goods were also presented.',
    'On jiazi day, Dzungar envoys thanked aid for the Tibet route and brought tribute.',
  ],
  s1066: [
    'On day yichou, because Chen Dehua had secretly memorialized in the case of his younger brother Shaanxi surveillance commissioner Chen Dezheng\'s petition, the Ministry was ordered to deliberate severely.',
    'On yichou day, Chen Dehua was severely investigated for hiding his brother\'s petition.',
  ],
  s1067: [
    'Dezheng was stripped of office and put on trial.',
    'Chen Dezheng was dismissed and tried.',
  ],
  s1068: [
    'On day dingmao, because of a stellar omen as warning, an edict ordered self-examination and austerity.',
    'On dingmao day, a stellar omen prompted an austerity edict.',
  ],
  s1069: [
    'Ninth year, spring, first month, day xinsi: because Xu Ben was ill, Shi Yizhi was made Grand Secretary.',
    'In the first month of year 9, Shi Yizhi became Grand Secretary as Xu Ben fell ill.',
  ],
  s1070: [
    'Liu Yuyi was made Minister of Personnel and assisting Grand Secretary; Zhang Kai was made Minister of Revenue.',
    'Liu Yuyi became Personnel minister and assisting secretary; Zhang Kai, Revenue minister.',
  ],
  s1071: [
    'Chen Dehua was dismissed; Wang Anguo was made Minister of War.',
    'Chen Dehua was removed; Wang Anguo became War minister.',
  ],
  s1072: [
    'On day renwu, the Emperor visited Yingtai.',
    'On renwu day, the Emperor visited Yingtai.',
  ],
  s1073: [
    'In the great tent enclosure, a banquet was granted to the Dzungar envoy Tudou; he was ordered to take the last place among the first-rank ministers.',
    'Tudou was banqueted and seated last among first-rank ministers.',
  ],
  s1074: [
    'Because Galdan Tseren was submissive and Tudou was sincere and respectful, Tudou was summoned forward, granted three cups of wine, and richly rewarded.',
    'Tudou was summoned, given three cups, and richly rewarded for Dzungar sincerity.',
  ],
  s1075: [
    'Provincial, prefectural, and district officials were admonished to nurture and teach together.',
    'Officials were told to combine nurture and instruction.',
  ],
  s1076: [
    'On day dinghai, disaster in Tianjin and eleven other districts of Zhili was relieved.',
    'On dinghai day, Tianjin-area disasters were relieved.',
  ],
  s1077: [
    'On day gengzi, Wang Anguo was excused for mourning; Peng Weixin was made Minister of War.',
    'On gengzi day, Wang Anguo left for mourning and Peng Weixin became War minister.',
  ],
  s1078: [
    'Xu Rong was appointed acting governor of Hubei.',
    'Xu Rong became acting Hubei governor.',
  ],
  s1079: [
    'Shi Yizhi was appointed Grand Secretary of the Hall of Literary Depth.',
    'Shi Yizhi became Wenyuan Hall Grand Secretary.',
  ],
  s1080: [
    'Korea presented tribute.',
    'Korea sent tribute.',
  ],
  s1081: [
    'Neqin was given the seal of Imperial Commissioner.',
    'Neqin received an imperial commissioner seal.',
  ],
  s1082: [
    'On day guimao, the Emperor, accompanying the Empress Dowager, proceeded to Tai Mausoleum.',
    'On guimao day, the Emperor with the Empress Dowager went to Tai Mausoleum.',
  ],
  s1083: [
    'On day bingwu, the Emperor proceeded to Tai Mausoleum.',
    'On bingwu day, the Emperor visited Tai Mausoleum.',
  ],
  s1084: [
    'That day, accompanying the Empress Dowager, the progress turned homeward.',
    'The Empress Dowager returned with the court that day.',
  ],
  s1085: [
    'Second month: the Emperor, accompanying the Empress Dowager, visited the Southern Park.',
    'In the second month, the court with the Empress Dowager went to the Southern Park.',
  ],
  s1086: [
    'On day bingchen, because supervising secretary Chen Daqi and others memorialized, the order appointing Xu Rong acting governor of Hubei was suspended; Yan Sisheng was kept in post, and censors were again warned against colluding in impeachments.',
    'On bingchen day, Xu Rong\'s Hubei appointment was halted and censors warned anew.',
  ],
  s1087: [
    'Land-tax quotas for last year\'s flood in Tongcheng and eight other districts of Anhui were remitted.',
    'Anhui flood districts\' last-year tax was remitted.',
  ],
  s1088: [
    'Land-tax quotas for drought in three districts of Taiwan, Fujian, were remitted, and relief was also granted.',
    'Fujian Taiwan drought tax was remitted and victims relieved.',
  ],
  s1089: [
    'On day jiazi, Chen Dehua was demoted and transferred.',
    'On jiazi day, Chen Dehua was demoted.',
  ],
  s1090: [
    'On day dingmao, flood in Zhan and Yi, two districts of Yunnan, was relieved.',
    'On dingmao day, Yunnan flood districts were relieved.',
  ],
  s1091: [
    'On day dingchou, Minister of Revenue Zhang Kai died; A\'ersai replaced him; E\'mida was made governor-general of Huguang.',
    'On dingchou day, Zhang Kai died; A\'ersai succeeded him and E\'mida became Huguang governor-general.',
  ],
  s1092: [
    'Third month, day guawei: Wang Youdun was made Minister of Works.',
    'In the third month, on guawei day, Wang Youdun became Works minister.',
  ],
  s1093: [
    'On day dinghai, land-tax quotas for drought in Peixian, Jiangsu, and Zhongmou and five other districts of Henan were remitted.',
    'On dinghai day, Jiangsu and Henan drought tax was remitted.',
  ],
  s1094: [
    'On day dingyou, Bodi was transferred to be Xi\'an general.',
    'On dingyou day, Bodi became Xi\'an general.',
  ],
  s1095: [
    'Baling\'a was made general at Ningguta.',
    'Baling\'a became Ningguta general.',
  ],
  s1096: [
    'On day bingwu, drought in Dezhou and five other districts and guards of Shandong was relieved.',
    'On bingwu day, Shandong drought areas were relieved.',
  ],
  s1097: [
    'Because Neqin memorialized that garrisons in Henan and Jiangnan were neglected on inspection, the Emperor said: "It is clear that not one provincial grandee fails to deceive Us; We must punish one to warn a hundred.',
    'When Neqin reported Henan and Jiangnan troops neglected, the Emperor demanded punishing one grandee to warn the rest.',
  ],
  s1098: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s1099: [
    'Fourth month, day wushen, first day of the month: the Altar of the First Silkworm was completed.',
    'On the first of the fourth month, the First Silkworm altar was completed.',
  ],
  s1100: [
    'On day yimao, the Emperor proceeded to the Circular Mound for the great rain-prayer ritual; a special edict ordered ritual abridged to show sincere supplication.',
    'On yimao day, the Emperor prayed for rain at the Circular Mound with simplified rites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b11.mjs <translation.json>'
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
