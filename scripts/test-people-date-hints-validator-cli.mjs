import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { compactPeopleExtraction } from './lib/people-compact.mjs';

const cli = fileURLToPath(new URL('./validate-people-extraction.mjs', import.meta.url));
const hash = digit => `sha256:${digit.repeat(64)}`;
function fixture() {
  const input = { unitCount: 1, chapterFingerprint: hash('1'), chineseFingerprint: hash('2'),
    englishFingerprint: hash('3'), unitDigests: [{ id: 's0001', zh: hash('4'), en: hash('5'), literal: hash('6') }] };
  const unit = { id: 's0001', kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: 0 };
  const packet = { schemaVersion: 1, book: 'testbook', chapter: '001',
    source: { path: 'data/testbook/001.json', title: { zh: '', en: '' } }, input,
    units: [{ ...unit, zh: '艾麗絲來。', en: 'Alice came.', literal: 'Alice came.' }],
    preflight: { scannerVersion: 2, candidates: [
      { id: 'testbook:001:cand_1111111111111111', unit: 's0001', language: 'zh', exact: '艾麗絲', occurrence: 0, startCodePoint: 0, endCodePoint: 3, detectors: [{ kind: 'fixture' }] },
      { id: 'testbook:001:cand_2222222222222222', unit: 's0001', language: 'en', exact: 'Alice', occurrence: 0, startCodePoint: 0, endCodePoint: 5, detectors: [{ kind: 'fixture' }] },
    ] }, context: { westernEraStyle: 'BC_AD', roles: [{ id: 'official', label: 'Official' }], polities: [], reigns: [] } };
  const extraction = { schemaVersion: 1, book: 'testbook', chapter: '001', input,
    run: { model: 'fixture', promptVersion: 7 },
    people: [{ localId: 'testbook:001:p001', preferredNameSuggestion: { en: 'Alice', zh: '艾麗絲' },
      historicity: 'historical', descriptorSuggestion: 'Official',
      identityHints: { nativePlaces: [], relatedLocalPeople: [], activeDateHints: ['682 BC'] } }],
    mentions: [{ id: 'testbook:001:m0001', person: 'testbook:001:p001', unit, kind: 'personal-name',
      spans: { zh: [{ exact: '艾麗絲', occurrence: 0 }], en: [{ exact: 'Alice', occurrence: 0 }] },
      candidateRefs: ['testbook:001:cand_1111111111111111', 'testbook:001:cand_2222222222222222'] }],
    claims: [{ id: 'testbook:001:c0001', subject: 'testbook:001:p001', predicate: 'name',
      value: { kind: 'personal', en: 'Alice', zh: '艾麗絲' }, certainty: 'explicit', evidence: ['testbook:001:s0001'] },
    { id: 'testbook:001:c0002', subject: 'testbook:001:p001', predicate: 'role',
      value: { roleId: 'official' }, certainty: 'explicit', evidence: ['testbook:001:s0001'] },
    { id: 'testbook:001:c0003', subject: 'testbook:001:p001', predicate: 'attestation',
      value: { sourceDate: { text: 'first year' }, westernYear: { era: 'BC', year: 682, precision: 'year' } },
      certainty: 'explicit-event-contextual-date', evidence: ['testbook:001:s0001'] }],
    translationRepairs: [], candidateDispositions: [],
    coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [],
      allNamedPeopleAndMentionsCaptured: true, allDurableFactsCaptured: true, allChronologyCaptured: true,
      editorialPassCompleted: true, allPersonEventsCaptured: true, allClaimProvenanceCaptured: true,
      allFamilyRelationshipsCaptured: true } };
  return { packet, extraction };
}

test('validator CLI writes normalized hints only after validation', t => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'people-hint-validator-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const { packet, extraction } = fixture();
  const packetPath = path.join(dir, 'packet.json');
  fs.writeFileSync(packetPath, JSON.stringify(packet));
  for (const compact of [false, true]) {
    const input = compact ? compactPeopleExtraction(extraction, packet) : structuredClone(extraction);
    const inputPath = path.join(dir, compact ? 'compact.json' : 'expanded.json');
    const outputPath = path.join(dir, compact ? 'compact-out.json' : 'expanded-out.json');
    fs.writeFileSync(inputPath, JSON.stringify(input));
    const before = fs.readFileSync(inputPath, 'utf8');
    const untreated = spawnSync(process.execPath, [cli, inputPath, '--packet', packetPath], { encoding: 'utf8' });
    assert.notEqual(untreated.status, 0);
    assert.match(untreated.stderr, /no Western active-date hint/);
    assert.equal(fs.readFileSync(inputPath, 'utf8'), before);
    const result = spawnSync(process.execPath, [cli, inputPath, '--packet', packetPath, '--normalize', '--out', outputPath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(inputPath, 'utf8'), before);
    const output = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const hint = compact ? output.people[0][4].a[0] : output.people[0].identityHints.activeDateHints[0];
    assert.equal(hint, 'BC 682');
    assert.match(result.stdout, /Normalized Western active-date hints/);
    if (compact) {
      const expected = structuredClone(input);
      expected.people[0][4].a[0] = 'BC 682';
      assert.deepEqual(output, expected);
    }
    const bad = structuredClone(input);
    bad.coverage.allUnitsVisited = false;
    fs.writeFileSync(inputPath, JSON.stringify(bad));
    const badBefore = fs.readFileSync(inputPath, 'utf8');
    const failedPath = path.join(dir, compact ? 'compact-failed.json' : 'expanded-failed.json');
    const failure = spawnSync(process.execPath, [cli, inputPath, '--packet', packetPath, '--normalize', '--out', failedPath], { encoding: 'utf8' });
    assert.notEqual(failure.status, 0);
    assert.equal(fs.readFileSync(inputPath, 'utf8'), badBefore);
    assert.equal(fs.existsSync(failedPath), false);
  }
});
