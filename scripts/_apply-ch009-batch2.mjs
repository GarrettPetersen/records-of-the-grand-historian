#!/usr/bin/env node
/** Batch 2: s0101–s0200 (Jiutangshu ch.009, Xuanzong 2 — Kaiyuan 28 through Tianbao 2) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/009.json';
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
    literal: 'The emperor detested this; Chief of Guest Affairs Wang Ji was sent to the eastern capital and the provinces to reassure the people; after long delay it subsided.',
    idiomatic: 'The emperor loathed the panic and sent Wang Ji to reassure the eastern capital and the provinces until calm returned.',
  },
  s0102: {
    literal: 'In the tenth winter month the upper story of the eastern capital Bright Hall was torn down; the lower story was rebuilt as Qianyuan Hall.',
    idiomatic: 'That winter the Bright Hall\'s upper story was torn down and the lower rebuilt as Qianyuan Hall.',
  },
  s0103: {
    literal: 'On wuxu he visited the Hot Springs Palace.',
    idiomatic: 'On wuxu he went to the hot springs.',
  },
  s0104: {
    literal: 'On xinchou he returned from the Hot Springs Palace.',
    idiomatic: 'On xinchou he returned from the hot springs.',
  },
  s0105: {
    literal: 'In the twelfth month Eastern Capital deputy guardian and heir apparent guest of honor Cui Yong died.',
    idiomatic: 'In the twelfth month Cui Yong, eastern capital deputy guardian and heir apparent guest, died.',
  },
  s0106: {
    literal: 'Yizhou army adjutant Zhang Qiu Jianqiong was made acting Jiannan and other circuits military commissioner.',
    idiomatic: 'Zhang Qiu Jianqiong was made acting Jiannan commissioner.',
  },
  s0107: {
    literal: 'That year Gai Jiayun crushed the Turgesh host, captured their king Tuhuoxian, and sent him to the capital.',
    idiomatic: 'That year Gai Jiayun crushed the Turgesh, captured King Tuhuoxian, and sent him to court.',
  },
  s0108: {
    literal: 'Kaiyuan 28, first spring month, fruit trees were planted along the roads of the two capitals and in palace gardens.',
    idiomatic: 'In the first month of Kaiyuan 28 fruit trees were planted along both capitals\' roads and in palace gardens.',
  },
  s0109: {
    literal: 'On guisi he visited the Hot Springs Palace.',
    idiomatic: 'On guisi he went to the hot springs.',
  },
  s0110: {
    literal: 'On gengzi he returned from the Hot Springs Palace.',
    idiomatic: 'On gengzi he returned from the hot springs.',
  },
  s0111: {
    literal: 'On renyin, on the full moon, he held a banquet for ministers at the Diligence-in-Government Tower; lamps burned through the night until heavy snow ended it; henceforth the second month\'s full-moon night was made permanent.',
    idiomatic: 'On the full moon he banqueted ministers at the Diligence-in-Government Tower until snow ended the lamp-night; thereafter the second month\'s full moon became a fixed feast.',
  },
  s0112: {
    literal: 'In the third month, on dinghai new moon, there was a solar eclipse.',
    idiomatic: 'In the third month the sun was eclipsed.',
  },
  s0113: {
    literal: 'On renzi Acting Yizhou prefect Zhang Qiu Jianqiong stormed Tibetan Anrong fortress and garrisoned troops there.',
    idiomatic: 'On renzi Jianqiong stormed Tibetan Anrong and left garrisons.',
  },
  s0114: {
    literal: 'In the fifth summer month Heir Apparent Junior Tutor Han Xiu and Heir Apparent Junior Tutor Li Hao died.',
    idiomatic: 'In the fifth summer month Han Xiu and Li Hao, heir apparent junior tutors, died.',
  },
  s0115: {
    literal: 'In the sixth month Huai Prefecture prefect, Prince Xin\'an Yi, became heir apparent junior tutor.',
    idiomatic: 'In the sixth month Prince Xin\'an Yi of Huai became heir apparent junior tutor.',
  },
  s0116: {
    literal: 'On gengyin Heir Apparent Guest of Honor Li Shangyin died.',
    idiomatic: 'On gengyin Li Shangyin, heir apparent guest, died.',
  },
  s0117: {
    literal: 'In the seventh autumn month, on renyin, the tombs of the Proclaimed and Luminous emperors were named Jianchu and Qiyun, with officials appointed.',
    idiomatic: 'In the seventh month the Proclaimed Emperor\'s tomb was named Jianchu and the Luminous Emperor\'s Qiyun, with officers appointed.',
  },
  s0118: {
    literal: 'In the ninth month Wei Prefecture prefect Lu Hui opened the Tongji Canal from Shihui Nest to the prefectural city and west to pour back at Wei Bridge.',
    idiomatic: 'In the ninth month Lu Hui of Wei opened the Tongji Canal from Shihui Nest to the city and back to Wei Bridge.',
  },
  s0119: {
    literal: 'In the ninth month, on gengyin, nineteen imperial grandsons including Shu were enfeoffed as princes of commanderies.',
    idiomatic: 'On gengyin nineteen imperial grandsons including Shu were enfeoffed as commandery princes.',
  },
  s0120: {
    literal: 'In the tenth winter month, on jiazi, he visited the Hot Springs Palace.',
    idiomatic: 'In the tenth winter month he visited the Hot Springs Palace.',
  },
  s0121: {
    literal: 'On xinsi he returned from the Hot Springs Palace.',
    idiomatic: 'On xinsi he returned from the hot springs.',
  },
  s0122: {
    literal: 'On yiyou night the Buddhist Guangji Temple behind the eastern capital\'s new hall burned.',
    idiomatic: 'On yiyou night Guangji Temple behind the new eastern hall burned.',
  },
  s0123: {
    literal: 'Tibet raided Anrong fortress.',
    idiomatic: 'Tibet raided Anrong.',
  },
  s0124: {
    literal: 'In the eleventh month Niu Xianke ceased his concurrent Shuofang and Hedong military commissions.',
    idiomatic: 'In the eleventh month Niu Xianke left his Shuofang and Hedong commissions.',
  },
  s0125: {
    literal: 'On yimao Turgesh chieftain Mohedagan led his band to submit.',
    idiomatic: 'On yimao Turgesh chief Mohedagan submitted with his people.',
  },
  s0126: {
    literal: 'On jiwei Minister of Rites Du Xian died.',
    idiomatic: 'On jiwei Du Xian, minister of rites, died.',
  },
  s0127: {
    literal: 'That year Princess Jincheng died; Tibet sent envoys to announce mourning.',
    idiomatic: 'That year Princess Jincheng died and Tibet announced mourning.',
  },
  s0128: {
    literal: 'Years of abundance followed; rice in the capital did not reach two hundred per hu; peace held so that one might travel ten thousand li without bearing arms.',
    idiomatic: 'Harvests ran rich; capital rice fell below two hundred cash per hu; peace held so one could travel ten thousand li unarmed.',
  },
  s0129: {
    literal: 'Kaiyuan 29, first spring month, on dingchou, an edict ordered Xuan Yuan Emperor temples and Chongxuan schools in the two capitals and all prefectures, with students studying Laozi, Zhuangzi, Liezi, and Wenzi, examined yearly by the Classics Examination standard.',
    idiomatic: 'In the first month of Kaiyuan 29 an edict ordered Xuan Yuan temples and Chongxuan schools in both capitals and every prefecture, with students examined yearly on Laozi, Zhuangzi, Liezi, and Wenzi.',
  },
  s0130: {
    literal: 'Inside and outside the court, uncles, brothers, sons, and nephews fit for prefect or magistrate were to be personally recommended by their offices.',
    idiomatic: 'Officials were to personally recommend kin fit for prefect or magistrate.',
  },
  s0131: {
    literal: 'Pure-capital officials below ninth rank were forbidden guesthouses, relay lodges, and carriage shops; the gentry and commoners were forbidden lavish burial.',
    idiomatic: 'Ninth-rank pure officials were barred from inn and carriage shops; lavish burial was forbidden.',
  },
  s0132: {
    literal: 'In the third month Tibet and the Turks each sent envoys to court.',
    idiomatic: 'In the third month Tibet and the Turks each sent envoys.',
  },
  s0133: {
    literal: 'On bingwu wind and dust rose; the sun cast no shadow.',
    idiomatic: 'On bingwu dust storms hid the sun\'s shadow.',
  },
  s0134: {
    literal: 'In the fourth summer month, on gengxu new moon.',
    idiomatic: 'The fourth summer month opened on gengxu new moon.',
  },
  s0135: {
    literal: 'On bingchen Taiyuan Pei Xianxian became Minister of Works.',
    idiomatic: 'On bingchen Pei Xianxian of Taiyuan became minister of works.',
  },
  s0136: {
    literal: 'Wei Xuxin died.',
    idiomatic: 'Wei Xuxin, vice director of the secretariat, died.',
  },
  s0137: {
    literal: 'Imperial princes and inside and outside officials were each granted cash for feasting.',
    idiomatic: 'Princes and officials received cash for feasts.',
  },
  s0138: {
    literal: 'On renwu Left and Right Golden Guard grand generals Pei Kuan became Taiyuan prefect and northern capital guardian.',
    idiomatic: 'On renwu Pei Kuan became Taiyuan prefect and northern capital guardian.',
  },
  s0139: {
    literal: 'In the seventh autumn month, on yimao, the Luo River flooded, destroying Tianjin Bridge and the Shangyang Palace guard quarters.',
    idiomatic: 'In the seventh month the Luo flooded, destroying Tianjin Bridge and Shangyang guard quarters.',
  },
  s0140: {
    literal: 'Between Luo and Wei, houses collapsed and more than a thousand drowned.',
    idiomatic: 'Between Luo and Wei more than a thousand drowned as houses fell.',
  },
  s0141: {
    literal: 'Turkic Qaghan Dengli died.',
    idiomatic: 'The Turkic qaghan Dengli died.',
  },
  s0142: {
    literal: 'Beizhou prefect Wang Sisi became Youzhou military commissioner;',
    idiomatic: 'Wang Sisi of Beizhou became Youzhou commissioner;',
  },
  s0143: {
    literal: 'Youzhou deputy commissioner An Lushan became Ying prefect, concurrent Pinglu deputy military commissioner, and commissioner overseeing two foreign offices, Parhae, and Heishui.',
    idiomatic: 'An Lushan became Ying prefect, Pinglu deputy commissioner, and overseer of the frontier offices.',
  },
  s0144: {
    literal: 'In the ninth month heavy snow bent the rice; rain lasted more than a month and roads were blocked.',
    idiomatic: 'In the ninth month snow broke the rice; month-long rains blocked the roads.',
  },
  s0145: {
    literal: 'That autumn twenty-four Hebei prefectures including Bo and Ming reported rain damage to the crops; Censor-in-chief Zhang Yi was sent to the eastern capital and Hebei for relief.',
    idiomatic: 'That autumn twenty-four Hebei prefectures reported rain damage; Zhang Yi was sent to relieve them.',
  },
  s0146: {
    literal: 'On renshen the emperor at Xingqing Gate tested candidates in the Four Masters—Yao Zichan, Yuan Zai, and others.',
    idiomatic: 'On renshen he tested Four Masters candidates including Yao Zichan and Yuan Zai at Xingqing Gate.',
  },
  s0147: {
    literal: 'In the tenth winter month, on bingchen, he visited the Hot Springs Palace.',
    idiomatic: 'In the tenth winter month he visited the Hot Springs Palace.',
  },
  s0148: {
    literal: 'On wuxu eight men including Director of the Court of Judicial Review Cui Qiao were sent to the circuits to judge officials.',
    idiomatic: 'On wuxu Cui Qiao and seven others were sent to judge officials in the circuits.',
  },
  s0149: {
    literal: 'In the eleventh month, on gengxu, Minister of Works Prince Bin Shouli died.',
    idiomatic: 'In the eleventh month Prince Bin Shouli, minister of works, died.',
  },
  s0150: {
    literal: 'On xinyou he returned from the Hot Springs Palace.',
    idiomatic: 'On xinyou he returned from the hot springs.',
  },
  s0151: {
    literal: 'On jisi trees bore ice; bitter cold froze for days without thaw.',
    idiomatic: 'On jisi glaze ice bound the trees for days.',
  },
  s0152: {
    literal: 'On xinwei Grand Preceptor Prince Ning Xian died, posthumously styled Emperor Rang, and was buried at Hui Mausoleum.',
    idiomatic: 'On xinwei Prince Ning Xian, grand preceptor, died, was styled Emperor Rang, and was buried at Hui.',
  },
  s0153: {
    literal: 'On dingyou Tibet invaded, took Datong County of Kuo Prefecture and Zhenwu Army\'s Shibao fortress; commissioner Gai Jiayun could not hold.',
    idiomatic: 'On dingyou Tibet took Kuo\'s Datong and Shibao fortress; Gai Jiayun could not hold.',
  },
  s0154: {
    literal: 'Queen Zhao Yifu of the Women\'s Kingdom and the kings of Buddhist Zhiji and Rinan each sent sons to court with tribute.',
    idiomatic: 'Queens and kings of the Women\'s Kingdom, Buddhist Zhiji, and Rinan sent sons with tribute.',
  },
  s0155: {
    literal: 'Tianbao 1, first spring month, dingwei new moon, a great amnesty was proclaimed throughout the realm; the era name was changed; even those normally unpardoned were released.',
    idiomatic: 'In the first month of Tianbao 1, on the new moon, the court amnestied the realm, changed the era name, and pardoned even the usually excluded.',
  },
  s0156: {
    literal: 'Arrears of land tax and all other levies owed by the people were remitted.',
    idiomatic: 'The people\'s tax arrears and other levies were remitted.',
  },
  s0157: {
    literal: 'Former officials and commoners of broad Confucian learning, literary excellence, or military stratagem and martial skill were to be named by their prefectures.',
    idiomatic: 'Learned commoners and skilled warriors were to be recommended by their prefectures.',
  },
  s0158: {
    literal: 'Capital civil and military officials fit to be prefects were each to submit sealed self-recommendations.',
    idiomatic: 'Capital officials fit for prefectures were to submit sealed self-recommendations.',
  },
  s0159: {
    literal: 'Yellow battle-axes were changed to gold battle-axes.',
    idiomatic: 'Yellow battle-axes became gold.',
  },
  s0160: {
    literal: 'Inside and outside officials each received two turns of merit.',
    idiomatic: 'Court and provincial officials each gained two merit turns.',
  },
  s0161: {
    literal: 'On jiayin Chen Prince mansion aide Tian Tongxiu memorialized: "The Xuan Yuan Emperor appeared in the open street before the Crimson Phoenix Gate, announcing that a numinous tally lay in the old home of Yin Xi."',
    idiomatic: 'On jiayin Tian Tongxiu reported that the Xuan Yuan Emperor had appeared before the Crimson Phoenix Gate, declaring a numinous tally at Yin Xi\'s old home.',
  },
  s0162: {
    literal: 'The emperor sent men to dig west of the old Hangu Pass at Yin Xi\'s terrace and found it; an Xuan Yuan temple was placed in Daning ward.',
    idiomatic: 'Messengers dug west of Hangu at Yin Xi\'s terrace, found the tally, and built an Xuan Yuan temple in Daning ward.',
  },
  s0163: {
    literal: 'Shaan Prefecture prefect Li Qiwu had earlier cut the Three Gates; on xinwei the canal was opened and the waters released.',
    idiomatic: 'Li Qiwu of Shaan, who had cut the Three Gates, opened the canal on xinwei and released the flow.',
  },
  s0164: {
    literal: 'In the second month, on dinghai, the added honorific was Kaiyuan Tianbao Sage Literary Divine Martial Emperor.',
    idiomatic: 'In the second month he took the honorific Kaiyuan Tianbao Sage Literary Divine Martial Emperor.',
  },
  s0165: {
    literal: 'On xinmao he personally offered to the Xuan Yuan Emperor at the new temple.',
    idiomatic: 'On xinmao he sacrificed to the Xuan Yuan Emperor at the new temple.',
  },
  s0166: {
    literal: 'On jiawu he personally offered at the Imperial Ancestral Temple.',
    idiomatic: 'On jiawu he offered at the Imperial Ancestral Temple.',
  },
  s0167: {
    literal: 'On bingshen heaven and earth were jointly sacrificed at the southern suburb.',
    idiomatic: 'On bingshen he performed the joint suburban sacrifice.',
  },
  s0168: {
    literal: 'An edict released prisoners throughout the realm regardless of gravity.',
    idiomatic: 'An edict released all prisoners regardless of crime.',
  },
  s0169: {
    literal: 'Exiles were moved nearer; demoted officials were employed by qualification; those who died in exile received posthumous honors as appropriate.',
    idiomatic: 'Exiles moved nearer; demoted officials were reemployed; dead exiles received measured posthumous honors.',
  },
  s0170: {
    literal: 'Fifteen bolts of corrupt goods had equaled strangulation; now it was raised to twenty bolts.',
    idiomatic: 'The threshold for corrupt-goods strangulation rose from fifteen to twenty bolts.',
  },
  s0171: {
    literal: 'Zhuangzi was styled Perfected Man of Southern Florescence; Wenzi Perfected Man of Pervasive Mystery; Liezi Perfected Man of Pervasive Vacuity; Gengsangzi Perfected Man of Pervasive Vacancy.',
    idiomatic: 'Zhuangzi became Perfected Man of Southern Florescence; Wenzi of Pervasive Mystery; Liezi of Pervasive Vacuity; Gengsangzi of Pervasive Vacancy.',
  },
  s0172: {
    literal: 'Their four books were changed to true scriptures.',
    idiomatic: 'Their four books were renamed true scriptures.',
  },
  s0173: {
    literal: 'Chongxuan schools received one erudite and one instructor each, with one hundred students.',
    idiomatic: 'Chongxuan schools gained an erudite, an instructor, and a hundred students each.',
  },
  s0174: {
    literal: 'Taolin County was renamed Lingbao County.',
    idiomatic: 'Taolin was renamed Lingbao.',
  },
  s0175: {
    literal: 'Palace Attendant was changed to Left Chancellor, Secretariat Director to Right Chancellor; left and right vice directors remained as vice ministers; Yellow Gate Vice Director became Vice Director of the Chancellery.',
    idiomatic: 'Palace attendant became left chancellor, secretariat director right chancellor; chancellery titles were reorganized.',
  },
  s0176: {
    literal: 'The eastern capital became Eastern Capital, the northern capital Northern Capital; all prefectures in the realm became commanderies and prefects became governors.',
    idiomatic: 'Luoyang became Eastern Capital, Taiyuan Northern Capital; prefectures became commanderies and prefects governors.',
  },
  s0177: {
    literal: 'Hebei County of Shan Prefecture became Pinglu County.',
    idiomatic: 'Shan\'s Hebei County became Pinglu.',
  },
  s0178: {
    literal: 'The aged received provisional appointment; civil and military officials of third rank and above gained one noble rank, fourth and below one grade.',
    idiomatic: 'The aged received provisional posts; third rank and above a noble rank, fourth and below a grade.',
  },
  s0179: {
    literal: 'On gengzi Pinglu military commissioner An Lushan was advanced to Flying Cavalry Grand General.',
    idiomatic: 'On gengzi An Lushan was advanced to flying cavalry grand general.',
  },
  s0180: {
    literal: 'In the fourth summer month, on gengyin, mountain floods at Wugong burst, destroying houses and drowning several hundred.',
    idiomatic: 'In the fourth summer month Wugong floods destroyed houses and drowned hundreds.',
  },
  s0181: {
    literal: 'In the seventh autumn month, on guimao new moon, there was a solar eclipse.',
    idiomatic: 'In the seventh month the sun was eclipsed.',
  },
  s0182: {
    literal: 'On xinwei Left Chancellor and Duke of Bin Niu Xianke died.',
    idiomatic: 'On xinwei Niu Xianke, left chancellor and Duke of Bin, died.',
  },
  s0183: {
    literal: 'In the eighth month, on dingchou, Minister of Punishments and concurrent Censor-in-chief Li Shizhi became Left Chancellor.',
    idiomatic: 'In the eighth month Li Shizhi, minister of punishments, became left chancellor.',
  },
  s0184: {
    literal: 'On dinghai the Turk Abu Si and the grandson of Qaghan Moqi and Qaghan Dengli\'s daughter each led their factions to surrender.',
    idiomatic: 'On dinghai the Turk Abu Si and Moqi\'s grandson, with Dengli\'s daughter, surrendered with their factions.',
  },
  s0185: {
    literal: 'On renchen Minister of Personnel and concurrent Right Chancellor Li Linfu was made Left Vice Minister of Personnel; Left Chancellor Li Shizhi concurrent Minister of War; Left Vice Minister Pei Yaojun Right Vice Minister.',
    idiomatic: 'On renchen Li Linfu became left vice minister of personnel; Li Shizhi concurrent minister of war; Pei Yaojun right vice minister.',
  },
  s0186: {
    literal: 'In the ninth month, on xinmao, the emperor at the Flower and Calyx Tower released palace women to feast Bilge Qaghan\'s wife Kedeng and her children; rewards were beyond counting.',
    idiomatic: 'In the ninth month at the Flower and Calyx Tower he feasted Bilge\'s wife Kedeng with palace women and gave uncounted gifts.',
  },
  s0187: {
    literal: 'On bingyin one hundred ten unstable or duplicate county names throughout the realm were changed.',
    idiomatic: 'On bingyin one hundred ten county names were changed for instability or duplication.',
  },
  s0188: {
    literal: 'Xuan Yuan temples in the two capitals became Palaces of the Supreme Xuan Yuan Emperor; the realm followed.',
    idiomatic: 'Capital Xuan Yuan temples became palaces of the Supreme Xuan Yuan Emperor; the realm followed.',
  },
  s0189: {
    literal: 'In the tenth winter month, on dingyou, he visited the Hot Springs Palace.',
    idiomatic: 'In the tenth winter month he visited the Hot Springs Palace.',
  },
  s0190: {
    literal: 'On xinchou Mount Li was renamed Mount Huichang; at the place where the First Emperor buried scholars a shrine was built to the scholars who suffered.',
    idiomatic: 'On xinchou Mount Li became Mount Huichang; a shrine rose where the First Emperor buried scholars.',
  },
  s0191: {
    literal: 'The newly completed Hall of Long Life was renamed the Terrace of Gathering Spirits to sacrifice to the heavenly god.',
    idiomatic: 'The Hall of Long Life was renamed Terrace of Gathering Spirits for heaven.',
  },
  s0192: {
    literal: 'In the eleventh month, on jisi, he returned from the Hot Springs Palace.',
    idiomatic: 'In the eleventh month he returned from the hot springs.',
  },
  s0193: {
    literal: 'That year Shan Prefecture prefect Wei Jian drew the Chan River to open the Broad Transport Pool east of Wangchun Pavilion, joining the Yellow and Wei;',
    idiomatic: 'That year Wei Jian of Shan drew the Chan to open the Broad Transport Pool east of Wangchun, joining the Yellow and Wei;',
  },
  s0194: {
    literal: 'Metropolitan prefect Han Chaozong also split the Wei into the Golden Light Gate and placed a pool in the west market\'s two wards to store timber.',
    idiomatic: 'Han Chaozong split the Wei at Golden Light Gate and pooled timber in the west market.',
  },
  s0195: {
    literal: 'That winter there was no ice.',
    idiomatic: 'That winter no ice formed.',
  },
  s0196: {
    literal: 'That year the realm had three hundred sixty-two commandery prefectures, one thousand five hundred twenty-eight counties, and sixteen thousand eight hundred twenty-nine townships.',
    idiomatic: 'That year the realm counted three hundred sixty-two commanderies, one thousand five hundred twenty-eight counties, and sixteen thousand eight hundred twenty-nine townships.',
  },
  s0197: {
    literal: 'The Ministry of Revenue submitted the register: households this year eight million five hundred twenty-five thousand seven hundred sixty-three, mouths forty-eight million nine hundred nine thousand eight hundred.',
    idiomatic: 'The Ministry of Revenue reported eight million five hundred twenty-five thousand seven hundred sixty-three households and forty-eight million nine hundred nine thousand eight hundred mouths.',
  },
  s0198: {
    literal: 'Tianbao 2, first spring month, on bingchen, the Xuan Yuan Emperor was raised to Great Sage Ancestor Xuan Yuan Emperor; Chongxuan schools in the two capitals became Chongxuan Halls and erudites became academicians.',
    idiomatic: 'In the first month of Tianbao 2 the Xuan Yuan Emperor was raised to Great Sage Ancestor; Chongxuan schools became halls and erudites academicians.',
  },
  s0199: {
    literal: 'In the third month, on renzi, he personally sacrificed at the Xuan Yuan temple to invest the new honorific.',
    idiomatic: 'In the third month he sacrificed at the Xuan Yuan temple to invest the new honorific.',
  },
  s0200: {
    literal: 'An edict posthumously honored the Xuan Yuan Emperor\'s father, Zhou Superior Grand Master of the Palace Jing, as Proclaimed Supreme Emperor; his mother Lady Yishou as Proclaimed Empress; temples were placed in their native village in Qiao Commandery.',
    idiomatic: 'An edict honored the sage\'s father Jing as Proclaimed Supreme Emperor and his mother Lady Yishou as Proclaimed Empress, with temples in Qiao.',
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
if (data.metadata.chapter !== '009') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 009; standalone T ready (${Object.keys(T).length} entries).`
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

