#!/usr/bin/env node
import fs from 'node:fs';

const T7 = {
  s0601: [
    'Tomorrow in the public court is where I begin as envoy to inspect garrison commanders\' crimes.',
    'Tomorrow at court I start inspecting the garrison commanders\' crimes.',
  ],
  s0602: ['Ni Xu could only shed tears and had nothing to say.', 'Ni Xu wept and could not answer.'],
  s0603: ['Before long Huai memorialized against Ni Xu.', 'Soon Huai impeached Ni Xu.'],
  s0604: ['His serving the public without bending—all were of this sort.', 'Serving the public without yielding—always like this.'],
  s0605: [
    'At the time the common people were oppressed by powerful families; cases unjustly held up for years—in a single morning those vindicated numbered in the hundreds daily.',
    'People crushed by great houses had cases stalled for years; in one morning hundreds were cleared daily.',
  ],
  s0606: [
    'Matters he submitted that would benefit the northern frontier numbered more than thirty articles, all accepted with praise.',
    'More than thirty proposals useful to the north were all praised and adopted.',
  ],
  s0607: [
    'In the ninth month of the first year of Zhengshi, someone reported the Rouran leading 120,000 horsemen on six routes together, aiming straight for Woye and Huaishuo and south to raid Heng and Dai.',
    'In the ninth month, Zhengshi 1, word came that the Rouran had 120,000 horse on six roads toward Woye and Huaishuo and south against Heng and Dai.',
  ],
  s0608: [
    'Huai was ordered with his original office plus Staff with credentials and Palace Attendant to go out and hold the northern marches.',
    'Huai kept his rank, gained staff credentials and Palace Attendant, and went to hold the northern border.',
  ],
  s0609: [
    'Strategy was set for him; troops were raised as needed; all dispositions were by expedient authority.',
    'He was given strategy, could levy as needed, and act on expedient authority.',
  ],
  s0610: ['Also ordered Huai\'s son Zhizhen summoned to follow Huai north.', 'His son Zhizhen was summoned to go north with him.'],
  s0611: ['He was granted one horse, one set of fine armor, and one imperial lance.', 'The court gave him a horse, fine armor, and an imperial lance.'],
  s0612: [
    'When Huai had finished bowing in acceptance, in his courtyard he mounted, grasped the lance, spurred the horse, and shouted loudly.',
    'After the bow he mounted in his courtyard, seized the lance, spurred his horse, and shouted.',
  ],
  s0613: ['Turning to his guests he said: "Though my strength has waned, I can still do this.', 'He told his guests, "Weak as I am, I can still do this.'],
  s0614: ['The Rouran may fear the strong and slight the old, but I am not so easily fooled.', 'The Rouran fear the strong and mock the old—but I am not so easily fooled.'],
  s0615: [
    'Now following the temple\'s victorious plan and commanding fierce troops, it is enough to seize their chiefs and present captives below the palace."',
    'Under the court\'s winning plan, with fierce troops, I can still take their chiefs and bring captives to the palace."',
  ],
  s0616: ['He was then sixty-one.', 'He was sixty-one.'],
  s0617: ['When Huai reached Yunzhong, the Rouran fled and vanished.', 'At Yunzhong the Rouran fled.'],
  s0618: [
    'Soon he reached Heng and Dai, then inspected all posts along the garrisons for places where walls and garrisons might be built; he measured heights, gauged thickness, grain stores and arms, and interlocking relief—in all fifty-eight memorial articles, all accepted by Xuanwu.',
    'At Heng and Dai he surveyed garrison terrain for walls and posts, heights, thickness, grain, arms, and mutual relief—fifty-eight memorials, all accepted by Xuanwu.',
  ],
  s0619: ['At death he was posthumously made Duke of Situ, posthumous name Hui (Kind).', 'He died and was posthumously Duke of Situ, posthumous name Kind.'],
  s0620: ['Huai was broad and simple by nature and disliked petty detail.', 'Huai was easygoing and hated petty detail.'],
  s0621: [
    'He often told people: "In governing, what matters is to raise the main rope—why must one be as fine as a crown prince\'s threads!',
    'He said, "Government needs the main rope raised—why fuss like crown-prince threadwork!'],
  s0622: ['It is like building a house: only that the outside looks high and bright and pillars and beams are level is enough.', 'A house needs only a lofty front and level beams.'],
  s0623: ['If axe and adze work is uneven, that is not the house\'s sickness."', 'Uneven carpentry is not the house\'s fault."'],
  s0624: ['By nature he did not drink, yet he delighted in treating others to drink.', 'He did not drink but loved treating others.'],
  s0625: [
    'He loved receiving guests and was skilled in music; though white-haired, in leisure at banquets he often played string and bamboo himself.',
    'He loved guests and music; though white-haired, at leisure he often played strings himself.',
  ],
  s0626: ['Son Ziyong, styled Linghe.', 'His son Ziyong, styled Linghe.'],
  s0627: [
    'From youth he loved letters and was earnest in study; he treated scholars with sincerity and many gathered to him.',
    'From youth he loved letters, studied hard, and won scholars by sincerity.',
  ],
  s0628: ['He rose in succession to Governor of Xiazhou.', 'He rose to Governor of Xiazhou.'],
  s0629: [
    'At the time people of Woye Garrison took Poliuhan Baling as first to raise rebellion; rebels of Tongwan pressed in with ceaseless raids.',
    'When Woye men followed Poliuhan Baling in the first northern revolt, Tongwan rebels harried without pause.',
  ],
  s0630: ['Ziyong closed the city and held it; grain in the city ran out and they boiled horse hides to eat.', 'Ziyong held the city; grain ran out and they boiled horsehide.'],
  s0631: ['Ziyong was good at soothing and there was no defection.', 'He soothed the people and none deserted.'],
  s0632: [
    'As famine grew acute he wished to go out himself to seek grain and leave Yanbo to hold the defense.',
    'Famine sharpened; he would seek grain himself and leave Yanbo to hold the city.',
  ],
  s0633: ['His staff all said it would be better to abandon the city and leave together and plan anew.', 'His staff urged abandoning the city and regrouping.'],
  s0634: [
    'Ziyong wept and begged the crowd: "Our house has received the state\'s grace for generations; this is my place to die—what more do I seek!"',
    'Weeping, he told them, "My house owes the state for generations; this is where I die—what more could I want!"',
  ],
  s0635: ['He then led the weak himself east to Xia to transport grain.', 'He led the weak east to Xia to bring grain.'],
  s0636: [
    'Yanbo and the troops escorted him from the city; they wept and bowed in farewell and the whole army sobbed.',
    'Yanbo and the troops saw him out, weeping and bowing; the army sobbed.',
  ],
  s0637: ['Ziyong was waylaid by the Shuo barbarian chief Cao A Geba and, strength spent, was seized.', 'The Shuo chief Cao A Geba intercepted him; spent, he was taken.'],
  s0638: [
    'He secretly sent a man with a letter by hidden route to the city saying: "The great army is near—hold loyalty and do not change your resolve."',
    'He sent a secret letter: "The army is near—stay loyal and do not waver."',
  ],
  s0639: [
    'Though Ziyong was bound, the barbarians respected him and always treated him with the courtesy due the people.',
    'Though captive, the barbarians respected him and treated him with civil courtesy.',
  ],
  s0640: [
    'Ziyong set forth the roots of safety and danger, fortune and misfortune, and urged A Geba to submit.',
    'He explained safety and danger and urged A Geba to surrender.',
  ],
  s0641: ['Just as A Geba was about to follow, he died before it was done.', 'A Geba was about to yield when Ziyong died.'],
  s0642: ['A Geba\'s younger brother Sang Sheng succeeded in command of the tribe and in the end followed Ziyong in submission.', 'Brother Sang Sheng took the tribe and finally submitted as Ziyong had urged.'],
  s0643: [
    'At the time Prince of Beihai Yuan Hao was Grand Commissioner; Ziyong fully set forth how the rebels could be destroyed.',
    'Prince of Beihai Yuan Hao was Grand Commissioner; Ziyong laid out how to destroy the rebels.',
  ],
  s0644: ['Hao gave Ziyong troops and ordered him to advance first.', 'Hao gave him troops and sent him ahead.'],
  s0645: ['At the time the whole of eastern Xia rebelled and bands gathered everywhere.', 'All eastern Xia rose; bands formed everywhere.'],
  s0646: [
    'Ziyong fought forward; in ninety days he fought several dozen battles and then pacified eastern Xia.',
    'He fought on; in ninety days and dozens of battles he pacified eastern Xia.',
  ],
  s0647: ['He levied grain tax and transported grain to Tongwan, and the two Xia regions gradually grew calm.', 'He levied grain, shipped it to Tongwan, and both Xia lands grew quiet.'],
  s0648: [
    'When Xiao Baoyin and others were defeated by rebels and Guanxi was in turmoil, Ziyong had just pacified Heicheng and led troops and horses with Xiazhou volunteers south in martial array.',
    'When Baoyin and others fell in Guanxi, Ziyong, fresh from Heicheng, marched south with Xiazhou volunteers.',
  ],
  s0649: ['The rebel chief Kang Weimo held Juguli and cut the Yingtang Bridge.', 'Rebel Kang Weimo held Juguli and cut Yingtang Bridge.'],
  s0650: ['Ziyong fought him, routed him greatly, and captured Weimo.', 'Ziyong routed him and took Weimo.'],
  s0651: ['He also defeated the rebel chief Qiguan Jin at Yangshi Fort.', 'He also beat Qiguan Jin at Yangshi Fort.'],
  s0652: ['From western Xia to eastern Xia he fought a thousand li.', 'From western to eastern Xia he fought a thousand li.'],
  s0653: ['Only then did the court begin to send formal inquiries.', 'Only then did the court send formal inquiries.'],
  s0654: ['He was made Concurrent Mobile Secretariat Director.', 'He was made concurrent Mobile Secretariat Director.'],
  s0655: [
    'He again defeated the rebel chief Hedan Buhuti at Quwo; Emperor Ming sent an imperial letter to praise and encourage him.',
    'He beat Hedan Buhuti at Quwo; Ming sent an imperial letter of praise.',
  ],
  s0656: [
    'At Baishui commandery Ziyong defeated the rebel force of Suqin Mingda\'s son Afei and beheaded and captured many.',
    'At Baishui he routed Afei, son of Suqin Mingda, and took many heads.',
  ],
  s0657: ['He was made Attendant of the Yellow Gate and enfeoffed Duke of Leping.', 'He was Attendant of the Yellow Gate and Duke of Leping.'],
  s0658: ['Because Ge Rong long pressed Xindu, Ziyong was ordered Northern Campaign Commander.', 'Ge Rong long besieged Xindu; Ziyong was made Northern Campaign Commander.'],
  s0659: [
    'At the time Xiangzhou Inspector, Prince of Anle Yuan Jian, held Ye in rebellion; an edict ordered Ziyong and Commissioner Li Shengui to pacify him first.',
    'Prince of Anle Yuan Jian held Ye; Ziyong and Li Shengui were ordered to crush him first.',
  ],
  s0660: ['His fief was changed to Duke of Yangping.', 'His fief became Duke of Yangping.'],
  s0661: ['He then with Pei Yan marched from Ye against Ge Rong.', 'He then left Ye with Pei Yan against Ge Rong.'],
  s0662: ['But Xindu city fell; Ziyong was made Jizhou Inspector and advanced with Pei Yan.', 'Xindu fell; he was made Jizhou Inspector and advanced with Pei Yan.'],
  s0663: ['Ziyong was defeated in battle and died; posthumously Minister of Works, posthumous name Zhuangmu (Solemn and Reverent).', 'He was beaten and died; posthumously Minister of Works, posthumous name Solemn.'],
  s0664: ['Ziyong\'s younger brother\'s son Zigong, styled Lingshun, was clever, fond of learning.', 'Nephew Zigong, styled Lingshun, was clever and studious.'],
  s0665: [
    'He rose gradually to Northern Host-guest Gentleman in the Masters of Writing and concurrently handled southern host-guest affairs.',
    'He rose to Northern Host-guest Gentleman and handled southern host-guest affairs too.',
  ],
  s0666: [
    'At the time Xu Zhou, a refugee from Liang, claimed to be Liang Attendant of the Yellow Gate; court scholars all trusted him.',
    'Liang refugee Xu Zhou claimed to be Liang Yellow Gate Attendant; the court trusted him.',
  ],
  s0667: [
    'Zigong memorialized that true and false were hard to tell and asked that Xu and Yang provinces be secretly investigated.',
    'Zigong said the claim was doubtful and asked secret inquiry in Xu and Yang.',
  ],
  s0668: [
    'Zhou indeed returned to the capital under charge, having falsely claimed office, just as Zigong had suspected.',
    'Zhou was brought back under charge for false rank, as Zigong had said.',
  ],
  s0669: ['Qie Tiecang of Hezhou Qiang rebelled; Zigong was ordered Mobile Commissioner to attack.', 'Hezhou Qiang Qie Tiecang rebelled; Zigong was sent to attack.'],
  s0670: ['Zigong showed both sternness and kindness; within twenty days all submitted.', 'He mixed sternness and grace; in twenty days all surrendered.'],
  s0671: ['The court praised him.', 'The court praised him.'],
  s0672: ['In the first year of Zhengguang he was Mobile Secretariat Left Director, touring the northern frontier.', 'Zhengguang 1 he toured the north as Mobile Left Director.'],
  s0673: ['He was transferred to Bureau Director of Construction.', 'He became Bureau Director of Construction.'],
  s0674: [
    'The Bright Hall and Imperial Academy were not yet finished; Zigong submitted a memorial asking to oversee them further.',
    'Bright Hall and Imperial Academy were unfinished; Zigong asked to oversee them.',
  ],
  s0675: ['The memorial was submitted and accepted.', 'The throne accepted.'],
  s0676: ['He rose gradually to Yuzhou Inspector.', 'He rose to Yuzhou Inspector.'],
  s0677: [
    'Repeatedly for military merit he was made General Who Pacifies the South and Concurrent Mobile Secretariat Director.',
    'For repeated merit he was General Who Pacifies the South and concurrent Mobile Director.',
  ],
  s0678: ['When Yuan Hao entered Luoyang, Zigong was made General of Cavalry and Chariots;', 'When Yuan Hao took Luoyang, Zigong was made General of Cavalry and Chariots;'],
  s0679: [
    'Zigong did not dare refuse him but repeatedly sent secret envoys to report Emperor Zhuang\'s movements.',
    'he did not dare refuse but sent secret reports on Emperor Zhuang.',
  ],
  s0680: [
    'Before long Hao was defeated, the imperial carriage returned to Luoyang, and for past campaign merit Zigong was enfeoffed Marquis of Linying, Palace Attendant.',
    'Soon Hao fell, the emperor returned, and Zigong was Marquis of Linying and Palace Attendant for past merit.',
  ],
  s0681: [
    'At Erzhu Rong\'s death, Shilong and Dulü held the He Bridge; Zigong was ordered commander to attack them.',
    'When Erzhu Rong died, Shilong and Dulü held He Bridge; Zigong was ordered to attack.',
  ],
  s0682: [
    'Soon Grand Steward Li Miao burned the He Bridge by night; Shilong retreated and Zigong was made Concurrent Vice Director of the Masters of Writing, Grand Commissioner, and Grand Commander.',
    'Li Miao burned He Bridge by night; Shilong fled; Zigong became Vice Director, Grand Commissioner, and Grand Commander.',
  ],
  s0683: [
    'At the beginning of Emperor Jiemin he was enfeoffed Viscount of Linru for merit in fixing the succession.',
    'At Jiemin\'s accession he was Viscount of Linru for fixing the succession.',
  ],
  s0684: ['In the Yongxi era he entered as Minister of Civil Service.', 'In Yongxi he became Minister of Civil Service.'],
  s0685: ['For Zigong\'s earlier merit at Yuzhou he was retroactively enfeoffed Baron of Xiangcheng.', 'For Yuzhou merit he was retroactively Baron of Xiangcheng.'],
  s0686: ['Again for Zigong\'s remaining achievements he was enfeoffed Viscount of Xincheng.', 'Further merit made him Viscount of Xincheng.'],
  s0687: ['Zigong soon memorialized asking to transfer the rank to his fifth son Wensheng; permission was granted.', 'He asked to give the rank to his fifth son Wensheng and was allowed.'],
  s0688: ['At the beginning of Tianping he was made Director of the Secretariat.', 'At Tianping\'s start he was Secretariat Director.'],
  s0689: ['In the third year he was made Wei Governor and also Military Adviser to Prince Qi Shenwu.', 'In year three he was Wei Governor and adviser to Prince Qi Shenwu.'],
  s0690: ['At death posthumously Duke of Works, posthumous name Wenxian (Cultured and Manifest).', 'He died posthumously Duke of Works, posthumous name Cultured.'],
  s0691: ['Son Biao.', 'Son Biao.'],
  s0692: ['Biao, styled Wenzong, was learned, quick-witted, and from youth had a name for ability.', 'Biao, styled Wenzong, was learned and quick; from youth he was known.'],
  s0693: ['In Wei\'s Yongan era, for his father\'s merit he was enfeoffed Baron of Linying.', 'In Yongan, for his father\'s merit, he was Baron of Linying.'],
  s0694: ['In the fourth year of Tianping he was Liangzhou Grand Rectifier.', 'Tianping 4 he was Liangzhou Grand Rectifier.'],
  s0695: [
    'When Prince Qi Wenxiang took charge of selection, he purged Secretariat gentlemen and made Wenzong Director of the Ancestral Temples Bureau.',
    'When Wenxiang purged Secretariat gentlemen, Wenzong became Director of the Ancestral Temples Bureau.',
  ],
  s0696: ['In the second year of Huangjian he rose in succession to Jingzhou Inspector.', 'Huangjian 2 he rose to Jingzhou Inspector.'],
  s0697: [
    'Wenzong treated men with kindness and trust and won great harmony on the frontier; neighboring peoples admired and submitted, and many earlier seized in raids were sent back.',
    'He ruled the border by kindness and trust; neighbors submitted and returned many earlier captives.',
  ],
  s0698: [
    'He rose in succession to Qinzhou Inspector; riding post-haste to his prefecture he was specially granted rear guard music.',
    'He rose to Qinzhou Inspector and was given rear guard music on post horses.',
  ],
  s0699: [
    'At the time Li Zhen was envoy to Chen; the Chen ruler said: "Our court has again sent Source of the Jingzhou at Guabu—truly we are in communication."',
    'When Li Zhen went to Chen, the Chen ruler said, "Qi has again sent the man from Jingzhou to Guabu—how open we are."',
  ],
  s0700: ['In the third year of Wuping he was made Director of the Secretariat.', 'Wuping 3 he was Secretariat Director.'],
};

