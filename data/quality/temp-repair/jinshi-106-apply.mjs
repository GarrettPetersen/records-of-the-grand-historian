#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-jinshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-jinshi-106-wikisource-90a29941c387': [
    { zh: '拜禮部尚書。', literal: 'He was appointed Minister of Rites.', idiomatic: 'He was appointed minister of rites.' },
    { zh: '孫即康鞫治鎬王永中事，還奏，有詔複訊，群臣舉暐及兵部侍郎烏古論慶裔。', literal: 'Sun Jikang investigated the case of Prince Hao Wang Yongzhong; on returning to report, an edict ordered re-examination, and the assembled ministers nominated Wei and Wugulun Qingyi, Vice Minister of War.', idiomatic: 'Sun Jikang investigated the case of Prince Hao Wang Yongzhong. When he returned and reported, an edict ordered a re-examination, and the assembled ministers nominated Wei and Wugulun Qingyi, vice minister of war.' },
    { zh: '上使參知政事馬琪諭暐曰：「百官舉閱實鎬王事，要勿屈抑其人，亦不可虧損國法。」', literal: 'The emperor sent Vice Councilor Ma Qi to instruct Wei: "The officials have nominated you to examine the Prince Hao affair. You must neither wrongfully suppress anyone nor impair the laws of the state."', idiomatic: 'The emperor sent Vice Councilor Ma Qi to instruct Wei, "The officials have nominated you to examine the Prince Hao affair. You must neither wrongfully suppress anyone nor impair the laws of the state."' },
    { zh: '上因謂宰臣曰：「鎬王視永蹈為輕。」', literal: 'The emperor then said to the chief ministers: "Prince Hao regarded Prince Yong of Zheng lightly."', idiomatic: 'The emperor then told the chief ministers, "Prince Hao regarded Prince Yong of Zheng lightly."' },
    { zh: '馬琪曰：「人臣無將。」', literal: 'Ma Qi said: "A subject must have no pretension to rulership."', idiomatic: 'Ma Qi said, "A subject must have no pretension to rulership."' },
    { zh: '由是永中之獄決矣。', literal: 'On this account Yongzhong\'s case was decided.', idiomatic: 'On this account Yongzhong\'s case was decided.' },
    { zh: '霍王從彝母早死，溫妃石抹氏養之，明昌六年溫妃薨，上問從彝喪服。', literal: 'Prince Huo Congyi\'s mother died early; Consort Wen of the Shimota clan raised him. In the sixth year of Mingchang Consort Wen died, and the emperor asked about Congyi\'s mourning garments.', idiomatic: 'Prince Huo Congyi\'s mother died early, and Consort Wen of the Shimota clan raised him. In the sixth year of Mingchang Consort Wen died, and the emperor asked what mourning garments Congyi should wear.' },
    { zh: '暐奏：「慈母服齊衰三年，桐杖布冠，禮也。', literal: 'Wei memorialized: "For a nurturing mother one wears qi-cui mourning for three years, with a paulownia staff and cloth cap—this is ritual propriety.', idiomatic: 'Wei memorialized, "For a nurturing mother one wears qi-cui mourning for three years, with a paulownia staff and cloth cap—this is ritual propriety.' },
    { zh: '從彝近親，至尊壓降與臣下不同，乞於未葬以前服白布衣絹巾，既葬止用素服終制，朝會從吉。」', literal: 'Congyi is a close kinsman of the sovereign; the sovereign\'s reduction of mourning differs from that of subjects. I beg that before the burial he wear plain white cloth and a silk kerchief, and after burial use only plain garments to complete the mourning period, attending court audiences in auspicious dress."', idiomatic: 'Congyi is a close kinsman of the sovereign, and the sovereign\'s reduction of mourning differs from that of subjects. I beg that before the burial he wear plain white cloth and a silk kerchief, and after burial use only plain garments to complete the mourning period, attending court audiences in auspicious dress."' },
    { zh: '上從其奏。', literal: 'The emperor followed his memorial.', idiomatic: 'The emperor accepted his memorial.' },
  ],
  'source-jinshi-106-wikisource-23b5db5bad37': [
    { zh: '初，陳言人王世安獻攻取盱眙、楚州策，樞密院奏乞以世安為招撫使，選謀勇二三人同往淮南，招紅襖賊及淮南宋官。', literal: 'Earlier, Chenyan official Wang Shian submitted a plan to capture Xuyi and Chuzhou; the Bureau of Military Affairs memorialized asking that Shian be made Pacification Commissioner and that two or three bold and capable men be chosen to go with him to Huainan to recruit Red Jacket bandits and Song officials south of the Huai.', idiomatic: 'Earlier, Chenyan official Wang Shian submitted a plan to capture Xuyi and Chuzhou. The Bureau of Military Affairs memorialized asking that Shian be made pacification commissioner and that two or three bold and capable men be chosen to accompany him to Huainan to recruit Red Jacket bandits and Song officials south of the Huai.' },
    { zh: '宣宗可其奏，詔泗州元帥府遣人同往。', literal: 'Emperor Xuanzong approved the memorial and ordered the Xuzhou Marshal\'s Headquarters to send men to go together.', idiomatic: 'The emperor approved the memorial and ordered the Xuzhou marshal\'s headquarters to send men to accompany them.' },
    { zh: '興定元年正月癸未，宋賀正旦使朝辭，宣宗曰：「聞息州透漏宋人，此乃彼界饑民沿淮為亂，宋人何敢犯我？」', literal: 'On guiwei, the first month of the first year of Xingding, when Song envoys congratulating the New Year took leave after audience, Emperor Xuanzong said: "I hear that Xizhou let Song people slip through. These are hungry people from their border making trouble along the Huai—how would Song dare violate us?"', idiomatic: 'On guiwei, the first month of the first year of Xingding, when Song envoys congratulating the New Year took leave after audience, the emperor said, "I hear that Xizhou let Song people slip through. These are hungry people from their border making trouble along the Huai—how would Song dare violate us?"' },
    { zh: '高琪請伐之以廣疆土。', literal: 'Gaoqi requested campaigning against them to expand the realm.', idiomatic: 'Gaoqi requested a campaign to expand the realm.' },
    { zh: '上曰：「朕但能守祖宗所付足矣，安事外討。」', literal: 'The emperor said: "I need only guard what the ancestors entrusted—that is enough. Why trouble ourselves with external campaigns?"', idiomatic: 'The emperor said, "I need only guard what the ancestors entrusted—that is enough. Why trouble ourselves with external campaigns?"' },
    { zh: '高琪謝曰：「今雨雪應期，皆聖德所致。', literal: 'Gaoqi apologized and said: "Now rain and snow come at the proper season—all due to your sacred virtue.', idiomatic: 'Gaoqi apologized and said, "Now rain and snow come at the proper season—all due to your sacred virtue.' },
    { zh: '而能包容小國，天下幸甚，臣言過矣。」', literal: 'And in being able to embrace a small state, the realm is greatly fortunate. Your subject spoke beyond measure."', idiomatic: 'And in being able to embrace a small state, the realm is greatly fortunate. Your subject spoke beyond measure."' },
    { zh: '四月，遣元帥左都監烏古論慶壽、簽樞密院事完顏賽不經略南邊，尋複下詔罷兵，然自是與宋絕矣。', literal: 'In the fourth month he dispatched Marshal Left Controller Wugulun Qingshou and Bureau of Military Affairs Signatory Wanyan Saibu to oversee the southern frontier; soon an edict again halted the campaign, but from this time relations with Song were severed.', idiomatic: 'In the fourth month he dispatched Marshal Left Controller Wugulun Qingshou and Bureau of Military Affairs signatory Wanyan Saibu to oversee the southern frontier. Soon an edict again halted the campaign, but from this time relations with Song were severed.' },
  ],
  'source-jinshi-106-wikisource-e02aa930e535': [
    { zh: '興定五年正月，尚書省奏：「《章宗實錄》已進呈，衛王事蹟亦宜依《海陵庶人實錄》，纂集成書，以示後世。」', literal: 'In the first month of the fifth year of Xingding, the Department of State Affairs memorialized: "The Veritable Records of Zhangzong have already been presented. The deeds of Prince Wei should likewise be compiled into a book following the Veritable Records of the Deposed Hailing, to show posterity."', idiomatic: 'In the first month of the fifth year of Xingding, the Department of State Affairs memorialized, "The Veritable Records of Zhangzong have already been presented. The deeds of Prince Wei should likewise be compiled into a book following the Veritable Records of the Deposed Hailing, to show posterity."' },
    { zh: '制可。', literal: 'Approved.', idiomatic: 'The memorial was approved.' },
    { zh: '初，胡沙虎弑衛王，立宣宗，一時朝臣皆謂衛王失道，天命絕之，虎實無罪，且有推戴之功，獨張行信抗章言之，不報，舉朝遂以為諱。', literal: 'Earlier, when Hushahu assassinated Prince Wei and enthroned Emperor Xuanzong, court officials for a time all said Prince Wei had lost the Way and Heaven had cut him off; Hu was in fact guiltless and even had the merit of raising the emperor up. Only Zhang Xingxin submitted a memorial stating this; it received no response, and the whole court thereafter treated it as taboo.', idiomatic: 'Earlier, when Hushahu assassinated Prince Wei and enthroned Emperor Xuanzong, court officials for a time all said Prince Wei had lost the Way and Heaven had cut him off; Hu was in fact guiltless and even had the merit of raising the emperor up. Only Zhang Xingxin submitted a memorial stating this; it received no response, and the whole court thereafter treated it as taboo.' },
    { zh: '及是，史官謂益謙嘗事衛王，宜知其事，乃遣編修一人就鄭訪之。', literal: 'At this time the historiographers said Yiqian had once served Prince Wei and ought to know the affair; they therefore sent one compiler to Zheng to interview him.', idiomatic: 'At this time the historiographers said Yiqian had once served Prince Wei and ought to know the affair, so they sent a compiler to Zheng to interview him.' },
    { zh: '益謙知其旨，謂之曰：「知衛王莫如我。', literal: 'Yiqian knew their intent and said to him: "No one knows Prince Wei better than I.', idiomatic: 'Yiqian knew their intent and said to him, "No one knows Prince Wei better than I.' },
    { zh: '然我聞海陵被弑而世宗立，大定三十年，禁近能暴海陵蟄惡者，輒得美仕，故當時史官修實錄多所附會。', literal: 'Yet I have heard that after Hailing was assassinated and Shizong was enthroned, for thirty years of Dading those close to the throne who could expose Hailing\'s hidden evils promptly obtained fine appointments; therefore the historiographers of that time, in compiling the veritable records, largely accommodated themselves.', idiomatic: 'Yet I have heard that after Hailing was assassinated and Shizong was enthroned, for thirty years of Dading those close to the throne who could expose Hailing\'s hidden evils promptly obtained fine appointments; therefore the historiographers of that time, in compiling the veritable records, largely accommodated themselves.' },
    { zh: '衛王為人勤儉，慎惜名器，較其行事，中材不及者多矣。', literal: 'Prince Wei was frugal and careful with titles and offices; compared with his conduct, many of merely middling talent fell short.', idiomatic: 'Prince Wei was frugal and careful with titles and offices; compared with his conduct, many of merely middling talent fell short.' },
    { zh: '吾知此而已，設欲飾吾言以實其罪，吾亦何惜餘年。」', literal: 'I know only this. If you wish to adorn my words to substantiate his guilt, what do I care for the years that remain?"', idiomatic: 'I know only this. If you wish to adorn my words to substantiate his guilt, what do I care for the years that remain?"' },
    { zh: '朝議偉之。', literal: 'Court opinion admired him.', idiomatic: 'Court opinion admired him.' },
    { zh: '正大三年，年八十，薨。', literal: 'In the third year of Zhengda, at age eighty, he died.', idiomatic: 'In the third year of Zhengda, at age eighty, he died.' },
    { zh: '三子：賢卿、頤卿、翔卿，皆以門資入仕。', literal: 'He had three sons: Xianqing, Yiqing, and Xiangqing—all entered office through hereditary privilege.', idiomatic: 'He had three sons: Xianqing, Yiqing, and Xiangqing—all entered office through hereditary privilege.' },
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

execSync(`node scripts/mark-source-correspondence.mjs --queue ${QUEUE} --item source-jinshi-106-wikisource-15ccc7678602 --decision applied --notes "Inserted eleven-sentence Zhang Xingjian biography opening after subsection heading s0043; preserved heading and added manual translations." --reviewer sdk-repair-chapter`, { stdio: 'inherit' });

console.log('Applied remaining source correspondence items.');
