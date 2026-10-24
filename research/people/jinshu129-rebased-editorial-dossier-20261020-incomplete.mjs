// Isolated research dossier: neither an approval nor a canonical edit.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '../../scripts/build-people-editorial-review.mjs';

const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = {
  source: ['data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800'],
  extraction: ['data/people/extractions/jinshu/129.json', '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8'],
  history: ['data/people/editorial-decisions/jinshu/129.json', 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2'],
  evidenceCandidate: ['research/people/jinshu129-evidence-candidate-20261020-incomplete.json', '245bef6e19358f7e470ca1771029bf5d7403bac9c710a7403b3bc2a28c2f5549'],
  previousDossier: ['research/people/jinshu129-editorial-dossier-20261020-incomplete.json', 'eb21af880df5cb092189f9cda11aff1e79d78dd1b00054d09970f97e8128c055'],
};
function load([path, expected]) {
  const bytes = readFileSync(path);
  if (sha(bytes) !== expected) throw new Error(`Unexpected input bytes: ${path}`);
  return JSON.parse(bytes);
}
const source = load(inputs.source);
const prior = load(inputs.extraction);
const history = load(inputs.history);
const evidence = load(inputs.evidenceCandidate);
const previous = load(inputs.previousDossier);
if (evidence.status !== 'research-only-not-approved' || previous.status !== 'research-only-not-approved') throw new Error('Unexpected artifact status');
const packet = buildPeopleExtractionPacket('jinshu', '129', { chapterData: source });
const units = new Map(packet.units.map(unit => [unit.id, unit]));
const checks = [
  ['s0020', '蒙遜引水灌城，城潰，執太守呂純以歸。', 'Mengxun broke the dikes and flooded the walls; the city fell, and he brought back the governor Lü Chun as prisoner.', 'Mengxun diverted water to flood the city; the city fell, and he returned with its governor Lü Chun as a prisoner.', 'The passage says he led water to inundate the city, not that he broke dikes.'],
  ['s0023', '呂弘去張掖，將東走，業議欲擊之。', "When Lü Hong quit Zhangye to flee east, Duan Ye's council urged an attack.", 'When Lü Hong left Zhangye and was about to flee east, Duan Ye considered attacking him.', 'The deliberation is attributed to Ye, not to a council.'],
];
const candidate = structuredClone(evidence.candidate);
for (const [id, zh, before, after, reason] of checks) {
  const unit = units.get(id);
  if (!unit || unit.zh !== zh || unit.en !== before) throw new Error(`Stale source: ${id}`);
  if (candidate.translationRepairs.some(row => row[0] === id && row[1] === 'idiomatic')) throw new Error(`Existing repair: ${id}`);
  const row = [id, 'idiomatic', before, after, reason, 'high', 'proposed'];
  if (!previous.candidate.translationRepairs.some(old => isDeepStrictEqual(old, row))) throw new Error(`Proposal differs from source-reviewed dossier: ${id}`);
  candidate.translationRepairs.push(row);
}
const restored = structuredClone(candidate);
restored.translationRepairs.splice(-checks.length);
if (!isDeepStrictEqual(restored, evidence.candidate)) throw new Error('Unrelated candidate change');
if (!isDeepStrictEqual(evidence.inputByteHashes, { source: inputs.source[1], extraction: inputs.extraction[1], history: inputs.history[1] })) throw new Error('Evidence input mismatch');
if (prior.translationRepairs.length + checks.length !== candidate.translationRepairs.length) throw new Error('Unexpected prior repairs');
const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, result.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '129', packet, extraction: result.normalized }, { context: 2 });
if (dossier.items.length !== checks.length) throw new Error('Unexpected dossier size');
const related = dossier.items.flatMap(item => item.relatedClaims);
const flight = related.filter(claim => claim.subject === 'jinshu:129:p016' && claim.predicate === 'event-participation' && claim.value.action === 'left Zhangye to flee east');
if (flight.length !== 1 || flight[0].id !== 'jinshu:129:c0667') throw new Error('Unexpected rebased flight claim');
const out = {
  status: 'research-only-not-approved',
  inputByteHashes: Object.fromEntries(Object.entries(inputs).map(([name, [path, hash]]) => [name, {path, sha256: hash}])),
  warning: 'Fresh independent review is required. Do not apply prior decisions to these rebased claim IDs. Existing editorial histories and date, identity, catalog, site and ebook evidence must be reconciled against current fingerprints; strict validation is not approval.',
  candidate, dossier, stats: result.stats,
};
const bytes = Buffer.from(`${JSON.stringify(out, null, 2)}\n`);
const destination = 'research/people/jinshu129-rebased-editorial-dossier-20261020-incomplete.json';
writeFileSync(destination, bytes, {flag: 'wx', mode: 0o600});
console.log(`${destination} sha256:${sha(bytes)}; not an approval`);
