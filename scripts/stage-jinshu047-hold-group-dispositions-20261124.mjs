#!/usr/bin/env node
/**
 * Jinshu 047: apply only source-backed reviewer dispositions at 7fe22541
 * (research/people/jinshu047-independent-hold-group-dispositions-20261124.json).
 *
 * Changed IDs only from summary.supportedOwnerApplyIds. Preserve other holds,
 * claim-148, 21 undated conversions, and approved English. No Western guessing,
 * full audit redo, or merge.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic } from './lib/people-content.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '047';
const dispositions = readJson('/tmp/jinshu047-dispositions.json');
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

const APPLY_IDS = dispositions.summary.supportedOwnerApplyIds.map((id) => Number(id.replace('claim-', '')));
const RETAIN_HOLD_IDS = dispositions.summary.retainResearchHoldIds.map((id) => Number(id.replace('claim-', '')));
const CONVERTED_21 = [
  102, 106, 111, 114, 150, 192, 196, 211, 239, 254, 257, 260, 263, 265,
  416, 476, 477, 877, 883, 884, 885,
];
const CLAIM_148 = structuredClone(extraction.claims[147]);

function ensureEvent(text, fallback) {
  const cleaned = (text || '').trim();
  if (cleaned.length >= 20) return cleaned;
  return fallback;
}

function undatedAttestation(before, eventText) {
  const value = before[2] || {};
  const event = ensureEvent(value.event, eventText);
  return {
    undatedSourceAttestation: true,
    event: event.length >= 20 ? event : `${event} Chapter supplies no convertible calendar year.`,
  };
}

function eventOnlyDeath(before, eventText) {
  const value = before[2] || {};
  const next = { ...value };
  delete next.dateContext;
  delete next.sourceDate;
  delete next.unresolved;
  delete next.unresolvedReason;
  delete next.westernBounds;
  delete next.westernYear;
  delete next.westernInterval;
  delete next.undatedSourceAttestation;
  next.event = ensureEvent(value.event || value.dateContext?.event, eventText);
  return next;
}

function reanchorHold(before, newSourceDate, reason) {
  const value = before[2] || {};
  const kind = before[1];
  if (kind === 'attestation') {
    return {
      ...value,
      sourceDate: { text: newSourceDate },
      unresolved: true,
      unresolvedReason: reason,
    };
  }
  const base = { ...value };
  base.dateContext = {
    ...(value.dateContext || {}),
    sourceDate: { text: newSourceDate },
    unresolved: true,
    unresolvedReason: reason,
  };
  delete base.dateContext.westernBounds;
  delete base.dateContext.westernYear;
  delete base.dateContext.westernInterval;
  return base;
}

function clearDatingKeepRest(before, undatedEventText) {
  const value = before[2] || {};
  const kind = before[1];
  if (kind === 'attestation') {
    return undatedAttestation(before, undatedEventText);
  }
  const next = { ...value };
  delete next.dateContext;
  delete next.sourceDate;
  delete next.unresolved;
  delete next.unresolvedReason;
  delete next.westernBounds;
  if (undatedEventText) {
    next.event = ensureEvent(value.event || value.dateContext?.event, undatedEventText);
  }
  return next;
}

function indentClaim(claim) {
  return JSON.stringify(claim, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? `    ${line}` : `    ${line}`))
    .join('\n');
}

const changes = [];
const changedIds = [];

function replace(id, afterValue, reason) {
  const before = extraction.claims[id - 1];
  const after = [before[0], before[1], afterValue, before[3], before[4]];
  changes.push({ kind: 'replace', id: `claim-${id}`, before, after, reason });
  changedIds.push(`claim-${id}`);
}

for (const id of APPLY_IDS) {
  const disp = dispositions.dispositionsById[`claim-${id}`];
  if (!disp) throw new Error(`Missing disposition for claim-${id}`);
  const before = extraction.claims[id - 1];
  const action = disp.action;

  if (action === 'reanchor-sourceDate') {
    replace(id, reanchorHold(before, disp.to, disp.reason), disp.reason);
  } else if (action === 'reanchor-sourceDate-then-keep-unresolved') {
    const reason = `Source-native「${disp.to}」on ${disp.unit}; era-mid span without a point year — retain research hold (re-anchored from false「${disp.from}」).`;
    replace(id, reanchorHold(before, disp.to, reason), disp.reason);
  } else if (action === 'reanchor-and-undatedSourceAttestation') {
    const event = ensureEvent(
      before[2]?.event,
      `Person attested under source wording「${disp.to}」on ${disp.unit} without a convertible calendar year.`,
    );
    const withCue = event.includes(disp.to) ? event : `${event} Source cue「${disp.to}」.`;
    replace(id, undatedAttestation(before, withCue), disp.reason);
  } else if (action === 'reanchor-and-event-only-death') {
    replace(
      id,
      eventOnlyDeath(
        before,
        `Death narrated as「${disp.to}」on ${disp.unit} without a reign year; event-only (no invented Western date).`,
      ),
      disp.reason,
    );
  } else if (action === 'clear-false-sourceDate-and-undatedSourceAttestation') {
    const cue = disp.to || (disp.units ? disp.units.join('/') : 'undated narrative');
    if (before[1] === 'attestation') {
      replace(
        id,
        clearDatingKeepRest(
          before,
          ensureEvent(
            before[2]?.event,
            `Person attested in undated narrative (false inherited「${disp.from}」cleared; cue「${cue}」).`,
          ),
        ),
        disp.reason,
      );
    } else {
      // event-participation: strip false dateContext only — cannot add non-date fields
      const next = { ...before[2] };
      delete next.dateContext;
      delete next.sourceDate;
      delete next.unresolved;
      delete next.unresolvedReason;
      delete next.westernBounds;
      replace(id, next, disp.reason);
    }
  } else if (action === 'undatedSourceAttestation') {
    const cue = disp.sourceDateKeepAsEventText || before[2]?.sourceDate?.text || 'undated source';
    const event = ensureEvent(
      before[2]?.event,
      `Person attested under「${cue}」without a convertible calendar year.`,
    );
    const withCue = event.includes(cue) ? event : `${event} Source cue「${cue}」.`;
    replace(id, undatedAttestation(before, withCue), disp.reason);
  } else if (action === 'event-only-death') {
    const cue = before[2]?.dateContext?.sourceDate?.text || before[2]?.sourceDate?.text || 'undated death';
    replace(
      id,
      eventOnlyDeath(
        before,
        `Death recorded under source wording「${cue}」without a reign year; event-only parallel to claim-148.`,
      ),
      disp.reason,
    );
  } else {
    throw new Error(`Unsupported action for claim-${id}: ${action}`);
  }
}

if (changedIds.length !== APPLY_IDS.length) {
  throw new Error(`Expected ${APPLY_IDS.length} changes, got ${changedIds.length}`);
}

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 047 owner apply hold-group dispositions @7fe22541',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const final = applyDateRepairProposal(extraction, proposal, packet);

if (JSON.stringify(final.claims[147]) !== JSON.stringify(CLAIM_148)) {
  throw new Error('claim-148 drifted');
}
for (const id of CONVERTED_21) {
  if (final.claims[id - 1][2]?.undatedSourceAttestation !== true) {
    throw new Error(`undated conversion claim-${id} drifted`);
  }
}
const retainUnchanged = RETAIN_HOLD_IDS.filter((id) => !APPLY_IDS.includes(id));
for (const id of retainUnchanged) {
  if (JSON.stringify(final.claims[id - 1]) !== JSON.stringify(extraction.claims[id - 1])) {
    throw new Error(`explicit hold claim-${id} was modified`);
  }
}
for (const id of [456, 527]) {
  const value = final.claims[id - 1][2];
  const unresolved = value.unresolved === true || value.dateContext?.unresolved === true;
  const sourceDate = value.sourceDate?.text || value.dateContext?.sourceDate?.text;
  if (!unresolved) throw new Error(`claim-${id} lost research hold after re-anchor`);
  const expected = dispositions.dispositionsById[`claim-${id}`].to;
  if (sourceDate !== expected) throw new Error(`claim-${id} sourceDate ${sourceDate} != ${expected}`);
}
const english = final.translationRepairs.filter((row) => row[6] === 'applied').length;
if (english !== 16) throw new Error(`English drifted: ${english}`);

for (const id of APPLY_IDS) {
  const value = final.claims[id - 1][2] || {};
  const dc = value.dateContext || {};
  if (value.westernBounds || value.westernYear || value.westernInterval
    || dc.westernBounds || dc.westernYear || dc.westernInterval) {
    throw new Error(`claim-${id} gained Western bounds`);
  }
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });

// Surgical pretty-file rewrite for reviewable diffs
let pretty = readFileSync(extractionPath, 'utf8');
for (const change of changes) {
  const beforeIndented = indentClaim(change.before);
  const afterIndented = indentClaim(change.after);
  if (!pretty.includes(beforeIndented)) {
    throw new Error(`surgical miss for ${change.id}`);
  }
  pretty = pretty.replace(beforeIndented, afterIndented);
}
const verify = JSON.parse(pretty);
for (const id of APPLY_IDS) {
  if (JSON.stringify(verify.claims[id - 1]) !== JSON.stringify(final.claims[id - 1])) {
    throw new Error(`surgical verify mismatch for claim-${id}`);
  }
}
if (JSON.stringify(verify.claims[147]) !== JSON.stringify(CLAIM_148)) {
  throw new Error('surgical write drifted claim-148');
}
writeFileSync(extractionPath, pretty);

const afterPacket = buildDateAuditPacket(book, chapter);

writeFileSync(
  'research/people/jinshu047-independent-hold-group-dispositions-20261124.json',
  `${JSON.stringify(dispositions, null, 2)}\n`,
);

const receipt = {
  schemaVersion: 1,
  kind: 'owner-dependency-receipt',
  book,
  chapter,
  pullRequest: 5423,
  independentDispositionsCommit: '7fe22541c8631be969d19c599dd7cf152c3f13f7',
  independentDispositions: 'research/people/jinshu047-independent-hold-group-dispositions-20261124.json',
  baseOwnerCommit: 'cf049cea4ab33b4539deb5487f9acfaa1121d789',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  sourceHash: afterPacket.sourceHash,
  approvalStatus: 'not-self-approved',
  exactChangedIds: changedIds,
  changedByAction: Object.fromEntries(
    APPLY_IDS.map((id) => {
      const disp = dispositions.dispositionsById[`claim-${id}`];
      return [`claim-${id}`, {
        action: disp.action,
        disposition: disp.disposition,
        from: disp.from || null,
        to: disp.to || null,
        units: disp.unit ? [disp.unit] : (disp.units || null),
      }];
    }),
  ),
  preserved: {
    claim148: true,
    approvedEnglishApplied: english,
    undatedConversions21: CONVERTED_21.map((id) => `claim-${id}`),
    explicitHoldsUnchanged: retainUnchanged.map((id) => `claim-${id}`),
    reanchoredHoldsStillUnresolved: ['claim-456', 'claim-527'],
  },
  notDone: [
    'no full audit redo',
    'no guessed Western dates',
    'no native audited self-approval',
    'no merge',
  ],
};

writeJsonAtomic('research/people/jinshu047-owner-disposition-apply-receipt-20261124.json', receipt);

console.log(JSON.stringify({
  changedIds,
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: afterPacket.extractionHash,
  english,
}, null, 2));
console.log('PASS');
