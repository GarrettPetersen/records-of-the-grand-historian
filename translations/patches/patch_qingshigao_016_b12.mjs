#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'That year, disaster land tax was remitted for eight counties in Zhili and three cities in Heilongjiang.',
    'That year, eight Zhili counties and three Heilongjiang posts lost disaster taxes.',
  ],
  s1102: [
    'Land tax was remitted for fields washed away or choked by rivers in Chengde in Fengtian, Dingzhou in Zhili, Dantu and Jiangyin in Jiangsu, Fengcheng in Jiangxi, Meng county in Henan, Houguan in Fujian, and other counties.',
    'Flood-wrecked fields in Chengde, Dingzhou, Dantu, Jiangyin, Fengcheng, Meng, Houguan, and elsewhere were tax-remitted.',
  ],
  s1103: [
    'Korea, Ryukyu, and Vietnam sent tribute.',
    'Korea, Ryukyu, and Vietnam paid tribute.',
  ],
  s1104: [
    'Year 23, wuyin, spring, first month, day wushen: a special edict ordered Songyun not to buy reputation by dispensing favors, in order to preserve his evening years.',
    'In Jiaqing 23, month 1, wushen, Songyun was told not to court popularity with favors.',
  ],
  s1105: [
    'On day jiayin, an edict said Mingliang had passed eighty and should limit labor and nourish his health; he need no longer enter attendance daily and was exempted from leading candidacies for imperial rescript.',
    'On jiayin, Mingliang at eighty was excused daily Grand Council attendance and leading rescript audiences.',
  ],
  s1106: [
    'Second month, day gengwu: Dai Junyuan and Hening were made Grand Councilors.',
    'In month 2, gengwu, Dai Junyuan and Hening joined the Grand Council.',
  ],
  s1107: [
    'Grand Secretary Dong Gao retired; he was ordered full salary.',
    'Dong Gao retired on full pay.',
  ],
  s1108: [
    'On day gengchen, the Emperor held the Classics lecture.',
    'On gengchen, the Emperor lectured on the Classics.',
  ],
  s1109: [
    'On day jichou, the Emperor reviewed the Firearms Brigade.',
    'On jichou, the Emperor reviewed the Firearms Brigade.',
  ],
  s1110: [
    'Third month, day gengzi: the Emperor visited the Western Tombs.',
    'In month 3, gengzi, the Emperor visited the Western Tombs.',
  ],
  s1111: [
    'On day gengxu, Zhang Xu was made Grand Secretary, Wang Tingzhen Minister of Rites, and Wu Fangpei Left Censor-in-Chief.',
    'On gengxu, Zhang Xu became grand secretary; Wang Tingzhen, minister of rites; Wu Fangpei, left censor-in-chief.',
  ],
  s1112: [
    'On day wuwu, the Emperor returned to the capital.',
    'On wuwu, the Emperor returned to Beijing.',
  ],
  s1113: [
    'Fourth month, new moon on day wuchen: there was a solar eclipse.',
    'At the fourth-month new moon, wuchen, there was an eclipse.',
  ],
  s1114: [
    'On day yihai, dusty haze wind.',
    'On yihai, a dusty haze wind blew.',
  ],
  s1115: [
    'On day bingzi, an edict said: "Yesterday at the third quarter of you, a violent wind came from the southeast; dust haze filled all sides and lamps had to be lit to distinguish colors.',
    'On bingzi, an edict said that at you hour yesterday a southeast gale brought dust so thick that lamps were needed to see.',
  ],
  s1116: [
    'The sign was very strange.',
    'The omen was very strange.',
  ],
  s1117: [
    'My heart was shaken and fearful in reflection; thinking on Heaven\'s reason for warning, consulting the Hong Fan on ominous signs and the meaning of constant wind as blame—all were caused by my governing matters unclearly and employing people improperly.',
    'The Emperor blamed unclear governance and bad appointments for the omen, citing the Hong Fan on constant wind.',
  ],
  s1118: [
    'Those with the duty to speak should embody my heart of fear on meeting disaster, discuss earnestly, and conceal nothing.',
    'Censors were told to speak frankly in the spirit of his fear of the portent.',
  ],
  s1119: [
    'Even common people with grievances may present facts on their behalf frankly, to accord with my intent to cultivate virtue and quell calamity.',
    'Commoners with grievances might also petition frankly to help him mend virtue and end the calamity.',
  ],
  s1120: [
    '" (closing quotation mark in the source.) Censor Lu Zhe memorialized that wind and sand were a warning and asked that officers and runners be forbidden to seek merit by reckless arrests that harassed civilians.',
    'The edict ended." Lu Zhe warned that reckless arrests for merit were harassing the people.',
  ],
  s1121: [
    'Received rescript: "What you report is very correct.',
    'The rescript agreed: "Your report is correct.',
  ],
  s1122: [
    'Fugitives in the Lin Qing case were ordered seized, but seizing officers would fill the charge with other crimes to answer duty.',
    'Lin Qing fugitives were ordered seized, but catchers often substituted other cases.',
  ],
  s1123: [
    'Itinerant constables and soldiers seized the chance to run wild, framing people and extorting captives, to every extreme.',
    'Runners and soldiers framed innocents and extorted victims without limit.',
  ],
  s1124: [
    'By the time the court investigated and clarified, skin and bones alone remained, property was exhausted, and some even died thereby.',
    'By trial, victims were ruined and some had died.',
  ],
  s1125: [
    'Bitter injustice with no redress—such things surely brought this calamity.',
    'Unredressed wrongs, he said, had brought the portent.',
  ],
  s1126: [
    'All more than fifty secondary offenders were ordered to stop pursuit.',
    'Pursuit of over fifty minor fugitives was halted.',
  ],
  s1127: [
    'Even the six offenders including Zhu Xian were only handed to the Ministry of Punishments for record; if caught, then to be handled.',
    'Even six chief fugitives including Zhu Xian were only logged at Punishments until caught.',
  ],
  s1128: [
    'Hereafter if arrest runners repeat the former conduct, the supervising official shall punish severely and award their household property to the framed family, so as to warn vicious custom and reassure the good and timid.',
    'Repeat offenders among catchers were to be flogged and their property given to victims.',
  ],
  s1129: [
    '" (closing quotation mark in the source.) On day jimao, the Board of Astronomy memorialized: "We respectfully consult the Comprehensive Meaning of Astronomy: when the four quarters of heaven and earth are dim and blurred, as if dusty rain falls, it is called haze.',
    'The rescript ended." On jimao, Astronomy cited haze as dim heaven and earth like dusty rain.',
  ],
  s1130: [
    'Thus it is said: heaven and earth in haze—ruler and ministers at odds, great drought, and also dear grain.',
    'The text linked haze to estranged ruler and ministers, drought, and dear grain.',
  ],
  s1131: [
    '" (closing quotation mark in the source.) Received rescript: "The matter on the eighth day exactly matched the sign in the Comprehensive Meaning.',
    'The memorial ended." The rescript said the eighth day matched the omen.',
  ],
  s1132: [
    'Yet I respectfully follow the established statutes, daily summoning officials and questioning before the mat at close range—one would seem not to reach estrangement.',
    'Yet he said he daily consulted officials closely and seemed not estranged.',
  ],
  s1133: [
    'But this is only the trace; in reality how many share my heart and hope for order!',
    'Appearances aside, few truly shared his zeal for order.',
  ],
  s1134: [
    'Not daring to remonstrate to the face, speaking afterward—appearance united but feeling estranged: that is estrangement.',
    'Face-to-face silence and backbiting, he said, were estrangement.',
  ],
  s1135: [
    'Toward colleagues, not the harmony of gentlemen but the conformity of petty men—that too is estrangement.',
    'Petty cliquishness among colleagues was estrangement too.',
  ],
  s1136: [
    'Let ruler and ministers admonish one another on this.',
    'Ruler and ministers should warn one another.',
  ],
  s1137: [
    '" (closing quotation mark in the source.) On day gengchen, the Emperor prayed for rain.',
    'The rescript ended." On gengchen, the Emperor prayed for rain.',
  ],
  s1138: [
    'On day wuzi, the Emperor prayed for rain again.',
    'On wuzi, he prayed for rain again.',
  ],
  s1139: [
    'On day xinmao, rain fell.',
    'On xinmao, rain fell.',
  ],
  s1140: [
    'Fifth month, day wuxu, an edict said: "Library ministers presented the imperially commissioned Mirror of Ming, which in the Wanli and Tianqi sections entered matters of the founding court of the former dynasty and added commentaries in praise—in all this the format was improper.',
    'In month 5, wuxu, an edict rebuked the Mirror of Ming for praising the Ming founding in Wanli-Tianqi entries.',
  ],
  s1141: [
    'Vice chief compiler Vice Minister Xiuning was reduced to guard and sent to Xinjiang for rotation duty.',
    'Vice compiler Xiuning was demoted to guard and sent to Xinjiang.',
  ],
  s1142: [
    'Chief compiler Cao Zhenyong and others each received light punishment; compilation was reassigned.',
    'Chief compiler Cao Zhenyong and others were lightly punished and the work reassigned.',
  ],
  s1143: [
    '" (closing quotation mark in the source.)',
    'The edict ended."',
  ],
  s1144: [
    'Sixth month, day renshen: Wuzhi\'s Qin River overflowed; soon word came the river was closed.',
    'In month 6, renshen, the Qin at Wuzhi flooded; the breach was soon closed.',
  ],
  s1145: [
    'Seventh month, day jiazi: the Emperor set out on an eastern tour.',
    'In month 7, jiazi, the eastern tour began.',
  ],
  s1146: [
    'Eighth month, new moon on day dingmao: because the route crossed civilian fields, quota land tax was remitted for four prefectures and counties of Fengtian and Chengde traversed.',
    'At the eighth-month new moon, four Fengtian-Chengde districts on the route lost land tax.',
  ],
  s1147: [
    'On day wuzi, Imperial Rituals of the Dynasty was promulgated.',
    'On wuzi, the Imperial Rituals of the Dynasty was issued.',
  ],
  s1148: [
    'On day renwu, the Emperor sacrificed to the Northern Sacred Peak.',
    'On renwu, the Emperor sacrificed to the Northern Peak.',
  ],
  s1149: [
    'On day xinmao, he visited Yongling and performed the great felicity rite.',
    'On xinmao, he visited Yongling with the great felicity rite.',
  ],
  s1150: [
    'Ninth month, new moon on day bingchen: he visited Fuling.',
    'At the ninth-month new moon, bingchen, he visited Fuling.',
  ],
  s1151: [
    'On day dingyou, he visited Zhaoling; both received great felicity rites; rites were performed before the treasure registers.',
    'On dingyou, he visited Zhaoling; both tombs received great felicity rites and rites before the registers.',
  ],
  s1152: [
    'The Emperor composed a Record of the Completion of the Second Eastern Tour.',
    'The Emperor wrote a record of the second eastern tour\'s completion.',
  ],
  s1153: [
    'He visited and offered at the tombs of Prince Keqin Yuetuo, Prince of Martial Merit Yangguli, Duke Hongyi E\'iyetu, and Duke of Straight Duty Fei Yingdong.',
    'He offered at the tombs of Yuetuo, Yangguli, E\'iyetu, and Fei Yingdong.',
  ],
  s1154: [
    'Added favor to five descendants of E\'iyetu and one descendant of Fei Yingdong.',
    'Five of E\'iyetu\'s descendants and one of Fei Yingdong\'s received added favor.',
  ],
  s1155: [
    'On day gengzi, the Emperor went to the Altar of Heaven and the Tangzi to perform rites.',
    'On gengzi, he sacrificed at the Altar of Heaven and Tangzi.',
  ],
  s1156: [
    'On day xinhai, the imperial procession returned.',
    'On xinhai, the tour returned.',
  ],
  s1157: [
    'On day dingsi, Fujun was made Jilin general and Saichonga Shengjing general.',
    'On dingsi, Fujun took Jilin and Saichonga, Shengjing.',
  ],
  s1158: [
    'Winter, tenth month, day gengwu: the Emperor halted at Xinglong Temple.',
    'In month 10, gengwu, the Emperor halted at Xinglong Temple.',
  ],
  s1159: [
    'On day xinwei, Longevity Festival; congratulations were received at the traveling palace.',
    'On xinwei, Longevity Day was celebrated at the traveling palace.',
  ],
  s1160: [
    'On day guiyou, the Emperor visited the Eastern Tombs.',
    'On guiyou, the Emperor visited the Eastern Tombs.',
  ],
  s1161: [
    'On day bingzi, the Emperor returned to the capital.',
    'On bingzi, the Emperor returned to Beijing.',
  ],
  s1162: [
    'On day xinsi, retired Grand Secretary Dong Gao died; the Emperor visited his residence to grant funeral offerings.',
    'On xinsi, Dong Gao died; the Emperor mourned at his house.',
  ],
  s1163: [
    'Eleventh month, day wushen: Yihui was made Mongol commander-in-chief.',
    'In month 11, wushen, Yihui became Mongol commander-in-chief.',
  ],
  s1164: [
    'On day xinhai, an edict said: "The state has ruled long; one should pay special attention to popular mind and custom.',
    'On xinhai, an edict urged attention to popular mind and custom.',
  ],
  s1165: [
    'Yet the rectitude of minds and purity of customs depend on the gains and losses of government and teaching.',
    'Rectitude of mind and purity of custom, it said, depend on government and teaching.',
  ],
  s1166: [
    'The shifts are very subtle but bind the state heavily; it may not be treated as a remote design.',
    'Subtle shifts matter greatly and must not be dismissed as remote theory.',
  ],
  s1167: [
    'Affairs under heaven have myriad forms; principle returns to one.',
    'Myriad affairs, it said, still return to one principle.',
  ],
  s1168: [
    'Whether strict or lenient, one must measure by principle.',
    'Strictness and leniency must both follow principle.',
  ],
  s1169: [
    'Only when application reaches widely can popular will be greatly awed.',
    'Only wide application can awe popular will.',
  ],
  s1170: [
    'When popular will is settled, popular mind is rectified.',
    'Settled will, it said, means rectified minds.',
  ],
  s1171: [
    'All we ruler and ministers should take a heart wary in prosperity and mindful in danger, not schemes of compromise for convenience.',
    'Ruler and ministers should stay wary in prosperity, not seek easy comfort.',
  ],
  s1172: [
    'Especially as to the thickness or thinness of custom, one must constantly observe, transform silently, rectify the standards and discipline, rectify minds to rectify customs.',
    'Custom\'s strength must be watched, norms tightened, and minds corrected to correct custom.',
  ],
  s1173: [
    'Bright accomplishment and great merit—nothing weighs more than this.',
    'No achievement outweighed this, the edict said.',
  ],
  s1174: [
    'I look to encourage one another with inner and outer officials.',
    'He asked inner and outer officials to encourage one another.',
  ],
  s1175: [
    '" (closing quotation mark in the source.)',
    'The edict ended."',
  ],
  s1176: [
    'Twelfth month, day wuchen: the Emperor prayed for snow.',
    'In month 12, wuchen, the Emperor prayed for snow.',
  ],
  s1177: [
    'On day wuzi, Bashiliu was made Guangzhou general; Songyun Minister of Rites; Liu Kuanshi Left Censor-in-Chief.',
    'On wuzi, Bashiliu took Guangzhou; Songyun, rites; Liu Kuanshi, left censor-in-chief.',
  ],
  s1178: [
    'On day renchen, joint winter sacrifice at the Grand Temple.',
    'On renchen, the joint winter sacrifice was held at the Grand Temple.',
  ],
  s1179: [
    'That year, disaster land tax was remitted by degree for seventy-nine prefectures and counties in Shuntian, Zhili, Shandong, Anhui, Gansu, Yunnan, and other provinces.',
    'That year, seventy-nine districts in six provinces lost disaster taxes by degree.',
  ],
  s1180: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s1181: [
    'Year 24, jimao, spring, first month, new moon on day jiawu: the Emperor\'s sixtieth Longevity; an amnesty edict was issued and court ministers feasted.',
    'In Jiaqing 24, New Year jiawu, the sixtieth Longevity brought amnesty and a court feast.',
  ],
  s1182: [
    'The third imperial son Mianyi was enfeoffed Prince Dun; the fourth son Mianxin Prince Rui; the imperial grandson Yizhi a beile.',
    'Mianyi became Prince Dun, Mianxin Prince Rui, and Yizhi a beile.',
  ],
  s1183: [
    'Mianzhi, Yishao, and others were advanced in rank by degree.',
    'Mianzhi, Yishao, and others were promoted by degree.',
  ],
  s1184: [
    'On day dingsi, Hening was relieved of routine Grand Council attendance; Vice Minister Wen Fu was made Grand Councilor.',
    'On dingsi, Hening left daily council duty and Wen Fu joined the Grand Council.',
  ],
  s1185: [
    'Second month, day jiazi: the Emperor held the Classics lecture.',
    'In month 2, jiazi, the Emperor lectured on the Classics.',
  ],
  s1186: [
    'Third month, day jihai: the Emperor visited the Eastern Tombs.',
    'In month 3, jihai, the Emperor visited the Eastern Tombs.',
  ],
  s1187: [
    'On day renzi, the Emperor went to the Southern Park for the enclosure hunt.',
    'On renzi, the Emperor hunted at the Southern Park.',
  ],
  s1188: [
    'On day jiwei, the Emperor visited the Western Tombs.',
    'On jiwei, the Emperor visited the Western Tombs.',
  ],
  s1189: [
    'Summer, fourth month, day jiazi: the Emperor returned to the capital.',
    'In month 4, jiazi, the Emperor returned to Beijing.',
  ],
  s1190: [
    'On day gengchen, the Emperor reviewed the Valiant and Sharp Brigade.',
    'On gengchen, the Emperor reviewed the Valiant and Sharp Brigade.',
  ],
  s1191: [
    'On day bingxu, Chen Fang and two hundred twenty-four others received jinshi degrees with differentiated ranks.',
    'On bingxu, Chen Fang and 224 others received jinshi degrees.',
  ],
  s1192: [
    'On day wuzi, the superintendents of Fengyang and Jiujiang passes were abolished and the touring circuit intendant handled them jointly.',
    'On wuzi, Fengyang and Jiujiang pass superintendents were abolished; circuit intendants took over.',
  ],
  s1193: [
    'On day jisi, the Emperor prayed for rain.',
    'On jisi, the Emperor prayed for rain.',
  ],
  s1194: [
    'On day gengyin, Songyun was made inner minister.',
    'On gengyin, Songyun became inner minister.',
  ],
  s1195: [
    'Intercalary fourth month, day jiyou: the Emperor prayed for rain at the Heavenly Spirit Altar.',
    'In intercalary month 4, jiyou, the Emperor prayed at the Heavenly Spirit Altar.',
  ],
  s1196: [
    'That day, rain fell.',
    'Rain fell that day.',
  ],
  s1197: [
    'Fifth month, day yiyou: Prince Cheng Yongxing, for faults in memorial sacrifice rites, was dismissed from office, salary cut, and sent to his residence.',
    'In month 5, yiyou, Prince Cheng Yongxing lost office and pay for faulty sacrifice rites.',
  ],
  s1198: [
    'Yinghe and Heshitai were both made Manchu commanders-in-chief.',
    'Yinghe and Heshitai became Manchu commanders-in-chief.',
  ],
  s1199: [
    'Sixth month, day guimao: Songyun was transferred to Minister of Works.',
    'In month 6, guimao, Songyun moved to the Works ministry.',
  ],
  s1200: [
    'Autumn, seventh month, day renxu: Prince Zheng Ulgungga was made Chinese Banner commander-in-chief.',
    'In month 7, renxu, Prince Zheng Ulgungga took the Chinese Banner command.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b12.mjs <translation.json>'
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
