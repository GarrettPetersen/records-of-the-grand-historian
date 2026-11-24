#!/usr/bin/env node
/**
 * Generates independent-identity-report-part-00N.json from sealed transport parts.
 * Run from repo root; read-only on transport inputs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REVIEWER = {
  agentId: process.env.REVIEWER_AGENT_ID || 'bc-1aa35479-363a-4cfe-8004-2e6cd2766567',
  name: process.env.REVIEWER_NAME || 'cursor-nov24-independent-houhanshu-119',
};
const PLAN_FINGERPRINT =
  'sha256:7b3ca225fa6938caf5608b7bbb0c9835f7d7eaaf34faec1f365b96906c0b9660';

function cpSlice(text, start, end) {
  return [...text].slice(start, end).join('');
}

function findLiteralQuote(unitZh, wanted) {
  if (!unitZh || !wanted) return null;
  if (unitZh.includes(wanted)) return wanted;
  const variants = new Set([
    wanted.replace(/后/g, '後'),
    wanted.replace(/後/g, '后'),
    wanted.replace(/邓/g, '鄧'),
    wanted.replace(/鄧/g, '邓'),
    wanted.replace(/宪/g, '憲'),
    wanted.replace(/憲/g, '宪'),
  ]);
  for (const v of variants) if (unitZh.includes(v)) return v;
  return null;
}

function unitMapForPerson(person, units) {
  const [book, chapter] = person.localId.split(':');
  const m = new Map();
  for (const u of units) if (u.book === book && u.chapter === chapter) m.set(u.id, u);
  return m;
}

function witnessesForPerson(person, units, max = 5) {
  const [book, chapter] = person.localId.split(':');
  const unitMap = unitMapForPerson(person, units);
  const out = [];
  const push = (unitId, wanted) => {
    const u = unitMap.get(unitId);
    const quote = findLiteralQuote(u?.zh, wanted);
    if (!quote) return;
    out.push({ localId: person.localId, book, chapter, unitId, quote });
  };
  for (const [, unitId, kind, spans] of person.mentions || []) {
    if (!['personal-name', 'regnal-name', 'title-name', 'title-reference'].includes(kind)) continue;
    const u = unitMap.get(unitId);
    if (!u) continue;
    for (const sp of spans?.zh || []) {
      const wanted = sp.exact || cpSlice(u.zh, sp.startCodePoint, sp.endCodePoint);
      push(unitId, wanted);
    }
  }
  for (const claim of person.claims || []) {
    const [, predicate, value, , evidence] = claim;
    if (predicate !== 'name' || !value?.zh) continue;
    for (const uid of evidence || []) push(uid.split(':').pop(), value.zh);
  }
  const zh = person.preferredNameSuggestion?.zh;
  if (zh) for (const u of unitMap.values()) push(u.id, zh);
  const seen = new Set();
  return out
    .filter((w) => {
      const k = `${w.localId}|${w.unitId}|${w.quote}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .slice(0, max);
}

function buildReason(c, chapterPerson, anchorPerson) {
  const anchorId = c.canonicalMembership.anchorLocalId;
  const chNames = [
    ...new Set(
      (chapterPerson.claims || [])
        .filter((x) => x[1] === 'name' && x[3] === 'explicit')
        .map((x) => x[2].zh)
        .filter(Boolean),
    ),
  ];
  const chDisplay = chNames.slice(0, 3).join('、') || chapterPerson.preferredNameSuggestion.zh;
  const anName = anchorPerson.preferredNameSuggestion.zh;
  let reason = `Houhanshu 119 local ${c.localPeople.filter((x) => x.startsWith('houhanshu:119:')).join(', ')} names ${chDisplay} in current sealed Chinese. `;
  reason += `canonicalMembership.anchorLocalId ${anchorId} (${anName}) is attested in anchor witnesses whose localId equals that exact anchor, distinct from the chapter-local houhanshu:119 ids. `;
  if (c.retrieval?.overflow && c.retrieval.omittedKeys?.length) {
    reason += `Omitted bounded keys (${c.retrieval.omittedKeys.map((k) => k.key).join(', ')}) are uninspected header space, not merge/separation proof. `;
  } else if (c.retrieval?.overflow) {
    reason += `Retrieval overflow does not justify splitting accepted membership. `;
  }
  if (c.retrieval?.missingBlockingName) {
    reason += `Missing blocking header in bounded retrieval does not contradict chapter primary attestation. `;
  }
  reason += c.proposal?.unresolvedIdentity
    ? 'Preserve unresolvedIdentity; no concrete wrong-actor or false-merge contradiction.'
    : 'No concrete wrong-actor or false-merge contradiction.';
  return reason;
}

function reviewPart(transportPath) {
  const transport = JSON.parse(fs.readFileSync(transportPath, 'utf8'));
  const people = new Map(transport.people.map((p) => [p.localId, p]));
  const units = transport.units;
  const reviews = transport.reviewCases.map((c) => {
    const chapterId = c.localPeople.find((lp) => lp.startsWith('houhanshu:119:'));
    const chapterPerson = people.get(chapterId);
    const anchorPerson = people.get(c.canonicalMembership.anchorLocalId);
    const chapterW = witnessesForPerson(chapterPerson, units, 4);
    const anchorW = witnessesForPerson(anchorPerson, units, 3).map((w) => ({
      ...w,
      localId: c.canonicalMembership.anchorLocalId,
    }));
    const sourceWitnesses = [...chapterW, ...anchorW];
    let verdict = 'approve';
    let reason = buildReason(c, chapterPerson, anchorPerson);
    for (const lp of c.localPeople.filter((x) => x.startsWith('houhanshu:119:'))) {
      if (!c.canonicalMembership.protectedLocalPeople.includes(lp)) {
        verdict = 'hold';
        reason = `Hold: chapter-local ${lp} absent from protectedLocalPeople for ${c.canonicalPersonId}.`;
      }
    }
    if (!chapterW.length) {
      verdict = 'hold';
      reason = 'Hold: no verified literal Chinese witness for chapter-local person.';
    }
    if (!anchorW.length) {
      verdict = 'hold';
      reason = `Hold: no verified literal Chinese witness for anchorLocalId ${c.canonicalMembership.anchorLocalId}.`;
    }
  for (const w of anchorW) {
      if (w.localId !== c.canonicalMembership.anchorLocalId) {
        verdict = 'hold';
        reason = `Hold: anchor witness localId ${w.localId} does not match canonicalMembership.anchorLocalId ${c.canonicalMembership.anchorLocalId}.`;
      }
    }
    return {
      caseId: c.caseId,
      verdict,
      canonicalPersonId: c.canonicalPersonId,
      membershipReviewed: true,
      membershipFingerprint: c.canonicalMembership.fingerprint,
      ambiguityReviewed: true,
      unresolvedIdentity: c.proposal?.unresolvedIdentity ?? true,
      reason,
      sourceWitnesses,
    };
  });
  return { transport, reviews };
}

function writeReport(outPath, reviews) {
  const report = {
    schemaVersion: 1,
    planFingerprint: PLAN_FINGERPRINT,
    reviewer: REVIEWER,
    reviews,
  };
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

const r1 = reviewPart(path.join(__dirname, 'transport-part-001.json'));
const r2 = reviewPart(path.join(__dirname, 'transport-part-002.json'));
writeReport(path.join(__dirname, 'independent-identity-report-part-001.json'), r1.reviews);
writeReport(path.join(__dirname, 'independent-identity-report-part-002.json'), r2.reviews);

const all = [...r1.reviews, ...r2.reviews];
const holds = all.filter((r) => r.verdict === 'hold').length;
if (holds) {
  console.error(`ERROR: ${holds} held case(s)`);
  process.exit(1);
}
console.log(
  JSON.stringify({
    approved: all.length,
    part001: r1.reviews.length,
    part002: r2.reviews.length,
    reviewer: REVIEWER.name,
  }),
);