#!/usr/bin/env node
/**
 * Jinshu 081: scoped representation of the 89 supported unresolved blockers
 * from independent report 36299ce8 (post-1c6bd6d6).
 *
 * Does NOT invent Western dates, clear genuine reign/era unresolved holds,
 * reverse English repairs, or edit validators. Converts only death-verb-only
 * deaths (no calendar on the death unit) to event-only death + undated
 * attestation, which the native schema accepts. Keeps real reign/era
 * unresolved pairs and claim-521.
 */
import path from 'node:path';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { PEOPLE_DIR, readJson, writeTextAtomic, writeJsonAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { hasDateBearingChronology } from './lib/people-date-values.mjs';

const book = 'jinshu';
const chapter = '081';
const audit = readJson('/tmp/jinshu081-date-audit-post-1c6bd6d6.json');
const extraction = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const packet = buildDateAuditPacket(book, chapter, { extraction });
const units = Object.fromEntries(packet.units.map((unit) => [unit.id, unit]));

if (packet.extractionHash !== audit.extractionHash) {
  throw new Error(`extractionHash drift ${packet.extractionHash} vs audit ${audit.extractionHash}`);
}
if (packet.sourceHash !== audit.sourceHash) {
  throw new Error(`sourceHash drift`);
}

const unresolvedIds = audit.findings[0].items;
if (unresolvedIds.length !== 89) throw new Error(`expected 89, got ${unresolvedIds.length}`);

const REIGN_DEATH = new Map([
  ['claim-168', '太寧末'],
  ['claim-169', '惠帝末'],
  ['claim-295', '成帝即位'],
  ['claim-964', '安帝反正'],
]);
const KEEP_ERA_ATT = new Set(['claim-52', 'claim-521']); // 惠帝末 / 永嘉中

function zhFor(refs) {
  return refs.map((id) => units[id]?.zh || '').join('');
}

function isDeathVerbOnly(text) {
  return /^(卒|死|薨|崩|誅|殺|斬|害|溺|所殺|所害|共殺|襲殺|死之|斬之|斬撫|卒官|尋卒|病卒|發憤卒|溺死|遂薨|夜中卒|死于)$/.test(text || '');
}

const rows = unresolvedIds.map((id) => {
  const claim = extraction.claims[Number(id.slice(6)) - 1];
  const value = claim[2];
  const ctx = value.dateContext || value;
  return {
    id,
    personId: claim[0],
    predicate: claim[1],
    claim,
    sourceDate: ctx?.sourceDate?.text || null,
    reason: ctx?.unresolvedReason || null,
    refs: claim[4] || [],
  };
});

const byPerson = new Map();
for (const row of rows) {
  if (!byPerson.has(row.personId)) byPerson.set(row.personId, { att: null, death: null });
  const slot = byPerson.get(row.personId);
  if (row.predicate === 'death') slot.death = row;
  else if (row.predicate === 'attestation') slot.att = row;
}

const plan = {
  genuinelyUndatedConvertible: [],
  realUnresolvedDated: [],
  relativeOrExplicitKept: [],
  retainedHolds: [],
};

const changes = [];

for (const [personId, pair] of byPerson) {
  if (pair.death && REIGN_DEATH.has(pair.death.id)) {
    const phrase = REIGN_DEATH.get(pair.death.id);
    if (!zhFor(pair.death.refs).includes(phrase)) throw new Error(`${pair.death.id} missing ${phrase}`);
    // Keep death unresolved with exact reign phrase.
    plan.realUnresolvedDated.push({
      personId,
      death: pair.death.id,
      chinese: phrase,
      schema: 'death.dateContext.sourceDate + unresolved',
      note: 'Exact reign/event phrase dates the death milieu; no Western conversion on this unit alone.',
    });
    if (pair.att) {
      const att = pair.att.claim;
      const attZh = zhFor(att[4]);
      // Prefer exact reign phrase when already on attestation evidence; else keep linked Chinese and honest pairing reason.
      let sourceText = att[2]?.sourceDate?.text;
      let reason;
      if (attZh.includes(phrase)) {
        sourceText = phrase;
        reason = `${phrase} is witnessed on the attestation evidence and dates the same milieu as the paired unresolved death; no single Western year is convertible on these units alone.`;
      } else if (sourceText && attZh.includes(sourceText) && /十四年|年/.test(sourceText)) {
        reason = `Attestation cites relative/source wording「${sourceText}」without a convertible Western endpoint; paired death remains unresolved on「${phrase}」under native schema (undated attestation cannot accompany unresolved death).`;
        plan.relativeOrExplicitKept.push({
          personId,
          attestation: pair.att.id,
          chinese: sourceText,
          schema: 'attestation.sourceDate + unresolved (relative evidence)',
        });
      } else {
        // Keep existing linked Chinese; rewrite reason only when needed.
        if (!sourceText || !attZh.includes(sourceText)) {
          throw new Error(`${pair.att.id} sourceDate not linked`);
        }
        reason = `Native schema requires an attestation research hold while death ${pair.death.id} remains unresolved on「${phrase}」without a Western year; attestation units do not themselves supply a convertible personal calendar date (source wording「${sourceText}」).`;
      }
      const after = [att[0], att[1], {
        sourceDate: { text: sourceText },
        unresolved: true,
        unresolvedReason: reason,
        event: att[2]?.event && String(att[2].event).length >= 20
          ? att[2].event
          : 'The source attests this person without a convertible Western year on the cited attestation units.',
      }, att[3], att[4]];
      if (JSON.stringify(after[2]) !== JSON.stringify(att[2])) {
        changes.push({
          kind: 'replace',
          id: pair.att.id,
          before: att,
          after,
          reason: `Scoped hold hygiene for ${pair.att.id}: keep unresolved research hold required by paired reign-dated death ${pair.death.id}; align reason/sourceDate to witnessed Chinese without inventing Western years.`,
        });
      }
      plan.retainedHolds.push({
        personId,
        attestation: pair.att.id,
        death: pair.death.id,
        chineseAtt: sourceText,
        chineseDeath: phrase,
        nextSource: 'Independent era conversion for the reign phrase on the death unit, or explicit undated path only if death is later approved as event-only.',
      });
    }
    continue;
  }

  if (pair.att && KEEP_ERA_ATT.has(pair.att.id) && !pair.death) {
    plan.realUnresolvedDated.push({
      personId,
      attestation: pair.att.id,
      chinese: pair.att.sourceDate,
      schema: 'attestation.sourceDate + unresolved',
      note: 'Era-mid / reign-end wording without a single convertible Western year.',
    });
    continue;
  }

  if (pair.death && isDeathVerbOnly(pair.death.sourceDate)) {
    // Confirm no calendar phrase that actually dates the death on this unit beyond the verb class.
    const deathZh = zhFor(pair.death.refs);
    if (!deathZh.includes(pair.death.sourceDate)) throw new Error(`${pair.death.id} death phrase not linked`);
    // No other date-bearing claims
    const exclude = new Set([pair.death.id, pair.att?.id].filter(Boolean));
    const other = extraction.claims.some((claim, index) => {
      const id = `claim-${index + 1}`;
      return claim[0] === personId && !exclude.has(id) && hasDateBearingChronology(claim[2]);
    });
    if (other) throw new Error(`${personId} has other date-bearing claims; refuse undated conversion`);

    const deathBefore = pair.death.claim;
    const deathAfter = [deathBefore[0], 'death', {
      event: typeof deathBefore[2]?.event === 'string' && deathBefore[2].event.trim().length >= 4
        ? deathBefore[2].event
        : 'died',
    }, deathBefore[3], deathBefore[4]];
    changes.push({
      kind: 'replace',
      id: pair.death.id,
      before: deathBefore,
      after: deathAfter,
      reason: `Genuinely undated death on ${pair.death.id}: cited Chinese uses「${pair.death.sourceDate}」with no reign/year dating the death; store as event-only death (native schema), not an unresolved dated assertion.`,
    });

    if (!pair.att) throw new Error(`${personId} death-verb row missing paired attestation`);
    const attBefore = pair.att.claim;
    const attAfter = [attBefore[0], 'attestation', {
      undatedSourceAttestation: true,
      event: (typeof attBefore[2]?.event === 'string' && attBefore[2].event.trim().length >= 20 && !/outside-knowledge/i.test(attBefore[2].event))
        ? attBefore[2].event
        : 'The cited units name this person without asserting a convertible personal calendar date.',
    }, attBefore[3], attBefore[4]];
    changes.push({
      kind: 'replace',
      id: pair.att.id,
      before: attBefore,
      after: attAfter,
      reason: `Genuinely undated attestation on ${pair.att.id}: no personal dating claim on attestation units; with event-only death, native schema supports undatedSourceAttestation (undated+unresolvedDeath is invalid).`,
    });

    plan.genuinelyUndatedConvertible.push({
      personId,
      death: pair.death.id,
      deathChinese: pair.death.sourceDate,
      attestation: pair.att.id,
      priorAttChinese: pair.att.sourceDate,
      schema: 'attestation.undatedSourceAttestation + death event-only',
      zhDeath: deathZh.slice(0, 80),
    });
    continue;
  }

  if (pair.att && KEEP_ERA_ATT.has(pair.att.id) && pair.death) {
    // claim-52 with death-169 already handled via REIGN_DEATH for claim-169
    continue;
  }

  throw new Error(`Unhandled person ${personId}: death=${pair.death?.id}/${pair.death?.sourceDate} att=${pair.att?.id}`);
}

// claim-521 alone
if (!plan.realUnresolvedDated.some((row) => row.attestation === 'claim-521')) {
  const row = rows.find((item) => item.id === 'claim-521');
  if (row) {
    plan.realUnresolvedDated.push({
      personId: row.personId,
      attestation: 'claim-521',
      chinese: '永嘉中',
      schema: 'attestation.sourceDate + unresolved',
      note: 'Era-mid wording without a single convertible Western year.',
    });
  }
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 081 owner unresolved-hold representation',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const mid = applyDateRepairProposal(extraction, proposal, packet);

function rebuildHints(claims) {
  const westernLabels = [];
  let qualitativeLabel = null;
  let unresolved = false;
  for (const claim of claims) {
    const value = claim[2];
    if (!value || value.undatedSourceAttestation) continue;
    const containers = [];
    if (claim[1] === 'attestation') containers.push(value);
    if (value.dateContext) containers.push(value.dateContext);
    for (const ctx of containers) {
      if (ctx.unresolved) unresolved = true;
      if (ctx.westernYear) westernLabels.push(`${ctx.westernYear.era} ${ctx.westernYear.year}`);
      if (ctx.westernInterval) {
        const start = ctx.westernInterval.start;
        const end = ctx.westernInterval.end;
        westernLabels.push(start.year === end.year && start.era === end.era
          ? `${start.era} ${start.year}`
          : `${start.era} ${start.year}-${end.era} ${end.year}`);
      }
      if (ctx.westernBounds) {
        const parts = [];
        if (ctx.westernBounds.onOrAfter) parts.push(`on or after ${ctx.westernBounds.onOrAfter.era} ${ctx.westernBounds.onOrAfter.year}`);
        if (ctx.westernBounds.after) parts.push(`after ${ctx.westernBounds.after.era} ${ctx.westernBounds.after.year}`);
        if (ctx.westernBounds.onOrBefore) parts.push(`on or before ${ctx.westernBounds.onOrBefore.era} ${ctx.westernBounds.onOrBefore.year}`);
        if (ctx.westernBounds.before) parts.push(`before ${ctx.westernBounds.before.era} ${ctx.westernBounds.before.year}`);
        if (parts.length) westernLabels.push(parts.join(' and '));
      }
      if (ctx.qualitative && ctx.sourceDate?.text) {
        qualitativeLabel = `During ${ctx.sourceDate.text} as stated in the source`;
      }
    }
  }
  const unique = [...new Set(westernLabels)];
  if (unique.length) return unique;
  if (unresolved) return ['Chapter cite lacks a convertible reign-year Western date for this person'];
  if (qualitativeLabel) return [qualitativeLabel];
  return [];
}

const touched = [...new Set(changes.map((change) => change.after[0]))];
const hintChanges = [];
for (const personId of touched) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a;
  const after = rebuildHints(mid.claims.filter((claim) => claim[0] === personId));
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  hintChanges.push({
    kind: 'hints',
    personId,
    before,
    after,
    reason: `Rebuild hints for ${personId} after unresolved-hold representation changes.`,
  });
}

const midPacket = buildDateAuditPacket(book, chapter, { extraction: mid });
const final = hintChanges.length
  ? applyDateRepairProposal(mid, {
    schemaVersion: 1,
    kind: 'date-repair-proposal',
    book,
    chapter,
    sourceHash: midPacket.sourceHash,
    extractionHash: midPacket.extractionHash,
    author: {
      name: 'Jinshu 081 owner hint rebuild after unresolved representation',
      agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
    },
    changes: hintChanges,
  }, midPacket)
  : mid;

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
const validation = validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
if (validation.errors?.length) {
  console.error(validation.errors.slice(0, 60));
  throw new Error(`validation failed: ${validation.errors.length}`);
}

// Preservations
if (final.translationRepairs.filter((row) => row[6] === 'applied').length !== 15) {
  throw new Error('English repairs drifted');
}
if (final.claims[43][2].westernYear?.year !== 310) throw new Error('claim-44 drifted');
if (!final.claims[1201][2].dateContext?.westernYear) throw new Error('claim-1202 drifted');
if (!final.claims[1341][2].dateContext?.westernYear) throw new Error('claim-1342 drifted');
if (!final.claims[520][2].unresolved || final.claims[520][2].sourceDate?.text !== '永嘉中') {
  throw new Error('claim-521 drifted');
}
if (!final.claims[51][2].unresolved || final.claims[51][2].sourceDate?.text !== '惠帝末') {
  throw new Error('claim-52 drifted');
}
for (const [id, phrase] of REIGN_DEATH) {
  const claim = final.claims[Number(id.slice(6)) - 1];
  if (!claim[2]?.dateContext?.unresolved || claim[2].dateContext.sourceDate?.text !== phrase) {
    throw new Error(`${id} reign death drifted`);
  }
}

writeTextAtomic(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`), serializeCompactPeopleExtraction(final));
const written = readJson(path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
const afterPkt = buildDateAuditPacket(book, chapter);

const afterUnresolved = afterPkt.items.filter((item) => {
  const value = item.value || {};
  const ctx = value.dateContext || value;
  return ctx.unresolved === true;
}).length;
const afterUndated = afterPkt.items.filter((item) => item.predicate === 'attestation' && item.value?.undatedSourceAttestation).length;
const afterDeathEventOnly = written.claims.filter((claim) =>
  claim[1] === 'death' && !claim[2]?.dateContext && !claim[2]?.westernYear && !claim[2]?.unresolved).length;

const inventory = {
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPkt.extractionHash,
  sourceHash: afterPkt.sourceHash,
  claimChangeCount: changes.length,
  hintChangeCount: hintChanges.length,
  planCounts: {
    genuinelyUndatedConvertible: plan.genuinelyUndatedConvertible.length,
    realUnresolvedDated: plan.realUnresolvedDated.length,
    relativeOrExplicitKept: plan.relativeOrExplicitKept.length,
    retainedHolds: plan.retainedHolds.length,
  },
  afterUnresolvedItems: afterUnresolved,
  afterUndatedAttestations: afterUndated,
  afterDeathEventOnly,
  appliedRepairs: written.translationRepairs.filter((row) => row[6] === 'applied').length,
  plan,
};
writeJsonAtomic('/tmp/jinshu081-unresolved-representation-inventory.json', inventory);
console.log(JSON.stringify({
  claimChangeCount: changes.length,
  hintChangeCount: hintChanges.length,
  planCounts: inventory.planCounts,
  afterUnresolvedItems: afterUnresolved,
  afterUndatedAttestations: afterUndated,
  afterDeathEventOnly,
  afterExtractionHash: afterPkt.extractionHash,
  appliedRepairs: inventory.appliedRepairs,
}, null, 2));
console.log('PASS');
