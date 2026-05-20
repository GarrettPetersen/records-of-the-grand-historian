#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Thirty-first year, spring, first month, new moon on day renshen: an edict stated that in thirty years of ruling the realm, all within the Four Seas was tranquil and secure and the universe had been brought to order; from this year onward, grain-transport taxes were universally remitted once in every province.',
    'In spring of Qianlong 31, on the first-month new moon, Hongli ordered a one-time canal-tax remission in every province after thirty years on the throne.',
  ],
  s0002: [
    'On day jiaxu, accumulated tax arrears were remitted for fourteen Gansu departments, prefectures, and counties including Jingyuan, and for subordinate units of three Shaanxi prefectures and departments including Yan\'an.',
    'On jiaxu, fourteen Gansu and three Shaanxi districts were forgiven back taxes.',
  ],
  s0003: [
    'On day bingxu, Yunnan government troops suppressed Mang bandits at Mengzhu and suffered defeat.',
    'On bingxu, Yunnan forces lost a fight with Mang bandits at Mengzhu.',
  ],
  s0004: [
    'Yang Yingqi was transferred to be Yunnan-Guizhou governor-general; Wu Dashan to Shaanxi-Gansu governor-general; He Hezhong was assigned as protector.',
    'Yang Yingqi took Yunnan-Guizhou; Wu Dashan, Shaanxi-Gansu; He Hezhong became protector.',
  ],
  s0005: [
    'Liu Zao was transferred to be Huguang governor-general; Tang Pin was made acting Shaanxi governor.',
    'Liu Zao took Huguang; Tang Pin acted as Shaanxi governor.',
  ],
  s0006: [
    'On day guisi, Minister of Punishments Zhuang Yougong, because his judgment in the impeachment case of Duan Chenggong was not factual, was stripped of office, imprisoned, and his property was confiscated.',
    'On guisi, Zhuang Yougong, minister of punishments, lost his post and property for a false verdict in Duan Chenggong\'s impeachment.',
  ],
  s0007: [
    'Li Shiyao was transferred to be Minister of Punishments; Zhang Taikai was made Minister of Rites; Fan Shishou was made Left Censor-in-Chief.',
    'Li Shiyao took punishments; Zhang Taikai, rites; Fan Shishou, left censor-in-chief.',
  ],
  s0008: [
    'Second month, day renyin: Liu Zao was demoted to Hubei governor; he was still ordered to join Yunnan Military Governor Da Qi and his subordinates in strict deliberation.',
    'In month 2, renyin, Liu Zao became Hubei governor but still faced joint inquiry with Yunnan commander Da Qi.',
  ],
  s0009: [
    'Ding Chang was made Huguang governor-general; Li Yinpei was transferred to Fujian governor; Chang Jun to Hunan governor; Tang Pin to Yunnan governor.',
    'Ding Chang took Huguang; Li Yinpei, Fujian; Chang Jun, Hunan; Tang Pin, Yunnan.',
  ],
  s0010: [
    'On day gengxu, the Emperor paid rites at the Eastern Tombs.',
    'On gengxu, Hongli worshipped at the Eastern Tombs.',
  ],
  s0011: [
    'On day xinhai, He Hezhong, for covering Duan Chenggong\'s deficit, was stripped of office and arrested for questioning.',
    'On xinhai, He Hezhong was arrested for masking Duan Chenggong\'s losses.',
  ],
  s0012: [
    'Shuhede was made acting Shaanxi-Gansu governor-general.',
    'Shuhede acted as Shaanxi-Gansu governor-general.',
  ],
  s0013: [
    'Sida was ordered to go to Shaanxi to join Zhang Bao in investigating and handling the case of Duan Chenggong\'s deficit.',
    'Sida was sent to Shaanxi to try Duan Chenggong\'s deficit case with Zhang Bao.',
  ],
  s0014: [
    'Mingshan was transferred to be Shaanxi governor; Wu Shaoshi was made Jiangxi governor.',
    'Mingshan took Shaanxi; Wu Shaoshi, Jiangxi.',
  ],
  s0015: [
    'On day gengshen, the Emperor returned to the capital.',
    'On gengshen, Hongli returned to Beijing.',
  ],
  s0016: [
    'On day xinyou, Zhuang Yougong was sentenced to decapitation.',
    'On xinyou, Zhuang Yougong was condemned to death.',
  ],
  s0017: [
    'On day renxu, the Emperor paid rites at Tailing.',
    'On renxu, Hongli worshipped at Tailing.',
  ],
  s0018: [
    'On day guihai, Liu Zao was stripped of office and ordered to remain in Yunnan to serve effectively.',
    'On guihai, Liu Zao lost rank but stayed in Yunnan on duty.',
  ],
  s0019: [
    'On day jiazi, E Ning was made Hubei governor.',
    'On jiazi, E Ning became Hubei governor.',
  ],
  s0020: [
    'On day wuchen, the Emperor returned to the capital.',
    'On wuchen, Hongli returned to Beijing.',
  ],
  s0021: [
    'Third month, day dinghai: Liu Zao, fearing punishment, committed suicide.',
    'In month 3, dinghai, Liu Zao killed himself in fear of trial.',
  ],
  s0022: [
    'On day jichou, Yang Yingqi memorialized that the tusi of Menglong and others had returned and submitted.',
    'On jichou, Yang Yingqi reported Menglong tusi submitting again.',
  ],
  s0023: [
    'Summer, fourth month, day xinchou: Yang Yingqi memorialized that the chief of Damengyang had submitted; government troops advanced to take Zhengqian and Menggen.',
    'In month 4, xinchou, Yang Yingqi reported Damengyang\'s chief submitting; troops moved on Zhengqian and Menggen.',
  ],
  s0024: [
    'On day renyin, because the Mang bandit Zhengqian had been pacified, proclamation was made to the inner and outer realms.',
    'On renyin, with Zhengqian crushed, the court announced victory at home and abroad.',
  ],
  s0025: [
    'On day bingwu, He Hezhong was sentenced to decapitation; Duan Chenggong was executed.',
    'On bingwu, He Hezhong was condemned to death and Duan Chenggong was executed.',
  ],
  s0026: [
    'On day dingwei, quota taxes for this year and accumulated taxes at Menglong were remitted for thirteen Yunnan tusi including Puteng.',
    'On dingwei, thirteen Yunnan tusi including Puteng were tax-exempt for the year and for Menglong arrears.',
  ],
  s0027: [
    'On day jiazi, Zhang Shuxun and two hundred thirteen others were granted jinshi degrees with graded ranks.',
    'On jiazi, two hundred thirteen graduates including Zhang Shuxun received jinshi ranks.',
  ],
  s0028: [
    'Fifth month, day jiaxu: the Emperor went to Black Dragon Pool to pray for rain.',
    'In month 5, jiaxu, Hongli prayed for rain at Black Dragon Pool.',
  ],
  s0029: [
    'On day wuyin, the Perfect Man of the Orthodox Unity was ordered to hold third-rank standing.',
    'On wuyin, the Zhengyi celestial master was granted third rank.',
  ],
  s0030: [
    'On day bingxu, the Emperor went to Black Dragon Pool to pray for rain.',
    'On bingxu, Hongli again prayed for rain at Black Dragon Pool.',
  ],
  s0031: [
    'Sixth month, day bingwu: Yang Yingqi memorialized that the chief Zhaozhai of Mengyong and the chiefs Bahumeng of Menglongsha and others had submitted.',
    'In month 6, bingwu, Yang Yingqi reported Mengyong and Menglongsha chiefs submitting.',
  ],
  s0032: [
    'On day wushen, the deceased Westerner Lang Shining, formerly of third rank, was posthumously granted vice-minister rank.',
    'On wushen, the late Jesuit painter Lang Shining received posthumous vice-minister rank.',
  ],
  s0033: [
    'Autumn, seventh month, day bingzi: the Emperor, escorting the Empress Dowager, went on the autumn hunt at Mulan.',
    'In month 7, bingzi, Hongli and the Empress Dowager left for the Mulan autumn hunt.',
  ],
  s0034: [
    'On day jimao, Arigun and Yu Minzhong were ordered to accompany; Shuhede was ordered to serve additionally as Minister of Revenue.',
    'On jimao, Arigun and Yu Minzhong joined the hunt; Shuhede also took revenue.',
  ],
  s0035: [
    'On day renwu, the Emperor, escorting the Empress Dowager, lodged at the Mountain Resort for Escaping the Heat.',
    'On renwu, Hongli and the Empress Dowager reached the Summer Resort.',
  ],
  s0036: [
    'On that day, the Empress died.',
    'That same day, the Empress died.',
  ],
  s0037: [
    'On day guiwei, an edict stated that because last year the Empress had accompanied the tour to Jiangsu and Zhejiang but could not fulfill filial duty with full devotion, funeral rites would follow the precedent for an imperial noble consort.',
    'On guiwei, Hongli ruled the Empress would be buried as an imperial noble consort for failing filial duties on the Jiang-Zhe tour.',
  ],
  s0038: [
    'On day guisi, Censor Li Yuming memorialized that the Empress\'s funeral rites could not match precedent; displeasing the throne, he was banished to Yili.',
    'On guisi, Li Yuming was exiled to Yili for protesting the Empress\'s reduced funeral.',
  ],
  s0039: [
    'On day dingyou, Yang Yingqi memorialized that the chief Gadiyaweng of Buhada and the chief Lazhaxili of Mengsa had submitted.',
    'On dingyou, Yang Yingqi reported Buhada and Mengsa chiefs submitting.',
  ],
  s0040: [
    'Eighth month, day jihai: flood relief was given for water disaster in thirteen Hunan counties and guards including Xiangyin.',
    'In month 8, jihai, thirteen Hunan flood districts were relieved.',
  ],
  s0041: [
    'On day guichou, the Emperor went to Mulan for the hunt enclosure.',
    'On guichou, Hongli hunted at Mulan.',
  ],
  s0042: [
    'Zhuang Yougong\'s crime was pardoned; he was raised to be Fujian governor.',
    'Zhuang Yougong was pardoned and made Fujian governor.',
  ],
  s0043: [
    'On day jiayin, locusts struck Yili.',
    'On jiayin, locusts swarmed Yili.',
  ],
  s0044: [
    'On day yimao, the Hanjiatang River breached at Tongshan county, Jiangsu.',
    'On yimao, the Hanjiatang dike broke at Tongshan, Jiangsu.',
  ],
  s0045: [
    'On day guihai, the Chahar deputy commandants were reduced; one post was retained stationed at Zhangjiakou.',
    'On guihai, Chahar deputy commands were cut to one man at Zhangjiakou.',
  ],
  s0046: [
    'Ninth month, day renshen: quota taxes were remitted for drought in nine Gansu counties including Jingyuan and for two counties, Hongshui and Dongle.',
    'In month 9, renshen, eleven Gansu drought counties were tax-exempt.',
  ],
  s0047: [
    'On day jimao, flood relief was given for water disaster in fifty-five Shandong counties including Licheng and five guards and posts including Dongchang, and both new and old quota taxes were remitted.',
    'On jimao, sixty Shandong flood districts were relieved and lost new and old taxes.',
  ],
  s0048: [
    'On day yiwei, Yang Yingqi went to Yongchang to receive the surrender of Mubang.',
    'On yiwei, Yang Yingqi took Mubang\'s surrender at Yongchang.',
  ],
  s0049: [
    'Winter, tenth month, day jihai: the Emperor, escorting the Empress Dowager, returned to the capital.',
    'In month 10, jihai, Hongli and the Empress Dowager returned to Beijing.',
  ],
  s0050: [
    'On day wushen, Yang Yingqi memorialized that the chiefs of Zhengmai, Jingxian, Jinghai, and other departments had submitted.',
    'On wushen, Yang Yingqi reported chiefs of Zhengmai, Jingxian, and Jinghai submitting.',
  ],
  s0051: [
    'On day xinhai, the Hanjiatang breach was closed and united.',
    'On xinhai, the Hanjiatang break was sealed.',
  ],
  s0052: [
    'Minister of War Peng Qifeng was demoted to supplementary vice-minister.',
    'War minister Peng Qifeng was demoted to vice-minister.',
  ],
  s0053: [
    'On day jiayin, Lu Zongkai was made Minister of War.',
    'On jiayin, Lu Zongkai became war minister.',
  ],
  s0054: [
    'On day renxu, the Yunnan Yinan circuit was added.',
    'On renxu, Yunnan gained a new Yinan circuit.',
  ],
  s0055: [
    'Eleventh month, day yihai: Yang Yingqi memorialized that the chiefs of Burma\'s Dashan, Mengyu, Mengda, and other departments had submitted.',
    'In month 11, yihai, Yang Yingqi reported Burmese chiefs of Dashan, Mengyu, and Mengda submitting.',
  ],
  s0056: [
    'On day wuyin, because Yang Yingqi was ill, Yang Tingzhang was ordered to go to Yongchang to take over handling the Burmese bandits.',
    'On wuyin, ill Yang Yingqi was relieved by Yang Tingzhang at Yongchang for the Burma campaign.',
  ],
  s0057: [
    'On day guisi, Bodyguard Fuling\'an was ordered to bring an imperial physician to visit Yang Yingqi\'s illness.',
    'On guisi, Fuling\'an was sent with a court doctor to see Yang Yingqi.',
  ],
  s0058: [
    'Twelfth month, day yisi: E Ning was transferred to be Hunan governor; E Bao was made Hubei governor.',
    'In month 12, yisi, E Ning took Hunan; E Bao, Hubei.',
  ],
  s0059: [
    'On day guichou, Balu was made Suiyuan city general.',
    'On guichou, Balu became Suiyuan general.',
  ],
  s0060: [
    'That year, Korea and Ryukyu presented tribute.',
    'That year, Korea and Ryukyu sent tribute.',
  ],
  s0061: [
    'Thirty-second year, spring, first month, day yihai: Yunnan government troops suppressed Burmese bandits at Xinjie and suffered defeat; Yang Tingzhang was ordered to return to Guangdong.',
    'In spring of Qianlong 32, yihai, Yunnan forces lost at Xinjie; Yang Tingzhang was recalled to Guangdong.',
  ],
  s0062: [
    'Second month, day yimao: because Yang Yingqi was ill, his son Yang Chongying, Jiangsu surveillance commissioner, was ordered to go to Yongchang to assist in managing military affairs.',
    'In month 2, yimao, Yang Yingqi\'s son Chongying, Jiangsu commissioner, was sent to Yongchang to run the war.',
  ],
  s0063: [
    'On day bingwu, Yunnan government troops fought Burmese bandits on the Dima River and suffered defeat; Military Governor Li Shisheng was arrested and imprisoned.',
    'On bingwu, Yunnan lost on the Dima River; commander Li Shisheng was jailed.',
  ],
  s0064: [
    'On day wushen, E Ning was transferred to be Yunnan governor.',
    'On wushen, E Ning became Yunnan governor.',
  ],
  s0065: [
    'On day jiayin, Prince Zhuang Yunlu died.',
    'On jiayin, Prince Zhuang Yunlu died.',
  ],
  s0066: [
    'On day bingchen, the Emperor went in person to offer mourning rites.',
    'On bingchen, Hongli mourned him in person.',
  ],
  s0067: [
    'On day jiwei, the Emperor went on tour to Tianjin.',
    'On jiwei, Hongli toured Tianjin.',
  ],
  s0068: [
    'On day guihai, disaster victims were relieved in five Fengtian prefectures and counties including Chengde and in Xingjing Fenghuang city.',
    'On guihai, six Fengtian disaster districts were relieved.',
  ],
  s0069: [
    'Third month, new moon on day yichou: the Emperor inspected the Ziya River dike.',
    'On the third-month new moon, Hongli inspected the Ziya River dike.',
  ],
  s0070: [
    'Yang Yingqi was summoned to attend affairs in the Grand Council; Ming Rui was made Yunnan-Guizhou governor-general.',
    'Yang Yingqi joined the Grand Council; Ming Rui became Yunnan-Guizhou governor-general.',
  ],
  s0071: [
    'On day bingyin, Tuoyong was transferred to be Minister of Works; Ming Rui was made Minister of War.',
    'On bingyin, Tuoyong took works; Ming Rui, war.',
  ],
  s0072: [
    'On day jisi, accumulated tax arrears were remitted for all of Zhili province.',
    'On jisi, all Zhili back taxes were forgiven.',
  ],
  s0073: [
    'On day gengwu, the Emperor reviewed the garrison Manchu troops at Tianjin.',
    'On gengwu, Hongli reviewed Tianjin\'s Manchu garrison.',
  ],
  s0074: [
    'Agui was made Yili general.',
    'Agui became Yili general.',
  ],
  s0075: [
    'On day renshen, the Emperor reviewed the Green Standard troops.',
    'On renshen, Hongli reviewed the Green Standard army.',
  ],
  s0076: [
    'On day gengchen, the Emperor returned to the capital.',
    'On gengchen, Hongli returned to Beijing.',
  ],
  s0077: [
    'On day xinsi, Grand Secretary Yang Yingqi was stripped of office.',
    'On xinsi, Yang Yingqi lost his grand secretary post.',
  ],
  s0078: [
    'On day renwu, because Burmese bandits had invaded Zhandian and Longchuan, Yang Yingqi\'s crimes of causing delay and harm were proclaimed.',
    'On renwu, Burma\'s raid on Zhandian and Longchuan exposed Yang Yingqi\'s blunders.',
  ],
  s0079: [
    'On day guiwei, E Ning was ordered to go to Pu\'er to manage military affairs.',
    'On guiwei, E Ning was sent to Pu\'er for the campaign.',
  ],
  s0080: [
    'On day gengyin, Li Shiyao was made Liangguang governor-general; Yang Tingzhang was recalled to be Minister of Punishments.',
    'On gengyin, Li Shiyao took Liangguang; Yang Tingzhang became punishments minister.',
  ],
  s0081: [
    'On day guisi, E Ning was made acting Yunnan-Guizhou governor-general.',
    'On guisi, E Ning acted as Yunnan-Guizhou governor-general.',
  ],
  s0082: [
    'Summer, fourth month, day jiyou: the Emperor went to Black Dragon Pool to pray for rain.',
    'In month 4, jiyou, Hongli prayed for rain at Black Dragon Pool.',
  ],
  s0083: [
    'On day gengxu, because miasma was severe on the Yunnan border, advance of troops was ordered temporarily halted.',
    'On gengxu, Yunnan\'s border miasma halted the advance.',
  ],
  s0084: [
    'On day gengshen, Zhang Taikai was ordered to serve as Minister of Rites while managing affairs of the Left Censorate; Ji Huang was made acting Minister of Rites.',
    'On gengshen, Zhang Taikai took rites and the censorate; Ji Huang acted as rites minister.',
  ],
  s0085: [
    'Fifth month, day jisi: E Bao was made Guizhou governor; Ding Chang was ordered to serve additionally as Hubei governor.',
    'In month 5, jisi, E Bao took Guizhou; Ding Chang also acted as Hubei governor.',
  ],
  s0086: [
    'On day gengwu, Fan Shishou was made Hubei governor.',
    'On gengwu, Fan Shishou became Hubei governor.',
  ],
  s0087: [
    'Zhang Taikai was transferred to be Left Censor-in-Chief; Ji Huang was made Minister of Rites.',
    'Zhang Taikai took the censorate; Ji Huang, rites.',
  ],
  s0088: [
    'On day renshen, Chen Hongmou was ordered to manage the Ministry of Works.',
    'On renshen, Chen Hongmou took charge of works.',
  ],
  s0089: [
    'On day bingzi, Yunnan government troops suffered defeat at Mubang; Yang Ning and others withdrew troops to Longling.',
    'On bingzi, Yunnan lost at Mubang; Yang Ning retreated to Longling.',
  ],
  s0090: [
    'On day gengyin, Li Shisheng and Zhu Lun were executed.',
    'On gengyin, Li Shisheng and Zhu Lun were put to death.',
  ],
  s0091: [
    'Sixth month, day xinyou: Erjing\'e was made campaign participation minister and dispatched to Yunnan.',
    'In month 6, xinyou, Erjing\'e was sent to Yunnan as campaign commissioner.',
  ],
  s0092: [
    'Autumn, seventh month: Fujian governor Zhuang Yougong died; Cui Yingjie was transferred to replace him.',
    'In month 7, Zhuang Yougong died; Cui Yingjie took Fujian.',
  ],
  s0093: [
    'Li Qingshi was made Shandong governor; Qiu Yuexiu was made Minister of Rites.',
    'Li Qingshi took Shandong; Qiu Yuexiu, rites.',
  ],
  s0094: [
    'On day renwu, the Emperor, escorting the Empress Dowager, went on the autumn hunt at Mulan.',
    'On renwu, Hongli and the Empress Dowager left for the Mulan autumn hunt.',
  ],
  s0095: [
    'On day wuzi, the Emperor, escorting the Empress Dowager, lodged at the Mountain Resort for Escaping the Heat.',
    'On wuzi, Hongli and the Empress Dowager reached the Summer Resort.',
  ],
  s0096: [
    'On day jichou, Mukden General Shetuken was dismissed; Xinzhu replaced him.',
    'On jichou, Shetuken left Mukden; Xinzhu took the post.',
  ],
  s0097: [
    'Intercalary seventh month, day jiayin: Yang Yingqi was granted permission to take his own life.',
    'On intercalary seventh-month jiayin, Yang Yingqi was ordered to commit suicide.',
  ],
  s0098: [
    'On day bingchen, Burmese bandits crossed the Xiaomenglun River and invaded Citong in Yunnan.',
    'On bingchen, Burmese raiders crossed the Xiaomenglun and struck Yunnan\'s Citong.',
  ],
  s0099: [
    'Eighth month, day guiyou: Qiu Yuexiu was transferred to be Minister of Works; Dong Bangda was made Minister of Rites.',
    'In month 8, guiyou, Qiu Yuexiu took works; Dong Bangda, rites.',
  ],
  s0100: [
    'On day dingchou, the Emperor went to Mulan.',
    'On dingchou, Hongli went to Mulan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_013_b01.mjs <translation.json>'
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
