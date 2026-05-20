#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 56, Biography 50',
    'Book of Liang, Volume 56, Biography 50',
  ],
  s0002: [
    'Your servant has heard that when the limbs and trunk function as one, the four seas are at peace;',
    'I have heard that when the body and its limbs move as one, the realm is at peace;',
  ],
  s0003: [
    'when superiors and subordinates harbor mutual suspicion and divided loyalty, the borders are torn asunder.',
    'when those above and below doubt one another, the frontiers split apart.',
  ],
  s0004: [
    'Thus when the Duke of Zhou and the Duke of Shao shared one virtue, the tribute of Yuechang arrived.',
    'When the Duke of Zhou and the Duke of Shao stood together in virtue, distant Yuechang sent tribute.',
  ],
  s0005: [
    'When Fei and E turned their hearts away from each other, the feudal lords rebelled.',
    'When Fei and E fell out, the lords turned against their king.',
  ],
  s0006: [
    'This is surely the cause of success or failure—true in ancient times as in our own, as if traced with one brushstroke.',
    'This is what decides triumph and ruin—the same in every age, as though drawn with a single stroke.',
  ],
  s0007: [
    'Long ago I stood shoulder to shoulder with Grand Chancellor Prince Gao of Wei, exerting our strength together to quell disasters and calamities, supporting the endangered sovereign and bearing him aloft, bolstering the altars of state.',
    'Once I fought side by side with Wei\'s Grand Chancellor Prince Gao to put down rebellion, save the throne, and uphold the realm.',
  ],
  s0008: [
    'After the restoration, there was no campaign from which I was absent;',
    'Since the restoration I have joined every campaign;',
  ],
  s0009: [
    'and from the Tianping era until now, whenever action was needed I went out first.',
    'and from the Tianping era onward I have always been first into the field.',
  ],
  s0010: [
    'In sieges I always took the cities; in field battles I always annihilated the foe.',
    'Every siege fell; every battle ended in the enemy\'s destruction.',
  ],
  s0011: [
    'My sinews and strength were consumed upon saddle and armor; loyalty and constancy were drained to the last inch of my heart.',
    'I wore out my body in saddle and mail and spent every ounce of loyalty I had.',
  ],
  s0012: [
    'Riding the tide of opportunity, I rose to the rank of chief minister beside the tripod;',
    'Fortune raised me to stand beside the throne as chief minister;',
  ],
  s0013: [
    'I ought by rights to have sworn to die and exhaust my integrity, repaying in full the grace of my times—head smashed, entrails spilled, passing without a second thought.',
    'I should have sworn to die where honor required, repaying every debt with my life and never wavering.',
  ],
  s0014: [
    'How then to speak of ink and brush, and in a single day set forth such things?',
    'Why must I put this to writing, all at once, on a day like this?',
  ],
  s0015: [
    'What I regret is that righteousness finds no place for my death—a thing no true warrior would undertake.',
    'What grieves me is that there is no honorable place left for me to die—the sort of death no true man would choose.',
  ],
  s0016: [
    'I do not cherish my life, but I fear dying to no purpose.',
    'I do not cling to life; I only fear that death would accomplish nothing.',
  ],
  s0017: [
    'Yet the Grand Chancellor has fallen ill, and government passes to his son Cheng.',
    'But the Grand Chancellor is ill, and power has passed to his son Cheng.',
  ],
  s0018: [
    'Cheng is by nature devious and jealous; at every turn he suspects and envies. Fawners and flatterers advance in succession, joining to fabricate slanders.',
    'Cheng is suspicious and cruel by nature. Flatterers crowd in one after another and together weave false accusations.',
  ],
  s0019: [
    'Though my preparations were not yet complete, repeated letters summoned me—',
    'Before my plans were fully laid, letter after letter summoned me—',
  ],
  s0020: [
    'heedless of the altars\' safety or peril, concerned only that his private faction not take root.',
    'indifferent to the realm\'s safety, caring only to secure his own house.',
  ],
  s0021: [
    'With sweet words and rich gifts he plotted to destroy the loyal and upright.',
    'With honeyed speech and heavy bribes he sought to destroy every loyal man.',
  ],
  s0022: [
    'If his father should die, how would he still grant me a place?',
    'If his father dies, what place will he leave for me?',
  ],
  s0023: [
    'Fearing slander and dreading execution, I refused to return. Thereupon I reviewed troops at the Ru and Ying rivers and raised banners across Zhou and Han territory.',
    'Afraid of false charges and of being killed, I would not go back. I gathered my army on the Ru and Ying and marched under my banners through Zhou and Han.',
  ],
  s0024: [
    'In league with Inspector of Yuzhou Gao Cheng, Inspector of Guangzhou Lang Chun, Inspector of Xiangzhou Li Mi, Inspector of Yanzhou Xing Zicai, Inspector of South Yanzhou Shi Changxuan, Inspector of Qizhou Xu Jiliang, Inspector of East Yuzhou Qiu Yuanzheng, Inspector of Luozhou Zhu Hunyuan, Inspector of Yangzhou Le Xun, Inspector of North Jingzhou Mei Jichang, Inspector of North Yangzhou Yuan Yuanhe, and others—all governors of Henan, chiefs of great provinces—each secretly forming private designs, meeting like shadows at an appointed hour, feeding horses and hiding weapons, awaiting the moment to strike.',
    'Together with the inspectors Gao Cheng of Yuzhou, Lang Chun of Guangzhou, Li Mi of Xiangzhou, Xing Zicai of Yanzhou, Shi Changxuan of South Yanzhou, Xu Jiliang of Qizhou, Qiu Yuanzheng of East Yuzhou, Zhu Hunyuan of Luozhou, Le Xun of Yangzhou, Mei Jichang of North Jingzhou, Yuan Yuanhe of North Yangzhou, and other great lords of Henan, each has made secret plans, matched his timing to the rest, readied horses and hidden arms, and waits only for the signal to rise.',
  ],
  s0025: [
    'East of Hangu Pass, west of Xiaqiu—all wish to submit in sincerity to the sacred court, rest their shoulders under righteous rule, join strength with one heart, dying without a second loyalty.',
    'From east of Hangu to west of Xiaqiu, all long to return to the imperial court, find rest under a righteous sovereign, and fight as one to the death.',
  ],
  s0026: [
    'Only Qing and Xu provinces need a folded letter—one post station\'s ride and they come, without need of grand strategy.',
    'Only Qing and Xu need a brief summons; one courier ride will bring them in, with no great campaign required.',
  ],
  s0027: [
    'Moreover my rift with the Gao clan is already fixed; when amid trouble they summoned me, I did not go before, and even if relations were mended, reconciliation would never be reasonable.',
    'My breach with the Gao house is already complete. They summoned me once in crisis and I refused; even if peace were restored, there would be no lasting trust.',
  ],
  s0028: [
    'South of the Yellow River is my command—turning it over is as easy as turning one\'s palm; winning them over is not difficult.',
    'South of the Yellow River lies the territory under my command. To turn it over would be as easy as turning my hand; winning the people would not be hard.',
  ],
  s0029: [
    'The ministers look up with longing, waiting for me to lead the chorus.',
    'The officials look to me and wait for my signal.',
  ],
  s0030: [
    'If Qi and Song are pacified in one stroke, Yan and Zhao can be handled afterwards.',
    'Once Qi and Song are settled, Yan and Zhao can be dealt with in turn.',
  ],
  s0031: [
    'Your Majesty\'s heavenly net opens wide; the realm is becoming one script and one track. Hearing this brief sincerity, you should respond with outpouring grace.',
    'Your Majesty\'s net of Heaven is broad, and the realm is moving toward unity. I beg you to receive this small pledge with overflowing mercy.',
  ],
  s0032: [
    'When Ding He arrived, Gaozu convened the ministers for court deliberation.',
    'When Ding He arrived, Gaozu called the ministers into court to debate the matter.',
  ],
  s0033: [
    'Deputy Director of the Masters of Writing Xie Ju and the hundred officials deliberated—all said accepting Hou Jing was inadvisable; Gaozu did not follow that counsel and accepted Jing.',
    'Vice Minister Xie Ju and the whole court argued that taking Hou Jing in would be unwise. Gaozu rejected their advice and received him.',
  ],
  s0034: [
    'When Qi Shenwu died, his son Cheng succeeded—this is Emperor Wenxiang.',
    'When Gao Huan of Northern Qi died, his son Cheng succeeded him as Emperor Wenxiang.',
  ],
  s0035: [
    'Gaozu then issued an edict enfeoffing Jing as Prince of Henan, Great General, Bearer of the Staff with discretionary powers, Director Supervisor of military affairs north and south of Henan, Grand Commandery Platform, empowered to act on imperial mandate as in the precedent of Deng Yu, granted one suite of martial music.',
    'Gaozu then enfeoffed Jing as Prince of Henan and Great General, gave him the staff with full discretion, made him director of all military affairs north and south of the Yellow River, and set up a Grand Commandery Platform with authority to act on imperial mandate after the model of Deng Yu, along with one suite of martial music.',
  ],
  s0036: [
    'Qi Wenxiang sent Great General Murong Shaozong to besiege Jing at Changshe; Jing requested Western Wei aid; Western Wei sent its Prince of Wucheng Yuan Qing with troops to rescue; Shaozong then withdrew.',
    'Emperor Wenxiang sent Great General Murong Shaozong to besiege Jing at Changshe. Jing asked Western Wei for help, and Western Wei sent Prince Yuan Qing of Wucheng with an army to relieve him. Shaozong then withdrew.',
  ],
  s0037: [
    'Jing again requested troops from Inspector of Sizhou Yang Yaren; Yaren sent Senior Clerk Deng Hong with troops to the Ru River; Yuan Qing\'s army fled by night.',
    'Jing asked Inspector Yang Yaren of Sizhou for troops as well. Yaren sent Senior Clerk Deng Hong to the Ru River, and Yuan Qing\'s army fled overnight.',
  ],
  s0038: [
    'Thereupon he held Xuanyong and Xiangcheng, requesting dispatch of governors to garrison them.',
    'He then held Xuanyong and Xiangcheng and asked that inspectors be sent to garrison them.',
  ],
  s0039: [
    'An edict made Yang Yaren Inspector of Yu and Si provinces, transferred to garrison Xuanyong;',
    'An edict appointed Yang Yaren inspector of Yu and Si and moved him to garrison Xuanyong;',
  ],
  s0040: [
    'Administrator of Xiyang Yang Sijian made Inspector of Yin province, garrisoning Xiangcheng.',
    'and made Yang Sijian, administrator of Xiyang, inspector of Yin with his seat at Xiangcheng.',
  ],
  s0041: [
    'Wei having just lost its commander, and Jing having offered Henan in submission, Qi Wenxiang feared Jing would ally with west and south, becoming his trouble, and sent a letter admonishing Jing:',
    'Wei had just lost its commander, and Jing had surrendered Henan to the Liang. Wenxiang feared that Jing would join forces with Western Wei and the Liang, and so he sent a letter to reason with him:',
  ],
  s0042: [
    'I have heard that position is the great treasure, and holding it is not easy;',
    'It is said that high rank is a great treasure, and to keep it is no easy thing;',
  ],
  s0043: [
    'benevolence and sincerity are heavy burdens, and seeing them through is truly hard.',
    'and that duty and good faith are heavy charges, hard to carry to the end.',
  ],
  s0044: [
    'Some kill themselves to achieve fame, some forsake food to preserve faith;',
    'Some give their lives to preserve their name; some go hungry to keep their word;',
  ],
  s0045: [
    'they liken life to a goose feather and integrity to a bear\'s paw.',
    'they weigh life against a goose feather and honor against a bear\'s paw.',
  ],
  s0046: [
    'When such is the case, every act loses no virtue, every move commits no fault;',
    'When men act thus, they keep their virtue intact and make no misstep;',
  ],
  s0047: [
    'advancing, one meets no hatred; retreating, one bears no slander.',
    'going forward they earn no hatred; stepping back they leave no reproach.',
  ],
  s0048: [
    'The former king and the Marshal shared hardship through distant perils; I treated you as a son, favoring you exclusively, binding our hearts in close affection, speaking in intimate counsel through the night—righteousness running from start to finish, affection enduring through the cold season.',
    'My father and you, Marshal, shared every danger together. I regarded you as one of my own and favored you above others, bound to you in close trust and long counsel. Our bond ran from beginning to end, and did not fade with the years.',
  ],
  s0049: [
    'The Marshal from youth to age, from obscurity to prominence—we grew together; this was not without grace and merit.',
    'You, Marshal, rose from humble beginnings to great standing, and we grew up together. That history was not without kindness and reward.',
  ],
  s0050: [
    'Already ennobled as Full Marquis, rank marked at the highest tier, gate worthy of four horses, hall feasting on ten thousand zhong—wealth enriching the village, glory covering kin.',
    'You were ennobled as a full marquis, given one of the highest ranks, a gate fit for four-horse carriages, and a household fed from ten thousand zhong. Wealth flowed to your kin, and honor spread through your clan.',
  ],
  s0051: [
    'Matching spirits, valued in human bonds, moved by one who knows you, righteousness lies in forgetting the self.',
    'Kindred souls are prized among men. When one finds a true patron, honor demands that he forget himself.',
  ],
  s0052: [
    'Those regarded as champions of the realm set the standard of lacquered body;',
    'A man honored as champion of the state will even lacquer his flesh for his lord;',
  ],
  s0053: [
    'those given a basket of rice perform the service of supporting the wheel hub.',
    'and one who receives even a basket of food will repay it by bracing the chariot wheel.',
  ],
  s0054: [
    'If even such things cannot be stopped, how much more weighty is this!',
    'If such obligations cannot be cast aside, how much heavier is the debt between us!',
  ],
  s0055: [
    'On the strength of old friendship, I wish to entrust my sons and grandsons to you, becoming match like Qin and Jin, forming kinship like Liu and Fan.',
    'Out of old friendship I would entrust my sons and grandsons to you, binding our houses like Qin and Jin, joining our fates like Liu and Fan.',
  ],
  s0056: [
    'Suppose days pass and months come, times shift and generations change; the gate lacks strong shade, the household has young orphans—still I would add jade bi without withholding, divide houses to aid, not forgetting former merit, to comfort those who come after.',
    'Even if time passed, fortunes turned, and my house were left with only weak protection and young orphans, I would still give jade without stint, share my home to help you, remember past kindness, and care for those who came after.',
  ],
  s0057: [
    'Yet I hear you lean on your staff and walk singing, already glancing back like a wolf, biting like a dog—in name achieving nothing, in righteousness gaining nothing; not treading the path of loyal ministers, but casting yourself into the land of rebels.',
    'Yet I hear that you lean on your staff and sing as you walk, already looking back like a wolf and snapping like a dog. You win nothing in reputation and gain nothing in honor. You leave the path of loyal ministers and cast yourself among rebels.',
  ],
  s0058: [
    'Strength insufficient to strengthen yourself, momentum insufficient to protect yourself;',
    'You are not strong enough to stand alone, nor powerful enough to defend yourself;',
  ],
  s0059: [
    'leading a motley crowd, placing yourself in danger like piled eggs.',
    'you lead a rabble and stand in peril as fragile as a tower of eggs.',
  ],
  s0060: [
    'West you beg rescue from Heitai, south you ask aid from the Xiao clan—with a fox\'s suspicious heart, doing a first-and-last-mouse\'s deed.',
    'To the west you beg Yuwen Tai for help; to the south you ask the Xiao for rescue. With a wavering heart you play both sides at once.',
  ],
  s0061: [
    'Enter Qin and the Qin people will not hold you; return to Wu and the Wu people will not trust you.',
    'Go west and the westerners will not keep you; turn south and the southerners will not trust you.',
  ],
  s0062: [
    'Looking at the present together, none see it feasible; not knowing in the end how long you can hold this or where you will go.',
    'Seen clearly, none of this can succeed. In the end, how long can you hold on, and where will you go?',
  ],
  s0063: [
    'Pushing our hearts\' true intent, you surely should not act thus.',
    'If you search your own heart, you cannot truly mean to go on like this.',
  ],
  s0064: [
    'Surely this is one who cannot have his way, twisting words at the mouth, then harboring market-tiger suspicions, then falling into the delusion of casting away the pestle.',
    'Surely some schemer has twisted your ear, planted false rumors, and driven you into needless fear.',
  ],
  s0065: [
    'Recently your conduct has made things visible; people mutually suspect and err; I think you perceive this yourself. Your entire household, great and small, is handed over to the Minister of Justice.',
    'Your recent actions have already shown your intent, and everyone sees the mistake. I think you know it yourself. Your whole household, great and small, has been handed over to the Minister of Justice.',
  ],
  s0066: [
    'Recently I merely ordered a detached division as vanguard to chastise; South Yan and Yangzhou were recovered as expected.',
    'Not long ago I sent a vanguard force against you, and South Yan and Yangzhou fell back into our hands at once.',
  ],
  s0067: [
    'I intended to seize the moment and drive long-distance to Xuanyong;',
    'I meant to press on at once to Xuanyong;',
  ],
  s0068: [
    'owing to the scorching heat, I plan for later.',
    'but the heat forced me to wait and plan for another day.',
  ],
  s0069: [
    'Relying on the state\'s numinous power, I march Heaven\'s punishment; weapons refined and new, soldiers and horses strong and flourishing.',
    'Backed by the fortune of the state, I shall march under Heaven\'s judgment with fresh arms and strong horses.',
  ],
  s0070: [
    'Inside and outside moved by virtue, above and below of one heart—three orders and five proclamations, one could tread boiling water and fire.',
    'Within and without answer to virtue, and high and low are of one mind. With repeated commands my men would walk through fire.',
  ],
  s0071: [
    'If banners and drums face each other, dust and ash connect, the momentum like pouring snow on boiling water, the affair like pouring water on fireflies.',
    'If our banners meet and our dust clouds join, your force will melt like snow on boiling water and fail like water poured on embers.',
  ],
  s0072: [
    'The clear-sighted leave danger for safety; the wise turn disaster into blessing.',
    'The clear-eyed leave danger for safety; the wise turn ruin into blessing.',
  ],
  s0073: [
    'Better that I wrong others than that others wrong me.',
    'Better that I wrong another than that another wrong me.',
  ],
  s0074: [
    'Open the gate of accepting good counsel; decisively change the path of former confusion.',
    'Open the door to good counsel and leave the road of your former error.',
  ],
  s0075: [
    'Now I wash my heart and clear my intent, removing suspicion and evil—I think you still harbor doubts and are not yet ready to believe.',
    'I speak now with a cleared heart and without malice. Yet I know you still doubt me and are not ready to believe.',
  ],
  s0076: [
    'If you can roll up your armor and come to court, hang your quiver and return to the palace, I will grant you Inspector of Yuzhou.',
    'If you lay down your arms, come to court, and return in peace, I will make you inspector of Yuzhou.',
  ],
  s0077: [
    'Even for your whole lifetime, the civil and military under your command will not be pursued further.',
    'For the rest of your life none of the officers and soldiers once under you will be pursued.',
  ],
  s0078: [
    'Advancing, you preserve rank and salary; retreating, you lose no fame and merit.',
    'Come forward and you keep your rank and pay; step back and you lose neither honor nor credit.',
  ],
  s0079: [
    'Your clan and kin at the gate can be unharmed;',
    'Your family at home may remain unharmed;',
  ],
  s0080: [
    'cherished wife and beloved sons will also be sent back to you.',
    'your wife and children will be returned to you as well.',
  ],
  s0081: [
    'Still we become connected families, finally forming cordial friendship.',
    'We shall again be joined as one house and become close friends.',
  ],
  s0082: [
    'What I do not eat in word is as the bright sun.',
    'What I promise I do not break—my word is as clear as the sun.',
  ],
  s0083: [
    'You could not seal Hangu eastward nor declare yourself sovereign southward; subject to others, your prestige and name are suddenly exhausted.',
    'You could not hold Hangu in the east or rule in the south on your own. Now, dependent on others, your power and name are spent.',
  ],
  s0084: [
    'In vain your brothers, sons, and nephews—feet and heads in different gates, hair white before their time, sharing the same torment—hearers sour the nose, viewers chill the heart; how much more for blood kin—can there be no shame?',
    'Your brothers, sons, and nephews will be scattered to different fates, worn white before their time, and ruined alike. Those who hear of it will weep; those who see it will shudder. For your own flesh and blood, can there be no shame?',
  ],
  s0085: [
    'I should not today be sending this letter, but I saw Cai Zundao\'s report: the Marshal originally had no heart to go west, deeply regretted the calamity, heard Western troops were coming, sent Zunda to the Xiao Mountains to assess their numbers;',
    'I would not be writing this now, but Cai Zundao told me that you never truly meant to go west, that you deeply regretted what had happened, and that when you heard Western Wei was marching you sent Zundao into the Xiao Mountains to learn how many they were;',
  ],
  s0086: [
    'if few, join strength with them; if many, prepare further against them.',
    'if they were few, you would join them; if many, you would prepare against them.',
  ],
  s0087: [
    'Also: when Senior Clerk Fang was there, the Marshal once wished to send a letter, intending to reform and renew himself.',
    'He also said that while Senior Clerk Fang was with you, you once meant to send a letter and turn back to the right path.',
  ],
  s0088: [
    'He had already dispatched Li Longren, about to send him off; hearing Fang was far away, he stopped the sending.',
    'You had already sent Li Longren and were about to dispatch him, but when you learned Fang was far away you halted the message.',
  ],
  s0089: [
    'I do not know whether Zundao\'s words are false or true, but having heard something, I cannot fail to tell you fully.',
    'I do not know whether Zundao spoke truth or falsehood, but since I have heard this I cannot keep it from you.',
  ],
  s0090: [
    'The logic of fortune and calamity—I think you should plot it yourself.',
    'The way fortune and ruin turn—surely you will judge that for yourself.',
  ],
  s0091: [
    'Jing replied in a letter:',
    'Jing answered in a letter:',
  ],
  s0092: [
    'I have heard that establishing oneself and spreading one\'s name—that is righteousness;',
    'It is said that to stand with honor and leave a name behind is righteousness;',
  ],
  s0093: [
    'what one treasures in the person—that is life.',
    'and that what a man holds dear in his own body is life.',
  ],
  s0094: [
    'If the deed accords with righteousness, the man of integrity does not spare his body;',
    'When the cause is just, a man of honor does not spare himself;',
  ],
  s0095: [
    'when punishments are perverse, the gentleman truly cherishes his life.',
    'but when punishment is unjust, even a gentleman will guard his life.',
  ],
  s0096: [
    'In old times Weizi went mad and left Yin; Chen Ping harbored wisdom and betrayed Chu—there was good reason for this.',
    'Long ago Weizi feigned madness and quit Yin; Chen Ping used his wit and turned from Chu. They had cause.',
  ],
  s0097: [
    'I am a common cloth-clad man of the countryside, by nature unsuited to arts and utility.',
    'I am a plain countryman, ill suited by nature to polished arts.',
  ],
  s0098: [
    'At first meeting the Heavenly Pillar, I was graced with counsel in the command tent;',
    'When I first met the Heavenly Pillar, I was honored with a place in the command tent;',
  ],
  s0099: [
    'late encountering Yongxi, I was entrusted with the charge of arms.',
    'and later, in the Yongxi era, I was entrusted with command of the army.',
  ],
  s0100: [
    'Born to serve the state, spanning two decades, braving danger and treading hardship—how would I avoid wind and frost?',
    'I entered service for the state more than twenty years ago, facing danger and hardship without shrinking from wind or frost.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_056_b1.mjs <translation.json>'
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
