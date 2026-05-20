#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0201: {
    literal: 'The Prince of Guo, Feng, died.',
    idiomatic: 'Prince Feng of Guo died.',
  },
  s0202: {
    literal:
      'In the second year of Shangyuan, spring first month, on jiayin, Mars intruded into the Fang mansion.',
    idiomatic:
      'In the second year of Shangyuan, on jiayin of the first spring month, Mars crossed the Fang asterism.',
  },
  s0203: {
    literal: 'On renxu, the Prince of Zhi Han presented blue-green glass.',
    idiomatic: 'On renxu the Prince of Zhi Han presented blue-green glass.',
  },
  s0204: {
    literal:
      'On bingyin, Khotan was made the Pacified Sands Protectorate; Yuchi Fuzhe Xiong was made Pacified Sands Protector; within its territory ten prefectures were established — because Fuzhe Xiong had merit in attacking Tibet.',
    idiomatic:
      'On bingyin Khotan became the Pacified Sands Protectorate under Yuchi Fuzhe Xiong, its lands divided into ten prefectures in reward for his campaign against Tibet.',
  },
  s0205: {
    literal: 'On gengwu, King Baisuqi of Kucha presented silver poluo bowls.',
    idiomatic: 'On gengwu King Baisuqi of Kucha presented silver poluo bowls.',
  },
  s0206: {
    literal:
      'On xinwei, Tibet sent its minister Lun Tuhunmi to sue for peace; it was not granted.',
    idiomatic:
      'On xinwei Tibet sent the minister Lun Tuhunmi to sue for peace; the court refused.',
  },
  s0207: {
    literal:
      'In the second month, the Silla-route campaigning grand general greatly defeated Silla forces at Sevenfold Fortress, beheading and capturing in great number.',
    idiomatic:
      'In the second month the grand general of the Silla expedition routed Silla at Sevenfold Fortress, taking a great slaughter of heads and captives.',
  },
  s0208: {
    literal: 'Silla sent envoys to court presenting local products and confessing guilt.',
    idiomatic: 'Silla sent envoys to court with tribute and a plea for pardon.',
  },
  s0209: {
    literal: 'They were pardoned, and King Kim Popsin\'s rank and title were restored.',
    idiomatic: 'The court pardoned them and restored King Kim Popsin to his rank and title.',
  },
  s0210: {
    literal: 'In the third month, on dingwei, the sun\'s color was like ochre.',
    idiomatic: 'On dingwei of the third month the sun burned ochre-red.',
  },
  s0211: {
    literal: 'On dingsi, the Empress personally conducted sericulture on the south slope of Mount Mang.',
    idiomatic:
      'On dingsi the Empress performed the spring silkworm rite on the sunny side of Mount Mang.',
  },
  s0212: {
    literal:
      'At this time the Emperor had wind-rash and could not hear court; all government affairs were decided by the Empress.',
    idiomatic:
      'The Emperor was laid low by wind-rash and could not hold court; the Empress decided every affair of state.',
  },
  s0213: {
    literal:
      'From the execution of Shangguan Yi onward, whenever the Emperor attended court the Empress hung a curtain behind the imperial seat; great and small government she heard in advance, and within and without they were called the "Two Sages."',
    idiomatic:
      'After Shangguan Yi was put to death, the Empress sat behind a curtain at every audience while the Emperor held court; nothing large or small was decided without her, and the realm spoke of the "Two Sages."',
  },
  s0214: {
    literal:
      'The Emperor wished to issue an edict ordering the Empress to act as regent of the state; Secretariat Vice Director Hao Chujun remonstrated and stopped it.',
    idiomatic:
      'The Emperor meant to decree that the Empress govern as regent; Hao Chujun, vice director of the Secretariat, remonstrated until he abandoned the plan.',
  },
  s0215: {
    literal:
      'Summer, fourth month: from Kuozhou the two counties Yongjia and Yonggu were separated to establish Wenzhou; from Linhai County were split the two counties Le\'an and Yongning.',
    idiomatic:
      'In the fourth summer month Yongjia and Yonggu were split from Kuozhou to form Wenzhou, and Linhai was divided into Le\'an and Yongning counties.',
  },
  s0216: {
    literal:
      'On xinsi, Consort Zhao, consort of Prince Xian of Zhou, was imprisoned and died for crime.',
    idiomatic:
      'On xinsi Consort Zhao, wife of Prince Xian of Zhou, was confined for her crimes and died in custody.',
  },
  s0217: {
    literal:
      'On jihai, Crown Prince Hong died at the Qiyun Hall of Hebi Palace.',
    idiomatic:
      'On jihai Crown Prince Hong died in the Qiyun Hall at Hebi Palace.',
  },
  s0218: {
    literal:
      'At the time the Emperor was visiting Hebi Palace; that day he returned to the Eastern Capital.',
    idiomatic:
      'The Emperor was at Hebi Palace that day and returned to the Eastern Capital the same evening.',
  },
  s0219: {
    literal:
      'In the fifth month, on jihai, Crown Prince Hong was posthumously titled Emperor Xiaojing.',
    idiomatic:
      'In the fifth month, on jihai, Crown Prince Hong was posthumously honored as Emperor Xiaojing.',
  },
  s0220: {
    literal:
      'In the sixth month, on wuyin, Prince Xian of Yong was made crown prince; great amnesty.',
    idiomatic:
      'In the sixth month, on wuyin, Prince Xian of Yong was made heir apparent and the court proclaimed a general amnesty.',
  },
  s0221: {
    literal:
      'In the seventh autumn month, on xinhai, Gongshi County was re-established in Luozhou to administer Emperor Xiaojing\'s Gong Mausoleum.',
    idiomatic:
      'In the seventh month, on xinhai, Luozhou regained Gongshi County to oversee Emperor Xiaojing\'s mausoleum.',
  },
  s0222: {
    literal:
      'Prince Shangjin of Qi, prefect of Ci, was punished for his offense and settled at Lizhou.',
    idiomatic:
      'Prince Shangjin of Qi, prefect of Ci, was punished for his crimes and exiled to Lizhou.',
  },
  s0223: {
    literal:
      'In the eighth month, on gengzi, Crown Prince Left Senior Mentor, third-grade co-equal with Secretariat and Chancellery, Marquis of Lecheng Liu Rengui became Left Vice Director of the Masters of Writing, still supervising revision of the national history.',
    idiomatic:
      'On gengzi of the eighth month Liu Rengui, Marquis of Lecheng and senior mentor to the heir, became left vice director of the Masters of Writing while continuing to supervise the national history.',
  },
  s0224: {
    literal:
      'Third-grade co-equal with Secretariat and Chancellery, Minister of Justice Zhang Wenqian became Palace Attendant.',
    idiomatic: 'Zhang Wenqian, minister of justice and chief minister, became palace attendant.',
  },
  s0225: {
    literal:
      'Secretariat Vice Director, third-grade co-equal, Marquis of Zhenshan Hao Chujun became Secretariat Director, supervising revision of the national history as before.',
    idiomatic:
      'Hao Chujun, Marquis of Zhenshan and vice director of the Secretariat, was made director while retaining charge of the national history.',
  },
  s0226: {
    literal:
      'Ministry of Personnel Vice Director, acting Crown Prince Left Senior Mentor, supervising revision of the national history Li Jingxuan became Ministry of Personnel Director concurrent Crown Prince Left Senior Mentor, third-grade co-equal with Secretariat and Chancellery, still supervising revision of the national history as before.',
    idiomatic:
      'Li Jingxuan was promoted to minister of personnel and left senior mentor to the heir, joining the chief ministers while still supervising the national history.',
  },
  s0227: {
    literal: 'Left Vice Director Xu Yuanshi became Minister of Revenue.',
    idiomatic: 'Left vice director Xu Yuanshi was appointed minister of revenue.',
  },
  s0228: {
    literal:
      'In the ninth month, on bingwu, the chancellors Liu Rengui, Dai Zhide, Zhang Wenqian, and Hao Chujun all concurrently became crown-prince guests.',
    idiomatic:
      'In the ninth month, on bingwu, Liu Rengui, Dai Zhide, Zhang Wenqian, and Hao Chujun were each named guest to the crown prince.',
  },
  s0229: {
    literal:
      'In the tenth winter month, from Yongzhou the three counties Yingdao, Jianghua, and Tangxing were separated to establish Daozhou.',
    idiomatic:
      'In the tenth month Yingdao, Jianghua, and Tangxing were split from Yongzhou to form Daozhou.',
  },
  s0230: {
    literal:
      'On renwu, a broom star appeared south of the Horn and Neck mansions, five chi in length.',
    idiomatic:
      'On renwu a comet blazed south of the Horn and Neck asterisms, its tail five feet long.',
  },
  s0231: {
    literal: 'In the twelfth month, on dinghai, King Baisuqi of Kucha presented famous horses.',
    idiomatic: 'In the twelfth month, on dinghai, King Baisuqi of Kucha presented fine horses.',
  },
  s0232: {
    literal:
      'In the first year of Yifeng, spring first month, on wuxu, enfeoffment of Prince Lun of Ji was changed to Prince of Xiang.',
    idiomatic:
      'In the first year of Yifeng, on wuxu of the first spring month, Prince Lun of Ji was retitled Prince of Xiang.',
  },
  s0233: {
    literal: 'In the second month, on jiaxu, the Andong Protectorate was moved to Liaodong.',
    idiomatic: 'In the second month, on jiaxu, the Andong Protectorate was transferred to Liaodong.',
  },
  s0234: {
    literal: 'On yihai, the Kirghiz presented famous horses.',
    idiomatic: 'On yihai the Kirghiz presented fine horses.',
  },
  s0235: {
    literal: 'On dinghai, he visited the hot springs of Ruzhou.',
    idiomatic: 'On dinghai the Emperor went to the hot springs at Ruzhou.',
  },
  s0236: {
    literal:
      'In the third month, on guimao, Yellow Gate Vice Director Lai Heng and Secretariat Vice Director Xue Yuanchao both became third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'On guimao of the third month Lai Heng and Xue Yuanchao were each raised to chief ministers of the third grade.',
  },
  s0237: {
    literal: 'On jiachen, the imperial carriage returned to the Eastern Capital.',
    idiomatic: 'On jiachen he returned to the Eastern Capital.',
  },
  s0238: {
    literal:
      'Intercalary third month, on jisi new moon, Tibet invaded Shan, Guo, He, and Fang and other four prefectures.',
    idiomatic:
      'On the jisi new moon of the intercalary third month Tibet raided Shan, Guo, He, and Fang prefectures.',
  },
  s0239: {
    literal:
      'On yiyou, Luozhou governor Prince Xian of Zhou was made commander-in-chief of the Taozhou route, with Minister of Works Liu Shenli and eleven other commanders;',
    idiomatic:
      'On yiyou Prince Xian of Zhou, governor of Luozhou, was named commander-in-chief of the Taozhou expedition, with Liu Shenli, minister of works, and eleven other generals under him;',
  },
  s0240: {
    literal:
      'Bingzhou governor Prince Lun of Xiang was made commander-in-chief of the Liangzhou route, leading Left Guard General Qibi Heli and other armies to attack Tibet.',
    idiomatic:
      'Prince Lun of Xiang, governor of Bingzhou, was made commander of the Liangzhou route with Qibi Heli of the Left Guards and other forces to strike Tibet.',
  },
  s0241: {
    literal: 'Neither prince in the end went.',
    idiomatic: 'Neither prince marched in the end.',
  },
  s0242: {
    literal:
      'On wuwu, an edict ordered that because white paper used for edicts was often worm-eaten, henceforth all offices of the Secretariat, ministries, and prefectures and counties should uniformly use yellow paper.',
    idiomatic:
      'On wuwu an edict ruled that white edict paper rotted too easily with worms; henceforth the Secretariat, ministries, and all prefectures and counties were to use yellow paper.',
  },
  s0243: {
    literal:
      'The offices that received imperial edicts were to prepare scrolls in measured quantity for ready inspection.',
    idiomatic:
      'Offices that received imperial orders were to keep rolled archives on hand for inspection.',
  },
  s0244: {
    literal: 'On gengyin, the imperial carriage returned to the capital.',
    idiomatic: 'On gengyin the Emperor returned to Chang\'an.',
  },
  s0245: {
    literal: 'Summer, fourth month, on wushen, he arrived from the Eastern Capital.',
    idiomatic: 'In the fourth summer month, on wushen, he arrived from the Eastern Capital.',
  },
  s0246: {
    literal:
      'On jiayin, Secretariat Vice Director Li Yiyan became third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'On jiayin Li Yiyan, vice director of the Secretariat, joined the chief ministers of the third grade.',
  },
  s0247: {
    literal: 'On wuwu, he visited Jiucheng Palace.',
    idiomatic: 'On wuwu he went to Jiucheng Palace.',
  },
  s0248: {
    literal:
      'In the sixth month, on guichou, Yellow Gate Vice Director Gao Zhizhou became third-grade co-equal with Secretariat and Chancellery.',
    idiomatic:
      'In the sixth month, on guichou, Gao Zhizhou, vice director of the Chancellery, joined the chief ministers.',
  },
  s0249: {
    literal:
      'In the seventh autumn month, a comet rose in the Eastern Well, pointing at the North River, gradually northeast, three zhang in length, sweeping the Central Terrace, pointing at the Wenchang Palace; after fifty-eight days it was extinguished.',
    idiomatic:
      'In the seventh month a comet rose in the Eastern Well, swept toward the North River and the northeast for three zhang, crossed the Central Terrace toward the Wenchang Palace, and vanished after fifty-eight days.',
  },
  s0250: {
    literal: 'In the eighth month, on yiwei, Tibet invaded Die Prefecture.',
    idiomatic: 'In the eighth month, on yiwei, Tibet raided Die Prefecture.',
  },
  s0251: {
    literal:
      'On gengzi, because of the celestial anomaly, he avoided the main hall, reduced meals, released capital prisoners, and ordered civil and military officials each to submit sealed memorials on gains and losses.',
    idiomatic:
      'On gengzi, troubled by the omen, he left the main hall, cut his table, freed the capital\'s prisoners, and called on every official to submit sealed advice on the state\'s failings.',
  },
  s0252: {
    literal:
      'On renyin, southern selection envoys were established to examine and appoint officials of Guang, Jiao, Qian, and other prefectures.',
    idiomatic:
      'On renyin the court created southern selection envoys to review and fill posts in Guang, Jiao, Qian, and other distant prefectures.',
  },
  s0253: {
    literal:
      'In Qing, Qi, and other prefectures the sea overflowed, and again great rain; five thousand households of drowned residents — envoys were sent to relieve and comfort them.',
    idiomatic:
      'Seas flooded Qing and Qi and other prefectures, and heavy rains drowned five thousand households; the court sent envoys with relief.',
  },
  s0254: {
    literal: 'In the ninth month, on jiazi new moon, the imperial carriage returned to the capital.',
    idiomatic: 'On the jiazi new moon of the ninth month the Emperor returned to Chang\'an.',
  },
  s0255: {
    literal:
      'On bingshen, Prince Su Jie of E had two-thirds of his household registers struck off and was settled at Yuan Prefecture.',
    idiomatic:
      'On bingshen Prince Su Jie of E lost two-thirds of his household quota and was exiled to Yuan Prefecture.',
  },
  s0256: {
    literal: 'On guichou, Jinlin Prefecture was established at the northern capital.',
    idiomatic: 'On guichou the court established Jinlin Prefecture at the northern capital.',
  },
  s0257: {
    literal:
      'In the eleventh month, on dingmao, an edict ordered the newly composed Shangyuan Dance to be used at the round and square altars and in offerings to the Imperial Ancestral Temple; for other sacrifices it was stopped.',
    idiomatic:
      'In the eleventh month, on dingmao, an edict prescribed the new Shangyuan Dance for the round and square altars and the ancestral temple, but not for lesser rites.',
  },
  s0258: {
    literal:
      'On renshen, because Chen Prefecture reported a phoenix seen at Wanqiu, the third year of Shangyuan was changed to the first year of Yifeng; great amnesty.',
    idiomatic:
      'On renshen, after Chen Prefecture reported a phoenix at Wanqiu, the court renamed the third year of Shangyuan the first year of Yifeng and proclaimed a general amnesty.',
  },
  s0259: {
    literal: 'On gengyin, Ministry of Personnel Director Li Jingxuan became Secretariat Director.',
    idiomatic: 'On gengyin Li Jingxuan was appointed director of the Secretariat.',
  },
  s0260: {
    literal:
      'In the twelfth month, on bingshen, Crown Prince Xian presented his annotated Later Han History; thirty thousand bolts of goods were bestowed.',
    idiomatic:
      'In the twelfth month, on bingshen, Crown Prince Xian presented his commentary on the Later Han History and received thirty thousand bolts of gifts.',
  },
  s0261: {
    literal:
      'On wuwu, envoys were dispatched to tour and comfort by separate routes: Chancellor Lai Heng the Henan circuit, Xue Yuanchao the Hebei circuit, Left Vice Director Cui Zhiti and others the Jiangnan circuit.',
    idiomatic:
      'On wuwu the court sent touring commissioners: Lai Heng to Henan, Xue Yuanchao to Hebei, and Cui Zhiti and others to Jiangnan.',
  },
  s0262: {
    literal:
      'In the second year of Yifeng, spring first month, on yihai, the Emperor personally plowed the sacred field at the eastern suburb.',
    idiomatic:
      'In the second year of Yifeng, on yihai of the first spring month, the Emperor performed the plowing rite east of the capital.',
  },
  s0263: {
    literal: 'On gengchen, the capital had an earthquake.',
    idiomatic: 'On gengchen an earthquake struck the capital.',
  },
  s0264: {
    literal: 'On renchen, he visited Sizhu Garden; that day he returned to the palace.',
    idiomatic: 'On renchen he visited Sizhu Garden and returned to the palace the same day.',
  },
  s0265: {
    literal:
      'In the second month, on dingsi, Minister of Works Gao Zang was appointed Liaodong governor, enfeoffed as Prince of Korea, sent back to the Andong headquarters to settle the remaining Goguryeo people;',
    idiomatic:
      'On dingsi of the second month Gao Zang, minister of works, was made governor of Liaodong and Prince of Korea and sent back to Andong to pacify the remaining Goguryeo people;',
  },
  s0266: {
    literal:
      'Minister of Agriculture Fuyu Long was made Xiongjin Prefecture governor, enfeoffed as Prince of Daifang, ordered to go settle the remaining Baekje people.',
    idiomatic:
      'Fuyu Long, minister of agriculture, was made governor of Xiongjin and Prince of Daifang and sent to pacify the remaining Baekje people.',
  },
  s0267: {
    literal:
      'The Andong Protectorate was again moved to Xincheng to command them.',
    idiomatic: 'The Andong Protectorate was moved again to Xincheng to oversee them both.',
  },
  s0268: {
    literal:
      'In the fourth summer month, because Henan and Hebei suffered drought, envoys were sent to relieve and grant.',
    idiomatic:
      'In the fourth month drought struck Henan and Hebei, and the court sent relief commissioners.',
  },
  s0269: {
    literal:
      'In the eighth month, enfeoffment of Prince Xian of Zhou was changed to Prince of Ying; his name was changed to Zhe.',
    idiomatic:
      'In the eighth month Prince Xian of Zhou was retitled Prince of Ying and renamed Zhe.',
  },
  s0270: {
    literal: 'On yisi, the Great White Star intruded into Xuanyuan.',
    idiomatic: 'On yisi Venus crossed the Xuanyuan asterism.',
  },
  s0271: {
    literal:
      'In the twelfth month, on yimao, an edict ordered Guannei and Hedong prefectures to recruit the brave to attack Tibet.',
    idiomatic:
      'In the twelfth month, on yimao, an edict called on Guannei and Hedong to recruit bold men for the Tibetan campaign.',
  },
  s0272: {
    literal:
      'An edict ordered capital civil and military officials of third grade and above each year to recommend one person of civil and military talent fit to be general, governor, or prefect.',
    idiomatic:
      'Another edict required every capital official of the third rank or higher to nominate one man each year fit for command or provincial office.',
  },
  s0273: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter brought no snow.',
  },
  s0274: {
    literal:
      'In the third year of Yifeng, fourth month, on dinghai new moon, because of drought he avoided the main hall, personally recorded prisoners, and pardoned them all.',
    idiomatic:
      'In the third year of Yifeng, on the dinghai new moon of the fourth month, drought drove him from the main hall; he personally reviewed the prisoners and freed them all.',
  },
  s0275: {
    literal:
      'On wushen, great amnesty; the first day of the first month of the coming year was changed to Tongqian.',
    idiomatic:
      'On wushen the court proclaimed a general amnesty and renamed the coming New Year\'s day Tongqian.',
  },
  s0276: {
    literal:
      'On guichou, Jing Prefecture presented two small children, conjoined at the heart with separate bodies, four years old.',
    idiomatic:
      'On guichou Jing Prefecture presented twin boys, four years old, joined at the heart with separate bodies.',
  },
  s0277: {
    literal: 'In the fifth month, on renxu, he visited Jiucheng Palace.',
    idiomatic: 'In the fifth month, on renxu, he went to Jiucheng Palace.',
  },
  s0278: {
    literal: 'Prince Lun of Xiang was made Luozhou governor.',
    idiomatic: 'Prince Lun of Xiang was appointed governor of Luozhou.',
  },
  s0279: {
    literal:
      'In the seventh autumn month, on dingsi, he feasted close ministers and various kin at Xianheng Hall.',
    idiomatic:
      'In the seventh month, on dingsi, he gave a feast for close ministers and kinsmen in Xianheng Hall.',
  },
  s0280: {
    literal:
      'The Emperor said to Prince Yuangui of Huo: "Last winter there was no snow; this spring little rain. Since I came to escape the heat at this palace, sweet rains have fallen in succession, summer wheat has ripened richly, and autumn crops flourish.',
    idiomatic:
      'The Emperor said to Prince Yuangui of Huo: "Last winter brought no snow, and this spring scarce rain. Yet since I withdrew to this palace for the heat, gentle rains have come again and again, summer wheat stands heavy in the ear, and the autumn fields grow lush.',
  },
  s0281: {
    literal:
      'I have also received Jingxuan\'s memorial reporting that Tibet entered Longzhi; Zhang Qianxu fought them, two battles in one day, beheading and capturing in extreme number.',
    idiomatic:
      'I have Jingxuan\'s report as well: Tibet crossed into Longzhi, and Zhang Qianxu met them twice in a single day, taking heads beyond count.',
  },
  s0282: {
    literal:
      'Again the Grand Astrologer reported that on the first of the seventh month the sun should have suffered eclipse but did not.',
    idiomatic:
      'The Grand Astrologer also tells me that at the seventh-month new moon the sun should have been eclipsed, yet the sky spared it.',
  },
  s0283: {
    literal:
      'This is surely Heaven bending down its protection, the altars of state sending down numen — how could my slight virtue bring this about!"',
    idiomatic:
      'Surely Heaven bends its favor upon us and the ancestral altars breathe their blessing — no meager virtue of mine could earn such grace!"',
  },
  s0284: {
    literal:
      '"Also my son Lun is youngest and especially beloved; lately in choosing a new wife for him, many did not suit his heart;',
    idiomatic:
      '"Lun is my youngest boy and the one I keep closest; we have sought a bride for him again and again, yet few pleased him.',
  },
  s0285: {
    literal:
      'recently he took the daughter of Liu Yanjing; seeing her extreme filial conduct, this is again a private joy in my heart.',
    idiomatic:
      'He has lately taken Liu Yanjing\'s daughter, and in her deep filial bearing I have found a private joy.',
  },
  s0286: {
    literal:
      'I wish to share this joy with you uncles alike; each of you should drink to the full."',
    idiomatic:
      'I would have my uncles share this gladness with me — tonight, let every cup be drained."',
  },
  s0287: {
    literal:
      'The Emperor thereupon composed a heptasyllabic poem in the Baliang style, and the attendant ministers harmonized in turn.',
    idiomatic:
      'The Emperor then improvised a heptasyllabic poem in the Baliang manner, and each minister answered in turn.',
  },
  s0288: {
    literal: 'In the ninth month, on dingsi, he returned to the capital.',
    idiomatic: 'In the ninth month, on dingsi, he returned to Chang\'an.',
  },
  s0289: {
    literal: 'On xinyou, he arrived from Jiucheng Palace.',
    idiomatic: 'On xinyou he came back from Jiucheng Palace.',
  },
  s0290: {
    literal: 'On bingyin, Palace Attendant Zhang Wenqian died.',
    idiomatic: 'On bingyin Zhang Wenqian, palace attendant, died.',
  },
  s0291: {
    literal:
      'On bingyin, Taozhou-route campaigning grand general Secretariat Director Li Jingxuan, Left Guard Grand General Liu Shenli, and others fought Tibet on the Qinghai; the royal army was defeated, and Shenli was captured.',
    idiomatic:
      'On bingyin Li Jingxuan, director of the Secretariat and commander of the Taozhou expedition, and Liu Shenli, grand general of the Left Guards, met Tibet on the Qinghai and were routed; Shenli was taken prisoner.',
  },
  s0292: {
    literal:
      'Because Tibetan raids were a worry, the Emperor asked the attendant ministers and Secretariat Drafting Officer Guo Zhengyi and others for plans; all held that deep defense on the frontier without eager pursuit was the superior policy.',
    idiomatic:
      'Troubled by Tibetan raids, the Emperor asked his ministers and Guo Zhengyi of the Secretariat drafting office for counsel; all urged strong border defense rather than reckless pursuit.',
  },
  s0293: {
    literal: 'In the tenth month, on bingwu, Xuzhou prefect Prince Yuanxiao of Mi died.',
    idiomatic: 'In the tenth month, on bingwu, Prince Yuanxiao of Mi, prefect of Xuzhou, died.',
  },
  s0294: {
    literal: 'Intercalary tenth month, on wuyin, Mars intruded into Gouchen.',
    idiomatic: 'On wuyin of the intercalary tenth month Mars crossed Gouchen.',
  },
  s0295: {
    literal:
      'In the eleventh month, on yiwei, murky fog closed in on four sides and did not lift all night.',
    idiomatic:
      'In the eleventh month, on yiwei, thick fog walled the horizon and did not lift all night.',
  },
  s0296: {
    literal: 'On bingshen, rain froze on the trees.',
    idiomatic: 'On bingshen glaze ice sheathed the trees.',
  },
  s0297: {
    literal:
      'On renzi, Yellow Gate Vice Director, third-grade co-equal with Secretariat and Chancellery Lai Heng died.',
    idiomatic: 'On renzi Lai Heng, vice director of the Chancellery and chief minister, died.',
  },
  s0298: {
    literal:
      'In the twelfth month, an edict stopped the coming year\'s era name Tongqian, because the reversed phrasing was ill-omened.',
    idiomatic:
      'In the twelfth month an edict canceled the Tongqian era name for the coming year, since read backward its words were unlucky.',
  },
  s0299: {
    literal:
      'In the first year of Tiaolu, first month, on xinwei, Minister of Revenue, Duke of Ping\'en Xu Yuanshi died.',
    idiomatic:
      'In the first year of Tiaolu, on xinwei of the first month, Xu Yuanshi, Duke of Ping\'en and minister of revenue, died.',
  },
  s0300: {
    literal: 'On jiyou, he visited the Eastern Capital.',
    idiomatic: 'On jiyou he went to the Eastern Capital.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/005.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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

  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '005') {
  throw new Error(`Expected chapter 005, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);
const hasAll =
  trans.sentences.length === END - START + 1 &&
  trans.sentences.every((s) => expectedIds.has(s.originalId || s.id));

if (!hasAll) {
  trans = {
    metadata: {
      book: 'jiutangshu',
      chapter: '005',
      file: chapterPath,
    },
    sentences: extractRange(chapterPath, START, END),
  };
}

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

const missing = [...expectedIds].filter(
  (id) => !trans.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log('Applied', applied, 'translations (s0201–s0300)');
