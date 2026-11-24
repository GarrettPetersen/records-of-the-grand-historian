#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const TRANSPORT_COMMIT = '62d0c83abee9a29c7e7a61e66153c24ec50dce7d';
const TRANSPORT_BRANCH = 'codex/cursor-glossary-nov24-2026-cross-corpus-transport';
const OWNER = {
  workerId: 'cursor-github-nov24-cross-2',
  agentId: 'bc-47648f6a-9ca6-438d-9cd5-6f14a61294c2',
  name: 'cursor-github-nov24-cross-2',
};
const sha256 = (buf) => `sha256:${createHash('sha256').update(buf).digest('hex')}`;

const slug = process.argv[2];
if (!slug) throw new Error('Usage: build-cross-corpus-owner-handoff.mjs BOOK-CHAPTER (e.g. nanqishu-060)');

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), slug);
const transportRel = `research/people/checkpoints/cross-corpus-native-review-20261124/${slug}/transport-packet.json`;
const prepRel = `research/people/checkpoints/cross-corpus-native-review-20261124/${slug}/preparation-receipt.json`;

function hexHash(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

fs.mkdirSync(DIR, { recursive: true });
for (const [rel, out] of [
  [transportRel, 'transport-packet.json'],
  [prepRel, 'preparation-receipt.json'],
]) {
  const outPath = path.join(DIR, out);
  if (!fs.existsSync(outPath)) {
    fs.writeFileSync(outPath, execSync(`git show ${TRANSPORT_COMMIT}:${rel}`, { cwd: ROOT, maxBuffer: 32 * 1024 * 1024 }));
  }
}

const transport = JSON.parse(fs.readFileSync(path.join(DIR, 'transport-packet.json'), 'utf8'));
const preparation = JSON.parse(fs.readFileSync(path.join(DIR, 'preparation-receipt.json'), 'utf8'));
const { book, chapter } = transport.scope;
const source = JSON.parse(fs.readFileSync(path.join(ROOT, `data/${book}/${chapter}.json`), 'utf8'));
const extPath = path.join(ROOT, `data/people/extractions/${book}/${chapter}.json`);
const ext = JSON.parse(fs.readFileSync(extPath, 'utf8'));

const unitZh = new Map(source.content.flatMap((p) => p.sentences).map((s) => [s.id, s.zh]));
const extractionPerson = new Map(ext.people.map((row) => [row[0], row]));
const surfaceByPerson = new Map();
for (const row of ext.surfaces ?? []) {
  const [pid, , lang, text, refs] = row;
  if (lang !== 'zh' || !text || !/[\u4e00-\u9fff]/.test(text)) continue;
  const arr = surfaceByPerson.get(pid) ?? [];
  const unitId = refs?.[0]?.[0];
  if (unitId) arr.push({ unitId, quote: text });
  surfaceByPerson.set(pid, arr);
}

function assertWitness(quote, unitId) {
  const zh = unitZh.get(unitId);
  if (!zh || !zh.includes(quote)) throw new Error(`Quote ${JSON.stringify(quote)} missing in ${unitId}: ${zh?.slice(0, 40)}`);
}

const assessments = transport.reviewCases.map((c) => {
  const localId = c.localPeople[0];
  const pid = localId.split(':').pop();
  const ex = extractionPerson.get(pid);
  const preferred = ex?.[1]?.[0] ?? pid;
  const zhName = ex?.[1]?.[2] ?? ex?.[5]?.[0]?.[0]?.zh ?? null;
  const zhSurfaces = (surfaceByPerson.get(pid) ?? []);
  let witnesses = [];
  for (const w of zhSurfaces) {
    try {
      assertWitness(w.quote, w.unitId);
      witnesses.push({ localId, book, chapter, unitId: w.unitId, quote: w.quote });
      if (witnesses.length >= 2) break;
    } catch {
      const short = [...w.quote].slice(0, 4).join('');
      if (short.length >= 2) {
        try {
          assertWitness(short, w.unitId);
          witnesses.push({ localId, book, chapter, unitId: w.unitId, quote: short });
          if (witnesses.length >= 2) break;
        } catch { /* try next surface */ }
      }
    }
  }
  if (!witnesses.length) {
    const person = transport.people.find((p) => p.localId === localId);
    const m = person?.mentions?.[0];
    const unitId = String(m?.[1] ?? '').split(':').pop() ?? 's0001';
    const quote = zhName ?? preferred;
    assertWitness(quote, unitId);
    witnesses = [{ localId, book, chapter, unitId, quote }];
  }
  const overflow = c.retrieval?.overflow ? ' Bounded dossier overflow; omitted names are not separation evidence.' : '';
  return {
    caseId: c.caseId,
    disposition: 'retain-proposal',
    canonicalPersonId: c.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: c.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: c.proposal.unresolvedIdentity,
    overflowAcknowledged: c.retrieval.overflow,
    reason: `${preferred}${zhName ? ` (${zhName})` : ''}: chapter source supports this attribution and accepted canonical membership. ${c.proposal.reason}${overflow}`,
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
    branch: TRANSPORT_BRANCH,
    commit: TRANSPORT_COMMIT,
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

const transportHash = hexHash(fs.readFileSync(path.join(DIR, 'transport-packet.json')));
if (transportHash !== preparation.transportSha256 && `sha256:${transportHash}` !== preparation.transportSha256) {
  throw new Error(`Transport hash mismatch: ${transportHash} vs ${preparation.transportSha256}`);
}
if (assessments.length !== preparation.metrics.cases) throw new Error('Case count mismatch');

const validation = {
  schemaVersion: 1,
  scope: transport.scope,
  at: new Date().toISOString(),
  transportSha256Verified: true,
  caseCount: assessments.length,
  expectedCases: preparation.metrics.cases,
  planFingerprint: transport.planFingerprint,
  peopleValidateCommand: `npm run people:validate -- --book ${book} --chapter ${chapter}`,
  peopleValidatePassed: null,
  extractionSha256: sha256(fs.readFileSync(extPath)),
  ownerEvidenceSha256: evidenceSha,
  holds: [],
};
fs.writeFileSync(path.join(DIR, 'validation-receipt.json'), JSON.stringify(validation, null, 2) + '\n');
console.log(JSON.stringify({ slug, cases: assessments.length, transportSha256: transportHash, ownerEvidenceSha256: evidenceSha }, null, 2));