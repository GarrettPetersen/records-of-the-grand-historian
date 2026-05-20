#!/usr/bin/env node
import fs from 'node:fs';
const T={
  "s0701": [
    "Four is Celestial Rush—shaped like a person, dark robes and red head, unmoving.",
    "Four: Celestial Rush—human-shaped, dark robes, red head, unmoving."
  ],
  "s0702": [
    "Governing destroying position.",
    "Destroying position."
  ],
  "s0703": [
    "Also: Rush Star emerging—ministers plot against lord, martial soldiers rise.",
    "Rush emerging: ministers plot, soldiers rise."
  ],
  "s0704": [
    "Also: Celestial Rush embraces the pole weeping before the Emperor—blood turbid mist descends, injustice under Heaven.",
    "Rush at pole weeping before Emperor: blood mist, universal injustice."
  ],
  "s0705": [
    "Five is State Sovereign.",
    "Five: State Sovereign."
  ],
  "s0706": [
    "Or: Pivot Star scatters into State Sovereign.",
    "Or: Pivot Star scatters into State Sovereign."
  ],
  "s0707": [
    "State Sovereign star, large and red, like South Pole Old Man Star.",
    "State Sovereign: large red, like South Pole Old Man."
  ],
  "s0708": [
    "Governing destroying wickedness, governing internal bandit calamity.",
    "Destroying wickedness, internal bandit calamity."
  ],
  "s0709": [
    "Seen—armies rise, realm urgent.",
    "Seen: armies, urgent realm."
  ],
  "s0710": [
    "Or: one or two zhang from earth, like torch fire.",
    "Or: one-two zhang from earth like torch."
  ],
  "s0711": [
    "Later among guest stars there is also State Sovereign—same name, different omen form.",
    "Later guest stars also have State Sovereign—same name, different omens."
  ],
  "s0712": [
    "Six is Reverse Ascent, governing barbarian division—all lesser yang essence, Minister of Public Works class, azure dragon seven lodges' domain.",
    "Six: Reverse Ascent, barbarian division—lesser yang, Public Works, azure dragon domain."
  ],
  "s0713": [
    "If plotting rebellion or wanton cruelty as harm, lord losing spring government—emergence time as term.",
    "Rebellion or cruelty, lost spring government—emergence sets term."
  ],
  "s0714": [
    "All govern the lord's campaigns.",
    "All govern royal campaigns."
  ],
  "s0715": [
    "Sparkling Fire's essence flows into Split Dawn, Chiyou Banner, Zhaoming, Siwei, Celestial Coiling.",
    "Sparkling Fire's essence: Split Dawn, Chiyou Banner, Zhaoming, Siwei, Coiling."
  ],
  "s0716": [
    "One is Split Dawn, or Zhaodawn—lord-weak token.",
    "One: Split Dawn or Zhaodawn—lord-weak token."
  ],
  "s0717": [
    "Also: Split Dawn crossing out,参 oars one hundred chi—chancellor executed and destroyed.",
    "Split Dawn crossing:参 oars hundred chi—chancellor destroyed."
  ],
  "s0718": [
    "Two is Chiyou Banner.",
    "Two: Chiyou Banner."
  ],
  "s0719": [
    "Or: Whirl Star scatters into Chiyou Banner.",
    "Or: Whirl Star scatters into Chiyou Banner."
  ],
  "s0720": [
    "Or: Chiyou Banner—born of five stars' expansion and contraction.",
    "Or: born of five stars' expansion and contraction."
  ],
  "s0721": [
    "Shape like comet then curved, image of banner.",
    "Comet-like then curved like banner."
  ],
  "s0722": [
    "Or: four directions no clouds, alone red cloud seen—Chiyou Banner.",
    "Or: alone red cloud—Chiyou Banner."
  ],
  "s0723": [
    "Or: Chiyou Banner like winnowing basket, two zhang long, tail has star.",
    "Or: like winnowing basket, two zhang, tail star."
  ],
  "s0724": [
    "Also: disordered state's king, many evils accumulated, cloud like planted reed bamboo long, yellow above white below—called Chiyou Banner.",
    "Disordered king: yellow-white cloud like reed—Chiyou Banner."
  ],
  "s0725": [
    "Governing executing rebellious states.",
    "Executing rebellious states."
  ],
  "s0726": [
    "Also: Emperor about to rage—Chiyou Banner emerges.",
    "Emperor raging: Chiyou Banner emerges."
  ],
  "s0727": [
    "Also: tyrant king reverses measure—Chiyou Banner emerges.",
    "Tyrant reversing measure: Chiyou Banner emerges."
  ],
  "s0728": [
    "Or: originally star-like, then curved afterward, image of banner T, two-three zhang long.",
    "Or: star-like then curved banner, two-three zhang."
  ],
  "s0729": [
    "Seen—king's banners and drums, great campaigning, armies rise in four quarters.",
    "Seen: royal banners, great campaigns, armies everywhere."
  ],
  "s0730": [
    "Otherwise, state has great mourning.",
    "Otherwise: great mourning."
  ],
  "s0731": [
    "Three is Zhaoming—five stars' transformation emerging west, called Zhaoming, metal qi.",
    "Three: Zhaoming—five stars west, metal qi."
  ],
  "s0732": [
    "Also: red comet divides into Zhaoming.",
    "Red comet divides into Zhaoming."
  ],
  "s0733": [
    "Zhaoming extinguished light, image like Great White, seven rays—therefore taken as hegemony-rising omen.",
    "Zhaoming like Great White with seven rays—hegemony omen."
  ],
  "s0734": [
    "Or: Pivot Star scatters into Zhaoming.",
    "Pivot scatters into Zhaoming."
  ],
  "s0735": [
    "Also: western star, seen six zhang from earth with light, Great White class, often moving, red within—western field star, called Zhaoming.",
    "Western star six zhang, Great White-like, red within—Zhaoming."
  ],
  "s0736": [
    "Emergence—armies rise greatly.",
    "Emergence: great armies."
  ],
  "s0737": [
    "At emergence, mourning below.",
    "At emergence: mourning below."
  ],
  "s0738": [
    "Emerging south—western states lose land.",
    "South emergence: western states lose land."
  ],
  "s0739": [
    "Or: Zhaoming like Great White, not moving—lord rises with virtue.",
    "Or: Zhaoming like unmoving Great White—virtuous rise."
  ],
  "s0740": [
    "Also: western star, large and white with horns, looking down—called Zhaoming.",
    "Western large white horned star looking down: Zhaoming."
  ],
  "s0741": [
    "Metal essence emerging—armies rise greatly.",
    "Metal essence: great armies."
  ],
  "s0742": [
    "If guarding Chamber and Heart—state mourning, certainly slaughtered city.",
    "Guarding Chamber-Heart: mourning, slaughtered city."
  ],
  "s0743": [
    "Below Zhaoming becomes Celestial Dog—where it descends, great battle and flowing blood.",
    "Below Zhaoming: Celestial Dog—great battle and blood."
  ],
  "s0744": [
    "Four is Siwei.",
    "Four: Siwei."
  ],
  "s0745": [
    "Or: Pivot Star scatters into Siwei.",
    "Pivot scatters into Siwei."
  ],
  "s0746": [
    "Also: white comet qi divides into Siwei.",
    "White comet qi divides into Siwei."
  ],
  "s0747": [
    "Siwei level—taken as strife and contention omen.",
    "Siwei level: strife omen."
  ],
  "s0748": [
    "Or: Siwei star large, with hair, two horns.",
    "Or: large with hair and two horns."
  ],
  "s0749": [
    "Also: Siwei star like Great White, often moving, red when examined.",
    "Like Great White, moving, red within."
  ],
  "s0750": [
    "Siwei emerging—strong state full, lord strikes strong marquis armies.",
    "Siwei emerging: strong state, strikes strong marquis."
  ],
  "s0751": [
    "Also: Siwei seen—lord loses law, term eight years, heroes rise, Son of Heaven loses state by injustice.",
    "Siwei seen: lost law, eight years, heroes, lost state."
  ],
  "s0752": [
    "Minister with voice—traveling lord's virtue.",
    "Voiced minister: lord's virtue."
  ],
  "s0753": [
    "Also: Siwei seen—below state mutually slaughters bandits.",
    "Siwei seen: mutual slaughter below."
  ],
  "s0754": [
    "Also: Siwei star emerging due west, western field star, six zhang from earth, large white, Great White class.",
    "Siwei due west, six zhang, Great White class."
  ],
  "s0755": [
    "One says: seen—armies rise strong.",
    "Seen: strong armies."
  ],
  "s0756": [
    "Also: Siwei emerging then inauspicious, below army clash unfavorable.",
    "Siwei emerging: inauspicious, unfavorable clash below."
  ],
  "s0757": [
    "Five is Celestial Coiling—white small, often moving—called Coiling Star, also called Execution Star.",
    "Five: Celestial Coiling—white, moving—Coiling or Execution Star."
  ],
  "s0758": [
    "Celestial Coiling governs killing punishment.",
    "Coiling governs killing punishment."
  ],
  "s0759": [
    "Also: Celestial Coiling seen—queen consort holds affairs; its root is master.",
    "Coiling seen: queen holds affairs."
  ],
  "s0760": [
    "Also: Coiling emerging—below mutually coiling, famine and armies, red land thousand li, bones piled.",
    "Coiling emerging: mutual strife, famine, war, piled bones."
  ],
  "s0761": [
    "Also: Coiling emerging—internal chaos in state.",
    "Coiling emerging: internal chaos."
  ],
  "s0762": [
    "Also: Great Yang essence, red bird seven lodges' domain—rebellion, cruelty, lost summer government.",
    "Great Yang essence, red bird domain—rebellion, lost summer."
  ],
  "s0763": [
    "Fill Star's essence flows into Five Ruins, Six Bandits, Prison Han, Great Ben, Bright Star, Frayed Flow, Fu Star, Ten Start.",
    "Fill essence: Five Ruins, Six Bandits, Prison Han, Great Ben, Bright Star, Frayed Flow, Fu, Ten Start."
  ],
  "s0764": [
    "One is Five Ruins.",
    "One: Five Ruins."
  ],
  "s0765": [
    "Or: Whirl Star scatters into Five Ruins.",
    "Whirl scatters into Five Ruins."
  ],
  "s0766": [
    "Also: azure comet scatters into Five Ruins.",
    "Azure comet scatters into Five Ruins."
  ],
  "s0767": [
    "Therefore destruction and defeat omen.",
    "Destruction and defeat omen."
  ],
  "s0768": [
    "Or: Five Ruins five parts.",
    "Or: five parts."
  ],
  "s0769": [
    "Also: one root and five branches.",
    "One root, five branches."
  ],
  "s0770": [
    "Term nine years—wickedness rises.",
    "Nine years: wickedness rises."
  ],
  "s0771": [
    "Three nines twenty-seven—great chaos cannot be forbidden.",
    "Three nines: unforbidden chaos."
  ],
  "s0772": [
    "Also: Five Ruins—five phases' transformation, emerging east, Five Ruins wood qi.",
    "Five Ruins: wood qi east."
  ],
  "s0773": [
    "One says Five Seam also Five Ruins—star emerging due east, eastern field star, Chronogram class, six-seven zhang from earth, large white, governing perverse ruin.",
    "Due east Chronogram-class star six-seven zhang: Five Ruins."
  ],
  "s0774": [
    "Or: eastern star six zhang from earth, large red, green within when examined.",
    "Or: six zhang, large red, green within."
  ],
  "s0775": [
    "Or: star surface green qi like halo, with hair, Year Star class—eastern field star Five Ruins.",
    "Green halo, hair, Year Star class—eastern Five Ruins."
  ],
  "s0776": [
    "Emergence—armies rise greatly.",
    "Emergence: great armies."
  ],
  "s0777": [
    "At emergence, mourning below.",
    "At emergence: mourning below."
  ],
  "s0778": [
    "Emerging north—eastern states lose land.",
    "North emergence: eastern states lose land."
  ],
  "s0779": [
    "Also: Five Ruins emerging—four borders empty, Son of Heaven has urgent armies.",
    "Five Ruins: empty borders, urgent armies."
  ],
  "s0780": [
    "Or: Five Ruins large red, often moving, green when examined.",
    "Large red moving, green within."
  ],
  "s0781": [
    "Also: Five Ruins emerging—armies rise.",
    "Five Ruins emerging: armies."
  ],
  "s0782": [
    "Two is Six Bandits—five phases' qi, emerging south.",
    "Two: Six Bandits—five phases south."
  ],
  "s0783": [
    "Or: Six Bandits fire qi.",
    "Or: fire qi."
  ],
  "s0784": [
    "Or: Six Bandits star shape like comet.",
    "Or: comet-shaped."
  ],
  "s0785": [
    "Also: southern star six zhang from earth, red and often moving, light when examined, Sparkling Fire class—southern field star Six Bandits.",
    "Southern six zhang, Sparkling Fire class—Six Bandits."
  ],
  "s0786": [
    "Emergence—armies rise, state chaos.",
    "Emergence: armies, state chaos."
  ],
  "s0787": [
    "At emergence, mourning below.",
    "At emergence: mourning below."
  ],
  "s0788": [
    "Emerging east—southern states lose land.",
    "East emergence: southern states lose land."
  ],
  "s0789": [
    "Also: Six Bandits seen due south, southern star six zhang, large red, often moving with light.",
    "Due south six zhang, large red, moving with light."
  ],
  "s0790": [
    "Three is Prison Han—one is Xian Han.",
    "Three: Prison Han or Xian Han."
  ],
  "s0791": [
    "Or: Power Star scatters into Prison Han.",
    "Power scatters into Prison Han."
  ],
  "s0792": [
    "Also: Xian Han—five phases' qi north, water qi.",
    "Xian Han: water qi north."
  ],
  "s0793": [
    "Prison Han green within red surface, below three comets crosswise—governing driving out and stabbing kings.",
    "Green within red, three cross comets—driving out kings."
  ],
  "s0794": [
    "Also: northern star six zhang, large red, moving, green-black within, Chronogram class—northern field star Xian Han.",
    "Northern six zhang, Chronogram class—Xian Han."
  ],
  "s0795": [
    "Emergence—armies rise, mourning below.",
    "Emergence: armies, mourning below."
  ],
  "s0796": [
    "Emerging west—northern states lose land.",
    "West emergence: northern states lose land."
  ],
  "s0797": [
    "Also: Prison Han moving—feudal lords alarmed, emergence then yin crosses.",
    "Prison Han moving: lords alarmed, yin crosses."
  ],
  "s0798": [
    "Four is Great Ben, governing violent rush.",
    "Four: Great Ben—violent rush."
  ],
  "s0799": [
    "Five is Bright Star, governing destroyed state.",
    "Five: Bright Star—destroyed state."
  ],
  "s0800": [
    "Six is Frayed Flow—moving, realm proud lords hide and flee.",
    "Six: Frayed Flow—proud lords flee."
  ]
};
const p=process.argv[2];if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8'));let c=0;
for(const s of d.sentences){if(T[s.id]){s.literal=T[s.id][0];s.idiomatic=T[s.id][1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');console.log('Patch count: '+c);
if(c!==Object.keys(T).length)process.exitCode=1;
