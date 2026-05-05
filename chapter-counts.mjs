import { isPunctuationOnlySentence } from "./sentence-utils.mjs";

function isCountableText(text) {
  const raw = String(text || "").trim();
  return !!raw && !isPunctuationOnlySentence(raw);
}

function getSentenceText(item) {
  return item?.zh ?? item?.content ?? "";
}

function getTranslations(item) {
  if (!item) return [];
  if (Array.isArray(item.translations)) return item.translations;
  return [item];
}

function hasMeaningfulTranslation(item) {
  for (const t of getTranslations(item)) {
    if (
      typeof t?.literal === "string" && t.literal.trim() ||
      typeof t?.idiomatic === "string" && t.idiomatic.trim() ||
      typeof t?.text === "string" && t.text.trim() ||
      typeof t?.translation === "string" && t.translation.trim()
    ) {
      return true;
    }
  }
  return false;
}

export function countChapterMetrics(chapterData) {
  let sentenceCount = 0;
  let translatedCount = 0;
  let characterCount = 0;
  let translatedCharacterCount = 0;

  for (const block of chapterData?.content || []) {
    if (block.type === "paragraph" || block.type === "table_header") {
      for (const sentence of block.sentences || []) {
        const text = getSentenceText(sentence);
        if (!isCountableText(text)) continue;
        sentenceCount += 1;
        const chars = text.trim().length;
        characterCount += chars;
        if (hasMeaningfulTranslation(sentence)) {
          translatedCount += 1;
          translatedCharacterCount += chars;
        }
      }
    } else if (block.type === "table_row") {
      for (const cell of block.cells || []) {
        const text = getSentenceText(cell);
        if (!isCountableText(text)) continue;
        sentenceCount += 1;
        const chars = text.trim().length;
        characterCount += chars;
        if (hasMeaningfulTranslation(cell)) {
          translatedCount += 1;
          translatedCharacterCount += chars;
        }
      }
    }
  }

  return { sentenceCount, translatedCount, characterCount, translatedCharacterCount };
}

