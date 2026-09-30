#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';

globalThis.document = {
  getElementById: () => null,
  createElement: () => ({
    set textContent(value) {
      this.innerHTML = String(value);
    },
  }),
};

const { BOOKS, buildBookCoverCardInnerHtml } = await import('../public/app.js');
const { KINDLE_PRODUCTS } = await import('../public/kindle-promo-shared.js');

assert.deepEqual(Object.keys(KINDLE_PRODUCTS), ['shiji', 'hanshu', 'houhanshu', 'sanguozhi']);

for (const bookId of Object.keys(KINDLE_PRODUCTS)) {
  const html = buildBookCoverCardInnerHtml({ bookId, info: BOOKS[bookId], chapterCount: 1 });
  assert.match(html, /<div class="book-cover-card-kindle">Kindle edition available<\/div>/);
}

const unpublishedHtml = buildBookCoverCardInnerHtml({ bookId: 'jinshu', info: BOOKS.jinshu, chapterCount: 1 });
assert.doesNotMatch(unpublishedHtml, /book-cover-card-kindle/);

for (const page of ['public/index.html', 'public/privacy.html']) {
  const html = fs.readFileSync(page, 'utf8');
  for (const { amazonUrl, title } of Object.values(KINDLE_PRODUCTS)) {
    assert.ok(html.includes(`href="${amazonUrl}"`), `${page} is missing the Kindle URL for ${title}`);
    assert.ok(html.includes(`>${title}</a>`), `${page} is missing the Kindle title for ${title}`);
  }
}

console.log('Kindle availability tests passed');
