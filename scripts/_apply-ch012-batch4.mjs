#!/usr/bin/env node
/** Batch 4: s0301–s0400 (Jiutangshu ch.012, Dezong 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
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
    literal: "Thus ended the edict. All were Longyou governors who died in Tibet since Zhide; now, with western peace, they could be buried at last.",
    idiomatic: "Thus ended the edict: Longyou men lost in Tibet were honored as the west reopened.",
  },
  s0302: {
    literal: "On dingyou Hedong commissioner Ma Sui was made associate; Zelu Li Baozhen acting Right Vice Director; Heyang Li Qi acting War Minister; Shence commander Li Sheng Right Palace Attendant — reward for defeating Tian Yue.",
    idiomatic: "On dingyou Ma Sui, Li Baozhen, Li Qi, and Li Sheng were promoted for beating Tian Yue.",
  },
  s0303: {
    literal: "On yisi Households Vice Minister Du You was demoted to Suzhou prefect; Secretariat Drafter Zhao Zan became Households Vice Minister and revenue judge.",
    idiomatic: "On yisi Du You fell; Zhao Zan took revenue.",
  },
  s0304: {
    literal: "On xinhai Yi-Ding circuit was named the Yiwu army.",
    idiomatic: "On xinhai Yi-Ding became the Yiwu army.",
  },
  s0305: {
    literal: "Sixth month, dingsi: Left Secretariat Director Yu Zhun died.",
    idiomatic: "Sixth month: Yu Zhun died.",
  },
  s0306: {
    literal: "On jiazi the capital earthquake.",
    idiomatic: "On jiazi Chang'an shook.",
  },
  s0307: {
    literal: "Left Palace Attendant Li Han was made envoy to mourn the Uyghurs; Jingzhao Vice Prefect Yuan Xiu was made Chamberlain for the Imperial Clan.",
    idiomatic: "Li Han mourned the Uyghurs; Yuan Xiu became chamberlain.",
  },
  s0308: {
    literal: "On wuyin former Quzhou prefect Zhao Juan was made Left Secretariat Director; Right Subaltern Liu Zai Right Director.",
    idiomatic: "On wuyin Zhao Juan and Liu Zai became left and right directors.",
  },
  s0309: {
    literal: "On xinwei Zhu Tao and Wang Wujun marched to rescue Tian Yue north of Weizhou.",
    idiomatic: "On xinwei Zhu Tao and Wang Wujun reinforced Tian Yue.",
  },
  s0310: {
    literal: "That day Li Huai'guang's troops also arrived; Ma Sui, Li Baozhen, and Li Qi arrayed grandly to welcome Huai'guang.",
    idiomatic: "Li Huai'guang arrived; Ma Sui and allies staged a grand welcome.",
  },
  s0311: {
    literal: "Zhu Tao feared a surprise attack and rushed out; Huai'guang engaged west of Lianye Mountain — the imperial army fared ill and each withdrew to camp.",
    idiomatic: "Tao attacked; Huai'guang fought at Lianye Mountain and the court army retreated.",
  },
  s0312: {
    literal: "The rebels dammed the river and cut the grain route.",
    idiomatic: "Rebels flooded the river and starved the imperial supply line.",
  },
  s0313: {
    literal: "Seventh month, jiashen: former Zhenwu commissioner Wang Hong was made Jingzhao prefect; War Bureau Director Yang Zhen was made censor-in-chief and capital-region observer.",
    idiomatic: "Seventh month: Wang Hong became Jingzhao prefect; Yang Zhen capital observer.",
  },
  s0314: {
    literal: "Because merchant levies unsettled the people, on guisi an edict halted all collections except what was already stored; stored funds were registered and vouchers issued for later full refund.",
    idiomatic: "On guisi the merchant squeeze was stopped and deposits marked for refund.",
  },
  s0315: {
    literal: "On jiawu former Tongzhou prefect Xiao Fu was made War Vice Minister.",
    idiomatic: "On jiawu Xiao Fu became war vice minister.",
  },
  s0316: {
    literal: "On gengzi Ma Sui, Li Huai'guang, Li Baozhen, and Li Qi withdrew to guard Weiqiao.",
    idiomatic: "On gengzi the four generals fell back to Weiqiao.",
  },
  s0317: {
    literal: "Zhu Tao, Wang Wujun, and Tian Yue also camped southeast of Weiqiao, facing the imperial army across the river.",
    idiomatic: "Rebels camped across the river from the imperial host at Weiqiao.",
  },
  s0318: {
    literal: "From the fifth month there was no rain until jiachen when rain fell.",
    idiomatic: "Rain returned on jiachen after a drought since the fifth month.",
  },
  s0319: {
    literal: "Xuanwu commissioner Li Mian was made acting Grand Mentor; Huaining Li Xilie acting Minister of Works; Binning Li Huai'guang associate; Li Qi enfeoffed Prince of Kaiyang.",
    idiomatic: "Li Mian, Li Xilie, Huai'guang, and Li Qi received honors.",
  },
  s0320: {
    literal: "Eighth month, dingwei: Bian east and west land-water transport and two-tax salt-iron posts were first split — per revenue judge Zhao Zan's memorial.",
    idiomatic: "Eighth month: transport and salt offices were divided at Zhao Zan's urging.",
  },
  s0321: {
    literal: "On wuwu Grand Mentor to the Heir Diwu Qi died in office; on xinyou Jingyuan rear commander Yao Lingyan was made Jingyuan commissioner.",
    idiomatic: "Diwu Qi died; Yao Lingyan became Jingyuan commissioner.",
  },
  s0322: {
    literal: "On wuchen Jiang-Huai salt commissioner Bao Ji was made Bian-east land-water transport and two-tax salt commissioner.",
    idiomatic: "On wuchen Bao Ji took eastern transport and salt.",
  },
  s0323: {
    literal: "On jisi Sword-South West commissioner Zhang Yanshang was made acting Civil Offices Minister.",
    idiomatic: "On jisi Zhang Yanshang became acting civil offices minister.",
  },
  s0324: {
    literal: "On jiaxu Grand Court Vice Minister Cui Zong was made Bian-west land-water transport and two-tax salt commissioner.",
    idiomatic: "On jiaxu Cui Zong took western transport and salt.",
  },
  s0325: {
    literal: "On dingchou Rites commissioner Yan Zhenqing was made Grand Preceptor to the Heir.",
    idiomatic: "On dingchou Yan Zhenqing became grand preceptor to the heir.",
  },
  s0326: {
    literal: "On gengchen Xu-Hai-Yi training commissioner Li Wei died.",
    idiomatic: "On gengchen Li Wei died.",
  },
  s0327: {
    literal: "In Jiang-Huai a rumor spread of hairy men catching people and eating hearts — terror gripped the people.",
    idiomatic: "A Jiang-Huai rumor of man-eating 'hairy men' terrified the populace.",
  },
  s0328: {
    literal: "Ninth month, dinghai: Li Wei's officer Gao Chengzong was made Xuzhou prefect and Xu-Hai-Yi training commissioner.",
    idiomatic: "Ninth month: Gao Chengzong succeeded Li Wei at Xuzhou.",
  },
  s0329: {
    literal: "Revenue judge Zhao Zan memorialized to establish ever-normal light-and-heavy reserve funds in the two capitals, Jiangling, Chengdu, Bian, Su, Hong, and other prefectures.",
    idiomatic: "Zhao Zan proposed ever-normal granary funds in major prefectures.",
  },
  s0330: {
    literal: "From one million strings down to one hundred thousand, storing grain, cloth, and silk — selling when dear, buying when cheap to balance weight for the people's good.",
    idiomatic: "Funds would stabilize prices by buying cheap and selling dear.",
  },
  s0331: {
    literal: "It was granted.",
    idiomatic: "The plan was approved.",
  },
  s0332: {
    literal: "Zan then placed tax officers at ferry crossings — twenty cash per string on goods, one-tenth on bamboo, wood, tea, and lacquer to fund the reserves.",
    idiomatic: "Zan taxed goods at crossings to fill the ever-normal coffers.",
  },
  s0333: {
    literal: "On jihai night a fierce beast entered Yiyang ward, wounding two; at dawn it was captured.",
    idiomatic: "On jihai a beast wounded two in Yiyang ward before capture.",
  },
  s0334: {
    literal: "Tenth month of winter, xinhai: Hunan observer Heir of Cao Li Gao was made Hongzhou prefect and Jiangxi commissioner.",
    idiomatic: "Tenth month: Li Gao became Jiangxi commissioner.",
  },
  s0335: {
    literal: "On bingchen Civil Offices Vice Minister Guan Bo was made Secretariat Vice Director and associate.",
    idiomatic: "On bingchen Guan Bo entered the chancellery.",
  },
  s0336: {
    literal: "Court of Justice aide Fan Ze returned from Tibet; with Tibetan minister Shang Jiezan he agreed to ally at Qingshui on the first full moon of the coming year.",
    idiomatic: "Fan Ze arranged a Qingshui treaty meeting with Tibet.",
  },
  s0337: {
    literal: "On bingzi Prince of Su Xiang died.",
    idiomatic: "On bingzi the Prince of Su, Xiang, died.",
  },
  s0338: {
    literal: "Eleventh month, jimao: Shannan West commissioner Jia Dan was made acting Works Minister, concurrent Xiangzhou prefect, censor-in-chief, and Shannan East commissioner; Xing-Feng trainer Yan Zhen was made Liangzhou prefect and Shannan West commissioner.",
    idiomatic: "Eleventh month: Jia Dan and Yan Zhen swapped Shannan commands.",
  },
  s0339: {
    literal: "On jiawu former Shannan East commissioner Li Cheng was made Tanzhou prefect and Hunan observer.",
    idiomatic: "On jiawu Li Cheng became Hunan observer.",
  },
  s0340: {
    literal: "That month at Wei county the rebels Zhu Tao, Tian Yue, and Wang Wujun mutually praised one another and usurped royal titles.",
    idiomatic: "That month Hebei rebels proclaimed themselves kings at Wei.",
  },
  s0341: {
    literal: "Tao called himself King of Great Ji; Wujun King of Zhao; Yue King of Wei.",
    idiomatic: "Tao became King of Great Ji; Wujun and Yue took Zhao and Wei.",
  },
  s0342: {
    literal: "They urged Li Na to become King of Qi.",
    idiomatic: "They urged Li Na to proclaim Qi.",
  },
  s0343: {
    literal: "They appointed officials like the early princes' field headquarters.",
    idiomatic: "They copied early Tang princely headquarters in their titles.",
  },
  s0344: {
    literal: "On dingchou Li Xilie styled himself supreme commander under Heaven, Grand Preceptor, and King of Jianxing — joining Zhu Tao's four rebels in stubborn revolt.",
    idiomatic: "On dingchou Li Xilie declared himself king and allied with the Hebei rebels.",
  },
  s0345: {
    literal: "Jianzhong 4 — first month, wuyin new moon. (The source repeats the year numeral.)",
    idiomatic: "Jianzhong 4 opened on wuyin.",
  },
  s0346: {
    literal: "On dinghai Fengxiang commissioner Zhang Yi allied with Tibetan minister Shang Jiezan at Qingshui.",
    idiomatic: "On dinghai Zhang Yi and Tibet allied at Qingshui.",
  },
  s0347: {
    literal: "On gengyin Li Xilie took Ruzhou and seized prefect Li Yuanping — Luoyang was shaken.",
    idiomatic: "On gengyin Xilie took Ruzhou and terrified Luoyang.",
  },
  s0348: {
    literal: "On jiawu Yan Zhenqing was sent to reassure Li Xilie's army.",
    idiomatic: "On jiawu Yan Zhenqing went to parley with Xilie.",
  },
  s0349: {
    literal: "On wuxu Dragon Martial General Geshu Yao was made eastern-capital Ji-Ru commissioner, leading Fengxiang, Binning, Jingyuan, and other troops east against Xilie.",
    idiomatic: "On wuxu Geshu Yao marched east against Xilie from the northwest.",
  },
  s0350: {
    literal: "On bingwu Fujian observer Chang Gun died.",
    idiomatic: "On bingwu Chang Gun died.",
  },
  s0351: {
    literal: "Second month, wushen: the Heyang Three Cities army command was established.",
    idiomatic: "Second month: the Heyang army command was created.",
  },
  s0352: {
    literal: "On yimao Geshu Yao recovered Ruzhou.",
    idiomatic: "On yimao Geshu Yao retook Ruzhou.",
  },
  s0353: {
    literal: "On dingchou Works Vice Minister Jiang Zhen was made Rites commissioner.",
    idiomatic: "On dingchou Jiang Zhen became rites commissioner.",
  },
  s0354: {
    literal: "Third month, jimao: Qian prefecture was restored.",
    idiomatic: "Third month: Qian prefecture was restored.",
  },
  s0355: {
    literal: "On guiwei Left Palace Attendant Meng Hao was made Fujian united training observer.",
    idiomatic: "On guiwei Meng Hao became Fujian observer.",
  },
  s0356: {
    literal: "On xinmao Heir of Cao Li Gao defeated Li Xilie's officer Chen Zhi and recovered Huangzhou.",
    idiomatic: "On xinmao Li Gao beat Chen Zhi and retook Huang.",
  },
  s0357: {
    literal: "On dingyou Jingnan Zhang Boyi fought rebels and was defeated.",
    idiomatic: "On dingyou Zhang Boyi lost to the rebels.",
  },
  s0358: {
    literal: "Heir of Cao recovered Qizhou.",
    idiomatic: "Li Gao retook Qizhou.",
  },
  s0359: {
    literal: "Summer, fourth month, gengshen: Yongping-Xuanwu-Heyang commander-in-chief Li Mian was made Huai-Xi suppression commissioner; Xiangyang's Jia Dan and Jiangxi's Heir of Cao were his deputies.",
    idiomatic: "Fourth month: Li Mian led the Huai-Xi campaign with Jia Dan and Li Gao as deputies.",
  },
  s0360: {
    literal: "On jiazi the capital earthquake; yellow-white hair a foot long grew.",
    idiomatic: "On jiazi an earthquake grew foot-long yellow-white hair from the ground.",
  },
  s0361: {
    literal: "On bingzi Geshu Yao advanced to Ying Bridge; great thunder killed three or four tenths of his men — he withdrew to guard Xiangcheng.",
    idiomatic: "On bingzi thunder shattered Geshu Yao's army at Ying Bridge; he fell back to Xiangcheng.",
  },
  s0362: {
    literal: "Fifth month, xinsi night: the capital earthquake.",
    idiomatic: "Fifth month: Chang'an quaked at night.",
  },
  s0363: {
    literal: "On yiyou Prince of Ying Jun died.",
    idiomatic: "On yiyou Prince of Ying Jun died at court.",
  },
  s0364: {
    literal: "On yisi the Yellow River ran clear in Hua and Pu.",
    idiomatic: "On yisi the Yellow River ran unusually clear through Hua and Pu.",
  },
  s0365: {
    literal: "In Huazhou horses grew horns.",
    idiomatic: "Huazhou reported horses with horns — an omen.",
  },
  s0366: {
    literal: "Sixth month, gengxu: the building-frame and market-stall taxes were first levied.",
    idiomatic: "Sixth month: new housing and transfer taxes were imposed.",
  },
  s0367: {
    literal: "Ma Sui, Li Huai'guang, Li Baozhen, and Li Qi camped at Wei county; Li Sheng at Yiding; Li Mian, Chen Shaoyou, and Geshu Yao between Huai and Ru; Shence armies lined the rebel border.",
    idiomatic: "Imperial armies ringed the rebels from Wei to Ru.",
  },
  s0368: {
    literal: "All troops abroad were fed by the revenue office — \"cross-border grain\" costing 1.3 million strings monthly; Zhao Zan's exactions still could not supply them.",
    idiomatic: "Cross-border rations cost 1.3 million strings a month; Zhao Zan's levies failed.",
  },
  s0369: {
    literal: "Now housing was taxed too — clerks with brush and abacus entered homes to tally; harsh law filled the empire with lament.",
    idiomatic: "Tax clerks counted houses door to door amid empire-wide grief.",
  },
  s0370: {
    literal: "Seventh month, jiashen: Director of Education Li Hui was made Rites Vice Minister and his rank restored.",
    idiomatic: "Seventh month: Li Hui regained rank as rites vice minister.",
  },
  s0371: {
    literal: "On jiawu Li Hui was made Left Vice Director, concurrent Censor-in-Chief, and envoy to the Tibetan treaty at Qingshui.",
    idiomatic: "On jiawu Li Hui became left director and treaty envoy.",
  },
  s0372: {
    literal: "Eighth month, dingwei: Li Xilie led thirty thousand men against Geshu Yao at Xiangcheng.",
    idiomatic: "Eighth month: Xilie besieged Geshu Yao at Xiangcheng.",
  },
  s0373: {
    literal: "Hunan observer Li Cheng died.",
    idiomatic: "Li Cheng died.",
  },
  s0374: {
    literal: "Ninth month, wuyin: a dragon appeared in Ruzhou's moat.",
    idiomatic: "Ninth month: a dragon was seen in Ruzhou's moat.",
  },
  s0375: {
    literal: "On bingxu Li Mian's Tang Hanchen and Liu Dexin were defeated at Hujian — Bian armies never recovered; Luoyang was desperate.",
    idiomatic: "On bingxu Li Mian lost at Hujian; Luoyang teetered.",
  },
  s0376: {
    literal: "Tenth month, bingwu: an edict ordered Jingyuan commissioner Yao Lingyan to lead Jingyuan troops to rescue Geshu Yao.",
    idiomatic: "Tenth month: Yao Lingyan's Jingyuan army was sent to relieve Xiangcheng.",
  },
  s0377: {
    literal: "On dingwei the Jingyuan army left the capital; at Chan water they mutinied — Yao Lingyan could not stop them.",
    idiomatic: "On dingwei Jingyuan troops mutinied at Chan water.",
  },
  s0378: {
    literal: "The emperor sent two carts of silk to comfort them; Prince of Jin went to plead — the mutineers were already at Danfeng Gate demanding Shence resistance.",
    idiomatic: "Silk gifts failed; mutineers faced Danfeng Gate.",
  },
  s0379: {
    literal: "Not one Shence soldier came.",
    idiomatic: "No Shence troops answered.",
  },
  s0380: {
    literal: "With the heir, consorts, and more than a hundred kin he fled the northern park gate; Right Dragon Martial commander Linghu Jian, drilling archers, heard the alarm and gathered four hundred bowmen to escort.",
    idiomatic: "The court fled north; Linghu Jian rallied four hundred archers as escort.",
  },
  s0381: {
    literal: "That evening they reached Xianyang, ate a few bites, and passed on.",
    idiomatic: "At Xianyang they ate briefly and pressed on.",
  },
  s0382: {
    literal: "On wushen they reached Fengtian.",
    idiomatic: "On wushen the fugitive court reached Fengtian.",
  },
  s0383: {
    literal: "On jiyou Marshal Deputy Hun Jian brought kin and household — he was made camp deputy; Shence commander Bai Zhizhen camp marshal; Linghu Jian middle-army drum-and-conch officer; Golden Guard general Hou Zhongzhuang Fengtian defense commander.",
    idiomatic: "On jiyou Hun Jian and Bai Zhizhen organized Fengtian's defense.",
  },
  s0384: {
    literal: "The mutineers plundered the capital and camped at Baihua, then welcomed Zhu Ci as commander at Jinchang Lane — he styled himself Grand Preceptor and occupied Hanyuan Hall.",
    idiomatic: "Mutineers made Zhu Ci emperor in Hanyuan Hall.",
  },
  s0385: {
    literal: "Fengtian was cramped; the emperor wished to go to Fengxiang — on renzi Fengxiang mutinied and killed Zhang Yi, so he stopped.",
    idiomatic: "A planned flight to Fengxiang ended when Fengxiang killed Zhang Yi.",
  },
  s0386: {
    literal: "On guichou Li Xilie took Xiangcheng; Geshu Yao fled to Luoyang.",
    idiomatic: "On guichou Xilie took Xiangcheng; Geshu Yao fled.",
  },
  s0387: {
    literal: "On yimao posthumous honors were granted for Acting Minister of Works Cui Ning.",
    idiomatic: "On yimao Cui Ning received posthumous honors.",
  },
  s0388: {
    literal: "On dingsi Civil Offices Minister Xiao Fu, Punishments Vice Minister Liu Congyi, and Remonstrance Grand Master Jiang Gongfu were all made associates while keeping their posts.",
    idiomatic: "On dingsi Xiao Fu, Liu Congyi, and Jiang Gongfu joined the chancellery.",
  },
  s0389: {
    literal: "Binning commissioner Han Yougui and Lun Weiming led three thousand men — just entering Fengtian when rebels arrived; they went out to fight and the court army fared ill.",
    idiomatic: "Han Yougui's relief force fought rebels at Fengtian and lost.",
  },
  s0390: {
    literal: "Rebels pressed the assault from mao to wu hour, killing nearly half; straw carts outside the gate were burned by Hun Jian's order and the enemy withdrew.",
    idiomatic: "Rebels nearly broke Fengtian until Hun Jian burned straw carts at the gate.",
  },
  s0391: {
    literal: "On guisi Zhu Ci attacked on three sides; Hun Jian fought them off and they withdrew.",
    idiomatic: "On guisi Hun Jian repelled a three-sided assault.",
  },
  s0392: {
    literal: "Grand General Lü Xiqian died in the fighting.",
    idiomatic: "Lü Xiqian fell in the siege.",
  },
  s0393: {
    literal: "From dingwei the siege ran twenty-plus days to jisi without cease of arrows and stones.",
    idiomatic: "The siege rained missiles for twenty days.",
  },
  s0394: {
    literal: "Eleventh month, yihai: Longyou aide Wei Gao was made Long prefect, concurrent censor-in-chief, and Fengyi army commissioner.",
    idiomatic: "Eleventh month: Wei Gao became Fengyi commissioner.",
  },
  s0395: {
    literal: "Lingwu rear Du Xiquan, Yan prefect Dai Xiuyan, and Xia prefect Shi Changchun united six thousand reinforcements — at Mogu valley rebels defeated them and they retreated.",
    idiomatic: "Six thousand reinforcements were crushed at Mogu.",
  },
  s0396: {
    literal: "Rebels pressed harder; arrows fell like rain, casualties mounted, hearts wavered — the emperor and Hun Jian wept face to face.",
    idiomatic: "As casualties mounted, emperor and Hun Jian wept together.",
  },
  s0397: {
    literal: "Zhu Ci held music on Qianling, looking down on the city with insults.",
    idiomatic: "Zhu Ci mocked Fengtian from Qianling.",
  },
  s0398: {
    literal: "On wuzi rebels built a cloud-bridge against the northeast corner — weapons could not reach it; terror spread.",
    idiomatic: "On wuzi a cloud-bridge threatened the northeast wall.",
  },
  s0399: {
    literal: "Hun Jian had dug a tunnel; when the bridge reached the wall its feet sank — he ordered it burned; wind blew flames back and the bridge burned while rebels fled.",
    idiomatic: "Hun Jian burned the cloud-bridge and drove rebels back.",
  },
  s0400: {
    literal: "Shuofang deputy Li Huai'guang sent Commander Zhang Shao with a memorial that the great army was coming — they paraded Zhang Shao on the wall; cheers shook the earth; rebels hesitated and slackened the siege.",
    idiomatic: "Zhang Shao's cry that Huai'guang was coming shook rebel morale.",
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
