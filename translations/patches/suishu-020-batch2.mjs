#!/usr/bin/env node
import fs from 'node:fs';
const T = {
  s0101: ['Eastern Wall has two stars—governing literature and the secret treasury of books and maps under Heaven, and also earthwork.', 'Eastern Wall\'s two stars govern literature and the realm\'s secret archive of books and maps, and also earthworks.'],
  s0102: ['If the stars are bright, kings rise, the Way of learning flourishes, and the state has many gentlemen.', 'Bright stars mean rising kings, flourishing learning, and many worthy men in the realm.'],
  s0103: ['If the stars lose color and differ in size, the king loves warfare, scholars are not employed, and books are hidden away.', 'Discolored, uneven stars mean a war-loving king, neglected scholars, and hidden libraries.'],
  s0104: ['If the stars move, there is earthwork.', 'Movement brings earthworks.'],
  s0105: ['If they scatter and gather, there are fields and dwellings affairs.', 'Scattering and gathering mean land and housing matters.'],
  s0106: ['The West: Strider has sixteen stars—the Celestial Armory.', 'In the west, Strider\'s sixteen stars form the Celestial Armory.'],
  s0107: ['It is also called the Celestial Boar and also the Enclosed Boar.', 'Also called the Celestial Boar—or the Enclosed Boar.'],
  s0108: ['It governs restraining violence by arms and also governs ditches and channels.', 'It restrains violence by force and governs ditches and waterways.'],
  s0109: ['The great star in the southwest is the so-called Celestial Boar\'s Eye—also called the Great General; it should be bright.', 'The great southwestern star is the Celestial Boar\'s Eye—also the Great General—and should shine bright.'],
  s0110: ['If the emperor is dissolute and government is unjust, Strider shows horns.', 'When the emperor is dissolute and rule is unjust, Strider grows horns.'],
  s0111: ['If the horns move, armies rise; within the year, or there are ditch and channel affairs.', 'Moving horns bring war within the year—or ditch and channel works.'],
  s0112: ['It is also said: if stars within Strider are bright, great floods come.', 'Also: bright stars within Strider mean great floods.'],
  s0113: ['Bond has three stars—the Celestial Prison, governing parks, herds, and sacrificial victims for suburban rites, and also raising armies and gathering multitudes.', 'Bond\'s three stars form the Celestial Prison, governing parks, livestock, suburban sacrifices, and mustering armies.'],
  s0114: ['If the stars are bright, the realm is peaceful, suburban rites are grandly performed, and there are many descendants.', 'Bright stars mean peace, grand suburban rites, and many heirs.'],
  s0115: ['If they move, multitudes gather.', 'Movement means mass gatherings.'],
  s0116: ['If the stars stand straight, there is one who holds the sovereign\'s command.', 'Straight stars mean someone holds the sovereign\'s mandate.'],
  s0117: ['If they gather close, the state is unsettled.', 'Gathering close means national unrest.'],
  s0118: ['Stomach has three stars—the Celestial Kitchen Store, the granary of the five grains.', 'Stomach\'s three stars are the Celestial Kitchen Store—the granary of the five grains.'],
  s0119: ['If bright, there is peace and full granaries; if they move, there is transport of supplies; if they gather, grain is costly and people flee.', 'Bright stars mean peace and full stores; movement, supply transport; gathering, dear grain and flight.'],
  s0120: ['Hairy Head has seven stars—the ears and eyes of Heaven, governing the west and prison affairs.', 'Hairy Head\'s seven stars are Heaven\'s ears and eyes, governing the west and prisons.'],
  s0121: ['It is also the Battle Standard—the star of the Hu.', 'It is also the Battle Standard—the Hu peoples\' star.'],
  s0122: ['It also governs mourning.', 'It also governs mourning.'],
  s0123: ['Between Hairy Head and Net is the Celestial Street: when the Son of Heaven goes forth, the battle standard and Net complete the vanguard—this is the meaning.', 'Between Hairy Head and Net lies the Celestial Street: when the Son of Heaven rides out, the battle standard and Net lead the vanguard.'],
  s0124: ['The Yellow Path passes through it.', 'The ecliptic runs through it.'],
  s0125: ['If Hairy Head is bright, prisons under Heaven are settled.', 'Bright Hairy Head means prisons are at peace throughout the realm.'],
  s0126: ['If all six Hairy Head stars are bright and equal to the great star, great flood.', 'If six stars match the great star in brightness, great flood.'],
  s0127: ['If the seven stars turn yellow, armies rise greatly.', 'Yellow seven stars mean war on a vast scale.'],
  s0128: ['If one star vanishes, there is war and mourning.', 'A vanished star brings war and mourning.'],
  s0129: ['If they tremble, great ministers are imprisoned and there is a gathering in white.', 'Trembling stars mean imprisoned ministers and a white-clad assembly.'],
  s0130: ['If large and all move as if leaping, Hu armies rise greatly.', 'Large, leaping stars mean massive Hu armies.'],
  s0131: ['If one star leaps alone while the rest do not move, the Hu intend to raid the border.', 'One leaping star alone means the Hu plan border raids.'],
  s0132: ['Net has eight stars—governing frontier armies and hunting with bow.', 'Net\'s eight stars govern frontier armies and archery hunts.'],
  s0133: ['Its great star is called Celestial Height—also the Frontier General, governing the wardens of the four barbarians.', 'Its great star is Celestial Height—also the Frontier General, warden of the four barbarians.'],
  s0134: ['If the stars are bright and large, distant tribes come with tribute and the realm is at peace.', 'Bright, large stars mean distant tribute and peace.'],
  s0135: ['If they lose color, the frontier falls into chaos.', 'Discolored stars mean frontier disorder.'],
  s0136: ['If one star vanishes, there is war and mourning.', 'A vanished star brings war and mourning.'],
  s0137: ['If they tremble, frontier garrisons rise in arms and there are slanderous ministers.', 'Trembling stars mean frontier war and slanderous ministers.'],
  s0138: ['If they scatter, prisons under Heaven fall into chaos.', 'Scattering means chaos in prisons throughout the realm.'],
  s0139: ['If they gather, laws are harsh.', 'Gathering means cruel laws.'],
  s0140: ['Attached Ear is one star beneath Net—governing hearing of gain and loss, watching for faults and wickedness, and detecting ill omens.', 'Attached Ear, one star below Net, hears gain and loss, watches for wickedness, and detects ill omens.'],
  s0141: ['If the star flourishes, the central realm weakens, there are bandits, frontier alarms, foreign revolt, and armies clash year after year.', 'A flourishing star weakens the center, brings bandits, frontier alarms, foreign revolt, and years of war.'],
  s0142: ['If it moves, flattery and slander flourish, armies rise greatly, especially on the frontier.', 'Movement brings flattery, slander, and especially frontier war.'],
  s0143: ['When the moon lodges in Net, much rain.', 'Moon in Net brings heavy rain.'],
  s0144: ['Turtle Beak has three stars—the outpost of the three armies, the storehouse of marching armies, governing encampments and troops, gathering all things.', 'Turtle Beak\'s three stars are the three armies\' outpost and marching storehouse, governing encampments and gathering all things.'],
  s0145: ['If bright, army stores are full and generals gain power.', 'Bright stars mean full army stores and powerful generals.'],
  s0146: ['If they move and are bright, bandits roam in groups and encampments rise.', 'Moving bright stars mean bandit bands and rising encampments.'],
  s0147: ['If they shift, a general will be driven out.', 'Shifting stars mean a general\'s expulsion.'],
  s0148: ['Three Stars has ten stars—also called Three Stars\' Punishment, Great Mark, Celestial Market, and Axe and Halberd, governing cutting down and reaping.', 'Three Stars\' ten stars are also Punishment, Great Mark, Celestial Market, and Axe and Halberd, governing execution and reaping.'],
  s0149: ['It is also the Celestial Prison, governing killing and punishment.', 'Also the Celestial Prison, governing execution and punishment.'],
  s0150: ['It also governs the balance—by which things are weighed and settled.', 'It also holds the balance by which justice is weighed.'],
  s0151: ['It also governs the frontier city and the nine interpreters—therefore one does not wish it to move.', 'It also governs frontier cities and the nine interpreters—hence it should not move.'],
  s0152: ['Three Stars is the body of the White Beast.', 'Three Stars is the White Beast\'s body.'],
  s0153: ['Three stars in the middle lie crosswise—the three generals.', 'Three stars crosswise in the center are the three generals.'],
  s0154: ['The northeast is called the Left Shoulder, governing the Left General.', 'The northeast is the Left Shoulder—the Left General.'],
  s0155: ['The northwest is called the Right Shoulder, governing the Right General.', 'The northwest is the Right Shoulder—the Right General.'],
  s0156: ['The southeast is called the Left Foot, governing the Rear General.', 'The southeast is the Left Foot—the Rear General.'],
  s0157: ['The southwest is called the Right Foot, governing the Flank General.', 'The southwest is the Right Foot—the Flank General.'],
  s0158: ['Thus the Yellow Emperor\'s divination text says Three Stars corresponds to seven generals.', 'The Yellow Emperor\'s omen text says Three Stars images seven generals.'],
  s0159: ['Three small stars in the center are called Punishment—the Celestial Commandant, governing the lands of Hu, Xianbei, and the northern tribes; therefore one does not wish them bright.', 'Three central small stars are Punishment—the Celestial Commandant over Hu, Xianbei, and northern tribes; they should not shine bright.'],
  s0160: ['If all seven generals are bright and large, armies under Heaven are strong.', 'Bright, large seven generals mean strong armies throughout the realm.'],
  s0161: ['If the royal Way is lacking, horned rays spread wide.', 'A failing royal Way spreads horned rays wide.'],
  s0162: ['If Punishment stars are as bright as Three Stars, all great ministers plot and armies rise.', 'Punishment matching Three Stars in brightness means ministerial plots and war.'],
  s0163: ['If Three Stars lose color, armies scatter.', 'Discolored Three Stars mean scattered armies.'],
  s0164: ['If Three Stars\' horned rays tremble, frontier alarms are urgent and armies rise under Heaven.', 'Trembling horned Three Stars mean urgent frontier alarms and realm-wide war.'],
  s0165: ['It is also said: there are affairs of execution and punishment.', 'Also: execution and punishment are at hand.'],
  s0166: ['If Three Stars shift, guests attack the host.', 'Shifting Three Stars mean guests strike the host.'],
  s0167: ['If Three Stars\' left foot enters the Jade Well, armies rise greatly, Qin suffers great flood, or there is mourning, and mountains and stones show strange signs.', 'If the left foot enters the Jade Well, great armies rise, Qin floods, mourning comes, and mountains and stones turn strange.'],
  s0168: ['If Three Stars are irregular and skewed, royal ministers are disloyal.', 'Irregular, skewed Three Stars mean disloyal ministers.'],
  s0169: ['The South: Eastern Well has eight stars—the Southern Gate of Heaven, where the Yellow Path passes, Heaven\'s lookout post.', 'In the south, Eastern Well\'s eight stars are Heaven\'s Southern Gate, on the ecliptic—Heaven\'s lookout.'],
  s0170: ['It governs water-balance affairs—the standard by which laws are weighed.', 'It governs water-balance affairs—the standard for weighing laws.'],
  s0171: ['If the king employs law fairly, Well stars are bright and stand upright in row.', 'Fair law makes Well stars bright and upright in row.'],
  s0172: ['Axe is one star attached before the Well—governing watching for excess and dissipation and executing it; therefore one does not wish it bright.', 'Axe, one star before the Well, watches for excess and executes it—hence it should not shine bright.'],
  s0173: ['If bright and level with the Well, the axe is used—great ministers are executed, for the desire to kill.', 'Bright and level with the Well, the axe falls—ministers die by the urge to kill.'],
  s0174: ['When the moon lodges in the Well, there is wind and rain.', 'Moon in the Well brings wind and rain.'],
  s0175: ['Carriage Ghost has five stars—the Eye of Heaven, governing sight and discerning treacherous plots.', 'Carriage Ghost\'s five stars are Heaven\'s Eye, discerning treacherous plots.'],
  s0176: ['The northeast star governs stored horses; the southeast, stored armies; the southwest, stored cloth and silk; the northwest, stored gold and jade—take omens according to their changes.', 'Northeast stores horses; southeast, armies; southwest, cloth; northwest, gold and jade—read omens from their changes.'],
  s0177: ['The center is Stored Corpses, governing death, mourning, and sacrifice.', 'The center is Stored Corpses, governing death, mourning, and sacrifice.'],
  s0178: ['One is called Axe and Anvil, governing execution.', 'One is Axe and Anvil, governing execution.'],
  s0179: ['If Ghost stars are bright and large, grain ripens.', 'Bright, large Ghost stars mean ripe grain.'],
  s0180: ['If not bright, people scatter.', 'Dim stars mean scattered people.'],
  s0181: ['If they move and shine, taxes are heavy and corvée labor is many.', 'Moving, shining stars mean heavy taxes and much corvée.'],
  s0182: ['If the stars shift, people grieve and edicts are urgent.', 'Shifting stars bring popular grief and urgent edicts.'],
  s0183: ['Ghost and Anvil should be hazy and not bright for peace; if bright, armies rise and great ministers are executed.', 'Ghost and Anvil should be hazy for peace; if bright, war comes and ministers die.'],
  s0184: ['Willow has eight stars—the Celestial Kitchen Steward, governing the imperial kitchen and blending flavors, and also governing thunder and rain; if the queen is arrogant and extravagant.', 'Willow\'s eight stars are the Celestial Kitchen Steward, governing imperial cuisine, flavors, thunder, and rain—and an arrogant queen.'],
  s0185: ['One is called the Celestial Minister; one the Celestial Storehouse; one the Conduit; it also governs woodwork.', 'One is the Celestial Minister; one the Celestial Storehouse; one the Conduit; it also governs woodwork.'],
  s0186: ['If the stars are bright, great ministers are cautious, the state is secure, and kitchen provisions are complete.', 'Bright stars mean cautious ministers, a secure state, and full kitchens.'],
  s0187: ['If the Conduit raises its head, the king\'s command rises and assistants come forth.', 'If the Conduit lifts its head, royal commands issue and assistants emerge.'],
  s0188: ['If the stars stand straight, the realm plots to attack its lord.', 'Straight stars mean the realm plots against its lord.'],
  s0189: ['If the stars gather close, armies fill the state gates.', 'Gathering close means armies at the gates.'],
  s0190: ['Seven Stars has seven stars—also called the Celestial Capital, governing robes and embroidered patterns, and also urgent armies and guarding against bandits; therefore one wishes them bright.', 'Seven Stars\' seven stars are also the Celestial Capital, governing robes and embroidery, urgent armies, and bandit defense—they should shine bright.'],
  s0191: ['If the stars are bright, the royal Way flourishes; if dim, worthy men do not hold office, the realm is empty, and the Son of Heaven falls ill.', 'Bright stars mean a flourishing royal Way; dim stars, no worthy men, an empty realm, and a sick Son of Heaven.'],
  s0192: ['If they move, armies rise; if they scatter, government changes.', 'Movement brings war; scattering, change of government.'],
  s0193: ['Extended Net has six stars—governing precious treasures, what the ancestral temple uses and clothing, and also the Celestial Kitchen and affairs of food, drink, and rewards.', 'Extended Net\'s six stars govern treasures, temple goods and clothing, the Celestial Kitchen, and feasting and rewards.'],
  s0194: ['If the stars are bright, the king performs the five rites and obtains the center of Heaven.', 'Bright stars mean the king performs the five rites and holds Heaven\'s center.'],
  s0195: ['If they move, rewards are granted; if they scatter, rebels appear under Heaven; if they gather, there is war.', 'Movement brings rewards; scattering, rebels; gathering, war.'],
  s0196: ['Wings has twenty-two stars—the Celestial Music Bureau, governing entertainers and theatrical music, and also barbarian distant guests and guests from beyond the sea.', 'Wings\' twenty-two stars are the Celestial Music Bureau, governing performers and music, and also distant barbarian guests from beyond the sea.'],
  s0197: ['If the stars are bright and large, rites and music flourish and the four barbarians come as guests.', 'Bright, large stars mean flourishing rites and music and barbarian guests.'],
  s0198: ['If they move, barbarian envoys come; if they scatter, the Son of Heaven raises armies.', 'Movement brings barbarian envoys; scattering, the Son of Heaven\'s armies.'],
  s0199: ['Chariot has four stars—governing the Grand Minister and assisting ministers, chariots and cavalry, and bearing loads.', 'Chariot\'s four stars govern the Grand Minister and assistants, chariots and cavalry, and bearing loads.'],
  s0200: ['When armies go out or enter, all omens are taken from Chariot.', 'All omens of armies entering or leaving are read in Chariot.'],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error('Usage: node translations/patches/suishu-020-batch2.mjs <translation.json>');
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
