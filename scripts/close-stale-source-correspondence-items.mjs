#!/usr/bin/env node
/**
 * Close source-correspondence queue items that are already resolved in the
 * live corpus or are high-confidence upstream/list-boundary no-ops.
 *
 * Dry-run by default. Use --apply to update queue item decisions.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { variantKey, variantText } from './repair-source-queue-patterns.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.+\.json$/u;
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const DEFAULT_REVIEWER = 'close-stale-source-correspondence-items';

const BAD_BOUNDARY_RE = /[0-9%●□�\uE000-\uF8FF?？*\[\]{}<>]/u;
const LIVE_NOTE_MARKER_RE = /(?:注\[|\[[一二三四五六七八九十百千万萬0-9]+\]|〔|校勘記)/u;
const LOCAL_FULLER_BAD_RE = /[A-Za-z0-9%●□�\uE000-\uF8FF?？*\[\]{}<>#]|__TOC__|\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=|Category:|全文以|中華書局|為本校|校勘|諸本|百衲|汲本|殿本/iu;

const DATE_PREFIX_RE = /^(?:[一二三四五六七八九十百千万萬廿卅元正閏年月日春夏秋冬甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]|太元|義熙|開成|永徽|乾道|慶元|洪武|永樂|宣德|正統|嘉靖|萬曆|崇禎|天會|大定|皇統|普通|大同|黃龍|元鳳|神爵|太始|甘露|元康|五鳳|元狩|地節|元鼎|建武|順治|康熙|雍正|乾隆|嘉慶|道光|咸豐|同治|光緒|宣統)+$/u;
const SOURCE_DATE_START_RE = /^(?:\|\|)?[，,、：:；;]?(?:[一二三四五六七八九十百千万萬廿卅元正閏]+[年載月日]|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|春|夏|秋|冬|，|,|卒|薨|追諡|伏法|遣|復|加|以|[\p{Script=Han}]{1,8}侯)/u;
const BIOGRAPHY_START_RE = /^(?:字|其先|者|亦|初|少|本|為|仕|終|擢|進士|祖|父|子|孫|弟|兄|從|卒|性|通|襲|長|幼|見素|慎由|安潛|虛心|懷恩|叔夏|萬淑|盛彥師|劉孝孫|李守素|峘|能|勖|合|稷|元超|至|平|楚玉|朝宗|繩|維)/u;
const OFFICE_START_RE = /^(?:尚書|侍郎|監|少監|丞|令|卿|郎|員外|主簿|錄事|博士|祭酒|都督|刺史|太守|指揮|一人|二人|三人|四人|五人|六人|七人|八人|九人|十|百|千|左右|左|右|正|從|上|中|下)/u;
const GEO_OFFICE_PREFIX_RE = /(?:州|府|郡|縣|道|路|軍|監|省|部|司|院|寺|衛|衞|營|所|公主|皇后|王|侯|國)$/u;
const SECTION_PREFIX_RE = /^(?:序|結|史評|附|內官|外官|子|弟|兄|孫|曾孫|從子|族孫|附錄|本紀|列傳|志|表|傳|凡例)$/u;
const SONGSHI_LIST_START_RE = /^(?:宋初|周立|開寶|太平|慶曆|景祐|康定|府州|并州|麟州|陝西|諸州|本|左右|[一二三四五六七八九十百千万萬]+。)/u;
const LONG_HEADING_PREFIX_RE = /^(?:[\p{Script=Han}]{2,24}(?:篇|樂章|廟樂章)[一二三四五六七八九十百千万萬零〇0-9]*首?|志[一二三四五六七八九十百千万萬零〇0-9]+[\p{Script=Han}]{2,24})$/u;
const METHOD_HEADING_PREFIX_RE = /^(?:推|求|步|置|定|校|算|計)[\p{Script=Han}]{1,24}(?:術|法|度|數|率|分|日|月|歲|策|積|差|限|餘|行|端|首|候|辰|刻)?$/u;
const LIST_LABEL_PREFIX_RE = /^[\p{Script=Han}]{2,16}(?:弩手|清衛|衛|衞|軍|兵|將|校|尉|營|司|所|監|院|寺|府|州|縣|郡|路|道)$/u;

const COMMENTARY_SOURCE_RE = /^(?:【|注|\[[一二三四五六七八九十百千万萬0-9]+\]|〔[一二三四五六七八九十百千万萬0-9]+〕|《[^》]{1,30}》曰|(?:前書|續漢書|東觀記|東觀漢記|謝承書|袁山松書|華嶠書|漢官儀|禮記|論語|周易|左傳|春秋|公羊傳|穀梁傳|史記|說文|爾雅|新序|孟子|詩|尚書|孝經|博物志|鄭玄注|杜預注|師古曰|臣賢案|李賢曰|劉昭曰|袁宏曰|謝承曰|胡廣曰|蔡邕曰)[^。！？]{0,20}(?:曰|云|：)|[^，。！？；：「」『』]{1,16}(?:音[^。！？]{0,12}反|音[^。！？]{1,8}。?$|縣名|郡名|故城在|屬[^。！？]{1,12}郡|謂[^。！？]{1,20}也|猶[^。！？]{1,20}也|，[^。！？]{1,20}也。?$|也。?$))/u;
const BASE_TEXT_START_RE = /^(?:[，,、；;。]|[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|永平|建初|元和|永元|元初|建光|延光|永建|陽嘉|永和|漢安|建康|永嘉|本初|建和|和平|元嘉|永興|永壽|延熹|永康|建寧|熹平|光和|中平|初平|建安|帝|詔|遣|拜|遷|轉|徵|征|出|復|及|後|明年|其年|是歲|時|會|遂|乃|以|又|卒|薨|崩|殺|誅|立|封|為|字|子|父|祖)/u;
const SOURCE_ONLY_COMMENTARY_CUE_RE = /^(?:【|注|\[[一二三四五六七八九十百千万萬0-9]+\]|〔[一二三四五六七八九十百千万萬0-9]+〕|《[^》]{1,30}》曰|(?:前書|續漢書|東觀記|東觀漢記|謝承書|袁山松書|華嶠書|漢官儀|漢制|禮記|論語|周易|左傳|春秋|公羊傳|穀梁傳|史記|說文|爾雅|新序|孟子|詩|尚書|孝經|博物志|鄭玄注|杜預注|師古曰|臣賢案|李賢曰|劉昭曰|袁宏曰|謝承曰|胡廣曰|蔡邕曰)[^。！？]{0,24}(?:曰|云|：|，)|[^，。！？；：「」『』]{1,24}(?:，[^。！？]{1,40}也|謂[^。！？]{1,40}也|猶[^。！？]{1,40}也|即[^。！？]{1,40}也|見[^。！？]{1,24}|事見[^。！？]{1,24}|音[^。！？]{0,16}反|音[^。！？]{1,10}。?$|縣名|郡名|故城在|在今[^。！？]{1,24}|屬[^。！？]{1,16}郡))/u;
const SOURCE_ONLY_BASE_START_RE = /^(?:[」』”）)\]】〉》，、。；：！？\s]*)?(?:[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|[一二三四五六七八九十百千万萬元]+年|是歲|其年|明年|時|會|初|詔|帝|太后|皇后|遣|拜|遷|轉|徵|征|罷|免|封|立|殺|誅|卒|薨|崩|復|大赦|改元|又|乃|遂|以|及|後)/u;
const SOURCE_ONLY_BASE_EVENT_AFTER_ANNOTATION_RE = /[。！？；][」』”）)\]】〉》，、。；：！？\s]*(?:[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|[一二三四五六七八九十百千万萬元]+年|是歲|其年|明年|詔|帝|太后|天子|上|王|公|侯|書奏|[一-龥]{1,8}對曰|於是|乃|遂|其|會|時|是時|明日|後|遣|拜|遷|轉|徵|征|罷|免|封|立|殺|誅|卒|薨|崩|復|大赦|改元)/u;
const ANNOTATED_SOURCE_BOOKS = new Set(['shiji', 'hanshu', 'houhanshu', 'jiuwudaishi', 'xinwudaishi']);
const STRONG_COMMENTARY_START_RE = /^(?:[」』”）)\]】〉》，、。；：！？\s]*)?(?:【|注|\[[一二三四五六七八九十百千万萬0-9]+\]|〔[一二三四五六七八九十百千万萬0-9]+〕|《[^》]{1,30}》曰|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|案|臣昭案)[^。！？]{0,40}(?:曰|云|：|:)|[^，。！？；：「」『』]{1,20}(?:音[^。！？]{0,14}反|音[^。！？]{1,10}|讀曰[^。！？]{1,12}|一作[^。！？]{1,12})。?$|[^，。！？；：「」『』]{1,24}(?:縣名|郡名|故城在|在今[^。！？]{1,24}|今[^。！？]{1,24}(?:縣|州|郡)|屬[^。！？]{1,18}郡|謂[^。！？]{1,35}也|猶[^。！？]{1,35}也|即[^。！？]{1,35}也))/u;
const EMBEDDED_COMMENTARY_SENTENCE_RE = /^(?:[」』”）)\]】〉》，、。；：！？\s]*)?(?:【(?:正義|索隱|集解|考證|校勘記)[^】]*】|《[^》]{1,30}》曰|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|正義|索隱|集解|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|謝承《書》|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|案|臣昭案)[^。！？]{0,40}(?:曰|云|：|:)|[^。！？]{1,18}(?:謂|猶|即|為|作)[^。！？]{1,35}也。?$|[^。！？]{1,24}(?:縣名|郡名|星名|陵名|官名|故城在|今[^。！？]{1,24}(?:縣|州|郡)|屬[^。！？]{1,18}郡)[^。！？]{0,24}。?$|[^。！？]{1,20}(?:音[^。！？]{0,14}反|音[^。！？]{1,10}|讀曰[^。！？]{1,12}|一作[^。！？]{1,12})。?$)/u;
const EMBEDDED_COMMENTARY_BASE_START_RE = /^(?:[」』”）)\]】〉》，、。；：！？\s]*)?(?:[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|[一二三四五六七八九十百千万萬元]+年|是歲|其年|明年|時|會|初|詔|帝|太后|皇后|遣|拜|遷|轉|徵|征|罷|免|封|立|殺|誅|卒|薨|崩|復|大赦|改元|又|乃|遂|以|及|後|王|公|侯|子|父|兄|弟|母|妻|上|下|州|郡|縣)/u;
const INLINE_COMMENTARY_BLOCK_RE = /(?:【(?:正義|索隱|集解|考證|校勘記)[^】]*】[^。！？]{0,160}[。！？]?|《[^》]{1,30}》曰|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|正義|索隱|集解|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|謝承《書》|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|漢官秩|漢官|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|獨斷|史記|前書|漢儀注|案|臣昭案)[^。！？「」『』]{0,30}(?:曰|云|：|:))(?:[「『][\s\S]{1,260}?[」』]|[^。！？]{1,120}[。！？])/gu;
const INLINE_ANNOTATION_PLACEHOLDER_RE = /[●□�\uE000-\uF8FF]|［］|\[\]/u;
const LOCAL_TEMPLATE_ARTIFACT_RE = /\{\{|\}\}|-\{|\}-|__TOC__|\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=/iu;
const WIKISOURCE_DROPPED_TEMPLATE_HOLE_RE = /[，、。；：！？][，、。；：！？]|(?:曰|謂|谓|字|名|姓|氏|生|臣|爲|為|为|與|与|于|於|其|之|自稱|自称|是爲|是為|是为|王|公|侯|帝|太子|子|父|弟|兄|母|妻|卒|遣|使|詔|诏|命|拜|立|攻|伐|奔|如|至|入|造|遇|問|问|對|对|説|說|说|言)[，、。；：！？]/u;
const INLINE_ANNOTATION_TYPES = new Set(['text_discrepancy_candidate', 'source_replacement_candidate', 'source_omission_candidate']);
const INLINE_ANNOTATION_CITE_START_RE = /^(?:[」』”）)\]】〉》，、。；：！？\s]*)?(?:【(?:正義|索隱|集解|考證|校勘記)[^】]*】|注[\[［〔【]?[一二三四五六七八九十百千万萬0-9]+[\]］〕】]?|《[^》]{1,30}》曰|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|正義|索隱|集解|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|釋名|風俗通|廣雅|說文|爾雅|案|臣昭案)[^。！？]{0,40}(?:曰|云|：|:))/u;
const INLINE_ANNOTATION_CITE_ANYWHERE_RE = /【(?:正義|索隱|集解|考證|校勘記)[^】]*】|《[^》]{1,30}》曰|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|正義|索隱|集解|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|薛瑩|沈欽韓|周壽昌|漢官(?:舊儀|儀|秩)?|續漢書|東觀記|東觀漢記|前書(?:音義)?|漢書音義|蔡質漢儀|蔡質漢官儀|京房《?易傳》?|盧植禮注|董巴|魏氏春秋|釋名|風俗通|廣雅|說文|爾雅|案|臣昭案)[^。！？]{0,40}(?:曰|云|：|:)/u;
const INLINE_ANNOTATION_GLOSS_RE = /^(?:[」』”）)\]】〉》，、。；：！？\s]*)?(?:[^。！？]{1,24}(?:音[^。！？]{0,14}反|音[^。！？]{1,10}|讀曰[^。！？]{1,12}|一作[^。！？]{1,12})|[^。！？]{1,24}(?:縣名|郡名|星名|陵名|官名)|[^。！？]{0,30}(?:故城在|在今[^。！？]{1,24}|今[^。！？]{1,24}(?:縣|州|郡)|屬[^。！？]{1,18}郡)|[^。！？]{1,24}(?:謂|猶|即|為|作)[^。！？]{1,35}也|[^。！？]{1,12}，[^。！？]{1,35}也)[。！？]?$/u;
const INLINE_ANNOTATION_DATE_START_RE = /^(?:[\p{Script=Han}]{1,8}(?:元|[一二三四五六七八九十百千万萬廿卅0-9]+)年|[一二三四五六七八九十百千万萬廿卅0-9]+年|[春夏秋冬]|閏?[正一二三四五六七八九十0-9]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])/u;

function parseArgs(argv) {
  const opts = {
    apply: false,
    queues: [],
    books: new Set(),
    limit: 0,
    sampleLimit: 30,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') {
      opts.apply = true;
      continue;
    }
    if (arg === '--queue') {
      opts.queues.push(argv[++i]);
      continue;
    }
    if (arg.startsWith('--queue=')) {
      opts.queues.push(arg.slice('--queue='.length));
      continue;
    }
    if (arg === '--book') {
      opts.books.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--book=')) {
      opts.books.add(arg.slice('--book='.length));
      continue;
    }
    if (arg === '--limit') {
      opts.limit = Number(argv[++i] || 0);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || 0);
      continue;
    }
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++i] || 30);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length) || 30);
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
    throw new Error(`Unknown option: ${arg}`);
  }

  return opts;
}

function queuePaths(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (item.appliedAt || item.appliedSummary || status === 'applied' || decision === 'included' || decision === 'applied') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'rejected';
  if (status === 'approved' || decision === 'approved') return 'approved';
  return 'pending';
}

function sourceKey(unit) {
  return SOURCE_KEYS.find((key) => typeof unit?.[key] === 'string') || null;
}

function collectUnits(file) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    for (const [index, unit] of (block.sentences || []).entries()) {
      const key = sourceKey(unit);
      if (key) units.push({ blockIndex, kind: 'sentence', index, key, text: unit[key], id: unit.id || '' });
    }
    for (const [index, unit] of (block.cells || []).entries()) {
      const key = sourceKey(unit);
      if (key) units.push({ blockIndex, kind: 'cell', index, key, text: unit[key], id: unit.id || '' });
    }
  }
  return units;
}

const chapterCache = new Map();

function unitsFor(file) {
  const absolute = path.resolve(file);
  if (!chapterCache.has(absolute)) chapterCache.set(absolute, collectUnits(file));
  return chapterCache.get(absolute);
}

function locationIndex(location) {
  return location?.sentenceIndex ?? location?.cellIndex ?? location?.index;
}

function unitForLocation(units, location) {
  const byId = location.id
    ? units.find((candidate) => (
      candidate.id === location.id
      && (!location.kind || candidate.kind === location.kind)
      && (!location.field || candidate.key === location.field)
    ))
    : null;
  return byId || units.find((candidate) => (
    candidate.blockIndex === location.blockIndex
    && candidate.kind === location.kind
    && candidate.index === locationIndex(location)
    && (!location.field || candidate.key === location.field)
  ));
}

function liveRangeText(item) {
  const locations = item.localRange?.locations || [];
  if (!locations.length || !item.file || !fs.existsSync(item.file)) return null;
  const units = unitsFor(item.file);
  const parts = [];
  for (const location of locations) {
    const unit = unitForLocation(units, location);
    if (!unit) return null;
    parts.push(String(unit.text || ''));
  }
  return parts.join('');
}

function liveRangeUnitTexts(item) {
  const locations = item.localRange?.locations || [];
  if (!locations.length || !item.file || !fs.existsSync(item.file)) return null;
  const units = unitsFor(item.file);
  const parts = [];
  for (const location of locations) {
    const unit = unitForLocation(units, location);
    if (!unit) return null;
    parts.push({
      text: String(unit.text || ''),
      kind: unit.kind,
    });
  }
  return parts;
}

function chapterTextKey(file) {
  return variantKey(unitsFor(file).map((unit) => unit.text).join(''));
}

function sourceBetweenAnchors(item) {
  if (!item.file || !fs.existsSync(item.file)) return false;
  const full = chapterTextKey(item.file);
  const source = variantKey(item.sourceRange?.text || '');
  if (!source || source.length < 4) return false;

  const sourceIndex = full.indexOf(source);
  if (sourceIndex < 0 || full.indexOf(source, sourceIndex + 1) >= 0) return false;

  const before = variantKey(item.context?.beforeLocal || item.context?.beforeSource || '');
  const after = variantKey(item.context?.afterLocal || item.context?.afterSource || '');
  if (before) {
    const beforeIndex = full.lastIndexOf(before, sourceIndex);
    if (beforeIndex < 0 || sourceIndex - (beforeIndex + before.length) > 5000) return false;
  }
  if (after) {
    const afterIndex = full.indexOf(after, sourceIndex + source.length);
    if (afterIndex < 0 || afterIndex - (sourceIndex + source.length) > 5000) return false;
  }
  return true;
}

function sourceNearAnyAnchor(item) {
  if (!item.file || !fs.existsSync(item.file)) return false;
  const full = chapterTextKey(item.file);
  const source = variantKey(item.sourceRange?.text || '');
  if (!source || source.length < 4) return false;

  const sourceIndex = full.indexOf(source);
  if (sourceIndex < 0 || full.indexOf(source, sourceIndex + 1) >= 0) return false;

  const before = variantKey(item.context?.beforeLocal || item.context?.beforeSource || '');
  const after = variantKey(item.context?.afterLocal || item.context?.afterSource || '');
  if (!before && !after) return false;

  if (before) {
    const beforeIndex = full.lastIndexOf(before, sourceIndex);
    if (beforeIndex >= 0 && sourceIndex - (beforeIndex + before.length) <= 10000) return true;
  }
  if (after) {
    const afterIndex = full.indexOf(after, sourceIndex + source.length);
    if (afterIndex >= 0 && afterIndex - (sourceIndex + source.length) <= 10000) return true;
  }
  return false;
}

const TABLE_MARKUP_RE = /\{\||\|\}|\|-|\|\+|\|\||!!|(?:^|[|\s])(?:class|style|colspan|rowspan|width|height|align|valign)\s*=/iu;
const CJK_OR_DIGIT_RE = /[\p{Script=Han}0-9]/u;
const LEADING_CLOSE_PUNCT_RE = /^[」』”）)\]】〉》]+/u;
const TRAILING_WRAPPER_CLOSE_CHARS = '〉》）)\\]】';
const EQUIVALENT_CLOSE_PUNCT = new Map([
  ['」', ['」', '』', '”', '"']],
  ['』', ['』', '」', '’', "'"]],
  ['”', ['”', '」', '』', '"']],
  ['）', ['）', ')']],
  [')', [')', '）']],
  [']', [']', '】']],
  ['】', ['】', ']']],
  ['〉', ['〉', '》']],
  ['》', ['》', '〉']],
]);
const TABLE_EMPTY_CELL_SPLIT_RE = /\|\||!!/u;
const TABLE_INHERITED_DATE_KEY_RE = /^(?:(?:\p{Script=Han}{1,8})?(?:元|[一二三四五六七八九十百千万萬0-9]+)[年載](?:春|夏|秋|冬)?(?:閏?(?:正|[一二三四五六七八九十0-9]+)月)?(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?(?:朔|晦)?|閏?(?:正|[一二三四五六七八九十0-9]+)月(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?(?:朔|晦)?|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥](?:朔|晦)?)$/u;
const CHRONOLOGY_DETAIL_NAMES = [
  '太平興國', '大中祥符', '建中靖國', '天冊萬歲', '萬歲登封', '萬歲通天',
  '元封', '綏和', '建平', '元壽', '建武', '永平', '建初', '元和',
  '章和', '永元', '元興', '永初', '元初', '永寧', '建光', '延光',
  '永建', '陽嘉', '永和', '漢安', '建康', '本初', '建和', '和平',
  '元嘉', '永興', '永壽', '延熹', '永康', '建寧', '熹平', '光和',
  '中平', '初平', '建安', '鴻嘉', '神爵', '甘露', '青龍', '景初',
  '正始', '嘉平', '景元', '咸熙', '泰始', '咸寧', '太康', '太熙',
  '永熙', '元康', '太安', '永安', '大興', '永昌', '太寧', '咸和',
  '咸康', '隆和', '興寧', '太和', '咸安', '寧康', '太元', '隆安',
  '義熙', '景明', '神龜', '正光', '孝昌', '武泰', '建義', '普泰',
  '中興', '太昌', '天平', '元象', '興和', '武定', '天保', '乾明',
  '皇建', '河清', '天統', '武平', '隆化', '承光', '保定', '天和',
  '建德', '宣政', '大象', '開皇', '仁壽', '大業', '義寧',
  '武德', '貞觀', '永徽', '顯慶', '龍朔', '麟德', '乾封', '總章',
  '咸亨', '上元', '儀鳳', '調露', '永隆', '開耀', '永淳', '弘道',
  '文明', '光宅', '垂拱', '載初', '天授', '如意', '長壽', '延載',
  '證聖', '神功', '聖曆', '久視', '大足', '長安', '神龍', '景龍',
  '唐隆', '景雲', '太極', '延和', '先天', '開元', '天寶', '至德',
  '乾元', '寶應', '廣德', '永泰', '大曆', '建中', '興元', '貞元',
  '永貞', '長慶', '寶曆', '大和', '開成', '會昌', '大中', '咸通',
  '乾符', '廣明', '中和', '光啟', '文德', '龍紀', '大順', '景福',
  '乾寧', '光化', '天復', '天祐', '同光', '天成', '長興', '清泰',
  '天福', '開運', '乾祐', '廣順', '顯德',
  '建隆', '乾德', '開寶', '雍熙', '端拱', '淳化', '至道', '咸平',
  '景德', '天禧', '乾興', '天聖', '明道', '景祐', '寶元', '康定',
  '慶曆', '皇祐', '至和', '嘉祐', '治平', '熙寧', '元豐', '元祐',
  '紹聖', '元符', '崇寧', '大觀', '政和', '重和', '宣和', '靖康',
  '建炎', '紹興', '隆興', '乾道', '淳熙', '紹熙', '慶元', '嘉泰',
  '開禧', '嘉定', '寶慶', '紹定', '端平', '嘉熙', '淳祐', '寶祐',
  '開慶', '景定', '咸淳', '德祐', '景炎', '祥興',
  '神冊', '天贊', '天顯', '會同', '大同', '天祿', '應曆', '保寧',
  '乾亨', '統和', '開泰', '重熙', '清寧', '咸雍', '大康', '大安',
  '壽昌', '乾統', '天慶', '保大', '皇統', '正隆', '大定', '明昌',
  '承安', '泰和', '崇慶', '至寧', '貞祐', '興定', '元光', '正大',
  '開興', '天興', '天眷', '貞元',
  '至元', '元貞', '大德', '至大', '皇慶', '延祐', '至治', '泰定',
  '致和', '天曆', '至順', '元統', '至正',
  '洪武', '建文', '永樂', '洪熙', '宣德', '正統', '景泰', '天順',
  '成化', '弘治', '正德', '嘉靖', '隆慶', '萬曆', '泰昌', '天啟',
  '崇禎',
  '天命', '天聰', '天聦', '崇德', '順治', '康熙', '雍正', '乾隆',
  '嘉慶', '道光', '咸豐', '同治', '光緒', '宣統',
];
const CHRONOLOGY_DETAIL_RE = new RegExp(
  `(?:${[...new Set(CHRONOLOGY_DETAIL_NAMES)].sort((a, b) => b.length - a.length).join('|')})(?:元|[一二三四五六七八九十百廿卅〇零]+)年`,
  'gu',
);
const REIGN_YEAR_PREFIX_RE = new RegExp(
  `^(?:${[...new Set(CHRONOLOGY_DETAIL_NAMES)].sort((a, b) => b.length - a.length).join('|')})(?:元|[一二三四五六七八九十百千万萬廿卅〇零]+)年(?:春|夏|秋|冬)?(?:閏?(?:正|[一二三四五六七八九十0-9]+)月)?(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?$`,
  'u',
);
const SONGSHI_PAGE_TITLE_PREFIX_RE = /^(?:太宗|真宗|仁宗|英宗|神宗|哲宗|徽宗|欽宗|高宗|孝宗|光宗|寧宗|理宗|度宗|恭帝|端宗|帝昺)[一二三四五六七八九十百]+$/u;

function normalizeTableNumerals(text) {
  return String(text || '')
    .replace(/二十/gu, '廿')
    .replace(/三十/gu, '卅')
    .replace(/四十/gu, '卌')
    .replace(/十(?=[一二三四五六七八九])/gu, '一十');
}

function tableContentKey(text) {
  return variantText(normalizeTableNumerals(text)
    .replace(/class\s*=\s*"[^"]*"/giu, '')
    .replace(/style\s*=\s*"[^"]*"/giu, '')
    .replace(/(?:colspan|rowspan|width|height|align|valign)\s*=\s*"?[\w%.-]+"?/giu, '')
    .replace(/\{\||\|\}|\|-|\|\+|\|\||!!|[|!]/gu, '')
    .replace(/[^\p{Script=Han}0-9]/gu, '')
    .normalize('NFKC'));
}

function tableMarkupEquivalent(sourceText, localText) {
  if (!TABLE_MARKUP_RE.test(sourceText)) return false;
  if (!CJK_OR_DIGIT_RE.test(sourceText) || !CJK_OR_DIGIT_RE.test(localText)) return false;
  const source = tableContentKey(sourceText);
  const local = tableContentKey(localText);
  return Boolean(source && local && source === local);
}

function tableHanKey(text) {
  return variantText(String(text || '')
    .replace(/(?:class|style|colspan|rowspan|width|height|align|valign|border|cellspacing|cellpadding)\s*=\s*(?:"[^"]*"|'[^']*'|[^|!\s，。；：、]+)\s*\|?/giu, '')
    .replace(/\{\||\|\}|\|-|\|\+|\|\||!!|[|!]/gu, '')
    .replace(/[A-Za-z0-9%_="#:;.,'{}[\]<>/\\-]+/gu, '')
    .normalize('NFKC'))
    .replace(/[^\p{Script=Han}]/gu, '');
}

function isSubsequence(needle, haystack) {
  let index = 0;
  for (const char of haystack) {
    if (char === needle[index]) index += 1;
    if (index >= needle.length) return true;
  }
  return false;
}

function liveTableContainsSource(item, liveText) {
  if (item.book !== 'qingshigao') return false;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate', 'source_omission_candidate'].includes(item.type)) return false;
  if (!hasTableLocation(item) && !TABLE_MARKUP_RE.test(item.sourceRange?.text || '')) return false;

  const source = tableHanKey(item.sourceRange?.text || '');
  const live = tableHanKey(liveText);
  if (source.length < 4 || live.length < source.length) return false;
  if (live.includes(source)) return true;
  if (live.length > source.length * 5) return false;
  return source.length >= 6 && isSubsequence(source, live);
}

function sourceTableCellParts(sourceText) {
  return String(sourceText || '')
    .replace(/(?:colspan|rowspan|width|height|align|valign|class|style)\s*=\s*(?:"[^"]*"|'[^']*'|[^|!\s，。；：、]+)\s*\|?/giu, '')
    .replace(/\{\||\|\}|\|-|\|\+/gu, '')
    .split(TABLE_EMPTY_CELL_SPLIT_RE)
    .map((part) => part.replace(/^\|+/u, '').trim())
    .filter(Boolean);
}

function tableInheritedDatePrefixesNoOp(item) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText || !TABLE_MARKUP_RE.test(sourceText)) return false;

  const localUnits = liveRangeUnitTexts(item);
  if (!localUnits || localUnits.length === 0) return false;
  if (!localUnits.every((unit) => unit.kind === 'cell')) return false;

  const sourceParts = sourceTableCellParts(sourceText);
  const localParts = localUnits.map((unit) => unit.text).filter(Boolean);
  if (sourceParts.length === 0 || sourceParts.length !== localParts.length) return false;

  let sawInheritedDate = false;
  for (let index = 0; index < sourceParts.length; index += 1) {
    const source = tableContentKey(sourceParts[index].replace(/^[，,、：:；;]/u, ''));
    const local = tableContentKey(localParts[index]);
    if (!source || !local) return false;
    if (source === local) continue;
    if (!local.endsWith(source)) return false;

    const inheritedPrefix = local.slice(0, local.length - source.length);
    if (!inheritedPrefix || !TABLE_INHERITED_DATE_KEY_RE.test(inheritedPrefix)) return false;
    sawInheritedDate = true;
  }

  return sawInheritedDate;
}

function stripChronologyDetails(text) {
  return String(text || '').replace(CHRONOLOGY_DETAIL_RE, '');
}

function droppedChronologyDetailNoOp(item, liveText) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  if (hasTableLocation(item)) return false;

  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText || !liveText) return false;

  const strippedLocal = stripChronologyDetails(liveText);
  if (strippedLocal === liveText) return false;
  return variantText(strippedLocal) === variantText(sourceText);
}

function songshiPageTitlePrefixNoOp(item, liveText) {
  if (item.book !== 'songshi') return false;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  if (!liveText || hasTableLocation(item)) return false;

  const sourceKey = variantKey(item.sourceRange?.text || '');
  const localKey = variantKey(liveText);
  if (!sourceKey || !localKey || sourceKey === localKey || !sourceKey.endsWith(localKey)) return false;

  const prefix = sourceKey.slice(0, sourceKey.length - localKey.length);
  return Boolean(prefix && [...prefix].length <= 8 && SONGSHI_PAGE_TITLE_PREFIX_RE.test(prefix));
}

const metaKeyCache = new Map();

function chapterMetaKey(file) {
  const absolute = path.resolve(file);
  if (metaKeyCache.has(absolute)) return metaKeyCache.get(absolute);
  const data = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  const meta = data.meta || {};
  const title = meta.title || {};
  const key = variantKey([
    title.zh,
    title.raw,
    meta.book,
    meta.chapter,
  ].filter(Boolean).join(''));
  metaKeyCache.set(absolute, key);
  return key;
}

function preTocTitlePrefixEquivalent(item, liveText) {
  if (!item.file || !fs.existsSync(item.file)) return false;
  const sourceText = String(item.sourceRange?.text || '');
  const index = sourceText.indexOf('__TOC__');
  if (index < 0) return false;

  const prefix = sourceText.slice(0, index);
  const body = sourceText.slice(index + '__TOC__'.length);
  const prefixKey = variantKey(prefix);
  if (!prefixKey || prefix.length > 250) return false;
  if (variantKey(body) !== variantKey(liveText)) return false;
  return chapterMetaKey(item.file).includes(prefixKey);
}

function startsWithLastName(prefix, source) {
  const chars = [...prefix];
  for (let length = Math.min(4, chars.length); length >= 1; length -= 1) {
    if (source.startsWith(chars.slice(-length).join(''))) return true;
  }
  return false;
}

function hasOpeningLocation(item) {
  return (item.localRange?.locations || []).some((location) => Number(location.sentenceIndex ?? 0) === 0);
}

function hasTableLocation(item) {
  return (item.localRange?.locations || []).some((location) => (
    location.kind === 'cell'
    || String(location.blockType || '').startsWith('table')
  ));
}

function sameRecordedAnchors(item) {
  return variantKey(item.context?.beforeSource || '') === variantKey(item.context?.beforeLocal || '')
    && variantKey(item.context?.afterSource || '') === variantKey(item.context?.afterLocal || '');
}

function relaxedAnchorKey(text) {
  return variantKey(String(text || '').replace(/^[」』”）)\]】〉》，、。；：！？\s]+/u, ''));
}

function sameRecordedAnchorsRelaxed(item) {
  return relaxedAnchorKey(item.context?.beforeSource || '') === relaxedAnchorKey(item.context?.beforeLocal || '')
    && relaxedAnchorKey(item.context?.afterSource || '') === relaxedAnchorKey(item.context?.afterLocal || '');
}

function sourceLooksBoundaryTruncated(sourceText) {
  return /^[」』”）)\]】〉》，、。；：！？]/u.test(sourceText)
    || /，。|；。|：「？|曰：「？/u.test(sourceText)
    || /^=+/u.test(sourceText)
    || /__TOC__/u.test(sourceText);
}

function prefixKind(prefix, source, sourceKey, item) {
  if (!prefix || BAD_BOUNDARY_RE.test(prefix) || prefix.length > 80) return '';
  if (REIGN_YEAR_PREFIX_RE.test(prefix) && SOURCE_DATE_START_RE.test(source)) return 'structural-reign-year-prefix';
  if (DATE_PREFIX_RE.test(prefix) && SOURCE_DATE_START_RE.test(source)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 28 && METHOD_HEADING_PREFIX_RE.test(prefix) && /^[，,、：:；;]?[\p{Script=Han}]/u.test(source)) return 'structural-method-heading-prefix';
  if (prefix.length >= 2 && prefix.length <= 16 && LIST_LABEL_PREFIX_RE.test(prefix) && (SOURCE_DATE_START_RE.test(source) || OFFICE_START_RE.test(source))) return 'structural-list-label-prefix';
  if (prefix.length >= 2 && startsWithLastName(prefix, sourceKey) && (BIOGRAPHY_START_RE.test(source) || prefix.length <= 8)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 6 && BIOGRAPHY_START_RE.test(source) && hasOpeningLocation(item)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 14 && GEO_OFFICE_PREFIX_RE.test(prefix) && (OFFICE_START_RE.test(source) || /郡|縣|府|州|赤|望|緊|上|中|下/u.test(source))) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 8 && OFFICE_START_RE.test(source)) return 'structural-prefix';
  if (prefix.length >= 2 && prefix.length <= 8 && SECTION_PREFIX_RE.test(prefix)) return 'structural-prefix';
  if (item.book === 'songshi' && prefix.length >= 2 && prefix.length <= 4 && SONGSHI_LIST_START_RE.test(source)) return 'structural-prefix';
  if (prefix.length >= 2 && LONG_HEADING_PREFIX_RE.test(prefix) && /^[:：]/u.test(source)) return 'source-leading-colon-heading';
  return '';
}

function structuralRemainderMatchesSource(liveText, sourceText, prefix, suffix) {
  const live = variantText(liveText);
  const source = variantText(sourceText);
  if (!live || !source) return false;
  if (prefix && !suffix) return live.endsWith(source);
  if (!prefix && suffix) return live.startsWith(source);
  return live.includes(source);
}

function suffixKind(suffix, source, liveText, item) {
  if (!suffix || suffix.length > 12 || BAD_BOUNDARY_RE.test(suffix)) return '';
  if (suffix === '傳' && /(?:自有|別有|有)[。.]?$/u.test(variantKey(source))) return 'structural-suffix';
  if (['州', '縣', '郡', '府'].includes(suffix) && /(?:次|至|幸|入|遷|徙|置|攻|圍|出|奔|在)[\p{Script=Han}]{1,4}[。.]?$/u.test(variantKey(source))) return 'structural-suffix';
  if (/[？?]/u.test(source) && suffix.length <= 4) return 'structural-suffix';
  if (/[*\[\]（）()〈〉]/u.test(liveText) && suffix.length <= 8) return 'structural-suffix';
  if (/[。！？；]$/u.test(source) && suffix.length >= 2 && suffix.length <= 8 && hasOpeningLocation(item)) return 'structural-suffix';
  return '';
}

function commentaryContained(item, liveText, sourceKey) {
  if (!LIVE_NOTE_MARKER_RE.test(liveText)) return false;
  const liveKey = variantKey(liveText);
  if (!sourceKey || !liveKey.includes(sourceKey) || liveKey === sourceKey) return false;

  const source = String(item.sourceRange?.text || '')
    .trim()
    .replace(/^」/u, '')
    .replace(/^』/u, '');
  if (!source || BASE_TEXT_START_RE.test(source)) return false;
  return COMMENTARY_SOURCE_RE.test(source);
}

function sourceOnlyCommentaryNoOp(item) {
  if (item.type !== 'source_omission_candidate') return false;
  if ((item.localRange?.locations || []).length > 0) return false;
  if (hasTableLocation(item) || !sameRecordedAnchorsRelaxed(item)) return false;
  if (!ANNOTATED_SOURCE_BOOKS.has(item.book)) return false;

  const source = String(item.sourceRange?.text || '').trim();
  const local = String(item.localRange?.text || '').trim();
  if (!source || local || TABLE_MARKUP_RE.test(source)) return false;

  const normalized = source
    .replace(/^\|+/u, '')
    .replace(/^[」』”）)\]】〉》，、。；：！？\s]+/u, '')
    .trim();
  if (!normalized || [...normalized].length > 360) return false;
  if (SOURCE_ONLY_BASE_START_RE.test(normalized)) return false;
  if (SOURCE_ONLY_BASE_EVENT_AFTER_ANNOTATION_RE.test(normalized)) return false;

  const sentenceCount = (normalized.match(/[。！？]/gu) || []).length;
  if (sentenceCount > 6) return false;

  return STRONG_COMMENTARY_START_RE.test(normalized);
}

function splitChineseSentences(text) {
  return String(text || '').match(/[^。！？]*[。！？]?/gu)?.filter(Boolean) || [];
}

function stripEmbeddedCommentarySentences(text) {
  const removed = [];
  const kept = [];
  for (const sentence of splitChineseSentences(text)) {
    const normalized = sentence.trim();
    if (!normalized) continue;
    if (
      [...normalized].length <= 160
      && EMBEDDED_COMMENTARY_SENTENCE_RE.test(normalized)
      && !EMBEDDED_COMMENTARY_BASE_START_RE.test(normalized.replace(/^[」』”）)\]】〉》，、。；：！？\s]+/u, ''))
    ) {
      removed.push(sentence);
      continue;
    }
    kept.push(sentence);
  }
  return {
    text: kept.join(''),
    removed,
  };
}

function embeddedSourceCommentarySentencesNoOp(item, liveText) {
  if (!ANNOTATED_SOURCE_BOOKS.has(item.book)) return false;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  if (hasTableLocation(item)) return false;

  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText || !liveText || TABLE_MARKUP_RE.test(sourceText)) return false;

  const stripped = stripEmbeddedCommentarySentences(sourceText);
  if (!stripped.removed.length || !stripped.text || stripped.text === sourceText) return false;

  return variantText(stripped.text) === variantText(liveText);
}

function stripInlineCommentaryBlocks(text) {
  let removed = 0;
  const stripped = String(text || '').replace(INLINE_COMMENTARY_BLOCK_RE, () => {
    removed += 1;
    return '';
  });
  return { text: stripped, removed };
}

function inlineCommentaryBlocksNoOp(item, liveText) {
  if (!ANNOTATED_SOURCE_BOOKS.has(item.book)) return false;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  if (hasTableLocation(item)) return false;

  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText || !liveText || TABLE_MARKUP_RE.test(sourceText)) return false;

  const stripped = stripInlineCommentaryBlocks(sourceText);
  if (!stripped.removed || !stripped.text || stripped.text === sourceText) return false;

  return variantText(stripped.text) === variantText(liveText);
}

function comparisonTokens(text) {
  const tokens = [];
  let offset = 0;
  for (const rawChar of String(text || '')) {
    const start = offset;
    offset += rawChar.length;
    for (const keyChar of variantText(rawChar)) {
      if (CJK_OR_DIGIT_RE.test(keyChar)) tokens.push({ key: keyChar, start, end: offset });
    }
  }
  return tokens;
}

function countComparisonChars(text) {
  return comparisonTokens(text).length;
}

function isInlineAnnotationSentence(rawSentence) {
  const sentence = String(rawSentence || '').trim();
  if (!sentence || countComparisonChars(sentence) === 0) return true;
  const cleaned = sentence
    .replace(/^[」』”）)\]】〉》，、。；：！？\s|!]+/u, '')
    .replace(/[」』”）)\]】〉》\s]+$/u, '')
    .replace(/^[\[［〔【][一二三四五六七八九十百千万萬0-9]+[\]］〕】]\s*/u, '')
    .replace(/^[|!{}\[\]<>#*_=\-\s]+/u, '')
    .trim();
  if (!cleaned || countComparisonChars(cleaned) === 0) return true;
  if (SOURCE_ONLY_BASE_START_RE.test(cleaned)) return false;
  if (INLINE_ANNOTATION_CITE_START_RE.test(cleaned)) return true;
  if (INLINE_ANNOTATION_DATE_START_RE.test(cleaned)) return false;
  if (/(?:字[^。！？]{0,24}人也|[，,][^。！？]{0,24}子也)[。！？]?$/u.test(cleaned)) return false;
  if (INLINE_ANNOTATION_GLOSS_RE.test(cleaned)) return true;
  return countComparisonChars(cleaned) <= 100 && INLINE_ANNOTATION_CITE_ANYWHERE_RE.test(cleaned);
}

function isInlineAnnotationExtra(rawChunk) {
  const raw = String(rawChunk || '');
  if (!raw.trim()) return true;

  const hanCount = countComparisonChars(raw);
  if (hanCount === 0) return true;
  if (TABLE_MARKUP_RE.test(raw) && hanCount > 20) return false;

  const cleaned = raw
    .replace(/^[」』”）)\]】〉》，、。；：！？\s|!]+/u, '')
    .replace(/[」』”）)\]】〉》\s]+$/u, '')
    .replace(/^[\[［〔【][一二三四五六七八九十百千万萬0-9]+[\]］〕】]\s*/u, '')
    .replace(/^[|!{}\[\]<>#*_=\-\s]+/u, '')
    .trim();
  if (!cleaned) return true;
  return splitChineseSentences(cleaned)
    .map((sentence) => sentence.trim())
    .filter((sentence) => countComparisonChars(sentence) > 0)
    .every(isInlineAnnotationSentence);
}

function sourceInlineAnnotationsNoOp(item, liveText) {
  if (!ANNOTATED_SOURCE_BOOKS.has(item.book)) return false;
  if (!INLINE_ANNOTATION_TYPES.has(item.type)) return false;
  if (hasTableLocation(item)) return false;

  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText || !liveText) return false;
  if (sourceText.length > 4000 || TABLE_MARKUP_RE.test(sourceText)) return false;
  if (INLINE_ANNOTATION_PLACEHOLDER_RE.test(liveText)) return false;

  const sourceTokens = comparisonTokens(sourceText);
  const liveTokens = comparisonTokens(liveText);
  if (liveTokens.length < 8 || sourceTokens.length <= liveTokens.length) return false;

  const positions = [];
  let sourceIndex = 0;
  for (const liveToken of liveTokens) {
    while (sourceIndex < sourceTokens.length && sourceTokens[sourceIndex].key !== liveToken.key) sourceIndex += 1;
    if (sourceIndex >= sourceTokens.length) return false;
    positions.push(sourceIndex);
    sourceIndex += 1;
  }

  const extras = [];
  let rawStart = 0;
  for (const position of positions) {
    const token = sourceTokens[position];
    if (token.start > rawStart) extras.push(sourceText.slice(rawStart, token.start));
    rawStart = token.end;
  }
  if (rawStart < sourceText.length) extras.push(sourceText.slice(rawStart));

  const meaningfulExtras = extras.filter((extra) => countComparisonChars(extra) > 0);
  return meaningfulExtras.length > 0 && meaningfulExtras.every(isInlineAnnotationExtra);
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function attachedCloseMatch(text, punctuation) {
  const trimmed = String(text || '').trimEnd();
  if (!trimmed || !punctuation) return null;
  const alternatives = punctuation.length === 1
    ? (EQUIVALENT_CLOSE_PUNCT.get(punctuation) || [punctuation])
    : [punctuation];
  const re = new RegExp(`(${alternatives.map(escapeRegExp).join('|')})([${TRAILING_WRAPPER_CLOSE_CHARS}]*)$`, 'u');
  return trimmed.match(re);
}

function previousSourceUnit(units, index) {
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    if (String(units[cursor]?.text || '').trim()) return units[cursor];
  }
  return null;
}

