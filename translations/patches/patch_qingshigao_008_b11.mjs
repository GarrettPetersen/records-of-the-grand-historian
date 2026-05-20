#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s1001: [
    'On day wuwu, Tibet was taken; over a hundred rebel lamas who had sided with the enemy were seized, five ringleaders were beheaded, the Tangut and Tubet peoples were reassured, and Tibet was pacified.',
    'On wuwu day, Tibet was conquered; rebel lamas were captured and five leaders executed, local peoples were reassured, and the region was pacified.',
  ],
  s1002: [
    'Gao Qizhuo was made governor of Guangxi.',
    'Gao Qizhuo became Guangxi governor.',
  ],
  s1003: [
    'Ninth month, day renshen: Pacification General Yensin escorted the Dalai Lama into Tibet for enthronement.',
    'In the ninth month, on renshen day, Yensin escorted the Dalai Lama to Tibet for enthronement.',
  ],
  s1004: [
    'Fu Ning\'an\'s army entered Urumchi; Khazakh Muslims came forward to submit; the army returned to Ulan Usu.',
    'Fu Ning\'an entered Urumchi, the Khazakhs submitted, and the army withdrew to Ulan Usu.',
  ],
  s1005: [
    'On day wuyin, Yunnan-Guizhou Governor-General Jiang Chenxi and Governor Gan Guobi were stripped of office for late grain transport, but were still ordered to convey grain into Tibet.',
    'Jiang Chenxi and Gan Guobi were dismissed for late Tibet grain shipments but ordered to continue transport.',
  ],
  s1006: [
    'Winter, tenth month, day guimao: the Emperor returned to the capital.',
    'In the tenth month, the Emperor returned to Beijing.',
  ],
  s1007: [
    'An edict ordered that Henan stored grain again be sent to Shaanxi for relief.',
    'The court again ordered Henan granary grain sent to relieve Shaanxi.',
  ],
  s1008: [
    'Next year the Henan transport grain was to be fully replenished to the granaries; the remaining transport grain was to be kept in storage in Henan.',
    'Henan was to restore its granaries the next year and keep surplus transport grain in the province.',
  ],
  s1009: [
    'On day jiachen, the King of Korea, Li Hun, died.',
    'On jiachen day, Korean King Li Hun died.',
  ],
  s1010: [
    'An edict said: "Li Hun held his enfeoffment for fifty years, served the court as tributary with respect, and governed his people with kindness.',
    'An edict praised Li Hun\'s fifty years as a dutiful, benevolent Korean king.',
  ],
  s1011: [
    'Now hearing of his sudden death, Our grief is deep; his son Li Yun is at once ordered to succeed to the title.',
    'Grieving his death, the Emperor ordered Prince Li Yun to succeed.',
  ],
  s1012: [
    'The tribute goods presented are all to be taken back, and funeral honors are to be examined and memorialized in full."',
    'Tribute was returned and funeral honors were to be reported."',
  ],
  s1013: [
    '" An edict wholly remitted the Kangxi sixtieth-year land-poll tax silver of 1,880,000-odd taels for Shaanxi and Gansu provinces.',
    'Land-poll tax for Shaanxi and Gansu was wholly remitted for Kangxi year 60.',
  ],
  s1014: [
    'Along the frontier the harvest was poor, rice prices were high, and military funds were strained; this year\'s military pay was also issued in advance.',
    'Frontier poor harvests strained funds; military pay was advanced for the year.',
  ],
  s1015: [
    'Gifts were bestowed on the officers and soldiers who had entered Tibet.',
    'Troops who had entered Tibet received imperial gifts.',
  ],
  s1016: [
    'On day jiayin, Minister of Revenue Zhao Shenqiao died; sacrificial rites and burial honors were granted, posthumous title Gongyi.',
    'Minister of Revenue Zhao Shenqiao died and received posthumous name Gongyi.',
  ],
  s1017: [
    'On day dingsi, an edict ordered Pacification General Yinti to confer on next year\'s campaign schedule.',
    'Yinti was ordered to plan the next year\'s campaign schedule.',
  ],
  s1018: [
    'On day wuwu, because Shaanxi and Gansu had poor harvests, an order was issued for combined silver-and-grain relief until the wheat harvest.',
    'Shaanxi and Gansu received combined silver and grain relief until the wheat harvest.',
  ],
  s1019: [
    'Eleventh month, day xinwei: officials were sent to offer sacrifice for the late King of Korea Li Hun; the special posthumous title Xishun was granted, and the heir Li Yun was enfeoffed as King of Korea.',
    'In the eleventh month, envoys sacrificed for Li Hun, gave posthumous name Xishun, and enfeoffed Li Yun as king.',
  ],
  s1020: [
    'On day wuyin, Tian Congdian was made Minister of Revenue, Zhu Shi Left Censor-in-chief, and Yang Mingshi governor of Yunnan.',
    'Tian Congdian, Zhu Shi, and Yang Mingshi received new appointments.',
  ],
  s1021: [
    'On day xinsi, an edict said: "When the great army entered Tibet, all its lands entered the territory under Our rule; where Tibetan and Chinese place-names differ, they should at once be examined and fixed clearly to transmit certainty to later ages.',
    'An edict ordered Tibetan and Chinese place-names in the new territories verified for posterity.',
  ],
  s1022: [
    '" The Emperor then discussed with the Grand Secretaries the sources of the Yellow River and Yangtze, reaching also to Sanwei in the Yugong."',
    'The Emperor then discussed river sources and Sanwei in the Yugong with his Grand Secretaries.',
  ],
  s1023: [
    'On day gengyin, Longkodo was made Minister of the Court of Colonial Affairs while continuing as commander of the Metropolitan Banners.',
    'Longkodo became Lifan Yuan minister and kept command of the Metropolitan Banners.',
  ],
  s1024: [
    'Twelfth month, day jiachen: the court ministers again asked to perform the sixtieth-year celebration rites.',
    'In the twelfth month, ministers again sought sixtieth-year celebration rites.',
  ],
  s1025: [
    'This was not permitted.',
    'The Emperor refused.',
  ],
  s1026: [
    'On day renzi, the descendant of the ancient sage Zixia was granted the office of Five Classics Doctor.',
    'A descendant of Zixia received the Five Classics doctorate.',
  ],
  s1027: [
    'On day jiayin, Hongshi, son of Prince Cheng Yinqi, and Hongsheng, son of Prince Heng Yinqi, were made heir sons.',
    'Hongshi of Prince Cheng and Hongsheng of Prince Heng were named heir sons.',
  ],
  s1028: [
    'On day xinyou, the combined seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On xinyou day, the combined sacrifice was held at the Imperial Ancestral Temple.',
  ],
  s1029: [
    'This year, disaster land tax for fifty-six prefectures, districts, and garrisons in Zhili, Jiangsu, Shaanxi, Zhejiang, Sichuan, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for fifty-six disaster districts across several provinces.',
  ],
  s1030: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s1031: [
    'Sixtieth year, spring, first month, day yihai: because the Emperor had ruled for sixty years, the fourth imperial son Yinzhen, the twelfth imperial son Yinxiang, and the heir son Hongshi were sent to announce the occasion at the Yong, Fu, and Zhao tombs.',
    'In the sixtieth year, Yinzhen, Yinxiang, and heir Hongshi were sent to announce the reign milestone at the imperial tombs.',
  ],
  s1032: [
    'Second month, day yiwei: the Emperor visited the tombs of Empress Xiaozhuang, the Xiaoling, and the Xiaodong tombs and performed the announcement rites.',
    'In the second month, the Emperor performed announcement rites at the Xiaozhuang and related tombs.',
  ],
  s1033: [
    'Officials were sent to announce the occasion at the suburban altars and the altars of soil and grain.',
    'Envoys announced the occasion at suburban temples and altars.',
  ],
  s1034: [
    'On day yimao, the Emperor returned to the capital.',
    'On yimao day, the Emperor returned to Beijing.',
  ],
  s1035: [
    'Shandong salt laborers Wang Meigong and others rose in revolt; they were captured and executed.',
    'Shandong salt rebels led by Wang Meigong were captured and executed.',
  ],
  s1036: [
    'On day jiwei, Prince Gongsewang Norbu was ordered to garrison Tibet.',
    'Gongsewang Norbu was ordered to garrison Tibet.',
  ],
  s1037: [
    'Discussing merit in recovering Tibet, Depa Arabpa and Kangji Nai were enfeoffed as beile, and Depa Longbunai as Fuguo Duke.',
    'For the Tibet campaign, Arabpa and Kangji Nai became beile and Longbunai Fuguo Duke.',
  ],
  s1038: [
    'Third month, day yichou: the ministers asked that a honorific title be conferred for the Longevity Festival; the Emperor did not permit it, saying: "Adding a honorific title is a vulgar custom handed down from habit, nothing more than turning words about to deceive rulers who do not study.',
    'In the third month, ministers sought a Longevity Festival honorific; the Emperor refused, calling it a deceitful custom.',
  ],
  s1039: [
    'Our dynasty\'s house law takes loving the people as its business and does not take propitious stars, auspicious clouds, sacred fungus, or sweet dew as omens; there is also no fengshan or change of reign title.',
    'He said the Qing cared for the people, not omens, and held no fengshan or era change.',
  ],
  s1040: [
    'At present troops have long been exposed on campaign in the western marches, and the people suffer from transport.',
    'Western campaigns had long exposed troops and burdened transport.',
  ],
  s1041: [
    'We are busy with self-examination and governance—what is there to celebrate?"',
    'He asked what there was to celebrate while war still burdened the realm."',
  ],
  s1042: [
    '" On day gengwu, the licentiates Wang Lansheng and Liubao were granted jinshi status and admitted to the palace examination on equal terms.',
    'Wang Lansheng and Liubao, compiler licentiates, were granted jinshi and palace examination status.',
  ],
  s1043: [
    'On day jiaxu: earlier, Grand Secretary Wang Yan had submitted a secret memorial to restore the heir apparent.',
    'On jiaxu day, it was recalled that Wang Yan had secretly urged restoring the heir.',
  ],
  s1044: [
    'At this time the censors Tao Yi, Ren Ping, Fan Changfa, Zou Tuyun, Chen Jiayou, Wang Yunjin, Li Yunfu, Fan Yuntao, Gao Bin, Gao Yi, Zhao Chengsi, and Sun Shaozeng memorialized asking that an heir be established; the Emperor was displeased and sharply rebuked Wang Yan together with them, ordering his son, the Household Minister Wang Yiqing, and Tao Yi and the other twelve men to serve as extra Zhangjing on campaign at the front.',
    'Censors led by Tao Yi asked to establish an heir; the Emperor rebuked Wang Yan and sent him, his son, and twelve censors to serve at the front.',
  ],
  s1045: [
    'Summer, fourth month, day jiawu: Li Lin was made commander at Guyuan.',
    'In the fourth month, Li Lin became Guyuan commander.',
  ],
  s1046: [
    'On day yiwei, Deng Zhongyue and one hundred sixty-three others were granted jinshi and other ranks with distinctions.',
    'On yiwei day, Deng Zhongyue and 163 others received jinshi degrees.',
  ],
  s1047: [
    'On day bingshen, an edict ordered the regulations for worship at the Temple of Former Kings to be fixed.',
    'On bingshen day, dynastic temple worship regulations were ordered revised.',
  ],
  s1048: [
    'On day dingyou, Zhang Penghe and Chen Pengnian were ordered to go to Shandong to inspect the rivers.',
    'Zhang Penghe and Chen Pengnian were sent to inspect Shandong rivers.',
  ],
  s1049: [
    'Lai Du was made Minister of Rites and Tolai Minister of Punishments.',
    'Lai Du became Minister of Rites and Tolai Minister of Punishments.',
  ],
  s1050: [
    'On day bingwu, the Emperor went to Rehe.',
    'On bingwu day, the Emperor went to Rehe.',
  ],
  s1051: [
    'On day wuwu, General Garbi was ordered to garrison Tibet.',
    'Garbi was ordered to garrison Tibet.',
  ],
  s1052: [
    'Fifth month, day renxu: Pacification General Yinti was ordered to move his army to Ganzhou.',
    'In the fifth month, Yinti was ordered to move his army to Ganzhou.',
  ],
  s1053: [
    'On day bingyin, the Taiwan ruffian Zhu Yigui rose in revolt and killed the regional commander Ouyang Kai.',
    'Zhu Yigui rebelled in Taiwan and killed Commander Ouyang Kai.',
  ],
  s1054: [
    'On day guiyou, Acting Deputy Commander Yue Zhongqi, commanding the Yongning Brigade, was made commander of Sichuan.',
    'Yue Zhongqi became Sichuan commander.',
  ],
  s1055: [
    'On day yihai, the native prefecture of Siming was transferred to Taiping prefecture in Guangxi.',
    'Siming native prefecture was placed under Guangxi\'s Taiping prefecture.',
  ],
  s1056: [
    'On day wuyin, an edict halted this year\'s advance of troops.',
    'An edict halted campaigning for the year.',
  ],
  s1057: [
    'Chang Shou was made an extra vice minister of the Court of Colonial Affairs to handle affairs at Xining.',
    'Chang Shou became extra Lifan Yuan vice minister at Xining.',
  ],
  s1058: [
    'On day yiyou, Nian Gengyao was made governor-general of Sichuan and Shaanxi and was granted a bow and arrows.',
    'Nian Gengyao became Sichuan-Shaanxi governor-general and received bow and arrows.',
  ],
  s1059: [
    'Five hundred thousand taels from the treasury were issued to relieve Shanxi and Shaanxi; Zhu Shi and Lu Xun were ordered to supervise the matter.',
    'Five hundred thousand taels were issued for Shanxi-Shaanxi relief under Zhu Shi and Lu Xun.',
  ],
  s1060: [
    'Sixth month, day renchen: Gao Qiwei was made commander of Jiangnan, and Wei Jingguo commander of Huguang.',
    'In the sixth month, Gao Qiwei became Jiangnan commander and Wei Jingguo Huguang commander.',
  ],
  s1061: [
    'On day bingshen, an edict said: "Pacification General Yensin is Our nephew.',
    'An edict praised Yensin as the Emperor\'s nephew.',
  ],
  s1062: [
    'Leading troops through miasma lands never reached by armies of old, he destroyed a great foe and pacified Tibet—truly he has not disgraced the imperial clan; he may be enfeoffed as Fuguo Duke."',
    'For pacifying Tibet through deadly frontier country, Yensin was enfeoffed Fuguo Duke."',
  ],
  s1063: [
    '" On day yimao, Turfan Muslims including Toktuomuk came to submit; an order was issued for the rank minister Arna to lead troops to escort them.',
    'Turfan Muslims submitted and Arna was sent with troops to escort them.',
  ],
  s1064: [
    'Fujian naval commander Shi Shilang pacified Taiwan, captured Zhu Yigui, and sent him to the capital under guard.',
    'Shi Shilang pacified Taiwan and sent Zhu Yigui to Beijing as a prisoner.',
  ],
  s1065: [
    'An edict praised Defender Chen Ce of the Freshwater garrison for holding firm and promoted him to Taiwan commander.',
    'Chen Ce was promoted to Taiwan commander for his defense of Freshwater.',
  ],
  s1066: [
    'Intercalary sixth month, first day gengshen: there was a solar eclipse.',
    'On the first day of the intercalary sixth month, a solar eclipse occurred.',
  ],
  s1067: [
    'On day bingyin, the Ministry of Punishments was ordered to relax punishment for light offenses; on day wuchen, Garbi was made Mongol commander-in-chief.',
    'Light prisoners were released and Garbi became Mongol commander-in-chief.',
  ],
  s1068: [
    'Autumn, seventh month, day jiyou: the Emperor went on the hunting encampment.',
    'In the seventh month, the Emperor went on the autumn hunt.',
  ],
  s1069: [
    'Eighth month, day jiaxu: Vice Commander Zhuang Tu was ordered to lead two thousand troops to advance and garrison Turfan and reinforce Arna\'s army.',
    'Zhuang Tu was sent with two thousand men to Turfan to reinforce Arna.',
  ],
  s1070: [
    'On day bingxu, the Yellow River broke through at Wuyang and entered the Qin River.',
    'On bingxu day, the Yellow River broke at Wuyang into the Qin River.',
  ],
  s1071: [
    'Ninth month, day xinmao: Vice Commander Mukedeng was ordered to lead two thousand troops to Turfan.',
    'Mukedeng was sent with two thousand troops to Turfan.',
  ],
  s1072: [
    'On day jiawu, Garbi was dismissed because of illness; Prince Gongsewang Norbu was ordered to act as Pacification General of the West and garrison Tibet, with Abao and Wuge to assist in military affairs.',
    'Garbi retired ill; Gongsewang Norbu acted as western commander in Tibet with Abao and Wuge assisting.',
  ],
  s1073: [
    'On day bingshen, Tsewang Arabtan attacked Turfan; Arna attacked and drove him off.',
    'Tsewang Arabtan raided Turfan and was repulsed by Arna.',
  ],
  s1074: [
    'On day bingwu, flood disasters in Henan, Shandong, and Zhili were relieved.',
    'Flood relief was granted in Henan, Shandong, and Zhili.',
  ],
  s1075: [
    'On day yimao, the Emperor returned to the capital.',
    'On yimao day, the Emperor returned to Beijing.',
  ],
  s1076: [
    'On day bingchen, Vice Censor-in-chief Niu Niu, Lecturer Qi Sule, and Clerk Ma Tai were ordered to build the Yellow River breach and channel the Qin River into the Grand Canal.',
    'Niu Niu, Qi Sule, and Ma Tai were ordered to repair the breach and send the Qin into the Grand Canal.',
  ],
  s1077: [
    'On day dingsi, Arna was made assistant general.',
    'Arna became assistant general.',
  ],
  s1078: [
    'The Emperor composed the stele inscription on the pacification of Tibet.',
    'The Emperor wrote the Pacification of Tibet stele inscription.',
  ],
  s1079: [
    'Winter, tenth month, day renxu: an inspector censor for Taiwan was established.',
    'In the tenth month, a Taiwan inspection censor was appointed.',
  ],
  s1080: [
    'An edict said: "This year\'s autumn review cases have all been examined in detail; as for the provincial cases submitted for delayed execution, the Nine Ministers have already added their approval—we cannot bear to review them again, lest careful re-examination lead to heavier sentences.',
    'An edict said autumn review cases were complete and the Emperor would not re-read delayed cases lest sentences grow harsher.',
  ],
  s1081: [
    '" On day bingyin, Pacification General Yinti was summoned to the capital.',
    'Yinti was summoned to Beijing.',
  ],
  s1082: [
    'On day xinwei, an edict said: "Grand Secretary Xiong Cilü served in office with upright conduct and broad learning; We have long not forgotten him and often ordered his household aided.',
    'An edict praised the late Xiong Cilü and ordered care for his family.',
  ],
  s1083: [
    'Now his two sons have come to the capital; observing their temperament, they can still study and should be given further cultivation; this may be transmitted to the Nine Ministers."',
    'His two sons were to be educated, as the Nine Ministers were told."',
  ],
  s1084: [
    '" Zhong Shichen was made commander of Zhejiang, Yao Tang commander of the Fujian naval forces, and Feng Yi acting commander of Guangdong.',
    'Zhong Shichen, Yao Tang, and Feng Yi received military appointments.',
  ],
  s1085: [
    'Eleventh month, day xinmao: Chen Pengnian was made acting director-general of river conservancy.',
    'Chen Pengnian became acting river conservancy director-general.',
  ],
  s1086: [
    'On day wuxu, Ma Wu and Irkadai were made Mongol commanders-in-chief.',
    'Ma Wu and Irkadai became Mongol commanders-in-chief.',
  ],
  s1087: [
    'On day jiyou, the Emperor visited the Southern Park.',
    'On jiyou day, the Emperor visited the Southern Park.',
  ],
  s1088: [
    'An edict granted posthumous favors to General Erlunte, Guard Seleng, Vice Commander Cha Lihun, Commander Kang Tai, and others who died fighting the enemy.',
    'Officers who died in battle, including Erlunte and Kang Tai, received posthumous honors.',
  ],
  s1089: [
    'Twelfth month, day renshen: Sichuan Commander Yue Zhongqi campaigned against the Golok tribesmen and pacified them.',
    'Yue Zhongqi campaigned against the Golok and pacified them.',
  ],
  s1090: [
    'On day dingchou, the Emperor returned and halted at Changchun Garden.',
    'On dingchou day, the Emperor returned to Changchun Garden.',
  ],
  s1091: [
    'E Hai and Yongtai were sent to inspect military colonies at Turfan.',
    'E Hai and Yongtai were sent to inspect Turfan garrison farms.',
  ],
  s1092: [
    'This year, disaster land tax for one hundred twenty-three prefectures and districts in Jiangnan, Henan, Shaanxi, Gansu, Fujian, Zhejiang, Huguang, and other provinces was remitted in varying degrees; Korea, Ryukyu, and Annam sent tribute.',
    'Tax relief was granted for 123 disaster districts; Korea, Ryukyu, and Annam paid tribute.',
  ],
  s1093: [
    'Registered households numbered 29,148,359; additional persons registered after the perpetual no-increase policy numbered 467,850; tax silver collected was 28,790,000-odd taels.',
    'Registered households stood at 29.1 million, with 467,850 additional persons and 28.79 million taels in tax silver.',
  ],
  s1094: [
    'Salt tax silver was 3,772,363 taels and a fraction.',
    'Salt tax revenue was 3.77 million taels.',
  ],
  s1095: [
    'Coinage cast amounted to 437,327,580-odd strings.',
    'Coinage totaled over 437 million strings.',
  ],
  s1096: [
    'Sixty-first year, spring, first month, day wuzi: the Emperor summoned six hundred eighty civil and military officials of the Eight Banners aged sixty-five and above; those already retired were all included in the imperial feast, and ranks were granted to clansmen who urged drinking.',
    'In the sixty-first year, the Emperor feasted 680 Banner officials aged sixty-five and above, retired men included.',
  ],
  s1097: [
    'Three days later, three hundred forty Han officials aged sixty-five and above were feasted in the same way.',
    'Three days later, 340 Han officials of the same age were feasted likewise.',
  ],
  s1098: [
    'The Emperor composed a poem, and the ministers responded in rhyme; the title was "Poem of the Thousand Elder Banquet."',
    'The Emperor and ministers exchanged poems titled "Thousand Elder Banquet."',
  ],
  s1099: [
    'On day wushen, the Emperor toured the capital region.',
    'On wushen day, the Emperor toured the capital region.',
  ],
  s1100: [
    'Second month, day gengwu: Gao Qizhuo was made acting governor-general of Yunnan and Guizhou.',
    'In the second month, Gao Qizhuo became acting Yunnan-Guizhou governor-general.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b11.mjs <translation.json>'
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
