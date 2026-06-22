#!/usr/bin/env node
/**
 * Clear high-confidence source repair queue patterns.
 *
 * Dry-run by default. With --apply:
 * - marks source-correspondence diffs that are only approved graph variants as
 *   denied/no-op reviewed;
 * - marks correspondence items caused by upstream-only MediaWiki residue
 *   (__TOC__, Category:..., PD-old) as denied/no-op reviewed;
 * - removes raw HTML tags and leading table span attributes from local source
 *   fields, then marks matching source-artifact queue items as applied.
 */

import fs from 'node:fs';
import path from 'node:path';

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
  'SOURCE_PRIVATE_USE_GLYPH',
]);
const UPSTREAM_RESIDUE_RE = /__TOC__|Category:[A-Za-z0-9_-]+|PD-old/u;
const RAW_HTML_TAG_RE = /<\/?[a-z][^>]*>/giu;
const REF_OPEN_RE = /<ref\b[^>]*>/iu;
const REF_CLOSE_RE = /<\/ref>/iu;
const TABLE_SPAN_ATTR_RE = /(?:^|\|)\s*(?:(?:rowspan|colspan|valign|align|style|width|height)\s*=\s*(?:"[^"]*"|'[^']*')\s*)+\|?/giu;
const CTEXT_INLINE_MARKUP_RE = /-\{([^}]+)\}-/gu;
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

const VARIANTS = new Map([
  ['并', '並'],
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
  ['厠', '廁'],
  ['塼', '磚'],
  ['甎', '磚'],
  ['粘', '黏'],
  ['爲', '為'],
]);

function usage() {
  console.error(`Usage:
  node scripts/repair-source-queue-patterns.mjs [--apply] [--reviewer NAME]

Clears high-confidence repair queue patterns. Dry-run by default.`);
}

function parseArgs(argv) {
  const opts = {
    apply: false,
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
  return String(text || '').replace(/\s+/g, '').trim();
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
  return normalizePunctuation(normalizeWhitespace(text)).normalize('NFKC')
    .replace(/[^\p{Script=Han}0-9A-Za-z]/gu, '');
}

function variantKey(text) {
  let out = '';
  for (const char of strippedText(text)) out += VARIANTS.get(char) || char;
  return out;
}

function isVariantOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source || !local) return false;
  return strippedText(source) !== strippedText(local) && variantKey(source) === variantKey(local);
}

function isUpstreamResidueOnly(item) {
  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!UPSTREAM_RESIDUE_RE.test(source)) return false;
  return !UPSTREAM_RESIDUE_RE.test(local);
}

function markDenied(item, now, reviewer, notes) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = item.reviewedAt || now;
  item.reviewer = item.reviewer || reviewer;
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

function sourceUnitKeys(file, unit) {
  return [
    `${path.resolve(file)}\u241f${unit.id}`,
    `${path.resolve(file)}\u241f${unit.path}`,
  ];
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

function cleanSourceArtifactText(text, state = { inRef: false }, file = '') {
  let changed = false;
  let htmlTags = 0;
  let tableAttrs = 0;
  let ctextMarkup = 0;
  let refTextRemoved = 0;
  let knownGlyphs = 0;
  let out = String(text || '');

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

  const glyphResult = repairKnownPrivateUseText(out, file);
  out = glyphResult.text;
  changed = changed || glyphResult.changed;
  knownGlyphs += glyphResult.knownGlyphs;

  return {
    text: out,
    changed,
    htmlTags,
    tableAttrs,
    ctextMarkup,
    refTextRemoved,
    knownGlyphs,
  };
}

function correspondenceQueueFiles() {
  if (!fs.existsSync(QUALITY_DIR)) return [];
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => CORRESPONDENCE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .sort();
}

function clearCorrespondenceNoOps(opts, now) {
  const stats = {
    filesChanged: 0,
    variantNoOps: 0,
    upstreamResidueNoOps: 0,
  };
  const samples = [];

  for (const file of correspondenceQueueFiles()) {
    const queue = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (statusOf(item) !== 'pending') continue;
      if (isVariantOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: source/local difference is only approved graph variants; local corpus text retained.');
        stats.variantNoOps += 1;
        changed = true;
      } else if (isUpstreamResidueOnly(item)) {
        markDenied(item, now, opts.reviewer, 'Reviewed as no-op: discrepancy is caused by upstream MediaWiki residue such as __TOC__, Category, or PD-old text; local corpus text retained.');
        stats.upstreamResidueNoOps += 1;
        changed = true;
      } else {
        continue;
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
        knownGlyphsRepaired: 0,
        queueMarked: 0,
      },
      samples: [],
      touchedBooks: [],
    };
  }

  const pending = (queue.hits || [])
    .filter((item) => statusOf(item) === 'pending' && REPAIRABLE_SOURCE_ARTIFACT_RULES.has(item.ruleId));
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
    refTextRemoved: 0,
    knownGlyphsRepaired: 0,
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
      stats.refTextRemoved += result.refTextRemoved;
      stats.knownGlyphsRepaired += result.knownGlyphs;
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
    if (!fileChanged) continue;
    stats.filesChanged += 1;
    touchedBooks.add(path.basename(path.dirname(file)));
    if (opts.apply) fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  }

  for (const item of pending) {
    if (!artifactQueueKeys(item).some((key) => changedUnitKeys.has(key))) continue;
    if (
      !STRUCTURAL_SOURCE_ARTIFACT_RULES.has(item.ruleId) &&
      !isKnownPrivateUseArtifactItem(item)
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

main();
