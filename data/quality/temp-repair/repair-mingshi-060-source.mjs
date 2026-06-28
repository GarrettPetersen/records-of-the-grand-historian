#!/usr/bin/env node
/**
 * Patch manualTranslations and insertion anchors for mingshi/060 source-correspondence items.
 */

import fs from 'node:fs';

const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-mingshi.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

function withMeta(rows) {
  return rows.map((row) => ({ ...row, ...META }));
}

const HONGWU_TOMB_OMISSION = withMeta([
  {
    zh: '洪武元年三月，遣官致祭仁祖陵，二年，加號英陵。',
    literal:
      'In the third month of the first year of Hongwu, officials were dispatched to sacrifice at Renzu Mausoleum; in the second year it was given the additional title Ying Mausoleum.',
    idiomatic:
      'In the third month of Hongwu 1, officials were sent to sacrifice at Renzu Mausoleum; in year 2 it received the additional title Ying Mausoleum.',
  },
  {
    zh: '禮部尚書崔亮請下太常行祭告禮。',
    literal:
      'Minister of Rites Cui Liang petitioned that the Court of Imperial Sacrifices be ordered to perform the sacrificial announcement ritual.',
    idiomatic:
      'Minister of Rites Cui Liang asked that the Court of Imperial Sacrifices be ordered to perform the sacrificial announcement ritual.',
  },
  {
    zh: '博士孫吾與言：「山陵之制，莫備於漢，初未有祭告之禮。',
    literal:
      'Doctor Sun Wuyu said: "In the regulations for mountain tombs, none are more complete than those of the Han, and at first there was no sacrificial announcement ritual.',
    idiomatic:
      'Doctor Sun Wuyu said: "In regulations for imperial tombs, none are more complete than the Han, and at first there was no sacrificial announcement ritual.',
  },
  {
    zh: '蓋廟號、陵號不同。',
    literal: 'For temple titles and tomb titles differ.',
    idiomatic: 'Temple titles and tomb titles differ.',
  },
  {
    zh: '廟號易大行之號，必上冊諡，告之神明，陵號則後嗣王所以識別先後而已，願罷英陵祭告。」',
    literal:
      'A temple title changes the great designation; one must present a posthumous book and announce it to the spirits. A tomb title is only for later kings to distinguish precedence—I ask that the Ying Mausoleum announcement be abolished."',
    idiomatic:
      'A temple title changes the great designation and requires a posthumous book announced to the spirits; a tomb title only lets later kings distinguish precedence. I ask that the Ying Mausoleum announcement be abolished."',
  },
  {
    zh: '亮言：「漢光武加先陵曰昌，宋太祖加高、曾、祖、考陵曰欽、康、定、安。',
    literal:
      'Liang said: "Emperor Guangwu of Han added to his forefather\'s tomb the title Chang; Emperor Taizu of Song added to the tombs of his great-great-grandfather, great-grandfather, grandfather, and father the titles Qin, Kang, Ding, and An.',
    idiomatic:
      'Liang said: "Emperor Guangwu of Han styled his forefather\'s tomb Chang; Emperor Taizu of Song styled the tombs of his great-great-grandfather, great-grandfather, grandfather, and father Qin, Kang, Ding, and An.',
  },
  {
    zh: '蓋尊祖考由尊其陵，尊其制則必以告，禮緣人情，告之是。」',
    literal:
      'Honoring forefathers and fathers proceeds through honoring their tombs; honoring their regulations must be announced. Ritual follows human feeling—announcement is right."',
    idiomatic:
      'Honoring forefathers proceeds through honoring their tombs; honoring their regulations requires announcement. Ritual follows human feeling—announcement is right."',
  },
  {
    zh: '廷議皆是亮。',
    literal: 'Court deliberation all sided with Liang.',
    idiomatic: 'The court deliberation unanimously sided with Liang.',
  },
  {
    zh: '從之。',
    literal: 'The proposal was adopted.',
    idiomatic: 'Approved.',
  },
  {
    zh: '熙祖陵，每歲正旦、清明、中元、冬至及每月朔望，本署官供祭行禮。',
    literal:
      'At Xizu Mausoleum, each year on New Year\'s Day, Qingming, the mid-year festival, the winter solstice, and on each new and full moon, officials of the local office supplied sacrifice and performed the rite.',
    idiomatic:
      'At Xizu Mausoleum, on New Year\'s Day, Qingming, the mid-year festival, the winter solstice, and each new and full moon, local office officials supplied sacrifice and performed the rite.',
  },
  {
    zh: '又即其地望祭德祖、懿祖二陵。',
    literal: 'At that site distant sacrifice was also offered to the two tombs of Dezu and Yizu.',
    idiomatic: 'At that site distant sacrifice was also offered to the tombs of Dezu and Yizu.',
  },
  {
    zh: '英陵後改稱皇陵，多孟冬一祭，俱署官行禮；',
    literal:
      'Ying Mausoleum was later renamed the imperial mausoleum, with one additional sacrifice in mid-winter; all were performed by local office officials;',
    idiomatic:
      'Ying Mausoleum was later renamed the imperial mausoleum, with one additional mid-winter sacrifice, all performed by local office officials;',
  },
  {
    zh: '朔望，中都留守司官行禮。',
    literal: 'On new and full moons, officials of the Zhongdu garrison command performed the rite.',
    idiomatic: 'On new and full moons the Zhongdu garrison command performed the rite.',
  },
]);

