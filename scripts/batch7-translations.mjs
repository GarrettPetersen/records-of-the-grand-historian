#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const chapterFile = 'data/songshu/013.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

/** Ensure batch-7 sentence rows exist in the working translation file. */
const existing = new Set(data.sentences.map((s) => s.id));
const sourceById = new Map();
chapter.content.forEach((block, blockIndex) => {
  for (const s of block.sentences || []) {
    const n = Number.parseInt(s.id.slice(1), 10);
    if (n >= 601 && n <= 700) {
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
  s0601: [
    'The Jingchu method actually errs regarding the five planets; now they are at syzygy, yet days ago the sun had already shifted.',
    'The Jingchu calendar truly misplaces the five planets: at opposition today, the sun had already moved days earlier.',
  ],
  s0602: [
    'It only roughly handles new and full moons without verification — hence gnomon and clepsydra, dusk and dawn all follow the Yuanhe calendar; even when the two equinoxes show different shadow lengths, they still do not know to reform; with the sun\'s lodge position slightly off, no wonder it is wrong.',
    'It only roughly fixes syzygies without observational checks, so gnomon, clepsydra, and twilight all copy the Yuanhe calendar; even when equinox shadows differ, no one reforms the system — with the sun\'s lodge position slightly off, error is inevitable.',
  ],
  s0603: [
    'Dai Fazxing objected: "The Book says, \'The days are short and the star Mao culminates — thereby fixing mid-winter.\'',
    'Dai Fazxing objected: "The Book of Documents says, \'The days are short and the star Mao culminates — thereby fixing mid-winter.\'',
  ],
  s0604: [
    'Simply using the months to derive the four mid-seasons, the culminating lodge is always in Wei and Yang — this is why Xi and He fixed the seasons, taking what would never change for ten thousand generations.',
    'Derive the four mid-season months from the lunar cycle and the culminating lodge is always in Wei and Yang — this is why Xi and He fixed the seasons with a standard meant to endure forever.',
  ],
  s0605: [
    'Chongzhi holds that at the Tang-era winter solstice the sun was some fifty-odd du to the left of today\'s lodge, and so falsely added degrees and emptied the celestial path."',
    'Chongzhi claims the Tang-era winter solstice lay some fifty-odd du left of today\'s position, then invented extra degrees and emptied the celestial track."',
  ],
  s0606: [
    'Zu Chongzhi replied: When the Book uses the four stars\' dusk culmination to verify the divisions and extremes, it assumes the ruler faces south.',
    'Zu Chongzhi replied: When the Book uses four stars at dusk culmination to verify the solstices and equinoxes, it assumes the ruler faces south.',
  ],
  s0607: [
    'And the north-south alignment is easily gauged in detail; in the pattern of stars rising and setting, culmination at the meridian is the standard.',
    'North-south alignment is easy to judge in detail; in the cycle of rising and setting, meridian transit is the standard.',
  ],
  s0608: [
    'Earlier scholars\' commentaries all agree on this point, yet Fazxing holds that the Book\'s four stars are all in the position of Wei and Yang, as if of themselves in the si quadrant — advancing he misses the cardinal direction, retreating he is not at first appearance; he twists the scriptural text to fit his view — this perverts the teaching and distorts the facts, and is very serious.',
    'Earlier commentators all agree, yet Fazxing reads the Book\'s four stars as fixed in Wei and Yang, as if by themselves in the si quarter — he misses the cardinal direction going forward and misstates first appearance going back; twisting scripture to fit his view perverts the text and is grave indeed.',
  ],
  s0609: [
    'Setting aside wu to call it si — above wu there are stars too.',
    'Set aside wu and call it si — yet stars stand above wu as well.',
  ],
  s0610: [
    'If one must rely on the culminating lodge, how could the other lodges not also suffice to fix the time?',
    'If only the culminating lodge counts, why could the other lodges not also fix the season?',
  ],
  s0611: [
    'If saying "culminating" also implies all seven lodges, then when Zi and Shen are still hidden one could not speak; though Mao is visible, one would have to say it is occulted; when Kui and Lou are already visible, one could not speak of occultation and appearance — [text damaged] cannot serve as an argument — then to what would the name attach?',
    'If "culminating" must cover all seven lodges, then when Beak and Triplet are still hidden you could say nothing; though Mao is visible you would have to call it occulted; when Strider and Bond are already visible you could not speak of rising and setting — with such a broken argument, what could the name even attach to?',
  ],
  s0612: [
    'If the general use of "culminating lodge" is unacceptable, one should carefully examine the scriptural intent — simply say "the star Mao," not of itself Wei and Yang; Wei and Yang have no meaning of self-manifestation — on what basis does this argument stand?',
    'If the general rule of "culminating lodge" will not do, examine the text carefully: say simply "the star Mao," not Wei and Yang of themselves — Wei and Yang have no self-evident meaning; on what basis does this argument stand?',
  ],
  s0613: [
    'If reason has no foundation, any foolish phrase can become doctrine — Zeng Quan and Sang Ye are clear proof; the distinction of the divisions and extremes — on what day does it ultimately fall? Going over this again and again, I can only sigh deeply.',
    'Without rational ground any foolish phrase becomes doctrine — Zeng Quan and Sang Ye are clear proof; as for fixing the solstices and equinoxes, on what day does it finally fall? Repeating this again and again, I can only sigh.',
  ],
  s0614: [
    'Dai Fazxing objected: "The placement of his method\'s reference point nearly departs by half a lodge — every forty-five years and nine months it would shift one du on average."',
    'Dai Fazxing objected: "His method\'s reference point is nearly half a lodge off — on average one du every forty-five years and nine months."',
  ],
  s0615: [
    'Zu Chongzhi replied: The Yuanhe sun-position is what Fazxing approves — he only cites the ancient calendar placing it at Jian; examining by today\'s standards, my method\'s winter solstice is also in this lodge; southern Dipper 22 has no clear proof, yet he groundlessly denigrates my calendar as off by half a lodge — this astonishes me.',
    'Zu Chongzhi replied: Fazxing approves the Yuanhe sun-position and cites only the ancient calendar at Jian; by today\'s reckoning my winter solstice is also there — Dipper 22 has no clear proof, yet he groundlessly calls my calendar half a lodge wrong; this astonishes me.',
  ],
  s0616: [
    'Further, the remainder of the year-count has an eleventh month, yet the objection says the ninth month — whenever numbers are involved they fail to match; all are of this sort.',
    'Further, the year-count remainder includes an eleventh month, yet the objection says the ninth — whenever numbers appear they disagree; all his points are like this.',
  ],
  s0617: [
    'When the moon is full it eclipses, and this must be at solar opposition; checking the sun\'s position the lodge and degree can be determined — I ask that we rely on observed results to test coarse and fine.',
    'A full moon eclipses only at solar opposition; check the sun and the lodge-degree is fixed — let observed results test which method is coarse or fine.',
  ],
  s0618: [
    'According to the Grand Clerk\'s annotation: on the sixteenth day of the twelfth month of Yuanjia 13, at midnight the moon was totally eclipsed at Ghost 4th degree; by opposition calculation the sun should be at Ox 6.',
    'Grand Clerk records show that on Yuanjia 13, month 12, day 16, at midnight the moon was totally eclipsed at Ghost 4°; by opposition my sun should be at Ox 6.',
  ],
  s0619: [
    'By Fazxing\'s objection: "at Woman 7."',
    'By Fazxing\'s reckoning: "at Woman 7."',
  ],
  s0620: [
    'Again, on the fifteenth day of the fifth month of year 14, at the ding hour the moon was totally eclipsed at Dipper 26th degree; by opposition the sun should be at Well 30; by Fazxing\'s objection: "the sun at Willow 2."',
    'Again, Yuanjia 14, month 5, day 15, at the ding hour the moon was totally eclipsed at Dipper 26°; by opposition my sun should be at Well 30; Fazxing says: "the sun at Willow 2."',
  ],
  s0621: [
    'Again, on the fifteenth day of the eighth month of year 28, at the ding hour the moon was eclipsed at Strider 11th degree; by opposition the sun should be at Horn 2;',
    'Again, Yuanjia 28, month 8, day 15, at the ding hour the moon was eclipsed at Strider 11°; by opposition my sun should be at Horn 2;',
  ],
  s0622: [
    'By Fazxing\'s objection: "the sun at Horn 12."',
    'Fazxing says: "the sun at Horn 12."',
  ],
  s0623: [
    'Again, on the fifteenth day of the ninth month of Daming 3, at the yi hour the moon was totally eclipsed at the end of Stomach lodge; by opposition the sun should be at Base 12;',
    'Again, Daming 3, month 9, day 15, at the yi hour the moon was totally eclipsed at the end of Stomach; by opposition my sun should be at Base 12;',
  ],
  s0624: [
    'By Fazxing\'s objection: "the sun at Heart 2."',
    'Fazxing says: "the sun at Heart 2."',
  ],
  s0625: [
    'All four of these eclipses match my method exactly, not a hair\'s breadth off — yet what Fazxing relies on differs by ten full du at a stroke, violating opposition and shifting lodges — plainly visible.',
    'All four eclipses match my method exactly, yet Fazxing\'s positions differ by ten full du at once, violating opposition and shifting lodges — the mismatch is obvious.',
  ],
  s0626: [
    'Thus we know celestial numbers gradually shift — one should then take current practice as the standard; the evidence is bright and clear — how can one trust the ancient and doubt the present?',
    'Celestial numbers drift over time, so present practice should be the standard; the evidence is clear — how can one trust antiquity and doubt the present?',
  ],
  s0627: [
    'Dai Fazxing objected: "In the Odes, \'In the seventh month the Fire Star flows westward\' — this is when the Xia calendar takes shen as its first month.',
    'Dai Fazxing objected: "The Odes say, \'In the seventh month the Fire Star flows westward\' — this is when the Xia calendar sets shen as its first month.',
  ],
  s0628: [
    '\'Ding culminates at the center\' is also the Lesser Snow node.',
    '\'Ding at the center\' is also the Lesser Snow solar term.',
  ],
  s0629: [
    'If the winter solstice is truly off, then at Lord Bin\'s Fire Star\'s westward flow the gnomon shadow would be one chi five cun long, and at the building of the Chu palace the day clepsydra would mark fifty-three ke — this is extremely absurd."',
    'If the winter solstice were truly wrong, then when the Fire Star flows west for Lord Bin the gnomon would read one chi five cun, and when the Chu palace was built the day clepsydra would mark fifty-three ke — this is absurd in the extreme."',
  ],
  s0630: [
    'Zu Chongzhi replied: I find all three points in this objection mistaken.',
    'Zu Chongzhi replied: I find all three points in this objection mistaken.',
  ],
  s0631: [
    'The Odes speak of the Fire Star flowing west — it merely cites the middle of its westward shift as a sign of coming cold.',
    'The Odes\' "flowing Fire Star" merely marks the middle of its westward drift as a sign of coming cold.',
  ],
  s0632: [
    '"Flow" is not language of first motion.',
    '"Flow" does not mean first motion.',
  ],
  s0633: [
    'Even as initially stated, if the winter solstice sun-position is at Dipper 22, then Mars\'s culmination would fall before Great Heat — how could it border the shen first-month limit?',
    'Even on his own premise — winter solstice at Dipper 22 — Mars would culminate before Great Heat, not near the shen first-month boundary.',
  ],
  s0634: [
    'This is simply self-contradictory attack — not a claim that I have falsified anything.',
    'This is self-contradictory attack, not proof that my method falsifies anything.',
  ],
  s0635: [
    'The Xia Small Calendar: "In the fifth month at dusk, the Great Fire is at culmination."',
    'The Xia Small Calendar says: "In the fifth month at dusk, the Great Fire culminates."',
  ],
  s0636: [
    'Is this again in the Wei-Yang region?',
    'Is that again in Wei and Yang?',
  ],
  s0637: [
    'He also says that by my calendar the building of the Chu palace falls at the start of the ninth month.',
    'He also claims my calendar places the building of the Chu palace at the start of the ninth month.',
  ],
  s0638: [
    'According to the Odes commentary and annotation, "Ding at the center" means Encampment at dusk culmination forming a square.',
    'Odes commentary and Zheng Xuan\'s notes both say "Ding at the center" means Encampment culminating at dusk and forming a square.',
  ],
  s0639: [
    'Thus the true meridian culmination should be at Encampment 8th degree.',
    'Thus true meridian culmination should fall at Encampment 8°.',
  ],
  s0640: [
    'By my calendar\'s calculation, four days after Start of Winter in year 1, this degree culminates at dusk — which falls at the start of the tenth month, not on Cold Dew day either.',
    'By my calendar, four days after Start of Winter in year 1 this degree culminates at dusk — at the start of the tenth month, not on Cold Dew.',
  ],
  s0641: [
    'The objector\'s intent seems to mistake the Zhou era for Yao\'s time — a fifty-du difference — hence this error.',
    'The objector seems to treat the Zhou era as Yao\'s time — a fifty-du difference — hence this error.',
  ],
  s0642: [
    'Calling it the Lesser Snow node is his own assertion — there is no explicit text to support it.',
    'Calling it Lesser Snow is his own assertion — no explicit text supports it.',
  ],
  s0643: [
    'Dai Fazxing objected: "Confucius said: \'I have heard that after the Fire Star is occulted, the hibernating creatures finish.\'',
    'Dai Fazxing objected: "Confucius said: \'I have heard that after the Fire Star is occulted, the hibernating creatures are all done.\'',
  ],
  s0644: [
    'Now the Fire Star still flows westward — the calendar officers are at fault.\'',
    'Now the Fire Star still flows west — the calendar officers are at fault.\'',
  ],
  s0645: [
    'If Chongzhi is as wrong as claimed, then stars would have no fixed sequence, the trigram directions would be off, the correct names would necessarily differ ancient and modern, and the sounds of the canonical pronouncements would not match the times.',
    'If Chongzhi is as wrong as claimed, stars would have no fixed sequence, trigram directions would shift, correct names would differ ancient and modern, and canonical sounds would no longer fit the age.',
  ],
  s0646: [
    'Yao\'s Kai and Bi would become today\'s Jian and Chu; today\'s Longevity Star would be Zhou\'s Chimei."',
    'Yao\'s Kai and Bi would become today\'s Jian and Chu; today\'s Longevity Star would be Zhou\'s Chimei."',
  ],
  s0647: [
    'Even now Eastern Wall is no longer Black Tortoise, and Corner Star suddenly belongs to Azure Dragon — to slander Heaven and violate the classics to this extent!"',
    'Even now Eastern Wall is no longer Black Tortoise and Corner suddenly belongs to Azure Dragon — to slander Heaven and violate the classics to this extent!"',
  ],
  s0648: [
    'Zu Chongzhi replied: I hold that the pole star sits at the center while the arrayed luminaries hold their fixed stations; the myriad figures have distinct forms while yin and yang are distinguished — hence when feathered and shelled creatures are all displayed, water and fire have their places; when azure and white are equally set out, east and west can be gauged — names are not fixed by where the sun happens to be.',
    'Zu Chongzhi replied: The pole sits at center while the stars keep fixed stations; myriad forms differ and yin and yang are distinct — feathered and shelled creatures arrayed give water and fire their places; azure and white equally set let east and west be gauged — names are not fixed by the sun\'s current position.',
  ],
  s0649: [
    'How is this shown?',
    'How is this shown?',
  ],
  s0650: [
    'The first nine of the yang line — qi starts due north; the seven stars of Black Tortoise — Emptiness holds the zi position.',
    'The first nine of the yang line: qi begins due north; the seven stars of Black Tortoise — Emptiness holds the zi position.',
  ],
  s0651: [
    'If one uses the circular instrument to distinguish directions with the sun as master, where winter solstice lodges should be at Dark Emptiness;',
    'If the circular instrument fixes directions by the sun, winter solstice should lodge at Dark Emptiness;',
  ],
  s0652: [
    'yet today\'s south pole sits in the eastern quadrant — violating form and losing center; what meaning can this attach to?',
    'yet today\'s south pole sits in the eastern quadrant — violating form and losing center; what meaning can attach to that?',
  ],
  s0653: [
    'If north-south are named from the endowment of winter and summer, then mao and you should be named from life and death — how could spring dwell in the domain of Righteousness and autumn beautify the domain of Benevolence? Names contradict reason in such reversal!',
    'If north-south are named from winter and summer\'s endowment, mao and you should be named from life and death — how could spring dwell in Righteousness and autumn beautify Benevolence? Names and reason collide in such reversal!',
  ],
  s0654: [
    'From this one knows Heaven divides directions by the lodge sequence, not by the four seasons; the sun rides the circuit of nodes and girdle-stars — it does not alone keep to its old track.',
    'From this we know Heaven divides directions by lodge sequence, not by the four seasons; the sun rides the circuit of nodes and girdle-stars — it does not keep to its old track alone.',
  ],
  s0655: [
    'As for culminating stars\' appearance and occultation, records often use them to verify seasons — because calendar numbers are hard to detail while celestial tests are easy to show; each age relies on what fits its time as a simple practical policy.',
    'Records often use culminating stars\' risings and settings to verify seasons because calendar arithmetic is hard to detail while sky tests are easy to show — each age uses what fits its time as a practical shortcut.',
  ],
  s0656: [
    'Just as Xia ritual did not yet merge with Shang canon, how could the Huo dance follow the Shao rhythm? Truly if Heaven and human ways share the same drift, then the arts arise and shift with each era.',
    'Just as Xia ritual had not yet merged with Shang canon, how could the Huo dance follow the Shao rhythm? If Heaven and human ways drift together, the arts shift with each era.',
  ],
  s0657: [
    'Calling the moon\'s position "jian" surely follows the qi it is rooted in — the name follows what is real, not what the Dipper handle points to.',
    'Calling the moon\'s position "jian" follows the qi it is rooted in — the name tracks reality, not the Dipper handle\'s aim.',
  ],
  s0658: [
    'Comparing with Han times recently, it already differs by half a lodge — verify the Dipper-node seasons: where is the effect?',
    'Compared with Han times it already differs by half a lodge — test Dipper-node seasons: where is the proof?',
  ],
  s0659: [
    'Or if the meaning is not from classical teaching but relied on to make doctrine — are apocryphal prognostications mostly deceitful, with false phrases inserted here and there?',
    'Or if meaning not drawn from the classics is used to make doctrine — are apocryphal prognostications mostly deceit, with false phrases inserted here and there?',
  ],
  s0660: [
    'Lodge sequence follows directional names — the meaning fits the lodge bodies.',
    'Lodge sequence follows directional names — the meaning fits the lodge bodies themselves.',
  ],
  s0661: [
    'Though divisions and extremes migrate, their positions do not change — how could one say Azure Dragon and Fire trade places, or Metal and Water fall into disorder? The reproach of mismatched names has not been examined in detail.',
    'Though solstices and equinoxes migrate, their positions do not change — how could Azure Dragon and Fire trade places, or Metal and Water fall into disorder? The charge of mismatched names has not been examined.',
  ],
  s0662: [
    'As for Wall not being Black Tortoise and Corner belonging to Azure Dragon — observing degrees and inspecting shadows, the actual results are plainly so.',
    'Wall is not Black Tortoise and Corner belongs to Azure Dragon — observe degrees and inspect shadows, and the results plainly show it.',
  ],
  s0663: [
    'In the Yuanjia calendar method, the start of the Longevity Star was also in the Wing range — comparing with Jin-era annotations, there are many clear proofs.',
    'In the Yuanjia calendar the Longevity Star\'s start was also in the Wing range — compare Jin-era notes and the proofs are many.',
  ],
  s0664: [
    'Celestial numbers drift over a hundred-odd years — if the objector could truly unleash rhetoric and debate to make the south pole not be winter solstice and full moon not be at opposition, then this talk could be upheld.',
    'Celestial numbers drift over a hundred-odd years — if the objector could truly debate away winter solstice at the south pole and full moon at opposition, then this talk might stand.',
  ],
  s0665: [
    'If the sun\'s migration by lodge is allowed, there is no need for repeated objections — this is good proof of my calendar, not something the critic should raise.',
    'Allow the sun\'s lodge migration and there is no need for repeated objections — this supports my calendar; it is not a point the critic should raise.',
  ],
  s0666: [
    'Examining what I hold to, I always rely on classics and histories — examining Tang canon in the distance, citing Han records in the near; apocryphal fragments I dare not follow — I hold this to be argument according with the classics.',
    'What I hold always rests on classics and histories — Tang canon in the distance, Han records near at hand; apocryphal fragments I dare not follow — this is argument according with the classics.',
  ],
  s0667: [
    'Testing sun-position by lunar eclipse — the evidence is bright and clear; historical annotations discuss it in detail, the text stored in the forbidden archives — this too is reasoning grounded in Heaven.',
    'Testing sun-position by lunar eclipse — the evidence is clear; historical notes discuss it in detail and the text rests in the forbidden archives — this too is reasoning grounded in Heaven.',
  ],
  s0668: [
    'The four stars of the Canon of Yao are all placed in Wei and Yang; today\'s sun-position departs far from the Yuanhe standard — the reproach of slander and violation refers precisely to this.',
    'The four stars of the Canon of Yao are all placed in Wei and Yang; today\'s sun-position departs far from the Yuanhe standard — the charge of slander and violation refers precisely to this.',
  ],
  s0669: [
    'Dai Fazxing objected: "The sun has slow and fast phases, hence the Dipper span has wide and narrow — the ancients made the intercalation rule and set the mean standard: over nineteen accumulated years there are always seven intercalations; gnomon shadows may be surplus or deficit — this cannot be changed.',
    'Dai Fazxing objected: "The sun has slow and fast phases, so the Dipper span has wide and narrow parts — the ancients made the intercalation rule and set the mean standard: over nineteen years there are always seven leap months; gnomon shadows may run surplus or deficit — this cannot be changed.',
  ],
  s0670: [
    'Chongzhi trims intercalations and ruins the rule, halving the remainders — then in the 139th year, second month, under the Quarter-Remainder system, suddenly one day short;',
    'Chongzhi trims intercalations and ruins the rule, halving the remainders — then in year 139, month 2, under the Quarter-Remainder system, suddenly one day short;',
  ],
  s0671: [
    'in 7,429 years one intercalation would be lost.',
    'in 7,429 years one intercalation would be lost.',
  ],
  s0672: [
    'If days are fewer, events come early; if intercalations are lost, affairs are contradicted.',
    'Fewer days mean events come early; lost intercalations mean affairs fall out of step.',
  ],
  s0673: [
    'I have heard that seasons serve to do work, and work serves to nourish life — this is the root of the people and the first of calendar numbers.',
    'Seasons serve work, and work nourishes life — this is the people\'s foundation and the first concern of calendar reckoning.',
  ],
  s0674: [
    'I fear this is not Chongzhi\'s shallow thought that one may rashly carve and bore."',
    'I fear this is not shallow thinking that one may rashly carve and bore."',
  ],
  s0675: [
    'Zu Chongzhi replied: According to the History of the Later Han and the Qianxiang Treatise, the Quarter-Remainder calendar method — though its intercalation rule and bamboo tallies were first devised in the Yuanhe era — its gnomon instrument and various constants were fixed in the third year of Jiaping.',
    'Zu Chongzhi replied: The History of the Later Han and Qianxiang Treatise show that though the Quarter-Remainder intercalation rule and bamboo tallies began in the Yuanhe era, its gnomon constants were fixed in Jiaping 3.',
  ],
  s0676: [
    'The Quarter-Remainder treatise: at mid-term of Start of Winter the shadow is one zhang; at mid-term of Start of Spring, nine chi six cun.',
    'The Quarter-Remainder treatise: at Start of Winter mid-term the shadow is one zhang; at Start of Spring mid-term, nine chi six cun.',
  ],
  s0677: [
    'Seeking winter solstice at the south pole, the gnomon is longest; the two qi are equidistant from the solstice and the day-counts are the same — thus mid-term shadows should be equal, yet the former is long and the latter short, suddenly differing four cun — this is proof the calendar\'s solstice shadow puts winter solstice late.',
    'At winter solstice the gnomon is longest; Start of Winter and Start of Spring are equidistant from solstice with equal day-counts — mid-term shadows should match, yet the first is longer and the second shorter by four cun — proof the calendar places winter solstice late.',
  ],
  s0678: [
    'Mid-term shadows of the two qi differ by nine fen and a little under — advance and retreat are evenly adjusted, scarcely any surplus or deficit.',
    'Mid-term shadows of the two qi differ by nine fen and a fraction — advance and retreat are evenly adjusted, with scarcely any surplus or deficit.',
  ],
  s0679: [
    'Calculating by rate, if each qi retreats two days twelve ke, then the gnomon numbers — Start of Winter shorter, Start of Spring longer — would both differ two cun, and mid-term shadows of both qi would be nine chi eight cun.',
    'By rate, if each qi retreats two days twelve ke, Start of Winter shadows shorten and Start of Spring lengthen by two cun each — both mid-term shadows become nine chi eight cun.',
  ],
  s0680: [
    'That is the true day of Start of Winter and Start of Spring.',
    'Those are the true days of Start of Winter and Start of Spring.',
  ],
  s0681: [
    'From this one infers the calendar\'s placement of winter solstice puts it two days twelve ke late.',
    'From this the calendar\'s winter solstice is two days twelve ke late.',
  ],
  s0682: [
    'In Jiaping 3, the calendar of the time had winter solstice on dingchou, the added hour exactly at midday.',
    'In Jiaping 3 the calendar placed winter solstice on dingchou with the added hour exactly at midday.',
  ],
  s0683: [
    'Subtracting two days twelve ke, Heaven fixes winter solstice on yihai, the added hour thirty-eight ke after midnight.',
    'Subtract two days twelve ke and Heaven fixes winter solstice on yihai, thirty-eight ke after midnight.',
  ],
  s0684: [
    'Further, my shadow-measurement calendar record — I personally distinguished fen and cun; the bronze gnomon rigid and firm, swollen by damp it did not shift; light and shadow clear and clean, every hair\'s breadth evident.',
    'My shadow-measurement records show I personally distinguished fen and cun; the bronze gnomon was rigid and did not shift when damp; light and shadow were clear to the finest line.',
  ],
  s0685: [
    'According to Daming 5: on the tenth day of the tenth month the shadow was one zhang seven cun seven fen and a half; on the twenty-fifth day of the eleventh month, one zhang eight cun one fen tai; on the twenty-sixth, one zhang seven cun five fen strong — taking the mean, meridian winter solstice should fall on the third day of the eleventh month.',
    'Daming 5: month 10, day 10, shadow one zhang seven cun seven fen and a half; month 11, day 25, one zhang eight cun one fen tai; day 26, one zhang seven cun five fen strong — taking the mean, meridian winter solstice should fall on month 11, day 3.',
  ],
  s0686: [
    'To find whether early or late, subtract the shadows of the following two days — that gives the daily difference rate.',
    'To find whether solstice is early or late, subtract the shadows of the following two days — that yields the daily difference rate.',
  ],
  s0687: [
    'Double it for the divisor; subtract the prior two days; multiply by one hundred ke for the dividend; divide dividend by divisor — winter solstice\'s added hour is thirty-one ke after midnight, one day after the Yuanjia calendar — the true celestial number.',
    'Double that for the divisor, subtract the prior two days, multiply by one hundred ke for the dividend, and divide — winter solstice falls thirty-one ke after midnight, one day after the Yuanjia calendar: the true celestial number.',
  ],
  s0688: [
    'Measuring and checking through the full year, the reductions and counts agree uniformly; testing across different years, near and far match the rate.',
    'Checking through the full year, reductions and counts agree uniformly; testing other years, near and far match the rate.',
  ],
  s0689: [
    'From this evidence I examined and corrected the intercalation rule.',
    'From this evidence I examined and corrected the intercalation rule.',
  ],
  s0690: [
    'Now computing by my calendar, the ke as before — I hold it extremely precise, to be the fixed standard forever.',
    'Computing by my calendar yields the same ke as before — I hold it extremely precise and fit to be the fixed standard.',
  ],
  s0691: [
    'Examining ancient calendar methods, all matched the Quarter-Remainder; its numbers over time put Heaven late — after three hundred years, new moon differs by one day.',
    'Ancient calendar methods all matched the Quarter-Remainder; over time its numbers put Heaven late — after three hundred years new moon slips one day.',
  ],
  s0692: [
    'Hence over four hundred years of Han, eclipses mostly fell on the last day of the month.',
    'Hence over four hundred Han years, eclipses mostly fell on the last day of the month.',
  ],
  s0693: [
    'Since the Wei era this method was reformed — the world did not fault it; it truly matched Heaven.',
    'Since Wei this method was reformed and the world did not fault it — it truly matched Heaven.',
  ],
  s0694: [
    'Nineteen-year intercalation rule is especially coarse — it comes from the same prior methods, not seen in the classics.',
    'The nineteen-year intercalation rule is especially coarse — it comes from the same prior methods, not from the classics.',
  ],
  s0695: [
    'Yet the objection says this method is ancient and the numbers cannot shift.',
    'Yet the objection says this method is ancient and the numbers cannot shift.',
  ],
  s0696: [
    'If ancient methods though coarse must forever be followed and this fallacy truly stands — then Fazxing would again want to apply the Quarter-Remainder to the present day — does reason allow this?',
    'If coarse ancient methods must forever be followed and this fallacy stands, Fazxing would again apply the Quarter-Remainder today — does reason allow that?',
  ],
  s0697: [
    'This I do not understand.',
    'This I do not understand.',
  ],
  s0698: [
    'If one says today\'s innovations violate and miss the mean, I have not heard clear evidence to overturn my method.',
    'If today\'s reforms violate the mean, I have heard no clear evidence to overturn my method.',
  ],
  s0699: [
    'The Yuanjia calendar method reduced the intercalary remainder by two — simply inheriting the old coarse fractions — hence advance and retreat did not agree.',
    'The Yuanjia calendar reduced the intercalary remainder by two — simply inheriting old coarse fractions — so advance and retreat did not agree.',
  ],
  s0700: [
    'As for abandoning surplus to seek correctness — this is not contrary to reason.',
    'Abandoning surplus to seek correctness is not contrary to reason.',
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

const batch7 = data.sentences.filter((s) => {
  const n = Number.parseInt(s.id.slice(1), 10);
  return n >= 601 && n <= 700;
});
const empty = batch7.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
console.log(`Updated ${updated} sentences`);
console.log(`Batch 7 rows in file: ${batch7.length}`);
console.log(`Missing map entries in file: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Empty literal/idiomatic in batch 7: ${empty.length}`);
if (missing.length || empty.length) {
  if (missing.length) console.error('Missing:', missing.join(', '));
  if (empty.length) console.error('Empty:', empty.map((s) => s.id).join(', '));
  process.exit(1);
}
