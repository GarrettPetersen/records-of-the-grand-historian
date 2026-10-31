import { load as loadHtml } from 'cheerio';

// HTML attribute names are present literally in the input, ignoring ASCII case.
// An absent name cannot produce a DOM match. If present, retain the exact DOM
// query so comments, text, scripts and non-anchor elements are handled normally.
export function hasPersonLinks(html) {
  if (typeof html !== 'string') throw new TypeError('Chapter HTML must be a string');
  if (!/data-person-id/i.test(html)) return false;
  return loadHtml(html)('a[data-person-id]').length > 0;
}

