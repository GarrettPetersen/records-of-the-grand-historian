#!/usr/bin/env node
/**
 * Restore omitted Yuzong/Xianzong/Shunzong passages in yuanshi/115 and fix quote spans.
 */

import fs from 'node:fs';

const CHAPTER_PATH = 'data/yuanshi/115.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

function sentence(zh, literal, idiomatic) {
  return {
    id: '',
    zh,
    translations: [{
      lang: 'en',
      literal,
      idiomatic,
      translator: META.translator,
      model: META.model,
    }],
  };
}

const YUZONG_ENDING = [
  sentence(
    '至元以來，天下臻於太平，人材輩出，太子優禮遇之，在師友之列者，非朝廷名德，則布衣節行之士，德意未嘗少衰。',
    'Since the Zhiyuan period the realm had reached great peace and talented men emerged in succession; the Crown Prince treated them with exceptional courtesy. Those in the ranks of teacher and friend were either eminent worthies of the court or men of integrity among the commoners — his gracious intent never slackened.',
    'Since the Zhiyuan period the realm had reached great peace and talented men emerged in succession. The crown prince treated them with exceptional courtesy. Those counted among his teachers and friends were either eminent court worthies or men of integrity from among the commoners, and his gracious intent never slackened.',
  ),
  sentence(
    '宋瑽目疾，賜鈔千五百緡。',
    'Song Cong suffered eye disease; he was granted one thousand five hundred strings of paper money.',
    'Song Cong suffered eye disease and was granted one thousand five hundred strings of paper money.',
  ),
  sentence(
    '王磐告老而歸，官其壻于東平，以終養。',
    'Wang Pan reported his age and returned home; his son-in-law was given office in Dongping so he might complete his filial nurture.',
    'Wang Pan reported his age and returned home. His son-in-law was given office in Dongping so he might complete his filial nurture.',
  ),
  sentence(
    '孔洙自江南入覲，則責張九思學聖人之道，不知有聖人之後。',
    'When Kong Zhu came from Jiangnan to pay homage, he reproached Zhang Jiusi for studying the Way of the sages yet not knowing there was a descendant of the sage.',
    'When Kong Zhu came from Jiangnan to pay homage, he reproached Zhang Jiusi for studying the Way of the sages yet not knowing that there was a descendant of the sage.',
  ),
  sentence(
    '其大雅不羣，本於天性。',
    'His great refinement and standing apart from the crowd were rooted in his inborn nature.',
    'His great refinement and standing apart from the crowd were rooted in his inborn nature.',
  ),
  sentence(
    '中外歸心焉。',
    'Within and without, hearts turned to him.',
    'Within and without, hearts turned to him.',
  ),
  sentence(
    '於是世祖春秋高，江南行臺監察御史言事者請禪位於太子，太子聞之，懼。',
    'Then Shizu\'s years were advanced; a remonstrating Jiangnan Branch Censorate investigating censor requested abdication in favor of the Crown Prince; when the Crown Prince heard of it he was afraid.',
    'Then Shizu\'s years were advanced. A remonstrating Jiangnan Branch Censorate investigating censor requested that he abdicate in favor of the crown prince. When the crown prince heard of it, he was afraid.',
  ),
  sentence(
    '臺臣寢其奏，不敢遽聞，而小人以臺臣隱匿，乘間發之。',
    'The censorial officials suppressed the memorial and dared not report it at once, but petty men, because the censors had concealed it, seized the interval and made it known.',
    'The censorial officials suppressed the memorial and dared not report it at once, but petty men, because the censors had concealed it, seized the opportunity and made it known.',
  ),
  sentence(
    '世祖怒甚，太子愈益懼，未幾，遂薨，壽四十有三。',
    'Shizu was greatly angry; the Crown Prince grew ever more afraid; before long he died, aged forty-three.',
    'Shizu was greatly angry and the crown prince grew ever more afraid. Before long he died, aged forty-three.',
  ),
  sentence(
    '成宗即位，追謚曰文惠明孝皇帝，廟號裕宗，祔于太廟。',
    'When Chengzong took the throne he posthumously styled him the Emperor Wenhui Mingxiao with temple name Yuzong, enshrined in the Imperial Ancestral Temple.',
    'When Chengzong took the throne he posthumously styled him the Emperor Wenhui Mingxiao with the temple name Yuzong, enshrined in the Imperial Ancestral Temple.',
  ),
];

