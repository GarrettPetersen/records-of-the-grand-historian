#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.010, Suzong — Shangyuan, famine, coinage, Baoying treasures begin) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal:
      'On jiashen, Puzhou was made Hezhong Prefecture; its prefectural and county officials and appointments were equated with those of the two metropolitan prefectures of Jingzhao and Henan.',
    idiomatic:
      'On jiashen Puzhou became Hezhong Prefecture, with magistrates and staff ranked like Chang\'an and Luoyang.',
  },
  s0402: {
    literal:
      'In the fourth month on jiawu, Li Guangbi memorialized victory over rebels at Huai and Heyang.',
    idiomatic:
      'In the fourth month Li Guangbi reported breaking the rebels at Huai and Heyang.',
  },
  s0403: {
    literal:
      'On jiachen, Minister of Rites and Eastern Capital Regent Wei Zhi was made Minister of Personnel; Heir Apparent Guest of Ceremonies Fang Guan was made Minister of Rites.',
    idiomatic:
      'On jiachen Wei Zhi moved from Rites to Personnel and Fang Guan from the heir\'s household to Rites.',
  },
  s0404: {
    literal:
      'Heir Apparent Guest of Ceremonies and Grand Councillor Zhang Hao was made Left Supernumerary Cavalier Attendant-in-Chief; Heir Apparent Guest of Ceremonies Cui Huan was made Director of the Court of Judicial Review.',
    idiomatic:
      'Zhang Hao became left supernumerary cavalier; Cui Huan became chief of judicial review.',
  },
  s0405: {
    literal:
      'That year there was famine; rice reached one thousand five hundred cash per dou.',
    idiomatic:
      'Famine drove rice to fifteen hundred cash the dou.',
  },
  s0406: {
    literal:
      'On wushen the Xiangzhou army mutinied, killed Military Commissioner Shi Hui, and Subordinate General Zhang Weijin seized the prefecture in rebellion.',
    idiomatic:
      'On wushen Xiangzhou troops killed Shi Hui and Zhang Weijin rebelled and held the city.',
  },
  s0407: {
    literal:
      'On the night of dingsi a comet appeared in the east between the Lodging and Stomach mansions, about four chi long.',
    idiomatic:
      'Dingsi night brought a four-chi comet east between Lodging and Stomach.',
  },
  s0408: {
    literal:
      'On wuwu Right Vice Director Xiao Hua was made Hezhong Intendant and concurrent Vice Censor-in-Chief, with commission as military commissioner and observation commissioner of Tong, Jin, Jiang, and other prefectures.',
    idiomatic:
      'On wuwu Xiao Hua became Hezhong intendant and commissioner over Tong, Jin, Jiang, and the rest.',
  },
  s0409: {
    literal:
      'On jiwei Shaanxi Prefecture Inspector Lai Zhen was made Xiangzhou Prefect and military commissioner of ten prefectures of the southeastern Shannan circuit including Xiang and Deng.',
    idiomatic:
      'On jiwei Lai Zhen took Xiangzhou and ten southeastern Shannan prefectures.',
  },
  s0410: {
    literal:
      'On gengshen Right Feathered Forest Grand General Guo Yingyi was made Shaanxi Prefect and Shaanxi military commissioner and Tong Pass defense commissioner.',
    idiomatic:
      'On gengshen Guo Yingyi became Shaanxi prefect and Tong Pass defender.',
  },
  s0411: {
    literal:
      'On the xinyou new moon of the intercalary fourth month a comet appeared in the west several zhang long.',
    idiomatic:
      'The intercalary fourth month opened with a western comet many zhang long.',
  },
  s0412: {
    literal:
      'On renxu Minister of Rites Fang Guan was made Jinzhou Prefect.',
    idiomatic:
      'On renxu Fang Guan was sent to Jinzhou.',
  },
  s0413: {
    literal:
      'On jiazi an edict made Prince of Peng Jin Grand Military Commissioner of the Hexi circuit, Prince of Yan Qian Grand Military Commissioner of Beiting, Prince of Jing You Longyou, Prince of Qi Chun Shaanxi, Prince of Xing Zhao Fengxiang, and Prince of Shu Si Binning—all without leaving the palace.',
    idiomatic:
      'On jiazi six princes were named grand commissioners of the western circuits but kept within the palace.',
  },
  s0414: {
    literal:
      'On dingmao Taiyuan Intendant Wang Sili was promoted to Minister of Works.',
    idiomatic:
      'On dingmao Wang Sili of Taiyuan became Minister of Works.',
  },
  s0415: {
    literal:
      'On jiaxu the Prince of Zhao Xi, supreme commander of all armies, was re-enfeoffed Prince of Yue.',
    idiomatic:
      'On jiaxu Prince of Zhao Xi became Prince of Yue.',
  },
  s0416: {
    literal:
      'On jimao, because of strange stars in the sky, the emperor went to Mingfeng Gate, proclaimed a great amnesty, and changed the era from Qianyuan to Shangyuan.',
    idiomatic:
      'On jimao omens drove him to Mingfeng Gate for amnesty and the era became Shangyuan.',
  },
  s0417: {
    literal:
      'Duke Taigong Wang of Zhou was posthumously enfeoffed Duke of Martial Accomplishment, with a temple established by the precedent of Duke Wenxuan of Culture.',
    idiomatic:
      'Taigong Wang of Zhou was enfeoffed Duke of Martial Accomplishment with a temple like Confucius.',
  },
  s0418: {
    literal:
      'At that time dense fog hung; from the fourth month rain fell without cease through the intercalary month.',
    idiomatic:
      'Great fog and rain from the fourth month through the intercalary month never stopped.',
  },
  s0419: {
    literal:
      'Rice soared in price; men ate one another, and the starved lay heaped on the roads.',
    idiomatic:
      'Rice soared; cannibalism spread and corpses choked the roads.',
  },
  s0420: {
    literal:
      'On renwu Minister of Justice Wang Yu was made Director of the Court of Imperial Sacrifices; Right Supernumerary Cavalier Attendant-in-Chief Han Zelin was made Minister of Rites.',
    idiomatic:
      'On renwu Wang Yu took the sacrifices directorate and Han Zelin took Rites.',
  },
  s0421: {
    literal:
      'In the fifth month on gengyin the new moon.',
    idiomatic:
      'The fifth month opened on gengyin.',
  },
  s0422: {
    literal:
      'On bingwu the Grand Preceptor of the Heir Apparent and Duke of Han Miao Jinqing was made Palace Attendant.',
    idiomatic:
      'On bingwu Miao Jinqing became palace attendant.',
  },
  s0423: {
    literal:
      'On renzi Yellow Gate Vice Director and Grand Councillor of the third rank Lü Yin was made Heir Apparent Guest of Ceremonies and removed from governing affairs.',
    idiomatic:
      'On renzi Lü Yin left the council for the heir\'s household.',
  },
  s0424: {
    literal:
      'On guichou Henan Intendant Liu Yan was made Vice Minister of Revenue and charged with revenue, coinage, and salt-iron affairs.',
    idiomatic:
      'On guichou Liu Yan took Revenue and the salt-iron portfolio.',
  },
  s0425: {
    literal:
      'That night the moon occulted the Hairy Head constellation.',
    idiomatic:
      'That night the moon covered Hairy Head.',
  },
  s0426: {
    literal:
      'In the sixth month on yichou an edict ordered that the newly cast heavy-rim coins worth fifty be reduced to thirty;',
    idiomatic:
      'In the sixth month heavy fifty-cash coins were cut to thirty;',
  },
  s0427: {
    literal:
      'Kaiyuan coins should pass at ten.',
    idiomatic:
      'and Kaiyuan coins at ten.',
  },
  s0428: {
    literal:
      'In the seventh month on jichou the new moon.',
    idiomatic:
      'The seventh month opened on jichou.',
  },
  s0429: {
    literal:
      'On dingwei the Retired Emperor moved from Xingqing Palace to the western inner palace.',
    idiomatic:
      'On dingwei the retired emperor left Xingqing for the western palace.',
  },
  s0430: {
    literal:
      'On bingchen Opening Office Director Gao Lishi was banished to Wuzhou;',
    idiomatic:
      'On bingchen Gao Lishi was exiled to Wuzhou;',
  },
  s0431: {
    literal:
      'Palace Attendant Wang Chengen to Bozhou, Wei Yue to Qinzhou;',
    idiomatic:
      'Wang Chengen to Bo, Wei Yue to Qin;',
  },
  s0432: {
    literal:
      'Left Dragon Martial Grand General Chen Xuanli retired from office.',
    idiomatic:
      'and Chen Xuanli of the Dragon Martial Guard retired.',
  },
  s0433: {
    literal:
      'On bingchen Censor-in-Chief Cui Qi died.',
    idiomatic:
      'That same bingchen day Censor-in-Chief Cui Qi died.',
  },
  s0434: {
    literal:
      'In the eighth month on xinwei Minister of Personnel Wei Zhi died.',
    idiomatic:
      'In the eighth month Wei Zhi of Personnel died.',
  },
  s0435: {
    literal:
      'On dingchou Heir Apparent Guest of Ceremonies Lü Yin was made Grand Protector of Jingzhou and military commissioner of Li, Lang, Xia, Zhong, and five other prefectures.',
    idiomatic:
      'On dingchou Lü Yin became Jingzhou protector over five river prefectures.',
  },
  s0436: {
    literal:
      'On jimao Director of Palace Construction Wang Ang was made Hezhong Intendant and military commissioner of Jin and Jiang in that prefecture.',
    idiomatic:
      'On jimao Wang Ang took Hezhong and its Jin-Jiang command.',
  },
  s0437: {
    literal:
      'On dinghai the late Prince of Xing Zhao was posthumously enfeoffed Respectful and Graceful Crown Prince.',
    idiomatic:
      'On dinghai the late Prince Zhao was named Respectful and Graceful Crown Prince.',
  },
  s0438: {
    literal:
      'In the ninth month on jiawu Jingzhou was made the southern capital, the prefecture called Jiangling Prefecture, and official appointments equated with Jingzhao.',
    idiomatic:
      'In the ninth month Jingzhou became southern capital Jiangling, ranked with Chang\'an.',
  },
  s0439: {
    literal:
      'Shu Commandery, formerly the southern capital, should revert to Shu Commandery.',
    idiomatic:
      'Shu, once southern capital, reverted to Shu Commandery.',
  },
  s0440: {
    literal:
      'In the tenth month on renshen Luzhou Prefecture Inspector Zhao Liangbi was made Yuezhou Prefect and Zhejiang East Circuit military commissioner;',
    idiomatic:
      'In the tenth month Zhao Liangbi became Yue prefect and Zhejiang East commissioner;',
  },
  s0441: {
    literal:
      'Qingzhou Prefecture Inspector Yin Zhongqing was made Zi Prefect and military commissioner of Zi, Yi, Cang, De, Di, and other prefectures.',
    idiomatic:
      'Yin Zhongqing became Zi prefect over the eastern Shandong coast.',
  },
  s0442: {
    literal:
      'On jiashen Vice Minister of War Shang Heng was made Qingzhou Prefect and military commissioner of Qing, Deng, and other prefectures.',
    idiomatic:
      'On jiashen Shang Heng took Qingzhou and the Deng coast.',
  },
  s0443: {
    literal:
      'In the eleventh month on yisi Li Guangbi memorialized recovery of Huai Prefecture.',
    idiomatic:
      'In the eleventh month Li Guangbi reported Huai Prefecture retaken.',
  },
  s0444: {
    literal:
      'Songzhou Prefecture Inspector Liu Zhan went to take up his post at Yangzhou; Yangzhou Chief Administrator Deng Jingshan resisted with troops and was defeated; Zhan advanced and seized Yang, Run, Sheng, and other prefectures.',
    idiomatic:
      'Liu Zhan marched on Yangzhou, beat Deng Jingshan, and seized Yang, Run, and Sheng.',
  },
  s0445: {
    literal:
      'In the twelfth month on gengchen Right Feathered Forest Army Grand General Li Ding was made Fengxiang Intendant and military commissioner of Xing, Feng, and Long prefectures.',
    idiomatic:
      'In the twelfth month Li Ding became Fengxiang intendant over Longyou.',
  },
  s0446: {
    literal:
      'On the night of guiwei the Year Star occulted the Room mansion.',
    idiomatic:
      'Guiwei night the Year Star covered Room.',
  },
  s0447: {
    literal:
      'In spring of the first month of the second year of Shangyuan, on dinghai the new moon.',
    idiomatic:
      'Shangyuan 2 opened in spring on dinghai.',
  },
  s0448: {
    literal:
      'On xinmao Wenzhou Prefecture Inspector Ji Guangchen was made Xuanzhou Prefect and Zhejiang West Circuit military commissioner.',
    idiomatic:
      'On xinmao Ji Guangchen took Xuanzhou and Zhejiang West.',
  },
  s0449: {
    literal:
      'On jiawu the emperor was unwell; Empress Zhang drew blood to copy a Buddhist sutra.',
    idiomatic:
      'On jiawu the emperor fell ill and Empress Zhang copied a sutra in her blood.',
  },
  s0450: {
    literal:
      'On jiayin an edict ordered prefectures, counties, the Censorate, and the Court of Judicial Review to review prisoners in custody; death sentences were reduced to exile, and those at exile or below were all released.',
    idiomatic:
      'On jiayin courts reviewed prisoners: death became exile, lesser crimes freed.',
  },
  s0451: {
    literal:
      'On yimao Pinglu army commander Tian Shenggong captured Liu Zhan alive; Yang and Run were pacified.',
    idiomatic:
      'On yimao Tian Shenggong took Liu Zhan alive and pacified Yang and Run.',
  },
  s0452: {
    literal:
      'On jiwei the Tangut raided Baoji, entered San Pass, seized Feng Prefecture, and killed Prefect Xiao Xinyi; Fengxiang Li Ding intercepted them.',
    idiomatic:
      'On jiwei Tangut raiders took Feng Prefecture and killed Xiao Xinyi until Li Ding of Fengxiang struck back.',
  },
  s0453: {
    literal:
      'On guihai Fengxiang Intendant Cui Guangyuan was made Chengdu Intendant and Jiannan military, revenue, and farming commissioner; Heir Apparent Household Superintendent and Duke of Zhao Cui Yuan was made Grand Protector of Yangzhou and Huainan observation commissioner.',
    idiomatic:
      'On guihai Cui Guangyuan went to Chengdu and Cui Yuan to Yangzhou over Huainan.',
  },
  s0454: {
    literal:
      'On the night of xinwei there was a total eclipse of the moon.',
    idiomatic:
      'Xinwei night brought a total lunar eclipse.',
  },
  s0455: {
    literal:
      'On wuyin Li Guangbi led fifty thousand troops of Heyang and fought the host of Shi Siming at North Mang; the government army was defeated.',
    idiomatic:
      'On wuyin Li Guangbi’s fifty thousand met Shi Siming at North Mang and lost.',
  },
  s0456: {
    literal:
      'Guangbi and Pugu Huaien fled to defend Wenxi; Yu Chaoen and Wei Boyu fled to defend Shaanxi; Heyang and Huai fell to the rebels, and the capital was placed on alert.',
    idiomatic:
      'Guangbi and Pugu Huaien fled to Wenxi; Yu Chaoen and Wei Boyu to Shaanxi; Heyang and Huai fell and Chang\'an alarmed.',
  },
  s0457: {
    literal:
      'On guiwei Vice Director of the Secretariat and Grand Councillor Li Kui was demoted to Chief Administrator of Yuan Prefecture.',
    idiomatic:
      'On guiwei Li Kui was demoted to Yuan prefect.',
  },
  s0458: {
    literal:
      'Former Hezhong Intendant Xiao Hua was made Vice Director of the Secretariat, Grand Councillor, Grand Academician of the Hall of Assembled Worthies and Hall of Cultivated Literature, and charged with compiling the national history.',
    idiomatic:
      'Former Hezhong intendant Xiao Hua joined the council and took the national history.',
  },
  s0459: {
    literal:
      'In the third month on jiazi Shi Chaoyi led troops in a night raid on our Shaanxi; Wei Boyu met and defeated them.',
    idiomatic:
      'In the third month Chaoyi raided Shaanxi by night and Wei Boyu beat him off.',
  },
  s0460: {
    literal:
      'On wuxu Shi Siming was killed by his son Chaoyi.',
    idiomatic:
      'On wuxu Siming fell to his son Chaoyi’s hand.',
  },
  s0461: {
    literal:
      'Li Guangbi, for breach of discipline, yielded the posts of Grand Marshal and Director of the Secretariat-Chancellery; permission was granted, and he was made Palace Attendant, Hezhong Intendant, and military commissioner of Jin and Jiang.',
    idiomatic:
      'Li Guangbi resigned marshal and chancellor for defeat and took Hezhong and Jin-Jiang.',
  },
  s0462: {
    literal:
      'In summer, the fourth month on yihai the new moon, Heir Apparent Prince of Qi Zhen was found guilty, degraded to commoner, and settled at Qin Prefecture.',
    idiomatic:
      'Summer, fourth month: Prince of Qi Zhen was degraded to commoner and sent to Qin.',
  },
  s0463: {
    literal:
      'Dou Rubing and Cui Chang were executed by association; Son-in-Law Commandant Yang Hui and Xue Lüqian were granted death by their own hand; Left Supernumerary Cavalier Zhang Hao was demoted to Registrar of Chen Prefecture.',
    idiomatic:
      'Associates were executed; Yang Hui and Xue Lüqian killed themselves; Zhang Hao was sent to Chen as registrar.',
  },
  s0464: {
    literal:
      'On jiwei Vice Minister of Personnel Pei Zunqing was made Vice Director of the Yellow Gate and Grand Councillor.',
    idiomatic:
      'On jiwei Pei Zunqing joined the council from Personnel.',
  },
  s0465: {
    literal:
      'Qingzhou Prefect Shang Heng and Yanzhou Prefect Neng Yuanhao both memorialized victories over rebels.',
    idiomatic:
      'Shang Heng of Qing and Neng Yuanhao of Yan both reported rebel victories.',
  },
  s0466: {
    literal:
      'On renwu Zizhou Prefect Duan Zizhang rebelled, stormed and took Suizhou, and killed Prefect Heir Apparent Prince of Guo Ju.',
    idiomatic:
      'On renwu Duan Zizhang rebelled, took Suizhou, and killed Prince of Guo Ju.',
  },
  s0467: {
    literal:
      'Dongchuan Military Commissioner Li Huan was defeated in battle and fled to Chengdu.',
    idiomatic:
      'Li Huan of Dongchuan was beaten and fled to Chengdu.',
  },
  s0468: {
    literal:
      'In the fifth month on jiawu rebel general Linghu Zhang of Hua Prefecture surrendered Hua to the court; Zhang was made Vice Censor-in-Chief and continued as Hua Prefect and military commissioner of six prefectures including Hua, Wei, De, Bei, and Xiang.',
    idiomatic:
      'In the fifth month Linghu Zhang of Hua surrendered and kept six prefectures.',
  },
  s0469: {
    literal:
      'On yiwei Jiannan Military Commissioner Cui Guangyuan led troops with Li Huan to defeat Duan Zizhang at Mian Prefecture, captured Zizhang, and executed him.',
    idiomatic:
      'On yiwei Cui Guangyuan and Li Huan beat Duan Zizhang at Mian and executed him.',
  },
  s0470: {
    literal:
      'Mian Prefecture was pacified.',
    idiomatic:
      'Mian was pacified.',
  },
  s0471: {
    literal:
      'Li Guangbi came to court and was promoted Grand Marshal and concurrent Palace Attendant, made Deputy Supreme Commander of Henan, overall commander of the five circuits of Henan, Huainan, and southeastern Shannan, stationed at Linhuai.',
    idiomatic:
      'Li Guangbi came to court as grand marshal and deputy Henan commander, stationed at Linhuai.',
  },
  s0472: {
    literal:
      'Northern Capital Regent, Acting Minister of Works, Taiyuan Intendant, Hedong Deputy Military Commissioner, and Duke of Huo Wang Sili died.',
    idiomatic:
      'Wang Sili of Taiyuan and Hedong died.',
  },
  s0473: {
    literal:
      'On xinchou Director of the Court of Imperial Entertainments and Duke of Zhao Guan Chongsi was made Taiyuan Intendant and concurrent Censor-in-Chief, Northern Capital Regent, and Hedong Deputy Military Commissioner.',
    idiomatic:
      'On xinchou Guan Chongsi took Taiyuan and Hedong.',
  },
  s0474: {
    literal:
      'Junior Preceptor of the Heir Apparent and Director of the Court of the Imperial Clan Li Qiwu died.',
    idiomatic:
      'Li Qiwu, heir\'s tutor and clan director, died.',
  },
  s0475: {
    literal:
      'In the sixth month on guichou the new moon.',
    idiomatic:
      'The sixth month opened on guichou.',
  },
  s0476: {
    literal:
      'On jimao Fengxiang Intendant Li Ding was made Bin Prefect and Longyou military and farming commissioner.',
    idiomatic:
      'On jimao Li Ding went to Bin and Longyou.',
  },
  s0477: {
    literal:
      'In autumn, the seventh month on guiwei the new moon, there was a total eclipse of the sun.',
    idiomatic:
      'Autumn’s seventh month opened with a total eclipse.',
  },
  s0478: {
    literal:
      'Great stars all appeared.',
    idiomatic:
      'Great stars shone by day.',
  },
  s0479: {
    literal:
      'On jiachen jade fungus of three blooms on one stem grew on a beam of the Yanying Hall; the emperor composed "Ode to the Jade Spirit Fungus."',
    idiomatic:
      'On jiachen three-bloom jade fungus grew on Yanying Hall and the emperor wrote an ode.',
  },
  s0480: {
    literal:
      'In the eighth month on guichou the new moon, the eunuch Li Fuguo was made Minister of War; at the Ministry he was seen off by councillors and all officials, and feasting lasted the whole day.',
    idiomatic:
      'The eighth month opened with Li Fuguo made War Minister and fêted all day at the ministry.',
  },
  s0481: {
    literal:
      'From the seventh month rain had fallen; only now did it stop; walls were largely ruined and fish were netted in the streets.',
    idiomatic:
      'Rain since the seventh month ended at last; walls crumbled and fish swam the streets.',
  },
  s0482: {
    literal:
      'On xinsi Palace Director Li Ruoyou was made Minister of Revenue and Shuo-fang, northwest, Chen, and Zheng military commissioner, stationed at Jiang Prefecture; he was granted the name Guozhen.',
    idiomatic:
      'On xinsi Li Ruoyou became Revenue minister and northwest commissioner at Jiang, renamed Guozhen.',
  },
  s0483: {
    literal:
      'In the ninth month on renwu the new moon.',
    idiomatic:
      'The ninth month opened on renwu.',
  },
  s0484: {
    literal:
      'On renchen Heir Apparent Guest of Ceremonies and Academician of the Hall of Assembled Worthies Han Zelin, Baron of Changli, was made Minister of Rites.',
    idiomatic:
      'On renchen Han Zelin of the heir\'s household took Rites.',
  },
  s0485: {
    literal:
      'On renyin an edict was promulgated.',
    idiomatic:
      'On renyin the throne issued an edict.',
  },
  s0486: {
    literal:
      'On renshen Heir Apparent Prince of Ning Di died.',
    idiomatic:
      'On renshen Prince of Ning Di died.',
  },
  s0487: {
    literal:
      'On guiyou Deputy Supreme Commander of Henan Li Guangbi defeated rebels below Xuzhou city and recovered Xuzhou.',
    idiomatic:
      'On guiyou Li Guangbi beat the rebels at Xuzhou and retook the city.',
  },
  s0488: {
    literal:
      'In the jian-chen month on gengchen the new moon.',
    idiomatic:
      'The jian-chen month opened on gengchen.',
  },
  s0489: {
    literal:
      'On renwu an edict ordered that all prisoners now in custody, regardless of gravity, be released.',
    idiomatic:
      'On renwu all prisoners in custody were freed regardless of crime.',
  },
  s0490: {
    literal:
      'On the night of bingxu the moon wore a white corona.',
    idiomatic:
      'Bingxu night the moon wore a white crown.',
  },
  s0491: {
    literal:
      'On guisi Xiangzhou Prefect Lai Zhen was made An Prefect and military commissioner of sixteen Huai-west prefectures including Shen, An, Qi, Huang, and Mian.',
    idiomatic:
      'On guisi Lai Zhen took An and sixteen Huai-west prefectures.',
  },
  s0492: {
    literal:
      'On jiawu the Tangut chieftain Nuci raided Liang Prefecture; Prefect Li Mian abandoned the commandery and fled.',
    idiomatic:
      'On jiawu Tangut Nuci raided Liang and Li Mian fled.',
  },
  s0493: {
    literal:
      'On bingshen the Tangut raided Fengtian.',
    idiomatic:
      'On bingshen Tangut raiders struck Fengtian.',
  },
  s0494: {
    literal:
      'The emperor was unwell; the hundred officials fasted and offered monks at Buddhist temples.',
    idiomatic:
      'The emperor was ill; officials fasted and fed monks at temples.',
  },
  s0495: {
    literal:
      'On dingwei an edict ordered that all demoted and exiled officials be released and restored.',
    idiomatic:
      'On dingwei all demoted and exiled men were restored.',
  },
  s0496: {
    literal:
      'Vice Director of the Secretariat, Grand Councillor, and Duke of Xu Xiao Hua was made Minister of Rites and removed from governing affairs.',
    idiomatic:
      'Xiao Hua left the council for Rites.',
  },
  s0497: {
    literal:
      'Vice Minister of Revenue Yuan Zai was made Grand Councillor; Minister of Rites Han Zelin was made Grand Preceptor of the Heir Apparent.',
    idiomatic:
      'Yuan Zai joined the council; Han Zelin became the heir\'s grand preceptor.',
  },
  s0498: {
    literal:
      'In the jian-si month of Baoying 1 on gengxu the new moon.',
    idiomatic:
      'Baoying 1 opened in the jian-si month on gengxu.',
  },
  s0499: {
    literal:
      'On renzi Chuzhou Prefecture Inspector Cui Qian presented thirteen treasures of the realm: first, the Black-and-Yellow Heavenly Talisman, like a tablet, eight cun long and three cun wide, round above and square below, nearly round with a hole, of yellow jade.',
    idiomatic:
      'On renzi Cui Qian of Chuzhou offered thirteen state treasures: first, the Black-and-Yellow Heavenly Talisman—tablet-shaped yellow jade, eight by three cun.',
  },
  s0500: {
    literal:
      'Second: the jade cock, its feather pattern complete, of white jade.',
    idiomatic:
      'Second, a white-jade cock with every feather marked.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/010.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '010') {
  throw new Error(`Expected chapter 010, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')})`);
