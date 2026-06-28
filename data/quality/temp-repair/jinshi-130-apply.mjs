#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-jinshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-jinshi-130-wikisource-63432d63ae53': [
    {
      zh: '阿魯真，宗室承充之女，胡裏改猛安夾谷胡山之妻。',
      literal: 'A Luzhen was a daughter of the imperial clansman Chengchong and the wife of Jiagu Hushan of the Huligai meng\'an.',
      idiomatic: 'A Luzhen was a daughter of the imperial clansman Chengchong and the wife of Jiagu Hushan of the Huligai meng\'an.',
    },
    {
      zh: '夫亡寡居，有眾千餘。',
      literal: 'Her husband died and she lived as a widow, with more than a thousand followers.',
      idiomatic: 'After her husband died she lived as a widow with more than a thousand followers.',
    },
    {
      zh: '興定元年，承充為上京元帥，上京行省太平執承充應蒲鮮萬奴。',
      literal: 'In the first year of Xingding, Chengchong was grand marshal of the Upper Capital; Taiping of the Upper Capital Branch Secretariat seized Chengchong to respond to Pu Xian Wannu.',
      idiomatic: 'In the first year of Xingding (1217), Chengchong was grand marshal of the Upper Capital; Taiping of the Upper Capital Branch Secretariat seized Chengchong to answer Pu Xian Wannu.',
    },
    {
      zh: '阿魯真治廢壘，修器械，積芻糧以自守。',
      literal: 'A Luzhen restored ruined fortifications, repaired weapons, and stockpiled fodder and grain to hold out.',
      idiomatic: 'A Luzhen restored ruined fortifications, repaired weapons, and stockpiled fodder and grain to hold out.',
    },
    {
      zh: '萬奴遣人招之，不從，乃射承充書入城，阿魯真得而碎之，曰：「此詐也。」',
      literal: 'Wannu sent men to summon her, but she refused; he then shot a letter from Chengchong into the city; A Luzhen received it and tore it to pieces, saying, "This is a fraud."',
      idiomatic: 'Wannu sent men to summon her, but she refused; he then shot a letter from Chengchong into the city. A Luzhen received it, tore it to pieces, and said, "This is a fraud."',
    },
    {
      zh: '萬奴兵急攻之，阿魯真衣男子服，與其子蒲帶督眾力戰，殺數百人，生擒十余人，萬奴兵乃解去。',
      literal: 'Wannu\'s troops pressed the attack; A Luzhen dressed in men\'s clothing and, with her son Pu Dai, directed the multitude in fierce fighting, killing several hundred men and capturing more than ten alive; Wannu\'s army then withdrew.',
      idiomatic: 'When Wannu\'s troops pressed the attack, A Luzhen dressed in men\'s clothing and, with her son Pu Dai, directed the defenders in fierce fighting, killing several hundred men and capturing more than ten alive; Wannu\'s army then withdrew.',
    },
    {
      zh: '後複遣將擊萬奴兵，獲其將一人。',
      literal: 'Later she again sent generals against Wannu\'s troops and captured one of his generals.',
      idiomatic: 'Later she again sent generals against Wannu\'s troops and captured one of his generals.',
    },
    {
      zh: '詔封郡公夫人，子蒲帶視功遷賞。',
      literal: 'An edict enfeoffed her as Lady of a Commandery; her son Pu Dai was promoted and rewarded according to merit.',
      idiomatic: 'An edict enfeoffed her as Lady of a Commandery, and her son Pu Dai was promoted and rewarded according to merit.',
    },
    {
      zh: '承充已被執，乘間謂其二子女胡、蒲速乃曰：「吾起身宿衛，致位一品，死無恨矣。',
      literal: 'Chengchong had already been taken prisoner; seizing an opportunity he said to his two children, Nühu and Pusunai: "I rose from palace guard service to the first rank; I die without regret.',
      idiomatic: 'Chengchong had already been taken prisoner; seizing an opportunity he told his two children, Nühu and Pusunai, "I rose from palace guard service to the first rank; I die without regret.',
    },
    {
      zh: '若輩亦皆通顯，未嘗一日報國家，當思自處，以為後圖。」',
      literal: 'You too have all attained distinction, yet never for a single day have you repaid the state—consider how you should conduct yourselves and plan for the future."',
      idiomatic: 'You too have all attained distinction, yet never for a single day have you repaid the state. Consider how you should conduct yourselves and plan for the future."',
    },
    {
      zh: '二子乃冒險自拔南走，是年四月至南京。',
      literal: 'The two sons then risked their lives to break free and flee south; in the fourth month of that year they reached the Southern Capital.',
      idiomatic: 'The two sons then risked their lives to break free and flee south; in the fourth month of that year they reached the Southern Capital.',
    },
  ],
  'source-jinshi-130-wikisource-265006e15203': [
    {
      zh: '白氏，蘇嗣之之母，許州人，宋尚書右丞子由五世孫婦也。',
      literal: 'Lady Bai was the mother of Su Sizhi, a native of Xu Prefecture and daughter-in-law in the fifth generation of Ziyou, Right Vice Director of the Song Secretariat of Works.',
      idiomatic: 'Lady Bai was the mother of Su Sizhi, a native of Xu Prefecture and the fifth-generation daughter-in-law of Ziyou, Right Vice Director of the Song Secretariat of Works.',
    },
    {
      zh: '初，東坡、潁濱、叔党俱葬郟城之小峨嵋山，故五世皆居許昌。',
      literal: 'At first, Dongpo, Yinbin, and Shudang were all buried at Little Emei Mountain in Jia County, and for five generations the family all resided at Xuchang.',
      idiomatic: 'At first Dongpo, Yinbin, and Shudang were all buried at Little Emei Mountain in Jia County, and for five generations the family lived at Xuchang.',
    },
    {
      zh: '白氏年二十余即寡居，服除，外家迎歸，兄嫂竊議改醮。',
      literal: 'Lady Bai was widowed in her twenties; when mourning ended her maternal family welcomed her back, and her elder brother and sister-in-law secretly discussed remarriage.',
      idiomatic: 'Lady Bai was widowed in her twenties; when mourning ended her maternal family welcomed her back, and her elder brother and sister-in-law secretly discussed remarriage.',
    },
    {
      zh: '白氏微聞之，牽車徑歸，曰：「我為蘇學士家婦，又有子，乃欲使我失身乎。」',
      literal: 'Lady Bai faintly heard of it, took her carriage and went straight home, saying, "I am a wife of the Su Scholar\'s household, and I have a son—would you make me lose my chastity?"',
      idiomatic: 'Lady Bai faintly heard of it, took her carriage and went straight home, saying, "I am a wife of the Su Scholar\'s household, and I have a son—would you make me lose my chastity?"',
    },
    {
      zh: '自是，外家非有大故不往也。',
      literal: 'From this time forth she did not visit her maternal family except for great mourning occasions.',
      idiomatic: 'From then on she did not visit her maternal family except for great mourning occasions.',
    },
    {
      zh: '嘗于宅東北為祭室，畫兩先生像，圖黃州、龍川故事壁間，香火嚴潔，躬自灑掃，士大夫求瞻拜者往往過其家奠之。',
      literal: 'She once made a sacrificial chamber northeast of the residence, painted portraits of the two masters, and illustrated Huangzhou and Longchuan stories on the walls; the incense offerings were kept scrupulously clean, and she personally swept and sprinkled; gentlemen seeking to pay reverence often passed her home to offer sacrifice.',
      idiomatic: 'She once built a sacrificial chamber northeast of the residence, painted portraits of the two masters, and illustrated Huangzhou and Longchuan stories on the walls; the incense offerings were kept scrupulously clean, and she personally swept and sprinkled; gentlemen seeking to pay reverence often passed her home to offer sacrifice.',
    },
    {
      zh: '天興元年正月庚戌，許州被兵，嗣之為汴京廂官，白拜辭兩先生前曰：「兒子往京師，老婦死無恨矣，敢以告。」',
      literal: 'On gengxu, the first month of the first year of Tianxing, Xu Prefecture was overrun by troops; Sizhi was a Bianjing bureau official; Lady Bai took leave before the two masters\' portraits, saying, "My son is going to the capital; this old woman dies without regret—dare I report this."',
      idiomatic: 'On gengxu, the first month of the first year of Tianxing (1232), Xu Prefecture was overrun by troops. Sizhi was a Bianjing bureau official. Lady Bai took leave before the two masters\' portraits, saying, "My son is going to the capital; this old woman dies without regret—I report this to you."',
    },
    {
      zh: '即自縊於室側。',
      literal: 'She thereupon hanged herself beside the chamber.',
      idiomatic: 'She then hanged herself beside the chamber.',
    },
    {
      zh: '家人並屋焚之。',
      literal: 'Her family burned the house together with it.',
      idiomatic: 'Her family burned the house together with her.',
    },
    {
      zh: '年七十餘。',
      literal: 'Her years were more than seventy.',
      idiomatic: 'She was more than seventy.',
    },
    {
      zh: '嗣之本名宗之，避諱改焉。',
      literal: 'Sizhi\'s original name was Zongzhi; it was changed to avoid taboo.',
      idiomatic: 'Sizhi\'s original name was Zongzhi; it was changed to avoid taboo.',
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
  item.acceptedSourceText = rows.map((r) => r.zh).join('');
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = 'Restored missing upstream biography text with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(`node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`, { stdio: 'inherit' });
}

console.log('Applied source correspondence items for jinshi/130.');
