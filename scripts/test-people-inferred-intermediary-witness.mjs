import {assertDossierPrimaryWitness} from './lib/people-identity-dossiers.mjs';
import {localNameKeys} from './lib/people-resolution.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inferredIntermediaryWitness } from './lib/people-inferred-intermediary-witness.mjs';

const packet = JSON.parse(readFileSync(new URL('./fixtures/jinshu032-intermediary-witness.json', import.meta.url), 'utf8'));
const P = id => `jinshu:032:${id}`;
// Offline stand-in for normalizeKey('zh:'+s).slice(3) and current native
// name evidence (zh name claims citing the unit plus person-linked spans).
const normalize = s => s.normalize('NFKC').replace(/[\s\p{P}]/gu, '');
const unitNamesFor = sourceId => person => {
  const out = new Set();
  if (!person) return out;
  for (const c of person.claims) if (c.predicate === 'name' && typeof c.value?.zh === 'string' && c.evidence.includes(sourceId)) out.add(normalize(c.value.zh));
  for (const m of person.mentions ?? []) if (P(m.unit.id) === sourceId) for (const s of m.spans.zh) out.add(normalize(s.exact));
  return out;
};
const text = unit => packet.units.find(u => u.id === unit).zh;

function bind(personId, unit, quote = text(unit), mutate = () => {}) {
  const people = structuredClone(packet.people);
  const byId = new Map(people.map(p => [p.localId, p]));
  const claim = id => people.flatMap(p => p.claims).find(c => c.id === P(id));
  mutate({ byId, claim, people });
  const sourceId = P(unit);
  return inferredIntermediaryWitness(byId.get(P(personId)), sourceId, quote, text(unit), byId, unitNamesFor(sourceId), normalize);
}
const drop = (byId, personId, claimId) => {
  const p = byId.get(P(personId));
  p.claims = p.claims.filter(c => c.id !== P(claimId));
};

test('positives: the four held exact graph cases bind with the exact primary quote and the full unit', () => {
  for (const [id, unit, quote] of [
    ['p022', 's0044', '鎮南將軍預之曾孫也'], ['p022', 's0044', '預之曾孫'],
    ['p029', 's0063', '太尉王夷甫外孫'],
    ['p094', 's0191', '依于舅濮陽吳氏'],
  ]) {
    assert.equal(bind(id, unit, quote), true, `${id} ${quote}`);
    assert.equal(bind(id, unit), true, `${id} full ${unit}`);
  }
});

test('p094: inverse mother edge (parent-of from the mother, daughter role) also binds', () => {
  assert.equal(bind('p094', 's0191', '依于舅濮陽吳氏', ({ byId }) => {
    drop(byId, 'p088', 'c1257');
    byId.get(P('p094')).claims.push({ id: P('cX'), subject: P('p094'), predicate: 'family-relationship',
      value: { relation: 'parent-of', personId: P('p088'), parentage: 'biological', subjectRole: 'mother', objectRole: 'daughter', line: 'maternal' },
      certainty: 'strongly-inferred', evidence: [P('s0191')] });
  }), true);
});

test('held: p157 (Tushan mate, English-only Yu) and p049 never bind through this helper', () => {
  assert.equal(bind('p157', 's0272', '是以塗山作儷'), false);
  assert.equal(bind('p157', 's0272'), false);
  // Even relabelled as an unnamed descriptive relative with no mention, a
  // spouse edge carries no intermediary path contract.
  assert.equal(bind('p157', 's0272', '是以塗山作儷', ({ byId }) => {
    const p = byId.get(P('p157'));
    p.mentions = [];
    p.claims.find(c => c.predicate === 'name').value = { kind: 'descriptive-kinship', en: 'Mate of Tushan' };
  }), false);
  assert.equal(bind('p049', 's0087', '伏惟陛下德侔二媯'), false);
  assert.equal(bind('p049', 's0314', '二妃光舜'), false);
  // p049 baseline: the existing direct-name path already sees exact 舜 in s0314.
  const p049 = packet.people.find(p => p.localId === P('p049'));
  assert.ok([...unitNamesFor(P('s0314'))(p049)].some(n => normalize('二妃光舜').includes(n)));
  assert.equal([...unitNamesFor(P('s0087'))(p049)].some(n => normalize(text('s0087')).includes(n)), false);
});

