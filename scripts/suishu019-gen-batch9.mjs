#!/usr/bin/env node
/** Generate suishu-019 batches 9-12 (s0801-s1133) */
import fs from 'node:fs';

const batches = {
  9: { start: 's0801', end: 's0900' },
  10: { start: 's0901', end: 's1000' },
  11: { start: 's1001', end: 's1100' },
  12: { start: 's1101', end: 's1133' },
};

const T = {
  s0801: ['The second star is the deputy general; north of it is the Central West Gate.', 'Second is deputy general; north is the Central West Gate.'],
  s0802: ['The third is the deputy minister; north of it is the Western Moon Gate.', 'Third is deputy minister; north is the Western Moon Gate.'],
  s0803: ['The fourth star is the chief minister.', 'Fourth is the chief minister.'],
  s0804: ['These are also the Four Assistants.', 'These too are the Four Assistants.'],
  s0805: ['If the eastern and western bastions show rays or wavering, feudal lords plot against the Son of Heaven.', 'Rays or motion in east and west bastions mean lords plot against the throne.'],
  s0806: ['If the enforcers shift, punishments become especially harsh.', 'Shifting enforcers bring especially harsh punishments.'],
  s0807: ['If the moon or five planets strike the central seat, punishment is executed.', 'Moon or five planets hitting the central seat bring execution.'],
  s0808: ['If the moon or five planets enter the Supreme Palace orbit, auspicious.', 'Moon or five planets entering the Supreme Palace orbit are auspicious.'],
  s0809: ['Three stars outside the southwest corner are called the Bright Hall—the Son of Heaven\'s palace of promulgating government.', 'Three stars beyond the southwest corner are the Bright Hall, where the Son of Heaven promulgates policy.'],
  s0810: ['Three stars west of the Bright Hall are called the Spirit Terrace—the observation tower.', 'West of the Bright Hall are three Spirit Terrace stars, the observation tower.'],
  s0811: ['It governs observing clouds and phenomena, inspecting auspicious tokens, and watching for disasters and changes.', 'It oversees cloud signs, auspicious portents, and calamities.'],
  s0812: ['One star northeast of the Left Enforcer is called the Usher; it receives guests.', 'Northeast of the Left Enforcer is the Usher, receiving guests.'],
  s0813: ['Three stars northeast of the Usher are called the Inner Seats of the Three Dukes—where court assembly dwells.', 'Three stars northeast of the Usher are the Inner Three Dukes\' seats for court assembly.'],
  s0814: ['Three stars north of the Three Dukes are called the Inner Seats of the Nine Ministers, governing all affairs.', 'North of the Three Dukes are the Inner Nine Ministers, managing all business.'],
  s0815: ['Five stars west of the Nine Ministers are called the Inner Five Feudal Lords—attending the Son of Heaven within and not going to their states.', 'Five stars west of the Nine Ministers are Inner Feudal Lords who attend court and do not rule abroad.'],
  s0816: ['When the Piyong rites are fulfilled, the Supreme Palace feudal lords shine.', 'When Piyong rites are correct, the Supreme Palace lords\' stars are bright.'],
  s0817: ['One star, the Seat of the Yellow Emperor, is within the Supreme Palace—the spirit containing pivot and hub.', 'Within the Supreme Palace is the Yellow Emperor\'s Seat, spirit of pivot and hub.'],
  s0818: ['If the Son of Heaven moves attaining Heaven\'s measure and Earth\'s intent, at ease on the middle Way, the Five Emperors\' seats in the Supreme Palace shine bright.', 'When the ruler attains Heaven\'s measure and Earth\'s intent along the middle Way, the Five Emperors\' seats blaze bright.'],
  s0819: ['If the Yellow Emperor\'s Seat is dim, the ruler seeks worthy men to assist the law; otherwise he loses power.', 'A dim Yellow Emperor\'s Seat makes the ruler seek worthy aides—or lose power.'],
  s0820: ['It is also said: if the Supreme Palace\'s five seats are small, weak, and blackish, the Son of Heaven\'s state perishes.', 'If the five Supreme Palace seats are small, weak, and dark, the dynasty falls.'],
  s0821: ['Four stars of the Four Emperors\' Seats flank the Yellow Emperor\'s Seat.', 'Four Emperors\' Seat stars flank the Yellow Emperor.'],
  s0822: ['The eastern star is the god Lingweiyang of the Green Emperor.', 'The eastern star is Green Emperor Lingweiyang.'],
  s0823: ['The southern star is the god Biaonu of the Red Emperor.', 'The southern star is Red Emperor Biaonu.'],
  s0824: ['The western star is the god Zhaoju of the White Emperor.', 'The western star is White Emperor Zhaoju.'],
  s0825: ['The northern star is the god Yeguangji of the Black Emperor.', 'The northern star is Black Emperor Yeguangji.'],
  s0826: ['One star north of the Five Emperors\' Seats is called the Heir Apparent—the imperial heir.', 'North of the Five Emperors\' Seats is the Heir Apparent star.'],
  s0827: ['One star north of the Heir Apparent is called the Attendant Official—attendant ministers.', 'North of the Heir Apparent is the Attendant Official.'],
  s0828: ['One star northeast of the imperial seat is called the Favored Minister.', 'Northeast of the throne is the Favored Minister star.'],
  s0829: ['Four Screen stars are within the Central Gate, near the Right Enforcer.', 'Four Screen stars inside the Central Gate screen the court near the Right Enforcer.'],
  s0830: ['The Screen blocks and shelters the imperial court.', 'The Screen shields the imperial court.'],
  s0831: ['The enforcer governs impeachment; when ministers respect the ruler, the stars are bright and lustrous.', 'Enforcers impeach; when ministers revere the ruler, their stars shine moist and bright.'],
  s0832: ['Fifteen Officer Position stars are northeast of the imperial seat; also called Dependent Crow—the officer positions.', 'Fifteen Officer Position stars northeast of the throne are the attendant corps.'],
  s0833: ['Chief clerks of the Zhou offices; Palace Attendant, Palace Secretary, Remonstrance Counselor, Consultation Gentleman, and Attendants of the Three Bureaus of Han—these are their duties.', 'They image Zhou chief clerks and Han attendants, counselors, and bureau gentlemen.'],
  s0834: ['Or it is said: today\'s Imperial Secretariat.', 'Some say they represent today\'s Imperial Secretariat.'],
  s0835: ['Officer Positions govern guard and defense.', 'Officer Positions oversee guard duty.'],
  s0836: ['When their stars are bright, high ministers seize the ruler.', 'Bright Officer Position stars mean ministers seize the sovereign.'],
  s0837: ['It is also said: a guest star strikes the ruler.', 'A guest star striking them also menaces the ruler.'],
  s0838: ['If the stars are incomplete, the empress dies and favored ministers are executed.', 'Incomplete stars mean the empress dies and favorites are executed.'],
  s0839: ['If a guest star enters, high ministers rebel.', 'A guest star entering brings ministerial rebellion.'],
  s0840: ['One Commandant of Attendants star is north of Officer Positions; it reviews equipment—the military readiness.', 'North of Officer Positions is the Commandant of Attendants, reviewing arms and equipment.'],
  s0841: ['One Elite Guard star is north of the Supreme Palace\'s western bastion, south of the Lower Terrace—cavalry of the Quiet Chamber and Maotou.', 'An Elite Guard star north of the western bastion, south of the Lower Terrace, images Maotou cavalry.'],
  s0842: ['Constant Array is seven stars shaped like Net, north of the imperial seat—the Son of Heaven\'s night guard of elite warriors, establishing firm resolve.', 'Seven Net-shaped Constant Array stars north of the throne are the emperor\'s elite night guard.'],
  s0843: ['When the stars waver, the Son of Heaven goes out himself; when bright, military force is used; when faint, military force weakens.', 'Wavering stars mean the emperor leads in person; brightness brings war; faintness weakens arms.'],
  s0844: ['Three Terraces are six stars dwelling in pairs, rising from Literary Glory and arrayed toward Swaying Spear and the Supreme Palace.', 'Six Three Terrace stars in pairs rise from Literary Glory toward Swaying Spear and the Supreme Palace.'],
  s0845: ['Also called the Heavenly Pillar—the position of the Three Dukes.', 'Also the Heavenly Pillar—the Three Dukes\' place.'],
  s0846: ['In Heaven called Three Terraces; it governs opening virtue and proclaiming tokens.', 'In Heaven they are the Three Terraces, opening virtue and proclaiming mandates.'],
  s0847: ['Two stars west near Literary Glory are called the Upper Terrace—Director of Fate, governing longevity.', 'Two stars west near Literary Glory are the Upper Terrace, Director of Fate for longevity.'],
  s0848: ['The next two stars are the Middle Terrace—Director of the Center, governing the clan.', 'Next two are the Middle Terrace, Director of the Center for the imperial clan.'],
  s0849: ['Two stars east are the Lower Terrace—Director of Emolument, governing war—therefore displaying virtue and blocking transgression.', 'Two eastern stars are the Lower Terrace, Director of Emolument for war—displaying virtue, blocking wrong.'],
  s0850: ['It is also said the Three Terraces are the Celestial Stairway; the Supreme One treads up and down.', 'The Three Terraces are also Heaven\'s stairway where the Supreme One treads.'],
  s0851: ['Also called the Grand Stairway: the upper star is the Son of Heaven, the lower the empress;', 'The Grand Stairway\'s upper star is the Son of Heaven, lower the empress;'],
  s0852: ['middle stair: upper stars are feudal lords and Three Dukes, lower are ministers and grand masters;', 'middle stair: upper feudal lords and Three Dukes, lower ministers and grand masters;'],
  s0853: ['lower stair: upper are gentlemen, lower the common people.', 'lower stair: upper gentlemen, lower commoners.'],
  s0854: ['Thus yin and yang are harmonized and the myriad things governed.', 'They harmonize yin-yang and govern the myriad things.'],
  s0855: ['When their stars change, each is interpreted by what it governs regarding people.', 'Star changes are read by what each governs among people.'],
  s0856: ['When ruler and ministers harmonize according to their usual measure.', 'When ruler and ministers accord with their proper stations.'],
  s0857: ['Four southern stars are called Inner Peace—officials of near rank who judge crimes.', 'Four southern stars are Inner Peace, nearby judges of crime.'],
  s0858: ['One star north of the Middle Terrace is called Great Honored—honored kin.', 'North of the Middle Terrace is Great Honored, imaging noble kin.'],
  s0859: ['One star south of the Lower Terrace is called Elite Guard—guard officials.', 'South of the Lower Terrace is Elite Guard, guard officers.'],
  s0860: ['Sheti is six stars straight south of the Dipper handle, governing establishment of seasonal nodes and watching omens.', 'Six Sheti stars south of the handle establish seasons and watch omens.'],
  s0861: ['Sheti is a shield embracing the Imperial Mat, governing the Nine Ministers.', 'Sheti shields the Imperial Mat and governs the Nine Ministers.'],
  s0862: ['When bright and large, the Three Dukes act willfully; if a guest star enters, the sage is constrained.', 'Great brightness lets the Three Dukes run wild; a guest star entering constrains the sage.'],
  s0863: ['Three western stars are called the Zhou Cauldrons—they govern dynastic fall.', 'Three western stars are Zhou Cauldrons, governing dynastic collapse.'],
  s0864: ['Great Horn is one star between Sheti stars.', 'Great Horn is one star amid Sheti.'],
  s0865: ['Great Horn is the Heavenly King\'s throne.', 'Great Horn is the throne of the Heavenly King.'],
  s0866: ['It is also the Heavenly Ridgepole, rectifying governance.', 'It is also Heaven\'s ridgepole, setting governance straight.'],
  s0867: ['Three northern stars are called the Imperial Mat, governing feasts and toasts.', 'Three northern stars are the Imperial Mat for feasts and toasts.'],
  s0868: ['Geng River is three stars north of Great Horn.', 'Three Geng River stars lie north of Great Horn.'],
  s0869: ['Geng River is the Celestial Spear.', 'Geng River is the Celestial Spear.'],
  s0870: ['Also called the Celestial Point; it governs northern armies.', 'Also the Celestial Point, governing northern armies.'],
  s0871: ['It also governs mourning; thus its changes respond with war and mourning.', 'It also governs funerals; its changes bring war and mourning.'],
  s0872: ['If a star vanishes, that state has military plotting.', 'A vanished star means military plotting in that state.'],
  s0873: ['Swaying Spear is one star north of it; also called spear and shield; it governs northern armies.', 'Swaying Spear north of it is spear-and-shield, governing northern armies.'],
  s0874: ['Its interpretation is broadly similar to Geng River.', 'Its omens resemble Geng River\'s.'],
  s0875: ['Between Swaying Spear and the Dipper handle is called the Celestial Storehouse.', 'Between Swaying Spear and the handle is the Celestial Storehouse.'],
  s0876: ['When stars leave their places, there is the omen of the storehouse opening.', 'Stars leaving their places mean the storehouse opens—auspicious.'],
  s0877: ['Swaying Spear should respond with Ridgepole Star, Geng River, and the Northern Dipper—then the Hu regularly receive mandate from China.', 'When Swaying Spear aligns with Ridgepole, Geng River, and the Dipper, northern tribes accept China\'s mandate.'],
  s0878: ['If Swaying Spear is bright but not upright, the Hu do not receive mandate.', 'Bright but crooked Swaying Spear means the Hu reject mandate.'],
  s0879: ['Dark Halberd is two stars north of Swaying Spear.', 'Two Dark Halberd stars lie north of Swaying Spear.'],
  s0880: ['What Dark Halberd governs is the same as Swaying Spear.', 'Dark Halberd\'s governance matches Swaying Spear.'],
  s0881: ['Some say it governs northern tribes.', 'Some say it governs northern barbarians.'],
  s0882: ['If a guest star lodges there, the Hu suffer great defeat.', 'A guest star lodging there brings great defeat to the Hu.'],
  s0883: ['Heavenly Spear is three stars east of the Dipper handle.', 'Three Heavenly Spear stars lie east of the handle.'],
  s0884: ['Also called the Celestial Battle-axe—Heaven\'s military preparedness.', 'Also the Celestial Battle-axe—Heaven\'s martial readiness.'],
  s0885: ['Thus it is left of the Purple Palace to ward off danger.', 'It stands left of the Purple Palace to repel peril.'],
  s0886: ['Female Couch is three stars north of it—the inner palace attendants, governing women\'s affairs.', 'Three Female Couch stars north govern the inner palace and women\'s affairs.'],
  s0887: ['Heavenly Club is five stars north of Female Couch—the Son of Heaven\'s vanguard; it governs strife and punishment, stores troops, and also wards off danger.', 'Five Heavenly Club stars north of Female Couch are the imperial vanguard, governing strife, punishment, and stored arms.'],
  s0888: ['Spear and club both guard against the unexpected.', 'Spear and club both meet emergencies.'],
  s0889: ['If one star is incomplete, national armies rise.', 'One missing star raises national armies.'],
  s0890: ['Seven eastern stars are called Mulberry Basket—the vessel for mulberry, governing encouraging sericulture.', 'Seven eastern Mulberry Basket stars encourage sericulture.'],
  s0891: ['Seven Lords are seven stars east of Swaying Spear—Heaven\'s ministers, the image of the Three Dukes, governing the seven regulators.', 'Seven Lords east of Swaying Spear image the Three Dukes and govern the seven regulators.'],
  s0892: ['Girdle Rope is nine stars before it—the prison of base people.', 'Nine Girdle Rope stars before them imprison base people.'],
  s0893: ['Also called Linked Rope, Moving Camp, and Celestial Prison; it governs law and restrains violence and coercion.', 'Also Linked Rope, Moving Camp, Celestial Prison—law restraining violence.'],
  s0894: ['One star at the prison mouth is the gate—they desire it open.', 'The prison-mouth star is the gate—they wish it open.'],
  s0895: ['When all nine stars are bright, prisons across the realm are burdened.', 'All nine bright means prisons everywhere are overburdened.'],
  s0896: ['If seven appear, minor amnesty;', 'Seven visible brings minor amnesty;'],
  s0897: ['if five, major amnesty.', 'five visible brings major amnesty.'],
  s0898: ['If they move, axe and mace are used; if hollow within, the era changes.', 'Motion brings executions; hollowness within changes the reign era.'],
  s0899: ['The Han Treatise says fifteen stars.', 'The Han Treatise records fifteen stars.'],
  s0900: ['Celestial Record is nine stars east of Girdle Rope—the Nine Ministers.', 'Nine Celestial Record stars east of Girdle Rope are the Nine Ministers.'],
};

function writeBatch(n, entries) {
  const header = `#!/usr/bin/env node
import fs from 'node:fs';
const T = ${JSON.stringify(entries, null, 2)};
const p=process.argv[2]; if(!p)process.exit(1);
const d=JSON.parse(fs.readFileSync(p,'utf8')); let c=0;
for(const s of d.sentences){const x=T[s.id];if(x){s.literal=x[0];s.idiomatic=x[1];c++;}}
fs.writeFileSync(p,JSON.stringify(d,null,2)+'\\n'); console.log('Patch',c);
`;
  fs.writeFileSync(`translations/patches/suishu-019-batch${n}.mjs`, header);
  console.log('batch', n, Object.keys(entries).length);
}

writeBatch(9, T);
console.log('Done batch 9');
