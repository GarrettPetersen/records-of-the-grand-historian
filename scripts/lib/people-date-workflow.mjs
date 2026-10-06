import fs from 'node:fs';
import path from 'node:path';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './people-content.mjs';
import { serializeCompactPeopleExtraction } from './people-compact.mjs';
import { dateWorkerInput } from './people-date-worker.mjs';
import { mapDateReviewJobs } from './people-date-concurrency.mjs';
import { buildDateAuditPacket, dateAuditItems, dateAuditStatus, recordDateAudit, validateDateAuditReport, dateAuditReferencesCurrent } from './people-date-audit.mjs';
import { personClaimReception, personReceptionErrors } from './people-reception.mjs';
import { deathOnlyChronology, hasConcreteWesternChronology, hasDateBearingChronology } from './people-date-values.mjs';
import {
  validateAppliedEditorialDecisions,
  validateEditorialDecisionDocument,
  editorialReviews,
} from './people-editorial-decisions.mjs';

export const DATE_WORKFLOW_VERSION = 1;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hash = value => sha256(JSON.stringify(value));
const lifePredicates = new Set(['attestation', 'birth', 'death', 'age']);
const claimIndexFor = (packet, id) => {
  const item = packet.items?.find(candidate => candidate.id === id);
  if (item) return item.claimIndex;
  // A date-context repair can add chronology to an event that did not yet
  // produce an audit item. Existing audit IDs above always win over this raw
  // row fallback; replace/remove still require an owned temporal item below.
  return Number(id.slice(6)) - 1;
};
const dateFields = new Set(['westernYear', 'westernInterval', 'westernBounds', 'sourceDate', 'dateContext', 'startDate', 'endDate', 'unresolved', 'unresolvedReason', 'undatedSourceAttestation']);
const withoutDates = value => Array.isArray(value) ? value.map(withoutDates) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).filter(([key])=>!dateFields.has(key)).map(([key,v])=>[key,withoutDates(v)])) : value;
const isReceptionEvent = row => Array.isArray(row) && row.length === 5 && row[1] === 'event-participation'
  && typeof row[2]?.kind === 'string' && row[2].kind.trim().length > 0
  && Boolean(personClaimReception({ predicate: row[1], value: row[2] }))
  && personReceptionErrors({ predicate: row[1], value: row[2] }).length === 0;
const sameNonDateClaim = (before, after) => before[0] === after[0] && before[1] === after[1]
  && same(withoutDates(before[2]), withoutDates(after[2]));

// Candidate extraction bytes are not a sufficient review identity: removing a
// sealed no-op can leave those bytes unchanged while changing the proposal a
// reviewer must approve. New staged handoffs therefore bind reviews to both.
export function sealedDateRepairProposalHash(proposal) {
  if (!proposal || typeof proposal !== 'object') throw new Error('Date repair proposal is required for sealing');
  return hash(proposal);
}

export function validateStagedDateRepairReview(handoff, review, candidateFile) {
  if (handoff?.kind !== 'date-repair-candidate-handoff' || !handoff.proposal || !handoff.candidate) throw new Error('Invalid staged date-repair handoff');
  const sealedCandidateHash = sealedDateRepairProposalHash(handoff.proposal);
  const candidateExtractionHash = hash(handoff.candidate);
  if (handoff.sealedCandidateHash !== sealedCandidateHash || handoff.candidateExtractionHash !== candidateExtractionHash) throw new Error('Staged date-repair handoff identity does not match its sealed proposal or candidate bytes');
  if (!review || review.kind !== 'independent-staged-date-repair-review' || review.book !== handoff.book || review.chapter !== handoff.chapter ||
      review.candidateFile !== candidateFile || review.sealedCandidateHash !== sealedCandidateHash || review.candidateExtractionHash !== candidateExtractionHash) {
    throw new Error('Independent review must bind the exact sealed proposal, candidate bytes, and handoff file');
  }
  if (review.candidateHash !== undefined && review.candidateHash !== sealedCandidateHash) throw new Error('Legacy candidateHash cannot replace the sealed proposal identity');
  return { sealedCandidateHash, candidateExtractionHash };
}

// A date candidate sometimes has to update a reviewed claim replacement: the
// review can have preserved a now-rejected imported interval as part of the
// replacement fact.  This is intentionally an in-memory, sealed amendment.
// It never writes the live editorial decision; a host curator must replay the
// same amendment and publish both artifacts together after independent review.
const editorialAmendmentDateFields = new Set([
  'westernYear', 'westernInterval', 'westernBounds', 'dateContext', 'startDate', 'endDate',
  'unresolved', 'unresolvedReason', 'event',
]);
const withoutEditorialAmendmentDates = value => Array.isArray(value)
  ? value.map(withoutEditorialAmendmentDates)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value)
      .filter(([key]) => !editorialAmendmentDateFields.has(key))
      .map(([key, item]) => [key, withoutEditorialAmendmentDates(item)]))
    : value;

function assertDateOnlyEditorialClaimAmendment(before, after) {
  if (!before || !after || before.id !== after.id || before.subject !== after.subject ||
      before.predicate !== after.predicate || before.certainty !== after.certainty ||
      !same(before.evidence, after.evidence)) {
    throw new Error('Editorial amendment must preserve the reviewed claim identity, certainty, and evidence');
  }
  if (!same(withoutEditorialAmendmentDates(before.value), withoutEditorialAmendmentDates(after.value))) {
    throw new Error('Editorial amendment may change only chronology fields in the reviewed replacement fact');
  }
  if (before.value?.event !== undefined && before.value.event !== after.value?.event) {
    throw new Error('Editorial amendment cannot alter an existing non-date event description');
  }
}

