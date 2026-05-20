#!/usr/bin/env node
/** Batch 5: s0401–s0486 (Suishu ch.009 — east-west debate conclusion, seasonal rites, clan feast, elder care) */
import { readFileSync, writeFileSync } from 'fs';
const dataPath = 'data/suishu/009.json';
const transPath = 'translations/current_translation_suishu.json';
const START = 401; const END = 486;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map(); let blockIndex = 0;
  for (const block of book.content) {
    let bs = block.type === 'paragraph' ? block.sentences || [] : block.type === 'table_row' ? (block.cells||[]).filter(c=>c.content?.trim()) : (block.sentences||[]).filter(s=>s.zh?.trim());
    for (const s of bs) { const id = s.id; const zh = s.zh||s.content; if (zh?.trim()) out.set(id,{chinese:zh,blockIndex}); }
    blockIndex++;
  }
  return out;
}
function extractRange(p,s,e) {
  const data = JSON.parse(readFileSync(p,'utf8')); const out=[]; const seen=new Set();
  for (let bi=0; bi<data.content.length; bi++) {
    const b=data.content[bi]; let bs = b.type==='paragraph'?b.sentences||[]:b.type==='table_row'?(b.cells||[]).filter(c=>c.content?.trim()):(b.sentences||[]).filter(x=>x.zh?.trim());
    for (const sen of bs) { const n=parseInt(sen.id.slice(1),10); if(n<s||n>e) continue;
      let zh = b.type==='table_row'?sen.content:sen.zh; let did=sen.id; if(seen.has(did)) did=`${sen.id}@${bi}`; seen.add(did);
      out.push({id:did,originalId:sen.id,blockIndex:bi,chinese:zh,literal:'',idiomatic:''}); }
  }
  return out.sort((a,b)=>parseInt(a.originalId.slice(1))-parseInt(b.originalId.slice(1)));
}

