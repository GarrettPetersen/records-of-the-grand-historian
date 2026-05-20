#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'In the ninth year of Kaihuang, after the conquest of Chen, the court acquired the old music of Song and Qi; an edict ordered the establishment of a Qing Shang Office under the Director of Ceremonies to administer it.',
    'In Kaihuang 9, after Chen fell, Song and Qi court music was seized and a Qing Shang Office was set up under the Grand Music Master.',
  ],
  s0002: [
    'Chen\'s former Director of Music Cai Ziyuan, Yu Puming, and others were sought out and restored to their posts.',
    'Cai Ziyuan, Yu Puming, and other former Chen music officials were found and reappointed.',
  ],
  s0003: [
    'Thereupon Niu Hong memorialized, saying:',
    'Niu Hong then submitted a memorial:',
  ],
  s0004: [
    'Your subject has heard that Zhou possessed the music of six dynasties, extending only as far as the Shao and the Wu.',
    'I have heard that Zhou kept the music of six ages, down only to the Shao and the Wu.',
  ],
  s0005: [
    'The First Emperor of Qin changed the Zhou dance to the Five Elements; Emperor Gaozu of Han changed the Shao Dance to the Wen Shi, to show that one did not simply inherit the previous dynasty.',
    'Qin Shihuang renamed the Zhou dance Five Elements; Han Gaozu renamed the Shao Dance Wen Shi—to mark a break with the past.',
  ],
  s0006: [
    'He also created the Martial Virtue, proclaiming his own achievements; hence at Gaozu\'s temple the dances Martial Virtue, Wen Shi, and Five Elements were performed.',
    'He also composed Martial Virtue to celebrate his own deeds, so Gaozu\'s temple used the Martial Virtue, Wen Shi, and Five Elements dances.',
  ],
  s0007: [
    'He further composed Bright Countenance and Ritual Countenance, expanding and elaborating their meaning.',
    'He also added Bright Countenance and Ritual Countenance, developing their themes further.',
  ],
  s0008: [
    'Bright Countenance arose from Martial Virtue—it was essentially the ancient Shao.',
    'Bright Countenance grew out of Martial Virtue and was in effect the old Shao.',
  ],
  s0009: [
    'Ritual Countenance arose from Wen Shi, correcting Qin\'s Five Elements.',
    'Ritual Countenance grew out of Wen Shi, correcting Qin\'s Five Elements dance.',
  ],
  s0010: [
    'Emperor Wen also composed the Four Seasons dance; thus when Emperor Xiaojing acceded, tracing the achievements of his predecessors, he took the Martial Virtue Dance to make the Bright Virtue Dance, set it to strings and pipes, and offered it at the temple of the Founding Emperor.',
    'Emperor Wen added a Four Seasons dance; Xiaojing later drew on Martial Virtue to create Bright Virtue, scored it for orchestra, and presented it at the Founding Emperor\'s temple.',
  ],
  s0011: [
    'Emperor Xiaoxuan took the Bright Virtue Dance and made it the Flourishing Virtue Dance, composing new songs and offering them at Emperor Wu\'s temple.',
    'Xiaoxuan reworked Bright Virtue into Flourishing Virtue with new lyrics for Emperor Wu\'s temple.',
  ],
  s0012: [
    'Judging from this, each generation inherited the last; even when new works were made, all traced back to the Shao.',
    'On this evidence, titles changed but the line always led back to the Shao.',
  ],
  s0013: [
    'By the time of Emperor Ming, the Prince of Dongping took the Cultured Virtue Dance and made it the Great Martial dance, offering it at Emperor Guangwu\'s temple.',
    'Under Ming, the Prince of Dongping turned Cultured Virtue into the Great Martial dance for Guangwu\'s temple.',
  ],
  s0014: [
    'At the end of Han came great disorder and the ritual scores were lost; when Wei Wu conquered Jing province he obtained Du Kui, made him Army Planning Libationer, and had him create court ritual music.',
    'Han collapsed into chaos and the scores vanished; Cao Cao captured Du Kui in Jingzhou, made him Army Planning Libationer, and charged him with restoring court music.',
  ],
  s0015: [
    'At the time, Palace Attendant Deng Jing was skilled at singing ritual songs; music master Yin Hu knew the ancestral-sacrifice pieces; dance master Feng Su understood the dances of earlier ages.',
    'Deng Jing could sing the ritual songs, Yin Hu knew the sacrificial repertoire, and Feng Su knew the old dances.',
  ],
  s0016: [
    'Gathering their training and refining it with care, they restored the ancient music—beginning with Kui.',
    'Pooling their expertise, they restored ancient music—starting with Kui.',
  ],
  s0017: [
    'In the Huangchu era of Emperor Wen, the music Bright Countenance was changed to Bright Achievement Music; the Martial Virtue dance to Martial Hymn Dance; the Wen Shi dance to Great Shao Dance; and the Five Elements dance to Great Martial Dance.',
    'In Wen\'s Huangchu reign, Bright Countenance became Bright Achievement, Martial Virtue became Martial Hymn, Wen Shi became Great Shao, and Five Elements became Great Martial.',
  ],
  s0018: [
    'At the beginning of Emperor Ming\'s reign, the high officials submitted that the music of Grand Ancestor Emperor Wu should be the Martial Beginning dance, and that of High Ancestor Emperor Wen the Xianxi dance.',
    'Early in Ming\'s reign, officials proposed Martial Beginning for Cao Cao and Xianxi for Cao Pi.',
  ],
  s0019: [
    'He also regulated a music-dance called the Zhang Bin dance, used together for rites to Heaven and Earth and the ancestral temples, and for grand feasts at court audiences.',
    'He also instituted the Zhang Bin dance for Heaven-and-Earth and temple rites and for great court banquets.',
  ],
  s0020: [
    'In the second year of Taishi under Emperor Wu of Jin, Fu Xuan and others were dispatched to compose songs for processional rites, longevity toasts, and banquet music.',
    'In Jin Taishi 2, Fu Xuan and others were sent to write processional, longevity, and banquet songs.',
  ],
  s0021: [
    'Zhang Hua memorialized: "Examining what Han and Wei used, although the texts of the poems differ and pieces rose and fell with the times, their cadences and turns all depend on the old models—every one was inherited, and none dared to be altered."',
    'Zhang Hua wrote: "Han and Wei pieces differ in wording and came and went with the times, but their phrasing and turns all followed old models—nothing was boldly changed."',
  ],
  s0022: [
    '"In the ninth year, Xun Xu oversaw music and had Guo Xia and Song Shi create the Correct Virtue and Great Yu dances."',
    'In year 9, Xun Xu had Guo Xia and Song Shi compose Correct Virtue and Great Yu.',
  ],
  s0023: [
    'The Wei Bright Martial Dance was changed to the Propagating Martial Dance, and the feather-and-flute dance to the Propagating Culture Dance.',
    'Wei\'s Bright Martial became Propagating Martial, and the feather-flute dance became Propagating Culture.',
  ],
  s0024: [
    'At the beginning of the Eastern Jin, statutes were buried in disorder; when He Xun became Director of Ceremonies, there were at last songs for the ascent hymn.',
    'Early Eastern Jin law was in disarray; under He Xun as Grand Music Master, ascent hymns finally appeared.',
  ],
  s0025: [
    'At the end of the Daning era, Ruan Fu and others added to them further.',
    'Late in Daning, Ruan Fu and others expanded the repertoire.',
  ],
  s0026: [
    'During the Xianhe period, scattered survivors were gathered; after Ye fell to the barbarians, many musicians crossed south again, and Eastern Jin thereby acquired bells and pitch pipes.',
    'In Xianhe, refugees were collected; after Ye fell, musicians fled south and Eastern Jin finally had bells and pipes.',
  ],
  s0027: [
    'During the Taiyuan period, after the defeat of Fu Yonggu, the musicians Yang Shu and others were also captured; versed in the old music, they at last completed the full ensemble of metal and stone.',
    'In Taiyuan, after Fu Yonggu was beaten, musicians like Yang Shu restored the old repertoire and metal-and-stone instruments were complete.',
  ],
  s0028: [
    'Examining their suspended-instrument pitch systems, they were the same as those of the Eastern Jin.',
    'Their pitch arrangements matched those of the Eastern Jin.',
  ],
  s0029: [
    'Murong Chui defeated Murong Yong at Changzi and seized all the old music of the Fu clan.',
    'Murong Chui beat Murong Yong at Changzi and took the Fu dynasty\'s entire musical legacy.',
  ],
  s0030: [
    'When Chui\'s son Xi was defeated by Wei, the bell-and-pitch director Li Fo and others took the finest performers of the Grand Music Office and fled to Murong De at Ye.',
    'After Chui\'s son Xi lost to Wei, pitch-master Li Fo fled to Murong De at Ye with the Grand Music performers.',
  ],
  s0031: [
    'De moved the capital to Guanggu; when his son Chao succeeded, Chao\'s mother had earlier been captured by Yao Xing, and Chao sent one hundred twenty Grand Music performers to Xing to ransom her.',
    'De moved to Guanggu; when Chao succeeded, he sent 120 musicians to Yao Xing to ransom his captive mother.',
  ],
  s0032: [
    'When Emperor Wu of Song entered the passes, all who had fled south were collected.',
    'When Liu Yu entered the passes, every southern refugee musician was gathered in.',
  ],
  s0033: [
    'In the first year of Yongchu, the Correct Virtue Dance was renamed the Front Dance, and the Great Martial Dance the Rear Dance.',
    'In Yongchu 1, Correct Virtue became the Front Dance and Great Martial the Rear Dance.',
  ],
  s0034: [
    'In the ninth year of Yuanjia under Emperor Wen, the Director of Music Zhong Zongzhi retuned the bells and stones.',
    'In Wen\'s Yuanjia 9, Music Director Zhong Zongzhi retuned bells and stones.',
  ],
  s0035: [
    'By the fourteenth year, the Director of Documents Xi Zong revised and fixed them again.',
    'By year 14, Documents Director Xi Zong had revised them again.',
  ],
  s0036: [
    'There were also the Triumphal Countenance and Propagating Achievement dances, which Qi continued to use.',
    'Qi also kept the Triumphal Countenance and Propagating Achievement dances.',
  ],
  s0037: [
    'Xiao Zixian\'s "Treatise" in the Book of Qi says: "At the beginning of Xiaojian in Song, court discussion took the Triumphal Countenance Dance as the Shao Dance and the Propagating Achievement Dance as the Martial Virtue Dance."',
    'Xiao Zixian\'s Qi Treatise notes that in Song\'s Xiaojian era, court debate equated Triumphal Countenance with Shao and Propagating Achievement with Martial Virtue.',
  ],
  s0038: [
    'Speaking in terms of the Shao, Propagating Achievement is the ancient Great Martial—not Martial Virtue.',
    'By Shao standards, Propagating Achievement is the old Great Martial, not Martial Virtue.',
  ],
  s0039: [
    '"Hence the Treatise contains the lyrics for the Front-Dance Triumphal Countenance and the Rear-Dance Triumphal Countenance."',
    'Hence the Treatise preserves lyrics for Front and Rear Triumphal Countenance.',
  ],
  s0040: [
    'In the early Liang they still used the Triumphal Countenance and Propagating Achievement dances; later these were changed to Great Strength and Great Vision.',
    'Early Liang kept Triumphal Countenance and Propagating Achievement; later they became Great Strength and Great Vision.',
  ],
  s0041: [
    'People today still call Great Vision the Front Dance; thus although music names change with each dynasty, the turns of sound and tone ought to remain the same.',
    'Great Vision is still called the Front Dance today—titles change by dynasty, but the melodic turns should stay the same.',
  ],
  s0042: [
    'Earlier, when Jing province was taken, the elegant pieces of the Liang house were obtained; now, with the pacification of Jiang province, the orthodox music of the Chen house has also been acquired.',
    'We already took Liang\'s elegant repertoire with Jingzhou; pacifying Jiangzhou has now brought Chen\'s orthodox music as well.',
  ],
  s0043: [
    'Historical tradition hands this down as matching antiquity.',
    'Historians treat this succession as genuinely ancient.',
  ],
  s0044: [
    'Moreover, examining the structure of the pieces, the use of tones is ordered; please edit and compile them to complete the court ritual repertoire.',
    'Their forms are ordered and their tones sequenced—please edit them into proper court ritual music.',
  ],
  s0045: [
    'As for the later Wei music of Luoyang, the Wei History says only that it was "obtained when Emperor Taiwu conquered Helian Chang"—there is no further clear evidence.',
    'Later Wei Luoyang pieces are attested only by the Wei History\'s note on Taiwu\'s capture of Helian Chang—nothing more.',
  ],
  s0046: [
    'What Later Zhou used was all newly made, mixed with sounds from the frontier regions.',
    'Later Zhou used newly composed music laced with frontier sounds.',
  ],
  s0047: [
    'Barbarian tones disorder Chinese music—none may be used.',
    'Barbarian tones corrupt Chinese music and must not be used.',
  ],
  s0048: [
    'Please stop them all.',
    'Please suspend all of them.',
  ],
  s0049: [
    'The edict said: "Regulating rites and making music are the affairs of sages; only when achievement is complete and transformation fully harmonized may one discuss them."',
    'The edict replied: "Rites and music belong to sages—only after triumph and full civil harmony may they be reworked."',
  ],
  s0050: [
    'Now the realm has only just been pacified and proper transformation is not yet complete.',
    'The realm is barely pacified and proper civilization not yet settled.',
  ],
  s0051: [
    'To rush into change—I have no leisure for that.',
    'I have no time for sudden change.',
  ],
  s0052: [
    'Prince of Jin Yang Guang again memorialized requesting permission, and the Emperor then assented.',
    'Prince Yang Guang petitioned again, and the Emperor agreed.',
  ],
  s0053: [
    'Niu Hong then, following Zheng Yi\'s earlier work, also requested that the ancient five tones and six pitch-pipes be used, cyclically modulating as palace keys.',
    'Niu Hong, building on Zheng Yi, also asked to restore cyclical palace modulation from the five tones and six pitch-pipes.',
  ],
  s0054: [
    'In court ritual music each palace key had only one mode; only for welcoming the qi were five modes played—these were called the five tones.',
    'Court music used one mode per palace key; only qi-welcoming rites used five modes—the five tones.',
  ],
  s0055: [
    'Slow music used seven modes and was employed in sacrifices.',
    'Slow ceremonial music used seven modes for sacrifice.',
  ],
  s0056: [
    'Each was ordered according to the rank of pitch and tone.',
    'Each was ranked by pitch hierarchy.',
  ],
  s0057: [
    'Gaozu still remembered Tuo\'s words; he annotated Niu Hong\'s memorial and rejected cyclical-palace music, allowing only a single Yellow Bell palace key.',
    'Gaozu heeded Tuo\'s advice, annotated Niu Hong\'s memorial, and forbade cyclical modulation—only Yellow Bell palace would do.',
  ],
  s0058: [
    'Thereupon Niu Hong, Secretariat Aide Yao Cha, Palace Attendant Xu Shanxin, Commissioner Equal to the Three Dukes Liu Zhen, and Secretariat Gentleman Yu Shiji and others jointly deliberated further, saying:',
    'Niu Hong, Yao Cha, Xu Shanxin, Liu Zhen, Yu Shiji, and others then deliberated jointly:',
  ],
  s0059: [
    'In Later Zhou, four tones were used to summon the spirits; although this drew on the Rites of Zhou, the age was remote and the method long extinct—it cannot be followed.',
    'Later Zhou\'s four-tone spirit-summoning rite cited the Rites of Zhou, but the method was long dead and unusable.',
  ],
  s0060: [
    'We respectfully examine the Director of Music: "For all music: with Round Bell as palace, Yellow Bell as horn, Great Cluster as bell-note, and Maiden Wash as feather, perform the Cloud Gate dance to sacrifice to Heaven."',
    'The Director of Music states: "For Heaven: Round Bell palace, Yellow Bell horn, Great Cluster bell-note, Maiden Wash feather—dance Cloud Gate."',
  ],
  s0061: [
    'With Enclosing Bell as palace, Great Cluster as horn, Maiden Wash as bell-note, and Southern Pitch as feather, perform the Xian Chi dance to sacrifice to Earth.',
    'For Earth: Enclosing Bell palace, Great Cluster horn, Maiden Wash bell-note, Southern Pitch feather—dance Xian Chi.',
  ],
  s0062: [
    'With Yellow Bell as palace, Great Pitch as horn, Great Cluster as bell-note, and Round Bell as feather, perform the Great Martial dance to sacrifice at the ancestral temple.',
    'For the ancestral temple: Yellow Bell palace, Great Pitch horn, Great Cluster bell-note, Round Bell feather—dance Great Martial.',
  ],
  s0063: [
    'Ma Rong said: "Round Bell is Responding Bell."',
    'Ma Rong identified Round Bell with Responding Bell.',
  ],
  s0064: [
    'Jia Kui and Zheng Xuan said: "Round Bell is Pinched Bell."',
    'Jia Kui and Zheng Xuan took Round Bell to mean Pinched Bell.',
  ],
  s0065: [
    'Zheng Xuan also said: "This music has no commercial tone; sacrifice honors soft and hard, hence it is not used."',
    'Zheng Xuan added that this music omits the commercial tone because sacrifice balances firmness and yielding.',
  ],
  s0066: [
    'Gan Bao said: "Commercial is not mentioned because commercial is the minister."',
    'Gan Bao said commercial is unnamed because it represents the minister.',
  ],
  s0067: [
    'The king speaks for himself, so he keeps the substance and removes the name—as if to say there are Heaven, Earth, and the people, yet no virtue to rule them; humility in self-governance.',
    'The king keeps the substance but drops the name—humility before Heaven, Earth, and the people.',
  ],
  s0068: [
    'The explanations of earlier scholars leave one with no clear guide.',
    'Earlier commentators disagree, leaving no clear authority.',
  ],
  s0069: [
    'Yet these four tones not only lack commercial outright—the pitch pipes are out of sequence; used as music, they cannot achieve harmony.',
    'These four tones lack commercial and mis-order the pipes—they cannot harmonize as music.',
  ],
  s0070: [
    'Ancient and modern circumstances differ; this cannot be put into practice.',
    'Times have changed; the scheme cannot be enacted.',
  ],
  s0071: [
    'According to the Biography of Ma Fang in the Eastern View Annals, Palace Aide Bao Ye and others submitted a proposal on making music, which was sent down to Fang.',
    'The Eastern View Annals record that Bao Ye and others submitted a music proposal to Ma Fang.',
  ],
  s0072: [
    'Fang memorialized: "In the seventh month of the second year of Jianchu, Ye reported that the Son of Heaven\'s food and drink must follow the four seasons and five flavors, and that there is music for raising the dishes."',
    'Fang wrote: "In Jianchu 2, month 7, Ye reported that royal meals follow season and flavor and require dish-raising music."',
  ],
  s0073: [
    'This is to accord with Heaven and Earth, nourish the spirits, and seek responsive blessing.',
    'Such music aligns Heaven and Earth, nourishes the spirits, and seeks blessing.',
  ],
  s0074: [
    'Now official court music has only Yellow Bell, while dish-raising music has only Great Cluster—neither matches the monthly pitch pipes, and qi may be harmed.',
    'Court music uses only Yellow Bell and dish music only Great Cluster—neither follows monthly pipes and may disturb the qi.',
  ],
  s0075: [
    'Twelve monthly modes may be made, each matching its month\'s qi.',
    'Twelve monthly modes could match each month\'s qi.',
  ],
  s0076: [
    'When the high officials assemble at court and hear the monthly pitch pipes, they can move Heaven and harmonious qi should respond.',
    'If officials heard the monthly pipes at court, Heaven would be moved and harmonious qi would answer.',
  ],
  s0077: [
    'An edict was sent down to the Director of Ceremonies for evaluation.',
    'The matter was referred to the Grand Music Master.',
  ],
  s0078: [
    'The Director of Ceremonies reported that making the instruments would cost 1,460,000 cash; the memorial was shelved.',
    'The Grand Music Master priced instruments at 1,460,000 cash; the proposal died.',
  ],
  s0079: [
    'Now a clear edict has come down again; your subject Fang believes one may await Heaven\'s bright season, take advantage of the auspicious month at the year\'s start, sound the Great Cluster pitch pipe, and perform the elegant and hymn texts to welcome harmonious qi.',
    'Fang now urged using the year\'s first auspicious month to sound Great Cluster and perform elegant hymns to welcome harmonious qi.',
  ],
  s0080: [
    '"The provisions were very detailed, and this alone was put into practice."',
    'The plan was detailed and this measure alone was adopted.',
  ],
  s0081: [
    'Beginning in the tenth month, it became the music for welcoming the qi.',
    'From the tenth month onward it served as qi-welcoming music.',
  ],
  s0082: [
    'The Annals of Emperor Shun also say: "In the tenth month of the second year of Yangjia, winter, day gengwu, the spring-and-autumn sacrifice became the Bright Enclosure, subordinate to the Imperial Academy, following the monthly pitch pipes."',
    'Emperor Shun\'s annals note that in Yangjia 2, month 10, gengwu, the Bright Enclosure rite followed monthly pipes under the Imperial Academy.',
  ],
  s0083: [
    'In the tenth month Responding Bell was made; in the third month Maiden Wash.',
    'Responding Bell was tuned in month 10; Maiden Wash in month 3.',
  ],
  s0084: [
    'Since the Yuanhe era, pitches had been discordant; Yellow Bell was restored and instruments made according to the old canon.',
    'Since Yuanhe pitches had drifted; Yellow Bell was restored and instruments rebuilt to the old standard.',
  ],
  s0085: [
    'Judging from this, Han music\'s suspended ensemble had a Yellow Bell mode and dish-raising a Great Cluster mode—only these two modes, not cyclical palace modulation, is likewise clear.',
    'Han court music had only Yellow Bell and Great Cluster modes—two modes, not cyclical modulation.',
  ],
  s0086: [
    'From Yuanhe to the second year of Yangjia was only fifty years—used and then stopped again.',
    'From Yuanhe to Yangjia 2 was only fifty years—adopted, then abandoned.',
  ],
  s0087: [
    'Verify that the Yellow Emperor listened to the phoenix to set the pitch pipes and tones; the Book of Documents says "I wish to hear the six pitch pipes and five tones"; the Rites of Zhou have "assign music and sacrifice."',
    'The Yellow Emperor heard the phoenix to fix pipes and tones; the Documents say "I wish to hear six pipes and five tones"; the Rites of Zhou assign music to sacrifice.',
  ],
  s0088: [
    'These are creations of sages, made to match the harmony of Heaven and Earth, yin and yang—the natural principle; to say pitches were discordant is gross slander.',
    'Sages fashioned music to match cosmic harmony—calling the pipes "discordant" is slander.',
  ],
  s0089: [
    'Now the elegant pieces of Liang and Chen all use the palace tone.',
    'Liang and Chen elegant pieces all use palace tone.',
  ],
  s0090: [
    'According to the Rites: "The five tones and twelve pitch pipes cyclically serve as palace keys."',
    'The Rites say: "Five tones and twelve pipes cyclically form palace keys."',
  ],
  s0091: [
    'Lu Zhi said: "Through the twelve months three pipes rotate in office; whichever is in office serves as palace."',
    'Lu Zhi explained that whichever monthly pipe is "in office" becomes palace.',
  ],
  s0092: [
    'Palace means ruler.',
    'Palace means "ruler."',
  ],
  s0093: [
    'Zheng Xuan said: "The five tones are palace, commercial, horn, bell-note, and feather."',
    'Zheng Xuan named the five tones: palace, commercial, horn, bell-note, and feather.',
  ],
  s0094: [
    'The yang pipes are pitch pipes; the yin pipes are pitch tubes.',
    'Yang pipes are pitch pipes; yin pipes are pitch tubes.',
  ],
  s0095: [
    'Spread across the twelve branches, each in turn serves as palace, beginning with Yellow Bell and ending with Southern Pitch—sixty in all.',
    'Twelve branches rotate as palace from Yellow Bell to Southern Pitch—sixty combinations in all.',
  ],
  s0096: [
    'Huang Kan\'s commentary: "Cyclically serving as palace means: in the eleventh month Yellow Bell is palace, in the twelfth month Great Pitch is palace, in the first month Great Cluster is palace."',
    'Huang Kan glossed cyclical palace: month 11 Yellow Bell, month 12 Great Pitch, month 1 Great Cluster.',
  ],
  s0097: [
    'The remaining months follow this pattern.',
    'Other months follow the same rule.',
  ],
  s0098: [
    'All twelve pipes each possess the five tones, totaling sixty tones.',
    'Twelve pipes each carry five tones—sixty tones total.',
  ],
  s0099: [
    'Five tones form one mode; hence twelve modes.',
    'Five tones make one mode, hence twelve modes.',
  ],
  s0100: [
    '"This is the explicit text explaining Zheng\'s meaning; there is no method of using commercial, horn, bell-note, and feather as separate modes."',
    'This explicitly explains Zheng\'s view—commercial, horn, bell-note, and feather are not separate modes.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_suishu_015_b01.mjs <translation.json>'
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
let patched = 0;

for (const s of data.sentences) {
  const pair = T[s.id];
  if (!pair) continue;
  s.literal = pair[0];
  s.idiomatic = pair[1];
  patched++;
}

const missing = data.sentences.filter((s) => !s.literal || !s.idiomatic);
if (missing.length) {
  console.error(`Missing: ${missing.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Patched ${patched} sentences`);
