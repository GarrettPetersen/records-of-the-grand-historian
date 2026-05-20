#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.011, Daizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
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
      'Emperor Daizong, posthumous title Sagacious Literary Filial Martial, bore the taboo name Yu; he was Suzong\'s eldest son; his mother was Empress Zhangjing of the Wu clan.',
    idiomatic:
      'Daizong — styled Sagacious Literary Filial Martial, taboo name Yu — was Suzong\'s eldest son; his mother was Empress Zhangjing (née Wu).',
  },
  s0002: {
    literal:
      'On the thirteenth day of the twelfth month of Kaiyuan 14 he was born at Shangyang Palace in the Eastern Capital.',
    idiomatic:
      'He was born on the thirteenth of the twelfth month, Kaiyuan 14, at Shangyang Palace in Luoyang.',
  },
  s0003: {
    literal: 'His original name was Chu; at age fifteen he was enfeoffed as Prince of Guangping.',
    idiomatic: 'Originally named Chu, he became Prince of Guangping at fifteen.',
  },
  s0004: {
    literal:
      'Among Xuanzong\'s more than a hundred grandsons, he alone was the legitimate imperial grandson.',
    idiomatic:
      'Of Xuanzong\'s hundred-odd grandsons, he was the sole legitimate heir in the male line.',
  },
  s0005: {
    literal: 'His bearing was vast and deep; magnanimous yet decisive.',
    idiomatic: 'He was magnanimous and resolute, with a depth of presence that matched his stature.',
  },
  s0006: {
    literal: 'Joy and fear did not show on his face.',
    idiomatic: 'Neither joy nor fear ever showed on his face.',
  },
  s0007: {
    literal: 'Benevolent, filial, warm, and courteous — in movement he always followed ritual.',
    idiomatic: 'Benevolent, filial, and courteous, he let ritual govern every act.',
  },
  s0008: {
    literal:
      'From youth he loved learning, especially the Rites and Changes; Xuanzong cherished him.',
    idiomatic:
      'He loved learning from boyhood, above all the Rites and the Changes, and Xuanzong doted on him.',
  },
  s0009: {
    literal:
      'In An Lushan\'s rebellion the capital fell to rebels; he followed Suzong to raise troops at Lingwu and was made commander-in-chief of all armies under Heaven.',
    idiomatic:
      'When the capital fell in An Lushan\'s rebellion, he followed Suzong to Lingwu and was named supreme commander of the empire\'s forces.',
  },
  s0010: {
    literal:
      'The court was then newly founded and recruits few and weak; he showed open heart and good faith, winning over the scattered — by the time he reached Pengyuan his forces numbered tens of thousands.',
    idiomatic:
      'With the court still fragile and troops scarce, he won stragglers by trust; at Pengyuan he commanded tens of thousands.',
  },
  s0011: {
    literal:
      'When Suzong returned to favor at Fengxiang, Fang Guan and Guo Ziyi met repeated defeats, the rebel spearhead was sharp, and raids came again and again.',
    idiomatic:
      'After Suzong reached Fengxiang, Fang Guan and Guo Ziyi kept losing; the rebels were at their peak and raided relentlessly.',
  },
  s0012: {
    literal:
      'He selected the brave and capable, repeatedly blunted their edge; the sacred mind found no rest, yet soldiers\' hearts greatly revived.',
    idiomatic:
      'He picked bold commanders, blunted rebel attacks again and again, and though the throne itself could not rest easy, the army\'s morale soared.',
  },
  s0013: {
    literal:
      'When the army advanced to attack, the hundred officials took leave; he walked out the palace gate and only then mounted horse.',
    idiomatic:
      'When the host marched out, officials saw him off on foot through the gate before he at last mounted.',
  },
  s0014: {
    literal:
      'The Uyghur Yabghu\'s prince led troops to aid; his courage topped all the foreign tribes — the Prince received him with generous favor and swore brotherhood, so at Xiangji the rebels were crushed and abandoned the Western Capital in flight.',
    idiomatic:
      'The Uyghur Yabghu\'s son brought allies whose valor outshone every tribe; the Prince treated him as a brother, and at Xiangji the rebels were shattered and fled Chang\'an.',
  },
  s0015: {
    literal:
      'Though Ziyi and Siye fought with desperate valor, it was because the Prince\'s grace and trust bound the soldiers\' hearts that men wished to give their utmost.',
    idiomatic:
      'Guo Ziyi and Li Siye fought fiercely, but the army fought for a prince who had earned their trust.',
  },
  s0016: {
    literal:
      'Once the capital was retaken, orders ran and prohibitions held; the people lived in peace, not a hair was harmed, elders came welcoming and wept before him.',
    idiomatic:
      'After Chang\'an was recovered, discipline held and civilians were untouched; old men came weeping to greet him.',
  },
  s0017: {
    literal:
      'Hearing rebel remnants still held the Shaanxi suburbs, that very day he drove hard east toward Guo and Luo.',
    idiomatic:
      'Learning rebels still held the approaches to Shaanxi, he pressed east the same day toward the Guo-Luo region.',
  },
  s0018: {
    literal:
      'At the battle of Xindian one great victory; of An Qingxu\'s faction, seven or eight in ten were destroyed.',
    idiomatic:
      'At Xindian he won a crushing victory, destroying seven or eight tenths of Qingxu\'s forces.',
  },
  s0019: {
    literal:
      'Within several tens of days Henan was settled, both capitals restored, the Two Sages returned — the merit of supreme command he declined to accept.',
    idiomatic:
      'Within weeks Henan was pacified and both capitals restored; he refused credit for commanding the return of the two emperors.',
  },
  s0020: {
    literal:
      'When Suzong returned to the capital, a general amnesty was proclaimed and he was re-enfeoffed as Prince of Chu.',
    idiomatic:
      'Suzong\'s return brought a great amnesty and his title became Prince of Chu.',
  },
  s0021: {
    literal: 'In the third month of Qianyuan 1 he was re-enfeoffed as Prince of Cheng.',
    idiomatic: 'In the third month of Qianyuan 1 he became Prince of Cheng.',
  },
  s0022: {
    literal: 'In the fourth month, on gengyin, he was established as crown prince and renamed Yu.',
    idiomatic: 'On gengyin in the fourth month he was made crown prince and took the name Yu.',
  },
  s0023: {
    literal:
      'In the last years of Shangyuan both palaces were ill; the crown prince went back and forth tending sickness, personally tasted medicines and food, long went without the angled belt of mourning dress — when he received the order to supervise the state he followed it in tears.',
    idiomatic:
      'When both emperors fell ill in Shangyuan\'s last years, the crown prince nursed them, tasted their food and medicine, and long wore plain dress; accepting regency, he obeyed in tears.',
  },
  s0024: {
    literal:
      'In the fourth month of Baoying 1 Suzong was near death; the favored Empress Zhang had no son — the empress feared the crown prince\'s merit was too high to control, secretly brought Prince of Yue Li Xi into the palace, and plotted deposition and installation.',
    idiomatic:
      'In Baoying 1\'s fourth month Suzong lay dying; childless Empress Zhang feared the crown prince\'s power, smuggled Prince of Yue Li Xi into the palace, and plotted to replace him.',
  },
  s0025: {
    literal: 'On yichou the empress forged an edict summoning the crown prince.',
    idiomatic: 'On yichou the empress forged an order calling the crown prince to court.',
  },
  s0026: {
    literal:
      'Eunuchs Li Fuguo and Cheng Yuanzhen had long known of it; they mustered troops at Lingxiao Gate and, when the crown prince arrived, immediately escorted him into the Flying Dragon Stable to await developments.',
    idiomatic:
      'Li Fuguo and Cheng Yuanzhen, forewarned, seized Lingxiao Gate and, when the prince came, rushed him to the Flying Dragon Stable.',
  },
  s0027: {
    literal:
      'That night troops were mustered in the Three Halls; Prince of Yue Li Xi and eunuchs Zhu Guanghui, Ma Yingjun, and others were seized and imprisoned; the empress was confined in a separate hall.',
    idiomatic:
      'That night they occupied the Three Halls, arrested Li Xi and several eunuchs, and confined the empress apart.',
  },
  s0028: {
    literal:
      'On dingmao Suzong died; Yuanzhen and others first received the Prince at Jiuxian Gate, had him see the ministers, and performed the regency rites.',
    idiomatic:
      'On dingmao Suzong died; Yuanzhen brought the prince to Jiuxian Gate to meet officials and conduct regency.',
  },
  s0029: {
    literal: 'On jisi he took the throne before the coffin.',
    idiomatic: 'On jisi he ascended the throne beside the bier.',
  },
  s0030: {
    literal:
      'On jiaxu an edict stated: "State affairs of greatest weight put arms first; the court has ancient statutes — kin and worthies are entrusted.',
    idiomatic:
      'On jiaxu an edict declared that in great affairs of state war came first, and that kin and the worthy should command the armies.',
  },
  s0031: {
    literal: 'Therefore seek what must be fitting and employ it within central authority;',
    idiomatic: 'The right man must be found and given command at the center;',
  },
  s0032: {
    literal: 'keeping utmost fairness, how could one shrink from promoting from within?"',
    idiomatic: 'with full fairness, without shame at an inner promotion."',
  },
  s0033: {
    literal:
      'Special eminence, Prince of Fengjie Li Shi, is fit to be commander-in-chief of all armies under Heaven.',
    idiomatic:
      'Li Shi, Prince of Fengjie, is named commander-in-chief of all forces.',
  },
  s0034: {
    literal:
      '」 On yihai the Minister of War and acting commander of the commander\'s campaign, Director of Studs and the like Li Fuguo was advanced in title to Sublime Father; Flying Dragon Studs deputy Cheng Yuanzhen was made Right Gate Guardian General.',
    idiomatic:
      'Thus ended the edict. On yihai Li Fuguo became "Sublime Father," and Cheng Yuanzhen Right Gate Guardian General.',
  },
  s0035: {
    literal: 'Eunuchs Zhu Guanghui, Tan Tingyao, Chen Xianfu, and others were banished to Qianzhong.',
    idiomatic: 'Zhu Guanghui, Tan Tingyao, Chen Xianfu, and other eunuchs were exiled to Qian.',
  },
  s0036: {
    literal:
      'In the fifth month, on jimao new moon, Li Fuguo was made Grand Minister of Works and concurrently Grand Secretariat Director; the rest unchanged.',
    idiomatic:
      'On the fifth month\'s jimao new moon Li Fuguo became Grand Minister of Works and chancellor as well.',
  },
  s0037: {
    literal:
      'On xinmao a proclamation stated: "Three years\' mourning is the universal rite under Heaven — if one alters it, how may one teach the people?',
    idiomatic:
      'On xinmao a proclamation opened: three years\' mourning was the world\'s rite — to alter it was to undo teaching.',
  },
  s0038: {
    literal:
      'We have met this bereavement; wailing knows no limit; the dukes and ministers firmly beg that We hear court affairs — cut hemp and sackcloth pierce the spirit — how can We at once discuss public removal of mourning and hasten from the mourning hut?',
    idiomatic:
      'Struck by my father\'s death, I am beyond consolation; ministers urge me to govern, yet sackcloth still cuts to the bone — I cannot rush from mourning.',
  },
  s0039: {
    literal:
      'Yesterday We saw the ritual officials\' schedule: this month\'s thirteenth day is the great felicity rite, the fifteenth the return to auspicious dress.',
    idiomatic:
      'Yesterday\'s ritual schedule set the thirteenth for great felicity and the fifteenth for auspicious dress.',
  },
  s0040: {
    literal:
      'Looking up to rely on the late emperor\'s testament yet again they wish to restrain Us — probing Our grief, We deeply deem it not yet possible.',
    idiomatic:
      'They cite my father\'s testament to restrain me again; in deepest grief I judge the time not ripe.',
  },
  s0041: {
    literal:
      'Let the hundred officials all on this account remove mourning dress; We shall follow King Wu Ding\'s way and the Ode of the Plain Cap — twice a full cycle in reverent silence, unwilling to seize power by force.',
    idiomatic:
      'Let officials leave mourning; I will keep Wu Ding\'s silence and the Plain Cap ode two full cycles before I take power.',
  },
  s0042: {
    literal: 'All who hold office should share this grieving heart.',
    idiomatic: 'Let every officer share this grief.',
  },
  s0043: {
    literal:
      '」 Chancellor Miao Jinqing and others thrice memorialized begging to follow the late testament before he at last heard government.',
    idiomatic:
      'Thus ended the proclamation. Miao Jinqing and other chancellors begged three times to follow the late edict before he took up rule.',
  },
  s0044: {
    literal:
      'On bingxu Heir Apparent Prince of Lu Li Yu was re-enfeoffed Prince of Zou; Prince of Fengjie Li Shi advanced to Prince of Lu; Li Guangbi advanced to Prince of Linhuai.',
    idiomatic:
      'On bingxu Li Yu became Prince of Zou; Li Shi became Prince of Lu; Li Guangbi Prince of Linhuai.',
  },
  s0045: {
    literal: 'Minister of Rites Xiao Hua was demoted to Shaanzhou assistant prefect.',
    idiomatic: 'Xiao Hua, Minister of Rites, was demoted to Shaanzhou.',
  },
  s0046: {
    literal: 'Qianyuan coinage was reissued.',
    idiomatic: 'The Qianyuan currency was put back into circulation.',
  },
  s0047: {
    literal: 'Heavy-rim small coins counted one as two; heavy-rim large coins one as three.',
    idiomatic: 'Heavy-rim small coins traded at two to one; large heavy-rim coins at three.',
  },
  s0048: {
    literal:
      'On bingshen Households Vice Minister Yuan Zai was made Grand Secretariat Associate and Director of Revenue and Transport.',
    idiomatic:
      'On bingshen Yuan Zai became chancellor and head of revenue and transport.',
  },
  s0049: {
    literal: 'Qianyuan large and small coins were changed to one for one.',
    idiomatic: 'Large and small Qianyuan coins were again valued equally.',
  },
  s0050: {
    literal: 'On dingyou he ascended Danfeng Tower and proclaimed a great amnesty.',
    idiomatic: 'On dingyou he proclaimed amnesty from Danfeng Tower.',
  },
  s0051: {
    literal:
      'Ziyi, Guangbi, Li Guangjin, and the various circuit military commissioners all received increased substantive fiefs.',
    idiomatic:
      'Guo Ziyi, Li Guangbi, Li Guangjin, and other commissioners gained enlarged fiefs.',
  },
  s0052: {
    literal:
      'Those who had earned merit on the seventeenth day of the fourth month were all titled "Baoying Merit Lords."',
    idiomatic:
      'Soldiers meritorious on the seventeenth of the fourth month were named Baoying merit lords.',
  },
  s0053: {
    literal:
      'Civil and military officials inside and outside of third rank and above advanced in noble rank; fourth rank and below gained steps in grade.',
    idiomatic:
      'Officials of third rank and above were promoted in rank; those below gained grade steps.',
  },
  s0054: {
    literal: 'Defense commissioners of all prefectures were all abolished.',
    idiomatic: 'All prefectural defense commissioners were abolished.',
  },
  s0055: {
    literal: 'Inside and outside officials were transferred once every three evaluations.',
    idiomatic: 'Civil and military posts rotated after three performance reviews.',
  },
  s0056: {
    literal:
      'Prince of Yichang Li Miao advanced to Prince of Zheng; Prince of Yanqing Li Jiong advanced to Prince of Han.',
    idiomatic:
      'Li Miao became Prince of Zheng; Li Jiong Prince of Han.',
  },
  s0057: {
    literal:
      'The former commoner Empress Wang, the falsely accused former crown prince Ying, Prince of E Li Yao, and Prince of Guang Li Ju should all have titles restored.',
    idiomatic:
      'Empress Wang, Crown Prince Ying, and Princes Yao and Ju — all wronged under Xuanzong — were to have honors restored.',
  },
  s0058: {
    literal: 'Prince of Di Li Yan and Prince of Yong Li Lin were both cleared.',
    idiomatic: 'Li Yan and Li Lin were posthumously cleared.',
  },
  s0059: {
    literal:
      'Prince of Jianchang was posthumously enfeoffed Prince of Qi; Prince of Chong\'en Prince of Wei; Prince of Lingchang Prince of Yan.',
    idiomatic:
      'Three princes were posthumously raised: Jianchang to Qi, Chong\'en to Wei, Lingchang to Yan.',
  },
  s0060: {
    literal:
      'On renyin Lai Tian was again made Xiangzhou prefect and Hedong South circuit military commissioner.',
    idiomatic:
      'On renyin Lai Tian returned as Xiangzhou prefect and South Shannan commissioner.',
  },
  s0061: {
    literal:
      'In the sixth month, on jiyou new moon, the hundred officials attended at the Western Palace; the emperor did not hold court.',
    idiomatic:
      'On the sixth month\'s new moon officials mourned at the Western Palace while the emperor stayed away from court.',
  },
  s0062: {
    literal: 'From then on every new and full moon was the same, until the mountain tomb was complete.',
    idiomatic: 'He skipped court at every new and full moon until the burial was finished.',
  },
  s0063: {
    literal:
      'Whenever a minister had business to take leave and be received, he first attended the Western Palace, then went to court.',
    idiomatic:
      'Ministers with business first paid respects at the Western Palace, then entered court.',
  },
  s0064: {
    literal: 'Yuzhou was renamed Caizhou, avoiding the emperor\'s name.',
    idiomatic: 'Yuzhou became Caizhou to avoid the emperor\'s taboo name.',
  },
  s0065: {
    literal:
      'Palace Attendant Miao Jinqing, aged and ill, asked to enter the Secretariat once every three days; it was granted.',
    idiomatic:
      'Miao Jinqing, old and ill, was allowed to attend the Secretariat every third day.',
  },
  s0066: {
    literal:
      'On jiwei Sublime Father Li Fuguo was removed from acting commander of the commander\'s campaign, Minister of War, Director of Studs, and the like.',
    idiomatic:
      'On jiwei Li Fuguo lost his military, war ministry, and stud duties.',
  },
  s0067: {
    literal: 'Fuguo requested to yield his post.',
    idiomatic: 'Fuguo asked to step down.',
  },
  s0068: {
    literal:
      'On xinyou Fuguo was made Prince of Bolu; Grand Secretariat Director was removed; he was permitted court at new and full moon.',
    idiomatic:
      'On xinyou he became Prince of Bolu, lost the chancellorship, and kept only new- and full-moon audiences.',
  },
  s0069: {
    literal:
      'On renshen Tongzhou prefect Liu Yan was made Households Vice Minister, concurrent Censor-in-Chief, and Jingzhao prefect, charged with revenue, transport, salt iron, coinage of all circuits, and the like.',
    idiomatic:
      'On renshen Liu Yan became revenue chief, censor-in-chief, and Jingzhao prefect, overseeing transport, salt, and coinage.',
  },
  s0070: {
    literal: 'In the seventh month of autumn, on jimao new moon.',
    idiomatic: 'Seventh month, jimao new moon.',
  },
  s0071: {
    literal:
      'On xinsi Army Viewing Commissioner Yu Chao\'en was enfeoffed Duke of Fengyi commandery; eunuch Cheng Yuanzhen was made Great General Securing the Army and Duke of Baoding commandery.',
    idiomatic:
      'On xinsi Yu Chao\'en became Duke of Fengyi; Cheng Yuanzhen Great General Securing the Army and Duke of Baoding.',
  },
  s0072: {
    literal:
      'On yiyou Xiangzhou prefect Pei Yi was banished far to Feizhou and ordered to die at Lantian post station.',
    idiomatic:
      'On yiyou Pei Yi was exiled to Fei and forced to kill himself at Lantian.',
  },
  s0073: {
    literal:
      'On gengyin an edict forbade petition-box envoys from reading documents placed in the petition boxes; Daozhou assistant prefect Jing Yu was ordered to take his own life.',
    idiomatic:
      'On gengyin petition-box inspectors were forbidden to read submissions; Jing Yu of Daozhou was ordered to commit suicide.',
  },
  s0074: {
    literal: 'Lai Tian came to court from Xiangzhou.',
    idiomatic: 'Lai Tian arrived from Xiangzhou for audience.',
  },
  s0075: {
    literal: 'Guo Ziyi came to court from Hezhong.',
    idiomatic: 'Guo Ziyi came from Hezhong for audience.',
  },
  s0076: {
    literal: 'In the eighth month, on jiyou new moon.',
    idiomatic: 'Eighth month, jiyou new moon.',
  },
  s0077: {
    literal: 'From the seventh month there was no rain; only in this month on guichou did rain fall.',
    idiomatic: 'Drought since the seventh month broke on guichou of the eighth.',
  },
  s0078: {
    literal:
      'At midnight on gengwu a red light stretched across the sky in the northwest, pierced Ziwei, gradually shifted northeast, and filled half the heavens.',
    idiomatic:
      'At midnight on gengwu a red aurora crossed the northwest sky through Ziwei toward the northeast, flooding half the heavens.',
  },
  s0079: {
    literal: 'Heir Apparent Junior Tutor Li Zun was demoted to Yuanzhou prefect.',
    idiomatic: 'Li Zun was demoted to Yuanzhou.',
  },
  s0080: {
    literal:
      'The bandit Yuan Chao of Taizhou took Taizhou and in succession took prefectures and counties of eastern Zhejiang.',
    idiomatic:
      'Yuan Chao seized Taizhou and swept through eastern Zhejiang.',
  },
  s0081: {
    literal:
      'In the ninth month, on dingchou new moon, Prince of Lu Li Shi was re-enfeoffed Prince of Yong.',
    idiomatic:
      'Ninth month: Li Shi became Prince of Yong.',
  },
  s0082: {
    literal:
      'Hedong South circuit military commissioner Lai Tian was made Minister of War, Grand Secretariat Associate; his commission unchanged.',
    idiomatic:
      'Lai Tian became Minister of War and chancellor while keeping his command.',
  },
  s0083: {
    literal: 'Cheng Yuanzhen advanced to Duke of Bin.',
    idiomatic: 'Cheng Yuanzhen was made Duke of Bin.',
  },
  s0084: {
    literal:
      'On bingshen Right Vice Director Pei Mian, tomb commissioner, was demoted to Shizhou prefect.',
    idiomatic:
      'On bingshen Pei Mian was demoted to Shizhou.',
  },
  s0085: {
    literal:
      'On wuxu the Uyghur Ton-yabghu Qaghan led troops to aid the state in suppressing rebellion; Censor-in-Chief Shang Heng was ordered to comfort them.',
    idiomatic:
      'On wuxu the Uyghur qaghan brought allies; Shang Heng was sent to welcome them.',
  },
  s0086: {
    literal:
      'On jiawu from Taizhou to Shazhou, more than two hundred li of the Yellow River ran clear, transparent to the bottom.',
    idiomatic:
      'On jiawu the Yellow River ran clear for two hundred li between Taizhou and Shazhou.',
  },
  s0087: {
    literal:
      'On jiawu Secretariat Director Han Ying and Secretariat Drafter Liu Xuan were banished to Lingnan; soon they were ordered to die — the crime was intimacy with Li Fuguo.',
    idiomatic:
      'The same day Han Ying and Liu Xuan were exiled to the far south and soon executed for currying favor with Li Fuguo.',
  },
  s0088: {
    literal:
      'In the tenth month of winter, on xinyou, an edict ordered Commander-in-Chief Prince of Yong to command Hedong, Shuofang, and all campaign circuits plus Uyghur troops — more than a hundred thousand — to attack Shi Chaoyi, assembling at Shazhou.',
    idiomatic:
      'In the tenth month Prince of Yong was ordered to lead over a hundred thousand troops, including Uyghurs, against Shi Chaoyi at Shazhou.',
  },
  s0089: {
    literal:
      'Shuofang campaign circuit military commissioner, Prince of Daning commandery Pugu Huai\'en was added Grand Secretariat Associate.',
    idiomatic:
      'Pugu Huai\'en of Shuofang was made a chancellor as well.',
  },
  s0090: {
    literal: 'On dingmao night thieves killed Li Fuguo at his residence and stole away his head.',
    idiomatic: 'On dingmao night assassins killed Li Fuguo and took his head.',
  },
  s0091: {
    literal:
      'On wuchen the commander Prince of Yong led the armies forward; Guo Yingyi and Yu Chao\'en were left to guard Shazhou.',
    idiomatic:
      'On wuchen Prince of Yong marched out, leaving Guo Yingyi and Yu Chao\'en at Shazhou.',
  },
  s0092: {
    literal: 'On renshen the imperial army halted at Luoyang\'s northern suburb.',
    idiomatic: 'On renshen the host camped north of Luoyang.',
  },
  s0093: {
    literal:
      'On jiaxu they fought at Hengshui; the rebels were greatly defeated — captives and heads numbered on the order of sixty thousand.',
    idiomatic:
      'On jiaxu at Hengshui the rebels lost some sixty thousand killed or captured.',
  },
  s0094: {
    literal: 'Shi Chaoyi fled to Jizhou.',
    idiomatic: 'Shi Chaoyi fled toward Jizhou.',
  },
  s0095: {
    literal:
      'On yihai Prince of Yong memorialized the recovery of the Eastern Capital, Heyang, Bian, Zheng, Hua, Xiang, Wei, and other prefectures.',
    idiomatic:
      'On yihai he reported retaking Luoyang and the Henan prefectures.',
  },
  s0096: {
    literal:
      'On yiyou Shaanxi military commissioner Guo Yingyi was made acting Eastern Capital garrison commander.',
    idiomatic:
      'On yiyou Guo Yingyi became acting Luoyang commandant.',
  },
  s0097: {
    literal:
      'On dingyou the false Hengzhou military commissioner Zhang Zhongzhi submitted Zhao, Ding, Shen, Heng, and Yi — five prefectures in surrender; Zhongzhi was made acting Minister of Rites and Hengzhou prefect, made Chengdé army military commissioner, and granted the surname and name Li Baochen.',
    idiomatic:
      'On dingyou Zhang Zhongzhi surrendered five Hebei prefectures, was made Chengdé commissioner, and renamed Li Baochen.',
  },
  s0098: {
    literal: 'Thereupon all prefectures and commanderies of Hebei were pacified.',
    idiomatic: 'Hebei was now fully pacified.',
  },
  s0099: {
    literal:
      'The rebel Fan Yang prefect Li Huaixian cut off Shi Chaoyi\'s head and presented it, requesting surrender.',
    idiomatic:
      'Li Huaixian sent Chaoyi\'s head and surrendered.',
  },
  s0100: {
    literal: 'In the twelfth month, on gengxu, Heir Apparent Grand Tutor, Duke of Bin Wei Jiansu died.',
    idiomatic: 'Twelfth month: Wei Jiansu, Duke of Bin and grand tutor to the heir, died.',
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
if (data.metadata.chapter !== '011') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 011; standalone T ready (${Object.keys(T).length} entries).`
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
