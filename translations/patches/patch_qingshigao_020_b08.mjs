#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'Xi Ling\'a was ordered to proceed to Henan for defense and suppression.',
    'Xi Ling\'a was sent to Henan to fight bandits.',
  ],
  s0702: [
    'On day gengxu, Nien bandit Zhang Luoxing fled back toward Guide.',
    'On gengxu day, Nien leader Zhang Luoxing retreated toward Guide.',
  ],
  s0703: [
    'On day guichou, Yinggui was ordered to supervise suppression of Nien bandits in Henan, Shandong, and Anhui provinces.',
    'On guichou day, Yinggui took command against Nien rebels in Henan, Shandong, and Anhui.',
  ],
  s0704: [
    'Jingchun memorialized on defense against barbarians; the Emperor commended and rewarded him.',
    'Jingchun reported on coastal defense; the Emperor praised him.',
  ],
  s0705: [
    'Tibet Resident Commissioner Hetehe memorialized that he had hurried to rear Tibet to plan the general defense.',
    'Hetehe reported rushing to rear Tibet to organize defense.',
  ],
  s0706: [
    'Received the edict: "Gyantse, Dingri post, Mapuja, and other places are all key points on the central route and should be held at once.',
    'An edict said Gyantse, Dingri, Mapuja, and other central-route strongpoints must be held immediately.',
  ],
  s0707: [
    'Among the kashag agents, choose those trusted by the barbarians and order them to cooperate in affairs to supplement what troops cannot cover.',
    'Trusted kashag agents were to assist where troops fell short.',
  ],
  s0708: [
    'Barbarians captured alive should be kept temporarily in camp and allowed to communicate back and forth to show conciliatory control.',
    'Captured tribesmen were to be held as messengers for a conciliatory policy.',
  ],
  s0709: [
    'The six articles drafted by Le Bin and others were sent down for the resident commissioner to know.',
    'Le Bin\'s six proposals were sent to the commissioner.',
  ],
  s0710: [
    '" On day dingsi, the combined seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'The edict closed." On dingsi day, the court held the temple combined sacrifice.',
  ],
  s0711: [
    'That year, taxes were remitted for 158 prefectures and counties in two circuits each in Zhili, Shandong, Hubei, Guangxi, Guizhou, and other provinces; disaster levies were also remitted for thirty-eight native districts in Guangxi; and salt-field duties in Jiangsu were adjusted variously.',
    'That year tax relief covered 158 districts in Zhili, Shandong, Hubei, Guangxi, and Guizhou, thirty-eight Guangxi native districts, and adjusted Jiangsu salt-field dues.',
  ],
  s0712: [
    'Korea and Ryukyu presented tribute.',
    'Korea and Ryukyu sent tribute missions.',
  ],
  s0713: [
    'In the sixth year, spring, first month, new moon day jiwei: Prince Dun Yi Song was restored to princely rank.',
    'In year 6, spring month 1, new moon jiwei, Prince Dun Yi Song regained princely rank.',
  ],
  s0714: [
    'Yi Shan was made an imperial presence grand minister and Beile Zai Zhi was assigned to walk attendance before the throne.',
    'Yi Shan joined the imperial presence and Beile Zai Zhi received front-audience duty.',
  ],
  s0715: [
    'On day renxu, Yang Yizeng died; Geng Chang was made Grand Canal governor-general of Jiangnan.',
    'On renxu day, Yang Yizeng died and Geng Chang became Jiangnan canal governor-general.',
  ],
  s0716: [
    'On day renshen, rebels harried Hunan\'s Huangzhou and Mayang; government troops drove them off and beheaded rebel leader He Lu.',
    'On renshen day, rebels struck Huangzhou and Mayang in Hunan; troops routed them and killed He Lu.',
  ],
  s0717: [
    'On day yihai, an edict ordered Luo Bingzhang to dispatch prefect Liu Changyou to Jiangxi to suppress rebels.',
    'On yihai day, Luo Bingzhang was told to send Prefect Liu Changyou to fight rebels in Jiangxi.',
  ],
  s0718: [
    'On day wuyin, Guangdong provincial military commissioner Kunshou suppressed Guiji rebels and pacified them.',
    'On wuyin day, Kunshou pacified Guiji rebels in Guangdong.',
  ],
  s0719: [
    'On day xinsi, provincial military commissioner Qin Dingsan captured Shucheng.',
    'On xinsi day, Qin Dingsan took Shucheng.',
  ],
  s0720: [
    'Second month, day renchen: an edict said Hunan Miao officers who exerted themselves suppressing bandits might remain in camp for seniority promotion.',
    'In month 2, renchen, Miao officers who fought well in Hunan could earn camp seniority for promotion.',
  ],
  s0721: [
    'On day wuxu, the Emperor attended the classics lecture.',
    'On wuxu day, the Emperor held the classics lecture.',
  ],
  s0722: [
    'On day xinchou, Shuntian prefect Jiang Qichun presented memorials advancing the Maxims on Self-Restraint and on Returning to Rites; the Emperor commended and accepted them.',
    'On xinchou day, Jiang Qichun submitted essays on restraint and ritual; the Emperor approved.',
  ],
  s0723: [
    'On day bingwu, Britain and the United States sought treaty revision; the matter was sent down for Ye Mingchen to know.',
    'On bingwu day, Britain and America asked to revise treaties; Ye Mingchen was notified.',
  ],
  s0724: [
    'On day dingwei, troops from Jilin, Heilongjiang, Chahar, and Suiyuan city were transferred to Shandong and Henan to suppress rebels.',
    'On dingwei day, banner troops from the northeast were sent to Shandong and Henan against rebels.',
  ],
  s0725: [
    'On day jiyou, civil officials in provinces directly under the court were given an increase to their reduced-percentage integrity-nourishment allowances.',
    'On jiyou day, provincial civil officials received increased integrity-pay supplements.',
  ],
  s0726: [
    'On day renzi, Fuxing was ordered to assist in Jiangnan military affairs.',
    'On renzi day, Fuxing was assigned to Jiangnan military affairs.',
  ],
  s0727: [
    'On day bingchen, Nepal asked to cease fighting.',
    'On bingchen day, Nepal sought peace.',
  ],
  s0728: [
    'On day dingsi, Guizhou government troops captured Tongren.',
    'On dingsi day, Guizhou troops took Tongren.',
  ],
  s0729: [
    'Third month, day jiwei: Guazhou rebels sallied onto the Grand Canal; Tuoming\'a pursued and suppressed them.',
    'In month 3, jiwei, Guazhou rebels raided the canal and Tuoming\'a pursued them.',
  ],
  s0730: [
    'Yi Xiang was dismissed and Qingqi was made Mukden general.',
    'Yi Xiang left office and Qingqi became Mukden general.',
  ],
  s0731: [
    'On day renxu, Hunan government troops recovered Yongming and Jianghua.',
    'On renxu day, Hunan troops recovered Yongming and Jianghua.',
  ],
  s0732: [
    'Liu Changyou\'s army entered Jiangxi and recovered Pingxiang.',
    'Liu Changyou entered Jiangxi and retook Pingxiang.',
  ],
  s0733: [
    'Jiangxi rebels captured Ji\'an.',
    'Rebels took Ji\'an in Jiangxi.',
  ],
  s0734: [
    'On day guihai, the Emperor plowed the sacred field.',
    'On guihai day, the Emperor plowed the sacred field.',
  ],
  s0735: [
    'On day jiazi, Jiangnan rebels again captured Yangzhou; Tuoming\'a and Lei Yixuan were stripped of office; Dexing\'a was made Imperial Commissioner with Junior Guardian Weng Tongshu as deputy.',
    'On jiazi day, Yangzhou fell again; Tuoming\'a and Lei Yixuan lost rank; Dexing\'a became Imperial Commissioner with Weng Tongshu as deputy.',
  ],
  s0736: [
    'On day yichou, Shi Dakai captured Ruizhou; an edict ordered Guangdong to block and suppress him.',
    'On yichou day, Shi Dakai took Ruizhou and Guangdong was ordered to intercept him.',
  ],
  s0737: [
    'On day dingmao, Saišang\'a and Ne\'erjing\'e were released from exile posts.',
    'On dingmao day, Saišang\'a and Ne\'erjing\'e were freed from exile.',
  ],
  s0738: [
    'On day yihai, provincial military commissioner Deng Shaoliang pressed the attack on Yangzhou, captured it, and was ordered to assist Dexing\'a in military affairs.',
    'On yihai day, Deng Shaoliang stormed Yangzhou, took it, and joined Dexing\'a\'s staff.',
  ],
  s0739: [
    'Rebels fled to Jiangpu.',
    'Rebels fled toward Jiangpu.',
  ],
  s0740: [
    'On day dingchou, Luo Zeyuan pressed the attack on Wuchang, died in battle, was posthumously made governor, and given condolence gifts and a posthumous title.',
    'On dingchou day, Luo Zeyuan died assaulting Wuchang and was posthumously ennobled as governor.',
  ],
  s0741: [
    'On day wuyin, rebels captured Jiangxi\'s Jianchang.',
    'On wuyin day, rebels took Jianchang in Jiangxi.',
  ],
  s0742: [
    'Zhejiang education intendant Wan Qingli and provincial administration commissioner Yan Duanshu were ordered to supervise defense of the Three Qu prefectures.',
    'Wan Qingli and Yan Duanshu were ordered to defend the Three Qu region in Zhejiang.',
  ],
  s0743: [
    'On day gengchen, the birth mother of Muzong, Yipin of the Nara clan, was promoted to Yifei.',
    'On gengchen day, the future Empress Dowager Cixi was raised from yipin to yifei.',
  ],
  s0744: [
    'Zeng Guofan attacked rebels at Zhangshu unsuccessfully and was referred to the Boards for deliberation.',
    'Zeng Guofan failed at Zhangshu and faced board review.',
  ],
  s0745: [
    'On day guiwei, Hengchun memorialized that military affairs provinces should have governors and governors-general memorialize under single signature; assent was given.',
    'On guiwei day, Hengchun won permission for frontier governors to memorialize on military affairs alone.',
  ],
  s0746: [
    'On day bingxu, Zhang Guoliang\'s army captured Pukou.',
    'On bingxu day, Zhang Guoliang took Pukou.',
  ],
  s0747: [
    'Summer, fourth month, day wuzi: Guangdong rebels again captured Yizheng; government troops soon recovered it.',
    'In summer, month 4, wuzi, Guangdong rebels retook Yizheng but troops soon recovered it.',
  ],
  s0748: [
    'On day jiawu, Guizhou troops recovered Langdai.',
    'On jiawu day, Guizhou troops retook Langdai.',
  ],
  s0749: [
    'On day bingshen, Han and Hui in Yunnan\'s Chuxiong clashed.',
    'On bingshen day, Han and Hui rioted in Chuxiong, Yunnan.',
  ],
  s0750: [
    'On day jihai, Jiangxi troops recovered Jinxian.',
    'On jihai day, Jiangxi troops retook Jinxian.',
  ],
  s0751: [
    'On day xinchou, Fengtian\'s Jinzhou had an earthquake.',
    'On xinchou day, Jinzhou in Fengtian was shaken by earthquake.',
  ],
  s0752: [
    'On day guimao, Anhui rebels captured Ningguo.',
    'On guimao day, rebels took Ningguo in Anhui.',
  ],
  s0753: [
    'On day bingwu, former associate grand councillor and retired Grand Master of Splendid Happiness Tang Jin\'gao died and was posthumously made minister.',
    'On bingwu day, retired minister Tang Jin\'gao died and was posthumously made minister.',
  ],
  s0754: [
    'On day xinhai, Weng Tonghe and 215 others were granted jinshi degrees with ranks by distinction.',
    'On xinhai day, Weng Tonghe and 215 others received jinshi degrees.',
  ],
  s0755: [
    'On day bingchen, Dexing\'a memorialized that government troops had attacked rebel nests at San Cha River and destroyed them.',
    'On bingchen day, Dexing\'a reported destroying rebel nests at San Cha River.',
  ],
  s0756: [
    'Fifth month, day xinyou: Mukedena was made Guangzhou general and Duxing\'a Jiangning general.',
    'In month 5, xinyou, Mukedena became Guangzhou general and Duxing\'a Jiangning general.',
  ],
  s0757: [
    'On day renxu, government troops were defeated at Tongcheng, Hubei, and circuit intendant Jiang Zhongji died.',
    'On renxu day, Hubei troops lost at Tongcheng and Jiang Zhongji was killed.',
  ],
  s0758: [
    'Jiangsu governor Ji\'erhang\'a attacked rebels at Huangnizhou near Zhenjiang, was defeated, and died; he was posthumously made governor-general.',
    'Governor Ji\'erhang\'a died fighting at Huangnizhou near Zhenjiang and was posthumously made governor-general.',
  ],
  s0759: [
    'Zhao Dezhe was made acting Jiangsu governor.',
    'Zhao Dezhe became acting Jiangsu governor.',
  ],
  s0760: [
    'On day jiazi, Jiangnan rebels stormed the Jiuhua Mountain encampment and captured it.',
    'On jiazi day, rebels stormed and took the Jiuhua Mountain camp.',
  ],
  s0761: [
    'Henan troops recovered Guang prefecture.',
    'Henan troops retook Guang prefecture.',
  ],
  s0762: [
    'Xi Ling\'a was restored as commandant-in-chief.',
    'Xi Ling\'a regained his commandant rank.',
  ],
  s0763: [
    'Yuan Jiasan was restored as third-rank grand secretary.',
    'Yuan Jiasan regained third-rank secretary rank.',
  ],
  s0764: [
    'On day dingchou, rebels captured Lishui.',
    'On dingchou day, rebels took Lishui.',
  ],
  s0765: [
    'Sixth month, new moon day bingxu: Jinling rebels stormed and took the great camp; government troops fell back to defend Danyang; Xiang Rong and Fuxing were stripped of office.',
    'At the sixth-month new moon, bingxu, Taiping rebels overran the Jinling great camp; troops fell back to Danyang; Xiang Rong and Fuxing lost rank.',
  ],
  s0766: [
    'On day wuzi, surveillance commissioner Xu Zonggan was ordered to assist in Anhui defense affairs.',
    'On wuzi day, Xu Zonggan joined Anhui defense staff.',
  ],
  s0767: [
    'Yiliang was ordered to hire steamships to enter the river and suppress rebels.',
    'Yiliang was told to hire steam gunboats for the Yangzi campaign.',
  ],
  s0768: [
    'An imperial command ordered Henan and Guangdong to detach troops; Hechun and Fu Zhenbang were sent to aid Jiangnan.',
    'Troops were ordered from Henan and Guangdong; Hechun and Fu Zhenbang went south to aid Jiangnan.',
  ],
  s0769: [
    'On day dingwei, Ye Mingchen memorialized that British, American, and French ministers, citing the twelve-year treaty provision, asked to go to the capital to revise treaties.',
    'On dingwei day, Ye Mingchen said British, American, and French ministers wanted treaty revision in Beijing after twelve years.',
  ],
  s0770: [
    'An edict granted flexible approval in part but barred their coming to the capital.',
    'The court allowed some flexibility but barred the envoys from Beijing.',
  ],
  s0771: [
    'On day xinhai, the Yongding River overflowed.',
    'On xinhai day, the Yongding River burst its banks.',
  ],
  s0772: [
    'Jiangxi rebels captured Raozhou.',
    'Rebels took Raozhou in Jiangxi.',
  ],
  s0773: [
    'Autumn, seventh month, day xinyou: Guangdong relief troops successively recovered Shangyou and Yudu in Jiangxi and lifted the siege of Ganzhou.',
    'In autumn, month 7, xinyou, Guangdong troops retook Shangyou and Yudu and raised the siege of Ganzhou.',
  ],
  s0774: [
    'Wang Yide presented the American state letter; received the edict: "Treaty replacement is hard to approve; they are still ordered back to Guangdong to negotiate.',
    'Wang Yide presented America\'s letter; an edict refused treaty replacement and sent negotiators back to Guangdong.',
  ],
  s0775: [
    '" On day dingmao, Brigadier Zhang Guoliang was ordered to assist Xiang Rong in military affairs.',
    'The edict closed." On dingmao day, Zhang Guoliang joined Xiang Rong\'s staff.',
  ],
  s0776: [
    'On day renshen, Jiangxi government troops successively recovered Nankang and Raozhou.',
    'On renshen day, Jiangxi troops retook Nankang and Raozhou.',
  ],
  s0777: [
    'On day guiyou, Imperial Commissioner Xiang Rong died in the army.',
    'On guiyou day, Xiang Rong died at the front.',
  ],
  s0778: [
    'On day bingzi, Salar Hui rebels in Gansu stirred trouble; government troops suppressed them.',
    'On bingzi day, Salar rebels in Gansu were suppressed.',
  ],
  s0779: [
    'Hechun was ordered to hurry to Danyang to suppress rebels; Zheng Kuishi took over Anhui military affairs.',
    'Hechun was sent to Danyang and Zheng Kuishi took Anhui command.',
  ],
  s0780: [
    'Hubei relief troops recovered Xinchang and Shanggao in Jiangxi.',
    'Hubei reinforcements retook Xinchang and Shanggao in Jiangxi.',
  ],
  s0781: [
    'Hetehe memorialized that Nepal and Tangut Tibet had made peace and garrison troops were withdrawn.',
    'Hetehe reported peace between Nepal and Tibet and withdrawal of garrisons.',
  ],
  s0782: [
    'Eighth month, day wuzi: Huang Zonghan was dismissed; Wu Zhendong was made Sichuan governor-general and Tan Tingxiang Shaanxi governor.',
    'In month 8, wuzi, Huang Zonghan left office; Wu Zhendong became Sichuan governor-general and Tan Tingxiang Shaanxi governor.',
  ],
  s0783: [
    'On day guisi, Shuxing\'a was ordered strictly to handle Hui rebels and organize local militia.',
    'On guisi day, Shuxing\'a was ordered to suppress Hui rebels and raise local militia.',
  ],
  s0784: [
    'On day guimao, Guangxi government troops recovered Shangsizhou and Guixian.',
    'On guimao day, Guangxi troops retook Shangsizhou and Guixian.',
  ],
  s0785: [
    'On day dingwei, Guizhou rebels captured Duyun and Shibing and advanced to take Guzhou.',
    'On dingwei day, rebels took Duyun and Shibing in Guizhou and then Guzhou.',
  ],
  s0786: [
    'On day wushen, Anhui government troops captured Sanhe.',
    'On wushen day, Anhui troops took Sanhe.',
  ],
  s0787: [
    'On day jiyou, Jiangxi secret-society bandits attacked and captured Guangchang, Nanfeng, Xinchang, and Luxi.',
    'On jiyou day, Jiangxi secret societies took Guangchang, Nanfeng, Xinchang, and Luxi.',
  ],
  s0788: [
    'Ninth month, new moon day yimao: there was a solar eclipse.',
    'At the ninth-month new moon, yimao, there was a solar eclipse.',
  ],
  s0789: [
    'On day wuwu, grain was dear in the capital; soup kitchens were opened in the Five Wards and granary grain and cash were issued for famine relief to hungry people in six prefectures and counties including Gu\'an.',
    'On wuwu day, dear grain in Beijing brought soup kitchens and relief for Gu\'an and five other districts.',
  ],
  s0790: [
    'On day jisi, Yunnan bandits captured Langqiong.',
    'On jisi day, bandits took Langqiong in Yunnan.',
  ],
  s0791: [
    'On day gengwu, Jiangnan government troops attacked Gaochun and captured it.',
    'On gengwu day, Jiangnan troops took Gaochun.',
  ],
  s0792: [
    'On day guiyou, Anhui government troops recovered Wuwei prefecture.',
    'On guiyou day, Anhui troops retook Wuwei.',
  ],
  s0793: [
    'On day dingchou, Wenqing and others presented Meng Bao\'s translated Great Learning and Its Extensions; an edict ordered collation and distribution.',
    'On dingchou day, Wenqing submitted Meng Bao\'s translation of the Daxue yanyi for publication.',
  ],
  s0794: [
    'On day renwu, Black Tibetan tribes in Xining stirred trouble; provincial military commissioner Suowen suppressed them.',
    'On renwu day, Suowen suppressed Black Tibetan unrest near Xining.',
  ],
  s0795: [
    'Yi Tang was dismissed for illness; Le Bin was made Shaanxi-Gansu governor-general, You Feng Chengdu general, and Dong Chun Fuzhou general.',
    'Yi Tang left office; Le Bin became Shaanxi-Gansu governor-general; You Feng and Dong Chun took regional commands.',
  ],
  s0796: [
    'Winter, tenth month, day bingxu: Guizhou rebels captured Taigong and Huangping.',
    'In winter, month 10, bingxu, Guizhou rebels took Taigong and Huangping.',
  ],
  s0797: [
    'On day gengyin, Guan Wen suppressed bandits in Xiangyang and pacified them.',
    'On gengyin day, Guan Wen pacified Xiangyang bandits.',
  ],
  s0798: [
    'On day jiawu, Yinggui and Qin Dingsan were ordered jointly to suppress Nien bandits at the Wo River and Mengcheng.',
    'On jiawu day, Yinggui and Qin Dingsan were sent against Nien bandits on the Wo River and at Mengcheng.',
  ],
  s0799: [
    'On day dingyou, Anhui government troops recovered Hezhou.',
    'On dingyou day, Anhui troops retook Hezhou.',
  ],
  s0800: [
    'Yunnan Dali Hui rebels killed officials and seized the city.',
    'Dali Hui rebels in Yunnan killed officials and held the city.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_020_b08.mjs <translation.json>'
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
