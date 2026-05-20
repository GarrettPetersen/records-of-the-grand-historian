#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 20, Biographies 14',
    'Book of Liang, Volume 20, Biographies 14',
  ],
  s0002: [
    'Liu Lijian; Chen Bozhi',
    'Liu Lijian; Chen Bozhi',
  ],
  s0003: [
    'Liu Lijian, styled Huixu, was a native of Pengcheng.',
    'Liu Lijian, styled Huixu, came from Pengcheng.',
  ],
  s0004: [
    'His father Sikao, as a cousin of Song\'s founding sovereign Gaozu, had been eminent in the Song age and rose to Grand Master of Splendid Virtue with Golden Seal and Purple Ribbon.',
    'His father Sikao, kin to Song Gaozu, shone in the Song age and rose to Grand Master of Splendid Virtue with Golden Seal and Purple Ribbon.',
  ],
  s0005: [
    'Lijian had a fine reputation and early passed through pure offices.',
    'Lijian was widely esteemed and early held clean posts.',
  ],
  s0006: [
    'When Qi Gaozu accepted the abdication, he was set to slay all near kin of the Song house; Lijian\'s turn was coming, but the grand minister Chu Yuan, who had long favored him, pleaded hard and he was spared.',
    'When Qi Gaozu took the throne he meant to kill every near branch of Song; Lijian was next, but Chu Yuan, who had long favored him, pleaded until he was spared.',
  ],
  s0007: [
    'In the Jianyuan era he was Left Director in the Masters of Writing.',
    'In Jianyuan he was Left Director in the Masters of Writing.',
  ],
  s0008: [
    'At the opening of Yongming he went out as interior governor of Jiangxia, rose through interior governor of Pingnan and Changsha, champion staff officer and Guangling prefect, all while running his district seat.',
    'At Yongming\'s opening he was Jiangxia interior governor, then Pingnan and Changsha, champion staff officer and Guangling prefect, all running his seat.',
  ],
  s0009: [
    'He entered as Gentleman Attendant of the Yellow Gate who presents matters, then became crown prince chief of staff.',
    'He entered as Yellow Gate attendant, then crown prince chief of staff.',
  ],
  s0010: [
    'In the Jianwu era he again went out as staff officer to Pingxi general Xiao Yaoqin and prefect of Nankang.',
    'In Jianwu he again went out as staff officer to Pingxi general Xiao Yaoqin and Nankang prefect.',
  ],
  s0011: [
    'At that time the Ming Emperor\'s sons were young and weak; for kin within the palace he relied on the Yaoqin brothers, for kin without on the empress\'s brother Liu Xuan and her brother-in-law Jiang Shi.',
    'The Ming Emperor\'s sons were still young; inside the palace he leaned on the Yaoqin brothers, outside on the empress\'s brother Liu Xuan and her brother-in-law Jiang Shi.',
  ],
  s0012: [
    'When Yaoqin took his post at Jiangling his trust ran deep;',
    'When Yaoqin held Jiangling, trust in him ran deep;',
  ],
  s0013: [
    'but once in the province he drew in many guests and fattened himself on graft, and the Ming Emperor came to hate him.',
    'but in the province he gathered guests and grew fat on graft, and the Ming Emperor came to hate him.',
  ],
  s0014: [
    'Lijian\'s clan nephew Wang Hui of Langya served as Yaoqin\'s advising staff officer—handsome, quick with words; Yaoqin favored him greatly.',
    'Lijian\'s clan nephew Wang Hui of Langya was Yaoqin\'s advising staff officer—handsome and sharp-tongued; Yaoqin favored him.',
  ],
  s0015: [
    'Hui was often insolent; at a public session he vied with Yaoqin to mock Lijian, who bore a grudge and secretly reported to the Ming Emperor that Yaoqin showed suspicious conduct.',
    'Hui was insolent; before the assembly he and Yaoqin mocked Lijian together. Lijian nursed the grudge and secretly told the Ming Emperor that Yaoqin showed suspicious signs.',
  ],
  s0016: [
    'The emperor took it in and made Yaoqin inspector of Yongzhou.',
    'The emperor believed him and made Yaoqin Yongzhou inspector.',
  ],
  s0017: [
    'The emperor was grateful to Lijian; in year four he made him Supporting-the-State General and inspector of Yizhou, ordering him to hold the upper reaches against Yaoqin.',
    'Grateful to Lijian, in year four the emperor made him Supporting-the-State General and Yizhou inspector, set to hold the upper river against Yaoqin.',
  ],
  s0018: [
    'Lijian\'s father in the Song age had held Yizhou, greedy and without good governance, yet the people, still for old friendship\'s sake, treated Lijian kindly.',
    'His father had held Yizhou in Song times, greedy and without merit, yet the people, for old friendship\'s sake, still treated Lijian kindly.',
  ],
  s0019: [
    'When Lijian stepped down from his carriage he inquired of elders, comforted old and new ties, and when he saw his father\'s former clerks he wept openly with them.',
    'On taking office he asked after elders, comforted old and new ties, and wept with his father\'s former clerks.',
  ],
  s0020: [
    'He recruited Gong Yi of Suining as his chief clerical secretary.',
    'He made Gong Yi of Suining his chief clerical secretary.',
  ],
  s0021: [
    'Yi was grandson of Gong Ying; for generations the house had learning and conduct, so he was brought in.',
    'Yi was Gong Ying\'s grandson; learning and conduct ran in the line, so he was brought in.',
  ],
  s0022: [
    'When Eastern Depravity took the throne, in the first year of Yongyuan, Lijian was summoned as Right Guard General but the roads were cut and he did not come.',
    'When Eastern Depravity took the throne, in Yongyuan year one Lijian was summoned as Right Guard General; the roads were cut and he never came.',
  ],
  s0023: [
    'Hearing the capital racked with troubles because of Eastern Depravity\'s loss of virtue, he grew somewhat proud and arrogant.',
    'Hearing Eastern Depravity\'s loss of virtue and the capital\'s many troubles, he grew proud.',
  ],
  s0024: [
    'He had been known as a man of letters; nature jealous and narrow-minded—now he turned harsh, obstinate, cruel, and fierce, and the locals first nursed resentment.',
    'Famed as a man of letters, jealous and narrow by nature, he now turned harsh, obstinate, cruel, and fierce, and the land began to resent him.',
  ],
  s0025: [
    'That September, under pretext of a gathering, he levied five thousand men, claiming drill, and sent middle army staff officer Song Mai to lead them in surprise at Zhongshui.',
    'That September, at a gathering, he levied five thousand men under cover of drill and sent middle army staff officer Song Mai to strike Zhongshui by surprise.',
  ],
  s0026: [
    'The people of Rang, Li Tuo, learned beforehand, barred the passes, and Mai fought poorly and retreated to the provincial seat; commanderies and counties rebelled far and wide.',
    'Li Tuo of Rang learned beforehand, barred the passes, and Mai fought poorly and retreated; commanderies and counties rebelled everywhere.',
  ],
  s0027: [
    'That month Zhao Xubo of Xincheng killed the magistrate of Wucheng and drove out the grand administrator of Shiping.',
    'That month Zhao Xubo of Xincheng killed the magistrate of Wucheng and drove out Shiping\'s grand administrator.',
  ],
  s0028: [
    'In the tenth month Le Baocheng and Li Nandang of Jinyuan killed their grand administrator; Baocheng styled himself inspector of Southern Qin, Nandang inspector of Yizhou.',
    'In the tenth month Le Baocheng and Li Nandang of Jinyuan killed their grand administrator; Baocheng styled himself Southern Qin inspector, Nandang Yizhou inspector.',
  ],
  s0029: [
    'In the twelfth month Lijian sent staff officer Cui Maozu with two thousand to suppress them, with three days\' provisions.',
    'In the twelfth month Lijian sent staff officer Cui Maozu with two thousand to suppress them, with three days\' grain.',
  ],
  s0030: [
    'The year was bitterly cold; rebels gathered to fell trees and block the roads; the army found neither fire nor water, was routed, and seven or eight in ten died.',
    'The year was bitter cold; rebels felled trees to block the road; the army found no fire or water, was routed, and seven or eight in ten died.',
  ],
  s0031: [
    'The next first month the people of Xincheng, Bo Yang, drove out Suining prefect Qiao Xiyuan.',
    'Next first month Bo Yang of Xincheng drove out Suining prefect Qiao Xiyuan.',
  ],
  s0032: [
    'In the third month Yong Daoxi of Baxi led more than ten thousand rebels against Baxi, a few li from the commandery seat; he styled himself Pacifying-the-West General and proclaimed the army of Righteous Purpose.',
    'In the third month Yong Daoxi of Baxi led more than ten thousand rebels within a few li of the seat, styled himself Pacifying-the-West General, and raised the banner of Righteous Purpose.',
  ],
  s0033: [
    'Baxi prefect Lu Xiulie and Fuling magistrate Li Ying shut the city and held firm; Lijian sent middle army staff officer Li Fengbo with five thousand to rescue them.',
    'Baxi prefect Lu Xiulie and Fuling magistrate Li Ying shut the walls; Lijian sent middle army staff officer Li Fengbo with five thousand to rescue them.',
  ],
  s0034: [
    'Fengbo arrived, joined the commandery troops, broke and captured Daoxi, and beheaded him in the Fuling market.',
    'Fengbo arrived, joined the commandery troops, broke Daoxi, and beheaded him in the Fuling market.',
  ],
  s0035: [
    'Fengbo then pressed alone into the eastern villages of Baxi to hunt down the remainder.',
    'Fengbo then pressed alone into Baxi\'s eastern villages to hunt the remainder.',
  ],
  s0036: [
    'Li Ying stopped him: "The troops are lax and the general arrogant; to press an advantage over steep ground is no sound plan.',
    'Li Ying stopped him: "Troops are lax and the general arrogant; to press an advantage over steep ground is no sound plan.',
  ],
  s0037: [
    'Better slow a little and weigh the next move."',
    'Better slow a little and weigh what comes next."',
  ],
  s0038: [
    'Fengbo would not heed him, took the whole force into the hills, was routed coming out, and fled back to the provincial seat.',
    'Fengbo would not listen, took the whole force into the hills, was routed coming out, and fled to the provincial seat.',
  ],
  s0039: [
    'In the sixth month Cheng Yanqi of Jiangyang rebelled and killed prefect He Fazang.',
    'In the sixth month Cheng Yanqi of Jiangyang rebelled and killed prefect He Fazang.',
  ],
  s0040: [
    'Lu Xiulie, fearing he could not hold, fled to seek refuge with Badong adjutant Xiao Huixun.',
    'Lu Xiulie, fearing he could not hold, fled to Badong adjutant Xiao Huixun for refuge.',
  ],
  s0041: [
    'In the tenth month Zhao Xubo of Baxi rebelled again with twenty thousand men, marching from Guanghan, riding a Buddha-cart, wrapping blue stone in five-colored cloth, and telling the people: "Heaven has given me a jade seal—I shall be king in Shu."',
    'In the tenth month Zhao Xubo of Baxi rebelled again with twenty thousand men, marching from Guanghan in a Buddha-cart, blue stone wrapped in five colors, telling the people, "Heaven gave me a jade seal—I shall be king in Shu."',
  ],
  s0042: [
    'Fools followed him in great numbers.',
    'Fools followed in great numbers.',
  ],
  s0043: [
    'Lijian advanced to punish him and sent his chief clerk Zhao Yuechang as vanguard.',
    'Lijian advanced to punish him and sent chief clerk Zhao Yuechang ahead.',
  ],
  s0044: [
    'The army was defeated; Lijian again sent Li Fengbo by the Fuling road.',
    'The army was beaten; Lijian again sent Li Fengbo by the Fuling road.',
  ],
  s0045: [
    'Fengbo\'s detached column came from Chanting Pavilion and joined the main force outside the city, stormed the palisade, and won a great victory.',
    'Fengbo\'s detached column came from Chanting Pavilion, joined the main force at the city, stormed the palisade, and won a great victory.',
  ],
  s0046: [
    'At that time Shiwen\'an of Kuaiji, styled Shouxiu, lived in seclusion in his district practicing courtesy and deference, had replaced Lijian as Left Director, gone out as Jiangxia interior governor, and again replaced Lijian as Censor-in-Chief—he and Lijian were on good terms.',
    'At that time Shiwen\'an of Kuaiji, styled Shouxiu, lived in seclusion practicing courtesy, had replaced Lijian as Left Director, gone out as Jiangxia interior governor, then replaced him again as Censor-in-Chief—and he and Lijian were friends.',
  ],
  s0047: [
    'His son Zhongyuan, styled Qinhui, hearing the Righteous Army had risen, led the district men to answer Gaozu.',
    'His son Zhongyuan, styled Qinhui, hearing the Righteous Army had risen, led the district to answer Gaozu.',
  ],
  s0048: [
    'At the start of Tianjian he was made Bieyu of Yingzhou and followed Gaozu to pacify the capital.',
    'At Tianjian\'s opening he was Yingzhou Bieyu and followed Gaozu to pacify the capital.',
  ],
  s0049: [
    'The next spring Gaozu sent his close attendant Chen Jiansun to convey Lijian\'s younger brother Tongzhilang Ziyuan and Lijian\'s two sons into Shu with imperial words of comfort.',
    'Next spring Gaozu sent close attendant Chen Jiansun to bring Lijian\'s younger brother Tongzhilang Ziyuan and Lijian\'s two sons into Shu with words of comfort.',
  ],
  s0050: [
    'Lijian accepted the charge and prepared to return.',
    'Lijian accepted the charge and prepared to return.',
  ],
  s0051: [
    'Gaozu made western headquarters general Deng Yuanqi inspector of Yizhou.',
    'Gaozu made western headquarters general Deng Yuanqi Yizhou inspector.',
  ],
  s0052: [
    'Yuanqi was a man of Nankang commandery.',
    'Yuanqi came from Nankang commandery.',
  ],
  s0053: [
    'When Lijian had held Nankang he had always looked down on Yuanqi.',
    'When Lijian had held Nankang he had always looked down on Yuanqi.',
  ],
  s0054: [
    'Chief controller Zhu Daochen had once been head recorder in Lijian\'s office—a worthless rogue with crimes; Lijian meant to kill him but he fled and lived.',
    'Chief controller Zhu Daochen had once been head recorder in Lijian\'s office—a worthless rogue with crimes; Lijian meant to kill him but he fled and lived.',
  ],
  s0055: [
    'Now he told Yuanqi: "Yizhou has been in disorder long; public and private treasuries must be drained. When Inspector Liu leaves he will empty everything—how could he still send escorts far away?',
    'Now he told Yuanqi, "Yizhou has been torn apart for years; public and private treasuries must be drained. When Inspector Liu leaves he will empty everything—how could he still send escorts from afar?',
  ],
  s0056: [
    'Let me first go to inspect, and along the road pay court and welcome you;',
    'Let me go first to inspect and along the road pay court and welcome you;',
  ],
  s0057: [
    'otherwise ten thousand li of supplies will not be easy to obtain."',
    'otherwise supplies for ten thousand li will not come easy."',
  ],
  s0058: [
    'Yuanqi agreed.',
    'Yuanqi agreed.',
  ],
  s0059: [
    'Once Daochen arrived his speech was disrespectful; he went from office to office among the district\'s men, and wherever he saw goods he seized them, saying when refused: "Soon it will belong to someone else—why cling so hard?"',
    'Once Daochen arrived his speech was rude; he went office to office among the district\'s men and seized whatever he saw, saying when refused, "Soon it will belong to someone else—why cling so hard?"',
  ],
  s0060: [
    'The military prefecture was terrified, saying when Yuanqi came he would surely punish Lijian and bring disaster on all linked with him; they rushed to tell Lijian.',
    'The military prefecture was terrified, saying when Yuanqi came he would punish Lijian and drag down everyone linked with him; they rushed to tell Lijian.',
  ],
  s0061: [
    'Lijian believed it too;',
    'Lijian believed it too;',
  ],
  s0062: [
    'and he hated his old rudeness to Yuanqi, which deepened his rage.',
    'and he hated his old rudeness to Yuanqi, which deepened his rage.',
  ],
  s0063: [
    'Marshal Zhu Shilve urged Lijian to ask for Baxi commandery, leaving three sons as hostages; Lijian agreed.',
    'Marshal Zhu Shilve urged Lijian to ask for Baxi commandery and leave three sons as hostages; Lijian agreed.',
  ],
  s0064: [
    'Before long Lijian summoned his clerks, forged an edict in the name of Qi\'s Virtuous-Pacifying empress dowager, gathered troops and rebelled again, seized Zhu Daochen and killed him.',
    'Before long Lijian summoned his clerks, forged an edict in the name of Qi\'s Virtuous-Pacifying empress dowager, gathered troops and rebelled again, seized Zhu Daochen and killed him.',
  ],
  s0065: [
    'He wrote to Zhu Shilve and also summoned Li Ying.',
    'He wrote Zhu Shilve and also summoned Li Ying.',
  ],
  s0066: [
    'Ying and Shilve both refused the summons.',
    'Ying and Shilve both refused the summons.',
  ],
  s0067: [
    'When the messengers returned, Yuanqi gathered troops in Baxi to wait; Lijian executed Shilve\'s three sons.',
    'When the messengers returned, Yuanqi gathered troops in Baxi to wait; Lijian executed Shilve\'s three sons.',
  ],
  s0068: [
    'In the sixth month of Tianjian year one Yuanqi reached Baxi; Lijian sent his generals Li Fengbo and others to fight.',
    'In the sixth month of Tianjian year one Yuanqi reached Baxi; Lijian sent Li Fengbo and others to fight.',
  ],
  s0069: [
    'Battle swayed back and forth; after a long while Fengbo was beaten back to Chengdu.',
    'Battle swayed back and forth; after a long while Fengbo was beaten back to Chengdu.',
  ],
  s0070: [
    'Lijian drove out the inhabitants, shut the city, and held firm.',
    'Lijian drove out the inhabitants, shut the city, and held firm.',
  ],
  s0071: [
    'Yuanqi slowly advanced and besieged him.',
    'Yuanqi slowly advanced and besieged him.',
  ],
  s0072: [
    'That winter staff officer Jiang Xizhi and others plotted to yield the city but failed; Lijian executed them.',
    'That winter staff officer Jiang Xizhi and others plotted to yield the city but failed; Lijian executed them.',
  ],
  s0073: [
    'Shu had known turmoil two years; food in the city was gone—a sheng of rice cost three thousand cash yet could not be bought; the dead lay atop one another from hunger.',
    'Shu had known turmoil two years; food in the city was gone—a sheng of rice cost three thousand cash and could not be bought; the dead lay atop one another from hunger.',
  ],
  s0074: [
    'Those without kin were killed and eaten.',
    'Those without kin were killed and eaten.',
  ],
  s0075: [
    'Lijian ate gruel for months, hunger and straits without plan.',
    'Lijian ate gruel for months, hunger and straits without plan.',
  ],
  s0076: [
    'In the second month of year two Gaozu sent chief secretary Zhao Jingyue to announce an edict accepting Lijian\'s surrender; Lijian bared his torso and begged pardon.',
    'In year two\'s second month Gaozu sent chief secretary Zhao Jingyue to announce an edict accepting Lijian\'s surrender; Lijian bared his torso and begged pardon.',
  ],
  s0077: [
    'Yuanqi moved Lijian outside the walls and soon came to visit, treating him with courtesy.',
    'Yuanqi moved Lijian outside the walls and soon came to visit, treating him with courtesy.',
  ],
  s0078: [
    'Lijian said: "Had I known it would come to this, there would never have been what happened before."',
    'Lijian said, "Had I known it would come to this, there would never have been what happened before."',
  ],
  s0079: [
    'Yuanqi executed Li Fengbo and the other ringleaders and sent Lijian back to the capital.',
    'Yuanqi executed Li Fengbo and the other ringleaders and sent Lijian back to the capital.',
  ],
  s0080: [
    'As Lijian was about to set out, none would look at him; only Gong Yi saw him off.',
    'As Lijian was about to set out, none would look at him; only Gong Yi saw him off.',
  ],
  s0081: [
    'Earlier, while Yuanqi was on the road he had feared failure and lacked rewards; to every officer who came he promised a commission—thus nearly two thousand held writs as deputy inspector or chief administrator.',
    'Earlier, on the road Yuanqi had feared failure and lacked rewards; to every officer who came he promised a commission—thus nearly two thousand held writs as deputy inspector or chief administrator.',
  ],
  s0082: [
    'When Lijian arrived he went to the palace to give thanks; Gaozu received him.',
    'When Lijian arrived he went to the palace to give thanks; Gaozu received him.',
  ],
  s0083: [
    'Lijian entered by the East Flank Gate, kowtowing every few steps until he stood before Gaozu.',
    'Lijian entered by the East Flank Gate, kowtowing every few steps until he stood before Gaozu.',
  ],
  s0084: [
    'Gaozu laughed and said: "You wished to rival Liu Bei yet could not even match Gongsun Shu—had you no Wolong at your side?"',
    'Gaozu laughed and said, "You wished to rival Liu Bei yet could not even match Gongsun Shu—had you no Wolong at your side?"',
  ],
  s0085: [
    'Lijian kowtowed again in thanks.',
    'Lijian kowtowed again in thanks.',
  ],
  s0086: [
    'He was pardoned to commoner status.',
    'He was pardoned to commoner status.',
  ],
  s0087: [
    'In the first month of year four, going out the Jianyang Gate, he was killed by the Shu man Lan Daogong.',
    'In year four\'s first month, going out the Jianyang Gate, he was killed by the Shu man Lan Daogong.',
  ],
  s0088: [
    'In Shu Lijian had killed Daogong\'s father; Daogong fled and now took revenge.',
    'In Shu Lijian had killed Daogong\'s father; Daogong had fled and now took revenge.',
  ],
  s0089: [
    'Chen Bozhi was a native of Suiling in Jiyin.',
    'Chen Bozhi came from Suiling in Jiyin.',
  ],
  s0090: [
    'From boyhood he had brute strength.',
    'From boyhood he had brute strength.',
  ],
  s0091: [
    'At thirteen or fourteen he loved to wear an otter-skin cap and carry a barbed blade, watching until the neighbor\'s rice ripened, then stealing the harvest.',
    'At thirteen or fourteen he loved an otter-skin cap and a barbed blade, watching until the neighbor\'s rice ripened, then stealing the harvest.',
  ],
  s0092: [
    'Once a farmer caught him and shouted: "Chu boy, don\'t move!"',
    'Once a farmer caught him and shouted, "Chu boy, don\'t move!"',
  ],
  s0093: [
    'Bozhi told the farmer: "Your rice is plentiful—what harm is one load?"',
    'Bozhi told the farmer, "Your rice is plentiful—what harm is one load?"',
  ],
  s0094: [
    'When the farmer meant to seize him, Bozhi raised his blade and advanced to stab him, crying: "What can you do to this Chu boy!"',
    'When the farmer meant to seize him, Bozhi raised his blade and advanced to stab him, crying, "What can you do to this Chu boy!"',
  ],
  s0095: [
    'The farmer fled; Bozhi slowly shouldered the rice and went home.',
    'The farmer fled; Bozhi slowly shouldered the rice and went home.',
  ],
  s0096: [
    'Grown, in Zhongli he robbed again and again; once he masked his face to spy on a boat and the boatmen cut him—they took his left ear.',
    'Grown, in Zhongli he robbed again and again; once he masked his face to spy on a boat and the boatmen cut him—they took his left ear.',
  ],
  s0097: [
    'Later he followed his townsman the chariot-and-cavalry general Wang Guangzhi, who loved his courage and let him sleep below his couch at night; on campaigns he always went along.',
    'Later he followed his townsman chariot-and-cavalry general Wang Guangzhi, who loved his courage and let him sleep below his couch at night; on campaigns he always went along.',
  ],
  s0098: [
    'Qi Lord of Anding Zijing held southern Yang and kept many troops about him for self-defense.',
    'Qi Lord of Anding Zijing held southern Yang and kept many troops for self-defense.',
  ],
  s0099: [
    'The Ming Emperor sent Guangzhi to punish Zijing; reaching Ouyang, Guangzhi sent Bozhi ahead, and when the gates opened Bozhi went in alone and beheaded Zijing.',
    'The Ming Emperor sent Guangzhi to punish Zijing; at Ouyang Guangzhi sent Bozhi ahead, and when the gates opened Bozhi went in alone and beheaded Zijing.',
  ],
  s0100: [
    'He won merit again and again, rose by battle honors to Champion General and Rapid Cavalry Marshal, and was enfeoffed Baron of Yufu with five hundred households.',
    'He won merit again and again, rose by battle honors to Champion General and Rapid Cavalry Marshal, and was enfeoffed Baron of Yufu with five hundred households.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_020_b1.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (pair) {
    s.literal = pair[0];
    s.idiomatic = pair[1];
    patched++;
  }
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patch count: ${patched}`);

if (patched !== Object.keys(T).length) {
  process.exitCode = 1;
}
