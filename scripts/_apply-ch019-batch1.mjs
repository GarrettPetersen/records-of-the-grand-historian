#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.019, Yizong / Vol. 18) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
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
    literal: 'Emperor Yizong, posthumous title Zhaosheng Gonghui Xiaoxiao, taboo name Cui, was Xuanzong\'s eldest son; his mother was Empress Yuanzhao, née Chao.',
    idiomatic: 'Yizong—taboo Cui—was Xuanzong\'s eldest son, born of Empress Yuanzhao Chao.',
  },
  s0002: {
    literal: 'On the fourteenth day of the eleventh month he was born in the princely residence.',
    idiomatic: 'He was born in the princely mansion on the eleventh month\'s fourteenth.',
  },
  s0003: {
    literal: 'In the tenth month he was enfeoffed as Prince of Yan; his original name was Wen.',
    idiomatic: 'In the tenth month he became Prince of Yan, born Wen.',
  },
  s0004: {
    literal: 'On the seventh day of the eighth month of Dazhong 13 Xuanzong\'s testamentary edict established him as crown prince supervising the state; his present name was adopted.',
    idiomatic: 'On Dazhong 13\'s eighth-month seventh Xuanzong\'s testament made him regent heir and renamed him Cui.',
  },
  s0005: {
    literal: 'On the thirteenth day he took the throne before the coffin; he was twenty-seven.',
    idiomatic: 'On the thirteenth he was enthroned before the bier at twenty-seven.',
  },
  s0006: {
    literal: 'The Emperor\'s bearing was heroic and outstanding, unlike the common throng.',
    idiomatic: 'His bearing was heroic—unlike ordinary men.',
  },
  s0007: {
    literal: 'While in the princely residence he often suffered grave illness; Consort Guo Shufei attended him with medicine and saw a yellow dragon enter and leave within his bedchamber.',
    idiomatic: 'In his princely years grave illness brought Consort Guo Shufei to his bedside; she saw a yellow dragon in the chamber.',
  },
  s0008: {
    literal: 'When he recovered the consort reported the marvel; the Emperor said: "Take care never to speak of it again.',
    idiomatic: 'Recovered, she told him; he said, "Never speak of this again—',
  },
  s0009: {
    literal: '" Snow once piled several feet deep, yet above the Emperor\'s sleeping chamber alone there was none; all regarded it strange.',
    idiomatic: '"—and once snow piled feet deep while his roof alone stayed clear, to everyone\'s wonder.',
  },
  s0010: {
    literal: 'Xuanzong composed lyrics for "Music of the Far Borderland" with the line "Sea and mountains are tranquil—Xian is through."',
    idiomatic: 'Xuanzong\'s "Far Borderland" lyrics held the line "Sea and mountains tranquil—Xian through."',
  },
  s0011: {
    literal: 'Again near the end of Dazhong capital children stacked cloth, soaked it in water, twisted it toward the sun, and called it "drawing the halo."',
    idiomatic: 'Near Dazhong\'s end capital children twisted wet cloth sunward in a game called "drawing the halo."',
  },
  s0012: {
    literal: 'The Emperor indeed took the great throne as Prince of Yan and took Xian-tong as the era name.',
    idiomatic: 'He did ascend from Prince of Yan and took Xian-tong as his era.',
  },
  s0013: {
    literal: 'In the ninth month mourning dress was laid aside; the late mother Empress Chao was posthumously honored as empress dowager with posthumous title Yuanzhao.',
    idiomatic: 'In the ninth month mourning ended and Empress Chao became posthumous Yuanzhao.',
  },
  s0014: {
    literal: 'On guimou of the tenth month an order made Secretariat Vice Director, Acting Left Vice Director, and Grand Councillor Linghu Tao Grand Preceptor; Secretariat Vice Director, Minister of War, and Grand Councillor Xiao Ye Acting Right Vice Director; Secretariat Vice Director, Minister of Rites, and Grand Councillor Xiahou Zi also Minister of War; Secretariat Vice Director and Grand Councillor Jiang Shen also Minister of Works—all continuing in government.',
    idiomatic: 'On guimou the tenth month Linghu Tao, Xiao Ye, Xiahou Zi, and Jiang Shen were shuffled among grand posts while keeping council seats.',
  },
  s0015: {
    literal: 'Vice Minister of War Zheng Hao was made Henan prefect.',
    idiomatic: 'Zheng Hao became Henan prefect.',
  },
  s0016: {
    literal: 'Zhaoyi circuit military commissioner, Lu-Xing-Ci-Ming observation commissioner, Grand Preceptor of the Imperial Household, Acting Minister of Personnel, concurrent Lu prefect and grand protector, Supreme Pillar of State, Hedong county marquis with fief of five hundred households Pei Xiu was made Taiyuan prefect, northern capital defender, and Hedong circuit observation and disposition commissioner;',
    idiomatic: 'Pei Xiu left Zhaoyi for Taiyuan and Hedong command;',
  },
  s0017: {
    literal: 'Hezhong military commissioner, Acting Minister of the Left Bi Dan was made Bianzhou prefect, Xuanwu military and Song-Bo observation commissioner.',
    idiomatic: 'Bi Dan moved from Hezhong to Bianzhou and Xuanwu.',
  },
  s0018: {
    literal: 'Secretariat drafting officer Pei Tan was made acting director of the Rites examination.',
    idiomatic: 'Pei Tan oversaw the civil service examination.',
  },
  s0019: {
    literal: 'In the twelfth month Households Vice Minister and Hanlin academician Du Shenquan was made Acting Minister of Rites and Hezhong-Jin-Jiang circuit commissioner.',
    idiomatic: 'In the twelfth month Du Shenquan took Hezhong-Jin-Jiang.',
  },
  s0020: {
    literal: 'Xian-tong 1, spring, first month: the Emperor faced the court at Zichen Hall and received the Shiwei envoy.',
    idiomatic: 'Xian-tong 1 opened with audience for the Shiwei envoy at Zichen Hall.',
  },
  s0021: {
    literal: 'In the second month Emperor Xuanzong was buried at Zhen Mausoleum.',
    idiomatic: 'In the second month Xuanzong was buried at Zhen Mausoleum.',
  },
  s0022: {
    literal: 'Right Reminder Liu Ye was made Hanlin academician.',
    idiomatic: 'Liu Ye entered the Hanlin.',
  },
  s0023: {
    literal: 'Hezhong military commissioner Du Shenquan was made Vice Minister of War and revenue commissioner, soon Grand Councillor with his former title;',
    idiomatic: 'Du Shenquan rose from Hezhong to the council and revenue post;',
  },
  s0024: {
    literal: 'Secretariat Vice Director, Acting Grand Tutor, and Grand Councillor Linghu Tao was made Acting Grand Tutor and Grand Councillor and sent to command Hezhong;',
    idiomatic: 'Linghu Tao was posted to Hezhong;',
  },
  s0025: {
    literal: 'Minister of the Left and salt-and-iron transport commissioner Du Cong became Grand Councillor.',
    idiomatic: 'Du Cong joined the council from salt transport.',
  },
  s0026: {
    literal: 'Zhedong observation commissioner Wang Shi beheaded the grass-bandit Qiu Fu; all Zhedong prefectures were pacified.',
    idiomatic: 'Wang Shi beheaded Qiu Fu and pacified Zhedong.',
  },
  s0027: {
    literal: 'In the eighth month Hedong military commissioner Pei Xiu was made Fengxiang prefect and Fengxiang-Longyou commissioner; Fengxiang-Longyou commissioner, Silver-Gleam Grand Master, Acting Minister of Punishments Lu Jianqiu was made Taiyuan prefect, northern capital defender, and Hedong military commissioner.',
    idiomatic: 'Pei Xiu and Lu Jianqiu swapped Hedong and Fengxiang.',
  },
  s0028: {
    literal: 'In the eleventh month on bingwu the new moon fell.',
    idiomatic: 'The eleventh month\'s bingwu day was new moon.',
  },
  s0029: {
    literal: 'On dingwei the Emperor performed suburban and ancestral rites; when the rites ended he faced Danfeng Gate, proclaimed a great amnesty, and changed the era name.',
    idiomatic: 'On dingwei suburban rites ended with universal amnesty and the new era from Danfeng Gate.',
  },
  s0030: {
    literal: 'Secretariat drafting officer Xue Dan was made acting director of the examination.',
    idiomatic: 'Xue Dan oversaw the examination.',
  },
  s0031: {
    literal: 'Xian-tong 2, year Xian-tong 2 duplicated in the source—spring, second month: Minister of Personnel Xiao Ye was made Acting Right Vice Director, Taiyuan prefect, northern capital defender, and Hedong observation commissioner.',
    idiomatic: 'Xian-tong 2\'s second month sent Xiao Ye to Hedong as acting right vice director.',
  },
  s0032: {
    literal: 'Zheng-Hua military commissioner, Acting Minister of Works Li Fu memorialized: "Subordinate Yingzhou last summer suffered great rain; Shenqiu, Ru\'yin, and Ying shang counties had standing water one zhang deep—fields and houses were all submerged; we beg remission of tax and corvée."',
    idiomatic: 'Li Fu begged tax relief for Yingzhou after summer floods a zhang deep.',
  },
  s0033: {
    literal: 'It was approved.',
    idiomatic: 'The throne assented.',
  },
  s0034: {
    literal: 'Secretariat Vice Director and concurrent Minister of Works Jiang Shen was also made Minister of Punishments; Right Vice Director and Secretariat Vice Director Du Cong was made Left Vice Director, continuing in government.',
    idiomatic: 'Jiang Shen added punishments; Du Cong became left vice director.',
  },
  s0035: {
    literal: 'In the fourth month former Wuzhou prefect Pei Min was made Yingzhou prefect and regimental pacification commissioner.',
    idiomatic: 'Pei Min became Yingzhou prefect and pacifier.',
  },
  s0036: {
    literal: 'Director of the Imperial Stud Wang Duo was made drafting officer with concurrent duty.',
    idiomatic: 'Wang Duo gained drafting duties.',
  },
  s0037: {
    literal: 'In the eighth month Secretariat drafting officer Wei Zhu was made Vice Minister of Works.',
    idiomatic: 'Wei Zhu became vice minister of works.',
  },
  s0038: {
    literal: 'Soon he was changed to Silver-Gleam Grand Master, Acting Minister of Rites, concurrent Hua prefect, Censor-in-Chief, Commandant of the Imperial Son-in-Law\'s Mansion, and Yicheng military and Zheng-Hua-Ying observation commissioner.',
    idiomatic: 'Soon Wei Zhu took Hua and Yicheng with son-in-law and censor titles.',
  },
  s0039: {
    literal: 'Zhu\'s memorial stated: "By grace I was appointed Hua prefect; one character in the office title shares the sound of my family\'s taboo—though the graphs differ, the phonetics are hard to distinguish; I beg reassignment to an idle post."',
    idiomatic: 'Wei Zhu begged reassignment because "Hua" sounded like his family taboo.',
  },
  s0040: {
    literal: 'Edict: "Homophonic taboos are not observed—so ritual states; the appointment already issued cannot be withdrawn."',
    idiomatic: 'The edict refused: homophonic taboos do not block an issued appointment.',
  },
  s0041: {
    literal: 'Vice Minister of War Cao Que was made revenue commissioner; Vice Director of War Yang Zhiyuan and Vice Director of Merit Mu Renyu examined the macro-words civil candidates.',
    idiomatic: 'Cao Que took revenue; Yang Zhiyuan and Mu Renyu examined macro-words candidates.',
  },
  s0042: {
    literal: 'In the ninth month former Vice Minister of War and revenue commissioner Bi Dan was made Minister of Works and Grand Councillor.',
    idiomatic: 'Bi Dan joined the council as minister of works.',
  },
  s0043: {
    literal: 'Jiang Shen left government.',
    idiomatic: 'Jiang Shen left the council.',
  },
  s0044: {
    literal: 'Linyi barbarians raided Annan prefecture; Divine Strategy general Kang Chengshi was sent with forbidden troops and Jiangxi and Hunan forces to relieve it.',
    idiomatic: 'Linyi raided Annan; Kang Chengshi led relief with forbidden troops and Jiangxi-Hunan forces.',
  },
  s0045: {
    literal: 'Xian-tong 3, year Xian-tong 3 duplicated in the source—spring, first month: Left Vice Director, Secretariat Vice Director, and Grand Councillor Du Cong led the hundred officials in offering the honorific title Sage of Civil Brilliance and Filial Virtue.',
    idiomatic: 'Xian-tong 3 opened with Du Cong offering the honorific Sage of Civil Brilliance and Filial Virtue.',
  },
  s0046: {
    literal: 'In the fifth month an edict: "Lingnan has been divided into five commissions for many years.',
    idiomatic: 'A fifth-month edict reworked Lingnan defenses:',
  },
  s0047: {
    literal: 'In normal times they jointly bore defense; in emergencies arrangements must change.',
    idiomatic: '"In peace the five commissions shared defense; in crisis they must split."',
  },
  s0048: {
    literal: 'Yongzhou borders southern barbarians, lies deep in the Yellow Caves, controls the fierce customs of the two rivers, and holds roving people of many routes.',
    idiomatic: '"Yongzhou faces southern tribes and Yellow Caves between two rivers."',
  },
  s0049: {
    literal: 'Recently appointees were too light, military prestige did not flourish, and though the territory adjoins the interior it was not ranked with Hainan.',
    idiomatic: '"Light appointees left Yongzhou weak though inland."',
  },
  s0050: {
    literal: 'Lingnan should be divided into eastern and western circuit observation and disposition commissioners; Guangzhou for the eastern route, Yongzhou for the western—each to receive able officials with military commissions.',
    idiomatic: '"Split Lingnan into eastern (Guangzhou) and western (Yongzhou) circuits with strong commissioners."',
  },
  s0051: {
    literal: 'The eight prefectures under their jurisdiction do not farm silkworms; the land is utterly remote; recently ravaged by bandits they are especially desolate.',
    idiomatic: '"Eight remote, silkless prefectures lately ravaged need reinforcement."',
  },
  s0052: {
    literal: 'To strengthen the frontier wall prefectures and counties should be added.',
    idiomatic: '"Add prefectures to strengthen the frontier."',
  },
  s0053: {
    literal: 'Cut Gongzhou and Xiangzhou from Guizhou\'s jurisdiction and Tengzhou and Yanzhou from Rongzhou\'s jurisdiction and place them under the western route.',
    idiomatic: '"Attach Gong, Xiang, Teng, and Yan to the western circuit." Thus ended the edict.',
  },
  s0054: {
    literal: 'Grand Councillor Du Cong was also made Grand Preceptor; Bi Dan was also made Minister of War.',
    idiomatic: 'Du Cong added grand preceptor; Bi Dan added war minister.',
  },
  s0055: {
    literal: 'Director of the Imperial Stud and drafting officer Wang Duo was made Secretariat drafting officer.',
    idiomatic: 'Wang Duo became a drafting officer.',
  },
  s0056: {
    literal: 'Yong circuit defense commissioner Zheng Yu was made Guangzhou prefect and Lingnan eastern route commissioner;',
    idiomatic: 'Zheng Yu took Guangzhou and the eastern route;',
  },
  s0057: {
    literal: 'General Song Rong was made western route military commissioner.',
    idiomatic: 'Song Rong took the western route.',
  },
  s0058: {
    literal: 'In summer Huainan and Henan suffered locusts and drought; the people starved.',
    idiomatic: 'Summer brought locusts, drought, and famine in Huainan and Henan.',
  },
  s0059: {
    literal: 'Southern barbarians took Jiaozhi; troops from all circuits were levied for Lingnan.',
    idiomatic: 'Southern tribes took Jiaozhi and troops marched south.',
  },
  s0060: {
    literal: 'An edict ordered Hunan water transport up the Xiang into the Ling canal; Jiangxi to prepare chopped wheat gruel for the camps.',
    idiomatic: 'Hunan was to ship grain up the Xiang; Jiangxi to feed the camps with gruel.',
  },
  s0061: {
    literal: 'Upstream transport on the Xiang and Li was arduous; the Guangzhou garrison lacked food.',
    idiomatic: 'Upstream hauling failed and Guangzhou troops went hungry.',
  },
  s0062: {
    literal: 'Runzhou man Chen Pan-shi came to court with a memorial saying: "Jiangxi and Hunan haul grain upstream—it cannot supply the army; when soldiers\' food runs out they scatter—this must be deeply considered.',
    idiomatic: 'Runzhou\'s Chen Pan-shi warned that upstream grain hauls would starve and scatter the army.',
  },
  s0063: {
    literal: 'I have a strange plan to feed the southern army."',
    idiomatic: '"I have another plan to feed them."',
  },
  s0064: {
    literal: 'The Son of Heaven summoned him; Pan-shi then memorialized: "My younger brother Ting-si once served as Leizhou prefect; our household followed sea ships to Fujian—one large ship can carry a thousand dan; from Fujian loading, within one month it reaches Guangzhou.',
    idiomatic: 'Summoned, he said his brother knew a Fujian sea route—thousand-dan ships reaching Guangzhou within a month.',
  },
  s0065: {
    literal: 'With several dozen ships thirty thousand dan could reach Guang prefecture."',
    idiomatic: '"Dozens of ships could land thirty thousand dan at Guangzhou."',
  },
  s0066: {
    literal: 'He also cited Liu Yu\'s story of advancing by sea to break Lu Xun.',
    idiomatic: 'He cited Liu Yu\'s sea advance against Lu Xun.',
  },
  s0067: {
    literal: 'The councilors approved; Pan-shi was made salt-and-iron patrol officer to supervise sea transport at Yangzi Yard.',
    idiomatic: 'The council approved; Pan-shi supervised sea transport at Yangzi Yard.',
  },
  s0068: {
    literal: 'Thereafter Kang Chengshi\'s army was never short of supplies.',
    idiomatic: 'Kang Chengshi\'s army was never short again.',
  },
  s0069: {
    literal: 'In the seventh month the Xuzhou army mutinied; Zhedong observation commissioner Wang Shi was made Acting Minister of Works, Xuzhou prefect, Censor-in-Chief, and Wuning military and Xu-Si-Hao observation commissioner.',
    idiomatic: 'In the seventh month Xuzhou mutinied; Wang Shi was sent as Wuning commander.',
  },
  s0070: {
    literal: 'Earlier when Wang Zhi-xing took Xuzhou he recruited two thousand fierce stalwarts called Silver Blade, Carved Banner, Gate Lance, and Saddle Horse companies, rotating guard in the yamen city.',
    idiomatic: 'Zhi-xing had recruited two thousand Silver Blade and kindred companies for yamen guard.',
  },
  s0071: {
    literal: 'Afterward they grew insolent; military commissioners indulged them without leisure.',
    idiomatic: 'They grew insolent; commissioners indulged them.',
  },
  s0072: {
    literal: 'When Tian Mou governed Xu he often sat drinking mixed with the insolent troops, patting their backs when drunk and sometimes clapping a board to sing for them.',
    idiomatic: 'Tian Mou drank with them, patting backs and singing to them.',
  },
  s0073: {
    literal: 'Their daily expenses ran to ten thousand.',
    idiomatic: 'They cost ten thousand a day.',
  },
  s0074: {
    literal: 'At every guest feast they had to eat and drink their fill first; through cold, heat, and rain cups stood full before them—yet they still clamored and demanded, often plotting to expel commanders.',
    idiomatic: 'They feasted first at every banquet and often plotted to oust commanders.',
  },
  s0075: {
    literal: 'The year before, Shouzhou prefect Wen Zhang became military commissioner; the insolent troops knew Zhang was harsh and were deeply uneasy.',
    idiomatic: 'When harsh Wen Zhang came as commissioner the troops were uneasy.',
  },
  s0076: {
    literal: 'Zhang opened his heart to comfort them but was still distrusted; he gave food and drink yet they would not rinse their mouths; within a month they expelled Zhang.',
    idiomatic: 'Zhang tried kindness; they expelled him within a month.',
  },
  s0077: {
    literal: 'The Emperor therefore sent Shi to replace Zhang.',
    idiomatic: 'The throne sent Wang Shi to replace Zhang.',
  },
  s0078: {
    literal: 'At the time Shi with three thousand troops of Zhongwu and Yicheng had pacified Qiu Fu; he was ordered to lead both commands across the Huai.',
    idiomatic: 'Shi, having pacified Qiu Fu with Zhongwu and Yicheng troops, was ordered across the Huai.',
  },
  s0079: {
    literal: 'The Xu troops heard and feared his strength; they could do nothing.',
    idiomatic: 'Xu troops feared his strength and held back.',
  },
  s0080: {
    literal: 'At Great Peng Lodge they came out to welcome him.',
    idiomatic: 'At Great Peng Lodge they welcomed him.',
  },
  s0081: {
    literal: 'After three days he rewarded the two commands\' troops to return; once they donned armor and took weapons he ordered the insolent troops encircled and killed.',
    idiomatic: 'After three days he sent allied troops away, then encircled and slaughtered the insolent companies.',
  },
  s0082: {
    literal: 'More than three thousand Xu troops were executed that day; thus the violent were exterminated.',
    idiomatic: 'Over three thousand were killed that day—the violent were gone.',
  },
  s0083: {
    literal: 'In the ninth month Households Vice Minister Li Hui was made Acting Minister of Works, concurrent Xingyuan prefect, and Shannan West circuit commissioner.',
    idiomatic: 'Li Hui took Shannan West in the ninth month.',
  },
  s0084: {
    literal: 'In the eleventh month General Cai Xi led three thousand forbidden troops with all-circuit forces to relieve Annan.',
    idiomatic: 'Cai Xi led three thousand forbidden troops south in the eleventh month.',
  },
  s0085: {
    literal: 'Vice Minister of Personnel Zheng Chuhui, Xiao Fang, Vice Director of Personnel Yang Yan, and Vice Director of Households Cui Yanzhao examined the macro-words candidates.',
    idiomatic: 'Zheng Chuhui, Xiao Fang, Yang Yan, and Cui Yanzhao examined macro-words candidates.',
  },
  s0086: {
    literal: 'In the twelfth month Vice Minister of Personnel Xiao Fang was made acting director of the Rites examination.',
    idiomatic: 'Xiao Fang oversaw the examination in the twelfth month.',
  },
  s0087: {
    literal: 'Xian-tong 4, year Xian-tong 4 duplicated in the source—spring, first month, jiazi new moon.',
    idiomatic: 'Xian-tong 4 opened on jiazi.',
  },
  s0088: {
    literal: 'On gengwu the Emperor performed the Round Mound rite; when it ended he faced Danfeng Tower and proclaimed a great amnesty.',
    idiomatic: 'On gengwu the Round Mound rite ended with amnesty from Danfeng Tower.',
  },
  s0089: {
    literal: 'Inner and outer officials should follow the Jianzhong 1 edict: three days after receiving office each recommends one replacement.',
    idiomatic: 'Officials were to nominate successors per the Jianzhong precedent.',
  },
  s0090: {
    literal: 'Prefects and magistrates should record upper aides; in office they must complete three review cycles.',
    idiomatic: 'Prefects must record aides and serve three review cycles.',
  },
  s0091: {
    literal: 'Hedong military commissioner, Acting Minister of Punishments Lu Jianqiu begged leave for illness; he was ordered to retire as Junior Tutor of the Heir Apparent and return to the eastern capital.',
    idiomatic: 'Ill Lu Jianqiu retired to the eastern capital.',
  },
  s0092: {
    literal: 'Zhaoyi military commissioner, Acting Minister of Rites, Supreme Pillar of State, granted purple robe and golden fish bag Liu Tong was made Taiyuan prefect, northern capital defender, Censor-in-Chief, and Hedong observation commissioner.',
    idiomatic: 'Liu Tong took Hedong from Zhaoyi.',
  },
  s0093: {
    literal: 'In the second month Left Regular Attendant Li Xun was made Acting Minister of Works, Hua prefect, and Yicheng military and Zheng-Hua observation commissioner.',
    idiomatic: 'Li Xun took Hua and Yicheng in the second month.',
  },
  s0094: {
    literal: 'In the third month Vice Minister in the Ministry of War, revenue commissioner Yang Shou became Grand Councillor with his former title;',
    idiomatic: 'Yang Shou joined the council from revenue;',
  },
  s0095: {
    literal: 'Vice Minister of Punishments Cao Fen was made Henan prefect;',
    idiomatic: 'Cao Fen became Henan prefect;',
  },
  s0096: {
    literal: 'Households Vice Minister Li Pian was made Acting Minister of Rites, Lu grand protector, and Zhaoyi observation commissioner.',
    idiomatic: 'Li Pian took Zhaoyi.',
  },
  s0097: {
    literal: 'In the fourth month an edict: "When Annan first fell, refugees mostly lodged in stream caves.',
    idiomatic: 'An April edict on Annan refugees opened:',
  },
  s0098: {
    literal: 'Annan officers and soldiers who reached Haimen were not few; Song Rong and Li Liangyin should investigate numbers and relieve as appropriate.',
    idiomatic: '"Song Rong and Li Liangyin should count and relieve Annan officers reaching Haimen."',
  },
  s0099: {
    literal: 'Where barbarian bandits plundered within Annan, household two-tax and corvée cash should be remitted two years, with separate orders after recovery.',
    idiomatic: '"Remit two years\' tax where bandits plundered Annan."',
  },
  s0100: {
    literal: 'Stream-cave chiefs in Annan who long kept good faith—though barbarians held the walls each chief still guarded his territory.',
    idiomatic: '"Stream chiefs who kept faith though walls fell should be honored."',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
