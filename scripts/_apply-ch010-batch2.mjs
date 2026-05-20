#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.010, Suzong — Zhide 1 tenth month through recovery of Chang'an) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/010.json';
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
    literal:
      'The army was divided into three corps; Yang Xiwen, Liu Guizhe, and Li Guangjin each commanded one corps, their forces fifty thousand.',
    idiomatic:
      'He split the army into three corps under Yang Xiwen, Liu Guizhe, and Li Guangjin—fifty thousand men.',
  },
  s0102: {
    literal:
      'On xinchou Guan fought the rebel general An Shouzhong at Chen-Tao Slope; the official army was defeated, Yang Xiwen, Liu Guizhe and others surrendered to the rebels, and Guan also fled back.',
    idiomatic:
      'On xinchou Fang Guan met An Shouzhong at Chen-Tao Slope, was routed, and lost Yang Xiwen and Liu Guizhe to surrender.',
  },
  s0103: {
    literal:
      'Pingyuan prefect Yan Zhenqing, food exhausted and relief cut off, abandoned the city and crossed the river; then all Hebei commanderies fell to the rebels.',
    idiomatic:
      'Yan Zhenqing of Pingyuan, starving and cut off, fled across the river; Hebei then fell to the rebels.',
  },
  s0104: {
    literal:
      'In the eleventh month, on xinhai, Hexi suffered an earthquake with sound; houses collapsed and split, Zhangye and Jiuquan worst.',
    idiomatic:
      'In the eleventh month Hexi shook with a roaring earthquake; Zhangye and Jiuquan suffered worst.',
  },
  s0105: {
    literal:
      'On wuzi Huihe led troops to aid the cause and with Guo Ziyi together crushed more than three thousand of the rebel Tongluo band on the river.',
    idiomatic:
      'On wuzi Huihe came to aid and with Guo Ziyi destroyed three thousand Tongluo rebels on the river.',
  },
  s0106: {
    literal:
      'An edict ordered Chancellor Cui Huan to tour and pacify Jiangnan, appointing and confirming officials.',
    idiomatic:
      'Cui Huan was sent to tour Jiangnan and appoint officials.',
  },
  s0107: {
    literal: 'In the twelfth month, on wuzi, Wang Sili was made Guannei military commissioner.',
    idiomatic: 'In the twelfth month Wang Sili became Guannei commissioner.',
  },
  s0108: {
    literal:
      'Pengyuan commandery\'s people were given tax relief for two years; the commandery ranked with the six great circuits, its counties raised to jin and wang.',
    idiomatic:
      'Pengyuan received two years\' tax relief, rank equal to the six great circuits, and its counties were raised.',
  },
  s0109: {
    literal:
      'Qinzhou protector Guo Yingyi was made Fengxiang prefect; Remonstrance Grandee Gao Shi was made Guangling prefect and Huainan military commissioner and pacification commissioner.',
    idiomatic:
      'Guo Yingyi became Fengxiang prefect; Gao Shi became Guangling prefect and Huainan commissioner.',
  },
  s0110: {
    literal:
      'The rebel general Ashina Chengqing took Yingchuan commandery and seized prefect Xue Yuan and chief clerk Pang Jian.',
    idiomatic:
      'Ashina Chengqing took Yingchuan and seized Xue Yuan and Pang Jian.',
  },
  s0111: {
    literal:
      'On jiachen the Jiangling great protectorate\'s Prince of Yong Li Lin on his own led a fleet down to Guangling.',
    idiomatic:
      'On jiachen Prince of Yong Li Lin led a fleet down to Guangling on his own authority.',
  },
  s0112: {
    literal:
      'Zhide 2 year, Zhide 2, first spring month, on gengxu new moon, the emperor at Pengyuan received New Year court.',
    idiomatic:
      'In the first month of Zhide 2, on gengxu, he received New Year court at Pengyuan.',
  },
  s0113: {
    literal: 'That day a memorial of felicitation was sent into Shu to congratulate the Retired Emperor.',
    idiomatic: 'That day felicitation was sent to the retired emperor in Shu.',
  },
  s0114: {
    literal:
      'The Retired Emperor in Shu, whenever he received the emperor\'s memorials, questioned the messenger and learned the emperor\'s tearful longing for morning and evening attendance; he then issued a proclamation:',
    idiomatic:
      'In Shu the retired emperor, learning from each messenger of his son\'s tearful devotion, issued a proclamation:',
  },
  s0115: {
    literal:
      '"Supreme harmony nurturing things, great filiality settling kin—the ancient sage kings surely walked this path.',
    idiomatic:
      '"Supreme harmony and great filial piety were the path of the sage kings of old.',
  },
  s0116: {
    literal:
      'I once served in the eastern palace, attending the empresses morning and evening without fail, sharing meals without preference.',
    idiomatic:
      'I once served my parents in the eastern palace without fail.',
  },
  s0117: {
    literal:
      'Now the emperor carries this out without lapse; whenever an envoy comes and is about to depart, he bows with solemn reverence, tears streaming, moving all attendants.',
    idiomatic:
      'My son has never failed in this; every envoy reports his tears and reverence, moving all who see.',
  },
  s0118: {
    literal:
      'Lately auspicious signs—the holding infant, red sparrow, white wolf—have come in succession; all are marks of the emperor\'s sage reverence and filial feeling.',
    idiomatic:
      'Auspicious omens have followed one another—marks of his sage reverence and filial heart.',
  },
  s0119: {
    literal:
      'Thus he spreads virtue across the four seas and may truly illuminate the realm and forever pacify the people!',
    idiomatic:
      'He spreads virtue across the seas and may truly pacify the realm forever!',
  },
  s0120: {
    literal:
      'Let all under heaven who show supreme filial piety and brotherly harmony renowned in their villages be reported by county and prefecture magistrates, that filial sons and obedient grandsons may bathe in profound transformation."',
    idiomatic:
      'Let magistrates report filial sons and obedient grandsons throughout the realm."',
  },
  s0121: {
    literal:
      'On jiayin Xiangyang prefect Li Xian was made Shu prefect and Jiannan military commissioner; Master of Works Vice Director Wei Zhongxi was made Xiangyang and Shannandao military commissioner; Prince of Yong tutor Liu Hui was made Danyang prefect and concurrent defense commissioner.',
    idiomatic:
      'On jiayin Li Xian became Shu prefect and Jiannan commissioner; Wei Zhongxi Xiangyang commissioner; Liu Hui Danyang prefect and defender.',
  },
  s0122: {
    literal:
      'Minister of Justice Li Lin was made concurrent Secretariat-Chancellery Grand Councilor.',
    idiomatic: 'Li Lin, minister of justice, became grand councilor.',
  },
  s0123: {
    literal:
      'The Retired Emperor sent Grand Councilor Cui Yuan with a proclamation to Pengyuan.',
    idiomatic: 'The retired emperor sent Cui Yuan to Pengyuan with a proclamation.',
  },
  s0124: {
    literal: 'On yimao the rebel An Lushan was killed by his son Qingxu.',
    idiomatic: 'On yimao An Lushan was killed by his son Qingxu.',
  },
  s0125: {
    literal:
      'On xinyou Jinling commandery was established at Jiangning county, with an army posted and people divided to garrison it.',
    idiomatic:
      'On xinyou Jinling commandery was founded at Jiangning with a garrison.',
  },
  s0126: {
    literal: 'On jiazi he went to Baoding commandery.',
    idiomatic: 'On jiazi he went to Baoding.',
  },
  s0127: {
    literal:
      'On bingyin merchants of the nine surnames in Wuwei commandery, An Menwu and others, rebelled, killed military commissioner Zhou Yi; judge Cui Cheng led troops and pacified them.',
    idiomatic:
      'On bingyin Nine-Surname merchants in Wuwei rebelled and killed Zhou Yi; Cui Cheng put them down.',
  },
  s0128: {
    literal:
      'That day five thousand Shu braves under Jia Xiu plotted treason; the Retired Emperor mounted the south tower of Shu commandery; generals Xi Yuanqing and others suppressed them.',
    idiomatic:
      'That day five thousand Shu braves plotted treason; Xuanzong took the south tower while Xi Yuanqing suppressed them.',
  },
  s0129: {
    literal: 'In the second month, on wuzi, he went to Fengxiang commandery.',
    idiomatic: 'In the second month he went to Fengxiang.',
  },
  s0130: {
    literal:
      'Wencheng prefect Qi Zhuang of the nine surnames of Wuwei crushed more than five thousand rebels.',
    idiomatic:
      'Qi Zhuang of Wencheng crushed five thousand rebels.',
  },
  s0131: {
    literal:
      'The emperor discussed a great campaign to recover the two capitals and requisitioned all public and private horses to aid the army.',
    idiomatic:
      'He planned a great drive on the two capitals and requisitioned every horse.',
  },
  s0132: {
    literal:
      'Palace Attendant Li Hao submitted a note saying "no horses"; Censor-in-Chief Cui Guangyuan impeached him and Hao was demoted to Jianghua prefect.',
    idiomatic:
      'Li Hao claimed "no horses"; Cui Guangyuan impeached him and he was demoted to Jianghua.',
  },
  s0133: {
    literal:
      'Military commissioner Li Guangbi crushed the rebel general Cai Xide\'s host below the city wall, beheading and capturing seventy thousand; military stores and weapons were abundant.',
    idiomatic:
      'Li Guangbi routed Cai Xide below the walls, taking seventy thousand heads and rich spoils.',
  },
  s0134: {
    literal:
      'Shuofang military commissioner Guo Ziyi crushed the rebel general Cui Qianyou at Tong Pass and recovered Hedong commandery.',
    idiomatic:
      'Guo Ziyi routed Cui Qianyou at Tong Pass and recovered Hedong.',
  },
  s0135: {
    literal:
      'Prince of Yong Li Lin\'s army was defeated; he fled beyond the ranges and at Dayu Ridge was killed by Hongzhou prefect Huangfu Shen.',
    idiomatic:
      'Li Lin was defeated, fled south, and was killed at Dayu by Huangfu Shen.',
  },
  s0136: {
    literal:
      'In the third month, on guihai, Hexi\'s earthquake since last winter now ceased.',
    idiomatic:
      'In the third month Hexi\'s winter-long earthquake finally ceased.',
  },
  s0137: {
    literal:
      'On xinyou Left Chancellor Wei Jiansu and Grand Councilor Pei Mian were made Left and Right Vice Directors of the Masters of Writing, both removed from deliberative posts.',
    idiomatic:
      'On xinyou Wei Jiansu and Pei Mian became left and right vice directors of the masters of writing and left the council.',
  },
  s0138: {
    literal:
      'Former Minister of Justice, retired, Miao Jinqing was made Left Chancellor.',
    idiomatic:
      'Retired Minister of Justice Miao Jinqing became left chancellor.',
  },
  s0139: {
    literal:
      'Tibet sent envoys for marriage alliance; Palace Attendant Nan Juchuan was sent to reply.',
    idiomatic:
      'Tibet sought alliance; Nan Juchuan was sent to reply.',
  },
  s0140: {
    literal:
      'From guihai heavy rain fell until guiyou without stopping; an edict ordered review of criminal cases, and on jiaxu it ceased.',
    idiomatic:
      'Heavy rain fell from guihai to guiyou; he ordered prisons reviewed, and on jiaxu the rains stopped.',
  },
  s0141: {
    literal:
      'In the fourth summer month, on wuyin new moon, Guo Ziyi was made Minister of Works and concurrent deputy commander-in-chief, commanding all military commissioners;',
    idiomatic:
      'On the fourth month\'s new moon Guo Ziyi became minister of works and deputy commander, commanding all commissioners;',
  },
  s0142: {
    literal: 'Li Guangbi was made Minister of Education.',
    idiomatic: 'Li Guangbi became minister of education.',
  },
  s0143: {
    literal:
      'On yiyou the imperial astronomer reported Jupiter, Venus, and Mars gathered in the Well mansion.',
    idiomatic:
      'On yiyou the court astronomer reported Jupiter, Venus, and Mars in the Well mansion.',
  },
  s0144: {
    literal:
      'On guichou Guo Ziyi fought the rebel general An Shouzhong at Qing Canal; the official army was defeated and Ziyi withdrew to defend Wugong.',
    idiomatic:
      'On guichou Guo Ziyi fought An Shouzhong at Qing Canal, was routed, and withdrew to Wugong.',
  },
  s0145: {
    literal:
      'On dingsi Fang Guan was made Crown Prince Junior Tutor and removed from deliberative posts.',
    idiomatic:
      'On dingsi Fang Guan became crown prince junior tutor and left the council.',
  },
  s0146: {
    literal:
      'Remonstrance Grandee Zhang Gao was made Vice Director of the Secretariat and concurrent Secretariat-Chancellery Grand Councilor.',
    idiomatic:
      'Zhang Gao became vice director of the secretariat and grand councilor.',
  },
  s0147: {
    literal:
      'Vice Minister of War Du Hongjian was made Hexi military commissioner.',
    idiomatic:
      'Du Hongjian became Hexi commissioner.',
  },
  s0148: {
    literal:
      'On gengshen a proclamation posthumously invested the late consort Yang as Empress Yuanxian, the emperor\'s mother.',
    idiomatic:
      'On gengshen his mother, the late Consort Yang, was posthumously made Empress Yuanxian.',
  },
  s0149: {
    literal:
      'On jiazi Guo Ziyi, for military fault, yielded the post of Minister of Works and was permitted.',
    idiomatic:
      'On jiazi Guo Ziyi resigned the ministry of works for military fault and was allowed.',
  },
  s0150: {
    literal:
      'On gengxu night in Shu commandery soldier Guo Qianren plotted treason; the Retired Emperor mounted the Xuanying Tower; military commissioner Li Xian suppressed it.',
    idiomatic:
      'On gengxu night Guo Qianren of Shu plotted treason; Xuanzong took the Xuanying Tower while Li Xian put it down.',
  },
  s0151: {
    literal:
      'On dingsi the rebel general An Wuchen took Shan commandery; not a person was left.',
    idiomatic:
      'On dingsi An Wuchen took Shan commandery and left no survivor.',
  },
  s0152: {
    literal:
      'On jiashen Vice Director of the Chancellery Cui Huan was made Yuhang prefect and Jiangdong pacification and defense commissioner.',
    idiomatic:
      'On jiashen Cui Huan became Yuhang prefect and Jiangdong commissioner.',
  },
  s0153: {
    literal:
      'On jichou Grand Councilor Zhang Gao was made concurrent Henan military commissioner and pacification and disposition commissioner.',
    idiomatic:
      'On jichou Zhang Gao became Henan commissioner with full disposition powers.',
  },
  s0154: {
    literal:
      'Lingchang prefect Xu Shuji was attacked by rebels; relief did not arrive; he led his host to join Suiyang commandery.',
    idiomatic:
      'Xu Shuji of Lingchang, besieged without relief, led his troops into Suiyang.',
  },
  s0155: {
    literal:
      'On guisi the armies were greatly reviewed; the emperor mounted the city tower to watch.',
    idiomatic:
      'On guisi he reviewed the armies from the city wall.',
  },
  s0156: {
    literal:
      'On dingyou Yong county was changed to Fengxiang county and Chencang to Baoji county.',
    idiomatic:
      'On dingyou Yong became Fengxiang county and Chencang Baoji.',
  },
  s0157: {
    literal:
      'In the intercalary eighth month, on xinwei, rebel troops suddenly raided Fengxiang; campaigning marshal Wang Bolun and judge Li Chun of Cui Guangyuan led troops to resist.',
    idiomatic:
      'In the intercalary eighth month rebels raided Fengxiang; Wang Bolun and Li Chun drove them off.',
  },
  s0158: {
    literal:
      'The rebels retreated; pursuing victory to Zhongwei Bridge they killed a thousand bridge guards and chased into the park.',
    idiomatic:
      'Pursuing, they killed a thousand at Zhongwei Bridge and chased into the imperial park.',
  },
  s0159: {
    literal:
      'The rebel great army was camped at Wugong; hearing this they burned their camp and left.',
    idiomatic:
      'The main rebel force at Wugong burned its camp and fled on hearing the news.',
  },
  s0160: {
    literal:
      'Bolong died fighting the rebels at close quarters; Li Chun, strength exhausted, was captured—yet from then the rebels dared not invade west.',
    idiomatic:
      'Bolong died in close fight; Li Chun was taken—but rebels never again raided west.',
  },
  s0161: {
    literal:
      'On dingchou Shangdang military commissioner Cheng Qianli challenged the rebels and was captured by the rebel general Cai Xide.',
    idiomatic:
      'On dingchou Cheng Qianli of Shangdang was captured by Cai Xide.',
  },
  s0162: {
    literal:
      'Prince of Dunhuang Chengbao returned from the Huihe mission and was made Director of the Imperial Clan;',
    idiomatic:
      'Chengbao returned from Huihe and became director of the imperial clan;',
  },
  s0163: {
    literal:
      'the Huihe princess was taken as consort; Huihe enfeoffed her Yehu, bearing the four insignia; with the Yehu\'s crown prince she led four thousand troops to aid the state in punishing rebels.',
    idiomatic:
      'he married the Huihe princess; the Yehu and his crown prince brought four thousand horsemen to fight the rebels.',
  },
  s0164: {
    literal:
      'The Yehu entered audience; feasting and rewards were increased.',
    idiomatic:
      'The Yehu was received at court with lavish feasting.',
  },
  s0165: {
    literal:
      'On dinghai Commander-in-Chief Prince of Guangping led Shuofang, Anxi, Huihe, southern barbarian, and Dashi forces—two hundred thousand—and marched east to punish rebels.',
    idiomatic:
      'On dinghai the Prince of Guangping led two hundred thousand from Shuofang, Anxi, Huihe, Nanman, and Dashi east against the rebels.',
  },
  s0166: {
    literal:
      'On renyin he fought the rebel generals An Shouzhong and Li Guiren northwest of Xiangji Temple; the rebel army was greatly defeated, sixty thousand heads cut, rebel commander Zhang Tongru abandoned the capital and fled east.',
    idiomatic:
      'On renyin he crushed An Shouzhong and Li Guiren at Xiangji Temple, took sixty thousand heads, and Zhang Tongru fled the capital.',
  },
  s0167: {
    literal: 'On guimao the Prince of Guangping recovered the western capital.',
    idiomatic: 'On guimao the Prince of Guangping entered the western capital.',
  },
  s0168: {
    literal:
      'On jiachen the victory report reached the mobile court; the hundred officials congratulated; that day victory was announced to Shu.',
    idiomatic:
      'On jiachen word of victory reached court; the ministers rejoiced and the news was sent to Shu.',
  },
  s0169: {
    literal:
      'The Retired Emperor sent Pei Mian into the capital to report to the suburban altars and the altars of soil and grain.',
    idiomatic:
      'The retired emperor sent Pei Mian to report at the suburban and state altars.',
  },
  s0170: {
    literal:
      'In the tenth winter month, on yisi new moon, Cui Guangyuan was made metropolitan prefect.',
    idiomatic:
      'In the tenth month Cui Guangyuan became metropolitan prefect.',
  },
  s0171: {
    literal:
      'An edict said: "As the capital is newly recovered, the people must be settled and the palace swept to welcome the Retired Emperor.',
    idiomatic:
      'An edict said: "The capital is newly taken; we must settle the people, clean the palace, and welcome the retired emperor.',
  },
  s0172: {
    literal:
      'On the nineteenth of this month we return to the capital; all supplies for the journey shall be kept spare."',
    idiomatic:
      'We return on the nineteenth; keep the journey spare."',
  },
  s0173: {
    literal: 'Tibet raided and took Xiping commandery.',
    idiomatic: 'Tibet took Xiping commandery.',
  },
  s0174: {
    literal:
      'On guichou the rebel general Yin Ziqi took Suiyang and killed Zhang Xun, Yao Yan, and Xu Yuan.',
    idiomatic:
      'On guichou Yin Ziqi took Suiyang and killed Zhang Xun, Yao Yan, and Xu Yuan.',
  },
  s0175: {
    literal:
      'After defeat at Xiangji the rebels gathered all their forces to hold Shan commandery; the Prince of Guangping with Guo Ziyi and others advanced to attack and fought at Xindian west of Shan; the rebel host was greatly defeated, one hundred thousand heads cut, corpses lay thirty li.',
    idiomatic:
      'The rebels massed at Shan; the Prince of Guangping and Guo Ziyi crushed them at Xindian, taking one hundred thousand heads over thirty li.',
  },
  s0176: {
    literal: 'On gengshen An Qingxu fled north to Hebei with his faction.',
    idiomatic: 'On gengshen An Qingxu fled to Hebei with his followers.',
  },
  s0177: {
    literal:
      'On renxu the Prince of Guangping entered the eastern capital; troops were arrayed south of Tianjin Bridge and the people cheered along the road.',
    idiomatic:
      'On renxu the Prince of Guangping entered Luoyang; troops lined Tianjin Bridge as the people cheered.',
  },
  s0178: {
    literal:
      'More than three hundred officials who had served the rebels in false posts, including Acting Palace Attendant Chen Xilie and Secretariat Director Zhang Tan, waited in plain clothes for judgment.',
    idiomatic:
      'More than three hundred collaborators, including Chen Xilie and Zhang Tan, waited in plain clothes for judgment.',
  },
  s0179: {
    literal:
      'On guihai the emperor returned to the capital from Fengxiang and sent Crown Prince Grand Tutor Wei Jiansu into Shu to welcome the Retired Emperor; Fengxiang commandery was given tax relief for five years.',
    idiomatic:
      'On guihai he returned from Fengxiang and sent Wei Jiansu to Shu; Fengxiang received five years\' tax relief.',
  },
  s0180: {
    literal:
      'On bingyin he reached Wangxian Palace; the eastern capital victory report arrived and the emperor rejoiced greatly.',
    idiomatic:
      'On bingyin at Wangxian Palace he received word of Luoyang\'s recovery and rejoiced.',
  },
  s0181: {
    literal: 'On dingmao he entered Chang\'an.',
    idiomatic: 'On dingmao he entered the capital.',
  },
  s0182: {
    literal:
      'The people wept and bowed in joy, saying: "We never thought to see our lord again!',
    idiomatic:
      'The people wept and bowed: "We never thought to see you again!',
  },
  s0183: {
    literal: '" The emperor also was moved to compassion.',
    idiomatic: 'He too was moved to tears.',
  },
  s0184: {
    literal:
      'The nine temples had been burned by rebels; the emperor wore plain clothes and wept at the temples three days, then moved into the Great Bright Palace.',
    idiomatic:
      'The ancestral temples had been burned; he mourned in plain dress three days, then entered the Great Bright Palace.',
  },
  s0185: {
    literal: 'That day the Retired Emperor departed Shu commandery.',
    idiomatic: 'That day the retired emperor left Shu.',
  },
  s0186: {
    literal:
      'On jisi civil and military officials who had been coerced removed caps and went barefoot to the court hall to await punishment; they were confined in government prisons and ordered investigated by Censor-in-Chief Cui Qi.',
    idiomatic:
      'On jisi coerced officials came barefoot to await judgment; Cui Qi was ordered to investigate.',
  },
  s0187: {
    literal:
      'The Huihe Yehu returned from the eastern capital; he was feasted in the Xuanzheng Hall and took leave to return to his realm.',
    idiomatic:
      'The Huihe Yehu was feasted in the Xuanzheng Hall and took leave for home.',
  },
  s0188: {
    literal:
      'He was enfeoffed King of Loyal Righteousness, with an agreement to deliver twenty thousand bolts of silk each year, handed over at Shuofang when the king\'s envoy came.',
    idiomatic:
      'He was made King of Loyal Righteousness, promised twenty thousand bolts of silk yearly at Shuofang.',
  },
  s0189: {
    literal:
      'In the eleventh month, on renshen new moon, the emperor mounted Danfeng Tower and issued an edict: "Our state arose from the thunder trigram, established the pole and opened the succession.',
    idiomatic:
      'In the eleventh month he mounted Danfeng Tower and proclaimed: "Our house arose in thunder, set the pole, and opened a new age.',
  },
  s0190: {
    literal:
      'Songs of praise and the turn of fate opened a sagely reign of a thousand ages;',
    idiomatic:
      'Songs of praise opened a sagely thousand-year reign;',
  },
  s0191: {
    literal:
      'culture and fame, grasping the chart through six generations.',
    idiomatic:
      'Culture and fame held the mandate through six generations.',
  },
  s0192: {
    literal:
      'An Lushan, a base man of Yi and Jie stock, won slight frontier merit, then let loose cruelty; rebellion rose in haste and poison flowed to the four seas, charring ten thousand souls.',
    idiomatic:
      'An Lushan, a base frontier soldier, turned cruel; rebellion charred the realm.',
  },
  s0193: {
    literal:
      'I speak with grief and rage and take up arms to ask justice; at Lingwu I gathered a single brigade, at Fengxiang united a million soldiers, personally commanding the host to sweep away the evil.',
    idiomatic:
      'I took up arms in grief; at Lingwu I gathered a brigade, at Fengxiang a million men, and led them myself against the rebels.',
  },
  s0194: {
    literal:
      'The Prince of Guangping received the commander\'s seal and could shake heaven\'s sound;',
    idiomatic:
      'The Prince of Guangping commanded the armies and shook heaven;',
  },
  s0195: {
    literal:
      'Guo Ziyi was decisive and unmatched, accomplishing the great enterprise.',
    idiomatic:
      'Guo Ziyi was unmatched and finished the war.',
  },
  s0196: {
    literal:
      'Together with the Huihe Yehu, Yunnan youths, and the armies of the various barbarians, they fought hard to pacify the evil; their force was like snapping dry wood, easy as splitting bamboo.',
    idiomatic:
      'With the Huihe Yehu, Yunnan troops, and allied barbarians they broke the rebels like dry wood.',
  },
  s0197: {
    literal:
      'I early received sage instruction and have read the Book of Rites; duty to the ancestors cuts deep, and I feared I could not bear the weight.',
    idiomatic:
      'I was taught the rites of filial piety and feared I could not bear the ancestral charge.',
  },
  s0198: {
    literal:
      'Now the ancestral temples are restored in Hangu and Luo; the Retired Emperor is welcomed from Ba-Shu;',
    idiomatic:
      'Now the temples stand again in the two capitals and the retired emperor returns from Shu;',
  },
  s0199: {
    literal:
      'the imperial carriage turns homeward and the sleeping gate is asked after in peace;',
    idiomatic:
      'the imperial carriage returns and the inner gate knows peace again;',
  },
  s0200: {
    literal: 'The realm is at peace; my wish is fulfilled.',
    idiomatic: 'The realm is whole—my work is done.',
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
