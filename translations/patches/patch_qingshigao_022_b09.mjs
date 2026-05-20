#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'On day bingxu, Japanese warships reached Taiwan and landed ashore; they provoked clashes with the aborigines.',
    'On bingxu day, Japanese ships landed on Taiwan and clashed with aborigines.',
  ],
  s0802: [
    'Shen Baozhen was ordered to manage coastal defense and also to serve as minister for foreign affairs; steamships at Jiangsu and Guangdong coastal ports were to be deployed on schedule.',
    'Shen Baozhen took coastal defense and foreign affairs; Jiang and Guang steamers were to be deployed on time.',
  ],
  s0803: [
    'On day xinmao, Chang Shun was stripped of office for cause; Elehebu was made Uliasutai general, Qingchun Chakhar commander, and Tuolunbu Kobdo councilor.',
    'On xinmao day, Chang Shun was dismissed; Elehebu, Qingchun, and Tuolunbu received frontier posts.',
  ],
  s0804: [
    'On day dingyou, Lu Runxiang and three hundred thirty-seven others received jinshi degrees with titles varying by rank.',
    'On dingyou day, Lu Runxiang and 337 others received jinshi with graded titles.',
  ],
  s0805: [
    'On day xinchou, Jing Lian again asked sick leave; it was refused.',
    'On xinchou day, Jing Lian again sought sick leave and was refused.',
  ],
  s0806: [
    'Fifth month, new moon day renyin: the Franco-Vietnamese peace was settled; border generals were ordered to settle refugees who had moved inward.',
    'In month 5, on the new moon renyin, Franco-Vietnamese peace was set and border generals were told to settle inward refugees.',
  ],
  s0807: [
    'On day renzi, the emperor returned from the Old Summer Palace to the palace.',
    'On renzi day, the emperor returned from Yuanmingyuan to the palace.',
  ],
  s0808: [
    'Japan attacked Taiwan aboriginal settlements.',
    'Japan attacked Taiwan aboriginal villages.',
  ],
  s0809: [
    'On day dingsi, for Empress Dowager Cixi\'s birthday, banner officials in Beijing over sixty were rewarded, and executions at the autumn and court capital reviews were suspended.',
    'On dingsi day, for Cixi\'s birthday, Beijing banner elders were rewarded and capital review executions were halted.',
  ],
  s0810: [
    'On day jiwei, a comet appeared.',
    'On jiwei day, a comet appeared.',
  ],
  s0811: [
    'On day yichou, an edict ordered relief for Fengtian disaster victims.',
    'On yichou day, Fengtian disaster victims were ordered relieved.',
  ],
  s0812: [
    'On day bingchen, Shen Baozhen\'s request was granted: build Taiwan coastal forts, pacify aboriginal settlements, and withdraw worn-out troops.',
    'On bingchen day, Taiwan forts, aborigine pacification, and withdrawal of tired troops were approved for Shen Baozhen.',
  ],
  s0813: [
    'On day wuchen, Japanese warships cruised the ports of Fujian.',
    'On wuchen day, Japanese warships cruised Fujian ports.',
  ],
  s0814: [
    'The Japanese minister Yanagihara Sakimitsu discussed Taiwan military affairs with the Zongli Yamen princes.',
    'Japanese minister Yanagihara discussed Taiwan with the Zongli Yamen princes.',
  ],
  s0815: [
    'Sixth month, day yihai: an edict ordered Brigadier Sun Kaihua to take over Xiamen defenses.',
    'In month 6, yihai, Sun Kaihua was ordered to take Xiamen defenses.',
  ],
  s0816: [
    'On day jimao, Yang Yuebin, Zeng Guoquan, Yan Jingming, Zhao Dezhe, Ding Richang, Bao Chao, Jiang Yili, and Guo Songtao were summoned to the capital.',
    'On jimao day, Yang Yuebin, Zeng Guoquan, Yan Jingming, and six others were called to Beijing.',
  ],
  s0817: [
    'On day renwu, submitters at Wusuo Stockade rebelled again; Yunnan troops suppressed them.',
    'On renwu day, Wusuo submitters rebelled and Yunnan troops put them down.',
  ],
  s0818: [
    'On day guiwei, Li Hongzhang\'s request was granted: Tang Dingkui\'s Xuzhou army was sent by sea to Taiwan.',
    'On guiwei day, Tang Dingkui\'s Xuzhou army was sent by sea to Taiwan.',
  ],
  s0819: [
    'On day yiyou, the Revenue Board was ordered to cut non-urgent spending and prepare coastal defense funds in advance.',
    'On yiyou day, the Revenue Board was told to economize and fund coastal defense.',
  ],
  s0820: [
    'Shen Baozhen was ordered to deploy north- and south-route defenses.',
    'Shen Baozhen was told to arrange north and south route defenses.',
  ],
  s0821: [
    'On day dingyou, Weng Tonghe was again appointed to Hongde Hall duty.',
    'On dingyou day, Weng Tonghe again served at Hongde Hall.',
  ],
  s0822: [
    'Autumn, seventh month, day dingwei: Li Henian proposed selecting a drilled army on Fujian\'s land routes; the plan was approved.',
    'In autumn month 7, dingwei, Li Henian\'s Fujian drilled-army plan was approved.',
  ],
  s0823: [
    'On day gengxu, Manas Hui rebels attacked Xihu; government troops repulsed them.',
    'On gengxu day, Manas Hui struck Xihu and were driven back.',
  ],
  s0824: [
    'On day renzi, Zuo Zongtang was made Grand Secretary while remaining Shaanxi-Gansu governor-general; Jing Lian was made imperial commissioner to supervise Xinjiang military affairs, with Jin Shun assisting.',
    'On renzi day, Zuo Zongtang became Grand Secretary; Jing Lian took Xinjiang command and Jin Shun assisted.',
  ],
  s0825: [
    'On day gengshen, the Belgian minister Thys and others were received in audience at the Ziguang Pavilion.',
    'On gengshen day, Belgian minister Thys and others were received at Ziguang Pavilion.',
  ],
  s0826: [
    'On day jiazi, Neiwufu minister Guibao, for having deceived the throne in the Li Guangzhao timber memorial while serving as a department director, was severely punished and stripped of office.',
    'On jiazi day, Guibao was dismissed for deceit in the Li Guangzhao timber case.',
  ],
  s0827: [
    'On day yichou, mounted bandits took Ningguta but it was soon recovered.',
    'On yichou day, bandits took Ningguta and it was soon retaken.',
  ],
  s0828: [
    'Fujian military funds were allowed to borrow two million in foreign loans, to be repaid in yearly installments from customs revenue.',
    'Fujian was allowed a two-million foreign loan repaid from customs over time.',
  ],
  s0829: [
    'On day jisi, construction at the Old Summer Palace was halted.',
    'On jisi day, Yuanmingyuan construction was halted.',
  ],
  s0830: [
    'On day gengwu, Prince Gong was rebuked for impropriety at audience; his princely inheritance was removed and he was demoted to prince of the second rank, though he remained on the Grand Council; Zaichen\'s princely title was also revoked.',
    'On gengwu day, Prince Gong lost his inheritance and rank for audience impropriety but stayed on the Grand Council; Zaichen\'s title was revoked.',
  ],
  s0831: [
    'Bai Yanhu and others attacked Jimusa; government troops defeated them.',
    'Bai Yanhu attacked Jimusa and was beaten off.',
  ],
  s0832: [
    'Eighth month, new moon day xinwei: an empress dowager edict restored Prince Gong\'s inheritance and Zaichen\'s titles, with admonition.',
    'In month 8, on the new moon xinwei, Prince Gong\'s inheritance and Zaichen\'s titles were restored with admonition.',
  ],
  s0833: [
    'An edict ordered repairs to the Three Seas works with strict economy.',
    'The Three Seas repairs were ordered with strict economy.',
  ],
  s0834: [
    'On day bingxu, locusts struck Henan.',
    'On bingxu day, locusts struck Henan.',
  ],
  s0835: [
    'On day wuzi, Li Guangzhao was sentenced to decapitation.',
    'On wuzi day, Li Guangzhao was sentenced to death.',
  ],
  s0836: [
    'On day gengyin, the provinces were ordered to improve constabulary affairs.',
    'On gengyin day, provinces were told to improve policing.',
  ],
  s0837: [
    'On day yiwei, Zuo Zongtang was ordered to supervise Western expedition grain transport, with Academician Yuan Baoheng assisting.',
    'On yiwei day, Zuo Zongtang took Western expedition grain transport and Yuan Baoheng assisted.',
  ],
  s0838: [
    'An edict ordered the provinces to trim likin bureaus as appropriate and ban opium cultivation.',
    'Provinces were told to trim likin offices and ban opium growing.',
  ],
  s0839: [
    'On day dingyou, the emperor visited the Southern Park.',
    'On dingyou day, the emperor visited the Southern Park.',
  ],
  s0840: [
    'On day wuxu, the emperor reviewed archery of front princes and Qianqing Gate guards.',
    'On wuxu day, the emperor reviewed princes\' and guards\' archery.',
  ],
  s0841: [
    'On day jihai, the emperor went on the autumn hunt.',
    'On jihai day, the emperor went hunting.',
  ],
  s0842: [
    'Ninth month, new moon day gengzi: the emperor visited the Liangying Platform and lifted the hunt enclosure.',
    'In month 9, on the new moon gengzi, the emperor visited Liangying Platform and ended the enclosure hunt.',
  ],
  s0843: [
    'On day xinchou, the emperor visited the Liangying Platform and reviewed the Shenji Camp.',
    'On xinchou day, the emperor reviewed the Shenji Camp at Liangying Platform.',
  ],
  s0844: [
    'On day renyin, the emperor reviewed archery of princes and guards.',
    'On renyin day, the emperor reviewed princes\' and guards\' archery.',
  ],
  s0845: [
    'On day dingwei, Ruilin died; Ying Han was made Liang-Guang governor-general.',
    'On dingwei day, Ruilin died and Ying Han became Liang-Guang governor-general.',
  ],
  s0846: [
    'On day gengxu, Japan again sent Okubo Toshimichi to discuss the Taiwan aborigine affair with the Zongli Yamen princes.',
    'On gengxu day, Okubo Toshimichi came to discuss Taiwan with the Zongli Yamen princes.',
  ],
  s0847: [
    'On day bingchen, Ningguta bandit chief Wang Wenshuan was executed.',
    'On bingchen day, Wang Wenshuan of Ningguta was executed.',
  ],
  s0848: [
    'On day xinyou, the princes reached agreement with the Japanese envoy: troops would withdraw, and five hundred thousand taels would be paid for Japanese refugee relief and Taiwan military costs.',
    'On xinyou day, Japan agreed to withdraw for five hundred thousand in relief and Taiwan costs.',
  ],
  s0849: [
    'On day yichou, Jia Zhen died.',
    'On yichou day, Jia Zhen died.',
  ],
  s0850: [
    'On day bingyin, Li Hongzhang and others were ordered at the Zongli Yamen to deliberate in detail on coastal defense, drilling, arms, shipbuilding, funds, personnel, and long-term policy, and report.',
    'On bingyin day, Li Hongzhang and others were told to plan coastal defense, drilling, arms, ships, funds, men, and sustainability.',
  ],
  s0851: [
    'Tenth month, day xinwei: for Empress Dowager Cixi\'s fortieth birthday, Liu Mingchuan was restored as provincial commander.',
    'In month 10, xinwei, Liu Mingchuan was restored as commander for Cixi\'s fortieth birthday.',
  ],
  s0852: [
    'On day jimao, when the celebration rites were completed, dismissed officials\' ranks were restored, penalties on princes and civil and military officials were remitted, and the rest were promoted by grade.',
    'On jimao day, after the celebration, dismissed ranks were restored, officials were pardoned, and others were promoted.',
  ],
  s0853: [
    'On day gengchen, relief was ordered for Guangdong typhoon victims.',
    'On gengchen day, Guangdong typhoon victims were relieved.',
  ],
  s0854: [
    'On day guisi, Guangshou and Xia Tongshan were sent to Shaanxi to investigate.',
    'On guisi day, Guangshou and Xia Tongshan were sent to investigate in Shaanxi.',
  ],
  s0855: [
    'On day jihai, the emperor was unwell; Li Hongzao was ordered to read memorials in his stead.',
    'On jihai day, the emperor fell ill and Li Hongzao read memorials for him.',
  ],
  s0856: [
    'Eleventh month, day jiachen: Prince Gong was ordered to draft Manchu endorsements on memorials.',
    'In month 11, jiachen, Prince Gong drafted Manchu memorial endorsements.',
  ],
  s0857: [
    'On day dingwei, relief was ordered for disasters in Xu and Hai prefectures.',
    'On dingwei day, Xu and Hai disaster victims were relieved.',
  ],
  s0858: [
    'On day jiyou, memorials inside and outside the capital were ordered shown to both empresses dowager.',
    'On jiyou day, all memorials were to be shown to both empresses dowager.',
  ],
  s0859: [
    'Bao Yun was made Grand Secretary.',
    'Bao Yun became Grand Secretary.',
  ],
  s0860: [
    'On day renzi, Japan withdrew its troops.',
    'On renzi day, Japan withdrew its troops.',
  ],
  s0861: [
    'On day guichou, at the winter solstice heaven was worshipped at the Round Mound Altar; Prince Chun substituted for the emperor.',
    'On guichou day, winter solstice heaven worship was performed by Prince Chun for the emperor.',
  ],
  s0862: [
    'One million five hundred thousand from the ministry treasury was issued for Shizhuanghu dike works.',
    '1.5 million from the treasury was issued for the Shizhuanghu dike.',
  ],
  s0863: [
    'On day jiayin, because both empresses dowager had nursed him back to health, honored titles were raised and the Board of Punishments and all provinces were ordered to reduce sentences by grade.',
    'On jiayin day, honored titles were raised and sentences were reduced province-wide after the empresses\' care.',
  ],
  s0864: [
    'On day gengshen, a drilled army for Henan was approved.',
    'On gengshen day, Henan\'s drilled army was approved.',
  ],
  s0865: [
    'On day jiazi, because the Shizhuanghu dike could not be completed, Ding Baozhen\'s request was granted to build a dam and dike in the Jiazhuang area.',
    'On jiazi day, Ding Baozhen was allowed a Jiazhuang dam and dike after Shizhuanghu proved impractical.',
  ],
  s0866: [
    'Twelfth month, day xinwei: an edict remitted land taxes on disturbed waste land in Yunnan for ten years.',
    'In month 12, xinwei, Yunnan disturbed waste-land taxes were remitted for ten years.',
  ],
  s0867: [
    'On day jiaxu, Li Zongxi was relieved for illness; Liu Kunyi was made acting Liangjiang governor-general.',
    'On jiaxu day, Li Zongxi left office ill and Liu Kunyi acted as Liangjiang governor-general.',
  ],
  s0868: [
    'The emperor\'s illness became grave; he died at the Hall of Mental Cultivation at age nineteen.',
    'The emperor died at Yangxin Hall at nineteen after a grave illness.',
  ],
  s0869: [
    'Empresses Dowager Ci\'an and Cixi summoned Prince Dun Yicong, Prince Gong Yixin, Prince Chun Yixuan, Prince Fu of the commandery Yishu, Prince Hui of the commandery Yixiang, Beile Zaizhi and Zaichen, Duke Yimo, Ministers of the Imperial Presence Boyan Namuketu, Yikuang, and Jingshou, Grand Councilors Bao Yun, Shen Guifen, and Li Hongzao, Neiwufu ministers Yinggui, Chonglun, Kuiling, Ronglu, Mingshan, Guibao, and Wenshi, Hongde Hall tutors Xu Tong and Weng Tonghe and Wang Qingqi, and Southern Study members Huang Yu, Pan Zuyin, Sun Yijing, Xu Fu, and Zhang Jiaxiang to receive an empress dowager edict adopting Prince Chun\'s son as heir to the Wenzong Emperor and successor emperor.',
    'Ci\'an and Cixi summoned the princes, councilors, and tutors and named Prince Chun\'s son Wenzong\'s heir and the new emperor.',
  ],
  s0870: [
    'In the second month of the first year of Guangxu, day wuzi, Empress Alute of the Arute clan died.',
    'Guangxu 1, month 2, wuzi, Empress Alute died.',
  ],
  s0871: [
    'Third month, day jihai: the posthumous title Jitian Kaiyun Shouzhong Juzheng Baoda Dinggong Shengzhi Chengxiao Xinmin Gongkuan Yi Emperor was conferred and the temple name Muzong was fixed.',
    'In month 3, jihai, the full posthumous title was conferred and the temple name Muzong was fixed.',
  ],
  s0872: [
    'Third month, day gengwu in the fifth year: burial at Huiling.',
    'In year 5, month 3, gengwu, he was buried at Huiling.',
  ],
  s0873: [
    'Commentary: Muzong succeeded to the throne in tender years and the empress dowager ruled from behind the curtain.',
    'Commentary: Muzong reigned young under a regent empress dowager.',
  ],
  s0874: [
    'The dynasty revived; within ten years bandits were pacified and court and frontier were at peace.',
    'The realm revived; in ten years rebels were crushed and all was calm.',
  ],
  s0875: [
    'Without unity of palace and government and harmony of generals and ministers, how could this have been reached?',
    'Without court unity and harmony of generals, how reach this?',
  ],
  s0876: [
    'When the emperor personally took charge of government, he did not spare himself.',
    'Once he ruled in person, he allowed himself no leisure.',
  ],
  s0877: [
    'On calamity he practiced self-examination — utmost diligence.',
    'On disaster he examined himself — utmost diligence.',
  ],
  s0878: [
    'On hearing of disaster he remitted taxes and gave relief — utmost benevolence.',
    'Hearing of disaster he remitted and relieved — utmost benevolence.',
  ],
  s0879: [
    'He did not speak of auspicious omens — utmost clarity.',
    'He ignored auspicious omens — utmost clarity.',
  ],
  s0880: [
    'Had he reached middle age, renewing himself day by day and growing in glory, how could he not have rivaled the grandeur of antiquity?',
    'Had he lived to middle age, his daily renewal would have matched the ancients in glory.',
  ],
  s0881: [
    'Yet he suddenly abandoned his people, his work unfinished — pity indeed!',
    'Yet he died young, his work unfinished — pity indeed!',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_022_b09.mjs <translation.json>'
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
