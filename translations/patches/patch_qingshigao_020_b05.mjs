#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    'Posthumous hereditary office was granted to Ma Jimei, regional commander killed in battle in Jiangxi.',
    'Ma Jimei, the Jiangxi commander killed in action, received a posthumous hereditary office.',
  ],
  s0402: [
    'On day dingsi, an edict ordered that new grain tribute from Jiangxi and Huguang be converted to cash for delivery to the capital.',
    'On dingsi, Jiangxi and Huguang new tribute grain was ordered cashed in for Beijing.',
  ],
  s0403: [
    'On day xinyou, rebels fled into Hubei and Anhui.',
    'On xinyou, the rebels slipped into Hubei and Anhui.',
  ],
  s0404: [
    'Yi Liang was ordered to establish a customs office at Shanghai to collect taxes.',
    'Yi Liang was told to open a Shanghai customs house for tax collection.',
  ],
  s0405: [
    'On day guihai, hereditary office was granted to Grand Coordinator Fuzhu Hong\'e.',
    'On guihai, Fuzhu Hong\'e received a posthumous hereditary office.',
  ],
  s0406: [
    'On day jiazi, an edict granted the same gracious posthumous benefits to gentry who organized militia against rebels and died in service.',
    'On jiazi, militia leaders who died fighting rebels were promised equal posthumous honors.',
  ],
  s0407: [
    'On day yichou, Fujian government troops recovered Youxi.',
    'On yichou, Fujian forces retook Youxi.',
  ],
  s0408: [
    'Eighth month, day bingzi: government troops lifted the Huaiqing siege, and rebels fled into Shanxi.',
    'In month 8, bingzi, Huaiqing was relieved and the rebels fled to Shanxi.',
  ],
  s0409: [
    'On day wuyin, Wu Wenrong was made Huguang governor-general, Yusui Sichuan governor-general, and Yuebin Chengdu general.',
    'On wuyin, Wu Wenrong took Huguang, Yusui Sichuan, and Yuebin Chengdu.',
  ],
  s0410: [
    'On day gengchen, rebels took Yuanqu.',
    'On gengchen, Yuanqu fell to the rebels.',
  ],
  s0411: [
    'On day guimwei, Li Han died; Zhang Liangji was made Shandong governor, and Luo Bingzhang was appointed Hunan governor.',
    'On guimwei, Li Han died; Zhang Liangji became Shandong governor and Luo Bingzhang Hunan governor.',
  ],
  s0412: [
    'On day jiashen, Jiangxi rebels took Raozhou prefectural city, and Ji\'an local bandits responded from afar.',
    'On jiashen, Raozhou fell in Jiangxi as Ji\'an bandits rose in support.',
  ],
  s0413: [
    'On day bingxu, rebels took Jiangxian and Quwo and advanced to besiege Pingyang.',
    'On bingxu, Jiangxian and Quwo fell and Pingyang was besieged.',
  ],
  s0414: [
    'Hafen was dismissed, and Hengchun was made Shanxi governor.',
    'Hafen was removed and Hengchun made Shanxi governor.',
  ],
  s0415: [
    'On day gengyin, rebels took Pingyang; Sheng Bao\'s troops arrived, defeated them, and recovered Pingyang.',
    'On gengyin, Pingyang fell but Sheng Bao retook it after defeating the rebels.',
  ],
  s0416: [
    'Rebels fled east through Hongtong.',
    'The rebels fled east via Hongtong.',
  ],
  s0417: [
    'On day guisi, Sheng Bao was made Imperial Commissioner and given the Divine Sparrow Knife; Enghua and Tuoming\'a assisted him.',
    'On guisi, Sheng Bao became Imperial Commissioner with the Divine Sparrow Knife, assisted by Enghua and Tuoming\'a.',
  ],
  s0418: [
    'On day dingyou, Tuoming\'a defeated rebels at Chenliu.',
    'On dingyou, Tuoming\'a beat the rebels at Chenliu.',
  ],
  s0419: [
    'Ninth month, new moon on day guimao: they were defeated again at Lucheng and Licheng; rebels fled into Zhili and entered Linming Pass.',
    'On the guimao new moon in month 9, Lucheng and Licheng were retaken; the rebels fled into Zhili through Linming Pass.',
  ],
  s0420: [
    'Ne\'erjing\'e was stripped of office and arrested for inquiry; Gui Liang was made Zhili governor-general.',
    'Ne\'erjing\'e was dismissed and arrested; Gui Liang became Zhili governor-general.',
  ],
  s0421: [
    'On day bingwu, rebels took Baixiang.',
    'On bingwu, Baixiang fell.',
  ],
  s0422: [
    'The siege of Nanchang in Jiangxi was lifted, but rebels again occupied Anqing.',
    'Nanchang was relieved, yet the rebels reoccupied Anqing.',
  ],
  s0423: [
    'On day dingwei, Kuilin was made Minister of Rites, Huashana Minister of Works, and Sheng Bao Han Banner commander-in-chief.',
    'On dingwei, Kuilin took Rites, Huashana Works, and Sheng Bao the Han Banner command.',
  ],
  s0424: [
    'Jiangsu local bandits took Qingpu and Baoshan; government troops recovered them.',
    'Qingpu and Baoshan fell to Jiangsu bandits but were retaken.',
  ],
  s0425: [
    'On day wushen, grain transport was ordered detained for Shandong disaster relief.',
    'On wushen, transport grain was held back for Shandong famine relief.',
  ],
  s0426: [
    'Because military affairs were urgent, work on the Fengbei River project was deferred.',
    'Fengbei River works were postponed amid urgent campaigning.',
  ],
  s0427: [
    'On day xinhai, Prince Hui was made Commander-in-Chief on Imperial Orders and given the Ruijie Knife; Kobdo Prince Sengge Rinchen was made staff commissioner and given the Nekuni Knife; Prince Gong Yixin, Prince Ding Zaiquan, and inner court minister Bichang were ordered to assist in patrol defense.',
    'On xinhai, Prince Hui became commander-in-chief with the Ruijie Knife, Sengge Rinchen staff commissioner with the Nekuni Knife, and Yixin, Zaiquan, and Bichang joined patrol defense.',
  ],
  s0428: [
    'On day yimao, rebels passed Zhao Prefecture and took Shen Prefecture.',
    'On yimao, the rebels swept through Zhao and seized Shen Prefecture.',
  ],
  s0429: [
    'Troops were ordered posted at Hejian, Zhuo Prefecture, and Tongzhou for defense.',
    'Defenses were set at Hejian, Zhuo Prefecture, and Tongzhou.',
  ],
  s0430: [
    'On day xinyou, Li Jiaduan was dismissed, and Jiang Zhongyuan was made Anhui governor.',
    'On xinyou, Li Jiaduan was removed and Jiang Zhongyuan made Anhui governor.',
  ],
  s0431: [
    'On day jiazi, Sengge Rinchen recovered Shen Prefecture.',
    'On jiazi, Sengge Rinchen retook Shen Prefecture.',
  ],
  s0432: [
    'On day bingyin, Lu Yinggu was dismissed, and Ying Gui was made Henan governor.',
    'On bingyin, Lu Yinggu was replaced by Ying Gui as Henan governor.',
  ],
  s0433: [
    'On day jisi, Zhou Tianjue died in camp.',
    'On jisi, Zhou Tianjue died on campaign.',
  ],
  s0434: [
    'On day xinwei, rebels took Xian county, Jiaohe, and Cangzhou and pressed on Tianjin; Magistrate Xie Zicheng led militia in a counterattack and died, yet his force routed the rebels thirty li.',
    'On xinwei, Xian, Jiaohe, and Cangzhou fell and Tianjin was threatened; Xie Zicheng died leading militia but drove the rebels back thirty li.',
  ],
  s0435: [
    'Xie Zicheng was specially posthumously made provincial administrator and given a shrine; the militia were generously rewarded.',
    'Xie Zicheng was posthumously made provincial administrator with a shrine, and his militia were richly rewarded.',
  ],
  s0436: [
    'Alarmed, the capital went on alert; Sengge Rinchen encamped at Wuqing.',
    'Beijing went on alert; Sengge Rinchen camped at Wuqing.',
  ],
  s0437: [
    'Winter, tenth month, day jiaxu: Zeng Guofan was ordered to lead militia to Hubei to suppress rebels.',
    'In month 10, jiaxu, Zeng Guofan was sent to Hubei with militia against the rebels.',
  ],
  s0438: [
    'On day bingzi, rebels took Huangzhou; Han-Huang-De Circuit Intendant Xu Fengyu died, and they then took Hanyang and besieged Wuchang.',
    'On bingzi, Huangzhou fell and Xu Fengyu was killed; Hanyang followed and Wuchang was besieged.',
  ],
  s0439: [
    'On day dingchou, rebels held Duliuzhen; Sheng Bao arrived in command and repeatedly defeated them.',
    'On dingchou, the rebels held Duliuzhen until Sheng Bao arrived and beat them repeatedly.',
  ],
  s0440: [
    'On day wuyin, Prince Gong Yixin was ordered to serve on the Grand Council; Lin Kui was removed as Grand Councilor, and Ruilin and Muyin were made Grand Councilors.',
    'On wuyin, Yixin joined the Grand Council; Lin Kui left it and Ruilin and Muyin entered.',
  ],
  s0441: [
    'On day yimao, Censor Yuan Jiasan was given third-rank counselor rank to suppress Anhui Nian bandits.',
    'On yimao, Yuan Jiasan received third-rank rank to fight Anhui Nian rebels.',
  ],
  s0442: [
    'On day renchen, the Wuchang alarm was lifted, and Jiang Zhongyuan went to Anhui.',
    'On renchen, Wuchang stood down and Jiang Zhongyuan marched to Anhui.',
  ],
  s0443: [
    'Acting provincial judge Tang Shuyi was ordered to suppress rebels on the river.',
    'Tang Shuyi, acting judge, was assigned river operations against the rebels.',
  ],
  s0444: [
    'On day guisi, rebels took Tongcheng.',
    'On guisi, Tongcheng fell.',
  ],
  s0445: [
    'On day wuxu, grain levies were ordered from Shanxi, Shaanxi, and Sichuan for Henan, but the order was soon withdrawn.',
    'On wuxu, three provinces were told to send grain to Henan, then the levy was canceled.',
  ],
  s0446: [
    'Eleventh month, new moon on day renyin: Wang Qingyun was made Shaanxi governor.',
    'On the renyin new moon in month 11, Wang Qingyun became Shaanxi governor.',
  ],
  s0447: [
    'On day bingwu, Fujian government troops recovered Xiamen.',
    'On bingwu, Fujian forces retook Xiamen.',
  ],
  s0448: [
    'Anhui rebels took Shucheng, and militia organizer and Vice Minister Lv Xianji died.',
    'Shucheng fell in Anhui and Lv Xianji, the militia organizer, was killed.',
  ],
  s0449: [
    'On day gengxu, rebels took Yizheng.',
    'On gengxu, Yizheng fell.',
  ],
  s0450: [
    'On day guichou, Vice Minister Zeng Guofan was ordered to lead a river force to suppress rebels in Anhui.',
    'On guichou, Zeng Guofan was told to take a river flotilla against Anhui rebels.',
  ],
  s0451: [
    'On day dingmao, Sheng Bao attacked rebels at Duliuzhen without success; Vice Commander-in-Chief Tong Jian died in battle and was posthumously made general with funeral honors.',
    'On dingmao, Sheng Bao failed at Duliuzhen; Tong Jian fell and was posthumously made general.',
  ],
  s0452: [
    'Twelfth month, day jiaxu: Yangzhou rebels broke out of siege; government troops recovered the city, and Qi Shan, Huicheng, and others were stripped of office and sent to the army.',
    'In month 12, jiaxu, Yangzhou rebels broke out but the city was retaken; Qi Shan and Huicheng lost office and joined the ranks.',
  ],
  s0453: [
    'On day yihai, an edict, because Huangzhou rebels were massing, ordered Wu Wenrong to leave the province to suppress them.',
    'On yihai, Wu Wenrong was ordered out of province as Huangzhou rebels gathered.',
  ],
  s0454: [
    'On day wuzi, Qi Shan recovered Yizheng.',
    'On wuzi, Qi Shan retook Yizheng.',
  ],
  s0455: [
    'On day jichou, rebels took Luzhou, and Jiang Zhongyuan died.',
    'On jichou, Luzhou fell and Jiang Zhongyuan was killed.',
  ],
  s0456: [
    'Fu Ji was made Anhui governor, and Shao Can grain-transport governor-general.',
    'Fu Ji took Anhui and Shao Can the grain-transport post.',
  ],
  s0457: [
    'On day bingshen, Vice Minister Du Han was made Grand Councilor.',
    'On bingshen, Du Han joined the Grand Council.',
  ],
  s0458: [
    'Weng Xincun was dismissed, and Zhao Guang was made Minister of Works.',
    'Weng Xincun left office and Zhao Guang became Minister of Works.',
  ],
  s0459: [
    'On day jihai, joint seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'On jihai, the court performed joint seasonal sacrifice at the Ancestral Temple.',
  ],
  s0460: [
    'That year, disaster levies were remitted in 344 districts of Fengtian, Zhili, Shandong, Shanxi, Zhejiang, Hubei, Hunan, Guangxi, Yunnan, and Gansu.',
    'That year, disaster taxes were waived in 344 districts across ten provinces.',
  ],
  s0461: [
    'Gansu Zhongwei earthquake silver, grain, and fodder were also remitted in varying amounts.',
    'Zhongwei earthquake dues in Gansu were also partly remitted.',
  ],
  s0462: [
    'Korea, Ryukyu, Siam, Vietnam, Burma, and Lan Xang sent tribute.',
    'Tribute came from Korea, Ryukyu, Siam, Vietnam, Burma, and Lan Xang.',
  ],
  s0463: [
    'Fourth year, jiayin, spring, first month, new moon on day xinchou: Mongol league chiefs, princes, and commandery princes repeatedly offered military-supply silver, received warm commendation, and all gifts were declined.',
    'In Xianfeng 4, month 1, xinchou new moon, Mongol princes offered campaign silver, were praised, and all gifts were refused.',
  ],
  s0464: [
    'On day bingwu, three hundred thousand taels from the inner treasury were sent to Sheng Bao\'s camp.',
    'On bingwu, 300,000 taels from the palace treasury went to Sheng Bao.',
  ],
  s0465: [
    'On day gengxu, government troops took Duliuzhen and the entrenched bandits fled back.',
    'On gengxu, Duliuzhen was recovered and the rebels withdrew.',
  ],
  s0466: [
    'On day renzi, Zhang Fei was dismissed, and Chen Qimai was made Jiangxi governor.',
    'On renzi, Zhang Fei was removed and Chen Qimai made Jiangxi governor.',
  ],
  s0467: [
    'Wang Lvqian memorialized that Henan administration was lax, military supplies inflated, and river works wasteful.',
    'Wang Lvqian reported lax Henan governance, inflated army costs, and wasted river funds.',
  ],
  s0468: [
    'Ying Gui was ordered to investigate and report.',
    'The court told Ying Gui to investigate.',
  ],
  s0469: [
    'On day bingchen, Zhejiang sea-transport tribute grain was ordered to sail from Liuhekou; Jiangsu officials were told to set up an office.',
    'On bingchen, Zhejiang tribute grain was rerouted from Liuhekou with a Jiangsu dispatch office.',
  ],
  s0470: [
    'On day jiwei, Fu Ji was ordered to manage Huaibei salt affairs.',
    'On jiwei, Fu Ji was assigned Huaibei salt administration.',
  ],
  s0471: [
    'Wang Yide was made Min-Zhe governor-general, and Lv Qiansun Fujian governor.',
    'Wang Yide took Min-Zhe and Lv Qiansun Fujian.',
  ],
  s0472: [
    'On day xinyou, Yuan Jiasan memorialized that supply matters should go directly from the Grand Council to the responsible office without passing the Grand Secretariat; the request was granted.',
    'On xinyou, Yuan Jiasan won direct Grand Council routing for supply papers, bypassing the Secretariat.',
  ],
  s0473: [
    'On day yichou, Guangdong was ordered to purchase foreign cannon for transport to Wuchang.',
    'On yichou, Guangdong was told to buy foreign guns for Wuchang.',
  ],
  s0474: [
    'On day bingyin, rebels held Dongcheng village, and Sengge Rinchen and Sheng Bao were sternly ordered to capture them quickly.',
    'On bingyin, rebels held Dongcheng village and both generals were urged to crush them at once.',
  ],
  s0475: [
    'On day dingmao, Hubei troops attacking Huangzhou were routed; Governor-General Wu Wenrong and Acting Provincial Judge and former Provincial Administrator Tang Shuyi died.',
    'On dingmao, the Huangzhou assault collapsed; Wu Wenrong and Tang Shuyi were killed.',
  ],
  s0476: [
    'The Board of Revenue replied that Sichuan educational commissioner He Shaoji\'s integrity-donation memorial violated form by using parallel prose; the Emperor rebuked Qi Junzao: "When you reviewed He Shaoji\'s memorial you also called it pedantic—why imitate it?',
    'Revenue boards faulted He Shaoji\'s donation memorial for parallel prose; the Emperor scolded Qi Junzao for copying what he had called pedantic.',
  ],
  s0477: [
    'As a grand secretary heading a ministry, could you not change one word of an official draft!',
    'As ministry head, could a grand secretary not revise one clerkly line!',
  ],
  s0478: [
    '" Rebels fled to Dongchengzhuang east of Xian county; Sengge Rinchen and Sheng Bao joined forces to attack them.',
    'The Emperor\'s rebuke ended; rebels fled to Xian\'s Dongchengzhuang and the two generals struck together.',
  ],
  s0479: [
    'Rebels fled, took Fucheng, and split into bands that fled into Shandong.',
    'They took Fucheng and sent detachments into Shandong.',
  ],
  s0480: [
    'On day jisi, Liuhe county gentry and militia held a desperate city; an edict praised them and remitted one year\'s taxes.',
    'On jisi, Liuhe\'s gentry-militia defense won praise and a one-year tax waiver.',
  ],
  s0481: [
    'Second month, day dingchou: the Emperor attended the Classics Lecture.',
    'In month 2, dingchou, the Emperor held the Classics Lecture.',
  ],
  s0482: [
    'On day jimao, Xu Naipu was removed from the Southern Study and demoted to Grand Secretariat academician.',
    'On jimao, Xu Naipu left the Southern Study for a secretariat post.',
  ],
  s0483: [
    'Zhu Fengbiao was made Minister of Punishments, and Zhou Zupei Censor-in-Chief of the Left.',
    'Zhu Fengbiao took Punishments and Zhou Zupei the Left Censorate.',
  ],
  s0484: [
    'Weng Xincun was recalled as Left Vice Minister of Personnel.',
    'Weng Xincun returned as Personnel vice minister.',
  ],
  s0485: [
    'On day xinsi, Tai Yong was made Huguang governor-general.',
    'On xinsi, Tai Yong became Huguang governor-general.',
  ],
  s0486: [
    'On day renwu, Zeng Guofan reported commanding seventeen thousand land and river troops setting out from Hengzhou for Hubei.',
    'On renwu, Zeng Guofan marched seventeen thousand troops from Hengzhou toward Hubei.',
  ],
  s0487: [
    'On day guisi, Yixing was dismissed, and Yinglong was made Shengjing general.',
    'On guisi, Yixing was removed and Yinglong made Shengjing general.',
  ],
  s0488: [
    'Zeng Guofan memorialized that former governor Yang Jian\'s grandson Yang Jiang donated twenty thousand taels and asked that Yang Jian be entered in the local worthies\' shrine.',
    'Zeng Guofan asked shrine honors for Yang Jian after his grandson Yang Jiang gave 20,000 taels.',
  ],
  s0489: [
    'The rescript read: "Yang Jian was a retired official; the local worthies\' great rite cannot be obtained by purchase.',
    'The throne replied: "Yang Jian was retired; worthies\' shrine honors are not for sale.',
  ],
  s0490: [
    'Zeng Guofan should not have memorialized so hastily; refer the matter to the ministries for disciplinary action."',
    'Zeng Guofan erred in asking; send the case for ministry discipline."',
  ],
  s0491: [
    'Since the military uprising, funds had been empty and affairs critical, yet the Emperor was still this careful with honors.',
    'Amid empty coffers and urgent war, the Emperor still guarded honors so strictly.',
  ],
  s0492: [
    'Hereditary office was granted to Liu Yuzhen, Anhui provincial administrator who died for the dynasty, with posthumous title Qinzhuang.',
    'Liu Yuzhen, the Anhui administrator killed in service, received hereditary office and the posthumous name Qinzhuang.',
  ],
  s0493: [
    'On day guimwei, former Associate Grand Secretary Tang Jin\'zhao and Minister of War Tedeng\'e were again banqueted at the Deer-Ming feast, given higher court rank, and bestowed imperial calligraphy plaques.',
    'On guimwei, Tang Jin\'zhao and Tedeng\'e received a second Deer-Ming feast, higher rank, and imperial plaques.',
  ],
  s0494: [
    'On day bingxu, Zhang Liangji reported capturing rebel chieftain Wang Xiaoyong, who had killed high officials, and offering his heart in distant sacrifice.',
    'On bingxu, Zhang Liangji captured Wang Xiaoyong, killer of senior officers, and sacrificed his heart.',
  ],
  s0495: [
    'The rescript ordered that Tong Jian\'s and Xie Zicheng\'s families be informed for mourning sacrifice.',
    'The throne told Tong Jian\'s and Xie Zicheng\'s kin to perform mourning rites.',
  ],
  s0496: [
    'Tuoming\'a was ordered to assist Sengge Rinchen in military affairs.',
    'Tuoming\'a was assigned to Sengge Rinchen\'s staff.',
  ],
  s0497: [
    'On day guisi, Qinglin was made Hubei governor; Chonglun was in mourning but still helped defend the city.',
    'On guisi, Qinglin became Hubei governor while mourning Chonglun stayed to defend the walls.',
  ],
  s0498: [
    'On day wuxu, Zhang Liangji reported Nian bandits crossing the river from Feng county into Shan county; government troops met them in victory, but Jinxing again fell.',
    'On wuxu, Zhang Liangji beat Nian rebels entering Shan from Feng but Jinxing fell again.',
  ],
  s0499: [
    'Third month, new moon on day gengzi: Zhang Liangji reported rebels had taken Juye and Yancheng.',
    'On the gengzi new moon in month 3, Juye and Yancheng fell, Zhang Liangji reported.',
  ],
  s0500: [
    'On day xinchou, Zai Ling was ordered to garrison Hejian with one thousand troops, and Gui Ling and Tailu to garrison Dezhou with fifteen hundred horse and foot.',
    'On xinchou, Zai Ling took 1,000 men to Hejian and Gui Ling and Tailu 1,500 to Dezhou.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b05.mjs <translation.json>'
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
