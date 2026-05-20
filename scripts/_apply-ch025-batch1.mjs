#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.025, Rites 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/025.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1;
const END = 100;

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
  s0001: {
    literal: 'Tang rites: In each of the four seasons, in the first month of the season, offerings were made to the Great Ancestral Temple; for each chamber the great offering was used. After the wax sacrifices following the twelfth month\'s la rites, on a chen day a la offering was presented at the Great Temple, with victims as at the seasonal sacrifices.',
    idiomatic: 'Tang ritual: each season\'s first month, offerings at the Great Temple—tai lao per chamber. After twelfth-month wax and la, a chen-day la feast at the temple used seasonal victims.',
  },
  s0002: {
    literal: 'Every three years a he sacrifice, in the first month of winter.',
    idiomatic: 'A he rite every three years, in mid-winter\'s opening month.',
  },
  s0003: {
    literal: 'Every five years a di sacrifice, in the first month of summer.',
    idiomatic: 'A di rite every five years, in mid-summer\'s opening month.',
  },
  s0004: {
    literal: 'On days of seasonal offerings, the Seven Sacrifices were maintained on the road south within the western gate of the Great Temple: Spirit of Fate; the Household Spirit in spring, the Stove Spirit in summer;',
    idiomatic: 'On seasonal offering days the Seven Sacrifices were kept on the lane south of the temple\'s west gate—Spirit of Fate; Household Spirit in spring, Stove Spirit in summer;',
  },
  s0005: {
    literal: 'the Gate Spirit and the Pestilence Spirit in autumn, the Road Spirit in winter; the Central Gutter was sacrificed on the day of receiving seasonal qi in the last month of summer.',
    idiomatic: 'Gate and Pestilence Spirits in autumn, Road Spirit in winter; Central Gutter on the last-summer qi-reception day.',
  },
  s0006: {
    literal: 'If seasonal novelties were fit to present to the sovereign, the responsible office first sent them to the Court of Imperial Sacrifices and coordinated with the Imperial Provisioners, selecting the finest and pairing them with flavors suited to the new goods.',
    idiomatic: 'Seasonal delicacies fit for the throne went first to the Court of Sacrifices and the Provisioners, who picked the best and matched flavor to the new offering.',
  },
  s0007: {
    literal: 'The Minister of Imperial Sacrifices presented offerings at the Great Temple without bringing out the spirit tablets.',
    idiomatic: 'The Minister of Sacrifices presented at the Great Temple without removing the tablets.',
  },
  s0008: {
    literal: 'In mid-spring ice was presented—in the same manner.',
    idiomatic: 'Mid-spring ice offerings followed the same rule.',
  },
  s0009: {
    literal: 'In the fifth month, with the full imperial escort, the spirit tablets of Duke Xuanjian, King Yi, Emperor Jing, and Emperor Yuan were welcomed and enshrined in the Great Temple, and for the first time four chambers received offerings.',
    idiomatic: 'Fifth month: full escort welcomed tablets of Duke Xuanjian, King Yi, Emperor Jing, and Emperor Yuan into the Great Temple; four chambers were offered to for the first time.',
  },
  s0010: {
    literal: 'When Gaozu died, they were about to perform the relocation-enshrinement rite; Taizong ordered the relevant offices to deliberate in detail on temple regulations.',
    idiomatic: 'Gaozu\'s death was to trigger relocation-enshrinement; Taizong ordered a full review of temple rules.',
  },
  s0011: {
    literal: 'Remonstrance Adviser Zhu Zisha memorialized, saying:',
    idiomatic: 'Remonstrance Adviser Zhu Zisha proposed:',
  },
  s0012: {
    literal: 'Thereupon the Eight Ministers memorialized, saying:',
    idiomatic: 'The Eight Ministers then submitted:',
  },
  s0013: {
    literal: 'The decree followed this.',
    idiomatic: 'Approved.',
  },
  s0014: {
    literal: 'Thereupon the Great Temple was enlarged and renovated; for the first time the spirit tablets of the Lord of Hongnong and Gaozu were elevated to enshrinement, together with the former four chambers making six chambers.',
    idiomatic: 'The Great Temple was expanded; Hongnong Lord and Gaozu were first elevated to enshrinement, bringing the shrine to six chambers.',
  },
  s0015: {
    literal: 'In the twenty-third year Taizong died; they were about to perform the elevated-enshrinement rite. Minister of Rites Xu Jingzong memorialized, saying: "The temple of the Lord of Hongnong should be destroyed in rotation.',
    idiomatic: 'Year 23: Taizong died; elevated enshrinement was due. Xu Jingzong of Rites wrote: "The Hongnong Lord\'s temple should rotate out.',
  },
  s0016: {
    literal: 'According to former rites, Han Chancellor-in-ordinary Wei Xuancheng held that destroyed spirit tablets should be buried in the earth.',
    idiomatic: 'Former rites: Han Chancellor Wei Xuancheng said destroyed tablets should be buried.',
  },
  s0017: {
    literal: 'Yet when the myriad states pay collective honor, there is an origin for ritual—suddenly to bury them would not be acceptable.',
    idiomatic: 'Yet all realms honor a lineage with roots—sudden burial would not satisfy.',
  },
  s0018: {
    literal: 'Jin Erudite Fan Xuan wished to establish a separate temple and place therein the spirit tablets of the Commander who Pacified the West and the rest.',
    idiomatic: 'Jin scholar Fan Xuan wanted a separate shrine for the Pacified-West commander and others.',
  },
  s0019: {
    literal: 'Compared with burial, this rather accords with reason, but there is no precedent and it is not sufficient to rely on.',
    idiomatic: 'That beats burial in reason, but lacks precedent and cannot be followed.',
  },
  s0020: {
    literal: 'Some debaters also said to store destroyed tablets in the Celestial Repository—the repository where auspicious objects were stored was not originally for this purpose.',
    idiomatic: 'Others urged storing tablets in the Celestial Repository—but that treasury held omens, not ancestors.',
  },
  s0021: {
    literal: 'We now carefully measure: beyond the distant ancestors, altars and open platforms for prayer still remain—a private opinion that this is fitting.',
    idiomatic: 'We weigh the case: beyond the remote ancestors, prayer altars still stand—we deem that fitting.',
  },
  s0022: {
    literal: 'The present temple system differs from antiquity: a shared foundation with separate chambers, the west taken as foremost.',
    idiomatic: 'Today\'s temples differ from antiquity—one foundation, separate chambers, west ranked first.',
  },
  s0023: {
    literal: 'If within the western side chambers they still occupy the honored position, and prayer sacrifices are offered without ending reverent offerings, compared with former rites, sentiment and fact can both be settled.',
    idiomatic: 'If western side chambers keep honored rank and prayer offerings continue, old rite and present need both align.',
  },
  s0024: {
    literal: 'The Hongnong lord\'s temple is subject to reduced mourning for distant kin; per detailed examination of old regulations, ritual requires rotational destruction.',
    idiomatic: 'Hongnong Lord is a distant relation—old statutes require his temple to rotate out.',
  },
  s0025: {
    literal: 'Your subjects jointly deliberated: moving and enshrining the spirit tablets, storing them in the side chambers—in native feeling, profound teaching; in principle, expansive.',
    idiomatic: 'We jointly advise moving the tablets into side chambers—deep in piety, broad in principle.',
  },
  s0026: {
    literal: 'The passage concluded." It was approved.',
    idiomatic: 'The quote ended." Approved.',
  },
  s0027: {
    literal: 'That year, eighth month, gengzi day, the spirit tablet of Emperor Wen Taizong was enshrined in the Great Temple.',
    idiomatic: 'That year, eighth month, day gengzi: Taizong\'s tablet entered the Great Temple.',
  },
  s0028: {
    literal: 'Eighth month: the spirit tablet of Emperor Gaozong was enshrined within the Great Temple; for the first time the spirit tablet of Emperor Xuan was moved to the side chambers.',
    idiomatic: 'Eighth month: Gaozong\'s tablet was enshrined; Xuan\'s tablet moved to the side chambers for the first time.',
  },
  s0029: {
    literal: 'First month: at the eastern capital three temples to Gaozu, Taizong, and Gaozong were also erected; seasonal offerings followed the capital temple rite.',
    idiomatic: 'First month: eastern capital gained three temples to Gaozu, Taizong, and Gaozong, with seasonal rites matching the capital.',
  },
  s0030: {
    literal: 'A separate Chongxian Temple was established to offer to the Wu clan ancestors.',
    idiomatic: 'A separate Chongxian Temple was built for Wu clan ancestors.',
  },
  s0031: {
    literal: 'Empress Zetian soon again ordered the offices to deliberate on how many chambers the Chongxian Temple should have; Court of Spring Rites erudite and Scholar of the Chongwen Institute Zhou Ping, to please her intent, requested seven chambers for Chongxian Temple and reduction of the imperial ancestral temple to five chambers.',
    idiomatic: 'Zetian soon ordered debate on Chongxian\'s chamber count; Zhou Ping of Spring Rites, courting her wish, urged seven chambers for Chongxian and five for the imperial temple.',
  },
  s0032: {
    literal: 'Vice Minister of the Court of Spring Rites Jia Dayin memorialized, saying: "Your subject ventures to cite Qin and Han, when empress dowagers held court and exercised regulatory power—all followed the canonical ritual texts: the Son of Heaven has seven temples, feudal lords five temples.',
    idiomatic: 'Jia Dayin of Spring Rites wrote: "Qin and Han dowagers who ruled from court all cited canon—the Son of Heaven keeps seven temples, lords five.',
  },
  s0033: {
    literal: 'This is the unchanging meaning of the hundred kings, the constant law of myriad generations—never has anyone transgressed ritual and antiquity to arrogate regulation of ceremony.',
    idiomatic: 'That is the immovable rule of kings and ages—none has broken ritual to rewrite ceremony at will.',
  },
  s0034: {
    literal: 'Now Zhou Cong cites floating opinions and broadly sets forth heterodox texts, directly elevating provisional rites of holding court, not relying on the state\'s constant norms—raising Chongxian temple to seven while lowering the state temple to five.',
    idiomatic: 'Zhou Cong now cites loose opinion and stray texts, exalting a regent\'s provisional rite over state norm—seven for Chongxian, five for the realm.',
  },
  s0035: {
    literal: 'Your subject has heard: when the imperial design is broadly opened, it truly honors the altars of state;',
    idiomatic: 'I have heard: when the throne\'s design is wide, the altars of state gain honor;',
  },
  s0036: {
    literal: 'when the imperial enterprise has a vast foundation, it truly equals the solidity of mountains and rivers.',
    idiomatic: 'when its foundation is vast, it matches mountains and rivers in firmness.',
  },
  s0037: {
    literal: 'Your subject observes: the heavenly steps have been many times arduous; times encountered mourning seclusion; one who substitutes for Heaven and governs things has existed since antiquity.',
    idiomatic: 'Heaven\'s course has been hard; times of mourning seclusion came; regents who govern for Heaven are ancient.',
  },
  s0038: {
    literal: 'Your subject respectfully considers: the Empress Dowager personally received the entrustment, labored in care for the common people, accepted the request of filial piety and compassion, extended a cherishing and soothing heart—this truly is what is called to glorify the great plan and expand the sage burden.',
    idiomatic: 'The Dowager took the trust, toiled for the people, heard pleas of filial mercy, and soothed the realm—truly glorifying the great design and widening the sage charge.',
  },
  s0039: {
    literal: 'Chambers of Chongxian Temple should accord with the feudal lord count; the state ancestral temple must not casually be shifted.',
    idiomatic: 'Chongxian should match a lord\'s count; the state temple must not be casually altered.',
  },
  s0040: {
    literal: 'Your subject\'s stubborn directness wholly follows orthodox ritual; Zhou Ping\'s request truly contravenes ancient ceremony.',
    idiomatic: 'My blunt counsel follows orthodox rite; Zhou Ping\'s plea breaches ancient ceremony.',
  },
  s0041: {
    literal: 'The passage concluded." Zetian thereby stopped for the time.',
    idiomatic: 'The quote ended." Zetian held off for the moment.',
  },
  s0042: {
    literal: 'When Zetian had revolutionized and taken the imperial title, at the eastern capital she reformed the Great Temple into seven temple chambers, received the spirit tablets of seven generations of the Wu clan, and enshrined them in the Great Temple.',
    idiomatic: 'After Zetian\'s revolution and enthronement, the eastern capital Great Temple became seven chambers; seven generations of Wu tablets were enshrined there.',
  },
  s0043: {
    literal: 'The western capital Great Temple was changed to the Virtue-Enjoying Temple; in the four seasons only the three chambers from Gaozu downward were offered; the remaining four chambers had their doors closed by order and their offering rites abolished.',
    idiomatic: 'Western capital\'s Great Temple became Virtue-Enjoying Temple—only three chambers from Gaozu down were offered; four chambers were closed and their rites ended.',
  },
  s0044: {
    literal: 'Also the western capital Chongxian Temple was changed to Chongzun Temple; its offerings followed the Great Temple rite.',
    idiomatic: 'Western Chongxian became Chongzun Temple, with rites like the Great Temple.',
  },
  s0045: {
    literal: 'Twelfth month: returning from conferring feng on Mount Song, she personally visited the Great Temple.',
    idiomatic: 'Twelfth month: returning from Song\'s feng rite, she visited the Great Temple in person.',
  },
  s0046: {
    literal: 'Seventh month next year: also changed the capital Chongzun Temple back to Great Temple; still changed the Great Temple Bureau to Qingmiao Terrace, added staff, and elevated their rank.',
    idiomatic: 'Next year, seventh month: Chongzun was restored as Great Temple; the temple office became Qingmiao Terrace with added staff and higher rank.',
  },
  s0047: {
    literal: 'Fourth month: again personally sacrificed at the Great Temple; special amnesty within the eastern capital walls.',
    idiomatic: 'Fourth month: she sacrificed at the Great Temple again and granted amnesty within the eastern capital.',
  },
  s0048: {
    literal: 'When Zhongzong took the throne, first month: restored Virtue-Enjoying Temple to the capital Great Temple as before.',
    idiomatic: 'Zhongzong\'s first month: Virtue-Enjoying Temple reverted to the capital Great Temple.',
  },
  s0049: {
    literal: 'Fifth month: moved the seven Wu clan temple spirit tablets to western capital Chongzun Temple; newly established Great Temple at eastern capital.',
    idiomatic: 'Fifth month: seven Wu tablets went to western Chongzun; a new Great Temple rose at the eastern capital.',
  },
  s0050: {
    literal: 'Court of Imperial Sacrifices Erudite Zhang Qixian memorialized:',
    idiomatic: 'Sacrifices Erudite Zhang Qixian submitted:',
  },
  s0051: {
    literal: 'Erudites Liu Chengqing and Yin Zhizhang also deliberated:',
    idiomatic: 'Erudites Liu Chengqing and Yin Zhizhang also argued:',
  },
  s0052: {
    literal: 'Then there was an edict ordering the chief ministers to deliberate further; Minister of Rites Zhu Qinming and others memorialized, saying: "Three erudites divided into two opinions: Zhang Qixian held that from the first they were the same as the Great Founder, and it was not fitting to further take King Zhao as ancestor;',
    idiomatic: 'An edict sent chancellors to refine the question; Zhu Qinming of Rites reported: "Three erudites split two ways—Zhang Qixian said they were already Great Founder and King Zhao should not be added as ancestor;',
  },
  s0053: {
    literal: 'Liu Chengqing held that the Wang System\'s three Zhao and three Mu does not permit doubly honoring Emperor Xuan.',
    idiomatic: 'Liu Chengqing cited the Wang System\'s three zhao and three mu—no double honor for Emperor Xuan.',
  },
  s0054: {
    literal: 'Your subjects deliberated and request: follow Zhang Qixian in taking Emperor Jing as Great Founder, follow Liu Chengqing in honoring with six chambers.',
    idiomatic: 'We advise: take Zhang Qixian\'s Jing as Great Founder and Liu Chengqing\'s six-chamber arrangement.',
  },
  s0055: {
    literal: 'The passage concluded." The decree approved.',
    idiomatic: 'The quote ended." Approved.',
  },
  s0056: {
    literal: 'Soon there was an edict making Filial and Respectful Emperor the Righteous Ancestor, elevated enshrinement in the Great Temple.',
    idiomatic: 'Soon an edict made the Filial and Respectful Emperor the Righteous Ancestor and elevated him into the Great Temple.',
  },
  s0057: {
    literal: 'That year eighth month: elevated enshrinement of Emperors Guang, Jing as Great Founder, Yuan as Dynastic Ancestor, Gaozu as Emperor Shenyao, Taizong as the Civil and Martial Sage Emperor, father Emperor Gaozong the Great Heavenly Emperor, elder brother Righteous Ancestor Filial and Respectful Emperor at the eastern capital Great Temple; the emperor in person performed the offering rite.',
    idiomatic: 'That eighth month at the eastern Great Temple: elevated enshrinement for Guang, Jing as Great Founder, Yuan as dynastic ancestor, Shenyao Gaozu, sage Taizong, heavenly Gaozong, and Righteous Ancestor Filial and Respectful—the emperor offered in person.',
  },
  s0058: {
    literal: 'Year 2: when the carriage returned to the capital, the Great Temple from then also honored seven chambers; still changed Wu clan Chongzun Temple to Chong\'en Temple.',
    idiomatic: 'Year 2: back in the capital, the Great Temple too kept seven chambers; Wu Chongzun became Chong\'en Temple.',
  },
  s0059: {
    literal: 'Second month next year: again ordered Chong\'en Temple to follow Tian\'shou-era offerings entirely.',
    idiomatic: 'Next year\'s second month: Chong\'en was again ordered to follow Tian\'shou offerings.',
  },
  s0060: {
    literal: 'At the time Wu Sansi was in power; secretly ordered Princess Anle to persuade Zhongzong—hence this edict.',
    idiomatic: 'Wu Sansi then held sway; Princess Anle quietly swayed Zhongzong—hence the edict.',
  },
  s0061: {
    literal: 'Soon also specially ordered Wu clan Chong\'en Temple Fast Youths to be filled with sons of fifth-rank officials.',
    idiomatic: 'Soon Wu\'s Chong\'en Fast Youths were specially filled with fifth-rank sons.',
  },
  s0062: {
    literal: 'Erudite Yang Fu memorialized, saying: "Great Temple Fast Youths—formerly only sons of seventh rank and below.',
    idiomatic: 'Yang Fu wrote: "Great Temple Fast Youths were formerly sons of seventh rank and below.',
  },
  s0063: {
    literal: 'Now that Chong\'en Temple Fast Youths take fifth-rank sons, what rank should Great Temple Fast Youths be?"',
    idiomatic: 'If Chong\'en takes fifth-rank sons, what rank should Great Temple youths hold?"',
  },
  s0064: {
    literal: 'The emperor said: "Great Temple Fast Youths likewise follow Chong\'en Temple."',
    idiomatic: 'The emperor said: "Match the Great Temple to Chong\'en."',
  },
  s0065: {
    literal: 'Fu memorialized, saying: "Chong\'en Temple is subject of the Great Temple, the Great Temple is lord of Chong\'en Temple—to equalize subject with lord is still usurpation; to equalize lord with subject makes the realm doubtful and afraid.',
    idiomatic: 'Fu replied: "Chong\'en is the Great Temple\'s subject, the Great Temple its lord—equating subject to lord is usurpation; equating lord to subject breeds fear.',
  },
  s0066: {
    literal: 'Confucius said: \'If names are not correct speech is not in accord; if speech is not in accord affairs do not succeed; if affairs do not succeed rites and music do not flourish; if rites and music do not flourish punishments miss the mark; if punishments miss the mark the people have nowhere to place hand or foot.',
    idiomatic: 'Confucius said: \'Wrong names unbalance speech; unbalanced speech fails affairs; failed affairs stall rites and music; stalled rites skew punishments; skewed punishments leave the people without footing.',
  },
  s0067: {
    literal: 'Therefore the noble man in naming must make speakable words.',
    idiomatic: 'So the noble man\'s names must be sayable.',
  },
  s0068: {
    literal: 'Your subject wishes no confusion from heterodox words as the beginning of disorder.',
    idiomatic: 'Do not heed crooked words and start disorder.',
  },
  s0069: {
    literal: 'The passage concluded." The matter then lapsed.',
    idiomatic: 'The quote ended." The plan died.',
  },
  s0070: {
    literal: 'Chong\'en Temple—when Ruizong took the throne, was then abolished and destroyed.',
    idiomatic: 'Chong\'en lasted until Ruizong\'s accession, then was abolished.',
  },
  s0071: {
    literal: 'Winter: about to bury Emperor Xiaohui of Zhongzong at Ding Mausoleum; Chief Minister Yao Yuanzhi and Minister of Personnel Song Jing memorialized, saying: "Per ritual, when the great imperial tomb matters end, enshrinement should follow at once.',
    idiomatic: 'Winter: Zhongzong Xiaohui was to be buried at Ding; Yao Yuanzhi and Song Jing wrote: "When the great tomb rites end, enshrinement should follow immediately.',
  },
  s0072: {
    literal: 'The seventh chamber of the Great Temple had already enshrined the elder brother Righteous Ancestor Filial and Respectful Emperor and the Lamenting Empress Pei.',
    idiomatic: 'The seventh chamber already held Righteous Ancestor Filial and Respectful and Lamenting Empress Pei.',
  },
  s0073: {
    literal: 'Your subject observes: Righteous Ancestor never ascended the great throne; posthumously honored after death—in the early Shenlong era a special order moved enshrinement.',
    idiomatic: 'Righteous Ancestor never reigned; he was honored after death and specially moved in early Shenlong.',
  },
  s0074: {
    literal: 'The Spring and Autumn Annals principle: a lord of the state who took the throne not yet a full year is not fit to be ranked in zhao and mu sequence.',
    idiomatic: 'Spring and Autumn rule: a ruler enthroned less than a year is not ranked in zhao and mu.',
  },
  s0075: {
    literal: 'Also in antiquity ancestor-for-father each had separate temples. Filial and Respectful Emperor\'s Gong Mausoleum is already in Luozhou—your subject requests a separate Righteous Ancestor temple at the eastern capital, moving enshrinement of Filial and Respectful Emperor and Lamenting Empress spirit tablets, ordering the relevant office seasonal offerings—then not violating the prior intent, also harmonizing with ancient instruction; human and spirit both agree; advance and retreat all fitting.',
    idiomatic: 'Antiquity gave each forebear a separate temple. Filial and Respectful lies at Gong in Luozhou—build a Righteous Ancestor temple in the east, move both tablets, and offer by season: prior intent kept, ancient rule met, spirits and men aligned.',
  },
  s0076: {
    literal: 'These spirit tablets—your subject requests placement in side chambers.',
    idiomatic: 'Place these tablets in the side chambers.',
  },
  s0077: {
    literal: 'Your subject wishes Your Majesty to cut favor with ritual.',
    idiomatic: 'Let ritual trim private favor.',
  },
  s0078: {
    literal: 'The passage concluded." The decree approved.',
    idiomatic: 'The quote ended." Approved.',
  },
  s0079: {
    literal: 'When burial was done, enshrined spirit tablets of Emperor Xiaohui Zhongzong and Empress Zhaosi Zhao in the Great Temple.',
    idiomatic: 'After burial, Zhongzong Xiaohui and Empress Zhaosi Zhao were enshrined in the Great Temple.',
  },
  s0080: {
    literal: 'Righteous Ancestor was then at eastern capital Congshan Lane with temple established for offerings.',
    idiomatic: 'Righteous Ancestor was served at a new temple in Congshan Lane, eastern capital.',
  },
  s0081: {
    literal: 'At the time also posthumously honored Empresses Zhaocheng and Suming; at Qinren Lane a separate Yikun Temple was set up with four-season offerings.',
    idiomatic: 'Empresses Zhaocheng and Suming were also posthumously honored; Yikun Temple at Qinren Lane received seasonal rites.',
  },
  s0082: {
    literal: 'When Ruizong died, and enshrinement rites were performed, Erudites Chen Zhenjie, Su Xian and others deliberated, saying: "According to examination, Emperor Xiaohui in the temple—seven chambers already full.',
    idiomatic: 'Ruizong\'s death brought enshrinement debate; Chen Zhenjie and Su Xian wrote: "Xiaohui already fills seven chambers.',
  },
  s0083: {
    literal: 'Now Emperor Ruizong the Great Sagely True Emperor is Xiaohui\'s younger brother—just reaching mid-winter, ritual requires enshrinement migration.',
    idiomatic: 'Ruizong the Great Sagely True Emperor is Xiaohui\'s younger brother—mid-winter demands his enshrinement.',
  },
  s0084: {
    literal: 'Though brothers entering the temple existed in antiquity, the rite of successive removal—zhao and mu must be corrected.',
    idiomatic: 'Brothers did enter temples in antiquity, but succession rules require correct zhao and mu.',
  },
  s0085: {
    literal: 'According to Treatises on Ritual, Imperial Sacrifices Officer He Xun\'s deliberation: \'Brothers do not succeed one another as heirs.',
    idiomatic: 'Ritual treatises cite He Xun: \'Brothers do not succeed one another.',
  },
  s0086: {
    literal: 'Hence Yin Pan Geng is not ranked after Yang Jia but succeeds the former lord above;',
    idiomatic: 'Yin\'s Pan Geng is not listed after Yang Jia but continues the prior lord;',
  },
  s0087: {
    literal: 'Han Guangwu does not succeed Xiaocheng but receives above from Emperor Yuan.',
    idiomatic: 'Han\'s Guangwu does not follow Xiaocheng but inherits from Emperor Yuan.',
  },
  s0088: {
    literal: '\' Also: \'Jin Emperor Hui had no heir; Emperor Huai received the succession; Huai succeeded himself from Shizu, not from Emperor Hui.',
    idiomatic: '\' Jin Hui had no heir; Huai took the line from Shizu, not from Hui.',
  },
  s0089: {
    literal: 'Emperor Hui should be the same as Yang Jia and Xiaocheng, separately enshrined outside.',
    idiomatic: 'Hui should join Yang Jia and Xiaocheng in a separate shrine.',
  },
  s0090: {
    literal: '\' Also: \'If brothers replace one another, they share one generation; zhao and mu positions identical.',
    idiomatic: '\' If brothers alternate, they share one generation and one zhao-mu slot.',
  },
  s0091: {
    literal: '\'When they should be removed, two temples cannot both be destroyed.',
    idiomatic: '\' When rotation comes, two temples cannot both be destroyed.',
  },
  s0092: {
    literal: '\' This is the constant example of ritual.',
    idiomatic: '\' That is ritual\'s standing rule.',
  },
  s0093: {
    literal: 'Xunzi says, \'He who has the realm serves seven generations\'—meaning from honored father upward.',
    idiomatic: 'Xunzi: \'He who holds the realm serves seven generations\'—from honored father up.',
  },
  s0094: {
    literal: 'The honored unify broadly, hence grace extends to distant ancestors.',
    idiomatic: 'The exalted reach wide, so grace reaches distant forebears.',
  },
  s0095: {
    literal: 'If brothers are admitted laterally, destroying ancestor-fathers above—then the Son of Heaven has the meaning of being unable fully to serve seven generations.',
    idiomatic: 'Admit brothers sideways and remove ancestors above—the Son of Heaven cannot fully keep seven generations.',
  },
  s0096: {
    literal: 'Emperor Xiaohui had merit of restoring the dynasty but no posterity—your subject requests the same as Yin Yang Jia, Han Emperor Cheng: separate temple outside, seasonal rites not diminished; at great he sacrifice, joint feast at Great Founder.',
    idiomatic: 'Xiaohui restored the dynasty but left no heir—treat him like Yang Jia and Cheng: separate temple, unbroken seasonal rites, joint feast at the Great Founder on great he days.',
  },
  s0097: {
    literal: 'Receive Emperor Ruizong\'s spirit tablet, elevated enshrinement in Great Temple, succeeding above Emperor Gaozong—then zhao and mu forever stable, libation and blessing long in order.',
    idiomatic: 'Enshrine Ruizong above Gaozong—zhao and mu stay fixed, libations and blessings in long order.',
  },
  s0098: {
    literal: 'The passage concluded." The decree approved.',
    idiomatic: 'The quote ended." Approved.',
  },
  s0099: {
    literal: 'Initially ordered Yikun Temple to become Zhongzong\'s temple; soon again reformed Zhongzong Temple west of the Great Temple.',
    idiomatic: 'Yikun was first made Zhongzong\'s temple, then Zhongzong\'s shrine was rebuilt west of the Great Temple.',
  },
  s0100: {
    literal: 'Zhenjie and others also held that Empress Suming was not fit to be paired with Empress Zhaocheng in enshrinement with Ruizong; deliberated, saying: "Ritual: ancestral temples father-zhao son-mu—each has a consort seat; each chamber one emperor one empress—the orthodox ritual form.',
    idiomatic: 'Zhenjie et al. also argued Suming should not pair with Zhaocheng at Ruizong\'s shrine: "Rite sets father-zhao, son-mu, one consort per chamber—one emperor, one empress: the orthodox form.',
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
if (data.metadata.chapter !== '025') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 025; standalone T ready (${Object.keys(T).length} entries).`
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
