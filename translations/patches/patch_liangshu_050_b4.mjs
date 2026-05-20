#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0301: [
    'As for Cao Pi\'s "Classic" discourse, Chen Si\'s "Letter" preface, Ying Chang\'s Literary Discourse, Lu Ji\'s Literary Fu, Wang Zhongxuan\'s Genre Differentiation, Liu Hongfan\'s Forest of Letters—each illuminates a corner, rarely seeing the thoroughfare.',
    'Cao Pi\'s Classic, Cao Zhi\'s Letter, Ying Chang, Lu Ji, Wang Zhongxuan, Liu Hongfan—each sees a corner, rarely the road.',
  ],
  s0302: [
    'Some praise or blame the talent of the time, some weigh the writings of earlier masters, some broadly cite elegant and vulgar aims, some gather the meaning of titles and chapters.',
    'Some judge present talent, some earlier writings, some taste, some chapter themes.',
  ],
  s0303: [
    'Wei\'s Classic is dense but not complete; Chen\'s Letter is clever but not sound; Ying\'s Discourse is florid but loose; Lu\'s Fu is artful but fragmented; Genre Differentiation is fine but slight in achievement; Forest of Letters is shallow and short on essentials.',
    'Wei\'s Classic is dense but incomplete; Chen\'s Letter clever but unsound; Ying loose; Lu fragmented; Genre Differentiation fine but slight; Forest shallow.',
  ],
  s0304: [
    'Again Junshan, Gonggan, and company, Jifu, Shilong, and the like—floating discussion of literary intent often appears piecemeal, yet none could shake the leaf to seek the root or watch the billows to find the source.',
    'Junshan, Gonggan, Jifu, Shilong discuss in pieces but none sought root from leaf or source from billows.',
  ],
  s0305: [
    'They do not transmit the prior sages\' instructions; they do not aid later students\' thought.',
    'They do not transmit sages\' instructions or aid later students.',
  ],
  s0306: [
    'The making of Literary Mind roots in the Way, takes the sage as teacher, takes the classics as body, draws on the weft-texts, transforms with the "Li Sao"—the pivot of writing is thereby extreme.',
    'Literary Mind roots in the Way, sages, classics, weft-texts, and Li Sao—the pivot of writing.',
  ],
  s0307: [
    'As for discussing writing and narrating the brush, then delimiting and distinguishing, showing origin to display end, explaining names to clarify meaning, selecting texts to fix chapters, spreading principle to raise systems—',
    'It delimits writing, shows origin and end, names and meaning, texts and chapters, principle and systems—',
  ],
  s0308: [
    'in the upper chapters above, the outline is clear.',
    'the upper chapters\' outline is clear.',
  ],
  s0309: [
    'As for cutting emotion and analyzing expression, encircling principles, grasping spirit and nature, mapping wind and force, embracing convergence, surveying sound and character, exalting in "Seasonal Order," praising and blaming in "Talent Summary," sorrow in "Knowing Sound," integrity in "Style Vessel," long holding "Preface Intent" to drive the host of chapters—',
    'It cuts emotion, maps wind, surveys sound, exalts Seasonal Order, Talent Summary, Knowing Sound, Style Vessel, and Preface Intent—',
  ],
  s0310: [
    'in the lower chapters below, the categories are manifest.',
    'the lower chapters\' categories are manifest.',
  ],
  s0311: [
    'Positioning principle and fixing names shine in the numbers of the Great Change; as use for writing, forty-nine chapters only.',
    'Principle and names shine in Change numbers; forty-nine chapters serve writing.',
  ],
  s0312: [
    'To weigh and narrate one text is easy; to bind the host of sayings is hard.',
    'One text is easy; binding all sayings is hard.',
  ],
  s0313: [
    'Though one plucks the hair lightly and probes the marrow deeply, some bend meaning in hidden sources, seeming near yet far—what the words do not carry cannot be numbered either.',
    'Though probing deep, hidden sources seem near yet far—much is left unsaid.',
  ],
  s0314: [
    'When judging finished writing, some match old talk—not from mere sameness but because momentum cannot differ;',
    'Some judgments match old talk—not sameness but necessity;',
  ],
  s0315: [
    'some differ from prior discourse—not from rash difference but because principle cannot be the same.',
    'some differ—not rashness but different principle.',
  ],
  s0316: [
    'Sameness and difference pay no heed to ancient and modern; splitting muscle and dividing principle, one only seeks the mean.',
    'Sameness and difference ignore age; one seeks the mean.',
  ],
  s0317: [
    'Holding the reins in the field of elegant letters and encircling the palace of ornament—one is almost complete.',
    'One almost completes the field of letters and ornament.',
  ],
  s0318: [
    'But words do not exhaust meaning—the sage\'s difficulty; knowing is in the bottle tube—how can one square the compass?',
    'Words do not exhaust meaning; knowing is narrow—how square the compass?',
  ],
  s0319: [
    'Vast past ages have already washed my hearing;',
    'Past ages have washed my hearing;',
  ],
  s0320: [
    'dim coming ages perhaps dust that view.',
    'coming ages may dust that view.',
  ],
  s0321: [
    'When finished, it was not praised by the currents of the time.',
    'Finished, it was not praised by the age.',
  ],
  s0322: [
    'Xie himself prized his text and wished to fix it with Shen Yue.',
    'Xie prized his text and sought Shen Yue\'s judgment.',
  ],
  s0323: [
    'Yue was then noble and flourishing; there was no way to reach him, so he carried his book and waited for Yue to go out, accosting him before the carriage as if selling goods.',
    'Unable to reach noble Shen Yue, he waited at his carriage like a peddler.',
  ],
  s0324: [
    'Yue at once ordered it taken and read, greatly valued it, said it deeply attained literary principle, and often set it on his desk.',
    'Yue read it, prized it, said it mastered principle, and kept it on his desk.',
  ],
  s0325: [
    'Yet Xie\'s writing excelled in Buddhist principle; capital temple towers and famous monks\' steles and records always asked Xie to compose the text.',
    'He excelled in Buddhist writing; temples and steles sought his texts.',
  ],
  s0326: [
    'An edict had him with the monk Huizhen at Dinglin compile sutra testimony; when the work was done he memorialized to leave the household, first burning his temple hair in vow; the edict permitted it.',
    'Ordered to compile sutras with Huizhen, he then vowed to tonsure; the throne permitted it.',
  ],
  s0327: [
    'Thereupon at the temple he changed robes and took the name Huidi.',
    'He changed robes at the temple and took the name Huidi.',
  ],
  s0328: [
    'Before a year he died.',
    'Within a year he died.',
  ],
  s0329: [
    'His collected works circulated in the world.',
    'His works circulated.',
  ],
  s0330: [
    'Wang Ji, styled Wenhai, was a man of Linyi in Langye.',
    'Wang Ji, styled Wenhai, was from Linyi in Langye.',
  ],
  s0331: [
    'Grandfather Yuan was Song Director of the Imperial Clan.',
    'Grandfather Yuan was Song director of the imperial clan.',
  ],
  s0332: [
    'Father Sengyou was Qi Rapid Cavalry General.',
    'Father Sengyou was Qi rapid cavalry general.',
  ],
  s0333: [
    'Ji at seven could compose.',
    'At seven Ji could compose.',
  ],
  s0334: [
    'Grown, he loved learning and broad study, had talent and spirit; Le\'an Ren Fang saw him and praised him.',
    'Grown, he studied widely; Ren Fang praised him.',
  ],
  s0335: [
    'Once at Shen Yue\'s seat he was assigned to compose "On the Candle" and Yue greatly prized it.',
    'At Shen Yue\'s he composed On the Candle and won praise.',
  ],
  s0336: [
    'At the end of Qi he was Champion acting aide, rising repeatedly to external affairs and staff secretary.',
    'Late Qi he was champion aide, then external affairs and staff secretary.',
  ],
  s0337: [
    'Early Tianjian he was made Prince of Ancheng chief clerk, Secretariat third-rank gentleman, and Court Reviewer.',
    'Early Tianjian he was Ancheng chief clerk, secretariat gentleman, and court reviewer.',
  ],
  s0338: [
    'He served as magistrate of Yuyao and Qiantang, both dismissed for license.',
    'He governed Yuyao and Qiantang, both dismissed for license.',
  ],
  s0339: [
    'After long time he was made Light Chariot Prince Xiangdong consulting colonel and followed the princedom to Kuaiji.',
    'Later he was Xiangdong consulting colonel in Kuaiji.',
  ],
  s0340: [
    'Within the commandery were Cloud Gate and Tianzhu mountains; Ji often toured them, sometimes not returning for months.',
    'He often toured Cloud Gate and Tianzhu for months.',
  ],
  s0341: [
    'At Ruoye Creek composing poetry, the gist said: "Cicadas cry—the grove is stiller; birds call—the mountain more secluded."',
    'At Ruoye Creek: "Cicadas cry—the grove stiller; birds call—the mountain more secluded."',
  ],
  s0342: [
    'The age took it as uniquely beyond the text.',
    'The age called it beyond the text.',
  ],
  s0343: [
    'Returning he was Grand Marshal attendant gentleman, promoted to Palace Regular Grandee; especially frustrated, he then walked the market lanes on foot, not choosing company.',
    'Returning frustrated, he walked markets without choosing company.',
  ],
  s0344: [
    'Prince Xiangdong was in Jingzhou and summoned him as Anxi consulting colonel, concurrently magistrate of Zuotang.',
    'Xiangdong in Jingzhou made him consulting colonel and Zuotang magistrate.',
  ],
  s0345: [
    'He did not handle county affairs, drank daily; when men sued he whipped and sent them away.',
    'He drank daily; suitors he whipped away.',
  ],
  s0346: [
    'He died young.',
    'He died young.',
  ],
  s0347: [
    'His collected works circulated in the world.',
    'His works circulated.',
  ],
  s0348: [
    'Son Bi also had literary talent and died before Ji.',
    'Son Bi had talent and died before Ji.',
  ],
  s0349: [
    'He Sicheng, styled Yuanjing, was a man of Tan in Donghai.',
    'He Sicheng, styled Yuanjing, was from Tan in Donghai.',
  ],
  s0350: [
    'Father Jingshu was Qi Eastern Expedition recorder and Yuhang magistrate.',
    'Father Jingshu was Qi eastern expedition recorder and Yuhang magistrate.',
  ],
  s0351: [
    'Sicheng in youth studied diligently and was skilled at literary phrasing.',
    'Young Sicheng studied hard and wrote well.',
  ],
  s0352: [
    'He began as Prince of Nankang gentleman, rising to Prince of Ancheng left regular attendant, concurrently National University erudite, Pingnan Prince of Ancheng acting aide, concurrently staff secretary.',
    'He began in Nankang service, rose to Ancheng attendant, erudite, and staff secretary.',
  ],
  s0353: [
    'Following the princedom to Jiangzhou he made "Poem on Touring Mount Lu"; Shen Yue saw it and greatly praised it, himself thinking he did not reach it.',
    'His Mount Lu poem made Shen Yue praise him above himself.',
  ],
  s0354: [
    'Yue\'s suburban residence newly built a tower study; he ordered a scribe to inscribe this poem on the wall.',
    'Yue had the poem inscribed on his new tower study.',
  ],
  s0355: [
    'Fu Zhao often asked Sicheng to compose "Sacrifice to the Master" poetry; the diction was classic and beautiful.',
    'Fu Zhao asked for Sacrifice poetry—classic and beautiful.',
  ],
  s0356: [
    'He was made Court Reviewer.',
    'He became court reviewer.',
  ],
  s0357: [
    'In the fifteenth year of Tianjian an edict ordered Crown Prince Grand Tutor Xu Mian to recommend scholars to enter Hualin and compile the Comprehensive Digest; Mian recommended Sicheng and four others to answer the selection.',
    'Tianjian year fifteen Mian recommended Sicheng and four others for Hualin Digest.',
  ],
  s0358: [
    'He was promoted to Imperial Censor.',
    'He became imperial censor.',
  ],
  s0359: [
    'From Song and Qi this post had grown somewhat light; at the beginning of Tianjian they first again weighted the choice.',
    'The post had grown light; Tianjian restored its weight.',
  ],
  s0360: [
    'Before the carriage, following the two Ministry of Works aides, three outriders were given, holding the seal pouch in blue bag—old business because the impeaching officer\'s seal cords went in front.',
    'Three outriders and seal pouch followed old impeachment custom.',
  ],
  s0361: [
    'After long time he was promoted to Moling magistrate, entered concurrently as Eastern Palace Communications Attendant.',
    'Later Moling magistrate and Eastern Palace attendant.',
  ],
  s0362: [
    'He was made Anxi Prince Xiangdong recorder, still Communications Attendant as before.',
    'He was Xiangdong recorder while keeping attendant duty.',
  ],
  s0363: [
    'At that time Xu Mian and Zhou She with talent held the court and both loved Sicheng\'s learning, often inviting him day after day.',
    'Xu Mian and Zhou She, holding court, often invited him.',
  ],
  s0364: [
    'When Crown Prince Zhaoming died he went out as magistrate of Yi.',
    'When Zhaoming died he became Yi magistrate.',
  ],
  s0365: [
    'He was promoted to Xuanhui Prince of Wuling center recorder and died in office at age fifty-four.',
    'He rose to Wuling center recorder and died in office at fifty-four.',
  ],
  s0366: [
    'Collected works in fifteen scrolls.',
    'Fifteen scrolls of works.',
  ],
  s0367: [
    'Earlier Sicheng with clansman Xun and son Lang all had literary fame; people of the time said: "The three He of Donghai—son Lang the most."',
    'People said: "Three He of Donghai—son Lang most."',
  ],
  s0368: [
    'Sicheng heard it and said: "This saying is wrong."',
    'Sicheng said: "That is wrong."',
  ],
  s0369: [
    'If not so, it should go to Xun.',
    'If not, it belongs to Xun.',
  ],
  s0370: [
    'Sicheng\'s intent was that it should be on himself.',
    'He meant himself.',
  ],
  s0371: [
    'Son Lang, styled Shiming, early had talent and thought, excelled in pure talk; Zhou She often discussed with him and admired his subtle principle.',
    'Son Lang, styled Shiming, excelled in pure talk; Zhou She admired him.',
  ],
  s0372: [
    'Once he made "Rhapsody on the Ruined Mound," modeled on Zhuang Zhou\'s horse whip; the text was very artful.',
    'His Ruined Mound rhapsody modeled Zhuangzi—very artful.',
  ],
  s0373: [
    'People of the world said: "Among men, bright bright He Zilang."',
    'People said: "Among men, bright He Zilang."',
  ],
  s0374: [
    'He served as Supernumerary Cavalry Gentleman and went out as magistrate of Gushan.',
    'He was supernumerary cavalry gentleman and Gushan magistrate.',
  ],
  s0375: [
    'He died at age twenty-four.',
    'He died at twenty-four.',
  ],
  s0376: [
    'His collected works circulated in the world.',
    'His works circulated.',
  ],
  s0377: [
    'Liu Cha, styled Shishen, was a man of Pingyuan in Pingyuan commandery.',
    'Liu Cha, styled Shishen, was from Pingyuan.',
  ],
  s0378: [
    'Grandfather Chenmin was Song Inspector of Ji.',
    'Grandfather Chenmin was Song Ji inspector.',
  ],
  s0379: [
    'Father Wenwei was Qi Administrator of Dongyang; he had pure achievement and is in the "Biography of Good Administration" of the Book of Qi.',
    'Father Wenwei was Qi Dongyang administrator, in Qi\'s Good Administration biography.',
  ],
  s0380: [
    'Cha at several years—Recluse Ming Sengshao saw him, stroked him and said: "This boy is truly a thousand-li colt."',
    'Sengshao called young Cha a thousand-li colt.',
  ],
  s0381: [
    'At thirteen he entered his father\'s mourning; each time he wept his grief moved passersby.',
    'At thirteen mourning his father, his weeping moved passersby.',
  ],
  s0382: [
    'Early Tianjian he was National University erudite and Xuanhui Prince of Yuzhang acting aide.',
    'Early Tianjian he was university erudite and Yuzhang acting aide.',
  ],
  s0383: [
    'Cha in youth loved learning, broadly mastering many books; from Shen Yue and Ren Fang down, whenever they forgot something they all consulted him.',
    'He mastered many books; Shen Yue and Ren Fang consulted him on forgettings.',
  ],
  s0384: [
    'Once at Yue\'s seat they spoke of the ancestral temple victim-vessel; Yue said: "Zheng Xuan answering Zhang Yi said it was painting a phoenix tail swaying.',
    'At Yue\'s they discussed the victim-vessel; Yue cited Zheng Xuan on a painted phoenix tail.',
  ],
  s0385: [
    'Today that vessel no longer exists, so one does not follow antiquity."',
    'Today it no longer exists, so we do not follow antiquity."',
  ],
  s0386: [
    'Cha said: "This saying cannot necessarily be pressed."',
    'Cha said: "That cannot be pressed."',
  ],
  s0387: [
    'In antiquity sacrificial vessels were all carved wood as birds and beasts, boring the top and back to draw out the inner wine.',
    'Ancient vessels were carved birds and beasts with bored tops for wine.',
  ],
  s0388: [
    'Recently in Wei times in Lu commandery underground they obtained Qi grandee Ziwei\'s daughter-send-off vessels, with a victim-vessel in victim-ox form;',
    'Wei times in Lu yielded Qi vessels with an ox-shaped victim-vessel;',
  ],
  s0389: [
    'in the Yongjia era the bandit Cao Yi at Qingzhou opened Duke Jing of Qi\'s tomb and again obtained these two vessels, the form also ox-shaped.',
    'Yongjia bandit Cao Yi opened Duke Jing\'s tomb and found two ox-shaped vessels.',
  ],
  s0390: [
    'Both places are ancient surviving vessels; one knows it is not empty.',
    'Both are ancient vessels—proof, not fiction.',
  ],
  s0391: [
    'Yue greatly agreed.',
    'Yue agreed fully.',
  ],
  s0392: [
    'Yue also said: "He Chengtian\'s Collected Texts is strange and broad; the book records Zhang Zhongshi and the long-neck king—where does this come from?"',
    'Yue asked where He Chengtian\'s Zhang Zhongshi and long-neck king came from.',
  ],
  s0393: [
    'Cha said: "Zhongshi was one foot two inches long—only from the Discourses Weighed."',
    'Cha said Zhongshi\'s height is only in Discourses Weighed.',
  ],
  s0394: [
    'The long neck is King Virudhaka; Zhu Jian\'s Record South of Funan says: from antiquity to now he does not die."',
    'The long neck is King Virudhaka in Zhu Jian\'s Record south of Funan—immortal from antiquity."',
  ],
  s0395: [
    'Yue at once took the two books and searched; it was exactly as Cha said.',
    'Yue searched both books—exactly as Cha said.',
  ],
  s0396: [
    'When Yue\'s suburban residence newly built the tower study, Cha made two encomia and also presented writings he had composed; Yue at once ordered a scribe to inscribe the encomia on the wall.',
    'Cha gave two encomia for Yue\'s tower study; Yue had them inscribed.',
  ],
  s0397: [
    'He still replied to Cha in a letter saying: "Life\'s loves are not among men; joy of forests and ravines is much stolen by affairs.',
    'Yue wrote: "Life\'s loves are not among men; ravine joy is stolen by affairs.',
  ],
  s0398: [
    'Sunset on the road ends—this heart has gone;',
    'Sunset ends the road—my heart has gone;',
  ],
  s0399: [
    'yet still a little idle distance remains, summoning feelings clear and spacious.',
    'yet a little idle distance and clear feelings remain.',
  ],
  s0400: [
    'I built a house in the eastern suburbs—not called stopping rest, but rather it quite lodges my old heart, sometimes allowing repose."',
    'I built in the eastern suburbs—not mere rest but lodging my old heart for repose."',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_050_b4.mjs <translation.json>'
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
