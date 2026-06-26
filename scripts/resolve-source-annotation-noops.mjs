#!/usr/bin/env node
/**
 * Close source-correspondence items where the upstream witness contributes
 * annotation/gloss text rather than missing base corpus text.
 *
 * This script does not edit chapter source or translations. It only marks
 * queue items denied/no-op when the local base text is already represented and
 * the extra upstream span is clearly commentary, a pronunciation gloss, or a
 * geography note. Dry-run by default.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  noPunctuationKey,
  normalizeWhitespace,
  variantText,
} from './source-variant-utils.mjs';

const QUALITY_DIR = path.join(process.cwd(), 'data', 'quality');
const QUEUE_RE = /^source-correspondence.*\.json$/u;
const DEFAULT_REVIEWER = 'resolve-source-annotation-noops';

const CLOSING_OR_LEADING_PUNCT_RE = /^[」』”）)\]】〉》，、。；：！？\s]+/u;
const CITATION_START_RE = /^(?:《[^》]{1,30}》曰|(?:左傳|春秋|史記|前書|漢書|續漢書|東觀記|東觀漢記|博物記|博物志|皇覽|水經|山海經|風俗通|說文|爾雅|廣雅|詩|尚書|易|禮記|周禮|國語|公羊傳|穀梁傳|帝王世記|十三州志|括地志|太康地志|輿地志|晉地道記|地道記|郡國志|漢官(?:舊儀|儀|秩)?|蔡質漢儀|蔡質漢官儀)[^。！？；]{0,30}(?:曰|云|：|:))/u;
const COMMENTATOR_START_RE = /^(?:(?:杜預|徐廣|晉灼|臣瓚|應劭|師古|李賢|劉昭|章懷|胡廣|蔡邕|袁宏|謝承|服虔|孟康|韋昭|如淳|蘇林|張晏|鄭玄|京房|盧植|董巴|王先謙|惠棟|司馬貞|張守節|裴駰)[^。！？；]{0,24}(?:曰|云|：|:))/u;
const GLOSS_START_RE = /^(?:[^，。！？；：「」『』]{1,24}(?:音[^。！？；]{0,14}反|音[^。！？；]{1,10}|讀曰[^。！？；]{1,12}|一作[^。！？；]{1,12})。?$|[^，。！？；：「」『』]{1,24}(?:謂|猶|即|為|作)[^。！？；]{1,35}也。?$|[^，。！？；：「」『』]{1,28}(?:縣名|郡名|星名|陵名|官名|故城在|在今[^。！？；]{1,24}|今[^。！？；]{1,24}(?:縣|州|郡)|屬[^。！？；]{1,18}郡)[^。！？；]{0,24}。?$)/u;
const HHS_SHORT_GLOSS_RE = /^(?:[^，。！？；：「」『』]{1,24}(?:謂|猶|即|為|作)[^。！？；]{1,35}(?:也)?。?$|[^，。！？；：「」『』]{1,24}，[^。！？；]{1,35}(?:之(?:貌|類|屬)|也)。?$)/u;
const HHS_GEOGRAPHY_NOTE_RE = /^(?:\*?\|?(?:縣[東西南北中][^。！？；]{1,40}。|故城在|在今|今[^。！？；]{1,24}(?:縣|州|郡)|屬[^。！？；]{1,18}郡|有[^。！？；]{1,24}(?:亭|城|山|水|津|聚|關|阜|澤)|左傳|春秋|尚書|史記|前書|前志|前漢志|漢(?:（書）)?舊儀|漢書|博物記|皇覽|水經|山海經|帝王世記|十三州志|太康地志|輿地志|晉地道記|地道記|三秦記|辛氏三秦記|三齊記|廣志|古今注|東觀書|袁山松書|襄陽耆舊傳|南都賦|荊州記|豫章記|北征記|西征記|魏氏春秋|陳留志|鄭志|爾雅|說文|應劭|應劭漢官|杜預|郭璞|孟子注|徐廣|晉灼|臣瓚|錢大昕|王莽|岑彭|蘇茂|來歙|赤眉|馮異|曹公|虢邑|古(?:國|灌國|芮國|邳國|程國)|故焦國|匡人之亭|在昌邑城|又伯升|王莽封也|本傳|案本紀|決錄注|周宣王|三[三四][八九〇零一二三四五六七八九十]+頁))/u;
const HHS_ANNAL_CITATION_START_RE = /^(?:《[^》]{1,30}》(?:曰|云|：|:)|(?:古今注|伏侯古今注|蔡質漢儀|蔡質漢官儀|漢官(?:舊儀|儀|秩)?|漢官解詁|東觀記|東觀漢記|續漢書|袁山松書|謝承《書》|謝承書|臣昭|臣賢案|李賢|章懷|郗萌|黃帝(?:經|占|星經)?|荊州(?:星占|經)|星(?:占|紫宮占)|韓[揚楊]占|石氏(?:經|星占)?|海中(?:占)?|巫咸|河圖|雒書|洛書|春秋漢含孳|鉤命決|李氏家書|春秋感精符|京房《?易傳》?|潛潭巴|風俗通|魏志|公羊傳|穀梁傳|周禮|禮記|詩|尚書|易|論語|左傳|水經注|喪服傳|文子|爾雅|廣雅|漢書音義|前書|鄭玄注|杜預注|師古|晉灼|應劭|服虔|孟康|韋昭|徐廣|司馬貞|張守節|裴駰)[^。！？；]{0,80}(?:曰|云|：|:))/u;
const HHS_ANNAL_PERSON_NOTE_RE = /^(?:[\p{Script=Han}]{1,8}(?:字|謚|諡|姓)[^。！？；]{1,36}。|[^。！？；]{1,40}(?:人|女|子|孫|妻|后|侯|王|公主|貴人)也(?:，[^。！？；]{1,30}也)?。|[^。！？；]{1,12}，姓也，[^。！？；]{1,30}。)$/u;
const HHS_ANNAL_GLOSS_RE = /^(?:謂[^。！？；]{1,80}。|[^。！？；：「」『』]{1,28}，[^。！？；：「」『』]{1,60}也。|[^。！？；：「」『』]{1,24}(?:音[^。！？；]{0,18}反|讀曰[^。！？；]{1,16}|一作[^。！？；]{1,16})。|[^。！？；：「」『』]{1,30}(?:縣名|郡名|故城|在今|今[^。！？；]{1,20}(?:縣|州|郡)|屬[^。！？；]{1,18}郡)[^。！？；]{0,40}。|(?:永壽|建武|永平|建初|元和|章和|永元|元興|永初|元初|永寧|建光|延光|永建|陽嘉|永和|漢安|建康|本初|建和|和平|元嘉|永興|永壽|延熹|永康|建寧|熹平|光和|中平)[元一二三四五六七八九十]+年(?:置|省|罷|改|徙)[^。！？；]{0,28}。|以[^。！？；]{1,60}也。|言[^。！？；]{1,80}。)$/u;
const HHS_STRICT_SOURCE_ONLY_ANNOTATION_RE = /^(?:(?:郡名|縣名|陵名)，在[^。！？；]{1,40}。?|在今[^。！？；]{1,60}(?:。|；)?|今[^。！？；]{1,30}(?:縣|州|郡)也。?|[^。！？；]{1,24}音[^。！？；]{0,16}反。?)$/u;
const HHS_INLINE_EXPLANATORY_RE = /^(?:(?:[^。！？；：「」『』《》]{1,24})(?:者|謂|猶|即|為|作|言|音)[^。！？；]{1,100}(?:也|焉|耳|反)?。?|(?:[^。！？；：「」『』《》]{1,24})，(?:[^。！？；：「」『』《》]{1,90})(?:也|焉|耳|反)。?|(?:趙憙|李訢|馮魴|帝謙言|奉計謂|百言|獨言|賴，恃也|左右，助也|六尺謂|大節謂|撓，屈也)[^。！？；]{0,90}。?)$/u;
const BASE_EVENT_START_RE = /^(?:[元一二三四五六七八九十百千萬萬元]+年|[春夏秋冬]|閏?[正一二三四五六七八九十]+月|[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]|是歲|其年|明年|初，|先是|詔|制曰|帝|上|天子|王|太后|遣|拜|封|立|殺|誅|卒|薨|崩|復|大赦|改元|置|罷|徙|寇|伐|攻|破|圍|以|乃|遂)/u;
const LOCAL_PLACEHOLDER_RE = /[□�\uE000-\uF8FF]|\{[^}]{1,12}\}|<[^>]{1,12}>|\[[^\]]{1,12}\]|[〈][^〉]{1,12}[〉]/u;
const COMMENTATOR_NAMES = '(?:師古|顏師古|晉灼|臣瓚|瓚|孟康|如淳|韋昭|應劭|李奇|服虔|鄭氏|張晏|蘇林|徐廣|杜預|司馬貞|張守節|裴駰|裴松之|臣松之|司馬彪|劉昭|李賢|章懷|王先謙|惠棟)';
const COMMENTARY_MARKER_RE = new RegExp(`${COMMENTATOR_NAMES}(?:[^。！？；：「」『』|]{0,12})?(?:曰|云|案|按)?[：:「]`, 'u');
const COMMENTARY_QUOTED_RE = new RegExp(`${COMMENTATOR_NAMES}(?:[^。！？；：「」『』|]{0,12})?(?:曰|云|案|按)?[：:「][^」|]{0,220}」?`, 'gu');
const BRACKET_COMMENTARY_MARKER_RE = /【(?:正義|索隱|集解|考證|校勘記|注|箋注)[^】]{0,8}】/u;
const BRACKET_COMMENTARY_RE = /【(?:正義|索隱|集解|考證|校勘記|注|箋注)[^】]{0,8}】[^。！？；|]{0,160}[。！？；]?/gu;
const TRAILING_APPARATUS_RE = /(?:案|按)(?:舊唐書|新唐書|通鑑|考異|校勘|薛史|歐史|冊府|太平御覽|水經注|元和郡縣志|十國春秋)[^|]*$/u;
const WIKI_TABLE_MARKUP_RE = /(?:class|style|colspan|rowspan)="[^"]*"|__TOC__|Category:[^\s|]+|Author-PD-old|==[^=]{1,30}==/gu;
const SOURCE_PAGE_RESIDUE_FRAGMENT_RE = /^(?:[。；：，、\s]*)?(?:Category:[^\s|<>]+|(?:----\s*)?校勘記|(?:Author-)?PD-old|__(?:FORCE)?TOC__|__NOTOC__|__NOCC__)(?:[。；：，、\s]*)?$/iu;

const NOTES = {
  sourceOnlyAnnotation: 'Reviewed as no-op: source-only upstream annotation/gloss text is not part of the base corpus text; matching anchors show the local corpus text should be retained.',
  sourceWrappedAnnotation: 'Reviewed as no-op: upstream witness wraps the local base text with commentary/gloss text; local corpus base text retained.',
  sourceCommentaryApparatus: 'Reviewed as no-op: after removing explicit upstream commentary apparatus, the source span matches the local base text; local corpus base text retained.',
  houhanshuGeographyAnnotation: 'Reviewed as no-op: Houhanshu geography upstream note/gloss is not part of the base corpus text; matching local geography anchors retained.',
};

function parseArgs(argv) {
  const opts = {
    apply: false,
    books: new Set(),
    chapters: new Set(),
    queues: [],
    limit: Infinity,
    sampleLimit: 40,
    reviewer: DEFAULT_REVIEWER,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') {
      opts.apply = true;
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
    if (arg === '--chapter') {
      opts.chapters.add(argv[++i]);
      continue;
    }
    if (arg.startsWith('--chapter=')) {
      opts.chapters.add(arg.slice('--chapter='.length));
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
    if (arg === '--limit') {
      opts.limit = Number(argv[++i] || Infinity);
      continue;
    }
    if (arg.startsWith('--limit=')) {
      opts.limit = Number(arg.slice('--limit='.length) || Infinity);
      continue;
    }
    if (arg === '--sample-limit') {
      opts.sampleLimit = Number(argv[++i] || 40);
      continue;
    }
    if (arg.startsWith('--sample-limit=')) {
      opts.sampleLimit = Number(arg.slice('--sample-limit='.length) || 40);
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

  if (!Number.isFinite(opts.limit) || opts.limit < 0) opts.limit = Infinity;
  if (!Number.isFinite(opts.sampleLimit) || opts.sampleLimit < 0) opts.sampleLimit = 40;
  return opts;
}

function queueFiles(opts) {
  if (opts.queues.length > 0) return opts.queues.map((queue) => path.resolve(queue));
  return fs.readdirSync(QUALITY_DIR)
    .filter((entry) => QUEUE_RE.test(entry))
    .map((entry) => path.join(QUALITY_DIR, entry))
    .filter((file) => {
      if (opts.books.size === 0) return true;
      const base = path.basename(file);
      return [...opts.books].some((book) => base.includes(`-${book}.json`) || base.includes(`-${book}-`));
    })
    .sort();
}

function statusOf(item) {
  const status = String(item.status || '').toLowerCase();
  const decision = String(item.decision || '').toLowerCase();
  if (status === 'applied' || decision === 'applied' || decision === 'included' || decision === 'approved') return 'applied';
  if (status === 'denied' || decision === 'denied' || decision === 'rejected') return 'denied';
  return 'pending';
}

function key(text) {
  return noPunctuationKey(text || '');
}

function hasCommentaryApparatus(text) {
  return COMMENTARY_MARKER_RE.test(text || '') || BRACKET_COMMENTARY_MARKER_RE.test(text || '') || TRAILING_APPARATUS_RE.test(text || '');
}

function stripCommentaryApparatus(text) {
  return compact(text)
    .replace(WIKI_TABLE_MARKUP_RE, '')
    .replace(COMMENTARY_QUOTED_RE, '')
    .replace(BRACKET_COMMENTARY_RE, '')
    .replace(TRAILING_APPARATUS_RE, '')
    .replace(/[|!]+/gu, '');
}

function compact(text) {
  return normalizeWhitespace(text || '');
}

function sameAnchor(sourceText, localText) {
  if (!sourceText && !localText) return true;
  return key(sourceText) === key(localText);
}

function hasMatchingAnchors(item) {
  const context = item.context || {};
  return sameAnchor(context.beforeSource || '', context.beforeLocal || '')
    && sameAnchor(context.afterSource || '', context.afterLocal || '');
}

function stripLeadingPunctuation(text) {
  return String(text || '').replace(CLOSING_OR_LEADING_PUNCT_RE, '');
}

function isHouhanshuGeography(item) {
  if (item.book !== 'houhanshu') return false;
  const chapter = Number(item.chapter);
  return chapter >= 120 && chapter <= 123;
}

function isHouhanshuAnnalAnnotation(text, item) {
  if (item.book !== 'houhanshu') return false;
  if (isHouhanshuGeography(item)) return false;
  const stripped = stripLeadingPunctuation(compact(text));
  if (!stripped || stripped.length > 180) return false;
  return HHS_ANNAL_CITATION_START_RE.test(stripped)
    || HHS_ANNAL_PERSON_NOTE_RE.test(stripped)
    || HHS_ANNAL_GLOSS_RE.test(stripped);
}

function isHouhanshuCitationSegment(text, item) {
  if (item.book !== 'houhanshu' || isHouhanshuGeography(item)) return false;
  const stripped = stripLeadingPunctuation(compact(text));
  if (!stripped || stripped.length > 320) return false;
  return HHS_ANNAL_CITATION_START_RE.test(stripped)
    || COMMENTATOR_START_RE.test(stripped)
    || CITATION_START_RE.test(stripped);
}

function startsLikeAnnotation(text, item) {
  const stripped = stripLeadingPunctuation(compact(text));
  if (!stripped) return false;
  if (CITATION_START_RE.test(stripped)) return true;
  if (COMMENTATOR_START_RE.test(stripped)) return true;
  if (GLOSS_START_RE.test(stripped)) return true;
  if (item.book === 'houhanshu' && HHS_SHORT_GLOSS_RE.test(stripped)) return true;
  if (item.book === 'houhanshu' && HHS_STRICT_SOURCE_ONLY_ANNOTATION_RE.test(stripped)) return true;
  if (isHouhanshuGeography(item) && HHS_GEOGRAPHY_NOTE_RE.test(stripped)) return true;
  if (isHouhanshuAnnalAnnotation(stripped, item)) return true;
  return false;
}

function looksLikePureAnnotation(text, item) {
  const stripped = stripLeadingPunctuation(compact(text));
  if (!stripped) return false;

  if (isHouhanshuGeography(item) && HHS_GEOGRAPHY_NOTE_RE.test(stripped)) return true;

  const segments = stripped
    .split(/(?<=[。！？；])/u)
    .map((segment) => stripLeadingPunctuation(segment))
    .filter(Boolean);
  if (segments.length === 0) return false;

  if (
    item.book === 'houhanshu'
    && !isHouhanshuGeography(item)
    && stripped.length > 180
    && stripped.length <= 1200
    && segments.every((segment) => (
      isHouhanshuCitationSegment(segment, item)
      && !BASE_EVENT_START_RE.test(segment)
    ))
  ) {
    return true;
  }

  // Outside the Houhanshu geography chapters, do not close long source-only
  // spans as commentary just because they contain a quoted title later.
  if (!isHouhanshuGeography(item) && stripped.length > 180) return false;

  return segments.every((segment) => {
    if (!startsLikeAnnotation(segment, item)) return false;
    // Avoid passages that continue as ordinary annalistic or biographical base text.
    if (!isHouhanshuGeography(item) && BASE_EVENT_START_RE.test(segment)) return false;
    return true;
  });
}

function hasComparableCharacters(text) {
  return /[\p{Script=Han}0-9]/u.test(text || '');
}

function comparableCharacters(text) {
  const out = [];
  for (const match of String(text || '').matchAll(/[\p{Script=Han}0-9]/gu)) {
    const raw = match[0].normalize('NFKC');
    const normalized = variantText(raw);
    out.push({
      char: normalized,
      index: match.index,
      end: match.index + raw.length,
    });
  }
  return out;
}

function alignLocalInSource(source, local) {
  const sourceChars = comparableCharacters(source);
  const localChars = comparableCharacters(local);
  if (sourceChars.length === 0 || localChars.length === 0) return null;
  if (localChars.length < 4) return null;

  const matched = [];
  let sourceIndex = 0;
  for (const localChar of localChars) {
    while (sourceIndex < sourceChars.length && sourceChars[sourceIndex].char !== localChar.char) {
      sourceIndex += 1;
    }
    if (sourceIndex >= sourceChars.length) return null;
    matched.push(sourceIndex);
    sourceIndex += 1;
  }

  const fragments = [];
  let previousEnd = 0;
  for (const matchedIndex of matched) {
    const sourceChar = sourceChars[matchedIndex];
    if (sourceChar.index > previousEnd) {
      const fragment = source.slice(previousEnd, sourceChar.index);
      if (hasComparableCharacters(fragment)) fragments.push(fragment);
    }
    previousEnd = sourceChar.end;
  }
  if (previousEnd < source.length) {
    const fragment = source.slice(previousEnd);
    if (hasComparableCharacters(fragment)) fragments.push(fragment);
  }

  return {
    sourceComparableLength: sourceChars.length,
    localComparableLength: localChars.length,
    fragments,
  };
}

function looksLikeAnnotationFragment(text, item) {
  const stripped = stripLeadingPunctuation(compact(text));
  if (!stripped) return true;
  if (SOURCE_PAGE_RESIDUE_FRAGMENT_RE.test(stripped)) return true;
  if (!hasComparableCharacters(stripped)) return true;
  if (looksLikePureAnnotation(stripped, item)) return true;
  if (startsLikeAnnotation(stripped, item)) return true;
  if (item.book === 'houhanshu' && HHS_INLINE_EXPLANATORY_RE.test(stripped) && !BASE_EVENT_START_RE.test(stripped)) return true;
  return false;
}

function sourceMatchesLocalAfterAnnotationSkips(source, local, item) {
  const alignment = alignLocalInSource(source, local);
  if (!alignment) return null;
  if (alignment.localComparableLength < 8 && alignment.sourceComparableLength > alignment.localComparableLength * 2) return null;
  if (alignment.sourceComparableLength > 0 && alignment.localComparableLength / alignment.sourceComparableLength < 0.18) return null;
  if (alignment.fragments.length === 0) return null;
  if (alignment.fragments.every((fragment) => looksLikeAnnotationFragment(fragment, item))) return true;
  return null;
}

function sourceMatchesLocalAfterCommentaryStrip(source, local) {
  if (!source || !local) return null;
  if (LOCAL_PLACEHOLDER_RE.test(local)) return null;
  if (!hasCommentaryApparatus(source) || hasCommentaryApparatus(local)) return null;

  const originalSourceKey = key(source);
  const localKey = key(local);
  if (localKey.length < 12 || originalSourceKey.length <= localKey.length) return null;

  const strippedSource = stripCommentaryApparatus(source);
  const strippedSourceKey = key(strippedSource);
  if (!strippedSourceKey || strippedSourceKey !== localKey) return null;
  if (strippedSourceKey.length / originalSourceKey.length < 0.25) return null;
  return true;
}

function withoutAnnotationAffixes(source, local, item) {
  const sourceText = stripLeadingPunctuation(compact(source));
  const localText = compact(local);
  if (!sourceText || !localText) return null;
  if (LOCAL_PLACEHOLDER_RE.test(localText)) return null;

  const localCompact = compact(localText);
  const start = sourceText.indexOf(localCompact);
  if (start >= 0) {
    const prefix = sourceText.slice(0, start);
    const suffix = sourceText.slice(start + localCompact.length);
    if (prefix.length + suffix.length > 260 || prefix.length > 180 || suffix.length > 180) return null;
    if ((!prefix || looksLikePureAnnotation(prefix, item) || startsLikeAnnotation(prefix, item))
      && (!suffix || looksLikePureAnnotation(suffix, item) || startsLikeAnnotation(suffix, item))) {
      return true;
    }
  }
  return null;
}

function classify(item) {
  if (statusOf(item) !== 'pending') return null;
  if (item.ruleId) return null;

  const source = item.sourceRange?.text || '';
  const local = item.localRange?.text || '';
  if (!source) return null;

  // When the upstream span literally wraps the current local base text with a
  // short annotation/citation affix, the item itself is the anchor. Older
  // correspondence scans often fail the surrounding-anchor check in exactly
  // these cases, so allow this narrow direct-containment no-op first.
  if (local && withoutAnnotationAffixes(source, local, item)) {
    return {
      reason: 'source-wrapped-annotation',
      note: NOTES.sourceWrappedAnnotation,
    };
  }

  if (local && sourceMatchesLocalAfterAnnotationSkips(source, local, item)) {
    return {
      reason: 'source-inline-annotation',
      note: NOTES.sourceWrappedAnnotation,
    };
  }

  if (!hasMatchingAnchors(item)) return null;

  if (!local && looksLikePureAnnotation(source, item)) {
    return {
      reason: isHouhanshuGeography(item) ? 'houhanshu-geography-annotation' : 'source-only-annotation',
      note: isHouhanshuGeography(item) ? NOTES.houhanshuGeographyAnnotation : NOTES.sourceOnlyAnnotation,
    };
  }

  if (local && sourceMatchesLocalAfterCommentaryStrip(source, local)) {
    return {
      reason: 'source-commentary-apparatus',
      note: NOTES.sourceCommentaryApparatus,
    };
  }

  return null;
}

function appendNote(existing, note) {
  if (!existing) return note;
  if (String(existing).includes(note)) return existing;
  return `${existing}\n${note}`;
}

function markDenied(item, now, reviewer, note) {
  item.status = 'denied';
  item.decision = 'denied';
  item.reviewedAt = now;
  item.reviewedBy = reviewer;
  item.notes = appendNote(item.notes, note);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const now = new Date().toISOString();
  const stats = {
    dryRun: !opts.apply,
    total: 0,
    byReason: {},
    byBook: {},
    byQueue: {},
    touchedQueueFiles: 0,
    samples: [],
  };

  for (const queueFile of queueFiles(opts)) {
    const queue = JSON.parse(fs.readFileSync(queueFile, 'utf8'));
    let changed = false;
    for (const item of queue.items || []) {
      if (stats.total >= opts.limit) break;
      if (opts.books.size > 0 && !opts.books.has(item.book)) continue;
      if (opts.chapters.size > 0 && !opts.chapters.has(String(item.chapter).padStart(3, '0'))) continue;
      const result = classify(item);
      if (!result) continue;

      stats.total += 1;
      stats.byReason[result.reason] = (stats.byReason[result.reason] || 0) + 1;
      stats.byBook[item.book] = (stats.byBook[item.book] || 0) + 1;
      const relQueue = path.relative(process.cwd(), queueFile);
      stats.byQueue[relQueue] = (stats.byQueue[relQueue] || 0) + 1;
      if (stats.samples.length < opts.sampleLimit) {
        stats.samples.push({
          id: item.id,
          book: item.book,
          chapter: item.chapter,
          type: item.type,
          severity: item.severity ?? null,
          reason: result.reason,
          source: item.sourceRange?.text || '',
          local: item.localRange?.text || '',
          before: item.context?.beforeLocal || '',
          after: item.context?.afterLocal || '',
        });
      }

      if (opts.apply) {
        markDenied(item, now, opts.reviewer, result.note);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(queueFile, `${JSON.stringify(queue, null, 2)}\n`);
      stats.touchedQueueFiles += 1;
    }
  }

  console.log(JSON.stringify(stats, null, 2));
}

main();
