#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-xinwudaishi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const items = {
  'source-xinwudaishi-023-wikisource-349395783534': {
    notes: 'Inserted four closing Yang Shihou sentences before the Wang Jingren biography heading.',
    manualTranslations: [
      {
        zh: '末帝即位，封師厚鄴王，詔書不名，事無巨細皆以諮之，然心益忌而畏之。',
        literal:
          'When the Last Emperor took the throne he enfeoffed Shihou as Prince of Ye; edicts did not name him; affairs great and small were all referred to him, yet the emperor grew ever more jealous and fearful of him.',
        idiomatic:
          'When the Last Emperor took the throne he enfeoffed Shihou as Prince of Ye. Edicts did not name him; affairs great and small were all referred to him, yet the emperor grew ever more jealous and afraid of him.',
      },
      {
        zh: '已而師厚瘍發卒，末帝為之受賀於宮中。',
        literal:
          'Before long Shihou died of carbuncle, and the Last Emperor received congratulations for it within the palace.',
        idiomatic:
          'Before long Shihou died of carbuncle, and the Last Emperor received congratulations for it within the palace.',
      },
      {
        zh: '由是始分相、魏為兩鎮。',
        literal: 'From this the division of Xiang and Wei into two commands began.',
        idiomatic: 'From this Xiang and Wei were first divided into two commands.',
      },
      {
        zh: '魏軍亂，以魏博降晉，梁失河北自此始。',
        literal:
          'Wei troops mutinied; Weibo surrendered to Jin, and Liang’s loss of Hebei began from this.',
        idiomatic:
          'Wei troops mutinied; Weibo went over to Jin, and Liang’s loss of Hebei began from this.',
      },
    ],
  },
  'source-xinwudaishi-023-wikisource-6f9f2d436067': {
    notes:
      'Inserted eight Wang Jingren sentences on the Kaiping northern campaign and Baixiang defeat between s0059 and s0060.',
    manualTranslations: [
      {
        zh: '開平四年，以景仁為北面招討使，將韓勍、李思安等兵伐趙，行至魏州，司天監言：「太陰虧，不利行師。」',
        literal:
          'In the fourth year of Kaiping Jingren was made northern-route pacification commissioner and led Han Qing, Li Si’an, and other troops against Zhao. When they reached Weizhou the Directorate of Astronomy said: “The moon is in eclipse—unfavorable for taking the field.”',
        idiomatic:
          'In the fourth year of Kaiping Jingren was made northern-route pacification commissioner and led Han Qing, Li Si’an, and others against Zhao. At Weizhou the Directorate of Astronomy said: “The moon is in eclipse—unfavorable for taking the field.”',
      },
      {
        zh: '太祖亟召景仁等還，已而復遣之。',
        literal: 'Taizu urgently recalled Jingren and the others, then sent them out again.',
        idiomatic: 'Taizu urgently recalled Jingren and the others, then sent them out again.',
      },
      {
        zh: '景仁已去，太祖思術者言，馳使者止景仁於魏以待。',
        literal:
          'Jingren had already departed when Taizu, remembering the diviner’s words, dispatched a messenger at speed to halt him at Wei to await orders.',
        idiomatic:
          'Jingren had already left when Taizu, remembering the diviner’s warning, sent a messenger at speed to halt him at Wei and await further orders.',
      },
      {
        zh: '景仁已過邢、洺，使者及之，景仁不奉詔，進營於柏鄉。',
        literal:
          'Jingren had already passed Xing and Ming when the messenger reached him; Jingren did not obey the edict and advanced to encamp at Baixiang.',
        idiomatic:
          'Jingren had already passed Xing and Ming when the messenger caught up; Jingren refused the edict and advanced to camp at Baixiang.',
      },
      {
        zh: '乾化元年正月庚寅，日有食之，崇政使敬翔白太祖曰：「兵可憂矣！」',
        literal:
          'On gengyin, the first month of the first year of Qianhua, there was a solar eclipse. Jing Xiang, commissioner of the Chongzheng Bureau, told Taizu: “The army ought to worry!”',
        idiomatic:
          'On gengyin, the first month of Qianhua 1, there was a solar eclipse. Jing Xiang, commissioner of the Chongzheng Bureau, told Taizu: “The army ought to worry!”',
      },
      {
        zh: '太祖為之旰食。',
        literal: 'Taizu went without his noon meal on account of it.',
        idiomatic: 'Taizu went without his noon meal on account of it.',
      },
      {
        zh: '是日，景仁及晉人戰，大敗於柏鄉，景仁歸訴於太祖，太祖曰：「吾亦知之，蓋韓勍、李思安輕汝為客，不從節度爾。」',
        literal:
          'That day Jingren fought the Jin forces and was badly defeated at Baixiang. Jingren returned and complained to Taizu; Taizu said: “I know it too—Han Qing and Li Si’an look down on you as an outsider and would not obey your command.”',
        idiomatic:
          'That day Jingren fought the Jin and was routed at Baixiang. Jingren returned and complained to Taizu. Taizu said: “I know it too—Han Qing and Li Si’an look down on you as an outsider and would not obey your command.”',
      },
      {
        zh: '乃罷景仁就第，後數月，悉復其官爵。',
        literal:
          'Jingren was dismissed and sent to his private residence; several months later all his offices and titles were fully restored.',
        idiomatic:
          'Jingren was dismissed and sent home; several months later all his offices and titles were fully restored.',
      },
    ],
  },
  'source-xinwudaishi-023-wikisource-535b7e6200bd': {
    notes:
      'Inserted ten He Gui sentences on the Zhenming campaigns, Huliupi, and death between s0075 and the Wang Tan biography.',
    manualTranslations: [
      {
        zh: '貞明元年，魏兵亂，賀德倫降晉，晉王入魏州。',
        literal:
          'In the first year of Zhenming Wei troops mutinied; He Delun surrendered to Jin, and the Prince of Jin entered Weizhou.',
        idiomatic:
          'In the first year of Zhenming Wei troops mutinied. He Delun went over to Jin, and the Prince of Jin entered Weizhou.',
      },
      {
        zh: '劉鄩敗于故元城，走黎陽，貝、衞、洺、磁諸州皆入于晉。',
        literal:
          'Liu Xun was defeated at former Yuancheng and fled to Liyang; Bei, Wei, Ming, and Ci prefectures all passed to Jin.',
        idiomatic:
          'Liu Xun was beaten at former Yuancheng and fled to Liyang. Bei, Wei, Ming, and Ci prefectures all passed to Jin.',
      },
      {
        zh: '晉軍取楊劉，末帝乃以瓌為招討使，與謝彥章等屯于行臺。',
        literal:
          'Jin troops took Yangliu; the Last Emperor then made Gui pacification commissioner and encamped with Xie Yanzhang and others at the field headquarters.',
        idiomatic:
          'Jin took Yangliu. The Last Emperor then made Gui pacification commissioner and camped with Xie Yanzhang and others at the field headquarters.',
      },
      {
        zh: '晉軍迫瓌十里而柵，相持百餘日。',
        literal:
          'Jin troops pressed within ten li of Gui and palisaded; the stalemate lasted more than a hundred days.',
        idiomatic:
          'Jin pressed within ten li of Gui and fenced in; the standoff lasted more than a hundred days.',
      },
      {
        zh: '瓌與彥章有隙，伏甲殺之，莊宗喜曰：「將帥不和，梁亡無日矣！」',
        literal:
          'Gui and Yanzhang were at odds; he hid armored men and killed him. Zhuangzong rejoiced and said: “When commanders are not at one, Liang’s fall is near!”',
        idiomatic:
          'Gui and Yanzhang were at odds. Gui hid armed men and killed him. Zhuangzong rejoiced and said: “When commanders fall out, Liang’s end is near!”',
      },
      {
        zh: '乃令軍中歸其老疾於鄴，以輕兵襲濮州。',
        literal:
          'He then ordered the army to send the old and sick back to Ye and struck Pu prefecture with light troops.',
        idiomatic:
          'He then sent the old and sick back to Ye and struck Pu prefecture with light troops.',
      },
      {
        zh: '瓌自行臺躡之，戰于胡柳陂，晉人輜重在陣西，瓌軍將薄之，晉軍亂，斬其將周德威，盡取其輜重。',
        literal:
          'Gui pursued from the field headquarters himself and fought at Huliupi. Jin baggage trains were west of the formation; Gui’s army was about to press them when the Jin forces broke in disorder. They beheaded the commander Zhou Dewei and took all the baggage trains.',
        idiomatic:
          'Gui pursued from the field headquarters himself and fought at Huliupi. Jin baggage trains lay west of the formation; as Gui’s army was about to close, the Jin broke in disorder. They beheaded Zhou Dewei and took all the baggage trains.',
      },
      {
        zh: '軍已勝，陣無石山，日暮，晉兵仰攻之，瓌軍下山擊晉軍，瓌大敗，晉遂取濮州，城德勝，夾河為柵。',
        literal:
          'The army had already won; there was no stony hill in the formation. At dusk Jin troops attacked uphill; Gui’s army went down the hill to strike the Jin forces and Gui suffered great defeat. Jin then took Pu prefecture, fortified Desheng, and fenced both banks of the river.',
        idiomatic:
          'The army had already won, but there was no stony hill in the formation. At dusk the Jin attacked uphill; Gui’s army went down the hill to strike them and was routed. Jin then took Pu, fortified Desheng, and fenced both banks of the river.',
      },
      {
        zh: '瓌以舟兵攻南柵，不能得，還軍行臺，以疾卒，年六十二，贈侍中。',
        literal:
          'Gui attacked the southern palisade with river troops but could not take it. He returned the army to the field headquarters, died of illness at sixty-two, and was posthumously honored as Palace Attendant.',
        idiomatic:
          'Gui attacked the southern palisade with river troops but could not take it. He returned to the field headquarters, died of illness at sixty-two, and was posthumously made Palace Attendant.',
      },
      {
        zh: '有子光圖。凡言有子某者，皆仕皇朝有聞。',
        literal:
          'He had a son Guangtu. Wherever it says a man had a son, that son later won renown in service to the imperial court.',
        idiomatic:
          'He had a son Guangtu. Wherever the text says a man had a son, that son later won renown in service to the imperial court.',
      },
    ],
  },
  'source-xinwudaishi-023-wikisource-ab0e03e2be3e': {
    notes:
      'Inserted ten Ma Sixun biography sentences between the Ma Sixun heading and the Wang Qianyu heading.',
    manualTranslations: [
      {
        zh: '馬嗣勳，濠州鍾離人也，少事州為客將，為人材武有辯。',
        literal:
          'Ma Sixun was a native of Zhongli in Haozhou. In youth he served the prefecture as a guest general; he was talented in arms and eloquent.',
        idiomatic:
          'Ma Sixun came from Zhongli in Haozhou. As a youth he served the prefecture as a guest general; he was talented in arms and eloquent.',
      },
      {
        zh: '梁太祖攻濠州，刺史張遂遣嗣勳持牌印降梁。',
        literal:
          'When Taizu of Liang attacked Haozhou, the prefect Zhang Sui sent Sixun with the seal and credentials to surrender to Liang.',
        idiomatic:
          'When Taizu of Liang attacked Haozhou, prefect Zhang Sui sent Sixun with the seal and credentials to surrender to Liang.',
      },
      {
        zh: '楊行密攻遂，遂又使嗣勳乞兵於太祖。',
        literal:
          'Yang Xingmi attacked Sui; Sui again sent Sixun to beg troops from Taizu.',
        idiomatic:
          'Yang Xingmi attacked Sui, and Sui again sent Sixun to beg troops from Taizu.',
      },
      {
        zh: '梁兵未至，濠州已沒，嗣勳無所歸，乃留事梁，太祖以為宣武軍元從押衙。',
        literal:
          'Liang troops had not arrived when Haozhou fell; Sixun had nowhere to go and stayed to serve Liang; Taizu made him yabing, an original follower of the Xuanwu army.',
        idiomatic:
          'Liang troops had not arrived when Haozhou fell. Sixun had nowhere to go and stayed to serve Liang; Taizu made him yabing, an original follower of the Xuanwu army.',
      },
      {
        zh: '太祖西攻鳳翔，行至華州，遣嗣勳入說韓建，建即時出降。',
        literal:
          'Taizu attacked Fengxiang in the west; reaching Huazhou he sent Sixun in to persuade Han Jian, who surrendered at once.',
        idiomatic:
          'Taizu attacked Fengxiang in the west. Reaching Huazhou, he sent Sixun in to persuade Han Jian, who surrendered at once.',
      },
      {
        zh: '天祐二年，羅紹威將誅牙軍，乞兵於梁，梁女嫁魏，適死，太祖乃遣嗣勳以長直千人為綵輿入魏，致兵器於輿中，聲言助葬。',
        literal:
          'In the second year of Tianyou Luo Shaowei meant to destroy the garrison troops and begged troops from Liang. A Liang princess married into Wei had just died; Taizu sent Sixun with a thousand Long-Direct troops as a funeral escort into Wei, weapons hidden in the carriage, proclaiming they came to assist the burial.',
        idiomatic:
          'In the second year of Tianyou Luo Shaowei meant to destroy the garrison troops and begged Liang for troops. A Liang princess married into Wei had just died; Taizu sent Sixun with a thousand Long-Direct troops in a funeral escort into Wei, weapons hidden in the carriage, claiming they came to assist the burial.',
      },
      {
        zh: '嗣勳館銅臺，夜與魏新鄉鎮兵攻石柱門，入迎紹威家屬，衞之。',
        literal:
          'Sixun lodged at the Bronze Terrace; by night he and the Xin township garrison troops of Wei attacked Shizhu Gate, entered to receive Shaowei’s household, and guarded them.',
        idiomatic:
          'Sixun lodged at the Bronze Terrace. By night he and the Xin township garrison troops of Wei attacked Shizhu Gate, entered to receive Shaowei’s household, and guarded them.',
      },
      {
        zh: '乃益取魏甲兵攻牙軍，牙軍不知兵所從來，莫能為備，殺其八千餘人，遲明皆盡。',
        literal:
          'He then took more of Wei’s armor and troops to attack the garrison troops. Not knowing where the soldiers had come from, they could not prepare; more than eight thousand were killed and by dawn all were gone.',
        idiomatic:
          'He then took more of Wei’s armor and troops to attack the garrison troops. Not knowing where the soldiers had come from, they could not prepare; more than eight thousand were killed, and by dawn all were gone.',
      },
      {
        zh: '嗣勳中重瘡卒。',
        literal: 'Sixun was struck by grievous wounds and died.',
        idiomatic: 'Sixun was struck by grievous wounds and died.',
      },
      {
        zh: '太祖即位，贈太保。',
        literal: 'When Taizu took the throne Sixun was posthumously honored as Grand Guardian.',
        idiomatic: 'When Taizu took the throne Sixun was posthumously made Grand Guardian.',
      },
    ],
  },
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));

for (const [itemId, payload] of Object.entries(items)) {
  const item = queue.items.find((entry) => entry.id === itemId);
  if (!item) throw new Error(`Missing ${itemId}`);

  item.manualTranslations = payload.manualTranslations.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = payload.notes;
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}

fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const itemId of Object.keys(items)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${itemId} --item ${itemId} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied xinwudaishi/023 source correspondence repairs.');
