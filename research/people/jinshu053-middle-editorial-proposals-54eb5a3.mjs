// Draft only: print exact source-pinned before/after proposals; never write canonical data.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const ref='54eb5a3';
const fullRef=execFileSync('git',['rev-parse',ref],{encoding:'utf8'}).trim();
const raw=execFileSync('git',['show',`${ref}:data/jinshu/053.json`]);
const chapter=JSON.parse(raw);
const units=chapter.content.flatMap(part=>part.sentences??[]);
// Each value is a draft; another conversation must review it before use.
const edits={
 s0066:{idiomatic:'In the first month of the following year, Empress Jia again had a palace eunuch confess that he had intended to rebel with the crown prince.'},
 s0067:{idiomatic:'An edict circulated the eunuch’s confession among the dukes and ministers.'},
 s0068:{idiomatic:'Jia also sent Dan with a thousand soldiers to escort the crown prince to a separate compound of the Xuchang palace, and ordered Liu Zhen, an imperial censor, to guard him with a tally of authority.'},
 s0071:{literal:'“South wind” was the empress’s name.',idiomatic:'“South wind” referred to the empress’s name.'},
 s0073:{idiomatic:'When the crown prince was first deposed, his consort’s father, Wang Yan, petitioned for their divorce.'},
 s0075:{idiomatic:'Though I was not born to the empress, I served her as I would my own mother.'},
 s0076:{idiomatic:'Since becoming crown prince, I have been confined by imperial orders and have not been allowed to see my mother.'},
 s0077:{literal:'Since the Lady of Yicheng died, I have received no comfort or care and have constantly sat alone in an empty room.',idiomatic:'Since the Lady of Yicheng died, I have received no comfort or care and have constantly sat alone in an empty room.'},
 s0078:{idiomatic:'In the twelfth month of last year, Daowen’s illness became grave, and the bond between father and son made me grieve deeply for him.'},
 s0079:{idiomatic:'At that time I petitioned the throne to bestow an honorific title on him, but my request was refused.'},
 s0080:{idiomatic:'When his illness became grave, I sought blessings for him; I had no evil intention.'},
 s0081:{idiomatic:'After Daowen fell ill, the empress sent attendants to see me three times, saying, “His Majesty has summoned you.”'},
 s0082:{idiomatic:'On the evening of the twenty-eighth, a short letter arrived, marked as an Eastern Palace dispatch, saying that His Majesty wished to see me.'},
 s0083:{idiomatic:'I immediately prepared a memorial requesting permission to enter.'},
 s0084:{idiomatic:'Early on the twenty-ninth, I entered and saw His Majesty; shortly afterward I was sent to the empress’s quarters.'},
 s0085:{literal:'The empress’s attendant Chen Wu told me, “The empress has been unwell and vomited this morning.”',idiomatic:'The empress’s attendant Chen Wu told me, “The empress has been unwell and vomited this morning.”'},
 s0086:{literal:'They made me sit and wait in an empty room.',idiomatic:'They made me sit and wait in an empty room.'},
 s0088:{literal:'The empress called to Chen Wu from a distance: “Yesterday His Majesty ordered wine and jujubes to be given to the crown prince.”',idiomatic:'The empress called to Chen Wu from a distance: “Yesterday His Majesty ordered wine and jujubes to be given to the crown prince.”'},
 s0089:{literal:'Chen Wu then brought three sheng of wine and a large tray of jujubes to me and made me drink and eat them all.',idiomatic:'Chen Wu brought me three sheng of wine and a large tray of jujubes and made me finish them.'},
 s0090:{idiomatic:'I had never been accustomed to drinking wine, so I sent Chen Wu to explain that I could not manage three sheng.'},
 s0091:{idiomatic:'The empress called from a distance, “You have often taken wine gladly before His Majesty. Why will you not drink it now?”'},
 s0092:{idiomatic:'“His Majesty has given you wine to help Daowen recover.”'},
 s0093:{idiomatic:'I replied to the empress, “His Majesty gave me wine on one occasion, and I did not dare refuse it; but even in a whole day I do not drink three sheng.”'},
 s0094:{idiomatic:'“Besides, I have not eaten, and I fear I cannot bear it.”'},
 s0095:{idiomatic:'“And I have not yet seen Your Highness; if I drink this, I may become disoriented.”'},
 s0096:{idiomatic:'Chen Wu relayed another message: “How unfilial!”'},
 s0097:{idiomatic:'“His Majesty gives you wine, and you will not drink it. Is there something bad in it?”'},
 s0098:{literal:'I managed to drink two sheng; with one sheng left, I asked to take it back to the Eastern Palace and finish it there.',idiomatic:'I managed to drink two sheng. With one sheng left, I asked to take it back to the Eastern Palace and finish it there.'},
 s0099:{literal:'Under pressure and with no choice, I drank another sheng.',idiomatic:'Pressed and unable to refuse, I drank another sheng.'},
 s0100:{literal:'After drinking, I became confused and no longer knew what I was doing.',idiomatic:'After drinking, I became confused and no longer knew what I was doing.'},
 s0101:{idiomatic:'Soon a young maid brought a sealed case and said, “An edict orders you to copy this document.”'},
 s0102:{idiomatic:'I sprang up in alarm and saw one sheet of white paper and one of green paper.'},
 s0103:{idiomatic:'They urged me on, saying, “His Majesty is waiting.”'},
 s0105:{idiomatic:'They hurried me so I could not look it over again; I truly did not realize the significance of the words on the paper.'},
 s0106:{idiomatic:'“Parents are one’s closest kin, and I did not doubt them. This is how it happened: I have truly been falsely accused, and I trust that everyone will see the truth.”'},
 s0107:{idiomatic:'The crown prince had been deposed for no fault of his own, and people were indignant.'},
 s0108:{literal:'Sima Ya, a commandant of the Right Guard and a distant member of the imperial clan, and Xu Chao, a commandant of the regular attendants, both enjoyed the crown prince’s favor. Deeply grieved, they spoke to Sun Xiu, an adviser to Sima Lun, Prince of Zhao: “The state has no rightful heir, the altars of soil and grain will be endangered, and disaster will surely arise for the great ministers.”',idiomatic:'Sima Ya, a Right Guard commandant and distant member of the imperial clan, and Xu Chao, a commandant of the regular attendants, were both favored by the crown prince. Deeply grieved, they told Sun Xiu, an adviser to Sima Lun, Prince of Zhao: “The state has no rightful heir; the dynasty is in danger, and disaster will surely come upon the great ministers.”'},
 s0109:{idiomatic:'“You serve the empress and are close to her; everyone says you knew of the crown prince’s deposition beforehand. If trouble breaks out, disaster will certainly reach you.”'},
 s0111:{literal:'Xiu told Sima Lun, Prince of Zhao, who readily accepted the plan.',idiomatic:'Sun Xiu told Sima Lun, Prince of Zhao, who readily accepted the plan.'},
 s0112:{literal:'Once the plan was settled, Xiu said to Lun, “The crown prince is by nature strong and fierce; if he achieves his aims, he will surely give free rein to his disposition.”',idiomatic:'Once the plan was settled, Sun Xiu said to Lun, “The crown prince is strong and fierce by nature; if he achieves his aims, he will surely give free rein to his disposition.”'},
 s0113:{idiomatic:'“You have long served Empress Jia, and people in the streets all call you a partisan of the Jia family.”'},
 s0114:{idiomatic:'“Even if you now seek to do the crown prince a great service, though he might suppress his old resentment, he will surely not reward you. He will think you changed sides under pressure from public opinion only to escape punishment.”'},
 s0115:{idiomatic:'“At the first pretext, you still will not escape execution.”'},
 s0118:{idiomatic:'Sun Xiu then spread a misleading report that men in the palace intended to depose Empress Jia and bring the crown prince back.'},
 s0119:{idiomatic:'When Empress Jia heard this, she was frightened and ordered the chief imperial physician Cheng Ju to prepare croton and apricot-kernel pills.'},
 s0120:{idiomatic:'In the third month, a forged edict sent the palace eunuch Sun Lü to Xuchang to kill the crown prince.'},
 s0121:{idiomatic:'The crown prince had earlier feared being poisoned and always cooked his own food in front of himself.'},
 s0122:{idiomatic:'Sun Lü told Liu Zhen, who moved the crown prince to a small compound and cut off his food. People in the palace nevertheless passed food to him over the wall.'},
 s0123:{idiomatic:'Sun Lü then forced the medicine on the crown prince, who refused to take it. When the prince went to the privy, Sun Lü beat him to death with a medicine pestle; his cries were heard outside.'},
 s0124:{idiomatic:'He was twenty-three by traditional reckoning.'},
 s0127:{idiomatic:'“That wish has come to nothing, deepening my grief and regret.”'},
 s0128:{idiomatic:'“Though Yu’s crime was very great, he was still a descendant of the imperial house. I cannot help pitying him if he is buried as a commoner, and I especially beg imperial grace to grant him the rites of a prince.”'},
 s0130:{idiomatic:'An edict ordered that he be buried with the rites of the Prince of Guangling.'}
};
const proposals=Object.entries(edits).map(([id,fields])=>{
 const unit=units.find(row=>row.id===id);if(!unit)throw Error(`Missing ${id}`);
 const translation=unit.translations.find(row=>row.lang==='en');if(!translation)throw Error(`Missing English ${id}`);
 return {id,zh:unit.zh,fields:Object.entries(fields).map(([field,after])=>({field,before:translation[field],after}))};
});
process.stdout.write(JSON.stringify({ref:fullRef,sourcePath:'data/jinshu/053.json',sourceByteHash:`sha256:${createHash('sha256').update(raw).digest('hex')}`,reviewer:'/root/chapter_path',scope:'s0066–s0130',status:'draft; independent editorial review required',proposals},null,2)+'\n');
