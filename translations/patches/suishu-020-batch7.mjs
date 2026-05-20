#!/usr/bin/env node
import fs from 'node:fs';
const T={
  "s0601": [
    "At Han's beginning through observation, it was known all five planets have retrograde motion; afterward transmitters rarely could discern it.",
    "Han observers learned all five planets retrograde; later transmitters rarely discerned it."
  ],
  "s0602": [
    "By late Northern Wei, Zhang Zixin of Qinghe, learning broad and penetrating, especially refined in calendrical reckoning.",
    "Late Northern Wei: Zhang Zixin of Qinghe, master of calendrical reckoning."
  ],
  "s0603": [
    "Avoiding Ge Rong's chaos, he hid on an island thirty-odd years, exclusively using the armillary sphere to observe sun, moon, and five planets' differential numbers, calculating and stepping them—first comprehending sun-moon crossing paths have inner-outer slow-fast, and five planets' appearance and hiding have sympathetic facing and backing.",
    "Hiding on an island thirty years with an armillary sphere, Zhang Zixin grasped eclipse paths and planetary appearance."
  ],
  "s0604": [
    "He said the sun's daily travel is slow after spring equinox and fast after autumn equinox.",
    "Sun travel is slow after spring equinox, fast after autumn equinox."
  ],
  "s0605": [
    "At conjunction if the moon is inside the sun's path there is solar eclipse; if outside the sun's path, though crossing, no loss.",
    "Moon inside sun's path at conjunction: eclipse; outside: no loss though crossing."
  ],
  "s0606": [
    "At full moon meeting crossing there is loss, regardless of inner or outer.",
    "Full moon at crossing always eclipses, inner or outer."
  ],
  "s0607": [
    "Also moon travel meeting wood, fire, earth, metal four stars—facing them is fast, backing them is slow.",
    "Moon facing four planets is fast; backing them, slow."
  ],
  "s0608": [
    "Five planets traveling the four quarters' lodges each have what they favor and hate.",
    "Five planets in lodges each favor and hate certain places."
  ],
  "s0609": [
    "Where they dwell meeting what they favor—then long stationary, slow travel, early appearance.",
    "Favored lodges: long stationary, slow travel, early appearance."
  ],
  "s0610": [
    "Meeting what they hate—then short stationary, fast travel, late appearance.",
    "Hated lodges: short stationary, fast travel, late appearance."
  ],
  "s0611": [
    "Differing from constant numbers—lesser difference to five degrees, greater to thirty-odd degrees.",
    "Differences from constants: up to five or thirty degrees."
  ],
  "s0612": [
    "Chronogram Star's travel—appearance and hiding are especially anomalous.",
    "Chronogram Star's appearance and hiding are especially anomalous."
  ],
  "s0613": [
    "Should appear at dawn after Rain Water before Start of Summer; should appear at dusk after End of Heat before Frost's Descent—both not seen.",
    "Expected dawn and dusk appearances often not seen."
  ],
  "s0614": [
    "Within Awakening, Start of Summer, Start of Autumn, Frost's Descent four qi—dawn and dusk within thirty-six degrees before and after the sun, eighteen degrees outside, if wood-fire-earth-metal one star appears it is seen; if none, not seen.",
    "Within four seasonal nodes, planets within certain solar degrees appear or not."
  ],
  "s0615": [
    "Later Zhang Zhouxuan, Liu Xiaosun, Liu Chao and others, following these differential degrees, fixed eclipse fractions and five planets' fixed appearance and fixed travel—matching Heaven closely—all never obtained by ancients.",
    "Zhang Zhouxuan, Liu Xiaosun, and Liu Chao fixed eclipses and planetary motion—unmatched by ancients."
  ],
  "s0616": [
    "Liang court gentleman Zu Geng, during Tianjian, received edict to gather ancient star officials and weft-text old theories, compiling Astronomy Record in thirty volumes.",
    "Liang's Zu Geng compiled the thirty-volume Astronomy Record under Tianjian."
  ],
  "s0617": [
    "When Zhou conquered Liang, they obtained Yu Jicai as Grand Astrologer, compiling Secret Canon of the Spirit Tower in one hundred twenty volumes—divination and verification more complete.",
    "Zhou obtained Yu Jicai, who compiled the Secret Canon of the Spirit Tower in 120 volumes."
  ],
  "s0618": [
    "Now briefly the miscellaneous stars, auspicious stars, baleful stars, guest stars, shooting stars, and cloud-qi names and forms are placed hereafter.",
    "Below are miscellaneous, auspicious, baleful, guest, and shooting stars and cloud forms."
  ],
  "s0619": [
    "Auspicious star one is called Luminous Star—like a half moon, born at new and full moon, assisting the moon as brightness.",
    "Auspicious star one: Luminous Star, half-moon at new and full moon."
  ],
  "s0620": [
    "Or: star large and hollow in center.",
    "Or: large star hollow at center."
  ],
  "s0621": [
    "Or: three stars in red方 qi connected to green方 qi.",
    "Or: three stars in red qi connected to green qi."
  ],
  "s0622": [
    "Yellow star in red方 qi—also called Virtue Star.",
    "Yellow star in red qi is also Virtue Star."
  ],
  "s0623": [
    "Two is Zhou Bo Star—yellow and brilliant; the state where seen greatly flourishes.",
    "Two: Zhou Bo Star—yellow and brilliant; seen state flourishes."
  ],
  "s0624": [
    "Three is Containing Praise—light like a comet; when pleased, Containing Praise shoots.",
    "Three: Containing Praise—comet-like light when pleased."
  ],
  "s0625": [
    "Star miscellaneous change one is stars seen by day.",
    "Miscellaneous change one: stars seen by day."
  ],
  "s0626": [
    "If star and sun appear together, called Marrying Daughter.",
    "Star and sun together: Marrying Daughter."
  ],
  "s0627": [
    "Star contending light with sun—military weakens, civil strengthens, woman becomes king; in city mourning, in field armies.",
    "Star-sun light rivalry: weak military, strong civil, woman king."
  ],
  "s0628": [
    "Also: ministers have treacherous hearts, lord not enlightened, subordinates unrestrained, great flood vast.",
    "Also: treacherous ministers, dark lord, vast flood."
  ],
  "s0629": [
    "Also: stars by day, rainbow not extinguished, subjects give light, star seizes sun's light—a king is established under Heaven.",
    "Also: day stars and enduring rainbow mean a new king."
  ],
  "s0630": [
    "Two is fixed stars not seen.",
    "Two: fixed stars not seen."
  ],
  "s0631": [
    "Fixed stars are the class of lords in office.",
    "Fixed stars are lords in office."
  ],
  "s0632": [
    "Not seen means image of feudal lords turning against, not assisting the king in following law, no lord's image.",
    "Not seen: lords rebel, no lord's image."
  ],
  "s0633": [
    "Also: fixed stars not seen—the lord is not strict, law dissolves.",
    "Also: lord not strict, law dissolves."
  ],
  "s0634": [
    "Also: Son of Heaven loses government, feudal lords are violent.",
    "Also: lost government, violent lords."
  ],
  "s0635": [
    "Also: constant stars and lodges not seen—image of central realm's feudal lords fading and perishing.",
    "Also: unseen lodges mean fading lords."
  ],
  "s0636": [
    "Three is stars battling—stars battling means great chaos under Heaven.",
    "Three: stars battling—great chaos."
  ],
  "s0637": [
    "Four is stars trembling—stars trembling, multitudes will toil.",
    "Four: trembling stars—people toil."
  ],
  "s0638": [
    "Five is stars falling.",
    "Five: stars falling."
  ],
  "s0639": [
    "Great stars falling—yang loses its position, the bud of disaster.",
    "Great stars falling: yang loses position—disaster buds."
  ],
  "s0640": [
    "Also: many stars fall—people lose their place.",
    "Also: many falling stars—people lose place."
  ],
  "s0641": [
    "Generally stars that fall—the state changes government.",
    "Falling stars: changed government."
  ],
  "s0642": [
    "Also: stars fall—below is a battlefield; realm chaos, term three years.",
    "Also: battlefield below, three-year chaos."
  ],
  "s0643": [
    "Also: where shooting stars fall, armies below; where lodges fall, families and states destroyed; where many stars fall, multitudes perish.",
    "Shooting stars: armies; lodges: destroyed states; many stars: dead multitudes."
  ],
  "s0644": [
    "Also: Fill Star falls—seawater overflows; yellow star gallops—seawater leaps.",
    "Fill falling: seawater overflows; yellow star: seawater leaps."
  ],
  "s0645": [
    "Also: yellow star falls—seawater topples.",
    "Yellow star falling: seawater topples."
  ],
  "s0646": [
    "Also: stars fall and Bohai breaks open.",
    "Stars fall and Bohai breaks."
  ],
  "s0647": [
    "Stars falling like rain—Son of Heaven weak, feudal lords forceful government, Five Hegemons rise in turn as covenant lords, many overpower few, great swallow small.",
    "Star-rain: weak Son of Heaven, hegemon struggle."
  ],
  "s0648": [
    "Also: stars attached departing heaven—like multitudes departing kings.",
    "Stars leaving heaven: like people leaving kings."
  ],
  "s0649": [
    "King loses the Way, statutes abolished, subordinates will rebel and depart.",
    "King loses Way, statutes abolished, rebellion."
  ],
  "s0650": [
    "Therefore stars rebel against heaven and fall—to show the image.",
    "Stars rebel against heaven and fall—showing the image."
  ],
  "s0651": [
    "State has armies and calamity—stars fall as birds and beasts.",
    "Armies and calamity: stars fall as beasts."
  ],
  "s0652": [
    "Realm about to perish—stars fall as flying insects.",
    "Realm perishing: stars fall as insects."
  ],
  "s0653": [
    "Great armies under Heaven—stars fall as metal and iron.",
    "Great armies: stars fall as metal."
  ],
  "s0654": [
    "Flood under Heaven—stars fall as earth.",
    "Flood: stars fall as earth."
  ],
  "s0655": [
    "State lord perishes, armies—stars fall as grass and trees.",
    "Dead lord and armies: stars fall as plants."
  ],
  "s0656": [
    "Armies rise, state lord perishes—stars fall as sand.",
    "Armies and dead lord: stars fall as sand."
  ],
  "s0657": [
    "Stars falling as speaking humans—good and evil as their speech.",
    "Falling speakers: good and evil as spoken."
  ],
  "s0658": [
    "Also: state has great mourning—stars fall as dragons.",
    "Great mourning: stars fall as dragons."
  ],
  "s0659": [
    "Baleful stars are the names of five phases' qi and five stars' transformations; seen in their direction, taken as calamity and disaster.",
    "Baleful stars are five phases' and five stars' transformations—calamity by direction."
  ],
  "s0660": [
    "Each by its day's five colors take omens, knowing which state's fortune and misfortune is decided.",
    "By day and five colors, each state's fortune is decided."
  ],
  "s0661": [
    "Appearing and traveling in states without the Way, states losing ritual—armies, famine, flood, drought, death omens.",
    "In lawless states: armies, famine, flood, drought, death."
  ],
  "s0662": [
    "Also: generally baleful stars emerging differ in shape but calamity is the same.",
    "Baleful stars differ in shape; calamity is the same."
  ],
  "s0663": [
    "Emergence not exceeding one year, or three years—certainly broken state, slaughtered city.",
    "Emergence within one to three years: broken state, slaughtered city."
  ],
  "s0664": [
    "Its lord dies, great chaos under Heaven, soldiers disorderly travel, battle death in the wild, corpses piled crosswise.",
    "Lord dies, chaos, corpses piled crosswise."
  ],
  "s0665": [
    "Remaining calamity not exhausted—water, drought, armies, famine, pestilence calamities.",
    "Remaining calamity: flood, drought, war, famine, plague."
  ],
  "s0666": [
    "Also: generally when baleful stars appear and are large and long—calamity deep, term far;",
    "Large baleful stars: deep calamity, far term;"
  ],
  "s0667": [
    "small and short—calamity shallow, term near.",
    "Small: shallow calamity, near term."
  ],
  "s0668": [
    "Three to five chi—term one hundred days.",
    "Three to five chi: one hundred days."
  ],
  "s0669": [
    "Five chi to one zhang—term one year.",
    "Five chi to one zhang: one year."
  ],
  "s0670": [
    "One zhang to three zhang—term three years.",
    "One to three zhang: three years."
  ],
  "s0671": [
    "Three to five zhang—term five years.",
    "Three to five zhang: five years."
  ],
  "s0672": [
    "Five to ten zhang—term seven years.",
    "Five to ten zhang: seven years."
  ],
  "s0673": [
    "Above ten zhang—term nine years.",
    "Above ten zhang: nine years."
  ],
  "s0674": [
    "Examined carefully—the calamity certainly responds.",
    "Careful examination: calamity responds."
  ],
  "s0675": [
    "Comets—what the world calls broom stars—originally like stars, finally like comets; small ones several cun, long ones spanning heaven.",
    "Comets, broom stars—star-like at head, comet-like at tail; small to heaven-spanning."
  ],
  "s0676": [
    "Appearance means armies rise, great flood.",
    "Appearance: armies and great flood."
  ],
  "s0677": [
    "Governing sweeping away—removing old and spreading new.",
    "Governing sweeping—removing old, spreading new."
  ],
  "s0678": [
    "Have five colors, each according to five phases' native essences governed.",
    "Five colors by five phases' essences."
  ],
  "s0679": [
    "The Record Officer notes: comet bodies have no light; attached to the sun they have light—therefore seen at dusk pointing east, at dawn pointing west; north or south of the sun, all follow sunlight in pointing.",
    "Comets borrow sunlight—dusk east, dawn west."
  ],
  "s0680": [
    "Halting and breaking their rays, sometimes long sometimes short—where rays reach is calamity.",
    "Halting rays, long or short—calamity where rays reach."
  ],
  "s0681": [
    "Also: Broom Star, comet category.",
    "Also: Broom Star, comet category."
  ],
  "s0682": [
    "Pointing obliquely is comet; ray qi spreading four directions is broom.",
    "Oblique pointing: comet; rays four directions: broom."
  ],
  "s0683": [
    "Broom means broom-like anomaly—born of wicked qi.",
    "Broom: anomalous wicked qi."
  ],
  "s0684": [
    "If not great internal chaos, then great external armies; realm conspires together, dark and obscured, harm occurs.",
    "Without internal chaos, external armies; conspiracy and harm."
  ],
  "s0685": [
    "Master Yan said: \"If the lord does not reform, the broom star will emerge—why fear comets?\"",
    "Master Yan: \"Without reform, broom star emerges—why fear comets?\""
  ],
  "s0686": [
    "From this speaking—calamity exceeds comets.",
    "Thus broom calamity exceeds comets."
  ],
  "s0687": [
    "Year Star's essence flows into Celestial Pestle, Celestial Spear, Celestial Mischief, Celestial Rush, State Sovereign, Reverse Ascent.",
    "Year Star's essence: Pestle, Spear, Mischief, Rush, State Sovereign, Reverse Ascent."
  ],
  "s0688": [
    "One is Celestial Pestle—also called Awakening Star, or Celestial Frame.",
    "One: Celestial Pestle—Awakening Star or Celestial Frame."
  ],
  "s0689": [
    "Originally star-like, finally sharp, four zhang long.",
    "Star-like head, sharp tail, four zhang."
  ],
  "s0690": [
    "Governing destroying armies, governing fierce contention.",
    "Destroying armies, fierce contention."
  ],
  "s0691": [
    "Also: Celestial Pestle emerging—that state is inauspicious; do not raise armies.",
    "Pestle emerging: inauspicious state—no armies."
  ],
  "s0692": [
    "Also: term three months—certainly broken army and captured city.",
    "Three months: broken army, captured city."
  ],
  "s0693": [
    "Also: Celestial Pestle seen—queen consort holds affairs.",
    "Pestle seen: queen holds affairs."
  ],
  "s0694": [
    "Its root is the master.",
    "Its root is the master."
  ],
  "s0695": [
    "Two is Celestial Spear, governing capture and restraint.",
    "Two: Celestial Spear—capture and restraint."
  ],
  "s0696": [
    "Or: Coiling Cloud like ox, Spear Cloud like horse.",
    "Or: Coiling Cloud like ox, Spear Cloud like horse."
  ],
  "s0697": [
    "Or: like spear, left and right sharp, several zhang long.",
    "Or: spear-like, sharp left and right, several zhang."
  ],
  "s0698": [
    "Celestial Coiling originally star-like, finally sharp, one zhang long.",
    "Celestial Coiling: star head, sharp tail, one zhang."
  ],
  "s0699": [
    "Three is Celestial Mischief, governing summoning chaos.",
    "Three: Celestial Mischief—summoning chaos."
  ],
  "s0700": [
    "Also: human lord self-indulgent, violating Heaven and violently treating things—Celestial Mischief rises.",
    "Self-indulgent lord violating Heaven: Celestial Mischief rises."
  ]
};
const p=process.argv[2];if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8'));let c=0;
for(const s of d.sentences){if(T[s.id]){s.literal=T[s.id][0];s.idiomatic=T[s.id][1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');console.log('Patch count: '+c);
if(c!==Object.keys(T).length)process.exitCode=1;
