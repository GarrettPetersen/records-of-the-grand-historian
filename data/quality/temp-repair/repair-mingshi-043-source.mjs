#!/usr/bin/env node
/**
 * Repair mingshi/043 source-correspondence omissions.
 */

import fs from 'node:fs';

const CHAPTER_PATH = 'data/mingshi/043.json';
const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-mingshi.json';
const META = { translator: 'Garrett M. Petersen (2026)', model: 'Composer 2.5' };

function tr(literal, idiomatic) {
  return { lang: 'en', literal, idiomatic, ...META };
}

function sentence(zh, literal, idiomatic) {
  return { zh, translations: [tr(literal, idiomatic)] };
}

function paragraph(...sentences) {
  return { type: 'paragraph', sentences };
}

function findBlockIndex(chapter, sentenceId) {
  for (let i = 0; i < chapter.content.length; i += 1) {
    const block = chapter.content[i];
    if ((block.sentences || []).some((s) => s.id === sentenceId)) return i;
  }
  throw new Error(`Block not found for ${sentenceId}`);
}

function insertBefore(chapter, sentenceId, ...blocks) {
  const index = findBlockIndex(chapter, sentenceId);
  chapter.content.splice(index, 0, ...blocks);
}

function insertAfter(chapter, sentenceId, ...blocks) {
  const index = findBlockIndex(chapter, sentenceId);
  chapter.content.splice(index + 1, 0, ...blocks);
}

function updateSentence(chapter, sentenceId, zh, literal, idiomatic) {
  for (const block of chapter.content) {
    for (const s of block.sentences || []) {
      if (s.id !== sentenceId) continue;
      s.zh = zh;
      s.translations = [tr(literal, idiomatic)];
      return;
    }
  }
  throw new Error(`Sentence not found: ${sentenceId}`);
}

function renumberChapter(chapter) {
  let n = 0;
  for (const block of chapter.content) {
    for (const s of block.sentences || []) {
      n += 1;
      s.id = `s${String(n).padStart(4, '0')}`;
    }
    for (const cell of block.cells || []) {
      n += 1;
      cell.id = `s${String(n).padStart(4, '0')}`;
    }
  }
  chapter.meta.sentenceCount = n;
  chapter.meta.translatedCount = n;
  if (chapter.meta.translators?.[0]) chapter.meta.translators[0].sentences = n;
}

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));

// source-mingshi-043-wikisource-2d63f5bfa457 — restore Maozhou prefecture before Wenchuan county entry
insertBefore(
  chapter,
  's0197',
  paragraph(
    sentence(
      '茂州元治汶山縣，屬陝西行省吐番宣慰司。',
      'Maozhou in the Yuan administered Wenshan County, subordinate to the Shaanxi Branch Secretariat Tibetan Pacification Commission.',
      'In the Yuan, Maozhou administered Wenshan County and was subordinate to the Tibetan Pacification Commission of the Shaanxi Branch Secretariat.',
    ),
    sentence(
      '洪武中省縣入州。',
      'Hongwu within abolished county merged into prefecture.',
      'During the Hongwu reign the county was abolished and merged into the prefecture.',
    ),
    sentence(
      '十六年復置縣，後復省。',
      'Year sixteen restored county, later again abolished.',
      'In year 16 the county was restored, but later abolished again.',
    ),
    sentence(
      '南有岷山，即隴山之南首也。',
      'South has Min Mountain, that is the southern head of Long Mountain.',
      'To the south is Min Mountain, the southern extremity of Long Mountain.',
    ),
    sentence(
      '汶江自松潘衛流入，經山下，又東經州城西，東南流，迴環於四川、湖廣、江西三布政司及南直隸之地，入於海，幾七千餘里。',
      'Wen River from Songpan Guard flows in, passes below the mountain, also east passes west of prefecture city, flows southeast, winding through Sichuan, Huguang, and Jiangxi three provincial administration commissions and Nanzhili territory, enters the sea, nearly more than seven thousand li.',
      'The Wen River enters from Songpan Guard, passes below the mountain, then east of the prefectural city, and flows southeast; winding through the territories of the Sichuan, Huguang, and Jiangxi provincial administration commissions and Nanzhili, it reaches the sea after nearly more than seven thousand li.',
    ),
    sentence(
      '南有雞宗關、東有積水關、北有魏磨關三巡檢司。',
      'South has Jizong Pass, east has Jishui Pass, north has Weimo Pass three patrol inspectorates.',
      'To the south is Jizong Pass, to the east Jishui Pass, and to the north Weimo Pass—three patrol inspectorates.',
    ),
    sentence(
      '又南有七星關，又有雁門關。',
      'Also south has Seven Stars Pass, also has Yanmen Pass.',
      'Farther south are Seven Stars Pass and Yanmen Pass.',
    ),
    sentence(
      '東有桃坪關。',
      'East has Taoping Pass.',
      'To the east is Taoping Pass.',
    ),
    sentence(
      '北有實大關。',
      'North has Shida Pass.',
      'To the north is Shida Pass.',
    ),
    sentence(
      '西北有黃崖關，有汶山長官司，又南有靜川長官司，東南有隴木頭長官司，西南有嶽希蓬長官司，俱洪武七年五月置，屬重慶衛。',
      'Northwest has Huangya Pass; has Wenshan Native Official Chieftaincy; also south has Jingchuan Native Official Chieftaincy, southeast has Longmutou Native Official Chieftaincy, southwest has Yuexipeng Native Official Chieftaincy, all Hongwu year seven fifth month established, subordinate to Chongqing Guard.',
      'To the northwest is Huangya Pass. There are the Wenshan, Jingchuan, Longmutou, and Yuexipeng native official chieftaincies, all established in the fifth month of Hongwu 7 and subordinate to Chongqing Guard.',
    ),
    sentence(
      '又北有長寧堡，本長寧安撫司，宣德中，平歷日諸蠻置，屬松潘衛。',
      'Also north has Changning Fort, originally Changning Pacification Commission, Xuande within, pacified Liri and other Mang established, subordinate to Songpan Guard.',
      'Farther north is Changning Fort, originally the Changning Pacification Commission; during the Xuande reign it was established after pacifying Liri and other Mang peoples, subordinate to Songpan Guard.',
    ),
    sentence(
      '正統元年二月改屬壘溪所。',
      'Zhengtong first year second month changed subordinate to Leixi Garrison.',
      'In the second month of Zhengtong 1 it was transferred to Leixi Garrison.',
    ),
    sentence(
      '八年六月改屬茂州衛。',
      'Year eight sixth month changed subordinate to Maozhou Guard.',
      'In the sixth month of year 8 it was transferred to Maozhou Guard.',
    ),
    sentence(
      '後廢爲堡。',
      'Later abolished made a fort.',
      'Later it was abolished and reduced to a fort.',
    ),
    sentence(
      '東南距府五百五十里。',
      'Southeast distance from prefecture five hundred fifty li.',
      'It lies five hundred fifty li southeast of the prefecture.',
    ),
  ),
);

