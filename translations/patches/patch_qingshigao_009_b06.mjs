#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Winter, tenth month, day gengxu: thirteen sons of Han ministers including Jiang Pu were granted licentiate status.',
    'In the tenth month, on gengxu day, thirteen sons of Han officials including Jiang Pu received licentiate degrees.',
  ],
  s0502: [
    'On day jiazi, an edict said: "In the Jiangnan investigation of arrears in land tax, repeated imperial instructions have been very clear, emphasizing distinction between official embezzlement and popular arrears.',
    'On jiazi day, an edict said the Jiangnan tax-arrears inquiry must distinguish official embezzlement from popular debt.',
  ],
  s0503: [
    'Yet the officers sent to handle it did poorly: some treated items the gentry collected on behalf of the tax as official embezzlement; some proposed that items clerks had embezzled be assessed on wealthy households.',
    'Commissioners mishandled the case, calling gentry collections official theft or shifting clerk embezzlement onto rich households.',
  ],
  s0504: [
    'Some even added surcharge fees to collected tax grain; some even broadly collected items that had been suspended from collection.',
    'Some added illegal surcharges or collected levies that had been suspended.',
  ],
  s0505: [
    'A policy meant to benefit the people was turned into harassment of the people—is this not the fault of those in charge of the matter?',
    'A relief policy became harassment—is that not the fault of those in charge?',
  ],
  s0506: [
    'Strictly follow the previous instructions and handle it properly.',
    'They were ordered to follow prior instructions and handle matters properly.',
  ],
  s0507: [
    'If these abuses occur again, punish severely according to law.',
    'Repeat offenders were to be punished severely.',
  ],
  s0508: [
    '" On day wuchen, because civil and military officials within and outside the court were diligent and careful in their posts, Prince Yi\'s ceremonial regalia was increased twofold; Zhang Tingyu was made Lesser Guardian; Jiang Tingxi Grand Mentor of the Heir Apparent; Li Tingyi Junior Grand Mentor of the Heir Apparent; Fu Erdan, Yue Zhongqi, and E\'ertai all Lesser Guardian; Tian Wenjing Grand Mentor of the Heir Apparent; Li Wei, Zhalang\'a, and Xibo all Junior Grand Mentor of the Heir Apparent.',
    'On wuchen day, diligent ministers were rewarded: Prince Yi\'s regalia doubled; Zhang Tingyu, Jiang Tingxi, Li Tingyi, Fu Erdan, Yue Zhongqi, E\'ertai, Tian Wenjing, Li Wei, Zhalang\'a, and Xibo received honors.',
  ],
  s0509: [
    'Eleventh month, day jiaxu: one million taels from the treasury were issued to repair stone works at Gaojia Embankment.',
    'In the eleventh month, one million taels were issued to repair Gaojia Embankment stone works.',
  ],
  s0510: [
    'Ma Huibo was appointed Minister of War while remaining at the army front.',
    'Ma Huibo became Minister of War but remained with the army.',
  ],
  s0511: [
    'On day wuyin, more than five hundred thousand taels in embezzled silver owed by descendants of meritorious officials including Shi Shihua was pardoned; the shortfall was made up from the inner treasury; crimes of exile, supervised recovery, confiscation of property, and wives and children entering official status were all remitted.',
    'On wuyin day, over five hundred thousand taels owed by meritorious families including Shi Shihua were forgiven from the inner treasury, with related punishments remitted.',
  ],
  s0512: [
    'On day wuzi, executions for the year were suspended.',
    'On wuzi day, executions for the year were halted.',
  ],
  s0513: [
    'Twelfth month, day wushen: the Guangdong Commissioner for Inspecting Customs and Reforming Customs was established, as was the Zhaogao educational commissioner.',
    'In the twelfth month, Guangdong inspection and Zhaogao educational posts were established.',
  ],
  s0514: [
    'On day wuchen, joint worship was performed at the Imperial Ancestral Temple.',
    'On wuchen day, joint ancestral worship was held.',
  ],
  s0515: [
    'This year, disaster land tax for twenty-four prefectures and counties in Jiangnan, Jiangxi, Zhejiang, Fujian, Hunan, Yunnan, Gansu, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas across Jiangnan, Jiangxi, Zhejiang, Fujian, Hunan, Yunnan, Gansu, and elsewhere.',
  ],
  s0516: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0517: [
    'Eighth year, spring, first month, day dingchou: Shang Chongkuo, inner palace grand minister in charge of mausoleum affairs and palace guards, was made Minister of the Five Boards at Mukden.',
    'In the eighth year, on dingchou day in the first month, Shang Chongkuo became Mukden Minister of the Five Boards.',
  ],
  s0518: [
    'Nasutu was made Mukden general, Changde Ningguta general, and Zhuo\'erhai Heilongjiang general.',
    'Nasutu, Changde, and Zhuo\'erhai were appointed frontier generals.',
  ],
  s0519: [
    'Qing Fu was made Han Banner commander-in-chief.',
    'Qing Fu became Han Banner commander-in-chief.',
  ],
  s0520: [
    'On day jiawu, auspicious fungus grew at Jing Mausoleum.',
    'On jiawu day, auspicious fungus appeared at Jing Mausoleum.',
  ],
  s0521: [
    'On day dingyou, Tang Zhiyu memorialized that on the twentieth of the first month a phoenix had been seen at Fangshan.',
    'On dingyou day, Tang Zhiyu reported a phoenix sighting at Fangshan on the twentieth of the first month.',
  ],
  s0522: [
    'Edict received: "This matter was already reported by Prefect Sun Jiagan.',
    'The Emperor said Sun Jiagan had already reported the matter.',
  ],
  s0523: [
    'Shang Chongkuo also reported that in Mount Tiantai a divine bird was seen, five or six chi tall, with feathers like brocade, surrounded by a flock of birds, flying northward.',
    'Shang Chongkuo also reported a divine bird on Mount Tiantai, five or six chi tall, with brocade-like plumage, flying north amid other birds.',
  ],
  s0524: [
    'Our person\'s virtue is thin, insufficient to bring about such a supreme omen."',
    'The Emperor said his virtue was too slight to merit such an omen."',
  ],
  s0525: [
    'Six thousand taels of stipend silver for the Imperial Academy were issued, to be annual.',
    'Six thousand taels of Imperial Academy stipend silver were granted annually.',
  ],
  s0526: [
    'Second month, day gengzi, first day of the month: the title for ennobling maternal relatives was fixed as Bearer of Imperial Grace Duke.',
    'On the second month\'s new moon of gengzi day, the maternal-kin title Bearer of Imperial Grace Duke was fixed.',
  ],
  s0527: [
    'On day jiachen, the Emperor attended the Classics lecture.',
    'On jiachen day, the Emperor held the Classics lecture.',
  ],
  s0528: [
    'On day jiyou, Lai Shi was restored to ducal rank.',
    'On jiyou day, Lai Shi was restored to duke.',
  ],
  s0529: [
    'On day dingsi, Prince Cheng Yin Zhi was restored to Prince Cheng, Prince Yu Yin Xuan to Prince Yu, Beizi Yin Shen to beile rank, Imperial younger brothers Yin Xi and Yin Hu to beizi rank, and Yin Qi to Defender Duke of the State.',
    'On dingsi day, Yin Zhi, Yin Xuan, Yin Shen, Yin Xi, Yin Hu, and Yin Qi received restored ranks.',
  ],
  s0530: [
    'On day wuchen, Nan Zhang sent envoys with tribute, requesting a fixed tribute schedule.',
    'On wuchen day, Nan Zhang sent tribute envoys seeking a fixed schedule.',
  ],
  s0531: [
    'The Emperor graciously replied and ordered tribute once every five years.',
    'The Emperor graciously ordered tribute every five years.',
  ],
  s0532: [
    'Third month, day dinghai: Zhang Tingyu and Jiang Tingxi were ordered to manage the affairs of the Three Treasuries.',
    'On dinghai day, Zhang Tingyu and Jiang Tingxi were put in charge of the Three Treasuries.',
  ],
  s0533: [
    'On day jiawu, Shi Yizhi was made acting governor-general of Jiangnan and Jiangxi; the Sacred Ancestor\'s personally compiled Commentary on the Book of Documents was promulgated, with an imperial preface by the Emperor.',
    'On jiawu day, Shi Yizhi became acting Jiangnan governor-general and the Sacred Ancestor\'s Book of Documents commentary was issued with an imperial preface.',
  ],
  s0534: [
    'Summer, fourth month: Prince Chun Yin You died, posthumous title Du; his son Hong Jue inherited as commandery prince.',
    'In the fourth month, Prince Chun Yin You died with posthumous name Du; his son Hong Jue inherited.',
  ],
  s0535: [
    'On day guimao, Zhou Shu and three hundred ninety-nine others were granted jinshi and other ranks with distinctions.',
    'On guimao day, Zhou Shu and 399 others received jinshi degrees.',
  ],
  s0536: [
    'On day dingwei, Grand Secretary was fixed as positive first rank and Censor-in-chief of the Left as secondary first rank.',
    'On dingwei day, Grand Secretary and Left Censor-in-chief ranks were fixed.',
  ],
  s0537: [
    'On day guihai, Ji Zengyun was made acting Jiangnan Canal governor-general; Tian Wenjing concurrently managed the Eastern Canal governor-generalship.',
    'On guihai day, Ji Zengyun became acting canal governor-general and Tian Wenjing also managed the Eastern Canal.',
  ],
  s0538: [
    'Fifth month, day xinwei: Prince Yi Yinxiang died; the Emperor grieved deeply, personally attended the funeral, posthumous title Xian, and granted sacrifice in the Imperial Ancestral Temple.',
    'In the fifth month, Prince Yi Yinxiang died; the Emperor mourned him, attended the funeral, gave posthumous name Xian, and granted ancestral sacrifice.',
  ],
  s0539: [
    'On day dingchou, Galdan Tseren sent envoys to pay respects.',
    'On dingchou day, Galdan Tseren sent envoys.',
  ],
  s0540: [
    'The campaign schedule was temporarily deferred, and Fu Erdan and Yue Zhongqi were summoned to the capital.',
    'The campaign was deferred and Fu Erdan and Yue Zhongqi were recalled to Beijing.',
  ],
  s0541: [
    'Gao Qizhuo was moved to governor-general of Jiangnan and Jiangxi; Liu Shiming was made Fujian governor-general.',
    'Gao Qizhuo became Jiangnan governor-general and Liu Shiming Fujian governor-general.',
  ],
  s0542: [
    'On day renwu, the Emperor again attended Prince Yi the Worthy\'s funeral.',
    'On renwu day, the Emperor again attended Prince Yi\'s funeral.',
  ],
  s0543: [
    'An edict said: "The names of all Our brothers were granted by Our late father.',
    'An edict said all imperial brothers\' names had been granted by the late emperor.',
  ],
  s0544: [
    'At the beginning of Our reign Yin Zhi petitioned by precedent to change the upper character; this was reported to the Empress Dowager and reluctantly carried out.',
    'At the start of the reign Yin Zhi had changed one character in his name after reporting to the Empress Dowager.',
  ],
  s0545: [
    'Now that Prince Yi has passed away, his princely name is still written with the original character, to record Our longing."',
    'After Prince Yi\'s death, his original name character was kept in writing to show the Emperor\'s longing."',
  ],
  s0546: [
    '" On day xinmao: earlier, Prince Cheng Yin Zhi had attended Prince Yi the Worthy\'s funeral, arriving late and leaving early, showing no grief on his face; the Imperial Clan Court was ordered to deliberate punishment.',
    'On xinmao day, Yin Zhi was reported for arriving late, leaving early, and showing no grief at Prince Yi\'s funeral.',
  ],
  s0547: [
    'At this time the deliberation was submitted, requesting stripping of title and execution according to law.',
    'The clan court recommended stripping his title and executing him.',
  ],
  s0548: [
    'Edict received: he was stripped of title and placed under confinement.',
    'The Emperor stripped his title and placed him under confinement.',
  ],
  s0549: [
    'On day guisi, Yue Chaolong was made Huguang provincial military commissioner.',
    'On guisi day, Yue Chaolong became Huguang provincial commander.',
  ],
  s0550: [
    'On day yiwei, Beizi Yin Xi was promoted to beile, Prince of the Principality of Li Hong Xi to prince, and Duke Hong Jing to beizi.',
    'On yiwei day, Yin Xi, Hong Xi, and Hong Jing were promoted in rank.',
  ],
  s0551: [
    'Yin Shan was restored to commandery prince.',
    'Yin Shan was restored to commandery prince.',
  ],
  s0552: [
    'Sixth month, day wuxu, first day of the month: there was a solar eclipse.',
    'On the sixth month\'s new moon of wuxu day, there was a solar eclipse.',
  ],
  s0553: [
    'On day renyin, Prince Yi the Worthy was granted the eight characters "Loyal, respectful, sincere, upright, diligent, careful, incorrupt, and enlightened" added to his posthumous title.',
    'On renyin day, eight honorific characters were added to Prince Yi\'s posthumous title.',
  ],
  s0554: [
    'On day wushen, E\'ertai memorialized that raw Miao of Liping and Duyun submitted.',
    'On wushen day, E\'ertai reported submission of raw Miao in Liping and Duyun.',
  ],
  s0555: [
    'On day guihai, Ma Huibo was dismissed; Tang Zhiyu was made Minister of War, and Shi Yizhi Censor-in-chief of the Left.',
    'On guihai day, Ma Huibo was dismissed; Tang Zhiyu became Minister of War and Shi Yizhi Left Censor-in-chief.',
  ],
  s0556: [
    'Autumn, seventh month, day wuyin: construction of the Shrine of Worthy Officials was ordered.',
    'In the seventh month, on wuyin day, the Shrine of Worthy Officials was ordered built.',
  ],
  s0557: [
    'On day renchen, officials were dispatched to relieve the people in Jiangnan, Hunan, Zhili, Shandong, and elsewhere stricken by flooding.',
    'On renchen day, officials were sent to relieve flood victims in Jiangnan, Hunan, Zhili, Shandong, and elsewhere.',
  ],
  s0558: [
    'On day guisi, it was ordered that in precedence rankings provincial governors rank above vice commanders-in-chief.',
    'On guisi day, provincial governors were ranked above vice commanders-in-chief.',
  ],
  s0559: [
    'Eighth month, day bingwu: because Shandong flooding was especially severe, all grain transport tax for the whole province was specially exempted.',
    'In the eighth month, all Shandong grain transport tax was exempted because flooding was severe.',
  ],
  s0560: [
    'On day xinhai, Prince Yi the Worthy\'s son Hong Xiao was ordered to inherit as prince, and Hong Jiao separately enfeoffed as commandery prince, both hereditary.',
    'On xinhai day, Hong Xiao inherited Prince Yi\'s princedom and Hong Jiao was enfeoffed as commandery prince, both hereditarily.',
  ],
  s0561: [
    'On day yimao, there was an earthquake in the capital.',
    'On yimao day, the capital was shaken by earthquake.',
  ],
  s0562: [
    'Prince Kang Chong\'an was removed from managing the Imperial Clan Court; Prince Yu Guanglu was put in charge of the Imperial Clan Court.',
    'Prince Kang Chong\'an was removed from the clan court and Prince Yu Guanglu put in charge.',
  ],
  s0563: [
    'Ninth month, day dingmao: because of the capital earthquake, civil officials were granted half salary and each Banner three thousand taels of silver.',
    'In the ninth month, after the earthquake officials received half salary and each Banner three thousand taels.',
  ],
  s0564: [
    'On day yiyou, Gao Qizhuo was sent to survey auspicious ground at Taiping Valley and granted a hereditary office.',
    'On yiyou day, Gao Qizhuo surveyed Taiping Valley and received a hereditary office.',
  ],
  s0565: [
    'On day xinmao, E\'ertai memorialized that Mengnong Bai clan, Menglian, and Nuzi submitted.',
    'On xinmao day, E\'ertai reported submission of Mengnong Bai, Menglian, and Nuzi.',
  ],
  s0566: [
    'Winter, tenth month, day gengzi: hats and peaks of all officials were re-fixed—first rank coral peak, second rank carved coral peak, third rank blue transparent glass peak, fourth rank lapis lazuli peak, fifth rank crystal peak, sixth rank giant clam peak, seventh rank plain gold peak, eighth rank carved gold peak, ninth rank and below carved silver peak.',
    'In the tenth month, official hat insignia were re-fixed by rank from coral to silver.',
  ],
  s0567: [
    'On day xinhai, Zhabina was ordered made vice general and sent to the northern route army camp.',
    'On xinhai day, Zhabina was sent as vice general to the northern army.',
  ],
  s0568: [
    'On day renzi, E\'ertai memorialized recovery of Wumeng prefectural city; the Miao bandits were pacified.',
    'On renzi day, E\'ertai reported recovery of Wumeng and pacification of the Miao.',
  ],
  s0569: [
    'On day jiayin, because Ma\'ersai, Zhang Tingyu, and Jiang Tingxi had long served in confidential posts, each was granted a hereditary earldom.',
    'On jiayin day, Ma\'ersai, Zhang Tingyu, and Jiang Tingxi each received a hereditary earldom.',
  ],
  s0570: [
    'When the Confucian temple at Qufu was completed, the fifth imperial son Hong Zhou and Prince Chun Hong Jue were ordered to go announce the sacrifice.',
    'When Qufu\'s Confucian temple was completed, Hong Zhou and Hong Jue were sent to announce the sacrifice.',
  ],
  s0571: [
    'Eleventh month, day jisi: officiating officials at the Confucian temple were established.',
    'In the eleventh month, Confucian temple officiants were established.',
  ],
  s0572: [
    'On day yihai, the provinces were ordered not to demand excessive landing tax and deed tax for surplus.',
    'On yihai day, provinces were forbidden to exact excessive landing and deed taxes.',
  ],
  s0573: [
    'On day bingzi, an imperial proclamation sternly admonished Han Banner descendants of meritorious families who had offended, including Fan Shiyi, Shang Chongkuo, and Li Yongsheng.',
    'On bingzi day, the court admonished offending Han Banner descendants of meritorious houses, including Fan Shiyi, Shang Chongkuo, and Li Yongsheng.',
  ],
  s0574: [
    'On day wuzi, the provinces were ordered that when sending silver to the ministry they retain half for public use.',
    'On wuzi day, provinces were told to keep half of silver sent to the ministry for public use.',
  ],
  s0575: [
    'Twelfth month, day dingyou: Fu Erdan and Yue Zhongqi were each ordered to return to their armies.',
    'In the twelfth month, Fu Erdan and Yue Zhongqi were ordered back to their armies.',
  ],
  s0576: [
    'On day yimao, Ji Chengbin memorialized that Dzungar bandits attacked Kuoshetu pass; Regional Commander Fan Ting defeated them.',
    'On yimao day, Ji Chengbin reported Dzungar attack on Kuoshetu pass and Fan Ting\'s victory.',
  ],
  s0577: [
    'Fan Ting was granted a hereditary office and ten thousand taels of silver.',
    'Fan Ting received a hereditary office and ten thousand taels of silver.',
  ],
  s0578: [
    'Zhang Chaozuo and others were also granted hereditary offices and silver in varying amounts.',
    'Zhang Chaozuo and others also received hereditary offices and graded silver rewards.',
  ],
  s0579: [
    'This year, disaster land tax for eighteen prefectures, counties, and garrisons in Zhili, Jiangnan, Shanxi, Hunan, Guizhou, and other provinces was remitted.',
    'Tax relief was granted for eighteen disaster districts in Zhili, Jiangnan, Shanxi, Hunan, Guizhou, and elsewhere.',
  ],
  s0580: [
    'Grain transport tax for Zhili, Jiangnan, Shandong, and Henan was also remitted in varying degrees.',
    'Grain transport tax was also remitted in Zhili, Jiangnan, Shandong, and Henan.',
  ],
  s0581: [
    'Korea, Annan, and Nan Zhang sent tribute.',
    'Korea, Annan, and Nan Zhang paid tribute.',
  ],
  s0582: [
    'Ninth year, spring, first month, day gengyin: two hundred thousand shi of relief grain from Yangzhou Salt Charity Granary were ordered disbursed to add relief for last year\'s flood victims in Pi and Su.',
    'In the ninth year, two hundred thousand shi from Yangzhou Salt Charity Granary were sent to relieve last year\'s flood victims in Pi and Su.',
  ],
  s0583: [
    'Second month, day yiwei: Prince Yu Yin Xuan died, posthumous title Ke; his son Hong Qing inherited as commandery prince.',
    'In the second month, Prince Yu Yin Xuan died with posthumous name Ke; his son Hong Qing inherited.',
  ],
  s0584: [
    'Fifteen thousand shi of Tongzhou grain, two hundred thousand shi of Fengtian grain, and fifty thousand shi of purchased grain were allocated and transported to Shandong for relief stores.',
    'Tongzhou, Fengtian, and purchased grain totaling 265,000 shi were sent to Shandong for relief.',
  ],
  s0585: [
    'On day wuxu, Chang Ben was ordered made Zhen\'an general, leading Gansu and Liangzhou troops to garrison Anxi.',
    'On wuxu day, Chang Ben became Zhen\'an general and led Gansu and Liangzhou troops to Anxi.',
  ],
  s0586: [
    'On day wuwu, because Tian Wenjing was old and ill, Vice Minister Wang Guodong was ordered to proceed to Henan to relieve flood victims.',
    'On wuwu day, Wang Guodong was sent to Henan to relieve floods because Tian Wenjing was old and ill.',
  ],
  s0587: [
    'On day renxu, a Sichuan governor-generalship was specially established; Huang Tinggui was appointed to fill the post.',
    'On renxu day, a Sichuan governor-general was established and Huang Tinggui appointed.',
  ],
  s0588: [
    'Third month, day yiyou: Santai was made Minister of Rites, and E\'erqi Censor-in-chief of the Left.',
    'On yiyou day, Santai became Minister of Rites and E\'erqi Left Censor-in-chief.',
  ],
  s0589: [
    'On day wuzi, two thousand Banner retainers were ordered selected under Yilibu\'s command as western route vice general.',
    'On wuzi day, two thousand Banner retainers under Yilibu were made western route vice general.',
  ],
  s0590: [
    'Summer, fourth month, day gengzi: Shi Yizhi and Hang Yilu were ordered to proceed to Shaanxi to proclaim and guide.',
    'In the fourth month, Shi Yizhi and Hang Yilu were sent to Shaanxi to proclaim and guide.',
  ],
  s0591: [
    'On day bingchen, E\'ermida memorialized that raw Li of Qiongshan and Danzhou submitted.',
    'On bingchen day, E\'ermida reported submission of raw Li in Qiongshan and Danzhou.',
  ],
  s0592: [
    'Fifth month, day jiazi: Shi Yunzhuo was made western route vice general.',
    'In the fifth month, Shi Yunzhuo became western route vice general.',
  ],
  s0593: [
    'Zhao Zhiyuan and Ma Long were ordered to supervise transport of western route provisions.',
    'Zhao Zhiyuan and Ma Long were ordered to supervise western route grain transport.',
  ],
  s0594: [
    'Sixth month, day bingwu: Fu Erdan memorialized that the Dzungars invaded the Zha\'ersai River; he led troops to meet the attack.',
    'In the sixth month, Fu Erdan reported a Dzungar invasion of the Zha\'ersai River and led troops to meet it.',
  ],
  s0595: [
    'On day xinhai, Yue Zhongqi memorialized that the Dzungars invaded Turfan; he led troops to the rescue; the bandits fled; troops were left garrisoned.',
    'On xinhai day, Yue Zhongqi drove off Dzungar invaders of Turfan and left a garrison.',
  ],
  s0596: [
    'On day jiayin, the Emperor prayed for rain; that day it rained.',
    'On jiayin day, the Emperor prayed for rain and rain fell the same day.',
  ],
  s0597: [
    'Autumn, seventh month, day dingmao: E\'ertai was summoned to the capital.',
    'In the seventh month, on dingmao day, E\'ertai was summoned to Beijing.',
  ],
  s0598: [
    'Gao Qizhuo was made Yunnan-Guizhou governor-general, and Yin Jishan governor-general of Jiangnan and Jiangxi.',
    'Gao Qizhuo became Yunnan-Guizhou governor-general and Yin Jishan Jiangnan governor-general.',
  ],
  s0599: [
    'On day jisi, Huang Tinggui memorialized that Zhandui Tibetan bandits rebelled; troops were dispatched and the disturbance was suppressed.',
    'On jisi day, Huang Tinggui suppressed a Zhandui Tibetan revolt.',
  ],
  s0600: [
    'On day guiyou, Fu Erdan memorialized that the government troops\' advance against the Dzungars was unfavorable; they retreated to Khobdo.',
    'On guiyou day, Fu Erdan reported an unsuccessful advance against the Dzungars and retreat to Khobdo.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b06.mjs <translation.json>'
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
