import test from 'node:test';
import assert from 'node:assert/strict';
import {inferredPaternalWitness} from './lib/people-inferred-paternal-witness.mjs';

function fixture(kind = 'uncle', reverse = false) {
  const sourceId = 'fixture:001:s0001';
  const ids = Object.fromEntries(['father', 'child', 'uncle', 'cousin'].map((key, i) => [key, `fixture:001:p00${i+1}`]));
  const people = new Map(Object.values(ids).map(localId => [localId, {localId, claims: [], mentions: []}]));
  const p = key => people.get(ids[key]);
  const claim = (key, predicate, value, certainty = 'strongly-inferred') => p(key).claims.push({subject:ids[key], predicate, value, certainty, evidence:[sourceId]});
  p('father').mentionException = 'Unnamed father entailed by the source kinship.';
  claim('father', 'name', {kind:'descriptive-kinship', en:'Father of the narrative subject'});
  claim('father', 'attestation', {event:'Source individuates an unnamed father.'});
  claim('uncle', 'name', {kind:'personal', zh:'羅仇'}, 'explicit');
  claim('cousin', 'name', {kind:'personal', zh:'成都'}, 'explicit');
  const parent = {relation:'parent-of', personId:ids.child, kinshipTerm:{zh:'父'}, line:'paternal', subjectRole:'father', objectRole:'son'};
  if (reverse) claim('child', 'family-relationship', {...parent, relation:'child-of', personId:ids.father, subjectRole:'son', objectRole:'father'});
  else claim('father', 'family-relationship', parent);
  claim('father', 'family-relationship', {relation:'sibling-of', personId:ids.uncle, line:'paternal', sharedParentage:'uncertain', subjectRelativeAge:kind === 'younger-uncle' ? 'elder' : 'younger'});
  let text;
  if (kind === 'cousin') {
    text = '以從弟成都為金山太守，羅仇子也；';
    claim('child', 'family-relationship', {relation:'kin-of', personId:ids.cousin, kinshipTerm:{zh:'從弟'}, line:'paternal'}, 'explicit');
    claim('uncle', 'family-relationship', {relation:'parent-of', personId:ids.cousin, kinshipTerm:{zh:'子'}, line:'paternal', subjectRole:'father', objectRole:'son'}, 'explicit');
  } else {
    const term = kind === 'younger-uncle' ? '叔父' : '伯父';
    text = `會${term}羅仇從軍。`;
    claim(reverse ? 'uncle' : 'child', 'family-relationship', {relation:'kin-of', personId:reverse ? ids.child : ids.uncle, kinshipTerm:{zh:term}, line:'paternal', intermediaryPersonIds:[ids.father]}, 'explicit');
  }
  const f = {sourceId, ids, people, father:p('father'), text, quote:text};
  f.run = () => inferredPaternalWitness(f.father, f.sourceId, f.quote, f.text, f.people,
    (person, quote) => person.claims.some(c => c.predicate === 'name' && c.evidence.includes(sourceId) && c.value.zh && quote.includes(c.value.zh)));
  return f;
}

test('paternal uncle graphs bind an unnamed father with either edge orientation and parent direction', () => {
  for (const kind of ['uncle', 'younger-uncle']) for (const reverse of [false, true]) assert.equal(fixture(kind, reverse).run(), true);
});
test('named paternal cousin and his named father bind the other unnamed father', () => {
  assert.equal(fixture('cousin').run(), true);
});
test('the quote and every required relationship stay bound to the same source unit', () => {
  for (const kind of ['uncle', 'cousin']) for (const mutate of [
    f => {f.quote = '不存在';},
    f => {f.quote = '羅仇';},
    f => {f.father.claims.find(c => c.predicate === 'attestation').evidence = ['fixture:001:s0002'];},
    f => {f.father.claims.find(c => c.predicate === 'family-relationship' && c.value.relation === 'parent-of').evidence = ['fixture:001:s0002'];},
    f => {f.father.claims.find(c => c.value.relation === 'sibling-of').value.line = 'maternal';},
    f => {f.people.get(f.ids.uncle).claims[0].evidence = ['fixture:001:s0002'];},
    f => {f.people.delete(f.ids.uncle);},
    f => {delete f.father.mentionException;},
    f => {f.father.mentions = [{unit:{id:'s0001'}}];},
    f => {f.father.claims[0].value.kind = 'personal';},
    f => {f.father.claims[0].certainty = 'explicit';},
  ]) {const f = fixture(kind); mutate(f); assert.equal(f.run(), false);}
});
test('a paternal-uncle shortcut cannot substitute another intermediary or reverse the age evidence', () => {
  for (const mutate of [
    f => {f.people.get(f.ids.child).claims[0].value.intermediaryPersonIds = [f.ids.cousin];},
    f => {f.people.get(f.ids.child).claims[0].value.intermediaryPersonIds.push(f.ids.cousin);},
    f => {f.people.get(f.ids.child).claims[0].certainty = 'strongly-inferred';},
    f => {f.people.get(f.ids.child).claims[0].value.kinshipTerm.zh = '舅';},
    f => {f.father.claims.find(c => c.value.relation === 'sibling-of').value.subjectRelativeAge = 'elder';},
  ]) {const f = fixture(); mutate(f); assert.equal(f.run(), false);}
});
test('a cousin graph requires the named cousin, his explicit father and the fathers sibling edge', () => {
  for (const mutate of [
    f => {f.people.get(f.ids.cousin).claims[0].evidence = ['fixture:001:s0002'];},
    f => {f.people.get(f.ids.uncle).claims[1].certainty = 'strongly-inferred';},
    f => {f.people.get(f.ids.uncle).claims[1].value.personId = f.ids.child;},
    f => {f.people.get(f.ids.child).claims[0].value.line = 'maternal';},
    f => {f.people.get(f.ids.child).claims[0].value.kinshipTerm.zh = '表弟';},
    f => {f.father.claims = f.father.claims.filter(c => c.value.relation !== 'sibling-of');},
  ]) {const f = fixture('cousin'); mutate(f); assert.equal(f.run(), false);}
});
