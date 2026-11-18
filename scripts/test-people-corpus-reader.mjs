import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createPeopleCorpusReader, loadPinnedPeopleChapter } from './lib/people-corpus-reader.mjs';

function fixture(cacheSize = 1) {
  const rows = ['001', '002', '003'].map((chapter, i) => {
    const id = `fixture:${chapter}:p001`, person = { localId: id, book: 'fixture', chapter, promptVersion: i === 0 ? 6 : 7,
      claims: [{ predicate: 'name', value: { en: `Name ${chapter}` } }, { predicate: i === 2 ? 'different-person' : 'same-person', value: { personId: 'fixture:001:p001' }, certainty: 'explicit' }], mentions: [{ id: chapter }] };
    return { file: chapter, extraction: { book: 'fixture', chapter, run: { agentId: `author-${chapter}`, promptVersion: person.promptVersion },
      mentions: person.mentions, translationRepairs: [{ id: chapter, status: 'proposed' }] }, localPeople: new Map([[id, person]]) };
  });
  const loads = [], byKey = new Map(rows.map(row => [`fixture:${row.extraction.chapter}`, row]));
  const visit = consume => { for (const row of rows) consume(row); return { coverage: { sourceChapters: 4, extractedChapters: 3, missingChapterIds: ['fixture:004'] } }; };
  const reader = createPeopleCorpusReader(visit, key => { loads.push(key); return structuredClone(byKey.get(key)); }, { cacheSize });
  return { reader, loads, byKey, rows };
}

test('reader preserves records, all explicit constraints, author provenance and coverage without eager reloads', () => {
  const { reader, loads, rows } = fixture();
  assert.deepEqual(loads, []); assert.equal(reader.localPeople.size, 3);
  assert.deepEqual([...reader.localPeople.keys()], rows.map(row => row.localPeople.keys().next().value));
  assert.equal(reader.localPeople.has('absent'), false); assert.equal(reader.localPeople.get('absent'), undefined);
  assert.equal(reader.coverage.missingChapterIds[0], 'fixture:004');
  assert.deepEqual([...reader.promptVersionCounts], [[6, 1], [7, 2]]);
  for (const row of rows) {
    const [id, person] = row.localPeople.entries().next().value;
    assert.deepEqual(reader.localPeople.get(id), person);
    assert.deepEqual(reader.identityConstraints.get(id).claims, person.claims.filter(c => ['same-person', 'different-person'].includes(c.predicate)));
  }
  assert.deepEqual(reader.chapters[0].extraction.run, rows[0].extraction.run);
  assert.deepEqual(reader.chapters[0].extraction.mentions, rows[0].extraction.mentions);
  assert.deepEqual(reader.chapters[0].extraction.translationRepairs, rows[0].extraction.translationRepairs);
  assert.deepEqual([...reader.localPeople], rows.map(row => row.localPeople.entries().next().value));
});

test('production byte pins reject changed extraction and source bytes before native loading', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'people-reader-pins-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'extraction.json'), source = path.join(directory, 'source.json');
  const original = '{"book":"fixture","chapter":"001"}\n';
  const hash = value => createHash('sha256').update(value).digest('hex');
  for (const target of [file, source]) {
    fs.writeFileSync(file, original); fs.writeFileSync(source, original);
    const pin = { book: 'fixture', chapter: '001', file, source, extractionHash: hash(original), sourceHash: hash(original) };
    fs.appendFileSync(target, ' ');
    assert.throws(() => loadPinnedPeopleChapter(pin), /Validated chapter inputs changed: fixture:001/);
  }
});

test('bounded cache evicts chapters and invokes the full loader again after eviction', () => {
  const { reader, loads } = fixture();
  reader.localPeople.get('fixture:001:p001'); reader.localPeople.get('fixture:001:p001');
  reader.localPeople.get('fixture:002:p001'); reader.localPeople.get('fixture:001:p001');
  assert.deepEqual(loads, ['fixture:001', 'fixture:002', 'fixture:001']);
});

test('reload rejects changed scope or member inventory and propagates native validation failures', () => {
  const { reader, byKey } = fixture();
  byKey.get('fixture:001').localPeople.clear();
  assert.throws(() => reader.localPeople.get('fixture:001:p001'), /Changed validated chapter people/);
  byKey.get('fixture:002').extraction.chapter = '999';
  assert.throws(() => reader.localPeople.get('fixture:002:p001'), /Wrong validated chapter/);
  const { rows } = fixture();
  const fail = createPeopleCorpusReader(consume => { consume(rows[0]); return { coverage: {} }; }, () => { throw Error('native source or extraction validation failed'); });
  assert.throws(() => fail.localPeople.get('fixture:001:p001'), /native source or extraction validation failed/);
  assert.throws(() => fixture(0), /Positive chapter cache size/);
});
