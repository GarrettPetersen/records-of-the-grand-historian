#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-songshu.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-songshu-055-wikisource-9782001dadd8': [
    {
      zh: '永初元年，詔曰：「祕書監徐廣，學優行謹，歷位恭肅，可中散大夫。',
      literal: 'In the first year of Yongchu, an edict said: "Director of the Secretariat Xu Guang is superior in learning and careful in conduct, and in successive offices has been reverent and dignified; he may be appointed Grand Master of Leisure.',
      idiomatic: 'In the first year of Yongchu, an edict said: "Director of the Secretariat Xu Guang is superior in learning and careful in conduct, and in successive offices has been reverent and dignified; he may be appointed Grand Master of Leisure.',
    },
    {
      zh: '」廣上表曰：「臣年時衰耄，朝敬永闕，端居都邑，徒增替怠。',
      literal: '" Guang submitted a memorial saying: "I am now aged and decrepit and can no longer attend court in reverence; dwelling idly in the capital only adds to my remorse and slackness.',
      idiomatic: '" Guang submitted a memorial saying: "I am now aged and decrepit and can no longer attend court in reverence; dwelling idly in the capital only adds to my remorse and slackness.',
    },
    {
      zh: '臣墳墓在晉陵，臣又生長京口，戀舊懷遠，每感暮心。',
      literal: 'My ancestral graves are at Jinling, and I also grew up at Jingkou; cherishing the old and longing for the distant, I am moved each evening in my heart.',
      idiomatic: 'My ancestral graves are at Jinling, and I also grew up at Jingkou; cherishing the old and longing for the distant, I am moved each evening in my heart.',
    },
    {
      zh: '息道玄謬荷朝恩，忝宰此邑，乞相隨之官，歸終桑梓，微志獲申，殞沒無恨。',
      literal: 'My son Daoxuan has undeservedly received the court\'s grace and shamefully serves as magistrate of this district; I beg to follow him to his post, return to end my days in my native place, fulfill my humble wish, and die without regret.',
      idiomatic: 'My son Daoxuan has undeservedly received the court\'s grace and shamefully serves as magistrate of this district; I beg to follow him to his post, return to end my days in my native place, fulfill my humble wish, and die without regret.',
    },
    {
      zh: '」許之，贈賜甚厚。',
      literal: '" The request was granted, and gifts were exceedingly generous.',
      idiomatic: '" The request was granted, and gifts were exceedingly generous.',
    },
    {
      zh: '性好讀書，老猶不倦。',
      literal: 'By nature he loved reading and even in old age was not weary of it.',
      idiomatic: 'By nature he loved reading and even in old age was not weary of it.',
    },
    {
      zh: '元嘉二年，卒，時年七十四。',
      literal: 'In the second year of Yuanjia he died, at the age of seventy-four.',
      idiomatic: 'In the second year of Yuanjia he died, at the age of seventy-four.',
    },
    {
      zh: '答禮問百餘條，用於今世。',
      literal: 'More than a hundred replies to ritual questions, useful in the present age.',
      idiomatic: 'More than a hundred replies to ritual questions, useful in the present age.',
    },
    {
      zh: '廣兄子豁，在良吏傳。',
      literal: 'Guang\'s elder brother\'s son Huo is treated in the Biographies of Worthy Officials.',
      idiomatic: 'Guang\'s elder brother\'s son Huo is treated in the Biographies of Worthy Officials.',
    },
  ],
  'source-songshu-055-wikisource-e1cb1fd65cbc': [
    {
      zh: '李太后薨，廣議服曰：「太皇太后名位允正，體同皇極，理制備盡，情禮彌申。',
      literal: 'When Empress Dowager Li died, Guang offered a ritual opinion on mourning dress, saying: "The grand empress dowager\'s title and station are fully orthodox, her status equals the imperial pole, reason and regulation are complete, and feeling and ritual are all the more extended.',
      idiomatic: 'When Empress Dowager Li died, Guang offered a ritual opinion on mourning dress, saying: "The grand empress dowager\'s title and rank are fully legitimate, her status equals the imperial apex, the ritual logic is complete, and the emotional obligation is all the greater.',
    },
    {
      zh: '陽秋之義，母以子貴，既稱夫人，禮服從正，故成風顯夫人之號，文公服三年之喪。',
      literal: 'The meaning of the Spring and Autumn Annals is that the mother is ennobled through the son; once she is styled lady, ritual garments follow the orthodox rule. Thus Duke Cheng displayed the title of lady, and Duke Wen wore three years of mourning.',
      idiomatic: 'The Spring and Autumn principle is that a mother is honored through her son; once she bears the title of consort, ritual mourning follows the standard form. Thus Duke Cheng gave his mother the title of lady, and Duke Wen wore three years of mourning.',
    },
    {
      zh: '子於父之所生，體尊義重。',
      literal: 'A child toward what the father bore is honored in status and heavy in obligation.',
      idiomatic: 'A child owes deep obligation to the mother his father honored.',
    },
    {
      zh: '且禮祖不厭孫，固宜遂服無屈。',
      literal: 'Moreover, in ritual the ancestor does not weary of the grandson; mourning should therefore be worn without reduction.',
      idiomatic: 'Moreover, ritual holds that an ancestor does not reject a grandson; mourning should be worn in full, without reduction.',
    },
    {
      zh: '而緣情立制，若嫌明文不存，則疑斯從重。',
      literal: 'Yet when establishing regulations by feeling, if one doubts because no explicit text survives, then one should follow the heavier mourning.',
      idiomatic: 'When regulation is shaped by affection, and no explicit text survives, the safer course is the heavier mourning.',
    },
    {
      zh: '謂應同於為祖母後，齊衰三年。',
      literal: 'He held that one should follow the same rule as for a paternal grandmother—three years of qi-sackcloth mourning.',
      idiomatic: 'He held that the emperor should follow the same rule as for a paternal grandmother—three years of qi mourning.',
    },
    {
      zh: '」時從其議。',
      literal: '" At the time they followed his opinion.',
      idiomatic: '" At the time they followed his opinion.',
    },
  ],
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = rows.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = 'Restored missing upstream biography text with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

const allIds = [
  ...Object.keys(packets),
  'source-songshu-055-wikisource-c09deb34550e',
  'source-songshu-055-wikisource-dfb52dee93b5',
];
for (const id of allIds) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  if (!packets[id]) {
    item.status = 'approved';
    item.decision = 'approved';
    item.notes = 'Corrected local OCR/typo to match upstream witness.';
    item.reviewedAt = new Date().toISOString();
    item.reviewer = 'sdk-repair-chapter';
  }
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter --preserve-existing-translations`,
    { stdio: 'inherit' },
  );
}

console.log('Applied songshu/055 source correspondence repairs.');
