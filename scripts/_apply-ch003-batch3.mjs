#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal:
      'In the third month, on yichou, a broom star appeared in the constellations Bi and Mao.',
    idiomatic:
      'On yichou of the third month a comet appeared in Bi and Mao.',
  },
  s0202: {
    literal:
      'In the fourth month of summer, on wuyin, he traveled to the Jiucheng Palace.',
    idiomatic:
      'In the fourth summer month, on wuyin, the Emperor went to Jiucheng Palace.',
  },
  s0203: {
    literal:
      'On jiashen Ashina Jieshe\'er attacked the imperial encampment and was executed.',
    idiomatic:
      'On jiashen Ashina Jieshe\'er raided the imperial camp and was put to death.',
  },
  s0204: {
    literal:
      'On renyin, combusting stone at Yunyang measured a square zhang; by day it was like ash, by night it gave light, and whatever grass or wood was cast upon it burned — lasting many years before it stopped.',
    idiomatic:
      'On renyin a burning stone at Yunyang covered a square zhang: ash by day, luminous by night, and anything thrown on it caught fire — the wonder lasted years.',
  },
  s0205: {
    literal: 'From the previous winter no rain fell until the fifth month.',
    idiomatic: 'Drought had persisted since the previous winter through the fifth month.',
  },
  s0206: {
    literal:
      'On jiayin he avoided the main hall, ordered officials of the fifth rank and above to submit sealed memorials, reduced meals and halted corvée labor, dispatched envoys to relieve distress and review unjust cases — and then rain fell.',
    idiomatic:
      'On jiayin he left the main hall, called for sealed memorials from fifth-rank officials upward, cut court meals and corvée, sent relief missions and reviewed wrongful cases — and rain followed.',
  },
  s0207: {
    literal:
      'In the sixth month, on bingshen, his younger brother Yuan Ying was enfeoffed as Prince of Teng.',
    idiomatic:
      'In the sixth month, on bingshen, the Emperor\'s brother Li Yuan Ying was created Prince of Teng.',
  },
  s0208: {
    literal:
      'On xinwei, the first day of the eighth autumn month, there was a solar eclipse.',
    idiomatic:
      'On xinwei, the first day of the eighth month, the sun was eclipsed.',
  },
  s0209: {
    literal:
      'On gengchen Li Simo, Grand General of the Right Martial Guards, prefect of Huazhou and Prince of Huaihua, was installed as Turk qaghan and led his followers to pitch tents north of the Yellow River.',
    idiomatic:
      'On gengchen Li Simo, general of the Right Martial Guards and Prince of Huaihua, was made Turk qaghan and settled his people north of the Yellow River.',
  },
  s0210: {
    literal:
      'In the tenth winter month, on jiashen, he returned from the Jiucheng Palace.',
    idiomatic:
      'In the tenth month, on jiashen, he returned from Jiucheng Palace.',
  },
  s0211: {
    literal:
      'In the eleventh month, on xinhai, Yang Shidao, Palace Attendant and Duke of Ande, became Zhongshu Ling.',
    idiomatic:
      'On xinhai of the eleventh month Yang Shidao, Duke of Ande and Palace Attendant, became Director of the Secretariat.',
  },
  s0212: {
    literal:
      'In the twelfth month, on dingchou, Hou Junji, Minister of Personnel and Duke of Chen, became campaign commander of the Jiaozhi Circuit and led troops to attack Gaochang.',
    idiomatic:
      'On dingchou of the twelfth month Hou Junji, Duke of Chen and Minister of Personnel, took command of the Jiaozhi campaign and marched against Gaochang.',
  },
  s0213: {
    literal: 'On yihai the Prince Fu was enfeoffed as Prince of Zhao.',
    idiomatic: 'On yihai Prince Li Fu was created Prince of Zhao.',
  },
  s0214: {
    literal:
      'On renwu Wang Zhiyuan, military commissioner of Xi Prefecture, was guilty of a crime and executed.',
    idiomatic:
      'On renwu Wang Zhiyuan, military commissioner of Xi Prefecture, was executed for his crimes.',
  },
  s0215: {
    literal:
      'An edict ordered ever-normal granaries established simultaneously in the prefectures of Luo, Xiang, You, Xu, Qi, Bing, Qin, Pu, and others.',
    idiomatic:
      'An edict established ever-normal granaries in Luo, Xiang, You, Xu, Qi, Bing, Qin, Pu, and other prefectures.',
  },
  s0216: {
    literal:
      'On jichou Murong Nuohebo, Prince of Heyuan in Tuyuhun, came to receive a bride.',
    idiomatic:
      'On jichou Murong Nuohebo, Tuyuhun Prince of Heyuan, came to fetch his bride.',
  },
  s0217: {
    literal: 'On renchen he hunted at Xianyang.',
    idiomatic: 'On renchen the Emperor hunted at Xianyang.',
  },
  s0218: {
    literal:
      'That year Chuzhou reported: "Wild silkworms fed on oak leaves and spun cocoons as large as nai fruit, green in color, totaling six thousand five hundred seventy piculs.',
    idiomatic:
      'That year Chuzhou reported wild silkworms on oak leaves had spun green cocoons as large as nai fruit, totaling 6,570 piculs.',
  },
  s0219: {
    literal:
      '" Goguryeo, Silla, the Western Turks, Tukhara, Kang, An, Persia, Shule, Khotan, Yanqi, Gaochang, Linyi, Kunming, and tribal chiefs from the distant borderlands sent envoys in succession with tribute.',
    idiomatic:
      'Goguryeo, Silla, the Western Turks, Tukhara, Kang, An, Persia, Shule, Khotan, Yanqi, Gaochang, Linyi, Kunming, and distant tribal chiefs sent tribute missions in turn.',
  },
  s0220: {
    literal:
      'In the fourteenth year of Zhenguan, on gengzi of the first spring month, officials were first ordered to read the seasonal ordinances.',
    idiomatic:
      'In the fourteenth year of Zhenguan, on gengzi of the first spring month, the court first ordered officials to proclaim the seasonal ordinances.',
  },
  s0221: {
    literal: 'On jiayin he visited the residence of Prince Wei Tai.',
    idiomatic: 'On jiayin he visited Prince Wei Li Tai\'s mansion.',
  },
  s0222: {
    literal:
      'He pardoned those in Yongzhou and Chang\'an prisons down from capital crimes excluding great felonies.',
    idiomatic:
      'He pardoned all prisoners in Yongzhou and Chang\'an below the grade of great felony.',
  },
  s0223: {
    literal:
      'In the second month, on dingchou, he visited the Directorate of Education, personally offered the sacrifice, pardoned prisoners held by the Court of Judicial Review and Wannian county, promoted the libationer and below and diligent high-ranked students one grade, and granted cloth and silk in varying amounts.',
    idiomatic:
      'On dingchou of the second month he visited the Imperial University, led the sacrifice in person, freed prisoners of the Court of Review and Wannian, promoted outstanding students and the libationer one grade, and granted cloth and silk by rank.',
  },
  s0224: {
    literal:
      'On gengchen Li Daoming, Left Cavalry Guards General and Prince of Huaiyang, escorted the Princess Honghua back to Tuyuhun.',
    idiomatic:
      'On gengchen Li Daoming, Prince of Huaiyang and Left Cavalry Guards general, escorted Princess Honghua to Tuyuhun.',
  },
  s0225: {
    literal: 'On renwu he traveled to the hot springs.',
    idiomatic: 'On renwu he went to the hot springs.',
  },
  s0226: {
    literal: 'On xinmao he returned from the hot springs.',
    idiomatic: 'On xinmao he came back from the hot springs.',
  },
  s0227: {
    literal:
      'On yiwei an edict named eminent Confucians of former dynasties — Huang Kan and Chu Zhongdu of Liang; Xiong Ansheng and Shen Chong of Zhou; Shen Wen\'a, Zhou Hongzheng, and Zhang Ji of Chen; He Tuo, Liu Chao, and Liu Xuan of Sui — whose teachings many disciples still followed, and ordered their descendants sought out.',
    idiomatic:
      'On yiwei an edict honored former masters — Huang Kan and Chu Zhongdu of Liang, Xiong Ansheng and Shen Chong of Northern Zhou, Shen Wen\'a, Zhou Hongzheng, and Zhang Ji of Chen, He Tuo, Liu Chao, and Liu Xuan of Sui — and commanded that their descendants be found and rewarded.',
  },
  s0228: {
    literal:
      'In the third month, on wuwu, the post of Ambassador for Pacifying the North was established to protect the Turks.',
    idiomatic:
      'In the third month, on wuwu, the court created the post of Pacifying-the-North ambassador to oversee the Turks.',
  },
  s0229: {
    literal:
      'In the fifth summer month, on renxu, Prince Lingkai of Yan was moved to Prince of Lu.',
    idiomatic:
      'In the fifth month, on renxu, Prince Lingkai of Yan was retitled Prince of Lu.',
  },
  s0230: {
    literal: 'In the sixth month, on yiyou, a great wind uprooted trees.',
    idiomatic: 'In the sixth month, on yiyou, a gale uprooted trees.',
  },
  s0231: {
    literal: 'On jichou the Xueyantuo sent envoys to request a marriage alliance.',
    idiomatic: 'On jichou the Xueyantuo sought a marriage alliance by envoy.',
  },
  s0232: {
    literal:
      'On yiwei wild silkworms in Chuzhou produced cocoons totaling eight thousand three hundred piculs harvested.',
    idiomatic:
      'On yiwei Chuzhou reported another wild-silkworm harvest of 8,300 piculs of cocoons.',
  },
  s0233: {
    literal: 'In the eighth month, on gengwu, the new Xiangcheng Palace was built.',
    idiomatic: 'In the eighth month, on gengwu, work was completed on Xiangcheng Palace.',
  },
  s0234: {
    literal:
      'On guisi Hou Junji, campaign commander of the Jiaozhi Circuit, pacified Gaochang and established Western Prefecture on its territory.',
    idiomatic:
      'On guisi Hou Junji, Jiaozhi campaign commander, conquered Gaochang and created Western Prefecture on its lands.',
  },
  s0235: {
    literal:
      'In the ninth month, on guimao, a partial pardon was granted for great felonies in Western Prefecture.',
    idiomatic:
      'In the ninth month, on guimao, Western Prefecture received a partial amnesty for capital crimes.',
  },
  s0236: {
    literal:
      'On yimao the Anxi Protectorate was established at Western Prefecture.',
    idiomatic:
      'On yimao the court established the Anxi Protectorate at Western Prefecture.',
  },
  s0237: {
    literal:
      'In the tenth winter month, on jimao, an edict ordered Li Xiaogong, posthumous Prince Yuan of Hejian and Minister of Works; Yin Kaishan, posthumous Duke of Yun and Right Vice Director of the Shandong Circuit Grand Secretariat; Liu Zhenghui, posthumous Duke of Yu and Minister of Revenue — and others — enshrined in Gaozu\'s temple courtyard.',
    idiomatic:
      'In the tenth month, on jimao, an edict enshrined Li Xiaogong of Hejian, Yin Kaishan of Yun, Liu Zhenghui of Yu, and other founding ministers in Gaozu\'s temple.',
  },
  s0238: {
    literal: 'On yiwei of the intercalary month he traveled to Tong Prefecture.',
    idiomatic: 'On yiwei of the intercalary month he went to Tongzhou.',
  },
  s0239: {
    literal: 'On jiachen he hunted at Yao Mountain.',
    idiomatic: 'On jiachen he hunted on Mount Yao.',
  },
  s0240: {
    literal: 'On gengxu he returned from Tong Prefecture.',
    idiomatic: 'On gengxu he returned from Tongzhou.',
  },
  s0241: {
    literal:
      'On bingchen Tibet sent envoys presenting a thousand jin of gold vessels to seek a marriage alliance.',
    idiomatic:
      'On bingchen Tibet sent envoys with a thousand jin of gold vessels to negotiate a royal marriage.',
  },
  s0242: {
    literal:
      'On jiazi, the first day of the eleventh month, the winter solstice arrived.',
    idiomatic:
      'On jiazi, the first day of the eleventh month, the sun reached its southern limit.',
  },
  s0243: {
    literal: 'He performed the suburban sacrifice at the Round Mound.',
    idiomatic: 'He offered the suburban rite at the Round Mound altar.',
  },
  s0244: {
    literal:
      'In the twelfth month, on dingyou, the Jiaozhi Circuit army returned.',
    idiomatic:
      'In the twelfth month, on dingyou, the Jiaozhi expedition returned.',
  },
  s0245: {
    literal:
      'Hou Junji, Minister of Personnel and Duke of Chen, brought the King of Gaochang Qu Zhisheng captive, presented the victory at the Hall of Observing Virtue, performed the ritual of reception on return from campaign, and granted three days of public feasting.',
    idiomatic:
      'Hou Junji, Duke of Chen, presented the captive King Qu Zhisheng of Gaochang at the Hall of Observing Virtue, held the victory feast, and granted three days of public revelry.',
  },
  s0246: {
    literal: 'On yimao the Goguryeo crown prince Sanggwon came to court.',
    idiomatic: 'On yimao the Goguryeo crown prince came to court.',
  },
  s0247: {
    literal:
      'In the fifteenth year of Zhenguan, on dingmao of the first spring month, Tibet sent its chancellor Gar Tongtsen to receive the bride.',
    idiomatic:
      'In the fifteenth year of Zhenguan, on dingmao of the first spring month, Tibet sent Chancellor Gar Tongtsen to fetch the princess.',
  },
  s0248: {
    literal:
      'On dingchou Li Daozong, Minister of Rites and Prince of Jiangxia, escorted the Princess Wencheng to Tibet.',
    idiomatic:
      'On dingchou Li Daozong, Prince of Jiangxia and Minister of Rites, escorted Princess Wencheng to Tibet.',
  },
  s0249: {
    literal: 'On xinsi he traveled to the Luoyang Palace.',
    idiomatic: 'On xinsi he went to the Luoyang palace.',
  },
  s0250: {
    literal:
      'In the third month, on wushen, he traveled to the Xiangcheng Palace.',
    idiomatic:
      'In the third month, on wushen, he went to Xiangcheng Palace.',
  },
  s0251: {
    literal: 'On gengwu he departed the Xiangcheng Palace.',
    idiomatic: 'On gengwu he left Xiangcheng Palace.',
  },
  s0252: {
    literal:
      'In the fourth summer month, on xinmao, an edict ordered the feng and shan rites at Mount Tai in the second month of the coming year, and the relevant offices to draft the ritual protocol in detail.',
    idiomatic:
      'In the fourth month, on xinmao, an edict scheduled the feng and shan at Mount Tai for the second month of the coming year and ordered the rites office to draft the protocol.',
  },
  s0253: {
    literal:
      'In the fifth month, on renshen, monks, Daoists, and elders of Bing Prefecture submitted memorials stating that Taiyuan was where the imperial enterprise arose, and after the fengshan next year they hoped he would visit from time to time.',
    idiomatic:
      'In the fifth month, on renshen, Bingzhou monks, Daoists, and elders petitioned that Taiyuan had nurtured the royal enterprise and begged him to visit after next year\'s fengshan.',
  },
  s0254: {
    literal:
      'At the Wucheng Hall he gave a banquet and, at ease, said to his attending ministers: "In my youth at Taiyuan I loved gathering for games of chance; summers passed and winters came — nearly thirty years.',
    idiomatic:
      'At Wucheng Hall he feasted his ministers and said lightly: "In my youth at Taiyuan I loved gathering for dice and wagers — nearly thirty summers and winters have passed.',
  },
  s0255: {
    literal:
      '" Among those present were some who had known him of old; they recounted old times together for laughter and pleasure.',
    idiomatic:
      'Some old acquaintances were present; they traded reminiscences and laughter.',
  },
  s0256: {
    literal:
      'He then said to them: "Others may speak with flattery to one\'s face.',
    idiomatic:
      'He added: "Strangers may flatter me to my face,',
  },
  s0257: {
    literal:
      'You are my old friends — tell me in truth: how is government and instruction today for the common people?',
    idiomatic:
      'but you are my old companions — speak plainly: how fares governance for the people today?',
  },
  s0258: {
    literal: 'Are there no hardships among the people?"',
    idiomatic: 'Are the people free of hardship?"',
  },
  s0259: {
    literal:
      'They all replied: "At present the four seas are at peace and the people rejoice — this is Your Majesty\'s achievement.',
    idiomatic:
      'They answered: "The realm is at peace and the people rejoice — all through Your Majesty\'s virtue.',
  },
  s0260: {
    literal:
      'We in our remaining years cherish each day under your sage rule and know no hardship."',
    idiomatic:
      'We in our old age savor each day of your rule and scarcely know want."',
  },
  s0261: {
    literal:
      'They therefore urgently petitioned that he pass through Bing Prefecture.',
    idiomatic:
      'They then pressed him to visit Bingzhou on his way.',
  },
  s0262: {
    literal:
      'The Emperor said: "Even a bird passing its old nest hesitates and circles;',
    idiomatic:
      'The Emperor replied: "Even a bird over its old nest hesitates and wheels about;',
  },
  s0263: {
    literal:
      'how much more I, who rose in arms at Taiyuan and secured the realm, and roamed there in youth — truly I cannot forget it.',
    idiomatic:
      'how much more I, who raised arms at Taiyuan and won the realm, and wandered there as a youth — I cannot forget it.',
  },
  s0264: {
    literal:
      'When the Mount Tai rites are complete, perhaps I may hope to meet you again."',
    idiomatic:
      'When the Tai rites are done, perhaps we may meet again."',
  },
  s0265: {
    literal: 'He then granted gifts to each in varying measure.',
    idiomatic: 'He then gave each man gifts according to rank.',
  },
  s0266: {
    literal: 'On bingzi King Buyeo Jang of Baekje died.',
    idiomatic: 'On bingzi King Jang of Baekje died.',
  },
  s0267: {
    literal:
      'An edict installed his heir Buyeo Yichi to succeed his father\'s position and enfeoffed him as Prince of Daifang Commandery.',
    idiomatic:
      'An edict enthroned his heir Buyeo Yichi and created him Prince of Daifang.',
  },
  s0268: {
    literal:
      'In the sixth month, on wushen, an edict ordered all prefectures to recommend men learned in ancient and modern texts, filial and pure in conduct, or outstanding in literary composition, all to assemble at Mount Tai in the second month of the coming year.',
    idiomatic:
      'On wushen of the sixth month an edict called on every prefecture to nominate scholars versed in the classics, men of filial purity, and gifted writers to gather at Mount Tai the following second month.',
  },
  s0269: {
    literal:
      'On jiyou a broom star appeared in Taiwei and trespassed on the Courtiers\' quarters.',
    idiomatic:
      'On jiyou a comet appeared in Taiwei and crossed the Courtiers\' Belt.',
  },
  s0270: {
    literal:
      'On bingchen the fengshan at Mount Tai was halted; he avoided the main hall to reflect on faults and ordered reduced meals.',
    idiomatic:
      'On bingchen the Mount Tai fengshan was canceled; he left the main hall to ponder his faults and ordered leaner meals.',
  },
  s0271: {
    literal: 'In the seventh autumn month, on jiaxu, the broom star vanished.',
    idiomatic: 'In the seventh month, on jiaxu, the comet disappeared.',
  },
  s0272: {
    literal:
      'In the tenth winter month, on xinmao, he held a great review at Yique.',
    idiomatic:
      'In the tenth month, on xinmao, he held a grand review at Yique.',
  },
  s0273: {
    literal: 'On renchen he traveled to Songyang.',
    idiomatic: 'On renchen he went to Songyang.',
  },
  s0274: {
    literal: 'On xinchou he returned to the palace.',
    idiomatic: 'On xinchou he went back to the palace.',
  },
  s0275: {
    literal: 'In the eleventh month, on renxu, village heads were abolished.',
    idiomatic: 'In the eleventh month, on renxu, the office of village head was abolished.',
  },
  s0276: {
    literal: 'On renshen he returned to the capital.',
    idiomatic: 'On renshen he returned to Chang\'an.',
  },
  s0277: {
    literal:
      'On guiyou the Xueyantuo led the peoples of Tongluo, Pugu, Huihe, Mohe, and Xi across the desert and encamped on the White Road River.',
    idiomatic:
      'On guiyou the Xueyantuo crossed the desert with Tongluo, Pugu, Huihe, Mohe, and Xi forces and camped on the White Road River.',
  },
  s0278: {
    literal:
      'The Emperor ordered Zhang Jian, military commissioner of Ying Prefecture, to command his troops to press their eastern border;',
    idiomatic:
      'He ordered Zhang Jian, commissioner of Yingzhou, to press them from the east;',
  },
  s0279: {
    literal:
      'Li Ji, Minister of War, became campaign commander of Shuofang; Li Daliang, Right Guard General, became campaign commander of the Lingzhou Circuit; Li Xiyu, military commissioner of Liang Prefecture, became campaign commander of the Liangzhou Circuit — each route to resist them.',
    idiomatic:
      'Li Ji became Shuofang campaign commander, Li Daliang commander on the Lingzhou route, and Li Xiyu commander on the Liangzhou route — each to meet them on a separate front.',
  },
  s0280: {
    literal:
      'On wuzi, the first day of the twelfth month, he returned from the Luoyang Palace.',
    idiomatic:
      'On wuzi, the first day of the twelfth month, he returned from Luoyang.',
  },
  s0281: {
    literal:
      'On jiachen Li Ji fought the Xueyantuo at the Nuozhen River, routed them greatly, took more than three thousand heads, captured fifteen thousand horses, and the Xueyantuo leader fled by leaping away.',
    idiomatic:
      'On jiachen Li Ji met the Xueyantuo at the Nuozhen River, crushed them, took more than three thousand heads and fifteen thousand horses, and their leader bolted away.',
  },
  s0282: {
    literal:
      'Ji then smashed the Turkic Sigu clan at Wutai County, captured more than a thousand men and women, and seized sheep and horses in corresponding numbers.',
    idiomatic:
      'Ji then defeated the Turkic Sigu at Wutai, took more than a thousand captives, and seized flocks and herds in proportion.',
  },
  s0283: {
    literal:
      'In the sixteenth year of Zhenguan, on xinwei of the first spring month, an edict ordered convicts sentenced to death in the capital and prefectures to be registered as households in Western Prefecture;',
    idiomatic:
      'In the sixteenth year of Zhenguan, on xinwei of the first spring month, an edict sent capital and provincial death-row convicts to Western Prefecture as colonists;',
  },
  s0284: {
    literal:
      'those in exile who had not yet reached their assigned place were transferred to garrison Western Prefecture.',
    idiomatic:
      'exiles who had not yet reached their destination were reassigned to guard Western Prefecture.',
  },
  s0285: {
    literal:
      'Cen Wenben, Concurrent Vice Director of the Secretariat and Viscount of Jiangling, became Vice Director of the Secretariat with exclusive charge of confidential matters.',
    idiomatic:
      'Cen Wenben, Viscount of Jiangling, became Secretariat vice director with sole charge of confidential affairs.',
  },
  s0286: {
    literal:
      'In the sixth summer month, on xinmao, an edict restored Prince Jian the Hidden to posthumous title Hidden Crown Prince and changed Prince of Hailing, the Assassin Prince Yuanji, to Assassin Prince of Chao.',
    idiomatic:
      'In the sixth month, on xinmao, an edict restored Li Jiancheng as Hidden Crown Prince and retitled the assassin Li Yuanji as Prince of Chao.',
  },
  s0287: {
    literal:
      'In the seventh autumn month, on wuwu, Zhangsun Wuji, Duke of Zhao and Minister of Works, became Minister of Education; Fang Xuanling, Duke of Liang and Left Vice Director of the Masters of Writing, became Minister of Works.',
    idiomatic:
      'In the seventh month, on wuwu, Zhangsun Wuji, Duke of Zhao, became Minister of Education, and Fang Xuanling, Duke of Liang, became Minister of Works.',
  },
  s0288: {
    literal:
      'In the ninth month, on dingsi, Wei Zheng, Special Grand Master and Duke of Zheng, became Grand Tutor to the crown prince while retaining charge of Palace Secretariat affairs.',
    idiomatic:
      'In the ninth month, on dingsi, Wei Zheng, Duke of Zheng, became grand tutor to the heir while continuing to oversee Palace Secretariat affairs.',
  },
  s0289: {
    literal:
      'In the eleventh winter month, on bingchen, he hunted at Mount Qi.',
    idiomatic:
      'In the eleventh month, on bingchen, he hunted on Mount Qi.',
  },
  s0290: {
    literal: 'On xinyou he sent envoys to sacrifice at Sui Wendi\'s tomb.',
    idiomatic: 'On xinyou he sent envoys to offer sacrifice at Sui Wendi\'s tomb.',
  },
  s0291: {
    literal:
      'On dingmao he feasted the men and women of Wugong at the south gate of the Qingshan Palace.',
    idiomatic:
      'On dingmao he feasted the elders and townsfolk of Wugong at the south gate of Qingshan Palace.',
  },
  s0292: {
    literal:
      'When the wine was deep, the Emperor and the elders wept as they spoke of old affairs; the elders rose in turn to dance, vied to offer long life, and the Emperor drained a cup with each.',
    idiomatic:
      'As the wine warmed, he and the elders wept over old times; they rose in turn to dance, shouted long life, and he drained a cup with each.',
  },
  s0293: {
    literal: 'On gengwu he returned from Qi Prefecture.',
    idiomatic: 'On gengwu he returned from Qizhou.',
  },
  s0294: {
    literal:
      'In the twelfth month, on guimao, he traveled to the hot springs.',
    idiomatic:
      'In the twelfth month, on guimao, he went to the hot springs.',
  },
  s0295: {
    literal:
      'On jiachen he hunted at Mount Li; the weather was cold, dark, and murky, and the encircling troops lost contact.',
    idiomatic:
      'On jiachen he hunted on Mount Li in cold, murky weather, and the beaters lost contact.',
  },
  s0296: {
    literal:
      'Riding high he saw them; he wished to waive their punishment but feared compromising military law, so he turned his bridle into a valley to avoid them.',
    idiomatic:
      'From a height he saw them stranded; he wanted to pardon them yet feared breaking discipline, so he turned into a ravine to spare them sight of him.',
  },
  s0297: {
    literal:
      'That year the Goguryeo minister Yeon Gaesomun murdered his lord King Gao Wu and installed Wu\'s elder brother\'s son Jang as king.',
    idiomatic:
      'That year the Goguryeo minister Yeon Gaesomun killed King Yeongnyu and enthroned his nephew Jang.',
  },
  s0298: {
    literal:
      'In the seventeenth year of Zhenguan, on wuchen of the first spring month, Liu Lan, Right Guard General and military commissioner of Dai Prefecture, plotted rebellion and was executed by waist bisection.',
    idiomatic:
      'In the seventeenth year of Zhenguan, on wuchen of the first spring month, Liu Lan, general of the Right Guards and commissioner of Daizhou, rebelled and was cut in two at the waist.',
  },
  s0299: {
    literal:
      'Wei Zheng, Grand Tutor to the crown prince and Duke of Zheng, died.',
    idiomatic:
      'Wei Zheng, Duke of Zheng and grand tutor to the heir, died.',
  },
  s0300: {
    literal:
      'On wushen an edict ordered portraits painted of Zhangsun Wuji, Minister of Education and Duke of Zhao, and twenty-three other meritorious officials in the Lingyan Pavilion.',
    idiomatic:
      'On wushen an edict commissioned portraits of Zhangsun Wuji and twenty-three other meritorious ministers for the Lingyan Pavilion.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/003.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '003') {
  throw new Error(`Expected chapter 003, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length === END - START + 1 &&
  trans.sentences.every((s) => expectedIds.has(s.originalId || s.id));

if (!hasAll) {
  trans = {
    metadata: {
      book: 'jiutangshu',
      chapter: '003',
      file: chapterPath,
    },
    sentences: extractRange(chapterPath, START, END),
  };
}

let applied = 0;
for (const s of trans.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !trans.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log('Applied', applied, 'translations (s0201–s0300)');