function leadingCloseAlreadyPlaced(item, liveText) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  if (hasTableLocation(item)) return false;

  const source = String(item.sourceRange?.text || '').trimStart();
  const match = source.match(LEADING_CLOSE_PUNCT_RE);
  if (!match) return false;

  const punctuation = match[0];
  const sourceRest = source.slice(punctuation.length);
  if (!sourceRest || variantText(liveText) !== variantText(sourceRest)) return false;

  const locations = item.localRange?.locations || [];
  if (locations.length !== 1 || !item.file || !fs.existsSync(item.file)) return false;

  const units = unitsFor(item.file);
  const current = unitForLocation(units, locations[0]);
  if (!current) return false;

  const currentIndex = units.findIndex((unit) => unit === current);
  if (currentIndex <= 0) return false;

  const beforeLocal = String(item.context?.beforeLocal || '').trim();
  if (beforeLocal && !attachedCloseMatch(beforeLocal, punctuation)) return false;

  const previous = previousSourceUnit(units, currentIndex);
  if (!previous || !attachedCloseMatch(previous.text, punctuation)) return false;

  return true;
}

function localCleanlyContainsSource(item, liveText, sourceKey, localKey) {
  if (hasTableLocation(item) || !sameRecordedAnchors(item)) return false;
  if (!sourceKey || !localKey || sourceKey === localKey || sourceKey.length < 4) return false;
  const sourceText = item.sourceRange?.text || '';
  if (!sourceLooksBoundaryTruncated(sourceText)) return false;
  if (LOCAL_FULLER_BAD_RE.test(liveText) || LOCAL_FULLER_BAD_RE.test(sourceText)) return false;

  const index = localKey.indexOf(sourceKey);
  if (index < 0 || localKey.indexOf(sourceKey, index + 1) >= 0) return false;

  const prefix = localKey.slice(0, index);
  const suffix = localKey.slice(index + sourceKey.length);
  return prefix.length <= 24 && suffix.length <= 24;
}

