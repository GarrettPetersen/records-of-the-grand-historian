#!/usr/bin/env node
/** Batch 5: s0401–s0490 (Jiutangshu ch.005, Gaozong 2 — grand heir, Hongdao, death, appraisal) */
import { readFileSync, writeFileSync } from 'fs';

const T = {
  s0401: {
    literal:
      'Director of the Ministry of Personnel Wang Fangqing said: "According to the Rites of Zhou, when there is a legitimate son there is no legitimate grandson.',
    idiomatic:
      'Personnel director Wang Fangqing said: "The Zhou Rites hold that with a legitimate son there is no legitimate grandson.',
  },
  s0402: {
    literal:
      'From Han and Wei onward, while the crown prince lived no imperial grandson was installed—only princes were enfeoffed.',
    idiomatic:
      'From Han and Wei on, while a crown prince lived no imperial grandson was named—only princes were enfeoffed.',
  },
  s0403: {
    literal:
      'Jin installed Minhuai Crown Prince\'s son Yu as imperial grandson, and Qi installed Wenhuai Crown Prince\'s son Zhaoye as imperial grandson, and each dwelt in the Eastern Palace;',
    idiomatic:
      'Jin made Minhuai\'s son Yu imperial grandson and Qi made Wenhuai\'s son Zhaoye imperial grandson, each dwelling in the eastern palace;',
  },
  s0404: {
    literal: 'yet to install an imperial grandson while the crown prince still lived has no precedent.',
    idiomatic: 'but to name an imperial grandson while the crown prince still lives has no precedent."',
  },
  s0405: {
    literal: 'The emperor said: "If I make the precedent myself, may I?"',
    idiomatic: 'The emperor said: "May I make the precedent myself?"',
  },
  s0406: {
    literal: 'He said: "You may."',
    idiomatic: 'He answered: "You may."',
  },
  s0407: {
    literal: 'Yet in the end no bureau staff was appointed.',
    idiomatic: 'In the end he appointed no bureau staff.',
  },
  s0408: {
    literal: 'That spring the interior suffered drought; the sun\'s color was like ochre.',
    idiomatic: 'That spring drought struck the interior; the sun looked ochre.',
  },
  s0409: {
    literal: 'Fourth month, on the jiazi new moon: there was a solar eclipse.',
    idiomatic: 'On the jiazi new moon of the fourth month the sun was eclipsed.',
  },
  s0410: {
    literal: 'On bingyin he proceeded to the eastern capital.',
    idiomatic: 'On bingyin he went to the eastern capital.',
  },
  s0411: {
    literal:
      'The crown prince remained at the capital as regent; Liu Ren\'gui, Pei Yan, Xue Yuanchao, and others were ordered to assist him.',
    idiomatic:
      'The crown prince stayed in the capital; Liu Ren\'gui, Pei Yan, and Xue Yuanchao were to assist him.',
  },
  s0412: {
    literal:
      'Because grain was costly he reduced the escort; many soldiers and commoners following died by the roadside.',
    idiomatic:
      'Grain was dear; he cut the escort, and many followers died on the road.',
  },
  s0413: {
    literal:
      'On xinwei Pei Xingjian was made Mobile Grand General of the Golden Tooth Circuit; with Generals Yan Huaidan and others the three circuit armies marched separately against the ten-clan Turk Ashina Chebo.',
    idiomatic:
      'On xinwei Pei Xingjian became mobile commander on the Golden Tooth circuit; with Yan Huaidan and others three columns marched against the ten-clan Turk Ashina Chebo.',
  },
  s0414: {
    literal: 'Xingjian died before he could set out.',
    idiomatic: 'Xingjian died before he marched.',
  },
  s0415: {
    literal:
      'Deputy Protector-General of Anxi Wang Fangyi defeated Chebo and Yanmian; the Western Regions were pacified.',
    idiomatic:
      'Wang Fangyi, deputy protector of Anxi, defeated Chebo and Yanmian and pacified the west.',
  },
  s0416: {
    literal: 'On wuyin he halted at Purple Cassia Palace in Mianchi.',
    idiomatic: 'On wuyin he stopped at Purple Cassia Palace in Mianchi.',
  },
  s0417: {
    literal: 'On yiyou he arrived at the eastern capital.',
    idiomatic: 'On yiyou he reached the eastern capital.',
  },
  s0418: {
    literal:
      'On dinghai Vice Director Guo Daiju, Vice Director of War Cen Changqian, Secretariat Vice Director Guo Zhengyi, and Vice Director of Personnel Wei Xuantong were all made Fellows of the Secretariat-Chancellery who receive and execute memorials and deliberate as Chief Ministers.',
    idiomatic:
      'On dinghai Guo Daiju, Cen Changqian, Guo Zhengyi, and Wei Xuantong became chancellery fellows who received memorials and deliberated as chief ministers.',
  },
  s0419: {
    literal:
      'The emperor told Participant in Governance Cui Zhiwen: "Daiju and the others have shallow experience; let them first hear state affairs—they may not yet share your title."',
    idiomatic:
      'He told Cui Zhiwen: "Daiju and the rest are new; let them hear affairs first—they are not yet your equals in title."',
  },
  s0420: {
    literal:
      'From this, those outside the secretariat of fourth rank and below who joined governance were called "Chief Minister."',
    idiomatic:
      'After this, fourth-rank outsiders who joined governance were called "chief minister."',
  },
  s0421: {
    literal: 'Fifth month, renyin: a Director of the Eastern Capital Park was established.',
    idiomatic: 'On renyin in the fifth month he created a director for the eastern capital parks.',
  },
  s0422: {
    literal:
      'From bingwu onward rain fell day after day; the Luo River overflowed, wrecking Tianjin Bridge and the Central Bridge and the Lide, Hongjiao, Jingxing, and other wards; more than a thousand households were drowned.',
    idiomatic:
      'From bingwu rain fell daily; the Luo flooded, destroying Tianjin and Central bridges and the Lide, Hongjiao, and Jingxing wards—over a thousand homes drowned.',
  },
  s0423: {
    literal:
      'Sixth month: the interior at first had rain and wheat was waterlogged; afterward came drought; in Jingzhao, Qi, and Long, locusts ate the seedlings to the root; moreover pestilence killed many—corpses lay piled on the roads; an edict ordered local offices to bury them.',
    idiomatic:
      'In the sixth month early rain ruined wheat, then drought; locusts stripped Jingzhao, Qi, and Long; plague piled corpses on the roads—offices were ordered to bury the dead.',
  },
  s0424: {
    literal: 'On dingchou Su Liangsi, prefect of Qi, was made Governor of Yong.',
    idiomatic: 'On dingchou Qi prefect Su Liangsi became governor of Yong.',
  },
  s0425: {
    literal: 'In the capital people ate one another; bandits ran wild.',
    idiomatic: 'In the capital men ate the dead and bandits roamed free.',
  },
  s0426: {
    literal:
      'Seventh month, autumn, jihai: Fengtian Palace was built on the south slope of Mount Song; Songyang County was also established.',
    idiomatic:
      'On jihai in the seventh autumn month he built Fengtian Palace on Mount Song\'s south slope and founded Songyang County.',
  },
  s0427: {
    literal: 'Wanquan Palace was also built at Lantian.',
    idiomatic: 'He also built Wanquan Palace at Lantian.',
  },
  s0428: {
    literal: 'On gengshen Prince Lingling Ming died.',
    idiomatic: 'On gengshen Prince Lingling Ming, exiled to Qian, died.',
  },
  s0429: {
    literal: 'That autumn great floods struck Shandong; the people starved.',
    idiomatic: 'That autumn Shandong flooded and the people starved.',
  },
  s0430: {
    literal: 'Tufan raided Zhe, Song, and Yi prefectures.',
    idiomatic: 'Tibet raided Zhe, Song, and Yi.',
  },
  s0431: {
    literal: 'Tenth month, winter, jiazi: the capital was shaken by earthquake.',
    idiomatic: 'On jiazi in the tenth winter month the capital quaked.',
  },
  s0432: {
    literal: 'On bingyin Vice Director Liu Jingxian became Chief Minister.',
    idiomatic: 'On bingyin vice director Liu Jingxian became chief minister.',
  },
  s0433: {
    literal: 'Twelfth month: South India and Khotan each presented tribute.',
    idiomatic: 'In the twelfth month south India and Khotan sent tribute.',
  },
  s0434: {
    literal:
      'Turk remnant Ashina Gulolu and others gathered the scattered and held Black Sand City, raiding the north of Bingzhou.',
    idiomatic:
      'Turk remnant Gulolu gathered survivors at Black Sand and raided Bing\'s north.',
  },
  s0435: {
    literal:
      'First year of Hongdao, second year, spring, first month, on the jiawu new moon: he visited Fengtian Palace and sent envoys to sacrifice at Mount Song, Mount Shaoshi, Mount Ji, Mount Juci, and other mountains and at the shrines of the Queen Mother of the West, Qimu, Chao Fu, Xu You, and others.',
    idiomatic:
      'Hongdao 2, on the jiawu new moon of the first spring month: he went to Fengtian Palace and sent envoys to sacrifice at Mount Song, Shaoshi, Ji, Juci, and the shrines of the Queen Mother of the West, Qimu, Chao Fu, and Xu You.',
  },
  s0436: {
    literal:
      'Second month, jiawu: Luozhou Chief Secretary Li Zhongxuan became Director of the Imperial Clan.',
    idiomatic:
      'On jiawu in the second month Luozhou chief secretary Li Zhongxuan became director of the imperial clan.',
  },
  s0437: {
    literal: 'On gengwu the Turks raided the borders of Ding and Ji prefectures.',
    idiomatic: 'On gengwu Turks raided Ding and Ji.',
  },
  s0438: {
    literal: 'On jimao Grand General of the Left Victorious Army Xue Rengui died.',
    idiomatic: 'On jimao left victor army grand general Xue Rengui died.',
  },
  s0439: {
    literal:
      'Third month, gengyin: Turks Gulolu and Ashide Yuanzhen besieged the Protectorate General of the Pacified North.',
    idiomatic:
      'On gengyin in the third month Gulolu and Ashide Yuanzhen besieged the pacified north protectorate.',
  },
  s0440: {
    literal: 'On bingwu a comet appeared north of the Wagon; after twenty-five days it vanished.',
    idiomatic: 'On bingwu a comet appeared north of the Wagon and faded after twenty-five days.',
  },
  s0441: {
    literal: 'On guichou Director of the Secretariat Cui Zhiwen died.',
    idiomatic: 'On guichou secretariat director Cui Zhiwen died.',
  },
  s0442: {
    literal: 'Fourth month, summer, jisi: he returned to the eastern capital.',
    idiomatic: 'On jisi in the fourth summer month he returned to the eastern capital.',
  },
  s0443: {
    literal:
      'On jiashen the tribal chief Bai Tieyu of Sui held Chengping County in revolt; General Cheng Wuting was ordered to campaign against him.',
    idiomatic:
      'On jiashen Sui tribal chief Bai Tieyu rebelled at Chengping; Cheng Wuting was sent against him.',
  },
  s0444: {
    literal:
      'Fifth month, gengyin: he visited Fragrant Cassia Palace; rain fell; he returned to the eastern capital.',
    idiomatic:
      'On gengyin in the fifth month he went to Fragrant Cassia Palace, rain drove him back to the eastern capital.',
  },
  s0445: {
    literal:
      'The Turks raided Wei Prefecture and killed Prefect Li Sijian; Fengzhou Governor Cui Zhibian led troops out from Chaona Mountain to strike them and was defeated; they then raided Lan Prefecture.',
    idiomatic:
      'Turks raided Wei, killed prefect Li Sijian, beat Fengzhou governor Cui Zhibian at Chaona Mountain, then raided Lan.',
  },
  s0446: {
    literal:
      'Seventh month, autumn, jichou: Imperial Grandson Chongfu was enfeoffed Prince of Tangchang.',
    idiomatic:
      'On jichou in the seventh autumn month imperial grandson Chongfu was made Prince of Tangchang.',
  },
  s0447: {
    literal: 'On jiachen Prince of Xiang Lun was changed to Prince of Yu and renamed Dan.',
    idiomatic: 'On jiachen Prince Xiang Lun became Prince Yu and took the name Dan.',
  },
  s0448: {
    literal: 'On jichou Prince of Tangchang Chongfu was made capital regent with Liu Ren\'gui as deputy.',
    idiomatic: 'On jichou Prince Tangchang Chongfu was made capital regent with Liu Ren\'gui as deputy.',
  },
  s0449: {
    literal: 'The crown prince was summoned to the eastern capital.',
    idiomatic: 'The crown prince was called to the eastern capital.',
  },
  s0450: {
    literal:
      'On jisi the Yellow River overflowed and destroyed Heyang city; the water stood five chi higher than inside the walls; north to Yankan every dwelling was swept away; north and south banks were both wrecked.',
    idiomatic:
      'On jisi the Yellow River burst Heyang; water stood five chi above the streets; north to Yankan every house was swept away on both banks.',
  },
  s0451: {
    literal: 'On gengxu Mars entered the Ghost Lodge and trespassed against Zhi.',
    idiomatic: 'On gengxu Mars entered the Ghost and struck Zhi.',
  },
  s0452: {
    literal: 'Eleventh month: the crown prince came to court.',
    idiomatic: 'In the eleventh month the crown prince arrived.',
  },
  s0453: {
    literal: 'On guihai he visited Fengtian Palace.',
    idiomatic: 'On guihai he went to Fengtian Palace.',
  },
  s0454: {
    literal:
      'At this time, after the Heavenly Empress had herself performed fengshan at Mount Tai, she urged the emperor to perform fengshan at the Central Peak.',
    idiomatic:
      'By then the empress, having herself completed fengshan at Tai, pressed him to perform fengshan at the Central Peak.',
  },
  s0455: {
    literal:
      'Whenever edicts and ritual protocols were drafted, famine or border alarms halted the plan.',
    idiomatic:
      'Each time rites were drafted, famine or frontier crisis stopped them.',
  },
  s0456: {
    literal: 'Now the Central Peak rites were resumed, but the emperor\'s illness halted them.',
    idiomatic: 'Now the central peak rites resumed, but his illness stopped them again.',
  },
  s0457: {
    literal:
      'The emperor suffered unbearable heaviness of the head; Attending Physician Qin Minghe said: "Pricking the head to draw a little blood may cure it."',
    idiomatic:
      'His head ached unbearably; physician Qin Minghe said: "A slight prick to draw blood may cure it."',
  },
  s0458: {
    literal:
      'From behind the curtain the Heavenly Empress said: "This man should be executed—does he mean to draw blood from the sovereign\'s head?"',
    idiomatic:
      'From behind the curtain the empress said: "He should die—would he draw blood from the Son of Heaven\'s head?"',
  },
  s0459: {
    literal: 'The emperor said: "My head is heavy; bleeding may not be bad."',
    idiomatic: 'The emperor said: "My head is heavy; blood may yet help."',
  },
  s0460: {
    literal: 'They pricked the Hundred Meetings point; the emperor said: "My eyes are clear."',
    idiomatic: 'They pricked the Hundred Meetings; he said: "My eyes are clear."',
  },
  s0461: {
    literal:
      'On wuxu General Cheng Wuting was made Pacification Commissioner of the Pacified North Circuit to campaign as supreme commander against the mountain bandits Yuanzhen, Gulolu, Helu, and others.',
    idiomatic:
      'On wuxu Cheng Wuting became pacification commissioner on the pacified north circuit to crush Yuanzhen, Gulolu, Helu, and other bandits.',
  },
  s0462: {
    literal:
      'An edict ordered the crown prince to act as regent; Pei Yan, Liu Qixian, Guo Zhengyi, and others deliberated as chief ministers at the Eastern Palace.',
    idiomatic:
      'He put the crown prince in charge; Pei Yan, Liu Qixian, and Guo Zhengyi deliberated at the eastern palace.',
  },
  s0463: {
    literal: 'On dingwei he returned from Fengtian Palace to the eastern capital.',
    idiomatic: 'On dingwei he came back from Fengtian Palace to the eastern capital.',
  },
  s0464: {
    literal: 'The emperor was gravely ill; chancellors and below were all denied audience.',
    idiomatic: 'He was gravely ill; chancellors could not see him.',
  },
  s0465: {
    literal:
      'Twelfth month, jiyou: an edict changed the second year of Yongchun to the first year of Hongdao.',
    idiomatic:
      'On jiyou in the twelfth month Yongchun 2 became Hongdao 1.',
  },
  s0466: {
    literal:
      'When the amnesty was to be proclaimed the emperor wished to ascend Zetian Gate himself but could not mount his horse for shortness of breath; he therefore summoned the people before the hall to proclaim it.',
    idiomatic:
      'To proclaim the amnesty he meant to mount Zetian Gate but could not breathe well enough to ride; the people were gathered before the hall instead.',
  },
  s0467: {
    literal: 'When the rite was done he asked his attendants: "Are the people pleased?"',
    idiomatic: 'When it was done he asked: "Are the people glad?"',
  },
  s0468: {
    literal: 'They said: "The people receiving the pardon are all moved with joy."',
    idiomatic: 'They answered: "Every man under the pardon rejoices."',
  },
  s0469: {
    literal: 'The emperor said: "Though the common people rejoice, my life is in peril.',
    idiomatic: 'He said: "The people may rejoice, but my life hangs by a thread.',
  },
  s0470: {
    literal:
      'If Heaven and Earth and the spirits grant me another month or two to return to Chang\'an, I shall die without regret."',
    idiomatic:
      'Grant me a month or two to reach Chang\'an, and I will die content."',
  },
  s0471: {
    literal: 'That night the emperor died in Zhenguan Hall at the age of fifty-six.',
    idiomatic: 'That night he died in Zhenguan Hall, aged fifty-six.',
  },
  s0472: {
    literal:
      'The testamentary edict was proclaimed: "Burial after seven days; the crown prince shall succeed before the coffin.',
    idiomatic:
      'The testament ran: "Bury after seven days; let the crown prince succeed before the coffin.',
  },
  s0473: {
    literal: 'Garden-tomb regulations must be thrifty.',
    idiomatic: 'Keep the tomb plain.',
  },
  s0474: {
    literal: 'On military and state matters not decided, take the Heavenly Empress\'s ruling."',
    idiomatic: 'What state and army cannot settle, let the empress decide."',
  },
  s0475: {
    literal:
      'The ministers offered the posthumous title Emperor of Heaven the Great; the temple name was Gaozong.',
    idiomatic:
      'The ministers gave the posthumous title Emperor of Heaven the Great and temple name Gaozong.',
  },
  s0476: {
    literal: 'First year of Wenming, eighth month, gengyin: he was buried at Qianling.',
    idiomatic: 'Wenming 1, on gengyin of the eighth month, he was buried at Qianling.',
  },
  s0477: {
    literal:
      'Thirteenth year of Tianbao: the posthumous title was changed to Emperor of Heaven the Greatly Broad and Filial.',
    idiomatic:
      'In Tianbao 13 the posthumous title became Emperor of Heaven the Greatly Broad and Filial.',
  },
  s0478: {
    literal:
      '[Historian\'s appraisal] The historian says: When the Great Emperor was still heir in the fief, he was praised as a man of mature years;',
    idiomatic:
      '【Historian\'s appraisal】 The historian writes: In the fief the heir was called a man of mature years;',
  },
  s0479: {
    literal: 'once he ascended the imperial throne, he suddenly was not the same bright man.',
    idiomatic: 'on the throne he was suddenly no longer that bright man.',
  },
  s0480: {
    literal:
      'An open breast seemed to take in remonstrance like fish-scales; his edicts were no different from fanning the heat.',
    idiomatic:
      'He seemed to welcome remonstrance, his edicts like cooling the fevered;',
  },
  s0481: {
    literal: 'once desire was loosed within the curtain, he soon neglected the foundation of rule.',
    idiomatic: 'then desire behind the curtain made him neglect the state\'s base.',
  },
  s0482: {
    literal: 'Believing the flattery of wheat-measure, the empress was poisoned;',
    idiomatic: 'He believed wheat-measure slander and the empress was poisoned;',
  },
  s0483: {
    literal: 'heeding the false tale of Zhao Shi, the empress\'s brother died with a grievance.',
    idiomatic: 'he heard Zhao Shi\'s lies and the empress\'s brother died wronged.',
  },
  s0484: {
    literal: 'The loyal thereafter shrank their shoulders; villains thereby got their will.',
    idiomatic: 'Loyal men shrank; villains had their way.',
  },
  s0485: {
    literal: 'In the end the imperial branches were slaughtered to the last and the altars became ruins.',
    idiomatic: 'At last the imperial kin were slaughtered and the altars fell to ruin.',
  },
  s0486: {
    literal:
      'What the ancients called "one man raises a state, the wise of old ruined by the foolish after"—how true!',
    idiomatic:
      'So the ancients said one man can raise a state and the wise be undone by fools after—true indeed!',
  },
  s0487: {
    literal: '[Eulogy] The eulogy says: Riding Wen\'s great enterprise, he barely kept the seat.',
    idiomatic: '【Eulogy】 The eulogy says: He rode Wen\'s great work and barely kept the seat.',
  },
  s0488: {
    literal: 'Fengshan and worship of Heaven—his virtue did not match.',
    idiomatic: 'He fengshan and worshipped Heaven, yet his virtue was not equal to the rite.',
  },
  s0489: {
    literal: 'He housed arms in the bedchamber and built halls until they fell.',
    idiomatic: 'He kept arms by the bed and built halls until they crashed down.',
  },
  s0490: {
    literal: 'From the womb of calamity the state was brought to ruin.',
    idiomatic: 'From calamity\'s womb the state was ruined.',
  },
};

