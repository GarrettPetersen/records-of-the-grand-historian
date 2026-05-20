#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0201: [
    'Earlier, the Founding Emperor had summoned more than twenty promising young men, set out wine, and charged them to compose poems.',
    'In the beginning the Founding Emperor gathered more than twenty rising talents, poured wine, and bade them write poems.',
  ],
  s0202: [
    'Zang Dun failed to finish his poem and was fined a dou of wine; Dun drained it, his color never changed, and he talked and laughed as if at ease.',
    'Zang Dun could not complete his poem and was penalized a dou of wine; he drank it off without a change of face, chatting and laughing as though nothing had happened.',
  ],
  s0203: [
    'Jie dipped his brush and finished at once—the text needed not a single revision.',
    'Jie wet his brush and the piece was done on the spot, the prose flawless without a single added stroke.',
  ],
  s0204: [
    'The Founding Emperor praised both and said: "Zang Dun\'s drinking and Xiao Jie\'s writing are the beauty of the banquet itself.',
    'The Founding Emperor admired them both and said, "Zang Dun\'s capacity for wine and Xiao Jie\'s gift for prose are the splendor of this very feast.',
  ],
  s0205: [
    '" At seventy-three he died at home.',
    '" He was seventy-three when he died at home.',
  ],
  s0206: [
    'His third son Yun first served as acting palace attendant and regular cavalier on a mission to Wei; on return he became junior tutor to the crown prince, and later rose to Grand Master of Splendid Happiness.',
    'His third son Yun first went as acting palace attendant and regular cavalier on an embassy to Wei; recalled, he became junior tutor to the crown prince and in time reached Grand Master of Splendid Happiness.',
  ],
  s0207: [
    'Qia, courtesy name Hongcheng, was Jie\'s elder cousin by the father\'s line.',
    'Qia, styled Hongcheng, was Jie\'s elder cousin on the father\'s side.',
  ],
  s0208: [
    'His father Huibi had been Minister of Personnel under Qi and bore a weighty name in the previous age.',
    'His father Huibi had been Minister of Personnel in Qi and enjoyed great renown in the former dynasty.',
  ],
  s0209: [
    'Qia was clever and quick-witted from childhood; at seven he could recite the Songs of Chu nearly by heart.',
    'Qia was bright and precocious as a boy; at seven he had the Songs of Chu nearly memorized.',
  ],
  s0210: [
    'When grown he loved learning and ranged widely, and was also skilled at literary composition.',
    'As a man he loved study and read broadly, and wrote with real skill.',
  ],
  s0211: [
    'In the Yongming era of Qi he was a student of the national university and was recommended on the classics.',
    'Under Qi in the Yongming period he studied at the national university and was nominated for mastery of the classics.',
  ],
  s0212: [
    'He began office as assistant editor in the Secretariat and was transferred to outer corps adjutant of the Western Central Command.',
    'He entered service as assistant editor in the Secretariat, then moved to outer corps adjutant under the Western Central Command.',
  ],
  s0213: [
    'At the opening of Heavenly Surveillance he became registrar to the Prince of Poyang of the Forward Army and secretary in a bureau of the Ministry of Revenue ([lacuna] in the text), then was promoted to attendant in the crown prince\'s household.',
    'When Heavenly Surveillance began he was registrar to the Prince of Poyang of the Forward Army and secretary in the Ministry of Revenue ([lacuna] bureau), then advanced to attendant in the crown prince\'s household.',
  ],
  s0214: [
    'He went out as aide to the governor of Southern Xuzhou; it was a post near the capital in a key commandery, with clerks numbering in the thousands, and every man who had held it before had grown enormously rich.',
    'He was sent out as aide to the governor of Southern Xuzhou—a post hard by the capital in a great commandery, with thousands of clerks, and every predecessor had left it enormously wealthy.',
  ],
  s0215: [
    'Qia held the post with a clean person and led by example, accepting not a single gift; his wife and children could not escape cold and hunger.',
    'Qia served with integrity and led by example, refusing every gift that came his way, so that wife and children knew hunger and cold.',
  ],
  s0216: [
    'On return he was made aide in the Ministry of Works, then interior minister of Jian\'an, and was dismissed for an offense.',
    'Recalled, he became aide in the Ministry of Works and interior minister of Jian\'an, but lost his post over a disciplinary matter.',
  ],
  s0217: [
    'After a long interval he was raised to chief clerk of the Guard Army and advisory aide of the Northern Central Command, then advanced to Minister of the Court for State Ceremonies and marshal of the Prince of Linchuan of the Secretariat.',
    'Long afterward he was made chief clerk of the Guard Army and advisory aide of the Northern Central Command, then rose to Minister of the Court for State Ceremonies and marshal to the Prince of Linchuan of the Secretariat.',
  ],
  s0218: [
    'At the opening of Universal Harmony he was appointed acting palace attendant and regular cavalier and concurrently censor-in-chief, but was dismissed on public grounds.',
    'When Universal Harmony began he was named acting palace attendant and regular cavalier and concurrently censor-in-chief, then removed for an official offense.',
  ],
  s0219: [
    'Before long he was made regular palace attendant and cavalier.',
    'Shortly he became regular palace attendant and cavalier.',
  ],
  s0220: [
    'Qia had shown literary talent from youth; the Founding Emperor ordered him to compose the inscriptions beneath the reliquaries of the Tongtai and Daaijing temples—the texts were very fine.',
    'Qia had been gifted with words from youth; the Founding Emperor charged him with the inscriptions under the reliquaries at Tongtai and Daaijing, and the writing was superb.',
  ],
  s0221: [
    'In the second year he was promoted to palace attendant and regular cavalier.',
    'In the second year he advanced to palace attendant and regular cavalier.',
  ],
  s0222: [
    'He went out as General Who Wins the Distant and interior minister of Linhai.',
    'He was sent out as General Who Wins the Distant and interior minister of Linhai.',
  ],
  s0223: [
    'His government was clear and even, he did not rely on severity, and the people found him easy to live under.',
    'He governed with clarity and calm, shunning harsh methods, and the people took comfort in his rule.',
  ],
  s0224: [
    'On return he was made chief clerk on the left of the Secretariat and was again ordered to compose the Stele of the Dangtu Weir—the diction was likewise rich and elegant.',
    'Recalled, he became chief clerk on the left of the Secretariat and was again charged with the Stele of the Dangtu Weir, the prose once more lush and fine.',
  ],
  s0225: [
    'In the sixth year he died in office, aged fifty-five.',
    'In the sixth year he died in post, at the age of fifty-five.',
  ],
  s0226: [
    'An edict ordered public mourning; funeral gifts were twenty thousand cash and fifty bolts of cloth.',
    'The throne ordered mourning proclaimed; the funeral gift was twenty thousand cash and fifty bolts of cloth.',
  ],
  s0227: [
    'His collected works ran to twenty juan and circulated in the world.',
    'He left twenty juan of writings in circulation.',
  ],
  s0228: [
    'Chu Qiu, courtesy name Zhongbao, was a native of Yangzhai in Henan.',
    'Chu Qiu, styled Zhongbao, came from Yangzhai in Henan.',
  ],
  s0229: [
    'His grandfather Shudu had been General Who Subdues the Barbarians and governor of Yongzhou under Song.',
    'His grandfather Shudu had been General Who Subdues the Barbarians and governor of Yongzhou in Song.',
  ],
  s0230: [
    'His grandfather Ai was outer corps adjutant to the Grand Preceptor.',
    'His grandfather Ai had been outer corps adjutant to the Grand Preceptor.',
  ],
  s0231: [
    'His father Hui was an attendant in the crown prince\'s household.',
    'His father Hui had been an attendant in the crown prince\'s household.',
  ],
  s0232: [
    'All three had married princesses of Song.',
    'All three had taken princesses of Song in marriage.',
  ],
  s0233: [
    'Qiu was orphaned young and poor, but with steadfast purpose he loved learning and possessed literary talent.',
    'Qiu lost his parents early and knew poverty, yet he studied with single-minded devotion and had a gift for letters.',
  ],
  s0234: [
    'The Prince of Pingling, Jing Su of Song, was executed in the Yuanhui era, and only one daughter survived.',
    'Under Song, the Prince of Pingling, Jing Su, was put to death in the Yuanhui period; a single daughter alone was spared.',
  ],
  s0235: [
    'His former clerks He Changyu and Wang Siyuan, hearing that Qiu was upright, gave him this girl in marriage and spoke up for him far and wide.',
    'His former retainers He Changyu and Wang Siyuan, hearing of Qiu\'s integrity, married this daughter to him and spread his name abroad.',
  ],
  s0236: [
    'He served Qi, beginning as acting adjutant on the staff of the General Who Subdues the Barbarians, soon acting in the law bureau, then transferred to registrar to the Princess of Qujiang of the Right Army.',
    'In Qi he began as acting adjutant on the staff of the General Who Subdues the Barbarians, soon held the law bureau in commission, and was moved to registrar to the Princess of Qujiang under the Right Army.',
  ],
  s0237: [
    'He went out as magistrate of Liyang and in the district kept himself clean, living on his official salary alone.',
    'He was sent out as magistrate of Liyang and governed with spotless integrity, content with his public stipend alone.',
  ],
  s0238: [
    'He was made chief clerk to the Pacification of the West.',
    'He was appointed chief clerk to the Pacification of the West.',
  ],
  s0239: [
    'At the opening of Heavenly Surveillance he was promoted to groom of the crown prince and regular cavalier attendant, and concurrently master of audience in the Secretariat.',
    'When Heavenly Surveillance began he rose to groom of the crown prince and regular cavalier attendant, and concurrently master of audience in the Secretariat.',
  ],
  s0240: [
    'He went out as magistrate of Jiankang; when his mother died he left office, and though recalled to his former post he firmly declined the appointment.',
    'He became magistrate of Jiankang; at his mother\'s death he resigned, and when the court tried to restore him to the same rank he refused outright.',
  ],
  s0241: [
    'When mourning ended he was made advisory aide of the Northern Central Command, and soon was promoted to secretary in the Secretariat, again concurrently master of audience.',
    'After mourning he became advisory aide of the Northern Central Command, then secretary in the Secretariat, again holding the post of master of audience.',
  ],
  s0242: [
    'He was appointed General of Cloud Cavalry and successively held the posts of Minister of Justice and Grand Master of Splendid Happiness while remaining master of audience as before.',
    'He was named General of Cloud Cavalry and in succession held Minister of Justice and Grand Master of Splendid Happiness, still keeping his post as master of audience.',
  ],
  s0243: [
    'He was transferred to censor-in-chief.',
    'He was made censor-in-chief.',
  ],
  s0244: [
    'Qiu was by nature upright and forceful and yielded to no pressure; in the censorate he was highly praised for competence.',
    'Qiu was upright and unyielding by nature and bowed to no man; in the censorate he was reckoned exemplary.',
  ],
  s0245: [
    'In the fourth year of Universal Harmony he went out as chief clerk of the Northern Central Command and interior minister of Southern Lanling.',
    'In the fourth year of Universal Harmony he was sent out as chief clerk of the Northern Central Command and interior minister of Southern Lanling.',
  ],
  s0246: [
    'He entered court as regular palace attendant and cavalier and superintendent of the Feathered Forest.',
    'He returned to the capital as regular palace attendant and cavalier and superintendent of the Feathered Forest.',
  ],
  s0247: [
    'In the seventh year he was promoted to Minister of the Court for State Ceremonies, and before long to Minister of Justice.',
    'In the seventh year he became Minister of the Court for State Ceremonies, and shortly afterward Minister of Justice.',
  ],
  s0248: [
    'In the Zhongdatong era he went out as chief clerk to the Prince of Linchuan, General of Benevolent Might, and interior minister of Jiangxia, but did not take up the post because of illness.',
    'In the Zhongdatong period he was named chief clerk to the Prince of Linchuan of Benevolent Might and interior minister of Jiangxia, but illness kept him from the post.',
  ],
  s0249: [
    'He was reassigned Grand Master of Splendid Happiness; before he could accept, he was again made Minister of the Court for State Ceremonies and colonel of the foot soldiers.',
    'The appointment was changed to Grand Master of Splendid Happiness; before he took it up he was again Minister of the Court for State Ceremonies and colonel of the foot soldiers.',
  ],
  s0250: [
    'Before long he was promoted to regular palace attendant and cavalier and director of the Secretariat, and concurrently director of composition.',
    'Shortly he rose to regular palace attendant and cavalier and director of the Secretariat, holding concurrently the directorship of composition.',
  ],
  s0251: [
    'He was transferred to chief clerk on the left of the Secretariat, his posts as attendant and director of composition remaining as before.',
    'He became chief clerk on the left of the Secretariat, still palace attendant and director of composition.',
  ],
  s0252: [
    'Since Sun Li of Wei and Xun Zu of Jin, no aide of the Secretariat had worn the court ermine until Qiu.',
    'Since Sun Li in Wei and Xun Zu in Jin, no Secretariat aide had worn the court ermine until Qiu.',
  ],
  s0253: [
    'Soon he went out as chief clerk to the Prince of Hedong, General of Upright Might with the Light Chariot, and interior minister of Southern Lanling.',
    'Before long he was chief clerk to the Prince of Hedong, General of Upright Might with the Light Chariot, and interior minister of Southern Lanling.',
  ],
  s0254: [
    'He entered court as palace attendant and regular cavalier and colonel of the foot soldiers.',
    'He returned as palace attendant and regular cavalier and colonel of the foot soldiers.',
  ],
  s0255: [
    'Before long he memorialized to retire; the edict did not permit it.',
    'Shortly he asked leave to retire; the throne refused.',
  ],
  s0256: [
    'Soon he was again appointed Grand Master of Splendid Happiness and given the added title of attendant.',
    'Before long he was again Grand Master of Splendid Happiness with the added post of attendant.',
  ],
  s0257: [
    'He died in office, aged seventy.',
    'He died in post at the age of seventy.',
  ],
  s0258: [
    'Liu Ru, courtesy name Xiaozhi, was a man of Anshangli in Pengcheng.',
    'Liu Ru, styled Xiaozhi, came from Anshangli in Pengcheng.',
  ],
  s0259: [
    'His grandfather Kan was Duke Zhongzhao, the Duke of Loyalty and Illumination, Minister of Works under Song.',
    'His grandfather Kan was Duke Zhongzhao, Minister of Works under Song.',
  ],
  s0260: [
    'His father Juan was Grand Minister of Ceremonies under Qi, posthumously Jingzi.',
    'His father Juan was Grand Minister of Ceremonies in Qi and bore the posthumous name Jingzi.',
  ],
  s0261: [
    'Ru was clever and keen from childhood; at seven he could compose prose.',
    'Ru was bright and sharp as a boy; at seven he could already write.',
  ],
  s0262: [
    'At fourteen, while mourning his father, he wasted away until only bone remained, and all his kin marveled at him.',
    'At fourteen he mourned his father until he was skin and bone; kinsmen and neighbors were astonished.',
  ],
  s0263: [
    'When mourning ended his uncle Zhen was interior minister of Yixing and took him to his post, always seating him at his side, and told guests: "This boy is the pearl of our house.',
    'When mourning ended his uncle Zhen governed Yixing and brought him along, keeping him always at his side, and said to guests, "This child is the pearl of our clan.',
  ],
  s0264: [
    '" When grown he was handsome in bearing, open and harmonious by nature, and even at home none saw him show pleasure or anger.',
    '" Grown handsome in bearing and even-tempered, even his own household never caught him in joy or anger.',
  ],
  s0265: [
    'The province summoned him to serve as registrar.',
    'His home province called him to be registrar.',
  ],
  s0266: [
    'He began office as acting adjutant in the law bureau of the Central Army.',
    'He entered service as acting adjutant in the law bureau of the Central Army.',
  ],
  s0267: [
    'At the time Shen Yue of the Pacification Army heard his name and took him as chief clerk; he often joined him in feasts and poetry, and Yue admired him greatly.',
    'Shen Yue of the Pacification Army heard of him and made him chief clerk; they often feasted and wrote poems together, and Yue prized him highly.',
  ],
  s0268: [
    'He rose in succession through attendant in the crown prince\'s household, chief clerk to the Prince of Linchuan of the Central Army, groom of the crown prince, and gentleman in the Audience Hall of the Ministry.',
    'He advanced through attendant in the crown prince\'s household, chief clerk to the Prince of Linchuan of the Central Army, groom of the crown prince, and gentleman in the Audience Hall.',
  ],
  s0269: [
    'He went out as magistrate of Taimo and in the district left a record of clean government.',
    'He was magistrate of Taimo and governed the district with a clean record.',
  ],
  s0270: [
    'On return he was made companion to the Prince of Jin\'an and then attendant in the crown prince\'s household.',
    'Recalled, he became companion to the Prince of Jin\'an, then attendant in the crown prince\'s household.',
  ],
  s0271: [
    'Ru loved literature from youth and was also quick by nature; once at the imperial seat he composed a "Rhapsody on Li" on command and finished at once, the text needing no revision—the Founding Emperor praised him highly.',
    'Ru loved letters from boyhood and wrote with speed; once before the throne he was ordered to compose a "Rhapsody on Li," finished on the spot without a single correction, and the Founding Emperor was lavish in praise.',
  ],
  s0272: [
    'Later, while attending a banquet in the Hall of Everlasting Light, the emperor ordered the assembled ministers to compose poems; Ru and Zhang Shuai were both drunk and had not finished when the Founding Emperor took Ru\'s writing tablet and inscribed in jest:',
    'Later at a banquet in the Hall of Everlasting Light the emperor bade the ministers write poems; Ru and Zhang Shuai were both drunk and slow, so the Founding Emperor took Ru\'s tablet and wrote in play:',
  ],
  s0273: [
    '"Zhang Shuai is the southern beauty; Liu Ru is Luoyang\'s talent. Dip the brush and answer at once—why linger so long?"',
    '"Zhang Shuai, jewel of the south; Liu Ru, Luoyang\'s wit. Wet the brush and answer now—why hold back so long?"',
  ],
  s0274: [
    'Such was the degree of his favor.',
    'So dearly was he held.',
  ],
  s0275: [
    'He was transferred to secretary in the Secretariat and concurrently master of audience.',
    'He became secretary in the Secretariat and concurrently master of audience.',
  ],
  s0276: [
    'Before long he was promoted to steward of the crown prince\'s household, his other posts remaining as before.',
    'Shortly he rose to steward of the crown prince\'s household, keeping his other offices.',
  ],
  s0277: [
    'He went out as chief clerk to the Prince of Jin\'an, General of Propagating Grace, and concurrently aide to the governor of Danyang.',
    'He was sent out as chief clerk to the Prince of Jin\'an, General of Propagating Grace, and concurrently aide to the governor of Danyang.',
  ],
  s0278: [
    'He was promoted to junior tutor to the crown prince and secretary in the Ministry of Personnel.',
    'He advanced to junior tutor to the crown prince and secretary in the Ministry of Personnel.',
  ],
  s0279: [
    'He went out as chief clerk to the Prince of Xiangdong with the Light Chariot and concurrently aide to the governor of Kuaiji, and was dismissed on public grounds.',
    'He was chief clerk to the Prince of Xiangdong with the Light Chariot and concurrently aide to the governor of Kuaiji, then removed for an official offense.',
  ],
  s0280: [
    'Before long he was raised to recorder in the prince\'s household, regular cavalier attendant, and concurrently Grand Master of Splendid Happiness.',
    'Shortly he was made recorder in the prince\'s household and regular cavalier attendant, and concurrently Grand Master of Splendid Happiness.',
  ],
  s0281: [
    'He rose in succession to Minister of the Court for State Treasuries, chief clerk on the left of the Secretariat, and censor-in-chief, and in each post was called competent.',
    'He advanced through Minister of the Court for State Treasuries, chief clerk on the left of the Secretariat, and censor-in-chief, and in each was reckoned fit for the post.',
  ],
  s0282: [
    'In the second year of Great Communication he was promoted to palace attendant and regular cavalier.',
    'In the second year of Great Communication he became palace attendant and regular cavalier.',
  ],
  s0283: [
    'In the third year he was promoted to Minister of the Left for the People and colonel of the foot soldiers.',
    'In the third year he rose to Minister of the Left for the People and colonel of the foot soldiers.',
  ],
  s0284: [
    'In the fourth year of Middle Great Communication he went out as chief clerk to the Prince of Linchuan, General of Benevolent Might, and interior minister of Jiangxia, with the added title General of Upright Might.',
    'In the fourth year of Middle Great Communication he was chief clerk to the Prince of Linchuan of Benevolent Might and interior minister of Jiangxia, with the added rank General of Upright Might.',
  ],
  s0285: [
    'In the fifth year he was made General Who Pacifies the Distant and chief clerk on the left of the Secretariat; before he could accept he was changed to Minister of Justice and colonel of the Right Army.',
    'In the fifth year he was named General Who Pacifies the Distant and chief clerk on the left of the Secretariat; before taking up the post he was made Minister of Justice and colonel of the Right Army.',
  ],
  s0286: [
    'In the fifth year of Great Unity he acted as Minister of Personnel.',
    'In the fifth year of Great Unity he served as acting Minister of Personnel.',
  ],
  s0287: [
    'That year he went out as General of Illustrious Might and interior minister of Jinling.',
    'The same year he was sent out as General of Illustrious Might and interior minister of Jinling.',
  ],
  s0288: [
    'In the commandery his rule was harmonious and orderly, and officials and people alike praised him.',
    'In the commandery he governed with harmony and order, and both clerks and common people spoke well of him.',
  ],
  s0289: [
    'In the seventh year he entered court as attendant and colonel of the Right Army.',
    'In the seventh year he returned to court as attendant and colonel of the Right Army.',
  ],
  s0290: [
    'That year he was again Minister of Personnel and left office on mourning for his mother.',
    'The same year he was again Minister of Personnel and resigned when his mother died.',
  ],
  s0291: [
    'Before the mourning term had ended he died of grief, aged fifty-nine.',
    'He had not finished the mourning period when grief killed him, at fifty-nine.',
  ],
  s0292: [
    'His posthumous title was The Filial.',
    'After death he was given the posthumous name The Filial.',
  ],
  s0293: [
    'Ru in youth was famed alongside his cousins Bao and Xiaochuo.',
    'In youth Ru shared renown with his cousins Bao and Xiaochuo.',
  ],
  s0294: [
    'Bao died young; Xiaochuo was repeatedly dismissed from office, and neither rose high—only Ru attained wealth and rank.',
    'Bao died early; Xiaochuo was dismissed again and again and never rose far—only Ru won wealth and high office.',
  ],
  s0295: [
    'He left a collected works in twenty juan.',
    'His collected writings ran to twenty juan.',
  ],
  s0296: [
    'His son Chu was an editor in the Secretariat and died young.',
    'His son Chu was an editor in the Secretariat and died early.',
  ],
  s0297: [
    'Ru had two younger brothers: Lan and Zun.',
    'Ru\'s two younger brothers were Lan and Zun.',
  ],
  s0298: [
    'Lan, courtesy name Xiaozhi, at sixteen had mastered the Laozi and the Changes.',
    'Lan, styled Xiaozhi, at sixteen had mastered the Laozi and the Book of Changes.',
  ],
  s0299: [
    'He held office through secretary in the Secretariat; when his birth mother died he built a hut by her tomb.',
    'He rose to secretary in the Secretariat; at the death of the mother who bore him he dwelt in a hut beside her grave.',
  ],
  s0300: [
    'Through two full mourning cycles he never tasted salt or dairy, and in winter wore only a single layer of cloth.',
    'For two full mourning cycles he never touched salt or dairy, and in winter wore nothing but a single layer of plain cloth.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_041_b3.mjs <translation.json>'
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
