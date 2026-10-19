// Research-only local simulation; no canonical extraction, resolver document, or queue is written.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { getPeopleSchemaValidator } from '../../../../scripts/lib/people-schema.mjs';
import { resolvePeopleClusters } from '../../../../scripts/lib/people-resolution.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function input(file, expected) {
  const bytes = fs.readFileSync(path.join(dir, file));
  if (sha(bytes) !== expected) throw new Error(`stale input ${file}`);
  return JSON.parse(bytes);
}
const sourceFile = 'jinshu127-s0177-two-dates-reconciled-20261020-incomplete/jinshu/127.json';
const extractionFile = 'jinshu127-p141-hint-proposal-20261020-incomplete/candidate-extraction.json';
const sourceHash = 'cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264';
const extractionHash = '5f5e8325fd88a44c682cfa3ae475aad26df0841f0b39878b6e478691cf5b3fc8';
const source = input(sourceFile, sourceHash), compact = input(extractionFile, extractionHash);
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: path.join(dir, sourceFile) });
const validated = validateCompactPeopleExtraction(compact, packet, { strictAliasDispositions: true });
const extraction = validated.normalized;
const ids = ['p001', 'p020', 'p045', 'p066', 'p078', 'p114', 'p154'].map(id => `jinshu:127:${id}`);
const wanted = new Set(ids);
const people = new Map(extraction.people.map(p => [p.localId, {
  ...p, book: extraction.book, chapter: extraction.chapter, promptVersion: extraction.run.promptVersion,
  claims: extraction.claims.filter(c => c.subject === p.localId),
  mentions: extraction.mentions.filter(m => m.person === p.localId),
}]));
if (ids.some(id => !people.has(id))) throw new Error('missing expected person');
const proposal = {
  schemaVersion: 1, batch: 'research-jinshu127-murong-de-20261020-incomplete', authority: 'model',
  decisions: [{ decision: 'merge', localPeople: ids, basis: ['same-name', 'continuous-biography'], confidence: 'high', notes: ['Research-only proposal; separate independent decision and full-corpus identity gates required.'] }],
};
const schema = getPeopleSchemaValidator().getSchema('https://24histories.com/schema/people/resolution-v1.json');
if (!schema(proposal)) throw new Error(`invalid decision schema: ${JSON.stringify(schema.errors)}`);
const before = resolvePeopleClusters(people, []), after = resolvePeopleClusters(people, [proposal]);
const selected = after.clusters.filter(c => c.localPeople.some(id => wanted.has(id)));
if (selected.length !== 1 || !isDeepStrictEqual(selected[0].localPeople, [...ids].sort())) throw new Error('unexpected merged cluster');
const others = result => result.clusters.filter(c => !c.localPeople.some(id => wanted.has(id)));
if (!isDeepStrictEqual(others(before), others(after))) throw new Error('unrelated chapter-local cluster changed');
const refPaths = [];
function visit(v, current) {
  if (typeof v === 'string' && wanted.has(v)) refPaths.push({ path: current, person: v });
  else if (Array.isArray(v)) v.forEach((item, i) => visit(item, `${current}[${i}]`));
  else if (v && typeof v === 'object') Object.entries(v).forEach(([key, value]) => visit(value, `${current}.${key}`));
}
visit(extraction, '$');
const snapshot = Object.fromEntries(ids.map(id => [id, people.get(id)]));
const report = {
  status: 'research-only-local-simulation-not-approved', sourceFile, sourceHash, extractionFile, extractionHash,
  limits: ['No canonical or proposed extraction data was changed.', 'Scope is only the 165 local people of this one extraction: it does not load current full-corpus decisions, constraints, redirects, candidate blocks or name overrides.', 'Strict extraction validation is not an identity audit or evidence of chronology correctness.', 'Resolution proposal requires separate reviewer and production fingerprint-pinned identity gate before use.'],
  strictExtractionStats: validated.stats, unchangedExtraction: true, beforeClusters: before.clusters.filter(c => c.localPeople.some(id => wanted.has(id)),), afterCluster: selected[0],
  counts: { people: ids.length, mentions: extraction.mentions.filter(m => wanted.has(m.person)).length, subjectClaims: extraction.claims.filter(c => wanted.has(c.subject)).length, allMatchingReferencePaths: refPaths.length },
  subjectSnapshots: snapshot, matchingReferencePaths: refPaths,
};
const output = { 'jinshu127-murong-de-resolution-proposal-20261020-incomplete.json': proposal, 'jinshu127-murong-de-resolution-delta-20261020-incomplete.json': report };
for (const [name, value] of Object.entries(output)) {
  const target = path.join(dir, name), bytes = `${JSON.stringify(value, null, 2)}\n`;
  if (fs.existsSync(target)) {
    if (fs.readFileSync(target, 'utf8') !== bytes) throw new Error(`existing artifact differs; refusing overwrite ${name}`);
  } else fs.writeFileSync(target, bytes, { flag: 'wx', mode: 0o600 });
}
console.log(JSON.stringify({ stats: validated.stats, counts: report.counts, before: report.beforeClusters.length, after: report.afterCluster, output: Object.keys(output) }, null, 2));
