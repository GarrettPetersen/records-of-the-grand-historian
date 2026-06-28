#!/usr/bin/env node
import fs from 'node:fs';

const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-xinwudaishi.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

function withMeta(rows) {
  return rows.map((row) => ({ ...row, ...META }));
}

const patches = {
  'source-xinwudaishi-030-wikisource-3f667d2b2209': {
    manualTranslations: withMeta([
      {
        zh: '弘肇已死，帝坐崇元殿召羣臣，告以弘肇等謀反，羣臣莫能對。',
        literal: 'Hongzhao was already dead. The emperor took his seat in Chongyuan Hall, summoned the ministers, and told them that Hongzhao and the others had plotted rebellion. None of the ministers could answer.',
        idiomatic: 'Hongzhao was dead. The emperor sat in Chongyuan Hall, summoned the ministers, and charged that Hongzhao and his circle had rebelled. No minister could reply.',
      },
      {
        zh: '又召諸軍校見於萬歲殿，帝曰：「弘肇等專權，使汝曹常憂橫死，今日吾得為汝主矣！」',
        literal: 'He next summoned the army officers to appear before him in Wansui Hall. The emperor said: “Hongzhao and the others monopolized power and kept you in constant fear of sudden death. Today I am able to be your lord!”',
        idiomatic: 'He then summoned the army officers to Wansui Hall and said: “Hongzhao and his circle held all power and kept you fearing sudden death. Today I can be your master!”',
      },
      {
        zh: '軍校皆拜。',
        literal: 'The army officers all bowed.',
        idiomatic: 'The officers all bowed.',
      },
      {
        zh: '周太祖即位，追封弘肇鄭王，以禮歸葬。',
        literal: 'When Zhou Taizu took the throne, he posthumously enfeoffed Hongzhao as Prince of Zheng and had him buried with full rites.',
        idiomatic: 'When Zhou Taizu took the throne, he posthumously made Hongzhao Prince of Zheng and buried him with full honors.',
      },
    ]),
  },
  'source-xinwudaishi-030-wikisource-517ec28c36bb': {
    clearLocalRange: true,
    beforeLocal: '聶文進',
    manualTranslations: withMeta([
      {
        zh: '聶文進，并州人也。',
        literal: 'Nie Wenjin was a native of Bingzhou.',
        idiomatic: 'Nie Wenjin came from Bingzhou.',
      },
      {
        zh: '少為軍卒，善書算，給事漢高祖帳中。',
        literal: 'In youth he was a soldier, skilled at writing and reckoning, and served in the Han High Ancestor’s tent.',
        idiomatic: 'As a youth he was a soldier, skilled at writing and reckoning, and served in the Han High Ancestor’s tent.',
      },
      {
        zh: '高祖鎮太原，以為押司官。',
        literal: 'When the High Ancestor governed Taiyuan, he was made auditing clerk.',
        idiomatic: 'When the High Ancestor held Taiyuan, he made Wenjin auditing clerk.',
      },
      {
        zh: '高祖即位，歷拜領軍屯衞將軍、樞密院承旨。',
        literal: 'When the High Ancestor took the throne, Wenjin was promoted in succession to General of the Garrison Guard and registrar of the Privy Council.',
        idiomatic: 'At the High Ancestor’s accession he rose to General of the Garrison Guard and Privy Council registrar.',
      },
      {
        zh: '周太祖為樞密使，頗親信之，文進稍橫恣。',
        literal: 'When Zhou Taizu was chief of the Privy Council, he trusted Wenjin greatly, and Wenjin gradually grew arrogant and unrestrained.',
        idiomatic: 'Zhou Taizu, as chief of the Privy Council, trusted him deeply, and Wenjin grew arrogant.',
      },
      {
        zh: '遷右領軍大將軍，入謝，召諸將軍設食朝堂，儀鸞、翰林、御廚供帳飲食，文進自如，有司不敢劾。',
        literal: 'Promoted to Grand General of the Right Garrison Guard, he entered to give thanks. The emperor summoned the generals and set out food in the court hall; the Ceremonial Escort, Hanlin, and Imperial Kitchen supplied tents, food, and drink. Wenjin acted as he pleased, and the officials dared not impeach him.',
        idiomatic: 'Made Grand General of the Right Garrison Guard, he came to give thanks. The emperor summoned the generals and set a feast in the court hall; Ceremonial Escort, Hanlin, and Imperial Kitchen supplied the spread. Wenjin acted as he pleased, and no official dared object.',
      },
      {
        zh: '周太祖鎮鄴，文進等用事居中，及謀殺楊邠等，文進夜作詔書，制置中外。',
        literal: 'When Zhou Taizu governed Ye, Wenjin and the others held power at court. When they plotted to kill Yang Bin and the rest, Wenjin drafted edicts by night and disposed affairs within and without.',
        idiomatic: 'When Zhou Taizu held Ye, Wenjin and his circle ruled the court. When they plotted to kill Yang Bin and the rest, Wenjin drafted edicts by night and disposed affairs at home and abroad.',
      },
      {
        zh: '邠等已死，文進點閱兵籍，指麾殺戮，以為己任。',
        literal: 'After Bin and the rest were dead, Wenjin reviewed the military registers, directed killings, and took this as his own charge.',
        idiomatic: 'Once Bin and the rest were dead, Wenjin reviewed the rolls, directed the slaughter, and made it his personal task.',
      },
      {
        zh: '周太祖在鄴聞邠等遇害，初以為文進不與，及發詔書，皆文進手跡，乃大詬之。',
        literal: 'Zhou Taizu at Ye heard that Bin and the rest had been killed. At first he thought Wenjin had not taken part, but when the edicts were issued, all were in Wenjin’s hand—and he cursed him bitterly.',
        idiomatic: 'At Ye, Zhou Taizu heard Bin and the rest had been killed. At first he thought Wenjin was innocent, but when the edicts appeared, every line was Wenjin’s hand—and he cursed him bitterly.',
      },
    ]),
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
let patched = 0;

for (const [itemId, patch] of Object.entries(patches)) {
  const item = queue.items.find((entry) => entry.id === itemId);
  if (!item) {
    console.error(`Queue item not found: ${itemId}`);
    process.exit(1);
  }
  item.manualTranslations = patch.manualTranslations;
  if (patch.clearLocalRange) {
    delete item.localRange;
    item.context = item.context || {};
    item.context.beforeLocal = patch.beforeLocal;
  }
  patched += 1;
  console.log(`Patched manualTranslations for ${itemId} (${patch.manualTranslations.length} rows).`);
}

fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Patched manualTranslations for ${patched} xinwudaishi/030 source item(s).`);
