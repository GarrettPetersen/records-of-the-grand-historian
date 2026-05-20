#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day jisi, an edict ordered Peng Yulin to proceed to Guangdong to arrange defenses jointly with Zhang Shusheng.',
    'On jisi day, Peng Yulin was sent to Guangdong to plan defenses with Zhang Shusheng.',
  ],
  s0702: [
    'Ninth month, day xinsi: France and Vietnam made peace and concluded a new treaty.',
    'In month 9, xinsi, France and Vietnam made peace under a new treaty.',
  ],
  s0703: [
    'On day bingxu, He Ruzhang was ordered to supervise the Fujian naval dockyard; Ni Wenwei was made Guangdong governor; Xu Yanxu was made Guangxi governor.',
    'On bingxu day, He Ruzhang took Fujian\'s shipyard, Ni Wenwei became Guangdong governor, and Xu Yanxu Guangxi governor.',
  ],
  s0704: [
    'On day jihai, one hundred thousand taels from the Guangxi treasury were allotted to support Liu Yongfu\'s army.',
    'On jihai day, 100,000 taels from Guangxi were sent to Liu Yongfu\'s army.',
  ],
  s0705: [
    'On day dingwei, Tang Jiong was stripped of office for leading troops back to the province without authorization but was kept on duty.',
    'On dingwei day, Tang Jiong lost office for unauthorized withdrawal but stayed on duty.',
  ],
  s0706: [
    'That autumn, over fifty thousand shi of grain from Beijing granaries and grain transport, plus one hundred thousand taels from the treasury, were sent to relieve Shuntian and Zhili.',
    'That autumn, Beijing and transport grain and 100,000 taels relieved Shuntian and Zhili.',
  ],
  s0707: [
    'Fifty thousand shi of transport grain were retained to relieve Shandong.',
    '50,000 shi of transport grain were kept for Shandong relief.',
  ],
  s0708: [
    'Flood relief was given to Rehe, Changyang, Guo county, and other places.',
    'Rehe, Changyang, Guo county, and other places received flood relief.',
  ],
  s0709: [
    'Jiangnan disaster relief was continued.',
    'Jiangnan disaster relief continued.',
  ],
  s0710: [
    'Tenth month, winter, day wuchen: an edict ordered the Northern and Southern fleets and coastal provinces to hold strict readiness.',
    'In month 10, wuchen, northern and southern fleets and coastal provinces were put on strict alert.',
  ],
  s0711: [
    'On day xinwei, the Yellow River broke at Qidong, Putai, and Lijin.',
    'On xinwei day, the Yellow River broke at Qidong, Putai, and Lijin.',
  ],
  s0712: [
    'On day bingzi, an edict ordered Li Hongzhang to recommend military talent.',
    'On bingzi day, Li Hongzhang was told to recommend military talent.',
  ],
  s0713: [
    'Cen Yuying was ordered out of the pass to station at Son Tay; Tang Jiong returned to Yunnan to raise funds.',
    'Cen Yuying was posted beyond the pass at Son Tay; Tang Jiong went back to Yunnan to raise funds.',
  ],
  s0714: [
    'Eleventh month, day xinsi: Acting Left Vice Censor-in-Chief Zhang Peilun was assigned to serve at the Zongli Yamen.',
    'In month 11, xinsi, Acting Left Vice Censor Zhang Peilun was posted to the Zongli Yamen.',
  ],
  s0715: [
    'On day renwu, Xu Yanxu was urgently ordered out of the pass to coordinate support.',
    'On renwu day, Xu Yanxu was urgently told to leave the pass and coordinate support.',
  ],
  s0716: [
    'On day xinmao, inner and outer city gates were placed under strict guard.',
    'On xinmao day, inner and outer city gates were strictly guarded.',
  ],
  s0717: [
    'On day renchen, Vietnamese rebels killed the heir king Nguyen Phuc Thoi; Zhang Shusheng was ordered to suppress them, soon changed to Cen Yuying.',
    'On renchen day, rebels killed heir king Nguyen Phuc Thoi; Zhang Shusheng was ordered to suppress them, then Cen Yuying.',
  ],
  s0718: [
    'On day gengzi, by empress dowager decree: an asylum was set up at Qingjiang for disaster refugees; the Board of Revenue sent ten thousand taels; Shuntian-Zhili and Shandong each received forty thousand; Hubei thirty thousand; Anhui twenty thousand.',
    'On gengzi day, Qingjiang took refugees; the treasury sent 10,000 taels and larger grants to Shuntian-Zhili, Shandong, Hubei, and Anhui.',
  ],
  s0719: [
    'On day renyin, the French took Son Tay; Liu Yongfu withdrew.',
    'On renyin day, the French took Son Tay and Liu Yongfu withdrew.',
  ],
  s0720: [
    'On day guimao, Minister Wen Yu was impeached; his memorial showed accumulated salary of three hundred sixty thousand taels; he was ordered to donate one hundred thousand taels to the public purse.',
    'On guimao day, Wen Yu was impeached for 360,000 taels in accumulated salary and told to donate 100,000.',
  ],
  s0721: [
    'Lin Zhaoyuan was dismissed for empty treasury stores.',
    'Lin Zhaoyuan lost office over empty treasury stores.',
  ],
  s0722: [
    'Twelfth month, day wushen: snow prayers were held.',
    'In month 12, wushen, the court prayed for snow.',
  ],
  s0723: [
    'On day gengxu, the French attacked Bac Ninh and aimed at Qiongzhou.',
    'On gengxu day, the French attacked Bac Ninh and aimed at Qiongzhou.',
  ],
  s0724: [
    'Peng Yulin was ordered to summon Hunan-Hubei troops to join Wu Quanmei\'s squadron in strict defense; Yang Yuebin was recalled to Fujian for coastal defense.',
    'Peng Yulin summoned Hunan-Hubei troops to join Wu Quanmei\'s fleet; Yang Yuebin went to Fujian for coastal defense.',
  ],
  s0725: [
    'Government troops routed the French at Lang Son.',
    'Government troops routed the French at Lang Son.',
  ],
  s0726: [
    'On day jiwei, because disaster refugees from Shandong, Huai, and Xu gathered at Qingjiang, officials were ordered to comfort them and send them home when possible.',
    'On jiwei day, officials were told to comfort Shandong, Huai, and Xu refugees at Qingjiang and send them home when possible.',
  ],
  s0727: [
    'On day gengshen, Jiangxi was told to raise twenty thousand taels for Wang Debang\'s army.',
    'On gengshen day, Jiangxi was told to raise 20,000 taels for Wang Debang\'s army.',
  ],
  s0728: [
    'On day dingchou, the hereditary post of the late Grand Commander Chen Guorui was restored.',
    'On dingchou day, Chen Guorui\'s hereditary post was restored.',
  ],
  s0729: [
    'That winter, autumn levies were remitted in Shuntian-Zhili counties; quota taxes in Zhejiang disaster districts and military colonies were remitted.',
    'That winter, autumn levies were cut in Shuntian-Zhili and quota taxes in Zhejiang disaster districts.',
  ],
  s0730: [
    'Rent grain on wasteland in Shanxi\'s Fengtai and other counties was cancelled.',
    'Shanxi wasteland rent in Fengtai and other counties was cancelled.',
  ],
  s0731: [
    'That year, Korea and Vietnam sent tribute missions.',
    'That year Korea and Vietnam sent tribute.',
  ],
  s0732: [
    'Year 10, jiashen, spring, first month, day gengyin: Cen Yuying left Zhennan Pass for Hung Yen to command frontier forces.',
    'In year 10, spring month 1, gengyin, Cen Yuying left Zhennan Pass for Hung Yen to command frontier forces.',
  ],
  s0733: [
    'Second month, new moon on day dingwei: the French attacked Hung Yen; government troops beat them back.',
    'At the second-month new moon, dingwei, the French attacked Hung Yen and government troops drove them back.',
  ],
  s0734: [
    'Cen Yuying and Xu Yanxu advanced to recover Son Tay.',
    'Cen Yuying and Xu Yanxu advanced to recover Son Tay.',
  ],
  s0735: [
    'An edict strictly forbade crossing the border to disturb Vietnam.',
    'The court strictly forbade crossing the border to disturb Vietnam.',
  ],
  s0736: [
    'Fifty thousand shi of Jiangsu and Zhejiang transport grain each were kept for Tongzhou and Tianjin flood relief.',
    '50,000 shi of Jiangsu and Zhejiang transport grain each were kept for Tongzhou and Tianjin floods.',
  ],
  s0737: [
    'Soon thirty thousand shi from Beijing granaries were sent for Shuntian relief.',
    'Soon 30,000 shi from Beijing granaries went to Shuntian relief.',
  ],
  s0738: [
    'On day dingchou, the French took Bac Ninh; government troops fell back to Thai Nguyen.',
    'On dingchou day, the French took Bac Ninh and troops fell back to Thai Nguyen.',
  ],
  s0739: [
    'On day wuchen, Hunan Governor Pan Dingxin was ordered to Guangxi for defense planning.',
    'On wuchen day, Hunan Governor Pan Dingxin was sent to Guangxi for defense planning.',
  ],
  s0740: [
    'On day yihai, the French took Thai Nguyen; Xu Yanxu and Tang Jiong were stripped of office and arrested for questioning.',
    'On yihai day, the French took Thai Nguyen; Xu Yanxu and Tang Jiong were stripped and arrested.',
  ],
  s0741: [
    'Third month, day dinghai: Cen Yuying asked to be relieved of command over Hunan-Guangdong forces; it was denied.',
    'In month 3, dinghai, Cen Yuying\'s request to leave Hunan-Guangdong command was denied.',
  ],
  s0742: [
    'Because Thai Nguyen fell, Grand Commander Huang Guilan and Circuit Intendant Zhao Wo were stripped of office and arrested for questioning.',
    'After Thai Nguyen fell, Huang Guilan and Zhao Wo were stripped and arrested.',
  ],
  s0743: [
    'On day wuzi, by empress dowager decree: Prince Gong Yixin was dismissed from the Grand Council for delay and sent home to recover from illness; Grand Secretary Bao Yun retired at original rank; Associate Grand Secretaries Li Hongzao and Jing Lian were demoted two ranks; Works Minister Weng Tonghe was stripped but kept on duty.',
    'On wuzi day, Prince Gong left the council for delay; Bao Yun retired; Li Hongzao and Jing Lian were demoted; Weng Tonghe was stripped but kept duty.',
  ],
  s0744: [
    'Prince Li Shiduo, Revenue Ministers Elehebu and Yan Jingming, and Punishments Minister Zhang Zhiwan were made Grand Councilors.',
    'Prince Li Shiduo, Elehebu, Yan Jingming, and Zhang Zhiwan joined the Grand Council.',
  ],
  s0745: [
    'Works Vice Minister Sun Yuwen studied on the Grand Council.',
    'Works Vice Minister Sun Yuwen studied on the Grand Council.',
  ],
  s0746: [
    'On day jichou, by empress dowager decree: on important matters the Grand Council should consult Prince Chun.',
    'On jichou day, the Grand Council was told to consult Prince Chun on important matters.',
  ],
  s0747: [
    'On day renchen, Pan Dingxin was made Guangxi governor; Zhang Kaisong was made Yunnan governor.',
    'On renchen day, Pan Dingxin became Guangxi governor and Zhang Kaisong Yunnan governor.',
  ],
  s0748: [
    'Grand Commander Chen Degui lost a fort; Vice Commander Dang Minxuan fled in battle; both were ordered executed before the army.',
    'Chen Degui lost a fort and Dang Minxuan fled; both were executed before the army.',
  ],
  s0749: [
    'Prince Yi Zaidu was made inspection commissioner.',
    'Prince Yi Zaidu was made inspection commissioner.',
  ],
  s0750: [
    'Prince Yi Kuang was put in charge of the Zongli Yamen; Academician Zhou Derun served there.',
    'Yi Kuang took charge of the Zongli Yamen and Zhou Derun served there.',
  ],
  s0751: [
    'On day guisi, Left Superior Stud Sheng Yu, Right Superior Stud Xi Jun, and Censor Zhao Erxun memorialized that Prince Chun should not handle state secrets; no reply was given.',
    'On guisi day, Sheng Yu, Xi Jun, and Zhao Erxun said Prince Chun should not handle secrets; there was no reply.',
  ],
  s0752: [
    'Punishments Vice Minister Xu Gengshen studied on the Grand Council.',
    'Punishments Vice Minister Xu Gengshen studied on the Grand Council.',
  ],
  s0753: [
    'On day jiawu, an edict told Li Hongzhang, Zuo Zongtang, Zeng Guoquan, and Cen Yuying to recommend resolute, brave, strategic subordinates.',
    'On jiawu day, Li Hongzhang, Zuo Zongtang, Zeng Guoquan, and Cen Yuying were told to recommend able subordinates.',
  ],
  s0754: [
    'On day jihai, Yan Jingming and Xu Gengshen both served at the Zongli Yamen.',
    'On jihai day, Yan Jingming and Xu Gengshen both served at the Zongli Yamen.',
  ],
  s0755: [
    'Pan Dingxin was ordered to Zhennan Pass to take over Xu Yanxu\'s army.',
    'Pan Dingxin was sent to Zhennan Pass to take over Xu Yanxu\'s army.',
  ],
  s0756: [
    'On day gengzi, the French advanced and occupied Hung Yen.',
    'On gengzi day, the French advanced and occupied Hung Yen.',
  ],
  s0757: [
    'That spring, overdue salt-field levies in Renhe and arrears in Shaanxi\'s Xianning were remitted.',
    'That spring Renhe salt arrears and Xianning debts in Shaanxi were remitted.',
  ],
  s0758: [
    'Muping tribal chieftain\'s horse and fodder levies were remitted for ten years.',
    'Muping horse and fodder levies were remitted for ten years.',
  ],
  s0759: [
    'Summer, fourth month, day bingwu: demarcation of Xinjiang\'s southern border was completed.',
    'In month 4, bingwu, Xinjiang\'s southern border demarcation was completed.',
  ],
  s0760: [
    'Lecturer Xu Jingcheng was made minister plenipotentiary to France, Germany, Italy, and Austria.',
    'Xu Jingcheng was made envoy to France, Germany, Italy, and Austria.',
  ],
  s0761: [
    'On day gengxu: earlier, with the Franco-Vietnamese war urgent, French Admiral Fournier had customs director Detring propose peace.',
    'On gengxu day: earlier, with war urgent, Admiral Fournier had Detring propose peace.',
  ],
  s0762: [
    'Li Hongzhang reported it; approval was granted; he was ordered to arrange terms.',
    'Li Hongzhang reported it, the court approved, and he was told to arrange terms.',
  ],
  s0763: [
    'Now he replied that the court should weigh strength, hold firm, and await the moment.',
    'Now he said the court should weigh strength, hold firm, and await the moment.',
  ],
  s0764: [
    'An edict called a court conference.',
    'The court was ordered to confer.',
  ],
  s0765: [
    'By empress dowager decree, Prince Chun joined the deliberation.',
    'By empress dowager decree, Prince Chun joined the debate.',
  ],
  s0766: [
    'Wu Changqing\'s troops were allowed to return.',
    'Wu Changqing\'s troops were allowed to return.',
  ],
  s0767: [
    'On day xinhai, breaches at Lijin and elsewhere were closed.',
    'On xinhai day, breaches at Lijin and elsewhere were closed.',
  ],
  s0768: [
    'On day guichou, opening the Majia River was abandoned; the Xuanhui River was dredged; Dezhou canal dikes were repaired.',
    'On guichou day, the Majia River project was dropped, Xuanhui was dredged, and Dezhou dikes were repaired.',
  ],
  s0769: [
    'On day wuwu, Transmission Commissioner Wu Dacheng was assigned northern coastal affairs; Academician Chen Baochen southern affairs; Expositor Zhang Peilun Fujian coastal affairs; all might memorialize directly.',
    'On wuwu day, Wu Dacheng took the north, Chen Baochen the south, and Zhang Peilun Fujian; all could memorialize directly.',
  ],
  s0770: [
    'Soon Zhang Peilun gained third-rank courtier title.',
    'Soon Zhang Peilun gained third-rank courtier title.',
  ],
  s0771: [
    'Fournier offered five private articles; Li Hongzhang reported them.',
    'Fournier offered five private articles and Li Hongzhang reported them.',
  ],
  s0772: [
    'Li Hongzhang was charged to block trickery and stay vigilant.',
    'Li Hongzhang was told to block trickery and stay vigilant.',
  ],
  s0773: [
    'The Board of Revenue was ordered to cut waste.',
    'The Board of Revenue was told to cut waste.',
  ],
  s0774: [
    'On day gengshen, Li Hongzhang was made plenipotentiary to negotiate with the French envoy.',
    'On gengshen day, Li Hongzhang was made plenipotentiary to treat with the French envoy.',
  ],
  s0775: [
    'On day guihai, land tax on riverside fields in Baocheng was remitted.',
    'On guihai day, Baocheng riverside land tax was remitted.',
  ],
  s0776: [
    'On day yichou, rain prayers were held.',
    'On yichou day, the court prayed for rain.',
  ],
  s0777: [
    'On day bingyin, granary grain was again sent to relieve Shuntian.',
    'On bingyin day, granary grain again relieved Shuntian.',
  ],
  s0778: [
    'On day wuchen, Wu Dacheng declined northern coastal duty.',
    'On wuchen day, Wu Dacheng declined northern coastal duty.',
  ],
  s0779: [
    'The Emperor rebuked his evasive words and refused.',
    'The Emperor rebuked his evasive words and refused.',
  ],
  s0780: [
    'On day renshen, Zhang Shusheng asked sick leave from his regular post to command troops only; it was granted.',
    'On renshen day, Zhang Shusheng left his regular post for illness and commanded troops only.',
  ],
  s0781: [
    'Fifth month, day bingzi: Li Chengmo was ordered to command Jiangnan steam warships.',
    'In month 5, bingzi, Li Chengmo was ordered to command Jiangnan steam warships.',
  ],
  s0782: [
    'On day jimao, Cen Yuying resigned command over Guangdong and Hunan forces; it was granted.',
    'On jimao day, Cen Yuying resigned Guangdong and Hunan command and was allowed.',
  ],
  s0783: [
    'On day dinghai, Wen Yu was made Grand Secretary of the Hall of Military Glory.',
    'On dinghai day, Wen Yu became Grand Secretary of the Hall of Military Glory.',
  ],
  s0784: [
    'On day wuzi, Elehebu and Yan Jingming became associate grand secretaries while revenue ministers.',
    'On wuzi day, Elehebu and Yan Jingming became associate grand secretaries.',
  ],
  s0785: [
    'On day jichou, with prolonged drought in the capital, officials were told to sell grain at fair price.',
    'On jichou day, officials were told to sell grain fairly during capital drought.',
  ],
  s0786: [
    'Zhang Yinhuang, Daoguang of Huaining-Taiguang, received third-rank title and studied at the Zongli Yamen.',
    'Zhang Yinhuang received third-rank title and studied at the Zongli Yamen.',
  ],
  s0787: [
    'On day xinmao, an edict called for recommending civil and military talent nationwide.',
    'On xinmao day, civil and military talent were sought nationwide.',
  ],
  s0788: [
    'On day jiawu, for the empress dowager\'s fiftieth birthday, autumn executions were suspended.',
    'On jiawu day, autumn executions were suspended for the empress dowager\'s fiftieth birthday.',
  ],
  s0789: [
    'On day dingyou, an edict told all ministers to lead subordinates faithfully and not indulge in ease or display.',
    'On dingyou day, ministers were told to lead faithfully and not indulge in ease or display.',
  ],
  s0790: [
    'On day wuxu, Zuo Zongtang was again made Grand Councilor without daily attendance and was put in charge of the Shenji Camp.',
    'On wuxu day, Zuo Zongtang rejoined the council without daily attendance and managed the Shenji Camp.',
  ],
  s0791: [
    'Quota grain for Wuchang and Huangzhou garrisons was remitted.',
    'Wuchang and Huangzhou garrison quota grain was remitted.',
  ],
  s0792: [
    'On day renyin, an edict called for talent among imperial clansmen and banner hereditary offices.',
    'On renyin day, talent was sought among clansmen and banner hereditary offices.',
  ],
  s0793: [
    'Intercalary fifth month, day yisi: Works Minister Fu Kun, Lifan Minister Kungang, Censor-in-Chief Xi Zhen, Works Vice Minister Xu Yongyi, and Academician Liao Shouheng were assigned to the Zongli Yamen.',
    'In intercalary month 5, yisi, Fu Kun, Kungang, Xi Zhen, Xu Yongyi, and Liao Shouheng joined the Zongli Yamen.',
  ],
  s0794: [
    'On day dingwei, former Grand Commander Liu Mingchuan was put in charge of Taiwan; Xi Zhen, Liao Shouheng, Chen Baochen, and Wu Dacheng went to Tianjin to discuss the French treaty.',
    'On dingwei day, Liu Mingchuan took Taiwan; Xi Zhen, Liao Shouheng, Chen Baochen, and Wu Dacheng went to Tianjin on the French treaty.',
  ],
  s0795: [
    'On day gengxu, Taichang Qing Xu Shuming was ordered to survey a new canal at Xian county.',
    'On gengxu day, Xu Shuming was sent to survey a new canal at Xian county.',
  ],
  s0796: [
    'The French attacked Guanyinqiao; Pan Dingxin defeated them.',
    'The French attacked Guanyinqiao and Pan Dingxin defeated them.',
  ],
  s0797: [
    'On day xinhai, Shandong river dikes were completed.',
    'On xinhai day, Shandong river dikes were completed.',
  ],
  s0798: [
    'On day jiayin, because the French envoy spoke of peace, Pan Dingxin\'s forces were shifted back to Lang Son; Cen Yuying\'s army remained at Bao Thang.',
    'On jiayin day, with peace talks, Pan Dingxin\'s forces went back to Lang Son and Cen Yuying stayed at Bao Thang.',
  ],
  s0799: [
    'On day yimao, after no rain since the fourth month, rain finally fell this day.',
    'On yimao day, rain finally fell after drought since month 4.',
  ],
  s0800: [
    'Regulations for remitting and deferring taxes and grain were promulgated.',
    'Rules for remitting and deferring taxes and grain were promulgated.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_023_b08.mjs <translation.json>'
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