export function applyDateRepairEditorialAmendment(document, amendment, candidate) {
  if (!document || !amendment || !candidate) throw new Error('Editorial amendment requires decision, amendment, and expanded candidate');
  validateEditorialDecisionDocument(document);
  if (amendment.schemaVersion !== 1 || amendment.kind !== 'date-repair-editorial-amendment' ||
      amendment.book !== document.book || amendment.chapter !== document.chapter ||
      amendment.editorialDecisionHash !== hash(document) || !Array.isArray(amendment.claimRevisions) ||
      amendment.claimRevisions.length === 0) {
    throw new Error('Invalid or stale sealed editorial amendment');
  }
  const amended = structuredClone(document);
  const seen = new Set();
  for (const change of amendment.claimRevisions) {
    if (typeof change.repairId !== 'string' || typeof change.claimId !== 'string' ||
        typeof change.reason !== 'string' || change.reason.trim().length < 20) {
      throw new Error('Editorial amendment requires a reviewed claim, repair ID, and source-based reason');
    }
    const key = `${change.repairId}:${change.claimId}`;
    if (seen.has(key)) throw new Error('Duplicate editorial amendment target');
    seen.add(key);
    const reviewRecords = amended.schemaVersion === 4 ? amended.reviews : [amended];
    const matches = reviewRecords.flatMap(review => (review.claimRevisions ?? []).filter(revision =>
      revision.repairId === change.repairId && revision.before?.id === change.claimId &&
      revision.after?.id === change.claimId,
    ));
    if (matches.length !== 1 || !same(matches[0].after, change.before)) {
      throw new Error(`Editorial amendment target is missing or stale for ${key}`);
    }
    assertDateOnlyEditorialClaimAmendment(change.before, change.after);
    matches[0].after = structuredClone(change.after);
    matches[0].reason = change.reason;
  }
  validateEditorialDecisionDocument(amended);
  validateAppliedEditorialDecisions(amended, candidate);
  return amended;
}

// Derive, but never silently publish, the narrow editorial amendment required
// when a chronology repair changes only the date container of an already
// reviewed replacement fact. A curator must later publish this sealed change
// with its independently reviewed date repair.
export function deriveDateRepairEditorialAmendment(document, candidate) {
  if (!document || !candidate) throw new Error('Editorial amendment derivation requires a decision document and candidate');
  validateEditorialDecisionDocument(document);
  const reviews = editorialReviews(document);
  if (!reviews.length) throw new Error('Date-only editorial amendment derivation requires current editorial review history');
  const claimRevisions = [];
  for (const revision of reviews.flatMap(review => review.claimRevisions ?? [])) {
    const exact = candidate.claims.some(claim =>
      claim.subject === revision.after.subject && claim.predicate === revision.after.predicate &&
      claim.certainty === revision.after.certainty && same(claim.value, revision.after.value) &&
      revision.after.evidence.every(item => claim.evidence.includes(item)),
    );
    if (exact) continue;
    const matches = candidate.claims.filter(claim =>
      claim.subject === revision.after.subject && claim.predicate === revision.after.predicate &&
      claim.certainty === revision.after.certainty &&
      same(withoutEditorialAmendmentDates(claim.value), withoutEditorialAmendmentDates(revision.after.value)) &&
      revision.after.evidence.every(item => claim.evidence.includes(item)),
    );
    if (matches.length === 0) continue;
    if (matches.length !== 1) throw new Error(`Date-only editorial amendment is ambiguous for ${revision.after.id}`);
    const after = structuredClone(revision.after);
    after.value = structuredClone(matches[0].value);
    claimRevisions.push({
      repairId: revision.repairId,
      claimId: revision.after.id,
      before: structuredClone(revision.after),
      after,
      reason: 'Independent chronology repair changes only the reviewed date context; the approved reading, claim identity, certainty, and source evidence remain unchanged.',
    });
  }
  if (claimRevisions.length === 0) return null;
  const amendment = {
    schemaVersion: 1,
    kind: 'date-repair-editorial-amendment',
    book: document.book,
    chapter: document.chapter,
    editorialDecisionHash: hash(document),
    claimRevisions,
  };
  applyDateRepairEditorialAmendment(document, amendment, candidate);
  return amendment;
}

export function dateWorkflowDirectory(book, chapter, peopleDir = PEOPLE_DIR) {
  return path.join(peopleDir, 'generated', 'date-workflow', book, chapter);
}

