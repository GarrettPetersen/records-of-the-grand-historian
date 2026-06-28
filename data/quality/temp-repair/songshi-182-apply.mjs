#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-songshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-songshi-182-wikisource-1bd6073f9bc9': [
    {
      zh: '紹聖中，河北官復賣鹽，繼詔如京東法。',
      literal:
        'During the Shaosheng era, Hebei again had the government sell salt, and an edict followed the Jingdong method.',
      idiomatic:
        'During the Shaosheng reign, Hebei resumed government salt sales under an edict matching the Jingdong method.',
    },
    {
      zh: '，崇儀使林豫言：「河北榷鹽，未必敷前日稅額，且契丹鹽益售，慮啟邊隙。',
      literal:
        'Ceremonial Commissioner Lin Yu said: "A Hebei salt monopoly may not meet the former tax quota, and Khitan salt would sell even more freely — I fear this would open a border quarrel.',
      idiomatic:
        'Ceremonial Commissioner Lin Yu said: "Monopolizing Hebei salt may not meet the old tax quota, and Khitan salt would sell even more freely — I fear this would provoke a border clash.',
    },
    {
      zh: '」明年，給事中上官均亦以為言，皆不果行。',
      literal:
        'The next year Remonstrator Shangguan Jun also spoke likewise, but neither proposal was carried out.',
      idiomatic:
        'The following year Remonstrator Shangguan Jun made the same argument, but neither proposal was adopted.',
    },
    {
      zh: '，京畿、四輔及滑州、河陽所產堿地，悉墾為田，革盜刮煎鹽之弊，知河陽王序以勸誘推賞。',
      literal:
        'Alkali lands produced in the capital region, the Four Assists, and Hua and Heyang prefectures were all reclaimed as farmland to end the abuse of illicit scraping and boiling of salt; Wang Xu, prefect of Heyang, was commended for encouragement and inducement.',
      idiomatic:
        'Alkali lands in the capital region, the Four Assists, and Hua and Heyang were all turned to farmland to end illicit salt scraping and boiling; Heyang prefect Wang Xu was rewarded for his encouragement.',
    },
    {
      zh: '三年，大改鹽法，舊稅鹽並易為鈔鹽。',
      literal: 'In the third year the salt law was greatly changed: old taxed salt was all converted to certificate salt.',
      idiomatic: 'In the third year the salt law was overhauled: taxed salt was converted entirely to certificate salt.',
    },
    {
      zh: '凡未賣稅鹽鈔引及已請算或到倉已投暨未投者，並赴榷貨務改給新法鈔引，許通販；',
      literal:
        'All unsold tax-salt certificates and permits, whether already requested and reckoned or delivered to warehouse or not yet delivered, were to go to the Monopoly Goods Office to receive new-law certificates permitting general sale;',
      idiomatic:
        'Unsold tax-salt certificates and all permits already requested, reckoned, delivered, or still pending were to be exchanged at the Monopoly Goods Office for new certificates allowing general sale;',
    },
    {
      zh: '已請舊法稅鹽貨賣者，自陳，更買新鈔帶賣，已請鈔引，毋得帶支。',
      literal:
        'those who had already requested old-law taxed salt for sale were to declare themselves, buy new certificates for tied sale, and those who had already requested certificates were not permitted tied withdrawals.',
      idiomatic:
        'those who had already requested old-law taxed salt for sale had to declare themselves and buy new certificates for tied sale; holders of existing certificates could not make tied withdrawals.',
    },
    {
      zh: '初，茶鹽用換鈔對帶之法，民旅皆病，然河北猶未及也；',
      literal:
        'Initially tea and salt used the exchange-certificate tied-withdrawal method, which travelers all found burdensome, but Hebei had not yet been affected;',
      idiomatic:
        'Tea and salt had long used tied exchange certificates that burdened travelers, but Hebei had not yet been subject to the practice;',
    },
    {
      zh: '至是，並河北、京東行之。',
      literal: 'at this time it was applied in both Hebei and Jingdong.',
      idiomatic: 'now it was extended to both Hebei and Jingdong.',
    },
  ],
  'source-songshi-182-wikisource-d194a43db42f': [
    {
      zh: '，秘書丞直史館孫冕請：「令江南、荊湖通商賣鹽，緣邊折中糧草，在京入納金銀錢帛，則公私皆便，為利實多。',
      literal:
        'Secretariat Assistant Director and Direct Historiographer Sun Mian requested: "Let Jiangnan and Jing-Hu permit free trade in salt; exchange grain and fodder on the frontier, and accept gold, silver, cash, and cloth in the capital — then public and private interests would both be served and the benefit would be great indeed.',
      idiomatic:
        'Secretariat assistant director and direct historiographer Sun Mian proposed: "Allow free salt trade in Jiangnan and Jing-Hu, exchange grain and fodder on the frontier, and accept gold, silver, cash, and cloth in the capital — public and private interests alike would benefit greatly.',
    },
    {
      zh: '設慮淮南因江南、荊湖通商，或至年額稍虧，則國家折中糧草，足贍邊兵；',
      literal:
        'If one feared that Huainan might lose somewhat in annual quota because Jiangnan and Jing-Hu traded freely, then the state could exchange grain and fodder sufficient to supply frontier troops;',
      idiomatic:
        'If Huainan lost some annual quota because Jiangnan and Jing-Hu traded freely, the state could exchange grain and fodder to supply frontier troops;',
    },
    {
      zh: '中納金銀，實之官庫；',
      literal: 'accept gold and silver into the treasury;',
      idiomatic: 'accept gold and silver into the treasury;',
    },
    {
      zh: '且免和雇車乘，差擾民戶，冒寒涉遠。',
      literal: 'and avoid hired carts and draft animals, corvee harassment of households, and travel through cold over long distances.',
      idiomatic: 'and avoid hired transport, corvee burdens on households, and long cold journeys.',
    },
    {
      zh: '借如荊湖運錢萬貫，淮南運米千石，以地裏腳力送至窮邊，則官費民勞，何啻數倍。',
      literal:
        'Suppose Jing-Hu transported ten thousand strings of cash and Huainan transported a thousand piculs of grain, delivering them to the remotest border by distance and porterage — official expense and popular labor would be several times greater.',
      idiomatic:
        'If Jing-Hu shipped ten thousand strings and Huainan a thousand piculs of grain to the remotest border by overland transport, official cost and popular labor would be many times greater.',
    },
    {
      zh: '」詔吏部侍郎陳恕等議。',
      literal: 'An edict ordered Vice Minister of Personnel Chen Shu and others to deliberate.',
      idiomatic: 'The court ordered Vice Minister of Personnel Chen Shu and others to deliberate.',
    },
    {
      zh: '恕等謂：「江、湖官賣鹽，蓋近煮海之地，欲息犯禁之人，今若通商，住賣官鹽，立乏一年課額。',
      literal:
        'Shu and others said: "Official salt sales in Jiang and Hu were meant for regions near the boiling-sea fields, to quiet violators of the prohibition; if free trade is now permitted and official salt sales cease, the annual quota would immediately fall short.',
      idiomatic:
        'Shu and his colleagues replied: "Official salt sales in Jiang and Hu served boiling-sea regions and were meant to suppress smuggling; free trade would halt official sales and immediately leave the annual quota short.',
    },
    {
      zh: '」冕議遂寢。',
      literal: "Mian's proposal was then shelved.",
      idiomatic: "Sun Mian's proposal was shelved.",
    },
    {
      zh: '至天禧初，始募人入緡錢粟帛京師及淮、浙、江南、荊湖州軍易鹽。',
      literal:
        'By the beginning of the Tianxi era, recruitment began for people to pay strings of cash, grain, and cloth into the capital and at Huai, Zhe, Jiangnan, and Jinghu prefectures and armies in exchange for salt.',
      idiomatic:
        'Early in the Tianxi reign, the state began recruiting merchants to pay cash, grain, and cloth in the capital and at Huai, Zhe, Jiangnan, and Jinghu in exchange for salt.',
    },
    {
      zh: '，入錢貨京師總為緡錢一百十四萬。',
      literal: 'Cash paid into the capital totaled 1,140,000 strings.',
      idiomatic: 'Cash paid into the capital totaled 1.14 million strings.',
    },
    {
      zh: '會通、泰煮鹽歲損，所在貯積無幾，因罷入粟帛，第令入錢。',
      literal:
        'As boiling at Tong and Tai suffered annual losses and local stockpiles were slight, payment in grain and cloth was abolished and only cash payment was ordered.',
      idiomatic:
        'When boiling at Tong and Tai declined yearly and local stocks ran low, grain and cloth payments were dropped and only cash was accepted.',
    },
    {
      zh: '久之，積鹽復多。',
      literal: 'After a long time, accumulated salt again grew abundant.',
      idiomatic: 'In time, salt stocks again piled up.',
    },
  ],
  'source-songshi-182-wikisource-6656b0219aa6': [
    {
      zh: '」時范仲淹安撫江、淮，亦以疏通鹽利為言，即詔知制誥丁度等與三司使、江淮制置使同議。',
      literal:
        'At that time Fan Zhongyan, pacification commissioner of Jiang and Huai, also spoke on unblocking salt revenue, and an edict ordered Drafting Drafter Ding Du and others to deliberate jointly with the Three Departments commissioner and the Jiang-Huai fiscal planning commissioner.',
      idiomatic:
        'Meanwhile Fan Zhongyan, pacification commissioner of Jiang and Huai, also urged unblocking salt revenue, and the court ordered Drafting Drafter Ding Du and others to consult with the Three Departments commissioner and the Jiang-Huai planning commissioner.',
    },
    {
      zh: '皆謂聽通商恐私販肆行，侵蠹縣官，請敕制置司益漕船運至諸路，使皆有二三年之蓄；',
      literal:
        'All held that permitting free trade would allow smuggling to run rampant and drain the government treasury; they asked that the planning office increase grain-transport ships to every circuit so each would have two or three years reserves;',
      idiomatic:
        'All agreed that free trade would unleash smuggling and drain the treasury; they asked the planning office to increase grain transport to every circuit so each would hold two or three years of reserves;',
    },
    {
      zh: '復制，聽商人入錢粟京師及淮、浙、江南、荊湖州軍易鹽；',
      literal:
        'a further regulation permitted merchants to pay cash and grain into the capital and at Huai, Zhe, Jiangnan, and Jinghu prefectures and armies in exchange for salt;',
      idiomatic:
        'a further rule let merchants pay cash and grain in the capital and at Huai, Zhe, Jiangnan, and Jinghu in exchange for salt;',
    },
    {
      zh: '在通、楚、泰、海、真、揚、漣水、高郵貿易者毋得出城，餘州聽詣縣鎮，毋至鄉村；',
      literal:
        'in Tong, Chu, Tai, Hai, Zhen, Yang, Lianshui, and Gaoyou traders were not permitted to leave the city; in other prefectures they were permitted to go to county towns but not to villages;',
      idiomatic:
        'in Tong, Chu, Tai, Hai, Zhen, Yang, Lianshui, and Gaoyou trade was confined to the city; elsewhere merchants could go to county towns but not villages;',
    },
    {
      zh: '其入錢京師者增鹽予之，並敕轉運司經畫本錢以償亭戶。',
      literal:
        'those who paid into the capital received extra salt, and transport commissioners were ordered to plan capital funds to reimburse saltern households.',
      idiomatic:
        'those paying into the capital received extra salt, and transport commissioners were told to arrange capital funds to pay saltern households.',
    },
    {
      zh: '詔皆施行。',
      literal: 'The edicts were all implemented.',
      idiomatic: 'The edicts were all implemented.',
    },
    {
      zh: '，諸路博易無利，遂罷，而入錢京師如故。',
      literal: 'Circuit exchange trade proved unprofitable and was abolished, but payment into the capital continued as before.',
      idiomatic: 'Circuit exchange trade proved unprofitable and was abolished, but payment into the capital continued as before.',
    },
  ],
  'source-songshi-182-wikisource-7a1159200637': [
    {
      zh: '，詔未降新鈔前已給見錢公據文鈔，並給還商賈，以示大信。',
      literal:
        'An edict ordered that cash-receipt vouchers and documentary certificates already issued before the new certificates were issued should all be returned to merchants to show great good faith.',
      idiomatic:
        'An edict ordered that cash vouchers and documentary certificates issued before the new certificates arrived be returned to merchants as a sign of good faith.',
    },
    {
      zh: '時鹽盡給新鈔，亦用帶賣舊鹽立限之法。',
      literal: 'At the time salt was entirely issued on new certificates, and the method of setting time limits on tied sale of old salt was also used.',
      idiomatic: 'Salt was issued entirely on new certificates, and time limits on tied sale of old salt were also imposed.',
    },
    {
      zh: '言者論：「王黼當國，循用蔡京弊法，改行新鈔，舊鹽貼錢對帶，方許出賣，初限兩月，再限一月。',
      literal:
        'Critics argued: "When Wang Fu held power he followed Cai Jing bad methods, changed to new certificates, and required old salt to be tied with supplemental payment before sale, initially limiting two months, then extending one month.',
      idiomatic:
        'Critics argued: "When Wang Fu held power he followed Cai Jing bad methods, switched to new certificates, and required supplemental payment tied to old salt before sale, first for two months and then one more month.',
    },
    {
      zh: '是時黼方用事，專務害民，剝下益上，改易鈔法，甚於盜賊。',
      literal:
        'At that time Fu was in power, devoted to harming the people, stripping the lower to enrich the upper, changing certificate law worse than bandits.',
      idiomatic:
        'Fu was then in power, devoted to harming the people, stripping the poor to enrich the state, and changing certificate law worse than banditry.',
    },
    {
      zh: '然今不改覆車之轍，又促限止半月，反不及王黼之時，商賈豈得不怨？',
      literal:
        'Yet now we do not turn from the overturned cart track but shorten the limit to half a month — even less than under Wang Fu — how could merchants not resent it?',
      idiomatic:
        'Yet now the court will not turn from the overturned cart track but shortens the limit to half a month — even harsher than under Wang Fu — so how could merchants not resent it?',
    },
    {
      zh: '」詔申限焉。',
      literal: 'An edict extended the time limit.',
      idiomatic: 'An edict extended the time limit.',
    },
  ],
};

const notes = {
  'source-songshi-182-wikisource-1bd6073f9bc9':
    'Restored Shaosheng-era Hebei salt monopoly and certificate-law passage omitted between s0014 and s0015.',
  'source-songshi-182-wikisource-d194a43db42f':
    'Restored Sun Mian and Chen Shu deliberation and early Tianxi salt-exchange recruitment omitted before Wang Sui proposal; preserved existing Mingdao date on s0081.',
  'source-songshi-182-wikisource-6656b0219aa6':
    'Restored Fan Zhongyan salt deliberation and circuit exchange rules omitted before Kangding edict; preserved existing Kangding date on s0093.',
  'source-songshi-182-wikisource-7a1159200637':
    'Restored voucher-return edict and Wang Fu certificate-policy criticism omitted between s0327 and s0328.',
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
  item.notes = notes[id];
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

console.log('Applied songshi/182 source correspondence repairs.');
