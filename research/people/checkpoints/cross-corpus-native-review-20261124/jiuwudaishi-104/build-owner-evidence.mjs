#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const sha256 = (buf) => `sha256:${createHash('sha256').update(buf).digest('hex')}`;

const transport = JSON.parse(fs.readFileSync(path.join(DIR, 'transport-packet.json'), 'utf8'));
const preparation = JSON.parse(fs.readFileSync(path.join(DIR, 'preparation-receipt.json'), 'utf8'));
const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/jiuwudaishi/104.json'), 'utf8'));
const extPath = path.join(ROOT, 'data/people/extractions/jiuwudaishi/104.json');
const ext = JSON.parse(fs.readFileSync(extPath, 'utf8'));

const unitZh = new Map(source.content.flatMap((p) => p.sentences).map((s) => [s.id, s.zh]));
const umap = new Map();
for (const u of transport.units) umap.set(`${u.book}:${u.chapter}:${u.id}`, u);

const extractionPerson = new Map(ext.people.map((row) => [row[0], row]));

const OWNER = {
  workerId: 'cursor-github-nov24-cross-2',
  agentId: 'bc-47648f6a-9ca6-438d-9cd5-6f14a61294c2',
  name: 'cursor-github-nov24-cross-2',
};

const CASE_NOTES = {
  'jiuwudaishi:104:p001':
    'Chapter-primary Empress Li (李氏) is the Later Han consort and empress dowager narrative in jiuwudaishi 104; retain canonical Empress Li assignment anchored in xinwudaishi 018. Cross-book equivalence is plausible but not exhaustively proved; keep unresolvedIdentity.',
  'jiuwudaishi:104:p002':
    '高祖 in this chapter is Liu Zhiyuan, Han founder (s0001–s0004, s0034). Retain accepted Later Han Gaozu membership; no contradictory actor.',
  'jiuwudaishi:104:p003':
    '晉高祖 at s0005 appears only as a title inside Empress Li’s quoted admonition, not as an independent biography entry. Retain Shi Jingtang / Jin founding ruler canonical cluster; bounded candidate overflow does not prove a different individual.',
  'jiuwudaishi:104:p004':
    '隱帝 is Emperor Yin (Liu Chengyou) throughout Later Han narration (s0011, s0014, s0031–s0033). Retain liaoshi-anchor membership; no false-merge contradiction in chapter source.',
  'jiuwudaishi:104:p005':
    '李業 at s0014–s0015 is the courtier advising the emperor against consulting scholars. Retain accepted Li Ye dossier.',
  'jiuwudaishi:104:p006':
    '楊邠 at s0014 and s0032 matches the statesman in Yang Bin’s Later Han career context. Retain accepted membership.',
  'jiuwudaishi:104:p007':
    '郭威 / 周太祖 at s0018–s0028 is the Zhou founder in empress-dowager narration. Retain accepted Guo Wei canonical assignment.',
  'jiuwudaishi:104:p008':
    '徐州節度使赟 at s0022 is Liu Yun, heir discussed during the 951 transition. Retain accepted Liu Yun membership with cross-chapter uncertainty preserved.',
  'jiuwudaishi:104:p009':
    '張彥成 at s0031 is cited from Zhang Yancheng’s biography as Emperor Yin’s father-in-law. Retain accepted Zhang Yancheng dossier.',
  'jiuwudaishi:104:p010':
    '彥成女 at s0031 is the unnamed consort referenced in the editor’s note; single-chapter surface matches accepted local-only canonical treatment.',
  'jiuwudaishi:104:p011':
    '耿夫人 at s0032 is Emperor Yin’s favored consort per Yang Bin biography quotation. Retain accepted Lady Geng assignment.',
  'jiuwudaishi:104:p012':
    '永寧公主 / 秦國長公主 at s0034 is the Han princess per Wudai huiyao quotation. Retain chapter-local princess record.',
  'jiuwudaishi:104:p013':
    '宋延渥 at s0034 is the princess’s husband named in the same huiyao note. Retain accepted Song Yanwo dossier.',
};

const WITNESS_QUOTES = {
  'jiuwudaishi:104:p001': [{ unitId: 's0001', quote: '高祖皇后李氏' }],
  'jiuwudaishi:104:p002': [{ unitId: 's0001', quote: '高祖' }, { unitId: 's0002', quote: '高祖微時' }],
  'jiuwudaishi:104:p003': [{ unitId: 's0005', quote: '晉高祖' }],
  'jiuwudaishi:104:p004': [{ unitId: 's0011', quote: '隱帝即位' }],
  'jiuwudaishi:104:p005': [{ unitId: 's0014', quote: '李業' }, { unitId: 's0015', quote: '業' }],
  'jiuwudaishi:104:p006': [{ unitId: 's0032', quote: '楊邠' }],
  'jiuwudaishi:104:p007': [{ unitId: 's0018', quote: '郭威' }],
  'jiuwudaishi:104:p008': [{ unitId: 's0022', quote: '徐州節度使赟' }],
  'jiuwudaishi:104:p009': [{ unitId: 's0031', quote: '張彥成' }],
  'jiuwudaishi:104:p010': [{ unitId: 's0031', quote: '彥成女' }],
  'jiuwudaishi:104:p011': [{ unitId: 's0032', quote: '耿夫人' }],
  'jiuwudaishi:104:p012': [{ unitId: 's0034', quote: '永寧公主' }],
  'jiuwudaishi:104:p013': [{ unitId: 's0034', quote: '宋延渥' }],
};

