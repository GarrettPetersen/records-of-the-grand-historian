import fs from 'node:fs';
import path from 'node:path';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '111';
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(path.join(PEOPLE_DIR, 'date-audits', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const commemorationClaimIds = [111, 118, 127, 135, 143, 156, 163, 171, 179, 187, 195, 732, 1204, 1214];
const activeHintPersonIds = ['p014', 'p015', 'p016', 'p017', 'p018', 'p020', 'p021', 'p022', 'p023', 'p024', 'p025', 'p108', 'p112', 'p163', 'p165'];
const auditFinding = id => audit.findings.find(finding => finding.id === id);

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash ||
    audit.extractionHash !== packet.extractionHash || sha256(JSON.stringify(extraction)) !== audit.extractionHash) {
  throw new Error('Jiuwudaishi 111 published audit or current staging extraction pin is stale');
}
const eventFinding = auditFinding('finding-posthumous-event-kind');
const hintFinding = auditFinding('finding-posthumous-active-hints');
const p166Finding = auditFinding('finding-p166-cross-person-reception');
if (!eventFinding || !hintFinding || !p166Finding ||
    !same(commemorationClaimIds.map(id => `claim-${id}`), eventFinding.items.filter(id => id.startsWith('claim-'))) ||
    !same(activeHintPersonIds.map(id => `hints-${id}`), hintFinding.items.filter(id => id.startsWith('hints-'))) ||
    !same(['claim-1216', 'claim-1219', 'hints-p166'], p166Finding.items.filter(id => id.startsWith('claim-') || id.startsWith('hints-')))) {
  throw new Error('Published Jiuwudaishi 111 audit scope no longer matches the two authorized repair groups');
}

const changes = [
  ...commemorationClaimIds.map(number => {
    const before = extraction.claims[number - 1];
    if (!before || before[1] !== 'event-participation' || before[2]?.kind !== 'ritual' || before[2]?.role !== 'honoree' ||
        typeof before[2]?.dateContext?.westernYear?.year !== 'number' || !Array.isArray(before[4]) || !before[4].length) {
      throw new Error(`claim-${number} is not the audited dated ritual honoree claim`);
    }
    const after = structuredClone(before);
    after[2].kind = 'posthumous-commemoration';
    return {
      kind: 'reclassify-reception-kind',
      id: `claim-${number}`,
      before,
      after,
      reason: `${eventFinding.problem} ${eventFinding.action}`,
    };
  }),
  ...activeHintPersonIds.map(personId => {
    const person = extraction.people.find(row => row[0] === personId);
    const before = person?.[4]?.a;
    if (!person || !Array.isArray(before) || !before.includes('AD 951')) throw new Error(`${personId} lacks the audited AD 951 hint`);
    const after = before.filter(hint => hint !== 'AD 951');
    if (after.length !== before.length - 1 || after.includes('AD 951')) throw new Error(`${personId} did not remove exactly one AD 951 hint`);
    if (personId === 'p112' && !same(after, ['AD 950'])) throw new Error('p112 must retain its independently explicit AD 950 death hint');
    if (personId !== 'p112' && before.includes('before AD 951') && !after.includes('before AD 951')) throw new Error(`${personId} must retain its before-951 bound`);
    return {
      kind: 'hints',
      personId,
      before,
      after,
      reason: `${hintFinding.problem} ${hintFinding.action}`,
    };
  }),
  (() => {
    const before = extraction.claims[1215];
    if (!before || before[0] !== 'p166' || before[1] !== 'attestation' || before[2]?.westernYear?.year !== 951 ||
        !same(before[4], ['s0146', 's0147'])) throw new Error('claim-1216 is not the audited cross-person p166 attestation');
    return { kind: 'remove', id: 'claim-1216', before, reason: `${p166Finding.problem} ${p166Finding.action}` };
  })(),
  (() => {
    const before = extraction.claims[1218];
    if (!before || before[0] !== 'p166' || before[1] !== 'enfeoffment' || before[2]?.action !== 'posthumously-enfeoffed' ||
        !same(before[4], ['s0147'])) throw new Error('claim-1219 is not the audited p166 posthumous enfeoffment');
    const after = [before[0], 'event-participation', {
      kind: 'posthumous-commemoration', role: 'honoree', action: before[2].action,
      title: structuredClone(before[2].title), dateContext: structuredClone(before[2].dateContext),
    }, before[3], structuredClone(before[4])];
    return { kind: 'reclassify-reception-claim', id: 'claim-1219', before, after, reason: `${p166Finding.problem} ${p166Finding.action}` };
  })(),
  (() => {
    const person = extraction.people.find(row => row[0] === 'p166');
    const before = person?.[4]?.a;
    if (!person || !same(before, ['AD 951'])) throw new Error('p166 must have only the audited AD 951 hint');
    return { kind: 'hints', personId: 'p166', before, after: [], reason: `${p166Finding.problem} ${p166Finding.action}` };
  })(),
];

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: { name: 'Codex Jiuwudaishi 111 posthumous-commemoration date-repair candidate', agentId: 'date_repair_candidate_jiuwudaishi111' },
  changes,
};

