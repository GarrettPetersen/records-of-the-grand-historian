#!/usr/bin/env node
/** Batch 10: s0901–s1000 (Jiutangshu ch.020, Zhaozong annals) */
import { readFileSync, writeFileSync, existsSync } from 'fs';

const dataPath = 'data/jiutangshu/020.json';
const transPath = 'translations/current_translation_jiutangshu.json';
const START = 901;
const END = 1000;

function loadSentencesFromData() {
  const book = JSON.parse(readFileSync(dataPath, 'utf8'));
  const out = new Map();
  let blockIndex = 0;
  for (const block of book.content) {
    for (const s of block.sentences || []) {
      out.set(s.id, { chinese: s.zh, blockIndex });
    }
    blockIndex++;
  }
  return out;
}

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


const T = {
  s0901: {
    literal: 'Filial love can inherit the nine temples; respectful thrift can settle the myriad states; do not delight in roaming pleasure—will to heal the realm.',
    idiomatic: 'Let filial piety sustain the ancestral shrines and thrift steady the realm; shun idle pleasure and heal the world.',
  },
  s0902: {
    literal: 'Hundred ministers and scholars, aid this young lord, and raise the glorious achievements of our High Ancestor and Taizong.',
    idiomatic: 'Ministers, uphold this boy and carry forward the glory of Gaozu and Taizong.',
  },
  s0903: {
    literal: '” That day the spirit coffin was moved to the Western Palace; civil and military hundred officials in ranks offered condolence outside Yanhe Gate.',
    idiomatic: 'That day the coffin went to the Western Palace; officials lined up in mourning outside Yanhe Gate.',
  },
  s0904: {
    literal: 'At the noon hour that day, again forged and proclaimed the Empress Dowager’s order: “I meet an ill-starred house; sudden change has come; calamity rose from women’s quarters, the affair began among palace servants.',
    idiomatic: 'At noon they forged the Empress Dowager’s order: “Misfortune has struck the house; calamity rose from the women’s quarters and palace servants.”',
  },
  s0905: {
    literal: 'The emperor himself met the blade, already at the final hour, unable to leave testament; wailing is vainly keen.',
    idiomatic: 'The emperor fell by the blade, past speech—tears avail nothing.”',
  },
  s0906: {
    literal: 'He who fixes the great plan secures the altars; he who continues the great design chooses the worthy and bright; deliberation falls to the widow—must show a founding long policy.',
    idiomatic: 'Great plans secure the state; great designs need worthy men; the widow must show the way forward.”',
  },
  s0907: {
    literal: 'Inheriting the High Ancestor’s precious mandate, trusting the loyal rules of founding ministers, I reveal this to the limbs and trunk to correct the young and dim.',
    idiomatic: 'Trusting the founders’ loyal counsel, I turn to you ministers to guide this child.”',
  },
  s0908: {
    literal: 'Crown Prince Zhu should at once before the coffin take the imperial throne; mourning rites follow ancestral precedent; Secretariat and Chancellery act as before.',
    idiomatic: 'Crown Prince Zhu shall ascend before the coffin; mourning follows precedent; the Secretariat and Chancellery shall proceed as before.”',
  },
  s0909: {
    literal: 'Alas!',
    idiomatic: 'Alas!”',
  },
  s0910: {
    literal: 'Sending off the dead and serving the living—ancients’ model; acting now to repay the old—sages’ maxim.',
    idiomatic: 'Honor the dead and serve the living—that is the ancients’ model; repay old debts with present duty—that is the sages’ maxim.”',
  },
  s0911: {
    literal: 'Wiping tears I proclaim; words cannot express.',
    idiomatic: 'I wipe my tears and cannot say enough.”',
  },
  s0912: {
    literal: '” The emperor was then thirteen, begged to oversee the state for the moment, and at the coffin took the throne; Director of Rites Wang Pu should be ritual commissioner; Crown Prince’s household intendant Li Neng should announce mourning at the Sixteen Mansions.',
    idiomatic: 'The boy was thirteen; he begged to govern provisionally and took the throne at the coffin. Wang Pu was named ritual commissioner; Li Neng was sent to announce mourning at the princes’ mansions.',
  },
  s0913: {
    literal: 'On bingwu, the late emperor’s great encoffinment; the crown prince at the coffin took the imperial throne.',
    idiomatic: 'On bingwu the late emperor was encoffined and the crown prince formally ascended at the bier.',
  },
  s0914: {
    literal: 'On jiyou, forged edict: “Zhaoyi Li Jianrong and Lady Zhenyi of Hedong on the eleventh night of this month held blades in treason, fearing guilt and threw themselves into a well and died; they should be posthumously stripped as rebellious common women.',
    idiomatic: 'On jiyou a forged edict branded Li Jianrong and Lady Zhenyi traitors who stabbed the emperor on the eleventh, then drowned themselves in a well.',
  },
  s0915: {
    literal: '” After Jiang Xuanhui’s night assassination, at dawn he proclaimed outside: “Last night the emperor and the zhaoyi gambled; the emperor drunk, the zhaoyi killed him.',
    idiomatic: 'At dawn Jiang Xuanhui told the city the emperor had been drunk gambling with the zhaoyi and she had killed him.',
  },
  s0916: {
    literal: '” Blame was placed on palace women to cover the regicide.',
    idiomatic: 'Palace women took the blame to hide regicide.',
  },
  s0917: {
    literal: 'Yet Dragon Martial officers and soldiers widely passed the two ladies’ words among townspeople.',
    idiomatic: 'Yet Dragon Martial troops spread the two ladies’ dying words through the markets.',
  },
  s0918: {
    literal: 'Soon Shi Tai was used as Bian prefectural governor to reward regicide merit.',
    idiomatic: 'Soon Shi Tai was made prefect of Bin to reward the killers.',
  },
  s0919: {
    literal: 'On gengxu, the hundred officials memorialized requesting audience on government.',
    idiomatic: 'On gengxu the officials asked him to take up government.',
  },
  s0920: {
    literal: 'On jiayin, the Secretariat memorialized: “The emperor’s birth on the third day of the ninth month—request that day as the Qianhe festival.',
    idiomatic: 'On jiayin the Secretariat proposed the emperor’s birthday, ninth month third day, as the Qianhe festival.',
  },
  s0921: {
    literal: '” Approved.',
    idiomatic: 'Approved.',
  },
  s0922: {
    literal: 'On yichou, the hundred officials went to the Western Palace; encoffinment finished, mourning garments released.',
    idiomatic: 'On yichou officials went to the Western Palace; when encoffinment ended they left mourning dress.',
  },
  s0923: {
    literal: 'The emperor received the hundred officials in the west corridor of Chongxun Hall.',
    idiomatic: 'The emperor received them in Chongxun Hall’s west corridor.',
  },
  s0924: {
    literal: 'Secretariat note: “After releasing mourning garments on the twenty-fourth of this month, present names for routine audience every three days.',
    idiomatic: 'The Secretariat ordered routine audiences every three days after mourning dress ended on the twenty-fourth.',
  },
  s0925: {
    literal: '” On bingchen, edict: “I follow the Empress Dowager’s compassionate order: because the two departments’ transport funds have not come and officials’ salaries are much lacking, morning and evening frost is cold—deeply felt in my heart.',
    idiomatic: 'On bingchen an edict said the Empress Dowager, seeing salaries unpaid and frost biting, ordered relief.',
  },
  s0926: {
    literal: 'Order from the inner treasury square round silver 2,172 taels to relieve present civil and military regular attendees; entrust the Censorate to distribute by rank.',
    idiomatic: 'Two thousand one hundred seventy-two taels of silver from the inner treasury were to be split among attending officials by rank through the Censorate.',
  },
  s0927: {
    literal: '” That day, the emperor heard government.',
    idiomatic: 'That day the emperor held court.',
  },
  s0928: {
    literal: 'On dingsi, edict: Qianhe festival is still within mourning; inner Buddhist rites should stop.',
    idiomatic: 'On dingsi inner Buddhist rites for Qianhe were suspended for mourning.',
  },
  s0929: {
    literal: 'On wuwu, sent Minister of Justice Zhang Yi to announce mourning at Hezhong; Quanzhong wailed with full grief.',
    idiomatic: 'On wuwu Zhang Yi announced the death at Hezhong; Quanzhong wailed as if heartbroken.',
  },
  s0930: {
    literal: 'On gengshen, edict: “On Qianhe festival civil and military hundred officials, armies, commissioners, and circuit memorialists, per precedent set vegetarian feasts at temples—no slaughter, only wine, fruit, dried meat, and pickles allowed.',
    idiomatic: 'On gengshen Qianhe feasts at temples were ordered vegetarian—wine and preserves only, no slaughter.',
  },
  s0931: {
    literal: '” On xinyou, edict: “On the twenty-third day of the third month, the Jiahui festival.',
    idiomatic: 'On xinyou the Jiahui festival on the twenty-third of the third month was noted.',
  },
  s0932: {
    literal: 'Considering the late emperor’s immortal carriage ascended, the spirit hill will be divined, the spirit already roams heaven’s edge—the festival should cease among men.',
    idiomatic: 'With the late emperor’s spirit ascending and the tomb not yet chosen, human festivals should pause.',
  },
  s0933: {
    literal: 'Per precedent, the Jiahui festival should stop.',
    idiomatic: 'By precedent Jiahui was canceled.',
  },
  s0934: {
    literal: 'closing quotation mark',
    idiomatic: '(end of edict)',
  },
  s0935: {
    literal: 'On the first day of the ninth month, renxu; hundred officials in plain dress went to the western inner palace for audience, presenting names in condolence.',
    idiomatic: 'On renxu, ninth month’s first day, officials in white attended the western inner palace.',
  },
  s0936: {
    literal: 'On wuchen, the late emperor’s great felicity; hundred officials in plain dress attended the western inner palace.',
    idiomatic: 'On wuchen, at the great felicity rite, they attended again in white.',
  },
  s0937: {
    literal: 'On jisi, edict: Right Vice Director, Vice Director, Minister of Rites, Grand Councillor Pei Shu should be late emperor tomb ritual commissioner; Vice Director Dugu Sun tomb commissioner; Vice Minister of War Li Yan chariot commissioner; acting Henan governor Wei Zhen bridge-and-road commissioner; Court of Imperial Sacrifices director Li Keqin procession commissioner.',
    idiomatic: 'On jisi Pei Shu, Dugu Sun, Li Yan, Wei Zhen, and Li Keqin were named to the tomb commission.',
  },
  s0938: {
    literal: 'On gengwu, the emperor released mourning and followed auspicious day.',
    idiomatic: 'On gengwu the emperor left mourning for an auspicious day.',
  },
  s0939: {
    literal: 'Secretariat and Chancellery memorialized: “Considering Your Majesty brightly continues the precious design, inherits the great succession, teaching and the Way extend the former instruction, protection and trust truly come from the compassionate countenance.',
    idiomatic: 'The Secretariat praised his succession and noted he had not yet honored the empress dowager.',
  },
  s0940: {
    literal: 'Now rightly occupying the imperial dwelling, the lofty title is not yet honored.',
    idiomatic: 'He sat the throne but her title was still pending.',
  },
  s0941: {
    literal: 'Considering the late emperor’s empress mother oversaw the four seas, virtue crowned the six palaces—exalted respect should be corrected in a great name; reverent elevation should shine with sagely filial piety; we look up to honor as Empress Dowager.',
    idiomatic: 'They urged the title Empress Dowager for the late emperor’s empress, virtue of the six palaces.',
  },
  s0942: {
    literal: '” Edict: as ordered.',
    idiomatic: 'Approved.',
  },
  s0943: {
    literal: 'Also edict: Prince of Hui mansion staff should stop.',
    idiomatic: 'The Prince of Hui’s household staff was dissolved.',
  },
  s0944: {
    literal: 'On xinsi, tomb bridge-and-road commissioner changed to acting Henan governor Zhang Tingfan; relay and tomb-base reception commissioners were also given to Tingfan.',
    idiomatic: 'On xinsi Zhang Tingfan replaced Wei Zhen on bridge, road, and tomb reception duties.',
  },
  s0945: {
    literal: 'On gengyin, Secretariat memorialized: Director of Rites stopped drum’s two graphs “敔” upper graph violates imperial taboo; request change to “肇.”',
    idiomatic: 'On gengyin the Rites Director asked to rename a drum character that violated the emperor’s taboo.',
  },
  s0946: {
    literal: 'The edict was assented to.',
    idiomatic: 'Assent was given.',
  },
  s0947: {
    literal: 'On the first day of the tenth month, xinmao; eclipse of the sun, in the heart’s first degree.',
    idiomatic: 'On xinmao, tenth month’s first day, the sun eclipsed in the Heart asterism.',
  },
  s0948: {
    literal: 'On renchen, Quanzhong came from Hezhong to court, after western inner condolence rites finished faced audience in Chongxun Hall.',
    idiomatic: 'On renchen Quanzhong came from Hezhong, mourned at the western palace, then met the emperor at Chongxun.',
  },
  s0949: {
    literal: 'On jiawu, edict: acting Grand Guardian, Left Dragon Martial commander Zhu Yougong may restore original name Li Yanwei, demoted to Yazhou registrar.',
    idiomatic: 'On jiawu Zhu Yougong, restored as Li Yanwei, was demoted to registrar of Ya.',
  },
  s0950: {
    literal: 'Acting Minister of Works, Right Dragon Martial commander Shi Shuzong may be demoted to Beizhou registrar.',
    idiomatic: 'Shi Shuzong was demoted to registrar of Bei.',
  },
  s0951: {
    literal: 'Also edict: “Yanwei and others commanded forbidden troops and rashly stirred them; already clear in public opinion and also tied to army sentiment.',
    idiomatic: 'An edict said Yanwei and the rest had stirred the guards and must answer to army and public opinion.',
  },
  s0952: {
    literal: 'Demoted to distant prefectures—how can they fulfill responsibility?',
    idiomatic: 'Exile was not enough.',
  },
  s0953: {
    literal: 'They should be assigned as long exiles in their home prefectures and still ordered to commit suicide where they are.',
    idiomatic: 'They were to be sent home as common exiles and ordered to kill themselves on arrival.',
  },
  s0954: {
    literal: '” Henan governor Zhang Tingfan seized Yanwei and others and killed them.',
    idiomatic: 'Zhang Tingfan seized them and killed them.',
  },
  s0955: {
    literal: 'Facing execution, he shouted: “Selling my life to stop the world’s slander—what of divine principle!',
    idiomatic: 'At the block Yanwei shouted, “You buy my life to silence slander—what of heaven’s justice?”',
  },
  s0956: {
    literal: 'A heart like this—hoping descendants long endure—can it?',
    idiomatic: 'With a heart like yours, do you think your line will last?”',
  },
  s0957: {
    literal: '” He called Tingfan and said: “Sir will soon reach this; strive to plan for yourself.',
    idiomatic: 'He called to Tingfan, “You’ll be here soon—plan ahead.”',
  },
  s0958: {
    literal: '” That day, Quanzhong returned to Daliang.',
    idiomatic: 'That day Quanzhong returned to Daliang.',
  },
  s0959: {
    literal: 'On bingshen, edict: Pingyi military governor, acting Grand Preceptor, Central Director, also Yanzhou prefect, Pillar, King of Dongping with 7,000 households Zhang Quanyi original office also Henan governor, Xuzhou prefect, Zhongwu military governor and observer, controller of Six Armies and Guards.',
    idiomatic: 'On bingshen Zhang Quanyi, King of Dongping, added Henan governor, Xuzhou prefect, Zhongwu command, and control of the Six Armies.',
  },
  s0960: {
    literal: 'Emperor’s accession acting officer, Left Assistant Director Yang She advanced to Baron with 400 added households.',
    idiomatic: 'Yang She, chief accession officer, was made a baron with four hundred added households.',
  },
  s0961: {
    literal: 'Vice Minister of Personnel Zhao Guangfeng advanced to Duke with 300 added households.',
    idiomatic: 'Zhao Guangfeng was made a duke with three hundred added households.',
  },
  s0962: {
    literal: 'Right Regular Attendant Dou Hui, Giver of Affairs Sun Xu, Households Director and edict drafter Feng Shunqing and others added merit ranks.',
    idiomatic: 'Dou Hui, Sun Xu, Feng Shunqing, and others received merit promotions.',
  },
  s0963: {
    literal: 'Ritual commissioner, Director of Rites Wang Pu and one son eighth-rank regular office.',
    idiomatic: 'Wang Pu, ritual commissioner, won an eighth-rank post for a son.',
  },
  s0964: {
    literal: 'Seal-and-register officers, Minister of Personnel Lu Yi and Minister of Justice Zhang Yi—Yi and one son eighth-rank regular office; Yi added rank.',
    idiomatic: 'Lu Yi and Zhang Yi, seal officers, were rewarded; Yi’s son received rank.',
  },
  s0965: {
    literal: 'Junior Guardian of the Heir Lu Shao died.',
    idiomatic: 'Junior Guardian Lu Shao died.',
  },
  s0966: {
    literal: 'Weibo Luo Shaowei presented relief silk thousand bolts, cotton three thousand liang for the hundred officials.',
    idiomatic: 'Luo Shaowei of Weibo sent a thousand bolts of silk and three thousand liang of cotton for officials’ relief.',
  },
  s0967: {
    literal: 'On the first day of the eleventh month, xinyou.',
    idiomatic: 'On xinyou, the first day of the eleventh month.',
  },
  s0968: {
    literal: 'On guiyou at the noon hour, the sun had yellow-white halo, with blue-red cords at the side.',
    idiomatic: 'At noon on guiyou the sun wore a yellow-white halo with blue-red cords beside it.',
  },
  s0969: {
    literal: 'Yang Xingmi attacked Guang Prefecture and pressed E Prefecture; Du Hong sent envoys begging aid; Quanzhong led fifty thousand from Yingzhou across the Huai, at Huoqiu greatly plundered to relieve it; Xingmi divided troops to resist.',
    idiomatic: 'Yang Xingmi besieged Guang and E; Du Hong begged help; Quanzhong crossed the Huai with fifty thousand, sacked Huoqiu, and met divided resistance.',
  },
  s0970: {
    literal: 'On yiyou, edict: “According to Director of Rites memorial, within the twelfth month choose a day to invest the empress.',
    idiomatic: 'On yiyou an edict cited the Rites Director: choose a day in the twelfth month to invest the empress.',
  },
  s0971: {
    literal: 'I recently follow the compassionate order: because the mausoleum is not finished, grief still binds.',
    idiomatic: 'The emperor said the tomb was unfinished and grief still bound him.',
  },
  s0972: {
    literal: 'All hundred offices for now devoutly fulfill service; auspicious and inauspicious rites are hard to perform together.',
    idiomatic: 'Offices must serve the tomb; joy and mourning could not mix.',
  },
  s0973: {
    literal: 'The empress investiture rites should wait until the mausoleum day is finished, so that at Qiaoshan clinging memory, ministers may show utmost node;',
    idiomatic: 'Investiture should wait until the tomb was done—grief at Qiaoshan first, ceremony in the orchid hall after.',
  },
  s0974: {
    literal: 'orchid hall receives glory, displaying full rites in my will.',
    idiomatic: 'Then the orchid hall could receive its glory.',
  },
  s0975: {
    literal: 'Feeling obtained, rites truly fit.',
    idiomatic: 'Feeling satisfied, ritual would be right.',
  },
  s0976: {
    literal: 'Entrust the responsible offices.',
    idiomatic: 'So ordered.',
  },
  s0977: {
    literal: '” On jichou, Lingnan East Circuit Bian Prefecture should be changed to Xun Prefecture.',
    idiomatic: 'On jichou Bian in Lingnan East was renamed Xun.',
  },
  s0978: {
    literal: 'On the first day of the twelfth month, xinmao.',
    idiomatic: 'On xinmao, the first day of the twelfth month.',
  },
  s0979: {
    literal: 'On guimao, acting Henan prefectural governor, Prince of He tutor Zhang Tingfan should restore original office.',
    idiomatic: 'On guimao Zhang Tingfan restored his former posts.',
  },
  s0980: {
    literal: 'Guanglu Grand Master, acting Minister of Works, Hedong County Viscount with 500 households, tomb deputy commissioner, acting Henan governor, Pingyi deputy military governor Wei Zhen acting military governor of Yan.',
    idiomatic: 'Wei Zhen was made acting governor of Yan while keeping tomb and Henan duties.',
  },
  s0981: {
    literal: 'On the first day of spring in Tianyou year 2, gengshen; Yang Xingmi took E Prefecture, seized military governor Du Hong, beheaded at Yang Prefecture.',
    idiomatic: 'On gengshen, New Year Tianyou 2, Yang Xingmi took Ezhou, captured Du Hong, and beheaded him at Yangzhou.',
  },
  s0982: {
    literal: 'E, Yue, Qi, Huang and other prefectures entered Xingmi.',
    idiomatic: 'E, Yue, Qi, Huang, and neighboring prefectures fell to Xingmi.',
  },
  s0983: {
    literal: 'Quanzhong from Huoqiu returned to Daliang.',
    idiomatic: 'Quanzhong returned to Daliang from Huoqiu.',
  },
  s0984: {
    literal: 'On jiazi, Director of Rites Wang Pu presented the late emperor’s posthumous title and temple name; then edict Right Vice Director, Grand Councillor Pei Shu draft the investiture text; Central Vice Director Liu Can draft the lamentation text.',
    idiomatic: 'On jiazi Wang Pu proposed posthumous name and temple name; Pei Shu was to draft the investiture, Liu Can the lament.',
  },
  s0985: {
    literal: 'On xinwei, edict: “I respectfully bear the great design, look up to the primal instruction, just pressed by the lost bow’s pain, looking down on the same-track period.',
    idiomatic: 'On xinwei an edict spoke of fresh grief for the late emperor and the coming tomb journey.',
  },
  s0986: {
    literal: 'About to display filial thought, personally support the guard.',
    idiomatic: 'The boy emperor wished to escort the coffin himself.',
  },
  s0987: {
    literal: 'The Empress Dowager’s righteousness deep as the crying phoenix, pain keen as clinging dragon, also wishes solely to attend the spirit carriage, personally reach the garden tomb, together exhaust the path of mourning, use to finish the rite of respectful completion.',
    idiomatic: 'The Empress Dowager, grieving as a phoenix, also wished to follow the bier to the tomb.',
  },
  s0988: {
    literal: 'On the late emperor’s tomb departure day, I with the Empress Dowager personally reach the tomb place; entrust Secretariat and Chancellery to embody utmost feeling.',
    idiomatic: 'They would go to the tomb together on departure day—the Secretariat was told to honor that wish.',
  },
  s0989: {
    literal: '” The hundred officials three times memorialized remonstrance; then it stopped.',
    idiomatic: 'Three memorials of protest stopped the plan.',
  },
  s0990: {
    literal: 'On the first day of the second month, gengyin.',
    idiomatic: 'On gengyin, the first day of the second month.',
  },
  s0991: {
    literal: 'On renchen, edict: former acting Bin military governor, acting Left Vice Director Liu Ye as Right Golden Guard senior general, commissioner of the right street.',
    idiomatic: 'On renchen Liu Ye, former acting governor of Bin, became Right Golden Guard general and right-street commissioner.',
  },
  s0992: {
    literal: 'Acting Left Vice Director Zhu Hanbin as Right Feathered Forest commander.',
    idiomatic: 'Zhu Hanbin became Right Feathered Forest commander.',
  },
  s0993: {
    literal: 'On bingshen, the hundred officials announced posthumous title at the Western Palace.',
    idiomatic: 'On bingshen the posthumous title was proclaimed at the Western Palace.',
  },
  s0994: {
    literal: 'On jihai, edict: “On the eleventh of this month, the late emperor opens the temporary palace.',
    idiomatic: 'On jihai an edict fixed the eleventh for opening the temporary tomb palace.',
  },
  s0995: {
    literal: 'Per precedent, markets forbid music until the twentieth when the dark palace is closed—then as before.',
    idiomatic: 'Markets would stay silent until the twentieth, when the tomb chamber closed.',
  },
  s0996: {
    literal: '” On gengzi, the temporary palace opened; civil and military hundred officials evening attendance at Western Palace.',
    idiomatic: 'On gengzi the temporary palace opened; officials kept evening vigil.',
  },
  s0997: {
    literal: 'On dingwei, the spirit carriage departed; Prince of Pu and below followed; emperor and empress dowager after rites at Changle Gate returned to the great inner.',
    idiomatic: 'On dingwei the bier set out with the Prince of Pu and others; emperor and dowager rited at Changle Gate and returned within.',
  },
  s0998: {
    literal: 'On jiyou, buried Emperor Zhaozong at He Mausoleum.',
    idiomatic: 'On jiyou Zhaozong was buried at He Mausoleum.',
  },
  s0999: {
    literal: 'On gengxu, edict changed Director of Rites Wang Pu to Minister of Works.',
    idiomatic: 'On gengxu Wang Pu became Minister of Works.',
  },
  s1000: {
    literal: 'On renzi, edict made Runan prefect Pei Di Minister of Justice.',
    idiomatic: 'On renzi Pei Di, prefect of Runan, was made Minister of Justice.',
  },
};
const source = loadSentencesFromData();
for (let n = START; n <= END; n++) {
  const id = `s${String(n).padStart(4, '0')}`;
  if (!source.has(id)) throw new Error(`Missing ${id} in ${dataPath}`);
  if (!T[id]) throw new Error(`Missing translation for ${id}`);
}

