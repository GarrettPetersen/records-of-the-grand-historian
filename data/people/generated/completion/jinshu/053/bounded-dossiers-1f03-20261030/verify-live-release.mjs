import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { inspectLocalDisk } from '../../../../../../../scripts/check-local-disk.mjs';
const J = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(J, '../../../../../../..');
const [receiptFile, revision] = process.argv.slice(2);
assert(receiptFile && /^[a-f0-9]{40}$/.test(revision ?? ''), 'Exact qualification receipt and merged revision required');
const receipt = JSON.parse(fs.readFileSync(receiptFile));
assert(receipt.dataQualified && !receipt.livePublished && receipt.personTargets.length === receipt.people && receipt.people > 0);
const base = 'https://24histories.com';
const note = 'It is not yet established whether this person is the same as similarly named people in other chapters.';
const evidence = { revision, startedAt: new Date().toISOString(), requests: [], persons: [], redirects: [], passed: false };
const file = J + '/live-check-' + revision.slice(0, 12) + '.json';
assert(!fs.existsSync(file), 'Preserve prior live verification; use a unique report');
const sample = () => { const r = inspectLocalDisk(ROOT); fs.appendFileSync(J + '/live-resource-samples.jsonl', JSON.stringify({ at: new Date().toISOString(), errors: r.errors, memory: r.memory, availableGiB: r.availableGiB }) + '\n'); assert.equal(r.errors.length, 0, 'Resource hold'); };
sample();
const timer = setInterval(sample, 45000);
async function get(relative, { redirect = 'follow', binary = false } = {}) {
  const url = new URL(relative, base); url.searchParams.set('release', revision);
  const response = await fetch(url, { redirect, signal: AbortSignal.timeout(25000), headers: { 'Cache-Control': 'no-cache' } });
  const bytes = Buffer.from(await response.arrayBuffer());
  evidence.requests.push({ path: relative, status: response.status, contentType: response.headers.get('content-type'), bytes: bytes.length, location: response.headers.get('location') });
  assert(bytes.length < 10 * 1024 * 1024, 'Unexpectedly oversized response');
  if (!binary && redirect === 'follow') assert.equal(response.status, 200, relative);
  return { response, bytes, text: binary ? null : bytes.toString('utf8') };
}
const json = async relative => JSON.parse((await get(relative)).text);
try {
  const status = await json('/data/people/site-status.json');
  assert(status.published && !status.preview && status.publication.mode === 'certified-scope');
  assert.equal(status.certificate.inputs, receipt.identityInputs, 'Deployed identity inputs differ from qualified CI tree');
  const gate = status.certificate.gates.find(row => row.book === receipt.scope.book && row.chapter === receipt.scope.chapter);
  assert.deepEqual(gate, receipt.qualifiedGateEvidence[0], 'Live chapter qualification evidence differs from CI');
  const chapterPath = `/${receipt.scope.book}/${receipt.scope.chapter}.html`;
  const chapter = load((await get(chapterPath)).text);
  assert.equal(chapter('h1').length, 1);
  for (const target of receipt.mentionTargets) for (const language of target.languages) {
    const unit = chapter(`[id="${language}-${target.unitId}"]`);
    assert(unit.length && unit.find(`a[data-person-id="${target.personId}"]`).length, `Missing live ${language} mention ${target.unitId} ${target.personId}`);
  }
  const searchIndex = await json('/data/people/search/index.json');
  const entries = (await Promise.all(searchIndex.parts.map(async part => (await json('/data/people/search/' + part.file)).entries))).flat();
  const bySlug = new Map(entries.map(row => [row[0], row]));
  const sitemap = load((await get('/sitemap.xml')).text, { xmlMode: true });
  const sitemapUrls = new Set(sitemap('loc').map((_, item) => sitemap(item).text()).get());
  let next = 0;
  const worker = async () => {
    while (next < receipt.personTargets.length) {
      const person = receipt.personTargets[next++];
      const url = `/people/${person.slug}.html`;
      const document = load((await get(url)).text);
      assert.equal(document('h1').length, 1, 'Unexpected fallback page');
      assert(document('h1').text().includes(person.name.en), 'Wrong live identity');
      assert.equal(document('link[rel="canonical"]').attr('href'), base + url);
      const jsonLd = document('script[type="application/ld+json"]').map((_, item) => JSON.parse(document(item).text())).get().flatMap(item => item['@graph'] ?? [item]);
      assert(jsonLd.some(item => item['@type'] === 'Person' && item.url === base + url), 'Missing Person JSON-LD');
      for (const language of ['zh', 'en']) assert(document(`a.person-reference-${language}`).toArray().some(item => new URL(document(item).attr('href'), base + url).pathname === chapterPath), 'Missing inverse bilingual source reference');
      const search = bySlug.get(person.slug); assert(search, 'Missing search record');
      assert(sitemapUrls.has(base + url), 'Missing sitemap identity');
      if (person.uncertain) {
        assert(document('.person-lede').text().includes(note), 'Missing visible uncertainty');
        assert(jsonLd.some(item => String(item.description).includes(note)), 'Missing structured uncertainty');
        assert(search.some(value => typeof value === 'string' && value.includes(note)), 'Missing search uncertainty');
      }
      evidence.persons.push({ id: person.id, slug: person.slug, uncertain: person.uncertain, verified: true });
      if (person.retiredIds?.length) {
        const suffix = person.retiredIds[0].slice(4, 12).toLowerCase();
        const result = await get(`/people/retired-${suffix}.html`, { redirect: 'manual' });
        assert([301,308].includes(result.response.status), 'Retired ID did not redirect');
        assert.equal(new URL(result.response.headers.get('location'), base).pathname, url, 'Wrong retired-ID redirect');
        evidence.redirects.push({ retiredId: person.retiredIds[0], target: url });
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  const progress = await json('/data/progress.json');
  assert(progress.peopleGlossary.identityReviewedChapters >= 1, 'Progress omits reviewed chapter');
  const og = await get('/og/site.png', { binary: true });
  assert.equal(og.response.status, 200); assert(og.response.headers.get('content-type').startsWith('image/png')); assert.equal(og.bytes.subarray(1,4).toString(), 'PNG');
  sample();
  evidence.passed = true; evidence.people = evidence.persons.length; evidence.bilingualMentionLinks = receipt.mentionTargets.reduce((n,row) => n + row.languages.length, 0); evidence.liveIdentityInputs = status.certificate.inputs;
} catch (error) { evidence.error = { name: error.name, message: error.message }; process.exitCode = 1; }
finally { clearInterval(timer); evidence.finishedAt = new Date().toISOString(); fs.writeFileSync(file, JSON.stringify(evidence, null, 2) + '\n', { flag: 'wx' }); }
console.log(JSON.stringify({ passed: evidence.passed, people: evidence.persons.length, error: evidence.error, report: file }));