const PRINCE_MOURNING_OMISSION = withMeta([
  {
    zh: '洪武二年，開平王常遇春卒于軍。',
    literal: 'In the second year of Hongwu, Prince of Kaiping Chang Yuchun died in camp.',
    idiomatic: 'In Hongwu 2, Prince of Kaiping Chang Yuchun died in camp.',
  },
  {
    zh: '訃至，禮官請如宋太宗爲趙普舉哀故事。',
    literal:
      'When the death notice arrived, ritual officials asked to follow the precedent of Emperor Taizong of Song raising lamentation for Zhao Pu.',
    idiomatic:
      'When the obituary arrived, ritual officials asked to follow the precedent of Song Taizong raising lamentation for Zhao Pu.',
  },
  {
    zh: '遂定制，凡王公薨，訃報太常司，示百官，於西華門內壬地設御幄，陳御座，置素褥。',
    literal:
      'Regulations were then fixed: whenever a prince died, the death notice was reported to the Court of Imperial Sacrifices and shown to all officials; within Xihua Gate on ren ground an imperial canopy was set up, the imperial seat displayed, and plain cushions placed.',
    idiomatic:
      'Regulations were fixed: when a prince died, the obituary went to the Court of Imperial Sacrifices and was shown to officials; inside Xihua Gate an imperial canopy was set with the imperial seat and plain cushions.',
  },
  {
    zh: '設訃者位於前，設百官陪哭位東西向，奉慰位於訃者位北，北向。',
    literal:
      'The obituary-bearers\' positions were set before; officials\' positions to accompany weeping faced east and west; consolation positions were north of the obituary-bearers, facing north.',
    idiomatic:
      'Obituary-bearers\' places were set in front; officials\' weeping places faced east and west; consolation places lay north of the obituary-bearers, facing north.',
  },
  {
    zh: '贊禮二人，位於訃者位之北，引訃者二人，位於贊禮之南，引百官四人，位於陪位之北，皆東西向。',
    literal:
      'Two ritual announcers stood north of the obituary-bearers; two ushers for obituary-bearers south of the announcers; four ushers for officials north of the accompanying positions—all facing east and west.',
    idiomatic:
      'Two announcers stood north of the obituary-bearers; two ushers for them south of the announcers; four ushers for officials north of the accompanying places—all facing east and west.',
  },
  {
    zh: '其日，備儀仗於奉天門迎駕。',
    literal: 'On that day, ceremonial guards were prepared at Fengtian Gate to welcome the imperial procession.',
    idiomatic: 'That day ceremonial guards were prepared at Fengtian Gate to welcome the procession.',
  },
  {
    zh: '皇帝素服乘輿詣幄，樂陳於幄之南，不作。',
    literal: 'The emperor in plain dress rode the carriage to the canopy; music was arrayed south of the canopy but not performed.',
    idiomatic: 'The emperor in plain dress proceeded to the canopy; music was arrayed south of it but not played.',
  },
  {
    zh: '太常卿奉：「某官來訃，某年月日，臣某官以某疾薨，請舉哀。」',
    literal:
      'The Director of Imperial Sacrifices presented: "Such-and-such official brings the death notice: on such year, month, and day, minister such-and-such official died of such illness—please raise lamentation."',
    idiomatic:
      'The Director presented: "Official [name] brings the obituary: on [date], minister [name] died of [illness]—please raise lamentation."',
  },
  {
    zh: '皇帝哭，百官皆哭。',
    literal: 'The emperor wept; all officials wept.',
    idiomatic: 'The emperor wept and all officials wept.',
  },
  {
    zh: '太常卿奏止哭，百官奉慰訖，分班立。',
    literal:
      'The Director announced cessation of weeping; after officials offered consolation, they stood in separate ranks.',
    idiomatic:
      'The Director announced cessation of weeping; after officials offered consolation they stood in separate ranks.',
  },
  {
    zh: '訃者四拜退，太常卿奏禮畢。',
    literal: 'The obituary-bearers bowed four times and withdrew; the Director announced the rite complete.',
    idiomatic: 'The obituary-bearers bowed four times and withdrew; the Director announced the rite complete.',
  },
  {
    zh: '乘輿還宮，百官出。',
    literal: 'The imperial carriage returned to the palace; officials departed.',
    idiomatic: 'The imperial carriage returned to the palace and officials departed.',
  },
  {
    zh: '東宮爲王公舉哀儀同，但設幄於東宮西門外，陪哭者皆東宮屬。',
    literal:
      'The Eastern Palace\'s protocol for raising lamentation for princes was the same, except the canopy was set outside the Western Gate of the Eastern Palace and those accompanying weeping were all Eastern Palace staff.',
    idiomatic:
      'The Eastern Palace mourning protocol was the same, except the canopy was set outside the Eastern Palace\'s west gate and accompanying mourners were all Eastern Palace staff.',
  },
]);

