#!/usr/bin/env node
import fs from 'node:fs';
const T={
  "s0801": [
    "Also: Frayed Flow governs self-judgment, nowhere to flee.",
    "Frayed Flow: self-judgment, no escape."
  ],
  "s0802": [
    "Seven is Fu Star, southeast—originally has star, finally like fu grass; state struck truly suffers calamity.",
    "Seven: Fu Star southeast—state struck suffers."
  ],
  "s0803": [
    "Eight is Ten Start.",
    "Eight: Ten Start."
  ],
  "s0804": [
    "Or: Pivot Star scatters into Ten Start.",
    "Pivot scatters into Ten Start."
  ],
  "s0805": [
    "Or: born of five stars' expansion and contraction.",
    "Born of five stars' expansion and contraction."
  ],
  "s0806": [
    "Also: Ten Start baleful qi.",
    "Ten Start baleful qi."
  ],
  "s0807": [
    "Also: Ten Start is Chiyou.",
    "Ten Start is Chiyou."
  ],
  "s0808": [
    "Also: Ten Start emerges beside Northern Dipper, shaped like rooster.",
    "Emerges beside Dipper like rooster."
  ],
  "s0809": [
    "Its anger green-black, image crouching turtle.",
    "Anger green-black like crouching turtle."
  ],
  "s0810": [
    "Also: yellow comet divides into Ten Start.",
    "Yellow comet divides into Ten Start."
  ],
  "s0811": [
    "Ten Start means now rising.",
    "Ten Start: now rising."
  ],
  "s0812": [
    "Shaped like rooster, earth containing yang, white intersecting—essence like chicken—therefore taken as establishing lord theme.",
    "Rooster-shaped, earth-yang—establishing lord."
  ],
  "s0813": [
    "Term ten years—sage rises in succession.",
    "Ten years: sage succeeds."
  ],
  "s0814": [
    "Also: Ten Start governs contending armies, chaos, summoning violence.",
    "Ten Start: contending armies, chaos, violence."
  ],
  "s0815": [
    "Also: Ten Start shining—below certainly destroyed king.",
    "Ten Start shining: destroyed king below."
  ],
  "s0816": [
    "Five wickedness contend, exposed bones piled, children continue eating.",
    "Five wickedness, piled bones, children eating."
  ],
  "s0817": [
    "Seen—minister chaos, armies rise, lords are cruel.",
    "Seen: minister chaos, cruel lords."
  ],
  "s0818": [
    "Also: regularly on wuxu day observe Five Chariots and Celestial Army Storehouse for strangeness—called Ten Start.",
    "On wuxu day observe Five Chariots for Ten Start."
  ],
  "s0819": [
    "Shaped like bird with beak—seer means armies rise greatly, attacking the head means broken death.",
    "Bird-beak shape: armies; striking head: death."
  ],
  "s0820": [
    "Also: emerging seen at Northern Dipper—sage receives mandate, Son of Heaven long-lived, king has fortune.",
    "At Dipper: sage mandate, long life, fortune."
  ],
  "s0821": [
    "Nine is Strike Blame, emerging—subordinates master.",
    "Nine: Strike Blame—subordinates master."
  ],
  "s0822": [
    "One says: ministers restrain lord, lord great armies.",
    "Ministers restrain lord, great armies."
  ],
  "s0823": [
    "Also: earth essence, Dipper seven lodges' domain, lengthening four quarters, Minister of Works position—rebellion and cruelty as above.",
    "Earth essence, Dipper domain—rebellion as above."
  ],
  "s0824": [
    "Great White's essence scatters into Celestial Pestle, Celestial Shaft, Hidden Spirit, Great Defeat, Si Jian, Celestial Dog, Celestial Ruin, Sudden Rise.",
    "Great White essence: Pestle, Shaft, Hidden Spirit, Great Defeat, Si Jian, Dog, Ruin, Sudden Rise."
  ],
  "s0825": [
    "One is Celestial Pestle, governing ram.",
    "One: Celestial Pestle—ram."
  ],
  "s0826": [
    "Two is Celestial Shaft, governing strike calamity.",
    "Two: Celestial Shaft—strike calamity."
  ],
  "s0827": [
    "Three is Hidden Spirit, governing receiving slander.",
    "Three: Hidden Spirit—slander."
  ],
  "s0828": [
    "Hidden Spirit emerging—realm chaos and repeated people.",
    "Hidden Spirit: chaos and repeated people."
  ],
  "s0829": [
    "Four is Great Defeat, governing battle rush.",
    "Four: Great Defeat—battle rush."
  ],
  "s0830": [
    "Or: Great Defeat emerging—Strike Blame plots.",
    "Great Defeat: Strike Blame plots."
  ],
  "s0831": [
    "Five is Si Jian, governing appearing wickedness.",
    "Five: Si Jian—appearing wickedness."
  ],
  "s0832": [
    "Six is Celestial Dog.",
    "Six: Celestial Dog."
  ],
  "s0833": [
    "Also: five stars' qi combined transformation, emerging southwest, metal-fire qi combined—called Celestial Dog.",
    "Southwest metal-fire combined: Celestial Dog."
  ],
  "s0834": [
    "Or: Celestial Dog star has hair, short comet beside, below dog shape—governing conscripting armies, governing attacking bandits.",
    "Hair, short comet, dog shape—armies and bandits."
  ],
  "s0835": [
    "Also: Celestial Dog flow—five generals battle.",
    "Dog flow: five generals battle."
  ],
  "s0836": [
    "Also: northwest star three zhang, water-metal qi crossing—called Celestial Dog.",
    "Northwest three zhang, water-metal crossing: Dog."
  ],
  "s0837": [
    "Also: northwest three stars, large white—called Celestial Dog.",
    "Northwest three large white: Dog."
  ],
  "s0838": [
    "Seen—great armies rise, realm famine, people eat one another.",
    "Seen: armies, famine, cannibalism."
  ],
  "s0839": [
    "Also: where Celestial Dog descends—certainly great battle, broken armies, slain generals, corpses, blood—Celestial Dog eats.",
    "Where Dog descends: battle, corpses, blood—Dog eats."
  ],
  "s0840": [
    "All term one year, middle two years, far three years—each by descended state for fortune and misfortune.",
    "Term one to three years by descended state."
  ],
  "s0841": [
    "Later among shooting stars there is Celestial Dog—same name, slightly different omen form.",
    "Later shooting stars also have Dog—slightly different."
  ],
  "s0842": [
    "Seven is Celestial Ruin, governing greedy cruelty.",
    "Seven: Celestial Ruin—greedy cruelty."
  ],
  "s0843": [
    "Eight is Sudden Rise.",
    "Eight: Sudden Rise."
  ],
  "s0844": [
    "Sudden Rise seen—calamity without time, all changes have buds, ministers wield power.",
    "Sudden Rise: untimed calamity, ministers wield power."
  ],
  "s0845": [
    "Also: lesser yin essence, Grand Marshal class, white beast seven lodges—rebellion, cruelty, lost autumn government as above.",
    "Lesser yin, Marshal class—lost autumn as above."
  ],
  "s0846": [
    "Chronogram Star's essence scatters into Crooked Arrow, Broken Woman, Brush Pivot, Destroyed Treasure, Coiling Court, Alarm Reason, Great Exalted Sacrifice.",
    "Chronogram essence: Crooked Arrow, Broken Woman, Brush Pivot, Destroyed Treasure, Coiling Court, Alarm Reason, Great Exalted Sacrifice."
  ],
  "s0847": [
    "One is Crooked Arrow.",
    "One: Crooked Arrow."
  ],
  "s0848": [
    "Or: Fill Star's transformation becomes Crooked Arrow.",
    "Fill becomes Crooked Arrow."
  ],
  "s0849": [
    "Or: Pivot Star scatters into Crooked Arrow.",
    "Pivot scatters into Crooked Arrow."
  ],
  "s0850": [
    "Also: Crooked Arrow—born of five stars' expansion and contraction, image of bow and crossbow.",
    "Born of five stars, bow image."
  ],
  "s0851": [
    "Like large shooting star, dark green color, snake travel, seen as if with hair and eyes, several pi long, attached to heaven.",
    "Large dark green snake-like star with hair-eyes, several pi."
  ],
  "s0852": [
    "Governing rebellion budding, governing shooting the foolish.",
    "Rebellion budding, shooting the foolish."
  ],
  "s0853": [
    "Also: black comet divides into Crooked Arrow.",
    "Black comet divides into Crooked Arrow."
  ],
  "s0854": [
    "Crooked Arrow means shooting.",
    "Crooked Arrow means shooting."
  ],
  "s0855": [
    "Crooked Arrow seen—rebellion armies combine, shooting the executed, also using chaos to attack chaos.",
    "Crooked Arrow: rebellion armies, shooting execution."
  ],
  "s0856": [
    "Also: human lord violent and self-willed—Crooked Arrow moves.",
    "Violent lord: Crooked Arrow moves."
  ],
  "s0857": [
    "Also: Crooked Arrow like shooting star, seen with tail-eyes, one bolt-cloth long, bright attached to heaven.",
    "Like shooting star with tail-eyes, one bolt long."
  ],
  "s0858": [
    "Seen—great armies rise, great general emerges, bows and crossbows used, term three years.",
    "Seen: armies, general, bows, three years."
  ],
  "s0859": [
    "Crooked Arrow's touch—what under Heaven is attacked, image of shooting destruction.",
    "Crooked Arrow's touch: shooting destruction."
  ],
  "s0860": [
    "Two is Broken Woman.",
    "Two: Broken Woman."
  ],
  "s0861": [
    "Broken Woman if seen—lord and ministers all executed, lord-victory token.",
    "Broken Woman: all executed, lord-victory token."
  ],
  "s0862": [
    "Three is Brush Pivot.",
    "Three: Brush Pivot."
  ],
  "s0863": [
    "Brush Pivot moving chaos—alarm and disturbance without regulated time.",
    "Brush Pivot: chaos without time."
  ],
  "s0864": [
    "Also: Brush Pivot governs regulating time.",
    "Also: governs regulating time."
  ],
  "s0865": [
    "Four is Destroyed Treasure.",
    "Four: Destroyed Treasure."
  ],
  "s0866": [
    "Destroyed Treasure rising—mutual obtaining.",
    "Destroyed Treasure: mutual obtaining."
  ],
  "s0867": [
    "Also: Destroyed Treasure governs attacking.",
    "Also: governs attacking."
  ],
  "s0868": [
    "Five is Coiling Court.",
    "Five: Coiling Court."
  ],
  "s0869": [
    "Coiling Court governs chaotic breeding.",
    "Coiling Court: chaotic breeding."
  ],
  "s0870": [
    "Six is Alarm Reason.",
    "Six: Alarm Reason."
  ],
  "s0871": [
    "Alarm Reason governs mutual appointment.",
    "Alarm Reason: mutual appointment."
  ],
  "s0872": [
    "Seven is Great Exalted Sacrifice.",
    "Seven: Great Exalted Sacrifice."
  ],
  "s0873": [
    "Great Exalted Sacrifice governs summoning wickedness.",
    "Great Exalted Sacrifice: summoning wickedness."
  ],
  "s0874": [
    "Or: Great Exalted Sacrifice emerging—lord is secure.",
    "Or: emerging—lord secure."
  ],
  "s0875": [
    "Great Yin essence, dark warrior seven lodges—rebellion, cruelty, lost winter government as above.",
    "Great Yin, dark warrior domain—lost winter as above."
  ],
  "s0876": [
    "Also: five essences hidden deep—all by category of what they violate, travel losing timely direction, subordinates of corresponding class ride and harm— all signs of destruction.",
    "Five essences hidden deep—violation brings destruction."
  ],
  "s0877": [
    "Entering Son of Heaven's lodge—lord destroyed, five hundred feudal lords plot.",
    "Entering royal lodge: lord destroyed, lords plot."
  ],
  "s0878": [
    "Miscellaneous baleful one is Celestial Edge.",
    "Miscellaneous baleful one: Celestial Edge."
  ],
  "s0879": [
    "Celestial Edge—comet image of spear edge, governing unrestrained violence.",
    "Celestial Edge: spear-edge comet, unrestrained violence."
  ],
  "s0880": [
    "Realm unrestrained—Celestial Edge star appears.",
    "Unrestrained realm: Celestial Edge appears."
  ],
  "s0881": [
    "Two is Candle Star, like Great White, not moving when emerging, seen not long then extinguished.",
    "Two: Candle Star like Great White, brief appearance."
  ],
  "s0882": [
    "Or: above lord star three comets emerge upward.",
    "Or: three comets above lord star."
  ],
  "s0883": [
    "Candle Star's emerged town reverses.",
    "Candle Star's town reverses."
  ],
  "s0884": [
    "Also: where Candle Star illuminates—city chaos.",
    "Candle illumination: city chaos."
  ],
  "s0885": [
    "Also: Candle Star emerging—great bandit not accomplished.",
    "Candle emerging: great bandit fails."
  ],
  "s0886": [
    "Three is Peng Star, also called Wang Star—like night fire light, many then four-five, few then one-two.",
    "Three: Peng Star like night fire, one to five."
  ],
  "s0887": [
    "Also: Peng Star southwest, several zhang, left-right sharp, emerging and easily shifting.",
    "Southwest several zhang, sharp, easily shifting."
  ],
  "s0888": [
    "Also: star yellow-white, square not exceeding three chi—called Peng Star.",
    "Yellow-white under three chi: Peng Star."
  ],
  "s0889": [
    "Also: Peng Star like powder fluff—seen means Way masters emerge, plain-cloth scholars honored, realm peaceful, five grains succeed.",
    "Like powder fluff: Way masters, honored scholars, peace."
  ],
  "s0890": [
    "Also: Peng Star emerging at Northern Dipper—feudal lords seize land, lose land by territory, armies rise.",
    "At Dipper: lords seize land, armies."
  ],
  "s0891": [
    "Where star lodges—term within three years.",
    "Lodging: term within three years."
  ],
  "s0892": [
    "Also: Peng Star emerging in Supreme Subtlety—Son of Heaven establishes king.",
    "In Supreme Subtlety: Son of Heaven establishes king."
  ],
  "s0893": [
    "Four is Long Geng, shaped like one bolt cloth attached to heaven.",
    "Four: Long Geng like bolt cloth on heaven."
  ],
  "s0894": [
    "Seen—armies rise.",
    "Seen: armies."
  ],
  "s0895": [
    "Five is Four Fill, stars emerging four corners, six-plus zhang from earth.",
    "Five: Four Fill at four corners, six-plus zhang."
  ],
  "s0896": [
    "Or: Four Fill four zhang from earth.",
    "Or: four zhang from earth."
  ],
  "s0897": [
    "Or: Four Fill star large red, two zhang from earth, should emerge at midnight.",
    "Large red two zhang at midnight."
  ],
  "s0898": [
    "Four Fill seen—armies rise in tenth month.",
    "Four Fill: armies in tenth month."
  ],
  "s0899": [
    "Also: Four Fill seen at four corners—all armies rise below.",
    "At four corners: armies below."
  ],
  "s0900": [
    "Six is Earth Net Hidden Light.",
    "Six: Earth Net Hidden Light."
  ]
};
const p=process.argv[2];if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8'));let c=0;
for(const s of d.sentences){if(T[s.id]){s.literal=T[s.id][0];s.idiomatic=T[s.id][1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');console.log('Patch count: '+c);
if(c!==Object.keys(T).length)process.exitCode=1;
