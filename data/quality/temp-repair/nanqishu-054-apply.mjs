#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-nanqishu.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-nanqishu-054-wikisource-b0eb14db1284': [
    {
      zh: '宋孝建二年，散騎常侍樂詢行風俗，表薦伯玉，加徵聘本州議曹從事，不就。',
      literal: 'In the second year of Xiaojian of Song, Attendant-in-Ordinary at Leisure Yue Xun toured customs and morals, memorialized recommending Boyu, and had him further summoned and appointed Staff Officer of the Provincial Council; he did not accept.',
      idiomatic: 'In the second year of Xiaojian of Song, Attendant-in-Ordinary at Leisure Yue Xun toured local customs and morals, memorialized recommending Boyu, and had him further summoned as Staff Officer of the Provincial Council; Boyu declined.',
    },
    {
      zh: '太祖卽位，手詔吳、會二郡，以禮迎遣，又辭疾。',
      literal: 'When the founder took the throne, he personally issued edicts to the two commanderies of Wu and Kuaiji, sending envoys to welcome him with ceremony; Boyu again pleaded illness.',
      idiomatic: 'When the founder took the throne, he personally issued edicts to Wu and Kuaiji commanderies, sending envoys to welcome him with full ceremony; Boyu again pleaded illness.',
    },
    {
      zh: '上不欲違其志，敕於剡白石山立太平館居之。',
      literal: 'The emperor, not wishing to go against his will, ordered that the Taiping Lodge be built on White Stone Mountain in Shan for him to dwell in.',
      idiomatic: 'Unwilling to go against his wishes, the emperor ordered the Taiping Lodge built on White Stone Mountain in Shan for him to live in.',
    },
    {
      zh: '建元元年，卒。',
      literal: 'In the first year of Jianyuan, he died.',
      idiomatic: 'He died in the first year of Jianyuan.',
    },
    {
      zh: '年八十六。',
      literal: 'He was eighty-six.',
      idiomatic: 'He was eighty-six.',
    },
    {
      zh: '常居一樓上，仍葬樓所。',
      literal: 'He regularly lived on an upper story of a building and was buried at that building site.',
      idiomatic: 'He had long lived on the upper story of a building and was buried at that same site.',
    },
    {
      zh: '孔稚珪從其受道法，爲於館側立碑。',
      literal: 'Kong Zhigui received the Way from him and had a stele erected beside the lodge.',
      idiomatic: 'Kong Zhigui studied the Way under him and had a stele erected beside the lodge.',
    },
  ],
  'source-nanqishu-054-wikisource-f5cb4560af86': [
    {
      zh: '昇明中，太祖爲太傅，教辟僧紹及顧歡、臧榮緒以旍幣之禮，徵爲記室參軍，不至。',
      literal: 'During Shengming, when the founder was Grand Tutor, he ordered that Sengshao together with Gu Huan and Zang Rongxu be summoned with the ceremony of banners and silks and appointed Staff Officers of the Records; they did not come.',
      idiomatic: 'During the Shengming era, while serving as Grand Tutor, the founder ordered Sengshao, Gu Huan, and Zang Rongxu summoned with banners and silks and appointed as staff officers of the records; none came.',
    },
    {
      zh: '僧紹弟慶符，爲青州，僧紹乏糧食，隨慶符之鬱洲，住弇榆山，栖雲精舍，欣玩水石，竟不一入州城。',
      literal: 'Sengshao\'s younger brother Qingfu was governor of Qing Province; Sengshao lacked food and followed Qingfu to Yuzhou, dwelling on Mount Yanyu at the Qiyun Hermitage, delighting in water and rocks, and never once entering the provincial city.',
      idiomatic: 'Sengshao\'s younger brother Qingfu served as governor of Qing Province; short of provisions, Sengshao followed Qingfu to Yuzhou, settled on Mount Yanyu at the Qiyun Hermitage, delighted in streams and stones, and never once entered the provincial city.',
    },
    {
      zh: '建元元年冬，詔曰：「朕側席思士，載懷塵外。',
      literal: 'In the winter of the first year of Jianyuan, an edict said: "We sit sideways in longing for scholars and ever cherish those beyond the dust.',
      idiomatic: 'In the winter of the first year of Jianyuan, an edict said: "I sit in eager longing for scholars and ever cherish those who dwell beyond the world of dust.',
    },
    {
      zh: '齊郡明僧紹標志高栖，耽情墳素，幽貞之操，宜加賁飾。',
      literal: 'Ming Sengshao of Qi Commandery holds lofty aims in high seclusion, immerses himself in the classics, and has a secluded and steadfast integrity that should be further honored.',
      idiomatic: 'Ming Sengshao of Qi Commandery holds himself aloft in lofty seclusion, immerses himself in the classics, and has a secluded and steadfast integrity that deserves further honor.',
    },
    {
      zh: '」徵爲正員郎，稱疾不就。',
      literal: '" He was summoned as Regular Attendant but pleaded illness and did not accept.',
      idiomatic: '" He was summoned as Regular Attendant but pleaded illness and declined.',
    },
    {
      zh: '其後與崔思祖書曰：「明居士標意可重，吾前旨竟未達邪？',
      literal: 'Later he wrote to Cui Sizu, saying: "Master Ming\'s purpose is weighty—has my earlier intent truly not reached him?',
      idiomatic: 'Later he wrote to Cui Sizu, saying: "Master Ming\'s purpose is weighty—has my earlier intent truly not reached him?',
    },
    {
      zh: '小敘欲有講事，卿可至彼，具述吾意，令與慶符俱歸。',
      literal: 'At a small gathering I wish to hold a discussion; you may go there, fully convey my intent, and have him return together with Qingfu.',
      idiomatic: 'At a small gathering I wish to hold a discussion; you may go there, fully convey my intent, and have him return together with Qingfu.',
    },
    {
      zh: '」又曰：「不食周粟而食周薇，古猶發議。',
      literal: '" He also said: "To refuse Zhou millet yet eat Zhou ferns—even antiquity still raised debate on this.',
      idiomatic: '" He also said: "To refuse Zhou millet yet eat Zhou ferns—even antiquity still provoked debate on this.',
    },
    {
      zh: '在今寧得息談邪？',
      literal: 'In the present age can such talk truly cease?',
      idiomatic: 'In the present age can such talk truly cease?',
    },
    {
      zh: '聊以爲笑。',
      literal: 'I offer this only as a jest.',
      idiomatic: 'I offer this only as a jest.',
    },
    {
      zh: '」',
      literal: '"',
      idiomatic: '"',
    },
  ],
  'source-nanqishu-054-wikisource-d2528593cf74': [
    {
      zh: '求弟點，少不仕。',
      literal: 'Qiu\'s younger brother Dian from youth did not take office.',
      idiomatic: 'Qiu\'s younger brother Dian from youth did not take office.',
    },
    {
      zh: '宋世徵爲太子洗馬，不就。',
      literal: 'In the Song era he was summoned as Groom of the Heir Apparent\'s Household but did not accept.',
      idiomatic: 'Under Song he was summoned as Groom of the Heir Apparent\'s Household but declined.',
    },
    {
      zh: '隱居東離門卞望之墓側。',
      literal: 'He lived in seclusion beside the tomb of Bian Wangzhi at the Eastern Lili Gate.',
      idiomatic: 'He lived in seclusion beside the tomb of Bian Wangzhi at the Eastern Lili Gate.',
    },
    {
      zh: '性率到，鮮狎人物。',
      literal: 'By nature he was blunt and direct and rarely familiar with people.',
      idiomatic: 'By nature he was blunt and direct and rarely cultivated familiarity with others.',
    },
    {
      zh: '建元中，褚淵、王儉爲宰相，點謂人曰：「我作《齊書》已竟，贊云：『淵旣世族，儉亦國華。',
      literal: 'During Jianyuan, Chu Yuan and Wang Jian served as chief ministers; Dian said to people: "I have already finished writing the Book of Qi, and its encomium says, \'Yuan is already a great clan, and Jian is also a national flower.',
      idiomatic: 'During the Jianyuan era, Chu Yuan and Wang Jian served as chief ministers; Dian told others: "I have already finished writing the Book of Qi, and its encomium says, \'Yuan is already a great clan, and Jian is also a national flower.',
    },
    {
      zh: '不賴舅氏，遑卹外家。',
      literal: 'Not relying on maternal uncles, how could one spare concern for the wife\'s family?\'',
      idiomatic: 'Not relying on maternal uncles, how could one spare concern for the wife\'s family?\'',
    },
    {
      zh: '』」儉欲候之，知不可見，乃止。',
      literal: '\'\" Jian wished to call on him, knew he could not be seen, and stopped.',
      idiomatic: '\'\" Jian wished to call on him, knew he could not be seen, and desisted.',
    },
    {
      zh: '永明元年，徵中書郎。',
      literal: 'In the first year of Yongming, he was summoned as Attendant of the Secretariat.',
      idiomatic: 'In the first year of Yongming, he was summoned as Attendant of the Secretariat.',
    },
    {
      zh: '豫章王命駕造門，點從後門逃去。',
      literal: 'The Prince of Yuzhang ordered his carriage to his gate; Dian fled out the back gate.',
      idiomatic: 'The Prince of Yuzhang came to his gate in his carriage; Dian fled out the back gate.',
    },
    {
      zh: '竟陵王子良聞之，曰：「豫章王尚不屈，非吾所議。',
      literal: 'Jiling Prince Ziliang heard of it and said: "Even the Prince of Yuzhang still could not bend him—this is not a matter for me to discuss.',
      idiomatic: 'Jiling Prince Ziliang heard of it and said: "Even the Prince of Yuzhang still could not bend him—this is not a matter for me to discuss.',
    },
    {
      zh: '」遺點嵇叔夜酒杯、徐景山酒鎗以通意。',
      literal: '" He sent Dian a Ji Shuye wine cup and an Xu Jingshan wine ladle to convey his intent.',
      idiomatic: '" He sent Dian a Ji Shuye wine cup and an Xu Jingshan wine ladle to convey his intent.',
    },
    {
      zh: '點常自得，遇酒便醉，交遊宴樂不隔也。',
      literal: 'Dian was regularly content; when he met wine he at once became drunk, yet social gatherings and feasting were not interrupted.',
      idiomatic: 'Dian was regularly content; when wine was present he at once became drunk, yet he did not cut himself off from social gatherings and feasting.',
    },
    {
      zh: '永元中，京師頻有軍寇，點嘗結裳爲袴，與崔慧景共論佛義，其語默之迹如此。',
      literal: 'During Yongyuan, military raids frequently struck the capital; Dian once tied his robe into trousers and with Cui Huijing jointly discussed Buddhist doctrine—his traces in speech and silence were like this.',
      idiomatic: 'During the Yongyuan era, military raids frequently struck the capital; Dian once tied his robe into trousers and with Cui Huijing discussed Buddhist doctrine—his manner in speech and silence was like this.',
    },
  ],
  'source-nanqishu-054-wikisource-4a956e10fe16': [
    {
      zh: '吳苞字天蓋，濮陽鄄城人也。',
      literal: 'Wu Bao, styled Tiangai, was a native of Juancheng in Puyang.',
      idiomatic: 'Wu Bao, courtesy name Tiangai, came from Juancheng in Puyang Commandery.',
    },
    {
      zh: '儒學，善《三禮》及《老》、《莊》。',
      literal: 'He studied Confucian learning and was skilled in the Three Rites as well as the Laozi and Zhuangzi.',
      idiomatic: 'He studied Confucian learning and was accomplished in the Three Rites as well as the Laozi and Zhuangzi.',
    },
    {
      zh: '宋泰始中，過江聚徒教學。',
      literal: 'During the Taishi era of Song he crossed the river, gathered disciples, and taught.',
      idiomatic: 'During the Taishi era of Song he crossed the Yangzi, gathered disciples, and taught.',
    },
    {
      zh: '冠黃葛巾，竹麈尾，蔬食二十餘年。',
      literal: 'He wore a yellow hemp cap and carried a bamboo fly-whisk, eating vegetables for more than twenty years.',
      idiomatic: 'He wore a yellow hemp cap and carried a bamboo fly-whisk, living on vegetables for more than twenty years.',
    },
    {
      zh: '隆昌元年，詔曰：「處士濮陽吳苞，栖志穹谷，秉操貞固，沈情味古，白首彌厲。',
      literal: 'In the first year of Longchang, an edict said: "The recluse Wu Bao of Puyang dwells in will among lofty valleys, holds steadfast integrity, immerses his feelings in savoring antiquity, and grows ever sterner in white-haired age.',
      idiomatic: 'In the first year of Longchang, an edict said: "The recluse Wu Bao of Puyang dwells in will among lofty valleys, holds steadfast integrity, immerses himself in savoring antiquity, and grows ever sterner in his white-haired years.',
    },
    {
      zh: '徵太學博士。',
      literal: 'Summon him as Erudite of the Imperial University.',
      idiomatic: 'Summon him as Erudite of the Imperial University.',
    },
    {
      zh: '」不就。',
      literal: '" He did not accept.',
      idiomatic: '" He declined.',
    },
    {
      zh: '始安王遙光、右衞江祏於蔣山南爲立館，自劉瓛卒後，學者咸歸之。',
      literal: 'Prince Shi\'an Yao Guang and Jiang Shi, Defender of the Right, built a lodge for him south of Mount Jiang; after Liu Huan died, scholars all turned to him.',
      idiomatic: 'Prince Shi\'an Yao Guang and Jiang Shi, Defender of the Right, built a lodge for him south of Mount Jiang; after Liu Huan died, scholars all turned to him.',
    },
    {
      zh: '以壽終。',
      literal: 'He ended his life in full years.',
      idiomatic: 'He died at a full old age.',
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
  if (id === 'source-nanqishu-054-wikisource-b0eb14db1284') {
    item.localRange = null;
  }
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied nanqishu/054 source correspondence omissions.');