const XIANZONG_ENDING = [
  sentence(
    '六年正月乙巳，王薨，年四十。',
    'In the sixth year, first month, on yisi day, the prince died, aged forty.',
    'In the sixth year, on yisi day of the first month, the prince died, aged forty.',
  ),
  sentence(
    '王天性仁厚，御下有恩。',
    'The prince was benevolent and generous by nature and treated those below him with grace.',
    'The prince was benevolent and generous by nature and treated those below him with grace.',
  ),
  sentence(
    '元貞初，藩邸屬官審伯年老，請以其子代之。',
    'Early in Yuanzhen, Shen Bo, an official attached to the princely residence, being advanced in years, requested that his son replace him.',
    'Early in Yuanzhen, Shen Bo, an official attached to the princely residence, being advanced in years, requested that his son replace him.',
  ),
  sentence(
    '內史言於王，王曰：「惟天子所命。」',
    'The Inner Scribe spoke to the prince; the prince said, "Only what the Son of Heaven commands."',
    'The Inner Scribe spoke to the prince. The prince said, "Only what the Son of Heaven commands."',
  ),
  sentence(
    '其自守如此，故尤為朝廷所重。',
    'In self-restraint he was like this, and therefore was especially valued by the court.',
    'In self-restraint he was like this, and therefore was especially valued by the court.',
  ),
  sentence(
    '然崇尚浮屠，命僧作佛事，歲耗財不可勝計。',
    'Yet he esteemed Buddhism, ordering monks to perform Buddhist rites, and each year wealth consumed was beyond reckoning.',
    'Yet he esteemed Buddhism, ordering monks to perform Buddhist rites, and each year the wealth consumed was beyond reckoning.',
  ),
  sentence(
    '子三人：曰也孫帖木兒，曰松山，曰迭里哥兒不花。',
    'He had three sons: Yisuntiemuer, Songshan, and Diergierbuhua.',
    'He had three sons: Yisuntiemuer, Songshan, and Diergierbuhua.',
  ),
  sentence(
    '王薨後十年，仁宗即位，謚王獻武。',
    'Ten years after the prince\'s death Renzong took the throne and posthumously styled the prince Xianwu.',
    'Ten years after the prince\'s death Renzong took the throne and posthumously styled the prince Xianwu.',
  ),
  sentence(
    '又十一年，英宗遇弒，也孫帖木兒以嗣晉王即皇帝位，追尊曰光聖仁孝皇帝，廟號顯宗，祔享太室。',
    'Eleven years later, when Yingzong met assassination, Yisuntiemuer succeeded as Jin Prince and took the imperial throne, posthumously honoring him as the Emperor Guang Sheng Renxiao with temple name Xianzong, enshrined in the Grand Chamber.',
    'Eleven years later, when Yingzong was assassinated, Yisuntiemuer succeeded as Jin Prince and took the imperial throne, posthumously honoring him as the Emperor Guang Sheng Renxiao with the temple name Xianzong, enshrined in the Grand Chamber.',
  ),
  sentence(
    '又六年，文宗即位，乃毀其廟室。',
    'Six years later, when Wenzong took the throne, his temple chamber was destroyed.',
    'Six years later, when Wenzong took the throne, his temple chamber was destroyed.',
  ),
];