// Jobs own disjoint checks. All source units are read once for omissions; remote
// evidence and adjacent narrative remain read-only context for each owned check.
export function dateReviewJobs(packet, { maxUnits = 40, maxBytes = 48 * 1024 } = {}) {
  if (!Number.isInteger(maxUnits) || maxUnits < 1 || !Number.isInteger(maxBytes) || maxBytes < 1024) throw new Error('Invalid date chunk ceilings');
  const units = packet.units;
  const indices = new Map(units.map((u, i) => [u.id, i]));
  const personAnchor = new Map(packet.people.map(p => [p.id, packet.items.find(i => i.personId === p.id && i.evidence.length)?.evidence[0] ?? units.find(u=>packet.unitPeople?.[u.id]?.includes(p.id))?.id ?? units[0]?.id]));
  const itemAnchor = i => i.evidence[0] ?? personAnchor.get(i.personId);
  const make = (start, end) => {
    const owned = new Set(units.slice(start, end).map(u => u.id));
    const items = packet.items.filter(i => owned.has(itemAnchor(i)));
    const people = packet.people.filter(p => owned.has(personAnchor.get(p.id)));
    const ownedPeople = new Set(people.map(p=>p.id));
    const contextItems = packet.items.filter(i=>ownedPeople.has(i.personId) && !items.includes(i));
    const context = new Set(units.slice(Math.max(0, start - 3), Math.min(units.length, end + 3)).map(u => u.id));
    for (const item of [...items,...contextItems]) for (const id of item.evidence) context.add(id);
    // Include the closest preceding dated heading, without treating it as a
    // semantic date assignment. The reviewer must establish inheritance.
    for (let i = start - 1; i >= 0; i -= 1) if (/年|即位|受禪/.test(units[i].zh)) { context.add(units[i].id); break; }
    const identities = new Set([...items.map(i => i.personId), ...people.map(p => p.id)]);
    for(const id of context) for(const person of packet.unitPeople?.[id]??[])identities.add(person);
    const job = { schemaVersion: 1, workflowVersion: DATE_WORKFLOW_VERSION, book: packet.book, chapter: packet.chapter,
      sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, sourceUrl: packet.sourceUrl,
      ownedUnits: [...owned], ownedItems: items.map(i => i.id), ownedPeople: people.map(p => p.id),
      people: packet.people.filter(p => identities.has(p.id)), items, contextItems,
      unitPeople:Object.fromEntries([...context].map(id=>[id,packet.unitPeople?.[id]??[]])),
      units: [...context].sort((a,b) => indices.get(a)-indices.get(b)).map(id => {const {literal,...unit}=units[indices.get(id)];return unit;}) };
    job.id = hash(job).slice(7, 27);
    return job;
  };
  const jobs = [];
  const split = (start, end) => {
    const job = make(start, end);
    if (Buffer.byteLength(JSON.stringify(job)) <= maxBytes && end - start <= maxUnits) { jobs.push(job); return; }
    if (end - start === 1) throw new Error(`Date evidence at ${units[start].id} exceeds ${maxBytes} bytes; increase the explicit ceiling after inspecting this packet`);
    const middle = start + Math.floor((end-start)/2); split(start, middle); split(middle, end);
  };
  if (!units.length) throw new Error('Cannot audit an empty source chapter');
  split(0, units.length);
  for (const [field, expected] of [['ownedUnits', units.length], ['ownedItems', packet.items.length], ['ownedPeople', packet.people.length]]) {
    const ids = jobs.flatMap(j => j[field]);
    if (ids.length !== expected || new Set(ids).size !== expected) throw new Error(`Date job partition lost ${field}`);
  }
  return jobs;
}

export function retainedDateReviewJobs(packet,state,options={}) {
  const key=`${state.phase}-${state.round}`;
  state.reviewPlans??={};
  const prior=state.reviewPlans[key];
  const ceilings=prior??{maxUnits:options.maxUnits??40,maxBytes:options.maxBytes??48*1024};
  const jobs=dateReviewJobs(packet,ceilings),jobIds=jobs.map(job=>job.id);
  if(prior && !same(prior.jobIds,jobIds))throw new Error('Retained date ownership changed; reconcile protocol before restarting');
  const existing=Object.keys(state.jobs).filter(id=>id.startsWith(`${key}-`)).map(id=>id.slice(key.length+1));
  if(existing.some(id=>!jobIds.includes(id)))throw new Error('Current ceilings do not match retained date jobs; restore their original limits');
  state.reviewPlans[key]={maxUnits:ceilings.maxUnits,maxBytes:ceilings.maxBytes,jobIds};
  return {key,plan:state.reviewPlans[key],jobs};
}

// Repair work owns findings rather than source-unit ranges. A finding is kept
// whole so a researcher never receives half of a requested correction, while
// dateWorkerInput still includes each affected person's complete chronology.
// Findings sharing a person stay together: their changes may depend on the
// same exact `before` value. Disjoint-person components can share a sealed
// repair packet, however. Packing those components to the existing byte
// ceiling avoids spending a separate model turn on every small correction.
export function dateRepairJobs(report, packet, extraction, { maxBytes = 64 * 1024 } = {}) {
  if (!Array.isArray(report?.findings) || !report.findings.length) throw new Error('Date repair requires review findings');
  const itemPeople = new Map((packet?.items ?? []).map(item => [item.id, item.personId]));
  const parent = report.findings.map((_, index) => index);
  const find = index => parent[index] === index ? index : (parent[index] = find(parent[index]));
  const join = (a,b) => { a=find(a);b=find(b);if(a!==b)parent[b]=a; };
  const owner = new Map();
  report.findings.forEach((finding,index) => {
    const people = new Set(finding.items.map(id => id.startsWith('hints-') ? id.slice(6) : itemPeople.get(id) ?? (id.startsWith('p') ? id : null)).filter(Boolean));
    for (const personId of people) { if(owner.has(personId)) join(index,owner.get(personId)); else owner.set(personId,index); }
  });
  const groups = new Map();
  report.findings.forEach((finding,index)=>{const root=find(index);if(!groups.has(root))groups.set(root,[]);groups.get(root).push(finding);});
  const split = findings => {
    if (!extraction || Buffer.byteLength(JSON.stringify(dateWorkerInput({ kind:'repair', packet, extraction, report, findings }))) <= maxBytes) return [findings];
    if (findings.length === 1) throw new Error(`Date repair evidence for finding ${hash(findings[0]).slice(7,27)} exceeds ${maxBytes} bytes; inspect this complete assigned chronology before spending`);
    const middle=Math.floor(findings.length/2);
    return [...split(findings.slice(0,middle)),...split(findings.slice(middle))];
  };
  const components = [...groups.values()].flatMap(split);
  const packed = [];
  let current = [];
  for (const component of components) {
    const candidate = [...current, ...component];
    const fits = !extraction || Buffer.byteLength(JSON.stringify(dateWorkerInput({ kind:'repair', packet, extraction, report, findings:candidate }))) <= maxBytes;
    if (current.length && !fits) {
      packed.push(current);
      current = [...component];
    } else current = candidate;
  }
  if (current.length) packed.push(current);
  return packed.map((findings, index) => ({
    id: `${String(index + 1).padStart(3, '0')}-${hash(findings).slice(7, 27)}`,
    findings,
  }));
}