const T = {
  s0401: { literal: 'Minister Xing, based on the earlier fixed east-facing decision, again stated his original view — this is a great state rite and cannot but fully express one\'s opinion.', idiomatic: 'Minister Xing, based on the earlier fixed east-facing decision, again stated his original view — this is a great state rite and one cannot withhold one\'s full opinion.' },
  s0402: { literal: 'Shou thought the crown prince\'s Eastern Palace is placed in the Zhen trigram — the meaning of the eldest son.', idiomatic: 'Shou thought the crown prince\'s Eastern Palace is placed in the Zhen trigram — the meaning of the eldest son, as prescribed.' },
  s0403: { literal: 'According to the eight trigrams of the Changes, the proper position faces the center.', idiomatic: 'By to the eight trigrams of the Changes, the proper position faces the center, as prescribed.' },
  s0404: { literal: 'The crown prince now dwells in the northern city; relative to the palace he is northeast — sitting facing south is in meaning turning one\'s back.', idiomatic: 'crown prince now dwells in the northern city; relative to the palace he is northeast — sitting facing south is in meaning turning one\'s back, as prescribed.' },
  s0405: { literal: 'The earlier decision was based on the Eastern Palace as foundation.', idiomatic: 'earlier decision was based on the Eastern Palace as foundation, as prescribed.' },
  s0406: { literal: 'I also checked the Old Affairs of the Eastern Palace: at crown prince banquets facing west was mostly the rite — this is further proof, not mere words.', idiomatic: 'Shou also checked the Old Affairs of the Eastern Palace: at crown prince banquets facing west was mostly the rite — this is further proof, not mere words, as prescribed.' },
  s0407: { literal: 'I do not say the crown prince never sits southeast or southwest — only that each is used where appropriate.', idiomatic: 'Shou do not say the crown prince never sits southeast or southwest — only that each is used where appropriate, as prescribed.' },
  s0408: { literal: 'As for the Western Garden facing east, there is no doubt.', idiomatic: 'As for the Western Garden facing east, there is no doubt, as prescribed.' },
  s0409: { literal: 'I do not know what debate about sameness or difference in carriage and dress of minister and ruler prompted this — why was it raised?', idiomatic: 'Shou do not know what debate about sameness or difference in carriage and dress of minister and ruler prompted this — why was it raised?' },
  s0410: { literal: 'Even as they say, one only knows that where ritual is the same it cannot be made different.', idiomatic: 'Even as they say, one only knows that where ritual is the same it cannot be made different, as prescribed.' },
  s0411: { literal: 'One does not know that where ritual differs it cannot be made the same.', idiomatic: 'One does not know that where ritual differs it cannot be made the same, as prescribed.' },
  s0412: { literal: 'If one distinguished the rites of sameness and difference between minister and ruler, I fear the paper would pile up and writing would not exhaust it.', idiomatic: 'Where one distinguished the rites of sameness and difference between minister and ruler, I fear the paper would pile up and writing would not exhaust it, as prescribed.' },
  s0413: { literal: 'Zicai finally held to east; Shou held to west — citing classics back and forth at great length.', idiomatic: 'Zicai finally held to east; Shou held to west — citing classics back and forth at great length, as prescribed.' },
  s0414: { literal: 'In the end facing west was fixed.', idiomatic: 'In the end facing west was fixed, as prescribed.' },
  s0415: { literal: 'At the time debaters also doubted whether a palace officer\'s surname was the same as the crown prince\'s name.', idiomatic: 'During the time debaters also doubted whether a palace officer\'s surname was the same as the crown prince\'s name, as prescribed.' },
  s0416: { literal: 'Zicai also said: "According to the Court Rites, \'sons of grandees and knights do not share the heir apparent\'s name.\'', idiomatic: 'Zicai also said: "According to the Court Rites, sons of grandees and knights do not share the heir apparent\'s name."' },
  s0417: { literal: 'Zheng\'s annotation says: \'If born first, it is also not changed.\'', idiomatic: 'Zheng\'s annotation says: "If born first, it is also not changed."' },
  s0418: { literal: 'Han law: when the Son of Heaven acceded he published his name throughout the realm — within the four seas none failed to avoid it.', idiomatic: 'Han law: when the Son of Heaven acceded he published his name throughout the realm — within the four seas none failed to avoid it, as prescribed.' },
  s0419: { literal: 'According to the Spring and Autumn Annals, "Wei\'s Shi E fled to Jin" — before Duke Xian of Wei died.', idiomatic: 'By to the Spring and Autumn Annals, "Wei\'s Shi E fled to Jin" — before Duke Xian of Wei died, as prescribed.' },
  s0420: { literal: 'When Xian died his son E was first installed.', idiomatic: 'Once Xian died his son E was first installed, as prescribed.' },
  s0421: { literal: 'This shows Shi E shared the eldest son\'s name.', idiomatic: 'This shows Shi E shared the eldest son\'s name, as prescribed.' },
  s0422: { literal: 'The feudal lords\' eldest sons, within one state, and the crown prince relative to the Son of Heaven — ritual is not different.', idiomatic: 'The feudal lords\' eldest sons within one state, and the crown prince relative to the Son of Heaven — ritual is not different.' },
  s0423: { literal: 'Zheng\'s saying that those born first are not changed probably takes this meaning.', idiomatic: 'Zheng\'s saying that those born first are not changed probably takes this meaning, as prescribed.' },
  s0424: { literal: 'Wei\'s Shi E and Song\'s Xiang Xu both shared their ruler\'s name — the Spring and Autumn does not censure them.', idiomatic: 'Wei\'s Shi E and Song\'s Xiang Xu both shared their ruler\'s name — the Spring and Autumn does not censure them, as prescribed.' },
  s0425: { literal: 'Though the crown prince has the weight of heir apparent, he is not yet avoided throughout the realm — how can one lightly change people\'s surnames?', idiomatic: 'Though the crown prince bears the weight of heir apparent, he is not yet taboo throughout the realm — how can one lightly change people\'s surnames?' },
  s0426: { literal: 'Yet affairs have their fluctuations and cannot all match antiquity.', idiomatic: 'Yet affairs have their fluctuations and cannot all match antiquity, as prescribed.' },
  s0427: { literal: 'Palace officers are most lowly, yet if they violate this and attend morning and evening it is also hard to be at ease — they should be permitted to leave the palace; the Ministry of Works should replace them with others.', idiomatic: 'Palace officers are most lowly, yet if they violate this and attend morning and evening it is also hard to be at ease — they should be permitted to leave the palace; the Ministry of Works should replace them with others, as prescribed.' },
  s0428: { literal: '" An edict: "Permitted."', idiomatic: '" The emperor assented: "Permitted."' },
  s0429: { literal: 'Under Later Zhou, on the second day of the first month the crown prince faced south, suspended bells were arrayed, and palace officers offered New Year congratulations.', idiomatic: 'Under Later Zhou, on the second day of the first month the crown prince faced south, suspended bells were arrayed, and palace officers offered New Year congratulations, as prescribed.' },
  s0430: { literal: 'At the beginning of Kaihuang, Crown Prince Yong followed precedent, spread music, and received court; palace officers and capital officials faced north and shouted congratulations.', idiomatic: 'During the beginning of Kaihuang, Crown Prince Yong followed precedent, spread music, and received court; palace officers and capital officials faced north and shouted congratulations, as prescribed.' },
  s0431: { literal: 'Gaozu reproved this.', idiomatic: 'Gaozu reproved this, as prescribed.' },
  s0432: { literal: 'Afterward the protocol was fixed: sitting facing west, only palace officers shouted congratulations; capital officials no longer all assembled.', idiomatic: 'Afterward the protocol was fixed: sitting facing west, only palace officers shouted congratulations; capital officials no longer all assembled, as prescribed.' },
  s0433: { literal: 'When Yang Guang was crown prince he memorialized to reduce his robe rank; palace officers requested not to address him as "subject."', idiomatic: 'Once Yang Guang was crown prince he memorialized to reduce his robe rank; palace officers requested not to address him as "subject."' },
  s0434: { literal: 'An edict permitted it.', idiomatic: 'The emperor permitted it, as prescribed.' },
  s0435: { literal: 'On the Beginning of Spring of Later Qi, the emperor wore the tongtian cap, green headband cap, green gauze robe, dark jade pendant, green belt, green trousers, green socks and shoes, and received court in the Taichi Hall.', idiomatic: 'During the Beginning of Spring of Later Qi, the emperor wore the tongtian cap, green headband cap, green gauze robe, dark jade pendant, green belt, green trousers, green socks and shoes, and received court in the Taichi Hall, as prescribed.' },
  s0436: { literal: 'When the Minister of Works and others were seated, a director of the Three Dukes bureau came to the mat, knelt, read the seasonal command, finished; the imperial caterer poured wine into a cup, placed it before the director, who drank alone, returned to his seat, bowed prostrate, drank, and when the rite was complete withdrew.', idiomatic: 'When the Minister of Works and others were seated, a director of the Three Dukes bureau came to the mat, knelt, and read the seasonal command. The imperial caterer poured wine into a cup, placed it before the director, who drank alone, returned to his seat, bowed prostrate, drank, and when the rite was complete withdrew.' },
  s0437: { literal: 'For Beginning of Summer, Midsummer, and Beginning of Autumn command-reading, the imperial seat was set at the central pillar facing south.', idiomatic: 'For Beginning of Summer, Midsummer, and Beginning of Autumn command-reading, the imperial seat was set at the central pillar facing south, as prescribed.' },
  s0438: { literal: 'Beginning of Winter was as Beginning of Spring, in the western wing facing east.', idiomatic: 'Beginning of Winter was as Beginning of Spring, in the western wing facing east, as prescribed.' },
  s0439: { literal: 'Each used robes of the color of the season; the rite was all as at the spring rite.', idiomatic: 'Each used robes of the color of the season; the rite was all as at the spring rite, as prescribed.' },
  s0440: { literal: 'Under Later Qi, whenever licentiates and filial exemplars were examined, the Secretariat examined licentiates, the Directorate examined tribute scholars, the Director of Merit examined the incorrupt and able; the emperor in regular dress rode the palanquin out and sat at the central pillar of the court hall.', idiomatic: 'Under Later Qi, whenever licentiates and filial exemplars were examined, the Secretariat examined licentiates, the Directorate examined tribute scholars, the Director of Merit examined the incorrupt and able; the emperor in regular dress rode the palanquin out and sat at the central pillar of the court hall, as prescribed.' },
  s0441: { literal: 'Licentiates and filial exemplars each answered in turn with draft essays.', idiomatic: 'Licentiates and filial exemplars each answered in turn with draft essays, as prescribed.' },
  s0442: { literal: 'Those with omissions, sloppy writing, or carelessness stood behind their seats, drank ink, and lost their ceremonial knife.', idiomatic: 'Men with omissions, sloppy writing, or carelessness stood behind their seats, drank ink, and lost their ceremonial knife, as prescribed.' },
  s0443: { literal: 'The Later Qi rite for feasting the imperial clan: the emperor in regular dress sat in a separate hall in the western wing facing east.', idiomatic: 'Later Qi rite for feasting the imperial clan: the emperor in regular dress sat in a separate hall in the western wing facing east, as prescribed.' },
  s0444: { literal: 'Descendants of the seven temples all wore official dress; those without office wore single garments with headband caps and assembled at the Shenwu Gate.', idiomatic: 'Descendants of the seven temples all wore official dress; those without office wore single garments with headband caps and assembled at the Shenwu Gate, as prescribed.' },
  s0445: { literal: 'Imperial clansmen by seniority lined up in the hall courtyard.', idiomatic: 'Imperial clansmen by seniority lined up in the hall courtyard, as prescribed.' },
  s0446: { literal: 'Those seventy were supported by two in bowing; those eighty were supported but did not bow.', idiomatic: 'Men seventy were supported by two in bowing; those eighty were supported but did not bow, as prescribed.' },
  s0447: { literal: 'Ascending the hall to their places, when the emperor rose the clansmen bowed prostrate.', idiomatic: 'Ascending the hall to their places, when the emperor rose the clansmen bowed prostrate, as prescribed.' },
  s0448: { literal: 'When the emperor seated himself they rose, bowed, and seated themselves.', idiomatic: 'Once the emperor seated himself they rose, bowed, and seated themselves, as prescribed.' },
  s0449: { literal: 'The honored faced south, the lowly north; all took west as the place of honor.', idiomatic: 'honored faced south, the lowly north; all took west as the place of honor, as prescribed.' },
  s0450: { literal: 'Those eighty were granted one seat.', idiomatic: 'Men eighty were granted one seat, as prescribed.' },
  s0451: { literal: 'At the second round, string and bamboo music was brought in.', idiomatic: 'During the second round, string and bamboo music was brought in, as prescribed.' },
  s0452: { literal: 'When three cups were finished the clansmen left their mats and waited for the summons before returning to their places.', idiomatic: 'Once three cups were finished the clansmen left their mats and waited for the summons before returning to their places, as prescribed.' },
  s0453: { literal: 'Then the uncounted cup round proceeded.', idiomatic: 'Then the uncounted cup round proceeded, as prescribed.' },
  s0454: { literal: 'On the full moon of the first month for boating, the emperor rode the palanquin with musicians to the traveling hall.', idiomatic: 'During the full moon of the first month for boating, the emperor rode the palanquin with musicians to the traveling hall, as prescribed.' },
  s0455: { literal: 'He ascended the imperial seat, rode the platform palanquin, boarded the boat with princes and dukes, and wine was set out.', idiomatic: 'The emperor ascended the imperial seat, rode the platform palanquin, boarded the boat with princes and dukes, and wine was set out, as prescribed.' },
  s0456: { literal: 'Those not attending the boating sat in the side pavilion.', idiomatic: 'Men not attending the boating sat in the side pavilion, as prescribed.' },
  s0457: { literal: 'In the second month on the appointed day the elder-care rite was performed.', idiomatic: 'In the second month on the appointed day the elder-care rite was performed, as prescribed.' },
  s0458: { literal: 'One day before, the Three Elders and Five Worthies fasted at the Directorate of Education.', idiomatic: 'One day before, the Three Elders and Five Worthies fasted at the Directorate of Education, as prescribed.' },
  s0459: { literal: 'The emperor wore the cap of advancing worthies and dark gauze robe, came to the Bi Yong, and entered the Zongzhang Hall.', idiomatic: 'emperor wore the cap of advancing worthies and dark gauze robe, came to the Bi Yong, and entered the Zongzhang Hall, as prescribed.' },
  s0460: { literal: 'Palace bells were arrayed.', idiomatic: 'Palace bells were arrayed, as prescribed.' },
  s0461: { literal: 'Princes and dukes and below, state elders and common elders each took their places.', idiomatic: 'Princes and dukes and below, state elders and common elders each took their places, as prescribed.' },
  s0462: { literal: 'The Minister of Education with guard of honor and armed escort in the secure carriage welcomed the Three Elders and Five Worthies from the Directorate of Education.', idiomatic: 'Minister of Education with guard of honor and armed escort in the secure carriage welcomed the Three Elders and Five Worthies from the Directorate of Education, as prescribed.' },
  s0463: { literal: 'All wore the cap of advancing worthies, dark robes, black shoes, and plain belts.', idiomatic: 'Every wore the cap of advancing worthies, dark robes, black shoes, and plain belts, as prescribed.' },
  s0464: { literal: 'Directorate students in black headband caps, blue collars, and single garments rode horses following to the hall.', idiomatic: 'Directorate students in black headband caps, blue collars, and single garments rode horses following to the hall, as prescribed.' },
  s0465: { literal: 'The emperor removed his sword, took the scepter, and welcomed them inside the gate.', idiomatic: 'emperor removed his sword, took the scepter, and welcomed them inside the gate, as prescribed.' },
  s0466: { literal: 'When the Three Elders reached the gate, the Five Worthies at ten paces from the gate descended from the carriage to enter.', idiomatic: 'Once the Three Elders reached the gate, the Five Worthies at ten paces from the gate descended from the carriage to enter, as prescribed.' },
  s0467: { literal: 'The emperor bowed; the Three Elders and Five Worthies adjusted their robes and returned the bow.', idiomatic: 'emperor bowed; the Three Elders and Five Worthies adjusted their robes and returned the bow, as prescribed.' },
  s0468: { literal: 'The emperor bowed and advanced; the Three Elders in front, the Five Worthies behind, ascended by the right steps and took their mats.', idiomatic: 'emperor bowed and advanced; the Three Elders in front, the Five Worthies behind, ascended by the right steps and took their mats, as prescribed.' },
  s0469: { literal: 'The Three Elders sat; the Five Worthies stood.', idiomatic: 'Three Elders sat; the Five Worthies stood, as prescribed.' },
  s0470: { literal: 'The emperor ascended the hall facing north.', idiomatic: 'emperor ascended the hall facing north, as prescribed.' },
  s0471: { literal: 'Princes and dukes ascended by the left steps facing north.', idiomatic: 'Princes and dukes ascended by the left steps facing north, as prescribed.' },
  s0472: { literal: 'The Three Dukes presented tables and staffs; ministers corrected their shoes; state elders and common elders each took their places.', idiomatic: 'Three Dukes presented tables and staffs; ministers corrected their shoes; state elders and common elders each took their places, as prescribed.' },
  s0473: { literal: 'The emperor bowed to the Three Elders; all ministers bowed.', idiomatic: 'emperor bowed to the Three Elders; all ministers bowed, as prescribed.' },
  s0474: { literal: 'He did not bow to the Five Worthies.', idiomatic: 'The emperor did not bow to the Five Worthies, as prescribed.' },
  s0475: { literal: 'Then he seated himself; the emperor faced west and bowed respectfully to the Five Worthies.', idiomatic: 'Then he seated himself; the emperor faced west and bowed respectfully to the Five Worthies, as prescribed.' },
  s0476: { literal: 'Delicacies and wine were brought in; he bared his shoulder to cut, held the sauce to feed them, held the cup to rinse their mouths.', idiomatic: 'Delicacies and wine were brought in; he bared his shoulder to cut, held the sauce to feed them, held the cup to rinse their mouths, as prescribed.' },
  s0477: { literal: 'In order he advanced to the Five Worthies.', idiomatic: 'In order he advanced to the Five Worthies, as prescribed.' },
  s0478: { literal: 'Wine and fermented milk were also set out for state elders and common elders.', idiomatic: 'Wine and fermented milk were also set out for state elders and common elders, as prescribed.' },
  s0479: { literal: 'The emperor ascended the imperial seat; the Three Elders then expounded the five filialities and six harmonies — the great outline of canonical instruction.', idiomatic: 'emperor ascended the imperial seat; the Three Elders then expounded the five filialities and six harmonies — the great outline of canonical instruction, as prescribed.' },
  s0480: { literal: 'The emperor bowed empty-bodied to request instruction; when the rite was complete he returned.', idiomatic: 'emperor bowed empty-bodied to request instruction; when the rite was complete he returned, as prescribed.' },
  s0481: { literal: 'Also in the capital and outer provinces, those seventy and above were given dove staffs and yellow caps.', idiomatic: 'Further, in the capital and outer provinces, those seventy and above were given dove staffs and yellow caps, as prescribed.' },
  s0482: { literal: 'When there was an edict it was given; this was not regular.', idiomatic: 'Once there was an edict it was given; this was not regular, as prescribed.' },
  s0483: { literal: 'In the third year of Baoding of Later Zhou the elder-care rite was performed.', idiomatic: 'In Later Zhou Baoding 3 the elder-care rite was performed.' },
  s0484: { literal: 'Grand Tutor Duke Yuwen Jin of Yan was appointed Three Elder.', idiomatic: 'Grand Tutor Duke Yuwen Jin of Yan was appointed Three Elder, as prescribed.' },
  s0485: { literal: 'The relevant office prepared the rite and chose the day; Gaozu attended the Grand Academy to feast him.', idiomatic: 'relevant office prepared the rite and chose the day; Gaozu attended the Grand Academy to feast him, as prescribed.' },
  s0486: { literal: 'The affair is recorded in Jin\'s biography.', idiomatic: 'affair is recorded in Jin\'s biography, as prescribed.' },
};

