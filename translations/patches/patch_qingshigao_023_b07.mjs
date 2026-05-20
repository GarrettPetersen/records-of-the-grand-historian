#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'An order was issued to reorganize the Eight Banners official schools.',
    'The court ordered the Eight Banners official schools reorganized.',
  ],
  s0602: [
    'On day yihai, Qing An reported that Russian troops had reached the Haba River.',
    'On yihai day, Qing An reported Russian troops at the Haba River.',
  ],
  s0603: [
    'Chang Shun was instructed to survey the border carefully and thoroughly so as to forestall covetous designs.',
    'Chang Shun was told to survey the border carefully and block encroachment.',
  ],
  s0604: [
    'On day wuyin, because of bandit turmoil in Korea, Zhang Shusheng was ordered to suppress and pacify it.',
    'On wuyin day, Korean bandit turmoil led to orders for Zhang Shusheng to pacify it.',
  ],
  s0605: [
    'Soon afterward Admiral Ding Ruchang was sent to aid, and Wu Changqing led troops east across the sea.',
    'Soon Ding Ruchang went to aid and Wu Changqing crossed east with his army.',
  ],
  s0606: [
    'On day guiwei, Korea burned the Japanese legation and Japan sent warships.',
    'On guiwei day, Korea burned the Japanese legation and Japan sent warships.',
  ],
  s0607: [
    'Li Hongzhang was ordered to Tianjin to deploy land and naval forces and go to investigate and handle the matter.',
    'Li Hongzhang was sent to Tianjin to deploy forces and investigate.',
  ],
  s0608: [
    'That month, flood relief was given for Anhui and for Zhejiang and Jiangxi.',
    'That month flood relief went to Anhui, Zhejiang, and Jiangxi.',
  ],
  s0609: [
    'Autumn, seventh month, yiyou new moon: the Sanyan wild tribes submitted.',
    'In the seventh month, yiyou new moon, the Sanyan wild tribes submitted.',
  ],
  s0610: [
    'On day yisi, an empress dowager rescript cut Mid-Autumn palace expenses and gave relief to the three provinces of Anhui, Zhejiang, and Jiangxi.',
    'On yisi day, palace Mid-Autumn expenses were cut for relief in Anhui, Zhejiang, and Jiangxi.',
  ],
  s0611: [
    'On day dingwei, Wu Changqing\'s army entered Korea and seized the Taewongun Yi Ha-ung.',
    'On dingwei day, Wu Changqing entered Korea and seized the Taewongun Yi Ha-ung.',
  ],
  s0612: [
    'Circuit intendants for Aksu and Kashgar in Xinjiang were established for the first time.',
    'Aksu and Kashgar circuit intendants in Xinjiang were first established.',
  ],
  s0613: [
    'On day guichou, the Korean turmoil was pacified.',
    'On guichou day, the Korean turmoil ended.',
  ],
  s0614: [
    'Eighth month, day bingchen: an edict stated, "On the Kobdo border affair, Chonghou erred before and Zeng Jize fought hard afterward.',
    'Month 8, bingchen: an edict said that on Kobdo, Chonghou had erred and Zeng Jize had fought afterward.',
  ],
  s0615: [
    'Now that a new treaty is concluded, work should follow the original map, fix the new boundary,',
    'The new treaty should follow the original map and set the new boundary,',
  ],
  s0616: [
    'and Qing An and others should measure and extend lines with Russian officials so that both sides may later live at peace."',
    'and Qing An should work with Russian officials to extend the line for lasting peace."',
  ],
  s0617: [
    'On day dingsi, officials were instructed to review autumn assizes carefully.',
    'On dingsi day, officials were told to review autumn assizes carefully.',
  ],
  s0618: [
    'On day jiazi, Yunnan provincial treasurer Tang Jiong was ordered out of the pass to inspect border defenses.',
    'On jiazi day, Tang Jiong was ordered beyond the pass to inspect border defenses.',
  ],
  s0619: [
    'On day yichou, Yi Ha-ung was placed under detention at Baoding.',
    'On yichou day, Yi Ha-ung was detained at Baoding.',
  ],
  s0620: [
    'Soon afterward the Korean king begged for his release; it was not granted.',
    'The Korean king soon begged for his release and was refused.',
  ],
  s0621: [
    'On day dingchou, a comet again appeared in the southeast; officials within and without were ordered to practice self-examination.',
    'On dingchou day, a comet reappeared in the southeast and officials were ordered to examine themselves.',
  ],
  s0622: [
    'Ninth month, day yiyou: the Yellow River burst at Huimin, Shanghe, and Binzhou in Shandong.',
    'Month 9, yiyou: the Yellow River burst at Huimin, Shanghe, and Binzhou in Shandong.',
  ],
  s0623: [
    'On day guisi, Yulin bandits rebelled and government troops suppressed them.',
    'On guisi day, Yulin bandits rose and government troops suppressed them.',
  ],
  s0624: [
    'That autumn, flood relief was given for Sichuan, Zhejiang, Shandong, Shaanxi, Fujian, Jiangxi, and Guizhou; fire relief for Zizhou; and wind and flood relief for Taiwan.',
    'That autumn, floods were relieved in seven provinces, fire at Zizhou, and wind and flood in Taiwan.',
  ],
  s0625: [
    'Winter, tenth month, day yimao: Beijing was ordered to arrest rigorously and not conceal cases or harass the people.',
    'Month 10, yimao: Beijing was told to arrest strictly without cover-ups or harassment.',
  ],
  s0626: [
    'On day renxu, the Yellow River burst at Licheng.',
    'On renxu day, the Yellow River burst at Licheng.',
  ],
  s0627: [
    'On day jiazi, an order was issued to capture Gu bandits.',
    'On jiazi day, Gu bandits were ordered captured.',
  ],
  s0628: [
    'On day dingchou, Wang Wenshao repeatedly memorialized begging to resign.',
    'On dingchou day, Wang Wenshao repeatedly asked to resign.',
  ],
  s0629: [
    'A warm rescript urged him to remain.',
    'A warm rescript kept him in office.',
  ],
  s0630: [
    'Eleventh month, day dinghai: Wang Wenshao again begged to resign to care for his parents; it was granted.',
    'Month 11, dinghai: Wang Wenshao again resigned to care for his parents and was allowed.',
  ],
  s0631: [
    'Weng Tonghe was appointed Grand Councilor.',
    'Weng Tonghe became a Grand Councilor.',
  ],
  s0632: [
    'On day wuzi, Pan Zuyin was appointed Grand Councilor.',
    'On wuzi day, Pan Zuyin became a Grand Councilor.',
  ],
  s0633: [
    'Taizhou bandit chief Wang Jinman had long evaded execution; the responsible offices were ordered to arrest him strictly.',
    'Wang Jinman of Taizhou had long evaded capture; offices were ordered to arrest him strictly.',
  ],
  s0634: [
    'On day yiwei, mutual trade with Korea was approved.',
    'On yiwei day, trade with Korea was approved.',
  ],
  s0635: [
    'On day xinchou, the new southern canal at Tahe Dian south of Tianjin was opened.',
    'On xinchou day, Tianjin\'s new southern canal at Tahe Dian was opened.',
  ],
  s0636: [
    'On day renyin, because of an earthquake officials were ordered to be diligent in duty and inspect subordinates.',
    'On renyin day, an earthquake edict ordered diligence and inspection of officials.',
  ],
  s0637: [
    'On day gengxu, talent was to be recommended within and without the court.',
    'On gengxu day, talent was sought within and without the court.',
  ],
  s0638: [
    'That month, coal and iron mines at Tongshan county were opened.',
    'That month Tongshan county coal and iron mines opened.',
  ],
  s0639: [
    'Twelfth month, day xinyou: You Baichuan was sent to Shandong to survey river works.',
    'Month 12, xinyou: You Baichuan went to Shandong to survey river works.',
  ],
  s0640: [
    'On day renxu, telegraph lines were set up along the Shanghai and Guangdong coasts.',
    'On renxu day, coastal telegraph lines were set up for Shanghai and Guangdong.',
  ],
  s0641: [
    'On day yichou, cases long pending within and without the court were ordered cleared.',
    'On yichou day, long-pending cases were ordered cleared within and without.',
  ],
  s0642: [
    'On day renshen, snow had been prayed for continuously since the previous month; now it snowed.',
    'On renshen day, snow fell after prayers since the previous month.',
  ],
  s0643: [
    'That winter, earthquake relief was given in Zhili and hail relief in Sichuan and Shaanxi.',
    'That winter Zhili had earthquake relief and Sichuan and Shaanxi hail relief.',
  ],
  s0644: [
    'Taxes were remitted on poor land at Qiqihar and Mo\'ergen, on new and old garrison fields in Zhejiang, and on storm losses at salt fields including Renhe.',
    'Taxes were remitted at Qiqihar, Mo\'ergen, Zhejiang garrison fields, and Renhe salt fields.',
  ],
  s0645: [
    'That year, Korea presented tribute.',
    'Korea paid tribute that year.',
  ],
  s0646: [
    'Ninth year, guiwei cycle, spring, first month, guiwei new moon: court banquets were suspended.',
    'Year 9, spring month 1, guiwei new moon: court banquets stopped.',
  ],
  s0647: [
    'On day bingshen, Liu Jintang reported that Shakudelin Zhabu and the Russian envoy had surveyed the southern Xinjiang border contrary to the old treaty; Chang Shun and others were ordered to challenge them by treaty.',
    'On bingshen day, Liu Jintang said the southern Xinjiang survey broke the old treaty and Chang Shun was told to protest.',
  ],
  s0648: [
    'Soon afterward Zeng Jize was instructed to fight hard for a new survey.',
    'Soon Zeng Jize was told to fight for a new survey.',
  ],
  s0649: [
    'On day wuxu, Wu Tingfen, vice director of the Imperial Clan Court, was ordered to serve at the Zongli Yamen.',
    'On wuxu day, Wu Tingfen was assigned to the Zongli Yamen.',
  ],
  s0650: [
    'On day gengzi, grain taxes were ordered remitted; what the people had already paid might offset the next year\'s regular levy and must not be levied again.',
    'On gengzi day, remitted grain taxes already paid could offset next year\'s levy without double collection.',
  ],
  s0651: [
    'On day yisi, thirty thousand shi of Hubei tribute grain were allocated for famine relief in Shuntian and Zhili.',
    'On yisi day, thirty thousand shi of Hubei grain were set aside for Shuntian and Zhili famine relief.',
  ],
  s0652: [
    'That month, Vietnamese bandits including Tan Sidai surrendered.',
    'That month Vietnamese bandits including Tan Sidai surrendered.',
  ],
  s0653: [
    'Second month, day jiayin: refugees from Zhili and Shandong crowded into the capital; officials were ordered to comfort them.',
    'Month 2, jiayin: Zhili and Shandong refugees crowded Beijing and officials were told to aid them.',
  ],
  s0654: [
    'On day wuwu, the Yellow River burst at Licheng in Shandong and dikes broke in Qihe and other counties; You Baichuan and others were ordered to relieve the victims.',
    'On wuwu day, the Yellow River burst at Licheng and Qihe dikes broke; You Baichuan was told to relieve victims.',
  ],
  s0655: [
    'On day jiwei: earlier, Malan garrison commander Jing Rui had repaired barracks; garrison soldiers concealed charges against him; commander Gui Ang requested troops and provoked mutiny; Boyansuomuhu and Yan Jingming were sent to investigate.',
    'On jiwei day: Jing Rui had repaired Malan barracks; soldiers concealed charges; Gui Ang provoked mutiny; Boyansuomuhu and Yan Jingming investigated.',
  ],
  s0656: [
    'Now the report was submitted: Jing Rui was stripped of office; Gui Ang was soon stripped as well.',
    'The report stripped Jing Rui; Gui Ang was soon stripped too.',
  ],
  s0657: [
    'Cruel officials using illegal torture were forbidden in every province.',
    'Every province was forbidden cruel officials and illegal torture.',
  ],
  s0658: [
    'Guangxi provincial treasurer Xu Yanxu was ordered beyond the pass to plan border defense.',
    'Xu Yanxu was ordered beyond the pass to plan Guangxi border defense.',
  ],
  s0659: [
    'On day wuchen, Fujian provincial judge Zhang Mengyuan was put in charge of the Fujian shipyard.',
    'On wuchen day, Zhang Mengyuan took charge of the Fujian shipyard.',
  ],
  s0660: [
    'On day guiyou, Gaozhou battalion commander Mo Yulin gathered rebels and was executed.',
    'On guiyou day, Mo Yulin gathered rebels at Gaozhou and was executed.',
  ],
  s0661: [
    'On day gengchen, the Ministry of Justice reported that in a Henan case involving Hu Tiyan the original verdict was wrong and the retrial had shielded offenders.',
    'On gengchen day, the Ministry of Justice said a Henan case involving Hu Tiyan had a wrong verdict and a shielding retrial.',
  ],
  s0662: [
    'Governor Li Henian and Grand Canal director Mei Qizhao were stripped of office; original trial officials were punished and banished in varying degrees.',
    'Li Henian and Mei Qizhao lost office; original trial officials were punished and banished.',
  ],
  s0663: [
    'Third month, day wuzi: Prince Pu Tai accepted bribes for forbidden land reclamation at the Dian marshes; he was stripped of rank and confined for one year.',
    'Month 3, wuzi: Prince Pu Tai took bribes for forbidden Dian reclamation, lost rank, and was confined one year.',
  ],
  s0664: [
    'The French took Nanding.',
    'The French captured Nanding.',
  ],
  s0665: [
    'On day yiwei, Tang Jiong was ordered to command border defense troops guarding the Yunnan frontier.',
    'On yiwei day, Tang Jiong commanded border troops on the Yunnan frontier.',
  ],
  s0666: [
    'Ni Wenwei was instructed to defend northern Cochinchina.',
    'Ni Wenwei was told to defend northern Cochinchina.',
  ],
  s0667: [
    'That spring, summer grain was remitted in Qianshan and other counties; drought-stricken Shaanxi had ding grain and rice commuted.',
    'That spring Qianshan and other counties had summer grain remitted and drought-stricken Shaanxi had levies commuted.',
  ],
  s0668: [
    'Flood relief was given for Jinan and Wuding and earthquake relief for Taiwan.',
    'Jinan and Wuding had flood relief and Taiwan earthquake relief.',
  ],
  s0669: [
    'Summer, fourth month, day jiwei: Russia withdrew troops stationed at Ili.',
    'Month 4, jiwei: Russia withdrew Ili garrison troops.',
  ],
  s0670: [
    'On day jiazi, rigorous arrest of bandits in the capital region was ordered.',
    'On jiazi day, capital-region bandits were ordered rigorously arrested.',
  ],
  s0671: [
    'On day jiaxu, Liu Changyou resigned on grounds of illness; Cen Yuying was made Yunnan-Guizhou governor-general.',
    'On jiaxu day, Liu Changyou resigned ill and Cen Yuying became Yunnan-Guizhou governor-general.',
  ],
  s0672: [
    'On day yihai, Chen Mian and three hundred eight others were granted jinshi degrees and origin ranks in varying grades.',
    'On yihai day, Chen Mian and 308 others received jinshi degrees in varying grades.',
  ],
  s0673: [
    'Fifth month, day xinsi: Li Hongzhang was ordered back to act as Beiyang commissioner and deploy coastal defense.',
    'Month 5, xinsi: Li Hongzhang returned to Beiyang and deployed coastal defense.',
  ],
  s0674: [
    'On day renwu, Sheng Tai was ordered to survey the southwestern border of Tarbagatai with the Russian envoy.',
    'On renwu day, Sheng Tai surveyed Tarbagatai\'s southwest border with the Russian envoy.',
  ],
  s0675: [
    'On day dinghai, Hunan secret-society bandit Fang Xue\'ao stirred rebellion and was captured and executed.',
    'On dinghai day, Hunan secret-society chief Fang Xue\'ao rebelled and was captured and executed.',
  ],
  s0676: [
    'On day xinmao, private coining was forbidden.',
    'On xinmao day, private coining was forbidden.',
  ],
  s0677: [
    'On day gengzi, Cen Yuying and others were instructed to select and recruit border people to hold key Yunnan-Vietnam passes with government troops.',
    'On gengzi day, Cen Yuying was told to recruit border people to hold Yunnan-Vietnam passes with troops.',
  ],
  s0678: [
    'On day wushen, an empress dowager rescript ordered Prince Chun to join in planning French-Vietnamese affairs.',
    'On wushen day, Prince Chun was ordered to plan French-Vietnamese affairs.',
  ],
  s0679: [
    'Earlier, censor Chen Qitai memorialized that Grand Secretariat director Zhou Ruiqing monopolized Yunnan expense accounts; censors Hong Liangpin and supervising secretary Deng Chengxiu, because the matter involved Grand Councilor Jing Lian and Wang Wenshao, memorialized in succession to impeach.',
    'Earlier Chen Qitai said Zhou Ruiqing monopolized Yunnan accounts; Hong Liangpin and Deng Chengxiu impeached Jing Lian and Wang Wenshao.',
  ],
  s0680: [
    'Prince Dun, Yan Jingming, Pan Zuyin, Zhang Zhiwan, Lin Shu, Weng Tonghe, and Xue Yunsheng were successively ordered to investigate jointly.',
    'Prince Dun, Yan Jingming, Pan Zuyin, Zhang Zhiwan, Lin Shu, Weng Tonghe, and Xue Yunsheng were ordered to investigate.',
  ],
  s0681: [
    'Now the report was submitted: Zhou Ruiqing and others were punished according to law; Minister of Revenue Jing Lian, former vice minister Wang Wenshao and Kui Run, former minister Dong Heng, and former governor-general Liu Changyou were all demoted three ranks; the rest were punished in varying degrees.',
    'The report punished Zhou Ruiqing by law; Jing Lian, Wang Wenshao, Kui Run, Dong Heng, and Liu Changyou were demoted three ranks; others were punished.',
  ],
  s0682: [
    'Sixth month, day gengxu: the Yellow River burst in Shandong, destroying dikes at Licheng, Qidong, and Lijin; blockage and relief were ordered together.',
    'Month 6, gengxu: the Yellow River burst in Shandong and broke dikes at Licheng, Qidong, and Lijin; blockage and relief went together.',
  ],
  s0683: [
    'Vietnamese general Liu Yongfu and French troops fought at Hanoi and defeated them.',
    'Liu Yongfu and French troops fought at Hanoi and the French were beaten.',
  ],
  s0684: [
    'On day yimao, the Qin River dikes were repaired.',
    'On yimao day, the Qin River dikes were repaired.',
  ],
  s0685: [
    'On day wuwu, France sent envoy Delacour to negotiate a treaty.',
    'On wuwu day, France sent envoy Delacour to negotiate a treaty.',
  ],
  s0686: [
    'Eunuch Wang Yonghe stole imperial garments; the Ministry of Justice was ordered to sentence by law and not implicate others.',
    'Eunuch Wang Yonghe stole imperial garments; the Ministry of Justice was told to sentence by law without implicating others.',
  ],
  s0687: [
    'On day dingmao, the Xiaoqing River in Shandong was dredged.',
    'On dingmao day, Shandong\'s Xiaoqing River was dredged.',
  ],
  s0688: [
    'On day gengwu, Shandong opened a relief contribution sale of offices because of flood disaster.',
    'On gengwu day, Shandong opened relief contributions for flood disaster.',
  ],
  s0689: [
    'That summer, native chieftain land rents in Yunnan and old grain-tax arrears in Gansu were remitted.',
    'That summer Yunnan chieftain rents and Gansu old grain arrears were remitted.',
  ],
  s0690: [
    'Taxes were also remitted for disaster districts at Maogong and flood districts at Tongren.',
    'Maogong disaster taxes and Tongren flood taxes were also remitted.',
  ],
  s0691: [
    'One hundred thousand shi of tribute grain and 160,000 taels of capital funds were retained for Shandong disaster relief.',
    'One hundred thousand shi of tribute grain and 160,000 taels were kept for Shandong relief.',
  ],
  s0692: [
    'Autumn, seventh month, day jimao: two hundred thousand taels of capital funds were retained for the Guangxi army.',
    'Month 7, jimao: two hundred thousand taels were kept for the Guangxi army.',
  ],
  s0693: [
    'On day renwu, Wu Quanmei and Fang Yao were ordered to patrol the seas off Lian and Qiong and the Qinzhou border.',
    'On renwu day, Wu Quanmei and Fang Yao patrolled Lian and Qiong seas and the Qinzhou border.',
  ],
  s0694: [
    'On day wuzi, Yunnan mines were ordered opened.',
    'On wuzi day, Yunnan mines were ordered opened.',
  ],
  s0695: [
    'On day xinmao, Taizhou bandit chief Wang Jinman led his followers to surrender; he was pardoned from death and the rest were kept in camp to serve.',
    'On xinmao day, Wang Jinman of Taizhou surrendered; he was spared death and his men kept in camp.',
  ],
  s0696: [
    'Eighth month, day gengxu: the French broke the Thuan Hoa riverbank batteries; the Vietnamese ceased fighting and negotiated peace.',
    'Month 8, gengxu: the French broke Thuan Hoa batteries and Vietnam negotiated peace.',
  ],
  s0697: [
    'On day renzi, the Yongding River burst.',
    'On renzi day, the Yongding River burst.',
  ],
  s0698: [
    'On day yimao, ministry and court officials were inspected.',
    'On yimao day, ministry and court officials were inspected.',
  ],
  s0699: [
    'Coastal dikes and related works were ordered repaired and disaster households comforted.',
    'Coastal dikes were ordered repaired and disaster households comforted.',
  ],
  s0700: [
    'On day bingyin, men of both counsel and courage fit for appointment were called for recommendation.',
    'On bingyin day, men of counsel and courage fit for office were sought.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b07.mjs <translation.json>'
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
