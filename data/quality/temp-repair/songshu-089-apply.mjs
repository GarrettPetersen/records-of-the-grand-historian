#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-songshu.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-songshu-089-wikisource-1f153df940fc': [
    {
      zh: '大明元年，復為侍中，領射聲校尉，封興平縣子，食邑五百戶，事在顏師伯傳。',
      literal: 'In the first year of Daming, he was again made Palace Attendant and concurrently Commandant of the Archers\' Corps, enfeoffed as Viscount of Xingping with a fief of five hundred households; the affair is treated in Yan Shibo\'s biography.',
      idiomatic: 'In the first year of Daming, he was again made Palace Attendant and concurrently Commandant of the Archers\' Corps, enfeoffed as Viscount of Xingping with a fief of five hundred households; the affair is treated in Yan Shibo\'s biography.',
    },
    {
      zh: '三年，坐納山陰民丁彖文貨，舉為會稽郡孝廉，免官。',
      literal: 'In the third year, he was punished for accepting goods from Ding Tuan, a commoner of Shanyin, and recommending him as a filial and incorrupt candidate for Kuaiji commandery; he was dismissed from office.',
      idiomatic: 'In the third year, he was punished for accepting goods from Ding Tuan, a commoner of Shanyin, and recommending him as a filial and incorrupt candidate for Kuaiji commandery; he was dismissed from office.',
    },
    {
      zh: '尋為西陽王子尚撫軍長史，又為中庶子，領左軍將軍。',
      literal: 'Soon he was Army Staff Officer to the Prince of Xiyang Zishang as Stabilizing Army, then Household Mentor, and concurrently General of the Left Army.',
      idiomatic: 'Soon he was Army Staff Officer to the Prince of Xiyang Zishang as Stabilizing Army, then Household Mentor, and concurrently General of the Left Army.',
    },
    {
      zh: '四年，出補豫章太守，加秩中二千石。',
      literal: 'In the fourth year, he went out to fill the post of Governor of Yuzhang, with rank raised to equivalent to two thousand shi.',
      idiomatic: 'In the fourth year, he went out to fill the post of Governor of Yuzhang, with rank raised to equivalent to two thousand shi.',
    },
    {
      zh: '五年，復還為侍中，領長水校尉，遷左衞將軍，加給事中。',
      literal: 'In the fifth year, he returned as Palace Attendant, concurrently Commandant of the Chang River Corps, was transferred to General of the Left Guard, and additionally made Palace Provisioner.',
      idiomatic: 'In the fifth year, he returned as Palace Attendant, concurrently Commandant of the Chang River Corps, was transferred to General of the Left Guard, and additionally made Palace Provisioner.',
    },
    {
      zh: '七年，轉吏部尚書，左衞如故。',
      literal: 'In the seventh year, he was transferred to Director of the Ministry of Personnel, with his Left Guard post unchanged.',
      idiomatic: 'In the seventh year, he was transferred to Director of the Ministry of Personnel, with his Left Guard post unchanged.',
    },
    {
      zh: '其年，皇太子冠，上臨宴東宮，愍孫勸顏師伯酒，師伯不飲，愍孫因相裁辱，師伯見寵於上，上常嫌愍孫以寒素凌之，因此發怒，出為海陵太守。',
      literal: 'That year, when the Heir Apparent received the capping ceremony, the emperor attended a feast at the Eastern Palace; Min Sun urged Yan Shibo to drink wine, but Shibo refused; Min Sun therefore abused and humiliated him; Shibo was favored by the emperor, who had often resented Min Sun for lording over him on account of his humble origins; for this the emperor became angry and sent Min Sun out as Governor of Hailing.',
      idiomatic: 'That year, when the Heir Apparent received the capping ceremony, the emperor attended a feast at the Eastern Palace; Min Sun urged Yan Shibo to drink wine, but Shibo refused; Min Sun therefore abused and humiliated him; Shibo was favored by the emperor, who had often resented Min Sun for lording over him on account of his humble origins; for this the emperor became angry and sent Min Sun out as Governor of Hailing.',
    },
    {
      zh: '前廢帝即位，除御史中丞，不拜。',
      literal: 'When the Former Deposed Emperor took the throne, he was appointed Imperial Censor but did not accept.',
      idiomatic: 'When the Former Deposed Emperor took the throne, he was appointed Imperial Censor but did not accept.',
    },
    {
      zh: '復為吏部尚書。',
      literal: 'He was again made Director of the Ministry of Personnel.',
      idiomatic: 'He was again made Director of the Ministry of Personnel.',
    },
    {
      zh: '永光元年，徙右衞將軍，加給事中。',
      literal: 'In the first year of Yongguang, he was moved to General of the Right Guard and additionally made Palace Provisioner.',
      idiomatic: 'In the first year of Yongguang, he was moved to General of the Right Guard and additionally made Palace Provisioner.',
    },
    {
      zh: '景和元年，復入為侍中，領驍騎將軍。',
      literal: 'In the first year of Jinghe, he again entered court as Palace Attendant and concurrently General of the Valiant Cavalry.',
      idiomatic: 'In the first year of Jinghe, he again entered court as Palace Attendant and concurrently General of the Valiant Cavalry.',
    },
    {
      zh: '太宗泰始元年，轉司徒左長史，冠軍將軍，南東海太守。',
      literal: 'In the first year of Taishi under Emperor Ming, he was transferred to Left Army Staff Officer of the Ministry of Rites, General Who Conquers, and Governor of Southern Donghai.',
      idiomatic: 'In the first year of Taishi under Emperor Ming, he was transferred to Left Army Staff Officer of the Ministry of Rites, General Who Conquers, and Governor of Southern Donghai.',
    },
    {
      zh: '家貧嘗仕，非其好也，混其聲迹，晦其心用，故深交或迕，俗察罔識。',
      literal: 'His family was poor and he once served in office—it was not to his liking; he blended his voice and tracks and hid his heart\'s purpose; therefore close friends sometimes parted ways, and ordinary observers did not know him.',
      idiomatic: 'His family was poor and he once served in office—it was not to his liking; he blended his voice and tracks and hid his heart\'s purpose; therefore close friends sometimes parted ways, and ordinary observers did not know him.',
    },
  ],
  'source-songshu-089-wikisource-b2ba6444bcd0': [
    {
      zh: '太宗臨崩，粲與褚淵、劉勔並受顧命，加班劍二十人，給鼓吹一部。',
      literal: 'When Emperor Ming was on his deathbed, Can together with Chu Yuan and Liu Mian all received the dying imperial command; he was given twenty ceremonial halberds and one set of trumpets and drums.',
      idiomatic: 'When Emperor Ming was on his deathbed, Can together with Chu Yuan and Liu Mian all received the dying imperial command; he was given twenty ceremonial halberds and one set of trumpets and drums.',
    },
    {
      zh: '後廢帝即位，加兵五百人。',
      literal: 'When the Later Deposed Emperor took the throne, his guard was increased by five hundred men.',
      idiomatic: 'When the Later Deposed Emperor took the throne, his guard was increased by five hundred men.',
    },
    {
      zh: '帝未親朝政，下詔曰：「比亢序愆度，留熏燿晷，有傷秋稼，方貽民瘼。',
      literal: 'The emperor had not yet personally handled court affairs and issued an edict saying: "Recently the order of the celestial mansions has been out of measure, lingering heat has prolonged the days, harming the autumn crops and about to bring suffering to the people.',
      idiomatic: 'The emperor had not yet personally handled court affairs and issued an edict saying: "Recently the order of the celestial mansions has been out of measure, lingering heat has prolonged the days, harming the autumn crops and about to bring suffering to the people.',
    },
    {
      zh: '朕以眇疚，未弘政道，囹圄尚繁，枉滯猶積，晨兢夕厲，每惻于懷。',
      literal: 'I, being young and afflicted, have not yet broadened the way of government; prisons remain numerous and wrongful detentions still accumulate; morning and evening I am vigilant and anxious, each time grieved at heart.',
      idiomatic: 'I, being young and afflicted, have not yet broadened the way of government; prisons remain numerous and wrongful detentions still accumulate; morning and evening I am vigilant and anxious, each time grieved at heart.',
    },
    {
      zh: '尚書令可與執法以下，就訊眾獄，使冤訟洗遂，困弊昭蘇。',
      literal: 'The Secretariat Director, together with law-enforcement officials and below, should go and examine the various prisons, so that wrongful suits may be cleared and the distressed and exhausted may be revived.',
      idiomatic: 'The Secretariat Director, together with law-enforcement officials and below, should go and examine the various prisons, so that wrongful suits may be cleared and the distressed and exhausted may be revived.',
    },
    {
      zh: '頒下州郡，咸令無壅。」',
      literal: 'Issue this throughout the provinces and commanderies, all being ordered to permit no obstruction."',
      idiomatic: 'Issue this throughout the provinces and commanderies, all being ordered to permit no obstruction."',
    },
    {
      zh: '元徽元年，丁母憂，葬竟，攝令親職，加衞將軍，不受，敦逼備至，中使相望，粲終不受。',
      literal: 'In the first year of Yuanhui, he entered mourning for his mother; when the burial was completed, he was ordered to resume personal duty and was additionally made Guards General; he did not accept; urgings were pressed to the utmost and palace envoys followed one after another, but Can in the end did not accept.',
      idiomatic: 'In the first year of Yuanhui, he entered mourning for his mother; when the burial was completed, he was ordered to resume personal duty and was additionally made Guards General; he did not accept; urgings were pressed to the utmost and palace envoys followed one after another, but Can in the end did not accept.',
    },
    {
      zh: '性至孝，居喪毀甚，祖日及祥變，常發詔衞軍斷客。',
      literal: 'By nature he was extremely filial; during mourning he was greatly wasted; on the anniversary of his grandfather\'s death and at the mourning anniversaries, edicts were often issued for the Guards General to bar visitors.',
      idiomatic: 'By nature he was extremely filial; during mourning he was greatly wasted; on the anniversary of his grandfather\'s death and at the mourning anniversaries, edicts were often issued for the Guards General to bar visitors.',
    },
  ],
  'source-songshu-089-wikisource-d48fbb76bbc7': [
    {
      zh: '順帝即位，遷中書監，司徒、侍中如故。',
      literal: 'When Emperor Shun took the throne, he was moved to Supervisor of the Secretariat, with his posts as Minister of Rites and Palace Attendant unchanged.',
      idiomatic: 'When Emperor Shun took the throne, he was moved to Supervisor of the Secretariat, with his posts as Minister of Rites and Palace Attendant unchanged.',
    },
    {
      zh: '時齊王居東府，故使粲鎮石頭。',
      literal: 'At the time the Prince of Qi resided at the Eastern Headquarters, so Can was sent to garrison Stone Fortress.',
      idiomatic: 'At the time the Prince of Qi resided at the Eastern Headquarters, so Can was sent to garrison Stone Fortress.',
    },
    {
      zh: '粲素靜退，每有朝命，多不即從，逼切不得已，然後方就。',
      literal: 'Can was by nature quiet and retiring; whenever there was a court command he often did not immediately comply; only when pressed urgently and with no alternative would he finally go.',
      idiomatic: 'Can was by nature quiet and retiring; whenever there was a court command he often did not immediately comply; only when pressed urgently and with no alternative would he finally go.',
    },
    {
      zh: '及詔移石頭，即便順旨。',
      literal: 'When the edict ordered his move to Stone Fortress, he at once complied with the imperial will.',
      idiomatic: 'When the edict ordered his move to Stone Fortress, he at once complied with the imperial will.',
    },
    {
      zh: '有周旋人解望氣，謂粲曰：「石頭氣甚乖，往必有禍。」',
      literal: 'A companion skilled in reading qi omens said to Can: "The qi at Stone Fortress is very adverse; if you go there will surely be calamity."',
      idiomatic: 'A companion skilled in reading qi omens said to Can: "The qi at Stone Fortress is very adverse; if you go there will surely be calamity."',
    },
    {
      zh: '粲不答。',
      literal: 'Can did not answer.',
      idiomatic: 'Can did not answer.',
    },
    {
      zh: '又給油絡通幰車，仗士五十人入殿。',
      literal: 'He was also given an oiled carriage with connecting canopy and fifty armed soldiers entering the hall.',
      idiomatic: 'He was also given an oiled carriage with connecting canopy and fifty armed soldiers entering the hall.',
    },
    {
      zh: '時齊王功高德重，天命有歸，粲自以身受顧託，不欲事二姓，密有異圖。',
      literal: 'At the time the Prince of Qi\'s merit was high and his virtue weighty, and Heaven\'s mandate was tending toward him; Can, considering that he himself had received the dying imperial entrustment, did not wish to serve two dynasties and secretly harbored a separate plan.',
      idiomatic: 'At the time the Prince of Qi\'s merit was high and his virtue weighty, and Heaven\'s mandate was tending toward him; Can, considering that he himself had received the dying imperial entrustment, did not wish to serve two dynasties and secretly harbored a separate plan.',
    },
    {
      zh: '丹陽尹劉秉，宋代宗室，前湘州刺史王蘊，太后兄子，素好武事，並慮不見容於齊王，皆與粲相結。',
      literal: 'Liu Bing, Governor of Danyang, a member of the Song imperial clan, and Wang Yun, former Inspector of Xiang Province, the Empress Dowager\'s elder brother\'s son, who had always loved military affairs—all feared they would not be tolerated by the Prince of Qi—and all joined with Can in conspiracy.',
      idiomatic: 'Liu Bing, Governor of Danyang, a member of the Song imperial clan, and Wang Yun, former Inspector of Xiang Province, the Empress Dowager\'s elder brother\'s son, who had always loved military affairs—all feared they would not be tolerated by the Prince of Qi—and all joined with Can in conspiracy.',
    },
    {
      zh: '將帥黃回、任候伯、孫曇瓘、王宜興、彭文之、卜伯興等，並與粲合。',
      literal: 'The generals Huang Hui, Ren Houbo, Sun Tanjuan, Wang Yixing, Peng Wenzhi, Bu Boxing, and others all allied with Can.',
      idiomatic: 'The generals Huang Hui, Ren Houbo, Sun Tanjuan, Wang Yixing, Peng Wenzhi, Bu Boxing, and others all allied with Can.',
    },
  ],
  'source-songshu-089-wikisource-1a16da4533d4': [
    {
      zh: '齊永明元年，詔曰：「昔魏矜袁紹，恩給丘墳；',
      literal: 'In the first year of Yongming under Qi, an edict said: "Formerly Wei showed pity for Yuan Shao and bestowed favor on his mound and tomb;',
      idiomatic: 'In the first year of Yongming under Qi, an edict said: "Formerly Wei showed pity for Yuan Shao and bestowed favor on his mound and tomb;',
    },
    {
      zh: '晉亮兩王，榮覃餘裔。',
      literal: 'Jin honored the Two Kings, extending glory to their remaining descendants.',
      idiomatic: 'Jin honored the Two Kings, extending glory to their remaining descendants.',
    },
    {
      zh: '斯蓋懷舊流仁，原心興宥，二代弘義，前載美談。',
      literal: 'This was surely carrying forward benevolence through cherishing the old, extending clemency by examining the heart—magnanimous righteousness in two dynasties, a beautiful theme in former records.',
      idiomatic: 'This was surely carrying forward benevolence through cherishing the old, extending clemency by examining the heart—magnanimous righteousness in two dynasties, a beautiful theme in former records.',
    },
    {
      zh: '袁粲、劉秉，並與先朝同奬宋室，沈攸之於景和之世，特有乃心，雖末節不終，而始誠可錄。',
      literal: 'Yuan Can and Liu Bing both together with the former court supported the Song house; Shen Youzhi in the Jinghe era had a special loyal heart; although their final conduct did not run its course, their original sincerity is worth recording.',
      idiomatic: 'Yuan Can and Liu Bing both together with the former court supported the Song house; Shen Youzhi in the Jinghe era had a special loyal heart; although their final conduct did not run its course, their original sincerity is worth recording.',
    },
    {
      zh: '歲月彌往，宜沾優隆，粲、秉前年改葬，塋兆未修，材官可為經略，粗合周禮。',
      literal: 'As years pass ever further, they should receive honored elevation; Can and Bing were reburied in the year before last, but their grave precincts are not yet repaired—the Works Office may plan the work, roughly in accord with the Zhou Rites.',
      idiomatic: 'As years pass ever further, they should receive honored elevation; Can and Bing were reburied in the year before last, but their grave precincts are not yet repaired—the Works Office may plan the work, roughly in accord with the Zhou Rites.',
    },
    {
      zh: '攸之及其諸子喪柩在西，可符荊州以時致送，還反舊墓，在所營葬事。」',
      literal: 'Youzhi and his sons\' coffins are in the west; Jing Province should be instructed to deliver them in due time, return them to the old graves, and undertake the burial affairs locally."',
      idiomatic: 'Youzhi and his sons\' coffins are in the west; Jing Province should be instructed to deliver them in due time, return them to the old graves, and undertake the burial affairs locally."',
    },
    {
      zh: '史臣曰：闢運創基，非機變無以通其務，世及繼體，非忠貞無以守其業。',
      literal: 'The historian states: To open fortune and found the foundation, without adaptability one cannot penetrate its tasks; hereditary succession and continuing the body, without loyal steadfastness one cannot guard its enterprise.',
      idiomatic: 'The historian states: To open fortune and found the foundation, without adaptability one cannot penetrate its tasks; hereditary succession and continuing the body, without loyal steadfastness one cannot guard its enterprise.',
    },
    {
      zh: '闢運之君，千載一有，世及之主，無乏於時，□□須機變之用短，資忠貞之路長也。',
      literal: 'Lords who open fortune are one in a thousand years; lords of hereditary succession are not lacking in their time; □□ the short use of adaptability, the long road of loyal steadfastness.',
      idiomatic: 'Lords who open fortune are one in a thousand years; lords of hereditary succession are not lacking in their time; □□ the short use of adaptability, the long road of loyal steadfastness.',
    },
    {
      zh: '故漢室□□，文舉不屈曹氏，魏鼎將移，夏侯義不北面。',
      literal: 'Therefore the Han house □□, Wenju would not submit to the Cao clan; when Wei\'s tripod was about to shift, Xiahou in righteousness would not face north.',
      idiomatic: 'Therefore the Han house □□, Wenju would not submit to the Cao clan; when Wei\'s tripod was about to shift, Xiahou in righteousness would not face north.',
    },
  ],
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  if (item.status === 'applied') continue;
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

const applyOrder = [
  'source-songshu-089-wikisource-1f153df940fc',
  'source-songshu-089-wikisource-b2ba6444bcd0',
  'source-songshu-089-wikisource-d48fbb76bbc7',
  'source-songshu-089-wikisource-1a16da4533d4',
];
for (const id of applyOrder) {
  const item = queue.items.find((x) => x.id === id);
  if (item?.status === 'applied') continue;
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter --preserve-existing-translations`,
    { stdio: 'inherit' },
  );
}

const denyItem = queue.items.find((x) => x.id === 'source-songshu-089-wikisource-2f5594a4af92');
if (denyItem && denyItem.status !== 'denied') {
  execSync(
    `node scripts/mark-source-correspondence.mjs --queue ${QUEUE} --item source-songshu-089-wikisource-2f5594a4af92 --decision denied --notes "Reviewed as no-op: harmless edition variants (直閤/直閣 office title graph and 總共/共揔); local text already matches project conventions." --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied songshu/089 source correspondence repairs.');
