#!/usr/bin/env node
import fs from 'node:fs';
const T={
  "s1001": [
    "Large with light—the person is noble and multitudinous.",
    "Large with light: noble and many."
  ],
  "s1002": [
    "Now bright now extinguished—bandit defeat and accomplishment.",
    "Flickering: bandit defeat and success."
  ],
  "s1003": [
    "Front large rear small—fear and grief.",
    "Front large rear small: fear and grief."
  ],
  "s1004": [
    "Front small rear large—joyful affair.",
    "Front small rear large: joy."
  ],
  "s1005": [
    "Snake travel—treacherous affair.",
    "Snake travel: treachery."
  ],
  "s1006": [
    "Going fast—going without return.",
    "Fast going: no return."
  ],
  "s1007": [
    "Long—affair long-lasting.",
    "Long: long-lasting affair."
  ],
  "s1008": [
    "Short—affair urgent.",
    "Short: urgent affair."
  ],
  "s1009": [
    "Where rushing star falls—armies below.",
    "Rushing star fall: armies below."
  ],
  "s1010": [
    "No wind or clouds, shooting star seen, long interval then enters—great wind uproots houses and breaks trees.",
    "Shooting star without wind: great wind uproots houses."
  ],
  "s1011": [
    "Small shooting stars hundred-number traveling four directions—image of multitudes migrating.",
    "Hundred small shooting stars four directions: mass migration."
  ],
  "s1012": [
    "Shooting stars' anomalous forms—names and omens differ.",
    "Anomalous shooting stars: different names and omens."
  ],
  "s1013": [
    "Now briefly what ancient books and Jingzhou divination record:",
    "Briefly from ancient books and Jingzhou divination:"
  ],
  "s1014": [
    "Shooting star's tail two-three zhang, brilliant with light spanning heaven—white color is envoy; red color is general's envoy.",
    "Tail two-three zhang spanning heaven: white envoy, red general's envoy."
  ],
  "s1015": [
    "Shooting star has light yellow-white color, falling from heaven with sound like torch flame to earth, wild pheasants all cry—this is Heaven's protection.",
    "Yellow-white with sound like torch, pheasants cry: Heaven's protection."
  ],
  "s1016": [
    "Where it falls state is secure with joy, like water.",
    "Where fallen: secure state with joy like water."
  ],
  "s1017": [
    "Shooting star color green-red called Earth Wild Goose—where it falls armies rise.",
    "Green-red Earth Wild Goose: armies where fallen."
  ],
  "s1018": [
    "Shooting star has light green-red, two-three zhang long called Heaven Wild Goose—army's essence.",
    "Green-red two-three zhang Heaven Wild Goose: army essence."
  ],
  "s1019": [
    "State raises armies; general should follow star's direction.",
    "State raises armies; general follows star."
  ],
  "s1020": [
    "Shooting star brilliant with light white, tail spanning heaven—human lord's star; lord, chancellor, armies follow star's direction.",
    "White tail spanning heaven: human lord's star; armies follow."
  ],
  "s1021": [
    "Generally stars like jars—raising plots and affairs.",
    "Jar-like stars: raising plots."
  ],
  "s1022": [
    "Large like peach—envoy affair.",
    "Peach-large: envoy affair."
  ],
  "s1023": [
    "Shooting star large like jar or urn, light red-black, has beak—called Beam Star; where fallen township has armies, lord loses land.",
    "Red-black jar with beak Beam Star: armies, lost land."
  ],
  "s1024": [
    "Flying star large like jar or urn, afterward bright white, front low rear high—this is called Slow Stubborn; many where it follows die, lose fiefs without battle.",
    "Bright white front-low Slow Stubborn: death, lost fiefs without battle."
  ],
  "s1025": [
    "Flying star large like jar, afterward bright white front low rear high, shaking head, now up now down—this is called Falling Stone; people below insufficient food.",
    "Falling Stone shaking: insufficient food below."
  ],
  "s1026": [
    "Flying star large like jar, afterward bright white, star extinguished afterward white curves ring like chariot wheel—this is called Release Bit.",
    "Release Bit wheel ring: people mutually bite for rank and stipend."
  ],
  "s1027": [
    "People mutually biting and eating—this is called mutual gnawing.",
    "Mutual gnawing for rank and stipend."
  ],
  "s1028": [
    "Flying star large like jar, afterward bright white, several zhang long, after star extinguished latter becomes cloud flowing down—called Great Slip; below flowing blood piled bones.",
    "Great Slip cloud flow: blood and piled bones."
  ],
  "s1029": [
    "Flying star large like jar, afterward bright white, long ten-plus zhang and curved—called Heaven Punishment, one Heaven Adornment; general equalizes borders.",
    "Heaven Punishment ten-plus zhang curved: general equalizes borders."
  ],
  "s1030": [
    "Celestial Dog, shaped like great rushing star, color yellow with sound; where it stops earth class dog; where fallen, seen like fire light, blazing rushing sky, upper sharp lower round, like several qing fields.",
    "Celestial Dog yellow with sound, dog-shaped fall like blazing fields."
  ],
  "s1031": [
    "Or: star has hair, short comet beside, below dog shape.",
    "Or: hair, short comet, dog shape."
  ],
  "s1032": [
    "Or: star emerges red-white with light, below then Celestial Dog.",
    "Red-white light below: Celestial Dog."
  ],
  "s1033": [
    "One says: shooting star has light, seen human face, falling without sound, as if with feet—called Celestial Dog.",
    "Shooting star with human face, silent, feet: Celestial Dog."
  ],
  "s1034": [
    "Color white, within yellow, yellow like remnant fire shape.",
    "White outside yellow within like remnant fire."
  ],
  "s1035": [
    "Governing watching armies attacking bandits; seen—four directions mutually shoot, thousand-li broken armies slain generals.",
    "Watching armies; seen: thousand-li broken armies."
  ],
  "s1036": [
    "Or: five generals battle, people eat one another, township where gone has flowing blood.",
    "Five generals battle, cannibalism, blood where gone."
  ],
  "s1037": [
    "Its lord loses land, armies rise greatly, state changes government, guard and defend.",
    "Lord loses land, armies, changed government—guard."
  ],
  "s1038": [
    "Remaining omens same as before.",
    "Remaining omens same as before."
  ],
  "s1039": [
    "Camp Head—cloud like broken mountain falling, so-called Camp Head star; where fallen below overturned armies, flowing blood thousand li.",
    "Camp Head like falling mountain: overturned armies, blood thousand li."
  ],
  "s1040": [
    "Also: shooting star falling by day named Camp Head.",
    "Day falling shooting star: Camp Head."
  ],
  "s1041": [
    "Cloud qi, auspicious qi one is Celebratory Cloud—like smoke not smoke, like cloud not cloud, dense and abundant, desolate and coiled—called Celebratory Cloud, also Luminous Cloud.",
    "Celebratory Cloud: smoke-like, dense—auspicious."
  ],
  "s1042": [
    "This is joyful qi—response of great peace.",
    "Joyful qi—great peace response."
  ],
  "s1043": [
    "One is Splendid Light, red like dragon shape.",
    "Splendid Light red like dragon."
  ],
  "s1044": [
    "Sage rises, Emperor receives end then seen.",
    "Sage rises; Emperor receives end: seen."
  ],
  "s1045": [
    "Baleful qi one is Rainbow—beside sun qi.",
    "Baleful qi one: Rainbow—beside sun."
  ],
  "s1046": [
    "Dipper's chaotic essence—governing confused heart, internal licentiousness, ministers plotting lord, Son of Heaven humiliates queen consort, exclusive wife not one.",
    "Dipper's chaotic essence: licentiousness, minister plots, humiliated consort."
  ],
  "s1047": [
    "Two is Ram Cloud, like dog, red color long tail—for disordered lord, for armies and mourning.",
    "Two: Ram Cloud like red-tailed dog—for disordered lord, armies and mourning."
  ]
};
const p=process.argv[2];if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8'));let c=0;
for(const s of d.sentences){if(T[s.id]){s.literal=T[s.id][0];s.idiomatic=T[s.id][1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');console.log('Patch count: '+c);
if(c!==Object.keys(T).length)process.exitCode=1;
