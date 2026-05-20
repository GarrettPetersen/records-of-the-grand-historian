#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He Chengtian, setting a new ratio in accord with Heaven, then from Middle Bell Female returns to Yellow Bell; the twelve rotating palaces—sound and pitch are without loss.',
    'He Chengtian\'s new ratio returns from Middle Bell Female to Yellow Bell; the twelve rotating modes preserve pitch without error.',
  ],
  s0102: [
    'Yellow Bell is nine cun long; Great Cluster is eight cun two li; Forest Bell is six cun one li; Responding Bell is four cun seven fen nine li and a fraction strong.',
    'Yellow Bell nine cun; Great Cluster eight cun two li; Forest Bell six cun one li; Responding Bell four cun seven fen nine li and a fraction.',
  ],
  s0103: [
    'The portion added by Middle Bell Female\'s upward generation again yields 177,147—the number multiplied through the twelve double-hour periods.',
    'The increment from Middle Bell Female\'s upward generation again yields 177,147—the full twelve-period product.',
  ],
  s0104: [
    'At the beginning of Liang, following Jin, Song, and Qi, no reforms were made.',
    'Early Liang retained the systems of Jin, Song, and Qi without change.',
  ],
  s0105: [
    'Later Emperor Wu wrote the Treatise on Bell Standards and Pitch Pipes, discussing the gains and losses of previous ages.',
    'Later Emperor Wu of Liang wrote the Treatise on Bell Standards and Pitch Pipes, reviewing earlier successes and failures.',
  ],
  s0106: [
    'The summary says:',
    'In summary:',
  ],
  s0107: [
    'Examining pitch pipes and bell tones: Jing Fang, Ma Rong, Zheng Xuan, and Cai Yong, up to Luxuriant Guest, all generate Great Bell upward;',
    'On pitch pipes: Jing Fang, Ma Rong, Zheng Xuan, and Cai Yong all generate Great Bell upward through Luxuriant Guest;',
  ],
  s0108: [
    'But Ban Gu\'s Treatise on Pitch Standards and the Calendar, up to Luxuriant Guest, still generates downward in sequence.',
    'Ban Gu\'s Treatise, however, generates downward in sequence through Luxuriant Guest.',
  ],
  s0109: [
    'If one follows Ban\'s meaning, Pinched Bell would be only three cun seven fen and a fraction long.',
    'Following Ban\'s view, Pinched Bell would measure only three cun seven fen and a fraction.',
  ],
  s0110: [
    'If the pitch standard is too short, then Pinched Bell\'s sound becomes a single mode, and Middle Bell Female again loses half a mode—this is excessive lack of mode.',
    'Overly short pipes make Pinched Bell a single mode and Middle Bell Female lose half a mode—leaving the system without proper tuning.',
  ],
  s0111: [
    'Mid-spring and early summer are precisely when growth and nourishment proceed; the qi is relaxed and slow—it cannot tolerate shortness and urgency.',
    'Mid-spring and early summer nurture growth; the qi flows gently and cannot be compressed into overly short pipes.',
  ],
  s0112: [
    'Seeking sound and verifying reality, Ban\'s meaning is mistaken.',
    'Measured against acoustic reality, Ban\'s interpretation fails.',
  ],
  s0113: [
    'Zheng Xuan also used the six positions of yin and yang, generating in sequence.',
    'Zheng Xuan also arranged generation by the six yin-yang positions in sequence.',
  ],
  s0114: [
    'If one follows Xuan\'s meaning, yin and yang generating in mutual pursuit—only ascending yang is accounted for; where then is descending yang placed?',
    'On Zheng\'s view, mutual yin-yang generation accounts only for ascending yang—leaving nowhere for descending yang.',
  ],
  s0115: [
    'Speaking in terms of divination numbers: Qian governs jia and ren and moves left; Kun governs yi and gui and moves right—therefore yin and yang can have the meaning of ascent and descent.',
    'In divination terms, Qian governs jia and ren moving left, Kun governs yi and gui moving right—giving yin and yang their ascending and descending roles.',
  ],
  s0116: [
    'Yin and yang following in movement is true nature; the six positions ascending and descending is symbolic number.',
    'Yin-yang in motion is true nature; the six positions rising and falling are symbolic numbers.',
  ],
  s0117: [
    'Now Zheng holds symbolic number to match true nature; therefore his words compare but reason is exhausted.',
    'Zheng forced symbolic numbers onto true nature—his analogy collapses under scrutiny.',
  ],
  s0118: [
    'Speaking of nine and six generating each other, he entirely fails to explain why the twelve qi connect; Zheng\'s failure to think is already clear.',
    'His talk of nine and six generating each other never explains how the twelve qi connect—Zheng simply did not think it through.',
  ],
  s0119: [
    'Examining Jing Fang\'s sixty pitch standards, pushing by the proper law, there is naturally no discrepancy.',
    'Jing Fang\'s sixty standards, properly calculated, are internally consistent.',
  ],
  s0120: [
    'But the pitch pipes and bell tones obtained are sometimes five, sometimes six—this is the first irregularity.',
    'Yet the resulting pitch values are sometimes five, sometimes six—the first irregularity.',
  ],
  s0121: [
    'Yet Fen Yan generates upward, then again Chi Nei generates Sheng Bian upward, and Sheng Bian again generates Fen Ju upward—this is the second irregularity.',
    'Fen Yan generates upward, then Chi Nei generates Sheng Bian, which generates Fen Ju—this is the second irregularity.',
  ],
  s0122: [
    'Fang exhaustively mastered yin and yang; there must be a reason for this—if it is not that the deep principle is hard to seek, then the transmitters did not understand the practice.',
    'Fang mastered yin-yang theory; either the deep principle is elusive or later transmitters did not understand his method.',
  ],
  s0123: [
    'An edict ordered detailed investigation, but none could distinguish and correct it.',
    'An imperial order demanded clarification, but no one could resolve the discrepancies.',
  ],
  s0124: [
    'For the moment, in spare time, I tried to deduce its intent, compared old instruments and the ancient Pinched Bell jade pitch standard, and made a new foot measure to verify fen and hao, making four instruments called the Tong.',
    'In spare time I deduced the theory, compared old instruments with the ancient Pinched Bell jade pipe, made a new ruler to verify measurements, and created four instruments called the Tong.',
  ],
  s0125: [
    'The four instruments have nine chi between the strings; the bridge height is one cun two fen.',
    'The four instruments span nine chi between strings, with bridge height of one cun two fen.',
  ],
  s0126: [
    'The Yellow Bell string has 270 silk threads, nine chi long; by adding or subtracting one-third in sequence, the silk thread counts and string lengths of the twelve pitch standards are generated.',
    'The Yellow Bell string uses 270 silk threads nine chi long; tripling or dividing by three in sequence yields the twelve pitch strings.',
  ],
  s0127: [
    'Each takes the month established by the pitch root, the waxing and waning of the five phases, the beginning and ending notes, and the principle of successive order as its name and meaning—called the Tong.',
    'Each was named by the month of its pitch root, the five phases\' waxing and waning, and the logic of successive tones—the Tong instruments.',
  ],
  s0128: [
    'The Tong applied to three strings; transmitting and deducing monthly qi, all were without error.',
    'Applied to three strings, the monthly qi calculations matched without error.',
  ],
  s0129: [
    'Taking the Pinched Bell jade pitch standard to tune them, they matched each other.',
    'Tuned against the Pinched Bell jade pipe, they matched perfectly.',
  ],
  s0130: [
    'Twelve flutes were also made to reproduce the Tong sounds.',
    'Twelve flutes were also made to replicate the Tong sounds.',
  ],
  s0131: [
    'The Pinched Bell flute\'s twelve modes, tested against the jade pitch standard, showed no discrepancy.',
    'The Pinched Bell flute\'s twelve modes matched the jade pitch standard without deviation.',
  ],
  s0132: [
    'Shan Qianzhi\'s Record says: "The three bells before the hall are all the Pitchless cast by King Jing of Zhou."',
    'Shan Qianzhi\'s Record states: "The three hall bells are all Pitchless bells cast by King Jing of Zhou."',
  ],
  s0133: [
    'Musicians were sent to test with the new Pitchless flute of today—they did not match.',
    'Musicians tested them with the current Pitchless flute—they did not match.',
  ],
  s0134: [
    'Testing with the Luxuriant Guest flute, sound and pitch harmonized.',
    'With the Luxuriant Guest flute, the tones harmonized.',
  ],
  s0135: [
    'The bell outside the Duan Gate—examining its inscription, it is fixed as Luxuriant Guest.',
    'The bell outside the Duan Gate, its inscription confirms it as Luxuriant Guest.',
  ],
  s0136: [
    'One bell in the west wing—in the Tianjian era was moved to the east.',
    'One west-wing bell was moved east in the Tianjian era.',
  ],
  s0137: [
    'Testing with today\'s flute, it matched Southern Bell Female.',
    'Tested with the current flute, it matched Southern Bell Female.',
  ],
  s0138: [
    'Verifying its inscription, it is actually Great Cluster—two modes below today\'s flute.',
    'Its inscription reads Great Cluster—two modes lower than the current flute.',
  ],
  s0139: [
    'An edict was sent to Grand Music Director Si Xuanda ordering further verification; the bell\'s fixed point had chisel marks, the same inside and out.',
    'Si Xuanda was ordered to re-examine the bell; chisel marks at the tuning point appeared on both sides.',
  ],
  s0140: [
    'Consulting old acquaintances, it was in Song\'s Taishi era that Zhang Yong was sent to chisel it; much copper was removed, and therefore its pitch was too low.',
    'Old records show Zhang Yong chiseled it in Song\'s Taishi era, removing so much copper that its pitch dropped.',
  ],
  s0141: [
    'From this, investigating bell standards and pitch pipes, the truth can be seen.',
    'Thus investigating bell and pitch standards reveals the truth.',
  ],
  s0142: [
    'When Song Wu pacified the Central Plains, he sent General Chen Qing to deliver three bells—small, medium, and large, one each.',
    'When Liu Song\'s Emperor Wu pacified the north, General Chen Qing delivered three bells—small, medium, and large.',
  ],
  s0143: [
    'These are the two bells before today\'s Hall of Supreme Ultimate and the one bell outside the Duan Gate.',
    'These are the two Supreme Ultimate Hall bells and the Duan Gate bell of today.',
  ],
  s0144: [
    'Examining the west bell\'s inscription, it says "Pure Temple Strike Bell"; Qin had no Pure Temple—this is clearly Zhou practice.',
    'The west bell\'s inscription reads "Pure Temple Strike Bell"; Qin had no Pure Temple—clearly a Zhou bell.',
  ],
  s0145: [
    'Another inscription says "Great Cluster Bell Zhi"—this is what Forest Bell palace uses.',
    'Another reads "Great Cluster Bell Zhi"—used in Forest Bell palace mode.',
  ],
  s0146: [
    'Jing Fang\'s deductions in use seem to have a basis.',
    'Jing Fang\'s method appears to have sound reasoning.',
  ],
  s0147: [
    'Examining the inscriptions, with no Qin or Han date, only saying Luxuriant Guest and Great Cluster—they are clearly not Qin or Han.',
    'The inscriptions bear no Qin or Han dates, only Luxuriant Guest and Great Cluster—not Qin or Han work.',
  ],
  s0148: [
    'People of antiquity by nature made servant-boy characters in inscriptions; speaking from the inscriptions, this further verifies they are not recent.',
    'Ancient craftsmen used servant-boy script in inscriptions—confirming these are not recent pieces.',
  ],
  s0149: [
    'Moreover, verifying sound to reform government—the five notes and six pitch standards cannot differ and err.',
    'Sound must be verified to govern properly—the five notes and six standards cannot be mistaken.',
  ],
  s0150: [
    'Craftsmen guard the sounds; Confucians hold the texts—over years and ages, separated and not communicating.',
    'Craftsmen preserved the sounds while scholars held the texts—over centuries they lost contact.',
  ],
  s0151: [
    'Not to mention musical performance—much is missing in inquiry; even if fully preserved, it still could not be used.',
    'Musical performance itself is largely lost; even if texts survived intact, they could not be applied.',
  ],
  s0152: [
    'Zhou hymns and Han songs each narrate merit and virtue—how could they be applied again to later kings, corrupting names and reality?',
    'Zhou hymns and Han songs celebrate specific achievements—how could they be reused for later rulers?',
  ],
  s0153: [
    'Now, following detailed discussion, I state what I have seen, and also edict the hundred offices to seek the balanced mean.',
    'I now present my findings and order the hundred offices to seek the balanced standard.',
  ],
  s0154: [
    'Before reform could be completed, the Hou Jing rebellion came.',
    'Reform was interrupted by the Hou Jing rebellion.',
  ],
  s0155: [
    'Chen\'s institutions also had no reforms.',
    'Chen made no reforms either.',
  ],
  s0156: [
    'In the first year of Western Wei\'s Deposed Emperor, Zhou Wen held regency.',
    'In Western Wei\'s first year of the Deposed Emperor, Yuwen Tai held regency.',
  ],
  s0157: [
    'An edict again ordered Minister of Works Su Chuo to examine and correct pitch and pitch standards.',
    'An edict ordered Minister Su Chuo to examine and correct pitch standards.',
  ],
  s0158: [
    'Chuo at the time obtained a Song foot measure to fix all pipes; the draft was not completed when Emperor Min received the Mandate; government was held by the regent; there was Qi invasion—the matter ultimately did not proceed.',
    'Su Chuo obtained a Song foot measure to calibrate the pipes, but the project was unfinished when Emperor Min ascended; with Qi invading, the work never proceeded.',
  ],
  s0159: [
    'Later, excavating the Grand Granary, an ancient jade dipper was found; using it to make pitch standards and steelyard weights, much of the matter was again lost.',
    'Later an ancient jade dipper was found in the Grand Granary; used to make pitch pipes and weights, but much was again lost.',
  ],
  s0160: [
    'At the beginning of Kaihuang, an edict ordered Grand Master of Ceremonies Niu Hong to discuss fixing pitch pipes and bell tones.',
    'At Kaihuang\'s opening, Grand Master Niu Hong was ordered to fix pitch and bell standards.',
  ],
  s0161: [
    'Thereupon scholars were broadly summoned to set forth and discuss the method, but again no decision could be reached.',
    'Scholars were summoned to debate the method, but no consensus emerged.',
  ],
  s0162: [
    'When the Jiang region was pacified, twelve Chen pitch pipes were obtained and all given to Hong.',
    'After pacifying the south, twelve Chen pitch pipes were delivered to Niu Hong.',
  ],
  s0163: [
    'Those skilled in pitch were sent—Chen, Governor of Shanyang Mao Shuang, and Grand Music Director Cai Ziyuan, Yu Puming, and others—to observe seasonal nodes and compose the Treatise on Pitch Standards.',
    'Pitch experts including Mao Shuang of Shanyang and Grand Music Director Cai Ziyuan were sent to observe seasonal nodes and write the Treatise on Pitch Standards.',
  ],
  s0164: [
    'At the time Shuang was old; he was received by the High Ancestor as a commoner and offered the post of Governor of Huai Province; he declined and did not take office.',
    'Mao Shuang, though elderly, was received by Emperor Wen as a commoner and offered Huai Province; he declined.',
  ],
  s0165: [
    'Therefore Pitch-Harmonizing Official Zu Xiaosun was sent to him to receive the method.',
    'Pitch-Harmonizing Official Zu Xiaosun was sent to learn the method from him.',
  ],
  s0166: [
    'Hong also took these pipes and blew them to fix the sounds.',
    'Niu Hong also used these pipes to establish the pitch.',
  ],
  s0167: [
    'Once the realm was unified, objects of different ages all gathered in the Music Office; those skilled in pitch largely debated and examined to fix bell and pitch standards.',
    'With unification, instruments from all eras gathered at the Music Office; pitch experts debated to fix bell and pitch standards.',
  ],
  s0168: [
    'New instruments were made to accompany the fourteen movements of "August Sovereign"; the High Ancestor listened with court worthies and said: "This sound is flowing and harmonious, making one relaxed and at ease."',
    'New instruments accompanied the fourteen "August Sovereign" movements; Emperor Wen listened with his court and said: "This music flows harmoniously and puts one at ease."',
  ],
  s0169: [
    'Close quotation mark.',
    'End of quotation.',
  ],
  s0170: [
    'Yet the ten thousand things and human affairs—without the five phases they are not born, without the five phases they are not completed, without the five phases they are not extinguished.',
    'All things and human affairs depend on the five phases for birth, completion, and extinction.',
  ],
  s0171: [
    'Therefore the five notes use the fire foot measure; fire is the weighty matter.',
    'The five notes therefore use the fire foot measure—fire being the dominant element.',
  ],
  s0172: [
    'Using the metal foot measure brings warfare; using the wood foot measure brings mourning; using the earth foot measure brings disorder; using the water foot measure brings pitch pipes and bell tones in harmony and peace under Heaven.',
    'The metal measure brings war, wood brings mourning, earth brings disorder—but the water measure harmonizes pitch and brings peace.',
  ],
  s0173: [
    'Wei and Zhou and Qi, coveting the length of cloth and silk, therefore used the earth foot measure.',
    'Wei, Zhou, and Qi, seeking longer cloth measures, used the earth foot measure.',
  ],
  s0174: [
    'Now this musical sound uses the water foot measure.',
    'The current music uses the water foot measure.',
  ],
  s0175: [
    'The Jiangdong foot measure is shorter than earth and longer than water.',
    'The Jiangdong measure is shorter than the earth measure but longer than the water measure.',
  ],
  s0176: [
    'Those among the common people who do not know, seeing jade work call it the jade foot measure, seeing iron work call it the iron foot measure.',
    'Common people, seeing jade instruments call them jade measures, seeing iron ones call them iron measures.',
  ],
  s0177: [
    'An edict ordered the use of water foot measure pitch music; the metal and stone of previous ages were all recast and destroyed, to quiet objectors\' debate.',
    'An edict mandated water-measure pitch music; older metal and stone instruments were recast to silence debate.',
  ],
  s0178: [
    'In the fourth year of Renshou, Liu Zhuo submitted a memorial to the Eastern Palace, discussing Zhang Zhouxuan\'s calendar and also discussing pitch pipes and bell tones.',
    'In Renshou 4, Liu Zhuo memorialized the crown prince on Zhang Zhouxuan\'s calendar and pitch standards.',
  ],
  s0179: [
    'The main point says: "Music is governed by notes; notes are fixed by pitch standards; without pitch standards, notes cannot be harmonized; balancing pitch standards and bell tones lies herein."',
    'His main argument: "Music depends on notes, notes on pitch standards—without standards, harmony is impossible; balancing standards and bells is essential."',
  ],
  s0180: [
    'But pitch standards end at Lesser Bell and the number returns to Yellow Bell; the old calculation was not precise and never returns to the beginning.',
    'Standards end at Lesser Bell and return to Yellow Bell, but old calculations were imprecise and never truly cycled back.',
  ],
  s0181: [
    'Therefore Han\'s Jing Fang arbitrarily made sixty, and Song\'s Qian Yuezhi further made three hundred and sixty.',
    'Hence Han\'s Jing Fang arbitrarily devised sixty standards, and Song\'s Qian Yuezhi three hundred sixty.',
  ],
  s0182: [
    'Examining ritual order—how can this be acceptable? If custom does not shift with the wind, I fear it will be because of this.',
    'Examined against ritual order, this is untenable—and customs may suffer accordingly.',
  ],
  s0183: [
    'Not only are length and shortness wrong in their discrepancy—the bore circumference also deviates in its number.',
    'Not only are lengths wrong—the pipe bore circumferences are also incorrect.',
  ],
  s0184: [
    'Also, the intended fixed dimensions cannot be examined in detail; both strings and pipes are confused, and measures and quantities are also wrong.',
    'The intended dimensions cannot be verified in detail; strings, pipes, and all measures are confused.',
  ],
  s0185: [
    'Zhuo all corrected and fixed them, hoping for clarity.',
    'Liu Zhuo corrected all of these, seeking clarity.',
  ],
  s0186: [
    'His Yellow Bell pipe has 63 as the solid value; for each pitch standard in sequence, subtract three parts; using seven as the cun method.',
    'His Yellow Bell pipe used 63 as the base; each subsequent standard subtracted three parts, with seven as the cun divisor.',
  ],
  s0187: [
    'Reducing: Yellow Bell is nine cun long; Great Cluster eight cun one fen four li; Forest Bell six cun; Responding Bell four cun two fen eight li seven-fourths.',
    'This yielded Yellow Bell nine cun, Great Cluster eight cun one fen four li, Forest Bell six cun, Responding Bell four cun two fen eight li and seven-fourths.',
  ],
  s0188: [
    'That year the High Ancestor died; when Emperor Yang first ascended, there was no leisure for reform—the matter was abandoned.',
    'That year Emperor Wen died; Emperor Yang had no time for reform and the project lapsed.',
  ],
  s0189: [
    'His book is also lost.',
    'His treatise was lost as well.',
  ],
  s0190: [
    'In the second year of Daye, an edict ordered changing to use Liang\'s external pitch standard to tune bells, chime stones, and the eight timbres—in comparison with previous ages, this was most in accord with antiquity.',
    'Daye 2 ordered adoption of Liang\'s external pitch standard for bells, chimes, and the eight timbres—the most antiquity-conforming system yet.',
  ],
  s0191: [
    'The institutional documents and discussions, together with Mao Shuang\'s old pitch standards, were all lost at Jiangdu.',
    'The institutional records and Mao Shuang\'s old standards were all lost at Jiangdu.',
  ],
  s0192: [
    '○ Bore Circumference and Millet Capacity of Pitch Pipes',
    '○ On Pipe Bore Circumference and Millet Capacity',
  ],
  s0193: [
    'The Han Treatise says: "Yellow Bell circumference nine fen; Forest Bell circumference six fen; Great Cluster circumference eight fen."',
    'The Han Treatise gives: Yellow Bell bore nine fen, Forest Bell six fen, Great Cluster eight fen.',
  ],
  s0194: [
    'The Continuation Treatise and Zheng Xuan both say: "The twelve pitch standard bores all have diameter three fen, circumference nine fen."',
    'The Continuation Treatise and Zheng Xuan both state: all twelve pipes have diameter three fen, circumference nine fen.',
  ],
  s0195: [
    'Northern Wei\'s Prince of Anfeng, following Ban Gu\'s Treatise, made Forest Bell bore circumference six fen and Great Cluster bore circumference eight fen; blowing them as pitch standards, they did not match Yellow Bell\'s shang and zhi sounds.',
    'Northern Wei\'s Prince of Anfeng, following Ban Gu, made Forest Bell six fen and Great Cluster eight fen bore—but they failed to produce Yellow Bell\'s shang and zhi tones.',
  ],
  s0196: [
    'All with bore circumference nine fen then matched the balanced bell instrument.',
    'Only nine-fen bore circumferences matched the balanced bell instrument.',
  ],
  s0197: [
    'After pacifying Chen in the ninth year of Kaihuang, Niu Hong, Xin Yanzhi, Zheng Yi, He Tuo, and others, consulting ancient pitch standard measures of each era, made Yellow Bell pipes—all diameter three fen, length nine cun.',
    'After pacifying Chen in Kaihuang 9, Niu Hong, Xin Yanzhi, Zheng Yi, and He Tuo made Yellow Bell pipes of each era—all three fen diameter, nine cun long.',
  ],
  s0198: [
    'The measure had additions and subtractions, therefore sounds had high and low;',
    'Measure variations produced pitch differences;',
  ],
  s0199: [
    'circumference, diameter, length, and shortness differ with the measure, therefore millet capacity differs.',
    'bore size and length varied with the measure, so millet capacity differed.',
  ],
  s0200: [
    'Now their numbers are listed below.',
    'Their values are listed below.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/patch_suishu_016_b02.mjs <translation.json>');
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

const identical = data.sentences.filter((s) => s.literal.trim() === s.idiomatic.trim());
if (identical.length) {
  console.error(`Identical: ${identical.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
