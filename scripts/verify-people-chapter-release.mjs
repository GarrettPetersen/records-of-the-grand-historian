#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import { loadQualifiedPeopleScope } from './lib/people-qualified-scope.mjs';
import { chapterIdentityInputs, IDENTITY_UNCERTAINTY_NOTE } from './lib/people-chapter-identity.mjs';
import { DATA_DIR, readJson, sourceUnitAt, chineseText, englishText } from './lib/people-content.mjs';
import { chapterPeopleContext, renderUnitWithPeople } from './lib/people-site.mjs';
import { renderEbookGlossaryShard, ebookPersonAnchor } from './lib/ebook-people-render.mjs';
import { planEbookContentDocuments } from './lib/ebook-content-layout.mjs';
import { peopleDigest } from './lib/people-identity-seal.mjs';

// A chapter contribution checks real qualified facts through the shared ebook
// renderer. It grants no whole-book/product certificate and packages no ebook.
const options = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i].slice(2);
  assert(['book', 'chapter', 'out'].includes(key) && process.argv[i].startsWith('--') && process.argv[i + 1] && !Object.hasOwn(options, key), 'Usage: --book BOOK --chapter NNN --out NEW_DIRECTORY');
  options[key] = process.argv[i + 1];
}
const { book, chapter, out } = options;
assert(/^[a-z0-9_-]+$/u.test(book ?? '') && /^\d{3}$/u.test(chapter ?? '') && out && !fs.existsSync(out), 'Explicit chapter and new output directory required');
const inputs = chapterIdentityInputs(book, chapter);
const qualified = loadQualifiedPeopleScope([{ book, chapter }]);
const { catalog, siteIndex, gateEvidence, identityCertificates } = qualified;
assert(catalog.people.length > 0 && gateEvidence.length === 1 && identityCertificates.length === 1, 'Real nonempty qualified chapter required');
const context = { ...qualified, active: true, preview: false, peopleById: new Map(catalog.people.map(person => [person.id, person])) };
const chapterContext = chapterPeopleContext(context, book, chapter);
assert(chapterContext && chapterContext.record.mentions.length > 0, 'Qualified chapter mentions required');
const data = readJson(path.join(DATA_DIR, book, `${chapter}.json`));
const file = 'glossary-001.xhtml';
const state = { book, people: catalog.people, chapterIds: new Set([chapter]),
  familyPeopleById: context.peopleById, fileByPersonId: new Map(catalog.people.map(person => [person.id, file])),
  certificate: { kind: 'qualified-chapter-contribution-only' } };
const layout = planEbookContentDocuments([{ chapter, data }], { hasAbout: false, peopleActive: true, peopleShards: 1 });
const glossary = renderEbookGlossaryShard({ number: 1, people: catalog.people }, state,
  new Map([[chapter, data.meta.title?.en || `Chapter ${Number(chapter)}`]]), layout, new Map([[chapter, data]]));
const $ = load(glossary, { xmlMode: true });
assert.equal($('.glossary-entry').length, catalog.people.length, 'Every qualified person needs an ebook entry');
for (const person of catalog.people) {
  const entry = $(`[id="${ebookPersonAnchor(person.id)}"]`);
  assert.equal(entry.length, 1, `Missing or duplicate ebook person ${person.id}`);
  assert(person.references.every(reference => reference.book === book && reference.chapter === chapter), 'External facts leaked into contribution');
  if (person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE)) assert(entry.text().includes(IDENTITY_UNCERTAINTY_NOTE), 'Missing reviewed identity uncertainty');
}
let bilingualMentionLinks = 0;
const rendered = [];
for (const [unitId, mentions] of chapterContext.mentionsByUnit) {
  const unit = sourceUnitAt(data, mentions[0].unit);
  for (const language of ['zh', 'en']) {
    const html = renderUnitWithPeople({ unitId, text: language === 'zh' ? chineseText(unit) : englishText(unit), language,
      chineseWordSpans: false, chapterContext, hrefForPerson: ({ personId }) => `${file}#${ebookPersonAnchor(personId)}` });
    const document = load(html);
    for (const mention of mentions) if (mention.spans[language]?.length) {
      assert(document(`a[href="${file}#${ebookPersonAnchor(mention.personId)}"]`).length > 0, `Missing ${language} ebook mention ${mention.mentionId}`);
      bilingualMentionLinks++;
    }
    rendered.push({ unitId, language, html });
  }
}
assert.equal(peopleDigest(chapterIdentityInputs(book, chapter)), peopleDigest(inputs), 'Chapter inputs changed during contribution verification');
const receipt = { schemaVersion: 1, scope: { book, chapter }, inputs, qualifiedGateEvidence: gateEvidence,
  identity: qualified.identity, identityInputs: qualified.inputs, people: catalog.people.length,
  personTargets: catalog.people.map(person => ({ id: person.id, slug: person.slug, name: person.preferredName, retiredIds: person.retiredIds, uncertain: person.curation.notes.includes(IDENTITY_UNCERTAINTY_NOTE) })),
  mentionTargets: chapterContext.record.mentions.map(mention => ({ personId: mention.personId, unitId: mention.unit.id, languages: ['zh', 'en'].filter(language => mention.spans[language]?.length) })),
  reviewedCases: identityCertificates[0].retained.length, reviewedAmbiguousCases: identityCertificates[0].ambiguity.length,
  bilingualMentionLinks, ebookContribution: { verified: true, glossaryFingerprint: peopleDigest(glossary), mentionFingerprint: peopleDigest(rendered), wholeBookCertified: false },
  dataQualified: true, livePublished: false, checkedAt: new Date().toISOString() };
fs.mkdirSync(out, { recursive: false });
fs.writeFileSync(path.join(out, 'qualification-and-contribution.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
fs.writeFileSync(path.join(out, file), glossary, { flag: 'wx' });
fs.writeFileSync(path.join(out, 'bilingual-mentions.json'), JSON.stringify(rendered) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
