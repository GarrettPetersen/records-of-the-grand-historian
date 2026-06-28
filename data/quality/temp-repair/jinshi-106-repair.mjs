#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const CHAPTER = 'data/jinshi/106.json';
const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-jinshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

function tr(literal, idiomatic) {
  return { lang: 'en', literal, idiomatic, translator: T, model: M };
}

function makeSentence(zh, literal, idiomatic) {
  return { zh, translations: [tr(literal, idiomatic)] };
}

const xingjianSentences = [
  makeSentence(
    '行簡字敬甫。',
    'Xingjian, styled Jingfu,',
    'Xingjian, whose style name was Jingfu,',
  ),
  makeSentence(
    '穎悟力學，淹貫經史。',
    'was quick-witted and studied with vigor, thoroughly versed in the classics and histories.',
    'was quick-witted and studied diligently, and was thoroughly versed in the classics and histories.',
  ),
  makeSentence(
    '大定十九年進士第一，除應奉翰林文字。',
    'In the nineteenth year of Dading he ranked first among jinshi graduates and was appointed Hanlin Academician-in-Attendance.',
    'In the nineteenth year of Dading he placed first among jinshi graduates and was appointed Hanlin academician-in-attendance.',
  ),
  makeSentence(
    '丁母憂，歸葬益都，杜門讀書，人莫見其面。',
    'When his mother died he mourned, returned to bury her at Yidu, shut his doors to study, and no one saw his face.',
    'After his mother\'s death he went into mourning, returned to bury her at Yidu, shut his doors to study, and would see no one.',
  ),
  makeSentence(
    '服除，複任。',
    'When mourning ended he resumed office.',
    'When mourning ended he resumed office.',
  ),
  makeSentence(
    '章宗即位，轉修撰，進讀陳言文字，攝太常博士。',
    'When Zhangzong acceded he was transferred to Compiler, advanced to Reader of Chenyan Documents, and acted as Master of Rites in the Court of Imperial Sacrifices.',
    'When Zhangzong acceded he was made a compiler, advanced to reader of Chenyan documents, and served as acting master of rites in the Court of Imperial Sacrifices.',
  ),
  makeSentence(
    '夏國遣使陳慰，欲致祭大行靈殿。',
    'Western Xia sent envoys to offer condolences and wished to perform sacrifice at the Hall of the Late Emperor\'s Spirit Tablet.',
    'Western Xia sent envoys to offer condolences and wished to perform sacrifice at the hall of the late emperor\'s spirit tablet.',
  ),
  makeSentence(
    '行簡曰：「彼陳慰非專祭，不可。」',
    'Xingjian said: "Their mission of condolence is not a dedicated sacrifice—it cannot be allowed."',
    'Xingjian said, "Their mission is one of condolence, not a dedicated sacrifice, and cannot be allowed."',
  ),
  makeSentence(
    '廷議遣使橫賜高麗，「比遣使報哀，彼以細故邀阻，且出嫚言，俟移問還報，橫賜未晚」。',
    'The court debated sending envoys with lateral gifts to Goryeo; he said, "We have just sent envoys to announce mourning, and they obstructed us over trifles and even uttered insults—wait until inquiries return before sending lateral gifts; it will not be too late."',
    'When the court debated sending envoys with lateral gifts to Goryeo, he argued, "We have only just sent envoys to announce mourning, and they obstructed us over trifles and even uttered insults. Wait until inquiries return before sending lateral gifts; it will not be too late."',
  ),
  makeSentence(
    '徒單克寧韙其言，深器重之。',
    'Tudan Kening approved his words and greatly valued him.',
    'Tudan Kening approved his words and came to value him deeply.',
  ),
  makeSentence(
    '轉翰林修撰，與路伯達俱進讀陳言文字，累遷禮部郎中。',
    'He was transferred to Hanlin Compiler and, together with Lu Boda, advanced to read Chenyan documents; he was promoted in succession to Director in the Ministry of Rites.',
    'He was transferred to Hanlin compiler and, together with Lu Boda, advanced to read Chenyan documents, rising in succession to director in the Ministry of Rites.',
  ),
];

