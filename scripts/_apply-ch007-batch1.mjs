#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.007, Zhongzong & Ruizong annals — birth through Shenlong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/007.json';
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
    literal: 'Zhongzong (section). Emperor Zhongzong, posthumous title Great Harmonious Sagely Illustrious Filial, bore the taboo name Xian, seventh son of Gaozong; his mother was Empress Zetian the Shunsheng.',
    idiomatic: 'Zhongzong — Emperor Zhongzong, styled Great Harmonious Sagely Illustrious Filial, bore the taboo name Xian. He was Gaozong\'s seventh son; his mother was Empress Zetian the Shunsheng.',
  },
  s0002: {
    literal: 'In the eleventh month of the first year of Xianqing, on yichou, he was born in Chang\'an.',
    idiomatic: 'In the eleventh month of Xianqing 1, on yichou, he was born in Chang\'an.',
  },
  s0003: {
    literal: 'The next year he was enfeoffed as Prince of Zhou and appointed Military Governor of Luozhou.',
    idiomatic: 'The following year he was created Prince of Zhou and made military governor of Luozhou.',
  },
  s0004: {
    literal: 'In the second year of Yifeng he was transferred to Prince of Ying, his name changed to Zhe, and he was appointed Military Governor of Yongzhou.',
    idiomatic: 'In Yifeng 2 he was made Prince of Ying, renamed Zhe, and appointed military governor of Yongzhou.',
  },
  s0005: {
    literal: 'In the first year of Yonglong, Crown Prince Zhanghuai was deposed; that same year he was installed as crown prince.',
    idiomatic: 'In Yonglong 1 Crown Prince Zhanghuai was deposed, and that year he was made crown prince.',
  },
  s0006: {
    literal: 'In the twelfth month of the first year of Hongdao, Gaozong died; by the late emperor\'s testament the crown prince took the throne before the bier.',
    idiomatic: 'In the twelfth month of Hongdao 1 Gaozong died, and by his testament the crown prince ascended before the coffin.',
  },
  s0007: {
    literal: 'The empress dowager held court and exercised regency, and the era name was changed to Zisheng.',
    idiomatic: 'The empress dowager ruled from behind the curtain and renamed the era Zisheng.',
  },
  s0008: {
    literal: 'In the second month of the inaugural year she deposed the emperor as Prince of Luling and confined him in a separate residence.',
    idiomatic: 'In the second month of that year she demoted him to Prince of Luling and shut him away.',
  },
  s0009: {
    literal: 'In the fifth month of that year he was moved to Junzhou, and soon after transferred to Fangling.',
    idiomatic: 'In the fifth month he was exiled to Junzhou, then soon moved to Fangling.',
  },
  s0010: {
    literal: 'In the first year of Shenglü he was recalled to the eastern capital, installed as crown prince, and restored to his former name Xian.',
    idiomatic: 'In Shenglü 1 he was recalled to Luoyang, made crown prince again, and took back the name Xian.',
  },
  s0011: {
    literal: 'At that time Zhang Yizhi and his brother Changzong secretly plotted rebellion.',
    idiomatic: 'By then Zhang Yizhi and his brother Changzong were plotting treason in secret.',
  },
  s0012: {
    literal: 'In the first month of Shenlong 1, Fengge Vice Minister Zhang Jianzhi, Luantai Vice Minister Cui Xuanwei, Left Feathered Forest General Jing Hui, Right Feathered Forest General Huan Yanfan, and Vice Director of Punishments Yuan Shuji and others settled the plan, led the feathered forest troops to execute Yizhi and Changzong, welcomed the crown prince to oversee the state, and took charge of all government affairs.',
    idiomatic: 'In the first month of Shenlong 1, Zhang Jianzhi of Fengge, Cui Xuanwei of Luantai, Jing Hui and Huan Yanfan of the feathered forest guards, and Yuan Shuji of the punishments bureau led the guard in killing Yizhi and Changzong, brought the crown prince to govern as regent, and seized the reins of state.',
  },
  s0013: {
    literal: 'A general amnesty was proclaimed throughout the realm.',
    idiomatic: 'The court proclaimed a general amnesty throughout the realm.',
  },
  s0014: {
    literal: 'Fengge Vice Minister Wei Chengqing, Remonstrator Fang Rong, and Minister of Rites Cui Shenqing and others were imprisoned.',
    idiomatic: 'Wei Chengqing of Fengge, Remonstrator Fang Rong, and Cui Shenqing, minister of rites, were thrown into prison.',
  },
  s0015: {
    literal: 'On jiachen he ordered Vice Minister of Earthly Offices Fan Chen to go to the capital to announce the news at the ancestral temples and tombs.',
    idiomatic: 'On jiachen he sent Fan Chen, vice minister of earthly offices, to Chang\'an to report at the temples and imperial tombs.',
  },
  s0016: {
    literal: 'Yuan Shuji, vice director of punishments and concurrent marshal of the Prince of Xiang\'s household, became equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace.',
    idiomatic: 'Yuan Shuji, vice director of punishments and marshal to the Prince of Xiang, joined the third rank at Phoenix Pavilion and Terrace.',
  },
  s0017: {
    literal: 'On yisi Zetian transferred the throne to the crown prince.',
    idiomatic: 'On yisi Empress Zetian abdicated in favor of the crown prince.',
  },
  s0018: {
    literal: 'On bingwu he took the throne at the Hall of Penetrating Heaven, proclaimed a general amnesty, excepting the faction of Yizhi from the original scope of pardon.',
    idiomatic: 'On bingwu he ascended at the Hall of Penetrating Heaven, proclaimed amnesty, and excluded Yizhi\'s faction from the pardon.',
  },
  s0019: {
    literal: 'All who had been falsely implicated by Zhou Xing and Lai Junchen were ordered cleared and restored.',
    idiomatic: 'Everyone framed by Zhou Xing and Lai Junchen was cleared and restored.',
  },
  s0020: {
    literal: 'Civil and military officials within and without were advanced two ranks; those of the third rank and above received two degrees of nobility; those entering the fifth rank and above had four merit examinations specially reduced.',
    idiomatic: 'Every official, civil or military, gained two ranks; third rank and above received two noble degrees; those newly reaching fifth rank had four examinations waived.',
  },
  s0021: {
    literal: 'Public feasting for five days.',
    idiomatic: 'The court granted five days of public feasting.',
  },
  s0022: {
    literal: 'Because Prince Dan of Xiang, military governor of Bingzhou, and Princess Taiping had merit in executing the Zhang brothers, the prince was given the added title Pacifying-the-State Prince of Xiang and promoted to Grand Marshal, equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace;',
    idiomatic: 'Prince Dan of Xiang, governor of Bingzhou, and Princess Taiping had helped kill the Zhang brothers; the prince took the added title Pacifying-the-State Prince of Xiang and rose to grand marshal of third rank at Phoenix Pavilion and Terrace;',
  },
  s0023: {
    literal: 'the princess was given the added title Pacifying-the-Realm Princess Taiping, with a substantive fief; counting earlier grants, her fief reached five thousand households.',
    idiomatic: 'the princess became Pacifying-the-Realm Princess Taiping with a new substantive fief, bringing her total to five thousand households.',
  },
  s0024: {
    literal: 'Imperial kinsmen earlier confiscated and banished were ordered to have their descendants restored to the clan registers and given offices and titles as appropriate.',
    idiomatic: 'Descendants of confiscated imperial kin were restored to the registers and given offices and titles as their merits allowed.',
  },
  s0025: {
    literal: 'Three thousand palace women were released.',
    idiomatic: 'Three thousand palace women were sent out of the palace.',
  },
  s0026: {
    literal: 'On dingwei the Heavenly Empress moved to the Shangyang Palace.',
    idiomatic: 'On dingwei the retired empress moved to Shangyang Palace.',
  },
  s0027: {
    literal: 'On gengxu Zhang Jianzhi, Fengge vice minister and equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace, became Minister of Summer Offices, equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace, and was enfeoffed as Duke of Hanyang;',
    idiomatic: 'On gengxu Zhang Jianzhi became minister of summer offices of third rank at Phoenix Pavilion and Terrace and was created Duke of Hanyang;',
  },
  s0028: {
    literal: 'Cui Xuanwei, Luantai vice minister and concurrent right aide to the crown prince, equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace, became acting Secretariat Director and was enfeoffed as Duke of Boling;',
    idiomatic: 'Cui Xuanwei, Luantai vice minister and crown prince aide, became acting secretariat director and Duke of Boling;',
  },
  s0029: {
    literal: 'Yuan Shuji, equal in rank to the Three Offices at Phoenix Pavilion and Phoenix Terrace, was enfeoffed as Duke of Nanyang;',
    idiomatic: 'Yuan Shuji of third rank was created Duke of Nanyang;',
  },
  s0030: {
    literal: 'Jing Hui became Attendant-in-Chief and Duke of Pingyang;',
    idiomatic: 'Jing Hui became attendant-in-chief and Duke of Pingyang;',
  },
  s0031: {
    literal: 'Huan Yanfan became Attendant-in-Chief and Duke of Qiao: all were given the silver-blue-glow grandee rank and a substantive fief of five hundred households.',
    idiomatic: 'Huan Yanfan became attendant-in-chief and Duke of Qiao; all received the silver-blue-glow grandee rank and fiefs of five hundred households.',
  },
  s0032: {
    literal: 'Li Duozuo, right general of the feathered forest guards and Duke of Liaoguo, was advanced to Prince of Liaoyang commandery with a substantive fief of six hundred households;',
    idiomatic: 'Li Duozuo, right general of the feathered forest, was raised to Prince of Liaoyang with a fief of six hundred households;',
  },
  s0033: {
    literal: 'Wang Tongjiao, inner attendant and commandant-consort, became general of the cloud-banners guard, right thousand-ox general, and Duke of Langye, with a substantive fief of five hundred households.',
    idiomatic: 'Wang Tongjiao, inner attendant and imperial son-in-law, became cloud-banners general, right thousand-ox general, and Duke of Langye with a fief of five hundred households.',
  },
  s0034: {
    literal: 'All were rewarded for merit in executing the Zhang brothers.',
    idiomatic: 'All were rewarded for killing the Zhang brothers.',
  },
  s0035: {
    literal: 'Other enfeoffments were graded accordingly.',
    idiomatic: 'Other rewards were graded by merit.',
  },
  s0036: {
    literal: 'The retired empress was given the honorific title Great Sage Emperor Zetian.',
    idiomatic: 'The retired empress was styled Great Sage Emperor Zetian.',
  },
  s0037: {
    literal: 'On jiayin of the second month the dynastic name was restored; it remained Tang as before.',
    idiomatic: 'On jiayin of the second month the dynasty was restored to Tang.',
  },
  s0038: {
    literal: 'The altars of soil and grain, ancestral temples, tombs, suburban sacrifices, campaign banners and flags, colors of dress, heaven and earth, sun and moon, monasteries, terrace offices, and official titles—all followed the precedents before Yongchun.',
    idiomatic: 'Altars, temples, tombs, suburban rites, banners, dress, celestial names, monasteries, offices, and titles all reverted to pre-Yongchun usage.',
  },
  s0039: {
    literal: 'The Divine Capital again became the Eastern Capital; the Northern Capital again became the metropolitan prefecture of Bingzhou; Lord Lao again became the Mysterious Primordial Emperor.',
    idiomatic: 'Luoyang again became the eastern capital, Taiyuan the northern metropolitan prefecture, and Lord Lao again the Mysterious Primordial Emperor.',
  },
  s0040: {
    literal: 'The people of all prefectures were exempted from this year\'s land tax and levies; the people of Fang Prefecture received tax relief for three years.',
    idiomatic: 'Every prefecture was excused this year\'s taxes; Fang Prefecture received three years\' relief.',
  },
  s0041: {
    literal: 'The Left and Right Offices for Censorial Reform were changed back to the Left and Right Censorates.',
    idiomatic: 'The censorial reform offices were restored as the left and right censorates.',
  },
  s0042: {
    literal: 'Wei Chengqing was demoted to captain of Gaoyao; Fang Rong was banished to Qinzhou.',
    idiomatic: 'Wei Chengqing was demoted to Gaoyao captain; Fang Rong was exiled to Qinzhou.',
  },
  s0043: {
    literal: 'Yang Zaisi, Secretariat Director, became Minister of Revenue, equal in rank to the Three Offices at the Secretariat Chancellery, and Capital Intendant;',
    idiomatic: 'Yang Zaisi became minister of revenue of third rank at the Secretariat Chancellery and capital intendant;',
  },
  s0044: {
    literal: 'Yao Yuanzhi, Grand Master of Splendid Carriages and equal in rank to the Three Offices at the Secretariat Chancellery, was sent out as prefect of Bozhou.',
    idiomatic: 'Yao Yuanzhi, grand master of splendid carriages of third rank, was sent out as prefect of Bozhou.',
  },
  s0045: {
    literal: 'On jiwei his elder cousin Qianli, left general of the golden guards and Duke of Yulin commandery, was enfeoffed as Prince of Chengji commandery and left general of the golden guards, with a substantive fief of five hundred households.',
    idiomatic: 'On jiwei his cousin Qianli, left golden-guard general and Duke of Yulin, was made Prince of Chengji and left golden-guard general with a fief of five hundred households.',
  },
  s0046: {
    literal: 'Candidates for the examinations were ordered to cease studying the Guidelines for Ministers and again study the Laozi.',
    idiomatic: 'Exam candidates were told to drop the Guidelines for Ministers and resume study of the Laozi.',
  },
  s0047: {
    literal: 'On jiazi the consort Wei was installed as empress; a general amnesty was proclaimed; officials attending received one turn on the merit roll; public feasting for three days.',
    idiomatic: 'On jiazi Consort Wei became empress; the court proclaimed amnesty, granted attending officials one merit turn, and feasted for three days.',
  },
  s0048: {
    literal: 'The empress\'s late father, the former prefect of Yu, Xuanzhen, was made Prince of Shangluo commandery; the empress\'s mother, the Cui clan, was posthumously created Princess of Shangluo commandery.',
    idiomatic: 'The empress\'s father Xuanzhen, late prefect of Yu, was made Prince of Shangluo; her mother Lady Cui was posthumously made princess of Shangluo.',
  },
  s0049: {
    literal: 'At first, Princes Yuanjia of Han, Yuangui of Huo, and others had all met wrongful death since the Chuigong era; that day their offices and titles were posthumously restored, proper rites ordered for reburial, and where there were heirs succession was permitted; where there were none, a close kinsman might be adopted as heir.',
    idiomatic: 'Princes Yuanjia of Han, Yuangui of Huo, and others wrongfully killed since Chuigong had their honors restored that day, were reburied with full rites, and heirs or adoptive kin were allowed to succeed.',
  },
  s0050: {
    literal: 'An edict ordered officials of the ninth rank and above and provincial assembly envoys to speak frankly on the gains and losses of government, and also to recommend men of worth, integrity, and forthright remonstrance.',
    idiomatic: 'An edict commanded officials of the ninth rank and above and assembly envoys to speak frankly on policy and recommend worthy, upright remonstrators.',
  },
  s0051: {
    literal: 'On bingyin Prince Chongfu of Qiao was demoted to supernumerary prefect of Puzhou, without charge of prefectural affairs.',
    idiomatic: 'On bingyin Prince Chongfu of Qiao was demoted to supernumerary prefect of Pu, without governing authority.',
  },
  s0052: {
    literal: 'Wu Sansi, special advance and crown prince mentor and Prince of Liang, became Minister of Works, equal in rank to the Three Offices at the Secretariat Chancellery, with an added substantive fief of five hundred households, reaching one thousand five hundred in all.',
    idiomatic: 'Wu Sansi, special advance, crown prince mentor, and Prince of Liang, became minister of works of third rank with a new fief of five hundred households, for fifteen hundred in all.',
  },
  s0053: {
    literal: 'On dingmao Wu Youji, right attendant-in-ordinary and Prince of Ding\'an commandery and commandant-consort, was enfeoffed as Prince of Ding, made Minister of Education, and given another four hundred households in substantive fief, reaching one thousand in all.',
    idiomatic: 'On dingmao Wu Youji, right attendant and imperial son-in-law, was made Prince of Ding and minister of education with four hundred added households, for one thousand in all.',
  },
  s0054: {
    literal: 'On xinwei the emperor went to the Hall of Observing the Wind to attend upon the retired empress.',
    idiomatic: 'On xinwei the emperor visited the retired empress at the Hall of Observing the Wind.',
  },
  s0055: {
    literal: 'Prince Dan of Xiang, grand marshal, firmly declined the grand marshal post and participation in government; his request was granted.',
    idiomatic: 'Prince Dan of Xiang, grand marshal, refused the grand marshal post and a seat in government, and the emperor let him step down.',
  },
  s0056: {
    literal: 'On jiaxu Zhu Qinming, libationer of the Directorate of Education, became equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic: 'On jiaxu Zhu Qinming, directorate libationer, joined the third rank at the Secretariat Chancellery.',
  },
  s0057: {
    literal: 'Wei Anshi, vice minister of the yellow gate and in charge of secretariat affairs, became Minister of Punishments and ceased participation in government.',
    idiomatic: 'Wei Anshi, yellow-gate vice minister acting for the secretariat, became minister of punishments and left the council.',
  },
  s0058: {
    literal: 'On bingzi each prefecture was to establish one monastery and one Daoist abbey, to be named "Restoration."',
    idiomatic: 'On bingzi every prefecture was ordered to found one monastery and one abbey named Restoration.',
  },
  s0059: {
    literal: 'On dingchou Wu Sansi firmly declined Minister of Works and equal rank to the Three Offices at the Secretariat Chancellery; Wu Youji firmly declined Minister of Education and princely enfeoffment; permission was granted.',
    idiomatic: 'On dingchou Wu Sansi and Wu Youji were allowed to decline their new honors.',
  },
  s0060: {
    literal: 'Prince Chongjun of Yixing commandery was re-enfeoffed as Prince of Wei; Prince Chongmao of Beihai commandery as Prince of Wen.',
    idiomatic: 'Prince Chongjun of Yixing was made Prince of Wei; Prince Chongmao of Beihai was made Prince of Wen.',
  },
  s0061: {
    literal: 'On xinsi the late Minister of Works and Duke of Ying Li Ji had his office and title posthumously restored, and the relevant offices were ordered to raise his tomb and rebury him.',
    idiomatic: 'On xinsi Li Ji, late minister of works and Duke of Ying, had his honors restored and was ordered reburied with full rites.',
  },
  s0062: {
    literal: 'On jiashen an edict restored to their families the confiscated property of officials ruined since the Wenming era.',
    idiomatic: 'On jiashen property seized from officials ruined since Wenming was ordered returned to their families.',
  },
  s0063: {
    literal: 'Among the Yangzhou rebels only Xu Jingye\'s line was excluded from pardon; the rest were forgiven.',
    idiomatic: 'Of the Yangzhou rebels only Xu Jingye\'s house was barred from amnesty; all others were pardoned.',
  },
  s0064: {
    literal: 'On dinghai the supernumerary vice directors of the left and right secretariats were abolished.',
    idiomatic: 'On dinghai the supernumerary secretariat vice directors were abolished.',
  },
  s0065: {
    literal: 'Of the cruel officials Liu Guangye, Wang Deshou, Wang Chuzhen, Qu Zhenjun, and Liu Jingyang—though already dead—their offices and titles were to be posthumously stripped;',
    idiomatic: 'The cruel officials Liu Guangye, Wang Deshou, Wang Chuzhen, Qu Zhenjun, and Liu Jingyang, though dead, had their titles stripped;',
  },
  s0066: {
    literal: 'Jingyang, still living, was demoted to captain of Ledan in Luzhou.',
    idiomatic: 'Liu Jingyang, still alive, was demoted to Ledan captain in Luzhou.',
  },
  s0067: {
    literal: 'Qiu Shenji, Lai Zixun, Wan Guojun, Zhou Xing, Lai Junchen, Yu Chengye, Wang Jingzhao, Suo Yuanli, Fu Youyi, Wang Hongyi, Zhang Zhim, Pei Ji, Jiao Renchan, Hou Sil, Guo Ba, Li Jingren, Huangfu Wenbei, Chen Jiayan, and others—though already dead—were all to be struck from the registers.',
    idiomatic: 'Qiu Shenji, Lai Zixun, Wan Guojun, Zhou Xing, Lai Junchen, and a host of other dead persecutors were erased from the registers.',
  },
  s0068: {
    literal: 'Tang Fengyi was banished; Li Qinshou and Cao Renzhe were both reassigned to the far south.',
    idiomatic: 'Tang Fengyi was exiled; Li Qinshou and Cao Renzhe were sent to the distant south.',
  },
  s0069: {
    literal: 'On jichou Yuan Shuji, vice minister of the secretariat and concurrent chief administrator of the Pacifying-the-State Prince of Xiang\'s household and Duke of Nanyang, became Secretariat Director and concurrent chief administrator of the Pacifying-the-State Prince of Xiang\'s household.',
    idiomatic: 'On jichou Yuan Shuji, secretariat vice minister and administrator to Prince Dan of Xiang, became secretariat director while keeping his post with the prince.',
  },
  s0070: {
    literal: 'An edict said: "In court the sequence of lord and minister distinguishes noble and base;',
    idiomatic: 'An edict said: "In court the order of lord and minister sets rank high and low;',
  },
  s0071: {
    literal: 'among brothers the great bond likewise distinguishes precedence.',
    idiomatic: 'among brothers kinship likewise sets who comes first.',
  },
  s0072: {
    literal: 'The sages\' institutions all proceed from this principle.',
    idiomatic: 'The sages founded their rites on this principle.',
  },
  s0073: {
    literal: 'We hold this precious pinnacle, standing in the highest place.',
    idiomatic: 'We occupy the sacred throne, raised to the highest place.',
  },
  s0074: {
    literal: 'Facing south behind the screen, we receive the clan\'s reverence in audience;',
    idiomatic: 'Facing south behind the screen we receive the clan\'s reverence in audience;',
  },
  s0075: {
    literal: 'in private withdrawal we still use the family rites.',
    idiomatic: 'in private we still keep the family rites.',
  },
  s0076: {
    literal: 'In recent times few have kept to the measure: kings and princesses have bent ritual to private feeling; aunts and uncles of honored rank have bowed to nephews and nieces—against law and against propriety, and the heart is pained.',
    idiomatic: 'Lately few have kept the measure: princes and princesses have bent rite to private feeling; uncles and aunts of honored rank have bowed to nephews and nieces—against law and propriety, and it pains us.',
  },
  s0077: {
    literal: 'From this time forward such abuses are to be reformed.',
    idiomatic: 'From this day such abuses are to end.',
  },
  s0078: {
    literal: 'The Pacifying-the-State Prince of Xiang and the Pacifying-the-Realm Princess Taiping must no longer bow to Prince Chongjun of Wei and his brothers or to Princess Changning and her sisters.',
    idiomatic: 'Prince Dan of Xiang and Princess Taiping must no longer bow to Prince Chongjun of Wei and his brothers or to Princess Changning and her sisters.',
  },
  s0079: {
    literal: 'Let the clan be told, so all may know Our intent."',
    idiomatic: 'Let the clan be told, so all may know our intent."',
  },
  s0080: {
    literal: 'Earlier, princes and princesses all treated kinship as rank: the emperor\'s sons, and all aunts and uncles on meeting them, first bowed; in letters they styled their messages "memorials."',
    idiomatic: 'Before this, princes and princesses had treated blood as rank: the emperor\'s sons, and every aunt and uncle, bowed first on meeting them, and in letters called their notes memorials.',
  },
  s0081: {
    literal: 'The emperor wished to deepen harmony among kin; therefore he issued this edict to reform it.',
    idiomatic: 'The emperor wished warmer kinship; hence this reforming edict.',
  },
  s0082: {
    literal: 'On gengyin Prince Chongjun of Wei became Military Governor of Luozhou.',
    idiomatic: 'On gengyin Prince Chongjun of Wei became military governor of Luozhou.',
  },
  s0083: {
    literal: 'The prince rode a four-horse carriage with full guard;',
    idiomatic: 'He rode a four-horse carriage with full guard;',
  },
  s0084: {
    literal: 'all princes and dukes below him, fifth-rank officials of the secretariat and chancellery and above, and all kin escorted him—the ceremony was very grand.',
    idiomatic: 'every prince and duke below him, every secretariat and chancellery official of the fifth rank and above, and all kin escorted him in a splendid procession.',
  },
  s0085: {
    literal: 'When the affair was finished, gifts were bestowed in varying measure.',
    idiomatic: 'When it was done, gifts were given in graded amounts.',
  },
  s0086: {
    literal: 'On xinmao, because the late Director of Palace Steeds Xu Yougong had judged cases with fairness and mercy, he was posthumously made military governor of Yue and one son was granted office.',
    idiomatic: 'On xinmao Xu Yougong, late director of palace steeds, was posthumously made governor of Yue and one son given office for his fair judgments.',
  },
  s0087: {
    literal: 'On wuxu one post of great general was established in each of the left and right thousand-ox guards.',
    idiomatic: 'On wuxu each thousand-ox guard was given one great general.',
  },
  s0088: {
    literal: 'The staff of the Attendant Court Bureau were abolished.',
    idiomatic: 'The Attendant Court Bureau staff were abolished.',
  },
  s0089: {
    literal: 'Prince Dan of Xiang, protector-general of the Pacified North and Pacifying-the-State Prince, became great general of the left and right thousand-ox guards and attended within on great court days.',
    idiomatic: 'Prince Dan of Xiang, protector of the north, became great general of the left and right thousand-ox guards and attended great audiences within the palace.',
  },
  s0090: {
    literal: 'On bingwu the autumn she rite was restored to the mid-autumn month as of old.',
    idiomatic: 'On bingwu the autumn she rite was fixed again in mid-autumn.',
  },
  s0091: {
    literal: 'On wushen Prince Dan at the Grand Temple reception hall.',
    idiomatic: 'On wushen Prince Dan took up his post at the Grand Temple reception hall.',
  },
  s0092: {
    literal: 'Princes, dukes, and kin escorted him; the minister of guests set the guard; the minister of provisions prepared the feast.',
    idiomatic: 'Princes, dukes, and kin escorted him; the minister of guests set the guard and the minister of provisions the feast.',
  },
  s0093: {
    literal: 'When the rites were finished, gifts followed the ceremony for Prince Chongjun\'s assumption of the Luozhou governorship.',
    idiomatic: 'When the rites ended, gifts followed the same scale as for Prince Chongjun\'s Luozhou governorship.',
  },
  s0094: {
    literal: 'In the fourth summer month, on yichou, Wei Yuanzhong, captain of Duanzhou, became Minister of the Imperial Clan, equal in rank to the Three Offices at the Secretariat Chancellery.',
    idiomatic: 'In the fourth summer month, on yichou, Wei Yuanzhong of Duanzhou became minister of the imperial clan of third rank at the Secretariat Chancellery.',
  },
  s0095: {
    literal: 'On jiaxu Zuo Shuzi Wei Anshi became Minister of Personnel; Crown Prince Mentor Li Huaiyuan became Right Attendant-in-Ordinary; Right Aide Tang Xiujing became Pacifying-the-State Grand General; Right Aide Cui Xuanwei became Special Advance, chief administrator of the metropolitan prefecture of Yizhou, and acting governor; Right Aide Yang Zaisi, western intendant, Minister of Revenue, and Duke of Hongnong, became chief administrator of the metropolitan prefecture of Yangzhou and acting governor; Junior Mentor and Lecturer Zhu Qinming became Minister of Punishments—all retained participation in government as former staff of the crown prince.',
    idiomatic: 'On jiaxu Wei Anshi became minister of personnel; Li Huaiyuan right attendant; Tang Xiujing pacifying-the-state grand general; Cui Xuanwei special advance and acting governor of Yizhou; Yang Zaisi acting governor of Yangzhou; Zhu Qinming minister of punishments—all kept their seats on the council as the crown prince\'s former staff.',
  },
  s0096: {
    literal: 'On yihai Zhang Jianzhi became Secretariat Director.',
    idiomatic: 'On yihai Zhang Jianzhi became secretariat director.',
  },
  s0097: {
    literal: 'On wuyin the late Prince Chongrun of Shao was posthumously created Virtuous Crown Prince.',
    idiomatic: 'On wuyin the late Prince Chongrun of Shao was posthumously made Virtuous Crown Prince.',
  },
  s0098: {
    literal: 'In Tongguan County a great hailstorm killed many swallows and sparrows, flooded four hundred households, and envoys were sent to grant relief.',
    idiomatic: 'Tongguan was struck by hail that killed birds by the flock, drowned four hundred households, and envoys were sent with relief.',
  },
  s0099: {
    literal: 'In the fifth month, on renwu, the spirit tablets of the seven Wu temples were moved to the Chongzun Temple in the western capital.',
    idiomatic: 'In the fifth month, on renwu, the Wu ancestral tablets were moved to Chongzun Temple in Chang\'an.',
  },
  s0100: {
    literal: 'In the eastern capital the imperial ancestral temple and altars of soil and grain were newly established.',
    idiomatic: 'Luoyang gained a new imperial ancestral temple and altars of soil and grain.',
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
if (data.metadata.chapter !== '007') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 007; standalone T ready (${Object.keys(T).length} entries).`
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
