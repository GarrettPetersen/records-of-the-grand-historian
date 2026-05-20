#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    '"" (closing quotation mark in the source.)',
    'The edict continued.',
  ],
  s0102: [
    'Fifth month, day renzi: Prince Yu Fuquan was ill, and the Emperor visited him daily for several days.',
    'In the fifth month, on renzi day, Prince Yu Fuquan fell ill; the Emperor attended him day after day.',
  ],
  s0103: [
    'On day guihai, Inner Minister Songgotu was found guilty and detained in the Imperial Clan Court.',
    'On guihai day, Inner Minister Songgotu was imprisoned in the Imperial Clan Court for his crimes.',
  ],
  s0104: [
    'On day jisi, the Emperor made an inspection tour beyond the passes.',
    'On jisi day, the Emperor toured the northern frontier.',
  ],
  s0105: [
    'Sixth month, day xinsi: Prince Gong Changning died; princes were ordered to assemble daily, ten thousand taels of silver were granted, and officials were sent to build the tomb and erect a stele.',
    'In the sixth month, Prince Gong Changning died; princes were ordered to gather daily, ten thousand taels of silver were granted, and officials were sent to build his tomb and stele.',
  ],
  s0106: [
    'On day renyin, Prince Yu Fuquan died; when the Emperor heard of it, he hurried back to the capital day and night.',
    'On renyin day, Prince Yu Fuquan died; hearing the news, the Emperor rushed back to Beijing.',
  ],
  s0107: [
    'Autumn, seventh month, first day of the month on day yisi: the Emperor attended Prince Yu\'s mourning, wept bitterly, and lodged at Jingren Palace, entering by Cangzhen Gate.',
    'On the first of the seventh month, the Emperor attended Prince Yu\'s funeral, wept deeply, and lodged at Jingren Palace by way of Cangzhen Gate.',
  ],
  s0108: [
    'Princes and ministers asked him to return to the Qianqing Palace; the Emperor said: "To lodge in the side hall is to revere and follow the established statutes.',
    'Ministers urged him to return to Qianqing Palace; the Emperor said, "Staying in the side hall honors ancestral precedent.',
  ],
  s0109: [
    '" After residing five days, he ordered the eldest imperial son and others to wear mourning garments, ordered Censor Luo Zhan to build the tomb and erect a stele, and gave the posthumous title Xian.',
    'He remained five days, ordered princes into mourning, had Censor Luo Zhan build the tomb and stele, and conferred the posthumous name Xian.',
  ],
  s0110: [
    'His son Baotai succeeded to the title.',
    'His son Baotai inherited the princedom.',
  ],
  s0111: [
    'On day wushen, because of great rain in Shandong, officials were dispatched to distribute relief by region.',
    'Heavy rains in Shandong prompted regional relief missions on wushen day.',
  ],
  s0112: [
    'On day gengxu, the Emperor made an inspection tour beyond the passes.',
    'On gengxu day, the Emperor again toured the northern frontier.',
  ],
  s0113: [
    'On day jisi, three hundred thousand taels from the treasury were issued, and five hundred thousand shi of grain transport were diverted to relieve Shandong.',
    'The court released three hundred thousand taels and diverted five hundred thousand shi of tribute grain to Shandong.',
  ],
  s0114: [
    'Shandong officials who neglected famine administration had their promotions and transfers suspended.',
    'Shandong officials who failed famine duty were barred from promotion.',
  ],
  s0115: [
    'Eighth month, day guisi: autumn judicial review was suspended for this year.',
    'In the eighth month, autumn executions were halted for the year.',
  ],
  s0116: [
    'Ninth month, day renzi: sacrificial rites and burial honors were granted to the late Vice Ministers Gao Shiqi and Li Dun\'e.',
    'In the ninth month, the late Vice Ministers Gao Shiqi and Li Dun\'e received sacrificial and burial honors.',
  ],
  s0117: [
    'On day jisi, Minister Xierda was ordered to supervise handling of the Red Miao.',
    'On jisi day, Minister Xierda was put in charge of the Red Miao campaign.',
  ],
  s0118: [
    'Winter, tenth month, day guiwei: the Emperor set out on the western tour.',
    'In the tenth month, the western tour began.',
  ],
  s0119: [
    'Supervising secretary Man Pu and censor Gu Su were ordered to travel behind the procession, investigate servants causing trouble, and immediately arrest them.',
    'Man Pu and Gu Su were sent to trail the entourage and arrest any servants who made trouble.',
  ],
  s0120: [
    'On day gengyin, lamas asked to expand the temple at Taozhou Guard; the Emperor said: "To take the people\'s land to enlarge temple buildings harms the people\'s livelihood.',
    'On gengyin day, lamas sought to enlarge the Taozhou temple; the Emperor refused, saying seizing land for temples harmed the people.',
  ],
  s0121: [
    'This is to be permanently forbidden.',
    'Such requests were permanently forbidden.',
  ],
  s0122: [
    '" On day guisi, passing Jingxing, the court halted at Baijing Post Station.',
    'On guisi day the entourage passed Jingxing and stopped at Baijing Post Station.',
  ],
  s0123: [
    'The post station had long lacked springs; at this time well water gushed forth abundantly.',
    'The station had long lacked water; now the wells overflowed.',
  ],
  s0124: [
    'On day dingyou, the court halted at Taiyuan.',
    'On dingyou day, the entourage stopped at Taiyuan.',
  ],
  s0125: [
    'On day wuxu, an edict remitted overdue taxes in Shanxi.',
    'On wuxu day, Shanxi\'s tax arrears were remitted.',
  ],
  s0126: [
    'Commoners gathered before the traveling palace and begged the imperial carriage to stay; the Emperor accordingly stopped one more day.',
    'Locals pleaded before the traveling palace for the Emperor to stay; he granted them another day.',
  ],
  s0127: [
    'Eleventh month, day yisi: the court halted at Hongdong.',
    'In the eleventh month, the entourage stopped at Hongdong.',
  ],
  s0128: [
    'Officials were sent to sacrifice at the tomb of Nüwa.',
    'An officer sacrificed at the tomb of Nüwa.',
  ],
  s0129: [
    'On day renzi, the court crossed the Yellow River and halted at Tong Pass.',
    'On renzi day, the entourage crossed the Yellow River and stopped at Tong Pass.',
  ],
  s0130: [
    'Officials were sent to sacrifice at the Western Peak.',
    'An officer sacrificed at Mount Hua, the Western Peak.',
  ],
  s0131: [
    'White silver was granted to centenarians who welcomed the imperial procession.',
    'Centenarians who greeted the tour received gifts of silver.',
  ],
  s0132: [
    'On day jiayin, the court halted at Weinan.',
    'On jiayin day, the entourage stopped at Weinan.',
  ],
  s0133: [
    'The archery of the Guyuan Green Standard troops was reviewed; Provincial Commander Pan Yulong and those below were granted one rank of promotion.',
    'At Guyuan the Emperor reviewed Green Standard archery and promoted Pan Yulong and his officers one grade.',
  ],
  s0134: [
    'On day bingchen, the Emperor lodged at Xi\'an.',
    'On bingchen day, the Emperor reached Xi\'an.',
  ],
  s0135: [
    'On day dingsi, the archery of the garrison troops was reviewed.',
    'On dingsi day, he reviewed the garrison\'s archery.',
  ],
  s0136: [
    'Officials were sent to sacrifice to King Wen and King Wu of Zhou; the sacrificial documents bore the imperial signature.',
    'Officers sacrificed to the Zhou founders; the memorials carried the imperial name.',
  ],
  s0137: [
    'Officials were sent to offer libations at the tombs of Provincial Commanders Zhang Yong and Liang Huafeng.',
    'Officers made offerings at the tombs of Zhang Yong and Liang Huafeng.',
  ],
  s0138: [
    'On day jiwei, the Emperor held a grand review at Xi\'an and granted the general Boji imperial bows and arrows.',
    'On jiwei day, the Emperor held a grand review at Xi\'an and gave General Boji imperial bows and arrows.',
  ],
  s0139: [
    'A banquet was granted to officers and soldiers.',
    'Officers and soldiers were feasted.',
  ],
  s0140: [
    'Soldiers and civilians gathered before the traveling palace and begged him to stay; the Emperor stayed one day.',
    'Troops and townspeople begged the Emperor to remain; he stayed another day.',
  ],
  s0141: [
    'The reclusive scholar Li Yu of Zhouzhi was granted an imperial plaque reading "Upright in Conduct and Pure in Purpose."',
    'The recluse Li Yu of Zhouzhi received an imperial plaque praising his upright character.',
  ],
  s0142: [
    'Overdue taxes in Shaanxi and Gansu were remitted.',
    'Tax arrears in Shaanxi and Gansu were forgiven.',
  ],
  s0143: [
    'On day guihai, the Emperor returned from the tour.',
    'On guihai day, the western tour ended.',
  ],
  s0144: [
    'On day jisi, the court halted at Shanzhou.',
    'On jisi day, the entourage stopped at Shanzhou.',
  ],
  s0145: [
    'The third imperial son Yinzhi was ordered to go inspect the Three Gates and Dixing Pillars.',
    'The third prince Yinzhi was sent to inspect the Three Gates and Dixing Pillars.',
  ],
  s0146: [
    'Twelfth month, day yihai: the court halted at Xiuwu.',
    'In the twelfth month, the entourage stopped at Xiuwu.',
  ],
  s0147: [
    'The Huaiqing troops were reviewed and found disorderly; regional commander Wang Yingtong was seized and sent to the capital for sentencing to death.',
    'Huaiqing troops proved disorderly; Wang Yingtong was sent to the capital and sentenced to death.',
  ],
  s0148: [
    'On day gengchen, the court halted at Cizhou.',
    'On gengchen day, the entourage stopped at Cizhou.',
  ],
  s0149: [
    'Imperial calligraphy reading "Legacy of Worthy Sages" was hung at the tomb of the ancient sage Zigong.',
    'The Emperor\'s inscription "Legacy of Worthy Sages" was placed at Zigong\'s tomb.',
  ],
  s0150: [
    'On day gengyin, the Emperor returned to the capital.',
    'On gengyin day, the Emperor returned to Beijing.',
  ],
  s0151: [
    'On day xinmao, it was fixed that officials appointed outside the capital must avoid posts within five hundred li of their native place.',
    'On xinmao day, outside appointees were barred from serving within five hundred li of home.',
  ],
  s0152: [
    'Changning\'s son Haishan was enfeoffed as beile.',
    'Changning\'s son Haishan was made a beile.',
  ],
  s0153: [
    'This year, disaster land tax for ninety-one prefectures and counties in Zhili, Jiangnan, Shandong, Henan, Shaanxi, Zhejiang, Huguang, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas across ninety-one districts in several provinces.',
  ],
  s0154: [
    'Korea, Ryukyu, and Annam sent tribute.',
    'Korea, Ryukyu, and Annam paid tribute.',
  ],
  s0155: [
    'Forty-third year, spring, first month, day xinyou: an edict said: "We have inquired into the people\'s afflictions and deeply understand how hard manual labor is.',
    'In the forty-third year, an edict declared that the Emperor had studied the people\'s hardships and knew how grueling their labor was.',
  ],
  s0156: [
    'One who cultivates thirty mu, apart from paying rent and tax, has roughly twenty shi remaining.',
    'A farmer working thirty mu might keep about twenty shi after rent and taxes.',
  ],
  s0157: [
    'Food, clothing, corvée, and levies are drawn from this.',
    'Food, clothing, and corvée all came from that surplus.',
  ],
  s0158: [
    'If fortunate enough to meet an upright official, one may still have a surplus.',
    'With an honest magistrate, a household might still get by.',
  ],
  s0159: [
    'If extortion knows no limit, the people have no means to live.',
    'Endless exactions left the people nothing to live on.',
  ],
  s0160: [
    'Therefore inspecting officials is how the people are secured; the essential lies in senior officials sincerely sympathizing with them."',
    'Sound rule therefore depended on honest oversight—and on governors who truly cared for the people."',
  ],
  s0161: [
    '" On day wuchen, an edict said that when an entire Banner Han Chinese household went on outside appointment, Beijing posts were to be adjusted accordingly.',
    'On wuchen day, an edict ordered that when a whole Han Banner family took outside posts, their Beijing offices be reassigned.',
  ],
  s0162: [
    'On day jisi, the Emperor visited the imperial tombs.',
    'On jisi day, the Emperor paid his respects at the imperial tombs.',
  ],
  s0163: [
    'Second month, day jiaxu: the Huai River deity was enfeoffed as Great God of the Huai, Source of Long Flow, Helper and Acceptor; imperial calligraphy reading "Spirit Estuary, Calm Waves" was hung there.',
    'In the second month, the Huai god received a grand title and an imperial plaque reading "Spirit Estuary, Calm Waves."',
  ],
  s0164: [
    'On day guisi, the Emperor returned to the palace.',
    'On guisi day, the Emperor returned to the palace.',
  ],
  s0165: [
    'Li Jihe was made governor of Jiangxi, and Nengtai governor of Sichuan.',
    'Li Jihe became Jiangxi governor; Nengtai became Sichuan governor.',
  ],
  s0166: [
    'Third month, day xinchou: the Emperor attended the Classics lecture.',
    'In the third month, the Emperor held the Classics lecture.',
  ],
  s0167: [
    'On day jiyou, an edict suspended the summer judicial review.',
    'On jiyou day, the summer judicial review was halted.',
  ],
  s0168: [
    'On day xinyou, Wu Hong was made provincial commander of Gansu.',
    'On xinyou day, Wu Hong became Gansu provincial commander.',
  ],
  s0169: [
    'Starving people of Shandong were given travel funds to return to their native districts.',
    'Shandong famine refugees were given funds to return home.',
  ],
  s0170: [
    'On day bingyin, Wenda was made Minister of Works.',
    'On bingyin day, Wenda became Minister of Works.',
  ],
  s0171: [
    'Summer, fourth month, day guiyou: guard Laxi was ordered to inspect the source of the Yellow River.',
    'In the fourth month, guard Laxi was sent to find the Yellow River\'s source.',
  ],
  s0172: [
    'On day jimao, the Emperor visited Fenji Mountain, then inspected the Yongding and Ziya rivers.',
    'On jimao day, the Emperor visited Fenji Mountain and inspected the Yongding and Ziya rivers.',
  ],
  s0173: [
    'On day bingshen, the Emperor returned to the capital.',
    'On bingshen day, the Emperor returned to Beijing.',
  ],
  s0174: [
    'Fifth month, day xinyou: Yu Zhun was made governor of Guizhou.',
    'In the fifth month, Yu Zhun became Guizhou governor.',
  ],
  s0175: [
    'Sixth month, day yihai: the Emperor made an inspection tour beyond the passes.',
    'In the sixth month, the Emperor toured the northern frontier.',
  ],
  s0176: [
    'Autumn, ninth month, day guimao: an edict said that governors and governors-general who transferred personnel in violation of regulations would be punished.',
    'In the ninth month, an edict threatened punishment for illegal transfers by provincial authorities.',
  ],
  s0177: [
    'Vice Minister Chang Shou induced the surrender of two hundred thirty-seven Guangdong pirates including A Baowei, who were enrolled as soldiers.',
    'Vice Minister Chang Shou persuaded two hundred thirty-seven Guangdong pirates, including A Baowei, to surrender and join the army.',
  ],
  s0178: [
    'On day wuwu, Minister of Justice Wang Shizhen was demoted for a procedural error in release.',
    'On wuwu day, Minister of Justice Wang Shizhen was demoted for mishandling a release.',
  ],
  s0179: [
    'On day guihai, the Emperor returned to the palace.',
    'On guihai day, the Emperor returned to the palace.',
  ],
  s0180: [
    'On day dingmao, guard Laxi, having inspected the river source, returned from Lake Xingxiu and presented a map.',
    'On dingmao day, Laxi returned from Lake Xingxiu with a map of the river\'s source.',
  ],
  s0181: [
    'Winter, tenth month, first day on wuchen: the old river channel at Yangcun was dredged.',
    'On the first of the tenth month, the old channel at Yangcun was dredged.',
  ],
  s0182: [
    'On day jiaxu, an edict remitted next year\'s grain tax for Shuntian and Hejian prefectures and for Shandong and Zhejiang provinces.',
    'On jiaxu day, next year\'s grain tax was forgiven for Shuntian, Hejian, Shandong, and Zhejiang.',
  ],
  s0183: [
    'On day gengchen, Li Zhenyu was made Minister of Rites, Xu Chao Minister of Revenue, Tu Cuizhong Minister of War, Wang Yan Minister of Justice, and Wu Han Censor-in-chief of the Left.',
    'On gengchen day, Li Zhenyu, Xu Chao, Tu Cuizhong, Wang Yan, and Wu Han received new ministerial posts.',
  ],
  s0184: [
    'On day guiwei, domestically made bronze bushels and sheng were issued to the Ministry of Revenue, with orders to promulgate iron versions.',
    'On guiwei day, standard bronze measures were sent to the Ministry of Revenue, with iron copies ordered for general use.',
  ],
  s0185: [
    'On day wuzi, Zhao Hongxie was made governor of Henan.',
    'On wuzi day, Zhao Hongxie became Henan governor.',
  ],
  s0186: [
    'On day jichou, orders were issued to dredge the Fen, Wei, Jia Lu, and other rivers.',
    'On jichou day, the court ordered dredging of the Fen, Wei, Jia Lu, and related rivers.',
  ],
  s0187: [
    'On day xinmao, the Emperor inspected the Yongding River.',
    'On xinmao day, the Emperor inspected the Yongding River.',
  ],
  s0188: [
    'Eleventh month, first day on dingyou: there was a solar eclipse.',
    'On the first of the eleventh month, a solar eclipse occurred.',
  ],
  s0189: [
    'The Emperor returned to the palace.',
    'The Emperor returned to the palace.',
  ],
  s0190: [
    'Because instrument tests did not match the Seven Regulators calendar, officials of the Directorate of Astronomy begged forgiveness and were dismissed.',
    'When observatory instruments disagreed with the official calendar, the Astronomical Bureau officials were dismissed.',
  ],
  s0191: [
    'Bureau director Fei Yanggu was executed in the marketplace for greed.',
    'Bureau director Fei Yanggu was executed for corruption.',
  ],
  s0192: [
    'On day xinhai, regulations were fixed for the Ministry of Personnel\'s selection of district magistrates; governors\' recommendations were suspended.',
    'On xinhai day, rules were set for promoting magistrates through the Ministry of Personnel, ending provincial nominations.',
  ],
  s0193: [
    'On day wuwu, Huguang Governor Liu Dianheng built an Imperial Calligraphy Pavilion; the Emperor rebuked the waste and strictly forbade using construction to seize treasury funds and burden the people.',
    'On wuwu day, Liu Dianheng\'s costly calligraphy pavilion drew imperial rebuke and a ban on wasteful building that drained the treasury and oppressed the people.',
  ],
  s0194: [
    'Sichuan-Shaanxi Governor-General Bo Ji memorialized impeaching Liangzhou regional commander Wei Xun for advanced age; the Emperor said: "Wei Xun had military merit before; troops and people esteem him. Together with Shi Dibin, Mai Liangxi, and Pan Yulong he is an old minister—hard to replace—how can he be impeached?"',
    'Bo Ji urged removing aged Wei Xun as Liangzhou commander; the Emperor refused, praising Wei Xun\'s merit and grouping him with veteran generals too valuable to lose.',
  ],
  s0195: [
    '" On day renxu, an admonition was issued to those compiling the History of Ming to verify public judgment, clarify right and wrong, and complete a trustworthy history.',
    'On renxu day, historians compiling the Ming History were admonished to weigh evidence fairly and write a credible record.',
  ],
  s0196: [
    'Twelfth month, day yiyou: Tianjin regional commander Lan Li asked to establish coastal garrison farming; this was approved.',
    'In the twelfth month, Lan Li\'s proposal for coastal garrison farms near Tianjin was approved.',
  ],
  s0197: [
    'On day jiawu, the Emperor\'s collected poems were bestowed on court ministers.',
    'On jiawu day, the Emperor gave his collected poems to the court.',
  ],
  s0198: [
    'This year, disaster land tax for one hundred nine prefectures and counties in Zhili, Jiangnan, Shandong, Huguang, Guangdong, and other provinces was remitted in varying degrees.',
    'Tax relief was granted for disaster areas across one hundred nine districts in several provinces.',
  ],
  s0199: [
    'Korea sent tribute.',
    'Korea paid tribute.',
  ],
  s0200: [
    'Forty-fourth year, spring, first month, day wuwu: the Guwen Yuanjian was completed and bestowed on court ministers and the official schools.',
    'In the forty-fourth year, the Guwen Yuanjian was finished and distributed to ministers and the official schools.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b02.mjs <translation.json>'
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
