#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-liaoshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';
const ID = 'source-liaoshi-097-wikisource-27176c7e640e';

const rows = [
  {
    zh: '楊績，良鄉人。',
    literal: 'Yang Ji was a man of Liangxiang.',
    idiomatic: 'Yang Ji was a native of Liangxiang.',
  },
  {
    zh: '太平十一年進士及第，累遷南院樞密副使。',
    literal: 'In the eleventh year of Taiping he passed the civil examinations and was repeatedly promoted to Vice Commissioner of the Southern Administration.',
    idiomatic: 'In the eleventh year of Taiping he passed the civil examinations and was repeatedly promoted until he became Vice Commissioner of the Southern Administration.',
  },
  {
    zh: '與杜防、韓知白等擅給進士堂帖，降長寧軍節度使，徙知涿州。',
    literal: 'Together with Du Fang, Han Zhibai, and others he arbitrarily issued jinshi hall credentials; he was demoted to Military Commissioner of Changning Army and transferred to administer Zhuo Prefecture.',
    idiomatic: 'Together with Du Fang, Han Zhibai, and others he arbitrarily issued jinshi hall credentials; he was demoted to Military Commissioner of Changning Army and transferred to administer Zhuo Prefecture.',
  },
  {
    zh: '清寧初，拜參知政事，兼同知樞密院事，為南府宰相。',
    literal: 'At the beginning of Qingning he was appointed Vice Grand Councilor, concurrently Vice Director of the Military Affairs Commission, and served as Chancellor of the Southern Administration.',
    idiomatic: 'At the beginning of Qingning he was appointed Vice Grand Councilor, concurrently Vice Director of the Military Affairs Commission, and Chancellor of the Southern Administration.',
  },
  {
    zh: '九年，聞重元亂，與姚景行勤王，上嘉之。',
    literal: 'In the ninth year, hearing of Chongyuan\'s rebellion, he marched with Yao Jingxing to aid the throne, and the emperor commended him.',
    idiomatic: 'In the ninth year, on hearing of Chongyuan\'s rebellion, he marched with Yao Jingxing to aid the throne, and the emperor commended him.',
  },
  {
    zh: '十年，知興中府。',
    literal: 'In the tenth year he administered Xingzhong Prefecture.',
    idiomatic: 'In the tenth year he administered Xingzhong Prefecture.',
  },
  {
    zh: '咸雍初，入知樞密院事。',
    literal: 'At the beginning of Xianyong he entered to administer the Military Affairs Commission.',
    idiomatic: 'At the beginning of Xianyong he entered court to administer the Military Affairs Commission.',
  },
  {
    zh: '二年，乞致仕，不許，拜南院樞密使。',
    literal: 'In the second year he requested retirement but was not permitted and was appointed Commissioner of the Southern Administration.',
    idiomatic: 'In the second year he asked to retire, but permission was refused, and he was appointed Commissioner of the Southern Administration.',
  },
  {
    zh: '帝以績舊臣，特詔燕見，論古今治亂，人臣邪正。',
    literal: 'Because Ji was an old minister, the emperor specially summoned him to a private audience to discuss the order and disorder of ancient and modern times and the wickedness and rectitude of ministers.',
    idiomatic: 'Because Ji was an old minister, the emperor specially summoned him to a private audience to discuss the order and disorder of ancient and modern times and the wickedness and rectitude of ministers.',
  },
  {
    zh: '帝曰：「方今群臣忠直，耶律玦、劉伸而已；',
    literal: 'The emperor said: "Among the ministers today who are loyal and upright, only Yelu Jue and Liu Shen remain;',
    idiomatic: 'The emperor said, "Among the ministers today who are loyal and upright, only Yelu Jue and Liu Shen remain;',
  },
  {
    zh: '然伸不及玦之剛介。」',
    literal: 'yet Shen does not match Jue in firm integrity."',
    idiomatic: 'yet Shen does not match Jue in firm integrity."',
  },
  {
    zh: '績拜賀曰：「何代無賢，世亂則獨善其身，主聖則兼濟天下。',
    literal: 'Ji bowed in congratulation and said: "What age has lacked worthy men? When the age is chaotic one keeps oneself whole; when the ruler is sage one benefits all under Heaven.',
    idiomatic: 'Ji bowed in congratulation and said, "What age has lacked worthy men? When the age is chaotic one keeps oneself whole; when the ruler is sage one benefits all under Heaven.',
  },
  {
    zh: '陛下銖分邪正，升黜分明，天下幸甚。」',
    literal: 'Your Majesty minutely distinguishes the wicked and the upright and promotes and demotes with clarity—great fortune for the realm."',
    idiomatic: 'Your Majesty minutely distinguishes the wicked and the upright and promotes and demotes with clarity—great fortune for the realm."',
  },
  {
    zh: '累表告歸，不許，封趙王。',
    literal: 'He repeatedly memorialized asking to return home but was not permitted and was enfeoffed as Prince of Zhao.',
    idiomatic: 'He repeatedly memorialized asking to return home, but permission was refused, and he was enfeoffed as Prince of Zhao.',
  },
  {
    zh: '大康中，以例改王遼西。',
    literal: 'During Dakang, by precedent his princedom was changed to Liaoxi.',
    idiomatic: 'During the Dakang era, by precedent his title was changed to Prince of Liaoxi.',
  },
  {
    zh: '致仕，加守太保，薨。',
    literal: 'He retired, was promoted to Defender Grand Guardian, and died.',
    idiomatic: 'He retired from office, was promoted to Defender Grand Guardian, and died.',
  },
  {
    zh: '子貴忠，知興中府。',
    literal: 'His son Guizhong administered Xingzhong Prefecture.',
    idiomatic: 'His son Guizhong administered Xingzhong Prefecture.',
  },
];

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const item = queue.items.find((x) => x.id === ID);
if (!item) throw new Error(`Missing ${ID}`);
item.manualTranslations = rows.map((row) => ({ ...row, translator: T, model: M }));
item.acceptedSourceText = rows.map((r) => r.zh).join('');
item.status = 'approved';
item.decision = 'approved';
item.notes = 'Restored missing Yang Ji biography from Wikisource with manual translations.';
item.reviewedAt = new Date().toISOString();
item.reviewer = 'sdk-repair-chapter';
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

execSync(
  `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${ID} --item ${ID} --reviewer sdk-repair-chapter`,
  { stdio: 'inherit' },
);

console.log('Applied Yang Ji biography to liaoshi/097.');
