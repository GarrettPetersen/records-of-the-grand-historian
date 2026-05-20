#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On day xinmao, Guangxi troops recovered Conghua in Vietnam and took Zhenshan.',
    'On xinmao day, Guangxi forces retook Vietnamese Conghua and captured Zhenshan.',
  ],
  s0602: [
    'On day guisi, Gansu troops successively stormed rebel camps at Ganping, Dabeiping, and elsewhere and advanced on Taizisi.',
    'On guisi day, Gansu forces broke camps at Ganping and Dabeiping and pressed Taizisi.',
  ],
  s0603: [
    'On day gengzi, Guizhou troops took Qingping, Huangping, and Chong\'an.',
    'On gengzi day, Guizhou forces captured Qingping, Huangping, and Chong\'an.',
  ],
  s0604: [
    'On day xinchou, Hunan relief troops in Guizhou took the Huangpiao and Baibao Miao stockades.',
    'On xinchou day, Hunan auxiliaries in Guizhou took Huangpiao and Baibao Miao forts.',
  ],
  s0605: [
    'On day xinhai, Vice Minister Chonghou and Vice Director of the Court of Imperial Sacrifices Xia Jiagao were ordered to serve at the Zongli Yamen.',
    'On xinhai day, Chonghou and Xia Jiagao were assigned to the Zongli Yamen.',
  ],
  s0606: [
    'Second month, day gengshen: Jiangsu was allowed to trial grain transport by river; tribute and white grain still went by sea.',
    'In the second month, on gengshen day, Jiangsu could trial river grain transport while sea transport continued for tribute grain.',
  ],
  s0607: [
    'On day bingyin, Zeng Guofan died; he was posthumously made Grand Tutor.',
    'On bingyin day, Zeng Guofan died and was posthumously made Grand Tutor.',
  ],
  s0608: [
    'On day wuchen, Liu Mingchuan was stripped of office but, for past merit, still kept the rank of first-class baron.',
    'On wuchen day, Liu Mingchuan lost his post yet retained first-class baron for prior service.',
  ],
  s0609: [
    'On day gengwu, Peng Yulin was recalled to inspect the Yangtze flotilla.',
    'On gengwu day, Peng Yulin resumed inspection of the Yangtze flotilla.',
  ],
  s0610: [
    'On day jiashen, the breach at Houjialin was closed.',
    'On jiashen day, the Houjialin breach was sealed.',
  ],
  s0611: [
    'Vietnamese rebel leaders Su Guohan and others were executed.',
    'Su Guohan and other Vietnamese rebel chiefs were put to death.',
  ],
  s0612: [
    'That month, disaster relief was given to all subordinate districts of Sichuan.',
    'That month, Sichuan prefectures received disaster relief.',
  ],
  s0613: [
    'Third month, new moon on day yiyou: Guizhou troops recovered Zhenfeng.',
    'At the third-month new moon, yiyou, Guizhou forces retook Zhenfeng.',
  ],
  s0614: [
    'On day bingxu, Gansu troops suffered defeat suppressing Muslim rebels at Taizisi; Generals Fu Xianrong and Xu Wenxiu died.',
    'On bingxu day, Gansu forces were beaten at Taizisi; Fu Xianrong and Xu Wenxiu fell.',
  ],
  s0615: [
    'General Yang Shijun was stripped of his yellow jacket and demoted to vice commander.',
    'Yang Shijun lost his yellow jacket and was reduced to vice commander.',
  ],
  s0616: [
    'On day jiawu, Da\'erji and others were pardoned of crime but still stripped of rank to serve on merit.',
    'On jiawu day, Da\'erji and others were forgiven yet demoted to serve in the ranks.',
  ],
  s0617: [
    'On day dingyou, because Feng bandits harassed the Korean border, strict arrest was ordered.',
    'On dingyou day, Feng bandits on the Korean frontier drew orders for rigorous pursuit.',
  ],
  s0618: [
    'On day xinchou, Ruichang died.',
    'On xinchou day, Ruichang died.',
  ],
  s0619: [
    'That spring, overdue taxes were remitted in Huangpi, Hubei, Anzhou, Zhili, Hezhou, Gansu, and other districts disturbed by war.',
    'That spring, war-torn districts including Huangpi, Anzhou, and Hezhou had overdue taxes waived.',
  ],
  s0620: [
    'Summer, fourth month, day bingchen: Muslim rebels fled into Dingbian and Jingbian; Shaanxi troops drove them back.',
    'In the fourth month, on bingchen day, Muslim rebels entered Dingbian and Jingbian and Shaanxi troops repulsed them.',
  ],
  s0621: [
    'On day jiwei, Xining Muslim chief Ma Zhan\'ao, Shaanxi Muslim Cui San, and Milan\'gou chief Zhichenglin successively begged to surrender.',
    'On jiwei day, Ma Zhan\'ao, Cui San, and Zhichenglin each offered surrender in turn.',
  ],
  s0622: [
    'On day bingyin, Huai Pass special procurement of living needs was halted.',
    'On bingyin day, Huai Pass living-procurement commissions were stopped.',
  ],
  s0623: [
    'The Imperial Household Department was instructed to practice strict economy.',
    'The Internal Affairs Office was told to economize rigorously.',
  ],
  s0624: [
    'On day jimao, Vice Transmission Commissioner Wang Weizhen memorialized on anticipating the sovereign\'s will and filial rectitude.',
    'On jimao day, Wang Weizhen memorialized on anticipating intent and filial duty.',
  ],
  s0625: [
    'Severe censure was imposed; soon he was stripped of office.',
    'He was severely rebuked and soon dismissed.',
  ],
  s0626: [
    'That month, overdue taxes were remitted in Xingyi and other disturbed districts of Guizhou.',
    'That month, Guizhou districts including Xingyi had overdue taxes waived.',
  ],
  s0627: [
    'Fifth month, new moon on day jiashen: there was a solar eclipse.',
    'At the fifth-month new moon, jiashen, the sun was eclipsed.',
  ],
  s0628: [
    'Banner rents at Tengwei in Rehe were remitted for three years.',
    'Rehe Tengwei banner rents were waived for three years.',
  ],
  s0629: [
    'On day yiyou, since early in the third month Empress Dowager Cixi had been ill and for more than a month did not hold audience.',
    'On yiyou day, Cixi had been ill since early third month and had not held court for over a month.',
  ],
  s0630: [
    'At this time Censor Li Hongmo asked that audiences be held frequently.',
    'Censor Li Hongmo then asked for more frequent audiences.',
  ],
  s0631: [
    'An edict rebuked his presumption and sternly warned him.',
    'He was rebuked for presumption and sternly admonished.',
  ],
  s0632: [
    'On day guisi, Xu Zhanbiao\'s army had repeated victories suppressing Gansu Muslims.',
    'On guisi day, Xu Zhanbiao won repeated victories over Gansu Muslims.',
  ],
  s0633: [
    'Zuo Zongtang impeached Cheng Lu for wasting funds and delay; Mutušan was ordered to investigate.',
    'Zuo Zongtang charged Cheng Lu with waste and delay; Mutušan was sent to investigate.',
  ],
  s0634: [
    'On day yiwei, Guizhou Miao rebels were pacified; Xi Baotian was made Cavalry Commandant.',
    'On yiwei day, Guizhou Miao rebels were pacified and Xi Baotian became Cavalry Commandant.',
  ],
  s0635: [
    'On day bingshen, Shaanxi Muslims Song Quande and others surrendered.',
    'On bingshen day, Song Quande and other Shaanxi Muslims surrendered.',
  ],
  s0636: [
    'Posthumous honors were raised for the disgraced former Minister Chen Fuen, who had died at Yili, and for his family.',
    'Chen Fuen, disgraced minister martyred at Yili, and his kin received raised posthumous honors.',
  ],
  s0637: [
    'On day gengzi, Li Hongzhang was made Grand Secretary while remaining Zhili governor.',
    'On gengzi day, Li Hongzhang became Grand Secretary and kept the Zhili governorship.',
  ],
  s0638: [
    'On day yisi, Yunnan troops took Yongping and Yunnan.',
    'On yisi day, Yunnan forces captured Yongping and Yunnan.',
  ],
  s0639: [
    'Sixth month, day jiawu: Zhu Fengbiao retired.',
    'In the sixth month, on jiawu day, Zhu Fengbiao retired.',
  ],
  s0640: [
    'Wen Xiang was made Grand Secretary; Quanqing was made assistant Grand Secretary.',
    'Wen Xiang became Grand Secretary and Quanqing assistant Grand Secretary.',
  ],
  s0641: [
    'On day dingmao, autumn review and court capital sentences were suspended for this year.',
    'On dingmao day, this year\'s autumn and court executions were halted.',
  ],
  s0642: [
    'Shan Maoqian was made assistant Grand Secretary.',
    'Shan Maoqian became assistant Grand Secretary.',
  ],
  s0643: [
    'Seventh month, autumn, new moon on day guiwei: Yunnan allied troops took Xingyi.',
    'At the seventh-month new moon, guiwei, Yunnan allied forces captured Xingyi.',
  ],
  s0644: [
    'On day jichou, Nepal\'s routine tribute was waived.',
    'On jichou day, Nepal\'s regular tribute was excused.',
  ],
  s0645: [
    'Disaster relief was given to troops and civilians among the Dorbod Mongols and the Thirty-nine Banners.',
    'Dorbod Mongols and the Thirty-nine Banners received disaster relief.',
  ],
  s0646: [
    'On day wuxu, Muslim rebels raided western Ningxia and Alashan; government troops drove them back.',
    'On wuxu day, Muslim rebels hit western Ningxia and Alashan and were repulsed.',
  ],
  s0647: [
    'On day jihai, Zhili presented auspicious wheat; Censor Bian Baoquan memorialized on it.',
    'On jihai day, Zhili offered auspicious wheat and Censor Bian Baoquan criticized it.',
  ],
  s0648: [
    'Li Hongzhang was told to care for the people\'s hardships, remedy partial disasters, and not boast auspicious signs.',
    'Li Hongzhang was warned to relieve distress, fix local disasters, and not trumpet omens.',
  ],
  s0649: [
    'On day gengzi, the lower Yongding reach flooded on the north bank.',
    'On gengzi day, the lower Yongding north bank burst.',
  ],
  s0650: [
    'That month, overdue taxes were remitted at Huangzhou, Hunan, after disturbance.',
    'That month, Huangzhou in Hunan had disturbed districts\' taxes waived.',
  ],
  s0651: [
    'Eighth month, day gengwu: more than one hundred thousand shi of Jiangbei tribute rice were diverted to relieve flood victims in the capital region.',
    'In the eighth month, on gengwu day, over 100,000 shi of Jiangbei tribute rice fed flood victims around the capital.',
  ],
  s0652: [
    'On day guiyou, Jin Shun was dismissed for delay; Chang Shun acted as Uliastai General.',
    'On guiyou day, Jin Shun was removed for delay and Chang Shun acted at Uliastai.',
  ],
  s0653: [
    'On day xinsi, Shan Maoqian was made Grand Secretary.',
    'On xinsi day, Shan Maoqian became Grand Secretary.',
  ],
  s0654: [
    'Ninth month, day guiwei: Yunnan troops took Zhao Prefecture, Menghua, and the upper and lower passes of Dali; Yang Yuke and Li Weishu were given yellow jackets.',
    'In the ninth month, on guiwei day, Yunnan forces took Zhao, Menghua, and Dali passes; Yang Yuke and Li Weishu won yellow jackets.',
  ],
  s0655: [
    'Zuo Zongtang reported auspicious wheat and grain from the land; an edict declined them.',
    'Zuo Zongtang reported auspicious grain; the court refused the tribute.',
  ],
  s0656: [
    'On day yiwei, Empress Arute was invested; honors extended from princes and ministers downward; an edict was issued to the realm and general grace granted with distinctions.',
    'On yiwei day, Empress Arute was enthroned, honors cascaded through the court, and a grace edict went empire-wide.',
  ],
  s0657: [
    'The Yongding River works were closed.',
    'Yongding River repairs were completed.',
  ],
  s0658: [
    'On day bingwu, Peng Yulin\'s request to return home on grounds of illness was granted; he was still ordered to inspect the Yangtze flotilla each year.',
    'On bingwu day, Peng Yulin went home ill but still had to inspect the Yangtze flotilla yearly.',
  ],
  s0659: [
    'On day gengxu, Rong Quan\'s plan was approved: Qing Fu was to pacify tribal groups and civilians, Yinglian\'s cavalry was to garrison Kurkara-usu, and local militia were to be recruited as appropriate.',
    'On gengxu day, Rong Quan won approval for Qing Fu to pacify tribesmen, Yinglian\'s horse to camp at Kurkara-usu, and selective militia levies.',
  ],
  s0660: [
    'Tenth month, day dingsi: ringleaders of the Gansu mutinous troops, including Feng Gaoshan, were executed.',
    'In the tenth month, on dingsi day, Gansu mutiny leaders such as Feng Gaoshan were executed.',
  ],
  s0661: [
    'On day jiwei, honorific titles were added for both Empress Dowagers.',
    'On jiwei day, both Empress Dowagers received added honorific titles.',
  ],
  s0662: [
    'On day wuchen, bandits in Guangxi\'s Long\'an and Cenxi and Miao rebels in Xilong were pacified.',
    'On wuchen day, Long\'an and Cenxi bandits and Xilong Miao rebels were pacified.',
  ],
  s0663: [
    'On day renyin, commanding generals were told to restrain their staff; those who harassed beyond limits would be punished.',
    'On renyin day, field commanders were ordered to curb staff excesses on pain of punishment.',
  ],
  s0664: [
    'Prince Gong\'s request was granted to restore the Grand Council\'s former regulations.',
    'Prince Gong\'s plea restored the old Grand Council rules.',
  ],
  s0665: [
    'On day bingzi, He Jing was relieved on mourning; Zhang Shusheng acted as Liangjiang governor.',
    'On bingzi day, He Jing left on mourning and Zhang Shusheng acted at Liangjiang.',
  ],
  s0666: [
    'Eleventh month, day yiyou: Korean pirate ships crossed the border to raid; Du Xing\'a and others\' naval forces suppressed them.',
    'In the eleventh month, on yiyou day, Korean pirate ships crossed the border and Du Xing\'a\'s fleet suppressed them.',
  ],
  s0667: [
    'Muslim rebels harassed the eastern hills of Hami; government troops defeated them.',
    'Muslim rebels troubled Hami\'s eastern hills and were beaten by government troops.',
  ],
  s0668: [
    'Bribery and impersonation were forbidden in palace, provincial, and metropolitan examinations.',
    'Palace, provincial, and metropolitan exams were barred from patronage and substitution.',
  ],
  s0669: [
    'On day jimao, Qiongzhou bandits were pacified; bandit chiefs He Yawan and others were executed.',
    'On jimao day, Qiongzhou bandits were pacified and He Yawan and other chiefs were killed.',
  ],
  s0670: [
    'On day xinmao, Yunnan troops suppressed bandits holding Guanyi and other posts; eastern and southern Yunnan were cleared.',
    'On xinmao day, Yunnan forces cleared Guanyi bandits and pacified the east and south.',
  ],
  s0671: [
    'On day yiwei, Gansu Muslims fled into the banners of the Zasak Khans; government troops drove them off.',
    'On yiwei day, Gansu Muslims entered Zasak Khan banners and were driven away.',
  ],
  s0672: [
    'Guizhou allied troops took Xincheng.',
    'Guizhou allied forces captured Xincheng.',
  ],
  s0673: [
    'Lower Yangtze Miao rebels rose; Zhang Wende\'s army eliminated them.',
    'Lower Yangtze Miao rebels were crushed by Zhang Wende.',
  ],
  s0674: [
    'All Guizhou was settled.',
    'Guizhou was fully pacified.',
  ],
  s0675: [
    'On day bingshen, Nian rebels raided Taihu; naval forces pacified them.',
    'On bingshen day, Nian bandits hit Taihu and the fleet suppressed them.',
  ],
  s0676: [
    'Military and civilians who had joined the Gelaohui were allowed to confess and be pardoned.',
    'Soldiers and civilians in the Gelaohui could surrender without punishment.',
  ],
  s0677: [
    'On day dingyou, opium cultivation was again forbidden in all provinces.',
    'On dingyou day, all provinces were again forbidden to grow opium poppies.',
  ],
  s0678: [
    'On day xinchou, Liu Jintang and others won a great victory suppressing Muslim rebels.',
    'On xinchou day, Liu Jintang scored a major victory over Muslim rebels.',
  ],
  s0679: [
    'On day dingwei, Shaanxi troops annihilated fleeing rebels in northern Shaanxi around Erdaohe and elsewhere.',
    'On dingwei day, Shaanxi forces wiped out northern rebels around Erdaohe.',
  ],
  s0680: [
    'Li Hongzhang memorialized establishing the China Merchants Steam Navigation Company to trial steamers for dividing transport of Jiangsu and Zhejiang tribute grain.',
    'Li Hongzhang proposed the China Merchants Company to trial steamers for Jiangsu-Zhejiang tribute grain.',
  ],
  s0681: [
    'Twelfth month, day jiwei: Tibetan assistant Detai was stripped of office for misconduct and returned to his banner.',
    'In the twelfth month, on jiwei day, Detai, assistant in Tibet, was dismissed and sent back to his banner.',
  ],
  s0682: [
    'On day bingchen, the Boards of Civil Appointments, War, and Lifan Yuan were told that after personal rule all memorials on audience and military affairs must be in Chinese.',
    'On bingchen day, the Civil, War, and Lifan boards were ordered to use Chinese for audience and military papers after personal rule.',
  ],
  s0683: [
    'On day dingmao, Tian Xingwu was released to return.',
    'On dingmao day, Tian Xingwu was freed to go home.',
  ],
  s0684: [
    'On day bingzi, Zuo Zongtang begged leave on grounds of illness; a warm edict refused; on day jimao, the joint autumn ancestral sacrifice was held.',
    'On bingzi day, Zuo Zongtang\'s sick leave was refused; on jimao day came the joint autumn temple rites.',
  ],
  s0685: [
    'That year, Korea paid tribute.',
    'Korea sent tribute that year.',
  ],
  s0686: [
    'Twelfth year, guiyou, spring, first month, new moon on day xinsi.',
    'Year twelve, guiyou, spring, first month, xinsi new moon.',
  ],
  s0687: [
    'On day guimao, government troops defeated Muslim rebels at Namatigan Zhao.',
    'On guimao day, government forces beat Muslim rebels at Namatigan Zhao.',
  ],
  s0688: [
    'On day bingxu, Li Zongxi was made Liangjiang governor and Superintendent of Trade.',
    'On bingxu day, Li Zongxi became Liangjiang governor and trade superintendent.',
  ],
  s0689: [
    'On day xinchou, Cheng Lu was stripped and arrested for harsh levies and false charges of rebellion; Jin Shun was urged to take over his army.',
    'On xinchou day, Cheng Lu was dismissed and arrested for extortion and false treason; Jin Shun was told to assume his troops.',
  ],
  s0690: [
    'On day jiachen, Yunnan troops took Dali; Muslim chiefs Du Wenxiu, Yang Rong, and Cai Tingdong were executed.',
    'On jiachen day, Yunnan forces captured Dali and executed Du Wenxiu, Yang Rong, and Cai Tingdong.',
  ],
  s0691: [
    'Cen Yuying was given a yellow jacket and a hereditary Cavalry Commandant title; Liu Yuezhao\'s penalties were lifted; Yang Yuke was made Cavalry Commandant.',
    'Cen Yuying won a yellow jacket and hereditary Cavalry Commandant rank; Liu Yuezhao was restored; Yang Yuke became Cavalry Commandant.',
  ],
  s0692: [
    'On day yisi, both Empress Dowagers, as personal rule drew near, issued maternal instructions urging the Emperor to "uphold the house law, attend to appointment and administration, and not neglect classical study."',
    'On yisi day, both Empress Dowagers exhorted the Emperor to uphold house law, govern well, and keep studying the classics.',
  ],
  s0693: [
    'They exhorted court ministers and officials throughout the empire to "serve loyally in public duty and relieve the hard times."',
    'They urged all officials to serve loyally and ease the crisis.',
  ],
  s0694: [
    'On day bingwu, the Emperor took personal rule; an edict declared he would "reverently obey maternal teaching, revere Heaven and the ancestors, and govern diligently for the people."',
    'On bingwu day, the Emperor assumed personal rule, pledging to obey Cixi, revere heaven and ancestors, and rule for the people.',
  ],
  s0695: [
    'On day jiyou, the Imperial Household Department was told to verify savings and not borrow beyond the annual expense of six hundred thousand taels.',
    'On jiyou day, Internal Affairs was barred from borrowing beyond its verified six-hundred-thousand annual budget.',
  ],
  s0696: [
    'Second month, new moon on day gengxu: Grand Councilors, the Six Ministries, and the Nine Chief Courts met on policy for the Yellow River and Grand Canal.',
    'At the second-month new moon, gengxu, the Grand Council and ministries met on Yellow River and Grand Canal policy.',
  ],
  s0697: [
    'Li Hongzhang was told to plan carefully and memorialize.',
    'Li Hongzhang was ordered to plan thoroughly and report.',
  ],
  s0698: [
    'An edict of self-examination was issued, seeking frank counsel.',
    'The court issued a self-examination edict and called for straight talk.',
  ],
  s0699: [
    'Provinces were told to recommend worthy men and stop corruption.',
    'All provinces were urged to promote talent and end graft.',
  ],
  s0700: [
    'On day wuwu, honorific titles were added for both Empress Dowagers; the next day an edict of general grace was issued with distinctions.',
    'On wuwu day, both Empress Dowagers gained new honorifics; the next day a grace edict followed with graded favors.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b07.mjs <translation.json>'
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
