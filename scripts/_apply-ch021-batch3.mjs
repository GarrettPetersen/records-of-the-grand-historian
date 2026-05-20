#!/usr/bin/env node
/** Batch 3: s0201–s0300 (Jiutangshu ch.021, ritual/music treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/021.json';
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
    literal: '」This then treats the azure expanse as substance itself and does not fall under the category of asterisms.',
    idiomatic: 'The azure vault is substance, not a star in the roster.',
  },
  s0202: {
    literal: 'Moreover Heaven and Earth are each one—this is called the Two Modes.',
    idiomatic: 'Heaven and Earth are each singular—the Two Modes.',
  },
  s0203: {
    literal: 'If Heaven still has no duplicate, how could there be six?',
    idiomatic: 'Heaven admits no second; how six?',
  },
  s0204: {
    literal: 'Therefore Wang Su and the mass of ru scholars all refuted this doctrine.',
    idiomatic: 'Wang Su and the ru scholars all rejected it.',
  },
  s0205: {
    literal: 'Again, examining the Grand Astrologer\'s Round Mound Diagram, beyond the seat of the Sovereign of Heaven there is a separate Pole Star seat—differing from Zheng Xuan\'s meaning.',
    idiomatic: 'The Grand Astrologer\'s Round Mound Diagram places Pole Star apart from the Sovereign of Heaven—unlike Zheng Xuan.',
  },
  s0206: {
    literal: 'From memorials by Grand Astrologer Li Chunfeng and others: on the Sovereign of Heaven diagram the position is on the altar itself; Pole Star is on the second tier, arrayed with the Northern Dipper as head of inner official seats—unlike Zheng Xuan\'s reliance on apocryphal books.',
    idiomatic: 'Li Chunfeng et al.: the Sovereign of Heaven sits on the altar; Pole Star ranks second with the Northern Dipper—not Zheng Xuan\'s apocryphal scheme.',
  },
  s0207: {
    literal: 'This is what Xi and He controlled—observing images and drafting charts, calendrical steps with proof, handed down without error.',
    idiomatic: 'Xi and He\'s observatory tradition: images, charts, and verified calendrics—transmitted correctly.',
  },
  s0208: {
    literal: 'Again, per the "Heavenly Offices" chapter of the Records and the like, the Five Emperors in the Supreme Ultimate Palace are the spirits of the five essences, attended by the five planets.',
    idiomatic: 'The Records\' Heavenly Offices: Supreme Ultimate\'s Five Emperors are five-essence spirits served by the five planets.',
  },
  s0209: {
    literal: 'Because they image the human ruler, they are styled emperors for comparison.',
    idiomatic: 'As images of the earthly ruler, they are called emperors figuratively.',
  },
  s0210: {
    literal: 'It is also like Heart and Rooftop Beam as images of the Heavenly King—how could they be Heaven itself!',
    idiomatic: 'Heart and Rooftop Beam image the Heavenly King—they are not Heaven.',
  },
  s0211: {
    literal: 'The Rites of Zhou says: "Establish the Five Emperors at the four suburbs."',
    idiomatic: 'The Rites of Zhou: "Establish the Five Emperors at the four suburbs."',
  },
  s0212: {
    literal: 'It also says: "When sacrificing to the Five Emperors, one administers the oath-admonitions of the hundred officials."',
    idiomatic: 'It also says: "Sacrificing to the Five Emperors, administer the hundred officials\' oath-admonitions."',
  },
  s0213: {
    literal: 'They only name the Five Emperors and never speak of Heaven.',
    idiomatic: 'Only the Five Emperors are named—never Heaven.',
  },
  s0214: {
    literal: 'These are spirits of the Supreme Ultimate Palace in origin, not sacrifices to the vaulted azure.',
    idiomatic: 'Supreme Ultimate spirits—not rites to the vaulted sky.',
  },
  s0215: {
    literal: 'The Classic of Filial Piety also only says "suburban sacrifice to Hou Ji," with no separate text on sacrificing at the Round Mound.',
    idiomatic: 'The Classic of Filial Piety mentions only suburban sacrifice to Hou Ji—no Round Mound passage.',
  },
  s0216: {
    literal: 'Wang Su and others held that suburb means Round Mound and Round Mound means suburb, like royal city and capital—different names, one reality.',
    idiomatic: 'Wang Su: suburb and Round Mound are one rite, as royal city and capital are one place.',
  },
  s0217: {
    literal: 'It accords with the classics; the meaning is very clear.',
    idiomatic: 'The classics support it clearly.',
  },
  s0218: {
    literal: 'Yet now following Zheng\'s theory splits them into two sacrifices: beyond the Round Mound there is a separate Southern Suburban Altar—abandoning the orthodox canon, the principle deeply fails to convince.',
    idiomatic: 'Zheng\'s split—Round Mound plus a separate Southern Suburban Altar—abandons the canon.',
  },
  s0219: {
    literal: 'Moreover, examining the Ministry of Personnel formulary, there is only Southern Suburban Altar attendant seating and no separate entry for the Round Mound.',
    idiomatic: 'The Ministry formulary lists only Southern Suburban attendants—not Round Mound.',
  },
  s0220: {
    literal: 'The formulary follows Wang Su while the sacrifice ordinance still follows Zheng—ordinance and formulary at odds; reform is fitting.',
    idiomatic: 'Formulary follows Wang Su, ordinance follows Zheng—they should be reconciled.',
  },
  s0221: {
    literal: 'The Classic of Filial Piety also says "honoring the father, nothing is greater than matching Heaven," and the text below immediately says "the Duke of Zhou performed ancestral sacrifice to King Wen in the Bright Hall to match the Sovereign."',
    idiomatic: 'Filial Piety: "honoring the father, nothing greater than matching Heaven"—then "the Duke of Zhou sacrificed to King Wen in the Bright Hall to match the Sovereign."',
  },
  s0222: {
    literal: '」Then what the Bright Hall sacrifices is precisely matching Heaven; to hold that it only sacrifices star-officials reverses the clear meaning.',
    idiomatic: 'Bright Hall sacrifice matches Heaven—not mere star-officials.',
  },
  s0223: {
    literal: 'Again, per the Monthly Ordinances: "In the first month of spring, pray for grain to the Sovereign."',
    idiomatic: 'Monthly Ordinances: "First month of spring—pray for grain to the Sovereign."',
  },
  s0224: {
    literal: 'The Zuo Commentary also says: "For all sacrifices, at Awakening of Hibernators perform suburb; after suburb then plow."',
    idiomatic: 'Zuo Commentary: "Sacrifices begin at Awakening of Hibernators with suburb; after suburb, plowing."',
  },
  s0225: {
    literal: 'Therefore suburban sacrifice to Hou Ji is to pray for agricultural affairs."',
    idiomatic: 'Suburban sacrifice to Hou Ji prays for the harvest.',
  },
  s0226: {
    literal: 'Thus suburb to Heaven at Awakening of Hibernators is in itself praying for grain; to call it sacrifice to the Feelings Emperor is very uncanonical.',
    idiomatic: 'Awakening of Hibernators suburb prays for grain—it is not Feelings Emperor worship.',
  },
  s0227: {
    literal: 'Now we ask to take the statutes of the Ji and Kong houses as model, examine Wang and Zheng, welcome seasonal qi at the four suburbs, and retain sacrifice to the Supreme Ultimate Five Emperors;',
    idiomatic: 'We propose: follow Ji and Kong, weigh Wang and Zheng, keep four-suburb seasonal rites and Supreme Ultimate Five Emperors;',
  },
  s0228: {
    literal: 'at the Southern Suburban Altar and Bright Hall, abolish the apocryphal doctrine of Six Heavens.',
    idiomatic: 'and at Southern Suburban Altar and Bright Hall abolish the Six Heavens apocrypha.',
  },
  s0229: {
    literal: 'Beyond sacrifice at the Square Mound to Earth, there is a separate Divine Land, called Northern Suburban Altar;',
    idiomatic: 'Besides Square Mound earth sacrifice, a separate Divine Land is called Northern Suburban Altar;',
  },
  s0230: {
    literal: 'splitting Earth in two has no canonical warrant and is also unreasonable in principle—we also ask to unite them in one sacrifice to accord with ancient meaning.',
    idiomatic: 'splitting earth in two lacks warrant—we ask one earth rite per ancient usage.',
  },
  s0231: {
    literal: 'Still attach the articles to ordinances and formulae as perpetual later standard.',
    idiomatic: 'Attach these provisions to ordinances as permanent standard.',
  },
  s0232: {
    literal: 'Jing Zong and others again debated the number of biǎn and dòu, saying: "Per the present Guanglu formulary, for sacrifice to Heaven and Earth, sun and moon, mountains and marshes, seas and rivers, and First Silkworm, biǎn and dòu are four each."',
    idiomatic: 'Jing Zong et al. on biǎn and dòu: "Present Guanglu rules give four each for Heaven, Earth, sun, moon, mountains, seas, and First Silkworm."',
  },
  s0233: {
    literal: 'For ancestral temple sacrifice, biǎn and dòu are twelve each.',
    idiomatic: 'Ancestral temple: twelve each.',
  },
  s0234: {
    literal: 'For Altars of Soil and Grain, First Agriculture, and the like, biǎn and dòu are nine each.',
    idiomatic: 'Altars of Soil and Grain and First Agriculture: nine each.',
  },
  s0235: {
    literal: 'For Wind Lord and Rain Lord, biǎn and dòu are two each.',
    idiomatic: 'Wind Lord and Rain Lord: two each.',
  },
  s0236: {
    literal: 'Searching this formulary text, the matter is deeply perverse.',
    idiomatic: 'The formulary ranks are incoherent.',
  },
  s0237: {
    literal: 'Altars of Soil and Grain outrank Heaven and Earth—as if quantity were not honored.',
    idiomatic: 'Soil and Grain outrank Heaven and Earth—as if more were not the rule.',
  },
  s0238: {
    literal: 'Wind and rain rank below sun and moon—yet neither is quantity honored less.',
    idiomatic: 'Wind and rain below sun and moon—yet neither honors less.',
  },
  s0239: {
    literal: 'Moreover First Agriculture and First Silkworm are both middle sacrifices, yet one has six or four—unreasonable in principle.',
    idiomatic: 'First Agriculture and First Silkworm are both middle rites—yet counts of six or four conflict.',
  },
  s0240: {
    literal: 'Again, the spirit of First Agriculture outranks the libation-for-learning sacrifice, yet biǎn and dòu for First Agriculture are fewer—the principle already awry and hard to follow by precedent.',
    idiomatic: 'First Agriculture outranks libation-for-learning—yet receives fewer biǎn and dòu; precedent cannot stand.',
  },
  s0241: {
    literal: 'Respectfully per the "Suburban Victims" chapter of the Book of Rites: "The offering of biǎn and dòu are products of water and earth; one dare not use tainted flavors yet values many kinds—this is the meaning of communing with the spirits."',
    idiomatic: 'Book of Rites, "Suburban Victims": biǎn and dòu present water-and-earth products; many kinds honor the spirits.',
  },
  s0242: {
    literal: '」That is, in sacrifice biǎn and dòu take multitude as honorable.',
    idiomatic: 'Sacrificial biǎn and dòu honor abundance.',
  },
  s0243: {
    literal: 'The ancestral temple count must not exceed suburb.',
    idiomatic: 'Ancestral counts must not exceed suburb.',
  },
  s0244: {
    literal: 'Now we ask great sacrifice uniformly twelve, middle sacrifice ten, small sacrifice eight, libation-for-learning on middle-sacrifice standard.',
    idiomatic: 'Proposed: great rites twelve, middle ten, small eight; libation-for-learning at middle standard.',
  },
  s0245: {
    literal: 'For the rest of attendant seating, all please follow the old formulary.',
    idiomatic: 'Attendant seating otherwise unchanged.',
  },
  s0246: {
    literal: '」An edict approved all; they were then attached to the ritual ordinance.',
    idiomatic: 'Approved and written into the ritual ordinance.',
  },
  s0247: {
    literal: 'At the start of the Qianfeng era, after Gaozong returned from eastern feng and shan, he again ordered sacrifice to the Feelings Emperor and Divine Land per the old rites.',
    idiomatic: 'Qianfeng: after Gaozong\'s eastern feng and shan, Feelings Emperor and Divine Land rites were restored.',
  },
  s0248: {
    literal: 'Director of Rituals Junior Regular Palace Attendant Hao Chujun and others memorialized:',
    idiomatic: 'Director of Rituals Hao Chujun et al. memorialized:',
  },
  s0249: {
    literal: 'The Xianqing New Rites abolished sacrifice to the Feelings Emperor and changed it to praying for grain.',
    idiomatic: 'Xianqing New Rites abolished Feelings Emperor worship for grain prayer.',
  },
  s0250: {
    literal: 'The Sovereign of Heaven was matched with Grand Ancestor Taizu Emperor.',
    idiomatic: 'Sovereign of Heaven: Grand Ancestor Taizu as consort.',
  },
  s0251: {
    literal: 'Examining old rites, the Feelings Emperor was matched with Shizu Yuan Emperor.',
    idiomatic: 'Old rite: Feelings Emperor with Shizu Yuan Emperor.',
  },
  s0252: {
    literal: 'Now, obeying the edict to restore praying for grain as Feelings Emperor and match Grand Ancestor Taizu to Divine Land, while Grand Ancestor under the new rite already matches Round Mound Sovereign of Heaven and Square Mound Sovereign of Earth—if he also matches Feelings Emperor and Divine Land, one fears conflict with ancient rites.',
    idiomatic: 'Taizu already matches Round Mound and Square Mound; adding Feelings Emperor and Divine Land may breach ancient pairing rules.',
  },
  s0253: {
    literal: 'Per the "Sacrifices" chapter of the Book of Rites: "Yu performed di to the Yellow Emperor and jiao to Kui; Xia also di to the Yellow Emperor and jiao to Gun; Yin di to Kui and jiao to Ming; Zhou di to Kui and jiao to Ji."',
    idiomatic: 'Book of Rites, "Sacrifices": Yu di to Yellow Emperor, jiao to Kui; Xia likewise; Yin di to Kui, jiao to Ming; Zhou di to Kui, jiao to Ji.',
  },
  s0254: {
    literal: '」Zheng Xuan annotates: "Di means sacrificing to the Sovereign of Heaven at the Round Mound."',
    idiomatic: 'Zheng Xuan: "Di is sacrifice to the Sovereign of Heaven at the Round Mound."',
  },
  s0255: {
    literal: 'Sacrificing to the Sovereign at the Southern Suburban Altar is called jiao."',
    idiomatic: 'Sacrifice to the Sovereign at the Southern Suburban Altar is jiao."',
  },
  s0256: {
    literal: 'Again per the Three Rites Meaning Summary it says, "Suburban Heaven in the first month of Xia—each king sacrifices the emperor from whom he arose at the Southern Suburban Altar"—this is what the Great Tradition means by "the king performs di to the ancestor from whom his house arose, with his ancestor as consort."',
    idiomatic: 'Three Rites Meaning Summary: Xia first-month suburban Heaven—each king sacrifices his originating emperor at the Southern Suburban Altar—the Great Tradition\'s di with ancestor consort.',
  },
  s0257: {
    literal: 'Thus di requires a remote ancestor; jiao requires the founding ancestor.',
    idiomatic: 'Di needs a remote ancestor; jiao needs the founding ancestor.',
  },
  s0258: {
    literal: 'If di and jiao now use one ancestor, one fears no warrant in canonical ritual.',
    idiomatic: 'Using one ancestor for both di and jiao lacks canonical warrant.',
  },
  s0259: {
    literal: 'Divine Land in the tenth month: the tenth month is when yin holds sway, hence sacrifice then—on examination there is no further ancient fact.',
    idiomatic: 'Tenth-month Divine Land follows yin dominance—no ancient precedent found.',
  },
  s0260: {
    literal: 'Per the Spring and Autumn Annals "suburb at Awakening of Hibernators," Zheng Xuan annotates "the Rites say: the three kings\' suburb all used Xia first month."',
    idiomatic: 'Spring and Autumn Annals: "suburb at Awakening of Hibernators"; Zheng Xuan: "three kings used Xia first month."',
  },
  s0261: {
    literal: '」Again the Three Rites Meaning Summary says: "The law for sacrificing Divine Land: sacrifice in the first month at the Northern Suburban Altar."',
    idiomatic: 'Three Rites Meaning Summary: "Sacrifice Divine Land in first month at Northern Suburban Altar."',
  },
  s0262: {
    literal: '」We ask to sacrifice in the first month per the canon.',
    idiomatic: 'We ask first-month sacrifice per canon.',
  },
  s0263: {
    literal: 'Please assemble Director of Rituals erudites and Director of Studies erudites for joint deliberation and memorial.',
    idiomatic: 'Assemble ritual and studies erudites for joint memorial.',
  },
  s0264: {
    literal: 'For the Spirit Terrace and Bright Hall, examining books and rites used Zheng Xuan\'s meaning and still sacrificed to the Five Directional Emperors; the new rites used Wang Su\'s meaning.',
    idiomatic: 'Spirit Terrace and Bright Hall: books followed Zheng Xuan (Five Directional Emperors); new rites followed Wang Su.',
  },
  s0265: {
    literal: 'Again an edict followed Zheng Xuan\'s meaning to sacrifice to the Five Heavenly Emperors; rain prayer and Bright Hall all followed the edict for sacrifice.',
    idiomatic: 'An edict ordered Zheng Xuan\'s Five Heavenly Emperors; rain prayer and Bright Hall followed.',
  },
  s0266: {
    literal: 'Thereupon Director of Rituals erudites Lu Zunkai, Zhang Tongshi, Quan Wuer, Xu Ziru, and others debated, saying: "The month for Northern Suburban Altar—antiquity has no explicit text."',
    idiomatic: 'Ritual erudites Lu Zunkai et al.: "Northern Suburban month lacks explicit antiquity."',
  },
  s0267: {
    literal: 'Emperor Guangwu on xinwei of the first month first established Northern Suburban Altar.',
    idiomatic: 'Han Guangwu: first month xinwei, first Northern Suburban Altar.',
  },
  s0268: {
    literal: 'Xianhe-era deliberation also used first month for Northern Suburban Altar, yet all without pointed warrant.',
    idiomatic: 'Xianhe used first month too—without explicit warrant.',
  },
  s0269: {
    literal: 'Wude-era ritual ordinances immediately used the tenth month, because yin holds sway—hence sacrifice then.',
    idiomatic: 'Wude ordinances used tenth month because yin dominates.',
  },
  s0270: {
    literal: 'We ask to sacrifice in the old tenth month.',
    idiomatic: 'We ask to keep tenth-month sacrifice.',
  },
  s0271: {
    literal: 'The memorial concluded."',
    idiomatic: 'The memorial ended.',
  },
  s0272: {
    literal: 'In the twelfth month of the second year of Qianfeng, an edict said:',
    idiomatic: 'Qianfeng 2, twelfth month—edict:',
  },
  s0273: {
    literal: 'Receiving the mandate and inheriting Heaven, one exalts utmost reverence in bright sacrifice;',
    idiomatic: 'Mandate and Heaven demand utmost reverence in bright sacrifice;',
  },
  s0274: {
    literal: 'bearing the chart and seizing the register, one displays great filial piety in solemn matching.',
    idiomatic: 'the chart and register call for great filial piety in solemn matching.',
  },
  s0275: {
    literal: 'Thus one offers sturgeon and mudfish in the pure temple, gathers vibrating egrets at Western Yong, spreads the "Odes" and "Hymns" before the Grand Music Master, and makes reverent respect clear in the hall of the deceased father.',
    idiomatic: 'Sturgeon in the pure temple, egrets at Western Yong, Odes before the Music Master, reverence in the father\'s hall.',
  },
  s0276: {
    literal: 'By this one can record the grand enterprise of matching Heaven, continue the vast blessing of accumulated virtue, forever broadcast illustrious fame, and long remain foremost in praise.',
    idiomatic: 'Thus matching Heaven\'s enterprise and accumulated virtue endure in fame.',
  },
  s0277: {
    literal: 'The Zhou capital\'s Way was lost; the Qin court\'s government went awry—rites and music perished, canonical scriptures were destroyed.',
    idiomatic: 'Zhou lost the Way; Qin warped government—rites perished, classics burned.',
  },
  s0278: {
    literal: 'Thus Han dynasty erudites vainly expounded the text of the Six Ancestors;',
    idiomatic: 'Han erudites preached Six Ancestors in vain;',
  },
  s0279: {
    literal: 'Jin-era great scholars vied to set forth the debate on seven sacrifices.',
    idiomatic: 'Jin scholars debated seven sacrifices.',
  },
  s0280: {
    literal: 'Some equated the Sovereign of Heaven with the Five Emperors; some split the Feelings Emperor among the Five Phases.',
    idiomatic: 'Some merged Sovereign of Heaven and Five Emperors; some split Feelings Emperor among Five Phases.',
  },
  s0281: {
    literal: 'From then downward each in turn took ancestors as model; diverse theories swarmed and right and wrong were never settled.',
    idiomatic: 'Since then schools multiplied; right and wrong never settled.',
  },
  s0282: {
    literal: 'We, of meager capacity, have succeeded to the great succession, reverently undertake the suburban sacrifices, and at dawn our burden lies upon us; devoutly we tend the ancestral tablets—awake or asleep, feeling stirs.',
    idiomatic: 'We succeed the throne, bear suburban rites at dawn, tend tablets waking and sleeping.',
  },
  s0283: {
    literal: 'Whenever we reflect on the weight of the ancestral temple and the rites of honored matching, we think to reform old statutes to declare sincere reverence.',
    idiomatic: 'We would reform matching rites to declare sincere reverence.',
  },
  s0284: {
    literal: 'Grand Ancestor Taizu Emperor embraced the age\'s fortune, received the term, founded the enterprise and handed down the succession, rescued the multitude from flood and fire, and settled the living in benevolent longevity.',
    idiomatic: 'Taizu received the mandate, founded the house, rescued the people, settled them in peace.',
  },
  s0285: {
    literal: 'Taizong Wen Emperor\'s virtue shone equal to the sages, his Way reached the subtle divine; he grasped sharp weapons and donned hard armor, combed wind and bathed rain, labored in body to settle the hundred clans, bent himself to aid the four quarters—favor covered the realm, grace reached beyond the seas.',
    idiomatic: 'Taizong\'s virtue matched the sages; he bore hardship to settle the realm and aid the four quarters.',
  },
  s0286: {
    literal: 'Heaven and Earth therefore achieved mutual peace; all things thereby flourished.',
    idiomatic: 'Heaven and Earth at peace; all things flourished.',
  },
  s0287: {
    literal: 'He closed the dark frontier and opened territory; he pointed to the Green Mound and made it a bastion.',
    idiomatic: 'He opened borders and made the Green Mound a bastion.',
  },
  s0288: {
    literal: 'Vast and boundless—no name can grasp it.',
    idiomatic: 'Vast beyond naming.',
  },
  s0289: {
    literal: 'The Rites says: "In the Way of transforming people, nothing is more urgent than ritual."',
    idiomatic: 'The Rites: "Transforming people—nothing urgent as ritual."',
  },
  s0290: {
    literal: 'Ritual has five classics; nothing is weightier than sacrifice.',
    idiomatic: 'Ritual has five classics; sacrifice weighs heaviest.',
  },
  s0291: {
    literal: 'Sacrifice is not that things come from without to arrive; it is born from within the heart.',
    idiomatic: 'Sacrifice springs from the heart—not from without.',
  },
  s0292: {
    literal: 'Therefore only the worthy can fully exhaust the meaning of sacrifice.',
    idiomatic: 'Only the worthy fully grasp sacrifice.',
  },
  s0293: {
    literal: '」How much more ancestral merit and clan virtue, the Way surpassing the hundred kings;',
    idiomatic: 'How much more our ancestors, whose Way surpassed the hundred kings;',
  },
  s0294: {
    literal: 'exhausting sagehood and probing spirit, achievement towering above a thousand ages.',
    idiomatic: 'sagehood exhausted, achievement towering a thousand ages.',
  },
  s0295: {
    literal: 'From now on, for sacrifice at Round Mound, Five Directions, Bright Hall, Feelings Emperor, Divine Land, and the like, Grand Ancestor Taizu and Taizong Wen are honored as consorts; still collectively sacrifice the Sovereign of Heaven and Five Emperors at the Bright Hall.',
    idiomatic: 'Henceforth Round Mound, Five Directions, Bright Hall, Feelings Emperor, and Divine Land: Taizu and Taizong as honored consorts; Sovereign of Heaven and Five Emperors at Bright Hall.',
  },
  s0296: {
    literal: 'May by heartfelt reverence we obtain the display of devotion; ancestral sacrifice matching Heaven forever glorify the grand achievement.',
    idiomatic: 'May heartfelt devotion glorify matching Heaven forever.',
  },
  s0297: {
    literal: 'In the seventh month of the second year of Yifeng, Junior Director of Rituals Wei Wanshi memorialized: "For the Bright Hall great offering, per ancient rites Zheng Xuan\'s meaning sacrifices to the Five Heavenly Emperors; Wang Su\'s meaning sacrifices to the Five Phases Emperors."',
    idiomatic: 'Yifeng 2.7: Wei Wanshi—Bright Hall great offering: Zheng Xuan, Five Heavenly Emperors; Wang Su, Five Phases Emperors.',
  },
  s0298: {
    literal: 'The Zhenguan Rites follow Zheng Xuan\'s Five Heavenly Emperors; since Xianqing the new rites sacrifice to the Sovereign of Heaven.',
    idiomatic: 'Zhenguan followed Zheng; since Xianqing, the Sovereign of Heaven.',
  },
  s0299: {
    literal: 'Obeying the Qianfeng 2 edict to sacrifice to the Five Emperors, again per the imperial rescript jointly sacrifice the Sovereign of Heaven.',
    idiomatic: 'Qianfeng 2 ordered Five Emperors; the rescript added Sovereign of Heaven.',
  },
  s0300: {
    literal: 'We respectfully submit: the third-month Shangyuan 3 edict fixed all five rites on the Zhenguan-era rites.',
    idiomatic: 'Shangyuan 3.3: five rites fixed to Zhenguan standard.',
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
if (data.metadata.chapter !== '021') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 021; standalone T ready (${Object.keys(T).length} entries).`
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
