#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'Imperial Commissioner Sheng Bao\'s army had long been without success; he was stripped of office and arrested for inquiry.',
    'Sheng Bao lost his commission after prolonged failure and was arrested.',
  ],
  s0602: [
    'On day bingxu, bandits caused trouble in Yueqing, Zhejiang; they were suppressed and pacified.',
    'On bingxu day, Yueqing bandits in Zhejiang were suppressed.',
  ],
  s0603: [
    'Merit at Lianzhen was recounted; Xiling\'a, Ruilin, Qingqi, Mianxun, Lamugun Buzhabu, and Sengge Rinchen each received generous rewards.',
    'Lianzhen honors brought rich rewards to Xiling\'a, Ruilin, Qingqi, Mianxun, Lamugun Buzhabu, and Sengge Rinchen.',
  ],
  s0604: [
    'Second month, new moon on day jiawu: Wang Yide memorialized that foreign merchants came to Fujian to sell tea, rented civilian houses for long residence, and sought to collect tea tax thereby; the court assented.',
    'At the second-month new moon, jiawu, Wang Yide won assent to tax foreign tea merchants renting houses in Fujian.',
  ],
  s0605: [
    'Because the French general Rigault assisted in attacking Shanghai, four bolts of silk and ten thousand taels of silver were bestowed, as Ji\'erhang\'a had requested.',
    'Rigault\'s aid at Shanghai brought him silk and ten thousand taels of silver at Ji\'erhang\'a\'s request.',
  ],
  s0606: [
    'On day jihai, the Emperor attended the classics lecture.',
    'On jihai day, the Emperor held court lecture on the classics.',
  ],
  s0607: [
    'Sengge Rinchen memorialized that Gaotang prefecture had been recovered and the remaining bandits had fled into Fengguantun.',
    'Sengge Rinchen reported Gaotang retaken while remnant bandits fled to Fengguantun.',
  ],
  s0608: [
    'On day xinchou, bandits rebelled in Fujian; they were suppressed and pacified.',
    'On xinchou day, Fujian bandits were suppressed.',
  ],
  s0609: [
    'On day wuwu, Hu bandits fled north; Sengge Rinchen was ordered to transfer three or four thousand cavalry and infantry to Henan to aid defense.',
    'On wuwu day, northern-fleeing Hu bandits drew three or four thousand of Sengge Rinchen\'s troops to Henan.',
  ],
  s0610: [
    'Third month, day jiazi: Guangdong government troops recovered Haifeng.',
    'In the third month, on jiazi day, Guangdong forces retook Haifeng.',
  ],
  s0611: [
    'Anhui bandits took Huizhou.',
    'Huizhou fell to Anhui bandits.',
  ],
  s0612: [
    'On day yichou, the Emperor visited the Western Tombs.',
    'On yichou day, the Emperor visited the Western Tombs.',
  ],
  s0613: [
    'Bandits took Wuchang; Governor Tao Enpei died in the fighting; Hu Linyi was ordered to administer as Hubei governor.',
    'Wuchang fell, Tao Enpei was killed, and Hu Linyi acted as Hubei governor.',
  ],
  s0614: [
    'On day xinwei, the Emperor returned to the capital.',
    'On xinwei day, the Emperor returned to Beijing.',
  ],
  s0615: [
    'On day xinmao, Yang Feng, ringleader of Guizhou bandits, was captured and executed; the remaining bandits were pacified.',
    'On xinmao day, Guizhou\'s Yang Feng was executed and his followers pacified.',
  ],
  s0616: [
    'Summer, fourth month, day yiwei: Anhui government troops recovered Wuyuan.',
    'In summer, month 4, yiwei, Anhui forces retook Wuyuan.',
  ],
  s0617: [
    'The emperor\'s son-in-law Jingshou was made an imperial presence grand minister.',
    'Jingshou, the emperor\'s son-in-law, became an imperial presence grand minister.',
  ],
  s0618: [
    'On day dingwei, Jiangxi bandits took Guangxin.',
    'On dingwei day, Guangxin fell to Jiangxi bandits.',
  ],
  s0619: [
    'On day gengxu, Sengge Rinchen and others memorialized that the Fengguantun bandit nest had been stormed, chief rebel Li Kaifang captured, and the remaining bandits entirely annihilated.',
    'On gengxu day, Sengge Rinchen reported Fengguantun taken, Li Kaifang captured, and the remnant destroyed.',
  ],
  s0620: [
    'An edict responded: "We are relieved. Sengge Rinchen is forthwith enfeoffed as a prince with hereditary succession, permitted to ride in a sedan chair, and Deleksereng is given the title of beile; the rest are promoted in rank."',
    'The throne made Sengge Rinchen a hereditary prince with sedan-chair privilege, ennobled Deleksereng, and promoted his officers.',
  ],
  s0621: [
    'Jiangxi government troops recovered Yiyang.',
    'Yiyang was retaken by Jiangxi government troops.',
  ],
  s0622: [
    'Zhejiang bandits took Kaihua.',
    'Kaihua fell to Zhejiang bandits.',
  ],
  s0623: [
    'On day jiwei, Xi\'an General Zhalafen died in battle while suppressing bandits in Hubei; generous condolence was granted.',
    'On jiwei day, Zhalafen of Xi\'an died fighting bandits in Hubei and received posthumous honors.',
  ],
  s0624: [
    'Yang Pi was stripped of office; Guan Wen was made Huguang governor-general, Mianxun Jingzhou general, and Ruilin Xi\'an general.',
    'Yang Pi was dismissed; Guan Wen took Huguang, Mianxun Jingzhou, and Ruilin Xi\'an.',
  ],
  s0625: [
    'Xiling\'a was made Imperial Commissioner and sent to Hubei to suppress bandits.',
    'Xiling\'a went to Hubei as Imperial Commissioner against the rebels.',
  ],
  s0626: [
    'On day gengshen, Jiangxi government troops recovered Raozhou, Guangxin, and Xing\'an.',
    'On gengshen day, Jiangxi forces retook Raozhou, Guangxin, and Xing\'an.',
  ],
  s0627: [
    'On day xinyou, Guangdong government troops won victories suppressing bandits; land and water bandit gangs were all pacified.',
    'On xinyou day, Guangdong forces pacified all land and water bandit gangs.',
  ],
  s0628: [
    'Fifth month, day bingyin: the fallen magistrate Gao Hongfei of Fujian was mourned, entered the Beijing Shrine of Loyalty, and a shrine was also built in Taiwan.',
    'In the fifth month, bingyin, fallen Fujian magistrate Gao Hongfei was honored in Beijing and Taiwan shrines.',
  ],
  s0629: [
    'On day dingmao, Xiang Rong memorialized that in suppressing bandits at Sanshan he was victorious.',
    'On dingmao day, Xiang Rong reported victory at Sanshan.',
  ],
  s0630: [
    'On day wuchen, Guangdong government troops recovered Heyuan and other counties and annihilated bandits at Sanshui.',
    'On wuchen day, Guangdong retook Heyuan and destroyed bandits at Sanshui.',
  ],
  s0631: [
    'On day xinwei, the Emperor attended at the Gate of Heavenly Purity as the commissioned Grand General, Prince Mianyu, and the assisting Grand General, Prince Sengge Rinchen, respectfully returned the grand general\'s seal and the assisting commissioner\'s seal.',
    'On xinwei day at Qianqing Gate, Princes Mianyu and Sengge Rinchen returned their grand-general seals.',
  ],
  s0632: [
    'On day renshen, an edict said: "Organizing local militia was originally to protect villages and hamlets.',
    'On renshen day an edict warned that militia were meant to guard the countryside.',
  ],
  s0633: [
    'Yet Henan has repeatedly had grain-tax resistance and resistance to officials.',
    'Yet Henan kept seeing tax revolts and defiance of officials.',
  ],
  s0634: [
    'If such examples spread in succession, the harm will be very great.',
    'Mass imitation of that kind would do great harm.',
  ],
  s0635: [
    'All governors-general and governors should take extra care to rectify matters and not let long delay breed trouble."',
    'All governors were told to tighten control before trouble grew.',
  ],
  s0636: [
    'At that time Shandong already had harm from the "Black Militia," not yet reported to the throne.',
    'Shandong\'s Black Militia scourge was not yet known at court.',
  ],
  s0637: [
    'Later they were finally suppressed by military force.',
    'They were eventually crushed by force of arms.',
  ],
  s0638: [
    'On day yihai, Boqiu was made Rehe commandant.',
    'On yihai day, Boqiu became Rehe commandant.',
  ],
  s0639: [
    'On day wuyin, Yang Pi\'s army recovered Suizhou.',
    'On wuyin day, Yang Pi\'s force retook Suizhou.',
  ],
  s0640: [
    'On day guiwei, Henan forces recovered Guangshan.',
    'On guiwei day, Henan troops retook Guangshan.',
  ],
  s0641: [
    'On day dinghai, Hu Linyi memorialized that land and water forces under separate command jointly attacked Wuhan and won four battles in four engagements.',
    'On dinghai day, Hu Linyi reported four straight victories pressing Wuhan by land and water.',
  ],
  s0642: [
    'An edict ordered swift recovery.',
    'The court ordered rapid recapture.',
  ],
  s0643: [
    'An edict said: "We hear that Yunnan Hui people easily cause incidents and have repeatedly gathered crowds to resist grain levies.',
    'An edict warned that Yunnan Hui communities kept resisting grain levies in armed crowds.',
  ],
  s0644: [
    'Hengchun and Shuxing\'a must punish the chief culprits and not let the trouble spread over time."',
    'Hengchun and Shuxing\'a were told to punish ringleaders before unrest spread.',
  ],
  s0645: [
    'Li Jun was made Grand Canal governor-general of the Eastern River.',
    'Li Jun became Eastern River canal governor-general.',
  ],
  s0646: [
    'Sixth month, day yiwei: Jiangxi bandits took Yining.',
    'In the sixth month, yiwei, Jiangxi bandits took Yining.',
  ],
  s0647: [
    'On day dingyou, Regional Commander Deng Shaoliang recovered Xiuning.',
    'On dingyou day, Deng Shaoliang retook Xiuning.',
  ],
  s0648: [
    'On day yisi, Guangdong government troops recovered Fengchuan and annihilated bandits on the Humen sea surface.',
    'On yisi day, Guangdong retook Fengchuan and destroyed bandits off Humen.',
  ],
  s0649: [
    'On day bingchen, the Lanyang River in Henan burst its banks.',
    'On bingchen day, Henan\'s Lanyang River overflowed.',
  ],
  s0650: [
    'On day jiwei, the Anhui circuit intendant for Huizhou, Ningguo, Chizhou, and Guangde was ordered to submit special memorials on important matters, as the Taiwan circuit intendant did.',
    'On jiwei day, Anhui\'s Huining circuit gained Taiwan-style direct memorial rights.',
  ],
  s0651: [
    'On day xinyou, Guan Wen memorialized that government troops had recovered Yunmeng and Yingcheng.',
    'On xinyou day, Guan Wen reported Yunmeng and Yingcheng recovered.',
  ],
  s0652: [
    'Autumn, seventh month, new moon on day renxu: the Honored Imperial Noble Consort was elevated as Empress Dowager Kangci.',
    'At the seventh-month new moon, renxu, the Honored Imperial Noble Consort became Empress Dowager Kangci.',
  ],
  s0653: [
    'Guangdong bandits took Chenzhou and Yizhang in Hunan.',
    'Hunan\'s Chenzhou and Yizhang fell to Guangdong bandits.',
  ],
  s0654: [
    'On day guihai, Chen Qimai was dismissed; Wen Jun was made Jiangxi governor.',
    'On guihai day, Chen Qimai fell and Wen Jun took Jiangxi.',
  ],
  s0655: [
    'On day jisi, Xiang Rong memorialized that Wuhu had been recovered.',
    'On jisi day, Xiang Rong reported Wuhu recovered.',
  ],
  s0656: [
    'On day gengwu, the Empress Dowager died.',
    'On gengwu day, the Empress Dowager died.',
  ],
  s0657: [
    'On day dingchou, Xiling\'a\'s advance against De\'an bandits went badly and he withdrew to defend Suizhou.',
    'On dingchou day, Xiling\'a failed at De\'an and fell back to Suizhou.',
  ],
  s0658: [
    'Duxing\'a was ordered to move his army from Fengguantun to suppress them.',
    'Duxing\'a was told to leave Fengguantun and pursue the rebels.',
  ],
  s0659: [
    'On day xinsi, Prince Gong Yixin was removed from duty on the Grand Council and returned to the Upper Study to read books.',
    'On xinsi day, Prince Gong Yixin left the Grand Council for the Upper Study.',
  ],
  s0660: [
    'Wenqing was made a Grand Council minister.',
    'Wenqing joined the Grand Council.',
  ],
  s0661: [
    'On day guiwei, Guangdong government troops recovered Zhaoqing prefecture and Deqing department.',
    'On guiwei day, Guangdong retook Zhaoqing and Deqing.',
  ],
  s0662: [
    'On day jiashen, local bandits caused trouble in Yangcheng, Shanxi; they were suppressed and pacified.',
    'On jiashen day, Yangcheng bandits in Shanxi were suppressed.',
  ],
  s0663: [
    'On day dinghai, Guan Wen memorialized that Hankou had been recovered.',
    'On dinghai day, Guan Wen reported Hankou recovered.',
  ],
  s0664: [
    'Eighth month, new moon on day xinmao: Hu Linyi directed the army in storming the Han towns and advanced to besiege Hanyang.',
    'At the eighth-month new moon, xinmao, Hu Linyi stormed the Han towns and besieged Hanyang.',
  ],
  s0665: [
    'On day jiawu, Ying Gui memorialized that Qiu Lian\'en had captured and executed Nian chiefs Yi Tianfu, Wang Dang, and others.',
    'On jiawu day, Ying Gui reported Qiu Lian\'en had executed Nian leaders Yi Tianfu and Wang Dang.',
  ],
  s0666: [
    'On day jihai, Hunan Regional Commander Taqibu died in camp; he was posthumously made a general.',
    'On jihai day, Taqibu of Hunan died in the field and was made a general posthumously.',
  ],
  s0667: [
    'On day gengzi, the late Empress Dowager was given the honorific title Empress Xiaojing Kangci.',
    'On gengzi day, the late Empress Dowager received the title Empress Xiaojing Kangci.',
  ],
  s0668: [
    'Hui bandits from Kashgar entered the pass; troops sent by Ishaqpa drove them out.',
    'Kashgar Hui raiders entered the pass and Ishaqpa\'s troops expelled them.',
  ],
  s0669: [
    'On day wushen, Guangdong government troops in succession recovered Lianzhou, Sanjiang, and Lianshan and lifted the siege of Yong\'an.',
    'On wushen day, Guangdong recovered Lianzhou, Sanjiang, and Lianshan and relieved Yong\'an.',
  ],
  s0670: [
    'Ninth month, day jiazi: Grand Secretary Zhuo Bingtian died.',
    'In the ninth month, on jiazi day, Grand Secretary Zhuo Bingtian died.',
  ],
  s0671: [
    'On day yichou, Liu Zheng was made commander of the Eight Banners.',
    'On yichou day, Liu Zheng became Eight Banners commander.',
  ],
  s0672: [
    'On day gengwu, Wenqing and Ye Mingchen were ordered to assist as grand secretaries.',
    'On gengwu day, Wenqing and Ye Mingchen were assigned to assist the grand secretariat.',
  ],
  s0673: [
    'On day guiyou, one hundred thousand taels from the inner treasury were issued to continue relief for disaster victims in Zhili and Shandong.',
    'On guiyou day, another hundred thousand taels went to Zhili and Shandong disaster relief.',
  ],
  s0674: [
    'On day renwu, Yi bandits caused trouble in Mabian department, Sichuan; government troops suppressed and pacified them.',
    'On renwu day, Mabian Yi unrest in Sichuan was suppressed.',
  ],
  s0675: [
    'On day guiwei, Nian chief Zhang Luoxing fled south from Guide; Regional Commander Wu Long\'e was ordered to suppress him.',
    'On guiwei day, Zhang Luoxing fled south from Guide and Wu Long\'e was sent after him.',
  ],
  s0676: [
    'On day yiyou, Guan Wen was made Imperial Commissioner to supervise Hubei military affairs.',
    'On yiyou day, Guan Wen became Imperial Commissioner over Hubei.',
  ],
  s0677: [
    'Zhejiang forces recovered Xiuning and Shicheng in Anhui.',
    'Zhejiang troops retook Anhui\'s Xiuning and Shicheng.',
  ],
  s0678: [
    'On day wuzi, Deng Shaoliang was transferred to be regional commander of Guyuan.',
    'On wuzi day, Deng Shaoliang became Guyuan regional commander.',
  ],
  s0679: [
    'Winter, tenth month, day dingyou: Hechun and Fu Ji memorialized that Luzhou prefectural city had been recovered.',
    'In the tenth month, dingyou, Hechun and Fu Ji reported Luzhou city recovered.',
  ],
  s0680: [
    'An edict praised and rewarded them: Hechun was given a yellow riding jacket, Fu Ji made Junior Guardian of the Heir Apparent, and three years of quota levies for Hefei were remitted.',
    'The court gave Hechun a yellow jacket, made Fu Ji Junior Guardian, and remitted three years of Hefei taxes.',
  ],
  s0681: [
    'On day xinchou, Miao bandits in Guizhou took Dujiang.',
    'On xinchou day, Guizhou Miao bandits took Dujiang.',
  ],
  s0682: [
    'On day renyin, Guan Wen memorialized that De\'an had been recovered.',
    'On renyin day, Guan Wen reported De\'an recovered.',
  ],
  s0683: [
    'On day wushen, Shi Dakai fled back into Hubei; Hu Linyi blocked and suppressed him.',
    'On wushen day, Shi Dakai re-entered Hubei and Hu Linyi moved to stop him.',
  ],
  s0684: [
    'On day renzi, the forty myriad taels of added river-works surcharge levied in Henan were permanently remitted.',
    'On renzi day, Henan\'s forty-myriad-tael river-works surcharge was abolished forever.',
  ],
  s0685: [
    'Eleventh month, day jiazi: Hu Linyi memorialized that Luo Zinan and Li Xubin met and attacked Shi Dakai and Wei Jun at Yangloudong and defeated them;',
    'In the eleventh month, jiazi, Hu Linyi reported Luo Zinan and Li Xubin defeated Shi Dakai and Wei Jun at Yangloudong;',
  ],
  s0686: [
    'he requested purchase of foreign cannon to strike the bandits.',
    'and asked to buy foreign guns against the rebels.',
  ],
  s0687: [
    'Ye Mingchen was ordered to purchase six hundred foreign cannon and have them transported by water from Hunan to Hubei for use.',
    'Ye Mingchen was told to buy six hundred foreign guns and ship them from Hunan to Hubei.',
  ],
  s0688: [
    'On day xinwei, Gorkha foreigners occupied Jilong in rear Tibet.',
    'On xinwei day, Gorkhas seized Jilong in rear Tibet.',
  ],
  s0689: [
    'Dexing died; Lin Kui was transferred to be Minister of Justice, and Ruilin was made Minister of Rites.',
    'After Dexing\'s death, Lin Kui took Justice and Ruilin took Rites.',
  ],
  s0690: [
    'On day wuzi, Guan Wen memorialized that Xianning and Jinkou had been stormed, and also reported that Jiangxi bandits had taken Yining and ordered Luo Zinan to return to suppress them.',
    'On wuzi day, Guan Wen reported Xianning and Jinkou taken and wanted Luo Zinan recalled when Yining fell.',
  ],
  s0691: [
    'An edict responded: "Luo Zinan is now attacking and suppressing; the Wuhan front is pressing; he must not be recalled for suppression elsewhere."',
    'The throne refused recall: Luo Zinan must stay on the pressing Wuhan front.',
  ],
  s0692: [
    'An edict ordered Zeng Guofan and others to send Zhou Ruyun ahead to Chongyang and Tongcheng as rear support for Luo Zinan.',
    'Zeng Guofan was told to send Zhou Ruyun to Chongyang and Tongcheng to back Luo Zinan.',
  ],
  s0693: [
    'Hechun and others memorialized that Nian bandit Li Zhaoshou had fled into and occupied Yingshan; Circuit Intendant He Guizhen secretly plotted joint capture but failed and died.',
    'Hechun reported Li Zhaoshou holding Yingshan and He Guizhen\'s failed secret ambush in which he died.',
  ],
  s0694: [
    'Twelfth month, day xinmao: the Emperor went to the Hall of Great Height to pray for snow.',
    'In the twelfth month, xinmao, the Emperor prayed for snow at Dagao Hall.',
  ],
  s0695: [
    'On day bingchen, Jiangxi bandits took Linjiang and Ruizhou; Zeng Guofan was ordered to detach troops to suppress them.',
    'On bingchen day, Linjiang and Ruizhou fell and Zeng Guofan was told to send troops.',
  ],
  s0696: [
    'On day wuxu, two hundred thousand piculs of Jiangsu tribute grain were retained to supply the Jiangnan army.',
    'On wuxu day, two hundred thousand piculs of Jiangsu grain were held for the Jiangnan army.',
  ],
  s0697: [
    'On day guimao, Guangxi government troops recovered Xing\'an.',
    'On guimao day, Guangxi forces retook Xing\'an.',
  ],
  s0698: [
    'Guizhou bandit Xu Tingjie took Zhengan and also took parts of Sinan.',
    'Xu Tingjie of Guizhou seized Zhengan and raided Sinan.',
  ],
  s0699: [
    'On day yisi, Wenqing and Ye Mingchen were made grand secretaries; Gui Liang and Peng Yunzhang were ordered to assist as grand secretaries; Boqiu was made Minister of Revenue; Yixiang was made Shengjing general; Yinglong was made Rehe commandant.',
    'On yisi day, Wenqing and Ye Mingchen became grand secretaries with Gui Liang and Peng Yunzhang assisting; Boqiu took Revenue, Yixiang Shengjing, and Yinglong Rehe.',
  ],
  s0700: [
    'On day bingwu, Prince Duanhua of the Zheng lineage was made Manchu commander-in-chief, and Yishan was made Heilongjiang general.',
    'On bingwu day, Prince Duanhua became Manchu commander and Yishan Heilongjiang general.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b07.mjs <translation.json>'
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
