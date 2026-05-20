#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  "s1001": [
    "Director of Fate governs reporting faults, imposing punishment, and extinguishing ill omens.",
    "Director of Fate reports faults, punishes, and removes bad omens."
  ],
  "s1002": [
    "Director of Emolument extends years and virtue—therefore north of the Six Ancestors.",
    "Director of Emolument extends years and virtue, north of the Six Ancestors."
  ],
  "s1003": [
    "Striking Director of Peril means arrogance and dissipation destroy subordinates.",
    "Hitting Director of Peril brings arrogant rulers and ruined subjects."
  ],
  "s1004": [
    "Director of Wrong means using law for private ends.",
    "Director of Wrong bends law to private ends."
  ],
  "s1005": [
    "Gourd is five stars north of Separated Pearls—it governs secret plots, the inner palace, and fruits and food.",
    "Five Gourd stars north govern plots, the inner palace, and fruit."
  ],
  "s1006": [
    "When bright, the harvest succeeds; when faint, the harvest fails and the empress loses power.",
    "Bright Gourd means good harvest; faint means bad harvest and empress wanes."
  ],
  "s1007": [
    "If not as before, mountains shake and valleys have much water.",
    "Abnormal Gourd shakes mountains and floods valleys."
  ],
  "s1008": [
    "Five stars beside are called Failed Gourd—they govern planting.",
    "Five Failed Gourd stars govern planting."
  ],
  "s1009": [
    "Celestial Ford is nine stars—a beam measuring spirit connecting the four directions.",
    "Nine Celestial Ford stars are a beam spanning the four quarters."
  ],
  "s1010": [
    "If one star is incomplete, ferry passes are blocked.",
    "One missing star blocks ferry passes."
  ],
  "s1011": [
    "Bright motion brings war like flowing sand and dead like tangled hemp.",
    "Bright motion brings war like sand and corpses like hemp."
  ],
  "s1012": [
    "Faint and uneven—horses expensive or dying.",
    "Faint uneven stars mean costly or dying horses."
  ],
  "s1013": [
    "If stars vanish, harm comes from river water; or water bandits proclaim kings.",
    "Vanished stars bring river disaster or river kings."
  ],
  "s1014": [
    "Seven stars near the river east are called Chariot Office—it governs chariot officials.",
    "Seven Chariot Office stars by the river govern chariots."
  ],
  "s1015": [
    "Five stars southeast of Chariot Office are called Human Star—it governs calming the multitude, soothing the distant and cherishing the near.",
    "Five Human stars southeast calm people and cherish near and far."
  ],
  "s1016": [
    "Also called Reclining Star—it governs guarding against licentiousness.",
    "Also Reclining Star guarding against lust."
  ],
  "s1017": [
    "Three stars south split inward; four stars southeast are called Mortar and Pestle—they supply army grain.",
    "Split southern three and southeast four Mortar-Pestle stars supply army grain."
  ],
  "s1018": [
    "If a guest star enters, war rises and the realm gathers grain.",
    "Guest star entry brings war and grain hoarding."
  ],
  "s1019": [
    "Four stars north of Celestial Ford shaped like a balance are called Xi Zhong—the ancient Master of Chariots.",
    "Four balance-shaped stars north are Xi Zhong, ancient chariot master."
  ],
  "s1020": [
    "Soaring Serpent is twenty-two stars north of Encampment—Celestial Serpent governing water creatures.",
    "Twenty-two Soaring Serpent stars north govern water creatures."
  ],
  "s1021": [
    "When bright, unrest; if a guest star lodges there, rain and flood become disaster and aquatic goods are not gathered.",
    "Brightness brings unrest; guest star lodging brings flood disaster and lost aquatic harvest."
  ],
  "s1022": [
    "Wang Liang is five stars north of Kui, in the river—the Son of Heaven's chariot master.",
    "Five Wang Liang stars in the river north of Kui are the imperial chariot master."
  ],
  "s1023": [
    "Its four stars are called Celestial Team; beside one star is Wang Liang, also called Celestial Horse.",
    "Four are Celestial Team; beside one is Wang Liang or Celestial Horse."
  ],
  "s1024": [
    "When its stars move, horses are whipped and chariots and horsemen fill the fields.",
    "Motion whips horses and fills fields with riders."
  ],
  "s1025": [
    "Also called Wang Liang Bridge—the Celestial Bridge, governing wind, rain, and waterways; therefore sometimes interpreted for ferries and bridges.",
    "Also Wang Liang Bridge governing wind, rain, and crossings."
  ],
  "s1026": [
    "If its stars shift, there is war; also called horse sickness.",
    "Shifting stars bring war or horse plague."
  ],
  "s1027": [
    "If a guest star lodges there, the bridge is blocked.",
    "Guest star lodging blocks the bridge."
  ],
  "s1028": [
    "One star ahead is called Whip—Wang Liang's riding whip, governing the Son of Heaven's servant, beside Wang Liang.",
    "Ahead is Whip, Wang Liang's riding crop for the emperor's servant."
  ],
  "s1029": [
    "If it shifts behind the horse, this is called Whipping Horses—then chariots and horsemen fill the fields.",
    "Shifted behind the horse it whips horses and fills the plain with riders."
  ],
  "s1030": [
    "Gallery Road is six stars before Wang Liang—the flying path.",
    "Six Gallery Road stars before Wang Liang are the flying path."
  ],
  "s1031": [
    "From the Purple Palace to the river—where deities ride.",
    "From Purple Palace to river where gods travel."
  ],
  "s1032": [
    "Also called Gallery Road—it governs roads, the Son of Heaven's path to separate palaces on pleasure tours.",
    "Also governs roads and pleasure routes to detached palaces."
  ],
  "s1033": [
    "Also called Gallery Road—warding off danger and removing blame.",
    "Also wards danger and removes fault."
  ],
  "s1034": [
    "Also called Wang Liang Banner or Purple Palace Banner—also standards, and they should not waver.",
    "Also Wang Liang or Purple Palace Banner standards that should not waver."
  ],
  "s1035": [
    "Banner stars are what armies use.",
    "Banner stars serve armies."
  ],
  "s1036": [
    "Auxiliary Road is one star south of Gallery Road—a side by-path.",
    "Auxiliary Road south is a side path."
  ],
  "s1037": [
    "Guarding against Gallery Road failure—return and ride again.",
    "Guards Gallery Road failure to return and ride again."
  ],
  "s1038": [
    "Also called Grand Coachman—it governs wind and rain, also the meaning of travel retinue.",
    "Also Grand Coachman governing wind, rain, and travel escort."
  ],
  "s1039": [
    "Ten stars north of Eastern Wall are called Celestial Stable—it governs horse officials, like today's post stations; governing transmitting orders, establishing posts, racing the clepsydra—called running urgently, competing with gnomon clepsydra.",
    "Ten Celestial Stable stars north of Eastern Wall govern post horses racing time."
  ],
  "s1040": [
    "Heavenly General is twelve stars north of Lou—it governs military affairs.",
    "Twelve Heavenly General stars north of Lou govern war."
  ],
  "s1041": [
    "The central great star is Heaven's great general.",
    "The central great star is Heaven's commander."
  ],
  "s1042": [
    "Outer small stars are officers and soldiers.",
    "Outer small stars are officers and troops."
  ],
  "s1043": [
    "When the great general star wavers, war rises and the great general emerges.",
    "Wavering great general star brings war and the general's emergence."
  ],
  "s1044": [
    "If small stars are incomplete, armies mobilize.",
    "Incomplete small stars mobilize armies."
  ],
  "s1045": [
    "One southern star is called Army South Gate—it governs challenging comings and goings.",
    "Southern Army South Gate star challenges traffic."
  ],
  "s1046": [
    "Great Mound is eight stars north of Stomach.",
    "Eight Great Mound stars north of Stomach."
  ],
  "s1047": [
    "A mound (ling) is a tomb.",
    "Ling means tomb."
  ],
  "s1048": [
    "The mouth of Great Mound Curled Tongue is called Accumulated Capital—it governs great mourning.",
    "Curled Tongue mouth of Great Mound is Accumulated Capital, governing great mourning."
  ],
  "s1049": [
    "If stars within Accumulated Capital are cut off, feudal lords have mourning, people many illnesses, war rises, grain gathers.",
    "Cut Accumulated Capital stars bring lordly mourning, sickness, war, and grain hoarding."
  ],
  "s1050": [
    "If few, grain scatters.",
    "Few stars scatter grain."
  ],
  "s1051": [
    "If stars lodge there, earthworks occur.",
    "Lodging stars bring earthworks."
  ],
  "s1052": [
    "One star within Great Mound is called Accumulated Corpses—when bright, dead like mountains.",
    "Accumulated Corpses within Great Mound bright means dead like mountains."
  ],
  "s1053": [
    "Celestial Boat is nine stars north of Great Mound, in the river.",
    "Nine Celestial Boat stars in the river north of Great Mound."
  ],
  "s1054": [
    "Also called Boat Star—it governs crossing, therefore ferrying where blocked; also governs flood and drought.",
    "Also Boat Star for crossing blocked waters and flood-drought."
  ],
  "s1055": [
    "If not in the Han River region, ferries and rivers are blocked.",
    "Outside Han River region, rivers block."
  ],
  "s1056": [
    "The four central stars should be evenly bright—then great peace across the realm.",
    "Four even bright central stars mean realm at peace."
  ],
  "s1057": [
    "Otherwise war or mourning.",
    "Otherwise war or mourning."
  ],
  "s1058": [
    "If guest comets enter or exit, great flood and war.",
    "Guest comets bring flood and war."
  ],
  "s1059": [
    "One central star is called Accumulated Water—it watches for water disaster.",
    "Central Accumulated Water watches floods."
  ],
  "s1060": [
    "Two stars west of Mao are called Celestial Street—the path of the three luminaries, watching passes and bridges and inner and outer borders.",
    "Two Celestial Street stars west of Mao watch borders and the luminaries' path."
  ],
  "s1061": [
    "One star west of Celestial Street is called Moon.",
    "West of Celestial Street is Moon star."
  ],
  "s1062": [
    "Curled Tongue is six stars north—it governs speech, knowing flattery and slander.",
    "Six Curled Tongue stars north govern speech and detect slander."
  ],
  "s1063": [
    "Curved is auspicious; straight and moving brings rumor harm across the realm.",
    "Curved is lucky; straight moving brings scandal."
  ],
  "s1064": [
    "One central star is called Celestial Slander—it governs shamans and physicians.",
    "Central Celestial Slander governs shamans and doctors."
  ],
  "s1065": [
    "Five Chariots are five stars; Three Pillars nine stars north of Net.",
    "Five Chariots and nine Three Pillars north of Net."
  ],
  "s1066": [
    "Five Chariots are the Five Emperors' chariot lodges and seats—they govern the Son of Heaven's five weapons; also said to govern abundance or scarcity of the five grains.",
    "Five Chariots are Five Emperors' lodges governing the emperor's five arms and grain harvests."
  ],
  "s1067": [
    "The northwest great star is called Celestial Storehouse—it governs Venus and Qin.",
    "Northwest great star Celestial Storehouse governs Venus and Qin."
  ],
  "s1068": [
    "The next northeast star is called Prison—it governs Mercury and Yan and Zhao.",
    "Next northeast Prison governs Mercury, Yan, and Zhao."
  ],
  "s1069": [
    "The next eastern star is called Celestial Granary—it governs Jupiter and Lu and Wei.",
    "Next east Celestial Granary governs Jupiter, Lu, and Wei."
  ],
  "s1070": [
    "The next southeast star is called Minister of Works—it governs Saturn and Chu.",
    "Next southeast Minister of Works governs Saturn and Chu."
  ],
  "s1071": [
    "The next southwest star is called Minister Star—it governs Mars and Wei.",
    "Next southwest Minister Star governs Mars and Wei."
  ],
  "s1072": [
    "When the five planets change, each is interpreted by what it governs.",
    "Five planet changes are read by their domains."
  ],
  "s1073": [
    "Three Pillars—also called Three Springs, Rest, and Banner.",
    "Three Pillars also Three Springs, Rest, and Banner."
  ],
  "s1074": [
    "Five Chariot stars should be evenly bright, breadth and narrowness constant.",
    "Five Chariots should shine evenly with constant spacing."
  ],
  "s1075": [
    "When the Son of Heaven obtains Spirit Terrace rites, Five Chariots and Three Pillars shine evenly.",
    "Spirit Terrace rites make Five Chariots and Three Pillars evenly bright."
  ],
  "s1076": [
    "Within are five stars called Celestial Ford.",
    "Within are five Celestial Ford stars."
  ],
  "s1077": [
    "Three stars south of Celestial Ford are called Salty Pool—the fish preserve.",
    "Three Salty Pool stars south are the fish preserve."
  ],
  "s1078": [
    "If the moon or five planets enter Celestial Ford, war rises, roads blocked, realm in chaos, government changes.",
    "Moon or planets entering Celestial Ford bring war, blocked roads, chaos, and regime change."
  ],
  "s1079": [
    "When Salty Pool is bright, dragons fall dead, fierce beasts and wolves harm people, as if war rises.",
    "Bright Salty Pool kills dragons, beasts harm people, like war."
  ],
  "s1080": [
    "Six stars south of Five Chariots are called Various Princes—they observe feudal lords' survival.",
    "Six Various Princes stars south watch lords' fate."
  ],
  "s1081": [
    "Five western stars are called Sharp Stone—if metal or a guest star lodges there, armies move.",
    "Five Sharp Stone stars west—metal or guest star brings armies."
  ],
  "s1082": [
    "Eight northern stars are called Eight Grains—they govern watching the harvest.",
    "Eight Grains stars north watch the harvest."
  ],
  "s1083": [
    "If one Eight Grains star vanishes, one grain fails.",
    "One vanished grain star fails one crop."
  ],
  "s1084": [
    "Celestial Pass is one star south of Five Chariots—also called Heavenly Gate, where sun and moon travel; it governs frontier affairs and opening and closing.",
    "Celestial Pass south governs frontiers, sun-moon path, and gates."
  ],
  "s1085": [
    "Rays and horns—there is war.",
    "Rays and horns mean war."
  ],
  "s1086": [
    "If five planets lodge there, many nobles die.",
    "Five planets lodging kill many nobles."
  ],
  "s1087": [
    "Four stars before Eastern Well's axe are called Director of Omens—it watches Heaven and Earth, sun, moon, stars, and changes, and omens of birds, beasts, plants, and trees; enlightened rulers hearing disaster cultivate virtue and preserve blessing.",
    "Director of Omens before Well's axe watches cosmic and natural omens for virtuous rulers."
  ],
  "s1088": [
    "Nine stars northwest of Director of Omens are called Seated Banner—the model of ruler and minister placement.",
    "Nine Seated Banner stars northwest model court ranks."
  ],
  "s1089": [
    "Four stars west of Seated Banner are called Heavenly Height—the height of terraces and pavilions, governing gazing far at atmospheric signs.",
    "Four Heavenly Height stars west oversee distant weather signs."
  ],
  "s1090": [
    "One star west of Heavenly Height is called Celestial River—it observes mountain and forest omens.",
    "Celestial River west watches mountain-forest omens."
  ],
  "s1091": [
    "Southern River and Northern River are three stars each, flanking Eastern Well.",
    "Three Southern and three Northern River stars flank Eastern Well."
  ],
  "s1092": [
    "Also called Heavenly Height's gate tower—it governs passes and bridges.",
    "Also Heaven's gate tower governing passes."
  ],
  "s1093": [
    "Southern River is called Southern Garrison—also Southern Palace, Yang Gate, Yue Gate, Power Star; it governs fire.",
    "Southern River is Southern Garrison, Yang Gate, Power Star—fire."
  ],
  "s1094": [
    "Northern River is also Northern Garrison—also Northern Palace, Yin Gate, Hu Gate, Balance Star; it governs water.",
    "Northern River is Northern Garrison, Yin Gate, Balance Star—water."
  ],
  "s1095": [
    "Between the two river garrisons is the regular path of sun, moon, and five planets.",
    "Between the rivers is the luminaries' regular path."
  ],
  "s1096": [
    "If river garrisons waver, war rises in China.",
    "Wavering river garrisons raise war in China."
  ],
  "s1097": [
    "Three Southern River stars are called Gate Mound—it governs the symbolic watchtower outside the palace gate.",
    "Three Gate Mound stars are the palace gate watchtower."
  ],
  "s1098": [
    "Five Feudal Lords are five stars north of Eastern Well—they govern impeachment and guarding against the unexpected.",
    "Five Feudal Lords north of Well impeach and guard surprises."
  ],
  "s1099": [
    "It is also said to regulate yin and yang and observe gains and losses.",
    "Also regulates yin-yang and weighs right and wrong."
  ],
  "s1100": [
    "Also said to govern the emperor's heart.",
    "Also governs the emperor's mind."
  ]
};
const p=process.argv[2]; if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8')); let c=0;
for(const s of d.sentences){const x=T[s.id];if(x){s.literal=x[0];s.idiomatic=x[1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n'); console.log('Patch',c);
