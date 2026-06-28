#!/usr/bin/env node
/**
 * Patch manualTranslations for mingshi/270 source-correspondence omissions.
 */

import fs from 'node:fs';

const QUEUE_PATH = 'data/quality/source-correspondence-corpus-wikisource-mingshi.json';
const META = {
  translator: 'Garrett M. Petersen (2026)',
  model: 'Composer 2.5',
};

function withMeta(rows) {
  return rows.map((row) => ({ ...row, ...META }));
}

const QIN_LIANGYU_OMISSION = withMeta([
  {
    zh: '泰昌時，征其兵援遼。',
    literal: 'During the Taichang reign, her troops were called out to reinforce Liaodong.',
    idiomatic: 'During the Taichang reign, her troops were mobilized to reinforce Liaodong.',
  },
  {
    zh: '良玉遣兄邦屏、弟民屏先以數千人往。',
    literal: 'Liangyu sent her elder brother Bangping and younger brother Minping ahead with several thousand men.',
    idiomatic: 'Liangyu sent her elder brother Bangping and younger brother Minping ahead with several thousand troops.',
  },
  {
    zh: '朝命賜良玉三品服，授邦屏都司僉書，民屏守備。',
    literal: 'The court ordered that Liangyu be granted third-rank robes; Bangping was appointed Vice Director of the Military Commission, and Minping was made Defending Commander.',
    idiomatic: 'The court granted Liangyu third-rank robes and appointed Bangping Vice Director of the Military Commission and Minping Defending Commander.',
  },
  {
    zh: '天啟元年，邦屏渡渾河戰死，民屏突圍出。',
    literal: 'In the first year of Tianqi, Bangping crossed the Hun River and died in battle; Minping broke out of the encirclement.',
    idiomatic: 'In Tianqi one Bangping crossed the Hun River and fell in battle; Minping broke out of the encirclement.',
  },
  {
    zh: '良玉自統精卒三千赴之，所過秋毫無犯。',
    literal: 'Liangyu personally led three thousand crack troops to the scene and harmed not a hair along the way.',
    idiomatic: 'Liangyu personally led three thousand crack troops to the scene and allowed no harm along the route.',
  },
  {
    zh: '詔加二品服，即予封誥。',
    literal: 'An edict granted her second-rank robes and immediately bestowed a patent of enfeoffment.',
    idiomatic: 'An edict granted her second-rank robes and immediately bestowed a patent of enfeoffment.',
  },
  {
    zh: '子祥麟授指揮使。',
    literal: 'Her son Xianglin was appointed Commander.',
    idiomatic: 'Her son Xianglin was appointed commander.',
  },
  {
    zh: '良玉陳邦屏死狀，請優恤。',
    literal: 'Liangyu reported Bangping\'s death and petitioned for special condolence honors.',
    idiomatic: 'Liangyu reported Bangping\'s death and petitioned for special posthumous honors.',
  },
  {
    zh: '因言：「臣自征播以來，所建之功，不滿讒妒口，貝錦高張，忠誠孰表。」',
    literal: 'She added: "Since I campaigned against Bozhou, the merit I have achieved cannot fill the mouths of the slanderous and jealous; woven calumny flies everywhere—who will show my loyalty?"',
    idiomatic: 'She added: "Since I campaigned against Bozhou, the merit I have won cannot satisfy the mouths of the jealous and slanderous; woven calumny flies everywhere—who will attest to my loyalty?"',
  },
  {
    zh: '帝優詔報之。',
    literal: 'The Emperor responded with a gracious edict.',
    idiomatic: 'The Emperor answered with a gracious edict.',
  },
  {
    zh: '兵部尚書張鶴鳴言：「渾河血戰，首功數千，實石砫、酉陽二土司功。',
    literal: 'Minister of War Zhang Heming said: "In the bloody battle at the Hun River the credited heads numbered several thousand; the credit truly belongs to the two native-official districts of Shizhu and Youyang.',
    idiomatic: 'Minister of War Zhang Heming said: "In the bloody battle at the Hun River the credited heads numbered several thousand; the credit truly belongs to the two native-official districts of Shizhu and Youyang.',
  },
  {
    zh: '邦屏既歿，良玉即遣使入都，制冬衣一千五百，分給殘卒，而身督精兵三千抵榆關。',
    literal: 'After Bangping died, Liangyu immediately sent an envoy to the capital, had fifteen hundred winter garments made and distributed to the survivors, and personally led three thousand crack troops to Yuguan.',
    idiomatic: 'After Bangping fell, Liangyu immediately sent an envoy to the capital, had fifteen hundred winter garments made for the survivors, and personally led three thousand crack troops to Yuguan.',
  },
  {
    zh: '上急公家難，下復私門仇，氣甚壯。',
    literal: 'She showed urgency for the state\'s crisis above and avenged her family\'s wrong below—the spirit was most impressive.',
    idiomatic: 'She showed urgency for the state\'s crisis above and avenged her family\'s loss below—her spirit was most impressive.',
  },
  {
    zh: '宜錄邦屏子，進民屏官。」',
    literal: 'Bangping\'s son should be recorded for honors, and Minping\'s rank should be advanced."',
    idiomatic: 'Bangping\'s son should be recorded for honors, and Minping\'s rank should be advanced."',
  },
  {
    zh: '乃贈邦屏都督僉事，錫世蔭，與陳策等合祠；',
    literal: 'Bangping was posthumously granted Vice Commissioner-in-chief, given hereditary honors, and jointly enshrined with Chen Ce and others;',
    idiomatic: 'Bangping was posthumously granted Vice Commissioner-in-chief, given hereditary honors, and jointly enshrined with Chen Ce and others;',
  },
  {
    zh: '民屏進都司僉書。',
    literal: 'and Minping was promoted to Vice Director of the Military Commission.',
    idiomatic: 'and Minping was promoted to Vice Director of the Military Commission.',
  },
]);

