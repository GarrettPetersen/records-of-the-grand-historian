#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Suishu ch.009, Rites Treatise 4 — abdication, investiture, capping, marriage rites) */
import { readFileSync, writeFileSync } from 'fs';

const dataPath = 'data/suishu/009.json';
const transPath = 'translations/current_translation_suishu.json';
const START = 1;
const END = 100;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    let blockSentences = [];
    if (block.type === 'paragraph') blockSentences = block.sentences || [];
    else if (block.type === 'table_row')
      blockSentences = (block.cells || []).filter((c) => c.content?.trim());
    else if (block.type === 'table_header')
      blockSentences = (block.sentences || []).filter((s) => s.zh?.trim());
    for (const s of blockSentences) {
      const id = s.id || s.content;
      const chinese = s.zh || s.content;
      if (chinese?.trim()) out.set(id, { chinese, blockIndex });
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
    if (block.type === 'paragraph') blockSentences = block.sentences || [];
    else if (block.type === 'table_row')
      blockSentences = (block.cells || []).filter((c) => c.content?.trim());
    else if (block.type === 'table_header')
      blockSentences = (block.sentences || []).filter((s) => s.zh?.trim());
    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;
      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') chineseText = sentence.zh;
      else if (block.type === 'table_row') chineseText = sentence.content;
      let displayId = sentenceId;
      if (seenIds.has(displayId)) displayId = `${sentenceId}@${blockIndex}`;
      seenIds.add(displayId);
      out.push({ id: displayId, originalId: sentenceId, blockIndex, chinese: chineseText, literal: '', idiomatic: '' });
    }
  }
  out.sort((a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10));
  return out;
}

