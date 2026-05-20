#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day renyin, Suiyuan city general Rongbao was dismissed; Wu Mitai replaced him.',
    'On renyin, Rongbao left Suiyuan; Wu Mitai took the post.',
  ],
  s0102: [
    'On day jiachen, Duke Yingcheng Akedong\'a was ordered to serve at the imperial bodyguard grand minister rank; Kui Lin was made Minister of the Court of Colonial Affairs.',
    'On jiachen, Akedong\'a joined the inner guard grand ministers; Kui Lin took the Lifan yuan.',
  ],
  s0103: [
    'On day wushen, Left Censor-in-Chief Zhang Ruoshi was dismissed on account of illness.',
    'On wushen, Zhang Ruoshi left the censorate for illness.',
  ],
  s0104: [
    'On day xinhai, Cui Yingjie was transferred to be Left Censor-in-Chief; Yu Wenyi was made Minister of Punishments.',
    'On xinhai, Cui Yingjie took the left censorate; Yu Wenyi, punishments.',
  ],
  s0105: [
    'On day renzi, Asiha was dismissed on account of illness; E Bao was made Grand Canal transport governor-general.',
    'On renzi, ill Asiha was replaced by E Bao as canal transport governor-general.',
  ],
  s0106: [
    'On day guichou, Dunfu was made Hunan governor.',
    'On guichou, Dunfu became Hunan governor.',
  ],
  s0107: [
    'On day bingchen, Sanbao was ordered to investigate accumulated abuses in Zhejiang grain transport.',
    'On bingchen, Sanbao was sent to probe Zhejiang canal abuses.',
  ],
  s0108: [
    'On day jiazi, because of drought in twenty-nine Gansu prefectures and counties including Gaolan, accumulated arrears of stored grain exceeding four million piculs were remitted.',
    'On jiazi, Gaolan and twenty-eight other Gansu districts were forgiven over four million piculs of stored-grain arrears from drought.',
  ],
  s0109: [
    'Eleventh month, day jiashen: the Siku Quanshu project was ordered to examine in detail all forbidden books and revise or destroy them separately.',
    'In month 11, jiashen, the Siku Quanshu staff were told to review banned books and revise or destroy each as needed.',
  ],
  s0110: [
    'An edict stated: "Writings of late-Ming figures whose wording offends this dynasty, such as Qian Qianyi and others, who all failed to die loyal to their sovereign and wildly uttered slander, should upon investigation be destroyed."',
    'Hongli ruled that late-Ming writers who insulted the dynasty, like Qian Qianyi, should be found and destroyed for disloyal rantings.',
  ],
  s0111: [
    'Liu Zongzhou and Huang Daozhou upheld rectitude in office; Xiong Tingbi\'s talent and administrative ability were outstanding; had their words been adopted at the time, collapse might not have come so quickly—only the wording should be changed, with no need to destroy the works entirely.',
    'Liu Zongzhou, Huang Daozhou, and the capable Xiong Tingbi deserved wording changes, not destruction, since their counsel might have slowed the Ming fall.',
  ],
  s0112: [
    'Moreover, upright ministers such as Yang Lian, even if one or two phrases gave offense, need only be revised on discretion; it would truly be unbearable to burn them all together.',
    'Straight ministers like Yang Lian needed only selective edits for a few offending lines, not wholesale burning.',
  ],
  s0113: [
    '"',
    'The edict closed.',
  ],
  s0114: [
    'Twelfth month, day gengzi: the translation-service provincial examination was ordered held in the eighth month of the wuxu year, with the metropolitan examination in the third month of the following year.',
    'In month 12, gengzi, the Manchu translation exams were set for wuxu month 8 and the metropolitan exam the next third month.',
  ],
  s0115: [
    'On day bingwu, Mingliang was ordered to serve at the Grand Council; Wu Mitai was transferred to Xi\'an general; Bocheng acted as Suiyuan city general.',
    'On bingwu, Mingliang joined the Grand Council; Wu Mitai took Xi\'an; Bocheng acted at Suiyuan.',
  ],
  s0116: [
    'On day wushen, Yalang\'a was made Suiyuan city general.',
    'On wushen, Yalang\'a became Suiyuan general.',
  ],
  s0117: [
    'On day jiayin, quota taxes for this year were remitted for disaster in thirty Shandong prefectures, counties, guards, and posts including Dezhou.',
    'On jiayin, thirty Shandong disaster districts including Dezhou lost this year\'s taxes.',
  ],
  s0118: [
    'On day bingchen, the Burmese headman Deruyun requested to return inland officials; tribute entry was approved.',
    'On bingchen, Burma\'s Deruyun was allowed to return Qing officials and pay tribute.',
  ],
  s0119: [
    'They were ordered to come to the capital to beg imperial favor.',
    'He was told to come to Beijing to seek grace.',
  ],
  s0120: [
    'On day wuwu, the Emperor went to Yingtai.',
    'On wuwu, Hongli went to Yingtai.',
  ],
  s0121: [
    'The Aksu beg of Kucha, Kazakh envoys, and the Mingzheng chieftain of Sichuan and others paid audience; each was granted graded caps and robes.',
    'Kucha, Kazakh, and Sichuan Mingzheng envoys were received and given graded dress.',
  ],
  s0122: [
    'Forty-second year, spring, first month, new moon on day wuchen: civilian tax arrears in Gansu from Qianlong 23 through 35 totaling more than 840,000 taels were remitted.',
    'In Qianlong 42, spring, wuchen new moon, Gansu owed over 840,000 taels from years 23–35 were forgiven.',
  ],
  s0123: [
    'On day bingzi, the Emperor reviewed troops at the military review tower and ordered princes, grand ministers, Outer Mongol nobles, Muslims, Kucha and Kazakh envoys, Jinchuan chieftains, and others to attend.',
    'On bingzi, Hongli reviewed troops and had princes, ministers, Mongols, Muslims, envoys, and Jinchuan chiefs watch.',
  ],
  s0124: [
    'On day xinsi, because the Empress Dowager was unwell, he went to Changchun Immortal Hall to inquire after her health, escorted the Empress Dowager to the Garden of Shared Pleasures, and attended her evening meal.',
    'On xinsi, with the Empress Dowager ill, Hongli called at Changchun Immortal Hall and dined with her at the Garden of Shared Pleasures.',
  ],
  s0125: [
    'From this on he went daily to Changchun Immortal Hall to pay respects.',
    'He thereafter visited Changchun Immortal Hall daily.',
  ],
  s0126: [
    'On day yiyou, because Tusi\'de memorialized that Burmese tribes had submitted inward, Agui was ordered to go to Yunnan to arrange affairs.',
    'On yiyou, with Burma submitting, Agui was sent to Yunnan.',
  ],
  s0127: [
    'Li Shiyao was transferred to Yunnan-Guizhou governor-general; Yang Jingsu to Liangguang governor-general; Hao Shuo to Shandong governor; Tusi\'de returned to Guizhou governor; Pei Zongxi returned to Yunnan governor.',
    'Li Shiyao took Yunnan-Guizhou; Yang Jingsu, Liangguang; Hao Shuo, Shandong; Tusi\'de, Guizhou; Pei Zongxi, Yunnan.',
  ],
  s0128: [
    'On day jichou, Xiong Xuepeng\'s crime was pardoned; Su Erde and Guangde were sentenced to decapitation.',
    'On jichou, Xiong Xuepeng was pardoned; Su Erde and Guangde were condemned to death.',
  ],
  s0129: [
    'On day gengyin, the Empress Dowager died; her coffin was placed in the main hall of Cining Palace; the Emperor made Hanqing Studio his mourning lodge and promulgated the late Empress Dowager\'s testamentary edict.',
    'On gengyin, the Empress Dowager died; Hongli mourned at Hanqing Studio and issued her final edict.',
  ],
  s0130: [
    'An edict ordered mourning dress for one hundred days; princes, grand ministers, and officials were to leave mourning after twenty-seven days.',
    'Hongli ordered a hundred days of mourning for himself and twenty-seven for officials.',
  ],
  s0131: [
    'On day xinmao, the late Empress Dowager was given the posthumous title Empress Xiaoshengxian; grace was extended by a universal remission of taxes and grain once.',
    'On xinmao, she became Empress Xiaoshengxian and taxes were remitted once nationwide.',
  ],
  s0132: [
    'On day renchen, regulations were fixed for dispatching officials to sacrifice at suburban altars and the altars of soil and grain with music within the twenty-seven-day period.',
    'On renchen, ritual music rules were set for state sacrifices during the twenty-seven-day mourning.',
  ],
  s0133: [
    'On day yiwei, the late Empress Dowager\'s tomb was titled Tai Dongling.',
    'On yiwei, her tomb was named Tai Dongling.',
  ],
  s0134: [
    'On day bingshen, the late Empress Dowager\'s coffin was moved to the Garden of Everlasting Spring and placed in the Hall of the Nine Classics and Three Matters.',
    'On bingshen, her coffin went to the Garden of Everlasting Spring\'s Nine Classics Hall.',
  ],
  s0135: [
    'The Emperor resided at the Old Summer Palace.',
    'Hongli stayed at the Old Summer Palace.',
  ],
  s0136: [
    'Second month, new moon on day dingyou: the Emperor went to Anyou Palace to perform the rite of announcing grief.',
    'On month 2 dingyou new moon, Hongli announced grief at Anyou Palace.',
  ],
  s0137: [
    'The Emperor dwelt in mourning garb at the Wuyi Studio.',
    'Hongli mourned at the Wuyi Studio.',
  ],
  s0138: [
    'On day jihai, the Emperor returned to reside at the Old Summer Palace.',
    'On jihai, Hongli returned to the Old Summer Palace.',
  ],
  s0139: [
    'On day gengzi, the Emperor went before the late Empress Dowager\'s coffin in the Hall of the Nine Classics and Three Matters to offer sacrifice.',
    'On gengzi, Hongli offered sacrifice before her coffin.',
  ],
  s0140: [
    'Princes and grand ministers requested that sacrifices be performed at intervals of a day or two; this was not granted.',
    'Princes asked to mourn every other day; Hongli refused.',
  ],
  s0141: [
    'On day jiachen, it was ordered that New Year\'s court congratulations be suspended within the twenty-seven-day period.',
    'On jiachen, New Year court rites were halted for twenty-seven days.',
  ],
  s0142: [
    'After the hundred days, ordinary audience at the main hall would resume, with the date to be requested by edict when the day arrived.',
    'After a hundred days, normal audiences would resume on imperial order.',
  ],
  s0143: [
    'On day yisi, regulations were fixed for imperial and official mourning dress during the hundred days and during the twenty-seven-day period.',
    'On yisi, mourning dress rules were set for court and officials.',
  ],
  s0144: [
    'On day jiayin, Gao Jin together with Ayangga went to Anhui to investigate a case; Yang Kui concurrently acted as Liangjiang governor-general.',
    'On jiayin, Gao Jin and Ayangga investigated Anhui; Yang Kui acted as Liangjiang governor-general.',
  ],
  s0145: [
    'Quota taxes were remitted for the year 41 flood disaster in eight Anhui prefectures and counties including Suzhou and three guards including Fengyang.',
    'Eight Anhui counties and three guards lost year-41 flood taxes.',
  ],
  s0146: [
    'On day dingsi, the Emperor went before the late Empress Dowager\'s coffin in the Hall of the Nine Classics and Three Matters to perform the monthly sacrifice.',
    'On dingsi, Hongli performed the monthly mourning rite before her coffin.',
  ],
  s0147: [
    'Yan Xishen was made Hunan governor.',
    'Yan Xishen became Hunan governor.',
  ],
  s0148: [
    'Third month, day xinwei: Left Censor-in-Chief Su Erne and Grand Court Judge Yin Jiaquan were granted permission to retire.',
    'In month 3, xinwei, Su Erne and Yin Jiaquan retired.',
  ],
  s0149: [
    'On day renshen, because Sa Zai was coming to the capital, Debao was ordered concurrently to act as Jiangnan canal transport governor-general.',
    'On renshen, with Sa Zai bound for Beijing, Debao acted as Jiangnan canal governor-general.',
  ],
  s0150: [
    'On day wuyin, Mailasun was made Left Censor-in-Chief.',
    'On wuyin, Mailasun took the left censorate.',
  ],
  s0151: [
    'On day renwu, the late Empress Dowager was given the full honorific title Empress Xiaosheng Cixuan Kanghui Dunhe Jingtian Guangshengxian.',
    'On renwu, she received the full posthumous title Empress Xiaosheng Cixuan Kanghui Dunhe Jingtian Guangshengxian.',
  ],
  s0152: [
    'On day wuzi, Hengshanbao was made Uliasutai assistant commissioner.',
    'On wuzi, Hengshanbao became Uliasutai assistant commissioner.',
  ],
  s0153: [
    'Summer, fourth month, day wuxu: because Burmese tribes\' submission was treacherous and changeable, Agui was recalled to the capital; the Menggan envoys sent by the Burmese headmen were detained.',
    'In month 4, wuxu, treacherous Burmese submission recalled Agui and detained Menggan envoys.',
  ],
  s0154: [
    'On day wushen, the Emperor went before Empress Xiaoshengxian\'s coffin in the Hall of the Nine Classics and Three Matters to perform the pre-departure sacrifice.',
    'On wushen, Hongli performed the pre-departure rite before her coffin.',
  ],
  s0155: [
    'On day jiyou, Empress Xiaoshengxian\'s funeral procession set out; the Emperor escorted it to Tai Dongling and remitted seven-tenths of this year\'s quota taxes for prefectures and counties along the route.',
    'On jiyou, Hongli escorted her coffin to Tai Dongling and cut route taxes by seven-tenths.',
  ],
  s0156: [
    'On day guichou, the Emperor visited Tailing.',
    'On guichou, Hongli visited Tailing.',
  ],
  s0157: [
    'That day, Empress Xiaoshengxian\'s coffin reached Tai Dongling and was placed in the Hall of Imperial Favor.',
    'That day her coffin reached Tai Dongling\'s Hall of Imperial Favor.',
  ],
  s0158: [
    'On day bingchen, the Emperor went before Empress Xiaoshengxian\'s coffin at Tai Dongling to perform the hundred-day sacrifice.',
    'On bingchen, Hongli performed the hundred-day rite at Tai Dongling.',
  ],
  s0159: [
    'On day dingsi, Grand Secretary Shuhede died.',
    'On dingsi, Grand Secretary Shuhede died.',
  ],
  s0160: [
    'On day wuwu, Yonggui was ordered to act as grand secretary while also managing the Ministry of Personnel.',
    'On wuwu, Yonggui acted as grand secretary and personnel minister.',
  ],
  s0161: [
    'On day xinyou, quota taxes were remitted for the year 41 flood in eight Anhui prefectures and counties including Suzhou and three guards including Changhe.',
    'On xinyou, eight Anhui counties and three guards lost year-41 flood taxes.',
  ],
  s0162: [
    'On day renxu, Fulong\'an was ordered concurrently to act as Minister of Personnel.',
    'On renxu, Fulong\'an also acted as personnel minister.',
  ],
  s0163: [
    'On day jiazi, the Emperor returned to the capital.',
    'On jiazi, Hongli returned to Beijing.',
  ],
  s0164: [
    'Fifth month, new moon on day yichou: Empress Xiaoshengxian\'s spirit tablet was elevated for joint worship in the Imperial Ancestral Temple.',
    'On month 5 yichou new moon, her tablet entered the Ancestral Temple.',
  ],
  s0165: [
    'The next day, an edict extending grace with differentiated favors was promulgated.',
    'The next day Hongli issued a grace edict.',
  ],
  s0166: [
    'On day wuchen, the Emperor in person went to Shuhede\'s mourning site to grant condolence sacrifice.',
    'On wuchen, Hongli mourned Shuhede in person.',
  ],
  s0167: [
    'On day renshen, accumulated tax arrears were remitted for ten Zhili prefectures and counties including Qingyuan.',
    'On renshen, ten Zhili districts including Qingyuan were forgiven back taxes.',
  ],
  s0168: [
    'On day wuyin, because taxes and grain were universally remitted nationwide, three-tenths of official-estate rent interest in Taiwan dependency of Fujian was remitted.',
    'On wuyin, Taiwan official estates lost three-tenths of rent after the national remission.',
  ],
  s0169: [
    'On day jiashen, Malan garrison commander Mandou excavated a wall and opened a road at the Eastern Tombs; he was sentenced to decapitation.',
    'On jiashen, Mandou was condemned to death for breaching the Eastern Tombs wall.',
  ],
  s0170: [
    'On day dinghai, Agui was made Wuying Hall grand secretary and ordered to manage Ministry of Personnel affairs; Yinglian was made associate grand secretary.',
    'On dinghai, Agui became Wuying grand secretary over personnel; Yinglian, associate grand secretary.',
  ],
  s0171: [
    'It was ordered that Arigun, father of Minister and Duke Guoyi Jiyong Fengsheng\'e, originally inheriting the Guoyi duke rank, should also have the characters "Jiyong" added to the title.',
    'Arigun, father of Duke Guoyi Jiyong Fengsheng\'e, was granted the added title Jiyong on the Guoyi dukedom.',
  ],
  s0172: [
    'Yonggui was transferred to Minister of Personnel; Fulehun was made Minister of Rites; Sanbao was made Huguang governor-general; Wang Tanwang was made Zhejiang governor.',
    'Yonggui took personnel; Fulehun, rites; Sanbao, Huguang; Wang Tanwang, Zhejiang.',
  ],
  s0173: [
    'Quota taxes were remitted for disaster in thirty-three Shuntian and Zhili prefectures, departments, and counties including Daxing.',
    'Thirty-three Shuntian and Zhili disaster districts including Daxing lost quota taxes.',
  ],
  s0174: [
    'Sixth month, day yimao: Jilin general Fuchun was transferred to Hangzhou general; Fukang\'an was ordered to replace him.',
    'In month 6, yimao, Fuchun took Hangzhou; Fukang\'an replaced him at Jilin.',
  ],
  s0175: [
    'On day jiwei, the Emperor went to Black Dragon Pool to pray for rain.',
    'On jiwei, Hongli prayed for rain at Black Dragon Pool.',
  ],
  s0176: [
    'Autumn, seventh month: quota taxes were remitted for the year 41 disaster in twenty-nine Gansu prefectures, departments, and counties including Gaolan.',
    'In month 7, twenty-nine Gansu districts including Gaolan lost year-41 disaster taxes.',
  ],
  s0177: [
    'On day bingxu, it was ordered that tribute grain, fodder, and straw bundles levied from various dependent tribes in Gansu be remitted by three-tenths.',
    'On bingxu, Gansu tribal grain and fodder levies were cut by three-tenths.',
  ],
  s0178: [
    'Siam headman Zheng Zhao presented tribute, sending captured Burmese; Yang Jingsu was instructed to address him with a patent of enfeoffment.',
    'Zheng Zhao of Siam sent tribute and Burmese captives; Yang Jingsu was told to enfeoff him.',
  ],
  s0179: [
    'Eighth month, day gengzi: three-tenths of quota grain for civilian households in various Urumqi prefectures and counties were remitted.',
    'In month 8, gengzi, Urumqi households lost three-tenths of quota grain.',
  ],
  s0180: [
    'On day gengshen, Vice Minister Jin Jian was ordered to go to Jilin to join Fukang\'an in investigating and handling matters.',
    'On gengshen, Jin Jian was sent to Jilin to investigate with Fukang\'an.',
  ],
  s0181: [
    'Ninth month, day bingzi: the Emperor visited Tailing and Tai Dongling.',
    'In month 9, bingzi, Hongli visited Tailing and Tai Dongling.',
  ],
  s0182: [
    'On day renwu, the Emperor returned to the capital.',
    'On renwu, Hongli returned to Beijing.',
  ],
  s0183: [
    'Winter, tenth month, day wuxu: Minister of Revenue and Duke Guoyi Jiyong Fengsheng\'e died; Yinglian was transferred to Minister of Revenue while still also managing punishments; Defu was made Minister of Punishments.',
    'In month 10, wuxu, Fengsheng\'e died; Yinglian took revenue and kept punishments; Defu, punishments minister.',
  ],
  s0184: [
    'On day yisi, an edict stated that for Shaanxi civilian colony rent grain and fodder straw, in years when rotating universal remissions fell due, all should be remitted together.',
    'On yisi, Shaanxi colony rent and fodder were remitted in universal remission years.',
  ],
  s0185: [
    'On day gengshen, one Miyun deputy lieutenant-general was established with two thousand garrison troops.',
    'On gengshen, Miyun gained a deputy commander and two thousand troops.',
  ],
  s0186: [
    'On day xinyou, Yuan Shoutong was ordered to go to Zhejiang to investigate the case against Gui\'an county magistrate Liu Jun.',
    'On xinyou, Yuan Shoutong was sent to try Gui\'an magistrate Liu Jun in Zhejiang.',
  ],
  s0187: [
    'Vice Ministers Zhou Huang and Ayangga were ordered to go to Sichuan to investigate the case against Dazu county magistrate Zhao Xiangao.',
    'Zhou Huang and Ayangga were sent to try Dazu magistrate Zhao Xiangao in Sichuan.',
  ],
  s0188: [
    'Eleventh month, day bingyin: Guangde was executed.',
    'In month 11, bingyin, Guangde was executed.',
  ],
  s0189: [
    'On day wuchen, Haicheng was stripped of office for shielding Wang Xihu; Hao Shuo was made Jiangxi governor; Guotai was made Shandong governor.',
    'On wuchen, Haicheng lost his post for shielding Wang Xihu; Hao Shuo took Jiangxi; Guotai, Shandong.',
  ],
  s0190: [
    'On day renshen, Minister of Punishments Yu Wenyi requested retirement; this was granted.',
    'On renshen, Yu Wenyi retired from punishments.',
  ],
  s0191: [
    'On day jiaxu, Yuan Shoutong was transferred to Minister of Punishments; Liang Guozhi was made Minister of Revenue.',
    'On jiaxu, Yuan Shoutong took punishments; Liang Guozhi, revenue.',
  ],
  s0192: [
    'On day yiyou, quota taxes were remitted for this year\'s disaster in seven Gansu prefectures and counties including Ningxia.',
    'On yiyou, seven Gansu districts including Ningxia lost this year\'s disaster taxes.',
  ],
  s0193: [
    'Twelfth month, day dingyou: quota taxes were remitted for the year 41 disaster in seventeen Gansu prefectures and counties including Gaolan.',
    'In month 12, dingyou, seventeen Gansu districts including Gaolan lost year-41 disaster taxes.',
  ],
  s0194: [
    'On day guichou, drought victims were relieved in thirty-two Gansu prefectures, departments, and counties including Gaolan.',
    'On guichou, thirty-two drought-stricken Gansu districts were relieved.',
  ],
  s0195: [
    'Forty-third year, spring, first month, new moon on day renxu: court congratulations were waived.',
    'In Qianlong 43, spring, renxu new moon, court congratulations were skipped.',
  ],
  s0196: [
    'On day guihai, Zheng Dajin was made Henan governor.',
    'On guihai, Zheng Dajin became Henan governor.',
  ],
  s0197: [
    'On day xinwei, the princely ranks of Prince Rui and Prince Yu Duoduo, Prince Li Daishan, Prince Zheng Jirhalang, Prince Su Hooge, and Prince Keqin Yoto were posthumously restored to their original titles, and they were given joint worship in the Imperial Ancestral Temple.',
    'On xinwei, Princes Rui, Yu, Li, Zheng, Su, and Keqin regained their titles and Ancestral Temple worship.',
  ],
  s0198: [
    'On day jimao, the Emperor visited the Western Tombs and remitted three-tenths of this year\'s quota taxes for places along the route.',
    'On jimao, Hongli visited the Western Tombs and cut route taxes by three-tenths.',
  ],
  s0199: [
    'On day guiwei, the Emperor visited Tailing and Tai Dongling.',
    'On guiwei, Hongli visited Tailing and Tai Dongling.',
  ],
  s0200: [
    'On day jiashen, the Emperor visited Tai Dongling to perform the first-anniversary rites.',
    'On jiashen, Hongli performed the first-anniversary rites at Tai Dongling.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b02.mjs <translation.json>'
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

