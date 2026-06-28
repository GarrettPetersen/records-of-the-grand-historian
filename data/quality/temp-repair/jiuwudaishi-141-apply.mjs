#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-jiuwudaishi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-jiuwudaishi-141-wikisource-2b3282a7d44e': [
    {
      zh: '梁開平三年春正月，潞州軍前李思安奏，壺關縣庶穰鄉村人因伐樹倒，自分為兩片，內有六字，皆如左書，曰「天十四載石進」，乃圖其狀以進。',
      literal: 'In the first month of spring of the third year of Kaiping of Liang, Li Si\'an at the front of the Lu Prefecture army memorialized: villagers of Shurang Township in Huguan County, while felling a tree, saw it fall and split of itself into two pieces; within were six characters, all written like clerical script, reading "Heaven, the fourteenth year, Shi Jin." He painted its form and submitted it.',
      idiomatic: 'In the first month of spring of the third year of Kaiping of Later Liang, Li Si\'an at the Lu Prefecture front memorialized that villagers of Shurang Township in Huguan County, while felling a tree, saw it fall and split in two; inside were six characters in clerical script reading "Heaven, the fourteenth year, Shi Jin." He painted its form and submitted the report.',
    },
    {
      zh: '梁祖異之，命示百官，莫有詳其義者，及晉高祖即位，人以為雖有圖姓，計其甲子則二十有九年矣。',
      literal: 'The Liang Founder regarded it as strange and ordered it shown to the hundred officials; none could explain its meaning. When the Jin High Ancestor took the throne, people thought that although there was the surname Tu, counting by the sexagenary cycle it was twenty-nine years.',
      idiomatic: 'The Liang Founder regarded it as strange and ordered it shown to the hundred officials, but none could explain its meaning. When the Later Jin High Ancestor took the throne, people reckoned that although the inscription bore the surname Tu, counting by the sexagenary cycle it had been twenty-nine years.',
    },
    {
      zh: '識者曰：「『天』字取『四』字中兩畫加之於傍，則『丙』字也；',
      literal: 'Those with insight said: "Taking the character \'tian\' and adding to its side the two strokes from the middle of the character \'si,\' one gets the character \'bing\';',
      idiomatic: 'Those versed in omens said: "Take the character for \'heaven\' and add to its side the two strokes from the middle of the character for \'four,\' and one gets the character for \'bing\';',
    },
    {
      zh: '『四』字去中間兩畫加『十』字，則『申』字也。',
      literal: 'removing the middle two strokes from the character \'si\' and adding the character \'shi,\' one gets the character \'shen.\'"',
      idiomatic: 'remove the middle two strokes from the character for \'four,\' add the character for \'ten,\' and one gets the character for \'shen.\'',
    },
    {
      zh: '晉祖即位之年，乃丙申也。',
      literal: 'The year in which the Jin Ancestor took the throne was indeed bingshen."',
      idiomatic: 'The year in which the Jin Ancestor took the throne was indeed bingshen."',
    },
  ],
  'source-jiuwudaishi-141-wikisource-98f2d0215307': [
    {
      zh: '清泰末年，末帝先人墳側古佛剎中石像，忽然搖動不已，觀者咸訝焉。',
      literal: 'At the end of Qingtai, at an ancient Buddhist monastery beside the tomb of the Last Emperor\'s forebears, a stone image suddenly shook without cease; all who viewed it were astonished.',
      idiomatic: 'Near the end of the Qingtai era, a stone image in an ancient Buddhist monastery beside the tomb of the Last Emperor\'s ancestors suddenly began to shake without cease, astonishing all who saw it.',
    },
    {
      zh: '晉開運元年七月一日，少帝御明德門，宣赦改元。',
      literal: 'On the first day of the seventh month of the first year of Kaiyun of Jin, the Young Emperor attended at Mingde Gate and proclaimed an amnesty and changed the reign title.',
      idiomatic: 'On the first day of the seventh month of the first year of Kaiyun of Later Jin, the Young Emperor appeared at Mingde Gate, proclaimed an amnesty, and changed the reign title.',
    },
    {
      zh: '是日，遇大雷雨，門內有井亭，亭有石盆，有走水槽，槽有龍首，其夕悉飄行數十步，而龍首斷焉。',
      literal: 'That day a great thunderstorm struck. Inside the gate was a well pavilion; the pavilion had a stone basin, the basin had a running-water channel, and the channel had a dragon head. That evening all drifted several tens of paces, and the dragon head broke off.',
      idiomatic: 'That day a violent thunderstorm struck. Inside the gate stood a well pavilion with a stone basin and a running-water channel bearing a dragon head. That evening all were swept several dozen paces, and the dragon head broke off.',
    },
    {
      zh: '識者曰：「石，國姓也，此兆非祥，石氏其遷乎！',
      literal: 'Those with insight said: "Stone is the dynastic surname; this omen is not auspicious. Will the Shi clan be displaced?',
      idiomatic: 'Those versed in omens said, "Stone is the dynastic surname. This omen is not auspicious. Will the Shi clan be displaced?',
    },
    {
      zh: '其絕乎！」',
      literal: 'Or will it be cut off?"',
      idiomatic: 'Or will it be cut off?"',
    },
    {
      zh: '二年正月，汴州封丘門外，壕水東北隅水上有文，若大樹花葉芬敷之狀，相連數十株，宛若圖畫，傾都觀之。',
      literal: 'In the first month of the second year, outside Fengqiu Gate in Bian Prefecture, on the water at the northeast corner of the moat there appeared patterns like great trees with flowers and leaves in full bloom, linked in several tens of clumps like a painted picture; the whole capital turned out to view them.',
      idiomatic: 'In the first month of the second year, outside Fengqiu Gate in Bian Prefecture, patterns appeared on the water at the northeast corner of the moat like great trees in full bloom, linked in dozens of clusters like a painted scroll. The whole capital turned out to view them.',
    },
    {
      zh: '識者云：「唐景福中，盧彥威浮陽壕水有樹文亦如此，時有高尼辭郡人曰：『此地當有兵難。』',
      literal: 'Those with insight said: "In Jingfu of Tang, Lu Yanwei\'s Fuyang moat water also had tree patterns like this. At the time a lofty nun took leave of the people of the commandery, saying: \'This place will suffer military calamity.\'"',
      idiomatic: 'Those versed in omens remarked, "In the Jingfu era of Tang, tree patterns likewise appeared on the moat water at Fuyang under Lu Yanwei. At the time a nun took leave of the people of the commandery, saying, \'This place will suffer military calamity.\'"',
    },
    {
      zh: '至光化中，其郡果為燕帥劉仁恭所陷。」',
      literal: 'By Guanghua, that commandery was indeed overrun by the Yan commander Liu Rengong."',
      idiomatic: 'By the Guanghua era that commandery was indeed overrun by the Yan commander Liu Rengong."',
    },
    {
      zh: '三年九月，大水，太原葭蘆茂盛，最上一葉如旗狀，皆南指。',
      literal: 'In the ninth month of the third year there was great flooding. At Taiyuan reeds and rushes grew luxuriantly; the topmost leaf was like a banner, all pointing south.',
      idiomatic: 'In the ninth month of the third year severe flooding struck. At Taiyuan reeds and rushes grew luxuriantly, their topmost leaves shaped like banners and all pointing south.',
    },
    {
      zh: '十二月己丑，雨木冰。',
      literal: 'On the jichou day of the twelfth month, tree ice rained down.',
      idiomatic: 'On the jichou day of the twelfth month tree ice rained down.',
    },
    {
      zh: '是月戊戌，霜霧大降，草木皆如冰。',
      literal: 'That month, on the wuxu day, frost and mist fell heavily, and grass and trees were all like ice.',
      idiomatic: 'That same month, on the wuxu day, heavy frost and mist descended, and grass and trees were coated as with ice.',
    },
  ],
  'source-jiuwudaishi-141-wikisource-9dcfea1f8a93': [
    {
      zh: '漢乾祐元年七月，青、鄆、兗、齊、濮、沂、密、邢、曹皆言蝝生。',
      literal: 'In the seventh month of the first year of Qianyou of Han, Qing, Yan, Yan, Qi, Pu, Yi, Mi, Xing, and Cao all reported the birth of locust nymphs.',
      idiomatic: 'In the seventh month of the first year of Qianyou of Later Han, Qing, Yan, Yan, Qi, Pu, Yi, Mi, Xing, and Cao all reported locust nymphs.',
    },
    {
      zh: '開封府奏，陽武、雍丘、襄邑等縣蝗，開封尹侯益遣人以酒肴致祭，尋為鴝鵒食之皆盡。',
      literal: 'Kaifeng Prefecture reported locusts in Yangwu, Yongqiu, Xiangyi, and other counties. Kaifeng Intendant Hou Yi sent men with wine and food to offer sacrifice; soon myna birds ate them all.',
      idiomatic: 'Kaifeng Prefecture reported locusts in Yangwu, Yongqiu, Xiangyi, and other counties. Kaifeng Intendant Hou Yi sent men with wine and food to offer sacrifice, and soon myna birds ate the locusts to the last.',
    },
    {
      zh: '敕禁羅弋鴝鵒，以其有吞蝗之異也。',
      literal: 'An edict forbade netting and shooting myna birds, because they had the marvel of devouring locusts.',
      idiomatic: 'An edict forbade netting and shooting myna birds because of their remarkable ability to devour locusts.',
    },
    {
      zh: '二年五月，博州奏，有鴝生，化為蝶飛去。',
      literal: 'In the fifth month of the second year, Bo Prefecture reported that myna birds were born and transformed into butterflies and flew away.',
      idiomatic: 'In the fifth month of the second year Bo Prefecture reported that myna birds had been born and transformed into butterflies that flew away.',
    },
    {
      zh: '宋州奏，蝗一夕抱草而死，差官祭之。',
      literal: 'Song Prefecture reported that locusts clung to grass and died in a single night; officials were dispatched to offer sacrifice.',
      idiomatic: 'Song Prefecture reported that locusts clung to the grass and died overnight; officials were dispatched to offer sacrifice.',
    },
  ],
  'source-jiuwudaishi-141-wikisource-ab4086310a6d': [
    {
      zh: '梁開平元年六月，許、陳、汝、蔡、潁五州蝝生，有野禽群飛蔽空，食之皆盡。',
      literal: 'In the sixth month of the first year of Kaiping of Liang, Xu, Chen, Ru, Cai, and Ying—the five prefectures—had locust nymphs; wild birds flew in flocks covering the sky and ate them all.',
      idiomatic: 'In the sixth month of the first year of Kaiping of Later Liang locust nymphs appeared in Xu, Chen, Ru, Cai, and Ying prefectures. Wild birds flew in flocks that darkened the sky and devoured them all.',
    },
    {
      zh: '唐同光三年九月，鎮州奏，飛蝗害稼。',
      literal: 'In the ninth month of the third year of Tongguang of Tang, Zhen Prefecture reported that flying locusts damaged the crops.',
      idiomatic: 'In the ninth month of the third year of Tongguang of Later Tang, Zhen Prefecture reported that flying locusts damaged the crops.',
    },
  ],
  'source-jiuwudaishi-141-wikisource-fa2931768dc9': [
    {
      zh: '」長興元年夏，鄜州上言，大水入城，居人溺死。',
      literal: 'In summer of the first year of Changxing, Yan Prefecture reported upward that great flooding entered the city and residents drowned.',
      idiomatic: 'In summer of the first year of Changxing, Yan Prefecture reported that severe flooding entered the city and residents drowned.',
    },
    {
      zh: '三年四月，棣州上言，水壞其城。',
      literal: 'In the fourth month of the third year, Di Prefecture reported upward that water destroyed its city walls.',
      idiomatic: 'In the fourth month of the third year Di Prefecture reported that floodwaters destroyed its city walls.',
    },
    {
      zh: '是月己巳，鄆州上言，黃河水溢岸，闊三十里，東流。',
      literal: 'That month, on the jisi day, Yan Prefecture reported upward that the Yellow River overflowed its banks, thirty li in breadth, flowing eastward.',
      idiomatic: 'That month, on the jisi day, Yan Prefecture reported that the Yellow River overflowed its banks to a breadth of thirty li and flowed eastward.',
    },
    {
      zh: '五月丁亥，申州奏大水，平地深七尺。',
      literal: 'On the dinghai day of the fifth month, Shen Prefecture memorialized great flooding; on level ground the water stood seven chi deep.',
      idiomatic: 'On the dinghai day of the fifth month Shen Prefecture reported severe flooding, with water seven chi deep across the flatlands.',
    },
    {
      zh: '是月戊申，襄州上言，漢水溢入城，壞民廬舍，又壞均州郛郭，水深三丈，居民登山避水，仍畫圖以進。',
      literal: 'That month, on the wushen day, Xiang Prefecture reported upward that the Han River overflowed into the city, destroying commoners\' houses; it also destroyed the outer walls of Jun Prefecture. The water stood three zhang deep; residents climbed mountains to escape the water and still painted diagrams to submit.',
      idiomatic: 'That month, on the wushen day, Xiang Prefecture reported that the Han River surged into the city and destroyed houses, and also breached the outer walls of Jun Prefecture. Water stood three zhang deep; residents fled to the hills for refuge and submitted painted records of the disaster.',
    },
    {
      zh: '是月甲子，洛水溢，壞民廬舍。',
      literal: 'That month, on the jiazi day, the Luo River overflowed and destroyed commoners\' houses.',
      idiomatic: 'That month, on the jiazi day, the Luo River overflowed and destroyed houses.',
    },
    {
      zh: '六月壬戌，汴州上言，大雨，雷震文宣王廟講堂。',
      literal: 'On the renxu day of the sixth month, Bian Prefecture reported upward heavy rain; thunder struck the lecture hall of the Temple of King Wenxuan.',
      idiomatic: 'On the renxu day of the sixth month Bian Prefecture reported heavy rain and thunder that struck the lecture hall of the Temple of King Wenxuan.',
    },
    {
      zh: '十一月壬子，鄆州上言，黃河暴漲，漂溺四千餘戶。',
      literal: 'On the renzi day of the eleventh month, Yan Prefecture reported upward that the Yellow River rose violently, sweeping away and drowning more than four thousand households.',
      idiomatic: 'On the renzi day of the eleventh month Yan Prefecture reported that the Yellow River rose violently, sweeping away and drowning more than four thousand households.',
    },
    {
      zh: '三年七月，諸州大水，宋、亳、潁尤甚。',
      literal: 'In the seventh month of the third year, many prefectures suffered great flooding; Song, Bo, and Ying were especially severe.',
      idiomatic: 'In the seventh month of the third year many prefectures were inundated, Song, Bo, and Ying most severely.',
    },
    {
      zh: '宰臣奏曰：「今秋宋州管界，水災最盛，人戶流亡，栗價暴貴。',
      literal: 'The chief ministers memorialized: "This autumn within the jurisdiction of Song Prefecture the flood disaster is most severe; households are displaced and grain prices have risen sharply.',
      idiomatic: 'The chief ministers memorialized, "This autumn the flooding is worst within the jurisdiction of Song Prefecture. Households are fleeing and grain prices have soared.',
    },
    {
      zh: '臣等商量，請於本州倉出斛斗，依時出糶，以救貧民。」',
      literal: 'We have deliberated and request that grain be taken from this prefecture\'s granaries and sold at the proper season to relieve the poor."',
      idiomatic: 'We have deliberated and request that grain be taken from this prefecture\'s granaries and sold at seasonable prices to relieve the poor."',
    },
    {
      zh: '從之。',
      literal: 'The request was approved.',
      idiomatic: 'The request was granted.',
    },
    {
      zh: '是月，秦州大水，溺死窯谷內居民三十六人。',
      literal: 'That month, Qin Prefecture suffered great flooding; thirty-six residents within Yaogu were drowned.',
      idiomatic: 'That same month Qin Prefecture was inundated, drowning thirty-six residents in Yaogu.',
    },
    {
      zh: '夔州赤甲山崩，大水漂溺居人。',
      literal: 'At Kuizhou, Chijia Mountain collapsed, and great water swept away and drowned the residents.',
      idiomatic: 'At Kuizhou Chijia Mountain collapsed, and floodwaters swept away and drowned the residents.',
    },
  ],
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = rows.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.acceptedSourceText = rows.map((r) => r.zh).join('');
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = 'Restored missing Wikisource Five Elements omens text with manual translations.';
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied source correspondence items for jiuwudaishi/141.');