// source-mingshi-043-wikisource-3720bb99da2a — restore Wusa Military-Civilian Prefecture
insertAfter(
  chapter,
  's0810',
  paragraph(
    sentence(
      '烏撒軍民府元烏撒路，後至元元年九月屬四川行省。',
      'Wusa Military-Civilian Prefecture Yuan Wusa Route, later Zhiyuan first year ninth month belonged to Sichuan Branch Secretariat.',
      'Wusa Military-Civilian Prefecture was under the Yuan the Wusa Route; in the ninth month of Zhiyuan 1 it was placed under the Sichuan Branch Secretariat.',
    ),
    sentence(
      '洪武十五年正月爲府，屬雲南布政司。',
      'Hongwu fifteenth year first month made a prefecture, subordinate to Yunnan Provincial Administration Commission.',
      'In the first month of Hongwu 15 it became a prefecture subordinate to the Yunnan Provincial Administration Commission.',
    ),
    sentence(
      '十六年正月改屬四川布政司。',
      'Sixteenth year first month changed subordinate to Sichuan Provincial Administration Commission.',
      'In the first month of year 16 it was transferred to the Sichuan Provincial Administration Commission.',
    ),
    sentence(
      '十七年五月升爲軍民府。',
      'Seventeenth year fifth month promoted to Military-Civilian Prefecture.',
      'In the fifth month of year 17 it was promoted to a Military-Civilian Prefecture.',
    ),
    sentence(
      '西有盤江，出府西亂山中，經府南爲可渡河，入貴州畢節衛界。',
      'West has Pan River, emerges from chaotic mountains west of prefecture, passes south of prefecture as Keduo River, enters Guizhou Bijie Guard border.',
      'To the west is the Pan River, which rises in the rugged mountains west of the prefecture, passes south of the prefecture as the Keduo River, and enters the border of Bijie Guard in Guizhou.',
    ),
    sentence(
      '有可渡河巡檢司。',
      'Has Keduo River patrol inspectorate.',
      'There is a Keduo River patrol inspectorate.',
    ),
    sentence(
      '又西有趙班巡檢司。',
      'Also west has Zhaoban patrol inspectorate.',
      'Farther west is the Zhaoban patrol inspectorate.',
    ),
    sentence(
      '又有阿赫關、鄔撒二巡檢司。',
      'Also has Ahe Pass, Wusa two patrol inspectorates.',
      'There are also the Ahe Pass and Wusa patrol inspectorates.',
    ),
    sentence(
      '東南有七星關。',
      'Southeast has Seven Stars Pass.',
      'To the southeast is Seven Stars Pass.',
    ),
    sentence(
      '東有老鴉關，又有善欲關，皆與貴州畢節衛界。',
      'East has Laoya Pass, also has Shanyu Pass, all with Guizhou Bijie Guard border.',
      'To the east are Laoya Pass and Shanyu Pass, all on the border with Bijie Guard in Guizhou.',
    ),
    sentence(
      '又南有倘唐驛，路出雲南沾益州。',
      'Also south has Tangtang Post, road exits Yunnan Zhanyi Prefecture.',
      'Farther south is Tangtang Post, on the route leading to Zhanyi Prefecture in Yunnan.',
    ),
    sentence(
      '東北距布政司千八百五十里。',
      'Northeast distance from Provincial Administration Commission one thousand eight hundred fifty li.',
      'It lies one thousand eight hundred fifty li northeast of the Provincial Administration Commission.',
    ),
  ),
);

