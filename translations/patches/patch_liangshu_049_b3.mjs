#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Both had collected works.',
    'Both had literary collections.',
  ],
  s0202: [
    'Zhong Rong, styled Zhongwei, was a man of Changshe in Yingchuan, seventh-generation descendant of Jin Palace Attendant Zhong Ya.',
    'Zhong Rong, styled Zhongwei, was from Changshe in Yingchuan, a seventh-generation descendant of Jin Palace Attendant Zhong Ya.',
  ],
  s0203: [
    'His father Tao served Qi as Staff Officer to the Central Army.',
    'His father Tao was a Central Army staff officer under Qi.',
  ],
  s0204: [
    'Rong and his elder brother Wan and younger brother Yu all loved learning and had thoughtful minds.',
    'Rong, his elder brother Wan, and younger brother Yu all loved study and thought deeply.',
  ],
  s0205: [
    'Rong, in Qi\'s Yongming era, was a National University student, versed in the Book of Changes; Defender-General Wang Jian headed the Directorate and greatly favored him.',
    'In Qi\'s Yongming reign Rong studied at the National University and mastered the Changes; Wang Jian as Defender-General and Directorate head greatly favored him.',
  ],
  s0206: [
    'He was recommended as the commandery\'s Outstanding Talent.',
    'The commandery recommended him as Outstanding Talent.',
  ],
  s0207: [
    'He began office as Gentleman of the princely establishment, was promoted to Staff Officer on the Pacification Army\'s staff, and went out as magistrate of An\'guo.',
    'He began as a princely Gentleman, became Pacification Army staff officer, then magistrate of An\'guo.',
  ],
  s0208: [
    'At the end of the Yongyuan era he was appointed Staff Officer on the Secretariat\'s staff.',
    'At Yongyuan\'s end he joined the Secretariat staff.',
  ],
  s0209: [
    'At the beginning of Tianjian, though institutions were reformed, there was no leisure day by day; Rong then said: "When Yongyuan\'s turmoil began, men seized celestial rank while sitting idle; their merit did not come from taking up arms, and office came through bribery.',
    'Early in Tianjian, though institutions changed, days allowed no rest; Rong said: "When Yongyuan\'s chaos began, men took heaven\'s ranks while sitting idle; merit came not from war, office from bribes.',
  ],
  s0210: [
    'Waving one gold piece they took nine ranks; sending a brief note they recruited six colonels;',
    'One gold piece bought nine ranks; one slip of paper summoned six colonels;',
  ],
  s0211: [
    'Commandants of Horse filled the market, Generals of the Gentlemen packed the streets.',
    'Horse commandants clogged the markets and gentleman-generals the streets.',
  ],
  s0212: [
    'Though wearing robes and ribbons, they still did servants\' work;',
    'Robed and ribboned, they still did bondsmen\'s tasks;',
  ],
  s0213: [
    'though office was only Cadet or Attendant, they still personally performed runners\' chores.',
    'though posts were only yellow-gate cadets, they still ran errands themselves.',
  ],
  s0214: [
    'Name and reality were tangled—nothing worse than this.',
    'Names and facts were confused—nothing worse.',
  ],
  s0215: [
    'This servant is of the opinion that military officers who are of plain gentry families have their own clear pedigree, yet by this path receive noble ranks; such rewards should be erased in one stroke, to punish reckless rivalry.',
    'I hold that military officers of plain gentry have their own pedigree and should not gain rank this way—all such rewards should be cut off to check reckless competition.',
  ],
  s0216: [
    'If they are subordinate clerks of cold households, let them reach the utmost of their clan standing but they should not, because of military service, overflow into the clear grades.',
    'Clerks of poor houses may reach their clan\'s limit but must not, through army service, flood the clear grades.',
  ],
  s0217: [
    'If they are migrant mixed barbarians from Chu, they should be soothed and settled; one should simply cut off salaries and levies strictly, end their obstructing proper rule, and grant empty titles only.',
    'Migrant Chu riffraff should be soothed: cut salaries and levies, stop their harming government, and grant empty titles only.',
  ],
  s0218: [
    'I present my foolish loyalty fully, heedless of the many mouths.',
    'I offer this loyal counsel, heedless of the crowd.',
  ],
  s0219: [
    '" The edict was handed to the Ministry of Personnel to execute.',
    '" The edict was sent to the Ministry of Personnel to carry out.',
  ],
  s0220: [
    'He was promoted to Staff Officer on the Central Army under the Prince of Linchuan.',
    'He became staff officer on Prince Linchuan\'s central army.',
  ],
  s0221: [
    'When Prince of Hengyang Yuan Jian went out to guard Kuaiji, Rong was summoned as Record for Pacifying the North, solely in charge of literary records.',
    'When Prince Hengyang Yuan Jian guarded Kuaiji, Rong became his Pacifying-the-North recorder, in sole charge of documents.',
  ],
  s0222: [
    'At the time the lay Buddhist He Yin built a house on Mt Ruoye; a flood burst from the mountain and swept away trees and stone, yet this dwelling alone remained.',
    'Layman He Yin built on Mt Ruoye; a mountain flood swept trees and stone away, yet his house alone stood.',
  ],
  s0223: [
    'Yuan Jian ordered Rong to compose "Ode on the Auspicious Chamber" to proclaim it; the diction was very classical and fine. He was selected as Record of the Western Army under Prince Jin\'an.',
    'Yuan Jian had Rong write "Ode on the Auspicious Chamber" to honor it—very classical. He was chosen recorder to Prince Jin\'an of the Western Army.',
  ],
  s0224: [
    'Rong once graded ancient and modern five-character poetry, discussing their merits, and entitled it *Critique of Poetry*.',
    'Rong once ranked ancient and modern five-character verse and titled the work *Critique of Poetry*.',
  ],
  s0225: [
    'Its preface says:',
    'Its preface reads:',
  ],
  s0226: [
    'When qi stirs things, things move people; thus feelings sway and take shape in dance and song.',
    'Qi moves things; things move people—so feeling stirs and finds form in dance and song.',
  ],
  s0227: [
    'It means to illuminate the three realms and shed glory on the myriad beings; spirits await it for offerings, and the hidden and subtle rely on it for proclamation.',
    'It lights the three powers and adorns the myriad; spirits wait on it for sacrifice, the hidden use it to declare.',
  ],
  s0228: [
    'Moving Heaven and Earth, touching spirits and ghosts—nothing comes nearer than poetry.',
    'To move Heaven and Earth and touch gods and ghosts, nothing nears poetry.',
  ],
  s0229: [
    'Of old the words of the *Southern Winds* and the hymn *Cloud-Coach*—their meaning was already far-reaching.',
    'Of old *Southern Winds* and *Cloud-Coach*—their meaning was already vast.',
  ],
  s0230: [
    'The *Xia Songs* say "I am deeply troubled in heart"; a Chu song says "They named me Zhengze"—though the poetic form was not yet complete, they were roughly the source of five-character verse.',
    '*Xia Songs* have "deeply troubled in heart"; Chu songs name "Zhengze"—verse form was incomplete, yet these were the springs of five-character poetry.',
  ],
  s0231: [
    'Down to Han\'s Li Ling, the category of five-character verse was first set forth.',
    'By Han, Li Ling first established five-character verse as a category.',
  ],
  s0232: [
    'Ancient poems are remote and ages hard to trace; judging their form, they are truly products of blazing Han, not songs of declining Zhou.',
    'Ancient poems are distant and ages obscure; by form they belong to Han, not late Zhou.',
  ],
  s0233: [
    'From Wang, Yang, Mei, and Ma onward, rhapsodies vied in brilliance, yet lyric singing was scarcely heard.',
    'From Wang Bao, Yang Xiong, Mei Cheng, and Sima Xiangru on, fu competed in brilliance while lyric verse was rarely heard.',
  ],
  s0234: [
    'From Commandant Li to Lady Ban, in nearly a hundred years there was a woman—and only one.',
    'From Li Ling to Lady Ban, nearly a century held one woman poet—and only one.',
  ],
  s0235: [
    'The poets\' tradition had suddenly perished.',
    'The poets\' wind had suddenly died away.',
  ],
  s0236: [
    'In the two hundred years of Eastern Han there was only Ban Gu\'s *Ode on History*—plain wood without literary grace.',
    'Eastern Han\'s two centuries held only Ban Gu\'s *Ode on History*—plain and without literary grace.',
  ],
  s0237: [
    'Down to the Jian\'an period, Lord Cao and his sons deeply loved this craft;',
    'By Jian\'an, the Cao lord and his sons deeply loved letters;',
  ],
  s0238: [
    'the brothers of Pingyuan flourished as literary pillars;',
    'the Pingyuan brothers rose as literary pillars;',
  ],
  s0239: [
    'Liu Zhen and Wang Can were their wings.',
    'Liu Zhen and Wang Can were their wings.',
  ],
  s0240: [
    'Next came those who, clinging to dragons and nesting phoenixes, attached themselves to the rear train—nearly a hundred in number.',
    'Next came nearly a hundred who clung to dragons and phoenixes and joined the train.',
  ],
  s0241: [
    'Such abundant flourishing was fully prepared in that age!',
    'Such abundant flowering was complete in that age!',
  ],
  s0242: [
    'Afterward it declined and weakened, down to Jin.',
    'Afterward it declined to Jin.',
  ],
  s0243: [
    'In the Taikang era the three Zhangs, two Lus, two Pans, and one Zuo suddenly flourished again, following the martial ways of former kings; the breeze had not yet dried—this too was a literary revival.',
    'Taikang saw the three Zhangs, two Lus, two Pans, and Zuo Zuo revive the art—wind not yet spent, a literary revival.',
  ],
  s0244: [
    'In the Yongjia era Yellow Lao and empty talk were honored; poems of the time reasoned beyond their words and were thin and tasteless.',
    'Yongjia honored Huang-Lao and pure talk; verse reasoned past its words—thin and flavorless.',
  ],
  s0245: [
    'Reaching the lands south of the Yangtze, slight ripples still passed on; Sun Chuo, Xu Xun, Huan, Yu, and the gentlemen were all level and canonical like the *Dao De Lun*—Jian\'an\'s wind was wholly gone.',
    'South of the river slight ripples remained; Sun Chuo, Xu Xun, Huan, and Yu wrote level pieces like the *Dao De Lun*—Jian\'an\'s wind was gone.',
  ],
  s0246: [
    'Earlier Guo Pu, with lofty talent, innovated and changed the form;',
    'Earlier Guo Jingchun, with lofty talent, changed the form;',
  ],
  s0247: [
    'Liu Kun, relying on pure firmness, helped perfect that beauty.',
    'Liu Yueshi, with pure firm spirit, helped perfect that beauty.',
  ],
  s0248: [
    'Yet they were many against few and could not move custom.',
    'Yet the many outweighed the few and could not shift custom.',
  ],
  s0249: [
    'By the Yixi era Xie Lingyun flourished and continued the work;',
    'By Yixi Xie Lingyun flourished and continued writing;',
  ],
  s0250: [
    'At the beginning of Yuanjia there was Xie Lingyun—talent high, diction rich, splendor hard to track; he already spanned Liu and Guo and towered over Pan and Zuo.',
    'Early Yuanjia brought Xie Lingyun—great talent, rich diction, splendor hard to follow; he spanned Liu and Guo and towered over Pan and Zuo.',
  ],
  s0251: [
    'Thus we know Prince Si was Jian\'an\'s paragon, with Gonggan and Zhongxuan as aides;',
    'Thus Prince Si was Jian\'an\'s crown, Gonggan and Zhongxuan his aides;',
  ],
  s0252: [
    'Lu Ji was Taikang\'s hero, with Anren and Jingyang as aides;',
    'Lu Ji was Taikang\'s hero, Anren and Jingyang his aides;',
  ],
  s0253: [
    'Guest Xie was Yuanjia\'s champion, with Yan Yannian as aide: these are the crowns of five-character verse, fated masters of letters.',
    'Guest Xie was Yuanjia\'s champion, Yan Yannian his aide—these crown five-character verse and master an age of letters.',
  ],
  s0254: [
    'Four-character writing is brief in words and broad in meaning; taking effect from the *Airs* and *Elegies*, one could get much, yet each suffers from many words and little meaning—hence the age rarely practices it.',
    'Four-character verse is brief and broad, modeled on *Airs* and *Elegies*, yet words crowd and meaning thins—so the age rarely uses it.',
  ],
  s0255: [
    'Five-character verse occupies the key place in letters; it is what gives flavor among all compositions—thus it is said to meet the flowing custom.',
    'Five-character verse holds the key in letters—it flavors all writing and meets the popular current.',
  ],
  s0256: [
    'Is it not because pointing at things and releasing form, exhausting feeling and writing things, is what is most detailed and apt!',
    'Does it not point at things, release form, exhaust feeling, and depict objects most closely!',
  ],
  s0257: [
    'Thus the *Odes* have six meanings: first xing, second fu, third bi.',
    'The *Odes* have six meanings: xing, fu, and bi.',
  ],
  s0258: [
    'When words are exhausted yet meaning remains—that is xing;',
    'Words end yet meaning lingers—that is xing;',
  ],
  s0259: [
    'using things to symbolize intent—that is bi;',
    'using things to symbolize intent—that is bi;',
  ],
  s0260: [
    'directly stating the matter and entrusting words to depict things—that is fu.',
    'stating the matter directly and entrusting words to things—that is fu.',
  ],
  s0261: [
    'Expanding these three meanings and deploying them with measure, stiffening them with wind-strength and moistening them with cinnabar color, so that those who taste them find no limit and those who hear are moved in heart—that is poetry\'s utmost.',
    'Deploy the three with measure, stiffen with wind-power, moisten with color, so tasters find no end and hearers are moved—that is poetry\'s height.',
  ],
  s0262: [
    'If one uses only bi and xing, the trouble is meaning too deep; when meaning is deep, words stumble.',
    'Bi and xing alone make meaning too deep; deep meaning makes words stumble.',
  ],
  s0263: [
    'If one uses only the fu form, the trouble is meaning too floating; when meaning floats, writing scatters.',
    'Fu alone makes meaning too light; light meaning scatters the text.',
  ],
  s0264: [
    'Play becomes drift; writing has no mooring—there is the flaw of rank luxuriance.',
    'Play becomes drift; writing lacks mooring—rank luxuriance follows.',
  ],
  s0265: [
    'Spring wind and spring birds, autumn moon and autumn insects, summer clouds and summer rain, winter moon and severe cold—these are the four seasons\' impressions in poetry.',
    'Spring birds, autumn insects, summer rain, winter cold—the four seasons\' impressions in verse.',
  ],
  s0266: [
    'Festive gatherings lodge feeling in verse to draw kin near; parting from the group entrusts verse to voice grievance.',
    'Feasts lodge feeling in verse for kinship; parting entrusts verse for grievance.',
  ],
  s0267: [
    'As for Chu ministers leaving their borders, Han concubines leaving the palace;',
    'Chu ministers leave their land; Han palace women leave the court;',
  ],
  s0268: [
    'or bones lie across the northern wilds, or souls chase flying thistle;',
    'bones lie on northern wastes; souls chase thistle down;',
  ],
  s0269: [
    'or they shoulder spears on distant garrison, or killing air swells on the frontier;',
    'they shoulder spears on distant guard; killing air swells on the border;',
  ],
  s0270: [
    'frontier guests\' coats are thin, frost chambers\' tears are spent.',
    'frontier guests\' coats are thin; frost chambers\' tears are spent.',
  ],
  s0271: [
    'Again, gentlemen unfasten their girdle pendants and leave court, going away and not returning;',
    'Gentlemen unfasten pendants and leave court, never to return;',
  ],
  s0272: [
    'women raise moth brows and enter favor, a second glance overturning the state.',
    'women raise moth brows and win favor; a second glance overturns a realm.',
  ],
  s0273: [
    'All such kinds stir and shake the heart—without presenting them in verse how could meaning be displayed, without long song how could feeling be released?',
    'All such stir the heart—without verse how show meaning, without long song how release feeling?',
  ],
  s0274: [
    'Thus it is said: "The *Odes* can unite, can voice grievance."',
    'Thus: "The *Odes* unite and voice grievance."',
  ],
  s0275: [
    'They make poverty easy to bear and seclusion free of gloom—nothing surpasses poetry.',
    'They ease poverty and lighten seclusion—nothing surpasses poetry.',
  ],
  s0276: [
    'Thus writers of words have none who do not love it.',
    'Writers of words all love it.',
  ],
  s0277: [
    'Among gentlemen and commoners today this wind blazes.',
    'Today gentry and commoners fan this wind hotly.',
  ],
  s0278: [
    'Barely able to don clothes, just finished primary school, they must gladly gallop in it.',
    'Barely clothed, just out of primary school, they gallop in it gladly.',
  ],
  s0279: [
    'Then mediocre tones and mixed forms each become a family style.',
    'Mediocre tones and mixed forms each become a school.',
  ],
  s0280: [
    'As for pampered sons ashamed their writing does not reach others, they embellish all day and groan through the night, alone deeming their work striking strategy while the crowd in the end sinks it to flat dullness.',
    'Pampered sons, shamed their writing falls short, polish all day and groan all night—alone they call it brilliant; the crowd finds it flat.',
  ],
  s0281: [
    'Next are frivolous fellows who laugh at Cao and Liu as crude antiquity, call Bao Zhao a man above Fuxi, and Xie Tiao alone pacing past and present;',
    'Next come frivolous men who mock Cao and Liu as crude, call Bao Zhao above Fuxi, and Xie Tiao alone pacing all time;',
  ],
  s0282: [
    'yet studying Bao Zhao they never reach "At noon the market is full," studying Xie Tiao they only manage "Yellow birds cross green branches."',
    'studying Bao they never reach "At noon the market fills"; studying Xie they only get "Yellow birds cross green boughs."',
  ],
  s0283: [
    'They cast themselves away from lofty hearing and have no part in the stream of letters.',
    'They abandon refined hearing and never join the current of letters.',
  ],
  s0284: [
    'Rong observed that among princes and gentry, whenever they broadly discussed, they never failed to make poetry their topic; following their appetites, appraisals differed.',
    'Rong saw that princes and gentry, in broad talk, always made poetry their topic; tastes differed in judgment.',
  ],
  s0285: [
    'Zi and Ying flowed together, vermilion and purple wrested each other; clamor rose in rivalry and there was no mark to aim at.',
    'Zi and Ying mingled, red and purple clashed; clamor rose with no mark to aim at.',
  ],
  s0286: [
    'Recently Liu Shizhang of Pengcheng, a man of keen appreciation, hated this confusion and wished to make a contemporary *Grade of Poetry*; he orally set labels but his text was not completed—Rong, moved, composed it.',
    'Liu Shizhang of Pengcheng, keen in taste, hated the confusion and wished to grade contemporary verse orally but never finished—Rong, moved, wrote it.',
  ],
  s0287: [
    'Of old the nine ranks judged men and the *Seven Summaries* cut scholars, comparing substance to show much was missed;',
    'Nine ranks judged men and the *Seven Summaries* cut scholars—comparing substance, much was missed;',
  ],
  s0288: [
    'but as for poetry as a craft, comparison makes it fairly knowable; pushing by category, it is nearly like chess.',
    'poetry as craft is fairly known by comparison; by category it is like chess.',
  ],
  s0289: [
    'Now the Emperor possesses talent born with knowledge above, embodies deep and brooding thought, his writing rivals sun and moon, his learning exhausts Heaven and man; of old among the nobility he was already chief in name;',
    'The Emperor has inborn genius, deep brooding thought, writing that rivals sun and moon, learning that exhausts Heaven and man; among the nobility he was already foremost;',
  ],
  s0290: [
    'how much more when the eight directions are covered and wind rises like clouds—those embracing jade shoulder to shoulder, those grasping pearls tread in succession.',
    'now the realm is covered, wind and cloud rise; jade-bearers shoulder to shoulder, pearl-graspers follow in step.',
  ],
  s0291: [
    'He surely glances at Han and Wei without looking back and swallows Jin and Song in his breast.',
    'He glances past Han and Wei and holds Jin and Song in his breast.',
  ],
  s0292: [
    'Truly this is not farm songs or carriage counsel—I dare bring flowing distinctions.',
    'This is no farm song or carriage debate—I dare only sort flowing ranks.',
  ],
  s0293: [
    'What Rong records now is only that you may wander the lanes and balance it in talk.',
    'What Rong records now is only for wandering lanes and balancing in talk.',
  ],
  s0294: [
    'Shortly afterward he died in office.',
    'Soon after he died in office.',
  ],
  s0295: [
    'Wan, styled Changyue, reached office as staff officer and Jiankang magistrate.',
    'Wan, styled Changyue, became staff officer and Jiankang magistrate.',
  ],
  s0296: [
    'He authored *Biographies of Good Officials* in ten juan.',
    'He wrote *Biographies of Good Officials* in ten juan.',
  ],
  s0297: [
    'Yu, styled Jiwang, was Assistant Administrator of Yongjia commandery.',
    'Yu, styled Jiwang, was Yongjia assistant administrator.',
  ],
  s0298: [
    'In the fifteenth year of Tianjian an edict had scholars compile the *Comprehensive Digest*, and Yu also took part.',
    'Tianjian year fifteen ordered scholars to compile the *Comprehensive Digest*; Yu took part.',
  ],
  s0299: [
    'The brothers all had collected works.',
    'The brothers all had literary collections.',
  ],
  s0300: [
    'Zhou Xingsi, styled Sizuan, was a man of Xiang in Chen commandery, descendant of Han Heir Apparent Grand Tutor Zhou Kan.',
    'Zhou Xingsi, styled Sizuan, was from Xiang in Chen, descendant of Han Heir Apparent Grand Tutor Zhou Kan.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_049_b3.mjs <translation.json>'
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