const T8 = {
  s0701: [
    'The Chen general Wu Mingche attacked Huainan; Liyang and Guabu fell in succession.',
    'Chen general Wu Mingche took Huainan; Liyang and Guabu fell in turn.',
  ],
  s0702: [
    'Zhao Yanshen at the Palace Secretariat secretly consulted Wenzong on plans to resist.',
    'Zhao Yanshen secretly asked Wenzong at the Secretariat how to resist.',
  ],
  s0703: [
    'Wenzong said: "The state\'s treatment of Huainan has lost it as easily as an arrow in the weeds."',
    'Wenzong said, "We treat Huainan like an arrow lost in weeds."',
  ],
  s0704: ['He thought Huainan ought to be entrusted to Wang Lin.', 'He thought Huainan should go to Wang Lin.'],
  s0705: ['Lin at Tanling plainly would not bow north to Ming.', 'Lin at Tanling would never bow north to Chen Ming.'],
  s0706: ['Yanshen said: "Brother, this is a fine plan.', 'Yanshen said, "A fine plan, brother.'],
  s0707: ['But to argue with words for ten days already went unheard.', 'Ten days of talk already failed.'],
  s0708: ['Affairs are as they are—how can one speak everything!"', 'Things are as they are—how can one say it all!"'],
  s0709: ['They then looked at each other and wept.', 'They wept together.'],
  s0710: [
    'When Qi fell, with Yang Xiuzhi and eighteen others he entered the capital and was made General of the Fourth Rank, Grand Master of the Academy.',
    'When Qi fell he entered the capital with Yang Xiuzhi and eighteen others as Fourth-rank General and Academy Grand Master.',
  ],
  s0711: ['In Sui\'s Kaihuang era he was made Juzhou Inspector.', 'In Kaihuang he was Juzhou Inspector.'],
  s0712: ['He fell ill, left office, and died.', 'Illness forced retirement; he died.'],
  s0713: [
    'Wenzong as a nobleman\'s son rose in the court ranks; his talent and judgment were quick and he was known for practical capacity.',
    'A noble\'s son, he rose fast; quick and capable, he was known for getting things done.',
  ],
  s0714: ['Yet he loved visiting the houses of the great; opinion held he was good at currying favor.', 'Yet he courted the powerful; opinion said he knew how to flatter.'],
  s0715: ['Son Shi, styled Jianyan.', 'Son Shi, styled Jianyan.'],
  s0716: [
    'From youth he was known; sharp in debate and with insight, he especially prided himself on clerical affairs.',
    'Known from youth, sharp and insightful, he especially trusted his skill in office work.',
  ],
  s0717: ['In Qi he was Left Outer Military Gentleman and also handled the Ancestral Temples Bureau.', 'In Qi he was Left Outer Military Gentleman and handled the temples bureau.'],
  s0718: ['Later in midsummer, because the Dragon Star appeared, rain sacrifice was requested.', 'In midsummer the Dragon Star appeared and rain sacrifice was requested.'],
  s0719: [
    'At the time Gao Anagong was Recorder of the Masters of Writing and said a true dragon had appeared, greatly delighted.',
    'Gao Anagong, Recorder of the Masters of Writing, said a real dragon had appeared and rejoiced.',
  ],
  s0720: ['He asked where the dragon was and what color it was.', 'He asked where it was and what color.'],
  s0721: [
    'Shi composed himself and said: "This is the Dragon Star\'s first appearance; by rite rain sacrifice is at the suburban altar—it does not mean a true dragon has descended elsewhere."',
    'Shi said calmly, "This is the Dragon Star\'s first sighting; rite calls for suburban rain sacrifice—not a dragon descending elsewhere."',
  ],
  s0722: ['Anagong flushed angrily and said: "Han fellows meddle too much, pretending to know the stars!"', 'Anagong snapped, "Han meddlers, pretending to know the stars!"'],
  s0723: ['The sacrifice was not performed.', 'The rite was dropped.'],
  s0724: [
    'Shi left and sighed in private: "The state\'s great affairs lie in sacrifice and arms; when rites are abandoned, can it last long?',
    'Leaving, he sighed, "Sacrifice and arms are the state\'s root; rites abandoned—how long can it last?'],
  s0725: ['Qi\'s fall is not far!"', 'Qi has no days left!"'],
  s0726: ['Soon Emperor Wu of Zhou pacified Qi and made him Superior Tax Master.', 'Soon Zhou Wu pacified Qi and made him Superior Tax Master.'],
  s0727: [
    'When Sui Wendi received the mandate he rose in succession to Left Assistant Minister of the Masters of Writing and was famed for clarity and efficiency.',
    'When Wendi took the throne he rose to Left Assistant Minister, famed for clarity and drive.',
  ],
  s0728: [
    'At the time Prince of Shu Xiu often violated law; Shi was made Staff Major to the Yizhou Regional Commander.',
    'Prince of Shu Xiu broke the law; Shi was made Yizhou staff major.',
  ],
  s0729: [
    'Before long Xiu was summoned; fearing trouble in the capital, he meant to plead illness.',
    'Soon Xiu was summoned; fearing the capital, he would plead illness.',
  ],
  s0730: ['Shi repeatedly urged him that he could not defy the command.', 'Shi urged him not to defy the order.'],
  s0731: ['Xiu then flushed and said: "This is my family\'s affair—what has it to do with you?"', 'Xiu snapped, "Family business—none of your affair!"'],
  s0732: ['Shi wept and admonished bitterly; Xiu then followed the summons.', 'Shi wept and pleaded; Xiu went.'],
  s0733: [
    'After Xiu\'s hair was removed many prefectural officials were implicated; Shi was spared for this.',
    'After Xiu was punished many officials were implicated; Shi was spared.',
  ],
  s0734: ['Later he was made General of the Third Rank.', 'Later Third-rank General.'],
  s0735: [
    'In office Shi was forceful and clear, with a ready tongue, but had no name for integrity and fairness.',
    'In office he was forceful and sharp-tongued but not called fair.',
  ],
  s0736: ['He died as Vice Minister of Punishments.', 'He died as Vice Minister of Punishments.'],
  s0737: ['Zigong\'s younger brother Zizuan, styled Lingxiu, held post of Vice Grand Steward.', 'Younger brother Zizuan, styled Lingxiu, was Vice Grand Steward.'],
  s0738: ['He was killed at Heyin; posthumously Qinzhou Inspector.', 'Killed at Heyin; posthumously Qinzhou Inspector.'],
  s0739: ['Son Xiong.', 'Son Xiong.'],
  s0740: ['Xiong, styled Shilüe, from youth was generous and of fine appearance.', 'Xiong, styled Shilüe, was generous and handsome from youth.'],
  s0741: ['He first served Wei and rose to Secretariat Gentleman.', 'He first served Wei as Secretariat Gentleman.'],
  s0742: [
    'Under Zhou, for merit in the Qi campaign he was enfeoffed Duke of Shuo and was successively Jizhou and Pingzhou Inspector and Acting Xuzhou Regional Commander.',
    'Under Zhou, for the Qi campaign he was Duke of Shuo, then Jizhou and Pingzhou Inspector and acting Xuzhou commander.',
  ],
  s0743: [
    'When Yuwen Jiong rebelled, Xiong\'s family dependents were at Xiangzhou and Jiong secretly sent a letter to entice him.',
    'When Yuwen Jiong rebelled, Xiong\'s family was at Xiangzhou and Jiong secretly wrote to win him.',
  ],
  s0744: ['Xiong in the end paid no heed.', 'Xiong ignored it.'],
  s0745: ['Sui Wendi sent a letter to comfort and encourage him.', 'Wendi sent a letter of comfort.'],
  s0746: [
    'Jiong sent his general Bi Yixu to hold Lanling; Xi Pi took the lower town of Changyu; Xiong sent troops and pacified all.',
    'Jiong\'s Bi Yixu held Lanling; Xi Pi took Changyu\'s lower town; Xiong\'s troops cleared both.',
  ],
  s0747: [
    'The Chen, seeing the central plains in turmoil, sent generals Chen Ji, Xiao Mohe, Ren Mannu, Zhou Luozi, Fan Yi, and others to invade north of the river.',
    'Chen sent Chen Ji, Xiao Mohe, Ren Mannu, Zhou Luozi, and Fan Yi north while the plains were in turmoil.',
  ],
  s0748: [
    'From Jiangling east to Shouyang many responded; they attacked and took towns and forts.',
    'From Jiangling to Shouyang many joined them and took towns.',
  ],
  s0749: ['Xiong with Wu Regional Commander Yu Yi and others drove them off.', 'Xiong with Yu Yi of Wu and others drove them off.'],
  s0750: ['All former territory was recovered.', 'All lost ground was recovered.'],
  s0751: ['He advanced to Grand General and was made Xuzhou Regional Commander, then transferred to Shuo Regional Commander.', 'He became Grand General, Xuzhou commander, then Shuo commander.'],
  s0752: ['In the pacification of Chen he followed Prince Qin Jun by the Xinzhou route.', 'Pacifying Chen, he followed Prince Qin Jun on the Xinzhou road.'],
  s0753: [
    'When Chen was pacified, for merit he advanced to Pillar of State, enfeoffed son Chong Baron of Duanshi and Bao Baron of Anhua, and again held Shuo.',
    'Chen pacified, he was Pillar of State; sons Chong and Bao were barons; he again held Shuo.',
  ],
  s0754: [
    'The next year he memorialized asking to retire; summoned back to the capital, he died at home.',
    'Next year he asked to retire, was recalled, and died at home.',
  ],
  s0755: ['Son Song inherited; in the Daye era he was Director of the Parks Bureau and campaigned against the Beihai rebels.', 'Son Song inherited; in Daye he was Parks Director and fought Beihai rebels.'],
  s0756: ['He died fighting hard; posthumously Proper Counselor.', 'He died in hard fighting; posthumously Proper Counselor.'],
  s0757: ['Liu Ni, a man of Dai.', 'Liu Ni, of Dai.'],
  s0758: ['Great-grandfather Dun had merit under Emperor Daowu and was a frontier great chief.', 'Great-grandfather Dun served Daowu and was a frontier great chief.'],
  s0759: ['Father Lou was Champion General.', 'Father Lou was Champion General.'],
  s0760: [
    'Ni was brave, decisive, and skilled at archery; Taiwu saw him and favored him, made him Gentlemen of the Feathered Forest, and enfeoffed him Viscount of Chang.',
    'Brave and skilled at archery, Taiwu favored him, made him Feathered Forest gentleman, and enfeoffed Viscount of Chang.',
  ],
  s0761: [
    'When Zong Ai had killed Prince of Nan\'an Yu at the eastern temple and kept it secret, only Ni knew the circumstances.',
    'When Zong Ai killed Prince of Nan\'an Yu at the eastern temple and hid it, only Ni knew.',
  ],
  s0762: ['Ni urged Ai to enthrone Wencheng.', 'Ni urged Ai to enthrone Wencheng.'],
  s0763: [
    'Ai himself thought he had sinned against Jingmu and, hearing this, said in alarm: "You are a great fool!',
    'Ai, guilty toward Jingmu, cried, "You great fool!'],
  s0764: ['If the imperial grandson is enthroned, will he not remember the Zhengping affair?"', 'Enthrone the grandson and he will remember Zhengping!"'],
  s0765: ['Ni said: "If so, whom shall we enthrone?"', 'Ni said, "Then whom do we enthrone?"'],
  s0766: ['Ai said: "Wait until we return to the palace and choose the worthy among the princes\' sons."', 'Ai said, "Wait till we return and pick a worthy prince\'s son."'],
  s0767: [
    'Ni feared he would change course and secretly reported the situation to Palace Attendant Yuan He.',
    'Fearing a change, Ni secretly told Palace Attendant Yuan He.',
  ],
  s0768: [
    'At the time he and Ni together commanded troops on night guard; they then with Southern Department Director Lu Li plotted and secretly supported the imperial grandson.',
    'He and Ni then held night guard; with Lu Li they secretly backed the grandson.',
  ],
  s0769: [
    'Thereupon He with Masters of Writing Director Changsun Kehou arrayed troops in strict guard; Ni with Li welcomed Wencheng from the park.',
    'He and Changsun Kehou guarded with troops; Ni and Li brought Wencheng from the park.',
  ],
  s0770: ['Li held Wencheng in his arms on horseback and entered the capital.', 'Li carried Wencheng on horseback into the capital.'],
  s0771: [
    'Ni galloped back to the eastern temple and shouted: "Zong Ai killed Prince of Nan\'an—great treason!',
    'Ni galloped to the eastern temple and shouted, "Zong Ai killed Prince of Nan\'an—treason!'],
  s0772: ['The imperial grandson has already ascended."', 'The grandson is already enthroned."'],
  s0773: ['There is an edict: all night-guard troops may return to the palace."', 'Edict: night guard, return to the palace."'],
  s0774: ['The crowd all shouted ten thousand years.', 'All shouted long life.'],
  s0775: [
    'He and Kehou seized Zong Ai, Jia Zhou, and others, led troops in, and at the palace gate supported Wencheng; he entered and ascended Yong\'an Hall.',
    'He and Kehou seized Zong Ai and Jia Zhou, led troops in, and enthroned Wencheng at Yong\'an Hall.',
  ],
  s0776: ['Ni was made Inner Chief and enfeoffed Duke of Dong\'an.', 'Ni was Inner Chief and Duke of Dong\'an.'],
  s0777: ['Soon he was transferred to Vice Director of the Masters of Writing and made Qinzhou Inspector.', 'Soon Vice Director and Qinzhou Inspector.'],
  s0778: ['In the province he was pure and cautious, yet often drunk.', 'In office he was pure but often drunk.'],
  s0779: ['At the end of Wencheng he was Minister of Works.', 'Late in Wencheng he was Minister of Works.'],
  s0780: [
    'When Xianwen ascended, because Ni had great merit in the former reign he was given special respect and granted forty separate households.',
    'Xianwen gave him special honor and forty separate households for past merit.',
  ],
  s0781: [
    'In the fourth year of Huangxing the imperial carriage campaigned north; the emperor personally swore the host, but Ni was drunk and the battle array was not in order.',
    'Huangxing 4 the emperor campaigned north and swore the troops; Ni was drunk and the ranks were disorderly.',
  ],
  s0782: [
    'The emperor, because his merit was weighty, especially pardoned him and only removed him from office.',
    'For his great merit the emperor only dismissed him.',
  ],
  s0783: ['In the fourth year of Yanxing he died; son She Sheng inherited.', 'Yanxing 4 he died; son She Sheng inherited.'],
  s0784: [
    'Discussion: Lu Si was famed for wisdom and discernment; Yu did not fall short of the family style, upheld name and integrity by principle, and built his own fame;',
    'Commentary: Lu Si was famed for wisdom; Yu kept the family style, upheld integrity, and made his own name;',
  ],
  s0785: ['His fragrance in records and canons—was it for nothing?', 'His fame in records—was it empty?'],
  s0786: ['Li was loyal to state and lord, a pillar of the realm.', 'Li served state and lord—a pillar of the realm.'],
  s0787: [
    'With loyalty and righteousness he went to hardship as homeward; generations prospered—fame was not empty.',
    'Loyal and righteous, he met hardship like home; the house flourished—fame was earned.',
  ],
  s0788: [
    'Rui and Xiu rose through calm elegance—why at the end did they run wild?',
    'Rui and Xiu rose by calm grace—why run wild at the end?',
  ],
  s0789: ['Zizhang\'s fine end—family renown greatly stirred.', 'Zizhang\'s good death shook the family name.'],
  s0790: [
    'Yang and Yanshi both took filial piety as root; fame in coming forth and withdrawal both could model human relations.',
    'Yang and Yanshi rooted in filial piety—coming forth or staying back, both could model the world.',
  ],
  s0791: ['Shuang\'s learning had a name—also men\'s praise.', 'Shuang\'s scholarship was heard—men praised him too.'],
  s0792: [
    'Yuan He was imposing—not only martial bearing; see how he aided Wencheng on the throne, checked abdication in court—nearly a minister of the altars.',
    'Yuan He was imposing—not mere martial show; he raised Wencheng and checked abdication in court—a pillar of the state.',
  ],
  s0793: [
    'Huai combined strategy and talent, fame inside and out, followed worthy traces without failing forebears.',
    'Huai joined strategy and talent, won fame at court and border, and did not shame his fathers.',
  ],
  s0794: ['Ziyong\'s merit stood in the Xia regions; he died on the Jizhou plain.', 'Ziyong won the Xia frontier and died in Jizhou fields.'],
  s0795: ['Biao was famed in Qi.', 'Biao shone in Qi.'],
  s0796: ['Shi and Xiong\'s offices matured in Sui—beautiful.', 'Shi and Xiong finished their careers in Sui—fine indeed.'],
  s0797: ['Liu Ni was loyal to the state—was it only for fierce valor?', 'Liu Ni served the state—was it only for fighting?'],
  s0798: [
    'Xue Ti\'s upright counsel and loyal plot met harm from villainous eunuchs—painful!',
    'Xue Ti\'s loyal counsel died at eunuch hands—how painful!',
  ],
};

