#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-liaoshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-liaoshi-084-wikisource-aaad865630df': [
    {
      zh: '耶律抹只，字留隱，仲父隋國王之後。',
      literal: 'Yelu Mozhi, courtesy name Liuyin, was of the younger line of the King of Sui.',
      idiomatic: 'Yelu Mozhi, whose courtesy name was Liuyin, was of the younger line of the King of Sui.',
    },
    {
      zh: '初以皇族入侍。',
      literal: 'At first he entered attendance by virtue of imperial clan status.',
      idiomatic: 'He first entered palace service as a member of the imperial clan.',
    },
    {
      zh: '景宗即位，為林牙，以幹給稱。',
      literal: 'When Emperor Jingzong took the throne, he became linya and was praised for resourceful service.',
      idiomatic: 'When Emperor Jingzong acceded, he was made linya and won repute for resourceful service.',
    },
    {
      zh: '保寧間，遷樞密副使。',
      literal: 'During Baoning he was transferred to vice privy commissioner.',
      idiomatic: 'In the Baoning period he was promoted to vice privy commissioner.',
    },
    {
      zh: '乾亨元年春，宋攻河東，南府宰相耶律沙為都統，將兵往援，抹只臨其軍。',
      literal: 'In spring of the first year of Qianheng, Song attacked Hedong; the Southern Chancellor Yelu Sha served as supreme commander, led troops to relieve it, and Mozhi supervised his army.',
      idiomatic: 'In the spring of the first year of Qianheng, when the Song attacked Hedong, Southern Chancellor Yelu Sha was made supreme commander and marched to its relief; Mozhi supervised the army.',
    },
    {
      zh: '及白馬嶺之敗，僅以身免。',
      literal: 'At the defeat at White Horse Ridge he barely escaped with his life.',
      idiomatic: 'After the defeat at White Horse Ridge he barely escaped with his life.',
    },
    {
      zh: '宋乘銳攻燕，將奚兵翊休哥擊敗之。',
      literal: 'The Song, riding their momentum, attacked Yan; leading Xi troops he assisted Xiuge and defeated them.',
      idiomatic: 'The Song, emboldened by their momentum, thrust into Yan; Mozhi led Xi troops to assist Yelu Xiuge and routed them.',
    },
    {
      zh: '上以功釋前過。',
      literal: 'The emperor, for this merit, released his earlier fault.',
      idiomatic: 'The emperor pardoned his earlier failures in light of this success.',
    },
    {
      zh: '是年冬，從都統韓匡嗣伐宋，戰於滿城，為宋將所紿，諸軍奔潰；',
      literal: 'That winter he followed the supreme commander Han Kuangsi in attacking Song and fought at Mancheng; deceived by a Song general, the armies broke in rout;',
      idiomatic: 'That winter he followed Supreme Commander Han Kuangsi against the Song and fought at Mancheng; tricked by a Song commander, the armies broke in rout;',
    },
    {
      zh: '獨抹只部伍不亂，徐整旗鼓而歸。',
      literal: 'only Mozhi\u2019s ranks did not fall into disorder, and he slowly reformed banners and drums and returned.',
      idiomatic: 'only Mozhi\u2019s unit held its formation, and he slowly reformed his banners and drums and withdrew in order.',
    },
    {
      zh: '璽書褒諭，改南海軍節度使。',
      literal: 'An imperial edict in seal script commended and instructed him, and he was transferred to Military Commissioner of the Nanhai Army.',
      idiomatic: 'An imperial commendation arrived in seal script, and he was made Military Commissioner of the Nanhai Army.',
    },
    {
      zh: '乾亨二年，拜樞密副使。',
      literal: 'In the second year of Qianheng he was appointed vice privy commissioner.',
      idiomatic: 'In the second year of Qianheng he was appointed vice privy commissioner.',
    },
    {
      zh: '統和初，為東京留守。',
      literal: 'At the beginning of Tonghe he became regent of the Eastern Capital.',
      idiomatic: 'Early in Tonghe he was made regent of the Eastern Capital.',
    },
    {
      zh: '宋將曹彬、米信等侵邊，抹只引兵至南京，先繕守禦備。',
      literal: 'When the Song generals Cao Bin, Mi Xin, and others invaded the frontier, Mozhi led troops to Nanjing and first repaired defenses and preparations.',
      idiomatic: 'When the Song generals Cao Bin, Mi Xin, and others invaded the frontier, Mozhi marched to Nanjing and first strengthened the city\u2019s defenses.',
    },
    {
      zh: '及車駕臨幸，抹只與耶律休哥逆戰於涿之東，克之，遷開遠軍節度使。',
      literal: 'When the imperial carriage arrived on inspection, Mozhi together with Yelu Xiuge met the enemy in battle east of Zhuo, took it, and was transferred to Military Commissioner of Kaiyuan Army.',
      idiomatic: 'When the emperor arrived on inspection, Mozhi and Yelu Xiuge gave battle east of Zhuo, carried the day, and Mozhi was transferred to Military Commissioner of Kaiyuan Army.',
    },
    {
      zh: '故事，州民歲輸稅，鬥粟折錢五，抹只表請折錢六，部民便之。',
      literal: 'By precedent the commandery people paid yearly taxes with each dou of grain converted at five cash; Mozhi memorialized requesting conversion at six cash, and the people of the division found it convenient.',
      idiomatic: 'By precedent the people of the commandery paid yearly taxes with each dou of grain valued at five cash; Mozhi memorialized to raise the rate to six cash, and the people welcomed the change.',
    },
    {
      zh: '統和末卒。',
      literal: 'At the end of Tonghe he died.',
      idiomatic: 'He died late in the Tonghe reign.',
    },
  ],
  'source-liaoshi-084-wikisource-e7598971f7e0': [
    {
      zh: '耶律海裏，字留隱，令穩拔裏得之長子。',
      literal: 'Yelu Haili, courtesy name Liuyin, was the eldest son of the lingwen Balede.',
      idiomatic: 'Yelu Haili, whose courtesy name was Liuyin, was the eldest son of the lingwen Balede.',
    },
    {
      zh: '察割之亂，其母的魯與焉。',
      literal: 'During Chagai\u2019s rebellion, his mother Dilu took part in it.',
      idiomatic: 'During Chagai\u2019s rebellion, his mother Dilu was involved.',
    },
    {
      zh: '遣人召海裏，海裏拒之。',
      literal: 'They sent someone to summon Haili, and Haili refused.',
      idiomatic: 'Chagai\u2019s faction sent envoys to summon Haili, but he refused.',
    },
    {
      zh: '亂平，的魯以子故獲免。',
      literal: 'When the rebellion was pacified, Dilu was spared because of her son.',
      idiomatic: 'After the rebellion was suppressed, Dilu was spared on account of her son.',
    },
    {
      zh: '海裏儉素，不喜聲利，以射獵自娛。',
      literal: 'Haili was frugal and plain, disliked sound and profit, and amused himself with archery and hunting.',
      idiomatic: 'Haili lived frugally and plainly, cared nothing for luxury or gain, and amused himself with archery and hunting.',
    },
    {
      zh: '雖居閑，人敬之若貴官然。',
      literal: 'Although he lived in retirement, people respected him as if he were a noble official.',
      idiomatic: 'Though he lived in retirement, people treated him with the respect due a high official.',
    },
    {
      zh: '保寧初，拜彰國軍節度使，遷惕隱。',
      literal: 'At the beginning of Baoning he was appointed Military Commissioner of the Zhangguo Army and transferred to tiyin.',
      idiomatic: 'Early in Baoning he was made Military Commissioner of the Zhangguo Army and then promoted to tiyin.',
    },
    {
      zh: '秩滿，稱疾不仕。',
      literal: 'When his term expired, he pleaded illness and would not serve.',
      idiomatic: 'When his term expired, he pleaded illness and declined further office.',
    },
    {
      zh: '久之，復為南院大王。',
      literal: 'After a long time he again became Great King of the Southern Office.',
      idiomatic: 'After some years he was again made Great King of the Southern Office.',
    },
    {
      zh: '及曹彬、米信等來侵，海裏有卻敵功，賜資忠保義匡國功臣。',
      literal: 'When Cao Bin, Mi Xin, and others came to invade, Haili had merit in repelling the enemy and was granted the title Meritous Minister Loyal in Purpose, Righteous in Conduct, and Stabilizing the State.',
      idiomatic: 'When Cao Bin, Mi Xin, and others invaded, Haili distinguished himself in repelling the enemy and was granted the title Meritous Minister Loyal in Purpose, Righteous in Conduct, and Stabilizing the State.',
    },
    {
      zh: '帝屢親征，海裏在南院十餘年，鎮以寬靜，戶口增給，時議重之。',
      literal: 'The emperor repeatedly campaigned in person; Haili was in the Southern Office for more than ten years, governing with lenience and quiet, increasing registered households and provisions, and contemporary opinion esteemed him.',
      idiomatic: 'While the emperor repeatedly took the field in person, Haili spent more than ten years in the Southern Office, governing with lenience and calm; households and provisions increased, and contemporaries held him in high regard.',
    },
    {
      zh: '封漆水郡王，遷上京留守，薨。',
      literal: 'He was enfeoffed as Prince of Qishui, transferred to regent of the Supreme Capital, and died.',
      idiomatic: 'He was enfeoffed as Prince of Qishui, made regent of the Supreme Capital, and died in office.',
    },
    {
      zh: '詔以家貧，給葬具。',
      literal: 'An edict, because his household was poor, granted funeral goods.',
      idiomatic: 'Because his household was poor, an edict granted funeral goods.',
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
  item.notes = 'Restored missing biography text from Wikisource with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied liaoshi/084 source correspondence omissions.');
