#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He was sent out as Administrator of Jian\'an; his rule had grace and trust, and the people could not bear to deceive him.',
    'Sent out as Jian\'an administrator, he ruled with grace and trust, and the people would not deceive him.',
  ],
  s0102: [
    'At every Fu and La festival he released prisoners to go home, and they returned on schedule.',
    'Each Fu and La he sent prisoners home, and they came back on time.',
  ],
  s0103: [
    'He entered court as Secretariat aide to the Three Excellencies but did not accept; he was transferred to Registrar of the Minister of Rites.',
    'He entered as Secretariat aide to the Three Excellencies, declined, and became registrar of the Minister of Rites.',
  ],
  s0104: [
    'He annotated the *Changes* and also explicated the *Record of Rites*, writing on the back of the scrolls—calling it *Hidden Meanings*.',
    'He annotated the *Changes* and explicated the *Record of Rites* on scroll backs, titling the work *Hidden Meanings*.',
  ],
  s0105: [
    'He was promoted through Central Secretariat Gentleman, Supernumerary Regular Attendant, Secretariat aide to the Grand Marshal, Right Chief Clerk to the Minister of Rites, Gentleman Attendant at the Yellow Gates, Palace Aide to the Heir Apparent, concurrent Erudite of the National University, and Rectifier of Danyang commandery.',
    'He rose through secretariat gentleman, supernumerary attendant, grand marshal aide, right chief clerk, yellow-gates gentleman, heir-apparent aide, national university erudite, and Danyang rectifier.',
  ],
  s0106: [
    'Director of the Masters of Writing Wang Jian received the decree to compile the new rites but died before finishing.',
    'Wang Jian, director of the Masters of Writing, was ordered to draft the new rites but died unfinished.',
  ],
  s0107: [
    'They then had Specially Promoted Zhang Xu continue it, and Xu also died;',
    'Zhang Xu, specially promoted, was set to finish it, and he too died;',
  ],
  s0108: [
    'The task fell to Minister of Rites Prince Ziliang of Jingling; Ziliang yielded it to Yin, set up twenty academic officers, and had them assist Yin in compiling and editing.',
    'It fell to Minister of Rites Prince Ziliang of Jingling; Ziliang gave it to Yin, appointed twenty scholars, and had them help Yin compile.',
  ],
  s0109: [
    'In Yongming year ten he was promoted to Palace Attendant, concurrent Colonel of Footsoldiers, and then became Chancellor of the National University.',
    'Yongming year ten he became palace attendant and colonel of footsoldiers, then chancellor of the national university.',
  ],
  s0110: [
    'When Yulin succeeded to the throne, Yin was kin to the empress and was greatly favored.',
    'When Yulin succeeded, Yin was the empress\'s kin and was treated with great favor.',
  ],
  s0111: [
    'He was promoted through Minister of the People for the Left, concurrent Commander of Agile Cavalry, Director of the Secretariat, and concurrent Tutor to the Princes of Linhai and Baling.',
    'He rose through left minister of the people, agile-cavalry commander, director of the secretariat, and tutor to the princes of Linhai and Baling.',
  ],
  s0112: [
    'Though Yin was noble and prominent, he always cherished knowing when to stop.',
    'Though noble and prominent, Yin always knew when enough was enough.',
  ],
  s0113: [
    'Early in Jianwu he had already built a house in the suburbs called Little Hill, and constantly wandered and lived within it with his students.',
    'Early Jianwu he had built a suburban house called Little Hill and constantly lived there with his students.',
  ],
  s0114: [
    'At this point he sold his garden and house, intending to enter Eastern Hills; before he could set out, he heard Xie Tiao had left the grand administration of Wuxing and would not return—Yin feared being too late, submitted a memorial resigning office, and left without waiting for a reply.',
    'He sold his estate to enter Eastern Hills; before leaving he heard Xie Tiao had quit Wuxing and would not return—fearing to be second, Yin resigned and left without waiting for approval.',
  ],
  s0115: [
    'Emperor Ming was greatly angry and had Vice Director of the Imperial Secretariat Yuan Ang memorialize to seize Yin; soon an edict permitted it.',
    'Emperor Ming raged and had vice director Yuan Ang move to arrest Yin; soon an edict allowed it.',
  ],
  s0116: [
    'Yin found Kuaiji\'s mountains rich in spiritual marvels, traveled there, and dwelt at Cloud Gate Monastery on Mt Ruoye.',
    'Yin found Kuaiji\'s mountains full of wonders, traveled there, and lived at Cloud Gate Monastery on Mt Ruoye.',
  ],
  s0117: [
    'Earlier Yin\'s two elder brothers Qiu and Dian had both lived in reclusion; Qiu died first, and now Yin too withdrew—the age called Dian Great Hill;',
    'His brothers Qiu and Dian had both recluded; Qiu died first, and now Yin withdrew too—the age called Dian Great Hill;',
  ],
  s0118: [
    'Yin Little Hill, also called Eastern Hills.',
    'Yin was Little Hill, also called Eastern Hills.',
  ],
  s0119: [
    'In the Yongyuan era he was summoned as Grand Commandant and Steward to the Heir Apparent—he accepted neither.',
    'In Yongyuan he was summoned as grand commandant and heir-apparent steward and accepted neither.',
  ],
  s0120: [
    'When Gaozu established the Hegemon\'s Office he invited Yin as Libationer for Army Planning and wrote to him: "I imagine you are ever serene and at ease, giving free rein to feeling amid forests and ravines—altogether enough for joy.',
    'When Gaozu set up the hegemon\'s office he made Yin army-planning libationer and wrote: "I imagine you are always serene, roaming forests and ravines—joy enough.',
  ],
  s0121: [
    'Having inwardly renounced the heart of strife and outwardly spared yourself the toil of things, you nurture harmony by the Way; your tread in season is never amiss.',
    'Inwardly you have dropped strife, outwardly you spare toil; you nourish harmony by the Way and keep every season without fault.',
  ],
  s0122: [
    'Ruoye monopolizes the beauty of the eastern region, mountains and streams linked in succession—a land praised by former ages, truly a happy soil.',
    'Ruoye holds the east\'s beauty, mountains and streams unbroken, praised by former ages—a happy land.',
  ],
  s0123: [
    'I have been pushed through petty official posts from east to west; our plain-spoken meetings became estrangement; I crane my neck looking east—what day is without longing?',
    'I have been shuffled through petty posts east to west; our talks became estrangement; I look east every day without end of longing.',
  ],
  s0124: [
    'In former happy meetings we trailed robes in the halls of scholars, truly wishing to travel a thousand years in repose and hunt and fish among the hundred schools—but one turn into office, and this was betrayed.',
    'Once we trailed robes in the halls of learning, wishing to roam a thousand years in books and hunt the hundred schools—but one turn to office ended it.',
  ],
  s0125: [
    'Just then the age\'s might was crushed, we again left our base of fortune; I shook my sleeves with thousands and overcame the bale of calamity.',
    'Then the age\'s might was broken and we left our base; I rallied thousands and put down disaster.',
  ],
  s0126: [
    'I thought to gain your glance upon my scrolls and intimate counsel, to lodge feeling in the past—how could I not long for it? Yet affairs and wishes parted.',
    'I wished to read your scrolls and speak heart to heart of the past—how could I not long for it? Yet affairs and wishes parted.',
  ],
  s0127: [
    'Your pure breast and simple trust, dwelling-place not near—the midst of the human world, nearly the same as hidden withdrawal.',
    'Your pure heart and simple trust, dwelling not near the court—in the human world you are nearly a recluse.',
  ],
  s0128: [
    'You have both stooped to pick up green ribbons and cast off vermilion robes like shoes.',
    'You have both taken up green ribbons and cast off vermilion rank like shoes.',
  ],
  s0129: [
    'Yet principle lies in use and rejection, righteousness honors timeliness; recognizing calamity\'s sprout before, you were truly foreknowing—transcendent in solitary goodness, the knowing admire and sigh.',
    'Yet principle is use and rejection, righteousness is timeliness; you saw calamity coming and stood apart in goodness—the knowing admire you.',
  ],
  s0130: [
    'Today in governing the state, poor and lowly alike feel shame; loving benevolence is up to oneself—by fortune do not hesitate.',
    'Today to serve the state, even the poor feel shame if they do not love benevolence—do not hesitate.',
  ],
  s0131: [
    'On another occasion I shall set this forth in detail; this does not exhaust the words.',
    'I will explain more elsewhere; this letter does not say all.',
  ],
  s0132: [
    'Now I send an envoy to receive your news; crane your neck and return a letter, to comfort this craning forward.',
    'Now I send a messenger for your word; look up and write back to ease my waiting.',
  ],
  s0133: [
    'Yin did not come.',
    'Yin did not come.',
  ],
  s0134: [
    'When Gaozu ascended the throne he decreed Yin Specially Promoted and Right Grand Master of Splendid Happiness.',
    'When Gaozu took the throne he made Yin specially promoted and right grand master of splendid happiness.',
  ],
  s0135: [
    'A handwritten edict said: "I unworthily met the destined era and received this joyous elevation, yet looking at myself I am benighted and obscure in the way of rule.',
    'A handwritten edict said: "I unworthily met the age and received elevation, yet I am benighted in the way of rule.',
  ],
  s0136: [
    'Though I toil from sun to sun and think to bring abundant peace, the former kings\' bequeathed models still lie hidden in the policy scrolls—the use of self-recommendation rests in the man.',
    'Though I toil from sun to sun seeking peace, the former kings\' models lie in the scrolls—who is raised depends on the man.',
  ],
  s0137: [
    'Moreover the age\'s ways are thin and twilight; contention and fraud flourish—changing custom and shifting wind is truly not easy.',
    'Moreover the age is thin and deceit flourishes—changing custom is not easy.',
  ],
  s0138: [
    'Unless by Confucian elegance to magnify the court and lofty standards to guide things, then wherever the muddy current runs none knows its limit.',
    'Unless Confucian elegance exalts the court and lofty standards guide things, the muddy current has no limit.',
  ],
  s0139: [
    'Governing others versus governing the self, solitary goodness versus aiding all—gain, loss, taking, leaving—which use is greater?',
    'Governing others or the self, solitary good or aiding all—which matters more?',
  ],
  s0140: [
    'Though I do not study, I rather love probing antiquity, still think on lofty dust, and ever cherish beating the measure.',
    'Though I do not study, I love antiquity, still think on lofty men, and beat the measure in admiration.',
  ],
  s0141: [
    'Today\'s affairs are tangled and confused; anxiety and duty are fitting—you cannot but bend the Way to cliff and dell and together complete the age\'s beauty.',
    'Today affairs are tangled; duty calls—you must bend the Way to the cliffs and help complete the age\'s beauty.',
  ],
  s0142: [
    'I surely hope you deeply reach my former feeling and do not stint wetting your feet.',
    'I hope you understand my old wish and do not refuse to wet your feet.',
  ],
  s0143: [
    'Now I send Army-inspecting Chief-of-Staff Wang Guo to announce the intent and explain my meaning—meeting face to face is near.',
    'Now I send army-inspecting chief Wang Guo to announce my meaning—we shall meet soon.',
  ],
  s0144: [
    '" When Guo arrived, Yin wore a single robe and deer-cloth cap, held a classic scroll, came down from his couch to kneel and receive the edict, then returned to his seat and read prone.',
    'Guo arrived; Yin wore a single robe and deer cap, held a classic scroll, knelt to receive the edict, then read it prone at his seat.',
  ],
  s0145: [
    'Yin then said to Guo: "In the Qi court I once wished to present two or three points: first to correct the suburban altar and mound; second to recast the Nine Tripods; third to raise twin gate-towers.',
    'Yin told Guo: "In Qi I wished to present three things: correct the suburban altar and mound, recast the nine tripods, and raise twin gate-towers.',
  ],
  s0146: [
    'Tradition says the Jin house wished to raise gate-towers; Chief Minister Wang pointed at Ox Head Mountain and said, "This is Heaven\'s tower"—thus they did not clarify the meaning of raising towers.',
    'Tradition says Jin wished to raise towers; Chief Minister Wang pointed at Ox Head Mountain and said "This is Heaven\'s tower"—they never understood what a tower was for.',
  ],
  s0147: [
    'A gate-tower is what is called the Elephant-Dawning.',
    'A tower is called the Elephant-Dawning.',
  ],
  s0148: [
    'Laws and standards are hung upon it; at the sun\'s fullness they are gathered in.',
    'Laws are displayed on it and gathered in at the full of day.',
  ],
  s0149: [
    '"Elephant" means law;',
    '"Elephant" means law;',
  ],
  s0150: [
    '"Dawning" means the appearance of towering height on the road of rule.',
    '"Dawning" means towering height on the road of rule.',
  ],
  s0151: [
    'The tripod is the sacred vessel, what those with a state put first—hence Wangsun Man\'s stern words and the Chu lord\'s meal brought to a halt.',
    'The tripod is the sacred vessel states put first—hence Wangsun Man\'s rebuke and the Chu lord\'s feast cut short.',
  ],
  s0152: [
    'Round Mound and state suburban sacrifice—in the old canons they differed.',
    'Round Mound and state suburban rites differed in the old canons.',
  ],
  s0153: [
    'The southern suburban sacrifices to the Five Thearchs, Spiritual Majesty Yang, and the like; the Round Mound sacrifices to the Celestial Sovereign Great Thearch and the Pole Star—that is the distinction.',
    'The southern suburb sacrifices to the Five Thearchs and Spiritual Majesty Yang; the Round Mound to the Celestial Sovereign and Pole Star—that is the distinction.',
  ],
  s0154: [
    'Former ages merged suburban and mound sacrifices—a great error of the early Confucians.',
    'Merging suburb and mound was a great error of the early Confucians.',
  ],
  s0155: [
    'Now Liang\'s virtue is newly proclaimed; one should not straightway follow the former error.',
    'Now Liang\'s virtue begins; we should not follow the old error.',
  ],
  s0156: [
    'You should go to the palace and present this.',
    'You should go to court and present this.',
  ],
  s0157: [
    '" Guo said: "This servant is crude and inferior—how dare I lightly discuss state canons?',
    'Guo said: "I am crude and low—how dare I discuss state canons?',
  ],
  s0158: [
    'This should respectfully await a Master Shu Sun."',
    'That should await a Master Shu Sun."',
  ],
  s0159: [
    '" Yin said: "Will you not send the edict-bearer back to court with a memorial and stay to wander with me?',
    'Yin said: "Will you not send the messenger back with a memorial and stay to roam with me?',
  ],
  s0160: [
    '" Guo said in astonishment: "Past and present have not heard this precedent.',
    'Guo said in astonishment: "Past and present have no such precedent.',
  ],
  s0161: [
    '" Yin said: "The two scrolls of *Tann Gong* all speak of things\' beginnings.',
    'Yin said: "The two scrolls of *Tann Gong* all speak of beginnings.',
  ],
  s0162: [
    'Beginning from you—why must there be a precedent?',
    'Begin with you—why need a precedent?',
  ],
  s0163: [
    '" Guo said: "Now you are to withdraw utterly from the world—is there still any principle of taking office?',
    'Guo said: "Now you withdraw from the world—is there still any reason to take office?',
  ],
  s0164: [
    '" Yin said: "You only push me with affairs; I am already fifty-seven, and four pecks of rice a month do not finish—how could I harbor desire for office?',
    'Yin said: "You only push me with business; I am fifty-seven, and four pecks of rice a month do not finish me—how could I want office?',
  ],
  s0165: [
    'Formerly I bore the sage king\'s eager recognition; now again I receive honoring reward—I very much wish to go to court and thank grace, but lately my waist and legs are greatly afflicted, and this heart cannot be fulfilled."',
    'Once the sage king favored me; now I am honored again—I wish to thank at court, but my waist and legs are too bad, and this heart cannot be fulfilled."',
  ],
  s0166: [
    'Guo returned and reported Yin\'s meaning; an edict granted the salary of a Masters of Writing in plain robes—Yin firmly declined.',
    'Guo returned and reported; an edict granted plain-robes masters-of-writing salary—Yin firmly refused.',
  ],
  s0167: [
    'Again an edict gave fifty thousand from the Shanyin treasury each month—Yin again did not accept.',
    'Again fifty thousand from the Shanyin treasury each month—Yin again refused.',
  ],
  s0168: [
    'Then an edict to Yin said: "Recently learning has sunk and been abandoned, Confucian arts are nearly exhausted; in lanes and wards among gentry and officials, few are heard doing good.',
    'Then an edict to Yin said: "Learning has lately sunk and Confucian arts nearly end; in lanes and wards few gentry are heard doing good.',
  ],
  s0169: [
    'I ever think to expand and encourage, yet the wind does not shift—I sigh when I rise to speak at the throne.',
    'I ever wish to encourage it, yet the wind does not change—I sigh at the throne.',
  ],
  s0170: [
    'I originally wished to bend you to come out briefly and open and guide the younger generation; since learning has been abandoned, this wish is unfulfilled—the labor of waiting fills my dreams.',
    'I wished you would come out briefly and guide the young; since learning is abandoned, this wish fails—the wait fills my dreams.',
  ],
  s0171: [
    'I ready the boat and empty the seat, waiting till next autumn; what I hope is your gracious coming to voice the long-held embrace.',
    'I ready the boat and empty the seat for next autumn; I hope you will come and speak the wish long held.',
  ],
  s0172: [
    'Among your disciples, how many are clear in the classics and cultivated in conduct?',
    'Among your disciples, how many are clear in the classics and cultivated in conduct?',
  ],
  s0173: [
    'I also wish to behold those stately ones and set them in this grand procession.',
    'I also wish to see the stately ones and set them in the grand procession.',
  ],
  s0174: [
    'You may at once submit their names in full, matching their labor and hope.',
    'Submit their names at once to match their labor and hope.',
  ],
  s0175: [
    '" He also said: "In recent years scholars are especially few—truly because there is no longer gathering of disciples, thus mastery of the classics is abandoned.',
    'He also said: "Scholars are especially few lately—because there are no more gathered disciples, mastery of the classics is abandoned.',
  ],
  s0176: [
    'Each time I think of this I sigh for it.',
    'Each time I think of this I sigh.',
  ],
  s0177: [
    'You stand at the head of Confucian teaching, moreover with plain virtue—you should order those among the later ranks who have intent to come study under you.',
    'You are head of Confucian teaching and plain in virtue—order those among the young who wish it to study under you.',
  ],
  s0178: [
    'I trust you will deeply ponder, teach, and entice, and make this civilization rise again.',
    'I trust you will teach and entice deeply and make this civilization rise again.',
  ],
  s0179: [
    '" Thereupon he sent He Zilang, Kong Shou, and six others to study on Eastern Hills.',
    'Thereupon he sent He Zilang, Kong Shou, and six others to study on Eastern Hills.',
  ],
  s0180: [
    'The grand administrator, Prince Yuan Jian of Hengyang, deeply honored him; each month he often ordered his carriage to call at his lane and discussed all day.',
    'Grand administrator Prince Yuan Jian of Hengyang deeply honored him; each month he often drove to his lane and talked all day.',
  ],
  s0181: [
    'Yin found Ruoye\'s site cramped by terrain and unable to hold students, so he moved to Mt Qinwang.',
    'Ruoye was cramped and could not hold students, so Yin moved to Mt Qinwang.',
  ],
  s0182: [
    'The mountain had a flying spring; westward he raised a study hall, taking the forest as post and the cliff as wall.',
    'The mountain had a flying spring; westward he built a study hall, the forest as posts and the cliff as wall.',
  ],
  s0183: [
    'He made a separate small chamber for sleeping, opened and closed it himself—servants could not reach it.',
    'He made a small sleeping chamber, opened and closed it himself—servants could not enter.',
  ],
  s0184: [
    'On the mountainside he farmed two qing; between lectures he strolled there with his students.',
    'On the mountainside he farmed two qing; between lectures he walked there with students.',
  ],
  s0185: [
    'When Yin first moved and was about to build a house, he suddenly saw two men in black caps, countenances very imposing, who asked Yin: "Do you wish to dwell here?',
    'When Yin first moved to build, he suddenly saw two men in black caps, very imposing, who asked: "Do you wish to live here?',
  ],
  s0186: [
    '" Then pointing to a place they said: "This spot is especially auspicious.',
    'Pointing to a place they said: "This spot is especially auspicious.',
  ],
  s0187: [
    '" Suddenly they were gone; Yin followed their words and stopped there.',
    'Suddenly they vanished; Yin followed their words and stopped there.',
  ],
  s0188: [
    'Soon the mountain sent forth flood-waters; trees and stones were all uprooted—only Yin\'s dwelling stood massive and alone.',
    'Soon the mountain flooded; trees and stones were uprooted—only Yin\'s house stood intact.',
  ],
  s0189: [
    'Yuan Jian then had his Recorder-of-the-Army Attendant Zhong Rong compose "Ode on the Auspicious Chamber" and carved stone to honor it.',
    'Yuan Jian had recorder Zhong Rong compose "Ode on the Auspicious Chamber" and carved stone to honor it.',
  ],
  s0190: [
    'When Yuan Jian left the commandery he entered the mountains to bid Yin farewell, escorting him to Capital Gift Dam three li from the commandery, and said: "I myself have cast off human affairs and cut off the road of friendship—unless nobles descend to mountain and marsh, how could I again look on cities and towns?',
    'When Yuan Jian left the commandery he entered the hills to bid Yin farewell, escorting him to Capital Gift Dam three li out, and said: "I have cast off human affairs and cut off friendship—unless nobles descend to the hills, how could I look on cities again?',
  ],
  s0191: [
    'This dam outing ends today.',
    'This dam outing ends today.',
  ],
  s0192: [
    '" They clasped hands with tears streaming.',
    'They clasped hands in tears.',
  ],
  s0193: [
    'The He clan crossed the river; from Jin\'s Minister of Works Chong onward all were buried on Western Hill of Wu.',
    'The He clan crossed the river; from Jin minister of works Chong onward all were buried on Wu\'s Western Hill.',
  ],
  s0194: [
    'In Yin\'s family each generation\'s years were not long—only grandfather Shangzhi reached seventy-two.',
    'Yin\'s family never lived long—only grandfather Shangzhi reached seventy-two.',
  ],
  s0195: [
    'When Yin\'s years reached his grandfather\'s span he moved back to Wu, composed one poem "Farewell to the Mountains," the words very mournful.',
    'When Yin reached his grandfather\'s span he moved back to Wu and wrote "Farewell to the Mountains," very mournful.',
  ],
  s0196: [
    'Reaching Wu he dwelt at Tiger Hill West Monastery lecturing on classics and treatises; students again followed him, and magistrates along the eastern circuit\'s routes all came without exception.',
    'At Wu he lived at Tiger Hill West Monastery lecturing on classics; students followed, and eastern magistrates on the road all came.',
  ],
  s0197: [
    'Yin always forbade killing; a gamekeeper chased a deer that came straight to Yin, crouched, and did not move.',
    'Yin always forbade killing; a gamekeeper chased a deer that ran straight to Yin, crouched, and did not move.',
  ],
  s0198: [
    'There was also a strange bird like a crane, red in color, that settled in the lecture hall and was tame as domestic fowl.',
    'A strange red crane-like bird settled in the lecture hall, tame as poultry.',
  ],
  s0199: [
    'Earlier the monk Zang of Kaishan Monastery had met Yin on Mt Qinwang; later he returned to the capital and died on Zhongshan.',
    'Earlier monk Zang of Kaishan Monastery met Yin on Mt Qinwang; later he returned to the capital and died on Zhongshan.',
  ],
  s0200: [
    'On the day of his death Yin was at Prajna Monastery, saw a monk hand Yin an incense casket and boxed letter saying "Presented to Layman He," and when the words ended he vanished.',
    'On the day he died Yin was at Prajna Monastery; a monk gave Yin an incense casket and boxed letter saying "For Layman He," then vanished.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_051_b2.mjs <translation.json>'
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
