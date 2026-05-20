#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 5, Basic Annals 5',
    'Book of Liang, Volume 5, Annals 5',
  ],
  s0002: [
    'The Taizong Emperor Xiaoyuan was tabooed Yi, style name Shicheng, childhood name Qifu; he was the seventh son of the Gaozu.',
    'Taizong Emperor Xiaoyuan, personal name Yi, courtesy name Shicheng, childhood name Qifu, was Gaozu\'s seventh son.',
  ],
  s0003: [
    'In the eighth month, day dingsi, year 7 of Tianjian, he was born.',
    'On dingsi in the eighth month of Tianjian 7 he was born.',
  ],
  s0004: [
    'In year 13 he was enfeoffed as Prince of Xiangdong commandery with a fief of two thousand households.',
    'In year 13 he was made Prince of Xiangdong with a fief of two thousand households.',
  ],
  s0005: [
    'At first he was Remote Pacification General and Kuaiji Administrator; he entered court as Attendant, Proclaiming Might General, and Danyang Intendant.',
    'He was first Remote Pacification General and Kuaiji administrator, then Attendant, Proclaiming Might General, and Danyang intendant.',
  ],
  s0006: [
    'In year 7 of Putong he went out as Bearer of the Staff, Commander over military affairs in the six provinces Jing, Xiang, Ying, Yi, Ning, and South Liang, made Colonel of the Western Center and Jingzhou Inspector.',
    'In Putong 7 he went out as Bearer of the Staff, commander of Jing, Xiang, Ying, Yi, Ning, and South Liang, Colonel of the Western Center, and Jingzhou inspector.',
  ],
  s0007: [
    'In year 4 of Zhongdatong his title was advanced to General Who Pacifies the West.',
    'In Zhongdatong 4 he was promoted to General Who Pacifies the West.',
  ],
  s0008: [
    'In year 1 of Datong his title was advanced to General Who Pacifies the West.',
    'In Datong 1 he was promoted to General Who Pacifies the West.',
  ],
  s0009: [
    'In year 3 his title was advanced to General Who Secures the West.',
    'In Datong 3 he was promoted to General Who Secures the West.',
  ],
  s0010: [
    'In year 5 he entered court as General of the Right Guard and Protector-General, supervising military affairs at the Shitou garrison.',
    'In year 5 he entered court as General of the Right Guard and protector-general with Shitou garrison duties.',
  ],
  s0011: [
    'In year 6 he went out as Bearer of the Staff, Commander over military affairs in Jiangzhou, made General Who Secures the South and Jiangzhou Inspector.',
    'In year 6 he went out as Bearer of the Staff, Jiangzhou commander, General Who Secures the South, and Jiangzhou inspector.',
  ],
  s0012: [
    'In year 1 of Taiqing he was transferred as Bearer of the Staff, Commander over military affairs in the nine provinces Jing, Yong, Xiang, Si, Ying, Ning, Liang, North and South Qin, made General Who Secures the West and Jingzhou Inspector.',
    'In Taiqing 1 he was transferred Bearer of the Staff, commander of Jing, Yong, Xiang, Si, Ying, Ning, Liang, and the two Qin, General Who Secures the West, and Jingzhou inspector.',
  ],
  s0013: [
    'In the third month, year 3, Hou Jing raided and captured the capital.',
    'In the third month of year 3 Hou Jing stormed and took the capital.',
  ],
  s0014: [
    'In the fourth month, Crown Prince\'s Gentleman Xiao Shao arrived at Jiangling with a secret edict, making the Taizong Attendant, provisionally Bearer of the Yellow Axe, Grand Commander of all military affairs within and without, administering as Minister of Education by imperial order, the rest unchanged.',
    'In the fourth month crown prince gentleman Xiao Shao reached Jiangling with a secret edict appointing Taizong Attendant, provisional Bearer of the Yellow Axe, grand commander of all armies, acting as Minister of Education, other posts unchanged.',
  ],
  s0015: [
    'That month the Taizong levied troops in Xiangzhou; Xiangzhou Inspector Prince of Hedong Yu refused to send them.',
    'That month Taizong raised troops in Xiangzhou; Xiangzhou inspector Prince Yu of Hedong refused to dispatch them.',
  ],
  s0016: [
    'On bingwu in the sixth month he sent the Heir Fangdeng to lead troops to attack Yu; defeated in battle, Fangdeng died.',
    'On bingwu in the sixth month he sent the heir Fangdeng against Yu; defeated in battle, Fangdeng was killed.',
  ],
  s0017: [
    'In the seventh month he again sent Pacifying Troops General Bao Quan to replace him in attacking Yu.',
    'In the seventh month he again sent Pacifying Troops General Bao Quan to replace him against Yu.',
  ],
  s0018: [
    'On yimao in the ninth month Yongzhou Inspector Prince of Yueyang Cha raised troops in revolt and came to attack Jiangling; the Taizong closed the city and held it.',
    'On yimao in the ninth month Yueyang prince Cha, Yongzhou inspector, rebelled and attacked Jiangling; Taizong shut the city and defended.',
  ],
  s0019: [
    'On yichou Cha\'s general Du Shan and his brothers and Yang Hun each led their troops to surrender.',
    'On yichou Cha\'s general Du Shan, his brothers, and Yang Hun each led their forces to surrender.',
  ],
  s0020: [
    'On bingyin Cha fled.',
    'On bingyin Cha fled.',
  ],
  s0021: [
    'Bao Quan attacked Xiangzhou without success; he again sent Left Guard General Wang Senbian to replace the commander.',
    'Bao Quan failed to take Xiangzhou and again sent Left Guard General Wang Senbian to replace the commander.',
  ],
  s0022: [
    'On jiaxu in the second month Hengyang Intendant Zhou Hongzhi memorialized that a phoenix had appeared within the commandery bounds.',
    'On jiaxu in the second month Hengyang intendant Zhou Hongzhi reported a phoenix within the commandery.',
  ],
  s0023: [
    'In summer, the fifth month, day xinwei, Wang Senbian took Xiangzhou, beheaded Prince of Hedong Yu, and Xiangzhou was pacified.',
    'On xinwei in the fifth month of summer Wang Senbian took Xiangzhou, executed Prince Yu of Hedong, and pacified the province.',
  ],
  s0024: [
    'In the sixth month Princes Dakuen of Jiangxia, Dacheng of Shanyang, and Dafeng of Yidu came fleeing by the Xin\'an bypath.',
    'In the sixth month Princes Dakuen of Jiangxia, Dacheng of Shanyang, and Dafeng of Yidu fled by the Xin\'an route.',
  ],
  s0025: [
    'On xinyou in the ninth month former Yingzhou Inspector Prince of Nanping Ke was made Central Guard General, Director of the Masters of Writing with honors equal to the Three Lords, the Heir Fangzhu Central Pacifying Troops General and Yingzhou Inspector, Left Guard General Wang Senbian Leader of the Palace Gentlemen.',
    'On xinyou in the ninth month former Ying inspector Prince Ke of Nanping became Central Guard General, Director of the Masters of Writing with Three Lords honors; heir Fangzhu became Ying inspector; Left Guard Wang Senbian became leader of palace gentlemen.',
  ],
  s0026: [
    'Dakuen was re-enfeoffed Prince of Linchuan, Dacheng Prince of Guiyang, Dafeng Prince of Runan.',
    'Dakuen was re-enfeoffed Prince of Linchuan, Dacheng Prince of Guiyang, Dafeng Prince of Runan.',
  ],
  s0027: [
    'That month Ren Yue advanced to raid Xiyang and Wuchang; he sent Left Guard General Xu Wensheng, Right Guard General Yin Zichun, Heir\'s Right Guard Colonel Xiao Huizheng, and Guizhou Inspector Xi Wennian and others downstream to Wuchang to resist Yue.',
    'That month Ren Yue raided Xiyang and Wuchang; Left Guard Xu Wensheng, Right Guard Yin Zichun, heir\'s right guard colonel Xiao Huizheng, Guizhou inspector Xi Wennian, and others went down to Wuchang against him.',
  ],
  s0028: [
    'Central Guard General, Director of the Masters of Writing with Three Lords honors Prince of Nanping Ke was made Jingzhou Inspector, stationed at Wuling.',
    'Prince Ke of Nanping, central guard general and director with Three Lords honors, became Jingzhou inspector at Wuling.',
  ],
  s0029: [
    'On jiazi in the eleventh month Prince Ke of Nanping, Attendant Prince Dakuen of Linchuan, Prince Dacheng of Guiyang, Palace Attendant Jiang\'an Marquis Yuanzheng, Attendant Left Guard Zhang Chuan, Minister of Education Left Chief Clerk Dan, and others—one thousand men from offices, provinces, and kingdoms—submitted a memorial saying:',
    'On jiazi in the eleventh month Prince Ke, Attendant Dakuen, Prince Dacheng, palace attendant Marquis Yuanzheng of Jiang\'an, Attendant Left Guard Zhang Chuan, Minister of Education left chief clerk Dan, and a thousand men from offices, provinces, and kingdoms submitted a memorial:',
  ],
  s0030: [
    'We venture to think that since Song Mountain stands lofty, mountains and rivers send forth clouds;',
    'We note that since lofty Song Mountain sends mountains and rivers forth in cloud;',
  ],
  s0031: [
    'a great state has its screen, Shen and Fu are its pillars.',
    'a great state has its bulwark and Shen and Fu as its pillars.',
  ],
  s0032: [
    'Is it not that when royal ordering reaches its pole, position is the treasure;',
    'Is it not that when royal order reaches its height, rank is the treasure;',
  ],
  s0033: [
    'when sage teaching distinguishes regions, names and vessels are carefully kept?',
    'when sage teaching marks the regions, names and regalia are kept with care?',
  ],
  s0034: [
    'Thus we know the Grand Marshal assists the emperor, Chonghua displayed the yellow jade tally; the Minister of Works surveyed the earth, Yu the Great received the black jade gift.',
    'Thus the grand marshal aids the emperor as Chonghua showed the yellow jade sign; the minister of works surveyed the land as Yu received the black jade gift.',
  ],
  s0035: [
    'We venture to think that illustrious Duke and Royal Highness, fated for the age, arose bearing the sage.',
    'We venture: illustrious Duke and Royal Highness, born for the age, arose bearing the sage.',
  ],
  s0036: [
    'Loyalty is the chief virtue, filial piety the heaven\'s constant—the earth joins Ying and Han, the charge joins Dan and Shi; the five ranks are thereby instructed, the seven regulators align; will lodges in altar and state, achievement crosses hard straits.',
    'Loyalty is supreme virtue, filial piety heaven\'s norm; the charge is deep as Dan and Shi; the five ranks are taught and seven directors aligned; will rests in state, merit crosses danger.',
  ],
  s0037: [
    'When barbarians invaded within, he slept on his spear and wept blood; while whales and krakens were not swept away he cast aside his sleeves to serve the king—he could make wandering spirits beg treaty on bent knee and ugly bandits bear jade on their lips in shame.',
    'When aliens invaded he slept on spear and wept blood; until foes were swept he cast sleeves aside for the king—foes begged treaty on bent knee and bandits bore jade in shame.',
  ],
  s0038: [
    'Kin and marches rebelled without; trouble matched Wu and Chu; righteous punishment extended prestige, arms without bloodshed.',
    'Kin and marches rebelled alike; trouble matched Wu and Chu; righteous punishment needed no bloodshed.',
  ],
  s0039: [
    'Xiang\'s waves stilled themselves—not building Du Tao\'s ramparts;',
    'The Xiang stilled without building Du Tao\'s ramparts;',
  ],
  s0040: [
    'Mount Xian stood apart without attacking Liu Biao\'s city.',
    'Mount Xian stood apart without storming Liu Biao\'s city.',
  ],
  s0041: [
    'Jiujiang brought obstruction; the two branches differed; with talent he ordered war-boats and settled Qian and Huo.',
    'Jiujiang was troubled; branches split; war-boats were ordered and Qian and Huo were settled.',
  ],
  s0042: [
    'Upstream he pursued to the end, roads blocked all spying; when Hu troops crossed the border iron horses joined like mist, his divine plan alone operated—all at once were hung head-down, wings folded as if broken, and tribute was restored.',
    'Pursuing upstream, roads blocked spies; when Hu troops crossed and iron horses massed like mist, his plan alone worked—heads hung, wings folded, tribute restored.',
  ],
  s0043: [
    'Liang and Han joined pact and deployed sharp troops; Ba and Han both descended and exhausted bold arrays.',
    'Liang and Han allied and deployed sharp weapons; Ba and Han descended with brave formations.',
  ],
  s0044: [
    'South he reached the Five Ridges, north he sent force to the Yuan plains;',
    'South to the Five Ridges, north force to the plains;',
  ],
  s0045: [
    'eastern Yi bore no complaint, western Rong was at once ordered.',
    'eastern Yi were not aggrieved, western Rong were ordered.',
  ],
  s0046: [
    'One may say: a thousand li of upper stream, a million halberds—the world\'s utmost honor, what the four seas push forward.',
    'One may say a thousand li of upper stream and a million halberds—the world\'s height, what the four seas advance.',
  ],
  s0047: [
    'Now sea-water flies in clouds, Kun mountain flames rise; Wei Wen grieved the year of willing elevation, Han Xuan sighed the day of completed rites—below Yang Terrace only caps and canopies hurried;',
    'Now sea clouds rise and Kun flames blaze; Wei Wen grieved willing elevation, Han Xuan sighed completed rites—below Yang Terrace only caps hurried;',
  ],
  s0048: [
    'by Dreaming Waters carriages still formed ruts in line.',
    'by Dream Waters wagons still lined the road.',
  ],
  s0049: [
    'Double ears on millet came from the domain of Nanping;',
    'Double ears on wheat came from Nanping;',
  ],
  s0050: [
    'sweet dew and mud-branched trees descended on the lands of Dangyang.',
    'sweet dew on mud branches descended at Dangyang.',
  ],
  s0051: [
    'Wild silkworms spun of themselves—why defer to Ou silk;',
    'Wild silkworms spun—why praise Ou silk;',
  ],
  s0052: [
    'idle fields bore rice—how different from rain of grain?',
    'idle fields bore rice—no different from grain from rain.',
  ],
  s0053: [
    'All things surely prosperous, this is called bright culture\'s great light—how could emblems and titles fail to shine in the canon, bright testing fail to appear in chariot and robe!',
    'All things prospered—bright culture\'s radiance—how could titles fail in the canon and testing fail in chariot and robe!',
  ],
  s0054: [
    'In antiquity Jin and Zheng entered Zhou and still served as chief ministers;',
    'In antiquity Jin and Zheng entered Zhou yet served as chief ministers;',
  ],
  s0055: [
    'Xiao and Cao aided Han and yet held the chancellorship.',
    'Xiao and Cao aided Han yet held chancellorship.',
  ],
  s0056: [
    'This splendid rite should be exalted to answer the multitude\'s hope.',
    'This splendid rite should be raised to answer the multitude\'s hopes.',
  ],
  s0057: [
    'Ke and others examined the armor command, broadly consulted the trustworthy records, humbly bowed twice and advance you to Chancellor of State, overseeing the hundred offices, one tally of bamboo envoy, separately as perpetual ritual.',
    'Ke and others searched armor commands, consulted trustworthy records, bowed twice, and advance you to chancellor of state overseeing the hundred offices, with one bamboo tally as constant ritual.',
  ],
  s0058: [
    'Bearing the golden axe to cut down rebels, riding the jade chariot to settle altar and state.',
    'Bearing golden axe to cut rebels, riding jade chariot to settle state.',
  ],
  s0059: [
    'Arrayed splendors beside sun and moon, upright brightness joined with heaven and earth.',
    'Splendors ranged beside sun and moon, brightness joined heaven and earth.',
  ],
  s0060: [
    'Supporting peril and winging order—how could it not be glorious!',
    'Supporting peril and ordering rule—how could it not be glorious!',
  ],
  s0061: [
    'Ke and others do not comprehend the great body, themselves obscured in prostrating this memorial for hearing.',
    'Ke and others lack the great form and prostrate this memorial for hearing.',
  ],
  s0062: [
    'The Taizong ordered reply: "The count falls on yang nine, the time is the hundred six; whales and krakens not yet cut—sleepless in grief of heart.',
    'Taizong ordered reply: "Count falls on yang nine, time is hundred six; foes not yet cut—sleepless with grief.',
  ],
  s0063: [
    'Zhou called it the Celestial Offices, Qin called Chancellor of State—east to the sea, west to the river, south to Zhuque, north approaching the dark passes.',
    'Zhou named celestial offices, Qin chancellor of state—east to sea, west to river, south to Zhuque, north to dark passes.',
  ],
  s0064: [
    'Leading these petty ministers, broadening this great virtue—',
    'Leading petty ministers, broadening great virtue—',
  ],
  s0065: [
    'what use to follow tracks of Qufu, trace Huan and Wen, finally erect one rectification, solemn in the five bows?',
    'what use follow Qufu, trace Huan and Wen, erect one rectification, solemn in five bows?',
  ],
  s0066: [
    'Though righteousness follows the time, affairs have no empty record; tradition says all yielded, the Image shows sounding modesty—gazing on former canon, again choked with shame."',
    'Though righteousness follows time, affairs are not empty; tradition says all yielded, the Image shows modesty—gazing on former canon, again ashamed."',
  ],
  s0067: [
    'On renchen in the twelfth month Dingshan Inspector Xiao Bo was made General Who Secures the South and Guangzhou Inspector.',
    'On renchen in the twelfth month Dingshan inspector Xiao Bo became General Who Secures the South and Guangzhou inspector.',
  ],
  s0068: [
    'Protector-General Yin Yue, Bazhou Inspector Wang Xun, Dingshan Inspector Du Duo\'an led troops down to Wuchang to aid Xu Wensheng.',
    'Protector-General Yin Yue, Bazhou inspector Wang Xun, Dingshan inspector Du Duo\'an led troops to Wuchang to aid Xu Wensheng.',
  ],
  s0069: [
    'In year 2 of Dabao the Taizong still called it year 5 of Taiqing.',
    'In Dabao 2 Taizong still called it Taiqing 5.',
  ],
  s0070: [
    'On jihai in the second month Wei sent envoys on a friendly visit.',
    'On jihai in the second month Wei sent friendly envoys.',
  ],
  s0071: [
    'In the third month Hou Jing mustered all troops westward to join Ren Yue\'s army.',
    'In the third month Hou Jing mustered all troops west to join Ren Yue.',
  ],
  s0072: [
    'On bingwu in the fourth month Jing sent his generals Song Zixian and Ren Yue to raid Yingzhou and seized Inspector Fangzhu.',
    'On bingwu in the fourth month Hou Jing sent generals Song Zixian and Ren Yue to raid Yingzhou and seized inspector Fangzhu.',
  ],
  s0073: [
    'On wushen Xu Wensheng, Yin Zichun, and others fled back; Wang Xun, Yin Yue, and Du Duo\'an all surrendered to the bandits.',
    'On wushen Xu Wensheng and Yin Zichun fled back; Wang Xun, Yin Yue, and Du Duo\'an all surrendered to the rebels.',
  ],
  s0074: [
    'On gengxu Leader of the Palace Gentlemen Wang Senbian led troops stationed at Baling.',
    'On gengxu Wang Senbian led troops stationed at Baling.',
  ],
  s0075: [
    'On jiazi Jing advanced to raid Baling.',
    'On jiazi Hou Jing advanced against Baling.',
  ],
  s0076: [
    'On guiwei in the fifth month the Taizong sent Mobile Headquarters General Hu Senyou and Xinzhou Inspector Lu Fahuo leading troops downstream to aid Baling.',
    'On guiwei in the fifth month Taizong sent Mobile Headquarters Hu Senyou and Xinzhou inspector Lu Fahuo downstream to aid Baling.',
  ],
  s0077: [
    'Ren Yue was defeated and Jing then fled.',
    'Ren Yue was defeated and Hou Jing fled.',
  ],
  s0078: [
    'Wang Senbian was made General Who Conquers the East, Three Lords honors, Director of the Masters of Writing; Hu Senyou Leader of the Palace Gentlemen; Lu Fahuo Protector-General.',
    'Wang Senbian became General Who Conquers the East with Three Lords honors and director of Masters of Writing; Hu Senyou leader of palace gentlemen; Lu Fahuo protector-general.',
  ],
  s0079: [
    'He still ordered Senbian to lead the massed armies in pursuit of Jing; wherever they reached they were victorious.',
    'He still ordered Senbian to pursue Hou Jing; everywhere they were victorious.',
  ],
  s0080: [
    'On jiachen in the eighth month Senbian descended to camp at Xunyang.',
    'On jiachen in the eighth month Senbian camped below Xunyang.',
  ],
  s0081: [
    'On xinhai General Who Secures the South and Xiangzhou Inspector Xiao Fangju was made Central Guard General.',
    'On xinhai General Who Secures the South and Xiangzhou inspector Xiao Fangju became Central Guard General.',
  ],
  s0082: [
    'Minister of Works, General Who Conquers the South, Prince of Nanping Ke had his title advanced to Grand General Who Conquers the South.',
    'Minister of Works and General Who Conquers the South Prince Ke of Nanping was promoted to Grand General Who Conquers the South.',
  ],
  s0083: [
    'Jingzhou Inspector, the rest unchanged.',
    'Jingzhou inspector, other posts unchanged.',
  ],
  s0084: [
    'On jihai in the ninth month General Who Conquers the East with Three Lords honors and Director Wang Senbian was made Jiangzhou Inspector, the rest unchanged.',
    'On jihai in the ninth month General Who Conquers the East Wang Senbian with Three Lords honors became Jiangzhou inspector, other posts unchanged.',
  ],
  s0085: [
    'Panpan state presented a tame elephant.',
    'Panpan presented a tame elephant.',
  ],
  s0086: [
    'In winter, the tenth month, day xinchou, the new moon—purple cloud like a chariot canopy hung over Jiangling city.',
    'On xinchou, new moon of the tenth winter month, purple cloud like a chariot canopy hung over Jiangling.',
  ],
  s0087: [
    'That month the Taizong died.',
    'That month Taizong died.',
  ],
  s0088: [
    'Attendant, General Who Conquers the East, Three Lords honors, Jiangzhou Inspector, Director of the Masters of Writing, Marquis of Changning Wang Senbian and others submitted a memorial saying:',
    'Attendant, General Who Conquers the East, Jiangzhou inspector, director, Marquis of Changning Wang Senbian and others submitted a memorial:',
  ],
  s0089: [
    'The massed armies made thin war; halted at the Nine Waters—on that day they obtained a man from Lincheng county who reported: Hou Jing murdered the emperor by treason, harmed the crown prince, and all of the imperial clan in the bandit court suffered cruel disaster.',
    'The armies pressed the campaign, halted at Nine Waters—that day a Lincheng county messenger reported Hou Jing had murdered the emperor, harmed the crown prince, and kin in the rebel court suffered cruel death.',
  ],
  s0090: [
    'The six armies grieved and wept; the three luminaries changed their light.',
    'The six armies wept; the three luminaries changed.',
  ],
  s0091: [
    'Alas for our imperial pole—the four seas\' hearts collapsed.',
    'Alas for our imperial pole—the four seas\' hearts broke.',
  ],
  s0092: [
    'Our great Liang received Yao\'s succession and traced Shang\'s opening heritage.',
    'Our great Liang received Yao\'s succession and traced Shang\'s opening.',
  ],
  s0093: [
    'Grand Ancestor the Literary Emperor followed Qi and became sage, beginning the six provinces.',
    'Grand Ancestor the Literary Emperor followed Qi, became sage, and opened the six provinces.',
  ],
  s0094: [
    'The Martial Emperor the Gaozu was bright, divine, and martial, embracing all under heaven in one sweep.',
    'Gaozu the Martial Emperor was bright, divine, and martial and in one sweep embraced the realm.',
  ],
  s0095: [
    'Relying on sun and moon he harmonized the four seasons; treading the utmost honor he regulated the six harmonies.',
    'Relying on sun and moon he harmonized four seasons; treading utmost honor he regulated the six harmonies.',
  ],
  s0096: [
    'Establishing the correct and dwelling in constancy, the great crossbeams secured fortune.',
    'Establishing correctness and dwelling in constancy, great fortune was secured.',
  ],
  s0097: [
    'Four leaves linked in succession, three sages shared one foundation.',
    'Four reigns linked in succession, three sages one foundation.',
  ],
  s0098: [
    'That vicious chief thus relied on the heavenly capital.',
    'That vicious chief held the heavenly capital.',
  ],
  s0099: [
    'The Vermilion Gate received the shame of Baideng; the Elephant Tower brought the doubt of Yaocheng.',
    'The vermilion gate knew Baideng\'s shame; the elephant tower Yaocheng\'s doubt.',
  ],
  s0100: [
    'Cloud canopy and Chenghua—in one morning all suffered cruelty.',
    'Cloud canopy and Chenghua—in one morning all suffered cruel death.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_005_b1.mjs <translation.json>'
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