// source-mingshi-043-wikisource-8ff10b574f53 — restore Youyang Pacification Commission section
insertAfter(
  chapter,
  's1126',
  paragraph(
    sentence(
      '酉陽宣慰司元酉陽州，屬懷德府。',
      'Youyang Pacification Commission Yuan Youyang Prefecture, belonged to Huaide Prefecture.',
      'Youyang Pacification Commission was under the Yuan Youyang Prefecture, subordinate to Huaide Prefecture.',
    ),
    sentence(
      '明玉珍改沿邊溪洞軍民宣慰司。',
      'Ming Yuzhen changed to Along-Border Creek Cave Military-Civilian Pacification Commission.',
      'Ming Yuzhen made it the Along-Border Creek Cave Military-Civilian Pacification Commission.',
    ),
    sentence(
      '洪武五年四月仍置酉陽州，兼置酉陽宣慰司，州尋廢。',
      'Hongwu fifth year fourth month still established Youyang Prefecture, concurrently established Youyang Pacification Commission, prefecture soon abolished.',
      'In the fourth month of Hongwu 5 Youyang Prefecture was re-established and the Youyang Pacification Commission was set up concurrently; the prefecture was soon abolished.',
    ),
    sentence(
      '八年正月改宣慰司爲宣撫司，屬四川都司。',
      'Year eight first month changed Pacification Commission to Pacification Superintendency, belonged to Sichuan Regional Military Commission.',
      'In the first month of year 8 the pacification commission was changed to a pacification superintendency and placed under the Sichuan Regional Military Commission.',
    ),
    sentence(
      '永樂十六年改屬重慶衛。',
      'Yongle sixteenth year changed subordinate to Chongqing Guard.',
      'In Yongle 16 it was transferred to Chongqing Guard.',
    ),
    sentence(
      '天啓元年升爲宣慰司。',
      'Tianqi first year promoted to Pacification Commission.',
      'In Tianqi 1 it was promoted to a pacification commission.',
    ),
    sentence(
      '東南有酉水，流合平茶水，至湖廣辰州府合流於江，有寧俊江巡檢司。',
      'Southeast has You River, flows joining Pingshui Stream, to Huguang Chenzhou Prefecture joins flow into river, has Ningjun River patrol inspectorate.',
      'To the southeast is the You River, which joins the Pingshui Stream and, reaching Chenzhou Prefecture in Huguang, unites with the main river; there is a Ningjun River patrol inspectorate.',
    ),
    sentence(
      '西北距重慶府四百九十里。',
      'Northwest distance from Chongqing Prefecture four hundred ninety li.',
      'It lies four hundred ninety li northwest of Chongqing Prefecture.',
    ),
  ),
);

updateSentence(
  chapter,
  's1127',
  '領長官司三：石耶洞長官司司東南。',
  'Administers native official chieftaincies three: Shiye Cave Native Official Chieftaincy commission southeast.',
  'It administered three native official chieftaincies: Shiye Cave Native Official Chieftaincy lies southeast of the commission.',
);

