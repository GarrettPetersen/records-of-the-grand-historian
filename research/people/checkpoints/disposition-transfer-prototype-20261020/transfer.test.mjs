import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { exactSpanAt } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-content.mjs';
import { reconcileExtractionAfterRepairs, applyTranslationRepairs } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs';
import { expandPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';

const fixed = ['1', '2'].includes(process.env.PEOPLE_TRANSFER_PROTOTYPE);
const person = 'fixture:001:p001';
const makeUnit = (id, en, i) => ({ id, kind: 'paragraph-sentence', blockIndex: 0, collection: 'sentences', itemIndex: i, zh: '太子', en, literal: en });
const makeCandidate = (id, unit, exact, occurrence = 0) => ({ id, unit: unit.id, language: 'en', ...exactSpanAt(unit.en, exact, occurrence), detectors: [] });
const packet = (units, candidates) => ({ book: 'fixture', chapter: '001', input: {}, units, preflight: { candidates } });
function extraction(dispositions, mentions = []) {
  return { book: 'fixture', chapter: '001', input: {}, people: [{ localId: person,
    preferredNameSuggestion: { en: 'Crown Prince', zh: '太子' },
    identityHints: { polityHints: [], activeDateHints: [], relatedLocalPeople: [] } }],
  mentions, claims: [{ id: 'fixture:001:c0001', subject: person, predicate: 'name',
    value: { kind: 'title', en: 'Crown Prince', zh: '太子' }, certainty: 'explicit', evidence: ['fixture:001:s0002'] }],
  translationRepairs: [], candidateDispositions: dispositions,
  coverage: { allUnitsVisited: true, preflightCandidatesAccountedFor: true, unresolvedReferences: [] } };
}
const disposition = candidate => ({ candidate, disposition: 'not-person', reason: 'place', note: 'Prior contextual decision.' });
const mention = unit => ({ id: 'fixture:001:m0001', person,
  unit: { id: unit.id, kind: unit.kind, blockIndex: unit.blockIndex, collection: unit.collection, itemIndex: unit.itemIndex },
  kind: 'title-reference', spans: { zh: [], en: [exactSpanAt(unit.en, 'Crown Prince', 0)] }, candidateRefs: [] });

test('cross-unit disposition does not override a local title mention', () => {
  const a = makeUnit('s0001', 'Crown Prince spoke.', 0);
  const b = makeUnit('s0002', 'Crown Prince marched.', 1);
  const old = makeCandidate('old', a, 'Crown Prince');
  const added = makeCandidate('new', b, 'Crown Prince');
  const previous = packet([a,b], [old]);
  const result = reconcileExtractionAfterRepairs(extraction([disposition('old')], [mention(b)]), packet([a,b], [old,added]), { previousPacket: previous });
  const copied = result.extraction.candidateDispositions.find(d => d.candidate === 'new');
  const linked = result.extraction.mentions.some(m => m.unit.id === 's0002' && m.candidateRefs.includes('new'));
  if (fixed) { assert.equal(copied, undefined); assert.equal(linked, true); }
  else { assert.equal(copied?.reason, 'place'); assert.equal(linked, false); }
});

test('new unmatched occurrence remains unresolved rather than inheriting another unit', () => {
  const a = makeUnit('s0001', 'Xyzzy appeared.', 0), b = makeUnit('s0002', 'Xyzzy appeared.', 1);
  const old = makeCandidate('old', a, 'Xyzzy'), added = makeCandidate('new', b, 'Xyzzy');
  const result = reconcileExtractionAfterRepairs(extraction([disposition('old')]), packet([a,b],[old,added]), { previousPacket: packet([a,b],[old]) });
  if (fixed) { assert.equal(result.extraction.candidateDispositions.some(d => d.candidate === 'new'), false); assert.ok(result.unresolvedCandidates.includes('new')); }
  else { assert.equal(result.extraction.candidateDispositions.find(d => d.candidate === 'new')?.reason, 'place'); assert.equal(result.unresolvedCandidates.includes('new'), false); }
});

test('a second unmatched occurrence in one unit does not inherit the first occurrence', () => {
  const a = makeUnit('s0001', 'Xyzzy appeared. Xyzzy returned.', 0);
  const old = makeCandidate('old', a, 'Xyzzy', 0), added = makeCandidate('new', a, 'Xyzzy', 1);
  const result = reconcileExtractionAfterRepairs(extraction([disposition('old')]), packet([a],[old,added]), { previousPacket: packet([a],[old]) });
  if (fixed) { assert.equal(result.extraction.candidateDispositions.some(d => d.candidate === 'new'), false); assert.ok(result.unresolvedCandidates.includes('new')); }
  else { assert.equal(result.extraction.candidateDispositions.find(d => d.candidate === 'new')?.reason, 'place'); assert.equal(result.unresolvedCandidates.includes('new'), false); }
});

test('an unchanged exact prior candidate remains unchanged', () => {
  const a = makeUnit('s0001', 'Xyzzy appeared.', 0), old = makeCandidate('old', a, 'Xyzzy');
  const result = reconcileExtractionAfterRepairs(extraction([disposition('old')]), packet([a],[old]), { previousPacket: packet([a],[old]) });
  assert.deepEqual(result.extraction.candidateDispositions, [disposition('old')]);
});

test('a unique same-occurrence disposition remaps through an edit', () => {
  const before = makeUnit('s0001', 'Xyzzy appeared.', 0), after = makeUnit('s0001', 'Then Xyzzy appeared.', 0);
  const old = makeCandidate('old', before, 'Xyzzy'), next = makeCandidate('next', after, 'Xyzzy');
  const result = reconcileExtractionAfterRepairs(extraction([disposition('old')]), packet([after],[next]), { previousPacket: packet([before],[old]) });
  assert.deepEqual(result.extraction.candidateDispositions, [disposition('next')]);
  assert.deepEqual(result.unresolvedCandidates, []);
});

test('pinned Jinshu 053 review draft does not import a Crown Prince place from s0063 into s0047', () => {
  const ref = '89296b9f9da8683bcd807c78b0cf27f94d129865';
  const read = (path, sha) => {
    const buf = execFileSync('git', ['show', `${ref}:${path}`], { maxBuffer: 64 * 1024 * 1024 });
    assert.equal(createHash('sha256').update(buf).digest('hex'), sha, path);
    return buf.toString();
  };
  const source = JSON.parse(read('data/jinshu/053.json', '85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407'));
  const candidate = JSON.parse(read('research/people/checkpoints/jinshu053-age-five-unresolved-incomplete-20261019/candidate.json', 'ae953c22149c69831301c1f8edf45bfbe4391d2f07ee7f9d8f6d7324649f0b78'));
  const markdown = read('research/people/jinshu053-additional-editorial-draft-20261019.md', 'bc42b588295930f0f509ebe8d031caedd71f84882b83830731a4c8b73dae2c12');
  const accepted = ['s0133','s0136','s0137','s0138','s0142','s0167','s0168','s0169','s0172','s0173','s0174','s0175','s0176','s0178','s0179','s0180','s0181','s0182','s0183','s0184','s0185','s0187'];
  const oldPacket = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source });
  for (const id of accepted) {
    const match = markdown.match(new RegExp(`### ${id} — ([^\\n]+)\\n([\\s\\S]*?)(?=\\n### |$)`));
    assert.ok(match, id);
    const unit = source.content.flatMap(b => b.sentences ?? []).find(u => u.id === id);
    assert.equal(unit.zh, match[1]);
    const en = unit.translations.find(t => t.lang === 'en');
    for (const field of ['literal','idiomatic']) {
      const found = match[2].match(new RegExp(`- ${field === 'literal' ? 'Literal' : 'Idiomatic'}: \u0060([^\u0060]+)\u0060`));
      assert.ok(found, `${id} ${field}`);
      if (en[field] !== found[1]) candidate.translationRepairs.push([id, field, en[field], found[1], 'Draft only.', 'high', 'proposed']);
    }
  }
  const expanded = expandPeopleExtraction(candidate, oldPacket);
  const { chapter } = applyTranslationRepairs(source, expanded.translationRepairs.filter(r => r.status === 'proposed'));
  const next = buildPeopleExtractionPacket('jinshu', '053', { chapterData: chapter });
  const result = reconcileExtractionAfterRepairs(expanded, next, { previousPacket: oldPacket });
  const id = 'jinshu:053:cand_e52f72d263aa7470';
  const candidate0047 = next.preflight.candidates.find(c => c.id === id);
  assert.equal(candidate0047?.unit, 's0047'); assert.equal(candidate0047.exact, 'Crown Prince');
  const transferred = result.extraction.candidateDispositions.find(d => d.candidate === id);
  if (!fixed) assert.equal(transferred?.reason, 'place');
  else assert.notEqual(transferred?.reason, 'place');
  const links = result.extraction.mentions.filter(m => m.unit.id === 's0047' && m.candidateRefs.includes(id)).map(m => ({ person: m.person, kind: m.kind }));
  console.log('Jinshu 053 s0047 outcome:', JSON.stringify({ mode: fixed ? 'prototype' : 'baseline', disposition: transferred ?? null, links, unresolved: result.unresolvedCandidates.includes(id), unresolvedTotal: result.unresolvedCandidates.length }));
});
