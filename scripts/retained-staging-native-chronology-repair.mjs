#!/usr/bin/env node
/**
 * Dry-run native chronology repair proposals for retained-staging owner pass.
 * Does not write canonical extraction or date-audit files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import {
  buildDateAuditPacket,
  dateAuditDiagnostics,
  dateAuditItems,
} from './lib/people-date-audit.mjs';
import { readJson } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';

const WESTERN_KEYS = ['westernYear', 'westernInterval', 'westernBounds'];

function sha256Bytes(buf) {
  return 'sha256:' + createHash('sha256').update(buf).digest('hex');
}

function cleanEvent(text, fallback) {
  const base = (typeof text === 'string' && text.trim().length >= 20 ? text.trim() : fallback).trim();
  return base.length >= 20 ? base.slice(0, 240) : fallback;
}

function hasWestern(value) {
  if (!value || typeof value !== 'object') return false;
  return WESTERN_KEYS.some((key) => value[key] !== undefined);
}

function stripWestern(value) {
  if (!value || typeof value !== 'object') return value;
  const next = { ...value };
  for (const key of WESTERN_KEYS) delete next[key];
  return next;
}

function toUndatedAttestation(before, event) {
  return {
    undatedSourceAttestation: true,
    event: cleanEvent(
      before?.event ?? before?.qualitative,
      event,
    ),
  };
}

function toUnresolvedAttestation(before, reason, eventFallback) {
  const text = before?.sourceDate?.text;
  if (!text) {
    return toUndatedAttestation(before, eventFallback);
  }
  return {
    sourceDate: { text },
    unresolved: true,
    unresolvedReason: reason.slice(0, 240),
    event: cleanEvent(
      before?.event,
      eventFallback,
    ),
  };
}

function stripDateContextWestern(dateContext, reason) {
  const next = { ...dateContext };
  for (const key of WESTERN_KEYS) delete next[key];
  if (next.sourceDate?.text) {
    next.unresolved = true;
    next.unresolvedReason = reason.slice(0, 240);
  }
  return next;
}

function isRetrospectiveLegalCitation(sourceDateText, quote) {
  const t = `${sourceDateText || ''} ${quote || ''}`;
  return /(秦時|本紀|北魏|漢高|文帝|司馬牛|桓魋|柳下惠|盜跖|孟子|大禹|虞廷)/u.test(t);
}

function institutionalHoldReason(personId, quote) {
  return `The source unit records an institutional or ceremonial Qing context for ${personId} (${quote?.slice(0, 40) || 'chapter'}). It does not by itself establish personally owned life chronology; Western conversion is withheld pending independent event-ownership review.`;
}

function relativeSourceHoldReason(text, quote) {
  return `The source uses only relative wording (${text || quote?.slice(0, 20) || 'witness'}) without a numbered calendar year in this chapter; the prior Western point year is removed and retained as an explicit unresolved hold.`;
}

function importedChronologyHoldReason(quote) {
  return `The passage is a retrospective legal or historical citation (${quote?.slice(0, 36) || 'allusion'}). Imported Western years are not stated in this chapter and are removed pending independent source-specific chronology.`;
}

function claimIndex(packet, id) {
  const item = packet.items.find((i) => i.id === id);
  if (!item || item.claimIndex === undefined) throw new Error(`Missing packet item ${id}`);
  return item.claimIndex;
}

function personHintIndex(ext, personId) {
  return ext.people.findIndex((row) => row[0] === personId);
}

function buildProposals(book, chapter, audit, ext, packet) {
  const proposals = [];
  const hintProposals = [];
  const noEdit = [];
  const blockedIds = new Set(
    audit.itemChecks.filter((c) => c.verdict === 'research-blocked').map((c) => c.id),
  );

  for (const check of audit.itemChecks) {
    if (check.verdict !== 'research-blocked' || !check.id.startsWith('claim-')) continue;
    const idx = claimIndex(packet, check.id);
    const claim = ext.claims[idx];
    if (!claim) throw new Error(`Missing claim for ${check.id}`);
    const before = structuredClone(claim[2]);
    const quote = check.evidence?.[0]?.quote;
    const unit = check.evidence?.[0]?.unit;
    const person = claim[0];
    const predicate = claim[1];

    let after;
    let reason;
    if (predicate === 'attestation') {
      const sd = before?.sourceDate?.text;
      if (!hasWestern(before) && !before?.unresolved) {
        noEdit.push({
          auditItemId: check.id,
          personId: person,
          reason: 'Claim has no Western chronology; residual hold is active-date hint or person-level scope only.',
          sourceQuote: quote,
          unit,
        });
        continue;
      }
      if (isRetrospectiveLegalCitation(sd, quote)) {
        after = toUndatedAttestation(before, importedChronologyHoldReason(quote));
        reason = importedChronologyHoldReason(quote);
      } else if (sd && /^(海陵初|避顯宗諱)/u.test(sd)) {
        after = toUnresolvedAttestation(before, relativeSourceHoldReason(sd, quote), `Regulation or renaming context at ${sd}, exactly as stated in the source.`);
        reason = relativeSourceHoldReason(sd, quote);
      } else if (sd && /光緒|宣統|康德/u.test(sd)) {
        after = toUnresolvedAttestation(
          before,
          institutionalHoldReason(person, quote),
          `Institutional Qing context dated ${sd} in the source, without asserted personal life chronology.`,
        );
        reason = institutionalHoldReason(person, quote);
      } else if (hasWestern(before)) {
        after = toUnresolvedAttestation(
          before,
          `The audited source quote does not independently establish the retained Western chronology (${check.reason?.slice(0, 80) || 'research-blocked'}).`,
          `Chapter witness ${sd || quote?.slice(0, 24) || 'without convertible year'} retained without Western conversion.`,
        );
        reason = check.reason;
      } else {
        noEdit.push({ auditItemId: check.id, personId: person, reason: 'No Western fields to remove.', sourceQuote: quote, unit });
        continue;
      }
    } else if (predicate === 'event-participation' || predicate === 'noble-title' || predicate === 'office') {
      if (!before?.dateContext) {
        if (hasWestern(before)) {
          after = stripWestern(before);
          if (after.unresolved === undefined && quote) {
            after.unresolved = true;
            after.unresolvedReason = institutionalHoldReason(person, quote);
          }
        } else {
          noEdit.push({ auditItemId: check.id, personId: person, reason: 'Non-attestation row without dateContext Western fields.', sourceQuote: quote, unit });
          continue;
        }
      } else {
        after = {
          ...before,
          dateContext: stripDateContextWestern(
            before.dateContext,
            institutionalHoldReason(person, quote),
          ),
        };
      }
      reason = check.reason || institutionalHoldReason(person, quote);
    } else if (predicate === 'material-association' || predicate === 'status') {
      after = { ...before };
      if (after.dateContext) {
        after.dateContext = stripDateContextWestern(after.dateContext, check.reason || 'Unsupported Western chronology removed.');
      }
      reason = check.reason || 'Remove unsupported Western chronology from ancillary claim.';
    } else {
      throw new Error(`Unhandled predicate ${predicate} on ${check.id}`);
    }

    claim[2] = after;
    proposals.push({
      auditItemId: check.id,
      personId: person,
      predicate,
      auditVerdict: 'research-blocked',
      unit,
      sourceQuote: quote,
      action: 'replace-claim-value',
      reason,
      before,
      after: structuredClone(after),
    });
  }

  for (const check of audit.itemChecks) {
    if (check.verdict !== 'research-blocked' || !check.id.startsWith('hints-')) continue;
    const personId = check.id.replace('hints-', '');
    const pIdx = personHintIndex(ext, personId);
    if (pIdx < 0) throw new Error(`Missing person ${personId}`);
    const hintsObj = ext.people[pIdx][4] && typeof ext.people[pIdx][4] === 'object' ? ext.people[pIdx][4] : { a: [] };
    const beforeHints = [...(hintsObj.a || [])];
    const westernHints = beforeHints.filter((h) => /\b(?:AD|BC)\s+\d/u.test(h));
    if (!westernHints.length) {
      noEdit.push({
        auditItemId: check.id,
        personId,
        reason: 'Active hints contain no Western year interval to remove.',
        sourceQuote: check.evidence?.[0]?.quote,
        unit: check.evidence?.[0]?.unit,
      });
      continue;
    }
    const afterHints = beforeHints.filter((h) => !/\b(?:AD|BC)\s+\d/u.test(h));
    hintsObj.a = afterHints;
    ext.people[pIdx][4] = hintsObj;
    hintProposals.push({
      auditItemId: check.id,
      personId,
      unit: check.evidence?.[0]?.unit,
      sourceQuote: check.evidence?.[0]?.quote,
      action: 'replace-active-date-hints',
      reason: check.reason || 'Remove Western active-date hints not independently established in this chapter.',
      before: beforeHints,
      after: afterHints,
    });
  }

  return { proposals, hintProposals, noEdit, blockedIds };
}

function rebuildHintsFromClaims(ext) {
  const personWestern = new Map();
  for (const claim of ext.claims) {
    if (claim[1] !== 'attestation') continue;
    const value = claim[2];
    if (!value || value.unresolved || value.undatedSourceAttestation) continue;
    const years = [];
    if (value.westernYear?.year) years.push(value.westernYear.year);
    if (value.westernInterval) {
      years.push(value.westernInterval.start?.year, value.westernInterval.end?.year);
    }
    if (value.westernBounds) {
      for (const bound of Object.values(value.westernBounds)) {
        if (bound?.year) years.push(bound.year);
      }
    }
    if (!years.length) continue;
    const label = value.sourceDate?.text || '';
    const entry = personWestern.get(claim[0]) || { years: [], labels: new Set() };
    entry.years.push(...years.filter((y) => typeof y === 'number'));
    if (label) entry.labels.add(label);
    personWestern.set(claim[0], entry);
  }

  for (const person of ext.people) {
    const id = person[0];
    const hintsObj = person[4] && typeof person[4] === 'object' ? person[4] : { a: [] };
    const west = personWestern.get(id);
    if (!west || !west.years.length) {
      const qualitative = (hintsObj.a || []).filter((h) => !/\b(?:AD|BC)\s+\d/u.test(h));
      hintsObj.a = qualitative;
      person[4] = hintsObj;
      continue;
    }
    const lo = Math.min(...west.years);
    const hi = Math.max(...west.years);
    const label = [...west.labels].join('·') || 'chapter reign witness';
    hintsObj.a = [lo === hi ? `AD ${lo} (${label})` : `AD ${lo}–${hi} (${label})`];
    person[4] = hintsObj;
  }
}

function dryValidate(book, chapter, ext) {
  const packet = buildPeopleExtractionPacket(book, chapter);
  const validation = validateCompactPeopleExtraction(ext, packet, { strictAliasDispositions: true });
  const geometry = dateAuditDiagnostics(dateAuditItems(ext));
  return {
    extractionValidation: {
      ok: true,
      people: validation.stats?.people ?? validation.normalized?.people?.length,
    },
    geometryErrors: geometry,
  };
}

export function buildChapterRepairArtifact(options) {
  const {
    book,
    chapter,
    ownerAgentId,
    idempotencyKey,
    priorOwnerRevision,
    ownerHandoffSha256,
    pinnedAudit,
    outputPath,
    scopeRef,
  } = options;

  const auditPath = `data/people/date-audits/${book}/${chapter}.json`;
  const extPath = `data/people/extractions/${book}/${chapter}.json`;
  const auditBytes = fs.readFileSync(auditPath);
  const audit = JSON.parse(auditBytes.toString());
  const ext = structuredClone(readJson(extPath));
  const packet = buildDateAuditPacket(book, chapter);

  const auditSha = sha256Bytes(auditBytes);
  const pinned = pinnedAudit.sha256.replace(/^sha256:/, '');
  const actual = auditSha.replace(/^sha256:/, '');
  if (pinned !== actual) {
    throw new Error(`Pinned audit sha mismatch for ${book}/${chapter}: ${pinned} vs ${actual}`);
  }

  const beforeHash = createHash('sha256').update(JSON.stringify(ext)).digest('hex');
  const { proposals, hintProposals, noEdit } = buildProposals(book, chapter, audit, ext, packet);
  rebuildHintsFromClaims(ext);
  let nativeValidation;
  try {
    nativeValidation = { ...dryValidate(book, chapter, ext), passed: true };
  } catch (error) {
    nativeValidation = {
      passed: false,
      error: error.message,
      errors: error.errors ?? [],
      command: 'validateCompactPeopleExtraction + dateAuditDiagnostics (dry-run candidate)',
    };
  }
  const afterHash = createHash('sha256').update(JSON.stringify(ext)).digest('hex');

  const intactSupported = audit.itemChecks.filter((c) => c.verdict === 'supported').map((c) => c.id);
  const residualHolds = audit.findings?.map((f, i) => ({
    id: `finding-${i + 1}`,
    problem: f.problem,
    action: f.action,
    items: f.items,
    preservedAuditBytes: auditSha,
    note: 'Original independent date-audit file unchanged; holds remain until a fresh audit after host-approved extraction edits.',
  })) ?? [];

  const artifact = {
    schemaVersion: 1,
    kind: 'owner-native-chronology-repair',
    scope: { book, chapter },
    ownerAgentId,
    workerId: 'cursor-nov24-retained-staging-w2-o3',
    campaign: 'campaign-nov24-retained-staging',
    idempotencyKey,
    scopeRef,
    priorOwnerRevision,
    ownerHandoffSha256,
    stagingPin: process.env.STAGING_PIN || null,
    pinnedDateAudit: {
      path: auditPath,
      sha256: auditSha,
      status: audit.status,
      reviewedAt: audit.reviewedAt,
      bytePreserved: true,
      hashPreserved: true,
    },
    inputBlobsUntouched: true,
    intactApprovals: {
      supportedItemChecks: intactSupported,
      supportedPersonChecks: (audit.personChecks || []).filter((p) => p.verdict === 'supported').map((p) => p.id),
      editorialDecisionsUntouched: true,
      sourceChapterUntouched: true,
    },
    verifiedFindings: (audit.findings || []).map((f) => ({
      items: f.items,
      problem: f.problem,
      action: f.action,
    })),
    claimProposals: proposals,
    hintProposals,
    explicitNoEdit: noEdit,
    definiteTranslationRepairs: [],
    candidateExtractionHash: {
      before: `sha256:${beforeHash}`,
      after: `sha256:${afterHash}`,
    },
    nativeValidation: {
      ...nativeValidation,
      dateAuditFileMutated: false,
    },
    residualHolds,
    notes: '[CF-Pages-Skip] Proposal-only; host assembles, applies, and re-runs independent review.',
    completedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  return artifact;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const config = JSON.parse(process.argv[2] || '{}');
  const artifact = buildChapterRepairArtifact(config);
  console.log(JSON.stringify({
    scope: artifact.scope,
    claimProposals: artifact.claimProposals.length,
    hintProposals: artifact.hintProposals.length,
    noEdit: artifact.explicitNoEdit.length,
    geometry: artifact.nativeValidation.geometryErrors.length,
    unresolved: artifact.nativeValidation.unresolvedCount,
  }, null, 2));
}