function stripCommentaryForPlaceholderComparison(text) {
  const withoutEmbeddedSentences = stripEmbeddedCommentarySentences(text).text;
  const withoutInlineBlocks = stripInlineCommentaryBlocks(withoutEmbeddedSentences).text;
  return withoutInlineBlocks
    .replace(/__(?:FORCE)?TOC__|__NOTOC__|__NOCC__/gu, '')
    .replace(/Category:[^\s<>|]+/gu, '');
}

function upstreamPlaceholderOmissionNoOp(item, liveText) {
  if (item.type !== 'local_extra_candidate') return false;
  if (hasTableLocation(item) || !sameRecordedAnchorsRelaxed(item)) return false;

  const sourceText = String(item.sourceRange?.text || '');
  if (!/:{2,}/u.test(sourceText) || !liveText) return false;
  if (LOCAL_TEMPLATE_ARTIFACT_RE.test(liveText)) return false;
  if ([...liveText].length < [...sourceText].length * 1.2) return false;

  const liveKey = variantText(liveText);
  const chunks = sourceText
    .split(/:{2,}/u)
    .map(stripCommentaryForPlaceholderComparison)
    .map((chunk) => variantText(chunk))
    .filter((chunk) => chunk.length >= 4);

  if (chunks.length < 2 || chunks.join('').length < 12) return false;

  let offset = 0;
  for (const chunk of chunks) {
    const index = liveKey.indexOf(chunk, offset);
    if (index < 0) return false;
    offset = index + chunk.length;
  }
  return true;
}

