#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1201: [
    'On day jiwei, Shiru was made Grand Secretary of the Tiren Pavilion and Natong Assistant Grand Secretary.',
    'On jiwei day, Shiru became Tiren Pavilion grand secretary and Natong assistant grand secretary.',
  ],
  s1202: [
    'On day guihai, the Guangdong governor-general post was abolished.',
    'On guihai day, the Guangdong governor-generalship was cut.',
  ],
  s1203: [
    'On day gengwu, Guizhou bandits took four stockades at Duyun; government troops recovered them.',
    'On gengwu day, Duyun bandits seized four stockades but troops retook them.',
  ],
  s1204: [
    'Seventh month, day bingzi: censor patrol of the five wards and street offices was abolished, and trained braves were changed into patrol police.',
    'In month 7, bingzi, censor street patrol was ended and trained braves became patrol police.',
  ],
  s1205: [
    'On day yiyou, Shaoying was again dispatched as a minister to inspect government abroad.',
    'On yiyou day, Shaoying was sent again to study foreign government.',
  ],
  s1206: [
    'On day jichou, because of the Batang military affair, purchase of substantive offices was opened for one year.',
    'On jichou day, Batang fighting opened one year of substantive-office sales.',
  ],
  s1207: [
    'On day bingshen, Tingjie was rewarded with vice-minister rank and sent to Fengtian to manage reclamation affairs.',
    'On bingshen day, Tingjie gained vice-minister rank for Fengtian reclamation work.',
  ],
  s1208: [
    'Changde and Xiangtan were opened as treaty ports.',
    'Changde and Xiangtan became treaty ports.',
  ],
  s1209: [
    'On day dingyou, Tieliang was ordered to study and serve under the Grand Council ministers and soon also served on the Bureau of Government Affairs.',
    'On dingyou day, Tieliang joined the Grand Council for training and soon the Government Affairs Bureau.',
  ],
  s1210: [
    'Eighth month, day renyin: an edict stated, "In the provinces, merchants and gentry boycotting the American treaty both harm interstate relations and damage commerce.',
    'In month 8, renyin, the court said provincial anti-American boycotts hurt diplomacy and trade.',
  ],
  s1211: [
    'Border officials must earnestly instruct the people and inspect the matter in good time."',
    'Governors must guide the people and keep timely watch."',
  ],
  s1212: [
    'On day jiachen, an edict abolished the civil service examinations.',
    'On jiachen day, the examinations were abolished.',
  ],
  s1213: [
    'On day bingwu, the Fengtian intendant and vice intendant were cut and Eastern Three Provinces education commissioners were established.',
    'On bingwu day, Fengtian\'s intendant posts ended and Manchuria gained education commissioners.',
  ],
  s1214: [
    'Liu Shixun was appointed envoy minister to France and Japan, Huang Gao to Italy, and Zhou Rongyao to Belgium.',
    'Liu Shixun went to France and Japan, Huang Gao to Italy, and Zhou Rongyao to Belgium.',
  ],
  s1215: [
    'Rongyao was soon removed and Li Shengduo took his place.',
    'Rongyao was recalled and Li Shengduo replaced him.',
  ],
  s1216: [
    'On day dingwei, grain taxes for Fengtian\'s northern route districts ravaged by troops were remitted.',
    'On dingwei day, Fengtian northern-route war taxes were forgiven.',
  ],
  s1217: [
    'On day xinhai, thirty thousand taels from the privy purse were issued for Jiangsu emergency relief.',
    'On xinhai day, thirty thousand taels from the privy purse went to Jiangsu relief.',
  ],
  s1218: [
    'On day guichou, an edict ordered provincial education commissioners to devote themselves solely to examining schools; thereafter education commissioners\' affairs would be assessed by the Minister of Education.',
    'On guichou day, education commissioners were confined to school examinations under the Minister of Education.',
  ],
  s1219: [
    'On day wuwu, Pan Xiaosu, governor-general of Xinjiang, was stripped of office for embezzlement and exiled to the military colonies.',
    'On wuwu day, Xinjiang governor Pan Xiaosu lost office for embezzlement and went to the colonies.',
  ],
  s1220: [
    'On day jiwei, Yuan Shikai and Tieliang were ordered to review the new army\'s autumn maneuvers.',
    'On jiwei day, Yuan Shikai and Tieliang were told to inspect autumn maneuvers.',
  ],
  s1221: [
    'On day renxu, Wang Daxie was appointed envoy minister to Britain, Yang Sheng to Germany, and Li Jingmai to Austria.',
    'On renxu day, Wang Daxie went to Britain, Yang Sheng to Germany, and Li Jingmai to Austria.',
  ],
  s1222: [
    'On day jiazi, Haizhou was opened as a treaty port.',
    'On jiazi day, Haizhou became a treaty port.',
  ],
  s1223: [
    'On day yichou, Li Jingfang was reassigned Minister of Commercial Treaties.',
    'On yichou day, Li Jingfang became Minister of Commercial Treaties.',
  ],
  s1224: [
    'On day dingmao, when Zai Ze and the others set out, just as they boarded the carriage someone suddenly threw a bomb.',
    'On dingmao day, as Zai Ze\'s party boarded their train a bomb was thrown.',
  ],
  s1225: [
    'When the matter was reported, an edict ordered severe arrest and heavy punishment.',
    'The court ordered the culprits seized and punished severely.',
  ],
  s1226: [
    'On day jisi, the Batang rising was pacified; the rebel chiefs the lama Aze, Longben Langji, and others were executed.',
    'On jisi day, Batang was quiet and rebel leaders including Lama Aze were executed.',
  ],
  s1227: [
    'Ninth month, day bingzi: third-rank capital official Zhou Rongyao, who had formerly served on customs ledgers, was stripped of office, arrested, and tried for embezzling a huge treasury sum; his property was registered for seizure.',
    'In month 9, bingzi, ex-customs clerk Zhou Rongyao lost office for huge embezzlement and his estate was seized.',
  ],
  s1228: [
    'On day gengchen, the Police Department was first established, with Xu Shichang as minister.',
    'On gengchen day, the Police Department was created under Xu Shichang.',
  ],
  s1229: [
    'On day gengyin, fire broke out at Beixin Granary.',
    'On gengyin day, Beixin Granary burned.',
  ],
  s1230: [
    'On day xinmao, merit in pacifying Guangxi was discussed; Cen Chunxuan was given the Senior Guardian of the Heir Apparent rank and Li Jingxi was specially rewarded.',
    'On xinmao day, Guangxi pacification honors raised Cen Chunxuan and rewarded Li Jingxi.',
  ],
  s1231: [
    'On day bingshen, the German minister Mumm von Schwarzenstein was received in the Hall of Diligent Government.',
    'On bingshen day, Minister Mumm was received in the Hall of Diligent Government.',
  ],
  s1232: [
    'On day wuxu, Shang Qiheng and Li Shengduo were ordered to join Zai Ze and the others in inspecting government in each country.',
    'On wuxu day, Shang Qiheng and Li Shengduo joined Zai Ze\'s foreign inspection mission.',
  ],
  s1233: [
    'That autumn, flood relief was sent to Guizhou and Yunnan districts, Taikang wind disaster, and Zhenfan together with Bayan Rongge hail and wind disaster.',
    'That autumn brought relief for Guizhou and Yunnan floods, Taikang wind damage, and Zhenfan-Bayan Rongge hailstorms.',
  ],
  s1234: [
    'Winter, tenth month, day guimao: the Japanese minister Uchida Kanzo and others were received in the Hall of Diligent Government.',
    'In winter, month 10, guimao, Minister Uchida and others were received.',
  ],
  s1235: [
    'The Jilin Harbin Circuit was established.',
    'Jilin\'s Harbin Circuit was set up.',
  ],
  s1236: [
    'On day bingchen, the Luhankou Railway was completed.',
    'On bingchen day, the Luhankou Railway opened.',
  ],
  s1237: [
    'British troops entered Tibet and demanded indemnity of more than 1.2 million taels.',
    'British forces entered Tibet and demanded over 1.2 million taels.',
  ],
  s1238: [
    'An edict ordered the state to pay on Tibet\'s behalf to relieve Tibetan hardship.',
    'The court paid for Tibet to ease Tibetan distress.',
  ],
  s1239: [
    'On day renxu, regulations for minting silver coins and their circulation were fixed.',
    'On renxu day, silver coin minting and circulation rules were set.',
  ],
  s1240: [
    'On day yichou, Lu Zhengxiang was appointed envoy minister to the Netherlands and also handled Hague peace conference affairs.',
    'On yichou day, Lu Zhengxiang went to the Netherlands and the Hague peace conference.',
  ],
  s1241: [
    'On day wuchen, a Bureau for Inspecting Government was established to select foreign laws and institutions suited to China\'s polity, weigh additions and cuts, compile a book, and submit it for imperial decision.',
    'On wuchen day, a bureau was set up to adapt foreign institutions to China\'s polity.',
  ],
  s1242: [
    'An edict stated: "Recently unruly persons have fabricated talk of revolution and anti-Manchu exclusion, borrowing party names while secretly carrying out rebellion.',
    'The court warned that revolutionaries were plotting rebellion under party names.',
  ],
  s1243: [
    'Each border official must strictly forbid it and secretly arrest offenders.',
    'Governors must ban such talk and arrest plotters in secret.',
  ],
  s1244: [
    'Ringleaders and all accomplices are to be punished under the statute for plotting treason."',
    'Leaders and accomplices face the treason statute."',
  ],
  s1245: [
    '"',
    '"',
  ],
  s1246: [
    'Eleventh month, new moon on day gengwu: Shaanxi and Luoyang joint bandits were pacified.',
    'In month 11, gengwu new moon, Shaanxi-Luoyang bandits were subdued.',
  ],
  s1247: [
    'On day xinwei, Yu De died.',
    'On xinwei day, Yu De died.',
  ],
  s1248: [
    'On day bingzi, the resident minister in Korea was abolished and a consul-general was established.',
    'On bingzi day, Korea\'s resident minister became a consul-general.',
  ],
  s1249: [
    'On day jimao, an edict established the Ministry of Education, merging the Directorate of Education into it, and Rongqing was transferred to serve as minister.',
    'On jimao day, the Ministry of Education was created with Rongqing as minister.',
  ],
  s1250: [
    'On day yiwei, the new Sino-Japanese treaty was concluded.',
    'On yiwei day, a new China-Japan treaty was signed.',
  ],
  s1251: [
    'Twelfth month, day xinhai: Natong was made Grand Secretary of the Tiren Pavilion and Rongqing Assistant Grand Secretary.',
    'In month 12, xinhai, Natong became Tiren grand secretary and Rongqing assistant grand secretary.',
  ],
  s1252: [
    'On day guihai, the Metropolitan Inner and Outer City Police General Office was established.',
    'On guihai day, Beijing\'s inner and outer police headquarters were set up.',
  ],
  s1253: [
    'The patrol bureau of artisans was abolished.',
    'The artisans\' patrol bureau was cut.',
  ],
  s1254: [
    'Xu Shichang and Tieliang were both appointed Grand Council ministers.',
    'Xu Shichang and Tieliang joined the Grand Council.',
  ],
  s1255: [
    'That month, overdue levies from troops in the Shengjing banners and Shaanxi districts were remitted, as were rents on Anzhou flood land and Hancheng washaway fields.',
    'That month forgave Shengjing and Shaanxi war arrears and Anzhou-Hancheng land rents.',
  ],
  s1256: [
    'That winter, flood relief was sent to Huize, Jingzhou flood disaster, and Yengisar flood and hail disaster.',
    'That winter brought relief for Huize, Jingzhou floods, and Yengisar flood-hail.',
  ],
  s1257: [
    'Thirty-second year, bingwu, spring, first month, day bingzi: tribute sable from Buteha was deferred.',
    'In Guangxu 32, spring 1, bingzi, Buteha sable tribute was postponed.',
  ],
  s1258: [
    'On day dingchou, the ministers of Germany, Britain, France, the United States, Japan, the Netherlands, Italy, Russia, Austria, Belgium, Portugal, and Mexico, including Mumm, were received in the Palace of Heavenly Purity.',
    'On dingchou day, Mumm and other foreign ministers were received in the Palace of Heavenly Purity.',
  ],
  s1259: [
    'On day dinghai, Zhang Ying, bandit chief of Zhangpu, was executed.',
    'On dinghai day, Zhangpu rebel Zhang Ying was executed.',
  ],
  s1260: [
    'On day renchen, Xu Ye was dismissed for inspection failures.',
    'On renchen day, Xu Ye lost office over inspection faults.',
  ],
  s1261: [
    'On day jiawu, Qu Hongji was appointed Assistant Grand Secretary.',
    'On jiawu day, Qu Hongji became assistant grand secretary.',
  ],
  s1262: [
    'Second month, day wuchen: an edict ordered the provinces to protect churches and foreigners\' persons and property.',
    'In month 2, wuchen, provinces were told to protect churches and foreigners.',
  ],
  s1263: [
    'On day yichou, Minister Mumm and others were received in the Hall of Diligent Government.',
    'On yichou day, Minister Mumm and others were received.',
  ],
  s1264: [
    'That month, one hundred thousand taels from the treasury were issued to aid Japan\'s disaster relief.',
    'That month sent one hundred thousand taels to aid Japan\'s disaster victims.',
  ],
  s1265: [
    'Third month, new moon on day wuchen: loyalty to the ruler, reverence for Confucius, esteem for public spirit, martial spirit, and practical learning were proclaimed as the five great aims of education throughout the realm.',
    'In month 3, wuchen new moon, five education aims were proclaimed empire-wide.',
  ],
  s1266: [
    'On day gengwu, selection of talented Manchu banner girls was halted.',
    'On gengwu day, banner maiden selection ended.',
  ],
  s1267: [
    'On day bingzi, Wang Daxie was ordered to attend the Japanese emperor\'s wedding.',
    'On bingzi day, Wang Daxie was sent to the Japanese imperial wedding.',
  ],
  s1268: [
    'On day bingxu, Jiangsu\'s Tongzhou treaty port was opened.',
    'On bingxu day, Tongzhou in Jiangsu became a treaty port.',
  ],
  s1269: [
    'On day dingyou, an earthquake struck San Francisco in the United States; one hundred thousand taels were issued to relieve Chinese residents.',
    'On dingyou day, San Francisco\'s earthquake drew one hundred thousand taels for Chinese relief.',
  ],
  s1270: [
    'That month, the Austrian minister Gierszewski, the Italian minister Baroli, the German minister Mumm, and the French minister Lépine were received in succession.',
    'That month Austria\'s, Italy\'s, Germany\'s, and France\'s ministers were received in turn.',
  ],
  s1271: [
    'That spring, salt-field levies and miscellaneous taxes on wasteland, ponds, and hills in Renhe and other fields of Zhejiang and in the Hang, Yan, and Qu salt administrations and various prefectures and counties were remitted, together with disaster grain in Yunnan, Hunan, and Xinjiang and overdue levies in Shaanxi.',
    'That spring forgave Zhejiang salt and miscellany taxes and disaster grain in Yunnan, Hunan, Xinjiang, and Shaanxi arrears.',
  ],
  s1272: [
    'Summer, fourth month, new moon on day wuxu: Lu Zhengxiang was ordered to go to Switzerland to negotiate the Red Cross convention.',
    'In summer, month 4, wuxu new moon, Lu Zhengxiang went to Switzerland for the Red Cross treaty.',
  ],
  s1273: [
    'On day jihai, provincial education commissioners were cut and education supervisors were established.',
    'On jihai day, provincial education commissioners became education supervisors.',
  ],
  s1274: [
    'On day gengzi, the Japanese minister Uchida Kanzo was received in the Hall of Diligent Government.',
    'On gengzi day, Minister Uchida was received.',
  ],
  s1275: [
    'On day guichou, Tieliang was appointed Superintendent of Customs and Tang Shaoyi was made his deputy.',
    'On guichou day, Tieliang headed customs with Tang Shaoyi as deputy.',
  ],
  s1276: [
    'On day dingsi, one hundred thousand taels from the Hunan treasury were issued for flood relief.',
    'On dingsi day, one hundred thousand Hunan taels went to flood victims.',
  ],
  s1277: [
    'Intercalary fourth month, day bingxu: because timely rain failed and partial disasters were repeatedly reported, an empress-dowager rescript admonished court and country to warn one another.',
    'On intercalary month 4, bingxu, drought and scattered disasters drew a dowager warning to the whole court.',
  ],
  s1278: [
    'On day wuzi, Tang Jiong was released from Yunnan mining affairs because of age and illness.',
    'On wuzi day, aged and ill Tang Jiong left Yunnan mining affairs.',
  ],
  s1279: [
    'Fifth month, day wuxu: fifty thousand taels from the treasury were issued for Guangdong flood relief.',
    'In month 5, wuxu, fifty thousand taels went to Guangdong flood victims.',
  ],
  s1280: [
    'On day guimao, the Qin River in Henan overflowed and disaster victims were relieved.',
    'On guimao day, Henan\'s Qin River flooded and victims were relieved.',
  ],
  s1281: [
    'That month, the French minister Bastard and Prince Ferdinand of Italy were received in the Palace of Heavenly Purity.',
    'That month France\'s minister and Italy\'s Prince Ferdinand were received.',
  ],
  s1282: [
    'Sixth month, day dingmao: Germany reduced its garrison in Zhili and returned Langfang, Yangcun, Beidaihe, Qinhuang Island, and Shanhaiguan territory to China.',
    'In month 6, dingmao, Germany cut its Zhili garrison and returned Langfang, Yangcun, Beidaihe, Qinhuang Island, and Shanhaiguan.',
  ],
  s1283: [
    'On day gengchen, Tan Jiawei, bandit chief of Yuanling, was executed.',
    'On gengchen day, Yuanling rebel Tan Jiawei was executed.',
  ],
  s1284: [
    'That summer, old arrears at Langqiong were remitted, restored-wasteland quotas at Yarkand were forgiven, and overdue levies in Gansu and Yunnan districts hit by disaster were remitted.',
    'That summer forgave Langqiong arrears, Yarkand wasteland quotas, and Gansu-Yunnan disaster taxes.',
  ],
  s1285: [
    'Flood relief was sent to Wuzhi and fire relief to Chaoyang.',
    'Wuzhi received flood relief and Chaoyang fire relief.',
  ],
  s1286: [
    'Autumn, seventh month, day wuxu: a Sichuan-Yunnan border affairs minister was established, with Zhao Erfeng appointed and given vice-minister rank.',
    'In autumn, month 7, wuxu, Zhao Erfeng became Sichuan-Yunnan border minister with vice-minister rank.',
  ],
  s1287: [
    'The Qin River breach was closed.',
    'The Qin River breach was sealed.',
  ],
  s1288: [
    'On day gengzi, Jiangsu\'s land and water camps, banner defense forces, and garrison troops were reorganized into patrol defense corps.',
    'On gengzi day, Jiangsu\'s camps and banner forces became patrol defense corps.',
  ],
  s1289: [
    'On day xinchou, the constitutional inspection ministers led by Zai Ze returned to the capital and submitted a sealed memorial.',
    'On xinchou day, Zai Ze\'s inspection mission returned and filed a sealed report.',
  ],
  s1290: [
    'The Prince Chun, Grand Council and Government Affairs ministers, grand secretaries, and the Beiyang minister were ordered jointly to read it and decide what to adopt.',
    'Prince Chun, the council, grand secretaries, and the Beiyang minister were told to review it.',
  ],
  s1291: [
    'On day yisi, Dadonggou in Fengtian was opened as a treaty port and a customs house was set up, supervised concurrently by the eastern border intendant.',
    'On yisi day, Fengtian\'s Dadonggou opened as a port under the eastern border intendant.',
  ],
  s1292: [
    'On day wushen, an edict stated: "Zai Ze and the others memorialized that national strength fails to rise because superiors and inferiors are estranged and inner and outer circles are blocked off.',
    'On wushen day, the court cited Zai Ze\'s report that China weakened through estrangement within and without.',
  ],
  s1293: [
    'Officials do not know how to protect the people, and the people do not know how to defend the state.',
    'Officials failed to protect the people and the people failed to defend the realm.',
  ],
  s1294: [
    'The wealth and power of every country come from actually carrying out constitutional government and deciding matters by public discussion.',
    'Foreign strength, they said, came from real constitutional rule and public deliberation.',
  ],
  s1295: [
    'At the present time there is nothing but to imitate constitutional government, concentrating great power in the court and placing routine administration before public opinion.',
    'China must imitate constitutionalism, keeping supreme power at court while routine policy followed public opinion.',
  ],
  s1296: [
    'Prepare the foundations of constitutional government and cause inner and outer officials truly to revive the state.',
    'The edict called for constitutional foundations and a real revival by all officials.',
  ],
  s1297: [
    'After several years, when the framework is roughly complete, draw on each country\'s established methods and again fix a term for actual implementation."',
    'After a few years China would borrow foreign models and set a date for full implementation."',
  ],
  s1298: [
    'On day jiyou, an edict on preparing constitutional government ordered that the official system first be clarified; ministers were commanded to compile it, with Yikuang, Sun Jianai, and Qu Hongji in overall charge of verification for imperial approval.',
    'On jiyou day, constitutional preparation required fixing the official system under Yikuang, Sun Jianai, and Qu Hongji.',
  ],
  s1299: [
    'Duanfang was transferred to governor-general of the Two Jiangs and concurrently Minister for the Southern Seas.',
    'Duanfang became Two Jiangs governor-general and Southern Seas minister.',
  ],
  s1300: [
    'On day jiazi, one hundred thousand taels from the Jiangsu treasury were issued to relieve flood disaster in Xu, Hai, and western Huai districts.',
    'On jiazi day, one hundred thousand Jiangsu taels went to Xu, Hai, and western Huai flood victims.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b13.mjs <translation.json>'
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
