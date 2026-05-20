#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s0401": [
    "At greatest slowness the sun travels twelve and a fraction degrees per day; at greatest speed, fourteen and a half degrees.",
    "At slowest the sun moves twelve+ degrees daily; at fastest, fourteen and a half."
  ],
  "s0402": [
    "Slow gradually becomes fast; at greatest speed gradually becomes slow—twenty-seven and a half days complete one slow-fast cycle.",
    "Slow turns fast, fast turns slow—a full cycle in twenty-seven and a half days."
  ],
  "s0403": [
    "Also the moon's path slants across the Yellow Path.",
    "The moon's path slants across the ecliptic."
  ],
  "s0404": [
    "Thirteen and a fraction days north of the ecliptic, then thirteen and a fraction south.",
    "Thirteen+ days north of the ecliptic, then thirteen+ south."
  ],
  "s0405": [
    "At greatest north-south distance, six degrees from the ecliptic.",
    "Maximum deviation from the ecliptic is six degrees."
  ],
  "s0406": [
    "Twenty-seven and a fraction days complete one yin-yang cycle.",
    "Twenty-seven+ days complete one yin-yang cycle."
  ],
  "s0407": [
    "Zhang Heng said: \"Facing the sun's opposite point, it is as large as the sun; sunlight does not shine there—this is called the dark void.\"",
    "Zhang Heng: \"Opposite the sun lies the dark void where sunlight does not reach.\""
  ],
  "s0408": [
    "When the dark void meets the moon, lunar eclipse; when it meets a star, the star vanishes.\"",
    "Dark void meeting moon causes eclipse; meeting a star, the star vanishes.\""
  ],
  "s0409": [
    "Calendrical masters now have the full moon travel the Yellow Path—then it meets the dark void.",
    "Modern calendars place full moon on the ecliptic—meeting the dark void."
  ],
  "s0410": [
    "Meeting the dark void has inner and outer depth—therefore eclipses differ north-south and in amount.",
    "Dark void depth varies—so eclipses differ in depth and direction."
  ],
  "s0411": [
    "The moon is the essence of Great Yin, paired with the sun—the image of the queen consort.",
    "The moon is Great Yin's essence, paired with the sun—the queen's image."
  ],
  "s0412": [
    "Compared to virtue, it is the meaning of punishment.",
    "In virtue it represents punishment."
  ],
  "s0413": [
    "Arrayed at court, it is the class of feudal lords and great ministers.",
    "At court it images feudal lords and great ministers."
  ],
  "s0414": [
    "Therefore if the lord is enlightened the moon travels by measure; if ministers hold power the moon loses its path.",
    "An enlightened lord keeps the moon on course; powerful ministers make it stray."
  ],
  "s0415": [
    "If great ministers hold affairs and military punishment is unjust, the moon suddenly goes south then north.",
    "Ministerial power and unjust punishment make the moon shift south and north."
  ],
  "s0416": [
    "If the queen consort and maternal kin usurp power, it advances or retreats.",
    "Queen consort and kin usurping power make it advance or retreat."
  ],
  "s0417": [
    "If the moon changes color, calamity will come.",
    "Moon color change foretells calamity."
  ],
  "s0418": [
    "If the moon is bright by day, wickedness rises together, lord and ministers contend for light, the queen consort misbehaves, yin states grow strong in arms, the central realm hungers, the realm plots usurpation.",
    "Day-bright moon brings wickedness, ministerial rivalry, queen's misconduct, border strength, central famine, and usurpation."
  ],
  "s0419": [
    "If seen repeatedly for months, the state falls to chaos and perishes.",
    "Repeated monthly appearances mean chaos and ruin."
  ],
  "s0420": [
    "The Year Star is Eastern spring wood.",
    "The Year Star is eastern spring wood."
  ],
  "s0421": [
    "Among the five constants of humanity, benevolence;",
    "Among humanity's five constants: benevolence;"
  ],
  "s0422": [
    "among the five affairs, appearance.",
    "among the five affairs: appearance."
  ],
  "s0423": [
    "If benevolence fails and appearance is lost, violating spring command and injuring wood qi—the punishment appears in the Year Star.",
    "Failed benevolence and appearance, violating spring and injuring wood qi—punishment shows in the Year Star."
  ],
  "s0424": [
    "The Year Star's expansion and contraction—take omens from the state where it lodges.",
    "Read omens from the state the Year Star lodges in."
  ],
  "s0425": [
    "Where it dwells long, that state has thick virtue, abundant grain, and cannot be attacked.",
    "Long dwelling means thick virtue, abundant grain, and invulnerability."
  ],
  "s0426": [
    "Its opposite is opposition—the Year Star then brings calamity.",
    "Opposition brings Year Star calamity."
  ],
  "s0427": [
    "If the Year Star is quiet at mid-degree, auspicious.",
    "A quiet Year Star at mid-degree is auspicious."
  ],
  "s0428": [
    "Expansion, contraction, or losing position—that state changes; do not raise armies or undertake affairs.",
    "Expansion, contraction, or lost position means change—do not make war."
  ],
  "s0429": [
    "It is also said: the image of the human lord.",
    "Also: the image of the human lord."
  ],
  "s0430": [
    "Its color should be bright, lustrous, and moist—virtue and harmony agree.",
    "Color should be bright, lustrous, moist—virtue in harmony."
  ],
  "s0431": [
    "Also: advancing and retreating by measure, wickedness ceases;",
    "Also: motion by measure ends wickedness;"
  ],
  "s0432": [
    "changing color and disorderly travel—the lord has no fortune.",
    "color change and disorderly motion—the lord lacks fortune."
  ],
  "s0433": [
    "Also governing fortune, the Grand Minister of Agriculture, Qi and Wu, all feudal lords' and lords' faults under Heaven, and the year's five grains.",
    "Also fortune, Grand Minister of Agriculture, Qi and Wu, lords' faults, and yearly grain."
  ],
  "s0434": [
    "Red with horns—that state flourishes;",
    "Red with horns: that state flourishes;"
  ],
  "s0435": [
    "red-yellow and sunken—the fields greatly abundant.",
    "red-yellow and sunken: great harvest."
  ],
  "s0436": [
    "Sparkling Fire is southern summer fire.",
    "Sparkling Fire is southern summer fire."
  ],
  "s0437": [
    "Ritual and vision.",
    "Ritual and vision."
  ],
  "s0438": [
    "Failed ritual and vision, violating summer command and injuring fire qi—the punishment appears in Sparkling Fire.",
    "Failed ritual and vision, violating summer—punishment in Sparkling Fire."
  ],
  "s0439": [
    "Sparkling Fire's law makes travel without constancy; when it emerges there is war, when it enters armies scatter.",
    "Sparkling Fire travels without constancy—emergence brings war, entry scatters armies."
  ],
  "s0440": [
    "Take omens from the lodging state—chaos, banditry, disease, mourning, famine, war; the state where it lodges suffers calamity.",
    "Lodging brings chaos, banditry, disease, mourning, famine, war."
  ],
  "s0441": [
    "Circling, hooking, horned rays trembling and changing color, now forward now back, now left now right—the calamity grows worse.",
    "Circling, hooks, trembling horns, shifting color and direction—calamity worsens."
  ],
  "s0442": [
    "To its south, husbands mourn; to its north, women mourn.",
    "South: husbands mourn; north: women mourn."
  ],
  "s0443": [
    "Circling, stopping, and resting then become death and mourning; bandits ravage the wilds and land is lost.",
    "Circling and stopping become death; bandits ravage and land is lost."
  ],
  "s0444": [
    "If it loses its path and is fast, armies gather below; following it, battle is victorious.",
    "Fast and off-path, armies gather below; following it wins battle."
  ],
  "s0445": [
    "Also: Sparkling Fire governs the Grand Herald, death and mourning, Minister of Works, also Marshal, Chu-Wu-Yue south, all ministers' faults, arrogance, chaos, and wicked omens, and the year's success and failure.",
    "Also: Herald, mourning, Works, Marshal, south, ministers' faults, and yearly fortune."
  ],
  "s0446": [
    "Also: if Sparkling Fire does not move, no battle—but a general is executed.",
    "Also: unmoving Sparkling Fire means no battle but a executed general."
  ],
  "s0447": [
    "Emerging red and angry, retrograde forming hooks—battle is inauspicious, armies besieged.",
    "Red angry emergence with retrograde hooks—inauspicious battle and siege."
  ],
  "s0448": [
    "Hooks with horned rays like blades—the lord must not leave the palace; ambush below.",
    "Hooked horned rays like blades—the lord stays in palace; ambush below."
  ],
  "s0449": [
    "Large horns—people rage; gentlemen restless, petty men unrestrained; if no rebellious ministers, great mourning; officials deceive clerks, clerks deceive the king.",
    "Large horns: popular rage, restless gentlemen, unrestrained petty men, rebellion or great mourning, official deceit."
  ],
  "s0450": [
    "Also external means war, internal means governing—this is the Son of Heaven's principle.",
    "External: war; internal: governance—the Son of Heaven's principle."
  ],
  "s0451": [
    "Therefore even with a bright Son of Heaven, one must observe where Sparkling Fire lodges.",
    "Even a bright Son of Heaven must watch Sparkling Fire's place."
  ],
  "s0452": [
    "If it enters and guards Supreme Subtlety, Chariot Pivot, Encampment, Chamber, or Heart—the lord's mandate is hated.",
    "Entering Supreme Subtlety, Chariot Pivot, Encampment, Chamber, or Heart—the mandate is hated."
  ],
  "s0453": [
    "Fill Star is central late-summer earth.",
    "Fill Star is central late-summer earth."
  ],
  "s0454": [
    "Faith and the thinking heart.",
    "Faith and the thinking heart."
  ],
  "s0455": [
    "Benevolence, righteousness, ritual, wisdom—with faith as master; appearance, speech, vision, hearing—with the heart as government—therefore when all four stars fail, Fill moves for them.",
    "When benevolence, ritual, wisdom fail, Fill Star moves."
  ],
  "s0456": [
    "Moving and expanding—marquises and kings are unsettled.",
    "Moving and expanding unsettles marquises and kings."
  ],
  "s0457": [
    "Contracting—armies do not return.",
    "Contracting: armies do not return."
  ],
  "s0458": [
    "The lodge where it dwells—the state is auspicious, gains land and women, has fortune, cannot be attacked.",
    "Its lodge: auspicious state, land and women, fortune, invulnerable."
  ],
  "s0459": [
    "Departing—land is lost; if women grieve.",
    "Departing: lost land and grieving women."
  ],
  "s0460": [
    "Dwelling long—the state's fortune is thick; changing, thin.",
    "Long dwelling: thick fortune; changing: thin."
  ],
  "s0461": [
    "Losing position upward two or three lodges is called expanding—the lord's mandate unfulfilled, or great flood.",
    "Expanding upward two-three lodges: unfulfilled mandate or great flood."
  ],
  "s0462": [
    "Losing position downward is called contracting—rear kin, the year does not recover, or Heaven splits, or earth quakes.",
    "Contracting downward: rear kin, failed harvest, Heaven splits, or earthquake."
  ],
  "s0463": [
    "One says: Fill is Yellow Emperor's virtue, the queen consort's image, governing thick virtue, the pivot of safety and peril, overseeing all queen consorts' faults under Heaven.",
    "Fill is Yellow Emperor's virtue and the queen's image, governing safety and queens' faults."
  ],
  "s0464": [
    "Also: the Son of Heaven's star.",
    "Also: the Son of Heaven's star."
  ],
  "s0465": [
    "If the Son of Heaven loses faith, Fill Star moves greatly.",
    "Lost faith makes Fill Star move greatly."
  ],
  "s0466": [
    "Great White is western autumn metal.",
    "Great White is western autumn metal."
  ],
  "s0467": [
    "Righteousness and speech.",
    "Righteousness and speech."
  ],
  "s0468": [
    "Failed righteousness and speech, violating autumn and injuring metal qi—punishment appears in Great White.",
    "Failed righteousness and speech, violating autumn—punishment in Great White."
  ],
  "s0469": [
    "Great White's advance and retreat watch for armies; high and low, slow and fast, quiet and restless, visibility and hiding—all image military use; auspicious.",
    "Great White's motion images armies—auspicious when orderly."
  ],
  "s0470": [
    "Emerging west and losing path—barbarians are defeated;",
    "West emergence off-path: barbarians defeated;"
  ],
  "s0471": [
    "emerging east and losing path—the central realm is defeated.",
    "east emergence off-path: central realm defeated."
  ],
  "s0472": [
    "Before the term ends, passing mid-heaven—illness to the opposite state.",
    "Before term ends, passing mid-heaven: illness to opposite state."
  ],
  "s0473": [
    "If it crosses heaven, the realm is transformed, people change kings—this is called disordering the order; people wander in exile.",
    "Crossing heaven transforms the realm, changes kings, exiles people."
  ],
  "s0474": [
    "Contending brightness with the sun by day—strong states weaken, small states strengthen, the queen consort flourishes.",
    "Daytime brightness rivalry: strong weaken, small strengthen, queen flourishes."
  ],
  "s0475": [
    "Also: Great White is a great minister, titled Supreme Duke; the Grand Marshal's seat carefully watches this.",
    "Great White is Supreme Duke; the Grand Marshal watches it."
  ],
  "s0476": [
    "Chronogram Star is northern winter water.",
    "Chronogram Star is northern winter water."
  ],
  "s0477": [
    "Wisdom and hearing.",
    "Wisdom and hearing."
  ],
  "s0478": [
    "Failed wisdom and hearing, violating winter and injuring water qi—punishment appears in Chronogram Star.",
    "Failed wisdom and hearing, violating winter—punishment in Chronogram Star."
  ],
  "s0479": [
    "When Chronogram Star appears, it governs punishment, the Minister of Justice, Yan and Zhao, also Yan-Zhao-Dai north, the chancellor's image, also killing qi and the image of battle.",
    "Chronogram Star governs punishment, justice, Yan-Zhao, and battle."
  ],
  "s0480": [
    "Also: armies in the field—Chronogram Star is the flank general's image; without armies, criminal affairs.",
    "In field: flank general; without armies: criminal affairs."
  ],
  "s0481": [
    "Harmonizing yin and yang, responding to the season.",
    "Harmonizing yin-yang, responding to season."
  ],
  "s0482": [
    "Not harmonizing, emerging at wrong season—cold and heat lose their nodes; the state faces great famine.",
    "Disharmony and wrong-season emergence bring great famine."
  ],
  "s0483": [
    "Should emerge but does not—this is called striking soldiers; armies rise greatly.",
    "Failure to emerge means striking soldiers and great armies."
  ],
  "s0484": [
    "Between Chamber and Heart—earthquake.",
    "Between Chamber and Heart: earthquake."
  ],
  "s0485": [
    "Also: Chronogram Star's emergence is restless and fast, regularly governing barbarians.",
    "Also: fast restless emergence governs barbarians."
  ],
  "s0486": [
    "Also: barbarian stars emerging also govern gain and loss in criminal law.",
    "Also: barbarian stars govern criminal law."
  ],
  "s0487": [
    "Yellow and small color—great earthquake.",
    "Yellow small color: great earthquake."
  ],
  "s0488": [
    "Generally the five planets have color; large and small differ, each following its nature and responding to season and node.",
    "Five planets differ in color and size, each following its nature and season."
  ],
  "s0489": [
    "Color change has categories.",
    "Color change has categories."
  ],
  "s0490": [
    "All green compares to Three Stars' left shoulder; red to Heart's great star; yellow to Three Stars' right shoulder; white to Wolf Star; black to Strider's great star.",
    "Green like left shoulder; red like Heart; yellow like right shoulder; white like Wolf; black like Strider."
  ],
  "s0491": [
    "Not losing native color and responding to the four seasons—auspicious;",
    "Keeping native color through four seasons is auspicious;"
  ],
  "s0492": [
    "color harming its nature—in auspicious.",
    "color harming its nature is inauspicious."
  ],
  "s0493": [
    "Generally at the chronogram where the five planets emerge, travel, and stand upright, the state gains position: Year Star by virtue, Sparkling Fire by ritual, Fill Star by fortune, Great White by strong armies, Chronogram Star by yin-yang harmony.",
    "Lodging states gain: Year by virtue, Fire by ritual, Fill by fortune, White by armies, Chronogram by harmony."
  ],
  "s0494": [
    "At the chronogram of emergence, travel, and upright stance—following its color with horns means victory; color harmed means defeat.",
    "Color with horns at lodging wins; harmed color loses."
  ],
  "s0495": [
    "Dwelling in fullness—has virtue.",
    "Dwelling in fullness: virtue."
  ],
  "s0496": [
    "Dwelling in emptiness—no virtue.",
    "Dwelling in emptiness: no virtue."
  ],
  "s0497": [
    "Color conquers position, motion conquers color, motion attaining all conquers completely.",
    "Color beats position, motion beats color, full conquest wins all."
  ],
  "s0498": [
    "Encampment is the Pure Temple—Year Star's temple.",
    "Encampment is Pure Temple—Year Star's temple."
  ],
  "s0499": [
    "Heart is the Bright Hall—Sparkling Fire's temple.",
    "Heart is Bright Hall—Sparkling Fire's temple."
  ],
  "s0500": [
    "Southern Dipper is the Literary Grand Chamber—Fill Star's temple.",
    "Southern Dipper is Literary Grand Chamber—Fill Star's temple."
  ]
};
const p = process.argv[2];
if (!p) process.exit(1);
const d = JSON.parse(fs.readFileSync(p,'utf8'));
let c=0;
for (const s of d.sentences) { if (T[s.id]) { s.literal=T[s.id][0]; s.idiomatic=T[s.id][1]; c++; } }
fs.writeFileSync(p, JSON.stringify(d,null,2)+'\n');
console.log('Patch count: '+c);
if (c!==Object.keys(T).length) process.exitCode=1;
