#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'When the righteous army rose, Dong Hun lent Chen Bozhi his staff, made him overseer of the vanguard hosts, and inspector of Yuzhou; his generalship stood as before.',
    'When the righteous army rose, Dong Hun lent Bozhi his staff, named him overseer of the vanguard, and inspector of Yuzhou; his rank stayed the same.',
  ],
  s0102: [
    'Soon he was transferred to Jiangzhou and held Xunyang to block the righteous army.',
    'Soon he took Jiangzhou and held Xunyang against the righteous army.',
  ],
  s0103: [
    'When Ying city fell, Gaozu seized Bozhi\'s banner-master Su Longzhi and sent him to win Bozhi over; at once Bozhi was made Pacifies-the-East General and inspector of Jiangzhou.',
    'When Ying fell, Gaozu took Bozhi\'s banner-master Su Longzhi to persuade him; Bozhi was named Pacifies-the-East general and Jiangzhou inspector.',
  ],
  s0104: [
    'Though Bozhi accepted the commission, he still wavered between two sides and pretended, saying, "The great army need not advance yet."',
    'Bozhi took the post but still hedged, claiming, "The great army need not march down yet."',
  ],
  s0105: [
    'Gaozu told the generals, "From this answer Bozhi\'s heart is unsettled; while he still hesitates, we should press him.',
    'Gaozu told the generals, "That answer shows Bozhi\'s heart is not fixed; while he still wavers, press him.',
  ],
  s0106: [
    '" The hosts then halted at Xunyang; Bozhi fell back to guard South Lake, and only then submitted.',
    '" The armies halted at Xunyang; Bozhi withdrew to South Lake, then came over.',
  ],
  s0107: [
    'He was advanced to Pacifies-the-South General and marched down with the host.',
    'He was raised to Pacifies-the-South general and went down with the armies.',
  ],
  s0108: [
    'Bozhi encamped at Fence Gate, then soon entered West Bright Gate.',
    'Bozhi camped at Fence Gate, then entered West Bright Gate.',
  ],
  s0109: [
    'While Jiankang was not yet pacified, whenever a defector came out Bozhi would call him aside and speak into his ear.',
    'While Jiankang still held out, each time a defector emerged Bozhi would pull him aside and whisper.',
  ],
  s0110: [
    'Gaozu feared he might turn again and spoke to him in secret, saying, "I hear the city is furious that you raised Jiangzhou and surrendered; they mean to send assassins against you—you should take thought for that.',
    'Gaozu feared a fresh betrayal and told him privately, "I hear the city is enraged that you surrendered Jiangzhou; they will send assassins—take care.',
  ],
  s0111: [
    '" Bozhi did not believe it.',
    '" Bozhi did not believe him.',
  ],
  s0112: [
    'Then Dong Hun\'s general Zheng Bolun surrendered; Gaozu sent him past Bozhi with the words, "The city is very angry with you and means to lure you back with promises of rank and reward.',
    'When Dong Hun\'s general Zheng Bolun came over, Gaozu sent him to Bozhi, saying, "The city is furious with you and will try to lure you back with honors.',
  ],
  s0113: [
    'If you surrender again they will flay you alive, limb by limb;',
    'If you yield again they will cut off your hands and feet while you live;',
  ],
  s0114: [
    'if you do not surrender, they will again send assassins to kill you.',
    'if you refuse, they will send assassins after you.',
  ],
  s0115: [
    'You must guard yourself deeply.',
    'Guard yourself well.',
  ],
  s0116: [
    '" Bozhi was afraid; from then on he had no second thought.',
    '" Bozhi was afraid, and from then on he held no second thought.',
  ],
  s0117: [
    'He fought hard and won merit.',
    'He fought fiercely and earned merit.',
  ],
  s0118: [
    'When the city fell he was advanced to Campaigns-the-South General, enfeoffed as Duke of Fengcheng with two thousand households, and sent back to his command.',
    'When the city fell he became Campaigns-the-South general, duke of Fengcheng with two thousand households, and returned to his post.',
  ],
  s0119: [
    'Bozhi could not read; back in Jiangzhou, when he received documents and lawsuits he would only bellow assent.',
    'Illiterate, back in Jiangzhou he would roar assent at every writ and suit.',
  ],
  s0120: [
    'When business arose, the recorders passed word by mouth and right and wrong were settled by whoever held sway.',
    'Matters were settled by whoever held sway while recorders relayed orders by mouth.',
  ],
  s0121: [
    'Bozhi was old friends with Deng Shan of Yuzhang and Dai Yongzhong of Yongxing; Shan had once hidden Bozhi\'s son Ying and saved him from harm, and Bozhi was deeply obliged.',
    'He was old friends with Deng Shan of Yuzhang and Dai Yongzhong of Yongxing; Shan had once hidden his son Ying from harm, and Bozhi owed him deeply.',
  ],
  s0122: [
    'In the province he made Shan vice-inspector and Yongzhong recorder on his staff.',
    'In the province he made Shan vice-inspector and Yongzhong his recorder.',
  ],
  s0123: [
    'Chu Wei of Henan was a loose man of the capital; at the end of Qi he was western staff officer of Yangzhou and, when turmoil came, lived in his lane;',
    'Chu Wei of Henan was a rake of the capital; at Qi\'s end he was Yangzhou western staff officer and, when chaos came, stayed in his lane;',
  ],
  s0124: [
    'while other light fellows could still advance themselves, only Wei failed to rise.',
    'while other rakes still found their way up, only Wei could not.',
  ],
  s0125: [
    'After Gaozu took the throne Wei often called on the Minister of Personnel Fan Yun; Yun disliked him and firmly shut him out.',
    'After Gaozu took the throne Wei often visited Fan Yun, minister of personnel; Yun disliked him and kept him out.',
  ],
  s0126: [
    'Wei grew angrier and told those he knew in private, "Since Jianwu, every man from the grass roots has turned into a noble—what crime is mine that I am cast aside?',
    'Wei grew furious and whispered to friends, "Since Jianwu every nobody has become a lord—what is my crime that I am thrown away?',
  ],
  s0127: [
    'The realm is newly founded, famine does not cease, and whether chaos will end is still unknown.',
    'The realm is new, famine unending, and no one knows whether the turmoil will end.',
  ],
  s0128: [
    'Chen Bozhi holds strong troops in Jiangzhou; he is no minister of long descent and bears private doubts;',
    'Chen Bozhi holds Jiangzhou with a strong host; he is no hereditary minister and nurses doubts;',
  ],
  s0129: [
    'and the Sparkling One guards the Southern Dipper—surely it rises for me.',
    'and the Sparkling One stands in the Southern Dipper—surely it moves for me.',
  ],
  s0130: [
    'If this one venture fails, I need only go to Wei—why should I not at once be made governor of Henan?"',
    'If this venture fails, I enter Wei—why not become governor of Henan at once?"',
  ],
  s0131: [
    'So he threw in his lot with Bozhi\'s clerk Wang Simu, served him, and was soon treated with great intimacy.',
    'So he joined Bozhi\'s clerk Wang Simu, served him closely, and won great favor.',
  ],
  s0132: [
    'When Bozhi\'s townsman Zhu Longfu became senior recorder, together with Wei they rode Bozhi\'s dullness and ran wild with treachery; punishments and policy passed or failed as they alone willed.',
    'Zhu Longfu, Bozhi\'s townsman, became senior recorder; he and Wei preyed on Bozhi\'s ignorance and ran the province by fraud and force.',
  ],
  s0133: [
    'Bozhi\'s son Huya was then Direct Attendant General; Gaozu wrote Longfu\'s crimes in his own hand and gave the note to Huya; Huya showed it to Bozhi;',
    'Bozhi\'s son Huya was Direct Attendant general; Gaozu wrote Longfu\'s crimes in his own hand for Huya, and Huya showed his father;',
  ],
  s0134: [
    'Gaozu also sent a man to replace Jiangzhou vice-inspector Deng Shan, and Bozhi refused both orders.',
    'Gaozu also sent a replacement for vice-inspector Deng Shan; Bozhi refused both.',
  ],
  s0135: [
    'He answered Gaozu, "Longfu is a fierce and valiant fighter; Deng Shan has real achievements. As for the vice-inspector the court sends, please make him chief clerk instead."',
    'He answered Gaozu, "Longfu is a bold fighter; Deng Shan has done real work. Let the court\'s vice-inspector serve as chief clerk instead."',
  ],
  s0136: [
    'Shan then night and day urged Bozhi, saying, "The court\'s storehouses are empty and there are no weapons; the three granaries have no grain; the eastern lands are starving wanderers—this is a chance that comes once in ten thousand generations; the moment must not be lost."',
    'Shan urged him day and night, "The court\'s treasuries are bare, its arsenals empty, the granaries dry, the east a river of refugees—this moment will not come again."',
  ],
  s0137: [
    'Wei, Yongzhong, and the rest kept seconding him.',
    'Wei, Yongzhong, and the rest kept urging him on.',
  ],
  s0138: [
    'Bozhi told Shan, "This time I raise you up; if I still fail, I will go down with you and rebel."',
    'Bozhi told Shan, "This time I back you; if I fail again, I march with you against the court."',
  ],
  s0139: [
    'Gaozu ordered one commandery in the circuit to take Shan in; Bozhi then gathered the province\'s officers and clerks and said, "By the Prince of Jian\'an\'s command of Qi I lead a hundred thousand righteous men of the north; they have halted at Liuhe. An envoy orders the Jiangzhou levies to haul grain south at once.',
    'Gaozu seized Shan in one commandery; Bozhi gathered his staff and said, "By Qi\'s Prince of Jian\'an I lead a hundred thousand northern volunteers at Liuhe; an envoy orders Jiangzhou to haul grain south at once.',
  ],
  s0140: [
    'I owe Emperor Ming a deep grace and swear to die repaying it.',
    'I owe Mingdi a great debt and swear to repay it with my life.',
  ],
  s0141: [
    'We arm and make ready at once."',
    'We arm and prepare now."',
  ],
  s0142: [
    'He had Wei forge a letter in Xiao Baoyin\'s name and show it to his staff.',
    'He had Wei forge a letter as from Xiao Baoyin and show the staff.',
  ],
  s0143: [
    'Before the hall he raised an altar and slew victims to swear the oath.',
    'Before the hall he built an altar and slaughtered victims for the oath.',
  ],
  s0144: [
    'Bozhi drank first; the chief clerk and those below took the blood in order.',
    'Bozhi drank first; the chief clerk and the rest pledged in turn.',
  ],
  s0145: [
    'Wei urged Bozhi, "In a great undertaking you should lean on men the host admires. Cheng Yuanchong does not share our heart;',
    'Wei urged him, "A great rising needs men the troops trust. Cheng Yuanchong is not with us;',
  ],
  s0146: [
    'Linchuan interior administrator Wang Guan, grandson of Sengqian, is not ill-favored in person—call him in as chief clerk to replace Yuanchong."',
    'Linchuan interior administrator Wang Guan, Sengqian\'s grandson, is not ill-favored—summon him as chief clerk for Yuanchong."',
  ],
  s0147: [
    'Bozhi followed this.',
    'Bozhi agreed.',
  ],
  s0148: [
    'He also made Wei administrator of Xunyang and gave him the added title Suppresses-Rebellion General;',
    'He made Wei Xunyang administrator and Suppresses-Rebellion general;',
  ],
  s0149: [
    'Yongzhong was made Assists-the-Cause General;',
    'Yongzhong became Assists-the-Cause general;',
  ],
  s0150: [
    'Longfu was made inspector of Yuzhou and led five hundred men to hold Dalei.',
    'Longfu became Yuzhou inspector with five hundred men to hold Dalei.',
  ],
  s0151: [
    'Dalei garrison commander Shen Huixiu and Pacifies-the-South staff officer Li Yanbo.',
    'Dalei was held by Shen Huixiu; Li Yanbo was Pacifies-the-South staff officer.',
  ],
  s0152: [
    'He also sent his townsman Sun Lin and Li Jing under Longfu\'s command—Lin for Xuzhou, Jing for Yingzhou.',
    'He sent townsman Sun Lin and Li Jing under Longfu—Lin for Xuzhou, Jing for Yingzhou.',
  ],
  s0153: [
    'Yuzhang administrator Zheng Bolun raised the commandery troops to hold him off.',
    'Yuzhang administrator Zheng Bolun raised commandery forces to resist.',
  ],
  s0154: [
    'Yuanchong, having lost his post, gathered several hundred men at home and had Bozhi\'s recorders Lü Xiaotong and Dai Yuanze act as inside agents.',
    'Yuanchong, out of office, gathered hundreds at home and set Bozhi\'s recorders Lü Xiaotong and Dai Yuanze within.',
  ],
  s0155: [
    'Each morning Bozhi would perform his entertainments; by late afternoon he would lie down and his bodyguards all rested.',
    'Each dawn Bozhi held his entertainments; by afternoon he slept and his guards rested.',
  ],
  s0156: [
    'Yuanchong used that slack hour to enter by the north gate and go straight to the hall.',
    'Yuanchong used the slack to enter the north gate and reach the hall.',
  ],
  s0157: [
    'Hearing the outcry, Bozhi himself rushed out to fight; Yuanchong could not hold and fled to Mount Lu.',
    'Hearing the clamor, Bozhi rushed out himself; Yuanchong could not stand and fled to Mount Lu.',
  ],
  s0158: [
    'Earlier, when Yuanchong raised troops he had asked Xunyang\'s Zhang Xiaoji to join; Xiaoji followed him.',
    'When Yuanchong first rose he called on Zhang Xiaoji of Xunyang; Xiaoji came.',
  ],
  s0159: [
    'After defeat Bozhi could not catch Xiaoji; he seized Xiaoji\'s mother, Lady Lang, and killed her by wax infusion.',
    'Defeated, he could not catch Xiaoji; he took Xiaoji\'s mother Lady Lang and killed her with molten wax.',
  ],
  s0160: [
    'He sent word back to the capital to his sons Huya and the rest; Huya and his brothers fled to Xuyi, where Xuyi men Xu An, Zhuang Xingshao, and Zhang Xianming waylaid them—could not hold them, and were themselves killed.',
    'He sent word to his sons at the capital; Huya and his brothers fled to Xuyi, where Xu An, Zhuang Xingshao, and Zhang Xianming ambushed them—failed to stop them and were killed instead.',
  ],
  s0161: [
    'Gaozu sent Wang Mao against Bozhi.',
    'Gaozu sent Wang Mao to crush Bozhi.',
  ],
  s0162: [
    'Hearing Mao was coming, Bozhi told Wei and the rest, "Wang Guan would not take the post; Zheng Bolun would not follow—so we should be trapped empty-handed.',
    'When he heard Mao was coming he told Wei, "Wang Guan would not come; Zheng Bolun would not follow—we are trapped with empty hands.',
  ],
  s0163: [
    'First pacify Yuzhang, open the southern road, levy many laborers, and haul more grain; then roll north in one sweep against starving, weary troops—how could we fail?"',
    'Take Yuzhang first, open the south road, levy labor and grain, then sweep north against starving troops—how could we fail?"',
  ],
  s0164: [
    'He left his townsman Tang Gairen to hold the city and led his men toward Yuzhang.',
    'He left townsman Tang Gairen in the city and marched on Yuzhang.',
  ],
  s0165: [
    'Administrator Zheng Bolun held firm; Bozhi could not take it.',
    'Zheng Bolun held fast; Bozhi could not break the city.',
  ],
  s0166: [
    'Wang Mao\'s vanguard arrived; caught front and rear, Bozhi was beaten and fled, stole out by bypaths north of the river, and with his son Huya and Chu Wei entered Wei together.',
    'Mao\'s vanguard came; caught between two fires, Bozhi fled by hidden paths north of the river and entered Wei with Huya and Chu Wei.',
  ],
  s0167: [
    'Wei made him bearer of the staff, irregular attendant, overseer of the Huainan armies, Pacifies-the-South General, Grand Master of Splendid Happiness, and Marquis of Qujiang.',
    'Wei gave him the staff, made him irregular attendant, overseer of Huainan armies, Pacifies-the-South general, grand master of splendid happiness, and marquis of Qujiang.',
  ],
  s0168: [
    'In the fourth year of Tianjian an edict had Grand Marshal Linchuan Wang Hong lead the armies north; Hong ordered his recorder Qiu Chi to send Chen Bozhi a private letter, saying:',
    'In Tianjian year four an edict sent Grand Marshal Linchuan Wang Hong north; Hong had his recorder Qiu Chi write Chen Bozhi privately, saying:',
  ],
  s0169: [
    'General Chen, I trust you are well—this is a great fortune.',
    'General Chen, I hope you are well. That itself is fortune enough.',
  ],
  s0170: [
    'Your valor crowns the three armies; your talent rises above this age.',
    'Your courage tops the three armies; your gift stands above the age.',
  ],
  s0171: [
    'You abandoned the sparrow\'s petty aim and aspired to the wild goose\'s lofty flight.',
    'You left the sparrow\'s small hunger and sought the wild goose\'s high soar.',
  ],
  s0172: [
    'Once, riding the turn of fortune, you met a bright lord, won merit and built your house, founded a state and carried on your line—scarlet wheels and jeweled hubs, a banner staff for ten thousand li: how grand it was!',
    'Once you rode fortune to a bright lord, won merit, founded a house and a line—scarlet wheels, jeweled hubs, a command for ten thousand li: how splendid!',
  ],
  s0173: [
    'How is it that in a single morning you became a fugitive captive, tremble at the whistle of arrows, and kneel before the nomad tent—how base by contrast!',
    'Then in one morning you were a runaway captive, shaking at whistling arrows, kneeling before felt tents—how fallen!',
  ],
  s0174: [
    'When I weigh your going and staying, there was no other cause: you simply could not examine yourself within and without took in wandering talk; lost in riot and rashness, you came to this.',
    'Looking back, there was no other cause: you could not judge yourself within and drank in rumor without; lost in frenzy, you came here.',
  ],
  s0175: [
    'The holy court pardons crime and weighs merit, casts aside flaws and records the useful, gathers loyal hearts under heaven and steadies the rebellious among the ten thousand things—this you know yourself; I need not argue it twice.',
    'The holy court forgives and rewards, overlooks flaws and employs the loyal, gathers hearts under heaven and stills the restless world—you know this; I need not say it twice.',
  ],
  s0176: [
    'Zhu Wei shed blood among brothers; Zhang Xiu raised the blade against his beloved son—yet the Han lord did not doubt them, and the Wei lord received them as of old.',
    'Zhu Wei bloodied brotherhood; Zhang Xiu turned steel on his own son—yet the Han emperor did not doubt them, and the Wei ruler welcomed them as before.',
  ],
  s0177: [
    'How much more for you, who bear no guilt of those ancients, while your merit outweighs the men of today!',
    'How much more you, who have no such ancient guilt, while your service outweighs the men of this day!',
  ],
  s0178: [
    'To lose the road and know to turn back—the wise of old praised it;',
    'To lose the way and turn back—the sages of old approved;',
  ],
  s0179: [
    'to return without going far—the canon holds it high.',
    'to return without wandering far—the classics exalt it.',
  ],
  s0180: [
    'Our lord bends the law to extend grace; even great fish may pass the net.',
    'Our lord bends law into mercy; even leviathans slip the net.',
  ],
  s0181: [
    'Your pine and cypress are not cut; your kin dwell in peace;',
    'Your pines and cypresses stand uncut; your kin live at ease;',
  ],
  s0182: [
    'your high tower has not fallen; your beloved concubine is still there.',
    'your tower has not toppled; your beloved is still there.',
  ],
  s0183: [
    'What your distant heart holds—how could words tell it?',
    'What your far-off heart holds—who could spell it out?',
  ],
  s0184: [
    'Now meritorious ministers and famed generals march in ordered ranks like wild geese.',
    'Now the great captains and ministers move in ordered ranks like geese in flight.',
  ],
  s0185: [
    'They clasp gold seals on yellow cords and counsel within the tent;',
    'They wear purple sashes and gold seals and shape counsel in the tent;',
  ],
  s0186: [
    'they ride light carriages with staff and banner and bear the frontier\'s charge.',
    'they ride light carriages with staff and banner and bear the border\'s trust.',
  ],
  s0187: [
    'All have sworn oaths with blood on the horse\'s mouth and pass them to sons and grandsons.',
    'All have sworn the horse-mouth oath and handed it to sons and grandsons.',
  ],
  s0188: [
    'You alone hide your face and borrow life, driving hard in a foreign land—can this not grieve the heart?',
    'You alone hide your face and cling to life, galloping in a strange land—does it not wring the heart?',
  ],
  s0189: [
    'For all Murong Chao\'s strength, he was sent to the eastern market in his own person;',
    'Murong Chao was mighty, yet he walked to the eastern market himself;',
  ],
  s0190: [
    'for all Yao Hong\'s flourishing, he was bound and led to the western capital.',
    'Yao Hong flourished, yet he was bound and led to the western capital.',
  ],
  s0191: [
    'Thus we know that where frost and dew fall alike, no alien breed is reared;',
    'So where frost and dew fall alike, no alien breed is raised;',
  ],
  s0192: [
    'in the old lands of Ji and Han no mongrel stock is taken in.',
    'and in Ji and Han\'s old realm no mongrel stock is kept.',
  ],
  s0193: [
    'The northern barbarians have usurped the central plains for many years; their wickedness has piled up and their doom is ripe—reason itself says they must burn to ash.',
    'The northern usurpers have held the central plains for years; wickedness has piled high and ruin is ripe—they must burn to ash.',
  ],
  s0194: [
    'How much more when their false brood is muddled and cunning, slaying one another, tribes pulling apart and chiefs doubting one another—soon they will be bound at the barbarian lodge and their heads hung on the reed street.',
    'Their false seed is muddled and cunning, turning blades on one another; tribes split and chiefs doubt—soon they will be bound at the barbarian hall and heads hung on the reed street.',
  ],
  s0195: [
    'Yet you swim like a fish in a boiling cauldron and nest like a swallow under a flying curtain—are you not bewildered?',
    'Yet you swim in a boiling cauldron and nest under a flying curtain—are you not lost?',
  ],
  s0196: [
    'Late spring, the third month: grass grows long in the southland; mixed flowers bloom on the trees and flocks of orioles fly in confusion.',
    'Late spring, third month: southland grass runs long, flowers crowd the trees, orioles cry in confusion.',
  ],
  s0197: [
    'To see the banners of the old country, to feel one\'s whole life in a single day, to touch the strings and climb the wall—how could there be no grief and rage?',
    'To see the banners of home, to feel a lifetime in a day, to touch the lute and climb the rampart—who would not grieve?',
  ],
  s0198: [
    'Thus the Duke of Lian thought of Zhao\'s general; Wu Qi wept for the western river—such is human feeling.',
    'So the Duke of Lian yearned for Zhao\'s general; Wu Qi wept for the western river—such is the human heart.',
  ],
  s0199: [
    'General, are you alone without feeling?',
    'General, are you alone without feeling?',
  ],
  s0200: [
    'I trust you will soon spur a worthy plan and seek your own greater fortune.',
    'I trust you will soon spur a worthy plan and win your own greater fortune.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_020_b2.mjs <translation.json>'
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
