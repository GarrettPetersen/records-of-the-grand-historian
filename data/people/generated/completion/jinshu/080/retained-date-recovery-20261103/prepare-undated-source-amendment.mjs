import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket, unresolvedDateAuditItems } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal, dateRepairDifference, revisePendingDateRepair } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-workflow.mjs';
import { hasConcreteWesternChronology } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-date-values.mjs';
import { buildPeopleExtractionPacket } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
import { loadProperNounMatcher } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import { editorialDecisionPath, validateAppliedEditorialDecisions } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';

// Host-authored source representation repair, not an independent approval.
// Every changed row remains in the complete independent date audit.
const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const directory = root + '/data/people/generated/date-workflow/jinshu/080';
const artifacts = root + '/data/people/generated/completion/jinshu/080/retained-date-recovery-20261103';
const read = file => JSON.parse(fs.readFileSync(file));
const need = (ok, message) => { if (!ok) throw new Error(message); };
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const apply = process.argv[2] === '--apply';
need(process.argv.length === (apply ? 3 : 2), 'Use no arguments to preview, or --apply to stage the exact saved proposal');
need(!inspectLocalDisk(root).errors.length, 'Host resource guard rejected source preparation');
const state = read(directory + '/state.json');
need(state.phase === 'reaudit' && state.round === 1 && !state.circuitBreaker, 'Only the retained, unreviewed first repair candidate can be amended here');
need(!Object.keys(state.jobs).some(key => key.startsWith('reaudit-1-')), 'Independent review already owns this candidate');
const source = read(directory + '/' + state.candidate);
const packet = buildDateAuditPacket('jinshu', '080', { extraction: source });
const baseline = buildDateAuditPacket('jinshu', '080');
need(baseline.sourceHash === state.sourceHash && baseline.extractionHash === state.extractionHash, 'Canonical inputs changed');
const old = read(artifacts + '/candidate-5-focused-unresolved-work-order.json');
const priorByHash = new Map(old.items.map(item => [item.claimHash, item]));
need(priorByHash.size === old.items.length && old.sourceHash === packet.sourceHash, 'Ambiguous or stale primary evidence');
const descriptions = new Map([
  ['claim-156', 'Wang Zheng is identified as Gentleman of the Masters of Writing; the chapter states no calendar year for this office.'],
  ['claim-163', 'Ruan Yu grouped Wang Cheng, Wang Xizhi and Wang Yue as the three young men of the Wang clan; the naming is not assigned a calendar year.'],
  ['claim-164', 'Ruan Yu grouped Wang Yue, Wang Xizhi and Wang Cheng as the three young men of the Wang clan; the naming is not assigned a calendar year.'],
  ['claim-211', 'At a time of famine in the eastern region, Wang Xizhi opened granaries to give relief and loans; no calendar year for that famine is stated.'],
  ['claim-231', 'Xie An also resided in Kuaiji before entering office; the source gives this relative status, not a calendar year.'],
  ['claim-233', 'Xie An also lived in Kuaiji before entering office; the chapter supplies no calendar year for this residence.'],
  ['claim-234', 'The passage identifies Xie An as not yet in office during his residence in Kuaiji; that relative status is retained without an invented year.'],
  ['claim-480', 'Dai Kui was in Shan when Wang Huizhi thought of him during a snowy moonlit night and travelled by boat to visit; no calendar year is stated.'],
  ['claim-481', 'Wang Xianzhi read the Gao Shi Zhuan Zan at night with his elder brother Wang Huizhi and praised Jing Dan; no calendar year is stated.'],
  ['claim-520', 'Dai Kui was in Shan during Wang Huizhi\'s overnight boat journey to visit him; the passage states no calendar year for this stay.'],
  ['claim-543', 'Wang Xizhi died at the stated traditional age of fifty-nine. This chapter supplies no calendar year for his death; none of the previously noted competing later-date reconstructions is adopted.'],
  ['claim-544', 'The posthumous honor follows the report of Wang Xizhi\'s death at age fifty-nine in the same sentence; the chapter states no calendar year and no later reconstruction is adopted.'],
  ['claim-545', 'After Wang Xizhi\'s death and the offered honor, his sons followed his prior wishes and firmly declined it; this sequence is retained without a calendar year.'],
  ['claim-628', 'Wang Huizhi later became Palace Attendant, before leaving office and returning east; the office is given in narrative order without a calendar year.'],
  ['claim-629', 'After becoming Palace Attendant, Wang Huizhi abandoned the office and returned east; the source gives this relative order without a calendar year.'],
  ['claim-668', 'Wang Xianzhi was learning calligraphy at the stated age of seven or eight when Wang Xizhi secretly tried to pull his brush away; this age does not supply a calendar year.'],
  ['claim-670', 'Wang Huizhi later became Palace Attendant and left office to return east. He and Wang Xianzhi were gravely ill; Xianzhi died shortly afterwards, and Huizhi died over a month later. These relative statements do not supply an independent calendar year; the separate dated death claims remain unchanged.'],
  ['claim-676', 'While Wang Xianzhi was learning calligraphy at age seven or eight, his father Wang Xizhi secretly tried to pull the brush away and could not; this is not a statement of Wang Xizhi\'s age or a calendar year.'],
  ['claim-677', 'Huan Wen once asked Wang Xianzhi to write on a fan; the source supplies no calendar year for this episode.'],
  ['claim-678', 'Wang Xianzhi was selected to marry the Princess of Xin\'an after the narrated sequence of offices; the chapter gives no calendar year for the marriage.'],
  ['claim-691', 'Wang Huizhi and Wang Xianzhi were both gravely ill after Huizhi left office and returned east; the narrative later reports Xianzhi\'s death and Huizhi\'s death over a month afterwards, without stating a year in this sentence.'],
  ['claim-976', 'Wang Huizhi recited Zuo Si\'s Zhaoyin poems during the undated snowy-night episode; this is a later reference to Zuo Si, not a date of Zuo Si\'s activity.'],
  ['claim-977', 'Wang Xianzhi praised Jing Dan while reading with Wang Huizhi during an undated night; this is later reception, not a date of Jing Dan\'s activity.'],
  ['claim-978', 'Wang Huizhi compared Sima Xiangru, called Changqing, in his reply during the undated reading; no calendar year or life activity for Xiangru is asserted.'],
  ['claim-979', 'Wang Xianzhi named Xun Can, called Xun Fengqian, as the distant exemplar in his expression of shame; the comparison has no stated calendar year and is not Xun Can\'s activity.'],
  ['claim-980', 'Wang Xianzhi named Liu Tan, called Liu Zhenchang, as the near exemplar in his expression of shame; the comparison has no stated calendar year and is not Liu Tan\'s activity.'],
]);
const cases = [];
const changes = unresolvedDateAuditItems(packet).map(item => {
  const previous = priorByHash.get(item.claimHash);
  need(previous && descriptions.has(previous.id), 'New unresolved evidence needs separate research: ' + item.id);
  need(!hasConcreteWesternChronology(item.value), 'Do not withdraw a concrete Western date under this source-only repair');
  const before = source.claims[item.claimIndex], after = structuredClone(before);
  const description = descriptions.get(previous.id);
  const value = after[2];
  if (item.predicate === 'attestation') {
    for (const key of ['sourceDate', 'unresolved', 'unresolvedReason']) delete value[key];
    value.undatedSourceAttestation = true;
    value.event ??= description;
  } else {
    need(value.dateContext?.unresolved === true, 'Expected a source-only context for ' + item.id);
    const context = { ...value.dateContext };
    for (const key of ['sourceDate', 'unresolved', 'unresolvedReason']) delete context[key];
    context.undatedSourceAttestation = true;
    context.event ??= description;
    value.dateContext = context;
  }
  const units = item.evidence.map(id => {
    const unit = packet.units.find(row => row.id === id);
    need(unit?.zh && previous.source.some(row => row.id === id && row.zh === unit.zh), 'Changed primary witness ' + id);
    return { id, zh: unit.zh };
  });
  cases.push({ id: item.id, previousId: previous.id, personId: item.personId, predicate: item.predicate,
    originalClaimHash: item.claimHash, originalAuthor: previous.author,
    originalUncertaintyNote: item.value.dateContext?.unresolvedReason ?? item.value.unresolvedReason,
    primaryWitnesses: units, proposedDescription: description });
  return { kind: 'replace', id: item.id, before, after,
    reason: 'The cited Chinese records this fact, age or relative narrative order without a calendar year. Preserve that source statement explicitly; add no Western year or bound. ' + description + ' Earlier uncertainty note retained for review: ' + cases.at(-1).originalUncertaintyNote };
});
need(changes.length === 26 && cases.length === descriptions.size, 'Unexpected unresolved scope; do not silently skip research');
const proposal = { sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  author: { agentId: '/root', name: 'Codex host' }, changes };
const proposalFile = artifacts + '/undated-source-amendment-proposal.json';
const receiptFile = artifacts + '/undated-source-amendment-preview.json';
const extractionPacket = buildPeopleExtractionPacket('jinshu', '080', { properNounMatcher: loadProperNounMatcher() });
const validateExtraction = candidate => {
  const result = validateCompactPeopleExtraction(candidate, extractionPacket);
  validateAppliedEditorialDecisions(read(editorialDecisionPath('jinshu', '080')), result.normalized);
};
const inPlace = applyDateRepairProposal(source, proposal, packet);
validateExtraction(inPlace);
const changedIndices = new Set(changes.map(change => Number(change.id.slice(6)) - 1));
need(JSON.stringify(inPlace.people) === JSON.stringify(source.people) && JSON.stringify(inPlace.surfaces) === JSON.stringify(source.surfaces) && inPlace.claims.length === source.claims.length, 'Do not alter people, hints, mentions or coverage');
for (let index = 0; index < source.claims.length; index++) {
  if (!changedIndices.has(index)) need(JSON.stringify(source.claims[index]) === JSON.stringify(inPlace.claims[index]), 'An unrelated claim changed');
}
// Simulate the native original-to-final replay before staging: it can reorder
// changed claims, so seal that exact output rather than an intermediate hash.
const original = read(root + '/data/people/extractions/jinshu/080.json');
const combined = dateRepairDifference(original, inPlace, baseline);
const candidate = applyDateRepairProposal(original, combined, baseline);
validateExtraction(candidate);
need(JSON.stringify(inPlace.claims.map(row => JSON.stringify(row)).sort()) === JSON.stringify(candidate.claims.map(row => JSON.stringify(row)).sort()), 'Native replay changed source facts');
const next = buildDateAuditPacket('jinshu', '080', { extraction: candidate });
need(!unresolvedDateAuditItems(next).length, 'Actual research questions remain; do not commission guaranteed-failing re-audit');
for (const change of changes) {
  const claimHash = 'sha256:' + digest(JSON.stringify(change.after));
  need(next.items.some(item => item.claimHash === claimHash), 'Changed claim escaped independent audit: ' + change.id);
}
const bytes = Buffer.from(JSON.stringify(proposal, null, 2) + '\n');
const receipt = { at: new Date().toISOString(), kind: 'host-source-chronology-amendment-preview',
  sourceHash: packet.sourceHash, beforeExtractionHash: packet.extractionHash, candidateExtractionHash: next.extractionHash,
  proposalSha256: digest(bytes), changedClaims: changes.length, everyChangedClaimStillAuditable: true,
  peopleHintsMentionsAndUnrelatedClaimsUnchanged: true, westernYearsAdded: 0, unresolvedItems: 0,
  structuralValidationPassed: true, editorialValidationPassed: true, cases,
  independentApprovalCompleted: false, chapterApproved: false, canonicalWrites: 0 };
