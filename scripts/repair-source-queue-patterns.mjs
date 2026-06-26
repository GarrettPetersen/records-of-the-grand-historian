#!/usr/bin/env node
/**
 * Clear high-confidence source repair queue patterns.
 *
 * Dry-run by default. With --apply:
 * - marks source-correspondence diffs that are only approved graph variants as
 *   denied/no-op reviewed;
 * - marks correspondence items caused by upstream-only MediaWiki residue
 *   (__TOC__, Category:..., PD-old) as denied/no-op reviewed;
 * - marks Wikisource diffs caused by linked regnal-year labels dropped from
 *   raw-source parsing as denied/no-op reviewed;
 * - removes raw HTML tags and leading table span attributes from local source
 *   fields, then marks matching source-artifact queue items as applied.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countChapterMetrics } from '../chapter-counts.mjs';

const DATA_DIR = path.join(process.cwd(), 'data');
const QUALITY_DIR = path.join(DATA_DIR, 'quality');
const DEFAULT_REVIEWER = 'repair-source-queue-patterns';
const SOURCE_KEYS = ['zh', 'source', 'content', 'text'];
const CORRESPONDENCE_RE = /^source-correspondence.+\.json$/u;
const SOURCE_ARTIFACTS_PATH = path.join(QUALITY_DIR, 'source-artifacts-corpus.json');
const STRUCTURAL_SOURCE_ARTIFACT_RULES = new Set([
  'SOURCE_HTML_TABLE_SPAN',
  'SOURCE_RAW_HTML_TAG',
  'SOURCE_CTEXT_INLINE_MARKUP',
]);
const REPAIRABLE_SOURCE_ARTIFACT_RULES = new Set([
  ...STRUCTURAL_SOURCE_ARTIFACT_RULES,
  'SOURCE_WIKISOURCE_TOC_CONTROL',
  'SOURCE_WIKISOURCE_CORRECTION_BRACKET',
 'SOURCE_WIKISOURCE_HEADING_MARKUP',
 'SOURCE_PRIVATE_USE_GLYPH',
  'SOURCE_COMPONENT_PLACEHOLDER',
 'SOURCE_REPEATED_CLOSING_QUOTE',
 'SOURCE_TRAILING_LAYOUT_MARKER',
  'SOURCE_LEADING_SECTION_NUMBER',
]);
const UPSTREAM_RESIDUE_TOKEN_PATTERN = String.raw`__TOC__|PD-old|----\s*校勘記|Category:[^\s<>|]+`;
const UPSTREAM_RESIDUE_RE = new RegExp(UPSTREAM_RESIDUE_TOKEN_PATTERN, 'u');
const UPSTREAM_RESIDUE_TOKEN_RE = new RegExp(UPSTREAM_RESIDUE_TOKEN_PATTERN, 'gu');
const WIKI_TOC_CONTROL_RE = /__(?:FORCE)?TOC__|__NOTOC__|__NOCC__/gu;
const WIKI_INLINE_HEADING_RE = /=+\s*[^=]{1,120}\s*=+/gu;
const SOURCE_BODY_PUNCT_RE = /[。！？；：，、,.!?;:]/u;
const SOURCE_SENTENCE_PUNCT_RE = /[。！？；，,.!?;]/u;
const SOURCE_COMMENTARY_START_RE = /^(?:\|+|\s)*(?:注[\[［〔【]?[一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】]?|【(?:正義|索隱|集解|考證|校勘記)[^】]*】|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|索隱|正義|集解)曰[:：]|(?:[一二三四五六七八九十百千萬万]+、)?(?:音|讀曰|一作))/u;
const SOURCE_BARE_NOTE_MARKER_RE = /^(?:\|+|\s)*[\[［〔【][一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】]\s*/u;
const SOURCE_BARE_NOTE_COMMENTARY_CUE_RE = /^(?:注(?:[\[［〔【][一二三四五六七八九十百千萬万零〇0-9]+[\]］〕】])?|【(?:正義|索隱|集解|考證|校勘記)[^】]*】|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|索隱|正義|集解|鄭玄|杜預|顏師古|李賢|謝承書|東觀記|續漢書|前書|左傳|尚書|詩|易|禮記|說文|廣雅)[^。！？]{0,24}(?:曰|云|注|音|反)|[^。！？]{0,16}(?:音|讀曰|一作|縣名|屬[^。！？]{1,16}郡|在[^。！？]{1,16}郡)|[^。！？]{1,12}反。?$)/u;
const SOURCE_ANNALISTIC_START_RE = /^(?:[元一二三四五六七八九十百千萬万]+年|[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|是歲|初，|先是|帝|王|太后|詔|制曰|遣|立|拜|封|徵|征|行幸|幸|大赦|赦|改元|崩|薨|卒|殺|伐|寇|攻|破|圍|徙|置|罷|復|以)/u;
const SOURCE_CITATION_COMMENTARY_START_RE = /^(?:《[^》]{1,20}》曰|(?:前書|續漢書|東觀記|東觀漢記|漢官儀|禮記|周禮|左傳|國語|說文|方言|爾雅|詩|書|易|史記|春秋|公羊傳|穀梁傳|孝經|山海經|管子|論語|孟子|帝王紀|十三州志|西域傳)[^。！？]{0,20}(?:曰|云))/u;
const SOURCE_SHORT_GLOSS_COMMENTARY_RE = /^(?:[^。！？]{1,24}(?:縣名|郡名|故城在|屬[^。！？]{1,16}郡|今[^。！？]{1,20}縣|音[^。！？]{0,12}反|音[^。！？]{1,8}。?$)|(?:[^。！？]{1,12}，)?(?:已見|見)[^。！？]{1,24}。?$)/u;
const HOUHANSHU_SHORT_ANNOTATION_RE = /^(?:[^。！？]{1,18}(?:謂|猶|即|為|作)[^。！？]{1,30}也。?$|[^。！？]{1,24}(?:，(?:縣|郡|星名|陵名|官名)|縣名|郡名|星名|故城在|屬[^。！？]{1,16}郡|今[^。！？]{1,24}(?:縣|州|郡))[^。！？]{0,24}。?$|[^。！？]{1,18}(?:見|已見)[^。！？]{1,18}(?:紀|傳|志)。?$|(?:詩|易|書|禮|春秋)[^。！？]{0,12}也。?$|[^。！？]{1,12}(?:音[^。！？]{0,12}反|讀曰[^。！？]{1,12}|一作[^。！？]{1,12})。?$)/u;
const HOUHANSHU_CITATION_ANNOTATION_RE = /^(?:《[^》]{1,20}》曰|(?:漢官(?:舊儀|儀|秩)?|蔡質漢儀|蔡質漢官儀|丁孚漢儀|京房《?易傳》?|劉艾《?紀》?|闞駰《?十三州志》?|盧植禮注|董巴|魏氏春秋|胡廣|張晏|荀綽《?晉百官表注》?|漢書音義|案大駕鹵簿)[^。！？]{0,16}(?:曰|云|：|:))/u;
const HOUHANSHU_BASE_SENTENCE_AFTER_ANNOTATION_RE = /^(?:[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|是歲|初，|先是|帝|王|太后|詔|制曰|遣|立|拜|封|徵|征|行幸|幸|大赦|赦|改元|崩|薨|卒|殺|伐|寇|攻|破|圍|徙|置|罷|復|以)/u;
const SOURCE_COMMENTARY_BLOCK_RE = /(?:【(?:正義|索隱|集解|考證|校勘記)[^】]*】[^|]*?(?=\|\||$)|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節)曰[:：]「?[^|]*?(?=\|\||$))/gu;
const SOURCE_COMMENTARY_BLOCK_MARKER_RE = /【(?:正義|索隱|集解|考證|校勘記)[^】]*】|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節)曰[:：]/u;
const SOURCE_COMMENTARY_ALIGNMENT_MARKER_RE = /【(?:正義|索隱|集解|考證|校勘記)[^】]*】|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|李竒|李奇|如淳|蘇林|鄭氏|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙|胡廣|蔡邕|袁宏|謝承|薛瑩|沈欽韓|周壽昌)曰[:：]/gu;
const SOURCE_COMMENTARY_COMPARISON_TOKEN_RE = /[\p{Script=Han}0-9]/gu;
const SOURCE_COMMENTARY_TAIL_MARKER_RE = /【(?:正義|索隱|集解|考證|校勘記)[^】]*】|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙)曰[:：]?/u;
const SOURCE_COMMENTARY_TAIL_RE = /(?:【(?:正義|索隱|集解|考證|校勘記)[^】]*】[\s\S]*$|(?:師古|晉灼|臣瓚|服虔|孟康|應劭|韋昭|徐廣|裴駰|司馬貞|張守節|李竒|李奇|如淳|蘇林|鄭氏|鄭玄|鄧展|張晏|劉德|李賢|章懷|劉昭|惠棟|王先謙)曰[:：]?[「『]?[\s\S]*$)/u;
const LOCAL_PLACEHOLDER_OR_PRIVATE_GLYPH_RE = /[●□�\uE000-\uF8FF]/u;
const LOCAL_EXTRA_ARTIFACT_MARKER_RE = /__TOC__|\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=|[{}<>#%]|\*\[|\[\*|[●□�\uE000-\uF8FF]/iu;
const LINKED_CHRONO_FRAGMENT_RE = /^[\p{Script=Han}]{1,4}(?:元|[一二三四五六七八九十百廿卅]+)年$/u;
const DROPPED_CHRONO_PREFIX_RE = /^[\p{Script=Han}]{0,4}(?:元|[一二三四五六七八九十百廿卅]+)年(?:春|夏|秋|冬)?(?:閏?(?:正|[一二三四五六七八九十]+)月)?(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?(?:朔|晦)?$/u;
const LEADING_YEAR_RE = /^(?:元|[一二三四五六七八九十百廿卅]+)(?:年|載)/u;
const WIKI_PAGE_FIELD_RE = /\|?(?:previous|next|override_author|noauthor|notes|from|type|times)=[^|]*/gu;
const WIKI_PAGE_METADATA_FIELD_RE = /\|?(?:previous|next|override_author|noauthor|from|type|times)=[^|]*/gu;
const WIKI_PAGE_NOTES_KEY_RE = /\|?notes=/gu;
const HEADING_UI_ARTIFACT_RE = /[A-Za-z0-9%_=<>|\[\]{}*#/]/u;
const SOURCE_HEADING_MARKUP_RE = /\b(?:class|style|width|rowspan|colspan)\s*=|wikitable/iu;
const TABLE_MARKUP_RE = /\|\||!!|wikitable|\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=/iu;
const LOCAL_HEADING_MARKUP_RE = /^=+([^=]{1,80})=+/u;
const LOCAL_LEADING_NOTE_MARKER_RE = /^\s*\[[一二三四五六七八九十百千萬万零〇0-9]+\]\s*(?:注\s*\[[一二三四五六七八九十百千萬万零〇0-9]+\]\s*)?/u;
const SECTION_HEADING_BODY_PUNCT_RE = /[，、：；！？「」『』《》]/u;
const WIKISOURCE_PAGE_HEADER_PREFIX_RE = /^(?:(?:史記|漢書|後漢書|三國志|晉書|宋書|南齊書|梁書|陳書|魏書|北齊書|周書|隋書|南史|北史|舊唐書|新唐書|舊五代史|新五代史|宋史|遼史|金史|元史|明史|清史稿|資治通鑑)?卷[一二三四五六七八九十百千萬万零〇○0-9]+|(?:本紀|列傳|志|表|載記|世家|書|紀|傳)第[一二三四五六七八九十百千萬万零〇○0-9]+)/u;
const WIKISOURCE_DEFINITION_LIST_PREFIX_RE = /^:::(?:(?:[一二三四五六七八九十百千萬万零〇○（）()〔〕[\]]{1,8})?(?:州|縣|府|路|司)|(?:州|縣|府|路|司)[一二三四五六七八九十百千萬万零〇○（）()〔〕[\]]{1,8}|[一二三四五六七八九十百千萬万零〇○]{1,4}(?:州|縣|府|路|司)):+$/u;
const LEADING_SECTION_NUMBER_RE = /^(?!(?:-{4,})?\d{3,4}\s+(?:(?:\p{Script=Han}{1,8})?元[年載]|(?:\p{Script=Han}{1,8})?[一二三四五六七八九十]+[年載]))(?:-{4,})?\d+\s*(?=\p{Script=Han})/u;
const MING_QING_REIGN_YEAR_RE = /(?:洪武|建文|永樂|洪熙|宣德|正統|景泰|天順|成化|弘治|正德|嘉靖|隆慶|萬曆|泰昌|天啟|崇禎|順治|康熙|雍正|乾隆|嘉慶|道光|咸豐|同治|光緒|宣統)(?:元|[一二三四五六七八九十百千万萬]+)年|(?:本|是|同)年/gu;
const DROPPED_REIGN_YEAR_PREFIX_RE = /^(?:洪武|建文|永樂|洪熙|宣德|正統|景泰|天順|成化|弘治|正德|嘉靖|隆慶|萬曆|泰昌|天啟|崇禎|天命|天聰|崇德|順治|康熙|雍正|乾隆|嘉慶|道光|咸豐|同治|光緒|宣統)(?:元|[一二三四五六七八九十百千万萬廿卅]+)年/u;
const DROPPED_LOCAL_DATE_PREFIX_RE = /^(?:[\p{Script=Han}]{1,4}(?:元|[一二三四五六七八九十百千万萬廿卅]+)[年載]|[\p{Script=Han}]{1,4}(?=(?:元|[一二三四五六七八九十百千万萬廿卅]+)[年載])|閏?(?:正|[一二三四五六七八九十0-9]+)月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])(?:春|夏|秋|冬)?(?:閏?(?:正|[一二三四五六七八九十0-9]+)月)?(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?/u;
const LOCAL_STRUCTURAL_LABEL_PREFIX_RE = /^(?:[\p{Script=Han}]{1,14}(?:州|府|郡|縣|軍|監|寺|司|院|部|衛|衞|營|路|道|鎮|所|使|公主|庶人|都護|都督|尚書|大夫|內官)|(?:小說|天文|道家|儒家|兵家|曆算|歷算|五行|雜家|法家|農家|醫術|經部|史部|子部|集部))(?:[：:])?/u;
const TABLE_EMPTY_CELL_PREFIX_RE = /^\s*(?:\|\||!!)\s*[，,、：:；;]*/u;
const TABLE_INHERITED_DATE_KEY_RE = /^(?:(?:\p{Script=Han}{1,8})?(?:元|[一二三四五六七八九十百千万萬0-9]+)[年載](?:春|夏|秋|冬)?(?:閏?(?:正|[一二三四五六七八九十0-9]+)月)?(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?(?:朔|晦)?|閏?(?:正|[一二三四五六七八九十0-9]+)月(?:[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])?(?:朔|晦)?|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥](?:朔|晦)?)$/u;
const MAX_CHAPTER_START_RANGE_HEADING_UNITS = 20;
const MAX_CHAPTER_START_SINGLE_PREFIX_CHARS = 80;
const LEADING_CLOSE_PUNCT_RE = /^[」』”）)\]】〉》]+/u;
const TRAILING_CLOSE_PUNCT_RE = /[」』”）)\]】〉》]+$/u;
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
const RAW_HTML_TAG_RE = /<\/?[a-z][^>]*>/giu;
const REF_OPEN_RE = /<ref\b[^>]*>/iu;
const REF_CLOSE_RE = /<\/ref>/iu;
const TABLE_SPAN_ATTR_RE = /\b(?:class|style|rowspan|colspan|valign|align|width|height|border|cellspacing|cellpadding)\s*=\s*(?:"[^"]*"|'[^']*'|[^|!\s，。；：、]+)\s*\|?/giu;
const CTEXT_INLINE_MARKUP_RE = /-\{([^}]+)\}-/gu;
const TRAILING_LAYOUT_MARKER_RE = /-{4,}(?=[」』”]*$)/gu;
const WIKISOURCE_CORRECTION_BRACKET_RE = /〔(?![一二三四五六七八九十百千萬万零〇０\d]+〕)([^〕]{1,20})〕/gu;
const KNOWN_PRIVATE_USE_CHAR_REPAIRS = new Map([
  ['', '玘'],
  ['', '䚟'],
  ['', '臯'],
  ['', '觝'],
  ['', '埴'],
  ['', '紬'],
  ['', '鞞'],
  ['', '衞'],
  ['', '羣'],
  ['', '无'],
  ['', '卻'],
  ['', '饍'],
  ['', '矟'],
]);
const CONTEXTUAL_PRIVATE_USE_REPAIRS = [
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]012\.json$/u,
    textRe: /通憲/gu,
    replacement: '通幰',
    markerRe: /通憲/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]012\.json$/u,
    textRe: /東施道/gu,
    replacement: '東暆道',
    markerRe: /東施道/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]089\.json$/u,
    textRe: /松茯苓/gu,
    replacement: '松術、茯苓',
    markerRe: /松茯苓/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]0(?:25|26)\.json$/u,
    textRe: /兀/gu,
    replacement: '兀朮',
    markerRe: /兀/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]207\.json$/u,
    textRe: /君/gu,
    replacement: '君㚟',
    markerRe: /君/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]006\.json$/u,
    textRe: /駝/gu,
    replacement: '橐駞',
    markerRe: /駝/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]179\.json$/u,
    textRe: /莊/gu,
    replacement: '莊昶',
    markerRe: /莊/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:278|280)\.json$/u,
    textRe: /聿/gu,
    replacement: '聿𨮁',
    markerRe: /聿/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]003\.json$/u,
    textRe: /晉王、?/gu,
    replacement: '晉王棡',
    markerRe: /晉王、?/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]149\.json$/u,
    textRe: /谷王/gu,
    replacement: '谷王橞',
    markerRe: /谷王/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]150\.json$/u,
    textRe: /\{虎\}/gu,
    replacement: '篪',
    markerRe: /\{虎\}/u,
  },
  {
    found: '',
    fileRe: /[/\\](?:mingshi|songshi)[/\\]\d{3}\.json$/u,
    textRe: //gu,
    replacement: '癿',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\](?:mingshi|songshi)[/\\]\d{3}\.json$/u,
    textRe: //gu,
    replacement: '癿',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /允熙/gu,
    replacement: '允熙',
    markerRe: /允熙/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /濟熹/gu,
    replacement: '濟熹',
    markerRe: /濟熹/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /沖或/gu,
    replacement: '沖或',
    markerRe: /沖或/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /厚爵/gu,
    replacement: '厚爵',
    markerRe: /厚爵/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /厚冒/gu,
    replacement: '厚冒',
    markerRe: /厚冒/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /縉貴/gu,
    replacement: '縉貴',
    markerRe: /縉貴/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /劉一景/gu,
    replacement: '劉一燝',
    markerRe: /劉一景/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /遂/gu,
    replacement: '燧',
    markerRe: /遂/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /耑/gu,
    replacement: '煓',
    markerRe: /耑/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]286\.json$/u,
    textRe: /勃/gu,
    replacement: '勃',
    markerRe: /勃/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]011\.json$/u,
    textRe: /王差/gu,
    replacement: '王瑳',
    markerRe: /王差/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]023\.json$/u,
    textRe: /鄧巳/gu,
    replacement: '鄧玘',
    markerRe: /鄧巳/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]063\.json$/u,
    textRe: /玎東/gu,
    replacement: '玎璫',
    markerRe: /玎東/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]003\.json$/u,
    textRe: /李亶/gu,
    replacement: '李璮',
    markerRe: /李亶/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]166\.json$/u,
    textRe: /弁/gu,
    replacement: '㺹',
    markerRe: /弁/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]175\.json$/u,
    textRe: /宣/gu,
    replacement: '瑄',
    markerRe: /宣/u,
  },
  {
    found: '',
    fileRe: /[/\\](?:beishi|mingshi|sanguozhi)[/\\]\d{3}\.json$/u,
    textRe: /巳/gu,
    replacement: '杞',
    markerRe: /巳/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /旃/gu,
    replacement: '㮵',
    markerRe: /旃/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /彝/gu,
    replacement: '㰘',
    markerRe: /彝/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /辛/gu,
    replacement: '梓',
    markerRe: /辛/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:118|227)\.json$/u,
    textRe: /睦挈/gu,
    replacement: '睦㮮',
    markerRe: /睦挈/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]226\.json$/u,
    textRe: /舜/gu,
    replacement: '橓',
    markerRe: /舜/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /愛/gu,
    replacement: '𣜬',
    markerRe: /愛/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /昂/gu,
    replacement: '㭿',
    markerRe: /昂/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /普/gu,
    replacement: '𣚴',
    markerRe: /普/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /棺郭/gu,
    replacement: '棺槨',
    markerRe: /棺郭/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /朔/gu,
    replacement: '槊',
    markerRe: /朔/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /盾/gu,
    replacement: '楯',
    markerRe: /盾/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]166\.json$/u,
    textRe: /妻霞/gu,
    replacement: '棲霞',
    markerRe: /妻霞/u,
  },
  {
    found: '',
    fileRe: /[/\\](?:mingshi|yuanshi)[/\\]\d{3}\.json$/u,
    textRe: /岡|冈/gu,
    replacement: '碙',
    markerRe: /岡|冈/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /毛/gu,
    replacement: '𥐽',
    markerRe: /毛/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]028\.json$/u,
    textRe: /肥遺/gu,
    replacement: '肥遺',
    markerRe: /肥遺/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]126\.json$/u,
    textRe: /駮弩/gu,
    replacement: '礮弩',
    markerRe: /駮弩/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]066\.json$/u,
    textRe: /垂/gu,
    replacement: '硾',
    markerRe: /垂/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]154\.json$/u,
    textRe: /感/gu,
    replacement: '䃭',
    markerRe: /感/u,
  },
  {
    found: '',
    fileRe: /[/\\](?:songshi[/\\](?:408|426)|yuanshi[/\\]065)\.json$/u,
    textRe: /達/gu,
    replacement: '䃮',
    markerRe: /達/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]088\.json$/u,
    textRe: /甘/gu,
    replacement: '礬',
    markerRe: /甘/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]209\.json$/u,
    textRe: /索蜺/gu,
    replacement: '𩌈𩍜',
    markerRe: /索蜺/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]\d{3}\.json$/u,
    textRe: /翁/gu,
    replacement: '䩺',
    markerRe: /翁/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]123\.json$/u,
    textRe: /奚山/gu,
    replacement: '鞋山',
    markerRe: /奚山/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]078\.json$/u,
    textRe: /兩/gu,
    replacement: '緉',
    markerRe: /兩/u,
  },
  {
    found: '',
    fileRe: /[/\\](?:mingshi|yuanshi)[/\\]\d{3}\.json$/u,
    textRe: /占/gu,
    replacement: '䩞',
    markerRe: /占/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]197\.json$/u,
    textRe: /登子/gu,
    replacement: '鐙子',
    markerRe: /登子/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]197\.json$/u,
    textRe: /皮木登/gu,
    replacement: '皮韉木鐙',
    markerRe: /皮木登/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]012\.json$/u,
    textRe: /脊/gu,
    replacement: '塉',
    markerRe: /脊/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]118\.json$/u,
    textRe: /謨典/gu,
    replacement: '謨㙉',
    markerRe: /謨典/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]120\.json$/u,
    textRe: /載匱/gu,
    replacement: '載㙺',
    markerRe: /載匱/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]120\.json$/u,
    textRe: /載夙/gu,
    replacement: '載𰉬',
    markerRe: /載夙/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]494\.json$/u,
    textRe: /通盈/gu,
    replacement: '通𡎠',
    markerRe: /通盈/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]118\.json$/u,
    textRe: /範仰/gu,
    replacement: '範仰',
    markerRe: /範仰/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]118\.json$/u,
    textRe: /幼學/gu,
    replacement: '幼學',
    markerRe: /幼學/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]126\.json$/u,
    textRe: /不己/gu,
    replacement: '不圮',
    markerRe: /不己/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:127|281)\.json$/u,
    textRe: /塚/gu,
    replacement: '塚',
    markerRe: /塚/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]325\.json$/u,
    textRe: /冢/gu,
    replacement: '冢',
    markerRe: /冢/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]209\.json$/u,
    textRe: /專/gu,
    replacement: '塼',
    markerRe: /專/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]169\.json$/u,
    textRe: /資/gu,
    replacement: '秶',
    markerRe: /資/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]342\.json$/u,
    textRe: /周童/gu,
    replacement: '周穜',
    markerRe: /周童/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]324\.json$/u,
    textRe: /參烈寶\{田比\}邪思裡\s*哆囉祿/gu,
    replacement: '參烈寶毘邪哩哆囉祿',
    markerRe: /參烈寶\{田比\}邪思裡/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]265\.json$/u,
    textRe: /貴族奸民/gu,
    replacement: '貴嗾奸民',
    markerRe: /貴族奸民/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:264|325)\.json$/u,
    textRe: /咬留吧/gu,
    replacement: '咬𠺕吧',
    markerRe: /咬留吧/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:006|321)\.json$/u,
    textRe: //gu,
    replacement: '𡗨',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]209\.json$/u,
    textRe: /溪詩話/gu,
    replacement: '䂬溪詩話',
    markerRe: /溪詩話/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]461\.json$/u,
    textRe: //gu,
    replacement: '鋹',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]481\.json$/u,
    textRe: //gu,
    replacement: '龑',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]042\.json$/u,
    textRe: //gu,
    replacement: '滍',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]178\.json$/u,
    textRe: //gu,
    replacement: '衜',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]\d{3}\.json$/u,
    textRe: /旱/gu,
    replacement: '旱暵',
    markerRe: /旱/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]\d{3}\.json$/u,
    textRe: /蕭/gu,
    replacement: '蕭㪺',
    markerRe: /蕭/u,
  },
  {
    found: '',
    fileRe: /[/\\](?:jiutangshu|yuanshi)[/\\]\d{3}\.json$/u,
    textRe: //gu,
    replacement: '廳',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\](?:songshi|yuanshi)[/\\]\d{3}\.json$/u,
    textRe: /騼蜀/gu,
    replacement: '騼䮷',
    markerRe: /騼蜀/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]274\.json$/u,
    textRe: /斷豆/gu,
    replacement: '斷脰',
    markerRe: /斷豆/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]031\.json$/u,
    textRe: /祖恆之/gu,
    replacement: '祖暅之',
    markerRe: /祖恆之/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]036\.json$/u,
    textRe: /羅至/gu,
    replacement: '羅喉至',
    markerRe: /羅至/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]050\.json$/u,
    textRe: /。/gu,
    replacement: '。',
    markerRe: /。/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]062\.json$/u,
    textRe: /孔/gu,
    replacement: '孔碩',
    markerRe: /孔/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]062\.json$/u,
    textRe: /芬/gu,
    replacement: '芬苾',
    markerRe: /芬/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]062\.json$/u,
    textRe: /芬/gu,
    replacement: '芬苾',
    markerRe: /芬/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]130\.json$/u,
    textRe: /內昷/gu,
    replacement: '內醞',
    markerRe: /內昷/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]128\.json$/u,
    textRe: /素匿之/gu,
    replacement: '素匿之',
    markerRe: /素匿之/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]216\.json$/u,
    textRe: /山顧天飐/gu,
    replacement: '崑山顧天飐',
    markerRe: /山顧天飐/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]286\.json$/u,
    textRe: /道曷死/gu,
    replacement: '道暍死',
    markerRe: /道曷死/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]177\.json$/u,
    textRe: /葬\{艹\}費/gu,
    replacement: '葬埋費',
    markerRe: /葬\{艹\}費/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]244\.json$/u,
    textRe: /劉一献/gu,
    replacement: '劉一巘',
    markerRe: /劉一献/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]041\.json$/u,
    textRe: /岠禺山/gu,
    replacement: '岠嵎山',
    markerRe: /岠禺山/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]042\.json$/u,
    textRe: /南有涇水，源自開頭山，流經縣界，至高陵縣入謂。/gu,
    replacement: '南有涇水，源自笄頭山，流經縣界，至高陵縣入渭。',
    markerRe: /開頭山/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]044\.json$/u,
    textRe: /雩山/gu,
    replacement: '嶀山',
    markerRe: /雩山/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]244\.json$/u,
    textRe: /今衿，嘉孝穆公世失子也。/gu,
    replacement: '令衿，嘉孝穆公世瓞子也。',
    markerRe: /世失子/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]244\.json$/u,
    textRe: /刘一献/gu,
    replacement: '刘一巘',
    markerRe: /刘一献/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]244\.json$/u,
    textRe: /一献事具/gu,
    replacement: '一巘事具',
    markerRe: /一献事具/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]292\.json$/u,
    textRe: /\{艹\}印/gu,
    replacement: '藏印',
    markerRe: /\{艹\}印/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]460\.json$/u,
    textRe: /段以熾炭/gu,
    replacement: '煅以熾炭',
    markerRe: /段以熾炭/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]317\.json$/u,
    textRe: /青七曰/gu,
    replacement: '青叱曰',
    markerRe: /青七曰/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]244\.json$/u,
    textRe: /兄詛/gu,
    replacement: '咒詛',
    markerRe: /兄詛/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]135\.json$/u,
    textRe: /彗以管簫/gu,
    replacement: '吹以管簫',
    markerRe: /彗以管簫/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]325\.json$/u,
    textRe: /望/gu,
    replacement: '瞭望',
    markerRe: /望/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]325\.json$/u,
    textRe: /望/gu,
    replacement: '瞭望',
    markerRe: /望/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]194\.json$/u,
    textRe: /真目/gu,
    replacement: '瞋目',
    markerRe: /真目/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]376\.json$/u,
    textRe: /何/gu,
    replacement: '何㮚',
    markerRe: /何/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]178\.json$/u,
    textRe: /俞/gu,
    replacement: '俞㮚',
    markerRe: /俞/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]178\.json$/u,
    textRe: //gu,
    replacement: '㮚',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]152\.json$/u,
    textRe: /俞/gu,
    replacement: '俞㮚',
    markerRe: /俞/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]193\.json$/u,
    textRe: /何/gu,
    replacement: '何㮚',
    markerRe: /何/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]275\.json$/u,
    textRe: /魯/gu,
    replacement: '魯瑮',
    markerRe: /魯/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]437\.json$/u,
    textRe: /\s*\{政\}夫/gu,
    replacement: '䈣夫',
    markerRe: /\{政\}夫/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]108\.json$/u,
    textRe: /藇/gu,
    replacement: '薯蕷',
    markerRe: /藇/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\](?:035|036)\.json$/u,
    textRe: /陳日阜/gu,
    replacement: '陳日㷆',
    markerRe: /陳日阜/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]121\.json$/u,
    textRe: /郭煌/gu,
    replacement: '燉煌',
    markerRe: /郭煌/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]127\.json$/u,
    textRe: /姚/gu,
    replacement: '姚訔',
    markerRe: /姚/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]172\.json$/u,
    textRe: /與/gu,
    replacement: '與訔',
    markerRe: /與/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]011\.json$/u,
    textRe: /也先/gu,
    replacement: '也先眾',
    markerRe: /也先/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]011\.json$/u,
    textRe: /梁/gu,
    replacement: '梁珤',
    markerRe: /梁/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]011\.json$/u,
    textRe: /胡/gu,
    replacement: '胡濙',
    markerRe: /胡/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]011\.json$/u,
    textRe: /王/gu,
    replacement: '王翺',
    markerRe: /王/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]011\.json$/u,
    textRe: /杖/gu,
    replacement: '幷杖',
    markerRe: /杖/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]011\.json$/u,
    textRe: /本書及官銜/gu,
    replacement: '本書敍及官銜',
    markerRe: /本書及官銜/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]014\.json$/u,
    textRe: /祐雍王/gu,
    replacement: '祐橒雍王',
    markerRe: /祐雍王/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /祐汝王/gu,
    replacement: '祐梈汝王',
    markerRe: /祐汝王/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /祐涇王/gu,
    replacement: '祐橓涇王',
    markerRe: /祐涇王/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /江/gu,
    replacement: '江悳',
    markerRe: /江/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /諸部肅州塞/gu,
    replacement: '諸部欵肅州塞',
    markerRe: /諸部肅州塞/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /膺奏/gu,
    replacement: '膺鉟奏',
    markerRe: /膺奏/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /惑之禁/gu,
    replacement: '惑眾之禁',
    markerRe: /惑之禁/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /倫文/gu,
    replacement: '倫文敍',
    markerRe: /倫文/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /上元火/gu,
    replacement: '上元煙火',
    markerRe: /上元火/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]015\.json$/u,
    textRe: /秦/gu,
    replacement: '秦綋',
    markerRe: /秦/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /及主事/gu,
    replacement: '幷及主事',
    markerRe: /及主事/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /益/gu,
    replacement: '益切',
    markerRe: /益/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /褥/gu,
    replacement: '牀褥',
    markerRe: /褥/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /自/gu,
    replacement: '自効',
    markerRe: /自/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /遂其土/gu,
    replacement: '遂幷其土',
    markerRe: /遂其土/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /破賊功/gu,
    replacement: '破賊叙功',
    markerRe: /破賊功/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]219\.json$/u,
    textRe: /謂賡修郤/gu,
    replacement: '切謂賡修郤',
    markerRe: /謂賡修郤/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]118\.json$/u,
    textRe: /載龠/gu,
    replacement: '載埨',
    markerRe: /載龠/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]118\.json$/u,
    textRe: /褒節/gu,
    replacement: '褒㸅',
    markerRe: /褒節/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]120\.json$/u,
    textRe: /由學/gu,
    replacement: '由㰒',
    markerRe: /由學/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]120\.json$/u,
    textRe: /連舀/gu,
    replacement: '連䧟',
    markerRe: /連舀/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]309\.json$/u,
    textRe: /亶脊/gu,
    replacement: '亶脊',
    markerRe: /亶脊/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\](?:263|309)\.json$/u,
    textRe: /傳齊/gu,
    replacement: '傳齊',
    markerRe: /傳齊/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]309\.json$/u,
    textRe: /出、隴/gu,
    replacement: '出秦、隴',
    markerRe: /出、隴/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]309\.json$/u,
    textRe: /術受/gu,
    replacement: '術授',
    markerRe: /術受/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]309\.json$/u,
    textRe: /王質/gu,
    replacement: '王瓆',
    markerRe: /王質/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]331\.json$/u,
    textRe: /答師巴羅葛羅思/gu,
    replacement: '答師巴囉葛羅思',
    markerRe: /答師巴羅葛羅思/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]331\.json$/u,
    textRe: /冓鹿/gu,
    replacement: '𦩷𦪇',
    markerRe: /冓鹿/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]331\.json$/u,
    textRe: /慕亶/gu,
    replacement: '慕羶',
    markerRe: /慕亶/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]331\.json$/u,
    textRe: /阿票/gu,
    replacement: '阿䧣',
    markerRe: /阿票/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]046\.json$/u,
    textRe: /螳良川/gu,
    replacement: '螳螂川',
    markerRe: /螳良川/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]046\.json$/u,
    textRe: /峨錄江/gu,
    replacement: '峨碌江',
    markerRe: /峨錄江/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]040\.json$/u,
    textRe: /水/gu,
    replacement: '汦水',
    markerRe: /水/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]049\.json$/u,
    textRe: /遂/gu,
    replacement: '帝遂',
    markerRe: /遂/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]049\.json$/u,
    textRe: /從/gu,
    replacement: '帝從',
    markerRe: /從/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]118\.json$/u,
    textRe: /旭肴/gu,
    replacement: '旭㮁',
    markerRe: /旭肴/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]189\.json$/u,
    textRe: //gu,
    replacement: '䇓',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\]105\.json$/u,
    textRe: /(?:壯|庄)緞傘/gu,
    replacement: '妝緞傘',
    markerRe: /(?:壯|庄)緞傘/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]311\.json$/u,
    textRe: /龍/gu,
    replacement: '駹',
    markerRe: /龍/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]441\.json$/u,
    textRe: /介/gu,
    replacement: '𩡺',
    markerRe: /介/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]001\.json$/u,
    textRe: /泒水/gu,
    replacement: '泒水',
    markerRe: /泒水/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]001\.json$/u,
    textRe: /泒水/gu,
    replacement: '泒水',
    markerRe: /泒水/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]009\.json$/u,
    textRe: /糖追遇毒/gu,
    replacement: '糖䊚遇毒',
    markerRe: /糖追遇毒/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]010\.json$/u,
    textRe: /民、峨/gu,
    replacement: '岷、峨',
    markerRe: /民、峨/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]0(?:11|12)\.json$/u,
    textRe: /周羅/gu,
    replacement: '周羅㬋',
    markerRe: /周羅/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]012\.json$/u,
    textRe: /於監山/gu,
    replacement: '於𡽳山',
    markerRe: /於監山/u,
  },
  {
    found: '',
    fileRe: /[/\\]hanshu[/\\]108\.json$/u,
    textRe: /交止/gu,
    replacement: '交阯',
    markerRe: /交止/u,
  },
  {
    found: '',
    fileRe: /[/\\]hanshu[/\\]108\.json$/u,
    textRe: /王夾/gu,
    replacement: '王唊',
    markerRe: /王夾/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]002\.json$/u,
    textRe: /朐縣/gu,
    replacement: '朐䏰縣',
    markerRe: /朐縣/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]012\.json$/u,
    textRe: /雲/gu,
    replacement: '䍧雲',
    markerRe: /雲/u,
  },
  {
    found: '',
    fileRe: /[/\\]beishi[/\\]044\.json$/u,
    textRe: /、越/gu,
    replacement: '䍧、越',
    markerRe: /、越/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]204\.json$/u,
    textRe: /宗羅/gu,
    replacement: '宗羅睺',
    markerRe: /宗羅/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]20[46]\.json$/u,
    textRe: //gu,
    replacement: '霫',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]206\.json$/u,
    textRe: /馺/gu,
    replacement: '馺',
    markerRe: /馺/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]208\.json$/u,
    textRe: /葛城/gu,
    replacement: '𪃸葛城',
    markerRe: /葛城/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]209\.json$/u,
    textRe: /弩及/gu,
    replacement: '弩及䂎',
    markerRe: /弩及/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]210\.json$/u,
    textRe: /敢犬/gu,
    replacement: '噉犬',
    markerRe: /敢犬/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]210\.json$/u,
    textRe: /出婁及/gu,
    replacement: '出䮫及',
    markerRe: /出婁及/u,
  },
  {
    found: '',
    fileRe: /[/\\]jiutangshu[/\\]213\.json$/u,
    textRe: /備馬/gu,
    replacement: '鞴馬',
    markerRe: /備馬/u,
  },
  {
    found: '',
    fileRe: /[/\\]houhanshu[/\\]036\.json$/u,
    textRe: /三頭\{火\}火/gu,
    replacement: '三頭爇火',
    markerRe: /三頭\{火\}火/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]271\.json$/u,
    textRe: /張/gu,
    replacement: '張旆',
    markerRe: /張/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]287\.json$/u,
    textRe: /字子/gu,
    replacement: '字子暐',
    markerRe: /字子/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]320\.json$/u,
    textRe: /弘/gu,
    replacement: '弘暐',
    markerRe: /弘/u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\]295\.json$/u,
    textRe: /允/gu,
    replacement: '允禵',
    markerRe: /允/u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\]224\.json$/u,
    textRe: /克/gu,
    replacement: '克𡒉',
    markerRe: /克/u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\]\d{3}\.json$/u,
    textRe: //gu,
    replacement: '隘',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\](?:364|373)\.json$/u,
    textRe: /大黃/gu,
    replacement: '大黃滘',
    markerRe: /大黃/u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\](?:234|474)\.json$/u,
    textRe: /戶/gu,
    replacement: '蜑戶',
    markerRe: /戶/u,
  },
  {
    found: '',
    fileRe: /[/\\]qingshigao[/\\](?:404|480)\.json$/u,
    textRe: //gu,
    replacement: '蹤',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]165\.json$/u,
    textRe: /戚蹜/gu,
    replacement: '蹙蹜',
    markerRe: /戚蹜/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]269\.json$/u,
    textRe: /虒亭/gu,
    replacement: '虒亭',
    markerRe: /虒亭/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\](?:166|190)\.json$/u,
    textRe: /孫/gu,
    replacement: '祀孫',
    markerRe: /孫/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]135\.json$/u,
    textRe: /神安坐/gu,
    replacement: '神主安坐',
    markerRe: /神安坐/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]138\.json$/u,
    textRe: /冒為冠/gu,
    replacement: '冒鶡為冠',
    markerRe: /冒為冠/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]121\.json$/u,
    textRe: /立於壇/gu,
    replacement: '立壝於壇',
    markerRe: /立於壇/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /服褶/gu,
    replacement: '服襜褶',
    markerRe: /服褶/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /鼓\?\s*/gu,
    replacement: '鼗鼓、',
    markerRe: /鼓\?/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /三/gu,
    replacement: '三鼗',
    markerRe: /三/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /和/gu,
    replacement: '和㠓',
    markerRe: /和/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /又/gu,
    replacement: '㠓又',
    markerRe: /又/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /今來歲/gu,
    replacement: '今詳來歲',
    markerRe: /今來歲/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /朴意造準/gu,
    replacement: '朴陋意造準',
    markerRe: /朴意造準/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /今當法垂久/gu,
    replacement: '今當陋法垂久',
    markerRe: /今當法垂久/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]126\.json$/u,
    textRe: /范/gu,
    replacement: '范寧',
    markerRe: /范/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]148\.json$/u,
    textRe: /钅首/gu,
    replacement: '鐏首',
    markerRe: /钅首/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]148\.json$/u,
    textRe: /占鞢/gu,
    replacement: '䩞鞢',
    markerRe: /占鞢/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]173\.json$/u,
    textRe: /戲/gu,
    replacement: '巇',
    markerRe: /戲/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]322\.json$/u,
    textRe: /乘縣/gu,
    replacement: '嵊縣',
    markerRe: /乘縣/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]085\.json$/u,
    textRe: /石犎ㄏ隆＃┢嚼诶ㄏ隆Ｎ蹌脔炍輳罎∥玽潁礆胛鞽恰Ｔv復。/gu,
    replacement: '石泉，下。平利，下。熙寧六年，省為鎮入西城，元祐復。',
    markerRe: /石犎ㄏ隆/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]085\.json$/u,
    textRe: /石犎ㄏ隆＃┢嚼诶ㄏ隆Ｎ蹌脔炍輳罎∥玽潁礆胛鞽恰Ｔv復。/gu,
    replacement: '石泉，下。平利，下。熙寧六年，省為鎮入西城，元祐復。',
    markerRe: /石犎ㄏ隆/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]085\.json$/u,
    textRe: /石犎ㄏ隆＃┢嚼诶ㄏ隆Ｎ蹌脔炍輳罎∥玽潁礆胛鞽恰Ｔv復。/gu,
    replacement: '石泉，下。平利，下。熙寧六年，省為鎮入西城，元祐復。',
    markerRe: /石犎ㄏ隆/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]137\.json$/u,
    textRe: /酒/gu,
    replacement: '𣂏酒',
    markerRe: /酒/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]151\.json$/u,
    textRe: /<角>/gu,
    replacement: '䚢',
    markerRe: /<角>/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]390\.json$/u,
    textRe: /拘户绝之租，以广常平之\s*储侍/gu,
    replacement: '拘戶絕之租，以廣常平之儲㣥',
    markerRe: /储侍/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]050\.json$/u,
    textRe: /天歷三年二月，京師大霜，晝\{矛\}/gu,
    replacement: '天曆三年二月，京師大霜，晝雺',
    markerRe: /晝\{矛\}/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]034\.json$/u,
    textRe: /京師大霜晝\{矛\}/gu,
    replacement: '京師大霜晝雺',
    markerRe: /晝\{矛\}/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]134\.json$/u,
    textRe: /夷/gu,
    replacement: '[上𣗥下火]夷',
    markerRe: /夷/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]138\.json$/u,
    textRe: /櫜/gu,
    replacement: '櫜鞬',
    markerRe: /櫜/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]163\.json$/u,
    textRe: /稻/gu,
    replacement: '秔稻',
    markerRe: /稻/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]125\.json$/u,
    textRe: /米/gu,
    replacement: '秔米',
    markerRe: /米/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]125\.json$/u,
    textRe: /稻/gu,
    replacement: '秔稻',
    markerRe: /稻/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]125\.json$/u,
    textRe: /盜欲/gu,
    replacement: '盜秔欲',
    markerRe: /盜欲/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]14[36]\.json$/u,
    textRe: /角<角>/gu,
    replacement: '角端',
    markerRe: /角<角>/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]108\.json$/u,
    textRe: //gu,
    replacement: '燔',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]108\.json$/u,
    textRe: //gu,
    replacement: '燔',
    markerRe: //u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]175\.json$/u,
    textRe: /李林甫石害/gu,
    replacement: '李林甫妬害',
    markerRe: /李林甫石害/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]205\.json$/u,
    textRe: /玉帶幣帛/gu,
    replacement: '玉帶𣰽毺幣帛',
    markerRe: /玉帶幣帛/u,
  },
  {
    found: '',
    fileRe: /[/\\]yuanshi[/\\]205\.json$/u,
    textRe: /玉帶幣帛/gu,
    replacement: '玉帶𣰽毺幣帛',
    markerRe: /玉帶幣帛/u,
  },
  {
    found: '',
    fileRe: /[/\\]sanguozhi[/\\]065\.json$/u,
    textRe: /〈齿〉/gu,
    replacement: '齔',
    markerRe: /〈齿〉/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]012\.json$/u,
    textRe: /黑/gu,
    replacement: '黑㹠',
    markerRe: /黑/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]012\.json$/u,
    textRe: /陳/gu,
    replacement: '陳眕',
    markerRe: /陳/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]012\.json$/u,
    textRe: /陳/gu,
    replacement: '陳眕',
    markerRe: /陳/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]016\.json$/u,
    textRe: /徵磑蒦之/gu,
    replacement: '徵體獲之',
    markerRe: /徵磑蒦之/u,
  },
  {
    found: '',
    fileRe: /[/\\]jinshu[/\\]022\.json$/u,
    textRe: /如郭弩/gu,
    replacement: '如鞹弩',
    markerRe: /如郭弩/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]156\.json$/u,
    textRe: /其子錦衣指揮同知/gu,
    replacement: '其子㫤錦衣指揮同知',
    markerRe: /其子錦衣指揮同知/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]195\.json$/u,
    textRe: /王、徐文英/gu,
    replacement: '王暐、徐文英',
    markerRe: /王、徐文英/u,
  },
  {
    found: '',
    fileRe: /[/\\]mingshi[/\\]213\.json$/u,
    textRe: /范皆長者/gu,
    replacement: '范鏓皆長者',
    markerRe: /范皆長者/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]425\.json$/u,
    textRe: /於時為《》/gu,
    replacement: '於時為《夬》',
    markerRe: /於時為《》/u,
  },
  {
    found: '',
    fileRe: /[/\\]songshi[/\\]245\.json$/u,
    textRe: /不禾(?:)?去/gu,
    replacement: '不𥞋',
    markerRe: /自不禾去始/u,
  },
];

