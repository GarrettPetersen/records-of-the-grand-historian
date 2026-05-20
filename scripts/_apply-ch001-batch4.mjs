#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/001.json';
const transPath = 'translations/current_translation_jiutangshu.json';

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

const T = {
  s0301: {
    literal:
      'On guiyou he visited Mount Zhongnan and paid his respects at the temple of Laozi.',
    idiomatic:
      'On guiyou he went to Mount Zhongnan and made offering at the temple of Laozi.',
  },
  s0302: {
    literal: 'In the eleventh month, on wuchen, he conducted a hunt at Gaoling.',
    idiomatic: 'In the eleventh month, on wuchen, he held a hunt at Gaoling.',
  },
  s0303: {
    literal: 'On gengwu he returned from Qing Shan Palace.',
    idiomatic: 'On gengwu he came back from Qing Shan Palace.',
  },
  s0304: {
    literal:
      'In the eighth year of Wude, in the spring of the second month, on jisi, he personally reviewed prisoners and pardoned many.',
    idiomatic:
      'In the eighth year of Wude, on jisi of the second spring month, he personally examined prisoners and granted many pardons.',
  },
  s0305: {
    literal: 'In the fourth month of summer, the Taihe Palace was built on Mount Zhongnan.',
    idiomatic: 'In the fourth summer month work began on Taihe Palace in the Zhongnan range.',
  },
  s0306: {
    literal: 'In the sixth month, on jiazi, he visited Taihe Palace.',
    idiomatic: 'In the sixth month, on jiazi, he went to Taihe Palace.',
  },
  s0307: {
    literal:
      'The Turks raided Dingzhou; he ordered the crown prince to go to Youzhou and the Prince of Qin to Bingzhou to guard against the Turks.',
    idiomatic:
      'When the Turks struck Dingzhou, he sent the crown prince to Youzhou and the Prince of Qin to Bingzhou to meet the threat.',
  },
  s0308: {
    literal:
      'In the eighth month, Zhang Gongjin, overall commander of the Bingzhou circuit, fought the Turks at Taigu; the royal army was defeated, and Secretariat Director Wen Yanbo was taken by the enemy.',
    idiomatic:
      'In the eighth month Zhang Gongjin, commander on the Bingzhou front, met the Turks at Taigu and was routed; Secretariat Director Wen Yanbo fell into enemy hands.',
  },
  s0309: {
    literal: 'In the ninth month the Turks withdrew.',
    idiomatic: 'By the ninth month the Turks had pulled back.',
  },
  s0310: {
    literal:
      'In the tenth month of winter, on xinsi, he visited the Zhou clan embankment for a hunt and then went on to Longyue Palace.',
    idiomatic:
      'On xinsi in the tenth winter month he hunted at the Zhou clan embankment, then continued to Longyue Palace.',
  },
  s0311: {
    literal: 'In the eleventh month, on xinmao, he visited Yizhou.',
    idiomatic: 'In the eleventh month, on xinmao, he went to Yizhou.',
  },
  s0312: {
    literal: 'On gengzi he held a military review at Tongguan County.',
    idiomatic: 'On gengzi he drilled the troops at Tongguan County.',
  },
  s0313: {
    literal:
      'Prince of Shu Yuan Gui was re-enfeoffed as Prince of Wu, and Prince of Han Yuan Qing as Prince of Chen.',
    idiomatic:
      'Prince of Shu Yuan Gui was made Prince of Wu, and Prince of Han Yuan Qing was made Prince of Chen.',
  },
  s0314: {
    literal:
      'The Prince of Qin was additionally appointed Secretariat Director; Prince of Qi Yuan Ji was made Palace Attendant.',
    idiomatic:
      'The Prince of Qin was given the additional post of Secretariat Director; Prince of Qi Yuan Ji was made Palace Attendant.',
  },
  s0315: {
    literal:
      'Yuwen Shiji, marshal of the Heavenly Stratagem General\'s headquarters, was made acting Secretariat Director.',
    idiomatic:
      'Yuwen Shiji, marshal of the Heavenly Stratagem headquarters, was appointed acting Secretariat Director.',
  },
  s0316: {
    literal: 'In the twelfth month, on xinyou, he returned from Yizhou.',
    idiomatic: 'In the twelfth month, on xinyou, he came back from Yizhou.',
  },
  s0317: {
    literal:
      'In the ninth year of Wude, in the spring of the first month, on bingyin, he ordered prefectures and counties to repair walls and moats in preparation against the Turks.',
    idiomatic:
      'In the ninth year of Wude, on bingyin of the first spring month, he ordered every prefecture and county to repair its defenses against the Turks.',
  },
  s0318: {
    literal:
      'Pei Ji, Left Vice Director of the Masters of Writing and Duke of Wei, was made Minister of Works.',
    idiomatic:
      'Pei Ji, Left Vice Director of the Masters of Writing and Duke of Wei, was appointed Minister of Works.',
  },
  s0319: {
    literal: 'In the second month, on gengshen, Prince of Qi Yuan Ji was additionally made Minister of Education.',
    idiomatic: 'In the second month, on gengshen, Prince of Qi Yuan Ji was also made Minister of Education.',
  },
  s0320: {
    literal: 'On wuyin he personally sacrificed to the altars of soil and grain.',
    idiomatic: 'On wuyin he offered sacrifice at the altars of soil and grain in person.',
  },
  s0321: {
    literal: 'In the third month, on xinmao, he visited Kunming Pool.',
    idiomatic: 'In the third month, on xinmao, he went to Kunming Pool.',
  },
  s0322: {
    literal:
      'In the fifth month of summer, on xinsi, because the temples and monasteries of the capital were not altogether pure, an edict was issued:',
    idiomatic:
      'In the fifth summer month, on xinsi, finding the capital\'s temples and monasteries less than pure, he issued an edict:',
  },
  s0323: {
    literal:
      'In the sixth month, on gengshen, the Prince of Qin, on the ground that Crown Prince Jiancheng and Prince of Qi Yuan Ji had plotted together to harm him, led troops and executed them.',
    idiomatic:
      'In the sixth month, on gengshen, the Prince of Qin, claiming that Crown Prince Jiancheng and Prince of Qi Yuan Ji had conspired to kill him, marched out and put them to death.',
  },
  s0324: {
    literal:
      'An edict installed the Prince of Qin as crown prince to take charge of all affairs; a general amnesty was proclaimed throughout the realm.',
    idiomatic:
      'By edict the Prince of Qin was made crown prince and given the reins of government; the empire received a general amnesty.',
  },
  s0325: {
    literal: 'In the eighth month, on guihai, an edict transferred the throne to the crown prince.',
    idiomatic: 'In the eighth month, on guihai, an edict ceded the throne to the crown prince.',
  },
  s0326: {
    literal:
      'The emperor was honored as Retired Emperor, moved to Hongyi Palace, which was renamed Tai\'an Palace.',
    idiomatic:
      'Gaozu was styled Retired Emperor, removed to Hongyi Palace—renamed Tai\'an Palace.',
  },
  s0327: {
    literal:
      'In the eighth year of Zhenguan, in the third month, on jiaxu, Gaozu entertained envoys of the Western Turks in the Hall of Two Principles and, turning to Zhangsun Wuji, said: "Today the barbarians all submit—never has antiquity seen the like.',
    idiomatic:
      'In the eighth year of Zhenguan, on jiaxu of the third month, Gaozu feasted Western Turk envoys in the Hall of Two Principles and said to Zhangsun Wuji: "Never in antiquity have all the outer peoples submitted as they do today.',
  },
  s0328: {
    literal: '" Wuji offered the toast of ten thousand years.',
    idiomatic: '" Wuji raised the toast wishing him ten thousand years.',
  },
  s0329: {
    literal: 'Gaozu was greatly pleased and bestowed wine upon Taizong.',
    idiomatic: 'Gaozu was delighted and sent wine to Taizong.',
  },
  s0330: {
    literal:
      'Taizong in turn raised his cup and offered long life, weeping as he said: "The common people are at peace and the four quarters all attach themselves—this is all in obedience to your holy instruction; how could it be my doing!',
    idiomatic:
      'Taizong raised his cup in turn, weeping: "The people are safe and the four quarters submit—all because they follow your command. What is that to my credit?',
  },
  s0331: {
    literal:
      '" Thereupon Taizong and Empress Wende each served imperial dishes to the other, and together presented robes and personal goods, observing the ordinary rites of a family.',
    idiomatic:
      '" Then Taizong and Empress Wende served one another from the imperial table, offered clothing and personal gifts, and behaved with the easy manners of kin.',
  },
  s0332: {
    literal:
      'That year a military review was held west of the city; Gaozu watched in person, rewarded the troops, and returned.',
    idiomatic:
      'That year troops were reviewed west of the city; Gaozu watched in person, praised the soldiers, and returned.',
  },
  s0333: {
    literal:
      'A banquet was set in Weiyang Palace; all officials of the third rank and above attended.',
    idiomatic:
      'He gave a banquet in Weiyang Palace; every official of the third rank and above was in attendance.',
  },
  s0334: {
    literal:
      'Gaozu ordered Jieli Khan of the Turks to dance, and also had Feng Zhidai, chieftain of the Southern Yue, recite a poem; then he laughed and said: "Hu and Yue as one household—never before in antiquity.',
    idiomatic:
      'Gaozu had Jieli Khan of the Turks dance and Feng Zhidai, a Southern Yue chieftain, recite verse; then he laughed: "Turk and Yue under one roof—nothing like it in all history.',
  },
  s0335: {
    literal:
      '" Taizong raised his cup and offered long life, saying: "Your subject early received your kindly instruction and was taught the way of letters;',
    idiomatic:
      '" Taizong raised his cup and said: "I was raised in your kindness and taught the way of culture;',
  },
  s0336: {
    literal: 'then I followed the righteous banner and pacified the capital.',
    idiomatic: 'then I followed the righteous banner and secured the capital.',
  },
  s0337: {
    literal:
      'Again, against Xue Ju, Wu Zhou, Shichong, and Jiande—all rested on your far-seeing plans, and by fortune were overcome.',
    idiomatic:
      'Against Xue Ju, Liu Wuzhou, Wang Shichong, and Dou Jiande—each victory rested on your foresight alone.',
  },
  s0338: {
    literal: 'Within two or three years the realm was united.',
    idiomatic: 'In two or three years the realm was united.',
  },
  s0339: {
    literal: 'Heaven\'s kindness heaped favor upon me, and I received a weighty charge.',
    idiomatic: 'Heaven\'s grace raised me up and laid a heavy charge upon me.',
  },
  s0340: {
    literal:
      'Now Heaven blesses us; the seasons are mild and the harvest rich; those who wear their hair loose and fasten their robes to the left have all become subjects.',
    idiomatic:
      'Now Heaven blesses us with peace and plenty, and peoples who once bound their hair and wore robes left-open all bow as subjects.',
  },
  s0341: {
    literal: 'How could this be my wit or strength? It all proceeds from your sacred planning.',
    idiomatic: 'None of this is my wit or strength—it all flows from your design.',
  },
  s0342: {
    literal:
      '" Gaozu was greatly pleased; the assembled ministers all shouted "Ten thousand years!" and only at deep night did the revel end.',
    idiomatic:
      '" Gaozu was overjoyed; the court shouted "Long live the emperor!" until deep night before the feast broke up.',
  },
  s0343: {
    literal:
      'In the ninth year, in the fifth month, on gengzi, Gaozu fell gravely ill and issued an edict: "After the encoffining, the emperor should conduct state and military affairs at a separate place.',
    idiomatic:
      'In the ninth year, on gengzi of the fifth month, Gaozu fell mortally ill and decreed: "After my body is encoffined, the emperor should handle state and military affairs elsewhere.',
  },
  s0344: {
    literal: 'As to the weight of mourning garments, let all follow Han practice, substituting days for months.',
    idiomatic: 'Let mourning garments follow Han usage, counting days in place of months.',
  },
  s0345: {
    literal: 'The regulations for the park-tomb should strive for thrift.',
    idiomatic: 'The tomb park should be kept spare.',
  },
  s0346: {
    literal:
      '" That same day he died in the Qian Hall of the forward palace at Tai\'an Palace, aged seventy.',
    idiomatic:
      '" That same day he died in the Qian Hall at Tai\'an Palace, aged seventy.',
  },
  s0347: {
    literal:
      'The assembled ministers submitted a posthumous title of Emperor Dawu; his temple name was Gaozu.',
    idiomatic:
      'The ministers proposed the posthumous title Emperor Dawu and the temple name Gaozu.',
  },
  s0348: {
    literal: 'In the tenth month, on gengyin, he was buried at Xian Mausoleum.',
    idiomatic: 'In the tenth month, on gengyin, he was interred at Xian Mausoleum.',
  },
  s0349: {
    literal:
      'In the eighth month of the first year of Shangyuan under Gaozong, his elevated honorific was changed to Emperor Shenyao.',
    idiomatic:
      'In the eighth month of Shangyuan 1 under Emperor Gaozong, his honorific was raised to Emperor Shenyao.',
  },
  s0350: {
    literal:
      'In the second month of the thirteenth year of Tianbao, the honorific Emperor Shenyao the Great Sage, Greatly Glorious and Filial was conferred.',
    idiomatic:
      'In the second month of Tianbao 13 he received the honorific Emperor Shenyao the Great Sage, Greatly Glorious and Filial.',
  },
  s0351: {
    literal:
      '[Historian\'s appraisal] The historian says: In the closing years of Sui the imperial design was torn apart; a reckless ruler fed a flame across the dry plain, and bandits everywhere seized the moment of the deer hunt—cruelty without end, a flood none could stem.',
    idiomatic:
      '[Historian\'s appraisal] The historian writes: In Sui\'s last years the throne shook apart. A reckless ruler spread fire across the plain; rebels everywhere seized the hunt. Cruelty knew no limit, and the flood could not be stayed.',
  },
  s0352: {
    literal:
      'Gaozu saw that the lone tyrant\'s mandate was spent and knew a new lord was rising; he secretly turned his great design, yet had not yet leapt as the dragon.',
    idiomatic:
      'Gaozu saw the tyrant\'s hour had passed and a new lord was rising. He nursed a great design in secret, though the dragon had not yet sprung.',
  },
  s0353: {
    literal:
      'Yet he humbled himself to seek the khan\'s aid and answered Li Mi\'s letter in low phrases; when he moved his divine reckoning it was swift as thunder, and when he drove heroes they bent like grass before the wind.',
    idiomatic:
      'He humbled himself for the khan\'s help and answered Li Mi in courteous phrases; when he struck, his plans moved like thunder, and heroes bent to him like grass in the wind.',
  },
  s0354: {
    literal:
      'When the songs of praise were settled he received the abdication; penal names were greatly pared from oppressive detail, and noble ranks did not exceed the cap-box.',
    idiomatic:
      'When the people\'s voice settled on him he took the throne by abdication; he slashed penal law to its essentials and kept enfeoffments no larger than a cap-box.',
  },
  s0355: {
    literal:
      'Hence those who snatched gold felt shame, and those who lurked in the thickets knew their wrong; men cherished the Han way\'s breadth and ease and did not reproach Gaozu for coarse speech.',
    idiomatic:
      'Men who seized gold felt shame; outlaws in the wild knew themselves in the wrong. The people cherished the broad Han way and did not begrudge Gaozu his rough tongue.',
  },
  s0356: {
    literal:
      'Yet he was irresolute where he should have decided, and slander gained ground; when he executed Wen Jing the law officers would not agree, and when he rewarded Pei Ji his private favor went too far.',
    idiomatic:
      'Yet he wavered where he should have cut clean, and slander found room to work. He put Wen Jing to death against the law officers\' counsel, and heaped favor on Pei Ji beyond measure.',
  },
  s0357: {
    literal:
      'Through this the treacherous wove their brocade of lies, and favorites could stir the hive.',
    idiomatic:
      'Flatterers wove their brocade of lies, and favorites stirred the hive.',
  },
  s0358: {
    literal:
      'Duke Xian turned against Shensheng; Duke Huan of Qi still grieved for Zhao Wu.',
    idiomatic:
      'Like Duke Xian turning on Prince Shensheng, like Duke Huan still mourning Zhao Wu.',
  },
  s0359: {
    literal: 'In a single morning arms clashed between father and beloved son, and arrows clustered on the heir.',
    idiomatic:
      'One morning father and beloved son met in arms, and arrows rained upon the heir.',
  },
  s0360: {
    literal:
      'Soon the Xiongnu struck at Bian Bridge, and the capital feared the left-fastening robe.',
    idiomatic:
      'Soon the Turks struck at Bian Bridge, and the capital feared the barbarian at the gate.',
  },
  s0361: {
    literal: 'Without a sage son, the royal enterprise would have been in peril!',
    idiomatic: 'Without a sage son, the throne would have tottered!',
  },
  s0362: {
    literal: '[Eulogy] The eulogy says: The High Emperor founded the design; his force was like snapping dry wood.',
    idiomatic: '[Eulogy] The eulogy says: The High Emperor drew the design; his power snapped kingdoms like dry wood.',
  },
  s0363: {
    literal: 'The nation\'s fortune was martial and divine; the house\'s trial required a sage stratagem.',
    idiomatic: 'Heaven\'s fortune was fierce and bright; the clan\'s ordeal called for a sage heir\'s counsel.',
  },
  s0364: {
    literal: 'Words born beside the bed; calamity cut to the skin.',
    idiomatic: 'Words born in the bedchamber; harm that cut to the bone.',
  },
  s0365: {
    literal: 'The ode of the Owl—yet it did not diminish us.',
    idiomatic: 'Even the Owl ode could not diminish us.',
  },
};

const source = loadSentencesFromData();
for (let n = 301; n <= 365; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

let data;
if (existsSync(transPath)) {
  data = JSON.parse(readFileSync(transPath, 'utf8'));
} else {
  data = {
    metadata: { book: 'jiutangshu', chapter: '001', file: dataPath },
    sentences: [],
  };
}
if (data.metadata.chapter !== '001') {
  throw new Error(`Expected chapter 001, got ${data.metadata.chapter}`);
}

const byId = new Map(data.sentences.map((s) => [s.id, s]));
for (let n = 301; n <= 365; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  const src = source.get(id);
  if (!byId.has(id)) {
    const entry = {
      id,
      originalId: id,
      blockIndex: src.blockIndex,
      chinese: src.chinese,
      literal: '',
      idiomatic: '',
    };
    data.sentences.push(entry);
    byId.set(id, entry);
  } else if (!byId.get(id).chinese) {
    byId.get(id).chinese = src.chinese;
  }
}

data.sentences.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${s.id}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (expected', Object.keys(T).length, ')');
