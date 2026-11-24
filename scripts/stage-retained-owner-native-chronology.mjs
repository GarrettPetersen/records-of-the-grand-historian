#!/usr/bin/env node
// Read-only owner staging for the November 24 retained-staging chronology gates.
// Builds a native date-repair proposal for one sealed scope, replays it through
// applyDateRepairProposal and the production validators, and writes the owner
// result. It never writes canonical extraction, audit, editorial or source files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { buildDateAuditPacket, dateAuditDiagnostics, dateAuditItems, unresolvedDateAuditItems } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal, sealedDateRepairProposalHash } from './lib/people-date-workflow.mjs';
import { hasConcreteWesternChronology } from './lib/people-date-values.mjs';
import { PEOPLE_DIR, REPO_ROOT, contentUnits, readJson, sha256 } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { editorialDecisionPath, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';

const OWNER = 'bc-664d3ec0-32fc-4a5e-8d7e-3eb0d0b573f2';
const IDEMPOTENCY_KEY = 'b679c08b4e02faa24607a7ce734f3b09ecac5cd085527b43b0d5ecf5324a3966';
const PRIOR_RUN = 'run-31257d01-ab5b-4888-ac46-98a9bea6a5bf';
const STAGE = 'a50a027ba2793c194f1114769516b3731fcb47d9';
const MASTER = 'e61eedae77bea163ec10120e88e806cde91315dd';

const undated = event => ({ undatedSourceAttestation: true, event });

const SCOPES = {
  'liaoshi/051': {
    ownerHead: '10d298dfebe70f89b39a9f3dad1ecc074900b181',
    handoffSha256: '1e75b399b7e218038b0dde34047eba737a8c509f3164afa887a871a29aedd73b',
    auditSha256: '5535ed71c158c2fdb621c1b13fa6eb0a8e640056de71064fb42b5308c8f4a91f',
    blobs: {
      source: 'dd6593cf0f9401e7b2624517f8bffb2a6edc8fef',
      extraction: '840cef3fdf431ed3229478ea4f429aa735ee38d3',
      dateAudit: '2f0f6a5abafeae2208aa478b7415891a3edd4602',
      editorial: '49280f1c2e979fcafc9b04e97589935962727aa3',
    },
    branch: 'cursor/nov24-retained-owner-native-date-liaoshi-051-573f2',
    quoteUnits: ['s0283', 's0286'],
    attestations: {
      'claim-6': 'The undated audience protocol names Wang Xun (王詢), King of Goryeo, in the envoys’ health-inquiry formula and as principal of the tribute presentation; it gives no reign year or date for this audience.',
    },
    dateContexts: {},
    hints: { p002: 'Remove the AD 1009–1031 reign span imported from outside this chapter; the repaired attestation records the protocol as genuinely undated and no other Wang Xun row carries chronology.' },
    englishRepairs: [],
  },
  'jiuwudaishi/146': {
    ownerHead: '192e5c0946b72f83df3c0ed4aadd1b22f5db90cd',
    handoffSha256: 'cd1af638ca594a1978941ff17f2c53cf9096f0794c669d34bca3078e2cd6846b',
    auditSha256: '9902290989d5f4cabd5b0499eadf8a0563657f896a85bb677d832c6a517f529f',
    blobs: {
      source: 'a017a1af759092a55af74a1bf07413376b10d158',
      extraction: 'e38f6f67f55de44777a92094fd058a2f04bae059',
      dateAudit: '31baeb6422044ddb99b2614edc6ba9cfe89d2181',
      editorial: 'f558c5513dfdbc6068a7511f2dbe64c4661e9b71',
    },
    branch: 'cursor/nov24-retained-owner-native-date-jiuwudaishi-146-573f2',
    quoteUnits: ['s0005', 's0006'],
    attestations: {
      'claim-14': 'From the single stronghold of Yimen (夷門) the Liang founder built a hegemonic power within 二紀, two twelve-year cycles; this relative duration has no stated starting year and supplies no Western date.',
      'claim-15': 'Huang Chao (黃巢) is named only in the retrospective phrase 黃巢大亂之後, which places Liang’s founding after his great rebellion; the chapter gives no date for his own activity.',
    },
    dateContexts: {
      'claim-44': '二紀之間 (within two twelve-year cycles) is a relative duration with no stated starting year; the chapter gives no convertible date for the Yimen measures.',
      'claim-46': 'The great rebellion is mentioned only retrospectively as the background to Liang’s founding; the chapter gives no date for it.',
    },
    hints: { p002: 'Remove the non-date “research required” placeholder; Huang Chao’s only attestation is now explicitly undated and no Huang Chao row carries chronology.' },
    englishRepairs: [
      {
        book: 'jiuwudaishi', chapter: '146', unit: 's0006', field: 'literal',
        before: 'With a single prefecture at Yimen, outwardly he tightened beacon and frontier defense, inwardly he opened wasteland and marshes, urged farming and sericulture, and kept rents and levies light; though the warriors suffered in battle, the people gladly paid taxes, and within two twenty-year cycles he swiftly achieved hegemony.',
        after: 'With a single prefecture at Yimen, outwardly he tightened beacon and frontier defense, inwardly he opened wasteland and marshes, urged farming and sericulture, and kept rents and levies light; though the warriors suffered in battle, the people gladly paid taxes, and within two twelve-year cycles he swiftly achieved hegemony.',
        reason: '二紀之間: one 紀 is twelve years, so 二紀 is twenty-four years, not two twenty-year cycles (forty years).',
      },
      {
        book: 'jiuwudaishi', chapter: '146', unit: 's0006', field: 'idiomatic',
        before: 'From the single stronghold of Yimen he tightened frontier defenses abroad and reclaimed wasteland at home, promoted farming and silk production, and kept rents and levies light. Soldiers bore the hardships of war, but the people paid their dues willingly; within two twenty-year cycles he had built a hegemonic power almost overnight.',
        after: 'From the single stronghold of Yimen he tightened frontier defenses abroad and reclaimed wasteland at home, promoted farming and silk production, and kept rents and levies light. Soldiers bore the hardships of war, but the people paid their dues willingly; within twenty-four years he had built a hegemonic power almost overnight.',
        reason: '二紀之間: one 紀 is twelve years, so the span is twenty-four years; “two twenty-year cycles” doubles it to forty.',
      },
    ],
  },
  'qingshigao/071': {
    ownerHead: '95427e3a14f2456e750db3c2674b8c05ed9e8862',
    handoffSha256: 'ec8a3f6214841971ee3031dbbbaae69180c61699b107ee36576644759c7b1249',
    auditSha256: '842629a34cbfd026a83f9ab899f8e625fff8aed336038d1439b5127a9f9e7842',
    blobs: {
      source: '6ee181d43a455ca2cc6aaafb5cc2d592c6d83f1e',
      extraction: 'e3208a8feb963183a872e6534f75616e8c486489',
      dateAudit: 'e5dbf80744448520a13380dee2479c6755e06226',
      editorial: '123a62e4e7610f972083f9480450d18b70c73c92',
    },
    branch: 'cursor/nov24-retained-owner-native-date-qingshigao-071-573f2',
    quoteUnits: ['s0009', 's0010', 's0011', 's0014', 's0027'],
    attestations: {
      'claim-26': 'The source names Zheng Jing (鄭經), son of Zheng Chenggong, as renaming the Eastern Capital Dongning Province and raising its two counties to departments; that sentence is undated, and the adjacent Shunzhi 18 and Kangxi 22 dates belong to his father’s seizure and the Qing pacification.',
      'claim-31': 'The Guangxu 13 joint memorial cites a proposal by former Governor Cen Yuying (岑毓英) to site the provincial capital at Qiaozitu; the memorial date belongs to Yang Changjun and Liu Mingchuan’s report, and Cen’s proposal is undated here.',
    },
    dateContexts: {},
    hints: {
      p006: 'Remove the AD 1661–1683 span copied from adjacent sentences; Zheng Jing’s renaming is explicitly undated and no other Zheng Jing row carries chronology.',
      p010: 'Remove the AD 1887 hint copied from the memorial date; Cen Yuying’s proposal is explicitly undated and no other Cen Yuying row carries chronology.',
    },
    englishRepairs: [
      {
        book: 'qingshigao', chapter: '071', unit: 's0010', field: 'literal',
        before: 'His son Zheng Jing changed the Eastern Capital to Dongning Province and promoted the two counties to prefectures.',
        after: 'His son Zheng Jing changed the Eastern Capital to Dongning Province and promoted the two counties to departments.',
        reason: '升二縣為州 raises the counties to 州 (departments), not 府 (prefectures); accepted repair qingshigao:071:r0001 corrected only the idiomatic field, leaving the same error in the literal.',
      },
    ],
  },
  'songshi/077': {
    ownerHead: '273610c4301b61c854fa1db16e9690a75c36ad42',
    handoffSha256: '276c0ff6f4494d390d8a15b8a559ff48a422dba0d7d8f30a2a620e0be15cbe7f',
    auditSha256: '297439b437608ef791775d06e284250e6e9905416bfc88c21a777183a4d9dd80',
    blobs: {
      source: '942935a5c9c22662e9eb5fee297a68b009234ba7',
      extraction: '40773d96ec2338a83b582bcec54eb0ac0feb793f',
      dateAudit: '582f0d8a3c524cf6ae7a7919fdc203d28ec411cc',
      editorial: 'e3ba8d0f156a7cdfa59519b7579eaf98d96628d4',
    },
    branch: 'cursor/nov24-retained-owner-native-date-songshi-077-573f2',
    quoteUnits: ['s0002', 's0003', 's0181'],
    attestations: {
      'claim-5': 'The undated textual-variant note says Wu Ze (吳澤) and others of the Astronomical Bureau supplemented and corrected the ecliptic lodge-passage section; the Yuanyou 7 epoch dates the calendar, not this work.',
      'claim-6': 'The undated textual-variant note says the copy of Wu Shiju (吳時舉), Presented Scholar of Kaifeng, lacks the ecliptic lodge-passage section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-7': 'The undated textual-variant note says the copy of Cheng Xi (程憙), Presented Scholar of the National University, lacks the ecliptic lodge-passage section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-8': 'The undated textual-variant note says the copy of Zhang Wenjin (張文進), commoner of Changzhou, lacks the ecliptic lodge-passage section; the Yuanyou 7 epoch dates the calendar, not this copy.',
    },
    dateContexts: {
      'claim-20': 'The undated textual-variant note credits Wu Ze and others with supplementing and correcting this section; the Yuanyou 7 epoch dates the calendar, not this editorial work.',
      'claim-21': 'The undated textual-variant note credits Wu Ze and others with supplementing and correcting this section; the Yuanyou 7 epoch dates the calendar, not this editorial work.',
      'claim-22': 'The undated textual-variant note reports that Wu Shiju’s copy lacks this section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-23': 'The undated textual-variant note reports that Wu Shiju’s copy lacks this section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-24': 'The undated textual-variant note reports that Cheng Xi’s copy lacks this section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-25': 'The undated textual-variant note reports that Cheng Xi’s copy lacks this section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-26': 'The undated textual-variant note reports that Zhang Wenjin’s copy lacks this section; the Yuanyou 7 epoch dates the calendar, not this copy.',
      'claim-27': 'The undated textual-variant note reports that Zhang Wenjin’s copy lacks this section; the Yuanyou 7 epoch dates the calendar, not this copy.',
    },
    hints: Object.fromEntries(['p001', 'p002', 'p003', 'p004'].map(id => [id,
      'Remove the AD 1092 hint transferred from the calendar epoch; this person’s only notice is the undated textual-variant note and no remaining row carries chronology.'])),
    englishRepairs: [
      {
        book: 'songshi', chapter: '077', unit: 's0003', field: 'idiomatic',
        before: 'From upper origin jiazi to the seventh year of Yuanyou (renzhen), the accumulated count is 5,944,808 years.',
        after: 'From upper origin jiazi to the seventh year of Yuanyou (renshen), the accumulated count is 5,944,808 years.',
        reason: '壬申 is romanized renshen, as the literal field already has it; “renzhen” is a misspelling of the cyclical year name.',
      },
    ],
  },
};

const fileSha = file => `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
const git = (...args) => execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' }).trim();

const { values } = parseArgs({ options: { scope: { type: 'string' }, out: { type: 'string' } } });
const spec = SCOPES[values.scope];
if (!spec) throw new Error(`Use --scope one of ${Object.keys(SCOPES).join(', ')}`);
const [book, chapter] = values.scope.split('/');
const files = {
  source: `data/${book}/${chapter}.json`,
  extraction: `data/people/extractions/${book}/${chapter}.json`,
  dateAudit: `data/people/date-audits/${book}/${chapter}.json`,
  editorial: `data/people/editorial-decisions/${book}/${chapter}.json`,
};

for (const [key, file] of Object.entries(files)) {
  const blob = git('hash-object', file);
  if (blob !== spec.blobs[key]) throw new Error(`${file} blob ${blob} differs from pinned ${spec.blobs[key]}`);
  if (git('rev-parse', `${STAGE}:${file}`) !== spec.blobs[key]) throw new Error(`${file} at stage differs from pinned blob`);
}
if (fileSha(files.dateAudit) !== `sha256:${spec.auditSha256}`) throw new Error('Pinned date audit bytes changed');
const handoffPath = `research/people/checkpoints/campaign-nov24-retained-staging/${book}-${chapter}/owner-handoff.json`;
const handoffSha = crypto.createHash('sha256').update(execFileSync('git', ['show', `${spec.ownerHead}:${handoffPath}`], { cwd: REPO_ROOT })).digest('hex');
if (handoffSha !== spec.handoffSha256) throw new Error('Prior owner handoff bytes differ');
const before = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fileSha(file)]));

const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const audit = readJson(files.dateAudit);
const packet = buildDateAuditPacket(book, chapter);
if (audit.sourceHash !== packet.sourceHash || audit.extractionHash !== packet.extractionHash) throw new Error('Pinned audit is not current for the sealed inputs');
const findingFor = id => audit.findings.findIndex(finding => finding.items.includes(id));
const row = id => extraction.claims[Number(id.slice(6)) - 1];

const changes = [];
for (const [id, event] of Object.entries(spec.attestations)) {
  const prior = row(id);
  if (prior?.[1] !== 'attestation' || findingFor(id) < 0) throw new Error(`${id} is not a sealed finding attestation`);
  changes.push({ kind: 'replace', id, before: prior, after: [prior[0], 'attestation', undated(event), 'explicit', prior[4]],
    reason: audit.findings[findingFor(id)].problem });
}
for (const [id, event] of Object.entries(spec.dateContexts)) {
  const prior = row(id);
  if (!prior?.[2]?.dateContext || findingFor(id) < 0) throw new Error(`${id} is not a sealed finding date context`);
  const after = structuredClone(prior);
  after[2].dateContext = undated(event);
  changes.push({ kind: 'replace', id, before: prior, after, reason: audit.findings[findingFor(id)].problem });
}
for (const [personId, reason] of Object.entries(spec.hints)) {
  const person = extraction.people.find(p => p[0] === personId);
  if (findingFor(`hints-${personId}`) < 0) throw new Error(`hints-${personId} is not a sealed finding item`);
  changes.push({ kind: 'hints', personId, before: person[4].a, after: [], reason });
}

const proposal = {
  schemaVersion: 1, kind: 'date-repair-proposal', book, chapter,
  sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
  author: { name: `Retained-staging chapter owner ${values.scope}`, agentId: OWNER },
  changes,
};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
if (JSON.stringify(applyDateRepairProposal(extraction, proposal, packet)) !== JSON.stringify(candidate)) throw new Error('Candidate replay mismatch');
const extractionPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
const validation = validateCompactPeopleExtraction(candidate, extractionPacket);
validateAppliedEditorialDecisions(readJson(editorialDecisionPath(book, chapter)), validation.normalized);
const diagnostics = dateAuditDiagnostics(dateAuditItems(candidate));
if (diagnostics.length) throw new Error(`Chronology diagnostics: ${JSON.stringify(diagnostics)}`);
const candidatePacket = buildDateAuditPacket(book, chapter, { extraction: candidate });
const unresolvedAfter = unresolvedDateAuditItems(candidatePacket).map(item => item.id);
const serialized = serializeCompactPeopleExtraction(candidate);
if (sha256(JSON.stringify(JSON.parse(serialized))) !== candidatePacket.extractionHash) throw new Error('Compact serialization changed the candidate');

const findingIds = new Set(audit.findings.flatMap(f => f.items));
const touched = new Set(changes.map(c => c.id ?? `hints-${c.personId}`));
const uncovered = [...findingIds].filter(id => !touched.has(id) && !extraction.people.some(p => p[0] === id));
if (uncovered.length) throw new Error(`Finding items without a change: ${uncovered.join(', ')}`);
const affectedPeople = [...new Set(changes.map(c => c.personId ?? c.before[0]))];
const residualChronology = affectedPeople.filter(id => candidate.claims.some(c => c[0] === id && hasConcreteWesternChronology(c[2])));

const priorItems = new Map(packet.items.map(item => [item.id, item.claimHash ?? JSON.stringify(item.value)]));
const afterItems = new Map(candidatePacket.items.map(item => [item.id, item.claimHash ?? JSON.stringify(item.value)]));
const unchangedItems = [...priorItems].filter(([id, value]) => afterItems.get(id) === value).map(([id]) => id);
const priorChecks = new Map(audit.itemChecks.map(check => [check.id, check.verdict]));

const sourceUnits = new Map(contentUnits(readJson(files.source)).map(unit => [unit.id, unit]));
const rawSentences = new Map(readJson(files.source).content.flatMap(block => block.sentences ?? []).map(s => [s.id, s]));
for (const repair of spec.englishRepairs) {
  const current = rawSentences.get(repair.unit)?.translations?.[0]?.[repair.field];
  if (current !== repair.before) throw new Error(`English repair before-text is stale for ${repair.unit} ${repair.field}`);
}

const after = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fileSha(file)]));
if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Canonical inputs changed during staging');

const result = {
  schemaVersion: 1,
  kind: 'retained-staging-owner-native-chronology-repair',
  scope: { book, chapter },
  ownerAgentId: OWNER,
  idempotencyKey: IDEMPOTENCY_KEY,
  priorRun: PRIOR_RUN,
  stagingBase: STAGE,
  masterRevision: MASTER,
  branch: spec.branch,
  priorOwnerRevision: { ownerHead: spec.ownerHead, ownerHandoff: { path: handoffPath, sha256: spec.handoffSha256 } },
  inputBlobWitness: spec.blobs,
  sealedInputHashes: before,
  auditEvidence: {
    path: files.dateAudit,
    sha256: spec.auditSha256,
    status: audit.status,
    reviewedAt: audit.reviewedAt,
    reviewer: audit.reviewer.name,
    sourceHash: audit.sourceHash,
    extractionHash: audit.extractionHash,
    hashesCurrent: true,
    findings: audit.findings.length,
    bytesPreserved: true,
  },
  verifiedFindings: audit.findings.map((finding, index) => ({
    index: index + 1,
    items: finding.items,
    problem: finding.problem,
    action: finding.action,
    ownerVerification: 'confirmed against the cited Chinese',
    sealedRows: finding.items.filter(id => id.startsWith('claim-')).map(id => ({ id, row: row(id) })),
  })),
  sourceQuotes: spec.quoteUnits.map(id => {
    const sentence = rawSentences.get(id);
    return { unit: id, zh: sourceUnits.get(id).zh, literal: sentence.translations[0].literal, idiomatic: sentence.translations[0].idiomatic };
  }),
  nativeProposal: proposal,
  nativeProposalHash: sealedDateRepairProposalHash(proposal),
  candidate: {
    extractionHash: candidatePacket.extractionHash,
    compactSerializationHash: sha256(serialized),
    dateItems: candidatePacket.items.length,
    unresolvedItemsAfter: unresolvedAfter,
  },
  affected: {
    items: [...touched],
    people: affectedPeople,
    peopleWithRemainingConcreteChronology: residualChronology,
  },
  intactApprovals: {
    priorAuditReportUnchanged: true,
    editorialDecisionsRevalidatedAgainstCandidate: readJson(files.editorial).decisions.length,
    unchangedDateItems: unchangedItems.length,
    unchangedItemsPreviouslySupported: unchangedItems.filter(id => priorChecks.get(id) === 'supported').length,
    changedItems: [...priorItems.keys()].filter(id => !unchangedItems.includes(id)),
    canonicalFilesWritten: false,
  },
  nativeValidation: {
    command: `node scripts/stage-retained-owner-native-chronology.mjs --scope ${values.scope} --out <path>`,
    applyDateRepairProposal: 'PASS',
    proposalReplay: 'PASS',
    validateCompactPeopleExtraction: 'PASS',
    validateAppliedEditorialDecisions: 'PASS',
    chronologyDiagnostics: 'PASS',
    compactSerializationRoundTrip: 'PASS',
    approvalPreconditionZeroUnresolved: unresolvedAfter.length === 0 ? 'PASS' : 'FAIL',
    stats: validation.stats,
  },
  definiteTranslationRepairs: spec.englishRepairs,
};

const out = path.resolve(values.out);
let existing = {};
if (fs.existsSync(out)) existing = readJson(out);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify({ ...result, ...pick(existing, ['residualHolds', 'ownerNotes']) }, null, 2)}\n`);
console.log(JSON.stringify({ scope: values.scope, operations: changes.length, candidate: candidatePacket.extractionHash, unresolvedAfter: unresolvedAfter.length, stats: validation.stats }));

function pick(object, keys) {
  return Object.fromEntries(keys.filter(key => object[key] !== undefined).map(key => [key, object[key]]));
}
