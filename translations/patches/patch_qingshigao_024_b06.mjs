#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'The former governor of Hunan, Wu Dacheng, was stripped of office for an offense.',
    'Former Hunan governor Wu Dacheng was dismissed for misconduct.',
  ],
  s0502: [
    'The Jiyang River breach was closed.',
    'The Jiyang breach was sealed.',
  ],
  s0503: [
    'On day renyin, rewards were posted for the capture of Kang Youwei, Liang Qichao, and Wang Zhao.',
    'On renyin day, bounties were offered for Kang Youwei, Liang Qichao, and Wang Zhao.',
  ],
  s0504: [
    'On day jiachen, Ronglu\'s request was approved: the forces under Song Qing, Nie Shicheng, Yuan Shikai, and Dong Fuxiang were each organized as a separate army, and ten thousand men were additionally recruited as a central army.',
    'On jiachen day, Ronglu\'s plan was approved: Song Qing, Nie Shicheng, Yuan Shikai, and Dong Fuxiang each got an army, plus ten thousand central troops.',
  ],
  s0505: [
    'On day yisi, the Russian envoy Giers was received at the Hall of Diligent Government.',
    'On yisi day, Russian envoy Giers was received at the Hall of Diligent Government.',
  ],
  s0506: [
    'Hu Yufen was ordered to supervise the Tianjin-Zhen railway; Zhang Yi was appointed his assistant.',
    'Hu Yufen was put in charge of the Tianjin-Zhen railway with Zhang Yi as deputy.',
  ],
  s0507: [
    'On day dingwei, relief was given for flood and hail disasters at Luoping.',
    'On dingwei day, Luoping flood and hail victims received relief.',
  ],
  s0508: [
    'Month 11, guichou: Zhang Rumei was ordered to handle Shandong disaster relief.',
    'In month 11, guichou, Zhang Rumei was told to run Shandong disaster relief.',
  ],
  s0509: [
    'Gui Chun was granted third-rank capital official status and assigned to serve at the Yamen for General Management of Foreign Affairs.',
    'Gui Chun was made a third-rank capital official at the foreign affairs yamen.',
  ],
  s0510: [
    'On day jiayin, Qi Xiu was appointed Grand Councilor; Zhao Shuqiao and Lian Yuan were also assigned to serve at the foreign affairs yamen.',
    'On jiayin day, Qi Xiu joined the Grand Council; Zhao Shuqiao and Lian Yuan also served at the foreign affairs yamen.',
  ],
  s0511: [
    'On day dingsi, Henan transport-grain deductions were retained at Huaxian for relief reserves.',
    'On dingsi day, Henan transport deductions were kept at Huaxian for relief.',
  ],
  s0512: [
    'Two hundred thousand taels from the treasury were allocated to Jiangsu for relief reserves.',
    'Two hundred thousand treasury taels went to Jiangsu for relief.',
  ],
  s0513: [
    'On day jisi, Pubu was ordered to inspect Shandong relief.',
    'On jisi day, Pubu was sent to inspect Shandong relief.',
  ],
  s0514: [
    'On day gengwu, Yugeng was assigned to serve at the foreign affairs yamen.',
    'On gengwu day, Yugeng was assigned to the foreign affairs yamen.',
  ],
  s0515: [
    'On day xinwei, frontier officials were all additionally given the title of minister of foreign affairs.',
    'On xinwei day, all frontier governors also received foreign-affairs minister titles.',
  ],
  s0516: [
    'On day renshen, relief was given for flood and locust disasters in Turfan and elsewhere.',
    'On renshen day, Turfan and other districts received flood and locust relief.',
  ],
  s0517: [
    'On day dingchou, the New Year ascent-of-the-hall banquet was suspended on grounds of illness.',
    'On dingchou day, the New Year hall banquet was canceled because of illness.',
  ],
  s0518: [
    'On day wuyin, the Zhili training army was abolished.',
    'On wuyin day, the Zhili training army was disbanded.',
  ],
  s0519: [
    'Month 12, bingxu: Hubei governor Zeng Yi was dismissed for an offense.',
    'In month 12, bingxu, Hubei governor Zeng Yi was removed for misconduct.',
  ],
  s0520: [
    'On day guisi, Ma Yukun was ordered to go to Henan to supervise defense and suppression.',
    'On guisi day, Ma Yukun was sent to Henan for defense and suppression.',
  ],
  s0521: [
    'Hu Yufen was removed as supervisor of the Tianjin-Lu railway and replaced by Xu Jingcheng.',
    'Hu Yufen lost the Tianjin-Lu railway post to Xu Jingcheng.',
  ],
  s0522: [
    'On day dingyou, levies were remitted for disaster-hit districts including Hanyang.',
    'On dingyou day, Hanyang and other disaster districts were forgiven levies.',
  ],
  s0523: [
    'On day renyin, the Hankou subprefect of Hubei was changed to the Xiakou pacification subprefect.',
    'On renyin day, Hubei\'s Hankou subprefect became the Xiakou pacification subprefect.',
  ],
  s0524: [
    'On day wushen, fifty thousand taels from the imperial treasury were sent to Qing and Huai for relief reserves.',
    'On wushen day, fifty thousand imperial taels went to Qing and Huai for relief.',
  ],
  s0525: [
    'In the twenty-fifth year, jihai, spring, first month, day gengxu: victims in Henan and Anhui districts ravaged by bandits were relieved.',
    'Year 25, spring 1, gengxu: Henan and Anhui bandit-hit districts received relief.',
  ],
  s0526: [
    'On day bingchen, an edict ordered clearing neglected prisons.',
    'On bingchen day, the court ordered neglected prisons cleared.',
  ],
  s0527: [
    'On day gengshen, tax grain was remitted for districts including Woyang that had been ravaged by bandits.',
    'On gengshen day, Woyang and other bandit-hit districts were forgiven tax grain.',
  ],
  s0528: [
    'On day xinyou, foreign envoys stationed in the capital were stopped from offering New Year congratulations.',
    'On xinyou day, resident foreign envoys were barred from New Year congratulations.',
  ],
  s0529: [
    'On day renxu, another fifty thousand taels from the ministry treasury were allocated to Anhui for relief reserves.',
    'On renxu day, another fifty thousand ministry taels went to Anhui for relief.',
  ],
  s0530: [
    'On day bingyin, Li Bingheng was summoned to the capital.',
    'On bingyin day, Li Bingheng was summoned to Beijing.',
  ],
  s0531: [
    'Month 2, jiashen: an imperial order again told the provinces to carry out granary storage, clearing lawsuits, militia training, and baojia organization.',
    'In month 2, jiashen, provinces were again ordered to store grain, clear suits, drill militia, and run baojia.',
  ],
  s0532: [
    'On day dinghai, the Wusheng new detachment was named the Tiger Spirit Camp.',
    'On dinghai day, the Wusheng new unit was renamed the Tiger Spirit Camp.',
  ],
  s0533: [
    'Baojia organization was carried out in the capital.',
    'Beijing carried out baojia organization.',
  ],
  s0534: [
    'On day wuxu, German troops at Jiaozhou Bay entered Yizhou territory on the pretext of protecting missions.',
    'On wuxu day, Jiaozhou Germans entered Yizhou claiming to protect missions.',
  ],
  s0535: [
    'Lü Haihuan was ordered to inform the German foreign office to halt the advance.',
    'Lü Haihuan was told to ask Berlin to stop the advance.',
  ],
  s0536: [
    'Because the newly formed army\'s training proved effective, Yuan Shikai received special favorable mention.',
    'Yuan Shikai was specially commended because his new army drilled well.',
  ],
  s0537: [
    'On day gengzi, Vice Commander-in-chief Shoushan was ordered to recruit and drill sixteen battalions as the new frontier-guard army.',
    'On gengzi day, Shoushan was told to raise sixteen battalions as the new frontier army.',
  ],
  s0538: [
    'On day jiachen, German troops reached Lanshan.',
    'On jiachen day, German troops reached Lanshan.',
  ],
  s0539: [
    'On day dingwei, Rizhao city fell.',
    'On dingwei day, Rizhao fell.',
  ],
  s0540: [
    'Month 3, yimao: provinces and counties under the grain-transport system were ordered that from this winter they should collect grain in kind for transport to the capital.',
    'In month 3, yimao, grain-transport districts were told to collect grain in kind for Beijing from this winter.',
  ],
  s0541: [
    'On day dingchou, Su Yuanchun was summoned to the capital.',
    'On dingchou day, Su Yuanchun was summoned to Beijing.',
  ],
  s0542: [
    'Summer, month 4, guiwei: an edict said: "Recently, because times are hard, the court has sought good government with tireless care and repeatedly ordered frontier officials to put everything in order.',
    'Summer month 4, guiwei: an edict said hard times made the court urge frontier officials to reform everything.',
  ],
  s0543: [
    'Soon reports came back on drilling troops, raising funds, baojia, militia, and granary storage; though not empty words, real results are still lacking.',
    'Reports on troops, funds, baojia, militia, and granaries were not empty talk but still lacked results.',
  ],
  s0544: [
    'Therefore frontier officials are again ordered to speedily undertake the tasks they have planned.',
    'Frontier officials were again told to start planned work at once.',
  ],
  s0545: [
    'They must still report truthfully whether there are results or not.',
    'They still had to report real results honestly.',
  ],
  s0546: [
    '" An additional order told frontier officials to inspect troops in earnest.',
    'The edict also told frontier officials to inspect troops seriously.',
  ],
  s0547: [
    'Another order told them to survey wasteland, encourage cultivation, not let clerks harass the people, and not hastily propose tax assessment.',
    'Another order told them to survey wasteland and encourage farming without clerk harassment or hasty taxation.',
  ],
  s0548: [
    'Italians came with warships intending to land at Sanmen Bay; strict guard was ordered.',
    'Italian warships came to land at Sanmen Bay and strict defense was ordered.',
  ],
  s0549: [
    'On day jichou, Gang Yi was ordered to go to the Jiangnan provinces to verify treasury receipts and disbursements.',
    'On jichou day, Gang Yi was sent to audit Jiangnan treasury accounts.',
  ],
  s0550: [
    'On day guisi, four infantry and cavalry battalions of Nie Shicheng\'s army were stationed at Rehe to strengthen the frontier.',
    'On guisi day, four Nie Shicheng battalions garrisoned Rehe for frontier defense.',
  ],
  s0551: [
    'On day bingshen, Liu Kunyi and others were ordered to mass heavy forces in readiness and to attack immediately if Italian troops landed.',
    'On bingshen day, Liu Kunyi and others were told to mass troops and strike any Italian landing.',
  ],
  s0552: [
    'On day dingyou, Surveillance Commissioner Li Guangjiu was ordered to supervise Zhejiang defense and suppression, and Changshun was sent to Jilin to inspect troop drilling.',
    'On dingyou day, Li Guangjiu supervised Zhejiang defense and Changshun inspected Jilin drilling.',
  ],
  s0553: [
    'On day yisi, an edict said: "Customs, likin, and salt levies have fixed annual quotas, yet frontier officials indulge favoritism and cannot vigorously remove long-standing abuses.',
    'On yisi day, an edict said customs, likin, and salt had fixed quotas but frontier officials would not end abuses.',
  ],
  s0554: [
    'Grand secretaries and Grand Council members are to examine this in detail and report."',
    'Grand secretaries and the Grand Council were to review the matter fully and report.',
  ],
  s0555: [
    '"',
    '"',
  ],
  s0556: [
    'Month 5, renzi: Wu Tingfen was assigned to serve at the foreign affairs yamen.',
    'In month 5, renzi, Wu Tingfen joined the foreign affairs yamen.',
  ],
  s0557: [
    'On day jiayin, the Shenji Camp arsenal powder magazine caught fire.',
    'On jiayin day, the Shenji Camp arsenal magazine burned.',
  ],
  s0558: [
    'On day yimao, Vice Minister of the Imperial Stud Yugeng was made envoy to France.',
    'On yimao day, Yugeng of the Imperial Stud became envoy to France.',
  ],
  s0559: [
    'On day yichou, Zhengding garrison commander Yang Yushu was ordered to command drilled troops stationed at Rehe.',
    'On yichou day, Yang Yushu of Zhengding garrison drilled troops at Rehe.',
  ],
  s0560: [
    'Land tax was remitted for flooded fields in Anhua, Wugang, and Xinning.',
    'Anhua, Wugang, and Xinning flooded fields were forgiven land tax.',
  ],
  s0561: [
    'On day jisi, Yuezhou was opened as a treaty port; the Yue-Chang-Li circuit intendant was moved there and also made supervisor of Yuezhou customs.',
    'On jisi day, Yuezhou opened as a treaty port and its intendant moved there as customs supervisor.',
  ],
  s0562: [
    'Month 6, wuzi: overdue taxes were remitted in districts subject to Urumqi and elsewhere.',
    'In month 6, wuzi, Urumqi districts and others were forgiven tax arrears.',
  ],
  s0563: [
    'On day dingyou, the navy was ordered to be rectified and accumulated abuses removed.',
    'On dingyou day, the navy was ordered reformed and abuses cleared.',
  ],
  s0564: [
    'On day gengzi, flood relief was given at Luling and other counties.',
    'On gengzi day, Luling and other counties received flood relief.',
  ],
  s0565: [
    'Autumn, month 7, day gengxu: because France leased Guangzhou Bay, Su Yuanchun was sent to join in the survey.',
    'Autumn month 7, gengxu: Su Yuanchun joined the Guangzhou Bay survey after France leased it.',
  ],
  s0566: [
    'On day yimao, a commercial treaty with Korea was concluded.',
    'On yimao day, a Korea trade treaty was signed.',
  ],
  s0567: [
    'On day dingsi, Qinhuangdao was opened as a treaty port.',
    'On dingsi day, Qinhuangdao opened as a treaty port.',
  ],
  s0568: [
    'On day jisi, Gang Yi was ordered to go to Guangdong to clear accounts and finances.',
    'On jisi day, Gang Yi was sent to Guangdong to audit finances.',
  ],
  s0569: [
    'On day gengwu, Su Yuanchun was ordered to drill troops at Huai and Xu under Ronglu\'s command.',
    'On gengwu day, Su Yuanchun drilled troops at Huai and Xu under Ronglu.',
  ],
  s0570: [
    'Month 8, dinghai: Hui rebellion at Haicheng, Gansu, was pacified by government troops.',
    'In month 8, dinghai, Gansu Haicheng Hui rebels were suppressed.',
  ],
  s0571: [
    'On day jihai, provinces were ordered to expound the Sacred Edict for Extensive Instruction.',
    'On jihai day, provinces were told to expound the Sacred Edict.',
  ],
  s0572: [
    'On day jiachen, bandit disorders at Jinzhou and Guangning were pacified.',
    'On jiachen day, Jinzhou and Guangning bandits were suppressed.',
  ],
  s0573: [
    'Month 9, dingwei: because of drought, an edict sought frank counsel.',
    'In month 9, dingwei, drought led the court to seek frank counsel.',
  ],
  s0574: [
    'On day gengxu, an edict ordered clearing lawsuits and deferring tax collection.',
    'On gengxu day, the court ordered suits cleared and taxes deferred.',
  ],
  s0575: [
    'Frontier officials were told to discipline themselves and their subordinates, uphold fairness, and follow public sentiment.',
    'Frontier officials were told to discipline subordinates, be fair, and heed public feeling.',
  ],
  s0576: [
    'On day jiwei, Vice Commander-in-chief Shouchang was stripped and banished for slackness in military duties; Ronghe was stripped and arrested for inquiry.',
    'On jiwei day, Shouchang was dismissed and banished for slack troops; Ronghe was arrested.',
  ],
  s0577: [
    'On day xinyou, Li Zhengyong was made commissioner for supervising Sichuan commercial mining.',
    'On xinyou day, Li Zhengyong supervised Sichuan commercial mining.',
  ],
  s0578: [
    'On day jiaxu, Italian warships continued to arrive; Zhili, Shandong, Jiangsu, and Zhejiang were ordered to guard strictly.',
    'On jiaxu day, more Italian warships came and Zhili, Shandong, Jiangsu, and Zhejiang were told to guard closely.',
  ],
  s0579: [
    'That autumn, flood relief was given in Zhejiang, Hunan, and Gansu; drought relief in Shaanxi.',
    'That autumn, Zhejiang, Hunan, and Gansu got flood relief and Shaanxi drought relief.',
  ],
  s0580: [
    'Winter, month 10, gengyin: Li Bingheng was ordered to inspect the Yangtze naval forces.',
    'Winter month 10, gengyin: Li Bingheng inspected the Yangtze navy.',
  ],
  s0581: [
    'On day bingshen, Li Hongzhang was made trade minister and ordered to inspect treaty ports.',
    'On bingshen day, Li Hongzhang became trade minister and inspected treaty ports.',
  ],
  s0582: [
    'On day renyin, overdue taxes from the previous year were remitted in Xianning, Shaanxi, and elsewhere.',
    'On renyin day, Shaanxi Xianning and others were forgiven last year\'s arrears.',
  ],
  s0583: [
    'Month 11, guichou: Vice Minister of the Imperial Stud Xu Shoupeng was made envoy to Korea.',
    'In month 11, guichou, Xu Shoupeng of the Imperial Stud became envoy to Korea.',
  ],
  s0584: [
    'On day jiayin, Liao Shouheng was removed as Grand Councilor; Zhao Shuqiao was ordered to study on duty under the Grand Councilors.',
    'On jiayin day, Liao Shouheng left the Grand Council and Zhao Shuqiao studied there on duty.',
  ],
  s0585: [
    'Overdue taxes from the previous year were remitted for Beiliu, which had been ravaged by bandits.',
    'Beiliu was forgiven last year\'s arrears after bandit raids.',
  ],
  s0586: [
    'On day renxu, the crimes of Kang Youwei and Liang Qichao were again publicized with heavy rewards for capture.',
    'On renxu day, Kang Youwei and Liang Qichao were again outlawed with large bounties.',
  ],
  s0587: [
    'On day wuchen, Sun Jianai was excused on grounds of illness.',
    'On wuchen day, Sun Jianai resigned for illness.',
  ],
  s0588: [
    'On day jisi, Minister of Revenue Wang Wenshao was made assistant Grand Secretary.',
    'On jisi day, Wang Wenshao of Revenue became assistant grand secretary.',
  ],
  s0589: [
    'Month 12, jiaxu new moon: an edict suspended the New Year ascent-of-the-hall banquet.',
    'Month 12, jiaxu new moon: the New Year hall banquet was canceled.',
  ],
  s0590: [
    'On day bingzi, the merit review was held; an edict forbade improper promotions.',
    'On bingzi day, the merit review was held with a ban on improper promotions.',
  ],
  s0591: [
    'On day yiyou, grain taxes were remitted for disaster-hit land in Yulin and elsewhere.',
    'On yiyou day, Yulin and other disaster districts were forgiven grain tax.',
  ],
  s0592: [
    'On day jichou, Su Yuanchun was removed from Jiangnan troop drilling and returned to his post as Guangxi provincial military commander.',
    'On jichou day, Su Yuanchun left Jiangnan drilling and resumed as Guangxi commander.',
  ],
  s0593: [
    'On day yimao, Chen Zelin was ordered to recruit braves stationed north of the Yangtze for training as the Vanguard Right Army of the Martial Guards.',
    'On yimao day, Chen Zelin raised braves north of the Yangtze as the Martial Guards Vanguard Right Army.',
  ],
  s0594: [
    'On day dingyou, an edict made Pujun, son of Prince Duan Zaiyi, heir to the Muzong line and enfeoffed as imperial son.',
    'On dingyou day, Zaiyi\'s son Pujun became Muzong\'s heir and an imperial son.',
  ],
  s0595: [
    'Chongqi was ordered to attend Hongde Hall and tutor Imperial Son Pujun.',
    'Chongqi was told to tutor Prince Pujun at Hongde Hall.',
  ],
  s0596: [
    'On day renyin, an edict said that for the three decadal birthdays next year, court congratulations and banquets would be suspended; only civil and military high officials might come to the capital to offer felicitations.',
    'On renyin day, next year\'s three decadal birthdays would have no court banquet; only top officials could come to congratulate.',
  ],
  s0597: [
    'A special examination cycle was proclaimed: provincial examinations in the gengzi year next year and metropolitan examinations in xinchou the year after.',
    'A special exam cycle was announced: gengzi provincial exams next year and xinchou metropolitan exams after.',
  ],
  s0598: [
    'The regular provincial and metropolitan examinations would be deferred to xinchou and renyin.',
    'Regular provincial and metropolitan exams were postponed to xinchou and renyin.',
  ],
  s0599: [
    'That winter, disaster relief was given in Shanxi, Yunnan, Shaanxi, Gansu, Shandong, and other districts.',
    'That winter, Shanxi, Yunnan, Shaanxi, Gansu, Shandong, and others received disaster relief.',
  ],
  s0600: [
    'That year, Guangzhou Bay was leased to France and the Yunnan-Vietnam railway was opened.',
    'That year France leased Guangzhou Bay and the Yunnan-Vietnam railway opened.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_024_b06.mjs <translation.json>'
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
