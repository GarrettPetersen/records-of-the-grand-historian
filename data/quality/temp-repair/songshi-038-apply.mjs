#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-songshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-songshi-038-wikisource-4539457f17c0': [
    {
      zh: '十二月癸巳，詔總核內外財賦，以陳自強及兼國用使，費士寅、張岩同知國用事。',
      literal:
        'In the twelfth month, on the day guisi, an edict ordered a comprehensive audit of internal and external revenue and expenditure; Chen Ziqiang was made concurrent State Revenue Commissioner, and Fei Shiyin and Zhang Yan were made Associate Commissioners for State Revenue.',
      idiomatic:
        'In the twelfth month, on guisi, the court ordered a comprehensive audit of internal and external finances; Chen Ziqiang became State Revenue Commissioner, and Fei Shiyin and Zhang Yan became Associate Commissioners.',
    },
    {
      zh: '己亥，詔改明年爲開禧元年。',
      literal: 'On the day jihai, an edict changed the coming year to the first year of Kaixi.',
      idiomatic: 'On jihai, the coming year was renamed the first year of Kaixi (1205).',
    },
    {
      zh: '壬寅，禁州縣挾私籍沒民產。',
      literal: 'On the day renyin, prefectures and counties were forbidden to use private registers to confiscate commoners’ property.',
      idiomatic: 'On renyin, prefectures and counties were forbidden to confiscate commoners’ property using private registers.',
    },
    {
      zh: '甲辰，再蠲臨安府民身丁錢三年。',
      literal: 'On the day jiachen, the poll tax on households in Lin’an Prefecture was again remitted for three years.',
      idiomatic: 'On jiachen, Lin’an household poll taxes were again waived for three years.',
    },
    {
      zh: '乙卯，金遣烏林答毅來賀明年正旦。',
      literal: 'On the day yimao, Jin sent Wulinada Yi to congratulate the New Year of the coming year.',
      idiomatic: 'On yimao, the Jin court sent Wulinada Yi to offer New Year greetings for the coming year.',
    },
  ],
  'source-songshi-038-wikisource-c792f804275e': [
    {
      zh: '閏月丁未，詔講官有當開釋者，隨事開陳。',
      literal:
        'In the intercalary month, on the day dingwei, an edict ordered lecture officials who had matters requiring clarification to explain them as the occasion arose.',
      idiomatic:
        'In the intercalary month, on dingwei, lecture officials who had points needing clarification were ordered to explain them as appropriate.',
    },
    {
      zh: '乙卯，以福州觀察使曮爲威武軍節度使，封衛國公。',
      literal:
        'On the day yimao, Yan, Observation Commissioner of Fuzhou, was made Military Commissioner of the Weiwu Army and enfeoffed as Duke of Weiguo.',
      idiomatic: 'On yimao, Fuzhou Observation Commissioner Yan was made Weiwu Army Military Commissioner and enfeoffed Duke of Weiguo.',
    },
    {
      zh: '丁卯，金遣徒單公弼來賀明年正旦。',
      literal: 'On the day dingmao, Jin sent Tushan Gongbi to congratulate the New Year of the coming year.',
      idiomatic: 'On dingmao, the Jin court sent Tushan Gongbi to offer New Year greetings for the coming year.',
    },
    {
      zh: '是月，復周必大少傅、觀文殿大學士。',
      literal: 'That month, Zhou Bida was restored as Junior Mentor and Hanlin Scholar of the Guanwen Hall.',
      idiomatic: 'That month Zhou Bida was restored as Junior Mentor and Hanlin Scholar of the Guanwen Hall.',
    },
    {
      zh: '是冬，子坰生，未踰月薨，追封華王，謚沖穆。',
      literal:
        'That winter the son Chi was born; before a month had passed he died and was posthumously enfeoffed as Prince of Hua with the posthumous title Chongmu.',
      idiomatic:
        'That winter the emperor’s son Chi was born; he died before a month had passed and was posthumously created Prince of Hua with the posthumous title Chongmu.',
    },
  ],
  'source-songshi-038-wikisource-d381f6113672': [
    {
      zh: '五月辛巳朔，陳孝慶復虹縣。',
      literal: 'In the fifth month, on the first day xinsi, Chen Xiaoqing recovered Hong County.',
      idiomatic: 'On the first day of the fifth month, xinsi, Chen Xiaoqing recovered Hong County.',
    },
    {
      zh: '吳興郡王抦薨，追封沂王，諡曰靖惠。',
      literal:
        'Prince of Wuxing Bing died and was posthumously enfeoffed as Prince of Yi with the posthumous title Jinghui.',
      idiomatic: 'Prince of Wuxing Bing died and was posthumously created Prince of Yi with the posthumous title Jinghui.',
    },
    {
      zh: '癸未，禁邊郡官吏擅離職守。',
      literal: 'On the day guiwei, frontier prefecture officials were forbidden to leave their posts without authorization.',
      idiomatic: 'On guiwei, frontier officials were forbidden to leave their posts without authorization.',
    },
    {
      zh: '丙戌，江州都統王大節引兵攻蔡州，不克，軍大潰。',
      literal:
        'On the day bingxu, Wang Dajie, commander-in-chief of Jiang Prefecture, led troops to attack Caizhou but failed; the army collapsed in great disorder.',
      idiomatic:
        'On bingxu, Jiang Prefecture Commander Wang Dajie led troops against Caizhou but failed and his army collapsed in rout.',
    },
    {
      zh: '丁亥，下伐金。',
      literal: 'On the day dinghai, a declaration of war against Jin was issued.',
      idiomatic: 'On dinghai, the court issued a declaration of war against Jin.',
    },
    {
      zh: '癸巳，以伐金告於天地、宗廟、社稷。',
      literal: 'On the day guisi, the campaign against Jin was announced to Heaven and Earth, the ancestral temples, and the altars of soil and grain.',
      idiomatic: 'On guisi, the war against Jin was proclaimed to Heaven and Earth, the ancestral temples, and the state altars.',
    },
    {
      zh: '皇甫斌引兵攻唐州，敗績。',
      literal: 'Huangfu Bin led troops to attack Tang Prefecture and was defeated.',
      idiomatic: 'Huangfu Bin led troops against Tang Prefecture and was defeated.',
    },
    {
      zh: '興元都統秦世輔出師至城固縣，軍大亂。',
      literal: 'Qin Shifu, commander-in-chief of Xingyuan, marched out and reached Chenggu County, where the army fell into great disorder.',
      idiomatic: 'Xingyuan Commander Qin Shifu marched to Chenggu County, where his army collapsed in disorder.',
    },
    {
      zh: '甲午，賜宗室希瞿子名均，命爲沂王抦後，補千牛衛將軍。',
      literal:
        'On the day jiawu, the imperial clansman Xi Qu’s son was given the name Jun, appointed heir to Prince of Yi Bing, and made General of the Thousand-Ox Guard.',
      idiomatic:
        'On jiawu, imperial clansman Xi Qu’s son was named Jun, made heir to Prince of Yi Bing, and appointed General of the Thousand-Ox Guard.',
    },
    {
      zh: '以池州副都統郭倬、主管馬軍行司公事李汝翼會兵攻宿州，敗績。',
      literal:
        'Chi Prefecture Deputy Commander-in-Chief Guo Zhuo and Li Ruyi, chief administrator of the Mobile Horse Army Office, combined forces to attack Suzhou Prefecture and were defeated.',
      idiomatic:
        'Chi Prefecture Deputy Commander Guo Zhuo and Mobile Horse Army chief administrator Li Ruyi joined forces against Suzhou Prefecture and were defeated.',
    },
    {
      zh: '壬寅，太白晝見。',
      literal: 'On the day renyin, Venus appeared in daytime.',
      idiomatic: 'On renyin, Venus appeared by day.',
    },
    {
      zh: '簡荊襄、兩淮田卒以備戰兵。',
      literal: 'Farmer-soldiers of Jingxiang and the two Huai circuits were selected to serve as combat troops.',
      idiomatic: 'Farmer-soldiers from Jingxiang and the two Huai circuits were drafted as combat troops.',
    },
    {
      zh: '癸卯，郭倬等還至蘄縣，金人追而圍之，倬執馬軍司統制田俊邁以與金人，乃得免。',
      literal:
        'On the day guimao, Guo Zhuo and others returned to Qi County; Jin forces pursued and surrounded them; Zhuo seized Mobile Horse Army Commander Tian Junmai and handed him over to the Jin, and only then escaped.',
      idiomatic:
        'On guimao, Guo Zhuo and others retreated to Qi County; pursued and surrounded by Jin forces, Zhuo seized Mobile Horse Army Commander Tian Junmai and surrendered him to the Jin to escape.',
    },
  ],
};

