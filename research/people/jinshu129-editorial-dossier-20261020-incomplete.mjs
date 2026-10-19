// Reproducible research-only proposal. Never changes canonical or retained work.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '../../scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '../../scripts/build-people-editorial-review.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = (file, expected) => {
  const bytes = readFileSync(file);
  if (hash(bytes) !== expected) throw new Error(`Unexpected input bytes: ${file}`);
  return JSON.parse(bytes);
};
const source = read('data/jinshu/129.json', 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800');
const prior = read('data/people/extractions/jinshu/129.json', '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8');
const history = read('data/people/editorial-decisions/jinshu/129.json', 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2');
const packet = buildPeopleExtractionPacket('jinshu', '129', { chapterData: source });
const units = new Map(packet.units.map(unit => [unit.id, unit]));
const checks = [
  ['s0020', '蒙遜引水灌城，城潰，執太守呂純以歸。', 'Mengxun broke the dikes and flooded the walls; the city fell, and he brought back the governor Lü Chun as prisoner.', 'Mengxun diverted water to flood the city; the city fell, and he returned with its governor Lü Chun as a prisoner.', 'The passage says he led water to inundate the city, not that he broke dikes.'],
  ['s0023', '呂弘去張掖，將東走，業議欲擊之。', "When Lü Hong quit Zhangye to flee east, Duan Ye's council urged an attack.", 'When Lü Hong left Zhangye and was about to flee east, Duan Ye considered attacking him.', 'The deliberation is attributed to Ye, not to a council.'],
];
const candidate = structuredClone(prior);
for (const [id, zh, before, after, reason] of checks) {
  const unit = units.get(id);
  if (!unit || unit.zh !== zh || unit.en !== before) throw new Error(`Stale source or translation: ${id}`);
  if (candidate.translationRepairs.some(row => row[0] === id && row[1] === 'idiomatic')) throw new Error(`Existing repair: ${id}`);
  candidate.translationRepairs.push([id, 'idiomatic', before, after, reason, 'high', 'proposed']);
}
const restored = structuredClone(candidate);
restored.translationRepairs.splice(-checks.length);
if (!isDeepStrictEqual(restored, prior)) throw new Error('Unrelated extraction changes');
const result = validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true });
validateAppliedEditorialDecisions(history, result.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', { chapterId: '129', packet, extraction: result.normalized }, { context: 2 });
if (dossier.items.length !== checks.length) throw new Error('Unexpected dossier size');
const out = { status: 'research-only-not-approved', inputByteHashes: {
  source: 'bedaced1b8cef6cbf8d58b36da74cc4489239c8f334859fde55274b3c7f51800',
  extraction: '91033bab08be1f721318130516b97bfddebf198272c6495cb5a03e8593204dd8',
  history: 'ff5170c7fefc5542092c0c7be0955f069c04bc60c642d52868e3fd2a5b3fe4e2',
}, candidate, dossier, stats: result.stats };
const bytes = Buffer.from(`${JSON.stringify(out, null, 2)}\n`);
const destination = 'research/people/jinshu129-editorial-dossier-20261020-incomplete.json';
writeFileSync(destination, bytes, { flag: 'wx', mode: 0o600 });
console.log(`${destination} sha256:${hash(bytes)}; not an approval`);
