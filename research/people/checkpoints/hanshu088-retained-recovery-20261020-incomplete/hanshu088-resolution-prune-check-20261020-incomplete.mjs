// Read-only, staging-version simulation; never writes resolution documents.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const fixture = process.env.PEOPLE_STAGING_FIXTURE;
if (!fixture || !path.isAbsolute(fixture)) throw Error('PEOPLE_STAGING_FIXTURE must be the absolute path to a staging-version script-only fixture');
const { pruneResolutionDocument } = await import(pathToFileURL(path.join(fixture, 'scripts/lib/people-resolution-invalidation.mjs')));
const { getPeopleSchemaValidator } = await import(pathToFileURL(path.join(fixture, 'scripts/lib/people-schema.mjs')));

const ref = 'badf6573cb7ea861bbb244fda4ddb446735740c8';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 50_000_000 });
const prefix = `${ref}:`;
const paths = git('grep', '-l', 'hanshu:088:', ref, '--', 'data/people/resolutions').trim().split('\n').map(s => {
  if (!s.startsWith(prefix)) throw Error(`unexpected git-grep path ${s}`);
  return s.slice(prefix.length);
});
const validate = getPeopleSchemaValidator().getSchema('https://24histories.com/schema/people/resolution-v1.json');
const summary = [];
for (const path of paths) {
  const original = JSON.parse(git('show', `${ref}:${path}`));
  if (!validate(original)) throw Error(`invalid original ${path}: ${JSON.stringify(validate.errors)}`);
  const { document, stats } = pruneResolutionDocument(original, [{ book: 'hanshu', chapter: '088' }]);
  if (!stats.removedReferences) continue; // A match outside localPeople is not pruned.
  if (!validate(document)) throw Error(`invalid pruned ${path}: ${JSON.stringify(validate.errors)}`);
  if (document.decisions.some(d => d.localPeople.some(id => id.startsWith('hanshu:088:')))) throw Error(`stale member remains in ${path}`);
  const untouched = original.decisions.filter(d => !d.localPeople.some(id => id.startsWith('hanshu:088:')));
  const frequencies = values => values.reduce((map, value) => {
    const key = JSON.stringify(value); map.set(key, (map.get(key) ?? 0) + 1); return map;
  }, new Map());
  const available = frequencies(document.decisions);
  for (const [key, count] of frequencies(untouched)) {
    if ((available.get(key) ?? 0) < count) throw Error(`unrelated decision changed in ${path}`);
  }
  const modified = original.decisions.filter(d => d.localPeople.some(id => id.startsWith('hanshu:088:')) && d.localPeople.filter(id => !id.startsWith('hanshu:088:')).length >= 2);
  for (const prior of modified) {
    const expected = {...prior, localPeople: prior.localPeople.filter(id => !id.startsWith('hanshu:088:'))};
    delete expected.canonicalPersonId;
    if (!available.has(JSON.stringify(expected))) throw Error(`unexpected retained decision in ${path}`);
  }
  const modifiedKinds = Object.fromEntries([...new Set(modified.map(d => d.decision))].map(kind => [kind, modified.filter(d => d.decision === kind).length]));
  summary.push({path, ...stats, priorDecisions: original.decisions.length, remainingDecisions: document.decisions.length, empty: document.decisions.length === 0, modifiedWithOtherPeople: modified.length, modifiedKinds});
}
const totals = summary.reduce((a,x) => ({filesChanged:a.filesChanged+1, touchedDecisions:a.touchedDecisions+x.touchedDecisions, removedDecisions:a.removedDecisions+x.removedDecisions, removedReferences:a.removedReferences+x.removedReferences, emptyDocuments:a.emptyDocuments+Number(x.empty), modifiedWithOtherPeople:a.modifiedWithOtherPeople+x.modifiedWithOtherPeople}), {filesChanged:0,touchedDecisions:0,removedDecisions:0,removedReferences:0,emptyDocuments:0,modifiedWithOtherPeople:0});
totals.modifiedKinds = summary.reduce((all, x) => {
  for (const [kind, count] of Object.entries(x.modifiedKinds)) all[kind] = (all[kind] ?? 0) + count;
  return all;
}, {});
console.log(JSON.stringify({ref, rawMatchingDocuments:paths.length, totals, files:summary}, null, 2));