const notes = {
  'source-songshi-038-wikisource-4539457f17c0':
    'Restored missing Jiatai 4 twelfth-month annals omitted between gengchen and Kaixi 1 first month.',
  'source-songshi-038-wikisource-c792f804275e':
    'Restored missing Jiatai 3 intercalary-month and winter annals omitted between gengyin review and year-end disaster relief.',
  'source-songshi-038-wikisource-d381f6113672':
    'Restored missing Kaixi 1 fifth-month annals omitted between wuyin and sixth-month renzi.',
};

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
for (const [id, rows] of Object.entries(packets)) {
  const item = queue.items.find((x) => x.id === id);
  if (!item) throw new Error(`Missing ${id}`);
  item.manualTranslations = rows.map((row) => ({
    ...row,
    translator: T,
    model: M,
  }));
  item.status = 'approved';
  item.decision = 'approved';
  item.notes = notes[id];
  item.reviewedAt = new Date().toISOString();
  item.reviewer = 'sdk-repair-chapter';
}
fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);

for (const id of Object.keys(packets)) {
  execSync(
    `node scripts/apply-source-correspondence.mjs --queue ${QUEUE} --approve ${id} --item ${id} --reviewer sdk-repair-chapter`,
    { stdio: 'inherit' },
  );
}

console.log('Applied songshi/038 source correspondence repairs.');
