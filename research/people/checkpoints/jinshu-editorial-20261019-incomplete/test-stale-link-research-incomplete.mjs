// Research-only reproduction: this demonstrates the current defect; it is not
// a production gate, a valid chapter extraction, or a publication approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = process.cwd();
const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'people-stale-research-'));
const generated = path.join(fixtureRoot, 'data', 'people', 'generated');
const extractionFile = path.join(fixtureRoot, 'data', 'people', 'extractions', 'fixture', '001.json');
fs.mkdirSync(generated, { recursive: true });
fs.mkdirSync(path.dirname(extractionFile), { recursive: true });

const generatedAt = '2026-01-01T00:00:00.000Z';
const stats = {
  sourceChapters: 1, extractedChapters: 1, missingChapters: 0,
  dateAuditPendingChapters: 0, legacyChapters: 0, legacyLocalPeople: 0,
  pendingTranslationRepairs: 0, unresolvedCandidateBlocks: 0,
};
const mention = {
  mentionId: 'fixture:001:m001', personId: 'per_a', slug: 'old-person',
  unit: { id: 's001' }, spans: { en: [{ exact: 'Zhang', occurrence: 0 }] },
};
const catalog = {
  schemaVersion: 1, generatedAt, complete: true, currentPromptVersion: 7,
  stats, missingChapterIds: [], people: [{ id: 'per_a', slug: 'old-person' }],
  familyEdges: [], localPersonMap: { 'fixture:001:p001': 'per_a' },
};
const index = {
  schemaVersion: 2, generatedAt, complete: true, currentPromptVersion: 7,
  chapters: { 'fixture:001': { book: 'fixture', chapter: '001', mentions: [mention] } },
};
fs.writeFileSync(path.join(generated, 'catalog.json'), JSON.stringify(catalog));
fs.writeFileSync(path.join(generated, 'site-index.json'), JSON.stringify(index));
function writeExtraction(person) {
  fs.writeFileSync(extractionFile, JSON.stringify({
    mentions: [{ id: mention.mentionId, person, spans: mention.spans }],
  }));
}
writeExtraction('fixture:001:p001');

process.env.PEOPLE_REPO_ROOT = fixtureRoot;
const { loadPeopleSiteContext, chapterPeopleContext, renderPersonLinkedText } =
  await import(pathToFileURL(path.join(repoRoot, 'scripts', 'lib', 'people-site.mjs')).href);
function render() {
  const context = loadPeopleSiteContext({ allowMissing: false });
  assert.equal(context.active, true);
  return renderPersonLinkedText({
    text: 'Zhang', language: 'en',
    mentions: chapterPeopleContext(context, 'fixture', '001').mentionsByUnit.get('s001'),
  });
}

const before = render();
writeExtraction('fixture:001:p002');
assert.equal(JSON.parse(fs.readFileSync(extractionFile, 'utf8')).mentions[0].person, 'fixture:001:p002');
const after = render();
assert.equal(after, before);
assert.match(after, /old-person/u);
console.log('Reproduced: the loader accepts stale mapping and renders the previous person link.');
// Leave the isolated, synthetic fixture in the OS temporary directory. Never
// recursively remove a path in a shared workspace or touch recovery artifacts.