test('target guard: no mentions, a mentionException, descriptive names citing this unit', () => {
  const q = '鎮南將軍預之曾孫也';
  assert.equal(bind('p022', 's0044', q, ({ byId }) => { byId.get(P('p022')).mentions = [{ id: 'm', unit: { id: 's0044' }, spans: { zh: [] } }]; }), false);
  assert.equal(bind('p022', 's0044', q, ({ byId }) => { byId.get(P('p022')).mentionException = ' '; }), false);
  assert.equal(bind('p022', 's0044', q, ({ claim }) => { claim('c0101').certainty = 'explicit'; }), false);
  assert.equal(bind('p022', 's0044', q, ({ claim }) => { claim('c0101').value.kind = 'personal-name'; }), false);
  assert.equal(bind('p022', 's0044', q, ({ claim }) => { claim('c0101').evidence = [P('s0045')]; }), false);
  assert.equal(bind('p022', 's0044', '鎮南將軍預之曾孫子'), false, 'quote must be exact source text');
  assert.equal(bind('p022', 's0045', '父乂'), false, 'wrong unit');
  assert.equal(bind('p094', 's0190', '后少孤'), false, 'wrong unit');
});

test('descent negatives (曾孫): term, anchor, explicit edge, generation, line, order, links', () => {
  const q = '鎮南將軍預之曾孫也';
  for (const [label, quote] of [['term without named ancestor', '之曾孫也'], ['ancestor without term', '鎮南將軍預'],
    ['other relative only', '成恭杜皇后諱陵陽'], ['no term', '京兆人']]) assert.equal(bind('p022', 's0044', quote), false, label);
  const cases = {
    'edge only strongly-inferred': ({ claim }) => { claim('c0759').certainty = 'strongly-inferred'; },
    'edge cites another unit': ({ claim }) => { claim('c0759').evidence = [P('s0045')]; },
    'target not an intermediary': ({ claim }) => { claim('c0759').value.intermediaryPersonIds = [P('p023')]; },
    'intermediary order reversed': ({ claim }) => { claim('c0759').value.intermediaryPersonIds = [P('p023'), P('p022')]; },
    'generation mismatch': ({ claim }) => { claim('c0759').value.generationDistance = 2; },
    'maternal line on 曾孫': ({ claim }) => { claim('c0759').value.line = 'maternal'; },
    'non-descendant role': ({ claim }) => { claim('c0759').value.objectRole = 'wife'; },
    'non-ancestor role': ({ claim }) => { claim('c0759').value.subjectRole = 'uncle'; },
    'incident link missing': ({ byId }) => drop(byId, 'p022', 'c0761'),
    'incident link not citing unit': ({ claim }) => { claim('c0761').evidence = [P('s0045')]; },
    'upper incident link missing': ({ byId }) => drop(byId, 'p021', 'c0760'),
    'non-incident link missing': ({ byId }) => drop(byId, 'p023', 'c0762'),
    'non-incident link outside chapter': ({ claim }) => { claim('c0762').evidence = ['jinshu:033:s0001']; },
    'adoptive link': ({ claim }) => { claim('c0760').value.parentage = 'adoptive'; },
    'non-parental link role': ({ claim }) => { claim('c0761').value.subjectRole = 'uncle'; },
    'non-child link role': ({ claim }) => { claim('c0761').value.objectRole = 'grandson'; },
    'female intermediary on paternal line': ({ claim }) => { claim('c0722').value.sex = 'female'; },
    'mother role on paternal line': ({ claim }) => { claim('c0761').value.subjectRole = 'mother'; },
    'sex conflict at endpoint': ({ claim }) => { claim('c0762').value.objectRole = 'son'; },
    'link line contradicts parent sex': ({ claim }) => { claim('c0762').value.line = 'maternal'; },
    'descendant unnamed in unit and not edge subject': ({ byId, claim }) => {
      byId.get(P('p020')).mentions = [];
      for (const id of ['c0090', 'c0091', 'c0092', 'c0093', 'c0094']) claim(id).evidence = [P('s0050')];
    },
    'ancestor cross-chapter': ({ byId }) => { byId.get(P('p021')).localId = 'jinshu:033:p021'; },
  };
  for (const [label, mutate] of Object.entries(cases)) assert.equal(bind('p022', 's0044', q, mutate), false, label);
});

