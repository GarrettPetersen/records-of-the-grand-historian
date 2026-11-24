import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import {inferredSpouseWitness} from './lib/people-inferred-spouse-witness.mjs';
const {assertDossierPrimaryWitness} = await import(pathToFileURL(path.resolve('scripts/lib/people-identity-dossiers.mjs')));
const {localNameKeys} = await import(pathToFileURL(path.resolve('scripts/lib/people-resolution.mjs')));
const fixture = JSON.parse(fs.readFileSync(new URL('./fixtures/jinshu032-spouse-witness.json', import.meta.url)));
const sourceId = 'jinshu:032:s0272', text = fixture.unit.zh;
function context(change = () => {}) {
  const people = structuredClone(fixture.people), byId = new Map(people.map(p => [p.localId,p]));
  const target = byId.get('jinshu:032:p157'), relative = byId.get('jinshu:032:p156');
  const edge = relative.claims.find(c => c.predicate === 'family-relationship');
  const ctx = {people,byId,target,relative,edge,quote:text,text,sourceId};
  change(ctx);return ctx;
}
const names = sourceId => person => person.claims.filter(c => c.predicate === 'name' && c.evidence.includes(sourceId) && c.value.zh).map(c => c.value.zh);
const normalize = s => s.normalize('NFKC');
function bind(change) {
  const c = context(change);
  return inferredSpouseWitness(c.target,c.sourceId,c.quote,c.text,c.byId,names(c.sourceId),normalize);
}
function native(change) {
  const c = context(change);
  return assertDossierPrimaryWitness({localId:c.target.localId,book:'jinshu',chapter:'032',unitId:'s0272',quote:c.quote},c.target,new Map([[sourceId,c.text]]),localNameKeys,new Map(),c.byId);
}
test('actual entailed mate binds to exact named-endpoint spouse clause', () => {
  assert.equal(bind(),true);assert.doesNotThrow(() => native());
});
test('a bounded exact source clause suffices without inventing a Chinese name', () => {
  assert.equal(bind(c => {c.quote='塗山作儷';}),true);
  assert.doesNotThrow(() => native(c => {c.quote='塗山作儷';}));
});
for (const [label,change] of [
  ['absent source exception',c => {delete c.target.mentionException;}],
  ['direct Chinese attribution',c => {c.target.mentions[0].spans.zh=[{exact:'禹'}];}],
  ['asserted Chinese name',c => {c.target.claims.find(x=>x.predicate==='name').value.zh='禹';}],
  ['explicit inferred identity',c => {c.target.claims.find(x=>x.predicate==='name').certainty='explicit';}],
  ['wrong target',c => {c.edge.value.personId='jinshu:032:p158';}],
  ['wrong relationship',c => {c.edge.value.relation='parent-of';}],
  ['inferred relationship',c => {c.edge.certainty='strongly-inferred';}],
  ['wrong claim subject',c => {c.edge.subject=c.target.localId;}],
  ['wrong source evidence',c => {c.edge.evidence=['jinshu:032:s0273'];}],
  ['wrong source unit',c => {c.sourceId='jinshu:032:s0273';}],
  ['wrong term',c => {c.edge.value.kinshipTerm.zh='夫';}],
  ['wrong union category',c => {c.edge.value.unionCategory='concubinage';}],
  ['incompatible source roles',c => {c.edge.value.objectRole='son';}],
  ['missing source endpoint name',c => {c.relative.claims.find(x=>x.predicate==='name').evidence=['jinshu:032:s0001'];}],
  ['bare kinship word',c => {c.quote='作儷';}],
  ['invented quote',c => {c.quote='塗山之夫禹';}],
  ['named endpoint absent from quote',c => {c.quote='而夏族以熙';}],
  ['unrelated supplied endpoint',c => {c.relative.claims.find(x=>x.predicate==='name').value.zh='他人';}],
  ['ambiguous duplicate edge',c => {c.relative.claims.push(structuredClone(c.edge));}],
  ['cross-chapter target',c => {c.target.localId='jinshu:033:p157';c.edge.value.personId=c.target.localId;}],
]) test('rejects '+label, () => assert.equal(bind(change),false));
test('native binder still rejects a bare term and invented Yu Chinese quote', () => {
  assert.throws(() => native(c => {c.quote='作儷';}),/does not support/);
  assert.throws(() => native(c => {c.quote='禹';}),/does not support/);
});
test('source relationship may bind individuality without identifying the English name', () => {
  assert.equal(bind(c => {c.target.claims.find(x=>x.predicate==='name').value.en='Unnamed spouse';c.target.preferredNameSuggestion.en='Unnamed spouse';}),true);
});
