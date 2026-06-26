#!/usr/bin/env node
/**
 * Repair narrow Qing draft table omissions where Wikisource preserves a name
 * prefix that the local table cell dropped.
 *
 * This is intentionally conservative:
 * - qingshigao source-correspondence queues only;
 * - one local table/table-header unit only, or a sequential table range whose
 *   clauses each differ only by an inserted name prefix;
 * - upstream text must be the queued local text with a non-empty name prefix;
 * - the current cell must still contain that queued local text;
 * - English is regenerated only with a constrained office-table phrase map.
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_REVIEWER = 'repair-qingshigao-table-prefix-omissions';
const DEFAULT_TRANSLATOR = 'Garrett M. Petersen (2026)';
const DEFAULT_MODEL = 'GPT-5';
const QUEUE_RE = /^source-correspondence-corpus-wikisource-qingshigao\.json$/u;
const SOURCE_FIELDS = ['zh', 'content', 'source', 'text'];
const HAN_RE = /\p{Script=Han}/u;
const HAN_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const SENTENCE_RE = /[^。！？；]+[。！？；]?/gu;
const STEMS = new Map([
  ['甲', 'jia'], ['乙', 'yi'], ['丙', 'bing'], ['丁', 'ding'], ['戊', 'wu'],
  ['己', 'ji'], ['庚', 'geng'], ['辛', 'xin'], ['壬', 'ren'], ['癸', 'gui'],
]);
const BRANCHES = new Map([
  ['子', 'zi'], ['丑', 'chou'], ['寅', 'yin'], ['卯', 'mao'], ['辰', 'chen'], ['巳', 'si'],
  ['午', 'wu'], ['未', 'wei'], ['申', 'shen'], ['酉', 'you'], ['戌', 'xu'], ['亥', 'hai'],
]);
const MONTHS = new Map([
  ['正', 'first'], ['一', 'first'], ['二', 'second'], ['三', 'third'], ['四', 'fourth'],
  ['五', 'fifth'], ['六', 'sixth'], ['七', 'seventh'], ['八', 'eighth'], ['九', 'ninth'],
  ['十', 'tenth'], ['十一', 'eleventh'], ['十二', 'twelfth'],
]);
const ERAS = new Map([
  ['順治', 'Shunzhi'],
  ['康熙', 'Kangxi'],
  ['雍正', 'Yongzheng'],
  ['乾隆', 'Qianlong'],
  ['嘉慶', 'Jiaqing'],
  ['道光', 'Daoguang'],
  ['咸豐', 'Xianfeng'],
  ['同治', 'Tongzhi'],
  ['光緒', 'Guangxu'],
  ['宣統', 'Xuantong'],
]);
const CHINESE_DIGITS = new Map([
  ['零', 0], ['〇', 0], ['○', 0],
  ['元', 1], ['一', 1], ['二', 2], ['三', 3], ['四', 4], ['五', 5],
  ['六', 6], ['七', 7], ['八', 8], ['九', 9],
]);

const BOARD_NAMES = new Map([
  ['吏部', 'Board of Personnel'],
  ['戶部', 'Board of Revenue'],
  ['礼部', 'Board of Rites'],
  ['禮部', 'Board of Rites'],
  ['兵部', 'Board of War'],
  ['刑部', 'Board of Punishments'],
  ['工部', 'Board of Works'],
]);

const POST_NAMES = [
  ['滿左侍郎', 'Manchu Left Vice Minister'],
  ['漢左侍郎', 'Han Left Vice Minister'],
  ['滿右侍郎', 'Manchu Right Vice Minister'],
  ['漢右侍郎', 'Han Right Vice Minister'],
  ['滿尚書', 'Manchu Minister'],
  ['漢尚書', 'Han Minister'],
  ['左侍郎', 'Left Vice Minister'],
  ['右侍郎', 'Right Vice Minister'],
  ['侍郎', 'Vice Minister'],
  ['尚書', 'Minister'],
].sort((a, b) => b[0].length - a[0].length);

const ACTIONS = [
  ['仍管刑部', 'continued to supervise the Board of Punishments'],
  ['自兵部參政改', 'was reassigned from the post of canzheng in the Board of War'],
  ['自承政改', 'was reassigned from the post of chengzheng'],
  ['自參政改', 'was reassigned from the post of canzheng'],
  ['京察降', 'was demoted after the capital evaluation'],
  ['告養免', 'was relieved after requesting leave to care for a parent'],
  ['乞養免', 'was relieved after requesting leave to care for a parent'],
  ['乞休，免', 'requested retirement and was removed from office'],
  ['乞休免', 'requested retirement and was removed from office'],
  ['乞免', 'requested to be relieved'],
  ['省墓免', 'was relieved to visit ancestral graves'],
  ['假免', 'was relieved while on leave'],
  ['暫兼署', 'temporarily served concurrently in an acting capacity'],
  ['兼理刑部尚書', 'concurrently managed the post of Minister of the Board of Punishments'],
  ['加尚書銜', 'was granted ministerial rank'],
  ['加太子太師', 'was granted the title of Grand Preceptor of the Heir Apparent'],
  ['加太子太傅', 'was granted the title of Grand Tutor of the Heir Apparent'],
  ['加太子太保', 'was granted the title of Grand Guardian of the Heir Apparent'],
  ['加太子少師', 'was granted the title of Junior Preceptor of the Heir Apparent'],
  ['加太子少傅', 'was granted the title of Junior Tutor of the Heir Apparent'],
  ['加太子少保', 'was granted the title of Junior Guardian of the Heir Apparent'],
  ['加太師', 'was granted the title of Grand Preceptor'],
  ['加太傅', 'was granted the title of Grand Tutor'],
  ['加太保', 'was granted the title of Grand Guardian'],
  ['加少師', 'was granted the title of Junior Preceptor'],
  ['加少傅', 'was granted the title of Junior Tutor'],
  ['加少保', 'was granted the title of Junior Guardian'],
  ['調補', 'was transferred to fill the vacancy'],
  ['轉遷', 'was transferred'],
  ['遷，仍護', 'was transferred but continued to act in charge'],
  ['革，逮', 'was dismissed and arrested'],
  ['革，留', 'was dismissed but retained'],
  ['革逮', 'was dismissed and arrested'],
  ['免兼署', 'was relieved of concurrent acting duties'],
  ['免署', 'was relieved from acting service'],
  ['免兼', 'was relieved of concurrent duties'],
  ['停職', 'was suspended from office'],
  ['察議', 'was placed under investigation'],
  ['遇害', 'was killed'],
  ['殉難', 'died in service'],
  ['陣亡', 'was killed in battle'],
  ['出征', 'went on campaign'],
  ['出使', 'went on a diplomatic mission'],
  ['回內院', 'returned to the Inner Academy'],
  ['回本任', 'returned to the original post'],
  ['回原任', 'returned to the original post'],
  ['回籍', 'returned to his native place'],
  ['回京', 'returned to the capital'],
  ['來京', 'came to the capital'],
  ['留京', 'remained in the capital'],
  ['召回京', 'was summoned back to the capital'],
  ['召來京', 'was summoned to the capital'],
  ['陛見', 'had an audience at court'],
  ['赴奉天', 'went to Fengtian'],
  ['赴福建', 'went to Fujian'],
  ['赴軍營', 'went to the military camp'],
  ['稽查陝西軍需', 'inspected Shaanxi military supplies'],
  ['入覲', 'came to court'],
  ['入援', 'entered to provide military support'],
  ['駐藏', 'was stationed in Tibet'],
  ['駐庫', 'was stationed at the treasury'],
  ['改授', 'was reassigned'],
  ['開缺', 'vacated the post'],
  ['裁缺', 'had the post abolished'],
  ['裁，卸', 'had the post abolished and left office'],
  ['降四品銜留任', 'was retained in office with fourth-rank title'],
  ['降留', 'was demoted but retained'],
  ['鐫級', 'was degraded in rank'],
  ['議處', 'was referred for disciplinary deliberation'],
  ['逮問', 'was arrested for questioning'],
  ['憂免', 'was relieved due to mourning'],
  ['丁憂', 'went into mourning'],
  ['予告', 'was granted leave'],
  ['告養', 'requested leave to care for a parent'],
  ['病免', 'was relieved due to illness'],
  ['疾免', 'was relieved due to illness'],
  ['病假', 'went on sick leave'],
  ['病卸', 'left the post due to illness'],
  ['病休', 'retired due to illness'],
  ['病解', 'was relieved due to illness'],
  ['就任', 'took office'],
  ['解任', 'was relieved of office'],
  ['守陵', 'was assigned to guard the mausoleum'],
  ['乞養', 'requested leave to care for a parent'],
  ['乞休', 'requested retirement'],
  ['尋回任', 'soon returned to office'],
  ['回任', 'returned to office'],
  ['休致', 'retired'],
  ['致仕', 'retired from office'],
  ['棄市', 'was executed in the marketplace'],
  ['自盡', 'committed suicide'],
  ['被刺', 'was assassinated'],
  ['死之', 'died there'],
  ['去職', 'left office'],
  ['賜卹', 'was granted posthumous compensation'],
  ['終養', 'retired to care for a parent'],
  ['入閣', 'entered the Grand Secretariat'],
  ['另簡', 'was separately selected'],
  ['覲', 'came to court'],
  ['仍任', 'remained in office'],
  ['兼署', 'concurrently served in an acting capacity'],
  ['暫署', 'temporarily served in an acting capacity'],
  ['授', 'was appointed'],
  ['實授', 'was substantively appointed'],
  ['升署', 'was promoted and served in an acting capacity'],
  ['遷移', 'was transferred'],
  ['遷', 'was transferred'],
  ['調', 'was transferred'],
  ['轉', 'was transferred laterally'],
  ['護理', 'acted in charge'],
  ['復', 'was restored'],
  ['卒', 'died'],
  ['革', 'was dismissed'],
  ['免', 'was removed from office'],
  ['降', 'was demoted'],
  ['署', 'served in an acting capacity'],
  ['休', 'retired'],
  ['補', 'was appointed to fill the vacancy'],
  ['代', 'served as replacement'],
  ['假', 'went on leave'],
  ['任', 'was appointed'],
  ['召', 'was summoned'],
  ['卸', 'left the post'],
  ['留', 'was retained'],
  ['罷', 'was removed from office'],
  ['解', 'was relieved of office'],
  ['憂', 'went into mourning'],
  ['裁', 'had the post abolished'],
  ['撤', 'was withdrawn'],
  ['殉', 'died in service'],
  ['護', 'acted in charge'],
  ['議', 'was placed under review'],
  ['差', 'was sent on assignment'],
  ['逮', 'was arrested'],
].sort((a, b) => b[0].length - a[0].length);

const OFFICE_PREFIX_ACTIONS = [
  ['暫兼署', 'temporarily served concurrently in an acting capacity'],
  ['以大學士管', 'as Grand Secretary managed the post of'],
  ['復爲', 'was restored'],
  ['復為', 'was restored'],
  ['升署', 'was promoted and served in an acting capacity'],
  ['兼署', 'concurrently served in an acting capacity'],
  ['暫署', 'temporarily served in an acting capacity'],
  ['護理', 'acted in charge'],
  ['護', 'acted in charge'],
  ['回本任', 'returned to the original post'],
  ['回原任', 'returned to the original post'],
  ['回任', 'returned to office'],
  ['補', 'was appointed to fill the post of'],
  ['改', 'was reassigned'],
  ['授', 'was appointed'],
  ['兼', 'concurrently served'],
  ['管', 'managed the post of'],
  ['仍', 'remained'],
  ['回', 'returned to office'],
  ['署', 'served in an acting capacity'],
].sort((a, b) => b[0].length - a[0].length);

const JURISDICTIONS = [
  ['江南河道', 'the Jiangnan River Circuit'],
  ['河東河道', 'the Hedong River Circuit'],
  ['東三省', 'the Three Eastern Provinces'],
  ['兩江', 'Liangjiang'],
  ['兩廣', 'Liangguang'],
  ['閩浙', 'Min-Zhe'],
  ['湖廣', 'Huguang'],
  ['雲貴', 'Yungui'],
  ['陝甘', 'Shaanxi-Gansu'],
  ['漕運', 'Grain Transport'],
  ['直隸', 'Zhili'],
  ['江蘇', 'Jiangsu'],
  ['江西', 'Jiangxi'],
  ['浙江', 'Zhejiang'],
  ['福建', 'Fujian'],
  ['山東', 'Shandong'],
  ['山西', 'Shanxi'],
  ['河南', 'Henan'],
  ['湖北', 'Hubei'],
  ['湖南', 'Hunan'],
  ['廣東', 'Guangdong'],
  ['廣西', 'Guangxi'],
  ['四川', 'Sichuan'],
  ['雲南', 'Yunnan'],
  ['貴州', 'Guizhou'],
  ['陝西', 'Shaanxi'],
  ['甘肅', 'Gansu'],
  ['安徽', 'Anhui'],
  ['奉天', 'Fengtian'],
  ['吉林', 'Jilin'],
  ['黑龍江', 'Heilongjiang'],
].sort((a, b) => b[0].length - a[0].length);

const STANDALONE_OFFICES = [
  ['喀喇沙爾辦事大臣', 'Resident Minister at Karashahr'],
  ['喀什噶爾辦事大臣', 'Resident Minister at Kashgar'],
  ['塔爾巴哈台參贊大臣', 'Councillor Minister at Tarbagatai'],
  ['科布多參贊大臣', 'Councillor Minister at Kobdo'],
  ['烏什參贊大臣', 'Councillor Minister at Ush'],
  ['哈密辦事大臣', 'Resident Minister at Hami'],
  ['和闐辦事大臣', 'Resident Minister at Khotan'],
  ['駐藏辦事大臣', 'Resident Minister in Tibet'],
  ['駐藏辦事', 'Resident Minister in Tibet'],
  ['定邊左副將軍', 'Left Deputy General for Border Pacification'],
  ['盛京將軍', 'General of Shengjing'],
  ['熱河副都統', 'Vice Commander-in-Chief of Rehe'],
  ['理藩院左侍郎', 'Left Vice Minister of the Court of Colonial Affairs'],
  ['理藩院右侍郎', 'Right Vice Minister of the Court of Colonial Affairs'],
  ['理藩院侍郎', 'Vice Minister of the Court of Colonial Affairs'],
  ['理藩院尚書', 'Minister of the Court of Colonial Affairs'],
  ['都察院左承政', 'Left Chengzheng of the Censorate'],
  ['都察院右承政', 'Right Chengzheng of the Censorate'],
  ['都察院承政', 'Chengzheng of the Censorate'],
  ['都察院左參政', 'Left Canzheng of the Censorate'],
  ['都察院右參政', 'Right Canzheng of the Censorate'],
  ['都察院參政', 'Canzheng of the Censorate'],
  ['左都御史', 'Left Censor-in-Chief'],
  ['右都御史', 'Right Censor-in-Chief'],
  ['左副都御史', 'Left Deputy Censor-in-Chief'],
  ['右副都御史', 'Right Deputy Censor-in-Chief'],
  ['副都御史', 'Deputy Censor-in-Chief'],
  ['總督', 'Governor-General'],
  ['巡撫', 'Governor'],
].sort((a, b) => b[0].length - a[0].length);

function usage() {
  console.error(`Usage:
  node scripts/repair-qingshigao-table-prefix-omissions.mjs [--apply]
    [--chapter CHAPTER] [--queue PATH] [--limit N] [--reviewer NAME]

Dry-run by default. This repairs only exact single-unit qingshigao table prefix
omissions and marks the matching queue items included.

Apply mode is disabled because this script generates English. Use dry-run output
as a candidate list, then apply source text and translations manually.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    chapters: new Set(),
    queues: [],
    limit: Infinity,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      usage();
      process.exit(0);
    }
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--chapter') {
      opts.chapters.add(String(argv[++i] || '').padStart(3, '0'));
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length).padStart(3, '0'));
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i] || '');
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i]);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length));
      continue;
    }
    if (arg === '--reviewer') {
      opts.reviewer = argv[++i] || DEFAULT_REVIEWER;
      continue;
    }
    if (arg.startsWith('--reviewer=')) {
      opts.reviewer = arg.slice('--reviewer='.length) || DEFAULT_REVIEWER;
      continue;
    }
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(2);
  }

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues;
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry));
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (status === 'applied' || decision === 'applied' || decision === 'included') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function normalizeText(text) {
  return String(text || '').replace(/\s+/gu, '');
}

function compactKey(text) {
  return normalizeText(text).replace(/[^\p{Script=Han}0-9]/gu, '');
}

function sourceField(unit) {
  return SOURCE_FIELDS.find((field) => typeof unit?.[field] === 'string');
}

function flattenUnits(chapter) {
  const units = [];
  for (let blockIndex = 0; blockIndex < (chapter.content || []).length; blockIndex += 1) {
    const block = chapter.content[blockIndex];
    for (const collectionName of ['sentences', 'cells']) {
      const collection = block?.[collectionName];
      if (!Array.isArray(collection)) continue;
      for (let unitIndex = 0; unitIndex < collection.length; unitIndex += 1) {
        const unit = collection[unitIndex];
        const field = sourceField(unit);
        if (!field) continue;
        units.push({
          unit,
          field,
          id: unit.id || '',
          blockIndex,
          blockType: block.type || '',
          unitIndex,
        });
      }
    }
  }
  return units;
}

const chapterCache = new Map();

function loadChapter(file) {
  const abs = path.resolve(file);
  if (!chapterCache.has(abs)) {
    const chapter = JSON.parse(fs.readFileSync(abs, 'utf8'));
    const units = flattenUnits(chapter);
    chapterCache.set(abs, {
      file: abs,
      chapter,
      units,
      byId: new Map(units.map((entry) => [entry.id, entry])),
      changed: false,
    });
  }
  return chapterCache.get(abs);
}

function firstTranslation(unit) {
  if (Array.isArray(unit.translations) && unit.translations[0]) return unit.translations[0];
  unit.translations = [{
    lang: 'en',
    literal: '',
    idiomatic: '',
    translator: DEFAULT_TRANSLATOR,
    model: DEFAULT_MODEL,
  }];
  return unit.translations[0];
}

function sexagenary(day) {
  if (!day || day.length !== 2) return '';
  const stem = STEMS.get(day[0]);
  const branch = BRANCHES.get(day[1]);
  return stem && branch ? `${stem}${branch}` : '';
}

function parseMonthDay(text) {
  const match = String(text || '').match(/^(閏)?(十一|十二|十|正|[一二三四五六七八九])月([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?/u);
  if (!match) return null;
  const month = MONTHS.get(match[2]);
  if (!month) return null;
  const day = sexagenary(match[3] || '');
  const monthPhrase = `${match[1] ? 'intercalary ' : ''}${month} month`;
  return {
    zh: match[0],
    rest: text.slice(match[0].length),
    phrase: day ? `on the ${day} day of the ${monthPhrase}` : `in the ${monthPhrase}`,
  };
}

function parseDayOnly(text) {
  const match = String(text || '').match(/^([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/u);
  if (!match) return null;
  const day = sexagenary(match[1]);
  if (!day) return null;
  return {
    zh: match[0],
    rest: text.slice(match[0].length),
    phrase: `on the ${day} day`,
  };
}

function parseChineseNumber(text) {
  const value = String(text || '');
  if (CHINESE_DIGITS.has(value)) return CHINESE_DIGITS.get(value);
  if (/^\d+$/u.test(value)) return Number(value);
  if (value === '十') return 10;
  const tenIndex = value.indexOf('十');
  if (tenIndex >= 0) {
    const before = value.slice(0, tenIndex);
    const after = value.slice(tenIndex + 1);
    const tens = before ? CHINESE_DIGITS.get(before) : 1;
    const ones = after ? CHINESE_DIGITS.get(after) || 0 : 0;
    if (tens !== undefined && ones !== undefined) return tens * 10 + ones;
  }
  return null;
}

function parseEraYear(text) {
  const eras = [...ERAS.keys()].join('|');
  const match = String(text || '').match(new RegExp(`^(${eras})(元|[一二三四五六七八九十0-9]{1,3})年([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?`, 'u'));
  if (!match) return null;
  const era = ERAS.get(match[1]);
  const year = parseChineseNumber(match[2]);
  if (!era || !year) return null;
  const stemBranch = match[3] ? `, ${sexagenary(match[3])}` : '';
  return {
    zh: match[0],
    rest: text.slice(match[0].length),
    phrase: `in ${era} year ${year}${stemBranch}`,
  };
}

function splitDate(text) {
  return parseEraYear(text) || parseMonthDay(text) || parseDayOnly(text) || {
    zh: '',
    rest: text,
    phrase: '',
  };
}

function trailingDate(text) {
  const month = String(text || '').match(/^(?<names>.*?)(?<date>閏?(?:十一|十二|十|正|[一二三四五六七八九])月(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?)$/u);
  if (month?.groups?.date) {
    const parsed = parseMonthDay(month.groups.date);
    if (parsed && !parsed.rest) {
      return {
        names: month.groups.names,
        phrase: parsed.phrase,
      };
    }
  }

  const day = String(text || '').match(/^(?<names>.*?)(?<date>[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])$/u);
  if (day?.groups?.date) {
    const parsed = parseDayOnly(day.groups.date);
    if (parsed && !parsed.rest) {
      return {
        names: day.groups.names,
        phrase: parsed.phrase,
      };
    }
  }

  return {
    names: text,
    phrase: '',
  };
}

function splitNameActionPrefix(text) {
  const raw = cleanName(text);
  if (!raw) return { names: '', action: '' };
  if (raw.startsWith('起')) {
    const names = raw.slice(1);
    if (validNamePrefix(names)) return { names, action: 'was recalled to serve' };
  }
  for (const [zh, english] of OFFICE_PREFIX_ACTIONS) {
    if (raw === zh) return { names: '', action: english };
    if (raw.endsWith(zh)) {
      const names = raw.slice(0, raw.length - zh.length);
      if (validNamePrefix(names)) return { names, action: english };
    }
  }
  if (raw === '爲' || raw === '為') return { names: '', action: 'was appointed' };
  if (raw.endsWith('爲') || raw.endsWith('為')) {
    const names = raw.slice(0, -1);
    if (validNamePrefix(names)) return { names, action: 'was appointed' };
  }
  return { names: raw, action: '' };
}

function officeActionOnly(text) {
  const raw = cleanName(text);
  if (!raw) return '';
  for (const [zh, english] of OFFICE_PREFIX_ACTIONS) {
    if (raw === zh) return english;
  }
  if (raw === '爲' || raw === '為') return 'was appointed';
  return '';
}

function leadingDate(text) {
  const parsed = parseMonthDay(text) || parseDayOnly(text);
  if (!parsed?.zh || !parsed.rest) return null;
  return parsed;
}

function embeddedDatePrefix(text, { allowDayOnly = false } = {}) {
  const value = String(text || '');
  const dateRe = allowDayOnly
    ? /閏?(?:十一|十二|十|正|[一二三四五六七八九])月(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]/gu
    : /閏?(?:十一|十二|十|正|[一二三四五六七八九])月(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?/gu;
  for (const match of value.matchAll(dateRe)) {
    if (match.index === 0) continue;
    const before = value.slice(0, match.index);
    const parsed = parseMonthDay(value.slice(match.index)) || (allowDayOnly ? parseDayOnly(value.slice(match.index)) : null);
    if (!parsed?.zh || !parsed.rest) continue;
    if (!validNamePrefix(before) || !validNamePrefix(parsed.rest)) continue;
    return {
      priorNames: cleanName(before),
      names: parsed.rest,
      phrase: parsed.phrase,
    };
  }
  return null;
}

function combinedDatePhrase(...phrases) {
  return phrases.map((phrase) => String(phrase || '').trim()).filter(Boolean).join(', ');
}

function officePrefixInfo(rawPrefix) {
  const leading = leadingDate(rawPrefix);
  if (leading) return { names: leading.rest, phrase: leading.phrase };

  const embedded = embeddedDatePrefix(rawPrefix, { allowDayOnly: true });
  if (embedded) {
    const action = officeActionOnly(embedded.names);
    if (action) {
      return {
        names: embedded.priorNames,
        action,
        phrase: embedded.phrase,
      };
    }
    return embedded;
  }

  return trailingDate(rawPrefix);
}

function jurisdictionInfo(rawPrefix, officeZh, officeEn) {
  if (officeZh !== '總督' && officeZh !== '巡撫') return null;
  for (const [jurisdictionZh, jurisdictionEn] of JURISDICTIONS) {
    if (!rawPrefix.endsWith(jurisdictionZh)) continue;
    const prefix = rawPrefix.slice(0, -jurisdictionZh.length);
    if (!prefix) continue;
    return {
      prefix,
      english: `${officeEn} of ${jurisdictionEn}`,
    };
  }
  return null;
}

function officeInfo(text) {
  const notAssumed = String(text || '').match(/^(.*?)(?:，)?未任$/u);
  if (notAssumed?.[1]) {
    const info = officeInfo(notAssumed[1]);
    if (info) {
      return {
        ...info,
        action: 'was named',
        afterOffice: 'but did not take office',
      };
    }
  }

  for (const [boardZh, boardEn] of BOARD_NAMES.entries()) {
    if (!text.includes(boardZh)) continue;
    for (const [postZh, postEn] of POST_NAMES) {
      const suffix = `${boardZh}${postZh}`;
      if (text.endsWith(suffix)) {
        const rawPrefix = text.slice(0, -suffix.length);
        const prefix = officePrefixInfo(rawPrefix);
        const nameAction = splitNameActionPrefix(prefix.names);
        return {
          names: nameAction.names,
          action: nameAction.action || prefix.action || '',
          datePhrase: prefix.phrase,
          priorNames: prefix.priorNames || '',
          english: `${postEn} of the ${boardEn}`,
        };
      }
    }
  }
  for (const [officeZh, officeEn] of STANDALONE_OFFICES) {
    if (!text.endsWith(officeZh)) continue;
    const rawPrefix = text.slice(0, -officeZh.length);
    const jurisdiction = jurisdictionInfo(rawPrefix, officeZh, officeEn);
    const prefix = officePrefixInfo(jurisdiction?.prefix || rawPrefix);
    const nameAction = splitNameActionPrefix(prefix.names);
    return {
      names: nameAction.names,
      action: nameAction.action || prefix.action || '',
      datePhrase: prefix.phrase,
      priorNames: prefix.priorNames || '',
      english: jurisdiction?.english || officeEn,
    };
  }
  return null;
}

function actionInfo(text) {
  const rename = String(text || '').match(/^(?<before>.*?)(?<date>閏?(?:十一|十二|十|正|[一二三四五六七八九])月(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?)更名(?<after>[\p{Script=Han}]+)$/u);
  if (rename?.groups && validNamePrefix(rename.groups.before) && validNamePrefix(rename.groups.after)) {
    const parsed = parseMonthDay(rename.groups.date);
    if (parsed && !parsed.rest) {
      return {
        names: rename.groups.before,
        datePhrase: parsed.phrase,
        english: `changed name to ${cleanName(rename.groups.after)}`,
      };
    }
  }

  for (const [zh, english] of ACTIONS) {
    if (text.endsWith(zh)) {
      const rawPrefix = text.slice(0, -zh.length);
      const prefix = embeddedDatePrefix(rawPrefix, { allowDayOnly: true }) || trailingDate(rawPrefix);
      const names = cleanName(prefix.names);
      if (names === '尋') {
        return {
          names: '',
          datePhrase: prefix.phrase,
          adverb: 'soon',
          english,
        };
      }
      return {
        names: prefix.names,
        datePhrase: prefix.phrase,
        priorNames: prefix.priorNames || '',
        english,
      };
    }
  }
  return null;
}

function sentenceParts(text) {
  const matches = String(text || '').match(SENTENCE_RE) || [];
  return matches
    .map((part) => part.trim())
    .filter((part) => part && HAN_OR_DIGIT_RE.test(part));
}

function stripFinalPunctuation(text) {
  return String(text || '').replace(/[。！？；]+$/u, '');
}

function cleanName(text) {
  return String(text || '').replace(/[，、：:；;。！？\s]+/gu, '');
}

function validNamePrefix(text) {
  const prefix = cleanName(text);
  if (!prefix || !HAN_RE.test(prefix)) return false;
  if (prefix.length > 30) return false;
  if (!/^[\p{Script=Han}]+$/u.test(prefix)) return false;
  if (/[月日朔晦]/u.test(prefix)) return false;
  return true;
}

function validInsertedNameChunk(text) {
  const chunk = cleanName(text);
  if (!chunk || !HAN_RE.test(chunk)) return false;
  if (chunk.length > 120) return false;
  if (!/^[\p{Script=Han}]+$/u.test(chunk)) return false;
  if (/[年月朔晦]/u.test(chunk)) return false;
  const forbiddenTerms = [
    ...BOARD_NAMES.keys(),
    ...POST_NAMES.map(([zh]) => zh),
    ...STANDALONE_OFFICES.map(([zh]) => zh),
    ...ACTIONS.map(([zh]) => zh),
    '康熙', '雍正', '乾隆', '嘉慶', '道光', '咸豐', '同治', '光緒', '宣統', '順治',
  ];
  return !forbiddenTerms.some((term) => term && chunk.includes(term));
}

function insertedChunksBySubsequence(sourceCore, localCore) {
  const chunks = [];
  let sourceIndex = 0;

  for (const localChar of [...localCore]) {
    const nextIndex = sourceCore.indexOf(localChar, sourceIndex);
    if (nextIndex < 0) return null;
    if (nextIndex > sourceIndex) chunks.push(sourceCore.slice(sourceIndex, nextIndex));
    sourceIndex = nextIndex + localChar.length;
  }

  if (sourceIndex < sourceCore.length) chunks.push(sourceCore.slice(sourceIndex));
  const meaningful = chunks.map(cleanName).filter(Boolean);
  if (meaningful.length === 0) return null;
  if (!meaningful.every(validInsertedNameChunk)) return null;
  return meaningful;
}

function sourceOnlyAddsNames(sourcePart, localPart) {
  const sourceCore = normalizeText(stripFinalPunctuation(sourcePart));
  const localCore = normalizeText(stripFinalPunctuation(localPart));
  if (!sourceCore || !localCore || sourceCore === localCore) return null;

  if (sourceCore.endsWith(localCore)) {
    const prefix = sourceCore.slice(0, sourceCore.length - localCore.length);
    if (validInsertedNameChunk(prefix)) return { inserted: cleanName(prefix), position: 'prefix' };
  }

  const date = splitDate(localCore);
  if (date.zh && date.rest && sourceCore.startsWith(date.zh) && sourceCore.endsWith(date.rest)) {
    const inserted = sourceCore.slice(date.zh.length, sourceCore.length - date.rest.length);
    if (validInsertedNameChunk(inserted)) return { inserted: cleanName(inserted), position: 'after-date' };
  }

  const chunks = insertedChunksBySubsequence(sourceCore, localCore);
  if (chunks) {
    return {
      inserted: [...new Set(chunks)].join('、'),
      position: 'distributed-name-insertions',
    };
  }

  return null;
}

function capitalize(text) {
  return String(text || '').replace(/^[a-z]/u, (match) => match.toUpperCase());
}

function withDate(datePhrase, body) {
  const bodyText = String(body || '').trim();
  if (!datePhrase) return capitalize(bodyText);
  return `${capitalize(datePhrase)}, ${bodyText}`;
}

function translateClause(raw) {
  const core = stripFinalPunctuation(raw);
  if (!core) return '';

  const date = splitDate(core);
  const rest = date.rest;
  const office = officeInfo(rest);
  if (office) {
    const names = cleanName(office.names);
    const body = names && office.action
      ? office.action.endsWith(' of')
        ? `${names} ${office.action} ${office.english}.`
        : `${names} ${office.action} as ${office.english}.`
      : office.action
        ? office.action.endsWith(' of')
          ? `${office.action} ${office.english}.`
          : `${office.action} as ${office.english}.`
      : names
      ? `${names}: ${office.english}`
      : office.english;
    const bodyWithAfter = office.afterOffice
      ? `${body.replace(/\.$/u, '')} ${office.afterOffice}.`
      : body;
    const sentence = withDate(combinedDatePhrase(date.phrase, office.datePhrase), bodyWithAfter.endsWith('.') ? bodyWithAfter : `${bodyWithAfter}.`);
    return office.priorNames ? `${office.priorNames}. ${sentence}` : sentence;
  }

  const action = actionInfo(rest);
  if (action) {
    const names = cleanName(action.names);
    const body = names
      ? `${names} ${action.english}.`
      : `the officeholder ${action.english}.`;
    const adverbialBody = action.adverb ? `${action.adverb} ${body}` : body;
    const sentence = withDate(combinedDatePhrase(date.phrase, action.datePhrase), adverbialBody);
    return action.priorNames ? `${action.priorNames}. ${sentence}` : sentence;
  }

  const namesOnly = cleanName(rest);
  if (namesOnly && !date.phrase) return `${namesOnly}.`;
  if (namesOnly && date.phrase) return withDate(date.phrase, `${namesOnly}.`);
  return `${core}.`;
}

function translateCell(zh) {
  const clauses = sentenceParts(zh);
  const english = clauses.map(translateClause).filter(Boolean).join(' ');
  return english || '';
}

function isSafeFormulaicTranslation(zh, english) {
  if (/(?:十一|十二|十|[一二三四五六七八九])(?=[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/u.test(zh)) return false;
  if (/(?:定有|冰免|十二月甲遷|十二與)/u.test(zh)) return false;
  if (/(?:民軍|失守|剿匪|督剿|會剿|辦後路軍需|居家待罪|赴阿克蘇|赴湘|赴肅州|祝嘏|皆未任)/u.test(zh)) return false;
  if (/(?:^|[\s,])(?:十一|十二|十|[一二三四五六七八九])(?::| was | served | retired| died| went | continued | remained | requested |Minister|Vice)/u.test(english)) return false;
  for (const match of english.matchAll(/[\p{Script=Han}]+/gu)) {
    const after = english.slice(match.index + match[0].length);
    if (/(?:辦事大臣|副都統|將軍|參贊大臣|駐藏辦事)/u.test(match[0])) return false;
    if (match[0].length <= 1 && after.startsWith(':')) return false;
    if (match[0].length <= 1 && /^(?: was\b| served\b| retired\b| died\b| went\b| continued\b| remained\b| requested\b| appointed\b| removed\b| dismissed\b| transferred\b| relieved\b| arrested\b| had\b| took\b)/u.test(after)) return false;
    if (/(?:[一二三四五六七八九十正閏]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|告養|病痊|回任|尋回|自(?:兵部)?(?:承政|參政)改|出征|來京|入覲|回內院|加(?:尚書銜|太[子師傅保]|少[師傅保]|太子(?:太|少)[師傅保])|理藩院|都察院)/u.test(match[0])) return false;
    if (/(?:兼|署|補|加)$/u.test(match[0]) && /^(?::| was\b| served\b)/u.test(after)) return false;
    if (/^(?::|\.| as\b| was\b| died\b| retired\b| served\b| went\b| came\b| left\b| soon\b| returned\b| continued\b| remained\b| requested\b| acted\b| demoted\b| dismissed\b| relieved\b| transferred\b| appointed\b| removed\b| assigned\b| managed\b| concurrently\b| vacated\b)/u.test(after)) continue;
    return false;
  }
  return true;
}

function hasTableLocation(item) {
  return [...(item.localRange?.locations || []), ...(item.sourceRange?.locations || [])]
    .some((location) => String(location.blockType || '').startsWith('table') || location.kind === 'cell');
}

function itemFile(item) {
  return item.file || path.join(DATA_DIR, item.book, `${String(item.chapter).padStart(3, '0')}.json`);
}

function indexesOf(text, needle) {
  const indexes = [];
  let cursor = String(text || '').indexOf(needle);
  while (cursor >= 0) {
    indexes.push(cursor);
    cursor = String(text || '').indexOf(needle, cursor + Math.max(needle.length, 1));
  }
  return indexes;
}

function replacementIndex(currentText, localText, context) {
  const candidates = indexesOf(currentText, localText);
  if (candidates.length === 0) return -1;
  if (candidates.length === 1) return candidates[0];

  const before = String(context?.beforeLocal || '');
  const after = String(context?.afterLocal || '');
  const beforeIndexes = before ? indexesOf(currentText, before) : [];
  const afterIndexes = after ? indexesOf(currentText, after) : [];
  const scored = candidates.map((index) => {
    const end = index + localText.length;
    let score = 0;
    let distance = 0;
    if (beforeIndexes.length > 0) {
      const anchors = beforeIndexes.map((beforeIndex) => beforeIndex + before.length).filter((pos) => pos <= index);
      if (anchors.length > 0) {
        const best = Math.max(...anchors);
        score += 2;
        distance += index - best;
      } else {
        distance += 100000;
      }
    }
    if (afterIndexes.length > 0) {
      const anchors = afterIndexes.filter((pos) => pos >= end);
      if (anchors.length > 0) {
        const best = Math.min(...anchors);
        score += 2;
        distance += best - end;
      } else {
        distance += 100000;
      }
    }
    return { index, score, distance };
  }).sort((a, b) => b.score - a.score || a.distance - b.distance || a.index - b.index);

  if (scored[0]?.score > 0) return scored[0].index;
  return -1;
}

function classifyItem(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.book !== 'qingshigao') return null;
  if (!hasTableLocation(item)) return null;
  if ((item.localRange?.ids || []).length !== 1) return null;
  if (!item.sourceRange?.text || !item.localRange?.text) return null;

  const source = normalizeText(item.sourceRange.text);
  const local = normalizeText(item.localRange.text);
  if (!source || !local || source === local) return null;

  const sourceParts = sentenceParts(item.sourceRange.text);
  const localParts = sentenceParts(item.localRange.text);
  if (sourceParts.length !== localParts.length || sourceParts.length === 0) return null;
  const insertions = [];
  for (let index = 0; index < sourceParts.length; index += 1) {
    const insertion = sourceOnlyAddsNames(sourceParts[index], localParts[index]);
    if (!insertion) return null;
    insertions.push(insertion.inserted);
  }

  const sourceKey = compactKey(item.sourceRange.text);
  const localKey = compactKey(item.localRange.text);
  if (!sourceKey || !localKey || sourceKey === localKey) return null;
  if (/[0-9A-Za-z_=<>|{}[\]]/u.test(item.sourceRange.text.slice(0, item.sourceRange.text.length - item.localRange.text.length))) return null;

  const file = itemFile(item);
  if (!fs.existsSync(file)) return null;
  const chapterRecord = loadChapter(file);
  const entry = chapterRecord.byId.get(item.localRange.ids[0]);
  if (!entry || !String(entry.blockType || '').startsWith('table')) return null;

  const currentText = entry.unit[entry.field];
  const index = replacementIndex(currentText, item.localRange.text, item.context || {});
  if (index < 0) return null;

  const nextText = `${currentText.slice(0, index)}${item.sourceRange.text}${currentText.slice(index + item.localRange.text.length)}`;
  if (nextText === currentText) return null;

  const nextEnglish = translateCell(nextText);
  if (!nextEnglish || !/[A-Za-z]/u.test(nextEnglish)) return null;
  if (!isSafeFormulaicTranslation(nextText, nextEnglish)) return null;

  return {
    item,
    chapterRecord,
    entry,
    index,
    prefix: [...new Set(insertions)].join('、'),
    currentText,
    nextText,
    nextEnglish,
  };
}

function entriesForLocations(chapterRecord, locations) {
  const entries = [];
  const seen = new Set();
  for (const location of locations || []) {
    const id = location.id || '';
    if (!id || seen.has(id)) continue;
    const entry = chapterRecord.byId.get(id);
    if (!entry || !String(entry.blockType || '').startsWith('table')) return [];
    entries.push(entry);
    seen.add(id);
  }
  return entries;
}

function findSequentialOccurrences(entries, localParts) {
  const occurrences = [];
  let entryCursor = 0;
  let offsetCursor = 0;

  for (const localPart of localParts) {
    let found = null;
    for (let entryIndex = entryCursor; entryIndex < entries.length; entryIndex += 1) {
      const entry = entries[entryIndex];
      const currentText = String(entry.unit[entry.field] || '');
      const start = entryIndex === entryCursor ? offsetCursor : 0;
      const index = currentText.indexOf(localPart, start);
      if (index < 0) continue;
      found = { entry, entryIndex, index, localPart };
      entryCursor = entryIndex;
      offsetCursor = index + localPart.length;
      break;
    }
    if (!found) return [];
    occurrences.push(found);
  }

  return occurrences;
}

function classifyRangeItem(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.book !== 'qingshigao') return null;
  if (!hasTableLocation(item)) return null;
  if ((item.localRange?.ids || []).length <= 1) return null;
  if (!item.sourceRange?.text || !item.localRange?.text) return null;

  const sourceParts = sentenceParts(item.sourceRange.text);
  const localParts = sentenceParts(item.localRange.text);
  if (sourceParts.length !== localParts.length || sourceParts.length < 2) return null;

  const file = itemFile(item);
  if (!fs.existsSync(file)) return null;
  const chapterRecord = loadChapter(file);
  const entries = entriesForLocations(chapterRecord, item.localRange.locations || []);
  if (entries.length === 0) return null;

  const occurrences = findSequentialOccurrences(entries, localParts);
  if (occurrences.length !== localParts.length) return null;

  const repairs = [];
  const prefixes = [];
  for (let index = 0; index < sourceParts.length; index += 1) {
    const insertion = sourceOnlyAddsNames(sourceParts[index], localParts[index]);
    if (!insertion) return null;
    const english = translateCell(sourceParts[index]);
    if (!english || !/[A-Za-z]/u.test(english)) return null;
    if (!isSafeFormulaicTranslation(sourceParts[index], english)) return null;
    repairs.push({
      ...occurrences[index],
      sourcePart: sourceParts[index],
      inserted: insertion.inserted,
    });
    prefixes.push(insertion.inserted);
  }

  const grouped = new Map();
  for (const repair of repairs) {
    const key = repair.entry.id;
    if (!grouped.has(key)) grouped.set(key, { entry: repair.entry, replacements: [] });
    grouped.get(key).replacements.push(repair);
  }

  const changes = [];
  for (const group of grouped.values()) {
    const currentText = String(group.entry.unit[group.entry.field] || '');
    let nextText = currentText;
    for (const replacement of [...group.replacements].sort((a, b) => b.index - a.index)) {
      nextText = `${nextText.slice(0, replacement.index)}${replacement.sourcePart}${nextText.slice(replacement.index + replacement.localPart.length)}`;
    }
    if (nextText === currentText) return null;
    const nextEnglish = translateCell(nextText);
    if (!nextEnglish || !/[A-Za-z]/u.test(nextEnglish)) return null;
    if (!isSafeFormulaicTranslation(nextText, nextEnglish)) return null;
    changes.push({
      entry: group.entry,
      currentText,
      nextText,
      nextEnglish,
      replacements: group.replacements,
    });
  }

  return {
    item,
    chapterRecord,
    changes,
    prefix: [...new Set(prefixes)].join('、'),
  };
}

function appendNote(notes, addition) {
  const current = String(notes || '').trim();
  if (!current) return addition;
  if (current.includes(addition)) return current;
  return `${current}\n${addition}`;
}

function applyRepair(repair, now, reviewer) {
  if (Array.isArray(repair.changes)) {
    for (const change of repair.changes) {
      change.entry.unit[change.entry.field] = change.nextText;
      const translation = firstTranslation(change.entry.unit);
      translation.lang = translation.lang || 'en';
      translation.literal = change.nextEnglish;
      translation.idiomatic = change.nextEnglish;
      translation.translator = DEFAULT_TRANSLATOR;
      translation.model = DEFAULT_MODEL;
      translation.allowChineseCharacters = true;
      change.entry.unit.allowChineseCharacters = true;
    }
    repair.chapterRecord.changed = true;

    repair.item.status = 'applied';
    repair.item.decision = 'included';
    repair.item.reviewedAt = repair.item.reviewedAt || now;
    repair.item.reviewer = repair.item.reviewer || reviewer;
    repair.item.appliedAt = now;
    repair.item.appliedSummary = {
      mode: 'qingshigao-table-prefix-range-source-repair',
      localIds: repair.changes.map((change) => change.entry.id),
      prefixes: repair.prefix,
    };
    repair.item.notes = appendNote(
      repair.item.notes,
      'Applied Qing table source prefix repairs across a sequential table range and regenerated formulaic office-table English cells; Chinese names intentionally retained with allowChineseCharacters.',
    );
    return;
  }

  repair.entry.unit[repair.entry.field] = repair.nextText;
  const translation = firstTranslation(repair.entry.unit);
  translation.lang = translation.lang || 'en';
  translation.literal = repair.nextEnglish;
  translation.idiomatic = repair.nextEnglish;
  translation.translator = DEFAULT_TRANSLATOR;
  translation.model = DEFAULT_MODEL;
  translation.allowChineseCharacters = true;
  repair.entry.unit.allowChineseCharacters = true;
  repair.chapterRecord.changed = true;

  repair.item.status = 'applied';
  repair.item.decision = 'included';
  repair.item.reviewedAt = repair.item.reviewedAt || now;
  repair.item.reviewer = repair.item.reviewer || reviewer;
  repair.item.appliedAt = now;
  repair.item.appliedSummary = {
    mode: 'qingshigao-table-prefix-source-repair',
    localId: repair.entry.id,
    prefix: repair.prefix,
  };
  repair.item.notes = appendNote(
    repair.item.notes,
    'Applied exact Qing table source prefix repair and regenerated the formulaic office-table English cell; Chinese names intentionally retained with allowChineseCharacters.',
  );
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.apply) {
    throw new Error('Apply mode is disabled for repair-qingshigao-table-prefix-omissions because translations must be manual. Run without --apply to generate candidates.');
  }
  const now = new Date().toISOString();
  const summary = {
    apply: opts.apply,
    repaired: 0,
    touchedQueueFiles: 0,
    touchedChapterFiles: 0,
    byChapter: {},
    byPrefix: {},
    samples: [],
    skippedAfterLimit: 0,
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changedQueue = false;
    for (const item of queue.items || []) {
      if (summary.repaired >= opts.limit) {
        summary.skippedAfterLimit += 1;
        continue;
      }
      const chapter = String(item.chapter || '').padStart(3, '0');
      if (opts.chapters.size > 0 && !opts.chapters.has(chapter)) continue;
      const repair = classifyItem(item) || classifyRangeItem(item);
      if (!repair) continue;

      summary.repaired += 1;
      summary.byChapter[chapter] = (summary.byChapter[chapter] || 0) + 1;
      summary.byPrefix[repair.prefix] = (summary.byPrefix[repair.prefix] || 0) + 1;
      if (summary.samples.length < 30) {
        summary.samples.push({
          id: item.id,
          chapter,
          localId: repair.entry?.id || repair.changes?.map((change) => change.entry.id).join(','),
          prefix: repair.prefix,
          zhBefore: repair.currentText || repair.changes?.map((change) => change.currentText).join(' | '),
          zhAfter: repair.nextText || repair.changes?.map((change) => change.nextText).join(' | '),
          englishAfter: repair.nextEnglish || repair.changes?.map((change) => change.nextEnglish).join(' | '),
        });
      }

      if (!opts.apply) continue;
      applyRepair(repair, now, opts.reviewer);
      changedQueue = true;
    }

    if (opts.apply && changedQueue) {
      queue.updatedAt = now;
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
      summary.touchedQueueFiles += 1;
    }
  }

  if (opts.apply) {
    for (const record of chapterCache.values()) {
      if (!record.changed) continue;
      fs.writeFileSync(record.file, `${JSON.stringify(record.chapter, null, 2)}\n`, 'utf8');
      summary.touchedChapterFiles += 1;
    }
  }

  console.log(JSON.stringify(summary, null, 2));
}

export {
  DEFAULT_MODEL,
  DEFAULT_TRANSLATOR,
  appendNote,
  compactKey,
  firstTranslation,
  isSafeFormulaicTranslation,
  normalizeText,
  sentenceParts,
  sourceOnlyAddsNames,
  statusOf,
  translateCell,
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
