#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    'At the end of Qi the province recommended him as Outstanding Talent; in the policy response he ranked first of the age.',
    'At Qi\'s end the province recommended him as Outstanding Talent; his answers ranked first.',
  ],
  s0502: [
    'When Gaozu\'s righteous army arrived, Ting went to meet and pay respects at Xinlin; Gaozu, seeing him, was very pleased and called him "Master Yan"; he was appointed Army Adjutant on the Eastern Campaign at age eighteen.',
    'When Gaozu\'s army came, Ting met him at Xinlin; Gaozu called him "Master Yan" and made him eastern-campaign adjutant at eighteen.',
  ],
  s0503: [
    'In the early Tianjian era he was appointed Central Army staff officer.',
    'Early Tianjian he was central army staff officer.',
  ],
  s0504: [
    'His residence was at Chaogou; at home he lectured on the Analects and listeners filled the court.',
    'At Chaogou he lectured on the Analects and the court came to listen.',
  ],
  s0505: [
    'He was promoted to Director of Jiankang; soon he was dismissed after impeachment.',
    'He became Jiankang director, then was impeached and dismissed.',
  ],
  s0506: [
    'After a long while he entered the Masters of Writing as Gentleman of Ceremonies, was promoted to Western Central secretariat staff officer, and in succession was Magistrate of Jinling and Wukang.',
    'Later he was ceremonies gentleman, western secretariat officer, then Jinling and Wukang magistrate.',
  ],
  s0507: [
    'When he left office and returned, he still built a house in the eastern suburbs and did not take office again.',
    'Leaving office he built in the eastern suburbs and never served again.',
  ],
  s0508: [
    'Ting from youth had great fame and was also skilled at dealing with the age; many powerful figures at court associated with him, so he could not long pursue quiet seclusion.',
    'Famous young and skilled with power-holders, he could not stay secluded long.',
  ],
  s0509: [
    'At that time Vice Minister Xu Mian took sick leave and returned home; Ting sent a letter to test his intent, saying:',
    'Xu Mian took sick leave home; Ting wrote to test his mind:',
  ],
  s0510: [
    'In the past Shi De cherished his patron and yearned for the journey several days;',
    'Shi De once yearned for his patron several days;',
  ],
  s0511: [
    'Fusi missed his friend and was emotionally wearied for a ten-day span.',
    'Fusi missed a friend and was weary ten days.',
  ],
  s0512: [
    'thus one knows what the deep heart is bound to does not differ between noble and base.',
    'so the heart\'s bond is the same for noble and base.',
  ],
  s0513: [
    'How much more when favor is lofty as a kin of the age and righteousness weighs heavy as knowing a friend—your Way shelters the living and your virtue spreads wide as cover.',
    'How much more when kinship and friendship weigh heavy and your virtue shelters all.',
  ],
  s0514: [
    'Yet court and countryside hang apart and mountains and rivers are far and different; though your cough and spittle sometimes reach me, I do not see your face.',
    'Yet court and countryside are far; though your words reach me I do not see your face.',
  ],
  s0515: [
    'The sigh of the "Eastern Mountain"—can one say it will soon return?',
    'Can the sigh for the Eastern Mountain soon end?',
  ],
  s0516: [
    'The west wind is worth cherishing—who can be without thought?',
    'Who can cherish the west wind without longing?',
  ],
  s0517: [
    'Add to this dwelling quietly in an open place with no companion for one\'s shadow; the autumn wind rises on four sides, gardens and groves change color, the cool wilds are lonely, and cold insects cry.',
    'Quiet dwelling, no companion, autumn wind, gardens fade, insects cry in the cold wilds.',
  ],
  s0518: [
    'What the bosom holds cannot be set down straight; feeling and thought cannot be without a resting place—sometimes through chanting and singing, at a move, a full scroll.',
    'Feelings cannot rest; he often chanted and filled scrolls.',
  ],
  s0519: [
    'Even Yang Sheng was sunk in gloom and still overturned the jar;',
    'Even Yang Sheng in gloom overturned his jar;',
  ],
  s0520: [
    'Huizi\'s five cartloads only multiplied contradictions.',
    'Huizi\'s five cartloads only bred contradictions.',
  ],
  s0521: [
    'One day I casually present a small piece, not expecting excessive praise, yet you return with lofty favor, piled sheets and doubled documents, paper dense and characters worn—reading again without end; I only regret that praise exceeds the mark and harms the standard.',
    'I sent a small piece unexpecting praise; you returned piled papers—I fear praise exceeds the mark.',
  ],
  s0522: [
    'In the past Zijian did not wish to praise Chen Lin rashly, fearing mockery from later generations;',
    'Zijian feared praising Chen Lin lest later ages mock;',
  ],
  s0523: [
    'will today\'s excessive leftover discourse not burden pure talk?',
    'will today\'s excess not burden pure talk?',
  ],
  s0524: [
    'Ting hides his tracks in grass and fields, events cut off from hearing and seeing; I rely on songs and ballads and get them from cart and pasture.',
    'I hide in the fields and learn only from songs and herdsmen.',
  ],
  s0525: [
    'Looking up I receive your active stone needle and it still becomes simple communication; pleasing the gut and delighting the ear, I slightly follow casting off; feasting in glory and view, I aim at cleansing away.',
    'Your sharp words please me; I cast off glory and feast to cleanse myself.',
  ],
  s0526: [
    'Brocade, silk, and bamboo music—two rows suddenly dismissed;',
    'Brocade and music—two rows dismissed at once;',
  ],
  s0527: [
    'a square zhang and round table—only three cups remain.',
    'a square table—only three cups remain.',
  ],
  s0528: [
    'thus with the Way transforming the realm within, feeling rushes beyond the border.',
    'Thus the Way transforms the realm and feeling rushes beyond it.',
  ],
  s0529: [
    'Wielding that string and chant, I adorn this view of loss.',
    'I chant strings and adorn this view of loss.',
  ],
  s0530: [
    'I recall the Marquis of Liu declining grain and think of Minister Han resigning glory;',
    'I recall Liu declining grain and Han resigning glory;',
  ],
  s0531: [
    'my thoughts cling to the eastern capital and my heart attaches to the southern peak;',
    'my thoughts cling to the eastern capital and the southern peak;',
  ],
  s0532: [
    'drilling into and looking up at your coming gift, it matches the lower wind.',
    'your gift matches the lower wind.',
  ],
  s0533: [
    'Though one says it is very fortunate, yet I am not enlightened.',
    'Though fortunate, I am not enlightened.',
  ],
  s0534: [
    'Though again the imperial Way is peaceful and horses run in retreat, "You Geng" finds its place, and Yin and Liang have where to return.',
    'Though the realm is peaceful and Yin and Liang have where to return,',
  ],
  s0535: [
    'the distant man Zhan still rolls up his sleeves;',
    'the distant man Zhan still rolls his sleeves;',
  ],
  s0536: [
    'the vast white waters—old Ning is about to lift his robe.',
    'on vast waters old Ning lifts his robe.',
  ],
  s0537: [
    'thus one knows the gentleman who saves things does not act for himself alone.',
    'thus the gentleman saves things, not for himself alone.',
  ],
  s0538: [
    'I think of wandering with Master Red Pine—who can achieve it?',
    'Who can wander with Master Red Pine?',
  ],
  s0539: [
    'May you drive them to benevolence and longevity and soothe this many blessings.',
    'May you drive them to benevolence and soothe many blessings.',
  ],
  s0540: [
    'Though one does not speak, the four seasons move.',
    'Though silent, the four seasons move.',
  ],
  s0541: [
    'Then the black-haired people have shelter and girdled gentlemen are not deprived;',
    'Then the people have shelter and gentlemen are not deprived;',
  ],
  s0542: [
    'the white colt is not in an empty valley; the butcher\'s sheep also receives bounty.',
    'the white colt is not in an empty valley; the butcher\'s sheep receive bounty.',
  ],
  s0543: [
    'Is it not glorious?',
    'Is it not glorious?',
  ],
  s0544: [
    'Is it not glorious?',
    'Is it not glorious?',
  ],
  s0545: [
    'In the past Du Zhen shut himself in a deep room and Lang Zong left no tracks in the wild.',
    'Du Zhen shut himself deep; Lang Zong left no tracks in the wild.',
  ],
  s0546: [
    'Hard indeed—and truly not what I hope for.',
    'Hard indeed—and not what I hope for.',
  ],
  s0547: [
    'Jing Dan was lofty and pure, Sima Xiangru looked down on the age—yet they still traveled among power\'s gates and moved at ease in home districts; I often say this Way is grand and secretly admire it.',
    'Jing Dan and Sima Xiangru still visited power\'s gates—I secretly admire that grand Way.',
  ],
  s0548: [
    'Just now I think of holding the broom to extend thought and present it to attendants; please come at the farm gap—no need to wait for invitation.',
    'I think of holding the broom for you—come at the farm gap without waiting.',
  ],
  s0549: [
    'Ting truly loves composition and does not meet the present age; he cannot quicken his step to answer the floating age.',
    'Ting loves writing but cannot quicken his step for the floating age.',
  ],
  s0550: [
    'The matter is like spoiled pickle; I wrongly share that partial taste—therefore I am not ashamed of my rusticity and do not fear the dragon gate.',
    'Like spoiled pickle I wrongly share the taste—not ashamed of rusticity, not fearing the dragon gate.',
  ],
  s0551: [
    'In the past Jingtong prized Jingqing and Meng Gong knew Zhongwei—stopping at ordinary men they were still called greatly beautiful; how much more in the age\'s elite—it is even less easy.',
    'Jingtong prized Jingqing and Meng Gong knew Zhongwei—even among ordinary men that was beautiful; how much more among elites.',
  ],
  s0552: [
    'Recently because coarse paper is not used and fine silk is much lacking, I imitate the eastern man and present a book to the chief minister; I must have a good copyist and again ask for polishing; if I meet Zihou, again I will trim the draft.',
    'Paper is lacking; I imitate the eastern man and present a book to the chief minister for copying and polish.',
  ],
  s0553: [
    'Mian replied:',
    'Mian replied:',
  ],
  s0554: [
    'Again I read your letter, piled sheets and doubled documents;',
    'Again I read your letter, piled sheets;',
  ],
  s0555: [
    'the matter wraps emergence and withdrawal, the words join speech and silence;',
    'matter wraps emergence and withdrawal, words join speech and silence;',
  ],
  s0556: [
    'the matter and meaning are thorough, the intent and reach far;',
    'matter and meaning thorough, intent far;',
  ],
  s0557: [
    'opening the letter and spreading the paper, it doubles indignant sighs.',
    'opening the letter doubles my sighs.',
  ],
  s0558: [
    'You, a splendid shoot from a heroic province, rose to court at weak cap; you thread through a hundred schools and plow the six learnings;',
    'You rose at weak cap, mastered a hundred schools and six learnings;',
  ],
  s0559: [
    'looking in the eyes shows your bright wisdom, seeing the color shows his heroic clarity—like the famous colt of Lu or the white crane soaring in clouds.',
    'your eyes show bright wisdom, your color heroic clarity—like Lu\'s colt or a cloud crane.',
  ],
  s0560: [
    'When you took charge of a famous district and tried office in fertile soil, there would be Wucheng\'s zither song and Tongxiang\'s ballad—how could one speak of them in the same breath as Zhuo and Lu?',
    'In a famous district you would sing like Wucheng and Tongxiang—not Zhuo and Lu.',
  ],
  s0561: [
    'Just now you should be rewarded for good ability and given added favor and appointment, adorning this girdle and setting you in that row of court.',
    'You should be rewarded and set in court\'s row.',
  ],
  s0562: [
    'Yet you wish to admire from afar curling and stretching and use your heart for folly and wisdom; already knowing gain is a burden, then awakening that fullness brings many words—high-stepping in wind and dust is truly what I admire and draw in.',
    'Yet you admire curling and stretching, know gain burdens, and high-step in wind and dust—I admire that.',
  ],
  s0563: [
    'How much more when metal and autumn warn the season and plain autumn orders the sequence—desolate woods and wilds with no one to share joy, lying on tomb classics and roaming Confucian mystery, thing and self both forgotten—who stagnates favor and disgrace?',
    'In desolate autumn you lie on classics and forget thing and self—who stagnates favor and disgrace?',
  ],
  s0564: [
    'Truly it is joy and admiration, with a difference in use.',
    'Truly joy and admiration, with a difference in use.',
  ],
  s0565: [
    'Now listening far and seeking nearby, I wake from sleep with rising thought; the white colt in the empty valley—the recluse stretches his neck; poverty and baseness are shame, birds and beasts are hard to flock with—therefore you should cast off this creeper and rushwort and go out to follow the court flock; no conflict between hidden and manifest—is it not glorious!',
    'The recluse stretches his neck in the empty valley—cast off creeper and follow the court flock; hidden or manifest, glorious!',
  ],
  s0566: [
    'My wisdom lacks aiding the age, my talent shames saving the world; I receive the court\'s pattern and dare not be idle in peace; strength weak and road far—regret in the heart is not one.',
    'My wisdom lacks aiding the age; I receive the pattern and dare not be idle—regret is not one.',
  ],
  s0567: [
    'When all under Heaven has the Way, what business have Yao\'s people?',
    'When the realm has the Way, what business have Yao\'s people?',
  ],
  s0568: [
    'I may because of weariness and illness think of following leisure and ease.',
    'Weariness and illness make me think of leisure.',
  ],
  s0569: [
    'If carriage and script were mixed and guard posts had no alarm, making music and regulating rites, recording stone and sealing mountain—only then returning to serve at the balanced gate would truly be much fortune.',
    'If the realm were united and rites made, then returning to the balanced gate would be great fortune.',
  ],
  s0570: [
    'But from old I have wind cough; I meet this empty dizziness; thin like Shi An, weak like Ji Changru; documents sink abandoned, the terrace not ordered; pleasing the ear and rotting the gut—I rest because of affairs, not because I wish to pursue Master Pine or admire the Marquis of Liu from afar.',
    'Wind cough and dizziness leave documents abandoned—not because I pursue Master Pine or the Marquis of Liu.',
  ],
  s0571: [
    'If Heaven grants years, of myself I should respectfully perform my duties.',
    'If Heaven grants years I should perform my duties.',
  ],
  s0572: [
    'The comparison is not of the same kind—I truly feel the words excessive;',
    'The comparison is not of the same kind—words excessive;',
  ],
  s0573: [
    'reading again I turn in circles, refreshed as if lost.',
    'reading again I turn as if lost.',
  ],
  s0574: [
    'Clear dust alone far, white clouds drifting—how endless it still is.',
    'Clear dust far, white clouds drifting—how endless.',
  ],
  s0575: [
    'You condescend to lower a letter and show literary drafts; I read again and can chant, lingering on the dense paper.',
    'You lower a letter and show drafts; I read again and linger on the paper.',
  ],
  s0576: [
    'In the past Zhongxuan was quick-witted and relied on the Central Commander to display praise;',
    'Zhongxuan relied on the central commander for praise;',
  ],
  s0577: [
    'Zhengping was sharp and understanding and depended on Beihai to soar in fame.',
    'Zhengping depended on Beihai to soar in fame.',
  ],
  s0578: [
    'Looking at antiquity and measuring today, I have shame in virtue.',
    'Looking at antiquity and today, I have shame in virtue.',
  ],
  s0579: [
    'If it becomes a scroll, exert yourself as chief.',
    'If it becomes a scroll, be chief.',
  ],
  s0580: [
    'Do not let a lone brilliance follow the palm and empty make men of letters wring wrists.',
    'Do not let lone brilliance follow the palm and make writers wring wrists.',
  ],
  s0581: [
    'Shilü wishes to see you—properly you should sweep the gate.',
    'Shilü wishes to see you—you should sweep the gate.',
  ],
  s0582: [
    'There is also coming thought—go to his suspended couch.',
    'There is also coming thought—go to his suspended couch.',
  ],
  s0583: [
    'Light moss and fish nets—another time I shall present them as gifts.',
    'Light moss and fish nets—I shall present another time.',
  ],
  s0584: [
    'The sigh for city towers—on what day is there no longing?',
    'The sigh for city towers—when is there no longing?',
  ],
  s0585: [
    'What I delay is healing herbs; the letter does not exhaust the intent.',
    'What I delay is healing herbs; the letter does not exhaust intent.',
  ],
  s0586: [
    'Afterward Ting then took office; soon he was appointed Director of Documents for the Southern Terrace; because of affairs he accepted bribes and was about to be impeached.',
    'Later he took office as southern-terrace director of documents and took bribes.',
  ],
  s0587: [
    'Ting feared punishment, then changed dress to become a Daoist priest, hid a long time, later met an amnesty, and only then came out of Tianxin Temple.',
    'Fearing punishment he became a Daoist priest, hid, then came out after amnesty.',
  ],
  s0588: [
    'When Prince Shaoling was in Jiangzhou he took Ting to the post; the prince loved literary meaning and deeply showed favor and courtesy; Ting therefore returned to lay life.',
    'Prince Shaoling took him to Jiangzhou, favored him, and he returned to lay life.',
  ],
  s0589: [
    'Again he followed the prince when he moved to post at Yingzhou; summoned to be Capital Intendant, Ting stayed at Xiashou; after a long while he returned to the capital.',
    'He followed the prince to Yingzhou; summoned as capital intendant he stayed at Xiashou, then returned.',
  ],
  s0590: [
    'In the Taiping era he traveled as guest in Wuxing and Wu commanderies and died in the Hou Jing rebellion.',
    'In Taiping he traveled Wuxing and Wu and died in Hou Jing\'s rebellion.',
  ],
  s0591: [
    'He compiled Near Discourses in ten juan and collected writings in twenty juan.',
    'Near Discourses (10 j.) and collected writings (20 j.).',
  ],
  s0592: [
    'His son Zhiming first followed Ting in serving Prince Shaoling and managed documents.',
    'Son Zhiming served Prince Shaoling and managed documents.',
  ],
  s0593: [
    'In the rebellion when the prince was defeated at Yingzhou, Zhiming still went down to join Hou Jing.',
    'In rebellion when the prince was defeated at Yingzhou, Zhiming joined Hou Jing.',
  ],
  s0594: [
    'He always because his father\'s official path did not reach high rank deeply resented the court, and thereupon devoted himself wholly to Jing\'s service.',
    'He resented the court for his father\'s low rank and wholly served Jing.',
  ],
  s0595: [
    'When Jing attacked Yingzhou and besieged Baling, all military proclamations in the army were his writing.',
    'When Jing besieged Baling, army proclamations were his writing.',
  ],
  s0596: [
    'When Jing usurped the throne he was Secretariat Attendant, solely wielding favor and power, his influence tilting inside and outside.',
    'When Jing usurped he was secretariat attendant with power inside and out.',
  ],
  s0597: [
    'When Jing was defeated he was seized and sent to Jiangling and died secretly in prison.',
    'When Jing fell he was sent to Jiangling and died in prison.',
  ],
  s0598: [
    'Ting\'s younger brother Chui also had literary fame; earlier he was drawn in by Prince Shaoling and in succession was secretariat, central secretariat, and staff officer.',
    'Younger brother Chui also had fame and was Shaoling\'s secretariat and staff officer.',
  ],
  s0599: [
    'Yu Zhongrong, courtesy name Zhongrong, was a man of Guyanling in Yingchuan.',
    'Yu Zhongrong, styled Zhongrong, was from Guyanling in Yingchuan.',
  ],
  s0600: [
    'Sixth-generation descendant of Jin Director of Works Bing.',
    'Sixth-generation descendant of Jin director of works Bing.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b6.mjs <translation.json>'
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
