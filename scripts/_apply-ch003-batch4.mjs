#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/003.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 301;
const END = 400;

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
  s0301: {
    literal:
      'On bingchen of the third month, Li You, Prince of Qi and military governor of Qizhou, killed Chief Administrator Quan Wanji and Army Inspector Wei Wenzhen, held Qizhou in defiance, and an edict ordered Li Jing, Minister of War, and Liu Dewei, Minister of Punishments, to raise troops and suppress him.',
    idiomatic:
      'On bingchen of the third month Prince of Qi Li You, governor of Qizhou, slew his chief administrator Quan Wanji and army inspector Wei Wenzhen and barricaded himself in the city; Li Jing, minister of war, and Liu Dewei, minister of punishments, were ordered to march against him.',
  },
  s0302: {
    literal:
      'Before the army arrived, Du Xingmin of the military staff seized him and surrendered; he was then ordered to take his own life in the Palace Domestic Service.',
    idiomatic:
      'The troops had not yet arrived when Du Xingmin of the military staff seized the prince and surrendered him; he was then granted death in the Palace Domestic Service.',
  },
  s0303: {
    literal: 'On dingsi, Mars held station before the Fore Star for nineteen days before withdrawing.',
    idiomatic:
      'On dingsi Mars lingered before the Fore Star for nineteen days before passing on.',
  },
  s0304: {
    literal:
      'On the first day of the fourth summer month, gengchen, the Crown Prince was found guilty and deposed to commoner status.',
    idiomatic:
      'On gengchen, the new moon of the fourth summer month, the crown prince was judged guilty and cast down to commoner rank.',
  },
  s0305: {
    literal:
      'Prince of Han Yuan Chang and Minister of the Civil Office Hou Junji were both implicated in the conspiracy and were executed.',
    idiomatic:
      'Prince of Han Yuan Chang and Hou Junji, minister of the civil office, were both condemned as accomplices and put to death.',
  },
  s0306: {
    literal:
      'On bingxu, Prince Jin Zhi was established as Crown Prince; a general amnesty was proclaimed and celebratory feasts granted for three days.',
    idiomatic:
      'On bingxu Prince Jin Li Zhi was made crown prince; he proclaimed a general amnesty and granted three days of public feasting.',
  },
  s0307: {
    literal: 'On dinghai, Chief Councillor Yang Shidao was appointed Minister of the Civil Office.',
    idiomatic: 'On dinghai Yang Shidao, chief councillor, was made minister of the civil office.',
  },
  s0308: {
    literal:
      'On jichou, the title of Grand Preceptor of the Crown Prince was added to Grand Mentor Zhangsun Wuji, Duke of Zhao, Grand Tutor to Fang Xuanling, Duke of Liang;',
    idiomatic:
      'On jichou Zhangsun Wuji, Duke of Zhao and grand mentor, was made grand preceptor of the crown prince; Fang Xuanling, Duke of Liang and grand tutor,',
  },
  s0309: {
    literal:
      'Special Emeritus Xiao Yu, Duke of Song, as Grand Protector; Li Jing, Duke of Ying, Minister of War, as Steward of the Heir Apparent, continuing as Associate of the Secretariat and Chancellery of the Third Rank.',
    idiomatic:
      'was joined by Xiao Yu, Duke of Song, as grand protector; and Li Jing, Duke of Ying and minister of war, as steward of the heir apparent, still serving as associate of the secretariat and chancellery of the third rank.',
  },
  s0310: {
    literal:
      'On gengyin, the Emperor personally visited the Imperial Ancestral Temple to atone for Chengqian\'s offenses.',
    idiomatic:
      'On gengyin the emperor went in person to the ancestral temple to answer for Chengqian\'s crimes.',
  },
  s0311: {
    literal: 'On guisi, Prince of Wei Tai was demoted for his crimes to Duke of Donglai.',
    idiomatic: 'On guisi Prince of Wei Li Tai was stripped of rank for his crimes and made Duke of Donglai.',
  },
  s0312: {
    literal:
      'In the fifth month, on yichou, by imperial autograph he summoned filial, eminent, and exceptionally talented men.',
    idiomatic:
      'On yichou of the fifth month he issued a personal edict calling up men of filial virtue, eminent talent, and exceptional ability.',
  },
  s0313: {
    literal: 'On the first day of the sixth month, jimao, there was an eclipse of the sun.',
    idiomatic: 'On jimao, the new moon of the sixth month, the sun was eclipsed.',
  },
  s0314: {
    literal: 'On renwu, the Sui Emperor Gong was reburied.',
    idiomatic: 'On renwu the Sui emperor Gong was given a new burial.',
  },
  s0315: {
    literal:
      'On dingyou, Vice Director of the Chancellery Gao Shilian requested retirement; he was appointed Director with honors equal to the Third Rank at the Secretariat and Chancellery.',
    idiomatic:
      'On dingyou Gao Shilian, vice director of the chancellery, asked to retire and was made director with the honorary rank of third grade at the secretariat and chancellery.',
  },
  s0316: {
    literal:
      'In the intercalary month, on wuwu, Xueyantuo sent his elder brother\'s son Tulishe with fifty thousand horses, ten thousand oxen and camels, and one hundred thousand sheep to request a marriage alliance; permission was granted.',
    idiomatic:
      'On wuwu of the intercalary month Xueyantuo sent the qaghan\'s nephew Tulishe with fifty thousand horses, ten thousand oxen and camels, and a hundred thousand sheep to sue for a marriage alliance, which was granted.',
  },
  s0317: {
    literal: 'On bingzi, Prince of Donglai Tai was transferred to Duke of Shunyang.',
    idiomatic: 'On bingzi Duke of Donglai Li Tai was transferred to Duke of Shunyang.',
  },
  s0318: {
    literal:
      'In the seventh autumn month, on gengchen, wild rumors in the capital said: "The Emperor has sent his heart-snatchers to take people\'s hearts and livers to sacrifice to the Heavenly Dog.',
    idiomatic:
      'On gengchen of the seventh autumn month a wild rumor ran through Chang\'an: "The emperor has sent his heart-snatchers to cut out men\'s hearts and livers as offerings to the Heavenly Dog.',
  },
  s0319: {
    literal: '" Alarm spread from person to person.',
    idiomatic: '" Panic passed from mouth to mouth.',
  },
  s0320: {
    literal:
      'The Emperor sent emissaries to proclaim reassurance throughout; only after more than a month did it cease.',
    idiomatic:
      'He sent envoys to reassure the people everywhere; more than a month passed before the uproar died away.',
  },
  s0321: {
    literal:
      'On dingyou, Fang Xuanling, Duke of Liang, Grand Tutor of the Heir Apparent, left office on account of mourning for his mother.',
    idiomatic:
      'On dingyou Fang Xuanling, Duke of Liang and grand tutor of the heir apparent, left office to mourn his mother.',
  },
  s0322: {
    literal:
      'In the eighth month, Zhang Liang, Duke of Zhen, Minister of Works, was made Minister of Punishments and joined in deliberating on government.',
    idiomatic:
      'In the eighth month Zhang Liang, Duke of Zhen and minister of works, became minister of punishments and took a seat in court deliberations.',
  },
  s0323: {
    literal: 'On guawei of the ninth month, the deposed Chengqian was relocated to Qian prefecture.',
    idiomatic: 'On guawei of the ninth month the deposed Chengqian was sent into exile at Qian prefecture.',
  },
  s0324: {
    literal: 'In the tenth winter month, on dingsi, Fang Xuanling returned from mourning to his former office.',
    idiomatic: 'On dingsi of the tenth winter month Fang Xuanling returned from mourning to his former post.',
  },
  s0325: {
    literal: 'On jimao of the eleventh month, the southern suburban sacrifice was performed.',
    idiomatic: 'On jimao of the eleventh month he performed the southern suburban sacrifice.',
  },
  s0326: {
    literal: 'On rewu, celebratory feasts were granted throughout the realm for three days.',
    idiomatic: 'On rewu he granted three days of public feasting throughout the realm.',
  },
  s0327: {
    literal:
      'Because an auspicious stone was obtained in Liangzhou, a partial amnesty was granted there; prisoners in the capital and in all prefectures were reviewed, and many were pardoned.',
    idiomatic:
      'When an auspicious stone was found in Liangzhou he granted a partial amnesty there and reviewed prisoners in the capital and in every prefecture, pardoning many.',
  },
  s0328: {
    literal: 'In spring of the eighteenth year of Zhenguan, on renyin of the first month, he went to the hot springs.',
    idiomatic: 'In the eighteenth year of Zhenguan, on renyin of the first spring month, he went to the hot springs.',
  },
  s0329: {
    literal: 'In the fourth summer month, on xinhai, he went to Jiucheng Palace.',
    idiomatic: 'On xinhai of the fourth summer month he went to Jiucheng Palace.',
  },
  s0330: {
    literal: 'On jiazi of the eighth autumn month, he returned from Jiucheng Palace.',
    idiomatic: 'On jiazi of the eighth autumn month he returned from Jiucheng Palace.',
  },
  s0331: {
    literal:
      'On dingmao, Palace Attendant Liu Ji was made Attending Secretary; Vice Directors of the Secretariat Cen Wuben and Ma Zhou were both made Secretaries of State.',
    idiomatic:
      'On dingmao Liu Ji, palace attendant and Baron of Qingyuan, was made attending secretary; Cen Wuben and Ma Zhou, vice directors of the secretariat, were both made secretaries of state.',
  },
  s0332: {
    literal: 'In the ninth month, Vice Director of the Gate Huangmen Chu Suiliang joined in deliberating on government.',
    idiomatic: 'In the ninth month Chu Suiliang, vice director of the yellow gate, joined in court deliberations.',
  },
  s0333: {
    literal: 'On xinchou, first day of the tenth winter month, there was a solar eclipse.',
    idiomatic: 'On xinchou, the new moon of the tenth winter month, the sun was eclipsed.',
  },
  s0334: {
    literal: 'On jiachen, the office of Admonisher of the Heir Apparent was established for the first time.',
    idiomatic: 'On jiachen the office of admonisher of the heir apparent was established for the first time.',
  },
  s0335: {
    literal: 'On jiayin, he proceeded to Luoyang Palace.',
    idiomatic: 'On jiayin he went to Luoyang Palace.',
  },
  s0336: {
    literal:
      'Protector-General of the Pacified West Guo Xiaoke led troops and destroyed Yanqi, seized its king Tutuizhi, and sent him to the imperial camp.',
    idiomatic:
      'Guo Xiaoke, protector-general of the pacified west, led an army that destroyed Yanqi, seized King Tutuizhi, and sent him to the imperial camp.',
  },
  s0337: {
    literal: 'On renyin of the eleventh month, the imperial carriage reached Luoyang Palace.',
    idiomatic: 'On renyin of the eleventh month the imperial carriage reached Luoyang Palace.',
  },
  s0338: {
    literal:
      'On gengzi, Steward Li Jing, Duke of Ying, was appointed campaign commander on the Liaodong circuit, setting out from Liucheng, with Minister of Rites Prince Daozong of Jiangxia as deputy;',
    idiomatic:
      'On gengzi Li Jing, Duke of Ying and steward of the heir apparent, was made campaign commander on the Liaodong circuit, marching from Liucheng, with Prince Daozong of Jiangxia, minister of rites, as his deputy;',
  },
  s0339: {
    literal:
      'Zhang Liang, Duke of Zhen, Minister of Punishments, was commander on the Pyongyang circuit with naval forces out of Laizhou, with Left Army General Chang He and Military Governor of Luzhou Zuo Nandang as deputies.',
    idiomatic:
      'and Zhang Liang, Duke of Zhen and minister of punishments, commander on the Pyongyang circuit with a fleet out of Laizhou, with Chang He of the left army and Zuo Nandang, governor of Luzhou, as his deputies.',
  },
  s0340: {
    literal:
      'Armored men were mobilized throughout the realm; one hundred thousand were recruited, all converging on Pyongyang to attack Goguryeo.',
    idiomatic:
      'Armored men were levied throughout the realm and a hundred thousand recruits were raised, all hurrying to Pyongyang for the campaign against Goguryeo.',
  },
  s0341: {
    literal: 'On xinchou of the twelfth month, the deposed Chengqian died.',
    idiomatic: 'On xinchou of the twelfth month the deposed Chengqian died.',
  },
  s0342: {
    literal:
      'In spring of the nineteenth year of Zhenguan, on gengxu of the second month, the Emperor personally led the Six Armies and set out from Luoyang.',
    idiomatic:
      'In the nineteenth year of Zhenguan, on gengxu of the second spring month, the emperor personally led the Six Armies out of Luoyang.',
  },
  s0343: {
    literal: 'On yimao, an edict ordered the Crown Prince to remain at Dingzhou to oversee the realm;',
    idiomatic: 'On yimao he decreed that the crown prince remain at Dingzhou to oversee the realm;',
  },
  s0344: {
    literal:
      'Gao Shilian, Duke of Shen, acting Grand Tutor, with Attending Secretary Liu Ji, Secretary Ma Zhou, Junior Steward Zhang Xingcheng, and Right Assistant to the Heir Gao Jifu — five men jointly handled state affairs;',
    idiomatic:
      'Gao Shilian, Duke of Shen, acting grand tutor, with Liu Ji, Ma Zhou, Zhang Xingcheng, and Gao Jifu — five men in all — were to handle state affairs together;',
  },
  s0345: {
    literal: 'Yang Shidao, Duke of Ande, Minister of the Civil Office, was made Secretary of State.',
    idiomatic: 'and Yang Shidao, Duke of Ande and minister of the civil office, was made secretary of state.',
  },
  s0346: {
    literal:
      'Bi Gan of Yin was posthumously made Grand Tutor with the posthumous name Loyal and Stern; authorities were ordered to seal his tomb, repair his shrine, sacrifice with lesser victim each spring and autumn; the Emperor himself composed a text and offered sacrifice.',
    idiomatic:
      'Bi Gan of Yin was posthumously made grand tutor with the posthumous name Loyal and Stern; the authorities were ordered to seal his tomb, repair his shrine, and sacrifice each spring and autumn with the lesser victim; the emperor himself composed a text and offered sacrifice.',
  },
  s0347: {
    literal:
      'On renchen of the third month, he set out from Dingzhou with Zhangsun Wuji, Grand Preceptor and Examining Attending Secretary, and Secretaries Cen Wuben and Yang Shidao in attendance.',
    idiomatic:
      'On renchen of the third month he marched from Dingzhou with Zhangsun Wuji, grand preceptor and examining attending secretary, and the secretaries Cen Wuben and Yang Shidao in his train.',
  },
  s0348: {
    literal:
      'On guimao of the fourth summer month, he took the army oath south of Youzhou city and thereupon feasted the Six Armies on a grand scale before sending them forth.',
    idiomatic:
      'On guimao of the fourth summer month he swore in the army south of Youzhou and thereupon feasted the Six Armies on a grand scale before sending them forth.',
  },
  s0349: {
    literal: 'On dingwei, Secretary Cen Wuben died with the army.',
    idiomatic: 'On dingwei Cen Wuben, secretary of state, died on campaign.',
  },
  s0350: {
    literal: 'On guihai, Campaign Commander Li Jing attacked and took Gaimou city.',
    idiomatic: 'On guihai Li Jing, campaign commander, attacked and took Gaimou.',
  },
  s0351: {
    literal: 'On dingchou of the fifth month, the imperial carriage crossed the Liao.',
    idiomatic: 'On dingchou of the fifth month the imperial carriage crossed the Liao.',
  },
  s0352: {
    literal:
      'On jiashen, the Emperor personally led iron cavalry to join Li Jing in investing Liaodong city; taking advantage of a violent wind he loosed fire-bolts, and in an instant buildings and towers on the walls were consumed; he commanded the warriors to climb, and the city was taken.',
    idiomatic:
      'On jiashen the emperor led his iron cavalry to join Li Jing in investing Liaodong; riding a fierce wind he loosed fire-bolts, and in a breath the towers and roofs on the wall were ash; he ordered the men up the ladders and the city fell.',
  },
  s0353: {
    literal: 'On bingchen of the sixth month, the army reached Anshi city.',
    idiomatic: 'On bingchen of the sixth month the army reached Anshi.',
  },
  s0354: {
    literal:
      'On dingsi, Goguryeo lieutenant generals Gao Yanshou and Gao Huizhen led one hundred fifty thousand men to relieve Anshi and resist the royal army.',
    idiomatic:
      'On dingsi the Goguryeo generals Gao Yanshou and Gao Huizhen led a hundred and fifty thousand men to relieve Anshi and bar the imperial army.',
  },
  s0355: {
    literal:
      'Li Jing led troops in fierce attack; the Emperor brought his army down from the heights to press them; Goguryeo collapsed in rout; kills and captures were beyond counting.',
    idiomatic:
      'Li Jing led a furious charge; the emperor brought his men down from the heights to press the enemy; Goguryeo broke and fled; the slain and captured were beyond reckoning.',
  },
  s0356: {
    literal:
      'Yanshou and the others surrendered with their forces; the mountain where the Emperor had lodged was therefore named Mount Imperial Sojourn, and stone was carved to record the achievement.',
    idiomatic:
      'Yanshou and his men surrendered with their host; the mountain where the emperor had halted was therefore named Mount Imperial Sojourn, and stone was carved to record the deed.',
  },
  s0357: {
    literal: 'Great celebratory feasts were granted throughout the realm for two days.',
    idiomatic: 'He granted two days of public feasting throughout the realm.',
  },
  s0358: {
    literal:
      'In the seventh autumn month Li Jing pressed the attack on Anshi city; by the ninth month it had not fallen, and the army withdrew.',
    idiomatic:
      'In the seventh autumn month Li Jing pressed the siege of Anshi; by the ninth month the city had not fallen, and the army withdrew.',
  },
  s0359: {
    literal:
      'On bingchen of the tenth winter month, they entered Linyu Pass; the Crown Prince came from Dingzhou to welcome and pay homage.',
    idiomatic:
      'On bingchen of the tenth winter month the army entered Linyu Pass; the crown prince came from Dingzhou to welcome the emperor.',
  },
  s0360: {
    literal: 'On wuwu, they halted at Hanwu Terrace and carved stone to record the merit.',
    idiomatic: 'On wuwu he halted at Hanwu Terrace and had stone carved to record his merit.',
  },
  s0361: {
    literal: 'On xinwei of the eleventh month, he proceeded to Youzhou.',
    idiomatic: 'On xinwei of the eleventh month he went to Youzhou.',
  },
  s0362: {
    literal: 'On guiyou, a grand feast was held and the army returned.',
    idiomatic: 'On guiyou he held a grand feast and the army marched home.',
  },
  s0363: {
    literal: 'On wushen of the twelfth month, he proceeded to Bingzhou.',
    idiomatic: 'On wushen of the twelfth month he went to Bingzhou.',
  },
  s0364: {
    literal: 'Liu Ji, Attending Secretary and Baron of Qingyuan, was ordered to die for his crimes.',
    idiomatic: 'Liu Ji, attending secretary and Baron of Qingyuan, was ordered to die for his crimes.',
  },
  s0365: {
    literal: 'That year Zhenzhu Pijia Qaghan of Xueyantuo died.',
    idiomatic: 'That year Zhenzhu Pijia, qaghan of Xueyantuo, died.',
  },
  s0366: {
    literal: 'In spring of the twentieth year of Zhenguan, the Emperor was at Bingzhou.',
    idiomatic: 'In the twentieth year of Zhenguan, in spring, the emperor was at Bingzhou.',
  },
  s0367: {
    literal:
      'On dingchou, Director of the Court of Judicature Sun Fuga and Vice Director of the Gate Chu Suiliang with twenty-two others were sent to inspect the four quarters under the Six Regulations, promoting and demoting officials.',
    idiomatic:
      'On dingchou Sun Fuga, director of the court of judicature, and Chu Suiliang, vice director of the yellow gate, with twenty-two others were sent to tour the four quarters under the Six Regulations and promote or demote officials.',
  },
  s0368: {
    literal:
      'On gengchen, a partial amnesty for Bingzhou; he feasted the attending officials and the original founding followers, granting grain, silk, and tax exemptions in graded amounts.',
    idiomatic:
      'On gengchen he granted a partial amnesty to Bingzhou, feasted the officials in his train and the men who had risen with him at the founding, and gave graded gifts of grain, silk, and exemptions from corvée.',
  },
  s0369: {
    literal: 'On jisi of the third month, the imperial carriage reached the capital.',
    idiomatic: 'On jisi of the third month the imperial carriage reached the capital.',
  },
  s0370: {
    literal: 'On jichou, Zhang Liang, Duke of Zheng, Minister of Punishments, plotted rebellion and was executed.',
    idiomatic: 'On jichou Zhang Liang, Duke of Zheng and minister of punishments, plotted rebellion and was put to death.',
  },
  s0371: {
    literal: 'On guisi, first day of the intercalary month, there was a solar eclipse.',
    idiomatic: 'On guisi, the new moon of the intercalary month, the sun was eclipsed.',
  },
  s0372: {
    literal:
      'On jiazi of the fourth summer month, Zhangsun Wuji, Fang Xuanling, and Xiao Yu each resigned their posts as tutors and protectors of the heir apparent; the request was granted.',
    idiomatic:
      'On jiazi of the fourth summer month Zhangsun Wuji, Fang Xuanling, and Xiao Yu each asked to be released from tutoring and protecting the heir apparent, and the request was granted.',
  },
  s0373: {
    literal:
      'In the sixth month, Cui Dunli, Duke of Gu\'an, Minister of War, and Li Jing, Duke of Ying, Special Emeritus, were sent and defeated Xueyantuo north of Mount Yudujun; in all more than five thousand heads were taken before and after, and men and women captives numbering more than thirty thousand.',
    idiomatic:
      'In the sixth month Cui Dunli, Duke of Gu\'an and minister of war, and Li Jing, Duke of Ying and special emeritus, were sent and broke Xueyantuo north of Mount Yudujun, taking more than five thousand heads in all and more than thirty thousand men and women captive.',
  },
  s0374: {
    literal: 'On jiazi of the eighth autumn month, an imperial grandson was enfeoffed as Prince of Chen.',
    idiomatic: 'On jiazi of the eighth autumn month an imperial grandson was enfeoffed as Prince of Chen.',
  },
  s0375: {
    literal: 'On jisi, he proceeded to Lingzhou.',
    idiomatic: 'On jisi he went to Lingzhou.',
  },
  s0376: {
    literal: 'On gengwu, he halted at the Jingyang encampment.',
    idiomatic: 'On gengwu he halted at the Jingyang encampment.',
  },
  s0377: {
    literal:
      'Eleven tribes of the Tiele — Uighur, Bayegu, Tongluo, Pugu, Duolange, Sijie, Adie, Qibi, Diejie, Hun, and Husse — each sent envoys with tribute, memorializing: "The Yantuo qaghan does not serve the great state; his tribes have scattered like birds and none knows where they have gone.',
    idiomatic:
      'Eleven Tiele tribes — the Uighur, Bayegu, Tongluo, Pugu, Duolange, Sijie, Adie, Qibi, Diejie, Hun, and Husse — each sent envoys with tribute, saying: "The Yantuo qaghan will not serve the great state; his tribes have scattered like birds and no one knows where they have gone.',
  },
  s0378: {
    literal:
      'We each have our allotted lands and cannot follow the Yantuo away; we submit to the Son of Heaven and beg that Han officials be appointed.',
    idiomatic:
      'We each hold our own lands and cannot follow the Yantuo into exile; we submit to the Son of Heaven and beg that Han officials be set over us.',
  },
  s0379: {
    literal: '" An edict ordered them to assemble at Lingzhou.',
    idiomatic: '" He decreed that they assemble at Lingzhou.',
  },
  s0380: {
    literal:
      'On jiachen of the ninth month, thousands of envoys from the Tiele tribes — ilkins, eltebers, and the like — arrived in succession at Lingzhou, bearing regional products and requesting the appointment of officials; all asked that the Sovereign become qaghan.',
    idiomatic:
      'On jiachen of the ninth month thousands of Tiele envoys — ilkins, eltebers, and the like — came in succession to Lingzhou with regional tribute, asked for the appointment of officials, and all begged that the sovereign be made qaghan.',
  },
  s0381: {
    literal:
      'Thereupon the northern wilds were entirely pacified; he composed a pentasyllabic poem and carved it on stone to narrate the affair.',
    idiomatic:
      'The northern wilds were thereby pacified; he composed a pentasyllabic poem and had it carved on stone to tell the story.',
  },
  s0382: {
    literal: 'On xinhai, Lingzhou experienced an earthquake with audible sounds.',
    idiomatic: 'On xinhai Lingzhou was shaken by an earthquake that could be heard.',
  },
  s0383: {
    literal: 'In the tenth winter month, Xiao Yu, former Grand Protector, Duke of Song, was demoted to Prefect of Shangzhou.',
    idiomatic:
      'In the tenth winter month Xiao Yu, former grand protector and Duke of Song, was demoted to prefect of Shangzhou.',
  },
  s0384: {
    literal: 'On bingxu, he returned from Lingzhou.',
    idiomatic: 'On bingxu he returned from Lingzhou.',
  },
  s0385: {
    literal:
      'In spring of the twenty-first year of Zhenguan, on renchen of the first month, Gao Shilian, Duke of Shen, Director with honors, died.',
    idiomatic:
      'In the twenty-first year of Zhenguan, on renchen of the first spring month, Gao Shilian, Duke of Shen and director with honors, died.',
  },
  s0386: {
    literal: 'On dingyou, an edict ordered that the feng and shan rites at Mount Tai be performed in the second month of the coming year.',
    idiomatic:
      'On dingyou he decreed that the feng and shan rites at Mount Tai be performed in the second month of the coming year.',
  },
  s0387: {
    literal: 'On jiayin, celebratory feasts were granted in the capital for three days.',
    idiomatic: 'On jiayin he granted three days of public feasting in the capital.',
  },
  s0388: {
    literal:
      'On renshen of the second month, an edict named twenty-one scholars — Zuoqiu Ming, Bu Zixia, Gongsun Gao, Guliang Chi, Fu Sheng, Master Gaotang, Dai Sheng, Mao Chang, Kong Anguo, Liu Xiang, Zheng Zhong, Du Zichun, Ma Rong, Lu Zhi, Zheng Xuan, Fu Qian, He Xiu, Wang Su, Wang Bi, Du Yu, and Fan Ning — their works to be used in place of originals, transmitted to the imperial academies; from now on at Grand Academy ceremonies all were ordered to share sacrificial honors in the Confucian temple.',
    idiomatic:
      'On renshen of the second month he decreed that twenty-one scholars — from Zuoqiu Ming to Fan Ning — should have their books used in the imperial academies in place of the old texts, and that from this time forward, whenever rites were performed at the Grand Academy, all were to share sacrificial honors in the temple of Confucius.',
  },
  s0389: {
    literal: 'On dingchou, the Crown Prince performed the vegetable-offering rite at the National University.',
    idiomatic: 'On dingchou the crown prince performed the vegetable-offering rite at the National University.',
  },
  s0390: {
    literal:
      'On yichou of the fourth summer month, Taihe Palace was built on Mount Zhongnan; its name was changed to Cuiwei Palace.',
    idiomatic:
      'On yichou of the fourth summer month Taihe Palace was built on Mount Zhongnan and renamed Cuiwei Palace.',
  },
  s0391: {
    literal: 'On wuzi of the fifth month, he proceeded to Cuiwei Palace.',
    idiomatic: 'On wuzi of the fifth month he went to Cuiwei Palace.',
  },
  s0392: {
    literal:
      'On guihai of the sixth month, Zhangsun Wuji, Duke of Zhao, Grand Tutor, was additionally appointed military governor of Yangzhou.',
    idiomatic:
      'On guihai of the sixth month Zhangsun Wuji, Duke of Zhao and grand tutor, was additionally made military governor of Yangzhou.',
  },
  s0393: {
    literal: 'On gengzi of the seventh autumn month, Yuhua Palace was built in Phoenix Valley, Yijun county.',
    idiomatic: 'On gengzi of the seventh autumn month Yuhua Palace was built in Phoenix Valley in Yijun county.',
  },
  s0394: {
    literal: 'On gengxu, he returned from Cuiwei Palace.',
    idiomatic: 'On gengxu he returned from Cuiwei Palace.',
  },
  s0395: {
    literal: 'On renxu of the eighth month, an edict announced that because of great floods in Hebei, the fengshan ceremony was suspended.',
    idiomatic:
      'On renxu he decreed that because of great floods in Hebei the fengshan ceremony was suspended.',
  },
  s0396: {
    literal: 'On xinwei, the state of Guligan sent envoys presenting famous horses.',
    idiomatic: 'On xinwei the state of Guligan sent envoys with famous horses as tribute.',
  },
  s0397: {
    literal: 'On dingyou, Prince Ming was enfeoffed as Prince of Cao.',
    idiomatic: 'On dingyou Prince Ming was enfeoffed as Prince of Cao.',
  },
  s0398: {
    literal: 'On guimao of the eleventh winter month, Prince of Shunyang Tai was transferred to Prince of Pu.',
    idiomatic: 'On guimao of the eleventh winter month Prince of Shunyang Li Tai was transferred to Prince of Pu.',
  },
  s0399: {
    literal:
      'On wuyin of the twelfth month, Ashina She\'er, Great General of the Left Valiant Guards, Qibi Heli, Great General of the Right Valiant Guards, Guo Xiaoke, Protector-General of the Pacified West, and Yang Hongli, Director of the Court of the Granary, were made commanders on the Guanshan circuit to attack Kucha.',
    idiomatic:
      'On wuyin of the twelfth month Ashina She\'er, great general of the left valiant guards, Qibi Heli, great general of the right valiant guards, Guo Xiaoke, protector-general of the pacified west, and Yang Hongli, director of the court of the granary, were made commanders on the Guanshan circuit to attack Kucha.',
  },
  s0400: {
    literal:
      'That year, nineteen distant states — including Fallen Demon Ascension, Yili, Nose Forest Delivery, Dubo, Yangtong, the Shi state, Persia, Kang, Tocharistan, and Ashiji — all sent envoys with tribute.',
    idiomatic:
      'That year nineteen distant peoples — among them Jabung, Yili, Bilinsong, Dubo, Yangtong, Shi, Persia, Kang, Tocharistan, and Ashiji — all sent envoys with tribute.',
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
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s0301–s0400).`
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
console.log('Applied', applied, 'translations (s0301–s0400) to', transPath);