const CHAPTER_PATH = 'data/jiutangshu/005.json';
const TRANS_PATH = 'translations/current_translation_jiutangshu.json';
const START = 401;
const END = 490;

function extractRange(chapterPath, startN, endN) {
  const data = JSON.parse(readFileSync(chapterPath, 'utf8'));
  const out = [];
  const seenIds = new Set();

  for (let blockIndex = 0; blockIndex < data.content.length; blockIndex++) {
    const block = data.content[blockIndex];
    let blockSentences = [];

    if (block.type === 'paragraph') {
      blockSentences = block.sentences;
    } else if (block.type === 'table_row') {
      blockSentences = block.cells.filter((cell) => cell.content && cell.content.trim());
    } else if (block.type === 'table_header') {
      blockSentences = block.sentences.filter((s) => s.zh && s.zh.trim());
    }

    for (const sentence of blockSentences) {
      const sentenceId = sentence.id;
      const n = parseInt(sentenceId.slice(1), 10);
      if (n < startN || n > endN) continue;

      let chineseText = '';
      if (block.type === 'paragraph' || block.type === 'table_header') {
        chineseText = sentence.zh;
      } else if (block.type === 'table_row') {
        chineseText = sentence.content;
      }

      let displayId = sentenceId;
      if (seenIds.has(displayId)) {
        displayId = `${sentenceId}@${blockIndex}`;
      }
      seenIds.add(displayId);

      out.push({
        id: displayId,
        originalId: sentenceId,
        blockIndex,
        chinese: chineseText,
        literal: '',
        idiomatic: '',
      });
    }
  }

  out.sort(
    (a, b) => parseInt(a.originalId.slice(1), 10) - parseInt(b.originalId.slice(1), 10)
  );
  return out;
}

