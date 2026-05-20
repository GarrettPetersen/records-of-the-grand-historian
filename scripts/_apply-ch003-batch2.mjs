#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/003.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 101;
const END = 200;

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
  s0101: {
    literal: 'In the ninth month, on dingchou, the Crown Prince came to court.',
    idiomatic: 'In the ninth month, on dingchou day, the Crown Prince presented himself at court.',
  },
  s0102: {
    literal:
      'In the winter of the tenth month, Right Valiant Cavalry Guard General and Duke of Bao State Duan Zhixuan attacked the Tuyuhun, defeated them, and pursued the fleeing enemy for more than eight hundred li.',
    idiomatic:
      'In the tenth month of winter, Duan Zhixuan, right guard general and Duke of Bao, struck the Tuyuhun, broke them, and chased the fugitives more than eight hundred li.',
  },
  s0103: {
    literal: 'On jiazi, the emperor returned from Jiucheng Palace.',
    idiomatic: 'On jiazi he returned from Jiucheng Palace.',
  },
  s0104: {
    literal:
      'In the eleventh month, on xinwei, Right Deputy Director Li Jing, Duke of Dai State, resigned his office owing to illness and was granted the honorary rank of Special Guardian.',
    idiomatic:
      'On xinwei of the eleventh month, Li Jing, right vice director and Duke of Dai, resigned for illness and was made Special Guardian.',
  },
  s0105: {
    literal: 'On dinghai, the Tuyuhun raided Liang Prefecture.',
    idiomatic: 'On dinghai the Tuyuhun raided Liang Prefecture.',
  },
  s0106: {
    literal: 'On jichou, the Tuyuhun seized and detained the imperial envoy Zhao Daode.',
    idiomatic: 'On jichou they seized the Tang envoy Zhao Daode.',
  },
  s0107: {
    literal:
      'In the twelfth month, on xinchou, he appointed Special Guardian Li Jing, Minister of War Hou Junji, Minister of Punishments Prince Daizong of Rencheng, Liangzhou Protector Li Daliang, and others as supreme commanders, each leading troops by separate routes to attack the Tuyuhun.',
    idiomatic:
      'On xinchou of the twelfth month he named Li Jing, Hou Junji, Prince Daizong of Rencheng, Li Daliang of Liangzhou, and others supreme commanders to strike the Tuyuhun by separate columns.',
  },
  s0108: {
    literal: 'On renzi, Prince of Yue Tai was made Prefect of Yong Province.',
    idiomatic: 'On renzi Prince Tai of Yue became Yongzhou prefect.',
  },
  s0109: {
    literal: 'On yimao, the Emperor accompanied the Retired Emperor in reviewing troops west of the city.',
    idiomatic:
      'On yimao the Emperor joined the Retired Emperor to review troops west of the capital.',
  },
  s0110: {
    literal:
      'That year envoys came from Kucha, Tibet, Gaochang, the Women\'s State, and the Stone Kingdom bearing tribute.',
    idiomatic:
      'That year Kucha, Tibet, Gaochang, the Women\'s Kingdom, and Shazhou sent envoys with tribute.',
  },
  s0111: {
    literal:
      'In the ninth year of Zhenguan, in the spring of the third month, the Qiang of Tao Prefecture rebelled and killed the prefect Kong Changxiu.',
    idiomatic:
      'In the ninth year of Zhenguan, in the third spring month, the Qiang of Tao Prefecture rebelled and slew Prefect Kong Changxiu.',
  },
  s0112: {
    literal: 'On renwu, a general amnesty was proclaimed.',
    idiomatic: 'On renwu he proclaimed a general amnesty.',
  },
  s0113: {
    literal: 'In every district one chief was appointed, with two assistants.',
    idiomatic: 'Each district received one chief and two assistants.',
  },
  s0114: {
    literal:
      'On yiyou, Gao Zengsheng, supreme commander on the Salt Lake route, inflicted a great defeat on the rebel Qiang.',
    idiomatic:
      'On yiyou Gao Zengsheng, commander on the Salt Lake route, crushed the rebel Qiang.',
  },
  s0115: {
    literal:
      'On gengyin, an edict ordered households throughout the realm classified in three grades, with those not yet fully promoted or demoted arranged in nine grades.',
    idiomatic:
      'On gengyin he decreed a three-grade household system nationwide, with finer distinctions of nine grades where promotion or demotion was still pending.',
  },
  s0116: {
    literal: 'In the fourth month of summer, on renyin, Kang presented a lion.',
    idiomatic: 'On renyin of the fourth summer month Kang presented a lion.',
  },
  s0117: {
    literal: 'In the intercalary month, on dingmao, there was a solar eclipse.',
    idiomatic: 'In the intercalary month, on dingmao, the sun was eclipsed.',
  },
  s0118: {
    literal:
      'On guisi, supreme commanders Li Jing, Hou Junji, Li Daliang, and Prince Daizong of Rencheng defeated the Tuyuhun at Niuxindui.',
    idiomatic:
      'On guisi Li Jing, Hou Junji, Li Daliang, and Prince Daizong broke the Tuyuhun at Niuxindui.',
  },
  s0119: {
    literal:
      'In the fifth month, on yiwei, they defeated them again at Wuhai and pursued the fugitives to Baihai.',
    idiomatic:
      'On yiwei of the fifth month they beat them again at Wuhai and chased the fugitives to Baihai.',
  },
  s0120: {
    literal:
      'Deputy commanders Xue Wanjun and Xue Wanche defeated them again at Chishuiyuan and captured twenty of their famed kings.',
    idiomatic:
      'Deputies Xue Wanjun and Xue Wanche routed them at Chishuiyuan and took twenty of their great chieftains.',
  },
  s0121: {
    literal: 'On gengzi, the Retired Emperor died at Da\'an Palace.',
    idiomatic: 'On gengzi the Retired Emperor died at Da\'an Palace.',
  },
  s0122: {
    literal:
      'On renzi, Li Jing pacified the Tuyuhun west of the sea and captured their king Murong Fuyun.',
    idiomatic:
      'On renzi Li Jing pacified the Tuyuhun beyond the western sea and seized King Murong Fuyun.',
  },
  s0123: {
    literal:
      'Because his son Murong Shun had submitted, he was enfeoffed as Prince of Xiping Commandery and their native state was restored.',
    idiomatic:
      'Murong Shun, who had surrendered, was made Prince of Xiping and the Tuyuhun realm was restored under him.',
  },
  s0124: {
    literal: 'In the seventh month of autumn, on jiayin, the Ancestral Temple was enlarged to six chambers.',
    idiomatic: 'On jiayin of the seventh autumn month the Ancestral Temple was expanded to six chambers.',
  },
  s0125: {
    literal:
      'In the tenth month of winter, on gengyin, Gaozu the Grand Martial Emperor was buried at Xian Mausoleum.',
    idiomatic:
      'On gengyin of the tenth winter month Gaozu the Grand Martial Emperor was buried at Xian Mausoleum.',
  },
  s0126: {
    literal: 'On wushen, his tablet was placed in the Ancestral Temple.',
    idiomatic: 'On wushen his spirit tablet was installed in the Ancestral Temple.',
  },
  s0127: {
    literal:
      'On xinchou, Left Deputy Director Fang Xuanling, Duke of Wei State, was additionally made Bearer of the Protocol of the Opening of the Office with the Same Ceremonials as the Three Excellencies, his other offices remaining as before.',
    idiomatic:
      'On xinchou Fang Xuanling, left vice director and Duke of Wei, received supernumerary Three-Excellency ceremonial rank; his other posts were unchanged.',
  },
  s0128: {
    literal:
      'In the twelfth month, on jiaxu, Murong Shun, Prince of Xiping Commandery of the Tuyuhun, was assassinated by his subordinates; Minister of War Hou Junji was sent with troops to pacify them, and Shun\'s son Nuohebo was still enfeoffed as Prince of Heyuan Commandery to rule the people.',
    idiomatic:
      'On jiaxu of the twelfth month Murong Shun, Tuyuhun Prince of Xiping, was murdered by his own men; Hou Junji marched to settle the tribes and enfeoffed Shun\'s son Nuohebo as Prince of Heyuan to rule them.',
  },
  s0129: {
    literal:
      'Right Grand Master of Splendid Happiness Xiao Yu, Duke of Song State, was restored to his former rank of Special Guardian and again ordered to take part in court governance.',
    idiomatic:
      'Xiao Yu, Duke of Song and right grand master, was restored as Special Guardian and again admitted to deliberations of state.',
  },
  s0130: {
    literal:
      'In the tenth year of Zhenguan, in the spring of the first month, on renzi, Left Deputy Director of the Masters of Writing Fang Xuanling and Palace Attendant Wei Zheng presented the histories of Liang, Chen, Qi, Zhou, and Sui; an edict ordered them stored in the Secret Archive.',
    idiomatic:
      'In the tenth year of Zhenguan, on renzi of the first spring month, Fang Xuanling and Wei Zheng presented the histories of Liang, Chen, Qi, Zhou, and Sui; the emperor ordered them placed in the Secret Archive.',
  },
  s0131: {
    literal:
      'On guichou, Prince of Zhao Yuanjing was moved to Prince of Jing; Prince of Lu Yuanchang to Prince of Han; Prince of Zheng Yuanli to Prince of Xu; Prince of Xu Yuanjia to Prince of Han; Prince of Jing Yuanze to Prince of Peng; Prince of Teng Yuanyi to Prince of Zheng; Prince of Wu Yuan Gui to Prince of Huo; Prince of Bin Yuanfeng to Prince of Guo; Prince of Chen Yuanqing to Prince of Dao; Prince of Wei Lingquei to Prince of Yan; Prince of Shu Ke to Prince of Wu; Prince of Yue Tai to Prince of Wei; Prince of Yan You to Prince of Qi; Prince of Liang Yin to Prince of Shu; Prince of Tan Yun to Prince of Jiang; Prince of Han Zhen to Prince of Yue; Prince of Shen Zhen to Prince of Ji.',
    idiomatic:
      'On guichou a great reshuffling of princely titles was decreed: among them Yuanjing of Zhao became Prince of Jing, Yuanchang of Lu became Prince of Han, Yuanli of Zheng became Prince of Xu, Yuanjia of Xu became Prince of Han, Yuanze of Jing became Prince of Peng, Yuanyi of Teng became Prince of Zheng, Yuan Gui of Wu became Prince of Huo, Yuanfeng of Bin became Prince of Guo, Yuanqing of Chen became Prince of Dao, Lingquei of Wei became Prince of Yan, Ke of Shu became Prince of Wu, Tai of Yue became Prince of Wei, You of Yan became Prince of Qi, Yin of Liang became Prince of Shu, Yun of Tan became Prince of Jiang, Zhen of Han became Prince of Yue, and Zhen of Shen became Prince of Ji.',
  },
  s0132: {
    literal: 'In the sixth month of summer, Palace Attendant Wei Zheng was made Special Guardian and still directed the Chancellery.',
    idiomatic: 'In the sixth summer month Wei Zheng was made Special Guardian while retaining charge of the Chancellery.',
  },
  s0133: {
    literal: 'On renshen, Chief Director of the Secretariat Wen Yanbo became Right Deputy Director of the Masters of Writing.',
    idiomatic: 'On renshen Chief Director Wen Yanbo became right vice director of the Masters of Writing.',
  },
  s0134: {
    literal:
      'On jiaxu, Director of Court Music and Duke of Ande Commandery Yang Shidao became Palace Attendant.',
    idiomatic: 'On jiaxu Yang Shidao, director of court music and Duke of Ande, became palace attendant.',
  },
  s0135: {
    literal: 'On jimao, the Empress of the Zhangsun clan died in Lize Hall.',
    idiomatic: 'On jimao Empress Zhangsun died in Lize Hall.',
  },
  s0136: {
    literal: 'In the eleventh month of winter, on gengyin, the Cultured Virtue Empress was buried at Zhaoling.',
    idiomatic: 'On gengyin of the eleventh winter month the Cultured Virtue Empress was buried at Zhaoling.',
  },
  s0137: {
    literal: 'In the twelfth month, on renshen, Nuohebo, Prince of Heyuan Commandery of the Tuyuhun, came to court.',
    idiomatic: 'On renshen of the twelfth month Nuohebo, Tuyuhun Prince of Heyuan, came to court.',
  },
  s0138: {
    literal: 'On yihai, the emperor personally reviewed prisoners in the capital.',
    idiomatic: 'On yihai he personally reviewed the capital\'s prisoners.',
  },
  s0139: {
    literal:
      'That year disease struck Guanzhong and the east of the Yellow River; physicians were sent with medicine to treat the sick.',
    idiomatic:
      'That year plague ravaged Guanzhong and Hedong; the court sent physicians with medicine to treat the afflicted.',
  },
  s0140: {
    literal:
      'In the eleventh year of Zhenguan, in the spring of the first month, on dinghai, the first day, Prince of Zheng Yuanli was moved to Prince of Deng and Prince of Qiao Yuanming to Prince of Shu.',
    idiomatic:
      'In the eleventh year of Zhenguan, on dinghai, the new-year\'s day of the first spring month, Yuanli of Zheng became Prince of Deng and Yuanming of Qiao became Prince of Shu.',
  },
  s0141: {
    literal:
      'On guisi, Prince of Wei Tai was additionally made Prefect of Yong Province and Left Martial Guard General.',
    idiomatic: 'On guisi Prince Tai of Wei was also made Yongzhou prefect and left martial guard general.',
  },
  s0142: {
    literal: 'On gengzi, the new statutes and ordinances were promulgated throughout the realm.',
    idiomatic: 'On gengzi the new code and ordinances were promulgated empire-wide.',
  },
  s0143: {
    literal: 'Feishan Palace was built.',
    idiomatic: 'Work began on Feishan Palace.',
  },
  s0144: {
    literal: 'On jiayin, Fang Xuanling and others presented the Five Rites they had compiled.',
    idiomatic: 'On jiayin Fang Xuanling and his colleagues presented the compiled Five Rites.',
  },
  s0145: {
    literal: 'An edict ordered the relevant offices to put them into practice.',
    idiomatic: 'An edict ordered the ministries to put the rites into practice.',
  },
  s0146: {
    literal: 'In the second month, on dingsi, an edict said:',
    idiomatic: 'On dingsi of the second month he issued an edict:',
  },
  s0147: {
    literal: 'On jiazi, he visited Luoyang Palace and ordered sacrifice to Emperor Wen of Han.',
    idiomatic: 'On jiazi he went to Luoyang Palace and ordered rites for Emperor Wen of Han.',
  },
  s0148: {
    literal: 'On the first day of the third month, bingxu, there was a solar eclipse.',
    idiomatic: 'On bingxu, the first day of the third month, the sun was eclipsed.',
  },
  s0149: {
    literal: 'On dinghai, the imperial carriage reached Luoyang.',
    idiomatic: 'On dinghai the court arrived at Luoyang.',
  },
  s0150: {
    literal: 'On bingshen, Luozhou was renamed Luoyang Palace.',
    idiomatic: 'On bingshen Luozhou was renamed Luoyang Palace.',
  },
  s0151: {
    literal: 'On xinhai, a great hunt was held at Guangcheng Marsh.',
    idiomatic: 'On xinhai he held a great hunt at Guangcheng Marsh.',
  },
  s0152: {
    literal: 'On guichou, the court returned to the palace.',
    idiomatic: 'On guichou he returned to the palace.',
  },
  s0153: {
    literal: 'In the fourth month of summer, on jiazi, the locust tree before Qianyuan Hall was struck by lightning.',
    idiomatic: 'On jiazi of the fourth summer month lightning struck the locust tree before Qianyuan Hall.',
  },
  s0154: {
    literal:
      'On bingyin, an edict ordered Hebei and Huainan to recommend men of filial piety and pure conduct who were also versed in current affairs;',
    idiomatic:
      'On bingyin he decreed that Hebei and Huainan recommend men of filial piety and honest character who also understood public affairs;',
  },
  s0155: {
    literal: 'those thoroughly versed in Confucian learning, fit to serve as models;',
    idiomatic: 'scholars masterful in the classics, fit to be teachers;',
  },
  s0156: {
    literal: 'those of elegant literary style, with talent for composition;',
    idiomatic: 'writers of elegant style with talent for composition;',
  },
  s0157: {
    literal:
      'and those of clear insight into government, fit to be entrusted with office: all whose conduct was cultivated and whom their districts commended—such men were to be given travel passes and sent to Luoyang Palace.',
    idiomatic:
      'and men of clear political judgment fit for office—all of cultivated conduct commended in their home districts were to receive travel passes and come to Luoyang Palace.',
  },
  s0158: {
    literal:
      'In the sixth month, on jiayin, Right Deputy Director of the Masters of Writing Wen Yanbo, Duke of Yu State, died.',
    idiomatic: 'On jiayin of the sixth month Wen Yanbo, right vice director and Duke of Yu, died.',
  },
  s0159: {
    literal: 'On dingsi, he visited Mingde Palace.',
    idiomatic: 'On dingsi he visited Mingde Palace.',
  },
  s0160: {
    literal: 'On jiwei, regulations were fixed making princes hereditary prefects.',
    idiomatic: 'On jiwei he fixed the rule that princes should hold prefectures in perpetual succession.',
  },
  s0161: {
    literal: 'On wuchen, regulations were fixed making meritorious officials hereditary prefects.',
    idiomatic: 'On wuchen he fixed the rule that meritorious ministers should likewise hold hereditary prefectures.',
  },
  s0162: {
    literal:
      'Prince Daizong of Rencheng was moved to Prince of Jiangxia Commandery; Prince Xiaogong of Zhao Commandery to Prince of Hejian Commandery.',
    idiomatic:
      'Prince Daizong of Rencheng was retitled Prince of Jiangxia; Prince Xiaogong of Zhao Commandery became Prince of Hejian.',
  },
  s0163: {
    literal: 'On jisi, Prince of Xu Yuanxiang was moved to Prince of Jiang.',
    idiomatic: 'On jisi Prince Yuanxiang of Xu became Prince of Jiang.',
  },
  s0164: {
    literal: 'In the seventh month of autumn, on guiwei, there was torrential rain.',
    idiomatic: 'On guiwei of the seventh autumn month torrential rains fell.',
  },
  s0165: {
    literal:
      'The Gu River overflowed into Luoyang Palace to a depth of four feet, destroying the Left Flank Gate and ruining nineteen palace temples;',
    idiomatic:
      'The Gu River burst into Luoyang Palace four feet deep, wrecked the Left Flank Gate, and destroyed nineteen palace temples;',
  },
  s0166: {
    literal: 'the Luo River overflowed and swept away six hundred households.',
    idiomatic: 'the Luo overflowed and swept away six hundred households.',
  },
  s0167: {
    literal:
      'On gengyin, an edict, because of the disaster, ordered all officials to submit sealed memorials speaking frankly of gain and loss.',
    idiomatic:
      'On gengyin, citing the floods, he ordered every official to submit sealed memorials on what the court was doing right and wrong.',
  },
  s0168: {
    literal: 'On dingyou, the imperial carriage returned to the palace.',
    idiomatic: 'On dingyou the court returned to the palace.',
  },
  s0169: {
    literal:
      'On renyin, Mingde Palace and the Mystic Park of Feishan Palace were abolished; the grounds were divided among flood victims, and graded gifts of silk were also bestowed.',
    idiomatic:
      'On renyin Mingde Palace and the Mystic Park at Feishan were dismantled; the land was given to flood victims and graded gifts of silk were distributed.',
  },
  s0170: {
    literal:
      'On bingwu, the Laozi temple at Bozhou and the temple of Confucius at Yanzhou were repaired, each granted twenty households for sacrifice.',
    idiomatic:
      'On bingwu temples to Laozi at Bozhou and to Confucius at Yanzhou were restored, each endowed with twenty service households.',
  },
  s0171: {
    literal:
      'Near the tomb of Li Gao, Martial King of Liang, twenty households were again assigned as guards, and grazing, fodder-cutting, and firewood-gathering were forbidden.',
    idiomatic:
      'Twenty households were again posted to guard the tomb of Li Gao, Martial King of Liang, and grazing and woodcutting near the mound were forbidden.',
  },
  s0172: {
    literal: 'In the ninth month, on dinghai;',
    idiomatic: 'That ninth month, on dinghai—',
  },
  s0173: {
    literal:
      'the Yellow River overflowed, destroying Hebei County in Shan Prefecture and ruining the pools at Heyang Center;',
    idiomatic:
      'the Yellow River burst its banks, destroyed Hebei County in Shan Prefecture, and wrecked the pools at Heyang;',
  },
  s0174: {
    literal:
      'the emperor visited White Sima Slope to view the damage and bestowed graded gifts of grain and silk on flood victims.',
    idiomatic:
      'he went to White Sima Slope to see the damage and gave graded grain and silk to the stricken.',
  },
  s0175: {
    literal: 'In the eleventh month of winter, on xinmao, he visited Huai Prefecture.',
    idiomatic: 'On xinmao of the eleventh winter month he visited Huai Prefecture.',
  },
  s0176: {
    literal: 'On yiwei, he hunted at Jiyuan.',
    idiomatic: 'On yiwei he hunted at Jiyuan.',
  },
  s0177: {
    literal: 'On bingwu, the imperial carriage returned to the palace.',
    idiomatic: 'On bingwu he returned to the palace.',
  },
  s0178: {
    literal: 'In the twelfth month, on xinyou, the king of Baekje sent his crown prince Yong to court.',
    idiomatic: 'On xinyou of the twelfth month the king of Baekje sent Crown Prince Yong to court.',
  },
  s0179: {
    literal:
      'In the twelfth year of Zhenguan, in the spring of the first month, on yiwei, Minister of Personnel Gao Shilian and others presented the Genealogical Record in one hundred thirty scrolls.',
    idiomatic:
      'In the twelfth year of Zhenguan, on yiwei of the first spring month, Gao Shilian, minister of personnel, and others presented the Genealogical Record in one hundred thirty scrolls.',
  },
  s0180: {
    literal:
      'On renyin, Song and Cong prefectures were shaken by earthquake; dwellings were destroyed and some were crushed to death.',
    idiomatic:
      'On renyin earthquakes struck Song and Cong prefectures, wrecking houses and killing some inhabitants.',
  },
  s0181: {
    literal: 'In the second month, on yimao, the imperial carriage returned to the capital.',
    idiomatic: 'On yimao of the second month he returned to the capital.',
  },
  s0182: {
    literal:
      'On guihai, he viewed the Pillars and had an inscription cut in stone to record his merit.',
    idiomatic: 'On guihai he viewed the River Pillars and had a stele cut to record his deeds.',
  },
  s0183: {
    literal:
      'On jiazi, the Yelang Liao rebelled; Protector of Kuizhou Qi Shixing suppressed and pacified them.',
    idiomatic:
      'On jiazi the Yelang Liao rose; Qi Shixing, protector of Kuizhou, crushed the revolt.',
  },
  s0184: {
    literal:
      'On yichou, he halted at Shan Prefecture, went from Xinqiao to Hebei County, and sacrificed at the temple of Yu of Xia.',
    idiomatic:
      'On yichou he stopped at Shan Prefecture, went from Xinqiao to Hebei County, and sacrificed at the temple of Yu the Great.',
  },
  s0185: {
    literal: 'On dingmao, he halted at Liugu Station and viewed the salt ponds.',
    idiomatic: 'On dingmao he halted at Liugu Station and inspected the salt ponds.',
  },
  s0186: {
    literal:
      'On wuyin, because Sui Eagle-Flying General Yao Junsu had been loyal to his dynasty, he was posthumously made Prefect of Pu Prefecture and his descendants were recorded for office.',
    idiomatic:
      'On wuyin Yao Junsu, a Sui eagle-flying general who had died loyal to the Sui, was posthumously made prefect of Pu and his descendants enrolled for office.',
  },
  s0187: {
    literal: 'On the first day of the intercalary second month, gengchen, there was a solar eclipse.',
    idiomatic: 'On gengchen, the first day of the intercalary second month, the sun was eclipsed.',
  },
  s0188: {
    literal: 'On bingxu, he returned from Luoyang Palace.',
    idiomatic: 'On bingxu he returned from Luoyang Palace.',
  },
  s0189: {
    literal:
      'In the fifth month of summer, on renshen, Silver-Gleaming Grand Master of Splendid Happiness Yu Shinan, Duke of Yongxing County, died.',
    idiomatic:
      'On renshen of the fifth summer month Yu Shinan, silver-gleaming grand master and Duke of Yongxing, died.',
  },
  s0190: {
    literal: 'In the sixth month, on gengzi, the left and right Flying Cavalry of the Xuanwu Gate were first established.',
    idiomatic: 'On gengzi of the sixth month the left and right Flying Cavalry of the Xuanwu Gate were first established.',
  },
  s0191: {
    literal:
      'In the seventh month of autumn, on guiyou, Minister of Personnel Gao Shilian, Duke of Shen State, became Right Deputy Director of the Masters of Writing.',
    idiomatic:
      'On guiyou of the seventh autumn month Gao Shilian, minister of personnel and Duke of Shen, became right vice director.',
  },
  s0192: {
    literal:
      'In the tenth month of winter, on jimao, he hunted at Shiping and bestowed graded gifts of grain and silk on the aged.',
    idiomatic: 'On jimao of the tenth winter month he hunted at Shiping and gave graded grain and silk to the elderly.',
  },
  s0193: {
    literal: 'On yiwei, he returned from Shiping.',
    idiomatic: 'On yiwei he returned from Shiping.',
  },
  s0194: {
    literal: 'On jihai, Baekje sent envoys bearing tribute of golden armor and carved axes.',
    idiomatic: 'On jihai Baekje sent envoys with tribute of golden armor and carved axes.',
  },
  s0195: {
    literal:
      'In the twelfth month, on xinsi, Right Martial Guard General Shangguan Huairen inflicted a great defeat on the mountain Liao at Bi Prefecture.',
    idiomatic:
      'On xinsi of the twelfth month Shangguan Huairen, right martial guard general, crushed the mountain Liao at Bi Prefecture.',
  },
  s0196: {
    literal:
      'In the thirteenth year of Zhenguan, on the first day of the first month, yisi, he visited Xian Mausoleum.',
    idiomatic:
      'In the thirteenth year of Zhenguan, on yisi, the new-year\'s day, he visited Xian Mausoleum.',
  },
  s0197: {
    literal:
      'A partial amnesty was granted to Sanyuan County and to those accompanying him for capital offenses.',
    idiomatic:
      'He granted a partial amnesty to Sanyuan County and to those in his train on capital charges.',
  },
  s0198: {
    literal: 'On dingwei, he returned from Xian Mausoleum.',
    idiomatic: 'On dingwei he returned from Xian Mausoleum.',
  },
  s0199: {
    literal: 'On wuwu, Fang Xuanling was additionally made Junior Tutor of the Crown Prince.',
    idiomatic: 'On wuwu Fang Xuanling was also made junior tutor of the Crown Prince.',
  },
  s0200: {
    literal: 'In the second month, on bingzi, hereditary prefectures were abolished.',
    idiomatic: 'On bingzi of the second month hereditary prefectures were abolished.',
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
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s0101–s0200).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '003') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 003; standalone T ready (${Object.keys(T).length} entries).`
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
console.log('Applied', applied, 'translations (s0101–s0200) to', transPath);
