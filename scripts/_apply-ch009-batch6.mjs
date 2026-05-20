#!/usr/bin/env node
/** Batch 6: s0501–s0600 (Jiutangshu ch.009, Xuanzong 2 — Mawei, Shu, abdication, return, death, historian's appraisal) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0501: {
    literal:
      'On bingchen they halted at Mawei post station; the various guards encamped and would not advance.',
    idiomatic:
      'On bingchen the column stopped at Mawei post and the guards refused to march.',
  },
  s0502: {
    literal:
      'Longwu Grand General Chen Xuanli memorialized, saying, “The rebel barbarians point at the palace under the pretext of executing Guozhong, yet within and without none are without suspicion and resentment toward him.',
    idiomatic:
      'Chen Xuanli of the Longwu Guard said: the rebels march on Chang\'an to kill Guozhong, but everyone hates him.',
  },
  s0503: {
    literal:
      'Now the state is in peril and the imperial carriage shaken; Your Majesty should follow the feelings of the multitude for the great plan of the altars of soil and grain—Guozhong and his kind may be dealt with by law.',
    idiomatic:
      'The state was failing and the throne shaken; the emperor should give up Guozhong for the altars of soil and grain.',
  },
  s0504: {
    literal:
      'It happened that twenty-one Tibetan envoys blocked Guozhong at the post gate to complain; the crowd shouted, “Yang Guozhong joins the Tibetans in treason!”',
    idiomatic:
      'Tibetan envoys cornered Guozhong at the gate; the soldiers cried that he plotted with Tibet.',
  },
  s0505: {
    literal:
      'Soldiers surrounded the post on all four sides.',
    idiomatic:
      'Troops ringed the post.',
  },
  s0506: {
    literal:
      'When Yang Guozhong and the Wei Fangjin clan had been executed, the soldiers were still not appeased.',
    idiomatic:
      'Guozhong and the Wei clan were killed, yet the mutiny did not end.',
  },
  s0507: {
    literal:
      'The emperor ordered Gao Lishi to question them; he returned and reported, “The generals have killed Guozhong, but because the consort is in the palace the men still fear.”',
    idiomatic:
      'Gao Lishi reported that the soldiers feared the consort would bring revenge.',
  },
  s0508: {
    literal:
      'The emperor at once ordered Lishi to grant the consort death by her own hand.',
    idiomatic:
      'The emperor ordered Lishi to have the consort take her own life.',
  },
  s0509: {
    literal:
      'Chen Xuanli and the others saw the emperor and begged forgiveness; he ordered them released.',
    idiomatic:
      'Chen Xuanli begged pardon and was forgiven.',
  },
  s0510: {
    literal:
      'On dingyou, about to depart Mawei post, only Wei Jiansu among the courtiers remained; he therefore made Jiansu\'s son E, Recorder of the Capital District, Censor-in-Chief and Pacification Commissioner.',
    idiomatic:
      'On dingyou only Wei Jiansu remained at court; his son E became censor and pacification commissioner.',
  },
  s0511: {
    literal:
      'When they debated where to go, some soldiers said Hexi and Longyou, some Lingwu or Taiyuan, some that returning to the capital would be best.',
    idiomatic:
      'The soldiers argued for Hexi, Lingwu, Taiyuan, or a return to Chang\'an.',
  },
  s0512: {
    literal:
      'Wei E said, “To return to the capital there must be preparations to defend against the rebels; troops and horses are not yet gathered—I fear it is not secure. It is better for now to go to Fufeng and slowly consider our course.”',
    idiomatic:
      'Wei E urged Fufeng over Chang\'an until troops could be gathered.',
  },
  s0513: {
    literal:
      'The emperor asked the multitude; all agreed.',
    idiomatic:
      'He put the question to the column; all assented.',
  },
  s0514: {
    literal:
      'When they set out, the people blocked the road begging the crown prince to remain, wishing to exert their strength to destroy the rebels and recover the capital; thus the heir was left behind.',
    idiomatic:
      'The crowd begged the crown prince to stay and fight for the capital, and he was left behind.',
  },
  s0515: {
    literal:
      'On wuxu they halted at Fufeng county.',
    idiomatic:
      'On wuxu they reached Fufeng county.',
  },
  s0516: {
    literal:
      'On jihai they halted at Fufeng commandery.',
    idiomatic:
      'On jihai they reached Fufeng commandery.',
  },
  s0517: {
    literal:
      'The soldiers each thought of leaving; ugly words were spoken; Chen Xuanli could not control them.',
    idiomatic:
      'The troops muttered of desertion and Chen Xuanli could not restrain them.',
  },
  s0518: {
    literal:
      'It happened that a tribute of one hundred thousand bolts of spring silks from Yizhou arrived; the emperor had it all placed in the courtyard and summoned the generals, saying to them, “You are meritorious servants of the state and have long exerted your strength; my generous rewards have never been slight.',
    idiomatic:
      'Yizhou tribute silk filled the courtyard as the emperor told his generals how long they had served and how he had rewarded them.',
  },
  s0519: {
    literal:
      'The rebel barbarians have betrayed grace; the affair requires withdrawal.',
    idiomatic:
      'The rebels had betrayed grace and the court had to withdraw.',
  },
  s0520: {
    literal:
      'I well know you cannot take leave of parents, wives, and children—I too have not been able to bid farewell in person to the nine temples.”',
    idiomatic:
      'He knew they could not bid their families farewell—he had not even taken leave of the ancestral temple.',
  },
  s0521: {
    literal:
      'As he spoke, tears flowed.',
    idiomatic:
      'He wept as he spoke.',
  },
  s0522: {
    literal:
      'He also said, “I must go to Shu; the road is narrow and dangerous—if too many go, I fear supplies cannot be borne.',
    idiomatic:
      'He said the road to Shu was too narrow for a crowd.',
  },
  s0523: {
    literal:
      'Now there is this silk; you should at once divide it and each plan whether to stay or go.',
    idiomatic:
      'He bade them divide the silk and choose stay or go.',
  },
  s0524: {
    literal:
      'I have my own sons, younger brothers, and palace attendants to follow me, and I will now take leave of you.”',
    idiomatic:
      'Only his kin and eunuchs would follow; he took leave of the rest.',
  },
  s0525: {
    literal:
      'All prostrated themselves weeping, saying, “Life and death—we wish to follow Your Majesty.”',
    idiomatic:
      'All wept that they would follow him to the death.',
  },
  s0526: {
    literal:
      'The emperor said, “To go or stay is for you to decide.”',
    idiomatic:
      'The emperor said, “Go or stay as you will.”',
  },
  s0527: {
    literal:
      'From this the seditious talk gradually ceased.',
    idiomatic:
      'After that the mutinous talk died away.',
  },
  s0528: {
    literal:
      'On gengzi, Director of Merit Cui Yuan, Acting Military Commissioner of Sword South, was made chief of Shu commandery and Deputy Military Commissioner of Sword South.',
    idiomatic:
      'On gengzi Cui Yuan became Shu chief and Sword South deputy commissioner.',
  },
  s0529: {
    literal:
      'Prince Ying Wang Hui was made Military Commissioner of Sword South; Investigating Censor Song Ruosi was made Censor-in-Chief and Pacification Commissioner; Wei E was made Commissioner for Inspecting the Post Road—all ordered to go ahead.',
    idiomatic:
      'Prince Ying Hui headed for Shu with Song Ruosi and Wei E sent ahead to prepare the route.',
  },
  s0530: {
    literal:
      'On xinchou they departed Fufeng commandery; that evening they halted at Chencang.',
    idiomatic:
      'On xinchou they left Fufeng and camped at Chencang.',
  },
  s0531: {
    literal:
      'On renyin they halted at San Pass.',
    idiomatic:
      'On renyin they reached San Pass.',
  },
  s0532: {
    literal:
      'The entourage was divided into six armies; Prince Ying Hui went ahead; Princes Shou Ma and others each commanded one of the six armies, front and rear, left and right, in succession.',
    idiomatic:
      'The column split into six armies under the princes, Ying Hui in the van.',
  },
  s0533: {
    literal:
      'On bingwu they halted at Hechi commandery; Cui Yuan memorialized that in Sword South the year\'s harvest was good and the people at peace, with abundant stores—the emperor was greatly pleased and made Yuan Vice Director of the Secretariat and Grand Councillor, retaining his posts as chief of Shu and Sword South commissioner.',
    idiomatic:
      'At Hechi Cui Yuan reported Shu was stocked with grain; the emperor made him vice director and councillor.',
  },
  s0534: {
    literal:
      'Former Huazhou prefect Wei Xi was made chief of Liangzhou.',
    idiomatic:
      'Wei Xi became Liangzhou chief.',
  },
  s0535: {
    literal:
      'In autumn, the seventh month on guichou, the first day of the month.',
    idiomatic:
      'The seventh month opened on guichou.',
  },
  s0536: {
    literal:
      'On renxu they halted at Yichang county, crossed the Jibai River, and a pair of fish leaped on either side of the boat; debaters took it for a dragon.',
    idiomatic:
      'On renxu at Yichang twin fish leaped beside the boat—omen of a dragon, men said.',
  },
  s0537: {
    literal:
      'On jiazi they halted at Pu\'an commandery; Vice Minister of Justice Fang Guan arrived from behind; the emperor spoke with him at great length and that same day made him Minister of Personnel and Grand Councillor.',
    idiomatic:
      'On jiazi at Pu\'an Fang Guan caught up and was made personnel minister and councillor the same day.',
  },
  s0538: {
    literal:
      'On dingmao an edict made the crown prince supreme commander of all armies, commanding the military commissioners of Shuofang, Hedong, Hebei, Pinglu, and the rest to recover the two capitals;',
    idiomatic:
      'On dingmao the crown prince was made supreme commander to retake the two capitals;',
  },
  s0539: {
    literal:
      'Prince Yong Wang Lin Governor of Jiangling, supreme commander of Shannan East Circuit, Qianzhong, Jiangnan West Circuit, and other commissioners;',
    idiomatic:
      'Prince Yong Lin governed Jiangling over the southern circuits;',
  },
  s0540: {
    literal:
      'Prince Sheng Wang Qi Grand Governor of Guangling, supreme commander of Jiangnan East Circuit, Huainan, Henan, and other routes;',
    idiomatic:
      'Prince Sheng Qi held Huainan and the lower Yangzi;',
  },
  s0541: {
    literal:
      'Prince Feng Wang Gong Governor of Wuwei, commanding Hexi, Longyou, Anxi, Beiting, and other routes.',
    idiomatic:
      'Prince Feng Gong held the northwest frontiers.',
  },
  s0542: {
    literal:
      'Earlier, when the capital fell to the rebels, the imperial carriage had fled in haste and none knew whither; hearts were shaken. When this edict was heard, far and near rejoiced and all wished to devote loyalty to restoration.',
    idiomatic:
      'When the capital fell none knew where the emperor fled; this edict made the realm hope again for restoration.',
  },
  s0543: {
    literal:
      'On gengwu they halted at Baxi commandery; prefect Cui Huan came out to welcome.',
    idiomatic:
      'On gengwu at Baxi Cui Huan welcomed the court.',
  },
  s0544: {
    literal:
      'That same day Huan was made Vice Director of the Chancellery and Grand Councillor.',
    idiomatic:
      'That day Cui Huan became vice chancellor.',
  },
  s0545: {
    literal:
      'Wei Jiansu was made Left Chancellor.',
    idiomatic:
      'Wei Jiansu became left chancellor.',
  },
  s0546: {
    literal:
      'On gengchen the imperial carriage reached Shu commandery; of attending officials, soldiers, and servitors who arrived there were only one thousand three hundred, and palace women only twenty-four.',
    idiomatic:
      'On gengchen the court reached Chengdu—thirteen hundred followers and twenty-four palace women.',
  },
  s0547: {
    literal:
      'On guiwei, the first day of the eighth month, he held court at the yamen of the Shu capital and proclaimed an edict, saying, “I, of slight virtue, have succeeded in guarding the sacred vessel. Constantly I am diligent and wary, mindful of the living; if one thing is lost, I do not forget to blame myself.',
    idiomatic:
      'On guiwei he held court at Chengdu and began an edict confessing slight virtue and constant care for the people.',
  },
  s0548: {
    literal:
      'For nearly four reign-periods the people have known modest peace; I have given my heart to others and not doubted things.',
    idiomatic:
      'For four reign-periods the people had known modest peace; he had trusted others without suspicion.',
  },
  s0549: {
    literal:
      'Yet treacherous ministers and vicious underlings abandoned righteousness and betrayed grace, flaying the black-haired people and disturbing the realm—all my own want of clarity.',
    idiomatic:
      'Traitors had flayed the people and disturbed the realm—all his own want of clarity.',
  },
  s0550: {
    literal:
      'Now I tour and instruct Ba and Shu, train armies and soldiers, and still order the crown prince and imperial princes to gather troops at strategic posts, execute the vicious and foul, to answer Heaven;',
    idiomatic:
      'He would train armies in Ba-Shu, order princes to gather troops, and execute the vicious to answer Heaven;',
  },
  s0551: {
    literal:
      'I desire with the ministers again to enlarge the Way of governance—a great amnesty for all under Heaven.”',
    idiomatic:
      'and with his ministers enlarge the Way of governance—a great amnesty for all under Heaven.',
  },
  s0552: {
    literal:
      'On guisi an envoy from Lingwu arrived; they first learned that the crown prince had ascended the throne.',
    idiomatic:
      'On guisi word came from Lingwu that the crown prince had become emperor.',
  },
  s0553: {
    literal:
      'On dingyou the emperor used the Lingwu investiture and styled himself Retired Emperor; edicts were styled pronouncements.',
    idiomatic:
      'On dingyou he took the title Retired Emperor and styled his orders pronouncements.',
  },
  s0554: {
    literal:
      'On jihai the Retired Emperor faced the hall to invest Su Zong; he ordered chancellors Wei Jiansu and Fang Guan to go to Lingwu. The investiture order read: “I style myself Retired Emperor; military and state affairs are first decided by the emperor and afterward reported to my knowledge.',
    idiomatic:
      'On jihai he invested Suzong at court and sent Jiansu and Fang Guan to Lingwu: military affairs would pass through the new emperor.',
  },
  s0555: {
    literal:
      'When the two capitals are recovered, I shall nourish my spirit at Guye and rest in the great court.”',
    idiomatic:
      'When the capitals were recovered he would retire to nourish his spirit and rest from rule.',
  },
  s0556: {
    literal:
      '”',
    idiomatic:
      'The investiture edict closed there.',
  },
  s0557: {
    literal:
      'In the ninth month of the following year Guo Ziyi recovered the two capitals.',
    idiomatic:
      'The next ninth month Guo Ziyi retook the two capitals.',
  },
  s0558: {
    literal:
      'In the tenth month Suzong sent Palace Attendant Dan Tingyao into Shu to escort him back.',
    idiomatic:
      'In the tenth month Suzong sent Dan Tingyao to bring him home from Shu.',
  },
  s0559: {
    literal:
      'On dingmao the Retired Emperor departed Shu commandery.',
    idiomatic:
      'On dingmao he left Chengdu.',
  },
  s0560: {
    literal:
      'In the eleventh month on bingchen he halted at Fengxiang commandery.',
    idiomatic:
      'In the eleventh month he reached Fengxiang.',
  },
  s0561: {
    literal:
      'Suzong sent three thousand elite horsemen to Fufeng to escort and guard him.',
    idiomatic:
      'Suzong sent three thousand cavalry to meet him at Fufeng.',
  },
  s0562: {
    literal:
      'On bingwu, the twelfth month, Suzong came in full imperial regalia to Wangxian post station in Xianyang to welcome him.',
    idiomatic:
      'On bingwu Suzong met him at Wangxian post in full regalia.',
  },
  s0563: {
    literal:
      'The Retired Emperor mounted the south tower of the palace; Suzong bowed below the Tower of Celebration, weeping uncontrollably. He walked before the Retired Emperor holding the reins; the Retired Emperor stroked his back to stop him, then rode ahead as guide.',
    idiomatic:
      'Father and son met at Wangxian: Suzong wept, tried to lead the horse, and the retired emperor gently refused.',
  },
  s0564: {
    literal:
      'On dingwei they reached the capital; civil and military officials and the people of the capital lined the roads shouting for joy, none without tears.',
    idiomatic:
      'On dingwei Chang\'an lined the roads in tears of joy.',
  },
  s0565: {
    literal:
      'That day he held court in the Hall of Encompassing Primordium of the Great Bright Palace and saw the hundred officials; the Retired Emperor personally comforted and inquired of each.',
    idiomatic:
      'That day he sat in the Hall of Encompassing Primordium and spoke to each minister.',
  },
  s0566: {
    literal:
      'Every man was moved to weeping.',
    idiomatic:
      'All wept.',
  },
  s0567: {
    literal:
      'At the time the Imperial Ancestral Temple had been burned by the rebels; the spirit tablets were temporarily moved to the Chang\'an Hall of the inner palace. The Retired Emperor worshipped at the temple to confess guilt, then went to Xingqing Palace.',
    idiomatic:
      'The ancestral temple was burned; he worshipped the moved tablets and went to Xingqing Palace.',
  },
  s0568: {
    literal:
      'In the second month of the third year Suzong and the ministers presented the Retired Emperor the honorific Retired Emperor of the Supreme Way and Sagely Sovereign.',
    idiomatic:
      'In the third year Suzong gave him the title Retired Emperor of the Supreme Way and Sagely Sovereign.',
  },
  s0569: {
    literal:
      'On dingwei of the seventh month of Qianyuan 3 he moved to the Sweet Dew Hall in the Western Inner Palace.',
    idiomatic:
      'On Qianyuan 3, seventh month, he moved to Sweet Dew Hall in the western palace.',
  },
  s0570: {
    literal:
      'At the time the eunuch Li Fuguo drove a wedge between father and son; hence the move to the western inner palace.',
    idiomatic:
      'Eunuch Li Fuguo had estranged father and son, so he was moved west.',
  },
  s0571: {
    literal:
      'Gao Lishi, Chen Xuanli, and others were banished; the Retired Emperor grew ever less at ease.',
    idiomatic:
      'Lishi and Chen Xuanli were exiled; the retired emperor sank into gloom.',
  },
  s0572: {
    literal:
      'In the fourth month of Shangyuan 2, on jiayin, he died in the Hall of Divine Dragon at the age of seventy-eight.',
    idiomatic:
      'On jiayin of Shangyuan 2 he died in the Hall of Divine Dragon, aged seventy-eight.',
  },
  s0573: {
    literal:
      'The ministers gave the posthumous title Retired Emperor of the Supreme Way, Great Sagely, Great Bright Filial Emperor; his temple name was Xuanzong.',
    idiomatic:
      'He was posthumously styled Retired Emperor of the Supreme Way, Great Sagely, Great Bright Filial Emperor, temple name Xuanzong.',
  },
  s0574: {
    literal:
      'Earlier, when the Retired Emperor in person worshipped at the five tombs and reached Qiao Tomb, he saw on the golden millet hillock the momentum of a dragon coiling and a phoenix soaring, again near the former burial mound. He said to his attendants, “After my thousand autumns I should be buried in this place, able to attend the former tombs— not forgetting filial respect.”',
    idiomatic:
      'At Qiao tomb he chose his own grave on a dragon-and-phoenix hillock beside his forebears.',
  },
  s0575: {
    literal:
      'At this time they followed his former command to establish the burial park and on xinyou of the third month of Guangde 1 buried him at Tai Tomb.',
    idiomatic:
      'He was buried at Tai Tomb on Guangde 1, third month, xinyou, as he had wished.',
  },
  s0576: {
    literal:
      '[Appraisal] The historian says: Confucius said, “A king must pass through generations before benevolence is achieved.”',
    idiomatic:
      'The historian says: Confucius held that true kingship needs generations to ripen into benevolence.',
  },
  s0577: {
    literal:
      'For more than thirty years after the Li clan, when Empress Wu shifted the state, the court rarely had upright men; those who attached themselves were none but the dangerous.',
    idiomatic:
      'For thirty years after Wu Zetian seized power the court had few honest men and many who clung to the vicious.',
  },
  s0578: {
    literal:
      'Holding bribes they begged audience and ran to the gates of power;',
    idiomatic:
      'They bought office with gifts and ran to powerful gates;',
  },
  s0579: {
    literal:
      'like hawks and dogs they flew to slander upright gentlemen.',
    idiomatic:
      'like hawks and hounds they flew to ruin the upright.',
  },
  s0580: {
    literal:
      'Thus they severed and ruined the royal house and slaughtered the imperial clan.',
    idiomatic:
      'So the royal house was broken and the imperial clan slaughtered.',
  },
  s0581: {
    literal:
      'Stalwart great ministers were repeatedly framed; cruel clerks who twisted the law sat in glory.',
    idiomatic:
      'Bone-hard ministers were framed again and again while legalist butchers won glory.',
  },
  s0582: {
    literal:
      'Rites and music no longer flourished; punishments and government were ruined worse than by dogs and horses. The chief ministers uttered the language of flatterers; the imperial cap bore the name of one who harmonized affairs—faction became the wind, and shame was utterly gone.',
    idiomatic:
      'Rites died, justice became a kennel, ministers flattered, and faction drowned shame.',
  },
  s0583: {
    literal:
      'When we of Kaiyuan possessed the realm we corrected it with statutes, clarified it with rites and music, cherished it with kindness and thrift, and measured it with standards.',
    idiomatic:
      'Under Kaiyuan we corrected the realm with law, clarified it with ritual, tempered it with kindness and thrift, and bound it with measure.',
  },
  s0584: {
    literal:
      'We dismissed the fortune-seeking ministers of the previous court and blocked their treachery;',
    idiomatic:
      'We dismissed the previous court\'s fortune-hunters and blocked treachery;',
  },
  s0585: {
    literal:
      'we burned the pearl and jade playthings of the rear palaces and warned against extravagance;',
    idiomatic:
      'we burned the rear palace\'s pearls and jades and warned against extravagance;',
  },
  s0586: {
    literal:
      'we forbade women\'s music and sent palace women out, making the teaching clear;',
    idiomatic:
      'we banned women\'s music, sent palace women out, and made teaching clear;',
  },
  s0587: {
    literal:
      'we granted feasts and rewards and released vulgar music, fearing dissipation;',
    idiomatic:
      'we feasted the realm yet banished vulgar song, fearing dissipation;',
  },
  s0588: {
    literal:
      'we ordered brotherly affection and thickened kinship, enriching the custom;',
    idiomatic:
      'we honored brotherhood and thickened kin ties;',
  },
  s0589: {
    literal:
      'we gathered troops and held commanders accountable, making military law clear;',
    idiomatic:
      'we mustered troops and held generals accountable;',
  },
  s0590: {
    literal:
      'we held court assemblies and reckoned merit, comparing officials\' ability.',
    idiomatic:
      'we assembled the court and ranked officials by merit.',
  },
  s0591: {
    literal:
      'In the hall there were none who were not men of statecraft;',
    idiomatic:
      'In the hall none lacked statecraft;',
  },
  s0592: {
    literal:
      'among the memorials all were men fit for deliberation.',
    idiomatic:
      'among memorials all were fit for deliberation.',
  },
  s0593: {
    literal:
      'Moreover we sought broadly for great scholars and lectured on the arts and letters.',
    idiomatic:
      'We sought great scholars and lectured on the classics.',
  },
  s0594: {
    literal:
      'Good words and excellent plans were daily heard in remonstrance and submission;',
    idiomatic:
      'Good counsel came daily at the throne;',
  },
  s0595: {
    literal:
      'holding long reins and driving far, the will was set on ascending to peace.',
    idiomatic:
      'With long reins and a distant view we aimed at peace.',
  },
  s0596: {
    literal:
      'The style of Zhenguan was in one morning restored.',
    idiomatic:
      'In a morning the Zhenguan age seemed reborn.',
  },
  s0597: {
    literal:
      'In that time beacon fires were not alarmed; Chinese and barbarian shared the same track.',
    idiomatic:
      'Then the frontier was quiet and barbarian and Chinese shared one road.',
  },
  s0598: {
    literal:
      'Western barbarian chieftains crossed the rope bridge and vied to offer tribute at Jade Gate;',
    idiomatic:
      'Western chiefs crossed rope bridges to offer tribute at Jade Gate;',
  },
  s0599: {
    literal:
      'northern Di chieftains cast aside felt tents and strove to hurry to Wild Goose Pass.',
    idiomatic:
      'northern chiefs threw down their tents and raced to Wild Goose Pass.',
  },
  s0600: {
    literal:
      'Curios of Elephant commandery and Hot Prefecture, treasures of Silla and the herring sea—all without exception came in caravans through the interpreters and crowded the offices of protocol.',
    idiomatic:
      'Exotic goods from the far south and far east crowded the interpreters\' road to the capital.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/009.json';
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
if (trans.metadata.chapter !== '009') {
  throw new Error(`Expected chapter 009, got ${trans.metadata.chapter}`);
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
console.log(`Applied ${applied} translations (s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')})`);
