#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Grand Secretary Tuojin, who was on leave, died.',
    'Grand Secretary Tuojin died while on leave.',
  ],
  s0402: [
    'That month, ration grain was issued to disaster victims in five Shanxi prefectures and counties including Yangqu, Yuezhou Guard in Hunan, and thirteen Zhejiang prefectures and counties including Haining.',
    'That month, disaster rations went to Yangqu and four other Shanxi districts, Yuezhou Guard, and Haining and twelve other Zhejiang counties.',
  ],
  s0403: [
    'Granary grain was loaned to troops of the Fengtian Jinzhou naval camp.',
    'Fengtian\'s Jinzhou naval camp received a granary grain loan.',
  ],
  s0404: [
    'New and old quota levies and miscellaneous items were remitted or deferred for fourteen Hunan prefectures, counties, and guards including Huarong and thirty-one Zhejiang prefectures, counties, and guards including Haining.',
    'Quota and miscellaneous taxes were remitted or deferred for Huarong and thirteen other Hunan districts and Haining and thirty other Zhejiang districts.',
  ],
  s0405: [
    'Eleventh month, day wuxu: the Emperor visited Grand Secretary Tuojin\'s residence to bestow funeral gifts.',
    'In month 11, wuxu, the Emperor condoled at Tuojin\'s home with imperial gifts.',
  ],
  s0406: [
    'That month, ration grain was issued to poor areas in three places including Jilin.',
    'That month, three poor districts including Jilin received ration grain.',
  ],
  s0407: [
    'Twelfth month, day jiwei: the Emperor again went to the Dagao Hall to pray for snow.',
    'In month 12, jiwei, the Emperor again prayed for snow at Dagao Hall.',
  ],
  s0408: [
    'On day yichou, the coffins of Empress Xiaomu and Empress Xiaoshen were installed in the underground palace.',
    'On yichou day, Empresses Xiaomu and Xiaoshen were interred in the underground palace.',
  ],
  s0409: [
    'On day yihai, Leshan was made Jilin general.',
    'On yihai day, Leshan became Jilin general.',
  ],
  s0410: [
    'That month, troop pay was loaned to the Jiangsu provincial standard and the city-garrison and Liuhe river camps in disaster zones.',
    'That month, Jiangsu provincial and garrison troops in disaster zones received pay loans.',
  ],
  s0411: [
    'Quota levies for Songtao department in Guizhou were remitted or deferred because of flooding.',
    'Songtao\'s flood quota taxes were remitted or deferred.',
  ],
  s0412: [
    'That year, Korea and Ryukyu sent tribute.',
    'That year, Korea and Ryukyu paid tribute.',
  ],
  s0413: [
    'Year 16, spring, first month, day yiwei: Cherendorji was made commissioner for Urga Mongol affairs.',
    'In spring of year 16, yiwei, Cherendorji became Urga Mongol commissioner.',
  ],
  s0414: [
    'On day renyin, fifty thousand taels from the Shandong provincial treasury were allocated to relieve famine in Deng, Lai, and Qing prefectures.',
    'On renyin day, fifty thousand Shandong treasury taels relieved famine in Deng, Lai, and Qing.',
  ],
  s0415: [
    'On day yisi, Yutai was transferred to Hunan governor.',
    'On yisi day, Yutai became Hunan governor.',
  ],
  s0416: [
    'He Changling was made Guizhou governor.',
    'He Changling became Guizhou governor.',
  ],
  s0417: [
    'That month, relief was given for flood and drought disasters in three Zhejiang counties including Yiwu.',
    'That month, Yiwu and two other Zhejiang counties received flood-and-drought relief.',
  ],
  s0418: [
    'Ration grain was issued to banner people in Fengtian districts including Guangning that had suffered flooding.',
    'Flood-hit banner people in Guangning and other Fengtian districts received rations.',
  ],
  s0419: [
    'Ration grain, seed grain, and granary grain were loaned for flood, drought, hail, and other disasters to fourteen Gansu prefectures and counties including Jinzhou, fifty-one Jiangxi departments and counties including Lianhua, nine Shaanxi prefectures and departments including Jiazhou, four Hunan prefectures and counties including Lizhou, and fifteen Shanxi prefectures and counties including Baode.',
    'Disaster loans of rations and seed went to Jinzhou and thirteen other Gansu districts, Lianhua and fifty other Jiangxi districts, Jiazhou and eight other Shaanxi districts, Lizhou and three other Hunan districts, and Baode and fourteen other Shanxi districts.',
  ],
  s0420: [
    'Second month, day bingchen: Zhou Zhiqi was transferred to Hubei governor.',
    'In month 2, bingchen, Zhou Zhiqi became Hubei governor.',
  ],
  s0421: [
    'Chen Luan was made Jiangxi governor.',
    'Chen Luan became Jiangxi governor.',
  ],
  s0422: [
    'On day jiwei, for the visit to the Eastern Tombs, Prince Su and others were left in the capital to handle affairs.',
    'On jiwei day, Prince Su and others stayed in Beijing for the Eastern Tombs visit.',
  ],
  s0423: [
    'On day jisi, the Emperor reviewed troops of the Firearms Camp.',
    'On jisi day, the Emperor reviewed the Firearms Camp.',
  ],
  s0424: [
    'On day guiyou, the Emperor visited the Eastern Tombs and remitted one-third of quota levies in passed areas.',
    'On guiyou day, the Emperor visited the Eastern Tombs and remitted one-third of passed-area quota tax.',
  ],
  s0425: [
    'On day bingzi, the Emperor paid rites at the Western Zhao Tombs, Xiaoling, Xiao East Tombs, Jing Tomb, and Yu Tomb.',
    'On bingzi day, the Emperor worshipped at the Western Zhao, Xiaoling, Xiao East, Jing, and Yu tombs.',
  ],
  s0426: [
    'In Wugong prefecture, Hunan, bandits Lan Zhengzun and others rebelled; Wu Rongguang was ordered to join Ne\'erjing\'e in suppressing them.',
    'Wugong bandits led by Lan Zhengzun rebelled; Wu Rongguang and Ne\'erjing\'e were ordered to suppress them.',
  ],
  s0427: [
    'On day wuyin, arrears at Fanbian department in Sichuan were remitted.',
    'On wuyin day, Fanbian department\'s arrears were forgiven.',
  ],
  s0428: [
    'On day jimao, the Emperor returned to the capital.',
    'On jimao day, the Emperor returned to Beijing.',
  ],
  s0429: [
    'Summer, fourth month, day guihai: Liang Zhangju was made Guangxi governor.',
    'In the fourth month, guihai, Liang Zhangju became Guangxi governor.',
  ],
  s0430: [
    'On day dingchou, Lin Hongnian and one hundred seventy-two others were granted jinshi degrees and metropolitan graduate status with distinctions.',
    'On dingchou day, Lin Hongnian and 172 others received jinshi and metropolitan degrees with distinctions.',
  ],
  s0431: [
    'That month, ration grain was loaned to eight Gansu prefectures and counties including Qinzhou that had suffered disasters.',
    'That month, Qinzhou and seven other Gansu districts received disaster ration loans.',
  ],
  s0432: [
    'Fifth month, day bingshen: the Emperor went to the Black Dragon Pool to pray for rain.',
    'In month 5, bingshen, the Emperor prayed for rain at the Black Dragon Pool.',
  ],
  s0433: [
    'On day wuxu, Minister of Rites Wang Shouhe died; Wu Chun was made Minister of Rites and Li Zongfang left censor-in-chief.',
    'On wuxu day, Wang Shouhe died; Wu Chun took Rites and Li Zongfang the Censorate\'s left chief.',
  ],
  s0434: [
    'On day dingwei, the Emperor went to the Dragon King Temple at Jingming Garden to pray for rain.',
    'On dingwei day, the Emperor prayed for rain at Jingming Garden\'s Dragon King Temple.',
  ],
  s0435: [
    'That month, ration grain was loaned to poor victims in Baodi county, Zhili.',
    'That month, Baodi\'s poor disaster victims received ration loans.',
  ],
  s0436: [
    'Autumn, seventh month, day guiwei: Zhong Xiang was made Fujian-Zhejiang governor-general and Jinge Bu Shandong governor.',
    'In the seventh month, guiwei, Zhong Xiang took Fujian-Zhejiang and Jinge Bu Shandong.',
  ],
  s0437: [
    'On day yiyou, because Hafeng\'a reported Metropolitan Banner commandant Gao Kanai\'s interference in official business by letter, Gao was given the added title Grand Guardian of the Heir Apparent.',
    'On yiyou day, Hafeng\'a exposed Gao Kanai\'s interference and Gao received an added Grand Guardian title.',
  ],
  s0438: [
    'On day jichou, Gao Kanai was dismissed from office and banished to Rehe.',
    'On jichou day, Gao Kanai lost his post and was sent to Rehe.',
  ],
  s0439: [
    'On day bingshen, Grand Secretary Wen Fu retired from office.',
    'On bingshen day, Grand Secretary Wen Fu retired.',
  ],
  s0440: [
    'On day gengzi, Muzhang\'a was made grand secretary supervising the Ministry of Works; Qishan was made associate grand secretary while remaining Zhili governor-general.',
    'On gengzi day, Muzhang\'a became grand secretary over Works and Qishan associate grand secretary while staying Zhili governor-general.',
  ],
  s0441: [
    'Qiying was transferred to Minister of Personnel, Yihao to Minister of Revenue, Xi\'en to Minister of War, Wuzhong\'e to Minister of the Court of Colonial Affairs, Kaiyinbu to left censor-in-chief, and Leshan to Chahar commander-in-chief.',
    'Qiying took Personnel, Yihao Revenue, Xi\'en War, Wuzhong\'e colonial affairs, Kaiyinbu the left censorate, and Leshan Chahar.',
  ],
  s0442: [
    'On day renyin, Enming was dismissed as minister and banner commander; Zhao Shengkui was dismissed as Grand Councilor and vice minister.',
    'On renyin day, Enming lost his minister and command posts and Zhao Shengkui left the Grand Council and a vice ministry.',
  ],
  s0443: [
    'Guiqing was made Minister of Rites.',
    'Guiqing became Minister of Rites.',
  ],
  s0444: [
    'Ninth month, day renchen: Funiyang\'a was made Shaanxi governor and Lian Jing Urumqi commander-in-chief.',
    'In month 9, renchen, Funiyang\'a took Shaanxi and Lian Jing Urumqi.',
  ],
  s0445: [
    'On day gengzi, the Emperor reviewed troops of the Jianrui Camp.',
    'On gengzi day, the Emperor reviewed the Jianrui Camp.',
  ],
  s0446: [
    'On day wushen, three halls of the Old Summer Palace burned.',
    'On wushen day, three Old Summer Palace halls burned.',
  ],
  s0447: [
    'On day jiyou, because Qiying had accepted a eunuch\'s entrustment, he was stripped of his posts as minister, banner commander, and Grand Minister of the Imperial Household.',
    'On jiyou day, Qiying lost his minister, command, and household posts for taking a eunuch\'s entrustment.',
  ],
  s0448: [
    'Yi Jing was made Minister of Personnel and Baoxing Shengjing general.',
    'Yi Jing took Personnel and Baoxing became Shengjing general.',
  ],
  s0449: [
    'Left Censor-in-Chief Kaiyinbu was transferred to Chengdu general and Jingzheng replaced him.',
    'Kaiyinbu went to Chengdu and Jingzheng took the left censorate.',
  ],
  s0450: [
    'That month, disaster victims were relieved in White Banner Fort and other places in Shengjing, eleven Shanxi prefectures and departments including Shuozhou, and Songtao department in Guizhou.',
    'That month, Shengjing, Shuozhou and ten other Shanxi districts, and Songtao received disaster relief.',
  ],
  s0451: [
    'Relief for disaster victims in Shenmu county, Shaanxi, was extended.',
    'Shaanxi\'s Shenmu disaster relief was extended.',
  ],
  s0452: [
    'New and old quota levies were remitted for eleven Shanxi prefectures and departments including Shuozhou and subjects of Yulin prefecture in Shaanxi that had suffered disasters.',
    'Disaster quota taxes were remitted for Shuozhou and ten other Shanxi districts and Yulin subordinates in Shaanxi.',
  ],
  s0453: [
    'Winter, tenth month, day bingchen: Changqing was given the added title Grand Guardian of the Heir Apparent.',
    'In the tenth month, bingchen, Changqing received an added Grand Guardian title.',
  ],
  s0454: [
    'Ration grain, granary grain, and seed grain were loaned to eight Gansu prefectures and counties including Jingzhou and to Shanyin county, Shanxi, for disaster and poor harvest.',
    'Jingzhou and seven other Gansu districts and Shanyin received disaster loans of rations and seed.',
  ],
  s0455: [
    'New and old quota levies for flood and drought disasters were remitted or deferred in twelve Zhili prefectures and counties including Jingzhou.',
    'Flood-and-drought quota taxes were remitted or deferred for Jingzhou and eleven other Zhili districts.',
  ],
  s0456: [
    'Eleventh month, day renwu: Jingzheng was made Minister of Works; Wuzhong\'e was transferred to left censor-in-chief; Yi Ji was made Minister of the Court of Colonial Affairs.',
    'In month 11, renwu, Jingzheng took Works, Wuzhong\'e the left censorate, and Yi Ji colonial affairs.',
  ],
  s0457: [
    'On day guimao, the Emperor went to the Dagao Hall to pray for snow.',
    'On guimao day, the Emperor prayed for snow at Dagao Hall.',
  ],
  s0458: [
    'That month, ration grain was issued for frost and hail disasters in four Shaanxi counties including Fugu.',
    'That month, Fugu and three other Shaanxi counties received frost-and-hail rations.',
  ],
  s0459: [
    'Quota levies were remitted or deferred for three Zhili prefectures and counties including Anzhou that had suffered flooding.',
    'Flood quota taxes were remitted or deferred for Anzhou and two other Zhili districts.',
  ],
  s0460: [
    'Twelfth month, day dingyou: the Emperor again went to the Dagao Hall to pray for snow.',
    'In month 12, dingyou, the Emperor again prayed for snow at Dagao Hall.',
  ],
  s0461: [
    'On day guihai, it snowed.',
    'On guihai day, snow fell.',
  ],
  s0462: [
    'That year, Korea and Siam sent tribute.',
    'That year, Korea and Siam paid tribute.',
  ],
  s0463: [
    'Year 17, spring, first month, new moon on day jimao: Yi Ji was made imperial front minister.',
    'At the year-17 spring new moon, jimao, Yi Ji became imperial front minister.',
  ],
  s0464: [
    'Changqing was rewarded with a four-open python robe.',
    'Changqing received a four-open python robe.',
  ],
  s0465: [
    'Pan Shien was given the added title Grand Guardian of the Heir Apparent.',
    'Pan Shien received an added Grand Guardian title.',
  ],
  s0466: [
    'On day renchen, Minister of War Wang Zongcheng died; Zhu Shiyan replaced him.',
    'On renchen day, Wang Zongcheng died and Zhu Shiyan took War.',
  ],
  s0467: [
    'On day dingyou, in Weixian, Shandong, teaching-sect rebels Ma Gang and others rose; they were captured.',
    'On dingyou day, Weixian teaching rebels led by Ma Gang were captured.',
  ],
  s0468: [
    'On day gengzi, Ne\'erjing\'e was demoted from Hunan governor; Lin Zexu was made Huguang governor-general; Chen Luan was transferred to Jiangsu governor and Yutai to Jiangxi governor.',
    'On gengzi day, Ne\'erjing\'e lost Hunan, Lin Zexu took Huguang, Chen Luan Jiangsu, and Yutai Jiangxi.',
  ],
  s0469: [
    'That month, granary grain, ration grain, and seed grain were loaned for flood, drought, locust, hail, and frost disasters to eleven Shanxi prefectures and departments including Shuozhou, nine Shaanxi prefectures and counties including Jiazhou, and thirteen Gansu prefectures and counties including Jinzhou.',
    'That month, Shuozhou and ten other Shanxi districts, Jiazhou and eight other Shaanxi districts, and Jinzhou and twelve other Gansu districts received disaster grain loans.',
  ],
  s0470: [
    'Second month, day yimao: in Jiayi county, Fujian, teaching-sect rebels Shen Zhi and others rose; they were captured and executed.',
    'In month 2, yimao, Jiayi teaching rebels led by Shen Zhi were captured and executed.',
  ],
  s0471: [
    'That month, granary grain was loaned to seven Shanxi prefectures and counties including Jizhou.',
    'That month, Jizhou and six other Shanxi districts received granary loans.',
  ],
  s0472: [
    'Third month, new moon on day wuyin: for the visit to Cenqi Mountain, Prince Dun Miankai and others were left in the capital to handle affairs.',
    'At the third-month new moon, wuyin, Prince Dun and others stayed in Beijing for the Cenqi Mountain visit.',
  ],
  s0473: [
    'On day gengyin, the Emperor, escorting the Empress Dowager, went to Cenqi Mountain and remitted one-third of this year\'s quota levies in passed areas.',
    'On gengyin day, the Emperor escorted the Empress Dowager to Cenqi Mountain and remitted one-third of this year\'s passed-area quota tax.',
  ],
  s0474: [
    'On day jiawu, the Emperor escorted the Empress Dowager back to the Old Summer Palace.',
    'On jiawu day, the Empress Dowager returned to the Old Summer Palace.',
  ],
  s0475: [
    'Qiying was made Rehe military governor.',
    'Qiying became Rehe military governor.',
  ],
  s0476: [
    'On day yiwei, the Emperor visited the Ming tombs.',
    'On yiwei day, the Emperor visited the Ming tombs.',
  ],
  s0477: [
    'On day bingshen, the Emperor offered libations at the Ming Chang Tomb, Xian Tomb, Tai Tomb, Jing Tomb, and Yong Tomb.',
    'On bingshen day, the Emperor offered libations at Ming Changling, Xianling, Tailing, Jingling, and Yongling.',
  ],
  s0478: [
    'Shu Gui, Marquis of Extended Grace and Ming descendant, was made honorary minister.',
    'Ming descendant Shu Gui, Marquis of Extended Grace, became honorary minister.',
  ],
  s0479: [
    'On day dingyou, the Emperor returned to the Old Summer Palace.',
    'On dingyou day, the Emperor returned to the Old Summer Palace.',
  ],
  s0480: [
    'Summer, fourth month, day gengshen: Yande was ordered to try the case in which Maoming\'an acting jasaq prince Danpengle and others accused their league chief.',
    'In the fourth month, gengshen, Yande was ordered to try Danpengle\'s accusation against his Maoming\'an league chief.',
  ],
  s0481: [
    'On day jiazi, Yan Bozao was made Yunnan governor.',
    'On jiazi day, Yan Bozao became Yunnan governor.',
  ],
  s0482: [
    'That month, granary grain was loaned to twenty-four Shandong prefectures, counties, and guards including Puzhou and to Ningwu county, Shanxi.',
    'That month, Puzhou and twenty-three other Shandong districts and Ningwu received granary loans.',
  ],
  s0483: [
    'Fifth month, day wuyin: Guiqing was dismissed because of illness; Yi Ji was transferred to Minister of Rites; Wuzhong\'e was made Minister of the Court of Colonial Affairs; Kuizhao was made left censor-in-chief.',
    'In month 5, wuyin, Guiqing fell ill and left office; Yi Ji took Rites, Wuzhong\'e colonial affairs, and Kuizhao the left censorate.',
  ],
  s0484: [
    'Zhou Tianjue acted as grain-transport governor-general.',
    'Zhou Tianjue acted as grain-transport governor-general.',
  ],
  s0485: [
    'Sixth month, day gengxu: on Censor Zhu Chengylie\'s memorial that each year Guangdong\'s ports disbursed more than thirty million taels of silver, that ports in Fujian, Zhejiang, and Jiangsu each disbursed no less than ten million, and that Tianjin\'s ports also disbursed more than twenty million, the coastal governors-general, governors, and supervisors were ordered to investigate strictly.',
    'In month 6, gengxu, Zhu Chengylie\'s memorial on massive coastal silver outflows ordered strict investigation by coastal governors and supervisors.',
  ],
  s0486: [
    'On day wuwu, Left Censor-in-Chief Kuizhao and Vice Minister of Revenue Wen Qing were ordered to study while serving on the Grand Council.',
    'On wuwu day, Kuizhao and Wen Qing were ordered to learn Grand Council duties.',
  ],
  s0487: [
    'On day jiwei, Qishan was ordered to act as Zhili governor-general.',
    'On jiwei day, Qishan was ordered to act as Zhili governor-general.',
  ],
  s0488: [
    'On day renshen, Yi bandits in Mabian department, Sichuan, rebelled; Eshan was ordered to suppress them.',
    'On renshen day, Mabian Yi rebels rose and Eshan was ordered to suppress them.',
  ],
  s0489: [
    'On day jiaxu, Yi Shan and others memorialized that Kokand rebel leaders Adana and others had been captured and executed.',
    'On jiaxu day, Yi Shan reported capturing and executing Kokand rebel leader Adana and others.',
  ],
  s0490: [
    'That month, seed grain was loaned to Huai\'an and Dahe guards in Jiangsu that had suffered disasters.',
    'That month, Jiangsu\'s Huai\'an and Dahe guards received disaster seed loans.',
  ],
  s0491: [
    'Autumn, seventh month, new moon on day bingzi: Vice Minister Woshina and others were ordered to invest the queen of Korea.',
    'At the seventh-month new moon, bingzi, Woshina and others were sent to invest Korea\'s queen.',
  ],
  s0492: [
    'On day renwu, Leshan was transferred to Jingzhou general and Saishang\'a was made Chahar commander-in-chief.',
    'On renwu day, Leshan went to Jingzhou and Saishang\'a took Chahar.',
  ],
  s0493: [
    'On day xinmao, Li Yumei was instructed that the East River brick works were to be changed to stone.',
    'On xinmao day, Li Yumei was told to replace East River brick works with stone.',
  ],
  s0494: [
    'On day dingsi, Xining commissioner Delenge was transferred to Jingzhou general and Sulefang\'a replaced him.',
    'On dingsi day, Delenge went to Jingzhou and Sulefang\'a took Xining.',
  ],
  s0495: [
    'On day jiaxu, Nepal\'s annual tribute exceeded the norm; it was gently declined.',
    'On jiaxu day, excessive Nepalese tribute was gently refused.',
  ],
  s0496: [
    'Ninth month, day gengyin: Zhou Tianjue was appointed grain-transport governor-general.',
    'In month 9, gengyin, Zhou Tianjue became grain-transport governor-general.',
  ],
  s0497: [
    'On day guisi, Ne\'erjing\'e was summoned to the capital.',
    'On guisi day, Ne\'erjing\'e was called to Beijing.',
  ],
  s0498: [
    'On day jiawu, Qian Baochen was made Hunan governor.',
    'On jiawu day, Qian Baochen became Hunan governor.',
  ],
  s0499: [
    'On day jiachen, five-tenths of drought quota levies were remitted for Xingtai and Fucheng counties in Zhili.',
    'On jiachen day, half of Xingtai and Fucheng\'s drought quota tax was remitted.',
  ],
  s0500: [
    'Winter, tenth month, day bingwu: the Emperor visited Grand Secretary Changqing\'s residence to inquire after his illness.',
    'In the tenth month, bingwu, the Emperor visited Changqing at home to inquire after his illness.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_018_b05.mjs <translation.json>'
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