const SHEN_YOURONG_OMISSION = withMeta([
  {
    zh: '泰昌元年，遼事棘，始設山東副總兵，駐登州，以命有容。',
    literal: 'In the first year of Taichang, when Liaodong affairs were critical, the post of deputy regional commander of Shandong was established at Dengzhou, and Yourong was appointed to it.',
    idiomatic: 'In Taichang one, when Liaodong affairs were critical, the post of deputy regional commander of Shandong was established at Dengzhou and Yourong was appointed to it.',
  },
  {
    zh: '天啟改元，遼、瀋相繼覆。',
    literal: 'When the reign title changed to Tianqi, Liaoyang and Shenyang fell in succession.',
    idiomatic: 'When the reign title changed to Tianqi, Liaoyang and Shenyang fell in succession.',
  },
  {
    zh: '熊廷弼建三方布置之議，以陶朗先巡撫登、萊，而擢有容都督僉事，充總兵官，登、萊遂為重鎮。',
    literal: 'Xiong Tingbi proposed the tripartite deployment scheme, appointing Tao Langxian circuit intendant of Deng and Lai, and promoting Yourong to Vice Commissioner-in-chief as overall commander; Deng and Lai then became key strongholds.',
    idiomatic: 'Xiong Tingbi proposed the tripartite deployment scheme, made Tao Langxian circuit intendant of Deng and Lai, and promoted Yourong to Vice Commissioner-in-chief as overall commander; Deng and Lai then became major strongholds.',
  },
  {
    zh: '八月，毛文龍有鎮江之捷。',
    literal: 'In the eighth month, Mao Wenlong won a victory at Zhenjiang.',
    idiomatic: 'In the eighth month Mao Wenlong won a victory at Zhenjiang.',
  },
  {
    zh: '詔有容統水師萬，偕天津水師直抵鎮江策應。',
    literal: 'An edict ordered Yourong to command ten thousand naval troops, join the Tianjin fleet, and proceed straight to Zhenjiang in support.',
    idiomatic: 'An edict ordered Yourong to command ten thousand naval troops, join the Tianjin fleet, and sail straight to Zhenjiang in support.',
  },
  {
    zh: '有容嘆曰：「率一旅之師，當方張之敵，吾知其不克濟也。」',
    literal: 'Yourong sighed: "Leading a single column against a foe in full expansion—I know this cannot succeed."',
    idiomatic: 'Yourong sighed: "Leading a single column against a foe at full strength—I know this cannot succeed."',
  },
  {
    zh: '無何，鎮江果失，水師遂不進。',
    literal: 'Before long Zhenjiang indeed fell, and the fleet did not advance.',
    idiomatic: 'Before long Zhenjiang indeed fell, and the fleet did not advance.',
  },
  {
    zh: '明年，廣寧覆，遼民走避諸島，日望登師救援。',
    literal: 'The next year Guangning fell; Liaodong people fled to the islands and daily awaited rescue from the Dengzhou army.',
    idiomatic: 'The next year Guangning fell; Liaodong people fled to the islands and daily awaited rescue from the Dengzhou army.',
  },
  {
    zh: '朗先下令，敢渡一人者斬。',
    literal: 'Langxian ordered that anyone who dared ferry a single person be executed.',
    idiomatic: 'Langxian ordered that anyone who ferried even one person across be executed.',
  },
  {
    zh: '有容爭之，立命數十艘往，獲濟者數萬人。',
    literal: 'Yourong argued against it and immediately ordered several dozen boats to go, saving tens of thousands.',
    idiomatic: 'Yourong protested and immediately ordered several dozen boats to go, saving tens of thousands.',
  },
  {
    zh: '時金、復、蓋三衛俱空無人，有欲據守金州者。',
    literal: 'At the time the three garrisons of Jin, Fu, and Gai were all empty; some wished to hold Jinzhou.',
    idiomatic: 'At the time the three garrisons of Jin, Fu, and Gai were all empty, and some wished to hold Jinzhou.',
  },
  {
    zh: '有容言金州孤懸海外，登州、皮島俱遠隔大洋，聲援不及，不可守。',
    literal: 'Yourong said Jinzhou stood isolated beyond the sea; Dengzhou and Pidao were both far across the ocean, beyond reach of support—it could not be held.',
    idiomatic: 'Yourong said Jinzhou stood isolated beyond the sea; Dengzhou and Pidao were both far across the ocean and beyond reach of support, so it could not be held.',
  },
  {
    zh: '迨文龍取金州，未幾復失。',
    literal: 'When Wenlong took Jinzhou, before long it was lost again.',
    idiomatic: 'When Wenlong took Jinzhou, before long it was lost again.',
  },
  {
    zh: '四年，有容以年老乞骸骨，歸，卒。',
    literal: 'In the fourth year Yourong petitioned to retire on grounds of age, returned home, and died.',
    idiomatic: 'In the fourth year Yourong petitioned to retire on grounds of age, returned home, and died.',
  },
  {
    zh: '贈都督同知，賜祭葬。',
    literal: 'He was posthumously granted Associate Commissioner-in-chief and granted sacrificial honors and burial.',
    idiomatic: 'He was posthumously granted Associate Commissioner-in-chief and granted sacrificial honors and burial.',
  },
]);