const TOMB_VISIT_OMISSION = withMeta([
  {
    zh: '永樂元年，工部以泗州祖陵黑瓦爲言。',
    literal: 'In the first year of Yongle, the Ministry of Works reported on the black tiles of the ancestral mausoleum at Sizhou.',
    idiomatic: 'In Yongle 1, the Ministry of Works reported on the black tiles of the Sizhou ancestral mausoleum.',
  },
  {
    zh: '帝命易以黃，如皇陵制。',
    literal: 'The emperor ordered them replaced with yellow, as at the imperial mausoleum.',
    idiomatic: 'The emperor ordered them replaced with yellow, following imperial mausoleum regulations.',
  },
  {
    zh: '宣宗即位，遣鄭王謁祭孝陵。',
    literal: 'When Xuandezong ascended the throne, he dispatched the Prince of Zheng to visit and sacrifice at Xiaoling.',
    idiomatic: 'At Xuandezong\'s accession he dispatched the Prince of Zheng to visit and sacrifice at Xiaoling.',
  },
  {
    zh: '正統二年諭，天壽山陵寢，剪伐樹木者重罪，都察院榜禁，錦衣衛官校巡視，工部欽天監官環山立界，十年，謁三陵，諭百官具淺色衣服，如洪武、永樂例。',
    literal:
      'In the second year of Zhengtong an edict declared that at the Tianshou Mountain mausoleum precinct, felling trees was a grave offense; the Censorate posted prohibitions, Brocade Guard officers patrolled, and Ministry of Works and Astronomical Directorate officials set boundaries around the mountain. In the tenth year, when visiting the three mausoleums, officials were ordered to wear pale garments, as in the Hongwu and Yongle precedents.',
    idiomatic:
      'In Zhengtong 2 an edict declared felling trees at the Tianshou Mountain mausoleum a grave offense; the Censorate posted prohibitions, Brocade Guard officers patrolled, and Works and Astronomical Directorate officials set boundaries around the mountain. In year 10, visiting the three mausoleums, officials were ordered to wear pale dress per Hongwu and Yongle precedent.',
  },
  {
    zh: '南京司禮太監陳祖圭言：「魏國公徐俌每祭孝陵，皆由紅券門直入，至殿內行禮，僭妄宜改。」',
    literal:
      'Chen Zugui, eunuch director of ceremonial at Nanjing, said: "Each time Duke of Wei Xu Fu sacrifices at Xiaoling, he enters directly through the Red Pass Gate to perform the rite inside the hall—this presumption should be changed."',
    idiomatic:
      'Chen Zugui, Nanjing ceremonial eunuch director, said: "Each time Duke of Wei Xu Fu sacrifices at Xiaoling he enters directly through the Red Pass Gate to perform the rite inside the hall—this presumption should be changed."',
  },
  {
    zh: '俌言：「入由紅券門者，所以重祖宗之祭，尊皇上之命。',
    literal:
      'Fu said: "Entering by the Red Pass Gate is to honor sacrifice to the ancestors and respect the emperor\'s command.',
    idiomatic:
      'Fu said: "Entering by the Red Pass Gate honors ancestral sacrifice and respects the emperor\'s command.',
  },
  {
    zh: '出由小旁門者，所以守臣下之分。',
    literal: 'Exiting by the small side gate is to keep to a subject\'s proper station.',
    idiomatic: 'Exiting by the small side gate keeps to a subject\'s proper station.',
  },
  {
    zh: '循守故事，幾及百年，豈敢擅易。」',
    literal: 'Following established precedent for nearly a hundred years—how dare one change it on one\'s own authority."',
    idiomatic: 'Following established precedent for nearly a century—how dare one change it on one\'s own authority."',
  },
  {
    zh: '下禮部議，言：「長陵及太廟，遣官致祭，所由之門與孝陵事體相同，宜如舊。」',
    literal:
      'The matter was referred to the Ministry of Rites, which said: "At Chang Mausoleum and the Imperial Ancestral Temple, when officials are dispatched to sacrifice, the gates used are of the same character as at Xiaoling—the old practice should stand."',
    idiomatic:
      'The Ministry of Rites deliberated and said: "At Chang Mausoleum and the Imperial Ancestral Temple, dispatched sacrifice uses gates of the same character as Xiaoling—the old practice should stand."',
  },
  {
    zh: '從之。',
    literal: 'The proposal was adopted.',
    idiomatic: 'Approved.',
  },
]);

