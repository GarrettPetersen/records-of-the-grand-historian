#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day dingyou, earlier Mianxing had requested changing the collection of Hui tribute levies; Jinglian went to Aksu to investigate and handle the matter.',
    'Earlier on dingyou Mianxing sought to change Hui tribute collection; Jinglian went to Aksu to investigate.',
  ],
  s0202: [
    'By this time Jinglian impeached again; Mianxing was stripped of office and soon banished to Jilin.',
    'Jinglian impeached again; Mianxing lost office and was banished to Jilin.',
  ],
  s0203: [
    'Hui Prince Aimadte was released from custody and returned to Kuche.',
    'Hui Prince Aimadte was released and returned to Kuche.',
  ],
  s0204: [
    'An edict warned the great officials of the Muslim frontier not to impose surcharges again.',
    'Edict warned Muslim-frontier officials against surcharges.',
  ],
  s0205: [
    'Yingyun was ordered to investigate and forbid private mortgaging of Hui lands in the cities around Aksu.',
    'Yingyun was ordered to stop private mortgaging of Hui land around Aksu.',
  ],
  s0206: [
    'On day wuxu, Taiping rebels attacked Zhenjiang; Feng Zicai\'s army drove them back.',
    'On wuxu Taiping rebels hit Zhenjiang; Feng Zicai drove them back.',
  ],
  s0207: [
    'Nian rebels fled into Shuyang.',
    'Nian rebels fled into Shuyang.',
  ],
  s0208: [
    'An edict told Sengge Rinchen to attend to both north and south.',
    'Edict told Sengge Rinchen to watch both north and south.',
  ],
  s0209: [
    'Government troops recovered Shen County.',
    'Government troops recovered Shen County.',
  ],
  s0210: [
    'On day jihai, Lin Kui died.',
    'On jihai Lin Kui died.',
  ],
  s0211: [
    'Li Shizhong\'s army captured Jiangpu and Pukou.',
    'Li Shizhong took Jiangpu and Pukou.',
  ],
  s0212: [
    'Qingduan was removed from office; Qi Lin was ordered to Fujian to take over aid-Zhejiang military affairs.',
    'Qingduan was removed and Qi Lin went to Fujian for aid-Zhejiang affairs.',
  ],
  s0213: [
    'On day gengzi, Bao Chao was promoted to Zhejiang provincial military commander and Feng Zicai to Guangxi provincial military commander.',
    'On gengzi Bao Chao became Zhejiang commander and Feng Zicai Guangxi commander.',
  ],
  s0214: [
    'On day guimao, Qiao Songnian was ordered to supervise river-bank militia training.',
    'On guimao Qiao Songnian was told to supervise river militia.',
  ],
  s0215: [
    'On day bingwu, former Anhui governor Weng Tongshu, for losing Shouzhou and Dingyuan, was stripped of office and arrested; he was soon sentenced to death.',
    'On bingwu Weng Tongshu lost Shouzhou and Dingyuan, was stripped and arrested, and soon sentenced to death.',
  ],
  s0216: [
    'On day dingwei, additional coinage was ordered at Aksu.',
    'On dingwei more cash was minted at Aksu.',
  ],
  s0217: [
    'On day wushen, Wen Yu and others memorialized on Beitang defense affairs; it was approved.',
    'On wushen Wen Yu\'s Beitang defense plan was approved.',
  ],
  s0218: [
    'British and French troops remained stationed at the Dagu forts.',
    'British and French troops stayed at Dagu forts.',
  ],
  s0219: [
    'Yunnan government troops recovered Lijiang; Muslim rebels fled toward Kunming.',
    'Yunnan troops recovered Lijiang; Muslim rebels fled toward Kunming.',
  ],
  s0220: [
    'On day gengxu, Taiping rebels fled into Songjiang; government troops joined foreign forces to meet and attack them and won a great victory.',
    'On gengxu Taiping rebels fled into Songjiang; government and foreign troops routed them.',
  ],
  s0221: [
    'Foreign commander the American Ward, originally of Chinese nationality, was granted fourth-rank insignia and the peacock feather.',
    'American commander Ward was granted fourth-rank insignia and peacock feather.',
  ],
  s0222: [
    'On day renzi, Zhang Liangji was ordered to raise troops for Yunnan.',
    'On renzi Zhang Liangji was told to raise troops for Yunnan.',
  ],
  s0223: [
    'On day guichou, Zhaokedunbu and others were instructed to join in suppressing Nian rebels in the Hetao region.',
    'On guichou Zhaokedunbu and others were told to suppress Hetao Nian rebels.',
  ],
  s0224: [
    'First day of the second month, jiayin: government troops recovered Laifeng.',
    'On second-month jiayin, government troops recovered Laifeng.',
  ],
  s0225: [
    'On day yimao, by empress-dowager rescript the Emperor began study in Hongde Hall; Qi Junzao and Weng Xincun were appointed readers.',
    'On yimao the Emperor began study in Hongde Hall with Qi Junzao and Weng Xincun as readers.',
  ],
  s0226: [
    'On day bingchen, Zeng Guoquan was promoted Jiangsu provincial administration commissioner and ordered to handle military affairs without recusal.',
    'On bingchen Zeng Guoquan became Jiangsu administration commissioner for military affairs without recusal.',
  ],
  s0227: [
    'On day dingsi, Taiping rebels took Huangyan.',
    'On dingsi Taiping rebels took Huangyan.',
  ],
  s0228: [
    'Government troops relieved the sieges of Zhenjiang and Huizhou.',
    'Government troops relieved Zhenjiang and Huizhou.',
  ],
  s0229: [
    'On day xinyou, Xining commissioner Duohui and provincial commander Cheng Rui, for falsely reporting Salar rebels had submitted, were both stripped of office and referred for punishment; they were soon sentenced to death.',
    'On xinyou Duohui and Cheng Rui lied that Salars had submitted, were stripped, and soon sentenced to death.',
  ],
  s0230: [
    'Yue Bin was stripped of office for shielding offenders and banished to Xinjiang.',
    'Yue Bin was stripped for shielding offenders and banished to Xinjiang.',
  ],
  s0231: [
    'On day renxu, Du Xing\'a was ordered to post troops at Tianchang and Luhe; Li Shizhong moved his army to Jiangpu and Pukou—to cooperate in harmony.',
    'On renxu Du Xing\'a garrisoned Tianchang and Luhe and Li Shizhong moved to Jiangpu and Pukou for joint action.',
  ],
  s0232: [
    'Taiping rebels took Anyi but it was soon recovered.',
    'Taiping rebels took Anyi, which was soon recovered.',
  ],
  s0233: [
    'On day guihai, Nian rebels besieged Qi County.',
    'On guihai Nian rebels besieged Qi County.',
  ],
  s0234: [
    'On day jiazi, the ancient emperors\' deeds and memorials of ministers past and present presented by Woren were arranged for lecture in Hongde Hall.',
    'On jiazi Woren\'s texts on emperors and memorials were lectured in Hongde Hall.',
  ],
  s0235: [
    'On day yichou, Sengge Rinchen\'s army won a great victory over Nian rebels; the bandits fled from Qi County toward Tongxu and were pursued.',
    'On yichou Sengge Rinchen routed Nian rebels who fled Qi County toward Tongxu and were pursued.',
  ],
  s0236: [
    'On day wuchen, Shi Dakai fled into Fengdu.',
    'On wuchen Shi Dakai fled into Fengdu.',
  ],
  s0237: [
    'Tian Xingyu\'s request to resign as Imperial Commissioner, lead his troops to Sichuan, and come under Luo Bingzhang\'s command was granted.',
    'Tian Xingyu was allowed to resign commissioner, take troops to Sichuan, and serve under Luo Bingzhang.',
  ],
  s0238: [
    'Han Chao was ordered to plan Guizhou defense and suppression.',
    'Han Chao was ordered to plan Guizhou defense.',
  ],
  s0239: [
    'On day jisi, Xue Huan reported joining British and French forces to attack the Gaobridge rebel fort and capturing it.',
    'On jisi Xue Huan captured the Gaobridge fort with British and French troops.',
  ],
  s0240: [
    'The American Ward, originally naturalized Chinese, was granted fourth-rank insignia and the peacock feather.',
    'American Ward was granted fourth-rank insignia and peacock feather.',
  ],
  s0241: [
    'On day renshen, Taiping rebels from Jinling crossed the river and raided Jiangpu and other places.',
    'On renshen Jinling Taiping rebels crossed the river and raided Jiangpu.',
  ],
  s0242: [
    'An edict told Zeng Guofan and Du Xing\'a to detach gunboats and intercept them.',
    'Edict told Zeng Guofan and Du Xing\'a to intercept with gunboats.',
  ],
  s0243: [
    'On day guiyou, Duolong\'a\'s army advanced to attack Luzhou.',
    'On guiyou Duolong\'a\'s army attacked Luzhou.',
  ],
  s0244: [
    'On day bingzi, because Zhujing near Shanghai had fallen, Provincial Commander Zeng Bingzhong was stripped of office.',
    'On bingzi Zeng Bingzhong lost office for Zhujing\'s fall near Shanghai.',
  ],
  s0245: [
    'Shanghai government troops joined British and French forces to destroy the Xiaotang rebel fort.',
    'Shanghai and Anglo-French forces destroyed the Xiaotang fort.',
  ],
  s0246: [
    'Chonghou and Cheng Ming were ordered to supervise Tianjin coastal defense.',
    'Chonghou and Cheng Ming were told to supervise Tianjin coastal defense.',
  ],
  s0247: [
    'On day dingchou, the hereditary ranks of the Prince of Zheng and Prince of Yi were restored.',
    'On dingchou the Zheng and Yi princes\' ranks were restored.',
  ],
  s0248: [
    'An edict told Li Xuyi to settle displaced persons in northern Anhui.',
    'Edict told Li Xuyi to settle northern Anhui refugees.',
  ],
  s0249: [
    'That month, scheduled tax quotas for Tingzhou and other disturbed places were remitted.',
    'That month Tingzhou and other disturbed places\' tax quotas were remitted.',
  ],
  s0250: [
    'First day of the third month, guiwei: Nian rebels fled into Taihe.',
    'On third-month guiwei Nian rebels fled into Taihe.',
  ],
  s0251: [
    'On day jiashen, British and French dispatch of gunboats to the Yangtze to assist defense and suppression was approved.',
    'On jiashen Anglo-French Yangtze gunboats for joint defense were approved.',
  ],
  s0252: [
    'On day bingxu, Taiping rebels fled toward Shanghai; Xue Huan\'s army defeated them.',
    'On bingxu Xue Huan\'s army defeated Taiping rebels near Shanghai.',
  ],
  s0253: [
    'On day wuzi, bandits took Qingtian.',
    'On wuzi bandits took Qingtian.',
  ],
  s0254: [
    'Zheng Yuanshan\'s request that mourning administration commissioner Zhang Yao be put solely in charge of bandit suppression was granted.',
    'Zhang Yao in mourning was put solely in charge of suppression.',
  ],
  s0255: [
    'On day gengyin, as there had been no rain since the first month, an edict ordered self-examination and sought forthright counsel.',
    'On gengyin drought since the first month led to edict for self-examination and frank counsel.',
  ],
  s0256: [
    'Zuo Zongtang recovered Suian.',
    'Zuo Zongtang recovered Suian.',
  ],
  s0257: [
    'Song Jingshi\'s surrendered followers rebelled at Lanyi.',
    'Song Jingshi\'s surrendered followers rebelled at Lanyi.',
  ],
  s0258: [
    'On day renchen, Taiping rebels attacked Lu, He, and Jiangpu.',
    'On renchen Taiping rebels attacked Lu, He, and Jiangpu.',
  ],
  s0259: [
    'On day jiawu, Sheng Bao\'s army advanced to relieve Yingzhou and won a great victory.',
    'On jiawu Sheng Bao relieved Yingzhou in a great victory.',
  ],
  s0260: [
    'On day bingshen, Zheng Yuanshan proposed recalling Song Jingshi to serve meritoriously despite guilt; it was approved.',
    'On bingshen recalling Song Jingshi to serve despite guilt was approved.',
  ],
  s0261: [
    'On day wuxu, Li Xuyi and Zheng Yuanshan were ordered to assist Sheng Bao\'s military affairs.',
    'On wuxu Li Xuyi and Zheng Yuanshan were told to assist Sheng Bao.',
  ],
  s0262: [
    'On day xinchou, former prefectural intendant Zhuang Qiling, summoned, presented twelve measures: uphold orthodox learning, open the regular path, limit allowances and transit levies, and secure military supplies.',
    'On xinchou Zhuang Qiling presented twelve reform measures on learning, office, levies, and military supply.',
  ],
  s0263: [
    'They were approved except stopping yanglian salaries and investigating petty irregularities, which were disallowed as harmful to administration.',
    'Approved except stopping yanglian and investigating petty fees, deemed harmful to government.',
  ],
  s0264: [
    'An edict ordered the provinces to recommend filial and upright scholars, seeking true Confucians.',
    'Edict ordered provinces to recommend true Confucian filial scholars.',
  ],
  s0265: [
    'On day guimao, Shen Zhaolin was ordered to lead troops to Xining to suppress Salar rebels.',
    'On guimao Shen Zhaolin was told to suppress Salars at Xining.',
  ],
  s0266: [
    'On day yisi, the longevity festival: congratulations were suspended.',
    'On yisi longevity festival congratulations were suspended.',
  ],
  s0267: [
    'On day bingwu, Zeng Guofan was urged to detach troops to aid Huzhou.',
    'On bingwu Zeng Guofan was urged to aid Huzhou.',
  ],
  s0268: [
    'On day dingwei, the compilation of emperors\' governance and former histories of regency was completed, entitled Mirror of Ordered Peace.',
    'On dingwei the Mirror of Ordered Peace on governance and regency was completed.',
  ],
  s0269: [
    'On day jiyou, Censor-in-Chief Yan Duanshu was sent to Guangdong to supervise likin; Wu Tang supervised north-of-the-Yangtze militia.',
    'On jiyou Yan Duanshu supervised Guangdong likin and Wu Tang north-Yangtze militia.',
  ],
  s0270: [
    'Xue Huan was ordered to serve as Minister for Trade with first-rank insignia.',
    'Xue Huan became trade minister with first-rank insignia.',
  ],
  s0271: [
    'Li Hongzhang was made acting Jiangsu governor.',
    'Li Hongzhang acted as Jiangsu governor.',
  ],
  s0272: [
    'Jingkou deputy commander-in-chief Hai Quan failed in suppressing bandits and died.',
    'Hai Quan died after a failed bandit campaign at Jingkou.',
  ],
  s0273: [
    'On day renzi, both old and new tribute items due from the Muslim frontier were remitted.',
    'On renzi Muslim-frontier tribute items were remitted.',
  ],
  s0274: [
    'That month the Emperor personally went to the Grand High Hall to pray for rain three times.',
    'That month the Emperor prayed for rain at the Grand High Hall thrice.',
  ],
  s0275: [
    'Fourth month, jiayin: an edict told commanders to be careful with provisions and cut waste.',
    'In fourth-month jiayin commanders were told to guard provisions and cut waste.',
  ],
  s0276: [
    'Jing Qijun presented Mirrors of Rulers Through the Ages; the Emperor praised and accepted it.',
    'Jing Qijun\'s Mirrors of Rulers was praised and accepted.',
  ],
  s0277: [
    'On day yimao, Luo Bingzhang\'s memorial to retain Tian Xingyu in charge of Guizhou military affairs was granted.',
    'On yimao Tian Xingyu stayed on Guizhou military affairs.',
  ],
  s0278: [
    'On day dingsi, Taiping rebels took Yiyang but it was soon recovered.',
    'On dingsi Taiping rebels took Yiyang, which was soon recovered.',
  ],
  s0279: [
    'On day wuwu, it rained.',
    'On wuwu it rained.',
  ],
  s0280: [
    'Bao Chao\'s army recovered Qingyang.',
    'Bao Chao recovered Qingyang.',
  ],
  s0281: [
    'Zeng Guoquan\'s army recovered Chao County, Hanshan, and Hezhou.',
    'Zeng Guoquan recovered Chao, Hanshan, and Hezhou.',
  ],
  s0282: [
    'On day jiwei, Pu Chengyao was banished to the military garrison.',
    'On jiwei Pu Chengyao was banished to the military garrison.',
  ],
  s0283: [
    'Zeng Guofan and others said Jiangsu gentry had asked to borrow British and French troops to recover Suzhou and Changzhou—this must absolutely not be done.',
    'Zeng Guofan said borrowing Anglo-French troops for Suzhou and Changzhou must not be done.',
  ],
  s0284: [
    'The Emperor approved their counsel.',
    'The Emperor approved.',
  ],
  s0285: [
    'Li Hongzhang was ordered to reorganize Ward\'s Ever-Victorious Army.',
    'Li Hongzhang was ordered to reorganize Ward\'s Ever-Victorious Army.',
  ],
  s0286: [
    'Taiping rebel Li Shixian fled into Jiangxi; Shen Baozhen went to Guangxin to supervise defense and suppression.',
    'Li Shixian fled into Jiangxi; Shen Baozhen supervised defense at Guangxin.',
  ],
  s0287: [
    'Belgium requested treaty revision; Xue Huan was instructed to deliberate and handle it properly.',
    'Belgium sought treaty revision; Xue Huan was told to handle it.',
  ],
  s0288: [
    'On day gengshen, Empress Xiaojing Cheng was given the posthumous title Empress Xiaojing Kangci Yizhao Duanhui Bitian Fusheng Cheng.',
    'On gengshen Empress Xiaojing Cheng received her posthumous title.',
  ],
  s0289: [
    'On day renxu, Xue Huan was made plenipotentiary to handle Belgian trade affairs.',
    'On renxu Xue Huan became plenipotentiary for Belgian trade.',
  ],
  s0290: [
    'On day guihai bandits took Hanzhong; on day yichou Sichuan troops recovered Qingshen; Zuo Zongtang relieved the sieges of Quzhou and Jiangshan.',
    'On guihai Hanzhong fell; on yichou Sichuan recovered Qingshen and Zuo relieved Quzhou and Jiangshan.',
  ],
  s0291: [
    'On day bingyin, Nian leader Zhang Luoxing fled north; Sengge Rinchen and others were instructed to prepare defenses.',
    'On bingyin Zhang Luoxing fled north; Sengge Rinchen was told to prepare defense.',
  ],
  s0292: [
    'Because Fujian troops had suffered defeat, Qingduan had concealed reports and was sternly rebuked.',
    'Qingduan was sternly rebuked for concealing Fujian defeats.',
  ],
  s0293: [
    'On day wuchen, Zeng Zhengan recovered Fanchang; Bao Chao recovered Shidai, Taiping, and Jing County.',
    'On wuchen Zeng Zhengan recovered Fanchang and Bao Chao Shidai, Taiping, and Jing.',
  ],
  s0294: [
    'Shanghai forces with British and French troops leveled the Nanxiang rebel fort and recovered Jiading; on day gengwu Du Xing\'a defeated bandits fleeing from Yangzhou.',
    'Shanghai and Anglo-French forces took Nanxiang and Jiading; on gengwu Du Xing\'a defeated Yangzhou fugitives.',
  ],
  s0295: [
    'Government troops recovered Yingshang.',
    'Government troops recovered Yingshang.',
  ],
  s0296: [
    'Taiping rebels took Xiaoyi and Zhen\'an.',
    'Taiping rebels took Xiaoyi and Zhen\'an.',
  ],
  s0297: [
    'Henan troops recovered Yongning.',
    'Henan troops recovered Yongning.',
  ],
  s0298: [
    'On day xinwei, for illegally imposing surcharges and killing Hui people without authority, Yarkand Akim Beg Prince Akilayidu was stripped of his princedom and Yingyun was punished; on day renshen, Xi\'an deputy commander Ulandu failed in suppressing bandits, and Guanwen and Zheng Yuanshan were told to detach troops to Shaanxi.',
    'On xinwei Prince Akilayidu lost his rank and Yingyun was punished; on renshen Ulandu\'s failure led to troops for Shaanxi.',
  ],
  s0299: [
    'On day bingzi, Taiwan secret-society rebels took Zhanghua.',
    'On bingzi Taiwan rebels took Zhanghua.',
  ],
  s0300: [
    'Taiping rebels fled and threatened Xi\'an; Guanwen and Zheng Yuanshan were urged to command troops for joint suppression.',
    'Taiping rebels threatened Xi\'an; Guanwen and Zheng Yuanshan were urged to suppress them jointly.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b03.mjs <translation.json>'
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
