#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0101: [
    'Lan was a man of fine bearing and spirit, skilled in eloquence; Gaozu deeply valued him.',
    'Lan had a handsome presence and gift for speech; the Founding Emperor prized him greatly.',
  ],
  s0102: [
    'Once while attending in his seat, he received an edict to compose an answering poem with Attendant-in-Ordinary Wang Jian in reply to an exchange of gifts.',
    'Once in attendance he was ordered, with Attendant Wang Jian, to compose answering verse for a gift exchange.',
  ],
  s0103: [
    'His writing was very skilled.',
    'The piece was finely wrought.',
  ],
  s0104: [
    'Gaozu was pleased and had him write again; it again matched intent.',
    'The Emperor approved and asked for another; again it fit the wish.',
  ],
  s0105: [
    'Then he bestowed a poem that read: "Both Wen are rising talents; the two youths are truly famous houses;',
    'He granted a poem: "Twin Wen are latecomers yet rising; both young men are true great clans;',
  ],
  s0106: [
    'how could they merely bear up the ridgepole\'s height? Truly both are the state\'s finest flowers."',
    'could they only lift the ridgebeam? Surely both are the realm\'s finest blossoms."',
  ],
  s0107: [
    'On his mother\'s mourning he left office.',
    'He left his post for mourning his mother.',
  ],
  s0108: [
    'When mourning ended he was made Palace Companion to the Heir Apparent, also handled the Bureau Director of Personnel\'s affairs, soon made Bureau Director, then promoted Attendant-in-Ordinary.',
    'After mourning he became heir-apparent companion, handled Personnel bureau director duties, soon became director, then attendant.',
  ],
  s0109: [
    'Lan was quite fond of wine; at a banquet with Regular Attendant of the Writes-on-the-Fast Xiao Chen they exchanged abusive words and were reported by the authorities.',
    'Lan loved wine; at a feast he and Regular Attendant Xiao Chen traded insults, and the authorities memorialized against them.',
  ],
  s0110: [
    'Gaozu, because Lan was young and not straightforward, sent him out as Chief Clerk of the Central Guards.',
    'The Emperor, holding Lan young and not upright, sent him out as Central Guards chief clerk.',
  ],
  s0111: [
    'Shortly after, he was ordered to manage Eastern Palace records, promoted General of Bright Might and Administrator of Xin\'an.',
    'Soon he was ordered to keep Eastern Palace records, promoted Bright Might general and Xin\'an administrator.',
  ],
  s0112: [
    'In summer of year nine, mountain bandit Wu Chengbo smashed Xuancheng commandery; remnants scattered into Xin\'an; rebel clerk Bao Xu and others joined them, seized Yi and She counties, and advanced to attack Lan.',
    'In the ninth year\'s summer, bandit Wu Chengbo broke Xuancheng; survivors fled into Xin\'an; rebel clerks Bao Xu and others joined, took Yi and She, and marched on Lan.',
  ],
  s0113: [
    'Lan sent Commandery Assistant Zhou Xingsi to build a stockade at Jinsha to resist; they were no match and he abandoned the commandery and fled to Kuaiji.',
    'Lan sent assistant Zhou Xingsi to fortify Jinsha and fight; defeated, he abandoned the commandery and fled to Kuaiji.',
  ],
  s0114: [
    'When court troops pacified the mountain raiders, Lan returned to the commandery, then was demoted to Adviser of the Minister of the Masters of Works, Chief Clerk of Humaneness and Might, acting South Xuzhou affairs, and Minister of the Five Armaments.',
    'When the army pacified the bandits, Lan returned; then he was demoted to Masters of Works adviser, Humaneness and Might chief clerk, acting South Xuzhou, and Five Armaments minister.',
  ],
  s0115: [
    'Soon he was transferred to Minister of Personnel.',
    'Soon he became minister of personnel.',
  ],
  s0116: [
    'From grandfather to grandson, Lan\'s line held the selection bureau three generations—a glory of the age.',
    'From grandfather through grandson, three generations held the personnel bureau—the age took it for honor.',
  ],
  s0117: [
    'In spring of year twelve he went out as Administrator of Wuxing.',
    'In the twelfth year\'s spring he went out as Wuxing administrator.',
  ],
  s0118: [
    'Palace Secretariat Gentleman Huang Muzhi\'s family lived in Wucheng; his sons and nephews were overbearing, and former administrators all bent the knee to serve them.',
    'Secretariat gentleman Huang Muzhi\'s house was in Wucheng; his kin bullied the circuit, and every prior administrator bowed to them.',
  ],
  s0119: [
    'Before Lan reached the commandery, Muzhi\'s kin came to welcome him; Lan drove off their boats and beat the clerks who had cleared the way for them.',
    'Before Lan arrived, Muzhi\'s kin came to meet him; he drove off their boats and whipped the clerks who had let them through.',
  ],
  s0120: [
    'From then on Muzhi\'s household shut their doors and did not venture out, daring no private or official dealings.',
    'After that Muzhi\'s clan stayed indoors and dared no public or private traffic.',
  ],
  s0121: [
    'The commandery had many robbers and was a scourge on the eastern route; when Lan took his carriage down the district grew stern and the whole region grew quiet.',
    'Robbery was rife and troubled the eastern roads; when Lan took office the whole district grew orderly and still.',
  ],
  s0122: [
    'Earlier Qi Mingdi, Lan\'s father Di, and Xu Xiaosi of Donghai had all governed Wuxing and been called famed administrators—Lan wished to surpass them all!',
    'Once Qi Mingdi, Lan\'s father Di, and Donghai\'s Xu Xiaosi had all ruled Wuxing as famed administrators—Lan meant to outdo them all!',
  ],
  s0123: [
    'Long ago in Xin\'an Lan had greatly gathered wealth; now he was praised as pure and clean, and men compared him to Wang Huainzu.',
    'Once in Xin\'an he had been grasping; now he was called incorrupt, and the age compared him to Wang Huainzu.',
  ],
  s0124: [
    'He died in office at age thirty-seven.',
    'He died in office at thirty-seven.',
  ],
  s0125: [
    'An edict posthumously made him Director of the Palace Library.',
    'He was posthumously made palace library director.',
  ],
  s0126: [
    'His son Han died young.',
    'His son Han died early.',
  ],
  s0127: [
    'Chen Minister of Personnel Yao Cha said: In the Song age, was Xie Fei perhaps a man of loyalty and righteousness?',
    'Chen Minister of Personnel Yao Cha said: Was Xie Fei, in Song times, a man of loyalty and righteousness?',
  ],
  s0128: [
    'In Qi Jianwu times he folded his robe and checked his step; in Yongyuan\'s many troubles he stood firm in doing good alone—is he not of the sort of Shu and Jiang?',
    'In Qi Jianwu he held back his robes; amid Yongyuan\'s troubles he stood alone in the good—one of Shu and Jiang\'s kind?',
  ],
  s0129: [
    'When Gaozu\'s dragon fortune rose, he sought men on every hand; Fei came to serve in scholar\'s kerchief and first climbed the terraces of state—he had reached the utmost of entering and leaving office!',
    'When Gaozu rose, he searched widely; Fei came in plain kerchief and first reached the high ministries—the full arc of public life!',
  ],
  s0130: [
    'Lan in the end could govern well; gentlemen approved him.',
    'Lan could govern well to the end; gentlemen praised it.',
  ],
  s0131: [
    '[1] Editorial footnote marker in the source text.',
    '[1] Editorial footnote marker.',
  ],
  s0132: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_015_b2.mjs <translation.json>'
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