export function validateDateJobResult(result, job, packet) {
  if (result.jobId !== job.id || result.sourceHash !== job.sourceHash || result.extractionHash !== job.extractionHash) throw new Error('Stale date job artifact');
  for (const [field, expected] of [['reviewedUnits',job.ownedUnits],['itemChecks',job.ownedItems],['personChecks',job.ownedPeople]]) {
    const actual = (result[field] ?? []).map(v => typeof v === 'string' ? v : v.id);
    if (!same([...actual].sort(), [...expected].sort())) throw new Error(`Job ${job.id} must cover exactly its ${field}`);
  }
  const report = { ...result, schemaVersion: 1, auditVersion: 1, book: packet.book, chapter: packet.chapter,
    status: result.findings?.length ? 'needs-revision' : 'audited' };
  // Validate a partition against its own owned IDs, with the full chapter's
  // source evidence available. Full coverage is enforced by assembly below.
  const scope = { ...packet, people: packet.people.filter(p => job.ownedPeople.includes(p.id)), items: packet.items.filter(i => job.ownedItems.includes(i.id)),
    units: packet.units };
  if (report.status === 'audited') report.reviewedUnits = packet.units.map(u => u.id);
  else scope.people = packet.people;
  if (report.status !== 'audited') scope.items = packet.items;
  validateDateAuditReport(report, scope);
  return result;
}

export function assembleDateReview(packet, jobs, results) {
  if (jobs.length !== results.length) throw new Error('Missing date review chunks');
  results.forEach((r,i) => validateDateJobResult(r, jobs[i], packet));
  const findings = results.flatMap(r => r.findings);
  const report = { schemaVersion: 1, auditVersion: 1, book: packet.book, chapter: packet.chapter,
    sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
    status: findings.length ? (results.some(r => [...r.itemChecks,...r.personChecks].some(c => c.verdict === 'incorrect')) ? 'needs-revision' : 'research-blocked') : 'audited',
    reviewer: { name: [...new Set(results.map(r=>r.reviewer.name))].join('; '), independentOfExtractor: true,
      workers: results.map(r=>r.reviewer) }, reviewedAt: new Date().toISOString(),
    summary: results.map(r => r.summary).join('\n'), reviewedUnits: results.flatMap(r=>r.reviewedUnits),
    itemChecks: results.flatMap(r=>r.itemChecks), personChecks: results.flatMap(r=>r.personChecks), findings,
    references: results.flatMap(r=>r.references) };
  validateDateAuditReport(report, packet);
  return report;
}