function hanSubsequenceKey(text) {
  return variantText(String(text || '')).replace(/[^\p{Script=Han}]/gu, '');
}

function subsequencePositions(needle, haystack) {
  const positions = [];
  const needleChars = [...needle];
  const haystackChars = [...haystack];
  let needleIndex = 0;
  for (let index = 0; index < haystackChars.length && needleIndex < needleChars.length; index += 1) {
    if (haystackChars[index] !== needleChars[needleIndex]) continue;
    positions.push(index);
    needleIndex += 1;
  }
  return needleIndex === needleChars.length ? positions : null;
}

function subsequenceExtras(needle, haystack) {
  const positions = subsequencePositions(needle, haystack);
  if (!positions) return null;

  const haystackChars = [...haystack];
  const extras = [];
  let previous = -1;
  for (const position of positions) {
    if (position > previous + 1) extras.push(haystackChars.slice(previous + 1, position).join(''));
    previous = position;
  }
  if (previous < haystackChars.length - 1) extras.push(haystackChars.slice(previous + 1).join(''));
  return extras.filter(Boolean);
}

function upstreamDroppedContentTemplateNoOp(item, liveText) {
  if (item.sourceName !== 'wikisource') return false;
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return false;
  if (hasTableLocation(item) || !sameRecordedAnchorsRelaxed(item)) return false;
  if (!liveText || LOCAL_TEMPLATE_ARTIFACT_RE.test(liveText) || LOCAL_FULLER_BAD_RE.test(liveText)) return false;

  const sourceText = String(item.sourceRange?.text || '');
  if (!sourceText || TABLE_MARKUP_RE.test(sourceText)) return false;

  const sourceKey = hanSubsequenceKey(sourceText);
  const localKey = hanSubsequenceKey(liveText);
  if (sourceKey.length < 30 || localKey.length <= sourceKey.length || localKey.length > sourceKey.length * 3) return false;

  const extras = subsequenceExtras(sourceKey, localKey);
  if (!extras || extras.length < 1) return false;
  if (!extras.every((extra) => /^\p{Script=Han}+$/u.test(extra))) return false;

  const extraLength = extras.join('').length;
  const maxExtraLength = Math.max(...extras.map((extra) => [...extra].length));
  if (extraLength > 360 || maxExtraLength > 12) return false;

  return WIKISOURCE_DROPPED_TEMPLATE_HOLE_RE.test(sourceText);
}

