#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Zhang Hongce',
    'Zhang Hongce',
  ],
  s0002: [
    'Zhang Hongce, styled Zhenjian, was a native of Fangcheng in Fanyang, a younger cousin on his mother\'s side of Empress Wenxian.',
    'Zhang Hongce, styled Zhenjian, came from Fangcheng in Fanyang—a maternal cousin of Empress Wenxian.',
  ],
  s0003: [
    'From childhood he was famed for filial piety.',
    'As a boy he was known for filial devotion.',
  ],
  s0004: [
    'Once when his mother fell ill, for five days she would not eat, and Hongce would not eat either.',
    'When his mother fell ill she refused food for five days, and Hongce refused food as well.',
  ],
  s0005: [
    'His mother forced him to take gruel; only then did he eat what she had left.',
    'She made him swallow porridge; he ate only what remained of hers.',
  ],
  s0006: [
    'In mourning for his mother, for three years he ate neither salt nor vegetables, nearly to the point of destroying his life.',
    'In mourning for his mother he took no salt or greens for three years, almost to death.',
  ],
  s0007: [
    'The brothers were affectionate and could not bear brief separation; though each had his own household, they often slept and rose together, and the age compared them to the Jiang Gong brothers.',
    'The brothers loved one another and hated to part even briefly; though each had a home, they usually slept and rose together—the age likened them to the Jiang Gong brothers.',
  ],
  s0008: [
    'He first entered office as Attendant of the Prince of Shaoling\'s kingdom in Qi, and was transferred to Court Attendant and Acting Staff Officer to the Western Zhonglang General, Prince of Jiangxia.',
    'He began as an attendant in Qi\'s Prince of Shaoling kingdom, then became court attendant and acting staff officer to the Western Zhonglang General, Prince of Jiangxia.',
  ],
  s0009: [
    'Hongce was of an age with Gaozu; from youth they were intimate, and he constantly followed Gaozu in his comings and goings.',
    'Hongce was Gaozu\'s contemporary; as youths they were close, and Hongce was always at Gaozu\'s side.',
  ],
  s0010: [
    'Whenever he entered a room he would feel as though cloud and mist were present; his person would at once grow solemn, and from this Hongce came to hold Gaozu in special regard.',
    'Each time he stepped into a room he seemed to sense cloud and mist; his bearing turned grave, and from that he revered Gaozu the more.',
  ],
  s0011: [
    'At the end of Jianwu, Hongce kept overnight with Gaozu; when wine was deep they moved their mats under the stars and spoke of the times.',
    'Late in Jianwu, Hongce lodged with Gaozu; drunk, they shifted their seats beneath the stars and talked of the age.',
  ],
  s0012: [
    'Hongce then asked Gaozu: "What do the celestial signs say?',
    'Hongce asked Gaozu, "What do the omens say?',
  ],
  s0013: [
    'Will the state in fact be unharmed?',
    'Will the realm truly be safe?',
  ],
  s0014: [
    '" Gaozu said: "Can that be spoken?',
    '" Gaozu said, "Can such things be said aloud?',
  ],
  s0015: [
    '" Hongce said: "Please speak the omens.',
    '" Hongce said, "Then tell me the signs.',
  ],
  s0016: [
    '" Gaozu said: "North of Han there is an omen of lost territory; east of Zhe there is an omen of urgent arms.',
    '" Gaozu said, "North of the Han the land will slip away; east of Zhe urgent armies will rise.',
  ],
  s0017: [
    'This coming early winter Wei is certain to move;',
    'Early this winter Wei will surely stir;',
  ],
  s0018: [
    'if it moves, the north of Han will be lost.',
    'and if it moves, the north of Han is gone.',
  ],
  s0019: [
    'The emperor is now long ill, and many dissenting voices are heard; should anyone seize the chance, the Kuaiji region too will rise—but it will accomplish nothing, only drive men to destroy one another.',
    'The emperor has been ill long, and talk runs every way; if someone seizes the moment, Kuaiji may rise too—yet it will win nothing, only purge itself in vain.',
  ],
  s0020: [
    'Next year the capital will know disorder; the dead will outnumber tangled hemp; Qi\'s allotted span ends here.',
    'Next year the capital will fall into chaos; corpses will outnumber knotted hemp; Qi\'s fate ends with this.',
  ],
  s0021: [
    'Liang, Chu, and Han will see heroes rise.',
    'In Liang, Chu, and Han heroes will rise.',
  ],
  s0022: [
    '" Hongce said: "Where is the hero now?',
    '" Hongce said, "Where is that hero now?',
  ],
  s0023: [
    'Already in wealth and rank, or still in the thatched hut?',
    'Already rich and honored, or still in the grass?',
  ],
  s0024: [
    '" Gaozu laughed and said: "Guangwu once said, \'How do you know it is not I?\'',
    '" Gaozu laughed. "Guangwu said, \'How do you know it is not me?\'',
  ],
  s0025: [
    '" Hongce rose and said: "Tonight\'s words are Heaven\'s will.',
    '" Hongce stood. "Tonight\'s speech is Heaven\'s decree.',
  ],
  s0026: [
    'Please fix lord and minister\'s roles.',
    'Let us settle lord and minister now.',
  ],
  s0027: [
    '" Gaozu said: "Uncle, do you wish to imitate Deng Chen?',
    '" Gaozu said, "Uncle—do you mean to play Deng Chen?',
  ],
  s0028: [
    'That winter Wei troops raided Xinye; Gaozu led an army in relief and, on a secret order, replaced Cao Hu as inspector of Yongzhou.',
    'That winter Wei struck Xinye; Gaozu marched to relieve it and, on secret orders, took Yongzhou in place of Cao Hu.',
  ],
  s0029: [
    'Hongce heard it with joy and told Gaozu: "The words of that night should alone be proved.',
    'Hongce was delighted and told Gaozu, "What we said that night is about to come true.',
  ],
  s0030: [
    '" Gaozu laughed and said: "For now, say no more.',
    '" Gaozu laughed. "Say no more—for now.',
  ],
  s0031: [
    'Hongce followed Gaozu west, still taking part in the command tent, personally sharing in campaigns and not shirking hardship.',
    'Hongce followed Gaozu west, served in the command tent, and shared the hardships of every campaign.',
  ],
  s0032: [
    'In the autumn of the fifth year Mingdi died; the testamentary edict made Gaozu inspector of Yongzhou, and he memorialized Hongce as Recording Secretary and concurrent magistrate of Xiangyang.',
    'In autumn of year five Mingdi died; by his final edict Gaozu became inspector of Yongzhou and named Hongce recording secretary with concurrent charge of Xiangyang.',
  ],
  s0033: [
    'Gaozu saw the realm falling into disorder and bore a heart to set it right; he secretly made stores and laid plans—and in all of this only Hongce was consulted.',
    'Gaozu saw chaos spread across the land and meant to rescue it; he stocked supplies in secret and weighed every plan with Hongce alone.',
  ],
  s0034: [
    'At the time the Xuanwu Prince of Changsha had left Yizhou and returned, and again served as Western Zhonglang long-term staff officer with acting charge of Ying province affairs.',
    'The Xuanwu Prince of Changsha had just left Yizhou and again held the Western Zhonglang long-term staff post, acting for Ying province.',
  ],
  s0035: [
    'Gaozu sent Hongce to Ying to lay the plan before the Xuanwu Prince—the account is in the Annals of Gaozu.',
    'Gaozu sent Hongce to Ying to present the plan to the prince, as told in the Annals of Gaozu.',
  ],
  s0036: [
    'Hongce then urged the prince: "When the Zhou house had declined, the feudal lords strove for power; Duke Huan of Qi was only a middling man, yet he was able to unite the realm in nine gatherings, and the people to this day praise him.',
    'Hongce urged the prince, "When Zhou waned, lords fought for power; Duke Huan of Qi was no more than an ordinary man, yet he united the realm nine times, and men still praise him.',
  ],
  s0037: [
    'Qi\'s virtue is nearly spent; the four seas are in disorder; the fate of the living must find its lord.',
    'Qi\'s virtue is spent; the four seas are in turmoil; the people must have their ruler.',
  ],
  s0038: [
    'Ying province stands at the heart of the midstream; Yong holds horses in abundance; you and your brother are heroic and unmatched today—tiger-like over two provinces, you may divide the realm, gather righteous troops, plead for the people, cast down the benighted and raise the enlightened: it is easier than turning the hand.',
    'Ying lies at the midstream\'s hinge; Yong is rich in war-horses; you and your brother are heroes without peer—hold two provinces like tigers, split the realm, raise righteous arms, plead for the people, topple the dark and set up the bright: as easy as turning your palm.',
  ],
  s0039: [
    'Thus the work of Huan and Wen may be achieved, and an unworldly merit established.',
    'Do that, and the deeds of Huan and Wen are yours, and glory beyond the age is within reach.',
  ],
  s0040: [
    'Do not be duped by a petty fellow and become a laughingstock after death.',
    'Do not let some stripling fool you and make you a jest in later ages.',
  ],
  s0041: [
    'Yongzhou has weighed this to the full; I beg you to plan well.',
    'Yongzhou has thought this through; plan wisely.',
  ],
  s0042: [
    '" The prince was quite displeased yet had no way to refuse.',
    '" The prince was ill pleased but could not refuse.',
  ],
  s0043: [
    'When the righteous army was about to rise, Gaozu at night summoned Hongce and Lü Sengzhen to his house to fix the plan; at dawn he sent out the troops, making Hongce Supporting State General and army commander, commanding ten thousand men to supervise rear-area military affairs.',
    'As the righteous army gathered, Gaozu called Hongce and Lü Sengzhen to his house by night to settle the plan; at dawn he marched, making Hongce Supporting State general and army commander over ten thousand men in charge of the rear.',
  ],
  s0044: [
    'When the Western Headquarters was established, he was made Colonel of Foot Soldiers and transferred to Cavalry and Chariots Advisory Staff Officer.',
    'When the western headquarters was set up, he became colonel of foot soldiers, then cavalry and chariots advisory staff officer.',
  ],
  s0045: [
    'When Ying city was pacified, Xiao Yingda, Yang Gongze, and the other generals all wished to halt the army at Xiakou; Gaozu held that they should press the advantage in a long drive straight at the capital, and he spoke the plan to Hongce—Hongce agreed with Gaozu.',
    'After Ying fell, Xiao Yingda and Yang Gongze wanted to camp at Xiakou; Gaozu meant to drive the victory straight to the capital and told Hongce, who agreed.',
  ],
  s0046: [
    'He also consulted Pacify the Distant General Yu Yu; Yu too agreed.',
    'He also asked Pacify the Distant general Yu Yu, who agreed as well.',
  ],
  s0047: [
    'He then ordered the host to march that very day; along the river to Jiankang, every ford, harbor, and village—where the army halted, encamped, or pitched its posts—Hongce had mapped in advance, all within his eye.',
    'He ordered the armies to march at once; from the river to Jiankang, every ford, beach, and hamlet where men camped or halted, Hongce had charted beforehand and held it all in mind.',
  ],
  s0048: [
    'When the righteous army reached Xinlin, Wang Mao and Cao Jingzong were fighting at the Great Crossing; Gaozu sent Hongce with staff insignia to encourage them, and the host was everywhere roused.',
    'At Xinlin, Wang Mao and Cao Jingzong fought at the Great Crossing; Gaozu sent Hongce with staff to hearten them, and all fought the harder.',
  ],
  s0049: [
    'That day they again broke the Vermilion Bird army.',
    'That same day they broke the Vermilion Bird force again.',
  ],
  s0050: [
    'Gaozu entered and encamped at Shitou city; Hongce garrisoned the gates in guard, received and guided men of rank, and many were wholly spared.',
    'Gaozu encamped at Shitou; Hongce held the gates, received scholars and gentry, and saved many from harm.',
  ],
  s0051: [
    'When the city was pacified, Gaozu sent Hongce and Lü Sengzhen ahead to clear the inner palace and seal and inspect the treasuries.',
    'When the city fell, Gaozu sent Hongce and Lü Sengzhen first into the inner palace to seal the treasuries.',
  ],
  s0052: [
    'At the time treasures within the walls lay heaped; Hongce strictly warned his command, and not a hair was taken.',
    'Treasures lay piled within the walls; Hongce forbade his men strictly, and nothing was touched.',
  ],
  s0053: [
    'He was transferred to Commandant of the Guards, with additional appointment as Attendant Within the Yellow Gates.',
    'He was made commandant of the guards and also attendant within the yellow gates.',
  ],
  s0054: [
    'At the beginning of Tianjian he was given additional title as Scattered Cavalry Attendant and Marquis of Taoyang county with a fief of two thousand two hundred households.',
    'Early in Tianjian he was also made scattered cavalry attendant and marquis of Taoyang with two thousand two hundred households.',
  ],
  s0055: [
    'Hongce gave loyal service above and knew nothing he would not do; with friends and old acquaintances he promoted each according to talent, and the gentry all flocked to him.',
    'Hongce served with full loyalty and left nothing undone; he raised friends and old ties by their gifts, and the gentry gathered to him.',
  ],
  s0056: [
    'At the time the remnant partisans of Dong Hun had just received an amnesty and many were still uneasy; several hundred men, using reed transport, bundled torches and weapons, entered the Southern and Northern Side Gates to make trouble, burning Shenhu Gate and Zongzhang View.',
    'Dong Hun\'s remnant followers had just been pardoned and many still feared for their lives; several hundred, under cover of reed transport, smuggled torches and arms through the side gates, burned Shenhu Gate and Zongzhang View, and rose in revolt.',
  ],
  s0057: [
    'Front Army Chief Clerk Lü Sengzhen was on duty within the palace and, with the night guard, repelled and broke them; the robbers split and entered the Commandant of the Guards\' office—Hongce was then fighting the fire, and a robber stole behind and killed him, aged forty-seven.',
    'Front army chief clerk Lü Sengzhen held the inner palace with the night guard and broke them; robbers slipped into the commandant\'s quarters while Hongce fought the blaze—a thief crept behind and killed him. He was forty-seven.',
  ],
  s0058: [
    'Gaozu mourned him deeply.',
    'Gaozu grieved for him bitterly.',
  ],
  s0059: [
    'He granted one residence in the first ward, one suit of clothes, one hundred thousand cash, one hundred bolts of cloth, and two hundred jin of wax.',
    'He granted a house in the first ward, a suit of robes, one hundred thousand cash, one hundred bolts of cloth, and two hundred jin of wax.',
  ],
  s0060: [
    'An edict said: "The late maternal uncle, Commandant of the Guards, was struck down in a moment of heedlessness by evil minions.',
    'An edict said, "My late maternal uncle, commandant of the guards, was cut down in a careless hour by wicked men.',
  ],
  s0061: [
    'His reason and bearing were pure and upright, his talent and insight broad and deep; from the provinces he rose to court, sharing hardship through distant trials.',
    'His mind was clear and his conduct straight; his talent ran deep; from the provinces he came to court and shared every trial.',
  ],
  s0062: [
    'Moreover, on my mother\'s side the line had withered and sacrifices were often broken; stirred by the \'Wei-yang\' ode, my feeling rested on him.',
    'My mother\'s kin had dwindled and rites were often broken; reading the Wei-yang, I fixed my heart on him.',
  ],
  s0063: [
    'I was about to rely on his loyal merit to support my slight virtue; he gave no sign of repayment, and my grief only grows.',
    'I meant to lean on his loyal service to shore my slender reign; he answered with no sign, and my sorrow deepens.',
  ],
  s0064: [
    'He may be posthumously granted Scattered Cavalry Attendant and General of Cavalry and Chariots.',
    'Grant him posthumously scattered cavalry attendant and general of cavalry and chariots.',
  ],
  s0065: [
    'Grant one suite of drums and pipes.',
    'Grant one suite of drums and pipes.',
  ],
  s0066: [
    'Posthumous name Lamented."',
    'Posthumous name Lamented."',
  ],
  s0067: [
    'Hongce by nature was generous, open, and direct, and deeply loyal to old ties.',
    'Hongce was generous, frank, and true to old friends.',
  ],
  s0068: [
    'Even when he stood in high and weighty office, he did not raise himself on wealth and power.',
    'Even in great office he never lorded it over others.',
  ],
  s0069: [
    'Old friends and guests he received with the same courtesy as in his days in plain cloth.',
    'Old friends and guests were welcomed as when he wore common cloth.',
  ],
  s0070: [
    'Salary and gifts he gave all away to kin and friends.',
    'Stipends and gifts he scattered among kin and friends.',
  ],
  s0071: [
    'When he met his violent end, none did not grieve for him.',
    'When he was killed, all who knew him mourned.',
  ],
  s0072: [
    'His son Mian succeeded; he has a separate biography.',
    'His son Mian succeeded him; his life is told elsewhere.',
  ],
  s0073: [
    'Yu Yu',
    'Yu Yu',
  ],
  s0074: [
    'Yu Yu, styled Sima Da, was a native of Xinye.',
    'Yu Yu, styled Sima Da, came from Xinye.',
  ],
  s0075: [
    'When the Xuanwu Prince of Changsha was in Liang province, he made Yu recording secretary and concurrent Administrator of Huayang.',
    'When the Xuanwu Prince of Changsha held Liang province, he made Yu recording secretary and concurrent administrator of Huayang.',
  ],
  s0076: [
    'At the time Wei troops besieged Nanzheng; in the province were several dozen empty granaries; Yu sealed and labeled them and showed the troops, saying: "The grain here is all full—enough for two years; only strive to hold firm.',
    'Wei besieged Nanzheng; the province held dozens of empty granaries; Yu sealed them and told the troops, "Every bin is full—two years\' grain. Hold fast.',
  ],
  s0077: [
    '" The host\'s heart was thereby settled.',
    '" The army took heart.',
  ],
  s0078: [
    'When the barbarians withdrew, by merit he was made Feathered Forest Commandant and transferred to Southern Zhonglang headquarters recording secretary.',
    'When the enemy withdrew, he was made feathered forest commandant, then southern Zhonglang headquarters recording secretary.',
  ],
  s0079: [
    'At the end of Yongyuan, Gaozu raised the army and sent a letter summoning Yu.',
    'At the end of Yongyuan Gaozu rose in arms and wrote to summon Yu.',
  ],
  s0080: [
    'When the Western Headquarters was established, he was made Pacify the North General with acting charge of selection and followed Gaozu east.',
    'When the western headquarters was set up, he was made pacify-the-north general with acting charge of selection and followed Gaozu east.',
  ],
  s0081: [
    'When the army halted at Yangkou, Emperor He sent Imperial Censor Zong Yun with orders to comfort the host.',
    'At Yangkou, Emperor He sent imperial censor Zong Yun to comfort the armies.',
  ],
  s0082: [
    'Yu then urged Yun: "The yellow battle-ax has not yet been granted—this is not how one commands the feudal lords.',
    'Yu pressed Yun: "Without the yellow battle-ax you cannot command the lords.',
  ],
  s0083: [
    'Yun returned to the Western Headquarters, and at once the yellow battle-ax was granted to Gaozu.',
    'Yun went back to the western headquarters, and the yellow battle-ax was given to Gaozu at once.',
  ],
  s0084: [
    'When Xiao Yingzhou had been made area commander of all military affairs within and without, opinion held that Gaozu ought to submit a formal letter; Yu argued against it and the matter stopped.',
    'When Xiao Yingzhou became area commander of all armies, some said Gaozu should send a formal letter of submission; Yu objected and the idea was dropped.',
  ],
  s0085: [
    'Ying city was pacified.',
    'Ying city fell.',
  ],
  s0086: [
    'Yu and Zhang Hongce debated in accord with Gaozu\'s intent, and the host was at once ordered to march downstream.',
    'Yu and Zhang Hongce argued as Gaozu wished, and the armies marched downstream at once.',
  ],
  s0087: [
    'Whenever he offered a plan, it was often adopted.',
    'Plans he offered were usually taken.',
  ],
  s0088: [
    'When the hegemon\'s headquarters first opened, he was made advisory staff officer.',
    'When the hegemon\'s headquarters opened, he became an advisory staff officer.',
  ],
  s0089: [
    'At the beginning of Tianjian he was enfeoffed as Viscount of Guangmu and made Rear Army Chief Clerk.',
    'Early in Tianjian he was made viscount of Guangmu and rear army chief clerk.',
  ],
  s0090: [
    'He went out as Pacify the North General and Administrator of the two commanderies Brazil and Zitong.',
    'He went out as pacify-the-north general and administrator of Brazil and Zitong.',
  ],
  s0091: [
    'Liang province long-term staff officer Xiahou Daoyuan raised the province in rebellion and surrendered to Wei; Wei horsemen were about to strike Brazil; Yu held firm more than a hundred days; grain in the city was exhausted and officers and soldiers gnawed grass and ate earth—more than half died—yet none lost heart.',
    'Xiahou Daoyuan, Liang\'s long-term staff officer, rebelled and surrendered the province to Wei; Wei cavalry struck Brazil; Yu held more than a hundred days; grain ran out and men ate grass and earth—more than half died—yet none wavered.',
  ],
  s0092: [
    'When the Wei army withdrew, an edict added two hundred households to his fief and advanced his rank to marquis.',
    'When Wei withdrew, an edict added two hundred households to his fief and raised him to marquis.',
  ],
  s0093: [
    'Zheng Shaoshu',
    'Zheng Shaoshu',
  ],
  s0094: [
    'Zheng Shaoshu, styled Zhongming, was a native of Kaifeng in Yingyang.',
    'Zheng Shaoshu, styled Zhongming, came from Kaifeng in Yingyang.',
  ],
  s0095: [
    'His clan for generations dwelt in Shouyang.',
    'His family had long lived in Shouyang.',
  ],
  s0096: [
    'His grandfather Kun was Song Administrator of Gaoping.',
    'His grandfather Kun had been Song administrator of Gaoping.',
  ],
  s0097: [
    'Shaoshu in youth was orphaned and poor.',
    'Shaoshu was orphaned young and lived in poverty.',
  ],
  s0098: [
    'Past twenty years of age, he was magistrate of Anfeng; while in the county he had a reputation for ability.',
    'Past twenty he was magistrate of Anfeng and won a name for competence in the district.',
  ],
  s0099: [
    'The province summoned him to fill chief clerk and he was transferred to supervising clerk.',
    'The province called him to chief clerk, then made him supervising clerk.',
  ],
  s0100: [
    'At the time Inspector Xiao Yan, because his younger brother Shen was executed, the court sent troops to seize him; those at hand were all startled and scattered, but Shaoshu, hearing of the crisis, alone galloped to him.',
    'Inspector Xiao Yan\'s younger brother Shen had been put to death; when court troops came to take Yan, his attendants fled in panic, but Shaoshu alone rode to him at the news.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_011_b1.mjs <translation.json>'
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
