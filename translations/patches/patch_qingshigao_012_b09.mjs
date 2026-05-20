#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'That day, the court returned from the tour.',
    'That day, the court returned from the journey.',
  ],
  s0802: [
    'The deputy commander at Urumqi was changed to regional commander.',
    'Urumqi\'s deputy commander was made a regional commander.',
  ],
  s0803: [
    'On day yimao, Vice Minister Qiu Yuexiu was ordered to supervise Zhili waterworks.',
    'On yimao day, Qiu Yuexiu was put in charge of Zhili water conservancy.',
  ],
  s0804: [
    'Third month, day jiwei: the Emperor returned to the capital.',
    'In the third month, on jiwei day, the Emperor returned to Beijing.',
  ],
  s0805: [
    'On day renshen, quota land tax was remitted for thirty-one Shandong prefectures, counties, and garrisons including Qihe on account of flood.',
    'On renshen day, thirty-one Shandong units including Qihe were excused flood quota taxes.',
  ],
  s0806: [
    'On day dingmao, the Emperor visited Tailing.',
    'On dingmao day, the Emperor visited Tailing.',
  ],
  s0807: [
    'That day, the court returned from the tour.',
    'That day, the court returned from the journey.',
  ],
  s0808: [
    'Li Youyi of Ningjin County, a centenarian of one hundred three years, and his sons, nephews, and grandsons were rewarded with silver plates and lengths of satin with distinctions.',
    'Ningjin centenarian Li Youyi and his kin were given silver plates and satin by rank.',
  ],
  s0809: [
    'On day dingchou, three Ili Oirat superintendents were established, with varying numbers of deputy superintendents and subordinates.',
    'On dingchou day, three Ili Oirat superintendents were set up with graded subordinates.',
  ],
  s0810: [
    'On day wuyin, Fude was ordered to proceed to Kulun to handle affairs with Sangzhai Duorji.',
    'On wuyin day, Fude was sent to Kulun with Sangzhai Duorji.',
  ],
  s0811: [
    'On day bingxu, quota land tax was remitted for fourteen Jiangsu prefectures, counties, and garrisons including Qinghe on account of flood.',
    'On bingxu day, fourteen Jiangsu units including Qinghe were excused flood quota taxes.',
  ],
  s0812: [
    'Summer, fourth month, day renchen: relief was given for last year\'s flood in seventeen Zhejiang prefectures, counties, and salt-fields including Qiantang.',
    'In the fourth month, seventeen Zhejiang units including Qiantang were relieved for last year\'s flood.',
  ],
  s0813: [
    'On day guimao, the Emperor went to Black Dragon Pool to pray for rain.',
    'On guimao day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0814: [
    'On day yisi, it rained.',
    'On yisi day, rain fell.',
  ],
  s0815: [
    'On day wushen, Fa Qi was dismissed for corruption.',
    'On wushen day, Fa Qi was removed for graft.',
  ],
  s0816: [
    'Fu Liang was made commander at Guihua City.',
    'Fu Liang became Guihua City commander.',
  ],
  s0817: [
    'On day renzi, Qin Dacheng and one hundred eighty-eight others were granted jinshi and other degrees with distinctions.',
    'On renzi day, Qin Dacheng and 188 others received jinshi degrees with graded ranks.',
  ],
  s0818: [
    'On day jiayin, the post of commander at Guihua City was abolished.',
    'On jiayin day, the Guihua City commander post was cut.',
  ],
  s0819: [
    'Fifth month, day xinyou: Yuanmingyuan caught fire.',
    'In the fifth month, Yuanmingyuan burned.',
  ],
  s0820: [
    'On day guihai, Minister Agui was ordered to Bazhou and other places in Zhili to join Vice Minister Qiu Yuexiu and Governor-General Fang Guancheng in supervising dredging.',
    'On guihai day, Agui joined Qiu Yuexiu and Fang Guancheng to dredge Zhili waterways.',
  ],
  s0821: [
    'Shuhede was made acting Minister of Works.',
    'Shuhede acted as Minister of Works.',
  ],
  s0822: [
    'On day jiazi, Li Suan, grandson of the King of Korea, was enfeoffed as heir grandson.',
    'On jiazi day, Korean heir grandson Li Suan was enfeoffed.',
  ],
  s0823: [
    'On day jisi, Prince Guo Hongshi was stripped of princely rank for meddling in court affairs but was still granted beile.',
    'On jisi day, Prince Guo Hongshi lost his princedom for interfering in government but kept beile rank.',
  ],
  s0824: [
    'Prince He Hongzhou was fined three years\' salary for ceremonial impropriety.',
    'Prince He Hongzhou lost three years\' pay for ritual excess.',
  ],
  s0825: [
    'On day gengwu, Grand Secretary Shi Yizhi died.',
    'On gengwu day, Grand Secretary Shi Yizhi died.',
  ],
  s0826: [
    'On day renshen, the Emperor examined Hanlin and related officials; Wang Wenzhi and three others were ranked first class, the rest promoted or demoted by grade.',
    'On renshen day, Hanlin officials were examined; Wang Wenzhi and three others took first rank.',
  ],
  s0827: [
    'On day jiaxu, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
    'On jiaxu day, the Emperor accompanied the Empress Dowager on the autumn mulan hunt.',
  ],
  s0828: [
    'Li Shiyao was made Huguang governor-general; Fude was made Hubei governor, with Chen Hongmou acting.',
    'Li Shiyao became Huguang governor-general; Fude took Hubei and Chen Hongmou acted.',
  ],
  s0829: [
    'Liu Lun was transferred to Minister of Revenue while still acting as Minister of War.',
    'Liu Lun became Minister of Revenue and still acted at War.',
  ],
  s0830: [
    'Chen Hongmou was made Minister of War.',
    'Chen Hongmou became Minister of War.',
  ],
  s0831: [
    'Qiao Guanglie was transferred to Hunan governor; Laichao acted in his stead.',
    'Qiao Guanglie went to Hunan and Laichao acted.',
  ],
  s0832: [
    'On day yihai, Cui Yingjie was made Guizhou governor.',
    'On yihai day, Cui Yingjie became Guizhou governor.',
  ],
  s0833: [
    'On day jimao, Mingde was transferred to Jiangxi governor.',
    'On jimao day, Mingde became Jiangxi governor.',
  ],
  s0834: [
    'He Qizhong was made Shanxi governor.',
    'He Qizhong became Shanxi governor.',
  ],
  s0835: [
    'On day bingxu, Fude was ordered to proceed to Kulun on affairs, still bearing the acting title of Lifan Yuan vice minister.',
    'On bingxu day, Fude went to Kulun with an acting Lifan Yuan vice minister title.',
  ],
  s0836: [
    'Erjingge was made consultant minister and sent to Yarkand on affairs.',
    'Erjingge was sent to Yarkand as consultant minister.',
  ],
  s0837: [
    'Sixth month, day gengyin: locusts in Shandong prefectures and counties including Licheng.',
    'In the sixth month, locusts struck Shandong units including Licheng.',
  ],
  s0838: [
    'On day renchen, relief was given for flood, drought, and hail in thirty Gansu garrisons, prefectures, and counties including Didao.',
    'On renchen day, thirty Gansu units including Didao were relieved for flood, drought, and hail.',
  ],
  s0839: [
    'On day wuxu, Kai Tai was dismissed for cowardice and evading duty.',
    'On wuxu day, Kai Tai was removed for timidity and shirking.',
  ],
  s0840: [
    'E Bi was made Sichuan governor-general; Ming Shan was made Shaanxi governor with Aligun acting; Asiha was made Guangdong governor with Suchang acting, and Asiha was first ordered to act as Guangxi governor.',
    'E Bi took Sichuan; Ming Shan went to Shaanxi with Aligun acting; Asiha took Guangdong with Suchang acting and first held Guangxi.',
  ],
  s0841: [
    'On day renyin, Sichuan Governor-General E Bi died.',
    'On renyin day, Sichuan Governor-General E Bi died.',
  ],
  s0842: [
    'Aletai was made Sichuan governor-general; Cui Yingjie was made Shandong governor; Tulebing\'a was made Guizhou governor; Wu Dashan acted as Yunnan governor.',
    'Aletai took Sichuan, Cui Yingjie Shandong, Tulebing\'a Guizhou, and Wu Dashan acted in Yunnan.',
  ],
  s0843: [
    'Liang Shizheng was made Eastern Pavilion Grand Secretary; Liu Lun was made assisting Grand Secretary.',
    'Liang Shizheng became Eastern Pavilion Grand Secretary and Liu Lun assisting Grand Secretary.',
  ],
  s0844: [
    'Chen Hongmou was transferred to Minister of Personnel; Peng Qifeng to Minister of War; Zhang Taikai to Censor-in-chief.',
    'Chen Hongmou took Personnel, Peng Qifeng War, and Zhang Taikai the censorate.',
  ],
  s0845: [
    'On day jiachen, the Emperor visited Prince Jian\'s residence to inquire after his illness.',
    'On jiachen day, the Emperor called on the ailing Prince Jian.',
  ],
  s0846: [
    'On day renzi, Prince Jian Qitong\'a died.',
    'On renzi day, Prince Jian Qitong\'a died.',
  ],
  s0847: [
    'Autumn, seventh month, day gengshen: Yinglian entered mourning; Shuhede was ordered to act as Minister of Revenue while Liu Lun remained at the ministry to handle affairs.',
    'In the seventh month, Yinglian mourned; Shuhede acted at Revenue and Liu Lun stayed on duty.',
  ],
  s0848: [
    'On day wuchen, the Xining commissioner post was re-established, with Qishiwu appointed.',
    'On wuchen day, the Xining commissioner was restored under Qishiwu.',
  ],
  s0849: [
    'On day jisi, locusts in Zhili prefectures and counties including Dacheng and Cangzhou.',
    'On jisi day, locusts struck Zhili units including Dacheng and Cangzhou.',
  ],
  s0850: [
    'On day gengchen, Prince Lu Yuntang died.',
    'On gengchen day, Prince Lu Yuntang died.',
  ],
  s0851: [
    'Eighth month, day guisi: Urumqi city was given the name Dihua and Teneggel city the name Fukang.',
    'In the eighth month, Urumqi was named Dihua and Teneggel Fukang.',
  ],
  s0852: [
    'On day xinchou, the Emperor, accompanying the Empress Dowager, went to Mulan for the enclosure hunt.',
    'On xinchou day, the court with the Empress Dowager hunted at Mulan.',
  ],
  s0853: [
    'Ninth month, new moon on day yimao: there was a solar eclipse.',
    'On the ninth-month new moon of yimao, a solar eclipse occurred.',
  ],
  s0854: [
    'On day yichou, the Emperor, accompanying the Empress Dowager, returned to lodge at the Mountain Resort to Escape the Heat.',
    'On yichou day, the court with the Empress Dowager returned to the summer resort.',
  ],
  s0855: [
    'On day gengwu, the Emperor, accompanying the Empress Dowager, returned from the tour.',
    'On gengwu day, the court with the Empress Dowager returned from tour.',
  ],
  s0856: [
    'On day guiyou, the Lintao circuit in Gansu was changed to the courier circuit with concurrent inspection of Lanzhou prefecture, and the Taomin circuit to the circuit touring Gong, Qin, and Jie.',
    'On guiyou day, Gansu circuit posts were reorganized at Lintao and Taomin.',
  ],
  s0857: [
    'On day bingzi, the Emperor, accompanying the Empress Dowager, returned to the capital.',
    'On bingzi day, the court with the Empress Dowager returned to Beijing.',
  ],
  s0858: [
    'Winter, tenth month, day jiashen: Liang Shizheng and Gao Jin were made Grand Tutors of the Heir Apparent; Zhao Hui, Liu Lun, Aligun, Shuhede, Qin Huixuan, Agui, Chen Hongmou, Yang Xizhuo, Yang Tingzhang, Li Shiyao, Suchang, and Aletai Senior Guardians; Zhuang Yougong and Liu Zao Junior Guardians.',
    'In the tenth month, Liang Shizheng and Gao Jin became Grand Tutors; Zhao Hui and twelve others Senior Guardians; Zhuang Yougong and Liu Zao Junior Guardians.',
  ],
  s0859: [
    'On day bingxu, the Emperor personally mourned Prince Lu Yuntang.',
    'On bingxu day, the Emperor mourned Prince Lu Yuntang in person.',
  ],
  s0860: [
    'On day dingwei, quota land tax was remitted for nine Jiangsu prefectures and counties including Tongshan on account of flood.',
    'On dingwei day, nine Jiangsu units including Tongshan were excused flood quota taxes.',
  ],
  s0861: [
    'Eleventh month, new moon on day jiayin: Chenggunjab was summoned to the capital; Zhalafeng\'a acted as Uriankhai general and Yalang\'a remained at Kobdo.',
    'On the eleventh-month new moon, Chenggunjab was called to Beijing; Zhalafeng\'a acted at Uriankhai and Yalang\'a stayed at Kobdo.',
  ],
  s0862: [
    'On day xinyou, Hedong River-course Governor-General Zhang Shizai died; Ye Cunren replaced him.',
    'On xinyou day, Zhang Shizai died; Ye Cunren became Hedong river-course governor-general.',
  ],
  s0863: [
    'Asiha was transferred to Henan governor; Ming Shan to Guangdong governor; Mingde to Shaanxi governor; Fude to Jiangxi governor; and Chang Jun to Hubei governor.',
    'Asiha went to Henan, Ming Shan to Guangdong, Mingde to Shaanxi, Fude to Jiangxi, and Chang Jun to Hubei.',
  ],
  s0864: [
    'Yang Yingju was made acting Gansu governor.',
    'Yang Yingju acted as Gansu governor.',
  ],
  s0865: [
    'On day dingmao, Grand Secretary Liang Shizheng died.',
    'On dingmao day, Grand Secretary Liang Shizheng died.',
  ],
  s0866: [
    'On day jimao, Yang Tingzhang was made Grand Secretary of the Hall of Extending Benevolence while retaining his post as Fujian-Zhejiang governor-general.',
    'On jimao day, Yang Tingzhang became a grand secretary but kept Fujian-Zhejiang.',
  ],
  s0867: [
    'Twelfth month, day yiyou: quota land tax was remitted for ten Zhili prefectures and counties including Yanqing on account of hail and drought.',
    'In the twelfth month, ten Zhili units including Yanqing were excused hail and drought quota taxes.',
  ],
  s0868: [
    'On day dinghai, drought relief was given for famine victims in twelve Gansu garrisons and counties including Gaolan.',
    'On dinghai day, twelve Gansu units including Gaolan received drought relief.',
  ],
  s0869: [
    'On day xinmao, relief was given for flood in eight Shandong prefectures, counties, and garrisons including Jining.',
    'On xinmao day, eight Shandong units including Jining were relieved for flood.',
  ],
  s0870: [
    'On day yiwei, Guoduohuan was summoned to the capital; Fuseng\'a was transferred to Heilongjiang general.',
    'On yiwei day, Guoduohuan was called to Beijing and Fuseng\'a became Heilongjiang general.',
  ],
  s0871: [
    'On day gengzi, retired Censor-in-chief Mei Cheng died.',
    'On gengzi day, retired Censor-in-chief Mei Cheng died.',
  ],
  s0872: [
    'On day dingwei, Zhuoketu was ordered to proceed to Urumqi on affairs, replacing Jing\'e\'li returning to the capital.',
    'On dingwei day, Zhuoketu went to Urumqi in place of Jing\'e\'li.',
  ],
  s0873: [
    'Twenty-ninth year, spring, first month, new moon on day guichou: relief was given for disaster victims in seven Shandong prefectures, counties, and garrisons including Jining and twenty-four Gansu garrisons, prefectures, and counties including Yongchang.',
    'In spring of year 29, seven Shandong and twenty-four Gansu units including Jining and Yongchang received disaster relief.',
  ],
  s0874: [
    'On day jiaxu, added relief was given for earthquake victims in five Yunnan prefectures and counties including Jiangchuan, and quota land tax was also remitted.',
    'On jiaxu day, five Yunnan units including Jiangchuan received added earthquake relief and tax remission.',
  ],
  s0875: [
    'On day jimao, Korea presented tribute.',
    'On jimao day, Korea sent tribute.',
  ],
  s0876: [
    'Second month, day dinghai: Amin\'ertu was ordered to remain in Tibet on affairs, replacing Funai returning to the capital.',
    'In the second month, Amin\'ertu stayed in Tibet in place of Funai.',
  ],
  s0877: [
    'On day jiawu, the Emperor visited Tailing.',
    'On jiawu day, the Emperor visited Tailing.',
  ],
  s0878: [
    'On day yiwei, Guanyinbao was ordered to proceed to Ili, replacing Ailong\'a returning to the capital.',
    'On yiwei day, Guanyinbao went to Ili in place of Ailong\'a.',
  ],
  s0879: [
    'On day jihai, the Emperor returned to the capital.',
    'On jihai day, the Emperor returned to Beijing.',
  ],
  s0880: [
    'On day jiyou, quota land tax was remitted for last year\'s hail disaster in Zhili\'s Yuzhou and drought disaster in Wanquan County.',
    'On jiyou day, Yuzhou hail and Wanquan drought taxes were excused.',
  ],
  s0881: [
    'On day xinhai, quota land tax was remitted for three Hubei prefectures, counties, and garrisons including Mianyang on account of last year\'s flood.',
    'On xinhai day, three Hubei units including Mianyang were excused last year\'s flood taxes.',
  ],
  s0882: [
    'Third month, day guichou: Laibao, Grand Tutor of the Heir Apparent and Grand Secretary, died.',
    'In the third month, Grand Secretary Laibao died.',
  ],
  s0883: [
    'On day yimao, the Shaanxi-Gansu governor-general was moved to Lanzhou and given concurrent charge of Gansu governor affairs; the Gansu governor post was abolished.',
    'On yimao day, the Shaanxi-Gansu governor-general moved to Lanzhou and absorbed Gansu governorship.',
  ],
  s0884: [
    'The Guyuan regional commander was moved back to be stationed at Xi\'an.',
    'The Guyuan commander returned to Xi\'an.',
  ],
  s0885: [
    'The Hezhou regional commander was changed to Guyuan regional commander.',
    'The Hezhou commander became Guyuan regional commander.',
  ],
  s0886: [
    'Quota land tax was remitted for seven Shandong prefectures, counties, and garrisons including Jining on account of last year\'s flood.',
    'Seven Shandong units including Jining were excused last year\'s flood quota taxes.',
  ],
  s0887: [
    'On day gengshen, the Emperor went to the late Grand Secretary Laibao\'s residence to offer mourning gifts.',
    'On gengshen day, the Emperor mourned Laibao at his home.',
  ],
  s0888: [
    'Quota land tax was remitted for twenty-eight Jiangsu prefectures, counties, and garrisons including Tongshan on account of last year\'s flood.',
    'Twenty-eight Jiangsu units including Tongshan were excused last year\'s flood quota taxes.',
  ],
  s0889: [
    'On day renshen, Zhao Hui was ordered to act as Minister of Works; Agui was sent to Xining to join Qishiwu and the Changkya Khutuktu in selecting Golok headmen.',
    'On renshen day, Zhao Hui acted at Works and Agui went to Xining with Qishiwu and the Changkya Khutuktu for Golok headmen.',
  ],
  s0890: [
    'Summer, fourth month, day jiawu: relief was given for drought in Gansu counties including Jin County.',
    'In the fourth month, Gansu counties including Jin County received drought relief.',
  ],
  s0891: [
    'Fifth month, new moon on day renzi: an edict instructed Guangdong customs officials not to present pearls and the like as tribute.',
    'On the fifth-month new moon, Guangdong customs was told not to send pearls as tribute.',
  ],
  s0892: [
    'On day xinyou, Tuo Enduo was made acting Minister of War.',
    'On xinyou day, Tuo Enduo acted as Minister of War.',
  ],
  s0893: [
    'Sixth month, day guimao: relief was given for flood in Hunan prefectures and counties including Wugang.',
    'In the sixth month, Hunan units including Wugang were relieved for flood.',
  ],
  s0894: [
    'On day jiashen, Yugui was ordered to the northern route, replacing Zhalafeng\'a returning to the capital.',
    'On jiashen day, Yugui went north in place of Zhalafeng\'a.',
  ],
  s0895: [
    'On day dinghai, Hedong River-course Governor-General Ye Cunren died; Li Hong replaced him.',
    'On dinghai day, Ye Cunren died; Li Hong became Hedong river-course governor-general.',
  ],
  s0896: [
    'On day gengyin, locusts in Fengtian prefectures and counties including Ningyuan.',
    'On gengyin day, locusts struck Fengtian units including Ningyuan.',
  ],
  s0897: [
    'On day dingyou, relief was given for flood in Guangdong counties including Yingde.',
    'On dingyou day, Guangdong counties including Yingde were relieved for flood.',
  ],
  s0898: [
    'On day jiachen, Suchang was transferred to Fujian-Zhejiang governor-general; Li Shiyao to Liang-Guang governor-general, with Ming Shan acting.',
    'On jiachen day, Suchang took Fujian-Zhejiang, Li Shiyao Liang-Guang with Ming Shan acting.',
  ],
  s0899: [
    'Wu Dashan was transferred to Huguang governor-general.',
    'Wu Dashan became Huguang governor-general.',
  ],
  s0900: [
    'Liu Zao was made Yunnan-Guizhou governor-general.',
    'Liu Zao became Yunnan-Guizhou governor-general.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_012_b09.mjs <translation.json>'
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