export function applyDateRepairProposal(stored, proposal, packet) {
  if (stored.schemaVersion !== 2) throw new Error('Date repair requires the current compact extraction format');
  if (proposal.sourceHash !== packet.sourceHash || proposal.extractionHash !== packet.extractionHash || hash(stored) !== packet.extractionHash) throw new Error('Stale date repair proposal');
  if (!Array.isArray(proposal.changes) || !proposal.changes.length) throw new Error('Repair must contain scoped changes');
  if (proposal.blocked || ['hostRequiredChanges', 'requiredReceptionEvents', 'requiredHostCuration'].some(key => proposal[key] !== undefined)) throw new Error('Incomplete repair: resolve required host work inside supported changes before staging');
  const candidate = structuredClone(stored);
  const seen = new Set();
  const temporal = new Set(dateAuditItems(stored).items.filter(i=>i.claimIndex !== undefined).map(i=>i.id));
  const removed = new Set();
  for (const change of proposal.changes) {
    if (typeof change.reason !== 'string' || change.reason.trim().length < 20) throw new Error('Repair requires source-based reasoning');
    if (change.kind === 'hints') {
      const key = `hints-${change.personId}`;
      if (seen.has(key)) throw new Error('Duplicate date repair target'); seen.add(key);
      const person = candidate.people.find(p => p[0] === change.personId);
      // Removes are applied after all scoped changes so original claim IDs stay
      // stable. Hint validation, however, must reason about the effective
      // candidate, not a claim already scheduled for removal earlier in this
      // same proposal.
      const activeClaims = candidate.claims.filter((_, index) => !removed.has(index));
      // A person mentioned solely in a dated retrospective or posthumous event
      // must not retain invented life-date hints just to satisfy the ordinary
      // extraction invariant. The separately classified reception record is
      // still required, so an empty hint list cannot hide an ordinary person.
      const noChronologyEvidence = change.after?.length === 0 && activeClaims.some(claim =>
        claim[0] === change.personId && claim[1] === 'attestation' &&
        claim[2]?.undatedSourceAttestation === true) && !activeClaims.some(claim =>
        claim[0] === change.personId && hasConcreteWesternChronology(claim[2]));
      // An independent repair may withdraw a spurious Western conversion while
      // retaining the source event as explicitly unresolved. In that case an
      // empty activity-hint list is the accurate representation: forcing a
      // hint back in would reintroduce precisely the unsupported chronology
      // the repair was asked to remove.
      const unresolvedOnly = change.after?.length === 0 && activeClaims.some(claim =>
        claim[0] === change.personId && (claim[2]?.unresolved === true || claim[2]?.dateContext?.unresolved === true)) &&
        !activeClaims.some(claim => claim[0] === change.personId && hasConcreteWesternChronology(claim[2]));
      const boundedUncertaintyOnly = change.after?.length === 0 && activeClaims.filter(claim =>
        claim[0] === change.personId && hasConcreteWesternChronology(claim[2])).every(claim => {
        const date = claim[2]?.dateContext ?? claim[2];
        const bounds = date?.westernBounds;
        return Boolean(bounds) && !date?.westernYear && !date?.westernInterval &&
          Boolean(bounds.after ?? bounds.onOrAfter) && Boolean(bounds.before ?? bounds.onOrBefore);
      }) && activeClaims.some(claim => claim[0] === change.personId && hasConcreteWesternChronology(claim[2]));
      const receptionOnly = change.after?.length === 0 && activeClaims.some(claim => claim[0] === change.personId && isReceptionEvent(claim));
      const deathOnly = change.after?.length === 0 && deathOnlyChronology(activeClaims.filter(claim => claim[0] === change.personId));
      if (!person || !Array.isArray(change.after) || (!change.after.length && !receptionOnly && !noChronologyEvidence && !unresolvedOnly && !boundedUncertaintyOnly && !deathOnly) || change.after.some(s=>typeof s !== 'string' || !s.trim()) || !same(person[4]?.a ?? [], change.before)) {
        throw new Error(`Invalid or stale active-hint repair for ${change.personId}: expected ${JSON.stringify(person?.[4]?.a ?? [])}, received before ${JSON.stringify(change.before)} and after ${JSON.stringify(change.after)}`);
      }
      person[4] = { ...person[4], a: change.after };
    } else if (change.kind === 'date-context') {
      if (!/^claim-[1-9]\d*$/.test(change.id) || seen.has(change.id)) throw new Error('Repair must target a unique temporal claim');
      const index = claimIndexFor(packet, change.id);
      if (!Number.isInteger(index)) throw new Error('Repair must target a unique temporal claim');
      const storedClaim = stored.claims[index];
      if (!storedClaim || lifePredicates.has(storedClaim[1])) throw new Error('Date-context repair requires an existing non-life claim');
      seen.add(change.id);
      if (JSON.stringify(storedClaim[2]?.dateContext ?? null) !== JSON.stringify(change.before ?? null)) throw new Error(`Date-context before-value mismatch for ${change.id}; copy this exact sealed date context as before: ${JSON.stringify(storedClaim[2]?.dateContext ?? null)}`);
      if (!change.after || typeof change.after !== 'object' || Array.isArray(change.after)) throw new Error('Date-context repair requires only a replacement date context');
      if (Object.keys(change.after).some(key=>!['sourceDate','westernYear','westernInterval','westernBounds','unresolved','unresolvedReason','event'].includes(key))) throw new Error('Date-context repair may contain only chronology fields');
      if (change.after.event !== undefined && change.after.event !== storedClaim[2]?.dateContext?.event) throw new Error('Date-context repair cannot alter an existing event description');
      const after = structuredClone(storedClaim); after[2] = { ...after[2], dateContext: structuredClone(change.after) };
      if (!dateAuditItems({ ...stored, claims: [after] }).items.some(item=>item.claimIndex===0)) throw new Error('Date-context repair must supply auditable chronology');
      candidate.claims[index] = after;
    } else if (change.kind === 'replace' || change.kind === 'remove') {
      if (!/^claim-[1-9]\d*$/.test(change.id) || seen.has(change.id)) throw new Error('Repair must target a unique temporal claim');
      const index = claimIndexFor(packet, change.id);
      if (!Number.isInteger(index)) throw new Error('Repair must target a unique temporal claim');
      if (!temporal.has(change.id)) throw new Error('Repair must target a unique temporal claim');
      seen.add(change.id);
      if (!same(stored.claims[index], change.before)) {
        throw new Error(`Date repair before-value mismatch for ${change.id}; copy this exact sealed row as before: ${JSON.stringify(stored.claims[index])}`);
      }
      if (change.kind === 'remove') {
        removed.add(index);
      }
      else {
        if (!Array.isArray(change.after) || change.after.length !== 5 || change.after[0] !== change.before[0] || change.after[1] !== change.before[1]) throw new Error('Date repair cannot change a claim subject or predicate');
        if (!lifePredicates.has(change.before[1]) && !same(withoutDates(change.before[2]),withoutDates(change.after[2]))) throw new Error('Date repair altered non-temporal event fields');
        candidate.claims[index] = change.after;
      }
    } else if (change.kind === 'add' || change.kind === 'add-reception-event') {
      const validKind = change.kind === 'add-reception-event' ? isReceptionEvent(change.after)
        : Array.isArray(change.after) && change.after.length === 5 && lifePredicates.has(change.after[1]);
      if (!validKind || !stored.people.some(p=>p[0]===change.after[0])) throw new Error('Only life/date claims or explicitly classified reception events for existing people may be added');
      if (!Array.isArray(change.after[4]) || !change.after[4].length || change.after[4].some(id=>!packet.units.some(unit=>unit.id===id))) throw new Error('Added claim requires known source-unit evidence');
      if (candidate.claims.some(c=>same(c,change.after))) throw new Error('Duplicate date claim addition');
      candidate.claims.push(change.after);
    } else throw new Error('Unknown date repair operation');
  }
  candidate.claims = candidate.claims.filter((c,i)=>!removed.has(i));
  if (same(candidate, stored)) throw new Error('Date repair has no changes');
  return candidate;
}

