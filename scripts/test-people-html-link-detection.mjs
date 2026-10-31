import assert from 'node:assert/strict';
import test from 'node:test';
import { load } from 'cheerio';
import { hasPersonLinks } from './lib/people-html-link-detection.mjs';
const cases = [
  '', '<p>無名。 A normal unannotated chapter.</p>',
  '<a href="/people/name.html">No person attribute</a>',
  '<a data-person-id="per_example">Person</a>',
  '<A DATA-PERSON-ID = per_example>Person',
  `<a class="person-link"
DaTa-PeRsOn-Id="id">Person</a>`,
  '<a data-person-id>Person</a>',
  '<!-- <a data-person-id="id">comment</a> -->',
  `<script>const s = '<a data-person-id="id">text</a>';</script>`,
  '<p>&lt;a data-person-id="id"&gt;escaped text&lt;/a&gt;</p>',
  '<span data-person-id="id">Not an anchor</span>',
  '<a title="data-person-id">Attribute text</a>',
  '<a data-person-id-suffix="id">Different attribute</a>',
  '<a data&#45;person-id="id">Attribute names do not decode entities</a>',
  '<svg><foreignObject><A DATA-PERSON-ID="id">Nested anchor</A></foreignObject></svg>',
  '<template><a data-person-id="id">Template content</a></template>',
  '<p>' + '史'.repeat(100000) + '</p><a DATA-PERSON-ID="id">Late anchor</a>',
];
test('person-link detection preserves the actual DOM predicate across HTML syntax and content', () => {
  for (const html of cases) assert.equal(hasPersonLinks(html), load(html)('a[data-person-id]').length > 0, html.slice(0,120));
});
test('invalid chapter data fails loudly rather than being treated as absence', () => {
  for (const value of [null, undefined, 0, {}, []]) assert.throws(() => hasPersonLinks(value), TypeError);
});