if (!apply) {
  fs.writeFileSync(proposalFile, bytes, { flag: 'wx' });
  fs.writeFileSync(receiptFile, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
} else {
  need(digest(fs.readFileSync(proposalFile)) === receipt.proposalSha256 &&
    read(receiptFile).candidateExtractionHash === next.extractionHash, 'Saved source amendment differs; inspect rather than replacing it');
  const staged = revisePendingDateRepair({ book: 'jinshu', chapter: '080' }, proposal, { validateExtraction });
  need(staged.extractionHash === next.extractionHash && baseline.extractionHash === buildDateAuditPacket('jinshu', '080').extractionHash, 'Native staging or canonical input changed');
  fs.writeFileSync(artifacts + '/undated-source-amendment-staged.json', JSON.stringify({ ...receipt,
    at: new Date().toISOString(), stagedByNativeRevisionApi: true,
    workflowRound: read(directory + '/state.json').round, independentFullReauditRequired: true }, null, 2) + '\n', { flag: 'wx' });
}
need(!inspectLocalDisk(root).errors.length, 'Host resource guard failed after source validation');
console.log(JSON.stringify({ mode: apply ? 'staged' : 'preview', changed: changes.length,
  allChangedClaimsRemainAuditable: true, candidateExtractionHash: next.extractionHash, independentApprovalCompleted: false }));