const ZHANG_KEDA_OMISSION = withMeta([
  {
    zh: '舟山，宋昌國城也，居海中，有七十二墺，為浙東要害。',
    literal: 'Zhoushan, the city of Changguo of the Song dynasty, lies in the sea with seventy-two islets and was a key point of Zhedong.',
    idiomatic: 'Zhoushan, the Song city of Changguo, lies in the sea with seventy-two islets and was a key point of eastern Zhejiang.',
  },
  {
    zh: '可大條上八議，皆碩畫。',
    literal: 'Keda submitted eight proposals in memorial, all far-sighted plans.',
    idiomatic: 'Keda submitted eight proposals in memorial, all far-sighted plans.',
  },
  {
    zh: '倭犯五罩湖、白沙港、茶山，潭頭，連敗之，加副總兵。',
    literal: 'When Japanese raiders struck Wuzhao Lake, Baisha Harbor, Chashan, and Tantou, he repeatedly defeated them and was promoted to deputy regional commander.',
    idiomatic: 'When Japanese raiders struck Wuzhao Lake, Baisha Harbor, Chashan, and Tantou, he repeatedly defeated them and was promoted to deputy regional commander.',
  },
  {
    zh: '城久圮，可大與副使蔡獻臣築之，兩月工竣。',
    literal: 'The city walls had long been ruined; Keda and Vice Commissioner Cai Xianchen rebuilt them, completing the work in two months.',
    idiomatic: 'The city walls had long been ruined; Keda and Vice Commissioner Cai Xianchen rebuilt them and finished the work in two months.',
  },
  {
    zh: '城內外田數千畝，海潮害稼。',
    literal: 'Several thousand mu of fields inside and outside the walls suffered damage from sea tides.',
    idiomatic: 'Several thousand mu of fields inside and outside the walls suffered damage from sea tides.',
  },
  {
    zh: '可大築碶蓄淡水，遂為膏腴。',
    literal: 'Keda built a barrage to store fresh water, and the land became fertile.',
    idiomatic: 'Keda built a barrage to store fresh water, and the land became fertile.',
  },
  {
    zh: '民稱曰：「張公碶」。',
    literal: 'The people called it "Commander Zhang\'s Barrage."',
    idiomatic: 'The people called it "Commander Zhang\'s Barrage."',
  },
  {
    zh: '天啟元年以都指揮使掌南京錦衣衛。',
    literal: 'In the first year of Tianqi he was made Commander and took charge of the Nanjing Embroidered Uniform Guard.',
    idiomatic: 'In Tianqi one he was made commander and took charge of the Nanjing Embroidered Uniform Guard.',
  },
  {
    zh: '六年擢都督僉事，僉書南京右府。',
    literal: 'In the sixth year he was promoted to Vice Commissioner-in-chief and served as secretary in the Nanjing Right Military Commission.',
    idiomatic: 'In the sixth year he was promoted to Vice Commissioner-in-chief and served as secretary in the Nanjing Right Military Commission.',
  },
  {
    zh: '崇禎元年出為登萊總兵官。',
    literal: 'In the first year of Chongzhen he was appointed overall commander of Deng-Lai.',
    idiomatic: 'In Chongzhen one he was appointed overall commander of Deng-Lai.',
  },
  {
    zh: '會議裁登、萊撫鎮，乃命以總兵官視登州副總兵事，而巡撫遂罷不設。',
    literal: 'When the court deliberated on cutting the Deng-Lai circuit intendant and regional commander posts, he was ordered to serve as overall commander with the duties of deputy regional commander at Dengzhou, and the circuit intendant post was abolished.',
    idiomatic: 'When the court deliberated on cutting the Deng-Lai circuit intendant and regional commander posts, he was ordered to serve as overall commander with the duties of deputy regional commander at Dengzhou, and the circuit intendant post was abolished.',
  },
  {
    zh: '可大盡心海防，親歷巡視，圖沿海地形、兵力強弱，為《海防圖說》上之。',
    literal: 'Keda devoted himself to coastal defense, personally toured the defenses, mapped coastal terrain and troop strengths, and submitted his Illustrated Treatise on Coastal Defense.',
    idiomatic: 'Keda devoted himself to coastal defense, personally toured the defenses, mapped coastal terrain and troop strengths, and submitted his Illustrated Treatise on Coastal Defense.',
  },
  {
    zh: '二年冬，白蓮賊余黨圍萊陽，可大擊破之，焚其六砦，斬偽國公二人，圍遂解。',
    literal: 'In the winter of the second year White Lotus remnant bandits besieged Laiyang; Keda defeated them, burned six stockades, beheaded two self-styled dukes, and lifted the siege.',
    idiomatic: 'In the winter of the second year White Lotus remnant bandits besieged Laiyang; Keda defeated them, burned six stockades, beheaded two self-styled dukes, and lifted the siege.',
  },
  {
    zh: '京師被兵，可大入衛，守西直、廣寧諸門。',
    literal: 'When the capital came under attack, Keda entered to defend it and held the Xizhi, Guangning, and other gates.',
    idiomatic: 'When the capital came under attack, Keda entered to defend it and held the Xizhi, Guangning, and other gates.',
  },
  {
    zh: '明年，以勤王功，升都督同知。',
    literal: 'The next year, for his merit in relieving the throne, he was promoted to Associate Commissioner-in-chief.',
    idiomatic: 'The next year, for his merit in relieving the throne, he was promoted to Associate Commissioner-in-chief.',
  },
]);

