#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    "Second month, day dingyou: Korea and Ryukyu presented tribute.",
    "In the second month, Korea and Ryukyu paid tribute.",
  ],
  s0202: [
    "On day jiyou, Tekencheng'e was made Minister of Rites.",
    "On jiyou day, Tekencheng'e became Minister of Rites.",
  ],
  s0203: [
    "Zhuoketuo was transferred to Minister of Personnel; Fulehun to Minister of Works.",
    "Zhuoketuo took Personnel and Fulehun took Works.",
  ],
  s0204: [
    "Tekencheng'e was transferred to Chengdu General; Zhong Yin was made Minister of Rites.",
    "Tekencheng'e went to Chengdu and Zhong Yin took Rites.",
  ],
  s0205: [
    "Yang Jingsu was transferred to Fujian-Zhejiang governor-general; Gui Lin to Guangdong-Guangxi governor-general, with Li Zhiying as protector.",
    "Yang Jingsu took Fujian-Zhejiang; Gui Lin took Guangdong-Guangxi; Li Zhiying was protector.",
  ],
  s0206: [
    "On day wuwu, Prince Xian of the First Rank Hong Shenyi was made chief grand secretary of the Plain White Banner guard.",
    "On wuwu day, Prince Xian Hong Shenyi headed the Plain White Banner guard.",
  ],
  s0207: [
    "Third month, day jiazi: the Emperor went to the Western Tombs.",
    "In the third month, the Emperor went to the Western Tombs.",
  ],
  s0208: [
    "On day wuchen, the Emperor visited the Tai Tomb and Tai East Tomb.",
    "On wuchen day, the Emperor visited the Tai and Tai East Tombs.",
  ],
  s0209: [
    "On day jisi, the Emperor personally sacrificed at the Tai East Tomb.",
    "On jisi day, the Emperor sacrificed at the Tai East Tomb.",
  ],
  s0210: [
    "On day yihai, the Emperor reviewed troops of the Vanguard Camp.",
    "On yihai day, the Emperor reviewed Vanguard Camp troops.",
  ],
  s0211: [
    "On day jichou, Li Hu was made Hunan governor.",
    "On jichou day, Li Hu became Hunan governor.",
  ],
  s0212: [
    "Summer, fourth month, day xinmao: because of drought in Henan, military-exile and lesser crimes in five prefectures including Kaifeng were ordered reduced.",
    "In the fourth month, Henan drought led to reduced sentences in five prefectures.",
  ],
  s0213: [
    "On day renyin, Henan's land-tax of the forty-fifth year was ordered remitted in advance.",
    "On renyin day, Henan's forty-fifth-year land-tax was remitted early.",
  ],
  s0214: [
    "On day guimao, Prince Su Yunzhuo died.",
    "On guimao day, Prince Su Yunzhuo died.",
  ],
  s0215: [
    "On day yisi, the Emperor went to Black Dragon Pool to pray for rain.",
    "On yisi day, the Emperor prayed for rain at Black Dragon Pool.",
  ],
  s0216: [
    "On day xinhai, Henan's military-exile and lesser crimes were ordered reduced.",
    "On xinhai day, Henan sentences were again reduced.",
  ],
  s0217: [
    "On day yimao, Dai Qiuheng and one hundred fifty-seven others were granted jinshi with rank and origin in varying grades.",
    "On yimao day, one hundred fifty-seven new jinshi including Dai Qiuheng received graded ranks.",
  ],
  s0218: [
    "Fifth month, new moon on day gengshen: because of famine in Shandong, the forty-fifth year's taxes and grain were ordered remitted in advance.",
    "On the fifth-month new moon, Shandong's forty-fifth-year taxes were remitted early for famine.",
  ],
  s0219: [
    "On day dingmao, the Shanxi governor was ordered also to administer Hedong salt affairs.",
    "On dingmao day, the Shanxi governor also took Hedong salt duties.",
  ],
  s0220: [
    "On day wuchen, Prince Yi Hongxiao died.",
    "On wuchen day, Prince Yi Hongxiao died.",
  ],
  s0221: [
    "Sixth month, day yiwei: Quan De, supervisor of Jiujiang customs, was arrested and punished for excessive collection.",
    "In the sixth month, Jiujiang customs supervisor Quan De was arrested for over-collection.",
  ],
  s0222: [
    "Intercalary sixth month, day guihai: the Xiangfu River in Henan breached.",
    "On guihai in the intercalary sixth month, the Xiangfu River broke.",
  ],
  s0223: [
    "Autumn, seventh month, day guisi: the Yifeng and Kaocheng rivers in Henan breached.",
    "In the seventh month, the Yifeng and Kaocheng rivers broke.",
  ],
  s0224: [
    "On day yiwei, Yuan Shoutong was sent to Henan to join River Director Yao Lide and Governor Zheng Dajin in inspecting river works.",
    "On yiwei day, Yuan Shoutong joined Yao Lide and Zheng Dajin to inspect Henan river works.",
  ],
  s0225: [
    "On day wuxu, Gao Jin was ordered to supervise dike works.",
    "On wuxu day, Gao Jin was ordered to supervise dikes.",
  ],
  s0226: [
    "On day dingwei, the Emperor went to pay respects at the Shengjing tombs and remitted one-third of this year's assessed taxes for districts along the route in Zhili and Fengtian.",
    "On dingwei day, the Emperor visited Shengjing tombs and remitted one-third of route taxes in Zhili and Fengtian.",
  ],
  s0227: [
    "Eighth month, day guiyou: because the Yifeng breach sent the river down into Fengyang and other districts in Anhui, Sa Zai and others were instructed to relieve disaster victims.",
    "In the eighth month, Sa Zai and others were told to relieve Anhui flood victims from the Yifeng breach.",
  ],
  s0228: [
    "On day jiaxu, the Emperor visited Yong Tomb.",
    "On jiaxu day, the Emperor visited Yong Tomb.",
  ],
  s0229: [
    "On day yihai, the grand feast rite was performed.",
    "On yihai day, the grand feast rite was performed.",
  ],
  s0230: [
    "On day jimao, the Emperor visited Fu Tomb.",
    "On jimao day, the Emperor visited Fu Tomb.",
  ],
  s0231: [
    "Next year's poll-tax and grain assessments for Fengtian prefectures and counties were remitted.",
    "Fengtian's next-year poll-tax and grain were remitted.",
  ],
  s0232: [
    "On day gengchen, the grand feast rite was performed.",
    "On gengchen day, the grand feast rite was performed.",
  ],
  s0233: [
    "The Emperor visited Zhao Tomb.",
    "The Emperor visited Zhao Tomb.",
  ],
  s0234: [
    "On day xinsi, the grand feast rite was performed.",
    "On xinsi day, the grand feast rite was performed.",
  ],
  s0235: [
    "Capital and capital crimes, settled and unsettled, in Fengtian, Jilin, and Heilongjiang were all reduced one grade; military exiles and lesser offenders were all pardoned.",
    "In the northeast, capital crimes were reduced and military exiles and lesser offenders pardoned.",
  ],
  s0236: [
    "On day guiwei, the Emperor personally mourned at the tomb of Prince Keqin Yuetuo.",
    "On guiwei day, the Emperor mourned at Prince Keqin Yuetuo's tomb.",
  ],
  s0237: [
    "On day jiashen, the Emperor personally mourned at the tombs of Prince Wuxun Yangguli, Duke Hongyi Eidu, and Duke Zhiyi Feiyingdong.",
    "On jiashen day, the Emperor mourned at the tombs of Yangguli, Eidu, and Feiyingdong.",
  ],
  s0238: [
    "On day yiyou, the Emperor performed rites at the Confucian temple.",
    "On yiyou day, the Emperor worshipped at the Confucian temple.",
  ],
  s0239: [
    "Ninth month, day jiawu: Jin Congshan, a licentiate of Jin County, memorialized on establishing an heir and receiving remonstrance and bestowing virtue; for offending the imperial will he was sentenced to decapitation.",
    "In the ninth month, Jin County licentiate Jin Congshan was sentenced to death for a memorial on the heir.",
  ],
  s0240: [
    "On day wuxu, Minister of Rites Zhong Yin died.",
    "On wuxu day, Zhong Yin, minister of rites, died.",
  ],
  s0241: [
    "Jin Congshan was executed for wanton slander and abuse.",
    "Jin Congshan was executed for wanton slander.",
  ],
  s0242: [
    "On day jihai, Debao was made Minister of Rites.",
    "On jihai day, Debao became Minister of Rites.",
  ],
  s0243: [
    "On day dingwei, an edict clarified abuses in installing an heir and announced the date for restoration of rule.",
    "On dingwei day, an edict rebuked heir-installation abuses and fixed a date to restore rule.",
  ],
  s0244: [
    "On day renzi, the Emperor returned to the capital.",
    "On renzi day, the Emperor returned to the capital.",
  ],
  s0245: [
    "On day jiayin, Gao Pu was sentenced to decapitation for extortion and bribery.",
    "On jiayin day, Gao Pu was sentenced to death for bribery.",
  ],
  s0246: [
    "Zhuoketuo was stripped of office for failure to supervise Gao Pu.",
    "Zhuoketuo lost his post for failing to supervise Gao Pu.",
  ],
  s0247: [
    "Yonggui was appointed Minister of Personnel.",
    "Yonggui became Minister of Personnel.",
  ],
  s0248: [
    "On day yimao, Mailasun was ordered to act as Minister of Personnel.",
    "On yimao day, Mailasun acted as Minister of Personnel.",
  ],
  s0249: [
    "Winter, tenth month, day jiwei: for the seventieth birthday in the gengzi year, the Emperor would tour Jiangsu and Zhejiang, holding grace civil examinations and universally remitting taxes and grain.",
    "In the tenth month, a gengzi-year seventieth-birthday tour of Jiangsu and Zhejiang was ordered with grace exams and tax remissions.",
  ],
  s0250: [
    "On day jiaxu, Jiangsu intendant Tao Yi was stripped of office and sentenced to decapitation for indulging Xu Shuyao.",
    "On jiaxu day, Tao Yi lost his post and was sentenced to death for indulging Xu Shuyao.",
  ],
  s0251: [
    "On day bingzi, registered taxes for forty-two years' drought disaster in thirty-two Gansu departments and counties including Gaolan were remitted.",
    "On bingzi day, thirty-two Gansu districts including Gaolan were forgiven drought taxes of year 42.",
  ],
  s0252: [
    "Eleventh month, day wuzi: tribute of whole jade ruyi scepters and large jade was forbidden.",
    "In the eleventh month, whole jade ruyi and large jade tribute were banned.",
  ],
  s0253: [
    "On day renchen, courier affairs were assigned to touring circuit intendants and the Gansu courier commissioner was abolished.",
    "On renchen day, couriers were put under circuit intendants and the Gansu courier post was cut.",
  ],
  s0254: [
    "Disaster relief was granted for this year's drought in nine Guangxi prefectures and counties including Xing'an.",
    "Nine Guangxi districts including Xing'an received drought relief.",
  ],
  s0255: [
    "On day gengzi, registered taxes for forty-two years' disaster in seven Gansu departments and counties including Ningxia were remitted.",
    "On gengzi day, seven Gansu districts including Ningxia were forgiven year-42 disaster taxes.",
  ],
  s0256: [
    "Twelfth month, day gengshen: the Yifeng dike in Henan collapsed; Gao Jin and others were severely censured.",
    "In the twelfth month, the Yifeng dike failed and Gao Jin and others were severely censured.",
  ],
  s0257: [
    "On day bingyin, Guotai was instructed strictly to suppress the Yihoquan sect bandits in Guan County, Shandong.",
    "On bingyin day, Guotai was told to crush Yihoquan bandits in Guan County, Shandong.",
  ],
  s0258: [
    "On day jiaxu, relief was granted for this year's flood and drought in thirty-four Anhui prefectures and counties including Dangtu and for drought in fifteen Hunan prefectures and counties including Xiangyin, with varying remissions of registered taxes.",
    "On jiaxu day, Anhui and Hunan disaster districts received relief and varying tax remissions.",
  ],
  s0259: [
    "Forty-fourth year, spring, first month, new moon on day bingxu: Chen Huizu was transferred to Henan governor and Zheng Dajin to Hubei governor.",
    "On the forty-fourth year's first-month new moon, Chen Huizu took Henan and Zheng Dajin took Hubei.",
  ],
  s0260: [
    "On day yiwei, Grand Secretary and Jiangnan governor-general Gao Jin died.",
    "On yiwei day, Grand Secretary Gao Jin died in Jiangnan.",
  ],
  s0261: [
    "Sanbao was made Associate Grand Secretary while retaining Huguang governor-general; Sa Zai became Jiangnan governor-general and Li Fenghan Huai River conservancy director.",
    "Sanbao became associate grand secretary and kept Huguang; Sa Zai took Jiangnan and Li Fenghan the Huai conservancy.",
  ],
  s0262: [
    "On day guimao, the Emperor went to the Western Tombs and remitted one-third of this year's poll-tax for districts along the route.",
    "On guimao day, the Emperor visited the Western Tombs and remitted one-third of route poll-tax.",
  ],
  s0263: [
    "The Fuzhou deputy lieutenant-general was abolished.",
    "The Fuzhou deputy lieutenant-general post was cut.",
  ],
  s0264: [
    "On day yisi, A Gui was ordered to Henan to survey river works.",
    "On yisi day, A Gui was sent to survey Henan river works.",
  ],
  s0265: [
    "On day dingwei, the Emperor visited the Tai Tomb and Tai East Tomb.",
    "On dingwei day, the Emperor visited the Tai and Tai East Tombs.",
  ],
  s0266: [
    "On day xinhai, the Emperor returned to the capital.",
    "On xinhai day, the Emperor returned to the capital.",
  ],
  s0267: [
    "Second month, day guihai: Left Censor-in-Chief Mailasun was dismissed on account of illness.",
    "In the second month, Mailasun left the left censorate for illness.",
  ],
  s0268: [
    "On day bingzi, Zeng Fu was made Fujian governor and Shen Bao left censor-in-chief.",
    "On bingzi day, Zeng Fu took Fujian and Shen Bao became left censor-in-chief.",
  ],
  s0269: [
    "On day gengchen, compilation of memorials by Ming dynasty officials was ordered.",
    "On gengchen day, Ming official memorials were ordered compiled.",
  ],
  s0270: [
    "An edict stated: \"Among prohibited books sent from the provinces, such as Xu Bidao's Nanzou Cao, Xiao Jingao's Shu Cao, and Song Yihan's Yeyuan Fengshi, which keenly struck at the abuses of the age—none shames forthright remonstrance.",
    "The throne said banned books like Xu Bidao's and Xiao Jingao's were honest remonstrance.",
  ],
  s0271: [
    "Though their rulers pretended not to hear, their painful accounts of contemporary laxity and confusion serve as mirrors for study.",
    "Ignored by their rulers, those frank records still instruct.",
  ],
  s0272: [
    "I deem it better to select the more relevant pieces, compile them separately under the title Ming-ji Memorials, fix them in one book, and keep them forever as a warning.",
    "Selected memorials would be published as Ming-ji Memorials for permanent warning.",
  ],
  s0273: [
    "Officials who spoke under the former dynasty sometimes used language touching our state; they should not be harshly blamed but should be edited in selection; the rest should still be destroyed by category.",
    "Former-dynasty language would be edited, not punished, while other books were destroyed.",
  ],
  s0274: [
    "\" On day renwu, imperial lodges were built at Longquanzhuang and elsewhere in Jiangnan.",
    "On renwu day, Jiangnan lodges were built at Longquanzhuang and elsewhere.",
  ],
  s0275: [
    "Third month, day bingshen: Yinglian was ordered to act as Zhili governor-general.",
    "In the third month, Yinglian acted as Zhili governor-general.",
  ],
  s0276: [
    "On day dingyou, Defu was ordered to act as associate grand secretary.",
    "On dingyou day, Defu acted as associate grand secretary.",
  ],
  s0277: [
    "Yang Jingsu was transferred to Zhili governor-general; Sanbao to Fujian-Zhejiang governor-general.",
    "Yang Jingsu took Zhili and Sanbao took Fujian-Zhejiang.",
  ],
  s0278: [
    "Tusede was made Huguang governor-general; Shu Chang Guizhou governor.",
    "Tusede took Huguang and Shu Chang took Guizhou.",
  ],
  s0279: [
    "On day yisi, Tan Shangzhong was ordered to act as Shanxi governor.",
    "On yisi day, Tan Shangzhong acted as Shanxi governor.",
  ],
  s0280: [
    "On day jiyou, relief was granted for last year's drought in thirty-nine Hubei prefectures and counties including Jiangxia.",
    "On jiyou day, thirty-nine Hubei districts including Jiangxia received drought relief.",
  ],
  s0281: [
    "Summer, fourth month, day jiwei: the Pizhan commissioner was changed to Turpan brigade commander.",
    "In the fourth month, the Pizhan commissioner became Turpan brigade commander.",
  ],
  s0282: [
    "On day wuchen, the Emperor went to the Western Tombs.",
    "On wuchen day, the Emperor went to the Western Tombs.",
  ],
  s0283: [
    "On day renshen, the Emperor visited the Tai Tomb and Tai East Tomb.",
    "On renshen day, the Emperor visited the Tai and Tai East Tombs.",
  ],
  s0284: [
    "On day dingchou, the Gansu courier commissioner was changed to the Lanzhou circuit intendant.",
    "On dingchou day, the Gansu courier post became the Lanzhou circuit.",
  ],
  s0285: [
    "On day wuyin, Yuan Shoutong was made Hedong river conservancy director and Hu Jitang Minister of Punishments.",
    "On wuyin day, Yuan Shoutong took Hedong conservancy and Hu Jitang took Punishments.",
  ],
  s0286: [
    "On day jimao, the Emperor reviewed troops of the Vanguard Camp.",
    "On jimao day, the Emperor reviewed Vanguard Camp troops.",
  ],
  s0287: [
    "On day gengchen, the Emperor returned to the capital.",
    "On gengchen day, the Emperor returned to the capital.",
  ],
  s0288: [
    "Fifth month, day yiwei: the Emperor went for autumn hunting at Mulan and remitted one-third of this year's poll-tax for districts along the route.",
    "In the fifth month, the Emperor hunted at Mulan and remitted one-third of route poll-tax.",
  ],
  s0289: [
    "On day bingshen, Li Shijie was made Guangxi governor.",
    "On bingshen day, Li Shijie became Guangxi governor.",
  ],
  s0290: [
    "On day xinchou, the Emperor lodged at the Mountain Resort for Avoiding Summer Heat.",
    "On xinchou day, the Emperor lodged at the Summer Resort.",
  ],
  s0291: [
    "On day bingwu, Fu Gang was made Fujian governor.",
    "On bingwu day, Fu Gang became Fujian governor.",
  ],
  s0292: [
    "On day dingwei, the Emperor performed the libation rite at the Confucian temple.",
    "On dingwei day, the Emperor performed the Confucian libation rite.",
  ],
  s0293: [
    "Sixth month, day dingmao: 235,000 taels of silver and 1,050,000-odd piculs of grain of Gansu tax arrears from Qianlong 27-37 were remitted.",
    "In the sixth month, Gansu arrears of 235,000 taels and over 1,050,000 piculs of grain were remitted.",
  ],
  s0294: [
    "On day wuchen, the Qin River in Wuzhi and He'nei, Henan, breached.",
    "On wuchen day, the Qin River broke at Wuzhi and He'nei in Henan.",
  ],
  s0295: [
    "On day gengchen, the Turpan Manchu city was built.",
    "On gengchen day, the Turpan Manchu city was built.",
  ],
  s0296: [
    "Autumn, seventh month, day yiwei: Sun Shiyi was made Yunnan governor.",
    "In the seventh month, Sun Shiyi became Yunnan governor.",
  ],
  s0297: [
    "Eighth month, day wuchen: the Emperor went to Mulan for the autumn hunt.",
    "In the eighth month, the Emperor went to Mulan for the autumn hunt.",
  ],
  s0298: [
    "On day xinwei, Heshen was ordered to study while walking attendance among grand ministers before the throne.",
    "On xinwei day, Heshen was ordered to study in attendance before the throne.",
  ],
  s0299: [
    "On day jiaxu, Bannerman Yongwei was made Heilongjiang general.",
    "On jiaxu day, Bannerman Yongwei became Heilongjiang general.",
  ],
  s0300: [
    "On day yihai, the Palace of Tranquil Longevity was completed.",
    "On yihai day, the Palace of Tranquil Longevity was completed.",
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_014_b03.mjs <translation.json>'
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
