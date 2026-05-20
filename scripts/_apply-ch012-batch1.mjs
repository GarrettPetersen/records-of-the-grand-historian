#!/usr/bin/env node
/** Batch 1: s0001–s0100 (Jiutangshu ch.012, Dezong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
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
    literal: "Dezong 1 — Emperor Dezong, posthumous title Divine Martial Filial Literary, bore the taboo name Shi; he was Daizong's eldest son; his mother was Empress Ruizhen of the Shen clan.",
    idiomatic: "Dezong — styled Divine Martial Filial Literary, taboo name Shi — was Daizong's eldest son; his mother was Empress Ruizhen (née Shen).",
  },
  s0002: {
    literal: "On guisi of the fourth month of Tianbao 1 he was born at the Eastern Palace within the Great Inner of Chang'an.",
    idiomatic: "He was born on guisi in the fourth month, Tianbao 1, at the Eastern Palace in Chang'an.",
  },
  s0003: {
    literal: "In the twelfth month of that year he was appointed Special Eminent Grandee and enfeoffed Prince of Fengjie commandery.",
    idiomatic: "That winter he became Special Eminent Grandee and Prince of Fengjie.",
  },
  s0004: {
    literal: "In the fifth month of the year Daizong took the throne, the Prince was made commander-in-chief of all armies under Heaven and re-enfeoffed Prince of Lu.",
    idiomatic: "When Daizong acceded in the fifth month, the prince became supreme commander and Prince of Lu.",
  },
  s0005: {
    literal: "In the eighth month he was re-enfeoffed Prince of Yong.",
    idiomatic: "In the eighth month his title became Prince of Yong.",
  },
  s0006: {
    literal: "At that time Shi Chaoyi held the Eastern Capital; in the tenth month the Prince was sent to assemble the armies at Shaanzhou for a great campaign against the rebels.",
    idiomatic: "With Chaoyi in Luoyang, in the tenth month the prince gathered the hosts at Shaanzhou to crush the rebels.",
  },
  s0007: {
    literal: "In the eleventh month the rebels were defeated at Luoyang; he advanced to recover the Eastern Capital and Henan was pacified.",
    idiomatic: "In the eleventh month he shattered the rebels at Luoyang, retook the eastern capital, and pacified Henan.",
  },
  s0008: {
    literal: "Chaoyi fled to Hebei.",
    idiomatic: "Chaoyi fled north into Hebei.",
  },
  s0009: {
    literal: "He separately ordered the generals to pursue; soon the rebel general Huaixian cut off Chaoyi's head and presented it — Hebei was pacified.",
    idiomatic: "Generals pursued him; Huaixian soon sent Chaoyi's head and Hebei submitted.",
  },
  s0010: {
    literal: "For merit as commander-in-chief he was appointed Minister over the Masses, with a substantive fief of two thousand households; with Guo Ziyi and seven others his likeness was painted in the Lingyan Pavilion.",
    idiomatic: "For commanding the campaign he became Minister over the Masses with two thousand households' fief, and joined Guo Ziyi and seven others on the Lingyan rolls.",
  },
  s0011: {
    literal: "In the second month of Guangde 2 he was established as crown prince.",
    idiomatic: "In Guangde 2's second month he was made crown prince.",
  },
  s0012: {
    literal: "Dali 14 — Dali 14, fifth month, xinyou: Daizong died. (The reign year is duplicated in the source.)",
    idiomatic: "In the fifth month of Dali 14, on xinyou, Daizong died.",
  },
  s0013: {
    literal: "On guihai he took the throne in the Hall of Supreme Ultimate.",
    idiomatic: "On guihai he ascended the throne in the Hall of Supreme Ultimate.",
  },
  s0014: {
    literal: "In the intercalary month, on renshen, Secretariat Drafter Cui Youfu was demoted to Henan vice prefect.",
    idiomatic: "Intercalary month, renshen: Cui Youfu was demoted to Henan vice prefect.",
  },
  s0015: {
    literal: "On jiaxu Gate Department Vice Director and Grand Secretariat Associate Chang Gun was demoted to Chaozhou prefect.",
    idiomatic: "On jiaxu Chang Gun lost his chancellorship and became Chaozhou prefect.",
  },
  s0016: {
    literal: "Cui Youfu was summoned as Gate Department Vice Director and Grand Secretariat Associate of equal rank.",
    idiomatic: "Youfu was recalled as vice director of the Gate Department and chancellor.",
  },
  s0017: {
    literal: "On bingzi an edict halted annual tribute of hawks and falcons from all prefectures, Silla, and Parhae.",
    idiomatic: "On bingzi tribute hawks and falcons from the provinces, Silla, and Parhae were abolished.",
  },
  s0018: {
    literal: "On wuyin an edict stated: Shannan loquats and Jiangnan mandarins — one tribute per year for the ancestral temples; all other such tribute was halted.",
    idiomatic: "On wuyin only Shannan loquats and Jiangnan citrus were kept, once yearly for the temples; the rest stopped.",
  },
  s0019: {
    literal: "On gengyin Minister of War Lu Sijing was made Eastern Capital commandant; Changzhou prefect Xiao Fu was made Tanzhou prefect and Hunan training-and-observation commissioner.",
    idiomatic: "On gengyin Lu Sijing became Luoyang commandant; Xiao Fu became Hunan commissioner from Changzhou.",
  },
  s0020: {
    literal: "On xinsi the annual tribute of slave girls from Yong prefecture was abolished.",
    idiomatic: "On xinsi Yong's annual tribute of slave girls ended.",
  },
  s0021: {
    literal: "On guiwei Kuozhou was renamed Chuzhou; Kuocang county became Lishui county.",
    idiomatic: "On guiwei Kuozhou became Chuzhou and Kuocang became Lishui.",
  },
  s0022: {
    literal: "The Pear Garden commissioner and three hundred supernumerary performers were abolished; those retained were placed under the Court of Imperial Sacrifices.",
    idiomatic: "The Pear Garden office and three hundred spare performers were cut; survivors went to the Court of Sacrifices.",
  },
  s0023: {
    literal: "The ten hu of spring wine annually tribute from Jiannan was abolished.",
    idiomatic: "Jiannan's annual ten-hu tribute of spring wine was ended.",
  },
  s0024: {
    literal: "On jiashen the Grand Mentor, concurrent Grand Secretariat Director, Hezhong prefect, Lingzhou grand protector, Shanyu northern pacification grand protector Guo Ziyi, Prince of Fenyang, mountain-tomb commissioner, with substantive fief of one thousand nine hundred households, might add the title Exalted Father, hold Grand Preceptor, other offices unchanged, total substantive fief two thousand households, monthly ration one thousand five hundred men's grain and two hundred horses' fodder.",
    idiomatic: "On jiashen Guo Ziyi gained the title Exalted Father and Grand Preceptor, two thousand households' fief, and rations for fifteen hundred men and two hundred horses.",
  },
  s0025: {
    literal: "Shuofang deputy commander Li Huai'guang was made Hezhong prefect and commissioner of Bin, Ning, Qing, Jin, Jiang, Ci, and Xi prefectures.",
    idiomatic: "Li Huai'guang became Hezhong prefect and commissioner over Bin, Ning, Qing, and six other prefectures.",
  },
  s0026: {
    literal: "Shuofang right rear commander Chang Qian'guang was made Lingzhou grand protector and commissioner of the western surrender city, Dingyuan army, Tiande, Yan, Xia, Feng, and related posts.",
    idiomatic: "Chang Qian'guang took Lingzhou and the western garrisons from Dingyuan to Feng.",
  },
  s0027: {
    literal: "Shuofang left rear commander and Shanyu vice grand protector Hun Lin was made Shanyu grand protector, Zhenwu army, the two eastern surrender cities, Zhenbei, and commissioners of Sui, Yin, Lin, Sheng, and other army-prefectures and garrison-farming.",
    idiomatic: "Hun Lin became Shanyu grand protector over Zhenwu, the eastern surrender cities, and Sui-Yin-Lin-Sheng.",
  },
  s0028: {
    literal: "On bingxu an edict forbade the empire from presenting rare birds and beasts; silver vessels must not be gilded.",
    idiomatic: "On bingxu tribute of exotic creatures was banned and gilding silver was forbidden.",
  },
  s0029: {
    literal: "On dinghai an edict ordered the thirty-two dancing elephants presented by Wendantu released on the south slope of Jing Mountain; all hawks and hounds of the Five Paddocks were released; more than a hundred palace women were sent out.",
    idiomatic: "On dinghai Wendantu's thirty-two dancing elephants went free on Jing Mountain, the Five Paddocks' birds and dogs were released, and over a hundred palace women left service.",
  },
  s0030: {
    literal: "On jichou Right General of the Feathered Forest Wu Xiguang was made acting Palace Attendant and Censor-in-Chief, commissioner of Weinan, Bian, Fang, Dan, and Yan united training observation.",
    idiomatic: "On jichou Wu Xiguang became acting palace attendant and censor-in-chief over Weinan and four neighboring circuits.",
  },
  s0031: {
    literal: "On xinmao Heyang Three Cities pacification commissioner Ma Sui was made acting Minister of Works, concurrent Taiyuan prefect, Censor-in-Chief, northern capital commandant, and Hedong commissioner.",
    idiomatic: "On xinmao Ma Sui became acting works minister, Taiyuan prefect, and Hedong commissioner.",
  },
  s0032: {
    literal: "On renchen Hedong acting commissioner Bao Fang was made capital-region observation commissioner.",
    idiomatic: "On renchen Bao Fang became capital-region observer.",
  },
  s0033: {
    literal: "Chenzhou prefect Li Qi was made acting Grand Master of Splendid Happiness and Heyang Three Cities pacification commissioner.",
    idiomatic: "Li Qi became acting grand master of splendor and Heyang pacification commissioner.",
  },
  s0034: {
    literal: "On guisi Shouzhou prefect Du Ya was made Jiangxi observation commissioner.",
    idiomatic: "On guisi Du Ya became Jiangxi observer.",
  },
  s0035: {
    literal: "On jiawu Grand Preceptor Ziyi was enfeoffed in ceremony.",
    idiomatic: "On jiawu Guo Ziyi received his enfeoffment rites.",
  },
  s0036: {
    literal: "Since Kaiyuan enfeoffment rites had largely fallen into disuse; in Tianbao Yang Guozhong was enfeoffed as Minister of Works — now Ziyi's ceremony was performed.",
    idiomatic: "Enfeoffment rites had lapsed since Kaiyuan; Yang Guozhong's Tianbao ceremony was the last until Ziyi's.",
  },
  s0037: {
    literal: "Jiangxi observation commissioner Du Ya was made Shaanzhou chief administrator and transport commissioner.",
    idiomatic: "Du Ya moved from Jiangxi to Shaanzhou as chief administrator and transport chief.",
  },
  s0038: {
    literal: "On bingshen an edict stated: War Vice Minister Li Gan is vicious as wolves; Special Eminent Liu Zhongyi concealed righteousness and harbored rebels — both were struck from registers and exiled far.",
    idiomatic: "On bingshen Li Gan and Liu Zhongyi were disgraced and exiled for corruption and sheltering rebels.",
  },
  s0039: {
    literal: "After they had set out, both were ordered to die.",
    idiomatic: "Once on the road, both were ordered to commit suicide.",
  },
  s0040: {
    literal: "On dingyou capital-region observation commissioner Bao Fang was made Fuzhou prefect and Fujian united training observation commissioner.",
    idiomatic: "On dingyou Bao Fang became Fujian commissioner from the capital region.",
  },
  s0041: {
    literal: "Households Vice Minister and revenue judge Han Huang was made Grand Minister of Sacrifices; Minister of Civil Offices Liu Yan judged revenue, salt, iron, and transport.",
    idiomatic: "Han Huang became grand minister of sacrifices; Liu Yan took over revenue, salt, iron, and transport.",
  },
  s0042: {
    literal: "At first Yan and Huang had divided the empire's finances; now Yan held them all.",
    idiomatic: "Yan and Huang had split the treasury; now Yan controlled everything.",
  },
  s0043: {
    literal: "Sixth month, jihai new moon: he held court at Danfeng Tower and proclaimed a great amnesty — crimes light or heavy were all pardoned.",
    idiomatic: "On the sixth month's new moon he proclaimed universal amnesty from Danfeng Tower.",
  },
  s0044: {
    literal: "Civil and military inside and outside of third rank and above received one step in noble rank; fourth rank and below one grade; retired officials like incumbents; commoners as household heads received one ancient noble rank.",
    idiomatic: "Third-rank officials and above gained a noble step; lower ranks a grade; retirees and common householders shared in the largesse.",
  },
  s0045: {
    literal: "Li Zhengji was advanced to Grand Mentor and Grand Preceptor to the Heir; Cui Ning and Li Mian kept their posts and became Grand Secretariat Associates of equal rank.",
    idiomatic: "Li Zhengji became grand mentor and grand preceptor to the heir; Cui Ning and Li Mian became chancellors while keeping their commands.",
  },
  s0046: {
    literal: "Empire-wide presentations — only those required for suburban sacrifice and imperial tombs and temples were to remain as before without omission; all others were halted.",
    idiomatic: "Tribute continued only for rites and tombs; everything else stopped.",
  },
  s0047: {
    literal: "Prefectural assistants and chief administrators were hereafter to enter accounts according to statute.",
    idiomatic: "Prefectural deputies were required to file accounts on schedule.",
  },
  s0048: {
    literal: "Where prefects and regular-attendance officials had fathers living without office, they were to be given fifth-rank retired status in measure.",
    idiomatic: "Officials whose fathers lived without rank could secure measured fifth-rank retirement for them.",
  },
  s0049: {
    literal: "Where fathers had died, posthumous enfeoffment was granted.",
    idiomatic: "Dead fathers without rank could receive posthumous honors.",
  },
  s0050: {
    literal: "From Zhide onward separate edicts, or memorials by individuals, or ad hoc orders on current affairs, differed and overlapped.",
    idiomatic: "Since Zhide, ad hoc edicts and memorial orders had piled up inconsistently.",
  },
  s0051: {
    literal: "They made men doubtful; the Secretariat and Gate Department with the review officials were to decide and take what could long be applied, compiling it into codified articles.",
    idiomatic: "The chancellery was to codify only the durable rules and end the confusion.",
  },
  s0052: {
    literal: "From now on no more memorials to establish temples and monasteries or ordain clergy.",
    idiomatic: "New temples, monasteries, and ordinations by memorial were forbidden.",
  },
  s0053: {
    literal: "On gengzi the eldest son Yu was enfeoffed Prince of Xuan; the second son Mo Prince of Shu; Chen Prince of Tong; Liang Prince of Qian; Xiang Prince of Su — all with the rank Opening the Government, Equal in Honor to the Three Dukes.",
    idiomatic: "On gengzi Yu became Prince of Xuan and four younger brothers received princely titles with three-duke honors.",
  },
  s0054: {
    literal: "On yisi the emperor's younger brother Nai was enfeoffed Prince of Yi; Xun Prince of Sui.",
    idiomatic: "On yisi younger brothers Nai and Xun became princes of Yi and Sui.",
  },
  s0055: {
    literal: "On bingwu, following the Xiantian precedent, officials not of the palace guard or attendance corps — from civil and military sixth rank and above among officers of clear reputation — two each day in rotation would await orders to draft, for consultation; the former site of the medicine hall south of Yanying was made their office.",
    idiomatic: "On bingwu the Xiantian \"await orders\" rotation returned: two reputable officials daily south of Yanying Hall.",
  },
  s0056: {
    literal: "On guichou an edict: clansmen of five degrees of mourning and above living in distant places — one person per household might go to the mountain tomb; counties were to supply food in sequence.",
    idiomatic: "On guichou kinsmen within five degrees of mourning could send one mourner per household to the tomb with county rations.",
  },
  s0057: {
    literal: "On jiwei Yangzhou's annual tribute of mirrors cast at the river's heart on the Dragon Boat Festival, and Youzhou's tribute of musk, were both abolished.",
    idiomatic: "On jiwei Yangzhou's Dragon-Boat mirrors and Youzhou musk tribute ended.",
  },
  s0058: {
    literal: "On xinyou the Xuan-She-Chi and E-Yue-Mian united training observation commissions were abolished.",
    idiomatic: "On xinyou two united training observation circuits were abolished.",
  },
  s0059: {
    literal: "The Shaan-Guo metropolitan defense commissioner — its territory was distributed among the various circuits.",
    idiomatic: "Shaan-Guo defense was dissolved and its prefectures reassigned.",
  },
  s0060: {
    literal: "The Eastern Capital capital-region observation commissioner was restored, held by the censor-in-chief.",
    idiomatic: "Luoyang capital-region observation was restored under the censor-in-chief.",
  },
  s0061: {
    literal: "On renxu Chuzhou prefect Wang Jin and Huzhou prefect Diwu Qi both became grand mentors to the heir; Muzhou prefect Li Hui became director of the Directorate of Education — all remaining at the eastern capital.",
    idiomatic: "On renxu Wang Jin, Diwu Qi, and Li Hui took eastern-capital posts as heir mentors and education director.",
  },
  s0062: {
    literal: "The eunuch Shao Guangchao delivered the Huai-Xi command baton; Li Xilie sent him seven hundred bolts of silk — when it came to light he was beaten sixty strokes and exiled.",
    idiomatic: "Eunuch Shao Guangchao carried the Huai-Xi baton; Xilie's seven hundred bolts of silk cost him sixty strokes and exile.",
  },
  s0063: {
    literal: "Thereupon palace eunuchs did not dare accept bribes.",
    idiomatic: "After that, palace eunuchs refused bribes.",
  },
  s0064: {
    literal: "On guihai an edict: Secretariat and Gate Department fifth rank and above, and all bureaus' third-rank chiefs and above, each recommend one man fit for prefect or county magistrate; the Secretariat and Gate Department were to weigh talent and advance nominations; if the nominee was punished, the recommender was punished.",
    idiomatic: "On guihai senior officials each nominated one candidate for prefect or magistrate, with the recommender liable for the nominee's crimes.",
  },
  s0065: {
    literal: "Autumn.",
    idiomatic: "The annals turn to autumn.",
  },
  s0066: {
    literal: "Seventh month, wuchen new moon: there was an eclipse of the sun.",
    idiomatic: "Seventh month, new moon on wuchen: solar eclipse.",
  },
  s0067: {
    literal: "Rites commissioner and Minister of Civil Offices Yan Zhenqing memorialized: \"The posthumous titles of successive sages have too many characters — please fix on the initial posthumous title.\"",
    idiomatic: "Yan Zhenqing urged using only the first posthumous title for the former emperors.",
  },
  s0068: {
    literal: "War Vice Minister Yuan Chuan argued: \"The tomb jade books are already carved — they must not be lightly changed.\"",
    idiomatic: "Yuan Chuan objected that the tomb tablets were already cut.",
  },
  s0069: {
    literal: "The proposal was dropped.",
    idiomatic: "The reform was dropped.",
  },
  s0070: {
    literal: "Chuan had memorialized rashly, not knowing the jade books all bore only the initial posthumous titles.",
    idiomatic: "Chuan had blundered: the books already used the short titles only.",
  },
  s0071: {
    literal: "On gengwu an edict stated: \"The gold mines reported from Yong prefecture truly enrich the state, but to speak profit to the people is not Our constant intent — let men mine freely; officials must not forbid.\"",
    idiomatic: "On gengwu Yong's gold pits were opened to private mining; officials could not block them.",
  },
  s0072: {
    literal: "On xinwei Civil Offices Vice Minister Fang Zongyan was made censor-in-chief and eastern-capital capital-region observation commissioner.",
    idiomatic: "On xinwei Fang Zongyan became censor-in-chief and eastern-capital observer.",
  },
  s0073: {
    literal: "The Right Silver Terrace Gate Guest Office's annual grain ration of twelve thousand hu was abolished.",
    idiomatic: "The guest office's twelve-thousand-hu annual grain was cut.",
  },
  s0074: {
    literal: "Since Yongtai, those whose circuit accounts had not been dispatched, or who had memorialized and offended, or foreign envoys awaiting reply — often several hundred — were fed at the guest office at ruinous cost; hence it was abolished.",
    idiomatic: "Since Yongtai hundreds of stranded envoys and punished memorialists had fed at the guest office; the drain ended now.",
  },
  s0075: {
    literal: "On renshen the mansions of Yuan Zai, Ma Lin, and Liu Zhongyi were torn down for exceeding regulations in grandeur.",
    idiomatic: "On renshen Yuan Zai's, Ma Lin's, and Liu Zhongyi's mansions were demolished for extravagance.",
  },
  s0076: {
    literal: "On guiyou palace furnishings and regular tribute were reduced by thousands of items.",
    idiomatic: "On guiyou palace tribute and furnishings were cut by thousands.",
  },
  s0077: {
    literal: "On dingchou the stable horses for imperial escort were restored outside the Moon Splendor Gate.",
    idiomatic: "On dingchou escort horses returned to stables outside Moon Splendor Gate.",
  },
  s0078: {
    literal: "On jimao an edict: princes, dukes, and ministers must not compete with the people for profit; all circuit observation commissioners' Yangzhou trade lodges were abolished.",
    idiomatic: "On jimao nobles were forbidden to trade with commoners and circuit trade lodges at Yangzhou closed.",
  },
  s0079: {
    literal: "On gengchen an edict to the Court of Imperial Entertainments: foreign guests entering the capital were each to wear their own nation's dress.",
    idiomatic: "On gengchen foreign envoys were ordered to wear national dress in the capital.",
  },
  s0080: {
    literal: "Shangzhou's annual tribute of glue was abolished.",
    idiomatic: "Shangzhou glue tribute ended.",
  },
  s0081: {
    literal: "On xinmao the empire-wide wine monopoly was abolished.",
    idiomatic: "On xinmao the state wine monopoly ended empire-wide.",
  },
  s0082: {
    literal: "On dingyou an edict stated: state revenue is not yet supplied.",
    idiomatic: "On dingyou an edict admitted the treasury was still short.",
  },
  s0083: {
    literal: "The opening-government salaries of the Prince of Xuan and those below were all halted.",
    idiomatic: "Princes' opening-government stipends were suspended for lack of funds.",
  },
  s0084: {
    literal: "Eighth month, jiachen: Gate Department Vice Director and Associate Cui Youfu became Secretariat Vice Director and Associate; Daozhou acting chief administrator Yang Yan became Gate Department Vice Director and Associate; Huaizhou prefect Qiao Lin became censor-in-chief, associate, and capital-region observer.",
    idiomatic: "In the eighth month Youfu, Yang Yan, and Qiao Lin were reshuffled into top chancellery posts.",
  },
  s0085: {
    literal: "On yisi Grand Master of the Court of Imperial Sacrifices Wei Lun was sent to Tibet; five hundred Tibetan captives were returned — to restore good relations.",
    idiomatic: "On yisi Wei Lun went to Tibet with five hundred captives to reopen relations.",
  },
  s0086: {
    literal: "On guihai an edict: those who died outside and returned coffins to the city were not to be forbidden.",
    idiomatic: "On guihai bringing coffins into the capital from outside was permitted.",
  },
  s0087: {
    literal: "Ninth month, jiaxu: the Huai-Xi circuit became the Huaining army.",
    idiomatic: "Ninth month: Huai-Xi was renamed the Huaining army.",
  },
  s0088: {
    literal: "On xinsi acting Minister of Punishments Bai Xiaode was made Junior Tutor to the Heir.",
    idiomatic: "On xinsi Bai Xiaode became junior tutor to the heir.",
  },
  s0089: {
    literal: "On bingxu Secretariat Junior Director Shao Yue was made Civil Offices Vice Minister; Drafting Section attendant Liu Nai was made War Vice Minister; Secretariat Drafter Linghu Yan was made Rites Vice Minister.",
    idiomatic: "On bingxu Shao Yue, Liu Nai, and Linghu Yan took vice-minister posts.",
  },
  s0090: {
    literal: "Tenth month of winter, dingyou new moon: Tibet with the southern barbarians — a host claiming two hundred thousand — raided in three columns through Mao, Fu, Wen, Li, Ya, and other prefectures, seizing commanderies in succession.",
    idiomatic: "Tenth month: Tibet and Nanman, claiming two hundred thousand men, overran western Shu in three columns.",
  },
  s0091: {
    literal: "Four thousand troops were sent to aid Shu and inflicted a great defeat.",
    idiomatic: "Four thousand reinforcements crushed them in Shu.",
  },
  s0092: {
    literal: "On jiyou Daizong was buried at Yuan tomb.",
    idiomatic: "On jiyou Daizong was buried at Yuanling.",
  },
  s0093: {
    literal: "On wuwu tribute of animal-shaped charcoal stoves from Jiucheng Palace and sugar-cane crafts from Xiangzhou were abolished.",
    idiomatic: "On wuwu Jiucheng charcoal stoves and Xiangzhou sugar crafts tribute ended.",
  },
  s0094: {
    literal: "Three thousand head of pigs kept by honorary officials were given to the poor.",
    idiomatic: "Three thousand official hogs were distributed to the poor.",
  },
  s0095: {
    literal: "Eleventh month, xinwei: Court of Imperial Entertainments Director Jia Dan was made Liangzhou prefect and Shannan West circuit commissioner.",
    idiomatic: "Eleventh month: Jia Dan became Shannan West commissioner from Liangzhou.",
  },
  s0096: {
    literal: "On dingchou Shaanzhou chief administrator Du Ya was made Hezhong prefect and Hezhong-Jin-Jiang-Ci-Xi metropolitan defense observer.",
    idiomatic: "On dingchou Du Ya took Hezhong and its four-prefecture defense command.",
  },
  s0097: {
    literal: "On renwu Censor-in-Chief and Associate Qiao Lin was made Minister of Works and removed from governing affairs.",
    idiomatic: "On renwu Qiao Lin became works minister and left the chancellery.",
  },
  s0098: {
    literal: "Sword-South West circuit commissioner, acting Minister of Works, associate, Chengdu prefect Cui Ning was made concurrent censor-in-chief and capital-region observer.",
    idiomatic: "Cui Ning of Sword-South West added capital-region observation while keeping Chengdu.",
  },
  s0099: {
    literal: "Sword-South West circuit commissioner, acting Minister of Works, associate, Chengdu prefect Cui Ning was made concurrent censor-in-chief and capital-region observer.",
    idiomatic: "Cui Ning of Sword-South West added capital-region observation while keeping Chengdu.",
  },
  s0100: {
    literal: "On guisi Cui Ning was further made concurrent Lingzhou grand protector, Shanyu northern pacification grand protector, Shuofang commissioner, and went out to garrison Fang prefecture.",
    idiomatic: "On guisi Ning also took Lingzhou, Shanyu, and Shuofang and marched to Fangzhou.",
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
if (data.metadata.chapter !== '012') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 012; standalone T ready (${Object.keys(T).length} entries).`
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
