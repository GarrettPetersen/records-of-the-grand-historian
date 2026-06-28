#!/usr/bin/env node
import fs from 'node:fs';

const path = 'data/songshu/070.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

function find(id) {
  for (const block of data.content) {
    const s = block.sentences?.find((x) => x && x.id === id);
    if (s) return structuredClone(s);
  }
  return null;
}

const s0089 = {
  id: 's0089',
  zh: '遷太子左衛率。',
  translations: [{
    lang: 'en',
    literal: 'He was transferred to General of the Left Guard of the Heir Apparent.',
    idiomatic: 'He was made general of the left guard of the heir apparent.',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0090 = {
  id: 's0090',
  zh: '元兇將為弑逆，其夜淑在直，二更許，呼淑及蕭斌等流涕謂曰：「主上信讒，將見罪廢。',
  translations: [{
    lang: 'en',
    literal: 'When the Traitor Prince was about to commit regicide, that night Shu was on duty; about the second watch Shao called Shu and Xiao Bin and others, weeping as he told them: "The emperor trusts slander; I am about to be charged and deposed.',
    idiomatic: 'When the Traitor Prince was about to commit regicide, Shu was on duty that night; about the second watch Shao called Shu and Xiao Bin, weeping: "The emperor trusts slander; I am about to be charged and deposed.',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0091 = find('s0091') || {
  id: 's0091',
  zh: '內省無過，不能受枉。',
  translations: [{
    lang: 'en',
    literal: 'Looking within, I have no fault and cannot accept injustice.',
    idiomatic: 'Looking within I have no fault and cannot accept injustice.',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0092 = {
  id: 's0092',
  zh: '明旦便當行大事，望相與戮力。」',
  translations: [{
    lang: 'en',
    literal: 'Tomorrow I must carry out a great affair; I hope you will strive together with me."',
    idiomatic: 'Tomorrow I must act; I hope you will strive with me."',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0093 = find('s0093') || {
  id: 's0093',
  zh: '淑及斌並曰：「自古無此，願加善思。」',
  translations: [{
    lang: 'en',
    literal: 'Shu and Bin both said: "Since antiquity there has never been this; please think more carefully."',
    idiomatic: 'Shu and Bin both said, "Since antiquity there has never been this; please think again."',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0094 = find('s0094') || {
  id: 's0094',
  zh: '劭怒變色，左右皆動。',
  translations: [{
    lang: 'en',
    literal: "Shao's face changed in anger and those around him all stirred.",
    idiomatic: "Shao's face changed in anger; those around stirred.",
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0095 = find('s0095') || {
  id: 's0095',
  zh: '斌懼，乃曰：「臣昔忝伏事，常思效節，況憂迫如此，輒當竭身奉令。」',
  translations: [{
    lang: 'en',
    literal: 'Bin in fear then said: "Your servant once served at your side and always thought to repay with loyalty; now that distress presses so, I will exhaust myself to obey."',
    idiomatic: 'Bin in fear said, "I once served you and thought to repay with loyalty; pressed so, I will obey."',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0096 = find('s0096') || {
  id: 's0096',
  zh: '淑叱之曰：「卿便謂殿下真有是邪？',
  translations: [{
    lang: 'en',
    literal: 'Shu rebuked him: "Do you really think His Highness truly intends this?',
    idiomatic: 'Shu rebuked him, "Do you think His Highness truly intends this?',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0097 = find('s0097') || {
  id: 's0097',
  zh: '殿下幼時嘗患風，或是疾動耳。」',
  translations: [{
    lang: 'en',
    literal: 'His Highness in youth once suffered wind ailment; perhaps this is only the illness stirring."',
    idiomatic: 'His Highness in youth suffered wind ailment; perhaps the illness stirs again."',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0098 = {
  id: 's0098',
  zh: '劭愈怒，因問曰：「事當克不？」',
  translations: [{
    lang: 'en',
    literal: 'Shao grew still angrier and therefore asked: "Will the affair succeed or not?"',
    idiomatic: 'Shao grew angrier and asked, "Will it succeed or not?"',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0099 = find('s0099') || {
  id: 's0099',
  zh: '淑曰：「居不疑之地，何患不克。',
  translations: [{
    lang: 'en',
    literal: 'Shu said: "In a position without doubt, why fear failure?',
    idiomatic: 'Shu said, "In a position without doubt, why fear failure?',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0100 = find('s0100') || {
  id: 's0100',
  zh: '但既克之後，為天地之所不容，大禍亦旋至耳。',
  translations: [{
    lang: 'en',
    literal: 'But once you succeed, heaven and earth will not contain you; great disaster will swiftly arrive as well.',
    idiomatic: 'But once you succeed, heaven and earth will not contain you; great disaster will swiftly come.',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const s0101 = find('s0101') || {
  id: 's0101',
  zh: '願急息之。」',
  translations: [{
    lang: 'en',
    literal: 'I beg you to stop it quickly."',
    idiomatic: 'I beg you to stop at once."',
    translator: 'Garrett M. Petersen (2026)',
    model: 'Composer 2.5',
  }],
};

const para11Idx = data.content.findIndex((b) => b.sentences?.some((s) => s && s.id === 's0102'));
const tail = data.content[para11Idx].sentences.filter((s) => s && s.id >= 's0102');
data.content[para11Idx].sentences = [
  s0089, s0090, s0091, s0092, s0093, s0094, s0095, s0096, s0097, s0098, s0099, s0100, s0101,
  ...tail,
];

const all = data.content.flatMap((b) => b.sentences.filter(Boolean));
data.meta.sentenceCount = all.length;
data.meta.translatedCount = all.length;
data.meta.translators[0].sentences = all.length;
data.meta.translators[0].paragraphs = data.content.length;

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log('fixed', all.length, 'sentences');
console.log('para11 ids', data.content[para11Idx].sentences.map((s) => s.id).join(', '));
