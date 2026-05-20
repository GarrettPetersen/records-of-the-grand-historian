#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0901: [
    'Because of the Hanzhong setback, Provincial Administration Commissioner Mao Zhenshou was stripped of office.',
    'For the Hanzhong failure, administration commissioner Mao Zhenshou was dismissed.',
  ],
  s0902: [
    'Liu Changyou and Yan Jingming were ordered to handle postwar affairs in Zhili and Shandong.',
    'The court told Liu Changyou and Yan Jingming to manage Zhili and Shandong recovery.',
  ],
  s0903: [
    'On day gengwu, Censor Ma Yuanrui memorialized four items—light taxes, careful lawsuits, good pacification, and diligent public instruction—and they were carried out as requested.',
    'On gengwu day, Ma Yuanrui urged lighter taxes, careful justice, good local rule, and public teaching, and the court agreed.',
  ],
  s0904: [
    'That month, unpaid salt-field levies were remitted for Cangzhou and other districts in Zhili and Haifeng and other salterns in Shandong.',
    'That month, overdue saltern dues were waived in Zhili and Shandong.',
  ],
  s0905: [
    'Winter, tenth month, day yihai: Yan Jingming asked to complete mourning leave and was refused.',
    'In winter, month 10, on yihai day, Yan Jingming\'s request to finish mourning was denied.',
  ],
  s0906: [
    'Government troops captured Zhu Dengfeng and other bandits of the eastern and western Zhili factions and executed them all.',
    'Government forces caught Zhu Dengfeng and other Zhili bandits and put them all to death.',
  ],
  s0907: [
    'On day bingzi, Nian chieftain Zhang Zongyu fled south from Lushan and Nanzhao.',
    'On bingzi day, Nian leader Zhang Zongyu broke south from Lushan and Nanzhao.',
  ],
  s0908: [
    'On day jimao, Tao Maolin\'s army relieved the siege of Fengxiang and Tao Maolin was substantively appointed Gansu provincial commander.',
    'On jimao day, Tao Maolin lifted the Fengxiang siege and received substantive appointment as Gansu commander.',
  ],
  s0909: [
    'Brigade General Cheng Lu, in mourning, was ordered to remain with his camp.',
    'Mourning brigade general Cheng Lu was told to stay at his post.',
  ],
  s0910: [
    'Lay was withdrawn and Hart was placed in charge of the Inspectorate General of Customs.',
    'Lay was removed and Hart made inspector general of customs.',
  ],
  s0911: [
    'On day xinsi, Cantonese rebels raided Longsheng and Brigade General Hu Yuanchang died fighting.',
    'On xinsi day, Taiping raiders struck Longsheng and Hu Yuanchang was killed.',
  ],
  s0912: [
    'On day jiashen, Luo Bingzhang was ordered to divide his forces to suppress Dartsedo and open the Tibet road.',
    'On jiashen day, Luo Bingzhang was told to crush Dartsedo rebels and clear the Tibetan route.',
  ],
  s0913: [
    'French missionaries were ordered barred from entering Tibet to preach.',
    'The court blocked French missionaries from preaching in Tibet.',
  ],
  s0914: [
    'On day dinghai, remaining Chaoyang bandits raided Changtu.',
    'On dinghai day, Chaoyang remnant bandits harassed Changtu.',
  ],
  s0915: [
    'An edict urged all officials to practice strict economy.',
    'The throne ordered officials to practice austerity.',
  ],
  s0916: [
    'Jia Hongzhao was urged to hurry to Zhaotong.',
    'Jia Hongzhao was told to hurry to Zhaotong.',
  ],
  s0917: [
    'For donating horses, Jasagh taiji Mingzhu\'er was rewarded with the rank of beile.',
    'Mingzhu\'er was given beile rank for donating horses.',
  ],
  s0918: [
    'On day wuzi, Li Yunlin\'s army was defeated and Cantonese rebels took Shanyang in southern Shaanxi.',
    'On wuzi day, Li Yunlin lost and Taiping rebels took Shanyang in southern Shaanxi.',
  ],
  s0919: [
    'Zhang Zongyu raided into Dengzhou.',
    'Zhang Zongyu broke into Dengzhou.',
  ],
  s0920: [
    'Chieftains Lai, Cao, and others fled into Feng and Liangdang counties.',
    'Bandit chiefs Lai and Cao fled into Feng and Liangdang.',
  ],
  s0921: [
    'On day gengyin, Zuo Zongtang\'s army defeated entrenched rebels at Hangzhou and Yuhang.',
    'On gengyin day, Zuo Zongtang beat rebels holding Hangzhou and Yuhang.',
  ],
  s0922: [
    'On day renchen, Lan rebels took Zhouzhi.',
    'On renchen day, Lan rebels seized Zhouzhi.',
  ],
  s0923: [
    'On day guisi, mourning dress was overdue after its end, and Qi Junzao, Woren, and Li Hongzao asked to reject extravagance to strengthen imperial virtue.',
    'On guisi day, mourning had run overdue, and Qi Junzao, Woren, and Li Hongzao urged rejecting luxury to steady the throne.',
  ],
  s0924: [
    'An imperial rescript said: "Cast off fondness for trifles, sightseeing, and construction projects. Qi Junzao and the others are each to offer daily remonstrance, cultivate proper virtue, rectify the root of government, and strengthen personal conduct.',
    'The empress dowager ordered the emperor to reject trifles, tours, and building projects and told Qi Junzao and others to remonstrate daily and cultivate virtue.',
  ],
  s0925: [
    '"Rebel chieftain Gu Longxian submitted, and Shicheng, Taiping, and Jingde were recovered.',
    'Taiping chief Gu Longxian surrendered and Shicheng, Taiping, and Jingde were retaken.',
  ],
  s0926: [
    'The armies of Zeng Guoquan and others recovered Moling Pass.',
    'Zeng Guoquan\'s forces retook Moling Pass.',
  ],
  s0927: [
    'On day bingshen, Guangxi troops recovered Rong county.',
    'On bingshen day, Guangxi forces retook Rong county.',
  ],
  s0928: [
    'On day dingyou, the armies of Cheng Xueqi and others captured Xushuguan.',
    'On dingyou day, Cheng Xueqi and others took Xushuguan.',
  ],
  s0929: [
    'On day jihai, government troops missed their chance against Changtu bandits, and Yuming was rebuked for concealing the facts.',
    'On jihai day, troops bungled the Changtu bandits and Yuming was scolded for cover-up.',
  ],
  s0930: [
    'On day xinchou, Ying Gui was transferred to Fuzhou general and Shen Guifen was made acting Shanxi governor.',
    'On xinchou day, Ying Gui became Fuzhou general and Shen Guifen acting Shanxi governor.',
  ],
  s0931: [
    'On day guimao, Li Xiucheng reinforced Suzhou and the armies of Li Hezhang and others defeated him.',
    'On guimao day, Li Xiucheng relieved Suzhou and Li Hezhang\'s forces beat him back.',
  ],
  s0932: [
    'Fuming\'a was ordered to assist in Sengge Rinchen\'s military affairs.',
    'Fuming\'a was assigned to help Sengge Rinchen.',
  ],
  s0933: [
    'That month, old and new quota taxes were remitted for Yong\'an and other districts in Guangxi ravaged by disorder.',
    'That month, taxes were waived in ravaged Guangxi districts including Yong\'an.',
  ],
  s0934: [
    'Eleventh month, day bingwu: Fengtian bandits raided into Jilin and Yuming and others joined to suppress them.',
    'In the eleventh month, on bingwu day, Fengtian bandits entered Jilin and Yuming joined the suppression.',
  ],
  s0935: [
    'Anhui troops recovered Huaiyuan and Bengbu.',
    'Anhui forces retook Huaiyuan and Bengbu.',
  ],
  s0936: [
    'On day dingwei, Sengge Rinchen directed the armies in attacking Miao Peilin and executed him.',
    'On dingwei day, Sengge Rinchen attacked Miao Peilin and had him killed.',
  ],
  s0937: [
    'Li Hongzhang directed the army in recovering Suzhou and Cantonese chiefs Gao Yunguan and others surrendered.',
    'Li Hongzhang retook Suzhou and Taiping chiefs including Gao Yunguan surrendered.',
  ],
  s0938: [
    'Li Hongzhang was given Junior Guardian of the Heir Apparent rank, Cheng Xueqi a hereditary office, and both were granted yellow riding jackets.',
    'Li Hongzhang received Junior Guardian rank, Cheng Xueqi a hereditary post, and both yellow jackets.',
  ],
  s0939: [
    'On day wushen, rebel chiefs Yang Youqing and others surrendered Gaochun, Ningguo, Jianping, and Lishui.',
    'On wushen day, Yang Youqing and other rebel chiefs surrendered four counties.',
  ],
  s0940: [
    'Li Yunlin and others recovered Shanyang.',
    'Li Yunlin\'s forces retook Shanyang.',
  ],
  s0941: [
    'Guangdong troops recovered Xinyi.',
    'Guangdong forces retook Xinyi.',
  ],
  s0942: [
    'On day jiyou, the armies of Liu Dian and others recovered Changhua.',
    'On jiyou day, Liu Dian and others retook Changhua.',
  ],
  s0943: [
    'On day gengxu, Lan rebels fled into Shangnan.',
    'On gengxu day, Lan rebels broke into Shangnan.',
  ],
  s0944: [
    'On day guichou, Zhang Zongyu raided into Xichuan.',
    'On guichou day, Zhang Zongyu fled into Xichuan.',
  ],
  s0945: [
    'On day jiayin, Sengge Rinchen\'s army recovered Xiaocai and Shouzhou.',
    'On jiayin day, Sengge Rinchen retook Xiaocai and Shouzhou.',
  ],
  s0946: [
    'On day bingchen, Li Hongzhang executed Gao Yunguan and others and dispersed the surrendered masses.',
    'On bingchen day, Li Hongzhang killed Gao Yunguan and others and disbanded the surrenders.',
  ],
  s0947: [
    'On day dingsi, Li Hezhang\'s army took Wuxi and Jinque.',
    'On dingsi day, Li Hezhang took Wuxi and Jinque.',
  ],
  s0948: [
    'On day gengshen, Li Xuyi died.',
    'On gengshen day, Li Xuyi died.',
  ],
  s0949: [
    'Bandits Zhang Bengong and others in Qiu county rallied the crowd to resist tax grain and were captured and executed.',
    'Qiu county bandits led by Zhang Bengong resisted tax grain and were caught and killed.',
  ],
  s0950: [
    'Yan Jingming was substantively appointed Shandong governor.',
    'Yan Jingming received substantive appointment as Shandong governor.',
  ],
  s0951: [
    'Muslim communities at Qianyang submitted.',
    'Qianyang Muslims surrendered.',
  ],
  s0952: [
    'On day renxu, government troops recovered Yingshang and Zhengyang.',
    'On renxu day, government forces retook Yingshang and Zhengyang.',
  ],
  s0953: [
    'On day guihai, Ma Hualong took Ningxia and Lingzhou.',
    'On guihai day, Ma Hualong seized Ningxia and Lingzhou.',
  ],
  s0954: [
    'For merit in pacifying Miao rebels, Li Shizhong was restored to office.',
    'Li Shizhong was reinstated for pacifying Miao rebels.',
  ],
  s0955: [
    'Zeng Guoquan\'s army took the passes at Chunhua and elsewhere and advanced to camp at Xiaoling.',
    'Zeng Guoquan took Chunhua passes and moved up to Xiaoling.',
  ],
  s0956: [
    'On day bingyin, government troops took the Zhangjing Creek camp at Jiashan.',
    'On bingyin day, government troops took the Zhangjing Creek camp in Jiashan.',
  ],
  s0957: [
    'On day dingmao, rebel Muslims besieged the Manchu city at Ningxia.',
    'On dingmao day, Muslim rebels besieged Ningxia\'s Manchu quarter.',
  ],
  s0958: [
    'On day gengwu, Jiangsu troops recovered Pinghu.',
    'On gengwu day, Jiangsu forces retook Pinghu.',
  ],
  s0959: [
    'Bandit officers surrendered Zhabu and Jiashan.',
    'Rebel officers gave up Zhabu and Jiashan.',
  ],
  s0960: [
    'That month, disaster-disturbed grain taxes were remitted in Sishui and other counties in Shandong and quota taxes in disaster-hit districts such as Wuqing in Zhili.',
    'That month, disaster taxes were waived in Shandong and Zhili.',
  ],
  s0961: [
    'Relief was given for disaster in Jilin\'s Dašihwula hunting grounds.',
    'Jilin Dašihwula disaster victims received relief.',
  ],
  s0962: [
    'Twelfth month, day dingchou: Provincial Commander Jiang Zhongyi died at his Jiangxi army post.',
    'In the twelfth month, on dingchou day, commander Jiang Zhongyi died in Jiangxi service.',
  ],
  s0963: [
    'On day gengchen, Jiangsu troops took Pingwang.',
    'On gengchen day, Jiangsu forces took Pingwang.',
  ],
  s0964: [
    'On day xinsi, Tang Xunfang was dismissed and Qiao Songnian was made Anhui governor.',
    'On xinsi day, Tang Xunfang was removed and Qiao Songnian made Anhui governor.',
  ],
  s0965: [
    'On day wuzi, Tang Yougeng was made Yunnan provincial commander and ordered to Zhaotong.',
    'On wuzi day, Tang Yougeng became Yunnan commander and was sent to Zhaotong.',
  ],
  s0966: [
    'On day xinmao, Tan Tingxiang spoke on coordinating the lower Yellow River terrain and asked to dredge branch channels to reduce flood rise and build embankments to protect farmland.',
    'On xinmao day, Tan Tingxiang urged dredging Yellow River branches and building embankments to protect fields.',
  ],
  s0967: [
    'Liu Changyou and Yan Jingming were ordered to plan this jointly.',
    'Liu Changyou and Yan Jingming were told to plan it together.',
  ],
  s0968: [
    'On day guisi, Shaanxi Muslims and Cantonese rebels raided in numbers into Gansu.',
    'On guisi day, Shaanxi Muslims and Taiping rebels poured into Gansu.',
  ],
  s0969: [
    'On day jiawu, reduced-price collection in grain for Suzhou, Songjiang, and Taicang transport taxes was approved.',
    'On jiawu day, the court approved cheaper collection of Suzhou-area transport grain.',
  ],
  s0970: [
    'On day yiwei, the emperor attended the great tent at Fuchen Hall and bestowed a banquet on Mongol princes and nobles, with graded rewards.',
    'On yiwei day, the emperor feasted Mongol princes at Fuchen Hall with graded gifts.',
  ],
  s0971: [
    'This was done every year thereafter.',
    'The practice was repeated annually.',
  ],
  s0972: [
    'Changhua was recovered and bandits on both routes in Taiwan were pacified.',
    'Changhua was retaken and both Taiwan rebel columns were pacified.',
  ],
  s0973: [
    'On day bingshen, Weng Tonghe received added mercy and was sent into exile.',
    'On bingshen day, Weng Tonghe was exiled with added clemency.',
  ],
  s0974: [
    'Zuo Zongtang was ordered to eliminate accumulated abuses in eastern Zhejiang land and poll taxes.',
    'Zuo Zongtang was told to clean up eastern Zhejiang land-tax abuses.',
  ],
  s0975: [
    'Shaanxi, Hubei, and Sichuan were ordered to join in suppressing southern Shaanxi rebels.',
    'The court ordered Shaanxi, Hubei, and Sichuan to crush southern Shaanxi rebels together.',
  ],
  s0976: [
    'That month, old and new quota taxes were remitted in ravaged counties of Shandong and Shaanxi, and granary grain in districts such as Xiaoyi.',
    'That month, taxes and granary grain were waived in ravaged Shandong and Shaanxi districts.',
  ],
  s0977: [
    'That year, Korea sent tribute.',
    'Korea paid tribute that year.',
  ],
  s0978: [
    'Third year, jiazi, spring, first month, new moon day guimao: the emperor led princes and ministers in congratulating the two empress dowagers; when the rites were done, he received court at the Hall of Supreme Harmony.',
    'In spring, month 1, on the guimao new moon of year 3, the emperor congratulated the empress dowagers and then held court at Taihe Hall.',
  ],
  s0979: [
    'Henceforth this was done every year.',
    'The ceremony was repeated annually thereafter.',
  ],
  s0980: [
    'On day jiachen, Li Hongzhang\'s army defeated Changzhou relief rebels at Benniu Town with a great victory.',
    'On jiachen day, Li Hongzhang routed Changzhou relief rebels at Benniu Town.',
  ],
  s0981: [
    'On day bingwu, Fengxiang Muslims begged to submit and were permitted.',
    'On bingwu day, Fengxiang Muslims asked to surrender and were allowed.',
  ],
  s0982: [
    'Shangnan bandits raided into Yunxi.',
    'Shangnan bandits broke into Yunxi.',
  ],
  s0983: [
    'Shi Qingji\'s Hubei army was transferred to Shaanxi.',
    'Hubei commander Shi Qingji\'s troops were sent to Shaanxi.',
  ],
  s0984: [
    'Sichuan relief troops for Shaanxi were defeated at Qingshi Pass.',
    'Sichuan relief forces for Shaanxi lost at Qingshi Pass.',
  ],
  s0985: [
    'On day gengxu, Henan Nian bandits raided into Suizhou.',
    'On gengxu day, Henan Nian bandits entered Suizhou.',
  ],
  s0986: [
    'On day guichou, Henan troops fought Zhang Zongyu at Zhaozhuang Pass and were defeated.',
    'On guichou day, Henan forces lost to Zhang Zongyu at Zhaozhuang Pass.',
  ],
  s0987: [
    'On day jiwei, government troops recovered Xiuwen and Ceheng.',
    'On jiwei day, government forces retook Xiuwen and Ceheng.',
  ],
  s0988: [
    'On day gengshen, Zhili and Shanxi troops were transferred to relieve Ningxia.',
    'On gengshen day, Zhili and Shanxi forces were sent to aid Ningxia.',
  ],
  s0989: [
    'The Alashan banner was ordered to forbid Mongols from colluding with Muslim bandits.',
    'Alashan Mongols were forbidden to collude with Muslim rebels.',
  ],
  s0990: [
    'On day jiazi, Li Shixian raided into Jixi.',
    'On jiazi day, Li Shixian broke into Jixi.',
  ],
  s0991: [
    'On day bingyin, Duxing\'a was ordered to Suiyuan to jointly manage defense affairs.',
    'On bingyin day, Duxing\'a was sent to Suiyuan for joint defense duty.',
  ],
  s0992: [
    'Fuming\'a went to Yangzhou to take over military affairs.',
    'Fuming\'a went to Yangzhou to assume command.',
  ],
  s0993: [
    'On day jisi, Zhejiang troops recovered Haining.',
    'On jisi day, Zhejiang forces retook Haining.',
  ],
  s0994: [
    'Changhua bandit chief Dai Wansheng was executed.',
    'Dai Wansheng, Changhua rebel chief, was put to death.',
  ],
  s0995: [
    'Cantonese rebels raided into Shiquan, Hanyin, and Ningshan.',
    'Taiping rebels raided Shiquan, Hanyin, and Ningshan.',
  ],
  s0996: [
    'That month, overdue taxes from poor harvests were remitted in Anzhou and other places.',
    'That month, harvest-shortfall back taxes were waived in Anzhou and elsewhere.',
  ],
  s0997: [
    'Second month, new moon day renshen: government troops recovered Liuba in Hanzhong.',
    'In the second month, on the renshen new moon, troops retook Hanzhong\'s Liuba.',
  ],
  s0998: [
    'Guizhou troops recovered Longli.',
    'Guizhou forces retook Longli.',
  ],
  s0999: [
    'On day yihai, Cantonese rebels raided into Guangxin and Jianchang.',
    'On yihai day, Taiping rebels entered Guangxin and Jianchang.',
  ],
  s1000: [
    'On day gengchen, Ningxia Muslim bandits attacked Zhongwei and other places, and Xilin divided his forces to relieve them.',
    'On gengchen day, Ningxia Muslim rebels struck Zhongwei and Xilin sent detachments to help.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b10.mjs <translation.json>'
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
