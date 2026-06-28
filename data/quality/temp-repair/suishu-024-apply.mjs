#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-suishu.json';
const ITEM = 'source-suishu-024-wikisource-e3a1715b4259';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const manualTranslations = [
  {
    zh: '後周之初，尚用魏錢。',
    literal: 'At the beginning of Later Zhou, Wei coin was still used.',
    idiomatic: 'At the beginning of Later Zhou, Wei coin was still used.',
  },
  {
    zh: '及武帝保定元年七月，及更鑄布泉之錢，以一當五，與五銖並行。',
    literal: 'In the seventh month of Emperor Wu\'s Baoding year 1, Buquan coin was newly cast, one equaling five, circulating with Five Zhu.',
    idiomatic: 'In the seventh month of Emperor Wu\'s Baoding year 1, Buquan coin was newly cast, one equaling five, circulating with Five Zhu.',
  },
  {
    zh: '時梁、益之境，又雜用古錢交易。',
    literal: 'In Liang and Yi regions, ancient coin was also mixed for trade.',
    idiomatic: 'In Liang and Yi regions, ancient coin was also mixed for trade.',
  },
  {
    zh: '河西諸郡，或用西域金銀之錢，而官不禁。',
    literal: 'In Hexi commanderies, Western Regions gold and silver coin were sometimes used, but the government did not prohibit it.',
    idiomatic: 'In Hexi commanderies, Western Regions gold and silver coin were sometimes used, but the government did not prohibit it.',
  },
  {
    zh: '建德三年六月，更鑄五行大布錢，以一當十，大收商估之利，與布泉錢並行。',
    literal: 'In the sixth month of Jian\'e year 3, Wuxing Dabo coin was newly cast, one equaling ten, greatly collecting merchants\' profits, circulating with Buquan coin.',
    idiomatic: 'In the sixth month of Jian\'e year 3, Wuxing Dabo coin was newly cast, one equaling ten, greatly collecting merchants\' profits, circulating with Buquan coin.',
  },
  {
    zh: '四年七月，又以邊境之上，人多盜鑄，乃禁五行大布，不得出入四關，布泉之錢，聽入而不聽出。',
    literal: 'In the seventh month of year 4, because many along the border privately cast coin, Wuxing Dabo was prohibited—could not pass the four passes; Buquan coin was allowed in but not out.',
    idiomatic: 'In the seventh month of year 4, because many along the border privately cast coin, Wuxing Dabo was prohibited from passing the four passes; Buquan coin was allowed in but not out.',
  },
  {
    zh: '五年正月，以布泉漸賤而人不用，遂廢之。',
    literal: 'In the first month of year 5, because Buquan grew increasingly cheap and people would not use it, it was abolished.',
    idiomatic: 'In the first month of year 5, because Buquan grew increasingly cheap and people would not use it, it was abolished.',
  },
  {
    zh: '初令私鑄者絞，從者遠配為戶。',
    literal: 'At first those who privately cast were strangled; followers were exiled far away and registered as households.',
    idiomatic: 'At first those who privately cast were strangled; followers were exiled far away and registered as households.',
  },
  {
    zh: '齊平已後，山東之人，猶雜用齊氏舊錢。',
    literal: 'After the pacification of Qi, people in Shandong still mixed use of Qi dynasty old coin.',
    idiomatic: 'After the pacification of Qi, people in Shandong still mixed use of Qi dynasty old coin.',
  },
  {
    zh: '至宣帝大象元年十一月，又鑄永通萬國錢。',
    literal: 'By Emperor Xuan\'s Daxiang year 1, eleventh month, Yontong Wanguo coin was also cast.',
    idiomatic: 'By Emperor Xuan\'s Daxiang year 1, eleventh month, Yontong Wanguo coin was also cast.',
  },
  {
    zh: '以一當十，與五行大布及五銖，凡三品並用。',
    literal: 'One equaling ten, with Wuxing Dabo and Five Zhu—all three types circulated together.',
    idiomatic: 'One equaling ten, with Wuxing Dabo and Five Zhu—all three types circulated together.',
  },
].map((row) => ({ ...row, translator: T, model: M }));

const corpus = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const item = corpus.items.find((entry) => entry.id === ITEM);
if (!item) throw new Error(`Missing queue item ${ITEM}`);
item.manualTranslations = manualTranslations;
fs.writeFileSync(QUEUE, `${JSON.stringify(corpus, null, 2)}\n`);

execSync(
  `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${ITEM} --item ${ITEM} --reviewer sdk-repair-chapter`,
  { stdio: 'inherit' },
);
