#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const chapterFile = 'data/songshu/013.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

/** Ensure batch-6 sentence rows exist in the working translation file. */
const existing = new Set(data.sentences.map((s) => s.id));
const sourceById = new Map();
chapter.content.forEach((block, blockIndex) => {
  for (const s of block.sentences || []) {
    const n = Number.parseInt(s.id.slice(1), 10);
    if (n >= 501 && n <= 600) {
      sourceById.set(s.id, { chinese: s.zh, blockIndex });
    }
  }
});

for (const id of [...sourceById.keys()].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))) {
  if (!existing.has(id)) {
    const src = sourceById.get(id);
    data.sentences.push({
      id,
      originalId: id,
      blockIndex: src.blockIndex,
      chinese: src.chinese,
      literal: '',
      idiomatic: '',
    });
  }
}

/** @type {Record<string, [string, string]>} */
const T = {
  s0501: [
    'One conjunction: fifty-seven days, day remainder 37,115; planetary motion likewise.',
    'One conjunction period: 57 days (remainder 37,115); gross planetary motion matches.',
  ],
  s0502: [
    'In the upper-origin year, the year is in jiazi; Heaven\'s first month, jiazi new moon at midnight is winter solstice; sun, moon, and five stars gather at the start of Emptiness; yin-yang and slow-fast all begin from this point.',
    'At the upper origin (jiazi year), month-11 new-moon midnight is winter solstice; the sun, moon, and five planets align at Emptiness 1°—the yin-yang and slow-fast tables all start there.',
  ],
  s0503: [
    'The Founding Emperor ordered the relevant offices to have inner and outer circles debate broadly; few of the time understood calendrics, and in the end there was no argument of agreement or disagreement.',
    'Emperor Xiaowu ordered a broad review; few officials understood calendrics, and no real consensus emerged.',
  ],
  s0504: [
    'Only Palace Attendant Crown Prince Guard Central Commander Dai Fazxing argued, saying:',
    'Only Dai Fazxing, Central Commander of the Crown Prince\'s Guard, submitted objections:',
  ],
  s0505: [
    'The three luminaries\' numbers are subtle, the five planets\' conjunction is the beginning; unless one deeply calculates and fully knows gnomon changes, how can one revise the ancients and change the present, turning and correcting the standard lodges?',
    'The motions of sun, moon, and planets are subtle; without deep calculation and mastery of gnomon variation, no one should revise ancient norms and reset the lodge system.',
  ],
  s0506: [
    'Examining what Chongzhi proposed, each point has errors; I venture my humble view and question each item in turn.',
    'Zu Chongzhi\'s proposals contain repeated errors; I offer these modest objections point by point.',
  ],
  s0507: [
    'Examining Chongzhi\'s newly calculated calendar method: "now the winter-solstice position shifts slightly year by year."',
    'His new method claims "the winter-solstice position shifts slightly each year."',
  ],
  s0508: [
    'Minister Fazxing argued: The two solstices mark expansion and contraction, the poles of north and south; the sun has a fixed degree-span, but the lodges do not change position.',
    'Dai Fazxing argued: The solstices mark the sun\'s fixed limits; though it travels a constant arc, the lodges do not shift.',
  ],
  s0509: [
    'In ancient calendars, winter solstice was always at Jian.',
    'Ancient calendars all placed winter solstice at Jian.',
  ],
  s0510: [
    'During the Warring States\' chaos, historians lost the records; down to early Han, the frame-measures were unsure; later mixed observation placed it at Nan-dou 22°, and the Yuanhe calendar used this—which matched the ancient calendar.',
    'After Warring States chaos and lost records, early Han measurements were uncertain; later observation found winter solstice at Nan-dou 22°, which Yuanhe adopted—matching antiquity.',
  ],
  s0511: [
    'Down to Jingchu, there was not a hair\'s error in the end.',
    'Through the Jingchu calendar, not a hair\'s-breadth of error remained.',
  ],
  s0512: [
    'The Documents say: "The day is short and the Mao stars are up, to rectify mid-winter.',
    'The Book of Documents states: "The day is short and Mao culminates—this fixes mid-winter.',
  ],
  s0513: [
    '"Simply by the moon\'s axis at the four mid-seasons, the central lodges are always in Wei and Yang; Xi and He rectified time by this, taking its unchanging through ten thousand generations."',
    'Xi and He fixed time by the four mid-season lunar axes with central stars in Wei and Yang—a standard meant to endure forever."',
  ],
  s0514: [
    'Chongzhi thinks the Tang-era winter solstice was about fifty degrees to the left of today\'s lodges, and thus vainly adds degrees, emptying and removing the heavenly path.',
    'Zu Chongzhi places Tang-era winter solstice fifty degrees west of today\'s lodges—artificially adding arc and erasing the celestial path.',
  ],
  s0515: [
    'Where his method sets its position, it nearly deviates half a lodge; then every forty-five years and nine months, on average it shifts one degree.',
    'His method deviates nearly half a lodge; solstice position would drift one degree every ~46 years.',
  ],
  s0516: [
    'In the Odes, "In the seventh month the Fire streams west"—this is when the Xia calendar sets its first month at jian-shen.',
    'The Odes\' "In the seventh month the Fire streams west" marks the Xia first month (jian-shen).',
  ],
  s0517: [
    '"\'Ding establishes the center\' is also the Lesser Snow solar term."',
    '"\'Ding establishes the center\' corresponds to Lesser Snow."',
  ],
  s0518: [
    'If winter solstice truly differed, then the Duke of Bin\'s Fire-streaming would give a gnomon shadow of one chi five cun, and the Chu palace construction would give a day clepsydra of fifty-three marks—this is utterly absurd.',
    'If solstice really shifted, Bin\'s Fire would imply a 1.5-chi shadow and Chu\'s palace a 53-mark day clepsydra—absurd implications.',
  ],
  s0519: [
    'Confucius said: "I have heard that after the Fire sets, the hibernators finish.',
    'Confucius said: "After Antares sets, all creatures finish hibernating.',
  ],
  s0520: [
    'Now the Fire still streams west—the calendar officer is at fault."',
    'Yet the Fire still streams west—the calendar is off."',
  ],
  s0521: [
    'If as Chongzhi\'s error holds, then stars have no fixed order and domains have differing directions.',
    'On Zu Chongzhi\'s view, stars lack fixed order and the realm\'s cardinal directions would shift.',
  ],
  s0522: [
    'The correctness of names and titles must differ past and present; the sounds of canonical edicts cannot match across ages; Yao\'s "open" and "close" would become today\'s "establish" and "remove."',
    'Proper names would change with every age; Yao\'s calendar terms would become today\'s jian and chu.',
  ],
  s0523: [
    'Today\'s Longevity Star is actually Zhou\'s Chimei; at present Eastern Wall is no longer Black Tortoise, and Zhen suddenly belongs to Azure Dragon—blaspheming Heaven and violating the classics, it has come to this.',
    'Today\'s Longevity Star would be Zhou\'s Chimei; Eastern Wall would leave Black Tortoise and Zhen join Azure Dragon—blasphemy against Heaven and the classics.',
  ],
  s0524: [
    'Chongzhi also changed the rule to 144 intercalations in 391 years.',
    'Zu Chongzhi also replaces the intercalation rule with 144 leap months in 391 years.',
  ],
  s0525: [
    'Minister Fazxing argued: Days have slow and fast phases, so the Dipper\'s span has wide and narrow; ancients made rules and set a middle standard—nineteen years accumulated always have seven intercalations; gnomon shadow may be empty or full—this cannot be changed.',
    'Dai Fazxing argued: Days vary in length, so the Dipper\'s span varies; the 19-year/7-leap rule with its gnomon tolerance must not be altered.',
  ],
  s0526: [
    'Chongzhi cuts intercalations and ruins the rule, halving the remainders; then in 139 years, in the second month, under the Quarter-day system one day is suddenly lost;',
    'Halving the intercalary remainder loses a full day in month 2 of year 139 under the Quarter-day schema.',
  ],
  s0527: [
    'In 7,429 years, one intercalation is lost each time.',
    'Every 7,429 years one entire leap month is lost.',
  ],
  s0528: [
    'When days are too few, times come early; when intercalations are lost, affairs go wrong.',
    'Too few days means early seasons; a missing leap month disrupts the calendar.',
  ],
  s0529: [
    'I have heard that seasons govern work, work nourishes life—this is the great foundation of human existence and what calendrics must put first; I fear Chongzhi\'s shallow thinking should not rashly be forced through.',
    'Calendrics underpin agriculture and human life; I doubt Zu Chongzhi\'s shallow reasoning should be imposed by force.',
  ],
  s0530: [
    'Chongzhi also orders the upper-origin solar degree to start from Emptiness 1, saying Emptiness is the center of the northern lodges.',
    'Zu Chongzhi also starts the upper origin at Emptiness 1°, calling Xu the midpoint of the northern lodges.',
  ],
  s0531: [
    'Minister Fazxing argued: Chongzhi both says winter solstice has annual precession and says Emptiness is northern center—abandoning form and blaming shadow is not enough to count as error.',
    'Dai Fazxing argued: Zu Chongzhi claims precession yet makes Xu the north center—relying on shadow over form is not necessarily wrong.',
  ],
  s0532: ['Why?', 'How so?'],
  s0533: [
    'Generally in the heavens nothing is clear without the sun; on earth one distinguishes by the Dipper.',
    'In the sky nothing is visible without the sun; on earth we orient by the Dipper.',
  ],
  s0534: [
    'Suppose winter solstice were at Emptiness: then the ecliptic would be far removed; northeast should be the Yellow Bell palace, Room and Wall should belong to Dark Arc positions—how can Emptiness again be northern center?',
    'If solstice were at Xu, the ecliptic would be displaced: Room and Wall would belong to Dark Arc, and Xu could hardly remain the north center.',
  ],
  s0535: [
    'Forcing solstices and equinoxes to shift repeatedly while star order does not change, changing the Dipper\'s plumb-line while pitch-pipes stay the same—then the seven regulators would not be aligned by the armillary, and establishment of time would not be recorded by Sheti; who knows where the Five Phases reside and what the six categories attach to?',
    'Forcing equinoxes to drift while lodges stay fixed—and shifting the Dipper while pitch-pipes stay put—would break armillary alignment, Sheti reckoning, and the placement of the Five Phases.',
  ],
  s0536: [
    'Chongzhi also sets the upper-origin year in jiazi.',
    'Zu Chongzhi also places the upper origin in a jiazi year.',
  ],
  s0537: [
    'Minister Fazxing argued: Setting origin and establishing era each has its preference—some rely on texts in apocrypha, some take effect from the present age.',
    'Dai Fazxing argued: Every calendar picks its origin differently—some follow apocrypha, some fit contemporary observation.',
  ],
  s0538: [
    'Chongzhi says: "Schools dispute, none can ascertain the conjunction."',
    'Zu Chongzhi himself wrote: "Schools dispute—none can fix the conjunction."',
  ],
  s0539: [
    'Formerly the Yellow Emperor calendar: xinmao—sun and moon never exceeded;',
    'The Yellow Emperor calendar (xinmao): sun and moon never missed;',
  ],
  s0540: [
    'Zhuanxu: yimao—four seasons without error;',
    'The Zhuanxu calendar (yimao): the four seasons never err;',
  ],
  s0541: [
    'Jingchu: renchen—last day of month without error in brightness;',
    'The Jingchu calendar (renchen): month-ends never miss;',
  ],
  s0542: [
    'Yuanjia: gengchen—new moon without wrong shadow—are these not heaven-compliant?',
    'The Yuanjia calendar (gengchen): new moons never misfire—true heaven-compliant calendars!',
  ],
  s0543: [
    'Chongzhi merely keeps jiazi—this can be called conforming to fit heaven.',
    'Zu Chongzhi merely picks jiazi—fitting the numbers to please heaven.',
  ],
  s0544: [
    'Chongzhi also sets sun, moon, five planets, conjunctions, slow-fast—all to start from the upper origin.',
    'Zu Chongzhi also resets sun, moon, planets, syzygies, and slow-fast tables all from the upper origin.',
  ],
  s0545: [
    'Minister Fazxing argued: The origin of conjunction—eclipses can be sought from it; the juncture of slow-fast is not what ordinary men can measure.',
    'Dai Fazxing argued: Conjunction origins predict eclipses; slow-fast cycles are beyond ordinary measurement.',
  ],
  s0546: [
    'Formerly Jia Kui briefly saw its discrepancy; Liu Hong roughly set forth its method.',
    'Jia Kui glimpsed the discrepancy; Liu Hong roughly codified the method.',
  ],
  s0547: [
    'As for the numbers of density and sparsity, none have reached their limit.',
    'No one has fully resolved the dense and sparse parameters.',
  ],
  s0548: [
    'Moreover the five planets\' positions sometimes expand and contract; just as when Jupiter is at Zhen, its appearance exceeds seven lodges—if calendrists have already traced calculation to match the present, then past and future can surely be known.',
    'Planets expand and contract—for example Jupiter at Zhen leaps seven lodges; astronomers already project forward and back from the present.',
  ],
  s0549: [
    'Why Jingchu sets a difference at era-head and Yuanjia also each sets a later origin—they all economize effort for practical use, not pushing empty calculation for bother.',
    'Jingchu and Yuanjia set era offsets and later origins to save effort—not to pile on useless calculation.',
  ],
  s0550: [
    'Chongzhi both violates heaven in reform and sets methods to suit his wishes—I deem this the great fault in governing calendrics.',
    'Zu Chongzhi both defies heaven and bends rules to his wishes—the gravest fault in calendar reform.',
  ],
  s0551: [
    'Minister Fazxing argued: The sun has eight paths, each forming one track; the moon has one path, divided into nine paths; left conjunction and right fast, double and half mutually differ—in the logic of one cycle, day numbers should be the same.',
    'Dai Fazxing argued: The sun has eight paths and the moon nine; left conjunction and right fast differ by halves—in one complete cycle their day counts should match.',
  ],
  s0552: [
    'Chongzhi\'s communication circuit and conjunction circuit differ by 9,040; his yin-yang is seventy-nine circuits plus a fraction; slow-fast falls short of one full turn.',
    'Zu Chongzhi\'s communication and conjunction circuits differ by 9,040; yin-yang runs 79+ cycles while slow-fast falls short of one turn.',
  ],
  s0553: [
    'This means what should shrink instead expands, what should decrease instead increases.',
    'Deficit becomes surplus and decrease becomes increase—the logic is inverted.',
  ],
  s0554: [
    'Chongzhi, following Fazxing\'s objections, rebutted and refuted, saying:',
    'Zu Chongzhi answered Dai Fazxing\'s objections point by point:',
  ],
  s0555: [
    'I from youth have been keen though foolish, devoted to numerology; I searched and refined past and present, broadly gathered hidden depths; Tang documents and Xia canon, none not weighed; Zhou new moons and Han first-of-month, all subjected to verification.',
    'From youth I devoted myself to mathematics, surveying Tang and Xia texts and verifying Zhou and Han new-moon records.',
  ],
  s0556: [
    'I exhausted thought on reckoning and calculation, investigating the distinction of sparse and dense.',
    'I exhausted every reckoning to resolve dense and sparse parameters.',
  ],
  s0557: [
    'As for the old error in setting the circle, Zhang Heng transmitted it without correction;',
    'Zhang Heng perpetuated the old sphere error without correction;',
  ],
  s0558: [
    'The Han-era hu inscription—Liu Xin perversely falsified its numbers; these are gross flaws of the calculators.',
    'Liu Xin\'s falsification of the Han hu inscription was a gross mathematical error.',
  ],
  s0559: [
    'Qianxiang\'s quarter-moon fixed numbers, Jingchu\'s crossing-degree circuit day—not that observation was imprecise, but multiplication and division were turned wrong; this again is calendrists\' grave fault.',
    'Qianxiang\'s syzygy constants and Jingchu\'s nodal month stem from botched arithmetic—not imprecise observation.',
  ],
  s0560: [
    'And Zheng Xuan, Kan Ze, Wang Fan, Liu Hui—all combined numerical arts, yet each has many gaps and errors.',
    'Zheng Xuan, Kan Ze, Wang Fan, and Liu Hui all compiled mathematical arts—yet each is riddled with errors.',
  ],
  s0561: [
    'I in past leisure days compiled corrections of many errors; reasoning and evidence are clear, easily made detailed and precise—this is because I humbly trust partial knowledge, not pushing empty credit on ancients.',
    'In past leisure I corrected many errors on clear evidence—I do not credit ancients blindly.',
  ],
  s0562: [
    'Examining He Chengtian\'s calendar: solstices ahead of heaven, intercalation shifted a month, five stars\' visibility and hiding sometimes off four ten-day weeks, column differences falsely set—should increase yet decrease—all departures of prior methods that my calendar has corrected.',
    'He Chengtian\'s calendar put solstices early, misplaced leap months, and mis-timed planetary visibility—all corrected in my calendar.',
  ],
  s0563: [
    'Having traced the waves to seek the source, cut stagnation to clarify the essentials— able to make lodge positions accord above and gnomon-clepsydra accord below— yet instead to be slandered, is this not regrettable!',
    'Having traced errors to their source and streamlined the method to unify lodge motion with gnomon and clepsydra, I am slandered instead—is that not regrettable?',
  ],
  s0564: [
    'Examining Fazxing\'s six debated points, none reaches the gate-bar of rational objection.',
    'None of Dai Fazxing\'s six objections reaches a substantive difficulty.',
  ],
  s0565: ['I respectfully set forth their headings.', 'I respectfully list them.'],
  s0566: [
    'First: solar-degree annual precession—prior methods overlooked it; I corrected this number from classics and history, yet Fazxing raises difficulty citing Odes and Documents—all three points are wrong.',
    'First, precession: prior methods ignored it; Dai Fazxing\'s Odes and Documents citations on all three points are wrong.',
  ],
  s0567: [
    'Second: I calibrated gnomon shadow and changed the old intercalation rule; Fazxing raised difficulty but could not interrogate, merely saying "I fear this is not shallow thinking that can be forced through."',
    'Second, intercalation: Dai Fazxing could only say "shallow thinking should not be forced through"—no substantive rebuttal.',
  ],
  s0568: [
    'Third: next, changing direction and shifting—I have no such method; he misread the method\'s intent and groundlessly raised suspicion and denigration.',
    'Third, he attacks a "direction shift" I never proposed—misreading my method.',
  ],
  s0569: [
    'Fourth: calendar upper origin in jiazi year—the method\'s structure is clear and whole, so he suspects forced fit.',
    'Fourth, jiazi upper origin: because the method is coherent, he suspects forced fit.',
  ],
  s0570: [
    'Fifth: my calendar\'s seven luminaries all start from upper origin—no gap to exploit—yet he again says "not what ordinary men can measure."',
    'Fifth, syzygy tables from the upper origin leave no gap—yet he calls it "beyond ordinary measure."',
  ],
  s0571: [
    'Sixth: slow-fast and yin-yang—what Fazxing has not understood; he mistakenly thinks the two rates\' day numbers should be the same.',
    'Sixth, slow-fast and yin-yang: Dai Fazxing misunderstood them and wrongly demands equal day counts.',
  ],
  s0572: [
    'All these many points—some cite errors to mock, some empty add suppression and rejection—never have I heard correcting discourse or discourse that satisfies the heart.',
    'In sum: mockery citing errors, or bare dismissal—never a fair rebuttal.',
  ],
  s0573: [
    'I respectfully follow each query to clarify, according to source to verify and match.',
    'I respond to each point at its source.',
  ],
  s0574: [
    'Looking up to heaven\'s radiance, I dare exhaust my narrow insight.',
    'Humbly invoking heaven\'s light, I offer this narrow insight.',
  ],
  s0575: [
    'Fazxing argued: "The two solstices mark expansion and contraction, the poles of north and south; the sun has a fixed degree-span, but the lodges do not change position.',
    'Dai Fazxing restated: "The solstices mark fixed limits; the sun travels a constant arc but lodges do not shift.',
  ],
  s0576: [
    'Therefore ancient calendars\' winter solstice was always at Jian."',
    'Therefore ancient calendars placed winter solstice at Jian."',
  ],
  s0577: [
    'Chongzhi said: Between Zhou and Han, calendrists lost their profession; crooked techniques competed; apocrypha were abundant—some borrowed imperial titles to magnify themselves, some used sage names to sanctify their doctrine.',
    'Zu Chongzhi replied: Between Zhou and Han calendrists lost their craft; apocrypha flourished, borrowing imperial and sage names to sanctify false claims.',
  ],
  s0578: [
    'Thus prognostications were mostly empty—Huan Tan knew their falsity;',
    'Prognostications were mostly false—Huan Tan saw through them;',
  ],
  s0579: [
    'ancient calendars were mixed and wrong—Du Yu doubted their straightness.',
    'and ancient calendars were confused—Du Yu doubted their reliability.',
  ],
  s0580: [
    'Examining the Five Era Discourse: the Yellow Emperor calendar had four methods; Zhuanxu, Xia, and Zhou each had two techniques—contradictions abundant—who knows which is correct? This is grounds one for doubting ancient calendars.',
    'The Five Era Discourse lists four Yellow Emperor methods and duplicate Zhuanxu, Xia, and Zhou systems—who knows which is authentic? Ground one for doubt.',
  ],
  s0581: [
    'The Xia calendar\'s seven luminaries move west—specially violating common methods; Liu Xiang thought it was made by later men—grounds two for doubt.',
    'The Xia calendar\'s westward luminaries violate all other methods—Liu Xiang deemed it a later forgery. Ground two.',
  ],
  s0582: [
    'The Yin calendar\'s day divisor is 940, yet Qianzaodu says the Yin calendar uses 81 as day divisor.',
    'The Yin day divisor is 940, yet Qianzaodu says 81.',
  ],
  s0583: [
    'If the Changes apocryphon is not wrong, the Yin calendar must be false—grounds three for doubt.',
    'If the apocryphon is wrong, the Yin calendar is fake. Ground three.',
  ],
  s0584: [
    'The Zhuanxu calendar origin: year in yimao, yet the Command Calendar Preface says: "This method sets origin, year in jiayin.',
    'Zhuanxu sets its origin in yimao, yet Command Calendar Preface says jiayin.',
  ],
  s0585: ['" This is grounds four for doubt.', 'Ground four for doubt.'],
  s0586: [
    'The Spring and Autumn records eclipses with day and new moon twenty-six in all; the calendar it relies on is either Zhou or Lu.',
    'The Spring and Autumn records 26 dated eclipses using either the Zhou or Lu calendar.',
  ],
  s0587: [
    'Testing with the Zhou calendar, checking its new-moon days—twenty-five failures; testing with the Lu calendar—thirteen more failures.',
    'The Zhou calendar misses 25; the Lu calendar misses 13 more.',
  ],
  s0588: [
    'Both calendars are wrong—then one must be false; grounds five for doubt.',
    'Both fail—one must be forged. Ground five.',
  ],
  s0589: [
    'The ancient six methods all match the Quarter-day; the Quarter-day method, over time, falls behind heaven.',
    'The six ancient methods match the Quarter-day calendar, which drifts behind heaven over time.',
  ],
  s0590: [
    'Testing by eclipses, after three hundred years it errs one day.',
    'Eclipse checks show ~1 day error every 300 years.',
  ],
  s0591: [
    'Ancient calendars tested against today—the most lax ones, new moons fall behind heaven by more than two days.',
    'The worst ancient calendars put new moons 2+ days late against today.',
  ],
  s0592: [
    'From this inference, ancient methods\' composition—all at end of Zhou and early Han; logically cannot be far back.',
    'Ancient methods were composed near the Han founding—logically not much earlier.',
  ],
  s0593: [
    'Moreover checking Spring and Autumn backward, new moons all ahead of heaven—this is not clear evidence from before the Three Dynasties; grounds six for doubt.',
    'Checked against Spring and Autumn, new moons are all early—not evidence from before the Three Dynasties. Ground six.',
  ],
  s0594: [
    'Examining the Treatise on Pitchpipes and Calendrics: Former Han winter solstice was at the juncture of Dipper and Ox, degree at Jian—they are adjacent; unless the Emperor crafted it, then instruments and clepsydrae may have been lacking—how could it reach exhaustive fineness without a hair\'s loss?',
    'The Treatise places Former Han solstice between Dipper and Ox near Jian—only an imperial fabrication, or faulty instruments, could claim such precision.',
  ],
  s0595: [
    'The Jian-star claim is insufficient as proof.',
    'The Jian-star claim does not hold.',
  ],
  s0596: [
    'Fazxing argued: "Warring States ran wild, historians lost records; down to early Han, frame-measures were unsure; later mixed observation placed it at Nan-dou 22°, Yuanhe used this—which matched the ancient calendar.',
    'Dai Fazxing restated his Warring States chaos argument and Yuanhe\'s Nan-dou 22° placement.',
  ],
  s0597: [
    'Down to Jingchu, not a hair\'s error in the end."',
    'Through Jingchu, not a hair\'s error."',
  ],
  s0598: [
    'Chongzhi said: Ancient methods are erroneous and mixed, details lost; the yimao calendar used in Qin must have been effective then, so its words can be verified.',
    'Zu Chongzhi replied: ancient methods are confused; the Qin yimao calendar worked in its day—that is why its claims survive.',
  ],
  s0599: [
    'Emperor Wu reformed and created; inspection was detailed and complete; corrected instruments and examined clepsydrae—matters are in prior histories; measuring stars and distinguishing degrees—logic has no gross departure.',
    'Han Wu\'s reforms were thoroughly tested; star measurement and degree reckoning are documented in prior histories without gross error.',
  ],
  s0600: [
    'Now the debaters\' affirmations are not real observation; their negations are merely empty falsehood; debating that to alarm this is not universal discourse; applying present to reject antiquity—the slanders are truly many; relying on one doctrine is not as good as combining present as superior.',
    'Today\'s debaters affirm without real evidence and deny without cause; rejecting the present to blindly follow antiquity slanders much truth—combining modern observation with ancient texts is better than clinging to one school.',
  ],
};

let updated = 0;
const missing = [];
for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    updated++;
  }
}

for (const id of Object.keys(T).sort()) {
  if (!data.sentences.some((s) => s.id === id)) missing.push(id);
}

data.sentences.sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');

const batch6 = data.sentences.filter((s) => {
  const n = Number(s.id.slice(1));
  return n >= 501 && n <= 600;
});
const emptyBatch6 = batch6.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
const emptyAll = data.sentences.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());

console.log(`Updated ${updated} sentences`);
console.log(`Missing map entries in file: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Batch 6 (s0501-s0600) empty: ${emptyBatch6.length}`);
console.log(`All sentences empty literal/idiomatic remaining: ${emptyAll.length}`);
if (emptyBatch6.length) {
  console.error(emptyBatch6.map((s) => s.id).join(', '));
  process.exit(1);
}
