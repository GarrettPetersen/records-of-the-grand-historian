#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.022, Bright Hall treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/022.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex });
    }
    blockIndex++;
  }
  return out;
}

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}


const T = {
  s0301: {
    literal: 'each pillar followed its direction, again patterning the jiazi cycle.',
    idiomatic: 'pillars followed their directions, again mapping the sexagenary cycle.',
  },
  s0302: {
    literal: 'Double lintels: two hundred sixteen pieces.',
    idiomatic: 'There were two hundred sixteen double lintels.',
  },
  s0303: {
    literal: 'According to the Book of Changes, Qian’s tally is two hundred sixteen; therefore two hundred sixteen pieces were set.',
    idiomatic: 'Qian’s tally is two hundred sixteen—hence two hundred sixteen lintels.',
  },
  s0304: {
    literal: 'Thus the Changes’ image was patterned, Qian’s origin was taken as model, the Great Expansion’s deep mystery was answered, and the divine tally’s ultimate number was matched.',
    idiomatic: 'Thus the Changes’ image was patterned, Qian’s origin modeled, Great Expansion answered, and the divine tally matched.',
  },
  s0305: {
    literal: 'Large and small bracket-arms and tiered arches totaled six thousand three hundred forty-five.',
    idiomatic: 'Bracket-arms large and small and tiered arches numbered six thousand three hundred forty-five.',
  },
  s0306: {
    literal: 'According to the History of Han, the conjunction-month number is six thousand three hundred forty-five; therefore six thousand three hundred forty-five pieces were set.',
    idiomatic: 'The History of Han’s conjunction-month number is six thousand three hundred forty-five—hence that many bracket pieces.',
  },
  s0307: {
    literal: 'Thus the Three Systems’ text was drawn from afar, the conjunction-month number was matched beside it, golden measures were joined in regulation, and the jade calendar was paired to harmonize the seasons.',
    idiomatic: 'They drew on the Three Systems, matched the conjunction-month number, joined golden measures, and paired the jade calendar to the seasons.',
  },
  s0308: {
    literal: 'Double rafters: four hundred eighty-nine pieces.',
    idiomatic: 'There were four hundred eighty-nine double rafters.',
  },
  s0309: {
    literal: 'According to the History of Han, rule-months are two hundred thirty-five and intercalary months in full cycle two hundred fifty-four, totaling four hundred eighty-nine; therefore four hundred eighty-nine pieces were set.',
    idiomatic: 'Rule-months are two hundred thirty-five and intercalary months two hundred fifty-four—four hundred eighty-nine—hence that many double rafters.',
  },
  s0310: {
    literal: 'Thus the subtle meaning of fixing the beginning was patterned, the fine plan of raising the standard was symbolized, calendrical images were patterned, and rule and intercalation were displayed.',
    idiomatic: 'They patterned fixing the beginning, symbolized raising the standard, modeled calendrical images, and displayed rule and intercalation.',
  },
  s0311: {
    literal: 'Lower ring-beams: seventy-two pieces.',
    idiomatic: 'Seventy-two lower ring-beams were set.',
  },
  s0312: {
    literal: 'According to the Apocrypha of the Changes, there are seventy-two hou; therefore seventy-two pieces were set.',
    idiomatic: 'The Changes apocrypha lists seventy-two hou—hence seventy-two lower ring-beams.',
  },
  s0313: {
    literal: 'Thus fine seasons were patterned as model, true hou were taken as measure, utmost harmony was joined to the flourishing calendar, and divine numbers were paired to the auspicious term.',
    idiomatic: 'They patterned fine seasons, measured true hou, joined utmost harmony to the flourishing calendar, and paired divine numbers to the auspicious term.',
  },
  s0314: {
    literal: 'Upper ring-beams: eighty-four pieces.',
    idiomatic: 'Eighty-four upper ring-beams were set.',
  },
  s0315: {
    literal: 'According to the History of Han, the nine conjunctions’ number has seventy-eight.',
    idiomatic: 'The History of Han’s nine conjunctions number seventy-eight.',
  },
  s0316: {
    literal: 'Again, according to Zhuangzi: “Beyond the six directions, the sage stores but does not discuss.”',
    idiomatic: 'Zhuangzi says, “Beyond the six directions, the sage stores but does not discuss.”',
  },
  s0317: {
    literal: 'Sima Biao’s commentary: Heaven, Earth, and the four quarters are the six directions.',
    idiomatic: 'Sima Biao explains: Heaven, Earth, and the four quarters are the six directions.',
  },
  s0318: {
    literal: 'Together they make eighty-four; therefore eighty-four pieces were set.',
    idiomatic: 'Together they make eighty-four—hence eighty-four upper ring-beams.',
  },
  s0319: {
    literal: 'Thus the Two Modes were patterned as model, the six directions were embraced, the conjunction numbers were matched, and the sources of seasonal qi were fully joined.',
    idiomatic: 'They patterned the Two Modes, embraced the six directions, matched conjunction numbers, and joined the sources of seasonal qi.',
  },
  s0320: {
    literal: 'Tenons: sixty pieces.',
    idiomatic: 'Sixty tenons were set.',
  },
  s0321: {
    literal: 'According to the History of Han, the method for calculating the Grand Year has sixty; therefore sixty pieces were set.',
    idiomatic: 'The Grand Year cycle has sixty steps—hence sixty tenons.',
  },
  s0322: {
    literal: 'Thus calendrical numbers were comprehensively covered, yin and yang were included, the jia-yi subtlety was taken, and the chen-zi mystery was exhausted.',
    idiomatic: 'They covered calendrical numbers, embraced yin and yang, took jia-yi subtlety, and exhausted the chen-zi mystery.',
  },
  s0323: {
    literal: 'Linked bracket-arms: three hundred sixty pieces.',
    idiomatic: 'Three hundred sixty linked bracket-arms were set.',
  },
  s0324: {
    literal: 'According to the Book of Changes, days in a full cycle are three hundred sixty; therefore three hundred sixty pieces were set.',
    idiomatic: 'A full cycle has three hundred sixty days—hence three hundred sixty linked bracket-arms.',
  },
  s0325: {
    literal: 'Thus the Zhou Heaven’s measure was matched, the days of a full cycle were taken as standard, equal division completed the year, and gnomon motion turned in cycle.',
    idiomatic: 'They matched the Zhou Heaven’s measure, took the full cycle’s days as standard, divided the year equally, and turned with the gnomon’s motion.',
  },
  s0326: {
    literal: 'Small beams: sixty pieces.',
    idiomatic: 'Sixty small beams were set.',
  },
  s0327: {
    literal: 'According to the History of Han, there are sixty jiazi; therefore sixty pieces were set.',
    idiomatic: 'Sixty jiazi—hence sixty small beams.',
  },
  s0328: {
    literal: 'Constructing these rainbow beams, the distant Phoenix calendar was patterned; rising beside the four quarters’ design, it matched the six jia source from afar.',
    idiomatic: 'These rainbow beams patterned the distant Phoenix calendar and, rising beside the four quarters’ design, matched the six jia from afar.',
  },
  s0329: {
    literal: 'Ties: two hundred twenty-eight pieces.',
    idiomatic: 'Two hundred twenty-eight ties were set.',
  },
  s0330: {
    literal: 'According to the History of Han, within a rule are two hundred twenty-eight; therefore two hundred twenty-eight pieces were set.',
    idiomatic: 'Within a rule are two hundred twenty-eight—hence that many ties.',
  },
  s0331: {
    literal: 'Thus the long calendar’s rule was answered, the mid-month’s measure was symbolized, yin-yang numbers were broadly interwoven, and cold-heat harmony was joined beside.',
    idiomatic: 'They answered the long calendar’s rule, symbolized the mid-month’s measure, interwove yin-yang numbers, and joined cold-heat harmony.',
  },
  s0332: {
    literal: 'Square cross-beams: fifteen tiers.',
    idiomatic: 'Fifteen tiers of square cross-beams were set.',
  },
  s0333: {
    literal: 'According to the Documents, the Five Phases’ birth-numbers total fifteen; therefore fifteen tiers were set.',
    idiomatic: 'The Five Phases’ birth-numbers total fifteen—hence fifteen tiers.',
  },
  s0334: {
    literal: 'Binding rafters and dividing bays, the Five Phases were patterned to unfold mystery;',
    idiomatic: 'Binding rafters and dividing bays, they patterned the Five Phases to unfold mystery;',
  },
  s0335: {
    literal: 'spacing pillars in layered structure, birth-numbers were matched to complete the rule.',
    idiomatic: 'layering pillars, they matched birth-numbers to complete the rule.',
  },
  s0336: {
    literal: 'Great beams north and south: two.',
    idiomatic: 'Two great beams ran north and south.',
  },
  s0337: {
    literal: 'According to the Book of Changes, the Grand Ultimate gives birth to the Two Modes; therefore two great beams were set.',
    idiomatic: 'The Grand Ultimate begets the Two Modes—hence two great beams.',
  },
  s0338: {
    literal: 'Patterning Qian and Kun, modeling Heaven and Earth, symbolizing the black-yellow union of virtue, displaying covering and bearing to generate.',
    idiomatic: 'They patterned Qian and Kun, modeled Heaven and Earth, symbolized black-yellow union, and displayed covering and bearing.',
  },
  s0339: {
    literal: 'Sun horses: thirty-six courses.',
    idiomatic: 'Thirty-six sun-horse courses were laid.',
  },
  s0340: {
    literal: 'According to the Apocrypha of the Changes, there are thirty-six nodes; therefore thirty-six courses were set.',
    idiomatic: 'The Changes apocrypha lists thirty-six nodes—hence thirty-six sun-horse courses.',
  },
  s0341: {
    literal: 'Thus these fine nodes were displayed, these true chronograms were joined, the six qi were divided to harmonize yin and yang, and the four images were circled to regulate wind and rain.',
    idiomatic: 'They displayed fine nodes, joined true chronograms, divided the six qi to harmonize yin and yang, and circled the four images to regulate wind and rain.',
  },
  s0342: {
    literal: 'Rafters: two thousand nine hundred ninety.',
    idiomatic: 'Rafters numbered two thousand nine hundred ninety.',
  },
  s0343: {
    literal: 'According to the History of Han, the month method is two thousand three hundred ninety-two and the communication method five hundred ninety-eight, together making two thousand nine hundred ninety.',
    idiomatic: 'The month method is two thousand three hundred ninety-two and the communication method five hundred ninety-eight—two thousand nine hundred ninety together.',
  },
  s0344: {
    literal: 'Thus the step-calculation rule was paired and the communication method’s number joined.',
    idiomatic: 'Thus the step-calculation rule was paired and the communication number joined.',
  },
  s0345: {
    literal: 'From this one knows that spacing rafters to construct the hall, the Great Strength’s frame is thereby lofty; months accumulating to a year, the conjunction calendar’s rule is without error.',
    idiomatic: 'Spacing rafters to build the hall raises the Great Strength frame; months accumulating to a year keep the conjunction calendar without error.',
  },
  s0346: {
    literal: 'Large rafters: two tiers, each tier thirty-six pieces, seventy-two in all.',
    idiomatic: 'Large rafters: two tiers of thirty-six each—seventy-two in all.',
  },
  s0347: {
    literal: 'According to the Huainanzi, in the age of Great Peace a wind came every five days and in one year there were seventy-two winds; therefore seventy-two pieces were set.',
    idiomatic: 'The Huainanzi says Great Peace brought a wind every five days—seventy-two winds a year—hence seventy-two large rafters.',
  },
  s0348: {
    literal: 'Thus the auspicious calendar’s rule was joined, auspicious winds were matched in number, the pure age’s year was matched from afar, and the restful omen’s covenant was followed distantly.',
    idiomatic: 'They joined the auspicious calendar, matched auspicious winds in number, echoed the pure age’s year, and followed the restful omen’s covenant.',
  },
  s0349: {
    literal: 'Flying-eave rafters: seven hundred twenty-nine pieces.',
    idiomatic: 'Seven hundred twenty-nine flying-eave rafters were set.',
  },
  s0350: {
    literal: 'According to the History of Han, from the zi hour to the wu hour the number is seven hundred twenty-nine; therefore seven hundred twenty-nine pieces were set.',
    idiomatic: 'From zi to wu the number is seven hundred twenty-nine—hence that many flying-eave rafters.',
  },
  s0351: {
    literal: 'Thus the asterisms’ grand pattern was taken and the Zhou Heaven’s ultimate number was patterned.',
    idiomatic: 'They took the asterisms’ grand pattern and patterned the Zhou Heaven’s ultimate number.',
  },
  s0352: {
    literal: 'Moreover wu is yin’s root and zi is truly yang’s source; zi and wu divide the hours and the way of generation is thereby displayed;',
    idiomatic: 'Wu is yin’s root and zi yang’s source; dividing the hours at zi and wu shows the way of generation;',
  },
  s0353: {
    literal: 'when yin and yang unite in virtue, the meaning of covering and bearing is thereby exalted.',
    idiomatic: 'when yin and yang unite in virtue, covering and bearing are exalted.',
  },
  s0354: {
    literal: 'The hall eaves’ diameter: two hundred eighty-eight chi.',
    idiomatic: 'The hall eaves spanned two hundred eighty-eight chi in diameter.',
  },
  s0355: {
    literal: 'According to the Book of Changes, Qian’s tally is two hundred sixteen; the Apocrypha of the Changes says the year has seventy-two hou—together two hundred eighty-eight; therefore the diameter is two hundred eighty-eight chi.',
    idiomatic: 'Qian’s tally is two hundred sixteen and the Changes apocrypha adds seventy-two hou—two hundred eighty-eight—fixing the eaves’ diameter.',
  },
  s0356: {
    literal: 'Thus Qian’s tally was matched above, true hou were joined from afar, harmonious qi was followed in sequence, and the round canopy was imitated for oversight.',
    idiomatic: 'They matched Qian’s tally above, joined true hou from afar, followed harmonious qi in sequence, and imitated the round canopy for oversight.',
  },
  s0357: {
    literal: 'The hall’s upper ridge-beam was ninety chi above the base’s top surface.',
    idiomatic: 'The upper ridge-beam stood ninety chi above the base’s top.',
  },
  s0358: {
    literal: 'According to the Book of Changes, Heaven’s number is nine and Earth’s ten; nine times ten yields ninety—therefore ninety chi above the base’s top.',
    idiomatic: 'Heaven nine and Earth ten—nine times ten is ninety—hence ninety chi above the base.',
  },
  s0359: {
    literal: 'Thus above patterned round clarity and below imitated square bearing, matching yin-yang’s ultimate numbers and joining the covenant of interchange.',
    idiomatic: 'Above patterned round clarity, below square bearing, matching yin-yang’s ultimate numbers and interchange’s covenant.',
  },
  s0360: {
    literal: 'Again, taking Heaven’s nine and multiplying by Earth’s ten symbolizes yang’s lead and yin’s response, patterning Qian’s bestowal and Kun’s completion.',
    idiomatic: 'Heaven’s nine times Earth’s ten symbolizes yang leading and yin answering, Qian bestowing and Kun completing.',
  },
  s0361: {
    literal: 'The eaves were fifty-five chi above the ground.',
    idiomatic: 'The eaves stood fifty-five chi above the ground.',
  },
  s0362: {
    literal: 'According to the Book of Changes, the Great Expansion’s number is fifty-five; therefore fifty-five chi above the ground.',
    idiomatic: 'The Great Expansion number is fifty-five—hence eaves fifty-five chi high.',
  },
  s0363: {
    literal: 'Thus the great Changes’ fine number was imitated, the utmost spirit’s deep mystery was joined—principle embracing the ten thousand images, pattern threading the Three Powers.',
    idiomatic: 'They imitated the great Changes’ number, joined the utmost spirit’s mystery—principle embracing all images, pattern threading the Three Powers.',
  },
  s0364: {
    literal: 'Above, clear yang was covered with jade leaves.',
    idiomatic: 'Above, clear yang was roofed with jade leaves.',
  },
  s0365: {
    literal: 'According to the Huainanzi, clear yang is Heaven; it was joined with clear yang’s color.',
    idiomatic: 'The Huainanzi makes clear yang Heaven—hence roofing in clear yang’s color.',
  },
  s0366: {
    literal: 'After the edict was issued, the various factions still had not decided.',
    idiomatic: 'After the edict, factions still had not settled the matter.',
  },
  s0367: {
    literal: 'Through Gaozong’s reign it was never established.',
    idiomatic: 'Through Emperor Gaozong’s reign it was never built.',
  },
  s0368: {
    literal: 'When Empress Zetian held court, Confucians repeatedly memorialized asking to build the Bright Hall.',
    idiomatic: 'When Empress Wu held court, scholars repeatedly asked to build the Bright Hall.',
  },
  s0369: {
    literal: 'Zetian, following Gaozong’s last intent, then discussed its design with Northern Gate academicians and would not heed the multitude’s opinions.',
    idiomatic: 'Following Gaozong’s last intent, Wu discussed the design with Northern Gate academicians and would not heed wider opinion.',
  },
  s0370: {
    literal: 'In spring of the third year of Chuigong, the Qianyuan Hall of the eastern capital was demolished and the Bright Hall was built on its site.',
    idiomatic: 'In spring of Chuigong year 3, Luoyang’s Qianyuan Hall was torn down and the Bright Hall built on its site.',
  },
  s0371: {
    literal: 'On the fifth day of the first month of the fourth year, the Bright Hall was completed.',
    idiomatic: 'On the fifth day of the first month, year 4, the Bright Hall was completed.',
  },
  s0372: {
    literal: 'In all it was two hundred ninety-four chi high; east, west, south, and north each three hundred chi.',
    idiomatic: 'It stood two hundred ninety-four chi high; three hundred chi on each side.',
  },
  s0373: {
    literal: 'It had three tiers: the lower tier symbolized the four seasons, each following its direction’s color;',
    idiomatic: 'It had three tiers: the lower symbolized the four seasons, each in its direction’s color;',
  },
  s0374: {
    literal: 'the middle tier followed the twelve chronograms, with a round canopy; on the canopy a dish of nine dragons held it up;',
    idiomatic: 'the middle followed the twelve chronograms under a round canopy borne on nine dragons;',
  },
  s0375: {
    literal: 'the upper tier followed the twenty-four qi, also with a round canopy.',
    idiomatic: 'the upper followed the twenty-four qi, also under a round canopy.',
  },
  s0376: {
    literal: 'In the pavilion was a great timber ten arm-spans around, running through top to bottom; bracket-arms, corbels, and bearing-blocks were borrowed as the foundation and spanned with iron cables.',
    idiomatic: 'A timber ten arm-spans thick ran through the pavilion; bracket-arms, corbels, and bearing-blocks formed the core and iron cables spanned it.',
  },
  s0377: {
    literal: 'The canopy was made a phoenix-pheasant, gilded, its posture as if soaring.',
    idiomatic: 'The canopy was shaped as a phoenix-pheasant, gilded, poised as if soaring.',
  },
  s0378: {
    literal: 'Wood was carved as tiles and lacquered between ramie layers.',
    idiomatic: 'Wood was carved into tiles and lacquered between ramie layers.',
  },
  s0379: {
    literal: 'Below the Bright Hall an iron channel was laid as the image of the Bright Enclosure.',
    idiomatic: 'Below the Bright Hall ran an iron channel symbolizing the Bright Enclosure moat.',
  },
  s0380: {
    literal: 'It was titled the Palace of Myriad Images.',
    idiomatic: 'It was named the Palace of Myriad Images.',
  },
  s0381: {
    literal: 'Henan county was therefore renamed Hegong county.',
    idiomatic: 'Henan county was renamed Hegong county.',
  },
  s0382: {
    literal: 'An edict said:',
    idiomatic: 'The edict read:',
  },
  s0383: {
    literal: 'The Yellow Thearch governed the calendar and received the ten thousand regions at the Hegong;',
    idiomatic: 'The Yellow Thearch governed the calendar and received the realm at the Hegong;',
  },
  s0384: {
    literal: 'Emperor Danling grasped the talisman and consulted the four peaks at the Crossroads Chamber.',
    idiomatic: 'Emperor Danling held the talisman and took counsel from the four peaks at the Crossroads Chamber.',
  },
  s0385: {
    literal: 'Emperor Shun gathered auspicious signs—the title Total Pattern already existed;',
    idiomatic: 'Emperor Shun gathered auspicious signs—the name Total Pattern already stood;',
  },
  s0386: {
    literal: 'Yu the Great was granted the jade tablet—the name Layered Houses was thereupon established.',
    idiomatic: 'Yu received the jade tablet—and the name Layered Houses was established.',
  },
  s0387: {
    literal: 'The Yin received the mandate and set the Yang Lodge to distinguish directions;',
    idiomatic: 'The Yin took the mandate and built the Yang Lodge to mark the directions;',
  },
  s0388: {
    literal: 'the Zhou fixed the chart and established the Bright Hall to order the realm.',
    idiomatic: 'the Zhou fixed the chart and built the Bright Hall to order the realm.',
  },
  s0389: {
    literal: 'Thus they could compass the Three Ultimates, assist the Five Spirits in the hidden, display reverence for ancestors, and extend the ancestral sacrifice’s canon.',
    idiomatic: 'Thus they compassed the Three Ultimates, assisted the Five Spirits in secret, displayed reverence for ancestors, and extended ancestral sacrifice.',
  },
  s0390: {
    literal: 'From Han and Wei down through Zhou and Sui, beginning designs arose but the rules for expansion were not complete.',
    idiomatic: 'From Han and Wei through Zhou and Sui, beginnings were made but full rules for expansion were never settled.',
  },
  s0391: {
    literal: 'I, in my mediocrity, reverently received the heavy trust, entrusted on the night of the mourning garment, burdened with care before the almost-fallen throne.',
    idiomatic: 'I, mediocre, reverently received heavy trust, entrusted on the night of mourning, burdened before the almost-fallen throne.',
  },
  s0392: {
    literal: 'I reflect that in former years Gaozong already set his mind on the Yang Lodge; therefore in the capital region’s counties the name Bright Hall was recorded in advance;',
    idiomatic: 'Gaozong had already turned his mind to the Yang Lodge; the capital counties were pre-named for the Bright Hall;',
  },
  s0393: {
    literal: 'at the change of reign title the name Total Pattern was first applied.',
    idiomatic: 'and at the change of reign the name Total Pattern was applied first.',
  },
  s0394: {
    literal: 'At the time of Qianfeng I already submitted a memorial rising to dust; though it pleased the imperial heart, there was no leisure to honor it with construction.',
    idiomatic: 'At Qianfeng I had already memorialized; though it pleased the throne, there was no leisure to build.',
  },
  s0395: {
    literal: 'Now at this victorious suburban site, this sacred capital’s inner region, standing in Heaven and Earth’s center and following yin-yang’s order—boats and carts converge, tribute is evenly distributed—I borrow the people’s willing labor and follow the mandate to honor the ancestors.',
    idiomatic: 'Now at this sacred site in the capital’s center, where yin-yang order, transport, and tribute converge, I borrow willing labor and follow the mandate to honor the ancestors.',
  },
  s0396: {
    literal: 'The Bright Hall is the Son of Heaven’s hall for ancestral sacrifice and the place for receiving feudal lords in audience.',
    idiomatic: 'The Bright Hall is where the Son of Heaven sacrifices to ancestors and receives feudal lords in audience.',
  },
  s0397: {
    literal: 'It opens the hidden strategies of Qian and Kun and patterns the movement of emblems and qi—thus calamities do not arise and turmoil is not made.',
    idiomatic: 'It opens Qian and Kun’s hidden strategies and patterns emblems and qi—so calamity does not arise and turmoil is not made.',
  },
  s0398: {
    literal: 'Looking on such splendor—how is it not beautiful!',
    idiomatic: 'Such splendor—how beautiful!',
  },
  s0399: {
    literal: 'Recently the great ru and ritual officers each held a different view; all thought the Bright Hall should be placed three li outside and within seven li, in the state’s yang-bright ground.',
    idiomatic: 'Recently ritual scholars disagreed: all said the Bright Hall should stand three li outside and within seven li, on the state’s yang-bright ground.',
  },
  s0400: {
    literal: 'Now that it is placed close below the palace quarters, I fear it profanes the spirits; it is truly a seat for spreading government, not yet a place for ancestral sacrifice.',
    idiomatic: 'Placed so close to the palace, I fear it profanes the spirits; it is truly a seat for government, not yet a place for ancestral sacrifice.',
  },
};
const source = loadSentencesFromData();
for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  const pair = T[id];
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${id}: literal and idiomatic must differ`);
  }
}

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '022') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 022; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  const extracted = extractRange(dataPath, START, END);
  for (const row of extracted) {
    const key = row.originalId;
    if (!sessionIds.has(key)) {
      data.sentences.push(row);
      sessionIds.add(key);
    }
  }
  const stillMissing = [...expectedIds].filter((id) => !sessionIds.has(id));
  if (stillMissing.length) {
    console.log(
      `Session lacks ${stillMissing.join(', ')}; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
    );
    process.exit(0);
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src.chinese && row.chinese !== src.chinese) {
    row.chinese = src.chinese;
  } else if (!row.chinese) {
    row.chinese = src.chinese;
  }
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ') to', transPath);
