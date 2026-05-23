#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: ["In the fifth month, on the day wushen, the commandery of Xiyang was restored.", "In the fifth month, on wushen, the commandery of Xiyang was restored."],
  s0302: ["In the sixth month, on the day wuyin, one additional Master of the Ministry of Personnel was appointed and the Master of the Five Arms was abolished.", "In the sixth month, on wuyin, one additional Master of the Ministry of Personnel was appointed and the Master of the Five Arms was abolished."],
  s0303: ["On the day dinghai, the Left Grand Master of Splendid Happiness He Shangzhi was given credentials equal to an open office with the Three Excellencies.", "On dinghai Left Grand Master of Splendid Happiness He Shangzhi received credentials equal to an open office with the Three Excellencies."],
  s0304: ["On the day wuzi, the Grand Master of Splendid Happiness with the Golden Seal Yang Xuanbao was made Right Grand Master of Splendid Happiness.", "On wuzi Grand Master of Splendid Happiness with the Golden Seal Yang Xuanbao was made Right Grand Master of Splendid Happiness."],
  s0305: ["On the day bingshen, an edict was issued: In the past, because of military campaigns, many fled and went into hiding.", "On bingshen an edict declared: In the past, because of military campaigns, many fled and went into hiding."],
  s0306: ["Some, dwelling in remote hills, had been touched by rebellion and feared military punishment;", "Some, dwelling in remote hills, had been touched by rebellion and feared military punishment;"],
  s0307: ["some, shirking corvée and dreading toil, sought only to escape punishment.", "some shirked corvée and dreaded toil, seeking only to escape punishment."],
  s0308: ["Though the law was kept simple and broad mercy was intended, grace edicts were issued in rapid succession, yet those in hiding remained numerous.", "Though the law was kept simple and broad mercy was intended, grace edicts followed one after another, yet fugitives remained numerous."],
  s0309: ["Was it that stupidity had become their nature and shame at evil made return difficult;", "Was it that stupidity had become their nature and shame at evil made return difficult;"],
  s0310: ["or was it that the local chief officials had guided and proclaimed the policy awry.", "or was it that local chiefs had guided and proclaimed the policy awry."],
  s0311: ["Let grace be extended broadly and all be granted a new beginning.」", "Let grace be extended broadly and all be granted a new beginning.」"],
  s0312: ["In the seventh month of autumn, on the day jiachen, Gao Ge of Pengcheng and others plotted rebellion and were executed.", "In the seventh month of autumn, on jiachen, Gao Ge of Pengcheng and others plotted rebellion and were executed."],
  s0313: ["On the day guihai, the General of the Right Guard Yan Shibo was made Inspector of Qing and Ji.", "On guihai General of the Right Guard Yan Shibo was made Inspector of Qing and Ji."],
  s0314: ["In the eighth month, on the day yiyou, the King of Henan sent envoys presenting local products.", "In the eighth month, on yiyou, the King of Henan sent envoys with tribute."],
  s0315: ["On the day bingxu, the Director of the Secretariat Wang Sengda, having committed a crime, was imprisoned and died.", "On bingxu Director of the Secretariat Wang Sengda, having committed a crime, was imprisoned and died."],
  s0316: ["On the day jichou, the General of Powerful Crossbows Du Shuwen was made Inspector of Ning; the Inspector of Jiao Fei Yan was made Inspector of Guang; the Administrator of Nanhai Yuan Lang was made Inspector of Jiao.", "On jichou General of Powerful Crossbows Du Shuwen was made Inspector of Ning; Inspector of Jiao Fei Yan was made Inspector of Guang; Administrator of Nanhai Yuan Lang was made Inspector of Jiao."],
  s0317: ["On the day jiawu, the General Who Pacifies the North Shen Sengrong was made Inspector of Yan.", "On jiawu General Who Pacifies the North Shen Sengrong was made Inspector of Yan."],
  s0318: ["In the ninth month, on the day guimao, cases were heard at the Hualin Garden.", "In the ninth month, on guimao, the emperor heard cases at the Hualin Garden."],
  s0319: ["On the day renxu, the General Who Pacifies the North Liu Daolong was made Inspector of Xu.", "On renxu General Who Pacifies the North Liu Daolong was made Inspector of Xu."],
  s0320: ["Great floods struck Xiangyang; envoys were dispatched to tour the region and grant relief.", "Great floods struck Xiangyang; envoys were sent to tour the region and grant relief."],
  s0321: ["On the day gengwu, the posts of General of the Martial Guard and Regular Attendant of the Martial Cavalry were established.", "On gengwu the posts of General of the Martial Guard and Regular Attendant of the Martial Cavalry were established."],
  s0322: ["In the tenth month of winter, on the day jiawu, the General of the Central Army Prince of Yiyang Chang was made Inspector of Jiang.", "In the tenth month of winter, on jiawu, General of the Central Army Prince of Yiyang Chang was made Inspector of Jiang."],
  s0323: ["On the day yiwei, the state of Goguryeo sent envoys presenting local products.", "On yiwei Goguryeo sent envoys with tribute."],
  s0324: ["In the eleventh month, on the day renzi, Prince of Xiyang Zishang, Inspector of Yang, was given the additional title of General Who Pacifies the Army.", "In the eleventh month, on renzi, Inspector of Yang Prince of Xiyang Zishang was given the additional title of General Who Pacifies the Army."],
  s0325: ["In the twelfth month, on the day jihai, for princes and consorts of common surname holding ranks equal to the Three Excellencies, funeral rites might set up a mourning gate; all others were forbidden.", "In the twelfth month, on jihai, princes and consorts of common surname holding ranks equal to the Three Excellencies might set up a mourning gate for funerals; all others were forbidden."],
  s0326: ["In the intercalary month, on the day gengzi, an edict was issued: Those who dwell in mountains and live in cliffs do not take fish and turtle as ritual offerings.", "In the intercalary month, on gengzi, an edict declared: Those who dwell in mountains and live on cliffs do not take fish and turtle as ritual offerings."],
  s0327: ["In recent years there has been much trouble; military levies have been urgent and pressing. Levies imposed contrary to local custom were meant to meet a moment's need, yet those in charge have grown accustomed to them and they have become regular practice.", "In recent years there has been much trouble; military levies have been urgent. Levies contrary to local custom were meant for a moment's need, yet officials have grown accustomed to them and they have become regular practice."],
  s0328: ["Pawlonia, catalpa, jade, and fine stone—each land should offer what it produces; yet when feathers are piled, the weight grows light, and in the end deep harm is done.", "Pawlonia, catalpa, jade, and fine stone—each land should offer what it produces; yet when trifles accumulate, deep harm follows in the end."],
  s0329: ["Ever speaking of broad reform, let it not fall short of my intent.", "Ever speaking of broad reform, let it not fall short of my intent."],
  s0330: ["All tribute duties of the capital region and products gathered from mountains and marshes must be examined in detail as to what each place produces and assessed according to the seasons, so that forced quotas hang empty in the air and run counter to the natural order.", "All tribute duties of the capital region and products gathered from mountains and marshes must be examined as to what each place produces and assessed by season, so that forced quotas are not imposed in vain and the natural order is not violated."],
  s0331: ["Thus may the wind of simplicity win trust in character;", "Thus may the wind of simplicity win trust in character;"],
  s0332: ["and the teaching of grace and care leave none in remote corners neglected.」", "and the teaching of grace and care leave none in remote corners neglected.」"],
  s0333: ["」On the day gengshen, the emperor heard cases at the Hualin Garden.", "」On gengshen the emperor heard cases at the Hualin Garden."],
  s0334: ["On the day renxu, the state of Linyi sent envoys presenting local products.", "On renxu Linyi sent envoys with tribute."],
  s0335: ["That winter the northern enemy raided Qing Province; the Inspector Yan Shibo repeatedly inflicted great defeats upon them.", "That winter the northern enemy raided Qing Province; Inspector Yan Shibo repeatedly inflicted great defeats on them."],
  s0336: ["In the third year, in the first month of spring, on the day dinghai, Liang commandery in Yu Province was detached and placed under Xu Province.", "In the third year, on dinghai in the first month of spring, Liang commandery in Yu was detached and placed under Xu."],
  s0337: ["On the day jichou, the General Who Pacifies the Cavalry and General of the Palace Garrison Liu Yuanjing was made Director of the Masters of Writing; the Right Vice Director Liu Zunkao was made General of the Palace Garrison.", "On jichou General Who Pacifies the Cavalry and General of the Palace Garrison Liu Yuanjing was made Director of the Masters of Writing, and Right Vice Director Liu Zunkao was made General of the Palace Garrison."],
  s0338: ["On the day bingshen, the state of Bohuang sent envoys presenting local products.", "On bingshen Bohuang sent envoys with tribute."],
  s0339: ["In the second month, on the day yimao, the six commanderies governed by Yang Province were made the metropolitan domain.", "In the second month, on yimao, the six commanderies governed by Yang were made the metropolitan domain."],
  s0340: ["Eastern Yang Province was made Yang Province.", "Eastern Yang was made Yang Province."],
  s0341: ["[16] At that time they wished to establish the post of Imperial Censor, but ceased because Crown Prince Shao had already been installed.", "At that time they wished to establish the post of Imperial Censor, but ceased because Crown Prince Shao had already been installed."],
  s0342: ["General Who Pacifies the Army and Inspector of Yang Prince of Xiyang Zishang was transferred to be Inspector of Yang.", "General Who Pacifies the Army and Inspector of Yang Prince of Xiyang Zishang was made Inspector of Yang."],
  s0343: ["On the day jiazi, the post of Supervisor of the Court of Justice was restored.", "On jiazi the post of Supervisor of the Court of Justice was restored."],
  s0344: ["Jing Province suffered famine; in the third month, on the day jiashen, field rents and cloth taxes were remitted in graded amounts.", "Jing suffered famine; in the third month, on jiashen, field rents and cloth taxes were remitted in graded amounts."],
  s0345: ["On the day gengyin, the Administrator of Yixing Yuan Lang was made Inspector of Yan.", "On gengyin Administrator of Yixing Yuan Lang was made Inspector of Yan."],
  s0346: ["On the day renchen, the General Who Protects the Army Prince of Xiangdong Yu was transferred to another post; the Director of the Secretariat Prince of Donghai Hui was made General of the Guard and General Who Protects the Army.", "On renchen General Who Protects the Army Prince of Xiangdong Yu was reassigned; Director of the Secretariat Prince of Donghai Hui was made General of the Guard and General Who Protects the Army."],
  s0347: ["On the day guisi, the Grand Preceptor Prince of Jiangxia Yigong was given the additional post of Supervisor of the Secretariat.", "On guisi Grand Preceptor Prince of Jiangxia Yigong was also made Supervisor of the Secretariat."],
  s0348: ["In the fourth month of summer, on the day guimao, the emperor heard cases at the Hualin Garden.", "In the fourth month of summer, on guimao, the emperor heard cases at the Hualin Garden."],
  s0349: ["On the day bingwu, the Administrator of Jianning Fu Zhongzi was made Inspector of Ning.", "On bingwu Administrator of Jianning Fu Zhongzi was made Inspector of Ning."],
  s0350: ["On the day yimao, the Minister of Works and Inspector of Southern Yan Prince of Jingling Dan, having committed a crime, was degraded in rank.", "On yimao Minister of Works and Inspector of Southern Yan Prince of Jingling Dan, having committed a crime, was degraded in rank."],
  s0351: ["Dan refused the command, seized Guangling city in rebellion, and killed the Inspector of Yan Yuan Lang.", "Dan refused the command, seized Guangling in rebellion, and killed Inspector of Yan Yuan Lang."],
  s0352: ["The Duke of Shixing Shen Qingzhi was made Grand General of the Agile Cavalry, with credentials equal to an open office with the Three Excellencies, and Inspector of Southern Yan to suppress Dan.", "Duke of Shixing Shen Qingzhi was made Grand General of the Agile Cavalry, with credentials equal to an open office with the Three Excellencies, and Inspector of Southern Yan to suppress Dan."],
  s0353: ["On the day jiazi, the emperor in person commanded the six armies; the imperial carriage moved out and halted at the Hall of Martial Proclamation.", "On jiazi the emperor in person commanded the six armies; the imperial carriage moved out and halted at the Hall of Martial Proclamation."],
  s0354: ["The Inspector of Si Liu Jizhi rebelled; the Inspector of Xu Liu Daolong attacked and beheaded him.", "Inspector of Si Liu Jizhi rebelled; Inspector of Xu Liu Daolong attacked and beheaded him."],
  s0355: ["In the seventh month of autumn, on the day jisi, Guangling city was taken and Dan was beheaded.", "In the seventh month of autumn, on jisi, Guangling was taken and Dan beheaded."],
  s0356: ["All males within the city were put to death; the women were taken as military reward.", "All males in the city were put to death; the women were taken as military reward."],
  s0357: ["That day the emergency regulations were lifted.", "That day the emergency regulations were lifted."],
  s0358: ["On the day xinwei, a general amnesty was proclaimed throughout the empire.", "On xinwei a general amnesty was proclaimed."],
  s0359: ["Long-term convicts of the Imperial Workshop and aged or sick palace women and eunuch slaves were all pardoned and released.", "Long-term convicts of the Imperial Workshop and aged or sick palace women and eunuch slaves were all pardoned and released."],
  s0360: ["Filial sons, obedient grandsons, righteous husbands, and chaste wives were each granted grain and silk in graded amounts.", "Filial sons, obedient grandsons, righteous husbands, and chaste wives each received grain and silk in graded amounts."],
  s0361: ["Poor households within the metropolitan domain and those along the route of the recent imperial halt were all exempted from rent for one year.", "Poor households in the metropolitan domain and along the route of the recent imperial halt were all exempted from rent for one year."],
  s0362: ["On the day bingzi, the Administrator of Danyang Liu Xiuzhi was made Right Vice Director of the Masters of Writing.", "On bingzi Administrator of Danyang Liu Xiuzhi was made Right Vice Director of the Masters of Writing."],
  s0363: ["On the day bingxu, north and south of the Huai were again divided and two Yu Provinces were re-established.", "On bingxu north and south of the Huai were again divided and two Yu Provinces were re-established."],
  s0364: ["The newly dismissed Grand General of the Agile Cavalry, with credentials equal to an open office with the Three Excellencies, and Inspector of Southern Yan Shen Qingzhi was made Minister of Works, his inspectorship remaining unchanged.", "The newly dismissed Grand General of the Agile Cavalry, with credentials equal to an open office with the Three Excellencies, and Inspector of Southern Yan Shen Qingzhi was made Minister of Works, retaining his inspectorship."],
  s0365: ["On the day wuzi, the General of the Guard and General Who Protects the Army Prince of Donghai Hui was made Inspector of Southern Yu, his rank as General of the Guard remaining unchanged.", "On wuzi General of the Guard and General Who Protects the Army Prince of Donghai Hui was made Inspector of Southern Yu, retaining his rank as General of the Guard."],
  s0366: ["Prince of Yiyang Chang, Inspector of Jiang, was made General Who Protects the Army; the General Who Conquers the Champions Prince of Guiyang Xiufan was made Inspector of Jiang.", "Prince of Yiyang Chang, Inspector of Jiang, was made General Who Protects the Army; General Who Conquers the Champions Prince of Guiyang Xiufan was made Inspector of Jiang."],
  s0367: ["On the day guisi, the former General of the Left Guard Wang Xuanmo was made Inspector of Ying.", "On guisi former General of the Left Guard Wang Xuanmo was made Inspector of Ying."],
  s0368: ["In the eighth month, on the day bingshen, an edict was issued: In the recent northern campaign, civil and military men who perished in the army—some falling to arrows and stones, some dying of plague—all gave their utmost in service to the throne, yet their coffins and burial goods were meager.", "In the eighth month, on bingshen, an edict declared: In the recent northern campaign, civil and military men lost in the army—some falling to arrows and stones, some dying of plague—all gave their utmost in royal service, yet their coffins and burial goods were meager."],
  s0369: ["Let compensation be renewed broadly for all, and let it be made ample.」", "Let compensation be renewed broadly for all, and let it be made ample.」"],
  s0370: ["」On the day jiyou, the Chief Clerk of the Agile Cavalry Yu Shenzhi was made Inspector of Yu.", "」On jiyou Chief Clerk of the Agile Cavalry Yu Shenzhi was made Inspector of Yu."],
  s0371: ["On the day jiazi, an edict was issued: In antiquity, when the way of Zhou was just taking form, punishments were set aside;", "On jiazi an edict declared: In antiquity, when the way of Zhou was just taking form, punishments were set aside;"],
  s0372: ["when Han virtue first shone forth, the prison gates were kept simple.", "when Han virtue first shone forth, the prison gates were kept simple."],
  s0373: ["This was truly because those above unified the Way and those below purified their nature.", "This was truly because those above unified the Way and those below purified their nature."],
  s0374: ["Now the people are dissolute and customs thin; sincerity is shallow and deceit deep. Added to my scant virtue, I cannot transform them through the heart alone.", "Now the people are dissolute and customs thin; sincerity is shallow and deceit deep. Added to my scant virtue, I cannot transform them through the heart alone."],
  s0375: ["Thus those who know the proper way are few, while those who rush into crime are truly many.", "Thus those who know the proper way are few, while those who rush into crime are truly many."],
  s0376: ["Recently, on a tour of inspection, I saw two convict laborers of the Imperial Workshop wearing metal fetters and wooden cangues; compassion for them already moved me to restore them.", "Recently, on a tour of inspection, I saw two convict laborers of the Imperial Workshop in metal fetters and wooden cangues; compassion for them already moved me to restore them."],
  s0377: ["Moreover, the realm celebrates and the people are at peace, yet they alone are shut off from imperial grace—this adds to my shame.", "Moreover, the realm celebrates and the people are at peace, yet they alone are shut off from imperial grace—this adds to my shame."],
  s0378: ["Let a detailed report be made on whom to pardon.」", "Let a detailed report be made on whom to pardon.」"],
  s0379: ["In the ninth month, on the day jisi, an edict was issued: The five punishments and three modes of interrogation have been difficult since antiquity; artful laws and deep statutes grow ever more severe in decadent ages.", "In the ninth month, on jisi, an edict declared: The five punishments and three modes of interrogation have been difficult since antiquity; artful laws and deep statutes grow ever more severe in decadent ages."],
  s0380: ["Therefore, by following feeling in examining lawsuits, the master of Lu won success;", "Therefore, by following feeling in examining lawsuits, the master of Lu won success;"],
  s0381: ["by not disturbing the market prisons, the Han historians won renown.", "by not disturbing the market prisons, the Han historians won renown."],
  s0382: ["The Court of Justice receives doubtful cases from far and near; fair judgment is its charge—yet once one enters the dark prison, years often pass.", "The Court of Justice receives doubtful cases from far and near; fair judgment is its charge—yet once one enters the dark prison, years often pass."],
  s0383: ["The people bear this hardship; officials indulge their private interests.", "The people bear this hardship; officials indulge their private interests."],
  s0384: ["From this day forward, when prisoners have completed their statements, report at once; I shall review and decide all in detail, so that no case remains in prison.", "From this day forward, when prisoners have completed their statements, report at once; I shall review and decide all in detail, so that no case remains in prison."],
  s0385: ["If prolix documents stall the prosecution or evidence must be gathered from far away, I must examine in person to exhaust the truth of the matter.", "If prolix documents stall the prosecution or evidence must be gathered from far away, I must examine in person to exhaust the truth of the matter."],
  s0386: ["Thereafter cases shall again be heard as before.」", "Thereafter cases shall again be heard as before.」"],
  s0387: ["」On the day renchen, the Upper Forest Park was established north of the Xuanwu Lake.", "」On renchen the Upper Forest Park was established north of Xuanwu Lake."],
  s0388: ["In the tenth month of winter, on the day dingyou, an edict was issued: In antiquity they offered fresh grass on the green altar to pray for many blessings, and divided cocoons in the dark suburb to supply pure garments.", "In the tenth month of winter, on dingyou, an edict declared: In antiquity they offered fresh grass on the green altar to pray for many blessings, and divided cocoons in the dark suburb to supply pure garments."],
  s0389: ["Next year, the consorts and concubines of the six palaces may perform the rite of tending the mulberry in person.", "Next year the consorts and concubines of the six palaces may perform the rite of tending the mulberry in person."],
  s0390: ["」On the day gengzi, the General Who Pacifies the Army and Inspector of Southern Xu Liu Yansun was advanced in title to Grand General of the Agile Cavalry.", "」On gengzi General Who Pacifies the Army and Inspector of Southern Xu Liu Yansun was promoted to Grand General of the Agile Cavalry."],
  s0391: ["On the day wushen, the state of Hexi sent envoys presenting local products.", "On wushen Hexi sent envoys with tribute."],
  s0392: ["On the day gengxu, the King of Hexi, the Great Juqu Anzhou, was made General Who Conquers the Barbarians and Inspector of Liang.", "On gengxu the King of Hexi, the Great Juqu Anzhou, was made General Who Conquers the Barbarians and Inspector of Liang."],
  s0393: ["In the eleventh month, on the day jisi, the state of Goguryeo sent envoys presenting local products.", "In the eleventh month, on jisi, Goguryeo sent envoys with tribute."],
  s0394: ["The state of Sushen, through repeated interpreters, presented arrow-wood shafts and stone whistling-balls.", "Sushen, through repeated interpreters, presented arrow-wood shafts and stone whistling-balls."],
  s0395: ["The Western Regions presented dancing horses.", "The Western Regions presented dancing horses."],
  s0396: ["In the twelfth month, on the day wuwu, the emperor heard cases at the Hualin Garden.", "In the twelfth month, on wuwu, the emperor heard cases at the Hualin Garden."],
  s0397: ["On the day xinyou, the post of Vice Director of the Masters of Ceremonies was established.", "On xinyou the post of Vice Director of the Masters of Ceremonies was established."],
  s0398: ["In the second month, on the day gengzi, the Palace Attendant Prince of Jian'an Xiuren was made Inspector of Xiang.", "In the second month, on gengzi, Palace Attendant Prince of Jian'an Xiuren was made Inspector of Xiang."],
  s0399: ["On the day jiwei, the Supernumerary Regular Attendant of the Scattered Cavalry Fei Jingxu was made Inspector of Ning.", "On jiwei Supernumerary Regular Attendant of the Scattered Cavalry Fei Jingxu was made Inspector of Ning."],
  s0400: ["In the third month, on the day jiazi, the General Who Conquers the Champions Prince of Baling Xiuruo was made Inspector of Xu.", "In the third month, on jiazi, General Who Conquers the Champions Prince of Baling Xiuruo was made Inspector of Xu."],
};

const dataPath = 'data/songshu/006.json';
const outPath = 'translations/current_translation_songshu.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const ids = new Set(Object.keys(T));
const sentences = [];

for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
  const block = data.content[blockIndex];
  if (block.type !== 'paragraph') continue;
  for (const sentence of block.sentences || []) {
    if (!ids.has(sentence.id)) continue;
    sentences.push({
      id: sentence.id,
      originalId: sentence.id,
      blockIndex,
      chinese: sentence.zh,
      literal: '',
      idiomatic: '',
    });
  }
}

sentences.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

if (sentences.length !== ids.size) {
  const got = new Set(sentences.map((s) => s.id));
  const missing = [...ids].filter((id) => !got.has(id));
  throw new Error(`Missing sentences in data: ${missing.join(', ')}`);
}

const out = {
  metadata: {
    book: data.meta.book,
    chapter: data.meta.chapter,
    file: dataPath,
  },
  sentences,
};

for (const s of out.sentences) {
  const pair = T[s.id];
  if (!pair) throw new Error(`Missing ${s.id}`);
  s.literal = pair[0];
  s.idiomatic = pair[1];
}

fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log('Applied', Object.keys(T).length, 'translations to', outPath);
