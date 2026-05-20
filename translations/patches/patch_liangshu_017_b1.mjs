#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 17, Biographies 11',
    'Book of Liang, Volume 17, Biographies 11',
  ],
  s0002: [
    'Wang Zhenguo; Ma Xianpin; Zhang Qi',
    'Wang Zhenguo; Ma Xianpin; Zhang Qi',
  ],
  s0003: [
    'Wang Zhenguo, styled Dezong, was a native of Xiang in Pei commandery.',
    'Wang Zhenguo, styled Dezong, came from Xiang in Pei commandery.',
  ],
  s0004: [
    'His father Guangzhi was a fine general of Qi, reaching scattered-cavalry attendant-in-ordinary and chariot-and-cavalry general.',
    'His father Guangzhi was a noted Qi general who rose to scattered-cavalry attendant-in-ordinary and chariot-and-cavalry general.',
  ],
  s0005: [
    'Zhenguo began office as champion army acting staff officer, rose through tiger-guard commandant of the center and Nanqiao prefect, and was famed for capable governance.',
    'Zhenguo began as champion army acting staff officer, rose through tiger-guard commandant of the center and Nanqiao prefect, and won a name for able rule.',
  ],
  s0006: [
    'At the time the commandery suffered bitter famine; he issued grain and scattered wealth to relieve the destitute.',
    'The commandery was in bitter famine; he opened granaries and scattered wealth to save the poor.',
  ],
  s0007: [
    'Qi Gaodi wrote by hand: "You love the people and govern the state well—this suits my intent very well.',
    'Qi Gaodi wrote by hand, "You love the people and govern the state—this suits my intent well.',
  ],
  s0008: [
    '" At the start of Yongming he was transferred to Guiyang interior governor, hunted down bandits and robbers, and the territory was pacified.',
    '" At the start of Yongming he became Guiyang interior governor, hunted bandits, and pacified the territory.',
  ],
  s0009: [
    'When his term ended he returned to the capital; passing through Jiangzhou, Inspector Liu Shilong came to the ford to bid farewell, saw Zhenguo\'s return baggage light and plain, and sighed: "This truly may be called a fine two-thousand-dan official!',
    'When his term ended he returned to court; passing Jiangzhou, Inspector Liu Shilong came to the ford to see him off, saw his baggage light and plain, and sighed, "This is a true two-thousand-dan official!',
  ],
  s0010: [
    '" On return he was made grand marshal central army staff officer.',
    '" On return he was made grand marshal central army staff officer.',
  ],
  s0011: [
    'Emperor Wu of Qi greatly knew and appreciated him; he often sighed and said: "Among later-age generals\' sons, few are like Zhenguo.',
    'Emperor Wu of Qi knew and prized him; he often sighed and said, "Among later generations of generals\' houses, few sons are like Zhenguo.',
  ],
  s0012: [
    '" He went out again as Ancheng interior governor.',
    '" He went out again as Ancheng interior governor.',
  ],
  s0013: [
    'He entered office as crossbow-and-horses commandant, champion chief of staff, and Zhongli prefect.',
    'He entered as crossbow-and-horses commandant, champion chief of staff, and Zhongli prefect.',
  ],
  s0014: [
    'He was then transferred to prefect of Ba and Ping commanderies.',
    'He was then transferred to prefect of Ba and Ping.',
  ],
  s0015: [
    'On return he was made raid general and left office for his father\'s mourning.',
    'On return he was made raid general and left office for his father\'s mourning.',
  ],
  s0016: [
    'Late in Jianwu, Wei forces besieged Si Province; Emperor Ming sent Xuzhou Inspector Pei Shuye to attack and capture Guoyang as a diversion, and raised Zhenguo to supporting-the-state general to lead troops in support.',
    'Late in Jianwu, Wei besieged Si province; Emperor Ming sent Xuzhou inspector Pei Shuye to take Guoyang as a diversion and raised Zhenguo to supporting-the-state general to reinforce him.',
  ],
  s0017: [
    'Wei general Yang Dayan\'s great host suddenly arrived; Shuye in fear abandoned the army and fled; Zhenguo led his men as rearguard, so they did not suffer great defeat.',
    'Wei general Yang Dayan\'s host suddenly arrived; Shuye in fear abandoned the army and fled; Zhenguo led the rearguard, so the defeat was not total.',
  ],
  s0018: [
    'In the first year of Yongtai, Kuaiji prefect Wang Jingze rebelled; Zhenguo again led troops to resist.',
    'In Yongtai year one, Kuaiji prefect Wang Jingze rebelled; Zhenguo again led troops against him.',
  ],
  s0019: [
    'When Jingze was pacified, he was made pacifying-the-north general and inspector of Qing and Ji, general as before.',
    'When Jingze was pacified, he was made pacifying-the-north general and inspector of Qing and Ji, general as before.',
  ],
  s0020: [
    'When the Righteous Army rose, Donghun summoned Zhenguo with his troops back to the capital; he entered and garrisoned Jiankang city.',
    'When the Righteous Army rose, Donghun summoned Zhenguo with his troops to the capital; he entered and garrisoned Jiankang.',
  ],
  s0021: [
    'When the Righteous Army arrived, Donghun had Zhenguo go out and camp at Zhuque Gate; he was defeated by Wang Mao\'s army and re-entered the city.',
    'When the Righteous Army arrived, Donghun sent Zhenguo to camp at Zhuque Gate; Wang Mao\'s army defeated him and he re-entered the city.',
  ],
  s0022: [
    'He then secretly sent Xi Zuan to present a bright mirror as pledge of loyalty to Gaozu; Gaozu broke gold to answer him.',
    'He secretly sent Xi Zuan to present a bright mirror to Gaozu as pledge of loyalty; Gaozu broke gold in answer.',
  ],
  s0023: [
    'At the time everyone in the city wished to follow righteousness, yet none dared act first; Attendant Zhang Ji as Ministry of Guard general commanded all troops; Zhenguo secretly joined with Ji\'s trusted man Zhang Qi to win Ji over, and Ji agreed.',
    'Everyone in the city wished to turn to the righteous cause, yet none dared move first; attendant Zhang Ji as Ministry of Guard general commanded the host; Zhenguo secretly won over Ji\'s confidant Zhang Qi to sway Ji, and Ji agreed.',
  ],
  s0024: [
    'On the morning of day bingyin in the twelfth month, Zhenguo led Ji to the Ministry of Guard headquarters, mustered troops entering by Cloud Dragon Gate, and at once beheaded Donghun in the inner hall; with Ji he met Right Vice Director Wang Liang and others below the western bell, and had Palace Scribe-in-Ordinary Pei Changmu and others present Donghun\'s head to Gaozu.',
    'On the morning of day bingyin in the twelfth month, Zhenguo led Ji to the Ministry of Guard headquarters, mustered troops through Cloud Dragon Gate, and at once beheaded Donghun in the inner hall; with Ji he met right vice director Wang Liang and others below the western bell and had palace scribe Pei Changmu and others present Donghun\'s head to Gaozu.',
  ],
  s0025: [
    'For merit he was appointed right guard general; he declined and did not accept;',
    'For merit he was appointed right guard general; he declined;',
  ],
  s0026: [
    'Again appointed Xuzhou inspector; he firmly begged to remain in the capital.',
    'Again appointed Xuzhou inspector; he firmly begged to stay in the capital.',
  ],
  s0027: [
    'Again granted gold and silk; Zhenguo again firmly declined.',
    'Again granted gold and silk; Zhenguo again firmly declined.',
  ],
  s0028: [
    'Edict replied: "In old times Tian Zitai firmly declined silk and grain.',
    'An edict replied, "In old times Tian Zitai firmly declined silk and grain.',
  ],
  s0029: [
    'Your care for the state runs deep—truly praiseworthy.',
    'Your care for the state runs deep—truly praiseworthy.',
  ],
  s0030: [
    '" Later at a feast the emperor asked: "Your bright mirror still exists—where is the gold of old?',
    '" Later at a feast the emperor asked, "Your bright mirror still exists—where is the gold of old?',
  ],
  s0031: [
    '" Zhenguo answered: "The gold is carefully at my elbow; I dare not let it fall."',
    '" Zhenguo answered, "The gold is carefully at my elbow; I dare not let it fall."',
  ],
  s0032: [
    'Again made right guard general, with additional supervisory attendant; transferred to left guard general with additional scattered-cavalry attendant-in-ordinary.',
    'Again made right guard general with additional supervisory attendant; transferred to left guard general with additional scattered-cavalry attendant-in-ordinary.',
  ],
  s0033: [
    'At the start of Tianjian he was enfeoffed Marquis of Zhenyang with a thousand households.',
    'At the start of Tianjian he was enfeoffed marquis of Zhenyang with a thousand households.',
  ],
  s0034: [
    'Made Director of the Court for Public Works, attendant-in-ordinary as before.',
    'Made director of the court for public works, attendant-in-ordinary as before.',
  ],
  s0035: [
    'In year five, Wei\'s Prince of Rencheng Yuan Cheng raided Zhongli; Gaozu sent Zhenguo and asked the strategy for attacking the rebels.',
    'In year five, Wei\'s prince of Rencheng Yuan Cheng raided Zhongli; Gaozu sent Zhenguo and asked how to defeat the rebels.',
  ],
  s0036: [
    'Zhenguo replied: "Your subject always worries that Wei has too few troops, not that they have too many."',
    'Zhenguo replied, "Your subject always worries that Wei has too few troops, not that they have too many."',
  ],
  s0037: [
    'Gaozu admired his words and then granted credentials of office; he joined the armies in the campaign together.',
    'Gaozu admired his words, granted credentials, and sent him with the armies on the campaign.',
  ],
  s0038: [
    'Wei forces withdrew; the army returned in triumph.',
    'Wei withdrew; the army returned in triumph.',
  ],
  s0039: [
    'He went out as bearer of staff and credentials, commander of military affairs in Liang and Qin, campaign general who subdues barbarians, and inspector of Nan and Liang.',
    'He went out bearer of staff, commander of Liang and Qin military affairs, campaign general who subdues barbarians, and inspector of Nan and Liang.',
  ],
  s0040: [
    'When Liang\'s long chief of staff Xia Hou Daoyuan surrendered the province to Wei, Zhenguo marched by land through Wei Xing intending to strike, but did not succeed, and remained to garrison there.',
    'When Liang\'s long chief of staff Xia Hou Daoyuan surrendered the province to Wei, Zhenguo marched overland through Wei Xing to strike but failed and remained to garrison.',
  ],
  s0041: [
    'For lack of merit he repeatedly memorialized to resign; Gaozu would not permit it.',
    'For lack of merit he repeatedly asked to resign; Gaozu would not allow it.',
  ],
  s0042: [
    'His enfeoffment was changed to Marquis of Yiyang, fief households as before.',
    'His enfeoffment was changed to marquis of Yiyang, households as before.',
  ],
  s0043: [
    'Recalled to be outer scattered-cavalry attendant-in-ordinary and crown prince right guard leader, with additional rear army.',
    'Recalled as outer scattered-cavalry attendant-in-ordinary and crown prince right guard leader, with additional rear army.',
  ],
  s0044: [
    'Before long, again left guard general.',
    'Before long, again left guard general.',
  ],
  s0045: [
    'In year nine he went out as bearer of staff, commander of Xiang military affairs, faithful martial general, and Xiang inspector.',
    'In year nine he went out bearer of staff, commander of Xiang military affairs, faithful martial general, and Xiang inspector.',
  ],
  s0046: [
    'After four years in office he was recalled as Protector General, transferred to undisguised scattered-cavalry attendant-in-ordinary and Danyang governor.',
    'After four years in office he was recalled as protector general, then undisguised scattered-cavalry attendant-in-ordinary and Danyang governor.',
  ],
  s0047: [
    'In year fourteen he died.',
    'In year fourteen he died.',
  ],
  s0048: [
    'Edict granted chariot-and-cavalry general, one set of martial music, funeral money ten thousand, and cloth one hundred bolts.',
    'An edict granted chariot-and-cavalry general, one set of martial music, ten thousand cash for the funeral, and a hundred bolts of cloth.',
  ],
  s0049: [
    'Posthumous title: Wei.',
    'Posthumous title: Wei.',
  ],
  s0050: [
    'His son Sengdu inherited.',
    'His son Sengdu inherited.',
  ],
  s0051: [
    'Ma Xianpin, styled Lingfu, was a native of Mei in Fufeng.',
    'Ma Xianpin, styled Lingfu, came from Mei in Fufeng.',
  ],
  s0052: [
    'His father Boluan was Song champion army acting chief of staff.',
    'His father Boluan was Song champion army acting chief of staff.',
  ],
  s0053: [
    'Xianpin from youth was known for daring and resolve; when his father died his grief-wasting exceeded ritual—he carried earth to make the mound and planted pines and cypresses with his own hands.',
    'From youth Xianpin was known for daring; when his father died his mourning exceeded ritual—he carried earth for the mound and planted pines and cypresses himself.',
  ],
  s0054: [
    'He began office as Yezhou chief clerk, transferred to martial-cavalry regular attendant, served as a junior officer, and followed Qi Prince of Anlu Xiao Mian.',
    'He began as Yezhou chief clerk, rose to martial-cavalry regular attendant, served as a junior officer, and followed Qi\'s prince of Anlu Xiao Mian.',
  ],
  s0055: [
    'When Mian died, he served Emperor Ming.',
    'When Mian died, he served Emperor Ming.',
  ],
  s0056: [
    'In Yongyuan, Xiao Yaoguang and Cui Huijing rebelled; he repeatedly had battle merit and through merit rose to front general.',
    'In Yongyuan, Xiao Yaoguang and Cui Huijing rebelled; he won repeated battle merit and rose to front general.',
  ],
  s0057: [
    'He went out as dragon-prancing general and prefect of Nan Ruyin and Qiao.',
    'He went out as dragon-prancing general and prefect of Nan Ruyin and Qiao.',
  ],
  s0058: [
    'When Shouchun had newly fallen, Wei general Wang Su invaded the border; Xianpin fought hard, with the few overcame the many, and Wei men greatly feared him.',
    'When Shouchun had newly fallen, Wei general Wang Su raided the border; Xianpin fought hard, the few overcame the many, and Wei greatly feared him.',
  ],
  s0059: [
    'Again through merit he was transferred to pacifying-the-north general and Yuzhou inspector.',
    'Again through merit he was transferred to pacifying-the-north general and Yuzhou inspector.',
  ],
  s0060: [
    'When the Righteous Army rose, all quarters largely responded; Gaozu sent Xianpin\'s old friend Yao Zhongbin to persuade him; Xianpin in the army beheaded Zhongbin to display to the host.',
    'When the Righteous Army rose, all quarters largely responded; Gaozu sent Xianpin\'s old friend Yao Zhongbin to win him over; Xianpin beheaded Zhongbin in camp to warn the host.',
  ],
  s0061: [
    'When the Righteous Army reached Xinlin, Xianpin still held arms on the west of the river, daily requisitioning transport grain; when Jiankang fell, Xianpin wept and wailed a whole night, then laid down arms and came to submit his guilt.',
    'When the Righteous Army reached Xinlin, Xianpin still held arms west of the river, daily requisitioning transport grain; when Jiankang fell, he wept all night, then laid down arms and came to submit his guilt.',
  ],
  s0062: [
    'Gaozu comforted him, saying: "Shooting the hook, cutting the sleeve—men of old did not resent such.',
    'Gaozu comforted him, saying, "Shooting the hook, cutting the sleeve—men of old did not resent such things.',
  ],
  s0063: [
    'Do not, because you killed the envoy and cut off supply, needlessly estrange yourself."',
    'Do not, because you killed the envoy and cut off supply, needlessly estrange yourself."',
  ],
  s0064: [
    'Xianpin apologized: "A petty man is like a stray dog without a master; when a new master feeds it, it will serve again."',
    'Xianpin apologized, "A petty man is like a stray dog without a master; when a new master feeds it, it serves again."',
  ],
  s0065: [
    'Gaozu laughed and praised him.',
    'Gaozu laughed and praised him.',
  ],
  s0066: [
    'Soon Xianpin\'s mother died; Gaozu knew he was poor and gave funeral gifts very generously.',
    'Soon Xianpin\'s mother died; Gaozu knew he was poor and gave funeral gifts very generously.',
  ],
  s0067: [
    'Xianpin wept and said to his younger brother Zhong\'ai: "Having received great creating grace, I have not yet repaid it.',
    'Xianpin wept and said to his younger brother Zhong\'ai, "Having received great creating grace, I have not yet repaid it.',
  ],
  s0068: [
    'Now again receiving special favor—we shall repay with all our strength, you and I."',
    'Now again receiving special favor—we shall repay with all our strength, you and I."',
  ],
  s0069: [
    'In Tianjian year four, the royal army marched north; Xianpin in every battle was bravest in the three armies; whoever met his charge was not left unbroken.',
    'In Tianjian year four, the royal army marched north; Xianpin in every battle was bravest in the three armies; whoever met his charge was shattered.',
  ],
  s0070: [
    'When discussing with the generals, he never spoke of merit in his mouth.',
    'When the generals discussed affairs, he never spoke of merit.',
  ],
  s0071: [
    'When asked the reason, Xianpin said: "A man whom the age knows should advance without seeking fame and retreat without escaping punishment—that is his lifetime wish.',
    'When asked why, Xianpin said, "A man whom the age knows should advance without seeking fame and retreat without escaping punishment—that is his lifetime wish.',
  ],
  s0072: [
    'What merit is there to discuss!',
    'What merit is there to discuss!',
  ],
  s0073: [
    '" He was appointed supporting-the-state general and prefect of Song\'an and Anman, transferred to south Yiyang prefect.',
    '" He was appointed supporting-the-state general and prefect of Song\'an and Anman, then south Yiyang prefect.',
  ],
  s0074: [
    'He repeatedly broke the mountain barbarians; the commandery borders were quiet and orderly.',
    'He repeatedly broke the mountain barbarians; the commandery was quiet and orderly.',
  ],
  s0075: [
    'For merit he was enfeoffed Baron of Hansui with four hundred households, and was then transferred to commander of Si military affairs and Si inspector, supporting-the-state general as before.',
    'For merit he was enfeoffed baron of Hansui with four hundred households, then commander of Si military affairs and Si inspector, supporting-the-state general as before.',
  ],
  s0076: [
    'Soon he was advanced in rank to faithful martial general.',
    'Soon he was advanced to faithful martial general.',
  ],
  s0077: [
    'A man of Wei Yuzhou, Bai Zaosheng, killed his inspector Prince of Langye Sima Qingzeng, styled himself pacifying-the-north general, and pushed his fellow villager Hu Xun as inspector to offer Xuanhu in surrender.',
    'A man of Wei Yuzhou, Bai Zaosheng, killed his inspector the prince of Langye Sima Qingzeng, styled himself pacifying-the-north general, and pushed his fellow villager Hu Xun as inspector to offer Xuanhu in surrender.',
  ],
  s0078: [
    'Gaozu sent Xianpin to go; he also sent direct-palace general Wu Huichao and Ma Guang with troops as reinforcements.',
    'Gaozu sent Xianpin; he also sent direct-palace general Wu Huichao and Ma Guang with troops as reinforcements.',
  ],
  s0079: [
    'Xianpin advanced and encamped at Prince of Chu city, sent Deputy General Qi Gou\'er with two thousand troops to help guard Xuanhu.',
    'Xianpin advanced and encamped at Prince of Chu city and sent deputy general Qi Gou\'er with two thousand men to help guard Xuanhu.',
  ],
  s0080: [
    'Wei\'s Prince of Zhongshan Yuan Ying led a hundred thousand host to attack Xuanhu; Xianpin sent Guang, Huichao, and others to guard the three passes.',
    'Wei\'s prince of Zhongshan Yuan Ying led a hundred thousand men against Xuanhu; Xianpin sent Guang, Huichao, and others to guard the three passes.',
  ],
  s0081: [
    'In the twelfth month, Ying captured Xuanhu, seized Qi Gou\'er, then advanced to attack Ma Guang and again defeated Guang, capturing him alive and sending him to Luoyang.',
    'In the twelfth month Ying took Xuanhu, seized Qi Gou\'er, then attacked Ma Guang and defeated him, capturing him alive and sending him to Luoyang.',
  ],
  s0082: [
    'Xianpin could not rescue.',
    'Xianpin could not rescue.',
  ],
  s0083: [
    'Huichao and the others also in succession withdrew and dispersed; Wei forces then advanced to occupy the three passes.',
    'Huichao and the others also withdrew in succession; Wei then advanced and held the three passes.',
  ],
  s0084: [
    'Xianpin sat out the blame and was recalled, made cloud-cavalry general.',
    'Xianpin was recalled for the failure and made cloud-cavalry general.',
  ],
  s0085: [
    'He went out as benevolent prestige staff officer; when the lord of the manor Prince of Yuzhang changed title to cloud-banner, he again became staff officer with additional shaking-the-distant general.',
    'He went out as benevolent prestige staff officer; when the manor lord Prince of Yuzhang changed title to cloud-banner, he again became staff officer with additional shaking-the-distant general.',
  ],
  s0086: [
    'In year ten, the people of Qushan killed Langye prefect Liu Xi and offered the city in surrender to Wei; an edict granted Xianpin credentials to attack.',
    'In year ten the people of Qushan killed Langye prefect Liu Xi and surrendered the city to Wei; an edict granted Xianpin credentials to attack.',
  ],
  s0087: [
    'Wei Xuzhou Inspector Lu Chang came with a host of more than a hundred thousand.',
    'Wei Xuzhou inspector Lu Chang came with more than a hundred thousand men.',
  ],
  s0088: [
    'Xianpin fought him, repeatedly defeating him; Chang fled away.',
    'Xianpin fought him, repeatedly defeated him, and Chang fled.',
  ],
  s0089: [
    'Xianpin loosed troops to pursue; of Wei\'s host only one or two in ten escaped; grain, cattle, horses, and implements taken were beyond counting.',
    'Xianpin loosed troops in pursuit; only one or two in ten of Wei\'s host escaped; grain, cattle, horses, and arms taken were beyond counting.',
  ],
  s0090: [
    'The army returned to the capital in triumph; he was transferred crown prince left guard leader, advanced in rank to marquis, fief increased by six hundred households.',
    'The army returned in triumph; he was transferred crown prince left guard leader, advanced to marquis, fief increased by six hundred households.',
  ],
  s0091: [
    'In year eleven he was transferred bearer of staff, commander of Yu, north Yu, and Huo, faithful martial general and Yuzhou inspector, with concurrent Nan Ruyin prefect.',
    'In year eleven he was transferred bearer of staff, commander of Yu, north Yu, and Huo, faithful martial general and Yuzhou inspector, with concurrent Nan Ruyin prefect.',
  ],
  s0092: [
    'At first Xianpin\'s childhood name was Xianbi; when grown, because "bi" as a name was not proper, he replaced "woman" with "jade," thus making "Xianpin," it is said.',
    'At first Xianpin\'s childhood name was Xianbi; when grown, because "bi" as a name was not proper, he replaced the female radical with jade and made "Xianpin," it is said.',
  ],
  s0093: [
    'From serving as general and holding commanderies and prefectures, he could share hardship and ease with officers and soldiers.',
    'As general and in commanderies and prefectures, he shared hardship and ease with officers and soldiers.',
  ],
  s0094: [
    'His body clothing was no more than plain cloth and silk; where he dwelt there were no curtains, quilts, or screens; on the march his food and drink were the same as the lowest groom.',
    'His clothing was no more than plain cloth and silk; his dwelling had no curtains, quilts, or screens; on the march he ate and drank with the lowest groom.',
  ],
  s0095: [
    'On the borders he often went alone in secret into enemy camps to reconnoiter walls, stockades, villages, and strategic points; hence battles were mostly victorious, and the soldiers too were willing to die for him; Gaozu deeply loved and relied on him.',
    'On the borders he often went alone in secret into enemy camps to learn walls, stockades, villages, and passes; hence he mostly won battles, and the soldiers were willing to die for him; Gaozu deeply loved and relied on him.',
  ],
  s0096: [
    'After four years in the province he died.',
    'After four years in the province he died.',
  ],
  s0097: [
    'Granted left guard general.',
    'Granted left guard general.',
  ],
  s0098: [
    'Posthumous title: Gang.',
    'Posthumous title: Gang.',
  ],
  s0099: [
    'His son Yanfu inherited.',
    'His son Yanfu inherited.',
  ],
  s0100: [
    'Zhang Qi, styled Zixiang, was a native of Fengyi commandery.',
    'Zhang Qi, styled Zixiang, was a man of Fengyi commandery.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_017_b1.mjs <translation.json>'
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
