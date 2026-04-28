/**
 * Shared checks for translation workflow (submit-translations, score-translations).
 * Catches editorial rubric scaffolding where a short Chinese heading (often a name)
 * is padded with meta English ("the following subsection treats…").
 */

export function countHanzi(text) {
  if (!text) return 0;
  const m = String(text).match(/[\u4e00-\u9fff]/g);
  return m ? m.length : 0;
}

export function countEnglishWords(text) {
  if (!text || !String(text).trim()) return 0;
  return String(text).trim().split(/\s+/).length;
}

/** True if zh is only CJK ideographs, length 1–4 (typical standalone name rubric). */
export function isCjkOnlyShortLabel(zh) {
  const t = String(zh || '').trim();
  return /^[\u4e00-\u9fff]{1,4}$/.test(t);
}

const RUBRIC_SCAFFOLDING_PATTERNS = [
  /\bthe following subsection\b/i,
  /\bthe following section treats\b/i,
  /\bthe following is (his|her) biography\b/i,
  /\bsection title marking\b/i,
  /\bhere begins the (biography|life)\b/i,
  /\bthis section treats\b/i,
  /\bthis passage discusses\b/i,
  /\bthis scroll covers\b/i,
  /\bthis scroll treats\b/i,
  /\bsubsection heading\b/i,
  /\bpersonal name used as section title\b/i,
];

const BIO_BOILERPLATE = /\b(courtesy name|was a man of|came from)\b/i;

/**
 * If Chinese is a very short heading and English looks like rubric/editorial padding,
 * returns a human-readable error message; otherwise null.
 */
export function rubricScaffoldingIssue(chinese, english) {
  if (!english || !String(english).trim()) return null;
  const zh = String(chinese || '').trim();
  const hz = countHanzi(zh);
  if (hz < 1 || hz > 4) return null;
  if (/[。，、；：《》「」『』？！…]/.test(zh)) return null;

  const en = String(english);
  for (const re of RUBRIC_SCAFFOLDING_PATTERNS) {
    if (re.test(en)) {
      return 'Editorial rubric scaffolding is not allowed for short Chinese headings (≤4 characters, no clause punctuation): use a brief label (e.g. romanized name), not meta phrases like "the following subsection" or "here begins the biography".';
    }
  }

  if (isCjkOnlyShortLabel(zh)) {
    if (BIO_BOILERPLATE.test(en)) {
      return `Short heading "${zh}" must not be expanded with biography boilerplate ("courtesy name", "was a man of", "came from"); use a brief romanized label.`;
    }
    if (hz <= 3 && countEnglishWords(en) > 10) {
      return `Very short heading (${hz} characters) with unusually long English (${countEnglishWords(en)} words). Prefer a concise label unless the Chinese is itself a full clause.`;
    }
  }

  return null;
}

/** Blocking errors for submit-translations (one string per failing field). */
export function rubricScaffoldingErrorsForSentence({ chinese, literal, idiomatic }) {
  const errors = [];
  const litMsg = rubricScaffoldingIssue(chinese, literal);
  if (litMsg) errors.push(`❌ RUBRIC SCAFFOLDING in literal for ${chinese}: ${litMsg}`);
  const idmMsg = rubricScaffoldingIssue(chinese, idiomatic);
  if (idmMsg) errors.push(`❌ RUBRIC SCAFFOLDING in idiomatic for ${chinese}: ${idmMsg}`);
  return errors;
}