const patches = {
  'source-mingshi-060-wikisource-386da27725c5': {
    acceptedSourceText:
      '洪武元年三月，遣官致祭仁祖陵，二年，加號英陵。禮部尚書崔亮請下太常行祭告禮。博士孫吾與言：「山陵之制，莫備於漢，初未有祭告之禮。蓋廟號、陵號不同。廟號易大行之號，必上冊諡，告之神明，陵號則後嗣王所以識別先後而已，願罷英陵祭告。」亮言：「漢光武加先陵曰昌，宋太祖加高、曾、祖、考陵曰欽、康、定、安。蓋尊祖考由尊其陵，尊其制則必以告，禮緣人情，告之是。」廷議皆是亮。從之。熙祖陵，每歲正旦、清明、中元、冬至及每月朔望，本署官供祭行禮。又即其地望祭德祖、懿祖二陵。英陵後改稱皇陵，多孟冬一祭，俱署官行禮；朔望，中都留守司官行禮。',
    localRange: null,
    context: {
      beforeSource: '○謁祭陵廟',
      afterSource: '八年，詔翰林院議陵寢朔望節序祭祀禮。',
      beforeLocal: '○謁祭陵廟',
      afterLocal: '八年，詔翰林院議陵寢朔望節序祭祀禮。',
    },
    manualTranslations: HONGWU_TOMB_OMISSION,
  },
  'source-mingshi-060-wikisource-4c6716f309ff': {
    acceptedSourceText:
      '洪武二年，開平王常遇春卒于軍。訃至，禮官請如宋太宗爲趙普舉哀故事。遂定制，凡王公薨，訃報太常司，示百官，於西華門內壬地設御幄，陳御座，置素褥。設訃者位於前，設百官陪哭位東西向，奉慰位於訃者位北，北向。贊禮二人，位於訃者位之北，引訃者二人，位於贊禮之南，引百官四人，位於陪位之北，皆東西向。其日，備儀仗於奉天門迎駕。皇帝素服乘輿詣幄，樂陳於幄之南，不作。太常卿奉：「某官來訃，某年月日，臣某官以某疾薨，請舉哀。」皇帝哭，百官皆哭。太常卿奏止哭，百官奉慰訖，分班立。訃者四拜退，太常卿奏禮畢。乘輿還宮，百官出。東宮爲王公舉哀儀同，但設幄於東宮西門外，陪哭者皆東宮屬。',
    localRange: null,
    context: {
      beforeSource: '○乘輿爲王公大臣舉哀儀',
      afterSource: '○乘輿臨王公大臣喪儀',
      beforeLocal: '○乘輿爲王公大臣舉哀儀',
      afterLocal: '○乘輿臨王公大臣喪儀',
    },
    manualTranslations: PRINCE_MOURNING_OMISSION,
  },
  'source-mingshi-060-wikisource-d8ae57380a0e': {
    manualTranslations: TOMB_VISIT_OMISSION,
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
let patched = 0;

for (const [itemId, patch] of Object.entries(patches)) {
  const item = queue.items.find((row) => row.id === itemId);
  if (!item) throw new Error(`Queue item not found: ${itemId}`);
  if (patch.acceptedSourceText) item.acceptedSourceText = patch.acceptedSourceText;
  if (patch.localRange === null) item.localRange = null;
  if (patch.context) item.context = patch.context;
  item.manualTranslations = patch.manualTranslations;
  patched += 1;
  console.log(`Patched ${itemId} (${patch.manualTranslations.length} translations).`);
}

queue.updatedAt = new Date().toISOString();
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Patched manualTranslations for ${patched} mingshi/060 source item(s).`);
