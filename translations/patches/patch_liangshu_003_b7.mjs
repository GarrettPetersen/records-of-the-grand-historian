#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0601: [
    'On wuyin, Guard Army General Prince Yu of Hedong was made Xiangzhou inspector.',
    'On wuyin day Guard Army General Prince Yu of Hedong was made inspector of Xiangzhou.',
  ],
  s0602: [
    'In the fifth month, on xinchou, the newly dismissed Palace Secretariat Director Prince Lun of Shaoling was made Front-Pacification General with open office and third-rank ceremonial parity, and former Xiangzhou inspector Zhang Zuan was made General Who Commands the Army.',
    'On xinchou day in the fifth month the newly dismissed Palace Secretariat Director Prince Lun of Shaoling was made Front-Pacification General with an open office and third-rank ceremonial parity, and former Xiangzhou inspector Zhang Zuan was made General Who Commands the Army.',
  ],
  s0603: [
    'On xinhai, a partial amnesty was granted for Jiao, Ai, and De provinces.',
    'On xinhai day a partial amnesty was granted for Jiao, Ai, and De provinces.',
  ],
  s0604: [
    'On guichou, an edict said: "To govern a state depends on many officers; the peace of the realm depends on gaining worthy men.',
    'On guichou day an edict said, "A state stands on many officers, and the realm\'s peace rests on finding the right men.',
  ],
  s0605: [
    'I am dim in my conduct and especially lack the way of governance; alone above, I am as one standing at the edge of a deep ravine.',
    'I am blind in my actions and especially lack the way of governance; alone on high, I stand as at the lip of a deep gorge.',
  ],
  s0606: [
    'All you in court should think to rescue and remedy; offer replacement and judgment on what may or may not be done, and thereby instruct and nourish me.',
    'All of you in court should think how to set things right; offer counsel on what to keep and what to change, and thereby guide and sustain me.',
  ],
  s0607: [
    'Send this forth to the regional commanderies; seek worthy men on every side; exhaust the butchers and fishers, search every cliff and cave; report in due season."',
    'Send this to the regional commanderies; seek worthy men everywhere; search out hermits in caves and commoners at the plow; report what you find in season."',
  ],
  s0608: [
    'That month, the moon was seen twice.',
    'That month the moon appeared twice in one night.',
  ],
  s0609: [
    'In the eighth month of autumn, on yiwei, Right Guard General Zhu Yi was made Central Army Commander.',
    'On yiwei day in the eighth month of autumn Right Guard General Zhu Yi was made Central Army Commander.',
  ],
  s0610: [
    'On wuxu, Hou Jing raised troops in rebellion and on his own authority attacked the garrisons of Matou, Muzha, Jingshan, and others.',
    'On wuxu day Hou Jing raised troops in rebellion and on his own authority attacked the garrisons at Matou, Muzha, Jingshan, and elsewhere.',
  ],
  s0611: [
    'On jiachen, Front-Pacification General with open office and third-rank ceremonial parity Prince Lun of Shaoling was made overall commander of the armies to suppress Jing.',
    'On jiachen day Front-Pacification General Prince Lun of Shaoling, with an open office and third-rank ceremonial parity, was made overall commander of the armies to suppress Hou Jing.',
  ],
  s0612: [
    'A partial amnesty was granted for South Yuzhou.',
    'A partial amnesty was granted for South Yuzhou.',
  ],
  s0613: [
    'In the ninth month, on bingyin, Left Grand Master for Splendid Happiness Yuan Luo was additionally given the title General Who Stabilizes the Right.',
    'On bingyin day in the ninth month Left Grand Master for Splendid Happiness Yuan Luo was additionally made General Who Stabilizes the Right.',
  ],
  s0614: [
    'In the tenth month of winter, Hou Jing raided Qiao province and captured its inspector Xiao Tai.',
    'In the tenth month of winter Hou Jing raided Qiao province and captured its inspector Xiao Tai.',
  ],
  s0615: [
    'On dingwei, Jing advanced to attack Liyang; Administrator Zhuang Tie surrendered to him.',
    'On dingwei day Hou Jing advanced on Liyang, and Administrator Zhuang Tie surrendered to him.',
  ],
  s0616: [
    'On wushen, the newly dismissed Grand Master for Splendid Happiness Prince Zhengde of Linhe was made General Who Pacifies the North, overall commander of the capital armies, and encamped in Danyang commandery.',
    'On wushen day the newly dismissed Grand Master for Splendid Happiness Prince Zhengde of Linhe was made General Who Pacifies the North, overall commander of the capital armies, and encamped in Danyang commandery.',
  ],
  s0617: [
    'On jiyou, Jing crossed from Hengjiang to Caishi.',
    'On jiyou day Hou Jing crossed from Hengjiang to Caishi.',
  ],
  s0618: [
    'On xinhai, Jing\'s army reached the capital; Prince Zhengde of Linhe led his forces to join the rebels.',
    'On xinhai day Hou Jing\'s army reached the capital, and Prince Zhengde of Linhe led his troops over to the rebels.',
  ],
  s0619: [
    'In the eleventh month, on xinyou, the rebels captured Dongfu city and killed Marquis Tui of Nanpu and Central Army Major Yang Tun.',
    'On xinyou day in the eleventh month the rebels took Dongfu city and killed Marquis Tui of Nanpu and Central Army Major Yang Tun.',
  ],
  s0620: [
    'On gengchen, Prince Lun of Shaoling led Wu province inspector Xiao Nongzhang, former Qiao province inspector Zhao Bochao, and others to enter the capital in relief, encamping at Aijing Temple on Zhongshan.',
    'On gengchen day Prince Lun of Shaoling led Wu province inspector Xiao Nongzhang, former Qiao province inspector Zhao Bochao, and others to relieve the capital and encamped at Aijing Temple on Zhongshan.',
  ],
  s0621: [
    'On yiyou, Lun advanced to Hutou and fought the rebels, but was defeated.',
    'On yiyou day Prince Lun advanced to Hutou, fought the rebels, and was defeated.',
  ],
  s0622: [
    'On bingxu, General Who Pacifies the North Prince Fan of Poyang sent his heir Si, Bold-Faith General Pei Zhigao, and others to lead troops in relief, encamping at Zhanggong Islet.',
    'On bingxu day General Who Pacifies the North Prince Fan of Poyang sent his heir Si, Bold-Faith General Pei Zhigao, and others to lead relief troops and encamped at Zhanggong Islet.',
  ],
  s0623: [
    'In the twelfth month, on wushen, the sky split open in the northwest with light like fire.',
    'On wushen day in the twelfth month the sky split open in the northwest with a light like fire.',
  ],
  s0624: [
    'Director of the Masters of Writing Xie Ju died.',
    'Director of the Masters of Writing Xie Ju died.',
  ],
  s0625: [
    'On bingchen, Si province inspector Liu Zhongli, former Heng province inspector Wei Can, Gao province inspector Li Qianshi, former Si province inspector Yang Yaren, and others all led armies to enter in relief, and they raised Zhongli to supreme commander.',
    'On bingchen day Si province inspector Liu Zhongli, former Heng province inspector Wei Can, Gao province inspector Li Qianshi, former Si province inspector Yang Yaren, and others all led armies to relieve the capital and raised Zhongli to supreme commander.',
  ],
  s0626: [
    'In the third year, spring, first month, on dingsi, the new moon; Liu Zhongli led his forces to hold positions along the south bank.',
    'On dingsi day, the new moon of the first month of spring in year 3, Liu Zhongli led his forces to hold positions along the south bank.',
  ],
  s0627: [
    'That day, the rebels crossed the army at Qingtang, raided and broke Wei Can\'s camp; Can resisted in battle and died.',
    'That same day the rebels crossed at Qingtang, raided and broke Wei Can\'s camp, and Can died fighting.',
  ],
  s0628: [
    'On gengshen, Prince Lun of Shaoling, East Yangzhou inspector Duke Dalian of Lincheng, and others gathered troops on the south bank.',
    'On gengshen day Prince Lun of Shaoling, East Yangzhou inspector Duke Dalian of Lincheng, and others gathered their armies on the south bank.',
  ],
  s0629: [
    'On yichou, Central Army Commander Zhu Yi died.',
    'On yichou day Central Army Commander Zhu Yi died.',
  ],
  s0630: [
    'On bingyin, Minister of Finance Fu Qi was made Central Army Commander.',
    'On bingyin day Minister of Finance Fu Qi was made Central Army Commander.',
  ],
  s0631: [
    'On wuchen, Gao province inspector Li Qianshi and Tianmen administrator Fan Wenjiao advanced east of Qingxi and were broken by the rebels; Wenjiao died in the fighting.',
    'On wuchen day Gao province inspector Li Qianshi and Tianmen administrator Fan Wenjiao advanced east of Qingxi, were broken by the rebels, and Wenjiao died in battle.',
  ],
  s0632: [
    'On renwu, Mars occupied the Heart constellation.',
    'On renwu day Mars occupied the Heart constellation.',
  ],
  s0633: [
    'On yiyou, Venus was visible in daytime.',
    'On yiyou day Venus was visible in daytime.',
  ],
  s0634: [
    'In the second month, on dingwei, South Yan province inspector Prince Huili of Nankang and former Qing and Ji provinces inspector Marquis Tui of Xiangtan led the armies of Jiang province, encamping at Lanting Garden.',
    'On dingwei day in the second month South Yan province inspector Prince Huili of Nankang and former Qing and Ji provinces inspector Marquis Tui of Xiangtan led the armies of Jiang province and encamped at Lanting Garden.',
  ],
  s0635: [
    'On gengxu, General Who Pacifies the North Prince Fan of Poyang, He province inspector, was given his former title with open office and third-rank ceremonial parity.',
    'On gengxu day General Who Pacifies the North Prince Fan of Poyang, inspector of He province, was given his former title with an open office and third-rank ceremonial parity.',
  ],
  s0636: [
    'In the third month, on wuwu, former Si province inspector Yang Yaren and others advanced north of Dongfu and fought the rebels, suffering great defeat.',
    'On wuwu day in the third month former Si province inspector Yang Yaren and others advanced north of Dongfu, fought the rebels, and suffered great defeat.',
  ],
  s0637: [
    'On jiwei, the crown prince\'s consort Lady Wang died.',
    'On jiwei day the crown prince\'s consort Lady Wang died.',
  ],
  s0638: [
    'On dingmao, the rebels captured the palace city and let their troops plunder on a vast scale.',
    'On dingmao day the rebels took the palace city and let their troops plunder without restraint.',
  ],
  s0639: [
    'On jisi, the rebels forged an edict sending Duke Dakuan of Shicheng to disband the relief armies from outside.',
    'On jisi day the rebels forged an edict sending Duke Dakuan of Shicheng to disband the outside relief armies.',
  ],
  s0640: [
    'On gengwu, Hou Jing made himself overall commander of all armies within and without, Grand Chancellor, and Recorder of the Masters of Writing.',
    'On gengwu day Hou Jing made himself overall commander of all armies within and without, Grand Chancellor, and Recorder of the Masters of Writing.',
  ],
  s0641: [
    'On xinwei, the relief armies each withdrew and dispersed.',
    'On xinwei day the relief armies each withdrew and dispersed.',
  ],
  s0642: [
    'On bingzi, Mars again occupied the Heart constellation.',
    'On bingzi day Mars again occupied the Heart constellation.',
  ],
  s0643: [
    'On renwu, the newly appointed Central Army Commander Fu Qi died.',
    'On renwu day the newly appointed Central Army Commander Fu Qi died.',
  ],
  s0644: [
    'In the fourth month of summer, on jichou, the capital region was shaken by earthquake.',
    'On jichou day in the fourth month of summer the capital region was shaken by earthquake.',
  ],
  s0645: [
    'On bingshen, the earth shook again.',
    'On bingshen day the earth shook again.',
  ],
  s0646: [
    'On jiyou, Gaozu, because his demands could not be met, sank into illness through grief and rage.',
    'On jiyou day Gaozu, unable to obtain what he sought, fell ill with grief and rage.',
  ],
  s0647: [
    'That month, Qing and Ji provinces inspector Ming Shaoxia, East Xuzhou inspector Zhan Haizhen, and North Qing province inspector Wang Fengbo each raised their provinces in submission to Wei.',
    'That month Qing and Ji provinces inspector Ming Shaoxia, East Xuzhou inspector Zhan Haizhen, and North Qing province inspector Wang Fengbo each surrendered their provinces to Wei.',
  ],
  s0648: [
    'In the fifth month, on bingchen, Gaozu died in the Hall of Pure Abiding; he was eighty-six years old.',
    'On bingchen day in the fifth month Gaozu died in the Hall of Pure Abiding at the age of eighty-six.',
  ],
  s0649: [
    'On xinsi, the late emperor\'s coffin was moved to the Hall of Supreme Ultimate.',
    'On xinsi day the late emperor\'s coffin was moved to the Hall of Supreme Ultimate.',
  ],
  s0650: [
    'In the eleventh month of winter, he was posthumously honored as Emperor Wu; his temple name was Gaozu.',
    'In the eleventh month of winter he was posthumously honored as Emperor Wu with the temple name Gaozu.',
  ],
  s0651: [
    'On yimao, he was buried at Xiuling.',
    'On yimao day he was buried at Xiuling.',
  ],
  s0652: [
    'Gaozu was innately pure in filial devotion.',
    'Gaozu was born knowing pure filial devotion.',
  ],
  s0653: [
    'At age six, when Empress Dowager Xian died, he took no water or food for three days; his weeping was so bitter that it surpassed an adult\'s, and kin near and far all regarded him with added reverence and wonder.',
    'At six, when Empress Dowager Xian died, he took no water or food for three days; his weeping was so bitter it surpassed an adult\'s, and kin near and far all looked on him with added reverence and wonder.',
  ],
  s0654: [
    'When he entered mourning for Emperor Wen, he was then advisory aide to the Prince of Sui of Qi; the Sui princely establishment was stationed in Jing province. As soon as word of the death reached him, he submitted his resignation and raced off like a shooting star, neither sleeping nor eating, pressing the road at double pace through wind and storm without pause.',
    'When he entered mourning for Emperor Wen, he was advisory aide to Qi\'s Prince of Sui, whose establishment was stationed in Jing province. As soon as word reached him he resigned his post and raced off like a shooting star, neither sleeping nor eating, pressing the road at double pace through wind and storm without pause.',
  ],
  s0655: [
    'Gaozu\'s frame had been robust, but when he returned to the capital he had wasted away to skin and bone; relatives, friends, and scholars could no longer recognize him.',
    'Gaozu had been robust of frame, but when he returned to the capital he was wasted to skin and bone; relatives, friends, and scholars could no longer recognize him.',
  ],
  s0656: [
    'When he reached home and received the taboo name, he lost breath for a long time; each time he wept he vomited several sheng of blood.',
    'When he reached home and received the taboo name he lost breath for a long while; each time he wept he vomited several sheng of blood.',
  ],
  s0657: [
    'Throughout the mourning period he never again tasted rice; he lived only on barley, no more than two yi per day.',
    'Throughout mourning he never tasted rice again and lived only on barley, no more than two yi a day.',
  ],
  s0658: [
    'When he bowed at the imperial tombs, where his tears fell the pine grass changed color.',
    'When he bowed at the imperial tombs, wherever his tears fell the pine grass changed color.',
  ],
  s0659: [
    'Once he took the throne, he built Great Aijing Temple on Zhongshan, built Zhidu Temple beside Qingxi, and within the palace raised halls such as Supreme Reverence.',
    'Once he took the throne he built Great Aijing Temple on Zhongshan, Zhidu Temple beside Qingxi, and within the palace halls such as Supreme Reverence.',
  ],
  s0660: [
    'He also established the Hall of the Seven Ancestral Temples; twice each month he visited and set out pure offerings.',
    'He also established the Hall of the Seven Ancestral Temples and twice each month visited it with pure offerings.',
  ],
  s0661: [
    'Whenever he performed the scheduled bowing, tears poured down without cease, and his grief moved all who attended him.',
    'Whenever he performed the scheduled bowing tears poured down without cease, and his grief moved all who attended him.',
  ],
  s0662: [
    'Moreover his literary thought was keen and bright, and he brought every task to completion; from youth he was deeply devoted to learning and penetrated both Confucian and Daoist learning.',
    'Moreover his literary mind was keen and bright, and he brought every task to completion; from youth he was deeply devoted to learning and mastered both Confucian and Daoist learning.',
  ],
  s0663: [
    'Though the myriad state affairs pressed upon him, he never laid aside his scrolls; by candlelight he read at his side, often until the fifth watch of night.',
    'Though myriad state affairs pressed upon him, he never laid aside his scrolls; by candlelight at his side he read, often until the fifth watch of night.',
  ],
  s0664: [
    'He composed Imperial Intent Commentary on the Classic of Filial Piety, Lectures and Exegesis on the Changes, and commentaries on the sixty-four hexagrams, the two Appendices, the Statement on the Hexagrams, the Sequence of Hexagrams, and other texts; Commentary on the Community Sacrifice in the Book of Music; Questions and Answers on the Mao Odes; Questions and Answers on the Spring and Autumn Annals; Great Meaning of the Documents; Lectures on the Doctrine of the Mean; Correct Words of Confucius; Lectures on the Laozi — more than two hundred volumes in all, correcting the errors of earlier scholars and opening the intent of the ancient sages.',
    'He composed Imperial Intent Commentary on the Classic of Filial Piety, Lectures and Exegesis on the Changes, commentaries on the sixty-four hexagrams, the two Appendices, the Statement on the Hexagrams, the Sequence of Hexagrams, and other texts; Commentary on the Community Sacrifice in the Book of Music; Questions and Answers on the Mao Odes; Questions and Answers on the Spring and Autumn Annals; Great Meaning of the Documents; Lectures on the Doctrine of the Mean; Correct Words of Confucius; Lectures on the Laozi — more than two hundred volumes in all, correcting the errors of earlier scholars and opening the intent of the ancient sages.',
  ],
  s0665: [
    'Princes, marquises, and court ministers all submitted memorials with questions, and Gaozu answered every one.',
    'Princes, marquises, and court ministers all submitted memorials with questions, and Gaozu answered every one.',
  ],
  s0666: [
    'He restored and adorned the National University, expanded the student corps, established five academies, and appointed doctors for each of the Five Classics.',
    'He restored and adorned the National University, expanded the student corps, established five academies, and appointed doctors for each of the Five Classics.',
  ],
  s0667: [
    'At the start of Tianjian, He Tongzhi, He Kun, Yan Zhizhi, Ming Shanbin, and others repeated and expounded the imperial intent, and together compiled the five rites — auspicious, inauspicious, military, guest, and celebratory — more than one thousand volumes in all; Gaozu personally settled doubtful points.',
    'At the start of Tianjian He Tongzhi, He Kun, Yan Zhizhi, Ming Shanbin, and others repeated and expounded the imperial intent and together compiled the five rites — auspicious, inauspicious, military, guest, and celebratory — more than one thousand volumes in all; Gaozu personally settled doubtful points.',
  ],
  s0668: [
    'Thereafter the realm was reverent and orderly, and every household came to know ritual and propriety.',
    'Thereafter the realm was reverent and orderly, and every household came to know ritual and propriety.',
  ],
  s0669: [
    'In the Datong era he established the Forest of Scholars Hall west of the palace; General Who Commands the Army Zhu Yi, Minister Steward He Chen, Palace Attendant Kong Zimei, and others lectured in turn.',
    'In the Datong era he established the Forest of Scholars Hall west of the palace, and General Who Commands the Army Zhu Yi, Minister Steward He Chen, Palace Attendant Kong Zimei, and others lectured in turn.',
  ],
  s0670: [
    'The crown prince and Prince Xuan of Xuancheng also opened lectures at the Hall of Proclaimed Instruction in the Eastern Palace and at the Yangzhou yamen; then from the commanderies and kingdoms in all four directions men hurried toward learning and the capital filled like clouds gathering.',
    'The crown prince and Prince Xuan of Xuancheng also opened lectures at the Hall of Proclaimed Instruction in the Eastern Palace and at the Yangzhou yamen; then from commanderies and kingdoms in all four directions men hurried toward learning and gathered at the capital like clouds.',
  ],
  s0671: [
    'He was moreover deeply faithful to the true dharma and especially mastered Buddhist scriptures, compiling commentaries on the Nirvana, Mahaprajnaparamita, Vimalakirti, Three Wisdoms, and other sutras — again several hundred volumes.',
    'He was moreover deeply faithful to the true dharma and especially mastered Buddhist scriptures, compiling commentaries on the Nirvana, Mahaprajnaparamita, Vimalakirti, Three Wisdoms, and other sutras — again several hundred volumes.',
  ],
  s0672: [
    'In the intervals between hearing memorials he lectured at the Hall of Layered Clouds and at Tongtai Temple; eminent monks and great scholars, and audiences from the four quarters, often numbered more than ten thousand.',
    'In the intervals between hearing memorials he lectured at the Hall of Layered Clouds and at Tongtai Temple; eminent monks and great scholars, and audiences from the four quarters, often numbered more than ten thousand.',
  ],
  s0673: [
    'He also composed the Comprehensive History, writing the prefaces and appraisals himself — six hundred volumes in all.',
    'He also composed the Comprehensive History, writing the prefaces and appraisals himself — six hundred volumes in all.',
  ],
  s0674: [
    'Heaven\'s endowment was keen and quick; he put brush to paper and prose sprang forth. A thousand fu and a hundred shi could be drafted straightaway, all balanced in substance and ornament, surpassing present and past.',
    'Heaven\'s endowment was keen and quick; he put brush to paper and prose sprang forth. A thousand fu and a hundred shi could be drafted straightaway, all balanced in substance and ornament, surpassing present and past.',
  ],
  s0675: [
    'Edicts, inscriptions, eulogies, dirges, admonitions, hymns, petitions, and memorials — from his first years in the countryside down to his ascension to the throne — all his collected works amounted to another one hundred and twenty volumes.',
    'Edicts, inscriptions, eulogies, dirges, admonitions, hymns, petitions, and memorials — from his first years in the countryside down to his ascension to the throne — all his collected works amounted to another one hundred and twenty volumes.',
  ],
  s0676: [
    'He was practiced in all six arts; at go he reached the transcendent grade; in yin-yang, apocryphal texts, calendrical omens, divination, and oracle interpretation he all excelled.',
    'He was practiced in all six arts; at go he reached the transcendent grade; in yin-yang, apocryphal texts, calendrical omens, divination, and oracle interpretation he excelled in all.',
  ],
  s0677: [
    'He also composed thirty volumes of Golden Stratagems.',
    'He also composed thirty volumes of Golden Stratagems.',
  ],
  s0678: [
    'In cursive and clerical script, in letters and notes, in riding, archery, and horsemanship — there was nothing in which he was not marvelous.',
    'In cursive and clerical script, in letters and notes, in riding, archery, and horsemanship — there was nothing in which he was not marvelous.',
  ],
  s0679: [
    'He was diligent in government affairs, tireless and unwearying.',
    'He was diligent in government affairs, tireless and unwearying.',
  ],
  s0680: [
    'Every winter, as soon as the fourth watch ended, he ordered candles brought to review business; his hand, touching the cold as he wrote, cracked and split.',
    'Every winter, as soon as the fourth watch ended, he ordered candles brought to review business; his hand, touching the cold as he wrote, cracked and split.',
  ],
  s0681: [
    'In exposing wrongdoing and uncovering hidden guilt he penetrated human nature completely; he often wept in pity before he could approve a memorial for punishment.',
    'In exposing wrongdoing and uncovering hidden guilt he penetrated human nature completely; he often wept in pity before he could approve a memorial for punishment.',
  ],
  s0682: [
    'He ate only one meal a day; his fare had no fresh delicacies — only bean broth and coarse grain.',
    'He ate only one meal a day; his fare had no fresh delicacies — only bean broth and coarse grain.',
  ],
  s0683: [
    'When the myriad affairs pressed in and the day had already passed midday, he would rinse his mouth and take that as his meal.',
    'When myriad affairs pressed in and the day had already passed midday, he would rinse his mouth and take that as his meal.',
  ],
  s0684: [
    'He wore plain cloth on his body, cotton and dark tents in his quarters; one cap for three years, one quilt for two.',
    'He wore plain cloth on his body, cotton and dark tents in his quarters; one cap for three years, one quilt for two.',
  ],
  s0685: [
    'He was always frugal in his person — in all things it was thus.',
    'He was always frugal in his person — in all things it was thus.',
  ],
  s0686: [
    'After fifty he ceased entirely from the bedchamber.',
    'After fifty he ceased entirely from the bedchamber.',
  ],
  s0687: [
    'Among the palace offices, from honored consort downward — apart from the six inner palaces in their ceremonial robes of three pheasant patterns — all wore gowns that did not trail on the ground and had no brocade or damask at their sides.',
    'Among the palace offices, from honored consort downward — apart from the six inner palaces in their ceremonial robes of three pheasant patterns — all wore gowns that did not trail on the ground and had no brocade or damask at their sides.',
  ],
  s0688: [
    'He did not drink wine, did not listen to music; except for ancestral temple sacrifices, great assemblies and feasts, and Buddhist ceremonies, he never had music performed.',
    'He did not drink wine or listen to music; except for ancestral temple sacrifices, great assemblies and feasts, and Buddhist ceremonies, he never had music performed.',
  ],
  s0689: [
    'His nature was upright and square; even in a small hall or dark room he always arranged cap and robes; when seated briefly he kept his lap-belt neat; in the hottest months of summer he never bared his shoulders.',
    'His nature was upright and square; even in a small hall or dark room he always arranged cap and robes; when seated briefly he kept his lap-belt neat; in the hottest months of summer he never bared his shoulders.',
  ],
  s0690: [
    'Without proper bearing he would not receive anyone; even when meeting a young palace attendant he did so as though greeting a great guest.',
    'Without proper bearing he would not receive anyone; even when meeting a young palace attendant he did so as though greeting a great guest.',
  ],
  s0691: [
    'Looking through the emperors and rulers of old, for reverent frugality, dignified bearing, artistic skill, and wide learning — rarely has there been his equal.',
    'Looking through the emperors and rulers of old, for reverent frugality, dignified bearing, artistic skill, and wide learning — rarely has there been his equal.',
  ],
  s0692: [
    'The historiographer says: When Qi\'s end drew near, the ruler sat in benighted cruelty; Heaven abandoned him and spirits were angered; the masses rebelled and kin turned away.',
    'The historiographer says: When Qi\'s end drew near, the ruler sat in benighted cruelty; Heaven abandoned him and spirits were angered; the masses rebelled and kin turned away.',
  ],
  s0693: [
    'Gaozu was heroic, martial, wise, and discerning; he raised righteousness from Fan and Deng, took up banners and established his title, waded through water to rescue those in fire; he gathered armies like azure rhinoceroses and winged dragon-leopards in their ranks; clouds soared and thunder shook as he cut down the violent and swept away the vicious; the myriad states gladly pushed him forward and the three spirits changed their oracle.',
    'Gaozu was heroic, martial, wise, and discerning; he raised righteousness from Fan and Deng, took up banners and established his title, waded through water to rescue those in fire; he gathered armies like azure rhinoceroses and winged dragon-leopards in their ranks; clouds soared and thunder shook as he cut down the violent and swept away the vicious; the myriad states gladly pushed him forward and the three spirits changed their oracle.',
  ],
  s0694: [
    'Thereupon he grasped the phoenix calendar and held the dragon chart; he opened the four gates and widened the road to recruit worthies; he took in the ten disruptors and drew in the frank and upright to mark his failings.',
    'Thereupon he grasped the phoenix calendar and held the dragon chart; he opened the four gates and widened the road to recruit worthies; he took in the ten disruptors and drew in the frank and upright to mark his failings.',
  ],
  s0695: [
    'He revived literature and learning, restored suburban sacrifice, regulated the five rites, and fixed the six pitches; the four listeners were reached and the myriad affairs thereby ordered; governance settled and achievement complete, the far were pacified and the near were awed.',
    'He revived literature and learning, restored suburban sacrifice, regulated the five rites, and fixed the six pitches; the four listeners were reached and the myriad affairs thereby ordered; governance settled and achievement complete, the far were pacified and the near were awed.',
  ],
  s0696: [
    'Moreover heavenly portents and earthly blessings did not cease from year to year.',
    'Moreover heavenly portents and earthly blessings did not cease from year to year.',
  ],
  s0697: [
    'In districts reached by levies and tribute, in lands connected by writing and wheelfracks, the south extended beyond ten thousand li and the west opened five thousand.',
    'In districts reached by levies and tribute, in lands connected by writing and wheelfracks, the south extended beyond ten thousand li and the west opened five thousand.',
  ],
  s0698: [
    'Within them rare treasures and heavy gems, countless peoples and clans, all filled the imperial treasury; they came bowing with horns touching the ground before the palace gate.',
    'Within them rare treasures and heavy gems, countless peoples and clans, all filled the imperial treasury; they came bowing with horns touching the ground before the palace gate.',
  ],
  s0699: [
    'For thirty or forty years, this was the height of splendor.',
    'For thirty or forty years this was the height of splendor.',
  ],
  s0700: [
    'Since Wei and Jin, there has never been its like.',
    'Since Wei and Jin there has never been its like.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_003_b7.mjs <translation.json>'
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
