#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.022, Bright Hall treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/022.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
  s0401: {
    literal: 'I am in the bingsi quarter, far from the palace halls; each month I move residence for seasonal offerings, constantly keeping ritual vessels in readiness—a constant burden, and in my heart this is hardly what is meant.',
    idiomatic: 'My seat lies in the bingsi quarter, far from the palace halls; each month I shift residence for seasonal rites, keeping vessels always in readiness—a constant burden, and hardly what I intend.',
  },
  s0402: {
    literal: 'Now therefore we trim the foundation at the Purple Forbidden, open chambers at the red gate; the work has just begun and will not take many days to finish.',
    idiomatic: 'We have trimmed the foundation at the Purple Forbidden and opened chambers at the red gate; the work has only begun, yet it will not take many days to finish.',
  },
  s0403: {
    literal: 'Only when one reverently serves Heaven and Earth does the virtue of the spirits and gods shine forth;',
    idiomatic: 'Only when Heaven and Earth are served with reverence does the virtue of spirits and gods shine forth;',
  },
  s0404: {
    literal: 'only when one honors and sacrifices to the ancestors does the will of solemn respect unfold.',
    idiomatic: 'only when ancestors are honored in sacrifice does solemn respect unfold.',
  },
  s0405: {
    literal: 'If one speaks only of dispensing government while leaning on the screen to face the people, then a thatched roof and earthen steps would suffice—why must one weary the people\'s strength and build nine mats to receive them!',
    idiomatic: 'If governance alone were the aim—leaning on the screen to face the realm—a thatched roof and earthen steps would suffice. Why weary the people and build nine mats to receive them?',
  },
  s0406: {
    literal: 'Truly it is because one obtains and holds the water-plant offerings and reverently serves the ancestral temple.',
    idiomatic: 'Truly it is to hold the offerings and serve the ancestral temple with reverence.',
  },
  s0407: {
    literal: 'Times have changed and none follow the old; I myself make the antiquity, fitting it to the affair.',
    idiomatic: 'Times have changed and none follow the old; we make the rite anew, fitting it to present need.',
  },
  s0408: {
    literal: 'Now the upper hall is the place of solemn matching sacrifice, the lower hall the seat of dispensing government—radiating ritual instruction, displaying sincerity and reverence.',
    idiomatic: 'The upper hall is for solemn matching sacrifice, the lower for government—radiating ritual teaching, displaying sincerity and reverence.',
  },
  s0409: {
    literal: 'On the first day of the first month of the coming year, one may at the Bright Hall perform the ancestral sacrifice to the Three Sages, matching them to the High God.',
    idiomatic: 'On the first day of the first month next year, at the Bright Hall perform the ancestral sacrifice to the Three Sages, matching them to the High God.',
  },
  s0410: {
    literal: 'Let ritual officers, erudites, academicians, and all within and without who understand ritual fix the ceremonies in detail, striving for canonical essentials, and report swiftly.',
    idiomatic: 'Let ritual officers, erudites, academicians, and all who understand ritual within and without fix the ceremonies in detail, strive for canonical essentials, and report swiftly.',
  },
  s0411: {
    literal: 'On the first day of the first month of Yongchang year 1, he first personally performed the Bright Hall sacrifice, proclaimed a great amnesty, and changed the era name.',
    idiomatic: 'On the first day of the first month of Yongchang year 1, she first personally sacrificed at the Bright Hall, proclaimed a great amnesty, and changed the era name.',
  },
  s0412: {
    literal: 'On the fourth day of that month, he attended the Bright Hall to dispense government and issued nine articles of instruction to admonish the hundred officials.',
    idiomatic: 'On the fourth day of that month, she attended the Bright Hall to dispense government and issued nine articles of instruction to admonish the hundred officials.',
  },
  s0413: {
    literal: 'The text is lengthy and not recorded here.',
    idiomatic: 'The text is lengthy and is not recorded here.',
  },
  s0414: {
    literal: 'The next day, he again attended the Bright Hall, feasted the host of ministers, and bestowed silk and hemp cloth in graded amounts.',
    idiomatic: 'The next day, she again attended the Bright Hall, feasted the ministers, and bestowed silk and hemp in graded amounts.',
  },
  s0415: {
    literal: 'After the Bright Hall was completed, women of the eastern capital and elders from the various prefectures were allowed to enter and view it; food and drink were also bestowed—this continued for a long time before it ceased.',
    idiomatic: 'After the Bright Hall was completed, women of the eastern capital and elders from the prefectures were admitted to view it; food and drink were bestowed as well—this continued long before it ceased.',
  },
  s0416: {
    literal: 'Tibet and the various Yi peoples, because the Bright Hall was completed, each also sent envoys to offer congratulations.',
    idiomatic: 'Tibet and the various Yi peoples, learning the Bright Hall was completed, each sent envoys to congratulate.',
  },
  s0417: {
    literal: 'On the first day of the first month of winter in Zaichu year 1, gengchen, the new moon—the winter solstice—he again personally feasted at the Bright Hall, proclaimed a great amnesty, changed the era name, and adopted the Zhou calendar beginning.',
    idiomatic: 'On the winter solstice, first day of the first month of Zaichu year 1, gengchen, she again personally feasted at the Bright Hall, proclaimed a great amnesty, changed the era name, and adopted the Zhou calendar.',
  },
  s0418: {
    literal: 'The next day, he dispensed government to the host of nobles.',
    idiomatic: 'The next day, she dispensed government to the nobles.',
  },
  s0419: {
    literal: 'In the second month of that year, Wu Zetian again attended the Bright Hall and broadly opened the Three Teachings.',
    idiomatic: 'In the second month of that year, Wu Zetian again attended the Bright Hall and broadly opened the Three Teachings',
  },
  s0420: {
    literal: 'Inner Secretariat Director Xing Wenwei lectured on the Classic of Filial Piety; she ordered attending ministers and monks and Daoist masters and others to debate in turn—the sun slanted westward before they finished.',
    idiomatic: 'Inner Secretariat Director Xing Wenwei lectured on the Classic of Filial Piety; she ordered attending ministers, monks, and Daoist masters to debate in turn until the sun stood in the west.',
  },
  s0421: {
    literal: 'On yiyou, the winter solstice, in the first month of Tianshou year 2, he personally sacrificed at the Bright Hall, jointly sacrificing Heaven and Earth, matching King Wen of Zhou and Wu\'s deceased father and mother, with the hundred spirits following in sacrifice—all at the altar seats, mats laid in sequence for worship.',
    idiomatic: 'On yiyou, the winter solstice, in the first month of Tianshou year 2, she personally sacrificed at the Bright Hall, jointly sacrificing Heaven and Earth, matching King Wen of Zhou and the Wu clan\'s deceased father and mother, with the hundred spirits following—all at the altar seats, mats laid in sequence.',
  },
  s0422: {
    literal: 'Thereupon Spring Office Gentleman Wei Shuxia memorialized: "Per your servant\'s examination, the Bright Hall great offering sacrifices only to the Five Emperors.',
    idiomatic: 'Thereupon Spring Office Gentleman Wei Shuxia memorialized: "By your servant\'s examination, the Bright Hall great offering sacrifices only to the Five Emperors.',
  },
  s0423: {
    literal: 'Thus the Monthly Ordinances says: "In this month, the great offering to the Emperors."',
    idiomatic: 'The Monthly Ordinances says: "In this month, the great offering to the Emperors."',
  },
  s0424: {
    literal: '" Then what the Ceremonies says—"the great offering does not ask the tortoise"—Zheng Xuan\'s note explains: "meaning to sacrifice to the Five Emperors throughout at the Bright Hall, with no need to divine"—is correct.',
    idiomatic: '" What the Ceremonies calls "the great offering does not ask the tortoise"—Zheng Xuan explains as sacrificing to the Five Emperors throughout at the Bright Hall without divination—is correct.',
  },
  s0425: {
    literal: 'Again per the Sacrificial Canon: "Take King Wen as zu and King Wu as zong."',
    idiomatic: 'Per the Sacrificial Canon: "Take King Wen as zu and King Wu as zong."',
  },
  s0426: {
    literal: 'Zheng Xuan\'s note says: "Sacrificing to the Five Emperors and Five Spirits at the Bright Hall is called zu and zong."',
    idiomatic: 'Zheng Xuan notes: "Sacrificing to the Five Emperors and Five Spirits at the Bright Hall is called zu and zong."',
  },
  s0427: {
    literal: 'Thus the Classic of Filial Piety says: "The zong sacrifice to King Wen at the Bright Hall, matching the High God."',
    idiomatic: 'The Classic of Filial Piety says: "The zong sacrifice to King Wen at the Bright Hall, matching the High God."',
  },
  s0428: {
    literal: 'By these texts, the correct rite of the Bright Hall sacrifices only to the Five Emperors, matching ancestors and the Five Emperors and Five Official Spirits and the like; all other spirits beyond these should not participate.',
    idiomatic: 'By these texts, the correct Bright Hall rite sacrifices only to the Five Emperors, matching ancestors and the Five Emperors and Five Official Spirits; all other spirits should not participate.',
  },
  s0429: {
    literal: 'Your Majesty, in pursuing the distant past, affection runs deep; in honoring the suburban sacrifice, will is keen—at the Bright Hall sacrifice adding August Heaven High God and August Earth Spirit, further matching the Former Emperor and Former Empress in joint offering: this repairs the former kings\' missing canon and extends the sincerity of solemn matching sacrifice.',
    idiomatic: 'Your Majesty, pursuing the distant past, affection runs deep; in honoring the suburban sacrifice, will is keen—at the Bright Hall adding August Heaven High God and August Earth Spirit, further matching the Former Emperor and Former Empress: this repairs the former kings\' missing canon and extends solemn matching sacrifice.',
  },
  s0430: {
    literal: 'Formerly, because the Divine Capital suburban altars were not yet built, one broadly sacrificed the host of spirits below the Bright Hall—meaning born of expedient times, not an unalterable rite.',
    idiomatic: 'Formerly, because the Divine Capital suburban altars were not built, the host of spirits was sacrificed below the Bright Hall—born of expedient times, not an unalterable rite.',
  },
  s0431: {
    literal: 'Per the ritual classics, the inner-office spirits, palace spirits, Five Marchmounts, and Four Watercourses should all follow in sacrifice at the two solstices.',
    idiomatic: 'Per the ritual classics, inner-office spirits, palace spirits, the Five Marchmounts, and Four Watercourses should all follow in sacrifice at the two solstices.',
  },
  s0432: {
    literal: 'A general offering at the Bright Hall is an uncanonical affair.',
    idiomatic: 'A general offering at the Bright Hall is uncanonical.',
  },
  s0433: {
    literal: 'Yet the zong sacrifice matching Heaven is intimate, while miscellaneous small spirits are offered together—in the way of solemn reverence, reason finds this unsettled.',
    idiomatic: 'Yet the zong sacrifice matching Heaven is intimate, while small spirits are offered together—in solemn reverence, reason finds this unsettled.',
  },
  s0434: {
    literal: 'Your servant hopes that each year on New Year\'s Day only the great spirits of Heaven and Earth be sacrificed to, matching the Emperor and Empress.',
    idiomatic: 'Your servant hopes that each New Year\'s Day only the great spirits of Heaven and Earth be sacrificed to, matching the Emperor and Empress.',
  },
  s0435: {
    literal: 'For the Five Marchmounts and below, let them follow ritual at the winter and summer solstices, following sacrifice at the square mound and round mound, so that there be no troublesome repetition.',
    idiomatic: 'For the Five Marchmounts and below, let them follow ritual at winter and summer solstice sacrifice at the square mound and round mound, avoiding troublesome repetition.',
  },
  s0436: {
    literal: '" The proposal was accepted.',
    idiomatic: '" The proposal was accepted',
  },
  s0437: {
    literal: 'At that time Wu Zetian also built the Hall of Paradise behind the Bright Hall to house Buddha images, more than a hundred chi in height.',
    idiomatic: 'At that time Wu Zetian also built the Hall of Paradise behind the Bright Hall to house Buddha images, more than a hundred chi high.',
  },
  s0438: {
    literal: 'When construction first began, a great wind shook it down.',
    idiomatic: 'When construction first began, a great wind shook it down',
  },
  s0439: {
    literal: 'Shortly they rebuilt it, but the work was not finished.',
    idiomatic: 'Shortly they rebuilt, but the work was not finished.',
  },
  s0440: {
    literal: 'On the night of bingchen in the first month of Zhengsheng year 1, the Buddha hall caught fire and the blaze spread to the Bright Hall; by dawn both halls were entirely consumed.',
    idiomatic: 'On the night of bingchen in the first month of Zhengsheng year 1, the Buddha hall caught fire and spread to the Bright Hall; by dawn both halls were entirely consumed.',
  },
  s0441: {
    literal: 'Shortly afterward thunder sounded though there were no clouds, rising from the northwest.',
    idiomatic: 'Shortly afterward thunder sounded though there were no clouds, rising from the northwest',
  },
  s0442: {
    literal: 'Wu Zetian wished to blame herself and avoid the main hall.',
    idiomatic: 'Wu Zetian wished to blame herself and avoid the main hall',
  },
  s0443: {
    literal: 'Chancellor Yao Shuang said: "This is truly human fire, not a heaven-sent calamity.',
    idiomatic: 'Chancellor Yao Shuang said: "This is truly human fire, not a heaven-sent calamity',
  },
  s0444: {
    literal: 'As for the Zhou of King Xuan\'s terrace, divination showed the dynasty would long endure;',
    idiomatic: 'As for King Xuan of Zhou\'s terrace, divination showed the dynasty would long endure;',
  },
  s0445: {
    literal: 'Emperor Wu of Han\'s Jianzhang Palace—its flourishing virtue endured ever longer.',
    idiomatic: 'Emperor Wu of Han\'s Jianzhang Palace—its flourishing virtue endured the longer.',
  },
  s0446: {
    literal: 'Now the Bright Hall is the place for dispensing government, not for ancestral sacrifice."',
    idiomatic: 'Now the Bright Hall is the place for dispensing government, not ancestral sacrifice."',
  },
  s0447: {
    literal: 'Wu Zetian thereupon attended the Vermilion Gate to view the communal feast, and issued an edict ordering civil and military officials of the ninth rank and above each to submit sealed memorials, speaking fully without concealment.',
    idiomatic: 'Wu Zetian thereupon attended the Vermilion Gate to view the communal feast and issued an edict ordering civil and military officials of the ninth rank and above to submit sealed memorials, speaking fully without concealment.',
  },
  s0448: {
    literal: 'Left Reminder Liu Chengqing submitted a memorial, saying:',
    idiomatic: 'Left Reminder Liu Chengqing submitted a memorial:',
  },
  s0449: {
    literal: 'Your servant has heard that since antiquity emperors and kings have all had good and ill; auspicious omens thereby display their virtue, calamities and transformations thereby reveal their faults—the constant principle of Heaven\'s Way, the constant affair of kings.',
    idiomatic: 'Your servant has heard that since antiquity emperors and kings have all had good and ill; auspicious omens display their virtue, calamities reveal their faults—the constant principle of Heaven\'s Way, the constant affair of kings.',
  },
  s0450: {
    literal: 'Yet when auspicious omens arrive repeatedly, one must not boast of achievement and grow self-satisfied;',
    idiomatic: 'Yet when auspicious omens arrive repeatedly, one must not boast and grow self-satisfied;',
  },
  s0451: {
    literal: 'when calamities and transformations descend suddenly, one must not treat them lightly and fail to be alarmed.',
    idiomatic: 'when calamities descend suddenly, one must not treat them lightly and fail to be alarmed.',
  },
  s0452: {
    literal: 'Thus the Yin ruler, when mulberry and grain grew in the court, harbored fear and examined himself—evil could not overcome virtue, and he thereupon established the achievement of restoration;',
    idiomatic: 'Thus the Yin ruler, when mulberry and grain grew in the court, harbored fear and examined himself—evil could not overcome virtue, and he established the achievement of restoration;',
  },
  s0453: {
    literal: 'Xin Zhou, when a sparrow hatched a great bird, relied on fortune and grew full—auspice could not overcome arrogance, and in the end he met the calamity of ruin.',
    idiomatic: 'King Zhou of Xin, when a sparrow hatched a great bird, relied on fortune and grew full—auspice could not overcome arrogance, and in the end he met ruin.',
  },
  s0454: {
    literal: 'Thus one knows that the birth of calamities and transformations is to awaken and enlighten the enlightened ruler, to support the great enterprise, so that flourishing does not decay.',
    idiomatic: 'Thus calamities are born to awaken the enlightened ruler, support the great enterprise, and keep flourishing from decay.',
  },
  s0455: {
    literal: 'Reason demands reverent fear of the spirit heart, alarm at Heaven\'s admonition, correcting the person and rectifying affairs, diligent and cautious—then the inauspicious departs and the auspicious comes, misfortune turns to fortune.',
    idiomatic: 'Reason demands reverent fear of the spirits, alarm at Heaven\'s admonition, correcting the person and rectifying affairs, diligent and cautious—then the inauspicious departs, the auspicious comes, and misfortune turns to fortune.',
  },
  s0456: {
    literal: 'Formerly Yin Tang prayed with his person and rain fell; King Cheng reduced affairs and the wind returned; Duke Mu of Song feared the Mars calamity and received the blessing of three lodges\' longevity; Emperor Gaozong chastised the crowing tripod anomaly and enjoyed a hundred years\' fortune—these are of that kind.',
    idiomatic: 'Formerly Tang prayed with his person and rain fell; King Cheng reduced affairs and the wind returned; Duke Mu of Song feared the Mars calamity and received three lodges\' longevity; Emperor Gaozong chastised the crowing tripod and enjoyed a hundred years\' fortune—these are of that kind.',
  },
  s0457: {
    literal: 'Since Your Majesty received Heaven\'s principle and ordered the myriad things, utmost Way serving the spirits—beautiful omens and auspicious signs arriving in succession, close and abundant—not what your servant can fully narrate.',
    idiomatic: 'Since Your Majesty received Heaven\'s principle and ordered the myriad things, serving the spirits with utmost Way—beautiful omens arriving in succession, close and abundant—more than your servant can fully narrate.',
  },
  s0458: {
    literal: 'Recently human fire arose, damaging the spirit palace—alarming the sage heart, shaking the black-haired people.',
    idiomatic: 'Recently human fire arose, damaging the spirit palace—alarming the sage heart, shaking the people.',
  },
  s0459: {
    literal: 'Your servant respectfully per the Zuo Commentary: "Human fire is called huo; heaven fire is called zai."',
    idiomatic: 'respectfully per the Zuo Commentary: "Human fire is called huo; heaven fire is called zai."',
  },
  s0460: {
    literal: 'Human fire arises because of men, hence it names the fire itself;',
    idiomatic: 'Human fire arises through men, hence it names the fire itself;',
  },
  s0461: {
    literal: 'heaven fire—one does not know whence it starts, and speaks only of what was harmed.',
    idiomatic: 'heaven fire—one does not know whence it starts, and speaks only of what was harmed',
  },
  s0462: {
    literal: 'The names differ, but the harm does not.',
    idiomatic: 'The names differ, but the harm does not',
  },
  s0463: {
    literal: 'Again the Han Documents, Treatise on the Five Phases: "When fire loses its nature it descends from above; when flames spread wantonly, it calamities the ancestral temple and burns palaces and lodges."',
    idiomatic: 'Again the Han Documents, Treatise on the Five Phases: "When fire loses its nature it descends from above; when flames spread wantonly, it calamities the ancestral temple and burns palaces."',
  },
  s0464: {
    literal: 'Descending from above is what is called heaven fire;',
    idiomatic: 'Fire descending from above is called heaven fire;',
  },
  s0465: {
    literal: 'flames spreading wantonly is what is called human fire.',
    idiomatic: 'flames spreading wantonly is what is called human fire',
  },
  s0466: {
    literal: 'Their coming differs, but the affliction is truly the same.',
    idiomatic: 'Their coming differs, but the affliction is the same.',
  },
  s0467: {
    literal: 'The king\'s raising, moving, building, and acting must touch the hidden and manifest.',
    idiomatic: 'The king\'s raising, moving, building, and acting must touch the hidden and manifest',
  },
  s0468: {
    literal: 'The hidden is Heaven\'s Way, the manifest human affairs; hidden and manifest traces connect, Heaven and human principle unite.',
    idiomatic: 'The hidden is Heaven\'s Way, the manifest human affairs; hidden and manifest connect, Heaven and human principle unite.',
  },
  s0469: {
    literal: 'Now craftsmen had long kept their fire—they had no mind to set a blaze: the Bright Hall is the palace of teaching and transformation, and again is not a place where fire spreads.',
    idiomatic: 'Now craftsmen had long kept their fire—they had no mind to set a blaze: the Bright Hall is the palace of teaching, and again is not a place where fire spreads.',
  },
  s0470: {
    literal: 'Baleful flames were secretly fanned and in a moment became calamity—though it arose through men, it also touches the spirit principle.',
    idiomatic: 'Baleful flames were secretly fanned and in a moment became calamity—though it arose through men, it also touches the spirit principle',
  },
  s0471: {
    literal: 'Your servant foolishly thinks the fire first started at the hemp master\'s quarters, then reached the Total Splendor hall—meaning the Buddha lodge under construction, feared labor without benefit.',
    idiomatic: 'Your servant thinks the fire first started at the hemp master\'s quarters, then reached Total Splendor—meaning the Buddha lodge under construction, labor without benefit.',
  },
  s0472: {
    literal: 'Only honor the teaching—that itself is the ford; why need indigo palaces, speaking of drawing up water?',
    idiomatic: 'Only honor the teaching—that itself is the ford; why need indigo palaces to draw up water?',
  },
  s0473: {
    literal: 'It stands secluded behind the Bright Hall and also presses close before the sacrificial beast pens—moreover its structure is lofty and great, the work many and hard to finish.',
    idiomatic: 'It stands secluded behind the Bright Hall and presses before the sacrificial beast pens—moreover its structure is lofty, the work hard to finish.',
  },
  s0474: {
    literal: 'Erecting images to spread the Law was originally meant to benefit the black-haired people; injuring wealth and conscripting men instead only wearies state and family.',
    idiomatic: 'Erecting images to spread the Law was meant to benefit the people; injuring wealth and conscripting men instead wearies state and family.',
  },
  s0475: {
    literal: 'Formerly the great wind toppled the timber—Heaven\'s admonition was already plain;',
    idiomatic: 'Earlier the great wind toppled the timber—Heaven\'s admonition was already plain;',
  },
  s0476: {
    literal: 'now poisonous flames burn darkly—human evil is again displayed.',
    idiomatic: 'now poisonous flames burn darkly—human evil is again displayed',
  },
  s0477: {
    literal: 'The sage\'s movements must borrow the help of Heaven and man; once labor and conscription are raised, both are violated—the response is plain, and peril will likely follow from this.',
    idiomatic: 'The sage\'s movements must borrow Heaven and man; once labor is raised, both are violated—the response is plain, and peril will likely follow.',
  },
  s0478: {
    literal: 'Your servant thinks the Bright Hall is the position of upright yang, where the Most High dwells—displaying ritual, ordering the constant, honoring transformation and establishing government; jade and silk assemblies, spirits relying upon it.',
    idiomatic: 'thinks the Bright Hall is the position of upright yang, where the Most High dwells—displaying ritual, ordering the constant, honoring transformation and establishing government; jade and silk assemblies, spirits relying upon it.',
  },
  s0479: {
    literal: 'To build it may be called a great achievement; to damage it is truly no light matter—having lost the place of solemn sacrifice, again injuring the feeling of filial principle.',
    idiomatic: 'To build it is a great achievement; to damage it is no light matter—having lost the place of solemn sacrifice, again injuring filial feeling.',
  },
  s0480: {
    literal: 'Your Majesty yesterday issued a bright edict still declaring the intent of reverent fear; the host of officials by reason ought to be reverent, alarmed, and trembling, striving in their offices—how should they accept favor, indulge in pleasure, and calmly feast?',
    idiomatic: 'Your Majesty yesterday issued a bright edict still declaring reverent fear; officials ought to be alarmed and trembling, striving in office—how accept favor, indulge in pleasure, and calmly feast?',
  },
  s0481: {
    literal: 'Moreover the people below, grateful for sage virtue, seeing the transformation are fearful and alarmed—the spirit body can be at peace; is this not deep joy?',
    idiomatic: 'Moreover the people below, grateful for sage virtue, seeing the transformation are fearful—the spirit body can be at peace; is this not deep joy?',
  },
  s0482: {
    literal: 'But the fire\'s breath has only just ceased and alarm remains great; further worry has not subsided, yet suddenly joy affairs are used to check it.',
    idiomatic: 'But the fire has only just ceased and alarm remains; further worry has not subsided, yet joy affairs are used to check it.',
  },
  s0483: {
    literal: 'Your servant fears worry and joy contending injures reason and feeling.',
    idiomatic: 'fears worry and joy contending injures reason and feeling.',
  },
  s0484: {
    literal: 'Thus the tradition says: "What should be worried about, yet made joy—that is the way to fetch worry."',
    idiomatic: 'The tradition says: "To make joy of what should worry you is the way to fetch worry."',
  },
  s0485: {
    literal: 'Again in antiquity when there was fire, one sacrificed at the four embankments.',
    idiomatic: 'in antiquity when there was fire, one sacrificed at the four embankments.',
  },
  s0486: {
    literal: 'The four embankments are accumulated yin qi; one prayed thereby to avert fire calamity.',
    idiomatic: 'The four embankments are accumulated yin qi; one prayed thereby to avert fire.',
  },
  s0487: {
    literal: 'Fire is yang qi; joy is a yang affair—when fire\'s qi is victorious, one cannot again raise a yang affair.',
    idiomatic: 'Fire is yang qi— joy is a yang affair—when fire\'s qi is victorious, one cannot again raise a yang affair.',
  },
  s0488: {
    literal: 'Your servant has heard that the rise of calamities and transformations—even the utmost sage does not escape; cultivate virtue and coming peril can be averted.',
    idiomatic: 'Your servant has heard that calamities—even the utmost sage does not escape; cultivate virtue and coming peril can be averted.',
  },
  s0489: {
    literal: 'Your Majesty issued edicts broadly seeking counsel, permitting the utmost principle to be stated.',
    idiomatic: 'Your Majesty issued edicts broadly seeking counsel, permitting the utmost principle to be stated',
  },
  s0490: {
    literal: 'Yet Left Historian Zhang Ding thought "now that fire flows through the king\'s house, it all the more displays Great Zhou\'s auspice," and Communications Gentleman Feng Min memorialized that "when Maitreya first achieved Buddhahood, heavenly demons burned the palace and the seven-jewel terrace was scattered in a moment."',
    idiomatic: 'Yet Left Historian Zhang Ding thought "now that fire flows through the king\'s house, it all the more displays Great Zhou\'s auspice," and Communications Gentleman Feng Min said "when Maitreya first achieved Buddhahood, heavenly demons burned the palace and the seven-jewel terrace scattered in a moment."',
  },
  s0491: {
    literal: 'These are truly flattery and perverse words, truly not correct discourse between ruler and minister.',
    idiomatic: 'These are flattery and perverse words, not correct discourse between ruler and minister.',
  },
  s0492: {
    literal: 'They dim kingly transformation and benefit not the myriad affairs.',
    idiomatic: 'They dim kingly transformation and benefit not the myriad affairs',
  },
  s0493: {
    literal: 'Heaven\'s Way though high, its scrutiny is ever nearer;',
    idiomatic: 'Though Heaven\'s Way is high, its scrutiny draws ever nearer;',
  },
  s0494: {
    literal: 'the spirit heart though still, its hearing is ever keener.',
    idiomatic: 'the spirit heart though still, its hearing is ever keener',
  },
  s0495: {
    literal: 'Their interchange with emperors and kings is like shadow and echo.',
    idiomatic: 'Their interchange with emperors and kings is like shadow and echo',
  },
  s0496: {
    literal: 'Now great wind and fierce fire, reprimand and admonition following in succession—truly Heaven and man admonishing and instructing the sage ruler, meaning that the great foundation grows ever firmer and Heaven\'s emolument endures forever.',
    idiomatic: 'Now great wind and fierce fire, reprimand following in succession—truly Heaven and man admonishing the sage ruler, meaning the great foundation grows firmer and Heaven\'s emolument endures.',
  },
  s0497: {
    literal: 'Your servant hopes Your Majesty will be qianqian in thought, yiyi in heart, as if crossing a great stream, as if undertaking a great sacrifice—examine the reasons calamity was brought, detail the causes of descending reprimand, do not darken the heart toward Heaven and man, yet raise unurgent labor.',
    idiomatic: 'Your servant hopes Your Majesty will be vigilant in thought, cautious in heart, as if crossing a great stream, as if undertaking a great sacrifice—examine why calamity came, detail the causes of reprimand, do not darken the heart toward Heaven and man, yet raise unurgent labor.',
  },
  s0498: {
    literal: 'Then the myriad people will rely upon you, fortune and emolument without end—most fortunate, most fortunate.',
    idiomatic: 'Then the myriad people will rely upon you, fortune without end—most fortunate, most fortunate.',
  },
  s0499: {
    literal: 'Wu Zetian shortly ordered the Bright Hall rebuilt according to the former regulations; in all it was two hundred ninety-four chi high, three hundred chi wide on east, south, west, and north.',
    idiomatic: 'Wu Zetian shortly ordered the Bright Hall rebuilt to former regulations; in all it was two hundred ninety-four chi high, three hundred chi wide on every side.',
  },
  s0500: {
    literal: 'On top was set a jeweled phoenix; shortly a fire pearl replaced it.',
    idiomatic: 'On top was set a jeweled phoenix— shortly a fire pearl replaced it.',
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
