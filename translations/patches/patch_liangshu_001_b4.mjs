#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'How is it only Jia Yi weeping tears, or Xu Bo wailing at the appointed hour!',
    'This is not merely Jia Yi weeping for the realm, or Xu Bo\'s funeral lament—it goes far deeper!',
  ],
  s0302: [
    'Now the principle of order is newly renewed, government and punishments are properly placed; to rectify and reform lingering abuses—truly this is the day.',
    'Now governance begins anew, law and punishment are right again, and the moment to uproot old abuses has come.',
  ],
  s0303: [
    'Let all bureaus of the Secretariat be thoroughly inspected; for all unjust lawsuits during Dong Hun\'s time and cases where responsible officials delayed implementation without timely action, conduct careful inquiry and judgment, and memorial according to the facts."',
    '"Inspect every Secretariat bureau. For wrongful suits from Dong Hun\'s reign and officials who sat on cases without acting, investigate carefully and report findings for decision."',
  ],
  s0304: [
    'Another order: for righteous-army men who died in battle and those who died of illness, all were to receive burial at state expense and their orphaned survivors were to be cared for.',
    'He also ordered that righteous troops killed in battle or dead of sickness receive proper burial, with their orphans taken in and cared for.',
  ],
  s0305: [
    'Another edict read: "At the victory at Zhujue, for rebel dead who were sent forth—families are specially permitted funeral burial;',
    'Another edict said: "After the victory at Red Sparrow, the dead among the rebels may be claimed by their families for burial;',
  ],
  s0306: [
    'if there are no kin, or they are poor and destitute, the chief and assistant of the two counties shall immediately bury them.',
    'where there is no kin, or kin are too poor, the magistrates of both counties shall bury them at once.',
  ],
  s0307: [
    'Within Jiankang city, those who did not grasp Heaven\'s mandate and brought ruin upon themselves—shall be treated under the same rule."',
    'Within Jiankang, those who defied Heaven\'s decree and brought destruction on themselves fall under the same provision."',
  ],
  s0308: [
    'In the first month of the second year, the Son of Heaven sent Acting Attendant-in-Ordinary Xi Chuanwen and Acting Gentleman of the Yellow Gate Yue Facai to comfort and reassure the capital.',
    'In the first month of year two, the Emperor sent Xi Chuanwen and Yue Facai to console the capital.',
  ],
  s0309: [
    'Posthumously enfeoffed Gaozu\'s grandfather as Cavalier Attendant-in-Ordinary and Left Grand Master for Brightness; his father as Attendant-in-Ordinary and Chancellor.',
    'Gaozu\'s grandfather was posthumously made Cavalier Attendant-in-Ordinary and Left Grand Master for Brightness; his father, Attendant-in-Ordinary and Chancellor.',
  ],
  s0310: [
    'Gaozu issued an order: "He above transforms those below—the grass bends, the wind follows; whether an age runs thin or pure is always shaped from this.',
    'Gaozu ordered: "Those who rule set the tone for all below—grass bends where the wind blows, and an age\'s corruption or virtue begins here.',
  ],
  s0311: [
    'From Yongyuan\'s loss of virtue, records went unkept—utter villainy and extreme perversity, how could words encompass it?',
    'Since Yongyuan, virtue collapsed and records could scarcely keep pace—the cruelty and perversity beggar description.',
  ],
  s0312: [
    'Then the Xuan Chamber was built outside, palace treasures piled high, strange crafts and outlandish dress—exhausting what had never been seen.',
    'Palaces rose without end, inner treasuries overflowed, and bizarre arts and fashions appeared that none had ever seen.',
  ],
  s0313: [
    'Superiors were arrogant, inferiors violent; debauchery and extravagance raced one another.',
    'The high grew contemptuous, the low turned brutal, and debauchery and excess raced unchecked.',
  ],
  s0314: [
    'The nation\'s mandate and court power were wholly shifted to intimate favorites.',
    'State affairs and court authority fell entirely into the hands of cronies.',
  ],
  s0315: [
    'Offices were sold, ranks traded for cash; bribes walked openly in public.',
    'Offices and ranks went up for sale, and graft flourished in the open.',
  ],
  s0316: [
    'Together with mansions on grand avenues, tiered terraces and vast halls.',
    'Grand estates lined the main roads; tiered towers and sprawling halls multiplied.',
  ],
  s0317: [
    'Long sleeves swaying up and down, equal to the gifts of pacifying barbarians;',
    'Swishing sleeves like the gifts lavished on pacifying barbarians;',
  ],
  s0318: [
    'delicacies of a hundred kinds, like households that break ice for luxury.',
    'delicacies by the hundred, fit for households rich enough to cut ice in winter.',
  ],
  s0319: [
    'Simple folk followed suit; soaked through, it became custom.',
    'Common people took it up, and by degrees it hardened into custom.',
  ],
  s0320: [
    'Proud beauty vied in brilliance; boastful splendor outdid one another.',
    'Ostentation and glamour competed; each tried to outshine the next.',
  ],
  s0321: [
    'So far that market-stall households kept sable and fox in daily use;',
    'Even market families wore sable and fox fur;',
  ],
  s0322: [
    'sons of artisans and merchants robed themselves in brocade and embroidery.',
    'merchants\' and craftsmen\'s sons dressed in brocade and silk.',
  ],
  s0323: [
    'At sunset\'s turn they had not yet returned; at night\'s middle still abroad—at dawn\'s grey they looked for clear morning.',
    'They did not come home at dusk, nor by midnight; at grey dawn they still waited for morning light.',
  ],
  s0324: [
    'Sage brilliance inaugurated the age; keen resolve at the very start—though called succession to arms, it is nearly the same as founding anew.',
    'A sage ruler opens a new age and sharpens himself from the first day; though this is formally succession, it is almost a new founding.',
  ],
  s0325: [
    'Moreover after debauched spending came raising armies—Juqiao and Lutai, depletion not of one kind alone.',
    'After wasteful excess came war—like Juqiao\'s granaries and Lutai\'s treasuries emptied without end.',
  ],
  s0326: [
    'I unworthily bear great favor; my task is to clarify—to think how to uphold the imperial court\'s intent of great plain silk above, and below to toughen this humble person with the meaning of a deer-fur robe—loosen and restring, carve away ornament to plainness.',
    'I am unworthy of this great charge, yet my duty is to set things right—to honor the court\'s spirit of plain great silk, and in my own life the lesson of the deer-fur coat: loosen what binds, restring the bow, strip ornament back to simplicity.',
  ],
  s0327: [
    'Save what serves to offer sacrificial grain, repair insignia and coronets, practice ritual and music\'s forms, and maintain arms and armor—in all other collective expense, each item is forbidden and cut off.',
    'Apart from what serves sacrifice, ritual vestments, music and ceremony, or arming the troops, every other extravagance is abolished.',
  ],
  s0328: [
    'The imperial storehouses and inner offices—abolish or reduce as appropriate.',
    'Imperial warehouses and inner departments shall be cut back as fit.',
  ],
  s0329: [
    'The Rear Palace shall reduce the number of imperial concubines; the Grand Music Director shall cut off Zheng and Wei music.',
    'The palace will limit concubines; court music will ban licentious Zheng and Wei tunes.',
  ],
  s0330: [
    'Among these, where one can lead ministers and scholars by example, set the mark for the common people—plain food and thin dress—let it begin with me.',
    'Where I can lead officials and set an example for the people—simple fare and plain clothes—let it start with me.',
  ],
  s0331: [
    'Moreover with many talents walking in one track, and the nine officers all at their tasks—if men can devote themselves to retiring after meals, competing to keep restraint upon themselves, shifting wind and changing custom—perhaps in a month there will be achievement.',
    'With able men in post and every office working, if each guards against excess and holds himself to restraint, custom may turn within a month.',
  ],
  s0332: [
    'Formerly when Mao Jie was at court, scholars and officials dared not wear wasteful dress or eat beyond their due.',
    'Once Mao Jie served at court, officials dared not dress beyond their rank or eat beyond their share.',
  ],
  s0333: [
    'Cao Cao sighed: "My laws are not the equal of Minister Mao\'s.',
    'Cao Cao once sighed, "My rules fall short of Minister Mao\'s.',
  ],
  s0334: [
    '" Though my virtue falls short of past worthies and my burden is great before those who came first, I truly hope many officers will grasp this intent.',
    '" My own virtue cannot match the ancients and the burden is heavy, but I hope the realm\'s officers will share this resolve.',
  ],
  s0335: [
    'Externally, detailed regulations may be drawn up."',
    '"Let detailed rules be issued for all to follow."',
  ],
  s0336: [
    'On day wuxu, Empress Xuan of Virtue held court, entering and dwelling in the inner palace.',
    'On day wuxu, Empress Dowager Xuan took the regency from the inner palace.',
  ],
  s0337: [
    'The Emperor was appointed Grand Marshal; the provisional-regime authority was released; the hundred officials paid homage as before.',
    'Gaozu was confirmed as Grand Marshal, his provisional powers ended, and officials paid homage as before.',
  ],
  s0338: [
    'An edict advanced Gaozu to commander of all military affairs within and without, granted sword and shoes in the hall, no need to hurry entering court, and no personal name in ceremonial address.',
    'Gaozu was made supreme commander of all armies, with sword and shoes permitted in the throne room, no haste in court, and address without his personal name.',
  ],
  s0339: [
    'Added front and rear guard of feather-canopies and drum-and-pipe music.',
    'He was granted imperial escort with canopy and martial music, front and rear.',
  ],
  s0340: [
    'Left and Right Chief Clerks, Marshals, Attendant Gentlemen, aides, and clerks were each set at four, all recruiting scholars as of old; the rest remained as before.',
    'Four each were appointed as Left and Right Chief Clerks, Marshals, Attendant Gentlemen, aides, and clerks, recruited as before; other offices unchanged.',
  ],
  s0341: [
    'An edict read:',
    'The edict said:',
  ],
  s0342: [
    'Sun and moon adorn the sky—height and brightness therefore manifest virtue;',
    'Sun and moon crown the sky, and by their height and light virtue is shown;',
  ],
  s0343: [
    'mountains and peaks mark the earth—gentleness and breadth therefore accomplish achievement.',
    'mountains stand upon the earth, and through their breadth and steadfastness deeds are done.',
  ],
  s0344: [
    'Thus the myriad things emerge and draw their beginning from them; rivers and seas surge yet do not spill over.',
    'From this the ten thousand things arise and take their start; rivers and seas heave yet do not burst their bounds.',
  ],
  s0345: [
    'The two signs are constantly observed; human beings stand in their place.',
    'Heaven and earth hold their course, and humanity stands as their heir.',
  ],
  s0346: [
    'Hence the Seven Assistants and Four Uncles brought non-action to Xuanyuan and Haohao;',
    'Thus the Seven Assists and Four Uncles brought effortless rule to the Yellow Emperor and Emperor Yao;',
  ],
  s0347: [
    'Wei, Peng, Qi, and Jin quieted decline and disorder in Yin and Zhou.',
    'Wei, Peng, Qi, and Jin stilled chaos in the Yin and Zhou dynasties.',
  ],
  s0348: [
    'Grand Marshal You was unbridled from Heaven, embodying such complete sageliness—literary accomplishment harmonizing the Nine Achievements, military virtue embracing the Seven Moral Powers.',
    'Grand Marshal You was heaven-sent in gifts, wholly sage in nature—literary virtue completing the Nine Works, martial virtue holding the Seven Powers.',
  ],
  s0349: [
    'Reverently considering his beginning, fine policies were planted early; sincerity showed in hardship, achievement shared the command tent.',
    'From the first his fine counsel took root; his loyalty proved in hardship and his merit was won within the command tent.',
  ],
  s0350: [
    'Gifts of tax lands were granted to open his fief, thus displaying his merit.',
    'Tax lands were granted to mark his worth.',
  ],
  s0351: [
    'When Jianwu began its reign, border gaps opened repeatedly; the Duke set aside books and ceased lectures, managing the four directions.',
    'When the Jianwu era opened, the frontiers flared again; the Duke laid aside his books and took up the four quarters.',
  ],
  s0352: [
    'Si and Yu hung in peril, Fan and Han in deadly danger—overturning fierce enemies on the Mian\'s banks, stiffening barbarian horses at Deng\'s mouth.',
    'Si and Yu teetered, Fan and Han were near ruin—he crushed strong foes on the Han River and froze the barbarian cavalry at Deng\'s ford.',
  ],
  s0353: [
    'Yongyuan first took its name; troubles knotted the vile band—monopolizing power, arbitrary in cruelty, poison reaching all living souls; all under Heaven trembled, life hanging by the sundial\'s moments.',
    'When Yongyuan began, villains gathered power, cruel and unchecked, poison spread to every living soul, all Heaven trembled, and men\'s lives hung by moments.',
  ],
  s0354: [
    'When evil ends there is a term; divine counsel arose in support—first establishing the great strategy, renewing the tripod throne.',
    'Darkness at last had its limit; heaven\'s counsel rose with him—first to frame the great plan and renew the dynasty.',
  ],
  s0355: [
    'He flung his sleeves to aid the king, sped along the current like lightning—Luzhou\'s walls dispersed like clouds, Xia\'s mouth cleared like mist parting; at Jiahu the bandits, one drumstroke exterminated; at Gushu the linked banners, in a flash melted like ice.',
    'He rallied to rescue the throne, racing downstream like lightning—Luzhou fell like clouds scattering, Xia\'s mouth cleared like lifted fog; at Jiahu the bandits were crushed in one assault, at Gushu their banners melted like ice in spring.',
  ],
  s0356: [
    'Taking Xinyu fortress was like picking up a mustard seed; storming Zhujue was still like sweeping dust.',
    'Xinyu fell as easily as lifting a mustard seed; Zhujue was seized as lightly as sweeping dust.',
  ],
  s0357: [
    'Thunder and lightning struck outward in alarm; the palace gates inward collapsed—the remaining villains, fine worms, ant larvae all to be utterly destroyed.',
    'Thunder struck outward in terror, the palace swayed within, and every remnant vermin was stamped out to the last.',
  ],
  s0358: [
    'Saving those already drowning, releasing those upside-down suspended—joy on the roads, clapping in the lanes, from near reaching far.',
    'He pulled the drowning from the water and cut the bound free from the beam—roads rang with joy and lanes with clapping, from the capital outward.',
  ],
  s0359: [
    'The capital region was mild and tranquil, the outer lands solemn and peaceful—this cruel net was released, covered with lenient government.',
    'The heartland grew calm, the frontiers quiet; the tyrant\'s snares were cut and gentler rule spread.',
  ],
  s0360: [
    'Accumulated abuses of exhausted darkness—in one morning broadly cleared; voice and teaching reached far in gradual spread, no thought unreached.',
    'Ages of rot were cleared in a single day; his voice and teaching reached far, and no heart was left untouched.',
  ],
  s0361: [
    'Though Yi Yin\'s holding to this single virtue, and the Duke of Zhou\'s light upon the four seas—compared with this, how could they not be dismissed as nothing?',
    'Even Yi Yin\'s single-minded virtue and the Duke of Zhou\'s light over the four seas pale beside this.',
  ],
  s0362: [
    'Formerly Lü Wang aided and assisted the sage ruler, yet still enjoyed the command of four domains;',
    'Once Lü Wang served the sage king, he still received command over four regions;',
  ],
  s0363: [
    'Marquis Wen achieved merit in pacifying the empress, yet still bore the gift of two bows—how much more for overflowing virtue and founding merit, surpassing the ancients.',
    'Marquis Wen earned merit pacifying the realm yet still received two bows as reward—how much more for virtue and achievement that outstrip all former ages.',
  ],
  s0364: [
    'The black-haired people trembled, waiting on him as their life; saving what was already done, rescuing what was about to be severed, marking gates and tombs with honor—none could compare;',
    'The people looked to him for life itself—rescuing the doomed, saving what was already lost, honoring the worthy at gate and grave—none could match this;',
  ],
  s0365: [
    'yet the great chariot and raised gate were paused and not granted; mindful of former instruction, not forgetting even at the final meal.',
    'yet the highest honors were held back; remembering ancient precedent, he did not forget even over a single meal.',
  ],
  s0366: [
    'It is fitting respectfully to ascend the great ceremony, truly fulfilling the multitude\'s hopes.',
    'It is right to raise him to the supreme rite and satisfy the people\'s longing.',
  ],
  s0367: [
    'Let him advance to Chancellor, overseeing the hundred affairs, and Governor of Yangzhou;',
    'He shall be promoted to Chancellor, head of all government, and Governor of Yangzhou;',
  ],
  s0368: [
    'enfeoff ten commanderies as Duke of Liang, complete with the Nine Bestowments rites, add seal-ribbon and the Far-Wandering cap, rank above all princes, and add the Chancellor\'s green-and-yellow cord.',
    'granted ten commanderies as Duke of Liang with full Nine Bestowments, the seal-ribbon and Far-Wandering cap, rank above all princes, and the Chancellor\'s green-and-yellow sash.',
  ],
  s0369: [
    'His General of Agile Cavalry remains as before.',
    'He retains his post as General of Agile Cavalry.',
  ],
  s0370: [
    'Establish the Liang bureaus as of old.',
    'The Liang administrative offices shall be set up as before.',
  ],
  s0371: [
    'The investiture decree read:',
    'The formal decree said:',
  ],
  s0372: [
    'Heaven and earth stand in silence, yin and yang passing in turn through cold and heat; the three powers jointly employed, relying on humanity established as treasure—thus able to give form to the myriad things, upholding Heaven\'s work in their place.',
    'Heaven and earth endure in stillness, seasons turning through cold and heat; the three realms work together, and humanity is their treasure—shaping the ten thousand things and standing in for Heaven\'s craft.',
  ],
  s0373: [
    'Truly this chief minister, responding to the age and standing forth in excellence, completing Heaven and earth\'s achievement, secretly harmonizing with the divine spirits\' virtue.',
    'This chief minister rose to meet the age, completing heaven and earth\'s work and moving in secret accord with the gods.',
  ],
  s0374: [
    'Setting chaos aright and restoring order, saving the age and settling the people—glorious deeds shining upon the realm of the Way, great merit shaking the lands beyond, though Yi Zhi\'s safeguarding of the royal house and the Duke of Zhou\'s possession of this great instruction—compared with this, how could they not be dismissed as nothing?',
    'He set chaos right, saved the age, and settled the people—glory for the realm, renown beyond the borders; even Yi Zhi guarding the royal house and the Duke of Zhou\'s great teaching pale beside him.',
  ],
  s0375: [
    'Now I shall confer upon the Duke the canonical decree—reverently hear my command:',
    'Now I invest the Duke with the formal decree—hear and obey:',
  ],
  s0376: [
    'Heaven did not preserve; disaster struck the imperial house—the Founding Emperor with early brilliance perished young, the Heir Emperor with benevolent virtue left no successor, the High Emperor inherited the line yet the throne was not long held; though toiling day and night, flourishing peace was not achieved.',
    'Heaven withheld its favor; calamity fell on the royal house—the Founding Emperor died young in his brilliance, the Heir Emperor left no son of virtue, the High Emperor took the throne but did not long hold it; though he labored day and night, lasting peace never came.',
  ],
  s0377: [
    'The succeeding ruler was benighted and violent, records unseen.',
    'The heir was brutal and blind, beyond what records can tell.',
  ],
  s0378: [
    'Court power and the nation\'s handle were entrusted to a clique of women.',
    'Court authority and the nation\'s reins passed into the hands of a faction of women.',
  ],
  s0379: [
    'They slaughtered the loyal and worthy, destroyed the terrace ministers; bearing wrongs and clutching pain, not a mouthful of kind left.',
    'They butchered loyal men and killed high ministers; the wronged and grieving were wiped out to the last mouth.',
  ],
  s0380: [
    'Truly many and not one—all monopolizing the nation\'s command.',
    'Many were they, and not one alone—all seized the nation\'s power.',
  ],
  s0381: [
    'A frown or smile brought disaster; the slightest grudge reached ruin.',
    'A smile or frown brought calamity; the smallest slight brought destruction.',
  ],
  s0382: [
    'Harsh law and poisonous taxation left house after house; all under Heaven burned, nowhere to set one\'s body.',
    'Cruel law and crushing taxes emptied every household; all Heaven scorched, and men had nowhere to stand.',
  ],
  s0383: [
    'Necks wronged, they took their own lives; trees by the road stood in rows of the dead—near or far, crying to Heaven with none to hear.',
    'The wronged cut their own throats; corpses hung from roadside trees near and far, crying to Heaven with no one to answer.',
  ],
  s0384: [
    'The Duke, relying on the term of darkness and brightness, following the hundred thousand people\'s wish, leading the host of lords, assisted in completing the restoration.',
    'The Duke seized the turning of dark to light, answered the people\'s prayer, rallied the lords, and helped restore the dynasty.',
  ],
  s0385: [
    'The altars\' peril was already firm, Heaven and humanity\'s hope truly fulfilled—this truly is the Duke tying up our broken net, greatly creating the imperial house.',
    'The altars were saved, Heaven and earth\'s wish fulfilled—this is the Duke who mended our broken bonds and remade the royal house.',
  ],
  s0386: [
    'In the late Yongming years, border gaps opened wide; the Jing and He regional commanders invited in barbarians from the wilds—Jiang and Huai were disturbed and pressed, the situation like treading a tiger.',
    'Late in Yongming the frontiers burst open; commanders of Jing and He invited barbarians in—Jiang and Huai shook under threat, as if walking on a tiger\'s back.',
  ],
  s0387: [
    'The Duke received orders from the court, led light troops in swift attack, restrained them with long calculation, controlled them within the circle.',
    'Ordered by the court, he led light forces in a swift strike, held them with long strategy, and contained them within his grasp.',
  ],
  s0388: [
    'Braving danger and braving peril, strong and soft used in turn—one region stood tranquil, again becoming a frontier domain.',
    'He braved every danger, shifting between force and forbearance—one region grew calm and again bowed as a vassal frontier.',
  ],
  s0389: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0390: [
    'In former Longchang, the great foundation was already spent; the High Emperor deeply considered the altars and was about to employ expedient means.',
    'In Longchang the dynasty\'s base was already spent; the High Emperor, fearing for the altars, prepared to act by necessity.',
  ],
  s0391: [
    'The Duke fixed strategy within the command tent, rousing great integrity, deposing the emperor and establishing the king—counsel deeply manifest.',
    'The Duke decided policy in the tent, upheld great principle, deposed one emperor and raised another—his counsel shone clear.',
  ],
  s0392: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0393: [
    'Jianwu opened its enterprise; though its plans were far-reaching, barbarians invaded within, leaning on passes and barriers—Si Province hung in peril, fall imminent within days.',
    'Jianwu began its rule with far-reaching plans, yet barbarians invaded the passes—Si Province teetered on the brink of fall.',
  ],
  s0394: [
    'The Duke ordered troops for external campaign, rolled armor and rode far, met the foe and joined battle—lightning strike, wind sweep, crushing the hard and overturning the sharp, water choked and plains stained; captives taken at the Elephant Gate, severed ears offered at the sea\'s edge, huts burned and tents destroyed, wailing as they spoke of return.',
    'The Duke marched out to war, armor rolled and horses driven far—he met the enemy, struck like lightning, swept like wind, broke the strong and crushed the sharp, choked streams and stained the plains; he took prisoners at the Elephant Gate, offered severed ears at the sea\'s edge, burned camps and destroyed tents, and the foe wailed homeward.',
  ],
  s0395: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
  s0396: [
    'Fan and Han hung on the brink; urgent dispatches came in succession.',
    'Fan and Han stood on the edge of ruin; urgent reports arrived one after another.',
  ],
  s0397: [
    'The Duke at star-rise marshaled troops, received orders and marched forth—yet military plans and campaign command were matters not of his own issuing; fine strategies and excellent counsel were suppressed and not granted.',
    'The Duke mustered his army at dawn and marched on orders—yet strategy and command were not his to decide; good counsel was offered and refused.',
  ],
  s0398: [
    'At the battle of Dengcheng, barbarian horses suddenly arrived; the commander secretly reached the field and gave no report—armor cast off, troops abandoned, fed to the tiger\'s mouth.',
    'At Dengcheng barbarian cavalry struck without warning; the commander slipped in unseen and gave no word—armor was cast aside, troops abandoned, and men fed to the tiger\'s maw.',
  ],
  s0399: [
    'The Duke southward gathered scattered soldiers, northward resisted the carved cavalry—preserving the host in ordered ranks, tracing the road and returning slowly, saving our border peril, again obtaining peace and security.',
    'The Duke gathered the scattered in the south and held the barbarian horse in the north—kept the army intact, withdrew in good order, saved the frontier, and restored peace.',
  ],
  s0400: [
    'This too is the Duke\'s achievement.',
    'This too was the Duke\'s merit.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b4.mjs <translation.json>'
  );
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