const packet90 = [
  { index: 0, zh: '拜禮部尚書。', literal: 'He was appointed Minister of Rites.', idiomatic: 'He was appointed minister of rites.', translator: T, model: M },
  { index: 1, zh: '孫即康鞫治鎬王永中事，還奏，有詔複訊，群臣舉暐及兵部侍郎烏古論慶裔。', literal: 'Sun Jikang investigated the case of Prince Hao Wang Yongzhong; on returning to report, an edict ordered re-examination, and the assembled ministers nominated Wei and Wugulun Qingyi, Vice Minister of War.', idiomatic: 'Sun Jikang investigated the case of Prince Hao Wang Yongzhong. When he returned and reported, an edict ordered a re-examination, and the assembled ministers nominated Wei and Wugulun Qingyi, vice minister of war.', translator: T, model: M },
  { index: 2, zh: '上使參知政事馬琪諭暐曰：「百官舉閱實鎬王事，要勿屈抑其人，亦不可虧損國法。」', literal: 'The emperor sent Vice Councilor Ma Qi to instruct Wei: "The officials have nominated you to examine the Prince Hao affair. You must neither wrongfully suppress anyone nor impair the laws of the state."', idiomatic: 'The emperor sent Vice Councilor Ma Qi to instruct Wei, "The officials have nominated you to examine the Prince Hao affair. You must neither wrongfully suppress anyone nor impair the laws of the state."', translator: T, model: M },
  { index: 3, zh: '上因謂宰臣曰：「鎬王視永蹈為輕。」', literal: 'The emperor then said to the chief ministers: "Prince Hao regarded Prince Yong of Zheng lightly."', idiomatic: 'The emperor then told the chief ministers, "Prince Hao regarded Prince Yong of Zheng lightly."', translator: T, model: M },
  { index: 4, zh: '馬琪曰：「人臣無將。」', literal: 'Ma Qi said: "A subject must have no pretension to rulership."', idiomatic: 'Ma Qi said, "A subject must have no pretension to rulership."', translator: T, model: M },
  { index: 5, zh: '由是永中之獄決矣。', literal: 'On this account Yongzhong\'s case was decided.', idiomatic: 'On this account Yongzhong\'s case was decided.', translator: T, model: M },
  { index: 6, zh: '霍王從彝母早死，溫妃石抹氏養之，明昌六年溫妃薨，上問從彝喪服。', literal: 'Prince Huo Congyi\'s mother died early; Consort Wen of the Shimota clan raised him. In the sixth year of Mingchang Consort Wen died, and the emperor asked about Congyi\'s mourning garments.', idiomatic: 'Prince Huo Congyi\'s mother died early, and Consort Wen of the Shimota clan raised him. In the sixth year of Mingchang Consort Wen died, and the emperor asked what mourning garments Congyi should wear.', translator: T, model: M },
  { index: 7, zh: '暐奏：「慈母服齊衰三年，桐杖布冠，禮也。', literal: 'Wei memorialized: "For a nurturing mother one wears qi-cui mourning for three years, with a paulownia staff and cloth cap—this is ritual propriety.', idiomatic: 'Wei memorialized, "For a nurturing mother one wears qi-cui mourning for three years, with a paulownia staff and cloth cap—this is ritual propriety.', translator: T, model: M },
  { index: 8, zh: '從彝近親，至尊壓降與臣下不同，乞於未葬以前服白布衣絹巾，既葬止用素服終制，朝會從吉。」', literal: 'Congyi is a close kinsman of the sovereign; the sovereign\'s reduction of mourning differs from that of subjects. I beg that before the burial he wear plain white cloth and a silk kerchief, and after burial use only plain garments to complete the mourning period, attending court audiences in auspicious dress."', idiomatic: 'Congyi is a close kinsman of the sovereign, and the sovereign\'s reduction of mourning differs from that of subjects. I beg that before the burial he wear plain white cloth and a silk kerchief, and after burial use only plain garments to complete the mourning period, attending court audiences in auspicious dress."', translator: T, model: M },
  { index: 9, zh: '上從其奏。', literal: 'The emperor followed his memorial.', idiomatic: 'The emperor accepted his memorial.', translator: T, model: M },
];

