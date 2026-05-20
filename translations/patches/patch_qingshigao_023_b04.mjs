#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Fifth month, gengxu new moon: provinces were instructed to plant mulberry and tea widely.',
    'Month 5, gengxu new moon: provinces were told to plant mulberry and tea widely.',
  ],
  s0302: [
    'Zai Ling was made Grand Secretary of the Tiren Hall and put in charge of the Board of Works; Quan Qing, Minister of Justice, was to assist as Grand Secretary.',
    'Zai Ling became Tiren Hall Grand Secretary for Works; Quan Qing assisted as Grand Secretary.',
  ],
  s0303: [
    'On day xinwei, Chonghou was made minister envoy to Russia.',
    'On xinwei day, Chonghou became envoy to Russia.',
  ],
  s0304: [
    'Sixth month, day bingxu: Shaanxi overdue taxes were remitted.',
    'In month 6, bingxu, Shaanxi overdue taxes were remitted.',
  ],
  s0305: [
    'On day gengyin, the ban on private coining was strictly enforced.',
    'On gengyin day, private coining was strictly banned.',
  ],
  s0306: [
    'On day jiawu, Taiwan typhoon victims were relieved.',
    'On jiawu day, Taiwan typhoon victims were relieved.',
  ],
  s0307: [
    'On day gengzi, the Board of Punishments was instructed to define strictly the crime of county magistrates embezzling relief funds.',
    'On gengzi day, the Board of Punishments was told to fix penalties for magistrates who stole relief funds.',
  ],
  s0308: [
    'Autumn, seventh month, day yimao: Yunnan government troops recovered Gengma native city.',
    'In autumn month 7, yimao, Yunnan troops recovered Gengma.',
  ],
  s0309: [
    'On day xinwei, Wang Wenshao, Right Vice Minister of Rites, and Zhou Jiamu, Shuntian prefect, were assigned to the Zongli Yamen.',
    'On xinwei day, Wang Wenshao and Zhou Jiamu were posted to the Zongli Yamen.',
  ],
  s0310: [
    'On day renshen, penalties for delaying capital cases were tightened.',
    'On renshen day, delays in capital cases were punished more strictly.',
  ],
  s0311: [
    'On day jiaxu, Zeng Jize was made minister envoy to Britain and France.',
    'On jiaxu day, Zeng Jize became envoy to Britain and France.',
  ],
  s0312: [
    'On day dingchou, this year\'s autumn grain tax was remitted for Pingyang, Pu, Jie, and Jiang.',
    'On dingchou day, autumn tax was remitted for Pingyang, Pu, Jie, and Jiang.',
  ],
  s0313: [
    'That month, flood victims were relieved in Jinhua, Quzhou, Yanzhou, and Fuliang county.',
    'That month, Jinhua, Quzhou, Yanzhou, and Fuliang received flood relief.',
  ],
  s0314: [
    'Eighth month, day jimao: the Yongding River burst its banks.',
    'In month 8, jimao, the Yongding River burst.',
  ],
  s0315: [
    'On day bingxu, the Qin River burst its banks.',
    'On bingxu day, the Qin River burst.',
  ],
  s0316: [
    'On day wuzi, Chong\'an and Pucheng flood victims were relieved.',
    'On wuzi day, Chong\'an and Pucheng flood victims were relieved.',
  ],
  s0317: [
    'Ninth month, day dingsi: southeastern coastal officials were instructed to prepare flood relief in advance, clean up baojia registers, and guard against secret societies inciting disaster victims.',
    'In month 9, dingsi, southeast coast officials were told to prepare flood relief, fix baojia, and stop secret societies from stirring up victims.',
  ],
  s0318: [
    'On day guihai, Shanxi drought victims were relieved; overdue taxes were remitted for Yangqu and other counties, and autumn grain for Xugou and other counties.',
    'On guihai day, Shanxi drought relief was ordered and taxes were remitted for Yangqu, Xugou, and other counties.',
  ],
  s0319: [
    'On day wuchen, Lantian flood victims were relieved.',
    'On wuchen day, Lantian flood victims were relieved.',
  ],
  s0320: [
    'On day bingzi, the Fankou river embankment was repaired.',
    'On bingzi day, the Fankou river embankment was repaired.',
  ],
  s0321: [
    'Winter, tenth month, day renwu: Li Yangcai, a retired Guangxi regional commander, rebelled; Feng Zicai was ordered to suppress him.',
    'In winter month 10, renwu, retired Guangxi commander Li Yangcai rebelled and Feng Zicai was sent against him.',
  ],
  s0322: [
    'Overdue taxes and miscellaneous levies were remitted for Tongzhou, Haizhou, and four Huai\'an guards.',
    'Overdue taxes and levies were remitted for Tongzhou, Haizhou, and four Huai\'an guards.',
  ],
  s0323: [
    'On day dinghai, flood victims were relieved in Pu, Fan, and Shouyang.',
    'On dinghai day, Pu, Fan, and Shouyang received flood relief.',
  ],
  s0324: [
    'On day guisi, the Qin River burst again.',
    'On guisi day, the Qin River burst again.',
  ],
  s0325: [
    'Gansu flood victims were relieved.',
    'Gansu flood victims were relieved.',
  ],
  s0326: [
    'On day yiwei, fire broke out at the Beixin granary.',
    'On yiwei day, the Beixin granary burned.',
  ],
  s0327: [
    'On day wuxu, rear-mountain Taiwan villages including Jialiyuan submitted; aboriginal chiefs were bound, presented, and executed.',
    'On wuxu day, Taiwan rear-mountain villages including Jialiyuan submitted and their chiefs were executed.',
  ],
  s0328: [
    'Old and new quota taxes were remitted for war-affected Guizhou.',
    'Guizhou\'s old and new war taxes were remitted.',
  ],
  s0329: [
    'Eleventh month, day bingchen: the northern Grand Canal embankment was repaired.',
    'In month 11, bingchen, the northern Grand Canal embankment was repaired.',
  ],
  s0330: [
    'On day xinyou, Bai Yanhu raided the frontier; Liu Jintang defeated him.',
    'On xinyou day, Bai Yanhu raided the frontier and Liu Jintang beat him.',
  ],
  s0331: [
    'On day guihai, Li Yangcai held Vietnamese Changqing; Yang Chongya was ordered to suppress him.',
    'On guihai day, Li Yangcai held Changqing in Vietnam and Yang Chongya was sent against him.',
  ],
  s0332: [
    'On day jisi, an edict ordered governors-general and governors to discipline themselves and lead their subordinates.',
    'On jisi day, governors-general and governors were told to discipline themselves and lead subordinates.',
  ],
  s0333: [
    'Grand Councilors were told not to avoid resentment; ministry heads were told to guard against routine delay.',
    'Grand Councilors were told not to dodge resentment and ministry heads to stop dragging their feet.',
  ],
  s0334: [
    'On day jiaxu, winter solstice: Heaven was sacrificed at the Circular Mound.',
    'On jiaxu day, winter solstice, Heaven was sacrificed at the Circular Mound.',
  ],
  s0335: [
    'On day yihai, court congratulations were suspended.',
    'On yihai day, court congratulations were suspended.',
  ],
  s0336: [
    'Twelfth month, day jichou: an edict permanently abolished donation-for-office rules.',
    'In month 12, jichou, donation-for-office rules were abolished for good.',
  ],
  s0337: [
    'That year, overdue levies at the Renhe salt field were remitted twice.',
    'That year Renhe salt-field overdue levies were remitted twice.',
  ],
  s0338: [
    'Korea and Nepal presented tribute.',
    'Korea and Nepal paid tribute.',
  ],
  s0339: [
    'Fifth year, jimao cycle, spring, first month, yisi new moon: court banquets were suspended.',
    'Year 5, spring month 1, yisi new moon: court banquets were suspended.',
  ],
  s0340: [
    'On day yichou, an edict again ordered the war-funds donation quota stopped.',
    'On yichou day, the war-funds donation quota was again stopped.',
  ],
  s0341: [
    'The Gaochun embankment was repaired.',
    'The Gaochun embankment was repaired.',
  ],
  s0342: [
    'On day xinwei, Shanxi famine victims were relieved.',
    'On xinwei day, Shanxi famine victims were relieved.',
  ],
  s0343: [
    'Second month, day renwu: Jizhou magistrate Duan Dingyao was executed for embezzling relief funds.',
    'In month 2, renwu, Jizhou magistrate Duan Dingyao was executed for stealing relief funds.',
  ],
  s0344: [
    'On day guiwei, an edict restored Grand Canal grain transport.',
    'On guiwei day, Grand Canal grain transport was restored.',
  ],
  s0345: [
    'On day jiawu, Shanxi was instructed to clear waste land, register population, and equalize labor levies.',
    'On jiawu day, Shanxi was told to clear waste land, register people, and equalize labor levies.',
  ],
  s0346: [
    'On day jihai, the coffin was placed at the mountain tomb; officials were forbidden to levy improper charges.',
    'On jihai day, the coffin reached the tomb and officials were forbidden to levy improper charges.',
  ],
  s0347: [
    'Flood victims were relieved in Wen\'an and other districts.',
    'Wen\'an and other districts received flood relief.',
  ],
  s0348: [
    'Third month, day bingwu: bandit chief Zhong Wanxin joined Li Yangcai to attack Xuanguang; Feng Zicai joined Vietnamese forces to strike them.',
    'In month 3, bingwu, Zhong Wanxin joined Li Yangcai at Xuanguang and Feng Zicai struck them with Vietnamese troops.',
  ],
  s0349: [
    'On day renzi, quota taxes were remitted along the coffin route for Daxing, Tongzhou, Sanhe, Ji, and Zunhua.',
    'On renzi day, taxes on the coffin route were remitted for Daxing, Tongzhou, Sanhe, Ji, and Zunhua.',
  ],
  s0350: [
    'On day gengshen, Jamyang Hutuktu was granted an imperial patent and rewarded with hada and python-satin robes.',
    'On gengshen day, Jamyang Hutuktu received an imperial patent and hada and python-satin robes.',
  ],
  s0351: [
    'Bruhat and Kokand chiefs jointly raided the frontier; Liu Jintang defeated them.',
    'Bruhat and Kokand chiefs raided the frontier and Liu Jintang beat them.',
  ],
  s0352: [
    'On day yichou, the two Empresses Dowager were escorted to the Eastern Tombs.',
    'On yichou day, the two empresses dowager went to the Eastern Tombs.',
  ],
  s0353: [
    'On day jisi, the Zhaoxi, Xiaodong, and other tombs were visited.',
    'On jisi day, the Zhaoxi, Xiaodong, and other tombs were visited.',
  ],
  s0354: [
    'On day gengwu, Muzong was buried at Huiling and Empress Xiaozhe was enshrined with him.',
    'On gengwu day, Muzong was buried at Huiling with Empress Xiaozhe.',
  ],
  s0355: [
    'On day guiyou, the court returned from the Eastern Tombs.',
    'On guiyou day, the court returned from the Eastern Tombs.',
  ],
  s0356: [
    'Intercalary third month, day yihai: Muzong\'s spirit tablet was enshrined in the Imperial Ancestral Temple and an edict was proclaimed throughout the realm.',
    'Intercalary month 3, yihai, Muzong\'s spirit tablet entered the Ancestral Temple and an edict went out.',
  ],
  s0357: [
    'On day dinghai, Li Yangcai held Zheyan.',
    'On dinghai day, Li Yangcai held Zheyan.',
  ],
  s0358: [
    'On day jichou, river embankments at Xiangyang, Mianyang, and Tianmen were repaired.',
    'On jichou day, embankments at Xiangyang, Mianyang, and Tianmen were repaired.',
  ],
  s0359: [
    'On day gengyin, Wu Kedu, a Ministry of Personnel director, took poison at the Eastern Tombs and left a memorial requesting early designation of the heir.',
    'On gengyin day, Wu Kedu took poison at the Eastern Tombs and asked that the succession be settled early.',
  ],
  s0360: [
    'An empress dowager rescript ordered princes and ministers to deliberate and report.',
    'The empress dowager ordered princes and ministers to deliberate and report.',
  ],
  s0361: [
    'On day yiwei, Li Fengbao, a third-rank courtier, was made minister envoy to Germany.',
    'On yiwei day, Li Fengbao became envoy to Germany.',
  ],
  s0362: [
    'Summer, fourth month, day wushen: the Tongzhou section of the northern Grand Canal was repaired.',
    'In summer month 4, wushen, the Tongzhou Grand Canal section was repaired.',
  ],
  s0363: [
    'On day guichou, Wu Kedu was granted posthumous honors.',
    'On guichou day, Wu Kedu received posthumous honors.',
  ],
  s0364: [
    'An empress dowager rescript ordered Wu Kedu\'s original memorial, the deliberation memorials, memorials by Xu Tong, Baoting, Zhang Zhidong, and related edicts all filed at Yuqing Palace.',
    'The empress dowager ordered Wu Kedu\'s memorial, related deliberations, Xu Tong, Baoting, and Zhang Zhidong memorials, and edicts filed at Yuqing Palace.',
  ],
  s0365: [
    'Canal silver and overdue levies were remitted for disaster-affected Henan districts.',
    'Henan disaster districts had canal silver and overdue levies remitted.',
  ],
  s0366: [
    'On day jisi: earlier, Yi county magistrate Zhu Yongkang had been sentenced to exile for plotting to kill commissioner Gao Wenbao; the case was now referred to court deliberation.',
    'On jisi day, Yi magistrate Zhu Yongkang, earlier sentenced for plotting to kill Gao Wenbao, went to court deliberation.',
  ],
  s0367: [
    'The report was now submitted; an edict held the crime exceeded the statute and changed the sentence to death.',
    'The report came in and the court changed Zhu Yongkang\'s exile sentence to death.',
  ],
  s0368: [
    'Fifth month, day bingzi, summer solstice: Earth was sacrificed at the Square Mound.',
    'In month 5, bingzi, summer solstice, Earth was sacrificed at the Square Mound.',
  ],
  s0369: [
    'On day jimao, overdue levies at Liang-Huai, Tai, and Hai salt fields were remitted.',
    'On jimao day, Liang-Huai, Tai, and Hai salt-field arrears were remitted.',
  ],
  s0370: [
    'On day renwu, locusts appeared in Henan.',
    'On renwu day, locusts hit Henan.',
  ],
  s0371: [
    'On day jihai, government troops pacified the Zheyan bandits.',
    'On jihai day, government troops pacified the Zheyan bandits.',
  ],
  s0372: [
    'That month, wind-disaster victims were relieved in Qinghe and Andong.',
    'That month Qinghe and Andong received wind-disaster relief.',
  ],
  s0373: [
    'Rain fell in Shanxi.',
    'Shanxi had rain.',
  ],
  s0374: [
    'Earthquakes in Jie, Wen, and Xihe lasted thirteen days.',
    'Jie, Wen, and Xihe shook for thirteen days.',
  ],
  s0375: [
    'Sixth month, day renzi: the Board of Punishments reported on the Dongxiang case—false rebellion charges and reckless killings; dismissed magistrate Sun Dingyang and commander Li Youheng were sentenced to death.',
    'In month 6, renzi, the Board of Punishments said the Dongxiang case involved false rebellion charges; Sun Dingyang and Li Youheng were sentenced to death.',
  ],
  s0376: [
    'Soon Wen Ge and Ding Baozhen were both dismissed from office.',
    'Soon Wen Ge and Ding Baozhen were both dismissed.',
  ],
  s0377: [
    'Two hundred thousand taels from the treasury and three hundred thousand taels of Ding silver were ordered for Shanxi relief.',
    '200,000 treasury taels and 300,000 Ding silver taels were ordered for Shanxi relief.',
  ],
  s0378: [
    'On day jiwei, memorialists were instructed that matters referred to ministries for deliberation must not be raised outside protocol, and echoing or mass improper memorials were forbidden.',
    'On jiwei day, memorialists were told not to jump protocol on ministry cases or flood the throne with echoes.',
  ],
  s0379: [
    'Accumulated grain debts to state granaries were universally remitted in Shanxi.',
    'Shanxi\'s accumulated grain debts to state granaries were universally remitted.',
  ],
  s0380: [
    'Locusts appeared in the Urat, Alashan, and other banners.',
    'Locusts hit the Urat, Alashan, and other banners.',
  ],
  s0381: [
    'On day jiazi, an empress dowager rescript approved Prince Chun Yi Xuan to convalesce at home and released him from duties.',
    'On jiazi day, Prince Chun Yi Xuan was allowed to convalesce at home and left office.',
  ],
  s0382: [
    'Earthquake victims were relieved in Bin, Qian, Han, and Feng.',
    'Bin, Qian, Han, and Feng received earthquake relief.',
  ],
  s0383: [
    'Seventh month, day gengchen: Zhili flood victims were relieved.',
    'In month 7, gengchen, Zhili flood victims were relieved.',
  ],
  s0384: [
    'On day wuzi, because of abnormal stars and earthquakes, candid memorials were sought.',
    'On wuzi day, abnormal stars and earthquakes drew a call for candid memorials.',
  ],
  s0385: [
    'Provinces were instructed to accumulate grain reserves.',
    'Provinces were told to build grain reserves.',
  ],
  s0386: [
    'Summer salt tax was remitted for disaster-affected Jiang, Pu, and Yangcheng.',
    'Summer salt tax was remitted for Jiang, Pu, and Yangcheng.',
  ],
  s0387: [
    'On day gengyin, sea transport of tribute grain was restored.',
    'On gengyin day, sea grain transport was restored.',
  ],
  s0388: [
    'Eighth month, day wushen: the Great Soil and Great Grain were sacrificed.',
    'In month 8, wushen, the Great Soil and Great Grain were sacrificed.',
  ],
  s0389: [
    'An edict ordered provinces to recommend civil and military talent fit for appointment.',
    'Provinces were told to recommend civil and military talent fit for office.',
  ],
  s0390: [
    'On day renzi, retired Grand Secretary Shan Mouqian died.',
    'On renzi day, retired Grand Secretary Shan Mouqian died.',
  ],
  s0391: [
    'On day guichou, Boshan and other districts received flood relief.',
    'On guichou day, Boshan and other districts received flood relief.',
  ],
  s0392: [
    'On day yimao, locusts appeared in Jiangsu and Anhui subordinates.',
    'On yimao day, locusts hit Jiangsu and Anhui subordinates.',
  ],
  s0393: [
    'On day yichou, Jie, Wen, and Xihe received earthquake and flood relief.',
    'On yichou day, Jie, Wen, and Xihe received earthquake and flood relief.',
  ],
  s0394: [
    'Ninth month, day jiaxu: Zhili flood victims were relieved.',
    'In month 9, jiaxu, Zhili flood victims were relieved.',
  ],
  s0395: [
    'On day renchen, posthumous honorific titles were added for Wenzong and Muzong.',
    'On renchen day, posthumous titles were added for Wenzong and Muzong.',
  ],
  s0396: [
    'On day jihai, Chongqing and other districts were shaken by earthquake and relieved.',
    'On jihai day, Chongqing and other districts were shaken and relieved.',
  ],
  s0397: [
    'Winter, tenth month, xinchou new moon: deficient-harvest quota taxes were remitted for Quwo and other districts.',
    'Winter month 10, xinchou new moon: Quwo and other districts had deficient-harvest taxes remitted.',
  ],
  s0398: [
    'On day yimao, Fengtian banner station land levies were applied to standard relief grain.',
    'On yimao day, Fengtian banner station land levies went to standard relief grain.',
  ],
  s0399: [
    'On day dingsi, naval forces were instructed to train also in land warfare.',
    'On dingsi day, naval forces were told to train in land warfare too.',
  ],
  s0400: [
    'On day guihai, Xiushan and other districts received flood relief.',
    'On guihai day, Xiushan and other districts received flood relief.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b04.mjs <translation.json>'
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