const source = loadSentencesFromData();
const expectedIds = new Set([...source.keys()].filter(id => { const n=parseInt(id.slice(1),10); return n>=START&&n<=END; }));
const data = JSON.parse(readFileSync(transPath,'utf8'));
if (data.metadata.chapter !== '009') process.exit(0);
const sessionIds = new Set(data.sentences.map(s=>s.originalId||s.id));
if (![...expectedIds].every(id=>sessionIds.has(id))) for (const row of extractRange(dataPath,START,END)) if (!sessionIds.has(row.originalId)) { data.sentences.push(row); sessionIds.add(row.originalId); }
const byId = new Map(data.sentences.map(s=>[s.originalId||s.id,s]));
for (const id of expectedIds) { const row=byId.get(id); if (!row) throw new Error(id); if (source.get(id)?.chinese) row.chinese=source.get(id).chinese; }
let applied=0;
for (const s of data.sentences) { const p=T[s.originalId||s.id]; if (!p) continue; if (p.literal===p.idiomatic) throw new Error(s.originalId); s.literal=p.literal; s.idiomatic=p.idiomatic; applied++; }
if (applied!==Object.keys(T).length) throw new Error(`Applied ${applied}`);
writeFileSync(transPath, JSON.stringify(data,null,2)+'\n');
console.log(`Applied ${applied} (s${String(START).padStart(4,'0')}–s${String(END).padStart(4,'0')})`);
