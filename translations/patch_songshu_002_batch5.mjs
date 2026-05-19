import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0502: [
    'Now We send the Bearer of the Staff, concurrently Grand Tutor, Regular Attendant of the Scattered Cavalry, and Grand Master of Splendid Affairs Tan, together with the Grand Commandant and Master of Writing Xuan Fan, to present the imperial seal and cord and perform the ceremony of receiving the mandate, all according to the precedents of Yao and Shun and of Han and Wei.',
    'We now send Tan, Bearer of the Staff, Grand Tutor, Regular Attendant of the Scattered Cavalry, and Grand Master of Splendid Affairs, together with Grand Commandant Xuan Fan of the Masters of Writing, to present the imperial seal and cord and perform the transfer of the mandate, as in the precedents of Yao, Shun, Han, and Wei.',
  ],
  s0503: [
    'O King, respond to the hopes of men and spirits, rule the myriad states, receive timely numinous blessing, and answer the favoring mandate of High Heaven.',
    'O King, answer the call of Heaven and men, rule the myriad realms, receive Heaven\'s blessing in its season, and fulfill the mandate Heaven has granted you.',
  ],
  s0504: [
    'The King submitted a memorial declining; the Jin emperor had already retired to the residence of the Prince of Langye, and the memorial could not be delivered.',
    'The king memorialized his refusal; the Jin emperor had already retired to the Prince of Langye\'s residence, and the memorial could not reach him.',
  ],
  s0505: [
    'Thereupon the Prince of Chenliu Qian Si and two hundred seventy others, together with the Song court ministers, all submitted memorials urging him to ascend.',
    'Then Prince of Chenliu Qian Si and two hundred seventy others, with the ministers of the Song court, all memorialized urging him to take the throne.',
  ],
  s0506: [
    'He still would not consent.',
    'He still refused.',
  ],
  s0507: [
    'The Director of the Astronomy Bureau Luo Da presented several dozen items of celestial signs and portents; the ministers again pressed firmly, and the King at last assented.',
    'Astronomy Director Luo Da presented dozens of celestial omens; the ministers pressed again, and the king at last agreed.',
  ],
  s0508: [
    'Collation Notes',
    'Textual Collation Notes',
  ],
  s0509: [
    'Unable to practice frugality in person—Yan Kejun says: "Below jian (frugality) one character was probably lost."',
    'Unable to practice frugality in person—Yan Kejun notes: "A character is probably missing below jian (frugality)."',
  ],
  s0510: [
    '" The Palace Edition collation says: "Below gong (body) there should be the character jie (restraint)."',
    '" The Palace Edition collation says: "Below gong (body) the character jie (restraint) should be read."',
  ],
  s0511: [
    'Or below jian (frugality) the character yong (use) was lost."',
    'Or the character yong (use) was lost below jian (frugality)."',
  ],
  s0512: [
    'The Duke then advanced in overall supervision—"then" in the History of the Southern Dynasties reads "still."',
    'The Duke then advanced in overall supervision—"then" (nai) in the Nan shi reads "still" (reng).',
  ],
  s0513: [
    'Then quickly reported it in that year—"reported" (shen) in all editions is erroneously written "from" (you); corrected according to the Veritable Records of Jiankang and the Yuan gui 486.',
    'Then quickly reported it in that year—"reported" (shen) is wrongly written "from" (you) in all editions; corrected per the Veritable Records of Jiankang and Yuan gui 486.',
  ],
  s0514: [
    'Again given the yellow battle-axe—Qian Daxin in his Notes on the Twenty-two Histories says: "Jia (given) should read jia (borrowed).',
    'Again given the yellow battle-axe—Qian Daxin notes: "Given (jia) should read borrowed (jia).',
  ],
  s0515: [
    'The Bearer of the Staff may execute those below two thousand piculs; with a borrowed yellow battle-axe one may exclusively execute commanders bearing credentials."',
    'The Bearer of the Staff may execute officials below two thousand piculs; with a borrowed yellow battle-axe one may execute generals holding credentials."',
  ],
  s0516: [
    'The allotted age not yet changed—"allotted age" (bu shi) in all editions reads "ten generations" (shi shi).',
    'The allotted age not yet changed—"allotted age" (bu shi) appears as "ten generations" (shi shi) in all editions.',
  ],
  s0517: [
    'From Western Jin Emperor Wu to Eastern Jin Emperor An is already fourteen generations; to speak of ten generations has no basis.',
    'From Western Jin Emperor Wu to Eastern Jin Emperor An is already fourteen generations; "ten generations" has no basis.',
  ],
  s0518: [
    '"Ten generations" must be an error for "allotted age"; now corrected.',
    '"Ten generations" is an error for "allotted age"; corrected here.',
  ],
  s0519: [
    'Last autumn Kangzhi was sent to return him to the Master of Records—"lord" (jun) in all editions reads "army" (jun); corrected according to the Jin shu biography of Prince Qiao Gang Wang Xun, great-grandson Xun, appendix biography of Xiuzhi, and Yuan gui 725.',
    'Last autumn Kangzhi was sent to return him to the Master of Records—"lord" (jun) is written "army" (jun) in all editions; corrected per the Jin shu and Yuan gui 725.',
  ],
  s0520: [
    'This is the great integrity of the Duke—all editions omit the character "great"; supplied according to the Nan shi and Veritable Records of Jiankang.',
    'This is the Duke\'s great integrity—all editions omit "great"; supplied from the Nan shi and Veritable Records of Jiankang.',
  ],
  s0521: [
    'Swept clean in a morning—"swept" (di) in all editions reads "crossed" (ji); corrected according to the Nan shi and Veritable Records of Jiankang.',
    'Swept clean in a morning—"swept" (di) is written "crossed" (ji) in all editions; corrected per the Nan shi and Veritable Records of Jiankang.',
  ],
  s0522: [
    'Now command the Bearer of the Staff, concurrently Grand Commandant, Master of Writing Left Vice Director, and Baron of the fifth rank of Jinning county Zhan to confer the Chancellor of State seal and cord—all editions omit "now" and "concurrently"; both supplied according to the Nan shi and Veritable Records of Jiankang.',
    'Now command Zhan, Bearer of the Staff, Grand Commandant, and Left Vice Director of the Masters of Writing, to confer the Chancellor of State seal and cord—all editions omit "now" and "concurrently"; supplied from the Nan shi and Veritable Records of Jiankang.',
  ],
  s0523: [
    'Gold tiger tallies first through fifth on the left—"fifth" in all editions reads "tenth"; corrected according to the Nan shi.',
    'Gold tiger tallies one through five on the left—"fifth" is written "tenth" in all editions; corrected per the Nan shi.',
  ],
  s0524: [
    'Let him as Chancellor of State oversee the hundred offices—all editions omit "as"; supplied according to the Nan shi and Veritable Records of Jiankang.',
    'Let him as Chancellor of State oversee all government—all editions omit "as"; supplied from the Nan shi and Veritable Records of Jiankang.',
  ],
  s0525: [
    'He shall return the borrowed staff, Palace Attendants insignia, and seals of Grand Tutor and Grand Commandant of the inner and outer command—all editions omit the two characters "sable cicada"; supplied according to the Nan shi and Veritable Records of Jiankang.',
    'He shall return the borrowed staff, Palace Attendants sable-cicada insignia, and seals of Grand Tutor and Grand Commandant—all editions omit "sable cicada"; supplied from the Nan shi and Veritable Records of Jiankang.',
  ],
  s0526: [
    'Sun Biao in his Critical Discussion of the Song shu says: "According to the Song and Qi offices, neither shows the Palace Attendants seal and cord; probably only court robes, martial cap, and sable cicada were given.',
    'Sun Biao notes: "The Song and Qi offices lists show no Palace Attendants seal and cord; likely only court robes, martial cap, and sable cicada were granted.',
  ],
  s0527: [
    'The Nan shi has the two characters sable cicada below Palace Attendant—that is correct."',
    'The Nan shi has sable cicada below Palace Attendant—that is correct."',
  ],
  s0528: [
    'Establish in the state of Song Palace Attendants, Gentlemen of the Yellow Gate, Left Assistant of the Masters of Writing, and Gentlemen to follow the great envoy in welcoming—"Gentlemen" (lang) is the same in the Three Dynasties edition, Beijian edition, Mao edition, and Bureau edition.',
    'Establish Palace Attendants, Gentlemen of the Yellow Gate, the Left Assistant of the Masters of Writing, and Gentlemen in Song to follow the great envoy in welcoming—"Gentlemen" (lang) is the same in the Three Dynasties, Beijian, Mao, and Bureau editions.',
  ],
  s0529: [
    'The Palace Edition and Nan shi read "minister" (xiang).',
    'The Palace Edition and Nan shi read "minister" (xiang) instead.',
  ],
  s0530: [
    'Li Ciming in his Supplement to the Diary of the Yue Man Hall says: "It should read immediately follow the great envoy in welcoming."',
    'Li Ciming notes: "It should read immediately follow the great envoy in welcoming."',
  ],
  s0531: [
    'Wind and cloud mysteriously responsive—"mysterious" (xuan) in all editions reads "words" (yan); corrected according to the Bureau edition, Wen xuan, Veritable Records of Jiankang, and Yuan gui 210.',
    'Wind and cloud mysteriously responsive—"mysterious" (xuan) is written "words" (yan) in all editions; corrected per the Bureau edition, Wen xuan, Veritable Records of Jiankang, and Yuan gui 210.',
  ],
  s0532: [
    'Adding to the state of Song the ten commanderies Hailing of Xuzhou, Northern Donghai, Northern Qiao, Northern Liang of Yuzhou, Xincai, Northern Chenliu of Yanzhou, Chen commandery, Runan, Yingchuan, and Xingyang of Sizhou—the character "northern" above "Donghai" was lost in all editions.',
    'Adding to Song ten commanderies: Hailing of Xuzhou, Northern Donghai, Northern Qiao, Northern Liang of Yuzhou, Xincai, Northern Chenliu of Yanzhou, Chen, Runan, Yingchuan, and Xingyang of Sizhou—the "northern" before "Donghai" was lost in all editions.',
  ],
  s0533: [
    'Supplied according to the Nan shi and Veritable Records of Jiankang.',
    'Supplied from the Nan shi and Veritable Records of Jiankang.',
  ],
};

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) {
    console.error('Missing translation for', s.id);
    process.exit(1);
  }
  s.literal = pair[0];
  s.idiomatic = pair[1];
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('Patched', Object.keys(T).length, 'sentences');