function replay(stored, sealedProposal) {
  if (sealedProposal.sourceHash !== packet.sourceHash || sealedProposal.extractionHash !== packet.extractionHash ||
      sha256(JSON.stringify(stored)) !== packet.extractionHash) throw new Error('Candidate replay source pin is stale');
  if (!same(sealedProposal.changes, changes) || sealedProposal.changes.length !== 32) throw new Error('Candidate replay changes are not the sealed authorized scope');
  const candidate = structuredClone(stored);
  const seen = new Set();
  for (const change of sealedProposal.changes) {
    if (typeof change.reason !== 'string' || change.reason.trim().length < 20) throw new Error('Every replayed change needs source-based reasoning');
    if (change.kind === 'reclassify-reception-kind') {
      if (!/^claim-[1-9]\d*$/.test(change.id) || seen.has(change.id)) throw new Error('Invalid or duplicate commemoration claim change');
      seen.add(change.id);
      const index = Number(change.id.slice(6)) - 1;
      if (!same(stored.claims[index], change.before) || !same(candidate.claims[index], change.before)) throw new Error(`${change.id} before value is stale`);
      if (!Array.isArray(change.after) || change.after.length !== 5 || change.after[0] !== change.before[0] || change.after[1] !== 'event-participation' ||
          change.before[2]?.kind !== 'ritual' || change.after[2]?.kind !== 'posthumous-commemoration') throw new Error(`${change.id} is not a ritual-to-posthumous reclassification`);
      const beforeValue = structuredClone(change.before[2]);
      const afterValue = structuredClone(change.after[2]);
      delete beforeValue.kind;
      delete afterValue.kind;
      if (!same(beforeValue, afterValue) || !same(change.after.slice(3), change.before.slice(3))) throw new Error(`${change.id} altered evidence, role, action, or chronology`);
      candidate.claims[index] = structuredClone(change.after);
    } else if (change.kind === 'reclassify-reception-claim') {
      if (change.id !== 'claim-1219' || seen.has(change.id)) throw new Error('Invalid or duplicate p166 reception-claim change');
      seen.add(change.id);
      const index = 1218;
      if (!same(stored.claims[index], change.before) || !same(candidate.claims[index], change.before)) throw new Error('claim-1219 before value is stale');
      const expected = [change.before[0], 'event-participation', {
        kind: 'posthumous-commemoration', role: 'honoree', action: change.before[2]?.action,
        title: change.before[2]?.title, dateContext: change.before[2]?.dateContext,
      }, change.before[3], change.before[4]];
      if (!same(change.after, expected)) throw new Error('claim-1219 did not preserve its source-grounded posthumous enfeoffment');
      candidate.claims[index] = structuredClone(change.after);
    } else if (change.kind === 'remove') {
      if (change.id !== 'claim-1216' || seen.has(change.id) || !same(stored.claims[1215], change.before)) throw new Error('Invalid p166 cross-person attestation removal');
      seen.add(change.id);
      candidate.claims[1215] = null;
    } else if (change.kind === 'hints') {
      const id = `hints-${change.personId}`;
      if (seen.has(id)) throw new Error(`Duplicate hint change ${id}`);
      seen.add(id);
      const person = candidate.people.find(row => row[0] === change.personId);
      if (!person || !same(person[4]?.a ?? [], change.before) || !Array.isArray(change.after) ||
          change.before.filter(hint => hint === 'AD 951').length !== 1 || change.after.includes('AD 951') ||
          !same(change.after, change.before.filter(hint => hint !== 'AD 951'))) throw new Error(`${id} did not remove only the AD 951 hint`);
      person[4] = { ...person[4], a: structuredClone(change.after) };
    } else throw new Error(`Unsupported sealed repair operation ${change.kind}`);
  }
  candidate.claims = candidate.claims.filter(Boolean);
  if (seen.size !== 32 || same(candidate, stored)) throw new Error('Candidate replay did not make exactly the authorized changes');
  return candidate;
}

const candidate = replay(extraction, proposal);
if (!same(replay(extraction, proposal), candidate)) throw new Error('Exact candidate replay mismatch');
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const candidateExtractionHash = sha256(JSON.stringify(candidate));
const sealedCandidateHash = sha256(JSON.stringify(proposal));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
writeJsonAtomic(path.join(directory, candidateFile), {
  schemaVersion: 1,
  kind: 'date-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  auditReportHash: sha256(JSON.stringify(audit)),
  author: proposal.author,
  sealedCandidateHash,
  candidateExtractionHash,
  proposal,
  candidate,
  candidatePacket,
  validation: { status: 'passed', proposalReplay: 'PASS', exactReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: [eventFinding, hintFinding, p166Finding] },
});
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1,
  kind: 'independent-staged-date-repair-review-packet',
  book,
  chapter,
  candidateFile,
  sourceHash: packet.sourceHash,
  originalExtractionHash: packet.extractionHash,
  sealedCandidateHash,
  candidateExtractionHash,
  candidatePacket,
  auditEvidence: { findings: [eventFinding, hintFinding, p166Finding] },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, operations: changes.length, validation: validation.stats, geometry: 'PASS' }));
