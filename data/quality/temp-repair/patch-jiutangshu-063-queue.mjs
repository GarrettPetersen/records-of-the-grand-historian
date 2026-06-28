#!/usr/bin/env node
import fs from 'node:fs';

const queuePath = 'data/quality/source-correspondence-corpus-wikisource-jiutangshu.json';
const translationsPath = 'data/quality/temp-repair/jiutangshu-063-manual-translations.json';

const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const translationsByItem = JSON.parse(fs.readFileSync(translationsPath, 'utf8'));

const jiaoItemId = 'source-jiutangshu-063-wikisource-2ba685e72792';
const jiaoAcceptedSource = '柔遠子皎，長安中，累遷尚衣奉御。時玄宗在籓，見而悅之。皎察玄宗有非常之度，尤委心焉。尋出為潤州長史。玄宗即位，召拜殿中少監。數召入臥內，命之舍敬，曲侍宴私，與后妃連榻，間以擊球鬥雞，常呼之為姜七而不名也。兼賜以宮女、名馬及諸珍物不可勝數。玄宗又嘗與皎在殿庭玩一嘉樹，皎稱其美，玄宗遽令徙植於其家，其寵遇如此。及竇懷貞等潛謀逆亂，玄宗將討之，皎協贊謀議，以功拜殿中監，封楚國公，實封四百戶。玄宗以皎在籓之舊，皎又有先見之明，欲宣佈其事，乃下敕曰：';

for (const [itemId, manualTranslations] of Object.entries(translationsByItem)) {
  const item = queue.items.find((entry) => entry.id === itemId);
  if (!item) throw new Error(`Missing queue item ${itemId}`);
  item.manualTranslations = manualTranslations;
  if (itemId === jiaoItemId) {
    item.acceptedSourceText = jiaoAcceptedSource;
  }
}

fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
console.log('Patched manualTranslations for jiutangshu/063 queue items.');