/** Strip trailing closing quotes/brackets/spaces from Chinese to read sentence-final mark. */
function stripTrailingChineseDecorations(zh) {
  let t = String(zh || '').trim();
  while (t && /[」』"\s\u00A0]$/.test(t)) t = t.slice(0, -1);
  return t;
}

function countSubstr(str, needle) {
  if (!str || !needle) return 0;
  let c = 0;
  let i = 0;
  while ((i = str.indexOf(needle, i)) !== -1) {
    c++;
    i += needle.length;
  }
  return c;
}

/**
 * Compare delimiter *counts* between Chinese and English when each side uses
 * well-formed pairs (open === close). No "unbalanced within one language" warnings.
 */
export function delimiterAlignmentNotes(chinese, english, fieldLabel) {
  const notes = [];
  const zh = String(chinese || '');
  const en = String(english || '').trim();
  if (!zh || !en) return notes;

  const enPO = countSubstr(en, '(');
  const enPC = countSubstr(en, ')');
  const enAscBal = enPO === enPC;

  const zhFwO = countSubstr(zh, '\uFF08');
  const zhFwC = countSubstr(zh, '\uFF09');
  const zhPO = countSubstr(zh, '(');
  const zhPC = countSubstr(zh, ')');
  const zhFwOk = zhFwO === zhFwC;
  const zhAscOk = zhPO === zhPC;
  if (zhFwOk && zhAscOk && enAscBal) {
    const zhParenTotal = zhFwO + zhPO;
    if (zhParenTotal !== enPO && (zhParenTotal > 0 || enPO > 0)) {
      notes.push(
        `${fieldLabel}: Chinese has ${zhFwO} （） + ${zhPO} () = ${zhParenTotal} parenthetical pair(s) but English has ${enPO} (); match parenthetical structure to the source.`
      );
    }
  }

  const zhBO = countSubstr(zh, '[');
  const zhBC = countSubstr(zh, ']');
  const enBO = countSubstr(en, '[');
  const enBC = countSubstr(en, ']');
  if (zhBO === zhBC && enBO === enBC && zhBO !== enBO && (zhBO > 0 || enBO > 0)) {
    notes.push(
      `${fieldLabel}: Chinese has ${zhBO} [] pair(s) but English has ${enBO}; match bracket structure to the source.`
    );
  }

  const zhBrO = countSubstr(zh, '{');
  const zhBrC = countSubstr(zh, '}');
  const enBrO = countSubstr(en, '{');
  const enBrC = countSubstr(en, '}');
  if (zhBrO === zhBrC && enBrO === enBrC && zhBrO !== enBrO && (zhBrO > 0 || enBrO > 0)) {
    notes.push(
      `${fieldLabel}: Chinese has ${zhBrO} {} pair(s) but English has ${enBrO}; match brace structure to the source.`
    );
  }

  const zhLA = countSubstr(zh, '\u300A');
  const zhLB = countSubstr(zh, '\u300B');
  const enLA = countSubstr(en, '\u300A');
  const enLB = countSubstr(en, '\u300B');
  if (zhLA === zhLB && enLA === enLB && zhLA !== enLA && (zhLA > 0 || enLA > 0)) {
    notes.push(
      `${fieldLabel}: Chinese has ${zhLA} 《》 pair(s) but English has ${enLA}; match title marks to the source.`
    );
  }

  const cOpen = countSubstr(zh, '「');
  const cClose = countSubstr(zh, '」');
  const fOpen = countSubstr(zh, '『');
  const fClose = countSubstr(zh, '』');
  const asciiDouble = countSubstr(en, '"');
  const u201C = countSubstr(en, '\u201C');
  const u201D = countSubstr(en, '\u201D');

  if (cOpen === cClose && fOpen === fClose && fOpen === 0 && cOpen > 0) {
    const hasAscii = asciiDouble > 0;
    const hasCurly = u201C > 0 || u201D > 0;
    if (hasAscii && hasCurly) {
      // Mixed quote styles; skip pair-count comparison.
    } else if (hasAscii && asciiDouble % 2 === 0 && u201C === 0 && u201D === 0) {
      const enPairs = asciiDouble / 2;
      if (enPairs !== cOpen) {
        notes.push(
          `${fieldLabel}: Chinese has ${cOpen} 「…」 pair(s) but English has ${enPairs} ASCII double-quote pair(s); match dialogue framing to the source.`
        );
      }
    } else if (hasCurly && asciiDouble === 0 && u201C === u201D && u201C !== cOpen) {
      notes.push(
        `${fieldLabel}: Chinese has ${cOpen} 「…」 pair(s) but English has ${u201C} curly double-quote pair(s); match dialogue framing to the source.`
      );
    } else if (!hasAscii && !hasCurly) {
      notes.push(
        `${fieldLabel}: Chinese has ${cOpen} 「…」 pair(s) but English has no double quotes; match dialogue framing to the source.`
      );
    }
  }

  return notes;
}

/**
 * Last sentence-closing punctuation on the Chinese segment, if any (else null).
 * Does not treat clause commas ， as terminal.
 */
export function lastChineseSentenceTerminal(zh) {
  const t = stripTrailingChineseDecorations(zh);
  if (!t) return null;
  if (t.endsWith('……')) return '…';
  const c = t[t.length - 1];
  if ('？！。．…'.includes(c)) return c;
  return null;
}

/** Strip trailing ASCII/CJK closers so we read the real English sentence end. */
function stripTrailingEnglishDecorations(en) {
  let e = String(en || '').trim();
  while (e && /["')\]]\s*$/.test(e)) e = e.replace(/["')\]]\s*$/, '').trim();
  while (e && /[」』]\s*$/.test(e)) e = e.replace(/[」』]\s*$/, '').trim();
  return e;
}

/** True if English end matches Chinese sentence terminal (?, !, ., …). */
export function englishMatchesChineseTerminal(zhTerminal, english) {
  const e = stripTrailingEnglishDecorations(english);
  if (!e) return true;
  const last = e[e.length - 1];
  if (zhTerminal === '？') return last === '?' || last === '？';
  if (zhTerminal === '！') return last === '!' || last === '！';
  if (zhTerminal === '。' || zhTerminal === '．') {
    return last === '.' || last === '。' || last === '．' || last === '…' || e.endsWith('...');
  }
  if (zhTerminal === '…') {
    return last === '…' || last === '.' || e.endsWith('...');
  }
  return true;
}

/** Fullwidth / CJK punctuation often pasted into English by mistake (non-exhaustive). */
const FULLWIDTH_OR_CJK_IN_ENGLISH = /[\uFF0C\u3002\uFF1A\uFF1B\uFF01\uFF1F\u3001\uFF08\uFF09\u300A\u300B]/;

/**
 * Non-blocking notes when English closing punctuation or script style disagrees with Chinese.
 * Omits check when there is no clear Chinese sentence closer (e.g. ends mid-clause with ，).
 */
export function punctuationAlignmentNotes(chinese, english, fieldLabel) {
  const notes = [];
  const zh = String(chinese || '');
  const en = String(english || '').trim();
  if (!zh || !en) return notes;

  if (FULLWIDTH_OR_CJK_IN_ENGLISH.test(en)) {
    notes.push(
      `${fieldLabel}: English contains fullwidth or CJK punctuation (e.g. ，。；：); use ASCII , . ; : unless you intentionally mirror the source.`
    );
  }

  const term = lastChineseSentenceTerminal(zh);
  if (term && !englishMatchesChineseTerminal(term, en)) {
    notes.push(
      `${fieldLabel}: Chinese ends with "${term}" but the English closing does not match the expected English mark (? ! . or …). Review if the mood or sentence boundary is wrong.`
    );
  }

  for (const d of delimiterAlignmentNotes(zh, en, fieldLabel)) {
    notes.push(d);
  }

  return notes;
}