const SHUNZONG_BODY = [
  sentence(
    '順宗昭聖衍孝皇帝，諱答剌麻八剌，裕宗第二子也。',
    'Shunzong, the Emperor Zhaosheng Yanxiao — taboo name Dadarmabala — was Yuzong\'s second son.',
    'Shunzong, styled the Emperor Zhaosheng Yanxiao, bore the personal name Dadarmabala and was Yuzong\'s second son.',
  ),
  sentence(
    '母曰徽仁裕聖皇后，弘吉剌氏。',
    'His mother was Empress Hui Ren Yu Sheng of the Onggirat clan.',
    'His mother was Empress Hui Ren Yu Sheng of the Onggirat.',
  ),
  sentence(
    '至元初，裕宗為燕王，答剌麻八剌生于燕邸。',
    'At the beginning of Zhiyuan, when Yuzong was Prince of Yan, Dadarmabala was born in the Yan residence.',
    'At the beginning of the Zhiyuan period, when Yuzong was Prince of Yan, Dadarmabala was born in the Yan residence.',
  ),
  sentence(
    '明年，詔裕宗居潮河。',
    'The next year an edict ordered Yuzong to reside at Chaohe.',
    'The following year an edict ordered Yuzong to reside at Chaohe.',
  ),
  sentence(
    '八月，召至京師。',
    'In the eighth month he was summoned to the capital.',
    'In the eighth month he was summoned to the capital.',
  ),
  sentence(
    '凡乘輿巡幸及歲時朝賀，未嘗不侍裕宗以行。',
    'Whenever the imperial carriage toured or seasonal court congratulations were held, he never failed to attend Yuzong in going forth.',
    'Whenever the imperial carriage toured or seasonal court congratulations were held, he always attended Yuzong.',
  ),
  sentence(
    '稍長，世祖賜女侍郭氏，其後乃納弘吉剌氏為妃。',
    'When he grew somewhat older Shizu granted him the maid Guo; afterward he took a consort of the Onggirat clan.',
    'When he grew somewhat older Shizu granted him the maid Guo. Afterward he took a consort of the Onggirat clan.',
  ),
  sentence(
    '二十二年，裕宗薨，答剌麻八剌以皇孫鍾愛，兩宮優其出閤之禮。',
    'In the twenty-second year Yuzong died; Dadarmabala, as a cherished imperial grandson, received from both palaces an enhanced ceremony for leaving the inner quarters.',
    'In the twenty-second year Yuzong died. Dadarmabala, as a cherished imperial grandson, received from both palaces an enhanced ceremony for leaving the inner quarters.',
  ),
  sentence(
    '二十八年，始詔出鎮懷州，以侍衞都指揮使梭都、尚書王倚從行。',
    'In the twenty-eighth year he was first ordered out to guard Huaizhou, with Palace Guard Commander Suodu and Minister Wang Yi attending him.',
    'In the twenty-eighth year he was first ordered out to guard Huaizhou, with Palace Guard Commander Suodu and Minister Wang Yi in attendance.',
  ),
  sentence(
    '至趙州，從卒有伐民桑棗者，民遮訴于道，答剌麻八剌怒，杖從卒以懲眾，遣王倚入奏，世祖大悅。',
    'Reaching Zhaozhou, followers were cutting the people\'s mulberry and jujube trees; the people blocked the road to complain; Dadarmabala was angry, beat the followers to warn the host, and sent Wang Yi in to memorialize; Shizu was greatly pleased.',
    'Reaching Zhaozhou, some followers were cutting the people\'s mulberry and jujube trees. The people blocked the road to complain. Dadarmabala was angry, beat the followers to warn the host, and sent Wang Yi in to memorialize. Shizu was greatly pleased.',
  ),
  sentence(
    '未至，以疾召還。',
    'Before he arrived he was recalled on account of illness.',
    'Before he arrived he was recalled on account of illness.',
  ),
  sentence(
    '明年春，世祖北幸，留治疾京師，越兩月而薨，年二十有九。',
    'The next spring Shizu went north on tour; he remained in the capital to treat his illness and died after two months, aged twenty-nine.',
    'The following spring Shizu went north on tour. Dadarmabala remained in the capital to treat his illness and died after two months, aged twenty-nine.',
  ),
];