const KNOWN_COMPONENT_PLACEHOLDER_REPAIRS = [
  {
    found: '忄互',
    textRe: /忄互/gu,
    replacement: '恆',
    markerRe: /忄互/u,
  },
  {
    found: '忄辦',
    textRe: /不忄辦|忄辦從/gu,
    replacement: (match) => (match === '不忄辦' ? '不憚' : '憚從'),
    markerRe: /不忄辦|忄辦從/u,
  },
  {
    found: '忄犬',
    textRe: /狃忄犬/gu,
    replacement: '狃忲',
    markerRe: /狃忄犬/u,
  },
  {
    found: '扌烝',
    textRe: /扌烝(?=贍)/gu,
    replacement: '拯',
    markerRe: /扌烝贍/u,
  },
  {
    found: '扌翦',
    textRe: /扌翦(?=白)/gu,
    replacement: '揃',
    markerRe: /扌翦白/u,
  },
  {
    found: '扌隺',
    textRe: /(?<=研)扌隺/gu,
    replacement: '搉',
    markerRe: /研扌隺/u,
  },
  {
    found: '氵公',
    textRe: /氵公(?=樂)/gu,
    replacement: '沿',
    markerRe: /氵公樂/u,
  },
  {
    found: '氵甸',
    textRe: /氵甸(?=盤淺)/gu,
    replacement: '澱',
    markerRe: /浮雞氵甸/u,
  },
  {
    found: '氵術',
    textRe: /氵術(?=陽)/gu,
    replacement: '沭',
    markerRe: /氵術陽/u,
  },
  {
    found: '氵隐强',
    textRe: /氵隐强/gu,
    replacement: '濦強',
    markerRe: /氵隐强/u,
  },
  {
    found: '阝焉',
    textRe: /曰阝焉/gu,
    replacement: '曰鄢',
    markerRe: /曰阝焉/u,
  },
  {
    found: '扌牽',
    textRe: /扌牽(?=戶)/gu,
    replacement: '牽',
    markerRe: /扌牽戶/u,
  },
  {
    found: '礻彗',
    textRe: /礻彗(?=瘞之)/gu,
    replacement: '槥',
    markerRe: /礻彗瘞之/u,
  },
];

