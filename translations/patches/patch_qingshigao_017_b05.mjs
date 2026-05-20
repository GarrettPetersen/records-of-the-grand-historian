#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'That month, ration grain was granted to military and civil people in four Jiangsu prefectures and counties including Gaoyou, and in Tianchang county, Anhui, and Sizhou Guard, for last year\'s flood and drought disasters.',
    'That month, last year\'s flood-and-drought rations went to Gaoyou and three other Jiangsu districts, Tianchang, and Sizhou Guard.',
  ],
  s0402: [
    'Seed grain and ration grain were loaned to Wen\'an and Dacheng in Zhili, Ruyang and Huaining in Henan, seven prefectures and counties including Ningqiang in Shaanxi-Gansu, forty Gansu prefectures, departments, and counties including Didao and subordinates of the Sizhou sub-prefect and Zhuanglang assistant magistrates for flood, drought, and hail; ration grain to salt-field stove households at Liang-Huai Zhongzhen field; repair funds for flooded salt wells in Jingdong department, Yunnan; and last year\'s quota levies were remitted.',
    'Seed, rations, salt-field relief, and Yunnan salt-well funds were loaned or remitted across Zhili, Henan, Shaanxi-Gansu, Gansu, and Liang-Huai districts.',
  ],
  s0403: [
    'Second month, day gengshen: the Emperor attended the Classics Lecture.',
    'In month 2, gengshen, the Emperor attended the Classics Lecture.',
  ],
  s0404: [
    'On day jiazi, for the tomb visit Prince Zhuang, Tuojin, Lu Yinpu, and Wang Tingzhen were left in the capital to handle affairs.',
    'On jiazi day, Prince Zhuang, Tuojin, Lu Yinpu, and Wang Tingzhen stayed in Beijing for the tomb visit.',
  ],
  s0405: [
    'On day wuyin, the Emperor, escorting the Empress Dowager, paid rites at the tombs; one-third of quota levies in passed areas was remitted.',
    'On wuyin day, the Emperor escorted the Empress Dowager to the tombs and remitted one-third of passed-area quota tax.',
  ],
  s0406: [
    'The Emperor paid rites at the Western Zhao Tombs, Xiaoling, Xiao East Tombs, Jing Tomb, and Yu Tomb, inspected the auspicious tomb site at Baohuayu, and returned.',
    'The Emperor worshipped at the Western Zhao, Xiaoling, Xiao East, Jing, and Yu tombs, inspected Baohuayu, and returned.',
  ],
  s0407: [
    'On day jiashen, he visited the Southern Park for the battue.',
    'On jiashen day, the Emperor hunted at the Southern Park.',
  ],
  s0408: [
    'That month, one month\'s ration grain was granted to disaster victims in Tianchang, Anhui.',
    'That month, Tianchang received one month\'s disaster rations.',
  ],
  s0409: [
    'Third month, new moon on day wuzi: the Emperor returned to the capital.',
    'In month 3, wuzi new moon, the Emperor returned to Beijing.',
  ],
  s0410: [
    'Qishan was made Shandong governor.',
    'Qishan became Shandong governor.',
  ],
  s0411: [
    'On day jiachen, Cheng Hanzhang was made Zhejiang governor.',
    'On jiachen day, Cheng Hanzhang became Zhejiang governor.',
  ],
  s0412: [
    'On day renzi, Wang Ding, with first-rank insignia, acted as left vice minister of Revenue.',
    'On renzi day, Wang Ding with first rank acted as left revenue vice minister.',
  ],
  s0413: [
    'On day bingchen, Henan accumulated civilian arrears and river-works surcharge instalments were remitted.',
    'On bingchen day, Henan civilian arrears and river surcharge instalments were forgiven.',
  ],
  s0414: [
    'That month, seed grain and ration grain were loaned to Baodi and Jinghai in Zhili, seventeen Gansu departments and prefectures including Taozhou department and Zhuanglang subordinates, and plow-ox silver to disaster-hit banner people in Qiqihar.',
    'That month, Zhili, Gansu, and Qiqihar banner districts received seed, rations, or plow-ox relief.',
  ],
  s0415: [
    'Summer, fourth month, day yichou: Zhili accumulated arrears were remitted.',
    'In the fourth month, yichou, Zhili accumulated taxes were forgiven.',
  ],
  s0416: [
    'On day xinwei, Yilibu was made Shaanxi governor.',
    'On xinwei day, Yilibu became Shaanxi governor.',
  ],
  s0417: [
    'That month, granary grain was loaned to garrison troops of two Shanxi battalions including Ningwu and three Hubei battalions including Anlu, and the Jingzhou naval camp and rear camp of the provincial standard.',
    'That month, granary grain was loaned to disaster-zone garrisons in Shanxi, Hubei, and Jingzhou.',
  ],
  s0418: [
    'Fifth month, day jiawu: eunuch Ma Jinxian, at Xushuguan falsely claiming an imperial order to offer incense, was handed to the Board of Punishments for punishment.',
    'In month 5, jiawu, eunuch Ma Jinxian was sent to the Board of Punishments for falsely claiming an imperial incense mission at Xushuguan.',
  ],
  s0419: [
    'Governors-general and governors were instructed: whenever wanted eunuchs appear, they must be diligently arrested.',
    'An edict ordered governors to arrest wanted eunuchs diligently.',
  ],
  s0420: [
    'Those who falsely claimed to be on imperial errands were to be promptly memorialized for disposition.',
    'False imperial agents were to be reported at once.',
  ],
  s0421: [
    'On day dingyou, Huang Yue, on account of age, was dismissed from the Grand Council and assigned solely to ministry duties, while remaining on duty in the Southern Studios.',
    'On dingyou day, Huang Yue left the Grand Council for ministry work but stayed in the Southern Studios.',
  ],
  s0422: [
    'Wang Ding was ordered to serve in the Grand Council.',
    'Wang Ding joined the Grand Council.',
  ],
  s0423: [
    'Zhang Shicheng was transferred to Anhui governor and Tao Zhu to Jiangsu governor.',
    'Zhang Shicheng took Anhui and Tao Zhu Jiangsu.',
  ],
  s0424: [
    'On day wushen, Sun Yuting and Yan Jian were dismissed; Wei Yuanyu was made grain transport governor-general and Qishan Liangjiang governor-general.',
    'On wushen day, Sun Yuting and Yan Jian fell; Wei Yuanyu took grain transport and Qishan Liangjiang.',
  ],
  s0425: [
    'Yilibu was transferred to Shandong governor and Eshan to Shaanxi governor.',
    'Yilibu went to Shandong and Eshan to Shaanxi.',
  ],
  s0426: [
    'On day jiayin, because this year\'s grain transport was delayed, Sun Yuting and others were sharply rebuked.',
    'On jiayin day, Sun Yuting and others were sharply rebuked for delayed grain transport.',
  ],
  s0427: [
    'Yuting was referred to the ministry for severe discussion; Wei Yuanyu and Yan Jian were to be dealt with.',
    'Yuting faced severe ministry discipline; Wei Yuanyu and Yan Jian were also punished.',
  ],
  s0428: [
    'That month, Zhenyuan prefecture and subordinate counties in Guizhou were relieved for flood, quota levies remitted, troop pay loaned, and yamen repair funds granted.',
    'That month, Guizhou\'s Zhenyuan area received flood relief, tax remission, troop loans, and repair funds.',
  ],
  s0429: [
    'Granary grain was loaned to garrison troops of four Jingzhou-area camps in disaster zones in Hubei.',
    'Jingzhou-area Hubei garrisons received disaster granary loans.',
  ],
  s0430: [
    'Sixth month: Jiang Youshu was made grand secretary while remaining Zhili governor-general.',
    'In month 6, Jiang Youshu became grand secretary and stayed Zhili governor-general.',
  ],
  s0431: [
    'Minister of Rites Wang Tingzhen was made associate grand secretary.',
    'Wang Tingzhen was made associate grand secretary.',
  ],
  s0432: [
    'On day dingmao, Wei Yuanyu was demoted to third-rank cap and still retained grain transport governor-general.',
    'On dingmao day, Wei Yuanyu lost his cap to third rank but kept grain transport.',
  ],
  s0433: [
    'Sun Yuting and Yan Jian were both handed to Qishan to supervise dredging the Grand Canal; project costs were to be shared by Yuting, Jian, and Yuanyu.',
    'Sun Yuting and Yan Jian dredged the canal under Qishan; all three shared the costs.',
  ],
  s0434: [
    'On day jiaxu, Wei Yuanyu died; Lifanyuan Minister Muzhanga acted as grain transport governor-general and former Jiangning general Pugong acted Lifanyuan minister.',
    'On jiaxu day, Wei Yuanyu died; Muzhanga acted grain transport and Pugong Lifanyuan.',
  ],
  s0435: [
    'On day yiyou, on Tao Zhu\'s memorial, Jiangnan converted grain tribute was halted and river-sea combined transport was again deliberated.',
    'On yiyou day, Tao Zhu\'s memorial halted Jiangnan converted tribute and revived joint river-sea transport plans.',
  ],
  s0436: [
    'That month, grain prices were loaned to five Fujian camps including the provincial standard.',
    'That month, five Fujian garrisons received grain-price loans.',
  ],
  s0437: [
    'Autumn, seventh month, day dingwei: Deying\'a was made Uliastai general and Heshitai Chahar commander-in-chief.',
    'In the seventh month, dingwei, Deying\'a took Uliastai and Heshitai Chahar.',
  ],
  s0438: [
    'That month, quota levies on waterlogged land were reduced for seven Zhili prefectures and counties.',
    'That month, seven Zhili waterlogged districts lost quota tax by degree.',
  ],
  s0439: [
    'Eighth month: Songfu was made Minister of Punishments; Kang Shaoyong was transferred to Hunan governor and Su Chenge to Guangxi governor.',
    'In month 8, Songfu took Punishments, Kang Shaoyong Hunan, and Su Chenge Guangxi.',
  ],
  s0440: [
    'On day jiwei, the Emperor attended the Classics Lecture.',
    'On jiwei day, the Emperor attended the Classics Lecture.',
  ],
  s0441: [
    'On day jiwei, Chen Zhongfu was made grain transport governor-general; Chengge was transferred to Guangdong governor and Wulong\'a to Jiangxi governor.',
    'On jiwei day, Chen Zhongfu took grain transport, Chengge Guangdong, and Wulong\'a Jiangxi.',
  ],
  s0442: [
    'Ninth month, day yiyou: Nayancheng was summoned; Eshan acted Shaanxi-Gansu governor-general.',
    'In month 9, yiyou, Nayancheng was recalled and Eshan acted Shaanxi-Gansu.',
  ],
  s0443: [
    'Changling was made Shaanxi-Gansu governor-general, Zhao Shendian Yunnan-Guizhou governor-general, and Sun Erzhun Fujian-Zhejiang governor-general.',
    'Changling took Shaanxi-Gansu, Zhao Shendian Yunnan-Guizhou, and Sun Erzhun Fujian-Zhejiang.',
  ],
  s0444: [
    'Han Kejun was transferred to Fujian governor and Yilibu acted Yunnan governor.',
    'Han Kejun took Fujian and Yilibu acted Yunnan.',
  ],
  s0445: [
    'Wulong\'a was transferred to Shandong governor, Han Wenqi to Jiangsu governor, and Song Pu to Guizhou governor.',
    'Wulong\'a went to Shandong, Han Wenqi to Jiangsu, and Song Pu to Guizhou.',
  ],
  s0446: [
    'On day gengzi, Zhang Jing was made Hedong river course governor-general.',
    'On gengzi day, Zhang Jing became Hedong river governor-general.',
  ],
  s0447: [
    'On day jiachen, Deying\'a acted Ili general, Songyun acted Uliastai general, and Pugong acted left censor-in-chief.',
    'On jiachen day, Deying\'a acted Ili, Songyun Uliastai, and Pugong the Censorate\'s left chief.',
  ],
  s0448: [
    'Kashgar assisting ministers Bayanbatu and others led troops to suppress Zhang Ge\'er and wantonly killed Barak tribal people.',
    'Kashgar aides Bayanbatu and others suppressed Zhang Ge\'er and killed Baraks wantonly.',
  ],
  s0449: [
    'Their chief Tielieke gathered a mob and besieged Bayanbatu and others at Kashgar; Qingxiang sent Mukedengbu and others to reinforce.',
    'Chief Tielieke besieged Bayanbatu at Kashgar and Qingxiang sent Mukedengbu to aid.',
  ],
  s0450: [
    'Qingxiang was ordered to delay coming to the capital.',
    'Qingxiang was told to delay his capital arrival.',
  ],
  s0451: [
    'That month, hail disaster in four Shaanxi prefectures and counties including Yuide was relieved.',
    'That month, four Shaanxi districts including Yuide received hail relief.',
  ],
  s0452: [
    'New and old quota levies were remitted for fifteen Zhili prefectures and counties including Kaizhou for drought and hail.',
    'Fifteen Zhili districts including Kaizhou lost drought-and-hail quota taxes.',
  ],
  s0453: [
    'Winter, tenth month, day gengchen: Changling acted Ili general, Yang Yuchun acted Shaanxi-Gansu governor-general, and Eshan returned to Shaanxi governor.',
    'In month 10, gengchen, Changling acted Ili, Yang Yuchun Shaanxi-Gansu, and Eshan returned to Shaanxi.',
  ],
  s0454: [
    'Deying\'a was ordered to proceed to Uliastai.',
    'Deying\'a was sent to Uliastai.',
  ],
  s0455: [
    'Songyun was summoned to the capital.',
    'Songyun was recalled to Beijing.',
  ],
  s0456: [
    'On day xinsi, Jiang Youshu was summoned and Nayancheng became Zhili governor-general.',
    'On xinsi day, Jiang Youshu was recalled and Nayancheng took Zhili.',
  ],
  s0457: [
    'That month, hail disaster in three Shaanxi counties including Yulin was relieved.',
    'That month, three Shaanxi counties including Yulin received hail relief.',
  ],
  s0458: [
    'Eleventh month, day renchen: because Siam\'s tribute ship was wrecked, supplementary tribute was waived and the heir Zheng Fu was enfeoffed king of Siam.',
    'In month 11, renchen, Siam\'s wrecked tribute ship spared a makeup mission and Zheng Fu became king.',
  ],
  s0459: [
    'On day gengzi, Tuojin was relieved of supervising Punishments; Jiang Youshu replaced him and was made a Grand Councilor.',
    'On gengzi day, Tuojin left Punishments to Jiang Youshu, who also joined the Grand Council.',
  ],
  s0460: [
    'On day yisi, the Emperor prayed for snow at the Dagao Shrine.',
    'On yisi day, the Emperor prayed for snow at Dagao Shrine.',
  ],
  s0461: [
    'On day bingwu, quota levies on Zhili Changli land defending the Luan River were abolished.',
    'On bingwu day, Changli\'s Luan River defense land lost quota tax.',
  ],
  s0462: [
    'On day dingwei, it snowed.',
    'On dingwei day, it snowed.',
  ],
  s0463: [
    'Qingxiang was ordered to act Kashgar councilor with the rank of general.',
    'Qingxiang was to act Kashgar councilor as a general.',
  ],
  s0464: [
    'On day renzi, Qingxiang was made Kashgar councilor and commanding general of the Bordered Yellow Banner Han Army; before taking office Mukedengbu would act.',
    'On renzi day, Qingxiang became Kashgar councilor and Han Army commander; Mukedengbu acted until then.',
  ],
  s0465: [
    'Changling was appointed Ili general.',
    'Changling became Ili general.',
  ],
  s0466: [
    'That month, flood and hail in six Gansu prefectures and counties including Minzhou were relieved.',
    'That month, six Gansu districts including Minzhou received flood-and-hail relief.',
  ],
  s0467: [
    'Twelfth month, day jisi: delinquent levies were remitted for flooded Zhangqiu and Zouping in Shandong.',
    'In month 12, jisi, Zhangqiu and Zouping lost delinquent flood taxes.',
  ],
  s0468: [
    'On day wuyin, Prince Sengge Rinchen of Horqin was ordered to attend before the throne.',
    'On wuyin day, Prince Sengge Rinchen attended before the throne.',
  ],
  s0469: [
    'That month, drought and locust disaster in Fengtian\'s Jinzhou prefecture was relieved.',
    'That month, Jinzhou in Fengtian received drought-and-locust relief.',
  ],
  s0470: [
    'That year, Korea, Ryukyu, Siam, and Vietnam sent tribute.',
    'That year, Korea, Ryukyu, Siam, and Vietnam sent tribute.',
  ],
  s0471: [
    'Sixth year, spring, first month, day jiashen: for Shuangchengpu colonization fields, Fujun was given Grand Guardian of the Heir Apparent.',
    'In year 6, jiashen, Fujun received Grand Guardian for Shuangchengpu fields.',
  ],
  s0472: [
    'That month, flood disaster to banner households in Jinzhou and Zhongqiansuo in Fengtian was relieved.',
    'That month, Fengtian\'s Jinzhou and Zhongqiansuo banner flood victims were relieved.',
  ],
  s0473: [
    'Ration grain was granted to disaster victims in Pei county, Jiangsu.',
    'Pei county, Jiangsu, received disaster rations.',
  ],
  s0474: [
    'Seed grain and ration grain and granary stocks were loaned to banner people in Ningyuanzhou, Fengtian, seven Henan counties including Yanling, twelve Gansu prefectures and counties including Minzhou, Xiangyuan county, Shanxi, and three Zhili counties including Baodi for flood, drought, and hail.',
    'Seed, rations, and granary stocks were loaned across Fengtian, Henan, Gansu, Shanxi, and Zhili.',
  ],
  s0475: [
    'Second month, day wuwu: for the tomb visit Tuojin, Yinghe, Wang Tingzhen, and Lu Yinpu were left in the capital to handle affairs.',
    'In month 2, wuwu, Tuojin, Yinghe, Wang Tingzhen, and Lu Yinpu stayed in Beijing for the tombs.',
  ],
  s0476: [
    'On day jiaxu, the Emperor paid rites at the Western Tombs; one-third of quota levies in passed areas was remitted.',
    'On jiaxu day, the Emperor visited the Western Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0477: [
    'On day wuyin, rites were paid at Tailing, Tai East Tombs, and Chang Tomb.',
    'On wuyin day, the Emperor worshipped at Tailing, Tai East, and Chang tombs.',
  ],
  s0478: [
    'On day xinsi, the Emperor returned to the Old Summer Palace.',
    'On xinsi day, the Emperor returned to the Old Summer Palace.',
  ],
  s0479: [
    'Third month, day guisi: Zhang Jing was transferred to Jiangnan river course governor-general.',
    'In month 3, guisi, Zhang Jing became Jiangnan river governor-general.',
  ],
  s0480: [
    'On day gengxu, Pan Xien was awarded a third-rank cap and made vice director-general of the Southern Rivers.',
    'On gengxu day, Pan Xien received a third-rank cap and became Southern Rivers vice director-general.',
  ],
  s0481: [
    'That month, granary grain was loaned to Lingqiu county, Shanxi, and five Jingzhou-area Hubei camps disaster-hit troops.',
    'That month, Lingqiu and five Jingzhou camps received disaster granary loans.',
  ],
  s0482: [
    'Summer, fourth month, day jiazi: the Emperor prayed for rain at the Black Dragon Pool Shrine.',
    'In the fourth month, jiazi, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0483: [
    'On day jiaxu, Deng Tingzhen was made Anhui governor.',
    'On jiaxu day, Deng Tingzhen became Anhui governor.',
  ],
  s0484: [
    'On day bingzi, Zhu Changyi and 265 others were granted jinshi with differences in rank.',
    'On bingzi day, Zhu Changyi and 265 others received jinshi degrees.',
  ],
  s0485: [
    'That month, ration grain was granted to disaster victims in Pei county, Jiangsu.',
    'That month, Pei county again received disaster rations.',
  ],
  s0486: [
    'Money and grain were loaned to three camps of Xuzhou garrison, Jiangsu, and two Hubei camps at De\'an and Yidu in disaster zones.',
    'Disaster loans went to Xuzhou and De\'an-Yidu garrisons.',
  ],
  s0487: [
    'Fifth month, day yimao: Minister of Rites Mukedeng\'e was dismissed and Songyun replaced him.',
    'In month 5, yimao, Mukedeng\'e left Rites and Songyun replaced him.',
  ],
  s0488: [
    'Na Qing\'an was made left censor-in-chief.',
    'Na Qing\'an became left censor-in-chief.',
  ],
  s0489: [
    'Mingshan was made Rehe commander-in-chief.',
    'Mingshan became Rehe commander-in-chief.',
  ],
  s0490: [
    'On day wuxu, Yunnan-Guizhou Governor-General Zhao Shendian died; Ruan Yuan was transferred to replace him.',
    'On wuxu day, Zhao Shendian died and Ruan Yuan took Yunnan-Guizhou.',
  ],
  s0491: [
    'Songfu was made Huguang governor-general, Mingshan Minister of Punishments, and Qinghui Rehe commander-in-chief.',
    'Songfu took Huguang, Mingshan Punishments, and Qinghui Rehe.',
  ],
  s0492: [
    'On day renyin.',
    'On renyin day.',
  ],
  s0493: [
    'Delinquent quota levies on waterlogged land in five Zhili counties including Hejian were remitted.',
    'Five Zhili counties including Hejian lost waterlogged-land arrears.',
  ],
  s0494: [
    'That month, drought rations for one month were granted to twelve Shandong counties including Tangyi.',
    'That month, twelve Shandong counties including Tangyi received one month\'s drought rations.',
  ],
  s0495: [
    'Ration grain, seed grain, and granary stocks were loaned to five Zhili counties including Guangping, twelve Shandong counties including Tangyi, twelve Henan counties including Linzhang, and the Keluo battalion in Shanxi.',
    'Seed, rations, and granary stocks were loaned across Zhili, Shandong, Henan, and Shanxi.',
  ],
  s0496: [
    'Sixth month: Jiangling and Dangyang in Hubei were relieved for flood.',
    'In month 6, Jiangling and Dangyang received flood relief.',
  ],
  s0497: [
    'Drought rations were granted to seven Henan counties including Linzhang.',
    'Seven Henan counties including Linzhang received drought rations.',
  ],
  s0498: [
    'Drought-stricken troop pay was loaned to seven camps of Daming garrison standard, Zhili.',
    'Seven Zhili Daming camps received drought pay loans.',
  ],
  s0499: [
    'Autumn, seventh month, day guisi: Zhang Ge\'er roused Kokandians and Barak Muslims and entered the pass.',
    'In the seventh month, guisi, Zhang Ge\'er led Kokandians and Baraks through the pass.',
  ],
  s0500: [
    'Kashgar Muslims responded to him.',
    'Kashgar Muslims rallied to him.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b05.mjs <translation.json>'
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
