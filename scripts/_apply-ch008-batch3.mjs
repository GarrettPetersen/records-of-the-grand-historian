#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.008, Xuanzong — Kaiyuan 4 through 8) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0202: {
    literal: 'First month, guiwei, fourth year of Kaiyuan, spring: Palace Wardrobe Attendant Changsun Xin, relying on being the empress\'s sister\'s husband, and his brother-in-law Yang Xianyu beat and struck Censor-in-Chief Li Jie; the Emperor ordered Xin beheaded in the court hall before the hundred officials as amends.',
    idiomatic: 'In the first spring month, on guiwei of Kaiyuan 4, wardrobe attendant Changsun Xin—backed by his tie to the empress\'s sister—and Yang Xianyu, his brother-in-law, assaulted censor-in-chief Li Jie; the emperor ordered Xin executed in open court to appease the bureaucracy.',
  },
  s0203: {
    literal: 'Because it was the month of yang harmony when executions were forbidden, he repeatedly memorialized in plea; he was then ordered beaten to death instead.',
    idiomatic: 'Memorialists pleaded that yang-harmony month forbade killing; after repeated appeals the emperor commuted the sentence to beating Xin to death.',
  },
  s0204: {
    literal: 'On dinghai, Prince of Song Chengqing and Prince of Shen Chengyi, because the character cheng violated Empress Zhaocheng\'s posthumous title, Chengqing was renamed Xian and Chengyi was renamed Suo.',
    idiomatic: 'On dinghai Princes Song and Shen, whose names bore the tabooed character cheng in Empress Zhaocheng\'s temple name, were renamed Xian and Suo.',
  },
  s0205: {
    literal: 'Minister of Punishments and Duke of Zhongshan Li Yi died.',
    idiomatic: 'Li Yi, minister of punishments and Duke of Zhongshan, died.',
  },
  s0206: {
    literal: 'Second month, bingchen: visited the hot springs at Xinfeng.',
    idiomatic: 'In the second month, on bingchen, he went to the Xinfeng hot springs.',
  },
  s0207: {
    literal: 'On dingmao, returned from the hot springs.',
    idiomatic: 'On dingmao he returned from the springs.',
  },
  s0208: {
    literal: 'Because Guanzhong suffered drought, envoys were sent to pray for rain at Mount Li; timely soaking rain followed.',
    idiomatic: 'With Guanzhong in drought he sent envoys to pray for rain at Mount Li, and a timely downpour answered.',
  },
  s0209: {
    literal: 'He ordered sacrifices with the lesser victim and forbade cutting firewood there.',
    idiomatic: 'He ordered lesser-victim offerings and banned woodcutting on the mountain.',
  },
  s0210: {
    literal: 'Summer, sixth month, gengyin: the moon was totally eclipsed.',
    idiomatic: 'In the sixth summer month, on gengyin, the moon suffered a total eclipse.',
  },
  s0211: {
    literal: 'On guihai the Retired Emperor died in the Hall of Hundred Blessings.',
    idiomatic: 'On guihai the retired emperor Ruizong died in the Hall of Hundred Blessings.',
  },
  s0212: {
    literal: 'On xinwei great winds in the capital and Hua and Shan prefectures uprooted trees.',
    idiomatic: 'On xinwei gales in the capital and in Hua and Shan prefectures tore trees up by the roots.',
  },
  s0213: {
    literal: 'On guiyou the Turk qaghan Mochuo was killed by the Nine Surnames Bayegu; his head was sent to the capital.',
    idiomatic: 'On guiyou the Turk qaghan Mochuo was slain by the Bayegu of the Nine Surnames, and his head was sent to court.',
  },
  s0214: {
    literal: 'Mochuo\'s nephew Xiaosha succeeded as qaghan.',
    idiomatic: 'Mochuo\'s nephew Xiaosha succeeded him as qaghan.',
  },
  s0215: {
    literal: 'That summer locusts swarmed in Shandong, Henan, and Hebei; envoys were sent to capture and bury them by region.',
    idiomatic: 'That summer locusts ravaged Shandong, Henan, and Hebei; the court sent envoys to gather and bury them province by province.',
  },
  s0216: {
    literal: 'The Huihe, Tongluo, Xi, Bayegu, and Pugu tribes came to submit and were settled north of Dawu Army.',
    idiomatic: 'The Huihe, Tongluo, Xi, Bayegu, and Pugu submitted and were resettled north of Dawu Army.',
  },
  s0217: {
    literal: 'Autumn, seventh month, bingshen: Xi and Ya prefectures were split to establish Li Prefecture.',
    idiomatic: 'In the seventh month, on bingshen, Li Prefecture was carved from Xi and Ya.',
  },
  s0218: {
    literal: 'Winter, tenth month, guichou: Minister of Revenue and newly appointed Tutor of the Heir Apparent Bi Gou died.',
    idiomatic: 'On guichou of the tenth winter month Bi Gou, minister of revenue and newly named tutor of the heir apparent, died.',
  },
  s0219: {
    literal: 'On gengwu the Great Sagely Pure Emperor Ruizong was buried at Qiao Mausoleum.',
    idiomatic: 'On gengwu Ruizong, the Great Sagely Pure Emperor, was interred at Qiao Mausoleum.',
  },
  s0220: {
    literal: 'Tong Prefecture\'s Pucheng County was made Fengxian County and placed under Jingzhao.',
    idiomatic: 'Pucheng in Tong Prefecture became Fengxian County under Jingzhao.',
  },
  s0221: {
    literal: 'Eleventh month, dinghai: Zhongzong\'s spirit tablet was moved to the western shrine.',
    idiomatic: 'On dinghai of the eleventh month Zhongzong\'s spirit tablet was moved to the western shrine.',
  },
  s0222: {
    literal: 'On jiawu Left Assistant Director of the Department of State Affairs Yuan Qianyao became Vice Director of the Yellow Gate and co-equal Ziwei Huangmen Chief Minister.',
    idiomatic: 'On jiawu Yuan Qianyao, left assistant director of state affairs, entered the council as vice director of the Yellow Gate and co-equal chief minister.',
  },
  s0223: {
    literal: 'On xinchou Yellow Gate Supervisor and concurrent Minister of Personnel Lu Huaishen died.',
    idiomatic: 'On xinchou Lu Huaishen, yellow gate supervisor and minister of personnel, died.',
  },
  s0224: {
    literal: 'Twelfth month, yimao: visited the hot springs at Xinfeng.',
    idiomatic: 'On yimao of the twelfth month he went to the Xinfeng hot springs.',
  },
  s0225: {
    literal: 'That night fire destroyed the sleeping hall at Ding Mausoleum.',
    idiomatic: 'That night fire consumed the sleeping hall at Ding Mausoleum.',
  },
  s0226: {
    literal: 'On yichou, returned from the hot springs.',
    idiomatic: 'On yichou he returned from the springs.',
  },
  s0227: {
    literal: 'Minister and Duke of Guangping Song Jing became Minister of Personnel and concurrent Yellow Gate Supervisor; Ziwei Vice Director and Duke of Xu Suo Ting became co-equal Ziwei Huangmen Chief Minister.',
    idiomatic: 'Song Jing, Duke of Guangping, became minister of personnel and yellow gate supervisor; Suo Ting, Duke of Xu, joined the council as co-equal chief minister.',
  },
  s0228: {
    literal: 'Minister of War and concurrent Ziwei Director and Duke of Liang Yao Chong became Grand Mentor with the honorific Pillar of State; Vice Director of the Yellow Gate and Baron of Anyang Yuan Qianyao became acting Jingzhao intendant, all ceasing to manage government.',
    idiomatic: 'Yao Chong, minister of war and ziwei director, was made pillar of state; Yuan Qianyao left the council to serve as acting Jingzhao intendant.',
  },
  s0229: {
    literal: 'The ten-circuit investigation commissioners were abolished.',
    idiomatic: 'He abolished the ten-circuit investigation commissioners.',
  },
  s0230: {
    literal: 'Fifth year of Kaiyuan, spring, first month, renyin new moon: because of mourning regulations the Emperor did not receive court congratulations.',
    idiomatic: 'On the renyin new moon of the first spring month of Kaiyuan 5 he declined court congratulations while in mourning.',
  },
  s0231: {
    literal: 'On guimao at the yin hour the Ancestral Temple buildings collapsed; the spirit tablets were moved to the Hall of Supreme Pole; the Emperor wore plain robes and avoided the main hall, suspending court for five days and personally offering sacrifice each day.',
    idiomatic: 'At the yin hour on guimao the ancestral temple collapsed; spirit tablets were moved to the Hall of Supreme Pole; the emperor wore mourning, avoided the main hall, halted court five days, and sacrificed in person daily.',
  },
  s0232: {
    literal: 'On xinhai, proceeded to the eastern capital.',
    idiomatic: 'On xinhai he went to the eastern capital.',
  },
  s0233: {
    literal: 'On wuchen dusk mist sealed the four quarters.',
    idiomatic: 'On wuchen dusk mist walled in the capital on every side.',
  },
  s0234: {
    literal: 'Second month, jiaxu: returned from the eastern capital and proclaimed a great amnesty throughout the realm; only treason and great sedition were excluded, all else pardoned.',
    idiomatic: 'On jiaxu of the second month he returned from Luoyang and proclaimed a general amnesty—treason alone excepted.',
  },
  s0235: {
    literal: 'The people of Henan were granted tax relief for one year; in Henan and Hebei where there had been floods and locusts, this year\'s land tax was not levied.',
    idiomatic: 'Henan was granted a year\'s tax relief; flood- and locust-stricken parts of Henan and Hebei owed no land tax that year.',
  },
  s0236: {
    literal: 'Descendants of meritorious ministers since Wude and Zhenguan who held no office were sought out and reported;',
    idiomatic: 'Descendants of Wude and Zhenguan meritocrats without posts were sought and reported to the throne;',
  },
  s0237: {
    literal: 'those of lofty reclusion who lived in seclusion and would not serve were to be recommended by name by each prefectural governor.',
    idiomatic: 'recluses of high character who refused office were to be nominated by name by their prefects.',
  },
  s0238: {
    literal: 'Third month, gengxu: at Liucheng the former Yingzhou protectorate was restored.',
    idiomatic: 'On gengxu of the third month the Yingzhou protectorate was re-established at Liucheng.',
  },
  s0239: {
    literal: 'On dingsi the daughter of Xin Jingchu was enfeoffed Princess of Guo\'an and married to the Xi chieftain, Grand Prince of Raole Da Gu.',
    idiomatic: 'On dingsi Xin Jingchu\'s daughter was created Princess of Guo\'an and married to the Xi chieftain Da Gu, Grand Prince of Raole.',
  },
  s0240: {
    literal: 'Summer, fourth month, jichou: the Emperor\'s ninth son Siyi died and was posthumously enfeoffed Prince of Xia with the posthumous title Mournful.',
    idiomatic: 'On jichou of the fourth summer month his ninth son Siyi died and was posthumously created Prince of Xia, posthumous name Mournful.',
  },
  s0241: {
    literal: 'On jiawu the altar where Wu Zetian received the Luo chart and its stele inscription, and the Temple of the Manifest Sage first built when Tang Tongtai forged the auspicious stone inscription, were ordered destroyed at once.',
    idiomatic: 'On jiawu he ordered demolished the altar and stele of Wu Zetian\'s Luo reception and the Manifest Sage temple Tang Tongtai had raised on a forged stone omen.',
  },
  s0242: {
    literal: 'Sixth month, renwu: in Gong County torrential rain lasted a month; mountains and rivers overflowed, destroying more than seven hundred houses in the city and suburbs; seventy-two people died.',
    idiomatic: 'On renwu of the sixth month a month of rain in Gong County sent rivers over their banks, wrecking seven hundred homes and killing seventy-two.',
  },
  s0243: {
    literal: 'On the same day in Sishui nearly two hundred riverside households were swept away.',
    idiomatic: 'The same day Sishui lost nearly two hundred households along the river.',
  },
  s0244: {
    literal: 'Autumn, seventh month, jiazi, edict: "In antiquity those who held the imperial net and grasped the great image—did they not look up to Heaven\'s Way and comply with the human pole, at times changing and adapting with the seasons, adding and subtracting to complete their tasks?',
    idiomatic: 'On jiazi of the seventh month an edict declared: "Those who in old times held the imperial net and grasped the great image looked up to Heaven\'s Way and down to the human pole—now changing with the seasons, now adding or subtracting to finish the work.',
  },
  s0245: {
    literal: 'When the Hall of Circles was first established, the Hall of Measures used mats for measure.',
    idiomatic: 'When the Hall of Circles was first built, the Hall of Measures counted its span in mats.',
  },
  s0246: {
    literal: 'With these they worshipped the spirits—thus manifesting filial virtue;',
    idiomatic: 'With them they worshipped the spirits and made filial virtue shine;',
  },
  s0247: {
    literal: 'with these they dispensed government—this was called viewing the first of the month; such is how former kings thickened human relations and moved Heaven and earth.',
    idiomatic: 'with them they governed—this was "viewing the new moon"; so former kings deepened human ties and stirred Heaven and earth.',
  },
  s0248: {
    literal: 'When lesser yang has its place, the supreme god rejoices; thus the spirits value not being profaned and ritual flourishes in utmost reverence.',
    idiomatic: 'When lesser yang holds its station the supreme god is pleased; spirits hate profanation, and ritual reaches its fullness in awe.',
  },
  s0249: {
    literal: 'Now the Bright Hall leans upon the palace quarters; compared with austere worship it lacks solemn respect—if it is not law and pattern, what will guide things?',
    idiomatic: 'Today\'s Bright Hall huddles against the inner palace; beside strict rites it seems slack—without true pattern, what can order the realm?',
  },
  s0250: {
    literal: 'Therefore ritual officials, academicians, and grandees broadly debated; revering antiquity, they should keep the form of the open-air bedchamber and abolish the name Biyong.',
    idiomatic: 'Ritualists, doctors, and ministers debated at length; honoring antiquity, they urged the open-air bedchamber form and an end to the name Biyong.',
  },
  s0251: {
    literal: 'It may be renamed Qianyuan Hall; whenever the Emperor holds court he shall follow the etiquette of the main hall.',
    idiomatic: 'Let it be renamed Qianyuan Hall, and whenever the emperor holds court let him follow main-hall rites.',
  },
  s0252: {
    literal: '"',
    idiomatic: 'Thus ran the edict.',
  },
  s0253: {
    literal: 'Ninth month, renyin: Ziwei Directorate was restored as the Department of State Affairs, Yellow Gate as the Chancellery, and Yellow Gate Supervisor as Palace Attendant.',
    idiomatic: 'On renyin of the ninth month Ziwei was restored as the Secretariat, the Yellow Gate as the Chancellery, and its supervisor as palace attendant.',
  },
  s0254: {
    literal: 'Winter, tenth month, bingzi: repair of the capital Ancestral Temple was completed.',
    idiomatic: 'On bingzi of the tenth winter month repair of the capital ancestral temple was finished.',
  },
  s0255: {
    literal: 'On dingchou an edict stated that the former Prince of Yue Zhen had died not for his crime; Zhen\'s grandson Lin of the former Prince of Xu was enfeoffed as titular Prince of Yue to continue the line.',
    idiomatic: 'On dingchou an edict held that Prince of Yue Zhen had been wrongly killed; his grandson Lin was created titular Prince of Yue to continue the house.',
  },
  s0256: {
    literal: 'On wuyin the spirit tablets were enshrined in the Ancestral Temple.',
    idiomatic: 'On wuyin the spirit tablets were installed in the ancestral temple.',
  },
  s0257: {
    literal: 'Eleventh month, jihai: the Khitan chieftain Li Shihuo, Grand Prince of Songmo, came to court; an imperial daughter was made Princess of Yongle and given to him in marriage.',
    idiomatic: 'On jihai of the eleventh month the Khitan chieftain Li Shihuo, Grand Prince of Songmo, came to court and received Princess Yongle in marriage.',
  },
  s0258: {
    literal: 'Grand Mentor and concurrent Dengzhou prefect Prince of Shen Suo was made concurrent Guo prefect.',
    idiomatic: 'Suo, prince of Shen, grand mentor and Dengzhou prefect, was given concurrent command of Guo prefecture.',
  },
  s0259: {
    literal: 'Sixth year of Kaiyuan, spring, first month, bingchen new moon: because the great mourning period had not ended, court congratulations were not received.',
    idiomatic: 'On the bingchen new moon of Kaiyuan 6 he again declined congratulations while mourning was incomplete.',
  },
  s0260: {
    literal: 'On xinyou bad coin was forbidden throughout the realm; good coin of two zhu and four fen weight and above was to circulate; unusable coin was to be destroyed and recast.',
    idiomatic: 'On xinyou he banned debased coin empire-wide and enforced good coin of at least two zhu four fen; the rest was melted down.',
  },
  s0261: {
    literal: 'Director of Palace Construction Wei Cou memorialized requesting that the spirit tablet of the Mournful and Filial Emperor be moved and a separate Yizong shrine established.',
    idiomatic: 'Wei Cou, director of palace construction, asked to move the Mournful and Filial Emperor\'s tablet and build a separate Yizong shrine.',
  },
  s0262: {
    literal: 'Junior Tutor and concurrent Xuzhou prefect Prince of Qi Fan was made concurrent Zhengzhou prefect.',
    idiomatic: 'Fan, prince of Qi and junior tutor, was given concurrent Zhengzhou.',
  },
  s0263: {
    literal: 'Second month, jiaxu: with ritual gifts the recluse of Mount Song Lu Hong was summoned.',
    idiomatic: 'On jiaxu of the second month Lu Hong, hermit of Mount Song, was summoned with ritual gifts.',
  },
  s0264: {
    literal: 'Summer, fifth month, yiwei: the Mournful and Filial Empress was enshrined at Gong Mausoleum.',
    idiomatic: 'On yiwei of the fifth summer month the Mournful and Filial Empress was installed at Gong Mausoleum.',
  },
  s0265: {
    literal: 'The Khitan Grand Prince of Songmo Li Shihuo died.',
    idiomatic: 'Li Shihuo, Khitan Grand Prince of Songmo, died.',
  },
  s0266: {
    literal: 'Sixth month, jiashen: the Chan River rose in flood and destroyed houses; more than a thousand people drowned.',
    idiomatic: 'On jiashen of the sixth month the Chan River burst its banks, wrecking homes and drowning more than a thousand.',
  },
  s0267: {
    literal: 'On yiyou an edict ordered the late Attendant-in-Chief Huan Yanfan Jinghui, late Director of the Secretariat and concurrent Minister of Personnel Zhang Jianzhi, late Specially Advanced Cui Xuanwei, and late Director of the Secretariat Yuan Shuoji to share sacrifice in Zhongzong\'s temple court; the late Minister of Works Su Gui and late Left Chancellor and Junior Tutor Liu Youqiu to share sacrifice in Ruizong\'s temple court.',
    idiomatic: 'On yiyou an edict enshrined Huan Yanfan, Zhang Jianzhi, Cui Xuanwei, and Yuan Shuoji with Zhongzong; Su Gui and Liu Youqiu with Ruizong.',
  },
  s0268: {
    literal: 'Autumn, seventh month, jiwei: Director of the Palace Library Ma Huaisu died.',
    idiomatic: 'On jiwei of the seventh month Ma Huaisu, director of the palace library, died.',
  },
  s0269: {
    literal: 'Ninth month, yiwei: Minister of Works Liu Zhirou was sent with staff of authority to comfort Henan circuit.',
    idiomatic: 'On yiwei of the ninth month Liu Zhirou, minister of works, was dispatched to comfort Henan.',
  },
  s0270: {
    literal: 'Winter, tenth month, bingshen: the imperial carriage returned to the capital.',
    idiomatic: 'On bingshen of the tenth winter month the emperor returned to Chang\'an.',
  },
  s0271: {
    literal: 'Eleventh month, xinmao: returned from the eastern capital.',
    idiomatic: 'On xinmao he came back from Luoyang.',
  },
  s0272: {
    literal: 'On bingchen he personally visited the Ancestral Temple; returning he held court at Chengtian Gate and issued an edict: "Among collateral descendants of the three ancestors above the Original Emperor in the seven temples who have lost official rank, each branch shall receive one fifth-rank capital appointment.',
    idiomatic: 'On bingchen he sacrificed at the ancestral temple, then held court at Chengtian Gate and decreed: "Collateral lines of the three ancestors above the Original Emperor who have fallen from office shall each receive one fifth-rank capital post.',
  },
  s0273: {
    literal: 'Civil and military officials of third rank and above who have temples shall each be granted thirty bolts of goods to prepare sacrificial robes and vessels.',
    idiomatic: 'Third-rank officials and above with family temples shall receive thirty bolts of silk for robes and ritual vessels.',
  },
  s0274: {
    literal: '" Civil and military officials were rewarded in varying degrees.',
    idiomatic: 'The edict closed; civil and military officials were rewarded according to rank.',
  },
  s0275: {
    literal: 'On yisi the eight seals transmitting the realm were again styled treasures; the Seal Officer was renamed Treasure Officer.',
    idiomatic: 'On yisi the eight dynastic seals were again called treasures and the seal office renamed the treasure office.',
  },
  s0276: {
    literal: 'Twelfth month: Pillar of State and concurrent Zezhou prefect Prince of Song Xian became Jing prefect; Grand Mentor and concurrent Guo prefect Prince of Shen Suo became Jiang prefect; Junior Tutor and concurrent Zhengzhou prefect Prince of Qi Fan became Qi prefect; Junior Guardian and concurrent Weizhou prefect Prince of Xue Ye became Guo prefect.',
    idiomatic: 'In the twelfth month princes Xian, Suo, Fan, and Ye were rotated among Jing, Jiang, Qi, and Guo prefectures.',
  },
  s0277: {
    literal: 'Seventh year of Kaiyuan, spring, first month: Tibet sent envoys with tribute.',
    idiomatic: 'In the first spring month of Kaiyuan 7 Tibet sent tribute envoys.',
  },
  s0278: {
    literal: 'Third month, dingyou: Left Martial Guard Grand General and Duke of Huo Wang Maoqi was made specially advanced.',
    idiomatic: 'On dingyou of the third month Wang Maoqi, left martial guard grand general and Duke of Huo, was made specially advanced.',
  },
  s0279: {
    literal: 'Bohai Mohe Grand Prince Da Zuerong died; his son Wuyi succeeded.',
    idiomatic: 'Da Zuerong, Bohai Mohe grand prince, died; his son Wuyi succeeded.',
  },
  s0280: {
    literal: 'Summer, fourth month, guiyou: Pillar of State Wang Renjiao died.',
    idiomatic: 'On guiyou of the fourth summer month Wang Renjiao, pillar of state, died.',
  },
  s0281: {
    literal: 'Fifth month, jichou new moon: the sun was eclipsed.',
    idiomatic: 'On the jichou new moon of the fifth month the sun was eclipsed.',
  },
  s0282: {
    literal: 'Autumn, seventh month, bingchen, edict: because drought had long persisted, the Emperor personally reviewed prisoners and pardoned many.',
    idiomatic: 'On bingchen of the seventh month, drought lingering, he personally reviewed prisoners and pardoned many.',
  },
  s0283: {
    literal: 'Each prefecture was to have its governor and magistrate dispose of matters according to circumstances.',
    idiomatic: 'Prefects and magistrates were to handle local needs as they saw fit.',
  },
  s0284: {
    literal: 'Eighth month, guichou, edict: "The Duke of Zhou established rites, unaltered through the ages;',
    idiomatic: 'On guichou of the eighth month an edict declared: "The Duke of Zhou made rites that ages have not erased;',
  },
  s0285: {
    literal: 'Zixia transmitted them, received within the Confucian gate.',
    idiomatic: 'Zixia handed them down within Confucius\'s school.',
  },
  s0286: {
    literal: 'Down to the various schools, some altered the precedents.',
    idiomatic: 'Later schools sometimes changed the precedents.',
  },
  s0287: {
    literal: 'Rather than revise them, it is better to honor antiquity.',
    idiomatic: 'Better to honor antiquity than to revise.',
  },
  s0288: {
    literal: 'All mourning grades shall follow the old texts.',
    idiomatic: 'Every grade of mourning shall follow the ancient statutes.',
  },
  s0289: {
    literal: '"',
    idiomatic: 'Thus ran the edict.',
  },
  s0290: {
    literal: 'Ninth month, jiazi: Zhaowen Hall was restored as Hongwen Hall.',
    idiomatic: 'On jiazi of the ninth month Zhaowen Hall was restored as Hongwen Hall.',
  },
  s0291: {
    literal: 'Prince of Song Xian was transferred in enfeoffment to Prince of Ning.',
    idiomatic: 'Prince Xian of Song was re-enfeoffed Prince of Ning.',
  },
  s0292: {
    literal: 'Winter, tenth month: at the Laiting county seat in the eastern capital the Yizong shrine was established.',
    idiomatic: 'In the tenth winter month the Yizong shrine was set up at Laiting in Luoyang.',
  },
  s0293: {
    literal: 'On xinmao, visited the hot springs at Xinfeng.',
    idiomatic: 'On xinmao he went to the Xinfeng hot springs.',
  },
  s0294: {
    literal: 'On guimao, returned from the hot springs.',
    idiomatic: 'On guimao he returned from the springs.',
  },
  s0295: {
    literal: 'On wuyin the crown prince went to the Directorate of Education to perform the cishi rite; attending officials and students received gifts in varying degrees.',
    idiomatic: 'On wuyin the crown prince performed the cishi rite at the Directorate of Education; officials and students received graded gifts.',
  },
  s0296: {
    literal: 'Twelfth month, bingxu: collation officer posts were established at Hongwen and Chongwen halls.',
    idiomatic: 'On bingxu of the twelfth month collation officers were appointed at Hongwen and Chongwen halls.',
  },
  s0297: {
    literal: 'Eighth year of Kaiyuan, spring, first month, jiazi new moon: the crown prince received the capping ceremony.',
    idiomatic: 'On the jiazi new moon of Kaiyuan 8 the crown prince was capped.',
  },
  s0298: {
    literal: 'On yichou the crown prince visited the Ancestral Temple.',
    idiomatic: 'On yichou the crown prince sacrificed at the ancestral temple.',
  },
  s0299: {
    literal: 'On bingyin he assembled the hundred officials in the Hall of Supreme Pole and granted gifts in varying degrees.',
    idiomatic: 'On bingyin he gathered officials in the Hall of Supreme Pole and gave graded gifts.',
  },
  s0300: {
    literal: 'On renshen Right Regular Attendant and Duke of Shu Chu Yuanliang died.',
    idiomatic: 'On renshen Chu Yuanliang, right regular attendant and Duke of Shu, died.',
  },
};
const CHAPTER_PATH = 'data/jiutangshu/008.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
console.log('Applied', applied, 'translations (s0201–s0300)');
