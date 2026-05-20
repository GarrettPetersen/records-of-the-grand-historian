#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'This is not merely scales and feathers showing marvels, cloud-stars and auspicious colors!',
    'These are not mere fish and birds bearing omens, or lucky clouds and stars in the sky!',
  ],
  s0602: [
    'Merit surpasses the hundred kings; the Way shines through ten thousand generations—truly he matches bright Heaven, his glory rivaling sun and moon.',
    'His achievement outshines every king before him, his Way luminous for ages to come—he stands beside Heaven itself, bright as sun and moon.',
  ],
  s0603: [
    'Rivers and mountains bear the token of revolution; chart-prognostications record the mandate\'s end.',
    'Rivers and mountains proclaim the sign of dynastic change; prophecies mark the turning of the age.',
  ],
  s0604: [
    'The will to yield the throne willingly—dark and bright realms alike have gathered it;',
    'The people\'s wish to transfer power—seen and unseen worlds alike have stored it up;',
  ],
  s0605: [
    'Sincerity of praise and song—Chinese and barbarian lands alike manifest it.',
    'The truth of their songs and hymns—Han and foreign lands alike proclaim it.',
  ],
  s0606: [
    'When the Water reign waned and the Wood virtue rose, Heaven\'s cycle had its destination; holding the mirror and pivot, the wise truly gathered.',
    'When Qi\'s Water mandate faded and Liang\'s Wood virtue ascended, Heaven\'s count had found its home—and the wise gathered round the throne.',
  ],
  s0607: [
    'Though I am dull and blind to the Great Way, I have long contemplated rise and fall—how dare I forget the high righteousness of successive ages, humanity and spirits\' utmost wish!',
    'Though I am obtuse and lost in the great Way, I have watched glory and ruin for many years—how could I forget what every age has honored, what gods and men most desire!',
  ],
  s0608: [
    'Now I respectfully yield the throne to Liang, taking my repose at Gufu, following the precedents of Tang-Yao, Yu-Shun, Jin and Song.',
    'Today I formally abdicate to Liang, retire to Gufu, and follow the precedent set by Yao and Shun, Jin and Song.',
  ],
  s0609: [
    'On day xinyou of the fourth month, the Virtuous Empress Dowager ordered: "The western edict has arrived. The Emperor, following earlier generations\' pattern, respectfully yields the sacred regalia to Liang.',
    'On the fourth month, day xinyou, the Virtuous Empress Dowager ordered: "The edict from the west has come. The Emperor, honoring the ways of former ages, yields the imperial regalia to Liang.',
  ],
  s0610: [
    'Tomorrow at the imperial audience I shall dispatch envoys to bestow the seal and ribbon with ceremony; this widow shall withdraw to the detached palace."',
    'Tomorrow I shall receive envoys at court and solemnly hand over the seal and sash; this widow will retire to the detached palace."',
  ],
  s0611: [
    'On day renxu, the abdication proclamation read:',
    'On day renxu the investiture edict ran:',
  ],
  s0612: [
    'To thee, Prince of Liang: In remote antiquity, when life first arose, from the sovereigns Huangxiong and Dating to the heirs of Hexu and Zunlu—all prior to dragon charts and bird tracks, in dim ages beyond detail.',
    'To you, Prince of Liang: In deepest antiquity, when humankind first appeared—from Huangxiong and Dating to the heirs of Hexu and Zunlu—all before dragon charts and bird tracks, in misty ages no one can fully trace.',
  ],
  s0613: [
    'Down through the eras of Shennong, Xuanyuan, Yandi, and Shaohao, sovereigns like Yao and Shun—all governed the myriad people by the Great Way and wielded the common vessel to hold the eight directions.',
    'Through the ages of Shennong, the Yellow Emperor, Yandi, and Shaohao—sovereigns like Yao and Shun—all ruled the people by the great Way and held the realm as a trust for all.',
  ],
  s0614: [
    'They held power as one grips a rotting rope; they gave it up as one casts off a heavy burden.',
    'They clung to the throne like a man holding a fraying rope; they left it like a man dropping a crushing weight.',
  ],
  s0615: [
    'One visit to Fenyang, and already the mind turned toward obscurity;',
    'A single journey to Fenyang, and the heart already turned toward retreat;',
  ],
  s0616: [
    'A brief stay on Mount Ji, and the heart moved to yield the throne.',
    'A short sojourn on Mount Ji, and the will to abdicate awakened.',
  ],
  s0617: [
    'Thus one knows that wearing the yellow canopy and holding the jade seal are not means to display rank and honor;',
    'So we know that the yellow canopy and jade seal are not worn to show off rank and glory;',
  ],
  s0618: [
    'Riding the great chariot and raising banners and flags—these were meant to give direction a place to return.',
    'The great chariot, the banners and pennants—these exist so that power may one day be returned.',
  ],
  s0619: [
    'Therefore they forgot themselves to nurture the myriad people, and devoted themselves to ruling all beneath Heaven.',
    'They forgot themselves for the sake of the people, and gave their lives to governing the world.',
  ],
  s0620: [
    'When inner essence was spent and outward toil with basket and spade exhausted them, then, welcoming this returning mandate, they gave it only to the capable.',
    'When their strength was spent within and their labor worn out without, they welcomed the turning of fate and yielded only to the worthy.',
  ],
  s0621: [
    'How much more when reed pipes and drums proclaim new rule, auspicious charts open, Sheti shines clear at night, and fireflies blaze by day!',
    'How much more now, when music heralds a new age, auspicious signs appear, Sheti burns bright at night, and fireflies shine by day!',
  ],
  s0622: [
    'Four hundred years ended, and Han therefore bowed high and yielded;',
    'When four hundred years ran out, Han bowed and yielded the throne;',
  ],
  s0623: [
    'The Yellow virtue having faded, Wei thus gladly received the push of the people.',
    'When the Yellow virtue waned, Wei gladly accepted what the people thrust upon it.',
  ],
  s0624: [
    'Extending to Jin and Song, they too magnified this rite.',
    'Down through Jin and Song, each honored this same rite.',
  ],
  s0625: [
    'Our founding ancestor grasped the River Chart and received the calendar, matching the token and opening fortune—two reigns doubly bright, three sages linking the track.',
    'Our founding emperor took the River Chart and received Heaven\'s calendar, answered the omen and opened a new fortune—two reigns shone in succession, three sage rulers linked the line.',
  ],
  s0626: [
    'The succeeding ruler lost virtue, blindly abandoned measure and law, destroyed and confused Heaven\'s net, withered earth\'s cords.',
    'The heir lost his virtue, cast off all order, tangled Heaven\'s laws and snapped the bonds of earth.',
  ],
  s0627: [
    'Across the boundless nine regions all were cut to mutual hatred; all under Heaven looked at one another, life hanging by a moment\'s thread.',
    'The nine regions became a wilderness of enemies; all under Heaven stared at one another, each life hanging by a thread.',
  ],
  s0628: [
    'Slicing the pregnant, wading through blood—even these weigh light beside what was done;',
    'Slaughtering the unborn, wading through gore—even these were trifles compared with what followed;',
  ],
  s0629: [
    'Seeking a chicken, demanding a staff—how could such petty cruelties even serve as comparison?',
    'Demanding a chicken, seizing a walking stick—how could such petty tyrannies even begin to compare?',
  ],
  s0630: [
    'Thus valleys brimmed yet rivers dried, mountains flew and ghosts wept—the seven temples already endangered, neither men nor spirits had a lord.',
    'Valleys overflowed while rivers ran dry, mountains trembled and ghosts wailed—the ancestral temples stood in peril, and neither men nor gods had a master.',
  ],
  s0631: [
    'Only Your Highness embodies this supreme wisdom, sagacity in person, receiving the spirit of the five planets, brilliance equal to sun and moon.',
    'You alone embody supreme wisdom, sage virtue in your person, blessed by the five planets, bright as sun and moon together.',
  ],
  s0632: [
    'When human relations are ordered, you don the formal cap and robe and harmonize universal flourishing;',
    'In times of peace you don the ceremonial cap and robe and bring harmony to all;',
  ],
  s0633: [
    'When hardship is most pressing, you thrust forward the blade and rescue men from fire and charcoal.',
    'In times of crisis you take up the sword and save the people from fire and ruin.',
  ],
  s0634: [
    'Merit surpasses creation\'s work, virtue aids the living masses—grace reaches none untainted, benevolence covers all, rising to azure Heaven, descending to rivers and springs.',
    'Your achievement exceeds what Heaven itself has wrought; your virtue succors all the living—no one goes untouched by your grace, no one left outside your mercy, from the sky above to the springs below.',
  ],
  s0635: [
    'Cultural teaching rises together with the roc\'s wings; martial achievement runs alongside the sun\'s chariot.',
    'Culture spreads on wings as broad as the roc\'s; martial glory rides beside the chariot of the sun.',
  ],
  s0636: [
    'Truly dark and bright realms have taken you to heart, and the songs of praise belong to you;',
    'The seen and unseen worlds have set their hearts on you; the songs of the people belong to you alone;',
  ],
  s0637: [
    'Not merely drums sounding across the earth, auspicious clouds clustering in heaven!',
    'Not merely drums beating across the land and auspicious clouds filling the sky!',
  ],
  s0638: [
    'As when by day one sees the sun and moon contend for light, by night wayward stars fly, earth sinks and comets pierce, sun eclipses and stars vanish—the signs of removing the old surely appear, the tokens of changing surname truly gather.',
    'When sun and moon vie for brightness by day, stray stars streak by night, earth collapses and comets pierce the sky, the sun darkens and stars fall—the omens of casting off the old are plain, the signs of dynastic change have gathered.',
  ],
  s0639: [
    'Thus when the righteous army first stepped forth, sweet dew condensed; once humane wind spread, white patterns stirred of themselves—envoys from the northern gates and straw-market frontier, chariot-wind and fire-sign peoples, bowed and prostrated, wishing to become servants.',
    'When the righteous army first marched, sweet dew gathered; when benevolent winds blew, white banners rose of their own accord—envoys from the northern capital, peoples from the farthest frontiers, all bowed and prostrated themselves, begging to become your subjects.',
  ],
  s0640: [
    'Bells and stones all changed—events signaled the transfer from Yu;',
    'Bells and stone chimes all changed—the omen of Yu\'s abdication appeared;',
  ],
  s0641: [
    'Dragons and fish appeared together—the righteousness shown in serving Xia.',
    'Dragons and fish rose together—the righteousness of serving Xia was made manifest.',
  ],
  s0642: [
    'As for governing the people and leading the multitude, acting as shepherd—the root is to make oneself one with the myriad things, to follow the heart of the hundred surnames.',
    'To govern the people and lead the masses as their shepherd—the root of it is to become one with all creation, to follow the hearts of the common people.',
  ],
  s0643: [
    'The precious mandate has no fixed lord; emperors are not of one clan alone.',
    'Heaven\'s mandate has no permanent master; the throne does not belong to one family forever.',
  ],
  s0644: [
    'Now, reverencing Heaven\'s signs above and relying on the people\'s wish below, I respectfully yield the sacred regalia and confer the imperial position upon your person.',
    'Now, looking up to Heaven\'s signs and down to the people\'s will, I yield the imperial regalia and confer the throne upon you.',
  ],
  s0645: [
    'The great fortune declares its end; Heaven\'s stipend is forever concluded.',
    'Our great fortune is spent; Heaven\'s blessing upon us is ended.',
  ],
  s0646: [
    'Alas!',
    'Alas!',
  ],
  s0647: [
    'Prince, hold the center between extremes, follow the former canon, to answer bright Heaven\'s expectation.',
    'Prince, hold the middle way, follow the ancient precedent, and fulfill what bright Heaven expects.',
  ],
  s0648: [
    'Sacrifice to High God and face the hundred millions, approach the civil ancestors and receive the great enterprise—to transmit boundless fortune: is this not magnificent!',
    'Worship Heaven and rule the hundred million people, receive the ancestors\' blessing and take up the great enterprise—to pass on an endless fortune: what glory could be greater!',
  ],
  s0649: [
    'Another imperial letter read:',
    'Another letter bearing the imperial seal read:',
  ],
  s0650: [
    'Life is Heaven and Earth\'s greatest virtue; humans are the general name of the living—same head, same origin, none know why they should differ.',
    'Life is the greatest virtue of Heaven and Earth; humanity is the common name of all who live—we share the same form, the same root; who knows why we should be divided?',
  ],
  s0651: [
    'Yet receiving spirit from creation, wise and foolish natures are not one;',
    'Yet endowed by creation, the wise and the foolish are not alike;',
  ],
  s0652: [
    'Resting in the five constants, strong and soft divisions may go awry.',
    'Rooted in the five virtues, the strong and the weak may fall out of balance.',
  ],
  s0653: [
    'Lords were not one, contention and offense arose together—therefore they established rulers and elders to assist in governing.',
    'When rulers were many and strife arose, they set up kings and chiefs to govern on their behalf.',
  ],
  s0654: [
    'Not meaning to be proud above and take all under Heaven as private property.',
    'Not so that the proud might stand above and treat the realm as their private possession.',
  ],
  s0655: [
    'Moreover the three calendars changed in turn, five agents shifted; green script and red characters testified, the River Chart and Luo Writ exemplified.',
    'Moreover the three calendars succeeded one another, the five phases turned in cycle—green writing and red characters bore witness, the River Chart and Luo Writ gave proof.',
  ],
  s0656: [
    'In ancient times Yao and Shun deeply grasped this meaning, sought the wise, and entrusted the masses.',
    'In ancient times Yao and Shun understood this deeply, sought out the wise, and entrusted the people to them.',
  ],
  s0657: [
    'Transferring from Yu, serving Xia—the root was following the heart of the people;',
    'Yu yielded to Shun, Shun served the Xia—the root of it was following the people\'s hearts;',
  ],
  s0658: [
    'Transforming Yin to Zhou—truly receiving mandate from azure Heaven.',
    'The Zhou replaced the Shang—truly receiving mandate from Heaven above.',
  ],
  s0659: [
    'From Han and Wei on, none failed to follow this path;',
    'From Han and Wei onward, none failed to follow this way;',
  ],
  s0660: [
    'Descending to Jin and Song, they too observed this canon.',
    'Down through Jin and Song, each honored this same tradition.',
  ],
  s0661: [
    'Our High Emperor therefore approached the civil ancestors and embraced the returning mandate, revering Heaven and respectfully receiving the precious calendar.',
    'Our High Emperor therefore received the ancestors\' blessing and embraced the turning of fate, revering Heaven and respectfully taking up the imperial calendar.',
  ],
  s0662: [
    'When the final generation came, calamity and chaos piled up, royal measure tangled, treacherous wickedness accumulated.',
    'In the last days calamity piled upon calamity, royal order collapsed, and wickedness flourished unchecked.',
  ],
  s0663: [
    'Millions of common people—knife and chopping block for their fate; already-nearer oppression, peril thin as thread; crawling between heaven and earth, nowhere to flee.',
    'Millions of ordinary people faced the knife and the block; danger pressed close as a thread; they crawled between heaven and earth with nowhere to hide.',
  ],
  s0664: [
    'Fierce evils fanned the flames, intent on indulging slaughter—they meant first to destroy the gentry, then move the sacred vessels.',
    'The wicked fanned the flames of chaos, hungry for slaughter—they meant first to wipe out the educated classes, then seize the throne itself.',
  ],
  s0665: [
    'Heng, Bao, Zhou, and Shao stood ranked with night people.',
    'Men who should have been like Yi Yin and the Duke of Zhou stood instead among villains of the night.',
  ],
  s0666: [
    'Nest on awning, piled eggs—even these pale before the present danger.',
    'A nest in a burning rafter, eggs stacked on a collapsing wall—even these do not capture the peril we faced.',
  ],
  s0667: [
    'Had it not been for heroic sage far-seeing, taking benevolence as personal charge—owls and falcons would already have snapped shut and cut one down.',
    'Had you not been a heroic sage of far vision, taking benevolence as your own burden—the owls would already have closed their beaks upon us all.',
  ],
  s0668: [
    'Only Your Highness is lofty as Heaven, broad and thick as Earth, smelting the six directions, molding the myriad beings.',
    'You alone are lofty as Heaven, vast as Earth, forging the six directions, shaping the ten thousand things.',
  ],
  s0669: [
    'Blazing spears and swift couriers raced together, stirring martial spirit for distant campaigns;',
    'Spears flashed and couriers raced, rousing martial valor for campaigns far and wide;',
  ],
  s0670: [
    'Thunder clouds just spreading, mustering righteous troops to aid the king.',
    'Thunder clouds gathering, you raised righteous armies to rescue the throne.',
  ],
  s0671: [
    'Raising banners and flags on distant roads, executing traitors at the palace gates.',
    'You raised your banners on distant roads and executed traitors at the capital gates.',
  ],
  s0672: [
    'Virtue crowns all former beginnings; achievement matches no second.',
    'Your virtue surpasses all who came before; your achievement has no equal.',
  ],
  s0673: [
    'Greatly crossing hardship, brightening the kingly Way.',
    'You crossed through hardship and restored the brightness of the kingly Way.',
  ],
  s0674: [
    'Embracing and soothing the myriad surnames, managing the four directions.',
    'You embraced and comforted the people, and set the four directions in order.',
  ],
  s0675: [
    'Raising the straight and setting aside the crooked—measured as if drawn with one line.',
    'You promoted the upright and removed the corrupt—as uniform as a line drawn with one stroke.',
  ],
  s0676: [
    'Staying awake till dawn like the Shang queen; laboring past noon exceeding King Wen of Zhou.',
    'You waited for dawn like a worthy Shang ruler; you toiled past noon surpassing King Wen of Zhou.',
  ],
  s0677: [
    'Wind of transformation solemn and reverent; rites and music interflowing smoothly.',
    'Customs grew solemn and pure; rites and music flourished together.',
  ],
  s0678: [
    'Adding forgiveness of faults and pardoning crimes, divine martiality without killing—grand virtue shines in the stellar girdle, supreme righteousness moves ghosts and spirits.',
    'You pardoned the guilty and forgave offenses, wielded divine power without needless killing—your great virtue shines among the stars, your supreme righteousness moves ghosts and spirits.',
  ],
  s0679: [
    'As for receiving that great foothill, accepting this returning mandate—fierce wind did not confuse, the willing push of people was there.',
    'In receiving the great mandate at Mount Tai, accepting this turning of fate—the fierce wind did not lead you astray, and the people\'s will to yield was plain.',
  ],
  s0680: [
    'Ordering the five musical instruments in already-disordered times, restoring the nine cauldrons that had grown light.',
    'You set right the five rites in a broken age, and restored the nine cauldrons that had lost their weight.',
  ],
  s0681: [
    'From where culture\'s voice reached, where chariots and writing arrived—faces changed, heads turned back, singing praise of virtue\'s grace.',
    'Wherever your civilizing voice reached, wherever your chariots and writing arrived—people turned their faces and sang of your grace.',
  ],
  s0682: [
    'Nine mountains\' evil vapors extinguished, four great rivers flowing peacefully.',
    'Evil mists vanished from the nine mountains; the four great rivers flowed in peace.',
  ],
  s0683: [
    'Auspicious winds fan and rise, excessive rains quiet and cease.',
    'Auspicious winds rose; floods and storms subsided.',
  ],
  s0684: [
    'Dark armor roams amid fragrant herbs; white patterns are gentle in suburban parks.',
    'Armored soldiers walk peacefully among fragrant meadows; white banners flutter calmly in the royal parks.',
  ],
  s0685: [
    'Leaping through nine rivers in clear skies; six symbolic beasts call from high knolls.',
    'Fish leap in the clear rivers; the six auspicious beasts call from the high hills.',
  ],
  s0686: [
    'Spirit omens mixed and manifold, dark tokens clearly manifest.',
    'Spiritual omens appeared in profusion; Heaven\'s signs shone clear.',
  ],
  s0687: [
    'As when comets bristle in the Purple Palace, water-signs appear in the first month, wild geese fill the fields, long comets span heaven—the response of taking the new already bright, the sign of replacing the old surely manifest.',
    'Comets blazed in the Purple Palace, water omens appeared in the first month, wild geese filled the fields, long comets crossed the sky—the signs of a new beginning were plain, the omens of dynastic change unmistakable.',
  ],
  s0688: [
    'Adding heavenly countenance uniquely fine, lofty bearing like Yao\'s form;',
    'Your heavenly bearing is uniquely noble, your stature like that of Emperor Yao;',
  ],
  s0689: [
    'Tokens of ruling—surely not of one measure alone.',
    'The signs that you are meant to rule—surely they are not of one kind alone.',
  ],
  s0690: [
    'The Documents says: "Heaven observes his virtue and gathers the great mandate to him."',
    'The Book of Documents says: "Heaven sees his virtue and brings the great mandate to him."',
  ],
  s0691: [
    'The Odes say: "King Wen above—how bright he is before Heaven."',
    'The Book of Odes says: "King Wen above—how bright he shines before Heaven."',
  ],
  s0692: [
    'Therefore Yin and Yang both favor, dark and bright truly harmonize—not merely to possess this myriad realm and gather these songs of praise!',
    'Heaven and earth both look upon you with favor, the seen and unseen worlds agree—not merely to win this realm and gather the people\'s songs!',
  ],
  s0693: [
    'Therefore I bow the head upon the precious jade and entrust my heart to the sage and wise.',
    'Therefore I bow my head upon the jade scepter and place my trust in your sage wisdom.',
  ],
  s0694: [
    'Formerly the Water reign declared its satiety; our founding ancestor already received mandate to succeed the ending;',
    'When the Water mandate ran its course, our founding emperor received Heaven\'s charge to succeed the dying dynasty;',
  ],
  s0695: [
    'On this day Heaven\'s stipend declares its departure, and by Wood virtue passes to Liang.',
    'Today Heaven\'s blessing upon us is ended, and by Wood virtue the mandate passes to Liang.',
  ],
  s0696: [
    'Searching far the former canon, lowering regard to recent ages—lords near and far, none contradict my heart.',
    'Looking back to ancient precedent and down to recent times—ministers near and far, none oppose what my heart commands.',
  ],
  s0697: [
    'Now I dispatch the Commissioner with Staff, concurrent Grand Mentor, Attendant-in-Ordinary, Director of the Secretariat, concurrent Master of Affairs, Marquis of Ruinan, Liang; and concurrent Grand Commandant, Palace Attendant of the Scattered Cavalry, Director of the Secretariat, Marquis of Xinwu, Zhi—to present the imperial seal and ribbon.',
    'Now I send Commissioner with Staff, concurrent Grand Tutor, Attendant-in-Ordinary, Director of the Secretariat, concurrent Master of Affairs, Marquis of Ruinan Liang, and concurrent Grand Commandant, Palace Attendant, Director of the Secretariat, Marquis of Xinwu Zhi, to deliver the imperial seal and sash.',
  ],
  s0698: [
    'The rite of receiving the end shall wholly follow the Tang-Yu precedents.',
    'The ceremony of succession shall follow entirely the precedent of Yao and Shun.',
  ],
  s0699: [
    'Prince, ascend as this primal sovereign, rule the ten thousand regions, transmit the grand achievement—to answer Heaven\'s gracious mandate!',
    'Prince, ascend the throne, rule the ten thousand regions, pass on your great achievement—and answer Heaven\'s gracious command!',
  ],
  s0700: [
    'Gaozu submitted memorials refusing, protestations that were not forwarded.',
    'Gaozu submitted memorials declining the throne, but they were not delivered onward.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_001_b7.mjs <translation.json>'
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