const VARIANTS = new Map([
  ['并', '並'],
  ['幷', '並'],
  ['竝', '並'],
  ['茍', '苟'],
  ['姧', '奸'],
  ['姦', '奸'],
  ['筭', '算'],
  ['恒', '恆'],
  ['辠', '罪'],
  ['輓', '挽'],
  ['範', '范'],
  ['祕', '秘'],
  ['徴', '徵'],
  ['征', '徵'],
  ['闇', '暗'],
  ['歎', '嘆'],
  ['廕', '蔭'],
  ['籓', '藩'],
  ['棊', '棋'],
  ['于', '於'],
  ['陜', '陝'],
  ['墻', '牆'],
  ['衞', '衛'],
  ['仆', '僕'],
  ['惪', '德'],
  ['勛', '勳'],
  ['弃', '棄'],
  ['厠', '廁'],
  ['塼', '磚'],
  ['甎', '磚'],
  ['粘', '黏'],
  ['爲', '為'],
  ['衆', '眾'],
  ['奬', '獎'],
  ['寃', '冤'],
  ['陞', '升'],
  ['髙', '高'],
  ['戸', '戶'],
  ['歳', '歲'],
  ['卽', '即'],
  ['旣', '既'],
  ['鄕', '鄉'],
  ['羣', '群'],
  ['説', '說'],
  ['内', '內'],
  ['淸', '清'],
  ['絶', '絕'],
  ['呉', '吳'],
  ['撃', '擊'],
  ['鈎', '鉤'],
  ['鎭', '鎮'],
  ['塲', '場'],
  ['眞', '真'],
  ['隣', '鄰'],
  ['録', '錄'],
  ['畧', '略'],
  ['毎', '每'],
  ['温', '溫'],
  ['鷄', '雞'],
  ['敍', '敘'],
  ['虚', '虛'],
  ['産', '產'],
  ['慙', '慚'],
  ['驩', '歡'],
  ['倶', '俱'],
  ['効', '效'],
  ['疎', '疏'],
  ['却', '卻'],
  ['勗', '勖'],
  ['㫖', '旨'],
  ['栢', '柏'],
  ['槩', '概'],
  ['欵', '款'],
  ['暦', '曆'],
  ['歴', '歷'],
  ['諡', '謚'],
  ['朞', '期'],
  ['泄', '洩'],
  ['渉', '涉'],
  ['靑', '青'],
  ['牋', '箋'],
  ['矦', '侯'],
  ['茘', '荔'],
  ['贊', '讚'],
  ['皐', '皋'],
  ['礮', '炮'],
  ['禀', '稟'],
  ['穉', '稚'],
  ['亖', '四'],
]);

const ADDITIONAL_VARIANT_GROUPS = [
  '國国', '問问', '對对', '與与', '無无', '諸诸', '歷曆歴历', '後后',
  '歲岁', '懷怀', '聞闻', '時时', '復复', '爲為为', '餘余', '裡裏里',
  '潁穎', '覆复復', '舍捨', '璽玺', '韍韨', '傳传', '數数', '寶宝',
  '廣广', '宮宫', '鏐镠', '闍阇', '顒颙', '揚扬', '紘纮', '翬翚',
  '釋释', '陳陈', '餕馂', '璫珰', '穀谷', '發髮发', '禦御',
  '鎔镕熔', '鉶铏', '錡锜', '鬚須', '築筑', '繫係系', '寧甯',
  '干幹', '采採', '遊游', '臺台', '衛衞卫', '眾衆',
  '貢贡', '圖图', '滎荥', '鑿凿', '溝沟', '澗涧', '衝冲',
  '決决', '簡简', '費费', '猶犹', '億亿', '計计', '經经',
  '陰阴', '陽阳', '趙赵', '綱纲', '塢坞', '繕缮', '遠远',
  '來来', '誡诫', '恥耻', '畝亩', '別别', '動动', '載载',
  '聖圣', '儀仪', '營营', '強强', '報报', '爾尔', '藝艺',
  '盜盗', '賑赈', '倉仓', '憐怜', '憫悯', '窮穷', '畢毕',
  '邊边', '跡迹', '黃黄', '禮礼', '廟庙', '毀毁', '郵邮',
  '輸输', '盡尽', '產产', '飾饰', '緘缄', '閉闭', '薦荐',
  '陸陆', '邁迈', '辭辞', '憂忧', '顧顾', '鴻鸿', '爭争',
  '則则', '贊赞', '幾几', '機机', '雖虽', '濟济', '寬宽',
  '氣气', '傷伤', '賞赏', '覽览', '結结', '詳详', '監监',
  '荆荊', '脩修', '厎底', '琅瑯', '襃褒', '啓啟', '塗涂',
  '徧遍', '嶽岳', '嚮向', '蝱虻', '蝨虱', '劄札', '犇奔',
  '弑弒', '巣巢', '檇槜', '虗虛', '秏耗', '晩晚', '蚤早',
  '塡填', '鍾鐘', '彊強强', '饑飢', '竒奇', '菑災',
  '鉅巨', '訾貲', '鉏鋤', '冦宼寇', '慿憑', '谿溪',
  '祇祗', '汙污', '蹔暫', '牀床', '麤粗', '駮駁',
  '鄂噩', '攷考', '徃往', '閤閣', '尙尚', '竈灶',
  '甞嘗', '妬妒', '竪豎', '蠧蠹', '鑒鑑', '讌宴',
  '觧解', '猨猿', '袵衽', '敕勅', '筦管', '譌訛',
  '舘館', '僞偽', '媿愧', '昬昏', '逕徑', '恠怪',
  '畺壃疆',
  '覩睹', '賔賓', '冡塚', '讎仇',
];

const SEMANTIC_VARIANT_NOOP_PAIRS = new Set([
  '后⇄後',
  '後⇄后',
  '谷⇄穀',
  '穀⇄谷',
  '里⇄裏',
  '裏⇄里',
  '里⇄裡',
  '裡⇄里',
  '干⇄幹',
  '幹⇄干',
  '余⇄餘',
  '餘⇄余',
  '發⇄髮',
  '髮⇄發',
  '復⇄覆',
  '覆⇄復',
  '復⇄複',
  '複⇄復',
  '舍⇄捨',
  '捨⇄舍',
  '禦⇄御',
  '御⇄禦',
  '采⇄採',
  '採⇄采',
  '臺⇄台',
  '台⇄臺',
]);

for (const group of ADDITIONAL_VARIANT_GROUPS) {
  const chars = [...group];
  const canonical = VARIANTS.get(chars[0]) || chars[0];
  for (const char of chars) {
    if (char !== canonical && !VARIANTS.has(char)) VARIANTS.set(char, canonical);
  }
}

const CURATED_GRAPH_VARIANT_GROUPS = [
  '迺乃',
  '襃褒',
  '謡謠',
  '歳歲',
  '衝沖',
  '產産',
  '愼慎',
  '前歬',
  '弔吊',
  '衆眾',
  '敎教',
  '讐讎',
  '踴踊',
  '諠喧',
  '譁嘩',
  '闢辟',
  '曆歷',
  '併並',
  '市巿',
  '繫係系繋',
  '脫脱',
];

const CURATED_GRAPH_VARIANTS = new Map();
for (const group of CURATED_GRAPH_VARIANT_GROUPS) {
  const chars = [...group];
  const canonical = VARIANTS.get(chars[0]) || chars[0];
  for (const char of chars) CURATED_GRAPH_VARIANTS.set(char, canonical);
}

const TABLE_VARIANTS = new Map([
  ...VARIANTS,
  ['廿', '二十'],
  ['卅', '三十'],
]);
const CHAPTER_CONTAINMENT_MIN_KEY_LENGTH = 20;
const ANCHORED_CHAPTER_CONTAINMENT_MIN_KEY_LENGTH = 8;
const ANCHORED_CHAPTER_CONTAINMENT_MAX_GAP = 600;
const ANCHORED_CHAPTER_CONTAINMENT_MIN_ANCHOR_LENGTH = 4;
const CHAPTER_CONTAINMENT_VARIANT_EXCLUSIONS = new Set([
  '后', '後',
  '谷', '穀',
  '里', '裏', '裡',
  '干', '幹',
  '余', '餘',
  '發', '髮',
  '复', '復', '複', '覆',
  '舍', '捨',
  '御', '禦',
  '采', '採',
  '台', '臺',
]);
const CHAPTER_CONTAINMENT_VARIANTS = new Map(
  [...VARIANTS].filter(([char]) => !CHAPTER_CONTAINMENT_VARIANT_EXCLUSIONS.has(char)),
);
const COMMENTARY_ALIGNMENT_VARIANT_GROUPS = [
  '鬭鬥鬬斗',
  '閒間',
  '楡榆',
  '髙高',
  '内內',
  '呉吳',
  '歳歲',
  '晩晚',
  '靑青',
  '虚虛',
  '衆眾',
  '爲為',
  '産產',
  '歴歷曆',
  '舍捨',
  '範范',
  '榖穀谷',
  '閤閣',
];
const COMMENTARY_ALIGNMENT_VARIANTS = new Map();
for (const group of COMMENTARY_ALIGNMENT_VARIANT_GROUPS) {
  const chars = [...group];
  const canonical = VARIANTS.get(chars[0]) || chars[0];
  for (const char of chars) COMMENTARY_ALIGNMENT_VARIANTS.set(char, canonical);
}

