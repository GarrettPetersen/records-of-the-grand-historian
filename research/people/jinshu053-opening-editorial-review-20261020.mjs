// Isolated, non-blind source review. This script never applies a decision.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import { buildEditorialReviewDossierFromLoaded } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-editorial-review.mjs';
import { validateAppliedEditorialDecisions, validateEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const root = new URL('./', import.meta.url);
const input = new URL('jinshu053-opening-proposed-only-incomplete-20261019/', root);
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, input), 'utf8'));
const sha = (name) => createHash('sha256').update(fs.readFileSync(new URL(name, input))).digest('hex');
const manifest = read('manifest.json');
for (const [name, expected] of Object.entries(manifest.outputSha256)) {
  if (sha(name) !== expected) throw new Error(`Input fingerprint changed: ${name}`);
}
const source = read('source.json');
const candidate = read('candidate.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', {chapterData: source, chapterFile: new URL('source.json', input).pathname});
const extraction = validateCompactPeopleExtraction(candidate, packet).normalized;
validateAppliedEditorialDecisions(read('editorial-history.json'), extraction);
const dossier = buildEditorialReviewDossierFromLoaded('jinshu', {chapterId:'053', packet, extraction});
const seed = structuredClone(dossier.decisionSeed);
const units = new Map(source.content.flatMap((part) => part.sentences ?? []).map((unit) => [unit.id, unit]));
// Findings reflect a fresh read of these exact replacements, informed by a prior
// non-blind review of the underlying proposals; they are not chapter approval.
const reasons = {
  s0008: 'The ruler asks why, and the prince answers that during a sudden nighttime incident the ruler should not be illuminated and revealed; the Chinese does not specify his face.',
  s0013: 'The source compares the crown prince with Emperor Xuan before assembled officials and says his good reputation spread throughout the realm.',
  s0015: 'Jia previously resented the prince’s good reputation and therefore secretly instructed the eunuchs to flatter him and urge indulgence.',
  s0017: 'The favored Lady Jiang gives birth to a son; the others urge generous rewards and many toys, which the prince accepts. No stipends are specified.',
  s0018: 'His arrogant laxity became more evident, he sometimes skipped court attendance and he habitually played in the rear garden.',
  s0020: 'He personally beat whoever offended him; the source does not confine victims to servants.',
  s0021: 'His petty taboos barred repairing walls, setting tiles and disturbing the building; the proposal restores the final clause without inventing builders.',
  s0022: 'He set up a market, had other people butcher and sell liquor, and estimated weights by hand; there is no coin weighing or personal butchery.',
  s0023: 'His mother was a daughter of a butcher household; the source does not state that her own occupation was butchery.',
  s0028: 'In anger the prince had another person place needles in Du Xi’s felt mat to prick him; the source neither makes him place them himself nor specifies sewing.',
  s0034: 'Guo Huai is Jia’s mother and wants Han Shou’s daughter as crown princess; the crown prince wants the Han marriage to strengthen his position.',
  s0035: 'Jia Wu and the empress refuse the Han marriage and arrange the betrothal to Wang Yan’s younger daughter Huifeng; no completed marriage or name type is asserted.',
  s0041: 'The empress accepted the speaker’s words and spread reports of the prince’s faults; this does not itself establish she adopted a specific plot.',
  s0042: 'People at court and in the country knew she meant to harm the crown prince; the wording does not specify a plan to kill him.',
  s0044: 'The mulberry appeared at the western palace wing in the sixth month of year nine, grew over a chi daily, and withered after several days.',
  s0046: 'When he arrived the empress did not receive him, placed him separately, sent Chen Wu with wine and jujubes, and pressed him to drink until drunk.',
  s0056: 'The prince was too drunk and confused to understand, copied the draft and left half the characters unformed; childish strokes are not stated.',
  s0057: 'Afterward the incomplete writing was filled in and the empress presented it to the emperor; the agent of completion is not stated.',
  s0059: 'The document was shown to the princes and officials; only Zhang Hua and Pei Wei spoke to defend or attest for the prince. This does not independently prove innocence.',
  s0062: 'The empress feared a change of events, memorialized to reduce him to commoner status, and received imperial approval by edict.',
  s0066: 'In the first month of the next year Jia caused a Yellow Gate attendant to confess he meant to rebel with the crown prince.',
  s0067: 'The edict circulated the attendant’s confession among dukes and ministers; it does not state that the whole city read it.',
  s0073: 'The consort’s father Wang Yan submitted a memorial requesting a divorce when the crown prince was deposed; the source does not establish a completed divorce.',
};
seed.reviewer = {kind:'codex', name:'Codex editorial reviewer /root/editorial_back (non-blind)', model:null, agentId:'/root/editorial_back', runId:null, completedAt:new Date().toISOString()};
seed.decisions = seed.proposals.map((proposal) => {
  const unit = units.get(proposal.unit.id);
  const reason = reasons[proposal.unit.id];
  if (!unit || !reason) throw new Error(`Unreviewed proposal ${proposal.id}`);
  return {repairId:proposal.id, decision:'accept', after:null, reason, sourceWitness:{source:'chapter-text', citation:`jinshu:053:${proposal.unit.id}`, excerpt:unit.zh}};
});
validateEditorialDecisions(seed, extraction, packet);
const outputs = [
  ['jinshu053-opening-editorial-dossier-20261020-incomplete.json', dossier],
  ['jinshu053-opening-editorial-seed-20261020-incomplete.json', dossier.decisionSeed],
  ['jinshu053-opening-editorial-decisions-20261020-incomplete.json', seed],
];
for (const [name] of outputs) if (fs.existsSync(new URL(name, root))) throw new Error(`Refusing to overwrite ${name}`);
for (const [name, value] of outputs) fs.writeFileSync(new URL(name, root), JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({validated:true, priorHistoryValidated:true, proposed:seed.proposals.length, accepted:seed.decisions.length, chapterFingerprint:seed.input.chapterFingerprint, proposalsFingerprint:seed.input.proposalsFingerprint, artifacts:outputs.map(([name])=>name), nonBlind:true, canonicalWrites:false}));
