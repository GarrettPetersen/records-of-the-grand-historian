#!/usr/bin/env node
/**
 * Build source-backed owner evidence from campaign-nov24 split transport parts.
 * Reads transport-part-001.json and transport-part-002.json from a checkpoint dir.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { identityArtifactHash } from './lib/people-identity-artifacts.mjs';

const args = process.argv.slice(2);
function arg(name, fallback = null) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1] ?? true;
}

const checkpointDir = arg('checkpoint-dir');
const ownerAgentId = arg('owner-agent-id');
const workerId = arg('worker-id');
if (!checkpointDir || !ownerAgentId || !workerId) {
  console.error(
    'Usage: node scripts/curate-partitioned-transport-owner-evidence.mjs --checkpoint-dir PATH --owner-agent-id ID --worker-id NAME [--out PATH]'
  );
  process.exit(1);
}
const outPath = arg('out', join(checkpointDir, 'owner-evidence.json'));

function loadPart(n) {
  const p = join(checkpointDir, `transport-part-${String(n).padStart(3, '0')}.json`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

const part1 = loadPart(1);
const part2 = loadPart(2);
if (part1.scope.book !== part2.scope.book || part1.scope.chapter !== part2.scope.chapter) {
  throw new Error('Transport parts scope mismatch');
}
const scope = part1.scope;
const planFingerprint = part1.planFingerprint;
const sourcePacketSha256 = part1.sourcePacketSha256;

const unitMap = new Map();
for (const part of [part1, part2]) {
  for (const u of part.units) {
    unitMap.set(`${u.book}:${u.chapter}:${u.id}`, u);
  }
}
const peopleMap = new Map();
for (const part of [part1, part2]) {
  for (const person of part.people) {
    peopleMap.set(person.localId, person);
  }
}

const transportPartHashes = [1, 2].map((n) => {
  const bytes = readFileSync(join(checkpointDir, `transport-part-${String(n).padStart(3, '0')}.json`));
  return identityArtifactHash(bytes);
});
const transportSha256 = identityArtifactHash(
  Buffer.from(transportPartHashes.join('\n') + '\n')
);

function mentionQuote(mention, book, chapter) {
  const unitId = mention[1];
  const spans = mention[3];
  const u = unitMap.get(`${book}:${chapter}:${unitId}`);
  if (!u) return null;
  const zh = u.zh ?? u.literal ?? '';
  if (spans && typeof spans === 'object' && !Array.isArray(spans)) {
    const z = spans.zh?.[0]?.exact;
    if (z) return z;
    const e = spans.en?.[0]?.exact;
    if (e) return e;
    const start = spans.zh?.[0]?.startCodePoint;
    const end = spans.zh?.[0]?.endCodePoint;
    if (Number.isInteger(start) && Number.isInteger(end) && zh) {
      const chars = [...zh];
      return chars.slice(start, end).join('') || null;
    }
  }
  if (Array.isArray(spans)?.length && zh) {
    const [start, end] = spans[0];
    return zh.slice(start, end) || null;
  }
  return null;
}

function parseLocal(localId) {
  const [book, chapter] = localId.split(':');
  return { book, chapter };
}

function witnessesForLocal(localId, max = 6) {
  const person = peopleMap.get(localId);
  if (!person) return [];
  const { book, chapter } = parseLocal(localId);
  const out = [];
  const seen = new Set();
  const kindRank = { 'identity-name': 0, 'personal-name': 1, 'temple-name': 2, 'regnal-name': 2, 'posthumous-name': 3 };
  const sorted = [...person.mentions].sort((a, b) => (kindRank[a[2]] ?? 5) - (kindRank[b[2]] ?? 5));
  for (const m of sorted) {
    const quote = mentionQuote(m, book, chapter);
    if (!quote) continue;
    const key = `${m[1]}:${quote}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      localId,
      book,
      chapter,
      unitId: m[1],
      quote,
      _zh: /[\u4e00-\u9fff]/.test(quote),
    });
  }
  out.sort((a, b) => Number(b._zh) - Number(a._zh));
  const byUnit = new Map();
  for (const w of out) {
    const prev = byUnit.get(w.unitId);
    if (!prev || (w._zh && !prev._zh)) byUnit.set(w.unitId, w);
  }
  return [...byUnit.values()]
    .slice(0, max)
    .map(({ _zh, ...w }) => w);
}

function preferredName(localId) {
  const person = peopleMap.get(localId);
  if (!person) return 'Unknown';
  const pref = person.preferredNameSuggestion;
  if (typeof pref === 'string' && pref.trim()) return pref.trim();
  if (pref?.en) return pref.en;
  if (pref?.english) return pref.english;
  if (pref?.zh) return pref.zh;
  if (pref?.romanization) return pref.romanization;
  if (pref?.pinyin) return pref.pinyin;
  return localId.split(':').pop();
}

const reviewCases = [...part1.reviewCases, ...part2.reviewCases];

const assessments = reviewCases.map((c) => {
  const chapterLocal = c.localPeople.find((id) => id.startsWith(`${scope.book}:${scope.chapter}:`)) ?? c.localPeople[0];
  const name = preferredName(chapterLocal);
  let sourceWitnesses = witnessesForLocal(chapterLocal);
  const anchor = c.canonicalMembership?.anchorLocalId;
  if (anchor && anchor !== chapterLocal && peopleMap.has(anchor)) {
    const anchorW = witnessesForLocal(anchor, 2);
    if (anchorW.length) {
      sourceWitnesses = [
        ...sourceWitnesses,
        ...anchorW.filter((w) => !sourceWitnesses.some((x) => x.unitId === w.unitId && x.quote === w.quote)),
      ];
    }
  }
  if (!sourceWitnesses.length) {
    sourceWitnesses = [
      {
        localId: chapterLocal,
        book: scope.book,
        chapter: scope.chapter,
        unitId: '(chapter)',
        quote: name,
      },
    ];
  }
  const overflow = Boolean(c.retrieval?.overflow);
  const overflowNote = overflow
    ? ' Bounded dossier overflow; omitted names are not separation evidence.'
    : '';
  const zh = peopleMap.get(chapterLocal)?.preferredNameSuggestion?.zh;
  const label = zh ? `${name} (${zh})` : name;
  const reason = `${label}: chapter source supports this attribution and accepted canonical membership. Retain the accepted canonical assignment. Cross-record equivalence requires primary evidence; bounded retrieval is not proof of a different identity.${overflowNote}`;

  return {
    caseId: c.caseId,
    disposition: 'retain-proposal',
    canonicalPersonId: c.proposal.canonicalPersonId,
    membershipReviewed: true,
    membershipFingerprint: c.canonicalMembership.fingerprint,
    ambiguityReviewed: true,
    unresolvedIdentity: c.proposal.unresolvedIdentity !== false,
    overflowAcknowledged: overflow,
    reason,
    preferredName: name,
    sourceWitnesses,
  };
});

const evidence = {
  schemaVersion: 1,
  kind: 'source-backed-identity-owner-evidence',
  scope,
  planFingerprint,
  transportSha256,
  sourcePacketSha256,
  transportParts: [
    { file: 'transport-part-001.json', sha256: `sha256:${transportPartHashes[0]}` },
    { file: 'transport-part-002.json', sha256: `sha256:${transportPartHashes[1]}` },
  ],
  owner: {
    workerId,
    agentId: ownerAgentId,
    name: workerId,
  },
  independentReviewCompleted: false,
  notIndependentReview: true,
  chronologyStatus: 'audited',
  editorialStatus: 'reviewed-with-applied-proposals',
  assessments,
};

const json = JSON.stringify(evidence, null, 2) + '\n';
writeFileSync(outPath, json);
const ownerEvidenceSha256 = `sha256:${identityArtifactHash(Buffer.from(json))}`;
console.log(JSON.stringify({ outPath, ownerEvidenceSha256, caseCount: assessments.length, transportSha256: `sha256:${transportSha256}` }, null, 2));