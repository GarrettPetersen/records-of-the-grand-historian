#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'Book of Liang, Volume 36, Biography 30',
    'Book of Liang, Volume 36, Biography 30',
  ],
  s0002: [
    'Kong Xiuyuan; Jiang Ge',
    'Kong Xiuyuan; Jiang Ge',
  ],
  s0003: [
    'Kong Xiuyuan, styled Qingxu, was a native of Shanyin in Kuaiji.',
    'Kong Xiuyuan, styled Qingxu, came from Shanyin in Kuaiji.',
  ],
  s0004: [
    'He was the eighth-generation descendant of Chongzhi, Administrator of Danyang under Jin.',
    'He was an eighth-generation descendant of Jin\'s Danyang administrator Chongzhi.',
  ],
  s0005: [
    'His great-grandfather Yaozhi was Water Section Director in the Song Masters of Writing.',
    'His great-grandfather Yaozhi had been Water Section Director under the Song.',
  ],
  s0006: [
    'His father Pei was Secretary to Prince of Luling of Qi and died early.',
    'His father Pei, a secretary in the household of Qi\'s Prince of Luling, died young.',
  ],
  s0007: [
    'At eleven Xiuyuan was orphaned; he observed mourning with full propriety. Whenever he saw books written in his father\'s own hand, he always wept in grief beyond restraint—and those who saw it never failed to shed tears for him.',
    'Orphaned at eleven, he mourned his father with scrupulous ritual. Books in his father\'s hand always moved him to uncontrollable tears, and even onlookers wept.',
  ],
  s0008: [
    'Later he studied the classics under Shen Linshi of Wuxing and gained a rough grasp of the essential principles.',
    'He later studied under Wuxing\'s Shen Linshi and mastered the classics in broad outline.',
  ],
  s0009: [
    'In the fourth year of Jianwu the province recommended him as xiucai; Grand Marshal Xu Xiaosi reviewed his examination answers and deeply approved, saying to those seated with him: "How could Dong Zhongshu or Hua Lingsi surpass this? He may be called the measure of the younger generation.',
    'In Jianwu year 4 the province nominated him as xiucai. Grand Marshal Xu Xiaosi read his examination paper and praised it to his companions: "Not even Dong Zhongshu or Hua Lingsi would outshine this youth—he is the standard for his generation.',
  ],
  s0010: [
    'Judging from this response, he is fully worthy to be called talent fit to assist a king.',
    'From this answer alone, he clearly has the makings of a king\'s right-hand man.',
  ],
  s0011: [
    '" Wang Rong of Langya was on friendly terms with him and recommended him to Minister of Works Prince of Jingling, where he became a scholar of the Western Pavilion.',
    '" Wang Rong of Langya, who knew him well, recommended him to Minister of Works Prince of Jingling, and he entered the Western Pavilion as a scholar.',
  ],
  s0012: [
    'When the Liang platform was established, he and Liu Zhilin of Nanyang both became Masters of the Imperial Academy—a choice then regarded as fine.',
    'When the Liang regime was founded, he and Nanyang\'s Liu Zhilin were both appointed Masters of the Imperial Academy—an appointment everyone envied.',
  ],
  s0013: [
    'When Xiuyuan first arrived in the capital he lodged at the home of his clansman Kong Deng, Junior Director of the Imperial Treasury. Once, entering a temple on sacrificial business, he met Attendant-in-Ordinary Fan Yun, who greatly praised him: "To meet your refined countenance unexpectedly dispels my baseness; parting clouds to see the heavens—verified today.',
    'On first reaching the capital he stayed with his kinsman Kong Deng, Junior Director of the Treasury. During a temple visit for sacrifice he met Attendant Fan Yun, who exclaimed: "I never expected to see such a clear face—it sweeps away my vulgarity, like clouds parting to reveal the sky.',
  ],
  s0014: [
    '" Later Yun ordered his carriage to the Junior Director\'s gate; Deng hastened to arrange the feast and straighten his sash, expecting Yun had come for him—but Yun went alone to Xiuyuan, talked at length all day, and returned home sharing the same carriage; Deng was deeply ashamed.',
    '" Later Yun drove to the Junior Director\'s gate. Deng hurried to set out cushions and straighten his sash, sure the visit was for him. Instead Yun sought out Xiuyuan alone, talked all day, and rode home with him—leaving Deng deeply mortified.',
  ],
  s0015: [
    'Chief Minister Shen Yue held great influence at court, his gateway always crowded with visitors; whenever Xiuyuan arrived late, Yue would always receive him with an open mind, seat him at his right hand, and discuss literary meaning.',
    'Chief Minister Shen Yue, then at the height of power with a constant throng at his gate, always made room for Xiuyuan when he came late, seated him on the right, and debated texts with him.',
  ],
  s0016: [
    'In this way he was esteemed by those of broad learning.',
    'Such was the regard in which men of culture held him.',
  ],
  s0017: [
    'Soon he was appointed Adjunct in the Princely Household of Prince of Linchuan.',
    'He was soon made an adjutant in Prince of Linchuan\'s household.',
  ],
  s0018: [
    'The Emperor once asked Minister of Personnel Xu Mian: "Now that imperial enterprise is newly founded, we need someone learned in the arts who understands court rites to serve as Director of Ritual in the Masters of Writing.',
    'Gaozu once asked Xu Mian, Minister of Personnel: "The dynasty is just taking shape. I need a learned man who knows court ceremony for Director of Ritual in the Masters of Writing.',
  ],
  s0019: [
    'Think for me—who is fit for this choice?"',
    'Think for me—who can fill the post?"',
  ],
  s0020: [
    'Mian replied: "Kong Xiuyuan has clear, thorough knowledge and is versed in antiquity; the Jin and Song Daily Records he can recite from memory nearly word for word.',
    'Mian answered: "Kong Xiuyuan is lucid, well grounded in precedent, and can recite the Jin and Song Daily Records almost by heart.',
  ],
  s0021: [
    '" The Emperor too had long heard of him and the same day appointed him Acting Director of Ritual in the Masters of Writing.',
    '" Gaozu had already heard of him and appointed him Acting Director of Ritual that very day.',
  ],
  s0022: [
    'At that time many reforms were underway; whenever they consulted him on past precedents, Xiuyuan decided on the spot from what he had memorized, never hesitating in doubt.',
    'The court was then revising many institutions; whenever old precedents were needed, Xiuyuan answered from memory on the spot, never at a loss.',
  ],
  s0023: [
    'Personnel Section Director Ren Fang often called him "Kong Who Recites Alone."',
    'Ren Fang of the Personnel Section nicknamed him "Kong the Sole Reciter."',
  ],
  s0024: [
    'He was transferred to Corrector of Jiankang Prison; in judging lawsuits and deciding cases, rarely was anyone wrongly convicted.',
    'Promoted to Corrector of Jiankang Prison, he heard cases with such care that wrongful convictions were rare.',
  ],
  s0025: [
    'Later when someone was chosen for prison duty, the Emperor still cited Xiuyuan as an example to encourage them.',
    'When a successor was later chosen for the prison post, Gaozu still held Xiuyuan up as the model.',
  ],
  s0026: [
    'Appointed Palace Secretary, Secretary to Prince of Linchuan\'s household, promoted to Left Assistant Director in the Masters of Writing—in the Rites Gate he was stern and upright, fully meeting the court\'s expectations.',
    'He became Palace Secretary and secretary to Prince of Linchuan, then Left Assistant Director of the Masters of Writing, where his stern integrity in the examination hall won wide respect.',
  ],
  s0027: [
    'At that time the Crown Prince\'s Steward Zhou She compiled "Doubts on Rites," searching materials from Han and Wei through Qi and Liang; Xiuyuan\'s memorials and deliberations were all included in the compilation.',
    'When Crown Prince\'s Steward Zhou She compiled Doubts on Rites, drawing on Han, Wei, Qi, and Liang, every memorial and opinion Xiuyuan had written was included.',
  ],
  s0028: [
    'Appointed Supervising Gentleman-in-Attendance of the Yellow Gate, promoted to Senior Concurrent Supervisor of Censors—in upright color and straight measure he deferred to nothing; all officials feared him.',
    'Made Supervising Gentleman of the Yellow Gate and then Senior Concurrent Censor, he was unflinching in enforcing the law, and the whole bureaucracy feared him.',
  ],
  s0029: [
    'Appointed Junior Director of the Imperial Treasury, additionally acting as Magistrate of Danyang.',
    'He was appointed Junior Director of the Treasury and also acted as magistrate of Danyang.',
  ],
  s0030: [
    'He went out as Chief of the Princely Household of Propagation and Grace Prince of Jin\'an, Administrator of Nan commandery, directing Jing province military and civil affairs.',
    'He left the capital as chief secretary to Propagation and Grace Prince of Jin\'an, administrator of Nan commandery, with charge of Jingzhou affairs.',
  ],
  s0031: [
    'The Emperor told him: "Jing province is overall the upper reaches\' strategic key; its meaning equals the high divide at Fen. Now I entrust to you a ten-year-old child—well guide and support him; do not shrink from a Zhou Chang\'s action.',
    'Gaozu told him: "Jingzhou guards the upper Yangzi and is as vital as the western frontier. I am placing a ten-year-old prince in your hands—guide him well, and do not hesitate to speak bluntly as Zhou Chang did.',
  ],
  s0032: [
    '" He replied: "Your servant, coarse and lowly, has curiously received your grace; I shall gauge my utmost sincerity and offer what little I can.',
    '" He answered: "I am a humble man who has received extraordinary favor; I will give whatever sincerity and effort I possess.',
  ],
  s0033: [
    '" The Emperor approved his reply and issued an edict to Prince of Jin\'an: "Kong Xiuyuan is a model of human relations and deportment. You are still young—take him as teacher in every matter.',
    '" Pleased with the answer, Gaozu ordered Prince of Jin\'an: "Kong Xiuyuan is a paragon of conduct. You are still young—let him be your teacher in all things.',
  ],
  s0034: [
    '" Soon Prince of Shixing Xiao Dan replaced him as Jing governor; again he served as Chief of Dan\'s household, with Nan commandery administrator and directing military and civil affairs as before.',
    '" When Prince of Shixing Xiao Dan took over Jingzhou, Xiuyuan stayed on as his chief secretary and Nan commandery administrator with the same duties as before.',
  ],
  s0035: [
    'Through several terms in the province he had very good administrative achievements—deciding cases with an even hand, petitions and entreaties gaining no effect.',
    'Over several tours of duty he governed with real success, judging fairly and refusing every private request.',
  ],
  s0036: [
    'The Emperor deeply commended this.',
    'Gaozu praised him warmly for it.',
  ],
  s0037: [
    'Appointed Regular Attendant of the Scattered Cavalry, overseeing the Feathered Forest Guard, transferred to Director of the Secretariat, promoted to Bright Might General, again Chief of Jin\'an\'s household and Administrator of South Lanling—separate edict put him solely in charge of South Xu affairs.',
    'He became Regular Attendant of the Scattered Cavalry and head of the Feathered Forest Guard, then Director of the Secretariat and Bright Might General, again chief secretary to Prince of Jin\'an and administrator of South Lanling, with a special commission for South Xu alone.',
  ],
  s0038: [
    'Xiuyuan had repeatedly assisted famous fiefs, winning great popular repute; the prince deeply relied on him—military and civilian urgent business, every move and halt consulted his counsel.',
    'Having served several great princely domains, he enjoyed wide public esteem; the prince leaned on him heavily, consulting him on every military and civil decision.',
  ],
  s0039: [
    'He often set aside a separate couch in the central study, saying "This is Chief Kong\'s seat"—no one else might use it.',
    'In the inner study he kept a couch set apart, saying, "This seat is for Chief Secretary Kong," and no one else was allowed to sit there.',
  ],
  s0040: [
    'Such was the respect shown him.',
    'That was the measure of the honor he received.',
  ],
  s0041: [
    'When Crown Prince Zhaoming died, an edict summoned Xiuyuan at night to the dwelling hall for deliberation with the assembled lords on establishing Prince of Jin\'an Gang as crown prince.',
    'After Crown Prince Zhaoming\'s death, an edict called Xiuyuan to the palace at night to join the assembled ministers in choosing Prince of Jin\'an Gang as heir.',
  ],
  s0042: [
    'In the fourth year he fell ill; the Emperor sent palace envoys to inquire and provided medicine—ten or more each day.',
    'In year 4 he fell ill; Gaozu sent palace messengers to inquire after him and sent medicine ten or more times a day.',
  ],
  s0043: [
    'That year in the fifth month he died, aged sixty-four.',
    'He died in the fifth month of that year, at sixty-four.',
  ],
  s0044: [
    'His final instructions: simple burial, only vegetables at the seasonal sacrifices.',
    'He left orders for a plain funeral and only modest vegetable offerings at the seasonal rites.',
  ],
  s0045: [
    'The Emperor wept for him and, turning to Xie Ju, said: "Kong Xiuyuan served his office with pure loyalty, upright as an official; I had hoped to jointly bring about good government and elevate kingly transformation.',
    'Gaozu wept and, turning to Xie Ju, said: "Kong Xiuyuan served with pure loyalty and upright integrity. I had hoped to build good government with him and elevate the kingly way.',
  ],
  s0046: [
    'Suddenly he is cut off—I grieve deeply."',
    'Suddenly he is gone, and I grieve deeply."',
  ],
  s0047: [
    'Ju said: "This man was pure and upright, strong and straight—rare today; your humble servant privately mourns him for Your Majesty."',
    'Ju replied: "He was incorruptible and resolute—a man rarely seen today. Your servant grieves for Your Majesty\'s loss."',
  ],
  s0048: [
    'An edict proclaimed: "Care in death and remembrance of the distant—the common rule of all dynasties;',
    'An edict ran: "To honor the dead and remember the distant is the custom of every age;',
  ],
  s0049: [
    'honoring virtue and rewarding merit—the worthy precedent of ancient kings.',
    'to praise virtue and reward service is the ancient kings\' true law.',
  ],
  s0050: [
    'Propagation and Grace General, Grand Master with Golden Seal and Purple Ribbon, Supervisor of Yangzhou Kong Xiuyuan—his conduct and learning were upright and true, his generous measure serene and far-reaching; rising in honor at the Hall of Establishing Rites, his reputation weighed heavy among the gentry.',
    'Propagation and Grace General, Grand Master with Golden Seal and Purple Ribbon, and Supervisor of Yangzhou Kong Xiuyuan was upright in character, broad in spirit, honored at the Hall of Establishing Rites, and esteemed among officials.',
  ],
  s0051: [
    'He managed affairs in the heartland; his transforming influence spread to songs of praise; he was just raising benevolent longevity and harmonizing the moral order.',
    'He governed the central realm, won the people\'s praise in song, and was on the verge of bringing humane rule and moral order to fruition.',
  ],
  s0052: [
    'Suddenly he passed forever—doubly we use grief and sorrow.',
    'Now he is gone forever, and our sorrow is doubled.',
  ],
  s0053: [
    'He may be posthumously granted Regular Attendant of the Scattered Cavalry and Grand Master with Golden Seal and Purple Ribbon; funeral gifts of one first-grade coffin set, fifty bolts of cloth, fifty thousand cash, and two hundred jin of wax.',
    'Let him be posthumously made Regular Attendant of the Scattered Cavalry and Grand Master with Golden Seal and Purple Ribbon, with one first-grade coffin, fifty bolts of cloth, fifty thousand cash, and two hundred jin of wax.',
  ],
  s0054: [
    'Mourning shall be observed on the appointed day.',
    'Mourning rites shall be held on the appointed day.',
  ],
  s0055: [
    'Whatever the funeral requires shall be supplied as needed.',
    'All funeral expenses shall be provided as required.',
  ],
  s0056: [
    'Posthumous title: Viscount of Integrity.',
    'Posthumous title: Viscount Zhen.',
  ],
  s0057: [
    'The crown prince\'s handwritten order said: "Grand Master with Golden Seal and Purple Ribbon Kong Xiuyuan stood upright in person and conducted himself with pure integrity.',
    'The crown prince wrote: "Grand Master with Golden Seal and Purple Ribbon Kong Xiuyuan was upright in bearing and pure in conduct.',
  ],
  s0058: [
    'In past years he served west at Zhugong Palace and east on the Fen frontier, assisting in princely governance with full sincerity.',
    'In recent years he served princes west at Zhugong and east on the Fen borderlands, giving his whole loyalty to their rule.',
  ],
  s0059: [
    'The careful steadiness of one who steadies a state, the clean whiteness of one who balances the scales—none surpass him.',
    'His careful judgment in governing a realm and his spotless integrity surpass all comparison.',
  ],
  s0060: [
    'Suddenly he is cut off in death—my feelings are deeply pained.',
    'His sudden death fills me with sorrow.',
  ],
  s0061: [
    'Now mourning must be observed; outwardly let the full rites be prepared."',
    'Mourning must now be observed; let the proper ceremonies be arranged."',
  ],
  s0062: [
    'Xiuyuan was orphaned young but established resolve and character—strong and upright in bearing, clear and practiced in governance.',
    'Orphaned young, Xiuyuan set his will and bearing early—resolute in character, clear in the ways of government.',
  ],
  s0063: [
    'He lived frugally, mastered literary arts, handled official duties without fearing the powerful, and always took the realm as his charge.',
    'Frugal in private life, deeply learned in letters, fearless before the mighty in office, he always acted as though the empire rested on his shoulders.',
  ],
  s0064: [
    'The Emperor deeply entrusted him.',
    'Gaozu relied on him completely.',
  ],
  s0065: [
    'Through successive high posts not the slightest offense was found.',
    'Through one high appointment after another, he never committed the slightest fault.',
  ],
  s0066: [
    'His nature was cautious and reserved, with few indulgences.',
    'He was cautious by nature and had few appetites.',
  ],
  s0067: [
    'Entering and leaving the inner councils he never spoke of palace secrets—and the world for this held him in esteem.',
    'In and out of the inner councils he never breathed a word of palace affairs, and for that the world respected him.',
  ],
  s0068: [
    'He amassed more than seven thousand volumes of books and personally collated them; memorials and impeachments were compiled into fifteen fascicles.',
    'He collected more than seven thousand books and collated them himself; his memorials and impeachments were gathered into fifteen fascicles.',
  ],
  s0069: [
    'His eldest son Yuntong showed much of his father\'s character but devoted himself to Buddhist principle, keeping the precepts throughout.',
    'His eldest son Yuntong inherited much of his father\'s manner but devoted himself to Buddhism and kept every precept.',
  ],
  s0070: [
    'He reached the posts of Adviser to Prince of Yueyang\'s household and Deputy Governor of East Yangzhou.',
    'He rose to adviser in Prince of Yueyang\'s household and deputy governor of East Yangzhou.',
  ],
  s0071: [
    'His youngest son Zonggui was clever and perceptive, serving as Director in the Masters of Writing\'s Bureau of Punishments, Left Western Aide to the Minister of Works, and Palace Secretary.',
    'His youngest son Zonggui was bright and discerning, and served as Director in the Bureau of Punishments, left western aide to the Minister of Works, and Palace Secretary.',
  ],
  s0072: [
    'Jiang Ge, styled Xiuying, was a native of Kaocheng in Jiyang.',
    'Jiang Ge, styled Xiuying, came from Kaocheng in Jiyang.',
  ],
  s0073: [
    'His grandfather Qizhi was Gold Section Director in the Song Masters of Writing.',
    'His grandfather Qizhi had been Gold Section Director under the Song.',
  ],
  s0074: [
    'His father Rouzhi was Granaries Section Director under Qi, famed for filial conduct—he died from grief in mourning for his mother.',
    'His father Rouzhi, Granaries Section Director under Qi, was renowned for filial piety and died of grief while mourning his mother.',
  ],
  s0075: [
    'Ge was clever and sharp from childhood with early literary talent; at six he could already compose linked prose.',
    'Clever from childhood and precocious in letters, Ge could write linked prose at six.',
  ],
  s0076: [
    'Rouzhi prized him greatly and said: "This boy will raise our clan.',
    'Rouzhi admired him deeply and said, "This child will bring honor to our house.',
  ],
  s0077: [
    '" At nine he entered mourning for his father; he and his younger brother Guan were together orphaned and poor, without teachers or friends nearby—the brothers urged each other on, reading with tireless energy.',
    '" At nine his father died. He and his younger brother Guan were left alone and poor, with no teachers near at hand; the two brothers pushed each other to study without rest.',
  ],
  s0078: [
    'At sixteen he lost his mother and became known for filial piety.',
    'At sixteen he lost his mother and became known for filial devotion.',
  ],
  s0079: [
    'When mourning ended, he and Guan both went to the Imperial Academy, enrolled as a student of the National University, and were selected at the top of the class.',
    'After mourning he and Guan entered the Imperial Academy as National University students and graduated at the top of their class.',
  ],
  s0080: [
    'Qi Palace Secretary Wang Rong and Personnel Director Xie Tiao both held him in high regard.',
    'Wang Rong, Palace Secretary of Qi, and Xie Tiao, Director of Personnel, both admired him.',
  ],
  s0081: [
    'Tiao once returned from palace guard duty and visited Ge; it was snowing heavily—seeing Ge in worn cotton with only a thin mat yet studying without tiring, Tiao sighed for a long time, took off the padded jacket he wore, and with his own hands cut half a felt mat for Ge\'s bedding before leaving.',
    'Once, coming off palace guard duty in heavy snow, Tiao visited Ge and found him in patched cotton on a thin mat, still studying without pause. Tiao sighed long, gave him the padded jacket he was wearing, and cut half his felt mat by hand for Ge\'s bedding before he left.',
  ],
  s0082: [
    'Minister of Works Prince of Jingling heard his fame and brought him in as a Western Pavilion scholar.',
    'Prince of Jingling, Minister of Works, heard of him and made him a Western Pavilion scholar.',
  ],
  s0083: [
    'At weak-cap age he was selected as xiucai of South Xu province.',
    'At twenty he was chosen xiucai of South Xu province.',
  ],
  s0084: [
    'At that time Hu Xiezhi of Yuzhang was acting provincial governor; Wang Rong wrote to Xiezhi instructing him to recommend Ge.',
    'Hu Xiezhi of Yuzhang was then acting governor; Wang Rong wrote urging him to recommend Ge.',
  ],
  s0085: [
    'Xiezhi was about to present Wang Fan of Langya as tribute and substituted Ge in his place.',
    'Xiezhi had intended to send up Wang Fan of Langya as the provincial tribute candidate and replaced him with Ge.',
  ],
  s0086: [
    'Upon first office he became Court Gentleman for Palace Attendance.',
    'His first appointment was Court Gentleman for Palace Attendance.',
  ],
  s0087: [
    'Vice Minister Jiang Shi deeply drew him close; when Shi became Crown Prince\'s Steward he memorialized for Ge as household aide.',
    'Vice Minister Jiang Shi took a strong liking to him; when Shi became Crown Prince\'s Steward he recommended Ge as household aide.',
  ],
  s0088: [
    'At the time Shi\'s power bent the court to the right; seeing Ge\'s talent fit for statecraft, he had him participate in urgent affairs—edicts and dispatches were all entrusted to Ge to draft.',
    'Shi then dominated the court; judging Ge capable of statecraft, he put him in charge of urgent business, and all edicts and dispatches were drafted by Ge.',
  ],
  s0089: [
    'Ge guarded against revealing traces—outsiders did not know.',
    'Ge kept his role hidden, and outsiders never knew.',
  ],
  s0090: [
    'When Shi was executed, his guests all suffered in his crime; Ge alone escaped through wit.',
    'When Shi was executed, every man in his circle was implicated; Ge alone escaped through cleverness.',
  ],
  s0091: [
    'Appointed Driving Section Director in the Masters of Writing.',
    'He was appointed Driving Section Director in the Masters of Writing.',
  ],
  s0092: [
    'In the first year of Zhongxing the Emperor entered Stone Fort; at that time Yuan Ang, Administrator of Wuxing, held the commandery against the righteous army—Ge was sent to compose the imperial letter to Ang and finished it standing at the desk; its phrasing was elegant and classical, and the Emperor deeply admired it, then had him jointly manage written records with Xu Mian.',
    'In Zhongxing year 1 Gaozu entered Stone Fort while Yuan Ang, administrator of Wuxing, held the commandery against the cause. Ge was told to draft the letter to Ang and finished it on the spot; its language was elegant, Gaozu praised it highly, and put him in charge of written records together with Xu Mian.',
  ],
  s0093: [
    'Prince of Jian\'an was made Inspector of Yong province and requested a chief secretary; Ge was made Secretary to the Northern Expedition, concurrently Commander of the Central Banners.',
    'When Prince of Jian\'an became inspector of Yongzhou and asked for a chief secretary, Ge was made secretary to the northern expedition staff and concurrently commander of the central banners.',
  ],
  s0094: [
    'He and his brother Guan had lived together from youth and could not bear to part; Guan begged hard to go together, so Guan was made Acting Secretary to the Northern Expedition, additionally secretary.',
    'He and Guan had lived together since childhood and could not bear to separate; Guan pleaded to go with him, and was made acting secretary on the northern expedition staff, additionally serving as secretary.',
  ],
  s0095: [
    'At the time Shen Yue of Wuxing and Ren Fang of Le\'an both prized him; Fang wrote to Ge: "This segment of the Yong prefecture household is a fine selection of talent—the literary office, both you brothers hold it—one may say driving two dragons on a long road, galloping fine steeds a thousand li.',
    'Shen Yue of Wuxing and Ren Fang of Le\'an both valued him. Fang wrote to Ge: "The Yongzhou staff has chosen its finest men—you and your brother both hold the literary office. It is like driving two dragons on a long road or running twin thoroughbreds a thousand li.',
  ],
  s0096: [
    '" En route at Jiangxia, Guan fell ill and died.',
    '" On the road at Jiangxia, Guan fell ill and died.',
  ],
  s0097: [
    'Ge was then in Yong, treated by the prince with the warmth of a commoner\'s friendship.',
    'Ge was then in Yongzhou, and the prince treated him with the easy warmth of an old friend.',
  ],
  s0098: [
    'The prince was summoned as Magistrate of Danyang; Ge was made secretary, overseeing the Five Officials Aide, appointed Regular Attendant of the Scattered Cavalry, and Chief of Jiankang.',
    'When the prince was recalled as magistrate of Danyang, Ge became his secretary, head of the Five Officials section, Regular Attendant of the Scattered Cavalry, and chief of Jiankang.',
  ],
  s0099: [
    'Repeatedly promoted to Magistrate of Moling and Jiankang.',
    'He was promoted in turn to magistrate of Moling and Jiankang.',
  ],
  s0100: [
    'His governance was clear and stern—the powerful feared him.',
    'He governed with clarity and severity, and the local strongmen feared him.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_036_b1.mjs <translation.json>'
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
