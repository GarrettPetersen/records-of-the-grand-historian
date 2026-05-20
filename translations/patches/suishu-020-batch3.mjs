#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s0201": [
    "It also governs wind and governs death and mourning.",
    "It also governs wind, death, and mourning."
  ],
  "s0202": [
    "If Chariot stars are bright, the royal carriage is equipped.",
    "Bright Chariot stars mean the royal carriage stands ready."
  ],
  "s0203": [
    "If they move, chariots and cavalry are deployed.",
    "Movement deploys chariots and cavalry."
  ],
  "s0204": [
    "If they scatter, the Son of Heaven grieves.",
    "Scattering brings the Son of Heaven grief."
  ],
  "s0205": [
    "If they gather, armies rise greatly.",
    "Gathering brings great armies."
  ],
  "s0206": [
    "Axle-pin stars flank Chariot on both sides, governing kings and marquises.",
    "Axle-pin stars flank Chariot, governing kings and marquises."
  ],
  "s0207": [
    "The left axle-pin is the king's same surname; the right, different surname.",
    "The left axle-pin marks the royal clan; the right, other surnames."
  ],
  "s0208": [
    "If the stars are bright, armies rise greatly.",
    "Bright stars mean great armies."
  ],
  "s0209": [
    "If far from Chariot, ill omen.",
    "Distance from Chariot is ominous."
  ],
  "s0210": [
    "If Chariot's axle-pins rise, southern tribes invade.",
    "Rising axle-pins mean southern tribes invade."
  ],
  "s0211": [
    "A chariot without axle-pins—the state lord grieves.",
    "A chariot without axle-pins brings the ruler grief."
  ],
  "s0212": [
    "Changsha is one star within Chariot, governing lifespan.",
    "Changsha, one star in Chariot, governs lifespan."
  ],
  "s0213": [
    "If bright, the lord lives long and descendants flourish.",
    "Brightness means long life and flourishing heirs."
  ],
  "s0214": [
    "To the right: the four quarters' twenty-eight lodges together with assisting officials—one hundred eighty-two stars.",
    "Beyond this: the twenty-eight lodges of the four quarters with their assisting stars—one hundred eighty-two in all."
  ],
  "s0215": [
    "Star officials outside the twenty-eight lodges:",
    "Star officials beyond the twenty-eight lodges:"
  ],
  "s0216": [
    "Storehouse Tower has ten stars—six great stars are the storehouse, four southern stars the tower—south of Horn.",
    "Storehouse Tower's ten stars lie south of Horn: six form the storehouse, four the tower."
  ],
  "s0217": [
    "One is called the Celestial Storehouse—the arsenal of chariots and armies.",
    "Also the Celestial Storehouse—the chariot and army arsenal."
  ],
  "s0218": [
    "Fifteen stars beside, gathering three by three, are the Pillars.",
    "Fifteen nearby stars in threes are the Pillars."
  ],
  "s0219": [
    "Four small stars in the center are the Crossbeam.",
    "Four central small stars are the Crossbeam."
  ],
  "s0220": [
    "They govern arraying troops.",
    "They govern troop formations."
  ],
  "s0221": [
    "It is also said: if the Celestial Storehouse is empty, armies converge from four sides.",
    "Also: an empty Celestial Storehouse means armies from all four sides."
  ],
  "s0222": [
    "Two stars in the northeast are called the Solar Gate, governing guarding passes and barriers.",
    "Two northeastern stars are the Solar Gate, guarding passes and barriers."
  ],
  "s0223": [
    "Southern Gate has two stars south of Storehouse Tower—Heaven's outer gate.",
    "Southern Gate's two stars lie south of Storehouse Tower—Heaven's outer gate."
  ],
  "s0224": [
    "It governs guarding armies.",
    "It governs army defense."
  ],
  "s0225": [
    "Level Stars are two stars north of Storehouse Tower—settling legal cases and prisons under Heaven, the image of the Minister of Justice.",
    "Level Stars, north of Storehouse Tower, settle law and prisons—the Minister of Justice's image."
  ],
  "s0226": [
    "Heavenly Gate has two stars north of Level Stars.",
    "Heavenly Gate's two stars lie north of Level Stars."
  ],
  "s0227": [
    "Seven stars south of Neck are called Broken Power, governing execution.",
    "Seven stars south of Neck are Broken Power, governing execution."
  ],
  "s0228": [
    "Slow Stubborn has two stars southeast of Broken Power, governing examination of prisoners' circumstances and detecting fraud.",
    "Slow Stubborn, southeast of Broken Power, examines prisoners and detects fraud."
  ],
  "s0229": [
    "Cavalry Officer has twenty-seven stars south of Root—like the Son of Heaven's martial guard, governing night watch.",
    "Cavalry Officer's twenty-seven stars south of Root are the Son of Heaven's guard, governing night watch."
  ],
  "s0230": [
    "One star at the eastern end is the Cavalry Array General—the cavalry commander.",
    "The eastern star is the Cavalry Array General—the cavalry commander."
  ],
  "s0231": [
    "Three southern stars are Chariot and Cavalry—the chariot and cavalry generals.",
    "Three southern stars are the chariot and cavalry generals."
  ],
  "s0232": [
    "Array Chariot has three stars northeast of Cavalry Officer—leather chariots.",
    "Array Chariot's three stars northeast of Cavalry Officer are leather chariots."
  ],
  "s0233": [
    "Accumulated Soldiers has twelve stars south of Chamber and Heart, governing defense.",
    "Accumulated Soldiers' twelve stars south of Chamber and Heart govern defense."
  ],
  "s0234": [
    "If other stars guard them, close ministers are executed.",
    "If other stars guard them, close ministers die."
  ],
  "s0235": [
    "Attendant Officials has two stars northwest of Accumulated Soldiers.",
    "Attendant Officials' two stars lie northwest of Accumulated Soldiers."
  ],
  "s0236": [
    "Tortoise has five stars south of Tail, governing divination to read fortune and misfortune.",
    "Tortoise's five stars south of Tail govern divination for good and ill."
  ],
  "s0237": [
    "Fu Yue is one star behind Tail.",
    "Fu Yue is one star behind Tail."
  ],
  "s0238": [
    "Fu Yue governs the Zhang prayer-official and shaman officers.",
    "Fu Yue governs the Zhang prayer-officials and shamans."
  ],
  "s0239": [
    "Zhang is the sound of petitioning and calling.",
    "Zhang is the sound of petition and invocation."
  ],
  "s0240": [
    "It governs the queen's inner sacrifices, praying for descendants and broadly seeking heirs.",
    "It governs the queen's inner sacrifices, praying for heirs."
  ],
  "s0241": [
    "The Odes says: \"Perform the fragrant rites, perform the sacrifices, lest there be no sons.\"",
    "The Odes says: \"Perform the fragrant rites and sacrifices, lest there be no sons.\""
  ],
  "s0242": [
    "This is its image.",
    "This is its image."
  ],
  "s0243": [
    "If the star is bright and large, kings have many descendants.",
    "Bright, large stars mean many royal heirs."
  ],
  "s0244": [
    "Fish is one star in the river behind Tail, governing yin affairs and knowing the season of clouds and rain.",
    "Fish, one star in the river behind Tail, governs yin affairs and foretells rain."
  ],
  "s0245": [
    "If the star is not bright, many fish perish—or few fish.",
    "Dim stars mean fish die—or fish are scarce."
  ],
  "s0246": [
    "If it trembles, great flood bursts forth.",
    "Trembling brings sudden great flood."
  ],
  "s0247": [
    "If it leaves the Milky Way, many great fish die.",
    "Leaving the Milky Way kills many great fish."
  ],
  "s0248": [
    "Pestle has three stars south of Winnowing Basket—the pestle supplying the kitchen for pounding.",
    "Pestle's three stars south of Winnowing Basket supply the kitchen mill."
  ],
  "s0249": [
    "If a guest star enters Pestle and Mortar, the realm faces urgency.",
    "A guest star in Pestle and Mortar means national crisis."
  ],
  "s0250": [
    "Chaff is one star before Winnowing Basket's tongue, northwest of Pestle.",
    "Chaff lies before Winnowing Basket's tongue, northwest of Pestle."
  ],
  "s0251": [
    "Turtle has fourteen stars south of Southern Dipper.",
    "Turtle's fourteen stars lie south of Southern Dipper."
  ],
  "s0252": [
    "The turtle is a water creature, belonging to Great Yin.",
    "The turtle is a water creature of Great Yin."
  ],
  "s0253": [
    "If stars guard it, there is a white-clad assembly and water edicts.",
    "Stars guarding it bring white-clad assembly and water edicts."
  ],
  "s0254": [
    "Old Farmer is one star southwest of Southern Dipper—the old farmer governing crops.",
    "Old Farmer, southwest of Southern Dipper, governs crops."
  ],
  "s0255": [
    "Dog has two stars before the Southern Dipper head, governing barking and guarding.",
    "Dog's two stars before the Dipper head govern barking and watch."
  ],
  "s0256": [
    "Celestial Field has nine stars south of Ox.",
    "Celestial Field's nine stars lie south of Ox."
  ],
  "s0257": [
    "Net Weir has nine stars east of Ox-Driver—blocking horses, to dam and store floodwater and irrigate ditches and channels.",
    "Net Weir's nine stars east of Ox-Driver block horses, dam floodwater, and irrigate channels."
  ],
  "s0258": [
    "Nine Pitfalls has nine stars south of Ox-Driver.",
    "Nine Pitfalls' nine stars lie south of Ox-Driver."
  ],
  "s0259": [
    "Pitfall means ditches and channels—guiding spring sources, draining overflow, opening irrigation.",
    "Pitfalls are ditches—guiding springs, draining overflow, opening irrigation."
  ],
  "s0260": [
    "Ten stars between Nine Pitfalls are called the Celestial Pool—also Three Pools, also Celestial Sea, governing irrigation.",
    "Ten stars between Nine Pitfalls are the Celestial Pool—also Three Pools or Celestial Sea—governing irrigation."
  ],
  "s0261": [
    "Stars east of Nine Pitfalls in row: north one is Qi; north of Qi two is Zhao; north of Zhao one is Zheng; north of Zheng one is Yue; east of Yue two is Zhou; east of Zhou north-south two is Qin; south of Qin two is Dai; west of Dai one is Jin; north of Jin one is Han; north of Han one is Wei; west of Wei one is Chu; south of Chu one is Yan.",
    "East of Nine Pitfalls: Qi, Zhao, Zheng, Yue, Zhou, Qin, Dai, Jin, Han, Wei, Chu, Yan—each star marking its state."
  ],
  "s0262": [
    "If their stars change, each according to its state.",
    "Star changes affect each state accordingly."
  ],
  "s0263": [
    "East of Qin and Dai, three stars north-south in row, are called Li and Yu.",
    "Three stars east of Qin and Dai are Li and Yu."
  ],
  "s0264": [
    "Li is jade scepter and garment; Yu is jade ornament—both are stars of women's dress.",
    "Li is jade scepter and robe; Yu is jade ornament—women's dress stars."
  ],
  "s0265": [
    "Two stars south of Emptiness are called Weeping; two stars east of Weeping are called Crying—Weeping and Crying both lie near tombs.",
    "South of Emptiness: Weeping; east of Weeping: Crying—both near graves."
  ],
  "s0266": [
    "Thirteen stars south of Crying are called the Celestial Rampart City, shaped like a rope noose, governing the northern tribes Dingling and Xiongnu.",
    "Thirteen stars south of Crying are the Celestial Rampart, noose-shaped, governing Dingling and Xiongnu."
  ],
  "s0267": [
    "Broken Mortar has four stars south of Emptiness and Rooftop, knowing calamity and disaster.",
    "Broken Mortar's four stars south of Emptiness and Rooftop foretell disaster."
  ],
  "s0268": [
    "If other stars guard them, famine and armies rise.",
    "Other stars guarding them bring famine and war."
  ],
  "s0269": [
    "Two stars south of Rooftop are called Canopy House, governing the office of palace construction.",
    "Two stars south of Rooftop are Canopy House, governing palace construction."
  ],
  "s0270": [
    "Empty Beam has four stars south of Canopy House, governing gardens, tombs, and ancestral temples.",
    "Empty Beam's four stars south of Canopy House govern gardens, tombs, and temples."
  ],
  "s0271": [
    "Not where humans dwell—hence called Empty Beam.",
    "Not a human dwelling—hence Empty Beam."
  ],
  "s0272": [
    "Six stars south of Encampment are called Thunder and Lightning.",
    "Six stars south of Encampment are Thunder and Lightning."
  ],
  "s0273": [
    "Two stars southwest of Encampment are called the Earthwork Clerk, governing excess in construction.",
    "Two stars southwest of Encampment are the Earthwork Clerk, governing construction excess."
  ],
  "s0274": [
    "Two stars south of Wall are called Earth Lord; five stars southwest of Earth Lord are called Thunder Stone; four stars south of Thunder Stone are called Cloud and Rain—all north of Rampart Wall.",
    "South of Wall: Earth Lord; southwest, Thunder Stone; south, Cloud and Rain—all north of Rampart Wall."
  ],
  "s0275": [
    "Forest of Feathers has forty-five stars south of Encampment.",
    "Forest of Feathers' forty-five stars lie south of Encampment."
  ],
  "s0276": [
    "One is called the Celestial Army, governing cavalry armies, and also governing supporting kings.",
    "Also the Celestial Army, governing cavalry and supporting kings."
  ],
  "s0277": [
    "Rampart Wall Array has twelve stars north of Forest of Feathers—the rampart wall of the Forest of Feathers, governing military positions and camp barriers.",
    "Rampart Wall Array's twelve stars north of Forest of Feathers form the camp rampart, governing military positions."
  ],
  "s0278": [
    "If any of the five planets is within the Celestial Army, armies rise—Mars, Venus, and Mercury especially.",
    "Any five planets in the Celestial Army mean war—especially Mars, Venus, and Mercury."
  ],
  "s0279": [
    "Northern Falling Master Gate is one star south of Forest of Feathers.",
    "Northern Falling Master Gate is one star south of Forest of Feathers."
  ],
  "s0280": [
    "North means the lodge lies in the north.",
    "North means the lodge stands in the north."
  ],
  "s0281": [
    "Falling means Heaven's outer barrier.",
    "Falling is Heaven's outer barrier."
  ],
  "s0282": [
    "Master means multitudes.",
    "Master means multitudes."
  ],
  "s0283": [
    "Master Gate is like the army gate.",
    "Master Gate is the army gate."
  ],
  "s0284": [
    "Chang'an city's north gate is called Northern Falling Gate, imaging the north.",
    "Chang'an's north gate is Northern Falling Gate, imaging the north."
  ],
  "s0285": [
    "It governs the extraordinary and watches for armies.",
    "It governs the extraordinary and watches for war."
  ],
  "s0286": [
    "If stars guard it, barbarians enter the passes and armies rise.",
    "Stars guarding it mean barbarians enter the passes and war rises."
  ],
  "s0287": [
    "Northwest of Northern Falling are ten stars called Celestial Coins.",
    "Ten stars northwest of Northern Falling are Celestial Coins."
  ],
  "s0288": [
    "One star southwest of Northern Falling is called the Celestial Net, governing the military tent.",
    "One star southwest of Northern Falling is the Celestial Net, governing the military tent."
  ],
  "s0289": [
    "Nine stars southeast of Northern Falling are called the Eight Chiefs, governing netting birds and beasts.",
    "Nine stars southeast of Northern Falling are the Eight Chiefs, netting birds and beasts."
  ],
  "s0290": [
    "If a guest star enters them, many bandits.",
    "Guest stars entering mean many bandits."
  ],
  "s0291": [
    "Three stars northwest of Eight Chiefs are called Axe and Anvil—also Axe and Halberd.",
    "Three stars northwest of Eight Chiefs are Axe and Anvil—or Axe and Halberd."
  ],
  "s0292": [
    "If stars enter them, all mean great ministers executed.",
    "Stars entering mean ministers executed."
  ],
  "s0293": [
    "Seven stars south of Strider are called the Outer Screen.",
    "Seven stars south of Strider are the Outer Screen."
  ],
  "s0294": [
    "Seven stars south of Outer Screen are called the Celestial Privy—the latrine.",
    "Seven stars south of Outer Screen are the Celestial Privy—the latrine."
  ],
  "s0295": [
    "The screen is what blocks it.",
    "The screen blocks it."
  ],
  "s0296": [
    "One star south of the Celestial Privy is called Earth Minister, governing earth and water affairs and also knowing calamity and disaster.",
    "One star south of the Privy is Earth Minister, governing earth and water and foretelling disaster."
  ],
  "s0297": [
    "If a guest star enters, much earthwork and great pestilence under Heaven.",
    "Guest stars entering mean much earthwork and great plague."
  ],
  "s0298": [
    "Five stars east of Bond are called Left Watch—Mountain Warden, governing marshes, thickets, bamboo and trees, and also benevolence and wisdom.",
    "Five stars east of Bond are Left Watch—the Mountain Warden, governing marshes, woods, and wisdom."
  ],
  "s0299": [
    "Five stars west of Bond are called Right Watch—the Herdsman, governing raising cattle and horses, and also rites and righteousness.",
    "Five stars west of Bond are Right Watch—the Herdsman, governing livestock and rites."
  ],
  "s0300": [
    "The two Watches are Qin rank names.",
    "The two Watches are Qin noble titles."
  ]
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-020-batch3.mjs <translation.json>');
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
