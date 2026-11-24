#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { peopleDigest } from '../../../../scripts/lib/people-identity-seal.mjs';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const SEALED = process.env.JINSHU030_RESIDUAL_SEALED ?? '/tmp/jinshu030-residual-id';
const partNum = Number(process.argv[2]);
if (!Number.isInteger(partNum) || partNum < 1 || partNum > 2) throw new Error('Usage: assemble-transport-part.mjs NNN');

const file = `transport-part-${String(partNum).padStart(3, '0')}.json`;
const prep = JSON.parse(fs.readFileSync(path.join(SEALED, 'preparation-receipt.json'), 'utf8'));
const handPath = path.join(__dir, `hand-reasons-${String(partNum).padStart(3, '0')}.json`);
if (!fs.existsSync(handPath)) throw new Error(`Missing ${handPath}`);
const hand = JSON.parse(fs.readFileSync(handPath, 'utf8'));

const receipt = prep.reviewParts.find((p) => p.file === file);
const transportPath = path.join(SEALED, file);
const transportBytes = fs.readFileSync(transportPath);
const transportSha = createHash('sha256').update(transportBytes).digest('hex');
if (receipt.sha256 !== transportSha) throw new Error('transport sha mismatch');

const part = JSON.parse(transportBytes.toString('utf8'));

function parseLocalId(localId) {
  const [book, chapter] = localId.split(':');
  return { book, chapter };
}

function pickWitnesses(rc) {
  const localPeople = new Map(part.people.map((p) => [p.localId, p]));
  const required = new Set([...rc.localPeople, rc.canonicalMembership.anchorLocalId]);
  const witnesses = [];
  for (const localId of required) {
    const person = localPeople.get(localId);
    const { book, chapter } = parseLocalId(localId);
    let best = null;
    for (const m of person.mentions ?? []) {
      const unitId = m[1];
      const u = part.units.find((x) => x.book === book && x.chapter === chapter && x.id === unitId);
      if (!u?.zh) continue;
      for (const span of m[3]?.zh ?? []) {
        if (span.exact && u.zh.includes(span.exact)) {
          const score = span.exact.length;
          if (!best || score > best.score) {
            best = { localId, book, chapter, unitId, quote: span.exact, score };
          }
        }
      }
      if (!(m[3]?.zh ?? []).length) {
        for (const claim of person.claims ?? []) {
          if (claim[1] === 'name' && claim[2]?.zh && u.zh.includes(claim[2].zh)) {
            const zh = claim[2].zh;
            if (!best || zh.length > best.score) {
              best = { localId, book, chapter, unitId, quote: zh, score: zh.length };
            }
          }
        }
      }
    }
    if (!best) throw new Error(`no witness ${localId}`);
    witnesses.push({
      localId: best.localId,
      book: best.book,
      chapter: best.chapter,
      unitId: best.unitId,
      quote: best.quote,
    });
  }
  return witnesses;
}

const reviews = part.reviewCases.map((rc) => {
  const entry = hand[rc.caseId];
  if (!entry?.reason || entry.reason.length < 10) throw new Error(`missing hand reason ${rc.caseId}`);
  const verdict = entry.verdict ?? 'approve';
  const unresolvedIdentity =
    entry.unresolvedIdentity !== undefined ? entry.unresolvedIdentity : rc.proposal.unresolvedIdentity;
  if (verdict === 'approve' && rc.proposal.unresolvedIdentity && !unresolvedIdentity) {
    throw new Error(`cannot clear unresolved ${rc.caseId}`);
  }
  if (verdict === 'approve' && !rc.proposal.unresolvedIdentity && unresolvedIdentity) {
    throw new Error(`must clear unresolved ${rc.caseId}`);
  }
  return {
    caseId: rc.caseId,
    verdict,
    canonicalPersonId: rc.canonicalPersonId,
    membershipReviewed: verdict !== 'hold',
    membershipFingerprint: rc.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity,
    reason: entry.reason,
    sourceWitnesses: entry.sourceWitnesses ?? pickWitnesses(rc),
  };
});

const requiredReport = {
  schemaVersion: 1,
  planFingerprint: prep.planFingerprint,
  reviewer: {
    agentId: 'bc-ab2acfed-77c9-4601-afc7-18feb78285d3',
    name: 'Cursor Cloud independent Jinshu 030 identity reviewer',
  },
  reviews,
};

const envelope = {
  schemaVersion: 1,
  kind: 'jinshu030-native-identity-transport-part-review',
  scope: { book: 'jinshu', chapter: '030' },
  transportPart: {
    file,
    sha256: `sha256:${transportSha}`,
    artifactRunId: 45303644882,
    artifactName: 'jinshu-030-native-residual-identity-evidence',
  },
  planFingerprint: prep.planFingerprint,
  planInputs: prep.inputs,
  sourcePacketSha256: prep.sourcePacketSha256,
  pins: {
    stagingCommit: '8630bbad2df1b99862c45ef3dd9afded036ec92e',
    sourceRevisionSeal: 'df3597084a867dba42f60954f48e4a1f0396d811',
    retainedCompositionFingerprint: prep.retainedCompositionFingerprint,
    priorFullReviewCheckpoint: 'research/people/checkpoints/jinshu030-native-identity-parts-20261124/',
    priorDateReplayCheckpoint: 'research/people/checkpoints/jinshu030-p154-date-composition-20261124/',
  },
  authorAgentIds: ['grokbot-24'],
  requiredReport,
  reportFingerprint: peopleDigest(requiredReport),
};

const out = path.join(__dir, `transport-part-${String(partNum).padStart(3, '0')}-independent-review.json`);
fs.writeFileSync(out, JSON.stringify(envelope, null, 2) + '\n');
console.log(JSON.stringify({ out, reportFingerprint: envelope.reportFingerprint, transportSha256: envelope.transportPart.sha256, cases: reviews.length }, null, 2));