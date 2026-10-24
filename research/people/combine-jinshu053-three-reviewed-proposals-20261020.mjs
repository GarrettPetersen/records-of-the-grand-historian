import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { validateAppliedEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import { buildEditorialReviewDossierFromLoaded } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';

const root = 'data/people/generated/jinshu-identity-ref-64521198-20261018';
const output = `${root}/jinshu053-three-review-merged-proposed-v1-incomplete-20261020`;
const base = 'jinshu053-real-letter-p056-v1-incomplete-20261020';
const lanes = [
  { name:'combined', extraction:'jinshu053-combined-proposed-only-v1-incomplete-20261020/proposed-extraction.json', dossier:'jinshu053-combined-proposed-only-v1-incomplete-20261020/dossier.json', decisions:'jinshu053-combined-proposed-only-v1-incomplete-20261020/independent-editorial-decisions-release-state-20261020.json' },
  { name:'ending', extraction:'jinshu053-ending-proposed-only-incomplete-20261020/candidate.json', dossier:'jinshu053-ending-editorial-dossier-20261020-incomplete.json', decisions:'jinshu053-ending-editorial-decisions-20261020-incomplete.json' },
  { name:'rong', extraction:'jinshu053-rong-p056-proposed-v1-incomplete-20261020/candidate.json', dossier:'jinshu053-rong-p056-proposed-v1-incomplete-20261020/dossier.json', decisions:'jinshu053-rong-p056-independent-decisions-20261020-incomplete.json' },
];
const sha = data => createHash('sha256').update(data).digest('hex');
const pins = {};
function read(path) { const bytes = fs.readFileSync(`${root}/${path}`); pins[path] = sha(bytes); return JSON.parse(bytes); }
const source = read(`${base}/source.json`);
const original = read(`${base}/candidate.json`);
const history = read(`${base}/editorial-history.json`);
assert.equal(original.translationRepairs.length,14);
assert.ok(original.translationRepairs.every(row => row[6] === 'applied'));
const selected = new Map();
const holds = [];
const overlaps = [];
for (const lane of lanes) {
  const extraction = read(lane.extraction);
  const dossier = read(lane.dossier);
  const review = read(lane.decisions);
  const lanePacket = buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
  const laneValidated = validateCompactPeopleExtraction(extraction,lanePacket,{strictAliasDispositions:true});
  const laneDossier = buildEditorialReviewDossierFromLoaded('jinshu',{chapterId:'053',packet:lanePacket,extraction:laneValidated.normalized},{context:2});
  assert.deepEqual(review.input,laneDossier.decisionSeed.input);
  if (dossier.decisionSeed) assert.deepEqual(dossier.decisionSeed.input,laneDossier.decisionSeed.input);
  assert.deepEqual(extraction.translationRepairs.slice(0,14),original.translationRepairs);
  for (const field of ['people','claims','surfaces','candidateDispositions']) assert.deepEqual(extraction[field],original[field]);
  const byId = new Map(review.decisions.map(d => [d.repairId,d]));
  assert.equal(byId.size,review.proposals.length);
  for (const proposal of review.proposals) {
    const decision = byId.get(proposal.id);
    assert.ok(decision);
    const key = `${proposal.unit.id}/${proposal.field}`;
    const row = extraction.translationRepairs.find(r => r[0] === proposal.unit.id && r[1] === proposal.field && r[6] === 'proposed');
    assert.ok(row,key);
    assert.equal(row[2],proposal.before);
    assert.equal(row[3],proposal.after);
    const provenance = {lane:lane.name,repairId:proposal.id,key,decision:decision.decision,reason:decision.reason,review:lane.decisions,reviewFingerprint:review.input,sourceWitness:decision.sourceWitness};
    if (decision.decision === 'reject') { holds.push({...provenance,before:row[2],after:row[3]}); continue; }
    assert.ok(['accept','revise'].includes(decision.decision));
    const after = decision.decision === 'revise' ? decision.after : proposal.after;
    assert.ok(typeof after === 'string' && after.length);
    if (selected.has(key)) {
      assert.equal(lane.name,'rong',`unanticipated collision: ${key}`);
      assert.ok(['s0108/literal','s0108/idiomatic','s0111/literal','s0179/literal','s0179/idiomatic','s0183/literal'].includes(key),key);
      const prior = selected.get(key);
      assert.ok(prior.row[3].includes('Lun, Prince of Zhao'),key);
      overlaps.push({key,selected:prior.provenance,alsoReviewed:provenance,discardedNarrowerAfter:after,reason:'The broader independently accepted field includes the same title-name correction and additional reviewed changes; the narrow approval does not approve those additional changes.'});
      continue;
    }
    selected.set(key,{row:[row[0],row[1],row[2],after,row[4],row[5],'proposed'],provenance});
  }
}
assert.equal(selected.size,98);
assert.equal(overlaps.length,6);
assert.equal(holds.length,28);
const candidate = structuredClone(original);
candidate.translationRepairs.push(...[...selected.values()].map(entry=>entry.row));
const packet = buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
const validated = validateCompactPeopleExtraction(candidate,packet,{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,validated.normalized);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu',{chapterId:'053',packet,extraction:validated.normalized},{context:2});
assert.equal(dossier.items.length,98);
assert.ok(dossier.decisionSeed.decisions.every(d => d.reason === '' && d.sourceWitness === null));
const ids = new Set();
for (const item of dossier.items) {
  const proposal = item.proposal;
  const entry = selected.get(`${proposal.unit.id}/${proposal.field}`);
  assert.ok(entry);
  assert.equal(entry.row[3],proposal.after);
  assert.ok(!ids.has(proposal.id)); ids.add(proposal.id);
  entry.provenance.newRepairId = proposal.id;
}
const files = {
  'source.json':source,
  'original-extraction.json':original,
  'editorial-history.json':history,
  'proposed-extraction.json':candidate,
  'dossier.json':dossier,
  'decision-seed.json':dossier.decisionSeed,
  'provenance-and-holds.json':{status:'INCOMPLETE research only. Old decisions do not approve this dossier.',selected:[...selected.values()].map(x=>x.provenance),overlaps,holds,additionalEarlierHolds:'See jinshu053-combined-proposed-only-v1-incomplete-20261020/provenance-and-holds.json for five previously rejected opening/letter proposals.'},
};
const encoded = Object.fromEntries(Object.entries(files).map(([name,value])=>[name,Buffer.from(`${JSON.stringify(value,null,2)}\n`)]));
const manifest = {status:'INCOMPLETE proposed edits only; independent review of the new fingerprint and reconciliation are required before application.', inputSha256:pins,outputSha256:Object.fromEntries(Object.entries(encoded).map(([name,bytes])=>[name,sha(bytes)])),fingerprints:dossier.decisionSeed.input,priorApplied:14,proposals:98,overlaps:6,held:28,stats:validated.stats,caveats:'The accepted broader proposals are preferred only as new proposals. No old editorial approval is transferred. Review unresolved lacuna, quotation boundaries, person mentions and relationships. Reconcile source/extraction changes, date reports and identity decisions; no closure or publication is implied.',validation:'Staging-pinned strict compact validator and real applied editorial-history validator, unchanged source.'};
assert.ok(!fs.existsSync(output),'refusing overwrite');
fs.mkdirSync(output);
for (const [name,bytes] of Object.entries(encoded)) fs.writeFileSync(`${output}/${name}`,bytes,{flag:'wx'});
fs.writeFileSync(`${output}/manifest.json`,`${JSON.stringify(manifest,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify({output,...manifest},null,2));
