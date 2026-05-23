#!/usr/bin/env node
import fs from 'node:fs';

const file = 'translations/current_translation_songshu.json';
const chapterFile = 'data/songshu/013.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));

/** Ensure batch-8 sentence rows exist in the working translation file. */
const existing = new Set(data.sentences.map((s) => s.id));
const sourceById = new Map();
chapter.content.forEach((block, blockIndex) => {
  for (const s of block.sentences || []) {
    const n = Number.parseInt(s.id.slice(1), 10);
    if (n >= 701 && n <= 779) {
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
  s0701: [
    'If one follows the objection\'s intent and on average nothing can be changed, then the divisions gain and lose nothing — yet setting the method according to Heaven would again be wrong and in error.',
    'Follow the objection to its conclusion — nothing may change on average, the solstice-equinox divisions neither gain nor lose — and yet a calendar ordained by Heaven becomes wrong again. The contradiction is plain.',
  ],
  s0702: [
    'As for solar terms early or late, one should follow the Jingchu calendar; the two solstices differ by three days, yet they never notice their error and arbitrarily claim my calendar is wrong — they perceive that fewer days make the time early, but do not grasp that adding months is deeply confusing.',
    'Solar terms early or late should follow the Jingchu calendar, you say — yet the two solstices are three days off and you never notice; you denounce my calendar while grasping that fewer days bring events early, but not that piling on months breeds worse confusion.',
  ],
  s0703: [
    'Having truly not seen celestial verification, how can one measure the essentials of calendar reckoning — the foundation of the people? Surely this is not something to be decided at will.',
    'Without ever looking to the sky for proof, how can one judge the heart of calendar reckoning — the foundation of the people? That surely is not a matter for arbitrary decree.',
  ],
  s0704: [
    'Further, Fazxing first said he fully understood gnomon changes and could revise the old and reform the present, then again said gnomon numbers surplus and deficit cannot serve as standard — contradicting himself, with no idea what to rely on.',
    'Fazxing first claimed he had mastered gnomon change and could cut the old and shape the new — then declared gnomon surplus and deficit unfit for a standard. He contradicts himself and knows not what to stand on.',
  ],
  s0705: [
    'If calculation cannot match, the work of Heaven is cut off from eye and mind — I do not see on what basis the calendar era could be established.',
    'If computation cannot hit the mark, Heaven\'s work is blind to eye and mind alike — on what basis, then, was the calendar era ever erected?',
  ],
  s0706: [
    'Examining from the Spring and Autumn Annals for more than a thousand years, checking new moons by the eclipse records, there has never been error — this is clear proof that the sun\'s daily motion is constant.',
    'From the Spring and Autumn Annals down through a thousand years and more, new moons checked against eclipse records have never missed — bright proof that the sun\'s daily motion is constant.',
  ],
  s0707: [
    'Moreover, I have measured shadows for a full year, examining the finest details; tested against earlier records, they match like seal and tally. Mencius held that the solstice of a thousand years hence can be known while seated — this saying is true.',
    'I have measured shadows through a full year, scrutinizing the finest lines; checked against prior records, they fit like seal and tally. Mencius said the solstice a thousand years hence can be known while seated — and he spoke true.',
  ],
  s0708: [
    'The sun\'s slow and fast phases — I have not seen proof of them; empty words and baseless denigration — I confess I do not fear.',
    'The sun\'s slow and fast phases — I have seen no proof. Empty rhetoric and hollow slander — those I do not fear.',
  ],
  s0709: [
    'Fazxing argued: "Chongzhi already says the winter solstice shifts year by year, yet also holds Emptiness as north-center — abandoning form and relying on shadow, this is not enough to count as error."',
    'Fazxing argued: "Chongzhi claims the winter solstice drifts year by year, yet also makes Emptiness the northern center — abandoning form for shadow alone. That hardly proves him wrong."',
  ],
  s0710: [
    'Why?',
    'How so?',
  ],
  s0711: [
    'Whatever is in heaven is unclear without the sun; on earth one distinguishes by the Dipper — suppose winter solstice were at Emptiness, then the Yellow Track would be farther still; the northeast should be the palace of Yellow Bell, Roof and Wall should belong to Dark Establishment — how could Emptiness lodge again be north-center?',
    'Heaven\'s signs are dark without the sun; on earth we orient by the Dipper. Grant winter solstice at Emptiness — the Yellow Track recedes farther still; the northeast should be Yellow Bell\'s palace, Roof and Wall Dark Establishment\'s seat — how could Emptiness lodge be north-center again?',
  ],
  s0712: [
    'Forcing the solstices and equinoxes to shift repeatedly while star sequence does not change, moving the polar-indicator\'s cord while pitch-pipes stay the same — then the seven luminaries would not be aligned by the armillary sphere, the founding of seasons would not be marked by Raghorn either; one would not know where the Five Phases dwell or where the six domains attach.',
    'Force the solstices and equinoxes to wander while star sequence stands still, swing the polar cord while pitch-pipes hold their course — then the seven luminaries no longer align by the armillary sphere, seasons no longer open under Raghorn\'s mark; the Five Phases lose their seats, the six domains their moorings.',
  ],
  s0713: [
    '" Chongzhi said: "The grievance in this point has already been treated in detail in my earlier memorial."',
    'Chongzhi replied: "This objection was already answered at length in my earlier memorial."',
  ],
  s0714: [
    'Shift of sequence and change of direction — Emptiness is not the center; verbose arguments and broad proofs only construct confusion — all are the objector\'s mistakes, not flaws in my method\'s design.',
    'Sequence shifts and directions move — Emptiness is no center. Verbose proofs only weave confusion. These are the objector\'s errors, not faults in my method\'s design.',
  ],
  s0715: [
    '"Seven luminaries aligned" refers to the celestial instrument; Zheng Xuan and Wang Su expounded it — their teaching is clear and apt; though there are differing views, they are surely not the real meaning.',
    '"Seven luminaries aligned" means the celestial instrument itself. Zheng Xuan and Wang Su taught it clearly; other readings exist, but they are not the real meaning.',
  ],
  s0716: [
    'Fazxing argued: "In establishing origin and setting era, each has its preference — some rely on apocryphal texts, some take effect from the present age."',
    'Fazxing argued: "Every calendar sets its origin and era by its own lights — some from apocryphal charts, some from what works in the present age."',
  ],
  s0717: [
    'Chongzhi says "the many schools dispute, none discerning the conjunction."',
    'Chongzhi says, "Schools dispute and none can fix the conjunction."',
  ],
  s0718: [
    '"In the past the Yellow Emperor calendar had xinmao — sun and moon did not err; Zhuanxu had yimao — four seasons were not off; Jingchu had renchen — last days had no wrong brilliance; Yuanjia had gengchen — new moons had no mistaken shadows — are these not calendars that matched Heaven?"',
    '"The Yellow Emperor calendar at xinmao — sun and moon never strayed; Zhuanxu at yimao — seasons never missed; Jingchu at renchen — month-ends without false light; Yuanjia at gengchen — new moons without wrong shadow. Were these not calendars that truly matched Heaven?"',
  ],
  s0719: [
    'Chongzhi, if he merely preserves jiazi, can be said to have forced a match to seek Heaven\'s approval."',
    'If Chongzhi merely clings to jiazi, he has forced a fit to win Heaven\'s favor."',
  ],
  s0720: [
    '" Chongzhi said: Calendar reckoning requires close effect and precision — it cannot tolerate separate preferences; matching apocrypha and contradicting teaching — the exegetical meaning is not what I take; though verified in its time, it cannot extend to the distant future — this too is what I am not at ease with."',
    'Chongzhi replied: A calendar must be precise in its effects — it cannot serve separate tastes. Matching apocrypha while betraying exegesis I will not take; what fits one age may fail the distant future — and that too I cannot accept.',
  ],
  s0721: [
    'The origin\'s value is in its founding name — the principle is clear and right.',
    'An origin earns its name at the founding — the principle is lucid and sound.',
  ],
  s0722: [
    'I do not know what the xinmao claim rests on; the ancient methods are absurd — this was treated in my earlier memorial; drowning in names and losing substance — hardly what seeking hidden meaning means.',
    'I do not see what the xinmao claim rests on. Those ancient methods are absurd — I treated them in my earlier memorial. Drowning in names while losing substance is hardly "seeking the hidden."',
  ],
  s0723: [
    'If a calendar matches only one moment, by reason it cannot long serve; the origin lies where conjunctions fall — there is no fixed year-count — now let effectiveness clarify this.',
    'If a calendar fits only one moment, reason says it cannot endure. The origin sits where conjunctions fall — there is no fixed year-count. Let present proof decide.',
  ],
  s0724: [
    'Before Xia and Yin, records were lost; the Spring and Autumn Annals and Han histories all record solar eclipses — the first day of the month is detailed and can be clearly verified.',
    'Before Xia and Yin, records were lost. The Spring and Autumn Annals and Han histories record solar eclipses in detail — new moons plainly verifiable.',
  ],
  s0725: [
    'Checking by my calendar, the numbers all agree — truly no empty setup; proceeding with precision through the ages, for a thousand years without difference — then even the distant is knowable.',
    'Checked against my calendar, the numbers all agree — no empty artifice. Proceed with precision and a thousand years show no drift — even the far past becomes knowable.',
  ],
  s0726: [
    'Having reviewed past methods, their looseness is indeed great — some differ three days on new moon, solar terms shift seven mornings — I have not heard that any can extend down to the present.',
    'Past methods, reviewed in full, are loose in the extreme — new moons off by three days, solar terms by seven mornings. None, I hear, can stretch down to our day.',
  ],
  s0727: [
    'When the origin was in yichou, earlier critics called it incorrect; now at jiazi, objectors again suspect forced matching — a year without canonical name has never existed before — then those who push antiquity, from what will they proceed?',
    'When the origin stood at yichou, critics called it wrong; now at jiazi they cry forced fit again. A nameless year never existed in antiquity — then on what will antiquarians stand?',
  ],
  s0728: [
    'The making of calendar eras would nearly cease.',
    'Calendar-making would nearly come to a halt.',
  ],
  s0729: [
    'To force a match there must always be a mismatch — I wish to hear clear evidence to verify truth and fact.',
    'Every forced fit hides a misfit. I ask for clear evidence to test truth against fact.',
  ],
  s0730: [
    'Fazxing said: "The origin of conjunctions — then eclipses can be sought; the juncture of slow and fast — this is not what ordinary men can measure."',
    'Fazxing said: "Fix the origin of conjunction and eclipses follow; the juncture of slow and fast lies beyond ordinary reckoning."',
  ],
  s0731: [
    'In the past Jia Kui glimpsed the difference, Liu Hong roughly set forth the method — as for the numbers coarse and fine, none have reached the limit.',
    'Jia Kui once glimpsed the difference; Liu Hong roughly sketched the method. As for coarse and fine numbers, none have reached the limit.',
  ],
  s0732: [
    'Moreover the five girdle-stars\' positions at times swell and shrink — just as when Jupiter is at Axle, its appearance leaps seven lodges; since computists already trace calculation to match the present, past and future can surely be known.',
    'The five girdle-stars swell and shrink in their stations — Jupiter at Axle, visible, leaps seven lodges. Since astronomers trace calculation to the present, past and future are surely known.',
  ],
  s0733: [
    'Why Jingchu placed the difference at the era start and Yuanjia additionally set later origins — both save effort for practical use, not empty extrapolation for needless trouble.',
    'Jingchu placed its difference at the era head; Yuanjia added later origins — both to save labor for practical use, not to spin empty extrapolation.',
  ],
  s0734: [
    'Chongzhi both violated Heaven in reform and designed methods to suit his wishes — I deem this the great fault in governing calendar reckoning."',
    'Chongzhi both defied Heaven in reform and shaped methods to his whim — the gravest fault in calendar governance."',
  ],
  s0735: [
    '" Chongzhi said: The ratios of slow and fast do not come from spirits and marvels — they have form that can be inspected, numbers that can be derived; since Liu and Jia could set them forth, one can accumulate effort to seek precision."',
    'Chongzhi replied: Slow-fast ratios are not born of spirits — they have form to inspect and numbers to derive. Liu and Jia laid the groundwork; one may pile effort until precision is won.',
  ],
  s0736: [
    'The objection again says "the five girdle-stars\' positions at times swell and shrink."',
    'The objection repeats: "The five girdle-stars swell and shrink in their stations."',
  ],
  s0737: [
    '"When Jupiter is at Axle, its appearance leaps seven lodges."',
    '"When Jupiter is at Axle, visible, it leaps seven lodges."',
  ],
  s0738: [
    'This means it should shift one lodge per year.',
    'He means it should move one lodge each year.',
  ],
  s0739: [
    'Examining Jupiter\'s course: each year it always overshoots its station; circling heaven seven times, it then leaps one position.',
    'Jupiter\'s course: each year it overshoots its station; seven circuits of heaven, then one leap forward.',
  ],
  s0740: [
    'Seeking by successive ages, among some ten calendar methods all converging on one moment — this number is everywhere the same; historical notes record it, and celestial verification again matches.',
    'Track it age by age — ten calendar methods, all converging on one moment. The number is everywhere the same; histories record it, the sky confirms it.',
  ],
  s0741: [
    'This is the course of surplus in station — it has its fixed standard; it is not reckless extrapolation and random shifting, suddenly overshooting in one bound.',
    'This is surplus motion by fixed rule — not reckless extrapolation, not a sudden leap past opposition in one bound.',
  ],
  s0742: [
    'If it truly arose from swell and shrink, how could it always be fast and never slow?',
    'If swell and shrink truly ruled it, how could it run always fast and never slow?',
  ],
  s0743: [
    'Those who select luminaries and measure the sky must estimate and analyze degrees, examine past and verify future, take actual observation as standard, and ground in classics and histories.',
    'Those who read the stars must analyze degrees, test past against future, take what the eye sees as standard, and anchor in classics and histories.',
  ],
  s0744: [
    'Tortured arguments and fragmentary talk are mostly hollow and devious; the books of Gan and Shi contradict each other.',
    'Tortured arguments and broken phrases are mostly hollow trickery; Gan and Shi\'s books contradict each other.',
  ],
  s0745: [
    'Now with one line of scripture to slander one character\'s error, stubbornly holding a partial view to obscure right reason — this is what my plain mind has never been able to accept.',
    'One line of scripture to convict one character\'s flaw, a partial view held stubbornly to blind right reason — my plain mind has never stomach for this.',
  ],
  s0746: [
    'Calculation begins from the near — all methods can agree; only Jingchu\'s two differences, inheriting the later origin after Chengtian, truly because odd and even did not accord, hence numbers could not be wholly identical — they left the earlier and set the later for ease and simplicity.',
    'Calculation starts from the near — all methods may agree. Only Jingchu\'s twin differences, inheriting Chengtian\'s later origin, failed because odd and even would not align; numbers could not match wholly, so they kept the earlier and set the later for simplicity.',
  ],
  s0747: [
    'In offering proposals and raising debate, why would one prize perverse difference? It is simply to let fact show through words — the rhetorical force can be taken to its limit.',
    'In debate one does not prize perversity for its own sake — one lets fact shine through words until the argument reaches its limit.',
  ],
  s0748: [
    'Tracing the origin to past years, all numbers begin together — this is truly the body of the art; by reason it cannot be faulted;',
    'Trace the origin to antiquity and all numbers begin together — this is the body of the art; reason itself forbids faulting it;',
  ],
  s0749: [
    'yet those who fault it call it a fault — the greatest error.',
    'yet critics call it fault — the greatest error of all.',
  ],
  s0750: [
    'Then Yuanjia\'s setting of origin — though its seven ratios were wrongly set out, still its era matched jiazi and qi and new moon all terminated together — this was the lesser fault.',
    'Yuanjia\'s origin-setting — seven ratios wrongly arrayed, yet era, qi, and new moon all closed on jiazi — that was the lesser fault.',
  ],
  s0751: [
    'Must one empty establish a superior origin, falsely call it calendar beginning, let years violate the founding name, sun avoid the era head, intercalary remainder and new-moon fraction, moon-path and seven ratios — all have no end — before it counts as a balanced system?',
    'Must one hollowly erect a superior origin, falsely name the calendar\'s birth, let years betray the founding name, the sun flee the era head, intercalary remainder and new-moon fraction, moon-path and seven ratios all without end — before the system is judged balanced?',
  ],
  s0752: [
    'Designing methods for truth and fact — that is what the mind can rest in;',
    'Methods shaped to truth and fact — that is what the mind can rest in;',
  ],
  s0753: [
    '"Reform violates Heaven" — I have not seen the reason in that reproach.',
    '"Reform defies Heaven" — I see no reason in that reproach.',
  ],
  s0754: [
    'Fazxing said: "The sun has eight paths that merge into one track; the moon has one path split into nine paths — left is conjunction, right is fast, half and double mutually diverge; in the principle of one cycle completing, the day-counts should be the same."',
    'Fazxing said: "The sun runs eight paths that merge into one track; the moon one path split into nine — left conjunction, right fast, half and double at odds. When one cycle completes, the day-counts should match."',
  ],
  s0755: [
    'Chongzhi\'s unified conjunction cycle feels nine thousand forty short compared to the synodic period; its yin-yang seventy-nine cycles plus a fraction — the slow-fast does not reach one full circuit — then what should shrink swells, what should decrease increases."',
    'Chongzhi\'s unified conjunction cycle falls nine thousand forty short of the synodic period; yin-yang runs seventy-nine cycles and a fraction while slow-fast never completes one circuit — what should shrink swells, what should decrease grows."',
  ],
  s0756: [
    '" Chongzhi said: This objection, though wandering and unsupported, yet its words and traces can be inspected."',
    'Chongzhi replied: This objection wanders without ground — yet its words leave traces that can be inspected.',
  ],
  s0757: [
    'Taking the sun\'s eight paths as analogy to the moon\'s nine paths — this is the track of the moon\'s motion; it should follow one rut, circling heaven — by reason there is no deviation.',
    'The sun\'s eight paths mirror the moon\'s nine — the moon\'s track. It should follow one rut, wheeling through heaven without deviation.',
  ],
  s0758: [
    'Then at the moment of conjunction there should be a fixed place — how could it sometimes be Dipper, sometimes Ox, both occupying one degree?',
    'At conjunction there must be a fixed place — how could it be Dipper one time, Ox another, both sharing one degree?',
  ],
  s0759: [
    'Distance from the pole should be equal — how could north and south be without fixed rule?',
    'Distance from the pole should be equal — how could north and south lack fixed rule?',
  ],
  s0760: [
    'If sun and moon are not the pattern, then is the doctrine of eight paths mere interpolated text?',
    'If sun and moon are not the pattern, is the eight-path doctrine mere interpolated text?',
  ],
  s0761: [
    '"Left conjunction, right fast" — the language is quite unclear: does it mean conjunction opposes fast?',
    '"Left conjunction, right fast" — the phrase is unclear. Does conjunction oppose fast?',
  ],
  s0762: [
    'Or that setting aside conjunction is just fast?',
    'Or does setting conjunction aside mean fast alone?',
  ],
  s0763: [
    'If setting aside conjunction is just fast, then conjunction at mean rate entering the ephemeris on the seventh and twenty-first days is the case.',
    'If setting conjunction aside is fast alone, then conjunction at mean rate enters the ephemeris on the seventh and twenty-first days.',
  ],
  s0764: [
    'When conjunction coincides with eclipse it should be at the extreme of swell and shrink — how could there be increase or decrease, more or less?',
    'When conjunction meets eclipse it should sit at swell-shrink extremes — how could increase or decrease vary, more or less?',
  ],
  s0765: [
    'If conjunction opposes fast, then at conjunction\'s opposite it should be the start of slow and fast — how could entering the ephemeris be sometimes deep, sometimes shallow, half and double mutually divergent? Ancient and modern share this — again citing this line, to clarify what?',
    'If conjunction opposes fast, opposition should mark slow-fast beginnings — how could ephemeris entry run deep or shallow, half and double at odds? Old and new calendars agree here — why cite this line, and to prove what?',
  ],
  s0766: [
    'I have reviewed calendar books ancient and modern, largely complete — to such a saying I have never heard before; far from old standards, near violating celestial numbers — seeking this in my plain mind, I confess deep perplexity.',
    'I have read calendar books ancient and modern, nearly complete — never heard such a claim. It deserts old standards and defies present numbers; searched with my plain mind, I confess deep bewilderment.',
  ],
  s0767: [
    'Slow-fast and yin-yang do not generate each other — hence at conjunction the added hour, advance and retreat are without fixed rule; former methods recorded this long ago, earlier scholars spoke of it in detail.',
    'Slow-fast and yin-yang do not beget each other — so conjunction hours advance and retreat without fixed rule. Old methods recorded this; earlier scholars spoke at length.',
  ],
  s0768: [
    'Yet Fazxing says the day-counts are the same.',
    'Yet Fazxing says the day-counts match.',
  ],
  s0769: [
    'I privately think the objector has not understood this meaning — the error shows by itself, with no need for hurried debate; having said swell and shrink miss the mean, yet again not fully recording the numbers — or does he distrust his own position, and so vaguely abbreviate his argument?',
    'I think the objector has not grasped this — the error shows itself, no hasty rebuttal needed. He claims swell-shrink misses the mean yet will not set the numbers down — or does he doubt his own case and vaguely trim his words?',
  ],
  s0770: [
    'Again, taking the whole as rate, one should mutually follow its parts — both numbers Fazxing listed are wrong; perhaps taking eighty for seventy-nine — what should shrink swells, what should decrease increases — this is what that point means.',
    'Taking the whole as rate, one must follow its parts — both numbers Fazxing lists are wrong; perhaps eighty for seventy-nine. What should shrink swells, what should decrease grows — that is what his point amounts to.',
  ],
  s0771: [
    'Examining his objections in sum — not only is my calendar imprecise, he also says He Chentian\'s method is wrong in the extreme.',
    'Taken together, his objections declare not only my calendar imprecise but He Chentian\'s method wrong in the extreme.',
  ],
  s0772: [
    'If my calendar should be discarded, then Chentian\'s art is even less usable.',
    'If my calendar must go, Chentian\'s art is even less usable.',
  ],
  s0773: [
    'If Fazxing\'s judgment is so clear, then reform should follow.',
    'If Fazxing\'s judgment is so sure, let him reform the calendar.',
  ],
  s0774: [
    'As for apogee not at Jing, full moon not at solar opposition — for all such new claims, surely there must be brilliant arguments?',
    'Apogee not at Jing, full moon not at solar opposition — for every novel claim, surely there must be brilliant arguments?',
  ],
  s0775: [
    'At that time Fazxing was favored by Emperor Xiaowu; the realm feared his power — once he raised a different view, debaters all attached themselves to him.',
    'Fazxing then stood in Emperor Xiaowu\'s favor; the realm feared his power. Once he raised dissent, every debater fell in behind him.',
  ],
  s0776: [
    'Only Palace Secretariat Attendant Chao Shangzhi upheld Chongzhi\'s method, holding that evidence favored its adoption.',
    'Only Palace Secretariat Attendant Chao Shangzhi upheld Chongzhi\'s method and argued the evidence favored adoption.',
  ],
  s0777: [
    'The emperor loved the novel and admired antiquity, and wished to adopt Chongzhi\'s new method — it was the eighth year of Daming.',
    'The emperor loved the novel and revered antiquity; he wished to adopt Chongzhi\'s new method — in the eighth year of Daming.',
  ],
  s0778: [
    'Hence the next year would change the era name, and thereby reform the calendar.',
    'The next year would change the era name and, with it, the calendar.',
  ],
  s0779: [
    'Before it could be implemented, the imperial carriage came to its evening halt — the emperor died.',
    'Before it could take effect, the imperial carriage halted at evening — the emperor was dead.',
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

const batch8 = data.sentences.filter((s) => {
  const n = Number.parseInt(s.id.slice(1), 10);
  return n >= 701 && n <= 779;
});
const empty = batch8.filter((s) => !s.literal?.trim() || !s.idiomatic?.trim());
console.log(`Updated ${updated} sentences`);
console.log(`Batch 8 rows in file: ${batch8.length}`);
console.log(`Missing map entries in file: ${missing.length ? missing.join(', ') : 'none'}`);
console.log(`Empty literal/idiomatic in batch 8: ${empty.length}`);
if (missing.length || empty.length) {
  if (missing.length) console.error('Missing:', missing.join(', '));
  if (empty.length) console.error('Empty:', empty.map((s) => s.id).join(', '));
  process.exit(1);
}