function classify(item) {
  if (!item.sourceRange?.text) return null;

  const liveText = liveRangeText(item);
  if (liveText !== null) {
    if (variantText(liveText) === variantText(item.sourceRange.text)) {
      return {
        decision: 'denied',
        reason: 'live-variant-equivalent',
        notes: 'Reviewed as no-op: live local text is already equivalent to upstream under approved variants and punctuation; local corpus text retained.',
      };
    }
    if (variantKey(liveText) === variantKey(item.sourceRange.text)) {
      return {
        decision: 'denied',
        reason: 'live-content-equivalent',
        notes: 'Reviewed as no-op: live local Han/digit content is already equivalent to upstream after punctuation-boundary repair; local corpus text retained.',
      };
    }
    if (liveTableContainsSource(item, liveText)) {
      return {
        decision: 'applied',
        reason: 'live-table-source-present',
        notes: 'Reviewed as already repaired: the current live table text contains the upstream source text after stripping raw Wikisource table markup and header layout noise.',
      };
    }
    if (tableMarkupEquivalent(item.sourceRange.text, liveText)) {
      return {
        decision: 'denied',
        reason: 'table-markup-equivalent',
        notes: 'Reviewed as no-op: upstream table markup, blank-cell separators, or table numeric spelling normalize to the same live local table text; local corpus text retained.',
      };
    }
    if (tableInheritedDatePrefixesNoOp(item)) {
      return {
        decision: 'denied',
        reason: 'table-inherited-date-prefix',
        notes: 'Reviewed as no-op: local table cells expand inherited date or reign-year values that raw Wikisource leaves as blank table cells; local expanded table text retained.',
      };
    }
    if (preTocTitlePrefixEquivalent(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'pre-toc-title-prefix-equivalent',
        notes: 'Reviewed as no-op: upstream pre-TOC title/list prefix is already represented in chapter metadata, and the post-TOC body matches live local text.',
      };
    }
    if (droppedChronologyDetailNoOp(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'wikisource-dropped-chronology-detail',
        notes: 'Reviewed as no-op: live local text preserves explicit regnal-year/date details that raw Wikisource dropped; removing those date details makes the spans equivalent, so local corpus text was retained.',
      };
    }
    if (songshiPageTitlePrefixNoOp(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'songshi-page-title-prefix',
        notes: 'Reviewed as no-op: raw Wikisource prefixed the Songshi page/section title to the first sentence, while the live local sentence already preserves the base text.',
      };
    }
    if (embeddedSourceCommentarySentencesNoOp(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'embedded-commentary-sentences-noop',
        notes: 'Reviewed as no-op: clearly marked upstream commentary, gloss, or pronunciation sentences strip to the live local base text with punctuation preserved; local corpus text retained.',
      };
    }
    if (inlineCommentaryBlocksNoOp(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'inline-commentary-blocks-noop',
        notes: 'Reviewed as no-op: explicit upstream commentator/book citation blocks strip to the live local base text with punctuation preserved; local corpus text retained.',
      };
    }
    if (sourceInlineAnnotationsNoOp(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'inline-annotation-noop',
        notes: 'Reviewed as no-op: Wikisource injects inline commentary, gloss, or pronunciation notes into the source span; after removing those note chunks, the upstream span aligns to the live local base text, so the corpus text was retained.',
      };
    }
    if (leadingCloseAlreadyPlaced(item, liveText)) {
      return {
        decision: 'denied',
        reason: 'leading-close-already-placed',
        notes: 'Reviewed as no-op: upstream begins this span with closing punctuation that the live corpus already attaches to the preceding sentence; the current live span matches the remaining upstream source.',
      };
    }

    const source = variantKey(item.sourceRange.text);
    const local = variantKey(liveText);
    if (source && local && local !== source) {
      if (commentaryContained(item, liveText, source)) {
        return {
          decision: 'denied',
          reason: 'commentary-contained',
          notes: 'Reviewed as no-op: upstream commentary/gloss text is already present inside the live local note block; local corpus text retained.',
        };
      }
      if (localCleanlyContainsSource(item, liveText, source, local)) {
        return {
          decision: 'denied',
          reason: 'local-cleanly-contains-source',
          notes: 'Reviewed as no-op: upstream span is cleanly contained in the fuller live local text between identical anchors; local corpus text retained.',
        };
      }
      if (upstreamPlaceholderOmissionNoOp(item, liveText)) {
        return {
          decision: 'denied',
          reason: 'upstream-placeholder-omission',
          notes: 'Reviewed as no-op: raw Wikisource uses colon placeholders where the live local corpus preserves the full quoted or memorial text; local corpus text retained.',
        };
      }
      if (upstreamDroppedContentTemplateNoOp(item, liveText)) {
        return {
          decision: 'denied',
          reason: 'upstream-dropped-content-template',
          notes: 'Reviewed as no-op: raw Wikisource dropped visible content from repeated name/date/content templates, while the live local corpus preserves the grammatical source text between matching anchors.',
        };
      }

      const index = local.indexOf(source);
      if (index >= 0 && local.indexOf(source, index + 1) < 0) {
        const prefix = local.slice(0, index);
        const suffix = local.slice(index + source.length);
        const prefixReason = prefixKind(prefix, item.sourceRange.text, source, item);
        const suffixReason = suffixKind(suffix, item.sourceRange.text, liveText, item);
        const structuralSafe = !LOCAL_FULLER_BAD_RE.test(liveText)
          && !LOCAL_FULLER_BAD_RE.test(item.sourceRange.text)
          && structuralRemainderMatchesSource(liveText, item.sourceRange.text, prefix, suffix);
        if (prefix && !suffix && prefixReason && structuralSafe) {
          return {
            decision: 'denied',
            reason: prefixReason,
            notes: 'Reviewed as no-op: upstream span is contained in the live local text after a structural heading/date/list prefix; local corpus text retained.',
          };
        }
        if (!prefix && suffix && suffixReason && structuralSafe) {
          return {
            decision: 'denied',
            reason: suffixReason,
            notes: 'Reviewed as no-op: upstream span is contained in the live local text before a structural suffix or boundary heading; local corpus text retained.',
          };
        }
        if (prefix && suffix && prefixReason && suffixReason && structuralSafe) {
          return {
            decision: 'denied',
            reason: 'structural-prefix-suffix',
            notes: 'Reviewed as no-op: upstream span is contained in the live local text between structural prefix/suffix material; local corpus text retained.',
          };
        }
      }
    }
  } else if ((item.localRange?.locations || []).length === 0 && sourceBetweenAnchors(item)) {
    return {
      decision: 'applied',
      reason: 'source-already-present-between-anchors',
      notes: 'Reviewed as already repaired: live corpus already contains the upstream source text between the recorded anchors.',
    };
  } else if (sourceOnlyCommentaryNoOp(item)) {
    return {
      decision: 'denied',
      reason: 'source-only-commentary-noop',
      notes: 'Reviewed as no-op: source-only upstream commentary, gloss, or pronunciation note is not part of the base corpus text; matching anchors show the local corpus text should be retained.',
    };
  } else if ((item.localRange?.locations || []).length === 0 && sourceNearAnyAnchor(item)) {
    return {
      decision: 'applied',
      reason: 'source-already-present-near-anchor',
      notes: 'Reviewed as already repaired: live corpus already contains the upstream source text uniquely near one recorded anchor.',
    };
  }

  return null;
}

