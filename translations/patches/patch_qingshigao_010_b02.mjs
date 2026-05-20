#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Dai Linbu was ordered appointed general of the Right Guard.',
    'Dai Linbu was made general of the Right Guard.',
  ],
  s0102: [
    'On day jiwei, Prince of the Commandery of Ping Fu Peng was ordered to assist jointly in managing general affairs of state.',
    'On jiwei day, Prince of Ping Fu Peng was appointed to help manage state affairs.',
  ],
  s0103: [
    'Dong Fang, Yuan Zhancheng, and De Xishou were stripped of office and arrested for interrogation; Ha Yuansheng was deprived of the rank Valiant and Majestic General; Commissioner Zhang Guangsi was ordered concurrently as Guizhou governor.',
    'Dong Fang, Yuan Zhancheng, and De Xishou were dismissed and imprisoned; Ha Yuansheng lost his general\'s rank; Zhang Guangsi became Guizhou governor as well as frontier commissioner.',
  ],
  s0104: [
    'On day guihai, the descendants of Aqina and Seshe were granted red girdles and enrolled in the jade genealogy.',
    'On guihai day, Yinsi and Yintang\'s descendants received red girdles and were restored to the clan register.',
  ],
  s0105: [
    'On day jiazi, Wang Dachen joined the Board of Punishments in rigorous examination of Li Xi and Geng Tao; the examining ministers were ordered to observe due propriety.',
    'On jiazi day, Wang Dachen joined the Ministry of Justice in investigating Li Xi and Geng Tao; examiners were told to uphold proper standards.',
  ],
  s0106: [
    'Twelfth month, first day of the month on day bingyin: Bodai was made Jilin general and Wu Libu Heilongjiang general.',
    'On the first of the twelfth month, Bodai became Jilin general and Wu Libu Heilongjiang general.',
  ],
  s0107: [
    'The Sichuan-Shaanxi governor-generalship was re-established; the Sichuan governor-generalship was abolished.',
    'The Sichuan-Shaanxi governor-general post was restored and the Sichuan-only post abolished.',
  ],
  s0108: [
    'On day wuchen, flood victims in Suzhou, Anhui, and Qianjiang, Hubei, were relieved.',
    'On wuchen day, flood relief was sent to Suzhou in Anhui and Qianjiang in Hubei.',
  ],
  s0109: [
    'On day guiyou, arrears in salt-field levies of Zhejiang, Shandong, Fujian, and Guangdong were remitted.',
    'On guiyou day, unpaid salt taxes in Zhejiang, Shandong, Fujian, and Guangdong were forgiven.',
  ],
  s0110: [
    'On day wuyin, the Empress Dowager\'s honorable title was raised to Chongqing Empress Dowager; the next day an edict proclaiming grace of varying degrees was issued.',
    'On wuyin day, the Empress Dowager received the title Chongqing; the next day a grace edict was promulgated.',
  ],
  s0111: [
    'On day jimao, because Dzungar envoys came to sue for peace, Khalkha jasaks and others were ordered to deliberate in detail on border demarcation.',
    'On jimao day, with Dzungar envoys seeking peace, Khalkha princes were told to negotiate the frontier.',
  ],
  s0112: [
    'On day gengchen, Fu Tai was transferred to Minister of Punishments, still concurrently managing the Board of War.',
    'On gengchen day, Fu Tai became Minister of Justice while retaining charge of the War Board.',
  ],
  s0113: [
    'On day jiashen, Zeng Jing and Zhang Xi were dismembered at the execution ground.',
    'On jiashen day, Zeng Jing and Zhang Xi were executed by lingchi.',
  ],
  s0114: [
    'Commandant Li Xi was sentenced to decapitation for corruption; Minister Gao Qi for deception—both condemned to death.',
    'Li Xi was condemned to death for embezzlement; Gao Qi for fraud.',
  ],
  s0115: [
    'On day bingxu, Ji Zengyun was ordered concurrently to manage Zhejiang governor affairs.',
    'On bingxu day, Ji Zengyun was made acting Zhejiang governor.',
  ],
  s0116: [
    'Gao Bin was made Jiangnan canal governor-general.',
    'Gao Bin became Jiangnan canal commissioner.',
  ],
  s0117: [
    'A general and deputy lieutenant-general were established at Guihua City.',
    'Posts of general and deputy commander were created at Guihua City.',
  ],
  s0118: [
    'On day xinmao, Neqin was promoted to first-rank duke, hereditary.',
    'On xinmao day, Neqin was raised to hereditary first-rank duke.',
  ],
  s0119: [
    'First year of Qianlong, spring, first month, first day of the month on day bingchen: the Emperor went to the tangzi to perform ritual.',
    'On New Year\'s day of Qianlong 1, the Emperor worshipped at the tangzi.',
  ],
  s0120: [
    'He went to the Hall of Contemplating Virtue to change into plain mourning dress; when ritual at Yonghe Gate was completed, he led princes and ministers to the Palace of Compassionate Nurturing to perform ritual.',
    'After changing into mourning garb at Guande Hall and rites at Yonghe Gate, he led princes and ministers to Cining Palace.',
  ],
  s0121: [
    'He held court at the Hall of Supreme Harmony to receive homage; no music, no proclamation read.',
    'He received court at the Hall of Supreme Harmony without music or edict proclamation.',
  ],
  s0122: [
    'On day wuxu, Northern Route Commissioner Samuha was ordered back to the capital.',
    'On wuxu day, Northern Route commissioner Samuha was recalled to Beijing.',
  ],
  s0123: [
    'On day xinchou, grain was prayed for to the Supreme Lord; the Emperor went in person to perform ritual.',
    'On xinchou day, the Emperor personally prayed for grain at Heaven.',
  ],
  s0124: [
    'From this year onward, every year was the same.',
    'Henceforth this was done every year.',
  ],
  s0125: [
    'On day guimao, the capital Sericulture Altar was built.',
    'On guimao day, Beijing\'s Sericulture Altar was erected.',
  ],
  s0126: [
    'Dzungar taiji Galdan Tseren sent envoys presenting tribute goods.',
    'The Dzungar leader Galdan Tseren sent tribute envoys.',
  ],
  s0127: [
    'On day dingwei, the Dzungar tribute envoy Choinimka was received in audience.',
    'On dingwei day, Dzungar envoy Choinimka had audience.',
  ],
  s0128: [
    'Grand General Qingfu was summoned back to the capital.',
    'General Qingfu was recalled to Beijing.',
  ],
  s0129: [
    'Yilejen, Acheng\'a, and Hadai were made commissioners; together with the imperial son-in-law Tsering they managed affairs, stationed at Orkhon.',
    'Yilejen, Acheng\'a, and Hadai were made frontier commissioners to assist Tsering at Orkhon.',
  ],
  s0130: [
    'Commandant Wang Chang and Vice Minister Bai Xiu were sent to Orkhon to survey colony fields.',
    'Wang Chang and Bai Xiu were sent to Orkhon to survey military farms.',
  ],
  s0131: [
    'On day bingchen, Gu Cong was made acting Jiangsu governor.',
    'On bingchen day, Gu Cong became acting Jiangsu governor.',
  ],
  s0132: [
    'On day jiwei, Acting Yongzhou garrison commander Cui Qiqian falsely impeached Ortai and Zhang Guangsi; he was stripped of office and arrested.',
    'On jiwei day, Cui Qiqian was dismissed and arrested for falsely accusing Ortai and Zhang Guangsi.',
  ],
  s0133: [
    'Nanzhang paid tribute.',
    'Lan Xang sent tribute.',
  ],
  s0134: [
    'On day gengchen, the Emperor set out on pilgrimage to visit the tombs.',
    'On gengchen day, the Emperor departed to visit the imperial tombs.',
  ],
  s0135: [
    'On day guihai, the Emperor visited Zhaoxi Mausoleum, Xiaoling, Xiaodongling, and Jingling.',
    'On guihai day, he worshipped at the imperial mausoleums.',
  ],
  s0136: [
    'Earthquake victims in Zhuluo County, Taiwan, were relieved.',
    'Taiwan\'s Zhuluo earthquake victims received relief.',
  ],
  s0137: [
    'Drought victims in Guyuan, Gansu, Zhongzhou, Sichuan, and other districts were relieved.',
    'Drought relief went to Guyuan in Gansu, Zhongzhou in Sichuan, and other districts.',
  ],
  s0138: [
    'Second month, day bingyin: the Emperor returned to the capital.',
    'In the second month, on bingyin day, the Emperor returned to Beijing.',
  ],
  s0139: [
    'On day wuchen, the great earth and grain were sacrificed to; the Emperor went in person to perform ritual.',
    'On wuchen day, the Emperor personally offered to the gods of earth and grain.',
  ],
  s0140: [
    'From this year onward, every year was the same.',
    'Henceforth this was done every year.',
  ],
  s0141: [
    'Bu Xi was made acting grain-transport governor-general.',
    'Bu Xi became acting grain-transport commissioner.',
  ],
  s0142: [
    'On day jiaxu, the Dzungar envoy was sent home; an edict ordered that, following the late Emperor\'s instruction, the frontier be fixed by consultation and shown to Galdan Tseren.',
    'On jiaxu day, the Dzungar envoy returned with an edict on border demarcation for Galdan Tseren per Yongzheng\'s instructions.',
  ],
  s0143: [
    'On day yimao, an imperial letter was bestowed on Dzungar taiji Galdan Tseren, rejecting his request to take Jerge Jerkh Churkhos as border and to order Khalkha migration inward alone.',
    'On yimao day, an imperial letter rebuked Galdan Tseren\'s border demands and unilateral Khalkha resettlement proposal.',
  ],
  s0144: [
    'On day gengchen, Mai Zhu was ordered concurrently to manage the Board of Works.',
    'On gengchen day, Mai Zhu was given charge of the Works Board.',
  ],
  s0145: [
    'Xie Jishi, Li Hui, Chen Shiguang, and others were admonished for memorializing with absurd errors.',
    'Xie Jishi, Li Hui, and Chen Shiguang were rebuked for reckless memorials.',
  ],
  s0146: [
    'Yang Mingshi was given the nominal rank of Minister of Rites and managed the Directorate of Education chancellor\'s affairs.',
    'Yang Mingshi received Rites Minister rank and headed the Imperial Academy.',
  ],
  s0147: [
    'On day xinyou, the King of Korea Yi Geun sent envoys to offer incense; rewards were given as usual.',
    'On xinyou day, Korea\'s King Yi Geun sent incense bearers and received customary gifts.',
  ],
  s0148: [
    'On day jiashen, Ji Zengyun was changed to Zhejiang governor-general, concurrently managing both Zhejiang salt administration.',
    'On jiashen day, Ji Zengyun became Zhejiang governor-general with control of salt revenue.',
  ],
  s0149: [
    'Hao Yulin as Fujian-Zhejiang governor-general managed Fujian affairs exclusively.',
    'Hao Yulin, as Fujian-Zhejiang governor-general, took charge of Fujian alone.',
  ],
  s0150: [
    'On day wuzi, the late Shizong\'s mausoleum was named Tailing.',
    'On wuzi day, Yongzheng\'s tomb was named Tailing.',
  ],
  s0151: [
    'On day jichou, the Dalai Lama and beile Pholhanas sent envoys presenting tribute goods.',
    'On jichou day, the Dalai Lama and Pholhanas sent tribute envoys.',
  ],
  s0152: [
    'On day xinmao, Cheng Yuanzhang was made grain-transport governor-general.',
    'On xinmao day, Cheng Yuanzhang became grain-transport commissioner.',
  ],
  s0153: [
    'On day guisi, Yin Jishan memorialized capture of Kongbai, Taixiong, and other stockades.',
    'On guisi day, Yin Jishan reported capture of Kongbai and Taixiong stockades.',
  ],
  s0154: [
    'Zhang Guangsi memorialized capture of Greater and Lesser Danjiang and other places.',
    'Zhang Guangsi reported victory at Greater and Lesser Danjiang.',
  ],
  s0155: [
    'Third month, day gengzi: kinsmen of Wang Jingqi and Zha Sitin were released to return to native places.',
    'In the third month, on gengzi day, families of Wang Jingqi and Zha Sitin were freed to return home.',
  ],
  s0156: [
    'On day yisi, augmented posthumous titles were conferred on Taizu as Taizu Chengtian Guangyun Shengde Shengong Zhaoji Liji Renxiao Ruiwu Duanyi Qin\'an Hongwen Dingye Gaohuangdi, and on Empress Xiaoci as Xiaoci Zhaoxian Jingshun Renhui Yide Qingxian Chengtian Fusheng Gaohou.',
    'On yisi day, augmented posthumous titles were conferred on Nurhaci and Empress Xiaocigao.',
  ],
  s0157: [
    'Taizong\'s posthumous title was Taizong Yingtian Xingguo Hongde Zhangwu Kuanwen Rensheng Ruixiao Jingmin Zhaoding Longdao Xiangong Wenhuangdi; Empress Xiaoduan as Xiaoduan Zhengjing Renyi Zheshun Cixi Zhuangmin Futian Xiesheng Wenhou; Empress Xiaozhuang as Xiaozhuang Renxuan Chengxian Gongyi Zhide Chunhui Yitian Qisheng Wenhou.',
    'Posthumous titles were augmented for Hong Taiji, Empress Xiaoduan, and Empress Xiaozhuang.',
  ],
  s0158: [
    'Shizu\'s posthumous title was Shizu Titian Longyun Dingtong Jianji Yingrui Qinwen Xianwu Dade Honggong Zhiren Chunxiao Zhanghuangdi; Empress Xiaohui as Xiaohui Renxian Duanyi Cishu Gong\'an Chunde Shuntian Yisheng Zhanghou; Empress Xiaokang as Xiaokang Cihe Zhuangyi Gonghui Wenmu Duanjing Chongtian Yusheng Zhanghou.',
    'Posthumous titles were augmented for Shunzhi, Empress Xiaohui, and Empress Xiaokang.',
  ],
  s0159: [
    'Shengzu\'s posthumous title was Shengzu Hetian Hongyun Wenwu Ruizhe Gongjian Kuanyu Xiaojing Chengxin Zhonghe Gongde Dacheng Renhuangdi; Empress Xiaocheng as Xiaocheng Gongsu Zhenghui Anhe Shuyi Litian Xiangsheng Renhou; Empress Xiaozhao as Xiaozhao Jingshu Minghui Zhenghe Anyu Qintian Shunsheng Renhou; Empress Xiaogong as Xiaogong Xuanhui Wensu Dingyu Cichun Zantian Chengsheng Renhou.',
    'Posthumous titles were augmented for Kangxi and Empresses Xiaocheng, Xiaozhao, and Xiaogong.',
  ],
  s0160: [
    'On day dingwei, assessed levies on tribal peoples of Liangshan, Sichuan, were remitted.',
    'On dingwei day, tribal taxes in Sichuan\'s Liangshan were forgiven.',
  ],
  s0161: [
    'On day jiyou, old arrears of the Muslim community at Weilu Fort, Suzhou, were remitted.',
    'On jiyou day, old debts of Suzhou\'s Weilu Muslim community were forgiven.',
  ],
  s0162: [
    'On day gengxu, Guyuan regional commander Fan Ting was made governor-general stationed at Hami.',
    'On gengxu day, Fan Ting became governor-general at Hami.',
  ],
  s0163: [
    'On day yimao, added fishing levies and provincial arrears in four counties of Gui Shan, Guangdong, were remitted.',
    'On yimao day, extra fishing taxes and provincial arrears in Guangdong were forgiven.',
  ],
  s0164: [
    'Summer, fourth month, day bingyin: deferred grain transport levies for Funing and other districts in Jiangnan were remitted.',
    'In the fourth month, deferred canal grain taxes in Jiangnan were forgiven.',
  ],
  s0165: [
    'On day renshen, Wang Chang and Hailan were made commissioners to manage affairs jointly with the imperial son-in-law Tsering.',
    'On renshen day, Wang Chang and Hailan were made frontier commissioners to assist Tsering.',
  ],
  s0166: [
    'Gao Qizhuo was made Hubei governor and temporarily acted as Hunan governor.',
    'Gao Qizhuo became Hubei governor and acting Hunan governor.',
  ],
  s0167: [
    'On day wuyin, Wang Shijun was made Sichuan governor.',
    'On wuyin day, Wang Shijun became Sichuan governor.',
  ],
  s0168: [
    'On day xinsi, Guizhou regional commander Ha Yuansheng was stripped of office and arrested for interrogation.',
    'On xinsi day, Ha Yuansheng was dismissed and arrested.',
  ],
  s0169: [
    'The Zhili deputy canal director was abolished; the governor-general was ordered to manage river affairs concurrently.',
    'The Zhili deputy canal post was abolished; the governor-general took charge of river works.',
  ],
  s0170: [
    'On day wuzi, Jin Deying and three hundred thirty-three others were granted jinshi and other ranks with distinctions.',
    'On wuzi day, Jin Deying and 333 others received jinshi degrees.',
  ],
  s0171: [
    'On day renchen, the Bhutanese chief Lhazin Cholop Gyalpo came to Tibet to request imperial blessings and presented tribute goods.',
    'On renchen day, a Bhutanese ruler sought imperial blessing in Tibet and sent tribute.',
  ],
  s0172: [
    'Fifth month, day dingwei: flood victims in Yongcheng County, Henan, were relieved.',
    'In the fifth month, on dingwei day, flood relief went to Yongcheng in Henan.',
  ],
  s0173: [
    'On day renzi, the Jiangnan deputy canal director was ordered to move his station to Xuzhou.',
    'On renzi day, the Jiangnan deputy canal commissioner was posted to Xuzhou.',
  ],
  s0174: [
    'On day jiayin, assessed levies on Nanxi and other districts in Sichuan struck by wind and hail were remitted.',
    'On jiayin day, storm-damaged districts in Sichuan received tax relief.',
  ],
  s0175: [
    'The King of Korea Yi Geun memorialized congratulations on accession and elevation of the Empress Dowager, and presented tribute goods.',
    'Korea\'s King Yi Geun congratulated the new reign and the Empress Dowager and sent tribute.',
  ],
  s0176: [
    'On day yisi, the King of Siam memorialized thanks for the bestowed plaque and presented tribute goods.',
    'On yisi day, the King of Siam thanked the court for an imperial plaque and sent tribute.',
  ],
  s0177: [
    'On day gengchen, shortfalls in poll-tax silver from earthquake casualties in Fuxiang and other districts, Gansu, were remitted.',
    'On gengchen day, poll-tax shortfalls from Gansu earthquake victims were forgiven.',
  ],
  s0178: [
    'Sixth month, day wuchen: flood victims in Xiao County and other districts, Jiangsu, were relieved.',
    'In the sixth month, on wuchen day, flood relief went to Jiangsu districts including Xiao County.',
  ],
  s0179: [
    'On day jisi, Qingfu was made acting Minister of Personnel, still concurrently acting Minister of Revenue.',
    'On jisi day, Qingfu became acting Personnel Minister while still acting Revenue Minister.',
  ],
  s0180: [
    'On day guiyou, Zhang Guangsi was appointed Guizhou governor-general, concurrently managing governor affairs.',
    'On guiyou day, Zhang Guangsi became Guizhou governor-general.',
  ],
  s0181: [
    'Yin Jishan was made Yunnan governor-general.',
    'Yin Jishan became Yunnan governor-general.',
  ],
  s0182: [
    'Autumn, seventh month, first day of the month on day guisi: because many Guizhou refugees sought food at Yuanzhou, Yuanzhou\'s assessed levies were remitted.',
    'On the first of the seventh month, Yuanzhou taxes were forgiven because Guizhou refugees gathered there.',
  ],
  s0183: [
    'On day jiawu, the princes and ministers in charge of general affairs and the Nine Ministers were summoned; the secret edict on establishing the heir was proclaimed and stored above the "Upright and Illuminating" plaque in the Palace of Heavenly Purity.',
    'On jiawu day, the heir-selection secret edict was read to the chief ministers and placed behind the "Upright and Illuminating" plaque.',
  ],
  s0184: [
    'On day jihai, Guizhou\'s assessed levies for the year were remitted throughout the province.',
    'On jihai day, the year\'s land tax was forgiven throughout Guizhou.',
  ],
  s0185: [
    'On day xinchou, Miao levies in Guzhou and other places were abolished.',
    'On xinchou day, Miao taxes in Guzhou and elsewhere were abolished.',
  ],
  s0186: [
    'On day jiachen, Cui Qiqian\'s punishment was remitted.',
    'On jiachen day, Cui Qiqian was pardoned.',
  ],
  s0187: [
    'On day bingwu, flood victims in Anfu, Jiangxi, were relieved.',
    'On bingwu day, flood relief went to Anfu in Jiangxi.',
  ],
  s0188: [
    'On day xinhai, the Ming Jianwen Emperor was posthumously titled Gongmin Hui Emperor.',
    'On xinhai day, the Ming emperor Jianwen received the posthumous title Gongmin Hui.',
  ],
  s0189: [
    'Flood victims in Xiao, Dang, and other districts and garrisons of Jiangnan were relieved.',
    'Flood relief went to Xiao, Dang, and other Jiangnan districts.',
  ],
  s0190: [
    'On day dingsi, flood and hail victims in Longxi and other districts, Gansu, were relieved.',
    'On dingsi day, flood and hail relief went to Longxi and other Gansu districts.',
  ],
  s0191: [
    'On day wuwu, Zhong Bao was transferred to Hubei governor and Gao Qizhuo to Hunan governor.',
    'On wuwu day, Zhong Bao became Hubei governor and Gao Qizhuo Hunan governor.',
  ],
  s0192: [
    'Flood victims in five districts and garrisons including Hanchuan, Hubei, were relieved.',
    'Flood relief went to Hanchuan and four other Hubei districts.',
  ],
  s0193: [
    'On day guiyou, Wang Shijun was arrested for interrogation; soon sentenced to decapitation.',
    'On guiyou day, Wang Shijun was arrested and soon condemned to death.',
  ],
  s0194: [
    'Flood victims in Nanhai, Chaoyang, and other counties of Guangdong were relieved.',
    'Flood relief went to Nanhai, Chaoyang, and other Guangdong counties.',
  ],
  s0195: [
    'Eighth month, day wuchen: the great grain and earth were sacrificed to; the Emperor went in person to perform ritual.',
    'In the eighth month, on wuchen day, the Emperor personally offered to the gods of grain and earth.',
  ],
  s0196: [
    'From this year onward, every year was the same.',
    'Henceforth this was done every year.',
  ],
  s0197: [
    'A Dzungar tribesman named Mengke came to surrender.',
    'A Dzungar named Mengke defected.',
  ],
  s0198: [
    'On day gengwu, Minister Fu Tai was dismissed for crimes.',
    'On gengwu day, Minister Fu Tai was dismissed for misconduct.',
  ],
  s0199: [
    'On day yimao, flood victims in five counties including Nanyang, Henan, were relieved.',
    'On yimao day, flood relief went to Nanyang and four other Henan counties.',
  ],
  s0200: [
    'On day yiyou, famine in Khalkha\'s Kharachin was relieved.',
    'On yiyou day, famine relief was sent to Kharachin in Khalkha.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_010_b02.mjs <translation.json>'
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
