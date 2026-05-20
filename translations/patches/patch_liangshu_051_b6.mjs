#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0501: [
    '" Thus he spoke three times.',
    '" He said this three times.',
  ],
  s0502: [
    'In the spring before Xiao died, someone planted a persimmon in his courtyard; Xiao told his nephew Yan, "I shall not see this fruit—do not speak of it.',
    'The spring before Xiao died someone planted a persimmon in his yard; he told his nephew Yan, "I will not live to see this fruit—say nothing of it.',
  ],
  s0503: [
    '" When autumn came he died; men thought him prescient about fate.',
    '" He died that autumn; people took it as knowledge of fate.',
  ],
  s0504: [
    'Relatives and friends eulogized his conduct and posthumously titled him Recluse of Chaste Integrity.',
    'Kin and friends eulogized his life and gave him the posthumous title Recluse of Chaste Integrity.',
  ],
  s0505: [
    'Yu Shen, styled Yanshi, was a man of Xinye.',
    'Yu Shen, styled Yanshi, came from Xinye.',
  ],
  s0506: [
    'As a child he was clever and devoted to learning; classics, history, and the hundred schools he mastered entirely—weft-texts, divination, writing, archery, go, and mechanical ingenuity were all unmatched in the age.',
    'Clever and studious from youth, he mastered classics, history, and every school—weft-texts, divination, writing, archery, go, and ingenious craft were unrivaled in his day.',
  ],
  s0507: [
    'Yet his nature inclined to plain simplicity; he especially loved forests and springs.',
    'Yet he was plain and simple by nature and loved woods and streams above all.',
  ],
  s0508: [
    'In a ten-mu dwelling, hills and ponds occupied half.',
    'Half his ten-mu home was hill and pond.',
  ],
  s0509: [
    'He ate vegetables and wore worn clothes and did not manage property.',
    'He ate plain food, wore threadbare clothes, and kept no estate.',
  ],
  s0510: [
    'Once returning by boat from his fields he carried a hundred fifty piculs of rice; someone asked to load thirty piculs aboard.',
    'Once boating back from his fields with a hundred fifty piculs of rice, a man asked to ship thirty piculs with him.',
  ],
  s0511: [
    'When he reached home the loader said, "You have thirty hu, I have a hundred fifty piculs.',
    'At home the loader said, "You have thirty hu; I have a hundred fifty piculs.',
  ],
  s0512: [
    '" Shen kept silent and let him take all he wanted.',
    '" Shen said nothing and let him take what he would.',
  ],
  s0513: [
    'A neighbor falsely accused as a thief was prosecuted and confessed under duress; Shen took pity, pawned books for twenty thousand cash, and had a disciple pose as kin to pay compensation in his stead.',
    'A neighbor wrongly charged as a thief was beaten into confession; Shen pitied him, pawned books for twenty thousand cash, and had a student pose as kin to pay the damages.',
  ],
  s0514: [
    'The neighbor was freed and thanked Shen; Shen said, "I pity all the innocent under heaven—why would I expect thanks?',
    'The neighbor was cleared and thanked him; Shen said, "I pity the innocent everywhere—why expect thanks?',
  ],
  s0515: [
    '" His conduct was mostly of this sort.',
    '" Most of his deeds were like this.',
  ],
  s0516: [
    'Gaozu in youth was friendly with Shen and greatly esteemed him.',
    'Gaozu knew Shen from youth and held him in high regard.',
  ],
  s0517: [
    'When the uprising began he appointed him Army staff officer of the Pacify-the-West headquarters; Shen would not submit.',
    'At the uprising he made Shen staff officer of the Pacify-the-West headquarters; Shen refused.',
  ],
  s0518: [
    'All his life he kept few intimates; Liu Yun of Hedong wished to befriend him, but Shen refused and would not accept.',
    'He kept few close friends; Liu Yun of Hedong sought his friendship, but Shen turned him away.',
  ],
  s0519: [
    'Later when Prince Xiangdong governed Jingzhou, he was appointed Army staff officer of the Pacify-the-West headquarters; he did not go.',
    'Later Prince Xiangdong at Jingzhou made him Pacify-the-West staff officer; he declined.',
  ],
  s0520: [
    'In the Putong era an edict said, "Brightly raise the stalled—this is foremost in government;',
    'Putong era edict: "To raise the stalled is government\'s first duty;',
  ],
  s0521: [
    'to honor the worthy and seek scholars—this is what one dreams of in urgency.',
    'to honor talent and seek scholars is the urgent dream of rule.',
  ],
  s0522: [
    'Yu Shen of Xinye, content to stop and dwell in withdrawal, busies himself sweeping his threshold; classics, history, and letters he has largely mastered;',
    'Yu Shen of Xinye, knowing when to stop and live apart, keeps his own threshold; he is deeply versed in classics, history, and letters;',
  ],
  s0523: [
    'Yu Chengxian of Yingchuan, learned in Yellow Emperor and Laozi, also versed in Buddhist teaching;',
    'Yu Chengxian of Yingchuan masters Huang-Lao learning and knows Buddhist teaching;',
  ],
  s0524: [
    'both unambitious and unenterprising, settled in this withered state—they can steady rashness and thicken custom.',
    'both unambitious and unworldly, content in austerity—they can calm hot tempers and thicken custom.',
  ],
  s0525: [
    'Shen may be Gentleman Attendant at the Yellow Gates, Chengxian may be Vice Director of the Secretariat.',
    'Shen is appointed Gentleman Attendant at the Yellow Gates; Chengxian, Vice Director of the Secretariat.',
  ],
  s0526: [
    'Let provinces and commanderies press them with timely urging, hoping they may bend their will—we look to them as salt and sour plum.',
    'Let provinces and districts urge them in season, hoping to win their assent—we count on them as salt and plum.',
  ],
  s0527: [
    '" Shen pleaded illness and did not go.',
    '" Shen pleaded illness and stayed away.',
  ],
  s0528: [
    'In his later years he especially followed Buddhist teaching.',
    'In old age he devoted himself still more to Buddhism.',
  ],
  s0529: [
    'Within his house he established a dharma hall, circumambulating and performing repentance, six periods without pause.',
    'He built a dharma hall at home and ceaselessly circled it in repentance, six times daily without rest.',
  ],
  s0530: [
    'He chanted the *Lotus Sutra* once each day.',
    'Each day he chanted the *Lotus Sutra* once through.',
  ],
  s0531: [
    'Later one night he suddenly saw a Daoist priest who called himself Master Yuan, very strange in bearing, who addressed Shen as "Master of the Higher Path," gave incense, and departed.',
    'One night he saw a priest calling himself Master Yuan, oddly composed, who hailed Shen as Master of the Higher Path, gave incense, and left.',
  ],
  s0532: [
    'In the fourth year of Zhongdatong, waking from a daytime nap, he started and said, "Master Yuan comes again—I cannot stay long.',
    'Zhongdatong year four, waking from a nap, he started and said, "Master Yuan returns—I cannot linger.',
  ],
  s0533: [
    '" His countenance unchanged, at the end of his words he died, aged seventy-eight.',
    '" His face unchanged, he died as he finished speaking, at seventy-eight.',
  ],
  s0534: [
    'The whole household heard a voice in the air chant, "The Master of the Higher Path has been born in Amitabha\'s Pure Land."',
    'All in the house heard a voice from the sky: "Master of the Higher Path is born in Amitabha\'s Pure Land."',
  ],
  s0535: [
    'Gaozu heard and issued an edict: "Honoring good and displaying conduct—former kings made this their instruction.',
    'Gaozu heard and decreed: "To honor virtue and show conduct is what former kings enjoined.',
  ],
  s0536: [
    'Yu Shen of Xinye—pearl and jade of Jingshan, catalpa and paulownia of Jiangling; when the quiet marquis crossed south he had fame and virtue; alone in bitter integrity and solitary pure conduct.',
    'Yu Shen of Xinye—Jingshan pearl, Jiangling timber; when the quiet marquis fled south his name and virtue were sure; alone in harsh integrity and pure solitary walk.',
  ],
  s0537: [
    'Suddenly gone with fate\'s turn, grief fills the heart.',
    'Suddenly taken by fate, the heart is sore with grief.',
  ],
  s0538: [
    'He should be posthumously titled Recluse of Chaste Integrity to display his lofty virtue.',
    'Let him be titled Recluse of Chaste Integrity, that his high virtue may shine.',
  ],
  s0539: [
    '" Shen wrote *Imperial Calendars* in twenty scrolls, *Forest of Changes* in twenty, continued Wu Duanxiu\'s *Record of Jiangling* in one, *Miscellaneous Affairs of Jin* in five, and *General Collection* in eighty—all circulated in the world.',
    '" His works included twenty scrolls each of *Imperial Calendars* and *Forest of Changes*, one scroll continuing Wu Duanxiu\'s *Record of Jiangling*, five of *Miscellaneous Affairs of Jin*, and eighty of *General Collection*—all in circulation.',
  ],
  s0540: [
    'His son Manqian, styled Shihua, also early won fine reputation.',
    'His son Manqian, styled Shihua, won early fame as well.',
  ],
  s0541: [
    'When Shizu was in Jingzhou he recruited him as chief clerk, then promoted him to central recorder.',
    'Shizu at Jingzhou made him chief clerk, then central recorder.',
  ],
  s0542: [
    'Each time he went out Shizu would watch him go and say to Liu Zhilin, "Jingnan truly has many gentlemen—though Gui Tianfeng is beautiful and Huan Jie is pure, in praising virtue and marking excellence none surpasses this boy.',
    'Whenever Manqian left, Shizu watched him go and told Liu Zhilin, "Jingnan has true gentlemen—Gui Tianfeng is fair and Huan Jie is clear, but for honoring virtue none outdoes this lad.',
  ],
  s0543: [
    '" Later he became advisory staff officer.',
    '" Later he became advisory staff officer.',
  ],
  s0544: [
    'His works include *Mourning Garb Rites*, *Character Forms and Rules*, and *Exegesis on Zhuangzi and Laozi*, commentaries on the *Classic of Computation* and *Seven Luminaries Calendar Methods*, together with his own compositions—ninety-five scrolls in all.',
    'He wrote *Mourning Garb Rites*, *Character Forms and Rules*, *Exegesis on Zhuangzi and Laozi*, commentaries on the *Classic of Computation* and *Seven Luminaries Calendar Methods*, and his own essays—ninety-five scrolls all told.',
  ],
  s0545: [
    'His son Jicai had learning and conduct.',
    'His son Jicai had scholarship and character.',
  ],
  s0546: [
    'During Chengsheng he served up to Vice Director of the Secretariat.',
    'Under Chengsheng he rose to Vice Director of the Secretariat.',
  ],
  s0547: [
    'When Jiangling fell he entered the pass with the rest.',
    'When Jiangling fell he went into the north with the others.',
  ],
  s0548: [
    'Zhang Xiaoxiu',
    'Zhang Xiaoxiu',
  ],
  s0549: [
    'Zhang Xiaoxiu, styled Wenyi, was a man of Wan in Nanyang.',
    'Zhang Xiaoxiu, styled Wenyi, came from Wan in Nanyang.',
  ],
  s0550: [
    'In youth he served the province as aide to the inspector.',
    'Young, he was provincial aide to the inspector.',
  ],
  s0551: [
    'After mourning his mother, when mourning ended he became vice-administrator to the Prince of Jian\'an.',
    'After his mother\'s mourning he became vice-administrator to the Prince of Jian\'an.',
  ],
  s0552: [
    'Soon after he resigned and returned to the mountains, dwelling at East Grove Temple.',
    'Soon he quit office for the hills and lived at East Grove Temple.',
  ],
  s0553: [
    'He had several dozen qing of fields and several hundred retainers, all farming—supplying the mountain community entirely; men near and far admired him and came as to a market.',
    'He held dozens of qing and hundreds of retainers who farmed for the monastery; admirers near and far flocked to him like a market.',
  ],
  s0554: [
    'Xiaoxiu was open and straightforward by nature, disliking ornament; he often wore a grain-husk headcloth, straw sandals, and in hand a combined palm-bark flywhisk.',
    'Plain and unpretentious, he usually wore a grain-husk cap, straw shoes, and carried a palm-bark flywhisk.',
  ],
  s0555: [
    'He took cold-food powder and in deep winter could lie on stone.',
    'He used cold-food powder and in deep winter could sleep on bare stone.',
  ],
  s0556: [
    'He ranged widely in books and specialized in Buddhist canon.',
    'He read broadly and mastered Buddhist scripture.',
  ],
  s0557: [
    'He was skilled at debate and clerical script; of every art none was unknown to him.',
    'He debated well, wrote clerical script expertly, and knew every craft worth knowing.',
  ],
  s0558: [
    'In the third year of Putong he died, aged forty-two; throughout the room an extraordinary fragrance was sensed.',
    'Putong year three he died at forty-two; a strange fragrance filled the room.',
  ],
  s0559: [
    'Taizong heard and grieved deeply; he wrote to Liu Huifei describing his pure white conduct.',
    'Taizong mourned him and wrote Liu Huifei praising his pure life.',
  ],
  s0560: [
    'Yu Chengxian',
    'Yu Chengxian',
  ],
  s0561: [
    'Yu Chengxian, styled Zitong, was a man of Dingling in Yingchuan.',
    'Yu Chengxian, styled Zitong, came from Dingling in Yingchuan.',
  ],
  s0562: [
    'From youth he was quiet and possessed firm resolve; right and wrong did not enter his speech, joy and anger did not show on his face—none could fathom him.',
    'Quiet and principled from youth, he never spoke of right and wrong and never showed joy or anger—no one could read him.',
  ],
  s0563: [
    'In early youth he studied under Liu Ou of Nanyang; strong in memory and quick in perception, he stood above his peers.',
    'As a boy he studied with Liu Ou of Nanyang; his memory and wit surpassed his fellows.',
  ],
  s0564: [
    'Dark learning and Buddhist canon—none he did not comprehend;',
    'Dark learning and Buddhist scripture—he knew them all;',
  ],
  s0565: [
    'The Nine Currents and the *Seven Summaries*—all he mastered.',
    'the Nine Currents and the *Seven Summaries*—all he had mastered.',
  ],
  s0566: [
    'The commandery summoned him as merit officer; he did not go, and instead traveled Mt Heng with Daoist Wang Sengzhen.',
    'Summoned as commandery merit officer, he refused and roamed Mt Heng with the Daoist Wang Sengzhen.',
  ],
  s0567: [
    'Late in life, because his brother was ill he returned home and settled on Mt Tutai.',
    'Later, his brother fell ill; he went home and settled on Mt Tutai.',
  ],
  s0568: [
    'Prince Zhonglie of Poyang while governing the province admired his flavor and invited him to keep company.',
    'Prince Zhonglie of Poyang, governing the province, prized his character and asked his company.',
  ],
  s0569: [
    'He also had him lecture on the *Laozi*; eminent monks near and far all came; sharp debate arose and heterodoxies competed; Chengxian slowly answered each, all hearing what they had never heard.',
    'He had him expound the *Laozi*; famous monks gathered from afar; debate flared and odd doctrines piled in—Chengxian answered calmly, and all heard things new to them.',
  ],
  s0570: [
    'Prince Zhonglie especially honored him and summoned him as provincial chief clerk;',
    'Prince Zhonglie honored him still more and summoned him as provincial chief clerk;',
  ],
  s0571: [
    'Prince Xiangdong heard and also appointed him legal bureau staff officer;',
    'Prince Xiangdong heard and also made him legal bureau staff officer;',
  ],
  s0572: [
    'he went to neither.',
    'he accepted neither post.',
  ],
  s0573: [
    'In the third year of Zhongdatong Liu Huifei of Lushan came to Jingzhou; Chengxian had old ties with him and went to join him.',
    'Zhongdatong year three Liu Huifei of Lushan reached Jingzhou; Chengxian, an old friend, went to him.',
  ],
  s0574: [
    'Students of Jing and Shan then asked Chengxian to lecture on the *Laozi*.',
    'Students of Jing and Shan asked Chengxian to lecture on the *Laozi*.',
  ],
  s0575: [
    'Prince Xiangdong personally ordered his carriage to listen; debate lasted all day and he deeply appreciated and received him.',
    'Prince Xiangdong drove out to hear him; they debated all day and the prince greatly favored him.',
  ],
  s0576: [
    'After lingering more than a month he returned to the mountain.',
    'He stayed over a month, then went back to the hills.',
  ],
  s0577: [
    'The prince personally saw him off and also bestowed verse; recluses praised it.',
    'The prince saw him off in person and gave him poems; recluses admired them.',
  ],
  s0578: [
    'That year he died, aged sixty.',
    'That year he died, at sixty.',
  ],
  s0579: [
    'Yao Cha, Minister of Personnel of Chen, said: Those who malign recluses often say they merely steal empty fame without practical use—yet there are those who fail to put their substance to use.',
    'Yao Cha, Chen Minister of Personnel, said: Men who slander recluses call them empty fame with no use—but some gifted men simply never deploy their gifts.',
  ],
  s0580: [
    'If men like Zhuge Ju\'s scholarship and Ruan Xiaoxiu\'s genealogical mastery—would advancing have been difficult for them?',
    'For men like Zhuge Ju in learning and Ruan Xiaoxiu in genealogy—was high office ever hard to win?',
  ],
  s0581: [
    'Yet they ended in reclusion—after all, that was simply their nature.',
    'They ended in withdrawal—it was only their nature.',
  ],
  s0582: [
    'Editorial footnote marker in the source text.',
    'Editorial footnote marker in the source text.',
  ],
  s0583: [
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
    'The full text was collated against the Zhonghua Shuju edition of the Book of Liang (May 1973).',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_051_b6.mjs <translation.json>'
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
