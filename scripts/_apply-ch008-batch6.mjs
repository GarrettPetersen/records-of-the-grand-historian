#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.008, Xuanzong — Kaiyuan 15–18) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0501: {
    literal:
      'In the seventh month of autumn, on jiaxu, lightning struck the two owl finials of the Gate of Promoting Teaching; the balustrades and pillars burned.',
    idiomatic:
      'In the seventh month lightning shattered the finials of the Gate of Promoting Teaching and set its columns afire.',
  },
  s0502: {
    literal: 'Minister of Rites Su Ting died.',
    idiomatic: 'Su Ting, Minister of Rites, died.',
  },
  s0503: {
    literal: 'On gengyin, the Luo River at Fuzhou overflowed and destroyed people’s dwellings.',
    idiomatic: 'On gengyin the Luo at Fu burst its banks and washed away homes.',
  },
  s0504: {
    literal:
      'On xinmao, it again destroyed the government offices of Fengyi County in Tong Prefecture; many drowned.',
    idiomatic:
      'On xinmao the flood wrecked Fengyi’s yamen in Tong and drowned a great many.',
  },
  s0505: {
    literal: 'On bingchen, Wulin County was changed to Yingyang County.',
    idiomatic: 'On bingchen Wulin county was renamed Yingyang.',
  },
  s0506: {
    literal:
      'On jihai, prisoners in the capital were pardoned: death was commuted to exile, and all crimes below exile were forgiven.',
    idiomatic:
      'On jihai capital prisoners were freed—death to exile, lesser crimes wiped clean.',
  },
  s0507: {
    literal:
      'On bingzi of the ninth month, the Tibetans raided Guazhou, seized Governor Tian Yuanxian and Wang Junchuo’s father Shou, killed and plundered officials and clerks, and carried off all military stores and granary grain.',
    idiomatic:
      'In the ninth month Tibetans took Guazhou, captured Tian Yuanxian and Wang Junchuo’s father, and stripped the garrison bare.',
  },
  s0508: {
    literal: 'On bingxu, the Türk Bilge Qaghan sent his minister Melüchuo to court.',
    idiomatic: 'On bingxu Bilge Qaghan of the Turks sent Minister Melüchuo to court.',
  },
  s0509: {
    literal:
      'In the intercalary month, on gengzi, the Turgesh Sulu and the Tibetan king besieged Anxi; Vice Protector-General Zhao Yizhen drove them off.',
    idiomatic:
      'In the intercalary month Sulu of the Turgesh and the Tibetan king besieged Anxi; Zhao Yizhen beat them back.',
  },
  s0510: {
    literal: 'On gengshen, the imperial carriage set out from the eastern capital and returned to the capital.',
    idiomatic: 'On gengshen the court left Luoyang for Chang’an.',
  },
  s0511: {
    literal: 'The Uyghur tribe killed Wang Junchuo at the Gongbi post in Ganzhou.',
    idiomatic: 'Uyghurs murdered Wang Junchuo at the Gongbi post in Ganzhou.',
  },
  s0512: {
    literal:
      'An edict made Acting Minister of War Xiao Song also judge Liangzhou affairs and command troops to resist the Tibetans.',
    idiomatic:
      'Xiao Song was ordered to govern Liangzhou and hold the frontier against Tibet.',
  },
  s0513: {
    literal: 'That autumn, sixty-three circuits reported flood; seventeen reported frost and drought;',
    idiomatic: 'That autumn sixty-three circuits flooded and seventeen knew frost and drought;',
  },
  s0514: {
    literal:
      'Hebei suffered famine; a million shi of southern grain tax was transferred from the Huai and Yang region to relieve it.',
    idiomatic:
      'starving Hebei was fed with a million shi of grain shipped up from the south.',
  },
  s0515: {
    literal: 'In the tenth month of winter, on jimao, he returned from the eastern capital.',
    idiomatic: 'In the tenth month he entered Chang’an from the east.',
  },
  s0516: {
    literal: 'In the twelfth month, on yihai, he visited the Hot Springs Palace.',
    idiomatic: 'In the twelfth month he went to the Hot Springs.',
  },
  s0517: {
    literal: 'On bingxu, he returned from the Hot Springs Palace.',
    idiomatic: 'On bingxu he came back from the springs.',
  },
  s0518: {
    literal: 'In the first year of Kaiyuan 16, in spring, the first month, on gengzi, he first held court at Xingqing Palace.',
    idiomatic: 'Early in Kaiyuan 16 he began to rule from Xingqing Palace.',
  },
  s0519: {
    literal:
      'In spring, the Liao chieftains of Chun and Long—Liao Prefecture governor Chen Xingfan, Guangzhou chieftain Feng Renzhi, and He Youlu—rebelled; General of Agile Cavalry Yang Sixu was sent to crush them.',
    idiomatic:
      'Liao rebels rose in Chun and Long; Yang Sixu marched against Chen Xingfan, Feng Renzhi, and He Youlu.',
  },
  s0520: {
    literal: 'On renyin, Vice Protector-General of Anxi Zhao Yizhen defeated the Tibetans at Quzi City.',
    idiomatic: 'On renyin Zhao Yizhen routed Tibetans at Quzi City.',
  },
  s0521: {
    literal: 'On jiazi, the Mohe of Heishui sent envoys to court with tribute.',
    idiomatic: 'On jiazi Heishui Mohe brought tribute to court.',
  },
  s0522: {
    literal: 'In the seventh month, the Tibetans raided Guazhou; Governor Zhang Shougui defeated them.',
    idiomatic: 'In the seventh month Tibetans raided Guazhou; Zhang Shougui drove them off.',
  },
  s0523: {
    literal:
      'On yisi, Acting Minister of War Xiao Song and Zhengzhou Protector Zhang Zhiliang stormed and took the Tibetan border fort, beheading and capturing several thousand and seizing livestock.',
    idiomatic:
      'On yisi Xiao Song and Zhang Zhiliang stormed a Tibetan fort, taking thousands of heads and herds.',
  },
  s0524: {
    literal: 'On bingchen, King Geumseong of Silla sent envoys with local products.',
    idiomatic: 'On bingchen Silla’s king sent tribute.',
  },
  s0525: {
    literal:
      'On jisi of the eighth month, Special Advance Zhang Yue presented the Kaiyuan Great Circumference Calendar; an edict ordered the relevant offices to promulgate it.',
    idiomatic:
      'In the eighth month Zhang Yue presented the Kaiyuan calendar and the court ordered it spread.',
  },
  s0526: {
    literal:
      'On xinmao, Xiao Song again sent Du Binke to strike the Tibetans at Qilian City, routing them greatly, capturing one of their great generals, and beheading five thousand.',
    idiomatic:
      'On xinmao Du Binke shattered Tibetans at Qilian City and took a general’s head among five thousand.',
  },
  s0527: {
    literal:
      'On bingwu of the ninth month, because of long rain, death sentences were commuted to exile and all crimes below exile were pardoned.',
    idiomatic:
      'In the ninth month endless rain brought amnesty—death to exile, lesser crimes forgiven.',
  },
  s0528: {
    literal: 'In the tenth month of winter, on jimao, he visited the Hot Springs Palace.',
    idiomatic: 'In the tenth month he went to the Hot Springs.',
  },
  s0529: {
    literal: 'On jichou, he returned from the Hot Springs Palace.',
    idiomatic: 'On jichou he returned from the springs.',
  },
  s0530: {
    literal:
      'On guisi the new moon, Acting Minister of War and Hexi commissioner judging Liangzhou Xiao Song was made Minister of War and co-signer of Secretariat-Chancellery documents, his other posts as before.',
    idiomatic:
      'At month’s start Xiao Song of the Hexi frontier joined the inner council as War minister.',
  },
  s0531: {
    literal: 'In the twelfth month, on dingmao, he visited the Hot Springs Palace.',
    idiomatic: 'In the twelfth month he again went to the Hot Springs.',
  },
  s0532: {
    literal: 'On dingchou, he returned from the Hot Springs Palace.',
    idiomatic: 'On dingchou he came back from the springs.',
  },
  s0533: {
    literal:
      'In the first year of Kaiyuan 17, in the second month, on dingmao, Protector-General of Xizhou Zhang Shensu defeated the barbarians, stormed Kunming City and Salt City, and killed or captured ten thousand.',
    idiomatic:
      'Early in Kaiyuan 17 Zhang Shensu stormed Kunming and Salt cities and took ten thousand lives.',
  },
  s0534: {
    literal:
      'On gengzi, Special Advance Zhang Yue was again made Left Director of the Department of State Affairs; Tongzhou governor Lu Xiangxian was made Junior Tutor of the Heir.',
    idiomatic:
      'On gengzi Zhang Yue returned as Left Director; Lu Xiangxian became the heir’s tutor.',
  },
  s0535: {
    literal:
      'On jiayin, Minister of Rites and Prince of Xin’an Yi led the host in storming and taking the Tibetan Stone Fortress City.',
    idiomatic:
      'On jiayin Prince of Xin’an Yi stormed and took the Tibetan Stone Fortress.',
  },
  s0536: {
    literal:
      'In summer, the fourth month, on guihai, an edict ordered the Secretariat and Chancellery each to go in turn to the courts of the Grand Court, Jingzhao, Wannian, and Chang’an to review and decide prisoners.',
    idiomatic:
      'In the fourth month the inner council was sent to judge prisoners in the capital courts.',
  },
  s0537: {
    literal:
      'An edict reduced death by one grade for prisoners throughout the realm and pardoned the rest.',
    idiomatic:
      'An edict lightened capital sentences one grade and freed the rest.',
  },
  s0538: {
    literal: 'On dinghai, great wind, thunder, and lightning; Mount Lantian collapsed.',
    idiomatic: 'On dinghai thunder shook the sky and Mount Lantian fell.',
  },
  s0539: {
    literal: 'In the fifth month, on guisi, the ten-circuit investigating commissioners were restored.',
    idiomatic: 'In the fifth month the ten-circuit investigating commissioners returned.',
  },
  s0540: {
    literal: 'Right Regular Attendant Xu Jian died.',
    idiomatic: 'Xu Jian, Right Regular Attendant, died.',
  },
  s0541: {
    literal:
      'In the sixth month, on jiaxu, Left Director Yuan Qianyao ceased serving as Palace Attendant; Vice Director of the Yellow Gate Du Xian was made chief administrator of Jingzhou; Vice Director of the Secretariat Li Yuanhong was made Caozhou governor.',
    idiomatic:
      'In the sixth month Yuan Qianyao left the palace post; Du Xian went to Jing; Li Yuanhong to Cao.',
  },
  s0542: {
    literal: 'Minister of War Xiao Song was also made Director of the Secretariat.',
    idiomatic: 'Xiao Song added the Secretariat.',
  },
  s0543: {
    literal:
      'Vice Minister of Revenue and Grand Master of the Court for Diplomatic Reception Yuwen Rong was made Vice Director of the Yellow Gate; Vice Minister of War Pei Guangting was made Vice Director of the Secretariat; both were co-signers of Secretariat-Chancellery documents.',
    idiomatic:
      'Yuwen Rong and Pei Guangting joined the inner council from Revenue and War.',
  },
  s0544: {
    literal: 'In the seventh month, on xinchou, Minister of Works Zhang Jiazhen died.',
    idiomatic: 'In the seventh month Zhang Jiazhen died.',
  },
  s0545: {
    literal:
      'On guihai of the eighth month, because it was the day of his birth, he feasted the hundred officials below the Tower of Flower and Calyx.',
    idiomatic:
      'On his birthday in the eighth month he feasted the court below the Tower of Flower and Calyx.',
  },
  s0546: {
    literal:
      'The hundred officials memorialized that every year on the fifth day of the eighth month should be the Thousand Autumn Festival: princes and dukes down should present mirrors and dew-collecting pouches; all prefectures should hold feasts and music, with three days’ rest; it was codified as statute, and the request was granted.',
    idiomatic:
      'The court made his birthday the Thousand Autumn Festival—mirrors and dew-pouches, feasts empire-wide, three days’ rest—written into law.',
  },
  s0547: {
    literal: 'On bingyin, Yue Prefecture suffered great flood, washing away government offices and dwellings.',
    idiomatic: 'On bingyin a flood wrecked Yue’s offices and homes.',
  },
  s0548: {
    literal:
      'On jimao, Vice Director of the Secretariat Pei Guangting was also made Censor-in-Chief, still managing government as before.',
    idiomatic:
      'On jimao Pei Guangting took the censorate while keeping his council seat.',
  },
  s0549: {
    literal:
      'On yiyou, Right Director and Palace Grandee of the First Rank and Minister of Personnel Song Jing was made Left Director; Left Director Yuan Qianyao was made Junior Tutor of the Heir.',
    idiomatic:
      'On yiyou Song Jing became Left Director; Yuan Qianyao tutored the heir.',
  },
  s0550: {
    literal:
      'On renzi of the ninth month, Yuwen Rong was demoted to Ruzhou governor; soon after he was further demoted to Pingle county captain in Zhaozhou.',
    idiomatic:
      'In the ninth month Yuwen Rong was banished to Ru, then to a Zhaozhou captaincy.',
  },
  s0551: {
    literal:
      'On renyin, Pei Guangting was made Vice Director of the Yellow Gate, still managing government as before.',
    idiomatic:
      'On renyin Pei Guangting moved to the Yellow Gate and kept his council seat.',
  },
  s0552: {
    literal: 'In the tenth month of winter, on wuwu the new moon, there was a partial solar eclipse shaped like a hook.',
    idiomatic: 'At the tenth month’s new moon the sun was eaten to a hook.',
  },
  s0553: {
    literal: 'On guiwei, Mu Prefecture presented bamboo grain.',
    idiomatic: 'On guiwei Mu presented bamboo grain.',
  },
  s0554: {
    literal: 'On gengshen, the former Guest of the Heir Yuan Xingchong died.',
    idiomatic: 'On gengshen Yuan Xingchong, former guest of the heir, died.',
  },
  s0555: {
    literal: 'In the eleventh month, on gengshen, he personally feasted the nine temples.',
    idiomatic: 'In the eleventh month he sacrificed to the nine temples.',
  },
  s0556: {
    literal: 'On xinmao, he set out from the capital.',
    idiomatic: 'On xinmao he left Chang’an.',
  },
  s0557: {
    literal: 'On bingchen, he visited Qiao Mausoleum.',
    idiomatic: 'On bingchen he worshipped at Qiao Mausoleum.',
  },
  s0558: {
    literal:
      'Gazing at the tomb he wept; those left and right were all moved to grief.',
    idiomatic:
      'He wept before the tomb until every attendant wept with him.',
  },
  s0559: {
    literal:
      'An edict made Fengxian County equal to Chixian; its ten thousand three hundred households were assigned to maintain the mausoleum; the three metropolitan guards supplied night watch; the county within was given a partial amnesty for capital crimes and below.',
    idiomatic:
      'Fengxian was raised to capital rank, given households and guards for Gaozu’s tomb, and partially amnestied.',
  },
  s0560: {
    literal: 'On wuxu, he visited Ding Mausoleum.',
    idiomatic: 'On wuxu he visited Ding Mausoleum.',
  },
  s0561: {
    literal: 'On jihai, he visited Xian Mausoleum.',
    idiomatic: 'On jihai he visited Xian Mausoleum.',
  },
  s0562: {
    literal: 'On renyin, he visited Zhao Mausoleum.',
    idiomatic: 'On renyin he visited Zhao Mausoleum.',
  },
  s0563: {
    literal: 'On yisi, he visited Qian Mausoleum.',
    idiomatic: 'On yisi he visited Qian Mausoleum.',
  },
  s0564: {
    literal: 'On wushen, the imperial carriage returned to the palace.',
    idiomatic: 'On wushen the tour returned to the palace.',
  },
  s0565: {
    literal:
      'A great amnesty was proclaimed for all under Heaven; exiles were sent home; demoted officials were moved nearer.',
    idiomatic:
      'The realm was amnestied, exiles called home, and banished officers brought closer.',
  },
  s0566: {
    literal: 'The common people were exempted from half this year’s land tax.',
    idiomatic: 'Land tax was cut by half for the year.',
  },
  s0567: {
    literal: 'For each mausoleum six neighboring townships were taken to maintain the tombs.',
    idiomatic: 'Six townships by each tomb were charged with upkeep.',
  },
  s0568: {
    literal:
      'Inner and outer officials of third rank and above received one noble rank; fourth rank and below one promotion; for fifth rank and above pure officials whose parents had died, offices and fief titles were granted by grade.',
    idiomatic:
      'Third-rank officers gained a noble grade, fourth-rank men a step; pure officers mourning parents received posthumous honors by rank.',
  },
  s0569: {
    literal: 'In the twelfth month, on xinyou, he visited the Hot Springs Palace.',
    idiomatic: 'In the twelfth month he went to the Hot Springs.',
  },
  s0570: {
    literal: 'On yichou, he hunted along the Wei ford.',
    idiomatic: 'On yichou he hunted along the Wei.',
  },
  s0571: {
    literal: 'On renshen, he returned from the Hot Springs Palace.',
    idiomatic: 'On renshen he came back from the springs.',
  },
  s0572: {
    literal: 'That winter there was no snow.',
    idiomatic: 'That winter no snow fell.',
  },
  s0573: {
    literal:
      'In the first year of Kaiyuan 18, in spring, the first month, on xinmao, Vice Director of the Yellow Gate Pei Guangting was made Palace Attendant, still also Censor-in-Chief.',
    idiomatic:
      'Early in Kaiyuan 18 Pei Guangting became Palace Attendant while keeping the censorate.',
  },
  s0574: {
    literal: 'Left Director Zhang Yue was given the Palace Grandee of the First Rank.',
    idiomatic: 'Zhang Yue received the first-rank grandee title.',
  },
  s0575: {
    literal: 'On bingwu, he visited Prince Ye’s residence and returned the same day.',
    idiomatic: 'On bingwu he called on Prince Ye and returned the same day.',
  },
  s0576: {
    literal:
      'In the second month, on bingyin, heavy snow fell, then thunder; the Left Flying Dragon stable burned.',
    idiomatic:
      'In the second month snow gave way to thunder and fire consumed the Left Flying Dragon stable.',
  },
  s0577: {
    literal:
      'In the third month, on xinmao, the upper, middle, and lower household quotas of Ding Prefecture’s counties were revised, and official fields for capital officers were granted as before.',
    idiomatic:
      'In the third month Ding’s household grades were reset and capital officers’ fields restored.',
  },
  s0578: {
    literal:
      'In summer, the fourth month, on yimao, the outer wall of the capital was built; the work was finished in ten months.',
    idiomatic:
      'In the fourth month work began on the capital’s outer wall and finished ten months later.',
  },
  s0579: {
    literal: 'On renxu, he visited Princess Ningqin’s residence and returned the same day.',
    idiomatic: 'On renxu he visited Princess Ningqin and returned.',
  },
  s0580: {
    literal: 'On yichou, Pei Guangting was also made Minister of Personnel.',
    idiomatic: 'On yichou Pei Guangting took Personnel as well.',
  },
  s0581: {
    literal:
      'That spring, the emperor ordered attending ministers and the hundred officials on each ten-day rest day to seek scenic places for feasting and pleasure, and granted cash for the relevant offices to supply tents and prepare food.',
    idiomatic:
      'That spring the court was told to feast on every rest day, with cash for tents and cooks.',
  },
  s0582: {
    literal:
      'On dingmao, ministers and below feasted in Prince of Ning Xian’s garden pool outside the Chunming Gate; the emperor from the Tower of Flower and Calyx met their returning riders, had them sit and drink, took turns dancing, and bestowed gifts in varying measure.',
    idiomatic:
      'On dingmao the ministers feasted in Ning Wang’s garden; the emperor met them from Flower and Calyx Tower, made them drink and dance, and gave gifts.',
  },
  s0583: {
    literal:
      'In the fifth month, the Khitan yabgu Ketugan killed his lord Li Zhaogu, led the tribe to surrender to the Turks, and the Xi tribes likewise rebelled westward.',
    idiomatic:
      'In the fifth month the Khitan Ketugan slew Li Zhaogu and fled to the Turks; the Xi went west with him.',
  },
  s0584: {
    literal:
      'King Li Lusu of the Xi came in flight; Li Zhaogu’s wife Princess Eastern Splendor Chen and Li Lusu’s wife Princess Eastern Light Wei both fled to the Pinglu army.',
    idiomatic:
      'Li Lusu of the Xi fled in; the Khitan and Xi princesses took refuge with Pinglu.',
  },
  s0585: {
    literal: 'An edict ordered Youzhou chief administrator Zhao Hanzhang to lead troops against them.',
    idiomatic: 'Zhao Hanzhang of Youzhou was sent to punish them.',
  },
  s0586: {
    literal:
      'In the sixth month, on gengshen, an edict ordered the Left and Right Directors, ministers, and Secretariat-Chancellery officials of fifth rank and above to recommend men fit for frontier duty or for prefectural office.',
    idiomatic:
      'In the sixth month fifth-rank ministers were told to recommend men for the frontier and for prefectures.',
  },
  s0587: {
    literal: 'On jiazi, a comet appeared in the Five Chariots.',
    idiomatic: 'On jiazi a comet hung in the Five Chariots.',
  },
  s0588: {
    literal: 'On guiyou, a broom star blazed in Net and Mao.',
    idiomatic: 'On guiyou a broom star crossed Net and Mao.',
  },
  s0589: {
    literal:
      'On bingzi, the Protector-General of the Shanyu and Prince of Zhong Jun was made commander-in-chief of the Hebei campaign, Censor-in-Chief Li Chaoyin and Metropolitan Governor Pei Youxian his deputies, to lead eighteen area commanders against the Khitan and Xi.',
    idiomatic:
      'On bingzi Prince of Zhong Jun was named to lead eighteen commands against Khitan and Xi, with Li Chaoyin and Pei Youxian as deputies.',
  },
  s0590: {
    literal: 'The campaign in the end was not carried out.',
    idiomatic: 'The expedition never marched.',
  },
  s0591: {
    literal:
      'On renwu, the Chan and Luo rivers at the eastern capital overflowed, destroying the Tianjin and Yongji bridges and the guard barracks outside the Elephant Gate, and damaging more than a thousand dwellings.',
    idiomatic:
      'On renwu floods wrecked Luoyang’s great bridges and a thousand houses.',
  },
  s0592: {
    literal: 'In the intercalary month, on jiashen, Ji Prefecture was split off from Youzhou.',
    idiomatic: 'In the intercalary month Ji was carved from You.',
  },
  s0593: {
    literal:
      'On jichou, Fan Anji and Han Chaozong were sent to dredge the sources of the Chan and Luo and set sluice gates to check the water.',
    idiomatic:
      'On jichou Fan Anji and Han Chaozong dredged the Chan and Luo headwaters and set flood gates.',
  },
  s0594: {
    literal:
      'On xinmao, the Ministry of Rites memorialized that the Thousand Autumn Festival should have three days’ leave, and that village community rites should on the festival first offer to the White Emperor and report to the field god, then sit, drink, and disperse.',
    idiomatic:
      'On xinmao Rites asked for three festival days and harvest rites tied to the Thousand Autumn observance.',
  },
  s0595: {
    literal: 'In the seventh month, on gengchen, he visited Prince of Ning Xian’s residence and returned the same day.',
    idiomatic: 'In the seventh month he visited Ning Wang and returned.',
  },
  s0596: {
    literal:
      'On dinghai of the eighth month, the emperor ascended the Tower of Flower and Calyx; on the Thousand Autumn Festival the hundred officials presented congratulations; fourth rank and above received gold mirrors, pearl pouches, and colored silk; fifth rank and below received bundled silk in varying measure.',
    idiomatic:
      'On his birthday he took Flower and Calyx Tower, received court homage, and gave mirrors, pearls, and silk by rank.',
  },
  s0597: {
    literal: 'The emperor composed an eight-rhyme poem and also wrote Autumn Scenery.',
    idiomatic: 'He wrote an eight-line poem and an Autumn Scenery piece.',
  },
  s0598: {
    literal: 'On xinhai, he visited Princess Yongmu’s residence and returned the same day.',
    idiomatic: 'On xinhai he called on Princess Yongmu and returned.',
  },
  s0599: {
    literal: 'In the ninth month, earlier wealthy households had advanced official principal at interest;',
    idiomatic: 'In the ninth month wealthy households had been advancing tax principal at interest;',
  },
  s0600: {
    literal:
      'On yimao, Censor-in-Chief Li Chaoyin memorialized that one year’s land tax from the common people should lightly supply it, and as before wealthy households and stewards should collect it, taking monthly interest to pay officials’ tax money.',
    idiomatic:
      'On yimao Li Chaoyin asked that one year’s rent fund the pool, with wealthy agents collecting monthly interest as before.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/008.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '008') {
  throw new Error(`Expected chapter 008, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(trans.sentences.map((s) => [s.originalId || s.id, s]));

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
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

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s0501–s0600)`);
