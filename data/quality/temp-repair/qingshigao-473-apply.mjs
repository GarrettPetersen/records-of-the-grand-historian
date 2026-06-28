#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-qingshigao.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-qingshigao-473-wikisource-2d4223980533': [
    {
      zh: '權衡重輕，天人交迫，不得已允如所奏，於宣統九年1917年五月十三日臨朝聽政，收回大權，與民更始。',
      literal:
        'Weighing what is heavy and light, pressed by Heaven and men alike, We have no choice but to grant the request as memorialized; on the thirteenth day of the fifth month in the ninth year of Xuantong (1917) We shall attend court and resume rule, reclaim great authority, and make a new beginning with the people.',
      idiomatic:
        'Weighing what matters most, pressed by Heaven and men alike, I have no choice but to grant the request as memorialized; on the thirteenth day of the fifth month in the ninth year of Xuantong (1917) I shall attend court and resume rule, reclaim supreme authority, and make a new beginning with the people.',
    },
  ],
  'source-qingshigao-473-wikisource-5cfd7f18fea3': [
    {
      zh: '*凡我臣民，無論已否剪髮，應遵照宣統三年九月諭旨，悉聽其便。',
      literal:
        '* All Our subjects, whether or not they have cut their hair, shall follow the edict of the ninth month of the third year of Xuantong and be left entirely to their own choice.',
      idiomatic:
        'All my subjects, whether or not they have cut their hair, shall follow the edict of the ninth month of the third year of Xuantong and be left entirely to their own choice.',
    },
  ],
  'source-qingshigao-473-wikisource-c8bdd3b836bf': [
    {
      zh: '丁卯民國十六年，1927，有為年七十，賜「壽」，手疏泣謝，歷敘恩遇及一生艱險狀，悲憤動人。',
      literal:
        'In the dingmao year, the sixteenth year of the Republic, 1927, Kang reached seventy; he was granted the character "Longevity"; he wrote a memorial by hand in tears of thanks, recounting imperial favor and the hardships and dangers of his whole life; grief and indignation moved the reader.',
      idiomatic:
        'In the dingmao year, the sixteenth year of the Republic (1927), Kang turned seventy and was granted the character "Longevity." He wrote a tearful memorial of thanks, recounting the emperor\'s kindness and the hardships of his life—its grief and indignation deeply moving.',
    },
  ],
  'source-qingshigao-473-wikisource-4dd37ecda6d9': [
    {
      zh: '宣統三年，鄂變作，始開黨禁，戊戌政變獲咎者悉原之，於是有為出亡十餘年矣，始謀歸國。',
      literal:
        'In the third year of Xuantong, when the Hubei revolt broke out, the ban on political associations was first lifted; all who had been punished in the Wuxu coup were pardoned; thus Kang Youwei, who had been in exile for more than ten years, now planned to return home.',
      idiomatic:
        'In the third year of Xuantong (1911), when the Hubei uprising broke out, the ban on political associations was lifted and all those punished in the Wuxu coup were pardoned. Kang Youwei, who had been in exile for more than ten years, now planned to return home.',
    },
    {
      zh: '時民軍決行共和，廷議主立憲，而有為創虛君共和之議，以「中國帝制行已數千年，不可驟變，而大清得國最正，歷朝德澤淪浹人心，存帝號以統五族，弭亂息爭，莫順於此」。',
      literal:
        'At the time the revolutionary armies resolved on a republic; court debate favored constitutional monarchy; Kang Youwei proposed the doctrine of republic with a powerless monarch, arguing: "China\'s imperial system has lasted for thousands of years and cannot be changed abruptly; yet the Great Qing gained the realm most rightfully, and the virtue of successive reigns has permeated the people\'s hearts. To preserve the imperial title to unite the five peoples and quell strife is the most fitting course."',
      idiomatic:
        'At the time the revolutionary armies resolved on a republic while court debate favored constitutional monarchy, Kang Youwei advanced the plan of a republic under a powerless monarch, arguing: "China\'s imperial system has lasted for thousands of years and cannot be changed abruptly; yet the Great Qing gained the realm most legitimately, and the virtue of successive reigns has permeated the people\'s hearts. Preserving the imperial title to unite the five peoples and still contention is the most fitting course."',
    },
    {
      zh: '內閣總理大臣袁世凱徇民軍請，決改共和，遂下遜位之詔。',
      literal:
        'Prime Minister Yuan Shikai of the Grand Council yielded to the revolutionary armies\' request, decided to adopt a republic, and issued the abdication edict.',
      idiomatic:
        'Grand Councillor and Prime Minister Yuan Shikai yielded to the revolutionary armies\' demand, decided to adopt a republic, and issued the abdication edict.',
    },
    {
      zh: '有為知空言不足挽阻，思結握兵柄者以自重，頗遊說當局，數年無所就。',
      literal:
        'Kang Youwei knew empty words could not hold back the tide; he thought to ally with those who held military power to strengthen his position, and frequently lobbied those in authority, but for several years achieved nothing.',
      idiomatic:
        'Kang knew that words alone could not hold back the tide. He sought alliances with military leaders to strengthen his position and lobbied those in power for years, but achieved nothing.',
    },
    {
      zh: '丁巳民國六年，1917，張勛復辟，以有為為弼德院副院長。',
      literal:
        'In the dingsi year, the sixth year of the Republic, 1917, Zhang Xun restored the throne; Kang Youwei was made vice president of the Palace Lectures Institute.',
      idiomatic:
        'In the dingsi year, the sixth year of the Republic (1917), Zhang Xun restored the monarchy and made Kang Youwei vice president of the Palace Lectures Institute.',
    },
    {
      zh: '勳議行君主立憲，有為仍主虛君共和。',
      literal:
        'Zhang argued for constitutional monarchy; Kang still advocated republic under a powerless monarch.',
      idiomatic:
        'Zhang argued for constitutional monarchy; Kang still advocated a republic under a powerless monarch.',
    },
    {
      zh: '事變，有為避美國使館，旋脫歸上海。',
      literal:
        'When the affair collapsed, Kang took refuge in the American legation, then escaped and returned to Shanghai.',
      idiomatic:
        'When the restoration collapsed, Kang took refuge in the American legation, then escaped and returned to Shanghai.',
    },
    {
      zh: '甲子民國十三年，1924，移宮事起，修改優待條件，有為馳電以爭，略曰：「優待條件，系大清皇帝與民國臨時政府議定，永久有效，由英使保證，並用正式公文通告各國，以昭大信，無異國際條約。',
      literal:
        'In the jiazi year, the thirteenth year of the Republic, 1924, when the palace removal arose and the terms of favorable treatment were revised, Kang sent an urgent telegram in protest, which in summary read: "The terms of favorable treatment were agreed between the Great Qing emperor and the provisional government of the Republic, permanently valid, guaranteed by the British minister, and formally notified to all countries by official document to manifest great faith, no different from an international treaty.',
      idiomatic:
        'In the jiazi year, the thirteenth year of the Republic (1924), when the palace was to be moved and the terms of favorable treatment were revised, Kang sent an urgent telegram of protest. In essence he wrote: "The terms of favorable treatment were agreed between the Qing emperor and the Republic\'s provisional government. They were meant to remain permanently valid, guaranteed by the British minister and formally notified to all nations—no different from an international treaty.',
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
  if (id === 'source-qingshigao-473-wikisource-4dd37ecda6d9') {
    item.acceptedSourceText = rows.map((row) => row.zh).join('');
  }
  item.status = 'approved';
  item.decision = 'approved';
  item.notes =
    id === 'source-qingshigao-473-wikisource-4dd37ecda6d9'
      ? 'Restored missing Kang Youwei post-Boxer narrative and Republic-era date prefixes from Wikisource.'
      : 'Restored upstream regnal or Republic date prefix omitted from local Chinese.';
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

console.log('Applied qingshigao/473 source correspondence repairs.');