// source-mingshi-043-wikisource-b692974edead — restore Shizhu Pacification Commission
insertAfter(
  chapter,
  's1135',
  paragraph(
    sentence(
      '石砫宣慰司元石砫軍民宣撫司。',
      'Shizhu Pacification Commission Yuan Shizhu Military-Civilian Pacification Commission.',
      'Shizhu Pacification Commission was under the Yuan the Shizhu Military-Civilian Pacification Commission.',
    ),
    sentence(
      '明玉珍改安撫司。',
      'Ming Yuzhen changed to Pacification Commission.',
      'Ming Yuzhen changed it to a pacification commission.',
    ),
    sentence(
      '洪武八年正月爲宣撫司，屬重慶衛。',
      'Hongwu eighth year first month made Pacification Commission, subordinate to Chongqing Guard.',
      'In the first month of Hongwu 8 it became a pacification commission subordinate to Chongqing Guard.',
    ),
    sentence(
      '嘉靖四十二年改屬夔州衛。',
      'Jiajing forty-second year changed subordinate to Kuizhou Guard.',
      'In Jiajing 42 it was transferred to Kuizhou Guard.',
    ),
    sentence(
      '天啓元年升爲宣慰司。',
      'Tianqi first year promoted to Pacification Commission.',
      'In Tianqi 1 it was promoted to a pacification commission.',
    ),
    sentence(
      '東有石砫山。',
      'East has Shizhu Mountain.',
      'To the east is Shizhu Mountain.',
    ),
    sentence(
      '又有三江溪，即葫蘆溪之上流也。',
      'Also has Sanjiang Stream, that is the upper reach of Hulu Stream.',
      'There is also the Sanjiang Stream, the upper course of the Hulu Stream.',
    ),
    sentence(
      '西南距夔州府七百五十里。',
      'Southwest distance from Kuizhou Prefecture seven hundred fifty li.',
      'It lies seven hundred fifty li southwest of Kuizhou Prefecture.',
    ),
  ),
);

// source-mingshi-043-wikisource-6b6866f35d96 — restore Qiongbu Native Official Chieftaincy
insertAfter(
  chapter,
  's1221',
  paragraph(
    sentence(
      '邛部長官司衛東。',
      'Qiongbu Native Official Chieftaincy guard east.',
      'Qiongbu Native Official Chieftaincy lies east of the guard.',
    ),
    sentence(
      '元邛部州，屬建昌路。',
      'Yuan Qiongbu Prefecture, belonged to Jianchang Route.',
      'Under the Yuan it was Qiongbu Prefecture, subordinate to Jianchang Route.',
    ),
    sentence(
      '洪武十五年三月屬建昌府，二十七年四月升軍民府，後仍爲州，屬越巂衛。',
      'Hongwu fifteenth year third month belonged to Jianchang Prefecture, twenty-seventh year fourth month promoted to Military-Civilian Prefecture, later still became prefecture, subordinate to Yuexi Guard.',
      'In the third month of Hongwu 15 it was placed under Jianchang Prefecture; in the fourth month of year 27 it was promoted to a military-civilian prefecture, later reverted to a prefecture, and was subordinate to Yuexi Guard.',
    ),
    sentence(
      '永樂元年五月改爲長官司。',
      'Yongle first year fifth month changed to native official chieftaincy.',
      'In the fifth month of Yongle 1 it was changed to a native official chieftaincy.',
    ),
    sentence(
      '東有平夷、歸化二堡，萬曆十五年開部夷地增置。',
      'East has Pingyi, Guihua two forts, Wanli fifteenth year opened tribal lands added established.',
      'To the east are the forts of Pingyi and Guihua, added in Wanli 15 when tribal lands were opened.',
    ),
  ),
);

renumberChapter(chapter);
fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
const now = new Date().toISOString();
const appliedIds = [
  'source-mingshi-043-wikisource-2d63f5bfa457',
  'source-mingshi-043-wikisource-3720bb99da2a',
  'source-mingshi-043-wikisource-6b6866f35d96',
  'source-mingshi-043-wikisource-8ff10b574f53',
  'source-mingshi-043-wikisource-b692974edead',
];
const notes = {
  'source-mingshi-043-wikisource-2d63f5bfa457':
    'Restored missing Maozhou prefecture entry (15 sentences) before Wenchuan county; local 汶川州西南 retained as subordinate county.',
  'source-mingshi-043-wikisource-3720bb99da2a':
    'Restored missing Wusa Military-Civilian Prefecture entry between Wumeng and Dongchuan sections.',
  'source-mingshi-043-wikisource-6b6866f35d96':
    'Restored missing Qiongbu Native Official Chieftaincy entry between Zhenxi Rear Thousand-Household Office and Yanjing Guard sections.',
  'source-mingshi-043-wikisource-8ff10b574f53':
    'Restored missing Youyang Pacification Commission section after Anning Pacification Commission; corrected s1127 to 領長官司三：石耶洞長官司司東南.',
  'source-mingshi-043-wikisource-b692974edead':
    'Restored missing Shizhu Pacification Commission entry after Matu Cave Native Official Chieftaincy.',
};
for (const item of queue.items) {
  if (!appliedIds.includes(item.id)) continue;
  item.status = 'applied';
  item.decision = 'applied';
  item.notes = notes[item.id];
  item.reviewedAt = now;
  item.reviewer = 'sdk-repair-chapter';
  item.appliedAt = now;
}
queue.updatedAt = now;
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

console.log(`Repaired ${CHAPTER_PATH}; marked ${appliedIds.length} queue item(s) applied.`);
