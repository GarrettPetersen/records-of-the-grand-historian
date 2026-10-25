import path from 'node:path';
import { DATA_DIR, readJson, sourceUnitAt } from './people-content.mjs';
import { loadCertifiedEbookPeople, assertEbookPeopleCertificate } from './ebook-certified-people.mjs';
import { buildEbookPeople, ebookPersonHref, renderEbookPeopleIndex, renderEbookGlossaryShard } from './ebook-people-render.mjs';
import { planEbookContentDocuments } from './ebook-content-layout.mjs';
import { renderUnitWithPeople } from './people-site.mjs';
import { getMainText } from './ebook-text.mjs';
import { assertCertifiedEbookSources } from './ebook-certified-source.mjs';

const personLinks = html => [...html.matchAll(/<a class="person-link"(?=\s|>)[^>]*>[\s\S]*?<\/a>/gu)].map(match => match[0]).sort();

// Compare the real packaged reading artifact with fresh qualified source facts.
// Neither a QA ready flag nor an attacker-adjusted count/hash can replace this.
export function verifyCertifiedEbookPeople({ product, entries, readEntry, hasAbout,
  context = loadCertifiedEbookPeople(product), chapterData = null }) {
  const state = buildEbookPeople(context, product);
  if (!state.ready || state.preview || !state.certificate) throw new Error('Required glossary has no certified non-preview context');
  assertEbookPeopleCertificate(JSON.parse(readEntry('EPUB/people/certificate.json')), context.certificate);
  const chapters = product.chapters.map(chapter => ({ chapter,
    data: chapterData?.get(chapter) ?? readJson(path.join(DATA_DIR, product.book, `${chapter}.json`)) }));
  assertCertifiedEbookSources(context, product, chapters);
  const contentLayout = planEbookContentDocuments(chapters, { hasAbout,
    peopleActive: true, peopleShards: state.shards.length });
  const titles = new Map(chapters.map(({ chapter, data }) => [chapter, data.meta.title?.en || `Chapter ${Number.parseInt(chapter, 10)}`]));
  const sourceByChapter = new Map(chapters.map(({ chapter, data }) => [chapter, data]));
  const expected = new Map([['EPUB/people/index.xhtml', renderEbookPeopleIndex(state)]]);
  for (const shard of state.shards) expected.set(`EPUB/people/${shard.file}`,
    renderEbookGlossaryShard(shard, state, titles, contentLayout, sourceByChapter));
  const actualFiles = entries.filter(entry => /^EPUB\/people\/.*\.xhtml$/u.test(entry)).sort();
  if (actualFiles.join('|') !== [...expected.keys()].sort().join('|')) throw new Error('EPUB glossary file inventory differs from current certified product');
  for (const [file, html] of expected) {
    if (readEntry(file) !== html) throw new Error(`EPUB glossary content differs from current certified sources: ${file}`);
  }
  const expectedLinksByDocument = new Map();
  for (const { chapter, data } of chapters) {
    const chapterContext = state.chapterContexts.get(chapter);
    const entry = `EPUB/text/${contentLayout.documentByChapter.get(chapter).file}`;
    if (!expectedLinksByDocument.has(entry)) expectedLinksByDocument.set(entry, []);
    for (const [unitId, mentions] of chapterContext.mentionsByUnit) {
      const unit = sourceUnitAt(data, mentions[0].unit);
      const html = renderUnitWithPeople({ unitId, text: getMainText(unit), language: 'en',
        chapterContext, chineseWordSpans: false,
        hrefForPerson: ({ personId }) => ebookPersonHref(state, personId, 'chapter') });
      expectedLinksByDocument.get(entry).push(...personLinks(html));
    }
  }
  for (const [entry, links] of expectedLinksByDocument) {
    if (JSON.stringify(personLinks(readEntry(entry))) !== JSON.stringify(links.sort())) {
      throw new Error(`EPUB English person links differ from current scoped extraction: ${entry}`);
    }
  }
  // Extra text documents must not carry unverified person links.
  for (const entry of entries.filter(value => /^EPUB\/text\/.*\.xhtml$/u.test(value))) {
    if (!expectedLinksByDocument.has(entry) && personLinks(readEntry(entry)).length) {
      throw new Error(`Unexpected EPUB person links in ${entry}`);
    }
  }
  return { people: state.people.length, shards: state.shards.length,
    expectedMentionLinks: state.expectedMentionLinks, expectedBacklinks: state.expectedBacklinks };
}
