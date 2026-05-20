#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Since there have been Heaven and Earth, and since there have been people and things, in establishing rulers to govern and in setting forth government and teaching to accomplish their tasks, none have failed to take the great images of Heaven and Earth as their model, to receive the Mean and Harmony in establishing the supreme standard, to measure the hidden depths of shadow and influence, and to achieve the subtle refinements of pitch pipes and bell tones.',
    'From the moment Heaven and Earth existed and humanity arose, every ruler who governed and every state that taught its people modeled itself on the cosmos, drew on cosmic balance to set standards, read nature\'s hidden signs, and perfected the science of pitch and measure.',
  ],
  s0002: [
    'By this means they encompassed the hundred measures and completed the myriad things.',
    'Thus they regulated all standards and shaped the ten thousand kinds of things.',
  ],
  s0003: [
    'In antiquity, in the pure ancient age, reed pipes first revealed the source of human sounds; Nüwa\'s sheng and huang still proclaimed the beginning of the phoenix pitch.',
    'In deepest antiquity, reed flutes first disclosed the origin of human music; Nüwa\'s reed pipes still marked the first phoenix-toned pitch.',
  ],
  s0004: [
    'Later sages expanded the enterprise and honored antiquity ever more highly: Ling Lun\'s Han Shao mastered the craft of comparing bamboo tubes; Shun of Yu with Zhao Hua transmitted the beauty of carving jade.',
    'Later sages enlarged the tradition and revered the past: Ling Lun\'s "Containing the Lesser" perfected the art of calibrated bamboo pipes; Yu Shun\'s Bright Splendor preserved the craft of jade pitch pipes.',
  ],
  s0005: [
    'Therefore the Book of Documents says: "The seasons, the months, the corrected day, and the pitch pipes, measures, and weights are all in accord."',
    'Hence the Documents states: "Align the seasons, months, and corrected day with unified pitch pipes, measures, and weights."',
  ],
  s0006: [
    'It also says: "I wish to hear the six pitch standards, the five notes, the eight timbres, and the seven beginnings chanted, so as to bring forth and receive the five words."',
    'It also says: "I desire to hear the six pitch standards, five tones, eight timbres, and seven beginnings sung, to produce and receive the five-word verses."',
  ],
  s0007: [
    'All these await the constant of metal to array the pipes, rely on the armillary sphere to turn the steelyard, unify the origin of the three ultimates, and record the resonance of the seven armillary rings—they can be used to make music and exalt virtue, and abundantly to offer to the Supreme Lord.',
    'These all depend on metal bells to set the pipes, on the armillary instrument to drive the steelyard, to unify the three cosmic poles and mark the seven celestial harmonies—making music to ennoble virtue and richly offering worship to Heaven.',
  ],
  s0008: [
    'Therefore they can move Heaven and Earth, touch spirits and ghosts, harmonize human hearts, transform customs, examine gain and loss, and verify success and failure.',
    'Music thus moves Heaven and Earth, stirs spirits, harmonizes hearts, changes customs, and reveals success or failure.',
  ],
  s0009: [
    'In Xia and Shang, nothing is recorded of changes or new creations.',
    'Under Xia and Shang, no alterations to the system are recorded.',
  ],
  s0010: [
    'In the Rites of Zhou, in the section on pitch concordance, it states: "He manages the harmony of the six pitch standards and six concordances, to distinguish the sounds of Heaven and Earth, the four directions, yin and yang, and to make them into musical instruments."',
    'The Rites of Zhou\'s section on pitch concordance says: "He oversees the harmony of the six pitch standards and six concordances, distinguishing the sounds of Heaven, Earth, the four directions, and yin and yang, for use in instruments."',
  ],
  s0011: [
    'When King Jing cast bells, he inquired about pitch from Leng Zhoujiu, who replied: "Pitch standards are what establish the steelyard and produce measures."',
    'When King Jing of Zhou cast bells, he asked Leng Zhoujiu about pitch; the reply was: "Pitch standards establish the steelyard and derive all measures."',
  ],
  s0012: [
    'When the steelyard has five parts, then scales, steelyard-weights, compasses, squares, plumb lines, and measuring cords are all complete.',
    'With five parts to the steelyard, scales, weights, compasses, squares, plumb lines, and measuring cords all follow.',
  ],
  s0013: [
    'Thus the Odes say: "The Grand Master Yin, holding the state\'s steelyard, assists the Son of Heaven and keeps the multitude from going astray"—this is the meaning.',
    'As the Odes put it: "Grand Master Yin holds the nation\'s steelyard, assists the Son of Heaven, and keeps the people from losing their way."',
  ],
  s0014: [
    'Grand Historian Sima Qian\'s Treatise on Pitch Standards says: "The king, in establishing affairs and setting things in order, with laws, measures, and rules, takes the six pitch standards as the single source—the root of the ten thousand affairs."',
    'Sima Qian\'s Treatise on Pitch Standards states: "The king, in ordering affairs and setting standards, derives all laws and measures from the six pitch standards—the foundation of everything."',
  ],
  s0015: [
    'In military weapons, they are especially valued.',
    'They are held in particular esteem for military equipment.',
  ],
  s0016: [
    'Therefore it is said: "Gazing at the enemy reveals good or ill fortune; hearing sounds predicts victory or defeat."',
    'Hence the saying: "Look at the enemy and know fortune or misfortune; listen to sounds and foretell victory or defeat."',
  ],
  s0017: [
    'This is the Way that the hundred kings have never changed.',
    'This is the unchanging principle of all dynasties.',
  ],
  s0018: [
    'Close quotation mark.',
    'End of quotation.',
  ],
  s0019: [
    'When the Qin dynasty extinguished learning, this Way gradually declined.',
    'After Qin suppressed scholarship, the tradition faded.',
  ],
  s0020: [
    'When the Han house first rose, Chancellor Zhang Cang was the first to speak of pitch and pitch standards, but he could not examine and complete them fully.',
    'At Han\'s founding, Chancellor Zhang Cang first addressed pitch standards but could not complete a thorough review.',
  ],
  s0021: [
    'Emperor Wu of Han newly established the office of pitch-harmonizing official; Sima Qian\'s account of the order of mutual generation among pitch pipes and bell tones is detailed.',
    'Emperor Wu created the office of pitch harmonizer; Sima Qian gave a full account of how pitch pipes and bell tones generate one another.',
  ],
  s0022: [
    'At the time of Wang Mang, pitch standards were examined and discussed; Liu Xin submitted a detailed memorial, and Ban Gu recorded it in his Treatise.',
    'Under Wang Mang, pitch standards were re-examined; Liu Xin submitted a detailed report, which Ban Gu incorporated into his Treatise.',
  ],
  s0023: [
    'Cai Yong also recorded those who discussed pitch pipes and bell tones after the Jianwu era; Sima Shao continued and compiled their work.',
    'Cai Yong recorded post-Jianwu discussions of pitch and bell tones; Sima Shao collected and continued them.',
  ],
  s0024: [
    'As the Han calendar neared its end, the realm fell into great disorder; music workers scattered and perished, and instruments and methods were lost.',
    'When Han neared collapse, the empire descended into chaos; musicians fled, and instruments and methods vanished.',
  ],
  s0025: [
    'Cao Wu of Wei first obtained Du Kui and had him fix the pitch standards; Kui relied on the scales of the time and provisionally restored the canonical regulations.',
    'Wei\'s Cao Cao first acquired Du Kui and charged him with fixing pitch standards, using contemporary measures to restore the canonical system as best he could.',
  ],
  s0026: [
    'When Emperor Wu of Jin received the Mandate, he followed this without change.',
    'Jin\'s Emperor Wu kept the system unchanged.',
  ],
  s0027: [
    'In the tenth year of Taishi, Palace Attendant Xun Xu memorialized to create new measures and recast the pitch pipes and bell tones.',
    'In Taishi 10, Palace Attendant Xun Xu proposed new standard measures and a recasting of the pitch pipes.',
  ],
  s0028: [
    'In the Yuankang era, Xu\'s son Fan again succeeded to the task.',
    'During Yuankang, Xu\'s son Fan took up the work again.',
  ],
  s0029: [
    'Before success was achieved, the Yongjia turmoil came; the canonical regulations of the central court were all lost to Shi Le.',
    'Before the project finished, the Yongjia upheaval struck; the central court\'s standards were lost to Shi Le.',
  ],
  s0030: [
    'When the emperor moved south, imperial institutions were still rudimentary; ritual forms and musical instruments were swept away entirely.',
    'After the court fled south, institutions were still primitive; ritual and musical equipment were utterly destroyed.',
  ],
  s0031: [
    'Although some were gradually gathered again, many were lost; down to the Gong and An reigns, the system was never fully restored.',
    'Some materials were recovered, but much was lost forever; through the Gong and An reigns, the system remained incomplete.',
  ],
  s0032: [
    'Song\'s Qian Yuezhi extended Jing Fang\'s sixty pitch standards to three hundred and sixty; Liang Academician Shen Chong set forth their names and numbers.',
    'Song\'s Qian Yuezhi expanded Jing Fang\'s sixty pitch standards to three hundred sixty; Liang scholar Shen Chong recorded their names and values.',
  ],
  s0033: [
    'Later Wei, Zhou, and Qi each had their own theorists.',
    'Northern Wei, Northern Zhou, and Northern Qi all produced their own theorists.',
  ],
  s0034: [
    'Now, following Ban\'s Treatise, the pitch standards, measures, and weights of five dynasties are compiled and recorded in this chapter.',
    'Following Ban Gu\'s Treatise, this chapter records the pitch standards, measures, and weights of five dynasties.',
  ],
  s0035: [
    'The Han Treatise on pitch standards speaks of five aspects: first, complete numbers; second, harmonizing sounds; third, examining measures; fourth, commended capacity; fifth, steelyard and weights.',
    'The Han Treatise lists five aspects of pitch standards: complete numbers, harmonizing sounds, examining measures, commended capacity, and steelyard weights.',
  ],
  s0036: [
    'From Wei and Jin downward, each age had its revisions and changes.',
    'From Wei and Jin onward, each dynasty revised the system.',
  ],
  s0037: [
    'Now the essentials of these additions and subtractions are listed below.',
    'The key changes are summarized here.',
  ],
  s0038: [
    'Complete numbers: the five numbers are one, ten, hundred, thousand, and ten thousand.',
    'The five complete numbers are one, ten, hundred, thousand, and ten thousand.',
  ],
  s0039: [
    'The Commentary says: "After things arise, images appear; after they multiply, numbers appear."',
    'The Commentary states: "Things first exist, then images form; as they proliferate, numbers emerge."',
  ],
  s0040: [
    'Therefore those who speak of pitch standards say that numbers begin from the jianzi month; the Yellow Bell pitch standard starts at one, and for each double-hour period it is multiplied by three; passing through nine periods to you, one obtains 19,683, and the five numbers are complete—this becomes the pitch-standard law.',
    'Pitch theorists hold that counting begins at the jianzi month: the Yellow Bell pitch starts at one, triples each two-hour period, and after nine periods reaches 19,683—completing the five numbers and forming the pitch law.',
  ],
  s0041: [
    'Multiplying further through to hai, passing through all twelve double-hour periods in all, one obtains 177,147, and the double-hour numbers are complete—this becomes the pitch accumulation.',
    'Continuing through all twelve periods to hai yields 177,147—the full period accumulation.',
  ],
  s0042: [
    'Dividing this accumulation by the completed law yields nine inches—the length of the Yellow Bell palace pitch standard.',
    'Dividing that accumulation by the completed law gives nine inches—the length of the Yellow Bell palace pipe.',
  ],
  s0043: [
    'Thus numbers arise from pitch standards, and pitch standards are completed by numbers; therefore they can govern the ten thousand affairs and comprehensively verify cosmic phenomena.',
    'Numbers derive from pitch, and pitch is fixed by numbers—so they can regulate all affairs and verify cosmic patterns.',
  ],
  s0044: [
    'The counting rods are made of bamboo, two fen wide and three cun long; the positive rods have three edges, 216 pieces in all, forming a hexagonal prism—the Qian counting rods.',
    'Counting rods are bamboo strips two fen wide and three cun long; positive rods with three edges, 216 in all, form a hexagonal prism—the Qian rods.',
  ],
  s0045: [
    'The negative rods have four edges, 144 pieces in all, forming a square—the Kun counting rods.',
    'Negative rods with four edges, 144 in all, form a square—the Kun rods.',
  ],
  s0046: [
    'Both hexagon and square are measured by twelve—the great numbers of Heaven and Earth.',
    'Hexagon and square both use twelve as their measure—the great numbers of Heaven and Earth.',
  ],
  s0047: [
    'Therefore in probing hidden depths, seeking what is concealed, reaching into the profound and extending to the distant, none fail to use them.',
    'In probing mysteries and reaching into the profound, nothing is done without them.',
  ],
  s0048: [
    'One, ten, hundred, thousand, and ten thousand are what all share in common.',
    'One through ten thousand are the shared foundation.',
  ],
  s0049: [
    'Pitch standards, length measure, capacity measure, steelyard and weights, calendar, and proportional calculation are what differ in use.',
    'Pitch, length, capacity, weight, calendar, and proportional calculation are the separate applications.',
  ],
  s0050: [
    'Therefore bodies have length and shortness; checking them with length measure, not a hair or tip of a awl is lost;',
    'Bodies vary in length; measured by the ruler, not a hair\'s breadth is missed;',
  ],
  s0051: [
    'things have more or less; receiving them in vessels, not a grain or spoonful is lost;',
    'quantities vary in amount; held in vessels, not a grain or spoonful is lost;',
  ],
  s0052: [
    'weights have light and heavy; balancing them with steelyard and scales, not a millet seed or silk thread is lost;',
    'mass varies in weight; balanced on scales, not a millet seed or silk thread is missed;',
  ],
  s0053: [
    'sounds have clear and muddy; harmonizing them with pitch pipes and bell tones, not a note of gong or shang is lost;',
    'sounds vary in pitch; harmonized by pitch pipes, not a note of gong or shang is missed;',
  ],
  s0054: [
    'the three luminaries move; recording them with calendrical numbers, not a gnomon mark or quarter-hour is missed;',
    'the sun, moon, and stars move; tracked by calendrical reckoning, not a moment is missed;',
  ],
  s0055: [
    'things mixed and appearing together are governed by proportional calculation, and their root is not violated.',
    'complex mixed quantities are handled by proportional calculation without losing their basis.',
  ],
  s0056: [
    'Therefore hidden sentiments and subtle transformations can be comprehensively grasped.',
    'Hidden truths and subtle changes can thus be fully comprehended.',
  ],
  s0057: [
    'What are called proportional calculations comprise nine branches: first, rectangular fields, to govern field boundaries and areas.',
    'Proportional calculation has nine branches: first, rectangular fields, for land boundaries and areas.',
  ],
  s0058: [
    'Second, millet and rice, to govern exchange and conversion of commodities.',
    'Second, millet and rice, for commodity exchange and conversion.',
  ],
  s0059: [
    'Third, proportional distribution, to govern noble and base, granary levies and taxes.',
    'Third, proportional distribution, for rank-based grain levies and taxes.',
  ],
  s0060: [
    'Fourth, lesser breadth, to govern volumes and areas of squares and circles.',
    'Fourth, lesser breadth, for volumes and areas of squares and circles.',
  ],
  s0061: [
    'Fifth, construction works, to govern labor projects, volumes, and solid quantities.',
    'Fifth, construction works, for engineering projects and solid volumes.',
  ],
  s0062: [
    'Sixth, fair transportation, to govern labor and expense over near and far distances.',
    'Sixth, fair transportation, for labor and cost over varying distances.',
  ],
  s0063: [
    'Seventh, excess and deficit, to govern hidden and mixed quantities appearing together.',
    'Seventh, excess and deficit, for hidden quantities appearing in mixed problems.',
  ],
  s0064: [
    'Eighth, rectangular arrays, to govern tangled positive and negative quantities.',
    'Eighth, rectangular arrays, for systems of positive and negative quantities.',
  ],
  s0065: [
    'Ninth, right triangles and legs, to govern height, depth, breadth, and distance.',
    'Ninth, right triangles and legs, for height, depth, width, and distance.',
  ],
  s0066: [
    'All are multiplied to disperse, divided to gather, equalized and unified to connect, and the present quantity is used to thread them through.',
    'All are multiplied to expand, divided to consolidate, equalized to connect, and unified by the present quantity.',
  ],
  s0067: [
    'Then the methods of calculation are fully exhausted in these.',
    'The full scope of calculation is contained in these.',
  ],
  s0068: [
    'In the ancient Nine Chapters, the ratio of circumference to diameter was three to one; the method was crude and erroneous.',
    'The ancient Nine Chapters used a circumference-to-diameter ratio of three to one—a crude approximation.',
  ],
  s0069: [
    'From Liu Xin, Zhang Heng, Liu Hui, Wang Fan, Pi Yanzong, and others, each set a new ratio, but none reached a balanced mean.',
    'Liu Xin, Zhang Heng, Liu Hui, Wang Fan, Pi Yanzong, and others each proposed new ratios, but none achieved a definitive value.',
  ],
  s0070: [
    'At the end of Song, Zu Chongzhi, Attendant Clerk of Southern Xuzhou, opened a more precise method: taking a diameter of one hundred million as one zhang, the excess circumference was three zhang one chi four cun one fen five li nine hao two miao seven hu, the deficit circumference was three zhang one chi four cun one fen five li nine hao two miao six hu, and the true value lay between the excess and deficit limits.',
    'Late in Song, Zu Chongzhi of Southern Xuzhou developed a precise method: with a diameter of one hundred million as one zhang, the excess circumference was 3.1415927 zhang and the deficit 3.1415926 zhang—the true value falling between.',
  ],
  s0071: [
    'The precise ratio: diameter 113, circumference 355.',
    'Zu\'s precise ratio was 113 to 355 for diameter and circumference.',
  ],
  s0072: [
    'The approximating ratio: diameter 7, circumference 22.',
    'His rough ratio was 7 to 22.',
  ],
  s0073: [
    'He also devised methods for extracting roots of differences and powers, combining them with verification by regular circles.',
    'He also devised root extraction for differences and powers, cross-checked against regular circles.',
  ],
  s0074: [
    'The essentials are precise and subtle—the highest achievement of the calculators.',
    'His methods were precise and subtle—the finest achievement in mathematics.',
  ],
  s0075: [
    'The book he wrote was called the Method of Interpolation; the academicians could not fathom its profundity, and so it was abandoned and left untended.',
    'His book, the Method of Interpolation, was too profound for the academicians to master, and it fell into neglect.',
  ],
  s0076: [
    '○ Harmonizing Sounds',
    '○ On Harmonizing Sounds',
  ],
  s0077: [
    'Tradition says the Yellow Emperor ordered Ling Lun to cut bamboo nine fen and three cun long and blow it to make the Yellow Bell palace pitch, called Han Shao.',
    'Tradition holds that the Yellow Emperor ordered Ling Lun to cut a bamboo tube three cun nine fen long and blow it to produce the Yellow Bell palace pitch, called "Containing the Lesser."',
  ],
  s0078: [
    'Next he made twelve pipes to listen to the phoenix\'s cry, to distinguish the twelve pitch standards—this is the male and female sound, to divide pitch pipes and bell tones.',
    'He then made twelve pipes to listen for the phoenix\'s call, distinguishing the twelve pitch standards—the male and female tones that divide the pitch pipes.',
  ],
  s0079: [
    'Generating upward and downward, taking Yellow Bell as the beginning.',
    'Upward and downward generation begins from Yellow Bell.',
  ],
  s0080: [
    'The Book of Yu says: "The seasons, the months, the corrected day, and the pitch pipes, measures, and weights are all in accord."',
    'The Book of Yu states: "Align the seasons, months, and corrected day with unified pitch pipes, measures, and weights."',
  ],
  s0081: [
    'When Xia Yu received the Mandate, he took sound as pitch standard and his body as measure.',
    'When Yu of Xia received the Mandate, he used sound for pitch and his body for measure.',
  ],
  s0082: [
    'In the Rites of Zhou, musical instruments take the twelve pitch standards as their measures.',
    'The Rites of Zhou specifies that instruments are sized by the twelve pitch standards.',
  ],
  s0083: [
    'Sima Qian\'s Treatise on Pitch Standards says: "Yellow Bell is eight cun and one-seventh long; Great Cluster is seven cun and seven-sevenths and two; Forest Bell is five cun and seven-sevenths and three; Responding Bell is four cun and three-sevenths and two."',
    'Sima Qian\'s Treatise gives: Yellow Bell eight cun and one-seventh; Great Cluster seven cun and seven-sevenths and two; Forest Bell five cun and seven-sevenths and three; Responding Bell four cun and three-sevenths and two.',
  ],
  s0084: [
    'These are the three beginnings of music and the root and branch of the twelve pitch standards.',
    'These are the three origins of music and the foundation of the twelve pitch standards.',
  ],
  s0085: [
    'Ban Gu and Sima Biao\'s Treatise on Pitch Standards: "Yellow Bell is nine cun long, the sound most muddy;"',
    'Ban Gu and Sima Biao\'s Treatise: "Yellow Bell is nine cun long, the lowest pitch;"',
  ],
  s0086: [
    'Great Cluster is eight cun long;',
    'Great Cluster measures eight cun;',
  ],
  s0087: [
    'Forest Bell is six cun long;',
    'Forest Bell measures six cun;',
  ],
  s0088: [
    'Responding Bell is four cun seven fen four li and a fraction strong, the sound most clear.',
    'Responding Bell is four cun seven fen four li and a fraction, the highest pitch.',
  ],
  s0089: [
    'Zheng Xuan\'s commentary on the Monthly Ordinances in the Rites, Cai Yong\'s chapter on the Monthly Ordinances, and the discussions of Du Kui, Xun Xu, and others—although the foot measure had additions and subtractions, the cun numbers of the twelve pitch standards were all the same.',
    'Zheng Xuan, Cai Yong, Du Kui, and Xun Xu debated the measures, but all agreed on the cun lengths of the twelve pitch standards.',
  ],
  s0090: [
    'The Han Treatise: Jing Fang also used generation across eight pitch standards; beginning from Yellow Bell and ending at Middle Bell Female, the twelve pitch standards were complete.',
    'The Han Treatise adds: Jing Fang used generation across eight steps—from Yellow Bell through Middle Bell Female, completing the twelve standards.',
  ],
  s0091: [
    'Middle Bell Female generates Yellow Bell upward, not reaching nine cun—this is called Holding the Beginning; generating downward removes the excess.',
    'Middle Bell Female generates Yellow Bell upward but falls short of nine cun—called "Holding the Beginning"; downward generation subtracts the remainder.',
  ],
  s0092: [
    'Generating upward and downward, ending at Southern Affair, forty-eight pitch standards were added to make sixty.',
    'Upward and downward generation, ending at Southern Affair, added forty-eight standards to make sixty.',
  ],
  s0093: [
    'Those whose generating line falls in the chen period generate Bao Yu upward, spaced nine entries after the winter solstice.',
    'Those generating from the chen period produce Bao Yu upward, nine steps after the winter solstice.',
  ],
  s0094: [
    'Fen Yan and Chi Nei—their numbers then reduce the clarity of Responding Bell.',
    'Fen Yan and Chi Nei reduce the clarity of Responding Bell.',
  ],
  s0095: [
    'In the Yuanjia era of Liu Song, Grand Astrologer Qian Yuezhi, following the remainder of Jing Fang\'s Southern Affair, extended it further to three hundred pitch standards, ending at An Yun, four cun four fen and a fraction long.',
    'In Liu Song\'s Yuanjia era, Grand Astrologer Qian Yuezhi extended Jing Fang\'s Southern Affair to three hundred pitch standards, ending at An Yun at four cun four fen and a fraction.',
  ],
  s0096: [
    'In total, combined with the old, there were three hundred and sixty pitch standards.',
    'Combined with the earlier standards, the total reached three hundred sixty pitch pipes.',
  ],
  s0097: [
    'Each day corresponded to one pipe; palace and zhi modes rotated in sequence, each following in order.',
    'One pipe per day; palace and zhi modes cycled in sequence.',
  ],
  s0098: [
    'He Chengtian\'s "Discourse on Establishing Laws and Systems" says: "Generating upward and downward, taking one-third and adding or subtracting one—this is the ancients\' simple method."',
    'He Chengtian\'s Discourse on Establishing Laws states: "Upward and downward generation by adding or subtracting one-third was the ancients\' simple method."',
  ],
  s0099: [
    'It is like the ancient calendar\'s circuit of heaven of 365 and one-quarter degrees; later people reformed the system, and all differed.',
    'Like the ancient calendar\'s 365¼-day year—later reformers all produced different values.',
  ],
  s0100: [
    'But Jing Fang did not understand this and erroneously made sixty pitch standards.',
    'Jing Fang failed to grasp this and wrongly devised sixty pitch standards.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/patch_suishu_016_b01.mjs <translation.json>');
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