function usage() {
  console.error(`Usage:
  node scripts/repair-source-queue-patterns.mjs [--apply] [--book BOOK] [--reviewer NAME] [--skip-reopen]

Clears high-confidence repair queue patterns. Dry-run by default.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    reviewer: DEFAULT_REVIEWER,
    skipReopen: false,
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
    if (arg === '--skip-reopen') {
      opts.skipReopen = true;
      continue;
    }
    if (arg === '--book') {
      const book = String(argv[++i] || '').trim();
      if (book) opts.books.add(book);
      continue;
    }
    if (arg.startsWith('--book=')) {
      const book = arg.slice('--book='.length).trim();
      if (book) opts.books.add(book);
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

  return opts;
}

function statusOf(item) {
  const status = String(item?.status || '').toLowerCase();
  const decision = String(item?.decision || '').toLowerCase();
  const values = new Set([status, decision].filter(Boolean));

  if (item?.appliedAt || item?.appliedSummary || values.has('applied') || values.has('included')) return 'applied';
  if (values.has('denied') || values.has('rejected') || values.has('declined') || values.has('false-positive') || values.has('false_positive')) return 'rejected';
  if (values.has('approved')) return 'approved';
  return 'pending';
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/[\s\u200B-\u200D\uFEFF]+/gu, '').trim();
}

function normalizeComparisonMarkup(text) {
  return String(text || '').replace(CTEXT_INLINE_MARKUP_RE, '$1');
}

function normalizePunctuation(text) {
  return String(text || '')
    .replace(/[﹑、]/g, '，')
    .replace(/[﹔;]/g, '；')
    .replace(/[﹕:]/g, '：')
    .replace(/[﹗!]/g, '！')
    .replace(/[﹖?]/g, '？')
    .replace(/[“”]/g, '「')
    .replace(/[‘’]/g, '」')
    .replace(/[〈《]/g, '《')
    .replace(/[〉》]/g, '》')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')');
}

function strippedText(text) {
  return normalizePunctuation(normalizeWhitespace(normalizeComparisonMarkup(text))).normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9A-Za-z]/gu, '');
}

function variantKey(text) {
  let out = '';
  for (const char of strippedText(text)) out += VARIANTS.get(char) || char;
  return out;
}

function variantText(text) {
  let out = '';
  for (const char of normalizePunctuation(normalizeWhitespace(normalizeComparisonMarkup(text))).normalize('NFKC')) {
    out += VARIANTS.get(char) || char;
  }
  return out;
}

function curatedGraphVariantChar(char) {
  const variant = VARIANTS.get(char) || char;
  return CURATED_GRAPH_VARIANTS.get(char) || CURATED_GRAPH_VARIANTS.get(variant) || variant;
}

function curatedGraphVariantText(text) {
  let out = '';
  for (const char of normalizePunctuation(normalizeWhitespace(normalizeComparisonMarkup(text))).normalize('NFKC')) {
    out += curatedGraphVariantChar(char);
  }
  return out;
}

function hasCuratedGraphVariantDifference(source, local) {
  const sourceChars = [...strippedText(source)];
  const localChars = [...strippedText(local)];
  if (sourceChars.length !== localChars.length) return false;

  let found = false;
  for (let i = 0; i < sourceChars.length; i += 1) {
    const sourceChar = sourceChars[i];
    const localChar = localChars[i];
    if (sourceChar === localChar) continue;
    if (curatedGraphVariantChar(sourceChar) !== curatedGraphVariantChar(localChar)) return false;
    if (CURATED_GRAPH_VARIANTS.has(sourceChar) || CURATED_GRAPH_VARIANTS.has(localChar)) found = true;
  }
  return found;
}

function semanticVariantRisk(source, local) {
  const sourceChars = [...strippedText(source)];
  const localChars = [...strippedText(local)];
  if (sourceChars.length !== localChars.length) return false;

  for (let i = 0; i < sourceChars.length; i += 1) {
    const sourceChar = sourceChars[i];
    const localChar = localChars[i];
    if (sourceChar === localChar) continue;
    if (SEMANTIC_VARIANT_NOOP_PAIRS.has(`${sourceChar}⇄${localChar}`)) return true;
  }
  return false;
}

function stripTableMarkupText(text) {
  return normalizePunctuation(normalizeWhitespace(normalizeComparisonMarkup(text))).normalize('NFKC')
    .replace(TABLE_SPAN_ATTR_RE, '')
    .replace(/\|-\|?/gu, '')
    .replace(/[|!]+/gu, '')
    .replace(/-{2,}/gu, '')
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/gu, '$1')
    .replace(/\[\[|\]\]/gu, '');
}

function tableVariantText(text) {
  let out = '';
  for (const char of stripTableMarkupText(text)) {
    out += TABLE_VARIANTS.get(char) || char;
  }
  return out;
}

function tableContentKey(text) {
  let out = '';
  for (const char of stripTableMarkupText(text).replace(/[^\p{Script=Han}0-9]/gu, '')) {
    out += TABLE_VARIANTS.get(char) || char;
  }
  return out;
}

function chapterContainmentKey(text) {
  let out = '';
  for (const char of stripTableMarkupText(stripWikiControls(text)).replace(/[^\p{Script=Han}0-9]/gu, '')) {
    out += CHAPTER_CONTAINMENT_VARIANTS.get(char) || char;
  }
  return out;
}

function countNonOverlappingOccurrences(haystack, needle) {
  if (!haystack || !needle) return 0;
  let count = 0;
  let position = 0;
  while (position < haystack.length) {
    const index = haystack.indexOf(needle, position);
    if (index < 0) break;
    count += 1;
    position = index + Math.max(needle.length, 1);
  }
  return count;
}

function indexesOf(haystack, needle) {
  const indexes = [];
  if (!haystack || !needle) return indexes;
  let position = 0;
  while (position < haystack.length) {
    const index = haystack.indexOf(needle, position);
    if (index < 0) break;
    indexes.push(index);
    position = index + 1;
  }
  return indexes;
}

function mingshiTableDateExpandedKey(text) {
  return tableContentKey(String(text || '').replace(MING_QING_REIGN_YEAR_RE, ''));
}

function stripUpstreamResidue(text) {
  return String(text || '')
    .replace(UPSTREAM_RESIDUE_TOKEN_RE, '')
    .replace(WIKI_INLINE_HEADING_RE, '');
}

function stripWikiControls(text) {
  return stripUpstreamResidue(text).replace(WIKI_TOC_CONTROL_RE, '');
}

function stripWikiPageFields(text) {
  return stripUpstreamResidue(String(text || '')
    .replace(WIKI_PAGE_METADATA_FIELD_RE, '')
    .replace(WIKI_PAGE_NOTES_KEY_RE, ''))
    .replace(WIKI_TOC_CONTROL_RE, '');
}

function isVariantOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  if (semanticVariantRisk(source, local)) return false;
  const sourceText = normalizePunctuation(normalizeWhitespace(source)).normalize('NFKC');
  const localText = normalizePunctuation(normalizeWhitespace(local)).normalize('NFKC');
  return sourceText !== localText && variantText(source) === variantText(local);
}

function isCuratedGraphVariantOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  if (semanticVariantRisk(source, local)) return false;
  const sourceText = normalizePunctuation(normalizeWhitespace(source)).normalize('NFKC');
  const localText = normalizePunctuation(normalizeWhitespace(local)).normalize('NFKC');
  return sourceText !== localText
    && hasCuratedGraphVariantDifference(source, local)
    && curatedGraphVariantText(source) === curatedGraphVariantText(local);
}

function isUpstreamResidueOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  const sourceWithoutResidue = stripUpstreamResidue(source);
  if (sourceWithoutResidue === source || UPSTREAM_RESIDUE_RE.test(local)) return false;

  const sourceKey = variantKey(sourceWithoutResidue);
  const localKey = variantKey(local);
  if (!sourceKey) return !localKey;
  return variantText(sourceWithoutResidue) === variantText(local);
}

function isWikiPageMetadataOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  const sourceWithoutFields = stripWikiPageFields(source);
  if (sourceWithoutFields === source || !sourceWithoutFields) return false;
  return variantText(sourceWithoutFields) === variantText(local);
}

function isSourceOnlyCommentaryNoOp(item) {
  if (item.type !== 'source_omission_candidate') return false;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || local) return false;
  return SOURCE_COMMENTARY_START_RE.test(source);
}

function isSourceOnlyGlossCommentaryNoOp(item) {
  if (item.type !== 'source_omission_candidate') return false;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || local) return false;
  if (!itemHasRelaxedStableAnchors(item)) return false;

  const normalized = normalizeWhitespace(source).replace(LEADING_CLOSE_PUNCT_RE, '');
  if (!normalized || SOURCE_ANNALISTIC_START_RE.test(normalized)) return false;

  if ([...normalized].length <= 120 && SOURCE_SHORT_GLOSS_COMMENTARY_RE.test(normalized)) return true;
  return item.book === 'houhanshu' && SOURCE_CITATION_COMMENTARY_START_RE.test(normalized);
}

function isHouhanshuSourceOnlyAnnotationNoOp(item) {
  if (item.type !== 'source_omission_candidate' || item.book !== 'houhanshu') return false;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || local) return false;

  const normalized = normalizeWhitespace(source).replace(LEADING_CLOSE_PUNCT_RE, '');
  if (!normalized || SOURCE_ANNALISTIC_START_RE.test(normalized)) return false;

  const length = [...normalized].length;
  if (length <= 70 && HOUHANSHU_SHORT_ANNOTATION_RE.test(normalized)) return true;
  if (length > 90 || !HOUHANSHU_CITATION_ANNOTATION_RE.test(normalized)) return false;

  const sentencePunctuation = normalized.match(/[。！？]/gu) || [];
  if (sentencePunctuation.length > 1) return false;

  const firstSentenceEnd = normalized.search(/[。！？]/u);
  if (firstSentenceEnd >= 0) {
    const tail = normalized.slice(firstSentenceEnd + 1);
    if (HOUHANSHU_BASE_SENTENCE_AFTER_ANNOTATION_RE.test(tail)) return false;
  }
  return true;
}

function isLocalOnlyCommentaryNoOp(item) {
  if (item.type !== 'local_extra_candidate') return false;
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (source || !local) return false;
  const bareNote = local.match(SOURCE_BARE_NOTE_MARKER_RE);
  const rest = bareNote ? local.slice(bareNote[0].length).trimStart() : '';
  return SOURCE_COMMENTARY_START_RE.test(local)
    || SOURCE_COMMENTARY_BLOCK_MARKER_RE.test(local)
    || SOURCE_COMMENTARY_ALIGNMENT_MARKER_RE.test(local)
    || (Boolean(bareNote) && (!rest || SOURCE_BARE_NOTE_COMMENTARY_CUE_RE.test(rest)));
}

function isCleanLocalExtraWitnessOmissionNoOp(item, cache) {
  if (item.type !== 'local_extra_candidate') return null;
  const sourceName = String(item.sourceName || '');
  const sourceUrl = String(item.sourceUrl || '');
  if (!/wikisource/i.test(`${sourceName} ${sourceUrl}`)) return null;

  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (source || !local) return null;
  if (LOCAL_EXTRA_ARTIFACT_MARKER_RE.test(local)) return null;
  if (!itemHasRelaxedStableAnchors(item)) return null;
  if (!localRangeMatchesLiveText(item, cache)) return null;

  const beforeKey = relaxedAnchorKey(item.context?.beforeSource || '');
  const afterKey = relaxedAnchorKey(item.context?.afterSource || '');
  if (!beforeKey && !afterKey) return null;

  return {
    length: [...normalizeWhitespace(local)].length,
    ids: item.localRange?.ids || [],
  };
}

function stripSourceCommentaryBlocks(text) {
  return String(text || '').replace(SOURCE_COMMENTARY_BLOCK_RE, '');
}

function commentaryComparisonTokens(text) {
  const source = String(text || '').normalize('NFKC');
  const out = [];
  for (const match of source.matchAll(SOURCE_COMMENTARY_COMPARISON_TOKEN_RE)) {
    const mapped = commentaryAlignmentChar(match[0]);
    for (const char of mapped) out.push({ char, raw: match.index });
  }
  return out;
}

function commentaryMarkers(text) {
  const source = String(text || '').normalize('NFKC');
  return [...source.matchAll(SOURCE_COMMENTARY_ALIGNMENT_MARKER_RE)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    text: match[0],
  }));
}

function commentaryAlignmentChar(char) {
  return COMMENTARY_ALIGNMENT_VARIANTS.get(char) || VARIANTS.get(char) || char;
}

function commentaryAlignmentKey(text) {
  return commentaryComparisonTokens(text).map((token) => token.char).join('');
}

function stripLocalEditorialApparatus(text, { dropSquare = false } = {}) {
  let out = String(text || '').replace(/（[^）]{0,30}）/gu, '');
  if (dropSquare) return out.replace(/［[^］]{0,30}］/gu, '');
  return out.replace(/[［］]/gu, '');
}

function commentaryMarkerBetween(markers, previousRaw, currentRaw) {
  return markers.find((marker) => marker.start > previousRaw && marker.start <= currentRaw) || null;
}

function stripSourceCommentaryByAlignment(sourceText, localText) {
  const source = String(sourceText || '').normalize('NFKC');
  const sourceTokens = commentaryComparisonTokens(source);
  const localTokens = commentaryComparisonTokens(localText);
  const markers = commentaryMarkers(source);
  if (sourceTokens.length === 0 || localTokens.length === 0 || markers.length === 0) return null;

  const deadEnds = new Set();
  const matchFrom = (sourceIndex, localIndex) => {
    const memoKey = `${sourceIndex}:${localIndex}`;
    if (deadEnds.has(memoKey)) return null;

    if (localIndex === localTokens.length) {
      if (sourceIndex === sourceTokens.length) return [];
      const previousRaw = sourceIndex > 0 ? sourceTokens[sourceIndex - 1].raw : -1;
      const currentRaw = sourceTokens[sourceIndex]?.raw ?? source.length;
      const marker = commentaryMarkerBetween(markers, previousRaw, currentRaw);
      if (!marker) {
        deadEnds.add(memoKey);
        return null;
      }
      return [[marker.start, source.length]];
    }

    if (sourceIndex === sourceTokens.length) {
      deadEnds.add(memoKey);
      return null;
    }

    if (sourceTokens[sourceIndex].char === localTokens[localIndex].char) {
      const result = matchFrom(sourceIndex + 1, localIndex + 1);
      if (result) return result;
    }

    const previousRaw = sourceIndex > 0 ? sourceTokens[sourceIndex - 1].raw : -1;
    const marker = commentaryMarkerBetween(markers, previousRaw, sourceTokens[sourceIndex].raw);
    if (!marker) {
      deadEnds.add(memoKey);
      return null;
    }

    for (let resumeIndex = sourceIndex + 1; resumeIndex < sourceTokens.length; resumeIndex += 1) {
      if (sourceTokens[resumeIndex].raw <= marker.end) continue;
      if (sourceTokens[resumeIndex].char !== localTokens[localIndex].char) continue;

      const result = matchFrom(resumeIndex, localIndex);
      if (result) return [[marker.start, sourceTokens[resumeIndex].raw], ...result];
    }

    deadEnds.add(memoKey);
    return null;
  };

  const ranges = matchFrom(0, 0);
  if (!ranges) return null;

  ranges.sort((a, b) => a[0] - b[0]);
  let stripped = '';
  let position = 0;
  for (const [start, end] of ranges) {
    if (start < position) return null;
    stripped += source.slice(position, start);
    position = end;
  }
  stripped += source.slice(position);
  return stripped;
}

function isEmbeddedSourceCommentaryNoOp(item, cache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
    'source_omission_candidate',
  ].includes(item.type)) return false;

  const source = item.sourceRange?.text || '';
  if (!source || !SOURCE_COMMENTARY_BLOCK_MARKER_RE.test(source)) return false;

  const liveLocal = liveLocalRangeComparisonText(item, cache);
  if (!liveLocal) return false;

  const strippedSource = stripSourceCommentaryBlocks(source);
  if (strippedSource !== source) {
    const sourceText = variantText(stripTableMarkupText(strippedSource));
    const localText = variantText(stripTableMarkupText(liveLocal));
    if (sourceText && localText && sourceText === localText) return true;
  }

  const alignedSource = stripSourceCommentaryByAlignment(source, liveLocal);
  if (!alignedSource) return false;
  const sourceText = variantText(stripTableMarkupText(alignedSource));
  const localText = variantText(stripTableMarkupText(liveLocal));
  return Boolean(sourceText && localText && sourceText === localText);
}

function isEmbeddedSourceCommentaryApparatusNoOp(item, cache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
    'source_omission_candidate',
  ].includes(item.type)) return false;

  const source = item.sourceRange?.text || '';
  if (!source || !SOURCE_COMMENTARY_ALIGNMENT_MARKER_RE.test(source)) return false;
  SOURCE_COMMENTARY_ALIGNMENT_MARKER_RE.lastIndex = 0;
  if (!itemHasRelaxedStableAnchors(item)) return false;

  const liveLocal = liveLocalRangeComparisonText(item, cache);
  if (!liveLocal || LOCAL_PLACEHOLDER_OR_PRIVATE_GLYPH_RE.test(liveLocal)) return false;

  for (const dropSquare of [false, true]) {
    const localBase = stripLocalEditorialApparatus(liveLocal, { dropSquare });
    if (!localBase) continue;
    const alignedSource = stripSourceCommentaryByAlignment(source, localBase);
    if (!alignedSource) continue;

    const sourceKey = commentaryAlignmentKey(stripTableMarkupText(alignedSource));
    const localKey = commentaryAlignmentKey(stripTableMarkupText(localBase));
    if (sourceKey && localKey && sourceKey === localKey) return true;
  }

  return false;
}

function isEmbeddedSourceCommentaryBaseTextNoOp(item, cache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
  ].includes(item.type)) return false;

  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local || !SOURCE_COMMENTARY_TAIL_MARKER_RE.test(source)) return false;
  if (LOCAL_PLACEHOLDER_OR_PRIVATE_GLYPH_RE.test(local)) return false;
  if (!itemHasRelaxedStableAnchors(item)) return false;

  let liveLocal = liveLocalRangeComparisonText(item, cache);
  if (!liveLocal) {
    if (!liveTableRangeContainsRecordedText(item, cache)) return false;
    liveLocal = local;
  }

  const strippedSource = source.replace(SOURCE_COMMENTARY_TAIL_RE, '');
  if (!strippedSource || strippedSource === source) return false;

  const sourceText = variantText(stripTableMarkupText(strippedSource));
  const localText = variantText(stripTableMarkupText(liveLocal));
  return Boolean(sourceText && localText && sourceText === localText);
}

function isLinkedChronologyFragment(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized || SOURCE_SENTENCE_PUNCT_RE.test(normalized)) return false;
  return LINKED_CHRONO_FRAGMENT_RE.test(normalized);
}

function isUnsafeChronologyBoundary(omitted, preceding, following) {
  const previousText = normalizeWhitespace(preceding);
  const nextText = normalizeWhitespace(following);
  const yearMarkerRe = /^(?:元|[一二三四五六七八九十百廿卅]+)年/u;

  const yearTail = omitted.match(/([元一二三四五六七八九十百廿卅]+年)$/u)?.[1] || '';
  if (previousText.endsWith(omitted) || (yearTail && previousText.endsWith(yearTail))) return true;
  if (nextText.startsWith(omitted) || (yearTail && nextText.startsWith(yearTail))) return true;
  return yearMarkerRe.test(nextText);
}

function isWikisourceLinkedChronologyNoOp(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const sourceName = String(item.sourceName || '');
  const sourceUrl = String(item.sourceUrl || '');
  if (!/wikisource/i.test(`${sourceName} ${sourceUrl}`)) return null;

  const sourceRange = item.sourceRange;
  const localRange = item.localRange;
  if (!sourceRange || !localRange) return null;

  const source = normalizeWhitespace(sourceRange.text || '');
  const local = normalizeWhitespace(localRange.text || '');
  if (!source || !local || variantText(source) === variantText(local)) return null;

  const beforeSource = stripWikiControls(item.context?.beforeSource || '');
  const beforeLocal = item.context?.beforeLocal || '';
  if (beforeSource || beforeLocal) {
    if (variantText(beforeSource) !== variantText(beforeLocal)) return null;
  }
  const afterSource = stripWikiControls(item.context?.afterSource || '');
  const afterLocal = item.context?.afterLocal || '';
  if (afterSource || afterLocal) {
    if (variantText(afterSource) !== variantText(afterLocal)) return null;
  }

  const locations = localRange.locations || [];
  if (locations.length > 0) {
    const units = liveUnitsForItem(item, cache);
    if (!units) return null;
    const indices = locations.map((location) => units.findIndex((unit) => unitMatchesLocation(unit, location)));
    if (indices.some((index) => index < 0)) return null;
    for (let i = 1; i < indices.length; i += 1) {
      if (indices[i] <= indices[i - 1]) return null;
    }
    const liveText = indices.map((index) => String(units[index].unit[units[index].key] || '')).join('');
    if (variantText(liveText) !== variantText(local)) return null;
  }

  const chars = [...local];
  for (let start = 0; start < chars.length; start += 1) {
    const maxEnd = Math.min(chars.length, start + 16);
    for (let end = start + 2; end <= maxEnd; end += 1) {
      const omitted = chars.slice(start, end).join('');
      if (!isLinkedChronologyFragment(omitted)) continue;
      if (isUnsafeChronologyBoundary(omitted, chars.slice(0, start).join(''), chars.slice(end).join(''))) continue;

      const retained = `${chars.slice(0, start).join('')}${chars.slice(end).join('')}`;
      if (variantText(retained) !== variantText(source)) continue;

      return {
        omitted,
        start,
        ids: localRange.ids || [],
      };
    }
  }

  return null;
}

function isDroppedChronologyPrefix(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized || SOURCE_BODY_PUNCT_RE.test(normalized)) return false;
  return DROPPED_CHRONO_PREFIX_RE.test(normalized);
}

function isDroppedEraNameBeforeYear(text, following) {
  const normalized = normalizeWhitespace(text);
  if (!/^[\p{Script=Han}]{1,4}$/u.test(normalized)) return false;
  return /^(?:元|[一二三四五六七八九十百廿卅]+)(?:年|載)/u.test(normalizeWhitespace(following));
}

function isDuplicateChronologyHeadingPrefix(prefix, retained) {
  const rawRetained = normalizeWhitespace(retained).replace(LEADING_CLOSE_PUNCT_RE, '');
  if (LEADING_YEAR_RE.test(rawRetained)) return true;

  const normalizedPrefix = variantText(normalizeWhitespace(prefix));
  const normalizedRetained = variantText(rawRetained);
  if (!normalizedPrefix || !normalizedRetained) return false;
  if (normalizedRetained.startsWith(normalizedPrefix)) return true;

  const yearTail = normalizedPrefix.match(/(?:元|[一二三四五六七八九十百廿卅]+)年$/u)?.[0] || '';
  return Boolean(yearTail && normalizedRetained.startsWith(yearTail));
}

function stripDroppedChronologyPrefixesAtBoundaries(text) {
  const chars = [...normalizeWhitespace(text)];
  const removed = [];
  let out = '';

  for (let index = 0; index < chars.length;) {
    const previous = out.at(-1) || '';
    const atBoundary = index === 0 || /[。！？；]/u.test(previous);
    if (atBoundary) {
      const maxEnd = Math.min(chars.length, index + 20);
      let prefix = '';
      for (let end = index + 2; end <= maxEnd; end += 1) {
        const candidate = chars.slice(index, end).join('');
        if (!isDroppedChronologyPrefix(candidate)) continue;
        prefix = candidate;
        break;
      }
      if (prefix) {
        removed.push(prefix);
        index += [...prefix].length;
        continue;
      }
    }

    out += chars[index];
    index += 1;
  }

  return removed.length > 0 ? { text: out, removed } : null;
}

function itemHasStableAnchors(item) {
  const beforeSource = stripWikiControls(item.context?.beforeSource || '');
  const beforeLocal = item.context?.beforeLocal || '';
  if (beforeSource || beforeLocal) {
    if (variantText(beforeSource.replace(LEADING_CLOSE_PUNCT_RE, '')) !== variantText(beforeLocal)) return false;
  }
  const afterSource = stripWikiControls(item.context?.afterSource || '');
  const afterLocal = item.context?.afterLocal || '';
  if (afterSource || afterLocal) {
    if (variantText(afterSource.replace(LEADING_CLOSE_PUNCT_RE, '')) !== variantText(afterLocal)) return false;
  }
  return true;
}

function relaxedAnchorKey(text) {
  return variantKey(stripWikiControls(text || '').replace(CTEXT_INLINE_MARKUP_RE, '$1'));
}

function itemHasRelaxedStableAnchors(item) {
  const beforeSource = item.context?.beforeSource || '';
  const beforeLocal = item.context?.beforeLocal || '';
  if ((beforeSource || beforeLocal) && relaxedAnchorKey(beforeSource) !== relaxedAnchorKey(beforeLocal)) return false;

  const afterSource = item.context?.afterSource || '';
  const afterLocal = item.context?.afterLocal || '';
  if ((afterSource || afterLocal) && relaxedAnchorKey(afterSource) !== relaxedAnchorKey(afterLocal)) return false;

  return true;
}

function isTitleLikeSectionHeadingText(text) {
  const value = normalizeWhitespace(text);
  if (!value || !/\p{Script=Han}/u.test(value)) return false;
  if (value.length > 80) return false;
  if (SOURCE_SENTENCE_PUNCT_RE.test(value.at(-1) || '')) return false;
  return !SECTION_HEADING_BODY_PUNCT_RE.test(value);
}

function localRangeMatchesLiveText(item, cache) {
  const localRange = item.localRange;
  const locations = localRange?.locations || [];
  if (locations.length === 0) return true;

  const liveText = liveLocalRangeText(item, cache);
  if (liveText === null) return false;
  return variantText(liveText) === variantText(localRange.text || '');
}

function liveLocalRangeText(item, cache) {
  const localRange = item.localRange;
  const locations = localRange?.locations || [];
  if (locations.length === 0) return localRange?.text || '';

  const units = liveUnitsForItem(item, cache);
  if (!units) return null;
  const indices = locations.map((location) => units.findIndex((unit) => unitMatchesLocation(unit, location)));
  if (indices.some((index) => index < 0)) return liveLocalRangeTextByIds(item, units);
  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] <= indices[i - 1]) return liveLocalRangeTextByIds(item, units);
  }
  return indices.map((index) => String(units[index].unit[units[index].key] || '')).join('');
}

function liveLocalRangeTextByIds(item, units) {
  const ids = item.localRange?.ids || [];
  if (ids.length === 0) return null;

  const indices = [];
  let fromIndex = 0;
  for (const id of ids) {
    const index = units.findIndex((unit, candidateIndex) => (
      candidateIndex >= fromIndex && unit.id && unit.id === id
    ));
    if (index < 0) return null;
    indices.push(index);
    fromIndex = index + 1;
  }

  return indices.map((index) => String(units[index].unit[units[index].key] || '')).join('');
}

function liveLocalRangeComparisonText(item, cache) {
  const recorded = item.localRange?.text || '';
  const live = liveLocalRangeText(item, cache);
  if (live === null) return null;
  if (variantText(live) === variantText(recorded)) return live;

  const beforeLocal = item.context?.beforeLocal || '';
  const afterLocal = item.context?.afterLocal || '';
  const candidates = [];
  if (afterLocal) candidates.push(`${recorded}${afterLocal}`);
  if (beforeLocal) candidates.push(`${beforeLocal}${recorded}`);
  if (beforeLocal && afterLocal) candidates.push(`${beforeLocal}${recorded}${afterLocal}`);

  for (const candidate of candidates) {
    if (variantText(live) === variantText(candidate)) return recorded;
  }
  return null;
}

function liveTableRangeContainsRecordedText(item, cache) {
  const recorded = item.localRange?.text || '';
  const live = liveLocalRangeText(item, cache);
  if (live === null) return false;
  const recordedKey = tableContentKey(recorded);
  const liveKey = tableContentKey(live);
  return Boolean(recordedKey && liveKey && liveKey.includes(recordedKey));
}

function isTableMarkupNoOp(item, cache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
    'source_omission_candidate',
  ].includes(item.type)) return null;

  const source = item.sourceRange?.text || '';
  if (!source || !TABLE_MARKUP_RE.test(source)) return null;

  const liveLocal = liveLocalRangeComparisonText(item, cache);
  if (!liveLocal) return null;

  const sourceStripped = stripTableMarkupText(source);
  const localStripped = stripTableMarkupText(liveLocal);
  if (!sourceStripped || !localStripped) return null;
  if (sourceStripped === localStripped && normalizeWhitespace(source) !== normalizeWhitespace(liveLocal)) {
    return { variant: false };
  }
  if (sourceStripped !== localStripped && tableVariantText(source) === tableVariantText(liveLocal)) {
    return { variant: true };
  }
  return null;
}

function isInheritedTableDateNoOp(item, cache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
  ].includes(item.type)) return null;

  const source = item.sourceRange?.text || '';
  if (!source || !item.localRange?.text) return null;

  const locations = item.localRange?.locations || [];
  if (locations.length === 0 || !locations.every((location) => (
    location.kind === 'cell'
    || String(location.blockType || '').startsWith('table')
  ))) return null;

  const local = item.localRange.text || '';
  if (!liveTableRangeContainsRecordedText(item, cache)) return null;

  const beforeSource = tableContentKey(stripWikiControls(item.context?.beforeSource || ''));
  const beforeLocal = tableContentKey(item.context?.beforeLocal || '');
  if ((beforeSource || beforeLocal) && beforeSource !== beforeLocal) return null;

  const afterSource = tableContentKey(stripWikiControls(item.context?.afterSource || ''));
  const afterLocal = tableContentKey(item.context?.afterLocal || '');
  if ((afterSource || afterLocal) && afterSource !== afterLocal) return null;

  const sourceBody = TABLE_EMPTY_CELL_PREFIX_RE.test(source)
    ? source.replace(TABLE_EMPTY_CELL_PREFIX_RE, '')
    : source;
  const sourceKey = tableContentKey(sourceBody);
  const localKey = tableContentKey(local);
  const localWithoutInheritedDates = mingshiTableDateExpandedKey(local);
  if (!sourceKey || !localKey || sourceKey === localKey) return null;

  if (sourceKey !== localWithoutInheritedDates) {
    if (!TABLE_EMPTY_CELL_PREFIX_RE.test(source)) return null;
    if (!localKey.endsWith(sourceKey)) return null;
    const inheritedPrefixKey = localKey.slice(0, localKey.length - sourceKey.length);
    if (!inheritedPrefixKey || !TABLE_INHERITED_DATE_KEY_RE.test(inheritedPrefixKey)) return null;
  }

  return {
    sourceKey,
    localKey,
  };
}

function isWikisourceDroppedChronologyPrefixNoOp(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const sourceName = String(item.sourceName || '');
  const sourceUrl = String(item.sourceUrl || '');
  if (!/wikisource/i.test(`${sourceName} ${sourceUrl}`)) return null;

  const sourceRange = item.sourceRange;
  const localRange = item.localRange;
  if (!sourceRange || !localRange) return null;
  if (!itemHasStableAnchors(item) && !itemHasRelaxedStableAnchors(item)) return null;
  if (!localRangeMatchesLiveText(item, cache)) return null;

  const source = normalizeWhitespace(sourceRange.text || '');
  const local = normalizeWhitespace(localRange.text || '');
  if (!source || !local || variantText(source) === variantText(local)) return null;

  const chars = [...local];
  for (let end = 2; end <= Math.min(chars.length - 1, 20); end += 1) {
    const prefix = chars.slice(0, end).join('');
    if (!isDroppedChronologyPrefix(prefix)) continue;

    const retained = chars.slice(end).join('');
    if (variantText(retained) !== variantText(source)) continue;
    if (isDuplicateChronologyHeadingPrefix(prefix, retained)) continue;

    return {
      omitted: prefix,
      ids: localRange.ids || [],
    };
  }

  const stripped = stripDroppedChronologyPrefixesAtBoundaries(local);
  if (stripped && variantText(stripped.text) === variantText(source)) {
    return {
      omitted: stripped.removed.join(' / '),
      ids: localRange.ids || [],
    };
  }

  return null;
}

function isWikisourceDroppedReignYearPrefixNoOp(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const sourceName = String(item.sourceName || '');
  const sourceUrl = String(item.sourceUrl || '');
  if (!/wikisource/i.test(`${sourceName} ${sourceUrl}`)) return null;

  if (!itemHasStableAnchors(item) && !itemHasRelaxedStableAnchors(item)) return null;
  if (!localRangeMatchesLiveText(item, cache)) return null;

  const source = normalizeWhitespace(item.sourceRange?.text || '');
  const local = normalizeWhitespace(item.localRange?.text || '');
  if (!source || !local || variantText(source) === variantText(local)) return null;

  const body = local.replace(LEADING_CLOSE_PUNCT_RE, '');
  const match = body.match(DROPPED_REIGN_YEAR_PREFIX_RE);
  if (!match) return null;

  const retained = body.slice(match[0].length);
  if (variantText(retained) !== variantText(source)) return null;
  return {
    omitted: match[0],
    ids: item.localRange?.ids || [],
  };
}

function sourceLocalComparisonText(text) {
  return normalizeWhitespace(stripTableMarkupText(stripWikiControls(text || '')));
}

function matchingAfterStructuralPrefix(local, source, prefixRe) {
  const match = local.match(prefixRe);
  if (!match) return null;
  const prefix = match[0];
  const retained = local.slice(prefix.length);
  if (!retained || retained === local) return null;
  if (variantText(retained) !== variantText(source)) return null;
  return {
    omitted: prefix,
    retained,
  };
}

function isWikisourceLocalStructuralPrefixNoOp(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const sourceName = String(item.sourceName || '');
  const sourceUrl = String(item.sourceUrl || '');
  if (!/wikisource/i.test(`${sourceName} ${sourceUrl}`)) return null;

  if (!itemHasStableAnchors(item) && !itemHasRelaxedStableAnchors(item)) return null;
  if (!localRangeMatchesLiveText(item, cache)) return null;

  const source = sourceLocalComparisonText(item.sourceRange?.text || '');
  const local = sourceLocalComparisonText(item.localRange?.text || '').replace(LEADING_CLOSE_PUNCT_RE, '');
  if (!source || !local || variantText(source) === variantText(local)) return null;

  const datePrefix = matchingAfterStructuralPrefix(local, source, DROPPED_LOCAL_DATE_PREFIX_RE);
  if (datePrefix) {
    return {
      kind: 'date',
      omitted: datePrefix.omitted,
      ids: item.localRange?.ids || [],
    };
  }

  const labelPrefix = matchingAfterStructuralPrefix(local, source, LOCAL_STRUCTURAL_LABEL_PREFIX_RE);
  if (labelPrefix) {
    return {
      kind: 'label',
      omitted: labelPrefix.omitted,
      ids: item.localRange?.ids || [],
    };
  }

  return null;
}

function markDenied(item, now, reviewer, notes) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.notes = item.notes ? `${item.notes}\n${notes}` : notes;
}

function markPending(item, notes) {
  item.status = 'pending';
  item.decision = null;
  delete item.reviewedAt;
  delete item.reviewer;
  item.notes = item.notes ? `${item.notes}\n${notes}` : notes;
}

function markApplied(item, now, reviewer, summary) {
  item.status = 'applied';
  item.decision = 'included';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
  item.appliedAt = item.appliedAt || now;
  item.appliedSummary = item.appliedSummary || summary;
  item.notes = item.notes || summary;
}

function sourceKey(unit) {
  for (const key of SOURCE_KEYS) {
    if (typeof unit?.[key] === 'string') return key;
  }
  return null;
}

function collectSourceUnits(data) {
  const units = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (Array.isArray(block.sentences)) {
      for (const [index, unit] of block.sentences.entries()) {
        const key = sourceKey(unit);
        if (!key) continue;
        units.push({
          blockIndex,
          blockType: block.type || 'paragraph',
          collectionName: 'sentences',
          index,
          path: `sentences.${index}.${key}`,
          id: unit.id || '',
          unit,
          key,
        });
      }
    }
    if (Array.isArray(block.cells)) {
      for (const [index, unit] of block.cells.entries()) {
        const key = sourceKey(unit);
        if (!key) continue;
        units.push({
          blockIndex,
          blockType: block.type || 'table_row',
          collectionName: 'cells',
          index,
          path: `cells.${index}.${key}`,
          id: unit.id || '',
          unit,
          key,
        });
      }
    }
  }
  return units;
}

function previousSourceUnit(units, index) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const unit = units[i];
    if (String(unit.unit[unit.key] || '').length > 0) return unit;
  }
  return null;
}

function nextSourceUnit(units, index) {
  for (let i = index + 1; i < units.length; i += 1) {
    const unit = units[i];
    if (String(unit.unit[unit.key] || '').length > 0) return unit;
  }
  return null;
}

function locationIndex(location) {
  if (!location) return undefined;
  return location.sentenceIndex ?? location.cellIndex ?? location.index;
}

function unitMatchesLocation(unit, location) {
  if (!location) return false;
  const kind = location.kind === 'sentence' ? 'sentences' : location.kind === 'cell' ? 'cells' : '';
  return unit.blockIndex === location.blockIndex
    && unit.index === locationIndex(location)
    && unit.key === location.field
    && (!kind || unit.path.startsWith(`${kind}.`));
}

function liveUnitsForItem(item, cache) {
  const file = item.file || '';
  if (!file) return null;
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute);
  if (!fs.existsSync(file)) {
    cache.set(absolute, null);
    return null;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = collectSourceUnits(data);
  cache.set(absolute, units);
  return units;
}

function liveChapterContainmentKey(item, unitCache, keyCache) {
  const file = item.file || '';
  if (!file) return null;
  const absolute = path.resolve(file);
  if (keyCache.has(absolute)) return keyCache.get(absolute);

  const units = liveUnitsForItem(item, unitCache);
  if (!units) {
    keyCache.set(absolute, null);
    return null;
  }

  const key = chapterContainmentKey(units.map((unit) => String(unit.unit[unit.key] || '')).join(''));
  keyCache.set(absolute, key);
  return key;
}

function isSourceAlreadyPresentInLiveChapterNoOp(item, unitCache, keyCache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
    'source_omission_candidate',
  ].includes(item.type)) return null;

  const source = item.sourceRange?.text || '';
  if (!source) return null;

  const sourceKey = chapterContainmentKey(source);
  if (sourceKey.length < CHAPTER_CONTAINMENT_MIN_KEY_LENGTH) return null;

  const chapterKey = liveChapterContainmentKey(item, unitCache, keyCache);
  if (!chapterKey) return null;

  const occurrences = countNonOverlappingOccurrences(chapterKey, sourceKey);
  if (occurrences !== 1) return null;

  return {
    keyLength: sourceKey.length,
  };
}

function matchingContextKey(sourceText, localText) {
  const sourceKey = chapterContainmentKey(sourceText);
  const localKey = chapterContainmentKey(localText);
  if ((sourceKey || localKey) && sourceKey !== localKey) return null;
  return localKey || sourceKey;
}

function isSourceAlreadyPresentBetweenAnchorsNoOp(item, unitCache, keyCache) {
  if (![
    'text_discrepancy_candidate',
    'source_replacement_candidate',
    'source_omission_candidate',
  ].includes(item.type)) return null;

  const source = item.sourceRange?.text || '';
  if (!source) return null;

  const sourceKey = chapterContainmentKey(source);
  if (sourceKey.length < ANCHORED_CHAPTER_CONTAINMENT_MIN_KEY_LENGTH) return null;

  const beforeKey = matchingContextKey(item.context?.beforeSource || '', item.context?.beforeLocal || '');
  if (beforeKey === null) return null;
  const afterKey = matchingContextKey(item.context?.afterSource || '', item.context?.afterLocal || '');
  if (afterKey === null) return null;

  const hasBefore = beforeKey.length >= ANCHORED_CHAPTER_CONTAINMENT_MIN_ANCHOR_LENGTH;
  const hasAfter = afterKey.length >= ANCHORED_CHAPTER_CONTAINMENT_MIN_ANCHOR_LENGTH;
  if (!hasBefore && !hasAfter) return null;
  if (sourceKey.length < CHAPTER_CONTAINMENT_MIN_KEY_LENGTH && (!hasBefore || !hasAfter)) return null;

  const chapterKey = liveChapterContainmentKey(item, unitCache, keyCache);
  if (!chapterKey) return null;

  const matches = [];
  for (const sourceIndex of indexesOf(chapterKey, sourceKey)) {
    let beforeGap = null;
    let afterGap = null;

    if (hasBefore) {
      const beforeIndex = chapterKey.lastIndexOf(beforeKey, Math.max(0, sourceIndex - 1));
      if (beforeIndex < 0) continue;
      const beforeEnd = beforeIndex + beforeKey.length;
      if (beforeEnd > sourceIndex) continue;
      beforeGap = sourceIndex - beforeEnd;
      if (beforeGap > ANCHORED_CHAPTER_CONTAINMENT_MAX_GAP) continue;
    }

    if (hasAfter) {
      const afterIndex = chapterKey.indexOf(afterKey, sourceIndex + sourceKey.length);
      if (afterIndex < 0) continue;
      afterGap = afterIndex - (sourceIndex + sourceKey.length);
      if (afterGap > ANCHORED_CHAPTER_CONTAINMENT_MAX_GAP) continue;
    }

    matches.push({ sourceIndex, beforeGap, afterGap });
  }

  if (matches.length !== 1) return null;
  return {
    keyLength: sourceKey.length,
    beforeAnchorLength: hasBefore ? beforeKey.length : 0,
    afterAnchorLength: hasAfter ? afterKey.length : 0,
  };
}

function liveDataForItem(item, cache) {
  const file = item.file || '';
  if (!file) return null;
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute);
  if (!fs.existsSync(file)) {
    cache.set(absolute, null);
    return null;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const entry = { data, units: collectSourceUnits(data), absolute, file };
  cache.set(absolute, entry);
  return entry;
}

function escapeRegExp(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanEnglishHeadingText(text) {
  let out = String(text || '');
  if (!out) return { text: out, changed: false };

  out = out
    .replace(/^\s*=+\s*[^=]{1,120}\s*=+\s*/u, '')
    .replace(/^\s*([^—.!?:：。！？]{2,80}?)\s+—\s+\1(?=\b|\s|,|，|。|\.|;|；|:|：)/iu, '$1');

  const sentence = out.match(/^([^.!?。！？:：]{2,80})[.!?:：]\s+(.+)$/u);
  if (sentence) {
    const heading = sentence[1].trim();
    const rest = sentence[2];
    const headingRe = new RegExp(`^${escapeRegExp(heading)}(?=\\b|\\s|,|，|。|\\.|;|；|:|：)`, 'iu');
    if (headingRe.test(rest)) {
      out = rest;
    } else {
      const words = heading.split(/\s+/u).filter(Boolean);
      const tail = words.length > 1 ? words.at(-1) : '';
      if (tail) {
        const tailRe = new RegExp(`^${escapeRegExp(tail)}(?=\\b|\\s|,|，|。|\\.|;|；|:|：)`, 'iu');
        if (tailRe.test(rest)) out = `${heading}${rest.slice(tail.length)}`;
      }
    }
  }

  out = out.replace(/\s{2,}/gu, ' ').trim();
  return { text: out, changed: out !== text };
}

function cleanTranslationHeadingArtifacts(unit) {
  let changed = 0;
  for (const field of ['literal', 'idiomatic']) {
    if (typeof unit[field] !== 'string') continue;
    const result = cleanEnglishHeadingText(unit[field]);
    if (!result.changed) continue;
    unit[field] = result.text;
    changed += 1;
  }
  for (const translation of unit.translations || []) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] !== 'string') continue;
      const result = cleanEnglishHeadingText(translation[field]);
      if (!result.changed) continue;
      translation[field] = result.text;
      changed += 1;
    }
  }
  return changed;
}

function titleCaseWords(text) {
  return String(text || '')
    .trim()
    .replace(/\b([a-z])([a-z]*)/giu, (_match, first, rest) => `${first.toUpperCase()}${rest.toLowerCase()}`);
}

function cleanEnglishSourceArtifactText(text) {
  let out = String(text || '');
  if (!out) return { text: out, changed: false };

  out = out
    .replace(/__(?:FORCE)?TOC__|__NOTOC__|__NOCC__/gu, '')
    .replace(/^\s*\[(?:one|two|three|four|five|six|seven|eight|nine|ten|[一二三四五六七八九十百千萬万零〇0-9]+)\]\s*/iu, '')
    .replace(/^\s*\d+\s*[\.)、．]?\s*(?=[A-Z])/u, '')
    .replace(/\[alternate(?: reading)?\s*:\s*([^\]]+)\]/giu, (_match, inner) => titleCaseWords(inner))
    .replace(/\[([^\]\d][^\]]{0,120})\]/gu, (_match, inner) => String(inner || '').trim())
    .replace(/\bEditorial footnote marker\s+\d+\.?\s*/giu, '')
    .replace(/\bSee editorial note\s+\d+\.?\s*/giu, '')
    .replace(/\bsee editorial note\s+\d+\.?\s*/giu, '')
    .replace(/\s+([,.;:!?])/gu, '$1')
    .replace(/([([{"'])\s+/gu, '$1')
    .replace(/\s{2,}/gu, ' ')
    .replace(/^\s*[,.;:]\s*/u, '')
    .trim();

  return { text: out, changed: out !== text };
}

function cleanTranslationSourceArtifacts(unit) {
  let changed = cleanTranslationHeadingArtifacts(unit);
  for (const field of ['literal', 'idiomatic']) {
    if (typeof unit[field] !== 'string') continue;
    const result = cleanEnglishSourceArtifactText(unit[field]);
    if (!result.changed) continue;
    unit[field] = result.text;
    changed += 1;
  }
  for (const translation of unit.translations || []) {
    for (const field of ['literal', 'idiomatic']) {
      if (typeof translation[field] !== 'string') continue;
      const result = cleanEnglishSourceArtifactText(translation[field]);
      if (!result.changed) continue;
      translation[field] = result.text;
      changed += 1;
    }
  }
  return changed;
}

function isLocalHeadingMarkupRepair(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const source = item.sourceRange?.text || '';
  const locations = item.localRange?.locations || [];
  if (!source || locations.length === 0) return null;

  const entry = liveDataForItem(item, cache);
  if (!entry) return null;
  const indices = locations.map((location) => entry.units.findIndex((unit) => unitMatchesLocation(unit, location)));
  if (indices.some((index) => index < 0)) return null;
  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] <= indices[i - 1]) return null;
  }

  const first = entry.units[indices[0]];
  const before = String(first.unit[first.key] || '');
  const match = before.match(LOCAL_HEADING_MARKUP_RE);
  if (!match) return null;

  const after = before.slice(match[0].length);
  if (!after || after === before) return null;
  const cleanedLiveText = [
    after,
    ...indices.slice(1).map((index) => String(entry.units[index].unit[entry.units[index].key] || '')),
  ].join('');
  const sourceText = stripWikiControls(source).replace(LEADING_CLOSE_PUNCT_RE, '');
  if (variantText(cleanedLiveText) !== variantText(sourceText)) return null;

  return {
    entry,
    unit: first,
    before,
    after,
    heading: match[1],
  };
}

function isLocalLeadingNoteMarkerRepair(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const source = item.sourceRange?.text || '';
  const locations = item.localRange?.locations || [];
  if (!source || locations.length !== 1) return null;

  const entry = liveDataForItem(item, cache);
  if (!entry) return null;
  const index = entry.units.findIndex((unit) => unitMatchesLocation(unit, locations[0]));
  if (index < 0) return null;

  const unit = entry.units[index];
  const before = String(unit.unit[unit.key] || '');
  if (!LOCAL_LEADING_NOTE_MARKER_RE.test(before)) return null;

  const after = before.replace(LOCAL_LEADING_NOTE_MARKER_RE, '');
  if (!after || after === before) return null;
  const sourceText = stripWikiControls(source);
  const leadingClose = sourceText.match(LEADING_CLOSE_PUNCT_RE);
  if (leadingClose) {
    const previous = previousSourceUnit(entry.units, index);
    if (!previous || !attachedCloseMatch(String(previous.unit[previous.key] || ''), leadingClose[0])) return null;
  }

  const comparableSource = leadingClose ? sourceText.slice(leadingClose[0].length) : sourceText;
  const exactMatch = variantText(after) === variantText(comparableSource);
  const trailingCloseMatch = !exactMatch && TRAILING_CLOSE_PUNCT_RE.test(after)
    && variantText(after.replace(TRAILING_CLOSE_PUNCT_RE, '')) === variantText(comparableSource);
  if (!exactMatch && !trailingCloseMatch) return null;

  return {
    entry,
    unit,
    before,
    after,
    retainedTrailingClose: trailingCloseMatch,
  };
}

function isShortDuplicateHeadingPrefix(prefix, source) {
  const heading = String(prefix || '').trim();
  if (!heading || [...heading].length > 20) return false;
  if (/[。！？；：，、,.!?;:]/u.test(heading)) return false;
  if (!/^[\p{Script=Han}A-Za-z0-9·]+$/u.test(heading)) return false;

  const sourceText = String(source || '').trimStart();
  if (!sourceText.startsWith(heading)) return false;
  return true;
}

function isLocalDuplicateHeadingRepair(item, cache) {
  if (!['text_discrepancy_candidate', 'source_replacement_candidate'].includes(item.type)) return null;
  const source = item.sourceRange?.text || '';
  const locations = item.localRange?.locations || [];
  if (!source || locations.length !== 1) return null;

  const entry = liveDataForItem(item, cache);
  if (!entry) return null;
  const index = entry.units.findIndex((unit) => unitMatchesLocation(unit, locations[0]));
  if (index < 0) return null;

  const unit = entry.units[index];
  const before = String(unit.unit[unit.key] || '');
  const chars = [...before];
  for (let end = 1; end <= Math.min(chars.length - 1, 20); end += 1) {
    const prefix = chars.slice(0, end).join('');
    const after = chars.slice(end).join('').trimStart();
    if (!after || after === before) continue;
    if (variantText(after) !== variantText(source)) continue;
    if (!isShortDuplicateHeadingPrefix(prefix, source)) continue;

    return {
      entry,
      unit,
      before,
      after,
      heading: prefix.trim(),
    };
  }

  return null;
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

function isLeadingCloseAlreadyAttached(item, cache) {
  const source = item.sourceRange?.text || '';
  const match = source.match(LEADING_CLOSE_PUNCT_RE);
  if (!match) return null;

  const punctuation = match[0];
  const sourceRest = source.slice(punctuation.length);
  if (!sourceRest) return null;

  const locations = item.localRange?.locations || [];
  if (locations.length !== 1) return null;

  const units = liveUnitsForItem(item, cache);
  if (!units) return null;

  const currentIndex = units.findIndex((unit) => unitMatchesLocation(unit, locations[0]));
  if (currentIndex < 0) return null;

  const current = units[currentIndex];
  const currentText = String(current.unit[current.key] || '');

  const previous = previousSourceUnit(units, currentIndex);
  if (!previous) return null;

  const previousText = String(previous.unit[previous.key] || '').trimEnd();
  const attachedClose = attachedCloseMatch(previousText, punctuation);
  if (!attachedClose) return null;

  if (variantText(currentText) === variantText(sourceRest)) {
    return {
      punctuation,
      attachedPunctuation: attachedClose[1],
      previousId: previous.id || previous.path,
      currentId: current.id || current.path,
    };
  }

  const currentChars = [...normalizeWhitespace(currentText)];
  for (let end = 2; end <= Math.min(currentChars.length - 1, 20); end += 1) {
    const prefix = currentChars.slice(0, end).join('');
    if (!isDroppedChronologyPrefix(prefix)) continue;

    const retained = currentChars.slice(end).join('');
    if (variantText(retained) !== variantText(sourceRest)) continue;
    if (isDuplicateChronologyHeadingPrefix(prefix, retained)) continue;

    return {
      punctuation,
      attachedPunctuation: attachedClose[1],
      previousId: previous.id || previous.path,
      currentId: current.id || current.path,
      omitted: prefix,
    };
  }

  for (let start = 0; start < currentChars.length; start += 1) {
    const maxEnd = Math.min(currentChars.length, start + 16);
    for (let end = start + 1; end <= maxEnd; end += 1) {
      const omitted = currentChars.slice(start, end).join('');
      const preceding = currentChars.slice(0, start).join('');
      const following = currentChars.slice(end).join('');
      const isChronology = isLinkedChronologyFragment(omitted)
        ? !isUnsafeChronologyBoundary(omitted, preceding, following)
        : isDroppedEraNameBeforeYear(omitted, following);
      if (!isChronology) continue;

      const retained = `${preceding}${following}`;
      if (variantText(retained) !== variantText(sourceRest)) continue;

      return {
        punctuation,
        attachedPunctuation: attachedClose[1],
        previousId: previous.id || previous.path,
        currentId: current.id || current.path,
        omitted,
      };
    }
  }

  return null;
}

function isChapterStartHeadingNoOp(item, cache) {
  if (item.type !== 'local_extra_candidate') return null;
  if (item.sourceRange && String(item.sourceRange.text || '')) return null;

  const localRange = item.localRange;
  if (!localRange || localRange.startIndex !== 0 || localRange.count < 1) return null;
  if (String(item.context?.beforeSource || '') || String(item.context?.beforeLocal || '')) return null;

  const afterSource = stripWikiControls(item.context?.afterSource || '');
  const afterLocal = item.context?.afterLocal || '';
  if (!afterSource || !afterLocal || variantText(afterSource) !== variantText(afterLocal)) return null;

  const locations = localRange.locations || [];
  if (locations.length !== localRange.count) return null;

  const units = liveUnitsForItem(item, cache);
  if (!units) return null;

  const indices = locations.map((location) => units.findIndex((unit) => unitMatchesLocation(unit, location)));
  if (indices.some((index) => index < 0)) return null;
  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] <= indices[i - 1]) return null;
  }

  const headingText = indices.map((index) => String(units[index].unit[units[index].key] || '')).join('');
  if (variantText(headingText) !== variantText(localRange.text || '')) return null;
  if (SOURCE_SENTENCE_PUNCT_RE.test(headingText)) return null;
  if (previousSourceUnit(units, indices[0])) return null;

  const next = nextSourceUnit(units, indices.at(-1));
  if (!next || variantText(String(next.unit[next.key] || '')) !== variantText(afterLocal)) return null;

  return {
    heading: headingText,
    currentId: units[indices[0]].id || units[indices[0]].path,
  };
}

function isStructuralSectionHeadingNoOp(item, cache) {
  if (item.type !== 'local_extra_candidate') return null;
  if (item.sourceRange && String(item.sourceRange.text || '')) return null;
  if (!itemHasRelaxedStableAnchors(item)) return null;

  const localRange = item.localRange;
  if (!localRange || localRange.count < 1) return null;

  const headingText = localRange.text || '';
  if (!isTitleLikeSectionHeadingText(headingText)) return null;
  if (!localRangeMatchesLiveText(item, cache)) return null;

  const afterSource = item.context?.afterSource || '';
  const afterLocal = item.context?.afterLocal || '';
  if (!relaxedAnchorKey(afterSource) || !relaxedAnchorKey(afterLocal)) return null;
  if (SOURCE_HEADING_MARKUP_RE.test(afterSource)) return null;

  const locations = localRange.locations || [];
  if (locations.length !== localRange.count) return null;
  if (!locations.every((location) => (
    location.kind === 'sentence'
    && String(location.blockType || '') === 'paragraph'
    && Number(location.sentenceIndex || 0) === 0
  ))) return null;

  return {
    heading: headingText,
    ids: localRange.ids || [],
  };
}

function isStandaloneLocalHeadingNoOp(item, cache) {
  if (item.type !== 'local_extra_candidate') return null;
  if (item.sourceRange && String(item.sourceRange.text || '')) return null;
  if (!itemHasRelaxedStableAnchors(item)) return null;

  const localRange = item.localRange;
  if (!localRange || localRange.count < 1) return null;

  const headingText = liveLocalRangeText(item, cache);
  if (headingText === null) return null;
  if (variantText(headingText) !== variantText(localRange.text || '')) return null;

  const value = normalizeWhitespace(headingText);
  if (!value || value.length > 40 || !/\p{Script=Han}/u.test(value)) return null;
  if (/^[<［\[]?[一二三四五六七八九十百千萬万零〇○0-9]+[>］\]：:]*$/u.test(value)) return null;
  if (SOURCE_SENTENCE_PUNCT_RE.test(value.at(-1) || '')) return null;
  if (/[，、；！？「」『』]/u.test(value)) return null;
  if (/[：:]/u.test(value) && !/^附[：:]/u.test(value)) return null;

  const locations = localRange.locations || [];
  if (locations.length !== localRange.count) return null;
  if (!locations.every((location) => (
    location.kind === 'sentence'
    && String(location.blockType || '') === 'paragraph'
    && Number(location.sentenceIndex || 0) === 0
  ))) return null;

  return {
    heading: headingText,
    ids: localRange.ids || [],
  };
}

function isSourceStartHeadingNoOp(item, cache) {
  if (item.type !== 'source_omission_candidate' || item.localRange) return null;

  const sourceRange = item.sourceRange;
  if (!sourceRange || sourceRange.startIndex !== 0 || sourceRange.endIndex !== 0 || sourceRange.count !== 1) return null;
  if (String(item.context?.beforeSource || '') || String(item.context?.beforeLocal || '')) return null;

  const afterSource = stripWikiControls(item.context?.afterSource || '');
  const afterLocal = item.context?.afterLocal || '';
  if (!afterSource || !afterLocal || variantText(afterSource) !== variantText(afterLocal)) return null;

  const sourceText = sourceRange.text || '';
  const withoutPageFields = stripWikiPageFields(sourceText);
  const sourceLooksLikePageMetadata = withoutPageFields !== stripWikiControls(sourceText);
  const headerText = normalizeWhitespace(withoutPageFields);
  if (SOURCE_BODY_PUNCT_RE.test(headerText)) return null;
  if (!headerText && !sourceLooksLikePageMetadata) return null;

  const units = liveUnitsForItem(item, cache);
  if (!units?.length) return null;

  const first = units[0];
  const firstText = String(first.unit[first.key] || '');
  if (variantText(firstText) !== variantText(afterLocal)) return null;

  return {
    heading: sourceText,
    firstId: first.id || first.path,
    sourceLooksLikePageMetadata,
  };
}

function isSourceStartHeaderPrefixNoOp(item, cache) {
  if (!['source_replacement_candidate', 'text_discrepancy_candidate'].includes(item.type)) return null;

  const sourceRange = item.sourceRange;
  const localRange = item.localRange;
  if (!sourceRange || !localRange) return null;
  if (sourceRange.startIndex !== 0 || localRange.startIndex !== 0) return null;
  if (String(item.context?.beforeSource || '') || String(item.context?.beforeLocal || '')) return null;
  if (!itemHasRelaxedStableAnchors(item)) return null;

  const liveLocal = liveLocalRangeText(item, cache);
  if (liveLocal === null) return null;
  if (variantText(liveLocal) !== variantText(localRange.text || '')) return null;

  const sourceCore = stripWikiPageFields(sourceRange.text || '');
  const split = variantSuffixSplitWithPrefixLimit(sourceCore, liveLocal, 160);
  if (!split) return null;

  const header = normalizeWhitespace(split.prefix);
  if (!header || SOURCE_BODY_PUNCT_RE.test(header)) return null;
  if (HEADING_UI_ARTIFACT_RE.test(header)) return null;
  if (!WIKISOURCE_PAGE_HEADER_PREFIX_RE.test(header)) return null;

  const locations = localRange.locations || [];
  if (locations.length === 0) return null;

  const units = liveUnitsForItem(item, cache);
  if (!units) return null;
  const indices = locations.map((location) => units.findIndex((unit) => unitMatchesLocation(unit, location)));
  if (indices.some((index) => index < 0)) return null;
  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] <= indices[i - 1]) return null;
  }
  if (previousSourceUnit(units, indices[0])) return null;

  return {
    heading: split.prefix,
    firstId: units[indices[0]].id || units[indices[0]].path,
  };
}

function isWikisourceDefinitionListPrefixNoOp(item, cache) {
  if (!['source_replacement_candidate', 'text_discrepancy_candidate'].includes(item.type)) return null;
  if (!item.sourceRange?.text || !item.localRange?.text) return null;
  if (!itemHasRelaxedStableAnchors(item)) return null;

  const liveLocal = liveLocalRangeText(item, cache);
  if (liveLocal === null) return null;
  if (variantText(liveLocal) !== variantText(item.localRange.text || '')) return null;

  const split = variantSuffixSplitWithPrefixLimit(item.sourceRange.text || '', liveLocal, 80);
  if (!split) return null;

  const prefix = normalizeWhitespace(split.prefix);
  if (!prefix || prefix.length > 30) return null;
  if (!WIKISOURCE_DEFINITION_LIST_PREFIX_RE.test(prefix)) return null;

  return {
    prefix,
    ids: item.localRange.ids || [],
  };
}

function isChapterStartSinglePrefixNoOp(item, cache) {
  if (!['source_replacement_candidate', 'text_discrepancy_candidate'].includes(item.type)) return null;

  const sourceRange = item.sourceRange;
  const localRange = item.localRange;
  if (!sourceRange || !localRange) return null;
  if (sourceRange.startIndex !== 0 || localRange.startIndex !== 0) return null;
  if (sourceRange.count !== 1 || localRange.count !== 1) return null;
  if (String(item.context?.beforeSource || '') || String(item.context?.beforeLocal || '')) return null;
  if (!itemHasStableAnchors(item) && !itemHasRelaxedStableAnchors(item)) return null;

  const liveLocal = liveLocalRangeText(item, cache);
  if (liveLocal === null) return null;
  if (variantText(liveLocal) !== variantText(localRange.text || '')) return null;

  const sourceCore = stripWikiPageFields(stripWikiControls(sourceRange.text || ''));
  const split = variantSuffixSplit(liveLocal, sourceCore);
  if (!split) return null;

  const prefix = normalizeWhitespace(split.prefix);
  if (!prefix || [...prefix].length > MAX_CHAPTER_START_SINGLE_PREFIX_CHARS) return null;
  if (SOURCE_SENTENCE_PUNCT_RE.test(prefix)) return null;
  if (HEADING_UI_ARTIFACT_RE.test(prefix)) return null;
  if (LOCAL_EXTRA_ARTIFACT_MARKER_RE.test(prefix)) return null;
  if (SOURCE_HEADING_MARKUP_RE.test(prefix)) return null;

  const locations = localRange.locations || [];
  if (locations.length !== 1) return null;

  const units = liveUnitsForItem(item, cache);
  if (!units) return null;
  const index = units.findIndex((unit) => unitMatchesLocation(unit, locations[0]));
  if (index < 0) return null;
  if (previousSourceUnit(units, index)) return null;

  return {
    prefix: split.prefix,
    firstId: units[index].id || units[index].path,
  };
}

function variantSuffixSplitWithPrefixLimit(text, suffix, maxPrefixChars) {
  const textVariant = variantText(text);
  const suffixVariant = variantText(suffix);
  if (!textVariant || !suffixVariant) return null;
  if (textVariant === suffixVariant || !textVariant.endsWith(suffixVariant)) return null;

  const prefix = textVariant.slice(0, textVariant.length - suffixVariant.length);
  if ([...prefix].length > maxPrefixChars) return null;
  return {
    prefix,
    suffix,
  };
}

function variantSuffixSplit(text, suffix) {
  const chars = [...String(text || '')];
  const suffixVariant = variantText(suffix);
  if (!suffixVariant) return null;
  for (let index = 0; index <= chars.length; index += 1) {
    const tail = chars.slice(index).join('');
    if (variantText(tail) !== suffixVariant) continue;
    return {
      prefix: chars.slice(0, index).join(''),
      suffix: tail,
    };
  }
  return null;
}

function isChapterStartRangeHeadingNoOp(item, cache) {
  if (!['source_replacement_candidate', 'text_discrepancy_candidate', 'local_extra_candidate'].includes(item.type)) {
    return null;
  }

  const sourceRange = item.sourceRange;
  const localRange = item.localRange;
  if (!sourceRange || !localRange) return null;
  if (sourceRange.startIndex !== 0 || localRange.startIndex !== 0) return null;
  if (localRange.count < 2 || localRange.count > MAX_CHAPTER_START_RANGE_HEADING_UNITS) return null;
  if (String(item.context?.beforeSource || '') || String(item.context?.beforeLocal || '')) return null;

  const afterSource = stripWikiControls(item.context?.afterSource || '');
  const afterLocal = item.context?.afterLocal || '';
  if (!afterSource || !afterLocal || variantText(afterSource) !== variantText(afterLocal)) return null;

  const locations = localRange.locations || [];
  if (locations.length !== localRange.count) return null;

  const units = liveUnitsForItem(item, cache);
  if (!units) return null;

  const indices = locations.map((location) => units.findIndex((unit) => unitMatchesLocation(unit, location)));
  if (indices.some((index) => index < 0)) return null;
  for (let i = 1; i < indices.length; i += 1) {
    if (indices[i] <= indices[i - 1]) return null;
  }
  if (previousSourceUnit(units, indices[0])) return null;

  const next = nextSourceUnit(units, indices.at(-1));
  if (!next || variantText(String(next.unit[next.key] || '')) !== variantText(afterLocal)) return null;

  const parts = indices.map((index) => String(units[index].unit[units[index].key] || ''));
  const localText = parts.join('');
  if (variantText(localText) !== variantText(localRange.text || '')) return null;

  const sourceCore = stripWikiPageFields(sourceRange.text || '');
  for (let split = 1; split < parts.length; split += 1) {
    const localHeading = parts.slice(0, split).join('');
    if (SOURCE_SENTENCE_PUNCT_RE.test(localHeading)) continue;
    if (HEADING_UI_ARTIFACT_RE.test(localHeading)) continue;

    const localBody = parts.slice(split).join('');
    const sourceSplit = variantSuffixSplit(sourceCore, localBody);
    if (!sourceSplit) continue;

    const sourceHeading = sourceSplit.prefix;
    if (SOURCE_BODY_PUNCT_RE.test(sourceHeading)) continue;
    if (HEADING_UI_ARTIFACT_RE.test(sourceHeading)) continue;
    if (SOURCE_HEADING_MARKUP_RE.test(sourceHeading)) continue;

    return {
      localHeading,
      sourceHeading,
      firstId: units[indices[0]].id || units[indices[0]].path,
      bodyStartId: units[indices[split]].id || units[indices[split]].path,
    };
  }

  return null;
}

function sourceUnitKeys(file, unit) {
  return [
    `${path.resolve(file)}\u241f${unit.id}`,
    `${path.resolve(file)}\u241f${unit.path}`,
  ];
}

function changedSourceUnitKey(file, blockIndex, collectionName, index, unit, key) {
  const id = unit?.id || '';
  const pathKey = `${collectionName}.${index}.${key}`;
  return [
    `${path.resolve(file)}\u241f${id}`,
    `${path.resolve(file)}\u241f${pathKey}`,
  ];
}

function pruneEmptyChangedParagraphSourceUnits(data, file, changedUnitKeys) {
  let removed = 0;
  const nextContent = [];
  for (const [blockIndex, block] of (data.content || []).entries()) {
    if (block?.type !== 'paragraph' || !Array.isArray(block.sentences)) {
      nextContent.push(block);
      continue;
    }

    const kept = [];
    for (const [index, unit] of block.sentences.entries()) {
      const key = sourceKey(unit);
      if (!key) {
        kept.push(unit);
        continue;
      }
      const text = String(unit[key] || '').trim();
      const changed = changedSourceUnitKey(file, blockIndex, 'sentences', index, unit, key)
        .some((candidate) => changedUnitKeys.has(candidate));
      if (changed && !text) {
        removed += 1;
        continue;
      }
      kept.push(unit);
    }

    if (kept.length === 0) {
      removed += block.sentences.length > 0 ? 0 : 0;
      continue;
    }
    if (kept.length !== block.sentences.length) {
      block.sentences = kept;
    }
    nextContent.push(block);
  }

  if (removed > 0) data.content = nextContent;
  return removed;
}

function artifactQueueKeys(item) {
  return [
    `${path.resolve(item.file || '')}\u241f${item.sentenceId || ''}`,
    `${path.resolve(item.file || '')}\u241f${item.path || ''}`,
  ];
}

function removeRefMarkup(text, state) {
  let out = '';
  let index = 0;
  let changed = false;
  let htmlTags = 0;
  let refTextRemoved = 0;
  const input = String(text || '');

  while (index < input.length) {
    if (state.inRef) {
      const rest = input.slice(index);
      const closeMatch = rest.match(REF_CLOSE_RE);
      changed = true;
      if (!closeMatch) {
        refTextRemoved += rest.length;
        return { text: out, changed, htmlTags, refTextRemoved };
      }
      refTextRemoved += closeMatch.index;
      htmlTags += 1;
      state.inRef = false;
      index += closeMatch.index + closeMatch[0].length;
      continue;
    }

    const rest = input.slice(index);
    const openMatch = rest.match(REF_OPEN_RE);
    if (!openMatch) {
      out += rest;
      break;
    }

    out += rest.slice(0, openMatch.index);
    changed = true;
    htmlTags += 1;
    index += openMatch.index + openMatch[0].length;

    const afterOpen = input.slice(index);
    const closeMatch = afterOpen.match(REF_CLOSE_RE);
    if (!closeMatch) {
      state.inRef = true;
      refTextRemoved += afterOpen.length;
      return { text: out, changed, htmlTags, refTextRemoved };
    }

    refTextRemoved += closeMatch.index;
    htmlTags += 1;
    index += closeMatch.index + closeMatch[0].length;
  }

  return { text: out, changed, htmlTags, refTextRemoved };
}

function repairKnownPrivateUseText(text, file) {
  let out = String(text || '');
  let knownGlyphs = 0;

  for (const [glyph, replacement] of KNOWN_PRIVATE_USE_CHAR_REPAIRS) {
    if (!out.includes(glyph)) continue;
    const before = out;
    out = out.split(glyph).join(replacement);
    knownGlyphs += before.split(glyph).length - 1;
  }

  for (const repair of CONTEXTUAL_PRIVATE_USE_REPAIRS) {
    if (!repair.fileRe.test(file) || !repair.textRe.test(out)) continue;
    out = out.replace(repair.textRe, () => {
      knownGlyphs += 1;
      return repair.replacement;
    });
  }

  return {
    text: out,
    changed: out !== text,
    knownGlyphs,
  };
}

function repairKnownComponentPlaceholderText(text) {
  let out = String(text || '');
  let knownComponents = 0;

  for (const repair of KNOWN_COMPONENT_PLACEHOLDER_REPAIRS) {
    if (!repair.markerRe.test(out)) continue;
    out = out.replace(repair.textRe, (...args) => {
      knownComponents += 1;
      return typeof repair.replacement === 'function'
        ? repair.replacement(...args)
        : repair.replacement;
    });
  }

  return {
    text: out,
    changed: out !== text,
    knownComponents,
  };
}

function repairRepeatedClosingQuotes(text) {
  const input = String(text || '');
  const match = input.match(/[」』]{3,}$/u);
  if (!match) return { text: input, changed: false };

  const run = match[0];
  const replacement = new Set([...run]).size === 1 ? run[0] : [...run].slice(0, 2).join('');
  return {
    text: `${input.slice(0, -run.length)}${replacement}`,
    changed: replacement !== run,
  };
}

function repairWikisourceHeadingMarkup(text) {
  const input = String(text || '');
  const match = input.match(LOCAL_HEADING_MARKUP_RE);
  if (!match) return { text: input, changed: false, headingMarkup: 0 };

  const heading = match[1].trim();
  const rest = input.slice(match[0].length);
  let replacement;
  if (!rest) {
    replacement = heading;
  } else if (variantText(rest).startsWith(variantText(heading))) {
    replacement = rest;
  } else if (/^[【\[]?(?:論|贊|史評)[】\]]?$/u.test(heading) && /^(?:史臣曰|論曰|贊曰)/u.test(rest)) {
    replacement = rest;
  } else {
    replacement = `${heading}${rest}`;
  }

  return {
    text: replacement,
    changed: replacement !== input,
    headingMarkup: replacement !== input ? 1 : 0,
  };
}

function cleanSourceArtifactText(text, state = { inRef: false }, file = '') {
  let changed = false;
  let htmlTags = 0;
  let tableAttrs = 0;
  let ctextMarkup = 0;
  let tocControlsRemoved = 0;
  let refTextRemoved = 0;
  let knownGlyphs = 0;
  let knownComponents = 0;
  let correctionBrackets = 0;
  let headingMarkup = 0;
  let leadingSectionNumbers = 0;
  let out = String(text || '');

  out = out.replace(LEADING_SECTION_NUMBER_RE, () => {
    changed = true;
    leadingSectionNumbers += 1;
    return '';
  });

  const refResult = removeRefMarkup(out, state);
  out = refResult.text;
  changed = changed || refResult.changed;
  htmlTags += refResult.htmlTags;
  refTextRemoved += refResult.refTextRemoved;

  out = out.replace(RAW_HTML_TAG_RE, () => {
    changed = true;
    htmlTags += 1;
    return '';
  });

  out = out.replace(TABLE_SPAN_ATTR_RE, (match) => {
    const replacement = match.startsWith('|') ? '|' : '';
    if (replacement !== match) {
      changed = true;
      tableAttrs += 1;
    }
    return replacement;
  }).replace(/^\|+/u, () => {
    changed = true;
    return '';
  });

  out = out.replace(CTEXT_INLINE_MARKUP_RE, (_match, inner) => {
    changed = true;
    ctextMarkup += 1;
    return inner;
  });

  out = out.replace(WIKI_TOC_CONTROL_RE, () => {
    changed = true;
    tocControlsRemoved += 1;
    return '';
  });

  out = out.replace(WIKISOURCE_CORRECTION_BRACKET_RE, (_match, inner) => {
    changed = true;
    correctionBrackets += 1;
    return String(inner || '').trim();
  });

  const glyphResult = repairKnownPrivateUseText(out, file);
  out = glyphResult.text;
  changed = changed || glyphResult.changed;
  knownGlyphs += glyphResult.knownGlyphs;

  const componentResult = repairKnownComponentPlaceholderText(out);
  out = componentResult.text;
  changed = changed || componentResult.changed;
  knownComponents += componentResult.knownComponents;

  const headingResult = repairWikisourceHeadingMarkup(out);
  out = headingResult.text;
  changed = changed || headingResult.changed;
  headingMarkup += headingResult.headingMarkup;

  const quoteResult = repairRepeatedClosingQuotes(out);
  out = quoteResult.text;
  changed = changed || quoteResult.changed;

  out = out.replace(TRAILING_LAYOUT_MARKER_RE, () => {
    changed = true;
    return '';
  });

  return {
    text: out,
    changed,
    htmlTags,
    tableAttrs,
    ctextMarkup,
    tocControlsRemoved,
    refTextRemoved,
    knownGlyphs,
    knownComponents,
    correctionBrackets,
    headingMarkup,
    leadingSectionNumbers,
  };
}

function correspondenceQueueFiles(opts = {}) {
  if (!fs.existsSync(QUALITY_DIR)) return [];
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => CORRESPONDENCE_RE.test(entry))
    .filter((entry) => {
      if (!opts.books || opts.books.size === 0) return true;
      return [...opts.books].some((book) => entry === `source-correspondence-corpus-wikisource-${book}.json`);
    })
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function clearCorrespondenceNoOps(opts, now) {
  const stats = {
    filesChanged: 0,
    variantNoOps: 0,
    curatedGraphVariantNoOps: 0,
    upstreamResidueNoOps: 0,
    wikiPageMetadataNoOps: 0,
    sourceCommentaryNoOps: 0,
    sourceGlossCommentaryNoOps: 0,
    houhanshuSourceAnnotationNoOps: 0,
    localCommentaryNoOps: 0,
    cleanLocalExtraWitnessOmissionNoOps: 0,
    embeddedSourceCommentaryNoOps: 0,
    embeddedSourceCommentaryApparatusNoOps: 0,
    embeddedSourceCommentaryBaseTextNoOps: 0,
    wikisourceLinkedChronologyNoOps: 0,
    wikisourceDroppedChronologyPrefixNoOps: 0,
    wikisourceDroppedReignYearPrefixNoOps: 0,
    wikisourceLocalStructuralPrefixNoOps: 0,
    leadingClosePunctuationNoOps: 0,
    chapterStartHeadingNoOps: 0,
    sourceStartHeadingNoOps: 0,
    sourceStartHeaderPrefixNoOps: 0,
    wikisourceDefinitionListPrefixNoOps: 0,
    chapterStartSinglePrefixNoOps: 0,
    chapterStartRangeHeadingNoOps: 0,
    sourceAlreadyPresentNoOps: 0,
    sourceAnchoredAlreadyPresentNoOps: 0,
    structuralSectionHeadingNoOps: 0,
    standaloneLocalHeadingNoOps: 0,
    inheritedTableDateNoOps: 0,
    tableMarkupNoOps: 0,
    localHeadingMarkupRepairs: 0,
    localLeadingNoteMarkerRepairs: 0,
    localDuplicateHeadingRepairs: 0,
    translationHeadingRepairs: 0,
    dataFilesChanged: 0,
    reopenedVariantNoOps: 0,
    reopenedResidueNoOps: 0,
  };
  const samples = [];
  const liveUnitCache = new Map();
  const liveChapterKeyCache = new Map();
  const liveDataCache = new Map();
  const changedDataFiles = new Set();

  for (const file of correspondenceQueueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      const notes = String(item.notes || '');
      if (
        !opts.skipReopen
        &&
        statusOf(item) === 'rejected'
        && notes.includes('source/local difference is only approved graph variants')
        && !isVariantOnly(item)
        && !isCuratedGraphVariantOnly(item)
        && !isLeadingCloseAlreadyAttached(item, liveUnitCache)
        && !isWikisourceLinkedChronologyNoOp(item, liveUnitCache)
        && !isChapterStartHeadingNoOp(item, liveUnitCache)
        && !isSourceStartHeadingNoOp(item, liveUnitCache)
        && !isSourceStartHeaderPrefixNoOp(item, liveUnitCache)
        && !isWikisourceDefinitionListPrefixNoOp(item, liveUnitCache)
        && !isChapterStartRangeHeadingNoOp(item, liveUnitCache)
      ) {
        markPending(item, 'Reopened for manual review: previous automatic variant no-op ignored punctuation or quote placement.');
        stats.reopenedVariantNoOps += 1;
        changed = true;
        continue;
      }
      if (
        !opts.skipReopen
        &&
        statusOf(item) === 'rejected'
        && notes.includes('upstream MediaWiki residue')
        && !isUpstreamResidueOnly(item)
        && !isLeadingCloseAlreadyAttached(item, liveUnitCache)
        && !isWikisourceLinkedChronologyNoOp(item, liveUnitCache)
        && !isChapterStartHeadingNoOp(item, liveUnitCache)
        && !isSourceStartHeadingNoOp(item, liveUnitCache)
        && !isSourceStartHeaderPrefixNoOp(item, liveUnitCache)
        && !isWikisourceDefinitionListPrefixNoOp(item, liveUnitCache)
        && !isChapterStartRangeHeadingNoOp(item, liveUnitCache)
      ) {
        markPending(item, 'Reopened for manual review: previous automatic residue no-op left non-residue punctuation or text unresolved.');
        stats.reopenedResidueNoOps += 1;
        changed = true;
        continue;
      }
      if (statusOf(item) !== 'pending') continue;
      if (isVariantOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source/local difference is only approved graph variants; local corpus text retained.');
        stats.variantNoOps += 1;
        changed = true;
      } else if (isCuratedGraphVariantOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source/local difference is only curated orthographic graph variants with matching punctuation; local corpus text retained.');
        stats.curatedGraphVariantNoOps += 1;
        changed = true;
      } else if (isUpstreamResidueOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: discrepancy is caused by upstream MediaWiki residue such as __TOC__, Category, or PD-old text; local corpus text retained.');
        stats.upstreamResidueNoOps += 1;
        changed = true;
      } else if (isWikiPageMetadataOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: discrepancy is caused by upstream Wikisource page metadata fields; local corpus text already preserves the base text.');
        stats.wikiPageMetadataNoOps += 1;
        changed = true;
      } else if (isSourceOnlyCommentaryNoOp(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source-only upstream commentary or pronunciation note is not part of the base corpus text; local corpus text retained.');
        stats.sourceCommentaryNoOps += 1;
        changed = true;
      } else if (isSourceOnlyGlossCommentaryNoOp(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source-only upstream gloss/commentary is not part of the base corpus text; surrounding base-text anchors match and local corpus text is retained.');
        stats.sourceGlossCommentaryNoOps += 1;
        changed = true;
      } else if (isHouhanshuSourceOnlyAnnotationNoOp(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source-only Houhanshu upstream annotation/gloss is not part of the base corpus text; local corpus text retained.');
        stats.houhanshuSourceAnnotationNoOps += 1;
        changed = true;
      } else if (isLocalOnlyCommentaryNoOp(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: local corpus preserves commentary or pronunciation notes omitted by this upstream witness; local corpus text retained.');
        stats.localCommentaryNoOps += 1;
        changed = true;
      } else {
        const cleanLocalExtra = isCleanLocalExtraWitnessOmissionNoOp(item, liveUnitCache);
        if (cleanLocalExtra) {
          markDenied(
            item,
            now,
            opts.reviewer,
            `Reviewed as no-op: local-only span (${cleanLocalExtra.length} chars) has matching live text and source anchors; this upstream witness omits valid local corpus text, so local text is retained.`,
          );
          stats.cleanLocalExtraWitnessOmissionNoOps += 1;
          changed = true;
      } else if (isEmbeddedSourceCommentaryNoOp(item, liveUnitCache)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: embedded upstream commentary or pronunciation note strips to the live local base text; local corpus text retained.');
        stats.embeddedSourceCommentaryNoOps += 1;
        changed = true;
      } else if (isEmbeddedSourceCommentaryApparatusNoOp(item, liveUnitCache)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: embedded upstream commentary/pronunciation notes strip to the live local base text under local editorial apparatus; local corpus text retained.');
        stats.embeddedSourceCommentaryApparatusNoOps += 1;
        changed = true;
      } else if (isEmbeddedSourceCommentaryBaseTextNoOp(item, liveUnitCache)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: upstream commentary tail strips to the live local base text; local corpus text retained.');
        stats.embeddedSourceCommentaryBaseTextNoOps += 1;
        changed = true;
      } else {
        const linkedChronology = isWikisourceLinkedChronologyNoOp(item, liveUnitCache);
        if (linkedChronology) {
          markDenied(
            item,
            now,
            opts.reviewer,
            `Reviewed as no-op: raw Wikisource parsing dropped linked regnal-year text ${JSON.stringify(linkedChronology.omitted)}; local corpus text retained.`,
          );
          stats.wikisourceLinkedChronologyNoOps += 1;
          changed = true;
        } else {
          const droppedChronologyPrefix = isWikisourceDroppedChronologyPrefixNoOp(item, liveUnitCache);
          if (droppedChronologyPrefix) {
            markDenied(
              item,
              now,
              opts.reviewer,
              `Reviewed as no-op: raw Wikisource parsing dropped chronology prefix ${JSON.stringify(droppedChronologyPrefix.omitted)}; local corpus text retained.`,
            );
            stats.wikisourceDroppedChronologyPrefixNoOps += 1;
            changed = true;
          } else {
            const droppedReignYearPrefix = isWikisourceDroppedReignYearPrefixNoOp(item, liveUnitCache);
            if (droppedReignYearPrefix) {
              markDenied(
                item,
                now,
                opts.reviewer,
                `Reviewed as no-op: raw Wikisource parsing dropped reign-year prefix ${JSON.stringify(droppedReignYearPrefix.omitted)}; local corpus text retained.`,
              );
              stats.wikisourceDroppedReignYearPrefixNoOps += 1;
              changed = true;
            } else {
              const structuralPrefix = isWikisourceLocalStructuralPrefixNoOp(item, liveUnitCache);
              if (structuralPrefix) {
                markDenied(
                  item,
                  now,
                  opts.reviewer,
                  `Reviewed as no-op: raw Wikisource parsing omitted local structural ${structuralPrefix.kind} prefix ${JSON.stringify(structuralPrefix.omitted)}; local corpus text retained.`,
                );
                stats.wikisourceLocalStructuralPrefixNoOps += 1;
                changed = true;
              } else {
                const tableMarkup = isTableMarkupNoOp(item, liveUnitCache);
                if (tableMarkup) {
              markDenied(
                item,
                now,
                opts.reviewer,
                `Reviewed as no-op: raw Wikisource table markup${tableMarkup.variant ? ' and table graph/numeral variants' : ''} strip to the live local table text; local corpus text retained.`,
              );
              stats.tableMarkupNoOps += 1;
              changed = true;
            } else {
              const inheritedTableDate = isInheritedTableDateNoOp(item, liveUnitCache);
              if (inheritedTableDate) {
                markDenied(
                  item,
                  now,
                  opts.reviewer,
                  'Reviewed as no-op: local table text expands inherited reign-year/date cells that raw Wikisource leaves as table separators; surrounding table anchors match and local expanded row text is retained.',
                );
                stats.inheritedTableDateNoOps += 1;
                changed = true;
              } else {
                const leadingNote = isLocalLeadingNoteMarkerRepair(item, liveDataCache);
                if (leadingNote) {
                if (opts.apply) {
                  leadingNote.unit.unit[leadingNote.unit.key] = leadingNote.after;
                  stats.translationHeadingRepairs += cleanTranslationSourceArtifacts(leadingNote.unit.unit);
                  changedDataFiles.add(leadingNote.entry.absolute);
                }
                markApplied(
                  item,
                  now,
                  opts.reviewer,
                  leadingNote.retainedTrailingClose
                    ? 'Removed local bracketed note marker and retained sentence-final closing punctuation at the local quote boundary.'
                    : 'Removed local bracketed note marker before matching upstream source text.',
                );
                stats.localLeadingNoteMarkerRepairs += 1;
                changed = true;
              } else {
                const duplicateHeading = isLocalDuplicateHeadingRepair(item, liveDataCache);
                if (duplicateHeading) {
                if (opts.apply) {
                  duplicateHeading.unit.unit[duplicateHeading.unit.key] = duplicateHeading.after;
                  stats.translationHeadingRepairs += cleanTranslationHeadingArtifacts(duplicateHeading.unit.unit);
                  changedDataFiles.add(duplicateHeading.entry.absolute);
                }
                markApplied(
                  item,
                  now,
                  opts.reviewer,
                  `Removed duplicated local heading prefix ${JSON.stringify(duplicateHeading.heading)} before matching upstream source text.`,
                );
                stats.localDuplicateHeadingRepairs += 1;
                changed = true;
              } else {
                const localHeading = isLocalHeadingMarkupRepair(item, liveDataCache);
                if (localHeading) {
                if (opts.apply) {
                  localHeading.unit.unit[localHeading.unit.key] = localHeading.after;
                  stats.translationHeadingRepairs += cleanTranslationHeadingArtifacts(localHeading.unit.unit);
                  changedDataFiles.add(localHeading.entry.absolute);
                }
                markApplied(
                  item,
                  now,
                  opts.reviewer,
                  `Removed local MediaWiki heading markup ${JSON.stringify(localHeading.heading)} before matching upstream source text.`,
                );
                stats.localHeadingMarkupRepairs += 1;
                changed = true;
              } else {
                const leadingClose = isLeadingCloseAlreadyAttached(item, liveUnitCache);
                if (leadingClose) {
                  const chronologyNote = leadingClose.omitted
                    ? ` after the local chronology prefix ${JSON.stringify(leadingClose.omitted)}`
                    : '';
                  markDenied(
                    item,
                    now,
                    opts.reviewer,
                    `Reviewed as no-op: upstream range starts with closing punctuation ${JSON.stringify(leadingClose.punctuation)} that is already attached to previous live source unit ${leadingClose.previousId} as ${JSON.stringify(leadingClose.attachedPunctuation)}${chronologyNote}; local segmentation retained.`,
                  );
                  stats.leadingClosePunctuationNoOps += 1;
                  changed = true;
                } else {
                  const heading = isChapterStartHeadingNoOp(item, liveUnitCache);
                  if (heading) {
                    markDenied(
                      item,
                      now,
                      opts.reviewer,
                      `Reviewed as no-op: local chapter-start heading ${JSON.stringify(heading.heading)} is retained; upstream witness begins with the following body text.`,
                    );
                    stats.chapterStartHeadingNoOps += 1;
                    changed = true;
                  } else {
                    const sectionHeading = isStructuralSectionHeadingNoOp(item, liveUnitCache);
                    if (sectionHeading) {
                      markDenied(
                        item,
                        now,
                        opts.reviewer,
                        `Reviewed as no-op: local structural section heading ${JSON.stringify(sectionHeading.heading)} is retained; upstream witness omits standalone headings while surrounding body anchors match.`,
                      );
                      stats.structuralSectionHeadingNoOps += 1;
                      changed = true;
                    } else {
                      const standaloneHeading = isStandaloneLocalHeadingNoOp(item, liveUnitCache);
                      if (standaloneHeading) {
                        markDenied(
                          item,
                          now,
                          opts.reviewer,
                          `Reviewed as no-op: local standalone heading ${JSON.stringify(standaloneHeading.heading)} is retained; upstream witness omits the section divider while surrounding body anchors match.`,
                        );
                        stats.standaloneLocalHeadingNoOps += 1;
                        changed = true;
                      } else {
                        const sourceHeading = isSourceStartHeadingNoOp(item, liveUnitCache);
                        if (sourceHeading) {
                        markDenied(
                          item,
                          now,
                          opts.reviewer,
                          `Reviewed as no-op: upstream chapter-start header or page metadata ${JSON.stringify(sourceHeading.heading)} precedes live first local source unit ${sourceHeading.firstId}; local body text retained.`,
                        );
                        stats.sourceStartHeadingNoOps += 1;
                        changed = true;
                      } else {
                        const sourceHeaderPrefix = isSourceStartHeaderPrefixNoOp(item, liveUnitCache);
                        if (sourceHeaderPrefix) {
                          markDenied(
                            item,
                            now,
                            opts.reviewer,
                            `Reviewed as no-op: upstream chapter-start header prefix ${JSON.stringify(sourceHeaderPrefix.heading)} precedes live first local source unit ${sourceHeaderPrefix.firstId}; local body text retained.`,
                          );
                          stats.sourceStartHeaderPrefixNoOps += 1;
                          changed = true;
                        } else {
                          const definitionListPrefix = isWikisourceDefinitionListPrefixNoOp(item, liveUnitCache);
                          if (definitionListPrefix) {
                            markDenied(
                              item,
                              now,
                              opts.reviewer,
                              `Reviewed as no-op: upstream raw Wikisource definition-list marker ${JSON.stringify(definitionListPrefix.prefix)} precedes live local body text; local corpus text retained.`,
                            );
                            stats.wikisourceDefinitionListPrefixNoOps += 1;
                            changed = true;
                          } else {
                          const rangeHeading = isChapterStartRangeHeadingNoOp(item, liveUnitCache);
                          if (rangeHeading) {
                            markDenied(
                              item,
                              now,
                              opts.reviewer,
                                `Reviewed as no-op: chapter-start heading ${JSON.stringify(rangeHeading.localHeading)} is local title/roster material before live body unit ${rangeHeading.bodyStartId}; source body text is already present.`,
                              );
                            stats.chapterStartRangeHeadingNoOps += 1;
                            changed = true;
                          } else {
                            const singlePrefix = isChapterStartSinglePrefixNoOp(item, liveUnitCache);
                            if (singlePrefix) {
                              markDenied(
                                item,
                                now,
                                opts.reviewer,
                                `Reviewed as no-op: first live source unit keeps chapter-start title/roster prefix ${JSON.stringify(singlePrefix.prefix)} before upstream body text ${singlePrefix.firstId}; local corpus text retained.`,
                              );
                              stats.chapterStartSinglePrefixNoOps += 1;
                              changed = true;
                            } else {
                              const alreadyPresent = isSourceAlreadyPresentInLiveChapterNoOp(item, liveUnitCache, liveChapterKeyCache);
                              if (alreadyPresent) {
                                markDenied(
                                  item,
                                  now,
                                  opts.reviewer,
                                  `Reviewed as no-op: normalized upstream span (${alreadyPresent.keyLength} Han/digit chars) is already present exactly once in the live chapter; queue item is an alignment false positive and local corpus text is retained.`,
                                );
                                stats.sourceAlreadyPresentNoOps += 1;
                                changed = true;
                              } else {
                                const anchoredPresent = isSourceAlreadyPresentBetweenAnchorsNoOp(item, liveUnitCache, liveChapterKeyCache);
                                if (!anchoredPresent) continue;
                                markDenied(
                                  item,
                                  now,
                                  opts.reviewer,
                                  `Reviewed as no-op: normalized upstream span (${anchoredPresent.keyLength} Han/digit chars) is already present in the live chapter between matching before/after anchors (${anchoredPresent.beforeAnchorLength}/${anchoredPresent.afterAnchorLength} Han/digit chars); queue item is an alignment false positive and local corpus text is retained.`,
                                );
                                stats.sourceAnchoredAlreadyPresentNoOps += 1;
                                changed = true;
                              }
                            }
                            }
                          }
                        }
                      }
                      }
                    }
                  }
                }
              }
              }
              }
              }
            }
        }
        }
      }
      }
      }
      }
      if (samples.length < 12) {
        samples.push({
          file,
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
        });
      }
    }
    if (!changed) continue;
    queue.updatedAt = now;
    stats.filesChanged += 1;
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  if (opts.apply) {
    for (const absolute of changedDataFiles) {
      const entry = liveDataCache.get(absolute);
      if (!entry) continue;
      fs.writeFileSync(entry.file, `${JSON.stringify(entry.data, null, 2)}\n`, 'utf8');
      stats.dataFilesChanged += 1;
    }
  }

  return { stats, samples };
}

function loadArtifactQueue() {
  if (!fs.existsSync(SOURCE_ARTIFACTS_PATH)) return null;
  return JSON.parse(fs.readFileSync(SOURCE_ARTIFACTS_PATH, 'utf8'));
}

function isKnownPrivateUseArtifactItem(item) {
  if (item.ruleId !== 'SOURCE_PRIVATE_USE_GLYPH') return false;
  if (KNOWN_PRIVATE_USE_CHAR_REPAIRS.has(item.found)) return true;
  return CONTEXTUAL_PRIVATE_USE_REPAIRS.some((repair) => (
    item.found === repair.found &&
    repair.fileRe.test(item.file || '') &&
    repair.markerRe.test(item.excerpt || '')
  ));
}

function isKnownComponentPlaceholderArtifactItem(item) {
  if (item.ruleId !== 'SOURCE_COMPONENT_PLACEHOLDER') return false;
  return KNOWN_COMPONENT_PLACEHOLDER_REPAIRS.some((repair) => (
    repair.markerRe.test(item.excerpt || '')
  ));
}

function liveArtifactText(item) {
  const file = item.file || '';
  if (!file || !fs.existsSync(file)) return '';
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const units = collectSourceUnits(data);
  const byId = units.find((unit) => unit.id && unit.id === item.sentenceId);
  if (byId) return String(byId.unit[byId.key] || '');
  return units.map((unit) => String(unit.unit[unit.key] || '')).join('');
}

function isKnownArtifactResolvedInLiveSource(item) {
  if (!isKnownPrivateUseArtifactItem(item) && !isKnownComponentPlaceholderArtifactItem(item)) return false;
  const found = String(item.found || '');
  if (!found) return false;
  const liveText = liveArtifactText(item);
  return Boolean(liveText && !liveText.includes(found));
}

function repairSourceArtifacts(opts, now) {
  const queue = loadArtifactQueue();
  if (!queue) {
    return {
      stats: {
        filesChanged: 0,
        unitsChanged: 0,
        htmlTagsRemoved: 0,
        tableAttrsRemoved: 0,
        ctextMarkupRemoved: 0,
        tocControlsRemoved: 0,
        emptySourceUnitsRemoved: 0,
        knownGlyphsRepaired: 0,
        knownComponentsRepaired: 0,
        correctionBracketsRemoved: 0,
        headingMarkupRemoved: 0,
        leadingSectionNumbersRemoved: 0,
        translationArtifactRepairs: 0,
        queueMarked: 0,
      },
      samples: [],
      touchedBooks: [],
    };
  }

  const pending = (queue.hits || [])
    .filter((item) => statusOf(item) === 'pending' && REPAIRABLE_SOURCE_ARTIFACT_RULES.has(item.ruleId))
    .filter((item) => opts.books.size === 0 || opts.books.has(path.basename(path.dirname(item.file || ''))));
  const files = [...new Set(pending.map((item) => item.file).filter(Boolean))].sort();
  const changedUnitKeys = new Set();
  const touchedBooks = new Set();
  const samples = [];
  const stats = {
    filesChanged: 0,
    unitsChanged: 0,
    htmlTagsRemoved: 0,
    tableAttrsRemoved: 0,
    ctextMarkupRemoved: 0,
    tocControlsRemoved: 0,
    emptySourceUnitsRemoved: 0,
    refTextRemoved: 0,
    knownGlyphsRepaired: 0,
    knownComponentsRepaired: 0,
    correctionBracketsRemoved: 0,
    headingMarkupRemoved: 0,
    leadingSectionNumbersRemoved: 0,
    translationArtifactRepairs: 0,
    queueMarked: 0,
  };

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let fileChanged = false;
    const htmlState = { inRef: false };
    for (const unit of collectSourceUnits(data)) {
      const before = unit.unit[unit.key];
      const result = cleanSourceArtifactText(before, htmlState, file);
      if (!result.changed || result.text === before) continue;
      unit.unit[unit.key] = result.text;
      fileChanged = true;
      stats.unitsChanged += 1;
      stats.htmlTagsRemoved += result.htmlTags;
      stats.tableAttrsRemoved += result.tableAttrs;
      stats.ctextMarkupRemoved += result.ctextMarkup;
      stats.tocControlsRemoved += result.tocControlsRemoved;
      stats.refTextRemoved += result.refTextRemoved;
      stats.knownGlyphsRepaired += result.knownGlyphs;
      stats.knownComponentsRepaired += result.knownComponents;
      stats.correctionBracketsRemoved += result.correctionBrackets;
      stats.headingMarkupRemoved += result.headingMarkup;
      stats.leadingSectionNumbersRemoved += result.leadingSectionNumbers;
      stats.translationArtifactRepairs += cleanTranslationSourceArtifacts(unit.unit);
      for (const key of sourceUnitKeys(file, unit)) changedUnitKeys.add(key);
      if (samples.length < 12) {
        samples.push({
          file,
          id: unit.id,
          before: before.slice(0, 120),
          after: result.text.slice(0, 120),
        });
      }
    }
    if (fileChanged) {
      const removed = pruneEmptyChangedParagraphSourceUnits(data, file, changedUnitKeys);
      stats.emptySourceUnitsRemoved += removed;
      if (removed > 0 && data.meta) {
        const counts = countChapterMetrics(data);
        data.meta.sentenceCount = counts.sentenceCount;
        data.meta.translatedCount = counts.translatedCount;
      }
    }
    if (!fileChanged) continue;
    stats.filesChanged += 1;
    touchedBooks.add(path.basename(path.dirname(file)));
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }

  for (const item of pending) {
    const changedByThisRun = artifactQueueKeys(item).some((key) => changedUnitKeys.has(key));
    const resolvedInLiveSource = !changedByThisRun && isKnownArtifactResolvedInLiveSource(item);
    if (!changedByThisRun && !resolvedInLiveSource) continue;
    if (
      !STRUCTURAL_SOURCE_ARTIFACT_RULES.has(item.ruleId) &&
      !isKnownPrivateUseArtifactItem(item) &&
      !isKnownComponentPlaceholderArtifactItem(item) &&
      item.ruleId !== 'SOURCE_WIKISOURCE_CORRECTION_BRACKET' &&
      item.ruleId !== 'SOURCE_WIKISOURCE_TOC_CONTROL' &&
      item.ruleId !== 'SOURCE_WIKISOURCE_HEADING_MARKUP' &&
      item.ruleId !== 'SOURCE_REPEATED_CLOSING_QUOTE' &&
      item.ruleId !== 'SOURCE_TRAILING_LAYOUT_MARKER' &&
      item.ruleId !== 'SOURCE_LEADING_SECTION_NUMBER'
    ) {
      continue;
    }
    markApplied(
      item,
      now,
      opts.reviewer,
      `Repaired local source scrape artifact for ${item.ruleId}.`,
    );
    stats.queueMarked += 1;
  }

  if (opts.apply && stats.queueMarked > 0) {
    queue.updatedAt = now;
    fs.writeFileSync(SOURCE_ARTIFACTS_PATH, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
  }

  return { stats, samples, touchedBooks: [...touchedBooks].sort() };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const correspondence = clearCorrespondenceNoOps(opts, now);
  const artifacts = repairSourceArtifacts(opts, now);

  console.log(JSON.stringify({
    apply: opts.apply,
    correspondence: correspondence.stats,
    artifacts: artifacts.stats,
    touchedBooks: artifacts.touchedBooks,
    samples: {
      correspondence: correspondence.samples,
      artifacts: artifacts.samples,
    },
  }, null, 2));
}

export {
  normalizePunctuation,
  normalizeWhitespace,
  statusOf,
  variantKey,
  variantText,
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
