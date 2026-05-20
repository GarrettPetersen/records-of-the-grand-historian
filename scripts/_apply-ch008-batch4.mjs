#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.008, Xuanzong — Kaiyuan 8 through 11) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0301: {
    literal: 'On jimao Palace Attendant Song Jing was made Pillar of State; Vice Director of the Secretariat Suo Ting was made Minister of Rites; both ceased to manage government.',
    idiomatic: 'On jimao Song Jing became pillar of state and Suo Ting minister of rites; both left the council.',
  },
  s0302: {
    literal: 'Jingzhao Intendant Yuan Qianyao became Vice Director of the Yellow Gate; Grand Protector of Bingzhou Zhang Jiazhen became Vice Director of the Secretariat; both became co-equal Zhongshu Menxia Chief Ministers.',
    idiomatic: 'Yuan Qianyao entered the council as yellow gate vice director; Zhang Jiazhen as secretariat vice director—both co-equal chief ministers.',
  },
  s0303: {
    literal: 'Second month, dingyou: Prince Min died and was posthumously enfeoffed Prince of Huai with the posthumous title Lamentable.',
    idiomatic: 'On dingyou of the second month Prince Min died and was posthumously created Prince of Huai, posthumous name Lamentable.',
  },
  s0304: {
    literal: 'Summer, fifth month, dingmao: Yuan Qianyao became Palace Attendant; Zhang Jiazhen became Director of the Secretariat.',
    idiomatic: 'On dingmao of the fifth summer month Yuan Qianyao became palace attendant and Zhang Jiazhen secretariat director.',
  },
  s0305: {
    literal: 'Southern Tianzhu sent envoys presenting a five-colored parrot.',
    idiomatic: 'Southern Tianzhu sent envoys with a five-colored parrot.',
  },
  s0306: {
    literal: 'Sixth month, renyin night: the eastern capital suffered torrential rain and the Gu River flooded.',
    idiomatic: 'On the night of renyin in the sixth month a cloudburst at Luoyang sent the Gu River over its banks.',
  },
  s0307: {
    literal: 'In Xin\'an, Mianchi, Henan, Shou\'an, Gong County, and elsewhere houses were swept away—nine hundred sixty-one households in all; eight hundred fifteen people drowned.',
    idiomatic: 'Xin\'an, Mianchi, Henan, Shou\'an, and Gong lost nine hundred sixty-one households and eight hundred fifteen dead.',
  },
  s0308: {
    literal: 'In Xu and Wei prefectures, idle frontier guards who drowned numbered one thousand one hundred forty-eight.',
    idiomatic: 'In Xu and Wei, eleven hundred forty-eight idle frontier guards drowned.',
  },
  s0309: {
    literal: 'Autumn, ninth month: the Turk yabghu raided Gan and Liang prefectures; Liangzhou Protector Yang Jingshu was defeated and the Qibi tribes were carried off as he withdrew.',
    idiomatic: 'In the ninth month the Turk yabghu raided Gan and Liang; Yang Jingshu, protector of Liang, was beaten and the Qibi were carried off.',
  },
  s0310: {
    literal: 'Censor-in-Chief Wang Jun was made Minister of War and concurrent Youzhou Protector; Vice Director of the Yellow Gate Wei Kang was made Censor-in-Chief and Protector-General of Shuofang to defend against them.',
    idiomatic: 'Wang Jun became minister of war and Youzhou protector; Wei Kang, censor-in-chief and Shuofang protector-general, was sent to meet the threat.',
  },
  s0311: {
    literal: 'On jiazi Junior Tutor and concurrent Qi prefect Prince of Qi Fan was made Heir Apparent Grand Tutor; Junior Guardian and concurrent Guo prefect Prince of Xue Ye was made Heir Apparent Grand Guardian; the rest remained as before.',
    idiomatic: 'On jiazi Princes Fan and Ye became grand tutor and grand guardian of the heir apparent; other posts stood unchanged.',
  },
  s0312: {
    literal: 'Winter, tenth month, xinsi: visited Everlasting Spring Palace.',
    idiomatic: 'On xinsi of the tenth winter month he went to Everlasting Spring Palace.',
  },
  s0313: {
    literal: 'On renwu, hunted at Xia Gui.',
    idiomatic: 'On renwu he went hunting at Xia Gui.',
  },
  s0314: {
    literal: 'Eleventh month, yichou: returned from Everlasting Spring Palace.',
    idiomatic: 'On yichou of the eleventh month he returned from Everlasting Spring Palace.',
  },
  s0315: {
    literal: 'On xinwei Turks raided Liangzhou, killed people, and drove off tens of thousands of sheep and horses.',
    idiomatic: 'On xinwei Turks raided Liangzhou, slaughtered the people, and drove off tens of thousands of sheep and horses.',
  },
  s0316: {
    literal: 'Ninth year of Kaiyuan, spring, first month, bingchen: Pu Prefecture was made Hezhong Superior Prefecture and the Central Capital established.',
    idiomatic: 'On bingchen of Kaiyuan 9 Pu Prefecture became Hezhong superior prefecture with status as central capital.',
  },
  s0317: {
    literal: 'On bingyin, visited the hot springs at Xinfeng.',
    idiomatic: 'On bingyin he went to the Xinfeng hot springs.',
  },
  s0318: {
    literal: 'Summer, fourth month, gengyin: rebel Hu of Lanchi Prefecture, with the renegade chieftain Kang Taibin and An Murong, and the false generals Shi Shennu and Kang Tietou, seized Changquan County and overran the Six Hu Prefectures.',
    idiomatic: 'On gengyin of the fourth summer month Lanchi Hu rebels under Kang Taibin seized Changquan and overran the Six Hu prefectures.',
  },
  s0319: {
    literal: 'Minister of War Wang Jun mobilized Longyou forces and the Nine Surnames of Hedong to attack and suppress them.',
    idiomatic: 'Wang Jun, minister of war, marched Longyou troops and Hedong Nine Surnames against them.',
  },
  s0320: {
    literal: 'On jiaxu the Emperor personally tested presentation scholars in the Hall of Accepting Primacy and said: "In antiquity there were three themes; now two are omitted.',
    idiomatic: 'On jiaxu he examined presentation scholars in the Hall of Accepting Primacy and said: "Antiquity knew three themes; today we drop two.',
  },
  s0321: {
    literal: 'Lately no first grade has been awarded; I wish to keep the top rank and gather the worthy to settle army and state.',
    idiomatic: 'No first grade has lately been given; I mean to keep the top rank and gather talent to steady army and state.',
  },
  s0322: {
    literal: '" He also ordered the relevant offices to set out food.',
    idiomatic: 'He ordered the offices to set out a feast.',
  },
  s0323: {
    literal: 'Autumn, seventh month, wushen: the Central Capital was abolished and Pu restored as before.',
    idiomatic: 'On wushen of the seventh month the central capital was abolished and Pu restored.',
  },
  s0324: {
    literal: 'On jiyou Wang Jun defeated the Lanchi rebels, killing thirty-five thousand horsemen.',
    idiomatic: 'On jiyou Wang Jun broke the Lanchi rebels and killed thirty-five thousand horsemen.',
  },
  s0325: {
    literal: 'On bingchen violent winds in Yang and Run prefectures tore off roofs and uprooted trees, wrecking more than a thousand public and private boats.',
    idiomatic: 'On bingchen gales in Yang and Run tore off roofs, uprooted trees, and wrecked a thousand boats.',
  },
  s0326: {
    literal: 'On xinyou he assembled the tribal chieftains and executed Kang Taibin.',
    idiomatic: 'On xinyou he assembled the chieftains and beheaded Kang Taibin.',
  },
  s0327: {
    literal: 'In the Xiantian era the Triple Nine archery rite had been revised; now Supervising Attendant Xu Jingxian memorialized to abolish it.',
    idiomatic: 'The Triple Nine archery rite revised in Xiantian was abolished on Xu Jingxian\'s memorial.',
  },
  s0328: {
    literal: 'Ninth month, jisi new moon: the sun was eclipsed.',
    idiomatic: 'On the jisi new moon of the ninth month the sun was eclipsed.',
  },
  s0329: {
    literal: 'On dingwei Pillar of State and Duke of Liang Yao Chong died.',
    idiomatic: 'On dingwei Yao Chong, pillar of state and Duke of Liang, died.',
  },
  s0330: {
    literal: 'On dingsi he held court at Crimson Phoenix Tower and feasted Turk chieftains.',
    idiomatic: 'On dingsi he banqueted Turk chieftains at Crimson Phoenix Tower.',
  },
  s0331: {
    literal: 'On gengshen, visited the Department of State Affairs.',
    idiomatic: 'On gengshen he visited the secretariat.',
  },
  s0332: {
    literal: 'On guihai Right Yulin General and Acting Grand Protector of Bingzhou Zhang Yue was made Minister of War and co-equal Zhongshu Menxia Third Grade.',
    idiomatic: 'On guihai Zhang Yue, right Yulin general and acting Bingzhou protector, became minister of war and co-equal third-grade chief minister.',
  },
  s0333: {
    literal: 'Winter, eleventh month, bingchen: Left Regular Attendant Yuan Xingchong presented the Comprehensive Catalogue in two hundred juan, deposited in the inner storehouse.',
    idiomatic: 'On bingchen of the eleventh winter month Yuan Xingchong presented his two-hundred-juan Comprehensive Catalogue to the inner treasury.',
  },
  s0334: {
    literal: 'On gengwu, winter solstice: great amnesty throughout the realm; civil and military officials of ninth rank and above received one step in rank, third rank and above one noble rank.',
    idiomatic: 'On the gengwu solstice he proclaimed a general amnesty; officials of ninth rank and up gained one step, third rank and up one noble rank.',
  },
  s0335: {
    literal: 'Meritorious ministers who on the twentieth day of the sixth month and third day of the seventh had aided the altars of soil and grain with substantive fiefs, whether demoted or dead in the interval, were to be posthumously or retroactively honored as appropriate.',
    idiomatic: 'Those who on the sixth month\'s twentieth day and seventh month\'s third had saved the dynasty with substantive fiefs—whether demoted or dead since—were to be honored or posthumously raised as fit.',
  },
  s0336: {
    literal: 'Retired officials entitled to wear the fish tally might keep it for life.',
    idiomatic: 'Retired officials with fish-tally privilege might keep it for life.',
  },
  s0337: {
    literal: 'Three days of public revelry were granted.',
    idiomatic: 'The realm was granted three days of revelry.',
  },
  s0338: {
    literal: 'Twelfth month, yiyou: visited the hot springs at Xinfeng.',
    idiomatic: 'On yiyou of the twelfth month he went to the Xinfeng hot springs.',
  },
  s0339: {
    literal: 'On renwu, returned from the hot springs.',
    idiomatic: 'On renwu he returned from the springs.',
  },
  s0340: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0341: {
    literal: 'Tenth year of Kaiyuan, spring, first month, dingsi: proceeded to the eastern capital.',
    idiomatic: 'On dingsi of the first spring month of Kaiyuan 10 he went to Luoyang.',
  },
  s0342: {
    literal: 'On jiazi the supplementary staff and prostrating attendants of princes, dukes, and officials of viewing rank and above, and the prostrating staff of capital officials of third rank and above, were abolished.',
    idiomatic: 'On jiazi he abolished extra staff and prostrating attendants for princes, dukes, and third-rank capital officials.',
  },
  s0343: {
    literal: 'On yichou public-office money throughout the realm was halted; official salaries were to be paid from tax-household money according to the old monthly allotments.',
    idiomatic: 'On yichou empire-wide public-office money was ended; salaries were paid from tax-household funds on the old monthly scale.',
  },
  s0344: {
    literal: 'On wushen official land for civil and military officers, except public-office fields and gardens, was all taken by the state and given to fleeing households and poor households lacking labor for their tax plots.',
    idiomatic: 'On wushen official land except office fields and gardens was confiscated and given to fugitives and poor households short of labor for tax plots.',
  },
  s0345: {
    literal: 'Second month, wuyin: arrived at the eastern capital.',
    idiomatic: 'On wuyin of the second month he reached Luoyang.',
  },
  s0346: {
    literal: 'Third month, wushen, edict: from now on civil and military officials guilty of corruption up to dismissal, even if pardoned, shall never again be employed.',
    idiomatic: 'On wushen of the third month an edict barred forever from office any official dismissed for corruption, even under amnesty.',
  },
  s0347: {
    literal: 'Summer, fourth month, dingyou: Khitan chieftain Songmo Protector Li Yuzhou was enfeoffed Grand Prince of Songmo; Xi chieftain Raole Protector Li Lusu was enfeoffed Grand Prince of Raole.',
    idiomatic: 'On dingyou of the fourth summer month Li Yuzhou was created Grand Prince of Songmo and Li Lusu Grand Prince of Raole.',
  },
  s0348: {
    literal: 'Fifth month: great rain at the eastern capital; the Yi and Ru rivers flooded, destroying thousands of houses in Henan prefecture and Xu, Ru, Xian, and Chen prefectures; very many drowned.',
    idiomatic: 'In the fifth month rain at Luoyang sent the Yi and Ru over their banks, wrecking thousands of homes from Henan to Chen; many drowned.',
  },
  s0349: {
    literal: 'Intercalary fifth month, renshen: Minister of War Zhang Yue went to Shuofang Army to inspect the frontier.',
    idiomatic: 'On renshen of the intercalary fifth month Zhang Yue, minister of war, toured the Shuofang frontier.',
  },
  s0350: {
    literal: 'On wuyin an edict released hostage youths of various tribes serving in the palace guard and sent them home.',
    idiomatic: 'On wuyin an edict freed tribal hostages in the palace guard and sent them home.',
  },
  s0351: {
    literal: 'Sixth month, xinchou: the Emperor lectured on the Classic of Filial Piety and promulgated it throughout the realm.',
    idiomatic: 'On xinchou of the sixth month he lectured on the Classic of Filial Piety and promulgated it empire-wide.',
  },
  s0352: {
    literal: 'On guimao the daughter of the Princess of Yuyao, Lady Murong, was made Princess of Yan Commandery and sent to marry the Xi chieftain Li Lusu, Grand Prince of Raole.',
    idiomatic: 'On guimao the Princess of Yuyao\'s daughter Murong was created Princess of Yan Commandery and married to Li Lusu, Grand Prince of Raole.',
  },
  s0353: {
    literal: 'On jisi the capital Ancestral Temple was enlarged to nine chambers and Emperor Xiaohé\'s spirit tablet was moved to the main temple.',
    idiomatic: 'On jisi the capital temple was expanded to nine chambers and Xiaohé\'s tablet placed in the main shrine.',
  },
  s0354: {
    literal: 'Autumn, eighth month, bingxu: Lingnan Investigation Commissioner Pei Zhuxian reported that the Annan bandit chief Mei Shuluan and others were besieging prefectures and counties; General of Valiant Cavalry and concurrent Palace Attendant Yang Sixu was sent to suppress them.',
    idiomatic: 'On bingxu of the eighth month Pei Zhuxian reported Mei Shuluan besieging Annan; Yang Sixu, valiant cavalry general and palace attendant, was sent against him.',
  },
  s0355: {
    literal: 'On dinghai Minister of Revenue Lu Xiangxian was sent to Ru and Xu prefectures to comfort and relieve.',
    idiomatic: 'On dinghai Lu Xiangxian, minister of revenue, was dispatched to comfort and relieve Ru and Xu.',
  },
  s0356: {
    literal: 'On bingshen the Yellow River dike broke in Bo and Di prefectures, flooding fields.',
    idiomatic: 'On bingshen the Yellow River burst its dike in Bo and Di, drowning cropland.',
  },
  s0357: {
    literal: 'Ninth month: Zhang Yue captured Kang Yuanzi at Mount Mupan.',
    idiomatic: 'In the ninth month Zhang Yue took Kang Yuanzi at Mount Mupan.',
  },
  s0358: {
    literal: 'An edict moved more than fifty thousand remnant Hu of the six Hezhou prefectures to Xu, Ru, Tang, Deng, Xian, and Yu; for the first time the lands north of the river and Shuofang were emptied for a thousand li.',
    idiomatic: 'An edict resettled fifty thousand Hezhou Hu to the interior; for the first time the north-of-river and Shuofang corridor lay empty for a thousand li.',
  },
  s0359: {
    literal: 'On jiaxu Director of the Palace Library and Duke of Chu Jiang Jiao was guilty; he was ordered beaten sixty strokes and exiled to Qin Prefecture, dying on the road.',
    idiomatic: 'On jiaxu Jiang Jiao, director of the palace library and Duke of Chu, was beaten sixty strokes, exiled to Qin, and died on the road.',
  },
  s0360: {
    literal: 'Director of Waterways Liu Chengzu was exiled to Lei Prefecture.',
    idiomatic: 'Liu Chengzu, director of waterways, was exiled to Lei Prefecture.',
  },
  s0361: {
    literal: 'On yihai, edict: "I rule the realm and nurture the black-haired people.',
    idiomatic: 'On yihai an edict declared: "I rule the realm and nurture the people.',
  },
  s0362: {
    literal: 'Within I cultivate harmony among kin to order the nine agnates;',
    idiomatic: 'Within I cultivate kinship to order the nine agnates;',
  },
  s0363: {
    literal: 'without I harmonize the myriad tasks to aid the ten thousand people.',
    idiomatic: 'without I harmonize government to aid the myriad folk.',
  },
  s0364: {
    literal: 'Meritorious kin receive added grace; brothers should reach the fullness of fraternal duty.',
    idiomatic: 'Meritorious kin receive added grace; brothers should fulfill fraternal duty to the full.',
  },
  s0365: {
    literal: 'I strive to honor the root and carefully cultivate bright virtue.',
    idiomatic: 'I strive to honor the root and cultivate bright virtue.',
  },
  s0366: {
    literal: 'Now petty men have wrought evil and already suffered the law; I fear the unrestrained may not yet be stilled.',
    idiomatic: 'Petty men have sinned and already paid the law; I fear the unrestrained are not yet stilled.',
  },
  s0367: {
    literal: 'All within the clan are warned: from now on princes, princesses, imperial sons-in-law, and maternal kin, except for the nearest kin, may not pass in and out of one another\'s gates or speak rash words.',
    idiomatic: 'The clan is warned: from now on princes, princesses, sons-in-law, and maternal kin—except nearest kin—may not enter one another\'s gates or speak rashly.',
  },
  s0368: {
    literal: 'Thus the way of utmost fairness is preserved and peace long kept, the screen of the realm secured and rest assured.',
    idiomatic: 'So utmost fairness may endure, peace hold, and the realm\'s screen stand firm.',
  },
  s0369: {
    literal: 'Noble kin and honored relations should write this at their seat.',
    idiomatic: 'Noble kin should write this at their seat.',
  },
  s0370: {
    literal: '" Another edict bound all officials not to associate or deal with diviners and shamans.',
    idiomatic: 'The edict closed. Another bound officials from consorting with diviners and shamans.',
  },
  s0371: {
    literal: 'On yimao night the capital man Quan Liangshan falsely styled himself son of the Prince of Xiang and called himself Emperor Guang, and with his follower Quan Chubi led several hundred garrison soldiers through the Jingfeng and Changle gates, cutting the bars to enter the palace and rebel.',
    idiomatic: 'On the night of yimao Quan Liangshan of the capital posed as the Prince of Xiang\'s son, styled himself Emperor Guang, and with Quan Chubi led hundreds of garrison troops through Jingfeng and Changle gates into the palace.',
  },
  s0372: {
    literal: 'By dawn the troops were defeated; Liangshan was beheaded and his head sent to the eastern capital.',
    idiomatic: 'By dawn they were broken; Liangshan was beheaded and his head sent to Luoyang.',
  },
  s0373: {
    literal: 'The Heyang Ba Ya granary was abolished.',
    idiomatic: 'The Ba Ya granary at Heyang was abolished.',
  },
  s0374: {
    literal: 'Winter, tenth month, guichou: Qianyuan Hall was again titled Bright Hall.',
    idiomatic: 'On guichou of the tenth winter month Qianyuan Hall was again named Bright Hall.',
  },
  s0375: {
    literal: 'On jiayin, visited the former Xingtai Palace at Shou\'an.',
    idiomatic: 'On jiayin he visited the old Xingtai Palace at Shou\'an.',
  },
  s0376: {
    literal: 'Hunted at Tuyi River.',
    idiomatic: 'He hunted on the Tuyi River.',
  },
  s0377: {
    literal: 'On gengshen, returned from Xingtai Palace.',
    idiomatic: 'On gengshen he returned from Xingtai Palace.',
  },
  s0378: {
    literal: 'Persia sent envoys presenting a lion.',
    idiomatic: 'Persia sent envoys with a lion.',
  },
  s0379: {
    literal: 'Eleventh month, yiwei: for the first time chief ministers were granted a shared substantive fief of three hundred households.',
    idiomatic: 'On yiwei of the eleventh month chief ministers were for the first time granted a shared substantive fief of three hundred households.',
  },
  s0380: {
    literal: 'Twelfth month: investigation commissioners were abolished.',
    idiomatic: 'In the twelfth month investigation commissioners were abolished.',
  },
  s0381: {
    literal: 'Eleventh year of Kaiyuan, spring, first month, dingmao: capital convicts in chains were pardoned; exile and death sentences reduced one grade, the rest forgiven.',
    idiomatic: 'On dingmao of Kaiyuan 11 chained capital convicts were pardoned—exile and death reduced one grade, the rest freed.',
  },
  s0382: {
    literal: 'On jisi he toured the northern capital; an edict ordered that wherever he passed the aged, widows, orphans, and solitary, and households of campaigners, be comforted;',
    idiomatic: 'On jisi he toured Taiyuan; wherever he passed, the aged, widowed, orphaned, and soldiers\' families were to be comforted;',
  },
  s0383: {
    literal: 'exile and death sentences reduced one grade; those below penal servitude released.',
    idiomatic: 'exile and death were reduced one grade; penal servitude and below were freed.',
  },
  s0384: {
    literal: 'On gengchen he visited Bing and Lu prefectures, feasted the elders, and by special pardon forgave capital crimes and below, granting tax relief for five years.',
    idiomatic: 'On gengchen he feasted the elders of Bing and Lu and by special pardon forgave crimes through capital offense, with five years\' tax relief.',
  },
  s0385: {
    literal: 'His former residence was separately made Flying Dragon Palace.',
    idiomatic: 'His old residence was made Flying Dragon Palace.',
  },
  s0386: {
    literal: 'On xinmao Bingzhou was made Taiyuan Superior Prefecture; appointments of officials followed Jingzhao and Henan.',
    idiomatic: 'On xinmao Bingzhou became Taiyuan superior prefecture with appointments like Jingzhao and Luoyang.',
  },
  s0387: {
    literal: 'The people received one year\'s tax relief; poor households two years; original followers five years.',
    idiomatic: 'The people received one year\'s relief; the poor two; original followers five.',
  },
  s0388: {
    literal: 'Descendants of Wude meritocrats and original followers with civil or military talent but no office were to be searched out by prefecture and county and recommended by name.',
    idiomatic: 'Talented but officeless descendants of Wude meritocrats and original followers were to be sought and recommended by name.',
  },
  s0389: {
    literal: 'The Emperor personally composed the "Ode to the Hall of Rising Justice" and calligraphy, carving stone to record merit on the south street of Taiyuan Prefecture.',
    idiomatic: 'He composed the "Ode to the Hall of Rising Justice" in his own hand and had merit carved in stone on Taiyuan\'s south street.',
  },
  s0390: {
    literal: 'On wushen he halted at Jin Prefecture.',
    idiomatic: 'On wushen he paused at Jin Prefecture.',
  },
  s0391: {
    literal: 'Director of Sacrifices and Director of the Secretariat Zhang Jiazhen was demoted to prefect of Youzhou.',
    idiomatic: 'Zhang Jiazhen, director of sacrifices and secretariat director, was demoted to Youzhou prefect.',
  },
  s0392: {
    literal: 'On renzi he sacrificed to the earth at the She altar south of Fen; officials of third rank and above at the rite received one noble rank, fourth rank one step, attending officials one cycle of merit.',
    idiomatic: 'On renzi he sacrificed to earth at Fen\'s She altar; third rank and up gained a noble rank, fourth rank a step, attendees one merit cycle.',
  },
  s0393: {
    literal: 'Fenyin was renamed Baoding County.',
    idiomatic: 'Fenyin county was renamed Baoding.',
  },
  s0394: {
    literal: 'On guihai Minister of War Zhang Yue was made concurrent Director of the Secretariat.',
    idiomatic: 'On guihai Zhang Yue, minister of war, was made concurrent secretariat director.',
  },
  s0395: {
    literal: 'Third month, gengwu: the imperial carriage reached the capital; an edict ordered that prefectures, superior prefectures, and counties along the route pay no land tax this year, and capital prisoners in chains be forgiven.',
    idiomatic: 'On gengwu of the third month he reached Chang\'an; the route owed no land tax that year and capital prisoners were freed.',
  },
  s0396: {
    literal: 'Summer, fourth month, bingchen: Zhongzong\'s spirit tablet was moved to enshrinement in the Ancestral Temple.',
    idiomatic: 'On bingchen of the fourth summer month Zhongzong\'s tablet was installed in the ancestral temple.',
  },
  s0397: {
    literal: 'On guihai Zhang Yue was formally appointed Director of the Secretariat; Minister of Personnel and Duke of Zhongshan Wang Jun was made Minister of War and co-equal Zhongshu Menxia Third Grade.',
    idiomatic: 'On guihai Zhang Yue was confirmed secretariat director; Wang Jun, minister of personnel and Duke of Zhongshan, became minister of war and co-equal chief minister.',
  },
  s0398: {
    literal: 'Fifth month, jisi: officer posts for the Armory Directorate were established at the northern capital.',
    idiomatic: 'On jisi of the fifth month armory directorate posts were established at Taiyuan.',
  },
  s0399: {
    literal: 'Wang Jun became Shuofang military commissioner and concurrently overseer of Hebei, Longyou, and Hexi forces.',
    idiomatic: 'Wang Jun became Shuofang commissioner and overseer of Hebei, Longyou, and Hexi troops.',
  },
  s0400: {
    literal: 'Sixth month: Wang Jun proceeded to Shuofang Army.',
    idiomatic: 'In the sixth month Wang Jun went to Shuofang.',
  },
};
const CHAPTER_PATH = 'data/jiutangshu/008.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '008') {
  throw new Error(`Expected chapter 008, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length >= END - START + 1 &&
  [...expectedIds].every((id) => trans.sentences.some((s) => (s.originalId || s.id) === id));

if (!hasAll) {
  const extracted = extractRange(chapterPath, START, END);
  const map = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));
  for (const s of extracted) {
    map.set(s.originalId, s);
  }
  trans.sentences = [...map.values()].sort(
    (a, b) => parseInt((a.originalId || a.id).slice(1), 10) - parseInt((b.originalId || b.id).slice(1), 10)
  );
}

let applied = 0;
for (const s of trans.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !trans.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log('Applied', applied, 'translations (s0301–s0400)');