const chapterPath = CHAPTER_PATH;
let trans = JSON.parse(readFileSync(TRANS_PATH, 'utf8'));
if (trans.metadata.chapter !== '005') {
  throw new Error(`Expected chapter 004, got ${trans.metadata.chapter}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const byOriginal = new Map(
  trans.sentences.map((s) => [s.originalId || s.id, s])
);

for (const id of expectedIds) {
  if (!byOriginal.has(id)) {
    const extracted = extractRange(chapterPath, START, END).find((s) => s.originalId === id);
    if (!extracted) throw new Error(`Missing ${id} in ${chapterPath}`);
    trans.sentences.push(extracted);
    byOriginal.set(id, extracted);
  }
}

trans.sentences.sort(
  (a, b) =>
    parseInt((a.originalId || a.id).slice(1), 10) -
    parseInt((b.originalId || b.id).slice(1), 10)
);

let applied = 0;
for (const s of trans.sentences) {
  const key = s.originalId || s.id;
  const pair = T[key];
  if (!pair) continue;
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${key}: literal and idiomatic must differ`);
  }
  s.literal = pair.literal;
  s.idiomatic = pair.idiomatic;
  applied++;
}

const missing = [...expectedIds].filter((id) => {
  const row = trans.sentences.find((s) => (s.originalId || s.id) === id);
  return !row || !row.idiomatic;
});
if (missing.length) {
  throw new Error(`Missing translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(TRANS_PATH, JSON.stringify(trans, null, 2) + '\n');
console.log(`Applied ${applied} translations (s0401–s0490)`);
