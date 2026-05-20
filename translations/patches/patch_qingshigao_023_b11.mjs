#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day xinchou, the Saogou breach in Shandong was closed.',
    'On xinchou day the Saogou breach in Shandong was sealed.',
  ],
  s1002: [
    'Taiwan\'s old arrears of tribute grain were remitted.',
    'Old Taiwan tribute-grain arrears were forgiven.',
  ],
  s1003: [
    'On day guimao, quota taxes in drought-stricken Qitai were remitted.',
    'On guimao day Qitai\'s drought quota taxes were remitted.',
  ],
  s1004: [
    'On day bingchen, Te\'erqing\'a and others were ordered to drill troops with Mutushan.',
    'On bingchen day Te\'erqing\'a and others were told to train troops under Mutushan.',
  ],
  s1005: [
    'On day jiazi, because of the tomb visit, the metropolitan examination entry was moved to the tenth of the third month.',
    'On jiazi day the palace examination was postponed to the tenth of month 3 for the tomb visit.',
  ],
  s1006: [
    'Second month, on the yichou new moon, the south bank of the Yellow River in Shandong breached.',
    'At the second-month new moon, yichou, Shandong\'s Yellow River south bank broke.',
  ],
  s1007: [
    'On day jiaxu, Zhang Yao was sent to inspect the He Wangzhuang breach.',
    'On jiaxu day Zhang Yao was sent to survey the He Wangzhuang break.',
  ],
  s1008: [
    'On day jimao, accumulated quota taxes from flooding at Xupu were remitted.',
    'On jimao day Xupu\'s long-flood quota taxes were forgiven.',
  ],
  s1009: [
    'On day wuzi, Suihua Subprefecture in Heilongjiang was established.',
    'On wuzi day Suihua Subprefecture was set up in Heilongjiang.',
  ],
  s1010: [
    'On day xinmao, the Emperor escorted the Empress Dowager to the Eastern Tombs; one-tenth of tax grain along the route was remitted.',
    'On xinmao day the Emperor took the empress dowager to the Eastern Tombs and remitted one-tenth of route taxes.',
  ],
  s1011: [
    'Third month, on day yimou, the imperial tombs were visited.',
    'In the third month, on yimou day, the imperial tombs were visited.',
  ],
  s1012: [
    'The Emperor went to the Ding Eastern Tombs.',
    'The Emperor proceeded to the Ding Eastern Tombs.',
  ],
  s1013: [
    'On day gengzi, the court returned from the Eastern Tombs.',
    'On gengzi day the court returned from the Eastern Tombs.',
  ],
  s1014: [
    'On day guichou, disaster relief was sent to Guangning.',
    'On guichou day Guangning received disaster relief.',
  ],
  s1015: [
    'That month, one hundred thousand piculs of new tribute grain from Shandong were kept to relieve those flooded at He Wangzhuang and in Zhangqiu, Jiyang, and Huimin.',
    'That month 100,000 piculs of new Shandong grain were held for flood victims at He Wangzhuang, Zhangqiu, Jiyang, and Huimin.',
  ],
  s1016: [
    'Summer, fourth month, day wuzi: Zhao Yijiong and three hundred thirty-nine others received jinshi degrees and appointment ranks with distinctions.',
    'In summer, month 4, wuzi, Zhao Yijiong and 339 others received jinshi degrees with distinctions.',
  ],
  s1017: [
    'That month, Qiubei earthquake and Guangxi prefecture fire—relief was sent.',
    'That month relief was sent for the Qiubei earthquake and the Guangxi prefecture fire.',
  ],
  s1018: [
    'Fifth month, day gengzi: over four hundred Taiwan aboriginal communities, more than seventy thousand people, submitted.',
    'In month 5, gengzi, more than 400 Taiwan aboriginal communities and 70,000 people submitted.',
  ],
  s1019: [
    'Hail disaster relief was sent to Lintong and other counties.',
    'Lintong and other counties received hail-disaster relief.',
  ],
  s1020: [
    'On day renyin, the Yangjiang naval commander was abolished and a Beihai combined army-and-navy commander was established.',
    'On renyin day Yangjiang\'s naval commander was cut and a Beihai army-navy commander was created.',
  ],
  s1021: [
    'The Gaozhou land-route commander was changed to a combined army-and-navy commander.',
    'Gaozhou\'s land commander became a combined army-and-navy commander.',
  ],
  s1022: [
    'Sixth month, day renshen: an empress dowager rescript ordered the Board of Astronomy to choose the date for the Emperor\'s personal rule in the first month of the coming year.',
    'In month 6, renshen, the empress dowager told the Board of Astronomy to set the emperor\'s personal-rule date for next first month.',
  ],
  s1023: [
    'On day jiaxu, the Haiyan stone seawall was repaired.',
    'On jiaxu day the Haiyan stone seawall was restored.',
  ],
  s1024: [
    'On day bingzi, Prince Chun and princes and ministers jointly memorialized asking the Empress Dowager to continue regency; it was not granted.',
    'On bingzi day Prince Chun and others asked the empress dowager to keep regency and were refused.',
  ],
  s1025: [
    'The Emperor\'s personal rule was fixed for the fifteenth of the first month of the coming year; grand councilors were ordered to deliberate and standardize the coinage law.',
    'Personal rule was set for the 15th of next first month; the grand council was told to settle coinage law.',
  ],
  s1026: [
    'On day gengchen, Prince Chun, Prince Li, and others again asked for continued regency; Minister Xi Zhen and Censor Gui Xian also spoke; the empress dowager reluctantly consented.',
    'On gengchen day Prince Chun and Prince Li again sought regency; Xi Zhen and Gui Xian joined in; the empress dowager yielded.',
  ],
  s1027: [
    'Prince Chun was ordered to continue managing affairs.',
    'Prince Chun was told to keep handling affairs.',
  ],
  s1028: [
    'Seventh month, day jiawu: the Moban chieftain asked to join the empire; the request was declined.',
    'In month 7, jiawu, the Moban chief sought annexation and was turned down.',
  ],
  s1029: [
    'On day dingyou, Jin Shun died.',
    'On dingyou day Jin Shun died.',
  ],
  s1030: [
    'On day xinchou, fifty thousand piculs of Jiangsu tribute grain were kept for Shuntian and Baoding relief needs.',
    'On xinchou day 50,000 piculs of Jiangsu grain were held for Shuntian and Baoding relief.',
  ],
  s1031: [
    'On day yisi, the deliberated coinage regulations were submitted.',
    'On yisi day the finalized coinage regulations were memorialized.',
  ],
  s1032: [
    'Approval was granted.',
    'The plan was approved.',
  ],
  s1033: [
    'On day jiayin, flood relief was sent to Taiyuan and other counties.',
    'On jiayin day Taiyuan and other counties received flood relief.',
  ],
  s1034: [
    'Eighth month, day renxu: Serenge\'e was made Ili general.',
    'In month 8, renxu, Serenge\'e became Ili general.',
  ],
  s1035: [
    'Flood relief was sent along the Re Liao River.',
    'Re Liao River flood victims received relief.',
  ],
  s1036: [
    'On day yichou, Prince Li and the court asked to add an honorific title to the Empress Dowager; the rescript refused.',
    'On yichou day Prince Li and the court sought a new honorific for the empress dowager and were refused.',
  ],
  s1037: [
    'On day dingmao, another fifty thousand piculs of northern Jiangsu tribute grain were sent for Shuntian and Tongzhou floods; twenty thousand taels from the treasury were distributed to victims; arrears on wasteland in Xianning and other Shaanxi places were remitted.',
    'On dingmao day another 50,000 piculs went to Shuntian and Tongzhou floods, 20,000 taels were given out, and Shaanxi wasteland arrears were forgiven.',
  ],
  s1038: [
    'On day wuchen, because the North Canal breach overflowed, one hundred thousand taels from the treasury were allotted for emergency relief in the Yongping prefectures, and another twenty thousand taels from the inner treasury were added.',
    'On wuchen day the North Canal overflow brought 100,000 treasury taels for Yongping relief plus 20,000 inner-treasury taels.',
  ],
  s1039: [
    'On day bingzi, the Guangxi Taiping Guishun circuit was added and the governor-general was moved to Longzhou.',
    'On bingzi day Guangxi\'s Taiping Guishun circuit was created and the governor-general went to Longzhou.',
  ],
  s1040: [
    'A Liuching brigade commander was added, stationed at Liuzhou.',
    'A Liuching brigade commander was set up at Liuzhou.',
  ],
  s1041: [
    'On day gengchen, the Huairou Baihe overflow point was built up.',
    'On gengchen day the Huairou Baihe overflow was repaired.',
  ],
  s1042: [
    'On day yiyou, Censor Zhu Yixin memorialized self-examination because of disasters and warned of eunuch abuses; he said that as Prince Chun inspected the Beiyang fleet, chief eunuch Li Lianying followed, fearing a Tang-style military-supervisor precedent.',
    'On yiyou day Zhu Yixin urged disaster self-reform and warned that Li Lianying followed Prince Chun\'s Beiyang inspection like a Tang eunuch supervisor.',
  ],
  s1043: [
    'An empress dowager rescript ordered a reply memorial.',
    'The empress dowager ordered a memorial in reply.',
  ],
  s1044: [
    'Soon after the memorial was entered, he was demoted to clerk for obstinate error.',
    'When the memorial came in, he was cut to clerk for obstinacy.',
  ],
  s1045: [
    'Ninth month, on the xinmao new moon, flood relief was sent to Fengtian and Zhejiang.',
    'At the ninth-month new moon, xinmao, Fengtian and Zhejiang received flood relief.',
  ],
  s1046: [
    'On day guisi, Gansu hail and flood disasters were relieved; Ba and Nanzheng flood disasters were also relieved.',
    'On guisi day Gansu hail and flood victims were helped, as were Ba and Nanzheng.',
  ],
  s1047: [
    'On day dingyou, because of the Zhili flood, rents for banner estates in each prefecture and other rents were reduced.',
    'On dingyou day Zhili flood rents on banner estates and other dues were cut.',
  ],
  s1048: [
    'On day gengzi, Bao Chao died.',
    'On gengzi day Bao Chao died.',
  ],
  s1049: [
    'On day yisi, hail disaster relief was sent to Guangshan.',
    'On yisi day Guangshan received hail relief.',
  ],
  s1050: [
    'On day bingwu, Liu Mingchuan suppressed the rebel aborigines of Sulumanabang.',
    'On bingwu day Liu Mingchuan put down Sulumanabang rebels.',
  ],
  s1051: [
    'On day jiayin, flood relief was sent to Shangrao and other counties.',
    'On jiayin day Shangrao and other counties received flood relief.',
  ],
  s1052: [
    'Eleventh month, on the gengyin new moon, the Shouzhang breach was closed.',
    'At the eleventh-month new moon, gengyin, the Shouzhang breach was sealed.',
  ],
  s1053: [
    'On day yisi, Xu Yansu and Tang Jiong were pardoned; Xu was exiled to Xinjiang and Tang to Yunnan.',
    'On yisi day Xu Yansu and Tang Jiong were pardoned; Xu went to Xinjiang and Tang to Yunnan.',
  ],
  s1054: [
    'On day dingwei, Zeng Jize was ordered to serve at the Zongli Yamen.',
    'On dingwei day Zeng Jize was told to serve at the Zongli Yamen.',
  ],
  s1055: [
    'On day gengxu, another thirty thousand piculs of capital granary grain were allotted for Shuntian spring relief.',
    'On gengxu day another 30,000 piculs of capital grain were set aside for Shuntian spring relief.',
  ],
  s1056: [
    'On day bingchen, at the winter solstice heaven was worshipped at the Round Mound Altar; the Emperor attended in person for the first time.',
    'On bingchen day, winter solstice, the emperor worshipped heaven at the Round Mound for the first time in person.',
  ],
  s1057: [
    'Quota taxes at Longkecheng were remitted.',
    'Longkecheng quota taxes were forgiven.',
  ],
  s1058: [
    'Twelfth month, day jiazi: waterlogged-land grain taxes in Anzhou, Hejian, and Longping were reduced.',
    'In month 12, jiazi, flooded-land taxes were cut in Anzhou, Hejian, and Longping.',
  ],
  s1059: [
    'On day dingmao, prayers were offered for snow.',
    'On dingmao day the court prayed for snow.',
  ],
  s1060: [
    'On day gengchen, an empress dowager rescript again ordered Zeng Guoquan and others to deliberate treatment of the Liang-Jiang waterways.',
    'On gengchen day the empress dowager again told Zeng Guoquan and others to plan Liang-Jiang river works.',
  ],
  s1061: [
    'On day dinghai, the joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On dinghai day the seasonal joint sacrifice was held at the Imperial Ancestral Temple.',
  ],
  s1062: [
    'That year, Korea paid tribute.',
    'That year Korea sent tribute.',
  ],
  s1063: [
    'In the thirteenth year, dinghai, spring, first month, on the jichou new moon, banquets were suspended.',
    'Year 13, spring 1, jichou new moon: court banquets were suspended.',
  ],
  s1064: [
    'On day xinchou, because of personal rule, officers were sent to announce to Heaven, the ancestral temples, and the altars of soil and grain; grain was prayed for at the Supreme Lord.',
    'On xinchou day, for personal rule, envoys announced to heaven, temples, and altars and prayed for grain.',
  ],
  s1065: [
    'On day guimao, the Emperor began personal rule, issued a proclamation to the empire, and granted a general amnesty with distinctions.',
    'On guimao day the emperor took personal rule, proclaimed empire-wide, and granted graded amnesty.',
  ],
  s1066: [
    'On day renzi, one hundred thousand piculs of Jiangsu tribute grain were sent to relieve Zhili disaster victims.',
    'On renzi day 100,000 piculs of Jiangsu grain went to Zhili disaster victims.',
  ],
  s1067: [
    'An empress dowager rescript ordered machinery purchased at Tianjin for minting, with one cash equal to one qian as the rate; inside and outside the capital none might deviate.',
    'The empress dowager ordered Tianjin machine minting at one cash per qian with no deviation capital-wide.',
  ],
  s1068: [
    'Second month, day renxu: rain and snow fell.',
    'In month 2, renxu, rain and snow fell.',
  ],
  s1069: [
    'On day xinyou, Gong Chong was sharply ordered to suppress horse bandits strictly and to reorganize the existing drilled troops.',
    'On xinyou day Gong Chong was told to crush horse bandits and straighten out drilled troops.',
  ],
  s1070: [
    'The Sichuan-Yunnan telegraph line was completed.',
    'The Sichuan-Yunnan telegraph line was finished.',
  ],
  s1071: [
    'On day wuchen, the Great Altar of Land and Grain was sacrificed to.',
    'On wuchen day the Great Altar of Land and Grain was sacrificed to.',
  ],
  s1072: [
    'On day xinsi, Tang Jiong was rewarded with provincial governor rank to supervise Yunnan mining affairs.',
    'On xinsi day Tang Jiong received governor rank to run Yunnan mining.',
  ],
  s1073: [
    'That month, an empress dowager rescript made Prince Chun\'s princedom perpetual without reduction; on great court affairs he was still to be consulted.',
    'That month the empress dowager made Prince Chun\'s princedom perpetual and kept him consulted on major affairs.',
  ],
  s1074: [
    'Third month, on the jichou new moon, the Emperor performed rites at the Hall of Imperial Ancestors for the first time.',
    'At the third-month new moon, jichou, the emperor first worshipped at the Hall of Imperial Ancestors.',
  ],
  s1075: [
    'On day yimou, the Emperor escorted the Empress Dowager to the Western Tombs; one-third of quota taxes along the route were remitted.',
    'On yimou day the emperor took the empress dowager to the Western Tombs and remitted one-third of route taxes.',
  ],
  s1076: [
    'On day jihai, the tombs were visited.',
    'On jihai day the tombs were visited.',
  ],
  s1077: [
    'On day jiachen, the court returned from the Western Tombs.',
    'On jiachen day the court returned from the Western Tombs.',
  ],
  s1078: [
    'On day xinsi, the God of Agriculture was sacrificed to; the Emperor personally plowed the ceremonial field, three furrows and then one more; henceforth this was done annually.',
    'On xinsi day the emperor sacrificed to the God of Agriculture, plowed three furrows plus one more, and made it annual.',
  ],
  s1079: [
    'On day jiayin, Liu Jintang asked to resign and return home for medical treatment; it was not granted.',
    'On jiayin day Liu Jintang\'s request to quit for home medical care was denied.',
  ],
  s1080: [
    'Three months\' leave were granted while he remained in office for recuperation.',
    'He was given three months\' leave to recuperate in office.',
  ],
  s1081: [
    'Eighty thousand taels from the Zhili provincial treasury were allotted to relieve famine victims in his jurisdiction.',
    '80,000 taels from the Zhili treasury went to famine victims under him.',
  ],
  s1082: [
    'Rent on land without grain in Wen\'an and other places was remitted.',
    'Rent on grainless land in Wen\'an and elsewhere was forgiven.',
  ],
  s1083: [
    'Summer, fourth month, on the wuwu new moon: offering was made at the Imperial Ancestral Temple.',
    'In summer, month 4, wuwu new moon, offering was made at the Imperial Ancestral Temple.',
  ],
  s1084: [
    'On day dingmao, Hanlin Reader-in-Waiting Lin Weiyuan was ordered to supervise the Taiwan railway and commercial affairs.',
    'On dingmao day Hanlin reader Lin Weiyuan was told to run Taiwan railway and commerce.',
  ],
  s1085: [
    'On day jisi, prayers were offered for rain.',
    'On jisi day the court prayed for rain.',
  ],
  s1086: [
    'On day bingzi, at the regular rain prayer heaven was worshipped at the Round Mound Altar.',
    'On bingzi day heaven was worshipped at the Round Mound at the regular rain prayer.',
  ],
  s1087: [
    'Intercalary fourth month, day jiyou: overdue taxes and levies in Jiangsu prefectures, counties, and garrisons were remitted.',
    'On intercalary month 4, jiyou, Jiangsu overdue taxes and levies were forgiven.',
  ],
  s1088: [
    'On day renzi, flood relief was sent to Kunming and other counties.',
    'On renzi day Kunming and other counties received flood relief.',
  ],
  s1089: [
    'Fifth month, day wuwu: at the summer solstice earth was worshipped at the Square Pond Altar.',
    'In month 5, wuwu, earth was worshipped at the Square Pond at the summer solstice.',
  ],
  s1090: [
    'On day jiwei, former Hanlin Bachelor Hong Jun was made envoy to Russia, Germany, Austria-Hungary, and the Netherlands; Court of Appeals president Liu Ruifen was made envoy to Britain, France, Italy, and Belgium.',
    'On jiwei day Hong Jun went to Russia, Germany, Austria-Hungary, and the Netherlands; Liu Ruifen to Britain, France, Italy, and Belgium.',
  ],
  s1091: [
    'On day guimao, flood relief was sent to Longzhou and other places.',
    'On guimao day Longzhou and other places received flood relief.',
  ],
  s1092: [
    'On day jiashen, rain fell.',
    'On jiashen day it rained.',
  ],
  s1093: [
    'Sixth month, on the dinghai new moon, flood relief was sent to Fuyang and its subordinates.',
    'At the sixth-month new moon, dinghai, Fuyang and dependencies received flood relief.',
  ],
  s1094: [
    'On day yisi, flood relief was sent to Huaining and other counties.',
    'On yisi day Huaining and other counties received flood relief.',
  ],
  s1095: [
    'On day dingwei, the river at Daxinzhuang in Kaizhou overflowed and flooded Shandong territory; fifty thousand piculs of new tribute grain were kept to relieve disaster victims in Puzhou and other places.',
    'On dingwei day Kaizhou\'s Daxinzhuang river flooded Shandong; 50,000 piculs of new grain were held for Puzhou victims.',
  ],
  s1096: [
    'On day gengxu, flood relief was sent to Luotian and Shishou.',
    'On gengxu day Luotian and Shishou received flood relief.',
  ],
  s1097: [
    'On day renzi, flood relief was sent to Wensu and Wushi.',
    'On renzi day Wensu and Wushi received flood relief.',
  ],
  s1098: [
    'On day guichou, hail disaster relief was sent to Lingyun.',
    'On guichou day Lingyun received hail relief.',
  ],
  s1099: [
    'Autumn, seventh month, on the bingchen new moon, there was an eclipse of the sun.',
    'In autumn, month 7, bingchen new moon, the sun was eclipsed.',
  ],
  s1100: [
    'On day gengshen, the Yongding and Chaobai rivers breached in succession.',
    'On gengshen day the Yongding and Chaobai rivers broke one after another.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b11.mjs <translation.json>'
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
