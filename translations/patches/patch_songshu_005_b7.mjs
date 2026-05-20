#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'Without wearying our axes, they have already submitted to Heaven\u2019s punishment; sons and grandsons slaughter one another, kin and factions split apart; the false commanders of Guan and Luo all harbor intent to submit inwardly, and the remnant people north of the River pour forth loyalty and ask to serve.',
    'We need not even swing the axe: they have already met Heaven\u2019s judgment; their heirs turn on one another and their kin divide; the puppet warlords of Guan and Luo all wish to come over, and refugees north of the River offer their loyalty and beg to fight for us.',
  ],
  s0602: [
    'To rescue the drowning and sweep away the filth—now is the occasion.',
    'To save the perishing and cleanse the realm—this is the hour.',
  ],
  s0603: [
    'Order may be sent to the General of Agile Cavalry and Minister of Works offices, each dividing what they command, to connect east and west.',
    'Issue orders to the Agile Cavalry and Minister of Works staffs, each to deploy its commands and coordinate east and west.',
  ],
  s0604: [
    'Those who submit in allegiance and establish merit are to be rewarded according to labor.',
    'Defectors who prove their worth shall be rewarded in proportion to their service.',
  ],
  s0605: [
    '" That month the capital had rain flooding.',
    '" That month flooding rains struck the capital.',
  ],
  s0606: [
    'In the sixth month, on jiyou, ministry officials were dispatched on tour, firewood and grain were granted, and boats were supplied.',
    'Sixth month, jiyou: touring officials were sent out, fuel and grain distributed, and boats provided.',
  ],
  s0607: [
    'Pacifying Army General Xiao Sihua led the host on a northern campaign.',
    'Pacifying-army general Xiao Sihua marched north at the head of his army.',
  ],
  s0608: [
    'Campaigning-North staff officer Liu Yu was made Yi Province Inspector.',
    'Liu Yu, staff officer to the campaigning-north general, was appointed inspector of Yi.',
  ],
  s0609: [
    'In the seventh month of autumn, on renchen, Prince of Ruyin Hun was enfeoffed as Prince of Wuchang, and Prince of Huaiyang Yu as Prince of Xiangdong.',
    'Autumn, seventh month, renchen: Prince of Ruyin Hun became Prince of Wuchang; Prince of Huaiyang Yu became Prince of Xiangdong.',
  ],
  s0610: [
    'On dingyou, the offices of Grand Minister of Agriculture, Steward of the Heir Apparent, and Supervisor of the Court of Justice were abolished.',
    'Dingyou: the grand minister of agriculture, heir-apparent steward, and court-of-justice supervisor posts were cut.',
  ],
  s0611: [
    'In the eighth month, on dingmao, Xiao Sihua attacked Qiaoyao but could not take it and withdrew.',
    'Eighth month, dingmao: Xiao Sihua assaulted Qiaoyao, failed to capture it, and retreated.',
  ],
  s0612: [
    'In the ninth month, on dinghai, Pacifying-West General Tuyuhun Shibin was made Anxi General and Inspector of Qin and He provinces.',
    'Ninth month, dinghai: Tuyuhun Shibin, pacifying-west general, was made Anxi general and inspector of Qin and He.',
  ],
  s0613: [
    'On jichou, Pacifying Army General and Inspector of Xu and Yan provinces Xiao Sihua was additionally made Inspector of Ji; Yanzhou remained as before.',
    'Jichou: pacifying-army general and Xu-Yan inspector Xiao Sihua also received Ji; his Yanzhou post was unchanged.',
  ],
  s0614: [
    'In the tenth month of winter, on guihai, Inspector of Si Province Lu Shuang attacked Hulao but could not take it and withdrew.',
    'Winter, tenth month, guihai: Si inspector Lu Shuang besieged Hulao, failed, and withdrew.',
  ],
  s0615: [
    'In the eleventh month, on renyin, Prince of Luling Shao, Yangzhou Inspector, died.',
    'Eleventh month, renyin: Prince of Luling Shao, inspector of Yang, died.',
  ],
  s0616: [
    'In the twelfth month, on xinwei, General of Agile Cavalry and Southern Yanzhou Inspector Prince of Jiangxia Yigong was made Grand General and Southern Xuzhou Inspector, retaining his post supervising the Masters of Writing.',
    'Twelfth month, xinwei: agile-cavalry general and Southern Yanzhou inspector Prince of Jiangxia Yigong became grand general and Southern Xuzhou inspector, still supervising the Masters of Writing.',
  ],
  s0617: [
    'In the first month of spring of year 30, on wuyin, Minister of Works and Jing Province Inspector Prince of Nanqiao Yixuan was made Grand Secretary, Central Army Commander, and Yangzhou Inspector.',
    'Year 30, first spring month, wuyin: minister of works and Jing inspector Prince of Nanqiao Yixuan became grand secretary, central army commander, and Yangzhou inspector.',
  ],
  s0618: [
    'Southern Yanzhou was merged into Southern Xuzhou.',
    'Southern Yan was absorbed into Southern Xu.',
  ],
  s0619: [
    'On gengchen, Colonel of the Guards Liu Zunkao was made Pacifying-West General and Yu Province Inspector.',
    'Gengchen: guards colonel Liu Zunkao was made pacifying-west general and Yu inspector.',
  ],
  s0620: [
    'On renwu, Campaigning-North General and Southern Xuzhou Inspector Prince of Shixing Jun was made Guard General and Jing Province Inspector.',
    'Renwu: campaigning-north general and Southern Xu inspector Prince of Shixing Jun became guard general and Jing inspector.',
  ],
  s0621: [
    'On wuzi, Prince of Wuling Jun commanded the mass of armies to attack the Xiyang barbarians.',
    'Wuzi: Prince of Wuling Jun led the combined armies against the Xiyang tribes.',
  ],
  s0622: [
    'On guisi, Yu Province Inspector Prince of Nanping Shuo was made Pacifying Army General and Colonel of the Guards.',
    'Guisi: Yu inspector Prince of Nanping Shuo became pacifying-army general and guards colonel.',
  ],
  s0623: [
    'Qing and Xu provinces suffered famine; in the second month, on renzi, the Transport Office was dispatched to grant relief.',
    'Famine in Qing and Xu: second month, renzi, the transport office was sent to relieve distress.',
  ],
  s0624: [
    'On jiazi, the Emperor died at Hanzhang Hall.',
    'Jiazi: the emperor died in Hanzhang Hall.',
  ],
  s0625: [
    'He was forty-seven years of age.',
    'He was forty-seven.',
  ],
  s0626: [
    'His posthumous name was Emperor Jing; his temple name was Zhongzong.',
    'Posthumous title Emperor Jing; temple name Zhongzong.',
  ],
  s0627: [
    'In the third month, on guisi, he was buried at Changning Mausoleum.',
    'Third month, guisi: interment at Changning Mausoleum.',
  ],
  s0628: [
    'When Shizu took the throne, he retroactively changed the posthumous name and temple name.',
    'Once Shizu acceded, he revised the posthumous and temple designations.',
  ],
  s0629: [
    'The historian says: In his youth the Founding Emperor was exceptionally gifted; though he lacked the strictness of tutors and protectors, Heaven bestowed a harmonious, keen nature, and he was himself endowed with the virtue of a ruler of men.',
    'The historian writes: The Founding Emperor showed rare promise as a boy; without rigid tutoring he still possessed Heaven-given harmony and quickness—the makings of a true sovereign.',
  ],
  s0630: [
    'Once he faced south and held the throne, his years were long; the net of governance was fully spread, statutes and prohibitions clear and close, punishments had fixed measures, and ranks had no indiscriminate grades.',
    'Once enthroned he ruled many years: institutions were complete, law meticulous, penalties standardized, and ennoblement never careless.',
  ],
  s0631: [
    'Thus within was purity and without was peace; the four seas were tranquil.',
    'Hence the realm was ordered within and calm without—all under Heaven was still.',
  ],
  s0632: [
    'Formerly the Eastern Han of the Han house often spoke of the precedents of Jianwu and Yongping; from that time onward people also regularly cited the Yuanjia era—truly it was a flourishing age.',
    'Han scholars praised Jianwu and Yongping; later ages likewise held up Yuanjia as a golden age—and rightly so.',
  ],
  s0633: [
    'In appointing generals and dispatching commanders he went against the custom of dividing frontier authority; his talent fell short of Emperor Guangwu\u2019s, yet he controlled strategy from afar—when it came to the day of battle, none failed to look up and await the completed decree.',
    'He named generals yet withheld their command: no Guangwu in talent, but he micromanaged every campaign—on the day of battle his officers waited only for edicts from the throne.',
  ],
  s0634: [
    'Though armies were shattered and hosts lost, and his generals were no Han Xin or Bai Qi, yet that the enemy lingered and the borderlands suffered—this too had its cause here.',
    'Defeats piled up and his commanders were no match for Han Xin or Bai Qi; still, that the foe prolonged the war and ravaged the marches owed much to this habit.',
  ],
  s0635: [
    'When at last words leaked from the bedchamber and trouble bound itself to a peddler, though calamity arose unlooked-for, there was reason for it to be so.',
    'When whispers escaped the royal bed and a merchant\u2019s grudge entangled the court, disaster seemed sudden—yet the seeds had long been sown.',
  ],
  s0636: [
    'Alas, how lamentable!',
    'Alas—how pitiable!',
  ],
  s0637: [
    'Collation notes',
    'Textual collation notes',
  ],
  s0638: [
    'When the imperial carriage reached the capital city. Sun Ao\u2019s Studies on the Song History says: "It should read the capital metropolis."',
    'Imperial arrival at Jingcheng. Sun Ao\u2019s Song History Studies: "Read Jingyi (metropolis), not Jingcheng."',
  ],
  s0639: [
    'The capital city would be Jingkou.',
    'Jingcheng here means Jingkou (modern Zhenjiang).',
  ],
  s0640: [
    '" According to the Comprehensive Mirror it reads Jiankang.',
    '" Zizhi Tongjian has Jiankang.',
  ],
  s0641: [
    'In the Song History "capital city" often means Jingkou city; here it means Jiankang.',
    'Song Shu usually uses Jingcheng for Jingkou; this passage means Jiankang (Nanjing).',
  ],
  s0642: [
    'On xinwei the imperial carriage sacrificed at the southern suburb. All editions alike omit the two characters "xinwei"; supplemented according to the History of the Southern Dynasties, Jiankang shilu, and the Comprehensive Mirror.',
    'Xinwei, imperial southern-suburb sacrifice: every edition drops xinwei; restored from Nanshi, Jiankang shilu, and Tongjian.',
  ],
  s0643: [
    'Administrator of Jian\u2019an Pan Sheng, guilty of crimes, was executed. "Pan Sheng" in all editions reads "Pan Cheng"; changed according to the Annals of the Deposed Emperor and the biography of Xu Xianzhi.',
    'Jian\u2019an administrator Pan Sheng executed for crime. All texts read Pan Cheng; corrected per the deposed emperor\u2019s annals and Xu Xianzhi\u2019s biography.',
  ],
  s0644: [
    'Yimao. All editions read jimao; changed according to the Bureau edition and the History of the Southern Dynasties.',
    'Yimao: every edition has jimao; emended per the Bureau text and Nanshi.',
  ],
  s0645: [
    'According to the calendar, that month\u2019s new moon was on dingyou; the nineteenth day was yimao—there was no jimao.',
    'That month\u2019s new moon was dingyou; day 19 was yimao, so jimao is impossible.',
  ],
  s0646: [
    'Concurrent Pacifying-North General and Southern Xuzhou Inspector. All editions omit the character "South"; according to the biography of Prince of Pengcheng Yikang, Jiankang shilu, and the Comprehensive Mirror all read Southern Xuzhou Inspector—now supplemented.',
    'Pacifying-north general and Southern Xu inspector: all editions drop Nan (south); Pengcheng prince\u2019s biography, Jiankang shilu, and Tongjian agree—Nan restored.',
  ],
  s0647: [
    'Former Campaigning-North staff officer Yin Chong was made Si Province Inspector. All editions omit the character "Yin"; according to the biography of the northern enemy, at the time Yin Chong was Si Province Inspector—the Comprehensive Mirror agrees.',
    'Yin Chong, former campaigning-north staff officer, made Si inspector: Yin is missing in all editions; the Rouran biography and Tongjian confirm him in office.',
  ],
  s0648: [
    'Now supplemented.',
    'Restored accordingly.',
  ],
  s0649: [
    'Campaigning-South Grand General Tan Daoji defeated the northern enemy at Dongping Shouzhang. All editions omit the character "ping."',
    'Tan Daoji, campaigning-south grand general, routed the northerners at Dongping Shouzhang: every edition omits ping in Dongping.',
  ],
  s0650: [
    'Supplemented according to the biography of Tan Daoji.',
    'Added from Tan Daoji\u2019s biography.',
  ],
  s0651: [
    'Hong Yixuan\u2019s Various Histories Textual Studies says: "According to the biography of Tan Daoji it reads Dongping Shouzhang; below ‘Dong\u2019 the character ‘ping\u2019 is omitted."',
    'Hong Yixuan, Various Histories: "Tan Daoji\u2019s biography has Dongping Shouzhang—ping is missing after Dong."',
  ],
  s0652: [
    'If one does not deeply preserve the root task. All editions omit the character "if"; supplemented according to Yuan gui 198.',
    '"If one does not deeply preserve the root task": gou (if) is absent in all editions; supplied from Yuan gui 198.',
  ],
  s0653: [
    'Murong Yan of Tuyuhun was made Pacifying-East General. "Murong Yan" in this book\u2019s Tuyuhun biography reads "Mu Yan."',
    'Tuyuhun Murong Yan made pacifying-east general: the Tuyuhun biography in this book reads Mu Yan.',
  ],
  s0654: [
    'The Wei History reads "Muli Yan."',
    'Wei Shu: Muli Yan.',
  ],
  s0655: [
    'Tuyuhun Hui Fa was made Pacifying Army General. All editions omit the character "gu" in Tuyuhun; supplemented according to the pattern of the preceding and following text.',
    'Tuyuhun Hui Fa made pacifying-army general: Gu in Tuyuhun is dropped in all editions; restored by context.',
  ],
  s0656: [
    '"Hui Fa" in the Wei History reads "Weidai."',
    'Wei Shu: Weidai for Huifa.',
  ],
  s0657: [
    'On renshen the King of Henan and the King of Hexi sent envoys presenting tribute goods. "King of Hexi" in all editions reads "King of Xihe"; changed according to the Annals of the Deposed Emperor, year 1 of Jingping, and the biography of Juqu Mengxun.',
    'Renshen: Henan and Hexi kings sent tribute missions. Xihe in all texts should be Hexi; corrected per the deposed emperor\u2019s annals (Jingping 1) and Juqu Mengxun\u2019s biography.',
  ],
  s0658: [
    'Outlaw Ma Daxuan and a band of several hundred men raided Taishan. The Sanchao edition reads "Taishan"; the Hongzhi, Northern Directorate, Mao, Hall, and Bureau editions read "Qin and Liang."',
    'Rebel Ma Daxuan, several hundred strong, raided Taishan. Sanchao has Taishan; Hongzhi, Beijian, Mao, Dian, and Bureau texts read Qinliang.',
  ],
  s0659: [
    'Fourth month of summer, yiyou. According to the calendar, that month\u2019s new moon was on dinghai—there was no yiyou.',
    'Summer, fourth month, yiyou: that month\u2019s new moon was dinghai, so yiyou cannot stand.',
  ],
  s0660: [
    'The twenty-third day was jiyou; "yiyou" may be a corruption of "jiyou."',
    'Day 23 was jiyou; yiyou is likely a scribal error for jiyou.',
  ],
  s0661: [
    'Seventh month of autumn, xinyou. "Xinyou" in all editions reads "yiyou"; changed according to the History of the Southern Dynasties.',
    'Autumn, seventh month, xinyou: every edition has yiyou; corrected per Nanshi.',
  ],
  s0662: [
    'According to the calendar, that month\u2019s new moon was on gengxu; the sixth day was xinyou—there was no "yiyou."',
    'New moon gengxu; day 6 xinyou—yiyou is impossible.',
  ],
  s0663: [
    'In Yi Province were established the three commanderies of Southern Jinshou, Southern Xinba, and Northern Baxi. All editions read "In Yi Province were established the three commanderies of Southern Jinshou, Xinba, and Baxi."',
    'Yi Province gained three commanderies—Southern Jinshou, Southern Xinba, Northern Baxi. All editions collapse them to Southern Jinshou, Xinba, and Baxi.',
  ],
  s0664: [
    'Sun Ao\u2019s Studies on the Song History says: "According to the Treatise on Provinces and Commanderies, these are the three commanderies of Southern Jinshou, Southern Xinba, and Northern Baxi."',
    'Sun Ao\u2019s Song Studies: the Provincial Gazetteer lists Southern Jinshou, Southern Xinba, and Northern Baxi.',
  ],
  s0665: [
    '" According to Sun, this is correct; now emended.',
    '" Sun is right; text emended.',
  ],
  s0666: [
    'Moreover, in this entry above it says "renshen" and below "yihai."',
    'This note also has renshen above and yihai below.',
  ],
  s0667: [
    'According to the calendar, that month\u2019s new moon was on bingxu; there was no renshen, and no yihai.',
    'That month\u2019s new moon was bingxu; neither renshen nor yihai occurs.',
  ],
  s0668: [
    'Footsoldier Colonel Liu Zhendao was made Inspector of Liang and Southern Qin provinces. "Liu Zhendao" in all editions reads "Liu Daozhen."',
    'Footsoldier colonel Liu Zhendao made Liang and Southern Qin inspector: all editions read Liu Daozhen.',
  ],
  s0669: [
    'Zhang Senkai\u2019s collation note says: "It should read Liu Zhendao; see the biography of Liu Huaisu; in year 18 below it also reads Liu Zhendao."',
    'Zhang Senkai: read Liu Zhendao (Liu Huaisu biography; year-18 entry agrees).',
  ],
  s0670: [
    '" According to Zhang, this is correct; now corrected.',
    '" Zhang is correct; emended.',
  ],
  s0671: [
    'The King of Henan, the King of Hexi, Heluodan nation, and Poluo Huang nation all sent envoys presenting tribute goods. "King of Hexi" in all editions reads "King of Xihe"; changed according to the Annals of the Deposed Emperor and the biography of Juqu Mengxun.',
    'Henan king, Hexi king, Heluodan, and Poluo Huang sent tribute. Xihe for Hexi in all texts—corrected per deposed-emperor annals and Juqu Mengxun.',
  ],
  s0672: [
    'Prince of Yan Hong sent envoys presenting tribute goods. "Hong" in all editions reads "nian"; changed according to the Jin History annals.',
    'Yan prince Hong sent tribute: nian in all editions should be Hong, per Jin Shu annals.',
  ],
  s0673: [
    'Where this year there are places without harvest. "Year" in all editions reads "half"; changed according to Yuan gui 489.',
    '"Where this year there are places without harvest": nian (year) appears as ban (half) in all editions; fixed per Yuan gui 489.',
  ],
  s0674: [
    'Director of the Masters of Writing Wang Qiu was made Vice Director of the Masters of Writing. "Wang Qiu" in all editions reads "Wang Lin"; changed according to the History of the Southern Dynasties and the Comprehensive Mirror.',
    'Wang Qiu, director of the Masters of Writing, made vice director: Wang Lin in all texts—corrected per Nanshi and Tongjian.',
  ],
  s0675: [
    'Hong Yixuan\u2019s Various Histories Textual Studies says: "Wang Qiu written as Wang Lin is a corruption in transmission."',
    'Hong Yixuan: Wang Qiu miswritten Wang Lin is a copyist\u2019s error.',
  ],
  s0676: [
    'Fifth month of summer, renwu. "Renwu" in all editions reads "renshen."',
    'Summer, fifth month, renwu: all editions have renshen.',
  ],
  s0677: [
    'The Bureau edition reads "renwu."',
    'Bureau text: renwu.',
  ],
  s0678: [
    'According to the calendar, that month\u2019s new moon was on renwu; there was no renshen.',
    'That month\u2019s new moon was renwu; renshen is impossible.',
  ],
  s0679: [
    'Now following the Bureau edition.',
    'Adopted from the Bureau edition.',
  ],
  s0680: [
    'Vice Director of the Masters of Writing Wang Qiu died. "Qiu" in all editions reads "Lin"; changed according to the History of the Southern Dynasties and the Comprehensive Mirror.',
    'Vice director Wang Qiu died: Lin in all texts should be Qiu, per Nanshi and Tongjian.',
  ],
  s0681: [
    'That month. All editions read "twelfth month."',
    '"That month": every edition says twelfth month.',
  ],
  s0682: [
    'According to the text above, there were already the tenth, eleventh, and twelfth months; the twelfth month should not appear again.',
    'Tenth, eleventh, and twelfth months already appear above—a second twelfth month is wrong.',
  ],
  s0683: [
    'Now changed to read "that month."',
    'Changed to "that month."',
  ],
  s0684: [
    'Flourishing age, sagely world. "Sagely" in all editions reads "ancestral"; changed according to Yuan gui 194.',
    '"Flourishing age, sagely world": sheng (sagely) is zu (ancestral) in all editions; emended per Yuan gui 194.',
  ],
  s0685: [
    'For the first time performing the yue sacrifice. "Yue" in all editions reads "initial"; changed according to Yuan gui 207.',
    '"For the first time performing the yue sacrifice": yue is chu (initial) in all editions; fixed per Yuan gui 207.',
  ],
  s0686: [
    'Gengshen. All editions agree.',
    'Gengshen: all editions agree.',
  ],
  s0687: [
    'According to the calendar, that month\u2019s new moon was on renshen; the third day was jiaxu—there was no gengshen in that month.',
    'New moon renshen; day 3 jiaxu—no gengshen that month.',
  ],
  s0688: [
    'Below there is jiashen, which is the thirteenth day.',
    'Jiashen below is day 13.',
  ],
  s0689: [
    'Between jiaxu and jiashen there is gengchen.',
    'Between jiaxu and jiashen stands gengchen.',
  ],
  s0690: [
    'Gengshen is suspected to be a corruption of gengchen.',
    'Gengshen is probably a mistake for gengchen.',
  ],
  s0691: [
    'Southern Xu, Southern Yu, and the region west of the Zhe River in Yang Province. All editions agree.',
    'Southern Xu, Southern Yu, and Yang west of the Zhe: all editions agree.',
  ],
  s0692: [
    'The History of the Southern Dynasties below "Southern Xu" has the two characters "Southern Yan."',
    'Nanshi inserts Southern Yan after Southern Xu.',
  ],
  s0693: [
    'Southern Yu Province Inspector Prince of Wuling Jun was additionally made Pacifying Army General. "Jun" in all editions reads "Zan"; the Sanchao edition reads "taboo."',
    'Southern Yu inspector Prince of Wuling Jun made pacifying-army general: Jun is Zan in all texts, taboo in Sanchao.',
  ],
  s0694: [
    'According to the time, Prince of Wuling Jun was the later Emperor Xiaowu.',
    'At this date Prince of Wuling Jun is the future Emperor Xiaowu.',
  ],
  s0695: [
    'Zan was the ninth son of Emperor Ming of Song; he was later also enfeoffed as Prince of Wuling, but at the time he had not yet been born.',
    'Zan is Emperor Ming\u2019s ninth son, later Prince of Wuling too—but not yet born here.',
  ],
  s0696: [
    'Now changed to read "Jun."',
    'Corrected to Jun.',
  ],
  s0697: [
    'Campaigning-North General, Southern Xuzhou Inspector, and Prince of Nanqiao Yixuan was made Chariots-and-Cavalry General and Jing Province Inspector. "Southern Xuzhou Inspector" in all editions omits the character "South"; supplemented according to the biography of Yixuan.',
    'Campaigning-north general, Southern Xu inspector Prince of Nanqiao Yixuan became chariots-and-cavalry general and Jing inspector: Nan (south) is missing before Southern Xu; restored from Yixuan\u2019s biography.',
  ],
  s0698: [
    'Ninth month, jiwei. "Jiwei" in all editions reads "yimao"; the Bureau edition reads "jiwei."',
    'Ninth month jiwei: yimao in all texts, jiwei in the Bureau edition.',
  ],
  s0699: [
    'According to the calendar, that month\u2019s new moon was on dingsi; the third day was jiwei—there was no yimao.',
    'New moon dingsi; day 3 jiwei—yimao cannot occur.',
  ],
  s0700: [
    'Now following the Bureau edition.',
    'Adopted from the Bureau edition.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_songshu_005_b7.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
