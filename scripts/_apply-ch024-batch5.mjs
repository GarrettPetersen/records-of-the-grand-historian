#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.024, suburban sacrifice treatise) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/024.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
  s0401: {
    literal: 'The name "Precious Chart" was changed to "Chart Bestowed by Heaven," and the Luo River to Yongchang.',
    idiomatic: '"Precious Chart" became "Chart Bestowed by Heaven," and the Luo River was renamed Yongchang.',
  },
  s0402: {
    literal: 'Its spirit was enfeoffed as Marquis of Manifest Sagacity, granted special advancement, fishing was forbidden, and its sacrifices were made equal to those of the Four Streams.',
    idiomatic: 'Its spirit was made Marquis of Manifest Sagacity with special advancement; fishing was banned; sacrifices ranked with the Four Streams.',
  },
  s0403: {
    literal: 'The place where it issued forth was called the Spring of the Sacred Chart, and Yongchang County was established beside the spring.',
    idiomatic: 'The source was named Spring of the Sacred Chart; Yongchang County was set up beside it.',
  },
  s0404: {
    literal: 'Because Mount Song was near the Luo River, Mount Song was changed to Divine Peak; it was granted Grand Preceptor, bearer of the staff of authority, Grand Commander of the Divine Peak, and King of the Center of Heaven; pasturage was forbidden.',
    idiomatic: 'As Mount Song lay near the Luo, it was renamed Divine Peak, titled Grand Preceptor, bearer of the staff of authority, Grand Commander of the Divine Peak, and King of the Center of Heaven, with pasturage forbidden.',
  },
  s0405: {
    literal: 'For the King of the Center of Heaven and the Marquis of Manifest Sagacity, temples were both established.',
    idiomatic: 'Temples were established for both the King of the Center of Heaven and the Marquis of Manifest Sagacity.',
  },
  s0406: {
    literal: 'Earlier a propitious stone had also been obtained at Sishui, and Sishui County was therefore changed to Guangwu County.',
    idiomatic: 'A propitious stone had earlier been found at Sishui, so Sishui County was renamed Guangwu.',
  },
  s0407: {
    literal: 'In the twelfth month of that year the Empress Wu personally performed the Luo worship to receive the chart, erecting an altar north of the Luo River, to the left of the Central Bridge.',
    idiomatic: 'That twelfth month Wu Zetian personally worshipped at the Luo to receive the chart, building an altar north of the Luo, left of the Central Bridge.',
  },
  s0408: {
    literal: 'The crown prince and all others followed.',
    idiomatic: 'The crown prince followed, and all others with him.',
  },
  s0409: {
    literal: 'Civil and military officials within and without, and chieftains of the barbarians, each stood according to their direction.',
    idiomatic: 'Civil and military officials and barbarian chieftains each stood by their assigned direction.',
  },
  s0410: {
    literal: 'Rare birds and strange beasts were all arrayed before the altar.',
    idiomatic: 'Rare birds and strange beasts were arrayed before the altar.',
  },
  s0411: {
    literal: 'Ritual vessels and insignia escort—since Tang began, there had never been such magnificence.',
    idiomatic: 'Ritual vessels and escort insignia had never been so magnificent since the Tang began.',
  },
  s0412: {
    literal: 'When the rites were complete, they returned to the palace the same day.',
    idiomatic: 'When the rites ended, they returned to the palace the same day.',
  },
  s0413: {
    literal: 'The elders of the Divine Capital carved a stele before the Luo-worship altar, entitled "Tablet of the Chart Bestowed by Heaven."',
    idiomatic: 'Divine Capital elders carved a stele before the Luo-worship altar, titled "Tablet of the Chart Bestowed by Heaven."',
  },
  s0414: {
    literal: '" In Kaiyuan year 5, Left Remonstrance Lu Lübing submitted: "The altar and stele inscription for Empress Wu\'s Luo worship to receive the chart were erected where, in the fourth year of Chuigong, Tang Tongtai obtained the stone whose text read \'The Holy Mother oversees the people; the Yongchang imperial enterprise.\'"',
    idiomatic: '" Kaiyuan 5: Left Remonstrance Lu Lübing said the altar and stele for Wu Zetian\'s Luo chart worship were built where Tang Tongtai found the Chuigong 4 stone reading "The Holy Mother oversees the people; the Yongchang imperial enterprise."',
  },
  s0415: {
    literal: 'The era name was therefore changed to Yongchang, and Yongchang County was still established.',
    idiomatic: 'The era was renamed Yongchang and Yongchang County was established.',
  },
  s0416: {
    literal: 'The county was soon abolished and Tongtai had already been demoted; only the stele and altar stood alone.',
    idiomatic: 'The county was soon abolished and Tongtai demoted; only stele and altar remained.',
  },
  s0417: {
    literal: 'Following the precedent of the Heavenly Pivot and Praise Terrace, they could not be left standing.',
    idiomatic: 'Following the Heavenly Pivot and Praise Terrace precedent, they could not remain.',
  },
  s0418: {
    literal: '" Thereupon the responsible offices were ordered to destroy them, and the temple of the Marquis of Manifest Sagacity was soon torn down as well.',
    idiomatic: '" The offices were ordered to destroy them; the Marquis of Manifest Sagacity temple was soon demolished.',
  },
  s0419: {
    literal: 'In the first month, jichou, of Kaiyuan year 29, an edict ordered one temple to the August Ancestor Emperor of the Mysterious Origin in each of the Two Capitals and every prefecture, and the establishment of the Chongxuan Academy.',
    idiomatic: 'Kaiyuan 29, first month, jichou: edict ordered one August Ancestor of the Mysterious Origin temple per Two Capital and prefecture, plus Chongxuan academies.',
  },
  s0420: {
    literal: 'Students were ordered to study the Classic of the Way and Its Virtue, Zhuangzi, Liezi, Wenzi, and the like, and each year were presented for examination following the mingjing precedent.',
    idiomatic: 'Students were to study the Daodejing, Zhuangzi, Liezi, Wenzi, and the like, presented yearly by mingjing precedent.',
  },
  s0421: {
    literal: 'By the intercalary fourth month, Xuanzong dreamed that at the southern foot of the capital city wall there was an image of the Heavenly Honored One, and it was obtained beside the Louguan in Zhouzhi.',
    idiomatic: 'In the intercalary fourth month Xuanzong dreamed of a Heavenly Honored image at the capital\'s southern wall; it was found beside Zhouzhi\'s Louguan.',
  },
  s0422: {
    literal: 'In the first month, guichou, of Tianbao year 1, Tian Tongxiu, adjutant of the Prince of Chen\'s household, said that in the air over Yongchang Street in the capital he had seen the August Ancestor Emperor of the Mysterious Origin, conveying to Xuanzong the words "All under Heaven is at peace; may Your Sagely Longevity be without limit," and also that beside the former residence of the Pass Director Yin Xi at Taolin County there was a numinous treasure talisman.',
    idiomatic: 'Tianbao 1, first month, guichou: Chen-household adjutant Tian Tongxiu said he saw the August Ancestor of the Mysterious Origin over Yongchang Street, bearing "All under Heaven at peace; sagely longevity without limit," and that a numinous treasure talisman lay by Yin Xi\'s old Taolin residence.',
  },
  s0423: {
    literal: 'Envoys were sent to seek it; on the seventeenth day it was presented at Hanyuan Hall.',
    idiomatic: 'Envoys were sent; on the seventeenth it was presented at Hanyuan Hall.',
  },
  s0424: {
    literal: 'Thereupon a temple to the Mysterious Origin was set up in Taiping Ward; in the Eastern Capital, at the old residence in Jishan Ward.',
    idiomatic: 'A Mysterious Origin temple was set in Taiping Ward; in the Eastern Capital, at the old Jishan residence.',
  },
  s0425: {
    literal: 'On dinghai of the second month he attended Hanyuan Hall and added the honorific title Emperor Sagely in Culture and Martial in Kaiyuan and Tianbao.',
    idiomatic: 'Second month, dinghai: at Hanyuan Hall he took the honorific Sagely in Culture and Martial Emperor of Kaiyuan and Tianbao.',
  },
  s0426: {
    literal: 'On xinmao he personally enshrined tablets at the Mysterious Origin temple.',
    idiomatic: 'On xinmao he personally installed spirit tablets at the Mysterious Origin temple.',
  },
  s0427: {
    literal: 'On bingshen an edict ordered: in the Table of Notable Men Past and Present, the August Ancestor Emperor of the Mysterious Origin was advanced to upper sage.',
    idiomatic: 'On bingshen: in the Table of Notable Men Past and Present, the August Ancestor of the Mysterious Origin was raised to upper sage.',
  },
  s0428: {
    literal: 'Zhuangzi was titled Perfected Man of Southern Florescence; Wenzi, Perfected Man of Penetrating Mystery; Liezi, Perfected Man of Empty Transit; Gengsangzi, Perfected Man of Cavernous Mystery.',
    idiomatic: 'Zhuangzi became Perfected Man of Southern Florescence; Wenzi, of Penetrating Mystery; Liezi, of Empty Transit; Gengsangzi, of Cavernous Mystery.',
  },
  s0429: {
    literal: 'Zhuangzi was changed to the True Classic of Southern Florescence; Wenzi to the True Classic of Penetrating Mystery; Liezi to the True Classic of Empty Transit; Gengsangzi to the True Classic of Cavernous Mystery.',
    idiomatic: 'Zhuangzi became the True Classic of Southern Florescence; Wenzi, of Penetrating Mystery; Liezi, of Empty Transit; Gengsangzi, of Cavernous Mystery.',
  },
  s0430: {
    literal: 'At Zhenyuan County in Bozhou, one magistrate each was appointed for the Primordial Heaven Empress Dowager and the Mysterious Origin temple.',
    idiomatic: 'Bozhou\'s Zhenyuan County: one magistrate each for the Primordial Heaven Empress Dowager and the Mysterious Origin temple.',
  },
  s0431: {
    literal: 'Each Chongxuan Academy in the Two Capitals was given erudites and assistant instructors, and one hundred students were also appointed.',
    idiomatic: 'Each Two-Capital Chongxuan Academy received erudites and assistants plus one hundred students.',
  },
  s0432: {
    literal: 'Taolin County was changed to Lingbao County.',
    idiomatic: 'Taolin County was renamed Lingbao.',
  },
  s0433: {
    literal: 'Tian Tongxiu was given fifth-rank office.',
    idiomatic: 'Tian Tongxiu was appointed to fifth-rank office.',
  },
  s0434: {
    literal: 'In the fourth month, an edict ordered the Chongwen Academy to study the Classic of the Way and Its Virtue.',
    idiomatic: 'Fourth month: edict ordered Chongwen students to study the Daodejing.',
  },
  s0435: {
    literal: 'In the seventh month, the four branches of the Longxi Li—Dunhuang, Guzang, Jiang commandery, and Wuyang—were placed under the Imperial Clan Court.',
    idiomatic: 'Seventh month: Longxi Li branches Dunhuang, Guzang, Jiang, and Wuyang were placed under the Imperial Clan Court.',
  },
  s0436: {
    literal: 'In the ninth month, Mysterious Origin temples in the Two Capitals were changed to Supreme August Mysterious Origin temples; all under Heaven followed this.',
    idiomatic: 'Ninth month: Two-Capital Mysterious Origin temples became Supreme August Mysterious Origin temples; the empire followed.',
  },
  s0437: {
    literal: 'In the tenth month, Xinfeng\'s Mount Li was changed to Mount Huichang, and a shrine was still erected at the place where the Qin buried the scholars.',
    idiomatic: 'Tenth month: Xinfeng\'s Mount Li became Mount Huichang; a shrine was erected at the Qin scholars\' burial site.',
  },
  s0438: {
    literal: 'The newly built Hall of Long Life was changed to the Terrace of Gathering Spirits.',
    idiomatic: 'The new Hall of Long Life became the Terrace of Gathering Spirits.',
  },
  s0439: {
    literal: 'In the first month, bingchen, of year 2, three characters "Great Sagely Ancestor" were added to the August Ancestor\'s honorific; Chongxuan Academy became Chongxuan Lodge; erudites became academicians; assistant instructors became direct academicians; grand academician posts were added.',
    idiomatic: 'Year 2, first month, bingchen: "Great Sagely Ancestor" was added to the honorific; Chongxuan Academy became Lodge; erudites became academicians; assistants, direct academicians; grand academicians were added.',
  },
  s0440: {
    literal: 'In the third month, renzi, he personally visited the Mysterious Origin palace; the sagely grandmother, the Yishou clan, was titled Primordial Heaven Empress Dowager, and a temple was still set up in Qiao commandery.',
    idiomatic: 'Third month, renzi: he visited the Mysterious Origin palace; grandmother Yishou became Primordial Heaven Empress Dowager; a temple was set in Qiao.',
  },
  s0441: {
    literal: 'Gao Yao was honored as Emperor of Manifest Virtue; the Martial and Illustrious King of Liang as Emperor of Rising Sagacity.',
    idiomatic: 'Gao Yao was honored as Emperor of Manifest Virtue; Liang\'s Martial Illustrious King as Emperor of Rising Sagacity.',
  },
  s0442: {
    literal: 'The Western Capital Mysterious Origin temple became the Supreme Clarity Palace; the Eastern Capital\'s, the Supreme Subtlety Palace; those in prefectures throughout the realm, Purple Ultimate palaces.',
    idiomatic: 'Western Capital\'s temple became Supreme Clarity Palace; Eastern Capital\'s, Supreme Subtlety; prefectural temples, Purple Ultimate palaces.',
  },
  s0443: {
    literal: 'In the ninth month, the Purple Ultimate palace in Qiao commandery should follow the Western Capital as Supreme Clarity Palace; temples of the Primordial Heaven Grand Emperor and Empress Dowager were also changed to palaces.',
    idiomatic: 'Ninth month: Qiao\'s Purple Ultimate palace was to match the Western Capital as Supreme Clarity; Primordial Heaven emperor and empress temples became palaces.',
  },
  s0444: {
    literal: 'In the third month of year 3, in Kaiyuan abbeys and Kaiyuan temples in the Two Capitals and every commandery under Heaven, one golden-bronze image each of the Mysterious Origin in true stature as Heavenly Honored One and of the Buddha was cast.',
    idiomatic: 'Year 3, third month: in Kaiyuan abbeys and temples empire-wide, one gilt-bronze Mysterious Origin Heavenly Honored image and one Buddha each were cast.',
  },
  s0445: {
    literal: 'In the second month of year 7, at the merit site where merit was cultivated in Datong Hall, two stems of jade fungus grew on the column base.',
    idiomatic: 'Year 7, second month: at Datong Hall\'s merit site, two jade fungus stems grew on a column base.',
  },
  s0446: {
    literal: 'In the fifth month, Xuanzong attended Xingqing Hall and received a patent of honorific title as Emperor Sagely in Culture and Martial, Responsive to the Way, of Kaiyuan and Tianbao.',
    idiomatic: 'Fifth month: at Xingqing Hall Xuanzong received the honorific Sagely in Culture and Martial, Responsive to the Way, Emperor of Kaiyuan and Tianbao.',
  },
  s0447: {
    literal: 'In the twelfth month, because the August Ancestor Emperor of the Mysterious Origin appeared at Chaoyuan Pavilion, it was changed to the Pavilion of Descending Sagacity.',
    idiomatic: 'Twelfth month: as the August Ancestor appeared at Chaoyuan Pavilion, it became the Pavilion of Descending Sagacity.',
  },
  s0448: {
    literal: 'Huichang County was changed to Zhaoying County; Mount Huichang to Mount Zhaoying.',
    idiomatic: 'Huichang County became Zhaoying; Mount Huichang, Mount Zhaoying.',
  },
  s0449: {
    literal: 'The spirit of Mount Zhaoying was enfeoffed as Duke of Mysterious Virtue, and a shrine was erected.',
    idiomatic: 'Mount Zhaoying\'s spirit was enfeoffed Duke of Mysterious Virtue; a shrine was built.',
  },
  s0450: {
    literal: 'Initially, when the Supreme Clarity Palace was completed, workers were sent to Mount Taibai to quarry white stone for the sacred image of the Mysterious Origin, and white stone was also taken for Xuanzong\'s sacred image, standing in attendance to the right of the Mysterious Origin.',
    idiomatic: 'When the Supreme Clarity Palace was finished, Taibai workers quarried white stone for the Mysterious Origin\'s image and for Xuanzong\'s, standing at the Mysterious Origin\'s right.',
  },
  s0451: {
    literal: 'Both wore kingly robes and caps of the highest grade, made of silk, colors, pearls, and jade.',
    idiomatic: 'Both wore supreme kingly robes and caps of silk, color, pearl, and jade.',
  },
  s0452: {
    literal: 'East of the image setting, white stone was carved into the forms of Li Linfu and Chen Xilie.',
    idiomatic: 'East of the images, white stone figures of Li Linfu and Chen Xilie were carved.',
  },
  s0453: {
    literal: 'When Linfu offended, stone was again carved for Yang Guozhong\'s form, and Linfu\'s stone was buried.',
    idiomatic: 'When Linfu fell, Guozhong\'s stone was carved and Linfu\'s buried.',
  },
  s0454: {
    literal: 'When Xilie and Guozhong were demoted, all were destroyed and buried.',
    idiomatic: 'When Xilie and Guozhong fell, every stone was destroyed and buried.',
  },
  s0455: {
    literal: 'In the sixth month of year 8, jade fungus appeared at Datong Hall.',
    idiomatic: 'Year 8, sixth month: jade fungus appeared at Datong Hall.',
  },
  s0456: {
    literal: 'Earlier, Li Hun of Mount Taibai said that in the Golden Star Grotto a transcendent had been seen, telling an old man that there was a jade-plaque stone record talisman: "May the Sagely Lord enjoy long life and far sight.',
    idiomatic: 'Earlier Taibai\'s Li Hun said a transcendent at Golden Star Grotto told an elder of a jade-plaque record: "May the Sagely Lord enjoy long life and far sight.',
  },
  s0457: {
    literal: '" The Censor-in-Chief Wang Qiong was ordered to enter the mountain grotto and obtained it.',
    idiomatic: '" Censor-in-Chief Wang Qiong entered the grotto and obtained it.',
  },
  s0458: {
    literal: 'On the fourth day of the intercalary sixth month, Xuanzong attended the Supreme Clarity Palace and added to the Sagely Ancestor August Ancestor\'s honorific the title Sagely Ancestor Great Way August Ancestor Emperor of the Mysterious Origin; to Gaozu, Taizong, Gaozong, Zhongzong, and Ruizong the character "Great Sagely" was added; to the empresses, "Obedient Sagely."',
    idiomatic: 'Intercalary sixth month, day 4: at Supreme Clarity Palace the Sagely Ancestor\'s honorific became Sagely Ancestor Great Way August Ancestor of the Mysterious Origin; Gaozu through Ruizong gained "Great Sagely"; empresses, "Obedient Sagely."',
  },
  s0459: {
    literal: 'On the fifth day, Xuanzong attended Hanyuan Hall and added the honorific title Emperor Sagely in Culture and Martial, Responsive to the Way, of Kaiyuan and Tianbao.',
    idiomatic: 'Day 5: at Hanyuan Hall he took the honorific Sagely in Culture and Martial, Responsive to the Way, Emperor of Kaiyuan and Tianbao.',
  },
  s0460: {
    literal: 'There was a great amnesty.',
    idiomatic: 'There was a great amnesty for all under Heaven.',
  },
  s0461: {
    literal: 'From now on, whenever the di and xia seasonal sacrifices came, seats in zhao-mu order were set before the Sagely Ancestor in the Supreme Clarity Palace.',
    idiomatic: 'Henceforth at each di and xia sacrifice, zhao-mu seats were set before the Sagely Ancestor at Supreme Clarity Palace.',
  },
  s0462: {
    literal: 'Mount Taibai\'s spirit was enfeoffed Duke of Responsive Blessing; Golden Star Grotto was changed to Auspicious Felicity Grotto; Huayang County under its jurisdiction was changed to Zhenfu County.',
    idiomatic: 'Taibai\'s spirit became Duke of Responsive Blessing; Golden Star Grotto, Auspicious Felicity Grotto; Huayang County, Zhenfu.',
  },
  s0463: {
    literal: 'In the Two Capitals and one great commandery in each of the ten circuits, a Zhenfu Jade Fungus Abbey was established.',
    idiomatic: 'A Zhenfu Jade Fungus Abbey was set in each Two Capital and one great commandery per circuit.',
  },
  s0464: {
    literal: 'In the tenth month of year 9, earlier, Censor-in-Chief Wang Qiong memorialized that Wang Xuanyi of Mount Taibai had seen the August Ancestor Emperor of the Mysterious Origin in a treasure mountain grotto.',
    idiomatic: 'Year 9, tenth month: earlier Censor-in-Chief Wang Qiong said Taibai\'s Wang Xuanyi saw the August Ancestor in a treasure grotto.',
  },
  s0465: {
    literal: 'Wang Qiong, Zhang Jun, Wang Wei, Wei Ji, Wang Yi, and Wang Yueling were then sent into the grotto and obtained a jade-and-stone casket containing the Classic of Upper Clarity for Protecting the State, treasure tallies, registers, and the like, which were presented.',
    idiomatic: 'Wang Qiong, Zhang Jun, Wang Wei, Wei Ji, Wang Yi, and Wang Yueling entered the grotto and obtained a jade casket with the Upper Clarity Classic for Protecting the State, tallies, registers, and the like, and presented them.',
  },
  s0466: {
    literal: 'In the eleventh month, an ordinance stated: "Formerly the ancestral temple sacrifices were all called reporting and offering.',
    idiomatic: 'Eleventh month: ordinance said, "Formerly ancestral sacrifices were called reporting and offering.',
  },
  s0467: {
    literal: 'From now on, whenever the emperor personally reports and presents to the Supreme Clarity and Supreme Subtlety palaces, this is changed to court presentation; when the offices perform the rite, it is presentation offering.',
    idiomatic: 'Henceforth personal presentation to Supreme Clarity and Supreme Subtlety palaces became court presentation; when offices acted, presentation offering.',
  },
  s0468: {
    literal: 'Personal reporting and offering at the ancestral temple is changed to court offering; when the offices act, presentation offering.',
    idiomatic: 'Personal ancestral reporting became court offering; when offices acted, presentation offering.',
  },
  s0469: {
    literal: 'Personal inspection of the tombs is changed to court tomb visit; when the offices act, tomb obeisance.',
    idiomatic: 'Personal tomb visits became court tomb visits; when offices acted, tomb obeisance.',
  },
  s0470: {
    literal: 'All matters that reported to the ancestral temple were likewise changed to memorial.',
    idiomatic: 'All reports to the ancestral temple became memorials.',
  },
  s0471: {
    literal: 'In suburban heaven, Queen Earth, and offering-sacrifice prayer texts that said "I dare brightly report," all were changed to "I dare brightly present."',
    idiomatic: 'Suburban heaven, Queen Earth, and offering prayer texts saying "I dare brightly report" became "I dare brightly present."',
  },
  s0472: {
    literal: '" In the first month of year 10, the southern suburb ceremony was performed; at the altar site there was a great amnesty.',
    idiomatic: '" Year 10, first month: southern suburb rites; great amnesty at the altar.',
  },
  s0473: {
    literal: 'An ordinance stated: "From now on, when the regent sacrifices at the southern suburb, presents offerings at the Supreme Clarity Palace, and presents offerings at the Grand Temple, on the day before the Grand Marshal conducts the rite, at the abstinence lodge full feather regalia and insignia escort are prepared; in official dress he is led in, the prayer board is personally handed to him, and only then does he go to the pure abstinence lodge."',
    idiomatic: 'Ordinance: henceforth when a regent sacrificed at the southern suburb, presented at Supreme Clarity Palace and Grand Temple, the Grand Marshal on the eve at the abstinence lodge received full regalia and escort in official dress, was handed the prayer board personally, then went to pure abstinence.',
  },
  s0474: {
    literal: '"',
    idiomatic: 'Closing quote of the ordinance.',
  },
  s0475: {
    literal: 'Sacrifice to Queen Earth at Fenyin—after Emperor Wu of Han it was abolished and not performed.',
    idiomatic: 'Fenyin Queen Earth sacrifice had been abandoned since Han Emperor Wu.',
  },
  s0476: {
    literal: 'In Kaiyuan year 10 Xuanzong was about to tour north from the Eastern Capital, visit Taiyuan, and return to the capital, and issued an ordinance: "The king receives and serves Heaven and Earth as his masters; suburban offering to the greatest honored reaches the spirits.',
    idiomatic: 'Kaiyuan 10: touring north from the Eastern Capital via Taiyuan, Xuanzong issued an ordinance: "The king serves Heaven and Earth as masters; suburban offering to the greatest honored reaches the spirits.',
  },
  s0477: {
    literal: 'For burning firewood at the greatest altar fixes the position of Heaven;',
    idiomatic: 'Burning firewood at the greatest altar fixes Heaven\'s position;',
  },
  s0478: {
    literal: 'burying in the greatest clearing takes the position of yin.',
    idiomatic: 'burying in the greatest clearing takes yin\'s position.',
  },
  s0479: {
    literal: 'Thus to make bright return to the numinous powers and fully exalt solemn matching.',
    idiomatic: 'Thus to repay the numinous and exalt solemn matching.',
  },
  s0480: {
    literal: 'Down to Qin and Han, consulting the sacrifice canon, Ganquan was established at Yongzhi and Queen Earth fixed at Fenyin; the surviving temples stand lofty, their spiritual light fit to illuminate.',
    idiomatic: 'Since Qin and Han, per the canon, Ganquan stood at Yongzhi and Queen Earth at Fenyin; surviving temples stand lofty, spiritual light illuminating.',
  },
  s0481: {
    literal: 'I observe the customs of Tang and Jin, rank the mountains and rivers, reverently serve the bright spirits, and thereby perform the most reverent offering, wishing to seek blessing for the people and aid ascending peace.',
    idiomatic: 'I have observed Tang and Jin customs, ranked mountains and rivers, reverently served bright spirits, and performed the deepest offering to seek the people\'s blessing and aid peace.',
  },
  s0482: {
    literal: 'Now this divine talisman responds to excellent virtue.',
    idiomatic: 'This divine talisman now responds to excellent virtue.',
  },
  s0483: {
    literal: 'When the imperial progress reaches Fenyin, on the sixteenth day of the second month of the coming year Queen Earth should be sacrificed to; the offices follow the regulations."',
    idiomatic: 'At Fenyin, Queen Earth should be sacrificed on the coming year\'s second-month sixteenth day; the offices follow regulations."',
  },
  s0484: {
    literal: '"',
    idiomatic: 'Closing quote of the ordinance.',
  },
  s0485: {
    literal: 'Earlier, on the mound there was a Queen Earth shrine; it had once held a woman\'s image; in Wu Zetian\'s time the image of the Liangshan spirit of Hexi was moved in to be matched in the shrine.',
    idiomatic: 'Earlier the mound had a Queen Earth shrine with a woman\'s image; under Wu Zetian Liangshan\'s image from Hexi was moved in as consort.',
  },
  s0486: {
    literal: 'On this occasion the offices sent the Liangshan spirit image to a separate chamber outside the shrine; brocade and embroidered garments were issued from within to invest Queen Earth\'s spirit, and decoration was further added.',
    idiomatic: 'The Liangshan image was moved to an outer chamber; palace brocades clothed Queen Earth\'s spirit and decoration was increased.',
  },
  s0487: {
    literal: 'An altar was also set outside the shrine courtyard, like the regulations for August Earth Spirit.',
    idiomatic: 'An altar was set outside the courtyard like August Earth Spirit\'s rite.',
  },
  s0488: {
    literal: 'When the offices undertook construction, three treasure cauldrons were obtained and presented; in the second month of year 11 the emperor personally sacrificed on the altar, likewise following the square-mound rite.',
    idiomatic: 'During construction three treasure cauldrons were found; year 11, second month, the emperor sacrificed on the altar by square-mound rite.',
  },
  s0489: {
    literal: 'When the rites were complete, an edict changed Fenyin to Baoding.',
    idiomatic: 'After the rites, Fenyin was renamed Baoding.',
  },
  s0490: {
    literal: 'Secondary presenter Prince Shouli of Bin and final presenter Prince Xian of Ning having finished, distributions of gifts differed in degree.',
    idiomatic: 'After secondary presenter Prince Shouli of Bin and final presenter Prince Xian of Ning, gifts differed by rank.',
  },
  s0491: {
    literal: 'In year 20 the imperial carriage again went from the Eastern Capital to Taiyuan and returned to the capital.',
    idiomatic: 'Year 20: the court again went from the Eastern Capital to Taiyuan and back.',
  },
  s0492: {
    literal: 'Chief Councilor Xiao Song submitted: "Eleven years ago Your Majesty personally sacrificed to Queen Earth to pray for grain; since then the spirits have been manifest and years have piled up in abundance.',
    idiomatic: 'Chief Councilor Xiao Song said: "Eleven years ago you sacrificed to Queen Earth for grain; spirits answered and harvests have been abundant.',
  },
  s0493: {
    literal: 'When there is prayer there must be response—this is the greatest of rites.',
    idiomatic: 'Prayer demands response—the greatest of rites.',
  },
  s0494: {
    literal: 'Moreover Han Wu personally sacrificed on the mound four times in succession; I humbly request following the old sacrifice to Queen Earth and performing the thanksgiving rite."',
    idiomatic: 'Han Wu sacrificed on the mound four times; I beg to follow the old Queen Earth rite with thanksgiving."',
  },
  s0495: {
    literal: '" The emperor followed this.',
    idiomatic: '" The emperor agreed.',
  },
  s0496: {
    literal: 'That year, in the eleventh month, reaching Baoding, he again personally sacrificed to declare the thanksgiving.',
    idiomatic: 'That eleventh month at Baoding he sacrificed again in thanksgiving.',
  },
  s0497: {
    literal: 'When the rites were complete, there was a great amnesty.',
    idiomatic: 'After the rites came a great amnesty.',
  },
  s0498: {
    literal: 'The offices were still ordered to carve stone at the shrine site; the emperor himself composed the text.',
    idiomatic: 'The offices were ordered to carve stone at the shrine; the emperor wrote the text.',
  },
  s0499: {
    literal: 'On yisi of the seventh month of Kaiyuan year 24, the Longevity Star altar was first established, sacrificing to the Old Man star and the seven lodges Horn, Neck, and the rest.',
    idiomatic: 'Kaiyuan 24, seventh month, yisi: the Longevity Star altar was first set to sacrifice to the Old Man star and the seven lodges Horn, Neck, and the rest.',
  },
  s0500: {
    literal: 'In Tianbao year 3, the technician Su Jiaqing submitted: "I request east of the Morning Sun altar in the eastern capital, establishing an altar to the Nine Palaces Noble Spirits; the altar has three tiers, each tier three chi, with four steps."',
    idiomatic: 'Tianbao 3: technician Su Jiaqing asked to set an altar to the Nine Palaces Noble Spirits east of the eastern capital\'s Morning Sun altar, three tiers of three chi each with four steps.',
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
if (data.metadata.chapter !== '024') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 024; standalone T ready (${Object.keys(T).length} entries).`
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
