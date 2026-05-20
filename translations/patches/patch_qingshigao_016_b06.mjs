#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'On day yiyou, the Emperor returned to the palace; entering Shunzhen Gate, the villain Chen Detu suddenly rushed out and attacked the imperial carriage.',
    'On yiyou day, returning to the palace through Shunzhen Gate, Chen Detu suddenly attacked the imperial carriage.',
  ],
  s0502: [
    'Prince Ding Mian\'en, imperial son-in-law Lawang Duo\'erji, Danba Duo\'erji, and others captured him and handed him to court ministers for strict interrogation.',
    'Mian\'en, Lawang Duo\'erji, Danba Duo\'erji, and others seized him for strict interrogation by the court.',
  ],
  s0503: [
    'Mian\'en and the others were rewarded by degree.',
    'Mian\'en and the others were rewarded in grades.',
  ],
  s0504: [
    'On day dinghai, the First Farmer was sacrificed to; the Emperor personally plowed the ceremonial field.',
    'On dinghai day, the Emperor sacrificed to the First Farmer and plowed the ceremonial field in person.',
  ],
  s0505: [
    'On day jichou, an edict said: "In the matter of Chen De, regard him as a mad dog; there is no need to pursue interrogation to the end.',
    'On jichou day, the Emperor said Chen De was like a mad dog and need not be interrogated endlessly.',
  ],
  s0506: [
    'What shames and alarms me is that moral transformation is not yet manifest—only then could there be this warning sent to me.',
    'He said his shame was that virtue was not yet clear enough to prevent this warning to the throne.',
  ],
  s0507: [
    'Decide at once according to law."',
    'Let the case be decided by law at once."',
  ],
  s0508: [
    'That day Chen De and his two sons were executed.',
    'That day Chen De and his two sons were put to death.',
  ],
  s0509: [
    'Retired Grand Secretary Wang Jie took leave at audience; he was granted a jade pigeon staff, an imperial poem, and express relay home.',
    'Wang Jie, on retirement leave, received a jade staff, an imperial poem, and express passage home.',
  ],
  s0510: [
    'On day gengyin, gate restrictions were strictly enforced.',
    'On gengyin day, palace gate security was tightened.',
  ],
  s0511: [
    'Third month, day bingshen: the palace examination of Hanlin academicians was held.',
    'In the third month, on bingshen day, the Hanlin palace examination was held.',
  ],
  s0512: [
    'On day jiachen, Gansu Grand Coordinator Mukedengbu died fighting while suppressing remaining bandits; he was posthumously granted Second-rank Baron.',
    'On jiachen day, Mukedengbu of Gansu fell fighting bandits and was posthumously made a second-rank baron.',
  ],
  s0513: [
    'Hereditary offices were granted to the families of fallen Hubei commanders including Wang Maoshang.',
    'Families of fallen Hubei commanders including Wang Maoshang received hereditary offices.',
  ],
  s0514: [
    'On day gengshen, the Empress performed the mulberry-picking rite in person.',
    'On gengshen day, the Empress performed the silk-mulberry rite herself.',
  ],
  s0515: [
    'Fourth month, day bingxu: the Emperor prayed for rain.',
    'In the fourth month, on bingxu day, the Emperor prayed for rain.',
  ],
  s0516: [
    'On day dinghai, it rained.',
    'On dinghai day, rain fell.',
  ],
  s0517: [
    'Fifth month, day yimao: housing was built for imperial clansmen and jueluo.',
    'In the fifth month, on yimao day, dwellings were built for the imperial clan and jueluo.',
  ],
  s0518: [
    'On day guichou, Fu Jun was made Jilin general.',
    'On guichou day, Fu Jun became Jilin general.',
  ],
  s0519: [
    'Sixth month, day wuzi: Minister Peng Yuanrui requested retirement; it was granted, but he still served as chief compiler of the Veritable Records of Gaozong.',
    'In the sixth month, on wuzi day, Peng Yuanrui retired but remained chief compiler of Gaozong\'s Veritable Records.',
  ],
  s0520: [
    'Fei Chun was made Minister of War; Chen Dawen, Liangjiang governor-general.',
    'Fei Chun took War and Chen Dawen became Liangjiang governor-general.',
  ],
  s0521: [
    'On day jichou, Ruan Fuying was enfeoffed as king of Vietnam.',
    'On jichou day, Ruan Fuying was made king of Vietnam.',
  ],
  s0522: [
    'Autumn, seventh month, day yisi: Nayancheng was made Minister of Rites.',
    'In the seventh month, on yisi day, Nayancheng became Minister of Rites.',
  ],
  s0523: [
    'On day dingwei, because remaining bandits in the three provinces had been cleared, Erdeniinbalebao, Delingtai, and the Grand Councilors received exceptional rewards.',
    'On dingwei day, with the three provinces pacified, Erdeniinbalebao, Delingtai, and the Grand Councilors were specially rewarded.',
  ],
  s0524: [
    'On day renshen, the Emperor proceeded to Mulan.',
    'On renshen day, the Emperor went to Mulan.',
  ],
  s0525: [
    'Eighth month, day renwu: Fu Jun was transferred to be Mukden general.',
    'In the eighth month, on renwu day, Fu Jun was moved to Mukden general.',
  ],
  s0526: [
    'The imperial progress halted because the autumn hunt was stopped.',
    'The tour ended when the autumn hunt was suspended.',
  ],
  s0527: [
    'On day xinmao, the Emperor returned to the capital.',
    'On xinmao day, the Emperor returned to Beijing.',
  ],
  s0528: [
    'Ninth month, day wushen: retired Minister and former co-Grand Secretary Peng Yuanrui died.',
    'In the ninth month, on wushen day, retired minister Peng Yuanrui died.',
  ],
  s0529: [
    'Winter, tenth month, day renshen: Langgan memorialized the capture of chief rebel Hengzhagang; the Xiluo bandits were pacified.',
    'In the tenth month, on renshen day, Langgan reported Hengzhagang captured and the Xiluo rebels pacified.',
  ],
  s0530: [
    'On day guimao, Empress Xiaoshu was buried at the mountain tomb.',
    'On guimao day, Empress Xiaoshu was buried at the imperial tomb.',
  ],
  s0531: [
    'Eleventh month, day wuxu: Zhu Gui and others asked to grind down the Ming-dynasty stele at the Jingyi Pavilion; the Emperor did not permit it.',
    'In the eleventh month, on wuxu day, Zhu Gui\'s request to efface the Jingyi Pavilion Ming stele was refused.',
  ],
  s0532: [
    'Twelfth month, day jichou: the seasonal collective offering was performed at the Ancestral Temple.',
    'In the twelfth month, on jichou day, the seasonal temple offering was held.',
  ],
  s0533: [
    'That year, disaster and arrears taxes were remitted by degree in four hundred eighteen subprefectures, counties, and guards of Zhili, Shandong, Henan, Jiangsu, Anhui, Shaanxi, Hubei, Sichuan, Yunnan, Gansu, and other provinces.',
    'That year, disaster and arrears taxes were forgiven in 418 districts across many provinces by degree.',
  ],
  s0534: [
    'Korea and Vietnam sent tribute.',
    'Korea and Vietnam presented tribute.',
  ],
  s0535: [
    'Ninth year, spring, first month, day dingwei: Xing Kui was transferred to be Ningxia general; Saichong\'a, Xi\'an general.',
    'In the ninth year, on dingwei day, Xing Kui took Ningxia and Saichong\'a Xi\'an.',
  ],
  s0536: [
    'Second month, day renxu: the Emperor held the classics lecture.',
    'In the second month, on renxu day, the Emperor held court lectures on the classics.',
  ],
  s0537: [
    'On day guihai, the Emperor visited the Hanlin Academy, granted a feast, and composed verse in the cypress-beam style.',
    'On guihai day, the Emperor feasted at the Hanlin Academy and wrote cypress-beam verse.',
  ],
  s0538: [
    'On day wuzi, the Emperor visited the Eastern Tombs.',
    'On wuzi day, the Emperor visited the Eastern Tombs.',
  ],
  s0539: [
    'Third month, day renchen: the Emperor visited Panshan.',
    'In the third month, on renchen day, the Emperor visited Panshan.',
  ],
  s0540: [
    'On day renyin, he visited the Ming tombs and offered wine at Changling.',
    'On renyin day, he visited the Ming tombs and poured wine at Changling.',
  ],
  s0541: [
    'On day jiachen, the Emperor returned to the capital.',
    'On jiachen day, the Emperor returned to Beijing.',
  ],
  s0542: [
    'Summer, fourth month, day jisi: the Emperor reviewed the troops of the Jianrui Camp.',
    'In the fourth month, on jisi day, the Emperor reviewed Jianrui Camp troops.',
  ],
  s0543: [
    'On day bingzi, Ji Chengzhi was summoned to the capital; Xu Duan acted as Hedong river-route commissioner.',
    'On bingzi day, Ji Chengzhi was recalled to Beijing and Xu Duan acted at Hedong river works.',
  ],
  s0544: [
    'Fifth month, day jiawu: the Emperor prayed for rain at Black Dragon Pool.',
    'In the fifth month, on jiawu day, the Emperor prayed for rain at Black Dragon Pool.',
  ],
  s0545: [
    'On day dingyou, it rained.',
    'On dingyou day, rain fell.',
  ],
  s0546: [
    'On day dingwei, Tie Bao memorialized presenting one hundred thirty-four volumes of Eight Banners poetry; it was granted the title Elegant Odes of the Flourishing Court.',
    'On dingwei day, Tie Bao presented 134 volumes of banner poetry, named Elegant Odes of the Flourishing Court.',
  ],
  s0547: [
    'Sixth month, day renxu: Yu De and others memorialized that the pirate Cai Qian was harassing Lukang and had burst into the Shanda stockade.',
    'In the sixth month, on renxu day, Yu De reported the pirate Cai Qian at Lukang and Shanda stockade.',
  ],
  s0548: [
    'An imperial rescript said: pursue and capture—he must be taken.',
    'The rescript ordered pursuit until Cai Qian was captured.',
  ],
  s0549: [
    'On day wuchen, Lu Kang was made co-Grand Secretary; Ming Liang, Minister of Works; Chang Lin, Minister of Punishments; Fei Chun, Minister of Personnel.',
    'On wuchen day, Lu Kang joined the Grand Secretariat; Ming Liang took Works; Chang Lin Punishments; Fei Chun Personnel.',
  ],
  s0550: [
    'De Ying was removed from the Grand Council; Nayancheng and Yinghe were made Grand Councilors.',
    'De Ying left the Grand Council and Nayancheng and Yinghe joined it.',
  ],
  s0551: [
    'On day yihai, Hui Ling died; Nayancheng was made Shaan-Gan governor-general.',
    'On yihai day, Hui Ling died and Nayancheng became Shaan-Gan governor-general.',
  ],
  s0552: [
    'The family of fallen commander Hu Zhensheng, who died fighting pirates, was relieved; he was posthumously made Promotion General, granted a hereditary office, and his son was employed.',
    'Hu Zhensheng, killed fighting pirates, was posthumously made Promotion General with a hereditary office for his son.',
  ],
  s0553: [
    'Autumn, seventh month, day bingwu: the Emperor proceeded to Mulan.',
    'In the seventh month, on bingwu day, the Emperor went to Mulan.',
  ],
  s0554: [
    'On day gengzi, Chu Pengling was stripped of office for falsely impeaching Wu Xiongguang.',
    'On gengzi day, Chu Pengling lost office for a false charge against Wu Xiongguang.',
  ],
  s0555: [
    'On day guichou, because the year completed the jia cycle, executions were halted for the year.',
    'On guichou day, executions were suspended for the year\'s jia-cycle completion.',
  ],
  s0556: [
    'Eighth month, day jiwei: excessive military supplies drawn in Hubei were investigated; the sons of Fukang\'an and Hewalin and Bi Yuan and others were fined in pursuit.',
    'In the eighth month, on jiwei day, Hubei military overdraws were pursued and Fukang\'an\'s and Hewalin\'s sons and Bi Yuan were fined.',
  ],
  s0557: [
    'On day dingchou, the Emperor returned from progress and visited the tombs.',
    'On dingchou day, the Emperor returned from tour and visited the tombs.',
  ],
  s0558: [
    'Ninth month, day gengyin: the Emperor visited the Southern Park for the hunt.',
    'In the ninth month, on gengyin day, the Emperor hunted at the Southern Park.',
  ],
  s0559: [
    'On day xinmao, because the search for remaining bandits in the three provinces was wholly ended, Erdeniinbalebao and those below received graded rewards.',
    'On xinmao day, with the three provinces fully pacified, Erdeniinbalebao and others were rewarded by degree.',
  ],
  s0560: [
    'On day jiawu, the Emperor returned to the capital.',
    'On jiawu day, the Emperor returned to Beijing.',
  ],
  s0561: [
    'Winter, tenth month, day guiyou: Guangxi Wuyuan magistrate Sun Tingbiao concealed injury and indulged a killer; by special edict he was sentenced to strangulation, and surveillance commissioner Gong\'e was exiled to Urumqi.',
    'In the tenth month, on guiyou day, Sun Tingbiao was sentenced to strangulation for shielding a killer and Gong\'e was exiled to Urumqi.',
  ],
  s0562: [
    'On day jimao, the Emperor, at Dunxu Hall, granted a feast to the princes of the imperial clan.',
    'On jimao day, the Emperor feasted the imperial princes at Dunxu Hall.',
  ],
  s0563: [
    'Eleventh month, day wushen: Nayancheng was transferred to be Liangguang governor-general; Washibu, Shaan-Gan governor-general.',
    'In the eleventh month, on wushen day, Nayancheng took Liangguang and Washibu Shaan-Gan.',
  ],
  s0564: [
    'Twelfth month, day dingmao: Xu Duan was transferred to be Jiangnan river-route commissioner.',
    'In the twelfth month, on dingmao day, Xu Duan became Jiangnan river commissioner.',
  ],
  s0565: [
    'On day gengchen, Grand Secretary Liu Yong died.',
    'On gengchen day, Grand Secretary Liu Yong died.',
  ],
  s0566: [
    'On day jiashen, the seasonal collective offering was performed at the Ancestral Temple.',
    'On jiashen day, the seasonal temple offering was held.',
  ],
  s0567: [
    'That year, disaster taxes were remitted by degree in twenty-one subprefectures and counties of Zhili, Hubei, Sichuan, and other provinces.',
    'That year, disaster taxes were forgiven in 21 districts of Zhili, Hubei, and Sichuan by degree.',
  ],
  s0568: [
    'Korea and Siam sent tribute.',
    'Korea and Siam presented tribute.',
  ],
  s0569: [
    'Tenth year, spring, first month, day yimao: retired Grand Secretary Wang Jie, having come to the capital on a birthday grant, died; an excellent burial edict was issued.',
    'In the tenth year, on yimao day, Wang Jie died in Beijing on a birthday visit and received a generous burial edict.',
  ],
  s0570: [
    'On day xinhai, Zhu Gui was made Grand Secretary; Ji Yun, co-Grand Secretary; Tie Bao, Liangjiang governor-general.',
    'On xinhai day, Zhu Gui joined the Grand Secretariat, Ji Yun as co-secretary, and Tie Bao took Liangjiang.',
  ],
  s0571: [
    'An edict ordered Interior Ministry ministers strictly to restrain eunuchs, audit their comings and goings, compile the rules into palace history, and make them standing regulations.',
    'The court ordered strict control of eunuchs, recorded in palace history as permanent rules.',
  ],
  s0572: [
    'Second month, day jiwei: the Emperor held the classics lecture.',
    'In the second month, on jiwei day, the Emperor held court lectures on the classics.',
  ],
  s0573: [
    'On day jisi, Prince of Rites Yong\'en died; his son Zhaoluoshi inherited.',
    'On jisi day, Prince of Rites Yong\'en died and his son Zhaoluoshi succeeded.',
  ],
  s0574: [
    'Co-Grand Secretary Ji Yun died; Liu Quanzhi was transferred to Minister of Rites and co-Grand Secretary.',
    'Ji Yun died and Liu Quanzhi became Minister of Rites and co-Grand Secretary.',
  ],
  s0575: [
    'Third month, day jichou: the Emperor visited the Southern Park for the hunt.',
    'In the third month, on jichou day, the Emperor hunted at the Southern Park.',
  ],
  s0576: [
    'On day jihai, the Emperor visited Tailing.',
    'On jihai day, the Emperor visited Tailing.',
  ],
  s0577: [
    'On day bingwu, returning from progress, he reviewed the troops of the Jianrui Camp.',
    'On bingwu day, returning from tour, he reviewed Jianrui Camp troops.',
  ],
  s0578: [
    'On day wushen, the Emperor returned to the capital.',
    'On wushen day, the Emperor returned to Beijing.',
  ],
  s0579: [
    'Hong Kang was made Guangzhou general.',
    'Hong Kang became Guangzhou general.',
  ],
  s0580: [
    'Summer, fourth month, day xinsi: Censor Cai Weiyu memorialized requesting investigation and prohibition of Westerners printing books and preaching religion.',
    'In the fourth month, on xinsi day, Cai Weiyu asked to ban Western book-printing and preaching.',
  ],
  s0581: [
    'An imperial rescript said: ban it entirely.',
    'The rescript ordered a complete ban.',
  ],
  s0582: [
    'On day wuyin, Peng Jun and two hundred forty-three others were granted jinshi and other degrees by difference.',
    'On wuyin day, Peng Jun and 243 others received jinshi degrees by rank.',
  ],
  s0583: [
    'Fifth month, new moon on day jiashen: an edict said the Interior Ministry ministers who managed the Western Hall had failed to inspect strictly and had allowed preaching; they were referred to the ministry for disposition.',
    'On the fifth-month new moon, jiashen, Western Hall managers were referred for punishment for lax control of preaching.',
  ],
  s0584: [
    'The scriptures were inspected and destroyed; Tonglan and others who practiced the teaching were punished.',
    'Missionary scriptures were destroyed and teachers including Tonglan were punished.',
  ],
  s0585: [
    'On day wushen, retrospective rewards were granted for merit in pacifying teaching rebels and clearing the countryside; Jialebao was advanced to Grand Guardian; Ming Liang, first-class viscount.',
    'On wushen day, pacification merits raised Jialebao to Grand Guardian and Ming Liang to first-class viscount.',
  ],
  s0586: [
    'Sixth month, day gengshen: Yan Jian was dismissed and removed for failure to investigate treasury deficits; Wu Xiongguang was made Zhili governor-general; Bai Ling, Huguang governor-general.',
    'In the sixth month, on gengshen day, Yan Jian fell over deficits; Wu Xiongguang took Zhili and Bai Ling Huguang.',
  ],
  s0587: [
    'On day dingchou, the Yongding River breached.',
    'On dingchou day, the Yongding River broke its banks.',
  ],
  s0588: [
    'Intercalary sixth month, day guimao: Liu Quanzhi was relieved; Fei Chun was made co-Grand Secretary; Qin Chen\'en, Left Censor-in-chief.',
    'In the intercalary sixth month, on guimao day, Liu Quanzhi left office; Fei Chun joined the Grand Secretariat; Qin Chen\'en took the left censorate.',
  ],
  s0589: [
    'On day wuxu, the Yongding River channels rejoined.',
    'On wuxu day, the Yongding River was closed again.',
  ],
  s0590: [
    'On day yisi, Qing Antai was made Zhejiang governor.',
    'On yisi day, Qing Antai became Zhejiang governor.',
  ],
  s0591: [
    'Autumn, seventh month, day renchen: the Emperor proceeded to Mukden to visit the tombs and set out the imperial carriage.',
    'In the seventh month, on renchen day, the Emperor set out for Mukden to visit the tombs.',
  ],
  s0592: [
    'Eighth month, day bingxu: the Emperor sacrificed at Beizhen Temple.',
    'In the eighth month, on bingxu day, the Emperor sacrificed at Beizhen Temple.',
  ],
  s0593: [
    'On day yiwei, the Emperor visited Yongling.',
    'On yiwei day, the Emperor visited Yongling.',
  ],
  s0594: [
    'On day bingshen, the great feast rite was performed.',
    'On bingshen day, the great feast rite was performed.',
  ],
  s0595: [
    'Jilin troops\' archery was reviewed.',
    'The Emperor reviewed Jilin troops at archery.',
  ],
  s0596: [
    'On day gengzi, the Emperor visited Fuling and performed the great feast rite.',
    'On gengzi day, the Emperor visited Fuling and held the great feast rite.',
  ],
  s0597: [
    'On day xinchou, the Emperor visited Zhaoling and performed the great feast rite.',
    'On xinchou day, the Emperor visited Zhaoling and held the great feast rite.',
  ],
  s0598: [
    'He personally offered mourning at the tombs of Prince Kegen Yuetuo, Prince of Martial Merit Yangguli, Duke of Hongyi Eidu, and Duke of Direct Loyalty Feiyingdong.',
    'He mourned at the tombs of Yuetuo, Yangguli, Eidu, and Feiyingdong.',
  ],
  s0599: [
    'The Emperor halted at Mukden and performed rites before the precious registers.',
    'At Mukden the Emperor performed rites before the ancestral registers.',
  ],
  s0600: [
    'On day jiachen, rites were performed at the Altars of Heaven and Earth.',
    'On jiachen day, the Emperor performed rites at the Heaven and Earth Altars.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b06.mjs <translation.json>'
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
