#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'Hadaha acted as Minister of War.',
    'Hadaha served as acting Minister of War.',
  ],
  s0302: [
    'Quota land tax for last year was remitted for sixteen Jiangsu prefectures, counties, and garrisons including Changshu that had suffered tidal disaster, and for fourteen including Shangyuan that had suffered drought.',
    'Last year\'s quota tax was forgiven in sixteen Jiangsu districts hit by tide and fourteen by drought, including Changshu and Shangyuan.',
  ],
  s0303: [
    'On day yichou, Liang Shizheng was transferred to Minister of War; Jiang Pu was made Minister of Revenue.',
    'On yichou day, Liang Shizheng became Minister of War and Jiang Pu Minister of Revenue.',
  ],
  s0304: [
    'Last year\'s disaster quota tax was remitted for eighteen Jiangsu prefectures, counties, and garrisons including Shanyang.',
    'Eighteen Jiangsu districts including Shanyang had last year\'s disaster taxes remitted.',
  ],
  s0305: [
    'On day dingmao, Grand Councillor Jiang Pu was dismissed; Chen Dashou replaced him.',
    'On dingmao day, Jiang Pu left the Grand Council and Chen Dashou took his place.',
  ],
  s0306: [
    'On day guiyou, Chen Dashou was made Assistant Grand Secretary; Daledang\'a became Minister of Punishments.',
    'On guiyou day, Chen Dashou became Assistant Grand Secretary and Daledang\'a Minister of Punishments.',
  ],
  s0307: [
    'On day yihai, former Sichuan-Shaanxi governor-general Yue Zhongqi was reappointed to the Jinchuan army camp and granted the rank of provincial military commander.',
    'On yihai day, Yue Zhongqi was recalled from Sichuan-Shaanxi to the Jinchuan front with a provincial commander\'s rank.',
  ],
  s0308: [
    'Arantai was transferred to Fengtian general; Suobai became Ningguta general.',
    'Arantai became Fengtian general; Suobai took Ningguta.',
  ],
  s0309: [
    'On day bingzi, Furdan was reappointed inner grandee and sent to the Jinchuan army camp.',
    'On bingzi day, Furdan was restored as inner grandee and sent to Jinchuan.',
  ],
  s0310: [
    'Additional drought relief was granted for two Fujian counties including Taiwan.',
    'Extra drought relief went to Taiwan and one other Fujian county.',
  ],
  s0311: [
    'On day wuyin, First-rank Marquis Fu Wen was advanced to First-rank Duke.',
    'On wuyin day, Marquis Fu Wen was raised to duke of the first rank.',
  ],
  s0312: [
    'On day gengchen, one Han Chinese post each was cut at the Censorate Vice Censor-in-chief, Tongzheng Right Tongzheng, Assistant Minister of Justice, College of Literary Studies Second Tutor, Vice Minister of the Court of the Imperial Stud, and Vice Rector of the Imperial Academy.',
    'On gengchen day, one Han post each was abolished at the Censorate, Tongzheng Bureau, Court of Judicial Review, College of Literary Studies, Imperial Stud, and Imperial Academy.',
  ],
  s0313: [
    'One Manchu Censorate Censor post was changed to Right; Manchu and Han Left Tongzheng became Tongzheng Deputy Commissioners.',
    'A Manchu censorate seat became Right Tongzheng; Manchu and Han Left Tongzheng were retitled deputy commissioners.',
  ],
  s0314: [
    'Fifth month, new moon on day jiashen: Liang Guozhi and two hundred sixty-four others received jinshi and other degrees with distinctions.',
    'On the fifth-month new moon of jiashen, Liang Guozhi and 264 others received jinshi and related degrees.',
  ],
  s0315: [
    'On day yiyou, last year\'s flood quota tax was remitted for thirty-two Zhili prefectures, counties, and garrisons including Wen\'an.',
    'On yiyou day, thirty-two Zhili districts including Wen\'an had last year\'s flood taxes remitted.',
  ],
  s0316: [
    'On day bingxu, Fu Heng was ordered to act in charge of the Three Treasuries of the Revenue Board.',
    'On bingxu day, Fu Heng was assigned to manage the Revenue Board\'s Three Treasuries.',
  ],
  s0317: [
    'On day gengyin, Akdun was sentenced to death.',
    'On gengyin day, Akdun received a death sentence.',
  ],
  s0318: [
    'On day xinmao, Zhang Guangsi memorialized victory in capturing Rongbu stockade.',
    'On xinmao day, Zhang Guangsi reported the capture of Rongbu stockade.',
  ],
  s0319: [
    'On day dingyou, quota tax for flood disaster was remitted for twenty-eight Henan prefectures and counties including Tongxu.',
    'On dingyou day, flood taxes were remitted in twenty-eight Henan districts including Tongxu.',
  ],
  s0320: [
    'On day renyin, last year\'s drought quota tax was remitted for seven Anhui prefectures, counties, and garrisons including Jingde.',
    'On renyin day, seven Anhui districts including Jingde had last year\'s drought taxes remitted.',
  ],
  s0321: [
    'On day jiachen, the Emperor went to Guande Hall to bestow the posthumous title on the late empress as Empress Xiaoxian and issued an edict.',
    'On jiachen day, at Guande Hall the Emperor gave the late empress the posthumous title Xiaoxian and proclaimed an edict.',
  ],
  s0322: [
    'On day bingwu, Akdun was released from prison and ordered to act as Vice Minister of Works.',
    'On bingwu day, Akdun was freed and made acting Vice Minister of Works.',
  ],
  s0323: [
    'On day wushen, last year\'s flood quota tax was remitted for eight Shandong salt-fields including Yongli.',
    'On wushen day, eight Shandong salt-fields including Yongli had last year\'s flood taxes remitted.',
  ],
  s0324: [
    'On day renzi, last year\'s flood and hail quota tax was remitted for twelve Shanxi prefectures and counties including Yongji.',
    'On renzi day, twelve Shanxi districts including Yongji had last year\'s flood and hail taxes remitted.',
  ],
  s0325: [
    'Sixth month, day bingchen: Li Tan, for long failing to attend sacrificial audiences, was deprived of his marquisate.',
    'In the sixth month, on bingchen, Li Tan lost his marquisate for repeatedly missing sacrificial audiences.',
  ],
  s0326: [
    'Banner officers were admonished.',
    'An edict admonished banner officers.',
  ],
  s0327: [
    'On day gengshen, the Emperor examined Hanlin and College of Literary Studies officials; Qi Zhaonan and two others were chosen first class; others were promoted or demoted with distinctions.',
    'On gengshen day, the palace examination ranked Qi Zhaonan and two others first; other Hanlin and College officials were advanced or demoted.',
  ],
  s0328: [
    'The Emperor examined officials who had entered the Hanlin and College from ministries and boards; Junior Tutor Shigui was noted for promotion to Sichuan.',
    'Ministry officials in the Hanlin examination were graded; Junior Tutor Shigui was marked for promotion to Sichuan.',
  ],
  s0329: [
    'On day guihai, drought relief was granted for twenty-two Shaanxi prefectures and counties including Yaozhou.',
    'On guihai day, drought relief went to twenty-two Shaanxi districts including Yaozhou.',
  ],
  s0330: [
    'On day wuchen, Sichuan Wenchuan district magistrate Xie Yinglong, stationed at the Wo Ri native chieftaincy, blocked the regional commander from moving camp.',
    'On wuchen day, Wenchuan magistrate Xie Yinglong, posted with the Wo Ri chieftain, barred the regional commander from shifting camp.',
  ],
  s0331: [
    'The Emperor praised him and granted the rank of subprefectural intendant.',
    'The Emperor commended him and gave him subprefectural intendant rank.',
  ],
  s0332: [
    'On day jisi, Zhaohui was ordered concurrently to manage Revenue Board affairs.',
    'On jisi day, Zhaohui was told to manage Revenue Board business as well.',
  ],
  s0333: [
    'On day gengwu, the Left and Right deputy generals of Guizhou at Guihua Tumed were abolished.',
    'On gengwu day, the Guihua Tumed Left and Right deputy generals were cut.',
  ],
  s0334: [
    'On day jiaxu, an edict forbade court ministers to request establishment of the heir apparent and rebuked the eldest imperial son for lacking proper mourning devotion at the empress\'s great funeral.',
    'On jiaxu day, ministers were forbidden to ask for a crown prince and the eldest son was rebuked for mourning the late empress without due grief.',
  ],
  s0335: [
    'The Emperor offered libation before Empress Xiaoxian\'s bier at Guande Hall, performing the hundredth-day mourning rite.',
    'At Guande Hall the Emperor poured wine before the late empress\'s bier for the hundredth-day rite.',
  ],
  s0336: [
    'Autumn, seventh month, new moon on day guiwei: the Empress Dowager\'s edict: "The refined consort of the Nara clan succeeds Kun Ning; first ennoble her as Imperial Noble Consort to administer the Six Palaces.',
    'Seventh month, guiwei new moon: the Empress Dowager ordered the Nara consort raised to Imperial Noble Consort to run the Six Palaces pending succession at Kun Ning.',
  ],
  s0337: [
    '" On day dinghai, quota tax for last year\'s drought was remitted for two Fujian counties including Changle.',
    'On dinghai day, Changle and one other Fujian county had last year\'s drought taxes remitted.',
  ],
  s0338: [
    'On day wuzi, Neqin and others were ordered to report speedily on troop advance strategy.',
    'On wuzi day, Neqin and others were told to submit advance plans at once.',
  ],
  s0339: [
    'On day renchen, seed grain silver was loaned to Shandong farmers.',
    'On renchen day, Shandong farmers received seed-grain loans.',
  ],
  s0340: [
    'Last year\'s flood quota tax was remitted for Suqian, Jiangsu.',
    'Jiangsu\'s Suqian had last year\'s flood quota tax remitted.',
  ],
  s0341: [
    'On day jiawu, Gao Bin was ordered to join Zhou Xuejian in surveying river and lake drainage.',
    'On jiawu day, Gao Bin and Zhou Xuejian were sent to inspect river and lake drainage.',
  ],
  s0342: [
    'On day yiwei, five Shanxi counties including Yongji had poor harvests and were given relief.',
    'On yiwei day, five Shanxi counties including Yongji received famine relief after poor harvests.',
  ],
  s0343: [
    'On day wuxu, Depei was dismissed; Daledang\'a was transferred to Minister of Personnel; Sheng\'an became Minister of Punishments.',
    'On wuxu day, Depei was dismissed; Daledang\'a took Personnel and Sheng\'an Punishments.',
  ],
  s0344: [
    'On day xinchou, drought relief was granted for twenty-nine Zhili prefectures and counties including Qingxian.',
    'On xinchou day, drought relief went to twenty-nine Zhili districts including Qingxian.',
  ],
  s0345: [
    'On day guimao, Alihun asked to reduce punishment for starving people plundering; the Emperor rebuked it as indulgence breeding villains and refused.',
    'On guimao day, Alihun\'s plea to lighten penalties for famine looters was rejected as coddling crime.',
  ],
  s0346: [
    'Relief was granted for twenty-nine Shandong prefectures and counties including Licheng for flood, hail, and other disasters.',
    'Twenty-nine Shandong districts including Licheng received relief after flood, hail, and other disasters.',
  ],
  s0347: [
    'On day bingwu, Chang\'an was sentenced to strangulation.',
    'On bingwu day, Chang\'an received a strangulation sentence.',
  ],
  s0348: [
    'Intercalary seventh month, new moon on day guichou: Akdun acted as Minister of Punishments; Detong became Left Censor-in-chief.',
    'On the intercalary seventh-month new moon of guichou, Akdun acted as Punishments Minister and Detong became Left Censor-in-chief.',
  ],
  s0349: [
    'On day bingchen, flood quota tax was remitted for Bazhou and Gu\'an in Zhili.',
    'On bingchen day, flood taxes were remitted at Zhili\'s Bazhou and Gu\'an.',
  ],
  s0350: [
    'Flood relief was granted for eight Hunan prefectures and counties including Yiyang.',
    'Eight Hunan districts including Yiyang received flood relief.',
  ],
  s0351: [
    'On day wuwu, Peng Shukui was made Hubei governor.',
    'On wuwu day, Peng Shukui became Hubei governor.',
  ],
  s0352: [
    'On day wuchen, Zhou Xuejian was arrested for violating regulations by tonsuring.',
    'On wuchen day, Zhou Xuejian was jailed for illegal tonsure.',
  ],
  s0353: [
    'Gao Bin was ordered to manage the Southern Canal governor-generalcy.',
    'Gao Bin was placed in charge of the Southern Canal.',
  ],
  s0354: [
    'Yin Jishan, for favoritism, was stripped of office but kept in post.',
    'Yin Jishan was censured for favoritism, deprived of rank yet left in office.',
  ],
  s0355: [
    'On day jisi, the Emperor visited Panshan; Xinzhu acted as Huguang governor-general.',
    'On jisi day, the Emperor went to Panshan; Xinzhu acted Huguang governor-general.',
  ],
  s0356: [
    'Anning was summoned to the capital; Yin Jishan was to administer concurrently as Jiangsu governor.',
    'Anning was recalled to Beijing; Yin Jishan also handled Jiangsu as governor.',
  ],
  s0357: [
    'Ningguta general Suobai was transferred to Gubeikou provincial commander; Yongxing replaced him.',
    'Suobai left Ningguta for Gubeikou command; Yongxing succeeded him.',
  ],
  s0358: [
    'On day xinwei, because Neqin\'s memorial on the Jinchuan advance wavered between two plans, an edict rebuked him and also admonished Furdan, Yue Zhongqi, Bandi, and others.',
    'On xinwei day, Neqin was rebuked for vacillating on Jinchuan strategy; Furdan, Yue Zhongqi, and Bandi were admonished too.',
  ],
  s0359: [
    'On day renshen, the Emperor halted at Panshan.',
    'On renshen day, the court halted at Panshan.',
  ],
  s0360: [
    'On day guiyou, Zhuntai was made Shanxi governor; Alihun Shandong governor; Echang Jiangsu governor; Shulu Guangxi governor.',
    'On guiyou day, Zhuntai, Alihun, Echang, and Shulu became governors of Shanxi, Shandong, Jiangsu, and Guangxi.',
  ],
  s0361: [
    'Selenge was arrested for violating regulations by tonsuring.',
    'Selenge was imprisoned for illegal tonsure.',
  ],
  s0362: [
    'On day dingchou, flood relief was granted for Yunnan prefectures and counties including Kunyang.',
    'On dingchou day, Kunyang and other Yunnan districts received flood relief.',
  ],
  s0363: [
    'On day wuyin, Alihun was summoned to the capital; Tang Suizu acted as Shandong governor.',
    'On wuyin day, Alihun was recalled; Tang Suizu acted Shandong governor.',
  ],
  s0364: [
    'On day jimao, this year\'s hail quota tax was remitted for ten Jiangsu counties including Yuanhe.',
    'On jimao day, ten Jiangsu counties including Yuanhe had this year\'s hail taxes remitted.',
  ],
  s0365: [
    'On day gengchen, the Emperor returned to the palace.',
    'On gengchen day, the Emperor returned to the palace.',
  ],
  s0366: [
    'Eighth month, day jiashen: Bandi acted as Sichuan governor.',
    'In the eighth month, on jiashen, Bandi acted Sichuan governor.',
  ],
  s0367: [
    'On day yiyou, to worship at Tailing, Prince Zhuang Yunlu and others were ordered to manage capital affairs.',
    'On yiyou day, Prince Zhuang Yunlu and others ran Beijing affairs while the Emperor visited Tailing.',
  ],
  s0368: [
    'On day guisi, retrospective deliberation on deceitful memorials in the Zhandui campaign; Qingfu was imprisoned; Xu Yinghu was sentenced to death.',
    'On guisi day, the Zhandui deceit case sent Qingfu to prison and Xu Yinghu to execution.',
  ],
  s0369: [
    'On day gengzi, an edict ordered relief for earthquake victims at Dajianlu, Sichuan.',
    'On gengzi day, Dajianlu earthquake victims in Sichuan were ordered relieved.',
  ],
  s0370: [
    'Laibao was ordered concurrently to manage the Ministry of Works.',
    'Laibao was told to manage Works Ministry affairs as well.',
  ],
  s0371: [
    'On day xinchou, the Emperor went to Tailing.',
    'On xinchou day, the Emperor went to Tailing.',
  ],
  s0372: [
    'On day jiachen, Anning was summoned to the capital.',
    'On jiachen day, Anning was summoned to Beijing.',
  ],
  s0373: [
    'On day yisi, the Emperor worshipped at Tailing.',
    'On yisi day, the Emperor worshipped at Tailing.',
  ],
  s0374: [
    'On day bingwu, arrears of nine years\' tax were remitted for two Zhili counties including Qingyun.',
    'On bingwu day, nine years\' tax arrears were forgiven in Qingyun and one other Zhili county.',
  ],
  s0375: [
    'On day dingwei, Vice Minister Zhaohui was sent to the Sichuan army camp to supervise transport.',
    'On dingwei day, Zhaohui was dispatched to the Sichuan front to oversee supply.',
  ],
  s0376: [
    'Neqin requested thirty thousand troops for the advance; it was not permitted.',
    'Neqin\'s request for thirty thousand troops was refused.',
  ],
  s0377: [
    'On day wushen, Granary Commissioner Zhang Shizai was sent to Jiangnan to study river works with Gao Bin.',
    'On wushen day, Zhang Shizai was sent to Jiangnan to learn river management under Gao Bin.',
  ],
  s0378: [
    'On day jiyou, the Emperor returned to Beijing.',
    'On jiyou day, the Emperor returned to Beijing.',
  ],
  s0379: [
    'Ninth month, new moon on day renzi: Echang was transferred to Sichuan governor.',
    'On the ninth-month new moon of renzi, Echang became Sichuan governor.',
  ],
  s0380: [
    'Celeng and Gao Bin were ordered to join in trying Zhou Xuejian.',
    'Celeng and Gao Bin were assigned to try Zhou Xuejian together.',
  ],
  s0381: [
    'On day wuwu, Selenge was granted permission to commit suicide.',
    'On wuwu day, Selenge was allowed to take his own life.',
  ],
  s0382: [
    'On day jiwei, Northern Route participating grand ministers Tarmashan and Nu San were summoned to the capital; Mukdeng\'e and Sabuhashan replaced them.',
    'On jiwei day, Tarmashan and Nu San left the northern front; Mukdeng\'e and Sabuhashan replaced them.',
  ],
  s0383: [
    'Neqin and others memorialized the capture of Shenzha, Shenda, and other cities.',
    'Neqin and others reported taking Shenzha, Shenda, and other towns.',
  ],
  s0384: [
    'Celeng was transferred to Two Jiangs governor-general; Yin Jishan to Liangguang governor-general.',
    'Celeng became Two Jiangs governor-general; Yin Jishan Liangguang governor-general.',
  ],
  s0385: [
    'On day xinyou, Neqin and Zhang Guangsi were summoned to the capital.',
    'On xinyou day, Neqin and Zhang Guangsi were recalled to Beijing.',
  ],
  s0386: [
    'Furdan was ordered to act as Sichuan governor and join Yue Zhongqi in advancing as circumstances allowed.',
    'Furdan acted Sichuan governor and was to advance with Yue Zhongqi as opportunity allowed.',
  ],
  s0387: [
    'On day jiazi, Dong Bangda was reappointed to serve within the inner court.',
    'On jiazi day, Dong Bangda was restored to inner-court service.',
  ],
  s0388: [
    'Minister Bandi was ordered to the army camp to manage military affairs with Furdan and Yue Zhongqi.',
    'Bandi was sent to the front to handle affairs with Furdan and Yue Zhongqi.',
  ],
  s0389: [
    'Inner grandees and below in the army camp were placed under Furdan\'s command.',
    'Camp inner grandees and subordinates were put under Furdan\'s orders.',
  ],
  s0390: [
    'On day dingmao, Huang Tinggui was summoned to the capital; Hubao acted as Gansu governor and concurrently managed Shaanxi-Gansu governor-general affairs.',
    'On dingmao day, Huang Tinggui was recalled; Hubao acted Gansu governor and Shaanxi-Gansu affairs.',
  ],
  s0391: [
    'On day jisi, the Emperor visited Jingyi Garden to review troops.',
    'On jisi day, the Emperor reviewed troops at Jingyi Garden.',
  ],
  s0392: [
    'On day renshen, Simple Prince Sheng Baozhu, for abusing his elder brother\'s daughter, was deprived of his title.',
    'On renshen day, Prince Sheng Baozhu lost his title for mistreating his brother\'s daughter.',
  ],
  s0393: [
    'On day guiyou, Depei was ordered to inherit the Simple princedom.',
    'On guiyou day, Depei was told to succeed to the Simple princedom.',
  ],
  s0394: [
    'On day dingchou, an edict rebuked Neqin and Zhang Guangsi for stalemate wasting provisions; Neqin was ordered to surrender the commissioner-general seal.',
    'On dingchou day, Neqin and Zhang Guangsi were scolded for delay and waste; Neqin had to return the commissioner-general seal.',
  ],
  s0395: [
    'On day jimao, Fu Heng was ordered temporarily to manage Sichuan-Shaanxi governor-general affairs and proceed to the army camp.',
    'On jimao day, Fu Heng took Sichuan-Shaanxi duties and went to the front.',
  ],
  s0396: [
    'Vice Minister Suhede was assigned to serve at the Grand Council.',
    'Suhede was placed on Grand Council duty.',
  ],
  s0397: [
    'On day gengchen, Neqin and Zhang Guangsi, for jeopardizing military operations, were stripped of office and arrested for trial.',
    'On gengchen day, Neqin and Zhang Guangsi were dismissed and arrested for military failure.',
  ],
  s0398: [
    'Zhang Guangsi was summoned to the capital; Neqin was sent to the Northern Route army camp to redeem merit.',
    'Zhang Guangsi was recalled; Neqin was sent to the northern front to atone by service.',
  ],
  s0399: [
    'Fu Heng was made commissioner-general to command Jinchuan military affairs.',
    'Fu Heng became commissioner-general over the Jinchuan campaign.',
  ],
  s0400: [
    'On day xinsi, Laibao was ordered temporarily to manage the Ministry of Revenue.',
    'On xinsi day, Laibao was told to act as Revenue Minister.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_011_b04.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
