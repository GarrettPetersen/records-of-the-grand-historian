#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Book of Changes says: "When there are heaven and earth, then there are the myriad things; when there are the myriad things, then there are male and female; when there are male and female, then there are husband and wife.',
    'The Book of Changes says: "Once heaven and earth exist, the myriad things follow; once the myriad things exist, male and female follow; once male and female exist, husband and wife follow.',
  ],
  s0002: [
    '" The meaning of husband and wife—how exalted it is!',
    '" How exalted is the meaning of husband and wife!',
  ],
  s0003: [
    'In the Rites of Zhou, the king established the empress and the six inner palaces—three consorts, nine imperial concubines, twenty-seven palace ladies, and eighty-one palace attendants—to oversee inner governance throughout the realm.',
    'The Rites of Zhou say the king set up an empress and six inner palaces—three consorts, nine concubines, twenty-seven palace ladies, and eighty-one attendants—to govern affairs within the realm.',
  ],
  s0004: [
    'Hence the "Meaning of Marriage" says: "The Son of Heaven and the empress are like sun and moon, yin and yang—they need each other to be complete."',
    'So the "Meaning of Marriage" says the Son of Heaven and the empress are like sun and moon, yin and yang, completing one another.',
  ],
  s0005: [
    'At the beginning of Han, titles followed Qin usage: the emperor\'s mother was called empress dowager, his chief consort empress, with additional ranks such as beauty, good person, eighth son, and seventh son.',
    'Early Han kept Qin titles: the emperor\'s mother was empress dowager, his consort empress, with further ranks of beauty, good person, eighth son, seventh son, and the like.',
  ],
  s0006: [
    'By Emperor Xiaowu\'s time the system of ranks including talented attendant and the like totaled fourteen grades.',
    'Under Emperor Xiaowu the ranks from talented attendant onward reached fourteen grades in all.',
  ],
  s0007: [
    'Down through Wei and Jin, titles for imperial mothers all followed Han law;',
    'Through Wei and Jin, titles for imperial mothers all followed Han precedent;',
  ],
  s0008: [
    'from consort downward, each generation added or reduced ranks.',
    'below the rank of consort, each age revised the roster.',
  ],
  s0009: [
    'Emperor Gaozu quelled disorder and restored order, taking deep warning from luxury and excess, wearing poor clothes and eating plain food, putting frugality first.',
    'Gaozu ended chaos and restored rule, deeply wary of extravagance, preferring coarse dress and plain fare and putting thrift first.',
  ],
  s0010: [
    'His worthy consort died early; the office of empress stood empty; the numbers of palace women were left unchanged.',
    'His worthy partner died young; the empress\'s seat stayed vacant; the roster of palace women was not revised.',
  ],
  s0011: [
    'Emperor Taizong and Emperor Shizu came up from the heir\'s establishment, yet their consorts all died first, and neither established an empress.',
    'Taizong and Shizu rose from the heir\'s household, but their consorts died first and neither raised an empress.',
  ],
  s0012: [
    'The present compilation supplies only what is missing.',
    'This record therefore fills only the gaps.',
  ],
  s0013: [
    'Empress Zhang of Taizu',
    'Empress Zhang of Taizu',
  ],
  s0014: [
    'Taizu\'s Honored Empress, the Zhang clan, taboo name Shangrou, was a native of Fangcheng in Fanyang.',
    'Taizu\'s Honored Empress Zhang, taboo name Shangrou, came from Fangcheng in Fanyang.',
  ],
  s0015: [
    'Her grandfather Cihui was Administrator of Puyang under Song.',
    'Her grandfather Cihui served Song as Administrator of Puyang.',
  ],
  s0016: [
    'The empress\'s mother was of the Xiao clan—that is, an aunt on Emperor Wen\'s side.',
    'The empress\'s mother was a Xiao, a cousin of Emperor Wen on the paternal line.',
  ],
  s0017: [
    'In Yuanjia of Song she became a consort to Emperor Wen and bore Prince Yi of Changsha, styled King of Xuanwu, Prince Fu of Yongyang, styled King of Zhao, and afterward bore Gaozu.',
    'In Song\'s Yuanjia era she entered Emperor Wen\'s harem and bore Prince Yi of Changsha, King of Xuanwu, Prince Fu of Yongyang, King of Zhao, and later Gaozu.',
  ],
  s0018: [
    'Her father Muzhi, styled Sijing, was sixth-generation descendant of Jin Minister of Works Hua.',
    'Her father Muzhi, styled Sijing, was a sixth-generation descendant of Jin\'s Minister of Works Hua.',
  ],
  s0019: [
    'Her great-grandfather Yu was implicated in Hua\'s execution, banished to Xinggu, recalled before he arrived.',
    'Her great-grandfather Yu was condemned in Hua\'s case, exiled toward Xinggu, and recalled before he arrived.',
  ],
  s0020: [
    'After crossing the Yangtze he served as aide to the chancellor and as attendant to the crown prince.',
    'After crossing south he was a chancellor\'s aide and a crown prince attendant.',
  ],
  s0021: [
    'Muzhi in youth was square and refined, with discernment.',
    'Muzhi in youth was upright and elegant, with keen judgment.',
  ],
  s0022: [
    'In Yuanjia of Song he was made Outer Member of the Scattered Cavalry.',
    'In Song\'s Yuanjia era he became an outer member of the Scattered Cavalry.',
  ],
  s0023: [
    'He was on good terms with Minister of the Civil Service Jiang Zhan and Left Leader of the Heir\'s Household Yuan Shu; Shu recommended him to Prince Jun of Shixing, and Jun warmly received him.',
    'He was close to Minister of the Civil Service Jiang Zhan and the heir\'s left leader Yuan Shu; Shu recommended him to Prince Jun of Shixing, and Jun took him in warmly.',
  ],
  s0024: [
    'Muzhi saw the disaster sprouting and thought to escape the trouble; he spoke to Zhan asking to be sent out.',
    'Muzhi saw trouble brewing and sought a way out; he asked Zhan to post him away.',
  ],
  s0025: [
    'Zhan was about to use him in an eastern county; he firmly begged for a distant commandery, and after long delay became General Pacifying the Distance and Administrator of Jiaozhi.',
    'Zhan meant to place him in an eastern county, but he begged for a distant commandery and, after long delay, became General Pacifying the Distance and Administrator of Jiaozhi.',
  ],
  s0026: [
    'His administration showed exceptional achievement.',
    'He governed with outstanding results.',
  ],
  s0027: [
    'When the inspector died, Jiaozhi fell into great disorder; Muzhi by awe and kindness guided and comforted them, and within the borders there was peace.',
    'When the inspector died, Jiaozhi erupted in chaos; Muzhi won men by authority and kindness, and the region grew calm.',
  ],
  s0028: [
    'Emperor Wen of Song heard and praised this, and was about to make him Inspector of Jiaozhi, but Muzhi fell ill and died.',
    'Emperor Wen of Song heard and praised him and was about to make him Inspector of Jiaozhi, but Muzhi fell ill and died.',
  ],
  s0029: [
    'His son Hongji, styled Zhenyi, in early Qi was staff officer to the Pacify West army and died in office.',
    'His son Hongji, styled Zhenyi, in early Qi served as staff officer to the Pacify West army and died in office.',
  ],
  s0030: [
    'When Gaozu ascended the throne, Muzhi was posthumously made Glory Grand Master with gold seal.',
    'When Gaozu took the throne, Muzhi was posthumously made Glory Grand Master with a gold seal.',
  ],
  s0031: [
    'Another edict said: "The deceased uncle, Qi staff officer to the Pacify West army, had pure style and elegant counsel, from of old shoulder to shoulder with famous men; his years were not long, early leaving the world his light hid.',
    'Another edict said: "My late uncle, Qi\'s Pacify West staff officer, bore pure taste and fine counsel and long stood among eminent men; his years were short and his light went under early.',
  ],
  s0032: [
    'I in youth parted from bitter hardship, kin feeling ever keener; though dwelling tombs were mutually accomplished, touring carriage had no gift-offering, words rising at eternal parting, the eye touched brings anguished heart.',
    'I knew bitter separation in youth and feel the bond all the more; though tombs were raised, no carriage of gifts went forth, and every thought of his going wrings the heart.',
  ],
  s0033: [
    'He may be posthumously made Minister of Justice.',
    'Let him be posthumously made Minister of Justice.',
  ],
  s0034: [
    '" Hongji had no son; his father\'s younger brother\'s son Hongce made his third son Zuan heir—treated in a separate biography.',
    '" Hongji had no son; his cousin Hongce made his third son Zuan the heir—see the separate biography.',
  ],
  s0035: [
    'Empress Xi of Gaozu',
    'Empress Xi of Gaozu',
  ],
  s0036: [
    'Gaozu\'s Virtuous Empress, the Xi clan, taboo name Hui, was a native of Jinxiang in Gaoping.',
    'Gaozu\'s Virtuous Empress Xi, taboo name Hui, came from Jinxiang in Gaoping.',
  ],
  s0037: [
    'Her grandfather Shao was Sacrificer of the Imperial Academy and concurrently tutor to the Prince of Donghai.',
    'Her grandfather Shao was Sacrificer of the Imperial Academy and tutor to the Prince of Donghai.',
  ],
  s0038: [
    'Her father Ye was attendant to the crown prince and died early.',
    'Her father Ye was a crown prince attendant and died young.',
  ],
  s0039: [
    'At first, when the empress\'s mother the Princess of Xunyang was pregnant, she dreamed she would bear an honored child.',
    'Before the empress was born, her mother the Princess of Xunyang dreamed she would bear a child of rank.',
  ],
  s0040: [
    'When the empress was born, red light filled the chamber and every object gleamed; the family all marvelled.',
    'At her birth red light filled the room and every object shone bright; the household marveled.',
  ],
  s0041: [
    'A shaman said this girl\'s radiance was extraordinary and would bring harm; they performed purification rites by the waterside.',
    'A shaman said the girl\'s brilliance was abnormal and would bring harm, so they purified her by the water.',
  ],
  s0042: [
    'The empress from childhood was clever and bright, skilled at clerical script, and read histories and records.',
    'From childhood she was clever and bright, skilled at clerical script, and read histories.',
  ],
  s0043: [
    'Women\'s crafts—there was none she did not know intimately.',
    'Of women\'s crafts there was none she had not mastered.',
  ],
  s0044: [
    'Deposed Emperor of Later Song was about to take her as empress;',
    'The deposed emperor of Later Song meant to make her empress;',
  ],
  s0045: [
    'in early Qi Prince Mian of Anlu also wished to marry her: the Xi clan both declined on grounds of the daughter\'s illness, and it stopped.',
    'in early Qi Prince Mian of Anlu also sought her hand; the Xi clan pleaded illness both times, and the matches ended.',
  ],
  s0046: [
    'At the end of Jianyuan Gaozu first betrothed her.',
    'Near the end of Jianyuan Gaozu first took her as his wife.',
  ],
  s0047: [
    'She bore Princess Yuyao of Yongxing, Princess Yuwan of Yongshi, Princess Yuhuan of Yongkang.',
    'She bore Princess Yuyao of Yongxing, Princess Yuwan of Yongshi, and Princess Yuhuan of Yongkang.',
  ],
  s0048: [
    'The empress\'s father Ye was by edict posthumously made Glory Grand Master with purple insignia.',
    'The empress\'s father Ye was posthumously made Glory Grand Master with purple insignia by edict.',
  ],
  s0049: [
    'Ye had married Emperor Wen of Song\'s daughter the Princess of Xunyang; in early Qi he was demoted to Lady of Songzi county.',
    'Ye had married Emperor Wen of Song\'s daughter, the Princess of Xunyang; in early Qi he was reduced to Lady of Songzi county.',
  ],
  s0050: [
    'Ye\'s son Fan was secretary to Prince Linchuan of the Central Army.',
    'Ye\'s son Fan was secretary to the Central Army\'s Prince of Linchuan.',
  ],
  s0051: [
    'Empress Wang of Taizong',
    'Empress Wang of Taizong',
  ],
  s0052: [
    'Taizong\'s Honored Empress, the Wang clan, taboo name Lingbin, was a native of Linyi in Langye.',
    'Taizong\'s Honored Empress Wang, taboo name Lingbin, came from Linyi in Langye.',
  ],
  s0053: [
    'Her grandfather Jian was Grand Commandant and Duke of Nanchang, posthumous name Wenhian.',
    'Her grandfather Jian was Grand Commandant and Duke of Nanchang, posthumous name Wenhian.',
  ],
  s0054: [
    'Her father Qian, styled Siji, original name Xuancheng, shared a partial taboo with Qi Gaozu and therefore changed it.',
    'Her father Qian, styled Siji, was originally named Xuancheng; because the name clashed with Qi Gaozu\'s partial taboo, he changed it.',
  ],
  s0055: [
    'Entering office as son of a noble he was outer member, promoted attendant to wash horses of the heir, succeeded as Marquis of Nanchang county, went out as Administrator of Yixing.',
    'He entered office as a noble\'s son, became an outer member, then attendant for the heir\'s wash horses, succeeded as Marquis of Nanchang county, and went out as Administrator of Yixing.',
  ],
  s0056: [
    'Returning he became advisory officer to the Rapid Cavalry general, rising through posts to Gentlemen of the Yellow Gate and Right Chief Clerk of the Minister of Education.',
    'On return he advised the Rapid Cavalry general, then rose through Gentlemen of the Yellow Gate to Right Chief Clerk of the Minister of Education.',
  ],
  s0057: [
    'By nature he was reserved and simple, not familiar with the age.',
    'By nature he was austere and plain and kept aloof from his times.',
  ],
  s0058: [
    'Once at leisure he told his sons: "Our family\'s gate is what is called a plain clan; one may simply drift with the stream and advance evenly—there is no need to seek advancement recklessly."',
    'Once he told his sons at ease: "Our house is a plain clan; one may drift with the current and advance evenly—there is no need to scramble for rank."',
  ],
  s0059: [
    'At the end of Yongyuan he was moved to Palace Attendant but did not accept.',
    'At the end of Yongyuan he was offered Palace Attendant but refused the post.',
  ],
  s0060: [
    'When Gaozu established his hegemony office, Qian was summoned as advisory officer to the Grand Marshal, soon promoted Palace Attendant and concurrently Colonel of the Yue Cavalry.',
    'When Gaozu set up his hegemony office, Qian was called in as Grand Marshal adviser, soon made Palace Attendant and Colonel of the Yue Cavalry.',
  ],
  s0061: [
    'When Gaozu received the mandate, an edict said: "Jianting\'s generations of sacrifice never ceased in the Zhou of the clan; Yue Yi received lands and shone forth in great Han.',
    'When Gaozu took the throne, an edict said: "Jianting\'s line was never cut off in the Zhou royal house; Yue Yi received a fief and shone in great Han.',
  ],
  s0062: [
    'Qi\'s former Grand Commandant Duke of Nanchang bore his talent and trod the Way, in the wilds he raised Qi, his counsels bright and supportive, matching those of old.',
    'Qi\'s former Grand Commandant, Duke of Nanchang, bore talent and walked the Way, helped raise Qi from the wilds, and counseled with bright support like men of old.',
  ],
  s0063: [
    'Though Zifang stood eminent as emperor\'s teacher, Wenruo towered like king\'s helper—they cannot be surpassed.',
    'Though Zifang became the emperor\'s teacher and Wenruo rose as the king\'s right hand, none surpass him.',
  ],
  s0064: [
    'I have received the mandate and renewed the jade command; the multitudes of silk offerings rise and fall with fixed ritual.',
    'I have received the mandate and renewed the imperial charge; gifts of silk now rise and fall by fixed ritual.',
  ],
  s0065: [
    'Forever speaking of former ages, reverently thinking on his great glory—not only for meritorious toil, the meaning also embraces cherished trees.',
    'Speaking always of former times, I revere his great glory—not for merit alone, but also in gratitude, as one cherishes a tree.',
  ],
  s0066: [
    'Duke of Nanchang may be demoted to marquis, fief of one thousand households.',
    'Let Duke of Nanchang be reduced to marquis with a fief of one thousand households.',
  ],
  s0067: [
    '" Qian succeeded to the title, was moved to Minister of Revenue.',
    '" Qian inherited the title and was made Minister of Revenue.',
  ],
  s0068: [
    'In the fourth year of Tianjian he went out as Administrator of Dongyang, soon transferred to Wu commandery.',
    'In Tianjian year 4 he went out as Administrator of Dongyang, then was moved to Wu commandery.',
  ],
  s0069: [
    'In the eighth year he entered as Minister of the Palace Treasury, concurrently Rear Army General, then Minister of Ceremonies.',
    'In year 8 he entered as Minister of the Palace Treasury and Rear Army General, then became Minister of Ceremonies.',
  ],
  s0070: [
    'In the eleventh year he was moved to Palace Scribe, with added Outer Member of the Scattered Cavalry.',
    'In year 11 he became Palace Scribe with added outer membership in the Scattered Cavalry.',
  ],
  s0071: [
    'At the time Gaozu at Zhong Mountain built the Great Temple of Filial Reverence; Qian\'s old villa stood beside the temple, with more than eighty qing of good farmland—that very land the Jin chancellor Wang Dao had been granted.',
    'Gaozu was building the Great Temple of Filial Reverence on Zhong Mountain; Qian\'s old villa lay beside it, with more than eighty qing of fine fields—the very grant of Jin chancellor Wang Dao.',
  ],
  s0072: [
    'Gaozu sent a palace clerk with imperial words to Qian to seek to buy it, intending to give it to the temple.',
    'Gaozu sent a palace clerk with an imperial message to buy the land for the temple.',
  ],
  s0073: [
    'Qian answered the decree: "This land is not for sale;',
    'Qian answered: "This land is not for sale;',
  ],
  s0074: [
    'if it is taken by command, I dare say nothing."',
    'if Your Majesty takes it by command, I dare not object."',
  ],
  s0075: [
    'His replies were also curt and offhand.',
    'His replies were curt and careless besides.',
  ],
  s0076: [
    'Gaozu was angry, had the market assess the land price, and by direct seizure returned it.',
    'Gaozu grew angry, had the market price assessed, and seized the land outright in return.',
  ],
  s0077: [
    'For this he offended the will and was sent out as Administrator of Wuxing.',
    'For this he lost favor and was sent out as Administrator of Wuxing.',
  ],
  s0078: [
    'In the commandery he lay ill and did not attend to affairs.',
    'In the commandery he took to his bed and left affairs unattended.',
  ],
  s0079: [
    'Summoned back, again Minister of Revenue, with added Supervising Censor, concurrently Colonel of the Archer Sound.',
    'Recalled, he again became Minister of Revenue, with added Supervising Censor and Colonel of the Archer Sound.',
  ],
  s0080: [
    'He left office on mourning for his mother.',
    'He left office to mourn his mother.',
  ],
  s0081: [
    'In the tenth month of the third year of Putong he died, age forty-nine.',
    'In the tenth month of Putong year 3 he died at forty-nine.',
  ],
  s0082: [
    'Edict posthumously made him Palace Attendant and Glory Grand Master with purple insignia, posthumous name An.',
    'By edict he was posthumously made Palace Attendant and Glory Grand Master with purple insignia, posthumous name An.',
  ],
  s0083: [
    'His son Gui succeeded to the title—treated in a separate biography.',
    'His son Gui inherited the title—see the separate biography.',
  ],
  s0084: [
    'Noble Consort Ding of Gaozu',
    'Noble Consort Ding of Gaozu',
  ],
  s0085: [
    'Gaozu\'s Noble Consort Ding, taboo name Lingguang, was a native of Qiao state, her family for generations dwelling at Xiangyang.',
    'Gaozu\'s Noble Consort Ding, taboo name Lingguang, came from Qiao and had long lived at Xiangyang.',
  ],
  s0086: [
    'The Noble Consort was born at Fancheng; there was a divine-light marvel, purple mist filling the chamber, and so "Guang" was put in her name.',
    'She was born at Fancheng amid a marvel of divine light and purple mist filling the room, and so "Guang" was placed in her name.',
  ],
  s0087: [
    'A physiognomist said: "This girl will attain great honor."',
    'A physiognomist said, "This girl will rise to great honor."',
  ],
  s0088: [
    'When Gaozu was inspector of the province, the Ding clan had someone bring word.',
    'When Gaozu held the province, the Ding clan sent word through others.',
  ],
  s0089: [
    'The Noble Consort was then fourteen; Gaozu took her in.',
    'The Noble Consort was then fourteen, and Gaozu took her in.',
  ],
  s0090: [
    'At first the Noble Consort had been born with a red mole on her left arm; treatment could not remove it—now suddenly and for no reason it vanished.',
    'At birth she had a red mole on her left arm that medicine could not erase; now, without cause, it suddenly vanished.',
  ],
  s0091: [
    'In serving the Virtuous Empress she was careful and reverent; once beside the sutra case where offerings were made, it was as if she saw a spirit being, and her heart alone felt it strange.',
    'Serving the Virtuous Empress, she was careful and reverent; once beside the sutra offerings she seemed to see a spirit, and her heart alone was struck.',
  ],
  s0092: [
    'When Gaozu\'s righteous army rose, the Crown Prince Zhaoming was first born; the Noble Consort with the heir remained in the provincial city.',
    'When Gaozu\'s righteous army rose and Crown Prince Zhaoming was newly born, the Noble Consort stayed in the provincial city with the heir.',
  ],
  s0093: [
    'When the capital region was pacified, she returned to the capital.',
    'When the capital was pacified, she returned to the capital.',
  ],
  s0094: [
    'In the fifth month of the first year of Tianjian the relevant office memorialized to make her Honored Person—not yet invested;',
    'In the fifth month of Tianjian year 1 the relevant office memorialized to make her Honored Person, but the investiture had not yet been performed;',
  ],
  s0095: [
    'that same year in the eighth month she became Noble Consort, rank above the Three Consorts, dwelling in Xianyang Palace.',
    'that same year in the eighth month she became Noble Consort, ranking above the Three Consorts and dwelling in Xianyang Palace.',
  ],
  s0096: [
    'When the crown prince\'s position was fixed, the relevant office memorialized:',
    'When the crown prince\'s place was settled, the relevant office memorialized:',
  ],
  s0097: [
    'Ritual: the mother is honored through the son.',
    'Ritual says the mother is honored through the son.',
  ],
  s0098: [
    'He who bore the royal heir—one cannot fail to show him respect.',
    'The mother of the royal heir cannot go without respect.',
  ],
  s0099: [
    'In the sixth month of the first year of Taiyu of Song, it was debated whether all officials should with clerkly respect honor the Mother of the Emperor Chen, the Honored Consort—yet when Emperor Ming of Song was alive, officials had shown no such respect.',
    'In the sixth month of Song\'s Taiyu year 1, officials debated showing clerkly respect to Emperor Chen\'s mother, the Honored Consort—yet while Emperor Ming of Song lived, no official had shown such respect.',
  ],
  s0100: [
    'Your servant ventures that "the mother is honored through the son"—the meaning is set forth in the Spring and Autumn Annals.',
    'Your servant holds that "the mother is honored through the son" is a principle set forth in the Spring and Autumn Annals.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_007_b1.mjs <translation.json>'
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
