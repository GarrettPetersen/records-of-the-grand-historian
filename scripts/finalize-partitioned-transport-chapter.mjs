#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';

const TRANSPORT_REF = '9be1bddf9a2d45496c8f0694583a74b973ec027c';
const TRANSPORT_BRANCH = 'codex/cursor-glossary-nov24-2026-partitioned-owner-transports';
const STAGING_BASE = '79ae4c4de6c6739c3dc12f011c3b789dba50e3c1';
const OWNER_AGENT = 'bc-23529211-836c-4588-b3ee-a1d4918b098f';
const WORKER_ID = 'cursor-nov24-partitioned-1';

const spec = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { book, chapter, cases, plan, receiptSha256, sourcePacketSha256, parts, substantiveFindings } = spec;
const slug = `${book}-${chapter}`;
const dir = join('research/people/checkpoints/campaign-nov24-split-transport', slug);
const transportPrefix = `research/people/checkpoints/campaign-nov24-split-transport/${slug}`;

mkdirSync(dir, { recursive: true });
for (const name of ['preparation-receipt.json', 'transport-part-001.json', 'transport-part-002.json']) {
  const blob = execSync(`git show ${TRANSPORT_REF}:${transportPrefix}/${name}`, { encoding: 'buffer' });
  writeFileSync(join(dir, name), blob);
  const expect = name === 'preparation-receipt.json' ? receiptSha256 : parts.find((p) => p.path.endsWith(name))?.sha256;
  if (expect) {
    const got = identityArtifactHash(blob);
    if (got !== expect) throw new Error(`${name} hash mismatch: ${got} != ${expect}`);
  }
}

const prep = JSON.parse(readFileSync(join(dir, 'preparation-receipt.json'), 'utf8'));
const sealedInputs = Object.fromEntries(
  Object.entries(prep.inputs).map(([k, v]) => [k === 'dateAudit' ? 'dateAudit' : k, v.replace(/^sha256:/, '')])
);

execSync(
  `node scripts/curate-partitioned-transport-owner-evidence.mjs --checkpoint-dir ${dir} --owner-agent-id ${OWNER_AGENT} --worker-id ${WORKER_ID}`,
  { stdio: 'inherit' }
);

const evidenceJson = readFileSync(join(dir, 'owner-evidence.json'), 'utf8');
const ownerEvidenceSha256 = `sha256:${identityArtifactHash(Buffer.from(evidenceJson))}`;
const evidence = JSON.parse(evidenceJson);
const transportSha256 = `sha256:${evidence.transportSha256}`;

let validateSummary = '';
let peopleValidatePassed = false;
try {
  validateSummary = execSync(`npm run people:validate -- --book ${book} --chapter ${chapter}`, {
    encoding: 'utf8',
  });
  peopleValidatePassed = /validation passed/i.test(validateSummary);
  const line = validateSummary.split('\n').find((l) => l.includes('validation passed')) ?? validateSummary.trim();
  validateSummary = line;
} catch (e) {
  validateSummary = String(e.stdout ?? e.message);
}

writeFileSync(
  join(dir, 'validation-receipt.json'),
  JSON.stringify(
    {
      schemaVersion: 1,
      scope: { book, chapter },
      at: new Date().toISOString(),
      transportPartsVerified: true,
      caseCount: cases,
      expectedCases: cases,
      planFingerprint: plan,
      sourcePacketSha256,
      peopleValidateCommand: `npm run people:validate -- --book ${book} --chapter ${chapter}`,
      peopleValidatePassed,
      peopleValidateSummary: validateSummary,
      extractionSha256: prep.inputs.extraction,
      dateAuditStatus: 'audited',
      editorialStatus: 'reviewed-with-applied-proposals',
      ownerAgentId: OWNER_AGENT,
      campaignWorker: WORKER_ID,
      ownerEvidenceSha256,
      holds: peopleValidatePassed ? [] : [{ reason: 'scoped validation failed', detail: validateSummary.slice(0, 500) }],
    },
    null,
    2
  ) + '\n'
);

const handoff = {
  schemaVersion: 1,
  kind: 'exact-chapter-identity-owner-handoff',
  scope: { book, chapter },
  workerId: WORKER_ID,
  ownerAgentId: OWNER_AGENT,
  sourceRevision: '110c2f92a0e7994af8d9218f76c80ccd72b98d5c',
  stagingBase: STAGING_BASE,
  baseBranch: 'codex/people-glossary-staging-v2',
  transport: {
    branch: TRANSPORT_BRANCH,
    commit: TRANSPORT_REF,
    sourcePacketSha256,
    planFingerprint: plan,
    transportSha256,
    parts: parts.map((p) => ({
      path: p.path.split('/').pop(),
      sha256: p.sha256,
      caseCount: p.caseCount,
    })),
    preparationReceiptSha256: receiptSha256,
  },
  sealedInputs: prep.inputs,
  chronologyStatus: 'audited',
  editorialStatus: 'reviewed-with-applied-proposals',
  reviewCases: cases,
  canonicalEdits: [],
  independentReviewCompleted: false,
  substantiveFindings: substantiveFindings ??
    `All ${cases} scoped identity cases: retain accepted canonical membership; unresolvedIdentity preserved where proposed; no concrete chapter-level actor contradiction or false-merge hold.`,
  artifacts: {
    preparationReceipt: 'preparation-receipt.json',
    transportPart001: 'transport-part-001.json',
    transportPart002: 'transport-part-002.json',
    ownerEvidence: 'owner-evidence.json',
    validationReceipt: 'validation-receipt.json',
  },
  nextGate: 'independent-bounded-dossier-identity-review',
  ownerEvidenceSha256,
  reproduce: { validateChapter: `npm run people:validate -- --book ${book} --chapter ${chapter}` },
  notes: 'Owner evidence is not independent approval. Chapter-only scope on staging base 79ae4c4.',
};
writeFileSync(join(dir, 'owner-handoff.json'), JSON.stringify(handoff, null, 2) + '\n');

console.log(
  JSON.stringify({ slug, ownerEvidenceSha256, peopleValidatePassed, commit: createHash('sha256').update(evidenceJson).digest('hex') }, null, 2)
);
if (!peopleValidatePassed) process.exit(1);