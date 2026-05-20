#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'On day wuchen, Changlin was ordered to serve as Grand Secretary and superintend the Court of Colonial Affairs.',
    'On wuchen, Changlin became Grand Secretary and head of the Court of Colonial Affairs.',
  ],
  s0202: [
    'Yinghe was made associate Grand Secretary.',
    'Yinghe became associate Grand Secretary.',
  ],
  s0203: [
    'Wen Fu was transferred to Minister of Personnel and Xi\'en to Minister of Works.',
    'Wen Fu took Personnel and Xi\'en, Works.',
  ],
  s0204: [
    'Na Qing\'an was made Minister of War and Yulin Left Censor-in-Chief.',
    'Na Qing\'an took War and Yulin the Left Censorate.',
  ],
  s0205: [
    'On day jisi, Fujun was made Minister of the Court of Colonial Affairs, Songlin Jilin general, De Ying\'a Heilongjiang general, and Yinghui Urumchi commandant.',
    'On jisi, Fujun took Colonial Affairs; Songlin, Jilin; De Ying\'a, Heilongjiang; Yinghui, Urumchi.',
  ],
  s0206: [
    'That month, flood disaster in Xing County, Shanxi, was relieved.',
    'That month, Xing County, Shanxi, received flood relief.',
  ],
  s0207: [
    'Autumn, seventh month: Cheng Zuluo was made Henan governor and Wang Ding acted for him.',
    'In month 7, Cheng Zuluo became Henan governor with Wang Ding acting.',
  ],
  s0208: [
    'Cheng Guoren was made Shaanxi governor.',
    'Cheng Guoren became Shaanxi governor.',
  ],
  s0209: [
    'That month, flood disaster in twenty-one Zhili prefectures and counties including Bazhou was relieved.',
    'That month, twenty-one Zhili districts including Bazhou received flood relief.',
  ],
  s0210: [
    'Eighth month, day guimao: Yunnan-Guizhou governor-general Shi Zhiguang was recalled to the capital and Mingshan replaced him.',
    'In month 8, guimao, Shi Zhiguang left Yunnan-Guizhou and Mingshan replaced him.',
  ],
  s0211: [
    'Sect bandit Zhu Mazai rebelled in Xin Cai County, Henan; Cheng Zuluo was ordered to capture and execute him.',
    'Zhu Mazai rebelled in Xin Cai, Henan, and Cheng Zuluo was told to capture him.',
  ],
  s0212: [
    'On day wushen, Qingbao was recalled; Zhao Shengzhen became Fujian-Zhejiang governor-general and Lu Kun Guangxi governor.',
    'On wushen, Qingbao was recalled; Zhao Shengzhen took Fujian-Zhejiang and Lu Kun, Guangxi.',
  ],
  s0213: [
    'On day gengxu, Lu Kun was ordered to act as Shaanxi governor.',
    'On gengxu, Lu Kun acted as Shaanxi governor.',
  ],
  s0214: [
    'On day wuchen, the Gurkha king was granted a jeweled cap knob and Kaji Bimuxingtaba a third-rank cap knob.',
    'On wuchen, the Gurkha king received a jeweled cap knob and Kaji Bimuxingtaba, third rank.',
  ],
  s0215: [
    'On day xinwei, Changlin and Songting were recalled; Nayancheng was ordered to act as Shaanxi-Gansu governor-general.',
    'On xinwei, Changlin and Songting were recalled and Nayancheng acted at Shaanxi-Gansu.',
  ],
  s0216: [
    'That month, ration grain was issued for flood disaster in three Henan counties including Anyang, twelve Zhili prefectures and counties including Bazhou, two Shanxi banners of Guihua and Salaqi, and three Shandong counties including En County.',
    'That month, ration grain went to flooded districts in Henan, Zhili, Shanxi, and Shandong.',
  ],
  s0217: [
    'Ration grain was loaned to flooded Mongols of Tumet.',
    'Flooded Tumet Mongols received loaned ration grain.',
  ],
  s0218: [
    'Quota taxes for disaster and shortfall were remitted and deferred for forty-one Shandong prefectures, counties, and guards including Gaotang and for Heqing and Jianchuan in Yunnan.',
    'Forty-one Shandong districts including Gaotang and Heqing and Jianchuan in Yunnan lost disaster taxes, by degree.',
  ],
  s0219: [
    'Ninth month, new moon on day renshen: Siam was permitted to present this year\'s regular tribute.',
    'At the ninth-month new moon, renshen, Siam could send this year\'s tribute.',
  ],
  s0220: [
    'On day jiaxu, 100,000 shi of grain from Tongcang was disbursed to relieve flood victims in Zhili.',
    'On jiaxu, 100,000 shi of Tongcang grain relieved Zhili flood victims.',
  ],
  s0221: [
    'On day yiyou, the Golok Tibetans in Sichuan were pacified.',
    'On yiyou, Sichuan Golok bandits were pacified.',
  ],
  s0222: [
    'Yan Huang was appointed Eastern Rivers grain-transport governor.',
    'Yan Huang became Eastern Rivers grain-transport governor.',
  ],
  s0223: [
    'On day gengyin, Jiang Youxian was ordered to act as Minister of Punishments.',
    'On gengyin, Jiang Youxian acted at Punishments.',
  ],
  s0224: [
    'Chen Ruolin was transferred to Sichuan governor-general and Li Hongbin to Huguang governor-general.',
    'Chen Ruolin took Sichuan and Li Hongbin, Huguang.',
  ],
  s0225: [
    'Wei Yuanyu was made Grand Canal transport governor-general and Han Wenqi Jiangsu governor.',
    'Wei Yuanyu took the Canal and Han Wenqi, Jiangsu.',
  ],
  s0226: [
    'On day gengzi, Lu Kun was transferred to Shaanxi governor.',
    'On gengzi, Lu Kun became Shaanxi governor.',
  ],
  s0227: [
    'Chengge was made Guangxi governor.',
    'Chengge became Guangxi governor.',
  ],
  s0228: [
    'That month, ration grain was issued to disaster victims in Ruichang County, Jiangxi, and Wuzhi and Yuanwu in Henan.',
    'That month, Ruichang in Jiangxi and Wuzhi and Yuanwu in Henan received ration grain.',
  ],
  s0229: [
    'Winter, tenth month, day bingwu: the Emperor visited the imperial tombs and ordered Prince Zhuang Mianké and others to remain in the capital to conduct affairs.',
    'In month 10, bingwu, the Emperor visited the tombs and left Prince Zhuang Mianké in charge at Beijing.',
  ],
  s0230: [
    'Nayancheng was appointed Shaanxi-Gansu governor-general and Jiang Youxian Minister of Punishments.',
    'Nayancheng took Shaanxi-Gansu and Jiang Youxian, Punishments.',
  ],
  s0231: [
    'On day yimao, having ended mourning the Emperor escorted the Empress Dowager to visit the Western Tombs and remitted one-tenth of quota taxes along the route.',
    'On yimao, after ending mourning the Emperor took the Empress Dowager to the Western Tombs and remitted one-tenth of route taxes.',
  ],
  s0232: [
    'On day jiwei, the Emperor visited Tailing, Taidongling, and Changling.',
    'On jiwei, the Emperor visited Tailing, Taidongling, and Changling.',
  ],
  s0233: [
    'On day gengshen, the Emperor visited Changling and performed the mourning-release rite.',
    'On gengshen, the Emperor performed the mourning-release rite at Changling.',
  ],
  s0234: [
    'On day guihai, the Emperor escorted the Empress Dowager back to the capital.',
    'On guihai, the court returned to Beijing with the Empress Dowager.',
  ],
  s0235: [
    'That month, flood disaster was relieved in Hezhou, Gansu, Suzhou, Anhui, forty-three Zhili prefectures and counties including Bazhou, Haizhou in Jiangsu, and Tianmen in Hubei.',
    'That month, flood relief went to Hezhou, Suzhou, Bazhou, Haizhou, Tianmen, and other stricken districts.',
  ],
  s0236: [
    'Ration grain was loaned for flood disaster to Guangning County in Mukden, five Shandong prefectures and counties including Puzhou, and two Heilongjiang stations including Kumul.',
    'Loaned ration grain went to Mukden, Shandong, and Heilongjiang flood districts.',
  ],
  s0237: [
    'Old and new quota taxes were remitted and deferred for six Gansu prefectures and counties including Jingning, twenty-three Henan subprefectures and counties including Yifeng, thirteen Hubei prefectures and counties including Mianyang, fifty-one Shandong prefectures, counties, and guards including Puzhou, eighteen Zhili prefectures and counties including Tongzhou, thirty-four Jiangsu subprefectures, prefectures, counties, and guards including Haizhou, owed grain for Mergen and Buteha, and regular and overflow salt levies for Changlu and Songjiang prefecture under Jiangsu.',
    'Quota taxes were remitted or deferred across flooded Gansu, Henan, Hubei, Shandong, Zhili, and Jiangsu districts, with arrears forgiven for Mergen, Buteha, and selected salt fields.',
  ],
  s0238: [
    'Eleventh month, new moon on day xinwei: Yulin was ordered to act as Minister of Rites.',
    'At the eleventh-month new moon, xinwei, Yulin acted at Rites.',
  ],
  s0239: [
    'On day guiwei, poor boat households in Guangzhou were comforted after the city fire.',
    'On guiwei, Guangzhou fire victims among poor boat people were relieved.',
  ],
  s0240: [
    'On day yiyou, Yulin was made Minister of Rites and Qingbao Left Censor-in-Chief.',
    'On yiyou, Yulin took Rites and Qingbao, the Left Censorate.',
  ],
  s0241: [
    'On day bingxu, secondary consort of the Niuhuru clan was installed as empress.',
    'On bingxu, Consort Niuhuru became empress.',
  ],
  s0242: [
    'The next day, an edict was promulgated throughout the realm.',
    'The next day, an edict went out to all under Heaven.',
  ],
  s0243: [
    'Grace was extended in differing degrees.',
    'General grace was granted by degree.',
  ],
  s0244: [
    'On day wuzi, Songyun was recalled and made Vice Director of the Court of Imperial Entertainments.',
    'On wuzi, Songyun was recalled as Vice Director of Imperial Entertainments.',
  ],
  s0245: [
    'On day renchen, the Emperor prayed for snow at Dagao Hall.',
    'On renchen, the Emperor prayed for snow at Dagao Hall.',
  ],
  s0246: [
    'On day dingyou, because the empress-installation rites were complete, the Empress Dowager was given the honorific title Empress Dowager Gongci Kangyu.',
    'On dingyou, after the empress rites the Empress Dowager received the title Gongci Kangyu.',
  ],
  s0247: [
    'The next day an edict was promulgated throughout the realm and grace extended in differing degrees.',
    'The next day an empire-wide edict granted grace by degree.',
  ],
  s0248: [
    'That month, flood and drought disaster in seven Anhui prefectures and counties including Suzhou and garrison settlements, and flood disaster in Wuzhi, Henan, were relieved; ration grain was issued to disaster victims in eight Anhui prefectures and counties including Sizhou and eleven Gansu prefectures and subprefectures including Hezhou.',
    'That month, Suzhou and other Anhui districts and Wuzhi in Henan received flood and drought relief, with ration grain for Sizhou and Hezhou areas.',
  ],
  s0249: [
    'Old and new quota taxes were remitted and deferred for seventeen Anhui prefectures and counties including Suzhou and garrison settlements, Wuzhi and Yangwu in Henan, six Gansu prefectures and subprefectures including Didao, seven Jiangxi counties including Nanchang and the Nanchang and Jiujiang guards, Lizhou in Hunan, and four prefectures and counties including Haining in Zhejiang; regular and overflow salt levies were also remitted for flooded Changlu salt fields and nine Lianghuai salterns including Banpu.',
    'Quota taxes were remitted or deferred in stricken Anhui, Henan, Gansu, Jiangxi, Hunan, and Zhejiang districts and at Changlu and Lianghuai salt fields.',
  ],
  s0250: [
    'Twelfth month, day bingwu: the Emperor prayed for snow at Dagao Hall.',
    'In month 12, bingwu, the Emperor prayed for snow at Dagao Hall.',
  ],
  s0251: [
    'On day guichou, because snow prayers had not been answered, a further seven days of prayer were ordered.',
    'On guichou, unanswered snow prayers brought orders for seven more days of prayer.',
  ],
  s0252: [
    'Rehe commandant Cheng De died and Qingbao replaced him.',
    'Cheng De of Rehe died and Qingbao succeeded him.',
  ],
  s0253: [
    'Songyun was granted a second-rank cap knob and made Left Censor-in-Chief.',
    'Songyun received a second-rank cap knob and became Left Censor-in-Chief.',
  ],
  s0254: [
    'Cheng Hanzhang was transferred to Shandong governor.',
    'Cheng Hanzhang became Shandong governor.',
  ],
  s0255: [
    'Chen Zhongfu was made Guangdong governor.',
    'Chen Zhongfu became Guangdong governor.',
  ],
  s0256: [
    'On day jiayin, bandits Lu Changchang and others rebelled in Yucheng County, Henan, and were captured and executed.',
    'On jiayin, Lu Changchang and other bandits in Yucheng, Henan, were captured and killed.',
  ],
  s0257: [
    'On day gengshen, apportioned levy silver owed by the people of Jiangsu and Anhui before Jiaqing 23 was remitted.',
    'On gengshen, Jiangsu and Anhui apportioned levies before Jiaqing 23 were forgiven.',
  ],
  s0258: [
    'De Ying\'a was transferred to Suiyuan general and Lu Cheng Heilongjiang general.',
    'De Ying\'a became Suiyuan general and Lu Cheng, Heilongjiang general.',
  ],
  s0259: [
    'On day yichou, fire broke out in the Han memorial-drafting office of the Grand Secretariat.',
    'On yichou, the Grand Secretariat Han drafting office burned.',
  ],
  s0260: [
    'That month, ration grain was issued for flood disaster in Dacheng County, Zhili.',
    'That month, Dacheng in Zhili received flood ration grain.',
  ],
  s0261: [
    'Relief silver for pay was loaned to garrison troops in stricken Zhili districts.',
    'Zhili garrison troops in disaster areas received loaned pay silver.',
  ],
  s0262: [
    'Quota taxes for flood and drought disaster were remitted and deferred for three Zhili counties including Longping and four Jiangsu counties including Shanyang.',
    'Longping and other Zhili counties and Shanyang and other Jiangsu counties lost flood and drought taxes.',
  ],
  s0263: [
    'That year, Korea, Siam, and Ryukyu sent tribute.',
    'That year, Korea, Siam, and Ryukyu paid tribute.',
  ],
  s0264: [
    'Third year, spring, first month, day renshen: the Emperor gave a banquet at Chonghua Palace for the court and Inner Palace academicians.',
    'In year 3, renshen, the Emperor feasted officials and academicians at Chonghua Palace.',
  ],
  s0265: [
    'Sun Erzhun was transferred to Fujian governor.',
    'Sun Erzhun became Fujian governor.',
  ],
  s0266: [
    'Tao Shu was made Anhui governor.',
    'Tao Shu became Anhui governor.',
  ],
  s0267: [
    'Because the Gurkha Erdini king sent Kaji Danapengzhabangli and others to congratulate the accession and present memorial and tribute, an edict praised and rewarded them generously.',
    'Gurkha envoys congratulating the accession were praised and richly rewarded.',
  ],
  s0268: [
    'On day renwu, the Emperor visited the Old Summer Palace.',
    'On renwu, the Emperor went to the Old Summer Palace.',
  ],
  s0269: [
    'On day yiwei, Grand Secretary Changlin was ordered to serve on the Grand Council above the rank of Grand Councilor.',
    'On yiwei, Changlin was placed above ordinary Grand Councilors on the Council.',
  ],
  s0270: [
    'Shi Zhiguang was made Left Censor-in-Chief.',
    'Shi Zhiguang became Left Censor-in-Chief.',
  ],
  s0271: [
    'That month, flood disaster was relieved for banner households at Xiaoheishan White Banner Fort in Mukden and thirty-six Zhili prefectures and counties including Bazhou and Haizhou in Jiangsu.',
    'That month, Mukden banner households and thirty-six Zhili and Jiangsu districts including Bazhou and Haizhou received flood relief.',
  ],
  s0272: [
    'One month\'s ration grain was issued for flood disaster in eight Jiangsu prefectures, counties, and guards including Pizhou, for flood and drought in twelve Anhui prefectures, counties, and guards including Suzhou, for flood in Wuzhi, Henan, and for disaster in six Shandong prefectures and counties including Puzhou.',
    'One month\'s ration grain went to flooded Pizhou and other Jiangsu districts, stricken Anhui districts, Wuzhi in Henan, and Puzhou and other Shandong districts.',
  ],
  s0273: [
    'Seed grain was loaned for drought in Haiyan and Changxing in Zhejiang, hail and flood in eleven Shaanxi subprefectures and counties including Liuba, earthquake in seventeen Gansu prefectures and counties including Jingning, flood at nine Lianghuai salterns including Banpu, flood in three Henan counties including Wuzhi, and flood to banner soldiers at Qiqihar and Mergen in Heilongjiang.',
    'Seed grain was loaned to drought, hail, flood, and earthquake districts in Zhejiang, Shaanxi, Gansu, Lianghuai, Henan, and Heilongjiang.',
  ],
  s0274: [
    'Second month, new moon on day xinchou: the former Grand Secretary Agui was ordered enshrined in the Grand Temple.',
    'At the second-month new moon, xinchou, former Grand Secretary Agui was enshrined in the Grand Temple.',
  ],
  s0275: [
    'Song Fu was transferred to Hunan governor.',
    'Song Fu became Hunan governor.',
  ],
  s0276: [
    'Cheng Guoren was made Guizhou governor.',
    'Cheng Guoren became Guizhou governor.',
  ],
  s0277: [
    'On day dingwei, sacrifice was offered to Confucius.',
    'On dingwei, the Emperor sacrificed to Confucius.',
  ],
  s0278: [
    'On day xinhai, the former Minister Tang Bin was enshrined in the Confucius temple.',
    'On xinhai, former Minister Tang Bin entered the Confucius temple.',
  ],
  s0279: [
    'On day guichou, the Emperor offered sacrifice at the Confucius temple, lectured at the Biyong, and granted Minister of Rites Wang Tingzhen the rank of Junior Mentor of the Heir Apparent.',
    'On guichou, the Emperor sacrificed at the Confucius temple, lectured at the Biyong, and made Wang Tingzhen Junior Mentor of the Heir Apparent.',
  ],
  s0280: [
    'That month, additional ration grain was issued to Dacheng County, Zhili.',
    'That month, Dacheng in Zhili received additional ration grain.',
  ],
  s0281: [
    'Third month, day renshen: the Emperor held court at the Hall of Diligent Government.',
    'In month 3, renshen, the Emperor held court at the Hall of Diligent Government.',
  ],
  s0282: [
    'On day yihai, the Emperor personally ploughed the sacred field, adding one furrow.',
    'On yihai, the Emperor ploughed the sacred field with one extra furrow.',
  ],
  s0283: [
    'On day bingzi, the Emperor escorted the Empress Dowager to the Southern Park.',
    'On bingzi, the Emperor took the Empress Dowager to the Southern Park.',
  ],
  s0284: [
    'The Emperor went on the autumn hunt.',
    'The Emperor went on the autumn hunt.',
  ],
  s0285: [
    'On day xinsi, the Emperor escorted the Empress Dowager back to the palace.',
    'On xinsi, the Empress Dowager returned to the palace.',
  ],
  s0286: [
    'On day jiawu, the Emperor escorted the Empress Dowager to review Jianrui Camp troops.',
    'On jiawu, the Empress Dowager reviewed Jianrui Camp troops.',
  ],
  s0287: [
    'On day wuxu, Cheng Hanzhang was transferred to Jiangxi governor and Qishan was ordered to act as Shandong governor.',
    'On wuxu, Cheng Hanzhang took Jiangxi and Qishan acted at Shandong.',
  ],
  s0288: [
    'That month, one month\'s additional ration grain was issued to disaster victims in Wen\'an County, Zhili.',
    'That month, Wen\'an in Zhili received an extra month\'s ration grain.',
  ],
  s0289: [
    'Summer, fourth month, day jiachen: Yan Jian was recalled and Jiang Youxian made Zhili governor-general.',
    'In month 4, jiachen, Yan Jian was recalled and Jiang Youxian took Zhili.',
  ],
  s0290: [
    'Na Qing\'an was transferred to Minister of Punishments and Yulin to Minister of War.',
    'Na Qing\'an took Punishments and Yulin, War.',
  ],
  s0291: [
    'Left Vice Minister of Revenue Mukedengge was made Minister of Rites.',
    'Mukedengge of Revenue became Minister of Rites.',
  ],
  s0292: [
    'On day guihai, the Emperor prayed for rain at Juesheng Temple.',
    'On guihai, the Emperor prayed for rain at Juesheng Temple.',
  ],
  s0293: [
    'On day jiazi, Lin Zhaotang and 246 others were granted jinshi and third-place honors with differing ranks.',
    'On jiazi, Lin Zhaotang and 246 others received jinshi ranks.',
  ],
  s0294: [
    'Fifth month, day xinwei: disaster in Zhili prefectures and counties including Bazhou was relieved.',
    'In month 5, xinwei, Bazhou and other Zhili districts received disaster relief.',
  ],
  s0295: [
    'That month, disaster victims in thirty-six Zhili prefectures and counties including Bazhou were relieved.',
    'That month, thirty-six Zhili districts including Bazhou received disaster relief.',
  ],
  s0296: [
    'Sixth month: Acting Minister of Works Zhang Wenhao was ordered to join Jiang Youxian in surveying the Northern Grand Canal and the Yongding, Daqing, and Hutuo rivers.',
    'In month 6, Zhang Wenhao joined Jiang Youxian to survey the Northern Canal and major Hebei rivers.',
  ],
  s0297: [
    'On day wuwu, Golefengge was made Uliastai general.',
    'On wuwu, Golefengge became Uliastai general.',
  ],
  s0298: [
    'The Yongding River burst its banks.',
    'The Yongding River burst its banks.',
  ],
  s0299: [
    'On day renxu, the Northern Grand Canal burst its banks.',
    'On renxu, the Northern Grand Canal burst its banks.',
  ],
  s0300: [
    'That month, two months\' additional ration grain was issued to disaster victims in Jinghai and Qing Counties, Zhili.',
    'That month, Jinghai and Qing in Zhili received two extra months\' ration grain.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b03.mjs <translation.json>'
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
