#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Emperor Wenzong, entitled Xietian Yiyun Zhizhong Chui Mo Maode Zhenwu Shengxiao Yuan Gong Duanren Kuanmin Xian, taboo name Yizhu, was the fourth son of the Xuanzong Emperor. His mother was Empress Xiaoquancheng of the Niuhulu clan. He was born on the ninth day of the sixth month in the eleventh year of Daoguang.',
    'Wenzong Emperor Yizhu, fourth son of Daoguang, was born on the sixth month\'s ninth day, Daoguang 11; his mother was Empress Xiaoquancheng Niuhulu.',
  ],
  s0002: [
    'In the twenty-sixth year, using the household succession method for establishing an heir, his name was written, sealed, and stored away.',
    'In year 26 his name was sealed in the heir-selection vault.',
  ],
  s0003: [
    'In the thirtieth year, first month, day dingwei, the Xuanzong Emperor was ill; he summoned ministers and showed them the vermillion brush, establishing him as Crown Prince.',
    'In month 1, dingwei, Daoguang 30, a dying Daoguang named Yizhu crown prince before his ministers.',
  ],
  s0004: [
    'The Xuanzong Emperor died; on day jiwei the Emperor ascended the throne, issued an amnesty edict, and designated the next year as the first year of Xianfeng.',
    'After Daoguang died, on jiwei Yizhu took the throne, granted amnesty, and made the next year Xianfeng 1.',
  ],
  s0005: [
    'The Imperial Noble Consort was honored as Imperial Noble Consort Xiaoci.',
    'An imperial noble consort was raised to Imperial Noble Consort Xiaoci.',
  ],
  s0006: [
    'Elder brothers the princes Yiwei, Yigang, and Yishi were posthumously ennobled as commandery princes.',
    'Brothers Yiwei, Yigang, and Yishi were posthumously made commandery princes.',
  ],
  s0007: [
    'Younger brother Yi Xin was made Prince Gong; Yi Yi Prince Chun of the commandery; Yi Xu Prince Zhong of the commandery; and Yi Hui Prince Fu of the commandery.',
    'Yi Xin became Prince Gong; Yi Yi, Yi Xu, and Yi Hui became commandery princes Chun, Zhong, and Fu.',
  ],
  s0008: [
    'Plain white mourning for one hundred days was fixed, and plain dress for twenty-seven months.',
    'Mourning was set at one hundred days of white and twenty-seven months of plain dress.',
  ],
  s0009: [
    'Second month, day wuchen: Left Censor-in-Chief Bai Zai and Household Administration Minister Ji Pu were ordered to build at the Western Tombs the mountain tomb for Empress Xiaohe.',
    'In month 2, wuchen, Bai Zai and Ji Pu were told to build Empress Xiaohe\'s tomb at the Western Tombs.',
  ],
  s0010: [
    'Initially in the Xuanzong Emperor\'s testamentary edict, no elevation to joint worship or enshrinement was to be done.',
    'Daoguang\'s will had barred elevating his spirit tablet for joint worship.',
  ],
  s0011: [
    'The matter was referred to the court ministers for deliberation.',
    'The court was asked to deliberate.',
  ],
  s0012: [
    'Their deliberation was submitted.',
    'Their report went up.',
  ],
  s0013: [
    'Edict: "The late Emperor was modest; we dare not follow.',
    'Edict: "The late Emperor was humble; we will not do as he refused.',
  ],
  s0014: [
    'Honoring the late Emperor\'s intent, limits should be fixed.',
    'To honor his wish, limits should be set.',
  ],
  s0015: [
    'Take the three ancestors and five forebears as the cutoff; hereafter this rite will not be performed again.',
    'Use three ancestors and five forebears as the line; never do this again.',
  ],
  s0016: [
    '" Hunan bandit Li Yuanfa rose in rebellion.',
    'Hunan bandit Li Yuanfa rebelled.',
  ],
  s0017: [
    'Edict: "Prince Qing is the Emperor\'s uncle; exempt him from the kowtow rite, showing respect for elders in kinship.',
    'Edict: "Prince Qing is the Emperor\'s uncle; spare him kowtow to honor kin elders.',
  ],
  s0018: [
    '" On day gengchen, order the coast to reorganize the naval forces and patrol diligently.',
    'On gengchen day, coastal forces were ordered to drill the navy and patrol hard.',
  ],
  s0019: [
    'On day renchen, Grand Court of Revision Director Wo Ren answered the summons with a memorial; the Emperor praised his forthright remonstrance.',
    'On renchen day, Wo Ren\'s summoned memorial won praise for blunt counsel.',
  ],
  s0020: [
    'Third month, day guisi new moon: Baochang died; Bai Zai was made Minister of War, and Hua Shana Left Censor-in-Chief.',
    'In month 3, guisi new moon, Baochang died; Bai Zai took War and Hua Shana the censorate.',
  ],
  s0021: [
    'On day renyin, Supervising Secretary Luo Dunyi answered the summons with a memorial; the Emperor replied with an excellent edict.',
    'On renyin day, Luo Dunyi\'s summoned memorial drew a warm edict reply.',
  ],
  s0022: [
    'On day guimao, Left Vice Censor-in-Chief Wen Rui memorialized on four matters, and also submitted for the record former Grand Secretary Sun Jiageng\'s "Three Lessons, One Abuse" memorial of Qianlong 1; Vice Minister of Rites Zeng Guofan memorialized on three matters of personnel employment—all were graciously accepted.',
    'On guimao day, Wen Rui urged four reforms and filed Sun Jiageng\'s Qianlong "Three Lessons, One Abuse" memorial; Zeng Guofan urged three personnel reforms—all were accepted.',
  ],
  s0023: [
    'On day xinhai, Jiangsu\'s Baimao River was dredged, and the stone dike at the river mouth was moved from Laoqiao.',
    'On xinhai day, Jiangsu dredged the Baimao River and moved the mouth dike from Laoqiao.',
  ],
  s0024: [
    'On day renxu, the Prince of Li Quanling died; his son Shiduo inherited.',
    'On renxu day, Prince of Li Quanling died and Shiduo succeeded.',
  ],
  s0025: [
    'Summer, fourth month, day yichou: Russia requested trade at Tarbaghatai; it was permitted.',
    'In summer, month 4, yichou, Russia was allowed to trade at Tarbaghatai.',
  ],
  s0026: [
    'On day jisi, Grand Secretariat Academician Che Kezhen memorialized on revering Heaven and continuing the late Emperor\'s aims, employing men and administering affairs—ten items in all; an excellent edict replied.',
    'On jisi day, Che Kezhen\'s ten-point memorial on Heaven, succession, and governance drew a warm edict.',
  ],
  s0027: [
    'On day guiyou, the Ministry of Revenue memorialized on reorganizing finances, setting forth various abuses; received decree: eradicate them in earnest.',
    'On guiyou day, Revenue exposed fiscal abuses and was told to root them out.',
  ],
  s0028: [
    'On day gengchen, English ships reached Jiangsu\'s sea mouth bearing documents; they were refused.',
    'On gengchen day, British ships at Jiangsu\'s mouth with papers were turned away.',
  ],
  s0029: [
    'On day yiyou, ships reached Tianjin.',
    'On yiyou day, the ships reached Tianjin.',
  ],
  s0030: [
    'Fifth month, day bingshen: weighed anchor and sailed south.',
    'In month 5, bingshen, the ships weighed anchor and sailed south.',
  ],
  s0031: [
    'On day dingyou, edict: "Prefects and magistrates are officials close to the people; their responsibility is exceedingly heavy.',
    'On dingyou day, edict: "County magistrates live closest to the people; their burden is immense.',
  ],
  s0032: [
    'In recent years promotion has been reckless and ranks mixed; many rely on clerks and squeeze the neighborhoods—on what can the people\'s livelihood depend?',
    'Promotions have been sloppy and clerks bleed the towns—what hope is there for commoners?',
  ],
  s0033: [
    'Governors-general and governors should examine with added care, recommend the upright and fair, root out the greedy and incompetent, so the people\'s hardships may gradually ease—to fulfill Our hope.',
    'Governors must scrutinize officials, promote the honest, purge the corrupt, and ease popular hardship as We expect.',
  ],
  s0034: [
    '" Li Yuanfa, Hunan rebel leader, was captured, sent to the capital, and executed.',
    'Hunan rebel chief Li Yuanfa was captured, sent to Beijing, and executed.',
  ],
  s0035: [
    'Edict to Zheng Zuchen: "In Guangxi society bandits rise on all sides; suppress them promptly; in memorials do not conceal or embellish.',
    'Zheng Zuchen was told: "Guangxi secret-society bandits are everywhere—strike at once and report honestly.',
  ],
  s0036: [
    '" On day xinhai, Shandong\'s Dengzhou garrison was changed to naval commander-in-chief, also commanding overland troops.',
    'On xinhai day, Shandong\'s Dengzhou post became a naval commander also over land forces.',
  ],
  s0037: [
    'On day guichou, edict for the Southeast\'s two rivers to survey and plan civilian dikes.',
    'On guichou day, the southeast\'s two rivers were ordered to survey folk dikes.',
  ],
  s0038: [
    'On day jiayin, Gu Qing was made Jilin general.',
    'On jiayin day, Gu Qing became Jilin general.',
  ],
  s0039: [
    'Sixth month, day guihai: the Yongding River overflowed.',
    'In month 6, guihai, the Yongding River burst.',
  ],
  s0040: [
    'Grand Secretary Pan Shi\'en retired; he was given full salary.',
    'Grand Secretary Pan Shi\'en retired on full pay.',
  ],
  s0041: [
    'Qi Junzao was made grand secretary; Du Shoutian associate grand secretary; Sun Ruizhen Minister of Revenue; Wang Guangyin Minister of War; and Ji Zhichang Left Censor-in-Chief.',
    'Qi Junzao became grand secretary; Du Shoutian associate; Sun Ruizhen Revenue; Wang Guangyin War; Ji Zhichang censor-in-chief.',
  ],
  s0042: [
    'On day jiaxu, Gansu Han and fan tax-assessed irregular fragmented land silver was remitted.',
    'On jiaxu day, Gansu tax on odd Han and fan plots was remitted.',
  ],
  s0043: [
    'On day jiashen, governors-general and governors were ordered to memorialize recommending and impeaching subordinates, listing facts, not empty words.',
    'On jiashen day, governors were told to praise or impeach subordinates with facts, not rhetoric.',
  ],
  s0044: [
    'That month, Hong Xiuquan of Huaxian, Guangdong, rose in revolt at Jintian, Guiping county, Guangxi.',
    'That month Hong Xiuquan of Guangdong\'s Huaxian rebelled at Jintian in Guangxi\'s Guiping.',
  ],
  s0045: [
    'Autumn, seventh month, day xinmao: order coastal governors-general and governors to plan defense of sea mouths.',
    'In autumn, month 7, xinmao, coastal governors were told to fortify every port.',
  ],
  s0046: [
    'On day bingchen, Minister Wen Qing was dismissed for having the sorcerer Xue Zhizhong treat illness.',
    'On bingchen day, Wen Qing was dismissed for hiring Xue Zhizhong to heal by sorcery.',
  ],
  s0047: [
    'Eighth month, day dingmao: Hong Xiuquan fled to Xiuren and Lipu; Zheng Zuchen was ordered to suppress him.',
    'In month 8, dingmao, Hong Xiuquan fled to Xiuren and Lipu and Zheng Zuchen was told to crush him.',
  ],
  s0048: [
    'Xiang Rong was transferred to be Guangxi commander to suppress bandits.',
    'Xiang Rong was made Guangxi commander to fight the rebels.',
  ],
  s0049: [
    'On day jiashen, edict: "In the provinces crowds gather to make trouble; serious cases pile up layer on layer—what are local officials in charge of?',
    'On jiashen day, edict: "Uprisings stack up province by province—what are local officials doing?',
  ],
  s0050: [
    'Even Henan Nian bandits form cliques and even disturb neighboring provinces, robbing openly—they should be jointly captured and the roots utterly cut.',
    'Henan Nian bands even raid neighbors—they must be hunted down to the root.',
  ],
  s0051: [
    'If frontier governors play down beforehand and conceal afterward, causing great calamity, the Emperor will punish those governors-general and governors severely.',
    'Governors who indulge then cover up and breed disaster will be punished without mercy.',
  ],
  s0052: [
    'Take heed!',
    'Take heed!',
  ],
  s0053: [
    '"',
    'So ordered.',
  ],
  s0054: [
    'Ninth month, day bingshen: because Guangxi bandit power had spread, order Hunan, Yunnan, and Guizhou troops two thousand each to suppress them, and urge gentry and people to organize militia.',
    'In month 9, bingshen, with Guangxi rebels spreading, 2,000 troops each from Hunan, Yunnan, and Guizhou were sent and gentry told to raise militia.',
  ],
  s0055: [
    'On day xinchou, Lin Zexu was ordered to be Imperial Commissioner to suppress bandits in Guangxi.',
    'On xinchou day, Lin Zexu became Imperial Commissioner for Guangxi.',
  ],
  s0056: [
    'On day jiachen, because Guangdong roving bandits made trouble, Xu Guangjin was ordered to suppress them.',
    'On jiachen day, Xu Guangjin was sent to crush Guangdong roving bandits.',
  ],
  s0057: [
    'On day bingwu, the late Emperor\'s coffin set out on the journey.',
    'On bingwu day, Daoguang\'s coffin left the palace.',
  ],
  s0058: [
    'On day xinhai, the Cheng Emperor Xuanzong was temporarily enshrined at Long\'en Hall.',
    'On xinhai day, Daoguang was temporarily enshrined at Long\'en Hall.',
  ],
  s0059: [
    'Winter, tenth month, day renwu: for covering up and brewing disaster, Zheng Zuchen was stripped of office; Lin Zexu acted as Guangxi governor.',
    'In winter, month 10, renwu, Zheng Zuchen was dismissed for concealment and Lin Zexu acted as Guangxi governor.',
  ],
  s0060: [
    'On day jiazi, the Yongding River breach closed and joined.',
    'On jiazi day, the Yongding breach was sealed.',
  ],
  s0061: [
    'On day bingxu, edict: "Grand Secretary Muzhang\'a is fawning and usurps position, drives out those unlike himself, obstructs military affairs, and cares not for the state—strip his office immediately.',
    'On bingxu day, edict: "Muzhang\'a is a sycophant who blocks the war effort—remove him at once.',
  ],
  s0062: [
    'Associate Grand Secretary Qiying is shameless and incapable—demote him to junior seventh-rank official.',
    'Associate Grand Secretary Qiying is worthless—demote him to junior seventh rank.',
  ],
  s0063: [
    'Proclaim throughout within and without.',
    'Publish this inside and outside the court.',
  ],
  s0064: [
    '" Saishang\'a was made associate grand secretary.',
    'Saishang\'a became associate grand secretary.',
  ],
  s0065: [
    'Eleventh month, day wuxu: Yi Shan was made Yili general.',
    'In month 11, wuxu, Yi Shan became Yili general.',
  ],
  s0066: [
    'On day gengzi, Imperial Commissioner Lin Zexu died on the road; Zhou Tianjue acted as Guangxi governor; former Liang-Jiang Governor-General Li Xingyuan was made Imperial Commissioner to proceed to Guangxi to suppress bandits.',
    'On gengzi day, Lin Zexu died en route; Zhou Tianjue acted at Guangxi and ex-governor Li Xingyuan was made commissioner to fight rebels.',
  ],
  s0067: [
    'On day yisi, order provincial treasuries\' accumulated miscellaneous balances applied to military needs; temporarily defer opening contributions-for-office sales.',
    'On yisi day, provincial hoards were tapped for war funds and sale of offices was paused.',
  ],
  s0068: [
    'Liu Yunke was dismissed; Yu Tai was made Min-Zhe governor-general, Cheng Yusong Hubei-Hunan governor-general, and Wu Wenrong Yunnan-Guizhou governor-general.',
    'Liu Yunke was removed; Yu Tai took Min-Zhe, Cheng Yusong Hubei-Hunan, and Wu Wenrong Yunnan-Guizhou.',
  ],
  s0069: [
    'Guangxi bandit leader Zhong Yachun was captured and executed.',
    'Guangxi rebel chief Zhong Yachun was caught and executed.',
  ],
  s0070: [
    'Twelfth month, day jisi: Empress Xiaode\'s posthumous title rites were completed; the empress\'s father Futai was posthumously ennobled as third-rank duke.',
    'In month 12, jisi, Empress Xiaode\'s posthumous rites finished and her father Futai was made a third-rank duke.',
  ],
  s0071: [
    'Yi Shan was ordered to frame Russian trade regulations and report.',
    'Yi Shan was told to draft Russian trade rules and report.',
  ],
  s0072: [
    'On day gengwu, order Jiangsu\'s four prefectures\' grain tax temporarily transported by sea.',
    'On gengwu day, grain tax from four Jiangsu prefectures was ordered moved by sea.',
  ],
  s0073: [
    'On day jiaxu, Xiang Rong suppressed bandits at Hengzhou and defeated them.',
    'On jiaxu day, Xiang Rong beat rebels at Hengzhou.',
  ],
  s0074: [
    'On day jimao, favor the families of Guangxi battle-dead Vice Commander Yiketanbu and others with hereditary posts.',
    'On jimao day, families of Yiketanbu and other Guangxi dead received hereditary ranks.',
  ],
  s0075: [
    'On day bingxu, lateral enshrinement at the Imperial Ancestral Temple.',
    'On bingxu day, the temple received a lateral enshrinement.',
  ],
  s0076: [
    'That year, disaster taxes were remitted in varying degrees for sixty-seven prefectures and counties in Zhili, Zhejiang, Hunan, and other provinces.',
    'That year sixty-seven disaster-hit districts in Zhili, Zhejiang, Hunan, and elsewhere had taxes cut.',
  ],
  s0077: [
    'Korea and Ryukyu presented tribute.',
    'Korea and Ryukyu sent tribute.',
  ],
  s0078: [
    'Xianfeng 1, year xinhai, spring, first month, day wuzi new moon: the Emperor held court at the Hall of Supreme Harmony to receive congratulations.',
    'Xianfeng 1, month 1, wuzi new moon, the Emperor received New Year homage at the Hall of Supreme Harmony.',
  ],
  s0079: [
    'Edict: direct provinces to ascertain grain tax and surcharges actually owed by the people before Daoguang 30, draw up lists, and request imperial decision.',
    'Provinces were told to list real tax arrears before Daoguang 30 and seek imperial relief.',
  ],
  s0080: [
    'Saishang\'a was ordered to be grand secretary.',
    'Saishang\'a became grand secretary.',
  ],
  s0081: [
    'On day renyin, the Emperor visited Muling and performed the first-anniversary great sacrifice.',
    'On renyin day, the Emperor mourned at Muling with the first-year great rite.',
  ],
  s0082: [
    'On day gengxu, the Emperor returned to the capital.',
    'On gengxu day, the Emperor returned to Beijing.',
  ],
  s0083: [
    'On day xinhai, edict: Hanlin and Secretariat academicians each to draft lecture texts and submit.',
    'On xinhai day, Hanlin and Secretariat scholars were told to draft lectures for the throne.',
  ],
  s0084: [
    'Supervising Secretary Su Tingkui memorialized to employ men with full sincerity and be careful at the start to plan the end.',
    'Su Tingkui urged sincere appointments and steady long-term planning.',
  ],
  s0085: [
    'The Emperor graciously accepted it.',
    'The Emperor accepted the advice.',
  ],
  s0086: [
    'Second month, day yichou: edict remitting direct provinces\' grain tax arrears already entered in memorial clearance, and Jiangsu people\'s grain transport arrears—all remitted.',
    'In month 2, yichou, cleared provincial tax arrears and Jiangsu transport debts were all forgiven.',
  ],
  s0087: [
    'Du Shoutian memorialized on four matters: restore military prestige, recruit elite troops, encourage local militia, and inspect terrain—sent to commanders at the front.',
    'Du Shoutian urged restoring discipline, recruiting elites, rallying militia, and studying terrain—memorial sent to field commanders.',
  ],
  s0088: [
    'On day gengwu, Li Xingyuan reported suppressing bandits at Jintian with victory.',
    'On gengwu day, Li Xingyuan reported victory at Jintian.',
  ],
  s0089: [
    'On day jimao, edict: "This year the season has passed the spring equinox yet cold has not lifted.',
    'On jimao day, edict: "Spring is past the equinox yet the cold will not break.',
  ],
  s0090: [
    'The Emperor reflects inward and has not moved Heaven to harmony.',
    'The Emperor blames himself for failing to move Heaven.',
  ],
  s0091: [
    'Recalling that last winter the Ministry of Rites submitted a roster of chaste women, the Grand Secretariat drafted double endorsement, and used the slip "need not confer distinction," which was sent down.',
    'He recalled last winter\'s chaste-women list that the Grand Secretariat had double-stamped and marked "no commendation."',
  ],
  s0092: [
    'These chaste women gave up life for righteousness, enough to stir a base custom and weighten the constant bonds—all chaste women including Peng and thirty-seven persons are approved for joint distinction, to comfort their chaste souls.',
    'Those women died for virtue; Peng and thirty-seven others would all be honored together to soothe their spirits.',
  ],
  s0093: [
    '" Ulan Tai, Guangzhou vice commander, was ordered to take his manufactured arms to Guangxi to suppress bandits.',
    'Ulan Tai was told to bring Guangzhou arms to Guangxi.',
  ],
  s0094: [
    'Third month, day bingshen: order Grand Secretary Saishang\'a to wear the Imperial Commissioner seal and hasten to Hunan to handle blocking defense; Commander Batuqingde and Vice Commander Da Hong\'a to accompany him.',
    'In month 3, bingshen, Saishang\'a was sent to Hunan as commissioner with Batuqingde and Da Hong\'a.',
  ],
  s0095: [
    'On day gengzi, the Emperor held an archery review at Ziguang Pavilion.',
    'On gengzi day, the Emperor reviewed archery at Ziguang Pavilion.',
  ],
  s0096: [
    'On day xinchou, at Gongchen Hall the Emperor held foot archery and reviewed ministers\' and guards\' shooting.',
    'On xinchou day, at Gongchen Hall he reviewed foot archery for ministers and guards.',
  ],
  s0097: [
    'On day jiyou, Henan Governor Pan Duo reported capturing over two hundred Nian bandits led by Yao Jingnian.',
    'On jiyou day, Pan Duo reported over 200 Nian rebels led by Yao Jingnian captured.',
  ],
  s0098: [
    'On day gengxu, order Guangdong, Hunan, and Sichuan troops to Guangxi to assist suppression.',
    'On gengxu day, troops from Guangdong, Hunan, and Sichuan were sent to aid Guangxi.',
  ],
  s0099: [
    'On day renzi, issue inner treasury silver one million taels for Guangxi military stores; issue Sichuan granary grain milled and transported to Hunan.',
    'On renzi day, one million taels from the inner treasury went to Guangxi and Sichuan grain was milled for Hunan.',
  ],
  s0100: [
    'Summer, fourth month, day wuwu: order Saishang\'a to hasten to Guangxi to take over military affairs.',
    'In summer, month 4, wuwu, Saishang\'a was rushed to Guangxi to command the war.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b01.mjs <translation.json>'
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
