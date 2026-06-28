#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-yuanshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

function mt(zh, literal, idiomatic = literal) {
  return { zh, literal, idiomatic, translator: T, model: M };
}

const patches = {
  'source-yuanshi-088-wikisource-629c51aaef1c': {
    acceptedSourceText:
      '肇州等處女直千戶所，達魯花赤一員，千戶一員，副千戶一員，吏目一員，司吏四人。延祐三年置。' +
      '朵因溫都兒兀良哈千戶所，延祐三年置。' +
      '灰亦兒等處怯憐口千戶所，至治元年置。',
    manualTranslations: [
      mt(
        '肇州等處女直千戶所，達魯花赤一員，千戶一員，副千戶一員，吏目一員，司吏四人。',
        'The Zhao Prefecture Jurchen Thousand-Households Office: one darughachi, one chiliarch, one deputy chiliarch, one clerical officer, and four bureau clerks.',
      ),
      mt('延祐三年置。', 'Established in Yanyou year 3.'),
      mt(
        '朵因溫都兒兀良哈千戶所，延祐三年置。',
        'The Doyin Temür Uyaghur Thousand-Households Office was established in Yanyou year 3.',
      ),
      mt(
        '灰亦兒等處怯憐口千戶所，至治元年置。',
        'The Thousand-Households Office for Qielian Households at Huiyer and other places was established in Zhizhi year 1.',
      ),
    ],
    notes:
      'Inserted three missing thousand-households offices between 諸色人匠怯憐口千戶所 and 開元等處怯憐口千戶所; used 兀 for 朵因溫都兒兀良哈 per Wikisource emendation.',
  },
  'source-yuanshi-088-wikisource-f74a0ce2ab22': {
    acceptedSourceText:
      '管領上都等處諸色人匠提舉司，秩從五品。達魯花赤一員，提舉一員，並從五品；同提舉一員，從六品；副提舉一員，從七品；直長一員，都目一員，吏目一員，司吏四人，部役二人。元貞元年始置，管戶二千五百有奇，隸翊正司。' +
      '管領隨路打捕鷹房納綿等戶提舉司，秩從五品。達魯花赤一員，提舉一員，同提舉一員，副提舉一員，品秩同上；直長一員，都目一員，吏目一員，司吏四人，部役二人。元貞元年始置，隸翊正司。',
    manualTranslations: [
      mt(
        '管領上都等處諸色人匠提舉司，秩從五品。',
        'The Directorate for Artisans of All Categories at Shangdu and other places, rank 5b.',
      ),
      mt('達魯花赤一員，提舉一員，並從五品；', 'one darughachi and one director, both at rank 5b;'),
      mt('同提舉一員，從六品；', 'one associate director at rank 6b;'),
      mt('副提舉一員，從七品；', 'one deputy director at rank 7b;'),
      mt(
        '直長一員，都目一員，吏目一員，司吏四人，部役二人。',
        'one section chief, one chief clerk, one clerical officer, four bureau clerks, and two provision officers.',
      ),
      mt(
        '元貞元年始置，管戶二千五百有奇，隸翊正司。',
        'First established in Yuanzhen year 1, administering more than 2,500 households, subordinate to the Support Rectitude Office.',
      ),
      mt(
        '管領隨路打捕鷹房納綿等戶提舉司，秩從五品。',
        'The Directorate for Hunter, Falconry, and Cotton-Tribute Households on All Routes, rank 5b.',
      ),
      mt(
        '達魯花赤一員，提舉一員，同提舉一員，副提舉一員，品秩同上；',
        'one darughachi, one director, one associate director, and one deputy director, with ranks as above;',
      ),
      mt(
        '元貞元年始置，隸翊正司。',
        'First established in Yuanzhen year 1, subordinate to the Support Rectitude Office.',
      ),
    ],
    notes:
      'Restored two missing 翊正司 subordinate directorates after 領提舉司二、提領所一.',
    clearLocalRange: true,
  },
  'source-yuanshi-088-wikisource-c21b336405cf': {
    acceptedSourceText:
      '大德四年，省併為十一處，改提舉司，陞從五品。' +
      '涿州、保定、真定、冀寧、河南、大名、東平、東昌、濟南等路提舉司，凡九處。各設達魯花赤一員、提舉一員、同提舉一員、副提舉一員、都目一員。' +
      '提領所凡二十五處：大都等路、東安州、濟寧、曹州、沂州、完州、河間、濟南、濟陽、大同、元氏、冀寧、晉寧、歸德、南陽、懷孟、汝寧、衛輝、曹州、涿州、真定、中山、平山、大名、高唐等。每處各設提領一員、同提領一員、副提領一員、典史一員。' +
      '管領諸路打捕鷹房民匠等戶總管府，秩正三品。達魯花赤一員，總管一員，正三品；同知一員，正五品；副總管二員，從五品；經歷一員，從七品；知事一員，從八品；提控案牘一員，照磨一員，譯史一人，令史四人，奏差二人。掌錢糧造作之事。大德三年始置。元貞元年，撥隸中宮位下，領提舉司四、提領所十有一。' +
      '管民提舉司，大都等路、冀寧等路、南陽唐州等處、河南府路等處，凡四司。秩從五品。每司設達魯花赤一員、提舉一員、同提舉一員、副提舉一員、都目一員、吏二人。' +
      '提領所凡十有一：大都保定、河間真定、南陽鄧州、河南嵩汝、汴梁裕州、汝寧陳州、唐州泌陽、襄陽湖陽、晉寧、冀寧等處各設所，秩正七品。每所提領二員，同提領一員，副提領一員，典史一員，司吏二人。至元十六年置。至大元年，改提領所。' +
      '江浙等處財賦都總管府，秩正三品。達魯花赤一員，都總管一員，並正三品；同知一員，正五品；副總管一員，從五品；經歷一員，從七品；知事一員，從八品；照磨一員，提控案牘一員，從九品；譯史一人，令史一十五人，奏差一十五人，典吏二人。掌江南沒入貲產，課其所賦，以供內儲。至大元年置。領提舉司三，庫、局各一。' +
      '平江、松江、建康等處提舉司凡三處，秩並正五品。每司各設達魯花赤一員、提舉一員、同提舉一員、副提舉一員、都目一員、吏目一員、司吏六人。',
    manualTranslations: [
      mt('大德四年，省併為十一處，改提舉司，陞從五品。', 'In Dade year 4 they were consolidated into eleven offices, changed to directorates, and raised to rank 5b.'),
      mt(
        '涿州、保定、真定、冀寧、河南、大名、東平、東昌、濟南等路提舉司，凡九處。',
        'Directorates at Zhuozhou, Baoding, Zhending, Jining, Henan, Daming, Dongping, Dongchang, and Jinan routes—nine in all.',
      ),
      mt(
        '各設達魯花赤一員、提舉一員、同提舉一員、副提舉一員、都目一員。',
        'Each had one darughachi, one director, one associate director, one deputy director, and one chief clerk.',
      ),
      mt(
        '提領所凡二十五處：大都等路、東安州、濟寧、曹州、沂州、完州、河間、濟南、濟陽、大同、元氏、冀寧、晉寧、歸德、南陽、懷孟、汝寧、衛輝、曹州、涿州、真定、中山、平山、大名、高唐等。',
        'Twenty-five supervisory offices: at Dadu and other routes, Dong\'an Prefecture, Jining, Caozhou, Yizhou, Wanzhou, Hejian, Jinan, Jiyang, Datong, Yuanshi, Jining, Jinning, Guide, Nanyang, Huaiqing, Runing, Weihui, Caozhou, Zhuozhou, Zhending, Zhongshan, Pingshan, Daming, and Gaotang.',
      ),
      mt(
        '每處各設提領一員、同提領一員、副提領一員、典史一員。',
        'Each had one supervisor, one associate supervisor, one deputy supervisor, and one record keeper.',
      ),
      mt(
        '管領諸路打捕鷹房民匠等戶總管府，秩正三品。',
        'The Directorate-General of Hunter, Falconry, and Artisan Households on All Routes, rank 3a.',
      ),
      mt('達魯花赤一員，總管一員，正三品；', 'one darughachi and one director at rank 3a;'),
      mt('同知一員，正五品；', 'one associate director at rank 5a;'),
      mt('副總管二員，從五品；', 'two deputy directors at rank 5b;'),
      mt('經歷一員，從七品；', 'one administrative supervisor at rank 7b;'),
      mt('知事一員，從八品；', 'one clerical officer at rank 8b;'),
      mt(
        '提控案牘一員，照磨一員，譯史一人，令史四人，奏差二人。',
        'one records controller, one audit registrar, one translator, four clerks, and two petition clerks.',
      ),
      mt('掌錢糧造作之事。', 'It managed finances and manufactures.'),
      mt('大德三年始置。', 'Established in Dade year 3.'),
      mt(
        '元貞元年，撥隸中宮位下，領提舉司四、提領所十有一。',
        "In Yuanzhen year 1 it was placed under the empress's palace, overseeing four directorates and eleven supervisory offices.",
      ),
      mt(
        '管民提舉司，大都等路、冀寧等路、南陽唐州等處、河南府路等處，凡四司。',
        'Civil Household Directorates at Dadu and other routes, Jining and other routes, Nanyang-Tangzhou and other places, and Henan prefectures and routes—four in all.',
      ),
      mt('秩從五品。', 'Rank 5b.'),
      mt(
        '每司設達魯花赤一員、提舉一員、同提舉一員、副提舉一員、都目一員、吏二人。',
        'Each had one darughachi, one director, one associate director, one deputy director, one chief clerk, and two clerks.',
      ),
      mt(
        '提領所凡十有一：大都保定、河間真定、南陽鄧州、河南嵩汝、汴梁裕州、汝寧陳州、唐州泌陽、襄陽湖陽、晉寧、冀寧等處各設所，秩正七品。',
        'Eleven supervisory offices: Dadu-Baoding, Hejian-Zhending, Nanyang-Dengzhou, Henan-Song-Ru, Bianliang-Yuzhou, Runing-Chenzhou, Tangzhou-Biyang, Xiangyang-Huyang, Jinning, and Jining each had an office at rank 7a.',
      ),
      mt(
        '每所提領二員，同提領一員，副提領一員，典史一員，司吏二人。',
        'Each office had two supervisors, one associate supervisor, one deputy supervisor, one record keeper, and two bureau clerks.',
      ),
      mt('至元十六年置。', 'Established in Zhiyuan year 16.'),
      mt('至大元年，改提領所。', 'In Zhida year 1 they were changed to supervisory offices.'),
      mt(
        '江浙等處財賦都總管府，秩正三品。',
        'The Jiangzhe and Other Regions Finance Directorate-General, rank 3a.',
      ),
      mt('達魯花赤一員，都總管一員，並正三品；', 'one darughachi and one chief director, both at rank 3a;'),
      mt('同知一員，正五品；', 'one associate director at rank 5a;'),
      mt('副總管一員，從五品；', 'one deputy director at rank 5b;'),
      mt('經歷一員，從七品；', 'one administrative supervisor at rank 7b;'),
      mt('知事一員，從八品；', 'one clerical officer at rank 8b;'),
      mt(
        '照磨一員，提控案牘一員，從九品；',
        'one audit registrar and one records controller at rank 9b;',
      ),
      mt(
        '譯史一人，令史一十五人，奏差一十五人，典吏二人。',
        'one translator, fifteen clerks, fifteen petition clerks, and two record keepers.',
      ),
      mt(
        '掌江南沒入貲產，課其所賦，以供內儲。',
        'It managed confiscated property in the south, assessed its levies, and supplied the inner treasury.',
      ),
      mt('至大元年置。', 'Established in Zhida year 1.'),
      mt('領提舉司三，庫、局各一。', 'It oversaw three directorates, one storehouse, and one bureau.'),
      mt('平江、松江、建康等處提舉司凡三處，秩並正五品。', 'Three directorates at Pingjiang, Songjiang, and Jiankang, all at rank 5a.'),
      mt(
        '每司各設達魯花赤一員、提舉一員、同提舉一員、副提舉一員、都目一員、吏目一員、司吏六人。',
        'Each had one darughachi, one director, one associate director, one deputy director, one chief clerk, one clerical officer, and six bureau clerks.',
      ),
    ],
    notes:
      'Restored missing 管領諸路打捕鷹房民匠等戶總管府, eleven 管民提領所, and 江浙等處財賦都總管府 blocks; retained local 沂州 reading in the twenty-five-office list.',
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const ids = Object.keys(patches);

for (const id of ids) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing queue item ${id}`);
  if (item.status === 'applied') {
    console.log('skip already applied', id);
    continue;
  }
  const patch = patches[id];
  item.manualTranslations = patch.manualTranslations;
  if (patch.acceptedSourceText) item.acceptedSourceText = patch.acceptedSourceText;
  if (patch.clearLocalRange) {
    delete item.localRange;
  }
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = patch.notes;
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}

fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of ids) {
  const item = queue.items.find((x) => x.id === id);
  if (item.status === 'applied') continue;
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Finished remaining yuanshi/088 source-correspondence items');
