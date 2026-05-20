#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.022, Bright Hall treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/022.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex });
    }
    blockIndex++;
  }
  return out;
}

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}


const T = {
  s0501: {
    literal: 'Below the Bright Hall, a circular moat with iron channels was laid, as the image of the Ring Moat.',
    idiomatic: 'Below the Bright Hall, a circular moat with iron channels was laid, as the image of the Ring Moat',
  },
  s0502: {
    literal: 'In the third month of Tianche Wansui year 2, the Bright Hall was rebuilt and completed, titled the Hall of Piercing Heaven.',
    idiomatic: 'In the third month of Tianche Wansui year 2, the Bright Hall was rebuilt and completed, titled the Hall of Piercing Heaven',
  },
  s0503: {
    literal: 'On the first day of the fourth month, the personal offering rite was again performed, a great amnesty proclaimed, and the era name changed to Wansui Tongtian.',
    idiomatic: 'On the first day of the fourth month, the personal offering was again performed, a great amnesty proclaimed, and the era changed to Wansui Tongtian.',
  },
  s0504: {
    literal: 'The next day, Wu Zetian attended the Screen Hall of the Hall of Piercing Heaven, ordered the responsible offices to read the seasonal ordinances, and dispensed government to the host of nobles.',
    idiomatic: 'The next day, Wu Zetian attended the Screen Hall of the Hall of Piercing Heaven, ordered the offices to read the seasonal ordinances, and dispensed government to the nobles.',
  },
  s0505: {
    literal: 'That year, bronze was cast into the Nine Provinces cauldrons; when completed, they were placed in the Bright Hall courtyard, each arrayed by its directional position.',
    idiomatic: 'That year bronze was cast into the Nine Provinces cauldrons; when completed, they were placed in the Bright Hall courtyard, each arrayed by direction.',
  },
  s0506: {
    literal: 'The Divine Capital cauldron was one zhang eight chi high and held one thousand eight hundred shi.',
    idiomatic: 'The Divine Capital cauldron was one zhang eight chi high and held one thousand eight hundred shi',
  },
  s0507: {
    literal: 'The Jizhou cauldron was named Martial Flourishing, Yongzhou cauldron Long Peace, Yanzhou cauldron Sun Vista, Qingzhou cauldron Lesser Yang, Xuzhou cauldron Eastern Plain, Yangzhou cauldron River Capital, Jingzhou cauldron River Mound, Liangzhou cauldron Chengdu.',
    idiomatic: 'The Jizhou cauldron was named Martial Flourishing, Yongzhou Long Peace, Yanzhou Sun Vista, Qingzhou Lesser Yang, Xuzhou Eastern Plain, Yangzhou River Capital, Jingzhou River Mound, Liangzhou Chengdu.',
  },
  s0508: {
    literal: 'The eight provincial cauldrons were one zhang four chi high, each holding one thousand two hundred shi.',
    idiomatic: 'The eight provincial cauldrons were one zhang four chi high, each holding one thousand two hundred shi',
  },
  s0509: {
    literal: 'Director of Agriculture Zong Jinqing was made commissioner of the Nine Cauldrons; in all five hundred sixty thousand seven hundred twelve jin of copper were used.',
    idiomatic: 'Director of Agriculture Zong Jinqing was made commissioner of the Nine Cauldrons— in all five hundred sixty thousand seven hundred twelve jin of copper were used.',
  },
  s0510: {
    literal: 'On the cauldrons were painted the mountains, rivers, and products of each province; Writing Gentleman of the Works Office Jia Yingfu, Palace Administration Vice Director Xue Changrong, Phoenix Pavilion Principal Clerk Li Yuanzhen, Agriculture Office Recorder Zhong Shaojing, and others were ordered to inscribe the titles separately; Left Palace Workshop Office Director Cao Yuanlang painted the designs.',
    idiomatic: 'On the cauldrons were painted each province\'s mountains, rivers, and products; Jia Yingfu, Xue Changrong, Li Yuanzhen, Zhong Shaojing, and others inscribed titles; Cao Yuanlang painted the designs.',
  },
  s0511: {
    literal: 'When the cauldrons were completed, they were dragged in from outside the Dark Warrior Gate; chancellors and kings of various ranks led more than a hundred thousand northern and southern Yamen guard soldiers, together with great oxen and white elephants from within the guard, to drag them together.',
    idiomatic: 'When the cauldrons were completed, they were dragged in from outside the Dark Warrior Gate; chancellors and kings led more than a hundred thousand guard soldiers, with great oxen and white elephants from the inner guard, to drag them together.',
  },
  s0512: {
    literal: 'Wu Zetian herself composed the "Dragging Cauldron Song" and ordered ministers to sing in response.',
    idiomatic: 'Wu Zetian herself composed the "Dragging Cauldron Song" and ordered ministers to sing in response',
  },
  s0513: {
    literal: 'At that time a great ceremonial bell was also made, gathering gold of the third rank from all under Heaven—it was never completed.',
    idiomatic: 'At that time a great ceremonial bell was also made, gathering third-rank gold from all under Heaven—it was never completed.',
  },
  s0514: {
    literal: 'When the Nine Cauldrons were first completed, it was wished to gild them with a thousand liang of gold.',
    idiomatic: 'When the Nine Cauldrons were first completed, it was wished to gild them with a thousand liang of gold',
  },
  s0515: {
    literal: 'Chancellor Yao Shuang said: "Cauldrons are spirit vessels; they are honored for plain substance, with no need to make separate floating ornament.',
    idiomatic: 'Chancellor Yao Shuang said: "Cauldrons are spirit vessels; they are honored for plain substance, with no need for floating ornament.',
  },
  s0516: {
    literal: 'Your servant observes their form—light of five colors, brilliant and interwoven among them; why wait for gold color to make them dazzle?"',
    idiomatic: 'Your servant observes their form—light of five colors, brilliant and interwoven; why wait for gold to dazzle?"',
  },
  s0517: {
    literal: 'The plan was stopped.',
    idiomatic: 'The plan was stopped',
  },
  s0518: {
    literal: 'In the ninth month of that year, the great offering was again performed at the Hall of Piercing Heaven.',
    idiomatic: 'In the ninth month of that year, the great offering was again performed at the Hall of Piercing Heaven',
  },
  s0519: {
    literal: 'Because the Khitan were destroyed and the Nine Cauldrons newly completed, a great amnesty was proclaimed.',
    idiomatic: 'Because the Khitan were destroyed and the Nine Cauldrons newly completed, a great amnesty was proclaimed',
  },
  s0520: {
    literal: 'The era name was changed to Divine Achievement.',
    idiomatic: 'The era name was changed to Divine Achievement',
  },
  s0521: {
    literal: 'In the first month of Shenglü year 1, the personal offering and receiving court congratulations were again performed.',
    idiomatic: 'In the first month of Shenglü year 1, the personal offering and court congratulations were again performed.',
  },
  s0522: {
    literal: 'Shortly an ordinance was made: on the first day of each month perform the announcing-new-moon rite at the Bright Hall.',
    idiomatic: 'Shortly an ordinance was made: on the first day of each month perform the announcing-new-moon rite at the Bright Hall',
  },
  s0523: {
    literal: 'Ritual Office Erudite Pilu Renxu submitted a deliberation, saying:',
    idiomatic: 'Erudite Pilu Renxu submitted a deliberation, :',
  },
  s0524: {
    literal: 'Respectfully per the canonical texts of classics and histories, there is no affair of the Son of Heaven announcing the new moon each month.',
    idiomatic: 'Respectfully per classics and histories, there is no Son of Heaven announcing the new moon each month.',
  },
  s0525: {
    literal: 'Only the Record of Rites, Jade Regalia, says: "The Son of Heaven hears the new moon outside the southern gate."',
    idiomatic: 'the Record of Rites, Jade Regalia, says: "The Son of Heaven hears the new moon outside the southern gate."',
  },
  s0526: {
    literal: 'The Zhou Offices, Heavenly Offices, Grand Steward: "On the auspicious day of the first month, dispense government to the states, capitals, and districts."',
    idiomatic: 'the Zhou Offices, Heavenly Offices, Grand Steward: "On the auspicious day of the first month, dispense government to the states, capitals, and districts."',
  },
  s0527: {
    literal: 'Gan Bao\'s note says: "The Zhou calendar beginning in the zi month—the day of announcing the new moon."',
    idiomatic: 'Gan Bao notes: "The Zhou calendar beginning in the zi month—the day of announcing the new moon."',
  },
  s0528: {
    literal: 'This is the hearing the new moon of Jade Regalia.',
    idiomatic: 'This is the hearing the new moon of Jade Regalia',
  },
  s0529: {
    literal: 'Now each year on New Year\'s Day at the Hall of Piercing Heaven court is received, seasonal ordinances read, government dispensed—capital officials of the ninth rank and above and gathering envoys from the prefectures all stand in the court: this completes the hearing-the-new-moon rite and accords with the texts of Zhou Offices and Jade Regalia.',
    idiomatic: 'Now each New Year\'s Day at the Hall of Piercing Heaven court is received, ordinances read, government dispensed—capital officials of the ninth rank and above and gathering envoys all stand in court: this completes hearing the new moon and accords with Zhou Offices and Jade Regalia.',
  },
  s0530: {
    literal: 'Yet Zheng Xuan\'s note on Jade Regalia "hearing the new moon," because Qin institutions\' monthly ordinances had the Five Emperors and Five Official Spirits affair, thus says: "Whenever hearing the new moon, one must use a special victim to announce that month\'s Emperor and its spirit, matching King Wen and King Wu."',
    idiomatic: 'Yet Zheng Xuan\'s note on "hearing the new moon," because Qin monthly ordinances had Five Emperors and Five Official Spirits, says: "Whenever hearing the new moon, use a special victim to announce that month\'s Emperor and spirit, matching King Wen and King Wu."',
  },
  s0531: {
    literal: 'This is Zheng\'s erroneous note.',
    idiomatic: 'This is Zheng\'s error.',
  },
  s0532: {
    literal: 'Thus from Han and Wei to the present none have used it.',
    idiomatic: 'from Han and Wei to the present none have used it.',
  },
  s0533: {
    literal: 'Per the Monthly Ordinances saying "its Emperor Taihao, its spirit Goumang"—that means announcing seasonal ordinances, informing those below; the ordinance words say its Emperor, its spirit.',
    idiomatic: 'Per the Monthly Ordinances saying "its Emperor Taihao, its spirit Goumang"—that means announcing seasonal ordinances to those below; the ordinance words say its Emperor, its spirit.',
  },
  s0534: {
    literal: 'Therefore it is respectful granting text, wishing to make people observe the season and attend to their work.',
    idiomatic: 'Therefore it is respectful granting text, wishing people to observe the season and attend to their work.',
  },
  s0535: {
    literal: 'Each month has an ordinance, hence it is called Monthly Ordinances—not meaning that on the Son of Heaven\'s monthly new-moon day he matches ancestors to Emperors and inspects and announces.',
    idiomatic: 'Each month has an ordinance, hence Monthly Ordinances—not that on the Son of Heaven\'s new-moon day he matches ancestors to Emperors and announces.',
  },
  s0536: {
    literal: 'The monthly announcing of the new moon is the rite of feudal lords.',
    idiomatic: 'The monthly announcing of the new moon is the rite of feudal lords',
  },
  s0537: {
    literal: 'Thus the Zuo Commentary says: "The duke having already viewed the new moon, thereupon ascended the observation terrace."',
    idiomatic: 'the Zuo Commentary says: "The duke having already viewed the new moon, then ascended the observation terrace."',
  },
  s0538: {
    literal: 'Again Zheng\'s note on the Analects: "Ritual: the lord each month announces the new moon at the temple; if there is sacrifice it is called court offering.',
    idiomatic: 'Zheng\'s note on the Analects: "Ritual: the lord each month announces the new moon at the temple; if there is sacrifice it is called court offering.',
  },
  s0539: {
    literal: 'Lu from Duke Wen onward ceased viewing the new moon."',
    idiomatic: 'lu from Duke Wen onward ceased viewing the new moon."',
  },
  s0540: {
    literal: 'Thus the feudal lords\' rite is clear.',
    idiomatic: 'the feudal lords\' rite is clear.',
  },
  s0541: {
    literal: 'Now for the king to perform it is unheard of.',
    idiomatic: 'Now for the king to perform it is unheard of',
  },
  s0542: {
    literal: 'Per Zheng\'s so-called announcing to the Emperors—that is Taihao and the other five Emperor spirits; the spirits are Chongli and the other Five Phase officials.',
    idiomatic: 'Per Zheng\'s announcing to the Emperors—that is Taihao and the other five; the spirits are Chongli and the other Five Phase officials.',
  },
  s0543: {
    literal: 'Though their achievements benefited people and they are listed in the sacrifice canon, there is no text of the Son of Heaven bowing and sacrificing and announcing the new moon each month.',
    idiomatic: 'Though their achievements benefited people and they are in the sacrifice canon, there is no Son of Heaven bowing and announcing the new moon each month.',
  },
  s0544: {
    literal: 'Your servants respectfully examined Ritual Discussions, Three Rites Meaning Summaries, Jiangdu Collected Rites, Zhenguan Rites, Xianqing Rites, and sacrifice ordinances—nowhere is there the Son of Heaven announcing the new moon each month.',
    idiomatic: 'Your servants examined Ritual Discussions, Three Rites Meaning Summaries, Jiangdu Collected Rites, Zhenguan Rites, Xianqing Rites, and sacrifice ordinances—nowhere the Son of Heaven announcing the new moon each month.',
  },
  s0545: {
    literal: 'If one thinks that because there was no Bright Hall in the age there was no announcing-new-moon rite, then Jiangdu Collected Rites, Zhenguan Rites, Xianqing Rites, and sacrifice ordinances record sacrificing to the Five Directional High Gods at the Bright Hall—that is the Classic of Filial Piety\'s "zong sacrifice to King Wen at the Bright Hall."',
    idiomatic: 'If one thinks no Bright Hall meant no announcing-new-moon rite, then Jiangdu Collected Rites, Zhenguan Rites, Xianqing Rites, and sacrifice ordinances record Five Directional High Gods at the Bright Hall—the Classic of Filial Piety\'s "zong sacrifice to King Wen at the Bright Hall."',
  },
  s0546: {
    literal: 'Thus without Bright Hall the offering sacrifice is recorded—why alone is announcing the new moon missing from the text?',
    idiomatic: 'Thus without Bright Hall the offering is recorded—why alone is announcing the new moon missing?',
  },
  s0547: {
    literal: 'If one thinks that when the ruler has a Bright Hall he should announce the new moon, then Zhou and Qin had Bright Halls, yet canonical texts nowhere have the Son of Heaven announcing the new moon each month.',
    idiomatic: 'If when the ruler has a Bright Hall he should announce the new moon, Zhou and Qin had Bright Halls, yet canonical texts nowhere have the Son of Heaven announcing the new moon each month.',
  },
  s0548: {
    literal: 'Your servants have examined past and present through the ages, broadly consulted records—since there is no rite, one cannot practice error.',
    idiomatic: 'Your servants have examined past and present, broadly consulted records—since there is no rite, one cannot practice error.',
  },
  s0549: {
    literal: 'We hope the monthly first-day announcing-new-moon sacrifice may be stopped to rectify the state canon.',
    idiomatic: 'We hope the monthly first-day announcing-new-moon sacrifice may be stopped to rectify the state canon',
  },
  s0550: {
    literal: 'Your servant thinks the Son of Heaven\'s dignity using feudal lords\' rite is not what is meant by issuing announced new moon to feudal lords and making them receive and perform it.',
    idiomatic: 'Your servant thinks the Son of Heaven\'s dignity using feudal lords\' rite is not what is meant by issuing announced new moon to feudal lords for them to perform.',
  },
  s0551: {
    literal: 'Phoenix Pavilion Vice Director Wang Fangqing also submitted a deliberation, saying:',
    idiomatic: 'Vice Director Wang Fangqing also submitted a deliberation, :',
  },
  s0552: {
    literal: 'Respectfully per the Bright Hall—it is the Son of Heaven\'s palace for dispensing government.',
    idiomatic: 'per the Bright Hall—it is the Son of Heaven\'s palace for dispensing government.',
  },
  s0553: {
    literal: 'Broadly it is to accord with Heaven\'s qi, order the myriad things, move taking the Two Modes as model, virtue covering the four seas.',
    idiomatic: 'Broadly it accords with Heaven\'s qi, orders the myriad things, moves taking the Two Modes as model, virtue covering the four seas.',
  },
  s0554: {
    literal: 'Xia called it Generations Chamber, Yin called it Layered Roof, Ji called it Bright Hall—these are the three dynasties\' names.',
    idiomatic: 'Xia called it Generations Chamber, Yin Layered Roof, Zhou Bright Hall—the names of three dynasties.',
  },
  s0555: {
    literal: 'The Bright Hall is the Son of Heaven\'s Grand Temple, whereby he zong-sacrifices his ancestors, matching the High God.',
    idiomatic: 'The Bright Hall is the Son of Heaven\'s Grand Temple, whereby he zong-sacrifices his ancestors, matching the High God',
  },
  s0556: {
    literal: 'East is Azure Yang, south Bright Hall, west Total Splendor, north Dark Hall, center Grand Chamber.',
    idiomatic: 'East is Azure Yang, south Bright Hall, west Total Splendor, north Dark Hall, center Grand Chamber',
  },
  s0557: {
    literal: 'Though there are five names, Bright Hall is taken as primary.',
    idiomatic: 'Though there are five names, Bright Hall is primary.',
  },
  s0558: {
    literal: 'Han dynasty accomplished scholars and penetrating ru all took Bright Hall and Grand Temple as one.',
    idiomatic: 'Han accomplished scholars and penetrating ru all took Bright Hall and Grand Temple as one.',
  },
  s0559: {
    literal: 'Han Left Palace Gentleman Cai Yong established the deliberation, also holding it so.',
    idiomatic: 'Han Left Palace Gentleman Cai Yong established the deliberation, also holding it so',
  },
  s0560: {
    literal: 'Taking its zong sacrifice, it is called Pure Temple;',
    idiomatic: 'taking its zong sacrifice, it is called Pure Temple;',
  },
  s0561: {
    literal: 'taking its main chamber, it is called Grand Chamber;',
    idiomatic: 'as main chamber, it is called Grand Chamber;',
  },
  s0562: {
    literal: 'taking its facing the sun, it is called Bright Hall;',
    idiomatic: 'as the sun-facing hall, it is called Bright Hall;',
  },
  s0563: {
    literal: 'taking its establishing study, it is called Grand Academy;',
    idiomatic: 'as the place of learning, it is called Grand Academy;',
  },
  s0564: {
    literal: 'taking its circular water, it is called Ring Moat.',
    idiomatic: 'taking its circular water, it is called Ring Moat',
  },
  s0565: {
    literal: 'Different names, same affair—antiquity\'s institution.',
    idiomatic: 'Different names, same affair—antiquity\'s institution',
  },
  s0566: {
    literal: 'The Son of Heaven on the first xin day of the first month of early spring at the southern suburb altogether receives the twelve months\' government, returns and stores it in the ancestral temple, each month taking one government and issuing it at the Bright Hall.',
    idiomatic: 'The Son of Heaven on the first xin day of early spring at the southern suburb receives the twelve months\' government, returns and stores it in the ancestral temple, each month taking one government and issuing it at the Bright Hall.',
  },
  s0567: {
    literal: 'Feudal lords in the early-spring month attend the Son of Heaven, receive the twelve months\' government and store it in the ancestral temple, each month taking one government and performing it.',
    idiomatic: 'Feudal lords in early spring attend the Son of Heaven, receive the twelve months\' government and store it in the ancestral temple, each month taking one government and performing it.',
  },
  s0568: {
    literal: 'Broadly this harmonizes yin and yang and accords with Heaven\'s Way.',
    idiomatic: 'Broadly this harmonizes yin and yang and accords with Heaven\'s Way',
  },
  s0569: {
    literal: 'Thus calamity and disorder do not arise, disasters and harms are not born.',
    idiomatic: 'Thus calamity and disorder do not arise, disasters are not born.',
  },
  s0570: {
    literal: 'Thus Confucius beautifully praised it, saying: "The enlightened king uses filial piety to order all under Heaven."',
    idiomatic: 'Thus Confucius praised it beautifully: "The enlightened king uses filial piety to order all under Heaven."',
  },
  s0571: {
    literal: 'The lord announcing ritual at the temple is called announcing the new moon;',
    idiomatic: 'the lord announcing ritual at the temple is called announcing the new moon;',
  },
  s0572: {
    literal: 'hearing and viewing that month\'s government is called viewing the new moon, also called hearing the new moon.',
    idiomatic: 'hearing and viewing that month\'s government is called viewing the new moon, also hearing the new moon.',
  },
  s0573: {
    literal: 'Though there are three names, the substance is one.',
    idiomatic: 'Though there are three names, the substance is one',
  },
  s0574: {
    literal: 'Now the ritual officers\' deliberation says "canonical texts of classics and histories have no Son of Heaven announcing the new moon each month."',
    idiomatic: 'Now the ritual officers say "canonical texts have no Son of Heaven announcing the new moon each month."',
  },
  s0575: {
    literal: 'Your servant respectfully per the Spring and Autumn: "Duke Wen year 6, intercalary tenth month—did not announce the new moon."',
    idiomatic: 'respectfully per the Spring and Autumn: "Duke Wen year 6, intercalary tenth month—did not announce the new moon."',
  },
  s0576: {
    literal: 'The Guliang Commentary says: "Intercalation is the month\'s surplus days; the Son of Heaven does not announce the new moon for it."',
    idiomatic: 'The Guliang Commentary says: "Intercalation is the month\'s surplus days— the Son of Heaven does not announce the new moon for it."',
  },
  s0577: {
    literal: 'The Zuo Commentary says: "Not announcing intercalary new moon is uncanonical.',
    idiomatic: 'The Zuo Commentary says: "Not announcing intercalary new moon is uncanonical',
  },
  s0578: {
    literal: 'Intercalation corrects the seasons; seasons make affairs; affairs thicken life—the way of the living is therein.',
    idiomatic: 'Intercalation corrects the seasons— seasons make affairs— affairs thicken life—the way of the living is therein.',
  },
  s0579: {
    literal: 'Not announcing intercalary new moon abandons seasonal government."',
    idiomatic: 'not announcing intercalary new moon abandons seasonal government."',
  },
  s0580: {
    literal: 'By this text of your servant, the Son of Heaven also announces new moon in intercalary months.',
    idiomatic: 'By this text, the Son of Heaven also announces new moon in intercalary months.',
  },
  s0581: {
    literal: 'How could there be other months while abandoning the rite?',
    idiomatic: 'how could there be other months while abandoning the rite?',
  },
  s0582: {
    literal: 'Broadly examining classics and histories, the text is very plain.',
    idiomatic: 'Broadly examining classics and histories, the text is very plain',
  },
  s0583: {
    literal: 'How is it clear?',
    idiomatic: 'how is it clear?',
  },
  s0584: {
    literal: 'Zhou Offices, Grand Clerk\'s duty: "Issue announced new moon to the states.',
    idiomatic: 'Zhou Offices, Grand Clerk\'s duty: "Issue announced new moon to the states',
  },
  s0585: {
    literal: 'Intercalary month—announce to the king dwelling at the gate for the full month."',
    idiomatic: 'intercalary month—announce to the king dwelling at the gate for the full month."',
  },
  s0586: {
    literal: 'Again Record of Rites, Jade Regalia: "In intercalary month close the gate\'s left leaf and stand within it."',
    idiomatic: 'Record of Rites, Jade Regalia: "In intercalary month close the gate\'s left leaf and stand within it."',
  },
  s0587: {
    literal: 'Both are the Son of Heaven performing announcing-new-moon affairs in intercalary months.',
    idiomatic: 'Both are the Son of Heaven performing announcing-new-moon affairs in intercalary months',
  },
  s0588: {
    literal: 'The ritual officers also say: "Jade Regalia, \'the Son of Heaven hears the new moon outside the southern gate.\'',
    idiomatic: 'Ritual officers say: "Jade Regalia, \'the Son of Heaven hears the new moon outside the southern gate.\'',
  },
  s0589: {
    literal: 'Zhou Offices, Heavenly Offices, Grand Steward, \'on the auspicious day of the first month, dispense government to the states, capitals, and districts.\'',
    idiomatic: 'zhou Offices, Heavenly Offices, Grand Steward, \'on the auspicious day of the first month, dispense government to the states, capitals, and districts.\'',
  },
  s0590: {
    literal: 'Gan Bao\'s note says, \'the Zhou calendar beginning in the zi month is the day of announcing the new moon.\'',
    idiomatic: 'Gan Bao notes, \'the Zhou calendar beginning in the zi month is the day of announcing the new moon.\'',
  },
  s0591: {
    literal: 'This is Jade Regalia\'s hearing the new moon.',
    idiomatic: 'This is Jade Regalia\'s hearing the new moon',
  },
  s0592: {
    literal: 'Now each year on New Year\'s Day at the Hall of Piercing Heaven court is received, seasonal ordinances read, government dispensed—capital officials of the ninth rank and above and gathering envoys from the prefectures all stand in the court: this completes the hearing-the-new-moon rite and accords with the texts of Zhou Offices and Jade Regalia.',
    idiomatic: 'Now each New Year\'s Day at the Hall of Piercing Heaven court is received, ordinances read, government dispensed—officials of the ninth rank and above and gathering envoys stand in court: this completes hearing the new moon and accords with Zhou Offices and Jade Regalia.',
  },
  s0593: {
    literal: 'Ritual Discussions, Three Rites Meaning Summaries, Jiangdu Collected Rites, Zhenguan Rites, Xianqing Rites, and sacrifice ordinances have no affair of the king announcing the new moon.',
    idiomatic: 'Ritual Discussions, Three Rites Meaning Summaries, Jiangdu Collected Rites, Zhenguan Rites, Xianqing Rites, and sacrifice ordinances have no king announcing the new moon.',
  },
  s0594: {
    literal: 'Your servant respectfully per Jade Regalia: "Dark regalia and attend the sun at the eastern gate outside, hear the new moon at the southern gate outside."',
    idiomatic: 'respectfully per Jade Regalia: "Dark regalia and attend the sun at the eastern gate outside, hear the new moon at the southern gate outside."',
  },
  s0595: {
    literal: 'Zheng\'s note says: "Attending the sun is at the time of the spring equinox.',
    idiomatic: 'Zheng notes: "Attending the sun is at the spring equinox.',
  },
  s0596: {
    literal: 'Eastern gate and southern gate both mean the state gate."',
    idiomatic: 'The eastern and southern gates both mean the state gate."',
  },
  s0597: {
    literal: 'The Bright Hall is in the state\'s yang; each month one goes to that season\'s hall to hear the new moon; when the affair is finished, one returns to lodge at the Road Chamber.',
    idiomatic: 'The Bright Hall is in the state\'s yang; each month one goes to that season\'s hall to hear the new moon; when finished, one returns to lodge at the Road Chamber.',
  },
  s0598: {
    literal: 'Whenever hearing the new moon, one must use a special victim to announce that month\'s Emperor and its spirit, matching King Wen and King Wu."',
    idiomatic: 'Whenever hearing the new moon, one must use a special victim to announce that month\'s Emperor and spirit, matching King Wen and King Wu."',
  },
  s0599: {
    literal: 'Your servant thinks that now on New Year\'s Day at the Hall of Piercing Heaven receiving court, reading seasonal ordinances and dispensing government is itself the ancient rite of early spring first xin receiving the twelve months\' government and storing it in the ancestral temple—but taking one government each month and issuing it at the Bright Hall, though the meaning is plain, it is still not performed.',
    idiomatic: 'Your servant thinks New Year\'s Day at the Hall of Piercing Heaven receiving court, reading ordinances and dispensing government is the ancient early-spring first xin rite of receiving twelve months\' government and storing it in the ancestral temple—but taking one government monthly at the Bright Hall, though plain in meaning, is still not performed.',
  },
  s0600: {
    literal: 'If one follows what the ritual officers say, that affair is then lacking.',
    idiomatic: 'If one follows the ritual officers, that affair is then lacking.',
  },
};
const source = loadSentencesFromData();
for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  const pair = T[id];
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${id}: literal and idiomatic must differ`);
  }
}

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '022') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 022; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  const extracted = extractRange(dataPath, START, END);
  for (const row of extracted) {
    const key = row.originalId;
    if (!sessionIds.has(key)) {
      data.sentences.push(row);
      sessionIds.add(key);
    }
  }
  const stillMissing = [...expectedIds].filter((id) => !sessionIds.has(id));
  if (stillMissing.length) {
    console.log(
      `Session lacks ${stillMissing.join(', ')}; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
    );
    process.exit(0);
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src.chinese && row.chinese !== src.chinese) {
    row.chinese = src.chinese;
  } else if (!row.chinese) {
    row.chinese = src.chinese;
  }
}

let applied = 0;
for (const s of data.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ') to', transPath);
