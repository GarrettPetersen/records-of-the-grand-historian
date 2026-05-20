#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'The Emperor, escorting the Empress Dowager, paid homage at the Western Tombs.',
    'Escorting the dowager, the Emperor visited the Western Tombs.',
  ],
  s1002: [
    'On day yichou, [the Emperor] visited Baoding Prefecture and halted the imperial progress; one-third of the regular tax quota was remitted for prefectures and counties along the procession route.',
    'On yichou day, he halted at Baoding and remitted one-third of taxes along the route.',
  ],
  s1003: [
    'On day jisi, Ronglu died and was posthumously made Grand Tutor and promoted one rank to baron.',
    'On jisi day, Ronglu died and was posthumously made Grand Tutor and a first-class baron.',
  ],
  s1004: [
    'Stamp tax and all harsh miscellaneous levies were abolished; those who assessed and extorted extra levies were prosecuted according to law.',
    'Stamp tax and petty levies were abolished; illegal extortion was punished by law.',
  ],
  s1005: [
    'On day gengwu, Yikuang was appointed Grand Councilor.',
    'On gengwu day, Yikuang joined the Grand Council.',
  ],
  s1006: [
    'On day guihai, [the Emperor] visited the Southern Park.',
    'On guihai day, the Southern Park was visited.',
  ],
  s1007: [
    'On day jiaxu, [the Emperor] visited Tuanhe and halted the imperial progress.',
    'On jiaxu day, he halted the progress at Tuanhe.',
  ],
  s1008: [
    'On day gengchen, Yikuang and Qu Hongji were ordered to join the Board of Revenue in reorganizing finances.',
    'On gengchen day, Yikuang and Qu Hongji were told to reorganize finances with the Board of Revenue.',
  ],
  s1009: [
    'A general mint for silver coinage was established in the capital.',
    'A capital mint for silver coin was established.',
  ],
  s1010: [
    'Zai Zhen, Yuan Shikai, and Wu Tingfang were ordered to assist in revising the commercial code.',
    'Zai Zhen, Yuan Shikai, and Wu Tingfang were told to help revise commercial law.',
  ],
  s1011: [
    'On day xinsi, [the Emperor] returned from the Southern Park.',
    'On xinsi day, he returned from the Southern Park.',
  ],
  s1012: [
    'That month, arrears from the gengzi year in Shaanxi were remitted.',
    'That month, Shaanxi gengzi-year tax arrears were forgiven.',
  ],
  s1013: [
    'Summer, fourth month, day jihai: the foreign ministers were received at the Hall of Benevolent Longevity.',
    'In summer month 4, jihai, foreign ministers were received at the Hall of Benevolent Longevity.',
  ],
  s1014: [
    'On day jiyou, Yunnan bandits seized Lin\'an Prefecture city.',
    'On jiyou day, Yunnan bandits took Lin\'an city.',
  ],
  s1015: [
    'On day gengxu, banner rents along the imperial procession route were remitted.',
    'On gengxu day, banner rents on the procession route were waived.',
  ],
  s1016: [
    'On day xinhai, Chongli was appointed Grand Secretary of the Eastern Pavilion; Jingxin was appointed Associate Grand Secretary.',
    'On xinhai day, Chongli was made Eastern Pavilion Grand Secretary and Jingxin associate Grand Secretary.',
  ],
  s1017: [
    'Fifth month, guihai day: Tie Liang was ordered to join Yuan Shikai in drilling the Beijing Banner troops.',
    'In month 5, guihai, Tie Liang was told to drill Beijing Banner troops with Yuan Shikai.',
  ],
  s1018: [
    'On day wuchen, the Board of Revenue burned.',
    'On wuchen day, fire struck the Board of Revenue.',
  ],
  s1019: [
    'On day jiaxu, Yang Shu was appointed minister to Japan.',
    'On jiaxu day, Yang Shu was made minister to Japan.',
  ],
  s1020: [
    'On day yihai, the Yunnan Luo tribes were pacified.',
    'On yihai day, Yunnan Luo rebels were pacified.',
  ],
  s1021: [
    'On day renwu, Wang Shoupeng and 315 others were granted jinshi with first and lower passes, each according to rank.',
    'On renwu day, 315 candidates including Wang Shoupeng received jinshi degrees at different levels.',
  ],
  s1022: [
    'Intercalary fifth month, new moon day jiashen: Feng Zicai was ordered to join Cen Chunxuan in managing Guangxi military affairs.',
    'Intercalary month 5, new moon jiashen, Feng Zicai was told to manage Guangxi military affairs with Cen Chunxuan.',
  ],
  s1023: [
    'On day bingxu, Zhang Zhidong was ordered to join Zhang Boxing and Rongqing in fixing regulations for the Imperial University.',
    'On bingxu day, Zhang Zhidong, Zhang Boxing, and Rongqing were told to settle university regulations.',
  ],
  s1024: [
    'On day gengyin, Yunnan troops recovered Lin\'an Prefecture city; bandit leader Zhou Yunxiang of Shiping was executed.',
    'On gengyin day, Yunnan troops retook Lin\'an; Shiping bandit Zhou Yunxiang was executed.',
  ],
  s1025: [
    'On day renchen, from the fourth month without rain until this day it rained.',
    'On renchen day, rain fell for the first time since the drought began in month 4.',
  ],
  s1026: [
    'On day bingshen, Guangxi Governor Wang Zhichun and Military Commissioner Su Yuanchun were both stripped of office; Ke Fengshi was made Guangxi governor and Liu Guangcai Guangxi military commissioner.',
    'On bingshen day, Wang Zhichun and Su Yuanchun were dismissed; Ke Fengshi became governor and Liu Guangcai military commissioner.',
  ],
  s1027: [
    'On day jihai, the special examination in practical statecraft was held at the Hall of Preserving Harmony.',
    'On jihai day, the economics special exam was held in the Hall of Preserving Harmony.',
  ],
  s1028: [
    'On day renyin, Ma Yukun was ordered to patrol and suppress bandits in the capital vicinity.',
    'On renyin day, Ma Yukun was told to patrol bandits near the capital.',
  ],
  s1029: [
    'On day jiachen, the renewed Sino-British commercial treaty was concluded.',
    'On jiachen day, the Sino-British commercial treaty renewal was signed.',
  ],
  s1030: [
    'Sixth month, renxu day: those who passed the special examination, including Yuan Jiagu, were promoted in rank each according to merit.',
    'In month 6, renxu, special-exam passers including Yuan Jiagu were promoted at different levels.',
  ],
  s1031: [
    'On day guihai, Su Yuanchun was arrested and imprisoned.',
    'On guihai day, Su Yuanchun was jailed.',
  ],
  s1032: [
    'On day dingmao, Shishuo and others requested that an honorific title be added for the Empress Dowager.',
    'On dingmao day, Shishuo and others asked to add a dowager honorific title.',
  ],
  s1033: [
    'An edict from the Empress Dowager refused, citing that Guangxi military affairs were still pressing and the people\'s livelihood was distressed.',
    'The dowager refused: Guangxi fighting was fierce and the people were suffering.',
  ],
  s1034: [
    'On day dingchou, the Yellow River burst its banks at Lijin.',
    'On dingchou day, the Yellow River broke at Lijin.',
  ],
  s1035: [
    'That month, Japanese minister Uchida Kanzo and others and Italian minister Gallina and others were received at the Hall of Benevolent Longevity.',
    'That month, Japanese minister Uchida and Italian minister Gallina were received at the Hall of Benevolent Longevity.',
  ],
  s1036: [
    'Flood disaster at Yantai, Shandong; relief was ordered.',
    'Yantai, Shandong flood victims were ordered relieved.',
  ],
  s1037: [
    'Autumn, seventh month, yiyou day: Xiamen and Gulangyu were opened as international settlement zones.',
    'In autumn month 7, yiyou, Xiamen and Gulangyu were opened as foreign concessions.',
  ],
  s1038: [
    'On day xinmao, Zheng Xiaoxu was rewarded with fourth-rank capital bureau status, put in charge of Guangxi frontier defense, and granted the right of direct memorial.',
    'On xinmao day, Zheng Xiaoxu was given fourth-rank status to oversee Guangxi\'s frontier with direct memorial rights.',
  ],
  s1039: [
    'Kun Gang retired from office.',
    'Kun Gang retired.',
  ],
  s1040: [
    'On day wuxu, the Ministry of Commerce was first established, with Zai Zhen as minister.',
    'On wuxu day, the Commerce Ministry was created with Zai Zhen as head.',
  ],
  s1041: [
    'Eighth month, new moon day renzi: princes, dukes, and officials asked in advance to offer portions of their salaries for the Empress Dowager\'s seventieth birthday next year; an edict from the Empress Dowager forbade it.',
    'In month 8, new moon renzi, officials asked to donate salaries for the dowager\'s seventieth birthday; she forbade it.',
  ],
  s1042: [
    'On day guichou, land tax on riverside fields in Ling Prefecture was remitted.',
    'On guichou day, Ling riverside land tax was waived.',
  ],
  s1043: [
    'On day dingmao, the Japanese commercial treaty was concluded.',
    'On dingmao day, the Japanese commercial treaty was signed.',
  ],
  s1044: [
    'On day gengyin, the foreign ministers were received at the Hall of Benevolent Longevity.',
    'On gengyin day, foreign ministers were received at the Hall of Benevolent Longevity.',
  ],
  s1045: [
    'On day renshen, Jingxin was made Grand Secretary of the Hall of Embodied Benevolence; Yude was made Associate Grand Secretary.',
    'On renshen day, Jingxin became Embodied Benevolence Grand Secretary and Yude associate Grand Secretary.',
  ],
  s1046: [
    'On day dingchou, French minister Dubail and German minister Mumm were received at the Hall of Benevolent Longevity.',
    'On dingchou day, French minister Dubail and German minister Mumm were received at the Hall of Benevolent Longevity.',
  ],
  s1047: [
    'Ninth month, bingshen day: Rongqing was ordered to study while serving on the Grand Council.',
    'In month 9, bingshen, Rongqing was told to study on the Grand Council.',
  ],
  s1048: [
    'Na Tong was transferred to be Minister of Foreign Affairs and concurrent assisting minister.',
    'Na Tong was moved to head foreign affairs as assisting minister.',
  ],
  s1049: [
    'On day dingyou, Na Tong was ordered to join Yikuang and Qu Hongji in reorganizing Board of Revenue finances; Rongqing was appointed minister of the Office of Government Affairs.',
    'On dingyou day, Na Tong joined Yikuang and Qu Hongji on finances; Rongqing joined the Government Affairs Office.',
  ],
  s1050: [
    'On day wuxu, Sun Jianai and Zhang Boxing were both appointed ministers of the Office of Government Affairs.',
    'On wuxu day, Sun Jianai and Zhang Boxing joined the Government Affairs Office.',
  ],
  s1051: [
    'That autumn, flood relief was ordered for Hubei, Shaanxi, and subordinate districts; hail disaster in Huairou; flood, drought, and hail in Yunnan subordinates; locust and frost disasters in Zhenxi and Suilai.',
    'That autumn, floods in Hubei and Shaanxi, hail in Huairou, disasters in Yunnan, locusts and frost in Zhenxi and Suilai were relieved.',
  ],
  s1052: [
    'Tenth month, new moon day xinhai: Dutch minister Heidt was received at the Palace of Heavenly Purity.',
    'In month 10, new moon xinhai, Dutch minister Heidt was received at the Palace of Heavenly Purity.',
  ],
  s1053: [
    'On day wuwu, because Yingxiu\'s reception of borrowed territory at Aletai led to proposals to extend the deadline, Ruixun was ordered to go investigate.',
    'On wuwu day, Ruixun was sent to investigate Aletai leased land after Yingxiu delayed handover.',
  ],
  s1054: [
    'On day bingyin, the Army Reorganization Office was established; Yikuang was appointed director, Yuan Shikai and Tie Liang deputies.',
    'On bingyin day, the Army Reorganization Office was set up under Yikuang with Yuan Shikai and Tie Liang as deputies.',
  ],
  s1055: [
    'On day jiaxu, Cen Chunxuan was ordered to command all Guangxi forces.',
    'On jiaxu day, Cen Chunxuan was put in command of all Guangxi troops.',
  ],
  s1056: [
    'On day yihai, Yang Sheng was rewarded with fourth-rank honorary title and appointed minister to Austria.',
    'On yihai day, Yang Sheng was given fourth rank and sent as minister to Austria.',
  ],
  s1057: [
    'On day bingzi, Yuan Shikai impeached Zhang Yi for selling the Kaiping coal mines and the Qinhuangdao port to foreigners without authorization.',
    'On bingzi day, Yuan Shikai charged Zhang Yi with illegally selling Kaiping mines and Qinhuangdao port to foreigners.',
  ],
  s1058: [
    'An edict stripped him of office and ordered recovery of what was sold.',
    'He was dismissed and ordered to take the assets back.',
  ],
  s1059: [
    'Eleventh month, bingwu day: an edict said: "Promoting schools and nurturing talent is the urgent task.',
    'In month 11, bingwu, an edict said promoting schools and talent was the urgent task.',
  ],
  s1060: [
    'According to what Zhang Zhidong and the Superintendent of Education jointly fixed in school regulations, schools and the examination system are to be merged into one path, so that scholars gain real learning and learning gains real use.',
    'Zhang Zhidong and the education superintendent had merged schools and examinations so scholars would gain real learning.',
  ],
  s1061: [
    'From the bingwu examinations onward, quotas for provincial and metropolitan degrees and for provincial student quotas are to be reduced examination by examination.',
    'From the bingwu exams onward, provincial, metropolitan, and student quotas would shrink each round.',
  ],
  s1062: [
    'When provincial schools are fully set up and effective, examination quotas are to be stopped separately; afterward all selection is through school examinations."',
    'When provincial schools worked, exam quotas would end and selection would pass entirely to schools."',
  ],
  s1063: [
    '" On dingwei day, the Superintendent of Education was renamed Minister of Education, with Sun Jianai appointed.',
    'On dingwei day, the education superintendent became Minister of Education under Sun Jianai.',
  ],
  s1064: [
    'Twelfth month, bingchen day: Guangxi bandit leaders Tan Zhifa and others were executed.',
    'In month 12, bingchen, Guangxi bandits Tan Zhifa and others were executed.',
  ],
  s1065: [
    'On day wuwu, an edict ordered the Imperial Household Department again to cut palace expenses and stop all non-urgent work.',
    'On wuwu day, the Household Department was told to cut palace spending and halt non-urgent projects.',
  ],
  s1066: [
    'On day jisi, Hanlin academicians for drafting were established, posts increased, and grades revised.',
    'On jisi day, drafting Hanlin posts were created with more slots and new grades.',
  ],
  s1067: [
    'On day bingzi, because Japan and Russia had joined battle, China would observe neutrality and the people were so informed.',
    'On bingzi day, with Japan and Russia at war, China\'s neutrality was proclaimed to the people.',
  ],
  s1068: [
    'On day jimao, Rongqing was appointed Grand Councilor.',
    'On jimao day, Rongqing joined the Grand Council.',
  ],
  s1069: [
    'That month, land tax and grain rent on flooded fields in An Prefecture and drought-stricken fields in Kunming were remitted.',
    'That month, flooded An and drought-hit Kunming land taxes were waived.',
  ],
  s1070: [
    'That winter, flood relief was ordered for Gansu and Yunnan prefectures and counties; torrent disaster in Nanzhou and Xinhua; fire disaster in Luzhou.',
    'That winter, Gansu and Yunnan floods, Nanzhou and Xinhua torrents, and Luzhou fire were relieved.',
  ],
  s1071: [
    'Thirtieth year, jiachen, spring, first month, guiwei day: the Guangxi Salt Circuit was moved to Wuzhou with concurrent customs supervision.',
    'In year 30, jiachen, spring month 1, guiwei, the Guangxi salt circuit moved to Wuzhou and took customs oversight.',
  ],
  s1072: [
    'The Yellow River burst its banks at Wangzhuang, Lijin.',
    'The Yellow River broke at Wangzhuang in Lijin.',
  ],
  s1073: [
    'On day jiashen, ministers of the United States, Britain, France, Germany, Japan, Italy, Belgium, the Netherlands, and Portugal, including Conger, were received at the Palace of Heavenly Purity.',
    'On jiashen day, US, British, French, German, Japanese, Italian, Belgian, Dutch, and Portuguese ministers including Conger were received at the Palace of Heavenly Purity.',
  ],
  s1074: [
    'On day jichou, Yunnan Military Commissioner Zhang Chunfa was found guilty, stripped of office, and banished to a military guard post.',
    'On jichou day, Zhang Chunfa, Yunnan commander, was dismissed and banished for misconduct.',
  ],
  s1075: [
    'On day jiawu, for the Empress Dowager\'s seventieth sacred birthday, the Emperor ascended the Hall of Supreme Harmony, issued an edict to the realm, and granted amnesty each according to degree.',
    'On jiawu day, for the dowager\'s seventieth birthday, the Emperor proclaimed amnesty from the Hall of Supreme Harmony.',
  ],
  s1076: [
    'On day jihai, Gaodeyuan, commander at Pu\'er in Yunnan, was executed for indulging bandits and harming the people.',
    'On jihai day, Pu\'er commander Gaodeyuan was beheaded for tolerating bandits and harming civilians.',
  ],
  s1077: [
    'On day jiyou, an edict suspended autumn executions for this year.',
    'On jiyou day, autumn executions were suspended this year.',
  ],
  s1078: [
    'Second month, new moon day gengxu: there was a solar eclipse.',
    'In month 2, new moon gengxu, there was a solar eclipse.',
  ],
  s1079: [
    'On day jiwei, Portuguese minister Barraso was received at the Palace of Heavenly Purity.',
    'On jiwei day, Portuguese minister Barraso was received at the Palace of Heavenly Purity.',
  ],
  s1080: [
    'On day bingyin, the Lijin breach was closed.',
    'On bingyin day, the Lijin river breach was sealed.',
  ],
  s1081: [
    'Third month, new moon day gengchen: German minister Mumm and others were received at the Palace of Heavenly Purity.',
    'In month 3, new moon gengchen, German minister Mumm and others were received at the Palace of Heavenly Purity.',
  ],
  s1082: [
    'On day guiwei, Censor Jiang Shixing was rebuked and returned to his post for memorializing against Yikuang on groundless charges.',
    'On guiwei day, Censor Jiang Shixing was sent back for a baseless attack on Yikuang.',
  ],
  s1083: [
    'On day wuzi, Wang Zhao was imprisoned.',
    'On wuzi day, Wang Zhao was jailed.',
  ],
  s1084: [
    'On day gengyin, tax arrears in Yulin and other prefectures and counties were remitted.',
    'On gengyin day, Yulin and other counties\' tax arrears were forgiven.',
  ],
  s1085: [
    'On day dingwei, the labor-protection treaty with Britain negotiated by Zhang Deyi was concluded.',
    'On dingwei day, Zhang Deyi\'s Sino-British labor treaty was signed.',
  ],
  s1086: [
    'Summer, fourth month, xinhai day: German Prince Albrecht and minister Mumm were received at the Palace of Heavenly Purity.',
    'In summer month 4, xinhai, German Prince Albrecht and minister Mumm were received at the Palace of Heavenly Purity.',
  ],
  s1087: [
    'On day yihai, Su Yuanchun was banished to garrison duty in Xinjiang.',
    'On yihai day, Su Yuanchun was sent to Xinjiang in exile.',
  ],
  s1088: [
    'That month, disaster grain tax in Dengchuan from the previous year was remitted; flash floods in Xinhua; war arrears in Hulan, Suihua, and subordinate districts.',
    'That month, Dengchuan disaster tax, Xinhua flood tax, and Hulan-Suihua war arrears were waived.',
  ],
  s1089: [
    'Fifth month, xinsi day: Circuit Intendant Yuan Dahua was ordered to manage Anhui mining affairs.',
    'In month 5, xinsi, Yuan Dahua was told to handle Anhui mining.',
  ],
  s1090: [
    'On day yiyou, fire struck the Jehol imperial villa.',
    'On yiyou day, the Jehol palace burned.',
  ],
  s1091: [
    'On day bingxu, an edict from the Empress Dowager specially pardoned those of the 1898 faction; except Kang Youwei, Liang Qichao, and Sun Wen, those stripped of office had rank restored and those wanted, imprisoned, or under surveillance were released.',
    'On bingxu day, the dowager amnestied the 1898 reformers except Kang, Liang, and Sun; dismissed officials were restored and prisoners freed.',
  ],
  s1092: [
    'On day wuxu, Guangxi mutinous troops seized Liucheng; commander Zu Shengwu was beheaded before the army.',
    'On wuxu day, Guangxi mutineers took Liucheng and commander Zu Shengwu was executed in camp.',
  ],
  s1093: [
    'On day jihai, tribute student Fan Fengyi of Xingtai, nine generations dwelling together, was commended.',
    'On jihai day, Xingtai student Fan Fengyi was honored for nine generations under one roof.',
  ],
  s1094: [
    'On day guimao, Liu Chunlin and 273 others were granted jinshi with first and lower passes, each according to rank.',
    'On guimao day, 273 candidates including Liu Chunlin received jinshi degrees at different levels.',
  ],
  s1095: [
    'On day yisi, an edict from the Empress Dowager ordered that banquet celebrations for this year\'s seventieth birthday be stopped; generals and governors were not to come to the capital to offer congratulations, and tribute gifts were also waived.',
    'On yisi day, the dowager canceled birthday banquets and forbade governors from coming to court or sending gifts.',
  ],
  s1096: [
    'The superintendents of the Guangdong Maritime Customs and Huai\'an Customs and the Nanjing imperial silk weaving office were abolished.',
    'Guangdong customs, Huai\'an customs, and Nanjing silk weaving superintendents were abolished.',
  ],
  s1097: [
    'Sixth month, jiyou day: an edict said: "Times are hard and the people suffer; officials obstruct and block, and sentiment below does not reach above.',
    'In month 6, jiyou, an edict said hard times and official obstruction kept the court from hearing the people.',
  ],
  s1098: [
    'Even at prefecture and county level, tax and grain are collected beyond quota and pocketed in the middle; what was paid is counted as owed—countless abuses arise, gravely betraying the court\'s intent to care for the people.',
    'Counties over-collected taxes, pocketed surcharges, and booked payments as arrears, betraying the court\'s care for the people.',
  ],
  s1099: [
    'Each governor-general and governor is urgently to report how much was the quota, how much actually collected, how much grain for principal and surcharge or how much converted to cash, setting forth concise tables.',
    'Every governor-general and governor had to report quotas, actual collections, grain and surcharges, or cash conversions in concise tables.',
  ],
  s1100: [
    'Whether there are any other customary fees besides these must each be clearly recorded and stated—no embellishment, no omission—and reported truthfully in memorial."',
    'Any other fees had to be listed plainly without concealment and reported truthfully."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b11.mjs <translation.json>'
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
