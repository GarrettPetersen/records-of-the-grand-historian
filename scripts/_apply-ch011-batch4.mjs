#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.011, Daizong) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/011.json';
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
    literal: 'silk was purchased in one hundred thousand bolts to reward the Uyghur.',
    idiomatic: 'a hundred thousand bolts of silk were bought to reward the Uyghurs.',
  },
  s0302: {
    literal: 'On yiyou the Uyghur chief, Protectorate Commander Hulu, came to court.',
    idiomatic: 'On yiyou the Uyghur leader Hulu came for audience.',
  },
  s0303: {
    literal: 'On guimao Shuofang general Li Huifang memorialized recovery of Lingwu commandery.',
    idiomatic: 'On guimao Li Huifang reported retaking Lingwu.',
  },
  s0304: {
    literal:
      'On dinghai Xu and Rao households of Xuan and She were split into Chizhou at Qiupu county; Yiyang of Xinzhou was split to establish Guixi county.',
    idiomatic:
      'On dinghai Chizhou and Guixi county were carved from southern Anhui.',
  },
  s0305: {
    literal:
      'Intercalary tenth month, on xinmao, Jingzhao Assistant Prefect Li Gan was made Jingzhao prefect.',
    idiomatic:
      'Intercalary month: Li Gan became Jingzhao prefect.',
  },
  s0306: {
    literal:
      'On bingwu the hundred officials memorialized that with military campaigns grain was urgent — they requested contributing salary fields to aid expenses — approved.',
    idiomatic:
      'On bingwu officials offered salary lands to fund the armies and were accepted.',
  },
  s0307: {
    literal:
      'On dingwei Shuofang great generals Sun Shouliang and nine others were enfeoffed as kings of different surnames; Li Guochen and thirteen others as kings of the same surname.',
    idiomatic:
      'On dingwei nineteen Shuofang generals received royal enfeoffments.',
  },
  s0308: {
    literal:
      'On wushen Weibei military commissioner Li Guangjin was advanced to Prince of Wuwei commandery.',
    idiomatic:
      'On wushen Li Guangjin became Prince of Wuwei.',
  },
  s0309: {
    literal:
      'Vice Minister of Punishments Lu Sigong was made acting Minister of Works, concurrent Censor-in-Chief, chief of Lingzhou metropolitan prefecture, Guannei deputy commander-in-chief, and knowing Shuofang military commissioner and the like.',
    idiomatic:
      'Lu Sigong took Lingzhou and Shuofang commands.',
  },
  s0310: {
    literal:
      'Jiannan military commissioner Guo Yingyi was killed by his acting western-mountain army commissioner Cui Gan; Qiongzhou Bo Maolin, Luzhou Yang Zilin, and Jiannan Li Changchong all raised troops to attack Gan — Shu was in turmoil.',
    idiomatic:
      'Guo Yingyi\'s murder by Cui Gan plunged Shu into war among regional commanders.',
  },
  s0311: {
    literal:
      'In the eleventh month, Chancellor and Henan overall commander Wang Jin requested reducing all circuits\' military funds four hundred thousand strings to repair Luoyang Palace — approved.',
    idiomatic:
      'Eleventh month: Wang Jin diverted four hundred thousand strings from armies to rebuild Luoyang.',
  },
  s0312: {
    literal:
      'On jiyou an order stated: "We have heard that prefectures, receiving dispatches from their circuit military and observation commissioners, levy corvée on the people and cause households to wither — hereafter the transport commissioner is to investigate and report.',
    idiomatic:
      'On jiyou the throne forbade commissioners from levying corvée that beggared the people; transport officials would investigate.',
  },
  s0313: {
    literal:
      'Dali 1, in the first month of spring, on dingsi new moon, great snow piled two feet on level ground.',
    idiomatic:
      'First month of Dali 1: snow two feet deep.',
  },
  s0314: {
    literal:
      'On renshen heirs inheriting substantive fiefs had half rent reduced — made perpetual statute.',
    idiomatic:
      'On renshen hereditary fiefs lost half their rent permanently.',
  },
  s0315: {
    literal: 'On yiyou a decree:',
    idiomatic: 'On yiyou an edict ordered:',
  },
  s0316: {
    literal:
      'On bingxu Households Minister Liu Yan was charged with Eastern Capital, capital region, Henan, Huainan, Jiangnan east and west, Hunan, Jingnan, and Hedong South transport, Ever-Normal, coinage, salt iron, and the like; Households Vice Minister Diwu Qi was charged with capital region, Guannei, Hedong, and Jiannan West transport, Ever-Normal, coinage, salt iron, and the like.',
    idiomatic:
      'On bingxu revenue was split between Liu Yan in the east and Diwu Qi in the west.',
  },
  s0317: {
    literal: 'From this the realm\'s finances began to be separately administered.',
    idiomatic: 'Imperial finances were now divided between two chiefs.',
  },
  s0318: {
    literal:
      'In the second month, on dinghai new moon, libation at the National University; five hundred strings feast money was granted to chancellors and the hundred officials; they ate at the university.',
    idiomatic:
      'Second month: National University rites with a feast for the court.',
  },
  s0319: {
    literal: 'On renchen the southern protectorate was restored as the Annan protectorate.',
    idiomatic: 'On renchen the Annan protectorate was restored.',
  },
  s0320: {
    literal:
      'On yiwei acting Minister of Punishments Yan Zhenqing was demoted to Kuizhou supernumerary chief adjutant — because he did not attach to Yuan Zai; Zai trapped him in crime.',
    idiomatic:
      'On yiwei Yan Zhenqing was exiled to Kuizhou for defying Yuan Zai.',
  },
  s0321: {
    literal:
      'On renzi an order made Yellow Gate Vice Director and Associate Du Hongjian also Chengdu prefect, holding credentials as Shannan West and Jiannan East River campaign deputy commander-in-chief, still Jiannan West River military commissioner, to pacify Guo Yingyi\'s disorder.',
    idiomatic:
      'On renzi Du Hongjian was sent to Sichuan to crush Guo Yingyi\'s revolt.',
  },
  s0322: {
    literal: 'Four Garrisons campaign military commissioner Ma Lin was also made Binzhou prefect.',
    idiomatic: 'Ma Lin also became Binzhou prefect.',
  },
  s0323: {
    literal:
      'On guichou Shannan West military commissioner and Liangzhou prefect Zhang Xianchéng was also Jiannan East River military and observation commissioner; Qiongzhou prefect Bo Maolin was Qiong South defense commissioner; Jiannan western-mountain army commissioner Cui Gan was Maozhou prefect and Jiannan western-mountain defense commissioner — following Du Hongjian\'s request.',
    idiomatic:
      'On guichou Sichuan commands were parceled among Zhang, Bo, and Cui at Du Hongjian\'s request.',
  },
  s0324: {
    literal:
      'In the third month, on xinwei, Zhang Xianchéng fought Cui Gan at Zizhou, was defeated by Gan, and barely escaped with his life.',
    idiomatic:
      'Third month: Zhang Xianchéng lost to Cui Gan at Zizhou and fled.',
  },
  s0325: {
    literal:
      'In the fourth month of summer, on xinhai, an edict ordered Secretariat bureau directors to be appointed Zhongzhou prefects and supernumeraries lower prefects — made fixed regulation.',
    idiomatic:
      'Summer fourth month: director-grade officials were tied to prefectural posts by statute.',
  },
  s0326: {
    literal:
      'On bingchen Green-Sprout land-tax commissioner and Palace Attendant Wei Guangyi returned from circuit land tax.',
    idiomatic:
      'On bingchen Wei Guangyi finished the green-sprout land tax tour.',
  },
  s0327: {
    literal: 'That year the cash obtained was four million nine hundred thousand strings.',
    idiomatic: 'The levy raised 4.9 million strings.',
  },
  s0328: {
    literal:
      'From Qianyuan onward the realm had used arms; officials\' salary cash was discounted — therefore it was debated to assess tax cash on green-sprout of land mu empire-wide; the Censorate was ordered to send envoys to collect, to supply officials\' salary materials, annually allotted by count — each year made perpetual rule.',
    idiomatic:
      'War had debased salaries; the green-sprout land tax on every mu was instituted to fund officials permanently.',
  },
  s0329: {
    literal:
      'On wuxu Huainan military commissioner Cui Yuan was made acting Right Vice Director of the Imperial Secretariat.',
    idiomatic:
      'On wuxu Cui Yuan became acting right vice director.',
  },
  s0330: {
    literal: 'From spring drought; this month on gengzi rain first fell.',
    idiomatic: 'Drought since spring broke on gengzi of this month.',
  },
  s0331: {
    literal: 'On dingwei the sun showed double halos.',
    idiomatic: 'On dingwei the sun had double halos.',
  },
  s0332: {
    literal: 'That night the moon showed double halos.',
    idiomatic: 'That night the moon doubled its halo.',
  },
  s0333: {
    literal:
      'In the seventh month of autumn, on xinyou, acting Minister of War and Quzhou prefect Li Xian died.',
    idiomatic:
      'Seventh month: Li Xian died at Quzhou.',
  },
  s0334: {
    literal:
      'From the fifth month great rain; Luo River overflowed and drowned dwellings in twenty wards.',
    idiomatic:
      'Floods since the fifth month drowned twenty Luoyang wards.',
  },
  s0335: {
    literal: 'Henan prefectures suffered water.',
    idiomatic: 'Henan prefectures flooded.',
  },
  s0336: {
    literal: 'Jingnan military commissioner Wei Boyu was advanced acting Minister of Works.',
    idiomatic: 'Wei Boyu became acting minister of works.',
  },
  s0337: {
    literal: 'On guiwei twin lingzhi fungi grew in two temple chambers.',
    idiomatic: 'On guiwei auspicious fungi appeared in the ancestral temple.',
  },
  s0338: {
    literal:
      'In the eighth month, on dinghai, the National University libation again used sacrificial victims.',
    idiomatic:
      'Eighth month: university rites again used animal victims.',
  },
  s0339: {
    literal:
      'In Shangyuan 2, an edict ordered all sacrifices to offer cooked meat; until now Yu Chao\'en requested restoration of the old system.',
    idiomatic:
      'Cooked offerings had replaced victims since Shangyuan 2; Yu Chao\'en restored livestock sacrifice.',
  },
  s0340: {
    literal:
      'On renyin Maozhou prefect Cui Gan was made Chengdu prefect, concurrent Censor-in-Chief and Jiannan West River campaign chief of staff; Qiong South defense commissioner and Qiongzhou prefect Bo Maolin was Qiong South military commissioner — following Du Hongjian\'s request.',
    idiomatic:
      'On renyin Cui Gan and Bo Maolin received expanded Sichuan commands.',
  },
  s0341: {
    literal:
      'On guimao Heir Apparent Junior Tutor Pei Zunqing was made Minister of Civil Appointments; Minister of Civil Appointments Cui Yu was made Heir Apparent Junior Tutor.',
    idiomatic:
      'On guimao Pei Zunqing and Cui Yu exchanged civil appointment and tutor posts.',
  },
  s0342: {
    literal:
      'On jiachen Acting Three Excellencies, Right Guard General of the Monitor, Army Viewing Pacification and Disposition Commissioner, Divine Strategy Army horse commissioner, Upper Pillar of State, Duke of Fengyi Yu Chao\'en was advanced Inner Palace Director, judging National University affairs, charged with Honglu ritual guest and the like, advanced to Duke of Zheng.',
    idiomatic:
      'On jiachen Yu Chao\'en gained the inner palace directorship and Duke of Zheng.',
  },
  s0343: {
    literal: 'On xinhai Acting Minister of Rites Pei Shiyan was charged with ritual.',
    idiomatic: 'On xinhai Pei Shiyan took charge of court ritual.',
  },
  s0344: {
    literal:
      'In the ninth month, on gengshen, Jingzhao prefect Li Gan because capital fuel and charcoal were insufficient.',
    idiomatic:
      'Ninth month: Li Gan, lacking fuel for the capital,',
  },
  s0345: {
    literal:
      'memorialized opening a canal from the southern mountain valley mouth into the capital to Jianfu Temple east street, north reaching Jingfeng and Yanxi gates into the park — width eight chi, depth one zhang.',
    idiomatic:
      'proposed a canal from the southern hills into the city eight chi wide and one zhang deep.',
  },
  s0346: {
    literal: 'When the canal was complete, that day the emperor went to Anfu Gate to view it.',
    idiomatic: 'When it opened, the emperor inspected it at Anfu Gate.',
  },
  s0347: {
    literal:
      'On bingzi Xuanzhou prefect Li Yi sat on twenty-four thousand strings of corruption; he was assembled and beaten to death before the crowd; his household was confiscated.',
    idiomatic:
      'On bingzi Li Yi was beaten to death before the people for embezzling twenty-four thousand strings.',
  },
  s0348: {
    literal: 'In the tenth month of winter, on guiwei new moon.',
    idiomatic: 'Tenth month, guiwei new moon.',
  },
  s0349: {
    literal:
      'On jichou Director of the Imperial Clan Court Prince of Wu Li Zhi memorialized presenting the Imperial Clan\'s Yongtai New Treatise in twenty scrolls, composed by Court of Imperial Sacrifices erudite Liu Fang.',
    idiomatic:
      'On jichou the imperial clan genealogy Yongtai New Treatise was presented.',
  },
  s0350: {
    literal:
      'Commissioner to harmonize with Tibet Yang Zhang and Tibetan envoys Lun Weizang and others came to court.',
    idiomatic:
      'Tibetan peace envoys came with Yang Zhang.',
  },
  s0351: {
    literal: 'On bingshen an order made chancellors feast Lun Weizang at the Secretariat.',
    idiomatic: 'On bingshen chancellors banqueted the Tibetan envoys.',
  },
  s0352: {
    literal:
      'In the eleventh month, on jiayin, Qianling magistrate at the tomb office obtained a red hare and presented it.',
    idiomatic:
      'Eleventh month: a red hare was sent from Qianling.',
  },
  s0353: {
    literal: 'On bingchen an edict:',
    idiomatic: 'On bingchen an edict proclaimed:',
  },
  s0354: {
    literal:
      'On jiazi the day length reached solstice; the emperor went to Hanyuan Hall and issued a decree of great amnesty under Heaven, changing Yongtai 2 to Dali 1.',
    idiomatic:
      'On jiazi he proclaimed solstice amnesty and the era name Dali.',
  },
  s0355: {
    literal:
      'In the twelfth month, on jihai, a comet rose in Gourd constellation, more than a chi long, violating the eunuch star.',
    idiomatic:
      'Twelfth month: a comet in Gourd threatened the eunuch constellation.',
  },
  s0356: {
    literal:
      'On guimao Tong-Hua military commissioner Zhou Zhiguang on his own authority killed Shaanxi army inspector Zhang Zhibin and former Guo prefect Pang Chong, held Huazhou and plotted rebellion.',
    idiomatic:
      'On guimao Zhou Zhiguang murdered officials and rebelled at Huazhou.',
  },
  s0357: {
    literal: 'That winter there was no snow.',
    idiomatic: 'Snow failed that winter.',
  },
  s0358: {
    literal: 'Dali 2, in the first month of spring, on renzi new moon.',
    idiomatic: 'First month of spring, Dali 2, renzi new moon.',
  },
  s0359: {
    literal:
      'On dingsi a secret edict ordered Guannei and Hedong deputy commander-in-chief Guo Ziyi to ready troops to attack Zhou Zhiguang.',
    idiomatic:
      'On dingsi Guo Ziyi was secretly ordered to crush Zhou Zhiguang.',
  },
  s0360: {
    literal: 'On renxu Zhou Zhiguang was demoted to Fengzhou prefect.',
    idiomatic: 'On renxu Zhiguang was demoted to Fengzhou.',
  },
  s0361: {
    literal:
      'On jiazi Vice Minister of War Zhang Zhongguang was made Huazhou prefect and Tong Pass defense commissioner; Grand Court Judge Jing Kuo was made Tongzhou prefect and Changchun Palace and the like commissioner.',
    idiomatic:
      'On jiazi new commanders were set over Hua and Tong.',
  },
  s0362: {
    literal:
      'That day Zhou Zhiguang\'s camp officers beheaded Zhiguang and his sons Yuanyao and Yuanqian — three heads — and presented them in succession.',
    idiomatic:
      'That day his own officers sent Zhiguang\'s head and those of two sons.',
  },
  s0363: {
    literal: 'On jisi an edict set three thousand troops at Tong Pass.',
    idiomatic: 'On jisi Tong Pass received three thousand men.',
  },
  s0364: {
    literal: 'On guiyou an edict:',
    idiomatic: 'On guiyou an edict stated:',
  },
  s0365: {
    literal:
      'On dingchou Weizhou was elevated to metropolitan prefecture; on wuyin an order stated: "Tong and Hua two prefectures, lately seized by bandits, people\'s strength withered — they should receive two years\' restoration, all exemptions.',
    idiomatic:
      'On dingchou Wei became a metropolis; on wuyin Tong and Hua were tax-free for two years.',
  },
  s0366: {
    literal:
      '」 On gengchen princes, imperial clan, and commandery and county princesses\' households were forbidden to marry or befriend military generals — the Censorate was ordered to investigate and impeach.',
    idiomatic:
      'Thus ended the order. On gengchen imperial kin were forbidden to marry generals under censor scrutiny.',
  },
  s0367: {
    literal: 'In the second month, on renwu, he visited Kunming Pond for spring outing.',
    idiomatic: 'Second month: spring outing at Kunming Pond.',
  },
  s0368: {
    literal:
      'On bingxu Huazhou gate officers Yao Huai and Li Yanjun were enfeoffed Prince of Ganyi commandery and Prince of Chenghua commandery — for beheading Zhiguang\'s merit.',
    idiomatic:
      'On bingxu two officers who killed Zhiguang were enfeoffed as princes.',
  },
  s0369: {
    literal: 'Guo Ziyi came to court from Hezhong.',
    idiomatic: 'Guo Ziyi came from Hezhong for audience.',
  },
  s0370: {
    literal:
      'On guimao Chancellor Yuan Zai, Wang Jin, Left Vice Director Pei Mian, Households Vice Minister Diwu Qi, and Jingzhao prefect Li Gan each contributed three hundred thousand cash and set a feast at Ziyi\'s residence.',
    idiomatic:
      'On guimao the court feasted Guo Ziyi, each minister giving three hundred thousand cash.',
  },
  s0371: {
    literal: 'In the third month, on xinhai night, a great wind.',
    idiomatic: 'Third month, xinhai night: a gale.',
  },
  s0372: {
    literal: 'On dingsi Hezhong prefecture presented a black fox.',
    idiomatic: 'On dingsi Hezhong sent a black fox as tribute.',
  },
  s0373: {
    literal: 'Bian-Song military commissioner Tian Shenggong came to court.',
    idiomatic: 'Tian Shenggong of Bian-Song came to court.',
  },
  s0374: {
    literal:
      'On wuchen Heir Apparent Junior Tutor Li Zun was demoted to Yongzhou assistant prefect — the crime was corruption.',
    idiomatic:
      'On wuchen Li Zun was exiled to Yongzhou for graft.',
  },
  s0375: {
    literal:
      'On jiaxu Yu Chao\'en feasted Ziyi, chancellors, military commissioners, revenue commissioner, and Jingzhao prefect at his private residence.',
    idiomatic:
      'On jiaxu Yu Chao\'en hosted the court elite at his mansion.',
  },
  s0376: {
    literal: 'On yihai Ziyi also set a feast at his residence.',
    idiomatic: 'On yihai Guo Ziyi returned the feast.',
  },
  s0377: {
    literal: 'On wuyin Tian Shenggong feasted at his residence.',
    idiomatic: 'On wuyin Tian Shenggong held his own banquet.',
  },
  s0378: {
    literal:
      'At the time because Ziyi was the founding minister and bandit trouble gradually pacified, they trod the king\'s transforming influence — thus wine feasts were set in succession.',
    idiomatic:
      'With rebellion fading, the realm celebrated its surviving hero in a round of banquets.',
  },
  s0379: {
    literal: 'When wine was deep, all danced.',
    idiomatic: 'Deep in wine, everyone danced.',
  },
  s0380: {
    literal: 'Dukes, ministers, and great officials arrayed at the mats numbered a hundred men.',
    idiomatic: 'A hundred dignitaries shared the mats.',
  },
  s0381: {
    literal: 'A single feast by Ziyi, Chao\'en, and Shenggong cost up to one hundred thousand strings.',
    idiomatic: 'Each banquet cost up to a hundred thousand strings.',
  },
  s0382: {
    literal:
      'In the fourth month of summer, on jihai, Jiangnan West overall training and observation commissioner and Hongzhou prefect Li Mian was made Jingzhao prefect; Vice Minister of Punishments Wei Shaoyou was made Hongzhou prefect, concurrent Censor-in-Chief, and Jiangxi observation and training commissioner.',
    idiomatic:
      'Summer fourth month: Li Mian came to the capital; Wei Shaoyou went to Jiangxi.',
  },
  s0383: {
    literal: 'On gengzi Chancellor and inner attendant Yu Chao\'en allied with Tibet at Xingqing Temple.',
    idiomatic: 'On gengzi Yu Chao\'en renewed the Tibetan alliance at Xingqing Temple.',
  },
  s0384: {
    literal: 'On bingwu Tian Shenggong was advanced acting Right Vice Director.',
    idiomatic: 'On bingwu Tian Shenggong became acting right vice director.',
  },
  s0385: {
    literal:
      'On guiyou Vice Minister of Works Xu Hao was made Guangzhou prefect and Lingnan military and observation commissioner.',
    idiomatic:
      'On guiyou Xu Hao was sent to Lingnan.',
  },
  s0386: {
    literal:
      'In the sixth month, on wuxu, Shannan and Jiannan deputy commander-in-chief Du Hongjian entered court from Shu.',
    idiomatic:
      'Sixth month: Du Hongjian arrived from Sichuan.',
  },
  s0387: {
    literal:
      'On renyin Jingnan military commissioner Wei Boyu was enfeoffed Prince of Chengyang commandery.',
    idiomatic:
      'On renyin Wei Boyu became Prince of Chengyang.',
  },
  s0388: {
    literal: 'On guimao Censor-in-Chief Wang Yi died.',
    idiomatic: 'On guimao Wang Yi died.',
  },
  s0389: {
    literal:
      'In the seventh month, on wushen new moon, Right Palace Companion Yu Xiulie was made acting Minister of Works, knowing ministry affairs.',
    idiomatic:
      'Seventh month: Yu Xiulie became acting minister of works in charge of the ministries.',
  },
  s0390: {
    literal:
      'At the time many frontier merit-holders advanced to the Eight Seats were not regular appointees.',
    idiomatic:
      'Many frontier generals held ministry seats without regular appointment.',
  },
  s0391: {
    literal: 'Court orders for regular appointees used the title "knowing ministry affairs."',
    idiomatic: 'Regular ministers were styled as "knowing affairs."',
  },
  s0392: {
    literal: 'Secretariat Drafter Zhang Yanshang was made acting Henan prefect.',
    idiomatic: 'Zhang Yanshang became acting Henan prefect.',
  },
  s0393: {
    literal:
      'On bingyin Jiannan West River campaign chief of staff Cui Gan was made Jiannan West River military and observation commissioner; Suizhou prefect Du Ji was made Jiannan East River military and observation commissioner.',
    idiomatic:
      'On bingyin Cui Gan and Du Ji received full Sichuan commands.',
  },
  s0394: {
    literal: 'Hangzhou prefect Zhang Boyi was made Protector-General of Annan.',
    idiomatic: 'Zhang Boyi became protector of Annan.',
  },
  s0395: {
    literal: 'On guiyou Yantang county of Daozhou was split to establish Dali county.',
    idiomatic: 'On guiyou Dali county was carved from Daozhou.',
  },
  s0396: {
    literal: 'On jiaxu at the you hour white vapor filled the sky.',
    idiomatic: 'On jiaxu white mist stretched across the heavens at dusk.',
  },
  s0397: {
    literal: 'In the eighth month, on gengchen, Fengxiang military commissioner Li Baoyu came to court.',
    idiomatic: 'Eighth month: Li Baoyu came to court.',
  },
  s0398: {
    literal: 'On renwu the moon entered Di.',
    idiomatic: 'On renwu the moon entered the mansion Di.',
  },
  s0399: {
    literal: 'On bingxu Bohai presented tribute.',
    idiomatic: 'On bingxu Bohai sent tribute.',
  },
  s0400: {
    literal: 'On xinmao Tan and Heng suffered disaster from water.',
    idiomatic: 'On xinmao Tan and Heng flooded.',
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
if (data.metadata.chapter !== '011') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 011; standalone T ready (${Object.keys(T).length} entries).`
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
