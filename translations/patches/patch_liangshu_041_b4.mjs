#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'His family feared he could not endure the mourning; in the middle of the night they secretly placed charcoal beneath his bed. Lan, warmed by it, was able to sleep; when he woke and understood, he wailed in grief until he vomited blood.',
    'The household worried he would not survive the mourning; in the dead of night they stole charcoal under his couch. Lan slept at last in the warmth, and when he woke and knew what they had done, he cried out in anguish until blood came up with his sobs.',
  ],
  s0302: [
    'The Founding Emperor heard of his utmost filial nature and visited him many times.',
    'When the Founding Emperor learned how deep his devotion ran, he came again and again to see him.',
  ],
  s0303: [
    'When mourning ended he was appointed Left Assistant in the Secretariat.',
    'After the mourning period he was made Left Assistant in the Secretariat.',
  ],
  s0304: [
    'Intelligent by nature; among the seven hundred clerks of the Secretariat, he saw each once and remembered every name.',
    'He was quick-witted by nature: of the Secretariat\'s seven hundred clerks, one meeting was enough for him to fix name and surname in memory.',
  ],
  s0305: [
    'In office he was upright and clean, accepting nothing for himself.',
    'As an official he was scrupulously honest and took no private gain.',
  ],
  s0306: [
    'His brother-in-law Chu Yan, Censor-in-Chief, and his cousin Xiaochuo, Section Chief in the Ministry of Personnel, while in office had both trafficked heavily in bribes; Lan impeached them, and both were dismissed.',
    'His brother-in-law Chu Yan, the censor-in-chief, and his cousin Xiaochuo of the Ministry of Personnel had both taken bribes freely in office; Lan denounced them, and both lost their posts.',
  ],
  s0307: [
    'Xiaochuo bore a grudge and once said to others, "A dog bites passersby on the road, but Lan devours his own kin."',
    'Xiaochuo nursed a grievance and once told others, "Dogs snap at strangers in the street—Lan tears into his own family."',
  ],
  s0308: [
    'He went out as interior minister of Shixing and governed the commandery with especial zeal for integrity.',
    'He was sent out as interior minister of Shixing and ruled the commandery with uncommon devotion to clean government.',
  ],
  s0309: [
    'On return he again became Left Assistant and died in office.',
    'Recalled, he again served as Left Assistant and died in that post.',
  ],
  s0310: [
    'The worthy attendant, cut off so suddenly—what words can hold such grief!',
    'The worthy attendant of the crown prince, gone in an instant—how can grief be spoken!',
  ],
  s0311: [
    'His filial love was deep and true, his conduct in life steadfast;',
    'Filial and fraternal to the bone, upright in the conduct of his life;',
  ],
  s0312: [
    'within, jade luster; without, clear waves.',
    'within he shone like polished jade, without he stood clear as still water.',
  ],
  s0313: [
    'Fine reputation and good report flowed among gentlemen and friends;',
    'Praise and fair fame ran among scholars and friends;',
  ],
  s0314: [
    'word and deed matched; from first to last he was one man.',
    'what he said and what he did were one; beginning to end, he never wavered.',
  ],
  s0315: [
    'Letters and histories he mastered in full; jade tablets were his heart;',
    'He was stocked with letters and histories; fine jade was his inward standard;',
  ],
  s0316: [
    'prose and verse he offered in abundance; black and yellow became his colors.',
    'his essays and poems were rich and ample; black and yellow—the arts themselves—were his palette.',
  ],
  s0317: [
    'He showed humility in his nature and held difficulty in advancement as his rule; never did he pay court to high ministers or bind himself to glory and gain.',
    'He wore modesty as his nature and made a point of not pushing for promotion; he never called on powerful ministers or courted profit and rank.',
  ],
  s0318: [
    'Thus the newly arrived did not recommend him, and She Wu did not know him.',
    'So the newly come did not put his name forward, and She Wu never noticed him.',
  ],
  s0319: [
    'Since Ruan Fang took office and the post of the King of Ye, he had lingered at the gate for more than five years;',
    'From the time of Ruan Fang\'s appointment and the King of Ye\'s office, he had waited at the threshold more than five years;',
  ],
  s0320: [
    'colleagues had already risen, and many who came after had been promoted, yet he remained calm and pure, never troubled by how little or how much he had.',
    'men who had entered with him had climbed, and many juniors had risen, yet he stayed serene and unstirred, never counting what he lacked against what others gained.',
  ],
  s0321: [
    'Such firm resolve—how seldom is it found!',
    'A will like his—where is its like to be found!',
  ],
  s0322: [
    'To view treasures on the Western River, to walk alone on the Eastern Jiang—the books need not say he fell short.',
    'To gaze on treasures west of the river, to walk alone east of the Yangzi—what the histories record cannot have been wrong about him.',
  ],
  s0323: [
    'Long ago I was in Han\'nan, our letters flying in succession; when I came to hold Zhufang, you sat at ease in the place of honor.',
    'In years past I was in Han\'nan and our correspondence never ceased; when I was honored with Zhufang, you took the seat of honor at my side.',
  ],
  s0324: [
    'Fine days and lovely scenes, clear wind and moonlit nights—when the egret boat stirred or the scarlet heron called, not a day passed without our following one another, not an hour without our meeting.',
    'Bright seasons and beautiful vistas, clear breezes and moonlit nights—when the painted boat moved or the scarlet bird sang, there was never a day we did not keep company, never an hour we did not meet.',
  ],
  s0325: [
    'When wine was spent and ears grew hot we spoke our minds in verse, weighed the loyal and worthy, and raised up letters and histories—the three friends who profit a man: this was truly he.',
    'Cups empty and hearts warmed, we spoke our aims in poetry, sifted the loyal and good, and lifted up literature and history—the threefold friend of the sage: that was truly this man.',
  ],
  s0326: [
    'When he went to a lesser district to spread the Way, he had not long to show good government, yet he made the people cling to him when he left and wild pheasants grow tame in the fields—one feather of the august phoenix, enough to prove its five virtues.',
    'Sent to a small county to carry the teaching forward, he had little time to govern well, yet the people mourned his going and tame pheasants filled the wilds—one pinion of the royal bird, enough to show all five of its virtues.',
  ],
  s0327: [
    'Lately in the Eastern Palace I met you again; the Broad View had no business of receiving guests, and the Director of Studies was bound by many rules of form.',
    'Of late in the Eastern Palace we were able to meet once more; the Broad View had no duty of entertaining guests, and the Director of Studies was hemmed in by ceremony.',
  ],
  s0328: [
    'I relied on old friends to pair with me from time to time;',
    'I depended on old companions to keep me company now and then;',
  ],
  s0329: [
    'and now this man has passed away—how truly it wrings the heart.',
    'and now this man is gone—how bitter the pain.',
  ],
  s0330: [
    '"Heaven aids the good"—that is empty talk;',
    '"Heaven helps the good man"—so much empty doctrine;',
  ],
  s0331: [
    'can Heaven\'s recompense really be like this!',
    'can Heaven\'s reward truly work like this!',
  ],
  s0332: [
    'I think your grief and mourning must be beyond measure as well.',
    'I know your sorrow must be beyond words as well.',
  ],
  s0333: [
    'He is gone—what can be done; I lay down the brush in anguish.',
    'He is gone—what is there to say; I set down the brush in grief.',
  ],
  s0334: [
    'Yesterday I meant to write an epitaph inscription and also to compile a collection for him.',
    'Only yesterday I meant to compose his epitaph and gather his writings.',
  ],
  s0335: [
    'My own weakness and meanness—while he lived I could not praise and draw breath upon him so that his talent might run free; now, to make inscription and collection—what good for what is past?',
    'My own poverty of gift—while he lived I could not sing him aloud so his talent might show; what use now to write epitaph and anthology for what is already gone?',
  ],
  s0336: [
    'Therefore this pain and regret cannot be stilled.',
    'So this ache of loss will not leave me.',
  ],
  s0337: [
    'Liu Qian, courtesy name Xiaoyi, was younger brother of the Secretariat Director Xiaochuo.',
    'Liu Qian, styled Xiaoyi, was the younger brother of Secretariat Director Liu Xiaochuo.',
  ],
  s0338: [
    'Orphaned young, he and his brothers urged one another in study and were all skilled at literary composition.',
    'Left fatherless early, he and his brothers spurred one another to study and all wrote with skill.',
  ],
  s0339: [
    'Xiaochuo often spoke of "three brushes and six poems"—the three was Xiaoyi, the six Xiaowei.',
    'Xiaochuo liked to say "three brushes and six poems": the three meant Xiaoyi, the six meant Xiaowei.',
  ],
  s0340: [
    'In the fifth year of Heavenly Surveillance he was recommended as a cultivated talent.',
    'In the fifth year of Heavenly Surveillance he was presented as a cultivated talent.',
  ],
  s0341: [
    'He began office as acting aide on the law staff of the Prince of Shixing of the Right Forward Army; he followed the prince to Yizhou and served concurrently as recorder.',
    'He entered service as acting law aide to the Prince of Shixing of the Right Forward Army, followed the prince to Yizhou, and also served as recorder.',
  ],
  s0342: [
    'When the prince entered court as Central General Who Pacifies the Barbarians, Qian became his chief clerk and was promoted to secretary in the Secretariat\'s Hall of Audience.',
    'When the prince came in as Central General Who Pacifies the Barbarians, Qian became his chief clerk, then advanced to secretary in the Hall of Audience.',
  ],
  s0343: [
    'By imperial order he composed the text for the Yongzhou Equal-Weight Golden Image Stele; the prose was very grand and beautiful.',
    'Ordered to draft the inscription for the Yongzhou equal-weight golden-image stele, he produced a text of great splendor.',
  ],
  s0344: [
    'When the Prince of Jin\'an, Gang, went out to hold Xiangyang, Qian was made recorder on the staff of the Pacifier of the North; he left office on his mother\'s death.',
    'When Prince Gang of Jin\'an went out to govern Xiangyang, Qian was named recorder on the Pacifier of the North\'s staff and resigned for his mother\'s mourning.',
  ],
  s0345: [
    'When the prince was established as crown prince, Xiaoyi, his mourning ended, was again made junior mentor and was promoted to palace secretary.',
    'When the prince became crown prince, Xiaoyi, mourning finished, returned as junior mentor and rose to palace secretary.',
  ],
  s0346: [
    'He went out as General of Martial Proclamation and magistrate of Yangxian, winning high praise for his administration, and was raised to magistrate of Jiankang.',
    'He was sent out as General of Martial Proclamation and magistrate of Yangxian, governed with real distinction, and was promoted to magistrate of Jiankang.',
  ],
  s0347: [
    'In the third year of Great Unity he was promoted to secretary in the Secretariat; for an official offense he was demoted to advisory aide of the Pacifier of the West and concurrently regular palace attendant.',
    'In the third year of Great Unity he became secretary in the Secretariat; a disciplinary matter lowered him to advisory aide of the Pacifier of the West with concurrent regular palace attendant.',
  ],
  s0348: [
    'On return from an embassy to Wei he was again made secretary in the Secretariat.',
    'Back from an embassy to Wei, he again held the post of secretary in the Secretariat.',
  ],
  s0349: [
    'Before long he was acting concurrently as right chief clerk of the Secretariat, then also acting chief clerk of Pacifying the Distant and acting administrator of Pengcheng and Langye.',
    'Shortly he served concurrently as right chief clerk of the Secretariat, then also as acting chief clerk of Pacifying the Distant and acting administrator of Pengcheng and Langye.',
  ],
  s0350: [
    'He rose in succession to Left Assistant in the Secretariat and concurrently Censor-in-Chief.',
    'He advanced in turn to Left Assistant in the Secretariat and concurrently Censor-in-Chief.',
  ],
  s0351: [
    'In office he impeached without regard for persons, and men of the time praised him.',
    'In that post he censured without fear of whom he struck, and his contemporaries honored him for it.',
  ],
  s0352: [
    'In the tenth year he went out as General Who Subdues Waves and administrator of Linhai.',
    'In the tenth year he was sent out as General Who Subdues Waves and administrator of Linhai.',
  ],
  s0353: [
    'At that time the government net was loose and many common people did not obey prohibitions.',
    'Government was lax then, and many among the people ignored the law.',
  ],
  s0354: [
    'Xiaoyi on taking office proclaimed the regulations and worked zealously to soothe the people; within the borders all was orderly, and custom was greatly reformed.',
    'Xiaoyi, on arriving, published the statutes and labored to comfort the people; the district settled at once, and manners were thoroughly changed.',
  ],
  s0355: [
    'In the first year of Middle Great Unity he entered to hold the post of Minister of Punishments.',
    'In the first year of Middle Great Unity he returned to court as Minister of Punishments.',
  ],
  s0356: [
    'In the first year of Great Clarity he went out as General of Illustrious Might and interior minister of Yuzhang.',
    'In the first year of Great Clarity he was made General of Illustrious Might and interior minister of Yuzhang.',
  ],
  s0357: [
    'In the second year Hou Jing raided the capital; Xiaoyi sent his son Li at the head of three thousand commandery troops to follow the former Colonel of the Forward Army, Governor of Hengzhou Wei Can, in relief.',
    'In the second year Hou Jing attacked the capital; Xiaoyi sent his son Li with three thousand troops of the commandery to join the former forward colonel and governor of Hengzhou, Wei Can, in relief.',
  ],
  s0358: [
    'In the third year the palace city could not be held; Xiaoyi was forced by Zhuang Tie, the former administrator of Liyang, and lost his commandery.',
    'In the third year the palace fell; Xiaoyi was driven out by Zhuang Tie, former administrator of Liyang, and lost his post.',
  ],
  s0359: [
    'In the first year of Great Treasure he died of illness, aged sixty-seven.',
    'In the first year of Great Treasure he died of illness at sixty-seven.',
  ],
  s0360: [
    'Xiaoyi was generous by nature and especially earnest in private conduct.',
    'Xiaoyi was open-handed by nature and especially strict in family duty.',
  ],
  s0361: [
    'His second elder brother Xiaoneng had died early; Xiaoyi served his widowed sister-in-law with great care, and nothing great or small in the household was decided without consulting her.',
    'His second brother Xiaoneng died young; Xiaoyi tended his widowed sister-in-law with deep respect, and no matter in the house, large or small, was settled without her counsel.',
  ],
  s0362: [
    'With wife and children he waited on her morning and evening and never failed in ritual.',
    'He and his wife attended her morning and evening without once failing in propriety.',
  ],
  s0363: [
    'The age praised him for this.',
    'His age spoke well of him for it.',
  ],
  s0364: [
    'He left a collected works in twenty juan, current in the world.',
    'His collected writings in twenty juan circulated in his time.',
  ],
  s0365: [
    'His fifth younger brother Xiaosheng held office as law aide to the Prince of Shaoling, recorder to the Prince of Xiangdong of the Pacifier of the West, and Left Assistant in the Secretariat.',
    'His fifth brother Xiaosheng served as law aide to the Prince of Shaoling, recorder to the Prince of Xiangdong of the Pacifier of the West, and Left Assistant in the Secretariat.',
  ],
  s0366: [
    'He went out as administrator of Xinyi and was dismissed for an official offense.',
    'He was sent out as administrator of Xinyi and removed for a disciplinary offense.',
  ],
  s0367: [
    'After a long interval he again became Right Assistant in the Secretariat and concurrently regular palace attendant.',
    'Long afterward he again became Right Assistant in the Secretariat and concurrently regular palace attendant.',
  ],
  s0368: [
    'On return from an embassy to Wei he became chief clerk to the Prince of Wuling of the Pacifier of the West, Ji, and administrator of Shujun.',
    'Back from an embassy to Wei he was chief clerk to Prince Ji of Wuling, Pacifier of the West, and administrator of Shujun.',
  ],
  s0369: [
    'In the Great Clarity era, when Hou Jing took the capital, Ji declared himself emperor in Shu and made Xiaosheng Minister of the Left.',
    'During Great Clarity, after Hou Jing seized the capital, Ji set himself up in Shu and made Xiaosheng Minister of the Left.',
  ],
  s0370: [
    'In the Chengsheng era he followed Ji out through the gorge; the army was defeated and he was seized and thrown into prison.',
    'In the Chengsheng period he followed Ji through the gorge; defeated, he was taken and cast into prison.',
  ],
  s0371: [
    'The Founding Emperor soon pardoned him and raised him to right chief clerk of the Secretariat.',
    'The Founding Emperor soon forgave him and made him right chief clerk of the Secretariat.',
  ],
  s0372: [
    'His sixth younger brother Xiaowei first served as law aide to the Prince of Jin\'an of the Pacifier of the North, then chief clerk; he left office on his mother\'s death.',
    'His sixth brother Xiaowei began as law aide to the Prince of Jin\'an of the Pacifier of the North, then became chief clerk, and resigned for his mother\'s mourning.',
  ],
  s0373: [
    'When mourning ended he was made junior mentor to the crown prince and rose in succession to palace secretary, aide to the heir apparent, and director of the heir apparent\'s household, in each post keeping charge of records.',
    'After mourning he was junior mentor to the crown prince and advanced through palace secretary, aide to the heir apparent, and director of the heir apparent\'s household, always keeping the records.',
  ],
  s0374: [
    'In the ninth year of Great Unity a white sparrow alighted in the Eastern Palace; Xiaowei submitted a eulogy, its wording very fine.',
    'In the ninth year of Great Unity a white sparrow settled in the Eastern Palace; Xiaowei presented a hymn of praise, beautifully wrought.',
  ],
  s0375: [
    'In the Great Clarity era he was promoted to attendant of the crown prince and concurrently master of guests.',
    'In Great Clarity he rose to attendant of the crown prince and concurrently master of guests.',
  ],
  s0376: [
    'When Hou Jing\'s rebellion came, Xiaowei escaped from the besieged city and followed Governor of Sizhou Liu Zhongli west; at Anlu he fell ill and died.',
    'When Hou Jing rebelled, Xiaowei got out of the encircled capital and followed Liu Zhongli, governor of Sizhou, west; at Anlu he sickened and died.',
  ],
  s0377: [
    'His seventh younger brother Xiaoxian served as law aide and chief clerk to the Prince of Wuling.',
    'His seventh brother Xiaoxian was law aide and chief clerk to the Prince of Wuling.',
  ],
  s0378: [
    'When the prince was transferred to Yizhou, he followed the prince\'s staff and became recorder to the Pacifier of the West.',
    'When the prince moved to Yizhou, he followed the staff and became recorder to the Pacifier of the West.',
  ],
  s0379: [
    'In the Chengsheng era he and his brother Xiaosheng both followed Ji\'s army out through the gorge; defeated, they reached Jiangling, and the Founding Emperor made Xiaoxian Gentleman of the Yellow Gates and promoted him to palace attendant.',
    'In Chengsheng he and Xiaosheng both followed Ji\'s army through the gorge; beaten, they came to Jiangling, and the Founding Emperor made Xiaoxian Gentleman of the Yellow Gates, then palace attendant.',
  ],
  s0380: [
    'The brothers were all skilled at five-character verse and were esteemed in the world.',
    'All the brothers excelled at five-character poetry and were held in honor by their age.',
  ],
  s0381: [
    'Their collected writings were lost in the disorders and are not fully preserved today.',
    'Their collections were destroyed in the chaos and no longer survive whole.',
  ],
  s0382: [
    'Yin Yun, courtesy name Guanshu, was a native of Changping in Chen commandery.',
    'Yin Yun, styled Guanshu, came from Changping in Chen commandery.',
  ],
  s0383: [
    'By nature he was free and bold, not bound by small proprieties.',
    'He was bold and unconventional by nature and cared little for petty rules.',
  ],
  s0384: [
    'Yet he did not make friends lightly, and no mixed company crossed his gate.',
    'Yet he did not trade friendship cheaply, and no casual guest entered his door.',
  ],
  s0385: [
    'He worked zealously at study and was broadly versed in many books.',
    'He labored at learning and read widely across the canon.',
  ],
  s0386: [
    'As a boy he was seen by He Xian of Lujiang, who sighed deeply in admiration.',
    'In childhood he was seen by He Xian of Lujiang, who marveled at him aloud.',
  ],
  s0387: [
    'In the Yongming era of Qi he was acting aide to the Prince of Yidu.',
    'Under Qi in the Yongming period he served as acting aide to the Prince of Yidu.',
  ],
  s0388: [
    'At the opening of Heavenly Surveillance he was chief clerk to the Western Central Command and recorder to the Prince of Linchuan of the Rear Army.',
    'When Heavenly Surveillance began he was chief clerk to the Western Central Command and recorder to the Prince of Linchuan of the Rear Army.',
  ],
  s0389: [
    'In the seventh year he was promoted to regular palace attendant and master of guests in the Secretariat.',
    'In the seventh year he rose to regular palace attendant and master of guests in the Secretariat.',
  ],
  s0390: [
    'In the tenth year he was made regular palace attendant, concurrently Left Assistant in the Secretariat, also concurrently secretary in the Secretariat, then raised to Erudite of the National University, reader to the Heir Apparent Zhaoming, chief clerk to the Prince of Yuzhang of the Western Central Command, acting magistrate of Danyang, and in succession regular palace attendant, Secretariat Director, and left chief clerk of the Secretariat.',
    'In the tenth year he became regular palace attendant and concurrently Left Assistant and secretary in the Secretariat, then erudite of the national university, reader to Crown Prince Zhaoming, chief clerk to the Prince of Yuzhang of the Western Central Command with acting charge of Danyang, and finally regular palace attendant, Secretariat Director, and left chief clerk of the Secretariat.',
  ],
  s0391: [
    'In the sixth year of Universal Harmony he served in the Eastern Palace Scholars\' Office.',
    'In the sixth year of Universal Harmony he was in the Eastern Palace Scholars\' Office.',
  ],
  s0392: [
    'In the third year of Great Communication he died, aged fifty-nine.',
    'In the third year of Great Communication he died at fifty-nine.',
  ],
  s0393: [
    'Xiao Ji, courtesy name Dexuan, was son of the Duke of Qujiang, Yaoxin, of Qi.',
    'Xiao Ji, styled Dexuan, was the son of Duke Yaoxin of Qujiang under Qi.',
  ],
  s0394: [
    'At ten he could compose literary pieces.',
    'At ten he could already write prose.',
  ],
  s0395: [
    'Orphaned early, he had nine younger brothers, all still very young; Ji\'s affection among them was deep and harmonious, and the court and common people heard of it.',
    'Fatherless while young, he had nine younger brothers, all infants; Ji\'s love among them was warm and close, and word of it reached court and countryside.',
  ],
  s0396: [
    'His nature was mild and gentle; he did not contend with others and upheld himself in clean poverty.',
    'Gentle by nature, he strove with no one and lived upright in honest poverty.',
  ],
  s0397: [
    'He loved learning and was skilled at cursive and clerical script.',
    'He loved study and wrote well in cursive and clerical hands.',
  ],
  s0398: [
    'Yang Gongze, governor of Xiangzhou, had been an old retainer of Qujiang.',
    'Yang Gongze, governor of Xiangzhou, had long served the house of Qujiang.',
  ],
  s0399: [
    'Whenever he saw Ji he would say to others, "Duke Kang\'s son may be called a Huan Lingbao reborn."',
    'Whenever he met Ji he would tell others, "Duke Kang\'s son is truly a Huan Lingbao come again."',
  ],
  s0400: [
    '" When Gongze died, Ji wrote an elegy for him; he was fifteen. Shen Yue saw it and marveled, saying to his uncle Cai Bo, "Yesterday I read your worthy nephew\'s elegy for the Pacifier of the South, Yang—it is no whit inferior to Xiyi\'s work; this is the first proof of Duke Kang\'s accumulated good fortune."',
    '" When Gongze died, Ji composed his funeral elegy at fifteen. Shen Yue read it with wonder and said to his uncle Cai Bo, "Yesterday I saw your worthy nephew\'s dirge for Yang, Pacifier of the South—not a step below Xiyi\'s writing; here is the first sign of Duke Kang\'s stored grace."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_041_b4.mjs <translation.json>'
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
