#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'In the thirteenth year he was transferred to Intelligent Martial General and Intendant of Danyang, then removed from office on public business.',
    'In year 13 he was made Intelligent Martial General and intendant of Danyang, then dismissed on public business.',
  ],
  s0202: [
    'Before long he was recalled as Central Protector General.',
    'Soon he was recalled as Central Protector General.',
  ],
  s0203: [
    'In the fourteenth year he went out as General Who Pacifies the North, Pacify Barbarians Commandant, and Inspector of Yongzhou.',
    'In year 14 he went out as General Who Pacifies the North, Pacify Barbarians Commandant, and inspector of Yongzhou.',
  ],
  s0204: [
    'Earlier, when Rui had raised troops in his home district, his guest Yin Junguang wept and tried to stop him; when Rui returned as inspector, Junguang met him on the road, and Rui laughed and said to him, "Had I followed your advice, I would be begging food on the highway.',
    'When Rui first raised troops at home, his guest Yin Junguang wept and tried to stop him; on returning as inspector, Junguang met him on the road, and Rui laughed and said, "Had I taken your advice, I would be begging along the highway.',
  ],
  s0205: [
    '」 He presented ten draft oxen.',
    'He gave him ten draft oxen.',
  ],
  s0206: [
    'Toward old friends Rui held nothing back; for scholar-officials over seventy he often granted acting county magistrate appointments, and the district thought warmly of him.',
    'Toward old friends Rui was unstinting; for gentry over seventy he often gave acting county magistrate posts, and the district loved him for it.',
  ],
  s0207: [
    'In the fifteenth year he memorialized to retire; a gracious edict refused.',
    'In year 15 he petitioned to retire; a gracious edict refused.',
  ],
  s0208: [
    'In the seventeenth year he was summoned as Regular Attendant and Protector of the Army General; soon he was given one set of martial pipes and drums and entered regular duty in the Hall Department.',
    'In year 17 he was summoned as Regular Attendant and Protector of the Army; soon he received martial pipes and drums and took regular duty in the Hall Department.',
  ],
  s0209: [
    'In court he was respectful and never met others\' eyes directly; Gaozu greatly honored him.',
    'At court he was deferential and never met others\' eyes; Gaozu treated him with great respect.',
  ],
  s0210: [
    'By nature he was kindly; he raised his orphaned elder brother\'s sons more devotedly than his own, and whatever salary and gifts his offices brought he gave away to kin and friends, leaving nothing at home.',
    'Kind by nature, he raised his orphaned nephews more devotedly than his own sons and gave every salary and gift to kin and friends, leaving nothing at home.',
  ],
  s0211: [
    'Later, as Protector of the Army with nothing to do at home, he admired the conduct of the Wan Shi clan and Lu Jia and painted them on his wall for his own pleasure.',
    'Later, idle at home as Protector of the Army, he admired the Wan Shi and Lu Jia and painted them on his wall for amusement.',
  ],
  s0212: [
    'Though old, on free days he still set lessons for his sons.',
    'Though old, on free days he still drilled his sons in learning.',
  ],
  s0213: [
    'His third son Ling was especially versed in the classics and histories; the age called him broadly learned. Rui would seat Ling whenever he lectured on books; the points Ling raised, Rui still could not match.',
    'His third son Ling knew the classics and histories especially well and was called broadly learned. Rui always had Ling lecture on books; points Ling raised Rui could not match.',
  ],
  s0214: [
    'Gaozu was then keen on Buddhism, and all under heaven followed the fashion;',
    'Gaozu was then intent on Buddhism, and the realm followed;',
  ],
  s0215: [
    'Rui felt his own faith had always been thin; holding a minister\'s rank, he did not wish to bob with the crowd, and his conduct stayed much as before.',
    'Rui felt his faith had always been thin; as a great minister he would not bob with fashion, and lived much as before.',
  ],
  s0216: [
    'In the summer of the first year of Putong he was transferred to Attendant-in-Ordinary and General of Chariots and Cavalry, but because of illness did not accept the appointment.',
    'In summer of Putong year 1 he was made Attendant-in-Ordinary and General of Chariots and Cavalry but did not take office because of illness.',
  ],
  s0217: [
    'In the eighth month he died at home, aged seventy-nine.',
    'In the eighth month he died at home at seventy-nine.',
  ],
  s0218: [
    'His final instructions ordered a plain burial, enshrouded in seasonal dress.',
    'He ordered a plain burial in seasonal dress.',
  ],
  s0219: [
    'Gaozu came that same day to mourn and wept bitterly.',
    'Gaozu came to mourn that same day and wept bitterly.',
  ],
  s0220: [
    'He was granted a hundred thousand cash, two hundred bolts of cloth, eastern-garden funeral vessels, one court robe, one suit of clothes; whatever the funeral required was to be supplied by the offices, and a Secretariat Gentleman was sent to oversee it.',
    'He received a hundred thousand cash, two hundred bolts of cloth, eastern-garden funeral vessels, one court robe and one suit of clothes; the offices supplied the funeral, and a Secretariat Gentleman oversaw it.',
  ],
  s0221: [
    'Posthumously he was made Attendant-in-Ordinary, General of Chariots and Cavalry, and Acting Three Excellencies with Opening Office.',
    'Posthumously he was made Attendant-in-Ordinary, General of Chariots and Cavalry, and Acting Three Excellencies with Opening Office.',
  ],
  s0222: [
    'Posthumous title: Yan.',
    'Posthumous title: Yan.',
  ],
  s0223: [
    'Earlier, at the battle of Shaoyang, Chang Yizhi owed Rui a great debt and asked Cao Jingzong to meet with Rui; they set an official wager of two hundred thousand cash. Jingzong cast and got pheasant; Rui slowly cast and got black, then quickly took one piece and flipped it, saying "Strange!" and made a full tie.',
    'At Shaoyang, Chang Yizhi greatly admired Rui and asked Cao Jingzong to meet him; they wagered two hundred thousand cash. Jingzong threw pheasant; Rui slowly threw black, flipped one piece, said "Strange!" and forced a tie.',
  ],
  s0224: [
    'Jingzong often vied with the other commanders to be first in reporting victory; Rui alone held back. His disdain for winning was mostly like this, and the age especially praised him for it.',
    'Jingzong often raced other commanders to report victory first; Rui alone held back. He seldom cared to win, and the age prized him for it.',
  ],
  s0225: [
    'His sons Fang, Zheng, Ling, and An—Fang has a separate biography.',
    'His sons Fang, Zheng, Ling, and An; Fang has a separate biography.',
  ],
  s0226: [
    'Zheng, styled Jingzhi, began his career as an aide on the staff of the Prince of Nankang, was gradually promoted to Secretariat Gentleman, and went out as Administrator of Xiangyang.',
    'Zheng, styled Jingzhi, began on the Prince of Nankang\'s staff, rose to Secretariat Gentleman, and went out as administrator of Xiangyang.',
  ],
  s0227: [
    'Earlier Zheng had been friendly with Wang Sengru of Donghai; when Sengru became Director of Personnel in the Masters of Writing and took part in the great selection, friends and guests all leaned on him—Zheng alone stayed aloof.',
    'Zheng had been close to Wang Sengru of Donghai; when Sengru became Director of Personnel and ran the great selection, friends all courted him—Zheng alone stayed aloof.',
  ],
  s0228: [
    'After Sengru was cast out, Zheng again kept their old bond more warmly than in former days, and commentators praised him.',
    'After Sengru fell, Zheng kept their old bond warmer than before, and men praised him.',
  ],
  s0229: [
    'He rose in office to Attendant-in-Ordinary of the Yellow Gate.',
    'He rose to Attendant-in-Ordinary of the Yellow Gate.',
  ],
  s0230: [
    'Ling, styled Weizhi, was by nature quiet and plain; he made books and histories his profession, was broadly learned with a strong memory, and men of the age all came to him with questions.',
    'Ling, styled Weizhi, was quiet and plain, lived in books and histories, was broadly learned with a strong memory, and men of the age came to him with questions.',
  ],
  s0231: [
    'He began his career as an aide on the staff of the Prince of Ancheng, was gradually promoted to Imperial Censor, Household Steward of the Heir Apparent, and Director of the Bright Halls.',
    'He began on the Prince of Ancheng\'s staff, rose to Imperial Censor, Heir Apparent\'s Household Steward, and Director of the Bright Halls.',
  ],
  s0232: [
    'He wrote Continued Lessons on the Han in three scrolls.',
    'He wrote Continued Lessons on the Han in three scrolls.',
  ],
  s0233: [
    'An, styled Wuzhi, was by nature forceful and upright; in youth he studied the classics and histories and had literary skill.',
    'An, styled Wuzhi, was forceful and upright; in youth he studied the classics and histories and wrote well.',
  ],
  s0234: [
    'He began his career as Household Attendant of the Heir Apparent, was gradually promoted to Minister of the Imperial Studs, Inspector of South Yuzhou, and Minister of the Grand Storehouse.',
    'He began as Heir Apparent\'s Household Attendant, rose to Minister of the Imperial Studs, inspector of South Yuzhou, and Minister of the Grand Storehouse.',
  ],
  s0235: [
    'When Hou Jing crossed the Yangzi, An garrisoned the Six Gates; soon he was made commander of all military affairs on the city\'s western face.',
    'When Hou Jing crossed the Yangzi, An held the Six Gates; soon he was made commander of the western defenses.',
  ],
  s0236: [
    'At that time Jing raised east and west earthen mounds outside the wall, and within the city others were built to match; the Lamenting Heir Apparent and those below him personally carried earth, shovel and basket in hand.',
    'Jing built east and west earthen mounds outside the wall and matching mounds within; the Lamenting Heir Apparent and those below carried earth with shovel and basket.',
  ],
  s0237: [
    'An held the western mound, fighting bitterly day and night; for merit he was made General of Light Chariots with added staff of authority.',
    'An held the western mound and fought day and night; for merit he was made General of Light Chariots with staff of authority.',
  ],
  s0238: [
    'He died within the city and was posthumously made Regular Attendant and Left Guard General.',
    'He died in the city and was posthumously made Regular Attendant and Left Guard General.',
  ],
  s0239: [
    'Rui\'s cousin by the clan Ai.',
    'Rui\'s cousin Ai.',
  ],
  s0240: [
    'Ai, styled Xiaoyou, was calm and possessed capacity.',
    'Ai, styled Xiaoyou, was calm and had real capacity.',
  ],
  s0241: [
    'His great-grandfather Guang was Jin Rear Army General and Administrator of Beiping.',
    'His great-grandfather Guang was Jin Rear Army General and administrator of Beiping.',
  ],
  s0242: [
    'His grandfather Gui, at the beginning of Emperor Xiaowu\'s Taiyuan era, moved south to Xiangyang and became the province\'s Separate Cart, then Regular Attendant.',
    'His grandfather Gui, at the start of Emperor Xiaowu\'s Taiyuan era, moved south to Xiangyang, became the province\'s Separate Cart, then Regular Attendant.',
  ],
  s0243: [
    'His grandfather on the father\'s side Gongxun was Song Administrator of Yiyang.',
    'His grandfather Gongxun was Song administrator of Yiyang.',
  ],
  s0244: [
    'His father Yizheng died young.',
    'His father Yizheng died young.',
  ],
  s0245: [
    'Ai lost his father early and served his mother with a fame for filial piety.',
    'Ai lost his father early and was known for filial service to his mother.',
  ],
  s0246: [
    'By nature he was pure and aloof, not making friends rashly, yet he set his will on learning; he often sat alone in an empty room with his mind in the classics, dust on the mat, silent as if no one were there.',
    'Pure and aloof, he made friends carefully yet loved learning; he often sat alone with his mind in the classics, dust on the mat, silent as if alone.',
  ],
  s0247: [
    'At twelve he once traveled to the capital; when the Son of Heaven went out to the Southern Park the streets were noisy, old and young scrambling to watch—Ai alone sat reading and never put down his scroll; kin who saw it all marveled.',
    'At twelve he was in the capital when the emperor went to the Southern Park; the streets roared with watchers—Ai alone sat reading and never put down his scroll, and kin marveled.',
  ],
  s0248: [
    'When grown he was broadly learned and had literary talent, especially skilled in the meaning of the Changes and the Zuo Tradition to the Spring and Autumn Annals.',
    'Grown, he was broadly learned and literary, especially skilled in the Changes and the Zuo Tradition to the Annals.',
  ],
  s0249: [
    'Yuan Hao was Inspector of Yongzhou and recruited him as chief clerk.',
    'Yuan Hao, inspector of Yongzhou, recruited him as chief clerk.',
  ],
  s0250: [
    'When his mother died he built a hut beside the tomb and carried earth to raise the mound.',
    'At his mother\'s death he built a hut by the tomb and carried earth for the mound.',
  ],
  s0251: [
    'When Gaozu held Yongzhou he heard of it and came in person to mourn at the site.',
    'When Gaozu held Yongzhou he heard and came in person to mourn.',
  ],
  s0252: [
    'When mourning ended he was brought in as Central Army Aide.',
    'When mourning ended he was made Central Army Aide.',
  ],
  s0253: [
    'When the righteous army rose, Ai was made Valiant Martial General and Major to the Prince of Nanping, Champion, with concurrent charge as Magistrate of Xiangyang.',
    'When the righteous army rose, Ai was made Valiant Martial General and major to the Prince of Nanping, Champion, with concurrent charge as magistrate of Xiangyang.',
  ],
  s0254: [
    'At that time the capital was not yet settled and Yongzhou was empty; Wei Xing Administrator Yan Sangdu and others held the commandery in revolt; within the province there was alarm and the people wavered.',
    'The capital was unsettled and Yongzhou empty; Wei Xing administrator Yan Sangdu and others held the commandery in revolt, and the province shook.',
  ],
  s0255: [
    'Ai was deep, keen, and resourceful and had long been trusted by the district; he won hearts with open-handed care and made clear who was rebel and who loyal;',
    'Ai was deep, keen, and trusted in the district; he won hearts with open care and showed who was loyal and who rebel;',
  ],
  s0256: [
    'he also led recruitment in the home district and got more than a thousand men; with Sangdu and the rest he fought south of Shiping commandery, routed them utterly, and the people were then at peace.',
    'he also recruited more than a thousand men locally and routed Sangdu south of Shiping commandery; the people were at peace.',
  ],
  s0257: [
    'When Xiao Yingchen died, Emperor He summoned troops at Xiangyang; Ai followed the Prince of Shixing Dan to answer.',
    'When Xiao Yingchen died, Emperor He summoned troops at Xiangyang; Ai followed Prince of Shixing Dan.',
  ],
  s0258: [
    'Earlier, Eastern Ba Administrator Xiao Huang and Eastern Ba Administrator Lu Xiulie had raised troops to press Jingzhou; when Dan arrived he had Ai write to instruct them, and Huang that same day asked to surrender.',
    'Earlier Eastern Ba administrators Xiao Huang and Lu Xiulie had raised troops against Jingzhou; when Dan came he had Ai write to them, and Huang surrendered the same day.',
  ],
  s0259: [
    'In the second year of Zhongxing he followed Emperor He east.',
    'In Zhongxing year 2 he followed Emperor He east.',
  ],
  s0260: [
    'When Gaozu accepted the abdication, Ai\'s rank was advanced to General Who Assists the State; he remained General of Valiant Cavalry, was soon made Administrator of Ning Shu, and with Yizhou Inspector Deng Yuanqi went west to attack Liu Jilian; on reaching Gong\'an he died of illness on the road and was posthumously made Minister of the Guard.',
    'When Gaozu took the throne, Ai was advanced to General Who Assists the State, then kept as General of Valiant Cavalry, made administrator of Ning Shu, and with Yizhou inspector Deng Yuanqi went west against Liu Jilian; at Gong\'an he died on the road and was posthumously made Minister of the Guard.',
  ],
  s0261: [
    'His son Ganxiang rose in office to General of Valiant Cavalry, Chief Clerk of the Army on the Northern Expedition, and Administrator of the two commanderies of Yiyang and Zhongli.',
    'His son Ganxiang rose to General of Valiant Cavalry, chief clerk on the northern expedition, and administrator of Yiyang and Zhongli.',
  ],
  s0262: [
    'Chen Minister of Personnel Yao Cha said: In old times Dou Rong submitted the lands west of the Yellow River to Han and in the end became a great clan;',
    'Chen Minister of Personnel Yao Cha said: Dou Rong once submitted Hexi to Han and became a great clan;',
  ],
  s0263: [
    'Liu Tan raised Nan Zheng in response and followed, yet his family\'s renown did not sink—the times were right!',
    'Liu Tan raised Nan Zheng in response and followed, yet his family name did not sink—the times favored it!',
  ],
  s0264: [
    'Liu Chen\'s planning too had its successes—how wise!',
    'Liu Chen\'s plans too succeeded—how wise!',
  ],
  s0265: [
    'Wei Rui rose from Shangyong to join the righteous cause; his territory was poorer than Tan\'s, yet at Hefei and Shaoyang his merit was very great, and he yielded without claiming it—a gentleman indeed!',
    'Wei Rui rose from Shangyong for the righteous cause; his base was poorer than Tan\'s, yet at Hefei and Shaoyang his merit was great, and he yielded without claiming it—a gentleman indeed!',
  ],
  s0266: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0267: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_012_b3.mjs <translation.json>'
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
