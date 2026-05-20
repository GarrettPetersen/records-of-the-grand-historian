#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Liu Jintang\'s army captured Xiangyang Fort at Datong.',
    'Liu Jintang took Datong\'s Xiangyang Fort.',
  ],
  s0702: [
    'On day gengwu, because of the visit to the Eastern Tombs, Prince Dun and others were left in the capital to handle affairs.',
    'On gengwu day, Prince Dun and others stayed in Beijing for the Eastern Tombs visit.',
  ],
  s0703: [
    'On day yihai, Jin Shun\'s army reached Suzhou to suppress Hui rebels and defeated them.',
    'On yihai day, Jin Shun reached Suzhou, beat the Hui rebels, and drove them off.',
  ],
  s0704: [
    'Third month, day guiwei: the Emperor escorted the two Empresses Dowager to the Eastern Tombs.',
    'In month 3, guiwei, the Emperor took the two empresses dowager to the Eastern Tombs.',
  ],
  s0705: [
    'On day dinghai, the imperial procession returned.',
    'On dinghai day, the court returned from the tour.',
  ],
  s0706: [
    'Quota taxes for the current year were remitted along the imperial route.',
    'This year\'s quota taxes on the imperial route were remitted.',
  ],
  s0707: [
    'On day jichou, Hui communities at Datong, Bayan Rongge, and Wugong Salar all submitted.',
    'On jichou day, Hui groups at Datong, Bayan Rongge, and Wugong Salar surrendered.',
  ],
  s0708: [
    'Rebel chiefs at Xining including Ma Guiyuan were executed.',
    'Xining rebel leaders including Ma Guiyuan were executed.',
  ],
  s0709: [
    'On day gengyin, the Emperor escorted the two Empresses Dowager back to the palace.',
    'On gengyin day, the Emperor brought the two empresses dowager back to the palace.',
  ],
  s0710: [
    'On day bingshen, Hui rebels including Bai Yanhu fled into Ganzhou.',
    'On bingshen day, Bai Yanhu and other Hui rebels fled to Ganzhou.',
  ],
  s0711: [
    'An order was issued to deliberate the ceremonial for foreign ministers\' audiences.',
    'The court ordered debate on protocol for foreign ministers\' audiences.',
  ],
  s0712: [
    'Rong Quan asked sick leave; it was refused.',
    'Rong Quan\'s sick leave was denied.',
  ],
  s0713: [
    'On day gengzi, Yinglian was made assistant minister at Tarbagatai.',
    'On gengzi day, Yinglian became Tarbagatai assistant minister.',
  ],
  s0714: [
    'On day dingwei, Yunnan forces captured Shunning.',
    'On dingwei day, Yunnan troops took Shunning.',
  ],
  s0715: [
    'That spring, overdue taxes from disturbance were remitted in Pizhou, Jiangsu, Fuzhou, Shaanxi, and other affected districts.',
    'That spring, Pizhou, Jiangsu, Fuzhou, Shaanxi, and other disturbed districts were forgiven overdue taxes.',
  ],
  s0716: [
    'Summer, fourth month, day yimao: a customs house was established at Beihai, Lianzhou.',
    'In summer, month 4, yimao, a Beihai customs house was set up at Lianzhou.',
  ],
  s0717: [
    'On day bingchen, the treaty revision with Japan was completed.',
    'On bingchen day, the revised treaty with Japan was concluded.',
  ],
  s0718: [
    'On day yichou, Hui rebels fled into the Alashan banner and Abirmite; Ding An was ordered to send troops to join frontier forces in a pincer attack.',
    'On yichou day, Hui rebels fled into Alashan and Abirmite; Ding An was told to join frontier troops in a pincer.',
  ],
  s0719: [
    'On day jisi, government troops captured the rebel nest at Taerwan, Suzhou.',
    'On jisi day, government forces took the Taerwan rebel nest at Suzhou.',
  ],
  s0720: [
    'Fifth month, day gengyin: Yunnan forces captured Yunzhou.',
    'In month 5, gengyin, Yunnan forces took Yunzhou.',
  ],
  s0721: [
    'On day dingyou, audiences for foreign ministers were approved.',
    'On dingyou day, foreign ministers were allowed to audience.',
  ],
  s0722: [
    'On day guimao, Cheng Lu was handed to the Ministry of Punishments for trial.',
    'On guimao day, Cheng Lu was sent to the Ministry of Punishments.',
  ],
  s0723: [
    'On day bingwu, Cheng Rui was ordered to act as Urumqi provincial commander.',
    'On bingwu day, Cheng Rui was ordered to act as Urumqi commander.',
  ],
  s0724: [
    'Sixth month, day renzi: the Emperor went to Yingtai; Japanese envoy Soejima Taneomi, Russian envoy Vlangaly, American minister Low, British minister Wade, French minister Rémer, and Dutch minister Fison had audience at Ziguang Pavilion and presented their credentials.',
    'In month 6, renzi, at Yingtai the Emperor received Soejima, Vlangaly, Low, Wade, Rémer, and Fison at Ziguang Pavilion with their credentials.',
  ],
  s0725: [
    'On day gengshen, Jin Shun was strictly urged to leave the pass and advance.',
    'On gengshen day, Jin Shun was sharply ordered out of the pass.',
  ],
  s0726: [
    'On day dingmao, Gansu troops recovered Xunhua; rebel leaders including Ma Yulian were executed.',
    'On dingmao day, Gansu forces retook Xunhua and executed Ma Yulian and other chiefs.',
  ],
  s0727: [
    'Intercalary sixth month, day jiashen: Li Hongzhang replied that the old courses of the Yellow and transport rivers through Huai and Xu were hard to restore and asked to continue sea transport.',
    'On intercalary month 6, jiashen, Li Hongzhang said the Huai-Xu river routes could not be restored and asked to keep sea transport.',
  ],
  s0728: [
    'Dried-up land of the old riverbeds was to be assessed for tax increase as appropriate.',
    'Tax on the dried old riverbeds was to be raised as appropriate.',
  ],
  s0729: [
    'The proposal was adopted.',
    'The plan was approved.',
  ],
  s0730: [
    'On day bingxu, Zhu Fengbiao died.',
    'On bingxu day, Zhu Fengbiao died.',
  ],
  s0731: [
    'Yunnan forces captured Tengyue; Cen Yuying was given first-rank Light Chariot Commandant; Liu Yuezhao was awarded the yellow riding jacket; Yang Yuke was given first-rank Light Chariot Commandant.',
    'Yunnan took Tengyue; Cen Yuying gained first-rank Light Chariot Commandant, Liu Yuezhao a yellow jacket, and Yang Yuke first-rank Light Chariot Commandant.',
  ],
  s0732: [
    'Because the Yunnan war had lasted eighteen years and many districts had been ravaged, an edict remitted grain-tax arrears before the eleventh year and permanently stopped the grain levy for troop support.',
    'After eighteen years of war in Yunnan, arrears before year 11 were forgiven and the troop-support grain levy was ended forever.',
  ],
  s0733: [
    'Liu Yuezhao was instructed to choose prefects and magistrates carefully, inspect officials, and settle the people.',
    'Liu Yuezhao was told to pick good magistrates, watch officials, and calm the people.',
  ],
  s0734: [
    'On day jiawu, prolonged rain in the capital region led the Emperor to pray for clear weather.',
    'On jiawu day, the Emperor prayed for sun after long rain around the capital.',
  ],
  s0735: [
    'On day bingshen, an edict ordered investigation of unauthorized per-mou levies, lijin, and grain-transport surcharges in each province, to be progressively abolished.',
    'On bingshen day, an edict told each province to find and abolish illegal mou levies, lijin, and transport surcharges.',
  ],
  s0736: [
    'On day gengzi, Gansu forces fought Bai Yanhu and others at Dunhuang, were defeated, and Vice Commander Li Tianhe and others died.',
    'On gengzi day, Gansu troops lost to Bai Yanhu at Dunhuang; Vice Commander Li Tianhe and others fell.',
  ],
  s0737: [
    'The Yongding River breached.',
    'The Yongding River broke its banks.',
  ],
  s0738: [
    'Tribute sable from the seven banners of Altai Uriankhai was remitted.',
    'Sable tribute from Altai Uriankhai\'s seven banners was remitted.',
  ],
  s0739: [
    'Autumn, seventh month, day xinhai: Guangxi forces suppressed rebels in Xilin and Xilong and pacified them.',
    'In autumn, month 7, xinhai, Guangxi troops cleared Xilin and Xilong rebels.',
  ],
  s0740: [
    'On day jiazi, Shuntian disaster victims were given relief.',
    'On jiazi day, Shuntian flood victims were relieved.',
  ],
  s0741: [
    'That month, new and old quota taxes were remitted for Qingcheng, Shandong, after flooding.',
    'That month, Qingcheng, Shandong, was forgiven new and old quota taxes after floods.',
  ],
  s0742: [
    'Eighth month, new moon day dingchou: Duxing\'a asked sick leave; he was urged to stay on.',
    'At the month-8 new moon, dingchou, Duxing\'a asked to quit for illness but was kept on.',
  ],
  s0743: [
    'On day xinsi, the Grand Canal dyke in Zhili breached.',
    'On xinsi day, the Zhili Grand Canal embankment broke.',
  ],
  s0744: [
    'Rong Quan again asked to be excused for illness; it was refused.',
    'Rong Quan again asked sick leave and was refused.',
  ],
  s0745: [
    'Fu He was guilty and stripped of office.',
    'Fu He was found guilty and dismissed.',
  ],
  s0746: [
    'On day wuzi, Bai Yanhu and others captured the Magunying camp fort.',
    'On wuzi day, Bai Yanhu took the Magunying camp.',
  ],
  s0747: [
    'Liu Yuezhao was summoned to audience; Cen Yuying was ordered to act additionally as Yunnan-Guizhou governor-general.',
    'Liu Yuezhao was called to court; Cen Yuying also acted as Yunnan-Guizhou governor-general.',
  ],
  s0748: [
    'On day renchen, Bai Yanhu and others besieged Hami and raided Barkol; government troops were defeated.',
    'On renchen day, Bai Yanhu besieged Hami and raided Barkol; government forces lost.',
  ],
  s0749: [
    'On day yiwei, Jing Lian was ordered to lead troops to reinforce; Xilun was transferred as Urumqi commandery vice director; Mingchun was made assistant commissioner at Hami.',
    'On yiwei day, Jing Lian was sent to reinforce; Xilun became Urumqi vice director and Mingchun Hami assistant commissioner.',
  ],
  s0750: [
    'That month, flood relief was given in Zhili districts, Yongshun prefecture, and Gong\'an.',
    'That month, floods in Zhili, Yongshun, and Gong\'an were relieved.',
  ],
  s0751: [
    'Ninth month, day bingyin: Grand Council ministers were ordered to join the Ministry of Punishments in deliberating Cheng Lu\'s sentence.',
    'In month 9, bingyin, the Grand Council joined Punishments to sentence Cheng Lu.',
  ],
  s0752: [
    'On day guiyou, the Yongding River breach was closed.',
    'On guiyou day, the Yongding breach was sealed.',
  ],
  s0753: [
    'Winter, tenth month, new moon day bingzi: Censor Shen Huai memorialized to postpone rebuilding the Old Summer Palace.',
    'In winter, month 10 new moon, bingzi, Censor Shen Huai asked to delay Yuanmingyuan repairs.',
  ],
  s0754: [
    'The Imperial Household Department was told to repair only the Anyou Palace as residence; other work was stopped.',
    'The Household Department was told to ready only Anyou Palace and stop other building.',
  ],
  s0755: [
    'On day jihai, government troops captured Suzhou; rebel Ma Wenlu was executed.',
    'On jihai day, government forces took Suzhou and executed Ma Wenlu.',
  ],
  s0756: [
    'The Emperor went to congratulate the two Empresses Dowager on the victory.',
    'The Emperor congratulated the two empresses dowager on the victory.',
  ],
  s0757: [
    'On day gengzi, for merit, Zuo Zongtang as Shaanxi-Gansu governor-general was made associate Grand Secretary and given one additional grade of Light Chariot Commandant;',
    'On gengzi day, Zuo Zongtang was made associate Grand Secretary with an added Light Chariot Commandant grade;',
  ],
  s0758: [
    'Jin Shun\'s office was restored and his yellow jacket returned;',
    'Jin Shun\'s post and yellow jacket were restored;',
  ],
  s0759: [
    'Xu Zhanbiao and Mutushan were granted Captaincy of Cloud Cavalry.',
    'Xu Zhanbiao and Mutushan received Cloud Cavalry captaincies.',
  ],
  s0760: [
    'Eleventh month, day jiwei: the king of Vietnam memorialized requesting joint suppression of bandits in the border regions of Heyang, Xinghua, Shanxi, and Xuangang.',
    'In month 11, jiwei, Vietnam asked for joint action against bandits in Heyang, Xinghua, Shanxi, and Xuangang.',
  ],
  s0761: [
    'Liu Changyou and Feng Zicai were instructed to deliberate and memorial.',
    'Liu Changyou and Feng Zicai were told to report a plan.',
  ],
  s0762: [
    'On day xinyou, France and Vietnam clashed; French troops took Hanoi city; Vietnamese rebels harassed Beining.',
    'On xinyou day, France and Vietnam fought; the French took Hanoi and rebels troubled Beining.',
  ],
  s0763: [
    'The Vietnamese sought aid.',
    'Vietnam asked China for help.',
  ],
  s0764: [
    'Ruilin was told to drive his army out from Qinzhou to join Guangxi forces in relief and suppression.',
    'Ruilin was ordered out from Qinzhou with Guangxi troops to help suppress the rebels.',
  ],
  s0765: [
    'On day jiazi, Censor Wu Kedu asked that Cheng Lu receive the proper statutory punishment.',
    'On jiazi day, Censor Wu Kedu demanded Cheng Lu face the full penalty.',
  ],
  s0766: [
    'On day jisi, Cen Yuying memorialized on rectifying administration and the army camps, and asked to dismiss braves and stop levies, beginning in Yunnan.',
    'On jisi day, Cen Yuying asked to fix officials and troops and end braves and levies, starting in Yunnan.',
  ],
  s0767: [
    'An edict praised this.',
    'The court praised the proposal.',
  ],
  s0768: [
    'On day gengwu, the Grand Canal was dredged.',
    'On gengwu day, the Grand Canal was dredged.',
  ],
  s0769: [
    'On day renshen, Cheng Lu was sentenced to decapitation.',
    'On renshen day, Cheng Lu was sentenced to death.',
  ],
  s0770: [
    'Wu Kedu was demoted for overhearing court discussions.',
    'Wu Kedu was reduced in rank for eavesdropping on court business.',
  ],
  s0771: [
    'Twelfth month, day jiashen: Hui rebels raided Uriankhai and other departments; Xilun\'s army pursued and defeated them.',
    'In month 12, jiashen, Hui rebels raided Uriankhai; Xilun pursued and beat them.',
  ],
  s0772: [
    'On day wuzi, because Shuntian graduate Xu Jingchun\'s examination paper in reassessment was absurd, examiners including Minister Quanqing and Censor-in-chief Hu Jiayu were degraded to varying degrees.',
    'On wuzi day, Xu Jingchun\'s absurd Shuntian paper cost examiners Quanqing, Hu Jiayu, and others demotions.',
  ],
  s0773: [
    'On day xinmao, Elehebu was ordered to proceed to Uliassutai to investigate affairs.',
    'On xinmao day, Elehebu was sent to Uliassutai to investigate.',
  ],
  s0774: [
    'On day bingshen, the late General Liu Songshan was posthumously given first-rank Light Chariot Commandant.',
    'On bingshen day, the late Liu Songshan received first-rank Light Chariot Commandant.',
  ],
  s0775: [
    'Zhang Yao and Jin Shun were ordered to advance west with divided armies.',
    'Zhang Yao and Jin Shun were told to march west in separate columns.',
  ],
  s0776: [
    'On day renyin, for the Empress Dowager Cixi\'s fortieth-birthday celebration, grace was extended to collateral princes and Chinese and foreign officials with rewards of varying rank.',
    'On renyin day, Cixi\'s fortieth birthday brought graded rewards to princes and officials at home and abroad.',
  ],
  s0777: [
    'That year, Korea sent tribute.',
    'That year Korea paid tribute.',
  ],
  s0778: [
    'Year 13, spring, first month new moon day yisi: banquet feasts were suspended.',
    'In year 13, spring, month 1 new moon yisi, court banquets were suspended.',
  ],
  s0779: [
    'On day jiayin, Hunan troops suppressed Miao bandits at Guzhou and pacified them.',
    'On jiayin day, Hunan forces cleared Guzhou Miao bandits.',
  ],
  s0780: [
    'On day bingchen, Compiler Zhang Yinglin and Reviser Wang Qingqi were assigned duty at the Hongde Hall.',
    'On bingchen day, Zhang Yinglin and Wang Qingqi were posted to Hongde Hall.',
  ],
  s0781: [
    'On day xinyou, because Liu Kunyi and Hu Jiayu had impeached each other, Kunyi was reduced three grades in cap rank, stripped of office but retained in post; Jiayu was cut five grades and transferred.',
    'On xinyou day, mutual impeachment cost Liu Kunyi three cap grades and nominal dismissal while Hu Jiayu lost five grades and was transferred.',
  ],
  s0782: [
    'On day guihai, an edict ordered construction of the long dyke at Dongming.',
    'On guihai day, the court ordered Dongming\'s long embankment built.',
  ],
  s0783: [
    'On day jisi, government troops aiding at Shashanzi struck Hui rebels and won; Fuzhuli was awarded the yellow jacket.',
    'On jisi day, troops at Shashanzi beat Hui rebels and Fuzhuli won a yellow jacket.',
  ],
  s0784: [
    'Second month, day jimao: Hui rebels harassed the Barkol frontier; Mingchun and others jointly suppressed them.',
    'In month 2, jimao, Hui rebels raided Barkol; Mingchun and others suppressed them.',
  ],
  s0785: [
    'On day bingshen, because France had seized Vietnamese territory and Vietnamese rebels harassed Shanxi, pressing the Yunnan border, Cen Yuying was instructed to deploy frontier defenses.',
    'On bingshen day, French gains and rebels in Vietnam near Yunnan led the court to tell Cen Yuying to fortify the border.',
  ],
  s0786: [
    'Private coining was forbidden in the capital.',
    'Beijing private coining was banned.',
  ],
  s0787: [
    'On day dingyou, the Emperor escorted the two Empresses to the Western Tombs.',
    'On dingyou day, the Emperor took the two empresses to the Western Tombs.',
  ],
  s0788: [
    'Third month, day jiachen: return to the palace.',
    'In month 3, jiachen, the court returned to the palace.',
  ],
  s0789: [
    'On day yisi, disaster victims in Fengtian were given relief.',
    'On yisi day, Fengtian disaster victims were relieved.',
  ],
  s0790: [
    'On day bingwu, Baojun was made associate Grand Secretary.',
    'On bingwu day, Baojun became associate Grand Secretary.',
  ],
  s0791: [
    'On day jiyou, the stone sea-wall at Haining was repaired.',
    'On jiyou day, Haining\'s stone seawall was repaired.',
  ],
  s0792: [
    'On day xinyou, for merit in clearing Guizhou, Tao Maolin was restored as provincial commander; Generals He Shihua and others received hereditary offices.',
    'On xinyou day, clearing Guizhou restored Tao Maolin as commander and gave He Shihua and others hereditary ranks.',
  ],
  s0793: [
    'On day xinwei, Japanese warships anchored at Amoy; Shen Baozhen was instructed to command the navy and proceed there to act as circumstances required.',
    'On xinwei day, Japanese ships reached Amoy; Shen Baozhen was told to take the fleet and handle it as needed.',
  ],
  s0794: [
    'Li Hongzhang was ordered to confer with the Peruvian minister on Chinese laborers.',
    'Li Hongzhang was told to meet the Peruvian minister on Chinese workers.',
  ],
  s0795: [
    'Summer, fourth month, day jiaxu: the treasury allotted 100,000 taels to comfort tribes afflicted by disaster and disturbance at Uliassutai.',
    'In summer, month 4, jiaxu, 100,000 taels were sent to comfort Uliassutai tribes hit by disaster.',
  ],
  s0796: [
    'On day dingchou, the Emperor went to Yingtai.',
    'On dingchou day, the Emperor went to Yingtai.',
  ],
  s0797: [
    'Shan Maoqian asked retirement for illness; it was granted.',
    'Shan Maoqian retired for illness.',
  ],
  s0798: [
    'He received an audience with Russian envoy Bazanov and others at Ziguang Pavilion.',
    'The Emperor received Bazanov and other Russian envoys at Ziguang Pavilion.',
  ],
  s0799: [
    'On day xinsi, the Emperor visited the Yuanmingyuan and returned to the palace.',
    'On xinsi day, the Emperor visited Yuanmingyuan and returned to the palace.',
  ],
  s0800: [
    'On day guiwei, Hui rebels from Manas attacked Kuitun and other places; the advancing government army was defeated; Jing Lian\'s troops went to reinforce.',
    'On guiwei day, Manas Hui rebels hit Kuitun; the advance force lost and Jing Lian marched to help.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b08.mjs <translation.json>'
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
