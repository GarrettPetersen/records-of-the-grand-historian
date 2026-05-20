#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Korea, Ryukyu, and Sulu sent tribute.',
    'Korea, Ryukyu, and Sulu paid tribute.',
  ],
  s0302: [
    'Fifth year, spring, first month, new moon on day wuzi: the seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'In the fifth year, on the new moon of the first month of spring, the seasonal sacrifice was held at the Imperial Ancestral Temple.',
  ],
  s0303: [
    'On day renyin, the sons of Nian Gengyao who had been banished to the frontier were pardoned.',
    'On renyin day, Nian Gengyao\'s sons in frontier exile were pardoned.',
  ],
  s0304: [
    'On day jiachen, princes and ministers memorialized that the Yellow River had cleared and asked for a court celebration; the Emperor did not permit it.',
    'On jiachen day, ministers reported the Yellow River had cleared and sought a celebration; the Emperor refused.',
  ],
  s0305: [
    'Civil and military officials were promoted one rank.',
    'Civil and military officials received one rank of promotion.',
  ],
  s0306: [
    'An edict ordered the Eight Banners to turn in copper vessels, with a three-year deadline; those who concealed them were punished.',
    'The Eight Banners were ordered to surrender copper vessels within three years; concealment was punishable.',
  ],
  s0307: [
    'On day yisi, Sun Zhu was appointed acting Grand Secretary.',
    'On yisi day, Sun Zhu became acting Grand Secretary.',
  ],
  s0308: [
    'On day bingchen, Shen Jinshi was made Left Censor-in-chief and concurrent Vice Minister of Personnel.',
    'On bingchen day, Shen Jinshi became Left Censor-in-chief and Vice Minister of Personnel.',
  ],
  s0309: [
    'Second month, day dingmao: the Emperor paid respects at the imperial tombs.',
    'In the second month, on dingmao day, the Emperor visited the imperial tombs.',
  ],
  s0310: [
    'On day jiachen, garrison soldiers at Guangzhou caused trouble; General Li Di was sentenced to death for shielding them.',
    'On jiachen day, Guangzhou garrison troops rioted; General Li Di was sentenced to death for covering them up.',
  ],
  s0311: [
    'On day jiaxu, the Emperor returned to the capital.',
    'On jiaxu day, the Emperor returned to Beijing.',
  ],
  s0312: [
    'On day jiashen, the Emperor attended the Classics lecture.',
    'On jiashen day, the Emperor held the Classics lecture.',
  ],
  s0313: [
    'On day bingxu, Li Fu was ordered to Guangxi to capture the fugitive Luo Wengang.',
    'On bingxu day, Li Fu was sent to Guangxi to seize the fugitive Luo Wengang.',
  ],
  s0314: [
    'Wengang came forward and surrendered.',
    'Luo Wengang surrendered of his own accord.',
  ],
  s0315: [
    'Third month, day gengyin: an edict ordered the metropolitan examination held in the third month and ginger soup and charcoal provided.',
    'In the third month, on gengyin day, the metropolitan examination was set for the third month with ginger soup and charcoal supplied.',
  ],
  s0316: [
    'Guanglu succeeded as Prince Yu.',
    'Guanglu inherited the title Prince Yu.',
  ],
  s0317: [
    'On day wuxu, the Emperor proclaimed Cai Ting\'s crimes and handed him to the Ministry of Punishments for detention and interrogation.',
    'On wuxu day, the Emperor announced Cai Ting\'s crimes and ordered the Ministry of Punishments to detain and try him.',
  ],
  s0318: [
    'On day xinchou, the maritime ban in Fujian was lifted.',
    'On xinchou day, Fujian\'s maritime trade ban was opened.',
  ],
  s0319: [
    'On day bingwu, the Russian Tsar Khan sent the envoy Sawa to congratulate the accession and present tribute; rewards were granted as usual.',
    'On bingwu day, Russia\'s Tsar Khan sent envoy Sawa to congratulate the enthronement and offer tribute; rewards followed precedent.',
  ],
  s0320: [
    'Inner Minister Ma Wu died.',
    'Inner Minister Ma Wu died.',
  ],
  s0321: [
    'Grand Secretary Gao Qiwei died.',
    'Grand Secretary Gao Qiwei died.',
  ],
  s0322: [
    'Intercalary third month, day yichou: failed metropolitan candidates were selected and dispatched to provinces for appointment as prefectural and county officials.',
    'In the intercalary third month, failed metropolitan candidates were assigned to provinces as prefectural and county officials.',
  ],
  s0323: [
    'On day wuchen, Yi Zhaoxiong was made Minister of Personnel and Mai Zhu governor-general of Huguang.',
    'On wuchen day, Yi Zhaoxiong became Minister of Personnel and Mai Zhu Huguang governor-general.',
  ],
  s0324: [
    'On day guiyou, the two native prefectures of Wumeng and Zhenxiong were converted to regular administration.',
    'On guiyou day, Wumeng and Zhenxiong native prefectures were replaced with regular officials.',
  ],
  s0325: [
    'On day jimao, Aisin Gioro Yilibu was made general at Fengtian and Changshou general at Jiangning.',
    'On jimao day, Yilibu became Fengtian general and Changshou Jiangning general.',
  ],
  s0326: [
    'On day bingxu, Hongsheng was stripped of his rank for his crimes.',
    'On bingxu day, Hongsheng lost his title for misconduct.',
  ],
  s0327: [
    'Summer, fourth month, day wuzi: the Turfan Muslim chief asked to send tribute; this was refused, as troops had been withdrawn and the territory had been promised to Tsewang Araptan.',
    'In the fourth month, Turfan\'s Muslim chief sought to send tribute but was refused because troops had withdrawn and the land was promised to Tsewang Araptan.',
  ],
  s0328: [
    'Fu Min was made Minister of Personnel; Huang Guocai acting Minister of War.',
    'Fu Min became Minister of Personnel; Huang Guocai acted as Minister of War.',
  ],
  s0329: [
    'On day xinmao, Peng Qifeng and two hundred twenty-six others were granted jinshi degrees and other ranks with distinctions.',
    'On xinmao day, Peng Qifeng and 226 others received jinshi degrees.',
  ],
  s0330: [
    'On day guisi, prefectures and counties were ordered, together with school officials, to nominate students of excellent conduct.',
    'On guisi day, local officials were ordered to recommend students of outstanding conduct.',
  ],
  s0331: [
    'On day yisi, two Imperial Clan censors were established.',
    'On yisi day, two censor posts for the Imperial Clan were created.',
  ],
  s0332: [
    'Fifth month, day wuwu: Laxi was made Manchu commander-in-chief.',
    'In the fifth month, on wuwu day, Laxi became Manchu commander-in-chief.',
  ],
  s0333: [
    'Zha Siting died in prison; his corpse was executed.',
    'Zha Siting died in prison and his body was posthumously executed.',
  ],
  s0334: [
    'On day yihai, merit in Wumeng and Zhenxiong was recorded; Ortai was granted a hereditary office.',
    'On yihai day, service in Wumeng and Zhenxiong was rewarded with a hereditary post for Ortai.',
  ],
  s0335: [
    'Sixth month, day gengzi: one deputy commander at Mukden was moved to garrison Jinzhou; a deputy commander at Xiongyue was established.',
    'In the sixth month, a Mukden deputy commander was stationed at Jinzhou and a new deputy commander was set at Xiongyue.',
  ],
  s0336: [
    'Prince Cheng\'s son Hongjing was enfeoffed as Duke of the State.',
    'Prince Cheng\'s son Hongjing was made a state duke.',
  ],
  s0337: [
    'Longkodo was stripped of rank for his crimes; his brother Qingfu succeeded as first-class duke.',
    'Longkodo lost his title for crimes; his brother Qingfu inherited the first-class dukedom.',
  ],
  s0338: [
    'Autumn, seventh month, day yimao: Funing\'an was made Han Army commander-in-chief.',
    'In the seventh month, Funing\'an became Han Army commander-in-chief.',
  ],
  s0339: [
    'On day jiwei, Li Yongshao left office; Huang Guocai was made Minister of Works.',
    'On jiwei day, Li Yongshao was dismissed and Huang Guocai became Minister of Works.',
  ],
  s0340: [
    'Tian Wenjing was promoted to ministerial rank and made governor-general of Henan.',
    'Tian Wenjing was raised to minister and made Henan governor-general.',
  ],
  s0341: [
    'On day jisi, Kuodai was made Minister of Works.',
    'On jisi day, Kuodai became Minister of Works.',
  ],
  s0342: [
    'On day bingzi, Junior State Dukes Hongzhi, Eqi, and Xiliang were promoted to State Dukes.',
    'On bingzi day, Hongzhi, Eqi, and Xiliang were promoted from junior state duke to state duke.',
  ],
  s0343: [
    'The stripped beile Sunu had defaced vermilion rescripts of the Kangxi Emperor; princes, ministers, and the Ministry of Punishments memorialized against him.',
    'Stripped beile Sunu had defaced Kangxi\'s vermilion rescripts; princes, ministers, and the Ministry of Punishments impeached him.',
  ],
  s0344: [
    'A rescript was received: "Sunu, persisting in wickedness without reform, actually allowed his sons Surjin, Kuer Chen, and Wuer Chen to follow the Western religion.',
    'The Emperor ruled: "Sunu refused to reform and let his sons Surjin, Kuer Chen, and Wuer Chen adopt Christianity.',
  ],
  s0345: [
    'When ordered to repent, he defiantly declared: \'I would rather accept legal punishment than change religion.',
    'Ordered to repent, he defied: \'I would rather die by law than abandon the faith.',
  ],
  s0346: [
    'Now vermilion-marked memorials of former years have been found, which he dared to scribble over wantonly, making those who see them bristle with anger.',
    'Vermilion-marked memorials from Kangxi\'s time were found defaced, enraging all who saw them.',
  ],
  s0347: [
    'By the law on great treason he should at once be executed in full.',
    'By the law on great treason he deserved immediate execution.',
  ],
  s0348: [
    'Yet he has as many as forty descendants; to execute them all would be more than one could bear.',
    'Yet he had some forty descendants; executing them all was unbearable.',
  ],
  s0349: [
    'If some were spared and others not, how could one distinguish?',
    'To spare some and kill others offered no clear standard.',
  ],
  s0350: [
    'His death is temporarily spared; he remains confined as before.',
    'His life was spared for now and he remained under confinement as before.',
  ],
  s0351: [
    '" (closing quotation mark in the source.)',
    'The edict ended."',
  ],
  s0352: [
    'Eighth month, day jichou: the Emperor attended the Classics lecture.',
    'In the eighth month, on jichou day, the Emperor held the Classics lecture.',
  ],
  s0353: [
    'On day gengyin, Laidu left office; Changshou was made Minister of Rites.',
    'On gengyin day, Laidu was dismissed and Changshou became Minister of Rites.',
  ],
  s0354: [
    'On day guimao, the late Pacification General of the South Laita was posthumously enfeoffed as first-class duke; his grandson Bo\'ertun succeeded.',
    'On guimao day, the late southern commander Laita was posthumously made first-class duke; his grandson Bo\'ertun inherited.',
  ],
  s0355: [
    'On day yisi, the Khalkha prince consort Celeng and the Russian envoy Sawa fixed the border; Kyakhta was set as the trading place, with officials of the Court of Colonial Affairs assigned to manage it.',
    'On yisi day, Prince Celeng and Russian envoy Sawa fixed the border at Kyakhta as the trading post under Court of Colonial Affairs supervision.',
  ],
  s0356: [
    'Ninth month, day bingyin: regulations were fixed for officials\' rank insignia.',
    'In the ninth month, rules for officials\' rank insignia were established.',
  ],
  s0357: [
    'Sun Zhu was made Grand Secretary and Zhabina Minister of War.',
    'Sun Zhu became Grand Secretary and Zhabina Minister of War.',
  ],
  s0358: [
    'On day jisi, Ortai memorialized that the Flowery Miao had submitted inland, Langji was suppressed and pacified, and the Weiyuan Luo Miao had submitted.',
    'On jisi day, Ortai reported Flowery Miao submission, pacification of Langji, and Weiyuan Luo Miao allegiance.',
  ],
  s0359: [
    'On day wuyin, the Ministry of Punishments reported on Cai Ting\'s case: eighteen great crimes, warranting immediate decapitation; wife and children to enter the Sinicu Bureau.',
    'On wuyin day, the Ministry of Punishments found Cai Ting guilty of eighteen capital crimes warranting immediate execution; his family to enter bondage.',
  ],
  s0360: [
    'A rescript was received: the sentence was changed to imprisonment awaiting execution.',
    'The Emperor ordered the sentence commuted to imprisonment pending execution.',
  ],
  s0361: [
    'Winter, tenth month, day yiyou: censors and Ministry of Personnel bureau officials were no longer required to be examination degree-holders exclusively.',
    'In the tenth month, censors and Ministry of Personnel officials need no longer be degree-holders only.',
  ],
  s0362: [
    'On day dinghai, princes and ministers jointly reported on Longkodo\'s case: fifty great crimes, warranting immediate decapitation; wife and children to enter the Sinicu Bureau and property to be confiscated.',
    'On dinghai day, ministers found Longkodo guilty of fifty capital crimes warranting execution; his family to enter bondage and property seized.',
  ],
  s0363: [
    'A rescript was received: Longkodo is to be confined.',
    'The Emperor ordered Longkodo imprisoned instead.',
  ],
  s0364: [
    'Bo\'ertun was made Mongol commander-in-chief.',
    'Bo\'ertun became Mongol commander-in-chief.',
  ],
  s0365: [
    'Eleventh month, day guichou: Zhalang\'a and Mailu were ordered to prepare frontier defenses.',
    'In the eleventh month, Zhalang\'a and Mailu were ordered to ready the frontier.',
  ],
  s0366: [
    'On day dingsi, Zhejiang Governor Li Wei was promoted to governor-general.',
    'On dingsi day, Zhejiang Governor Li Wei became governor-general.',
  ],
  s0367: [
    'On day dingmao, Oboi\'s first-class dukedom was restored; his grandson Dafu succeeded.',
    'On dingmao day, Oboi\'s first-class dukedom was restored to his grandson Dafu.',
  ],
  s0368: [
    'An edict ordered revision of the Zhizhong Chengxian.',
    'The court ordered revision of the Zhizhong Chengxian.',
  ],
  s0369: [
    'On day wuchen, Ortai memorialized that one hundred eighty-four stockades of the Kemeng and other tribes behind Changzhai in Guizhou had submitted.',
    'On wuchen day, Ortai reported 184 Guizhou stockades behind Changzhai had submitted.',
  ],
  s0370: [
    'On day yihai, Grand Secretary Xiao Yongzao, guardian of the Jing Mausoleum, was stripped of office for failing to detect that the honorary title-holder Guangshan had overstepped in requesting an audience; he continued tomb-guard duty as before.',
    'On yihai day, tomb guardian Grand Secretary Xiao Yongzao lost office for not catching Guangshan\'s improper audience request but kept guarding the mausoleum.',
  ],
  s0371: [
    'On day gengchen, officials were dispatched to survey land acreage in Sichuan.',
    'On gengchen day, officials were sent to measure Sichuan land.',
  ],
  s0372: [
    'Prince Shuncheng Xibao, for shielding Yansin, lost his prince\'s stipend but still had his commandery prince\'s stipend suspended for three years.',
    'Prince Shuncheng Xibao lost his stipend for shielding Yansin; his commandery prince stipend was suspended three years.',
  ],
  s0373: [
    'Twelfth month, new moon on day renwu: Nasutu was made general of Heilongjiang.',
    'On the new moon of the twelfth month, Nasutu became Heilongjiang general.',
  ],
  s0374: [
    'On day yiyou, provincial education commissioners were ordered to select licentiates once every six years.',
    'On yiyou day, provincial schools were ordered to promote licentiates every six years.',
  ],
  s0375: [
    'Princes and ministers reported on Beile Yansin: twenty great crimes, warranting decapitation.',
    'Ministers found Beile Yansin guilty of twenty capital crimes warranting execution.',
  ],
  s0376: [
    'A rescript was received: Yansin\'s death is spared; he is to be confined together with Longkodo.',
    'The Emperor spared Yansin and imprisoned him with Longkodo.',
  ],
  s0377: [
    'On day xinchou, Fan Shiyi memorialized that the people of Qipu in Taicang prefecture had originally wished to dredge the works themselves.',
    'On xinchou day, Fan Shiyi reported Taicang\'s Qipu residents had wanted to dredge the channel themselves.',
  ],
  s0378: [
    'The Emperor did not permit it and said: "The livelihood of the people is itself the revenue of the state.',
    'The Emperor refused, saying, "Popular livelihood is national revenue.',
  ],
  s0379: [
    'When state revenue is insufficient, one must borrow from the people\'s strength.',
    'When revenue falls short, the state must draw on popular labor.',
  ],
  s0380: [
    'Now that state revenue is ample, treasury silver is still to be issued."',
    'Now that revenue is ample, treasury funds will still be provided."',
  ],
  s0381: [
    '" On day wuxu, Left Censor-in-chief Shen Jinshi died.',
    'On wuxu day, Left Censor-in-chief Shen Jinshi died.',
  ],
  s0382: [
    'On day renyin, Tang Zhiyu was made Left Censor-in-chief.',
    'On renyin day, Tang Zhiyu became Left Censor-in-chief.',
  ],
  s0383: [
    'On day gengxu, the joint seasonal sacrifice was performed at the Imperial Ancestral Temple.',
    'On gengxu day, the joint temple sacrifice was held.',
  ],
  s0384: [
    'This year, disaster land tax for thirty-four prefectures and counties in Zhili, Jiangsu, Jiangxi, Zhejiang, Fujian, Huguang, Guangdong, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas in thirty-four districts across several provinces.',
  ],
  s0385: [
    'Korea and Russia sent tribute.',
    'Korea and Russia paid tribute.',
  ],
  s0386: [
    'Sixth year, spring, first month, day jiwei: Gao Qizhuo memorialized on the situation of armed clan fights in Fujian.',
    'In the sixth year, on the first day of spring, Gao Qizhuo reported on Fujian clan feuds.',
  ],
  s0387: [
    'A rescript was received: "In such places subordinates must be encouraged to serve wholeheartedly and with full effort—only then can there be results.',
    'The Emperor replied that subordinates must be urged to work wholeheartedly or nothing would improve.',
  ],
  s0388: [
    'Whenever one or two capable men begin to put things in order, they are at once labeled as meddling.',
    'Whenever capable men tried to reform matters, they were called meddlers.',
  ],
  s0389: [
    'Subordinates, seeing their intent, who would willingly take on blame and press forward?',
    'Seeing this, subordinates would not take on thankless work.',
  ],
  s0390: [
    'One must know the difficulty yet persevere in the task; only after two or three years will there be effect."',
    'Officials must accept the difficulty and persist; results would come only after two or three years."',
  ],
  s0391: [
    '" On day yichou, Beile Qiulin was promoted to Prince Hui of the Commandery and State Duke Hongchun to beile.',
    'On yichou day, Beile Qiulin became Prince Hui of the Commandery and Hongchun became beile.',
  ],
  s0392: [
    'On day jimao, Hang Yilu and Ren Lanzhi were sent as envoys to Annam.',
    'On jimao day, Hang Yilu and Ren Lanzhi were dispatched to Annam.',
  ],
  s0393: [
    'Second month, day bingxu: Prince Guo of the Commandery Yinzhi was promoted to prince.',
    'In the second month, Prince Guo Yinzhi was raised to full prince.',
  ],
  s0394: [
    'On day guisi, the Emperor attended the Classics lecture.',
    'On guisi day, the Emperor held the Classics lecture.',
  ],
  s0395: [
    'On day gengzi, Lai Wen was made general at Jiangning.',
    'On gengzi day, Lai Wen became Jiangning general.',
  ],
  s0396: [
    'On day renyin, Peng Zhaohuai of the returned Yongshun native office was granted a hereditary post and ten thousand taels of silver.',
    'On renyin day, Peng Zhaohuai of Yongshun was granted a hereditary office and ten thousand taels of silver.',
  ],
  s0397: [
    'On day gengxu, Ji Zengyun was made Minister of War while continuing to oversee river works.',
    'On gengxu day, Ji Zengyun became Minister of War and kept charge of river works.',
  ],
  s0398: [
    'Third month, day dingsi: Grand Secretary Tian Congdian left office; Jiang Tingxi was made Grand Secretary.',
    'In the third month, Tian Congdian left office and Jiang Tingxi became Grand Secretary.',
  ],
  s0399: [
    'On day gengwu, because troops entering Tibet were stationed at Xining, Governor Hang Yilu was ordered to supervise them.',
    'On gengwu day, Hang Yilu was ordered to supervise Tibetan expedition troops stationed at Xining.',
  ],
  s0400: [
    'Summer, fourth month, day jiashen: Chen Tai was made Manchu commander-in-chief.',
    'In the fourth month, Chen Tai became Manchu commander-in-chief.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_009_b04.mjs <translation.json>'
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
