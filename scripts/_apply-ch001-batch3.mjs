#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'On gengzi he traveled to Huayin.',
    idiomatic: 'On gengzi the Emperor went to Huayin.',
  },
  s0202: {
    literal:
      'Works Minister Dugu Huai\'en plotted rebellion and was executed.',
    idiomatic:
      'Dugu Huai\'en, Minister of Works, plotted rebellion and was put to death.',
  },
  s0203: {
    literal:
      'In the third month, on guiyou, Western Turk Qaghan Yabghu and King of Gaochang Qu Boya sent envoys to present tribute at court.',
    idiomatic:
      'In the third month, on guiyou, the Western Turk qaghan Yabghu and Qu Boya, king of Gaochang, sent tribute missions to court.',
  },
  s0204: {
    literal: 'The Turks presented tribute of a great bird from Tiaozhi.',
    idiomatic:
      'The Turks presented a great bird from the western land of Tiaozhi.',
  },
  s0205: {
    literal:
      'On jimao, Nayan was changed to Palace Attendant, Inner Scribe Director to Director of the Palace Secretariat, and Gentlemen of the Secretariat to Masters of Writing Attendants.',
    idiomatic:
      'On jimao the titles Nayan, Inner Scribe Director, and Gentlemen of the Secretariat were renamed Palace Attendant, Director of the Palace Secretariat, and Attendants of the Masters of Writing.',
  },
  s0206: {
    literal:
      'On jiaxu, Inner Scribe Vice Director Feng Deyi was made concurrent Director of the Palace Secretariat.',
    idiomatic:
      'On jiaxu Feng Deyi, Vice Director of the Inner Scribe, was also appointed Director of the Palace Secretariat.',
  },
  s0207: {
    literal:
      'The bandit chief Liu Xiaozhen was enfeoffed as Prince of Pengcheng and granted the surname Li.',
    idiomatic:
      'Liu Xiaozhen, a rebel leader, was created Prince of Pengcheng and given the imperial surname Li.',
  },
  s0208: {
    literal: 'In the fourth month of summer, on renyin, he returned from Huayin.',
    idiomatic: 'In the fourth month, on renyin, he returned from Huayin.',
  },
  s0209: {
    literal:
      'A mobile branch of the Department of State Affairs was established at Yi Province.',
    idiomatic:
      'A regional headquarters of the Department of State Affairs was established in Yi Province.',
  },
  s0210: {
    literal:
      'On jiayin, the Prince of Qin was additionally made Director of the Yi Province Circuit Mobile Secretariat.',
    idiomatic:
      'On jiayin the Prince of Qin was also appointed head of the Yi Province circuit headquarters.',
  },
  s0211: {
    literal:
      'The Prince of Qin won a great victory over Song Jingang at Jie Prefecture; Jingang and Liu Wuzhou both fled to the Turks, and Bingzhou was pacified.',
    idiomatic:
      'The Prince of Qin routed Song Jingang at Jiezhou; Jingang and Liu Wuzhou fled to the Turks, and Bingzhou was recovered.',
  },
  s0212: {
    literal:
      'The false military commissioners Yuchi Jingde and Xun Xiang surrendered Jie Prefecture.',
    idiomatic:
      'The rebel commissioners Yuchi Jingde and Xun Xiang surrendered Jiezhou.',
  },
  s0213: {
    literal:
      'In the sixth month, on renchen, Prince of Chu Du Fuwei was moved to Prince of Wu, granted the surname Li, and additionally appointed Director of the Southeast Circuit Mobile Secretariat.',
    idiomatic:
      'In the sixth month, on renchen, Du Fuwei was retitled Prince of Wu, given the surname Li, and made head of the southeast circuit headquarters.',
  },
  s0214: {
    literal: 'On bingwu he personally reviewed prisoners.',
    idiomatic: 'On bingwu he reviewed prisoners in person.',
  },
  s0215: {
    literal:
      'Prince Yuanjing was enfeoffed as Prince of Zhao, Yuanchang as Prince of Lu, Yuanheng as Prince of Feng;',
    idiomatic:
      'Yuanjing was created Prince of Zhao, Yuanchang Prince of Lu, and Yuanheng Prince of Feng;',
  },
  s0216: {
    literal:
      'Imperial grandsons Chengzong as Prince of Taiyuan, Chengdao as Prince of Anlu, Chengqian as Prince of Hengshan, Ke as Prince of Changsha, Tai as Prince of Yidu.',
    idiomatic:
      'and the Emperor\'s grandsons Chengzong, Chengdao, Chengqian, Ke, and Tai were created princes of Taiyuan, Anlu, Hengshan, Changsha, and Yidu.',
  },
  s0217: {
    literal:
      'In the seventh month of autumn, on renxu, he ordered the Prince of Qin to lead the armies to attack Wang Shichong.',
    idiomatic:
      'In the seventh month, on renxu, he ordered the Prince of Qin to lead the armies against Wang Shichong.',
  },
  s0218: {
    literal:
      'The crown prince was sent to garrison Pu Prefecture to guard against the Turks.',
    idiomatic:
      'The crown prince was posted at Puzhou to guard against the Turks.',
  },
  s0219: {
    literal: 'On bingshen the Turks killed Liu Wuzhou at Baidao.',
    idiomatic: 'On bingshen the Turks killed Liu Wuzhou on the Baidao road.',
  },
  s0220: {
    literal:
      'In the tenth month of winter, on gengzi, Huairou bandit chief Gao Kaidao sent envoys to surrender; he was appointed Military Commissioner of Yu Prefecture, enfeoffed Prince of Yanping Commandery, and granted the surname Li.',
    idiomatic:
      'In the tenth winter month, on gengzi, Gao Kaidao of Huairou submitted; he was made military commissioner of Youzhou, created Prince of Yanping, and given the surname Li.',
  },
  s0221: {
    literal:
      'In the fourth year of Wude, in the spring of the first month, on dingmao, Dou Jiande\'s mobile director Hu Da\'en surrendered Da\'an post, was enfeoffed Prince of Dingxiang Commandery, and granted the surname Li.',
    idiomatic:
      'In the fourth year of Wude, on dingmao of the first spring month, Hu Da\'en, director of Dou Jiande\'s field secretariat, surrendered Da\'an garrison, was created Prince of Dingxiang, and given the surname Li.',
  },
  s0222: {
    literal:
      'On xinsi the crown prince was ordered to command all armies to attack the Ji Hu.',
    idiomatic:
      'On xinsi the crown prince was appointed supreme commander against the Ji Hu.',
  },
  s0223: {
    literal: 'In the third month, Prince of Yidu Tai was moved to Prince of Wei.',
    idiomatic: 'In the third month Prince Tai of Yidu was retitled Prince of Wei.',
  },
  s0224: {
    literal:
      'Dou Jiande came to relieve Wang Shichong and captured our Guan Prefecture.',
    idiomatic:
      'Dou Jiande marched to relieve Wang Shichong and seized Guanzhou.',
  },
  s0225: {
    literal:
      'In the fourth month of summer, on jiayin, Prince Yuanfang was enfeoffed as Prince of Zhou, Yuanli as Prince of Zheng, Yuanjia as Prince of Song, Yuanze as Prince of Jing, Yuanmao as Prince of Yue.',
    idiomatic:
      'In the fourth month, on jiayin, Yuanfang was created Prince of Zhou, Yuanli of Zheng, Yuanjia of Song, Yuanze of Jing, and Yuanmao of Yue.',
  },
  s0226: {
    literal: 'For the first time officials of the Protectorate were established.',
    idiomatic: 'The Protectorate office was staffed for the first time.',
  },
  s0227: {
    literal:
      'In the fifth month, on jiwei, the Prince of Qin won a great victory over Dou Jiande\'s forces at Hulao, captured Jiande, and the Hebei region was entirely pacified.',
    idiomatic:
      'In the fifth month, on jiwei, the Prince of Qin shattered Dou Jiande at Hulao, took him prisoner, and pacified Hebei.',
  },
  s0228: {
    literal:
      'On bingyin, Wang Shichong surrendered the eastern capital, and Henan was pacified.',
    idiomatic:
      'On bingyin Wang Shichong surrendered Luoyang, and the Henan region submitted.',
  },
  s0229: {
    literal:
      'In the seventh month of autumn, on jiazi, the Prince of Qin returned in triumph and presented captives at the Imperial Ancestral Temple.',
    idiomatic:
      'In the seventh month, on jiazi, the Prince of Qin returned in triumph and offered prisoners at the ancestral temple.',
  },
  s0230: {
    literal: 'On dingmao a general amnesty was proclaimed throughout the realm.',
    idiomatic: 'On dingmao the court proclaimed a general amnesty.',
  },
  s0231: {
    literal:
      'The five-zhu coin was abolished and the Kaiyuan tongbao coin was put into circulation.',
    idiomatic:
      'The old five-zhu coinage was abolished and the Kaiyuan tongbao coin introduced.',
  },
  s0232: {
    literal: 'Dou Jiande was beheaded in the market;',
    idiomatic: 'Dou Jiande was beheaded in public;',
  },
  s0233: {
    literal:
      'Wang Shichong was banished to Shu; before he set out he was killed by an enemy.',
    idiomatic:
      'Wang Shichong was exiled to Shu but was killed by a foe before he could depart.',
  },
  s0234: {
    literal:
      'On jiaxu, Jiande\'s remnant partisan Liu Heida seized the south of Zhang and rebelled.',
    idiomatic:
      'On jiaxu Liu Heida, a survivor of Jiande\'s cause, rose in the Zhangnan region.',
  },
  s0235: {
    literal:
      'A Shandong Circuit mobile branch of the Department of State Affairs was established at Ming Prefecture.',
    idiomatic:
      'A Shandong circuit headquarters was established at Mingzhou.',
  },
  s0236: {
    literal:
      'In the eighth month, Yan Prefecture Military Commissioner Xu Yuanlang raised troops in rebellion to join Liu Heida and presumptuously styled himself Prince of Lu.',
    idiomatic:
      'In the eighth month Xu Yuanlang, military commissioner of Yanzhou, rebelled in support of Liu Heida and proclaimed himself Prince of Lu.',
  },
  s0237: {
    literal:
      'On jichou the Prince of Qin was additionally made Celestial-Strategy Supreme General, ranking above princes and dukes, holding the posts of Minister of Education and Director of the Shaanxi East Circuit Mobile Secretariat;',
    idiomatic:
      'On jichou the Prince of Qin was made Celestial-Strategy Supreme General, senior to all princes and dukes, and retained the posts of Minister of Education and head of the Shaanxi east circuit;',
  },
  s0238: {
    literal: 'Prince of Qi Yuanji was made Minister of Works.',
    idiomatic: 'Prince of Qi Yuanji was appointed Minister of Works.',
  },
  s0239: {
    literal:
      'On yisi, Prince of Zhao Commandery Xiaogong pacified Jing Prefecture and captured Xiao Xian.',
    idiomatic:
      'On yisi Prince of Zhao Commandery Xiaogong pacified Jingzhou and captured Xiao Xian.',
  },
  s0240: {
    literal:
      'On jiashen a great mobile office was established at Ming Prefecture and the Ming Prefecture military commissionerate was abolished.',
    idiomatic:
      'On jiashen a grand field headquarters was set up at Mingzhou and the local military commissionerate was abolished.',
  },
  s0241: {
    literal:
      'On gengyin the Qianyang Hall of the Ziwei Palace in the eastern capital was burned.',
    idiomatic:
      'On gengyin the Qianyang Hall of Luoyang\'s Ziwei Palace was burned down.',
  },
  s0242: {
    literal:
      'Kuaiji bandit chief Li Zitong surrendered his territory.',
    idiomatic:
      'Li Zitong of Kuaiji submitted his territory.',
  },
  s0243: {
    literal:
      'On dingmao he ordered the Prince of Qin and Prince of Qi Yuanji to attack Liu Heida.',
    idiomatic:
      'On dingmao he ordered the Prince of Qin and Prince of Qi Yuanji to campaign against Liu Heida.',
  },
  s0244: {
    literal: 'On renshen Prince of Song Yuanjia was moved to Prince of Xu.',
    idiomatic: 'On renshen Prince Yuanjia of Song was retitled Prince of Xu.',
  },
  s0245: {
    literal:
      'In the fifth year of Wude, in the spring of the first month, on bingshen, Liu Heida seized Ming Prefecture and presumptuously styled himself Prince of Handong.',
    idiomatic:
      'In the fifth year of Wude, on bingshen of the first spring month, Liu Heida seized Mingzhou and proclaimed himself Prince of Handong.',
  },
  s0246: {
    literal:
      'In the third month, on dingwei, the Prince of Qin defeated Liu Heida on the Ming River, recovered all lost prefectures and counties, and Heida fled to the Turks.',
    idiomatic:
      'In the third month, on dingwei, the Prince of Qin routed Liu Heida on the Ming River, recovered the lost districts, and Heida fled to the Turks.',
  },
  s0247: {
    literal:
      'Yu Prefecture Military Commissioner, Prince of Northern Peace Gao Kaidao rebelled and raided Yi Prefecture.',
    idiomatic:
      'Gao Kaidao, military commissioner of Youzhou and Prince of Northern Peace, rebelled and raided Yizhou.',
  },
  s0248: {
    literal:
      'In the fourth month of summer, on gengxu, the Prince of Qin returned to the capital; Gaozu went out to welcome and comfort him at Changle Palace.',
    idiomatic:
      'In the fourth month, on gengxu, the Prince of Qin returned to Chang\'an; Gaozu met him at Changle Palace with honors.',
  },
  s0249: {
    literal:
      'On renshen, Dai Prefecture Military Commissioner, Prince of Dingxiang Commandery Da\'en was defeated by the barbarians and died in battle.',
    idiomatic:
      'On renshen Hu Da\'en, military commissioner of Daizhou and Prince of Dingxiang, was defeated by the Turks and killed.',
  },
  s0250: {
    literal:
      'In the sixth month, Liu Heida led the Turks to raid Shandong.',
    idiomatic:
      'In the sixth month Liu Heida brought Turk raiders into Shandong.',
  },
  s0251: {
    literal: 'Remonstrating and Consulting Grand Masters were established.',
    idiomatic: 'The office of remonstrating and consulting grand master was created.',
  },
  s0252: {
    literal: 'In the seventh month, on dinghai, Prince of Wu Fuwei came to court.',
    idiomatic: 'In the seventh month, on dinghai, Prince of Wu Fuwei presented himself at court.',
  },
  s0253: {
    literal:
      'Sui Administrator of Hanyang Feng Ang surrendered the lands of southern Yue, and the Lingnan region was entirely pacified.',
    idiomatic:
      'Feng Ang, former Sui administrator of Hanyang, surrendered the far south, and Lingnan was pacified.',
  },
  s0254: {
    literal:
      'On xinhai Ming, Jing, Bing, You, and Jiao Prefectures were made great military commissionerates.',
    idiomatic:
      'On xinhai Ming, Jing, Bing, You, and Jiao were made grand military commissionerates.',
  },
  s0255: {
    literal: 'Prince of Hengshan Chengqian was moved to Prince of Zhongshan.',
    idiomatic: 'Prince Chengqian of Hengshan was retitled Prince of Zhongshan.',
  },
  s0256: {
    literal: 'Emperor Yang of Sui was buried at Yangzhou.',
    idiomatic: 'The Sui Emperor Yang was buried at Yangzhou.',
  },
  s0257: {
    literal: 'On bingchen the Turk Qaghan Jieli raided Yanmen.',
    idiomatic: 'On bingchen the Turk qaghan Jieli raided Yanmen.',
  },
  s0258: {
    literal: 'On jiwei he advanced further and raided Shuo Prefecture.',
    idiomatic: 'On jiwei he pressed on and raided Shuozhou.',
  },
  s0259: {
    literal:
      'The crown prince and the Prince of Qin were sent to attack and inflicted a great defeat.',
    idiomatic:
      'The crown prince and the Prince of Qin were dispatched against him and won a great victory.',
  },
  s0260: {
    literal:
      'In the tenth month of winter, on guiyou, Prince of Qi Yuanji was sent to attack Liu Heida at Ming Prefecture.',
    idiomatic:
      'In the tenth winter month, on guiyou, Prince of Qi Yuanji was sent against Liu Heida at Mingzhou.',
  },
  s0261: {
    literal:
      'At that time many Shandong prefectures and counties were still held by Heida; everywhere the chief officials were killed to join him.',
    idiomatic:
      'Many Shandong districts still answered to Heida, and local magistrates were murdered wherever men rose for him.',
  },
  s0262: {
    literal:
      'Campaign commander, Prince of Huaiyang Daoxuan fought Liu Heida at Xiabo; Daoxuan was defeated and lost.',
    idiomatic:
      'Li Daoxuan, Prince of Huaiyang and campaign commander, met Liu Heida at Xiabo and was defeated and killed.',
  },
  s0263: {
    literal:
      'On jiashen the crown prince was ordered to lead troops against Liu Heida.',
    idiomatic:
      'On jiashen the crown prince was appointed to command the campaign against Liu Heida.',
  },
  s0264: {
    literal: 'On bingshen he traveled to Yi Prefecture to review troops.',
    idiomatic: 'On bingshen he went to Yizhou to review the army.',
  },
  s0265: {
    literal: 'On bingchen he held a hunt at Huachi.',
    idiomatic: 'On bingchen he hunted at Huachi.',
  },
  s0266: {
    literal: 'On gengshen he returned from Yi Prefecture.',
    idiomatic: 'On gengshen he returned from Yizhou.',
  },
  s0267: {
    literal:
      'The crown prince defeated Liu Heida at Wei Prefecture, beheaded him, and Shandong was pacified.',
    idiomatic:
      'The crown prince defeated Liu Heida at Weizhou, executed him, and pacified Shandong.',
  },
  s0268: {
    literal:
      'In the sixth year of Wude, in the spring of the first month, Prince of Wu Du Fuwei became Grand Preceptor to the crown prince.',
    idiomatic:
      'In the sixth year of Wude, in the first spring month, Prince of Wu Du Fuwei was made Grand Preceptor to the crown prince.',
  },
  s0269: {
    literal: 'In the second month, on xinhai, he held a hunt on Mount Li.',
    idiomatic: 'In the second month, on xinhai, he hunted on Mount Li.',
  },
  s0270: {
    literal:
      'In the third month, on yiwei, he visited Kunming Pool and feasted the hundred officials.',
    idiomatic:
      'In the third month, on yiwei, he visited Kunming Pool and gave a feast for the court.',
  },
  s0271: {
    literal:
      'In the fourth month of summer, on jiwei, the old residence was made Tongyi Palace; a partial amnesty was granted to prisoners in the capital; thereupon wine was set out in a great gathering and silk was bestowed on attending officials in graded amounts.',
    idiomatic:
      'In the fourth month, on jiwei, the family estate became Tongyi Palace; capital prisoners received a partial pardon; the court then held a great banquet and distributed silk by rank.',
  },
  s0272: {
    literal:
      'On guiyou, Right Vice Director of the Masters of Writing, Duke of Wei Pei Ji was made Left Vice Director; Director of the Palace Secretariat, Duke of Song Xiao Yu was made Right Vice Director; and Palace Attendant, Duke of Guan Yang Gongren was made Minister of Personnel.',
    idiomatic:
      'On guiyou Pei Ji, Duke of Wei and Right Vice Director of the Masters of Writing, became Left Vice Director; Xiao Yu, Duke of Song and Director of the Palace Secretariat, became Right Vice Director; and Yang Gongren, Duke of Guan and Palace Attendant, became Minister of Personnel.',
  },
  s0273: {
    literal:
      'In the seventh month of autumn, the Turk Qaghan Jieli raided Shuo Prefecture; the crown prince and the Prince of Qin were sent to garrison Bing Prefecture to guard against him.',
    idiomatic:
      'In the seventh month the Turk qaghan Jieli raided Shuozhou; the crown prince and the Prince of Qin were posted at Bingzhou on guard.',
  },
  s0274: {
    literal:
      'On renzi, Southeast Circuit Vice Director Fu Gongshi seized Danyang and rebelled, presumptuously styling himself Prince of Song; Prince of Zhao Commandery Xiaogong and Grand Ambassador of the Lingnan Circuit, Duke of Yongkang county Li Jing were sent to attack him.',
    idiomatic:
      'On renzi Fu Gongshi, vice director of the southeast circuit, seized Danyang and proclaimed himself Prince of Song; Prince of Zhao Commandery Xiaogong and Li Jing, Duke of Yongkang and ambassador of the Lingnan circuit, were sent to crush him.',
  },
  s0275: {
    literal: 'On bingyin the Tuyuhun submitted and came within the realm.',
    idiomatic: 'On bingyin the Tuyuhun submitted to Tang rule.',
  },
  s0276: {
    literal:
      'On bingzi the Turks withdrew and the crown prince led the army back.',
    idiomatic:
      'On bingzi the Turks withdrew and the crown prince returned with the army.',
  },
  s0277: {
    literal: 'The eastern capital was changed to Luo Prefecture.',
    idiomatic: 'Luoyang was redesignated Luo Prefecture.',
  },
  s0278: {
    literal: 'Gao Kaidao led the Turks to raid You Prefecture.',
    idiomatic: 'Gao Kaidao brought Turk raiders against Youzhou.',
  },
  s0279: {
    literal: 'In the tenth month of winter he traveled to Huayin.',
    idiomatic: 'In the tenth winter month he went to Huayin.',
  },
  s0280: {
    literal: 'In the eleventh month he held a hunt in Shayuan.',
    idiomatic: 'In the eleventh month he hunted in Shayuan.',
  },
  s0281: {
    literal:
      'On yisi the Fengyi Palace was made Longyue Palace and the Wugong residence was made Qingshan Palace.',
    idiomatic:
      'On yisi the Fengyi Palace became Longyue Palace and the Wugong estate became Qingshan Palace.',
  },
  s0282: {
    literal: 'On jiayin he came back from Huayin.',
    idiomatic: 'On jiayin he returned to the capital from Huayin.',
  },
  s0283: {
    literal:
      'In the seventh year of Wude, in the spring of the first month, on jiyou, King Gao Wu of Goguryeo was enfeoffed Prince of Liaodong Commandery, King Buyeo Zhang of Baekje as Prince of Daifang Commandery, and King Kim Jeong-pyeong of Silla as Prince of Lelang Commandery.',
    idiomatic:
      'In the seventh year of Wude, on jiyou of the first spring month, Gao Wu of Goguryeo was created Prince of Liaodong, Buyeo Zhang of Baekje Prince of Daifang, and Kim Jeong-pyeong of Silla Prince of Lelang.',
  },
  s0284: {
    literal:
      'In the second month, Gao Kaidao was killed by his officer Zhang Jinshu, and his territory surrendered.',
    idiomatic:
      'In the second month Gao Kaidao was killed by his officer Zhang Jinshu, who then submitted the territory.',
  },
  s0285: {
    literal:
      'On dingsi he visited the Directorate of Education and personally performed the libation sacrifice.',
    idiomatic:
      'On dingsi he visited the imperial academy and performed the libation rite in person.',
  },
  s0286: {
    literal: 'Great military commissionerates were changed to great protectorates.',
    idiomatic: 'Grand military commissionerates were renamed grand protectorates.',
  },
  s0287: {
    literal: 'Prince of Wu Fuwei passed away.',
    idiomatic: 'Du Fuwei, Prince of Wu, died.',
  },
  s0288: {
    literal:
      'On wuyin the six vice directors of the Masters of Writing were abolished; the rank of Director in the Ministry of Personnel was raised to the full fourth grade and charged with selection affairs.',
    idiomatic:
      'On wuyin the six vice-directorships of the Masters of Writing were abolished; directors in the Ministry of Personnel were raised to the fourth rank and put in charge of appointments.',
  },
  s0289: {
    literal:
      'On wuxu, Prince of Zhao Commandery Xiaogong won a great victory over Fu Gongshi, captured him, and Danyang was pacified.',
    idiomatic:
      'On wuxu Prince of Zhao Commandery Xiaogong shattered Fu Gongshi, took him alive, and pacified Danyang.',
  },
  s0290: {
    literal:
      'In the fourth month of summer, on gengzi, a general amnesty was proclaimed throughout the realm and the new statutes and ordinances were promulgated.',
    idiomatic:
      'In the fourth month, on gengzi, the court proclaimed a general amnesty and issued the new law code.',
  },
  s0291: {
    literal:
      'Because the realm was fully settled, an edict allowed those mourning parents to observe the full mourning period.',
    idiomatic:
      'With the empire at peace, an edict permitted officials in mourning for parents to serve out the full term.',
  },
  s0292: {
    literal:
      'In the fifth month, Renzhi Palace was built at Yijun county in Yi Prefecture.',
    idiomatic:
      'In the fifth month Renzhi Palace was built at Yijun in Yizhou.',
  },
  s0293: {
    literal: 'Li Shiji attacked Xu Yuanlang and pacified him.',
    idiomatic: 'Li Shiji campaigned against Xu Yuanlang and subdued him.',
  },
  s0294: {
    literal: 'In the sixth month, on xinchou, he traveled to Renzhi Palace.',
    idiomatic: 'In the sixth month, on xinchou, he went to Renzhi Palace.',
  },
  s0295: {
    literal:
      'In the seventh month of autumn, on jiawu, he returned from Renzhi Palace.',
    idiomatic:
      'In the seventh month, on jiawu, he returned from Renzhi Palace.',
  },
  s0296: {
    literal:
      'Xi Prefecture suffered an earthquake; mountains collapsed and the river waters were choked.',
    idiomatic:
      'An earthquake struck Xizhou; mountains collapsed and the river was blocked.',
  },
  s0297: {
    literal:
      'On wuchen the Turks raided Bing Prefecture and the capital went on alert.',
    idiomatic:
      'On wuchen the Turks raided Bingzhou and Chang\'an was placed under guard.',
  },
  s0298: {
    literal: 'On rengwu the Turks withdrew.',
    idiomatic: 'On rengwu the Turk raiders retreated.',
  },
  s0299: {
    literal: 'On yiwei the capital alert was lifted.',
    idiomatic: 'On yiwei the capital stood down from alert.',
  },
  s0300: {
    literal: 'In the tenth month of winter, on dingmao, he traveled to Qingshan Palace.',
    idiomatic: 'In the tenth winter month, on dingmao, he went to Qingshan Palace.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/001.json';
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
if (trans.metadata.chapter !== '001') {
  throw new Error(`Expected chapter 001, got ${trans.metadata.chapter}`);
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
      chapter: '001',
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
