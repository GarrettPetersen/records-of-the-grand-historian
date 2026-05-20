#!/usr/bin/env node
/** Batch 5: s0401–s0500 (Jiutangshu ch.009, Xuanzong 2 — Tianbao 13–15, rebellion and flight toward Shu) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal:
      'On gengyin, Zhang Jun, Minister of Justice among officials in attendance, and others memorialized that the emperor be given the honorific title Emperor of Kaiyuan, Heaven and Earth, Great Treasure, Sagely Culture, Divine Martialism, Filial Virtue, and Manifestation of the Way.',
    idiomatic:
      'On gengyin Zhang Jun and other ministers in attendance asked that the throne take the title Emperor of Kaiyuan, Heaven and Earth, Great Treasure, Sagely Culture, Divine Martialism, Filial Virtue, and Manifestation of the Way.',
  },
  s0402: {
    literal:
      'In spring of the first month of Tianbao 13, on dingyou the first day of the month, the emperor received court congratulations at the Wind-Watching Tower of Huaqing Palace.',
    idiomatic:
      'Tianbao 13 opened at Huaqing: on dingyou the emperor received New Year homage from the Wind-Watching Tower.',
  },
  s0403: {
    literal:
      'On jihai, An Qingxu presented captives at the mobile court; the emperor received him in the inner palace and rewarded him lavishly.',
    idiomatic:
      'On jihai An Qingxu brought prisoners to the traveling court and was received in the palace with enormous gifts.',
  },
  s0404: {
    literal:
      'On yisi, An Lushan was promoted Left Vice Director of the Department of State Affairs, granted a substantive fief of one thousand households, ten households of slaves and maidservants, and one estate and one mansion each;',
    idiomatic:
      'On yisi An Lushan became Left Vice Director of State Affairs with a thousand-household fief, ten slave households, and a manor and residence apiece;',
  },
  s0405: {
    literal:
      'He was also made concurrent Director of the Imperial Stud, Five Paddocks, Palace Parks, and Longyou Herds; Vice Minister of War Ji Wen served as his deputy.',
    idiomatic:
      'and was made master of the stud, parks, and Longyou herds, with Ji Wen of the War Ministry as deputy.',
  },
  s0406: {
    literal:
      'On bingwu, the court returned to the capital.',
    idiomatic:
      'On bingwu the emperor returned to Chang\'an.',
  },
  s0407: {
    literal:
      'In the second month on guiyou, the emperor in person offered sacrifice at the Grand Ultimate Palace, raising the honorific of the Supreme Ultimate Emperor of the Mysterious Origin to Great Sagely Ancestor, High Supreme, Great Broad Way, Golden Portal, Mysterious Origin, Heavenly Imperial Great Emperor.',
    idiomatic:
      'On guiyou he worshipped at the Supreme Ultimate Temple and exalted the divine ancestor as Great Sagely Ancestor, High Supreme, Great Broad Way, Golden Portal, Mysterious Origin Heavenly Emperor.',
  },
  s0408: {
    literal:
      'On jiaxu he sacrificed in person at the Imperial Ancestral Temple, posthumously ennobling Gaozu as Divine Yao, Great Sagely, Great Radiant Filial Emperor; Taizong as Taizong, Civil and Martial, Great Sagely, Great Filial Emperor; Gaozong as Gaozong, Heavenly Sovereign, Great Sagely, Great Magnificent Filial Emperor; Zhongzong as Zhongzong, Great Harmony, Great Sagely, Great Bright Filial Emperor; and Ruizong as Ruizong, Mysterious Perfection, Great Sagely, Great Flourishing Filial Emperor.',
    idiomatic:
      'On jiaxu he worshipped at the ancestral temple and raised the posthumous titles of the five founders to their grand Sagely-Filial forms.',
  },
  s0409: {
    literal:
      'On yihai he received the honorific title at Xingqing Hall; when the rite was complete he proclaimed a great amnesty for all under Heaven.',
    idiomatic:
      'On yihai he took his new title at Xingqing Hall and amnestied the realm.',
  },
  s0410: {
    literal:
      'Officials demoted for mourning were released to go home.',
    idiomatic:
      'Demoted officials in mourning were sent home.',
  },
  s0411: {
    literal:
      'The five offices of the imperial tombs were changed back to directorates, each commandant and assistant promoted one rank.',
    idiomatic:
      'The five tomb offices became directorates again, each chief and deputy rising one step.',
  },
  s0412: {
    literal:
      'Civil and military officials of third rank and above received one noble rank; those of fourth rank and below advanced one step.',
    idiomatic:
      'Third-rank officers and above gained a noble grade; fourth rank and below rose one step.',
  },
  s0413: {
    literal:
      'Public feasting was granted for three days.',
    idiomatic:
      'Three days of public feasting were proclaimed.',
  },
  s0414: {
    literal:
      'On wuyin, Right Chancellor and concurrent Minister of Culture Yang Guozhong was made Defender of the State, his other posts unchanged.',
    idiomatic:
      'On wuyin Yang Guozhong, right chancellor and minister of culture, became Defender of the State.',
  },
  s0415: {
    literal:
      'On jiashen, Defender of the State Yang Guozhong received the investiture; yellow earth rained and stained the court robes.',
    idiomatic:
      'On jiashen Yang Guozhong took the seal while yellow earth rained on the court robes.',
  },
  s0416: {
    literal:
      'Lushan memorialized that the officers and soldiers who had repeatedly campaigned against the Khitan and performed meritorious service, such as Tiao Dang, should be promoted beyond three grades and that their commission documents should be handsomely written;',
    idiomatic:
      'Lushan asked that veterans of the Khitan campaigns, including Tiao Dang, be promoted more than three grades with fine commission scrolls;',
  },
  s0417: {
    literal:
      'thereupon more than five hundred men were promoted to general and more than two thousand to vice general.',
    idiomatic:
      'and more than five hundred became generals and two thousand vice generals.',
  },
  s0418: {
    literal:
      'In the third month on dingyou, Director of the Imperial Music Zhang Yan was demoted to Luzhou Assistant Magistrate, and his brother Zhang Jun, Minister of Justice, was demoted to Jian\'an prefect.',
    idiomatic:
      'In the third month Zhang Yan lost his music directorship for Luzhou and Zhang Jun his justice ministry for Jian\'an.',
  },
  s0419: {
    literal:
      'On bingwu the emperor spread music at the Yue Dragon Hall gate and feasted the ministers, granting the right chancellor one thousand five hundred bolts of silk, three hundred of colored gauze, and five hundred of colored damask;',
    idiomatic:
      'On bingwu he feasted ministers at Yue Dragon Hall, giving the right chancellor fifteen hundred bolts of silk and lavish colored silks;',
  },
  s0420: {
    literal:
      'the left chancellor three hundred bolts of silk and fifty each of colored gauze and damask;',
    idiomatic:
      'the left chancellor three hundred bolts plus fifty each of gauze and damask;',
  },
  s0421: {
    literal:
      'the rest received eighty bolts at third rank, sixty at fourth and fifth, forty at sixth and seventh—ending in utmost joy.',
    idiomatic:
      'others by rank down to forty bolts, until the feast broke up in joy.',
  },
  s0422: {
    literal:
      'On renxu he held a great feast at the Hall of Diligent Government.',
    idiomatic:
      'On renxu he held a great banquet at the Hall of Diligent Government.',
  },
  s0423: {
    literal:
      'Protector-General of Beiting Cheng Qianli captured Abu Si alive and presented him below the tower; he was beheaded in Vermilion Bird Street.',
    idiomatic:
      'Cheng Qianli of Beiting presented the captive Abu Si below the tower and had him beheaded on Vermilion Bird Street.',
  },
  s0424: {
    literal:
      'On yichou, Senior General of the Left Feathered Forest Feng Changqing was made acting Protector-General of Beiting and Military Commissioner of Yixi.',
    idiomatic:
      'On yichou Feng Changqing became acting Beiting protector and Yixi commissioner.',
  },
  s0425: {
    literal:
      'Princess Wanchun married Yang Fei.',
    idiomatic:
      'Princess Wanchun wed Yang Fei.',
  },
  s0426: {
    literal:
      'In summer, the fifth month, Mars lingered in the Heart constellation for more than fifty days.',
    idiomatic:
      'In the fifth month Mars stood in the Heart lodge for fifty days.',
  },
  s0427: {
    literal:
      'On yichou, the first day of the sixth month, there was a partial eclipse of the sun, the disk not fully covered, like a hook.',
    idiomatic:
      'On yichou the sun was eclipsed to a hook-shaped crescent.',
  },
  s0428: {
    literal:
      'Investigating Censor and Acting Military Commissioner of Sword South Li Mi led troops to attack the Yunnan barbarians on the Xi\'er River; when provisions were exhausted the army turned back, horses\' hooves breaking through a bridge, and Li Mi was captured by Geluofeng; the whole force perished.',
    idiomatic:
      'Li Mi of Sword South attacked the Yunnan tribes on the Xi\'er River, ran out of food on the retreat, lost his army on a broken bridge, and was taken by Geluofeng.',
  },
  s0429: {
    literal:
      'Jiyang Commandery was abolished; its five counties were attached to Dongping Commandery.',
    idiomatic:
      'Jiyang commandery was abolished and its five counties folded into Dongping.',
  },
  s0430: {
    literal:
      'In autumn, the eighth month on dinghai, because of prolonged rain, Left Chancellor and Duke of Xu Chen Xilie was made Grand Preceptor of the Heir Apparent and removed from governing affairs;',
    idiomatic:
      'In the eighth month endless rain cost Chen Xilie the chancellorship for the grand preceptorship of the heir;',
  },
  s0431: {
    literal:
      'Vice Minister of Culture Wei Jiansu was made Minister of War and Grand Councillor of the State Secretariat and Chancellery.',
    idiomatic:
      'Wei Jiansu became war minister and grand councillor.',
  },
  s0432: {
    literal:
      'That autumn rain lasted more than sixty days; city walls and houses in the capital were nearly all ruined, prices soared, and many lacked food. One million shi of grain were taken from the great storehouse and ten markets opened to sell cheap grain to the poor.',
    idiomatic:
      'Rain for sixty days wrecked the capital; grain was released from the great storehouse and sold cheap at ten markets.',
  },
  s0433: {
    literal:
      'The Luo and Chan rivers at the eastern capital rose violently and drowned nineteen wards.',
    idiomatic:
      'At Luoyang the Luo and Chan floods swallowed nineteen wards.',
  },
  s0434: {
    literal:
      'The emperor, at the Hall of Diligent Government, tested candidates of the four examination categories; to the policy questions were added one poem and one rhapsody each.',
    idiomatic:
      'At the Hall of Diligent Government he tested the four examination categories, adding a poem and rhapsody to the policy questions.',
  },
  s0435: {
    literal:
      'Adding poem and rhapsody to the policy examination began from this time.',
    idiomatic:
      'From this year the policy examination required poem and rhapsody.',
  },
  s0436: {
    literal:
      'In winter, the tenth month on renyin, he visited Huaqing Palace.',
    idiomatic:
      'In the tenth month he went to Huaqing Palace.',
  },
  s0437: {
    literal:
      'Hedong prefect Wei Zhi was demoted to Guiling district magistrate and Vice Minister of War Ji Wen to chief of Liyang commandery.',
    idiomatic:
      'Wei Zhi of Hedong was demoted to Guiling and Ji Wen to Liyang chief.',
  },
  s0438: {
    literal:
      'On yisi, Defender of the State Dou Fen of Bi died.',
    idiomatic:
      'On yisi Dou Fen, defender of Bi, died.',
  },
  s0439: {
    literal:
      'On wuwu he returned to the capital.',
    idiomatic:
      'On wuwu he returned to Chang\'an.',
  },
  s0440: {
    literal:
      'That year the Ministry of Revenue reckoned households and population under current administration: in all three hundred twenty-one prefectures, one thousand five hundred thirty-eight counties, and sixteen thousand eight hundred twenty-nine townships;',
    idiomatic:
      'That year the revenue ministry counted the realm: three hundred twenty-one prefectures, fifteen hundred thirty-eight counties, sixteen thousand eight hundred twenty-nine townships;',
  },
  s0441: {
    literal:
      'nine million six hundred nineteen thousand two hundred fifty-four households, of which three million eight hundred eighty-six thousand five hundred four owed no tax and five million three hundred one thousand forty-four owed tax;',
    idiomatic:
      'nine million six hundred nineteen thousand households—three million eight hundred eighty-six thousand tax-exempt and five million three hundred one thousand taxable;',
  },
  s0442: {
    literal:
      'fifty-two million eight hundred eighty thousand four hundred eighty-eight persons, of whom forty-two million five hundred twenty-one thousand eight hundred eighty owed no tax and seven million six hundred sixty-two thousand eight hundred owed tax.',
    idiomatic:
      'fifty-two million eight hundred eighty thousand persons—forty-two million five hundred twenty-one thousand tax-exempt and seven million six hundred sixty-two thousand taxable.',
  },
  s0443: {
    literal:
      'In spring of the third month of Tianbao 14, on bingyin, he feasted the ministers at the Hall of Diligent Government, performing the Nine Department Music; the emperor composed a poem in the Bowang Liang style.',
    idiomatic:
      'Tianbao 14, third month: he feasted ministers at the Hall of Diligent Government to the Nine Department Music and wrote a Bowang Liang poem.',
  },
  s0444: {
    literal:
      'On guiwei he dispatched Supervising Secretary Pei Shiyan and others to tour and comfort Henan, Hebei, Huainan, and other circuits.',
    idiomatic:
      'On guiwei Pei Shiyan and others were sent to inspect Henan, Hebei, Huainan, and neighboring circuits.',
  },
  s0445: {
    literal:
      'In the eighth month on renchen the emperor personally reviewed prisoners.',
    idiomatic:
      'In the eighth month he reviewed prisoners in person.',
  },
  s0446: {
    literal:
      'In winter, the tenth month on renchen, he visited Huaqing Palace.',
    idiomatic:
      'In the tenth month he went again to Huaqing.',
  },
  s0447: {
    literal:
      'On jiawu he promulgated the Emperor\'s Annotated Laozi and its Exegesis throughout the realm.',
    idiomatic:
      'On jiawu his annotated Laozi and commentary went empire-wide.',
  },
  s0448: {
    literal:
      'On wuwu, the first day of the eleventh month, Shining Peace prefect Luo Xiyi was executed for having Zhang Boji beaten to death while detained; Ji Wen hanged himself in prison.',
    idiomatic:
      'In the eleventh month Luo Xiyi was executed for beating Zhang Boji to death in custody, and Ji Wen hanged himself in prison.',
  },
  s0449: {
    literal:
      'On bingyin, Military Commissioner of Fanyang An Lushan led more than one hundred thousand barbarian and Chinese troops south toward the capital under the pretext of executing Yang Guozhong, first killing Taiyuan governor Yang Guangxu at Boling commandery.',
    idiomatic:
      'On bingyin An Lushan marched south from Youzhou with a hundred thousand men to “execute Yang Guozhong,” killing Yang Guangxu at Boling.',
  },
  s0450: {
    literal:
      'On renshen word reached the mobile court.',
    idiomatic:
      'On renshen the court learned of the rebellion.',
  },
  s0451: {
    literal:
      'On guiyou Guo Ziyi was made governor of Lingwu and Military Commissioner of Shuofang.',
    idiomatic:
      'On guiyou Guo Ziyi became Lingwu governor and Shuofang commissioner.',
  },
  s0452: {
    literal:
      'Feng Changqing came from Anxi to report and reached the mobile court.',
    idiomatic:
      'Feng Changqing arrived from Anxi at the traveling court.',
  },
  s0453: {
    literal:
      'On jiaxu Changqing was made Military Commissioner of Fanyang and Pinglu and concurrent Censor-in-Chief, ordered to raise thirty thousand troops to resist the rebel barbarians.',
    idiomatic:
      'On jiaxu Feng Changqing received Fanyang and Pinglu and orders to raise thirty thousand men against the rebels.',
  },
  s0454: {
    literal:
      'On wuyin he returned to the capital.',
    idiomatic:
      'On wuyin he returned to Chang\'an.',
  },
  s0455: {
    literal:
      'Feathered Forest Grand General Wang Chengye was made Taiyuan governor; Court of the Imperial Stud Director Zhang Jieran was made Chenliu prefect and Henan investigative commissioner; Golden Crow General Cheng Qianli was made chief of Lu prefecture—all ordered to attack the rebels.',
    idiomatic:
      'Wang Chengye became Taiyuan governor, Zhang Jieran Chenliu prefect and Henan commissioner, and Cheng Qianli chief of Lu—all to fight the rebels.',
  },
  s0456: {
    literal:
      'On jiashen Prince Rong Wang Wan was made commander-in-chief, Gao Xianzhi his deputy; troops were recruited in the capital under the name Heavenly Martial Army, numbering one hundred thousand.',
    idiomatic:
      'On jiashen Prince Rong Wang Wan commanded, with Gao Xianzhi as deputy, and a hundred thousand men were raised as the Heavenly Martial Army.',
  },
  s0457: {
    literal:
      'On bingxu Gao Xianzhi and others advanced; the emperor, at the Hall of Diligent Government, saw them off.',
    idiomatic:
      'On bingxu Gao Xianzhi marched out while the emperor saw him off from the Hall of Diligent Government.',
  },
  s0458: {
    literal:
      'On bingxu, the first day of the twelfth month, Lushan crossed the Yellow River at Lingchang commandery.',
    idiomatic:
      'On the first day of the twelfth month Lushan crossed the Yellow River at Lingchang.',
  },
  s0459: {
    literal:
      'On xinmao he took Chenliu commandery and killed Zhang Jieran.',
    idiomatic:
      'On xinmao he seized Chenliu and killed Zhang Jieran.',
  },
  s0460: {
    literal:
      'On jiawu he took Xingyang commandery and killed prefect Cui Wubi.',
    idiomatic:
      'On jiawu he took Xingyang and killed Cui Wubi.',
  },
  s0461: {
    literal:
      'On bingshen Feng Changqing fought the rebels at Yingzi Valley in Chenggao; the government army was defeated and Changqing fled to Shan commandery.',
    idiomatic:
      'On bingshen Feng Changqing was beaten at Yingzi Valley and fled to Shan.',
  },
  s0462: {
    literal:
      'On dingyou Lushan took the eastern capital and killed acting governor Li Ting, Censor-in-Chief Lu Yi, and aide Jiang Qing.',
    idiomatic:
      'On dingyou Lushan took Luoyang and killed Li Ting, Lu Yi, and Jiang Qing.',
  },
  s0463: {
    literal:
      'At the time Gao Xianzhi held Shan commandery, abandoned the city, and withdrew west to guard Tong Pass.',
    idiomatic:
      'Gao Xianzhi abandoned Shan and fell back to Tong Pass.',
  },
  s0464: {
    literal:
      'Changshan prefect Yan Gaoqing, with chief clerk Yuan Lvqian, Jia Shen, and others, killed the rebel general Li Qintou and sent the rebel generals He Qiannian and Gao Miao to the capital.',
    idiomatic:
      'Yan Gaoqing of Changshan killed Li Qintou and sent He Qiannian and Gao Miao captive to Chang\'an.',
  },
  s0465: {
    literal:
      'On xinchou an edict ordered the Crown Prince to command troops eastward to attack.',
    idiomatic:
      'On xinchou the crown prince was ordered east with the army.',
  },
  s0466: {
    literal:
      'Prince Yong Wang Lin was made Military Commissioner of Shannan, with Jiangling chief Yuan Wei as deputy;',
    idiomatic:
      'Prince Yong Lin became Shannan commissioner with Yuan Wei as deputy;',
  },
  s0467: {
    literal:
      'Prince Ying Wang Hui was made Military Commissioner of Sword South, with Shu commandery chief Cui Yuan as deputy.',
    idiomatic:
      'Prince Ying Hui became Sword South commissioner with Cui Yuan as deputy.',
  },
  s0468: {
    literal:
      'Neither prince left the palace.',
    idiomatic:
      'Both princes remained at court without taking up their commands.',
  },
  s0469: {
    literal:
      'On bingwu Feng Changqing and Gao Xianzhi were beheaded at Tong Pass; Ge Shuhan was made Vanguard Commander of the Heir Apparent\'s Army and led the Hexi and Longyou levies to hold Tong Pass against the enemy.',
    idiomatic:
      'On bingwu Feng Changqing and Gao Xianzhi were executed at Tong Pass and Ge Shuhan took command of the western armies to hold the pass.',
  },
  s0470: {
    literal:
      'On xinhai Prince Rong Wang Wan died and was posthumously ennobled as the Respectful and Reverent Crown Prince.',
    idiomatic:
      'On xinhai Prince Rong Wang Wan died and was given the posthumous title Respectful and Reverent Crown Prince.',
  },
  s0471: {
    literal:
      'In spring of the first month of Tianbao 15, on yimao, he received court at the Hall of Propagating Governance.',
    idiomatic:
      'Tianbao 15 opened with court at the Hall of Propagating Governance on yimao.',
  },
  s0472: {
    literal:
      'That day Lushan usurped the title at the eastern capital.',
    idiomatic:
      'That day Lushan declared himself emperor at Luoyang.',
  },
  s0473: {
    literal:
      'On gengshen Li Guangbi was made governor of Yunzhong and Military Commissioner of Hedong.',
    idiomatic:
      'On gengshen Li Guangbi became Yunzhong governor and Hedong commissioner.',
  },
  s0474: {
    literal:
      'On renxu the rebel general Cai Xide took Changshan commandery, seized prefect Yan Gaoqing and chief clerk Yuan Lvqian, and killed more than ten thousand clerks and people—the city ran with blood.',
    idiomatic:
      'On renxu Cai Xide took Changshan, seized Yan Gaoqing and Yuan Lvqian, and slaughtered ten thousand people.',
  },
  s0475: {
    literal:
      'On jiazi Ge Shuhan was promoted Left Vice Director of the Department of State Affairs and Grand Councillor of the State Secretariat and Chancellery.',
    idiomatic:
      'On jiazi Ge Shuhan became left vice director and grand councillor.',
  },
  s0476: {
    literal:
      'On yichou the rebel general An Qingxu attacked Tong Pass; Ge Shuhan drove him back.',
    idiomatic:
      'On yichou An Qingxu attacked Tong Pass and Ge Shuhan repulsed him.',
  },
  s0477: {
    literal:
      'On yisi Plain prefect Yan Zhenqing was made Vice Minister of Revenue in reward for holding the city.',
    idiomatic:
      'On yisi Yan Zhenqing of Pingyuan was made vice minister of revenue for his defense.',
  },
  s0478: {
    literal:
      'In the second month on bingxu Li Guangbi and Guo Ziyi led troops east through Jingxing Pass and fought the rebel general Shi Siming, routing him and recovering more than ten commanderies and counties.',
    idiomatic:
      'In the second month Li Guangbi and Guo Ziyi broke Shi Siming at Jingxing and recovered a dozen districts.',
  },
  s0479: {
    literal:
      'On bingchen Minister of Works An Sishun was executed.',
    idiomatic:
      'On bingchen An Sishun was put to death.',
  },
  s0480: {
    literal:
      'On renwu, the first day of the third month, Hedong Military Commissioner Li Guangbi was made Censor-in-Chief and Military Commissioner of Fanyang.',
    idiomatic:
      'On the third-month new moon Li Guangbi became censor-in-chief and Fanyang commissioner.',
  },
  s0481: {
    literal:
      'On yiyou Plain prefect Yan Zhenqing was made Hebei investigative commissioner.',
    idiomatic:
      'On yiyou Yan Zhenqing became Hebei investigative commissioner.',
  },
  s0482: {
    literal:
      'On jihai Changshan commandery was renamed Pingshan commandery, Fangshan county Pingshan county, Luquan county Huolu county, and Lucheng county Shulu county.',
    idiomatic:
      'On jihai several placenames in the Hebei theater were renamed.',
  },
  s0483: {
    literal:
      'In summer, the fourth month on bingwu, Instructor Lai Tian was made Yingchuan prefect and Pacification Commissioner.',
    idiomatic:
      'In the fourth month Lai Tian became Yingchuan prefect and pacification commissioner.',
  },
  s0484: {
    literal:
      'In the fifth month on wuwu Nanyang prefect Lu Jiong fought the rebel general Wu Linggui on the Zhi River; the government army was utterly defeated, Lu Jiong was captured by the rebels, and they advanced to threaten our Nanyang.',
    idiomatic:
      'In the fifth month Lu Jiong was crushed on the Zhi River, captured, and the rebels pressed Nanyang.',
  },
  s0485: {
    literal:
      'An edict ordered Acting Prince of Guo Ju to lead troops from Lantian to relieve Nanyang.',
    idiomatic:
      'The heir of Guo was ordered out from Lantian to save Nanyang.',
  },
  s0486: {
    literal:
      'On guiwei, the first day of the sixth month, Yan Zhenqing defeated the rebel general Yuan Zhita at Tangyi; Beihai prefect He Lan Jinming recovered Xindu.',
    idiomatic:
      'On guiwei Yan Zhenqing beat Yuan Zhita at Tangyi and He Lan Jinming took Xindu.',
  },
  s0487: {
    literal:
      'On gengyin Ge Shuhan led eighty thousand men to fight the rebel general Cui Qianyou on the western plain of Lingbao; the government army was utterly defeated, six or seven in ten dying.',
    idiomatic:
      'On gengyin Ge Shuhan lost eighty thousand men on the Lingbao plain—six or seven in ten dead.',
  },
  s0488: {
    literal:
      'That day Li Guangbi fought the rebel general Shi Siming at Jia Mountain east of Changshan and routed him, beheading and capturing tens of thousands.',
    idiomatic:
      'That day Li Guangbi shattered Shi Siming east of Changshan and took tens of thousands of heads.',
  },
  s0489: {
    literal:
      'On xinmao Ge Shuhan reached Tong Pass and was seized by his subordinate Huoba Guiren with several dozen horsemen and surrendered to the rebels; the pass was not held, the capital was greatly alarmed, and Hedong, Huayin, Shangluo, and other commanderies all abandoned their cities and fled.',
    idiomatic:
      'On xinmao Huoba Guiren seized Ge Shuhan at Tong Pass and surrendered; the pass fell, the capital panicked, and the eastern provinces emptied.',
  },
  s0490: {
    literal:
      'On jiawu, about to flee to Shu, he issued an edict for a personal campaign; when the imperial guard formed up, scholars and commoners were terrified and fled along the roads.',
    idiomatic:
      'On jiawu he proclaimed a personal campaign for Shu; the crowd broke in terror along the roads.',
  },
  s0491: {
    literal:
      'On yimao, in the early morning he went out through Yanqiu Gate; a light rain dampened them. Only Chancellor Yang Guozhong, Wei Jiansu, the eunuch Gao Lishi, the crown prince, imperial princes, consorts, princesses, and imperial grandsons followed—many could not keep up.',
    idiomatic:
      'Before dawn on yimao he slipped out Yanqiu Gate in drizzle with only Guozhong, Jiansu, Lishi, the heir, and a handful of kin—most of the court left behind.',
  },
  s0492: {
    literal:
      'At daybreak they crossed Bian Bridge; Guozhong wished to cut the bridge.',
    idiomatic:
      'At daybreak they reached Bian Bridge; Guozhong wanted it destroyed.',
  },
  s0493: {
    literal:
      'The emperor said, “How can those who come after cross?”',
    idiomatic:
      'The emperor said, “What of those who come after?”',
  },
  s0494: {
    literal:
      'He ordered it left intact.',
    idiomatic:
      'He ordered the bridge spared.',
  },
  s0495: {
    literal:
      'At chen hour they halted at Wangxian post station in Xianyang; officials had scattered and there were no stores prepared.',
    idiomatic:
      'By midmorning they reached Wangxian post in Xianyang; officials had fled and no food was ready.',
  },
  s0496: {
    literal:
      'The emperor rested under the trees by the palace gate; noon passed and he had not eaten.',
    idiomatic:
      'He sat under the palace gate trees past noon without a meal.',
  },
  s0497: {
    literal:
      'Presently an old man brought gruel; the emperor asked him, “How may we get rice?”',
    idiomatic:
      'An old man brought gruel; the emperor asked how they might be fed.',
  },
  s0498: {
    literal:
      'Thereupon the people brought food in succession.',
    idiomatic:
      'Then the people brought food one after another.',
  },
  s0499: {
    literal:
      'Soon the imperial kitchen brought the imperial meal; the emperor distributed it to his followers and then ate.',
    idiomatic:
      'Soon the imperial kitchen arrived; he fed his followers before himself.',
  },
  s0500: {
    literal:
      'That evening they halted at Jincheng county; officials had fled. He ordered Wei Fangjin\'s son Yun to summon them; presently monks of Zhizang Temple brought fodder and grain, and the entourage was finally supplied.',
    idiomatic:
      'That night at Jincheng the magistrates were gone until Yun of the Wei clan and Zhizang monks brought grain for the starving column.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/009.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 500;

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
