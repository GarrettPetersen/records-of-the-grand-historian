#!/usr/bin/env node
import fs from 'node:fs';

const T = {
  s0001: [
    'The Changes says: "Excess means knowing advance but not retreat, knowing preservation but not loss.',
    'The Changes says: "Excess" means knowing when to advance but not when to retreat, knowing how to preserve but not how to perish.',
  ],
  s0002: [
    'Knowing advance, retreat, preservation, and loss without losing the Mean—surely only the sage can do this!"',
    'Only the sage knows advance, retreat, preservation, and loss without losing the Mean!"',
  ],
  s0003: [
    'The Tradition says: "Knowing sufficiency brings no disgrace; knowing when to stop brings no danger."',
    'The Tradition says: "Knowing sufficiency brings no disgrace; knowing when to stop brings no danger."',
  ],
  s0004: [
    'Yet if one does not understand advance and retreat, and does not grasp sufficiency and stopping, the burden of disgrace and danger arrives within a month.',
    'Yet those who misjudge advance and retreat and never grasp sufficiency and stopping invite disgrace and danger within a month.',
  ],
  s0005: [
    'When men of old advanced, it was to bring peace to the age and aid affairs, to spread the Way and sharpen custom.',
    'Men of old advanced to comfort the age, aid affairs, spread the Way, and sharpen custom.',
  ],
  s0006: [
    'When they advanced, glory and favor came easily, so fools scrambled for them;',
    'Advance brought easy glory and favor, so fools scrambled for them;',
  ],
  s0007: [
    'when they withdrew, bitter integrity and hard constancy made vulgar men fear and resent them.',
    'withdrawal meant bitter integrity and hard constancy that vulgar men feared and resented.',
  ],
  s0008: [
    'Though disaster, defeat, peril, and ruin lay before their eyes, lightly to rise and walk high—few in earlier histories did so.',
    'Though disaster and ruin lay before their eyes, few in earlier histories lightly rose and walked away.',
  ],
  s0009: [
    'In Han, Zhang Liang achieved merit and withdrew his person, took to his bed and ceased grain—compared with Yue Yi and Fan Li, down to their ruin, he was the better case.',
    'In Han, Zhang Liang achieved merit and withdrew, took to his bed and ceased grain—compared with Yue Yi and Fan Li, even to their ruin, he was the better case.',
  ],
  s0010: [
    'Afterward Xue Guangde and the two Shus and others withdrew and took office according to ritual—there is something to praise in that.',
    'Later Xue Guangde and the two Shus withdrew according to ritual—there is something to praise in that.',
  ],
  s0011: [
    'Yu Huan\'s "Biography of Knowing Sufficiency" in the Wei Summary pairs Tian and Xu with Guan and Hu—their Ways were fundamentally different.',
    'Yu Huan\'s "Biography of Knowing Sufficiency" in the Wei Summary pairs Tian and Xu with Guan and Hu—their Ways were fundamentally different.',
  ],
  s0012: [
    'Xie Lingyun\'s "Biography of Knowing When to Stop" in the Jin History first discusses Jin-era literary men who fled disorder—hardly the right men;',
    'Xie Lingyun\'s Jin History "Biography of Knowing When to Stop" discusses literary men fleeing disorder—hardly the right men;',
  ],
  s0013: [
    'only Ruan Sixiao left glory and loved withdrawal, far from nearly suffering disgrace.',
    'only Ruan Sixiao left glory and loved withdrawal, far from nearly suffering disgrace.',
  ],
  s0014: [
    'The Song History "Biography of Knowing Sufficiency" has Yang Xin and Wang Wei—both of that stream.',
    'The Song History "Biography of Knowing Sufficiency" has Yang Xin and Wang Wei—both of that stream.',
  ],
  s0015: [
    'In Qi times Liu Huan of Pei, courtesy name Zigui, declined salary and cherished the Way, lingered and nourished his will—neither fretful in poverty nor greedy in wealth: a Confucian of the highest conduct.',
    'In Qi, Liu Huan of Pei, styled Zigui, declined salary and cherished the Way, lingered to nourish his will—neither fretful in poverty nor greedy in wealth: a Confucian of the highest conduct.',
  ],
  s0016: [
    'When Liang possessed the realm, the way of petty men faded; worthy scholar-officials summoned one another to office. Those who measured their strength and kept their resolve went unmentioned in their day; sometimes men reported illness and retired, or had few desires— the state history records them in this "Biography of Knowing Sufficiency" as well.',
    'When Liang possessed the realm, petty ways faded and worthy men took office together. Those who measured strength and kept resolve went unmentioned; some reported illness and retired, some had few desires—the state history records them in this Biography of Knowing Sufficiency as well.',
  ],
  s0017: ['Gu Xianzhi', 'Gu Xianzhi'],
  s0018: [
    'Gu Xianzhi, courtesy name Sisi, was a man of Wu in Wu commandery.',
    'Gu Xianzhi, styled Sisi, came from Wu in Wu commandery.',
  ],
  s0019: [
    'His grandfather Bianzhi was Song General Who Pacifies the Army and Inspector of Xiangzhou.',
    'His grandfather Bianzhi was Song General Who Pacifies the Army and inspector of Xiangzhou.',
  ],
  s0020: [
    'Before Xianzhi had capped his years, the province appointed him Retainer of the Council; he was recommended as Filial-and-Incorrupt and rose through Attendant of the Heir Apparent and Director of the Ministry of Justice Comparison Section to Registrar of the Pacification Army.',
    'Before he capped his years, the province appointed him Retainer of the Council; recommended as Filial-and-Incorrupt, he rose through Attendant of the Heir Apparent and Director of the Ministry of Justice Comparison Section to Registrar of the Pacification Army.',
  ],
  s0021: ['In the Yuanhui era he was Magistrate of Jiankang.', 'In the Yuanhui era he was magistrate of Jiankang.'],
  s0022: [
    'At the time there was a cattle thief whom the owner identified; the thief also claimed the ox was his—both households argued with equal force, and successive magistrates could not decide.',
    'A cattle thief was identified by the owner; the thief also claimed the ox was his—both argued equally, and successive magistrates could not decide.',
  ],
  s0023: [
    'When Xianzhi arrived, he reviewed the case and told both households: "Say no more—I have got it."',
    'When Xianzhi arrived, he reviewed the case and told both households: "Say no more—I have got it."',
  ],
  s0024: [
    'He then had the ox untied and let it go where it would; the ox went straight to the true owner\'s house, and the thief at last confessed his crime.',
    'He had the ox untied and let it go where it would; the ox went straight to the true owner\'s house, and the thief at last confessed.',
  ],
  s0025: [
    'Exposing wrongdoing and unmasking the hidden—many cases were like this; people of the time called him divine in judgment.',
    'Exposing wrongdoing and unmasking the hidden—many cases were like this; people called him divine in judgment.',
  ],
  s0026: [
    'As for powerful men\'s entreaties and long administrators\' greed and cruelty, he held the law straight with the cord and never yielded to flattery.',
    'For powerful men\'s entreaties and greedy administrators, he held the law straight and never yielded to flattery.',
  ],
  s0027: [
    'By nature he was also pure and frugal, governing with firm strength, and won the people\'s harmony exceedingly.',
    'Pure and frugal by nature, he governed with firm strength and won the people\'s harmony.',
  ],
  s0028: [
    'Hence those who drank in the capital, if they got rich flavor, would call it "Administrator Gu of Jiankang," saying the brew was clear and fine.',
    'Hence capital drinkers who got rich flavor called it "Administrator Gu of Jiankang," saying the brew was clear and fine.',
  ],
  s0029: [
    'He was transferred to Registrar of the Chariots and Cavalry and Friend of the Prince of Jinxi.',
    'He was transferred to Registrar of the Chariots and Cavalry and Friend of the Prince of Jinxi.',
  ],
  s0030: [
    'When Qi Gaozu held the government, he made him Recorder of the Rapid Cavalry and transferred him to Western Section Clerk of the Grand Marshal.',
    'When Qi Gaozu held the government, he made him Recorder of the Rapid Cavalry and transferred him to Western Section Clerk of the Grand Marshal.',
  ],
  s0031: ['When the Qi regime was established, he became Attendant of the Secretariat.', 'When the Qi regime was established, he became Attendant of the Secretariat.'],
  s0032: [
    'When Qi Gaozu took the throne, he was appointed Administrator of Hengyang.',
    'When Qi Gaozu took the throne, he was appointed administrator of Hengyang.',
  ],
  s0033: [
    'Before this, within the commandery plague had struck year after year and more than half had died; coffin wood was especially costly, and corpses were wrapped only in reed mats and cast beside the road.',
    'Before this, plague had struck year after year and more than half died; coffin wood was costly, and corpses were wrapped in reed mats and cast beside the road.',
  ],
  s0034: [
    'When Xianzhi took office, he sent word to the subordinate counties to seek kin and had them all buried properly.',
    'When Xianzhi took office, he sent word to subordinate counties to seek kin and had them all buried properly.',
  ],
  s0035: [
    'For families whose line was extinguished, Xianzhi paid from public salary and had the clerks arrange care.',
    'For families whose line was extinguished, Xianzhi paid from public salary and had clerks arrange care.',
  ],
  s0036: [
    'Again, by local custom when mountain folk fell ill they would say the ancestors were the harm, all opening tombs and coffins, washing dry bones—called "removing the curse."',
    'Again, by local custom when mountain folk fell ill they said ancestors were the harm, opening tombs and washing dry bones—called "removing the curse."',
  ],
  s0037: [
    'Xianzhi enlightened them, setting forth the distinction of life and death and that the affairs do not bear on one another—the custom was thus changed.',
    'Xianzhi enlightened them on life and death and that the affairs do not bear on one another—the custom changed.',
  ],
  s0038: [
    'At the time Inspector Wang Huan had newly arrived; only in Hengyang was there no litigation, and he sighed: "Administrator Gu of Hengyang\'s transformation has reached the utmost.',
    'Inspector Wang Huan had newly arrived; only Hengyang had no litigation, and he sighed: "Administrator Gu of Hengyang\'s transformation has reached the utmost.',
  ],
  s0039: [
    'If the nine commanderies were all like this, what would I have to do!"',
    'If the nine commanderies were all like this, what would I have to do!"',
  ],
  s0040: [
    'He returned to serve as Retainer of the Masters of Affairs in the Grand Marshal\'s office.',
    'He returned as Retainer of the Masters of Affairs in the Grand Marshal\'s office.',
  ],
  s0041: [
    'He went out as Chief Clerk of the Eastern General of the Gentlemen and Acting Administrator of Kuaiji commandery.',
    'He went out as Chief Clerk of the Eastern General of the Gentlemen and acting administrator of Kuaiji.',
  ],
  s0042: [
    'Lü Wendu of Shanyin had favor with Qi Wudi and established a lodge in Yuyao, behaving quite overbearingly.',
    'Lü Wendu of Shanyin had favor with Qi Wudi and established a lodge in Yuyao, behaving overbearingly.',
  ],
  s0043: [
    'When Xianzhi reached the commandery, he memorialized at once to remove it.',
    'When Xianzhi reached the commandery, he memorialized at once to remove it.',
  ],
  s0044: [
    'Wendu later returned to bury his mother; commandery and county competed to attend the mourning, but Xianzhi did not acknowledge it.',
    'Wendu later returned to bury his mother; commandery and county competed to attend mourning, but Xianzhi did not acknowledge it.',
  ],
  s0045: [
    'Wendu deeply resented this but in the end could not harm him.',
    'Wendu deeply resented this but in the end could not harm him.',
  ],
  s0046: [
    'He was transferred to Chief Clerk of the Prince of Baling in the Southern General of the Gentlemen, with additional title General Who Establishes Might and Acting Governor of Wuzhou.',
    'He was transferred to Chief Clerk of the Prince of Baling in the Southern General of the Gentlemen, with additional title General Who Establishes Might and acting governor of Wuzhou.',
  ],
  s0047: [
    'At the time the Minister of Works, Prince of Jingling, established garrisons on the borders of Xuancheng, Lincheng, and Dingling counties, enclosing mountains and marshes for hundreds of li and forbidding the people firewood and gathering—Xianzhi firmly memorialized that this could not be, his words very blunt and direct.',
    'The Minister of Works, Prince of Jingling, enclosed mountains and marshes for hundreds of li and forbade firewood—Xianzhi firmly memorialized that this could not be, his words very blunt.',
  ],
  s0048: [
    'The Prince replied: "Without you I would not have heard this virtuous word."',
    'The Prince replied: "Without you I would not have heard this virtuous word."',
  ],
  s0049: ['He at once ordered no prohibition.', 'He at once ordered no prohibition.'],
  s0050: [
    'He was transferred to Attendant of the Yellow Gate and concurrently Director in the Ministry of Personnel Section.',
    'He was transferred to Attendant of the Yellow Gate and concurrently Director in the Ministry of Personnel Section.',
  ],
  s0051: [
    'In Song times his grandfather Guan had once served in the Ministry of Personnel; in the courtyard he planted a fine tree and told people: "I am planting this for Xianzhi."',
    'In Song times his grandfather Guan had served in the Ministry of Personnel; in the courtyard he planted a fine tree and said: "I am planting this for Xianzhi."',
  ],
  s0052: ['At this time Xianzhi indeed held that office.', 'At this time Xianzhi indeed held that office.'],
  s0053: [
    'He went out as Chief Clerk of the General Who Punishes the Barbarians and Acting Governor of Southern Yanzhou, and encountered mourning for his mother.',
    'He went out as Chief Clerk of the General Who Punishes the Barbarians and acting governor of Southern Yanzhou, and encountered mourning for his mother.',
  ],
  s0054: [
    'When mourning ended, in the Jianwu era he was again appointed Attendant of the Yellow Gate and Colonel of the Footsoldiers.',
    'When mourning ended, in Jianwu he was again appointed Attendant of the Yellow Gate and Colonel of the Footsoldiers.',
  ],
  s0055: [
    'Before he took the appointment he was transferred to Junior Mentor of the Heir Apparent and concurrently Rectifier of Wu district.',
    'Before he took the appointment he was transferred to Junior Mentor of the Heir Apparent and concurrently Rectifier of Wu district.',
  ],
  s0056: [
    'He went out as General Who Pacifies the North and Administrator of Linchuan;',
    'He went out as General Who Pacifies the North and administrator of Linchuan;',
  ],
  s0057: [
    'before he went, the appointment was changed to General Who Assists the State and Administrator of Jinling.',
    'before he went, the appointment was changed to General Who Assists the State and administrator of Jinling.',
  ],
  s0058: [
    'Shortly afterward he fell ill and petitioned to return to his home village.',
    'Shortly afterward he fell ill and petitioned to return to his home village.',
  ],
  s0059: [
    'At the beginning of Yongyuan he was summoned as Minister of Justice but did not accept; he was appointed Administrator of Yuzhang.',
    'At the beginning of Yongyuan he was summoned as Minister of Justice but did not accept; he was appointed administrator of Yuzhang.',
  ],
  s0060: [
    'There was a chaste widow, Wan Xi, who widowed young without sons and served her parents-in-law with utmost filiality; her parents wished to force her to remarry but she swore she would rather die—Xianzhi bestowed silk and memorialized her integrity.',
    'Chaste widow Wan Xi, widowed young without sons, served her parents-in-law with utmost filiality; her parents wished to force remarriage but she swore to die—Xianzhi bestowed silk and memorialized her integrity.',
  ],
  s0061: [
    'In the second year of Zhongxing, when the righteous army pacified Jiankang, Gaozu was Governor of Yangzhou and summoned Xianzhi as Retainer of the Separate Chariot.',
    'In the second year of Zhongxing, when the righteous army pacified Jiankang, Gaozu was governor of Yangzhou and summoned Xianzhi as Retainer of the Separate Chariot.',
  ],
  s0062: [
    'By the time he arrived, Gaozu had already received the abdication; Xianzhi\'s wind ailment grew severe and he firmly asked to return to Wu.',
    'By the time he arrived, Gaozu had already received the abdication; Xianzhi\'s wind ailment grew severe and he firmly asked to return to Wu.',
  ],
  s0063: [
    'In the second year of Tianjian, he was appointed Grand Master of the Palace at his home.',
    'In the second year of Tianjian, he was appointed Grand Master of the Palace at his home.',
  ],
  s0064: [
    'Though Xianzhi had repeatedly governed commanderies, his assets did not amount to a dan of grain.',
    'Though Xianzhi had repeatedly governed commanderies, his assets did not amount to a dan of grain.',
  ],
  s0065: [
    'When he returned, his ring of walls could not keep out hunger and cold.',
    'When he returned, his ring of walls could not keep out hunger and cold.',
  ],
  s0066: ['In the eighth year he died at home, aged seventy-four.', 'In the eighth year he died at home, aged seventy-four.'],
  s0067: [
    'On his deathbed he made regulations and charged his sons, saying:',
    'On his deathbed he made regulations and charged his sons, saying:',
  ],
  s0068: [
    'Birth and entering death, death and leaving life—reason treats them like day and night.',
    'Birth and entering death, death and leaving life—reason treats them like day and night.',
  ],
  s0069: [
    'While alive one does not know whence one came; in death how can one know whither one goes?',
    'While alive one does not know whence one came; in death how can one know whither one goes?',
  ],
  s0070: [
    'What Yanling said—"The refined breath returns to Heaven, flesh and bone return to earth, and the soul\'s breath goes everywhere"—has good grounds.',
    'What Yanling said—"The refined breath returns to Heaven, flesh and bone to earth, and the soul\'s breath goes everywhere"—has good grounds.',
  ],
  s0071: [
    'Though obscure and hard to verify, in essentials it is not vain.',
    'Though obscure and hard to verify, in essentials it is not vain.',
  ],
  s0072: [
    'A span of a hundred years is swift as a galloping gap.',
    'A span of a hundred years is swift as a galloping gap.',
  ],
  s0073: [
    'I now prepare these final regulations in advance; after my eyes close, think on them and follow them—do not go against my will.',
    'I now prepare these final regulations in advance; after my eyes close, follow them—do not go against my will.',
  ],
  s0074: [
    'Zhuang Zhou and Tantai Mieming were men who had attained life;',
    'Zhuang Zhou and Tantai Mieming had attained life;',
  ],
  s0075: [
    'Wang Sun and Shi An were men who had corrected vulgar custom.',
    'Wang Sun and Shi An corrected vulgar custom.',
  ],
  s0076: [
    'In advance I do not reach attainment; in withdrawal I have nothing to correct.',
    'In advance I do not reach attainment; in withdrawal I have nothing to correct.',
  ],
  s0077: [
    'I have always held that the mid-dynasty system accords with reason and satisfies feeling.',
    'I have always held that the mid-dynasty system accords with reason and satisfies feeling.',
  ],
  s0078: [
    'Clothing sufficient for the body shows one does not violate ritual;',
    'Clothing sufficient for the body shows one does not violate ritual;',
  ],
  s0079: [
    'a coffin sufficient for the clothing is enough to cover stench.',
    'a coffin sufficient for the clothing is enough to cover stench.',
  ],
  s0080: ['What goes into the coffin—nothing is needed.', 'What goes into the coffin—nothing is needed.'],
  s0081: [
    'Carry on a bier-cart, cover with coarse cloth—so people will not be disgusted.',
    'Carry on a bier-cart, cover with coarse cloth—so people will not be disgusted.',
  ],
  s0082: [
    'Emperor Ming of Han, though honored as Son of Heaven, still sacrificed with ladle-water, dried meat, and parched grain;',
    'Emperor Ming of Han, though Son of Heaven, still sacrificed with ladle-water, dried meat, and parched grain;',
  ],
  s0083: [
    'Fan Shiyun, lofty as a martyr, also offered cold water and dry rice.',
    'Fan Shiyun, lofty as a martyr, also offered cold water and dry rice.',
  ],
  s0084: [
    'How much more for a man low and mediocre like me—can he not restrain his feelings?',
    'How much more for a low and mediocre man like me—can he not restrain his feelings?',
  ],
  s0085: [
    'Mourning is easy but dwelling in grief is hard—this is the affection of kin for kin;',
    'Mourning is easy but dwelling in grief is hard—this is kin affection;',
  ],
  s0086: [
    'ritual extravagant but dwelling in frugality is somewhat attainable according to my will.',
    'ritual extravagant but dwelling in frugality is somewhat attainable according to my will.',
  ],
  s0087: [
    'Do not constantly set out spirit mats; stop at lighting incense lamps, so those who would mourn have something to rely on.',
    'Do not constantly set out spirit mats; stop at lighting incense lamps, so mourners have something to rely on.',
  ],
  s0088: [
    'On the first and fifteenth and on mourning anniversaries, one may provisionally set a small couch and briefly place mats and seats, offering only plain food—do not use sacrificial animals.',
    'On the first and fifteenth and mourning anniversaries, provisionally set a small couch and briefly place mats, offering only plain food—do not use sacrificial animals.',
  ],
  s0089: [
    'Seasonal sacrifices to ancestors—noble and base alike do not omit them.',
    'Seasonal sacrifices to ancestors—noble and base alike do not omit them.',
  ],
  s0090: [
    'Full provision is hard to prepare and often leads to neglect.',
    'Full provision is hard to prepare and often leads to neglect.',
  ],
  s0091: [
    'Sacrificing to forebears has its old canon—it cannot be wanting.',
    'Sacrificing to forebears has its old canon—it cannot be wanting.',
  ],
  s0092: [
    'From me downward, sacrifice only with vegetables, grain, seasonal fruit—do not be like the upper generations.',
    'From me downward, sacrifice only with vegetables, grain, and seasonal fruit—do not be like upper generations.',
  ],
  s0093: [
    'Show the sons and grandsons so the four seasons do not forget their kin.',
    'Show sons and grandsons so the four seasons do not forget their kin.',
  ],
  s0094: [
    'Confucius said: "Even with vegetable broth and melon sacrifice, one must be as if present."',
    'Confucius said: "Even with vegetable broth and melon sacrifice, one must be as if present."',
  ],
  s0095: [
    'The root values sincere reverence—how could one seek full provision?',
    'The root values sincere reverence—how could one seek full provision?',
  ],
  s0096: [
    'He authored poems, fu, inscriptions, eulogies, and several tens of chapters of the Record of Hengyang Commandery.',
    'He authored poems, fu, inscriptions, eulogies, and several tens of chapters of the Record of Hengyang Commandery.',
  ],
  s0097: ['Tao Jizhi', 'Tao Jizhi'],
  s0098: [
    'Tao Jizhi was a man of Moling in Danyang.',
    'Tao Jizhi came from Moling in Danyang.',
  ],
  s0099: [
    'His grandfather Minzu was Song Inspector of Guangzhou.',
    'His grandfather Minzu was Song inspector of Guangzhou.',
  ],
  s0100: [
    'His father Jingren was Palace Attendant.',
    'His father Jingren was palace attendant.',
  ],
};

const targetPath = process.argv[2];
if (!targetPath) {
  console.error(
    'Usage: node translations/patches/patch_liangshu_052_b1.mjs <translation.json>'
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
