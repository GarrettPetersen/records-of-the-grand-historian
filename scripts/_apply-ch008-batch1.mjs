#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.008, Xuanzong 1 — birth through Kaiyuan 1 edicts) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/008.json';
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
      'Emperor Xuanzong, posthumous title To-the-Way Great Sage Great Illustrious Filial, bore the taboo name Longji, third son of Ruizong; his mother was Empress Zhaocheng the Shunsheng, née Dou.',
    idiomatic:
      'Xuanzong — Emperor Xuanzong, styled To-the-Way Great Sage Great Illustrious Filial, bore the taboo name Longji. He was Ruizong\'s third son; his mother was Empress Zhaocheng the Shunsheng of the Dou clan.',
  },
  s0002: {
    literal: 'In the eighth month of autumn of Chuigong 1, on wuyin, he was born in the eastern capital.',
    idiomatic: 'In the eighth month of Chuigong 1, on wuyin, he was born at Luoyang.',
  },
  s0003: {
    literal: 'By nature he was decisive and gifted in many arts, especially skilled in music, and adept at clerical script.',
    idiomatic: 'He was decisive and multitalented, especially in music, and wrote a fine clerical hand.',
  },
  s0004: {
    literal: 'His bearing was grand and imposing, with an extraordinary presence.',
    idiomatic: 'His bearing was grand and imposing, with a presence beyond the ordinary.',
  },
  s0005: {
    literal: 'In the intercalary seventh month of the third year, on dingmao, he was enfeoffed as Prince of Chu.',
    idiomatic: 'In the intercalary seventh month of that year, on dingmao, he was made Prince of Chu.',
  },
  s0006: {
    literal:
      'In the tenth month of Tianshou 3, on wuxu, he left the inner quarters, opened a princely establishment with staff—he was only seven.',
    idiomatic:
      'In the tenth month of Tianshou 3, on wuxu, he left the inner palace, opened a princely household with officials, and was only seven years old.',
  },
  s0007: {
    literal:
      'On the first and fifteenth of each month his carriage and escort came to the audience hall; Golden Guard general Wu Yizong resented the prince\'s strict order, berated and drove off his guard of honor, intending to humiliate him.',
    idiomatic:
      'On new and full moons his escort came to court; Wu Yizong of the golden guard, resenting the prince\'s discipline, shouted down his guard and tried to break his pride.',
  },
  s0008: {
    literal: 'The prince rebuked him, saying: "This is my family\'s court—what business is it of yours?',
    idiomatic: 'The prince shouted back: "This is our house\'s court—what is it to you?',
  },
  s0009: {
    literal: 'How dare you press upon my escort!"',
    idiomatic: 'How dare you harass my retinue!"',
  },
  s0010: {
    literal: 'When Zetian heard of it she showed him special favor.',
    idiomatic: 'Zetian heard of it and singled him out for special favor.',
  },
  s0011: {
    literal: 'Soon afterward he returned to the inner quarters.',
    idiomatic: 'He soon returned to the inner palace.',
  },
  s0012: {
    literal: 'In the twelfth month of Changshou 2, on dingmao, his title was changed to Prince of Linzi commandery.',
    idiomatic: 'In the twelfth month of Changshou 2, on dingmao, he was made Prince of Linzi commandery.',
  },
  s0013: {
    literal: 'In Shenglì 1 he left the inner quarters and was granted a residence in Jishan ward of the eastern capital.',
    idiomatic: 'In Shenglì 1 he left the inner palace and was given a mansion in Luoyang\'s Jishan ward.',
  },
  s0014: {
    literal: 'In Dazu 1 he accompanied the court to the western capital and was granted a residence in Xingqing ward.',
    idiomatic: 'In Dazu 1 he followed the court to Chang\'an and received a mansion in Xingqing ward.',
  },
  s0015: {
    literal: 'In the Chang\'an era he served as right guard lieutenant and director of the imperial equipage.',
    idiomatic: 'During the Chang\'an years he was right guard lieutenant and director of the imperial equipage.',
  },
  s0016: {
    literal: 'In Shenlong 1 he was promoted to vice minister of the guard.',
    idiomatic: 'In Shenlong 1 he became vice minister of the guard.',
  },
  s0017: {
    literal: 'In the fourth month of Jinglong 2 he was made concurrent acting prefect of Lu Prefecture.',
    idiomatic: 'In the fourth month of Jinglong 2 he became acting prefect of Lu Prefecture.',
  },
  s0018: {
    literal: 'In the twelfth month he was given the silver-blue-glow grandee rank.',
    idiomatic: 'In the twelfth month he received the silver-blue-glow grandee rank.',
  },
  s0019: {
    literal: 'Within the prefecture a yellow dragon and white sun were seen ascending to heaven.',
    idiomatic: 'In the prefecture a yellow dragon and a white sun were seen rising into the sky.',
  },
  s0020: {
    literal:
      'Once when he went hunting, purple clouds hung above him; those following behind looked up and saw them.',
    idiomatic:
      'Once on a hunt purple clouds hung over him, and those riding behind looked up and saw them.',
  },
  s0021: {
    literal: 'Such omens and portents numbered nineteen in all.',
    idiomatic: 'Such omens and portents totaled nineteen.',
  },
  s0022: {
    literal: 'In the fourth year he came to the capital because Zhongzong was about to sacrifice at the southern suburb.',
    idiomatic: 'In the fourth year he came to the capital as Zhongzong prepared to sacrifice at the southern suburb.',
  },
  s0023: {
    literal:
      'Before he departed, he had the diviner Han Li cast the yarrow stalks; one stalk stood alone.',
    idiomatic:
      'Before leaving he had the diviner Han Li cast the yarrow; a single stalk stood upright.',
  },
  s0024: {
    literal: 'Li was startled and said: "A stalk standing alone—an omen beyond the ordinary; it cannot be spoken."',
    idiomatic: 'Li cried out in wonder: "A lone upright stalk—an omen beyond words; do not speak of it."',
  },
  s0025: {
    literal:
      'In Zhongzong\'s last years the imperial house was in turmoil, and the prince often secretly gathered men of ability to aid himself.',
    idiomatic:
      'In Zhongzong\'s last years the house was in turmoil, and the prince quietly gathered able men to strengthen his hand.',
  },
  s0026: {
    literal:
      'Outside his residence was a pool that overflowed for some time; those who read the qi called it dragon vapor.',
    idiomatic:
      'A pool outside his mansion overflowed for some time; geomancers called it dragon vapor.',
  },
  s0027: {
    literal:
      'In the fourth month of the fourth year Zhongzong visited his residence and toured the pool; colored silks were tied into tower-ships, and great elephants were made to tread them.',
    idiomatic:
      'In the fourth month Zhongzong visited his mansion and toured the pool, where silken tower-ships were rigged for great elephants to tread.',
  },
  s0028: {
    literal: 'By the sixth month Zhongzong died suddenly and Empress Wei ruled as regent.',
    idiomatic: 'By the sixth month Zhongzong died suddenly and Empress Wei seized the regency.',
  },
  s0029: {
    literal:
      'Wei Wen, Zong Chuke, Ji Chuna, and others plotted to overturn the dynasty; because of Ruizong\'s weight as the emperor\'s younger brother, they first plotted against him.',
    idiomatic:
      'Wei Wen, Zong Chuke, Ji Chuna, and others plotted to overturn the throne; fearing Ruizong\'s standing as the emperor\'s brother, they moved against him first.',
  },
  s0030: {
    literal:
      'The Daoist Feng Daoli and the recluse Liu Chengzu were both skilled at divination; they came to the prince and pledged their loyalty.',
    idiomatic:
      'The Daoist Feng Daoli and the recluse Liu Chengzu, both skilled diviners, came to the prince and pledged themselves.',
  },
  s0031: {
    literal:
      'The ward where he lived was called Longqing; people slurred the name and said "dragon";',
    idiomatic:
      'His ward was called Longqing; people punned the name into "dragon";',
  },
  s0032: {
    literal:
      'when Empress Wei took power the era name was changed to Tanglong—all matched his name and title.',
    idiomatic:
      'when Empress Wei ruled she renamed the era Tanglong—every sign matched his name.',
  },
  s0033: {
    literal:
      'The prince grew more confident and plotted with Princess Taiping; the princess was pleased and sent her son Chongjian to join.',
    idiomatic:
      'Growing bolder, he plotted with Princess Taiping; she was delighted and sent her son Chongjian to help.',
  },
  s0034: {
    literal:
      'He then settled the plan with Chongjian, Chaoyi lieutenant Liu Youqiu, senior guard officer Ma Sizong, ten-thousand-cavalry commander Ge Fushun and Li Xianfu, and the Baochang monk Puyun, among others, to execute the Wei faction.',
    idiomatic:
      'With Chongjian, Liu Youqiu, Ma Sizong, Ge Fushun, Li Xianfu, the monk Puyun, and others he fixed a plan to kill the Wei faction.',
  },
  s0035: {
    literal: 'Some said: "First inform the Prince of Xiang."',
    idiomatic: 'Some urged: "Ask the Prince of Xiang first."',
  },
  s0036: {
    literal:
      'The prince said: "I am saving the altars from peril and rushing to my father\'s crisis—if we succeed, the blessing returns to the state; if we fail, I die in loyalty. How can I ask first and frighten the king?',
    idiomatic:
      'The prince said: "I am saving the realm and rushing to my father\'s peril—success blesses the altars, failure is death in loyalty. How can I ask first and terrify the king?',
  },
  s0037: {
    literal: 'If he consents, he is bound to a dangerous affair;',
    idiomatic: 'If he agrees, he is drawn into danger;',
  },
  s0038: {
    literal: 'if he refuses, our plan is lost."',
    idiomatic: 'if he refuses, our plan is ruined."',
  },
  s0039: {
    literal:
      'That night, on gengzi, he led Youqiu and several dozen men in from the south of the park; Director of Works Zhong Shaojing also led more than a hundred artisans to follow.',
    idiomatic:
      'On gengzi night he led Youqiu and dozens of men in from the south of the park; Zhong Shaojing of the works directorate brought more than a hundred craftsmen.',
  },
  s0040: {
    literal:
      'He sent the ten-thousand-cavalry to the Xuanwu Gate to kill the feathered-forest generals Wei Bo and Gao Song, brought their heads back, and the host shouted and gathered.',
    idiomatic:
      'Ten-thousand-cavalry detachments killed feathered-forest generals Wei Bo and Gao Song at the Xuanwu Gate and returned with their heads; the host roared and rallied.',
  },
  s0041: {
    literal:
      'They attacked the White Beast and Mysterious Virtue gates, cut through the barriers, and entered; the left ten-thousand-cavalry entered from the left, the right from the right, and met before the Tower of Lingyan.',
    idiomatic:
      'They stormed the White Beast and Mysterious Virtue gates, cut the bars, and burst in; left and right ten-thousand-cavalry columns met before the Tower of Lingyan.',
  },
  s0042: {
    literal:
      'At that time before the Hall of Supreme Ultimate stood the guard of honor for the late emperor\'s bier; hearing the uproar, they all donned armor and responded.',
    idiomatic:
      'Guards of honor for the late emperor\'s bier stood before the Hall of Supreme Ultimate; hearing the clamor, they armed and answered.',
  },
  s0043: {
    literal: 'Empress Wei fled in panic into the flying-cavalry camp and was killed by the mutinous troops.',
    idiomatic: 'Empress Wei fled in panic into the flying-cavalry camp and was cut down by the mutineers.',
  },
  s0044: {
    literal:
      'They then sent parties to execute the Wei faction; by dawn, inside and outside, pursuit and capture had all been beheaded.',
    idiomatic:
      'Parties were sent to slaughter the Wei faction; by dawn every pursuer inside and out had taken heads.',
  },
  s0045: {
    literal: 'He then galloped to Ruizong and apologized for not having asked permission first.',
    idiomatic: 'He galloped to Ruizong and begged pardon for not having asked leave first.',
  },
  s0046: {
    literal:
      'Ruizong rushed forward, embraced the prince, and wept: "The altars\' peril—you have settled it; gods and people alike rely on your strength."',
    idiomatic:
      'Ruizong ran to embrace him, weeping: "You have steadied the altars in calamity; gods and people rest on your strength."',
  },
  s0047: {
    literal:
      '" He was appointed director of the palace workshops, equal in rank to the Three Offices at the Secretariat Chancellery, with charge of the left and right ten-thousand-cavalry, and advanced to Prince of Ping.',
    idiomatic:
      'He was made director of palace workshops, third rank at the Secretariat Chancellery, commander of the left and right ten-thousand-cavalry, and Prince of Ping.',
  },
  s0048: {
    literal:
      'When Ruizong took the throne he discussed installing a crown prince with his attendants; all said: "Who removes the realm\'s disaster enjoys the realm\'s blessing;',
    idiomatic:
      'When Ruizong ascended he asked his ministers about the crown prince; all said: "Who lifts the realm from disaster earns its blessing;',
  },
  s0049: {
    literal: 'who saves the realm from peril receives its security."',
    idiomatic: 'who saves it from peril receives its peace."',
  },
  s0050: {
    literal:
      'The Prince of Ping has sagely virtue and settled the realm; we also hear that Chengqi and his younger brothers all yield—he should bear the ancestral wine and answer the people\'s hearts."',
    idiomatic:
      'Prince Ping has sagely virtue and settled the realm; Chengqi and the younger princes are said to yield—he should bear the ancestral sacrifice and satisfy every heart."',
  },
  s0051: {
    literal: '" Ruizong followed this.',
    idiomatic: 'Ruizong agreed.',
  },
  s0052: {
    literal: 'On bingwu an edict was issued:',
    idiomatic: 'On bingwu the throne issued an edict:',
  },
  s0053: {
    literal:
      'On the sixth day of the seventh month Ruizong presided at the Gate of Accepting Heaven; the crown prince went to the audience hall to receive the investiture.',
    idiomatic:
      'On jisi of the seventh month Ruizong sat at the Gate of Accepting Heaven while the crown prince received investiture in the audience hall.',
  },
  s0054: {
    literal:
      'That day there was an auspicious cloud; the era name was changed to Jingyun, and a general amnesty was proclaimed throughout the realm.',
    idiomatic:
      'That day auspicious clouds appeared; the era was renamed Jingyun and the realm received a general amnesty.',
  },
  s0055: {
    literal:
      'In the second year another edict said: "Heaven begets the multitude and the sovereign tends them;',
    idiomatic:
      'In the second year another edict read: "Heaven begets the people and the sovereign tends them;',
  },
  s0056: {
    literal: 'the throne establishes the state and appoints an heir to assist."',
    idiomatic: 'the throne founds the state and sets an heir to assist."',
  },
  s0057: {
    literal: 'This is to secure the house and firm the succession.',
    idiomatic: 'Thus the house is secured and the succession made firm.',
  },
  s0058: {
    literal:
      'We have inherited the great enterprise and reverently hold the imperial chart; at midnight we do not sleep, at sundown we forget weariness.',
    idiomatic:
      'We have inherited the great enterprise and hold the imperial chart in awe; we sleep after midnight and forget rest at sundown.',
  },
  s0059: {
    literal: 'Across the vast seas we fear one man may not be reached;',
    idiomatic: 'Across the vast seas we fear one man may go unreached;',
  },
  s0060: {
    literal: 'among the teeming people we fear one thing may be lost.',
    idiomatic: 'among the countless people we fear even one thing may be lost.',
  },
  s0061: {
    literal:
      'Though ministers exhaust their loyalty and magistrates spread their teaching, gazing over the realm we are still not at ease.',
    idiomatic:
      'Though ministers give all their loyalty and magistrates spread good rule, looking over the realm we are not yet at ease.',
  },
  s0062: {
    literal: 'Therefore we seek the people\'s changing winds and follow the former court\'s precedent.',
    idiomatic: 'Therefore we seek the people\'s voice and follow precedent of the former court.',
  },
  s0063: {
    literal:
      'Crown Prince Ji is filial and humane by nature, warm and reverent in virtue, deeply versed in ritual, and able to discern the imperial design—he should oversee the state and let him govern.',
    idiomatic:
      'Crown Prince Ji is filial by nature, reverent in conduct, steeped in ritual, and clear in statecraft—let him oversee the realm and govern in our stead.',
  },
  s0064: {
    literal:
      'Appointments and dismissals from the sixth rank down and penal servitude and below shall all be decided by Ji."',
    idiomatic:
      'Appointments through the sixth rank and penal cases through penal servitude shall all be decided by Ji."',
  },
  s0065: {
    literal:
      '" In the sixth month of Xiantian 1, the villainous faction had diviners tell Ruizong: "According to the celestial signs, the imperial seat and the fore-star suffer calamity; the crown prince ought to become Son of Heaven and should no longer dwell in the eastern palace."',
    idiomatic:
      'In the sixth month of Xiantian 1 plotters had diviners tell Ruizong: "The stars show calamity on the throne and the heir— the crown prince should become emperor and not remain in the eastern palace."',
  },
  s0066: {
    literal: '" Ruizong said: "To pass virtue and avoid disaster—my mind is decided."',
    idiomatic: 'Ruizong said: "To pass on virtue and flee disaster—my mind is made up."',
  },
  s0067: {
    literal: '"',
    idiomatic: '[End of edict.]',
  },
  s0068: {
    literal: 'On renwu of the seventh month an edict was issued:',
    idiomatic: 'On renwu of the seventh month the throne issued an edict:',
  },
  s0069: {
    literal:
      'The prince was fearful; he galloped in, kowtowed, and asked the meaning of the intended abdication.',
    idiomatic:
      'The prince was terrified; he galloped in, kowtowed, and begged to know why the throne would abdicate.',
  },
  s0070: {
    literal: 'Ruizong said: "Through your merit I gained the altars."',
    idiomatic: 'Ruizong said: "Through your merit I hold the altars."',
  },
  s0071: {
    literal:
      'Now the imperial seat has a blemish; I wish to yield and withdraw—only great sagely virtue and great merit can turn calamity into blessing."',
    idiomatic:
      'Now the throne bears a blemish in heaven; I mean to yield—only great virtue and merit can turn calamity to blessing."',
  },
  s0072: {
    literal: 'To transfer the position to you—I know it is late."',
    idiomatic: 'To place the throne in your hands—I know I am late."',
  },
  s0073: {
    literal:
      'The prince then administered affairs from Wude Hall; appointments and dismissals from the third rank down and penal cases he decided himself.',
    idiomatic:
      'He then held court at Wude Hall and decided appointments through the third rank and all penal cases himself.',
  },
  s0074: {
    literal:
      'On the third day of the seventh month of Xiantian 2, inaugural Kaiyuan 1, Left Vice Minister of the Department of State Affairs Dou Huaizhen, Attendant-in-Chief Cen Yi, Secretariat Director Xiao Zhibo and Cui Shi, Yongzhou chief administrator Li Jin, Left Feathered Forest grand general Chang Yuankai, Right Feathered Forest general Li Ci, and others joined Princess Taiping in a plot to raise the feathered-forest troops in revolt on the fourth of that month.',
    idiomatic:
      'On the third day of the seventh month of Xiantian 2—the first day of Kaiyuan—Dou Huaizhen, Cen Yi, Xiao Zhibo, Cui Shi, Li Jin, Chang Yuankai, Li Ci, and others joined Princess Taiping to plot a feathered-forest revolt for the fourth.',
  },
  s0075: {
    literal:
      'The emperor learned of it in secret and told Princes of Qi and Xue Fan and Ye, Minister of War Guo Yuanzhen, and Generals Wang Maozhong and others; taking more than three hundred horses from the spare stables and over three hundred household retainers, he led Grand Master of the Stud Li Lingwen, Wang Shouyi, inner attendant Gao Lishi, commander Li Shoude, and a dozen trusted men out of Wude Hall and through the Qianhua Gate.',
    idiomatic:
      'Forewarned, he told Princes Fan and Ye, Guo Yuanzhen, and Wang Maozhong; with three hundred spare-stable horses and household troops he led Li Lingwen, Wang Shouyi, Gao Lishi, Li Shoude, and a dozen intimates out of Wude Hall through the Qianhua Gate.',
  },
  s0076: {
    literal: 'Chang Yuankai and Li Ci were beheaded at the northern gate.',
    idiomatic: 'Chang Yuankai and Li Ci lost their heads at the northern gate.',
  },
  s0077: {
    literal: 'Jia Yingfu and Li You were seized in the inner guest office and brought out.',
    idiomatic: 'Jia Yingfu and Li You were seized in the inner guest office and dragged out.',
  },
  s0078: {
    literal: 'At court Xiao Zhibo and Cen Yi were seized and all beheaded.',
    idiomatic: 'Xiao Zhibo and Cen Yi were seized at court and beheaded.',
  },
  s0079: {
    literal:
      'The next day Ruizong issued an edict: "We shall dwell high and act through nonaction; from now on all military, state, penal, and administrative matters shall be decided by the emperor."',
    idiomatic:
      'Next day Ruizong decreed: "We shall dwell in nonaction; henceforth all military, state, penal, and civil affairs belong to the emperor."',
  },
  s0080: {
    literal: 'The emperor ascended the Tower of Accepting Heaven and issued an edict:',
    idiomatic: 'The emperor mounted the Tower of Accepting Heaven and proclaimed:',
  },
  s0081: {
    literal: 'On dingmao Cui Shi and Lu Zangyong were stripped of office and exiled to Lingnan.',
    idiomatic: 'On dingmao Cui Shi and Lu Zangyong were dismissed and exiled to Lingnan.',
  },
  s0082: {
    literal:
      'On renshen Wang Ju became silver-blue-glow grandee and minister of revenue, enfeoffed as Duke of Zhao with a substantive fief of three hundred households;',
    idiomatic:
      'On renshen Wang Ju became silver-blue-glow grandee and minister of revenue, Duke of Zhao with three hundred households;',
  },
  s0083: {
    literal:
      'Jiang Jiao silver-blue-glow grandee and minister of works, enfeoffed as Duke of Chu with a substantive fief of five hundred households;',
    idiomatic:
      'Jiang Jiao minister of works and Duke of Chu with five hundred households;',
  },
  s0084: {
    literal: 'Li Lingwen silver-blue-glow grandee and director of the palace workshops, substantive fief of three hundred households;',
    idiomatic: 'Li Lingwen director of palace workshops with three hundred households;',
  },
  s0085: {
    literal:
      'Wang Maozhong auxiliary state grand general, left martial guard grand general, acting superintendent of inner and outer stud farms and overseer of herds, Duke of Huo with a substantive fief of five hundred households;',
    idiomatic:
      'Wang Maozhong auxiliary state grand general, left martial guard general, overseer of stud farms, Duke of Huo with five hundred households;',
  },
  s0086: {
    literal:
      'Wang Shouyi silver-blue-glow grandee and acting grand master of splendid rites, advanced to Duke of Jin with a substantive fief of five hundred households—all rewarded for settling the plot.',
    idiomatic:
      'Wang Shouyi acting grand master of splendid rites, advanced to Duke of Jin with five hundred households—all rewarded for the coup.',
  },
  s0087: {
    literal: 'Ju, Jiao, and Lingwen firmly declined.',
    idiomatic: 'Ju, Jiao, and Lingwen all declined firmly.',
  },
  s0088: {
    literal:
      'On guichou Secretariat Vice Director Lu Xiangxian became chief administrator of Yizhou metropolitan prefecture and inspection commissioner for Jiannan military affairs; Left Assistant in the Department of State Affairs Zhang Yue became acting secretariat director.',
    idiomatic:
      'On guichou Lu Xiangxian became Yizhou chief administrator and Jiannan inspection commissioner; Zhang Yue became acting secretariat director.',
  },
  s0089: {
    literal: 'On jiaxu he ordered the Heavenly Axis destroyed and its bronze and iron used for military supplies.',
    idiomatic: 'On jiaxu he ordered the Heavenly Axis torn down and its metal cast for military use.',
  },
  s0090: {
    literal: 'On gengchen Wang Ju became secretariat vice director with two hundred added households in his fief;',
    idiomatic: 'On gengchen Wang Ju became secretariat vice director with two hundred added fief households;',
  },
  s0091: {
    literal:
      'Jiang Jiao director of the palace workshops, still superintendent of inner and outer stud farms, with two hundred added households in his fief;',
    idiomatic:
      'Jiang Jiao director of palace workshops and stud superintendent with two hundred added households;',
  },
  s0092: {
    literal:
      'Li Lingwen vice director of the palace workshops and overseer of imperial food, with two hundred added households in his fief.',
    idiomatic: 'Li Lingwen vice director of palace workshops and overseer of imperial food with two hundred added households.',
  },
  s0093: {
    literal:
      'On jichou the High Emperor Xiaoming of Zhou was posthumously restored as Prince of Taiyuan, and the imperial title was removed;',
    idiomatic:
      'On jichou the Zhou High Emperor Xiaoming was posthumously restored as Prince of Taiyuan and stripped of the imperial title;',
  },
  s0094: {
    literal: 'Empress Xiaoming was to be called Princess of Taiyuan;',
    idiomatic: 'Empress Xiaoming was to be styled Princess of Taiyuan;',
  },
  s0095: {
    literal: 'the Haoling and Shunling tombs were both to be called the tombs of the Prince of Taiyuan and his consort.',
    idiomatic: 'Haoling and Shunling were renamed the tombs of the Prince of Taiyuan and consort.',
  },
  s0096: {
    literal:
      'On renchen of the eighth month the exiled Liu Youqiu of Feng Prefecture was made Left Vice Minister of the Department of State Affairs, in charge of weighty state affairs, Duke of Xu, still with his former substantive fief of seven hundred households.',
    idiomatic:
      'On renchen Liu Youqiu, exiled from Feng Prefecture, became left vice minister of state, in charge of weighty affairs, Duke of Xu, keeping his seven-hundred-household fief.',
  },
  s0097: {
    literal: 'An edict said: "Whenever there is punishment, it is the state\'s constant law.',
    idiomatic: 'An edict said: "Punishment is the state\'s constant law.',
  },
  s0098: {
    literal: 'To gather bones and bury flesh is the king\'s heart."',
    idiomatic: 'To gather bones and bury flesh is the king\'s care."',
  },
  s0099: {
    literal:
      'From now on, whoever butchers or mutilates the flesh of the punished shall be sentenced under the law for cruel injury."',
    idiomatic:
      'Henceforth whoever butchers or mutilates the flesh of the condemned shall be punished for cruel injury."',
  },
  s0100: {
    literal: '"',
    idiomatic: '[End of edict.]',
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
if (data.metadata.chapter !== '008') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 008; standalone T ready (${Object.keys(T).length} entries).`
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
