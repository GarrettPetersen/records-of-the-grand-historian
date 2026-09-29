import assert from 'node:assert/strict';
import { test } from 'node:test';
import { collectOpeningSnippet, textUnits } from './og-chapter-snippet.mjs';

function paragraph(text, lang = 'en') {
  if (lang === 'en') {
    return { type: 'paragraph', translations: [{ lang: 'en', idiomatic: text }] };
  }
  return { type: 'paragraph', sentences: [{ zh: text }] };
}

test('continues into a long second paragraph after a short heading', () => {
  const chapter = { content: [paragraph('A short heading.'), paragraph('x'.repeat(500))] };
  const parts = collectOpeningSnippet(chapter, { maxTextUnits: 100, paragraphBreakUnits: 10 });
  assert.equal(parts.length, 2);
  assert.equal(parts[0].text, 'A short heading.');
  assert.equal(parts[1].text, 'x'.repeat(74));
});

test('includes several very short paragraphs until the budget is spent', () => {
  const chapter = { content: [paragraph('One.'), paragraph('Two.'), paragraph('Three.'), paragraph('Four.')] };
  const parts = collectOpeningSnippet(chapter, { maxTextUnits: 30, paragraphBreakUnits: 3 });
  assert.deepEqual(parts.map((part) => part.text), ['One.', 'Two.', 'Three.', 'Four.']);
});

test('does not add another paragraph when the first fills the card', () => {
  const chapter = { content: [paragraph('x'.repeat(100)), paragraph('Never shown.')] };
  const parts = collectOpeningSnippet(chapter, { maxTextUnits: 100, paragraphBreakUnits: 10 });
  assert.deepEqual(parts.map((part) => part.text), ['x'.repeat(100)]);
});

test('accounts for the rendered width of CJK characters', () => {
  assert.equal(textUnits('漢字ab'), 6);
  const chapter = { content: [paragraph('漢'.repeat(30), 'zh')] };
  const parts = collectOpeningSnippet(chapter, { maxTextUnits: 20 });
  assert.equal(parts[0].text, '漢'.repeat(10));
});

test('rejects invalid layout budgets loudly', () => {
  assert.throws(() => collectOpeningSnippet({ content: [] }, { maxTextUnits: 0 }), /positive number/);
});
