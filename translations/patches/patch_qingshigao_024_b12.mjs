#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1101: [
    'On day renzi, Tie Liang was ordered to go to Jiangnan to survey manufacturing bureau workshops, plan what was suitable, and inspect income and expenditure accounts and the pros and cons of each treasury and bureau.',
    'On renzi day, Tie Liang was sent to Jiangnan to review arsenals, plan reforms, and audit treasuries and bureaus.',
  ],
  s1102: [
    'On day wuwu, Cen Chunxuan was urgently summoned to supervise troops in Gui and Liu.',
    'On wuwu day, Cen Chunxuan was rushed to command in Guangxi and Liuzhou.',
  ],
  s1103: [
    'On day guihai, Qinghai pasture league chiefs Chelinduoduo and others asked to use the annual tribute escort to bring congratulatory gifts to the capital.',
    'On guihai day, Qinghai league chiefs asked to join the tribute mission with birthday gifts for the capital.',
  ],
  s1104: [
    'An empress-dowager decree praised them but still declined.',
    'The empress dowager commended them but still refused.',
  ],
  s1105: [
    'On day guiyou, the Yongding River breached.',
    'On guiyou day, the Yongding River broke.',
  ],
  s1106: [
    'On day bingzi, the river breached at Bozhuang in Lijin.',
    'On bingzi day, the river broke at Lijin\'s Bozhuang.',
  ],
  s1107: [
    'Seventh month, autumn, day wuyin: the Belgian minister Ge Feiye was received at the Palace of Heavenly Purity.',
    'In month 7, wuyin, Belgian minister Ge Feiye was received at the Palace of Heavenly Purity.',
  ],
  s1108: [
    'The Fujian naval commander-in-chief was abolished and merged into the land-route commander-in-chief, who moved his headquarters to Xiamen.',
    'Fujian\'s naval commander-in-chief was abolished and merged into the land commander at Xiamen.',
  ],
  s1109: [
    'On day jiashen, the Yongding River\'s lower summer flood season breached again.',
    'On jiashen day, the Yongding broke again in the lower summer season.',
  ],
  s1110: [
    'On day wuzi, one hundred thousand taels from the privy purse were released to relieve Sichuan flood and drought.',
    'On wuzi day, one hundred thousand taels from the privy purse went to Sichuan flood and drought relief.',
  ],
  s1111: [
    'On day renchen, British troops entered Tibet; the Dalai Lama fled; his title was stripped; the Panchen Erdeni was ordered to act in his place.',
    'On renchen day, British troops entered Tibet; the Dalai fled and lost his title; the Panchen Erdeni was put in charge.',
  ],
  s1112: [
    'On day jiawu, the Yellow River in Gansu breached; Gaolan suffered disaster; Song Fan was ordered to provide relief.',
    'On jiawu day, Gansu\'s Yellow River broke at Gaolan; Song Fan was told to relieve the district.',
  ],
  s1113: [
    'On day yiwei, Jiujiang\'s porcelain tribute was suspended.',
    'On yiwei day, Jiujiang porcelain tribute was stopped.',
  ],
  s1114: [
    'On day bingshen, Li Xingrui was appointed acting governor-general of the Two Jiangs and minister for the Southern Seas.',
    'On bingshen day, Li Xingrui became acting Two-Jiangs governor-general and Southern Seas minister.',
  ],
  s1115: [
    'That month, Tang Shouqian was granted the fourth-rank chamberlain title and put in charge of the Zhejiang railway.',
    'That month, Tang Shouqian received fourth-rank chamberlain rank to build the Zhejiang railway.',
  ],
  s1116: [
    'Eighth month, new moon on day dingwei: staff posts in the Imperial Household Department were cut and merged.',
    'In month 8, dingwei new moon, Imperial Household Department posts were reduced.',
  ],
  s1117: [
    'On day guihai, Tang Shaoyi was granted acting vice commissioner-in-chief rank and sent to Tibet to investigate affairs.',
    'On guihai day, Tang Shaoyi received vice commissioner rank to investigate Tibet.',
  ],
  s1118: [
    'On day xinwei, the Italian minister Ganina was received at the Hall of Benevolent Longevity.',
    'On xinwei day, Italian minister Ganina was received at the Hall of Benevolent Longevity.',
  ],
  s1119: [
    'On day guiyou, the Mexican minister Li Hua was received at the Palace of Heavenly Purity.',
    'On guiyou day, Mexican minister Li Hua was received at the Palace of Heavenly Purity.',
  ],
  s1120: [
    'Ninth month, new moon on day bingzi: the British minister Sadoi was received at the Palace of Heavenly Purity.',
    'In month 9, bingzi new moon, British minister Sadoi was received at the Palace of Heavenly Purity.',
  ],
  s1121: [
    'On day guiwei, Jing Xin was dismissed on illness.',
    'On guiwei day, ill Jing Xin was removed from office.',
  ],
  s1122: [
    'On day jihai, Li Xingrui died; Zhou Fu was appointed acting governor-general of the Two Jiangs and minister for the Southern Seas.',
    'On jihai day, Li Xingrui died; Zhou Fu became acting Two-Jiangs governor-general and Southern Seas minister.',
  ],
  s1123: [
    'Because British troops had entered Tibet, the Dalai Lama sought aid; Delin was ordered to pacify him.',
    'As British troops had entered Tibet, the Dalai sought help and Delin was ordered to pacify him.',
  ],
  s1124: [
    'The British troops soon withdrew.',
    'The British troops soon pulled back.',
  ],
  s1125: [
    'Tang Shaoyi was commissioned plenipotentiary minister for treaty negotiations.',
    'Tang Shaoyi was made plenipotentiary treaty minister.',
  ],
  s1126: [
    'On day guimao, the Hubei grain intendant was changed to the Shihe military defense circuit.',
    'On guimao day, Hubei\'s grain intendant became the Shihe military defense circuit.',
  ],
  s1127: [
    'That autumn, overdue levies were remitted for Jilin districts afflicted by war, Yunnan flood, drought, and war, and quota taxes in Wuwei and Jinzhou.',
    'That autumn, Jilin war arrears, Yunnan disaster arrears, and Wuwei and Jinzhou quota taxes were forgiven.',
  ],
  s1128: [
    'Relief was sent for floods in Yunnan, Shuntian, Fujian, Gansu, and Jiangxi, and disasters in Shanxi, Zhejiang, Guangdong, and other places.',
    'Flood relief went to Yunnan, Shuntian, Fujian, Gansu, and Jiangxi; other provinces received disaster relief.',
  ],
  s1129: [
    'Winter, tenth month, day bingwu: Lü Haihuan completed the revised Sino-Portuguese commercial treaty.',
    'In winter, month 10, bingwu, Lü Haihuan finished the revised Sino-Portuguese commercial treaty.',
  ],
  s1130: [
    'Yu De was made grand secretary of the Hall of Embodied Benevolence; Shixu was made associate grand secretary.',
    'Yu De became grand secretary of the Hall of Embodied Benevolence; Shixu became associate grand secretary.',
  ],
  s1131: [
    'On day gengxu, ministers of Austria, the United States, Germany, Russia, and Belgium, including Qi Gan, were received at the Hall of Supreme Harmony.',
    'On gengxu day, Austrian, American, German, Russian, and Belgian ministers were received at the Hall of Supreme Harmony.',
  ],
  s1132: [
    'The Yongding River breach was closed.',
    'The Yongding breach was sealed.',
  ],
  s1133: [
    'On day renzi, the Emperor escorted the Empress Dowager to the Hall of Benevolent Longevity and gave a banquet to close imperial clansmen; princes, beiles, beizi, and dukes led the dance.',
    'On renzi day, the Emperor took the empress dowager to the Hall of Benevolent Longevity, feasted close clansmen, and led princes in dance.',
  ],
  s1134: [
    'On day jiayin, the Empress Dowager\'s birthday; the Emperor went to the Paiyun Hall to present a congratulatory memorial.',
    'On jiayin day, the empress dowager\'s birthday, the Emperor congratulated her at the Paiyun Hall.',
  ],
  s1135: [
    'On day xinyou, the British, Japanese, French, and Korean ministers, including Sadoi, were received at the Hall of Supreme Harmony.',
    'On xinyou day, British, Japanese, French, and Korean ministers were received at the Hall of Supreme Harmony.',
  ],
  s1136: [
    'On day bingyin, an empress-dowager edict forbade provinces from using New Policies as a pretext to create names and exact petty private levies.',
    'On bingyin day, the empress dowager barred provinces from petty New Policy levies.',
  ],
  s1137: [
    'For all schools and crafts related to education and nurture, officials were to guide and encourage them; gentry and people were to fund them themselves without harassment.',
    'Schools and useful crafts were to be officially encouraged; local gentry were to fund them without harassment.',
  ],
  s1138: [
    'The degraded-people register in Zhejiang was abolished; they were admitted to schools, and graduates were granted official status.',
    'Zhejiang\'s degraded-people register was abolished; graduates of schools could receive official rank.',
  ],
  s1139: [
    'Eleventh month, new moon on day yihai: Yin Chang was again made minister to Germany; Zeng Guangquan was made minister to Korea.',
    'In month 11, yihai new moon, Yin Chang returned as minister to Germany and Zeng Guangquan became minister to Korea.',
  ],
  s1140: [
    'An earthquake struck Dajianlu in Sichuan.',
    'Dajianlu in Sichuan was shaken by earthquake.',
  ],
  s1141: [
    'On day dingchou, the Italian minister Palese was received at the Palace of Heavenly Purity.',
    'On dingchou day, Italian minister Palese was received at the Palace of Heavenly Purity.',
  ],
  s1142: [
    'On day renwu, the Guangxi bandit chief Lu Yafa was executed after capture.',
    'On renwu day, Guangxi bandit chief Lu Yafa was executed.',
  ],
  s1143: [
    'On day wuzi, the New Army officer system was fixed.',
    'On wuzi day, the New Army officer regulations were set.',
  ],
  s1144: [
    'On day jiachen, Zeng Qi was instructed to relieve and pacify refugees in the Three Eastern Provinces.',
    'On jiachen day, Zeng Qi was told to relieve Three Eastern Provinces refugees.',
  ],
  s1145: [
    'Twelfth month, day wushen: the Italian minister Palese, Dutch minister Histers, and Portuguese minister Almeida were received at the Hall of Supreme Harmony.',
    'In month 12, wushen, Italian, Dutch, and Portuguese ministers were received at the Hall of Supreme Harmony.',
  ],
  s1146: [
    'On day jiayin, the Jiang\'an grain intendant was abolished; the Jiangnan salt intendant was changed to the salt-and-grain intendant.',
    'On jiayin day, Jiang\'an\'s grain intendant was cut and Jiangnan\'s salt post became salt-and-grain intendant.',
  ],
  s1147: [
    'On day dingsi, three hundred thousand taels from the privy purse were released to relieve Fengtian refugees.',
    'On dingsi day, three hundred thousand taels from the privy purse went to Fengtian refugees.',
  ],
  s1148: [
    'On day renxu, Zhili began issuing public bond notes.',
    'On renxu day, Zhili began public bond issues.',
  ],
  s1149: [
    'On day bingyin, the grain-transport governor-general was abolished and a Jiang-Huai governor was established.',
    'On bingyin day, the grain-transport governor-general was abolished and a Jiang-Huai governor was set up.',
  ],
  s1150: [
    'On day dingmao, an academy for noble youths was established.',
    'On dingmao day, a noble youths\' academy was founded.',
  ],
  s1151: [
    'On day wuchen, a Heilongjiang circuit intendant with acting surveillance commissioner rank was established, a Lan-Suihai military defense circuit, and the two prefectures of Hulan and Suihua.',
    'On wuchen day, Heilongjiang gained a circuit intendant with surveillance rank, a Lan-Suihai defense circuit, and Hulan and Suihua prefectures.',
  ],
  s1152: [
    'On day xinwei, the Dujiangyan works in Sichuan were repaired.',
    'On xinwei day, Sichuan\'s Dujiangyan works were repaired.',
  ],
  s1153: [
    'That winter, the Hubei and Yunnan governors were abolished, and the Hunan and Shaanxi grain intendants.',
    'That winter, Hubei and Yunnan governors and Hunan and Shaanxi grain intendants were cut.',
  ],
  s1154: [
    'Autumn grain was remitted for Shiping and Zhaozhou; overdue levies for Chenliu and other districts; quota taxes for flood-stricken Chaoyi.',
    'Shiping and Zhaozhou autumn grain, Chenliu arrears, and Chaoyi flood quota taxes were forgiven.',
  ],
  s1155: [
    'Thirty-first year, yisi, spring, first month, day dingchou: ministers of Germany, Britain, Japan, France, the Netherlands, Belgium, Italy, Russia, Portugal, Mexico, the United States, Korea, and Austria were received at the Palace of Heavenly Purity.',
    'Year 31, spring 1, dingchou: German, British, Japanese, French, Dutch, Belgian, Italian, Russian, Portuguese, Mexican, American, Korean, and Austrian ministers were received at the Palace of Heavenly Purity.',
  ],
  s1156: [
    'The Dalai Lama asked to build a temple at Kulun for sutra recitation; it was not permitted.',
    'The Dalai Lama\'s request for a Kulun temple was refused.',
  ],
  s1157: [
    'He was ordered to return to Tibet and govern the people well.',
    'He was told to return to Tibet and care for the people.',
  ],
  s1158: [
    'On day guisi, Tie Liang reported on his inspection of provincial camps; Hubei\'s army was rated best; an imperial commendation was issued.',
    'On guisi day, Tie Liang\'s camp inspection praised Hubei\'s army best and drew an imperial commendation.',
  ],
  s1159: [
    'Commanders of the various Jiangnan armies were punished to differing degrees.',
    'Jiangnan army commanders were punished variously.',
  ],
  s1160: [
    'Tang Shaoyi was appointed minister to Britain.',
    'Tang Shaoyi became minister to Britain.',
  ],
  s1161: [
    'Second month, day yisi: an empress-dowager edict released three hundred thousand taels from the privy purse to comfort refugees in the Three Eastern Provinces.',
    'In month 2, yisi, the empress dowager gave three hundred thousand taels from the privy purse for Three Eastern Provinces refugees.',
  ],
  s1162: [
    'On day gengxu, Chang Geng and Xu Shichang were ordered to inspect and reorganize the three-division New Army.',
    'On gengxu day, Chang Geng and Xu Shichang were told to inspect and reorganize the three-division New Army.',
  ],
  s1163: [
    'On day bingyin, fire destroyed the Longen Hall at the Jing Mausoleum.',
    'On bingyin day, the Jing Mausoleum Longen Hall burned.',
  ],
  s1164: [
    'On day gengwu, the American minister Conger was received at the Hall of Universal Peace.',
    'On gengwu day, American minister Conger was received at the Hall of Universal Peace.',
  ],
  s1165: [
    'On day renshen, relief was sent to Alashan nomads.',
    'On renshen day, Alashan nomads received relief.',
  ],
  s1166: [
    'On day guiyou, the previous year\'s overdue grain in Shaanxi was remitted.',
    'On guiyou day, Shaanxi\'s prior-year grain arrears were forgiven.',
  ],
  s1167: [
    'Third month, day yihai: famine in Fengtian.',
    'In month 3, yihai, Fengtian suffered famine.',
  ],
  s1168: [
    'Russian troops entered Changchun and occupied it.',
    'Russian troops entered and seized Changchun.',
  ],
  s1169: [
    'On day bingzi, Batang Tibetans burned a French church; Feng Quan, assistant commissioner in Tibet, pursued and was ambushed and killed.',
    'On bingzi day, Batang Tibetans burned a French church; Feng Quan was killed in an ambush while suppressing them.',
  ],
  s1170: [
    'The Sichuan provincial commander Ma Weiqi was ordered to suppress them.',
    'Sichuan commander Ma Weiqi was ordered to suppress the rebels.',
  ],
  s1171: [
    'Ke Fengshi was ordered to manage the unified native-opium levy in eight provinces.',
    'Ke Fengshi was put in charge of the eight-province native-opium levy.',
  ],
  s1172: [
    'On day dingchou, the German prince Fürst von Hohenlohe and minister Mumm were received at the Palace of Heavenly Purity.',
    'On dingchou day, German Prince Hohenlohe and minister Mumm were received at the Palace of Heavenly Purity.',
  ],
  s1173: [
    'On day jimao, governors and governors-general were instructed to recommend men fit for regional commander and brigade commander posts.',
    'On jimao day, governors were told to recommend fit regional and brigade commanders.',
  ],
  s1174: [
    'On day jichou, a commercial port was opened in Yunnan provincial capital.',
    'On jichou day, Yunnan\'s provincial capital opened as a treaty port.',
  ],
  s1175: [
    'On day gengyin, the newly established Jiang-Huai governor was abolished; the Huai-Yang regional commander was changed to commander-in-chief of Jiangbei.',
    'On gengyin day, the Jiang-Huai governor was cut and the Huai-Yang commander became Jiangbei commander-in-chief.',
  ],
  s1176: [
    'On day guisi, the law was ordered revised.',
    'On guisi day, legal revision was ordered.',
  ],
  s1177: [
    'Capital punishment was limited to decapitation; lingering death, exposure of the head, and corpse mutilation were abolished.',
    'Capital punishment stopped at decapitation; lingering death, exposure, and mutilation were abolished.',
  ],
  s1178: [
    'Decapitation, strangulation, and imprisonment awaiting execution were reduced step by step.',
    'Decapitation, strangulation, and suspended sentences were reduced in severity.',
  ],
  s1179: [
    'For all collective-punishment articles, except those who knowingly shared guilt, the rest were broadly remitted.',
    'Collective-punishment rules were broadly remitted except for knowing accomplices.',
  ],
  s1180: [
    'All tattooing provisions were also abolished.',
    'Tattooing provisions were abolished as well.',
  ],
  s1181: [
    'On day jiawu, because judicial torture was forbidden, bamboo and stick punishments were adjusted, prisons and detention houses were inspected, and governors were instructed to enforce this in earnest.',
    'On jiawu day, torture was banned, bamboo punishments adjusted, prisons inspected, and governors told to enforce the reforms.',
  ],
  s1182: [
    'On day yiwei, bandits rose in Qianwei; government troops suppressed and pacified them.',
    'On yiwei day, Qianwei bandits were suppressed by government troops.',
  ],
  s1183: [
    'On day bingshen, Zhou Fu was ordered to go to Jiangbei to plan local administration, coastal defense, river works, and policing.',
    'On bingshen day, Zhou Fu was sent to Jiangbei to plan administration, coast defense, rivers, and policing.',
  ],
  s1184: [
    'Summer, fourth month, day jiachen: because Russian warships had reached the Southern Seas, the localities were instructed to take precautions and merchants were forbidden to transport coal to assist them.',
    'In summer, month 4, jiachen, Russian warships in the south brought precautions and a ban on merchant coal sales to them.',
  ],
  s1185: [
    'The articles on theft were revised.',
    'Theft statutes were revised.',
  ],
  s1186: [
    'All cases warranting bamboo or stick punishment were changed to penal labor.',
    'Bamboo and stick sentences became penal labor.',
  ],
  s1187: [
    'On day yisi, provinces, prefectures, departments, and counties were instructed to establish houses of correction for convicts to learn crafts.',
    'On yisi day, every province was told to establish convict craft houses.',
  ],
  s1188: [
    'On day bingwu, Liu Yongqing was granted vice minister rank, made acting commander-in-chief of Jiangbei, and brigade commanders and circuit intendants below were placed under his command.',
    'On bingwu day, Liu Yongqing became acting Jiangbei commander-in-chief with vice minister rank over subordinate commanders.',
  ],
  s1189: [
    'On day dingwei, the Guangdong grain intendant was abolished and a Lian-Qin military defense circuit was established.',
    'On dingwei day, Guangdong\'s grain intendant was cut and a Lian-Qin defense circuit was set up.',
  ],
  s1190: [
    'On day jiyou, Cheng Desuan was appointed acting general of Heilongjiang.',
    'On jiyou day, Cheng Desuan became acting Heilongjiang general.',
  ],
  s1191: [
    'On day renzi, a German warship suddenly reached Haizhou to survey; a stern inquiry was ordered.',
    'On renzi day, a German warship surveyed Haizhou and drew a stern protest.',
  ],
  s1192: [
    'Fifth month, day dinghai: the Japanese minister Kajiwara and American minister Rockhill were received at the Palace of Heavenly Purity.',
    'In month 5, dinghai, Japanese minister Kajiwara and American minister Rockhill were received at the Palace of Heavenly Purity.',
  ],
  s1193: [
    'On day guisi, the Mexican minister Hulda was received at the Hall of Supreme Harmony.',
    'On guisi day, Mexican minister Hulda was received at the Hall of Supreme Harmony.',
  ],
  s1194: [
    'On day gengzi, Wang Wenshao was removed as grand councilor; Xu Shichang was ordered to study while serving on the Grand Council, also as a minister of the Office of Government Affairs; Tie Liang and Xu Shichang jointly managed military training.',
    'On gengzi day, Wang Wenshao left the Grand Council; Xu Shichang joined it and the Office of Government Affairs; Tie Liang and Xu Shichang shared military training.',
  ],
  s1195: [
    'Sixth month, day bingwu: the Russian minister Pokotilov was received at the Hall of Benevolent Longevity.',
    'In month 6, bingwu, Russian minister Pokotilov was received at the Hall of Benevolent Longevity.',
  ],
  s1196: [
    'Overdue levies were remitted for Zhongmou and other districts.',
    'Zhongmou and other districts were forgiven overdue levies.',
  ],
  s1197: [
    'On day jiayin, returned students who passed the examination, including Jin Bangping, were granted jinshi and juren status in differing degrees.',
    'On jiayin day, returned students such as Jin Bangping received jinshi and juren ranks by examination.',
  ],
  s1198: [
    'Zai Ze, Dai Hongci, Xu Shichang, and Duanfang were ordered to go to Eastern and Western countries to study government.',
    'Zai Ze, Dai Hongci, Xu Shichang, and Duanfang were sent abroad to study government.',
  ],
  s1199: [
    'On day wuwu, guardians for the three Mukden mausoleums were established by decree.',
    'On wuwu day, guardians were established for the three Mukden mausoleums.',
  ],
  s1200: [
    'The five vice ministers of the Mukden boards of Revenue, Rites, War, Punishments, and Works were abolished.',
    'Mukden\'s five board vice ministers were abolished.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b12.mjs <translation.json>'
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
