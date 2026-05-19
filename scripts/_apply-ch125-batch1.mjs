#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0002: [
    'Qifu Guoren',
    'Qifu Guoren (Western Qin)',
  ],
  s0003: [
    'Qifu Guoren was a Xianbei man of Longxi.',
    'Qifu Guoren was a Xianbei of Longxi.',
  ],
  s0004: [
    'In antiquity the three divisions of Rufusi, Chulian, and Chilu came south from the northern deserts beyond the Great Yin Mountains; on the road they met a huge creature, shaped like a divine tortoise and as large as a tomb-mound; they killed a horse to sacrifice to it and prayed: "If you are a good spirit, then open the way;',
    'Long ago the Rufusi, Chulian, and Chilu clans marched south from the northern wastes beyond the Great Yin Mountains. On the road they met a colossal beast shaped like a sacred tortoise, as large as a tomb mound. They slaughtered a horse as an offering and prayed: "If you are a benevolent spirit, clear our path;',
  ],
  s0005: [
    'if an evil spirit, then block it so we cannot pass."',
    'if you are malign, bar the way and let us go no farther."',
  ],
  s0006: [
    '" In a moment it vanished, and there was a small child there.',
    'A moment later the creature was gone, and a small child stood there.',
  ],
  s0007: [
    'At that time there was also in the Qifu division an old man without a son who asked to adopt and raise him; the multitude all consented.',
    'An old man of the Qifu clan who had no son asked to adopt the child, and the assembly agreed.',
  ],
  s0008: [
    'The old man gladly felt he now had something to rely on and gave him the childhood name Hegan.',
    'The old man rejoiced that he had gained a support and gave the boy the childhood name Hegan.',
  ],
  s0009: [
    'Hegan means "to lean upon" in the Xia language.',
    'Hegan means "to lean upon" in the Xia tongue.',
  ],
  s0010: [
    'At age ten he was fierce and brave, skilled at riding and shooting, and could draw a bow of five hundred jin.',
    'At ten he was already fierce in battle, expert at horsemanship and archery, and could bend a bow rated at five hundred jin.',
  ],
  s0011: [
    'The four divisions submitted to his martial prowess and made him their chief, styling him Qifu Khan Tuoduo Mohe.',
    'All four divisions bowed to his valor and raised him as chief, styling him Qifu Khan Tuoduo Mohe.',
  ],
  s0012: [
    'Tuoduo means a title neither of god nor of man.',
    'Tuoduo denotes a title that is neither divine nor human.',
  ],
  s0013: [
    'Later there was Youlin, who was Guoren\'s fifth-generation ancestor.',
    'Later came Youlin, Guoren\'s fifth-generation forebear.',
  ],
  s0014: [
    'At the beginning of the Taishi era he led five thousand households to migrate to Xiayuan; the division gradually grew stronger.',
    'In the opening years of Taishi he led five thousand households into Xiayuan, and the clan steadily grew in strength.',
  ],
  s0015: [
    'The Xianbei chief Lujie, with more than seventy thousand households, encamped on the Gaoping River and with Youlin attacked one another in turn.',
    'The Xianbei leader Lujie, commanding more than seventy thousand households, camped on the Gaoping River and traded blows with Youlin.',
  ],
  s0016: [
    'Lujie was defeated and fled south to Lueyang; Youlin absorbed all his followers and held firm on the Gaoping River.',
    'Lujie was beaten and fled south to Lueyang; Youlin absorbed his entire following and entrenched himself on the Gaoping River.',
  ],
  s0017: [
    'Youlin died and his son Jiequan succeeded, moving the seat to Qiantun.',
    'When Youlin died his son Jiequan succeeded him and moved the seat to Qiantun.',
  ],
  s0018: [
    'Jiequan died and his son Lina succeeded; he attacked the Xianbei chief Tulai at Wushu Mountain, campaigned against Yuchi Kequan at the Dafei River, and gathered more than thirty thousand households.',
    'Jiequan died and his son Lina took the throne. Lina struck the Xianbei chief Tulai at Wushu Mountain, campaigned against Yuchi Kequan on the Dafei River, and mustered more than thirty thousand households.',
  ],
  s0019: [
    'Lina died and his younger brother Qimo succeeded.',
    'When Lina died his younger brother Qimo succeeded.',
  ],
  s0020: [
    'Qimo died and Lina\'s son Shuyan succeeded.',
    'When Qimo died, Lina\'s son Shuyan took the throne.',
  ],
  s0021: [
    'He campaigned against the Xianbei chief Mohou at Yuanchuan, routed him utterly, received the submission of more than twenty thousand of his households, and settled firmly at Yuanchuan.',
    'Shuyan campaigned against the Xianbei chief Mohou at Yuanchuan, crushed him, accepted the surrender of more than twenty thousand households, and made Yuanchuan his base.',
  ],
  s0022: [
    'He made his uncle Kemo tutor, entrusted him with state affairs, appointed Siyin Wuqi Left Assistant General to garrison Caiyuanchuan, Chulian Gaohu Right Assistant General to garrison Zhibianchuan, and Chilu Nahua General Who Leads Righteousness to garrison Qiantun Mountain.',
    'He named his uncle Kemo tutor and entrusted him with government, made Siyin Wuqi Left Assistant General with a garrison at Caiyuanchuan, Chulian Gaohu Right Assistant General at Zhibianchuan, and Chilu Nahua General Who Leads Righteousness at Qiantun Mountain.',
  ],
  s0023: [
    'Shuyan died and his son Lu Dahan succeeded.',
    'When Shuyan died his son Lu Dahan succeeded.',
  ],
  s0024: [
    'When Shi Le destroyed Liu Yao, Lu Dahan, in fear, moved to the Mai Field and Wugu Mountains.',
    'When Shi Le destroyed Liu Yao, Lu Dahan, alarmed, relocated to the Mai Field and Wugu Mountains.',
  ],
  s0025: [
    'Dahan died and his son Sifan succeeded; he first moved the seat to Dujian Mountain.',
    'Dahan died and his son Sifan succeeded, first moving the seat to Dujian Mountain.',
  ],
  s0026: [
    'Before long he was attacked by Fu Jian\'s general Wang Tong; his followers rebelled and surrendered to Tong.',
    'Soon afterward Fu Jian\'s general Wang Tong struck him; his followers defected and surrendered to Tong.',
  ],
  s0027: [
    'Sifan sighed and said to those beside him: "Wisdom cannot withstand the enemy, virtue cannot comfort the masses; before swords and horsemen had met, the root was already broken. Seeing the host scattered, the situation is hard to preserve intact.',
    'Sifan sighed to his attendants: "Wisdom cannot match the foe, virtue cannot hold the host together—before blade met blade our foundation was lost. With the army scattered, how can we survive intact?',
  ],
  s0028: [
    'If I flee to the other divisions they surely will not receive me; I shall adopt the plan of Huhanxie."',
    'If I flee to the other clans they will not shelter me. I must take Huhanxie\'s course."',
  ],
  s0029: [
    '" Thereupon he went to Tong and surrendered to Fu Jian.',
    'He went to Tong and submitted to Fu Jian.',
  ],
  s0030: [
    'Fu Jian was greatly pleased, appointed him Southern Chanyu, and kept him at Chang\'an.',
    'Fu Jian was greatly pleased, named him Southern Chanyu, and detained him at Chang\'an.',
  ],
  s0031: [
    'He made Sifan\'s uncle Tulei Warrior Protector General to pacify his tribal following.',
    'He appointed Sifan\'s uncle Tulei Warrior Protector General to pacify the tribal following.',
  ],
  s0032: [
    'Before long the Xianbei chief Bo Han invaded and pressed Longyou; Fu Jian made Sifan Bearer of the Staff, Commander-in-Chief for Campaigns against the Western Hu, and General Who Pacifies the West to campaign against him.',
    'Soon the Xianbei chief Bo Han raided Longyou. Fu Jian made Sifan Bearer of the Staff, Commander-in-Chief for Campaigns against the Western Hu, and General Who Pacifies the West to subdue him.',
  ],
  s0033: [
    'Bo Han, in fear, requested surrender; Sifan then garrisoned Warrior River and was very effective in authority and kindness.',
    'Bo Han, terrified, sued for peace. Sifan garrisoned Warrior River and ruled with stern authority and generous kindness.',
  ],
  s0034: [
    'When Sifan died, Guoren replaced him in the garrison; when Fu Jian launched the Shouchun campaign, Guoren was summoned as Forward General and led the vanguard cavalry.',
    'After Sifan\'s death Guoren took his garrison. When Fu Jian marched on Shouchun, Guoren was summoned as Forward General to lead the vanguard horse.',
  ],
  s0035: [
    'At that time Guoren\'s uncle Bufei rebelled in Longxi; Fu Jian sent Guoren back to suppress him.',
    'Guoren\'s uncle Bufei rebelled in Longxi, and Fu Jian sent Guoren back to crush the revolt.',
  ],
  s0036: [
    'Bufei heard this and was greatly pleased; he welcomed Guoren on the road.',
    'Bufei heard the news with delight and went out to welcome Guoren on the road.',
  ],
  s0037: [
    'Guoren set out wine for a grand gathering, rolled up his sleeves, and spoke loudly: "The Fu clan, riding on the chaos of Zhao and Shi, then presumptuously seized titles, exhausted the armies to the utmost in warfare, and usurped authority across eight provinces.',
    'Guoren held a feast, rolled up his sleeves, and declared: "The Fu seized their chance in the chaos of Later Zhao, usurped the throne, exhausted every army, and claimed eight provinces by force.',
  ],
  s0038: [
    'Now that the realm is settled they ought to soothe it with virtue; instead they hollow out their prestige, strain after distant schemes, disturb the common people, wear out the Middle Kingdom, defy Heaven and anger men—how can they succeed!',
    'The realm is pacified, yet they rule by terror instead of virtue, hollow out their prestige, and harass the people until the heartland groans—defying Heaven and enraging men. How can such a house endure?',
  ],
  s0039: [
    'Moreover, when things reach their extreme they decline; when misfortune is full it overturns—such is Heaven\'s way.',
    'When fortune peaks it turns; when calamity fills the cup it spills—that is Heaven\'s way.',
  ],
  s0040: [
    'By my reckoning, in this campaign escape will be hard.',
    'By my reckoning they cannot escape defeat in this campaign.',
  ],
  s0041: [
    'I shall with you all accomplish a regional enterprise."',
    'Let us together build a realm of our own."',
  ],
  s0042: [
    'When Fu Jian returned defeated, Guoren then summoned the various divisions; those who would not submit he campaigned against and absorbed, until his host reached more than a hundred thousand.',
    'When Fu Jian fled home in defeat, Guoren rallied the clans, subdued those who held back, and swelled his host to more than a hundred thousand.',
  ],
  s0043: [
    'When Fu Jian was killed by Yao Chang, Guoren said to his tribal chiefs: "The Fu clan, with the stature of transcending the age, was trapped by a mob gathering—one may call this Heaven\'s doing.',
    'When Yao Chang killed Fu Jian, Guoren told his chiefs: "The Fu stood above their age yet fell to a rabble—surely Heaven decreed it.',
  ],
  s0044: [
    'To cling to the constant and miss the turning of fortune—men of foresight are ashamed of it;',
    'To cling to routine when fortune turns is shameful to the wise;',
  ],
  s0045: [
    'to see the moment and act is the deed of heroes.',
    'to seize the moment is the mark of heroes.',
  ],
  s0046: [
    'Though my virtue is slight, relying on the resources of many generations, how can I watch fortune arrive and not act!"',
    'My virtue is slight, but generations of strength lie behind me—how can I watch fortune arrive and do nothing!"',
  ],
  s0047: [
    'He took the reign title of Emperor Xiaowu for himself, styled himself Grand Commander, Grand General, and Grand Chanyu, and held the governorships of Qin and He provinces; his era name was Jianyi.',
    'He styled himself Grand Commander, Grand General, and Grand Chanyu, took the reign title of Emperor Xiaowu, governed Qin and He provinces, and proclaimed the era Jianyi.',
  ],
  s0048: [
    'He made his generals Yizhan Yinyi Left Chancellor, Wuyin Chuzhi Right Chancellor, Dugu Piti Left Assistant, Wuqun Yongshi Right Assistant, and his younger brother Gangui General-in-Chief; the rest received appointments in varying grades.',
    'He named Yizhan Yinyi Left Chancellor, Wuyin Chuzhi Right Chancellor, Dugu Piti Left Assistant, Wuqun Yongshi Right Assistant, and his younger brother Gangui General-in-Chief; the remainder received ranks as merit allowed.',
  ],
  s0049: [
    'He established twelve commanderies—Wucheng, Wuyang, Angu, Wushi, Hanyang, Tianshui, Lueyang, Qiangchuan, Gansong, Kuangpeng, Baima, and Yuanchuan—and built Warrior City to dwell in.',
    'He carved out twelve commanderies—Wucheng, Wuyang, Angu, Wushi, Hanyang, Tianshui, Lueyang, Qiangchuan, Gansong, Kuangpeng, Baima, and Yuanchuan—and built Warrior City as his capital.',
  ],
  s0050: [
    'The Xianbei chief Pilan led five thousand followers to surrender.',
    'The Xianbei chief Pilan surrendered with five thousand followers.',
  ],
  s0051: [
    'The next year the Nan\'an leader Miyi and various Qiang and Di raiders attacked Guoren, coming from all four sides.',
    'The next year Miyi of Nan\'an and allied Qiang and Di forces struck Guoren from every quarter.',
  ],
  s0052: [
    'Guoren said to his generals: "Our forebears had the heart to seize from others; we cannot sit and wait for them to arrive.',
    'Guoren told his generals: "Our forebears seized the initiative; we must not wait for the enemy to reach us.',
  ],
  s0053: [
    'We should lower our pride to bait the enemy, show a weakened force to inflate their confidence—what the military codes call making the foe angry at us while they grow slack."',
    'Lower your banners to bait them, parade a weakened host to swell their pride—that is what the manuals call angering ourselves to slacken the foe."',
  ],
  s0054: [
    '" Thereupon he marshaled five thousand men, struck where they did not expect, and routed them utterly.',
    'He mustered five thousand men, struck where they did not expect, and routed them completely.',
  ],
  s0055: [
    'Miyi fled back to Nan\'an; soon he and his younger brother Mohouti led more than thirty thousand households to surrender to Guoren, and each was appointed general and inspector.',
    'Miyi fled to Nan\'an; soon he and his brother Mohouti surrendered with more than thirty thousand households, and Guoren named each a general and inspector.',
  ],
  s0056: [
    'Fu Deng sent envoys to appoint Guoren Bearer of the Staff, Grand Commander, Commander-in-Chief of the Various Yi, Grand General, Grand Chanyu, and Prince of Yuanchuan.',
    'Fu Deng sent envoys appointing Guoren Bearer of the Staff, Grand Commander, Commander-in-Chief of the Various Yi, Grand General, Grand Chanyu, and Prince of Yuanchuan.',
  ],
  s0057: [
    'Guoren led thirty thousand horsemen to strike the Xianbei great chiefs Migui, Yugou, and Tilun and their three divisions at Liuquan.',
    'Guoren led thirty thousand horse against the Xianbei chiefs Migui, Yugou, and Tilun and their three divisions at Liuquan.',
  ],
  s0058: [
    'The Gaoping Xianbei chief Moyu and the Eastern Hu chief Jin Xi joined forces to attack; they met at Kehun River, fought a great battle, defeated them, beheaded three thousand, and captured five thousand horses.',
    'The Gaoping Xianbei Moyu and the Eastern Hu Jin Xi joined forces to attack. At Kehun River Guoren met them in battle, crushed them, took three thousand heads, and seized five thousand horses.',
  ],
  s0059: [
    'Moyu and Jin Xi fled back; the three divisions were terrified and led their masses to come and surrender.',
    'Moyu and Jin Xi fled; the three divisions, terrified, came in submission.',
  ],
  s0060: [
    'He appointed Migui General Who Establishes Righteousness and Marquis of Liuquan, Yugou General Who Establishes Loyalty and Marquis of Lanquan, and Tilun General Who Establishes Integrity and Marquis of Mingquan.',
    'He named Migui General Who Establishes Righteousness and Marquis of Liuquan, Yugou General Who Establishes Loyalty and Marquis of Lanquan, and Tilun General Who Establishes Integrity and Marquis of Mingquan.',
  ],
  s0061: [
    'Guoren\'s General Who Establishes Prestige Chilu Wugu Ba led his followers in rebellion and held Qiantun Mountain.',
    'Guoren\'s General Who Establishes Prestige, Chilu Wugu Ba, rebelled with his following and held Qiantun Mountain.',
  ],
  s0062: [
    'Guoren led seven thousand horsemen to campaign against him, beheaded his divisional officer Chiluo Hou, and more than a thousand households surrendered.',
    'Guoren led seven thousand horse against him, slew his officer Chiluo Hou, and won the surrender of more than a thousand households.',
  ],
  s0063: [
    'Ba was greatly afraid and then surrendered; Guoren restored his office and rank.',
    'Terrified, Ba submitted; Guoren restored his titles.',
  ],
  s0064: [
    'He then campaigned against the Xianbei chief Yuezhi Chilu at Pingxiang, routed him utterly, captured his son Jiegui, his younger brother\'s son Fuban, and more than five thousand of the tribe, and returned.',
    'He then struck the Xianbei chief Yuezhi Chilu at Pingxiang, crushed him, took his son Jiegui, his nephew Fuban, and more than five thousand of the tribe, and returned.',
  ],
  s0065: [
    ', Guoren died; he had ruled four years; his posthumous title was King Xuanlie; his temple name was Liezu.',
    'Guoren died after four years on the throne. His posthumous title was King Xuanlie; his temple name was Liezu.',
  ],
  s0066: [
    'Qifu Gangui',
    'Qifu Gangui (Gangui)',
  ],
  s0067: [
    'Gangui was Guoren\'s younger brother.',
    'Gangui, Guoren\'s younger brother.',
  ],
  s0068: [
    'Heroic and martial, a brilliant man, deep and refined in bearing with great magnanimity.',
    'He was heroic and brilliant, reserved in manner and broad in judgment.',
  ],
  s0069: [
    'At Guoren\'s death his ministers all considered Guoren\'s son Gongfu too young in years; they ought to establish an elder lord, and so they pushed Gangui to be Grand Commander, Grand General, Grand Chanyu, and Prince of Henan; he granted amnesty within his borders and changed the era name to Taichu.',
    'When Guoren died his ministers judged his son Gongfu too young and raised Gangui as Grand Commander, Grand General, Grand Chanyu, and Prince of Henan. He proclaimed an amnesty and adopted the era Taichu.',
  ],
  s0070: [
    'He made his wife the Lady Bian queen, appointed Chulian Qidu Chancellor, and made the General Who Pacifies the South and Governor of Southern Liangzhou Tijuan Censor-in-Chief; the rest received enfeoffments and appointments in varying grades.',
    'He made Lady Bian his queen, named Chulian Qidu Chancellor, and appointed General Who Pacifies the South and Governor of Southern Liang Tijuan Censor-in-Chief; the rest received titles as rank allowed.',
  ],
  s0071: [
    'He then moved the capital to Jincheng.',
    'He then moved the seat to Jincheng.',
  ],
  s0072: [
    ', Fu Deng sent envoys to appoint Gangui Grand General, Grand Chanyu, and Prince of Jincheng.',
    'Fu Deng sent envoys appointing Gangui Grand General, Grand Chanyu, and Prince of Jincheng.',
  ],
  s0073: [
    'The Southern Qiang chief Duru led seven thousand followers to surrender to him.',
    'The Southern Qiang chief Duru surrendered with seven thousand followers.',
  ],
  s0074: [
    'The Xiuguan divisions of Adun and Hounian, each with more than five thousand households, held Qiantun Mountain and harried his borders.',
    'The Xiuguan clans of Adun and Hounian, each numbering more than five thousand households, held Qiantun Mountain and plagued his frontier.',
  ],
  s0075: [
    'Gangui campaigned against and defeated them, wholly receiving the submission of their masses; his renown then shook the borderlands.',
    'Gangui crushed them and accepted the surrender of their entire following; his fame then resounded along the frontier.',
  ],
  s0076: [
    'The Tuyuhun great chief Shilian sent envoys bearing tribute goods.',
    'The Tuyuhun chief Shilian sent envoys with tribute.',
  ],
  s0077: [
    'The Xianbei chiefs Douliumi, Chidouhun, and Nanqiu Lujie, together with the Xiuguan chiefs Hehunu and Lu Shui Weidiba, all led their followings to surrender to Gangui; he appointed each to office and rank.',
    'The Xianbei chiefs Douliumi, Chidouhun, and Nanqiu Lujie, with the Xiuguan chiefs Hehunu and Lu Shui Weidiba, all submitted with their followings; Gangui invested each with office and rank.',
  ],
  s0078: [
    'The Longxi Administrator Yuezhi Jiegui rebelled at Pingxiang, styling himself General Who Establishes the State and Right Worthy King.',
    'Longxi administrator Yuezhi Jiegui rebelled at Pingxiang and styled himself General Who Establishes the State and Right Worthy King.',
  ],
  s0079: [
    'Gangui struck and defeated him; Jiegui fled east to Longshan.',
    'Gangui defeated him; Jiegui fled east to Longshan.',
  ],
  s0080: [
    'Before long he led his masses to come and surrender; Gangui gave him a clanswoman in marriage and appointed him General Who Establishes Righteousness.',
    'Soon Jiegui returned with his following; Gangui married him to a clanswoman and named him General Who Establishes Righteousness.',
  ],
  s0081: [
    'Fu Deng\'s general Moyu sent envoys to form an alliance, offering his two sons as hostages and requesting a joint campaign against the Xianbei chief Dadou.',
    'Fu Deng\'s general Moyu sent envoys seeking alliance, offering his two sons as hostages and asking Gangui to join him against the Xianbei chief Dadou.',
  ],
  s0082: [
    'Gangui then joined Moyu in attacking Dadou at Anyang City; Dadou withdrew and held fast at Mingchan Fort; Gangui stormed and took it, then returned to Jincheng.',
    'Gangui joined Moyu in attacking Dadou at Anyang. Dadou retreated to Mingchan Fort; Gangui stormed the fort and returned to Jincheng.',
  ],
  s0083: [
    'He was attacked by Lü Guang\'s younger brother Bao, was defeated at Mingque Gorge, and withdrew to encamp at Qing\'an.',
    'Lü Guang\'s brother Bao attacked him; Gangui was beaten at Mingque Gorge and withdrew to Qing\'an.',
  ],
  s0084: [
    'Bao pressed the pursuit; Gangui had his general Peng Xinian cut off Bao\'s line of retreat, personally donned armor, fought in succession and defeated him; Bao and his officers and soldiers, more than ten thousand, threw themselves into the river and drowned.',
    'Bao pressed the pursuit. Gangui sent Peng Xinian to sever his retreat, donned armor himself, and fought him down in successive clashes. Bao and more than ten thousand soldiers drowned in the river.',
  ],
  s0085: [
    'Fu Deng sent envoys to appoint Gangui Acting Bearer of the Yellow Axe, Grand Commander of the Longyou and Hexi Armies, Left Chancellor, Grand General, Prince of Henan, Governor of Qin, Liang, Yi, Liang, and Sha provinces, with the nine bestowals.',
    'Fu Deng sent envoys appointing Gangui Acting Bearer of the Yellow Axe, Grand Commander of the Longyou and Hexi Armies, Left Chancellor, Grand General, Prince of Henan, Governor of Qin, Liang, Yi, Liang, and Sha, with the nine bestowals.',
  ],
  s0086: [
    'At that time Deng was pressed by Yao Xing and sent envoys requesting troops; he advanced Gangui to Prince of Liang, ordered him to establish offices, and gave him his younger sister the Princess of Eastern Peace as Princess of Liang.',
    'Deng, hard pressed by Yao Xing, begged for troops, advanced Gangui to Prince of Liang, ordered him to set up a full court, and gave him his sister the Princess of Eastern Peace as consort.',
  ],
  s0087: [
    'Gangui sent his Forward General Qifu Yizhou and Champion Zhai Wei with twenty thousand horsemen to rescue him.',
    'Gangui sent Forward General Qifu Yizhou and Champion Zhai Wei with twenty thousand horse to relieve him.',
  ],
  s0088: [
    'When Deng was killed by Yao Xing, they withdrew the army.',
    'When Yao Xing killed Deng, they marched home.',
  ],
  s0089: [
    'The Di king Yang Ding led forty thousand foot and horse to attack him.',
    'The Di king Yang Ding marched against him with forty thousand foot and horse.',
  ],
  s0090: [
    'Gangui said to his generals: "Yang Ding gathers followers through courage and cruelty and exhausts the armies to indulge his desires.',
    'Gangui told his generals: "Yang Ding rules by brutality, gathering men through fear and exhausting armies for his appetites.',
  ],
  s0091: [
    'Armies are like fire; if not checked, they will burn themselves.',
    'Armies are like fire—unchecked, they consume themselves.',
  ],
  s0092: [
    'In this campaign of Ding\'s, Heaven is surely furnishing us resources."',
    'In this campaign Heaven is surely handing us Yang Ding\'s strength."',
  ],
  s0093: [
    '" Thereupon he sent his Governor of Liangzhou Qifu Kedan, Governor of Qinzhou Qifu Yizhou, and General Who Establishes Righteousness Jiegui to oppose him.',
    'He sent Governor of Liangzhou Qifu Kedan, Governor of Qinzhou Qifu Yizhou, and General Who Establishes Righteousness Jiegui to meet him.',
  ],
  s0094: [
    'Ding defeated Yizhou at Pingchuan; Kedan and Jiegui led their masses in withdrawal.',
    'Ding beat Yizhou at Pingchuan; Kedan and Jiegui drew off their forces.',
  ],
  s0095: [
    'Zhai Wei, flourishing his sword, remonstrated: "Our king, with divine martial bearing, founded his base in Longyou; east and west he campaigned, and nothing escaped his sweep; his might shook Qin and Liang, his fame reached Ba and Han.',
    'Zhai Wei drew his sword and protested: "Our king, born to command, founded his realm in Longyou and swept east and west until Qin and Liang trembled and Ba and Han took notice.',
  ],
  s0096: [
    'You, general, bear the weight of guarding the walls, have received trust beyond the passes—you ought to exert your strength unto death and assist in securing the house and state.',
    'You bear the weight of the realm\'s defense and hold command beyond the passes—you should spend your life in the king\'s service and secure the state.',
  ],
  s0097: [
    'Though Qinzhou was defeated, the two armies are still intact—how can you not think to go straight to the rescue but instead turn and flee in defeat? With what face will you see the king!',
    'Qinzhou fell, but two armies remain intact—why not rush to their aid instead of fleeing in defeat? What face will you show the king?',
  ],
  s0098: [
    'In old times Xiang Yu beheaded Qingzi to secure Chu; Hu Jian executed the army supervisor to achieve success—things the general has heard of.',
    'Xiang Yu slew Qingzi to save Chu; Hu Jian executed the army supervisor to win victory—you have heard such tales.',
  ],
  s0099: [
    'Wei\'s talent is truly not that of the ancients, yet dare I forget the righteousness of the Xiang clan!"',
    'My talent falls short of the ancients, yet how dare I forget the House of Xiang\'s example!"',
  ],
  s0100: [
    '" Kedan said: "The reason I did not go to Qinzhou earlier was that I did not know how the masses\' hearts stood.',
    'Kedan replied: "I held back from Qinzhou because I did not yet know where the army\'s heart lay.',
  ],
  s0101: [
    'Not to rescue one another in defeat is what military punishment strikes first—how dare I seek my own ease!',
    'To abandon comrades in defeat is the first crime under military law—how could I seek my own comfort?',
  ],
};

const path = 'translations/current_translation_jinshu.json';
const data = JSON.parse(readFileSync(path, 'utf8'));
let applied = 0;
for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  if (pair[0] === pair[1]) {
    throw new Error(`${s.id}: literal and idiomatic must differ`);
  }
  [s.literal, s.idiomatic] = pair;
  applied++;
}
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (expected', Object.keys(T).length, ')');
