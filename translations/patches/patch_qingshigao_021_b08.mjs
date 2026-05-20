#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'On day guimao, Canton rebels captured Jiangpu.',
    'On guimao day, Taiping rebels took Jiangpu.',
  ],
  s0702: [
    'Canton rebels in Guangdong held Xinyi; Kunshou suppressed them.',
    'Guangdong rebels held Xinyi; Kunshou suppressed them.',
  ],
  s0703: [
    'On day jiachen, eastern Zhejiang was pacified; land tax and grain transport were remitted for two years in each newly recovered prefecture, department, and county.',
    'On jiachen day, eastern Zhejiang was cleared; two years of taxes and grain transport were remitted in recovered districts.',
  ],
  s0704: [
    'On day yisi, Yan Jingming was ordered to proceed to Dongchang to manage military affairs.',
    'On yisi day, Yan Jingming was sent to Dongchang for military affairs.',
  ],
  s0705: [
    'Hui rebel Ma Hualong gathered followers to besiege Lingzhou, then soon went to Guyuan to submit.',
    'Ma Hualong rallied Hui rebels to besiege Lingzhou, then submitted at Guyuan.',
  ],
  s0706: [
    'Shi Dakai raided from Yunnan into Yiyong.',
    'Shi Dakai fled from Yunnan into Yiyong.',
  ],
  s0707: [
    'On day bingwu, an edict ordered frontier officials to choose prefects and magistrates carefully, lighten taxes and corvée, delete burdensome regulations, and start anew with the people.',
    'On bingwu day, an edict told frontier officials to pick good magistrates, lighten taxes, cut red tape, and renew ties with the people.',
  ],
  s0708: [
    'That month, two years of overdue taxes from military disturbance in Qingshen were remitted.',
    'That month, two years of Qingshen arrears from troop disturbances were remitted.',
  ],
  s0709: [
    'Third month, day wushen: advance collection of taxes and grain in Henan was again forbidden.',
    'In month 3, wushen, advance tax collection in Henan was again banned.',
  ],
  s0710: [
    'On day xinhai, Chonghou was ordered back to his post as commissioner for trade at the three ports.',
    'On xinhai day, Chonghou returned to the three-port trade commission.',
  ],
  s0711: [
    'On day renzi, Liu Changyou was ordered to command all armies in Zhili.',
    'On renzi day, Liu Changyou took command of Zhili armies.',
  ],
  s0712: [
    'Shen Baozhen was instructed that in handling foreign relations he should be even-handed and not let the gentry stir up trouble.',
    'Shen Baozhen was told to handle foreign affairs fairly and keep gentry from provoking incidents.',
  ],
  s0713: [
    'On day guichou, Zeng Guofan was instructed to coordinate overall military affairs north of the Yangtze.',
    'On guichou day, Zeng Guofan was told to coordinate military affairs north of the Yangtze.',
  ],
  s0714: [
    'On day yimao, Canton rebels in southern Shaanxi captured Ziyang and soon it was recovered.',
    'On yimao day, Canton rebels in southern Shaanxi took Ziyang, then lost it again.',
  ],
  s0715: [
    'Western-border rebels in Yunnan attacked Kunming; Pan Duo died in the fighting.',
    'Yunnan western rebels attacked Kunming; Pan Duo died.',
  ],
  s0716: [
    'Jia Hongzhao was made Yunnan governor.',
    'Jia Hongzhao became Yunnan governor.',
  ],
  s0717: [
    'On day bingchen, Li Hongzhang\'s army captured Fukou Pass.',
    'On bingchen day, Li Hongzhang\'s army took Fukou Pass.',
  ],
  s0718: [
    'British commander Gordon was ordered to discipline the Ever-Victorious Army.',
    'Gordon was ordered to discipline the Ever-Victorious Army.',
  ],
  s0719: [
    'On day dingsi, Nien bandits captured Macheng; on day wuwu they pressed the provincial walls of Wuchang.',
    'On dingsi day, Nien bandits took Macheng; on wuwu they threatened Wuchang.',
  ],
  s0720: [
    'Chu and Yu were ordered to combine armies for attack and suppression.',
    'Hubei and Henan were ordered to join forces against the rebels.',
  ],
  s0721: [
    'On day jiwei, land tax and grain transport in Xi\'an, Zhejiang were remitted for two years.',
    'On jiwei day, two years of Xi\'an, Zhejiang taxes and grain transport were remitted.',
  ],
  s0722: [
    'On day gengshen, Denmark sent Minister Lasnave to negotiate a commercial treaty.',
    'On gengshen day, Denmark sent Lasnave to negotiate a trade treaty.',
  ],
  s0723: [
    'Foreign commander D\'Estaing died in battle and received generous condolence grants.',
    'Foreign commander D\'Estaing died in battle and was generously compensated.',
  ],
  s0724: [
    'Hui rebels besieged Pingliang.',
    'Hui rebels besieged Pingliang.',
  ],
  s0725: [
    'Because suppression of bandits in Gansu had dragged on, Acting Provincial Commander Ding An was stripped of office and arrested for trial.',
    'Gansu suppression lagged; Acting Commander Ding An was stripped and arrested.',
  ],
  s0726: [
    'On day jiazi, Qiling was transferred to Fuzhou general.',
    'On jiazi day, Qiling became Fuzhou general.',
  ],
  s0727: [
    'Zuo Zongtang was made governor-general of Fujian and Zhejiang with command over military affairs in both provinces.',
    'Zuo Zongtang became Fujian-Zhejiang governor-general with command of both provinces.',
  ],
  s0728: [
    'Zeng Guoquan was made Zhejiang governor but still commanded troops to take Jinling; Zongtang also held the post in commission.',
    'Zeng Guoquan became Zhejiang governor while still besieging Jinling; Zongtang held the post in commission.',
  ],
  s0729: [
    'This year\'s tribute examinations in Fujian were suspended.',
    'Fujian\'s annual tribute examinations were suspended.',
  ],
  s0730: [
    'On day yichou, princes and ministers were ordered to review anew Sheng Bao\'s case.',
    'On yichou day, princes and ministers were to re-examine Sheng Bao\'s case.',
  ],
  s0731: [
    'Canton rebels from Ningguo raided into Dongliu and Jiande.',
    'Ningguo Canton rebels raided Dongliu and Jiande.',
  ],
  s0732: [
    'Qin scholar Mao Heng and Ming scholar Lü Zhe were granted posthumous place in the Confucian temple.',
    'Mao Heng of Qin and Lü Zhe of Ming were added to the Confucian temple.',
  ],
  s0733: [
    'On day bingyin, Nien chief Jia Wenbin was executed.',
    'On bingyin day, Nien leader Jia Wenbin was executed.',
  ],
  s0734: [
    'Canton rebels in southern Shaanxi captured Mian County.',
    'Southern Shaanxi Canton rebels took Mian County.',
  ],
  s0735: [
    'Guizhou Provincial Commander Luo Xiaolian\'s army recovered Dingfan, Changzhai, Dushan, and Libo.',
    'Guizhou Commander Luo Xiaolian recovered Dingfan, Changzhai, Dushan, and Libo.',
  ],
  s0736: [
    'On day dingmao, for the lost cities of Jiangpu and others, Zeng Guofan fined Jin Jun one rank and stripped Li Shizhong of his assistant-command post.',
    'On dingmao day, for losing Jiangpu and other cities, Zeng Guofan degraded Jin Jun one rank and stripped Li Shizhong of his assistant post.',
  ],
  s0737: [
    'Wu Tang was fully appointed Grand Canal transport governor while still commanding military affairs north of the Yangtze.',
    'Wu Tang was confirmed as canal transport governor while still commanding northern Jiangsu forces.',
  ],
  s0738: [
    'An edict ordered gentle care for refugees north of the Yangtze.',
    'An edict ordered relief for refugees north of the Yangtze.',
  ],
  s0739: [
    'On day jisi, the Longevity Festival — congratulations were not received.',
    'On jisi day, the Longevity Festival was held without receiving congratulations.',
  ],
  s0740: [
    'On day gengwu, Miao Peilin rebelled again.',
    'On gengwu day, Miao Peilin rebelled again.',
  ],
  s0741: [
    'Guan Wen and others intercepted and suppressed rebels raiding from Qizhou.',
    'Guan Wen and others intercepted Qizhou raiders.',
  ],
  s0742: [
    'On day guiyou, Xu Zhiming was stripped of office and arrested for trial.',
    'On guiyou day, Xu Zhiming was stripped and arrested.',
  ],
  s0743: [
    'Pan Duo was granted a hereditary office for his descendants.',
    'Pan Duo received a hereditary office for his line.',
  ],
  s0744: [
    'Because rain had been scarce, an edict ordered review of imprisoned cases.',
    'Scarce rain brought an edict to review prison cases.',
  ],
  s0745: [
    'On day jiaxu, Fu Ji and Jing Wen were ordered to investigate the affair that provoked trouble in Tibet.',
    'On jiaxu day, Fu Ji and Jing Wen were sent to investigate the Tibet provocation.',
  ],
  s0746: [
    'On day yihai, Li Hongzhang\'s army recovered Taicang.',
    'On yihai day, Li Hongzhang\'s army retook Taicang.',
  ],
  s0747: [
    'Hui rebels rioted in Longde.',
    'Hui rebels rose in Longde.',
  ],
  s0748: [
    'Huang Guorui\'s army pacified staff-bandits in Yizhou.',
    'Huang Guorui pacified club-bandits in Yizhou.',
  ],
  s0749: [
    'On day bingzi, an edict ordered investigation and relief for loyal Hui people killed in Shaanxi and Gansu; soon Yunnan was likewise ordered.',
    'On bingzi day, an edict ordered relief for loyal Hui killed in Shaanxi and Gansu; Yunnan followed.',
  ],
  s0750: [
    'That month, the Emperor repeatedly prayed for rain at the Dagao Hall.',
    'That month the Emperor repeatedly prayed for rain at Dagao Hall.',
  ],
  s0751: [
    'Summer, fourth month, day wuyin: Censor Wu Taisou was stripped of office for memorializing in defense of Sheng Bao.',
    'In summer, month 4, wuyin, Censor Wu Taisou was stripped for defending Sheng Bao.',
  ],
  s0752: [
    'Miao Peilin captured Huaiyuan.',
    'Miao Peilin took Huaiyuan.',
  ],
  s0753: [
    'Shandong bandit Liu Depei held Zichuan.',
    'Shandong bandit Liu Depei held Zichuan.',
  ],
  s0754: [
    'On day jimao, government troops suppressed bandits south of the capital; Zhang Xizhu and others fled to Gaotang and were soon executed.',
    'On jimao day, troops suppressed bandits south of the capital; Zhang Xizhu fled to Gaotang and was executed.',
  ],
  s0755: [
    'On day gengchen, Canton and Nien rebels raided Lu, Tong, Shu and Huangzhou.',
    'On gengchen day, Canton and Nien rebels raided Lu, Tong, Shu, and Huangzhou.',
  ],
  s0756: [
    'Zeng Guofan was instructed to hold Anqing and not lift the siege of Jinling.',
    'Zeng Guofan was told to hold Anqing and keep the Jinling siege.',
  ],
  s0757: [
    'On day renwu, Duo Longa\'s army captured the Xiaoyi bandit nest.',
    'On renwu day, Duo Longa took the Xiaoyi rebel nest.',
  ],
  s0758: [
    'Liu Rong was ordered to command troops to aid Shaanxi.',
    'Liu Rong was ordered to lead troops to aid Shaanxi.',
  ],
  s0759: [
    'Registered grain taxes in Zhejiang places that had fallen were remitted.',
    'Registered grain taxes in fallen Zhejiang districts were remitted.',
  ],
  s0760: [
    'On day jiashen, Miao Peilin besieged Shouzhou and Lu\'an; Senggelinchin was urged to attack him.',
    'On jiashen day, Miao Peilin besieged Shouzhou and Lu\'an; Senggelinchin was urged to attack.',
  ],
  s0761: [
    'Canton rebels held Taiping and Shida; Zuo Zongtang and Shen Baozhen jointly organized defense.',
    'Canton rebels held Taiping and Shida; Zuo Zongtang and Shen Baozhen coordinated defense.',
  ],
  s0762: [
    'Duo Longa\'s army captured the Cangtou bandit nest and eastern Shaanxi was pacified.',
    'Duo Longa took the Cangtou nest and eastern Shaanxi was cleared.',
  ],
  s0763: [
    'Miao Peilin captured Yingshang and attacked Mengcheng.',
    'Miao Peilin took Yingshang and attacked Mengcheng.',
  ],
  s0764: [
    'Liu Changyou was ordered to supervise suppression of bandits where Zhili, Shandong, and Henan meet.',
    'Liu Changyou was ordered to suppress bandits on the Zhili-Shandong-Henan border.',
  ],
  s0765: [
    'On day yiyou, Liu Dian\'s army recovered Yi County.',
    'On yiyou day, Liu Dian retook Yi County.',
  ],
  s0766: [
    'Vice Minister Xue Huan was assigned to work in the Zongli Yamen for foreign affairs.',
    'Vice Minister Xue Huan was assigned to the Zongli Yamen.',
  ],
  s0767: [
    'On day wuzi, Yinggui was permitted to return and reside at Taiyuan.',
    'On wuzi day, Yinggui was allowed to return to Taiyuan.',
  ],
  s0768: [
    'On day gengyin, Liu Changyou reported that bandit chiefs Yang Mingling and others had submitted.',
    'On gengyin day, Liu Changyou reported Yang Mingling and other chiefs had surrendered.',
  ],
  s0769: [
    'Gansu Hui rebels captured Yancha and attacked Jingning; Ma Dezhao advanced from Qingyang to suppress them.',
    'Gansu Hui rebels took Yancha and attacked Jingning; Ma Dezhao marched from Qingyang.',
  ],
  s0770: [
    'On day renchen, Gan troops defeated rebels at Qimen; rebel chief Hu Dingwen was executed.',
    'On renchen day, Gan troops defeated rebels at Qimen; Hu Dingwen was executed.',
  ],
  s0771: [
    'On day guisi, Li Xuyi requested acting posts be opened; assent was given.',
    'On guisi day, Li Xuyi\'s request to open acting posts was granted.',
  ],
  s0772: [
    'Tang Xunfang was made Anhui governor.',
    'Tang Xunfang became Anhui governor.',
  ],
  s0773: [
    'Li Hongzhang sent Cheng Xueqi and others to press Kunshan.',
    'Li Hongzhang sent Cheng Xueqi to press Kunshan.',
  ],
  s0774: [
    'Jingzhou troops fought Hui rebels and won.',
    'Jingzhou troops defeated Hui rebels.',
  ],
  s0775: [
    'On day jiawu, the Board of Rites fixed the order of sacrifices for worthies and Confucian sages and promulgated it in all provinces.',
    'On jiawu day, the Board of Rites fixed sage-sacrifice precedence and sent it to all provinces.',
  ],
  s0776: [
    'On day yiwei, reclamation of rice fields in the Xincheng district of Zhili was opened.',
    'On yiwei day, rice-field reclamation opened in Zhili\'s Xincheng district.',
  ],
  s0777: [
    'Yan Jingming went to Zichuan to supervise suppression.',
    'Yan Jingming went to Zichuan to supervise suppression.',
  ],
  s0778: [
    'Nien bandits returned to Henan; Commander Yu Jichang and others died; Zhang Yao was ordered to take command of the army.',
    'Nien bandits returned to Henan; Commander Yu Jichang died; Zhang Yao took his army.',
  ],
  s0779: [
    'On day dingyou, because Anhui rebels were scattering into Jiangsu and Hubei and Anqing was threatened, Zeng Guofan was edicted to brace himself in hardship and be doubly cautious.',
    'On dingyou day, with Anhui rebels spreading into Jiangsu and Hubei and Anqing threatened, Zeng Guofan was urged to stand firm and be cautious.',
  ],
  s0780: [
    'Zuo Zongtang\'s army recovered Yi County.',
    'Zuo Zongtang retook Yi County.',
  ],
  s0781: [
    'Lao Chongguang was made governor-general of Yunnan and Guizhou.',
    'Lao Chongguang became Yunnan-Guizhou governor-general.',
  ],
  s0782: [
    'Tian Xingju was arrested to apologize to the French.',
    'Tian Xingju was arrested to appease the French.',
  ],
  s0783: [
    'On day gengzi, Canton and Nien rebels attacked Fengtai and Dingyuan; government troops drove them back.',
    'On gengzi day, Canton and Nien rebels attacked Fengtai and Dingyuan and were repulsed.',
  ],
  s0784: [
    'On day xinchou, Weng Zengyuan and 200 others were granted jinshi and other degrees in varying ranks.',
    'On xinchou day, Weng Zengyuan and 200 others received jinshi degrees with varying honors.',
  ],
  s0785: [
    'The per-mu levy donation in Sichuan was stopped.',
    'Sichuan\'s per-mu levy donation was halted.',
  ],
  s0786: [
    'On day guimao, Cheng Xueqi and others recovered Kunshan and Xinyang.',
    'On guimao day, Cheng Xueqi retook Kunshan and Xinyang.',
  ],
  s0787: [
    'Government troops defeated rebel chief Li Xiucheng at Shijianbu.',
    'Government troops defeated Li Xiucheng at Shijianbu.',
  ],
  s0788: [
    'On day yisi, Hui rebels again attacked Xi\'an and were driven back.',
    'On yisi day, Hui rebels again attacked Xi\'an and were repulsed.',
  ],
  s0789: [
    'That month, rain was repeatedly prayed for.',
    'That month rain prayers continued.',
  ],
  s0790: [
    'Registered taxes in Taicang and other prefectures and counties were remitted.',
    'Registered taxes in Taicang and other districts were remitted.',
  ],
  s0791: [
    'Fifth month, day wushen: Miao Peilin besieged Mengcheng.',
    'In month 5, wushen, Miao Peilin besieged Mengcheng.',
  ],
  s0792: [
    'On day jiyou, Bao Chao\'s army recovered Chaoxian.',
    'On jiyou day, Bao Chao retook Chaoxian.',
  ],
  s0793: [
    'On day gengxu, Court Secretary Li Yunlin was rewarded with a Beijing post and ordered to command Han River defense troops and Sichuan relief troops.',
    'On gengxu day, Li Yunlin was promoted to a capital post and ordered to command Han River and Sichuan relief forces.',
  ],
  s0794: [
    'On day renzi, combined Canton and Nien forces attacked Tianchang; government troops defeated them.',
    'On renzi day, Canton and Nien forces attacked Tianchang and were defeated.',
  ],
  s0795: [
    'On day jiayin, Jiang Zhongyi was ordered to command troops to aid Jiangxi.',
    'On jiayin day, Jiang Zhongyi was sent to aid Jiangxi.',
  ],
  s0796: [
    'On day dingsi, Zou County religious bandits were pacified and bandit chief Liu Shuangyin was captured.',
    'On dingsi day, Zou County sect rebels were pacified; Liu Shuangyin was captured.',
  ],
  s0797: [
    'Canton rebels captured Guzhou.',
    'Canton rebels took Guzhou.',
  ],
  s0798: [
    'On day wuwu, Russian troops entered Kobdo territory and seized a taiji.',
    'On wuwu day, Russian troops entered Kobdo and seized a taiji.',
  ],
  s0799: [
    'On day renxu, it rained.',
    'On renxu day, it rained.',
  ],
  s0800: [
    'On day guihai, Canton rebels harassed Fuyang; government troops drove them back; Commander Xiong Jianyi and others died in battle.',
    'On guihai day, Canton rebels raided Fuyang and were repulsed; Commander Xiong Jianyi and others fell in battle.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_021_b08.mjs <translation.json>'
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
