#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Some say the bright-moon pearl cannot be without flaw;',
    'Some say the bright-moon pearl cannot be without flaw;',
  ],
  s0102: [
    'the Xia sovereign\'s jade cannot be without crack.',
    'the Xia sovereign\'s jade cannot be without crack.',
  ],
  s0103: [
    'Hence Ting Bo died under a county chief, Changqing died as park keeper—talent was not unheroic, rulers not unseeing, yet the splendor of joined green was shattered and dark jade\'s night hue marred—is the foot-rule sometimes short?',
    'Ting Bo died under a county chief, Sima Xiangru as park keeper—talent was not lacking, rulers not blind, yet splendor was shattered—is the measure sometimes short?',
  ],
  s0104: [
    'If so, Zhufu Yan and Gongsun Hong failed the policy exam, pleaded everywhere without entry, herded pigs on the Zi bank, abandoned by the province.',
    'If so, Zhufu Yan and Gongsun Hong failed the exam, pleaded without entry, herded pigs, abandoned by the province.',
  ],
  s0105: [
    'Suppose they suddenly passed like a crack, died in frost and dew—would their shame match Cui and Ma?',
    'Suppose they passed like a crack and died in dew—would their shame match Cui and Ma?',
  ],
  s0106: [
    'When they opened the eastern pavilion and set out five tripods, lightning flashed and wind ran, fame raced overseas—were they foolish before and wise after, wrong first and right in the end?',
    'When they opened the eastern pavilion and set five tripods, fame raced overseas—foolish before and wise after?',
  ],
  s0107: [
    'Or is glory and withering fixed in number, Heaven\'s mandate has an utmost limit, and we wrongly birth beauty and ugliness?',
    'Or is glory fixed in number and mandate has a limit, and we wrongly birth beauty and ugliness?',
  ],
  s0108: [
    'The fourth obscuration.',
    'The fourth obscuration.',
  ],
  s0109: [
    'Tiger roar, wind runs; dragon rises, clouds gather—thus when Chonghua stood, Yuan and Kai ascended; when Xin Shou was born, Fei Lian advanced.',
    'Tiger roar, wind runs; dragon rises, clouds gather—Chonghua stood and Yuan and Kai rose; Xin Shou was born and Fei Lian advanced.',
  ],
  s0110: [
    'Thus under heaven good men are few, evil many;',
    'Thus good men are few, evil many;',
  ],
  s0111: [
    'dark lords many, bright lords few.',
    'dark lords many, bright lords few.',
  ],
  s0112: [
    'Yet sweet grass and foul cannot share a vessel; owl and phoenix cannot wing together.',
    'Sweet grass and foul cannot share a vessel; owl and phoenix cannot wing together.',
  ],
  s0113: [
    'This makes Hun Dun and Tao Wu tread Cloud Terrace\'s steps;',
    'This makes Hun Dun and Tao Wu tread Cloud Terrace;',
  ],
  s0114: [
    'Zhongrong and Ting Jian plow beneath the cliff rocks.',
    'Zhongrong and Ting Jian plow beneath cliff rocks.',
  ],
  s0115: [
    'They insist rise and fall depend on me, not tied to Heaven—the fifth obscuration.',
    'They insist rise and fall depend on me, not Heaven—the fifth obscuration.',
  ],
  s0116: [
    'Those Rong and Di: human face, beast heart, ease in poisoned wine, taking slaughter as morality and steaming revenge as benevolence and righteousness.',
    'Those barbarians: human face, beast heart, ease in poison, slaughter as morality, steaming revenge as benevolence.',
  ],
  s0117: [
    'Though the great wind stood at Green Hill and Zao Chi strove on Hua wild, compared with their savagery how could they be surpassed?',
    'Though the great wind stood at Green Hill and Zao Chi strove on Hua wild, compared with their savagery what surpasses them?',
  ],
  s0118: [
    'Since the Metal line could not compete, heaven and earth overturned, the left belt boiled with lip peoples, seizing the moment like lightning.',
    'Since the Jin line failed, heaven and earth overturned, border peoples boiled, seizing the moment like lightning.',
  ],
  s0119: [
    'They overthrew Chan and Luo, toppled the five capitals;',
    'They overthrew Chan and Luo, toppled the five capitals;',
  ],
  s0120: [
    'dwelt in the former kings\' mulberry homeland, stole titles in the central counties;',
    'dwelt in the former kings\' homeland, stole titles in the central counties;',
  ],
  s0121: [
    'rivaled the Three Sovereigns for the people, contended with the Five Emperors for the realm.',
    'rivaled the Three Sovereigns for the people, contended with the Five Emperors for the realm.',
  ],
  s0122: [
    'Tribes multiplied and filled the divine land.',
    'Tribes multiplied and filled the divine land.',
  ],
  s0123: [
    'Alas!',
    'Alas!',
  ],
  s0124: [
    'Bless the good and punish the evil—empty words only.',
    'Bless the good and punish the evil—empty words only.',
  ],
  s0125: [
    'Is it not decline and peace leaning on each other, full and empty turning in turn, yet muddied by attributing it to man?',
    'Is it not decline and peace leaning, full and empty turning, yet muddied by man?',
  ],
  s0126: [
    'The sixth obscuration.',
    'The sixth obscuration.',
  ],
  s0127: [
    'What is called fate: life and death, noble and base, poor and rich, order and chaos, fortune and disaster—these ten Heaven bestows.',
    'Fate: life and death, noble and base, poor and rich, order and chaos, fortune and disaster—ten things Heaven bestows.',
  ],
  s0128: [
    'Foolish and wise, good and evil—these four man performs.',
    'Foolish and wise, good and evil—these four man performs.',
  ],
  s0129: [
    'Spirit is not Yao and Shun\'s alone; hearts differ like Zhu and Jun; talent snags on the mean—its place is in what is practiced.',
    'Spirit is not Yao and Shun\'s alone; hearts differ; talent snags on the mean—in practice.',
  ],
  s0130: [
    'Hence plain silk has no constancy; black and yellow rise in turn;',
    'Plain silk has no constancy; black and yellow rise in turn;',
  ],
  s0131: [
    'saltfish and orchid—enter and change of themselves.',
    'saltfish and orchid—enter and change of themselves.',
  ],
  s0132: [
    'Thus Zilu studied with Zhongni and forged frost-and-wind integrity;',
    'Zilu studied with Confucius and forged frost-and-wind integrity;',
  ],
  s0133: [
    'Chu Mu plotted with Pan Chong and achieved rebellious disaster.',
    'Chu Mu plotted with Pan Chong and achieved rebellious disaster.',
  ],
  s0134: [
    'yet Shang Chen\'s evil let his great enterprise shine on later heirs;',
    'yet Shang Chen\'s evil let his enterprise shine on heirs;',
  ],
  s0135: [
    'Zhong You\'s good could not cancel his knotted cap at death.',
    'Zhong You\'s good could not cancel his knotted cap at death.',
  ],
  s0136: [
    'Thus crooked and straight come from man; fortune and ill rest in fate.',
    'Crooked and straight come from man; fortune and ill rest in fate.',
  ],
  s0137: [
    'Some say ghosts and spirits harm the full and August Heaven aids virtue.',
    'Some say spirits harm the full and Heaven aids virtue.',
  ],
  s0138: [
    'Hence Duke Song\'s one word moved the law star thrice;',
    'Duke Song\'s one word moved the law star thrice;',
  ],
  s0139: [
    'the Yin emperor cut himself and clouds came a thousand li.',
    'the Yin emperor cut himself and clouds came a thousand li.',
  ],
  s0140: [
    'Good and evil without tokens—this meaning is not yet reconciled.',
    'Good and evil without tokens—this is not yet reconciled.',
  ],
  s0141: [
    'Moreover Duke Yu\'s high gate awaited enfeoffment; Yan\'s mother swept the tomb awaiting mourning.',
    'Duke Yu\'s high gate awaited enfeoffment; Yan\'s mother swept the tomb awaiting mourning.',
  ],
  s0142: [
    'This is why the gentleman strengthens himself unceasingly.',
    'This is why the gentleman strengthens himself unceasingly.',
  ],
  s0143: [
    'If benevolence had no reward, why cultivate goodness and establish a name?',
    'If benevolence had no reward, why cultivate goodness and establish a name?',
  ],
  s0144: [
    'This is courtyard-wide talk.',
    'This is courtyard-wide talk.',
  ],
  s0145: [
    'The sage\'s words are manifest yet obscure, subtle yet mild, far and hard to hear, like the Milky Way without end.',
    'The sage\'s words are manifest yet obscure, far and hard to hear, like the Milky Way without end.',
  ],
  s0146: [
    'Sometimes he sets up teaching to advance the dull and lazy, sometimes speaks fate to exhaust the spiritual nature.',
    'Sometimes he teaches to advance the dull; sometimes speaks fate to exhaust the spirit.',
  ],
  s0147: [
    '"Heaping good leaves surplus blessing"—that is teaching;',
    '"Heaping good leaves surplus blessing"—that is teaching;',
  ],
  s0148: [
    '"The phoenix bird does not come"—that is speaking fate.',
    '"The phoenix does not come"—that is speaking fate.',
  ],
  s0149: [
    'Now to argue its gist from a fragment—how is it unlike those who die at dusk yet discuss the Spring and Autumn changes?',
    'To argue the gist from a fragment—how unlike dying at dusk yet discussing Spring and Autumn changes?',
  ],
  s0150: [
    'Moreover King Zhao of Chu\'s virtuous sound did not roll up cinnabar clouds;',
    'King Zhao of Chu\'s virtuous sound did not roll cinnabar clouds;',
  ],
  s0151: [
    'King Xuan of Zhou prayed for rain and jade scepters were exhausted.',
    'King Xuan of Zhou prayed for rain and jade scepters were exhausted.',
  ],
  s0152: [
    'Old Yu planted virtue yet did not reach the height of Xun and Hua;',
    'Old Yu planted virtue yet did not reach Xun and Hua;',
  ],
  s0153: [
    'Yan Nian was cruel and fierce yet not as bad as Dongling\'s bitterness.',
    'Yan Nian was cruel yet not as bad as Dongling.',
  ],
  s0154: [
    'doing one good, one evil equal, yet fortune and disaster differ in their streams, rise and fall differ in their tracks.',
    'one good, one evil equal, yet fortune and disaster differ, rise and fall differ.',
  ],
  s0155: [
    'Vast August Heaven—could it be like this?',
    'Vast Heaven—could it be like this?',
  ],
  s0156: [
    'The Odes say: "Wind and rain like night, the cock crows unceasingly.',
    'The Odes say: "Wind and rain like night, the cock crows unceasingly.',
  ],
  s0157: [
    '" Thus the good man doing good—how could he rest?',
    'Thus the good man doing good—how could he rest?',
  ],
  s0158: [
    'To eat millet and rice, advance fodder and fatlings, wear fox and badger, don ice-white silk, watch subtle wonders dance, hear Yunhe lutes and zithers—this living men urgently desire, not because they sought it.',
    'To eat grain and meat, wear fur and silk, watch subtle dances, hear Yunhe music—living men desire this, not from seeking.',
  ],
  s0159: [
    'To cultivate the Way and virtue, practice benevolence and righteousness, thicken filial piety and brotherhood, establish loyalty and steadfastness, steep in the rich moisture of rites and music, tread the former kings\' great pattern—this the gentleman urgently desires, not because he sought it.',
    'To cultivate the Way, practice benevolence, thicken filial piety, establish loyalty, steep in rites and music, tread the former kings\' pattern—the gentleman desires this, not from seeking.',
  ],
  s0160: [
    'Yet the gentleman dwells in rectitude and embodies the Way, delights in Heaven and knows fate.',
    'Yet the gentleman dwells in rectitude and embodies the Way, delights in Heaven and knows fate.',
  ],
  s0161: [
    'He clarifies what cannot be helped and knows it does not come from intellect and strength.',
    'He clarifies what cannot be helped and knows it does not come from intellect and strength.',
  ],
  s0162: [
    'What departs he does not summon; what comes he does not reject; living he is not glad; dying he is not grieved.',
    'What departs he does not summon; what comes he does not reject; living not glad; dying not grieved.',
  ],
  s0163: [
    'Jade terraces and summer halls cannot gladden his spirit;',
    'Jade terraces and summer halls cannot gladden his spirit;',
  ],
  s0164: [
    'earthen rooms and woven rush are not enough to trouble his cares.',
    'earthen rooms and woven rush are not enough to trouble his cares.',
  ],
  s0165: [
    'He does not puff up in wealth and honor, does not hurry after desires.',
    'He does not puff up in wealth and honor, does not hurry after desires.',
  ],
  s0166: [
    'Would he have the Unappreciated essays of Lord Shi and Chancellor Dong?',
    'Would he write Unappreciated essays like Sima Qian and Dong Zhongshu?',
  ],
  s0167: [
    'When the discourse was finished Liu Zhao of Zhongshan sent a letter to challenge it; twice he replied and Jun answered each with analysis.',
    'When the discourse was done Liu Zhao of Zhongshan challenged it; twice he replied and Jun answered with analysis.',
  ],
  s0168: [
    'When Zhao died Jun never saw the later reply; Jun then wrote a preface saying: "Lord Liu had this challenge, but I had domestic grief and never delivered my answer.',
    'When Zhao died Jun never saw the later reply; he wrote a preface: "Lord Liu had this challenge, but I had domestic grief and never answered.',
  ],
  s0169: [
    'Soon this gentleman passed away and became another thing; his threads of argument lay hidden and were not transmitted.',
    'Soon he passed away; his arguments lay hidden and were not transmitted.',
  ],
  s0170: [
    'Someone obtained them from his house and showed me; I grieved that his tone was not yet faded while the man was gone, the green bamboo still fresh while grave grass would soon be ranked—tears fell and I did not know whence they came.',
    'Someone showed me his papers; I grieved his tone not faded while the man was gone, bamboo fresh while grave grass would soon rise—tears fell unawares.',
  ],
  s0171: [
    'Though the gap-team does not stay, the foot of wave flashes like lightning;',
    'Though the gap-team does not stay, the wave flashes like lightning;',
  ],
  s0172: [
    'autumn chrysanthemum and spring orchid—splendor never ends.',
    'autumn chrysanthemum and spring orchid—splendor never ends.',
  ],
  s0173: [
    'Therefore I keep the outline and answer his intent again.',
    'Therefore I keep the outline and answer his intent again.',
  ],
  s0174: [
    'If Mozi\'s words were not in error and the Xuan chamber talk had proof—',
    'If Mozi\'s words were not wrong and the Xuan chamber talk had proof—',
  ],
  s0175: [
    'I would hope the tree at Dongping, gazing at Xianyang, bends west;',
    'I would hope the tree at Dongping, gazing at Xianyang, bends west;',
  ],
  s0176: [
    'the spring on Gai Mountain, hearing string songs, matches the beat.',
    'the spring on Gai Mountain, hearing string songs, matches the beat.',
  ],
  s0177: [
    'But the sword hangs over an empty mound—what regret can match!',
    'But the sword hangs over an empty mound—what regret can match!',
  ],
  s0178: [
    '" Most of the discourse is not recorded here.',
    'Most of the discourse is not recorded here.',
  ],
  s0179: [
    'Jun also once wrote a Self-Preface, in brief: "I compare myself to Feng Jingtong with three likenesses and four differences.',
    'Jun also wrote a Self-Preface: "I compare myself to Feng Jingtong with three likenesses and four differences.',
  ],
  s0180: [
    'How so?',
    'How so?',
  ],
  s0181: [
    'Jingtong\'s heroic talent topped the age, his will firm as metal and stone;',
    'Jingtong\'s talent topped the age, his will firm as metal and stone;',
  ],
  s0182: [
    'I do not reach him, yet in integrity and generous spirit this is one likeness.',
    'I do not reach him, yet in integrity and generous spirit—one likeness.',
  ],
  s0183: [
    'Jingtong met a bright lord at restoration yet in the end was not tried;',
    'Jingtong met a bright lord at restoration yet was never tried;',
  ],
  s0184: [
    'I met a fate-shaping brilliant lord yet was also cast out in my year—this is the second likeness.',
    'I met a brilliant lord yet was cast out in my year—the second likeness.',
  ],
  s0185: [
    'Jingtong had a jealous wife, to the point of working the well and mortar himself;',
    'Jingtong had a jealous wife, to the point of working the well and mortar himself;',
  ],
  s0186: [
    'I have a fierce wife who also cramped the household as in the tale of the narrow rut—this is the third likeness.',
    'I have a fierce wife who also cramped the household like the narrow rut—the third likeness.',
  ],
  s0187: [
    'Jingtong in Gengshi\'s age held the tally and leapt on horse to eat meat;',
    'Jingtong in Gengshi\'s age held the tally and leapt on horse to eat meat;',
  ],
  s0188: [
    'from youth to age I have been sorrowful without joy—this is the first difference.',
    'from youth to age I have been sorrowful without joy—the first difference.',
  ],
  s0189: [
    'Jingtong had a son Zhongwen who achieved office and fame;',
    'Jingtong had a son Zhongwen who achieved office and fame;',
  ],
  s0190: [
    'my misfortune matches Bo Dao—I shall never have blood heirs—this is the second difference.',
    'my misfortune matches Bo Dao—I shall never have heirs—the second difference.',
  ],
  s0191: [
    'Jingtong\'s sinew and strength were just firm and in old age grew stronger;',
    'Jingtong\'s strength was just firm and in old age grew stronger;',
  ],
  s0192: [
    'I have dog-and-horse illness and may die at any time—this is the third difference.',
    'I have chronic illness and may die at any time—the third difference.',
  ],
  s0193: [
    'Jingtong though orchid and iris were burned still filled the ditch, yet famous worthies admired him; his wind and fragrance were dense and long grew stronger;',
    'Jingtong though orchid and iris burned still filled the ditch, yet worthies admired him; his fragrance long grew stronger;',
  ],
  s0194: [
    'my name and dust are silent, the age does not know me; once soul departs I shall be autumn grass—this is the fourth difference.',
    'my name is silent, the age does not know me; once soul departs I am autumn grass—the fourth difference.',
  ],
  s0195: [
    'Therefore I force myself to write this account and leave it for lovers of such things."',
    'Therefore I force myself to write this and leave it for lovers of such things."',
  ],
  s0196: [
    'Jun dwelt in Dongyang; many men of Wu and Kuai came to study with him.',
    'Jun dwelt in Dongyang; many men of Wu and Kuai studied with him.',
  ],
  s0197: [
    'In the second year of Putong he died, aged sixty.',
    'In Putong year two he died, aged sixty.',
  ],
  s0198: [
    'His disciples gave the posthumous title Master Xuanjing.',
    'His disciples gave the posthumous title Master Xuanjing.',
  ],
  s0199: [
    'Liu Zhao, courtesy name Mingxin, was a man of Weichang in Zhongshan.',
    'Liu Zhao, styled Mingxin, came from Weichang in Zhongshan.',
  ],
  s0200: [
    'His sixth-generation ancestor Yu was Jin General of Agile Cavalry.',
    'His sixth-generation ancestor Yu was Jin general of agile cavalry.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b2.mjs <translation.json>'
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
