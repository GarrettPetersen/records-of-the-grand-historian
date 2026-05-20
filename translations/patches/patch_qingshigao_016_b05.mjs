#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0401: [
    '" On day yiwei, Eledengbao memorialized capture of bandit chief Gao Jianqi.',
    'On yiwei day, Eledengbao reported bandit chief Gao Jianqi captured.',
  ],
  s0402: [
    'On day wuxu, Qishiwu, for allowing bandits to escape, was stripped of office and arrested for trial.',
    'On wuxu day, Qishiwu was dismissed and arrested for letting bandits escape.',
  ],
  s0403: [
    'On day jihai, Sichuan\'s Dazhou was promoted to Suiding Prefecture and Taiping Camp to Taiping Brigade.',
    'On jihai day, Dazhou became Suiding Prefecture and Taiping Camp, Taiping Brigade.',
  ],
  s0404: [
    'Twelfth month, new moon on day guimao: Qingcheng memorialized capture of Gou Wenming\'s band of rebels.',
    'In month 12, guimao new moon, Qingcheng reported Gou Wenming\'s faction captured.',
  ],
  s0405: [
    'On day dingwei, an edict said: "Previously, by special order of my late father the Emperor, officials of this dynasty who died steadfastly for the state but had not received hereditary offices were investigated; more than one hundred forty persons were already found and granted the hereditary Enjiwei office.',
    'On dingwei day, an edict said Hongli had ordered martyrs without hereditary rank found; over 140 received Enjiwei.',
  ],
  s0406: [
    'Now a further search has found more than nine hundred ninety persons; a list has been submitted for review; all are ministers who resisted unto death and served with loyalty.',
    'Another 990 martyrs were listed; all had resisted to the death in loyal service.',
  ],
  s0407: [
    'Their descendants are all immediately granted the hereditary Enjiwei office, with stipends paid.',
    'Their descendants immediately received Enjiwei rank and stipends.',
  ],
  s0408: [
    'Apart from registering for corvée assignments, those who were originally examination candidates may sit for civil or military licentiate examinations and compete on the same footing.',
    'Besides corvée registration, former candidates might take civil or military licentiate exams.',
  ],
  s0409: [
    '" On day guihai, an edict praised Liu Qing, who was specially appointed Sichuan Jiancheng intendant.',
    'On guihai day, Liu Qing was praised and specially made Sichuan Jiancheng intendant.',
  ],
  s0410: [
    'On day renshen, Eledengbao memorialized that in suppressing Tongjiang bandits he had killed the rebel leader Gou Chaoxian.',
    'On renshen day, Eledengbao reported killing Tongjiang rebel chief Gou Chaoxian.',
  ],
  s0411: [
    'On day xinwei, the joint seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'On xinwei day, the Emperor performed the joint ancestral sacrifice.',
  ],
  s0412: [
    'That year, quota land tax was remitted by varying amounts for 231 subprefectures, prefectures, counties, and guards in Zhili, Shanxi, Zhejiang, Anhui, Sichuan, Yunnan, Gansu, and other provinces.',
    'That year, 231 districts in seven provinces and more lost quota tax by degree.',
  ],
  s0413: [
    'Korea and Siam sent tribute.',
    'Korea and Siam sent tribute.',
  ],
  s0414: [
    'Seventh year, renxu year, spring, first month, new moon on day guiyou: the Emperor visited Yuling and performed the third-period mourning rites.',
    'In Jiaqing 7, guiyou new moon, the Emperor visited Yuling for third-period mourning rites.',
  ],
  s0415: [
    'Cotton coats were bestowed on poor people in passed areas.',
    'Poor people along the route received cotton coats.',
  ],
  s0416: [
    'On day jiaxu, sacrifice at the altars of soil and grain was fixed to use the upper wu day.',
    'On jiaxu day, soil-and-grain sacrifice was set on the upper wu day.',
  ],
  s0417: [
    'On day wuyin, the Emperor returned to the capital.',
    'On wuyin day, the Emperor returned to Beijing.',
  ],
  s0418: [
    'On day renwu, Songyun was made Ili general.',
    'On renwu day, Songyun became Ili general.',
  ],
  s0419: [
    'On day jiawu, Eledengbao memorialized capture of chief rebel Xin Cong; the remaining faction was wholly pacified.',
    'On jiawu day, Eledengbao reported chief rebel Xin Cong captured and the rest pacified.',
  ],
  s0420: [
    'Wu Xiongguang memorialized capture of bandit chief Zhang Yunshou\'s son Degui and annihilation of the Blue Faction rebel band.',
    'Wu Xiongguang reported Zhang Yunshou\'s son Degui captured and the Blue Faction band destroyed.',
  ],
  s0421: [
    'Ming\'an was stripped of office for corruption and sent into exile at Ili.',
    'Ming\'an was dismissed for graft and banished to Ili.',
  ],
  s0422: [
    'Lukang was made metropolitan gendarmerie commander and relieved of Minister of Punishments.',
    'Lukang took the metropolitan gendarmerie and left punishments.',
  ],
  s0423: [
    'Eledengbao, for lax defense allowing Gou Wenming to slip across the Han River, was demoted to baron.',
    'Eledengbao was demoted to baron after Gou Wenming crossed the Han.',
  ],
  s0424: [
    'On day gengzi, the Emperor attended the Classics Lecture.',
    'On gengzi day, the Emperor attended the Classics Lecture.',
  ],
  s0425: [
    'Second month, day guimao: because Gou Wenming had slipped into the old forests of the southern mountains, leading generals on the frontier were ordered to block and suppress him and local officials were to search and seize strictly, that he not spread further.',
    'In month 2, guimao, Gou Wenming in southern mountain forests drew orders to block him and tighten local searches.',
  ],
  s0426: [
    'On day dingwei, the sacrifice to Confucius was performed.',
    'On dingwei day, the Emperor sacrificed to Confucius.',
  ],
  s0427: [
    'On day renxu, posthumous favor was extended to Deputy General Han Zichang, who fell in battle, and his younger brother Deputy General Han Jiaye; local officials were ordered to build a shrine to both martyrs and three hundred taels of silver were granted their mother.',
    'On renxu day, fallen Deputy General Han Zichang and his brother Han Jiaye won a dual martyr shrine and three hundred taels for their mother.',
  ],
  s0428: [
    'On day bingyin, Eledengbao memorialized that Liu Qing had captured bandit chiefs Li Bin and Xin Wen; he was given censorial intendant rank with a peacock tail.',
    'On bingyin day, Liu Qing captured chiefs Li Bin and Xin Wen and gained censor-intendant rank with a peacock feather.',
  ],
  s0429: [
    'Third month, day guiyou: Lebao memorialized capture of bandit chiefs Zhang Tianlun, Wei Xuesheng, and Chen Guozhu.',
    'In month 3, guiyou, Lebao reported chiefs Zhang Tianlun, Wei Xuesheng, and Chen Guozhu captured.',
  ],
  s0430: [
    'On day dingchou, Delengtai memorialized capture of rebel chiefs Gong Qiyao, Li Shihan, and Li Guozhen; the remaining rebels were wholly pacified.',
    'On dingchou day, Delengtai reported Gong Qiyao, Li Shihan, and Li Guozhen captured and the rest pacified.',
  ],
  s0431: [
    'On day renwu, the Emperor went to worship at the Western Tombs.',
    'On renwu day, the Emperor went to the Western Tombs.',
  ],
  s0432: [
    'On day gengyin, he returned to the capital.',
    'On gengyin day, the Emperor returned to Beijing.',
  ],
  s0433: [
    'On day renchen, Cheng De died; Lukang was made Minister of Revenue.',
    'On renchen day, Cheng De died and Lukang took revenue.',
  ],
  s0434: [
    'Summer, fourth month, day wushen: Yan Jian was made Zhili governor-general.',
    'In month 4, wushen, Yan Jian became Zhili governor-general.',
  ],
  s0435: [
    'On day yichou, Wu Tingchen and 248 others were granted jinshi and other examination degrees by rank.',
    'On yichou day, Wu Tingchen and 248 others received jinshi and related degrees.',
  ],
  s0436: [
    'On day dingmao, Qingcheng memorialized capture of bandit chiefs Wei Hongsheng, Zhang Xi, and Bai Yong.',
    'On dingmao day, Qingcheng reported chiefs Wei Hongsheng, Zhang Xi, and Bai Yong captured.',
  ],
  s0437: [
    'Fifth month, day jimao: Prince Ruqin Baoen died.',
    'In month 5, jimao, Prince Ruqin Baoen died.',
  ],
  s0438: [
    'Langgan memorialized capture of the Luo bandit chief rebel Lazhebu.',
    'Langgan reported the Luo bandit chief rebel Lazhebu captured.',
  ],
  s0439: [
    'On day renwu, Lebao memorialized capture of rebel chiefs Tuo Xiangyao, Xu Tianpei, and Zhang Sicong.',
    'On renwu day, Lebao reported chiefs Tuo Xiangyao, Xu Tianpei, and Zhang Sicong captured.',
  ],
  s0440: [
    'On day jiawu, Qingcheng memorialized that in searching out remaining bandits he had captured Kang Ermo and Zhang Changyuan; he was promoted Grand Guardian of the Heir Apparent.',
    'On jiawu day, Qingcheng reported Kang Ermo and Zhang Changyuan taken and was made Grand Guardian.',
  ],
  s0441: [
    'Sixth month, day jiyou: Delengtai memorialized that the teaching-bandit Fan Renjie drowned and his wife and children were captured; the remaining bandits were annihilated; he was enfeoffed third-class marquis.',
    'In month 6, jiyou, Delengtai reported Fan Renjie drowned, his family captured, the rest destroyed, and became a third-class marquis.',
  ],
  s0442: [
    'On day jiayin, Liu Quanzhi and De Ying were made Grand Councilors.',
    'On jiayin day, Liu Quanzhi and De Ying joined the Grand Council.',
  ],
  s0443: [
    'On day yimao, Dachun died; Chang Lin was made Minister of Rites.',
    'On yimao day, Dachun died and Chang Lin took rites.',
  ],
  s0444: [
    'Baoning was ordered to administer the Board of War.',
    'Baoning was ordered to run the war ministry.',
  ],
  s0445: [
    'Lukang and Gong\'ala were made Chinese Banner commanders-in-chief.',
    'Lukang and Gong\'ala took the Chinese Banner commands.',
  ],
  s0446: [
    'Autumn, seventh month, day xinwei: Lebao memorialized annihilation of Yellow, White, Green, and Blue Faction teaching bandits; he was enfeoffed first-class baron.',
    'In month 7, xinwei, Lebao reported Yellow, White, Green, and Blue factions destroyed and became a first-class baron.',
  ],
  s0447: [
    'On day gengchen, Shaanxi tribute student He Tai memorialized urging rejection of luxury and honoring thrift to restore public morals.',
    'On gengchen day, Shaanxi student He Tai urged thrift to restore morals.',
  ],
  s0448: [
    'Receiving the rescript, it was deemed adoptable; two bolts of fine satin were rewarded.',
    'The memorial was accepted and he received two bolts of fine satin.',
  ],
  s0449: [
    'On day jiashen, Grand Secretary Wang Jie retired; he was made Grand Tutor of the Heir Apparent with salary while at home.',
    'On jiashen day, Wang Jie retired as Grand Tutor with home salary.',
  ],
  s0450: [
    'On day wuzi, the Emperor went on the autumn hunt at Mulan.',
    'On wuzi day, the Emperor began the autumn hunt at Mulan.',
  ],
  s0451: [
    'On day guisi, an edict said: "In the Boluo prison breakout in Guangdong, only after I made vermilion notes of inquiry did the governor-general and provincial governor at last submit truthful reports according to the facts.',
    'On guisi day, an edict on the Boluo jailbreak said only the Emperor\'s vermilion inquiry brought truthful reports.',
  ],
  s0452: [
    'Then how much more in the empire has gone undetected—deeply moving to sigh and still more deeply making one fear.',
    'How much else nationwide had never come to light—deeply sobering and fear-inspiring.',
  ],
  s0453: [
    'Besides separate punishments, let officials both great and small live clean and upright lives to answer the court\'s intent in clarifying official discipline."',
    'Beyond punishments, all officials were urged to live uprightly and fulfill disciplinary intent.',
  ],
  s0454: [
    '" Xing Kui was made Xi\'an general and Mingliang Urumchi military governor.',
    'Xing Kui became Xi\'an general and Mingliang, Urumchi governor.',
  ],
  s0455: [
    'On day jiawu, Eledengbao memorialized capture of chief rebel Gou Wenming.',
    'On jiawu day, Eledengbao reported chief rebel Gou Wenming captured.',
  ],
  s0456: [
    'An instruction said: "Just as I arrived at Mulan, good news came.',
    'An order said good news arrived as the Emperor reached Mulan.',
  ],
  s0457: [
    'Of those who rose in the teaching-bandit affair, only this bandit remained.',
    'Only this rebel remained of the White Lotus rising.',
  ],
  s0458: [
    'Now that he has surrendered his head, pacification will not be difficult.',
    'With his capture, full pacification should be easy.',
  ],
  s0459: [
    'Eledengbao was advanced to first-class earl; Yang Yuchun and those below were each rewarded by merit according to degree.',
    'Eledengbao became a first-class earl; Yang Yuchun and others were rewarded by rank.',
  ],
  s0460: [
    '" Zhang Ruoting died; Xiong Mei was made Minister of Punishments.',
    'Zhang Ruoting died and Xiong Mei took punishments.',
  ],
  s0461: [
    'Wang Chengpei was transferred to Left Censor-in-Chief and Dai Yuheng made Minister of War.',
    'Wang Chengpei became left censor-in-chief and Dai Yuheng, minister of war.',
  ],
  s0462: [
    'Eighth month, new moon on day jihai: there was a solar eclipse.',
    'In month 8, jihai new moon, there was a solar eclipse.',
  ],
  s0463: [
    'An edict said: "When the new moon darkens and the full moon darkens, Heaven shows warning; vigilance is ever deep.',
    'An edict at the eclipse said Heaven warned and vigilance must deepen.',
  ],
  s0464: [
    'Does the Son of Heaven have personal failings?"',
    'Had the Emperor himself failed?',
  ],
  s0465: [
    'In suppressing heterodox bandits, remnants are not yet exhausted—should they be stilled by military might, or led by moral transformation?"',
    'Were rebel remnants to be crushed by arms or won by virtue?',
  ],
  s0466: [
    'Are there matters of government inconvenient to the people that were expedient for a time but over years breed flowing abuses?"',
    'Did temporary policies now burden the people with lasting abuses?',
  ],
  s0467: [
    'Let each speak frankly without concealment.',
    'All were told to speak frankly without concealment.',
  ],
  s0468: [
    'As for repairing punishments at a lunar eclipse, one should only clarify laws and charge punishments, striving for thorough caution—this is what inner and outer officials should jointly urge upon one another."',
    'Eclipse rites meant clarifying law and careful punishment—inner and outer officials should urge one another.',
  ],
  s0469: [
    '" Zhu Gui was made Associate Grand Secretary.',
    'Zhu Gui became Associate Grand Secretary.',
  ],
  s0470: [
    'On day guimao, Ji Chengzhi was made Eastern River waterways governor-general and Liu Qing Sichuan censorial intendant.',
    'On guimao day, Ji Chengzhi took the Eastern River and Liu Qing, Sichuan censor-intendant.',
  ],
  s0471: [
    'On day yimao, the Emperor went out on the autumn hunt.',
    'On yimao day, the Emperor went on the autumn hunt.',
  ],
  s0472: [
    'Nongnai and Nguyen Phuc Anh of Vietnam led their followers in submission and surrendered former feudal seals and patents.',
    'Vietnam\'s Nongnai and Nguyen Phuc Anh submitted with followers and returned old seals.',
  ],
  s0473: [
    'An edict permitted them to present tribute.',
    'They were permitted to send tribute.',
  ],
  s0474: [
    'On day xinyou, Delengtai memorialized capture of bandit chief Pu Tianbao.',
    'On xinyou day, Delengtai reported chief Pu Tianbao captured.',
  ],
  s0475: [
    'Ninth month, day gengchen: the Emperor returned from the tour.',
    'In month 9, gengchen, the Emperor returned from tour.',
  ],
  s0476: [
    'On day wuzi, the Emperor went to worship at the tombs.',
    'On wuzi day, the Emperor went to the tombs.',
  ],
  s0477: [
    'On day xinmao, he returned to the capital.',
    'On xinmao day, the Emperor returned to Beijing.',
  ],
  s0478: [
    'On day bingchen, Wu Xiongguang memorialized killing Yellow Faction rebel chief Tang Mingwan.',
    'On bingchen day, Wu Xiongguang reported Yellow Faction chief Tang Mingwan killed.',
  ],
  s0479: [
    'Winter, tenth month, day jiyou: Hangzhou General Hong Feng died; Zhang Chengxun was made Hangzhou general.',
    'In month 10, jiyou, Hangzhou General Hong Feng died and Zhang Chengxun replaced him.',
  ],
  s0480: [
    'On day renzi, Lebao memorialized capture of White Faction bandit chief Zhang Jian and Blue Faction bandit chief Tang Sijiao.',
    'On renzi day, Lebao reported White Faction chief Zhang Jian and Blue Faction chief Tang Sijiao captured.',
  ],
  s0481: [
    'On day dingsi, Delengtai memorialized killing bandit chief Dai Si and capturing bandit officer Zhao Jian.',
    'On dingsi day, Delengtai reported chief Dai Si killed and officer Zhao Jian captured.',
  ],
  s0482: [
    'Eleventh month, new moon on day wuchen: Delengtai memorialized capture of bandit chief Chen Chuanxue.',
    'In month 11, wuchen new moon, Delengtai reported chief Chen Chuanxue captured.',
  ],
  s0483: [
    'On day gengwu, an edict said that Jiqing, in handling the Boluo society bandits, had reported untruthfully; he was dismissed as Associate Grand Secretary and Nayancheng was ordered to investigate.',
    'On gengwu day, Jiqing was dismissed for false Boluo reports and Nayancheng was told to investigate.',
  ],
  s0484: [
    'Soon he was relieved of the governorship; Hutuli was ordered to act.',
    'Soon Jiqing lost the governorship and Hutuli acted.',
  ],
  s0485: [
    'On day bingxu, Eledengbao memorialized capture of bandit chief Jing Ying; he was advanced to third-class marquis.',
    'On bingxu day, Eledengbao reported Jing Ying captured and became a third-class marquis.',
  ],
  s0486: [
    'Twelfth month, new moon on day wuxu: bandits rioted in Suzhou, Anhui; Fei Chun and others suppressed and pacified them.',
    'In month 12, wuxu new moon, Anhui Suzhou rebels were put down by Fei Chun and others.',
  ],
  s0487: [
    'On day guichou, an edict ordered Eledengbao, Delengtai, Lebao, Huling, and Wu Xiongguang jointly to report the pacification of teaching bandits in Sichuan, Shaanxi, and Hubei.',
    'On guichou day, five commanders were ordered to report Sichuan-Shaanxi-Hubei rebels pacified.',
  ],
  s0488: [
    'Eledengbao and Delengtai were enfeoffed first-class earls, Lebao first-class baron, Mingliang first-class baron, and Saichong\'a, Yang Yuchun, and others enfeoffed and rewarded in descending order.',
    'Eledengbao and Delengtai became first-class earls; Lebao, Mingliang, Saichong\'a, and Yang Yuchun were enfeoffed by rank.',
  ],
  s0489: [
    'Favor was also extended to Prince Cheng Yongying and others of the imperial clan and Grand Councilors Qing Gui and Dong Gao and others.',
    'Princes including Yongying and councilors Qing Gui and Dong Gao shared the promotion.',
  ],
  s0490: [
    'On day yichou, the joint seasonal sacrifice was offered at the Imperial Ancestral Temple.',
    'On yichou day, the Emperor performed the joint ancestral sacrifice.',
  ],
  s0491: [
    'That year, disaster land tax was remitted for fifty-six subprefectures, prefectures, and counties in Zhili, Shaanxi, Jiangxi, Sichuan, and other provinces.',
    'That year, fifty-six disaster districts in four provinces and more lost land tax.',
  ],
  s0492: [
    'Besides this, quota land tax was remitted for collapsed fields in ten counties and guards in Jiangsu, Fujian, and Shandong.',
    'Ten Jiangsu, Fujian, and Shandong districts with collapsed fields lost quota tax.',
  ],
  s0493: [
    'Korea sent tribute.',
    'Korea sent tribute.',
  ],
  s0494: [
    'Eighth year, guihai year, spring, first month, day gengwu: Wo-shi-bu was made Liang-Guang governor-general.',
    'In Jiaqing 8, gengwu, Wo-shi-bu became Liang-Guang governor-general.',
  ],
  s0495: [
    'On day dingchou, the people of Ili were ordered to open farmland widely.',
    'On dingchou day, Ili was ordered to open civilian farmland widely.',
  ],
  s0496: [
    'Zhang Chengji, because in suppressing Yining Prefecture native bandits his memorial was untruthful, was sentenced to strangulation.',
    'Zhang Chengji was sentenced to strangulation for false reports on Yining bandits.',
  ],
  s0497: [
    'On day yiyou, cotton coats were bestowed on poor people.',
    'On yiyou day, poor people received cotton coats.',
  ],
  s0498: [
    'On day jiawu, the Emperor attended the Classics Lecture.',
    'On jiawu day, the Emperor attended the Classics Lecture.',
  ],
  s0499: [
    'Second month, day jiwei, the Emperor went to worship at the Eastern Tombs.',
    'In month 2, jiwei, the Emperor went to the Eastern Tombs.',
  ],
  s0500: [
    'Intercalary second month, day wuyin: the Emperor returned and resided at the Old Summer Palace.',
    'In intercalary month 2, wuyin, the Emperor returned to the Old Summer Palace.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_016_b05.mjs <translation.json>'
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
