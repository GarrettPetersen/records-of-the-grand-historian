import fs from 'node:fs';

const path = 'translations/current_translation_beishi.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const T = {
  s0201: [
    'When Jin rebelled, he drew his blade toward the imperial seat.',
    'When Jin rose in revolt, he bared his sword against the throne.',
  ],
  s0202: [
    'Crown Prince Shi intercepted him, was wounded in the ribs, and died in the fifth month.',
    'Crown Prince Shi blocked him, took a wound in the ribs, and died that fifth month.',
  ],
  s0203: [
    'Later he was posthumously enfeoffed and is known as Emperor Xianming.',
    'Later he received a posthumous title and is remembered as Emperor Xianming.',
  ],
  s0204: [
    'In the seventh month the imperial grandson Gui was born, and a general amnesty was proclaimed.',
    'In the seventh month imperial grandson Gui was born and the realm was pardoned.',
  ],
  s0205: [
    'In the thirty-ninth year Fu Jian sent his Grand Marshal Fu Luo at the head of two hundred thousand men, with his generals Zhu Tong, Zhang Hao, Deng Qiang, and others coming by several routes to invade; the royal army fared ill.',
    'In the thirty-ninth year Fu Jian sent Grand Marshal Fu Luo with two hundred thousand troops and generals Zhu Tong, Zhang Hao, and Deng Qiang against the state by several roads; the royal army suffered defeat.',
  ],
  s0206: [
    'The Emperor was then unwell and therefore led his people to shelter north of Yinshan.',
    'The Emperor was ill and led the nation north of Yinshan to escape.',
  ],
  s0207: [
    'The mixed tribes of the Gaoche all rebelled; raiders struck on every side, fodder could not be gathered, and he crossed the desert south again.',
    'Gaoche tribes rose on every hand, raiders closed in from all quarters, and with no pasture for the herds he crossed the desert south once more.',
  ],
  s0208: [
    'Jian\'s army gradually withdrew, and he then returned.',
    'When Jian\'s army drew back, he returned home.',
  ],
  s0209: [
    'In the twelfth month he reached Yunzhong.',
    'In the twelfth month he reached Yunzhong.',
  ],
  s0210: [
    'On the twelfth day of the month Prince Shijun rose in rebellion.',
    'On the twelfth day Prince Shijun rebelled.',
  ],
  s0211: [
    'The Emperor died suddenly; he was fifty-seven.',
    'The Emperor died suddenly at fifty-seven.',
  ],
  s0212: [
    'When Daowu took the throne he honored him as High Progenitor.',
    'Daowu came to power and enshrined him as High Progenitor.',
  ],
  s0213: [
    'The Emperor was by nature generous and mild.',
    'The Emperor was generous by nature.',
  ],
  s0214: [
    'At that time the state had little silk; a man of the tribes named Xu Qian stole two bolts, and when the guard reported it the Emperor concealed the matter and said to Yan Feng, "I cannot bear to look upon Qian\'s face; do not reveal this.',
    'Silk was scarce in the realm when Xu Qian of the tribes stole two bolts; the guard told the Emperor, who hid the crime and said to Yan Feng, "I cannot bear to see Qian\'s face. Do not speak of this.',
  ],
  s0215: [
    'If Qian should die of shame by his own hand, that would be to disgrace a gentleman for mere goods, and that would be wrong.',
    'If shame drove Qian to kill himself, a man of worth would die for money, and that would be wrong.',
  ],
  s0216: [
    'Once, when the Emperor was striking rebel bandits in the western marches, a stray arrow struck his eye.',
    'Once, campaigning against western rebels, a stray arrow struck his eye.',
  ],
  s0217: [
    'After the bandits were broken, the great ministers seized the archer; each took awl and knife, eager to carve him apart.',
    'When the rebels were crushed, ministers seized the archer, awls and knives in hand, ready to butcher him.',
  ],
  s0218: [
    'The Emperor said, "Each served his own lord; what crime is that? Release him!',
    'The Emperor said, "Each man served his own lord. What crime is that? Let him go!',
  ],
  s0219: [
    'Such was his mercy and forbearance.',
    'Such was the mercy of his rule.',
  ],
  s0220: [
    'Grand Progenitor Emperor Daowu, taboo name Gui, was the eldest son\'s son of Zhaocheng Emperor and the son of Emperor Xianming.',
    'Grand Progenitor Emperor Daowu, taboo name Gui, was Zhaocheng Emperor\'s grandson by the direct line and the son of Emperor Xianming.',
  ],
  s0221: [
    'His mother was Empress He of Xianming; in the first days of the migration she traveled to Yun Marsh.',
    'His mother was Empress He of Xianming; during the early migrations she came to Yun Marsh.',
  ],
  s0222: [
    'She dreamed the sun rose within her chamber; waking, she saw light from the window reach the sky, and was suddenly moved.',
    'She dreamed the sun rose inside her lodge; waking, she saw light pour from the window to the sky and felt a sudden awe.',
  ],
  s0223: [
    'On the seventh day of the seventh month in the thirty-fourth year of Jianguo the Emperor was born north of Canhe Marsh, and that night there was light again.',
    'On the seventh day of the seventh month in Jianguo year thirty-four he was born north of Canhe Marsh, and light filled the night again.',
  ],
  s0224: [
    'Zhaocheng was greatly pleased; the ministers offered congratulations, a general amnesty was proclaimed, and the ancestors were told.',
    'Zhaocheng rejoiced; ministers celebrated, the realm was pardoned, and the ancestors were notified.',
  ],
  s0225: [
    'The nurse found the infant twice the weight of ordinary children and marveled in private.',
    'His nurse found him twice the weight of other infants and marveled in secret.',
  ],
  s0226: [
    'The next year an elm sprang up in the hollow of the birth-curtain and later became a grove.',
    'Next year an elm grew in the hollow where the birth-curtain had stood and later became a wood.',
  ],
  s0227: [
    'Though still young the Emperor could speak; his eyes shone with light, his brow was broad and his ears large.',
    'He spoke while still a child; his eyes shone, his brow was broad, his ears large.',
  ],
  s0228: [
    'At six years Zhaocheng died; Fu Jian sent generals to invade within the borders, and they meant to move the Emperor to Chang\'an, but thanks to Yan Feng he was spared.',
    'At six Zhaocheng died; Fu Jian sent generals south of the border intending to take the boy to Chang\'an, but Yan Feng saved him.',
  ],
  s0229: [
    'Once Jian\'s army had withdrawn, the people of the state scattered.',
    'When Jian\'s army left, the nation fell apart.',
  ],
  s0230: [
    'Jian sent Liu Kuren and Liu Weichen to divide control of state affairs.',
    'Jian set Liu Kuren and Liu Weichen to divide rule of the realm.',
  ],
  s0231: [
    'Southern chief Zhangsun Song and Yuan Ta and others led all their old followers south to join Kuren, and the Emperor thereupon passed into the Dugu tribe.',
    'Southern chief Zhangsun Song, Yuan Ta, and others took their old followers south to Kuren, and the boy passed into the Dugu tribe.',
  ],
  s0232: [
    'In the first year Zhaocheng Emperor was buried at Jinling; timbers for the outer coffin and inner chamber all grew into a forest where they were set.',
    'In the first year they buried Zhaocheng at Jinling; timbers for the tomb all sprouted and became a grove.',
  ],
  s0233: [
    'Though still a child, the Emperor stood apart from the crowd.',
    'Though still a boy, he stood apart from other children.',
  ],
  s0234: [
    'Liu Kuren often told his sons, "This boy has the will to rule all under Heaven; he will surely restore the great enterprise."',
    'Liu Kuren often told his sons, "This child means to rule the world; he will restore the great enterprise."',
  ],
  s0235: [
    'In the tenth month of the seventh year Jin defeated Fu Jian at Huainan.',
    'In the tenth month of the seventh year Jin routed Fu Jian at Huainan.',
  ],
  s0236: [
    'Murong Wen and others killed Liu Kuren, and his younger brother Juan took charge of the tribal division.',
    'Murong Wen and others killed Liu Kuren; his brother Juan took the tribe.',
  ],
  s0237: [
    'In the eighth year Murong Wei\'s younger brother Chong usurped the throne.',
    'In the eighth year Murong Wei\'s brother Chong seized the throne.',
  ],
  s0238: [
    'Yao Chang styled himself Grand Chanyu and Everlasting King of Qin.',
    'Yao Chang proclaimed himself Grand Chanyu and Everlasting King of Qin.',
  ],
  s0239: [
    'Murong Chui usurped the title King of Yan.',
    'Murong Chui seized the title King of Yan.',
  ],
  s0240: [
    'In the ninth year Liu Kuren\'s son Xian killed Juan and replaced him, and then plotted rebellion.',
    'In the ninth year Liu Kuren\'s son Xian killed Juan, took his place, and plotted treason.',
  ],
  s0241: [
    'The merchant Wang Ba learned of it and trod on the Emperor\'s foot in the crowd; the Emperor thereupon galloped away.',
    'Merchant Wang Ba learned of the plot and stepped on the Emperor\'s foot in the crowd; the boy galloped away.',
  ],
  s0242: [
    'At that time the former great chief Liujuan of the Liang Penzi clan was Xian\'s chief plotter and knew the whole design; he secretly sent his tribesman Mu Chong in haste to report it.',
    'Former great chief Liujuan of Liang Penzi\'s line was Xian\'s chief plotter and knew the whole plan; he secretly sent Mu Chong to warn the Emperor.',
  ],
  s0243: [
    'The Emperor then secretly joined his old ministers Zhangsun Jian, Yuan Ta, and others, and on a tour of favor entered the Helan tribe.',
    'He secretly rallied old ministers Zhangsun Jian, Yuan Ta, and others and took refuge with the Helan tribe.',
  ],
  s0244: [
    'That very day Xian indeed sent men to kill the Emperor, but they did not reach him in time.',
    'That same day Xian sent killers after the Emperor, but they arrived too late.',
  ],
  s0245: [
    'The account is in the 《Biography of Empress Dowager Xianming》.',
    'The full account is in the 《Biography of Empress Dowager Xianming》.',
  ],
  s0246: [
    'That year Qifu Guoren privately assumed the offices of Governor of Qin and He provinces and Grand Chanyu.',
    'That year Qifu Guoren privately took the titles Governor of Qin and He and Grand Chanyu.',
  ],
  s0247: [
    'Yao Chang killed Fu Jian; Jian\'s son Pi usurped the imperial throne at Jinyang.',
    'Yao Chang killed Fu Jian; Jian\'s son Pi seized the throne at Jinyang.',
  ],
  s0248: [
    'In the first month of the first year of Dengguo, on day wushen, the Emperor assumed the kingship of Dai, sacrificed to Heaven, established the reign era, and held a great assembly at Niuchuan.',
    'In spring of Dengguo year one, on wushen day in the first month, he became King of Dai, sacrificed to Heaven, proclaimed a reign era, and held court at Niuchuan.',
  ],
  s0249: [
    'In that month Zhangsun Song was again made southern chief and Shusun Puluo northern chief.',
    'That month Zhangsun Song was again southern chief and Shusun Puluo northern chief.',
  ],
  s0250: [
    'In that month Murong Chui usurped the imperial throne at Zhongshan, with the state name Yan.',
    'That month Murong Chui took the imperial title at Zhongshan and named his state Yan.',
  ],
  s0251: [
    'In the second month he visited Shengle in Dingxiang and let the people rest while urging them to farm.',
    'In the second month he went to Shengle in Dingxiang, gave the people rest, and urged them to farm.',
  ],
  s0252: [
    'Murong Chong was killed by his own subordinates.',
    'Murong Chong was killed by his own men.',
  ],
  s0253: [
    'In the fourth month of summer he changed his title to King of Wei.',
    'In the fourth month of summer he took the title King of Wei.',
  ],
  s0254: [
    'In the fifth month Yao Chang usurped the imperial throne at Chang\'an, with the state name Great Qin.',
    'In the fifth month Yao Chang seized the throne at Chang\'an and named his state Great Qin.',
  ],
  s0255: [
    'In the eighth month of autumn Liu Xian sent his younger brother Kangni to welcome his royal uncle Kudu from Murong Yong, and troops followed, pressing the southern border.',
    'In the eighth month Liu Xian sent his brother Kangni to fetch his uncle Kudu from Murong Yong with an army that pressed the southern frontier.',
  ],
  s0256: [
    'Yu Huan at the Emperor\'s side and the great chiefs of the tribes plotted to join them.',
    'Yu Huan and the tribal chiefs at court plotted to go over to the enemy.',
  ],
  s0257: [
    'The plot was discovered; five ringleaders were executed and the rest were not questioned.',
    'The plot leaked; five plotters were put to death and the rest went unpunished.',
  ],
  s0258: [
    'Fearing civil strife, the Emperor crossed Yinshan to the north and visited the Helan tribe, taking the mountains as his defense.',
    'Fearing civil war, he crossed Yinshan north to the Helan tribe and held the mountains as his fortress.',
  ],
  s0259: [
    'He sent the envoy An Tong and Zhangsun He to Murong Chui to ask for troops.',
    'He sent An Tong and Zhangsun He to Murong Chui to beg for troops.',
  ],
  s0260: [
    'Chui ordered his son Helin to lead troops and follow Tong and the others.',
    'Chui sent his son Helin with an army to join Tong.',
  ],
  s0261: [
    'The army had not yet arrived when the enemy pressed close.',
    'Before the army arrived, the enemy was upon him.',
  ],
  s0262: [
    'Thereupon northern chief Shusun Puluo and thirteen others, with various Wuhuan bands, fled to Liu Weichen.',
    'Northern chief Shusun Puluo and thirteen others, with Wuhuan bands, fled to Liu Weichen.',
  ],
  s0263: [
    'The Emperor himself went from Nushan to Niuchuan, encamped on the Yan River, marched south through Daigu Valley, joined Helin at Gaoliu, routed Kudu utterly, and gathered in all his followers.',
    'He marched from Nushan to Niuchuan, camped on the Yan River, came south through Daigu Valley, met Helin at Gaoliu, shattered Kudu, and took all his people.',
  ],
  s0264: [
    'In the tenth month of winter Fu Pi was killed by the Jin general Feng Gai.',
    'In the tenth month Fu Pi was killed by Jin general Feng Gai.',
  ],
  s0265: [
    'Murong Yong usurped the imperial throne at Changzi.',
    'Murong Yong seized the throne at Changzi.',
  ],
  s0266: [
    'In the eleventh month Fu Deng usurped the imperial throne in Longdong.',
    'In the eleventh month Fu Deng took the throne in Longdong.',
  ],
  s0267: [
    'In the twelfth month Murong Chui sent envoys bearing the seal of Western Chanyu and enfeoffed him as King of Shanggu.',
    'In the twelfth month Murong Chui sent envoys with the Western Chanyu seal and made him King of Shanggu.',
  ],
  s0268: [
    'The Emperor would not accept.',
    'The Emperor refused.',
  ],
  s0269: [
    'In the fifth month of summer in the second year he sent An Tong to levy troops from Murong Chui.',
    'In the fifth month of the second year he sent An Tong to Murong Chui for troops.',
  ],
  s0270: [
    'Chui sent his son Helin with a host to join him.',
    'Chui sent Helin with an army to join him.',
  ],
  s0271: [
    'In the sixth month the Emperor campaigned in person against Liu Xian; Xian fled to Murong Yong and all his tribes were gathered in.',
    'In the sixth month he marched in person against Liu Xian; Xian fled to Murong Yong and all his tribes were taken.',
  ],
  s0272: [
    'In the twelfth month of winter he toured Songmo and returned to Niuchuan.',
    'In the twelfth month he toured Songmo and returned to Niuchuan.',
  ],
  s0273: [
    'On day guihai in the fifth month of summer in the third year he marched north against the Kumo Xi and routed them utterly.',
    'On guihai day in the fifth month of the third year he marched north against the Kumo Xi and crushed them.',
  ],
  s0274: [
    'In the sixth month Qifu Guoren died; his younger brother Qiangui succeeded and privately assumed the title King of Henan.',
    'In the sixth month Qifu Guoren died; his brother Qiangui took power and styled himself King of Henan.',
  ],
  s0275: [
    'In the seventh month of autumn the Kumo Xi chief Jiuji gathered the scattered and by night attacked the traveling palace; cavalry were sent in pursuit and they were wiped out.',
    'In the seventh month the Kumo Xi chief Jiuji rallied the scattered and struck the traveling palace by night; cavalry ran them down and destroyed them.',
  ],
  s0276: [
    'In the eighth month he sent the Duke of Jiuyuan Yi on a mission to Murong Chui.',
    'In the eighth month he sent Duke of Jiuyuan Yi to Murong Chui.',
  ],
  s0277: [
    'In the tenth month of winter Chui sent envoys with tribute.',
    'In the tenth month Chui sent envoys with tribute.',
  ],
  s0278: [
    'On day jiayin in the first month of spring in the fourth year he raided the Gaoche tribes.',
    'On jiayin day in the first month of the fourth year he raided the Gaoche tribes.',
  ],
  s0279: [
    'On day guisi in the second month he reached Nüshui and attacked the Chituolin tribe.',
    'On guisi day in the second month he reached Nüshui and attacked the Chituolin tribe.',
  ],
  s0280: [
    'Both were utterly defeated.',
    'Both were shattered.',
  ],
  s0281: [
    'In that month Lü Guang styled himself King of the Three Rivers.',
    'That month Lü Guang took the title King of the Three Rivers.',
  ],
  s0282: [
    'In the fifth month of summer he sent the Duke of Chenliu Qian on a mission to Murong Chui.',
    'In the fifth month he sent Duke of Chenliu Qian to Murong Chui.',
  ],
  s0283: [
    'In the tenth month of winter Chui sent envoys with tribute.',
    'In the tenth month Chui sent envoys with tribute.',
  ],
  s0284: [
    'On day jiashen in the third month of spring in the fifth year he marched west, halted at Luhun Sea, and raided the Yuanhe band of the Gaoche, routing them utterly.',
    'On jiashen day in the third month of the fifth year he marched west to Luhun Sea, struck the Yuanhe Gaoche, and routed them.',
  ],
  s0285: [
    'Murong Chui sent his son Helin to join him.',
    'Murong Chui sent Helin to join him.',
  ],
  s0286: [
    'On day bingyin in the fourth month of summer he traveled to Yixin Mountain and with Helin attacked the Helan and Hexi tribes, routing them utterly.',
    'On bingyin day in the fourth month he went to Yixin Mountain and with Helin broke the Helan and Hexi tribes.',
  ],
  s0287: [
    'In the eighth month of autumn he returned to Niuchuan.',
    'In the eighth month he returned to Niuchuan.',
  ],
  s0288: [
    'He sent Prince Gu of Qin on a mission to Murong Chui.',
    'He sent Prince Gu of Qin to Murong Chui.',
  ],
  s0289: [
    'On day renshen in the ninth month he attacked the Chinu tribe at Nangqu River and broke them.',
    'On renshen day in the ninth month he struck the Chinu tribe at Nangqu River and broke them.',
  ],
  s0290: [
    'In the tenth month of winter he attacked the Douchén band of the Gaoche at Wolf Mountain and broke them.',
    'In the tenth month he attacked the Gaoche Douchén band at Wolf Mountain and broke them.',
  ],
  s0291: [
    'In the twelfth month the Emperor returned and halted at White Desert.',
    'In the twelfth month he returned and camped at White Desert.',
  ],
  s0292: [
    'In the first month of spring in the sixth year he visited Niudie River.',
    'In the first month of the sixth year he went to Niudie River.',
  ],
  s0293: [
    'In the third month he sent the Duke of Jiuyuan Yi, the Duke of Chenliu Qian, and others west to attack the Chufu tribe and routed them utterly.',
    'In the third month he sent Dukes Yi of Jiuyuan and Qian of Chenliu west against the Chufu tribe and crushed them.',
  ],
  s0294: [
    'In the fourth month of summer he sacrificed to Heaven.',
    'In the fourth month he sacrificed to Heaven.',
  ],
  s0295: [
    'On day renshen in the seventh month he held a martial review at Niuchuan.',
    'On renshen day in the seventh month he held a martial review at Niuchuan.',
  ],
  s0296: [
    'Murong Chui detained Prince Gu of Qin and demanded famous horses; the Emperor refused.',
    'Murong Chui held Prince Gu and demanded famous horses; the Emperor refused.',
  ],
  s0297: [
    'He then sent envoys to Murong Yong; Yong sent his Grand Herald Murong Jun with a memorial urging him to advance in title and honor.',
    'He sent envoys to Murong Yong; Yong sent Grand Herald Murong Jun with a memorial urging him to take the imperial title.',
  ],
  s0298: [
    'In the ninth month the Emperor raided Wuyuan, slaughtered it, and gathered its stored grain.',
    'In the ninth month he raided Wuyuan, put it to the sword, and seized its granaries.',
  ],
  s0299: [
    'Returning to Niudie River, he set up a stele north of Ziyang Pass to record his achievements.',
    'Returning to Niudie River, he raised a stele north of Ziyang Pass to record his deeds.',
  ],
  s0300: [
    'On day wuxu in the tenth month of winter he marched north against the Rouran and pursued them to rout south of Great Desert at Shangshan.',
    'On wuxu day in the tenth month he marched north against the Rouran and ran them down south of the Great Desert at Shangshan.',
  ],
};

let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  applied++;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations to', path);