function build(map, startId, count, outPath, batchTxt) {
  const lines = fs.readFileSync(batchTxt, 'utf8').trim().split('\n');
  const entries = [];
  for (let i = 0; i < count; i++) {
    const id = `s${String(startId + i).padStart(4, '0')}`;
    const pair = map[id];
    if (!pair) throw new Error(`Missing ${id}`);
    const lineId = lines[i]?.split('\t')[0];
    if (lineId && lineId !== id) throw new Error(`Line mismatch ${lineId} vs ${id} at ${i}`);
    entries.push({ id, literal: pair[0], idiomatic: pair[1] });
  }
  fs.writeFileSync(outPath, JSON.stringify(entries, null, 2) + '\n');
  return entries;
}

const b7 = build(T7, 601, 100, '/workspace/translations/patches/beishi-028-batch7.json', '/tmp/beishi028-batch7.txt');
const b8 = build(T8, 701, 98, '/workspace/translations/patches/beishi-028-batch8.json', '/tmp/beishi028-batch8.txt');

function report(entries, label) {
  const longIdent = entries.filter((e) => e.literal.length > 50 && e.literal.trim() === e.idiomatic.trim());
  const longDiff = entries.filter((e) => e.literal.length > 50 && e.literal.trim() !== e.idiomatic.trim());
  console.log(
    JSON.stringify({
      label,
      first: entries[0].id,
      last: entries[entries.length - 1].id,
      count: entries.length,
      longIdentical: longIdent.length,
      longIdenticalIds: longIdent.map((e) => e.id),
      longOver50: entries.filter((e) => e.literal.length > 50).length,
      longDiff: longDiff.length,
    })
  );
}

report(b7, 'batch7');
report(b8, 'batch8');
