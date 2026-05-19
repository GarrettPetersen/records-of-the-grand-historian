import fs from 'node:fs';

const data = JSON.parse(
  fs.readFileSync('translations/current_translation_songshu.json', 'utf8')
);

const T = {
  s0502: [
    'Now envoys holding credentials, jointly Grand Guardian, Palace Attendant Gentlemen of the Regular Companion, Household Grandee Dan, jointly Grand Commandant, Master of Writing Xuanfan, bearing the imperial seal-cord, performed the rites of receiving the end, all according to Tang-Yao and Han-Wei precedent.',
    'Envoys led by Dan, bearing the imperial seal and cord, performed the succession rites as in the Tang-Yao and Han-Wei precedents.',
  ],
  s0503: [
    'King, accord with human beings and spirits, rule the ten thousand states, timely receive spiritual blessing, and requite Heaven\u2019s entrusted mandate.',
    'Accept the mandate of Heaven and men, rule the myriad realms, receive Heaven\u2019s blessing, and answer the charge Heaven has laid upon you.',
  ],
  s0504: [
    'The King submitted a memorial declining; the Jin emperor had already retired to the Prince of Langye\u2019s residence, and the memorial could not be delivered.',
    'The King memorialized to decline, but the Jin emperor had already moved to the Prince of Langye\u2019s residence and the memorial never reached him.',
  ],
  s0505: [
    'Thereupon Prince of Chenliu Qian Si and others, two hundred seventy men, and the host of ministers of the Song Terrace all memorialized urging accession.',
    'Then Prince of Chenliu Qian Si and two hundred seventy others, with the ministers of the Song court, all memorialized urging him to take the throne.',
  ],
  s0506: [
    'Above still did not permit.',
    'He still refused.',
  ],
  s0507: [
    'Grand Astrologer Luo Da presented dozens of items of celestial signs and omens; the host of ministers again firmly requested, and the King then followed.',
    'Grand Astrologer Luo Da cited dozens of heavenly portents; the ministers pressed again, and at last the King assented.',
  ],
  s0508: [
    'Collation Notes',
    'Textual Collation Notes',
  ],
  s0509: [
    'Unable to make his person frugal\u2014Yan Kejun says: "Below \u2018frugal\u2019 one character may be missing."',
    'Unable to make his person frugal\u2014Yan Kejun notes that a character may be missing after \u201cfrugal.\u201d',
  ],
  s0510: [
    'The Palace Edition commentary says: "Below \u2018person\u2019 there should be the character for \u2018restraint.\u2019"',
    'The Palace Edition commentary proposes that \u201crestraint\u201d should follow \u201cperson.\u201d',
  ],
  s0511: [
    'Or one character meaning \u2018use\u2019 may have dropped below \u2018frugal.\u2019"',
    'Alternatively, the word \u201cuse\u201d may have been lost after \u201cfrugal.\u201d',
  ],
  s0512: [
    'The Duke then advanced in overall supervision\u2014"then" in the History of the Southern Dynasties reads "still."',
    'The Duke then advanced in overall supervision\u2014the Southern History reads \u201cstill\u201d for \u201cthen.\u201d',
  ],
  s0513: [
    'Then swiftly declared it in that year\u2014"declared" in all editions is wrongly written as "from"; corrected according to the Veritable Records of Jiankang and the Yuan Gui 486.',
    'Then swiftly declared it in that year\u2014all editions wrongly read \u201cfrom\u201d for \u201cdeclare\u201d; corrected from the Veritable Records of Jiankang and Yuan Gui 486.',
  ],
  s0514: [
    'Again added the yellow battle-axe\u2014Qian Daxin in Notes on the Twenty-two Histories says: "\u2018Added\u2019 should read \u2018borrowed.\u2019"',
    'Again added the yellow battle-axe\u2014Qian Daxin argues that \u201cadded\u201d should read \u201cborrowed.\u201d',
  ],
  s0515: [
    'Holding credentials one may execute those at two thousand piculs and below; borrowing the yellow battle-axe one may exclusively punish commanders bearing credentials."',
    'With credentials one may execute officials of two thousand piculs and below; with a borrowed yellow battle-axe one may punish commanders on one\u2019s own authority."',
  ],
  s0516: [
    'The allotted age of the dynasty was not yet changed\u2014"allotted age" in all editions reads "ten generations."',
    'The allotted age of the dynasty was not yet changed\u2014all editions read \u201cten generations\u201d for \u201callotted age.\u201d',
  ],
  s0517: [
    'From Western Jin Emperor Wu to Eastern Jin Emperor An there were already fourteen generations; to speak of ten generations has no basis.',
    'From Western Jin Emperor Wu to Eastern Jin Emperor An is already fourteen generations; \u201cten generations\u201d has no warrant.',
  ],
  s0518: [
    '"Ten generations" should be the error for "allotted age"; now corrected.',
    '\u201cTen generations\u201d is the error for \u201callotted age\u201d; corrected here.',
  ],
  s0519: [
    'Last autumn sending Kangzhi to escort back the Lord of Sima\u2014"lord" in all editions reads "army"; corrected according to the Jin History biography of Prince Qiao Gang Wang Xun\u2019s great-grandson Xiuzhi and Yuan Gui 725.',
    'Last autumn sending Kangzhi to return the Sima lord\u2014all editions read \u201carmy\u201d for \u201clord\u201d; corrected from the Jin History and Yuan Gui 725.',
  ],
  s0520: [
    'This was the Duke\u2019s great constancy\u2014all editions omit the character "great"; supplemented according to the History of the Southern Dynasties and the Veritable Records of Jiankang.',
    'This was the Duke\u2019s great constancy\u2014all editions drop \u201cgreat\u201d; restored from the Southern History and Veritable Records of Jiankang.',
  ],
  s0521: [
    'Swept clean in one morning\u2014"swept" in all editions reads "crossed"; corrected according to the History of the Southern Dynasties and the Veritable Records of Jiankang.',
    'Swept clean in one morning\u2014all editions read \u201ccrossed\u201d for \u201cswept\u201d; corrected from the Southern History and Veritable Records of Jiankang.',
  ],
  s0522: [
    'Now command envoys holding credentials, jointly Grand Commandant, Master of Writing, Left Vice Director, Duke of fifth rank of Jinning county Zhan to confer the Chancellor of State seal-cord\u2014all editions omit "now" and "jointly"; supplemented according to the History of the Southern Dynasties and the Veritable Records of Jiankang.',
    'Now command envoys to confer the seal-cord\u2014all editions omit \u201cnow\u201d and \u201cjointly\u201d; restored from the Southern History and Veritable Records of Jiankang.',
  ],
  s0523: [
    'Gold tiger tally first through fifth on the left\u2014"fifth" in all editions reads "tenth"; corrected according to the History of the Southern Dynasties.',
    'Gold tiger tally first through fifth on the left\u2014all editions read \u201ctenth\u201d for \u201cfifth\u201d; corrected from the Southern History.',
  ],
  s0524: [
    'Let the Chancellor of State oversee the hundred officials\u2014all editions omit "let"; supplemented according to the History of the Southern Dynasties and the Veritable Records of Jiankang.',
    'Let the Chancellor of State oversee the hundred officials\u2014all editions omit \u201clet\u201d; restored from the Southern History and Veritable Records of Jiankang.',
  ],
  s0525: [
    'Submit upward the borrowed credentials, Palace Attendant sable cicada, Commander of Court and Country, Grand Tutor, Grand Commandant seal-cord\u2014all editions omit the two characters "sable cicada"; supplemented according to the History of the Southern Dynasties and the Veritable Records of Jiankang.',
    'Submit the borrowed credentials, Palace Attendant insignia, and seals of office\u2014all editions omit \u201csable cicada\u201d; restored from the Southern History and Veritable Records of Jiankang.',
  ],
  s0526: [
    'Sun Miao in Critical Discussion of the History of Song says: "According to the Song and Qi offices, neither shows Palace Attendant seal-cord; probably only court robes, martial cap, and sable cicada were given."',
    'Sun Miao notes that Song and Qi office lists show no Palace Attendant seal-cord\u2014likely only court dress, martial cap, and sable cicada were granted.',
  ],
  s0527: [
    'The History of the Southern Dynasties has the two characters "sable cicada" below Palace Attendant\u2014this is correct."',
    'The Southern History\u2019s \u201csable cicada\u201d after Palace Attendant is correct."',
  ],
  s0528: [
    'Establish Song state Palace Attendant, Yellow Gate Vice Director, Master of Writing Left Assistant, Gentlemen, following the great envoy in welcoming\u2014"Gentlemen" in the Three Dynasties edition, Northern Directorate edition, Mao edition, and Bureau edition are the same.',
    'Establish Song state Palace Attendant, Yellow Gate Vice Director, Master of Writing Left Assistant, and Gentlemen to follow the envoy in welcoming\u2014the Three Dynasties, Northern Directorate, Mao, and Bureau editions agree on \u201cGentlemen.\u201d',
  ],
  s0529: [
    'The Palace Edition and the History of the Southern Dynasties read "chancellor."',
    'The Palace Edition and Southern History read \u201cchancellor.\u201d',
  ],
  s0530: [
    'Li Ciming in Supplement to the Diary of the Yue Mantang says: "It should read \u2018then follow the great envoy in welcoming.\u2019"',
    'Li Ciming proposes the reading \u201cthen follow the great envoy in welcoming.\u201d',
  ],
  s0531: [
    'Wind and clouds mysteriously moved\u2014"mysterious" in all editions reads "words"; corrected according to the Bureau edition, Wen Xuan, Veritable Records of Jiankang, and Yuan Gui 210.',
    'Wind and clouds mysteriously moved\u2014all editions read \u201cwords\u201d for \u201cmysterious\u201d; corrected from the Bureau edition, Wen Xuan, Veritable Records of Jiankang, and Yuan Gui 210.',
  ],
  s0532: [
    'With Xuzhou\u2019s Hailing north, Eastern Sea north, Qiao north, Liang, Yuzhou\u2019s Xincai, Yanzhou\u2019s northern Chenliu, Sizhou\u2019s Chen commandery, Runan, Yingchuan, Xingyang\u2014ten commanderies to enlarge the Song state\u2014the character "north" above "Eastern Sea" is dropped in all editions.',
    'Ten commanderies added to enlarge the Song state\u2014the \u201cnorth\u201d before Eastern Sea is missing in all editions.',
  ],
  s0533: [
    'Supplemented according to the History of the Southern Dynasties and the Veritable Records of Jiankang.',
    'Restored from the Southern History and Veritable Records of Jiankang.',
  ],
};

for (const s of data.sentences) {
  const t = T[s.id];
  if (!t) {
    console.error('missing', s.id);
    process.exit(1);
  }
  s.literal = t[0];
  s.idiomatic = t[1];
}

fs.writeFileSync(
  'translations/current_translation_songshu.json',
  JSON.stringify(data, null, 2) + '\n'
);
console.log('done', data.sentences.length);
