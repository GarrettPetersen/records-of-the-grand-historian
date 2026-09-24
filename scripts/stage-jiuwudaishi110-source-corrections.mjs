import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic } from './lib/people-content.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';

const book = 'jiuwudaishi';
const chapter = '110';
const auditCommit = '83f497a3c358dec985d4fc6efda3a27855b81e80';
const auditPath = `data/people/date-audits/${book}/${chapter}.json`;
const audit = JSON.parse(execFileSync('git', ['show', `${auditCommit}:${auditPath}`], { encoding: 'utf8' }));
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });

if (audit.status !== 'needs-revision' || audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) {
  throw new Error('Published Jiuwudaishi 110 audit does not match the canonical staging source and extraction');
}
if (sha256(JSON.stringify(extraction)) !== audit.extractionHash) throw new Error('Canonical extraction hash mismatch');

const findingFor = id => {
  const finding = audit.findings.find(item => item.items.includes(id));
  if (!finding) throw new Error(`Missing published finding for ${id}`);
  return finding;
};
const claim = id => {
  const row = extraction.claims[Number(id.slice(6)) - 1];
  if (!row) throw new Error(`Missing ${id}`);
  return row;
};
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const replacements = new Map([
  ['claim-50', row => {
    const next = structuredClone(row);
    next[2].action = 'posthumously honored as Emperor Ruihe, temple Xinzu, mausoleum Wenling';
    return next;
  }],
  ['claim-342', row => {
    const next = structuredClone(row);
    next[2].title = { en: 'acting Military Governor of Xuzhou (許州)', zh: '許州節度使' };
    return next;
  }],
  ['claim-343', row => {
    const next = structuredClone(row);
    next[2].title = { en: 'acting Military Governor of Xuzhou (徐州)', zh: '徐州節度使' };
    return next;
  }],
  ['claim-344', row => {
    const next = structuredClone(row);
    next[2].title = { en: 'acting Military Governor of Huazhou (滑州)', zh: '滑州節度使' };
    return next;
  }],
]);

const claimChanges = [...replacements].map(([id, repair]) => {
  const before = claim(id);
  const after = repair(before);
  return { kind: 'claim-replace', id, before, after, reason: findingFor(id).action };
});

const guo = extraction.people.find(person => person[0] === 'p004');
if (!guo) throw new Error('Missing Guo Jing person record');
const templeAliasIndex = guo[5].findIndex(([name]) => name.kind === 'temple' && name.zh === '信祖');
if (templeAliasIndex < 0 || guo[5][templeAliasIndex][0].en !== 'Xizu' || guo[5][templeAliasIndex][0].pinyin !== 'Xìnzǔ') {
  throw new Error('Guo Jing temple alias does not match the audited stale value');
}
const templeAliasAfter = structuredClone(guo[5][templeAliasIndex]);
templeAliasAfter[0].en = 'Xinzu';
const evidenceChange = {
  kind: 'person-alias-replace',
  personId: 'p004',
  aliasIndex: templeAliasIndex,
  before: guo[5][templeAliasIndex],
  after: templeAliasAfter,
  reason: 'Synchronize Guo Jing’s explicit temple-name alias with claim-50 and cited s0005: 廟號信祖 is Xīn zǔ / Xinzu, not Xizu.',
};

const proposal = {
  schemaVersion: 1,
  kind: 'source-faithful-factual-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  auditCommit,
  auditReportHash: sha256(JSON.stringify(audit)),
  author: { name: 'Codex Jiuwudaishi 110 source-faithful correction candidate', agentId: 'date_repair_candidate_jiuwudaishi110' },
  claimChanges,
  evidenceChanges: [evidenceChange],
};

if (proposal.claimChanges.length !== 4 || proposal.evidenceChanges.length !== 1) {
  throw new Error('Expected exactly four factual claim corrections and one required evidence-alias synchronization');
}

