const WIDE_CHARACTER_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export const DEFAULT_OG_SNIPPET_TEXT_UNITS = 420;
export const DEFAULT_OG_SNIPPET_PARAGRAPH_BREAK_UNITS = 24;
export const DEFAULT_OG_SNIPPET_MAX_PARAGRAPHS = 6;

function paragraphSnippetFromBlock(block) {
  const blockTr = (block.translations || []).find((translation) => translation.lang === 'en') || block.translations?.[0];
  if (blockTr) {
    const text = String(blockTr.idiomatic || blockTr.literal || '').trim();
    if (text) return { english: true, text };
  }

  const pieces = [];
  let anyEnglish = false;
  for (const sentence of block.sentences || []) {
    const translation =
      (sentence.translations || []).find((candidate) => candidate.lang === 'en') || sentence.translations?.[0];
    const english = translation && String(translation.idiomatic || translation.literal || '').trim();
    const chinese = String(sentence.zh || '').trim();
    if (english) {
      anyEnglish = true;
      pieces.push(english);
    } else if (chinese) {
      pieces.push(chinese);
    }
  }
  if (pieces.length === 0) return null;
  return { english: anyEnglish, text: anyEnglish ? pieces.join(' ') : pieces.join('') };
}

function characterTextUnits(character) {
  return WIDE_CHARACTER_RE.test(character) ? 2 : 1;
}

export function textUnits(text) {
  let units = 0;
  for (const character of text) units += characterTextUnits(character);
  return units;
}

function truncateToTextUnits(text, maxUnits) {
  let units = 0;
  let result = '';
  for (const character of text) {
    const nextUnits = units + characterTextUnits(character);
    if (nextUnits > maxUnits) break;
    result += character;
    units = nextUnits;
  }
  return result.trimEnd();
}

/**
 * Fill a chapter card's excerpt budget across source paragraph boundaries. The final
 * paragraph may be clipped so a short heading never prevents the following prose from
 * appearing. Wide CJK characters count double because they occupy roughly twice the
 * horizontal space of Latin prose at the card's font size.
 */
export function collectOpeningSnippet(
  chapterData,
  {
    maxTextUnits = DEFAULT_OG_SNIPPET_TEXT_UNITS,
    paragraphBreakUnits = DEFAULT_OG_SNIPPET_PARAGRAPH_BREAK_UNITS,
    maxParagraphs = DEFAULT_OG_SNIPPET_MAX_PARAGRAPHS,
  } = {},
) {
  if (!Number.isFinite(maxTextUnits) || maxTextUnits < 1) {
    throw new Error(`maxTextUnits must be a positive number; received ${maxTextUnits}`);
  }
  if (!Number.isFinite(paragraphBreakUnits) || paragraphBreakUnits < 0) {
    throw new Error(`paragraphBreakUnits must be a non-negative number; received ${paragraphBreakUnits}`);
  }
  if (!Number.isInteger(maxParagraphs) || maxParagraphs < 1) {
    throw new Error(`maxParagraphs must be a positive integer; received ${maxParagraphs}`);
  }

  const parts = [];
  let remainingUnits = maxTextUnits;
  for (const block of chapterData.content || []) {
    if (block.type !== 'paragraph') continue;
    const snippet = paragraphSnippetFromBlock(block);
    if (!snippet?.text) continue;

    if (parts.length > 0) {
      if (remainingUnits <= paragraphBreakUnits) break;
      remainingUnits -= paragraphBreakUnits;
    }

    const text = truncateToTextUnits(snippet.text, remainingUnits);
    if (!text) break;
    parts.push({ ...snippet, text });
    remainingUnits -= textUnits(text);

    if (parts.length >= maxParagraphs || remainingUnits < 1) break;
  }
  return parts;
}
