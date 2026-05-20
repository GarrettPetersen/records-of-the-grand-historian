#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0701: [
    'In the third year of Putong, envoys were sent presenting local products.',
    'In Putong 3 they sent envoys with tribute goods.',
  ],
  s0702: [
    'Kucha was an ancient state of the Western Regions.',
    'Kucha was an old kingdom of the Western Regions.',
  ],
  s0703: [
    'In Later Han during Emperor Guangwu\'s reign, its king named Hong was killed by Shache King Xian, who wiped out his clan.',
    'Under Later Han\'s Emperor Guangwu, King Hong was killed by Shache\'s King Xian, who exterminated his clan.',
  ],
  s0704: [
    'Xian installed his son Zeluo as king of Kucha; the people of the state killed Zeluo.',
    'Xian set his son Zeluo on the throne; the Kuchans killed him.',
  ],
  s0705: [
    'The Xiongnu installed the Kucha noble Shendu as king; from then it belonged to the Xiongnu.',
    'The Xiongnu raised the Kucha noble Shendu to the throne, and Kucha passed under Xiongnu control.',
  ],
  s0706: [
    'Yet in Han times Kucha was often a great state; its capital was called Yancheng.',
    'Yet under Han Kucha was commonly a great power, with its capital at Yancheng.',
  ],
  s0707: [
    'When Wei Emperor Wen first took the throne, he sent envoys with tribute.',
    'At the start of Emperor Wen of Wei\'s reign, envoys brought tribute.',
  ],
  s0708: [
    'In Jin\'s Taikang era, a son was sent to attend court.',
    'In Jin\'s Taikang period a royal son was sent to serve at court.',
  ],
  s0709: [
    'In the seventh year of Taiyuan, Qin ruler Fu Jian sent General Lü Guang to campaign in the Western Regions.',
    'In Taiyuan 7, Fu Jian of Former Qin sent General Lü Guang against the Western Regions.',
  ],
  s0710: [
    'Reaching Kucha, King Bo Chun loaded treasure and fled; Guang entered the city.',
    'At Kucha, King Bo Chun fled with his treasure loaded; Lü Guang took the city.',
  ],
  s0711: [
    'The city had triple walls; the outer wall matched Chang\'an in size; houses and halls were grand and splendid, adorned with coral, gems, and gold and jade.',
    'Triple-walled, its outer rampart rivaled Chang\'an; halls stood grand and bright, trimmed in coral, gems, gold, and jade.',
  ],
  s0712: [
    'Guang installed Bo Chun\'s younger brother Zhen as king and returned; from then contact with China ceased entirely.',
    'Lü Guang set Bo Chun\'s brother Zhen on the throne and withdrew; from that time Kucha broke all contact with China.',
  ],
  s0713: [
    'In the second year of Putong, King Niruimozhunasheng sent envoys presenting a memorial with tribute.',
    'In Putong 2, King Niruimozhunasheng sent envoys with a formal tribute memorial.',
  ],
  s0714: [
    'The state of Khotan was a dependency of the Western Regions.',
    'Khotan belonged to the Western Regions.',
  ],
  s0715: [
    'At the end of Later Han Jianwu, King Yu was defeated by Shache King Xian, removed to be king of Ligui, and Yu\'s younger brother Junde was made king of Khotan—cruel and tyrannical, the people suffered under him.',
    'At the end of Jianwu in Later Han, King Yu was broken by Shache\'s King Xian, demoted to king of Ligui, and Yu\'s brother Junde installed in Khotan—fierce and brutal, the people groaned beneath him.',
  ],
  s0716: [
    'In Yongping, the tribesman Dumo killed Junde; the elder Xiumoba killed Dumo and set himself up as king.',
    'During Yongping the tribesman Dumo killed Junde; the elder Xiumoba killed Dumo and proclaimed himself king.',
  ],
  s0717: [
    'When Ba died, his elder brother\'s son Guangde succeeded; later he captured Shache King Xian and brought him back, killed him, and became a powerful state—all the small states of the northwest submitted.',
    'After Ba\'s death his nephew Guangde took the throne; he later captured Shache\'s King Xian, brought him back, and killed him—Khotan became a great power and every small northwestern realm bowed.',
  ],
  s0718: [
    'Its land has much standing water, sand, and stone; the climate is warm; rice, wheat, and grapes thrive.',
    'The country is wet and stony, warm in climate, suited to rice, wheat, and grapes.',
  ],
  s0719: [
    'A river yields jade; it is called the Jade River.',
    'A river bearing jade runs there—the Jade River.',
  ],
  s0720: [
    'The people of the state are skilled at casting bronze vessels.',
    'The people excel at casting bronze ware.',
  ],
  s0721: [
    'Its seat of government is called West Mountain City; there are dwellings, markets, and lanes.',
    'Its capital is West Mountain City, with houses, streets, and markets.',
  ],
  s0722: [
    'Fruits, melons, and vegetables match those of China.',
    'Its fruits, melons, and vegetables are much like China\'s.',
  ],
  s0723: [
    'They revere the Buddhist Law above all.',
    'They hold the Buddhist Dharma in special reverence.',
  ],
  s0724: [
    'The king\'s residence is painted in cinnabar red.',
    'The royal dwelling is painted red throughout.',
  ],
  s0725: [
    'The king wears a golden kerchief-cap, like today\'s foreign chieftain\'s hat;',
    'The king wears a gold head-wrap, like a foreign lord\'s cap;',
  ],
  s0726: [
    'he and his wife sit side by side to receive guests.',
    'and receives guests seated beside his queen.',
  ],
  s0727: [
    'Women throughout the state wear braided hair and fur coats and trousers.',
    'All women braid their hair and dress in furs and trousers.',
  ],
  s0728: [
    'The people are deferential; when they meet they kneel, and in kneeling one knee touches the ground.',
    'They are courteous; on meeting they kneel on one knee to the ground.',
  ],
  s0729: [
    'For writing they use wood as stylus and tablets, and jade as seal.',
    'They write on wooden slips with wooden styluses and seal with jade.',
  ],
  s0730: [
    'When natives receive a letter, they wear it on the head before opening the tablet.',
    'Recipients place a letter on the head before breaking the seal and opening it.',
  ],
  s0731: [
    'In Wei Emperor Wen\'s time, King Shanxi presented famous horses.',
    'Under Emperor Wen of Wei, King Shanxi sent famed horses as tribute.',
  ],
  s0732: [
    'In the ninth year of Tianjian, envoys were sent presenting local products.',
    'In Tianjian 9 they sent tribute envoys.',
  ],
  s0733: [
    'In the thirteenth year they again presented a prasada hanging screen.',
    'In year 13 they again offered a prasada screen.',
  ],
  s0734: [
    'In the eighteenth year they again presented a glass jar.',
    'In year 18 they sent a glass vessel.',
  ],
  s0735: [
    'In the seventh year of Datong, they again presented a foreign carved jade Buddha.',
    'In Datong 7 they sent a foreign-carved jade Buddha.',
  ],
  s0736: ['Kingdom of Kepantuo', 'Kingdom of Kepantuo'],
  s0737: [
    'The state of Kepantuo is a small state west of Khotan.',
    'Kepantuo was a small kingdom west of Khotan.',
  ],
  s0738: [
    'West it borders Hua; south it adjoins Jibin; north it connects with Shale.',
    'It bordered Hua to the west, Jibin to the south, and Shale to the north.',
  ],
  s0739: [
    'Its seat lies in a mountain valley; the city wall runs over ten li round; the state has twelve cities.',
    'Its capital stood in a mountain valley, walled for more than ten li, ruling twelve towns.',
  ],
  s0740: [
    'Customs resemble Khotan\'s.',
    'Its customs were much like Khotan\'s.',
  ],
  s0741: [
    'They wear kapok cloth, long-bodied small-sleeved robes, and narrow trousers.',
    'They dressed in kapok cloth, long tight-sleeved coats, and narrow trousers.',
  ],
  s0742: [
    'The land suits wheat, which supplies their grain.',
    'Wheat flourished there and fed the people.',
  ],
  s0743: [
    'Cattle, horses, camels, sheep, and the like are many.',
    'Cattle, horses, camels, and sheep were abundant.',
  ],
  s0744: [
    'It produces fine felt, gold, and jade.',
    'It yielded fine felt, gold, and jade.',
  ],
  s0745: [
    'The royal surname is Gesa.',
    'The royal house bore the surname Gesa.',
  ],
  s0746: [
    'In the first year of Zhongdatong, envoys were sent presenting local products.',
    'In Zhongdatong 1 they sent tribute envoys.',
  ],
  s0747: [
    'The state of Mo was Han-era Qimo.',
    'Mo was the Han-era kingdom of Qimo.',
  ],
  s0748: [
    'Fighting men exceed ten thousand households.',
    'It could field more than ten thousand fighting households.',
  ],
  s0749: [
    'North it borders Dingling; east Baiti; west Persia.',
    'Dingling lay to the north, Baiti to the east, and Persia to the west.',
  ],
  s0750: [
    'Natives crop their hair, wear felt caps and small-sleeved coats; when making a jacket they open the neck and sew the front closed.',
    'The people cropped their hair, wore felt caps and short-sleeved coats, and stitched their tunics closed at the neck and front.',
  ],
  s0751: [
    'Sheep, cattle, mules, and donkeys are many.',
    'Sheep, cattle, mules, and donkeys were plentiful.',
  ],
  s0752: [
    'Its king Anmo Shenpan—in the fifth year of Putong sent envoys to offer tribute.',
    'King Anmo Shenpan sent tribute envoys in Putong 5.',
  ],
  s0753: ['Kingdom of Persia', 'Kingdom of Persia'],
  s0754: [
    'Persia: formerly there was a king named Bosini; descendants took their father\'s name character as surname, hence the state\'s name.',
    'Persia took its name from an early king called Bosini, whose descendants adopted his personal name as their clan surname.',
  ],
  s0755: [
    'The state has a walled city, thirty-two li round, walls four zhang high, all with towered pavilions; within the city are hundreds of thousands of buildings; outside are two or three hundred Buddhist temples.',
    'Its capital ran thirty-two li around, with walls four zhang high and towered watchposts; inside stood hundreds of thousands of houses, and outside two or three hundred Buddhist temples.',
  ],
  s0756: [
    'Fifteen li west of the city is an earthen mountain—not especially high, but its ridges stretch far; vultures there devour sheep, and the natives find it a grave affliction.',
    'Fifteen li west stood a low earthen ridge running far; vultures there preyed on sheep, and the people counted it a great plague.',
  ],
  s0757: [
    'In the state is the udumbara flower—fresh and lovely.',
    'The udumbara flower grew there, bright and fair.',
  ],
  s0758: [
    'Dragon colts are produced.',
    'It bred dragon colts.',
  ],
  s0759: [
    'At Xianchi coral trees grow, one or two feet long.',
    'Coral trees grew at Xianchi, a foot or two in height.',
  ],
  s0760: [
    'There are also amber, carnelian, pearls, and rose quartz—these are not considered precious within the country.',
    'Amber, carnelian, pearls, and rose quartz were common and not prized at home.',
  ],
  s0761: [
    'Market trade uses gold and silver.',
    'Markets traded in gold and silver.',
  ],
  s0762: [
    'Marriage law: after the bride-price is settled, the son-in-law leads several dozen men to welcome the bride; the groom wears gold-thread brocade robe and lion brocade trousers, crowned with a heavenly cap, and the bride likewise.',
    'By marriage custom, once the bride-price was paid the groom led dozens of men to fetch the bride, dressed in gold-thread brocade and lion-pattern trousers with a heavenly crown—the bride wore the same.',
  ],
  s0763: [
    'The bride\'s brothers at once come and take her by the hand to give her over—the rites of husband and wife are from this forever complete.',
    'Her brothers then took her hand and passed her to the groom—the wedding rites ended there.',
  ],
  s0764: [
    'East it borders Hua; west and south alike Brahman; north Fanli.',
    'Hua lay to the east; Brahman to the west and south; Fanli to the north.',
  ],
  s0765: [
    'In the second year of Zhongdatong, envoys were sent presenting a Buddha tooth.',
    'In Zhongdatong 2 they sent a Buddha tooth as tribute.',
  ],
  s0766: ['Kingdom of Dangchang', 'Kingdom of Dangchang'],
  s0767: [
    'Dangchang lies southeast of Henan, northwest of Yizhou, west of Longxi—a Qiang people.',
    'Dangchang stood southeast of Henan, northwest of Yizhou, and west of Longxi—a Qiang people.',
  ],
  s0768: [
    'In Song Emperor Xiaowu\'s reign, its king Liang Guanhu first presented local products.',
    'Under Song Emperor Xiaowu, King Liang Guanhu first sent tribute.',
  ],
  s0769: [
    'In Tianjian 4, King Liang Mibo came presenting licorice and angelica; an edict made him Bearer of the Staff of Authority, Area Commander of military affairs of He and Liang provinces, General Who Pacifies the West, Colonel of the Eastern Qiang, Governor of He and Liang provinces, Duke of Longxi, and King of Dangchang, invested with a gold seal.',
    'In Tianjian 4, King Liang Mibo brought licorice and angelica; the throne made him bearer of the staff, area commander of He and Liang, General Who Pacifies the West, Colonel of the Eastern Qiang, governor of both provinces, Duke of Longxi, and King of Dangchang, with a gold seal.',
  ],
  s0770: [
    'When Mibo died, his son Mitai succeeded;',
    'When Mibo died, his son Mitai succeeded;',
  ],
  s0771: [
    'In Datong 7, his father\'s titles were again granted.',
    'In Datong 7 the throne restored his father\'s titles.',
  ],
  s0772: [
    'Their dress and customs broadly match Henan\'s.',
    'Their clothing and customs closely resembled Henan\'s.',
  ],
  s0773: ['Kingdom of Dengzhi', 'Kingdom of Dengzhi'],
  s0774: ['Kingdom of Wuxing', 'Kingdom of Wuxing'],
  s0775: [
    'Wuxing was originally Qiuchi.',
    'Wuxing had originally been Qiuchi.',
  ],
  s0776: [
    'Yang Nandang set himself up as King of Qin; Song Emperor Wen sent Pei Fangming against him; Nandang fled to Wei.',
    'Yang Nandang declared himself King of Qin; Song Emperor Wen sent Pei Fangming to suppress him, and Nandang fled to Wei.',
  ],
  s0777: [
    'His elder brother\'s son Wendé gathered forces at Jialu; Song therefore granted him titles; Wei attacked again and Wendé fled to Hanzhong.',
    'His nephew Wendé rallied men at Jialu; Song enfeoffed him, but Wei attacked again and Wendé fled to Hanzhong.',
  ],
  s0778: [
    'His younger clansman Wensie set himself up and again garrisoned Jialu.',
    'His clansman Wensie then declared himself ruler and reoccupied Jialu.',
  ],
  s0779: [
    'When he died, Wendé\'s younger brother Wendu succeeded; he made his younger brother Wen Hong prefect of Baishui, encamped at Wuxing—under Song he was titled King of Wudu.',
    'After his death Wendé\'s brother Wendu took over, made Wen Hong prefect of Baishui, and encamped at Wuxing—Song titled him King of Wudu.',
  ],
  s0780: [
    'The state of Wuxing dates from this.',
    'The kingdom of Wuxing began here.',
  ],
  s0781: [
    'Nandang\'s clansman Guangxiang attacked and killed Wendu, set himself up as King of Yinping and commandant of Jialu garrison.',
    'Nandang\'s kinsman Guangxiang killed Wendu and made himself King of Yinping and commandant of Jialu.',
  ],
  s0782: [
    'When he died, his son Jiong succeeded;',
    'When he died, his son Jiong succeeded;',
  ],
  s0783: [
    'When Jiong died, his son Chongzu succeeded;',
    'When Jiong died, his son Chongzu succeeded;',
  ],
  s0784: [
    'When Chongzu died, his son Mengersun succeeded.',
    'When Chongzu died, his son Mengersun succeeded.',
  ],
  s0785: [
    'In Qi Yongming, Wei\'s Southern Liangzhou inspector and Duke of Qiuchi Yang Lingzhen held Migong Mountain and submitted; under Qi, Lingzhen was made Northern Liangzhou inspector and Duke of Qiuchi.',
    'In Qi Yongming, Yang Lingzhen—Wei\'s southern Liangzhou inspector and Duke of Qiuchi—held Migong Mountain and submitted; Qi made him northern Liangzhou inspector and Duke of Qiuchi.',
  ],
  s0786: [
    'When Wen Hong died, clansman Jishi was made Northern Qinzhou inspector and King of Wudu.',
    'After Wen Hong died, the clansman Jishi became northern Qinzhou inspector and King of Wudu.',
  ],
  s0787: [
    'At the start of Tianjian, Jishi was made Bearer of the Staff, Area Commander of Qin and Yong military affairs, General Who Assists the State, Colonel Who Pacifies the Qiang, Northern Qinzhou inspector, and King of Wudu; Lingzhen was made Champion General; Mengersun was made Acting Staff, Commander of Shazhou, and King of Yinping.',
    'At the start of Tianjian, Jishi became bearer of the staff, area commander of Qin and Yong, General Who Assists the State, Colonel Who Pacifies the Qiang, northern Qinzhou inspector, and King of Wudu; Lingzhen became champion general; Mengersun acting staff, commander of Shazhou, and King of Yinping.',
  ],
  s0788: [
    'When Jishi died, his son Shaoxian inherited the titles.',
    'When Jishi died, his son Shaoxian inherited the titles.',
  ],
  s0789: [
    'In year 2, Lingzhen was made Bearer of the Staff, Commander of Longyou military affairs, Left General, Northern Liangzhou inspector, and King of Qiuchi.',
    'In year 2 Lingzhen became bearer of the staff, commander of Longyou, left general, northern Liangzhou inspector, and King of Qiuchi.',
  ],
  s0790: [
    'In year 10, Mengersun died; an edict posthumously granted General Who Pacifies the Sands and Northern Yongzhou inspector.',
    'In year 10 Mengersun died; the throne posthumously made him General Who Pacifies the Sands and northern Yongzhou inspector.',
  ],
  s0791: [
    'His son Ding inherited the enfeoffment and titles.',
    'His son Ding inherited the fief and titles.',
  ],
  s0792: [
    'When Shaoxian died, his son Zhihui succeeded.',
    'When Shaoxian died, his son Zhihui succeeded.',
  ],
  s0793: [
    'In Datong 1, Hanzhong was recovered; Zhihui sent envoys with a memorial asking to lead four thousand households back to the realm; an edict permitted it, and the area was made Eastern Yizhou.',
    'In Datong 1, after Hanzhong was retaken, Zhihui asked by memorial to bring four thousand households home; the throne agreed and made the region Eastern Yizhou.',
  ],
  s0794: [
    'Its state adjoins Qinling to the east and Dangchang to the west—eight hundred li from Dangchang, four hundred li south of Hanzhong, three hundred li north of Qizhou, nine hundred li east of Chang\'an.',
    'It touched Qinling on the east and Dangchang on the west—eight hundred li from Dangchang, four hundred south of Hanzhong, three hundred north of Qizhou, nine hundred east of Chang\'an.',
  ],
  s0795: [
    'Originally there were a hundred thousand households; generation by generation the count diminished.',
    'It once held a hundred thousand households, but the numbers shrank with each generation.',
  ],
  s0796: [
    'Great surnames include Fu and Jiang.',
    'Leading clans were Fu and Jiang.',
  ],
  s0797: [
    'Their speech matches China\'s.',
    'They spoke the same language as China.',
  ],
  s0798: [
    'They wear black-felt chieftain\'s riding caps, long-bodied small-sleeved robes, narrow trousers, and leather boots.',
    'They wore black felt riding caps, long tight-sleeved coats, narrow trousers, and leather boots.',
  ],
  s0799: [
    'The land grows the nine grains.',
    'The land yielded the nine grains.',
  ],
  s0800: [
    'Marriage observes all six rites.',
    'Marriage followed the full six rites.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_054_b8.mjs <translation.json>'
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
