#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day gengwu, the Emperor attended the Classics Lecture.',
    'On gengwu day, the Emperor held the Classics Lecture.',
  ],
  s0702: [
    'On day bingzi, leave was granted because Grand Secretary Baoning died.',
    'On bingzi day, court leave was granted for Grand Secretary Baoning\'s death.',
  ],
  s0703: [
    'On day wuyin, a special edict commended Fu Nai of the Hunan Chen-Yuan-Yongjing Circuit and added the rank of surveillance commissioner.',
    'On wuyin day, Fu Nai of Hunan\'s Chen-Yuan-Yongjing circuit was specially commended and given surveillance-commissioner rank.',
  ],
  s0704: [
    'Third month, day gengzi: the Emperor visited the Eastern Tombs.',
    'In the third month on gengzi day, the Emperor visited the Eastern Tombs.',
  ],
  s0705: [
    'On day renwu, the Emperor inspected the Tianjin long embankment.',
    'On renwu day, the Emperor inspected Tianjin\'s long dike.',
  ],
  s0706: [
    'On day bingchen, Xu Duan was made South Canal Riverway governor-general.',
    'On bingchen day, Xu Duan became South Canal Riverway governor-general.',
  ],
  s0707: [
    'On day jiwei, the Emperor reviewed troops at the Tianjin garrison.',
    'On jiwei day, the Emperor reviewed the Tianjin garrison troops.',
  ],
  s0708: [
    'On day bingyin, the Emperor went to the Southern Park for the encirclement hunt.',
    'On bingyin day, the Emperor hunted at the Southern Park.',
  ],
  s0709: [
    'Chang Lin and Dai Quheng were ordered to inspect the South Canal works.',
    'Chang Lin and Dai Quheng were sent to inspect South Canal projects.',
  ],
  s0710: [
    'Fourth month of summer, day wuchen: the Emperor returned to the capital.',
    'In the fourth summer month on wuchen day, the Emperor returned to Beijing.',
  ],
  s0711: [
    'On day xinmao, Wu Zhongxin and two hundred sixty-one others received jinshi degrees with differentiated ranks.',
    'On xinmao day, Wu Zhongxin and 261 others received jinshi degrees.',
  ],
  s0712: [
    'Fifth month, day guimao: Chang Lin and Dai Quheng memorialized on river inspection, reporting that a Zhang clansman over 130 years old pointed out two sluices Jin Fu had built east of Tianran Gate with dam foundations still visible, and repair was proposed.',
    'In the fifth month on guimao day, inspectors proposed restoring two Jin Fu sluices east of Tianran Gate on evidence from a 130-year-old Zhang villager.',
  ],
  s0713: [
    'The edict approved; the old man was rewarded with silver and silk.',
    'The request was approved and the informant rewarded with silver and satin.',
  ],
  s0714: [
    'On day gengshen, repair of the Confucian temple at Qufu was ordered.',
    'On gengshen day, the Qufu Confucian temple was ordered repaired.',
  ],
  s0715: [
    'Intercalary fifth month, day renwu: Hunan provincial commander Xian Heling was dismissed for improper wording in a memorial congratulating birth of the Emperor\'s eldest grandson.',
    'In intercalary fifth month on renwu day, Xian Heling was dismissed over a faulty birth-congratulation memorial.',
  ],
  s0716: [
    'Sixth month, day jiachen: the Emperor\'s Farming and Weaving Pictures poems were carved for inclusion in the Supplement to Investigations of the Seasons.',
    'In the sixth month on jiachen day, imperial ploughing-and-weaving poems were published in the seasonal almanac supplement.',
  ],
  s0717: [
    'On day yisi, Qin Cheng\'en was dismissed; Wu Jing was made Minister of Punishments.',
    'On yisi day, Qin Cheng\'en left office and Wu Jing became minister of punishments.',
  ],
  s0718: [
    'Autumn, seventh month, day gengchen: the Emperor toured Mulan.',
    'In the seventh autumn month on gengchen day, the Emperor visited Mulan.',
  ],
  s0719: [
    'Eighth month, day jiyou: the Emperor conducted the encirclement hunt.',
    'In the eighth month on jiyou day, the Emperor held a hunt encirclement.',
  ],
  s0720: [
    'On day jiayin, hereditary rank was granted to the family of Guangdong general Lin Guoliang, killed while fighting bandits.',
    'On jiayin day, Lin Guoliang\'s family received hereditary rank after he died fighting bandits in Guangdong.',
  ],
  s0721: [
    'Ninth month, day jimao: the Emperor returned to the capital.',
    'In the ninth month on jimao day, the Emperor returned to Beijing.',
  ],
  s0722: [
    'Tenth month of winter, new moon on day guisi: there was a solar eclipse.',
    'On the winter tenth month\'s new moon, a solar eclipse occurred.',
  ],
  s0723: [
    'Eleventh month, day renwu: Wu Xiongguang was dismissed; Yongbao was made Liang-Guang governor-general.',
    'In the eleventh month on renwu day, Wu Xiongguang left office and Yongbao took Liang-Guang.',
  ],
  s0724: [
    'On day gengyin, Xingzhao was made Hangzhou general.',
    'On gengyin day, Xingzhao became Hangzhou general.',
  ],
  s0725: [
    'Twelfth month, new moon on day renchen: the second imperial son was sent to the Dagao Hall to pray for snow.',
    'On the twelfth month\'s new moon, the second prince prayed for snow at Dagao Hall.',
  ],
  s0726: [
    'On day jihai, the Emperor prayed for snow.',
    'On jihai day, the Emperor prayed for snow.',
  ],
  s0727: [
    'On day yisi, snow fell.',
    'On yisi day, it snowed.',
  ],
  s0728: [
    'Zhou Xingdai was made Left Censor-in-Chief.',
    'Zhou Xingdai became left censor-in-chief.',
  ],
  s0729: [
    'On day jiwei, the joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On jiwei day, the imperial ancestral temple held the joint seasonal rite.',
  ],
  s0730: [
    'This year, disaster and arrears taxes were remitted for thirteen sub-prefectures and counties in Zhili, Sichuan, and other provinces.',
    'This year, disaster and arrears taxes were forgiven in thirteen districts of Zhili, Sichuan, and elsewhere.',
  ],
  s0731: [
    'Quota land tax was remitted for eleven sub-prefectures and counties in Zhili, Jiangsu, Zhejiang, Fujian, Yunnan, and Gansu, and salt-field levies for collapsed fields in Zhejiang and Fujian.',
    'Eleven districts in six provinces lost quota land tax; Zhejiang and Fujian salt plots lost levies after collapse.',
  ],
  s0732: [
    'Korea and Ryukyu sent tribute missions.',
    'Tribute arrived from Korea and Ryukyu.',
  ],
  s0733: [
    'Fourteenth year, spring first month, new moon on day xinyou: the Emperor\'s fiftieth-birthday Longevity Festival; an amnesty edict was promulgated.',
    'In year 14 on the spring new moon, the Emperor\'s fiftieth birthday brought a general amnesty.',
  ],
  s0734: [
    'Yi Prince Yongxuan\'s son Mianzhi and Cheng Prince Yongcheng\'s grandson Yilun were promoted to beile; princes and court officials received differentiated favors.',
    'Mianzhi and Yilun were raised to beile and other princes and officials received graded favors.',
  ],
  s0735: [
    'On day dingmao, Bailing was made Liang-Guang governor-general.',
    'On dingmao day, Bailing became Liang-Guang governor-general.',
  ],
  s0736: [
    'On day renshen, Guangxing was executed for crimes; his son Yunxiu was banished to Jilin and the family estate was confiscated.',
    'On renshen day, Guangxing was executed, Yunxiu was sent to Jilin, and the family property was seized.',
  ],
  s0737: [
    'Many others were degraded in connection; Changling was exiled to Yili.',
    'Many related officials were demoted and Changling was sent to Yili.',
  ],
  s0738: [
    'Hewning was made Shaanxi-Gansu governor-general.',
    'Hewning became Shaanxi-Gansu governor-general.',
  ],
  s0739: [
    'Second month, day renchen: the Emperor attended the Classics Lecture.',
    'In the second month on renchen day, the Emperor held the Classics Lecture.',
  ],
  s0740: [
    'On day renyin, the Emperor composed "Poem on Honoring Frugality" and "Discourse on Righteousness and Profit" and distributed them to court officials.',
    'On renyin day, new essays on frugality and on righteousness versus profit were issued to the court.',
  ],
  s0741: [
    'On day dingwei, the Emperor visited the Eastern Tombs.',
    'On dingwei day, the Emperor visited the Eastern Tombs.',
  ],
  s0742: [
    'On day dingsi, Fujian general Xu Songnian destroyed pirate Zhu Fen and was granted hereditary rank.',
    'On dingsi day, Xu Songnian killed pirate Zhu Fen and received hereditary office.',
  ],
  s0743: [
    'On day jiwei, the Emperor returned to the capital.',
    'On jiwei day, the Emperor returned to Beijing.',
  ],
  s0744: [
    'Third month, day guihai: the Emperor visited the Western Tombs.',
    'In the third month on guihai day, the Emperor visited the Western Tombs.',
  ],
  s0745: [
    'On day bingzi, he returned to the capital.',
    'On bingzi day, the Emperor returned to Beijing.',
  ],
  s0746: [
    'Xi\'an General, Third-rank Duke Delengtai, died.',
    'Delengtai, third-rank duke and Xi\'an general, died.',
  ],
  s0747: [
    'On day jimao, Songyun memorialized that over a hundred exiled rebel soldiers including Pu Dafang and Ma Youyuan had been unlawfully at their posts and were all executed after being rounded up.',
    'On jimao day, Songyun reported executing 100+ exiled mutineers including Pu Dafang who had misbehaved in banishment.',
  ],
  s0748: [
    'The Emperor rebuked the indiscriminate killing and stripped him of office.',
    'The Emperor condemned the massacre and removed Songyun from office.',
  ],
  s0749: [
    'Jin Chang was made Yili general; Xingzhao was made Jingzhou general.',
    'Jin Chang took Yili and Xingzhao took Jingzhou as generals.',
  ],
  s0750: [
    'Fourth month of summer, day jiayin: Hong Ying and two hundred forty-one others received jinshi degrees with differentiated ranks.',
    'In the fourth summer month on jiayin day, Hong Ying and 241 others received jinshi degrees.',
  ],
  s0751: [
    'Wu Xiongguang was exiled to Yili at Bailing\'s impeachment.',
    'Bailing\'s impeachment sent Wu Xiongguang to Yili.',
  ],
  s0752: [
    'Sun Yuting was dismissed.',
    'Sun Yuting left office.',
  ],
  s0753: [
    'Fifth month, day dingchou: a special edict sharply rebuked court officials for slackness.',
    'In the fifth month on dingchou day, a special edict rebuked lax officials.',
  ],
  s0754: [
    'On day wuyin, grain-transport censor Ying Lun was sentenced to strangulation for greed and base conduct.',
    'On wuyin day, censor Ying Lun was strangled for corruption and vileness.',
  ],
  s0755: [
    'Sixth month, day yiwei: a granary black-ledger rice theft case broke; former vice ministers were blamed and demoted by degree.',
    'In the sixth month on yiwei day, a granary fraud scandal brought graded demotions of former vice ministers.',
  ],
  s0756: [
    'On day dingwei, Songyun was made Shaanxi-Gansu governor-general.',
    'On dingwei day, Songyun became Shaanxi-Gansu governor-general.',
  ],
  s0757: [
    'Autumn, seventh month, day wuchen: autumn executions were suspended for the year.',
    'In the seventh autumn month on wuchen day, autumn executions were halted.',
  ],
  s0758: [
    'In Jiangsu, relief magistrate Li Yuchang was poisoned to death by Shanyang magistrate Wang Shenhan; after investigation Wang Shenhan was immediately beheaded, prefect Wang Gu was immediately strangled, steward Li Xiang and others received extreme penalties, governor-general Tiebao was stripped and exiled, and governor Wang Rizhang was dismissed.',
    'Magistrate Li Yuchang was murdered by Wang Shenhan; Wang was beheaded, Wang Gu was strangled, servants were executed, Tiebao was exiled, and Wang Rizhang was dismissed.',
  ],
  s0759: [
    'The Emperor composed a "Lament for the Loyal" poem, granted Li Yuchang\'s son Li Xizuo the juren degree, and made petitioner Li Qingtai a military juren and then military juren-examinee.',
    'An imperial lament poem went to Li Xizuo as juren and Li Qingtai as military juren and then military juren-examinee.',
  ],
  s0760: [
    'Alinbao was transferred to be Liangjiang governor-general; Fang Weidian was made Fujian-Zhejiang governor-general.',
    'Alinbao took Liangjiang and Fang Weidian took Fujian-Zhejiang.',
  ],
  s0761: [
    'On day renshen, supervising secretary Hua Jie was demoted for impeaching Grand Councilor Dai Quheng for favoritism without substantiation.',
    'On renshen day, Hua Jie was demoted for an unsubstantiated charge against Dai Quheng.',
  ],
  s0762: [
    'On day yihai, an edict said: "I hold the people in compassionate care; whenever a province reports disaster, relief is immediately sent with every means of aid.',
    'On yihai day, an edict said the throne responds at once to every provincial disaster report.',
  ],
  s0763: [
    'Yet governors-general and governors fail to investigate, so fraudulent relief occurs.',
    'Yet governors fail to check, and relief fraud follows.',
  ],
  s0764: [
    'Cases such as Baodi and Shanyang recently even plotted to kill upright relief commissioners—how can this go unpunished? It is not that I am reluctant to punish.',
    'Baodi and Shanyang even killed upright commissioners, and punishment cannot be withheld.',
  ],
  s0765: [
    'Censor Zhou Yin therefore asked that disaster reports be separately assigned to circuit and prefectural officials for detailed inspection.',
    'Censor Zhou Yin wanted separate circuit and prefect inspections of disaster reports.',
  ],
  s0766: [
    'How can one know that circuit and prefectural officials are all capable?',
    'But not every circuit or prefect official is capable.',
  ],
  s0767: [
    'In the present Baodi case, the responsible Eastern Route sub-prefect Gui Enyan once demanded three thousand taels of silver.',
    'In Baodi, sub-prefect Gui Enyan had demanded 3,000 taels.',
  ],
  s0768: [
    'In the Shanyang case, the responsible prefect Wang Gu took two thousand taels of silver.',
    'In Shanyang, prefect Wang Gu took 2,000 taels.',
  ],
  s0769: [
    'If one meets circuit and prefectural officials of this kind, can they be trusted!',
    'Such circuit and prefect officials cannot be trusted.',
  ],
  s0770: [
    'Circuit and prefectural officials cannot visit every village themselves and still delegate to commissioners, which is even less reliable.',
    'They cannot visit every village and still rely on commissioners.',
  ],
  s0771: [
    'The essential point is only to have capable governors-general and governors.',
    'The key is appointing capable governors.',
  ],
  s0772: [
    'As for treating disaster inspection as difficult and therefore collectively concealing disasters, the guilt is still heavier.',
    'Concealing disasters to avoid inspection is an even graver fault.',
  ],
  s0773: [
    'Let this be communicated for general knowledge."',
    'The edict ordered the message circulated.',
  ],
  s0774: [
    '"" On day renwu, the Emperor toured Mulan.',
    'The edict closed." On renwu day, the Emperor visited Mulan.',
  ],
  s0775: [
    'Eighth month, day gengxu: Zhejiang education intendant and vice minister Liu Fenggao was dismissed for examination malpractice and exiled to Heilongjiang.',
    'In the eighth month on gengxu day, Liu Fenggao was dismissed for exam fraud and sent to Heilongjiang.',
  ],
  s0776: [
    'Governor Ruan Yuan was dismissed for concealment.',
    'Governor Ruan Yuan lost office for covering up the case.',
  ],
  s0777: [
    'Ninth month, day jiwei: Qingcheng was made Fuzhou general.',
    'In the ninth month on jiwei day, Qingcheng became Fuzhou general.',
  ],
  s0778: [
    'On day gengshen, the Emperor returned to the capital.',
    'On gengshen day, the Emperor returned to Beijing.',
  ],
  s0779: [
    'On day jisi, Zhang Shicheng memorialized that Wang Delu and Qiu Lianggong jointly attacked pirate Cai Qian, pressed the rebel ship hard, broke off its stern, and Cai Qian fell into the sea and drowned.',
    'On jisi day, Zhang Shicheng reported Wang Delu and Qiu Lianggong cornered pirate Cai Qian, broke his ship, and drowned him.',
  ],
  s0780: [
    'Wang Delu was granted a viscountcy and Qiu Lianggong a baronetcy.',
    'Wang Delu received a viscountcy and Qiu Lianggong a baronetcy.',
  ],
  s0781: [
    'On day renshen, Bailing memorialized asking that Guangdong salt be transported overland; it was approved.',
    'On renshen day, Bailing\'s request to move Guangdong salt by land was approved.',
  ],
  s0782: [
    'Tenth month of winter, day guisi: the Longevity Festival; the Emperor received congratulations in the Hall of Supreme Harmony and gave a banquet.',
    'On the winter tenth month\'s guisi day, the Longevity Festival brought court congratulations and a banquet.',
  ],
  s0783: [
    'On day gengxu, Alinbao memorialized asking that grain transport accept extra fold collection; the Emperor sternly rebuked it.',
    'On gengxu day, Alinbao\'s proposal for extra grain-transport surcharges was sharply rejected.',
  ],
  s0784: [
    'Eleventh month, day renchen: Songyun was made Liangjiang governor-general; Nayancheng was made Shaanxi-Gansu governor-general.',
    'In the eleventh month on renchen day, Songyun took Liangjiang and Nayancheng took Shaanxi-Gansu.',
  ],
  s0785: [
    'Twelfth month, day wuxu: because Board of Works clerks had fraudulently drawn Ministry of Revenue and Imperial Household Department official silver without detection, Lu Kang, Fei Chun, and others were demoted in succession.',
    'On wuxu day, Lu Kang, Fei Chun, and others were demoted for undetected Works-clerk fraud on Revenue and Household funds.',
  ],
  s0786: [
    'On day jiayin, the joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On jiayin day, the imperial ancestral temple held the joint seasonal rite.',
  ],
  s0787: [
    'This year, disaster taxes were remitted for twenty-four prefectures and counties in Zhili, Jiangsu, and other provinces.',
    'This year, disaster taxes were forgiven in twenty-four districts of Zhili, Jiangsu, and elsewhere.',
  ],
  s0788: [
    'Land tax was remitted for low-lying fields in Wen\'an, Shuntian, collapsed salt plots at Qianqing, Zhejiang, and collapsed land at Chazhou, Hunan.',
    'Wen\'an lowlands, Zhejiang\'s Qianqing salt field, and Hunan\'s Chazhou lost land tax after collapse.',
  ],
  s0789: [
    'Korea, Ryukyu, Siam, Vietnam, and Lan Xang sent tribute missions.',
    'Tribute arrived from Korea, Ryukyu, Siam, Vietnam, and Lan Xang.',
  ],
  s0790: [
    'Fifteenth year, spring first month, day bingzi: Liu Quanzhi was made associate grand secretary.',
    'In year 15 on spring bingzi day, Liu Quanzhi became associate grand secretary.',
  ],
  s0791: [
    'Second month, day jichou: the Emperor attended the Classics Lecture.',
    'In the second month on jichou day, the Emperor held the Classics Lecture.',
  ],
  s0792: [
    'On day renchen, Chang Lin was dismissed owing to illness; Hutuli was made Minister of Punishments and Tuojin Minister of Works.',
    'On renchen day, Chang Lin left for illness; Hutuli took punishments and Tuojin took works.',
  ],
  s0793: [
    'On day bingchen, Lebao was summoned to the capital; Chang Ming was made Sichuan governor-general.',
    'On bingchen day, Lebao was called to Beijing and Chang Ming took Sichuan.',
  ],
  s0794: [
    'On day bingzi, an edict ordered governors-general and governors everywhere to cut off the source of opium because it harms life.',
    'On bingzi day, an edict ordered all governors to stop opium at its source.',
  ],
  s0795: [
    'Third month, day jiazi: the Emperor visited the Eastern Tombs.',
    'In the third month on jiazi day, the Emperor visited the Eastern Tombs.',
  ],
  s0796: [
    'On day wuyin, the Emperor went to the Southern Park for the encirclement hunt.',
    'On wuyin day, the Emperor hunted at the Southern Park.',
  ],
  s0797: [
    'On day guimao, he returned to the capital.',
    'On guimao day, the Emperor returned to Beijing.',
  ],
  s0798: [
    'Fourth month of summer, day dingyou: the Emperor reviewed troops of the Vanguard Camp.',
    'In the fourth summer month on dingyou day, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0799: [
    'Fifth month, day guihai: Lebao was dismissed as grand secretary and demoted to Minister of Works for failing to memorialize an anonymous letter.',
    'In the fifth month on guihai day, Lebao lost the grand secretary post and became works minister for suppressing an anonymous letter.',
  ],
  s0800: [
    'Lu Kang was again made grand secretary and Mingliang associate grand secretary.',
    'Lu Kang again became grand secretary and Mingliang associate grand secretary.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b08.mjs <translation.json>'
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