// The source extraction is replaced only after independent approval. A durable
// receipt precedes the replacement so a crash between files can be recovered.
export function publishDateRepair({ proposal, candidate, report, rounds = [], priorReviews = [] }, options = {}) {
  const peopleDir = options.peopleDir ?? PEOPLE_DIR;
  const { book, chapter } = report;
  const currentPacket = buildDateAuditPacket(book, chapter, options);
  const file = path.join(peopleDir, 'extractions', book, `${chapter}.json`);
  const current = readJson(file);
  const repairedPacket = buildDateAuditPacket(book, chapter, { ...options, extraction: candidate });
  validateDateAuditReport(report, repairedPacket);
  if (report.status !== 'audited' || !dateAuditReferencesCurrent(report, options)) throw new Error('Repair requires current independent date approval');
  if (currentPacket.extractionHash !== repairedPacket.extractionHash) {
    const expected = applyDateRepairProposal(current, proposal, currentPacket);
    if (!same(expected, candidate)) throw new Error('Candidate differs from scoped repair');
    if (typeof options.validateExtraction !== 'function') throw new Error('Publishing requires the production extraction validator');
    options.validateExtraction(candidate);
    const serialized=serializeCompactPeopleExtraction(candidate);
    if(hash(JSON.parse(serialized))!==repairedPacket.extractionHash)throw new Error('Compact serialization changed the reviewed extraction');
    writeJsonAtomic(path.join(peopleDir, 'date-repairs', book, chapter, `${repairedPacket.extractionHash.slice(7)}.json`), { schemaVersion: 1, proposal, rounds, priorReviews, candidateHash: repairedPacket.extractionHash, report });
    writeTextAtomic(file, serialized);
  } else {
    const receipt = path.join(peopleDir, 'date-repairs', book, chapter, `${repairedPacket.extractionHash.slice(7)}.json`);
    if (!fs.existsSync(receipt) || !same(readJson(receipt).proposal, proposal) || !same(readJson(receipt).report,report)) throw new Error('No matching repair receipt for recovery');
  }
  return recordDateAudit(report, options);
}

