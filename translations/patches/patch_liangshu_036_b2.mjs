#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'He entered as Palace Writer Attendant, Left Assistant Director of the Ministry of Works, and Minister of Agriculture; then went out again as Chief Clerk to Prince Jin\'an of Cloud Banner, Administrator of Xunyang, and overseer of Jiangzhou prefectural affairs.',
    'He entered court as Palace Writer Attendant, Left Assistant Director of the Ministry of Works, and Minister of Agriculture, then went out again as chief clerk to Prince Jin\'an of Cloud Banner, administrator of Xunyang, and acting head of Jiangzhou affairs.',
  ],
  s0102: [
    'He was transferred as Chief Clerk to Prince Renwei of Luling; his posts as administrator and acting deputy remained unchanged, and every commandery feared him for his probity and severity.',
    'Transferred to chief clerk for Prince Renwei of Luling, he kept the same administrator and acting duties, and commanderies across the realm feared his austerity.',
  ],
  s0103: [
    'At the time young princes\' acting deputies often deferred to their chiefs of staff; Ge held himself to rectitude and would not sit with chiefs of staff as equals.',
    'Young princes\' acting deputies usually bowed to their chiefs of staff; Ge stood on principle and refused to share a seat with them.',
  ],
  s0104: [
    'Soon he was promoted to Left Grand Master of Lustrous Virtue, Chief Clerk to Prince Nanping, and Censor-in-Chief, impeaching powerful magnates without evasion.',
    'Soon he rose to Left Grand Master of Lustrous Virtue, chief clerk to Prince Nanping, and censor-in-chief, impeaching the mighty without flinching.',
  ],
  s0105: [
    'He was appointed Minister of the Lesser Treasury, went out as General of Loyal Might, Chief Clerk to Prince Nankang of North Central Command and Administrator of Guangling, then reassigned as Chief Clerk to Prince Zhenbei of Yuzhang; his generalship and administrator\'s post were unchanged.',
    'Appointed Minister of the Lesser Treasury, he went out as General of Loyal Might, chief clerk to Prince Nankang of North Central Command and administrator of Guangling, then was reassigned chief clerk to Prince Zhenbei of Yuzhang while keeping the same generalship and magistracy.',
  ],
  s0106: [
    'When Wei Governor of Xuzhou Yuan Faseng surrendered and submitted, Ge was ordered to follow the princely household to garrison Pengcheng.',
    'When Yuan Faseng, Wei governor of Xuzhou, surrendered, Ge was ordered to follow the prince and garrison Pengcheng.',
  ],
  s0107: [
    'When the city fell, Ge had never been comfortable on horseback; he took boat instead, and passing through Xiapi was seized by Wei men.',
    'The city fell. Ge had never ridden well; he took to the river instead, and at Xiapi Wei soldiers seized him.',
  ],
  s0108: [
    'Wei Governor of Xuzhou Yuan Yanming, hearing of Ge\'s literary reputation, treated him with great honor.',
    'Yuan Yanming, Wei governor of Xuzhou, had heard of Ge\'s fame and received him with deep respect.',
  ],
  s0109: [
    'Ge pleaded a lame leg and would not bow; Yanming was about to harm him, but seeing Ge\'s stern dignity in speech and bearing, treated him with renewed respect.',
    'Ge claimed a bad leg and refused to bow. Yanming meant to punish him, but Ge\'s stern bearing in word and face won respect instead.',
  ],
  s0110: [
    'At the time Zu Can was also detained; Yanming had Can compose inscriptions for the Tilting Vessel and the Clepsydra. Ge cursed Can: "You received the state\'s deep grace yet have no repayment; now you write inscriptions for the enemy—betraying the court.',
    'Zu Can was held with him. Yanming had Can write inscriptions for the Tilting Vessel and the Clepsydra. Ge reviled him: "The state heaped grace on you and you never repaid it. Now you write for the captors and betray the court.',
  ],
  s0111: [
    '" Yanming heard and ordered Ge to write the Zhangba Temple stele and a text sacrificing to Peng Zu; Ge refused, saying long captivity had left him no heart for such work.',
    '" Yanming then ordered Ge to compose the Zhangba Temple stele and a sacrifice to Peng Zu. Ge refused: long imprisonment had drained his mind.',
  ],
  s0112: [
    'Yanming pressed him harder and would have had him beaten.',
    'Yanming pressed harder and was about to have him flogged.',
  ],
  s0113: [
    'Ge said with stern countenance: "Jiang Ge is sixty years old; unable to give his life for his lord, today to die would be fortune—I swear never to write at another\'s command.',
    'Ge said, face hard: "Jiang Ge is sixty. I could not die for my lord; to die today would be luck. I swear I will never take up the brush for another man.',
  ],
  s0114: [
    '" Yanming knew he could not be broken and stopped.',
    '" Yanming saw he could not be bent and desisted.',
  ],
  s0115: [
    'Each day they gave him three sheng of husked millet—barely enough to keep life.',
    'Each day he received three sheng of husked millet—just enough to stay alive.',
  ],
  s0116: [
    'It happened the Wei ruler marched north to suppress Prince Zhongshan Yuan Lue\'s rebellion; Ge and Zu Can were released and sent back to court.',
    'When the Wei ruler marched north against Prince Zhongshan Yuan Lue\'s rebellion, Ge and Zu Can were freed and sent home to court.',
  ],
  s0117: [
    'An edict said: "Former General of Loyal Might, Chief Clerk of Zhenbei, and Administrator of Guangling Jiang Ge—talented in thought and expression, known inside and outside court, upright in office, unmoved in peril, chief aide to the Three Dukes—all agreed he was fit.',
    'An edict ran: "Jiang Ge, former General of Loyal Might, chief clerk of Zhenbei, and administrator of Guangling—gifted in mind and word, known in court and out, upright in office, unbroken in danger, chief aide to the Three Dukes—fully worthy of trust.',
  ],
  s0118: [
    'Appoint him Chief Clerk to the Grand Marshal, Prince Linchuan."',
    'Let him be chief clerk to the Grand Marshal, Prince Linchuan."',
  ],
  s0119: [
    'Gaozu was then zealous for Buddhism; court worthies often petitioned to receive ordination. Ge faithfully believed in karma, but Gaozu did not know and thought Ge did not embrace Buddhism; he bestowed on Ge a five-hundred-character "Awakened Intent Poem," saying "Only diligent effort and self-strengthening surpass cultivation;',
    'Gaozu was then deep in Buddhism; court worthies often asked to take vows. Ge truly believed in karma, but Gaozu did not know and thought he rejected the faith. He gave Ge a five-hundred-character "Awakened Intent Poem," saying, "Only diligence and self-strengthening beat empty practice;',
  ],
  s0120: [
    'How can one be a stubborn bump, like those condemned prisoners?',
    'Who would be a stubborn bump, like a man already condemned to die?',
  ],
  s0121: [
    'Let this be told to Jiang Ge, and also to the other noble travelers.',
    'Tell this to Jiang Ge, and to the other noble travelers as well.',
  ],
  s0122: [
    '" Also a handwritten edict: "Worldly retribution cannot be disbelieved—how can one be a stubborn bump as before Yuan Yanming?',
    '" A handwritten edict added: "Worldly retribution is real. How can you be a stubborn bump with Yuan Yanming as you were before?',
  ],
  s0123: [
    '" Ge thereupon memorialized requesting to receive the bodhisattva precepts.',
    '" Ge then memorialized asking to receive the bodhisattva precepts.',
  ],
  s0124: [
    'Again appointed Minister of the Lesser Treasury, Chief Clerk, and Colonel Commandant.',
    'He was again made Minister of the Lesser Treasury, chief clerk, and colonel commandant.',
  ],
  s0125: [
    'Prince Wuling was in East Yangzhou and rather arrogant and unrestrained; the Emperor summoned Ge and personally charged him: "Prince Wuling is young; Zang Dun is timid by nature and cannot correct him—I wish to have you replace him as acting administrator.',
    'Prince Wuling held East Yangzhou and had grown proud and loose. The emperor summoned Ge and charged him in person: "Prince Wuling is young. Zang Dun is mild and cannot correct him. I want you to replace him as acting administrator.',
  ],
  s0126: [
    'No one but you will do; you may not refuse.',
    'No one but you will do. You may not refuse.',
  ],
  s0127: [
    '" Appointed General Who Breaks the Charge, Chief Clerk to Prince Wuling of East Central Command, Assistant Administrator of Kuaiji, overseeing prefectural and commandery affairs.',
    '" He was made General Who Breaks the Charge, chief clerk to Prince Wuling of East Central Command, assistant administrator of Kuaiji, and acting head of prefectural and commandery affairs.',
  ],
  s0128: [
    'Ge\'s former students and subordinates, many with homes in East Yangzhou, hearing Ge was coming, all brought gifts along the road to welcome him.',
    'Many of Ge\'s former students and subordinates lived in East Yangzhou. Hearing he was coming, they lined the road with gifts to welcome him.',
  ],
  s0129: [
    'Ge said: "I have never accepted gifts—I cannot alone take my old friends\' baskets and boxes.',
    'Ge said, "I never take gifts. I cannot be the only one to fill my old friends\' baskets and boxes.',
  ],
  s0130: [
    '" On reaching his post he relied only on official salary; his meals had no second dish.',
    '" At his post he lived only on official salary and never ate more than one dish at a meal.',
  ],
  s0131: [
    'The commandery was vast and populous; lawsuits ran to hundreds per day—Ge divided and judged them, never once stalling in doubt.',
    'The commandery was broad and crowded; lawsuits came by the hundred each day. Ge divided and decided them without a moment\'s hesitation.',
  ],
  s0132: [
    'Merit always rewarded, fault always punished; the people were at peace, officials feared him, and every city trembled.',
    'Merit was always rewarded and fault always punished. The people rested easy, officials feared him, and every city shook.',
  ],
  s0133: [
    'Wang Qian of Langye was magistrate of Shanyin—his bribery was flagrant; at Ge\'s approach he resigned of his own accord.',
    'Wang Qian of Langye, magistrate of Shanyin, was awash in bribes. At Ge\'s coming he resigned before the wind.',
  ],
  s0134: [
    'The princely household feared him and thereafter held him in deep esteem.',
    'The prince feared him and thereafter held him in deep respect.',
  ],
  s0135: [
    'Whenever he attended banquets, his talk always drew on the Odes and Documents; the Prince therefore devoted himself to study and letters.',
    'At every banquet his talk turned to the Odes and Documents, and the prince came to love learning and letters.',
  ],
  s0136: [
    'Chief of Staff Shen Chiwen presented the Prince\'s poems to Gaozu; Gaozu said to Vice Director Xu Mian: "Jiang Ge has indeed proved equal to his charge.',
    'Chief of staff Shen Chiwen showed the prince\'s poems to Gaozu. Gaozu told Vice Director Xu Mian, "Jiang Ge has truly done his duty.',
  ],
  s0137: [
    '" Appointed Minister of Justice.',
    '" He was made Minister of Justice.',
  ],
  s0138: [
    'When he was about to leave, the people all cherished him and wished to keep him—he accepted no parting gifts.',
    'When he was about to leave, the people clung to him with grief. He took no parting gifts.',
  ],
  s0139: [
    'Escorts provisioned a boat as usual; Ge would none of it and took only the single craft the office provided.',
    'Escorts arranged a boat as always. Ge refused it and took only the single vessel the office gave him.',
  ],
  s0140: [
    'The boat listed to one side—he could not lie at ease.',
    'The boat listed to one side, and he could not lie down in comfort.',
  ],
  s0141: [
    'Someone said to Ge: "The boat is unsteady—crossing the river will be perilous; you should shift heavy objects to ballast the lighter hull.',
    'Someone told Ge, "The boat is unsteady. Crossing the river will be dangerous. Move heavy things to weigh down the lighter hull.',
  ],
  s0142: [
    '" Ge had nothing; he went to the West Mausoleum shore and took a dozen-odd stones to fill it.',
    '" Ge owned nothing. He went to the West Mausoleum shore, took more than ten stones, and loaded them aboard.',
  ],
  s0143: [
    'Such was his austerity and poverty.',
    'Such was his austerity.',
  ],
  s0144: [
    'Soon he supervised Wu commandery.',
    'Soon he was put in charge of Wu commandery.',
  ],
  s0145: [
    'At the time the territory was barren and hungry; robber bands operated openly.',
    'The land was then famine-stricken, and bandits roamed openly.',
  ],
  s0146: [
    'When Ge reached the commandery he had only twenty armed attendants from the office; the people all feared he could not quell bandits;',
    'When Ge arrived he had only twenty armed attendants from the office. The people feared he could not still the bandits;',
  ],
  s0147: [
    'hearing he intended to review the patrol commandant, the populace grew still more alarmed.',
    'and when they heard he meant to inspect the patrol commandant, fear only deepened.',
  ],
  s0148: [
    'Ge then broadly dispensed kindness and encouragement, clearly enforced regulations—bandits quieted, people and officials were at peace.',
    'Ge then showed broad kindness, enforced clear rules, and the bandits fell silent. People and officials alike were at peace.',
  ],
  s0149: [
    'When Prince Wuling went out to garrison Jiangzhou he said: "I gained Jiang Ge—refined and elegant in letters—how could I forget him in a day? I shall share my meals with him.',
    'When Prince Wuling went out to garrison Jiangzhou he said, "I gained Jiang Ge—refined and bright in letters. How could I forget him in a day? I shall eat with him.',
  ],
  s0150: [
    '" He memorialized for Ge to accompany him.',
    '" He memorialized for Ge to go with him.',
  ],
  s0151: [
    'Also appointed General of Bright Might, Chief Clerk of South Central Command, and Administrator of Xunyang.',
    'Ge was also made General of Bright Might, chief clerk of South Central Command, and administrator of Xunyang.',
  ],
  s0152: [
    'Summoned as Minister of Revenue.',
    'He was summoned to court as Minister of Revenue.',
  ],
  s0153: [
    'He loved to encourage village folk and build reputations for the young—therefore gentry and scholars flocked to him.',
    'He loved to lift up common folk and speak well of the young, and gentry and scholars gathered to him.',
  ],
  s0154: [
    'Minister of Works He Jingrong controlled appointments; the ranked selections were often unworthy.',
    'Minister of Works He Jingrong controlled appointments, and many of his choices were unworthy.',
  ],
  s0155: [
    'Ge was by nature forceful and upright; at every court banquet he always had praise and blame—therefore the powerful hated him, and he pleaded illness and returned home.',
    'Ge was forceful and upright. At every court banquet he praised and blamed without restraint. The powerful resented him, and he pleaded illness and went home.',
  ],
  s0156: [
    'Appointed Grand Master of Splendid Happiness, concurrently Colonel of Footsoldiers, and Chief Arbiter of South and North Yan provinces—leisurely and at ease, he took pleasure in letters and wine.',
    'He was made Grand Master of Splendid Happiness, colonel of footsoldiers, and chief arbiter of South and North Yan provinces, and lived at ease with letters and wine.',
  ],
  s0157: [
    'In the second month of the first year of Datong he died; posthumous title Qiangzi.',
    'In the second month of the first year of Datong he died. His posthumous title was Qiangzi.',
  ],
  s0158: [
    'His collected works in twenty scrolls circulated in the world.',
    'His collected works, twenty scrolls, circulated in the world.',
  ],
  s0159: [
    'Ge served as chief clerk in eight princely households, acted for four princes, thrice held two-thousand-household posts, had no concubines at his side, and his home stood bare as walls—the world honored him for it.',
    'Ge had been chief clerk in eight princely households, acting deputy for four princes, and thrice held two-thousand-household posts. He kept no concubines, and his house stood bare as walls. The world honored him for it.',
  ],
  s0160: [
    'His eldest son Xingmin loved learning and had talent; he reached Direct Communication Gentleman, died young, and left collected works in five scrolls.',
    'His eldest son Xingmin loved learning and had talent. He reached Direct Communication Gentleman, died young, and left five scrolls of collected works.',
  ],
  s0161: [
    'Second son Congjian had literary sensibility from youth; at seventeen he wrote "Song of Gathering Lotus" to satirize Jingrong and won acclaim in his day.',
    'Second son Congjian had literary feeling from youth. At seventeen he wrote "Song of Gathering Lotus" to satirize Jingrong, and his age praised it.',
  ],
  s0162: [
    'He served as aide to the Minister of Education.',
    'He served as aide to the Minister of Education.',
  ],
  s0163: [
    'In Hou Jing\'s rebellion he was killed by Ren Yue.',
    'In Hou Jing\'s rebellion Ren Yue killed him.',
  ],
  s0164: [
    'His son Jian kowtowed until blood flowed, begging to die in his father\'s place and shielding him with his body—they were both killed.',
    'His son Jian kowtowed until blood ran, begging to die in his father\'s place and covering him with his body. Both were killed.',
  ],
  s0165: [
    'All under heaven grieved.',
    'All under heaven grieved.',
  ],
  s0166: [
    'The historian writes: Gaozu attended to governance; Kong Xiuyuan was recognized for his discernment in administration—having met his time, this was fortune.',
    'The historian writes: Gaozu cared for good government. Kong Xiuyuan was known for his grasp of rule, and to meet such a time was fortune.',
  ],
  s0167: [
    'Jiang Ge was quick-witted, brilliant, and upright—is he not a famed name of his generation?',
    'Jiang Ge was quick, bright, and upright—a famed name of his generation, surely.',
  ],
  s0168: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0169: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_036_b2.mjs <translation.json>'
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