const packet23 = [
  { index: 0, zh: '初，陳言人王世安獻攻取盱眙、楚州策，樞密院奏乞以世安為招撫使，選謀勇二三人同往淮南，招紅襖賊及淮南宋官。', literal: 'Earlier, Chenyan official Wang Shian submitted a plan to capture Xuyi and Chuzhou; the Bureau of Military Affairs memorialized asking that Shian be made Pacification Commissioner and that two or three bold and capable men be chosen to go with him to Huainan to recruit Red Jacket bandits and Song officials south of the Huai.', idiomatic: 'Earlier, Chenyan official Wang Shian submitted a plan to capture Xuyi and Chuzhou. The Bureau of Military Affairs memorialized asking that Shian be made pacification commissioner and that two or three bold and capable men be chosen to accompany him to Huainan to recruit Red Jacket bandits and Song officials south of the Huai.', translator: T, model: M },
  { index: 1, zh: '宣宗可其奏，詔泗州元帥府遣人同往。', literal: 'Emperor Xuanzong approved the memorial and ordered the Xuzhou Marshal\'s Headquarters to send men to go together.', idiomatic: 'The emperor approved the memorial and ordered the Xuzhou marshal\'s headquarters to send men to accompany them.', translator: T, model: M },
  { index: 2, zh: '興定元年正月癸未，宋賀正旦使朝辭，宣宗曰：「聞息州透漏宋人，此乃彼界饑民沿淮為亂，宋人何敢犯我？」', literal: 'On guiwei, the first month of the first year of Xingding, when Song envoys congratulating the New Year took leave after audience, Emperor Xuanzong said: "I hear that Xizhou let Song people slip through. These are hungry people from their border making trouble along the Huai—how would Song dare violate us?"', idiomatic: 'On guiwei, the first month of the first year of Xingding, when Song envoys congratulating the New Year took leave after audience, the emperor said, "I hear that Xizhou let Song people slip through. These are hungry people from their border making trouble along the Huai—how would Song dare violate us?"', translator: T, model: M },
  { index: 3, zh: '高琪請伐之以廣疆土。', literal: 'Gaoqi requested campaigning against them to expand the realm.', idiomatic: 'Gaoqi requested a campaign to expand the realm.', translator: T, model: M },
  { index: 4, zh: '上曰：「朕但能守祖宗所付足矣，安事外討。」', literal: 'The emperor said: "I need only guard what the ancestors entrusted—that is enough. Why trouble ourselves with external campaigns?"', idiomatic: 'The emperor said, "I need only guard what the ancestors entrusted—that is enough. Why trouble ourselves with external campaigns?"', translator: T, model: M },
  { index: 5, zh: '高琪謝曰：「今雨雪應期，皆聖德所致。', literal: 'Gaoqi apologized and said: "Now rain and snow come at the proper season—all due to your sacred virtue.', idiomatic: 'Gaoqi apologized and said, "Now rain and snow come at the proper season—all due to your sacred virtue.', translator: T, model: M },
  { index: 6, zh: '而能包容小國，天下幸甚，臣言過矣。」', literal: 'And in being able to embrace a small state, the realm is greatly fortunate. Your subject spoke beyond measure."', idiomatic: 'And in being able to embrace a small state, the realm is greatly fortunate. Your subject spoke beyond measure."', translator: T, model: M },
  { index: 7, zh: '四月，遣元帥左都監烏古論慶壽、簽樞密院事完顏賽不經略南邊，尋複下詔罷兵，然自是與宋絕矣。', literal: 'In the fourth month he dispatched Marshal Left Controller Wugulun Qingshou and Bureau of Military Affairs Signatory Wanyan Saibu to oversee the southern frontier; soon an edict again halted the campaign, but from this time relations with Song were severed.', idiomatic: 'In the fourth month he dispatched Marshal Left Controller Wugulun Qingshou and Bureau of Military Affairs signatory Wanyan Saibu to oversee the southern frontier. Soon an edict again halted the campaign, but from this time relations with Song were severed.', translator: T, model: M },
];

