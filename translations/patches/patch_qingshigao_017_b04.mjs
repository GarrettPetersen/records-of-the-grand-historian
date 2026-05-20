#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Granary grain was loaned to Ruyang and Zhengyang counties in Henan.',
    'Henan\'s Ruyang and Zhengyang received granary loans.',
  ],
  s0302: [
    'Autumn, seventh month, day wuchen: Lu Yizhuang was appointed Left Censor-in-Chief.',
    'On wuchen in the seventh month, Lu Yizhuang became Left Censor-in-Chief.',
  ],
  s0303: [
    'On day jisi, because Bazhou and nine other Zhili prefectures and counties were heavily flooded, silver and grain were ordered allocated for immediate relief.',
    'On jisi day, heavily flooded Bazhou and nine other Zhili districts received emergency silver and grain relief.',
  ],
  s0304: [
    'Qishan was ordered to exterminate locusts.',
    'Qishan was ordered to fight locusts.',
  ],
  s0305: [
    'On day renwu, because of Jiangsu floods, commercial-rice tax silver at all passes was remitted.',
    'On renwu day, Jiangsu flood relief remitted commercial-rice taxes at all passes.',
  ],
  s0306: [
    'Henan\'s assessed share of Sichuan-Hubei and guard-case military supplies, 4.6 million taels, was remitted.',
    'Henan was exempted from 4.6 million taels of Sichuan-Hubei and guard military levies.',
  ],
  s0307: [
    'That month, one month\'s rations were issued for flood victims in seventeen prefectures, departments, and counties including Dehua in Jiangxi, Huangmei in Hubei, and Taicang in Jiangsu.',
    'That month, one month\'s flood rations went to seventeen districts including Dehua, Huangmei, and Taicang.',
  ],
  s0308: [
    'Additional relief was given for floods in twenty-one Zhili prefectures and counties including Tongzhou.',
    'Extra flood relief reached twenty-one Zhili districts including Tongzhou.',
  ],
  s0309: [
    'Eighth month, day jihai: the classics lecture was held for the first time.',
    'On jihai in the eighth month, the Emperor held his first classics lecture.',
  ],
  s0310: [
    'On day yimao, because of floods in three prefectures under Hangzhou, Zhejiang, sea-transport commercial-rice ship taxes were remitted and pass-tax silver was retained for relief.',
    'On yimao day, Zhejiang flood relief remitted sea-transport rice taxes and held pass revenue for relief.',
  ],
  s0311: [
    'That month, flood relief was given in sixteen Anhui prefectures and counties including Wuwei.',
    'That month, flood relief reached sixteen Anhui districts including Wuwei.',
  ],
  s0312: [
    'One month\'s rations were issued for floods in thirteen Henan counties including Jun County.',
    'Thirteen Henan counties including Jun received one month\'s flood rations.',
  ],
  s0313: [
    'Ninth month, day renshen: for tomb visitation Tuojin, Yinghe, Lu Yinpu, and Wang Tingzhen were left in the capital to manage affairs.',
    'On renshen in the ninth month, Tuojin, Yinghe, Lu Yinpu, and Wang Tingzhen stayed in Beijing while the Emperor visited the tombs.',
  ],
  s0314: [
    'On day dingchou, the Yongding River breach was closed.',
    'On dingchou day, the Yongding River breach closed.',
  ],
  s0315: [
    'On day renwu, the Emperor escorted the Empress Dowager to worship at the Western Tombs.',
    'On renwu day, the Emperor took the Empress Dowager to the Western Tombs.',
  ],
  s0316: [
    'On day bingxu, he worshipped at the Tailing, Taidongling, and Changling tombs.',
    'On bingxu day, he worshipped at Tailing, Taidongling, and Changling.',
  ],
  s0317: [
    'On day dinghai, quota taxes were remitted for flood victims in twenty-seven Zhili prefectures and counties including Tongzhou.',
    'On dinghai day, quota taxes were forgiven in twenty-seven flooded Zhili districts including Tongzhou.',
  ],
  s0318: [
    'On day jichou, he escorted the Empress Dowager back to the capital.',
    'On jichou day, he brought the Empress Dowager back to Beijing.',
  ],
  s0319: [
    'On day renchen, Songyun was made Jilin general and Muzhang\'a Left Censor-in-Chief.',
    'On renchen day, Songyun became Jilin general and Muzhang\'a Left Censor-in-Chief.',
  ],
  s0320: [
    'That month, flood relief was given in forty Zhili prefectures and counties including Tongzhou and five Shandong prefectures and counties including Linqing.',
    'That month, flood relief reached forty Zhili and five Shandong districts.',
  ],
  s0321: [
    'Additional relief was given for floods in Dehua, Jiangxi, Huangmei, Hubei, and five Henan counties including Wuzhi.',
    'Extra flood relief went to Dehua, Huangmei, and five Henan counties including Wuzhi.',
  ],
  s0322: [
    'Flood rations were issued in four Jiangsu counties including Yizheng and three Hubei counties including Jiangling.',
    'Flood rations went to four Jiangsu and three Hubei counties.',
  ],
  s0323: [
    'Quota taxes old and new were remitted and deferred for sixteen Shandong prefectures, departments, counties, and guards including Linqing and fifty Zhili prefectures and counties including Jizhou for floods; quota taxes and garrison-quota taxes old and new for Wuzhi, Henan, and Huangmei, Hubei, were remitted; house-repair funds were issued.',
    'Linqing and fifty other districts received tax remissions and house-repair funds for floods.',
  ],
  s0324: [
    'Tenth month of winter: flood relief was given in three Hubei counties and guards including Jiangling; old and new quota taxes were remitted and house-repair funds issued.',
    'In the tenth month, Jiangling and two other districts received flood relief, tax remissions, and repair funds.',
  ],
  s0325: [
    'One month\'s rations were loaned to Banner people in Fengtian\'s Jinzhou and Wucheng, Shandong, for floods; silver and grain were loaned to flooded soldiers of three camps of Tianjin garrison and posts at Zijing Pass.',
    'Jinzhou Banner people, Wucheng, and flooded Tianjin and Zijing Pass troops received rations and pay.',
  ],
  s0326: [
    'On day yihai, Yu Dai was made Guangxi governor.',
    'On yihai day, Yu Dai became Guangxi governor.',
  ],
  s0327: [
    'That month, rations were loaned to victims in sixteen Gansu prefectures and counties including Jingning.',
    'That month, Jingning and fifteen other Gansu districts received ration loans.',
  ],
  s0328: [
    'Old and new quota taxes were remitted and deferred for floods in five Hunan prefectures and counties including Lizhou and drought in Yihe, Gansu.',
    'Lizhou and four other Hunan districts and Yihe, Gansu, received tax deferrals for flood and drought.',
  ],
  s0329: [
    'On day guichou, for capturing bandits Yan Ruyu of Shaanxi Shaan\'an Circuit received the acting censor-in-chief rank.',
    'On guichou day, Yan Ruyu of Shaan\'an received an acting censor rank for suppressing bandits.',
  ],
  s0330: [
    'That month, silver and grain were loaned to troops stationed in disaster areas in five Jiangsu prefectures including Suzhou.',
    'That month, troops in five Jiangsu flood districts received pay loans.',
  ],
  s0331: [
    'That year, Korea, Ryukyu, Siam, and Burma sent tribute.',
    'That year, Korea, Ryukyu, Siam, and Burma paid tribute.',
  ],
  s0332: [
    'Fourth year, spring, first month, day renshen: this year\'s Mulan autumn hunt was ordered suspended.',
    'In spring of year 4, on renshen, the Mulan autumn hunt was canceled.',
  ],
  s0333: [
    'On day guiyou, the Imperial Ancestors were sacrificed to; Prince Yichu was ordered to perform the rite in his stead.',
    'On guiyou day, Prince Yichu sacrificed at the Imperial Ancestors on the Emperor\'s behalf.',
  ],
  s0334: [
    'On day guiwei, 80,000 taels from the Board of Revenue were allocated to loan rations to the poor in Zhili.',
    'On guiwei day, 80,000 taels were sent to loan Zhili poor rations.',
  ],
  s0335: [
    'That month, one month\'s relief was given for last year\'s hail in thirty-eight Zhili prefectures and counties including Tongzhou and one month for drought in Wuzhi and Jun, Henan.',
    'That month, Tongzhou and thirty-seven other districts received hail relief and Wuzhi and Jun drought relief for one month.',
  ],
  s0336: [
    'One month\'s rations were issued for floods in thirty Jiangsu prefectures, departments, counties, and guards including Taicang, seventeen Anhui, twelve Zhejiang counties and four salterns including Haining, nine Huai\'an salt fields, and hail in five Shandong counties including Linqing.',
    'One month\'s rations went to flooded and hail-hit districts across Jiangsu, Anhui, Zhejiang, and Shandong.',
  ],
  s0337: [
    'Seed and ration grain were loaned from granaries for last year\'s floods in twelve Henan counties including Wuzhi, fourteen Jiangxi counties including Dehua, three Hubei counties including Huangmei and their garrison guards, four Hunan prefectures and counties including Lizhou, ten Gansu prefectures and counties including Qinzhou, three cities including Qiqihar, and two months\' pay and grain to Taixing garrison troops, Jiangsu.',
    'Flood districts across several provinces received seed loans and Taixing troops two months\' pay.',
  ],
  s0338: [
    'Second month, day dingyou: Songyun was summoned as Left Censor-in-Chief of the Censorate.',
    'On dingyou in the second month, Songyun became Censorate Left Censor-in-Chief.',
  ],
  s0339: [
    'Fujun was made Jilin general; Muzhang\'a Minister of the Court of Colonial Affairs and Grand Councilor.',
    'Fujun went to Jilin and Muzhang\'a joined the Grand Council and Court of Colonial Affairs.',
  ],
  s0340: [
    'Jiangnan Canal governor-general Li Shixu died; Zhang Wenhao replaced him.',
    'Li Shixu died; Zhang Wenhao became Jiangnan canal governor-general.',
  ],
  s0341: [
    'On day jihai, the Emperor attended the classics lecture.',
    'On jihai day, the Emperor held classics lecture.',
  ],
  s0342: [
    'On day jiayin, the Emperor escorted the Empress Dowager to the Southern Park.',
    'On jiayin day, the Emperor took the Empress Dowager to the Southern Park.',
  ],
  s0343: [
    'On day dingsi, the Emperor went on the hunt enclosure circuit.',
    'On dingsi day, the Emperor went hunting.',
  ],
  s0344: [
    'On day jiwei, the Emperor escorted the Empress Dowager back to the palace.',
    'On jiwei day, the Emperor brought the Empress Dowager back from the park.',
  ],
  s0345: [
    'That month, one month\'s rations were issued to disaster victims in Tongshan, Jiangsu.',
    'That month, Tongshan received one month\'s rations.',
  ],
  s0346: [
    'Yu Dai was transferred to Jiangxi governor; Kang Shaoyong was made Guangxi governor.',
    'Yu Dai went to Jiangxi and Kang Shaoyong to Guangxi.',
  ],
  s0347: [
    'On day dinghai, the Emperor reviewed troops of the Vanguard Camp.',
    'On dinghai day, the Emperor reviewed Vanguard Camp troops.',
  ],
  s0348: [
    'Chu Pengling was dismissed; Chen Ruolin was made Minister of Works.',
    'Chu Pengling left office and Chen Ruolin became Minister of Works.',
  ],
  s0349: [
    'Summer, fourth month, day renxu: granary grain was loaned to troops of Daoshifu camp under Wuchang, Jingzhou garrison, and other Hubei units; two months\' pay and grain to disaster-zone troops of Xuzhou garrison mid-battalion, Jiangnan.',
    'On renxu in the fourth month, Hubei and Jiangnan disaster troops received grain and two months\' pay loans.',
  ],
  s0350: [
    'Fifth month, day jisi: the Emperor went to Black Dragon Pool to pray for rain.',
    'On jisi in the fifth month, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0351: [
    'On day jiaxu, it rained.',
    'On jiaxu day, rain fell.',
  ],
  s0352: [
    'Rites for sacrificing at the Tangzi altar were augmented.',
    'Sacrifices at the Tangzi altar were expanded.',
  ],
  s0353: [
    'On day wuyin, rites for announcing sacrifice at the rear hall of the Imperial Ancestors on the Empress Dowager\'s longevity birthday were augmented.',
    'On wuyin day, birthday announcement rites at the Imperial Ancestors rear hall were expanded.',
  ],
  s0354: [
    'Sixth month, new moon on day guisi: there was a solar eclipse.',
    'At the sixth-month new moon, guisi, there was an eclipse.',
  ],
  s0355: [
    'On day yisi, Zhang Shicheng was made Shanxi governor.',
    'On yisi day, Zhang Shicheng became Shanxi governor.',
  ],
  s0356: [
    'On day jiayin, the king of Siam, Zheng Fo, died.',
    'On jiayin day, King Zheng Fo of Siam died.',
  ],
  s0357: [
    'Autumn, seventh month, day bingzi: Han Huan was dismissed; Chen Ruolin was made Minister of Punishments, Lu Yizhuang Minister of Works, and Yao Wentian Left Censor-in-Chief.',
    'On bingzi in the seventh month, Han Huan left; Chen Ruolin, Lu Yizhuang, and Yao Wentian took new posts.',
  ],
  s0358: [
    'On day xinsi, Grand Secretary Dai Junyuan retired.',
    'On xinsi day, Dai Junyuan retired.',
  ],
  s0359: [
    'That month, granary grain was loaned to troops of Weichang and De\'an camps, Hubei.',
    'That month, Weichang and De\'an camp troops received grain loans.',
  ],
  s0360: [
    'Intercalary seventh month, day xinchou: Jiangsu governor Han Wenqi was demoted and transferred; Zhang Shicheng was transferred to Jiangsu governor; Zhu Guizhen was made Shanxi governor.',
    'On xinchou in the intercalary seventh month, Han Wenqi was demoted; Zhang Shicheng went to Jiangsu and Zhu Guizhen to Shanxi.',
  ],
  s0361: [
    'On day renyin, Han Kejun was made acting Yunnan-Guizhou governor-general.',
    'On renyin day, Han Kejun acted as Yunnan-Guizhou governor-general.',
  ],
  s0362: [
    'On day dingwei, Sun Yuting was made grand secretary and Jiang Youxian assisting grand secretary; both retained their governor-general posts.',
    'On dingwei day, Sun Yuting and Jiang Youxian became grand secretaries but stayed governors-general.',
  ],
  s0363: [
    'Chengdu general Nemashan died.',
    'Nemashan, Chengdu general, died.',
  ],
  s0364: [
    'Yihuang was made Suiyuan general.',
    'Yihuang became Suiyuan general.',
  ],
  s0365: [
    'On day xinhai, Fuchao was made Shanxi governor.',
    'On xinhai day, Fuchao became Shanxi governor.',
  ],
  s0366: [
    'On day yimao, quota taxes were remitted for last year\'s flood and drought in thirty-one Anhui prefectures and counties including Wuwei.',
    'On yimao day, thirty-one Anhui districts lost quota taxes for last year\'s flood and drought.',
  ],
  s0367: [
    'That month, silver and grain were loaned to two Jiangnan camps.',
    'That month, two Jiangnan camps received pay loans.',
  ],
  s0368: [
    'Eighth month, day renxu: Jiangsu surveillance commissioner Lin Zexu was ordered to dredge Zhejiang waterways.',
    'On renxu in the eighth month, Lin Zexu was ordered to dredge Zhejiang waterways.',
  ],
  s0369: [
    'On day jisi, the Emperor tested Hanlin and household officials; Zhu Fangzeng and five others were advanced to first rank, the rest promoted or demoted by degree.',
    'On jisi day, Hanlin were tested; Zhu Fangzeng and five took first rank and others rose or fell.',
  ],
  s0370: [
    'On day wuyin, the Emperor attended the classics lecture.',
    'On wuyin day, the Emperor held classics lecture.',
  ],
  s0371: [
    'On day gengchen, Suming\'a was made Guizhou governor.',
    'On gengchen day, Suming\'a became Guizhou governor.',
  ],
  s0372: [
    'On day bingxu, retired Grand Secretary Bolin died.',
    'On bingxu day, Bolin died in retirement.',
  ],
  s0373: [
    'On day dinghai, Chengge was made Jiangxi governor.',
    'On dinghai day, Chengge became Jiangxi governor.',
  ],
  s0374: [
    'That month, saltern duties were remitted and deferred for last year\'s floods at seven Changlu salterns including Xingguo and seven prefectures and counties including Cangzhou; quota taxes were remitted for drought in Yihe, Gansu.',
    'That month, Changlu and Cangzhou salterns and Yihe received tax deferrals for flood and drought.',
  ],
  s0375: [
    'Ninth month, day renyin: Huang Mingjie was made Zhejiang governor.',
    'On renyin in the ninth month, Huang Mingjie became Zhejiang governor.',
  ],
  s0376: [
    'On day guimao, school-field rent silver was remitted for disasters in eleven Anhui prefectures and counties including Wuwei.',
    'On guimao day, eleven Anhui districts lost school-field rent for disaster.',
  ],
  s0377: [
    'That month, rations were issued to disaster victims in four Shaanxi prefectures and counties including Ningqiang.',
    'That month, Ningqiang and three other Shaanxi districts received disaster rations.',
  ],
  s0378: [
    'Silver and grain were loaned to flooded troops of Guazhou camp, Jiangsu; granary grain for flood and hail in Anding and other Shaanxi counties.',
    'Guazhou troops and Anding and other Shaanxi counties received pay and grain loans.',
  ],
  s0379: [
    'Tenth month of winter, day yichou: Muslim chieftain Zhang Ge\'er entered the Wuleke pass; government troops were defeated; guards Huashanbu and others died in battle.',
    'On yichou in the tenth month, Zhang Ge\'er took Wuleke pass; government troops were beaten and Huashanbu and others fell.',
  ],
  s0380: [
    'On day bingzi, Bayanbatu and others led troops against Zhang Ge\'er and defeated him.',
    'On bingzi day, Bayanbatu defeated Zhang Ge\'er.',
  ],
  s0381: [
    'Zhang Ge\'er fled to Karatikin.',
    'Zhang Ge\'er fled toward Karatikin.',
  ],
  s0382: [
    'On day jiashen, retired Grand Secretary Zhang Xu died.',
    'On jiashen day, Zhang Xu died in retirement.',
  ],
  s0383: [
    'Because Sun Yuting memorialized opening the Wangying flood-reduction dam, he was ordered to proceed at once as opportunity allowed.',
    'Sun Yuting\'s plan to open the Wangying dam was ordered carried out promptly.',
  ],
  s0384: [
    'Eleventh month, day jiyou: because of the breach at thirteen forts of the Gaoyan embankment, Zhang Wenhao was referred to his ministry for severe deliberation.',
    'On jiyou in the eleventh month, Zhang Wenhao was censured for the Gaoyan thirteen-fort breach.',
  ],
  s0385: [
    'On day xinhai, Wenfu and Wang Tingzhen were ordered to Jiangnan to inspect the Gaoyan breach.',
    'On xinhai day, Wenfu and Wang Tingzhen went to inspect the Gaoyan breach.',
  ],
  s0386: [
    'Yan Huang was transferred to Jiangnan canal governor-general.',
    'Yan Huang became Jiangnan canal governor-general.',
  ],
  s0387: [
    'Zhang Jing acted as Hedong canal governor-general.',
    'Zhang Jing acted as Hedong canal governor-general.',
  ],
  s0388: [
    'On day jiayin, Sun Yuting was dismissed as Liangjiang governor-general for shielding Zhang Wenhao; Wei Yuanyu acted in his place.',
    'On jiayin day, Sun Yuting lost Liangjiang for shielding Zhang Wenhao; Wei Yuanyu acted in his place.',
  ],
  s0389: [
    'Minister of War Yulin was ordered to serve on the Grand Council.',
    'War Minister Yulin joined the Grand Council.',
  ],
  s0390: [
    'That month, rations were issued to disaster victims in Suzhou and Lingbi, Anhui, and garrison guards stationed there.',
    'That month, Suzhou, Lingbi, and local guards received disaster rations.',
  ],
  s0391: [
    'Pay silver was loaned to Jiangning Eight Banners and Liangjiang governor-garrison troops; rations were loaned to victims in thirteen Gansu prefectures and counties including Jingning and subjects of the Dongle assistant magistrate.',
    'Jiangning and Liangjiang troops and thirteen Gansu districts including Jingning received loans.',
  ],
  s0392: [
    'Twelfth month, new moon on day jiwei: the Emperor again went to the Dagao Hall to pray for snow.',
    'At the twelfth-month new moon, jiwei, the Emperor again prayed for snow at Dagao Hall.',
  ],
  s0393: [
    'On day wuchen, Wei Yuanyu was appointed Liangjiang governor-general and Yan Jian made grain-transport governor-general.',
    'On wuchen day, Wei Yuanyu became Liangjiang governor and Yan Jian grain-transport governor.',
  ],
  s0394: [
    'On day jimao, Mingshan was summoned to the capital; Changling was made Yunnan-Guizhou governor-general.',
    'On jimao day, Mingshan was called to Beijing and Changling to Yunnan-Guizhou.',
  ],
  s0395: [
    'The Gaoyan breach was closed.',
    'The Gaoyan breach closed.',
  ],
  s0396: [
    'Qingbao was made Uliassutai general; Na Qing\'an Rehe military governor; Mingshan Minister of Punishments, with Muzhang\'a acting.',
    'Qingbao went to Uliassutai, Na Qing\'an to Rehe, Mingshan to Punishments, Muzhang\'a acting.',
  ],
  s0397: [
    'That month, one month\'s rations and house-repair funds were issued to victims in three Yunnan counties including Taihe and salt-well households in Jingdong; one month\'s rations to victims in five Jiangsu prefectures and counties including Gaoyou and Qinghe Department.',
    'That month, Yunnan and Jiangsu disaster victims received rations and repair funds.',
  ],
  s0398: [
    'That year, Korea and Ryukyu sent tribute.',
    'That year, Korea and Ryukyu paid tribute.',
  ],
  s0399: [
    'Fifth year, spring, first month: Dai Sanxi was appointed Sichuan governor-general.',
    'In spring of year 5, Dai Sanxi became Sichuan governor-general.',
  ],
  s0400: [
    'On day xinhai, for three-year merit review Tuojin, Changling, Cao Zhenyong, Huang Yue, Yinghe, Wang Tingzhen, Jiang Youxian, Nayancheng, and Yan Huang were recorded for promotion; Qishan received governor rank.',
    'On xinhai day, nine ministers were recorded for merit and Qishan gained governor rank.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b04.mjs <translation.json>'
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
