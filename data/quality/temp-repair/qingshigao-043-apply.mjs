#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-qingshigao.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-qingshigao-043-wikisource-b4dfd402368d': [
    {
      zh: '宣統元年，甘肅全省亢旱。',
      literal: 'In the first year of Xuantong, severe drought afflicted all of Gansu Province.',
      idiomatic: 'In the first year of Xuantong, severe drought struck all of Gansu Province.',
    },
    {
      zh: '順治元年十一月十二日，鹽亭山頂崩一大石，如數間房，橫截路口，是夕大風雨，居民避張獻忠者得脫大半。',
      literal: 'On the twelfth day of the eleventh month of the first year of Shunzhi, a great stone collapsed from the summit of Yanting Mountain, as large as several rooms, blocking the road crossing; that evening there were great wind and rain, and among the residents fleeing Zhang Xianzhong, more than half escaped.',
      idiomatic: 'On the twelfth day of the eleventh month of the first year of Shunzhi, a great stone collapsed from the summit of Yanting Mountain, as large as several rooms and blocking the road crossing; that evening brought great wind and rain, and of the residents fleeing Zhang Xianzhong, more than half escaped.',
    },
    {
      zh: '先是有童謠云「入洞數，鑽岩怪，沿山走的後還在」，至是果應。',
      literal: 'Previously there had been a children\'s rhyme saying, "Enter the caves and count them; drilling the rocks is strange—the one who walks along the mountain is still behind," and at this time it was indeed fulfilled.',
      idiomatic: 'Previously there had been a children\'s rhyme saying, "Enter the caves and count them; drilling the rocks is strange—the one who walks along the mountain is still behind," and at this time it was indeed fulfilled.',
    },
    {
      zh: '康熙十四年，藩王尚可喜於粵秀山築壘，土中得一石碑，其碑文云：「抱破老龍傷粵秀，八風吹箭入陀城，種柳昔年曾有恨，看花今日豈無情？',
      literal: 'In the fourteenth year of Kangxi, the feudal prince Shang Kexi built fortifications on Yuexiu Mountain; in the soil a stone stele was found, its inscription reading: "Embracing the broken old dragon wounds Yuexiu; the eight winds blow arrows into Tuocheng; planting willows in former years held grief—viewing flowers today, how could there be no feeling?',
      idiomatic: 'In the fourteenth year of Kangxi, the feudal prince Shang Kexi built fortifications on Yuexiu Mountain; digging in the earth he obtained a stone stele whose inscription read: "Embracing the broken old dragon wounds Yuexiu; the eight winds blow arrows into Tuocheng; planting willows in former years held grief—viewing flowers today, how could there be no feeling?',
    },
    {
      zh: '殘花已自傷零落，折柳何須關廢興，可憐野鬼黃沙跡，直待劉終班馬鳴。」',
      literal: 'Fallen blossoms already grieve their scattering; why need breaking willows concern decline and rise? Pitiable wild ghosts on yellow-sand trails—wait until Liu Zhong and Ban Ma cry out."',
      idiomatic: 'Fallen blossoms already grieve their scattering; why need breaking willows concern decline and rise? Pitiable wild ghosts on yellow-sand trails—wait until Liu Zhong and Ban Ma cry out."',
    },
    {
      zh: '似詩似讖，未有能識者。',
      literal: 'It seemed like poetry and like a prophecy; none could interpret it.',
      idiomatic: 'It seemed both like poetry and like a prophecy, and none could interpret it.',
    },
    {
      zh: '五十七年八月初一，鍾祥火災，先是有童謠云：「八月初一火龍過」，至是果應。',
      literal: 'On the first day of the eighth month of the fifty-seventh year, Zhongxiang suffered a fire disaster; previously there had been a children\'s rhyme saying, "On the first of the eighth month a fire dragon passes," and at this time it was indeed fulfilled.',
      idiomatic: 'On the first day of the eighth month of the fifty-seventh year, Zhongxiang suffered a fire disaster; previously there had been a children\'s rhyme saying, "On the first of the eighth month a fire dragon passes," and at this time it was indeed fulfilled.',
    },
    {
      zh: '乾隆六年，知州林良銓改修諸葛忠武祠，掘地得二石人，一背銘字云「守土守三分辛苦」，一背鐫字云「遇隆則興。」',
      literal: 'In the sixth year of Qianlong, Magistrate Lin Liangquan renovated the Zhuge Zhongwu Shrine; digging in the earth he obtained two stone figures—on one\'s back the inscribed characters read "Guarding the soil, guarding is three parts hardship"; on the other\'s back the carved characters read "When encountering prosperity, then rise."',
      idiomatic: 'In the sixth year of Qianlong, Magistrate Lin Liangquan renovated the Zhuge Zhongwu Shrine; digging in the earth he obtained two stone figures—one bore the inscription "Guarding the soil, guarding is three parts hardship," and the other was carved with the words "When encountering prosperity, then rise."',
    },
    {
      zh: '光緒五年，文縣有童謠云「兩個土地會說話，兩個石人會撻架」，未幾即山崩地震。',
      literal: 'In the fifth year of Guangxu, in Wen County there was a children\'s rhyme saying, "Two earth gods can speak; two stone men can brawl," and before long there were mountain collapses and earthquakes.',
      idiomatic: 'In the fifth year of Guangxu, in Wen County there was a children\'s rhyme saying, "Two earth gods can speak; two stone men can brawl," and before long there were mountain collapses and earthquakes.',
    },
    {
      zh: '順治七年正月朔，衢州黑熊入城，是年多火災。',
      literal: 'On the first day of the first month of the seventh year of Shunzhi, a black bear entered the city of Quzhou; that year saw many fire disasters.',
      idiomatic: 'On the first day of the first month of the seventh year of Shunzhi, a black bear entered the city of Quzhou; that year saw many fire disasters.',
    },
  ],
  'source-qingshigao-043-wikisource-fc3e7129783e': [
    {
      zh: '康熙四十五年二月，蕭縣民家犬作人言。',
      literal: 'In the second month of the forty-fifth year of Kangxi, at a common household in Xiaoxian a dog spoke in human words.',
      idiomatic: 'In the second month of the forty-fifth year of Kangxi, a dog at a common household in Xiaoxian spoke in human words.',
    },
    {
      zh: '乾隆二年，利津民家犬生一畜，一首二尾七足。',
      literal: 'In the second year of Qianlong, at a common household in Lijin a dog gave birth to a creature with one head, two tails, and seven legs.',
      idiomatic: 'In the second year of Qianlong, a dog at a common household in Lijin whelped a creature with one head, two tails, and seven legs.',
    },
    {
      zh: '咸豐十一年，來鳳民家犬作人言。',
      literal: 'In the eleventh year of Xianfeng, at a common household in Laifeng a dog spoke in human words.',
      idiomatic: 'In the eleventh year of Xianfeng, a dog at a common household in Laifeng spoke in human words.',
    },
    {
      zh: '同治十一年，大埔民家犬生六足。',
      literal: 'In the eleventh year of Tongzhi, at a common household in Dapu a dog gave birth to [a pup with] six legs.',
      idiomatic: 'In the eleventh year of Tongzhi, a dog at a common household in Dapu whelped a pup with six legs.',
    },
    {
      zh: '順治元年二月，興國寺前出白氣一道。',
      literal: 'In the second month of the first year of Shunzhi, a streak of white vapor appeared before Xingguo Temple.',
      idiomatic: 'In the second month of the first year of Shunzhi, a streak of white vapor appeared before Xingguo Temple.',
    },
    {
      zh: '六年三月，江陰白氣亙天，彌月始滅。',
      literal: 'In the third month of the sixth year, white vapor in Jiangyin spanned heaven and did not vanish until a full month had passed.',
      idiomatic: 'In the third month of the sixth year, white vapor in Jiangyin spanned heaven and did not vanish until a full month had passed.',
    },
    {
      zh: '七年正月二十六夜，昆山西方有白氣如練，十餘日始滅；',
      literal: 'On the night of the twenty-sixth day of the first month of the seventh year, in the west of Kunshan there was white vapor like spun silk; after more than ten days it vanished;',
      idiomatic: 'On the night of the twenty-sixth day of the first month of the seventh year, white vapor like spun silk appeared in the west of Kunshan and did not vanish for more than ten days;',
    },
    {
      zh: '蕭縣白氣見西方，二十餘日始滅。',
      literal: 'in Xiaoxian white vapor appeared in the west and did not vanish for more than twenty days.',
      idiomatic: 'in Xiaoxian white vapor appeared in the west and did not vanish for more than twenty days.',
    },
    {
      zh: '六月甲申，泰安見白氣亙天，益都見白氣亙天。',
      literal: 'In the sixth month, on jiashen day, white vapor spanning heaven was seen in Tai\'an and in Yidu.',
      idiomatic: 'In the sixth month, on jiashen day, white vapor spanning heaven was seen in Tai\'an and in Yidu.',
    },
    {
      zh: '十二月三十日，蕭縣見白氣如練數十條，寒光射人。',
      literal: 'On the thirtieth day of the twelfth month, in Xiaoxian dozens of streaks of white vapor like spun silk were seen, their cold light striking people.',
      idiomatic: 'On the thirtieth day of the twelfth month, dozens of streaks of white vapor like spun silk were seen in Xiaoxian, their cold light striking people.',
    },
    {
      zh: '十八年十二月十二日，棲霞白氣亙天。',
      literal: 'On the twelfth day of the twelfth month of the eighteenth year, white vapor in Qixia spanned heaven.',
      idiomatic: 'On the twelfth day of the twelfth month of the eighteenth year, white vapor in Qixia spanned heaven.',
    },
    {
      zh: '康熙二年夏，萊陽有白氣衝天。',
      literal: 'In the summer of the second year of Kangxi, in Laiyang white vapor rushed to heaven.',
      idiomatic: 'In the summer of the second year of Kangxi, white vapor rushed to heaven in Laiyang.',
    },
    {
      zh: '七年正月，廣平見白氣亙天，西出指東，越二十日方滅；',
      literal: 'In the first month of the seventh year, in Guangping white vapor spanning heaven appeared, issuing from the west and pointing east; after more than twenty days it vanished;',
      idiomatic: 'In the first month of the seventh year, white vapor spanning heaven was seen in Guangping, issuing from the west and pointing east; it did not vanish for more than twenty days;',
    },
    {
      zh: '內丘夜見白氣如銀河，經五六日方滅；',
      literal: 'at night in Neiqiu white vapor like the Milky Way was seen and vanished after five or six days;',
      idiomatic: 'at night in Neiqiu white vapor like the Milky Way was seen and vanished after five or six days;',
    },
    {
      zh: '溫江有白氣，自西直亙數十丈，下銳上闊，光如銀，形如竹，經四晝夜方散；',
      literal: 'in Wenjiang there was white vapor extending straight from the west for several tens of zhang, sharp below and broad above, its light like silver and its form like bamboo; after four days and nights it dispersed;',
      idiomatic: 'in Wenjiang white vapor extended straight from the west for several tens of zhang, sharp below and broad above, its light like silver and its form like bamboo; it dispersed only after four days and nights;',
    },
    {
      zh: '威縣見白氣亙天。',
      literal: 'in Weixian white vapor spanning heaven was seen.',
      idiomatic: 'white vapor spanning heaven was seen in Weixian.',
    },
    {
      zh: '二月，廣州有白氣如槍，長十餘丈，四十日乃滅；',
      literal: 'In the second month, in Guangzhou there was white vapor like a spear, more than ten zhang long; after forty days it vanished;',
      idiomatic: 'In the second month, white vapor like a spear more than ten zhang long appeared in Guangzhou and did not vanish for forty days;',
    },
    {
      zh: '武邑夜白氣亙天，夜半始散；',
      literal: 'at night in Wuyi white vapor spanned heaven and did not disperse until midnight;',
      idiomatic: 'at night white vapor spanned heaven in Wuyi and did not disperse until midnight;',
    },
    {
      zh: '唐山見白氣亙天。',
      literal: 'in Tangshan white vapor spanning heaven was seen.',
      idiomatic: 'white vapor spanning heaven was seen in Tangshan.',
    },
    {
      zh: '七月，高邑夜見白氣如疋布，亙西方。',
      literal: 'In the seventh month, at night in Gaoyi white vapor like a bolt of cloth was seen spanning the west.',
      idiomatic: 'In the seventh month, at night white vapor like a bolt of cloth was seen spanning the west in Gaoyi.',
    },
    {
      zh: '九年三月乙丑，廬陵白氣現自西方。',
      literal: 'In the third month of the ninth year, on yichou day, white vapor appeared in Luling from the west.',
      idiomatic: 'In the third month of the ninth year, on yichou day, white vapor appeared in Luling from the west.',
    },
    {
      zh: '十一月，通渭夜見白氣如虹，自南而北。',
      literal: 'In the eleventh month, at night in Tongwei white vapor like a rainbow was seen, running from south to north.',
      idiomatic: 'In the eleventh month, at night white vapor like a rainbow was seen in Tongwei, running from south to north.',
    },
    {
      zh: '十一年七月十四日夜，交河有白氣自西南向東北，其疾如飛，聲如風。',
      literal: 'On the night of the fourteenth day of the seventh month of the eleventh year, in Jiaohe there was white vapor from southwest to northeast, swift as flight and sounding like wind.',
      idiomatic: 'On the night of the fourteenth day of the seventh month of the eleventh year, white vapor ran from southwest to northeast in Jiaohe, swift as flight and sounding like wind.',
    },
    {
      zh: '十六年七月壬申夜，盧龍有白氣如霓，自東向日。',
      literal: 'On the night of renshen day in the seventh month of the sixteenth year, in Lulong there was white vapor like a secondary rainbow, from the east toward the sun.',
      idiomatic: 'On the night of renshen day in the seventh month of the sixteenth year, white vapor like a secondary rainbow appeared in Lulong, running from the east toward the sun.',
    },
    {
      zh: '十八年六月二十四日，武定見白氣貫天。',
      literal: 'On the twenty-fourth day of the sixth month of the eighteenth year, in Wuding white vapor piercing heaven was seen.',
      idiomatic: 'On the twenty-fourth day of the sixth month of the eighteenth year, white vapor piercing heaven was seen in Wuding.',
    },
    {
      zh: '十一月，玉田有白氣自西南來。',
      literal: 'In the eleventh month, in Yutian white vapor came from the southwest.',
      idiomatic: 'In the eleventh month, white vapor came from the southwest in Yutian.',
    },
    {
      zh: '十九年十月，全椒見白氣於西方，月餘始滅。',
      literal: 'In the tenth month of the nineteenth year, in Quanjiao white vapor was seen in the west and did not vanish until more than a month had passed.',
      idiomatic: 'In the tenth month of the nineteenth year, white vapor was seen in the west in Quanjiao and did not vanish for more than a month.',
    },
    {
      zh: '十一月朔，滄州有白氣如帚，自西南向東北，浹旬方滅；',
      literal: 'On the first day of the eleventh month, in Cangzhou there was white vapor like a broom, from southwest to northeast; after ten days it vanished;',
      idiomatic: 'On the first day of the eleventh month, white vapor like a broom ran from southwest to northeast in Cangzhou and did not vanish for ten days;',
    },
    {
      zh: '盧龍有白氣如雲，長亙向東，越數夕色淡，而高起如帚芒狀；',
      literal: 'in Lulong there was white vapor like clouds, long and spanning eastward; after several nights its color faded, yet it rose high in the shape of broom bristles;',
      idiomatic: 'in Lulong white vapor like clouds spanned eastward; after several nights its color faded, yet it rose high in the shape of broom bristles;',
    },
    {
      zh: '絳縣夜見白氣如虹。',
      literal: 'at night in Jiangxian white vapor like a rainbow was seen.',
      idiomatic: 'at night white vapor like a rainbow was seen in Jiangxian.',
    },
    {
      zh: '初二日，鎮洋西方見白氣亙天，長數丈，移時乃滅；',
      literal: 'On the second day, in the west of Zhenyang white vapor spanning heaven was seen, several zhang long; after a while it vanished;',
      idiomatic: 'On the second day, white vapor several zhang long spanned heaven in the west of Zhenyang and vanished after a while;',
    },
    {
      zh: '臨淄見白氣自西而東。',
      literal: 'in Linzi white vapor was seen from west to east.',
      idiomatic: 'white vapor was seen from west to east in Linzi.',
    },
    {
      zh: '初四日，溫州夜見白氣如練，長十餘丈，月餘始滅。',
      literal: 'On the fourth day, at night in Wenzhou white vapor like spun silk was seen, more than ten zhang long; after more than a month it vanished.',
      idiomatic: 'On the fourth day, at night white vapor like spun silk more than ten zhang long was seen in Wenzhou and did not vanish for more than a month.',
    },
    {
      zh: '二十年六月二十一日夜，望江見白氣亙天，至八月十一日方滅。',
      literal: 'On the night of the twenty-first day of the sixth month of the twentieth year, in Wangjiang white vapor spanning heaven was seen; it did not vanish until the eleventh day of the eighth month.',
      idiomatic: 'On the night of the twenty-first day of the sixth month of the twentieth year, white vapor spanning heaven was seen in Wangjiang and did not vanish until the eleventh day of the eighth month.',
    },
    {
      zh: '十一月，山陽見白氣亙天，一月始滅；',
      literal: 'In the eleventh month, in Shanyang white vapor spanning heaven was seen and did not vanish until a month had passed;',
      idiomatic: 'In the eleventh month, white vapor spanning heaven was seen in Shanyang and did not vanish for a month;',
    },
    {
      zh: '漢中西方見白氣亙天如練。',
      literal: 'in the west of Hanzhong white vapor spanning heaven like spun silk was seen.',
      idiomatic: 'white vapor like spun silk spanning heaven was seen in the west of Hanzhong.',
    },
    {
      zh: '二十二年五月己未夜，清河有白氣數道如虹。',
      literal: 'On the night of jiwei day in the fifth month of the twenty-second year, in Qinghe several streaks of white vapor like rainbows were seen.',
      idiomatic: 'On the night of jiwei day in the fifth month of the twenty-second year, several streaks of white vapor like rainbows were seen in Qinghe.',
    },
    {
      zh: '三十九年九月，江夏見白氣如練，六七日始滅。',
      literal: 'In the ninth month of the thirty-ninth year, in Jiangxia white vapor like spun silk was seen and did not vanish for six or seven days.',
      idiomatic: 'In the ninth month of the thirty-ninth year, white vapor like spun silk was seen in Jiangxia and did not vanish for six or seven days.',
    },
    {
      zh: '四十一年二月，沛縣見白氣於西方。',
      literal: 'In the second month of the forty-first year, in Peixian white vapor was seen in the west.',
      idiomatic: 'In the second month of the forty-first year, white vapor was seen in the west in Peixian.',
    },
    {
      zh: '六十年十一月十九日，遵化有白氣如練，聚於西南，移時方滅。',
      literal: 'On the nineteenth day of the eleventh month of the sixtieth year, in Zunhua there was white vapor like spun silk, gathering in the southwest; after a while it vanished.',
      idiomatic: 'On the nineteenth day of the eleventh month of the sixtieth year, white vapor like spun silk gathered in the southwest in Zunhua and vanished after a while.',
    },
    {
      zh: '六十一年六月十四日，嘉定有白氣亙天。',
      literal: 'On the fourteenth day of the sixth month of the sixty-first year, in Jiading white vapor spanning heaven was seen.',
      idiomatic: 'On the fourteenth day of the sixth month of the sixty-first year, white vapor spanning heaven was seen in Jiading.',
    },
    {
      zh: '雍正九年閏五月二十七日夜，南宮有白氣一道南行有聲。',
      literal: 'On the night of the twenty-seventh day of the intercalary fifth month of the ninth year of Yongzheng, in Nangong one streak of white vapor moved southward with sound.',
      idiomatic: 'On the night of the twenty-seventh day of the intercalary fifth month of the ninth year of Yongzheng, one streak of white vapor moved southward with sound in Nangong.',
    },
    {
      zh: '乾隆十八年九月癸丑，東流有氣如虹著天，色紫白，久而沒。',
      literal: 'In the ninth month of the eighteenth year of Qianlong, on guichou day, in Dongliu vapor like a rainbow clung to heaven, purple and white in color, and after a long time vanished.',
      idiomatic: 'In the ninth month of the eighteenth year of Qianlong, on guichou day, vapor like a rainbow clung to heaven in Dongliu, purple and white in color, and vanished after a long time.',
    },
    {
      zh: '三十五年七月二十八日，肥城有白氣十三道，至夜半乃退。',
      literal: 'On the twenty-eighth day of the seventh month of the thirty-fifth year, in Feicheng there were thirteen streaks of white vapor; they withdrew only at midnight.',
      idiomatic: 'On the twenty-eighth day of the seventh month of the thirty-fifth year, thirteen streaks of white vapor appeared in Feicheng and withdrew only at midnight.',
    },
    {
      zh: '嘉慶二十年五月，武定有白氣亙天向西，長數丈。',
      literal: 'In the fifth month of the twentieth year of Jiaqing, in Wuding white vapor spanning heaven ran westward, several zhang long.',
      idiomatic: 'In the fifth month of the twentieth year of Jiaqing, white vapor several zhang long spanned heaven westward in Wuding.',
    },
    {
      zh: '道光十三年四月十八日，棲霞有白氣亙天。',
      literal: 'On the eighteenth day of the fourth month of the thirteenth year of Daoguang, in Qixia white vapor spanning heaven was seen.',
      idiomatic: 'On the eighteenth day of the fourth month of the thirteenth year of Daoguang, white vapor spanning heaven was seen in Qixia.',
    },
    {
      zh: '二十年，昌黎夜見白氣亙天，逾月乃滅。',
      literal: 'In the twentieth year, at night in Changli white vapor spanning heaven was seen and did not vanish until more than a month had passed.',
      idiomatic: 'In the twentieth year, at night white vapor spanning heaven was seen in Changli and did not vanish for more than a month.',
    },
    {
      zh: '二十二年春，莘縣有白氣如練數丈，月餘乃滅。',
      literal: 'In the spring of the twenty-second year, in Shenxian there was white vapor like spun silk several zhang long; after more than a month it vanished.',
      idiomatic: 'In the spring of the twenty-second year, white vapor like spun silk several zhang long appeared in Shenxian and did not vanish for more than a month.',
    },
    {
      zh: '冬，玉田有白氣亙天。',
      literal: 'In winter, in Yutian white vapor spanning heaven was seen.',
      idiomatic: 'In winter, white vapor spanning heaven was seen in Yutian.',
    },
    {
      zh: '二十三年三月，黃州有白氣如練，斜指西南，經月始散。',
      literal: 'In the third month of the twenty-third year, in Huangzhou there was white vapor like spun silk, slanting toward the southwest; after a month it dispersed.',
      idiomatic: 'In the third month of the twenty-third year, white vapor like spun silk slanting toward the southwest appeared in Huangzhou and dispersed only after a month.',
    },
    {
      zh: '四月，滕縣有白氣亙天，月餘乃滅。',
      literal: 'In the fourth month, in Tengxian white vapor spanning heaven was seen and did not vanish until more than a month had passed.',
      idiomatic: 'In the fourth month, white vapor spanning heaven was seen in Tengxian and did not vanish for more than a month.',
    },
    {
      zh: '二十四年夏，登州有白氣亙天。',
      literal: 'In the summer of the twenty-fourth year, in Dengzhou white vapor spanning heaven was seen.',
      idiomatic: 'In the summer of the twenty-fourth year, white vapor spanning heaven was seen in Dengzhou.',
    },
    {
      zh: '二十五年春，即墨有白氣西北亙天。',
      literal: 'In the spring of the twenty-fifth year, in Jimo white vapor spanned heaven in the northwest.',
      idiomatic: 'In the spring of the twenty-fifth year, white vapor spanned heaven in the northwest in Jimo.',
    },
    {
      zh: '二十六年秋，寧津夜有白氣長竟天。',
      literal: 'In the autumn of the twenty-sixth year, at night in Ningjin white vapor long enough to fill heaven was seen.',
      idiomatic: 'In the autumn of the twenty-sixth year, at night white vapor long enough to fill heaven was seen in Ningjin.',
    },
    {
      zh: '咸豐七年秋，黃安有白光如電，燭暗室，有聲。',
      literal: 'In the autumn of the seventh year of Xianfeng, in Huang\'an there was white light like lightning, illuminating a dark room, with sound.',
      idiomatic: 'In the autumn of the seventh year of Xianfeng, white light like lightning appeared in Huang\'an, illuminating a dark room, with sound.',
    },
    {
      zh: '十一年六月，棲霞有白光如疋練，橫亙西北，十餘日始滅。',
      literal: 'In the sixth month of the eleventh year, in Qixia there was white light like a bolt of silk, spanning the northwest horizontally; after more than ten days it vanished.',
      idiomatic: 'In the sixth month of the eleventh year, white light like a bolt of silk spanned the northwest horizontally in Qixia and did not vanish for more than ten days.',
    },
    {
      zh: '同治七年九月十五日，玉田有火光至空際化為白氣，長丈許，其中有聲如鼓。',
      literal: 'On the fifteenth day of the ninth month of the seventh year of Tongzhi, in Yutian firelight reached the sky and transformed into white vapor about one zhang long, within which there was sound like a drum.',
      idiomatic: 'On the fifteenth day of the ninth month of the seventh year of Tongzhi, firelight in Yutian reached the sky and transformed into white vapor about one zhang long, within which there was sound like a drum.',
    },
    {
      zh: '光緒元年秋，海陽有白氣突起，移時始滅。',
      literal: 'In the autumn of the first year of Guangxu, in Haiyang white vapor suddenly rose and did not vanish until after a while.',
      idiomatic: 'In the autumn of the first year of Guangxu, white vapor suddenly rose in Haiyang and did not vanish until after a while.',
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
  item.notes = 'Restored missing upstream portent text with manual translations.';
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

console.log('Applied qingshigao/043 source correspondence omissions.');
