#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.028, Rites 4 / music) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/028.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: 'Closing quotation mark. When he had finished speaking, he remained deeply grieved for a long time.',
    idiomatic: 'When he finished, he grieved a long while.',
  },
  s0202: {
    literal: 'In the first month, the Breaking-the-Array dance was renamed Divine Merit in Breaking the Array.',
    idiomatic: 'First month: Breaking-the-Array dance renamed Divine Merit in Breaking the Array.',
  },
  s0203: {
    literal: 'In the second year, the Court of Imperial Sacrifices presented the zither piece White Snow.',
    idiomatic: 'Second year: the Court presented the zither piece White Snow.',
  },
  s0204: {
    literal: 'Earlier, because the emperor knew that elegant zither pieces in antiquity were sung but in recent times this practice had abruptly ceased, and though some transmission survived the modes were wrong, he ordered the relevant offices to select music workers skilled at zither and mouth-organ to restore the old pieces.',
    idiomatic: 'Earlier the emperor, knowing ancient elegant zither pieces were sung but the practice had died out and surviving versions had wrong pitches, ordered skilled zither and mouth-organ workers to restore the old repertoire.',
  },
  s0205: {
    literal: 'At this time the Court of Imperial Sacrifices memorialized: "Your servant respectfully notes that the Book of Rites and the Household Sayings state: Shun played the five-string zither and sang the Ode to the Southern Breeze.',
    idiomatic: 'The Court then memorialized: "Per the Book of Rites and Household Sayings, Shun played the five-string zither and sang the Ode to the Southern Breeze.',
  },
  s0206: {
    literal: 'Hence one knows that zither performance and melody all accord with song.',
    idiomatic: 'Thus zither pieces and melodies were all meant to be sung.',
  },
  s0207: {
    literal: 'Moreover Zhang Hua\'s Comprehensive Record states: "White Snow was the name of a fifty-string se piece that the Plain Girl played at the Supreme Emperor\'s command.',
    idiomatic: 'Zhang Hua\'s Comprehensive Record also says: "White Snow was a fifty-string se piece the Plain Girl played for the Supreme Emperor.',
  },
  s0208: {
    literal: '" The Chu grandee Song Yu also told King Xiang of Chu: "A guest in Ying sang Sunny Spring and White Snow; only a few dozen in the state could join in harmony."',
    idiomatic: 'Song Yu told King Xiang: "A guest in Ying sang Sunny Spring and White Snow; only a few dozen could harmonize."',
  },
  s0209: {
    literal: '" Hence the zither piece White Snow was originally meant to be sung; because its mode was high, harmonizers were few.',
    idiomatic: 'So White Snow was meant to be sung; its mode was so high that few could join in.',
  },
  s0210: {
    literal: 'From Song Yu until now, a full millennium has passed with no one able to sing the White Snow melody.',
    idiomatic: 'Since Song Yu, a thousand years have passed with no one able to sing White Snow.',
  },
  s0211: {
    literal: 'Your servant now, pursuant to the edict, relying on the old pieces on the zither, has fixed their modes, then taught them, combining them with song.',
    idiomatic: 'Pursuant to the edict I fixed the modes of the old zither pieces, taught them, and set them to song.',
  },
  s0212: {
    literal: 'I take the imperially composed Snow Poems as the lyrics for White Snow.',
    idiomatic: 'I used the imperial Snow Poems as White Snow\'s lyrics.',
  },
  s0213: {
    literal: 'Moreover, examining ancient and modern Music Bureau pieces, after the main melody is played there is always a separate sending-off vocal; lord sings and ministers respond—a fact plain in earlier histories.',
    idiomatic: 'Ancient and modern Music Bureau pieces also had sending-off vocals after the main tune—lord sings, ministers answer—as earlier histories show.',
  },
  s0214: {
    literal: 'I take the attendant ministers\' responsive snow poems as the sending-off vocals, each of sixteen stanzas; all have now been taught to completion and all rhyme properly."',
    idiomatic: 'I took the ministers\' responsive snow poems as sending-off vocals, sixteen stanzas each; all are taught and rhyme correctly."',
  },
  s0215: {
    literal: 'The emperor approved and had the Court of Imperial Sacrifices compile them into the Music Bureau repertoire.',
    idiomatic: 'The emperor approved and had the Court enter them in the Music Bureau.',
  },
  s0216: {
    literal: 'Second month of the sixth year, Vice Director of the Court Lü Cai composed zither songs including White Snow; the emperor wrote sixteen sets of lyrics, entered into the Music Bureau.',
    idiomatic: 'Sixth year, second month: Lü Cai composed zither songs including White Snow; the emperor wrote sixteen lyrics, entered in the Music Bureau.',
  },
  s0217: {
    literal: 'Third month of the sixth year, as the emperor planned to campaign against Liaodong, he had dance taught at the encampment and summoned Li Yifu, Ren Yaxiang, Xu Jingzong, Xu Yuanshi, Zhang Yanshi, Su Dingfang, Ashina Zhong, the King of Khotan Fuzhe, Shangguan Yi, and others to Luoyang Gate to view the performance.',
    idiomatic: 'Sixth year, third month: planning the Liaodong campaign, he taught dance at camp and summoned Li Yifu, Ren Yaxiang, Xu Jingzong, Xu Yuanshi, Zhang Yanshi, Su Dingfang, Ashina Zhong, the King of Khotan Fuzhe, Shangguan Yi, and others to Luoyang Gate to watch.',
  },
  s0218: {
    literal: 'The piece was titled One Campaign, Great Settlement.',
    idiomatic: 'The piece was One Campaign, Great Settlement.',
  },
  s0219: {
    literal: 'Those granted to view were given brocade silks of varying grades.',
    idiomatic: 'Viewers received brocade silks of varying grades.',
  },
  s0220: {
    literal: 'Tenth month, edict: "The state having pacified the realm and transformed institutions through revolution, recording merit and displaying virtue has long been clothed in music.',
    idiomatic: 'Tenth month, edict: "Having pacified the realm and remade institutions, recording merit in music is long established.',
  },
  s0221: {
    literal: 'Yet at suburban sacrifice the four suspended sets still use shield-and-axe dances; music composed by prior courts lies wrapped away and unperformed.',
    idiomatic: 'Yet suburban sacrifice still uses shield-and-axe dance on the four suspensions; prior courts\' music lies stored and unperformed.',
  },
  s0222: {
    literal: 'For palace suspended music at suburban and temple feasts and banquets, civil dance should use Merit Achieved, Celebration of Goodness, all wearing shoes, holding fly-whisks, in the former dress of trousers and jackets and youths\' caps.',
    idiomatic: 'Palace suspended civil dance at suburban and temple rites and banquets should use Merit Achieved, Celebration of Goodness—shoes, fly-whisks, former trousers-and-jacket dress and youths\' caps.',
  },
  s0223: {
    literal: 'Military dance should use Divine Merit in Breaking the Array, all in armor holding halberds; those bearing banners also wear gilded armor.',
    idiomatic: 'Military dance should use Divine Merit in Breaking the Array—armor and halberds; banner bearers also wear gilded armor.',
  },
  s0224: {
    literal: 'Personnel as in the eight rows of dancers; add bamboo pipes, flutes, song-drums, etc., seated in a line south of the suspension; when they dance they play together with the palace suspended orchestra.',
    idiomatic: 'Numbers as in eight rows; add pipes, flutes, and song-drums south of the suspension; when they dance they join the palace suspended orchestra.',
  },
  s0225: {
    literal: 'The two-color dancers within banquets remain separately arranged as before."',
    idiomatic: 'Banquet two-color dancers remain separately arranged as before."',
  },
  s0226: {
    literal: 'Eleventh month edict: "Provision of the Shangyuan dance for sacrificial rites was formerly ordered for all major shrine offerings.',
    idiomatic: 'Eleventh month edict: "The Shangyuan dance for sacrifices was formerly set for all major shrine offerings.',
  },
  s0227: {
    literal: 'From now on, it shall be used only for offerings at the Round Mound, Square Mound, and Grand Temple; all other sacrifices shall cease using it."',
    idiomatic: 'Hereafter use it only at Round Mound, Square Mound, and Grand Temple offerings; stop it at other sacrifices."',
  },
  s0228: {
    literal: 'Closing quotation mark.',
    idiomatic: 'End of edict.',
  },
  s0229: {
    literal: 'Sixth day of the eleventh month, Vice Director of the Court Wei Wanshi memorialized: "According to the Zhenguan rites code, at suburban offering civil dance performs Joyful Harmony, Smooth Harmony, Eternal Harmony, etc.; dancers wear weimao caps and robes, all holding yue flutes and pheasant feathers.',
    idiomatic: 'Eleventh month, sixth day: Vice Director Wei Wanshi memorialized: "Per Zhenguan rites, suburban civil dance uses Joyful Harmony, Smooth Harmony, Eternal Harmony; dancers wear weimao caps and robes with yue flutes and pheasant feathers.',
  },
  s0230: {
    literal: 'Military dance performs Triumphant Peace; dancers all wear pingmian caps and hold shields and axes.',
    idiomatic: 'Military dance uses Triumphant Peace; dancers wear pingmian caps with shields and axes.',
  },
  s0231: {
    literal: 'Pursuant to the tenth-month edict, civil dance is changed to Merit Achieved, Celebration of Goodness; military dance to Divine Merit in Breaking the Array, with changed implements and dress.',
    idiomatic: 'Per the tenth-month edict, civil dance becomes Merit Achieved, Celebration of Goodness and military dance Divine Merit in Breaking the Array, with changed implements and dress.',
  },
  s0232: {
    literal: 'Since receiving the edict, because Celebration of Goodness cannot summon the spirits and Divine Merit in Breaking the Array is not yet in elegant music, though implements and dress were changed the dances remain as before and to this day have not been altered.',
    idiomatic: 'Since the edict, Celebration of Goodness cannot summon spirits and Divine Merit in Breaking the Array is not yet elegant music; though dress changed, the dances remain old and unaltered.',
  },
  s0233: {
    literal: 'The matter being unsettled, perhaps separate disposition is needed."',
    idiomatic: 'The matter is unsettled; separate disposition may be needed."',
  },
  s0234: {
    literal: 'Recorded and memorialized on the sixth of this month; edict: "The former civil and military dances cannot be abolished; all implements and dress should in general follow the old way.',
    idiomatic: 'Recorded sixth of this month; edict: "Former civil and military dances cannot be abolished; implements and dress should follow the old way.',
  },
  s0235: {
    literal: 'On days when the Shangyuan dance is suspended, still perform Divine Merit in Breaking the Array and Merit Achieved, Celebration of Goodness; court dances must all be performed outside the suspended set.',
    idiomatic: 'When the Shangyuan dance is suspended, still perform Divine Merit in Breaking the Array and Merit Achieved, Celebration of Goodness; court dances must be performed outside the suspension.',
  },
  s0236: {
    literal: 'The placement of dance pieces should be reconsidered for a secure method.',
    idiomatic: 'Dance placement should be reconsidered for a stable arrangement.',
  },
  s0237: {
    literal: 'Also record the six changes of Triumphant Peace and their symbolism and report."',
    idiomatic: 'Also record Triumphant Peace\'s six changes and their symbolism and report."',
  },
  s0238: {
    literal: 'Wanshi again submitted with the collation officials, etc.:',
    idiomatic: 'Wanshi again submitted with the collation officials:',
  },
  s0239: {
    literal: 'The edict was assented to.',
    idiomatic: 'Assent was given.',
  },
  s0240: {
    literal: 'Seventh month, third year, the emperor feasted at Jiucheng Palace in the Xianheng Hall; Han Prince Yuanjia, Huo Prince Yuan gui, and generals of the northern and southern armies were present.',
    idiomatic: 'Third year, seventh month: the emperor feasted at Jiucheng Palace, Xianheng Hall, with Han Prince Yuanjia, Huo Prince Yuan gui, and northern and southern army generals.',
  },
  s0241: {
    literal: 'When music began, Vice Director Wei Wanshi memorialized: "The Breaking-the-Array dance is where the imperial fortune took its start; it proclaims the ancestors\' glorious achievements, transmitted to posterity without end.',
    idiomatic: 'As music began, Wei Wanshi memorialized: "Breaking-the-Array is where imperial fortune began; it proclaims ancestral glory to endless posterity.',
  },
  s0242: {
    literal: 'Since the August Sovereign came to rule all within the four seas it has lain dormant; because the sage\'s feeling was mournful, no one below dared speak.',
    idiomatic: 'Since the August Sovereign ruled the four seas it has lain dormant; the sage\'s grief was such that none below dared speak.',
  },
  s0243: {
    literal: 'Your servant, holding office in the Music Office, fears neglect and lapse.',
    idiomatic: 'Your servant in the Music Office fears neglect.',
  },
  s0244: {
    literal: 'By rite, on the day of sacrifice the Son of Heaven personally leads shield and axe to dance the music of the ancestors, sharing joy with the world; now Breaking the Array has long been abandoned and those below have nothing to cite—how can filial thought be aroused?"',
    idiomatic: 'By rite the Son of Heaven on sacrifice day leads shield and axe to dance ancestral music and share joy with the realm; Breaking the Array is long abandoned—how can filial feeling be stirred?"',
  },
  s0245: {
    literal: 'The emperor started, changed expression, bowed to grant the request, and ordered the dance performed.',
    idiomatic: 'The emperor started, changed expression, granted the request, and ordered the dance.',
  },
  s0246: {
    literal: 'When it ended the emperor sighed with feeling, tears streaming; the ministers wept and could not look up.',
    idiomatic: 'When it ended the emperor sighed, tears streaming; ministers wept and could not look up.',
  },
  s0247: {
    literal: 'After a long while he turned to the two princes and said: "I have not seen this dance for nearly thirty years; suddenly viewing it today truly stirs deep grief.',
    idiomatic: 'After long silence he told the two princes: "Nearly thirty years without this dance; seeing it today stirs deep grief.',
  },
  s0248: {
    literal: 'Recalling past days, the royal enterprise was arduous and toilsome like this; I now inherit and guard the great enterprise—can I forget military achievement?"',
    idiomatic: 'Recalling the past, the royal enterprise was toilsome like this; I now guard the great enterprise—can I forget martial achievement?"',
  },
  s0249: {
    literal: 'The ancients said: "Wealth and nobility do not appoint an appointment with pride and extravagance—pride and extravagance arrive of themselves."',
    idiomatic: 'The ancients said: "Wealth and nobility do not fix a date with pride and extravagance—pride and extravagance come of themselves."',
  },
  s0250: {
    literal: 'I say that seeing this dance from time to time is to admonish myself, hoping to avoid the fault of fullness—not to perform it for mere pleasure."',
    idiomatic: 'I wish to see this dance now and then to admonish myself and avoid excess—not for mere pleasure."',
  },
  s0251: {
    literal: 'The attending ministers all shouted long life.',
    idiomatic: 'Attending ministers shouted long life.',
  },
  s0252: {
    literal: 'Twenty-first day of the first month, Wu Zetian held a feast from the southern tower of Luoyang and the Court performed the Returning to Purity of the Six Harmony dance.',
    idiomatic: 'First month, twenty-first day: Wu Zetian feasted from Luoyang\'s south tower; the Court performed Six Harmony Returning to Purity.',
  },
  s0253: {
    literal: 'First month, Wu Zetian personally offered at the Temple of Myriad Images.',
    idiomatic: 'First month: Wu Zetian personally offered at the Temple of Myriad Images.',
  },
  s0254: {
    literal: 'Earlier the emperor had composed the Grand Music of the Spirit Palace, danced by nine hundred persons; on this occasion it was danced in the spirit palace courtyard.',
    idiomatic: 'Earlier the emperor had composed Spirit Palace Grand Music for nine hundred dancers; now it was danced in the spirit palace courtyard.',
  },
  s0255: {
    literal: 'The empress memorialized: "From consorts and princesses down to mothers and wives of fifth rank and above who had not been ennobled through husband or son, from the day of relocation burial hereafter specially grant drum-and-pipe music.',
    idiomatic: 'The empress memorialized: "Consorts, princesses, and fifth-rank-and-above mothers and wives not ennobled through husband or son should receive drum-and-pipe music from relocation burial onward.',
  },
  s0256: {
    literal: 'Palace women are likewise granted this."',
    idiomatic: 'Palace women likewise."',
  },
  s0257: {
    literal: 'Attendant censor Tang Shao remonstrated: "Your servant has heard that the drum-and-pipe performance was originally for military display; in antiquity when the Yellow Emperor achieved merit at Zhuolu it served as guard music.',
    idiomatic: 'Attendant censor Tang Shao remonstrated: "Drum-and-pipe music was originally military display; when the Yellow Emperor won at Zhuolu it served as guard music.',
  },
  s0258: {
    literal: 'Hence drum pieces include Spirit Rhinoceros Roaring, Eagle and Falcon Struggling, Stone Falling from the Cliff, and Valiant\'s Wrath.',
    idiomatic: 'Drum pieces include Spirit Rhinoceros Roaring, Eagle and Falcon Struggling, Stone Falling from the Cliff, and Valiant\'s Wrath.',
  },
  s0259: {
    literal: 'From of old meritorious subjects received the full rites—only then might it be used.',
    idiomatic: 'Meritorious subjects alone received it by full rite.',
  },
  s0260: {
    literal: 'A man with achievement in the four directions receives favor and generous reward.',
    idiomatic: 'Men with achievement in the four directions receive favor and reward.',
  },
  s0261: {
    literal: 'Suppose suburban sacrifice to Heaven and Earth—truly a weighty rite—only palace suspended music exists; there are no frame-drum racks by nature.',
    idiomatic: 'Suburban sacrifice to Heaven and Earth is a weighty rite with only palace suspended music—no frame-drum racks.',
  },
  s0262: {
    literal: 'Hence one knows that what military music provides still does not suit the spirits;',
    idiomatic: 'Military music therefore does not suit the spirits;',
  },
  s0263: {
    literal: 'how can the sound of bells and drums meet the inner quarters?"',
    idiomatic: 'how can bells and drums enter the inner quarters?"',
  },
  s0264: {
    literal: 'By regulation, burial rites for princesses and imperial consorts and below have only round fans, square fans, colored curtains, and brocade screens.',
    idiomatic: 'Regulations for princesses and consorts and below allow only round fans, square fans, colored curtains, and brocade screens at burial.',
  },
  s0265: {
    literal: 'Adding drum-and-pipe—no generation has heard of it.',
    idiomatic: 'Adding drum-and-pipe is unheard of in any generation.',
  },
  s0266: {
    literal: 'Moreover by statute, fifth-rank officials\' weddings and burials had no drum-and-pipe; only capital officials of fifth rank might borrow fourth-rank drum-and-pipe for ceremony.',
    idiomatic: 'Statute gave fifth-rank weddings and burials no drum-and-pipe; only capital fifth-rank officials might borrow fourth-rank drum-and-pipe.',
  },
  s0267: {
    literal: 'Now to grant specially to mothers and wives of fifth rank and above means fifth-rank officials receive what the statute forbids.',
    idiomatic: 'Granting it to fifth-rank mothers and wives gives fifth-rank officials what statute forbids.',
  },
  s0268: {
    literal: 'Thus rank itself derives from husband and son yet ceremonial display exceeds them—illogical and hard to fix as rule; weighing the moral logic, it cannot be routinely done.',
    idiomatic: 'Rank derives from husband and son yet display exceeds them—illogical and hard to codify; on moral grounds it cannot be routine.',
  },
  s0269: {
    literal: 'Request to halt the prior edict and follow the usual code."',
    idiomatic: 'Request to halt the prior edict and follow usual statute."',
  },
  s0270: {
    literal: 'The emperor did not accept.',
    idiomatic: 'The throne declined.',
  },
  s0271: {
    literal: 'Twenty-third day of the first month, composed the melody Transcending Antiquity, Long Years.',
    idiomatic: 'First month, twenty-third day: composed Transcending Antiquity, Long Years.',
  },
  s0272: {
    literal: 'When Xuanzong reigned many years he was skilled in music; whenever he held banquets or public revels he went to the Diligence in Governance Tower.',
    idiomatic: 'Xuanzong reigned many years and was skilled in music; banquets and public revels were held at the Diligence in Governance Tower.',
  },
  s0273: {
    literal: 'The day before, the commandants of the four armies of the northern palace guard led armored troops; before dawn they arrayed equipment; the Minister of Ceremonies set screens; the Director of Palace Provisions prepared food.',
    idiomatic: 'The day before, northern palace guard commandants of four armies led armored troops; before dawn they arrayed gear; the Minister of Ceremonies set screens; the Director of Palace Provisions prepared food.',
  },
  s0274: {
    literal: 'At daybreak the hundred officials attended court; the palace secretariat announced inner solemnity and outer readiness; eunuchs with plain fans; the Son of Heaven opened the curtain to receive homage.',
    idiomatic: 'At daybreak the hundred officials attended; the secretariat announced inner solemnity and outer readiness; eunuchs with plain fans; the Son of Heaven opened the curtain for homage.',
  },
  s0275: {
    literal: 'When rites concluded plain fans lowered the curtain again; regular court officials, tribute officers, nobles, two kings, and tribal chiefs took food and sat.',
    idiomatic: 'When rites ended, plain fans lowered the curtain; regular court, tribute officers, nobles, two kings, and tribal chiefs ate and sat.',
  },
  s0276: {
    literal: 'The Court of Imperial Sacrifices\' great drums, painted like brocade; musicians struck together; sound shook the gate-towers.',
    idiomatic: 'Court great drums painted like brocade; musicians struck together; sound shook the gate-towers.',
  },
  s0277: {
    literal: 'The Director led elegant music; dozens per tone-color entered from the south in file and ranked below the tower.',
    idiomatic: 'The Director led elegant music; dozens per tone-color filed in from the south and ranked below the tower.',
  },
  s0278: {
    literal: 'Drums, flutes, gourds and lutes filled the courtyard in performance.',
    idiomatic: 'Drums, flutes, gourds, and lutes filled the courtyard.',
  },
  s0279: {
    literal: 'Standing-section and seated-section performers of the Court danced by counted beats, interspersed with barbarian and foreign pieces.',
    idiomatic: 'Court standing- and seated-section performers danced by counted beats, interspersed with barbarian and foreign pieces.',
  },
  s0280: {
    literal: 'At sundown the inner stables led thirty pacing horses for the Tilting Cup melody; they tossed heads and drummed tails, moving across in rhythm.',
    idiomatic: 'At sundown the inner stables led thirty pacing horses for Tilting Cup; they tossed heads and drummed tails in rhythm.',
  },
  s0281: {
    literal: 'A three-tier plank bed was set up; they mounted and whirled like flight.',
    idiomatic: 'A three-tier plank bed was set; they mounted and whirled like flight.',
  },
  s0282: {
    literal: 'He also ordered several hundred palace women to emerge from curtains striking thunder-drums, performing Breaking the Array, Grand Peace, and Shangyuan pieces.',
    idiomatic: 'He also had several hundred palace women emerge from curtains striking thunder-drums in Breaking the Array, Grand Peace, and Shangyuan.',
  },
  s0283: {
    literal: 'Though the Court had long practice, none matched this marvel.',
    idiomatic: 'Though the Court had long practice, none matched this.',
  },
  s0284: {
    literal: 'For Longevity of Sagehood they turned bodies changing dress, forming characters like painting.',
    idiomatic: 'In Longevity of Sagehood they turned bodies, changed dress, and formed characters like painting.',
  },
  s0285: {
    literal: 'Envoys of the five workshops also led elephants in; some bowed, some danced, movements striking drums in rhythm with the pitch—performing all day before retiring.',
    idiomatic: 'Five-workshop envoys also led elephants in; some bowed, some danced, movements and drums in pitch—performing all day.',
  },
  s0286: {
    literal: 'In leisure from government Xuanzong taught three hundred sons of Court musicians in silk-and-bamboo pieces; when tones rose together, if one note erred he detected and corrected it.',
    idiomatic: 'In leisure from government he taught three hundred Court musicians\' sons silk-and-bamboo; if one note erred when tones rose together, he detected and corrected it.',
  },
  s0287: {
    literal: 'They were styled Imperial Disciples, also Pear Garden disciples, because the academy lay near the Pear Garden within the forbidden park.',
    idiomatic: 'They were styled Imperial Disciples, also Pear Garden disciples, from the academy near the forbidden Pear Garden.',
  },
  s0288: {
    literal: 'The Court also had a separate teaching academy for instructing new tribute pieces.',
    idiomatic: 'The Court also had a separate teaching academy for new tribute pieces.',
  },
  s0289: {
    literal: 'Each dawn the Court\'s drums and flutes sounded together at the Grand Music Office.',
    idiomatic: 'Each dawn Court drums and flutes sounded together at the Grand Music Office.',
  },
  s0290: {
    literal: 'The separate teaching academy had grain rations for a thousand men regularly; musicians dwelled at the Yichun Courtyard within the palace.',
    idiomatic: 'The separate teaching academy rationed a thousand men; musicians dwelled at palace Yichun Courtyard.',
  },
  s0291: {
    literal: 'Xuanzong also composed more than forty new pieces and new musical scores.',
    idiomatic: 'Xuanzong also composed more than forty new pieces and new scores.',
  },
  s0292: {
    literal: 'Each year on the first full-moon night of the first month he again went to the Diligence Tower to view lanterns and make music; noble ministers and kin borrowed tower rooms to watch.',
    idiomatic: 'Each year on the first full-moon night he again went to the Diligence Tower for lanterns and music; nobles and kin borrowed tower rooms to watch.',
  },
  s0293: {
    literal: 'When night deepened and scattered music of the Court and prefectures ended, palace women were sent to bind frames before the tower and perform rope acts and pole climbing to entertain.',
    idiomatic: 'When night deepened and Court and prefectural scattered music ended, palace women bound frames before the tower for rope acts and pole climbing.',
  },
  s0294: {
    literal: 'Rope games and pole-wood feats—strange and artful—had no equal.',
    idiomatic: 'Rope games and pole feats—strange and artful—had no equal.',
  },
  s0295: {
    literal: 'When Xuanzong fled west, An Lushan sent his rebel cohorts to transport the capital\'s musical instruments and musicians\' robes all into Luoyang.',
    idiomatic: 'When Xuanzong fled west, An Lushan\'s rebels hauled the capital\'s instruments and musicians\' robes into Luoyang.',
  },
  s0296: {
    literal: 'Soon after Suzong recovered the two capitals and was to perform the great rites, ritual objects were wholly lacking.',
    idiomatic: 'Soon Suzong recovered the two capitals; for the great rites ritual objects were wholly lacking.',
  },
  s0297: {
    literal: 'He ordered Ritual Commissioner and Vice Director of the Court Yu Xiulie to send subordinates with the Eastern Capital\'s retained court to proceed to the court.',
    idiomatic: 'He ordered Ritual Commissioner and Court Vice Director Yu Xiulie to send subordinates with the Eastern Capital retained court to the capital.',
  },
  s0298: {
    literal: 'Edict granted money, had Xiulie make performers\' robes and great-dance garments; then music workers and the two dances were complete.',
    idiomatic: 'An edict granted money for Xiulie to make performers\' robes and great-dance dress; then musicians and the two dances were complete.',
  },
  s0299: {
    literal: 'Nineteenth day of the third month, the emperor personally inspected the Court\'s old bells and chimes; since Sui the transmitted five tones had some errors; he said to Yu Xiulie: "In antiquity the sage made music to respond to heaven-and-earth\'s harmony and match yin-yang\'s sequence.',
    idiomatic: 'Third month, nineteenth day: the emperor inspected the Court\'s old bells and chimes; since Sui the five transmitted tones had errors; he told Yu Xiulie: "The sage made music to match heaven-and-earth\'s harmony and yin-yang\'s order.',
  },
  s0300: {
    literal: 'When in harmony people do not die young and things are not blighted.',
    idiomatic: 'In harmony people do not die young and things are not blighted.',
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
if (data.metadata.chapter !== '028') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 028; standalone T ready (${Object.keys(T).length} entries).`
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