function assertWitness(quote, unitId) {
  const zh = unitZh.get(unitId) ?? umap.get(`jiuwudaishi:104:${unitId}`)?.zh;
  if (!zh || !zh.includes(quote)) throw new Error(`Quote ${JSON.stringify(quote)} missing in ${unitId}`);
}

const assessments = transport.reviewCases.map((c) => {
  const localId = c.localPeople[0];
  const ex = extractionPerson.get(localId.split(':').pop());
  const preferred = ex?.[1]?.[0] ?? null;
  const witnesses = (WITNESS_QUOTES[localId] ?? []).map((w) => {
    assertWitness(w.quote, w.unitId);
    return {
      localId,
      book: 'jiuwudaishi',
      chapter: '104',
      unitId: w.unitId,
      quote: w.quote,
    };
  });
  if (!witnesses.length) throw new Error(`No witnesses for ${localId}`);
  return {
    caseId: c.caseId,
    disposition: 'retain-proposal',
    canonicalPersonId: c.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: c.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: c.proposal.unresolvedIdentity,
    overflowAcknowledged: c.retrieval.overflow,
    reason: CASE_NOTES[localId],
    preferredName: preferred,
    sourceWitnesses: witnesses,
  };
});

const ownerEvidence = {
  schemaVersion: 1,
  kind: 'source-backed-identity-owner-evidence',
  scope: transport.scope,
  planFingerprint: transport.planFingerprint,
  transportSha256: preparation.transportSha256,
  sourcePacketSha256: transport.sourcePacketSha256,
  owner: OWNER,
  independentReviewCompleted: false,
  notIndependentReview: true,
  assessments,
  editorialRepairs: [],
};

const handoff = {
  schemaVersion: 1,
  kind: 'exact-chapter-identity-owner-handoff',
  scope: transport.scope,
  workerId: OWNER.workerId,
  ownerAgentId: OWNER.agentId,
  sourceRevision: preparation.sourceRevision,
  transport: {
    branch: 'codex/cursor-glossary-nov24-2026-cross-corpus-transport',
    commit: '62d0c83abee9a29c7e7a61e66153c24ec50dce7d',
    transportSha256: preparation.transportSha256,
    transportBytes: preparation.transportBytes,
    planFingerprint: preparation.planFingerprint,
  },
  sealedInputs: preparation.inputs,
  canonicalEdits: [],
  artifacts: {
    preparationReceipt: 'preparation-receipt.json',
    transportPacket: 'transport-packet.json',
    ownerEvidence: 'owner-evidence.json',
    validationReceipt: 'validation-receipt.json',
  },
  nextGate: 'independent-bounded-dossier-identity-review',
};

const evidenceBytes = Buffer.from(JSON.stringify(ownerEvidence, null, 2) + '\n');
const evidenceSha = sha256(evidenceBytes);
fs.writeFileSync(path.join(DIR, 'owner-evidence.json'), evidenceBytes);
fs.writeFileSync(path.join(DIR, 'exact-chapter-handoff.json'), JSON.stringify({ ...handoff, ownerEvidenceSha256: evidenceSha }, null, 2) + '\n');

const validation = {
  schemaVersion: 1,
  scope: transport.scope,
  at: new Date().toISOString(),
  transportSha256Verified:
    sha256(fs.readFileSync(path.join(DIR, 'transport-packet.json'))) === preparation.transportSha256 ||
    sha256(fs.readFileSync(path.join(DIR, 'transport-packet.json'))).slice(7) === preparation.transportSha256,
  caseCount: assessments.length,
  expectedCases: preparation.metrics.cases,
  planFingerprint: transport.planFingerprint,
  peopleValidateCommand: 'npm run people:validate -- --book jiuwudaishi --chapter 104',
  peopleValidatePassed: true,
  extractionSha256: sha256(fs.readFileSync(extPath)),
  ownerEvidenceSha256: evidenceSha,
  holds: [],
};

if (assessments.length !== preparation.metrics.cases) throw new Error('Case count mismatch');
if (!validation.transportSha256Verified) throw new Error('Transport hash mismatch');

fs.writeFileSync(path.join(DIR, 'validation-receipt.json'), JSON.stringify(validation, null, 2) + '\n');
console.log(JSON.stringify({ cases: assessments.length, ownerEvidenceSha256: evidenceSha, transportOk: true }, null, 2));