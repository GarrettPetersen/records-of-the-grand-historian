#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'Above, nine altars were placed by position, each altar one chi five inches: southeast called Alluring; due east, Chariot Axis; northeast, Great Yin; due south, Heaven One; center, Heaven Talisman; due north, Great One; southwest, Grasping the Handle; due west, Salt Pool; northwest, Azure Dragon.',
    idiomatic: 'Above, nine one-chi-five-inch altars by position: southeast Alluring; east Chariot Axis; northeast Great Yin; south Heaven One; center Heaven Talisman; north Great One; southwest Grasping the Handle; west Salt Pool; northwest Azure Dragon.',
  },
  s0502: {
    literal: 'Five is the center; wearing nine and treading one; three on the left and seven on the right; two and four above, six and eight below—matching the Dunjia.',
    idiomatic: 'Five at center; wearing nine, treading one; three left, seven right; two and four above, six and eight below—per Dunjia.',
  },
  s0503: {
    literal: 'Sacrificed in the four first months of the seasons, honored as the Nine Palaces Noble Spirits; the rite ranks below August Heaven High God but above the Supreme Clarity Palace and Grand Temple.',
    idiomatic: 'Sacrificed in the four seasonal first months as Nine Palaces Noble Spirits; rite ranked below August Heaven High God but above Supreme Clarity Palace and Grand Temple.',
  },
  s0504: {
    literal: 'Oxen and sheep, jade disks and silks were used, like the spirits of Heaven and Earth.',
    idiomatic: 'Oxen, jade disks, and silks were used, as for Heaven and Earth spirits.',
  },
  s0505: {
    literal: '" Xuanzong personally sacrificed.',
    idiomatic: '" Xuanzong sacrificed in person.',
  },
  s0506: {
    literal: 'If the offices performed the rite, the chief councilor did so.',
    idiomatic: 'When offices performed it, the chief councilor did.',
  },
  s0507: {
    literal: 'In the first month of Qianyuan year 3 under Suzong, he again personally sacrificed.',
    idiomatic: 'Qianyuan 3, first month: Suzong sacrificed again in person.',
  },
  s0508: {
    literal: 'Initially the Nine Palaces spirit seats shifted position each season, called flying position.',
    idiomatic: 'Initially Nine Palaces seats shifted each season—the "flying position."',
  },
  s0509: {
    literal: 'After Qianyuan they no longer shifted position.',
    idiomatic: 'After Qianyuan they no longer shifted.',
  },
  s0510: {
    literal: 'In the eighth month of Dahe year 2, Supervising Censor Shu Yuanyu memorialized: "On the eighteenth day of the seventh month the Nine Palaces Noble Spirits were sacrificed to; I was next to oversee the sacrifice and duty-bound to inspect the ritual goods.',
    idiomatic: 'Dahe 2, eighth month: Supervising Censor Shu Yuanyu said that on the seventh month\'s eighteenth he was to oversee the Nine Palaces Noble Spirits sacrifice and inspect ritual goods.',
  },
  s0511: {
    literal: 'I observed nine prayer boards; having finished reading them on my knees, I privately saw that Your Majesty had personally signed his sacred name and styled himself subject to the Nine Palaces spirits.',
    idiomatic: 'He saw nine prayer boards; reading them, he found the emperor had signed his name and styled himself subject to the Nine Palaces spirits.',
  },
  s0512: {
    literal: 'I submit that in the Son of Heaven\'s exalted station, apart from sacrificing to Heaven and Earth and the ancestral temple, there is none who should be styled subject.',
    idiomatic: 'Apart from Heaven, Earth, and the ancestral temple, the Son of Heaven should style no one as subject.',
  },
  s0513: {
    literal: 'The king fathers Heaven and mothers Earth; the sun is elder brother and the moon elder sister; taking the Nine Palaces as kin, they ought each to keep their position by direction.',
    idiomatic: 'The king fathers Heaven and mothers Earth; sun and moon are elder siblings; the Nine Palaces should each keep their directional place.',
  },
  s0514: {
    literal: 'I further observed their names and titles: Great One, Heaven One, Alluring, Chariot Axis, Salt Pool, Azure Dragon, Great Yin, Heaven Talisman, and Grasping the Handle.',
    idiomatic: 'Their names were Great One, Heaven One, Alluring, Chariot Axis, Salt Pool, Azure Dragon, Great Yin, Heaven Talisman, and Grasping the Handle.',
  },
  s0515: {
    literal: 'These nine spirits, toward Heaven and Earth, are like sons and younger men; toward sun and moon, like marquises and earls.',
    idiomatic: 'These nine spirits toward Heaven and Earth are like sons and cadets; toward sun and moon, like marquises and earls.',
  },
  s0516: {
    literal: 'Your Majesty, exalted as Son of Heaven—how can you in turn be subject to Heaven\'s sons and younger men?',
    idiomatic: 'Your Majesty is Son of Heaven—how become subject to Heaven\'s sons and cadets?',
  },
  s0517: {
    literal: 'I privately deem this a fault.',
    idiomatic: 'I deem this a fault.',
  },
  s0518: {
    literal: 'Even if yin-yang masters spread word of joint sacrifice, Your Majesty should jointly style himself emperor and dispatch a certain official to present sacrifice to the Nine Palaces spirits; he should not style himself subject or sign his name.',
    idiomatic: 'Even if yin-yang masters urged joint sacrifice, the emperor should say "the emperor dispatches an official to sacrifice to the Nine Palaces spirits," not style himself subject or sign his name.',
  },
  s0519: {
    literal: 'I am truly dull and blind and do not know whether it is permissible.',
    idiomatic: 'I am dull and do not know whether it is permissible.',
  },
  s0520: {
    literal: 'Because the rite falls at cock-crow tomorrow and the completed order has already been issued, I dare not delay.',
    idiomatic: 'As the rite is at tomorrow\'s cock-crow and orders are issued, I dare not delay.',
  },
  s0521: {
    literal: 'I humbly beg sagely compassion on another day to issue a clear edict for ritual officers to deliberate in detail, hoping to honor the exalted station of the ten-thousand-chariot lord without impairment, and that long-standing mistaken canon may thereby be corrected.',
    idiomatic: 'I beg that another day an edict order ritual officers to deliberate, honoring the ten-thousand-chariot lord without impairment and correcting long-standing error.',
  },
  s0522: {
    literal: '" An edict ordered the Department of State Affairs to deliberate; all followed Yuanyu\'s proposal.',
    idiomatic: '" The Department of State Affairs deliberated; all followed Yuanyu.',
  },
  s0523: {
    literal: 'It was then demoted to middle sacrifice; prayer boards styled emperor without signature.',
    idiomatic: 'The rite was demoted to middle sacrifice; prayer boards said "emperor" without signature.',
  },
  s0524: {
    literal: 'In the twelfth month of Huichang year 1, the Secretariat memorialized: "Per the Tianbao year 3, tenth month, sixth day edict, \'The Nine Palaces Noble Spirits truly govern flood and drought, their merit assisting High God, their virtue sheltering those below.',
    idiomatic: 'Huichang 1, twelfth month: Secretariat cited Tianbao 3, tenth month, day 6: "Nine Palaces Noble Spirits govern flood and drought, assist High God, shelter the people.',
  },
  s0525: {
    literal: 'May the grain year be glad and disasters not arise.',
    idiomatic: 'May grain years be glad and disasters cease.',
  },
  s0526: {
    literal: 'At each of the four seasons\' opening nodes, let the Secretariat and Chancellery go to perform the regent sacrifice\'—"',
    idiomatic: 'At each seasonal opening node, let Secretariat and Chancellery perform regent sacrifice"—',
  },
  s0527: {
    literal: 'per ritual, the Nine Palaces rank below August Heaven High God; the altar stands above the Supreme Clarity Palace and Grand Temple; oxen and jade disks and silks are used, like Heaven and Earth.',
    idiomatic: 'by ritual Nine Palaces rank below August Heaven High God, altar above Supreme Clarity and Grand Temple, with oxen, disks, and silks like Heaven and Earth.',
  },
  s0528: {
    literal: 'In the twelfth month of Tianbao year 3, Xuanzong personally sacrificed.',
    idiomatic: 'Tianbao 3, twelfth month: Xuanzong sacrificed in person.',
  },
  s0529: {
    literal: 'In the first month of Qianyuan year 2, Suzong personally sacrificed.',
    idiomatic: 'Qianyuan 2, first month: Suzong sacrificed in person.',
  },
  s0530: {
    literal: 'I submit that in successive years flood and drought have been untimely; I fear the offices\' prayers have slackened in sincerity and reverence.',
    idiomatic: 'For years flood and drought have been untimely; offices\' prayers may have slackened in sincerity.',
  },
  s0531: {
    literal: 'Now it is early spring and the sacrifice canon should be restored; I hope that by next year\'s first-month sacrifice day one chief minister may be sent to pray.',
    idiomatic: 'Now in early spring the canon should be restored; I hope one chief minister will pray by next year\'s first-month sacrifice.',
  },
  s0532: {
    literal: 'For the four seasonal sacrifices hereafter, please dispatch vice directors, junior mentors, junior guardians, ministers, and Grand Master of Splendid Happiness and the like, hoping thereby slightly to weight the affair and declare solemn reverence.',
    idiomatic: 'Hereafter let vice directors, junior mentors, guardians, ministers, and the Grand Master of Splendid Happiness conduct the four seasonal sacrifices to weight the rite and show reverence.',
  },
  s0533: {
    literal: 'We on the twenty-fifth day of the eleventh month already reported face to face in Yanying; we received the sacred command to have the ritual regulations examined and submitted.',
    idiomatic: 'We reported in Yanying on the eleventh month\'s twenty-fifth and received orders to submit ritual regulations.',
  },
  s0534: {
    literal: 'For the coming sacrifice, I hope the offices may be ordered to adorn the old altar with emphasis on solemn purity."',
    idiomatic: 'For the coming sacrifice, I hope the offices will adorn the old altar with solemn purity."',
  },
  s0535: {
    literal: '" The edict followed the memorial.',
    idiomatic: '" The edict approved.',
  },
  s0536: {
    literal: 'On the fourth day of the first month of year 2, the Directorate of the Imperial Clan Ritual Office memorialized: "Per the Supervising Censor\'s dispatch: \'On the thirteenth of this month the Nine Palaces Noble Spirits will be sacrificed to; the chief councilor Cui Gong has already been ordered to act as regent Grand Marshal—should he receive the oath and abstinence, and are there Minister of Education and Minister of Works?\'"',
    idiomatic: 'Year 2, first month, day 4: Imperial Clan Ritual Office cited a censor\'s dispatch: on the thirteenth Cui Gong would regent as Grand Marshal for the Nine Palaces—should he take oath and abstinence, and were Minister of Education and Works required?',
  },
  s0537: {
    literal: '\' I submit that the former sacrifice was originally called great sacrifice; per the Dahe year 3, seventh month, twenty-fourth day edict, it was demoted to middle sacrifice.',
    idiomatic: 'The former rite was great sacrifice; per Dahe 3, seventh month, day 24, it was demoted to middle sacrifice.',
  },
  s0538: {
    literal: 'Yesterday\'s edict text spoke only of adorning the old altar with emphasis on solemn purity, not of separately submitting ritual regulations or further changes.',
    idiomatic: 'Yesterday\'s edict spoke only of adorning the old altar, not of new regulations or changes.',
  },
  s0539: {
    literal: 'I fear it may not be fitting to revert to great-sacrifice ritual goods; I await the decisive edict."',
    idiomatic: 'I fear reverting to great-sacrifice goods; I await decision."',
  },
  s0540: {
    literal: '" The Secretariat memorialized:',
    idiomatic: '" The Secretariat replied:',
  },
  s0541: {
    literal: 'Your servant follows the Tianbao year 3, tenth month, sixth day edict: "The Nine Palaces Noble Spirits truly govern flood and drought."',
    idiomatic: 'Per Tianbao 3, tenth month, day 6: "Nine Palaces Noble Spirits truly govern flood and drought."',
  },
  s0542: {
    literal: 'Your servants observe that since two reigns have personally sacrificed, prayers must have had response; moreover since Dahe, flood and drought have been untimely; Your Majesty constantly worries over the crops and thinks of the black-haired people.',
    idiomatic: 'Two reigns sacrificed in person, so prayers answered; since Dahe, flood and drought have troubled you and the people.',
  },
  s0543: {
    literal: 'Your servants ought to accord with the sacred mind and restore the fallen canon.',
    idiomatic: 'We ought to accord with your mind and restore the fallen canon.',
  },
  s0544: {
    literal: 'I observe the Dahe year 3 ritual officers\' report: "Even if they govern flood, drought, and war famine, rank does not exceed the lunar mansions.',
    idiomatic: 'Dahe 3 ritual officers said: "Even governing flood, drought, and war famine, rank does not exceed lunar mansions.',
  },
  s0545: {
    literal: 'Now the Five Stars are all attendant sacrifices; sun and moon remain middle sacrifices."',
    idiomatic: 'Now the Five Stars are attendant sacrifices; sun and moon remain middle sacrifices."',
  },
  s0546: {
    literal: 'I examined their intent in detail: they held that stars should not be compared to celestial offices.',
    idiomatic: 'They held stars should not be compared to celestial offices.',
  },
  s0547: {
    literal: 'They did not know that speaking comprehensively, they are Heaven and Earth; among the asterisms there is naturally high and low.',
    idiomatic: 'Comprehensively they are Heaven and Earth; among asterisms there is naturally high and low.',
  },
  s0548: {
    literal: 'I respectfully consult the Annals of Northern Wei Wang Jun: "The second star of the North Pole, when bright and always luminous, is the primal star\'s exposed couch; the High God constantly dwells there, beginning from the mystery of the Way and becoming the traces of change and transformation.',
    idiomatic: 'Wang Jun\'s Northern Wei Annals: "The North Pole\'s second star, bright and always luminous, is the primal star\'s exposed couch where the High God dwells, from the Way\'s mystery into change."',
  },
  s0549: {
    literal: 'Also the Great Emperor of Heaven, his essence the Radiant Jewel of the Soul—covering the secret chart of the myriad spirits; the mandates and records of rivers and seas all receive from him."',
    idiomatic: 'Also the Great Emperor of Heaven, essence the Radiant Soul Jewel, secret chart of myriad spirits; rivers and seas receive mandate from him."',
  },
  s0550: {
    literal: '" According to this doctrine, that is August Heaven High God.',
    idiomatic: '" By this doctrine that is August Heaven High God.',
  },
  s0551: {
    literal: 'Heaven One governs the eight qi and nine essences\' commands to assist the celestial pole.',
    idiomatic: 'Heaven One governs the eight qi and nine essences to assist the celestial pole.',
  },
  s0552: {
    literal: 'When its manifestation is bright and constant, yin and yang are ordered and the great cycle rises.',
    idiomatic: 'When its manifestation is bright and constant, yin and yang order themselves and the great cycle rises.',
  },
  s0553: {
    literal: 'Great One governs the law and measure of the sixteen spirits of the ten to assist the human pole.',
    idiomatic: 'Great One governs the sixteen spirits\' law to assist the human pole.',
  },
  s0554: {
    literal: 'When its manifestation is bright and centered, then spirits and men harmonize and the kingly way ascends in peace.',
    idiomatic: 'When its manifestation is bright and centered, spirits and men harmonize and the kingly way ascends in peace.',
  },
  s0555: {
    literal: 'Also in the Northern Dipper are the Balance stars Authority and Weight; Heaven One and Great One participate between them—thereby completing Heaven and Earth and assisting the spirit way.',
    idiomatic: 'In the Dipper, Authority and Weight stars stand with Heaven One and Great One between them, completing Heaven and Earth and assisting the spirit way.',
  },
  s0556: {
    literal: 'If one uniformly discusses them as lunar mansions, it is truly shallow and near.',
    idiomatic: 'To treat them uniformly as lunar mansions is shallow.',
  },
  s0557: {
    literal: 'According to the Book of Han: "Among heavenly spirits the honored is Great One; assistants are called the Five Emperors."',
    idiomatic: 'The Book of Han: "Among heavenly spirits the honored is Great One; assistants are the Five Emperors."',
  },
  s0558: {
    literal: '" In antiquity the Son of Heaven in spring and autumn sacrificed to Great One; it is listed in the sacrifice canon—its origin is long.',
    idiomatic: '" Antiquity\'s Son of Heaven sacrificed to Great One in spring and autumn; long listed in the canon.',
  },
  s0559: {
    literal: 'Now the Five Emperors are still great sacrifice; then Great One should not be demoted in sacrifice; slightly to weight its sacrifice is indeed fitting.',
    idiomatic: 'The Five Emperors remain great sacrifice; Great One should not be demoted; weighting its sacrifice is fitting.',
  },
  s0560: {
    literal: 'Liu Xiang said: "The old canon of spirits established by the ancestors is truly not easy to move."',
    idiomatic: 'Liu Xiang: "Ancestors\' spirit canon is not easy to move."',
  },
  s0561: {
    literal: '" He also said: "Ancient and modern differ in institution; the classics have no explicit text; the most honored is most weighty—hard to correct by doubtful discourse."',
    idiomatic: '" He also said: "Institutions differ; classics lack explicit text; the most honored is hard to correct by doubtful discourse."',
  },
  s0562: {
    literal: '" His intent was not to fault the ancestors\' old canon.',
    idiomatic: '" He did not wish to fault the ancestors\' canon.',
  },
  s0563: {
    literal: 'With Liu Xiang\'s broad mastery, change was still difficult; how much more for your servants, whose learning does not reach to Heaven and man and whose knowledge is especially blind in sacrifice canon—wishing to deliberate in the middle, I fear we may not hit it.',
    idiomatic: 'Liu Xiang, though learned, found change hard; we are less versed in Heaven, man, and sacrifice—deliberation may miss the mark.',
  },
  s0564: {
    literal: 'I humbly hope Your Majesty will further order the Grand Master of Splendid Happiness together with academic officers to fix it in detail, that we may obtain clear evidence.',
    idiomatic: 'I beg that the Grand Master of Splendid Happiness and academic officers fix it in detail for clear evidence.',
  },
  s0565: {
    literal: 'It was followed.',
    idiomatic: 'Approved.',
  },
  s0566: {
    literal: 'Acting Left Vice Director and Grand Master of Splendid Happiness Wang Qi, Guangwen Erudite Lu Jiu, and others presented deliberation:',
    idiomatic: 'Acting Left Vice Director Wang Qi, Guangwen Erudite Lu Jiu, and others deliberated:',
  },
  s0567: {
    literal: 'I submit that the Nine Palaces Noble Spirits occupy positions among the constellations;',
    idiomatic: 'The Nine Palaces Noble Spirits occupy constellation positions;',
  },
  s0568: {
    literal: 'formerly, because blessing was obtained, an edict established the altar.',
    idiomatic: 'blessing once obtained, an edict established the altar.',
  },
  s0569: {
    literal: 'the most honored styled himself subject and went to the eastern suburb to bow in person.',
    idiomatic: 'the most honored styled himself subject and bowed at the eastern suburb.',
  },
  s0570: {
    literal: 'In the sacrifice canon it was said to exceed ritual, yet sheltering the myriad lives—would one worry over lack of text? Thinking to bless the black-haired people, he specially declared solemn service—truly the sage bent himself to settle the mind of all under Heaven.',
    idiomatic: 'The canon called it excessive, yet to shelter all lives—why lack text? To bless the people he declared solemn service—the sage bent himself to settle the realm.',
  },
  s0571: {
    literal: 'Afterward the prayer officers were unclear and sincerity also slackened; ritual officers proposed demotion to middle sacrifice.',
    idiomatic: 'Later prayer officers grew unclear and sincerity slackened; ritual officers proposed middle sacrifice.',
  },
  s0572: {
    literal: 'Now sagely virtue is anxious and diligent, expecting to reach the realm of longevity; war, famine, flood, and drought fill waking and sleeping with care; therefore terrace ministers were ordered to gather and revive the fallen canon.',
    idiomatic: 'Now sagely virtue is diligent, longing for longevity; war, famine, flood, and drought fill your care; terrace ministers were ordered to revive the fallen canon.',
  },
  s0573: {
    literal: 'I respectfully consider the spirits called by the Nine Palaces: they are Great One, Grasping the Handle, Chariot Axis, Alluring, Heaven Talisman, Azure Dragon, Salt Pool, Great Yin, and Heaven One.',
    idiomatic: 'The Nine Palaces spirits are Great One, Grasping the Handle, Chariot Axis, Alluring, Heaven Talisman, Azure Dragon, Salt Pool, Great Yin, and Heaven One.',
  },
  s0574: {
    literal: 'I respectfully consult the Yellow Emperor\'s Classic of the Nine Palaces and Xiao Ji\'s Great Meaning of the Five Phases: "First palace—its spirit Great One, its star Celestial Rampart, its hexagram Kan, its phase water, its direction white.',
    idiomatic: 'The Yellow Emperor\'s Nine Palaces and Xiao Ji\'s Five Phases: "First palace—spirit Great One, star Celestial Rampart, hexagram Kan, phase water, direction white.',
  },
  s0575: {
    literal: 'Second palace—its spirit Grasping the Handle, its star Celestial Core, its hexagram Kun, its phase earth, its direction black.',
    idiomatic: 'Second palace—spirit Grasping the Handle, star Celestial Core, hexagram Kun, phase earth, direction black.',
  },
  s0576: {
    literal: 'Third palace—its spirit Chariot Axis, its star Celestial Assault, its hexagram Zhen, its phase wood, its direction blue-green.',
    idiomatic: 'Third palace—spirit Chariot Axis, star Celestial Assault, hexagram Zhen, phase wood, direction blue-green.',
  },
  s0577: {
    literal: 'Fourth palace—its spirit Alluring, its star Celestial Assistant, its hexagram Xun, its phase wood, its direction green.',
    idiomatic: 'Fourth palace—spirit Alluring, star Celestial Assistant, hexagram Xun, phase wood, direction green.',
  },
  s0578: {
    literal: 'Fifth palace—its spirit Heaven Talisman, its star Celestial Poultry, its hexagram Li, its phase earth, its direction yellow.',
    idiomatic: 'Fifth palace—spirit Heaven Talisman, star Celestial Poultry, hexagram Li, phase earth, direction yellow.',
  },
  s0579: {
    literal: 'Sixth palace—its spirit Azure Dragon, its star Celestial Heart, its hexagram Qian, its phase metal, its direction white.',
    idiomatic: 'Sixth palace—spirit Azure Dragon, star Celestial Heart, hexagram Qian, phase metal, direction white.',
  },
  s0580: {
    literal: 'Seventh palace—its spirit Salt Pool, its star Celestial Pillar, its hexagram Dui, its phase metal, its direction red.',
    idiomatic: 'Seventh palace—spirit Salt Pool, star Celestial Pillar, hexagram Dui, phase metal, direction red.',
  },
  s0581: {
    literal: 'Eighth palace—its spirit Great Yin, its star Celestial Assignment, its hexagram Gen, its phase earth, its direction white.',
    idiomatic: 'Eighth palace—spirit Great Yin, star Celestial Assignment, hexagram Gen, phase earth, direction white.',
  },
  s0582: {
    literal: 'Ninth palace—its spirit Heaven One, its star Celestial Hero, its hexagram Li, its phase fire, its direction purple."',
    idiomatic: 'Ninth palace—spirit Heaven One, star Celestial Hero, hexagram Li, phase fire, direction purple."',
  },
  s0583: {
    literal: '" Observing that they comprehend the Eight Trigrams and operate the Five Phases, earth flies in the center and numbers turn at the pole—though reverent service to welcome blessing is not heard in the classics, yet encompassing and nurturing has helped flourishing times; on this account the two reigns\' personal sacrifice attained the hundred auspices.',
    idiomatic: '" They comprehend the Eight Trigrams and operate the Five Phases; earth flies at center and numbers turn at the pole—though classics do not record reverent welcome of blessing, their encompassing nurture helped flourishing times; two reigns\' personal sacrifice attained hundred auspices.',
  },
  s0584: {
    literal: 'Yet the essence of the myriad things ascends as ordered stars; the stars\' motion must depend on things.',
    idiomatic: 'Yet myriad essences ascend as stars; stars\' motion depends on things.',
  },
  s0585: {
    literal: 'Those noble in station must govern the eight qi and total the myriad spirits, turning authority and transformation in the vast dark and assigning categories in yin influence—truly participating with Heaven, Earth, sun, and moon.',
    idiomatic: 'The noble govern eight qi and myriad spirits, turning authority in the vast dark and assigning categories in yin influence—truly with Heaven, Earth, sun, and moon.',
  },
  s0586: {
    literal: 'How can one still rely on their spreading blessings yet demote them to equal rank?',
    idiomatic: 'How can one rely on their blessings yet demote them to equal rank?',
  },
  s0587: {
    literal: 'Also according to the old rite for the regent Grand Marshal\'s sacrifice to the Nine Palaces Noble Spirits: seven days before, oath and abstinence are received at the Department of State Affairs; dispersed abstinence four days, concentrated abstinence three days.',
    idiomatic: 'Per the regent Grand Marshal\'s old Nine Palaces rite: seven days before, oath and abstinence at State Affairs; four days dispersed abstinence, three concentrated.',
  },
  s0588: {
    literal: 'Victims use calves.',
    idiomatic: 'Victims were calves.',
  },
  s0589: {
    literal: 'Prayer boards bore the imperial signature, styling heir Son of Heaven subject.',
    idiomatic: 'Prayer boards bore the imperial signature: "heir Son of Heaven subject."',
  },
  s0590: {
    literal: 'Jade disks, silks, and music completed.',
    idiomatic: 'Jade disks, silks, and music completed the rite.',
  },
  s0591: {
    literal: 'Compared to middle sacrifice, there was no gradation.',
    idiomatic: 'Unlike middle sacrifice, it lacked gradation.',
  },
  s0592: {
    literal: 'Now according to the Collected Rites of Jiangdu and the Kaiyuan Rites: on the wax-sacrifice day, the two seats Great Brightness and Night Brightness and Morning Sun and Evening Moon—the emperor presenting prayer all styled himself subject.',
    idiomatic: 'The Collected Rites of Jiangdu and Kaiyuan Rites: on wax day, Great Brightness, Night Brightness, Morning Sun, and Evening Moon—all prayer styled the emperor subject.',
  },
  s0593: {
    literal: 'If one holds that it is not the time of matching sacrifice at the greatest altar, one obtains the meaning of reporting to Heaven on the main day.',
    idiomatic: 'If not the greatest altar\'s matching sacrifice, it still holds the meaning of reporting to Heaven on the main day.',
  },
  s0594: {
    literal: 'The low by nature bends; the honored extend through virtue—not to be listed as middle sacrifice or taken as ordinary sacrifice.',
    idiomatic: 'The low bend by nature; the honored extend through virtue—not middle sacrifice or ordinary sacrifice.',
  },
  s0595: {
    literal: 'This is the meaning of middle sacrifice using great-sacrifice rites.',
    idiomatic: 'This is middle sacrifice using great-sacrifice rites.',
  },
  s0596: {
    literal: 'Also according to the Grand Altars of Soil and Grain—in Kaiyuan\'s institution they were listed as middle sacrifice.',
    idiomatic: 'Grand Altars of Soil and Grain were middle sacrifice under Kaiyuan.',
  },
  s0597: {
    literal: 'On the Tianbao year 3, second month, fourteenth day edict, they were changed to great sacrifice; afterward by inertia the former rite was again used.',
    idiomatic: 'Tianbao 3, second month, day 14 made them great sacrifice; afterward the former rite returned by inertia.',
  },
  s0598: {
    literal: 'In the first month of Changqing year 3, ritual officers presented deliberation and first followed the former edict, calling them great sacrifice.',
    idiomatic: 'Changqing 3, first month: ritual officers followed the former edict and called them great sacrifice.',
  },
  s0599: {
    literal: 'Only the imperially signed prayer text styled "Son of Heaven respectfully dispatches a certain official to brightly report."',
    idiomatic: 'Only the signed prayer said "Son of Heaven respectfully dispatches an official to brightly report."',
  },
  s0600: {
    literal: 'In textual meaning, because they propagate things and grain the people, rank ought to be increased; presenting prayer and styling prayer differ from the square mound—not to extend as great sacrifice, and so the honored title was bent.',
    idiomatic: 'As they propagate things and grain the people, rank should rise; prayer differs from the square mound—not extending as great sacrifice, so the honored title was bent.',
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
if (data.metadata.chapter !== '024') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 024; standalone T ready (${Object.keys(T).length} entries).`
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
