#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.008, Xuanzong — Kaiyuan 19–22, wheat speech, princes) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0601: {
    literal: 'In the tenth month of winter, Tibet sent its minister Mingxishou with tribute and to request surrender; it was granted.',
    idiomatic: 'That winter, in the tenth month, Tibet sent the minister Mingxishou with gifts to offer submission; the court accepted.',
  },
  s0602: {
    literal: 'On gengyin he visited Fengquan Hot Springs in Qizhou.',
    idiomatic: 'On gengyin he went to Fengquan Hot Springs in Qizhou.',
  },
  s0603: {
    literal: 'On guimao he returned from Fengquan Hot Springs.',
    idiomatic: 'On guimao he came back from Fengquan Hot Springs.',
  },
  s0604: {
    literal: 'In the eleventh month on dingmao he visited the Hot Springs Palace at Xinfeng.',
    idiomatic: 'In the eleventh month, on dingmao, he visited the Xinfeng Hot Springs Palace.',
  },
  s0605: {
    literal: 'In the twelfth month on wuzi, Yuan Zhen, prefect of Fengzhou, died in prison on a charge of sorcery talk.',
    idiomatic: 'In the twelfth month, on wuzi, Fengzhou prefect Yuan Zhen was jailed and executed for sorcery.',
  },
  s0606: {
    literal: 'On wushen, Left Chancellor of the Secretariat, Duke of Yan, Zhang Yue, died.',
    idiomatic: 'On wushen Zhang Yue, Left Chancellor and Duke of Yan, died.',
  },
  s0607: {
    literal: 'That year officials and elders of Huazhou repeatedly memorialized for an honorific title adding the characters “Shengwen” and to ennoble Mount Hua; neither was granted.',
    idiomatic: 'That year the bureaucracy and Huazhou elders repeatedly asked for a grand title with “Shengwen” and to invest Mount Hua; both were refused.',
  },
  s0608: {
    literal: 'In the first year of Kaiyuan 19, in spring, the first month, on renxu, Wang Maoqiong, Grand Guardian Equal in Rank, Duke of Huo, was demoted to Vice-Prefect of Xiangzhou and executed en route; a dozen associates were banished.',
    idiomatic: 'Early in Kaiyuan 19, on renxu, Wang Maoqiong, Duke of Huo, was demoted to Xiangzhou and executed on the road; more than ten of his faction were exiled.',
  },
  s0609: {
    literal: 'On xinmao he sent Minister of Foreign Reception Cui Lin to Tibet on a return embassy.',
    idiomatic: 'On xinmao he dispatched Cui Lin, Minister of Foreign Reception, to Tibet on a return mission.',
  },
  s0610: {
    literal: 'On bingzi he personally plowed at the Dragon Pool in Xingqing Palace.',
    idiomatic: 'On bingzi he plowed in person at the Dragon Pool in Xingqing Palace.',
  },
  s0611: {
    literal: 'On jimao catching carp was forbidden.',
    idiomatic: 'On jimao the taking of carp was banned.',
  },
  s0612: {
    literal: 'Throughout the realm spring and autumn community sacrifices and Confucian libations were to omit livestock, using only libations of wine, in perpetual statute.',
    idiomatic: 'Spring and autumn community rites and Confucian libations empire-wide were to drop livestock and use wine only, forever.',
  },
  s0613: {
    literal: 'In the second month on jiawu Cui Lin was made Censor-in-Chief.',
    idiomatic: 'In the second month, on jiawu, Cui Lin became Censor-in-Chief.',
  },
  s0614: {
    literal: 'On the yiyou new moon of the third month Cui Lin departed as envoy to Tibet.',
    idiomatic: 'On the third-month yiyou new moon Cui Lin left for Tibet.',
  },
  s0615: {
    literal: 'In summer, the fourth month, on renwu, a Ritual Institute was established in the capital.',
    idiomatic: 'In the fourth month, on renwu, a Ritual Institute was set up in the capital.',
  },
  s0616: {
    literal: 'On bingshen orders went out that both capitals and all prefectures were to build temples to the Grand Duke and Lord Father, with Zhang Liang as associate sacrifice, worshipped on the upper wu days of the second and eighth months.',
    idiomatic: 'On bingshen both capitals and every prefecture were ordered to build a temple to Lord Father Jiang Ziya, with Zhang Liang in joint sacrifice on upper-wu days in the second and eighth months.',
  },
  s0617: {
    literal: 'In the fifth month on renxu each of the Five Sacred Peaks received a temple to the Lord Lao.',
    idiomatic: 'In the fifth month, on renxu, each of the Five Peaks gained a temple to Lord Lao.',
  },
  s0618: {
    literal: 'In the sixth month on yiyou a great wind uprooted trees.',
    idiomatic: 'In the sixth month, on yiyou, a gale uprooted trees.',
  },
  s0619: {
    literal: 'In autumn, the eighth month, on xinsi, capital crimes were commuted to exile and penal servitude and below were all remitted.',
    idiomatic: 'In the eighth month, on xinsi, death sentences became exile and lesser penalties were forgiven.',
  },
  s0620: {
    literal: 'In the ninth month on xinwei Tibet sent its chancellor Lun Shangtaluo on court visit.',
    idiomatic: 'In the ninth month, on xinwei, Tibet sent chancellor Lun Shangtaluo to court.',
  },
  s0621: {
    literal: 'In the tenth month of winter on bingshen he went to the Eastern Capital.',
    idiomatic: 'In the tenth month, on bingshen, he traveled to the Eastern Capital.',
  },
  s0622: {
    literal: 'In the eleventh month on bingchen he returned from the Eastern Capital.',
    idiomatic: 'In the eleventh month, on bingchen, he returned from the Eastern Capital.',
  },
  s0623: {
    literal: 'On jiazi Grand Tutor of the Heir Apparent Yuan Qianyao died.',
    idiomatic: 'On jiazi the heir’s grand tutor Yuan Qianyao died.',
  },
  s0624: {
    literal: 'In the twelfth month Zhang Shensu, area commander of Xizhou, was executed for having seized and coerced the censor Yang Wang.',
    idiomatic: 'In the twelfth month Xizhou commander Zhang Shensu was executed for kidnapping and coercing censor Yang Wang.',
  },
  s0625: {
    literal: 'That winter the Luo River within the park was dredged; the work ceased after sixty-odd days.',
    idiomatic: 'That winter the Luo inside the park was dredged for sixty-odd days, then stopped.',
  },
  s0626: {
    literal: 'On wuxu Pei Guangting presented one scroll each of “Past Models from Jade Mountain” and “Former Tracks of the Wall-City”; the emperor ordered a copy given to the crown prince and each prince.',
    idiomatic: 'On wuxu Pei Guangting offered Jade Mountain’s Past Models and the Wall-City’s Former Tracks, one scroll each; the throne gave copies to the heir and every prince.',
  },
  s0627: {
    literal: 'In the first year of Kaiyuan 20, in spring, the first month, on yimao, Li Yi, Prince of Xin’an and Minister of Rites, was ordered to lead troops against the Khitan.',
    idiomatic: 'Early in Kaiyuan 20, on yimao, Prince Xin’an Li Yi, Minister of Rites, was sent to campaign against the Khitan.',
  },
  s0628: {
    literal: 'On dingsi he visited the mansion of Princess Changfen;',
    idiomatic: 'On dingsi he called at Princess Changfen’s residence;',
  },
  s0629: {
    literal: 'On yichou he visited Prince Xue Ye’s mansion: both times he returned to the palace the same day.',
    idiomatic: 'on yichou at Prince Xue Li Ye’s—each visit ended with a same-day return to the palace.',
  },
  s0630: {
    literal: 'On jiwei an edict on civil-service selection: by former precedent the thirtieth day of the third month was the rule, yet the selection gates opened and the “group-A” promotions ran until summer.',
    idiomatic: 'On jiwei an edict fixed civil selection: the old rule had opened on the third month’s last day, with promotions dragging into summer.',
  },
  s0631: {
    literal: 'Henceforth the selection gates were to open within the first month, and group-A lists were to finish within the second.',
    idiomatic: 'Hereafter gates opened in the first month and group-A lists closed in the second.',
  },
  s0632: {
    literal: 'Chancellors were separately ordered to review prisoners held in the capital’s jails.',
    idiomatic: 'Each chancellor was told to review capital prisoners.',
  },
  s0633: {
    literal: 'In the third month Prince Xin’an Li Yi and Youzhou chief administrator Zhao Hanzang routed the Xi and Khitan north of Youzhou.',
    idiomatic: 'In the third month Li Yi and Zhao Hanzang smashed the Xi and Khitan north of Youzhou.',
  },
  s0634: {
    literal: 'In summer, the fourth month, on yihai, he feasted the hundred officials at Shangyang’s eastern islet; the drunk were given bedding and sedan chairs to ride home, one after another along the road.',
    idiomatic: 'On yihai of the fourth month he feasted officials on Shangyang’s eastern islet; drunk guests got bedding and palanquins home in a line along the road.',
  },
  s0635: {
    literal: 'On guisi the Tianjin Bridge was rebuilt, the Huangjin Bridge destroyed, and the two joined into one bridge.',
    idiomatic: 'On guisi Tianjin Bridge was rebuilt, Huangjin Bridge torn down, and the spans united.',
  },
  s0636: {
    literal: 'On guimao tomb visits at Cold Food Festival were to be written into the Five Rites as perpetual statute.',
    idiomatic: 'On guimao Cold Food tomb visits entered the Five Rites as permanent custom.',
  },
  s0637: {
    literal: 'On xinhai Princess Jinxian of the Long Line died.',
    idiomatic: 'On xinhai Princess Jinxian died.',
  },
  s0638: {
    literal: 'On wuchen Prince Xin’an presented Xi and Khitan captives; the emperor received them at the Gate of Answering Heaven.',
    idiomatic: 'On wuchen Li Yi presented Khitan and Xi prisoners; the throne took them at Yingtian Gate.',
  },
  s0639: {
    literal: 'In the sixth month on dingchou Li Jun, Prince Zhong, Grand Protector of the Shanyu Protectorate and Hebei campaign marshal, was made Grand Mentor while keeping the protectorate;',
    idiomatic: 'On dingchou of the sixth month Prince Zhong Li Jun, Shanyu protector and Hebei marshal, became Grand Mentor and kept the protectorate;',
  },
  s0640: {
    literal: 'deputy marshal Prince Xin’an Li Yi was made Grand Guardian Equal in Rank.',
    idiomatic: 'his deputy Li Yi was made Grand Guardian Equal in Rank.',
  },
  s0641: {
    literal: 'On gengyin Youzhou chief administrator Zhao Hanzang was punished for embezzling stores; Left Gate Guards vice-general Yang Yuanfang was punished for receiving Hanzang’s gifts; both were beaten at court, exiled to Rang, and executed on the road.',
    idiomatic: 'On gengyin Zhao Hanzang was flogged and exiled for looting the treasury; Yang Yuanfang for taking his bribes—both died on the road to Rang.',
  },
  s0642: {
    literal: 'That month Fan Anji was sent to broaden the Flower-and-Calyx Pavilion in Chang’an and build a covered corridor to the Lotus Park.',
    idiomatic: 'That month Fan Anji widened the Flower-and-Calyx Tower and linked it by gallery to the Lotus Park.',
  },
  s0643: {
    literal: 'In the seventh month on wuchen he visited Prince Ning Li Xian’s mansion and returned the same day.',
    idiomatic: 'In the seventh month, on wuchen, he visited Prince Ning and returned the same day.',
  },
  s0644: {
    literal: 'On the xinwei new moon of the eighth month there was an eclipse of the sun.',
    idiomatic: 'The eighth-month xinwei new moon brought a solar eclipse.',
  },
  s0645: {
    literal: 'On jimao Minister of Revenue Wang Jun died.',
    idiomatic: 'On jimao Revenue Minister Wang Jun died.',
  },
  s0646: {
    literal: 'On yisi Chancellor Xiao Song and others presented one hundred fifty scrolls of the New Kaiyuan Rites; an edict ordered the offices to put them in use.',
    idiomatic: 'On yisi Xiao Song submitted 150 scrolls of Kaiyuan New Rites; the throne ordered them used.',
  },
  s0647: {
    literal: 'Mohe of Bohai raided Dengzhou and killed prefect Wei Jun; Left Valiant Guards general Gai Fushun was ordered to campaign.',
    idiomatic: 'Bohai Mohe struck Dengzhou, killed Wei Jun, and Gai Fushun was sent against them.',
  },
  s0648: {
    literal: 'In the tenth month of winter on bingxu, wherever the imperial tour passed, talented men not yet known were to be recommended.',
    idiomatic: 'On bingxu of the tenth month, on tour he ordered unknown talent recommended.',
  },
  s0649: {
    literal: 'The Secretariat and Chancellery were also ordered to review and sentence prisoners.',
    idiomatic: 'The Secretariat and Chancellery were told to clear the prisons.',
  },
  s0650: {
    literal: 'On xinmao he reached Feilong Palace in Luzhou; tax relief for three years; conscripts and corvée not yet sent were reassigned to other prefectures.',
    idiomatic: 'On xinmao he reached Luzhou’s Feilong Palace, granted three years’ tax relief, and shifted undrafted levies to other prefectures.',
  },
  s0651: {
    literal: 'On xinchou he reached the Northern Capital.',
    idiomatic: 'On xinchou he arrived at the Northern Capital.',
  },
  s0652: {
    literal: 'On guichou Taiyuan received a partial amnesty and three years’ tax relief.',
    idiomatic: 'On guichou Taiyuan was partially amnestied and given three years’ relief.',
  },
  s0653: {
    literal: 'In the eleventh month on gengwu he sacrificed to Earth at Fenyin; a great amnesty; demoted officials were moved nearer.',
    idiomatic: 'On gengwu he worshipped Earth at Fenyin, amnestied the realm, and moved banished officials closer.',
  },
  s0654: {
    literal: 'Civil and military officers within and without each gained one rank; Kaiyuan merit nobles were all lent purple and scarlet.',
    idiomatic: 'Every officer rose one rank; Kaiyuan merit peers were lent purple and scarlet robes.',
  },
  s0655: {
    literal: 'Great feasting for three days.',
    idiomatic: 'Three days of public feasting were proclaimed.',
  },
  s0656: {
    literal: 'In the twelfth month on renshen he reached the capital.',
    idiomatic: 'In the twelfth month, on renshen, he entered the capital.',
  },
  s0657: {
    literal: 'That year the Revenue Ministry counted 7,861,236 households and 45,431,265 persons.',
    idiomatic: 'The year’s census: 7,861,236 households and 45,431,265 people.',
  },
  s0658: {
    literal: 'In the first year of Kaiyuan 21, in spring, the first month, on the gengzi new moon, an edict ordered every household to keep a copy of the Laozi; examination candidates were to lose two Shangshu and Lunyu questions and gain a Laozi question; on yisi the tablet of Empress Zhaoming the Solemn was moved into the temple and the Yikun shrine destroyed.',
    idiomatic: 'Kaiyuan 21 opened with an order that every home keep the Laozi, exams trade two Confucian questions for one on the Laozi, and on yisi Empress Zhaoming’s tablet entered the temple while Yikun was razed.',
  },
  s0659: {
    literal: 'On dingsi he visited the Hot Springs Palace.',
    idiomatic: 'On dingsi he went to the Hot Springs Palace.',
  },
  s0660: {
    literal: 'On jiwei Minister of Works Li Song was sent as envoy to Tibet.',
    idiomatic: 'On jiwei Li Song of Works went to Tibet.',
  },
  s0661: {
    literal: 'On guihai he returned from the Hot Springs Palace.',
    idiomatic: 'On guihai he came back from the Hot Springs Palace.',
  },
  s0662: {
    literal: 'On yisi Attendant-in-Chief Pei Guangting died.',
    idiomatic: 'On yisi Pei Guangting, Attendant-in-Chief, died.',
  },
  s0663: {
    literal: 'On jiayin Right Vice Director of the Secretariat Han Xiu became Yellow Gate Vice Director and “equal” in the Secretariat-Chancellery council.',
    idiomatic: 'On jiayin Han Xiu joined the council as Yellow Gate Vice Director.',
  },
  s0664: {
    literal: 'In the intercalary month Youzhou deputy commander Guo Yingjie attacked the Khitan and was defeated below Mount Du; Yingjie died.',
    idiomatic: 'In the leap month Guo Yingjie fell to the Khitan at Mount Du.',
  },
  s0665: {
    literal: 'In summer, the fourth month, on dingsi, because of long drought, the crown prince’s junior tutor Lu Xiangxian, Revenue Minister Du Xian, and seven others were sent to the circuits to comfort, relieve, review officials, and clear prisoners.',
    idiomatic: 'On dingsi of the fourth month, after drought, Lu Xiangxian, Du Xian, and five others toured the provinces to relieve, audit, and judge prisoners.',
  },
  s0666: {
    literal: 'On dingyou Prince Ning Li Xian became Grand Commandant; Prince Xue Li Ye became Grand Mentor; Prince Qing Li Tan became Grand Tutor of the Heir; Prince Zhong Li Jun became Grand Guardian Equal in Rank; Prince Di Li Qia became Junior Tutor of the Heir; Prince E Li Juan became Protector of the Heir.',
    idiomatic: 'On dingyou Li Xian became Grand Commandant, Li Ye Grand Mentor, Li Tan the heir’s grand tutor, Li Jun Grand Guardian Equal in Rank, Li Qia junior tutor, Li Juan protector.',
  },
  s0667: {
    literal: 'In the fifth month on jiashen the crown prince took Lady Xue as consort.',
    idiomatic: 'On jiashen the heir married Lady Xue.',
  },
  s0668: {
    literal: 'An edict commuted capital crimes to exile and released those below exile.',
    idiomatic: 'Capital sentences became exile; lesser offenders were freed.',
  },
  s0669: {
    literal: 'Capital civil and military officers each received one merit turn.',
    idiomatic: 'Capital officers gained one merit notch.',
  },
  s0670: {
    literal: 'On the yichou new moon of the seventh month there was an eclipse of the sun.',
    idiomatic: 'The seventh-month yichou new moon brought a solar eclipse.',
  },
  s0671: {
    literal: 'On renyang princes were enfeoffed: Yi as Prince of Ji, Min as Prince of Xin, Ci as Prince of Yi, Cui as Prince of Chen, Cheng as Prince of Feng, Hui as Prince of Heng, Xuan as Prince of Liang, Tao as Prince of Shen.',
    idiomatic: 'On renyang eight princes were enfeoffed—Ji, Xin, Yi, Chen, Feng, Heng, Liang, and Shen among them.',
  },
  s0672: {
    literal: 'In the tenth month of winter on gengxu he visited the Hot Springs Palace.',
    idiomatic: 'On gengxu of the tenth month he went to the Hot Springs Palace.',
  },
  s0673: {
    literal: 'In the eleventh month on wuzi Right Chancellor Song Jing asked to retire on account of age; it was granted.',
    idiomatic: 'On wuzi Song Jing retired for age.',
  },
  s0674: {
    literal: 'In the twelfth month on dingwei Xiao Song, Minister of War and Duke of Xu, became Right Chancellor; Han Xiu became Minister of War; both left the council.',
    idiomatic: 'On dingwei Xiao Song became Right Chancellor and Han Xiu War Minister; both left the council.',
  },
  s0675: {
    literal: 'Jingzhao Intendant Pei Yaoqing became Yellow Gate Vice Director; former Vice Director of the Secretariat Zhang Jiuling was restored; both joined the council.',
    idiomatic: 'Pei Yaoqing and Zhang Jiuling rejoined the council as equals under the Secretariat and Chancellery.',
  },
  s0676: {
    literal: 'That year long rains in Guanzhong ruined the crops; the capital hungered; an edict released two million bushels from the great granary.',
    idiomatic: 'Rains wrecked Guanzhong’s harvest; famine hit the capital; two million bushels left the granary.',
  },
  s0677: {
    literal: 'In the first year of Kaiyuan 22, in spring, the first month, on the guihai new moon, an edict: ancient sage emperors, the Bright Emperor, and the sacred mountains, rivers, and seas were to use livestock; all else was to use wine libations only.',
    idiomatic: 'Kaiyuan 22 began with wine-only offerings save for sage kings, the Bright Emperor, and the great mountains and seas.',
  },
  s0678: {
    literal: 'On jisi he went to the Eastern Capital.',
    idiomatic: 'On jisi he traveled east.',
  },
  s0679: {
    literal: 'On xinwei Grand Treasury Director Yan Tingzhi and Vice Minister of Revenue Pei Kuan were sent to Henan to comfort and relieve.',
    idiomatic: 'On xinwei Yan Tingzhi and Pei Kuan relieved Henan.',
  },
  s0680: {
    literal: 'On yiyou five prefectures—Huai, Wei, Xing, Xiang, and others—lacked grain; Vice Director of the Secretariat Pei Dunfu was sent to inspect and issue seed.',
    idiomatic: 'On yiyou five prefectures needed seed; Pei Dunfu was sent to assess and supply.',
  },
  s0681: {
    literal: 'On jichou he reached the Eastern Capital.',
    idiomatic: 'On jichou he arrived at the Eastern Capital.',
  },
  s0682: {
    literal: 'On renyin Qinzhou was shaken by earthquake; government halls and dwellings were nearly all destroyed; more than forty officials and others were crushed; rumbling continued without cease.',
    idiomatic: 'On renyin Qinzhou quaked; halls and homes collapsed; forty-odd were killed; the ground thundered on and on.',
  },
  s0683: {
    literal: 'Right Chancellor Xiao Song was ordered to sacrifice to mountains and rivers and send envoys to comfort; households of the crushed received one year’s tax relief, or two if three or more in one family died.',
    idiomatic: 'Xiao Song sacrificed and sent relief; crushed families got one year’s remission, two if three died in one house.',
  },
  s0684: {
    literal: 'On xinhai the ten-circuit Investigation and Disposition commissioners were first established.',
    idiomatic: 'On xinhai the ten-circuit investigation commissioners were created.',
  },
  s0685: {
    literal: 'Zhang Guo of Hengzhou was summoned, given Silver Glory Grand Master for Palace Attendance, and styled Master Tongxuan; in the third month the assets of Chang’an merchant Ren Lingfang, more than six hundred thousand strings, were confiscated.',
    idiomatic: 'Zhang Guo the immortal was summoned and styled Master Tongxuan; in the third month Ren Lingfang’s six hundred thousand strings were seized.',
  },
  s0686: {
    literal: 'On renwu he wished to lift the ban on private coinage and sent the high ministers and hundred officials to debate whether it was feasible.',
    idiomatic: 'On renwu he proposed legalizing private minting and ordered a full court debate.',
  },
  s0687: {
    literal: 'The multitude deemed it impossible, and the matter stopped.',
    idiomatic: 'The court said no; the plan died.',
  },
  s0688: {
    literal: 'In the fourth month on yiwei Yixi and Beiting remained frontier commands as before.',
    idiomatic: 'On yiwei Yixi and Beiting stayed frontier commands.',
  },
  s0689: {
    literal: 'The Directorate of the Imperial Ancestral Temple was abolished; the Court of Imperial Sacrifices tended the shrines.',
    idiomatic: 'The ancestral temple office was folded into the Court of Imperial Sacrifices.',
  },
  s0690: {
    literal: 'On gengzi in Tang prefecture a gnomon was set up on the Shengzhou model to measure the sundial shadow’s length.',
    idiomatic: 'On gengzi Tang set a shadow-measuring pole like Shengzhou’s.',
  },
  s0691: {
    literal: 'On yisi an edict on prisoners held in the capital: the Secretariat-Chancellery and the stay-behind were to review and reduce sentences; in the provinces, prefects were responsible.',
    idiomatic: 'On yisi capital prisoners went to the council and stay-behind for review; elsewhere, to prefects.',
  },
  s0692: {
    literal: 'On dingwei a precious tripod was found in the river below Dinghuang Mountain in Meizhou.',
    idiomatic: 'On dingwei Meizhou fishermen found a sacred tripod in the river.',
  },
  s0693: {
    literal: 'On jiayin Protector-General of Beiting Liu Huan plotted rebellion and was executed.',
    idiomatic: 'On jiayin Liu Huan of Beiting rebelled and was killed.',
  },
  s0694: {
    literal: 'In the fifth month on wuzi Pei Yaoqing became Attendant-in-Chief; Zhang Jiuling became Chancellor of the Secretariat; Li Linfu became Minister of Rites and council equal.',
    idiomatic: 'On wuzi Pei Yaoqing became chief attendant, Zhang Jiuling chancellor, Li Linfu joined the council as Rites Minister.',
  },
  s0695: {
    literal: 'In Guanzhong a great wind uprooted trees; Tongzhou suffered worst.',
    idiomatic: 'Guanzhong’s gale uprooted trees; Tongzhou was hit hardest.',
  },
  s0696: {
    literal: 'That summer the emperor himself planted wheat in the park, leading the crown prince and those below to harvest in person, saying to the crown prince and others, “This will be offered to the ancestral temple; therefore I labor with my own hands, and also wish to make you know the difficulty of sowing and reaping.',
    idiomatic: 'That summer he planted wheat in the park and made the heir and younger princes reap with him, telling them, “This grain is for the ancestors—I work so you may feel how hard the fields are.”',
  },
  s0697: {
    literal: '” He then distributed shares to the attendant ministers, saying, “In recent years when men were sent to inspect the crops, their reports were often untrue; therefore I plant myself to watch them ripen;',
    idiomatic: 'Then he gave portions to his courtiers and said, “Year after year the crop inspectors lied; I planted myself to see the truth.”',
  },
  s0698: {
    literal: 'Moreover, does not the Spring and Autumn record wheat and grain—was that not what the ancients prized!',
    idiomatic: 'Did not the Spring and Autumn prize wheat and grain? The ancients weighed them heavily.',
  },
  s0699: {
    literal: '” In the sixth month on yiwei he sent Left Golden Guards General Li Quan to Red Ridge to erect boundary markers with Tibet.',
    idiomatic: 'With that he ended; on sixth-month yiwei he sent Li Quan to mark the border with Tibet at Red Ridge.',
  },
  s0700: {
    literal: 'In the seventh month on jisi Grand Mentor, Prince Xue Li Ye, died and was posthumously styled Crown Prince Hui and Solemn.',
    idiomatic: 'On jisi Prince Xue Li Ye died and was mourned as Crown Prince Hui and Solemn.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/008.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '008') {
  throw new Error(`Expected chapter 008, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')})`);

