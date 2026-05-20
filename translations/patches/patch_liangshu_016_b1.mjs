#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 16, Biographies 10',
    'Book of Liang, Volume 16, Biographies 10',
  ],
  s0002: [
    'Wang Liang; Zhang Ji; Wang Ying',
    'Wang Liang; Zhang Ji; Wang Ying',
  ],
  s0003: [
    'Wang Liang, styled Fengshu, was a native of Linyi in Langye; he was sixth-generation descendant of Jin Chancellor Dao.',
    'Wang Liang, styled Fengshu, came from Linyi in Langye—a sixth-generation descendant of Jin Chancellor Dao.',
  ],
  s0004: [
    'His grandfather Yan was Song Right Grand Master of Splendid Happiness, opening the government with ritual equal to the three excellencies.',
    'His grandfather Yan had been Song right grand master of splendid happiness, opening the government with ritual equal to the three excellencies.',
  ],
  s0005: [
    'His father You was Attendant Yellow Gate Gentleman.',
    'His father You was an attendant yellow gate gentleman.',
  ],
  s0006: [
    'Liang was a scion of a famous house; at the end of Song he was chosen to marry a princess, made Commandant of the Horse for the Imperial Son-in-law and Secretary Gentleman, and rose through Literary Scholar to the Prince of Guiyang, Friend to the Prince of Nankang, and Secretary Assistant.',
    'As a son of a great house, at the end of Song he was matched to a princess, made commandant of the horse for the imperial son-in-law and secretary gentleman, and rose through literary scholar to the prince of Guiyang, friend to the prince of Nankang, and secretary assistant.',
  ],
  s0007: [
    'Qi Prince of Jingling Zi Liang opened the Western Lodge, gathering talented men for the Scholars\' Grove Hall and having artisans paint their portraits—Liang was among them.',
    'When Qi\'s prince of Jingling opened the Western Lodge and gathered worthies for the Scholars\' Grove Hall, artisans painted their likenesses—and Liang was among them.',
  ],
  s0008: [
    'He was promoted to Secretariat Gentleman and Chief Staff Officer to the Grand Marshal, and went out as Governor of Hengyang.',
    'He rose to secretariat gentleman and chief staff officer to the grand marshal, then went out as Hengyang governor.',
  ],
  s0009: [
    'Because the southern land was low and humid, he declined the office and was transferred to Attendant Yellow Gate Gentleman.',
    'The south was low and damp; he declined the post and was made attendant yellow gate gentleman.',
  ],
  s0010: [
    'Soon he was appointed Governor of Jinling; in office he was pure and public-spirited, with fine governance.',
    'Soon he was Jinling governor—pure in office, with a reputation for good rule.',
  ],
  s0011: [
    'At the time Qi Emperor Ming was acting as regent; hearing of this he praised him, brought him in as Chief Staff Officer to the Guard General, and greatly favored and received him.',
    'Qi Emperor Ming was then regent; hearing of him he praised him, made him chief of staff to the guard general, and favored him deeply.',
  ],
  s0012: [
    'When Ming took the throne, he rose through offices to Crown Prince Palace Attendant and Director of the Ministry of Personnel—his evaluations won renown—and was promoted to Attendant.',
    'When Ming took the throne, Liang rose to crown prince palace attendant and director of the ministry of personnel—his rankings won fame—and then to attendant.',
  ],
  s0013: [
    'At the end of Jianwu he was Director of the Ministry of Personnel; at the time Right Vice Director of the Masters of Writing Jiang Shi managed court politics, promoted many men, and was where scholars gathered.',
    'Late in Jianwu he headed the ministry of personnel; Right Vice Director Jiang Shi then ran court politics, advanced many men, and drew the gentry to him.',
  ],
  s0014: [
    'Liang, considering himself head of the selection bureau, often held opposing views.',
    'Liang, as head of selection, often took the other side.',
  ],
  s0015: [
    'At first, before Liang was Director of the Ministry of Personnel, because Shi was the emperor\'s brother-in-law he befriended him deeply; Shi spread his reputation, so the emperor valued him all the more;',
    'Earlier, before Liang headed personnel, he had been close to Shi—the emperor\'s brother-in-law—and Shi had praised him, so the throne prized him all the more;',
  ],
  s0016: [
    'but now they were as intimate as before.',
    'yet now they were intimate as ever.',
  ],
  s0017: [
    'When Shi was executed, petty men ran wild—all appointments passed through inner favorites, and Liang could no longer stop them.',
    'When Shi was killed, petty men had their way; every appointment ran through inner favorites, and Liang could not stop it.',
  ],
  s0018: [
    'Outwardly he seemed careful in review, inwardly he lacked clear judgment; those he selected were bound by seniority alone—the age did not call him capable.',
    'Outwardly he seemed careful; inwardly he had no clear eye. He chose by seniority alone, and the age did not call him able.',
  ],
  s0019: [
    'He was repeatedly made Regular Attendant Cavalier Attendant-in-Ordinary, Right Guard Lieutenant to the Crown Prince, Right Vice Director of the Masters of Writing, and Central Army Commander.',
    'He was repeatedly made regular attendant cavalier attendant-in-ordinary, right guard lieutenant to the crown prince, right vice director of the masters of writing, and central army commander.',
  ],
  s0020: [
    'Then Eastern Depravity ran rampant and cruel punishments had their day—Liang leaned this way and that to please and escaped death by a hair.',
    'Then Eastern Depravity raged and cruel punishments ran their course—Liang bent to please and barely escaped death.',
  ],
  s0021: [
    'When the Righteous Army reached Xinlin, officials inside and outside all went out to welcome them; those who could not break away still sent pledges of loyalty by side roads—only Liang sent no one.',
    'When the Righteous Army reached Xinlin, officials within and without went out to welcome them; those who could not leave still sent loyalty by back roads—only Liang sent no one.',
  ],
  s0022: [
    'When the city was settled, he alone was singled out as ringleader.',
    'Once the city was settled, he alone was pushed forward as ringleader.',
  ],
  s0023: [
    'Liang came out to see Gaozu; Gaozu said: "When the toppling man is not supported, what use is that minister!',
    'Liang came out to see Gaozu. Gaozu said, "When the tottering man is not held up, what use is that minister!',
  ],
  s0024: [
    '" Yet he did not punish him.',
    '" Yet he did not punish him.',
  ],
  s0025: [
    'When the Supreme Office opened, he was made Chief Staff Officer to the Grand Marshal, Pacifying Army General, and Governor of both Langye and Qinghe commanderies.',
    'When the supreme office opened, he was made chief of staff to the grand marshal, pacifying army general, and governor of Langye and Qinghe.',
  ],
  s0026: [
    'When the Liang regime was established, he was appointed Attendant and Director of the Masters of Writing; he firmly refused; he was then made Attendant, Director of the Secretariat, and concurrently Director of the Masters of Writing.',
    'When the Liang regime was set up, he was offered attendant and director of the masters of writing; he refused firmly and was made attendant, director of the secretariat, with the masters of writing added.',
  ],
  s0027: [
    'When Gaozu received the abdication, he was promoted to Attendant, Director of the Masters of Writing, and Central Army General, drawn into assisting the mandate, and enfeoffed as Duke of Yuning with two thousand households.',
    'When Gaozu took the mandate, Liang became attendant, director of the masters of writing, and central army general, drawn into founding the state, and was enfeoffed duke of Yuning with two thousand households.',
  ],
  s0028: [
    'In the second year of Tianjian he was transferred to Left Grand Master of Splendid Happiness, Attendant and Central Army unchanged.',
    'In Tianjian\'s second year he was transferred to left grand master of splendid happiness; attendant and central army were unchanged.',
  ],
  s0029: [
    'On New Year\'s Day the myriad states assembled in court; Liang pleaded illness and did not ascend the hall, set out food in a separate office, yet talked and laughed as if at ease.',
    'On New Year\'s Day the myriad states met in court; Liang pleaded illness, did not mount the hall, dined in a side office, and talked and laughed as if at ease.',
  ],
  s0030: [
    'Several days later an edict had the dukes and ministers inquire; Liang showed no sign of illness; Censor-in-Chief Yue Ai memorialized for gross disrespect, penalty of execution in the marketplace.',
    'Days later an edict sent dukes and ministers to inquire; Liang showed no sickness; censor-in-chief Yue Ai memorialized gross disrespect and asked the death penalty in the marketplace.',
  ],
  s0031: [
    'An edict stripped his rank and made him a commoner.',
    'An edict stripped his rank and made him a commoner.',
  ],
  s0032: [
    'In summer of the fourth year Gaozu feasted at Hualin Hall and said to the assembled ministers: "From noon I hear affairs of state, wishing to learn gain and loss.',
    'In summer of the fourth year Gaozu feasted at Hualin Hall and told the ministers, "From noon I hear government, wishing to learn gain and loss.',
  ],
  s0033: [
    'You may be called many scholars—each should fully offer candid counsel."',
    'You are many scholars—each should offer full and frank counsel."',
  ],
  s0034: [
    'Left Assistant Director of the Masters of Writing Fan Zhen rose and said: "Grand Marshal Xie Tiao originally had only empty fame, yet Your Majesty raised him thus; former Director Wang Liang truly had governing merit, yet Your Majesty cast him off like that—this a dull minister cannot understand."',
    'Left assistant director Fan Zhen rose and said, "Grand marshal Xie Tiao had only empty fame, yet Your Majesty raised him so; former director Wang Liang had real governing merit, yet Your Majesty cast him off so—this dull minister cannot understand."',
  ],
  s0035: [
    'Gaozu\'s face changed: "You may speak on other matters."',
    'Gaozu\'s color changed. "You may speak on other matters."',
  ],
  s0036: [
    'Zhen persisted without end; Gaozu was displeased.',
    'Zhen pressed on; Gaozu was displeased.',
  ],
  s0037: [
    'Censor-in-Chief Ren Fang then memorialized:',
    'Censor-in-chief Ren Fang then memorialized:',
  ],
  s0038: [
    'Your servant has heard: Xi Fu\'s successive slander—Han had right punishment;',
    'Your servant has heard that Xi Fu\'s successive slander drew right punishment in Han;',
  ],
  s0039: [
    'Bai Bao\'s one memorial—Jin applied clear penalty.',
    'Bai Bao\'s single memorial drew clear penalty in Jin.',
  ],
  s0040: [
    'How much more for those who fawn on inferiors and slander superiors, whose praise and blame issue from their own mouths?',
    'How much more those who fawn below and slander above, who praise and blame from their own mouths?',
  ],
  s0041: [
    'I have heard that Left Assistant Director Fan Zhen, returning from Jin\'an, told people: "I do not visit others, only Wang Liang;',
    'I have heard that left assistant director Fan Zhen, returning from Jin\'an, said, "I visit no one but Wang Liang;',
  ],
  s0042: [
    'I do not give gifts to others, only Wang Liang."',
    'I give gifts to no one but Wang Liang."',
  ],
  s0043: [
    'I at once arrested Zhen and had his attendant Wan Xiu brought to the bureau for questioning; it matched what was heard.',
    'I at once arrested Zhen and had his attendant Wan Xiu questioned at the bureau; it matched the report.',
  ],
  s0044: [
    'Also on the tenth of this month, at a private feast for Sent-officer to Liang Province Zhen Guo, when the feast was done and the ministers had all withdrawn to pay respects, an edict retained Attendant-in-Ordinary Ang and ten others to inquire into the way of government.',
    'Also on the tenth of this month, at the private feast for the sent-officer to Liang province Zhen Guo, when the feast ended and the ministers had withdrawn to pay respects, an edict kept attendant-in-ordinary Ang and ten others to inquire into government.',
  ],
  s0045: [
    'Zhen did not answer what was asked but launched a torrent of reckless talk, disparaging Grand Marshal Tiao and praising the commoner Wang Liang.',
    'Zhen did not answer what was asked but poured out reckless talk, disparaging grand marshal Tiao and praising the commoner Wang Liang.',
  ],
  s0046: [
    'Your servant at the time was among those retained by grace, shoulder to shoulder standing—what eyes and ears received differs little from hearsay.',
    'Your servant was then among those kept by grace, standing shoulder to shoulder—what eyes and ears took in was scarcely hearsay.',
  ],
  s0047: [
    'I reflect that when the king has outings and pleasures, he personally mounts the steps; the meaning is deep in pushing the cart, the feeling equal to "Dew on the Fronds."',
    'I reflect that when the king takes his pleasure, he mounts the steps in person—the meaning is deep in pushing the cart-wheel, the feeling equal to "Dew on the Fronds."',
  ],
  s0048: [
    'When the wine was spent and the feast ended, he should stand upright before the screen—records before, words after—brooding on the dawn audience\'s cares, deeply seeking the people\'s afflictions—yet Zhen\'s words were insolent, rashly offering praise and blame, harming the orderly wind and lacking the hope of the vacant seat.',
    'When wine ended and the feast broke up, he should stand straight before the screen—records before, words after—mindful of the dawn audience, seeking the people\'s ills—yet Zhen spoke insolently and rashly praised and blamed, harming orderly custom and the hope of the vacant seat.',
  ],
  s0049: [
    'Without severe punishment, law\'s standard will collapse—Zhen is chief among this.',
    'Without severe punishment the law\'s standard will fall—and Zhen is chief among the guilty.',
  ],
  s0050: [
    'Your servant respectfully finds: Left Assistant Director Fan Zhen, coat and cap from a fine line, conduct and words at odds, boasting in his village, clamor in the thoroughfares.',
    'Your servant respectfully finds that left assistant director Fan Zhen, of coat-and-cap lineage, is at odds in word and deed, boasts in his village, and clamors in the streets.',
  ],
  s0051: [
    'Curved learning and flattery—he does not know how to leave the age;',
    'Curved learning and flattery—he does not know how to leave the age;',
  ],
  s0052: [
    'wagging tongue and clucking mouth—only enough to deck out error.',
    'wagging tongue and clucking mouth—only enough to dress up error.',
  ],
  s0053: [
    'When lately the Righteous Army was near, Zhen suffered family calamity; he never called at the gate, but in black hemp and mourning white shadowed the scene, quite like foreknowledge—truly serving the dragon countenance.',
    'When lately the Righteous Army drew near, Zhen suffered family calamity; he never called at the gate but in black hemp and mourning white shadowed the scene like foreknowledge—truly serving the dragon countenance.',
  ],
  s0054: [
    'Now he has joined with the remnants of sedition and turned enemy—man without constancy, accomplishing this treachery.',
    'Now he joins with the remnants of sedition and turns enemy—a man without constancy, accomplishing this treachery.',
  ],
  s0055: [
    'The day when the feast of merit was held, merit slight yet reward thick—out as governor of a famous commandery, in as overseer of a department—gift baskets not forgotten, yet he falsely claimed broken axle; dress in rags, slander stirred out of place, promises and faults discarded, court insult to a noble clan.',
    'At the feast of merit, merit was slight yet reward thick—out as governor of a famous commandery, in as overseer of a department—gift baskets not forgotten, yet he falsely claimed a broken axle; in rags he stirred slander, discarded promises and faults, and insulted a noble clan in court.',
  ],
  s0056: [
    'Since taking the pivot of censorate, memorials of impeachment have been silent.',
    'Since he took the pivot of the censorate, impeachments have been silent.',
  ],
  s0057: [
    'Looking about and indulging, no debate of utmost public right;',
    'He looks about and indulges, with no debate of utmost public right;',
  ],
  s0058: [
    'hating the straight and uglifying the correct, having private impeachment talk.',
    'he hates the straight and uglifies the correct, and has private impeachment talk.',
  ],
  s0059: [
    'He should be placed in fetters to rectify the national statutes.',
    'He should be placed in fetters to rectify the national statutes.',
  ],
  s0060: [
    'Your servant and others jointly recommend: remove Zhen from his present office on the facts before us, and at once command the outer offices to take him and deliver to the law prison of the Court of Justice for punishment.',
    'Your servant and others jointly recommend that Zhen be removed from his present office on the facts before us, and that the outer offices at once take him and deliver him to the Court of Justice law prison for punishment.',
  ],
  s0061: [
    'All who should be implicated and seized, entrust to the prison officers to proceed by statute.',
    'All who should be implicated and seized, entrust to the prison officers to proceed by statute.',
  ],
  s0062: [
    'Zhen\'s post requires yellow paper—your servant hastens to present white bamboo slips.',
    'Zhen\'s post requires yellow paper—your servant hastens to present white bamboo slips.',
  ],
  s0063: [
    'Edict: Approved.',
    'Edict: Approved.',
  ],
  s0064: [
    'An imperial letter reprimanded Zhen: "Liang in youth lacked talent and was unknown among contemporaries; formerly he rashly entered the ranks of worthies—we with one another were not thin; in his later years he flattered Jiang Shi; as Director of Personnel he finally joined with Mei Chong\'er and Ru Fazhen and so held benighted government.',
    'An imperial letter reprimanded Zhen: "Liang in youth lacked talent and was unknown among his peers; formerly he rashly entered the ranks of worthies—we were not thin with one another; in his later years he flattered Jiang Shi; as director of personnel he finally joined Mei Chong\'er and Ru Fazhen and held benighted government.',
  ],
  s0065: [
    'Household upon household met disaster, whole families were scorched; the four seas seethed, the realm collapsed—whose fault is this!',
    'Household upon household met disaster, whole families were scorched; the four seas seethed, the realm collapsed—whose fault is this!',
  ],
  s0066: [
    'He ate the salary of a chaotic lord yet did not die in an age of order.',
    'He ate the salary of a chaotic lord yet did not die in an age of order.',
  ],
  s0067: [
    'Liang solidified with the vicious faction, made might and made blessing, fine clothes and jade food, female musicians filling the rooms; when peril pressed and business forced, they devoured one another.',
    'Liang joined the vicious faction, made might and made blessing, fine clothes and jade food, female musicians filling the rooms; when peril pressed and business forced, they devoured one another.',
  ],
  s0068: [
    'At Jianshi he put his head on the first draft, opened up, and asked only for punishment.',
    'At Jianshi he put his head on the first draft, opened up, and asked only for punishment.',
  ],
  s0069: [
    'I recorded his coming under the white flag and pardoned his past fault.',
    'I recorded his coming under the white flag and pardoned his past fault.',
  ],
  s0070: [
    'Liang was faithless and shifting, corruption and bribes openly violent—what is there to discuss!',
    'Liang was faithless and shifting, corruption and bribes openly violent—what is there to discuss!',
  ],
  s0071: [
    'Rashly to talk and narrate such—fully report by memorial for judgment.',
    'Rashly to talk and narrate such—report fully in a memorial for judgment.',
  ],
  s0072: [
    '" The ten points of censure—Zhen\'s answers were disjointed only.',
    '" The ten points of censure—Zhen\'s answers were disjointed only.',
  ],
  s0073: [
    'Liang then lived in seclusion, swept his quarters, and received no guests.',
    'Liang then lived in seclusion, swept his quarters, and received no guests.',
  ],
  s0074: [
    'When his mother died he observed mourning in full ritual.',
    'When his mother died he observed mourning in full ritual.',
  ],
  s0075: [
    'In the eighth year an edict recalled him as Director of the Secretariat; soon he was further made Regular Attendant Cavalier Attendant-in-Ordinary, and within days was promoted to Minister of Ceremonies.',
    'In the eighth year an edict recalled him as director of the secretariat; soon he was further made regular attendant cavalier attendant-in-ordinary, and within days rose to minister of ceremonies.',
  ],
  s0076: [
    'In the ninth year he was transferred to Director of the Secretariat with additional Cavalier Attendant-in-Ordinary.',
    'In the ninth year he was transferred to director of the secretariat with additional cavalier attendant-in-ordinary.',
  ],
  s0077: [
    'That year he died.',
    'That year he died.',
  ],
  s0078: [
    'An edict granted thirty thousand cash and fifty bolts of cloth for funeral expenses.',
    'An edict granted thirty thousand cash and fifty bolts of cloth for funeral expenses.',
  ],
  s0079: [
    'Posthumous title: Son Yang.',
    'Posthumous title: Son Yang.',
  ],
  s0080: [
    'Zhang Ji, styled Gongqiao, was a native of Wu commandery.',
    'Zhang Ji, styled Gongqiao, was a man of Wu commandery.',
  ],
  s0081: [
    'His father Yong was Song Right Grand Master of Splendid Happiness.',
    'His father Yong was Song right grand master of splendid happiness.',
  ],
  s0082: [
    'Ji\'s birth mother had long been ill; when Ji was eleven he did not unbind his clothes to nurse her—Yong marveled at this.',
    'Ji\'s birth mother had long been ill; when Ji was eleven he would not unbind his clothes to nurse her—Yong marveled at this.',
  ],
  s0083: [
    'When his mother died his grief-wasting exceeded others; he rose only with a staff\'s support.',
    'When his mother died his grief-wasting exceeded others; he rose only with a staff\'s support.',
  ],
  s0084: [
    'By nature he was careless and open, bright and perceptive with talent and stratagem; with his kinsmen Chong, Rong, and Juan he was all famed—the age called them: "Chong, Rong, Juan, and Ji—that is the Four Zhangs."',
    'By nature he was careless and open, bright with talent and stratagem; with his kinsmen Chong, Rong, and Juan he was all famed—the age called them, "Chong, Rong, Juan, and Ji—that is the Four Zhangs."',
  ],
  s0085: [
    'He began office as Editorial Assistant in the Masters of Writing but did not accept; he repeatedly sat parents\' mourning, six years dwelling by the tomb.',
    'He began as editorial assistant in the masters of writing but did not accept; he repeatedly sat parents\' mourning, six years dwelling by the tomb.',
  ],
  s0086: [
    'When mourning ended he was Rapid Cavalry Law Bureau Acting Staff Officer, promoted to Outer Army Staff Officer.',
    'When mourning ended he was rapid-cavalry law bureau acting staff officer, then outer army staff officer.',
  ],
  s0087: [
    'In Qi\'s Yongming era he was Governor of Shan County, scarcely overseeing affairs, often roaming mountains and waters.',
    'In Qi\'s Yongming era he was Shan county magistrate, scarcely overseeing affairs, often roaming mountains and waters.',
  ],
  s0088: [
    'When the bandit Tang Yuzhi rebelled, Ji led and encouraged the county people and preserved the county territory.',
    'When the bandit Tang Yuzhi rebelled, Ji led and encouraged the county people and preserved the county territory.',
  ],
  s0089: [
    'He entered office as Crown Prince Purifier, Eastern Bureau Staff Officer to the Grand Marshal, Friend to the Prince of Jian\'an, and Chief Staff Officer to the Grand Marshal.',
    'He entered as crown prince purifier, eastern bureau staff officer to the grand marshal, friend to the prince of Jian\'an, and chief staff officer to the grand marshal.',
  ],
  s0090: [
    'When Prince of Wuling Ye was Guard General, Ji was transferred to Guard General Staff Officer, soon made Chief Administrator of his native province.',
    'When the prince of Wuling was guard general, Ji was transferred to guard general staff officer, soon made chief administrator of his native province.',
  ],
  s0091: [
    'When Emperor Ming held the governorship, Ji remained as Vice Governor.',
    'When Emperor Ming held the governorship, Ji remained as vice governor.',
  ],
  s0092: [
    'At the time Wei raided Shouchun; Ji was made Pacifying the North General and army commander, assisting Right Vice Director of the Masters of Writing Shen Wenji in guarding Yuzhou.',
    'At the time Wei raided Shouchun; Ji was made pacifying-the-north general and army commander, assisting right vice director Shen Wenji in guarding Yuzhou.',
  ],
  s0093: [
    'Wei forces were said to number a million and besieged the city for many days; all planning and disposition Wenji wholly entrusted to Ji.',
    'Wei forces were said to number a million and besieged the city for many days; all planning and disposition Wenji wholly entrusted to Ji.',
  ],
  s0094: [
    'When the army withdrew, he was promoted to Pacifying the West Staff Officer, Pacifying the North General, and Interior Governor of Nanping.',
    'When the army withdrew, he was promoted to pacifying-the-west staff officer, pacifying-the-north general, and Nanping interior governor.',
  ],
  s0095: [
    'Wei again raided Yong Province; an edict made him with his present title Commander of military affairs in Jing and Yong.',
    'Wei again raided Yong province; an edict made him with his present title commander of military affairs in Jing and Yong.',
  ],
  s0096: [
    'At the time Yong Governor Cao Hu crossed the Fan city shore; Ji was made to know provincial affairs.',
    'At the time Yong governor Cao Hu crossed the Fan city shore; Ji was made to know provincial affairs.',
  ],
  s0097: [
    'When Wei forces withdrew, Ji returned to Jing Province and was at once appointed Yellow Gate Gentleman, again made Staff Officer and Governor of both Xinxing and Yongning commanderies.',
    'When Wei forces withdrew, Ji returned to Jing province and was at once appointed yellow gate gentleman, again made staff officer and governor of Xinxing and Yongning.',
  ],
  s0098: [
    'The commandery violated a private taboo, so Yongning was changed to Changning.',
    'The commandery violated a private taboo, so Yongning was changed to Changning.',
  ],
  s0099: [
    'Soon he was promoted to Grand Marshal Staff Officer with additional Assistant State General.',
    'Soon he was promoted to grand marshal staff officer with additional assistant state general.',
  ],
  s0100: [
    'When Jiangzhou Inspector Chen Xianda raised troops in rebellion, with his present title he was made Governor of both Liyang and Nanqiao commanderies, promoted to Pacifying the South Chief Staff Officer, Xunyang Governor, Assistant State General, and Acting Jiangzhou Affairs.',
    'When Jiangzhou inspector Chen Xianda raised troops in rebellion, with his present title he was made governor of Liyang and Nanqiao, promoted to pacifying-the-south chief staff officer, Xunyang governor, assistant state general, and acting Jiangzhou affairs.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_016_b1.mjs <translation.json>'
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