const expectedIds = new Set(
  Array.from({ length: END - START + 1 }, (_, i) => `s${String(START + i).padStart(4, '0')}`)
);

for (const id of expectedIds) {
  const pair = T[id];
  if (pair.literal === pair.idiomatic) {
    throw new Error(`${id}: literal and idiomatic must differ`);
  }
}

if (!existsSync(transPath)) {
  console.log(
    `No ${transPath}; standalone T ready (${Object.keys(T).length} entries, s${String(START).padStart(4, '0')}–s${String(END).padStart(4, '0')}).`
  );
  process.exit(0);
}

const data = JSON.parse(readFileSync(transPath, 'utf8'));
if (data.metadata.chapter !== '020') {
  console.log(
    `Session is chapter ${data.metadata.chapter}, not 020; standalone T ready (${Object.keys(T).length} entries).`
  );
  process.exit(0);
}

const sessionIds = new Set(data.sentences.map((s) => s.originalId || s.id));
const hasRange = [...expectedIds].every((id) => sessionIds.has(id));

if (!hasRange) {
  const extracted = extractRange(dataPath, START, END);
  for (const row of extracted) {
    const key = row.originalId;
    if (!sessionIds.has(key)) {
      data.sentences.push(row);
      sessionIds.add(key);
    }
  }
  const stillMissing = [...expectedIds].filter((id) => !sessionIds.has(id));
  if (stillMissing.length) {
    console.log(
      `Session lacks ${stillMissing.join(', ')}; standalone T ready (${Object.keys(T).length} entries). Re-run after the next start-translation batch.`
    );
    process.exit(0);
  }
}

const byId = new Map(data.sentences.map((s) => [s.originalId || s.id, s]));
for (const id of expectedIds) {
  const src = source.get(id);
  const row = byId.get(id);
  if (!row) throw new Error(`Session missing ${id}`);
  if (src.chinese && row.chinese !== src.chinese) {
    row.chinese = src.chinese;
  } else if (!row.chinese) {
    row.chinese = src.chinese;
  }
}

let applied = 0;
for (const s of data.sentences) {
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

const missing = [...expectedIds].filter(
  (id) => !data.sentences.some((s) => (s.originalId || s.id) === id && s.idiomatic)
);
if (missing.length) {
  throw new Error(`Missing applied translations for: ${missing.join(', ')}`);
}
if (applied !== Object.keys(T).length) {
  throw new Error(`Applied ${applied}, expected ${Object.keys(T).length}`);
}

writeFileSync(transPath, JSON.stringify(data, null, 2) + '\n');
console.log('Applied', applied, 'translations (s' + String(START).padStart(4, '0') + '–s' + String(END).padStart(4, '0') + ') to', transPath);