const LU_QIN_OMISSION = withMeta([
  {
    zh: '魯欽，長清人。',
    literal: 'Lu Qin was a native of Changqing.',
    idiomatic: 'Lu Qin was a native of Changqing.',
  },
  {
    zh: '萬歷中，歷山西副總兵。',
    literal: 'During the Wanli reign he served as deputy regional commander of Shanxi.',
    idiomatic: 'During the Wanli reign he served as deputy regional commander of Shanxi.',
  },
  {
    zh: '天啟元年遷神機營左副將。',
    literal: 'In the first year of Tianqi he was transferred to Left Deputy Commander of the Divine Engine Corps.',
    idiomatic: 'In Tianqi one he was transferred to Left Deputy Commander of the Divine Engine Corps.',
  },
  {
    zh: '尋擢署都督僉事，充保定總兵官。',
    literal: 'Soon he was promoted to Acting Vice Commissioner-in-chief and installed as overall commander of Baoding.',
    idiomatic: 'Soon he was promoted to Acting Vice Commissioner-in-chief and installed as overall commander of Baoding.',
  },
  {
    zh: '奢崇明、安邦彥並反，貴州總兵張彥方在圍中，而總理杜文煥稱病。',
    literal: 'When She Chongming and An Bangyan both rebelled, Guizhou overall commander Zhang Yanfang was trapped in a siege and overall manager Du Wenhuan claimed illness.',
    idiomatic: 'When She Chongming and An Bangyan both rebelled, Guizhou overall commander Zhang Yanfang was trapped in a siege and overall manager Du Wenhuan claimed illness.',
  },
  {
    zh: '明年十月用欽代文煥，命總川、忠、湖廣漢土軍刻期解圍。',
    literal: 'In the tenth month of the next year Qin replaced Wenhuan and was ordered to gather Han and native troops from Chuan, Zhong, and Huguang to relieve the siege on schedule.',
    idiomatic: 'In the tenth month of the next year Qin replaced Wenhuan and was ordered to gather Han and native troops from Chuan, Zhong, and Huguang to relieve the siege on schedule.',
  },
  {
    zh: '未至，圍已解，欽馳赴貴陽。',
    literal: 'Before he arrived the siege was already lifted; Qin raced to Guiyang.',
    idiomatic: 'Before he arrived the siege was already lifted; Qin raced to Guiyang.',
  },
  {
    zh: '三年正月，巡撫王三善大敗於陸廣，群苗宋萬化、何中尉等蜂起。',
    literal: 'In the first month of the third year circuit intendant Wang San Shan suffered a great defeat at Luguang; tribal leaders Song Wanhua, He Zhongwei, and others rose in swarms.',
    idiomatic: 'In the first month of the third year circuit intendant Wang San Shan suffered a great defeat at Luguang; tribal leaders Song Wanhua, He Zhongwei, and others rose in swarms.',
  },
  {
    zh: '欽佐三善防剿，率諸將擒中尉、萬化，遂進營紅崖。',
    literal: 'Qin assisted San Shan in defense and suppression, led the generals to capture Zhongwei and Wanhua, then advanced to camp at Hongya.',
    idiomatic: 'Qin assisted San Shan in defense and suppression, led the generals to capture Zhongwei and Wanhua, then advanced to camp at Hongya.',
  },
  {
    zh: '紅崖者，崇明敗走處也。',
    literal: 'Hongya was where Chongming had fled in defeat.',
    idiomatic: 'Hongya was where Chongming had fled in defeat.',
  },
  {
    zh: '三善謀大舉深入，欽及總兵官馬炯、張彥方，諸道監司尹伸、嶽具仰、向日升、楊世賞各以兵從，五戰，斬首萬八千，直抵大方。',
    literal: 'San Shan planned a major advance deep into enemy territory; Qin, overall commanders Ma Jiong and Zhang Yanfang, and circuit overseers Yin Shen, Yue Juyang, Xiang Risheng, and Yang Shishang each brought troops along; in five battles they beheaded eighteen thousand and pressed straight to Dafang.',
    idiomatic: 'San Shan planned a major advance deep into enemy territory; Qin, overall commanders Ma Jiong and Zhang Yanfang, and circuit overseers Yin Shen, Yue Juyang, Xiang Risheng, and Yang Shishang each brought troops along; in five battles they beheaded eighteen thousand and pressed straight to Dafang.',
  },
  {
    zh: '四年正月，三善敗歿於內莊，欽等以殘卒還。',
    literal: 'In the first month of the fourth year San Shan was defeated and died at Neizhuang; Qin and the others returned with the remnants.',
    idiomatic: 'In the first month of the fourth year San Shan was defeated and died at Neizhuang; Qin and the others returned with the remnants.',
  },
  {
    zh: '命戴罪辦賊。',
    literal: 'They were ordered to pursue the bandits while under penalty for their failures.',
    idiomatic: 'They were ordered to pursue the bandits while serving under penalty for their failures.',
  },
]);

