// Research-only candidate. This does not approve or modify the extraction.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../scripts/lib/people-editorial-decisions.mjs';

const sha = b => createHash('sha256').update(b).digest('hex');
function load(file, expected) {
  const b = readFileSync(file);
  if (sha(b) !== expected) throw Error(`Stale input: ${file}`);
  return JSON.parse(b);
}
const hashes = {
  source: 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800',
  extraction: '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8',
  history: 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2',
};
const source = load('data/jinshu/129.json', hashes.source);
const prior = load('data/people/extractions/jinshu/129.json', hashes.extraction);
const history = load('data/people/editorial-decisions/jinshu/129.json', hashes.history);
const packet = buildPeopleExtractionPacket('jinshu', '129', { chapterData: source });
const before = [
  [41, ['p013', 'sex', {sex:'male'}, 'explicit', ['s0020']], null],
  [44, ['p016', 'sex', {sex:'male'}, 'explicit', ['s0023']], null],
  [124, ['p001','event-participation',{kind:'military',role:'commander',action:'flooded the city, captured Lü Chun',place:{en:'Xijun',zh:'西郡'},otherPersonId:'p013',outcome:'city fell'},'explicit',['s0020']], ['p001','event-participation',{kind:'military',role:'commander',action:'flooded the city, captured Lü Chun',place:{en:'Xijun',zh:'西郡'},otherPersonId:'p013',outcome:'city fell'},'strongly-inferred',['s0016','s0017','s0019','s0020']]],
  [125, ['p013','event-participation',{kind:'military',role:'captured-governor',action:'taken prisoner when Xijun fell',otherPersonId:'p001'},'explicit',['s0020']], ['p013','event-participation',{kind:'military',role:'captured-governor',action:'taken prisoner when Xijun fell',otherPersonId:'p001'},'strongly-inferred',['s0016','s0017','s0019','s0020']]],
  [126, ['p013','office',{title:{en:'Governor of Xijun',zh:'西郡太守'},action:'held',jurisdiction:{en:'Xijun',zh:'西郡'}},'explicit',['s0020']], ['p013','office',{title:{en:'Governor',zh:'太守'},action:'held',jurisdiction:{en:'Xijun',zh:'西郡'}},'strongly-inferred',['s0016','s0017','s0019','s0020']]],
];
for (const [index, expected] of before) {
  if (!isDeepStrictEqual(prior.claims[index], expected)) throw Error(`Stale claim at ${index}`);
}
const candidate = structuredClone(prior);
for (const [index,, after] of [...before].reverse()) {
  if (after === null) candidate.claims.splice(index, 1);
  else candidate.claims[index] = structuredClone(after);
}
const restored = structuredClone(candidate);
for (const [index, original, after] of before) {
  if (after === null) restored.claims.splice(index, 0, structuredClone(original));
  else restored.claims[index] = structuredClone(original);
}
if (!isDeepStrictEqual(restored, prior)) throw Error('Unrelated candidate change');
const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, result.normalized);
const out = {
  status:'research-only-not-approved', inputByteHashes:hashes,
  warning:'Exact candidate requires a separate source and schema review. It changes normalized claim IDs, so the separately reviewed editorial dossier must be reconciled/reviewed again before application. Existing date and identity approvals may become stale.',
  rationale:'Remove two unsupported explicit sex claims without asserting the contrary. The name Xijun is contextual, not printed alongside 太守 in s0020; preserve the contextual identification in three claims with all four narrative citations and strongly-inferred certainty. The office title uses the directly attested 太守. Reviewer must decide whether continuity supports this inference and whether all dependent claims are covered.',
  changes:before.map(([index, oldValue, newValue]) => ({compactIndexBefore:index, before:oldValue, after:newValue})),
  stats:result.stats, candidate,
};
const bytes = Buffer.from(`${JSON.stringify(out, null, 2)}\n`);
const destination = 'research/people/jinshu129-evidence-candidate-20261020-incomplete.json';
writeFileSync(destination, bytes, {flag:'wx',mode:0o600});
console.log(`${destination} sha256:${sha(bytes)}; research candidate only`);
