#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Fourth month of summer, day xinmao: bandits Chen Zhouquan and others in Changhua, Taiwan, rebelled, took the county seat, and soon it was recovered.',
    'In the fourth month, on xinmao day, Taiwan rebels Chen Zhouquan seized Changhua, but the city was soon retaken.',
  ],
  s0702: [
    'On day guisi, Dou Guangnai was demoted for improper examination judging at the metropolitan exam.',
    'On guisi day, Dou Guangnai was demoted for faulty metropolitan-exam grading.',
  ],
  s0703: [
    'Zhu Gui was made Left Censor-in-Chief while remaining Guangdong governor.',
    'Zhu Gui became left censor-in-chief and kept the Guangdong governorship.',
  ],
  s0704: [
    'On day jihai, because Kui Lun impeached unchecked foreign pirates, Pu Lin was ordered to Beijing to await instructions; Yao Fen was transferred to Fujian governor; Kui Lun acted in the post; Jiang Lan became Yunnan governor.',
    'On jihai day, Pu Lin was recalled over piracy charges, Yao Fen was sent to Fujian, Kui Lun acted, and Jiang Lan took Yunnan.',
  ],
  s0705: [
    'On day gengzi, Wang Yixian and one hundred eleven others received jinshi degrees with differentiated ranks.',
    'On gengzi day, Wang Yixian and 111 others received jinshi degrees.',
  ],
  s0706: [
    'On day guimao, the licentiates Xu Xin, Fu Gan, and Li Duan, whose metropolitan exam papers were superior in style, were rewarded with Secretariat drafter posts.',
    'On guimao day, Xu Xin, Fu Gan, and Li Duan became Secretariat drafters for superior exam papers.',
  ],
  s0707: [
    'On day wushen, the Emperor went to the Guangrun Shrine to pray for rain.',
    'On wushen day, the Emperor prayed for rain at Guangrun Shrine.',
  ],
  s0708: [
    'That night, rain fell.',
    'Rain fell that night.',
  ],
  s0709: [
    'On day dingwei, quota land tax for places traversed by Guizhou troops and officials this year was remitted by varying amounts.',
    'On dingwei day, Guizhou transit districts received partial land-tax remissions.',
  ],
  s0710: [
    'Fukang\'an and others memorialized capture of Huangguazhai.',
    'Fukang\'an reported taking Huangguazhai.',
  ],
  s0711: [
    'On day jiyou, because Fu Ning and Hui Ling had not finished managing Hunan military affairs, Su Ling\'a was again ordered to act as Liangjiang governor-general and Fei Chun made Anhui governor.',
    'On jiyou day, Su Ling\'a again acted at Liangjiang and Fei Chun took Anhui while Hunan affairs continued.',
  ],
  s0712: [
    'On day gengxu, last year\'s flood quota land tax was remitted for four Fujian counties including Longxi.',
    'On gengxu day, Longxi and three other Fujian counties were forgiven last year\'s flood taxes.',
  ],
  s0713: [
    'Bandit leaders Chen Zhouquan and others were executed.',
    'Chen Zhouquan and other rebel leaders were executed.',
  ],
  s0714: [
    'Fifth month, day bingchen: the Emperor went to the Mountain Resort for Avoiding Summer Heat.',
    'In the fifth month, on bingchen day, the Emperor went to the Summer Resort.',
  ],
  s0715: [
    'Wulara and Pu Lin were stripped of office and tried for mismanaging disaster relief.',
    'Wulara and Pu Lin were dismissed and prosecuted for botched relief.',
  ],
  s0716: [
    'Kui Lun was ordered to act concurrently as Fujian-Zhejiang governor-general.',
    'Kui Lun was ordered to act as Fujian-Zhejiang governor-general.',
  ],
  s0717: [
    'This year\'s land tax and grain levies were remitted by three-tenths for places traversed.',
    'Transit districts received a thirty-percent tax remission.',
  ],
  s0718: [
    'On day dingsi, Fei Chun was transferred to Jiangsu governor and Hui Ling remained Anhui governor.',
    'On dingsi day, Fei Chun took Jiangsu and Hui Ling stayed in Anhui.',
  ],
  s0719: [
    'Fukang\'an and others memorialized capture of Goupi Stockade and Supi Stockade and other places.',
    'Fukang\'an reported captures at Goupi, Supi, and elsewhere.',
  ],
  s0720: [
    'Fukang\'an was transferred to Fujian-Zhejiang governor-general and Lebao to Sichuan governor.',
    'Fukang\'an became Fujian-Zhejiang governor-general and Lebao Sichuan governor.',
  ],
  s0721: [
    'Yi Mian was made Shaanxi-Gansu governor-general.',
    'Yi Mian became Shaanxi-Gansu governor-general.',
  ],
  s0722: [
    'On day renxu, the Emperor halted at the Mountain Resort.',
    'On renxu day, the Emperor stayed at the Summer Resort.',
  ],
  s0723: [
    'On day jiazi, because Fujian granary deficits were verified, censors were sternly rebuked for failing to memorialize, and it was ordered that hereafter they memorialize major local events without failing their duty to speak.',
    'On jiazi day, censors were rebuked over Fujian warehouse deficits and told to report major local affairs.',
  ],
  s0724: [
    'Ajing\'a was summoned to the capital; Jing\'an was made Henan governor.',
    'Ajing\'a was summoned to Beijing and Jing\'an became Henan governor.',
  ],
  s0725: [
    'On day dingmao, Hui Ling was summoned to the capital; Wang Xin made Anhui governor.',
    'On dingmao day, Hui Ling was recalled and Wang Xin took Anhui.',
  ],
  s0726: [
    'On day wuchen, Su Ling\'a was ordered to station at Qingjiangpu and act concurrently as Jiangsu governor.',
    'On wuchen day, Su Ling\'a was stationed at Qingjiangpu acting as Jiangsu governor.',
  ],
  s0727: [
    'On day xinwei, Yu Minzhong was stripped of his Light Chariot Commandant hereditary title for private gain and breach of duty.',
    'On xinwei day, Yu Minzhong lost his hereditary commandant title for corruption.',
  ],
  s0728: [
    'Sixth month, day renwu: because Hunan Miao bandits had raided the Zhenjiao rear route, an edict rebuked Fu Ning for cowardice and Liu Junfu for passive defense.',
    'In the sixth month, Fu Ning was rebuked for cowardice and Liu Junfu for passivity after Miao raided Zhenjiao\'s rear.',
  ],
  s0729: [
    'Hui Ling was again ordered to act as Hubei governor.',
    'Hui Ling was again ordered to act as Hubei governor.',
  ],
  s0730: [
    'On day wuzi, because of drought the Ministry of Justice was ordered to clear ordinary prisons and commute punishments below exile; the Rehe Prefecture likewise.',
    'On wuzi day, drought led to prison reviews and commutations below exile in Beijing and Rehe.',
  ],
  s0731: [
    'On day gengyin, Fukang\'an and others memorialized capture of Miao stockades at Shadou, Duoxi, and elsewhere.',
    'On gengyin day, Fukang\'an reported taking Shadou, Duoxi, and other stockades.',
  ],
  s0732: [
    'On day yiwei, flood relief was given for the water disaster in Guangdong\'s Nanhai and other counties.',
    'On yiwei day, Nanhai and other Guangdong counties received flood relief.',
  ],
  s0733: [
    'On day wushen, Yao Fen was removed pending interrogation; Kui Lun was ordered to act concurrently as Fujian governor and Changlin acted as Fujian-Zhejiang governor-general.',
    'On wushen day, Yao Fen was suspended, Kui Lun acted as Fujian governor, and Changlin as Fujian-Zhejiang governor-general.',
  ],
  s0734: [
    'Autumn, seventh month, day gengshen: Deming, implicated through Yiyang magistrate Chen Zhao, hanged himself and was sentenced to strangulation.',
    'In the seventh month, Deming hanged himself and received a strangulation sentence over the Chen Zhao affair.',
  ],
  s0735: [
    'On day yichou, last year\'s flood quota land tax was remitted for twelve Jiangling and other Hubei prefectures, counties, and garrisons.',
    'On yichou day, twelve Hubei jurisdictions including Jiangling were forgiven last year\'s flood taxes.',
  ],
  s0736: [
    'On day bingyin, because Fukang\'an and others memorialized successive captures of Miao stockades and crossing the Great Wucao River, precious gifts were bestowed.',
    'On bingyin day, Fukang\'an was rewarded for successive stockade captures and crossing the Great Wucao River.',
  ],
  s0737: [
    'On day renshen, the Jebtsundamba Khutuktu and others had audience; they were summoned and given tea.',
    'On renshen day, the Jebtsundamba Khutuktu and others were received and given tea.',
  ],
  s0738: [
    'Eighth month, day renwu: Yongkun was transferred to Uliastai general and Hengrui to Suiyuan city general.',
    'In the eighth month, Yongkun took Uliastai and Hengrui Suiyuan.',
  ],
  s0739: [
    'On day guimao, imperial letters of instruction were bestowed on Nanzhang king Zhao Wenmeng and Burma king Meng Xian, each with patterned silks.',
    'On guimao day, letters and silks went to the Nanzhang and Burma kings.',
  ],
  s0740: [
    'On day bingshen, Liu E\'s request to retire was granted; Zhu Gui replaced him while remaining Guangdong governor.',
    'On bingshen day, Liu E retired and Zhu Gui replaced him while keeping Guangdong.',
  ],
  s0741: [
    'Jin Shisong was made Left Censor-in-Chief.',
    'Jin Shisong became Left Censor-in-Chief.',
  ],
  s0742: [
    'On day dingwei, accumulated banner rent arrears were remitted for fifty-two Zhili prefectures and counties including Tongzhou.',
    'On dingwei day, banner rent arrears were forgiven in fifty-two Zhili districts including Tongzhou.',
  ],
  s0743: [
    'Fukang\'an and others advanced to encamp at Yangliuping.',
    'Fukang\'an advanced to Yangliuping.',
  ],
  s0744: [
    'Ninth month, day xinhai: the Emperor held court at the Diligence in Government Hall, summoned princes, imperial grandsons, princes and dukes, and ministers for audience, and proclaimed the fifteenth imperial son, Prince Jia, heir apparent, with the following year as the Jiaqing first year of the succeeding emperor.',
    'In the ninth month, the Emperor proclaimed Prince Jia heir apparent and fixed the next year as Jiaqing 1.',
  ],
  s0745: [
    'Relief was given for the water disaster in seven Jiangsu prefectures and counties including Haizhou.',
    'Seven Jiangsu districts including Haizhou received flood relief.',
  ],
  s0746: [
    'On day renzi, the Heir Apparent and princes, dukes, civil and military ministers inside and outside, and Mongol princes and dukes each memorialized begging that abdication ceremonies wait until the Emperor reached the fullness of long life; this was not granted.',
    'On renzi day, the court begged to defer abdication until the Emperor\'s full longevity; he refused.',
  ],
  s0747: [
    'On day bingchen, Fulehun and Yade, for earlier governorship corruption, were both stripped of office and sent to serve at Rehe and Ili respectively.',
    'On bingchen day, Fulehun and Yade were dismissed for past graft and sent to Rehe and Ili.',
  ],
  s0748: [
    'On day jiwei, the Emperor reviewed the Jianrui Camp troops.',
    'On jiwei day, the Emperor inspected the Jianrui Camp.',
  ],
  s0749: [
    'Fukang\'an was advanced to Loyal Valiant Brave Prince with courage and He Lin to first-class Baron Xuanyong.',
    'Fukang\'an was made Loyal Valiant Brave Prince and He Lin Baron Xuanyong.',
  ],
  s0750: [
    'On day gengshen, the Emperor ordered the Heir Apparent to visit the Eastern and Western Tombs.',
    'On gengshen day, the Heir Apparent was sent to the Eastern and Western Tombs.',
  ],
  s0751: [
    'On day yichou, Heilongjiang general Shuliang, for extortion, was stripped of office and tried; Yongkun was transferred to replace him.',
    'On yichou day, Shuliang was prosecuted for extortion and Yongkun replaced him at Heilongjiang.',
  ],
  s0752: [
    'Tusang\'a was made Uliastai general.',
    'Tusang\'a became Uliastai general.',
  ],
  s0753: [
    'Hengrui was changed to Xi\'an general and replaced by Wuer\'tunaxun.',
    'Hengrui became Xi\'an general and Wuer\'tunaxun replaced him.',
  ],
  s0754: [
    'Boxing was made Chahar commander-in-chief.',
    'Boxing became Chahar commander-in-chief.',
  ],
  s0755: [
    'Tekesen was transferred to Urga minister and Cebake to Xining minister.',
    'Tekesen took Urga and Cebake Xining.',
  ],
  s0756: [
    'On day bingyin, Mingliang was stripped of office for embezzling sable pelts while Heilongjiang general; Baoning was made Ili general.',
    'On bingyin day, Mingliang lost his post for sable embezzlement and Baoning became Ili general.',
  ],
  s0757: [
    'On day jisi, Shuliang was sentenced to strangulation.',
    'On jisi day, Shuliang was sentenced to strangulation.',
  ],
  s0758: [
    'Mingliang was kept at Urumchi to serve.',
    'Mingliang remained to serve at Urumchi.',
  ],
  s0759: [
    'On day guiyou, because Fengtian, Shanxi, Sichuan, Hunan, Guizhou, and Guangxi had no tax arrears, two-tenths of next year\'s main levy was remitted.',
    'On guiyou day, six provinces with no arrears received twenty percent off next year\'s main tax.',
  ],
  s0760: [
    'On day yihai, last year\'s flood quota land tax was remitted for six Fujian counties including Longxi and Hua Feng and Luoxi counties.',
    'On yihai day, six Fujian counties and two districts were forgiven last year\'s flood taxes.',
  ],
  s0761: [
    'Winter, tenth month, new moon on day wuyin: calendars for Jiaqing year 1 were promulgated.',
    'At the tenth-month new moon, Jiaqing 1 calendars were issued.',
  ],
  s0762: [
    'On day gengchen, Fukang\'an and others memorialized capture of bandit chief Wu Bansheng.',
    'On gengchen day, Fukang\'an reported capturing Wu Bansheng.',
  ],
  s0763: [
    'Fukang\'an\'s son Delin was granted vice censorate-in-chief rank; He Lin yellow sash; the rest received differentiated merit rewards.',
    'Delin received vice censor rank, He Lin a yellow sash, and others rewards by degree.',
  ],
  s0764: [
    'On day jiashen, because Wulara and others were corrupt and disgraced their office, their sons were banished to serve at Ili.',
    'On jiashen day, Wulara\'s sons were banished to Ili for his corruption.',
  ],
  s0765: [
    'Changlin was stripped of office for shielding Wulara and Pu Lin and ordered to the capital.',
    'Changlin was dismissed for covering for Wulara and Pu Lin and summoned to Beijing.',
  ],
  s0766: [
    'Kui Lun was ordered to act as Fujian-Zhejiang governor-general and Yao Fen to act as Fujian governor.',
    'Kui Lun acted as Fujian-Zhejiang governor-general and Yao Fen as Fujian governor.',
  ],
  s0767: [
    'On day yiyou, land-tax grain for Jiaqing year 1 was wholly remitted empire-wide.',
    'On yiyou day, the empire\'s Jiaqing 1 land taxes were wholly remitted.',
  ],
  s0768: [
    'On day bingxu, Wulara and Pu Lin were executed.',
    'On bingxu day, Wulara and Pu Lin were executed.',
  ],
  s0769: [
    'On day renchen, because E\'erdengbao and Delengtai were valiant in suppressing Miao bandits, they were made inner ministers.',
    'On renchen day, E\'erdengbao and Delengtai became inner ministers for suppressing Miao rebels.',
  ],
  s0770: [
    'On day yiwei, ceremonies for transferring the throne in the bingchen year were ordered fixed.',
    'On yiwei day, the bingchen abdication rites were ordered arranged.',
  ],
  s0771: [
    'On day guimao, on the auspicious first day of next year\'s New Year the Feast of a Thousand Elders was ordered held again.',
    'On guimao day, another Thousand Elders Banquet was ordered for New Year.',
  ],
  s0772: [
    'Eleventh month, day dingsi: Fukang\'an and others memorialized capture of Tianxing Stockade and other places.',
    'In the eleventh month, Fukang\'an reported Tianxing Stockade and elsewhere captured.',
  ],
  s0773: [
    'He Lin was given Junior Guardian of the Heir Apparent rank; Fukang\'an and He Lin each received one upper-grade yellow-lined black-fox surcoat.',
    'He Lin became Junior Guardian; Fukang\'an and He Lin each received a distinguished fur coat.',
  ],
  s0774: [
    'On day gengshen, drought relief was given to banner people in Jinzhou, Xiongyue, and Jinzhou cities in Fengtian and three counties including Ninghai, with quota tax remitted by varying amounts.',
    'On gengshen day, Fengtian drought districts were relieved and taxes remitted.',
  ],
  s0775: [
    'On day yichou, the Emperor ordered the Heir Apparent to reside in the Yuying Palace.',
    'On yichou day, the Heir Apparent moved to Yuying Palace.',
  ],
  s0776: [
    'Twelfth month, new moon on day wuyin, an edict said: "After I abdicate next year, all memorial matters submitted are to be addressed to the Retired Emperor.',
    'At the twelfth-month new moon, an edict required memorials after abdication to name the Retired Emperor.',
  ],
  s0777: [
    'In audience they are to address him as Retired Emperor."',
    'In audience they are to call him Retired Emperor.',
  ],
  s0778: [
    '"" (closing quotation mark in the source.) On day wuzi, relief was given to refugees disturbed in Tongren, Guizhou.',
    'The edict ended." On wuzi day, Tongren refugees in Guizhou were relieved.',
  ],
  s0779: [
    'Fukang\'an and others memorialized capture of Tianxing and other Miao stockades.',
    'Fukang\'an reported Tianxing and other stockades taken.',
  ],
  s0780: [
    'On day renyin, Zhu Gui was permitted to receive the memorial tribute of the king of England; an imperial letter of grace was bestowed and handed to the English merchant Pao Lang to carry back; and because the memorial urged Gurkha to submit, the letter told them no English military force was needed.',
    'On renyin day, Zhu Gui received Britain\'s tribute and a letter told Gurkha that English troops were unnecessary.',
  ],
  s0781: [
    'On day jiachen, an imperial letter of instruction was bestowed on Ryukyu king Sho On.',
    'On jiachen day, Ryukyu\'s king received an imperial letter.',
  ],
  s0782: [
    'On day dingwei, because at New Year next year the throne would be transferred to the Heir Apparent as succeeding emperor, officials were dispatched beforehand to announce sacrifice to Heaven and Earth and the ancestral temple.',
    'On dingwei day, envoys were sent to announce the New Year transfer of the throne.',
  ],
  s0783: [
    'That year Burma, Nanzhang, Siam, Annam, England, Ryukyu, and Gurkha came with tribute.',
    'That year seven states sent tribute.',
  ],
  s0784: [
    'Jiaqing year 1, first month, new moon on day wushen: the ceremony of transmitting and receiving the great seals was held; the Heir Apparent was installed as emperor.',
    'At Jiaqing 1 New Year the abdication ceremony installed the Heir Apparent as emperor.',
  ],
  s0785: [
    'The Emperor was honored as Retired Emperor; important military and state affairs were still reported, following his instruction in judgment; great affairs received edicts and decrees from him.',
    'The retired Emperor still decided weighty affairs while routine matters were reported to him.',
  ],
  s0786: [
    'Court calendars still used the Qianlong reign title.',
    'Palace calendars still read Qianlong.',
  ],
  s0787: [
    'Winter of year 3, the Emperor grew ill.',
    'In the third winter the retired Emperor fell ill.',
  ],
  s0788: [
    'Fourth year, first month, day renxu: he died, aged eighty-nine.',
    'In the fourth year, on renxu day, he died at eighty-nine.',
  ],
  s0789: [
    'That year, fourth month, day yiwei: the posthumous honorific Fatian Longyun Zhicheng Xianjue Tiyuan Liji Fuwen Fenwu Xiaoci Shensheng Chun Emperor was respectfully submitted; temple name Gaozong.',
    'That year the full posthumous title and temple name Gaozong were conferred.',
  ],
  s0790: [
    'Ninth month, day gengwu: burial at Yuling Mausoleum.',
    'In the ninth month, he was buried at Yuling.',
  ],
  s0791: [
    'The commentators say: Gaozong\'s fortune met utmost prosperity; he strove in government, expanded territory, on four sides punished those who would not submit, balanced culture with martial vigor—at this peak it was magnificent.',
    'The annalists say Gaozong ruled at supreme fortune, expanding the realm and balancing wen and wu as never before.',
  ],
  s0792: [
    'The length of his reign matched the Sacred Ancestor, yet in longevity he surpassed him.',
    'His reign equaled Kangxi\'s, but his years exceeded them.',
  ],
  s0793: [
    'Since the Three Dynasties, there had never been such a case.',
    'Nothing like it had occurred since the Three Dynasties.',
  ],
  s0794: [
    'Only in old age, wearied of toil, he was misled by favorites in power, which dimmed the brilliance of his years—for this one sighs.',
    'Only in old age, blinded by powerful favorites, did he cloud his glory—and at that one sighs.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_015_b08.mjs <translation.json>'
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
