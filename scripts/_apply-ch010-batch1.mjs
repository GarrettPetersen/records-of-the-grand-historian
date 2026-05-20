#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.010, Suzong — birth through Zhide 1, tenth month) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/010.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 1;
const END = 100;

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
  s0001: {
    literal:
      'Emperor Suzong, posthumous title Civil Bright Martial Virtue Great Sage Great Proclaim Filial, bore the taboo name Heng, third son of Xuanzong; his mother was Empress Yuanxian of the Yang clan.',
    idiomatic:
      'Suzong — styled Civil Bright Martial Virtue Great Sage Great Proclaim Filial, bore the taboo name Heng. He was Xuanzong\'s third son; his mother was Empress Yuanxian of the Yang clan.',
  },
  s0002: {
    literal: 'Born in Jingyun 2, yihai year.',
    idiomatic: 'He was born in the yihai year of Jingyun 2.',
  },
  s0003: {
    literal:
      'Originally named Sisheng; at two he was enfeoffed Prince of Shan, at five appointed Grand Protector of Anxi and ambassador to the four western garrisons and various barbarian tribes.',
    idiomatic:
      'Originally named Sisheng, he was made Prince of Shan at two and at five became grand protector of Anxi and ambassador to the four western garrisons and border tribes.',
  },
  s0004: {
    literal: 'The prince was benevolent, intelligent, and perceptive by nature;',
    idiomatic: 'He was benevolent and bright by nature;',
  },
  s0005: {
    literal:
      'when grown, keen and with strong memory, his compositions elegant; what his eyes and ears took in he never forgot.',
    idiomatic:
      'grown up, he was quick-witted and retentive, wrote elegant prose, and never forgot what he heard or saw.',
  },
  s0006: {
    literal: 'In the first month of Kaiyuan 15, he was enfeoffed Prince of Zhong and his name changed to Jun.',
    idiomatic: 'In the first month of Kaiyuan 15 he was enfeoffed Prince of Zhong and renamed Jun.',
  },
  s0007: {
    literal: 'In the fifth month he took the posts of envoy of Shuofang and grand protector of Chanyu.',
    idiomatic: 'In the fifth month he took command of Shuofang and became grand protector of Chanyu.',
  },
  s0008: {
    literal:
      'In the eighteenth year the Xi and Khitan raided the frontier; the prince was made commander-in-chief of Hebei circuit, Prince Xin\'an Yi as deputy, leading Censor-in-Chief Li Chaoyin, metropolitan prefect Pei Youxian, and eight circuit generals to attack.',
    idiomatic:
      'In Kaiyuan 18 the Xi and Khitan raided the frontier. He was made Hebei commander with Prince Xin\'an Yi as deputy, leading Li Chaoyin, Pei Youxian, and eight circuit generals against them.',
  },
  s0009: {
    literal: 'Officials were also ordered to set pavilions at Guangshun Gate to meet the prince.',
    idiomatic: 'Court officials were ordered to receive him at Guangshun Gate.',
  },
  s0010: {
    literal:
      'Left Chancellor Zhang Yue, retiring, said to academicians Sun Ti and Wei Shu: "I have seen Taizong\'s portrait; Prince Zhong\'s heroic bearing and bright hair, his mien extraordinary—he greatly resembles the sage founder. This is the fortune of the altars of soil and grain.',
    idiomatic:
      'Left Chancellor Zhang Yue told academicians Sun Ti and Wei Shu: "I have seen Taizong\'s portrait. Prince Zhong\'s bearing and mien are extraordinary and greatly resemble our founding emperor. This is fortune for the realm.',
  },
  s0011: {
    literal:
      '" In the twentieth year the generals crushed the Xi and Khitan; for the prince\'s remote command he was advanced to Minister of Education.',
    idiomatic:
      'In Kaiyuan 20 the generals crushed the Xi and Khitan; for his overarching command he was made minister of education.',
  },
  s0012: {
    literal: 'In the twenty-third year his name was changed to Yu.',
    idiomatic: 'In Kaiyuan 23 he was renamed Yu.',
  },
  s0013: {
    literal: 'In the twenty-fifth year Crown Prince Ying fell from favor.',
    idiomatic: 'In Kaiyuan 25 Crown Prince Ying fell from favor.',
  },
  s0014: {
    literal:
      'In the sixth month of the twenty-sixth year, on gengzi, the prince was installed as crown prince and his name changed to Shao.',
    idiomatic:
      'On gengzi of the sixth month of Kaiyuan 26 he was made crown prince and renamed Shao.',
  },
  s0015: {
    literal:
      'Later a memorialist said Shao was the same name as a Song crown prince; he received his present name.',
    idiomatic:
      'Later a memorialist noted that Shao duplicated a Song crown prince\'s name; he took his present name accordingly.',
  },
  s0016: {
    literal:
      'At first, when Crown Prince Ying fell from favor, the emperor summoned Li Linfu to discuss establishing the heir; Consort Wu the Huifei, Prince Shou Mao\'s mother, then enjoyed favor, and Linfu to please her answered with Mao.',
    idiomatic:
      'When Crown Prince Ying fell, Xuanzong asked Li Linfu about the succession. Consort Wu Huifei, mother of Prince Shou Mao, then held favor, and Linfu named Mao to please her.',
  },
  s0017: {
    literal:
      'When the prince was made crown prince, Linfu feared harm to himself and raised the cases of Wei Jian and Liu Ji; the prince was several times nearly endangered.',
    idiomatic:
      'After the prince\'s investiture Linfu feared for himself and framed Wei Jian and Liu Ji; the heir was nearly ruined four times.',
  },
  s0018: {
    literal:
      'Later Yang Guozhong relied on the consort\'s clan, wantonly behaved obscenely, feared the prince\'s martial brilliance, and secretly plotted harm—a long menace.',
    idiomatic:
      'Later Yang Guozhong, leaning on the consort\'s kin, grew licentious and, fearing the prince\'s vigor, plotted against him for years.',
  },
  s0019: {
    literal:
      'In the first month of Tianbao 13, An Lushan came to court; the prince secretly memorialized that Lushan had the aspect of rebellion.',
    idiomatic:
      'In the first month of Tianbao 13 An Lushan came to court, and the prince secretly reported that he bore the look of a rebel.',
  },
  s0020: {
    literal: 'Xuanzong would not listen.',
    idiomatic: 'Xuanzong refused to heed him.',
  },
  s0021: {
    literal:
      'In the eleventh month of the fourteenth year Lushan indeed rebelled, raising troops toward the palace.',
    idiomatic:
      'In the eleventh month of Tianbao 14 Lushan rebelled and marched on the capital.',
  },
  s0022: {
    literal: 'In the twelfth month, on dingwei, the eastern capital fell.',
    idiomatic: 'On dingwei of the twelfth month the eastern capital fell.',
  },
  s0023: {
    literal:
      'On xinchou an edict had the crown prince oversee the state, and also sent the prince to personally command all armies to advance and attack.',
    idiomatic:
      'On xinchou the court ordered the crown prince to oversee the realm and sent him to command the armies in person.',
  },
  s0024: {
    literal:
      'Then Lushan took executing Yang Guozhong as his pretext, and thus soldiers and people gritted their teeth at the Yang clan.',
    idiomatic:
      'Lushan marched under the banner of killing Yang Guozhong, and soldiers and civilians alike hated the Yangs.',
  },
  s0025: {
    literal:
      'Guozhong feared and with the Noble Consort plotted to obstruct the affair; the prince therefore did not go.',
    idiomatic:
      'Guozhong, afraid, colluded with the Noble Consort to block the campaign, and the prince never marched.',
  },
  s0026: {
    literal:
      'Hexi military commissioner Ge Shuhan was summoned as the crown prince\'s vanguard commander and ordered to lead two hundred thousand to hold Tong Pass.',
    idiomatic:
      'Ge Shuhan of Hexi was made the crown prince\'s vanguard commander with two hundred thousand men to hold Tong Pass.',
  },
  s0027: {
    literal:
      'In the sixth month of the next year after Zhide 1, Ge Shuhan was defeated by the rebels, the pass could not be held, and Guozhong urged Xuanzong to go to Shu.',
    idiomatic:
      'In the sixth month of Zhide 2 Ge Shuhan was routed, Tong Pass fell, and Guozhong urged flight to Shu.',
  },
  s0028: {
    literal:
      'On dingyou they reached Mawei halt; the six armies would not advance and demanded execution of the Yang clan.',
    idiomatic:
      'On dingyou at Mawei the army halted and demanded the Yangs\' deaths.',
  },
  s0029: {
    literal: 'Guozhong was executed and the Noble Consort ordered to take her own life.',
    idiomatic: 'Guozhong was killed and the Noble Consort ordered to die by her own hand.',
  },
  s0030: {
    literal:
      'As the imperial carriage was about to depart, the prince was left behind to proclaim reassurance to the people.',
    idiomatic:
      'As the emperor prepared to flee, the prince remained to reassure the people.',
  },
  s0031: {
    literal:
      'The crowd wept and said: "The rebel barbarian has betrayed grace; the sovereign is cast adrift. We were born in this sagely age and are Tang subjects through generations; we wish to join as one to punish the rebel for the state—let us follow the crown prince to recover Chang\'an.',
    idiomatic:
      'The crowd wept: "The rebel has betrayed the throne. We are Tang subjects of a golden age and beg to follow the crown prince to recover Chang\'an.',
  },
  s0032: {
    literal: '" Xuanzong heard and said: "This is Heaven\'s opening.',
    idiomatic: 'Xuanzong heard them and said: "Heaven has spoken.',
  },
  s0033: {
    literal:
      '" He ordered Gao Lishi and Prince Shou Mao to send the crown prince\'s inner attendants and robes and gear, leaving rear stable horses to follow the emperor.',
    idiomatic:
      'He sent Gao Lishi and Prince Shou Mao with the prince\'s household and gear, keeping the rear stable horses for himself.',
  },
  s0034: {
    literal: 'Lishi was ordered to proclaim: "Go well!',
    idiomatic: 'Lishi proclaimed: "Go in peace!',
  },
  s0035: {
    literal: 'The people look to you; take care not to disappoint them.',
    idiomatic: 'The people look to you—do not fail them.',
  },
  s0036: {
    literal: 'Do not mind me."',
    idiomatic: 'Think nothing of me."',
  },
  s0037: {
    literal:
      'Moreover the western and northern barbarians—I have always treated them generously; now the state is in hardship and will surely need their service. Strive onward!"',
    idiomatic:
      'I have always treated the western and northern peoples well; in this crisis they will serve you. Press on!"',
  },
  s0038: {
    literal:
      '" The prince returned to north of the Wei; Bian Bridge was broken, the waters swelled, there were no boats;',
    idiomatic:
      'North of the Wei he found Bian Bridge broken and the river in flood, with no boats;',
  },
  s0039: {
    literal: 'the prince ordered the riverside people; more than three thousand returned.',
    idiomatic: 'he rallied the riverside people and gathered more than three thousand.',
  },
  s0040: {
    literal:
      'The Wei could be waded; they also met scattered soldiers from Tong Pass, mistook them for rebels, fought, and many were wounded.',
    idiomatic:
      'They forded the Wei, mistook scattered Tong Pass troops for rebels, and many were wounded in the fight.',
  },
  s0041: {
    literal:
      'Gathering the remainder he went north; once the army crossed, those behind all drowned; the prince rejoiced, taking it as Heaven\'s aid.',
    idiomatic:
      'He gathered the survivors and crossed north; those behind drowned, and he took it as Heaven\'s blessing.',
  },
  s0042: {
    literal:
      'Then those with the prince were only Princes Guangping and Jianning and four-army officers and soldiers—only two thousand.',
    idiomatic:
      'Only Princes Guangping and Jianning and two thousand troops from four armies remained with him.',
  },
  s0043: {
    literal:
      'From Fengtian northward, they halted at night at Yongshou; the people blocked the road offering cattle and wine.',
    idiomatic:
      'From Fengtian northward they rested at Yongshou, where people brought cattle and wine.',
  },
  s0044: {
    literal:
      'White clouds rose from the northwest, several zhang long, like towers; commentators took it for the qi of the Son of Heaven.',
    idiomatic:
      'White clouds rose from the northwest like towers; men called it the emperor\'s omen.',
  },
  s0045: {
    literal: 'On wuxu he reached Xinping commandery.',
    idiomatic: 'On wuxu he came to Xinping commandery.',
  },
  s0046: {
    literal:
      'Day and night they galloped more than three hundred li; troops and equipment lost more than half; those remaining were barely one brigade.',
    idiomatic:
      'They rode day and night three hundred li; half the men and gear were gone, barely a brigade left.',
  },
  s0047: {
    literal:
      'On jihai he reached Anding commandery and executed Xinping prefect Xue Yu and Baoding prefect Xu She, for abandoning their commands.',
    idiomatic:
      'On jihai at Anding he executed the prefects of Xinping and Baoding for abandoning their posts.',
  },
  s0048: {
    literal:
      'On gengzi he reached Wushi post; Pengyuan prefect Li Zun came to meet, leading soldiers to welcome and advancing clothes and grain.',
    idiomatic:
      'On gengzi at Wushi post Pengyuan prefect Li Zun came with troops, clothing, and grain.',
  },
  s0049: {
    literal:
      'At Pengyuan the prince also recruited four hundred armored soldiers, leading private horses to aid the army.',
    idiomatic:
      'At Pengyuan he raised four hundred more armored men and private horses for the army.',
  },
  s0050: {
    literal:
      'On xinchou he reached Pingliang commandery, mustered public and private horses of the pastures, obtained tens of thousands, and the official army grew stronger.',
    idiomatic:
      'On xinchou at Pingliang he gathered tens of thousands of pasture horses and the army grew strong.',
  },
  s0051: {
    literal: 'The rebels held Chang\'an and knew the prince was training troops in Hexi.',
    idiomatic: 'The rebels in Chang\'an learned he was gathering forces in Hexi.',
  },
  s0052: {
    literal: 'The people of the Three Adjuncts all said: "Our crown prince\'s great army is coming!',
    idiomatic: 'People of the capital region cried: "The crown prince\'s army comes!',
  },
  s0053: {
    literal: '" The rebels seeing dust rise in the northwest sometimes fled.',
    idiomatic: 'Seeing dust in the northwest, the rebels sometimes fled.',
  },
  s0054: {
    literal:
      'On wushen Fufeng man Kang Jinglong killed more than two hundred of the rebels\' pacification commissioners including Xue Zong; Chencang magistrate Xue Jingxian led troops to recover and hold Fufeng commandery.',
    idiomatic:
      'On wushen Kang Jinglong of Fufeng killed two hundred rebel commissioners; Xue Jingxian of Chencang recovered Fufeng.',
  },
  s0055: {
    literal:
      'Hence the great families of Guanfu all plotted to kill rebels, and the rebels therefore dared not raid.',
    idiomatic:
      'Guanfu gentry then plotted against the rebels, who dared not raid.',
  },
  s0056: {
    literal:
      'At Pingliang, for several days the prince did not know where to go; Shuofang acting commissioner Du Hongjian, Wei Shaoyou, Cui Yi and others sent judge Li Han with a letter welcoming the prince, fully describing gathered troops and stores of grain and armor; the prince was greatly pleased.',
    idiomatic:
      'At Pingliang he still did not know his course when Du Hongjian, Wei Shaoyou, and Cui Yi of Shuofang sent Li Han to welcome him with reports of troops, stores, and armor. He rejoiced.',
  },
  s0057: {
    literal:
      'Hongjian also dispatched several thousand Shuofang infantry and cavalry to Baicao halt to welcome him.',
    idiomatic:
      'Hongjian sent several thousand Shuofang horsemen to meet him at Baicao.',
  },
  s0058: {
    literal:
      'Hexi campaigning marshal Pei Mian, newly appointed censor and heading to court, met the prince at Pingliang and also urged him to train troops at Lingwu for advance; the prince agreed.',
    idiomatic:
      'Pei Mian of Hexi, newly made censor en route to court, met him at Pingliang and urged gathering an army at Lingwu; he agreed.',
  },
  s0059: {
    literal:
      'When the prince first left Pingliang, colored clouds floated in the sky, a white crane led ahead; after the army departed, a yellow dragon rose from the house where he had rested and flew into the sky.',
    idiomatic:
      'Leaving Pingliang he saw auspicious clouds, a white crane leading the way, and a yellow dragon rising from his resting place.',
  },
  s0060: {
    literal:
      'Going south of Fengning he saw the Yellow River\'s natural barrier, wished to cross north to hold Fengning; suddenly great wind and flying sand—in a few steps one could not distinguish people; when the army turned toward Lingwu the wind and sand stopped at once and heaven and earth cleared.',
    idiomatic:
      'South of Fengning he meant to cross the Yellow River and hold Fengning, but sandstorms blinded the march; turning toward Lingwu the sky cleared.',
  },
  s0061: {
    literal:
      'In the seventh month, on xinyou, the prince reached Lingwu; Wei Shaoyou had prepared provisions and pavilions, all complete.',
    idiomatic:
      'On xinyou of the seventh month he reached Lingwu, where Wei Shaoyou had everything ready.',
  },
  s0062: {
    literal:
      'Pei Mian, Du Hongjian and others calmly advanced, saying: "Now the rebel violates the norm, poison flows to Hangu; the sovereign wearies of the throne and has moved to Shu.',
    idiomatic:
      'Pei Mian and Du Hongjian said calmly: "Rebels poison the realm; the emperor has fled to Shu.',
  },
  s0063: {
    literal:
      'Rivers and mountains block the way, memorials cannot reach; the altars and sacred vessel must have a master."',
    idiomatic:
      'Roads are cut and the throne cannot stand empty."',
  },
  s0064: {
    literal:
      'The myriad people look up, thinking to exalt the sage lord; Heaven\'s will and human affairs cannot be stubbornly resisted.',
    idiomatic:
      'The people look to a sage ruler; heaven and earth cannot wait."',
  },
  s0065: {
    literal:
      'We humbly wish Your Highness follow their willing acclaim to settle the altars—the great filiality of a true king."',
    idiomatic:
      'We beg Your Highness accept their acclaim and secure the altars—the greatest filial piety."',
  },
  s0066: {
    literal:
      '" The prince said: "Wait until the rebels are pacified, welcome back the imperial carriage, calmly in the eastern palace, attending at meals—would that not be joy!',
    idiomatic:
      'He said: "When the rebels are beaten I will welcome the emperor home and serve in the eastern palace—what could be happier!',
  },
  s0067: {
    literal: 'Why are you so urgent?"',
    idiomatic: 'Why such haste?"',
  },
  s0068: {
    literal: '" Mian and the others memorialized six times in all.',
    idiomatic: 'Mian and the others memorialized six times.',
  },
  s0069: {
    literal:
      'Their words were urgent and impassioned; the prince could not refuse and assented.',
    idiomatic:
      'Their pleas were fierce; he could not refuse and assented.',
  },
  s0070: {
    literal: 'That month, on jiazi, the prince ascended the throne at Lingwu.',
    idiomatic: 'That month, on jiazi, he took the throne at Lingwu.',
  },
  s0071: {
    literal:
      'When rites were complete, Mian and others knelt and advanced: "Since the rebel defied heaven and the two capitals fell, the sage emperor has passed the throne to Your Majesty to re-settle the realm—we bow and wish ten thousand years."',
    idiomatic:
      'When rites ended Mian knelt: "The rebel seized the capitals; the retired emperor passed you the throne. We bow and wish you ten thousand years."',
  },
  s0072: {
    literal: '" The ministers danced and shouted ten thousand years.',
    idiomatic: 'The ministers shouted ten thousand years.',
  },
  s0073: {
    literal: 'The emperor wept and sobbed, moving those around him.',
    idiomatic: 'He wept, moving all around him.',
  },
  s0074: {
    literal: 'That day he reported the matter to the Retired Emperor.',
    idiomatic: 'That day he reported to the retired emperor.',
  },
  s0075: {
    literal: 'That day he held court at Lingwu\'s south gate and issued an edict:',
    idiomatic: 'That day at Lingwu\'s south gate he issued an edict:',
  },
  s0076: {
    literal:
      'Shuofang revenue vice commissioner and directorate of justice clerk Du Hongjian was made Director of the Ministry of War; Shuofang circuit judge Cui Yi was made Director of the Ministry of Personnel, both acting as drafting secretaries.',
    idiomatic:
      'Du Hongjian became director of war and Cui Yi director of personnel, both acting drafting secretaries.',
  },
  s0077: {
    literal:
      'Censor-in-Chief Pei Mian was made Vice Director of the Secretariat and concurrent Secretariat-Chancellery Grand Councilor.',
    idiomatic:
      'Pei Mian became vice director of the secretariat and grand councilor.',
  },
  s0078: {
    literal:
      'Hexi army commissioner Zhou Yi was made Hexi military commissioner; Longyou army commissioner Peng Yuanhui was made Longyou military commissioner; former Pu prefect Lü Chongben was made Guannei military commissioner and concurrent Shunhua prefect.',
    idiomatic:
      'Zhou Yi became Hexi commissioner, Peng Yuanhui Longyou commissioner, and Lü Chongben Guannei commissioner and Shunhua prefect.',
  },
  s0079: {
    literal:
      'Chencang magistrate Xue Jingxian was made Fufeng prefect; Longyou military commissioner Guo Yingyi was made Tianshui prefect.',
    idiomatic:
      'Xue Jingxian became Fufeng prefect and Guo Yingyi Tianshui prefect.',
  },
  s0080: {
    literal:
      'Lingwu commandery was changed to a great protectorate prefecture; upper counties became wang and middle counties shang.',
    idiomatic:
      'Lingwu became a great protectorate; upper counties were raised to wang and middle to shang.',
  },
  s0081: {
    literal:
      'On dingmao the rebels killed Princess Huoguo the Long, Princess Yong the Consort Hou Mo, Princess Yi the Consort Yan, Princess Chen the Consort Wei, Princess Xin the Consort Ren, and Chief Son-in-Law Yang Fei and more than eighty others on Chongren Street.',
    idiomatic:
      'On dingmao rebels killed Princess Huoguo, Princesses Yong, Yi, Chen, and Xin, Chief Son-in-Law Yang Fei, and more than eighty kin on Chongren Street.',
  },
  s0082: {
    literal:
      'On jiaxu more than five thousand of the rebel Tongluo band surrendered to the Shuofang army from the western capital.',
    idiomatic:
      'On jiaxu more than five thousand Tongluo rebels surrendered to Shuofang from the western capital.',
  },
  s0083: {
    literal:
      'On jimao metropolitan prefect Cui Guangyuan, Chang\'an magistrate Su Zhen and others led district officials shouting at the western market, killing several thousand rebels, then came to the mobile court.',
    idiomatic:
      'On jimao Cui Guangyuan and Su Zhen of Chang\'an led officials in the western market, killed thousands of rebels, and joined the court.',
  },
  s0084: {
    literal: 'An edict changed Fufeng to Fengxiang commandery.',
    idiomatic: 'An edict renamed Fufeng Fengxiang commandery.',
  },
  s0085: {
    literal:
      'On renwu Shuofang military commissioner Guo Ziyi and Fanyang military commissioner Li Guangbi crushed the rebels at Jia Mountain in Changshan commandery.',
    idiomatic:
      'On renwu Guo Ziyi and Li Guangbi routed the rebels at Jia Mountain in Changshan.',
  },
  s0086: {
    literal:
      'As the emperor trained troops to recover the capital, an edict ordered Ziyi and others to turn their armies; Ziyi and Guangbi led fifty thousand foot and horse from Hebei to arrive.',
    idiomatic:
      'Training to retake the capital, he recalled Ziyi and Guangbi, who brought fifty thousand troops from Hebei.',
  },
  s0087: {
    literal:
      'An edict made Ziyi Minister of War, still chief of the Lingzhou great protectorate;',
    idiomatic:
      'Ziyi was made minister of war and still chief of Lingzhou protectorate;',
  },
  s0088: {
    literal:
      'Guangbi Minister of Revenue, concurrent Taiyuan prefect and northern capital guardian: both concurrent Secretariat-Chancellery Grand Councilors.',
    idiomatic:
      'Guangbi minister of revenue, Taiyuan prefect, and northern capital guardian—both grand councilors.',
  },
  s0089: {
    literal:
      'Huihe and Tibet sent envoys in succession, seeking marriage alliance and wishing to aid the state in punishing rebels—all were feasted and rewarded and sent off.',
    idiomatic:
      'Huihe and Tibet sent envoys offering alliance and troops against the rebels; all were feasted and dismissed.',
  },
  s0090: {
    literal: 'That day the Retired Emperor reached Chengdu and proclaimed a great amnesty.',
    idiomatic: 'That day Xuanzong reached Chengdu and amnestied the realm.',
  },
  s0091: {
    literal: 'On guisi the emperor\'s memorial first reached Chengdu.',
    idiomatic: 'On guisi his memorial reached Chengdu.',
  },
  s0092: {
    literal:
      'On dingyou the Retired Emperor abdicated as proclamation sovereign and sent Left Chancellor Wei Jiansu, Minister of Culture Fang Guan, and Vice Director of the Chancellery Cui Huan with investiture documents to Lingwu.',
    idiomatic:
      'On dingyou the retired emperor abdicated and sent Wei Jiansu, Fang Guan, and Cui Huan to Lingwu with the investiture.',
  },
  s0093: {
    literal: 'On wuchen the emperor went south to Pengyuan commandery.',
    idiomatic: 'On wuchen he went south to Pengyuan.',
  },
  s0094: {
    literal:
      'The former Prince of Bin Shouli\'s son Chengbao was enfeoffed Prince of Dunhuang and sent to Huihe for marriage; the Huihe qaghan\'s daughter was invested Princess Pijia, and Pugu Huai\'en was ordered to escort Chengbao to the Huihe tribe.',
    idiomatic:
      'Chengbao was made Prince of Dunhuang for a Huihe marriage; the qaghan\'s daughter became Princess Pijia, and Pugu Huai\'en escorted him.',
  },
  s0095: {
    literal:
      'Inner attendant Bian Lingcheng had turned the Retired Emperor over to the rebels and now came again; the emperor ordered him executed.',
    idiomatic:
      'Bian Lingcheng, who had delivered the retired emperor to the rebels, returned and was executed.',
  },
  s0096: {
    literal:
      'On bingzi he reached Shunhua commandery; Wei Jiansu, Fang Guan, Cui Huan and others from Shu commandery brought the investiture documents and the imperial seal.',
    idiomatic:
      'On bingzi at Shunhua, Wei Jiansu, Fang Guan, and Cui Huan arrived from Shu with the seal and investiture.',
  },
  s0097: {
    literal: 'On jimao the Tong Pass defeated general Li Chengguang was beheaded below the banners.',
    idiomatic: 'On jimao Li Chengguang, defeated at Tong Pass, was beheaded before the army.',
  },
  s0098: {
    literal:
      'On xinsi, the first day of the tenth month, the sun was eclipsed to totality.',
    idiomatic: 'On xinsi, the tenth month\'s new moon, the sun was eclipsed to totality.',
  },
  s0099: {
    literal:
      'On guisi Pengyuan commandery, for lack of military funds, temporarily sold offices and ranks and licensed monks and nuns.',
    idiomatic:
      'On guisi Pengyuan, short of war funds, sold offices and licensed monks and nuns.',
  },
  s0100: {
    literal:
      'The emperor had long known Fang Guan\'s name; now Guan requested to be commander to recover the two capitals and was permitted, with Minister of War Wang Sili still as deputy.',
    idiomatic:
      'Knowing Fang Guan\'s reputation, he made him commander to retake the two capitals with Wang Sili as deputy.',
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
if (data.metadata.chapter !== '010') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 010; standalone T ready (${Object.keys(T).length} entries).`
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
