#!/usr/bin/env node
/** Batch 7: s0601–s0700 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 601;
const END = 700;

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
  s0601: {
    literal: 'Xuzhou Prefect Zhu Yougong was made Acting Minister of Works and Prefect of Yingzhou;',
    idiomatic: 'Zhu Yougong became acting minister of works and Yingzhou prefect;',
  },
  s0602: {
    literal: 'Left Martial Guard General Zhao Lin was made Acting Left Vice Director and Prefect of Xu;',
    idiomatic: 'Zhao Lin became acting left vice director and Xu prefect;',
  },
  s0603: {
    literal: 'Xuanwu Escort Officer Liu Zhijun was made Acting Right Vice Director and Prefect of Zheng—following Quanzhong\'s memorial.',
    idiomatic: 'Liu Zhijun became acting right vice director and Zheng prefect—per Quanzhong\'s memorial.',
  },
  s0604: {
    literal: 'On wushen, an edict made Wuzhen Commissioner Lei Man, Acting Grand Guardian, Prince of Fengyi, the rest unchanged.',
    idiomatic: 'On wushen Lei Man was made acting grand guardian and Prince of Fengyi.',
  },
  s0605: {
    literal: 'Wutai Commissioner Zhao Chong was enfeoffed Baron of Tianshui with five hundred households.',
    idiomatic: 'Wutai Commissioner Zhao Chong was enfeoffed Baron of Tianshui.',
  },
  s0606: {
    literal: 'On gengxu, an edict made Zhaoyi Acting Commissioner Meng Qian Acting Minister of Works, concurrent Luzhou Chief Administrator, Zhaoyi Vice Commissioner knowing military affairs, Commissioner of Luzhou, Ming, Xing, and Mo, Baron of Pingchang with three hundred households—following Li Keyong\'s memorial.',
    idiomatic: 'On gengxu Meng Qian was made acting minister of works and Zhaoyi vice commissioner—per Keyong\'s memorial.',
  },
  s0607: {
    literal: 'Golden-Gleam Grandee Sun Chu, Minister of War, Duke of Le\'an, was ordered to keep the ministry and also serve as Jingzhao Magistrate.',
    idiomatic: 'Sun Chu kept the ministry of war and also became Jingzhao magistrate.',
  },
  s0608: {
    literal: 'On yimao, an edict: Loyal Martyr Guard-Sage Zhenguo Merit Holder Wang Jian, Sichuan West Vice Commissioner, could also command Sichuan East and Wuxin circuits, with fief increased one thousand households, the rest unchanged.',
    idiomatic: 'On yimao Wang Jian was given Sichuan East and Wuxin—he had taken Zizhou from Gu Yanhui.',
  },
  s0609: {
    literal: 'At that time Jian had taken Zizhou from Gu Yanhui and also held Sichuan East\'s Yang, Guo, and Lang.',
    idiomatic: 'He had taken Zizhou and held Yang, Guo, and Lang.',
  },
  s0610: {
    literal: 'Loyalty Army Commissioner Zhao Kuangning was made Acting Grand Preceptor, concurrent Director of the Secretariat, with substantive fief increased one hundred households.',
    idiomatic: 'Zhao Kuangning was made acting grand preceptor and director of the secretariat.',
  },
  s0611: {
    literal: 'In the eighth month, on bingchen, the first day, Zhu Quanzhong memorialized: "Ru Prefecture was first cut to Xu—I beg return it to the eastern capital.',
    idiomatic: 'Eighth month, bingchen new moon: Quanzhong begged return Ru Prefecture to the eastern capital.',
  },
  s0612: {
    literal: 'Heyang once governed Ze; now because border tribes hold it, gain and loss are uncertain—I beg temporarily cut Wangwu, Qinghe, and Gong of Henan to Heyang."',
    idiomatic: 'He begged cut Wangwu, Qinghe, and Gong to uncertain Heyang."',
  },
  s0613: {
    literal: 'The edict was assented to.',
    idiomatic: 'The throne assented.',
  },
  s0614: {
    literal: 'On guihai, an edict: Loyal and True Pacifier Li Keyong, Hedong Commissioner, with substantive fief increased one hundred households.',
    idiomatic: 'On guihai Li Keyong\'s substantive fief was increased one hundred households.',
  },
  s0615: {
    literal: 'On dingmao, Court Gentleman Yan Rao, Works Bureau Director and Drafting Officer, was made Secretariat Draftsman.',
    idiomatic: 'On dingmao Yan Rao became secretariat draftsman.',
  },
  s0616: {
    literal: 'On jisi, an edict made former Guiyi Vice Commissioner Zhang Chengfeng Acting Left Regular Attendant, concurrent Shazhou Prefect and Censor-in-Chief, Commissioner of Guiyi and Guasha Yixi.',
    idiomatic: 'On jisi Zhang Chengfeng became Guiyi commissioner.',
  },
  s0617: {
    literal: 'On gengchen, Taiyuan Grand General Li Sizhao attacked Mingzhou, took it, and seized Bian general Zhu Shaozong.',
    idiomatic: 'On gengchen Li Sizhao took Mingzhou and seized Zhu Shaozong.',
  },
  s0618: {
    literal: 'Bian general Ge Congzhou led troops to relieve it; Sizhao abandoned the city and left.',
    idiomatic: 'Ge Congzhou relieved it; Sizhao abandoned the city.',
  },
  s0619: {
    literal: 'Congzhou intercepted him at Qingshan Pass; Jin troops were greatly defeated; Congzhou pressed the victory and attacked Zhenzhou.',
    idiomatic: 'Congzhou intercepted at Qingshan; Jin was crushed; he attacked Zhenzhou.',
  },
  s0620: {
    literal: 'On renwu, an edict: Jingnan Commissioner Cheng Run could be Acting Grand Preceptor and Director of the Secretariat, the rest unchanged.',
    idiomatic: 'On renwu Cheng Run was made acting grand preceptor.',
  },
  s0621: {
    literal: 'On jiashen, an edict: Cui Yin, Pacifier and Rectifier Merit Holder, could be Grand Master of Honor with Golden Seal, advanced to Duke of Wei with fief increased one thousand households, the rest unchanged.',
    idiomatic: 'On jiashen Cui Yin was advanced to Duke of Wei.',
  },
  s0622: {
    literal: 'In the ninth month, on bingxu, the first day, Zhu Quanzhong led three commands\' armies against Zhenzhou; Wang Rong was afraid and sent Judge Zhou Shi, Vice Commissioner Wang Zhaozuo, and Chief Clerk Liang Gongru\'s sons as hostages to Bian, presenting one hundred fifty thousand bolts of silk to sue for peace; this was granted.',
    idiomatic: 'Ninth month, bingxu new moon: Quanzhong attacked Zhenzhou; Wang Rong sent hostages and silk for peace; granted.',
  },
  s0623: {
    literal: 'Zhang Cunjing then advanced from Shen and Ji, attacked Ying and Mo, took twenty districts; rain and mud blocked reaching Youzhou.',
    idiomatic: 'Zhang Cunjing took twenty districts; rain and mud blocked Youzhou.',
  },
  s0624: {
    literal: 'He then turned west, took Qizhou, greatly defeated Zhongshan general Wang Chuzhi\'s army north of Shahe, and encamped at Huaide Post.',
    idiomatic: 'He took Qizhou, defeated Wang Chuzhi north of Shahe, and encamped at Huaide.',
  },
  s0625: {
    literal: 'He then attacked Dingzhou; Commissioner Wang Gao fled to Taiyuan; guard Wang Chuzhi beheaded clerk Liang Wen and offered two hundred thousand bolts of silk to sue for peace; this was granted.',
    idiomatic: 'He attacked Dingzhou; Gao fled; Chuzhi beheaded Liang Wen and bought peace with silk.',
  },
  s0626: {
    literal: 'Quanzhong then appointed Wang Chuzhi acting Yiwu Army commissioner.',
    idiomatic: 'Quanzhong appointed Wang Chuzhi acting Yiwu commissioner.',
  },
  s0627: {
    literal: 'On yisi, an edict: Xu Yanruo could be Acting Grand Guardian, Grand Councilor, Commissioner of Qinghai and Lingnan East.',
    idiomatic: 'On yisi Xu Yanruo was made acting grand guardian and Qinghai commissioner.',
  },
  s0628: {
    literal: 'On bingwu, an edict: Cui Yuan left government affairs and kept his post.',
    idiomatic: 'On bingwu Cui Yuan left government and kept his post.',
  },
  s0629: {
    literal: 'On wushen, an edict: Left Vice Director Cui Yin was made Commissioner of Grand Pure Palace, Temple Repair, Hongwen Hall, Extended Treasury, and Salt and Iron Transport, continuing to control revenue.',
    idiomatic: 'On wushen Cui Yin took palace, temple, and transport commissions.',
  },
  s0630: {
    literal: 'Golden-Gleam Grandee Lu Yi was made Vice Director of the Secretariat, Minister of Revenue, Commissioner for Editing the National History.',
    idiomatic: 'Lu Yi became vice director of the secretariat and revenue minister.',
  },
  s0631: {
    literal: 'Proper Counselor Pei Zan was made Vice Director of the Secretariat, concurrent Minister of Justice and Grand Councilor, Grand Scholar of the Hall of Assembled Worthies.',
    idiomatic: 'Pei Zan became vice director and grand councilor.',
  },
  s0632: {
    literal: 'Silver-Gleam Grandee Pei Shu was made Vice Director of the Secretariat, Grand Councilor, and Controller of Revenue.',
    idiomatic: 'Pei Shu became vice director, grand councilor, and revenue controller.',
  },
  s0633: {
    literal: 'On xinhai, Grandee Zhang Jun, Right Vice Director and Tribute Commissioner, left the tribute commission and kept his post.',
    idiomatic: 'On xinhai Zhang Jun left the tribute commission.',
  },
  s0634: {
    literal: 'In the tenth month, on bingchen, the first day.',
    idiomatic: 'Tenth month, bingchen new moon.',
  },
  s0635: {
    literal: 'On xinyou, former Qinghai Vice Commissioner Wang Pu was ordered to keep Left Regular Attendant and serve as Salt and Iron Vice Commissioner.',
    idiomatic: 'On xinyou Wang Pu became salt and iron vice commissioner.',
  },
  s0636: {
    literal: 'On guimao, an edict made Baoyi Acting Commissioner Zhu Youqian Golden-Gleam Grandee, Acting Right Vice Director, concurrent Shanzhou Chief Administrator and Censor-in-Chief, Commissioner of Baoyi and Shan-Guo.',
    idiomatic: 'On guimao Zhu Youqian was made Baoyi commissioner.',
  },
  s0637: {
    literal: 'In the eleventh month, on yiyou, the first day.',
    idiomatic: 'Eleventh month, yiyou new moon.',
  },
  s0638: {
    literal: 'On gengyin, Inner Army Commanders Liu Jishu and Wang Zhongxian deposed Zhaozong, confined him in the Eastern Inner Ask-Peace Palace, and asked Crown Prince Yu to supervise the state.',
    idiomatic: 'On gengyin Liu Jishu and Wang Zhongxian deposed Zhaozong and made Yu regent.',
  },
  s0639: {
    literal: 'At that time Zhaozong entrusted Cui Yin with government; Yin relied on Quanzhong\'s aid and gradually checked the eunuchs.',
    idiomatic: 'Zhaozong entrusted Yin with government; he relied on Quanzhong and checked eunuchs.',
  },
  s0640: {
    literal: 'After returning from Hua to the palace the emperor indulged in birds, wine, and willfulness, joy and anger unsteady; after Song Daobi and others were punished the Yellow Gates feared especially.',
    idiomatic: 'After returning from Hua he indulged in birds and wine; eunuchs feared after Song Daobi\'s fall.',
  },
  s0641: {
    literal: 'At this time the emperor hunted in the park, drunk deeply; that night he personally killed several yellow gates and serving women.',
    idiomatic: 'He hunted drunk that night and killed several eunuchs and serving women.',
  },
  s0642: {
    literal: 'On gengyin, when the day reached chen and si hours, the inner gates did not open.',
    idiomatic: 'On gengyin by mid-morning the inner gates did not open.',
  },
  s0643: {
    literal: 'Liu Jishu went to the Secretariat and told Grand Councilor Cui Yin: "Within the palace there must be unforeseen events—how can ministers sit and watch?',
    idiomatic: 'Jishu told Yin: "The palace must hold disaster—how can we sit and watch?',
  },
  s0644: {
    literal: 'We are inner servants and may act as expedience requires."',
    idiomatic: 'We inner servants may act at expedience."',
  },
  s0645: {
    literal: 'He at once broke in with a thousand forbidden troops, questioned the inner staff, and learned the whole cause.',
    idiomatic: 'He broke in with a thousand guards, questioned staff, and learned all.',
  },
  s0646: {
    literal: 'Coming out he plotted with the chancellors: "The ruler\'s conduct is such—he is no lord of the altars.',
    idiomatic: 'He told chancellors: "The ruler\'s conduct is not that of altars\' lord.',
  },
  s0647: {
    literal: 'Depose the dim and establish the bright—there are precedents; it is the state\'s great plan, not rebellion."',
    idiomatic: 'Depose the dim for the bright—precedent exists; it is statecraft, not rebellion."',
  },
  s0648: {
    literal: 'He at once summoned the hundred officials to sign; Cui Yin and others had no choice and signed.',
    idiomatic: 'He summoned officials to sign; Yin and others had no choice.',
  },
  s0649: {
    literal: 'Jishu, Zhongxian, and thirteen others including Bian memorial officer Cheng Yan requested audience; when audience ended Jishu ascended the hall to await punishment.',
    idiomatic: 'Jishu, Zhongxian, Cheng Yan, and thirteen others requested audience; Jishu awaited punishment.',
  },
  s0650: {
    literal: 'Inner and outer army soldiers together shouted ten thousand years, burst through Xuanhua Gate, marched to Sizheng Hall, killed as they went, straight to Qiqiao Tower.',
    idiomatic: 'Soldiers shouted ten thousand years, burst through Xuanhua Gate, killed to Qiqiao Tower.',
  },
  s0651: {
    literal: 'The emperor suddenly saw soldiers, startled and fell from the bed, rose to flee; Jishu and Zhongxian supported him and made him sit.',
    idiomatic: 'The emperor fell from bed; Jishu and Zhongxian forced him to sit.',
  },
  s0652: {
    literal: 'Empress He hurried out to bow: "Army superiors protect the Imperial Father—do not frighten him; take matters to the army superiors for counsel."',
    idiomatic: 'Empress He bowed: "Protect the Imperial Father; take matters to the army superiors."',
  },
  s0653: {
    literal: 'Jishu produced the hundred officials\' joint document: "Your Majesty is weary of the throne; inner and outer wish the crown prince supervise the state—I beg Your Majesty nurture yourself in the Eastern Palace."',
    idiomatic: 'Jishu produced the joint document begging the crown prince supervise the state.',
  },
  s0654: {
    literal: 'The emperor said: "Yesterday I drank merrily with you and did not notice going too far—how reach this!"',
    idiomatic: 'The emperor said: "Yesterday we drank too merrily—how reach this!"',
  },
  s0655: {
    literal: 'The empress said: "The Sage obeys the army superiors\' words."',
    idiomatic: 'The empress said: "Obey the army superiors."',
  },
  s0656: {
    literal: 'She took the imperial seal before the throne and gave it to Jishu; at once emperor and empress shared one carriage with a dozen usual attendants to the Eastern Palace.',
    idiomatic: 'She gave the seal to Jishu; emperor and empress went to the Eastern Palace.',
  },
  s0657: {
    literal: 'Within, Jishu himself barred the courtyard gate and daily passed food through the window.',
    idiomatic: 'Jishu barred the gate and passed food through the window.',
  },
  s0658: {
    literal: 'That day the crown prince was welcomed to supervise the state; a forged edict in Zhaozong\'s name styled him Retired Emperor.',
    idiomatic: 'That day Yu supervised the state; a forged edict styled Zhaozong Retired Emperor.',
  },
  s0659: {
    literal: 'On jiawu, the Retired Emperor\'s edict was proclaimed; the crown prince ascended the throne; chancellors, officials, and feudatories received rank increases; a thousand five hundred taels of silver, a thousand bolts of silk, and ten thousand liang of cotton were given officials for relief—all Jishu\'s flattery to court.',
    idiomatic: 'On jiawu the crown prince ascended; ranks and gifts flowed—all Jishu\'s flattery.',
  },
  s0660: {
    literal: 'At that time Zhu Quanzhong was at the Dingzhou campaign; Cui Yin and former Left Vice Director Zhang Jun reported the crisis to Quanzhong, begging troops to punish wrong; Quanzhong returned from camp to Daliang.',
    idiomatic: 'Quanzhong was at Dingzhou; Yin and Zhang Jun begged troops; he returned to Daliang.',
  },
  s0661: {
    literal: 'In the twelfth month, on yimao, the first day.',
    idiomatic: 'Twelfth month, yimao new moon.',
  },
  s0662: {
    literal: 'On guimao night.',
    idiomatic: 'That guimao night.',
  },
  s0663: {
    literal: 'Escort generals Sun Dezhao, Zhou Chenghui, and Dong Yanbi of Yanzhou attacked Liu Jishu and Wang Zhongxian, killed Zhongxian, and carried his head to the Eastern Palace gate crying: "Rebel Wang Zhongxian is beheaded—I beg Your Majesty leave the palace to comfort the troops."',
    idiomatic: 'Sun Dezhao and others killed Zhongxian and begged the emperor out.',
  },
  s0664: {
    literal: 'Palace women broke the lock; only then could emperor and empress emerge.',
    idiomatic: 'Palace women broke the lock; emperor and empress emerged.',
  },
  s0665: {
    literal: 'In the first year of Tianfu, spring, the first month, on jiashen, the first day, Zhaozong was restored, ascended Changle Gate Tower, and received audience congratulations.',
    idiomatic: 'Tianfu 1, spring, jiashen new moon: Zhaozong was restored and received congratulations.',
  },
  s0666: {
    literal: 'Before the audience retired Sun Dezhao brought Liu Jishu before the tower; as the emperor reproached him he was already beaten to death by the mob and exposed in the market.',
    idiomatic: 'Sun Dezhao brought Jishu; the mob beat him dead and exposed him.',
  },
  s0667: {
    literal: 'On yiyou, an edict made Sun Dezhao Acting Minister of Works and Commissioner of Jinghai Army.',
    idiomatic: 'On yiyou Sun Dezhao was made Jinghai commissioner.',
  },
  s0668: {
    literal: 'On bingxu, Grand Councilor Cui Yin was advanced to Minister of Works.',
    idiomatic: 'On bingxu Cui Yin was advanced to minister of works.',
  },
  s0669: {
    literal: 'On jichou, Zhu Quanzhong shackled Cheng Yan, broke his feet in a cangue, sent him to the capital, and executed him in the market.',
    idiomatic: 'On jichou Quanzhong shackled Cheng Yan and executed him in the market.',
  },
  s0670: {
    literal: 'Edict: Crown Prince Yu was demoted to Prince of De, renamed You.',
    idiomatic: 'Crown Prince Yu was demoted to Prince of De, renamed You.',
  },
  s0671: {
    literal: 'On gengyin, an edict made Sun Dezhao Annan Commissioner and Acting Grand Guardian.',
    idiomatic: 'On gengyin Sun Dezhao was made Annan commissioner.',
  },
  s0672: {
    literal: 'Zhou Chenghui was made Yongzhou Prefect and Yong Circuit Commissioner; Dong Yanbi Rongzhou Prefect and Rong Circuit Commissioner—both Acting Grand Guardian and Grand Councilor.',
    idiomatic: 'Zhou Chenghui and Dong Yanbi were made commissioners and grand councilors.',
  },
  s0673: {
    literal: 'Shence Army commissioners Li Shiqian and Xu Yanhui were executed.',
    idiomatic: 'Li Shiqian and Xu Yanhui were executed.',
  },
  s0674: {
    literal: 'An edict said: "Since I began ruling, fourteen years have passed; I always admired the virtue of cherishing life and firmly had no heart to delight in killing."',
    idiomatic: 'An edict said: "Fourteen years I have ruled, cherishing life, never delighting in killing."',
  },
  s0675: {
    literal: 'Yesterday Jishu and others humiliated my person and coerced the crown prince.',
    idiomatic: 'Yesterday Jishu humiliated me and coerced the crown prince.',
  },
  s0676: {
    literal: 'Li Shiqian was the rebels\' close associate, chosen to oversee the Eastern Inner; in every movement he spied.',
    idiomatic: 'Li Shiqian was the rebels\' associate, chosen to spy in the Eastern Inner.',
  },
  s0677: {
    literal: 'Whenever there was need he would not supply.',
    idiomatic: 'He supplied nothing they needed.',
  },
  s0678: {
    literal: 'If paper and brush were sought he feared a forged edict; if awl and knife were sought he feared weapons—insult in ten thousand forms, going out searched.',
    idiomatic: 'Paper and brush he feared were edicts; awl and knife he feared were weapons—searched going out.',
  },
  s0679: {
    literal: 'The clothes I wore were worn by day and washed by night; in freezing cold hardship was unbearable.',
    idiomatic: 'Clothes were worn by day, washed by night; freezing cold was unbearable.',
  },
  s0680: {
    literal: 'Consorts and princesses lacked quilts.',
    idiomatic: 'Consorts and princesses had no bedding.',
  },
  s0681: {
    literal: 'Cash by the hundred would not enter; silk not an inch could be found.',
    idiomatic: 'Cash by the hundred never came; silk by the inch could not be found.',
  },
  s0682: {
    literal: 'Six eunuchs together directed; five men wielded their power.',
    idiomatic: 'Six eunuchs directed; five men wielded power.',
  },
  s0683: {
    literal: 'If their crimes were written, brush could not exhaust them; if life were granted it would violate law—they should all be executed."',
    idiomatic: 'Their crimes exhaust writing; grant life and law is violated—they should all be executed."',
  },
  s0684: {
    literal: 'At that time Zhu Quanzhong had subdued the three Hebei commands and wished to spy on the royal house for usurpation; Li Keyong at Taiyuan made him fear rivalry.',
    idiomatic: 'Quanzhong had subdued Hebei and eyed the throne; Keyong at Taiyuan made him fear rivalry.',
  },
  s0685: {
    literal: 'That month Quanzhong ordered Grand General Zhang Cunjing with thirty thousand troops by Hanshan to raid Hezhong\'s Wang Ke.',
    idiomatic: 'That month Quanzhong sent Zhang Cunjing with thirty thousand by Hanshan against Wang Ke.',
  },
  s0686: {
    literal: 'Jinzhou Prefect Zhang Hanyu and Jiangzhou Prefect Tao Jian did not expect the enemy; the cities were unprepared and both prefectures surrendered.',
    idiomatic: 'Jin and Jiang prefectures were unprepared and surrendered.',
  },
  s0687: {
    literal: 'Cunjing moved to besiege Hezhong; Wang Ke begged Taiyuan; Keyong could not save him and held the city telling Cunjing: "I have old ties with the Prince of Bian—when the prince arrives I shall submit."',
    idiomatic: 'Cunjing besieged Hezhong; Ke begged Taiyuan; Keyong could not save him; Ke said he would submit when Quanzhong arrived.',
  },
  s0688: {
    literal: '" Thus ended his pledge.',
    idiomatic: 'Thus he ended.',
  },
  s0689: {
    literal: 'In the second month, on jiayin, the first day.',
    idiomatic: 'Second month, jiayin new moon.',
  },
  s0690: {
    literal: 'On wuchen, Zhu Quanzhong reached Hezhong, moved Wang Ke with brothers Lin and Zan and the whole household to Bian, and left Zhang Cunjing to hold Hezhong.',
    idiomatic: 'On wuchen Quanzhong reached Hezhong, moved Wang Ke\'s household to Bian, and left Cunjing.',
  },
  s0691: {
    literal: 'That month an edict made Quanzhong Acting Grand Preceptor, Guardian Director of the Secretariat, advanced to Prince of Liang.',
    idiomatic: 'That month Quanzhong was made Prince of Liang.',
  },
  s0692: {
    literal: 'In the third month, on guimao, the first day, Quanzhong led the army back to Bian and memorialized: "The Hezhong commissioner yearly presented three thousand cartloads of salt—I now hold the pools and beg add two thousand, yearly five thousand.',
    idiomatic: 'Third month, guimao new moon: Quanzhong memorialized for five thousand cartloads of salt yearly.',
  },
  s0693: {
    literal: 'When the five pools are fully repaired, supply according to the usual fixed quota."',
    idiomatic: 'When pools are repaired, supply the usual quota."',
  },
  s0694: {
    literal: 'The edict was assented to.',
    idiomatic: 'The throne assented.',
  },
  s0695: {
    literal: 'In the fourth month, on guichou, the first day, Bian troops massed against Taiyuan; Shi Shuzong with thirty thousand by Tianjing Pass attacked Ze and Lu; Commissioner Meng Qian surrendered Shangdang.',
    idiomatic: 'Fourth month, guichou new moon: Bian massed against Taiyuan; Meng Qian surrendered Shangdang.',
  },
  s0696: {
    literal: 'Shuzong drove out encircling Bai, encamped at Donghuo Post.',
    idiomatic: 'Shuzong encamped at Donghuo Post.',
  },
  s0697: {
    literal: 'Ge Congzhou led Zhao, Wei, and Zhongshan troops through Tumen, took Chengtian Army, and joined Shuzong.',
    idiomatic: 'Ge Congzhou took Chengtian Army and joined Shuzong.',
  },
  s0698: {
    literal: 'It was heavy rain; fodder failed; Bian generals held the masses and returned.',
    idiomatic: 'Heavy rain; fodder failed; Bian generals withdrew.',
  },
  s0699: {
    literal: 'On jiaxu, the Son of Heaven performed rites at the ancestral temple.',
    idiomatic: 'On jiaxu the emperor performed temple rites.',
  },
  s0700: {
    literal: 'That day he faced Changle Gate, amnestied all under Heaven, and changed the era name to Tianfu.',
    idiomatic: 'That day he amnestied and changed the era to Tianfu.',
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
if (data.metadata.chapter !== '020') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 020; standalone T ready (${Object.keys(T).length} entries).`
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