const packetE02 = [
  { index: 0, zh: '興定五年正月，尚書省奏：「《章宗實錄》已進呈，衛王事蹟亦宜依《海陵庶人實錄》，纂集成書，以示後世。」', literal: 'In the first month of the fifth year of Xingding, the Department of State Affairs memorialized: "The Veritable Records of Zhangzong have already been presented. The deeds of Prince Wei should likewise be compiled into a book following the Veritable Records of the Deposed Hailing, to show posterity."', idiomatic: 'In the first month of the fifth year of Xingding, the Department of State Affairs memorialized, "The Veritable Records of Zhangzong have already been presented. The deeds of Prince Wei should likewise be compiled into a book following the Veritable Records of the Deposed Hailing, to show posterity."', translator: T, model: M },
  { index: 1, zh: '制可。', literal: 'Approved.', idiomatic: 'The memorial was approved.', translator: T, model: M },
  { index: 2, zh: '初，胡沙虎弑衛王，立宣宗，一時朝臣皆謂衛王失道，天命絕之，虎實無罪，且有推戴之功，獨張行信抗章言之，不報，舉朝遂以為諱。', literal: 'Earlier, when Hushahu assassinated Prince Wei and enthroned Emperor Xuanzong, court officials for a time all said Prince Wei had lost the Way and Heaven had cut him off; Hu was in fact guiltless and even had the merit of raising the emperor up. Only Zhang Xingxin submitted a memorial stating this; it received no response, and the whole court thereafter treated it as taboo.', idiomatic: 'Earlier, when Hushahu assassinated Prince Wei and enthroned Emperor Xuanzong, court officials for a time all said Prince Wei had lost the Way and Heaven had cut him off; Hu was in fact guiltless and even had the merit of raising the emperor up. Only Zhang Xingxin submitted a memorial stating this; it received no response, and the whole court thereafter treated it as taboo.', translator: T, model: M },
  { index: 3, zh: '及是，史官謂益謙嘗事衛王，宜知其事，乃遣編修一人就鄭訪之。', literal: 'At this time the historiographers said Yiqian had once served Prince Wei and ought to know the affair; they therefore sent one compiler to Zheng to interview him.', idiomatic: 'At this time the historiographers said Yiqian had once served Prince Wei and ought to know the affair, so they sent a compiler to Zheng to interview him.', translator: T, model: M },
  { index: 4, zh: '益謙知其旨，謂之曰：「知衛王莫如我。', literal: 'Yiqian knew their intent and said to him: "No one knows Prince Wei better than I.', idiomatic: 'Yiqian knew their intent and said to him, "No one knows Prince Wei better than I.', translator: T, model: M },
  { index: 5, zh: '然我聞海陵被弑而世宗立，大定三十年，禁近能暴海陵蟄惡者，輒得美仕，故當時史官修實錄多所附會。', literal: 'Yet I have heard that after Hailing was assassinated and Shizong was enthroned, for thirty years of Dading those close to the throne who could expose Hailing\'s hidden evils promptly obtained fine appointments; therefore the historiographers of that time, in compiling the veritable records, largely accommodated themselves.', idiomatic: 'Yet I have heard that after Hailing was assassinated and Shizong was enthroned, for thirty years of Dading those close to the throne who could expose Hailing\'s hidden evils promptly obtained fine appointments; therefore the historiographers of that time, in compiling the veritable records, largely accommodated themselves.', translator: T, model: M },
  { index: 6, zh: '衛王為人勤儉，慎惜名器，較其行事，中材不及者多矣。', literal: 'Prince Wei was frugal and careful with titles and offices; compared with his conduct, many of merely middling talent fell short.', idiomatic: 'Prince Wei was frugal and careful with titles and offices; compared with his conduct, many of merely middling talent fell short.', translator: T, model: M },
  { index: 7, zh: '吾知此而已，設欲飾吾言以實其罪，吾亦何惜餘年。」', literal: 'I know only this. If you wish to adorn my words to substantiate his guilt, what do I care for the years that remain?"', idiomatic: 'I know only this. If you wish to adorn my words to substantiate his guilt, what do I care for the years that remain?"', translator: T, model: M },
  { index: 8, zh: '朝議偉之。', literal: 'Court opinion admired him.', idiomatic: 'Court opinion admired him.', translator: T, model: M },
  { index: 9, zh: '正大三年，年八十，薨。', literal: 'In the third year of Zhengda, at age eighty, he died.', idiomatic: 'In the third year of Zhengda, at age eighty, he died.', translator: T, model: M },
  { index: 10, zh: '三子：賢卿、頤卿、翔卿，皆以門資入仕。', literal: 'He had three sons: Xianqing, Yiqing, and Xiangqing—all entered office through hereditary privilege.', idiomatic: 'He had three sons: Xianqing, Yiqing, and Xiangqing—all entered office through hereditary privilege.', translator: T, model: M },
];

