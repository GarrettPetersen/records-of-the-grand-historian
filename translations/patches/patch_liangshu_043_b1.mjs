#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 43, Biography 37',
    'Book of Liang, Volume 43, Biography 37',
  ],
  s0002: [
    'Wei Can; Jiang Ziyi; younger nephew Zisi; nephew Ziwu; Zhang Sheng; Shen Jun; Liu Jingli',
    'Wei Can; Jiang Ziyi; his younger nephew Zisi and nephew Ziwu; Zhang Sheng; Shen Jun; Liu Jingli',
  ],
  s0003: [
    'Wei Can, courtesy name Changqian, was grandson of Rapid Cavalry General Rui and son of North Xuzhou Inspector Fang.',
    'Wei Can, styled Changqian, was grandson of Rapid Cavalry General Rui and son of North Xuzhou Inspector Fang.',
  ],
  s0004: [
    'He had his father\'s manner, loved learning and bore himself with spirit; eight chi tall, his appearance was very imposing.',
    'He had his father\'s manner, loved learning and bore himself with spirit; eight chi tall, with a truly imposing presence.',
  ],
  s0005: [
    'He first served as traveling aide on the staff of the Cloud-Banner Prince of Jin\'an, soon held the law bureau, was promoted to exterior military aide, and concurrently interior military aide.',
    'He began as traveling aide on the staff of the Cloud-Banner Prince of Jin\'an, soon held the law bureau, rose to exterior military aide, and concurrently interior military aide.',
  ],
  s0006: [
    'At the time Yu Zhongrong of Yingchuan and Zhang Shuai of Wu commandery, famed seniors of earlier standing, were in the same headquarters and became friends with Can despite the gap in years.',
    'Yu Zhongrong of Yingchuan and Zhang Shuai of Wu, famed seniors, shared the same headquarters with Can and became close friends despite the gap in years.',
  ],
  s0007: [
    'When the prince was transferred to garrison Yongzhou, Can moved with him to secretariat aide, still concurrently interior military aide as before.',
    'When the prince moved to garrison Yongzhou, Can became secretariat aide and kept his concurrent interior military post.',
  ],
  s0008: [
    'When the prince was established as crown prince, Can was promoted to colonel of the infantry guard, entered court as commander of the Eastern Palace guard, and left office for his father\'s mourning.',
    'When the prince became crown prince, Can rose to colonel of the infantry guard, entered as commander of the Eastern Palace guard, then left office to mourn his father.',
  ],
  s0009: [
    'Soon he was recalled as General Who Wins the Distant and again commander of the guard.',
    'Soon he was recalled as General Who Wins the Distant and again commander of the guard.',
  ],
  s0010: [
    'When mourning ended he inherited the marquisate of Yongchang county and was made staff adviser to the Prince of Xiangdong of the Anxi Army, then rose through crown prince steward and left guard leader, keeping his guard command as before.',
    'When mourning ended he inherited the marquisate of Yongchang and became staff adviser to the Prince of Xiangdong of the Anxi Army, then rose through crown prince steward and left guard leader while keeping his guard command.',
  ],
  s0011: [
    'Because of old favor Can was entrusted with intimate duties; though his posts often changed, he regularly remained on night guard, wielded considerable reputation for awe, and was haughty and proud—men of the day did not regard him as their equal.',
    'Because of old favor Can was entrusted with intimate duties; though his posts shifted, he regularly remained on night guard, wielded real prestige, and was haughty—men of the day did not regard him as their equal.',
  ],
  s0012: [
    'Right Guard Zhu Yi once said to Can at a banquet in harsh tones: "How dare you already act like a commandant of the army before people!"',
    'Right Guard Zhu Yi once said to Can at a banquet in harsh tones, "How dare you already act like a commandant of the army before people!"',
  ],
  s0013: [
    'In the eleventh year of Zhongdatong he was promoted to regular palace attendant for direct communication, did not take office, and went out as bearer of the staff, commander of military affairs in Hengzhou, General of Peaceful Distance, and inspector of Hengzhou.',
    'In the eleventh year of Zhongdatong he was promoted to regular palace attendant for direct communication, did not take office, and went out as bearer of the staff, commander of Hengzhou military affairs, General of Peaceful Distance, and inspector of Hengzhou.',
  ],
  s0014: [
    'The crown prince came out to Xinting to see him off and took Can\'s hand, saying: "With you it will not be a long parting.',
    'The crown prince came out to Xinting to see him off and took his hand, saying, "With you it will not be a long parting.',
  ],
  s0015: [
    '" In the first year of Supreme Purity Can had been at his post only a short time when he memorialized to resign.',
    '" In the first year of Supreme Purity Can had barely reached his post when he memorialized to resign.',
  ],
  s0016: [
    'In the second year he was summoned as regular palace attendant.',
    'In the second year he was summoned as regular palace attendant.',
  ],
  s0017: [
    'Can returned as far as Luling, heard that Hou Jing had rebelled, reviewed his subordinates, got five thousand picked troops and a hundred horses, and hurried by forced marches to the rescue.',
    'Can returned as far as Luling, heard Hou Jing had rebelled, reviewed his men, gathered five thousand picked troops and a hundred horses, and hurried to the rescue by forced marches.',
  ],
  s0018: [
    'Reaching Yuzhang he received orders reporting "the bandit has already crossed Hengjiang," and Can at once went to the interior minister Liu Xiaoyi to plan together.',
    'Reaching Yuzhang he received orders reporting the bandit had already crossed Hengjiang, and at once went to interior minister Liu Xiaoyi to plan.',
  ],
  s0019: [
    'Xiaoyi said: "If it must be so, there should be a separate edict.',
    'Xiaoyi said, "If it must be so, there should be a separate edict.',
  ],
  s0020: [
    'How can we lightly trust a lone messenger and rashly stir alarm—perhaps it is not so after all.',
    'How can we lightly trust a lone messenger and rashly stir alarm—perhaps it is not so after all.',
  ],
  s0021: [
    '" At the time Xiaoyi was setting out wine; Can in anger dashed his cup to the ground and said: "The bandit has crossed the river and presses on the palace gates; land and water routes are both cut—what leisure is there for reports;',
    '" Xiaoyi was setting out wine; Can in anger dashed his cup to the ground and said, "The bandit has crossed the river and presses on the palace gates; land and water are both cut—what leisure is there for reports;',
  ],
  s0022: [
    'even if there were no edict, how could one rest at ease?',
    'even if there were no edict, how could one rest at ease?',
  ],
  s0023: [
    'What heart has Wei Can today for drinking wine!',
    'What heart has Wei Can today for drinking wine!',
  ],
  s0024: [
    '" He at once galloped out, arrayed his forces to march, when the Duke of Dangyang, Daxin, governor of Jiangzhou, sent a messenger summoning Can; Can galloped to see Daxin and said: "The garrison towns upriver are the realm\'s bulwarks; Jiangzhou is nearest the capital—in intent Your Highness should surely go first;',
    '" He galloped out and arrayed his forces to march, when the Duke of Dangyang, Daxin, governor of Jiangzhou, summoned him; Can galloped to Daxin and said, "The garrison towns upriver are the realm\'s bulwarks; Jiangzhou is nearest the capital—in intent Your Highness should go first;',
  ],
  s0025: [
    'but the midstream burden is weighty and must be met—one cannot leave the garrison vacant.',
    'but the midstream burden is weighty and must be met—one cannot leave the garrison vacant.',
  ],
  s0026: [
    'For now simply raise a great clamor and shift the garrison to Pencheng; send a subordinate general to follow—that will suffice for affairs.',
    'For now simply raise a great clamor and shift the garrison to Pencheng; send a subordinate general to follow—that will suffice.',
  ],
  s0027: [
    '" Daxin agreed and sent the middle army officer Liu Xin with two thousand troops to follow Can.',
    '" Daxin agreed and sent middle army officer Liu Xin with two thousand troops to follow Can.',
  ],
  s0028: [
    'Can left all his family dependents in Jiangzhou and took light boats on the road.',
    'Can left all his family in Jiangzhou and took light boats on the road.',
  ],
  s0029: [
    'Reaching South Prefecture, his cousin by marriage, Inspector of Sizhou Liu Zhongli, also led more than ten thousand foot and horse to Hengjiang; Can at once sent grain and weapons to supply him and distributed private gold and silk to reward his warriors.',
    'Reaching South Prefecture, his cousin by marriage, Sizhou inspector Liu Zhongli, also led more than ten thousand foot and horse to Hengjiang; Can sent grain and weapons to supply him and distributed private gold and silk to reward his warriors.',
  ],
  s0030: [
    'Earlier the Pacifying North General, the Prince of Poyang Fan, had also from Hefei sent Western Yuzhou Inspector Pei Zhigao with his eldest son Si, leading the Jiangxi forces toward the capital, encamped at Zhanggong Isle, waiting for the upriver armies to arrive.',
    'Earlier Pacifying North General, the Prince of Poyang Fan, had from Hefei sent Western Yuzhou inspector Pei Zhigao with his eldest son Si, leading Jiangxi forces toward the capital, encamped at Zhanggong Isle, waiting for upriver armies.',
  ],
  s0031: [
    'At that time Zhigao sent boats to ferry Zhongli; they united and advanced to encamp at Wang You Park.',
    'Zhigao sent boats to ferry Zhongli; they united and advanced to encamp at Wang You Park.',
  ],
  s0032: [
    'Can proposed making Zhongli grand commander and reporting this to the downstream armies.',
    'Can proposed making Zhongli grand commander and reported this to the downstream armies.',
  ],
  s0033: [
    'Pei Zhigao, ashamed to stand below him in age and rank, said: "Master Liu the prefect is a provincial commander—why need I again wield the whip and board?',
    'Pei Zhigao, ashamed to stand below him in age and rank, said, "Master Liu the prefect is a provincial commander—why need I again wield the whip and board?',
  ],
  s0034: [
    '" For days no decision was reached.',
    '" For days no decision was reached.',
  ],
  s0035: [
    'Can then spoke firmly before the assembly: "Today we share in the state\'s peril; righteousness lies in destroying the bandit—therefore we propose Liu the inspector of Sizhou, because he has long defended the frontier and Hou Jing fears him first;',
    'Can then spoke firmly before the assembly, "Today we share the state\'s peril; righteousness lies in destroying the bandit—therefore we propose Liu the Sizhou inspector, because he has long defended the frontier and Hou Jing fears him first;',
  ],
  s0036: [
    'moreover his troops and horses are elite, none surpass him.',
    'moreover his troops and horses are elite, none surpass him.',
  ],
  s0037: [
    'If we speak of rank, Liu stands below Can;',
    'If we speak of rank, Liu stands below Can;',
  ],
  s0038: [
    'if we speak of years, he is younger than Can too—only for the altars\' sake we cannot argue further.',
    'if we speak of years, he is younger than Can too—only for the altars\' sake we cannot argue further.',
  ],
  s0039: [
    'Today\'s situation values generals in harmony;',
    'Today\'s situation values generals in harmony;',
  ],
  s0040: [
    'if hearts differ, the great affair is lost.',
    'if hearts differ, the great affair is lost.',
  ],
  s0041: [
    'Lord Pei is an elder of the court in age and virtue—surely he should not again indulge private feeling and thwart the great plan.',
    'Lord Pei is a court elder in age and virtue—surely he should not indulge private feeling and thwart the great plan.',
  ],
  s0042: [
    'Can asks to explain this for you all.',
    'Can asks to explain this for you all.',
  ],
  s0043: [
    '" He took a lone boat to Zhigao\'s camp and reproached him sharply: "The earlier councils of the generals did not accord with Lord Yuzhou\'s intent—yet the two palaces are in peril and the cunning bandit floods heaven; ministers should join strength in one heart—how can we contradict one another!',
    '" He took a lone boat to Zhigao\'s camp and reproached him sharply, "The generals\' councils did not accord with Lord Yuzhou\'s intent—yet the two palaces are in peril and the cunning bandit floods heaven; ministers should join strength—how can we contradict one another!',
  ],
  s0044: [
    'If Lord Yuzhou insists on standing apart, blades and arrows will have their target.',
    'If Lord Yuzhou insists on standing apart, blades and arrows will have their target.',
  ],
  s0045: [
    '" Zhigao wept and said: "I have received the state\'s grace and glory and should myself lead the van; I regret my old age and cannot devote my life, and hoped to look to Master Liu the inspector to pacify the villain together—I thought the assembly had already agreed and had no need of this old man.',
    '" Zhigao wept and said, "I have received the state\'s grace and should lead the van; I regret my old age and cannot devote my life, and hoped to look to Master Liu to pacify the villain together—I thought the assembly had agreed and had no need of this old man.',
  ],
  s0046: [
    'If there must be doubt, I will lay open my heart.',
    'If there must be doubt, I will lay open my heart.',
  ],
  s0047: [
    '" Then the generals fixed their plan and Zhongli was able to advance the army.',
    '" Then the generals fixed their plan and Zhongli was able to advance.',
  ],
  s0048: [
    'Stopping at Xinting, the bandit drew up battle lines at Zhongxing Temple; they faced each other until evening, each withdrawing.',
    'Stopping at Xinting, the bandit drew up lines at Zhongxing Temple; they faced each other until evening, each withdrawing.',
  ],
  s0049: [
    'That night Zhongli entered Can\'s camp and arrayed the armies; at dawn they would fight; each general had his post, and Can was ordered to hold Qingtang.',
    'That night Zhongli entered Can\'s camp and arrayed the armies; at dawn they would fight; each general had his post, and Can was ordered to hold Qingtang.',
  ],
  s0050: [
    'Qingtang lay on the middle road to Stone City; Can feared the palisade was not yet built and the bandit would surely contest it, and was much afraid, saying to Zhongli: "This subordinate\'s talent is not for repelling insults—I only wish to give my body for the state.',
    'Qingtang lay on the middle road to Stone City; Can feared the palisade was not yet built and the bandit would contest it, and said to Zhongli, "My talent is not for repelling insults—I only wish to give my body for the state.',
  ],
  s0051: [
    'Master, weigh what is fit—do not let there be loss and ruin.',
    'Master, weigh what is fit—do not let there be loss and ruin.',
  ],
  s0052: [
    '" Zhongli said: "To build a palisade at Qingtang close to the Huai ford is to bring grain stores and boats all to moor there—this is a great matter and cannot be done without you, brother.',
    '" Zhongli said, "To build a palisade at Qingtang close to the Huai ford is to bring grain stores and boats all to moor there—this is a great matter and cannot be done without you, brother.',
  ],
  s0053: [
    'If you fear too few troops, more troops can be sent to help.',
    'If you fear too few troops, more troops can be sent to help.',
  ],
  s0054: [
    '" He then sent the direct-gate general Liu Shuyin to assist Can, leading his command by land and water together.',
    '" He sent direct-gate general Liu Shuyin to assist Can, leading his command by land and water together.',
  ],
  s0055: [
    'At the time fog and dusk fell; the soldiers lost the road, and by the time they reached Qingtang it was past midnight; the palisade was not closed by dawn.',
    'Fog and dusk fell; the soldiers lost the road, and by the time they reached Qingtang it was past midnight; the palisade was not closed by dawn.',
  ],
  s0056: [
    'Jing climbed the gate-tower of Chanling Temple, saw Can\'s camp not yet established, and led crack troops to attack.',
    'Jing climbed the gate-tower of Chanling Temple, saw Can\'s camp not yet established, and led crack troops to attack.',
  ],
  s0057: [
    'The deputy Wang Changmao urged holding the palisade and waiting; Can would not agree and ordered the commander Zheng Yi to meet the attack, commanding Liu Shuyin with the water army to cut off the rear.',
    'Deputy Wang Changmao urged holding the palisade and waiting; Can would not agree and ordered commander Zheng Yi to meet the attack, commanding Liu Shuyin with the water army to cut the rear.',
  ],
  s0058: [
    'Shuyin in cowardice dared not advance; Yi was defeated.',
    'Shuyin in cowardice dared not advance; Yi was defeated.',
  ],
  s0059: [
    'The bandit pressed the victory into the camp; attendants pulled Can away from the bandit but he did not move, still shouting at his sons and younger brothers to fight hard; soldiers died almost to the last man, and he was killed at age fifty-four.',
    'The bandit pressed the victory into the camp; attendants pulled Can away but he did not move, still shouting at his sons and brothers to fight hard; soldiers died almost to the last man, and he was killed at fifty-four.',
  ],
  s0060: [
    'Can\'s son Ni and three younger brothers Zhu, Jing, and Gou, and cousin Ang, all died in battle; kin who died numbered in the hundreds.',
    'Can\'s son Ni and three younger brothers Zhu, Jing, and Gou, and cousin Ang, all died in battle; kin who died numbered in the hundreds.',
  ],
  s0061: [
    'The bandit displayed Can\'s head below the gate to show the city; when the Heir Apparent heard he wept and said: "The altars\' trust rested only in Lord Wei—how could he, unhappily, die first in the ranks.',
    'The bandit displayed Can\'s head below the gate; when the Heir Apparent heard he wept and said, "The altars\' trust rested only in Lord Wei—how could he die first in the ranks.',
  ],
  s0062: [
    '" An edict posthumously made him General Who Guards the Army.',
    '" An edict posthumously made him General Who Guards the Army.',
  ],
  s0063: [
    'When the Shizu Emperor pacified Hou Jing, he was posthumously titled Loyal and Upright, and Zhu, Jing, Gou, and Ni were all posthumously made gentlemen of the Secretariat, Ang exterior regular palace attendant.',
    'When Emperor Shizu pacified Hou Jing, he was posthumously titled Loyal and Upright, and Zhu, Jing, Gou, and Ni were posthumously made Secretariat gentlemen, Ang exterior regular palace attendant.',
  ],
  s0064: [
    'Can\'s eldest son Zang, styled Junli.',
    'Can\'s eldest son Zang, styled Junli.',
  ],
  s0065: [
    'He held posts as gentleman in the three excellencies bureau, crown prince steward, and commander of the Eastern Palace guard.',
    'He held posts as gentleman in the three excellencies bureau, crown prince steward, and commander of the Eastern Palace guard.',
  ],
  s0066: [
    'When Hou Jing arrived he led troops to garrison the Western Splendid Gate.',
    'When Hou Jing arrived he led troops to garrison the Western Splendid Gate.',
  ],
  s0067: [
    'When the city fell he fled to Jiangzhou, gathered his old command, held Yuzhang, and was killed by his subordinates.',
    'When the city fell he fled to Jiangzhou, gathered his old command, held Yuzhang, and was killed by his subordinates.',
  ],
  s0068: [
    'Jiang Ziyi, styled Yuanchen, was a native of Kaocheng in Jiyang, seventh-generation descendant of Regular Palace Attendant Tong under Jin.',
    'Jiang Ziyi, styled Yuanchen, came from Kaocheng in Jiyang, seventh-generation descendant of Jin\'s regular palace attendant Tong.',
  ],
  s0069: [
    'His father Facheng had been a court gentleman in attendance under Heavenly Surveillance.',
    'His father Facheng had been a court gentleman in attendance under Heavenly Surveillance.',
  ],
  s0070: [
    'Ziyi from youth loved learning and had resolve; because his family was poor and could not support him, he ate vegetables all his life.',
    'Ziyi from youth loved learning and had resolve; because his family was poor he ate vegetables all his life.',
  ],
  s0071: [
    'He began office as gentleman in a princely kingdom and court gentleman in attendance.',
    'He began as gentleman in a princely kingdom and court gentleman in attendance.',
  ],
  s0072: [
    'He memorialized asking to view books in the secret archive; the Founding Emperor granted it and issued an edict that he attend directly at the Orchard of Splendor.',
    'He memorialized to view books in the secret archive; the Founding Emperor granted it and ordered him to attend directly at the Orchard of Splendor.',
  ],
  s0073: [
    'His uncle by marriage, Right Guard General Zhu Yi, held power in his day; on his days off guests crowded in—but Ziyi never once came to his gate; such was his lofty purity.',
    'His uncle by marriage, Right Guard Zhu Yi, held power; on days off guests crowded in—but Ziyi never came to his gate; such was his lofty purity.',
  ],
  s0074: [
    'He was gradually promoted to gentleman in the ritual bureau of the Secretariat, went out as magistrate of Suichang and Qu\'a, and in both showed fine achievement.',
    'He rose to gentleman in the ritual bureau, went out as magistrate of Suichang and Qu\'a, and in both showed fine achievement.',
  ],
  s0075: [
    'He was made regular palace attendant for direct communication, went out as General of Martial Proclamation and colonel of the southern ford.',
    'He was made regular palace attendant for direct communication, went out as General of Martial Proclamation and colonel of the southern ford.',
  ],
  s0076: [
    'His younger nephew Zisi had held the post of gentleman in the treasury bureau of gold.',
    'His younger nephew Zisi had held gentleman in the treasury bureau of gold.',
  ],
  s0077: [
    'At the opening of Great Unity he was promoted to right assistant.',
    'At the opening of Great Unity he was promoted to right assistant.',
  ],
  s0078: [
    'The brothers were all fierce by nature.',
    'The brothers were all fierce by nature.',
  ],
  s0079: [
    'From his post as right assistant Zisi submitted a memorial stating gains and losses to the full; the Founding Emperor greatly approved and ordered the Secretariat to examine and carry out what was fit.',
    'From his post as right assistant Zisi submitted a memorial on gains and losses; the Founding Emperor greatly approved and ordered the Secretariat to examine and carry out what was fit.',
  ],
  s0080: [
    'Left People Gentleman Shen Jiong and junior palace supplies aide Gu Yu once memorialized on affairs without approval; the Founding Emperor in anger shouted and rebuked them;',
    'Left People Gentleman Shen Jiong and junior palace supplies aide Gu Yu once memorialized without approval; the Founding Emperor shouted and rebuked them in anger;',
  ],
  s0081: [
    'Zisi then hurried forward to answer for Jiong and the rest in words very fierce; the Founding Emperor in rage ordered him bound; Zisi sat on the ground and would not submit; the Founding Emperor\'s anger also ceased, and he released him.',
    'Zisi hurried forward to answer for Jiong and the rest in fierce words; the Founding Emperor ordered him bound; Zisi sat on the ground and would not submit; the emperor\'s anger ceased and he released him.',
  ],
  s0082: [
    'He was still demoted and removed from office.',
    'He was still demoted and removed from office.',
  ],
  s0083: [
    'When Hou Jing rebelled and took Liyang, he was about to cross from Hengjiang; Ziyi led more than a thousand boats downstream intending to intercept him, but his deputy Dong Taosheng had family north of the river and with his faction scattered and fled.',
    'When Hou Jing rebelled and took Liyang and was about to cross from Hengjiang, Ziyi led more than a thousand boats downstream to intercept him, but deputy Dong Taosheng had family north of the river and fled with his faction.',
  ],
  s0084: [
    'Ziyi then withdrew to South Isle, gathered the remainder again, and went on foot toward the capital.',
    'Ziyi withdrew to South Isle, gathered the remainder again, and went on foot toward the capital.',
  ],
  s0085: [
    'The bandit also soon arrived; Ziyi memorialized the Heir Apparent: "The bandit siege is not yet closed—one can still sally out; once camps are fixed, there is no use for arms.',
    'The bandit soon arrived; Ziyi memorialized the Heir Apparent, "The siege is not yet closed—one can still sally out; once camps are fixed, arms are useless.',
  ],
  s0086: [
    '" He asked with his nephews Zisi and Ziwu to lead their command of more than a hundred men to open the Chengming Gate and challenge the bandit.',
    '" He asked with his nephews Zisi and Ziwu to lead more than a hundred men to open the Chengming Gate and challenge the bandit.',
  ],
  s0087: [
    'Permission was granted.',
    'Permission was granted.',
  ],
  s0088: [
    'Ziyi then took the lead before the soldiers, drew his halberd and advanced alone; bandits attacked from both sides and followers dared not follow.',
    'Ziyi took the lead, drew his halberd and advanced alone; bandits attacked from both sides and followers dared not follow.',
  ],
  s0089: [
    'Zisi and Ziwu, seeing affairs urgent, pulled one another toward the bandit and were both killed.',
    'Zisi and Ziwu, seeing affairs urgent, pulled one another toward the bandit and were both killed.',
  ],
  s0090: [
    'An edict said: "The late General of Martial Proclamation, regular palace attendant for direct communication, and colonel of the southern ford Jiang Ziyi; the late right assistant Jiang Zisi; and the Eastern Palace direct-hall commander Ziwu—misfortune has brought report, and we are deeply moved; to die for the affair merits higher rank, as old regulations provide.',
    'An edict said, "The late General of Martial Proclamation, regular palace attendant, and colonel of the southern ford Jiang Ziyi; the late right assistant Jiang Zisi; and Eastern Palace direct-hall commander Ziwu—misfortune has brought report and we are deeply moved; to die for the affair merits higher rank by old regulations.',
  ],
  s0091: [
    'Ziyi may be posthumously made gentleman in the Yellow Gate; Zisi gentleman in the Secretariat; Ziwu regular palace attendant."',
    'Ziyi may be posthumously made Yellow Gate gentleman; Zisi Secretariat gentleman; Ziwu regular palace attendant."',
  ],
  s0092: [
    'When Hou Jing was pacified the Shizu Emperor again posthumously made Ziyi palace attendant with the posthumous title Righteous;',
    'When Hou Jing was pacified Emperor Shizu again posthumously made Ziyi palace attendant with the posthumous title Righteous;',
  ],
  s0093: [
    'Zisi gentleman in the Yellow Gate with the posthumous title Resolute;',
    'Zisi Yellow Gate gentleman with the posthumous title Resolute;',
  ],
  s0094: [
    'Ziwu gentleman in the Secretariat with the posthumous title Fierce.',
    'Ziwu Secretariat gentleman with the posthumous title Fierce.',
  ],
  s0095: [
    'Ziyi continued the Yellow Chart and Ban Gu\'s "Nine Ranks," and several tens of pieces of rhapsody and prose, which circulated in the world.',
    'Ziyi continued the Yellow Chart and Ban Gu\'s "Nine Ranks," and several tens of rhapsodies and prose pieces, which circulated in the world.',
  ],
  s0096: [
    'Zhang Sheng, courtesy name Sishan, was son of Pacifying North General Ji.',
    'Zhang Sheng, styled Sishan, was son of Pacifying North General Ji.',
  ],
  s0097: [
    'From youth he was upright and elegant, had resolve, and could speak with clarity.',
    'From youth he was upright and elegant, had resolve, and could speak with clarity.',
  ],
  s0098: [
    'His father while inspecting Qing province was killed by the local people; Sheng, moved by the family calamity, ate vegetables and wore cloth all his life and never held a blade in his hand.',
    'His father while inspecting Qing province was killed by locals; Sheng, moved by the family calamity, ate vegetables and wore cloth all his life and never held a blade.',
  ],
  s0099: [
    'The province nominated him as Presented Scholar.',
    'The province nominated him as Presented Scholar.',
  ],
  s0100: [
    'He began office as secretary gentleman and rose through crown prince attendant, steward, left merit officer on the Minister of Education\'s staff, and gentleman of the Secretariat.',
    'He began as secretary gentleman and rose through crown prince attendant, steward, left merit officer on the Minister of Education\'s staff, and Secretariat gentleman.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_043_b1.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
