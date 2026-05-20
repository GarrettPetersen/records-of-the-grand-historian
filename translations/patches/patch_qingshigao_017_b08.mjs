#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'That year, Ryukyu and Korea presented tribute.',
    'That year, Ryukyu and Korea sent tribute.',
  ],
  s0702: [
    'Ninth year, spring, first month, day dingwei: Azi Hezhuo of the Hipichak Aiman Brut came to submit.',
    'In year 9, on first-month dingwei day, Azi Hezhuo of the Hipichak Aiman Brut submitted.',
  ],
  s0703: [
    'On day renzi, Yang Fang was made Grand Tutor of the Heir Apparent.',
    'On renzi day, Yang Fang became grand tutor of the crown prince.',
  ],
  s0704: [
    'That month, one month\'s ration grain was issued to disaster victims in five Anhui prefectures and counties including Sizhou and their garrison troops, and in fifteen Jiangsu prefectures, counties, and guards including Haizhou.',
    'That month, one month\'s rations went to five Anhui districts including Sizhou and fifteen Jiangsu districts including Haizhou.',
  ],
  s0705: [
    'Relief was given to impoverished laborers affected at three Liang-Huai salt fields including Banpu.',
    'Impoverished laborers at Banpu and two other Liang-Huai salt fields were relieved.',
  ],
  s0706: [
    'Seed grain was loaned for flood disaster in Daizhou and Xiezhou, Shanxi; granary grain was loaned for flood disaster in Shangcai, Henan.',
    'Shanxi\'s Daizhou and Xiezhou received seed loans and Henan\'s Shangcai received granary grain for floods.',
  ],
  s0707: [
    'Second month, day jisi: the Emperor attended the Classics Lecture.',
    'In month 2, jisi, the Emperor attended the Classics Lecture.',
  ],
  s0708: [
    'On day gengwu, the Emperor escorted the Empress Dowager to the Old Summer Palace.',
    'On gengwu day, the Emperor escorted the Empress Dowager to the Old Summer Palace.',
  ],
  s0709: [
    'The Darvas tribe southwest of Khoqand sent envoys to submit; they were commended but their gifts were declined.',
    'Khoqand\'s southwestern Darvas tribe submitted; the court commended them but declined gifts.',
  ],
  s0710: [
    'On day jiawu, Boqitu was made an imperial presence minister; Husong\'e replaced him as Jilin general.',
    'On jiawu day, Boqitu became an imperial presence minister and Husong\'e took Jilin.',
  ],
  s0711: [
    'Third month, day bingwu: the Emperor visited the Southern Park.',
    'In month 3, bingwu, the Emperor visited the Southern Park.',
  ],
  s0712: [
    'On day dingwei, the Emperor went to the Southern Park for the battue; through xinhai it was the same.',
    'On dingwei day, the Emperor hunted at the Southern Park through xinhai.',
  ],
  s0713: [
    'On day xinhai, the chief of Ladakh beyond Tibet\'s frontier presented a memorial.',
    'On xinhai day, Ladakh\'s frontier chief sent a memorial.',
  ],
  s0714: [
    'On day renzi, the Emperor returned to the Old Summer Palace.',
    'On renzi day, the Emperor returned to the Old Summer Palace.',
  ],
  s0715: [
    'On day jiayin, the Emperor reviewed Metropolitan garrison troops at the Review Martial Tower.',
    'On jiayin day, the Emperor reviewed capital garrison troops at the Review Martial Tower.',
  ],
  s0716: [
    'On day wuwu, Qishan was summoned; Nierjing\'e was made Shandong governor; Zhu Guizhen was made grain-transport governor-general.',
    'On wuwu day, Qishan was recalled, Nierjing\'e took Shandong, and Zhu Guizhen grain transport.',
  ],
  s0717: [
    'Summer, fourth month, day guiyou: Dai Sanxi was summoned; Qishan was made Sichuan governor-general.',
    'In month 4, guiyou, Dai Sanxi was recalled and Qishan became Sichuan governor-general.',
  ],
  s0718: [
    'On day renwu, Tu Zhishen was demoted for errors in capital-punishment review; Songyun acted as Zhili governor-general.',
    'On renwu day, Tu Zhishen was demoted over review errors and Songyun acted for Zhili.',
  ],
  s0719: [
    'On day bingxu, the Empress Dowager at Huihui Tower reviewed the archery of princes and guards.',
    'On bingxu day, the Empress Dowager at Huihui Tower reviewed princes\' and guards\' archery.',
  ],
  s0720: [
    'On day wuzi, Li Zhenjun and 221 others received jinshi degrees with differentiated ranks.',
    'On wuzi day, Li Zhenjun and 221 others received jinshi degrees.',
  ],
  s0721: [
    'That month, ration and seed grain were loaned for last year\'s drought in five Hunan prefectures and counties including Qianzhou; granary grain was loaned for harvest shortfall in twenty-three Shanxi prefectures and counties including Shuozhou.',
    'That month, Qianzhou and four other Hunan districts received drought rations and seed loans, and twenty-three Shanxi districts including Shuozhou received granary loans.',
  ],
  s0722: [
    'Fifth month, day dingyou: Empress Xiaomu\'s coffin was moved to the main hall at Baohua Valley; her spirit tablet to the east side hall.',
    'In month 5, dingyou, Empress Xiaomu\'s coffin went to Baohua Valley\'s main hall and her tablet to the east side hall.',
  ],
  s0723: [
    'That month, granary grain was loaned to the Jingzhou city garrison, the two water-forces camps, and the Yidu camp flooded in Hubei.',
    'That month, flooded Hubei garrisons at Jingzhou, the water-forces camps, and Yidu received granary loans.',
  ],
  s0724: [
    'Sixth month, day yichou: Fukule was made Kobdo assistant commissioner.',
    'In month 6, yichou, Fukule became Kobdo assistant commissioner.',
  ],
  s0725: [
    'On day jisi, tribute-horse silver was remitted for snow disasters in Karawusu and other places in Tibet, and households of officers and soldiers of the eight Damu banners affected by disaster were also relieved.',
    'On jisi day, Karawusu snow-disaster tribute silver was remitted and Damu banner disaster households were relieved.',
  ],
  s0726: [
    'On day jiaxu, Ili General Deying\'a died; Yu Lin replaced him.',
    'On jiaxu day, Deying\'a died and Yu Lin became Ili general.',
  ],
  s0727: [
    'Songyun was transferred to Minister of War.',
    'Songyun became minister of war.',
  ],
  s0728: [
    'Boqitu was made Minister of Rites.',
    'Boqitu became minister of rites.',
  ],
  s0729: [
    'On day dingchou, Anfu was summoned; Fukejing\'e acted as Chahar commandant.',
    'On dingchou day, Anfu was recalled and Fukejing\'e acted as Chahar commandant.',
  ],
  s0730: [
    'That month, granary grain was loaned for last year\'s flood at Sanxing.',
    'That month, Sanxing received a granary loan for last year\'s flood.',
  ],
  s0731: [
    'Seventh month, day jihai: the ban on official silver leaving the Canton customs and on private goods entering was strictly enforced.',
    'In month 7, jihai, the ban on Canton customs silver exports and private imports was tightened.',
  ],
  s0732: [
    'Zhalong\'a was made Kashgar assistant commissioner.',
    'Zhalong\'a became Kashgar assistant commissioner.',
  ],
  s0733: [
    'On day dingsi, because his mother was aged, the king of Vietnam begged ginseng and astragalus; the Emperor graciously bestowed them.',
    'On dingsi day, Vietnam\'s king received imperial gifts of ginseng and astragalus for his aged mother.',
  ],
  s0734: [
    'That month, flood relief was given for Luorong and Yongfu counties, Guangxi.',
    'That month, Luorong and Yongfu in Guangxi received flood relief.',
  ],
  s0735: [
    'One-tenth of last year\'s flood quota levies was remitted for Wuhe county, Sizhou, and the Fengyang and Sizhou guards.',
    'Wuhe, Sizhou, and the Fengyang and Sizhou guards lost one-tenth of last year\'s flood quotas.',
  ],
  s0736: [
    'Eighth month, day guihai: because the Emperor would visit the ancestral tombs at Shengjing, Yishao, Tuojin, Tang Jinzhao, and Mingshan were left in the capital to handle affairs.',
    'In month 8, guihai, Yishao, Tuojin, Tang Jinzhao, and Mingshan stayed in Beijing for the Shengjing tomb visit.',
  ],
  s0737: [
    'On day gengchen, the Emperor, escorting the Empress Dowager, visited the ancestral tombs at Shengjing.',
    'On gengchen day, the Emperor escorted the Empress Dowager to Shengjing\'s ancestral tombs.',
  ],
  s0738: [
    'Ninth month, new moon on day renchen: there was a solar eclipse.',
    'At the ninth-month new moon, renchen, there was a solar eclipse.',
  ],
  s0739: [
    'This year\'s quota levies were remitted for five subprefectures and counties including Chengde on the imperial route; half the quota levies were remitted for nine subprefectures and counties including Xiuyan that assisted the errands.',
    'Route districts including Chengde lost this year\'s quotas, and Xiuyan and eight other errand districts lost half.',
  ],
  s0740: [
    'On day renyin, Korean tribute envoy Li Xianghuang and others were received in audience.',
    'On renyin day, Li Xianghuang and other Korean envoys were received.',
  ],
  s0741: [
    'On day yisi, the Emperor shot archery personally and reviewed the archery of Shengjing officers and soldiers.',
    'On yisi day, the Emperor shot and reviewed Shengjing troops\' archery.',
  ],
  s0742: [
    'On day dingwei, the Emperor visited Yongling.',
    'On dingwei day, the Emperor visited Yongling.',
  ],
  s0743: [
    'On day wushen, the great feast rite was performed.',
    'On wushen day, the great feast rite was held.',
  ],
  s0744: [
    'The Emperor inspected Xingjing city.',
    'The Emperor inspected Xingjing.',
  ],
  s0745: [
    'On day jiyou, Boqitu was demoted and transferred; Qiying was made Minister of Rites.',
    'On jiyou day, Boqitu was demoted and Qiying took the Ministry of Rites.',
  ],
  s0746: [
    'The Emperor visited Fuling, offered at the tomb of Count Hongyi Eidu, and bestowed favors on descendants including Bokesun.',
    'At Fuling the Emperor mourned Count Hongyi Eidu and favored descendants including Bokesun.',
  ],
  s0747: [
    'On day guichou, the great feast rite was performed.',
    'On guichou day, the great feast rite was held.',
  ],
  s0748: [
    'The Emperor reached Shengjing and performed rites before the spirit tablets at the Imperial Ancestral Temple.',
    'At Shengjing the Emperor worshipped before the ancestral temple tablets.',
  ],
  s0749: [
    'On day yimao, the Emperor visited the Altar of Heaven and the Tangzi.',
    'On yimao day, the Emperor visited the Altar of Heaven and the Tangzi.',
  ],
  s0750: [
    'The Empress Dowager visited Jiayin Hall.',
    'The Empress Dowager visited Jiayin Hall.',
  ],
  s0751: [
    'The Emperor offered at the tomb of Prince Keqin Yuetuo.',
    'The Emperor mourned at Prince Keqin Yuetuo\'s tomb.',
  ],
  s0752: [
    'Korean king Li Xi sent envoys presenting local products.',
    'Korea\'s King Li Xi sent envoys with local products.',
  ],
  s0753: [
    'On day wuwu, the Emperor visited the Altar of Earth.',
    'On wuwu day, the Emperor visited the Altar of Earth.',
  ],
  s0754: [
    'The Emperor offered at the tomb of Duke Zhiyi Fei Yingdong.',
    'The Emperor mourned at Duke Zhiyi Fei Yingdong\'s tomb.',
  ],
  s0755: [
    'On day jiwei, at Dagong Hall the Emperor granted a feast to accompanying princes, dukes, and ministers, Mongol princes, beile, beizi, and dukes, and Shengjing civil and military officials, with differentiated rewards.',
    'On jiwei day, at Dagong Hall the Emperor feasted the entourage and Shengjing officials with graded rewards.',
  ],
  s0756: [
    'Tenth month: Pan Shien acted as Minister of Rites.',
    'In month 10, Pan Shien acted at the Ministry of Rites.',
  ],
  s0757: [
    'On day xinwei, on the Empress Dowager\'s birthday the Emperor led accompanying princes, dukes, and ministers to her traveling palace to perform congratulations.',
    'On xinwei day, the Empress Dowager\'s birthday brought congratulations at her traveling palace.',
  ],
  s0758: [
    'The Emperor escorted the Empress Dowager to Chenghai Tower.',
    'The Emperor escorted the Empress Dowager to Chenghai Tower.',
  ],
  s0759: [
    'On day renwu, the Emperor visited Yuling.',
    'On renwu day, the Emperor visited Yuling.',
  ],
  s0760: [
    'On day jiashen, Wu Guangyue was made Jiangxi governor.',
    'On jiashen day, Wu Guangyue became Jiangxi governor.',
  ],
  s0761: [
    'On day yiyou, the Emperor, escorting the Empress Dowager, returned to the palace.',
    'On yiyou day, the Emperor brought the Empress Dowager back to the palace.',
  ],
  s0762: [
    'That month, one month\'s ration grain was issued to five Anhui prefectures and counties including Sizhou and their guards.',
    'That month, five Anhui districts including Sizhou and their guards received one month\'s rations.',
  ],
  s0763: [
    'Eleventh month, day dingsi: Yinghui was summoned; Chengge was transferred to be Urumqi commander.',
    'In month 11, dingsi, Yinghui was recalled and Chengge became Urumqi commander.',
  ],
  s0764: [
    'Yu\'en was made Rehe commander.',
    'Yu\'en became Rehe commander.',
  ],
  s0765: [
    'That month, relief ration grain was issued to banner people affected by disaster in five places including Liaoyang, Fengtian.',
    'That month, Liaoyang and four other Fengtian districts received disaster rations.',
  ],
  s0766: [
    'Twelfth month, day jiazi: Burma king Meng Ji sent envoys with a congratulatory memorial.',
    'In month 12, jiazi, Burma\'s Meng Ji sent congratulatory envoys.',
  ],
  s0767: [
    'On day yihai, Tibetan subjects of the thirty-nine tribes who suffered disaster were relieved.',
    'On yihai day, disaster victims among Tibet\'s thirty-nine tribes were relieved.',
  ],
  s0768: [
    'That month, earthquake relief was given for Yidu and Linqu counties, Shandong.',
    'That month, Shandong\'s Yidu and Linqu received earthquake relief.',
  ],
  s0769: [
    'Half the quota levies on lowlands were remitted for Longping and Ningjin counties, Zhili.',
    'Longping and Ningjin in Zhili lost half their lowland quota levies.',
  ],
  s0770: [
    'Tenth year, spring, first month, day dingsi: Siam king Zheng Fu sent envoys with a congratulatory memorial and local products.',
    'In year 10, on first-month dingsi day, Siam\'s Zheng Fu sent congratulatory envoys with local products.',
  ],
  s0771: [
    'That month, drought and flood relief was given for six Jiangsu and Anhui prefectures, counties, and guards including Pei county and Xuyi.',
    'That month, six districts including Jiangsu\'s Pei county and Anhui\'s Xuyi received drought and flood relief.',
  ],
  s0772: [
    'Silver and grain were loaned for drought and flood in Cangzhou and Yanshan, Zhili, and fourteen prefectures and counties including Gaolan, Gansu.',
    'Zhili\'s Cangzhou and Yanshan and fourteen Gansu districts including Gaolan received drought-and-flood silver and grain loans.',
  ],
  s0773: [
    'Second month, day renxu: the Emperor attended the Classics Lecture.',
    'In month 2, renxu, the Emperor attended the Classics Lecture.',
  ],
  s0774: [
    'On day dingmao, arrest of Henan xiaofei and Nian bandits was ordered.',
    'On dingmao day, Henan xiaofei and Nian bandits were ordered captured.',
  ],
  s0775: [
    'On day dingchou, arrest of hui bandits in Shangyou county, Jiangxi, was ordered.',
    'On dingchou day, Shangyou hui bandits in Jiangxi were ordered captured.',
  ],
  s0776: [
    'Third month, day gengyin: because the Emperor would visit the Western Tombs, Yishao, Tuojin, Chang Ling, and Lu Yinpu were left in the capital to handle affairs.',
    'In month 3, gengyin, Yishao, Tuojin, Chang Ling, and Lu Yinpu stayed in Beijing for the Western Tombs visit.',
  ],
  s0777: [
    'On day jihai, quota levies and previously loaned seed silver were remitted for lakeside silt fields at Lizhou, Hunan.',
    'On jihai day, Lizhou\'s lakeside silt fields lost quota levies and seed loans.',
  ],
  s0778: [
    'On day renyin, the Emperor, escorting the Empress Dowager, visited the Western Tombs.',
    'On renyin day, the Emperor escorted the Empress Dowager to the Western Tombs.',
  ],
  s0779: [
    'Sheng Yin was made Suiyuan City general.',
    'Sheng Yin became Suiyuan City general.',
  ],
  s0780: [
    'On day jiachen, Husong\'e was transferred to Shengjing general; Fukejing\'a to Jilin general; Wu Zhong\'e to Chahar commandant.',
    'On jiachen day, Husong\'e took Shengjing, Fukejing\'a Jilin, and Wu Zhong\'e Chahar.',
  ],
  s0781: [
    'On day bingwu, the Emperor visited Tailing, Taidongling, and Changling.',
    'On bingwu day, the Emperor visited Tailing, Taidongling, and Changling.',
  ],
  s0782: [
    'On day jiyou, the Emperor visited the Southern Park.',
    'On jiyou day, the Emperor visited the Southern Park.',
  ],
  s0783: [
    'On day gengxu, the Emperor went to the Southern Park for the battue; through renzi it was the same.',
    'On gengxu day, the Emperor hunted at the Southern Park through renzi.',
  ],
  s0784: [
    'On day renzi, because Kazakh Khan Altanshara and others asked to send their sons for audience, they were ordered to audience at Rehe.',
    'On renzi day, Altanshara and other Kazakh khans were told to bring their sons to audience at Rehe.',
  ],
  s0785: [
    'Fourth month, day xinwei: transfer of incompetent provincial officials to capital posts was strictly forbidden.',
    'In month 4, xinwei, incompetent provincials were barred from capital transfers.',
  ],
  s0786: [
    'Fifth month, day xinyou: earthquakes struck fourteen prefectures and counties bordering Henan and Zhili; careful relief was ordered.',
    'In month 5, xinyou, fourteen Henan-Zhili border districts were ordered carefully relieved after earthquakes.',
  ],
  s0787: [
    'Sixth month, day xinmao: because Jiang Youshen was ill, Tao Shu acted as Liangjiang governor-general.',
    'In month 6, xinmao, Jiang Youshen\'s illness put Tao Shu in at Liangjiang.',
  ],
  s0788: [
    'On day yiwei, Cheng Zuluo was made Hunan governor.',
    'On yiwei day, Cheng Zuluo became Hunan governor.',
  ],
  s0789: [
    'Seventh month, day bingzi: Siam sent envoys congratulating the Longevity Festival with local products.',
    'In month 7, bingzi, Siam sent Longevity Festival envoys with local products.',
  ],
  s0790: [
    'Old arrears in quota levies were remitted for four counties of Haizhou, Jiangsu.',
    'Four Haizhou counties in Jiangsu lost old quota arrears.',
  ],
  s0791: [
    'Eighth month, day yiwei: on the Longevity Festival, banquets were suspended.',
    'In month 8, yiwei, Longevity Festival banquets were cancelled.',
  ],
  s0792: [
    'On day gengxu, Jiang Youshen was summoned to the capital; Tao Shu was appointed Liangjiang governor-general.',
    'On gengxu day, Jiang Youshen was recalled and Tao Shu took Liangjiang.',
  ],
  s0793: [
    'Lu Kun was transferred to Jiangsu governor.',
    'Lu Kun became Jiangsu governor.',
  ],
  s0794: [
    'Zhu Guizhen was made Guangdong governor.',
    'Zhu Guizhen became Guangdong governor.',
  ],
  s0795: [
    'Wu Bangqing was ordered to act as grain-transport governor-general with third-rank title.',
    'Wu Bangqing acted as grain-transport governor-general at third rank.',
  ],
  s0796: [
    'That month, additional flood relief was given for four counties including Jianli, Hubei.',
    'That month, Jianli and three other Hubei counties received extra flood relief.',
  ],
  s0797: [
    'Ninth month, day wuwu: Andijan Hui rebels again entered Kashgar; assistant commissioner Taskha was defeated and killed; they then besieged Kashgar city.',
    'In month 9, wuwu, Andijan rebels retook Kashgar, killed Taskha, and besieged the city.',
  ],
  s0798: [
    'Yu Lin and others were ordered to campaign against them.',
    'Yu Lin and others were ordered to suppress them.',
  ],
  s0799: [
    'Yang Yuchun was ordered stationed at Suzhou in Gansu; Yang Fang and Hu Chao were to lead Shaanxi-Gansu troops in joint suppression.',
    'Yang Yuchun was posted to Gansu Suzhou; Yang Fang and Hu Chao led Shaanxi-Gansu troops to assist.',
  ],
  s0800: [
    'E Shan was ordered to act as Shaanxi-Gansu governor-general.',
    'E Shan acted as Shaanxi-Gansu governor-general.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_017_b08.mjs <translation.json>'
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
