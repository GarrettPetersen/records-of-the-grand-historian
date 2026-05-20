#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day jiazi, the court halted at Shacheng Fort.',
    'On jiazi day, the court halted at Shacheng Fort.',
  ],
  s0702: [
    'By empress dowager decree, Cen Chunxuan was ordered to supervise the forward grain depots.',
    'By empress dowager decree, Cen Chunxuan took charge of forward grain supply.',
  ],
  s0703: [
    'On day dingchou, the court halted at Jiming Post; an edict confessed fault and admonished officials at home and abroad.',
    'On dingchou day, at Jiming Post, the emperor confessed fault and admonished all officials.',
  ],
  s0704: [
    'On day bingyin, the court halted at Xuanhua.',
    'On bingyin day, the court halted at Xuanhua.',
  ],
  s0705: [
    'Wan Benhua, Sun Wanlin, and Qi Kechenbu were placed under Ma Yukun\'s command and stationed on the rear route.',
    'Wan Benhua, Sun Wanlin, and Qi Kechenbu were assigned to Ma Yukun on the rear line.',
  ],
  s0706: [
    'On day dingmao, an edict sought forthright counsel.',
    'On dingmao day, the court sought frank advice.',
  ],
  s0707: [
    'Land tax and grain levies were remitted for one year in Wanping, Changping, and other districts along the imperial route.',
    'Taxes and grain were remitted one year along the route at Wanping, Changping, and elsewhere.',
  ],
  s0708: [
    'Eighth month, new moon on day gengwu: the court halted at Zuowei.',
    'At the eighth-month new moon, the court halted at Zuowei.',
  ],
  s0709: [
    'On day xinwei, the court halted at Huai\'an.',
    'On xinwei day, the court halted at Huai\'an.',
  ],
  s0710: [
    'On day renshen, the court halted at Tianzhen.',
    'On renshen day, the court halted at Tianzhen.',
  ],
  s0711: [
    'Yikuang was recalled to the capital to join Li Hongzhang in peace negotiations.',
    'Yikuang was recalled to Beijing to negotiate peace with Li Hongzhang.',
  ],
  s0712: [
    'On day guiyou, the court halted at Yanggao.',
    'On guiyou day, the court halted at Yanggao.',
  ],
  s0713: [
    'On day jiaxu, the court halted at Jule Town.',
    'On jiaxu day, the court halted at Jule Town.',
  ],
  s0714: [
    'The eunuch Zhang Tianshun disturbed post stations and was executed.',
    'Eunuch Zhang Tianshun was executed for harassing relay stations.',
  ],
  s0715: [
    'On day yihai, the court halted at Datong.',
    'On yihai day, the court halted at Datong.',
  ],
  s0716: [
    'Liu Kunyi and Zhang Zhidong were ordered to confer on peace terms.',
    'Liu Kunyi and Zhang Zhidong were told to confer on peace.',
  ],
  s0717: [
    'Zaiyi was made a Grand Councilor.',
    'Zaiyi joined the Grand Council.',
  ],
  s0718: [
    'On day wuyin, traveling stipends in silver were granted to accompanying princes and officials great and small.',
    'On wuyin day, silver stipends were granted to the imperial escort.',
  ],
  s0719: [
    'On day jimao, the court halted at Huairen.',
    'On jimao day, the court halted at Huairen.',
  ],
  s0720: [
    'Ministers, directors, and bureau chiefs at the capital, and inner-court attendants except those left in Beijing, were all ordered to lead their subordinates to the traveling court.',
    'Capital department heads and inner-court staff not left in Beijing were ordered to the traveling court with their staffs.',
  ],
  s0721: [
    'On day xinsi, the court halted at Guangwu Town.',
    'On xinsi day, the court halted at Guangwu Town.',
  ],
  s0722: [
    'Cheng Wenbing was ordered to command troops stationed at Tong Pass.',
    'Cheng Wenbing was posted with troops at Tong Pass.',
  ],
  s0723: [
    'On day renwu, the court halted at Yangming Fort.',
    'On renwu day, the court halted at Yangming Fort.',
  ],
  s0724: [
    'Ronglu was instructed to gather and reorganize the Wuyi Central Army.',
    'Ronglu was told to reorganize the Wuyi Central Army.',
  ],
  s0725: [
    'On day guiwei, the court halted at Yuanping Town.',
    'On guiwei day, the court halted at Yuanping Town.',
  ],
  s0726: [
    'Ting Yong was instructed to supervise suppression of Boxers in metropolitan Zhili.',
    'Ting Yong was told to suppress Boxers in Zhili.',
  ],
  s0727: [
    'On day jiashen, the court halted at Xinzhou.',
    'On jiashen day, the court halted at Xinzhou.',
  ],
  s0728: [
    'On day bingxu, the court halted at Taiyuan and took the governor\'s yamen as the traveling palace.',
    'On bingxu day, the court halted at Taiyuan in the governor\'s yamen.',
  ],
  s0729: [
    'Quota levies for the current year were remitted in Tianzhen, Yanggao, and other districts along the route.',
    'This year\'s quota levies were remitted along the route at Tianzhen, Yanggao, and elsewhere.',
  ],
  s0730: [
    'On day dinghai, Xi\'an and other prefectures suffered drought.',
    'On dinghai day, Xi\'an prefectures reported drought.',
  ],
  s0731: [
    'On day wuzi, Ronglu was instructed to restrain the Wuyi Central Army.',
    'On wuzi day, Ronglu was told to restrain the Wuyi Central Army.',
  ],
  s0732: [
    'On day guisi, an edict told local officials to encourage farming and teach the people peace; Boxers who had been coerced were ordered back to agriculture.',
    'On guisi day, officials were told to restore farming and coerced Boxers were sent back to the fields.',
  ],
  s0733: [
    'On day yiwei, disaster relief was given in Sichuan\'s subordinate districts.',
    'On yiwei day, Sichuan disaster districts received relief.',
  ],
  s0734: [
    'Intercalary eighth month, new moon on day gengzi: flood relief was given in Lishui and other counties.',
    'At the intercalary eighth-month new moon, Lishui and other counties received flood relief.',
  ],
  s0735: [
    'On day xinchou, the German minister Clemens von Ketteler was mourned; Kun Gang was sent to offer libations.',
    'On xinchou day, Envoy Ketteler was mourned and Kun Gang was sent to offer rites.',
  ],
  s0736: [
    'For shielding Boxers and provoking conflict, Prince Zhuang Zaiqun, Prince Yi Pu Jing, and Beile Zailian and Zaiying were stripped of rank.',
    'For protecting Boxers, Prince Zhuang, Prince Yi, and Beile Zailian and Zaiying lost their titles.',
  ],
  s0737: [
    'Zaiyi, Zailan, Gangyi, Zhao Shuqiao, and Ying Nian were dismissed and referred to the Boards for deliberation.',
    'Zaiyi, Zailan, Gangyi, Zhao Shuqiao, and Ying Nian lost office and were sent to the Boards.',
  ],
  s0738: [
    'Lu Chuanlin was made a Grand Councilor.',
    'Lu Chuanlin joined the Grand Council.',
  ],
  s0739: [
    'On day renyin, because Japanese secretary Sugiyama Akira had been killed, Natong was sent to Japan to offer condolences and gifts.',
    'On renyin day, Natong was sent to Japan after secretary Sugiyama was killed.',
  ],
  s0740: [
    'Yu Xian was dismissed.',
    'Yu Xian lost office.',
  ],
  s0741: [
    'On day yisi, an edict announced the journey to Xi\'an.',
    'On yisi day, the court announced travel to Xi\'an.',
  ],
  s0742: [
    'On day dingwei, the imperial procession set out.',
    'On dingwei day, the court resumed the journey.',
  ],
  s0743: [
    'That day the court halted at Xugou.',
    'That day the court halted at Xugou.',
  ],
  s0744: [
    'On day wushen, the court halted at Qi County.',
    'On wushen day, the court halted at Qi County.',
  ],
  s0745: [
    'On day jiyou, the court halted at Pingyao.',
    'On jiyou day, the court halted at Pingyao.',
  ],
  s0746: [
    'On day gengxu, the court halted at Jiexiu.',
    'On gengxu day, the court halted at Jiexiu.',
  ],
  s0747: [
    'On day xinhai, the court halted at Lingshi.',
    'On xinhai day, the court halted at Lingshi.',
  ],
  s0748: [
    'On day renzi, the court halted at Huo Prefecture.',
    'On renzi day, the court halted at Huo Prefecture.',
  ],
  s0749: [
    'Ronglu was summoned to the traveling court.',
    'Ronglu was summoned to the traveling court.',
  ],
  s0750: [
    'On day jiayin, an edict made the Shaanxi governor\'s yamen the traveling palace.',
    'On jiayin day, the Shaanxi governor\'s yamen became the traveling palace.',
  ],
  s0751: [
    'On day yimao, the court halted at Pingyang.',
    'On yimao day, the court halted at Pingyang.',
  ],
  s0752: [
    'On day bingchen, the court halted at Shicun Post.',
    'On bingchen day, the court halted at Shicun Post.',
  ],
  s0753: [
    'The five northern provinces were instructed strictly to arrest self-styled league factions.',
    'The five northern provinces were told strictly to arrest secret societies.',
  ],
  s0754: [
    'On day wuwu, the court halted at Wenxi.',
    'On wuwu day, the court halted at Wenxi.',
  ],
  s0755: [
    'On day jiwei, because of the western journey, tomb-shrines and altars had long lacked worship; Yikuang was ordered to choose collateral princes and beile to offer at the Imperial Ancestral Temple and sacrifice at the Eastern and Western Mausoleums, and the Court of Imperial Sacrifices was to dispatch officers for altar temples.',
    'On jiwei day, Yikuang chose princes to sacrifice at temples and mausoleums while the Court of Imperial Sacrifices sent officers to altars.',
  ],
  s0756: [
    'Soon New Year\'s Eve and next New Year\'s rites were also ordered performed by substitutes.',
    'Substitutes were soon appointed for New Year\'s Eve and New Year\'s Day rites.',
  ],
  s0757: [
    'Nearby provinces were urgently told to remit funds to the capital for salaries and grain of officials and troops in Beijing.',
    'Nearby provinces were urgently told to send funds for Beijing officials\' pay and grain.',
  ],
  s0758: [
    'Yikuang was given plenipotentiary powers to negotiate the peace treaty with Li Hongzhang; Liu Kunyi and Zhang Zhidong continued to confer.',
    'Yikuang was made plenipotentiary with Li Hongzhang; Liu Kunyi and Zhang Zhidong kept conferring.',
  ],
  s0759: [
    'On day xinyou, the court halted at Linjin.',
    'On xinyou day, the court halted at Linjin.',
  ],
  s0760: [
    'On day guihai, the court halted at Pu Prefecture.',
    'On guihai day, the court halted at Pu Prefecture.',
  ],
  s0761: [
    'Jiangsu and other provinces were instructed to remit one million taels to supply Beijing pay and rations.',
    'Jiangsu and other provinces were told to send one million taels for Beijing pay and rations.',
  ],
  s0762: [
    'Quota levies for the current year were remitted in Taiyuan, Yangqu, and other subordinate districts along the route.',
    'This year\'s quota levies were remitted at Taiyuan, Yangqu, and along the route.',
  ],
  s0763: [
    'On day yichou, the court halted at Tong Pass.',
    'On yichou day, the court halted at Tong Pass.',
  ],
  s0764: [
    'Flood relief was given in Fuzhou.',
    'Fuzhou received flood relief.',
  ],
  s0765: [
    'On day dingmao, the court halted at Huayin.',
    'On dingmao day, the court halted at Huayin.',
  ],
  s0766: [
    'Jingxin and Pu Xing were ordered to manage the Tiger Spirit Camp.',
    'Jingxin and Pu Xing took charge of the Tiger Spirit Camp.',
  ],
  s0767: [
    'On day wuchen, the court halted at Hua Prefecture.',
    'On wuchen day, the court halted at Hua Prefecture.',
  ],
  s0768: [
    'Ninth month, new moon on day jisi: the court halted at Weinan.',
    'At the ninth-month new moon, the court halted at Weinan.',
  ],
  s0769: [
    'On day renshen, the court reached Xi\'an Prefecture and took the governor\'s yamen as the traveling palace.',
    'On renshen day, the court reached Xi\'an and lodged in the governor\'s yamen.',
  ],
  s0770: [
    'On day jiashen, Yu Gang was made resident minister in Tibet.',
    'On jiashen day, Yu Gang became resident minister in Tibet.',
  ],
  s0771: [
    'On day bingzi, hereditary rank was granted to the martyred libationer Wang Yirong, and his wife Lady Xie and daughter-in-law Lady Zhang were honored.',
    'On bingzi day, Wang Yirong received a hereditary post and his wife and daughter-in-law were honored.',
  ],
  s0772: [
    'On day yimao, Li Hongzhang memorialized the execution of circuit intendant Tan Wenhuan, who had abetted bandits and stirred disorder.',
    'On yimao day, Li Hongzhang reported executing Tan Wenhuan for abetting rebels.',
  ],
  s0773: [
    'On day renwu, Germans took Zijing Pass; Provincial Administration Commissioner Sheng Yun withdrew troops to Fotuyu.',
    'On renwu day, Germans took Zijing Pass and Sheng Yun fell back to Fotuyu.',
  ],
  s0774: [
    'Soon he reported German troops had withdrawn to Yizhou; the throne rebuked him sharply for alarmism.',
    'Soon Sheng Yun reported German withdrawal; the throne sharply rebuked his alarmism.',
  ],
  s0775: [
    'On day jichou, the Baode tribute of Yellow River ice fish was abolished.',
    'On jichou day, Baode\'s tribute of Yellow River ice fish ended.',
  ],
  s0776: [
    'On day gengyin, Zaiyi was stripped of rank; with Zaiqun, Pu Jing, and Zaiying he was handed to the Imperial Clan Court for house arrest.',
    'On gengyin day, Zaiyi lost rank and he, Zaiqun, Pu Jing, and Zaiying were confined by the Clan Court.',
  ],
  s0777: [
    'Zailan and Ying Nian were demoted one rank in the golden tally system.',
    'Zailan and Ying Nian were demoted one tally rank.',
  ],
  s0778: [
    'Zhao Shuqiao was stripped of office but kept on duty.',
    'Zhao Shuqiao lost rank but stayed on duty.',
  ],
  s0779: [
    'Gangyi died of illness and was exempted from further deliberation.',
    'Gangyi died and was spared further punishment.',
  ],
  s0780: [
    'Yu Xian was banished to the extreme frontier.',
    'Yu Xian was exiled to the remote frontier.',
  ],
  s0781: [
    'On day renchen, posthumous honors were granted to Heilongjiang General Yan Mao, Libationer Xiyuan, Reader Baofeng, Chongshou, and others who burned themselves with their families.',
    'On renchen day, Yan Mao, Xiyuan, Baofeng, Chongshou, and others who immolated with their families were honored.',
  ],
  s0782: [
    'On day yiwei, Shaanxi famine was relieved.',
    'On yiwei day, Shaanxi famine relief was ordered.',
  ],
  s0783: [
    'On day bingshen, overdue levies were remitted in Xianning and other Shaanxi counties.',
    'On bingshen day, overdue levies were remitted in Shaanxi counties including Xianning.',
  ],
  s0784: [
    'On day wuxu, overdue levies were remitted in Yunnan\'s prefectures and counties and native chieftaincies stricken by disaster.',
    'On wuxu day, overdue levies were remitted in disaster-stricken Yunnan districts and native offices.',
  ],
  s0785: [
    'Tenth month, winter, day wushen: on the empress dowager\'s birthday, banquets were suspended.',
    'In month 10, wushen, the empress dowager\'s birthday was marked without banquets.',
  ],
  s0786: [
    'On day gengxu, an edict said Dong Fuxiang did not understand foreign affairs and acted rashly; his title of regional commander was stripped but he remained on duty.',
    'On gengxu day, Dong Fuxiang lost his regional command but stayed on duty for rash conduct.',
  ],
  s0787: [
    'On day xinhai, four hundred thousand taels from the inner treasury were sent to relieve Shaanxi famine victims; Jiangsu, Hubei, and the Grand Canal were urged to purchase grain for transport.',
    'On xinhai day, 400,000 taels from the inner treasury went to Shaanxi famine relief and Jiangsu and Hubei were urged to buy grain.',
  ],
  s0788: [
    'On day guichou, Wang Wenshao was made Grand Secretary of the Bodies of Harmony; Chongli and Xu Ye were made associate grand secretaries.',
    'On guichou day, Wang Wenshao became a grand secretary and Chongli and Xu Ye associate grand secretaries.',
  ],
  s0789: [
    'On day dingsi, Gurkha, front and rear Tibet, and all native chieftaincies were told temporarily not to send tribute.',
    'On dingsi day, Gurkha, Tibet, and native chiefs were told to suspend tribute.',
  ],
  s0790: [
    'On day guihai, a substantive-office sale by contribution was opened in Shaanxi and Shanxi to relieve drought disaster.',
    'On guihai day, Shaanxi and Shanxi opened office-sale relief for drought.',
  ],
  s0791: [
    'Eleventh month, day renshen: five-tenths of Chang\'an\'s quota levies were remitted.',
    'In month 11, renshen, half of Chang\'an\'s quota levies was remitted.',
  ],
  s0792: [
    'On day yihai, Miao bandits led by Wang Laojiu and others rose at Qingping and were suppressed and captured by government troops.',
    'On yihai day, Wang Laojiu and other Miao rebels at Qingping were captured by government troops.',
  ],
  s0793: [
    'On day gengchen, Yang Ru was made plenipotentiary to negotiate with Russia the handover of the three eastern provinces.',
    'On gengchen day, Yang Ru was made plenipotentiary to negotiate Manchuria\'s return with Russia.',
  ],
  s0794: [
    'On day xinsi, because Changsha and other prefectures suffered drought, a relief contribution sale was opened.',
    'On xinsi day, a relief contribution sale opened for drought in Changsha and other prefectures.',
  ],
  s0795: [
    'On day renwu, two-tenths of quota levies were remitted in Shanxi prefectures and counties along the imperial route.',
    'On renwu day, two-tenths of quota levies was remitted in Shanxi along the route.',
  ],
  s0796: [
    'On day guiwei, Sheng Xuanhuai was made associate commissioner for commerce.',
    'On guiwei day, Sheng Xuanhuai became associate commissioner for commerce.',
  ],
  s0797: [
    'On day yiyou, Xu Shoupeng was ordered to the capital to assist in commercial treaties.',
    'On yiyou day, Xu Shoupeng was sent to Beijing for commercial treaties.',
  ],
  s0798: [
    'On day guisi, Anhui opened a war-funds contribution sale.',
    'On guisi day, Anhui opened a war-funds contribution sale.',
  ],
  s0799: [
    'On day bingyin, Zeng Qi was sentenced to severe deliberation for concluding a provisional pact with Russians on returning Fengtian without authorization; soon he was stripped of office.',
    'On bingyin day, Zeng Qi was severely punished for an unauthorized Fengtian pact with Russia and soon lost office.',
  ],
  s0800: [
    'Twelfth month, day jiachen: New Year\'s rites for the coming year were dispensed with.',
    'In month 12, jiachen, next year\'s New Year ceremonies were cancelled.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b08.mjs <translation.json>'
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

const missingInData = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missingInData.length) {
  console.error(`Missing: ${missingInData.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
