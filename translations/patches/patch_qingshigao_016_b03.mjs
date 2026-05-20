#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Commendations were recorded and rewards granted to assistant generals Zhu Shedou, Yang Yuchun, and others.',
    'Zhu Shedou, Yang Yuchun, and other assistant generals were commended.',
  ],
  s0202: [
    'On day wuyin, regulations were fixed for metropolitan guard military administration.',
    'On wuyin, metropolitan guard regulations were fixed.',
  ],
  s0203: [
    'On day renwu, the fourth imperial brother, Prince of Lüdun Commandery Yongge, was posthumously enfeoffed as prince; the seventh imperial brother, Prince Zhuomin Yongcong, as Prince Zhe; the twelfth imperial brother Yongji as beile.',
    'On renwu, Prince Yongge was posthumously made a prince, Yongcong Prince Zhe, and Yongji beile.',
  ],
  s0204: [
    'On day guwei, Lebao memorialized that sect bandit Leng Tianlu had been exterminated.',
    'On guwei, Lebao reported sect leader Leng Tianlu destroyed.',
  ],
  s0205: [
    'The rescript read: "Within ten days three chieftains were cut down in succession—deeply praiseworthy; E\'erdengbao was advanced to baron of the first rank.',
    'Rescript: three chiefs fell in ten days—praiseworthy; E\'erdengbao was made a first-rank baron.',
  ],
  s0206: [
    'Quota taxes, old and new, were remitted for twenty prefectures and counties including Dengzhou in Henan afflicted by bandits.',
    'Twenty Henan districts including Dengzhou lost old and new quota taxes.',
  ],
  s0207: [
    'Gansu provincial treasurer Guanghou memorialized that bandit chief Zhang Shilong had been killed in suppression.',
    'Guanghou of Gansu reported bandit chief Zhang Shilong killed.',
  ],
  s0208: [
    'Summer, fourth month, new moon on day jichou: the Directorate of Astronomy reported that on the fourth-month new moon the sun and moon were in conjunction and the five planets in alignment.',
    'On the fourth-month new moon, jichou, Astronomy reported sun-moon conjunction and five-planet alignment.',
  ],
  s0209: [
    'The Emperor said: "Celestial positions merely happen to coincide; arms have not ceased—how can this be called an omen?',
    'The Emperor said: chance conjunction amid war is no omen.',
  ],
  s0210: [
    'Yin Zhuangtu was made supervising censor and permitted to return home to support his parents.',
    'Yin Zhuangtu became a censor and went home to care for his parents.',
  ],
  s0211: [
    'On day bingshen, the late emperor\'s honorific title was reverently submitted; when the rite was complete an edict of grace was promulgated.',
    'On bingshen, the late emperor received his posthumous title and an amnesty edict followed.',
  ],
  s0212: [
    'On day dingyou, old and new quota taxes were remitted for thirty-five subprefectures, prefectures, and counties in Shaanxi including Xiaoyi afflicted by bandits.',
    'On dingyou, thirty-five Shaanxi districts including Xiaoyi lost old and new taxes.',
  ],
  s0213: [
    'On day jihai, old and new quota taxes were remitted for thirty-six subprefectures, prefectures, and counties in Sichuan including Fengjie afflicted by bandits.',
    'On jihai, thirty-six Sichuan districts including Fengjie lost old and new taxes.',
  ],
  s0214: [
    'On day xinyou, an edict ordered observance of the late father\'s instruction to hold special provincial and metropolitan civil examinations in gengshen and xinyou years.',
    'On xinyou, special exams were ordered for gengshen and xinyou per the late emperor.',
  ],
  s0215: [
    'On day guichou, Yao Wentian and two hundred twenty others were granted jinshi and third-place honors with differing ranks.',
    'On guichou, Yao Wentian and 220 others received jinshi ranks.',
  ],
  s0216: [
    'On day bingchen, Qingcheng was made General of Chengdu.',
    'On bingchen, Qingcheng became Chengdu general.',
  ],
  s0217: [
    'Fifth month, new moon on day wuwu: autumn executions were suspended this year.',
    'On the fifth-month new moon, autumn executions were halted.',
  ],
  s0218: [
    'On day jiazi, old and new quota taxes were remitted for forty-seven prefectures, counties, guards, and posts in Hubei including Xiaogan afflicted by bandits.',
    'On jiazi, forty-seven Hubei districts including Xiaogan lost old and new taxes.',
  ],
  s0219: [
    'On day gengwu, Jiang Lan was dismissed and Chu Pengling made Yunnan governor.',
    'On gengwu, Jiang Lan was dismissed; Chu Pengling took Yunnan.',
  ],
  s0220: [
    'On day gengchen, Fu Sen was made Minister of War and Adisi Minister of the Left.',
    'On gengchen, Fu Sen took War and Adisi the Left Censorate.',
  ],
  s0221: [
    'On day xinsi, Prince of Lekin Commandery Hengjin was stripped of rank for lack of care.',
    'On xinsi, Prince Hengjin lost his title for negligence.',
  ],
  s0222: [
    'On day jiashen, Dong Gao was made Grand Secretary.',
    'On jiashen, Dong Gao became Grand Secretary.',
  ],
  s0223: [
    'On day dinghai, Fei Chun was ordered to investigate and impeach corrupt officials.',
    'On dinghai, Fei Chun was told to expose corrupt officials.',
  ],
  s0224: [
    'An edict remitted the Muslim community of Berdelge\'s additional gold payments and grape valuation.',
    'Berdelge Muslims\' extra gold and grape levies were remitted.',
  ],
  s0225: [
    'Sixth month, day jichou: left and right wing commander posts were added under the Metropolitan Brigade commandant.',
    'In month 6, jichou, Metropolitan Brigade wing commanders were added.',
  ],
  s0226: [
    'On day gengyin, an edict read: "We have heard that Suizhou in Hubei was not disturbed by bandits because the people dug ditches and piled hills, sufficient for defense.',
    'On gengyin, an edict praised Suizhou\'s ditches and hill forts against bandits.',
  ],
  s0227: [
    'Village forts among the people may all follow this example.',
    'Village forts may follow the same model.',
  ],
  s0228: [
    'Lebao, Songyun, and Wu Xiongguang are at once to proclaim this so the people may know.',
    'Lebao, Songyun, and Wu Xiongguang were told to inform the people.',
  ],
  s0229: [
    'On day xinmao, Wu Xiongguang and Wu Tai requested additional collection of silver for river-work straw transport costs.',
    'On xinmao, Wu Xiongguang and Wu Tai sought extra river-work transport funds.',
  ],
  s0230: [
    'The rescript sternly rebuked them and referred the matter to the ministry for disposition.',
    'They were rebuked and the ministry was to decide punishment.',
  ],
  s0231: [
    'On day gengxu, hereditary offices were granted in condolence to Shaanxi fallen commander Baoxing and others.',
    'On gengxu, hereditary ranks were granted for Baoxing and other fallen Shaanxi commanders.',
  ],
  s0232: [
    'Seventh month, day xinyou: three thousand Shanxi troops were transferred to Hubei; two thousand Mukden troops under E\'leheng\'e were sent to Sichuan to suppress bandits.',
    'In month 7, xinyou, 3,000 Shanxi troops went to Hubei and 2,000 Mukden troops under E\'leheng\'e to Sichuan.',
  ],
  s0233: [
    'On day guihai, Lebao memorialized capture of bandit chief Bao Zhenghong and granted Zhu Shedou the hereditary office of Commandant of Cavalry.',
    'On guihai, Lebao reported Bao Zhenghong captured and gave Zhu Shedou a hereditary cavalry command.',
  ],
  s0234: [
    'On day renshen, pacification commissioner Lebao was stripped of office and arrested for dilatory military conduct; Mingliang was made pacification commissioner and Kuilun Sichuan governor-general.',
    'On renshen, Lebao was arrested for delay; Mingliang became pacification commissioner and Kuilun Sichuan governor-general.',
  ],
  s0235: [
    'On day yihai, Jing\'an\'s baronage was stripped and he was banished to Ili.',
    'On yihai, Jing\'an lost his barony and was sent to Ili.',
  ],
  s0236: [
    'Old and new quota taxes were remitted for forty-eight prefectures and counties in Gansu including Longxi afflicted by bandits.',
    'Forty-eight Gansu districts including Longxi lost old and new taxes.',
  ],
  s0237: [
    'On day xinsi, Mid-Autumn tribute was suspended.',
    'On xinsi, Mid-Autumn tribute was halted.',
  ],
  s0238: [
    'Eighth month, day jichou: Fujun was dismissed and Xingkui made Urumchi commandant.',
    'In month 8, jichou, Fujun was dismissed and Xingkui took Urumchi.',
  ],
  s0239: [
    'On day renchen, two thousand Mukden troops and one thousand each from Jilin and Heilongjiang were transferred to Hubei to suppress bandits.',
    'On renchen, Mukden, Jilin, and Heilongjiang troops were sent to Hubei.',
  ],
  s0240: [
    'On day guisi, Changlin was made Yunnan-Guizhou governor-general.',
    'On guisi, Changlin became Yunnan-Guizhou governor-general.',
  ],
  s0241: [
    'On day yiwei, Lebao memorialized that Delengtai had captured bandit chief Gong Wenyu alive and granted a hereditary Commandant of Cavalry office.',
    'On yiwei, Lebao reported Gong Wenyu captured alive and granted Delengtai a hereditary cavalry command.',
  ],
  s0242: [
    'On day guimao, Mingliang was dismissed as pacification commissioner and E\'erdengbao was ordered to serve as pacification commissioner with the rank of commandant-in-chief.',
    'On guimao, Mingliang left the pacification post and E\'erdengbao took it as commandant-in-chief.',
  ],
  s0243: [
    'On day yisi, compiler Zhao Wenkai and secretary Li Dingyuan were ordered to invest Ryukyu\'s King Shō On.',
    'On yisi, Zhao Wenkai and Li Dingyuan were sent to invest King Shō On of Ryukyu.',
  ],
  s0244: [
    'On day jiyou, Qingcheng and Yongbao were arrested for ineffective command; Nayancheng was sent to Shaanxi to supervise affairs.',
    'On jiyou, Qingcheng and Yongbao were arrested for poor command; Nayancheng went to Shaanxi.',
  ],
  s0245: [
    'On day guichou, compiler Hong Liangji sent a letter to Prince Cheng privately discussing state affairs and was banished to Ili.',
    'On guichou, Hong Liangji was banished to Ili for privately criticizing policy to Prince Cheng.',
  ],
  s0246: [
    'Ninth month, new moon on day bingchen: hereditary offices were granted in condolence to fallen Guizhou deputy commander Sun Dayou.',
    'At the ninth-month new moon, bingchen, Sun Dayou received a hereditary office.',
  ],
  s0247: [
    'On day bingyin, Prince Yi Yonglang died.',
    'On bingyin, Prince Yi Yonglang died.',
  ],
  s0248: [
    'On day gengwu, the late emperor\'s coffin departed; the Emperor reverently escorted the departure rites.',
    'On gengwu, the late emperor\'s coffin departed and the Emperor escorted it.',
  ],
  s0249: [
    'On day gengwu, Emperor Gaozong Chun was buried at Yuling.',
    'On gengwu, Emperor Gaozong was buried at Yuling.',
  ],
  s0250: [
    'On day guiyou, the court returned to the capital.',
    'On guiyou, the court returned to Beijing.',
  ],
  s0251: [
    'On day jiaxu, Emperor Gaozong Chun, Empress Xiaoxian Chun, and Empress Xiaoyi Chun were enshrined in the Grand Temple and an edict of grace was promulgated.',
    'On jiaxu, Qianlong and his empresses entered the Grand Temple and an amnesty followed.',
  ],
  s0252: [
    'On day xinsi, the late Huguang governor-general Bi Yuan was punished for misuse of military supplies by stripping hereditary office and seizing yin privileges.',
    'On xinsi, Bi Yuan lost hereditary rank and yin privileges for misusing military funds.',
  ],
  s0253: [
    'On day renwu, Mingliang was dismissed as pacification aide for ineffective suppression, stripped of commandant-in-chief rank, and given vice commandant-in-chief to suppress bandits.',
    'On renwu, Mingliang lost his aide post and commandant rank but kept vice commandant to fight bandits.',
  ],
  s0254: [
    'Winter, tenth month, day renchen: Zhu Gui was transferred to Minister of Revenue, Liu Quanzhi to Minister of Personnel, and Fan Jianzhong to Minister of the Left.',
    'In month 10, renchen, Zhu Gui took Revenue, Liu Quanzhi Personnel, and Fan Jianzhong the Left.',
  ],
  s0255: [
    'On day dingyou, Mingliang memorialized capture of bandit chief Zhang Hanchao.',
    'On dingyou, Mingliang reported Zhang Hanchao captured.',
  ],
  s0256: [
    'Hubei circuit intendant Hu Qilun was executed for embezzling grain funds.',
    'Hu Qilun of Hubei was executed for embezzling grain funds.',
  ],
  s0257: [
    'On day renyin, Delengtai memorialized capture of bandit chiefs Gao Junde and Gao Er.',
    'On renyin, Delengtai reported Gao Junde and Gao Er captured.',
  ],
  s0258: [
    'Delengtai was granted baron of the second rank.',
    'Delengtai was made a second-rank baron.',
  ],
  s0259: [
    'On day dingwei, Prince Cheng Yongxing was removed from attendance at the Grand Council.',
    'On dingwei, Prince Cheng Yongxing left the Grand Council.',
  ],
  s0260: [
    'Fu Sen was again ordered to serve as Grand Council minister.',
    'Fu Sen returned to the Grand Council.',
  ],
  s0261: [
    'On day xinhai, court ministers were ordered to recommend the worthy.',
    'On xinhai, ministers were told to recommend worthy men.',
  ],
  s0262: [
    'On day renzi, Lebao was sentenced to decapitation and sent to the capital for imprisonment awaiting execution.',
    'On renzi, Lebao was sentenced to death and held at the capital.',
  ],
  s0263: [
    'Eleventh month, day jiazi: because Anlu, son of the late Duke Chaoyong Hai Lancha, died suppressing bandits in Sichuan, he was specially condoled; his son was named Entehemozhafen and inherited the dukedom of Chaoyong.',
    'In month 11, jiazi, Anlu was condoled for dying in Sichuan; his son Entehemozhafen inherited Chaoyong.',
  ],
  s0264: [
    'On day guiyou, accumulated tax arrears in Zhili were remitted.',
    'On guiyou, Zhili\'s accumulated tax arrears were remitted.',
  ],
  s0265: [
    'On day wuyin, Xingzhao and Qingcheng were banished for ineffective troop command.',
    'On wuyin, Xingzhao and Qingcheng were banished for poor command.',
  ],
  s0266: [
    'E\'erdengbao was rewarded with ten thousand taels of silver and Delengtai with five thousand.',
    'E\'erdengbao received 10,000 taels and Delengtai 5,000.',
  ],
  s0267: [
    'On day gengchen, at the winter solstice Heaven was sacrificed at the Circular Mound Altar with Emperor Gaozong Chun as associate; an edict of grace was promulgated.',
    'On gengchen, winter solstice sacrifice paired Gaozong and brought an amnesty.',
  ],
  s0268: [
    'Twelfth month, day renchen: grain-transport governor-general Jiang Zhaoqian was dismissed for leading a petition to raise taxes to fund transport.',
    'In month 12, renchen, Jiang Zhaoqian was dismissed for seeking a transport tax increase.',
  ],
  s0269: [
    'Hereditary offices were granted in condolence to fallen deputy commanders Ding Youcheng, Deliang, and others.',
    'Hereditary ranks were granted for Ding Youcheng, Deliang, and other fallen deputies.',
  ],
  s0270: [
    'On day jiawu, Funing was stripped and arrested for reporting victory after killing surrenderers; Jing\'an for letting bandits harm the people—both were dismissed and arrested.',
    'On jiawu, Funing and Jing\'an were arrested for false victory and letting bandits ravage the people.',
  ],
  s0271: [
    'On day bingshen, E\'erdengbao memorialized capture of sect bandit Wang Dengting.',
    'On bingshen, E\'erdengbao reported Wang Dengting captured.',
  ],
  s0272: [
    'On day xinchou, Jiang Sheng memorialized capture of Hunan Miao bandit Wu Chenshou.',
    'On xinchou, Jiang Sheng reported Miao chief Wu Chenshou captured.',
  ],
  s0273: [
    'The rescript commended him and advanced him to Junior Guardian of the Heir Apparent.',
    'He was commended and made Junior Guardian of the Heir Apparent.',
  ],
  s0274: [
    'On day renzi, the seasonal enshrinement rite was performed at the Grand Temple.',
    'On renzi, the Grand Temple seasonal rite was held.',
  ],
  s0275: [
    'This year, old and new quota taxes were remitted for sixty-seven prefectures and counties in Henan and Hubei afflicted by troops, and land taxes were levied in Zhili, Henan, and Hubei through which troops passed.',
    'This year, sixty-seven Henan and Hubei war districts lost taxes while march routes were taxed.',
  ],
  s0276: [
    'Taxes on collapsed fields were also remitted for one county each in Jiangsu and Hubei, and disaster taxes in Jilin Sanxing, Heilongjiang, and Yunnan Shiping Prefecture.',
    'Collapsed-field taxes in one Jiangsu and one Hubei county and disaster taxes in Jilin, Heilongjiang, and Shiping were remitted.',
  ],
  s0277: [
    'Accumulated tax arrears empire-wide were generally remitted.',
    'Empire-wide accumulated tax arrears were generally remitted.',
  ],
  s0278: [
    'Korea and Siam presented tribute.',
    'Korea and Siam paid tribute.',
  ],
  s0279: [
    'Fifth year, gengshen, spring, first month, new moon on day jiayin: the Emperor worshipped at the tombs.',
    'In Jiaqing 5, on the first-month new moon, jiayin, the Emperor worshipped at the tombs.',
  ],
  s0280: [
    'On day bingchen, he went to Yuling to perform the initial mourning sacrifice.',
    'On bingchen, he sacrificed at Yuling in initial mourning.',
  ],
  s0281: [
    'On day gengshen, the Emperor returned to the capital.',
    'On gengshen, the Emperor returned to Beijing.',
  ],
  s0282: [
    'E\'erdengbao was ordered to suppress Shaanxi sect bandits; Delengtai and Kuilun to suppress Sichuan sect bandits.',
    'E\'erdengbao took Shaanxi sect bandits; Delengtai and Kuilun, Sichuan.',
  ],
  s0283: [
    'On day xinyou, Songyun was made Ili general while remaining in Shaanxi to suppress bandits.',
    'On xinyou, Songyun became Ili general but stayed in Shaanxi against bandits.',
  ],
  s0284: [
    'Changlin was transferred to Shaanxi-Gansu governor-general; Yu De was made Fujian-Zhejiang governor-general and Ruan Yuan Jiangsu governor.',
    'Changlin took Shaanxi-Gansu; Yu De, Fujian-Zhejiang; Ruan Yuan, Jiangsu.',
  ],
  s0285: [
    'On day renxu, an edict ordered investigation of treasury funds to be made up at a measured pace and not so harshly as to burden the people.',
    'On renxu, treasury shortfalls were to be made up gradually without harming the people.',
  ],
  s0286: [
    'Jin Shisong died and Zhang Ruoting was made Minister of War.',
    'Jin Shisong died; Zhang Ruoting took War.',
  ],
  s0287: [
    'On day xinwei, prayer for grain was offered to the Supreme Lord with Emperor Gaozong Chun as associate.',
    'On xinwei, grain prayer paired Emperor Gaozong.',
  ],
  s0288: [
    'Wo-shi-bu was relieved; Jiang Sheng was made Huguang governor-general and Songyun was shifted to suppress Hubei bandits.',
    'Wo-shi-bu was dismissed; Jiang Sheng took Huguang and Songyun fought Hubei bandits.',
  ],
  s0289: [
    'On day wuyin, Jingyi was made Heilongjiang general.',
    'On wuyin, Jingyi became Heilongjiang general.',
  ],
  s0290: [
    'Second month, day dinghai: Nayancheng was ordered to assist in Gansu military affairs.',
    'In month 2, dinghai, Nayancheng was ordered to assist Gansu forces.',
  ],
  s0291: [
    'On day xinmao, Wang Chengpei was made Minister of the Left.',
    'On xinmao, Wang Chengpei took the Left Censorate.',
  ],
  s0292: [
    'On day guisi, Xinjiang was ordered to cast Qianlong coin.',
    'On guisi, Xinjiang was ordered to cast Qianlong cash.',
  ],
  s0293: [
    'On day renyin, hereditary offices were granted in condolence to fallen Sichuan deputy commander Guan Liansheng and others.',
    'On renyin, hereditary ranks were granted for Guan Liansheng and other fallen Sichuan deputies.',
  ],
  s0294: [
    'On day dingwei, officials who had let bandits escape were reviewed; Qin Chengen and Yimian were banished to Ili.',
    'On dingwei, Qin Chengen and Yimian were sent to Ili for letting bandits escape.',
  ],
  s0295: [
    'On day gengxu, retired Grand Secretary Cai Xin died.',
    'On gengxu, retired Grand Secretary Cai Xin died.',
  ],
  s0296: [
    'Third month, day gengshen: the Emperor worshipped at the tombs.',
    'In month 3, gengshen, the Emperor worshipped at the tombs.',
  ],
  s0297: [
    'On day xinyou, Qishiwu was relieved of office and summoned to the capital for punishment.',
    'On xinyou, Qishiwu was dismissed and sent to the capital for trial.',
  ],
  s0298: [
    'On day jiazi, at the Qingming Festival the Emperor performed the spreading-earth rite.',
    'On jiazi, Qingming, the Emperor performed the spreading-earth rite.',
  ],
  s0299: [
    'On day yichou, Adisi was arrested for holding troops in dilatory neglect; Lebao was restored and made General of Chengdu.',
    'On yichou, Adisi was arrested for delay; Lebao was restored as Chengdu general.',
  ],
  s0300: [
    'On day dingmao, the Emperor went to the Southern Park.',
    'On dingmao, the Emperor went to the Southern Park.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b03.mjs <translation.json>'
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
