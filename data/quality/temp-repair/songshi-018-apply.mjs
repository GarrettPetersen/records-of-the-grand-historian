#!/usr/bin/env node
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const QUEUE = 'data/quality/source-correspondence-corpus-wikisource-songshi.json';
const T = 'Garrett M. Petersen (2026)';
const M = 'Composer 2.5';

const packets = {
  'source-songshi-018-wikisource-6ad75e4a4af5': [
    {
      zh: '乙卯，上皇太妃宮名曰聖瑞。',
      literal: 'Day yimao: the Retired Emperor’s consort dowager’s palace was named Holy Auspice.',
      idiomatic: 'On yimao, the retired emperor’s consort dowager’s residence was named Holy Auspice.',
    },
    {
      zh: '六月壬辰，禁京城士人輿轎。',
      literal: 'Sixth month, day renchen: capital scholars were forbidden sedan chairs.',
      idiomatic: 'Sixth month, renchen: capital scholars were barred from sedan chairs.',
    },
  ],
  'source-songshi-018-wikisource-6eb4f929872c': [
    {
      zh: '二月癸亥，出元豐庫緡錢四百萬於陝西、河東糴邊儲。',
      literal: 'Second month, day guihai: four million strings from the Yuanfeng treasury were issued to Shaanxi and Hedong to purchase frontier stores.',
      idiomatic: 'Second month, guihai: four million strings from the Yuanfeng treasury went to Shaanxi and Hedong to buy frontier grain stores.',
    },
    {
      zh: '辛未，復元豐《恤孤幼令》。',
      literal: 'Day xinwei: the Yuanfeng Statute on Succoring Orphans and Infants was restored.',
      idiomatic: 'On xinwei, the Yuanfeng statute succoring orphans and infants was restored.',
    },
    {
      zh: '癸酉，罷富弼配饗神宗廟庭。',
      literal: 'Day guiyou: Fu Bi’s shared sacrifice in the Shenzong temple court was abolished.',
      idiomatic: 'On guiyou, Fu Bi was removed from shared sacrifice in Shenzong’s temple court.',
    },
    {
      zh: '癸未，詔封濮王子未王者三人：宗楚爲南陽郡王，宗祐爲景城郡王，並開府儀同三司；',
      literal: 'Day guiwei, edict: three sons of the Prince of Pu not yet enfeoffed were enfeoffed—Zong Chu as Prince of Nanyang commandery, Zong You as Prince of Jingcheng commandery, both Honorary Grand Councilor of State;',
      idiomatic: 'On guiwei, three unenfeoffed sons of the Prince of Pu were enfeoffed: Zong Chu as Prince of Nanyang and Zong You as Prince of Jingcheng, both made Honorary Grand Councilor of State;',
    },
    {
      zh: '宗漢爲東陽郡王。',
      literal: 'Zong Han was enfeoffed Prince of Dongyang commandery.',
      idiomatic: 'Zong Han was made Prince of Dongyang.',
    },
    {
      zh: '乙酉，宗綽薨。',
      literal: 'Day yiyou: Zong Chuo died.',
      idiomatic: 'On yiyou, Zong Chuo died.',
    },
    {
      zh: '丙戌，詔三歲一取旨，遣郎官、御史按察監司職事。',
      literal: 'Day bingxu, edict: every three years, upon imperial order, Secretariat officials and censors would inspect and review the duties of supervisory commissioners.',
      idiomatic: 'On bingxu, every three years imperial order would dispatch Secretariat officials and censors to inspect supervisory commissioners.',
    },
    {
      zh: '丁亥，夏人寇義合砦。',
      literal: 'Day dinghai: Western Xia raided Yihe stockade.',
      idiomatic: 'On dinghai, Xia raided Yihe stockade.',
    },
  ],
  'source-songshi-018-wikisource-76bc44dd2000': [
    {
      zh: '九月己亥，邈川首領阿里骨卒。',
      literal: 'Ninth month, day jihai: Miaochuan chief Aligu died.',
      idiomatic: 'Ninth month, jihai: Miaochuan chief Aligu died.',
    },
    {
      zh: '己酉，滁、沂二州地震。',
      literal: 'Day jiyou: Chuzhou and Yizhou had earthquakes.',
      idiomatic: 'On jiyou, Chuzhou and Yizhou were shaken by earthquakes.',
    },
    {
      zh: '壬子，楚王顥薨。',
      literal: 'Day renzi: Prince Hao of Chu died.',
      idiomatic: 'On renzi, Prince Hao of Chu died.',
    },
    {
      zh: '乙卯，廢皇后孟氏爲華陽教主、玉清妙靜仙師，賜名沖真。',
      literal: 'Day yimao: Empress Meng was deposed and made Huayang Cult Leader and Jade-Pure Wonder-Tranquil Immortal Master, granted the name Chongzhen.',
      idiomatic: 'On yimao, Empress Meng was deposed as Huayang cult leader and Jade-Pure Wonder-Tranquil immortal master, given the name Chongzhen.',
    },
    {
      zh: '冬十月丁巳朔，以楚王薨，罷文德殿視朝。',
      literal: 'Winter, tenth month, day dingsi new moon: because the Prince of Chu had died, audience at Wende Hall was canceled.',
      idiomatic: 'Tenth month, dingsi new moon: mourning the Prince of Chu canceled audience at Wende Hall.',
    },
    {
      zh: '壬戌，夏人寇鄜、延，陷金明砦。',
      literal: 'Day renxu: Western Xia raided Fu and Yan, taking Jinming stockade.',
      idiomatic: 'On renxu, Xia raided Fu and Yan and took Jinming stockade.',
    },
    {
      zh: '戊辰，詔被邊諸路相度城砦要害，增嚴守備。',
      literal: 'Day wuchen, edict: frontier circuits were ordered to survey key stockades and cities and tighten defenses.',
      idiomatic: 'On wuchen, frontier circuits were told to survey key cities and stockades and tighten defenses.',
    },
    {
      zh: '辛未，西南方雷聲，雨雹。',
      literal: 'Day xinwei: thunder sounded in the southwest and hail fell with rain.',
      idiomatic: 'On xinwei, thunder sounded in the southwest with rain and hail.',
    },
    {
      zh: '癸酉，鐘傳言築汝遮，詔以爲安西城。',
      literal: 'Day guiyou: Zhong Chuan reported building Ruzhe; an edict made it Anxi city.',
      idiomatic: 'On guiyou, Zhong Chuan reported construction at Ruzhe; it was named Anxi city.',
    },
  ],
  'source-songshi-018-wikisource-ef9d755b406d': [
    {
      zh: '五月丁巳，文彥博薨。',
      literal: 'Fifth month, day dingsi: Wen Yanbo died.',
      idiomatic: 'Fifth month, dingsi: Wen Yanbo died.',
    },
    {
      zh: '辛酉，以皇太妃服藥及亢旱，決四京囚。',
      literal: 'Day xinyou: because the imperial consort dowager was taking medicine and there was severe drought, prisoners in the Four Capitals were reviewed.',
      idiomatic: 'On xinyou, the consort dowager’s medicine and severe drought brought prisoner review in the Four Capitals.',
    },
    {
      zh: '壬戌，詔陝西添置蕃落馬軍十指揮。',
      literal: 'Day renxu, edict: ten tribal horse-army commands were added in Shaanxi.',
      idiomatic: 'On renxu, Shaanxi gained ten tribal horse-army commands.',
    },
    {
      zh: '丁卯，廢衛州淇水第二馬監、潁昌府單鎮馬監。',
      literal: 'Day dingmao: the second horse-pasture office at Qishui in Weizhou and the Danzhen horse-pasture office in Yingchang prefecture were abolished.',
      idiomatic: 'On dingmao, Weizhou’s second Qishui horse pasture and Yingchang’s Danzhen horse pasture were abolished.',
    },
    {
      zh: '辛未，韓縝薨。',
      literal: 'Day xinwei: Han Zhen died.',
      idiomatic: 'On xinwei, Han Zhen died.',
    },
    {
      zh: '丁丑，貶韓維爲崇信軍節度副使。',
      literal: 'Day dingchou: Han Wei was demoted to military vice-commissioner of Chongxin army.',
      idiomatic: 'On dingchou, Han Wei was demoted to Chongxin army vice-commissioner.',
    },
    {
      zh: '六月癸未朔，日明食之。',
      literal: 'Sixth month, day guiwei new moon: there was an eclipse of the sun; it was near total.',
      idiomatic: 'Sixth month, guiwei new moon: the sun was nearly totally eclipsed.',
    },
    {
      zh: '丁亥，太白犯太微垣。',
      literal: 'Day dinghai: Venus crossed the Heavenly Enclosure.',
      idiomatic: 'On dinghai, Venus crossed the Heavenly Enclosure.',
    },
    {
      zh: '戊子，宗楚薨。',
      literal: 'Day wuzi: Zong Chu died.',
      idiomatic: 'On wuzi, Zong Chu died.',
    },
    {
      zh: '丙申，詔翰林學士、吏部尚書各舉監察御史二人。',
      literal: 'Day bingshen, edict: Hanlin academicians and the Minister of Personnel were each to recommend two investigating censors.',
      idiomatic: 'On bingshen, Hanlin academicians and the personnel minister were each to recommend two investigating censors.',
    },
    {
      zh: '丁酉，環慶路安疆砦成，詔防托蕃漢官賜帛有差。',
      literal: 'Day dingyou: Anjiang stockade on Huanqing circuit was completed; an edict ordered graded gifts of silk for frontier defense officers, both fan and Han.',
      idiomatic: 'On dingyou, Huanqing’s Anjiang stockade was finished; frontier defense officers, fan and Han, were granted graded silk gifts.',
    },
    {
      zh: '甲辰，熙河進築青石峽畢工，賜名西平。',
      literal: 'Day jiachen: Xihe circuit’s advance construction at Qingshi Gorge was completed and named Xiping.',
      idiomatic: 'On jiachen, Xihe’s advance work at Qingshi Gorge was finished and named Xiping.',
    },
    {
      zh: '乙巳，保寧軍觀察留後宗漢爲開府儀同三司，徙封安康郡王。',
      literal: 'Day yisi: Baoning army observation commissioner and rear guard Zong Han was made Honorary Grand Councilor of State and transferred to Prince of Ankang commandery.',
      idiomatic: 'On yisi, Zong Han of Baoning army became honorary grand councilor and was transferred to Prince of Ankang.',
    },
    {
      zh: '己酉，太原地震。',
      literal: 'Day jiyou: Taiyuan had an earthquake.',
      idiomatic: 'On jiyou, Taiyuan shook.',
    },
    {
      zh: '太白晝見。',
      literal: 'Venus appeared in daytime.',
      idiomatic: 'Venus appeared by day.',
    },
  ],
  'source-songshi-018-wikisource-2116819cc557': [
    {
      zh: '九月庚子朔，夏人來謝罪。',
      literal: 'Ninth month, day gengzi new moon: Western Xia came to apologize.',
      idiomatic: 'Ninth month, gengzi new moon: Xia came to apologize.',
    },
    {
      zh: '癸卯，命御史點檢三省、樞密院，並依元豐舊制。',
      literal: 'Day guimao: censors were ordered to inspect the Three Departments and Bureau of Military Affairs, all according to Yuanfeng precedent.',
      idiomatic: 'On guimao, censors were ordered to inspect the Three Departments and Military Affairs Bureau under Yuanfeng rules.',
    },
    {
      zh: '甲辰，幸儲祥宮。',
      literal: 'Day jiachen: the emperor visited Chuxiang Palace.',
      idiomatic: 'On jiachen, the emperor visited Chuxiang Palace.',
    },
    {
      zh: '乙巳，幸醴泉觀。',
      literal: 'Day yisi: the emperor visited Liquan Abbey.',
      idiomatic: 'On yisi, the emperor visited Liquan Abbey.',
    },
    {
      zh: '丁未，立賢妃劉氏爲皇后。',
      literal: 'Day dingwei: Worthy Consort Lady Liu was made empress.',
      idiomatic: 'On dingwei, Worthy Consort Lady Liu was made empress.',
    },
    {
      zh: '己未，青唐酋隴拶以城降。',
      literal: 'Day jiwei: Qingtang chief Longzan surrendered his city.',
      idiomatic: 'On jiwei, Qingtang chief Longzan surrendered his city.',
    },
    {
      zh: '壬戌，雨，罷秋宴。',
      literal: 'Day renxu: rain fell and the autumn banquet was canceled.',
      idiomatic: 'On renxu, rain canceled the autumn banquet.',
    },
    {
      zh: '甲子，右正言鄒浩論劉氏不當立，特除名勒停、新州羈管。',
      literal: 'Day jiazi: Right Remonstrator Zou Hao argued that Lady Liu should not be made empress; he was specially struck from the roster, expelled, and placed under restraint at Xin prefecture.',
      idiomatic: 'On jiazi, Right Remonstrator Zou Hao argued Lady Liu should not be empress; he was struck from office, expelled, and restrained at Xin prefecture.',
    },
    {
      zh: '丙寅，御文德殿冊皇后。',
      literal: 'Day bingyin: at Wende Hall the empress was installed.',
      idiomatic: 'On bingyin, the empress was installed at Wende Hall.',
    },
    {
      zh: '閏月癸酉，置律學博士員。',
      literal: 'Intercalary month, day guiyou: doctorate posts in the law school were established.',
      idiomatic: 'Intercalary month, guiyou: law-school doctorates were established.',
    },
    {
      zh: '詔詳議廟制。',
      literal: 'An edict ordered detailed deliberation on temple regulations.',
      idiomatic: 'An edict ordered detailed deliberation on temple regulations.',
    },
    {
      zh: '以青唐爲鄯州、隴右節度。',
      literal: 'Qingtang was made Shan prefecture with Longyou military commission.',
      idiomatic: 'Qingtang was made Shan prefecture and Longyou military commission.',
    },
    {
      zh: '邈川爲湟州，宗哥城爲龍支城，俱隸隴右。',
      literal: 'Miaochuan was made Huang prefecture and Zongge city was made Longzhi city, both subordinate to Longyou.',
      idiomatic: 'Miaochuan became Huang prefecture and Zongge city became Longzhi city, both under Longyou.',
    },
    {
      zh: '戊寅，以廓州爲寧砦城。',
      literal: 'Day wuyin: Kuo prefecture was made Ningzhai city.',
      idiomatic: 'On wuyin, Kuo prefecture was made Ningzhai city.',
    },
    {
      zh: '丙戌，果州團練使仲忽進古方鼎，志曰「魯公作文王尊彝」。',
      literal: 'Day bingxu: Guozhou regimented army training commissioner Zhong Hu presented an ancient square tripod; the inscription read "The Duke of Lu made this vessel honoring King Wen."',
      idiomatic: 'On bingxu, Guozhou training commissioner Zhong Hu presented an ancient square tripod inscribed "The Duke of Lu made this vessel honoring King Wen."',
    },
    {
      zh: '甲午，熒惑犯太微垣左執法。',
      literal: 'Day jiawu: Mars crossed the Left Law Enforcer of the Heavenly Enclosure.',
      idiomatic: 'On jiawu, Mars crossed the Left Law Enforcer in the Heavenly Enclosure.',
    },
    {
      zh: '己未，越王茂薨。',
      literal: 'Day jiwei: Prince Mao of Yue died.',
      idiomatic: 'On jiwei, Prince Mao of Yue died.',
    },
  ],
};

const notes = {
  'source-songshi-018-wikisource-6ad75e4a4af5':
    'Reordered and split fifth-month yimao palace naming from sixth-month renchen sedan-chair ban to match Wikisource.',
  'source-songshi-018-wikisource-6eb4f929872c':
    'Restored missing Shaosheng 3 second-month annals omitted between wuwu and third-month renchen.',
  'source-songshi-018-wikisource-76bc44dd2000':
    'Restored missing Shaosheng 3 ninth- and tenth-month annals omitted between gengchen and eleventh-month dingwei.',
  'source-songshi-018-wikisource-ef9d755b406d':
    'Restored missing Shaosheng 4 fifth- and sixth-month annals omitted between jiyou and autumn seventh-month renzi.',
  'source-songshi-018-wikisource-2116819cc557':
    'Restored missing Yuanfu 2 ninth-month annals omitted between bingchen and winter tenth-month renzi.',
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

console.log('Applied songshi/018 source correspondence repairs.');