function replay(stored, sealed) {
  if (!same(sha256(JSON.stringify(stored)), sealed.extractionHash)) throw new Error('Stale replay input');
  const candidate = structuredClone(stored);
  const seenClaims = new Set();
  for (const change of sealed.claimChanges) {
    if (!/^claim-(50|342|343|344)$/.test(change.id) || seenClaims.has(change.id)) throw new Error(`Unexpected or duplicate claim target ${change.id}`);
    seenClaims.add(change.id);
    const index = Number(change.id.slice(6)) - 1;
    if (!same(candidate.claims[index], change.before)) throw new Error(`Stale claim replay target ${change.id}`);
    if (!Array.isArray(change.after) || change.after.length !== 5 || change.after[0] !== change.before[0] || change.after[1] !== change.before[1] || !same(change.after[3], change.before[3]) || !same(change.after[4], change.before[4])) {
      throw new Error(`Invalid factual claim replacement ${change.id}`);
    }
    candidate.claims[index] = structuredClone(change.after);
  }
  if (seenClaims.size !== 4) throw new Error('Replay must cover exactly the four audited claims');
  for (const change of sealed.evidenceChanges) {
    if (change.kind !== 'person-alias-replace' || change.personId !== 'p004' || change.aliasIndex !== templeAliasIndex) throw new Error('Unexpected evidence synchronization target');
    const person = candidate.people.find(row => row[0] === change.personId);
    if (!person || !same(person[5][change.aliasIndex], change.before)) throw new Error('Stale temple alias replay target');
    person[5][change.aliasIndex] = structuredClone(change.after);
  }
  return candidate;
}

const candidate = replay(extraction, proposal);
if (!same(replay(extraction, proposal), candidate)) throw new Error('Candidate replay mismatch');
if (candidate.claims[341][2].title.zh !== '許州節度使' || candidate.claims[342][2].title.zh !== '徐州節度使' ||
    candidate.claims[341][2].title.en === candidate.claims[342][2].title.en) {
  throw new Error('He Fujin and Wang Yanchao jurisdictions collapsed during replay');
}
const validation = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket(book, chapter));
const geometry = dateAuditDiagnostics(dateAuditItems(candidate));
if (geometry.length) throw new Error(`Candidate chronology geometry failure: ${JSON.stringify(geometry)}`);

const sealedCandidateHash = sha256(JSON.stringify(proposal));
const candidateExtractionHash = sha256(JSON.stringify(candidate));
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const directory = path.join(PEOPLE_DIR, 'date-repairs', book, chapter);
fs.mkdirSync(directory, { recursive: true });
const candidateFile = `staged-candidate-${sealedCandidateHash.slice(7, 27)}.json`;
const handoff = {
  schemaVersion: 1,
  kind: 'source-faithful-factual-repair-candidate-handoff',
  book,
  chapter,
  canonicalSourceHash: packet.sourceHash,
  canonicalExtractionHash: packet.extractionHash,
  auditCommit,
  auditReportHash: proposal.auditReportHash,
  author: proposal.author,
  sealedCandidateHash,
  candidateExtractionHash,
  proposal,
  candidate,
  candidatePacket,
  validation: { status: 'passed', exactReplay: 'PASS', compactValidation: 'PASS', chronologyGeometry: 'PASS', stats: validation.stats },
  auditEvidence: { findings: audit.findings },
  publication: 'staging-only',
  masterMutation: 'NONE',
};
writeJsonAtomic(path.join(directory, candidateFile), handoff);
writeJsonAtomic(path.join(directory, `${sealedCandidateHash.slice(7)}.candidate-review-packet.json`), {
  schemaVersion: 1,
  kind: 'independent-source-faithful-factual-repair-review-packet',
  book,
  chapter,
  candidateFile,
  sourceHash: packet.sourceHash,
  originalExtractionHash: packet.extractionHash,
  sealedCandidateHash,
  candidateExtractionHash,
  candidatePacket,
  auditEvidence: { findings: audit.findings },
  scope: { factualClaimCorrections: ['claim-50', 'claim-342', 'claim-343', 'claim-344'], requiredEvidenceSynchronization: ['p004 temple alias 信祖'] },
});
console.log(JSON.stringify({ sealedCandidateHash, candidateExtractionHash, candidateFile, claimCorrections: proposal.claimChanges.length, evidenceSynchronizations: proposal.evidenceChanges.length, stats: validation.stats }));
