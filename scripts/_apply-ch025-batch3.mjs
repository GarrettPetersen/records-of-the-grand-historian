#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.025, Rites 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/025.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 201;
const END = 300;

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
  s0201: {
    literal: 'Your Majesty should decide this at the imperial throne; do not trust pedantic bookish scholars.',
    idiomatic: 'The decision belongs to Your Majesty alone; do not heed narrow pedants.',
  },
  s0202: {
    literal: '" Thereupon an edict was sent down to the dukes and ministers and ritual officials to debate whether it was permissible.',
    idiomatic: 'An edict then ordered the chief ministers and ritual officers to debate the proposal.',
  },
  s0203: {
    literal: 'Erudite of the Court of Imperial Sacrifices Wang Yanwei memorialized: "The late emperor\'s temple name should not be styled Zu; it should be styled Zong."',
    idiomatic: 'Erudite Wang Yanwei argued that the late emperor\'s temple name should be Zong, not Zu.',
  },
  s0204: {
    literal: '" It was followed.',
    idiomatic: 'The court approved.',
  },
  s0205: {
    literal: 'That month the Ministry of Rites memorialized: "According to the Zhenguan precedent, removed temple tablets are stored in the three north–south chambers on the west wall of the side chambers."',
    idiomatic: 'That month the Ministry of Rites cited Zhenguan precedent: removed tablets go in three chambers on the west wall of the side rooms.',
  },
  s0206: {
    literal: 'The first chamber was the chamber of the dynastic founder; the second, the chamber of Emperor Gaozong; the third, the chamber of Emperor Zhongzong.',
    idiomatic: 'The first room was for the dynastic founder, the second for Gaozong, the third for Zhongzong.',
  },
  s0207: {
    literal: 'We note that the imperial tomb day draws near and Emperor Ruizong\'s removal is due; beyond the three chambers on the west wall of the side chambers there is no place to set a chamber.',
    idiomatic: 'With Ruizong\'s enshrinement imminent, no room remained on the west side-chamber wall beyond the three existing chambers.',
  },
  s0208: {
    literal: 'According to the Jiangdu Collected Rites: "In antiquity removed temple tablets were stored within the north wall of the Grand Chamber."',
    idiomatic: 'The Jiangdu Collected Rites say ancient removed tablets were kept in the Grand Chamber\'s north wall.',
  },
  s0209: {
    literal: '" Now we request on the north wall of the side chambers, taking west as superior, to place the stone chamber for Emperor Ruizong\'s spirit tablet.',
    idiomatic: 'They asked to place Ruizong\'s tablet chamber on the north wall of the side rooms, west taking precedence.',
  },
  s0210: {
    literal: '" The decree followed.',
    idiomatic: 'The emperor approved.',
  },
  s0211: {
    literal: 'In the first month the Commissioner of Ritual Protocol memorialized: "We respectfully examine the Zhou Rites: \'The Son of Heaven has seven temples—three zhao and three mu, and with the temple of the Grand Ancestor they are seven.\'"',
    idiomatic: 'First month: the ritual commissioner cited the Zhou Rites on the Son of Heaven\'s seven temples—three zhao, three mu, plus the Grand Ancestor.',
  },
  s0212: {
    literal: '" Xunzi says: "He who possesses All-under-Heaven sacrifices to seven generations; he who possesses one state sacrifices to five generations."',
    idiomatic: 'Xunzi says a ruler of the realm sacrifices to seven generations, a feudal lord to five.',
  },
  s0213: {
    literal: '" Thus we know that the Son of Heaven ascends to sacrifice at seven temples—this is the universal rule in the classics.',
    idiomatic: 'So seven ancestral temples for the Son of Heaven is the classical norm.',
  },
  s0214: {
    literal: 'Ancestral merit and dynastic virtue are not counted in that number.',
    idiomatic: 'Meritorious ancestors and dynastic founders lie outside that count.',
  },
  s0215: {
    literal: 'Our dynasty\'s system of nine ancestral temples follows the Zhou pattern.',
    idiomatic: 'The dynasty\'s nine-shrine system follows the Zhou model.',
  },
  s0216: {
    literal: 'The Grand Ancestor Emperor Jing, who first became Duke of Tang and inaugurated the Mandate, is analogous to Hou Ji of Zhou.',
    idiomatic: 'Grand Ancestor Emperor Jing, first Duke of Tang and founder of the Mandate, matches Zhou\'s Hou Ji.',
  },
  s0217: {
    literal: 'Emperor Gaozong the Divine Yao, who founded the enterprise and replaced Sui with Tang, is analogous to King Wen of Zhou.',
    idiomatic: 'Gaozong the Divine Yao, who founded the dynasty, matches King Wen.',
  },
  s0218: {
    literal: 'Emperor Taizong the Cultured, martial and responsive to the age, who made the realm, is analogous to King Wu of Zhou.',
    idiomatic: 'Taizong the Cultured, who pacified the realm, matches King Wu.',
  },
  s0219: {
    literal: 'Below them the three zhao and three mu are called the intimate temples; seasonal offerings follow the ritual text as usual.',
    idiomatic: 'Below them the three zhao and three mu are the "intimate" shrines with regular seasonal offerings.',
  },
  s0220: {
    literal: 'Now with a new tablet entering the temple, Emperor Xuanzong the Brilliant lies outside the three zhao and three mu; he is an ancestor whose line of descent is exhausted. Though he has merit and virtue, ritual requires removal; in the years of di and cha he joins the combined feast.',
    idiomatic: 'With a new tablet enshrined, Xuanzong stood outside the zhao-mu line—an exhausted line despite his merit—and would be removed, joining the combined di and cha feast.',
  },
  s0221: {
    literal: '" The decree followed.',
    idiomatic: 'The emperor approved.',
  },
  s0222: {
    literal: ', the Commissioner of Ritual Protocol memorialized: "We respectfully examine the Son of Heaven\'s seven temples: ancestral merit and dynastic virtue are not among them."',
    idiomatic: 'The ritual commissioner again noted that meritorious ancestors and dynastic founders are outside the seven-temple count.',
  },
  s0223: {
    literal: 'Our dynasty\'s institution: the Grand Temple has nine chambers.',
    idiomatic: 'Under dynastic practice the Grand Temple has nine chambers.',
  },
  s0224: {
    literal: 'We note that the Grand Ancestor Emperor Jing received enfeoffment in Tang; Gaozong and Taizong founded the enterprise and received the Mandate—meritorious rulers are not removed for a hundred generations.',
    idiomatic: 'Grand Ancestor Jing, Gaozong, and Taizong—founders with merit—are never removed.',
  },
  s0225: {
    literal: 'Now Emperor Wenzong the Sagely Illustrious is due to ascend; Emperor Daizong the Sagely Cultured and Martial is an exhausted-line ancestor whom ritual requires to remove; at each di and cha he joins the combined feast as usual.',
    idiomatic: 'Wenzong was to be enshrined; Daizong, an exhausted-line ancestor, would be removed yet share the di and cha feast as before.',
  },
  s0226: {
    literal: '" It was followed.',
    idiomatic: 'The court approved.',
  },
  s0227: {
    literal: 'In the sixth month, an edict said: "" [text not preserved in source].',
    idiomatic: 'Sixth month: an edict was issued, but its wording is lost in the source.',
  },
  s0228: {
    literal: 'In the fifth month, the Commissioner of Ritual Protocol memorialized:',
    idiomatic: 'Fifth month: the Commissioner of Ritual Protocol submitted a memorial.',
  },
  s0229: {
    literal: 'An edict said: "" [text not preserved in source]. Vice Minister of the Left Zheng Ya and others memorialized, saying: "The ritual classics set norms; nothing is weightier than the solemn matching sacrifice. One must consult the way of increase and decrease, then it accords with canonical ritual text."',
    idiomatic: 'An edict (text lost) ordered debate; Vice Minister Zheng Ya and others said ritual norms above all govern the great matching sacrifice and must follow the classics with due adjustment.',
  },
  s0230: {
    literal: 'Moreover there are clear proofs—this supports a balanced decision.',
    idiomatic: 'Clear precedents supported a balanced ruling.',
  },
  s0231: {
    literal: 'We note that Emperors Jingzong, Wenzong, and Wuzong succeeded in turn, all as brothers; examining earlier ages, reason gives plain evidence.',
    idiomatic: 'Jingzong, Wenzong, and Wuzong had succeeded as brothers—a pattern with clear precedent in earlier dynasties.',
  },
  s0232: {
    literal: 'Now we respectfully examine in detail what the Ritual Institute memorialized, and above trace ancient texts and on the side gather historians; it harmonizes with timely change and may be called fitting.',
    idiomatic: 'They reviewed the Ritual Institute\'s proposal against classics and history and found it a timely, fitting compromise.',
  },
  s0233: {
    literal: 'Your subjects deliberated and request following what the ritual officers proposed.',
    idiomatic: 'The ministers asked to follow the ritual officers\' recommendation.',
  },
  s0234: {
    literal: '" It was followed.',
    idiomatic: 'The court approved.',
  },
  s0235: {
    literal: 'In the eleventh month, an edict posthumously elevated the honorific titles of Emperors Xianzong and Shunzong; the matter was sent down to the responsible offices.',
    idiomatic: 'Eleventh month: edict raised Xianzong\'s and Shunzong\'s posthumous titles and referred implementation to the relevant offices.',
  },
  s0236: {
    literal: 'Erudite Li Chou memorialized requesting separately to make new spirit tablets for Xianzong and Shunzong and change the inscriptions to the new honorifics.',
    idiomatic: 'Erudite Li Chou asked to carve new tablets for Xianzong and Shunzong bearing the new titles.',
  },
  s0237: {
    literal: 'The emperor doubted the matter and ordered the Department of State Affairs to assemble for deliberation.',
    idiomatic: 'The emperor doubted this and ordered a joint deliberation at the Department of State Affairs.',
  },
  s0238: {
    literal: 'Right Bureau Director Yang Fa, Director of Punishments Liu Yanmo, and others memorialized: "Examining precedents, there is no example of separately making spirit tablets and changing inscriptions."',
    idiomatic: 'Yang Fa and Liu Yanmo found no precedent for new tablets and retitled inscriptions.',
  },
  s0239: {
    literal: '" The matter is in the Biography of Yang Fa.',
    idiomatic: 'The full debate is recorded in Yang Fa\'s biography.',
  },
  s0240: {
    literal: 'At the time the chief ministers memorialized: "Remaking and retitling both lack authority; weighing sentiment and reason, retitling is fitting."',
    idiomatic: 'The chief ministers argued remaking lacked precedent but retitling the existing tablets was reasonable.',
  },
  s0241: {
    literal: 'Moreover among gentry families today this practice is common; though noble and base differ, sentiment and reason are the same.',
    idiomatic: 'Gentry families commonly retitled tablets; rank differed, but the principle was the same.',
  },
  s0242: {
    literal: 'We hope to retitle on the existing spirit tablets—then it will be broadly acceptable.',
    idiomatic: 'They asked to retitle the existing tablets, which would be broadly acceptable.',
  },
  s0243: {
    literal: '" It was followed.',
    idiomatic: 'The court approved.',
  },
  s0244: {
    literal: 'Huang Chao attacked Chang\'an; Emperor Xizong avoided the Di barbarians at Chengdu Prefecture.',
    idiomatic: 'When Huang Chao took Chang\'an, Xizong fled to Chengdu.',
  },
  s0245: {
    literal: 'In the fourth month of summer the responsible offices requested offering to the eleven chambers from the Grand Ancestor down; an edict ordered the dukes and ministers to debate the rites.',
    idiomatic: 'Fourth month: officers sought to sacrifice at all eleven shrines from the Grand Ancestor down; the court ordered debate on the rites.',
  },
  s0246: {
    literal: 'Director of Imperial Sacrifices Niu Cong deliberated the matter together with Confucian scholars.',
    idiomatic: 'Director Niu Cong and the ritual scholars debated the matter.',
  },
  s0247: {
    literal: 'Someone said: "When the king tours the regions, he takes the removed temple tablets on the journey."',
    idiomatic: 'Some cited the rule that a touring king carried removed ancestral tablets.',
  },
  s0248: {
    literal: 'If there are no removed temple tablets, the invoker presents silks, fabrics, pelts, and jade scepters to announce to the ancestors, then bears them out, loads them on the fasting carriage, and offers at each lodging.',
    idiomatic: 'Without removed tablets, invokers would announce to the ancestors with silks and jade, then carry the tablets in the fasting carriage, offering at each stop.',
  },
  s0249: {
    literal: 'Now this is not a tour—it is the loss of the ancestral temple.',
    idiomatic: 'This was not a royal tour but the loss of the capital temple.',
  },
  s0250: {
    literal: 'When the ancestral temple is lost, ancestral temple affairs should be suspended.',
    idiomatic: 'When the temple was lost, its rites should cease.',
  },
  s0251: {
    literal: '" Cong doubted this.',
    idiomatic: 'Niu Cong was uncertain.',
  },
  s0252: {
    literal: 'Director of Palace Construction Wang Jian, Palace Mentor Li Kuangyi, and Vice Director of the Ministry of Works Yuan Hao proposed differing plans.',
    idiomatic: 'Wang Jian, Li Kuangyi, and Yuan Hao offered conflicting proposals.',
  },
  s0253: {
    literal: 'When Left Vice Director Cui Hou became Director of Imperial Sacrifices, they then resolved to establish a traveling temple.',
    idiomatic: 'When Cui Hou became director, they resolved to set up a traveling temple.',
  },
  s0254: {
    literal: 'At the time when Emperor Xuanzong visited Shu, before the Daoist palace Hall of the Mysterious Origin, they erected curtain frames as eleven chambers.',
    idiomatic: 'They had once framed eleven curtained chambers before the Hall of the Mysterious Origin when Xuanzong fled to Shu.',
  },
  s0255: {
    literal: 'Again there were no spirit tablets; they inscribed spirit boards and conducted the rites.',
    idiomatic: 'Without tablets they used inscribed boards and performed the rites.',
  },
  s0256: {
    literal: 'Those versed in ritual criticized this, holding that stopping would be acceptable.',
    idiomatic: 'Ritual experts criticized the practice and said it should simply stop.',
  },
  s0257: {
    literal: 'The next year they specially made spirit tablets to enshrine in the traveling temple.',
    idiomatic: 'The next year they specially carved tablets for the traveling temple.',
  },
  s0258: {
    literal: 'On the twenty-fifth day of the twelfth month, Emperor Xizong again visited Baoji.',
    idiomatic: 'On the twenty-fifth of the twelfth month Xizong again reached Baoji.',
  },
  s0259: {
    literal: 'The spirit tablets of the Grand Temple\'s eleven chambers, the eight chambers of the removed temple, and the three separate temples of the Filial and Bright Grand Empress Dowager and others, together with ritual objects for the chambers, were escorted by officials of the Court of the Imperial Clan following the imperial progress to Hao County; bandits robbed them and the spirit tablets and ritual objects were all lost.',
    idiomatic: 'Eleven Grand Temple tablets, eight removed-shrine tablets, three empress-dowager shrine tablets, and ritual gear—escorted by the clan court to Hao County—were looted and lost.',
  },
  s0260: {
    literal: 'In the second month of the third year the imperial carriage returned to the capital from Xingyuan; because the palaces were not ready, it temporarily lodged at Fengxiang.',
    idiomatic: 'Third year, second month: the court returned from Xingyuan but lodged at Fengxiang while palaces were rebuilt.',
  },
  s0261: {
    literal: 'The Ritual Institute memorialized: "When the emperor returns to the palace, he first visits the Grand Temple."',
    idiomatic: 'The Ritual Institute said the emperor should visit the Grand Temple first on returning.',
  },
  s0262: {
    literal: 'Now the ancestral temple is burned and destroyed and the spirit tablets are lost; we request following ritual precedent to restore and maintain them."',
    idiomatic: 'With the temple burned and tablets lost, they asked to restore worship by precedent.',
  },
  s0263: {
    literal: '" The Ritual Institute presented a deliberation, saying: "According to the Spring and Autumn Annals: \'When the new palace suffered fire, there was weeping for three days.\'"',
    idiomatic: 'The institute cited the Spring and Autumn: when the new palace burned, three days of mourning were prescribed.',
  },
  s0264: {
    literal: '" The Commentary says: \'The new palace was Duke Xuan\'s temple.\'"',
    idiomatic: 'The commentary explains the "new palace" was Duke Xuan\'s temple.',
  },
  s0265: {
    literal: 'Weeping for three days is ritual."',
    idiomatic: 'Three days of weeping was proper ritual.',
  },
  s0266: {
    literal: '" According to the National History, on the second day of the first month four chambers of the Grand Temple collapsed; at the time the spirit tablets all survived and were welcomed and placed in the Hall of Supreme Ultimate; Emperor Xuanzong wore plain dress and avoided the main hall.',
    idiomatic: 'National History records: four Grand Temple chambers collapsed in the first month; tablets were saved to the Hall of Supreme Ultimate and Xuanzong mourned in plain dress.',
  },
  s0267: {
    literal: ', when Emperor Suzong returned to the capital, because the ancestral temple had been burned by rebels, he set up a station outside Guangshun Gate and wept toward the temple.',
    idiomatic: 'When Suzong returned, the rebels had burned the temple; he wept toward it from a station outside Guangshun Gate.',
  },
  s0268: {
    literal: 'Searching precedents through, one does not see the rite of the hundred officials coming to offer condolence.',
    idiomatic: 'Precedents show no rite of officials offering formal condolence.',
  },
  s0269: {
    literal: 'Yet since the emperor already wore plain dress and avoided the hall, the hundred officials offering condolence also fits sentiment and ritual.',
    idiomatic: 'Yet with the emperor in mourning dress, officials\' condolence was still fitting.',
  },
  s0270: {
    literal: 'We privately follow precedents and compare and examine in detail; we fear the Court of the Imperial Clan must report fully the burning of the ancestral temple and the loss of spirit tablets; the emperor in plain dress avoids the hall, receives condolence, then suspends court for three days, and issues an edict commissioning the Director of the Palace Workshops to choose a day by ritual to newly make the spirit tablets of the successive sages.',
    idiomatic: 'They proposed: the clan court should report the disaster; the emperor mourn, receive officials\' condolences, halt court three days, and order new sage tablets made on an auspicious day.',
  },
  s0271: {
    literal: 'Only thus does it seem fitting.',
    idiomatic: 'Only thus would the rites be proper.',
  },
  s0272: {
    literal: 'We note that gathering chestnut wood requires the eleventh month; we gradually fear it will be late.',
    idiomatic: 'Chestnut wood for tablets required the eleventh month—they feared delay.',
  },
  s0273: {
    literal: '" The restoration commissioner, Chancellor Zheng Yanchang, fully deliberated; the Secretariat memorialized, saying: "We note that last winter there were again shocks; suddenly the court moved to monasteries; the masters of sacrifice were pressed in haste."',
    idiomatic: 'Restoration commissioner Zheng Yanchang and the Secretariat recalled last winter\'s shocks and the hasty flight that scattered the ritual officers.',
  },
  s0274: {
    literal: 'We note that because the court moved to Fengxiang, we did not dare memorialize.',
    idiomatic: 'They had not yet reported while lodged at Fengxiang.',
  },
  s0275: {
    literal: 'Now the imperial carriage is about to return; all should uphold the canon; the pure temple will be rebuilt and filial thought fully prepared.',
    idiomatic: 'Now the throne was returning, canon would be restored, and filial rebuilding of the temple could proceed.',
  },
  s0276: {
    literal: 'We respectfully request an edict ordering the offices to examine the canon in detail and restore and maintain it."',
    idiomatic: 'They asked for an edict ordering offices to restore the temple by canonical rites.',
  },
  s0277: {
    literal: '" An edict said: "" [text not preserved in source]. Again the restoration commissioner for the Grand Temple, Chancellor Zheng Yanchang, memorialized: "The Grand Temple main hall has eleven chambers, twenty-three bays, and eleven roof frames—the achievement is very great and estimated expenses are not few."',
    idiomatic: 'An edict (text lost); Zheng Yanchang added that rebuilding the eleven-chamber hall—twenty-three bays—would be vast and costly.',
  },
  s0278: {
    literal: 'Moreover ancestral temple institutions have fixed numbers; it is hard to increase or decrease them.',
    idiomatic: 'Ancestral temple dimensions were fixed and hard to alter.',
  },
  s0279: {
    literal: 'Now we do not know whether to restore according to the original estimates or again have further deliberation?',
    idiomatic: 'Should restoration follow original plans or be renegotiated?',
  },
  s0280: {
    literal: 'We request sending it down to ritual officers for detailed deliberation."',
    idiomatic: 'They asked ritual officers to deliberate.',
  },
  s0281: {
    literal: '" Erudite Yin Yingsun memorialized, saying: "If we follow the original estimates, it will be hard to complete quickly; moreover the treasury of silks is empty—we must rely on altered ritual."',
    idiomatic: 'Erudite Yin Yingsun said original plans could not be finished in time and empty treasuries required ritual adaptation.',
  },
  s0282: {
    literal: 'We privately hold that, because the newly repaired Grand Temple is not finished, the newly made spirit tablets should temporarily be placed in the Hall of Everlasting Peace, and the offering and announcement rites carried out as in the ancestral temple, to await the temple\'s completion before enshrining.',
    idiomatic: 'Until the new temple was done, new tablets should lodge in the Hall of Everlasting Peace for offering rites, then move when the temple stood.',
  },
  s0283: {
    literal: 'Now in the capital apart from filling the inner palace and main audience halls, there are no other halls.',
    idiomatic: 'Apart from palace and audience halls, the capital had no spare halls.',
  },
  s0284: {
    literal: 'We have heard there was already an edict intending to use the great hall of the Director of the Palace Workshops as a temporary Grand Temple.',
    idiomatic: 'An edict had proposed the Palace Workshops\' great hall as a temporary temple.',
  },
  s0285: {
    literal: 'That hall has five bays; we note that setting out eleven chambers within five bays is cramped and narrow; we request further connected construction to make eleven bays as places for the eleven chambers\' offerings.',
    idiomatic: 'Five bays could not hold eleven shrines; they asked to extend the hall to eleven bays.',
  },
  s0286: {
    literal: 'The three empress-dowager temples should take three rooms in the southwest of the Director of the Palace Workshops as places for the three chambers\' announcement offerings.',
    idiomatic: 'Three southwest rooms in the same compound would serve the three empress-dowager shrines.',
  },
  s0287: {
    literal: '" The edict followed.',
    idiomatic: 'The emperor approved.',
  },
  s0288: {
    literal: ', when the di sacrifice was about to be performed, the responsible offices requested enshrining the three empress-dowager spirit tablets in joint offering at the Grand Temple.',
    idiomatic: 'Before the di rite, officers proposed bringing the three empress-dowager tablets into the Grand Temple.',
  },
  s0289: {
    literal: 'The three empress dowagers: Grand Empress Dowager Xiaoming, née Zheng, mother of Emperor Xuanzong;',
    idiomatic: 'The three were Grand Empress Dowager Xiaoming (Zheng), Xuanzong\'s mother;',
  },
  s0290: {
    literal: 'Grand Empress Dowager Gongxi, née Wang, mother of Emperor Jingzong;',
    idiomatic: 'Grand Empress Dowager Gongxi (Wang), Jingzong\'s mother;',
  },
  s0291: {
    literal: 'and Grand Empress Dowager Zhenxian, née Xiao, mother of Emperor Wenzong.',
    idiomatic: 'and Grand Empress Dowager Zhenxian (Xiao), Wenzong\'s mother.',
  },
  s0292: {
    literal: 'When the three empresses died, spirit tablets were all made; for reasons they should not enter the Grand Temple.',
    idiomatic: 'Each had a tablet at death but should not enter the Grand Temple.',
  },
  s0293: {
    literal: 'At the time ritual officers proposed establishing separate temples for all, with five offerings yearly and cha every three years and di every five years—all conducted at their own temples, with no text of bringing spirit tablets into the Grand Temple.',
    idiomatic: 'Ritual officers had placed them in separate temples with their own seasonal and cha/di rites, never bringing tablets into the Grand Temple.',
  },
  s0294: {
    literal: 'At this time after the turmoil the old regulations were scattered and lost; the Ritual Institute relied on Wang Yanwei\'s Quetai Rites and wished to enshrine the three empress dowagers in joint offering at the Grand Temple.',
    idiomatic: 'After the rebellion the Ritual Institute, citing the Quetai Rites, sought to joint-offer the three empress dowagers in the Grand Temple.',
  },
  s0295: {
    literal: 'Erudite Yin Yingsun presented a memorial objecting, saying: [the memorial text is not preserved in the source].',
    idiomatic: 'Erudite Yin Yingsun objected in a memorial (text lost in the source).',
  },
  s0296: {
    literal: 'Chancellor Kong Wei said: "The erudite\'s words are correct."',
    idiomatic: 'Chancellor Kong Wei said Yin Yingsun was right.',
  },
  s0297: {
    literal: 'Yesterday the Ritual Institute\'s submitted protocol has now been edicted down; the great sacrifice day presses—it cannot be suddenly changed; for the time being let it be carried out as submitted."',
    idiomatic: 'Kong Wei conceded the institute\'s rite was already ordered and the sacrifice was imminent—execute it for now.',
  },
  s0298: {
    literal: '" Thereupon the three empress dowagers were enshrined in cha at the Grand Temple.',
    idiomatic: 'The three empress dowagers were nonetheless enshrined in the Grand Temple cha rite.',
  },
  s0299: {
    literal: 'Those versed in ritual mocked the great error; it has not been corrected to this day.',
    idiomatic: 'Ritual experts condemned the blunder, still uncorrected.',
  },
  s0300: {
    literal: 'In the eleventh month, Erudite Ren Chou submitted, saying: "On the seventeenth of last month, offering at the Deming and Xingsheng temples, we received a report from the temple attendant Hou Lun\'s petition, stating that the chamber of Emperor Yi was above the chamber of Emperor Xian; though it was then deemed correct and the rite was performed, we still dispatched notice to the surveillance commissioner and the Court of the Imperial Clan, requesting examination of the imperial genealogy; if there is any difference, inform each other and memorialize."',
    idiomatic: 'Eleventh month: Erudite Ren Chou reported that at last month\'s offering at Deming and Xingsheng temples, attendants said Yi\'s shrine stood above Xian\'s—done provisionally but referred to genealogy for verification.',
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
if (data.metadata.chapter !== '025') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 025; standalone T ready (${Object.keys(T).length} entries).`
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