// 1) Patch chapter: quotes + insert Xingjian bio after s0043
const chapter = JSON.parse(fs.readFileSync(CHAPTER, 'utf8'));
let inserted = 0;
for (const block of chapter.content) {
  for (const s of block.sentences || []) {
    if (s.id === 's0014') {
      s.zh = s.zh.replace('暐奏：」', '暐奏：「');
      s.translations[0].literal = s.translations[0].literal.replace('Wei submitted: "', 'Wei memorialized: "');
      s.translations[0].idiomatic = s.translations[0].idiomatic.replace('Wei memorialized, "', 'Wei memorialized, "');
    }
    if (s.id === 's0020') {
      s.zh = s.zh.replace(/？$/, "？'");
    }
    if (s.id === 's0021') {
      s.zh = s.zh.replace(/^'/, '');
    }
    if (s.id === 's0345') {
      s.zh = '遂寢。」';
      s.translations[0].literal = 'The proposal was shelved."';
      s.translations[0].idiomatic = 'The proposal was shelved."';
    }
    if (s.id === 's0043') {
      const idx = block.sentences.indexOf(s);
      const newSents = xingjianSentences.map((row, i) => ({
        id: `s0043_${i + 1}`,
        ...row,
      }));
      block.sentences.splice(idx + 1, 0, ...newSents);
      inserted = newSents.length;
    }
  }
}

// assign stable ids for inserted xingjian sentences
let maxNum = 0;
for (const block of chapter.content) {
  for (const s of block.sentences || []) {
    const m = /^s(\d+)$/.exec(s.id || '');
    if (m) maxNum = Math.max(maxNum, Number(m[1]));
  }
}
for (const block of chapter.content) {
  for (const s of block.sentences || []) {
    if (/^s0043_\d+$/.test(s.id || '')) {
      maxNum += 1;
      s.id = `s${String(maxNum).padStart(4, '0')}`;
    }
  }
}

chapter.meta.sentenceCount = (chapter.meta.sentenceCount || 0) + inserted;
fs.writeFileSync(CHAPTER, `${JSON.stringify(chapter, null, 2)}\n`);

// 2) Write packets and import/apply three omission items
const dir = 'data/quality/temp-repair/jinshi-106';
fs.mkdirSync(dir, { recursive: true });
const items = [
  ['source-jinshi-106-wikisource-90a29941c387', packet90],
  ['source-jinshi-106-wikisource-23b5db5bad37', packet23],
  ['source-jinshi-106-wikisource-e02aa930e535', packetE02],
];
for (const [id, rows] of items) {
  const packetPath = `${dir}/${id}.json`;
  fs.writeFileSync(packetPath, `${JSON.stringify(rows, null, 2)}\n`);
  execSync(`node scripts/import-source-repair-translations.mjs --queue ${QUEUE} --item ${id} --packet ${packetPath} --accepted-source-from-packets --approve --reviewer sdk-repair-chapter`, { stdio: 'inherit' });
  execSync(`node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`, { stdio: 'inherit' });
}

// 3) Mark xingjian item applied
execSync(`node scripts/mark-source-correspondence.mjs --queue ${QUEUE} --item source-jinshi-106-wikisource-15ccc7678602 --decision applied --notes "Inserted eleven-sentence Zhang Xingjian biography opening after subsection heading s0043; preserved heading and added manual translations." --reviewer sdk-repair-chapter`, { stdio: 'inherit' });

console.log('Repair complete.');