test('descent negatives (外孫): female intermediary must be proved, ancestor anchored', () => {
  const q = '太尉王夷甫外孫';
  assert.equal(bind('p029', 's0063', '太尉王夷甫'), false);
  assert.equal(bind('p029', 's0063', '裴氏名穆'), false);
  assert.equal(bind('p029', 's0063', '太傅主簿遐女'), false, 'father, not maternal grandfather');
  const cases = {
    'paternal line on 外孫': ({ claim }) => { claim('c1872').value.line = 'paternal'; },
    'intermediary male (conflicts with mother role)': ({ claim }) => { claim('c0729').value.sex = 'male'; },
    'female not proved': ({ claim }) => {
      claim('c0729').value.sex = 'uncertain';
      Object.assign(claim('c0768').value, { subjectRole: 'parent' }); delete claim('c0768').value.line;
      claim('c0767').value.objectRole = 'child';
    },
    'grandfather link missing': ({ byId }) => drop(byId, 'p030', 'c0767'),
    'intermediary is a different person': ({ claim }) => { claim('c1872').value.intermediaryPersonIds = [P('p028')]; },
  };
  for (const [label, mutate] of Object.entries(cases)) assert.equal(bind('p029', 's0063', q, mutate), false, label);
});

test('maternal uncle negatives (舅): sibling, sexes, line, named uncle, elided subject', () => {
  const q = '依于舅濮陽吳氏';
  for (const quote of ['依于舅', '先適渤海田氏', '生一男而寡']) assert.equal(bind('p094', 's0191', quote), false, quote);
  const cases = {
    'sibling edge missing': ({ byId }) => drop(byId, 'p093', 'c1301'),
    'sibling edge paternal': ({ claim }) => { claim('c1301').value.line = 'paternal'; },
    'sibling edge not citing unit': ({ claim }) => { claim('c1301').evidence = [P('s0192')]; },
    'uncle female': ({ claim }) => { claim('c1299').value.value = 'female'; },
    'intermediary sex conflict': ({ claim }) => { claim('c1303').value.sex = 'male'; },
    'mother not proved female': ({ claim }) => { claim('c1303').value.sex = 'uncertain'; delete claim('c1257').value.kinshipTerm; },
    'mother edge not citing unit': ({ claim }) => { claim('c1257').evidence = [P('s0190')]; },
    'mother edge missing': ({ byId }) => drop(byId, 'p088', 'c1257'),
    'kin edge paternal': ({ claim }) => { claim('c1266').value.line = 'paternal'; },
    'kin edge strongly-inferred': ({ claim }) => { claim('c1266').certainty = 'strongly-inferred'; },
    'intermediary is a different person': ({ claim }) => { claim('c1266').value.intermediaryPersonIds = [P('p090')]; },
    'wrong role on kin edge': ({ claim }) => { claim('c1266').value.objectRole = 'father-in-law'; },
    'uncle unnamed in unit': ({ byId, claim }) => {
      byId.get(P('p093')).mentions = [];
      claim('c0373').evidence = [P('s0192')]; claim('c0374').evidence = [P('s0192')];
    },
    'elided niece without explicit Chinese name': ({ claim }) => { for (const id of ['c0350', 'c0351', 'c0352', 'c0353', 'c0354', 'c0355']) claim(id).certainty = 'strongly-inferred'; },
    'elided niece is not the edge subject': ({ byId }) => {
      const e = byId.get(P('p088')).claims.find(c => c.id === P('c1266'));
      drop(byId, 'p088', 'c1266');
      byId.get(P('p093')).claims.push({ ...e, subject: P('p093'), value: { ...e.value, personId: P('p088'), subjectRole: 'maternal-uncle', objectRole: 'niece' } });
    },
  };
  for (const [label, mutate] of Object.entries(cases)) assert.equal(bind('p094', 's0191', q, mutate), false, label);
});

test('unrelated unnamed relatives with a mentionException do not bind on a co-occurring term', () => {
  // p090 shares s0191 via spouse-of p094 but is no intermediary of any edge.
  assert.equal(bind('p090', 's0191', '依于舅濮陽吳氏', ({ byId }) => {
    const p = byId.get(P('p090'));
    p.mentionException = 'test';
    p.claims = p.claims.filter(c => c.predicate !== 'name');
    p.claims.push({ id: P('cY'), subject: P('p090'), predicate: 'name', value: { kind: 'descriptive-kinship', en: 'x' }, certainty: 'strongly-inferred', evidence: [P('s0191')] });
  }), false);
});

test('actual current Jinshu032 graphs pass native family integration; Shun binds directly',()=>{
 const people=new Map(packet.people.map(p=>[p.localId,p])),units=new Map(packet.units.map(u=>[P(u.id),u.zh]));
 for(const graph of packet.graphs){
  const run=()=>assertDossierPrimaryWitness(graph.witness,people.get(graph.personId),units,localNameKeys,new Map(),people);
  assert.doesNotThrow(run,graph.personId); // A separate spouse helper binds the entailed Tushan mate.
 }
});
