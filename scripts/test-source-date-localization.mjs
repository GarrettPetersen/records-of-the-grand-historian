import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDateValue } from './generate-people-pages.mjs';

test('source dates retain both localized forms with correct language labels', () => {
  const result = renderDateValue({ sourceDate: { zh: '漢朝', en: 'Han dynasty' } });
  assert.match(result, /lang="zh-Hant">漢朝/u);
  assert.match(result, /lang="en">Han dynasty/u);
  assert.doesNotMatch(renderDateValue({ sourceDate: { en: 'Han dynasty' } }), /zh-Hant/u);
});

test('empty source date falls back to unlabeled date text', () => {
  assert.equal(renderDateValue({ sourceDate: { zh: '   ', en: '' }, dateText: ' fallback ' }),
    '<span class="person-fact-date-source">fallback</span>');
  assert.doesNotMatch(renderDateValue({ sourceDate: { text: 'Han dynasty' } }), /lang=/u);
});

test('distinct source forms are escaped and identical forms deduplicated', () => {
  const result = renderDateValue({ sourceDate: { zh: '<漢>', en: 'Han & Jin', text: 'Han & Jin' } });
  assert.match(result, /&lt;漢&gt;/u);
  assert.equal((result.match(/Han &amp; Jin/gu) ?? []).length, 1);
  assert.match(result, /lang="en">Han &amp; Jin/u);
});

test('plain source text has no invented language', () => {
  const result = renderDateValue({ sourceDate: ' English & text ' });
  assert.doesNotMatch(result, /lang=/u);
  assert.match(result, /English &amp; text/u);
});

test('direct and nested date contexts retain source values and reasons', () => {
  const result = renderDateValue({ sourceDate: { zh: '漢朝', en: 'Han dynasty' }, unresolvedReason: 'first <reason>',
    dateContext: { sourceDate: { zh: '晉朝', en: 'Jin dynasty' }, unresolvedReason: 'second & reason' } });
  for (const value of ['漢朝', 'Han dynasty', '晉朝', 'Jin dynasty', 'first &lt;reason&gt;', 'second &amp; reason']) {
    assert.ok(result.includes(value), result);
  }
});
