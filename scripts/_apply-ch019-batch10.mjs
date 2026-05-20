#!/usr/bin/env node
/** Batch 10: s0901–s1000 (Jiutangshu ch.019, Yizong / Xizong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/019.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 901;
const END = 1000;

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
  s0901: {
    literal: 'Fifth month: Youzhou military commissioner Li Maoxun memorialized begging retirement, his son Keju to act in military affairs.',
    idiomatic: 'In the fifth month Li Maoxun begged retirement for his son Keju.',
  },
  s0902: {
    literal: 'An edict made Prince of Shou Jie Palace Equal in Honor with the Three Excellencies, Youzhou pacification Lulong and related armies military observation commissioner controlling Xi and Khitan and related posts;',
    idiomatic: 'Prince of Shou Jie was named Youzhou overseer;',
  },
  s0903: {
    literal: 'Youzhou defense vice commissioner, acting military affairs Li Keju was made Acting Left Regular Attendant, Youzhou metropolitan left assistant, acting Youzhou military commander.',
    idiomatic: 'Li Keju became acting Youzhou commander.',
  },
  s0904: {
    literal: 'An edict made Youzhou Lulong military commissioner, Acting Minister of Works Li Maoxun Acting Left Vice Director, retired.',
    idiomatic: 'Li Maoxun retired as acting left vice director.',
  },
  s0905: {
    literal: 'Former Mianzhou prefect Huangfu Yong was made Secretariat Vice Director; Chenzhou prefect Xu Ke was made Muzhou prefect; Right Guard General Cheng Kefu was made Left Guard General.',
    idiomatic: 'Huangfu Yong, Xu Ke, and Cheng Kefu received posts.',
  },
  s0906: {
    literal: 'Huang Chao\'s bandits took Yizhou.',
    idiomatic: 'Huang Chao took Yizhou.',
  },
  s0907: {
    literal: 'Sixth month: Xuanyi observation commissioner Gao Pian was made Acting Minister of Works, concurrent Runzhou prefect, Zhenhai Army military commissioner, Su-Chang-Hang-Run observation and disposition, Jiang-Huai salt and iron transport, Jiangxi pacification commissioner and related posts.',
    idiomatic: 'In the sixth month Gao Pian moved to Zhenhai at Runzhou.',
  },
  s0908: {
    literal: 'Ruzhou defense commissioner Li Jun was made Acting Right Vice Director, Luzhou metropolitan prefect, Zhaoyi Army military commissioner, Lu-Xing-Ming-Ci observation commissioner and related posts.',
    idiomatic: 'Li Jun took Zhaoyi at Luzhou.',
  },
  s0909: {
    literal: 'Youzhou acting commander Li Keju requested to subdue the Shatuo three tribes with this army; it was granted.',
    idiomatic: 'Li Keju was allowed to subdue the Shatuo with his army.',
  },
  s0910: {
    literal: 'Seventh month: Huang Chao from Yi and Hai—his followers tens of thousands—hurried to Ying and Cai, entered Chaya Mountain, then joined Wang Xianzhi.',
    idiomatic: 'In the seventh month Huang Chao marched from Yi and Hai to join Wang Xianzhi at Chaya Mountain.',
  },
  s0911: {
    literal: 'Eighth month: bandits took Suizhou and captured prefect Cui Xiuzheng.',
    idiomatic: 'In the eighth month bandits took Suizhou and captured Cui Xiuzheng.',
  },
  s0912: {
    literal: 'The mass of bandits camped at Baibo.',
    idiomatic: 'Bandits camped at Baibo.',
  },
  s0913: {
    literal: 'That month Jiangzhou bandit leader Liu Yanzhang gathered followers, took Jiangzhou, and killed prefect Tao Xiang.',
    idiomatic: 'That month Liu Yanzhang took Jiangzhou and killed Tao Xiang.',
  },
  s0914: {
    literal: 'Ninth month: Secretariat Drafting Officer Cui Dan was made acting examiner.',
    idiomatic: 'In the ninth month Cui Dan ran the examinations.',
  },
  s0915: {
    literal: 'Shatuo greatly raided Yun and Shuo.',
    idiomatic: 'Shatuo raided Yun and Shuo.',
  },
  s0916: {
    literal: 'Tenth month: an edict ordered Zhaoyi military commissioner Li Jun, Youzhou Li Keju, Tujue Helian Duo Bai Yicheng, Shatuo Anqing Xue Ge tribes to combine armies against Li Guochang father and son at Weizhou.',
    idiomatic: 'In the tenth month allied armies were ordered against the Li Guochang at Weizhou.',
  },
  s0917: {
    literal: 'Eleventh month: bandit Wang Xianzhi led the crowd across the Han, attacked Jiangling; military commissioner Yang Zhiwen shut the city and resisted.',
    idiomatic: 'In the eleventh month Wang Xianzhi crossed the Han and besieged Jiangling.',
  },
  s0918: {
    literal: 'Zhiwen originally lacked talent for defense; the city had no long preparation; bandits pressed attack.',
    idiomatic: 'Yang Zhiwen, unprepared, could only hold the walls.',
  },
  s0919: {
    literal: 'Twelfth month: bandits took Jiangling\'s outer city; Zhiwen in extremity sought aid from Xiangyang; Shannan East military commissioner Li Fu mobilized all his troops to rescue.',
    idiomatic: 'In the twelfth month they took Jiangling\'s outer city; Li Fu marched to rescue.',
  },
  s0920: {
    literal: 'At that time five hundred Shatuo cavalry were at Xiangyang; the army reached Jingmen; cavalry struck bandits and defeated them.',
    idiomatic: 'Five hundred Shatuo horsemen at Jingmen routed the bandits.',
  },
  s0921: {
    literal: 'The bandits burned all of Jingnan\'s outer cities and left.',
    idiomatic: 'The bandits burned Jingnan\'s suburbs and withdrew.',
  },
  s0922: {
    literal: 'Qianfu 5, first month, dingyou new moon: Shatuo leader Li Jinzhong took Zhelu Army.',
    idiomatic: 'Qianfu 5 opened as Shatuo leader Li Jinzhong took Zhelu Army.',
  },
  s0923: {
    literal: 'Taiyuan military commissioner Dou Huan sent Chief Escort Officer Kang Chuangui leading Hedong native corps two thousand to garrison Daizhou; about to set out, they clamored for rewards, killed Horse and Foot Army Commissioner Deng Qian.',
    idiomatic: 'Dou Huan\'s troops at Daizhou mutinied for pay and killed Deng Qian.',
  },
  s0924: {
    literal: 'Dou Huan himself entered the army to comfort them and still borrowed fifty thousand strings cash from wealthy households to reward them.',
    idiomatic: 'Dou Huan borrowed fifty thousand strings to appease them.',
  },
  s0925: {
    literal: 'The court judged Huan lacked defensive talent; former Zhaoyi military commissioner Cao Xiang was made Acting Right Vice Director, concurrent Taiyuan prefect, Northern Capital regent, Hedong military commissioner;',
    idiomatic: 'Cao Xiang replaced Dou Huan at Hedong;',
  },
  s0926: {
    literal: 'also Left Regular Attendant Zhi Mo was made Hedong defense vice commissioner.',
    idiomatic: 'Zhi Mo became his vice commissioner.',
  },
  s0927: {
    literal: 'Second month: Wang Xianzhi\'s remnant band attacked Jiangxi; pacification commissioner Song Wei led troops repeatedly defeating them, still proclaiming edicts to instruct Xianzhi.',
    idiomatic: 'In the second month Song Wei beat Wang Xianzhi\'s remnants while offering surrender terms.',
  },
  s0928: {
    literal: 'Xianzhi sent a letter to Wei begging a commission; Wei falsely promised.',
    idiomatic: 'Wang Xianzhi begged a commission; Song Wei feigned assent.',
  },
  s0929: {
    literal: 'Xianzhi ordered his great generals Shang Junzhang and Cai Wenyu to present a memorial entering court; Wei then executed Junzhang and Wenyu to display.',
    idiomatic: 'When Shang Junzhang and Cai Wenyu came to court, Song Wei executed them.',
  },
  s0930: {
    literal: 'Xianzhi was enraged and urgently attacked Hongzhou, took its outer city.',
    idiomatic: 'Enraged, Wang Xianzhi stormed Hongzhou\'s outer city.',
  },
  s0931: {
    literal: 'Song Wei went to rescue; battled bandits, greatly defeated them, killed Xianzhi, sent the head to the capital.',
    idiomatic: 'Song Wei defeated him, killed Wang Xianzhi, and sent his head to the capital.',
  },
  s0932: {
    literal: 'Shang Junzhang\'s younger brother Shang Rang was Huang Chao\'s partisan; because his brother was harmed, he drove great numbers of Henan and Shannan people—his crowd one hundred thousand—greatly plundering Huainan, his edge very sharp.',
    idiomatic: 'Shang Rang, Huang Chao\'s ally, rallied a hundred thousand after his brother\'s death and ravaged Huainan.',
  },
  s0933: {
    literal: 'Palace Attendant, Duke of Jin Wang Duo requested to personally supervise the crowd to subdue bandits; the Son of Heaven because Song Wei lost strategy and killed Junzhang, then made Wang Duo Acting Minister of Works, concurrent Palace Attendant, Secretariat Vice Director, Jiangling prefect, Jingnan military commissioner, commander of all circuits\' troops.',
    idiomatic: 'Wang Duo was named commander of all circuits after Song Wei killed Junzhang.',
  },
  s0934: {
    literal: 'Third month: Wang Duo memorialized Yanzhou military commissioner Li Xi as headquarters left assistant, concurrent Tanzhou prefect, Hunan metropolitan training and observation commissioner.',
    idiomatic: 'In the third month Li Xi became Hunan commander under Wang Duo.',
  },
  s0935: {
    literal: 'Huang Chao\'s crowd again attacked Jiangxi, took Qian, Ji, Rao, Xin and other prefectures, from Xuanzhou crossed the river, by Zhedong wished to hurry to Fujian; because there were no boats, they opened a mountain tunnel five hundred li, by land hurried to Jianzhou, then took all Fujian prefectures.',
    idiomatic: 'Huang Chao swept Jiangxi, crossed to Zhedong, tunneled into Fujian, and seized Minzhong.',
  },
  s0936: {
    literal: 'Minister of Personnel Zheng Congdang and Vice Minister of Personnel Cui Hang examined macrocosmic candidates.',
    idiomatic: 'Zheng Congdang and Cui Hang examined candidates.',
  },
  s0937: {
    literal: 'Seventh month: Huazhou, Zhongwu, Zhaoyi and other circuits\' armies met at Taiyuan; Datong Army vice commissioner Zhi Mo was vanguard, first hurrying to the campaign camp.',
    idiomatic: 'In the seventh month allied armies gathered at Taiyuan with Zhi Mo as vanguard.',
  },
  s0938: {
    literal: 'Eighth month: Shatuo took Koulun Army; Cao Xiang personally led the army to Xinzhou.',
    idiomatic: 'In the eighth month Shatuo took Koulun; Cao Xiang marched to Xinzhou.',
  },
  s0939: {
    literal: 'Xiang reached the army, suffered wind stroke and died; all armies retreated.',
    idiomatic: 'Cao Xiang died of stroke; the armies retreated.',
  },
  s0940: {
    literal: 'Taiyuan greatly feared, closed city gates; Zhaoyi soldiers mutinied, plundering wards and markets.',
    idiomatic: 'Taiyuan closed its gates as Zhaoyi troops rioted in the markets.',
  },
  s0941: {
    literal: 'Ninth month: Secretariat Vice Director, Minister of Personnel, Grand Councillor Li Wei was made Acting Left Vice Director, Eastern Capital regent;',
    idiomatic: 'In the ninth month Li Wei became Eastern Capital regent;',
  },
  s0942: {
    literal: 'Minister of Personnel Zheng Congdang, original office, Grand Councillor.',
    idiomatic: 'Zheng Congdang joined the Grand Council.',
  },
  s0943: {
    literal: 'Tenth month: Minister of Works, Grand Councillor Cui Yanzhao was dismissed as Crown Prince Grand Tutor.',
    idiomatic: 'In the tenth month Cui Yanzhao retired as crown prince grand tutor.',
  },
  s0944: {
    literal: 'Eleventh month: an edict made Hedong pacification commissioner, acting north-of-Dai campaign pacification commissioner Cui Jikang Acting Minister of Revenue, concurrent Taiyuan prefect, Northern Capital regent, Hedong military commissioner, north-of-Dai campaign pacification commissioner.',
    idiomatic: 'In the eleventh month Cui Jikang took Hedong and the north-of-Dai campaign.',
  },
  s0945: {
    literal: 'Shatuo attacked Youzhou; Cui Jikang rescued it.',
    idiomatic: 'Cui Jikang rescued Youzhou from Shatuo attack.',
  },
  s0946: {
    literal: 'Twelfth month: Jikang with north-face campaign pacification commissioner Li Jun battled Shatuo Li Keyong at Koulun Army\'s Hong Valley; the royal army was greatly defeated; Jun was struck by a stray arrow and died.',
    idiomatic: 'In the twelfth month Cui Jikang and Li Jun were routed at Hong Valley; Li Jun died.',
  },
  s0947: {
    literal: 'On wuxu reaching Daizhou, Zhaoyi Army mutinied and was nearly all killed by Daizhou commoners.',
    idiomatic: 'On wuxu Zhaoyi troops were massacred at Daizhou.',
  },
  s0948: {
    literal: 'Secretariat Drafting Officer Zhang Du was made acting Rites recruitment examiner.',
    idiomatic: 'Zhang Du ran the Rites examinations.',
  },
  s0949: {
    literal: 'Qianfu 6, first month, xinmao new moon: Hedong military commissioner Cui Jikang from Jingle county gathered remnant troops returning; the army mutinied and killed clerk Shi Yu.',
    idiomatic: 'Qianfu 6 opened as Cui Jikang\'s returning army mutinied and killed Shi Yu.',
  },
  s0950: {
    literal: 'Jikang abandoned the crowd and fled back to the campaign camp; yamen generals Zhang Kai and Guo Fei led the crowd back to Taiyuan; soldiers clamored, attacked Dongyang Gate, entered the commissioner yamen—Jikang father and son were both killed.',
    idiomatic: 'Cui Jikang fled; his troops stormed Taiyuan and killed him and his son.',
  },
  s0951: {
    literal: 'Third month: Vice Minister of Personnel Cui Hang and Cui Dan examined macrocosmic candidates; Director of Chariots Lu Yun and Director of Punishments Zheng Xu were examiners.',
    idiomatic: 'In the third month Cui Hang and Cui Dan examined candidates.',
  },
  s0952: {
    literal: 'An edict made Binning military commissioner Li Kan Acting Minister of Revenue, concurrent Taiyuan prefect, Northern Capital regent, Hedong military commissioner and related posts.',
    idiomatic: 'Li Kan was posted to Hedong.',
  },
  s0953: {
    literal: 'Fourth month: Huang Chao took Guiguan.',
    idiomatic: 'In the fourth month Huang Chao took Guiguan.',
  },
  s0954: {
    literal: 'Fifth month: bandits besieged Guangzhou, still writing Guangnan military commissioner Li Yan and Zhedong observation commissioner Cui Qiu begging recommendation, begging Tianping commission.',
    idiomatic: 'In the fifth month Huang Chao besieged Guangzhou and begged a Tianping commission.',
  },
  s0955: {
    literal: 'Qiu and Yan memorialized discussing it; an edict ordered public ministers to debate whether it was permissible.',
    idiomatic: 'Li Yan and Cui Qiu memorialized; ministers debated.',
  },
  s0956: {
    literal: 'Grand Councillors Zheng Tian and Lu Zhi argued at the Secretariat, words not deferential—both dismissed as Crown Prince Guests, Eastern Capital branch office.',
    idiomatic: 'Zheng Tian and Lu Zhi quarreled and were banished to the Eastern Capital.',
  },
  s0957: {
    literal: 'Vice Minister of Personnel Cui Hang was made Vice Minister of Revenue; Vice Minister of Revenue, Hanlin Academician Dou Lu Nian was made Vice Minister of War, all original offices Grand Councillor.',
    idiomatic: 'Cui Hang and Dou Lu Nian joined the Grand Council.',
  },
  s0958: {
    literal: 'Huang Chao took Guangzhou and greatly plundered Lingnan prefectures and counties.',
    idiomatic: 'Huang Chao took Guangzhou and plundered Lingnan.',
  },
  s0959: {
    literal: 'Eighth month: an edict made Special Advancement, Acting Minister of Works, Eastern Capital regent Li Wei Acting Minister of Works, Grand Councillor, concurrent Taiyuan prefect, Northern Capital regent, Hedong observation commissioner, north-of-Dai campaign pacification supply commissioner and related posts.',
    idiomatic: 'In the eighth month Li Wei returned to Hedong command.',
  },
  s0960: {
    literal: 'Tenth month: an edict made Zhenhai Army military commissioner, Zhexi observation and disposition commissioner Gao Pian Acting Minister of Works, Grand Councillor, Yangzhou metropolitan prefect, Huainan defense vice commissioner and acting military commissioner, Jiang-Huai salt and iron transport, Jiangnan campaign pacification commissioner and related posts, advanced to Duke of Yan with three-thousand-household fief.',
    idiomatic: 'In the tenth month Gao Pian was named Huainan commander and Duke of Yan.',
  },
  s0961: {
    literal: 'Earlier, while Pian was in Zhexi, he dispatched great generals Zhang Lin and Liang Ji and others to greatly defeat Huang Chao in Zhedong; bandits advanced to plunder Fujian, crossed the ranges, therefore he was transferred to Yangzhou.',
    idiomatic: 'Gao Pian, who had beaten Huang Chao in Zhejiang, was shifted to Yangzhou as the rebels moved south.',
  },
  s0962: {
    literal: 'At that time bandits north crossed Dayu Ridge; the court appointed Pian commander of all circuits\' campaign troops.',
    idiomatic: 'As rebels crossed Dayu Ridge, Pian was named commander of all circuits.',
  },
  s0963: {
    literal: 'Taiyuan military commissioner Li Wei died.',
    idiomatic: 'Li Wei died at Taiyuan.',
  },
  s0964: {
    literal: 'Vice Minister of Rites Zhang Du was made acting Left Assistant affairs.',
    idiomatic: 'Zhang Du acted as left assistant.',
  },
  s0965: {
    literal: 'Eleventh month: an edict made Silver-Green Grandee, Acting Right Regular Attendant, Hedong campaign marshal, Yanmen north-of-Dai disposition commissioner, Shiling town northern troops, north-of-Dai armies commissioner, Upper Pillar of State Kang Chuangui Acting Minister of Works, concurrent Taiyuan prefect, Northern Capital regent, Hedong military commissioner.',
    idiomatic: 'In the eleventh month Kang Chuangui was named Hedong commander.',
  },
  s0966: {
    literal: 'At that time Chuanggui already led troops at Daizhou; that month he himself went from the camp to his post; both capital guards Zhang Kai and Guo Fei welcomed at Wucheng Station and both killed him—the army was shaken.',
    idiomatic: 'Kang Chuanggui was murdered at Wucheng Station on his way to take office.',
  },
  s0967: {
    literal: 'Also an edict made Divine Strategy great general Zhou Bao Acting Left Vice Director, concurrent Runzhou prefect, Zhenhai Army military commissioner, Zhexi observation commissioner and related posts.',
    idiomatic: 'Zhou Bao took Zhenhai at Runzhou.',
  },
  s0968: {
    literal: 'From Dingzhou onward disposition of inner stables, palace parks and related commissioner, Gold-Purple Grandee, Acting Minister of Punishments, Upper Pillar of State, Earl of Taiyuan with seven-hundred-household fief Wang Chucun was made Acting Minister of Revenue, concurrent Dingzhou prefect, Yiwu Army military commissioner, Yi-Ding observation and disposition, Beiping Army commissioner and related posts.',
    idiomatic: 'Wang Chucun took Yiwu at Dingzhou.',
  },
  s0969: {
    literal: 'Twelfth month: an edict made Hedong horse and foot armies chief inspector Zhu Mei Daizhou prefect.',
    idiomatic: 'In the twelfth month Zhu Mei became Daizhou prefect.',
  },
  s0970: {
    literal: 'Crown Prince Guest branch office Lu Zhi was made Vice Minister of War, Grand Councillor;',
    idiomatic: 'Lu Zhi returned to the Grand Council;',
  },
  s0971: {
    literal: 'Crown Prince Guest Zheng Tian was made Acting Left Vice Director, Fengxiang prefect, Fengxiang military commissioner.',
    idiomatic: 'Zheng Tian took Fengxiang.',
  },
  s0972: {
    literal: 'Guangming 1, first month, yimao new moon: the Emperor attended Xuanzheng Hall; an edict: "We respectfully received the precious throne, succeeding and guarding the ancestral temples, day and night one heart, toiling eight years, truly wishing to drive the people toward benevolence and longevity and bring Huaxia to ascending peace.',
    idiomatic: 'Guangming 1 opened as Xizong proclaimed at Xuanzheng Hall:',
  },
  s0973: {
    literal: 'Yet the state\'s step is still difficult, the multitude\'s fulfillment few; disasters repeatedly rise, bandit villains still arrive.',
    idiomatic: '"Eight years we have toiled, yet disasters and bandits persist—',
  },
  s0974: {
    literal: 'Secretly wielding weapons, continuously attacking prefectures and counties—though submitting surrender, the mad plots do not cease.',
    idiomatic: '"—rebels seize counties though some surrender.',
  },
  s0975: {
    literal: 'Jiangyou and Hainan—wounds already severe; Hunan, Jing, and Han—plowing and weaving repeatedly empty.',
    idiomatic: 'Jiangyou, Hainan, Hunan, and the Han valleys lie ruined—',
  },
  s0976: {
    literal: 'Thinking of the weary and weak, truly deep pity.',
    idiomatic: '—and the weary break our heart.',
  },
  s0977: {
    literal: 'Our heart not yet crossing over, Heaven\'s Way how?',
    idiomatic: 'Our heart has not prevailed—what of Heaven\'s Way?',
  },
  s0978: {
    literal: 'Relying on recent strict orders to teachers and soldiers, slightly hearing victory—all clearly the sage\'s hidden aid; how could it be our meager virtue to speak of merit?',
    idiomatic: 'Yet recent victories seem Heaven\'s aid, not our merit.',
  },
  s0979: {
    literal: 'As the season changes to three yangs, the day should be the year\'s head—we therefore attend the main hall and hereby order era change; moreover reaching growth and generation, it is fitting to be within amnesty.',
    idiomatic: 'At the year\'s turn we change the era and grant amnesty—',
  },
  s0980: {
    literal: 'From antiquity inheriting enterprise and guarding culture rulers, grasping the chart and ruling the realm—surely from the first month auspicious day they issue orders.',
    idiomatic: '"—as sage rulers have always done at year\'s start.',
  },
  s0981: {
    literal: 'Therefore to hang a thousand years\' admirable pattern and solidify ten thousand generations\' great foundation—none do not follow this Way.',
    idiomatic: 'Thus we fix ten thousand generations\' foundation.',
  },
  s0982: {
    literal: 'Qianfu 7 may be changed to Guangming 1.',
    idiomatic: 'Change Qianfu 7 to Guangming 1.',
  },
  s0983: {
    literal: 'Recently southeast prefectures repeatedly memorialize grass bandits linking together.',
    idiomatic: 'Southeast circuits report linked grass bandits—',
  },
  s0984: {
    literal: 'They are originally common people, forced by hunger and dearth, driven to be bandits—not willing in feeling.',
    idiomatic: '—common people driven by hunger, not willingly wicked.',
  },
  s0985: {
    literal: 'Entrust to local chief officials careful instruction—if they surrender of themselves, guaranteed not feigning, then must soothe and accept without interrogation.',
    idiomatic: 'Instruct magistrates to accept sincere surrenders without torture—',
  },
  s0986: {
    literal: 'If they do not turn their blades, then at once cut down.',
    idiomatic: '—but cut down those who resist.',
  },
  s0987: {
    literal: 'Southeast prefectures suffering bandits—farming and silkworms lose their work, plowing and planting not timely.',
    idiomatic: 'Where bandits have passed, farming has failed—',
  },
  s0988: {
    literal: 'Among them Guangzhou, Jingnan, Hunan—because bandits linger, people flee—wounds most severe; from before Guangming all tax levies should be reduced four-tenths.',
    idiomatic: '—so reduce taxes four-tenths in Guangzhou, Jingnan, Hunan, and other ravaged regions.',
  },
  s0989: {
    literal: 'For Hedong and Taiyuan prefectures suffering bandit raids, also follow this.',
    idiomatic: 'Hedong and Taiyuan receive the same relief.',
  },
  s0990: {
    literal: 'Personnel candidates Su Cuo and those rejected on appointment—except personal name usurpation and lacking examination, all register per distant vacancies.',
    idiomatic: 'Personnel candidates with minor faults may fill distant vacancies.',
  },
  s0991: {
    literal: 'The gate of entering office—the War Ministry is most corrupt, wholly without foundation, quite ruining discipline.',
    idiomatic: 'The War Ministry\'s appointments are corrupt—',
  },
  s0992: {
    literal: 'Recently many military officials transfer into civil offices, appointed by seniority—should warn overstepping fortune to distinguish ranks.',
    idiomatic: '—and military officers must not transfer into civil ranks except the inner service.',
  },
  s0993: {
    literal: 'Hereafter military officials may not transfer into civil official selection and appointment; we hope wheels and hubs each fit, order distinguished—the inner service is not within this limit.',
    idiomatic: 'Let each track keep its place; the inner service is excepted.',
  },
  s0994: {
    literal: 'Shatuo tribes crossed Yingmen Pass, pressing close to Xinzhou.',
    idiomatic: 'Shatuo crossed Yingmen Pass toward Xinzhou.',
  },
  s0995: {
    literal: 'Second month: Shatuo pressed Taiyuan, took Dagu.',
    idiomatic: 'In the second month Shatuo pressed Taiyuan and took Dagu.',
  },
  s0996: {
    literal: 'Kang Chuanggui dispatched great generals Yi Zhao, Zhang Yanqiu, and Su Hongzhen in divided troops to resist at Qincheng Station; they were defeated by Shatuo.',
    idiomatic: 'Kang Chuanggui\'s generals were defeated at Qincheng Station.',
  },
  s0997: {
    literal: 'Chuanggui was enraged and executed Su Hongzhen.',
    idiomatic: 'Chuanggui executed Su Hongzhen in anger.',
  },
  s0998: {
    literal: 'Zhang Yanqiu\'s subordinate soldiers mutinied, turned blades to attack Taiyuan, killed Chuanggui; army supervisor Zhou Congyu comforted and then it was settled.',
    idiomatic: 'Zhang Yanqiu\'s men mutinied, killed Chuanggui; Zhou Congyu restored order.',
  },
  s0999: {
    literal: 'That month: an edict made Palace Equal in Honor with the Three Excellencies, Secretariat Vice Director, concurrent Minister of War, Grand Councillor, Grand Preceptor of the Supreme Ultimate Palace academician, Extended Treasury commissioner, Upper Pillar of State, Duke of Xingyang with three-thousand-household fief Zheng Congdang Acting Minister of Works, Grand Councillor, concurrent Taiyuan prefect, Northern Capital regent, Hedong military commissioner, observation and disposition within the circuit, campaign pacification supply commissioner and related posts.',
    idiomatic: 'That month Zheng Congdang was sent to command Hedong.',
  },
  s1000: {
    literal: 'Huang Chao\'s army from Heng and Yongzhou descended, repeatedly taking Hunan and Jiangxi subordinate prefectures.',
    idiomatic: 'Huang Chao swept south through Hunan and Jiangxi.',
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
if (data.metadata.chapter !== '019') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 019; standalone T ready (${Object.keys(T).length} entries).`
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
