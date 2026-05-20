#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0801: [
    'Second month, first day bingxu: the Emperor made an inspection tour of the capital region.',
    'On the first day of the second month, the Emperor toured the capital region.',
  ],
  s0802: [
    'On day yiwei, troops from Fengtian and Jilin were levied to reinforce Qilide\'s army.',
    'On yiwei day, Fengtian and Jilin troops reinforced Qilide\'s army.',
  ],
  s0803: [
    'On day guimao, the Emperor returned and halted at Shenyang Spring Garden.',
    'On guimao day, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0804: [
    'On day dingwei, precedents were fixed for theft cases of "no grounds for leniency" and "grounds for mercy."',
    'On dingwei day, theft-case rules were set for cases with and without grounds for mercy.',
  ],
  s0805: [
    'Prince of the Commandery Norobu of Shuncheng died; posthumous name Zhong; his son Xibao succeeded to the title.',
    'Prince Norobu of Shuncheng died; posthumous name Zhong; his son Xibao inherited the title.',
  ],
  s0806: [
    'Left Censor-in-chief Kui Xu died; sacrificial rites and burial were granted; posthumous name Wenduan.',
    'Left Censor-in-chief Kui Xu died with funeral honors and posthumous name Wenduan.',
  ],
  s0807: [
    'Third month, day dingsi: the Emperor attended the Classics lecture.',
    'In the third month, on dingsi day, the Emperor held the Classics lecture.',
  ],
  s0808: [
    'On day wuyin, Fu Ning\'an was made Pacification-general, Furdan Shock-the-Enemy general, and Qilide coordinating general, to take command on the frontier.',
    'On wuyin day, Fu Ning\'an, Furdan, and Qilide were appointed frontier generals to oversee border defense.',
  ],
  s0809: [
    'On day renwu, the Emperor inspected the dikes at Hexiwu.',
    'On renwu day, the Emperor inspected the Hexiwu dikes.',
  ],
  s0810: [
    'Summer, fourth month, day yiyou: the Emperor returned and halted at Shenyang Spring Garden.',
    'In the fourth month, the Emperor returned to Shenyang Spring Garden.',
  ],
  s0811: [
    'On day yiwei, grain from the Tongzhou granary was distributed to Zhili prefectures and counties for famine relief stores.',
    'On yiwei day, Tongzhou grain was sent to Zhili districts for relief reserves.',
  ],
  s0812: [
    'On day bingshen, Jieshi garrison commander Chen Ang memorialized that Catholic churches stand in every province and should be banned; this was approved.',
    'On bingshen day, Chen Ang asked to ban Catholic churches nationwide; the court agreed.',
  ],
  s0813: [
    'Sun Zhu and Fan Shichong were made Ministers of War.',
    'Sun Zhu and Fan Shichong became Ministers of War.',
  ],
  s0814: [
    'On day xinchou, the Emperor escorted the Empress Dowager to Rehe for summer retreat.',
    'On xinchou day, the Emperor took the Empress Dowager to Rehe.',
  ],
  s0815: [
    'Fifth month, day gengshen: the Nine Ministers ruled that when princes and beile send agents abroad without credentials, they are at once impeached.',
    'In the fifth month, princes\' agents without credentials were to be impeached at once.',
  ],
  s0816: [
    'Sixth month, day renzi: Furdan raided the Dzungar Borobulhasu, killed and captured, and returned.',
    'In the sixth month, Furdan raided Borobulhasu, took captives, and returned.',
  ],
  s0817: [
    'Minister of War Zhao Hongcan died; sacrificial rites and burial were granted; posthumous name Qingduan.',
    'Minister of War Zhao Hongcan died with funeral honors and posthumous name Qingduan.',
  ],
  s0818: [
    'Autumn, seventh month, day bingchen: Tsewang Arabtan sent his general Tsering Dondob to raid Lhasa territory.',
    'In the seventh month, Tsewang Arabtan sent Tsering Dondob to raid Lhasa.',
  ],
  s0819: [
    'On day guihai, Fu Ning\'an raided the Dzungars at Tong\'eobaxi, advanced to Urumqi, and destroyed their crops; on the return march he met bandits at Bilutu and defeated them.',
    'On guihai day, Fu Ning\'an raided Dzungars near Urumqi, destroyed crops, and defeated bandits at Bilutu on the return.',
  ],
  s0820: [
    'Huite taiji Zhamubi, killed in battle, was posthumously enfeoffed Assistant-state Duke.',
    'Zhamubi, a Huite taiji killed in battle, was posthumously made Assistant-state Duke.',
  ],
  s0821: [
    'Eighth month, first day renwu: the Emperor went on the hunting encirclement.',
    'On the first of the eighth month, the Emperor went hunting.',
  ],
  s0822: [
    'Ninth month, day xinwei: Lu Zhenyang was appointed acting Sichuan provincial commander.',
    'In the ninth month, Lu Zhenyang became acting Sichuan commander.',
  ],
  s0823: [
    'The rogue Kang Ting stirred trouble in Henan; government troops pursued him; Ting fled and died.',
    'Henan rebel Kang Ting was pursued by troops and died in flight.',
  ],
  s0824: [
    'Ministers Zhang Tingshu and Academician Leshibu were sent to try the case; they found former governor Li Xi\'s greed and cruelty had provoked the uprising and reported it.',
    'Zhang Tingshu and Leshibu investigated and reported that Li Xi\'s cruelty had provoked the revolt.',
  ],
  s0825: [
    'Li Xi was stripped of office and sentenced to death; rebel partisans were executed.',
    'Li Xi was removed and sentenced to death; his followers were executed.',
  ],
  s0826: [
    'Winter, tenth month, day yiyou: Vice ministers Liang Shixun and Haishou were ordered to supervise Barkul farming colonies.',
    'In the tenth month, Liang Shixun and Haishou were sent to oversee Barkul colonies.',
  ],
  s0827: [
    'On day gengzi, the Emperor returned with the Empress Dowager to the palace.',
    'On gengzi day, the Emperor and Empress Dowager returned to the palace.',
  ],
  s0828: [
    'On day yisi, Inner ministers Gongscewang Norbu, General Erlunte, guardsman Aqitu, and others were ordered to lead troops to garrison Qinghai.',
    'On yisi day, Norbu, Erlunte, Aqitu, and others were sent to garrison Qinghai.',
  ],
  s0829: [
    'Imperial clansman Base was made Minister of Rites; Cai Shengyuan Left Censor-in-chief.',
    'Base became Minister of Rites; Cai Shengyuan became Left Censor-in-chief.',
  ],
  s0830: [
    'Eleventh month, day renzi: executions were suspended.',
    'In the eleventh month, executions were halted.',
  ],
  s0831: [
    'On day yichou, the Empress Dowager fell ill; the Emperor visited her at Cining Palace.',
    'On yichou day, the Empress Dowager fell ill and the Emperor visited Cining Palace.',
  ],
  s0832: [
    'On day xinwei, an edict said: "In governing, emperors must take revering Heaven and honoring ancestors as the foundation.',
    'On xinwei day, an edict said imperial rule rests on revering Heaven and honoring ancestors.',
  ],
  s0833: [
    'Take the hearts of all under Heaven as one\'s heart, take the benefits of the four seas as public benefit, govern disorder before it arises, secure the realm before peril comes—diligent night and day, thus planning for the long term.',
    'The edict urged taking the people\'s hearts as one\'s own and securing the realm before danger arose.',
  ],
  s0834: [
    'We ascended the throne at eight and have reigned more than fifty years; this year We approach seventy.',
    'The Emperor said he had reigned over fifty years and was nearing seventy.',
  ],
  s0835: [
    'At twenty years We dared not reckon ahead to thirty.',
    'At twenty he had not dared plan for thirty.',
  ],
  s0836: [
    'At thirty We dared not reckon ahead to forty.',
    'At thirty he had not dared plan for forty.',
  ],
  s0837: [
    'By the fortune of the altars of state We have now reached fifty-seven years—not what meager virtue could achieve.',
    'By state fortune he had reached fifty-seven years, not by his virtue alone.',
  ],
  s0838: [
    'Our teeth have reached old age; descendants are many.',
    'He had reached old age with many descendants.',
  ],
  s0839: [
    'All under Heaven is harmonious; the four seas are at peace.',
    'The realm was peaceful and the four seas secure.',
  ],
  s0840: [
    'Though We dare not say every household is provided for and customs are wholly transformed, Our wish to secure the people and enrich goods has been one from first to last.',
    'Though he could not claim full prosperity, his wish to secure the people had never changed.',
  ],
  s0841: [
    'Exhausting thought and wearing out strength—hardly can the word toilsome fully express it.',
    'His labors of mind and body could hardly be called merely toilsome.',
  ],
  s0842: [
    'Ancient emperors often did not live long; bookish men often sneer.',
    'Scholars often mocked short-lived ancient emperors.',
  ],
  s0843: [
    'They do not know how taxing affairs of empire are, beyond bearing in worry and labor.',
    'They did not know how exhausting imperial affairs were.',
  ],
  s0844: [
    'Ministers may serve when they should serve, stop when they should stop; retiring in old age they still hold grandchildren and enjoy ease.',
    'Ministers could retire and enjoy grandchildren; emperors could not.',
  ],
  s0845: [
    'For emperors the burden cannot be delegated elsewhere—Shun died at Cangwu, Yu died at Kuaiji, without leisure to rest, scarcely any pause to the end.',
    'Emperors could not delegate their burden—Shun and Yu died on duty without rest.',
  ],
  s0846: [
    'The Hong Fan Five Blessings end in dying a natural death—because long life is hard to attain.',
    'The Hong Fan ends with natural death because long life is rare.',
  ],
  s0847: [
    'The six lines of Dun in the Changes do not apply to the ruler; a sovereign has no place to withdraw and hide.',
    'The Changes\' Dun hexagram does not apply to rulers, who have nowhere to withdraw.',
  ],
  s0848: [
    'How could one compare ease with ministers and commoners!',
    'An emperor could not compare his lot with subjects\' ease.',
  ],
  s0849: [
    'From youth We have read books and sought good governance.',
    'From youth he had studied and sought good government.',
  ],
  s0850: [
    'When strength exceeded today, We drew the bow and wrestled.',
    'In his prime he had drawn the bow and wrestled.',
  ],
  s0851: [
    'Pacifying the Three Feudatories and bringing order to the northern deserts—all by Our single-minded planning, never killing anyone recklessly.',
    'He had pacified the Three Feudatories and the northern deserts without reckless killing.',
  ],
  s0852: [
    'Treasury gold was not spent rashly except for campaigns and famine relief.',
    'Treasury funds were spent only for war and famine relief.',
  ],
  s0853: [
    'On tour and at palaces We used no colorful decoration.',
    'His touring palaces were not lavishly decorated.',
  ],
  s0854: [
    'From youth We knew to shun licentious sound and favor and keep sycophants far—by fortune attaining rough tranquility.',
    'From youth he had shunned pleasure and flatterers and attained rough peace.',
  ],
  s0855: [
    'This spring We have suffered much dizziness; the form grows lean.',
    'That spring dizziness had left him thin.',
  ],
  s0856: [
    'Hunting beyond the passes the soil and water are rather better; vital energy improved somewhat; daily riding and archery without fatigue.',
    'Beyond the passes his health improved and daily riding did not weary him.',
  ],
  s0857: [
    'Then because the Empress Dowager was unwell, dizziness returned and walking grew difficult.',
    'When the Empress Dowager fell ill, dizziness returned and walking grew hard.',
  ],
  s0858: [
    'If at an unlucky hour We should pass, We could not fully express Our inmost mind.',
    'If death came suddenly, he could not fully express his mind.',
  ],
  s0859: [
    'Death is human constant—what matters is to pour out a lifetime\'s heart at a lucid hour; only then is it satisfaction.',
    'Death is natural; what mattered was to speak one\'s whole heart while still lucid.',
  ],
  s0860: [
    'Formerly people often said emperors should grasp great outlines and need not handle every detail.',
    'Some said emperors need only grasp great outlines, not every detail.',
  ],
  s0861: [
    'We do not think so: one matter not careful at once brings worry to the four seas;',
    'He disagreed: one careless matter could trouble the realm;',
  ],
  s0862: [
    'one thought not careful at once brings a century\'s harm.',
    'one careless thought could harm generations.',
  ],
  s0863: [
    'From first to last in every affair great or small We have been ever more careful.',
    'In great and small affairs he had always been careful.',
  ],
  s0864: [
    'Only now that age is declining We fear lest the mind of anxious diligence cultivated fifty-seven years collapse in the last stretch.',
    'Now aged, he feared his fifty-seven years of diligence might fail at the end.',
  ],
  s0865: [
    'The great matter of establishing an heir—is it not always in mind?',
    'Choosing an heir was always on his mind.',
  ],
  s0866: [
    'Yet the great power of empire must be unified; the sacred vessel is weightiest; to find the right man for all under Heaven is hardest—thus though aged We are earnest without cease.',
    'Yet unifying power and choosing the right heir was hardest, so even in old age he did not cease.',
  ],
  s0867: [
    'If great and small ministers can enter Our heart, then Our business of a natural end is complete.',
    'If ministers understood his heart, his final duty would be done.',
  ],
  s0868: [
    'Now We especially summon Our sons and all ministers to speak plainly.',
    'He summoned his sons and ministers to speak plainly.',
  ],
  s0869: [
    'A future testament is fully prepared herein.',
    'His future testament was fully set forth therein.',
  ],
  s0870: [
    '" On day jiaxu, two million taels of Banner advance debt were remitted.',
    'On jiaxu day, two million taels of Banner debt were forgiven.',
  ],
  s0871: [
    'On day bingzi, an edict remitted years of arrears in Zhili, Anhui, Jiangsu, Zhejiang, Huguang, Shaanxi, and Gansu; Jiangsu and Anhui also had half of grain-transport silver and rice remitted.',
    'On bingzi day, tax arrears were remitted in several provinces; Jiangsu and Anhui also had half their transport grain forgiven.',
  ],
  s0872: [
    'Twelfth month, day jiashen: the Empress Dowager\'s illness worsened; the Emperor had been ill more than seventy days, feet and face swollen, supported daily to visit Ningshou Palace.',
    'In the twelfth month, the Empress Dowager worsened; the swollen, ailing Emperor visited Ningshou Palace daily.',
  ],
  s0873: [
    'On day bingxu, the Empress Dowager died; a testamentary edict was issued; the Emperor wore mourning and cut his queue, moving to a separate palace.',
    'On bingxu day, the Empress Dowager died; the Emperor mourned, cut his queue, and moved out.',
  ],
  s0874: [
    'On day jiyou, the Emperor returned to the palace.',
    'On jiyou day, the Emperor returned to the palace.',
  ],
  s0875: [
    'This year Korea sent tribute.',
    'Korea paid tribute this year.',
  ],
  s0876: [
    'Fifty-seventh year, spring, first month, day yimao: the Emperor was ill and went to the hot springs.',
    'In the fifty-seventh year, on the first day of spring, the ailing Emperor went to the hot springs.',
  ],
  s0877: [
    'On day wuyin, twenty thousand sets of clothing were granted to frontier troops.',
    'On wuyin day, frontier troops received twenty thousand sets of clothing.',
  ],
  s0878: [
    'Second month, day gengyin: the Lhasa ruler begged for troops; guard Seleng was ordered to unite Qinghai troops in relief.',
    'In the second month, Lhasa sought aid and Seleng was sent with Qinghai troops.',
  ],
  s0879: [
    'On day guimao, Lu Zhensheng was made Gansu provincial commander.',
    'On guimao day, Lu Zhensheng became Gansu commander.',
  ],
  s0880: [
    'Compiler Zhu Tianbao memorialized asking to restore Yinreng as Crown Prince; at the traveling palace the Emperor personally examined him: "How do you know to defy Our order and memorialize?',
    'Zhu Tianbao asked to restore Yinreng as Crown Prince; at the traveling palace the Emperor questioned him sharply.',
  ],
  s0881: [
    '" Zhu Tianbao said: "Your servant heard from his father; my father bade me speak."',
    'Zhu Tianbao said his father had told him to speak.',
  ],
  s0882: [
    '" The Emperor said: "This is a disloyal, unfilial man."',
    'The Emperor called him disloyal and unfilial.',
  ],
  s0883: [
    '" He was ordered executed."',
    'Zhu Tianbao was ordered executed."',
  ],
  s0884: [
    'On day dingwei, the Emperor returned to the palace.',
    'On dingwei day, the Emperor returned to the palace.',
  ],
  s0885: [
    'Jieshi commander Chen Ang asked that foreign ships entering port first have great cannon seized before trade; the Ministry discussion rejected it.',
    'Chen Ang wanted foreign ships disarmed before trade; the ministry rejected the proposal.',
  ],
  s0886: [
    'Third month, day guichou: gate-factory taxes were reduced in Daxing and Wanping.',
    'In the third month, gate-factory taxes were cut in Daxing and Wanping.',
  ],
  s0887: [
    'On day xinyou, the late Empress was given the posthumous title Empress Xiaohui Renxian Duanyi Chunde Shuntian Yisheng Zhang.',
    'On xinyou day, the late Empress received her full posthumous title.',
  ],
  s0888: [
    'On day bingyin, Yan Shou was made Right Guard general; Huang Bingyue Fuzhou general.',
    'On bingyin day, Yan Shou and Huang Bingyue received military appointments.',
  ],
  s0889: [
    'On day wuchen, Daily Record offices were cut.',
    'On wuchen day, the Daily Record staff was reduced.',
  ],
  s0890: [
    'Seven delinquent education intendants including Cong Shu were identified and all stripped of office.',
    'Seven incompetent education intendants, including Cong Shu, were dismissed.',
  ],
  s0891: [
    'On day dingchou, Zhejiang north and south new customs duties were assigned to sub-prefect management.',
    'On dingchou day, Zhejiang customs were placed under sub-prefects.',
  ],
  s0892: [
    'On day wuyin, Zhejiang Governor Zhu Shi asked to repair the Haining stone seawall; this was approved.',
    'On wuyin day, Zhu Shi\'s request to repair the Haining seawall was approved.',
  ],
  s0893: [
    'Summer, fourth month, day yiyou: Empress Xiaohui Zhang was buried at Xiaodong Tomb.',
    'In the fourth month, Empress Xiaohui Zhang was buried at Xiaodong Tomb.',
  ],
  s0894: [
    'On day dinghai, Wang Yingquan and one hundred seventy-one others were granted jinshi and other ranks with distinctions.',
    'On dinghai day, Wang Yingquan and 171 others received jinshi degrees.',
  ],
  s0895: [
    'On day xinmao, the Emperor went to Rehe.',
    'On xinmao day, the Emperor went to Rehe.',
  ],
  s0896: [
    'Mu Helun was removed; Sun Zhaji was made Minister of Revenue.',
    'Mu Helun left office; Sun Zhaji became Minister of Revenue.',
  ],
  s0897: [
    'Fifth month, day guichou: Xu Yuanmeng was made Minister of Works.',
    'In the fifth month, Xu Yuanmeng became Minister of Works.',
  ],
  s0898: [
    'On day dingsi, Erlunte memorialized that the Lhasa khan had been trapped and killed, his two sons slain, and the Dalai and Panchen both detained.',
    'On dingsi day, Erlunte reported the Lhasa khan dead, his sons killed, and Dalai and Panchen detained.',
  ],
  s0899: [
    'On day jiwei, Zhejiang-Fujian Governor-General Manbao memorialized that Taiwan had nine critical ports and fifteen secondary ones; men were sent to repair them, officers relocated, and a Tamsui camp garrison established; this was approved.',
    'On jiwei day, Manbao\'s plan to fortify Taiwan\'s ports and establish a Tamsui garrison was approved.',
  ],
  s0900: [
    'Sixth month, day renchen: an envoy was sent to invest former Ryukyu king\'s great-grandson Shang Jing as King of Zhongshan.',
    'In the sixth month, Shang Jing was invested King of Zhongshan for Ryukyu.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_qingshigao_008_b09.mjs <translation.json>'
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