export async function runDateWorkflow({ book, chapter }, worker, options = {}) {
  if(typeof options.validateExtraction!=='function')throw new Error('Date workflow requires a production validator before worker execution');
  options.validateExtraction(readJson(path.join(options.peopleDir??PEOPLE_DIR,'extractions',book,`${chapter}.json`)));
  const directory = dateWorkflowDirectory(book, chapter, options.peopleDir);
  const stateFile = path.join(directory, 'state.json');
  const packet = buildDateAuditPacket(book, chapter, options);
  let state = fs.existsSync(stateFile) ? readJson(stateFile) : { schemaVersion: 1, workflowVersion: DATE_WORKFLOW_VERSION,
    sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, round: 0, phase: 'audit', jobs: {} };
  const save = () => writeJsonAtomic(stateFile, state);
  if (state.workflowVersion !== DATE_WORKFLOW_VERSION) throw new Error('Date workflow protocol changed; reconcile retained work before restarting');
  const priorReport = path.join(options.peopleDir ?? PEOPLE_DIR, 'date-audits', book, `${chapter}.json`);
  if ((!fs.existsSync(stateFile)||state.restoredFromLedger) && state.phase==='audit' && state.round===0 && fs.existsSync(priorReport) && ['needs-revision','research-blocked'].includes(dateAuditStatus(book,chapter,options).status)) {
    const report = readJson(priorReport);
    validateDateAuditReport(report,packet);
    writeJsonAtomic(path.join(directory,'review-0.json'),report);
    state.review='review-0.json';state.phase='repair';save();
  }
  if(state.restoredFromLedger){delete state.restoredFromLedger;save();}
  if (state.phase === 'complete') {
    const current=dateAuditStatus(book,chapter,options);
    if(current.status==='audited')return current;
    fs.renameSync(directory,`${directory}.completed-${hash(state).slice(7,27)}`);
    state={schemaVersion:1,workflowVersion:DATE_WORKFLOW_VERSION,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,round:0,phase:'audit',jobs:{}};
    save();
  }
  const perform = async (task, validate) => {
    for (let attempt=0;attempt<(options.maxAttempts ?? 3);attempt++) {
      const execute=()=>worker({...task,state:state.jobs[task.key]??{},save:patch=>{state.jobs[task.key]={...state.jobs[task.key],...patch};save();}});
      const result=await (options.workerPool ? options.workerPool.run(execute) : execute());
      try { validate(result); return result; }
      catch(error) {
        writeJsonAtomic(path.join(directory,`rejected-${task.key}-${hash(result).slice(7)}.json`),result);
        state.jobs[task.key]={...state.jobs[task.key],validationError:error.message,status:'rejected'};save();
        if(attempt+1 >= (options.maxAttempts??3))throw error;
      }
    }
    throw new Error('No date validation attempts configured');
  };
  if (state.phase === 'publish') {
    const result = publishDateRepair(readJson(path.join(directory, 'publication.json')), options);
    state.phase = 'complete'; save(); return result;
  }
  if (state.phase === 'editorial-amendment') {
    return { status: 'editorial-amendment-required', amendmentFile: state.editorialAmendment };
  }
  if (packet.sourceHash !== state.sourceHash || packet.extractionHash !== state.extractionHash) {
    if (state.phase === 'complete') return { status: 'stale' };
    throw new Error('Source or extraction changed during date work; retain artifacts and reconcile before resuming');
  }
  if (state.phase === 'complete') return { status: 'audited' };
  const original = readJson(path.join(options.peopleDir ?? PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
  for (; state.round <= (options.maxRounds ?? 3);) {
    let active = state.candidate ? buildDateAuditPacket(book, chapter, { ...options, extraction: readJson(path.join(directory, state.candidate)) }) : packet;
    if (state.phase === 'audit' || state.phase === 'reaudit') {
      const {key:planKey,plan,jobs} = retainedDateReviewJobs(active,state,options);
      save();
      if(options.saveReviewPlan)await options.saveReviewPlan(planKey,plan);
      const results = await mapDateReviewJobs(jobs, options.jobConcurrency ?? 1, async job => {
        const key = `${state.phase}-${state.round}-${job.id}`;
        const artifact = path.join(directory, `${key}.json`);
        if (!fs.existsSync(artifact)) {
          const result = await perform({ kind: 'review', key, job, packet: active, directory, maxWorkerBytes:plan.maxBytes+8192 },r=>validateDateJobResult(r,job,active));
          validateDateJobResult(result, job, active); writeJsonAtomic(artifact, result);
        }
        const result = readJson(artifact); validateDateJobResult(result, job, active); return result;
      });
      const report = assembleDateReview(active, jobs, results);
      writeJsonAtomic(path.join(directory, `review-${state.round}.json`), report);
      state.review = `review-${state.round}.json`;
      if (report.status === 'audited') {
        const rounds=fs.readdirSync(directory).filter(name=>/^repair-\d+-.+\.json$/.test(name)).sort().map(name=>readJson(path.join(directory,name)));
        const repairAgents=new Set(Object.entries(state.jobs).filter(([key])=>key.startsWith('repair-')).map(([,job])=>job.agentId).filter(Boolean));
        for(const proposal of rounds)if(proposal.author?.agentId)repairAgents.add(proposal.author.agentId);
        if(report.reviewer.workers.some(w=>w.agentId && repairAgents.has(w.agentId)))throw new Error('A repair conversation cannot approve its own candidate');
        if (!state.candidate) { recordDateAudit(report, options); state.phase = 'complete'; save(); return report; }
        const publication = { proposal: readJson(path.join(directory, 'combined-proposal.json')), candidate: readJson(path.join(directory, state.candidate)), report,
          rounds,priorReviews:fs.readdirSync(directory).filter(name=>/^review-\d+\.json$/.test(name)).sort().map(name=>readJson(path.join(directory,name))).filter(r=>r.status!=='audited') };
        const validation = options.validateExtraction(publication.candidate);
        if (validation?.editorialAmendment) {
          // Do not mutate the live editorial record or source extraction here.
          // A curator must review and publish this sealed date-only amendment
          // together with the already independent date-audit approval.
          const amendmentFile = 'editorial-amendment.json';
          writeJsonAtomic(path.join(directory, amendmentFile), validation.editorialAmendment);
          state.editorialAmendment = amendmentFile;
          state.phase = 'editorial-amendment';
          save();
          return { status: 'editorial-amendment-required', amendmentFile };
        }
        writeJsonAtomic(path.join(directory, 'publication.json'), publication); state.phase = 'publish'; save();
        const result = publishDateRepair(publication, options); state.phase = 'complete'; save(); return result;
      }
      if (!state.candidate) recordDateAudit(report, options);
      state.phase = 'repair'; save();
    }
    if (state.round >= (options.maxRounds ?? 3)) return { status: 'needs-revision', reason: 'Repair-round ceiling reached; resume with a larger explicit ceiling after reviewing failures' };
    const report = readJson(path.join(directory,state.review));
    // Freeze finding ownership to the extraction independently reviewed at the
    // start of this repair round. Candidate claim arrays may shrink during
    // earlier repairs, which changes raw claim-N positions without changing a
    // review finding's intended person or source evidence.
    const repairBaseline = state.candidate ? readJson(path.join(directory,state.candidate)) : original;
    const repairBaselinePacket = buildDateAuditPacket(book, chapter, { ...options, extraction: repairBaseline });
    const repairPlan = state.repairPlan ?? dateRepairJobs(report, repairBaselinePacket, repairBaseline,
      {maxBytes:options.maxWorkerBytes ?? 64*1024});
    if (!same(state.repairPlan ?? repairPlan, repairPlan)) throw new Error('Retained date repair ownership changed; reconcile protocol before restarting');
    state.repairPlan = repairPlan;
    let candidate = state.repairCandidate ? readJson(path.join(directory, state.repairCandidate))
      : (state.candidate ? readJson(path.join(directory,state.candidate)) : original);
    for (let repairIndex = state.repairIndex ?? 0; repairIndex < repairPlan.length; repairIndex += 1) {
      active = buildDateAuditPacket(book, chapter, { ...options, extraction: candidate });
      const job = repairPlan[repairIndex];
      const key = `repair-${state.round}-${job.id}-${active.extractionHash.slice(7, 19)}`;
      const artifact = path.join(directory, `${key}.json`);
      // A returned artifact can become invalid only when a prior repair changed
      // the candidate it was based on (most commonly an exact active-hint
      // `before` value). Preserve that artifact for auditability, then let the
      // retained worker continue with the validator error instead of endlessly
      // rereading the same stale file on every recovery invocation.
      if (fs.existsSync(artifact)) {
        const prior = readJson(artifact);
        try {
          applyDateRepairProposal(candidate, prior, active);
        } catch (error) {
          const rejectedBase = path.join(directory, `rejected-${key}-${hash(prior).slice(7)}`);
          const rejected = fs.existsSync(`${rejectedBase}.json`)
            ? `${rejectedBase}-${Date.now()}.json`
            : `${rejectedBase}.json`;
          fs.renameSync(artifact, rejected);
          state.jobs[key] = { ...state.jobs[key], validationError: error.message, status: 'rejected' };
          save();
        }
      }
      if (!fs.existsSync(artifact)) {
        const result = await perform({ kind: 'repair', key, packet: active, extraction: candidate,
          baselinePacket: repairBaselinePacket, baselineExtraction: repairBaseline,
          report, findings: job.findings, directory },r=>{
          if(r.blocked){if(typeof r.reason!=='string'||r.reason.trim().length<20)throw new Error('Research blocker needs a substantive reason');return;}
          const staged=applyDateRepairProposal(candidate,r,active);
          options.validateExtraction(staged);
        });
        if (result.blocked) { writeJsonAtomic(path.join(directory, 'research-blocker.json'), result); return { status: 'research-blocked', reason: result.reason }; }
        writeJsonAtomic(artifact, result);
      }
      const proposal = readJson(artifact);
      if(proposal.author?.agentId) { state.jobs[key]={...state.jobs[key],agentId:proposal.author.agentId};save(); }
      candidate = applyDateRepairProposal(candidate, proposal, active);
      options.validateExtraction(candidate);
      state.repairIndex = repairIndex + 1;
      state.repairCandidate = `repair-candidate-${state.round}-${state.repairIndex}.json`;
      writeJsonAtomic(path.join(directory, state.repairCandidate), candidate);
      save();
    }
    if (typeof options.validateExtraction !== 'function') throw new Error('Date workflow requires a production validator');
    options.validateExtraction(candidate);
    // Collapse multiple repair rounds into a single original-to-final scoped
    // proposal; stable original indices prevent drift after removals.
    const combined = dateRepairDifference(original, candidate, packet);
    candidate = applyDateRepairProposal(original, combined, packet);
    options.validateExtraction(candidate);
    writeJsonAtomic(path.join(directory, 'combined-proposal.json'), combined);
    state.round += 1; state.candidate = `candidate-${state.round}.json`;
    writeJsonAtomic(path.join(directory, state.candidate), candidate);
    delete state.repairPlan; delete state.repairIndex; delete state.repairCandidate;
    state.phase = 'reaudit'; save();
  }
  throw new Error('Unreachable date workflow state');
}

export function dateRepairDifference(before, after, packet) {
  const changes = [];
  const remaining = [...after.claims];
  const temporalItems = dateAuditItems(before).items.filter(i=>i.claimIndex !== undefined);
  const temporalIndices = new Set(temporalItems.map(i=>i.claimIndex));
  for (const item of temporalItems) {
    const claim = before.claims[item.claimIndex];
    const match = remaining.findIndex(c=>same(c,claim));
    if (match >= 0) { remaining.splice(match,1); continue; }
    changes.push({ kind: 'remove', id: item.id, before: claim, reason: 'Superseded by independently re-audited chronology in the retained repair rounds.' });
  }
  for (const [index, claim] of before.claims.entries()) {
    if (temporalIndices.has(index)) continue;
    const match = remaining.findIndex(c=>same(c,claim));
    if (match >= 0) { remaining.splice(match,1); continue; }
    const dated = remaining.findIndex(c=>sameNonDateClaim(claim,c));
    if (dated < 0) throw new Error('Date repair altered a non-temporal claim');
    const datedClaim=remaining.splice(dated,1)[0];
    changes.push({kind:'date-context',id:`claim-${index+1}`,before:claim[2]?.dateContext ?? null,after:datedClaim[2].dateContext,
      reason:'Attach independently reviewed chronology without changing the existing claim identity or non-date content.'});
  }
  // Replacements of dated non-life events must stay replacements, not additions.
  for (const claim of remaining) {
    const removed = changes.find(c=>c.kind==='remove' && c.before[0]===claim[0] && c.before[1]===claim[1]
      && (lifePredicates.has(claim[1]) || same(withoutDates(c.before[2]),withoutDates(claim[2]))));
    if (removed) { removed.kind = 'replace'; removed.after = claim; }
    else changes.push({ kind:isReceptionEvent(claim)?'add-reception-event':'add', after:claim, reason:'Added source-backed chronology or separate later reception after independent re-audit.' });
  }
  for (const p of before.people) {
    const updated = after.people.find(q=>q[0]===p[0]);
    if (!updated) throw new Error('Date repair removed a person');
    if (!same(p[4]?.a,updated[4]?.a)) changes.push({ kind:'hints', personId:p[0], before:p[4]?.a??[], after:updated[4]?.a??[], reason:'Synchronize active hints with independently reviewed personal chronology.' });
  }
  const proposal = { sourceHash:packet.sourceHash, extractionHash:packet.extractionHash, changes };
  // Preserve order: applying a collapsed proposal can move added claims. The
  // candidate that is subsequently reviewed must be this exact reconstructed form.
  return proposal;
}

// A researcher may amend a staged proposal before its independent review starts.
// Retain both rounds; never replace artifacts already owned by a reviewer.
export function revisePendingDateRepair({book,chapter},proposal,options={}) {
  const directory=dateWorkflowDirectory(book,chapter,options.peopleDir),stateFile=path.join(directory,'state.json');
  const state=readJson(stateFile),prefix=`reaudit-${state.round}-`;
  if(state.phase!=='reaudit' || Object.keys(state.jobs).some(key=>key.startsWith(prefix)) || fs.readdirSync(directory).some(name=>name.startsWith(prefix)))throw new Error('Cannot amend a candidate after independent review has started');
  const original=readJson(path.join(options.peopleDir??PEOPLE_DIR,'extractions',book,`${chapter}.json`));
  const originalPacket=buildDateAuditPacket(book,chapter,options);
  if(originalPacket.sourceHash!==state.sourceHash||originalPacket.extractionHash!==state.extractionHash)throw new Error('Stale pending date revision');
  const active=readJson(path.join(directory,state.candidate));
  const activePacket=buildDateAuditPacket(book,chapter,{...options,extraction:active});
  let candidate=applyDateRepairProposal(active,proposal,activePacket);
  const combined=dateRepairDifference(original,candidate,originalPacket);
  candidate=applyDateRepairProposal(original,combined,originalPacket);
  if(typeof options.validateExtraction!=='function')throw new Error('Pending date revision requires production validation');
  options.validateExtraction(candidate);
  const key=`repair-${state.round}-${activePacket.extractionHash.slice(7,27)}`;
  writeJsonAtomic(path.join(directory,`${key}.json`),proposal);
  state.jobs[key]={agentId:proposal.author?.agentId??null};
  writeJsonAtomic(path.join(directory,'combined-proposal.json'),combined);
  state.round+=1;state.candidate=`candidate-${state.round}.json`;
  writeJsonAtomic(path.join(directory,state.candidate),candidate);writeJsonAtomic(stateFile,state);
  return buildDateAuditPacket(book,chapter,{...options,extraction:candidate});
}
