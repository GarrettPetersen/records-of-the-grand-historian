#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Suishu ch.009 — betrothal gifts, school rites, Liang New Year audience) */
import { readFileSync, writeFileSync } from 'fs';

const dataPath = 'data/suishu/009.json';
const transPath = 'translations/current_translation_suishu.json';
const START = 201;
const END = 300;

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
      const id = s.id;
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
  s0201: { literal: 'All used one lamb, one pair of geese, and one hu each of wine, millet, panicled millet, rice, and flour.', idiomatic: 'All ranks used one lamb, one pair of geese, and one hu each of wine, millet, panicled millet, rice, and flour.' },
  s0202: { literal: 'From imperial princes down to ninth rank all were the same; those outside the regular ranks and commoners had half.', idiomatic: 'From imperial princes down to ninth rank the gifts were identical; those outside the regular ranks and commoners received half.' },
  s0203: { literal: 'For betrothal gifts, imperial princes used three bolts of black, two bolts of crimson, ten bolts of bundled silk, and one great jade tablet; from first rank down to junior third rank used jade bi; fourth rank and below had none.', idiomatic: 'For betrothal gifts, imperial princes sent three bolts of black silk, two of crimson, ten of bundled silk, and one great jade tablet. From first rank through junior third rank used jade bi; fourth rank and below had none.' },
  s0204: { literal: 'Two pieces of animal hide: from first rank down to junior fifth rank used two leopard hides; from sixth rank down to junior ninth rank used deer hide.', idiomatic: 'Two pieces of animal hide were required: first rank through junior fifth rank used two leopard hides; sixth rank through junior ninth rank used deer hide.' },
  s0205: { literal: 'Brocade sixty bolts for first rank, forty for second, thirty for third, twenty for fourth, sixteen bolts of mixed colors for fourth rank, ten for fifth, five for sixth and seventh.', idiomatic: 'Brocade: sixty bolts for first rank, forty for second, thirty for third, twenty for third rank, sixteen bolts of mixed colors for fourth, ten for fifth, five for sixth and seventh.' },
  s0206: { literal: 'Silk two hundred bolts: first rank one hundred forty, second one hundred twenty, third one hundred, fourth eighty, fifth sixty, sixth and seventh fifty, eighth and ninth thirty.', idiomatic: 'Silk totaled two hundred bolts at most: first rank one hundred forty, second one hundred twenty, third one hundred, fourth eighty, fifth sixty, sixth and seventh fifty, eighth and ninth thirty.' },
  s0207: { literal: 'One lamb, four sheep, two calves, and ten hu each of wine, millet, panicled millet, rice, and flour.', idiomatic: 'Also one lamb, four sheep, two calves, and ten hu each of wine, millet, panicled millet, rice, and flour.' },
  s0208: { literal: 'First to third rank reduced two sheep and six hu each of wine, millet, panicled millet, rice, and flour; fourth and fifth rank reduced one calf and two hu each; sixth rank and below had no calf, one hu each of wine, millet, panicled millet, rice, and flour.', idiomatic: 'First through third rank reduced two sheep and six hu of each grain and wine; fourth and fifth rank reduced one calf and two hu of each; sixth rank and below had no calf and only one hu of each.' },
  s0209: { literal: 'Sons of princes, whether enfeoffed or not, all followed first-rank rites.', idiomatic: 'Sons of princes, whether enfeoffed or not, all followed first-rank rites, as prescribed.' },
  s0210: { literal: 'Wedding escort carriages: imperial princes one hundred, first rank fifty, second and third thirty, fourth and fifth twenty, sixth and seventh ten, eighth rank down to commoners five.', idiomatic: 'Wedding escort carriages numbered one hundred for imperial princes, fifty for first rank, thirty for second and third, twenty for fourth and fifth, ten for sixth and seventh, and five from eighth rank down to commoners.' },
  s0211: { literal: 'Each followed the ornamentation of his rank.', idiomatic: 'Each followed the ornamentation appropriate to his rank.' },
  s0212: { literal: 'In the fifth year of Datong of Liang, when the Duke of Lincheng married, the duke\'s wife was aunt to the crown prince\'s consort; the protocol for the first audience differed among debaters.', idiomatic: 'In Liang Datong 5, when the Duke of Lincheng married, his wife was aunt to the crown prince\'s consort; debaters disagreed on the protocol for the first audience.' },
  s0213: { literal: 'An edict said: "The crimson-goose rite already marks the union of two surnames; the feast of wine and food also keeps marriage within kinship without losing closeness.', idiomatic: 'An edict said: "The crimson-goose rite already marks the union of two surnames; the feast of wine and food also keeps marriage within kinship without losing closeness, as prescribed.' },
  s0214: { literal: 'If hazelnuts, chestnuts, dates, and dried meat are all presented, secondary hairpins and braided ornaments fully prepared, it is wrong that the bride\'s audience rite alone should omit kinship on account of relationship.', idiomatic: 'If hazelnuts, chestnuts, dates, and dried meat are all presented, with secondary hairpins and braided ornaments fully prepared, the bride\'s audience rite alone should not omit kinship on account of relationship.' },
  s0215: { literal: 'Recently the respectful presentation of fermented milk and ceremonial wine has already transmitted the rule of wifely duty, yet offering the tray and pouring the hand-washing water is not practiced in marquisate households.', idiomatic: 'Recently the respectful presentation of fermented milk and ceremonial wine has already transmitted the rule of wifely duty, yet offering the tray and pouring the hand-washing water is not practiced in marquisate households, as prescribed.' },
  s0216: { literal: 'Thus we know that elaboration and simplification differ, substance and ornament vary by age; since the Duke of Lincheng\'s wife and the consort are aunt and niece, the simplification should cease."', idiomatic: 'Thus elaboration and simplification differ, and substance and ornament vary by age. Since the Duke of Lincheng\'s wife and the consort are aunt and niece, the simplification should cease."' },
  s0217: { literal: 'When Later Qi was about to lecture before the Son of Heaven, the classic was first fixed at the temple of Confucius; one holder of the classic, two lecture attendants, one reader, two phrase-pointers, six recorders of meaning, and two bearers of the classic were appointed.', idiomatic: 'When Later Qi was about to lecture before the Son of Heaven, the classic was first fixed at the temple of Confucius. One holder of the classic, two lecture attendants, one reader, two phrase-pointers, six recorders of meaning, and two bearers of the classic were appointed.' },
  s0218: { literal: 'On the morning of the lecture, the emperor wore the tongtian cap and dark gauze robe, rode the elephant carriage to the academy, and sat in the temple hall.', idiomatic: 'On the morning of the lecture, the emperor wore the tongtian cap and dark gauze robe, rode the elephant carriage to the academy, and sat in the temple hall, as prescribed.' },
  s0219: { literal: 'When the lecture was finished, he returned to the side hall, changed to crimson gauze robe, rode the elephant carriage, and returned to the palace.', idiomatic: 'Once the lecture was finished, he returned to the side hall, changed to crimson gauze robe, rode the elephant carriage, and returned to the palace, as prescribed.' },
  s0220: { literal: 'When the lecture was complete, a single great sacrifice was offered to Confucius, with Yan Hui as associate; suspended bells were arrayed and the six-row dance performed.', idiomatic: 'When the lecture was complete, a single great sacrifice was offered to Confucius with Yan Hui as associate; suspended bells were arrayed and the six-row dance performed.' },
  s0221: { literal: 'When the three offerings were complete, the emperor in tongtian cap and crimson gauze robe ascended the host steps and took his seat.', idiomatic: 'Once the three offerings were complete, the emperor in tongtian cap and crimson gauze robe ascended the host steps and took his seat, as prescribed.' },
  s0222: { literal: 'When the banquet was complete, he returned to the palace.', idiomatic: 'Once the banquet was complete, he returned to the palace, as prescribed.' },
  s0223: { literal: 'Each time the crown prince mastered a classic he also offered the sacrifice; he rode the stone-mount carriage, the Three Preceptors riding in carriages ahead, the Three Junior Preceptors following behind to the academy.', idiomatic: 'Each time the crown prince mastered a classic he also offered the sacrifice, riding the stone-mount carriage with the Three Preceptors in carriages ahead and the Three Junior Preceptors following behind to the academy.' },
  s0224: { literal: 'In the eighth year of Tianjian of Liang, the crown prince offered the sacrifice.', idiomatic: 'In Liang Tianjian 8 the crown prince offered the sacrifice.' },
  s0225: { literal: 'Zhou She argued: "The sacrifice is still followed by a banquet — since this is a great rite, please follow the Eastern Palace New Year audience: the crown prince wears the crimson gauze collar-robe, and suspended bells are used.', idiomatic: 'Zhou She argued: "The sacrifice is still followed by a banquet. Since this is a great rite, please follow the Eastern Palace New Year audience: the crown prince wears the crimson gauze collar-robe, and suspended bells are used.' },
  s0226: { literal: 'All who ascend the hall to sit wear vermilion robes.', idiomatic: 'Every rank who ascend the hall to sit wear vermilion robes, as prescribed.' },
  s0227: { literal: '" The emperor agreed.', idiomatic: '" The emperor agreed, as prescribed.' },
  s0228: { literal: 'The relevant office also argued: "The Rites say: \'As a son, one does not ascend or descend by the host steps.\'', idiomatic: 'Relevant office also argued: "The Rites say: \'As a son, one does not ascend or descend by the host steps.\'' },
  s0229: { literal: '\' According to the present academy, which has three flights of steps in all, I think that if the guest is of lower rank he follows the host\'s steps.', idiomatic: 'According to the present academy, which has three flights of steps, I think that if the guest is of lower rank he follows the host\'s steps.' },
  s0230: { literal: 'Now the former master is in the hall — one whom it is right to honor — so the crown prince should ascend the host steps to make clear the meaning of following the teacher.', idiomatic: 'Now the former master is in the hall — one whom it is right to honor — so the crown prince should ascend the host steps to make clear the meaning of following the teacher, as prescribed.' },
  s0231: { literal: 'If the sacrifice is finished and it is time for the banquet, when there is no longer reverence for the former master, the crown prince ascending the hall should use the western steps to make clear the meaning of not using the host steps.', idiomatic: 'If the sacrifice is finished and it is time for the banquet, when there is no longer reverence for the former master, the crown prince ascending the hall should use the western steps to make clear the meaning of not using the host steps, as prescribed.' },
  s0232: { literal: '" Director of the Ministry of Personnel Xu Mian argued: "Zheng Xuan says: \'From ranked knights upward, father and son dwell in separate quarters.\'', idiomatic: 'Director of the Ministry of Personnel Xu Mian argued: "Zheng Xuan says that from ranked knights upward, father and son dwell in separate quarters."' },
  s0233: { literal: '\' Since the quarters differ, there is no rule against using the host steps.', idiomatic: 'Since the quarters differ, there is no rule against using the host steps.' },
  s0234: { literal: 'I request that for both the sacrifice and the banquet, when the crown prince ascends the hall, he should use the eastern steps.', idiomatic: 'I request that for both the sacrifice and the banquet, when the crown prince ascends the hall, he should use the eastern steps, as prescribed.' },
  s0235: { literal: 'If the imperial carriage visits the academy, naturally the central flight is used.', idiomatic: 'If the imperial carriage visits the academy, naturally the central flight is used, as prescribed.' },
  s0236: { literal: 'I also checked the Eastern Palace New Year Audience Protocol: when the crown prince ascends the Chongzheng Hall he does not wish to use the eastern or western steps.', idiomatic: 'I also checked the Eastern Palace New Year Audience Protocol: when the crown prince ascends the Chongzheng Hall he does not wish to use the eastern or western steps, as prescribed.' },
  s0237: { literal: 'Examining the Eastern Palace master of ceremonies, the list says \'At the crown prince\'s New Year audience he ascends by the western steps\' — this transmitted custom is mistaken.', idiomatic: 'Examining the Eastern Palace master of ceremonies, the list says "At the crown prince\'s New Year audience he ascends by the western steps" — this transmitted custom is mistaken.' },
  s0238: { literal: 'I request that from now on, for great affairs of the Eastern Palace, when the crown prince ascends the Chongzheng Hall, he always use the host steps.', idiomatic: 'I request that from now on, for great affairs of the Eastern Palace, when the crown prince ascends the Chongzheng Hall, he always use the host steps, as prescribed.' },
  s0239: { literal: 'Guests attending the banquet should still use the western steps."', idiomatic: 'Banquet guests should still use the western steps."' },
  s0240: { literal: 'In the seventh year of Datong, the crown prince memorialized that his sons the Dukes of Ningguo and Lincheng enter the academy; debaters doubted this because of the rule of equal age with the teacher.', idiomatic: 'In Datong 7 the crown prince memorialized that his sons the Dukes of Ningguo and Lincheng enter the academy; debaters doubted this because of the rule of equal age with the teacher.' },
  s0241: { literal: 'Attendant-in-ordinary and Minister of Works Xiao Jingrong, Vice Minister of Works Liu Zuan, Ministers Xiao Tong, Liu Zilin, and Liu Yun and others argued: "Can and Dian both served Confucius; Hui and Lu both consulted at the Si River — in Zou and Lu this was praised as flourishing, and at Zhu and Wen none scoffed.', idiomatic: 'Attendant-in-ordinary and Minister of Works Xiao Jingrong, Vice Minister Liu Zuan, Ministers Xiao Tong, Liu Zilin, and Liu Yun and others argued: "Can and Dian both served Confucius; Hui and Lu both consulted at the Si River — in Zou and Lu this was praised as flourishing, and at Zhu and Wen none scoffed.' },
  s0242: { literal: 'Since the way of the teacher shines, gaining one measure of reverence does not diminish the heir apparent — how much less for two dukes could one say it is not permitted?', idiomatic: 'Since the way of the teacher shines, gaining one measure of reverence does not diminish the heir apparent — how much less could one forbid two dukes?' },
  s0243: { literal: '" An edict said: "Permitted."', idiomatic: '" The emperor replied: "Permitted."' },
  s0244: { literal: 'Under Later Qi, when a new academy was established, the sacrifice to the former sage and former master was required; each year in the second and eighth months the rite was regularly performed.', idiomatic: 'Under Later Qi, when a new academy was established, the sacrifice to the former sage and former master was required; each year in the second and eighth months the rite was regularly performed, as prescribed.' },
  s0245: { literal: 'On the first of each month the libationer led the erudites and below and students of the Directorate of Education and above; erudites of the Grand Academy and Four Gates ascended the hall, assistants and below and Grand Academy students below the steps, bowing to Confucius and bowing to Yan.', idiomatic: 'On the first of each month the libationer led the erudites and below and students of the Directorate of Education and above. Erudites of the Grand Academy and Four Gates ascended the hall; assistants and below and Grand Academy students stood below the steps, bowing to Confucius and bowing to Yan.' },
  s0246: { literal: 'Those who did not come on the day of the rite were recorded as one demerit.', idiomatic: 'Those who did not come on the day of the rite were recorded as one demerit, as prescribed.' },
  s0247: { literal: 'If rain soaked their clothes the rite was stopped.', idiomatic: 'If rain soaked their clothes the rite was stopped, as prescribed.' },
  s0248: { literal: 'Students received leave every ten days, always released on bing days.', idiomatic: 'Students received leave every ten days, always released on bing days, as prescribed.' },
  s0249: { literal: 'At the commandery academy temples to Confucius and Yan were set up within the ward; erudites and below also paid court monthly.', idiomatic: 'At the commandery academy temples to Confucius and Yan were set up within the ward; erudites and below also paid court monthly, as prescribed.' },
  s0250: { literal: 'Under Sui, the Directorate of the Sons of the State each year on the first ding day of the four middle months offered the sacrifice to the former sage and former master.', idiomatic: 'Under Sui, the Directorate of the Sons of the State each year on the first ding day of the four middle months offered the sacrifice to the former sage and former master, as prescribed.' },
  s0251: { literal: 'Each year the district drinking rite was performed once.', idiomatic: 'All year the district drinking rite was performed once, as prescribed.' },
  s0252: { literal: 'Provincial and commandery academies offered the sacrifice in the middle months of spring and autumn.', idiomatic: 'Provincial and commandery academies offered the sacrifice in the middle months of spring and autumn, as prescribed.' },
  s0253: { literal: 'Provinces, commanderies, and counties also each year performed the district drinking rite at the academy.', idiomatic: 'Provinces, commanderies, and counties also each year performed the district drinking rite at the academy, as prescribed.' },
  s0254: { literal: 'Students were examined in writing on yi days and given leave on bing days.', idiomatic: 'Students were examined in writing on yi days and given leave on bing days, as prescribed.' },
  s0255: { literal: 'The Liang New Year audience rite: before dawn, courtyard torches were set and regalia filled the courtyard.', idiomatic: 'Liang New Year audience rite: before dawn, courtyard torches were set and regalia filled the courtyard, as prescribed.' },
  s0256: { literal: 'The palace gate opened; the guard was strict; each office attended to its duties.', idiomatic: 'Palace gate opened; the guard was strict; each office attended to its duties, as prescribed.' },
  s0257: { literal: 'East of the great steps the White Beast Vat was placed.', idiomatic: 'East of the great steps the White Beast Vat was placed, as prescribed.' },
  s0258: { literal: 'The ministers and foreign envoys all assembled, each bowing according to his rank.', idiomatic: 'Ministers and foreign envoys all assembled, each bowing according to his rank, as prescribed.' },
  s0259: { literal: 'The attendant-in-ordinary reported the second watch; princes, dukes, ministers, and governors each holding jade tablets entered to bow.', idiomatic: 'Attendant-in-ordinary reported the second watch; princes, dukes, ministers, and governors each holding jade tablets entered to bow, as prescribed.' },
  s0260: { literal: 'The attendant-in-ordinary then reported that the outer preparations were complete; the emperor in dragon robe and crown rode the palanquin out.', idiomatic: 'Attendant-in-ordinary then reported that the outer preparations were complete; the emperor in dragon robe and crown rode the palanquin out, as prescribed.' },
  s0261: { literal: 'The attendant-in-ordinary supported him on the left, the regular attendant on the right; one vice director of the yellow gate bore the curved and straight canopy and followed.', idiomatic: 'Attendant-in-ordinary supported him on the left, the regular attendant on the right; one vice director of the yellow gate bore the curved and straight canopy and followed, as prescribed.' },
  s0262: { literal: 'Arriving at the steps, he descended from the palanquin, put on his shoes, and ascended to sit.', idiomatic: 'Arriving at the steps, he descended from the palanquin, put on his shoes, and ascended to sit, as prescribed.' },
  s0263: { literal: 'The relevant office placed the jade mat before the throne.', idiomatic: 'Relevant office placed the jade mat before the throne, as prescribed.' },
  s0264: { literal: 'Princes and dukes and below, arriving at the host steps, removed shoes and sword, ascended the hall, south of the mat presented tribute jade and tablets, descended, put on shoes and sword, and went to their places.', idiomatic: 'Princes and dukes and below, arriving at the host steps, removed shoes and sword, ascended the hall, south of the mat presented tribute jade and tablets, descended, put on shoes and sword, and went to their places, as prescribed.' },
  s0265: { literal: 'The master of guests then moved the jade tablets to the eastern wing.', idiomatic: 'Master of guests then moved the jade tablets to the eastern wing, as prescribed.' },
  s0266: { literal: 'The emperor rose, entered, and moved the imperial seat to below the western wall, facing east.', idiomatic: 'Emperor rose, entered, and moved the imperial seat to below the western wall, facing east, as prescribed.' },
  s0267: { literal: 'Places were set for the crown prince, princes, and dukes and below.', idiomatic: 'Places were set for the crown prince, princes, and dukes and below, as prescribed.' },
  s0268: { literal: 'The second watch was again reported; the emperor in tongtian cap ascended the imperial seat.', idiomatic: 'Second watch was again reported; the emperor in tongtian cap ascended the imperial seat, as prescribed.' },
  s0269: { literal: 'When the princes and dukes had finished the longevity toast, they ate.', idiomatic: 'Once the princes and dukes had finished the longevity toast, they ate, as prescribed.' },
  s0270: { literal: 'When the meal was finished, musicians performed.', idiomatic: 'Once the meal was finished, musicians performed, as prescribed.' },
  s0271: { literal: 'The Grand Provisioner presented imperial wine; the chief secretary distributed yellow citrus, reaching second rank and above.', idiomatic: 'Grand Provisioner presented imperial wine; the chief secretary distributed yellow citrus, reaching second rank and above, as prescribed.' },
  s0272: { literal: 'The Minister of Works\'s outriders led the accounting clerks — one from each commandery and kingdom — all kneeling to receive the edict.', idiomatic: 'Minister of Works\'s outriders led the accounting clerks — one from each commandery and kingdom — all kneeling to receive the edict, as prescribed.' },
  s0273: { literal: 'The attendant-in-ordinary read the Five Articles Edict; after each accounting clerk answered, those wishing to state useful proposals were permitted to go to the White Beast Vat and then return to their seats in order.', idiomatic: 'Attendant-in-ordinary read the Five Articles Edict; after each accounting clerk answered, those wishing to state useful proposals were permitted to go to the White Beast Vat and then return to their seats in order, as prescribed.' },
  s0274: { literal: 'When the banquet music ended, the emperor rode the palanquin in.', idiomatic: 'Once the banquet music ended, the emperor rode the palanquin in, as prescribed.' },
  s0275: { literal: 'When the crown prince attended court, he wore the far-wandering cap and robe, rode the golden carriage, and proceeded with guard of honor.', idiomatic: 'Once the crown prince attended court, he wore the far-wandering cap and robe, rode the golden carriage, and proceeded with guard of honor, as prescribed.' },
  s0276: { literal: 'If attending the banquet he ascended with sword and shoes.', idiomatic: 'If attending the banquet he ascended with sword and shoes, as prescribed.' },
  s0277: { literal: 'When the banquet ended, he rose first.', idiomatic: 'Once the banquet ended, he rose first, as prescribed.' },
  s0278: { literal: 'An edict of the sixth year of Tianjian said: "In recent generations, after the New Year audience was finished and the ministers were convened, the seat was moved to below the western wall, facing east.', idiomatic: 'An edict of Tianjian 6 said: "In recent generations, after the New Year audience was finished and the ministers were convened, the seat was moved to below the western wall, facing east.' },
  s0279: { literal: 'Seeking the ancient meaning, when the king feasts the myriad states he should face only south — why sit facing east?', idiomatic: 'By ancient meaning, when the king feasts the myriad states he should face only south — why sit facing east?' },
  s0280: { literal: '" Thereupon the imperial seat faced south, with the west taken as the place of honor.', idiomatic: '" Thereupon the imperial seat faced south, with the west taken as the place of honor, as prescribed.' },
  s0281: { literal: 'The crown prince and those seated on the north wall all sat on the west side facing east.', idiomatic: 'Crown prince and those seated on the north wall all sat on the west side facing east, as prescribed.' },
  s0282: { literal: 'The Minister of Works and those seated on the south all sat on the east side facing west.', idiomatic: 'Minister of Works and those seated on the south all sat on the east side facing west, as prescribed.' },
  s0283: { literal: 'Formerly at the New Year the imperial seat faced east, and the wine jar was below the eastern wall.', idiomatic: 'Formerly at the New Year the imperial seat faced east, and the wine jar was below the eastern wall, as prescribed.' },
  s0284: { literal: 'Since the imperial seat now faced south, an edict moved the jar below the southern gallery.', idiomatic: 'Since the imperial seat now faced south, an edict moved the jar below the southern gallery, as prescribed.' },
  s0285: { literal: 'Another edict said: "At the New Year, when receiving tribute of the five ranks, jade tablets and bi disks are all measured and handed to the relevant office.', idiomatic: 'Another edict said: "At the New Year, when receiving tribute of the five ranks, jade tablets and bi disks are all measured and handed to the relevant office, as prescribed.' },
  s0286: { literal: '" Zhou She noted: "In the Zhou Rites the chief steward assists with jade and silks at the great audience.', idiomatic: '" Zhou She noted: "In the Zhou Rites the chief steward assists with jade and silks at the great audience, as prescribed.' },
  s0287: { literal: 'The Minister of Works is the ancient chief steward.', idiomatic: 'Minister of Works is the ancient chief steward, as prescribed.' },
  s0288: { literal: 'In recent times the king does not personally handle the jade, so the chief steward\'s assistance is no longer needed.', idiomatic: 'In recent times the king does not personally handle the jade, so the chief steward\'s assistance is no longer needed, as prescribed.' },
  s0289: { literal: 'Since the director of the host-guest bureau of the Minister of Works is a subordinate office of the chief steward, now that the New Year presentation of jade of the five ranks is finished, I request that the host-guest director receive them.', idiomatic: 'Since the director of the host-guest bureau of the Minister of Works is a subordinate office of the chief steward, now that the New Year presentation of jade of the five ranks is finished, I request that the host-guest director receive them, as prescribed.' },
  s0290: { literal: 'Zheng Xuan annotates the Audience Rite: \'After receiving them, they are taken out and handed to the jade keeper outside.', idiomatic: 'Zheng Xuan annotates the Audience Rite: "After receiving them, they are taken out and handed to the jade keeper outside.' },
  s0291: { literal: '\' In Han times the privy treasurer managed jade tablets and bi disks; I request that the host-guest director receive the jade and hand it to the privy treasurer for keeping.', idiomatic: 'In Han times the privy treasurer managed jade tablets and bi disks; I request that the host-guest director receive the jade and hand it to the privy treasurer for keeping.' },
  s0292: { literal: '" The emperor agreed.', idiomatic: '" The emperor agreed, as prescribed.' },
  s0293: { literal: 'Vice Minister of Works Shen Yue also argued: "In the Regular Audience Protocol, when the emperor goes out he rides the palanquin to before the Taichi Hall, puts on shoes, and ascends the steps.', idiomatic: 'Vice Minister of Works Shen Yue also argued: "In the Regular Audience Protocol, when the emperor goes out he rides the palanquin to before the Taichi Hall, puts on shoes, and ascends the steps, as prescribed.' },
  s0294: { literal: 'The setting of the inner chamber is originally the ruler\'s dwelling — it is not fitting to show reverence to one\'s own palace.', idiomatic: 'Setting of the inner chamber is originally the ruler\'s dwelling — it is not fitting to show reverence to one\'s own palace, as prescribed.' },
  s0295: { literal: 'According to Han practice, one rode the small carriage to ascend the hall.', idiomatic: 'According to Han practice, one rode the small carriage to ascend the hall, as prescribed.' },
  s0296: { literal: 'I request that from now on at the New Year and great public affairs the emperor should ride the small palanquin to the Taichi steps, then ride the platform palanquin to ascend the hall.', idiomatic: 'I request that from now on at the New Year and great public affairs the emperor should ride the small palanquin to the Taichi steps, then ride the platform palanquin to ascend the hall, as prescribed.' },
  s0297: { literal: '" An edict: "Permitted."', idiomatic: '" The emperor assented: "Permitted."' },
  s0298: { literal: 'Under Chen, ten days before the New Year audience all officials rehearsed the protocol; from masters of writing downward all supervised in official dress.', idiomatic: 'Under Chen, ten days before the New Year audience all officials rehearsed the protocol; from masters of writing downward all supervised in official dress, as prescribed.' },
  s0299: { literal: 'Courtyard torches were set; street gates, city walls, and before the hall were strictly guarded; officials each took their positions for court.', idiomatic: 'Courtyard torches were set; street gates, city walls, and before the hall were strictly guarded; officials each took their positions for court, as prescribed.' },
  s0300: { literal: 'Palace women were all in the Eastern Hall, viewing through patterned screens.', idiomatic: 'Palace women were all in the Eastern Hall, viewing through patterned screens, as prescribed.' },
};

const source = loadSentencesFromData();
const expectedIds = new Set([...source.keys()].filter((id) => { const n = parseInt(id.slice(1), 10); return n >= START && n <= END; }));
const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '009') { console.log('Wrong chapter'); process.exit(0); }
const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
if (![...expectedIds].every((id) => sessionIds.has(id))) {
  for (const row of extractRange(dataPath, START, END)) {
    if (!sessionIds.has(row.originalId)) { data.sentences.push(row); sessionIds.add(row.originalId); }
  }
}
const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) { const src = source.get(id); const row = byId.get(id); if (!row) throw new Error(`Missing ${id}`); if (src?.chinese) row.chinese = src.chinese; }
let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) throw new Error(`${key}: must differ`);
  s.literal = pair.literal; s.idiomatic = pair.idiomatic; applied++;
}
if (applied !== Object.keys(T).length) throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied ${applied} translations (s${String(START).padStart(4,'0')}–s${String(END).padStart(4,'0')})`);
