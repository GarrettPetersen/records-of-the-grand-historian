#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'On day bingzi, an edict reaffirmed that suburban sacrifice pairing would still take the three ancestors and five cult lords as fixed, and that the late emperor enshrined in the temple would be titled Zong.',
    'On bingzi day, suburban pairing was fixed at three ancestors and five cult lords and the late emperor\'s enshrinement was titled Zong.',
  ],
  s0102: [
    'Qi Junzao and Weng Xincun, grand secretaries on leave, and former Minister of Rites Li Tangjie were recalled to office.',
    'Grand secretaries Qi Junzao and Weng Xincun and ex-Rites Minister Li Tangjie were recalled.',
  ],
  s0103: [
    'Chen Fu\'en\'s household property was confiscated and he was imprisoned for punishment.',
    'Chen Fu\'en\'s property was seized and he was jailed for trial.',
  ],
  s0104: [
    'Government troops recovered Wuwei and Suizhou.',
    'The army retook Wuwei and Suizhou.',
  ],
  s0105: [
    'On day dingchou, court ministers were sternly admonished for routine dilatoriness in affairs.',
    'On dingchou day, ministers were rebuked for routine procrastination.',
  ],
  s0106: [
    'Guanwen, Zeng Guofan, and others were instructed to plan properly for suppressing and pacifying Miao militia.',
    'Guanwen, Zeng Guofan, and others were told to plan Miao militia suppression and pacification.',
  ],
  s0107: [
    'Cantonese rebels took Xiaoshan, Shaoxing, Jiangshan, and Changshan; Zuo Zongtang\'s army was urged to aid quickly.',
    'Rebels took Xiaoshan, Shaoxing, Jiangshan, and Changshan and Zuo Zongtang was urged to hurry relief.',
  ],
  s0108: [
    'On day jimao, the beile Delekeseleng was released from prison.',
    'On jimao day, Beile Delekeseleng was freed from prison.',
  ],
  s0109: [
    'On day xinsi, court ministers submitted regency curtain rules; the empress dowager\'s rescript approved them.',
    'On xinsi day, regency rules were submitted and approved by the empress dowager.',
  ],
  s0110: [
    'An edict opened a grace examination cycle.',
    'A grace civil exam was ordered.',
  ],
  s0111: [
    'Earlier, pearl fishing at Wula had been suspended for eight years.',
    'Wula pearl fishing had been stopped eight years earlier.',
  ],
  s0112: [
    'Now an edict ordered it still suspended.',
    'Now the court ordered it still suspended.',
  ],
  s0113: [
    'On day renwu, Chen Fu\'en was banished to Xinjiang.',
    'On renwu day, Chen Fu\'en was sent to Xinjiang exile.',
  ],
  s0114: [
    'Vice Ministers Bao Kun and Dong Xun were ordered to serve at the Zongli Yamen for foreign affairs.',
    'Bao Kun and Dong Xun were assigned to the Zongli Yamen.',
  ],
  s0115: [
    'On day jiashen, French troops left Tianjin.',
    'On jiashen day, French troops left Tianjin.',
  ],
  s0116: [
    'Eleventh month, day yiyou, first day: the Emperor led Empresses Dowager Cian and Cixi to attend to regency from behind the curtain at the Hall of Mental Cultivation.',
    'On month 11, yiyou, the Emperor installed Cian and Cixi for regency at Yangxin Hall.',
  ],
  s0117: [
    'On day bingxu, provinces were instructed on missionary cases: distinguish good from bad and handle impartially.',
    'On bingxu day, provinces were told to judge missionary disputes fairly by merit.',
  ],
  s0118: [
    'On day dinghai, penalties were fixed for embezzlers of the Ministry of Revenue\'s five-character bank notes.',
    'On dinghai day, embezzlement of Revenue five-character notes was made a defined crime.',
  ],
  s0119: [
    'Xi Lin and others were restored to office.',
    'Xi Lin and others regained office.',
  ],
  s0120: [
    'On day gengyin, each army was ordered to recommend military talent.',
    'On gengyin day, armies were ordered to recommend commanders.',
  ],
  s0121: [
    'On day renchen, Shandong sect rebels rose; Cheng Lu and others suppressed them and chief Yan Xiulun was executed.',
    'On renchen day, Shandong sect rebels were crushed by Cheng Lu and chief Yan Xiulun was executed.',
  ],
  s0122: [
    'On day jiawu: earlier Zhang Liangji had said Yunnan vice commander He Youbao killed Deng Erheng, suspecting Xu Zhiming as instigator.',
    'On jiawu day: Zhang Liangji had accused He Youbao of murdering Deng Erheng at Xu Zhiming\'s instigation.',
  ],
  s0123: [
    'Now Xu Zhiming falsely reported military merit and sought rewards for He Youbao; Fu Ji was ordered to investigate, Xu was removed and impeached severely.',
    'Xu Zhiming falsified merit for He Youbao; Fu Ji was told to investigate and Xu was removed and impeached.',
  ],
  s0124: [
    'On day yiwei, Shi Dakai fled into Suining.',
    'On yiwei day, Shi Dakai fled to Suining.',
  ],
  s0125: [
    'On day gengzi, the court and provinces were told to recommend talent on the models of Zeng Guofan, Hu Linyi, and Luo Bingzhang.',
    'On gengzi day, talent nomination was ordered on the example of Zeng, Hu, and Luo.',
  ],
  s0126: [
    'On day xinchou, rebels took Shaoxing and Zhuji; Wang Luqian was stripped and arrested for inquiry.',
    'On xinchou day, Shaoxing and Zhuji fell and Wang Luqian was dismissed and arrested.',
  ],
  s0127: [
    'On day renyin, Fu Ji was dismissed for timidity and opportunism.',
    'On renyin day, Fu Ji lost office for cowardice and tricks.',
  ],
  s0128: [
    'Pan Duo was granted second-rank insignia and acted as Yunnan-Guizhou governor-general.',
    'Pan Duo gained second rank and acted Yunnan-Guizhou governor-general.',
  ],
  s0129: [
    'Sengge Rinchen suppressed alliance rebels in Shouzhang and elsewhere with a great victory.',
    'Sengge Rinchen won a great victory over alliance rebels near Shouzhang.',
  ],
  s0130: [
    'On day guimao, Peng Yulin was ordered to assist Yuan Jiasan in military affairs.',
    'On guimao day, Peng Yulin was assigned to Yuan Jiasan\'s command.',
  ],
  s0131: [
    'Government troops recovered Lai\'an.',
    'The army retook Lai\'an.',
  ],
  s0132: [
    'On day yisi, Censor Gao Yanhu impeached Xu Zhiming for greed, lust, and absurdity, and Yunnan militia factions running wild.',
    'On yisi day, Gao Yanhu impeached Xu Zhiming for corruption and unchecked Yunnan militias.',
  ],
  s0133: [
    'Pan Duo was ordered to investigate.',
    'Pan Duo was told to investigate.',
  ],
  s0134: [
    'On day dingwei, provinces were edicted to recommend honest officials and seek men of learning fit for office.',
    'On dingwei day, provinces were told to recommend good officials and learned men.',
  ],
  s0135: [
    'On day gengxu, Wu Tang was made Jiangning financial commissioner, also acting transport commissioner and supervising the northern Jiangsu grain depot.',
    'On gengxu day, Wu Tang took Jiangning intendant, acting transport commissioner, and northern grain depot.',
  ],
  s0136: [
    'On day guichou, rebels took Chuzhou.',
    'On guichou day, rebels took Chuzhou.',
  ],
  s0137: [
    'Twelfth month, day jiayin, first day: Zeng Guofan was instructed to plan advance and suppression overall.',
    'On month 12, jiayin, Zeng Guofan was told to coordinate advance against rebels.',
  ],
  s0138: [
    'On day yimao, Tan Tingxiang was ordered to Dongchang to plan river defense.',
    'On yimao day, Tan Tingxiang was sent to Dongchang for river defense.',
  ],
  s0139: [
    'Sect rebels in Pu and Fan were pacified.',
    'Pu and Fan sect rebels were pacified.',
  ],
  s0140: [
    'On day dingsi, Sheng Bao memorialized receiving and pacifying rebel chiefs Liu Zhankao and Song Jingshi.',
    'On dingsi day, Sheng Bao reported pacifying chiefs Liu Zhankao and Song Jingshi.',
  ],
  s0141: [
    'On day wuwu, Guorui\'s army recovered Fan county.',
    'On wuwu day, Guorui retook Fan county.',
  ],
  s0142: [
    'Rebels took Ningbo, Zhenhai, and Shaoxing dependencies.',
    'Rebels took Ningbo, Zhenhai, and Shaoxing districts.',
  ],
  s0143: [
    'On day jiwei, salt administration was ordered reorganized.',
    'On jiwei day, salt administration was ordered reformed.',
  ],
  s0144: [
    'On day xinyou, Zuo Zongtang was ordered to hurry relief for Hangzhou; Zhang Yunlan returned to his command with sole memorial rights on military affairs.',
    'On xinyou day, Zuo was told to relieve Hangzhou and Zhang Yunlan regained sole military memorial rights.',
  ],
  s0145: [
    'On day renxu, Jiangning deputy commander Kuiyu was ordered to assist Zhenjiang military affairs.',
    'On renxu day, Kuiyu was assigned Zhenjiang command.',
  ],
  s0146: [
    'On Mao Hongbin\'s advice, governors and commanders were told to choose generals locally and not rely solely on Hunan braves.',
    'Mao Hongbin\'s memorial told commanders to pick local generals and not rely only on Hunan troops.',
  ],
  s0147: [
    'Yuan Jiasan\'s army recovered Dingyuan.',
    'Yuan Jiasan retook Dingyuan.',
  ],
  s0148: [
    'Nepal\'s routine tribute was allowed to be presented in the dingmao year instead.',
    'Nepal\'s routine tribute was shifted to the dingmao year.',
  ],
  s0149: [
    'On day yichou, Fujian alliance rebels took Fuding, soon recovered.',
    'On yichou day, Fujian rebels took Fuding but it was soon retaken.',
  ],
  s0150: [
    'Henan Nian bandits fled into Zaoyang.',
    'Henan Nian rebels raided Zaoyang.',
  ],
  s0151: [
    'On day dingmao, Zeng Guofan resigned command over four provinces\' military affairs; refused.',
    'On dingmao day, Zeng Guofan\'s resignation of four-province command was denied.',
  ],
  s0152: [
    'On day jisi, the late Empress Xiaode was given posthumous title Empress Xiaode Wen Hui Cheng Shun Ci Zhuang Gong Tian Zan Sheng Xian.',
    'On jisi day, the late Empress Xiaode received her full posthumous title.',
  ],
  s0153: [
    'Vice Minister of War Qingying was guilty, stripped of office, and banished to Xinjiang.',
    'War Vice Minister Qingying was dismissed and exiled to Xinjiang.',
  ],
  s0154: [
    'Qinghai\'s Jasagh beile Gangsengquduobu was made chief of the left wing league.',
    'Gangsengquduobu was made left-wing league chief in Qinghai.',
  ],
  s0155: [
    'On day xinwei, Yuke was dismissed and Shen Baozhen was promoted Jiangxi governor.',
    'On xinwei day, Yuke lost office and Shen Baozhen became Jiangxi governor.',
  ],
  s0156: [
    'Prince Gong and Prince Chun were ordered to supervise Rui Lin, Wen Xiang, and others in managing the Shenji Camp.',
    'Princes Gong and Chun were told to oversee Rui Lin and Wen Xiang in the Shenji Camp.',
  ],
  s0157: [
    'Zeng Guofan memorialized assigning circuit intendant Li Hongzhang to command land and river forces to Zhenjiang to recover Suzhou and Changzhou; approved.',
    'Zeng assigned Li Hongzhang to Zhenjiang to recover Suzhou and Changzhou; approved.',
  ],
  s0158: [
    'Deng-Lai-Qing circuit was fixed at Yantai, supervising East Sea customs revenue.',
    'Deng-Lai-Qing intendant was stationed at Yantai over East Sea customs.',
  ],
  s0159: [
    'On day renshen, Duanhua and Zaituan\'s hereditary ranks were reduced to auxiliary state dukes outside the eight privileges.',
    'On renshen day, Duanhua and Zaituan were demoted to junior auxiliary state dukes.',
  ],
  s0160: [
    'On day jiaxu, next year\'s quota land tax was remitted for rebel-stricken Anhui, Jiangsu, and Zhejiang.',
    'On jiaxu day, next year\'s land tax was forgiven in rebel-hit Anhui, Jiangsu, and Zhejiang.',
  ],
  s0161: [
    'On day yihai, Jiang Zhongyi\'s mourning leave was granted; Tian Xingyu acted Guizhou governor, soon replaced by Han Chao acting.',
    'On yihai day, Jiang Zhongyi\'s mourning was allowed; Tian Xingyu then Han Chao acted Guizhou governor.',
  ],
  s0162: [
    'Zhang Liangji was ordered to direct Yunnan military affairs; Xu Zhiming was removed as Yunnan governor and Liangji acted in his place.',
    'Zhang Liangji took Yunnan command and replaced Xu Zhiming as acting governor.',
  ],
  s0163: [
    'On day dingchou, Duolong\'a\'s army advanced on Luzhou.',
    'On dingchou day, Duolong\'a attacked Luzhou.',
  ],
  s0164: [
    'Shi Dakai fled into Yuanjiang and Qianyang, pressing Sichuan\'s border; Luo Bingzhang and Tian Xingyu were ordered to strike jointly.',
    'Shi Dakai fled toward Sichuan and Luo Bingzhang and Tian Xingyu were told to attack together.',
  ],
  s0165: [
    'Liang-Huai rebels took Hangzhou; Ruichang and Wang Youling died.',
    'Rebels took Hangzhou and Ruichang and Wang Youling were killed.',
  ],
  s0166: [
    'Min-Zhe governor-general Qingduan was stripped of office but kept on duty.',
    'Qingduan was dismissed but kept acting Min-Zhe governor-general.',
  ],
  s0167: [
    'Zuo Zongtang was made Zhejiang governor.',
    'Zuo Zongtang became Zhejiang governor.',
  ],
  s0168: [
    'Peng Yulin resigned the governorship, asked to focus solely on rebels; granted, and made river forces commander.',
    'Peng Yulin left the governorship to fight rebels full-time and became river commander.',
  ],
  s0169: [
    'Li Xuyi was transferred as Anhui governor and Yan Shusen as Hubei governor.',
    'Li Xuyi took Anhui and Yan Shusen took Hubei.',
  ],
  s0170: [
    'Zheng Yuanshan was made Henan governor.',
    'Zheng Yuanshan became Henan governor.',
  ],
  s0171: [
    'On day wuyin, Qi Junzao was made Minister of Rites with grand secretary rank.',
    'On wuyin day, Qi Junzao became Minister of Rites with grand secretary rank.',
  ],
  s0172: [
    'Peng Yulin was changed to await appointment as War vice minister.',
    'Peng Yulin was shifted to await War vice minister appointment.',
  ],
  s0173: [
    'On day gengchen, Nian bandits besieged Yingzhou.',
    'On gengchen day, Nian rebels besieged Yingzhou.',
  ],
  s0174: [
    'Sheng Bao impeached Yan Shusen; an edict told him to examine himself, preserve reputation, and match the late emperor\'s trust.',
    'Sheng Bao attacked Yan Shusen; the court told Yan to repent and keep his honor.',
  ],
  s0175: [
    'On Xue Huan\'s report, the Zongli Yamen was told to negotiate with Britain and France on borrowing troops to suppress rebels.',
    'Xue Huan\'s memorial told the Zongli Yamen to seek Anglo-French troops against rebels.',
  ],
  s0176: [
    'On day renwu, the late imperial brother the Second Imperial Son was posthumously enfeoffed Prince Min of the commandery.',
    'On renwu day, the Second Imperial Son was posthumously made Prince Min.',
  ],
  s0177: [
    'Zuo Zongtang was urged to advance into Zhejiang.',
    'Zuo Zongtang was urged to take Zhejiang.',
  ],
  s0178: [
    'Sheng Bao was ordered to lead his troops to Yingzhou.',
    'Sheng Bao was sent to Yingzhou with his force.',
  ],
  s0179: [
    'On day guiwei, Sengge Rinchen struck fleeing rebels on the Henan bank at Caozhou and destroyed them.',
    'On guiwei day, Sengge Rinchen destroyed fleeing rebels at Caozhou on the Henan bank.',
  ],
  s0180: [
    'First year of Tongzhi, renxu, spring, first month, jiashen, first day: Empresses Dowager Cian and Cixi attended Cining Palace; the Emperor led princes and ministers in ritual.',
    'Tongzhi year 1, month 1, jiashen: Cian and Cixi at Cining Palace and the Emperor led the court in homage.',
  ],
  s0181: [
    'He received congratulations at the Palace of Heavenly Purity.',
    'He received New Year homage at Qianqing Palace.',
  ],
  s0182: [
    'Thereafter it was done every year.',
    'This became the yearly practice.',
  ],
  s0183: [
    'Lin Kui and Zeng Guofan were ordered to assist as grand secretaries.',
    'Lin Kui and Zeng Guofan were made associate grand secretaries.',
  ],
  s0184: [
    'On day yiyou, an edict partly withdrew acre and transit levies, comforted campaign soldiers\' families, and soothed wounded and dead soldiers\' descendants.',
    'On yiyou day, acre and transit levies were partly withdrawn and campaign families were comforted.',
  ],
  s0185: [
    'Because Jiangxi was pacified, Bao Chao was granted the yellow riding jacket.',
    'Jiangxi\'s pacification earned Bao Chao a yellow jacket.',
  ],
  s0186: [
    'Li Shizhong recovered Luhe and received the same reward.',
    'Li Shizhong retook Luhe and received the same reward.',
  ],
  s0187: [
    'On day bingxu, Zeng Guofan and Zuo Zongtang were told to hold Quzhou and advance to lift the Huizhou siege.',
    'On bingxu day, Zeng and Zuo were told to secure Quzhou and relieve Huizhou.',
  ],
  s0188: [
    'Zeng Guofan was ordered to choose a general to defend Shanghai.',
    'Zeng Guofan was told to pick a general for Shanghai.',
  ],
  s0189: [
    'Jiang Yili\'s division was transferred to Zuo Zongtang\'s army.',
    'Jiang Yili\'s troops joined Zuo Zongtang.',
  ],
  s0190: [
    'On day gengyin, Sheng Bao moved his army to Yingzhou; Deputy Commander Zheikedunbu and Circuit Intendant Wang Rongji took over defense.',
    'On gengyin day, Sheng Bao went to Yingzhou and Zheikedunbu and Wang Rongji took over defense.',
  ],
  s0191: [
    'On day xinmao, Sichuan troops recovered Danleng and rebel chief Lan Chaoding was executed.',
    'On xinmao day, Danleng was retaken and chief Lan Chaoding was executed.',
  ],
  s0192: [
    'Government troops recovered Pingyue.',
    'The army retook Pingyue.',
  ],
  s0193: [
    'On day renchen, Li Shizhong\'s army recovered Tianchang.',
    'On renchen day, Li Shizhong retook Tianchang.',
  ],
  s0194: [
    'On day guisi, rebel Li Xiucheng took Fengxian, Nanhui, and Chuansha.',
    'On guisi day, Li Xiucheng took Fengxian, Nanhui, and Chuansha.',
  ],
  s0195: [
    'Duxing\'a was ordered to block Wusong mouth with gunboats.',
    'Duxing\'a was told to block Wusong with gunboats.',
  ],
  s0196: [
    'On day bingshen, Yue Bin was removed and investigated for indulging rebels and harming the people.',
    'On bingshen day, Yue Bin was dismissed for indulging rebels.',
  ],
  s0197: [
    'Lin Kui was ordered to act Shaanxi-Gansu governor-general and, with Shen Zhaolin, suppress and pacify the Salar Muslims.',
    'Lin Kui acted Shaanxi-Gansu governor and with Shen Zhaolin pacified the Salars.',
  ],
  s0198: [
    'Rebels fled pressing Shanghai.',
    'Rebels pressed toward Shanghai.',
  ],
  s0199: [
    'Xue Huan reported that British and French officers cooperated in defense and suppression.',
    'Xue Huan said British and French officers aided defense.',
  ],
  s0200: [
    'The Emperor praised it.',
    'The court praised this.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b02.mjs <translation.json>'
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
