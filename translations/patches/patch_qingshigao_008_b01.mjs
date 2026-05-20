#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the forty-first year, spring, first month, day renyin [of the sexagenary cycle], an edict ordered repair of the Imperial Academy.',
    'In the forty-first year, on the first day of spring, an edict ordered repairs at the Imperial Academy.',
  ],
  s0002: [
    'On day bingwu, an edict ordered that prisoners held pending review under the delayed-execution procedure have their sentence reduced by one degree.',
    'On bingwu day, prisoners awaiting clemency review had their sentences reduced one grade.',
  ],
  s0003: [
        "Yarjiang'a was invested to succeed as Prince Jian of the First Rank.",
    "Yarjiang'a succeeded to the title Prince Jian.",
  ],
  s0004: [
    'On day gengxu, the Emperor made an inspection tour to Mount Wutai.',
    'On gengxu day, the Emperor toured Mount Wutai.',
  ],
  s0005: [
    'Second month, day gengshen: the court halted at Shehu River.',
    'In the second month, on gengshen day, the entourage stopped at Shehu River.',
  ],
  s0006: [
    'Officials and commoners asked to build a Wanshou Pavilion at Pusa Peak to offer blessings; this was not permitted.',
    'Locals asked to erect a longevity pavilion on Pusa Peak for blessings; the Emperor refused.',
  ],
  s0007: [
    'On day dingmao, the Emperor inspected the Ziya River.',
    'On dingmao day, the Emperor inspected the Ziya River works.',
  ],
  s0008: [
    'Third month, day renwu: the Emperor returned to the capital.',
    'In the third month, on renwu day, the Emperor returned to Beijing.',
  ],
  s0009: [
    'Wardai was appointed Manchu commander-in-chief; Wudashan, Masih\'a, and Manpi were appointed Mongol commanders-in-chief.',
    'Wardai became Manchu commander-in-chief; Wudashan, Masih\'a, and Manpi became Mongol commanders-in-chief.',
  ],
  s0010: [
    'On day dinghai, the Emperor attended the Classics lecture.',
    'On dinghai day, the Emperor held the Classics lecture.',
  ],
  s0011: [
    'Summer, fourth month, day jiaxu: the retired Grand Secretary Wang Xi was granted an imperial calligraphic plaque and couplet, with an edict saying: "You are an old minister of the previous reign; take hearty meals, be careful with medicine, to comfort Our mind."',
    'In the fourth month, the retired Grand Secretary Wang Xi received an imperial plaque and message urging him to eat well and care for his health.',
  ],
  s0012: [
    '" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0013: [
    'Fifth month, day guisi: regulations were fixed for exiled convicts to be sent home under native-place assignment; when a transported convict died at the place of exile, his wife and children were permitted to return to their home district.',
    'In the fifth month, rules were set for exiles to be sent home by native place; if a convict died in exile, his family could return.',
  ],
  s0014: [
    'On day xinchou, Prince Xianqin Danzhen died; princes and high ministers were sent to manage the funeral, ten thousand taels of silver were granted, the posthumous title Mi was given, and his son Yanhuang succeeded.',
    'Prince Xianqin Danzhen died; the court arranged his funeral, granted silver, gave the posthumous name Mi, and his son Yanhuang inherited the title.',
  ],
  s0015: [
    'On day renyin: earlier, Yao people of Lianshan in Lianzhou prefecture had risen in revolt; censors memorialized, and the commander-in-chief Song Zhu was ordered to lead the guards in joint suppression, and Minister Fan Chengxun was ordered to investigate.',
    'Earlier, Yao rebels had risen in Lianzhou; the court sent Song Zhu with the guards and Fan Chengxun to investigate.',
  ],
  s0016: [
    'At this time Song Zhu reported that as soon as government troops arrived the Yao begged to surrender, and in all more than nineteen thousand Yao persons came forward.',
    'Song Zhu reported that the Yao surrendered as soon as troops arrived, with over nineteen thousand turning themselves in.',
  ],
  s0017: [
    'They handed over nine men including Li Gui who had killed officials, who were at once executed before the army.',
    'Nine men who had killed officials, including Li Gui, were executed on the spot.',
  ],
  s0018: [
    'The surrendered Yao were resettled and the matter was turned over to the governor-general to handle.',
    'Surrendered Yao were resettled under the governor-general\'s care.',
  ],
  s0019: [
    'Fan Chengxun memorialized that in the Yao disturbance the vice commander Du Fang was killed in action, and the regional commander Liu Hu had withdrawn in advance and should be sentenced to decapitation; the provincial commander Yin Huaxing should be dismissed from office.',
    'Fan Chengxun reported Du Fang killed in action and urged decapitation for Liu Hu, who had retreated early, and dismissal for Yin Huaxing.',
  ],
  s0020: [
    'An edict was received: "Yin Huaxing has battle merit; let him retire at his original rank.',
    'The Emperor ruled that Yin Huaxing, for past merit, might retire at his former rank.',
  ],
  s0021: [
    'Liu Hu\'s death sentence is remitted."',
    'Liu Hu\'s death sentence was remitted."',
  ],
  s0022: [
    'On day bingwu, court ministers were summoned to the Hall of Preserving Harmony and imperial calligraphy was bestowed.',
    'On bingwu day, ministers were summoned and given imperial calligraphy.',
  ],
  s0023: [
    'Sixth month, day renzi: Miao people of Ge Yi stockade in Guizhou rebelled; government troops suppressed and pacified them.',
    'In the sixth month, Guizhou Miao rebels were suppressed.',
  ],
  s0024: [
    'On day wuwu, the Emperor composed an admonitory essay for scholars and ordered it issued to all provinces and carved on stone at the schools.',
    'The Emperor issued an admonition to scholars for every province and had it carved at the schools.',
  ],
  s0025: [
    'On day yiwei, the Emperor accompanied the Empress Dowager to Rehe.',
    'On yiwei day, the Emperor escorted the Empress Dowager to Rehe.',
  ],
  s0026: [
    'On day yichou, Sichuan provincial commander Yue Shenglong memorialized that Mabi of the Luomu tribe in Great Liangshan, leading his people, had submitted and asked that he be made a native thousand-household with seal and patent.',
    'Yue Shenglong reported that Mabi of Great Liangshan had submitted and was made a native thousand-household.',
  ],
  s0027: [
    'Intercalary sixth month, day xinchou: more than nineteen thousand households of the Muya tribe submitted; posts of pacification commissioner, vice commissioner, and native hundred-household were requested and all granted.',
    'In the intercalary sixth month, nineteen thousand Muya households submitted and native offices were established.',
  ],
  s0028: [
    'Eighth month, day gengchen, first day of the month: the quota for successful candidates at the provincial examinations in Shuntian, Zhejiang, and Huguang was increased.',
    'On the first of the eighth month, provincial examination quotas were raised for Shuntian, Zhejiang, and Huguang.',
  ],
  s0029: [
    'On day wushen, the Emperor accompanied the Empress Dowager back to the palace.',
    'On wushen day, the Emperor returned with the Empress Dowager to the palace.',
  ],
  s0030: [
    'Ninth month, day xinhai: Li Zhengzong, Lu Chongyao, and Feng Guoxiang were appointed Han Chinese commanders-in-chief.',
    'In the ninth month, Li Zhengzong, Lu Chongyao, and Feng Guoxiang became Han commanders-in-chief.',
  ],
  s0031: [
    'On day renzi, the quota rule for success in the Five Classics was fixed.',
    'On renzi day, rules for passing the Five Classics examination were set.',
  ],
  s0032: [
    'On day guichou, the autumn executions were suspended for this year.',
    'On guichou day, autumn executions were halted for the year.',
  ],
  s0033: [
    'On day xinyou, Qi Shi and Song Zhu were made Manchu commanders-in-chief, Mangka Han commander-in-chief, and Chena Fu Mongol commander-in-chief.',
    'Qi Shi and Song Zhu became Manchu commanders-in-chief; Mangka Han and Chena Fu Mongol commander-in-chief.',
  ],
  s0034: [
    'On day jiazi, an edict said: "On the southern tour to inspect the rivers, wherever We pass, local supplies are to cease, and exactions are forbidden.',
    'An edict ordered that on the southern river inspection tour no lavish supplies or levies be imposed.',
  ],
  s0035: [
    'Officials must not exchange gifts; the people are each to keep to their own occupation.',
    'Officials were forbidden to exchange gifts; commoners were to remain at their trades.',
  ],
  s0036: [
    'Governors and governors-general are to proclaim this so that all clearly know Our intent."',
    'Provincial authorities were to publish the edict so all understood the Emperor\'s intent."',
  ],
  s0037: [
    'On day jisi, Xi Hana was made Grand Secretary, Dunbai Minister of Personnel, Xierda Minister of Rites, Wenda Censor-in-chief of the Left, and Guan Yuanzhong general at Guangzhou.',
    'Xi Hana became Grand Secretary; Dunbai, Xierda, Wenda, and Guan Yuanzhong received new posts.',
  ],
  s0038: [
    'Students of Zhenting memorialized at the palace gate that the Red Miao were killing people and the authorities did not inquire.',
    'Zhenting students petitioned that Red Miao killings went unpunished.',
  ],
  s0039: [
    'An edict ordered Vice Minister Fu Jizu and Gan Guoshu, and Governor Zhao Shenqiao, to travel post-haste to investigate.',
    'Fu Jizu, Gan Guoshu, and Zhao Shenqiao were sent to investigate at once.',
  ],
  s0040: [
    'On day guiyou, the Emperor set out on the southern tour.',
    'On guiyou day, the southern tour began.',
  ],
  s0041: [
    'Winter, tenth month, day renwu: the court halted at Dezhou.',
    'In the tenth month, the entourage stopped at Dezhou.',
  ],
  s0042: [
    'Crown Prince Yinreng was ill; the Emperor turned the imperial carriage back.',
    'The Crown Prince fell ill and the Emperor turned back.',
  ],
  s0043: [
    'On day guimao, the Emperor returned to the palace.',
    'On guimao day, the Emperor returned to the palace.',
  ],
  s0044: [
    'On day bingwu, Guo Shilong was made governor-general of Guangdong and Guangxi, and Jin Shirong governor-general of Zhejiang and Fujian.',
    'Guo Shilong and Jin Shirong were appointed governors-general of the south and southeast.',
  ],
  s0045: [
    'Eleventh month, day bingchen: an edict remitted next year\'s land tax quota for Shaanxi and Anhui.',
    'In the eleventh month, Shaanxi and Anhui were granted tax relief for the coming year.',
  ],
  s0046: [
    'On day jiazi, Grand Secretary Yisang\'a asked to retire; he was ordered to leave office.',
    'Grand Secretary Yisang\'a retired from office.',
  ],
  s0047: [
    'On day renshen, Guangxi Governor Xiao Yongzao memorialized impeaching Provincial Administration Commissioner Jiao Huaxin for a shortfall in stored grain that should be made good.',
    'Guangxi\'s governor reported a grain shortfall by Commissioner Jiao Huaxin.',
  ],
  s0048: [
    'The Emperor said: "Grain and rice must have storage places if they are to last.',
    'The Emperor said grain must be stored properly to last.',
  ],
  s0049: [
    'If there are no granaries and grain is piled in open fields, it cannot escape rotting—how much more in the low, damp south?',
    'Without granaries, grain in open fields rots—especially in the damp south.',
  ],
  s0050: [
    'Draw up a separate regulation and report."',
    'He ordered a separate regulation drawn up."',
  ],
  s0051: [
    'An order was issued to repair the tomb of Yu.',
    'The court ordered repairs at Yu\'s tomb.',
  ],
  s0052: [
    'Twelfth month, day renchen: court ministers, because the next year would be the Emperor\'s fiftieth birthday, asked that a honorific title be conferred.',
    'In the twelfth month, ministers sought a honorific title for the Emperor\'s fiftieth birthday.',
  ],
  s0053: [
    'The Emperor did not permit it.',
    'The Emperor refused.',
  ],
  s0054: [
    'The Ministry of Revenue rejected a disaster report from Fengtian.',
    'The Ministry of Revenue rejected Fengtian\'s disaster report.',
  ],
  s0055: [
    'The Emperor said: "Rain and drought are originally not fixed; at first the rains were harmonious, and afterward there was disaster—this too is a common thing.',
    'The Emperor said weather is uncertain and later disaster was not unusual.',
  ],
  s0056: [
    'Their memorial may be approved."',
    'He approved the memorial after all."',
  ],
  s0057: [
    'On day yiwei, Zhao Shenqiao was changed to governor of Bian and Yuan, Zhao Hongcan made provincial commander of Guangdong, Wang Shichen of Zhejiang, and Sun Zhenghao Han commander-in-chief.',
    'Zhao Shenqiao, Zhao Hongcan, Wang Shichen, and Sun Zhenghao received new appointments.',
  ],
  s0058: [
    'On day renyin, Erut leader Danjin Alabutan came to court; he was richly rewarded, enfeoffed as Prince of the Commandery, and granted pasture lands.',
    'Erut leader Danjin Alabutan was received at court, enfeoffed as prince, and given pasture lands.',
  ],
  s0059: [
    'This year, disaster land tax for ten prefectures and counties in Jiangnan, Henan, Zhejiang, Huguang, Gansu, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas across several provinces.',
  ],
  s0060: [
    'Korea and Ryukyu sent tribute.',
    'Korea and Ryukyu paid tribute.',
  ],
  s0061: [
    'Forty-second year, spring, first month, day renzi: Grand Secretaries and other ministers congratulated the Emperor on his fiftieth birthday and respectfully presented a "Boundless Longevity" screen.',
    'In the forty-second year, ministers congratulated the Emperor on his fiftieth birthday with a longevity screen.',
  ],
  s0062: [
    'He declined it and accepted only the written album.',
    'The Emperor declined the gift but kept the album.',
  ],
  s0063: [
    'On day renxu, the Emperor set out on the southern tour to inspect the rivers.',
    'On renxu day, the Emperor began the southern river inspection tour.',
  ],
  s0064: [
    'On day dingmao, Yu Yimou was made provincial commander of Huguang.',
    'Yu Yimou became Huguang provincial commander.',
  ],
  s0065: [
    'On day gengwu, the court halted at Jinan, viewed Pearl Spring, and composed a poem on three crossings of the Qi River.',
    'At Jinan the Emperor viewed Pearl Spring and wrote poetry on crossing the Qi River.',
  ],
  s0066: [
    'On day renshen, the court halted at Tai\'an and ascended Mount Tai.',
    'On renshen day, the Emperor climbed Mount Tai from Tai\'an.',
  ],
  s0067: [
    'An edict remitted last year\'s overdue taxes for districts along the imperial route and for those with poor harvests.',
    'Arrears were remitted along the tour route and in districts with poor harvests.',
  ],
  s0068: [
    'Second month, day dingchou: forty thousand shi of tax-grain transport was sent to relieve Jining and Tai\'an.',
    'In the second month, forty thousand shi of grain were sent to relieve Jining and Tai\'an.',
  ],
  s0069: [
    'The Suqian dike works were inspected.',
    'The Emperor inspected the Suqian dikes.',
  ],
  s0070: [
    'On day jimao, from Taoyuan he boarded a boat and inspected the river dikes throughout.',
    'On jimao day, he took a boat from Taoyuan and inspected the dikes.',
  ],
  s0071: [
    'On day jiashen, he crossed the river and ascended Jinshan.',
    'On jiashen day, he crossed the Yangzi and climbed Jinshan.',
  ],
  s0072: [
    'On day bingxu, the court halted at Suzhou.',
    'On bingxu day, the entourage stopped at Suzhou.',
  ],
  s0073: [
    'An officer was sent to offer sacrifice at the tomb of the late Grand Secretary Song Deyi.',
    'An officer sacrificed at Grand Secretary Song Deyi\'s tomb.',
  ],
  s0074: [
    'On day gengyin, the Emperor halted at Hangzhou and reviewed archery.',
    'On gengyin day, the Emperor held an archery review at Hangzhou.',
  ],
  s0075: [
    'On day xinchou, the court halted at Jiangning.',
    'On xinchou day, the entourage stopped at Jiangning.',
  ],
  s0076: [
    'Third month, day wushen: the Emperor inspected the Gaojia Embankment and Zhaijiaba dike works.',
    'In the third month, the Emperor inspected dikes at Gaojia and Zhaijiaba.',
  ],
  s0077: [
    'On day jiyou, the Emperor inspected the Yellow River dikes at Longwo and Yandun south of the river.',
    'On jiyou day, he inspected Yellow River dikes at Longwo and Yandun.',
  ],
  s0078: [
    'On day gengshen, the Emperor returned to the capital.',
    'On gengshen day, the Emperor returned to Beijing.',
  ],
  s0079: [
    'On day guihai, the birthday of long life: the Emperor attended the Empress Dowager\'s palace and exempted court ministers from congratulatory audience.',
    'On his birthday, the Emperor visited the Empress Dowager and excused ministers from court congratulations.',
  ],
  s0080: [
    'A grace edict was issued, granting favors to the aged, remitting tax quotas, examining filial conduct and righteousness, relieving the distressed, recommending the overlooked, and pardoning all crimes not covered by ordinary amnesties.',
    'A grace edict remitted taxes, honored the aged and virtuous, relieved the poor, and granted a broad pardon.',
  ],
  s0081: [
    'Gifts were bestowed in varying amounts on princes, commandery princes, and civil and military officials below them.',
    'Princes, nobles, and officials received graded gifts.',
  ],
  s0082: [
    'On day gengwu, Tong\'e succeeded as Prince Xin of the Commandery.',
    'Tong\'e succeeded as Prince Xin of the Commandery.',
  ],
  s0083: [
    'On day xinwei, the Emperor attended the Classics lecture.',
    'On xinwei day, the Emperor held the Classics lecture.',
  ],
  s0084: [
    'Imperial examination licentiates of the inner court book compilation, Wang Hao, He Chuo, and Jiang Tingxi, were granted jinshi status and admitted to the palace examination on equal terms.',
    'Wang Hao, He Chuo, and Jiang Tingxi, compiler licentiates, were granted jinshi and palace examination status.',
  ],
  s0085: [
    'Summer, fourth month, day xinsi: Wang Shidan and one hundred sixty-three others were granted jinshi and other ranks with distinctions.',
    'In the fourth month, Wang Shidan and 163 others received jinshi degrees.',
  ],
  s0086: [
    'Raw tribesmen of the eighteen stockades of Longxi, Weizhou, Sichuan, submitted and paid grain tax.',
    'Eighteen Longxi stockades in Sichuan submitted and paid tax.',
  ],
  s0087: [
    'On day dinghai, Grand Secretary Xiong Cilü asked to retire; he was ordered relieved of office while retaining salary, remaining available for consultation.',
    'Grand Secretary Xiong Cilü retired with salary but remained available for consultation.',
  ],
  s0088: [
    'Fu Jizu and others investigated the case of Red Miao plundering in Huguang.',
    'Fu Jizu and colleagues investigated Red Miao raids in Huguang.',
  ],
  s0089: [
    'An edict was received: "Governor-General Guo Xiu and Provincial Commander Du Benzhi concealed reports and did not memorialize; both are dismissed from office.',
    'The Emperor dismissed Governor-General Guo Xiu and Commander Du Benzhi for concealing Red Miao raids.',
  ],
  s0090: [
    'Governor Jin Xi was reduced in rank."',
    'Governor Jin Xi was demoted."',
  ],
  s0091: [
    'Yu Chenglong was made governor-general of Huguang.',
    'Yu Chenglong became governor-general of Huguang.',
  ],
  s0092: [
    'On day guisi, the retired Grand Secretary Wang Xi died; sacrificial rites and burial honors were granted, posthumous title Wenjing.',
    'Retired Grand Secretary Wang Xi died and received posthumous name Wenjing.',
  ],
  s0093: [
    'On day bingshen, Chen Jing\'ai was made Grand Secretary and concurrent Minister of Personnel.',
    'Chen Jing\'ai became Grand Secretary and Minister of Personnel.',
  ],
  s0094: [
    'On day wuxu, an edict said the former Vice Minister Ren Kebo, over ninety years old, is truly a venerable elder; the rank of minister was added.',
    'Former Vice Minister Ren Kebo, over ninety, received ministerial rank.',
  ],
  s0095: [
    'Li Guangdi was made Minister of Personnel while continuing as governor of Zhili.',
    'Li Guangdi became Minister of Personnel and remained Zhili governor.',
  ],
  s0096: [
    'Mangka was made general at Jingzhou, Nuolobu at Hangzhou, the imperial clansman Aiyintu Han commander-in-chief, and Sun Zhaji and Weng E\'eli Mongol commanders-in-chief.',
    'Mangka, Nuolobu, Aiyintu, Sun Zhaji, and Weng E\'eli received military appointments.',
  ],
  s0097: [
    'On day jihai, an edict to the Eight Banners people said: "We do not begrudge millions from the treasury to pay bannermen\'s debts and redeem land, planning their livelihood.',
    'The Emperor told the banners he had spent millions to clear debts and restore their livelihoods.',
  ],
  s0098: [
    'If you can all take filial piety and brotherly duty to heart and diligence and frugality as your business, that is enough to comfort Our mind.',
    'He asked them to live frugally and filially to comfort him.',
  ],
  s0099: [
    'If you do not know how to cherish this but continue as before in roaming, drinking, and gambling, We shall certainly deal with you by severe law.',
    'He warned that idleness and gambling would be punished severely.',
  ],
  s0100: [
    'The Emperor personally wrote this proclamation—revere and obey it!',
    'The Emperor wrote this proclamation himself and ordered strict obedience.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b01.mjs <translation.json>'
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