const MA_SHILONG_OMISSION = withMeta([
  {
    zh: '崇禎元年，王在晉為尚書。',
    literal: 'In the first year of Chongzhen Wang Zaijin was made Minister.',
    idiomatic: 'In Chongzhen one Wang Zaijin was made Minister.',
  },
  {
    zh: '世龍上疏極論其罪，有詔逮世龍，久不至。',
    literal: 'Shilong submitted a memorial vehemently denouncing his guilt; an edict was issued to arrest Shilong, but he did not come for a long time.',
    idiomatic: 'Shilong submitted a memorial vehemently denouncing his guilt; an edict was issued to arrest Shilong, but he did not come for a long time.',
  },
  {
    zh: '在晉罷，始詣獄。',
    literal: 'When Zaijin was dismissed, he then presented himself at prison.',
    idiomatic: 'When Zaijin was dismissed, Shilong then presented himself at prison.',
  },
  {
    zh: '二年冬，都城戒嚴。',
    literal: 'In the winter of the second year the capital was placed under martial law.',
    idiomatic: 'In the winter of the second year the capital was placed under martial law.',
  },
  {
    zh: '刑部尚書喬允升薦世龍才，詔圖功自贖。',
    literal: 'Minister of Justice Qiao Yunsheng recommended Shilong\'s ability; an edict permitted him to redeem himself through merit.',
    idiomatic: 'Minister of Justice Qiao Yunsheng recommended Shilong\'s ability; an edict permitted him to redeem himself through merit.',
  },
  {
    zh: '會祖大壽師潰，京師大震。',
    literal: 'Just then Dazhou\'s army collapsed and the capital was greatly shaken.',
    idiomatic: 'Just then Dazhou\'s army collapsed and the capital was greatly shaken.',
  },
  {
    zh: '承宗再起督師，以便宜遣世龍馳諭大壽聽命。',
    literal: 'Chengzong was again made supreme commander and dispatched Shilong at discretion to ride and command Dazhou to obey orders.',
    idiomatic: 'Chengzong was again made supreme commander and dispatched Shilong at discretion to ride and command Dazhou to obey orders.',
  },
  {
    zh: '及滿桂戰死，遂令世龍代為總理，賜尚方劍，盡統諸鎮援師。',
    literal: 'When Man Gui died in battle, Shilong was then appointed overall manager in his place, granted the imperial sword, and given command over all relief armies from the garrisons.',
    idiomatic: 'When Man Gui died in battle, Shilong was then appointed overall manager in his place, granted the imperial sword, and given command over all relief armies from the garrisons.',
  },
]);

const patches = {
  'source-mingshi-270-wikisource-1b02624fdd68': {
    manualTranslations: QIN_LIANGYU_OMISSION,
  },
  'source-mingshi-270-wikisource-7bb451be8e5f': {
    manualTranslations: SHEN_YOURONG_OMISSION,
  },
  'source-mingshi-270-wikisource-b244bedec31a': {
    manualTranslations: ZHANG_KEDA_OMISSION,
  },
  'source-mingshi-270-wikisource-e677125fd751': {
    manualTranslations: LU_QIN_OMISSION,
  },
  'source-mingshi-270-wikisource-e962ab4d4088': {
    manualTranslations: MA_SHILONG_OMISSION,
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
let patched = 0;

for (const [itemId, patch] of Object.entries(patches)) {
  const item = queue.items.find((row) => row.id === itemId);
  if (!item) throw new Error(`Queue item not found: ${itemId}`);
  item.manualTranslations = patch.manualTranslations;
  patched += 1;
  console.log(`Patched ${itemId} (${patch.manualTranslations.length} translations).`);
}

queue.updatedAt = new Date().toISOString();
fs.writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Patched manualTranslations for ${patched} mingshi/270 source item(s).`);
