#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Manbao memorialized that seventy-four communities of Taiwan raw tribes had submitted.',
    'Manbao reported that seventy-four Taiwan aboriginal communities had submitted.',
  ],
  s0202: [
    'On day xinyou, Nian Gengyao memorialized congratulating the conjunction of sun and moon and the alignment of five planets, writing "diligent morning and evening" as "evening vigilance, morning diligence."',
    'On xinyou day, Nian Gengyao congratulated a celestial omen but reversed the phrase "diligent morning and evening" to "evening vigilance, morning diligence."',
  ],
  s0203: [
    'An edict sharply rebuked him, saying: "Nian Gengyao is not a careless man; he plainly will not grant Us the phrase \'diligent morning and evening.\'"',
    'The Emperor rebuked him: Nian Gengyao was not careless but refused to grant him the expected phrase of diligence.',
  ],
  s0204: [
    'Then whether Nian Gengyao\'s Qinghai merit stands between Our granting and not granting remains unknown.',
    'The Emperor said Nian Gengyao\'s Qinghai achievements might no longer be recognized.',
  ],
  s0205: [
    'This is clearly disrespect; let him answer plainly in a memorial."',
    'He called the lapse clearly disrespectful and ordered a plain reply."',
  ],
  s0206: [
    '" On day yichou, rewards were recorded for the chief prince-regent Prince Yi Yinxiang—one son made commandery prince; Longkodo and Ma Qi were granted hereditary offices.',
    'On yichou day, Prince Yi Yinxiang received a commandery prince for a son; Longkodo and Ma Qi gained hereditary offices.',
  ],
  s0207: [
    'Prince Lian Yinqi was excluded and also sternly rebuked by edict.',
    'Prince Lian Yinqi was left out and sternly rebuked by edict.',
  ],
  s0208: [
    'Summer, fourth month, day jimao: Nian Gengyao was transferred to be general at Hangzhou.',
    'In the fourth month, Nian Gengyao was made general at Hangzhou.',
  ],
  s0209: [
    'Yue Zhongqi was made governor-general of Sichuan and Shaanxi.',
    'Yue Zhongqi became governor-general of Sichuan and Shaanxi.',
  ],
  s0210: [
    'Academician Zhongfubao and Vice Commander-in-chief Cha Shi were dispatched to the Zungars to fix the border.',
    'Zhongfubao and Cha Shi were sent to the Zungars to delimit the frontier.',
  ],
  s0211: [
    'Dongjina was made general at Jiangning.',
    'Dongjina became general at Jiangning.',
  ],
  s0212: [
    'On day xinmao, Tian Congdian was made Grand Secretary.',
    'On xinmao day, Tian Congdian became Grand Secretary.',
  ],
  s0213: [
    'Fifth month, day guihai: Left Censor-in-chief Yin Tai was made Vice Minister of Rites at Mukden, concurrently administering the Fengtian prefect.',
    'In the fifth month, Yin Tai became Mukden Vice Minister of Rites and Fengtian prefect.',
  ],
  s0214: [
    'Sixth month, day guiyou: an edict stripped Nian Gengyao\'s sons Nian Fu and Nian Xing, and Longkodo\'s son Yuzhu, of office.',
    'In the sixth month, Nian Fu, Nian Xing, and Yuzhu were all dismissed from office.',
  ],
  s0215: [
    'On day yihai, sons of hereditary offices in the Upper Three Banners and of "storm-the-wall" champions, aged fourteen to under twenty, were selected for audience and appointment.',
    'On yihai day, banner sons aged fourteen to nineteen were selected for appointment.',
  ],
  s0216: [
    'Nian Gengyao was stripped of Grand Tutor rank; soon afterward his rank as duke of the first class was also removed.',
    'Nian Gengyao lost Grand Tutor rank and soon his first-class dukedom.',
  ],
  s0217: [
    'Autumn, seventh month, day dingwei: Longkodo was stripped of Grand Tutor rank.',
    'In the seventh month, Longkodo lost Grand Tutor rank.',
  ],
  s0218: [
    'On day renxu, Grand Secretary Bai Huang was dismissed; Gao Qiwei was made Grand Secretary and Zhang Tingyu acting Grand Secretary.',
    'On renxu day, Bai Huang was dismissed; Gao Qiwei and Zhang Tingyu received Grand Secretary posts.',
  ],
  s0219: [
    'Longkodo was ordered to go to Alashan Mountain to repair the wall.',
    'Longkodo was sent to repair the wall at Alashan Mountain.',
  ],
  s0220: [
    'On day renxu, Hangzhou general Nian Gengyao was reduced to a supernumerary bannerman.',
    'On renxu day, Nian Gengyao was demoted to a supernumerary bannerman.',
  ],
  s0221: [
    'On day guihai, Prince Yintang was guilty and his title was removed.',
    'On guihai day, Prince Yintang was stripped of his title for his crimes.',
  ],
  s0222: [
    'Eighth month, day xinwei: Li Weijun was arrested and tried for siding with Nian Gengyao; Li Fu was made governor-general of Zhili.',
    'In the eighth month, Li Weijun was tried for the Nian faction; Li Fu became Zhili governor-general.',
  ],
  s0223: [
    'On day renchen, the Emperor took up residence at the Old Summer Palace.',
    'On renchen day, the Emperor stayed at the Old Summer Palace.',
  ],
  s0224: [
    'Prince Yi Yinxiang\'s salary was increased, and Prince Guo Yinzhi received an enlarged guard.',
    'Prince Yi Yinxiang received a salary increase; Prince Guo Yinzhi received more guards.',
  ],
  s0225: [
    'Ninth month, day jiayin: Zhu Shi was made Grand Secretary; Cai Bing was changed to Minister of Personnel while still overseeing the Ministry of War and the Censorate.',
    'In the ninth month, Zhu Shi became Grand Secretary; Cai Bing became Minister of Personnel with war and censorate duties.',
  ],
  s0226: [
    'On day bingchen, Nian Gengyao was arrested and sent to the Ministry of Punishments.',
    'On bingchen day, Nian Gengyao was arrested and handed to the Ministry of Punishments.',
  ],
  s0227: [
    'Winter, tenth month, day wuchen: where a provincial governor did not share a city with the governor-general, he was empowered to impeach subordinates and decide cases himself.',
    'In the tenth month, governors not resident with governors-general were given independent impeachment and trial powers.',
  ],
  s0228: [
    'On day bingzi, Hongzhi, son of Prince Heng Yinqi, was enfeoffed as Defender of the State.',
    'On bingzi day, Prince Heng\'s son Hongzhi was made Defender of the State.',
  ],
  s0229: [
    'On day gengyin, Yang Mingshi was made governor-general of Yunnan and Guizhou with charge of the governorship; Ortai was made governor of Yunnan with charge of the governor-generalship.',
    'On gengyin day, Yang Mingshi and Ortai exchanged Yunnan-Guizhou governor and governor-general duties.',
  ],
  s0230: [
    'Eleventh month, day gengzi: the Emperor visited the imperial tombs.',
    'In the eleventh month, the Emperor visited the tombs.',
  ],
  s0231: [
    'On day wushen, he returned to the palace.',
    'On wushen day, the Emperor returned to the palace.',
  ],
  s0232: [
    'On day guihai, Ga\'erbi was made general at Mukden.',
    'On guihai day, Ga\'erbi became general at Mukden.',
  ],
  s0233: [
    'Twelfth month, day dingmao: Prince of the Commandery Yinti was reduced to beile.',
    'In the twelfth month, the fourteenth prince Yinti was demoted from commandery prince to beile.',
  ],
  s0234: [
    'On day jiaxu, court ministers deliberated on Nian Gengyao\'s ninety-two counts of crime.',
    'On jiaxu day, ministers reviewed ninety-two charges against Nian Gengyao.',
  ],
  s0235: [
    'The imperial rescript read: "Nian Gengyao is granted death; his son Nian Fu is to be beheaded at once; the remaining sons are sent to military exile; his father and elder brothers are exempted from guilt by association.',
    'Nian Gengyao was ordered to die; Nian Fu was beheaded at once; other sons were exiled; kin were spared association guilt.',
  ],
  s0236: [
    '" On day xinsi, Wang Jingqi was executed for slander.',
    'Wang Jingqi was executed for slander on xinsi day."',
  ],
  s0237: [
    'On day guiwei, Aisin Gioro Bayande was made commander of the Tianjin naval camp.',
    'On guiwei day, Bayande became commander of the Tianjin naval camp.',
  ],
  s0238: [
    'On day renchen, the seasonal offering was made at the Imperial Ancestral Temple.',
    'On renchen day, the court performed the seasonal temple offering.',
  ],
  s0239: [
    'This year, disaster land tax for twenty-seven prefectures and counties in Zhili, Jiangsu, Henan, Zhejiang, Guangdong, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in twenty-seven districts across several provinces.',
  ],
  s0240: [
    'Korea, Ryukyu, and Western countries sent tribute.',
    'Korea, Ryukyu, and Western states paid tribute.',
  ],
  s0241: [
    'Fourth year, spring, first month, day jiawu: the Emperor took the throne in the Hall of Supreme Harmony to receive congratulations.',
    'In the fourth year, on the first month, the Emperor received New Year congratulations at the Hall of Supreme Harmony.',
  ],
  s0242: [
    'Foreign princes attending the New Year audience were rewarded with silver and coins according to former-court precedent.',
    'Visiting foreign princes received silver and coins by precedent.',
  ],
  s0243: [
    'On day dingyou, an edict proclaimed the crimes of the ninth imperial brother Yintang.',
    'On dingyou day, the court proclaimed Prince Yintang\'s crimes.',
  ],
  s0244: [
    'On day wuxu, ministers were assembled and an edict proclaimed the crimes of the eighth imperial brother Yinqi: his princedom was changed to "commoner prince"; the yellow belt was removed and he was struck from the clan register; his consort of the Uya clan was removed as princess consort and sent back to her mother\'s house; the commoner princedom was again removed; he was confined in the Imperial Clan Court; he was ordered renamed Aqina, and his son Hongwang was named Pusabao.',
    'On wuxu day, Yinqi was degraded, stripped of rank and consort, confined, and renamed Aqina; his son was renamed Pusabao.',
  ],
  s0245: [
    'On day jiayin, Longkodo was removed from office but still ordered to go to Russia to negotiate the border.',
    'On jiayin day, Longkodo lost office but was still sent to negotiate the Russian border.',
  ],
  s0246: [
    'On day yimao, the late Minister Gu Badai was posthumously made Grand Tutor with the posthumous title Wenduan—he had been the Emperor\'s tutor in reading.',
    'On yimao day, the Emperor\'s former tutor Gu Badai was posthumously honored as Grand Tutor Wenduan.',
  ],
  s0247: [
    'Second month, day jiazi: Sun Zhu was made Minister of Personnel, concurrently overseeing the Ministry of War.',
    'In the second month, Sun Zhu became Minister of Personnel with war duties.',
  ],
  s0248: [
    'Fahai was made Minister of War and Fumin Left Censor-in-chief.',
    'Fahai became Minister of War; Fumin became Left Censor-in-chief.',
  ],
  s0249: [
    'Princes Lubin and Defender of the State Yongqian were both stripped of rank for equivocating in the Yinqi case; soon Lubin was restored as Defender of the State.',
    'Lubin and Yongqian lost rank for hedging in Yinqi\'s trial; Lubin was soon restored.',
  ],
  s0250: [
    'Grand Secretary Zhu Shi was in mourning for his mother; four thousand taels of silver were granted to arrange the funeral.',
    'Zhu Shi mourned his mother and received four thousand taels for the funeral.',
  ],
  s0251: [
    'On day yiyou, Prince Jian Yarjiang\'a was stripped of rank; his younger brother Shenbaozhu succeeded to the title.',
    'On yiyou day, Prince Jian Yarjiang\'a was demoted; Shenbaozhu inherited the title.',
  ],
  s0252: [
    'On day gengyin, Zhang Tingyu was made Grand Secretary, Jiang Tingxi Minister of Revenue, and Shen Mude general of the Right Guard.',
    'On gengyin day, Zhang Tingyu, Jiang Tingxi, and Shen Mude received new posts.',
  ],
  s0253: [
    'Third month, day dingchou: Ding Shou was ordered to station troops at Tes to guard against Tsewang Arabtan.',
    'In the third month, Ding Shou was posted at Tes against Tsewang Arabtan.',
  ],
  s0254: [
    'On day renxu, the exposé case of Lecturer Qian Mingshi presenting poems to Nian Gengyao came to light; his title was removed; the Emperor personally wrote the four characters "enemy of moral teaching" and hung them at his gate, and ordered civil officials to compose essays and poems denouncing him.',
    'On renxu day, Qian Mingshi lost rank for flattering Nian Gengyao in verse; the Emperor labeled him an enemy of moral teaching.',
  ],
  s0255: [
    'Summer, fourth month, day jimao: Fan Shiyi was made governor-general of the Two Jiangs.',
    'In the fourth month, Fan Shiyi became governor-general of the Two Jiangs.',
  ],
  s0256: [
    'Fifth month, day guisi: the fourteenth imperial brother Yinti and his son Baiqi were confined beside the Hall of Imperial Longevity; his son Baidun was made Defender of the State.',
    'In the fifth month, Yinti and Baiqi were confined; Baidun was made Defender of the State.',
  ],
  s0257: [
    'Erlendai and Aersong\'a were executed at their places of banishment.',
    'Erlendai and Aersong\'a were put to death in exile.',
  ],
  s0258: [
    'On day yisi, Yintang was renamed Sesheihei and detained at Baoding.',
    'On yisi day, Yintang was renamed Sesheihei and held at Baoding.',
  ],
  s0259: [
    'On day jiyou, Prince Shuncheng Xibao was ordered to receive a prince\'s stipend.',
    'On jiyou day, Prince Shuncheng Xibao was granted a prince\'s salary.',
  ],
  s0260: [
    'The fifteenth imperial brother Yinzhuan was enfeoffed as beile, and the twentieth imperial brother Yinqi as beizi.',
    'The fifteenth and twentieth imperial brothers received beile and beizi ranks.',
  ],
  s0261: [
    'Sixth month, day guihai: Defender of the State Basai was made General Who Quells Martial Ardor to guard the frontier.',
    'In the sixth month, Basai was made frontier general.',
  ],
  s0262: [
    'On day yichou, Zhabina was made Minister of War.',
    'On yichou day, Zhabina became Minister of War.',
  ],
  s0263: [
    'Autumn, seventh month, day guisi: the thirteen censors Tao Yi and others at the front were released and sent home.',
    'In the seventh month, thirteen front-line censors including Tao Yi were released.',
  ],
  s0264: [
    'On day xinhai, Cai Bing was ordered to oversee the commandery prince regiments exclusively.',
    'On xinhai day, Cai Bing was put in sole charge of the commandery prince banners.',
  ],
  s0265: [
    'Zhabina and Yang Mingshi were made Ministers of Personnel.',
    'Zhabina and Yang Mingshi became Ministers of Personnel.',
  ],
  s0266: [
    'Prince Ping Narsu was guilty and stripped of rank; his son Fupeng succeeded to the title.',
    'Prince Ping Narsu lost his title; his son Fupeng inherited it.',
  ],
  s0267: [
    'Eighth month, day bingyin: autumn executions were suspended for this year.',
    'In the eighth month, autumn executions were halted for the year.',
  ],
  s0268: [
    'On day dinghai, Li Fu memorialized that Sesheihei had died at Baoding.',
    'On dinghai day, Li Fu reported Sesheihei\'s death at Baoding.',
  ],
  s0269: [
    'Ninth month, day renchen: Yizhaoxiong was made governor-general of Huguang; soon Fumin was ordered to replace him.',
    'In the ninth month, Yizhaoxiong became Huguang governor-general; Fumin soon replaced him.',
  ],
  s0270: [
    'Cai Liang was made general at Fuzhou.',
    'Cai Liang became general at Fuzhou.',
  ],
  s0271: [
    'Prince Manzhuhu was reduced to Defender of the State and removed from his company captaincy.',
    'Prince Manzhuhu was demoted and stripped of his company captaincy.',
  ],
  s0272: [
    'On day dingyou, Defender of the State Ablan was stripped of rank for irregular thanksgiving audience and removed from his company captaincy.',
    'On dingyou day, Ablan lost rank for improper audience thanks and lost his captaincy.',
  ],
  s0273: [
    'On day wuxu, the Double Ninth: the Emperor presided in the Palace of Heavenly Purity, bestowing a banquet on court ministers and composing a linked-verse poem in the Bolang style.',
    'On wuxu day, the Double Ninth, the Emperor feasted ministers and composed linked verse.',
  ],
  s0274: [
    'On day jihai, Xibao memorialized that Aqina had died in confinement.',
    'On jihai day, Xibao reported Aqina\'s death in custody.',
  ],
  s0275: [
    'On day guichou, Grand Secretary Zhu Shi was recalled to duty and walked in the Grand Secretariat.',
    'On guichou day, Zhu Shi returned from mourning to the Grand Secretariat.',
  ],
  s0276: [
    'On day yimao, Vice Minister Cha Siting was imprisoned for slander.',
    'On yimao day, Cha Siting was jailed for slander.',
  ],
  s0277: [
    'Winter, tenth month, day jiazi: the Zhejiang commissioner for observing customs and reforming morals was established.',
    'In the tenth month, Zhejiang gained a commissioner to observe customs and reform morals.',
  ],
  s0278: [
    'It was ordered that provincial examination graduates who passed on the Five Classics via the supplementary list, and those who passed the supplementary list twice, be recognized as licentiates.',
    'Supplementary-list Five Classics passers and double supplementary passers were recognized as licentiates.',
  ],
  s0279: [
    'On day wuchen, an edict told court ministers: "Our late father ruled for more than sixty years, personally practicing moderation and thrift.',
    'On wuchen day, the Emperor told ministers how Kangxi had ruled frugally for sixty years.',
  ],
  s0280: [
    'Palace carpets were used thirty or forty years and were still neat.',
    'Palace carpets lasted decades and remained intact.',
  ],
  s0281: [
    'Garments and equipage were all plain quality, with very few rarities.',
    'Imperial goods were plain, with few luxuries.',
  ],
  s0282: [
    'Yesterday, inspecting old furnishings and bringing back items from the Mountain Estate for Summer Retreat, Our longing for his great virtue truly has no end.',
    'Inspecting old furnishings from the summer retreat, the Emperor said his longing for Kangxi was endless.',
  ],
  s0283: [
    'We therefore write this expressly to instruct Our sons and descendants."',
    'He wrote this to instruct his descendants."',
  ],
  s0284: [
    '" On day xinsi, Prince Yu Guangning was stripped of rank and permanently confined in the Imperial Clan Court.',
    'Prince Yu Guangning lost rank and was permanently confined on xinsi day."',
  ],
  s0285: [
    'On day jiashen, because the Puxiong Miao territory bordered Sichuan and Yunnan, the Sichuan-Shaanxi governor-general was ordered to move his headquarters to Chengdu.',
    'On jiashen day, the Sichuan-Shaanxi governor-general was ordered to Chengdu for the Puxiong Miao frontier.',
  ],
  s0286: [
    'Ortai was made governor-general of Yunnan and Guizhou, and Xiande governor of Hubei.',
    'Ortai became Yunnan-Guizhou governor-general; Xiande became Hubei governor.',
  ],
  s0287: [
    'On day bingxu, Ryukyu thanked the court for a bestowed plaque and presented local products.',
    'On bingxu day, Ryukyu thanked the court for a plaque and sent tribute.',
  ],
  s0288: [
    'Eleventh month, day jihai: Grand Secretary Gao Qiwei was dismissed.',
    'In the eleventh month, Grand Secretary Gao Qiwei was dismissed.',
  ],
  s0289: [
    'On day renzi, long service on the Funing garrison was rewarded with enfeoffment as marquis of the first class.',
    'On renzi day, Funing garrison service was rewarded with a first-class marquisate.',
  ],
  s0290: [
    'On day yimao, an edict said Zhejiang scholarly habits were corrupt and skilled at smuggling crib notes; its provincial and metropolitan examinations were suspended.',
    'On yimao day, Zhejiang examinations were suspended for corrupt scholarly habits and cheating.',
  ],
  s0291: [
    'Twelfth month, day gengshen: princes and ministers asked that the wives and children of Aqina and Sesheihei be executed according to law.',
    'In the twelfth month, ministers sought execution of Aqina and Sesheihei\'s families.',
  ],
  s0292: [
    'The imperial instruction said: "Although Aqina and Sesheihei committed great treason, their acts of rebellion were not yet manifest; guilt by association is waived.',
    'The Emperor ruled that although Aqina and Sesheihei were traitors, kin were spared because rebellion was not fully proven.',
  ],
  s0293: [
    'Sesheihei\'s wife is sent back to her mother\'s house and confined.',
    'Sesheihei\'s wife was sent to her mother\'s house under confinement.',
  ],
  s0294: [
    'The remaining dependents are handed to the Imperial Household Department for maintenance.',
    'Other dependents were placed under the Imperial Household Department for support.',
  ],
  s0295: [
    '" On day xinyou, an order was issued that Henan, Shaanxi, and Sichuan should apportion the poll-tax silver into the land tax and collect them together.',
    'Poll-tax silver was merged into land tax collection in Henan, Shaanxi, and Sichuan."',
  ],
  s0296: [
    'On day yichou, Censor Xie Jishi memorialized impeaching Tian Wenjing on ten counts; an edict stripped him of office and sent him to exile.',
    'On yichou day, Xie Jishi impeached Tian Wenjing on ten counts; Tian was dismissed and exiled.',
  ],
  s0297: [
    'On day renshen, Ortai memorialized that twenty-one stockades of Zhong Miao who had submitted after suppression were pacified, and more than thirty thousand mu of cultivated and waste land were identified.',
    'On renshen day, Ortai reported twenty-one pacified Zhong Miao stockades and over thirty thousand mu of land surveyed.',
  ],
  s0298: [
    'On day renwu, Li Fu was made Right Vice Minister of Works; Yizhaoxiong was made governor-general of Zhili with Liu Shishu as assistant; Mao Wenquan was made general at Jingkou.',
    'On renwu day, Li Fu, Yizhaoxiong, Liu Shishu, and Mao Wenquan received new appointments.',
  ],
  s0299: [
    'On day bingxu, the seasonal offering was made at the Imperial Ancestral Temple.',
    'On bingxu day, the court performed the seasonal temple offering.',
  ],
  s0300: [
    'This year, disaster land tax for sixty-three prefectures, counties, and garrisons in Zhili, Shandong, Anhui, Jiangxi, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in sixty-three districts across several provinces.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b03.mjs <translation.json>'
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
