#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'Liu Jintang\'s various armies captured Hanbo and other forts and jointly besieged Jinjibao.',
    'Liu Jintang\'s troops took Hanbo and other forts and closed in on Jinjibao.',
  ],
  s0502: [
    'Intercalary tenth month, day yichou: Russian envoy Woliangga\'li came to the capital.',
    'On yichou in the intercalary tenth month, Russian envoy Woliangga\'li arrived in Beijing.',
  ],
  s0503: [
    'Day gengwu: Xiangtan secret-society bandits were pacified.',
    'On gengwu day, Xiangtan secret-society rebels were pacified.',
  ],
  s0504: [
    'Day yihai: Yunnan troops recovered Yongbei, Heqing, Zhennan, and Chuxiong.',
    'On yihai day, Yunnan forces retook Yongbei, Heqing, Zhennan, and Chuxiong.',
  ],
  s0505: [
    'Hui rebels took Uliastai.',
    'Hui rebels captured Uliastai.',
  ],
  s0506: [
    'Day bingzi: the Yongding River closure was joined.',
    'On bingzi day, the Yongding River works were closed.',
  ],
  s0507: [
    'Zeng Guofan was instructed to plan river transport.',
    'An edict told Zeng Guofan to arrange river transport.',
  ],
  s0508: [
    'Day wuyin: Wu Yazhong and others of Vietnam were executed.',
    'On wuyin day, Vietnam\'s Wu Yazhong and others were put to death.',
  ],
  s0509: [
    'Eleventh month, day guisi: Zheng Dunjin was ordered to join in trying Zhang Wenxiang\'s case.',
    'On guisi in the eleventh month, Zheng Dunjin was ordered to try Zhang Wenxiang\'s case.',
  ],
  s0510: [
    'The verdict was soon fixed and Zhang Wenxiang was dismembered at Jiangning.',
    'The case was soon decided and Zhang Wenxiang was executed at Jiangning.',
  ],
  s0511: [
    'Day dingyou: Hui rebels raided Liangzhou; Vice Commander Xie Yuanxing fell in battle and Wang Renhe drove them back.',
    'On dingyou day, Hui rebels struck Liangzhou; Xie Yuanxing was killed and Wang Renhe repulsed them.',
  ],
  s0512: [
    'Day xinchou: Hunan relief troops for Guizhou recovered Tai Gong.',
    'On xinchou day, Hunan relief forces retook Tai Gong in Guizhou.',
  ],
  s0513: [
    'Day wushen: because bandits entered Uliastai, Fu Ji and Rong Quan were stripped of office but kept at their posts.',
    'On wushen day, Fu Ji and Rong Quan lost their posts but stayed on duty after Uliastai was overrun.',
  ],
  s0514: [
    'Zeng Guofan was also made superintendent of trade.',
    'Zeng Guofan was also made trade superintendent.',
  ],
  s0515: [
    'Day gengxu: Gansu regional commander Zhou Dongxing embezzled relief grain and was ordered beheaded before the army.',
    'On gengxu day, Zhou Dongxing was beheaded in camp for embezzling relief grain.',
  ],
  s0516: [
    'Day gengshen: Liu Kunyi was censured for leaking secrets; his office was stripped but he remained on duty.',
    'On gengshen day, Liu Kunyi was demoted yet kept in post for leaking secrets.',
  ],
  s0517: [
    'Twelfth month, day jiazi: an edict strictly forbade skimming, graft, and erosion in river works.',
    'On jiazi in the twelfth month, river-work graft and skimming were strictly banned.',
  ],
  s0518: [
    'Day xinwei: Yunnan troops recovered Dengchuan and Langqiong.',
    'On xinwei day, Yunnan forces retook Dengchuan and Langqiong.',
  ],
  s0519: [
    'Hui leader Ma Yuanfa killed Regional Commander Ding Xianfa and others; he was captured and executed.',
    'Ma Yuanfa killed Ding Xianfa and other officers and was then captured and executed.',
  ],
  s0520: [
    'That winter, overdue taxes were remitted in disaster-struck districts of Xingyi and other prefectures and guards in Guizhou and in Suide and other counties in Shaanxi.',
    'That winter, back taxes were forgiven in Guizhou\'s Xingyi area and Shaanxi\'s Suide district.',
  ],
  s0521: [
    'That year, Korea sent tribute.',
    'That year, Korea paid tribute.',
  ],
  s0522: [
    'Tenth year, xinwei: spring, first month, day xinmao new moon: the birthday banquet was suspended.',
    'In the tenth year, xinwei, the new-year banquet was suspended on the first month\'s xinmao new moon.',
  ],
  s0523: [
    'Day renchen: government troops captured the rebel bastions of Hexi Wang Meng; Jin Shun was granted a yellow jacket; Zhang Yao received an additional Cloud Cavalry Commander.',
    'On renchen day, Hexi Wang Meng fell; Jin Shun got a yellow jacket and Zhang Yao an extra Cloud Cavalry Commander.',
  ],
  s0524: [
    'Day yiwei: Guizhou troops pacified rebel strongholds around Guiding and captured Duyun; Brigadier Lin Congtai and Regional Commander He Xionghui were granted yellow jackets.',
    'On yiwei day, Guizhou troops cleared Guiding and took Duyun; Lin Congtai and He Xionghui received yellow jackets.',
  ],
  s0525: [
    'Day jihai: Feng Zicai was instructed to advance to Taiping to suppress the Pasture Horse and Lang Son bandits.',
    'On jihai day, Feng Zicai was sent to Taiping against Pasture Horse and Lang Son rebels.',
  ],
  s0526: [
    'Day renyin: Guan Wen died.',
    'On renyin day, Guan Wen died.',
  ],
  s0527: [
    'That month, land tax quotas were remitted in Anzhou and other districts of Zhili struck by flood.',
    'That month, flood-hit Anzhou and other Zhili districts had taxes remitted.',
  ],
  s0528: [
    'Second month, day renxu: Liu Jintang\'s army captured Jinjibao; rebel leaders Ma Hualong and others were executed; Zuo Zongtang was given an additional Commandant of Cavalry; Liu Jintang was granted Cloud Cavalry Commander and a yellow jacket; Lei Zhengwan\'s punishments were lifted, as were Chen Shi\'s former offices; Huang Ding and Jin Yunchang received yellow jackets.',
    'On renxu in the second month, Jinjibao fell and Ma Hualong was executed; Zuo Zongtang, Liu Jintang, Lei Zhengwan, Chen Shi, Huang Ding, and Jin Yunchang were rewarded.',
  ],
  s0529: [
    'Surrendered Shaanxi Muslims were resettled at Huapingchuan in Huating; an assistant prefect and a colonel were stationed to pacify them.',
    'Pacified Shaanxi Muslims were settled at Huapingchuan with an assistant prefect and colonel to keep order.',
  ],
  s0530: [
    'Former Lingzhou magistrate Peng Qingzhang was executed for plotting for the rebels.',
    'Ex-magistrate Peng Qingzhang of Lingzhou was executed for aiding rebels.',
  ],
  s0531: [
    'Day renwu: the rebel general Song Jingshi was captured and executed.',
    'On renwu day, rebel general Song Jingshi was captured and killed.',
  ],
  s0532: [
    'Day dinghai: Jiangsu surveillance commissioner Ying Baoshi was transferred to Tianjin to handle Japanese trade affairs.',
    'On dinghai day, Ying Baoshi went to Tianjin to manage Japanese trade.',
  ],
  s0533: [
    'Rui Chang was made Grand Secretary; Wen Xiang was ordered to assist as Grand Secretary.',
    'Rui Chang became grand secretary and Wen Xiang was ordered to assist.',
  ],
  s0534: [
    'Third month, day guisi: Jin Shun\'s army captured Ningxia; rebel leader Ma Wanxuan was executed.',
    'On guisi in the third month, Jin Shun took Ningxia and Ma Wanxuan was executed.',
  ],
  s0535: [
    'Day jichou: Yunnan troops recovered Chengjiang and captured Jiangna indigenous walled city; rebel leaders Ma He and others were executed.',
    'On jichou day, Yunnan forces retook Chengjiang, took Jiangna, and executed Ma He and others.',
  ],
  s0536: [
    'Day xinchou: Prussian envoy Li Fusi presented a state letter: the German states and the three autonomous Hanse cities had been reunited and their ruler received the title German Emperor; a reply congratulating them was sent.',
    'On xinchou day, Prussian envoy Li Fusi announced German unification and the new emperor; Beijing sent congratulations.',
  ],
  s0537: [
    'Day dingwei: Woren was made Grand Secretary of the Wenhua Hall and Rui Chang Grand Secretary of the Wenyuan Pavilion.',
    'On dingwei day, Woren and Rui Chang were made grand secretaries of Wenhua and Wenyuan halls.',
  ],
  s0538: [
    'From early spring until this month the Emperor continually prayed for rain.',
    'From early spring through this month the Emperor kept praying for rain.',
  ],
  s0539: [
    'Day gengxu: rain fell.',
    'On gengxu day, it rained.',
  ],
  s0540: [
    'Summer, fourth month, day bingyin: Hunan relief troops for Guizhou recovered Xincheng, Yanmensi, and other cities and captured the Gaopo and other Miao stockades.',
    'On bingyin in the fourth month, Hunan relief forces retook Xincheng and Yanmensi and seized Gaopo Miao stockades.',
  ],
  s0541: [
    'Day jisi: the Najia Tangut Muslim communities of Ningxia surrendered.',
    'On jisi day, Ningxia\'s Najia Muslims surrendered.',
  ],
  s0542: [
    'Day jimao: Shaanxi Muslims raided Pingfan and Minhe; government troops drove them back.',
    'On jimao day, Shaanxi Muslims struck Pingfan and Minhe and were repulsed.',
  ],
  s0543: [
    'Day xinsi: Woren died.',
    'On xinsi day, Woren died.',
  ],
  s0544: [
    'Day jiashen: Liang Yaoshu and 320 others were granted jinshi degrees with differentiated ranks.',
    'On jiashen day, Liang Yaoshu and 320 others received jinshi degrees.',
  ],
  s0545: [
    'Batteries were built at Dagu and Beitang.',
    'Forts were built at Dagu and Beitang.',
  ],
  s0546: [
    'Day yiyou: Fu Ji was dismissed from office; Jin Shun was made general of Uliastai.',
    'On yiyou day, Fu Ji was dismissed and Jin Shun became Uliastai general.',
  ],
  s0547: [
    'Day bingxu: Hui rebels again raided the Sainoino Banner territory, burning and plundering at Gurban Saihan and elsewhere.',
    'On bingxu day, Hui rebels raided Sainoino banners and burned Gurban Saihan.',
  ],
  s0548: [
    'Fifth month, day gengyin new moon: rain.',
    'On the fifth month\'s gengyin new moon, it rained.',
  ],
  s0549: [
    'Day yiwei: Zuo Zongtang requested to ban the Muslims\' New Teaching; it was not permitted.',
    'On yiwei day, Zuo Zongtang\'s request to ban Muslim New Teaching was refused.',
  ],
  s0550: [
    'Day wuxu: Miao chieftain Wen Guoxing and others surrendered and Ba Zhai and other cities were all recovered.',
    'On wuxu day, Wen Guoxing\'s Miao surrendered and Ba Zhai and other towns were retaken.',
  ],
  s0551: [
    'Day renyin: Hui rebels harassed Urat; the troops of Duga\'er and Sasabu jointly attacked them.',
    'On renyin day, Hui rebels hit Urat and Duga\'er and Sasabu attacked together.',
  ],
  s0552: [
    'Day bingwu: Hunan relief troops for Guizhou recovered Danjiang, Kaili, and other cities; Su Yuanchun was granted a yellow jacket.',
    'On bingwu day, Hunan relief forces retook Danjiang and Kaili; Su Yuanchun got a yellow jacket.',
  ],
  s0553: [
    'Day jiyou: because Li Shizhong sought revenge and brawled and Chen Guorui produced plays and caused trouble, Li Shizhong was stripped of office, Chen Guorui was reduced to colonel, and both were ordered back to their native places under local control.',
    'On jiyou day, Li Shizhong and Chen Guorui were punished and sent home under local restraint.',
  ],
  s0554: [
    'Day xinhai: Prince Cheng Zhi Zhi Cheng was found guilty; his princedom was stripped and he was arrested for trial.',
    'On xinhai day, Prince Cheng was stripped of rank and arrested.',
  ],
  s0555: [
    'Li Hongzhang was ordered to handle the Japanese commercial treaty; Ying Baoshi and Chen Qin were made assistants.',
    'Li Hongzhang was ordered to negotiate the Japanese treaty with Ying Baoshi and Chen Qin assisting.',
  ],
  s0556: [
    'Day yimao: Jin Shun begged leave for mourning to bury his parents.',
    'On yimao day, Jin Shun asked mourning leave to bury his parents.',
  ],
  s0557: [
    'It was not permitted.',
    'The request was denied.',
  ],
  s0558: [
    'Day jiwei: Yunnan troops recovered Yunlong.',
    'On jiwei day, Yunnan forces retook Yunlong.',
  ],
  s0559: [
    'Sixth month, day renxu: Venus was seen in daytime.',
    'On renxu in the sixth month, Venus appeared by day.',
  ],
  s0560: [
    'Secret-society bandits in Yiyang and elsewhere were pacified.',
    'Secret-society rebels in Yiyang and nearby areas were pacified.',
  ],
  s0561: [
    'Day jisi: Shaanxi Muslim Bai Yanhu united with Xining Muslim communities to harass Hezhou.',
    'On jisi day, Bai Yanhu and Xining Muslims raided Hezhou.',
  ],
  s0562: [
    'Day gengwu: Guizhou troops captured Yongning, Zhenning, and the Guihua Miao stockades and broke the stockades of Langdai and Shuicheng.',
    'On gengwu day, Guizhou troops took Yongning, Zhenning, and Guihua Miao stockades and stormed Langdai and Shuicheng.',
  ],
  s0563: [
    'Day yihai: Rui Lin was made Grand Secretary while remaining governor-general of the two Guangs.',
    'On yihai day, Rui Lin became grand secretary and stayed governor-general of Liangguang.',
  ],
  s0564: [
    'Day jimao: Fuyang bandits harassed Shenqiu and Ruyang; government troops captured and executed them.',
    'On jimao day, Fuyang bandits raided Shenqiu and Ruyang and were caught and killed.',
  ],
  s0565: [
    'Day xinsi: because Guangdong bandits ran rampant, an edict ordered strict suppression.',
    'On xinsi day, an edict ordered harsh suppression of Guangdong bandits.',
  ],
  s0566: [
    'Day dinghai: the Dezong Emperor was born at Prince Chun\'s residence.',
    'On dinghai day, the future Dezong was born at Prince Chun\'s mansion.',
  ],
  s0567: [
    'Day wuzi: Tianjin disaster relief was distributed.',
    'On wuzi day, Tianjin disaster relief was issued.',
  ],
  s0568: [
    'Autumn, seventh month, day jichou new moon: Guangxi troops suppressed bandits who had fled from Vietnam, captured Changqing, and beheaded the rebel leader Zhao Xiongcai.',
    'On the seventh month\'s jichou new moon, Guangxi troops killed Zhao Xiongcai and took Changqing from Vietnamese raiders.',
  ],
  s0569: [
    'Day renchen: Duga\'er\'s army defeated bandits at Blat.',
    'On renchen day, Duga\'er\'s force beat rebels at Blat.',
  ],
  s0570: [
    'Day jiawu: the Yongding River burst again.',
    'On jiawu day, the Yongding River broke again.',
  ],
  s0571: [
    'Day bingshen: Mutu Shan went to Beishan to suppress bandits.',
    'On bingshen day, Mutu Shan marched to Beishan against bandits.',
  ],
  s0572: [
    'Jin Yunchang\'s army defeated bandits who had fled into Urat.',
    'Jin Yunchang\'s troops beat Urat raiders.',
  ],
  s0573: [
    'Day dingwei: the Qin River within Hanoi burst.',
    'On dingwei day, the Qin River in Hanoi broke its banks.',
  ],
  s0574: [
    'Day yimao: Changtu bandits raided and harassed; Du Xing\'a sent troops to suppress and pacify them.',
    'On yimao day, Changtu bandits raided and Du Xing\'a sent troops to crush them.',
  ],
  s0575: [
    'Eighth month, day renshen: Vice Metropolitan Banner Commander Qing Zhi inherited the princehood of Zheng.',
    'On renshen in the eighth month, Qing Zhi succeeded as Prince of Zheng.',
  ],
  s0576: [
    'Day jiaxu: Guangxi troops captured the Anshi rebel stockade and pursued bandits who had fled into Taiyuan; Su Guohan went to Guangdong to surrender.',
    'On jiaxu day, Guangxi troops took Anshi and pursued Taiyuan raiders; Su Guohan surrendered in Guangdong.',
  ],
  s0577: [
    'Day dingchou: an edict ordered each province to establish offices to receive wandering orphans and widows.',
    'On dingchou day, provinces were told to open shelters for homeless orphans and widows.',
  ],
  s0578: [
    'Ninth month, day bingshen: the corrupt practice of grain levies at Gaoyou was abolished.',
    'On bingshen in the ninth month, Gaoyou\'s abusive grain levies were abolished.',
  ],
  s0579: [
    'Day dingyou: Gansu troops captured the Kangjiaya strategic pass.',
    'On dingyou day, Gansu forces took Kangjiaya pass.',
  ],
  s0580: [
    'Rong Quan was urgently sent to Ili.',
    'Rong Quan was ordered to hurry to Ili.',
  ],
  s0581: [
    'Liu Mingchuan was granted three months\' leave.',
    'Liu Mingchuan was given three months\' leave.',
  ],
  s0582: [
    'Day renyin: an edict ordered Fengtian and Jilin to rectify official conduct and strictly hunt bandits.',
    'On renyin day, Fengtian and Jilin were told to clean up government and suppress bandits.',
  ],
  s0583: [
    'En Xi was ordered to proceed to Shanghai to conduct the Austrian treaty exchange.',
    'En Xi was sent to Shanghai for the Austrian treaty exchange.',
  ],
  s0584: [
    'Day dingwei: Qiao Songnian and others joined in blocking the breach at Houjialin.',
    'On dingwei day, Qiao Songnian and others worked to close the Houjialin breach.',
  ],
  s0585: [
    'That autumn, disaster relief was given in various districts of Zhili and in Heze and other counties; overdue taxes were remitted in Puzhou for flood and in Huangzhou for disturbance.',
    'That autumn, Zhili and Heze were relieved; Puzhou flood taxes and Huangzhou disturbance arrears were remitted.',
  ],
  s0586: [
    'Winter, tenth month, day wuwu new moon: Daerji was stripped of office and arrested for trial for withdrawing camps and letting bandits escape.',
    'On the tenth month\'s wuwu new moon, Daerji was arrested for pulling back camps and letting rebels escape.',
  ],
  s0587: [
    'Cao Kezhong was ordered to take over Liu Mingchuan\'s army and proceed to Suzhou for defense and suppression.',
    'Cao Kezhong was ordered to command Liu Mingchuan\'s force at Suzhou.',
  ],
  s0588: [
    'Day gengshen: because of a Hunan bandit uprising, Li Hongzhang was ordered to investigate.',
    'On gengshen day, Li Hongzhang was sent to investigate a Hunan rebel outbreak.',
  ],
  s0589: [
    'Day renchen: Jing Lian was made Urumqi commander-in-chief.',
    'On renchen day, Jing Lian became Urumqi commander-in-chief.',
  ],
  s0590: [
    'Day guimao: an edict pardoned officials, soldiers, and people of Ili who had been coerced.',
    'On guimao day, coerced Ili officials, troops, and civilians were pardoned.',
  ],
  s0591: [
    'Staff Captain Gongguo\'er took over Daerji\'s army.',
    'Staff Captain Gongguo\'er assumed Daerji\'s command.',
  ],
  s0592: [
    'Eleventh month, day guisi: Gansu troops captured Hezhou; Yu Deyan and others surrendered.',
    'On guisi in the eleventh month, Gansu forces took Hezhou and Yu Deyan surrendered.',
  ],
  s0593: [
    'Day dingwei: Xining Hui rebels fled into Urat and Zhongwei; Zhang Yao\'s army drove them back.',
    'On dingwei day, Xining Hui rebels raided Urat and Zhongwei and Zhang Yao repulsed them.',
  ],
  s0594: [
    'Day yimao: Suzhou Hui rebels again invaded Dunhuang; Wen Lin reinforced the suppression.',
    'On yimao day, Suzhou Hui rebels struck Dunhuang and Wen Lin counterattacked.',
  ],
  s0595: [
    'Twelfth month, day xinwei: the earlier Confucian Zhang Lvxiang was granted posthumous sacrifice in the Confucian temple.',
    'On xinwei in the twelfth month, Zhang Lvxiang was enshrined in the Confucian temple.',
  ],
  s0596: [
    'Day dingchou: the Xiangshan sect leader Zeng Da\'e Fu and others raised rebellion; they were captured and executed.',
    'On dingchou day, Xiangshan rebel Zeng Da\'e Fu and others were captured and killed.',
  ],
  s0597: [
    'That year, Korea, Ryukyu, and Vietnam sent tribute.',
    'That year, Korea, Ryukyu, and Vietnam paid tribute.',
  ],
  s0598: [
    'Eleventh year, renshen: spring, first month, day bingxu new moon: the birthday banquet was suspended.',
    'In the eleventh year, renshen, the new-year banquet was suspended on the first month\'s bingxu new moon.',
  ],
  s0599: [
    'Day jichou: an edict ordered reduced punishments because of the new year\'s opening of the chronicle.',
    'On jichou day, punishments were reduced for the new reign year.',
  ],
  s0600: [
    'Wen Shuo was stripped of office for feigning illness to beg leave.',
    'Wen Shuo lost his post for falsely claiming illness to resign.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b06.mjs <translation.json>'
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
