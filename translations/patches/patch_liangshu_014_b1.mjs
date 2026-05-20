#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 14, Biographies 8',
    'Book of Liang, Volume 14, Biographies 8',
  ],
  s0002: [
    'Jiang Yan; Ren Fang',
    'Jiang Yan; Ren Fang',
  ],
  s0003: [
    'Jiang Yan, styled Wentong, was a native of Kaocheng in Jiyang.',
    'Jiang Yan, styled Wentong, came from Kaocheng in Jiyang.',
  ],
  s0004: [
    'Orphaned young, poor, and fond of study, he was quiet and kept few companions.',
    'Left fatherless while young, poor but devoted to books, he lived inwardly and made few friends.',
  ],
  s0005: [
    'He first entered office as staff officer in South Xuzhou, then was transferred to attendant at court.',
    'He began as a South Xuzhou staff officer, then became a court attendant.',
  ],
  s0006: [
    'Song\'s Prince Jing of Pingping, Jingsu, loved scholars; Yan followed Jingsu in Southern Yanzhou.',
    'Song\'s Prince Jing of Pingping, Jingsu, prized men of letters; Yan served him in Southern Yanzhou.',
  ],
  s0007: [
    'Guangling magistrate Guo Yanwen offended the law; Yan was implicated in his defense and imprisoned in the provincial jail.',
    'Guangling magistrate Guo Yanwen ran afoul of the law; Yan was caught up in the case and held in the provincial prison.',
  ],
  s0008: [
    'In prison Yan submitted a memorial that read:',
    'From his cell Yan sent up a memorial, which said:',
  ],
  s0009: [
    'Of old a loyal minister beat his breast in grief until frost fell on the land of Yan;',
    'Long ago a loyal subject struck his heart in anguish, and frost answered on the plains of Yan;',
  ],
  s0010: [
    'a common woman cried to Heaven until a shaking wind struck the tower of Qi.',
    'a common daughter cried to Heaven, and a rending wind struck the tower of Qi.',
  ],
  s0011: [
    'Each time your servant reads those words he cannot lay the scroll down without weeping.',
    'Whenever your servant reads those lines he cannot close the book without tears.',
  ],
  s0012: [
    'Why?',
    'Why is that?',
  ],
  s0013: [
    'A gentleman has a settled code; a woman has conduct that does not change.',
    'A gentleman holds to a fixed standard; a woman keeps faith that will not bend.',
  ],
  s0014: [
    'Trusted yet suspected, loyal yet punished to death—therefore brave men and men of honor lie down to die and do not look back.',
    'Believed in yet doubted, steadfast yet slain—for that reason stalwarts and men of honor face death and never turn aside.',
  ],
  s0015: [
    'Your servant has heard that benevolence cannot be relied on and goodness cannot be leaned on; he once thought that mere talk, but now he knows it.',
    'Your servant heard that kindness cannot be trusted and virtue cannot be depended on; he took it for empty saying—now he knows it true.',
  ],
  s0016: [
    'He bows and begs Your Highness to pause your attendants a moment and grant a little pity and clear sight.',
    'He bows and begs Your Highness to stay your attendants briefly and lend a measure of pity and clear judgment.',
  ],
  s0017: [
    'Your servant was born a man of wicker doors and mulberry pivots, a scholar in hemp cloak and leather belt; in retreat he did not polish the Odes and Documents to startle the dull, in advance he did not buy a name in the world.',
    'Your servant is a man of wicker doors and mulberry pivots, a common scholar in hemp and leather; he did not dress up the Odes and Documents to dazzle fools, nor purchase renown under heaven.',
  ],
  s0018: [
    'Lately, by mistake, he was raised and lowered through the gate of Bright Hall, in and out of the Golden Flower Hall—when did he not shrink his shadow before stern guards and walk sideways past barred doors?',
    'Not long ago, by error, he passed the Bright Hall gate and walked the Golden Flower halls—was he not always folding his shadow before the guards and edging past the locks?',
  ],
  s0019: [
    'He secretly admired Your Highness\'s righteousness and became a guest at your gate, supplied with the leavings of shallow arts and placed among the humblest of petty skills.',
    'He secretly honored Your Highness\'s righteousness and entered your gate as a retainer, given only the dregs of shallow craft and a place among the meanest talents.',
  ],
  s0020: [
    'Your Highness showed him favor in grace and glanced on him with a kind face.',
    'Your Highness favored him with grace and looked on him with kindness.',
  ],
  s0021: [
    'Truly he wore the gift of Jing Ke\'s yellow gold and felt in secret the bond Yu Rang owed a lord of the realm.',
    'He truly bore the gift of Jing Ke\'s gold and felt in his bones the debt Yu Rang owed a lord of the land.',
  ],
  s0022: [
    'He often wished to knot his cap and lay down his sword, to repay you in the smallest measure, to split his heart and wear down his heels for the lord he served.',
    'He often meant to knot his cap and offer his sword, to repay you in the least part, to break his heart and grind his heels for the lord he served.',
  ],
  s0023: [
    'He never thought a mean man\'s narrowness would seat him in slander; his steps fell from bright law, his person was shut in a dark cell.',
    'He never dreamed a petty man\'s spite would trap him in accusation; his name fell from the bright statutes, his body was caged in the black jail.',
  ],
  s0024: [
    'He walks his shadow and mourns his heart; his nose burns sour and his bones ache.',
    'He treads on his shadow and weeps in his heart; acid rises in his nose and pain cuts his bones.',
  ],
  s0025: [
    'Your servant has heard that to lose one\'s name is disgrace and to lose one\'s form comes next; therefore each time the thought returns he feels as though something were lost.',
    'Your servant has heard that to lose one\'s name is shame and to lose one\'s body is worse still; each time the thought returns he feels something torn away.',
  ],
  s0026: [
    'Moreover he has passed a full month and reached late autumn; the sky sinks in gloom and there is no color left at his sides.',
    'Moreover a month has passed into late autumn; heaven hangs dark and there is no light at either hand.',
  ],
  s0027: [
    'His person is not wood or stone, yet he shares a ward with the jailers.',
    'He is not wood or stone, yet he keeps company with the turnkeys.',
  ],
  s0028: [
    'That is why Sir Shaoqing beat his breast to Heaven, wept until he had no tears, and went on bleeding.',
    'That is why the Grand Historian beat his breast to Heaven, wept his eyes dry, and still shed blood.',
  ],
  s0029: [
    'Your servant lacks the praise of his village, yet he has heard how a gentleman walks.',
    'Your servant lacks fame in his district, yet he has heard the gentleman\'s way.',
  ],
  s0030: [
    'At the highest he hides between curtain and market stall or lies on stone in the hills;',
    'At the highest he hides behind shop curtains or sleeps on mountain stone;',
  ],
  s0031: [
    'next he knots his sash in the court of golden horses and speaks high doctrine on the Cloud Terrace;',
    'next he ties his sash in the hall of golden horses and argues great policy on the Cloud Terrace;',
  ],
  s0032: [
    'next he takes the lord of Southern Yue captive and binds the Chanyu by the neck: all open the red register and share a place in the green histories.',
    'next he seizes the lord of Southern Yue and collars the Chanyu: each enters the vermilion book and wins a line in the blue annals.',
  ],
  s0033: [
    'Would he contend for a hair\'s breadth or vie for the edge of a knife awl!',
    'Would he fight for a hair\'s breadth or compete for a needle\'s point!',
  ],
  s0034: [
    'Yet your servant has heard that slander piled high melts gold and calumny piled high grinds bone to meal.',
    'Yet your servant has heard that slander heaped high can melt gold and malice heaped high can grind bone to dust.',
  ],
  s0035: [
    'In antiquity Straightborn was suspected for stolen gold; in recent times Boyu was stained with an unrighteous name.',
    'In antiquity Straightborn was doubted over stolen gold; in recent times Boyu was marked with an unjust name.',
  ],
  s0036: [
    'Those two talents were treated so;',
    'Men of such gifts suffered thus;',
  ],
  s0037: [
    'how much more your servant—how could he escape!',
    'how much more your servant—how could he be spared!',
  ],
  s0038: [
    'Of old a great general\'s shame was Hong Hou in a dungeon;',
    'Of old a great general\'s shame was Hong Hou in the cells;',
  ],
  s0039: [
    'a famous minister\'s blush was the Historian in the lower chamber—as for your servant, what more can he say!',
    'a famous minister\'s blush was the Historian in the pit—as for your servant, what words remain!',
  ],
  s0040: [
    'Lu Zhonglian was wise yet declined salary and never returned;',
    'Lu Zhonglian had wisdom yet refused rank and never came back;',
  ],
  s0041: [
    'Jieyu was worthy yet walked singing and forgot to go home.',
    'Jieyu had worth yet sang as he walked and forgot the homeward road.',
  ],
  s0042: [
    'Yan Ziling shut his gate in Eastern Yue and Zhong Wei barred his door in Western Qin—the lesson is plain enough.',
    'Yan Ziling closed his door in Eastern Yue and Zhong Wei sealed his gate in Western Qin—the meaning is clear enough.',
  ],
  s0043: [
    'If your servant\'s affair were not empty and his guilt were real, he should clamp his mouth, swallow his tongue, and fall on a dagger—why should he face the strange integrity of Qi and Lu or the grieving singers of Yan and Zhao!',
    'If your servant\'s charge were true and his guilt solid, he should seal his mouth, swallow his tongue, and die on a blade—why meet the strange honor of Qi and Lu or the mourning singers of Yan and Zhao!',
  ],
  s0044: [
    'Now the holy calendar is revered and bright; the realm rejoices in its work; azure clouds float over the Luo, glory fills the river.',
    'Now the sacred reign is revered and bright; all under heaven delights in its labor; azure clouds drift above the Luo, splendor blocks the river.',
  ],
  s0045: [
    'West to Lintao and Didao, north to Flying Fox and Yangyuan—none but is steeped in benevolence, bathed in righteousness, warmed by the sun, drinking the sweet wine.',
    'West to Lintao and Didao, north to Flying Fox and Yangyuan—every land is steeped in kindness, washed in duty, lit by the sun, drinking the sweet cup.',
  ],
  s0046: [
    'Yet your servant embraces pain at the round gate and holds wrath in the prison door; the slightest thing is enough to grieve.',
    'Yet your servant nurses pain at the round gate and hoards rage in the jail— the smallest matter is cause for grief.',
  ],
  s0047: [
    'He looks up and begs Your Highness to bend a little clear light; then the soul at Wuzhu Mound need not blush for a head sunk in earth;',
    'He looks up and begs Your Highness to grant a little clear sight; then the shade at Wuzhu Mound need not blush for a buried head;',
  ],
  s0048: [
    'the ghost at Goose Pavilion need not regret bones turned to ash.',
    'the ghost at Goose Pavilion need not regret bones burned to ash.',
  ],
  s0049: [
    'Unable to bear the cut of liver and gall, he respectfully sends word through your attendants.',
    'Unable to bear the cut of heart and liver, he respectfully reports through your officers.',
  ],
  s0050: [
    'Once this heart is seen, death itself will not perish.',
    'Once this heart is known, even death will not die.',
  ],
  s0051: [
    'Jingsu read the memorial and released him that same day.',
    'Jingsu read the letter and freed him the same day.',
  ],
  s0052: [
    'Soon he was nominated South Xuzhou village scholar; in the policy examination he placed first and was made left regular attendant of the Prince of Baling\'s state.',
    'Soon he was recommended as South Xuzhou village scholar, topped the policy exam, and became left regular attendant in the Prince of Baling\'s household.',
  ],
  s0053: [
    'When Jingsu went to Jing province, Yan followed him to the post.',
    'When Jingsu took Jing province, Yan went with him to the command.',
  ],
  s0054: [
    'When the Depraved Emperor succeeded, he lost virtue in many ways.',
    'When the Depraved Emperor took the throne, his conduct failed in many ways.',
  ],
  s0055: [
    'Jingsu held the upper reaches exclusively; many urged him to raise arms on that account.',
    'Jingsu held the upper river country alone; many urged him to strike while he could.',
  ],
  s0056: [
    'Yan often remonstrated at leisure: "Slander brings disaster in—',
    'Yan often urged him gently: "Rumor draws ruin—',
  ],
  s0057: [
    'that is why the Two Uncles perished together; nursing a grudge at the chessboard—',
    'that is how the Two Uncles died as one; nursing a grudge at the board—',
  ],
  s0058: [
    'that is why the Seven States all fell. Your Highness does not seek the peace of the ancestral temples but trusts the counsel of those at your side; then you will again see deer in frost and dew lodging on the Terrace of Gusu."',
    'that is how the Seven States were destroyed. Your Highness does not seek the altars\' safety but trusts men at your ear; then you will again see deer in frost and dew on the Terrace of Gusu."',
  ],
  s0059: [
    'Jingsu did not accept his advice.',
    'Jingsu would not listen.',
  ],
  s0060: [
    'When he garrisoned Jingkou, Yan was again made staff officer to the Pacifying Army and concurrently magistrate of Southern Donghai commandery.',
    'When he held Jingkou, Yan became pacifying-army staff officer and also magistrate of Southern Donghai.',
  ],
  s0061: [
    'Jingsu and his intimates plotted day and night; Yan saw ruin coming and sent fifteen poems as indirect warning.',
    'Jingsu and his inner circle schemed night and day; Yan saw disaster near and offered fifteen poems as warning.',
  ],
  s0062: [
    'When Southern Donghai prefect Lu Cheng entered mourning for his father, Yan thought that as commandery aide he should act as prefect; Jingsu appointed staff officer Liu Shilong instead.',
    'When Southern Donghai prefect Lu Cheng began mourning, Yan assumed the aide should run the commandery; Jingsu gave the post to staff officer Liu Shilong.',
  ],
  s0063: [
    'Yan pressed his claim; Jingsu was furious and spoke to the selection office, demoting him to magistrate of Jian\'an in Wu-xing.',
    'Yan insisted; Jingsu raged, spoke to personnel, and demoted him to Jian\'an magistrate in Wu-xing.',
  ],
  s0064: [
    'Yan held the district three years.',
    'Yan served in the county three years.',
  ],
  s0065: [
    'At the start of the Ascendant Bright era, when Qi\'s emperor held regency, he heard of Yan\'s talent and summoned him as Masters of Writing director of the imperial equipage and valiant-cavalry staff officer.',
    'At the start of Ascendant Bright, with Qi\'s emperor as regent, he heard of Yan and made him secretariat director of the imperial equipage and valiant-cavalry staff officer.',
  ],
  s0066: [
    'Before long Jing inspector Shen Youzhi rebelled; Gaodi said to Yan, "The realm is in such turmoil—what do you think?"',
    'Soon Jing inspector Shen Youzhi rose in arms; Gaodi asked Yan, "The world is chaos like this—what is your view?"',
  ],
  s0067: [
    'Yan answered, "Of old Xiang was strong and Liu weak, Yuan had many men and Cao few; Yu commanded the feudal lords yet in the end suffered the shame of a single sword, Yuan straddled four provinces yet ended a fugitive north of the river.',
    'Yan answered, "Once Xiang Yu was strong and Liu Bang weak, Yuan Shao had numbers and Cao Cao few; Yu ruled the lords yet died by one sword, Yuan held four provinces yet fled north in defeat.',
  ],
  s0068: [
    'This is what they call \'virtue, not the vessel.\'',
    'That is what men mean by \'power lies in virtue, not in the tripod.\'',
  ],
  s0069: [
    'Why should you doubt?"',
    'What doubt remains for you?"',
  ],
  s0070: [
    'The emperor said, "Many have spoken so—try to think it through."',
    'The emperor said, "Many say the same—work it through for me."',
  ],
  s0071: [
    'Yan said, "Your Lordship is boldly martial with a strange design—one victory;',
    'Yan said, "You are boldly martial with a singular plan—first victory;',
  ],
  s0072: [
    'tolerant and humane—two victories;',
    'tolerant and humane—second victory;',
  ],
  s0073: [
    'the worthy exert all their strength—three victories;',
    'the worthy give all their strength—third victory;',
  ],
  s0074: [
    'the people\'s hopes turn to you—four victories;',
    'the people\'s hopes rest on you—fourth victory;',
  ],
  s0075: [
    'you hold the Son of Heaven and strike the rebel—five victories.',
    'you hold the Son of Heaven and punish rebellion—fifth victory.',
  ],
  s0076: [
    'Their will is sharp but their vessel small—one defeat;',
    'Their will is keen but their measure small—first defeat;',
  ],
  s0077: [
    'they have awe but no grace—two defeats;',
    'they inspire fear but grant no grace—second defeat;',
  ],
  s0078: [
    'their soldiers are loosened—three defeats;',
    'their troops are slack—third defeat;',
  ],
  s0079: [
    'the gentry do not cling to them—four defeats;',
    'the gentry do not stand with them—fourth defeat;',
  ],
  s0080: [
    'they hang their army a thousand li away with none of like mind to aid them—five defeats.',
    'they stretch an army a thousand li with no ally of one heart—fifth defeat.',
  ],
  s0081: [
    'Though they have a hundred thousand wolves, in the end they will be ours."',
    'Though jackals number in the tens of thousands, in the end they are yours."',
  ],
  s0082: [
    'The emperor laughed and said, "You talk too much."',
    'The emperor laughed and said, "You overspeak."',
  ],
  s0083: [
    'At that time military reports and memorials were all drafted by Yan.',
    'In those days every army dispatch and memorial passed through Yan\'s hand.',
  ],
  s0084: [
    'When the chief minister\'s office was established, he was made record-keeper staff officer.',
    'When the chief minister\'s office was set up, he became record-keeper on the staff.',
  ],
  s0085: [
    'At the start of Jianyuan he was again valiant-cavalry record-keeper to the Prince of Yuzhang, with concurrent magistrate of Dongwu, charged with edicts and patents and also keeper of the national history.',
    'At Jianyuan\'s opening he was again valiant-cavalry record-keeper to the Prince of Yuzhang, magistrate of Dongwu in addition, drafting edicts and patents and tending the national history.',
  ],
  s0086: [
    'Soon he was promoted to Secretariat Gentleman.',
    'Soon he rose to secretariat gentleman.',
  ],
  s0087: [
    'At the start of Yongming he was made Valiant Cavalry General and kept charge of the national history.',
    'At Yongming\'s opening he became valiant cavalry general and still held the national history.',
  ],
  s0088: [
    'He went out as General Who Establishes Martial Glory and interior magistrate of Luling.',
    'He went out as general who establishes martial glory and Luling interior magistrate.',
  ],
  s0089: [
    'After three years in office he returned as Valiant Cavalry General and concurrent Vice Director of the Masters of Writing; soon he again held his former post with charge as Erudite of the National University.',
    'After three years he returned as valiant cavalry general and vice director of the masters of writing; soon he held the same rank and led the national university as erudite.',
  ],
  s0090: [
    'At the start of the Depraved Emperor\'s reign he held his former post with concurrent Censor.',
    'When the Depraved Emperor began his reign Yan kept his rank and also served as censor.',
  ],
  s0091: [
    'Mingdi was then chief minister and said to Yan, "When you were in the Masters of Writing you never acted without public cause; in office you balanced lenity and severity;',
    'Mingdi was regent and told Yan, "In the secretariat you never moved without public business; in office you could balance mercy and severity;',
  ],
  s0092: [
    'now as southern inspector you are enough to awe and sober the hundred officials."',
    'now as southern inspector you can shake the hundred officials sober."',
  ],
  s0093: [
    'Yan answered, "Today\'s task may be called doing the office as it demands; I only fear talent too slight and will too thin to rise to your bright intent."',
    'Yan answered, "Today\'s charge is to act as the post requires; I only fear my gift is small and my resolve thin for your clear command."',
  ],
  s0094: [
    'Thereupon he impeached Secretariat Director Xie Tiao, Left Chief of Staff to the Minister of Education Wang Ji, and Protecting Army Chief Clerk Yu Hongyuan—all for long illness and failure to attend the mountain tomb rites;',
    'He then impeached secretariat director Xie Tiao, minister of education left chief of staff Wang Ji, and protecting-army chief clerk Yu Hongyuan—for long illness and absence from the imperial tomb rites;',
  ],
  s0095: [
    'he also memorialized against former Yi province inspector Liu Jun and former Liang inspector Yin Zhibo, both for accepting bribes in the tens of thousands, and had them taken at once to the Court for punishment.',
    'he also charged former Yi inspector Liu Jun and former Liang inspector Yin Zhibo with bribes in the tens of thousands and sent them straight to the court for judgment.',
  ],
  s0096: [
    'Linhai prefect Shen Zhaolue, Yongjia prefect Yu Tanlong, and magistrates of two thousand bushels in many commanderies and great counties were largely impeached and disciplined; within and without the court grew stern.',
    'Linhai prefect Shen Zhaolue, Yongjia prefect Yu Tanlong, and many two-thousand-bushel magistrates in great districts were impeached and punished; inside and outside the court turned severe.',
  ],
  s0097: [
    'Mingdi said to Yan, "Since Song times there has been no stern censor like you; today you may be called unmatched in recent generations."',
    'Mingdi told Yan, "Since the Song there has been no censor this stern; you may be called alone in our age."',
  ],
  s0098: [
    'When Mingdi took the throne, Yan was made chief of staff to the Valiant Cavalry Prince of Linhai.',
    'When Mingdi succeeded, Yan became chief of staff to the valiant-cavalry prince of Linhai.',
  ],
  s0099: [
    'Soon he was made Court Commandant with additional appointment as Supplicator, then champion chief of staff with additional appointment as Assistant State General.',
    'Soon he was court commandant and supplicator in addition, then champion chief of staff and assistant state general.',
  ],
  s0100: [
    'He went out as Xuan prefect with his general\'s rank unchanged.',
    'He went out as Xuancheng prefect, general\'s rank unchanged.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_014_b1.mjs <translation.json>'
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
