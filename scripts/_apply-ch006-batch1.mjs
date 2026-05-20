#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Suishu ch.006, Rites treatise 1) */
import { readFileSync, writeFileSync } from 'fs';

const transPath = 'translations/current_translation_suishu.json';

const T = {
  s0001: {
    literal: 'In the age of Tang and Yu, those who sacrificed to Heaven constituted the rites of Heaven; those who sacrificed to Earth constituted the rites of Earth; those who sacrificed in the ancestral temples constituted the rites of Man.',
    idiomatic: 'In the age of Tang and Yu, sacrifices to Heaven were classified as rites of Heaven, sacrifices to Earth as rites of Earth, and sacrifices in the ancestral temples as rites of Man.',
  },
  s0002: {
    literal: 'Therefore the Book says: "Appoint Bo Yi to preside over my Three Rites," by which to bind together Heaven and Earth, weave yin and yang, distinguish the hidden and profound and penetrate the subtle and deep, communicate with the hundred spirits and regulate the myriad affairs.',
    idiomatic: 'The Book therefore records the command to appoint Bo Yi to oversee the Three Rites—the means by which to embrace Heaven and Earth, align yin and yang, discern what is hidden and profound, commune with the hundred spirits, and regulate the myriad affairs of state.',
  },
  s0003: {
    literal: 'Yin followed Xia, with additions and subtractions; reverently transmitting instructions on the side, to encourage the living people.',
    idiomatic: 'The Yin dynasty adopted Xia ritual practice with modifications, handing down reverent instruction to guide the people.',
  },
  s0004: {
    literal: 'Shang Xin was without the Way; elegant regulations were lost and extinguished.',
    idiomatic: 'King Zhou of Shang was devoid of virtue, and the refined ritual codes were destroyed.',
  },
  s0005: {
    literal: 'The Duke of Zhou rescued disorder, broadly established this culture: with auspicious rites to honor spirits and ghosts, with inauspicious rites to mourn the state, with guest rites to draw near guests, with military rites to punish the irreverent, with celebratory rites to unite marriages—called the Five Rites.',
    idiomatic: 'The Duke of Zhou restored order amid chaos and broadly codified ritual culture: auspicious rites to honor spirits and the dead, inauspicious rites to mourn for the state, guest rites to welcome visitors, military rites to punish the irreverent, and celebratory rites to sanction marriage—all together called the Five Rites.',
  },
  s0006: {
    literal: 'Therefore it is said, "The ritual canon has three hundred sections and the ceremonial forms three thousand—none enters the inner chamber except by way of the door."',
    idiomatic: 'Hence the saying: "The ritual canon comprises three hundred sections and ceremonial forms three thousand—and no one enters the inner chamber except through the door."',
  },
  s0007: {
    literal: 'Cheng and Kang followed this, and punishments were set aside unused.',
    idiomatic: 'Kings Cheng and Kang upheld these rites, and punishments fell into disuse.',
  },
  s0008: {
    literal: 'From the time the Quan Rong assassinated the queen and Zhou was moved and weakened, rites were lost and music declined; customs withered and morals decayed.',
    idiomatic: 'After the Quan Rong killed the queen and the Zhou court was relocated and enfeebled, ritual was lost and music faded; customs declined and morals decayed.',
  },
  s0009: {
    literal: 'Confucius, attending as guest at the year-end sacrifice, sighed and said: "Qiu has a purpose here. Yu, Tang, Wen, Wu, King Cheng, and the Duke of Zhou—none failed to be scrupulous in ritual."',
    idiomatic: 'Confucius, present as a guest at the year-end la sacrifice, sighed and said: "I have a purpose in this. Yu, Tang, King Wen, King Wu, King Cheng, and the Duke of Zhou—none ever neglected ritual propriety."',
  },
  s0010: {
    literal: '" Thereupon he compiled rites and revived music, wishing to rescue the ills of the age.',
    idiomatic: 'He then compiled the rites and revived music, seeking to remedy the disorders of the age.',
  },
  s0011: {
    literal: 'The ruler cast it aside and paid no heed; the Way was obstructed and did not prevail.',
    idiomatic: 'The ruler ignored him, and the Way was blocked and could not be put into practice.',
  },
  s0012: {
    literal: 'Therefore states that perish, families that are ruined, and men who die—all first abandon their rites.',
    idiomatic: 'Thus doomed states, ruined houses, and lost lives all begin by abandoning ritual.',
  },
  s0013: {
    literal: 'Duke Zhao married Mengzi and concealed her surname; Marquis Yang stole a woman\'s beauty and harmed a man.',
    idiomatic: 'Duke Zhao married Mengzi while concealing her surname; the Marquis of Yang seized another man\'s wife and killed him.',
  },
  s0014: {
    literal: 'Therefore it is said: when the rites of marriage are abandoned, then licentious and depraved offenses multiply.',
    idiomatic: 'Hence the saying: when marriage rites are abandoned, licentious and depraved crimes multiply.',
  },
  s0015: {
    literal: 'Drinking together in groups and indulging in dissipation, not knowing the warning—when the rites of the district drinking ceremony are abandoned, then lawsuits of contention and fighting become numerous.',
    idiomatic: 'When men drink together in unruly groups and know no restraint, and the district drinking rites are abandoned, lawsuits over brawling multiply.',
  },
  s0016: {
    literal: 'The Marquis of Lu reversed the sacrifices of the five temples; the Han emperor abolished the three-year mourning—when the rites of mourning and sacrifice are abandoned, then the bond of flesh and blood grows thin.',
    idiomatic: 'The ruler of Lu reversed the sacrifices of the five ancestral temples; a Han emperor abolished three-year mourning—when mourning and sacrificial rites are abandoned, kinship ties grow thin.',
  },
  s0017: {
    literal: 'Feudal lords descended from the hall before the Son of Heaven; the Five Hegemons summoned the ruler to Heyang—when the rites of court audience and diplomatic visits are abandoned, then the first steps toward encroachment arise.',
    idiomatic: 'When feudal lords stepped down from the hall before the Son of Heaven, and the Five Hegemons summoned a ruler to Heyang—when audience and diplomatic rites were abandoned, the first steps toward usurpation began.',
  },
  s0018: {
    literal: 'The Qin clan, by the prestige of victory in war, swallowed the nine states, fully collected their ceremonial rites, and brought them to Xianyang.',
    idiomatic: 'The Qin, wielding the prestige of military victory, annexed the nine states, seized their entire ritual corpus, and brought it to Xianyang.',
  },
  s0019: {
    literal: 'They only adopted what honored the ruler and restrained ministers, to serve the needs of the time.',
    idiomatic: 'They adopted only what exalted the ruler and subordinated ministers, for immediate political use.',
  },
  s0020: {
    literal: 'As for yielding and deference arising from one\'s gait, loyalty and filial piety formed in movement and stillness—flowers and leaves were not raised; great and small were alike cast aside.',
    idiomatic: 'As for the courtesy of yielding in one\'s step, or loyalty and filial piety embodied in every motion—none of it was preserved; great and small alike were discarded.',
  },
  s0021: {
    literal: 'Like straw dogs abandoned on the road, like ceremonial caps worn in Yue—the forest of Confucian learning was exhausted, and the Book of Songs and Documents became smoke.',
    idiomatic: 'It was like straw dogs cast aside on the road, like ceremonial caps worn in the land of Yue—the Confucian tradition was extinguished, and the classics were reduced to ashes.',
  },
  s0022: {
    literal: 'After Emperor Gaozu of Han had pacified the Qin disorder, first executed Xiang Yu, and rewarded the founding meritorious, he had no leisure for court ritual.',
    idiomatic: 'After Emperor Gaozu of Han quelled the Qin rebellion, executed Xiang Yu, and rewarded his founding ministers, he had no time to establish court ceremony.',
  },
  s0023: {
    literal: 'Ministers drinking wine disputed merit; some drew swords and struck the pillars—the High Ancestor was troubled by this.',
    idiomatic: 'His ministers quarreled over credit while drinking; some drew swords and struck the pillars. Gaozu was deeply troubled.',
  },
  s0024: {
    literal: 'Shusun Tong said: "Confucians are hard to advance with for achievement, but can be relied on for preserving what has been won."',
    idiomatic: 'Shusun Tong said: "Confucian scholars are poor partners for conquest, but excellent for preserving what has been won."',
  },
  s0025: {
    literal: '" Thereupon he requested to establish court ceremony and was granted permission, yet still saying, "Make it according to what I can perform."',
    idiomatic: 'He then asked to establish court ceremony and was permitted—but only on the condition that it be scaled to what Gaozu could actually perform.',
  },
  s0026: {
    literal: 'After slight practice in ritual deportment, all knew to follow the proper track.',
    idiomatic: 'After brief instruction in ritual deportment, everyone knew to follow proper form.',
  },
  s0027: {
    literal: 'If he had traced back to Wen and Wu and taken the Book of Songs and Documents as his model, it was truly because he had no leisure—and feared it himself.',
    idiomatic: 'Had he sought to follow the example of Kings Wen and Wu and take the classics as his charter, he truly lacked the time—and feared he could not measure up.',
  },
  s0028: {
    literal: 'Emperor Wu established canonical institutions yet loved esoteric arts; as for sacrifices to spirits and ghosts, they drifted without returning.',
    idiomatic: 'Emperor Wu revived canonical institutions yet dabbled in esoteric arts; sacrifices to spirits and ghosts wandered far from orthodox practice.',
  },
  s0029: {
    literal: 'The Founding Emperor restored the dynasty; Emperor Ming succeeded to the throne: they sacrificed at the Bright Hall, donned caps and regalia, ascended the Spirit Terrace, and observed cloud omens—obtaining the timely institutions, the common people rejoiced.',
    idiomatic: 'The Founding Emperor restored the Han; Emperor Ming took the throne: they sacrificed at the Bright Hall, donned ceremonial caps, ascended the Spirit Terrace, and observed celestial signs—restoring timely institutions to the people\'s delight.',
  },
  s0030: {
    literal: 'Yet the court\'s statutes and regulations were of long standing; some were obtained in ages of peace and prosperity, some lost in years of famine and disaster—and generations distant, customs errant and confused.',
    idiomatic: 'Yet the court\'s statutes were ancient; some were preserved in ages of peace, others lost in years of famine—and over distant generations, custom grew corrupt and confused.',
  },
  s0031: {
    literal: 'Human sentiment must exist and will shift the meaning of ritual—therefore Yin and Zhou differed in track, and Qin and Han changed course here.',
    idiomatic: 'Human sentiment inevitably shifts the meaning of ritual—hence Yin and Zhou followed different paths, and Qin and Han changed course.',
  },
  s0032: {
    literal: 'As for enhancing customs and broadly planting dikes and barriers—if not the majesty of ritual, what else could be honored!',
    idiomatic: 'As for enhancing custom and erecting broad moral bulwarks—if not the majesty of ritual, what could surpass it!',
  },
  s0033: {
    literal: 'It is like the mountain spirits having Song and Dai, the sea lord having the vast ocean—adorned with a speck of dust, it does not bring failure.',
    idiomatic: 'As Mount Song and Mount Tai belong to the mountain spirits, and the vast ocean to the sea lord—a speck of adornment cannot mar their grandeur.',
  },
  s0034: {
    literal: 'Gaotang Sheng, in the transmitted Scholar\'s Rites also called "ceremony," broadly clarified human sentiment and adorned conduct.',
    idiomatic: 'Gaotang Sheng, in the transmitted Scholar\'s Rites also called Yili, broadly clarified human sentiment and adorned proper conduct.',
  },
  s0035: {
    literal: 'Down from the Western Capital, they were used as mutual standards; all were praised as the beauty of the age, each with its own rules of interchange.',
    idiomatic: 'From the Western Capital onward, these were used as mutual standards; all were praised as the finest ritual of their age, each with its own rules of courtly interchange.',
  },
  s0036: {
    literal: 'The detailed fixing of court ceremony in Huangchu, the removal of excess errors in Taishi— these the Book of Song sets forth in full.',
    idiomatic: 'The detailed codification of court ceremony under Huangchu and the elimination of ritual errors under Taishi—the Book of Song treats these fully.',
  },
  s0037: {
    literal: 'Emperor Wu of Liang first commanded the Confucian scholars to compile the great canon.',
    idiomatic: 'Emperor Wu of Liang first ordered Confucian scholars to compile the great ritual canon.',
  },
  s0038: {
    literal: 'For auspicious rites, Ming Shanbin; for inauspicious rites, Yan Zhizhi; for military rites, Lu Lian; for guest rites, He Yang; for celebratory rites, Sima Jiong.',
    idiomatic: 'For auspicious rites he assigned Ming Shanbin; for inauspicious rites, Yan Zhizhi; for military rites, Lu Lian; for guest rites, He Yang; for celebratory rites, Sima Jiong.',
  },
  s0039: {
    literal: 'The Emperor also commanded Shen Yue, Zhou She, Xu Mian, He Tongzhi, and others—all participated in detailed deliberation.',
    idiomatic: 'The emperor also assigned Shen Yue, Zhou She, Xu Mian, He Tongzhi, and others to join in the detailed review.',
  },
  s0040: {
    literal: 'Emperor Wu of Chen, having conquered and pacified Jianye, largely followed Liang precedent; he still decreed that Left Assistant Director of the Secretariat Jiang Dezao, Attendant Outside the Casual Rider Regular Palace Attendant Shen Zhu, Erudite Shen Wena, Secretariat Drafting Attendant Liu Shizhi, and others, according to circumstances in performance, should adopt or discard as the occasion required.',
    idiomatic: 'Emperor Wu of Chen, after conquering Jianye, largely followed Liang precedent; he further ordered Jiang Dezao, Shen Zhu, Shen Wena, Liu Shizhi, and others to adapt ritual practice as circumstances required.',
  },
  s0041: {
    literal: 'In Later Qi: Left Vice Director Yang Xiuzhi, Director of the Department of Revenue Yuan Xiubo, Director of the Court of State Ceremonial Wang Xi, Erudite of the Imperial Academy Xiong Ansheng; in Zhou: Su Chuo, Lu Bian, Yuwen Kai—all versed in ceremonial rites—jointly deliberated on state institutions for contemporary use.',
    idiomatic: 'In Northern Qi, Yang Xiuzhi, Yuan Xiubo, Wang Xi, and Xiong Ansheng; in Northern Zhou, Su Chuo, Lu Bian, and Yuwen Kai—all masters of ceremonial rites—jointly deliberated state ritual for contemporary use.',
  },
  s0042: {
    literal: 'Emperor Gaozu commanded Niu Hong, Xin Yanzhi, and others to collect Liang and Northern Qi ritual regulations, forming the Five Rites.',
    idiomatic: 'Emperor Gaozu ordered Niu Hong, Xin Yanzhi, and others to compile Liang and Northern Qi ritual regulations into the Five Rites.',
  },
  s0043: {
    literal: 'The Rites say: "The myriad things root in Heaven; man roots in the ancestor—therefore he is paired with the Supreme Lord."',
    idiomatic: 'The Rites state: "The myriad things root in Heaven; man roots in the ancestor—therefore the ancestor is paired with the Supreme Lord."',
  },
  s0044: {
    literal: '" The people of Qin swept away the Six Classics into embers and ash; the rites of sacrificing to Heaven were mutilated and incomplete, and Confucians each held to what they had seen and made meanings accordingly.',
    idiomatic: 'The Qin burned the Six Classics to ashes; rites for sacrificing to Heaven were shattered, and each Confucian school defended its own interpretation.',
  },
  s0045: {
    literal: 'One view: the number of sacrifices to Heaven—through the year there are nine; the number of sacrifices to Earth—through the year there are two; Round Mound and Square Marsh, once every three years.',
    idiomatic: 'One view holds: sacrifices to Heaven number nine in a year; sacrifices to Earth, two; the Round Mound and Square Marsh rites are performed once every three years.',
  },
  s0046: {
    literal: 'In years of Round Mound and Square Marsh, sacrifices to Heaven are nine and sacrifices to Earth are two.',
    idiomatic: 'In years when the Round Mound and Square Marsh rites are performed, sacrifices to Heaven total nine and sacrifices to Earth, two.',
  },
  s0047: {
    literal: 'If Heaven does not include the Round Mound sacrifice, through the year there are eight.',
    idiomatic: 'If the Round Mound rite is not included, sacrifices to Heaven total eight for the year.',
  },
  s0048: {
    literal: 'If Earth does not include the Square Marsh sacrifice, through the year there is one.',
    idiomatic: 'If the Square Marsh rite is not included, sacrifices to Earth total one for the year.',
  },
  s0049: {
    literal: 'This is what the Zheng school honors.',
    idiomatic: 'This is the position honored by the Zheng school.',
  },
  s0050: {
    literal: 'One view: there is only August Heaven; there are no Five Essence Emperors.',
    idiomatic: 'Another view: there is only August Heaven; there are no Five Essence Emperors.',
  },
  s0051: {
    literal: 'Yet Heaven is sacrificed to twice in a year, and the altar positions are unique.',
    idiomatic: 'Yet Heaven receives two sacrifices per year, at a single altar.',
  },
  s0052: {
    literal: 'The Round Mound sacrifice is the Southern Suburb; the Southern Suburb sacrifice is the Round Mound.',
    idiomatic: 'The Round Mound sacrifice is the Southern Suburb rite; the Southern Suburb rite is the Round Mound sacrifice.',
  },
  s0053: {
    literal: 'At the winter solstice, upon it Heaven is sacrificed to; in spring there is again one sacrifice, to pray for agricultural affairs—called the two sacrifices, with no separate Heaven.',
    idiomatic: 'At the winter solstice Heaven is sacrificed to upon it; in spring a second sacrifice prays for the harvest—these two sacrifices, with no distinction of separate Heavens.',
  },
  s0054: {
    literal: 'The five seasonal receptions of qi are all sacrifices to the Human Emperors of the Five Phases, such as Taihao— not sacrifices to Heaven.',
    idiomatic: 'The five seasonal qi-reception rites all sacrifice to the Human Emperors of the Five Phases, such as Taihao—they are not sacrifices to Heaven.',
  },
  s0055: {
    literal: 'Heaven is called August Heaven, also called Supreme Lord, also simply called Lord.',
    idiomatic: 'Heaven is called August Heaven, also Supreme Lord, also simply Lord.',
  },
  s0056: {
    literal: 'The Human Emperors of the Five Phases may also be called Supreme Lord, but may not be called Heaven.',
    idiomatic: 'The Human Emperors of the Five Phases may also be styled Supreme Lord, but may not be called Heaven.',
  },
  s0057: {
    literal: 'Therefore the five seasonal qi-receptions and the paired sacrifices to Wen and Wu at the Bright Hall are all sacrifices to Human Emperors, not sacrifices to Heaven.',
    idiomatic: 'Therefore the five seasonal qi-receptions and the paired sacrifices to Kings Wen and Wu at the Bright Hall are all sacrifices to Human Emperors, not to Heaven.',
  },
  s0058: {
    literal: 'This is what the Wang school honors.',
    idiomatic: 'This is the position honored by the Wang school.',
  },
  s0059: {
    literal: 'From Liang and Chen down to Sui, debaters each honored their own masters—therefore suburban and mound rites mutually changed.',
    idiomatic: 'From Liang and Chen down to Sui, each faction followed its own master—hence the suburban and mound rites underwent repeated change.',
  },
  s0060: {
    literal: 'Liang\'s Southern Suburb: a round altar, south of the capital.',
    idiomatic: 'The Liang Southern Suburb altar was a round mound south of the capital.',
  },
  s0061: {
    literal: 'Two zhang seven chi in height; upper diameter eleven zhang, lower diameter eighteen zhang.',
    idiomatic: 'It stood two zhang and seven chi high, eleven zhang across at the top and eighteen zhang at the base.',
  },
  s0062: {
    literal: 'Outside it, two enclosing walls; four gates.',
    idiomatic: 'Two concentric enclosure walls surrounded it, with four gates.',
  },
  s0063: {
    literal: 'Ordinarily it alternated years with the Northern Suburb.',
    idiomatic: 'It was normally performed in alternate years with the Northern Suburb rite.',
  },
  s0064: {
    literal: 'On the first xin day of the first month the ceremony was performed, using one special bull; the spirit of the Celestial Emperor Supreme Lord was sacrificed to upon it, with the Emperor\'s deceased father and Founding Emperor Wen as associates.',
    idiomatic: 'On the first xin day of the first month, a single bull was offered; the Celestial Emperor Supreme Lord was sacrificed to upon the altar, with the emperor\'s deceased father and Founding Emperor Wen as associates.',
  },
  s0065: {
    literal: 'The rite used a green jade disc to form the silks.',
    idiomatic: 'The rite employed a green jade bi disc to form the ritual silks.',
  },
  s0066: {
    literal: 'The Five Direction Supreme Lords, Five Officials spirits, Grand Unity, Celestial Unity, Sun, Moon, Five Stars, Twenty-eight Lodges, Grand Subtlety, Chariot Pivot, Literary Glory, Northern Dipper, Three Terraces, Old Man, Wind Lord, Minister of Works, Thunder and Lightning, Rain Master—all were associated sacrifices.',
    idiomatic: 'The Five Direction Supreme Lords, Five Officials, Grand Unity, Celestial Unity, Sun, Moon, Five Stars, Twenty-eight Lodges, Grand Subtlety, Chariot Pivot, Literary Glory, Northern Dipper, Three Terraces, Old Man, Wind Lord, Minister of Works, Thunder, Lightning, and Rain Master—all received associated sacrifice.',
  },
  s0067: {
    literal: 'The Twenty-eight Lodges and Rain Master and others had seats in pits; the Five Emperors likewise; the rest were all on level ground.',
    idiomatic: 'The Twenty-eight Lodges, Rain Master, and others had pit-seats; the Five Emperors likewise; all others were on level ground.',
  },
  s0068: {
    literal: 'Vessels were of pottery and gourd; mats of straw and stalks.',
    idiomatic: 'Vessels were pottery and gourd; mats were of straw and stalks.',
  },
  s0069: {
    literal: 'The Grand Astrologer set up a firewood altar at the bing position.',
    idiomatic: 'The Grand Astrologer erected a firewood altar at the bing position.',
  },
  s0070: {
    literal: 'The emperor fasted in the Wanshou Hall, rode the jade chariot, and with full imperial escort performed the rite.',
    idiomatic: 'The emperor fasted in the Hall of Longevity, rode the jade chariot, and with full imperial escort performed the rite.',
  },
  s0071: {
    literal: 'When the rite was complete, he changed dress to the sky-piercing cap and returned.',
    idiomatic: 'When the rite was finished, he changed into the sky-piercing cap and returned.',
  },
  s0072: {
    literal: 'Northern Suburb: a square altar at the Northern Suburb.',
    idiomatic: 'The Northern Suburb altar was a square mound at the northern suburb.',
  },
  s0073: {
    literal: 'Upper side ten zhang, lower side twelve zhang, height one zhang.',
    idiomatic: 'Its top measured ten zhang square, its base twelve zhang, and its height one zhang.',
  },
  s0074: {
    literal: 'Each of the four sides had steps.',
    idiomatic: 'Each of its four sides had steps.',
  },
  s0075: {
    literal: 'Outside it were two layers of enclosing wall.',
    idiomatic: 'Two layers of enclosing wall stood outside it.',
  },
  s0076: {
    literal: 'It alternated years with the Southern Suburb.',
    idiomatic: 'It alternated years with the Southern Suburb rite.',
  },
  s0077: {
    literal: 'On the first xin of the first month, with one special bull, the spirit of Queen Earth was sacrificed to upon it, with the Virtue Empress as associate.',
    idiomatic: 'On the first xin day of the first month, a single bull was offered; Queen Earth was sacrificed to upon the altar, with the Virtue Empress as associate.',
  },
  s0078: {
    literal: 'The rite used a yellow jade tube to form the silks.',
    idiomatic: 'The rite employed a yellow jade cong tube to form the ritual silks.',
  },
  s0079: {
    literal: 'Five Officials spirits, First Farmer, Five Sacred Mountains, Mount Yi, Mount Yue, Mount Baishi, Mount Huo, Mount Wulü, Mount Jiang, Four Seas, Four Rivers, Song River, Kuaiji River, Qiantang River, Four Outlooks—all were associated sacrifices.',
    idiomatic: 'The Five Officials, First Farmer, Five Sacred Mountains, Mount Yi, Mount Yue, Mount Baishi, Mount Huo, Mount Wulü, Mount Jiang, the Four Seas, Four Rivers, Song River, Kuaiji River, Qiantang River, and Four Outlooks—all received associated sacrifice.',
  },
  s0080: {
    literal: 'The Grand Astrologer set up a burial pit at the ren position.',
    idiomatic: 'The Grand Astrologer prepared a burial pit at the ren position.',
  },
  s0081: {
    literal: 'In the third year of Tianjian, Left Assistant Director Wu Caozhi submitted: "The tradition says \'suburban sacrifice at the Awakening of Insects\'—the suburban rite should follow after the Establishment of Spring."',
    idiomatic: 'In Tianjian 3, Left Assistant Director Wu Caozhi submitted: "Tradition says \'suburban sacrifice at the Awakening of Insects\'—the suburban rite should fall after the Establishment of Spring."',
  },
  s0082: {
    literal: '" Left Assistant Director of the Secretariat He Tongzhi deliberated: "Today\'s suburban sacrifice is to report last year\'s achievements and pray for this year\'s blessings."',
    idiomatic: 'Left Assistant Director He Tongzhi replied: "The present suburban sacrifice reports the previous year\'s achievements and prays for the coming year\'s blessings."',
  },
  s0083: {
    literal: 'Therefore the first xin of the year is taken, not bound to before or after the Establishment of Spring.',
    idiomatic: 'Hence the first xin day of the year is chosen, without regard to whether it falls before or after the Establishment of Spring.',
  },
  s0084: {
    literal: 'Zhou at the winter solstice at the Round Mound—great report to Heaven.',
    idiomatic: 'Under Zhou, the winter solstice sacrifice at the Round Mound was the great report to Heaven.',
  },
  s0085: {
    literal: 'Under Xia\'s calendar there was again a suburban sacrifice, to pray for agricultural affairs—hence the saying about the Awakening of Insects.',
    idiomatic: 'Under the Xia calendar a second suburban sacrifice prayed for the harvest—hence the Awakening of Insects tradition.',
  },
  s0086: {
    literal: 'From Jin Taishi year two, Round Mound and Square Marsh were combined with the two suburbs.',
    idiomatic: 'From Jin Taishi 2, the Round Mound and Square Marsh rites were merged with the two suburban sacrifices.',
  },
  s0087: {
    literal: 'From this one knows that today\'s suburban yi combines prayer and report—it cannot be limited to one path.',
    idiomatic: 'This shows that the present suburban yi rite combines prayer and thanksgiving—it cannot be confined to a single purpose.',
  },
  s0088: {
    literal: '" The Emperor said: "The Round Mound is naturally the sacrifice to Heaven; the First Farmer is naturally the prayer for grain."',
    idiomatic: 'The emperor said: "The Round Mound is inherently a sacrifice to Heaven; the First Farmer is inherently a prayer for grain."',
  },
  s0089: {
    literal: 'But it takes the yang position—therefore it is at the suburb.',
    idiomatic: 'But it occupies the yang position—hence it is performed in the suburb.',
  },
  s0090: {
    literal: 'On the night of the winter solstice, yang qi begins at jiazi; since August Heaven is sacrificed to, it is appropriate at the winter solstice.',
    idiomatic: 'On the winter solstice night, yang qi begins at jiazi; since August Heaven is sacrificed to, the winter solstice is the proper time.',
  },
  s0091: {
    literal: 'The time for praying for grain may follow antiquity—it must be at the Awakening of Insects.',
    idiomatic: 'The grain-prayer rite may follow antiquity—it must fall at the Awakening of Insects.',
  },
  s0092: {
    literal: 'On one suburban altar, divided into two sacrifices.',
    idiomatic: 'On a single suburban altar, the rite is divided into two sacrifices.',
  },
  s0093: {
    literal: '" From this the winter solstice was called sacrificing to Heaven; the Awakening of Insects was named praying for grain.',
    idiomatic: 'Henceforth the winter solstice rite was called sacrificing to Heaven; the Awakening of Insects rite was named praying for grain.',
  },
  s0094: {
    literal: 'He Tongzhi again submitted: "According to the case, fragrant wine is held in six yi vessels, covered with painted veils, complete in ornament—applied in the ancestral temple."',
    idiomatic: 'He Tongzhi submitted again: "Fragrant wine is held in six yi vessels, covered with painted veils, fully adorned—for use in the ancestral temple."',
  },
  s0095: {
    literal: 'Now the Northern and Southern suburbs\' ritual regulations include libation—since this departs from valuing simplicity, it is proposed to change it."',
    idiomatic: 'Yet the Northern and Southern suburb ritual regulations include libation—since this departs from the principle of simplicity, we propose to abolish it."',
  },
  s0096: {
    literal: '" Erudite Ming Shanbin deliberated, holding: "The Record of Rites says \'the Son of Heaven personally plows the fields; sacrificial grain and fragrant millet wine to serve the Supreme Lord\'—this is the libation at the Bright Hall."',
    idiomatic: 'Erudite Ming Shanbin argued: "The Record of Rites states, \'The Son of Heaven personally plows the fields; sacrificial grain and fragrant millet wine to serve the Supreme Lord\'—this refers to libation at the Bright Hall."',
  },
  s0097: {
    literal: 'The suburb should not have libation.',
    idiomatic: 'The suburban rite should not include libation."',
  },
  s0098: {
    literal: '" The Emperor followed this.',
    idiomatic: 'The emperor accepted this view.',
  },
  s0099: {
    literal: 'Also the relevant offices held that when the sacrifice was complete, vessels and mats in succession were returned to the storehouse; they requested according to the canon to burn and bury them.',
    idiomatic: 'The relevant offices further held that after the sacrifice, vessels and mats were returned to store; they requested that these be burned and buried according to canonical practice.',
  },
  s0100: {
    literal: 'Tongzhi and others deliberated: "According to the Rites, \'when sacrificial vessels are worn out, bury them.\'"',
    idiomatic: 'Tongzhi and his colleagues argued: "The Rites state, \'When sacrificial vessels are worn out, bury them.\'"',
  },
};

const data = JSON.parse(readFileSync(transPath, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}
writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations to', transPath);
