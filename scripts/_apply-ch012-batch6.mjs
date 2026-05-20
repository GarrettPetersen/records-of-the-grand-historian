#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.012, Dezong 1 — return to Chang'an, Li Huai'ang edict, Zhenyuan 1) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/012.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 501;
const END = 600;

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
  s0501: {
    literal: 'It was granted.',
    idiomatic: 'The emperor granted the request.',
  },
  s0502: {
    literal: 'On wuwu the imperial carriage returned to the capital, setting out from Xingyuan; that day great rain, and on entering Xiegu the sky cleared — attendants and soldiers rejoiced, taking it as Heaven\'s aid.',
    idiomatic: 'On wuwu the court left Xingyuan for Chang\'an in heavy rain; at Xiegu the skies cleared, and officials and troops took it as a sign from Heaven.',
  },
  s0503: {
    literal: 'Autumn, seventh month, bingzi: the imperial carriage halted at Fengxiang Prefecture; an edict remitted this year\'s autumn tax within the circuit;',
    idiomatic: 'In the seventh month, on bingzi, the emperor paused at Fengxiang and remitted the circuit\'s autumn levy.',
  },
  s0504: {
    literal: 'The aged and those attending the elderly eighty and above were each given placard appointment as prefect, granted purple; the rest placard appointment as senior aides, granted scarlet;',
    idiomatic: 'Men eighty and older received placard appointments as prefects with purple robes; others received aide appointments in scarlet.',
  },
  s0505: {
    literal: 'Prefectures and counties were to post transit officials; on term completion they were released for selection.',
    idiomatic: 'Transit officers were posted in each prefecture and county and released for office after their terms.',
  },
  s0506: {
    literal: 'Qiao Lin, Jiang Zhen, Zhang Guangcheng, Li Tong, and Jiang Jinjian — officials who had accepted rebel appointments — were executed.',
    idiomatic: 'Qiao Lin, Jiang Zhen, Zhang Guangcheng, Li Tong, and Jiang Jinjian, who had served under the rebels, were put to death.',
  },
  s0507: {
    literal: 'Zhu Ci killed seventy-seven commandery princes, princes, and imperial grandsons at Ma Lin\'s residence; on dingchou the authorities were ordered to perform rites for the slain and inter them at Jingyu Temple.',
    idiomatic: 'Zhu Ci murdered seventy-seven kinsmen of the throne at Ma Lin\'s house; on dingchou their bodies were given funeral rites at Jingyu Temple.',
  },
  s0508: {
    literal: 'On gengchen an edict was issued:',
    idiomatic: 'On gengchen an edict addressed Li Huai\'ang and the Shuofang army — recalling his service at Fengtian, reproaching his later treason, yet offering pardon if he came to court within three days.',
  },
  s0509: {
    literal: 'On renwu he arrived from Xingyuan.',
    idiomatic: 'On renwu the emperor entered the capital from Xingyuan.',
  },
  s0510: {
    literal: 'At the time Hun Jian, Han Yougui, and Dai Xiuyan escorted with their troops; Li Sheng, Luo Yuanguang, and Shang Keji welcomed with theirs — infantry and cavalry over a hundred thousand, banners and flags stretching for tens of li; capital residents, monks, and nuns shouted and wept with emotion.',
    idiomatic: 'Hun Jian, Han Yougui, and Dai Xiuyan marched in escort; Li Sheng, Luo Yuanguang, and Shang Keji led the welcoming host — more than a hundred thousand horse and foot, banners filling miles of road while citizens and clergy wept and cheered.',
  },
  s0511: {
    literal: 'Li Sheng met him at Sanqiao, himself stating the fault of recovering the city late, prostrating himself to beg punishment; the emperor comforted and dismissed him.',
    idiomatic: 'At Sanqiao Li Sheng prostrated himself, blaming the delay in retaking the city; the emperor consoled him and sent him on.',
  },
  s0512: {
    literal: 'On dinghai the Hezhong pacification commissioner Kong Chaofu and the eunuch Dan Shouying were both killed by Huai\'ang.',
    idiomatic: 'On dinghai Kong Chaofu, sent to pacify Hezhong, and the eunuch Dan Shouying were murdered by Li Huai\'ang.',
  },
  s0513: {
    literal: 'On xinmao he ascended Danfeng Tower and proclaimed a great amnesty for all under Heaven.',
    idiomatic: 'On xinmao he proclaimed universal amnesty from Danfeng Tower.',
  },
  s0514: {
    literal: 'Li Sheng was granted a mansion in Yongchong Ward and eight female musicians.',
    idiomatic: 'Li Sheng received a house in Yongchong Ward and eight palace musicians.',
  },
  s0515: {
    literal: 'On jiawu the emperor ordered chancellors and generals to escort Sheng into his newly granted residence.',
    idiomatic: 'On jiawu chancellors and commanders escorted Sheng to his new mansion.',
  },
  s0516: {
    literal: 'Music from the Music Bureau, provisions and feasts supplied by the Capital Metropolitan Prefecture, drums and pipes leading the procession — the capital regarded it as a spectacle of glory.',
    idiomatic: 'Court musicians, a feast from the metropolitan prefecture, and a brass procession made the capital turn out to watch.',
  },
  s0517: {
    literal: 'Eighth month, xinchou: an edict ordered the authorities to erect a stele and temple for the late Grandee of the Court Duan Xiushi.',
    idiomatic: 'In the eighth month, on xinchou, the court ordered a stele and shrine for the posthumously enfeoffed Duan Xiushi.',
  },
  s0518: {
    literal: 'The Ziqing military commissioner had previously also held the posts of overseer of land-and-sea transport and commissioner for Silla and Bohai; Li Na was now to hold these concurrently.',
    idiomatic: 'Li Na was given the Ziqing command plus oversight of sea transport and the Silla–Bohai missions formerly borne by that post.',
  },
  s0519: {
    literal: 'On guimao Grand Master of the Court, Grand Secretariat Director, Prince of Hechuan Li Sheng was additionally made Fengxiang prefect, commissioned as Fengxiang-Longyou military commissioner and deputy commander-in-chief of the Jingyuan, Four Garrisons, and Beiting campaign forces, and enfeoffed Prince of Xiping commandery.',
    idiomatic: 'On guimao Li Sheng became Fengxiang prefect, deputy supreme commander on the northwest front, and Prince of Xiping.',
  },
  s0520: {
    literal: 'Hedong Baoning Army military commissioner, Taiyuan prefect, northern capital protector, acting Grand Master of the Court, Grand Secretariat Associate, Prince of Beiping Ma Sui was made deputy commander-in-chief of the Fengcheng Army Jin-jiang-ci-li campaign;',
    idiomatic: 'Ma Sui of Hedong was named deputy commander for the campaign against Li Huai\'ang in Jin, Jiang, Ci, and Li.',
  },
  s0521: {
    literal: 'Lingzhou-Salt military commissioner, Palace Attendant, concurrent chief administrator of Lingzhou, Prince of Loufan Hun Jian was made Hezhong prefect, Jin-jiang military commissioner, and deputy commander-in-chief of Hezhong, Tong, Shan, and Guo and attached campaign forces, and enfeoffed Prince of Xianning commandery.',
    idiomatic: 'Hun Jian was shifted to Hezhong as commissioner and deputy commander on the Huai\'ang front, taking the title Prince of Xianning.',
  },
  s0522: {
    literal: 'At the time Jian and Ma Sui were each ordered to take the field against Huai\'ang for this reason.',
    idiomatic: 'Both men were sent out because the court was moving against Li Huai\'ang.',
  },
  s0523: {
    literal: 'On jiachen the Golden Guards grand general Du Xiquan was made chief administrator of Lingzhou and commissioner of the Western Surrender City, Tiande Army, Ling-Salt, Xiang, and Xia circuits plus garrison-farming;',
    idiomatic: 'On jiachen Du Xiquan took Lingzhou and the northwest garrisons from Xiang to Xia.',
  },
  s0524: {
    literal: 'Tong-jiang military commissioner Tang Chaochen was made Yan-Fang-Dan-Yan military commissioner.',
    idiomatic: 'Tang Chaochen became commissioner of Yan, Fang, Dan, and Yan.',
  },
  s0525: {
    literal: 'Baoyi Army military commissioner and Fengxiang prefect Li Chulin was made grand general of the Golden Guards.',
    idiomatic: 'Li Chulin of Baoyi was made a Golden Guards grand general.',
  },
  s0526: {
    literal: 'Fengyi Army military commissioner and Longzhou prefect Wei Gao was made grand general of the Left Golden Guards.',
    idiomatic: 'Wei Gao of Fengyi became grand general of the Left Golden Guards.',
  },
  s0527: {
    literal: 'On wushen Fengtian campaign commissioner Dai Xiuyan was made commander of the Left Dragon Martial Guard.',
    idiomatic: 'On wushen Dai Xiuyan was appointed commander of the Left Dragon Martial Guard.',
  },
  s0528: {
    literal: 'On jiyou Prince of Yan Li Bin, Prince of Sui Li Xun, and the Princess of Xiping died; court was suspended.',
    idiomatic: 'On jiyou three royals died and mourning closed the court.',
  },
  s0529: {
    literal: 'On jiwei former Huzhou prefect Yuan Gao was made supervising censor.',
    idiomatic: 'On jiwei Yuan Gao, former prefect of Huzhou, became a supervising censor.',
  },
  s0530: {
    literal: 'Ninth month, gengwu: Director of the Imperial Clan Li Wan died.',
    idiomatic: 'In the ninth month, on gengwu, Director of the Imperial Clan Li Wan died.',
  },
  s0531: {
    literal: 'Hun Jian was granted a mansion in Daning Ward and five female musicians; an edict ordered chancellors and generals to present music and gifts as in the precedent for escorting Li Sheng to his residence.',
    idiomatic: 'Jian received a Daning Ward mansion and five musicians, with the same ceremonial send-off given Li Sheng.',
  },
  s0532: {
    literal: 'On renwu the late retired Right Vice Director Li Han was posthumously made Grand Mentor to the Heir Apparent.',
    idiomatic: 'On renwu the retired Li Han was posthumously made grand mentor to the heir.',
  },
  s0533: {
    literal: 'On yihai Wang Wujun was advanced to acting Grand Master of the Court and Li Baozhen to acting Minister of Works, each granted five hundred households of substantive fief — rewarding the defeat of Zhu Tao.',
    idiomatic: 'On yihai Wang Wujun and Li Baozhen were promoted and given enlarged fiefs for crushing Zhu Tao.',
  },
  s0534: {
    literal: 'On jiashen former Lingnan military commissioner Yuan Xiu was made Vice Minister of Revenue and charged with fiscal affairs.',
    idiomatic: 'On jiashen Yuan Xiu became vice minister of revenue in charge of the treasury.',
  },
  s0535: {
    literal: 'On dinghai the emperor, turning to the chancellors, said: "Though the great rebels are gone, the times remain hard; we should widely extend reception to reach the feelings below.',
    idiomatic: 'On dinghai the emperor told his chancellors: "The great rebels are gone, yet troubles remain — we must hear more from below.',
  },
  s0536: {
    literal: 'Recently remonstrating officials have offered no memorials; from now on, at every regular audience and at sessions in the Yanying Hall, let two or three court officials regularly report gains and faults in current policy, that there may be broad benefit."',
    idiomatic: 'Remonstrators have fallen silent. Hereafter, at regular audiences and in the Yanying Hall, two or three officials should speak on policy each day."',
  },
  s0537: {
    literal: '" That autumn locusts and grasshoppers covered the wilds; grass and trees were left with nothing.',
    idiomatic: 'That autumn locusts blackened the fields until not a blade of grass remained.',
  },
  s0538: {
    literal: 'Winter, tenth month, yichou: Ma Sui recovered Jiang Prefecture.',
    idiomatic: 'In the tenth winter month, on yichou, Ma Sui retook Jiangzhou.',
  },
  s0539: {
    literal: 'On wuchen the eunuchs Dou Wenchang and Wang Xiqian were ordered to supervise the Left and Right Divine Strategy Armies as directors knowing military affairs.',
    idiomatic: 'On wuchen eunuchs Dou Wenchang and Wang Xiqian were placed over the Divine Strategy Armies.',
  },
  s0540: {
    literal: 'Intercalary month, gengwu, an edict stated: "We rule the myriad regions yet have failed in the way of a ruler; arms have not ceased for five years now.',
    idiomatic: 'On the intercalary gengwu an edict opened: "Five years of war show I have failed as ruler.',
  },
  s0541: {
    literal: 'We pity the people\'s toil and regret campaigns of punishment.',
    idiomatic: 'I pity the people\'s labor and regret these wars.',
  },
  s0542: {
    literal: 'Yet Li Xilie scorned righteousness, cast off virtue, turned against the Way, and tyrannized men.',
    idiomatic: 'Yet Li Xilie has scorned duty and ravaged the people.',
  },
  s0543: {
    literal: 'We mourn those living beings trapped in fire and charcoal.',
    idiomatic: 'I mourn those trapped in his devastation.',
  },
  s0544: {
    literal: 'Reverently wishing to save all things, We do not shrink from humbling Ourselves — therefore at the year\'s start We specially issued a new order, pardoning crimes warranting death, treating him with utmost sincerity.',
    idiomatic: 'To save them I humbled myself — at New Year I pardoned capital crimes and dealt with him in good faith.',
  },
  s0545: {
    literal: 'Our envoy had barely reached the suburbs when the great villain already heard of his usurpation.',
    idiomatic: 'My envoy had scarcely left the suburbs when Xilie declared himself ruler.',
  },
  s0546: {
    literal: 'His cruelty grew worse; his swallowing knew no satiety.',
    idiomatic: 'His cruelty deepened and his appetite for conquest grew.',
  },
  s0547: {
    literal: 'Generals and ministers alike burned with indignation, submitting memorial after memorial firmly begging to attack and remove him.',
    idiomatic: 'Ministers and generals begged in memorial after memorial to destroy him.',
  },
  s0548: {
    literal: 'We take Heaven\'s punishment as removing harm to the people; once arms are joined, jade and stone are hard to distinguish.',
    idiomatic: 'Heaven\'s punishment should spare the people, yet once armies clash the innocent suffer with the guilty.',
  },
  s0549: {
    literal: 'Thinking of meritorious ministers forcibly constrained, though We wished reform, there was no way;',
    idiomatic: 'Meritorious men were dragooned into his ranks; though I wished to spare them, I could not tell friend from foe.',
  },
  s0550: {
    literal: 'stained for life, bearing grievance into the grave, ruined and left to run wild — truly it can pain one.',
    idiomatic: 'Many were ruined for life — a grief that cuts to the bone.',
  },
  s0551: {
    literal: 'How can guilt rest on one man yet poison flow to ten thousand households — as father and mother to the people, how could We not feel shame in Our breast!',
    idiomatic: 'Shall one man\'s crime poison the realm? As father of the people, I am ashamed.',
  },
  s0552: {
    literal: 'Let every circuit military commissioner clearly proclaim and instruct: guilt stops at the chief culprit; all who were coerced are entirely not to be questioned."',
    idiomatic: 'Let every commissioner proclaim: only the ringleader is guilty; all who were forced into service are forgiven."',
  },
  s0553: {
    literal: 'Tang Chaochen memorialized the recovery of Yongle County.',
    idiomatic: 'Tang Chaochen reported the recapture of Yongle County.',
  },
  s0554: {
    literal: 'On guiyou the Right Dragon Martial grand general Li Guan was made Jingzhou prefect and Jingyuan military commissioner.',
    idiomatic: 'On guiyou Li Guan became Jingzhou prefect and Jingyuan commissioner.',
  },
  s0555: {
    literal: 'On yihai an edict stated: Song, Bo, Ziqing, Zelu, Hedong, Hengji, You, Yiding, and Weibo — eight circuits where locusts harmed and the people hungered — each circuit was granted fifty thousand shi of grain; Heyang and the eastern capital region each thirty thousand shi; the authorities were to transport and distribute at Chuzhou.',
    idiomatic: 'On yihai eight famine-struck circuits received fifty thousand shi of grain each; Heyang and the eastern capital region thirty thousand each, shipped via Chuzhou.',
  },
  s0556: {
    literal: 'On dingchou Li Sheng reached Jing Prefecture and executed military commissioner Tian Xijian, punishing him for killing Feng Heqing.',
    idiomatic: 'On dingchou Li Sheng executed Tian Xijian at Jingzhou for murdering Feng Heqing.',
  },
  s0557: {
    literal: 'On wuzi Xilie\'s general Li Cheng returned Huazhou to the state.',
    idiomatic: 'On wuzi Li Cheng surrendered Huazhou to the court.',
  },
  s0558: {
    literal: 'On jiawu Li Cheng was made Bianzhou prefect and Bian-Hua military commissioner and enfeoffed Prince of Wuwei commandery.',
    idiomatic: 'On jiawu Li Cheng became Bianzhou commissioner and Prince of Wuwei.',
  },
  s0559: {
    literal: 'Divine Strategy campaign military commissioner, acting Minister of the Right Li Shang Keji died.',
    idiomatic: 'Shang Keji, Fengyi prince and Divine Strategy commander, died.',
  },
  s0560: {
    literal: 'Eleventh month, guimao: Song-Bo military commissioner Liu Qia with Qu Huan defeated Xilie\'s forces at Chenzhou — thirty thousand captives beheaded or taken; the rebel general Zhai Chonghui was captured alive and presented.',
    idiomatic: 'In the eleventh month Liu Qia and Qu Huan destroyed thirty thousand of Xilie\'s men at Chenzhou and sent up Zhai Chonghui alive.',
  },
  s0561: {
    literal: 'On wuwu Liu Qia greatly defeated Xilie\'s forces and captured five of his false chancellors including Zheng Ben and presented them.',
    idiomatic: 'On wuwu Liu Qia routed Xilie again and sent up five captured false ministers including Zheng Ben.',
  },
  s0562: {
    literal: 'Xilie fled back to Caizhou; Bianzhou was pacified.',
    idiomatic: 'Xilie fled to Caizhou and Bianzhou was secured.',
  },
  s0563: {
    literal: 'On yichou Chancellor Xiao Fu thrice submitted memorials begging to be removed; it was granted.',
    idiomatic: 'On yichou Xiao Fu resigned after three petitions and was allowed to step down.',
  },
  s0564: {
    literal: 'Twelfth month, yihai: Huainan military commissioner, acting Minister of Works, Grand Secretariat Associate Chen Shaoyou died.',
    idiomatic: 'In the twelfth month Chen Shaoyou, Huainan commissioner and chancellor, died.',
  },
  s0565: {
    literal: 'Xiao Ding was posthumously made Grand Preceptor to the Heir Apparent.',
    idiomatic: 'Xiao Ding was posthumously made grand preceptor to the heir.',
  },
  s0566: {
    literal: 'Shouzhou prefect Zhang Jianfeng was made Hao-Shou regimental defense commissioner.',
    idiomatic: 'Zhang Jianfeng of Shouzhou became commissioner of Hao and Shou.',
  },
  s0567: {
    literal: 'On gengchen Vice Minister of Punishments Du Ya was made Yangzhou chief administrator and Huainan military commissioner; on wuzi Director of Personnel Cui Zao was made supervising censor.',
    idiomatic: 'On gengchen Du Ya became Huainan commissioner; on wuzi Cui Zao became a supervising censor.',
  },
  s0568: {
    literal: 'On xinmao Remonstrance Bureau Grandee Lu Zhi was made Secretariat Drafter, continuing as Hanlin academician.',
    idiomatic: 'On xinmao Lu Zhi became a drafter while remaining Hanlin academician.',
  },
  s0569: {
    literal: 'An edict stated: Hanlin academicians\' court dress and ranking in procession should follow the precedent for officials of various offices who draft edicts.',
    idiomatic: 'Hanlin scholars were ordered to rank in court processions like other drafters of edicts.',
  },
  s0570: {
    literal: 'Zhenyuan 1, first month, dingyou new moon: he received congratulatory audience at Hanyuan Hall; when the rites were complete, he proclaimed amnesty for all under Heaven and changed the era name to Zhenyuan.',
    idiomatic: 'On the Zhenyuan new year he held audience at Hanyuan, proclaimed universal amnesty, and took the era name Zhenyuan.',
  },
  s0571: {
    literal: 'On wuxu great wind and snow; cold.',
    idiomatic: 'On wuxu a blizzard struck and the cold was fierce.',
  },
  s0572: {
    literal: 'The previous autumn\'s locusts and winter drought — now snow fell, bitterly cold; people starved and froze to death, collapsing on the roads.',
    idiomatic: 'After locusts and drought, the snow brought killing cold; corpses littered the highways.',
  },
  s0573: {
    literal: 'On dingwei Raozhou prefect Lu was made Fuzhou prefect and Fujian surveillance commissioner.',
    idiomatic: 'On dingwei the Raozhou prefect Lu was sent to Fujian as commissioner.',
  },
  s0574: {
    literal: 'On guichou word first came that Grand Mentor to the Heir Apparent, Duke of Lu Yan Zhenqing had been killed by Xilie; he was posthumously made Grand Master of the Court, court suspended five days, posthumous title Wenzong, and his sons Yun, Shuo, and others were specially granted office.',
    idiomatic: 'On guichou news arrived that Yan Zhenqing had been murdered by Xilie; the court mourned five days, ennobled him posthumously as Wenzong, and advanced his sons.',
  },
  s0575: {
    literal: 'On renxu Jizhou chief administrator Lu Qi was made Bianmao of Lizhou; soon he died.',
    idiomatic: 'On renxu Lu Qi was demoted to Lizhou and died soon after.',
  },
  s0576: {
    literal: 'Second month, bingyin new moon: Minister of Works Jia Dan and Vice Minister Liu Taizhen were separately sent to comfort the eastern capital and the two He regions.',
    idiomatic: 'On the second month\'s new moon Jia Dan and Liu Taizhen were sent to reassure Luoyang and the Hebei circuits.',
  },
  s0577: {
    literal: 'Henan and Hebei hungered; rice reached a thousand cash per dou.',
    idiomatic: 'Famine in Henan and Hebei drove grain to a thousand cash the dou.',
  },
  s0578: {
    literal: 'On guawei Li Baozhen and Yan Zhen came to court.',
    idiomatic: 'On guawei Li Baozhen and Yan Zhen arrived for audience.',
  },
  s0579: {
    literal: 'On the Cold Food Festival the emperor played cuju in the inner hall with the generals.',
    idiomatic: 'At Cold Food the emperor kicked the ball with his generals in the inner palace.',
  },
  s0580: {
    literal: 'On bingxu acting Director of the Palace Library Kim Yang-sang was made acting Grand Master of the Court, commissioner with credentials, chief administrator, Silla prefect, and commissioner of the Ninghai Army, succeeding to the kingship of Silla.',
    idiomatic: 'On bingxu Kim Yang-sang of Silla was confirmed as king with full Tang honors.',
  },
  s0581: {
    literal: 'On xinmao great rain.',
    idiomatic: 'On xinmao heavy rains fell.',
  },
  s0582: {
    literal: 'Third month, bingchen new moon: Shuzhou prefect Han Hui was made Vice Minister of War; Bian-dong water-and-land transport commissioner and Left Subordinate Heir Apparent Bao Ji was made Vice Minister of Punishments.',
    idiomatic: 'On the third month\'s new moon Han Hui became vice minister of war and Bao Ji vice minister of punishments.',
  },
  s0583: {
    literal: 'On xinchou Vice Minister of Revenue Yuan Xiu charged with fiscal affairs was additionally made commissioner of all circuits\' water-and-land transport.',
    idiomatic: 'On xinchou Yuan Xiu also took charge of transport on every circuit.',
  },
  s0584: {
    literal: 'On dingwei Li Xilie took Nanyang and killed defending general Huang Jinyue.',
    idiomatic: 'On dingwei Xilie seized Nanyang and killed its defender Huang Jinyue.',
  },
  s0585: {
    literal: 'On jiayin an edict ordered the chancellors to instruct the censorate: hereafter sealed memorials and impeachments — each man is to state his own case; group-signed memorials are not permitted.',
    idiomatic: 'On jiayin the chancellors were told to forbid group-signed impeachments; each memorial must speak for one man only.',
  },
  s0586: {
    literal: 'On wuwu Xuanwu commander Liu Qia was advanced to acting Minister of Works;',
    idiomatic: 'On wuwu Liu Qia of Xuanwu was promoted to acting minister of works;',
  },
  s0587: {
    literal: 'Bian-Hua military commissioner Li Cheng was made universal Huazhou prefect and commissioned as Zheng-Hua military commissioner.',
    idiomatic: 'Li Cheng became Zheng-Hua commissioner with authority over Huazhou.',
  },
  s0588: {
    literal: 'Li Na was advanced to Minister of Works.',
    idiomatic: 'Li Na was made minister of works.',
  },
  s0589: {
    literal: 'Summer, fourth month, yichou new moon: Prince of Pu Li Yi was re-enfeoffed Prince of Shu.',
    idiomatic: 'In the fourth month Prince of Pu became Prince of Shu.',
  },
  s0590: {
    literal: 'On guiyou E-Yue observation commissioner Li Qian was made Hongzhou prefect and western capital regimental training and observation commissioner.',
    idiomatic: 'On guiyou Li Qian was shifted from E-Yue to Hongzhou and the western capital command.',
  },
  s0591: {
    literal: 'The Jiangling fiscal depot caught fire, burning more than a million in rent and tax money and grain.',
    idiomatic: 'Fire at the Jiangling revenue office destroyed over a million in taxes and grain.',
  },
  s0592: {
    literal: 'At the time the eastern capital region suffered great famine; tax levies did not come in — for this reason state expenditures grew tighter.',
    idiomatic: 'Famine east of the mountains kept taxes from arriving and the treasury grew desperate.',
  },
  s0593: {
    literal: 'In Guanzhong the starving steamed locusts and ate them.',
    idiomatic: 'Around Chang\'an the hungry steamed locusts for food.',
  },
  s0594: {
    literal: 'Bian commander Liu Qia was granted the name Xuanzuo.',
    idiomatic: 'Liu Qia of Bian was given the name Xuanzuo.',
  },
  s0595: {
    literal: 'Fifth month, guimao: court officials were separately ordered to pray to the gods for rain.',
    idiomatic: 'In the fifth month officials were sent to pray at shrines for rain.',
  },
  s0596: {
    literal: 'Locusts came from the sea, flying until they hid the sky; wherever they descended grass, trees, and animal hair left not a single survivor.',
    idiomatic: 'Locusts flew in from the sea, darkening the sky and stripping fields and livestock bare.',
  },
  s0597: {
    literal: 'Grain prices soared.',
    idiomatic: 'Grain prices shot upward.',
  },
  s0598: {
    literal: 'On xinyou Heyang director knowing military affairs Yong Xiyan was made Heyang-Huai regimental defense commissioner.',
    idiomatic: 'On xinyou Yong Xiyan became commissioner of Heyang and Huai.',
  },
  s0599: {
    literal: 'Sixth month, bingzi: Vice Minister of War Han Hui was made Capital Metropolitan Prefect.',
    idiomatic: 'In the sixth month Han Hui became metropolitan prefect of Chang\'an.',
  },
  s0600: {
    literal: 'On xinsi Liu Xuanzuo was additionally made Bianzhou prefect.',
    idiomatic: 'On xinsi Liu Xuanzuo was also given Bianzhou.',
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