function findParagraphIndex(chapter, sentenceId) {
  for (let i = 0; i < chapter.content.length; i += 1) {
    const block = chapter.content[i];
    if (!block.sentences) continue;
    if (block.sentences.some((s) => s.id === sentenceId)) return i;
  }
  throw new Error(`Sentence ${sentenceId} not found`);
}

function findSentenceIndex(block, sentenceId) {
  const index = block.sentences.findIndex((s) => s.id === sentenceId);
  if (index < 0) throw new Error(`Sentence ${sentenceId} not in block`);
  return index;
}

function insertAfterSentence(chapter, afterId, newSentences, { newParagraph = false } = {}) {
  const paragraphIndex = findParagraphIndex(chapter, afterId);
  const block = chapter.content[paragraphIndex];
  const sentenceIndex = findSentenceIndex(block, afterId);

  if (newParagraph) {
    chapter.content.splice(paragraphIndex + 1, 0, {
      type: 'paragraph',
      sentences: newSentences,
    });
    return;
  }

  block.sentences.splice(sentenceIndex + 1, 0, ...newSentences);
}

function assignIds(chapter) {
  let max = 0;
  for (const block of chapter.content) {
    for (const sentence of block.sentences || []) {
      const match = String(sentence.id || '').match(/^s(\d+)$/);
      if (match) max = Math.max(max, Number(match[1]));
    }
  }

  for (const block of chapter.content) {
    for (const sentence of block.sentences || []) {
      if (sentence.id) continue;
      max += 1;
      sentence.id = `s${String(max).padStart(4, '0')}`;
    }
  }
}

function fixQuotes(chapter) {
  const byId = new Map();
  for (const block of chapter.content) {
    for (const sentence of block.sentences || []) {
      byId.set(sentence.id, sentence);
    }
  }

  const s0144 = byId.get('s0144');
  for (const row of s0144.translations) {
    if (!row.literal.endsWith('"')) row.literal += '"';
    if (!row.idiomatic.endsWith('"')) row.idiomatic += '"';
  }

  const s0162 = byId.get('s0162');
  for (const row of s0162.translations) {
    if (!row.literal.endsWith('"')) row.literal += '"';
    if (!row.idiomatic.endsWith('"')) row.idiomatic += '"';
  }

  const s0168 = byId.get('s0168');
  for (const row of s0168.translations) {
    if (!row.literal.endsWith('"')) row.literal += '"';
    if (!row.idiomatic.endsWith('"')) row.idiomatic += '"';
  }
}

function updateMeta(chapter) {
  let sentenceCount = 0;
  let translatedCount = 0;
  for (const block of chapter.content) {
    for (const sentence of block.sentences || []) {
      const zh = String(sentence.zh || '').trim();
      if (!zh) continue;
      sentenceCount += 1;
      const en = sentence.translations?.find((t) => t.lang === 'en');
      if (en?.literal?.trim() && en?.idiomatic?.trim()) translatedCount += 1;
    }
  }
  chapter.meta.sentenceCount = sentenceCount;
  chapter.meta.translatedCount = translatedCount;
}

const chapter = JSON.parse(fs.readFileSync(CHAPTER_PATH, 'utf8'));

insertAfterSentence(chapter, 's0179', YUZONG_ENDING);
insertAfterSentence(chapter, 's0213', XIANZONG_ENDING);
insertAfterSentence(chapter, 's0215', SHUNZONG_BODY);

assignIds(chapter);
fixQuotes(chapter);
updateMeta(chapter);

fs.writeFileSync(CHAPTER_PATH, `${JSON.stringify(chapter, null, 2)}\n`);
console.log(`Updated ${CHAPTER_PATH}: ${chapter.meta.sentenceCount} sentences.`);