const T = {
  s0001: {
    literal: 'Rites, Part Four.',
    idiomatic: 'Rites, Part Four',
  },
  s0002: {
    literal: 'In the first year of Dadading of Zhou, Emperor Jing dispatched the concurrent Grand Tutor, Pillar of State, Duke Chun of Qi, and the Grand Herald, Grand General, Duke Jiong of Jincheng, bearing the imperial seal-cord and investiture scroll, to abdicate the throne to Sui.',
    idiomatic: 'In Zhou Dadading 1, Emperor Jing sent the concurrent Grand Tutor and Pillar of State, Duke Chun of Qi, together with the Grand Herald and Grand General, Duke Jiong of Jincheng, bearing the imperial seal, cord, and investiture scroll to abdicate in favor of Sui.',
  },
  s0003: {
    literal: 'Director of Records Yu Qingze reported, requesting that an altar be set up at the Eastern Residence.',
    idiomatic: 'Director of Records Yu Qingze submitted a memorial requesting that an altar be erected at the Eastern Residence.',
  },
  s0004: {
    literal: 'Erudite He Tuo argued that ascending the altar to receive the abdication was to report to Heaven; thus when Wei received the Han abdication, an altar was set up at Fanchang — being on campaign, the suburban altar was omitted.',
    idiomatic: 'Erudite He Tuo argued that mounting the altar to receive the abdication was an announcement to Heaven. When Wei accepted the Han abdication, an altar was erected at Fanchang; because the court was on campaign, the suburban altar was omitted.',
  },
  s0005: {
    literal: 'As for Gaozu of Han at Si and Guangwu at Hao, none of these altars were built in the capital.',
    idiomatic: 'When Gaozu of Han was at Si and Guangwu at Hao, neither built the altar in the capital city.',
  },
  s0006: {
    literal: 'From Jin and Song onward, all abdications took place in the capital, invariably at the Southern Suburb, with no rationale for building a separate altar.',
    idiomatic: 'From Jin and Song onward, every peaceful transfer of power took place in the capital, always at the Southern Suburb, with no precedent for erecting a separate altar.',
  },
  s0007: {
    literal: 'Moreover, when Later Wei acceded, they mounted the Vermilion Sparrow Tower; when the Zhou emperor was first installed, he received court at the Road Gate — though innovations of their own making, none accorded with ritual.',
    idiomatic: 'Later Wei had the new emperor ascend the Vermilion Sparrow Tower; when the Zhou emperor was first enthroned, he received court at the Road Gate. Though each dynasty invented its own practice, none was proper ritual.',
  },
  s0008: {
    literal: 'Now to make the residence itself the altar would, I fear, invite later reproach.',
    idiomatic: 'To use the residence itself as the altar would, I fear, invite reproach from later ages.',
  },
  s0009: {
    literal: 'The debaters agreed.',
    idiomatic: 'The assembly accepted his view.',
  },
  s0010: {
    literal: 'On jiazi of the second month, Chun and the others rode the elephant carriage, with full guard of honor, bearing the staff of authority, leading the hundred officials to the gate, and deposited the investiture scroll in the side chamber.',
    idiomatic: 'On jiazi of the second month, Chun and his party rode the elephant carriage with full guard of honor and staff of authority, led the hundred officials to the gate, and placed the investiture scroll in the side chamber.',
  },
  s0011: {
    literal: 'The civil and military officials, in court dress, stood south of the gate, facing north.',
    idiomatic: 'Civil and military officials in court dress stood south of the gate, facing north.',
  },
  s0012: {
    literal: 'Gaozu wore the far-wandering cap; the staff of the residence lined up beside him.',
    idiomatic: 'Gaozu wore the far-wandering cap, with the staff of the residence arrayed in attendance.',
  },
  s0013: {
    literal: 'The recorder entered to announce; the ritual officer guided Gaozu, the staff following, out through the great gate to the eastern wing, facing west.',
    idiomatic: 'The recorder entered to announce; the ritual officer led Gaozu out through the great gate to the eastern wing, facing west, with the staff following.',
  },
  s0014: {
    literal: 'Chun bore the investiture scroll, Jiong bore the seal and cord; they came out from the side chamber and advanced under guidance of the staff of authority.',
    idiomatic: 'Chun carried the investiture scroll and Jiong the seal and cord; they emerged from the side chamber and advanced under the staff of authority.',
  },
  s0015: {
    literal: 'Gaozu bowed to them; entering the gate he turned left, while Chun and the others entered and turned right.',
    idiomatic: 'Gaozu bowed to them, entered the gate and turned left; Chun and the others entered and turned right.',
  },
  s0016: {
    literal: 'The hundred officials followed into the courtyard.',
    idiomatic: 'The hundred officials followed them into the courtyard.',
  },
  s0017: {
    literal: 'Chun, facing south, finished reading the bound scroll and stepped forward to present it to Gaozu.',
    idiomatic: 'Facing south, Chun finished reading the bound scroll and stepped forward to present it to Gaozu.',
  },
  s0018: {
    literal: 'Gaozu, facing north, bowed twice and declined to accept the mandate.',
    idiomatic: 'Gaozu faced north, bowed twice, and declined the mandate.',
  },
  s0019: {
    literal: 'Pillar of State Li Mu stepped forward to explain the court\'s intent, and together with the hundred officials urged him to accept; Gaozu would not comply.',
    idiomatic: 'Pillar of State Li Mu stepped forward to explain the court\'s intent and, with the hundred officials, pressed him to accept; Gaozu refused.',
  },
  s0020: {
    literal: 'Chun and the others again presented the investiture scroll and pressed him earnestly; Gaozu bowed twice, bowed his head to receive the scroll, and handed it to Gao Jiong.',
    idiomatic: 'Chun and the others again presented the investiture scroll and pressed him earnestly. Gaozu bowed twice, bowed his head to receive the scroll, and handed it to Gao Jiong.',
  },
  s0021: {
    literal: 'He received the seal and handed it to Yu Qingze.',
    idiomatic: 'Receiving the seal, he handed it to Yu Qingze.',
  },
  s0022: {
    literal: 'He withdrew to take his place on the eastern steps.',
    idiomatic: 'He withdrew and took his place on the eastern steps.',
  },
  s0023: {
    literal: 'The envoys and the hundred officials all faced north, bowed twice, inserted their tablets, and thrice shouted "Ten thousand years!"',
    idiomatic: 'The envoys and the hundred officials all faced north, bowed twice, tucked their tablets, and thrice shouted "Ten thousand years!"',
  },
  s0024: {
    literal: 'The relevant office requested preparation of the imperial carriage; Gaozu did not permit it, changed into gauze cap and yellow robe, and entered to attend at the Lincang Hall.',
    idiomatic: 'The relevant office requested the imperial carriage; Gaozu refused, changed into a gauze cap and yellow robe, and entered the Lincang Hall.',
  },
  s0025: {
    literal: 'Within the pavilion he donned the dragon robe and crown, rode the small palanquin, came out from the western gallery, and proceeded according to the New Year\'s audience rite.',
    idiomatic: 'Within the pavilion he donned the dragon robe and crown, rode the small palanquin out from the western gallery, and proceeded according to the New Year\'s audience rite.',
  },
  s0026: {
    literal: 'The Minister of Rites, bearing a tray with the mandate tokens and auspicious memorials, advanced below the eastern steps.',
    idiomatic: 'The Minister of Rites, bearing a tray with the mandate tokens and memorials of auspicious omens, advanced below the eastern steps.',
  },
  s0027: {
    literal: 'The Chief Counselor knelt before the throne to report.',
    idiomatic: 'Chief Counselor knelt before the throne to report.',
  },
  s0028: {
    literal: 'The Palace Secretary proclaimed a general amnesty and changed the era name to Kaihuang.',
    idiomatic: 'The Palace Secretary then proclaimed a general amnesty and changed the era name to Kaihuang.',
  },
  s0029: {
    literal: 'That day, he ordered the relevant office to offer the bound scroll in sacrifice at the Southern Suburb.',
    idiomatic: 'That same day he ordered the relevant office to offer the bound scroll in sacrifice at the Southern Suburb.',
  },
  s0030: {
    literal: 'When Later Qi was about to honor the Empress Dowager, the Grand Commandant reported with jade and silk at the Round Mound and Square Pond, and with silks at the ancestral temple.',
    idiomatic: 'Before Later Qi could honor the Empress Dowager, the Grand Commandant reported with jade and silk at the Round Mound and Square Pond, and with silks at the ancestral temple.',
  },
  s0031: {
    literal: 'The emperor then came to the front hall and ordered the Grand Mentor to bear the staff of authority, with the Grand Commandant as his deputy.',
    idiomatic: 'The emperor then came to the front hall and ordered the Grand Mentor to bear the staff of authority, with the Grand Commandant as deputy.',
  },
  s0032: {
    literal: 'Nine ushers were appointed; the envoys received the seal, cord, bound scroll, and staff of authority, and proceeded to the Western Upper Pavilion.',
    idiomatic: 'Nine ushers were appointed; the envoys received the seal, cord, bound scroll, and staff of authority and proceeded to the Western Upper Pavilion.',
  },
  s0033: {
    literal: 'On that day the regalia was fully displayed in Zhaoyang Hall; when the emperor had come to the front hall and the envoys were in place, they bore the staff of authority and seal-cord and proclaimed the edict.',
    idiomatic: 'That day the regalia was fully displayed in Zhaoyang Hall. When the emperor had come to the front hall and the envoys were in place, they bore the staff of authority and seal-cord and proclaimed the edict.',
  },
  s0034: {
    literal: 'The two attendants-in-ordinary bowed and advanced, received the staff of authority and bound scroll with seal-cord, and handed them to the junior yellow gate attendants.',
    idiomatic: 'Both attendants-in-ordinary bowed and advanced, received the staff of authority and bound scroll with seal-cord, and handed them to the junior yellow gate attendants.',
  },
  s0035: {
    literal: 'The yellow gate attendants proceeded to the pavilion with them.',
    idiomatic: 'The yellow gate attendants carried them to the pavilion.',
  },
  s0036: {
    literal: 'The Empress Dowager wore the hui robe, seated herself in Zhaoyang Hall; princesses and titled ladies lined the hall and all bowed.',
    idiomatic: 'The Empress Dowager wore the hui robe and seated herself in Zhaoyang Hall; princesses and titled ladies lined the hall and all bowed.',
  },
  s0037: {
    literal: 'The junior yellow gate attendants entered with the staff and cord; the female attendant-in-ordinary received them and presented them to the Empress Dowager.',
    idiomatic: 'Junior yellow gate attendants entered with the staff and cord; the female attendant-in-ordinary received them and presented them to the Empress Dowager.',
  },
  s0038: {
    literal: 'The Empress Dowager rose, received them, and handed them to attendants at her side.',
    idiomatic: 'Rising, the Empress Dowager, received them, and handed them to attendants at her side.',
  },
  s0039: {
    literal: 'She seated herself again and returned the staff of authority to the envoys.',
    idiomatic: 'Seating herself again and returned the staff of authority to the envoys.',
  },
  s0040: {
    literal: 'The envoys received the staff of authority and withdrew.',
    idiomatic: 'The envoys took the staff of authority and withdrew.',
  },
  s0041: {
    literal: 'Investiture of the empress followed the rites for the empress dowager.',
    idiomatic: 'Investiture of the empress followed the same rites as for the empress dowager.',
  },
  s0042: {
    literal: 'When Later Qi invested the crown prince, the emperor came to the front hall; the Director of Attendants served as envoy, with the Minister of Works as deputy.',
    idiomatic: 'For Later Qi\'s investiture of the crown prince, the emperor came to the front hall; the Director of Attendants served as envoy, with the Minister of Works as deputy.',
  },
  s0043: {
    literal: 'The crown prince wore the far-wandering cap and entered to his place.',
    idiomatic: 'Wearing the far-wandering cap, the crown prince the far-wandering cap and entered to his place.',
  },
  s0044: {
    literal: 'The envoy entered, presented the bound scroll and finished reading; the crown prince knelt to receive the scroll from the envoy and handed it to the junior tutor.',
    idiomatic: 'Entering, the envoy presented the bound scroll and finished reading; the crown prince knelt to receive the scroll from the envoy and handed it to the junior tutor.',
  },
  s0045: {
    literal: 'He also received the seal and cord from the Minister of Works and handed them to the tutor.',
    idiomatic: 'He likewise received the seal and cord from the Minister of Works and handed them to the tutor.',
  },
  s0046: {
    literal: 'He bowed his forehead to the ground and withdrew.',
    idiomatic: 'He kowtowed and withdrew.',
  },
  s0047: {
    literal: 'For investiture at the residence, the envoy bore the staff of authority to the Eastern Palace; inner and outer palace officials took their fixed places.',
    idiomatic: 'When investiture took place at the residence, the envoy bore the staff of authority to the Eastern Palace; inner and outer palace officials took their fixed places.',
  },
  s0048: {
    literal: 'The crown prince stood east of the steps, facing west.',
    idiomatic: 'Standing east of the steps, the crown prince east of the steps, facing west.',
  },
  s0049: {
    literal: 'If he was young, the Grand Tutor held him; two masters of robes bore the empty-topped cap and robe to follow, to receive the investiture scroll.',
    idiomatic: 'If he was still a child, the Grand Tutor held him while two masters of robes followed bearing the empty-topped cap and robe for him to receive the investiture scroll.',
  },
  s0050: {
    literal: 'The next day he presented a memorial of thanks in the courtyard of the Eastern Palace; the junior tutor and junior attendant rode the light carriage, bearing the memorial to the court hall to give thanks.',
    idiomatic: 'On the following day he presented a memorial of thanks in the courtyard of the Eastern Palace; the junior tutor and junior attendant rode the light carriage, bearing the memorial to the court hall to give thanks.',
  },
  s0051: {
    literal: 'On a chosen day he fasted at the Chongzheng Hall, donned the crown robe, and rode the stone-mount carriage to visit the temple.',
    idiomatic: 'On a chosen day he fasted at the Chongzheng Hall, donned the crown robe, and rode the stone-mount carriage to visit the ancestral temple.',
  },
  s0052: {
    literal: 'On a chosen day the ministers presented congratulatory gifts; on another chosen day there was a banquet.',
    idiomatic: 'On a selected day the ministers presented congratulatory gifts; on another chosen day there was a banquet.',
  },
  s0053: {
    literal: 'The next day, officials of third rank and above submitted congratulatory memorials.',
    idiomatic: 'The day after, officials of third rank and above submitted congratulatory memorials.',
  },
  s0054: {
    literal: 'To invest princes, on the day of the front-hall audience, at one quarter after the fifth watch the clerks of the Ministry of Personnel rode forth bearing the summons tablet to the prince\'s residence.',
    idiomatic: 'To invest princes, on the day of the front-hall audience, one quarter after the fifth watch the clerks of the Ministry of Personnel rode forth bearing the summons tablet to the prince\'s residence.',
  },
  s0055: {
    literal: 'The prince rode the high carriage; the guard of honor halted at the Eastern Side Gate, and he transferred to the light carriage.',
    idiomatic: 'Riding the high carriage, the prince the high carriage; the guard of honor halted at the Eastern Side Gate, and he transferred to the light carriage.',
  },
  s0056: {
    literal: 'Having entered, he came to his seat.',
    idiomatic: 'Once inside, he came to his seat.',
  },
  s0057: {
    literal: 'The Minister of Works finished reading the bound scroll and presented it to the prince, then presented the seal and cord.',
    idiomatic: 'After the Minister of Works finished reading the bound scroll and presented it to the prince, then presented the seal and cord.',
  },
  s0058: {
    literal: 'When the rite was complete, he rode the light carriage, rejoined the guard of honor, rode the high carriage to the Changhe Gate, and prostrated himself before the gate to submit a memorial of thanks.',
    idiomatic: 'With the rite complete, he rode the light carriage, rejoined the guard of honor, rode the high carriage to the Changhe Gate, and prostrated himself before the gate to submit a memorial of thanks.',
  },
  s0059: {
    literal: 'When the reply was received, he visited the temple and returned to his residence.',
    idiomatic: 'Once the reply was received, he visited the temple and returned to his residence.',
  },
  s0060: {
    literal: 'At the residence, the Director of Banquets bore the staff of authority; the Minister of Personnel presented the bound scroll; the attendant censor presented the staff of authority.',
    idiomatic: 'At the prince\'s residence, the Director of Banquets bore the staff of authority; the Minister of Personnel presented the bound scroll; the attendant censor presented the staff of authority.',
  },
  s0061: {
    literal: 'The envoy received them and withdrew, rode the light carriage, bore the staff of authority, and proceeded to the prince\'s residence.',
    idiomatic: 'Envoy received them and withdrew, rode the light carriage, bore the staff of authority, and proceeded to the prince\'s residence.',
  },
  s0062: {
    literal: 'He entered and took his place on the western steps, facing east.',
    idiomatic: 'Entering, he took his place on the western steps, facing east.',
  },
  s0063: {
    literal: 'The prince entered and stood on the eastern steps, facing west.',
    idiomatic: 'The prince entered and took his stand on the eastern steps, facing west.',
  },
  s0064: {
    literal: 'The envoy read the bound scroll; the erudite read the tablet; the prince bowed prostrate.',
    idiomatic: 'The envoy then read the bound scroll; the erudite read the tablet; the prince bowed prostrate.',
  },
  s0065: {
    literal: 'He rose, stepped forward to receive the bound scroll, seal, cord, and fief soil, bowed prostrate three times with forehead to the ground, returned to his place, and gave thanks according to the rite above.',
    idiomatic: 'He rose, stepped forward to receive the bound scroll, seal, cord, and fief soil, kowtowed three times, returned to his place, and gave thanks according to the rite above.',
  },
  s0066: {
    literal: 'At a provincial post, the envoy received the staff of authority and bound scroll, rode the light carriage to the province, and proceeded as at the prince\'s residence.',
    idiomatic: 'At a provincial post, the envoy received the staff of authority and bound scroll, rode the light carriage to the province, and proceeded as at the prince\'s residence, as prescribed.',
  },
  s0067: {
    literal: 'For princes, the Three Dukes, Commissioners with Equal Status, Ministers of Works, fifth-rank founding marquises, grand consorts, consorts, and princesses, the investiture scroll had one roller, two feet long, wrapped in white silk.',
    idiomatic: 'For princes, the Three Dukes, commissioners with equal status, ministers of works, fifth-rank founding marquises, grand consorts, consorts, and princesses, the investiture scroll had one roller two feet long, wrapped in white silk.',
  },
  s0068: {
    literal: 'Twelve bamboo slips were used; six matched the roller in length, six were one foot two inches long.',
    idiomatic: 'Twelve bamboo slips were used: six matched the roller in length, six were one foot two inches long.',
  },
  s0069: {
    literal: 'The text came from the Secretariat; all writing was in seal script.',
    idiomatic: 'All text came from the Secretariat; all writing was in seal script.',
  },
  s0070: {
    literal: 'Lament scrolls and posthumous investiture scrolls were the same.',
    idiomatic: 'Lament scrolls and posthumous investiture scrolls followed the same format.',
  },
  s0071: {
    literal: 'For princes, fifth-rank founding marquises, and district barons, in the direction of their fief they took earth from the corresponding side of the altar of the soil, wrapped it in white thatch, and placed it in a blue chest.',
    idiomatic: 'For princes, fifth-rank founding marquises, and district barons, earth was taken from the corresponding side of the altar of the soil in the direction of their fief, wrapped in white thatch, and placed in a blue chest.',
  },
  s0072: {
    literal: 'The case was five inches square, decorated with blue lacquer, sealed and presented — this served as the altar of the soil.',
    idiomatic: 'The case was five inches square, decorated with blue lacquer, sealed and presented — this represented the altar of the soil.',
  },
  s0073: {
    literal: 'Under Sui, at the front-hall audience to invest the Three Preceptors, princes, and Three Dukes, chariots and carriages were all displayed.',
    idiomatic: 'Under Sui, when investing the Three Preceptors, princes, and Three Dukes at the front-hall audience, chariots and carriages were all displayed.',
  },
  s0074: {
    literal: 'For the others, this was not done.',
    idiomatic: 'For other investitures, this was not done.',
  },
  s0075: {
    literal: 'The hundred offices took their fixed places; the Palace Secretary finished reading the bound scroll; the recipient bowed, received it, and withdrew.',
    idiomatic: 'All hundred offices took their fixed places; the Palace Secretary finished reading the bound scroll; the recipient bowed, received it, and withdrew.',
  },
  s0076: {
    literal: 'The next recipient was then led in, according to the rite above.',
    idiomatic: 'The next recipient was then led in according to the rite above.',
  },
  s0077: {
    literal: 'When investing a founding marquis, the Director of Suburban Sacrifices presented the fief soil and stood south of the guard of honor, facing west.',
    idiomatic: 'In investing a founding marquis, the Director of Suburban Sacrifices presented the fief soil and stood south of the guard of honor, facing west.',
  },
  s0078: {
    literal: 'After each investiture was complete, the fief soil was presented.',
    idiomatic: 'Upon each investiture was complete, the fief soil was presented.',
  },
  s0079: {
    literal: 'When the Later Qi emperor performed the capping rite, jade and silk were reported at the Round Mound and Square Pond, silks at the temple; on a chosen day he came to the front hall.',
    idiomatic: 'When the Later Qi emperor performed the capping rite, jade and silk were reported at the Round Mound and Square Pond and silks at the temple; on a chosen day he came to the front hall.',
  },
  s0080: {
    literal: 'At the second watch the officials took their places; the emperor came out wearing the empty-topped cap with black headband.',
    idiomatic: 'At the second watch, officials took their places; the emperor came out wearing the empty-topped cap with black headband.',
  },
  s0081: {
    literal: 'When the Grand Commandant had finished washing, he ascended, removed the empty-topped cap, placed the black headband cap, finished reading the invocation, the Grand Mentor placed the crown, the attendant-in-ordinary tied the black cord, removed the crimson gauze robe and added the dragon robe; when complete, the Grand Mentor offered the longevity toast, and the officials thrice shouted "Ten thousand years!"',
    idiomatic: 'When the Grand Commandant had finished washing, he ascended, removed the empty-topped cap, placed the black headband cap, and finished reading the invocation. The Grand Mentor placed the crown; the attendant-in-ordinary tied the black cord, removed the crimson gauze robe, and added the dragon robe. When complete, the Grand Mentor offered the longevity toast and the officials thrice shouted "Ten thousand years!"',
  },
  s0082: {
    literal: 'The emperor entered the warming chamber, moved the imperial seat, and held a banquet without the longevity toast.',
    idiomatic: 'Entering the warming chamber, moved the imperial seat, and held a banquet without the longevity toast.',
  },
  s0083: {
    literal: 'On a later day the civil and military officials in court dress presented twelve jars of ceremonial wine, twelve sacks of rice, and twelve oxen.',
    idiomatic: 'Later, civil and military officials in court dress presented twelve jars of ceremonial wine, twelve sacks of rice, and twelve oxen.',
  },
  s0084: {
    literal: 'On another chosen day he personally worshipped at the Round Mound and Square Pond and visited the temple.',
    idiomatic: 'On another chosen day he personally worshipped at the Round Mound and Square Pond and visited the ancestral temple.',
  },
  s0085: {
    literal: 'For the crown prince\'s capping, the Grand Commandant reported to the seven temples with prescribed silks; on a chosen day the emperor came to the front hall.',
    idiomatic: 'For the crown prince\'s capping, the Grand Commandant reported to the seven temples with prescribed silks; on a chosen day the emperor came to the front hall, as prescribed.',
  },
  s0086: {
    literal: 'The relevant office supplied the pavilion at the Chongzheng Hall.',
    idiomatic: 'The relevant office prepared the pavilion at the Chongzheng Hall.',
  },
  s0087: {
    literal: 'At the second watch the crown prince came out in empty-topped cap and official dress, standing south of the eastern steps facing west; the envoy entered and stood south of the western steps facing east.',
    idiomatic: 'At the second watch, the crown prince came out in empty-topped cap and official dress, standing south of the eastern steps facing west; the envoy entered and stood south of the western steps facing east.',
  },
  s0088: {
    literal: 'When the crown prince had received the edict, he entered the chamber to wash and comb, came out, and faced south.',
    idiomatic: 'After receiving the edict, the crown prince the edict, he entered the chamber to wash and comb, came out, and faced south.',
  },
  s0089: {
    literal: 'The envoy stepped forward with a bow, proceeded to the capping seat, and sat facing west.',
    idiomatic: 'The envoy bowed and stepped forward with a bow, proceeded to the capping seat, and sat facing west.',
  },
  s0090: {
    literal: 'The Director of Ceremonial Affairs finished washing and came before the crown prince to comb his hair.',
    idiomatic: 'Having washed, the Director of Ceremonial Affairs and came before the crown prince to comb his hair.',
  },
  s0091: {
    literal: 'The envoy washed again, presented the three-ridge cap of advancing worthies, came before the crown prince, faced east to invoke, removed the empty-topped cap, and placed the crown.',
    idiomatic: 'Washing again, the envoy presented the three-ridge cap of advancing worthies, came before the crown prince, faced east to invoke, removed the empty-topped cap, and placed the crown.',
  },
  s0092: {
    literal: 'The crown prince rose, entered the chamber to change clothes, came out, and again faced south to take his seat.',
    idiomatic: 'Rising, the crown prince entered the chamber to change clothes, came out, and again faced south to take his seat.',
  },
  s0093: {
    literal: 'The Director of Ceremonial Affairs washed and combed.',
    idiomatic: 'The Director of Ceremonial Affairs washed and combed again.',
  },
  s0094: {
    literal: 'The envoy washed again and invoked, removed the three-ridge cap, and placed the far-wandering cap.',
    idiomatic: 'After washing again and invoking, removed the three-ridge cap, and placed the far-wandering cap.',
  },
  s0095: {
    literal: 'The crown prince again entered the chamber to change clothes.',
    idiomatic: 'Once more the crown prince entered the chamber to change clothes.',
  },
  s0096: {
    literal: 'A mat was set west of the central pillar; the envoy bowed and took his seat facing south.',
    idiomatic: 'They set a mat west of the central pillar; the envoy bowed and took his seat facing south.',
  },
  s0097: {
    literal: 'The Director of Ceremonial Affairs washed the cup and poured the ceremonial wine; the envoy came before the mat and faced north to invoke.',
    idiomatic: 'The Director of Ceremonial Affairs washed the cup and and poured the ceremonial wine; the envoy came before the mat and faced north to invoke.',
  },
  s0098: {
    literal: 'The crown prince bowed to receive the wine, sat on the mat, offered a libation, sipped it, placed the cup, descended the steps, returned to his place, and faced west.',
    idiomatic: 'Bowing, the crown prince received the wine, sat on the mat, offered a libation, sipped it, placed the cup, descended the steps, returned to his place, and faced west.',
  },
  s0099: {
    literal: 'The Three Preceptors, Three Junior Preceptors, and assembled officials bowed; the rite was complete.',
    idiomatic: 'Then the Three Preceptors, Three Junior Preceptors, and assembled officials bowed; the rite was complete.',
  },
  s0100: {
    literal: 'On another chosen day he convened the palace officials; on another chosen day he visited the temple.',
    idiomatic: 'On another chosen day he convened the palace officials; on another chosen day he visited the ancestral temple.',
  },
};

const source = loadSentencesFromData();
const expectedIds = new Set(
  [...source.keys()].filter((id) => {
    const n = parseInt(id.slice(1), 10);
    return n >= START && n <= END;
  })
);

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '009') {
  console.log(`Session is chapter ${data.metadata.chapter}, not 009; standalone T ready (${Object.keys(T).length} entries).`);
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
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src?.chinese && row.chinese !== src.chinese) row.chinese = src.chinese;
  else if (!row.chinese) row.chinese = src.chinese;
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) throw new Error(`${key}: literal and idiomatic must differ`);
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
if (applied !== Object.keys(T).length) throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}) to ${transPath}`);