function markItem(item, classification, opts, now) {
  if (classification.decision === 'applied') {
    item.status = 'applied';
    item.decision = 'applied';
    item.appliedAt = item.appliedAt || now;
    item.appliedSummary ||= {
      mode: 'already-present',
      source: opts.reviewer,
      reason: classification.reason,
    };
  } else {
    item.status = 'denied';
    item.decision = 'denied';
    item.reviewedAt = item.reviewedAt || now;
  }
  item.reviewer = item.reviewer || opts.reviewer;
  item.notes = item.notes ? `${item.notes}\n${classification.notes}` : classification.notes;
}

function addCount(map, key) {
  map[key] = (map[key] || 0) + 1;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const summary = {
    dryRun: !opts.apply,
    total: 0,
    byReason: {},
    byDecision: {},
    byQueue: {},
    samples: [],
  };

  for (const queuePath of queuePaths(opts)) {
    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    let changed = false;
    let queueCount = 0;

    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      const classification = classify(item);
      if (!classification) continue;

      summary.total += 1;
      queueCount += 1;
      addCount(summary.byReason, classification.reason);
      addCount(summary.byDecision, classification.decision);
      if (summary.samples.length < opts.sampleLimit) {
        summary.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
          decision: classification.decision,
          reason: classification.reason,
          source: String(item.sourceRange?.text || '').slice(0, 120),
          local: String(item.localRange?.text || '').slice(0, 120),
        });
      }

      if (opts.apply) {
        markItem(item, classification, opts, now);
        changed = true;
      }
      if (opts.limit > 0 && summary.total >= opts.limit) break;
    }

    if (queueCount > 0) summary.byQueue[path.relative(process.cwd(), queuePath)] = queueCount;
    if (opts.apply && changed) {
      queue.updatedAt = now;
      fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
    }
    if (opts.limit > 0 && summary.total >= opts.limit) break;
  }

  console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
