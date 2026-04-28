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

function pushUnbalanced(notes, fieldLabel, openCount, closeCount, label, where) {
  if (openCount !== closeCount) {
    notes.push(
      `${fieldLabel}: ${label} unbalanced in ${where} (${openCount} open vs ${closeCount} close).`
    );
  }
}

/**
 * Balanced delimiters within Chinese / within English, plus light cross-language checks
 * for corner quotes vs English dialogue quotes and fullwidth vs ASCII parentheses.
 */
export function delimiterAlignmentNotes(chinese, english, fieldLabel) {
  const notes = [];
  const zh = String(chinese || '');
  const en = String(english || '').trim();
  if (!zh || !en) return notes;

  pushUnbalanced(
    notes,
    fieldLabel,
    countSubstr(zh, '\uFF08'),
    countSubstr(zh, '\uFF09'),
    'Fullwidth parentheses （）',
    'Chinese'
  );
  pushUnbalanced(notes, fieldLabel, countSubstr(zh, '「'), countSubstr(zh, '」'), 'Corner quotes 「」', 'Chinese');
  pushUnbalanced(notes, fieldLabel, countSubstr(zh, '『'), countSubstr(zh, '』'), 'Corner quotes 『』', 'Chinese');
  pushUnbalanced(notes, fieldLabel, countSubstr(zh, '\u300A'), countSubstr(zh, '\u300B'), 'Title marks 《》', 'Chinese');
  pushUnbalanced(notes, fieldLabel, countSubstr(zh, '('), countSubstr(zh, ')'), 'ASCII parentheses', 'Chinese');
  pushUnbalanced(notes, fieldLabel, countSubstr(zh, '['), countSubstr(zh, ']'), 'Square brackets', 'Chinese');

  pushUnbalanced(notes, fieldLabel, countSubstr(en, '('), countSubstr(en, ')'), 'ASCII parentheses ()', 'English');
  pushUnbalanced(notes, fieldLabel, countSubstr(en, '['), countSubstr(en, ']'), 'Square brackets []', 'English');
  pushUnbalanced(notes, fieldLabel, countSubstr(en, '{'), countSubstr(en, '}'), 'Braces {}', 'English');
  pushUnbalanced(
    notes,
    fieldLabel,
    countSubstr(en, '\uFF08'),
    countSubstr(en, '\uFF09'),
    'Fullwidth parentheses （）',
    'English'
  );
  pushUnbalanced(notes, fieldLabel, countSubstr(en, '\u00AB'), countSubstr(en, '\u00BB'), 'Guillemets «»', 'English');

  const u201C = countSubstr(en, '\u201C');
  const u201D = countSubstr(en, '\u201D');
  pushUnbalanced(notes, fieldLabel, u201C, u201D, 'Curly double quotes (\u201C / \u201D)', 'English');

  const asciiDouble = countSubstr(en, '"');
  if (asciiDouble % 2 === 1) {
    notes.push(
      `${fieldLabel}: Odd number of ASCII double-quote (") characters (${asciiDouble}) in English; they are usually paired for dialogue.`
    );
  }

  const cOpen = countSubstr(zh, '「');
  const cClose = countSubstr(zh, '」');
  const fOpen = countSubstr(zh, '『');
  const fClose = countSubstr(zh, '』');
  if (cOpen === cClose && fOpen === fClose && cOpen > 0 && fOpen === 0) {
    const zhPairs = cOpen;
    const enAsciiPairs = Math.floor(asciiDouble / 2);
    if (asciiDouble % 2 === 0 && u201C === 0 && u201D === 0 && enAsciiPairs !== zhPairs) {
      notes.push(
        `${fieldLabel}: Chinese has ${zhPairs} 「…」 pair(s) but English has ${enAsciiPairs} ASCII double-quote pair(s); check that dialogue boundaries match.`
      );
    } else if (asciiDouble === 0 && u201C === u201D && u201C > 0 && u201C !== zhPairs) {
      notes.push(
        `${fieldLabel}: Chinese has ${zhPairs} 「…」 pair(s) but English has ${u201C} curly double-quote pair(s); check that dialogue boundaries match.`
      );
    }
  }

  const zhFwPo = countSubstr(zh, '\uFF08');
  const zhFwPc = countSubstr(zh, '\uFF09');
  const enPo = countSubstr(en, '(');
  const enPc = countSubstr(en, ')');
  if (zhFwPo === zhFwPc && zhFwPo > 0 && enPo === enPc && enPo > 0 && zhFwPo !== enPo) {
    notes.push(
      `${fieldLabel}: Chinese has ${zhFwPo} fullwidth （） pair(s) but English has ${enPo} ASCII () pair(s); check glosses and asides.`
    );
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
