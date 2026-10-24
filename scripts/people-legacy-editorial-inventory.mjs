#!/usr/bin/env node
// Read-only inventory for independent re-review. This is not an approval.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { isCompactPeopleExtraction } from './lib/people-compact.mjs';
import { editorialReviews, validateEditorialDecisionDocument, validateAppliedEditorialDecisions } from './lib/people-editorial-decisions.mjs';
import { validateCompactPeopleExtraction, validatePeopleExtraction } from './validate-people-extraction.mjs';

const digest = value => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
// Same JSON serialization convention as production documentHash, including key order.
export const semanticHash = value => digest(JSON.stringify(value));

// Run the repository's structural and applied-history checks before enumeration.
// Review and action ordinals are one-based, scoped to their original arrays.
export function inventoryHistory(history, extraction) {
  validateEditorialDecisionDocument(history);
  if (history.book !== extraction.book || history.chapter !== extraction.chapter) throw new Error('Editorial and extraction scopes differ');
  if (extraction.translationRepairs.some(repair => repair.status === 'proposed')) throw new Error('Pending proposed repairs require the normal editorial workflow');
  validateAppliedEditorialDecisions(history, extraction);
  return editorialReviews(history).map((review, index) => {
    const original = history.schemaVersion === 4 ? history.reviews[index] : history;
    const proposals = new Map(review.proposals.map(proposal => [proposal.id, proposal]));
    const actions = [];
    for (const [kind, field] of [['decision', 'decisions'], ['claim-retraction', 'claimRetractions'], ['claim-revision', 'claimRevisions'], ['claim-addition', 'claimAdditions']]) {
      for (const [ordinal, content] of (review[field] ?? []).entries()) {
        const proposal = proposals.get(content.repairId);
        if (!proposal) throw new Error(`Missing proposal ${content.repairId}`);
        actions.push({ kind, ordinal: ordinal + 1, contentHash: semanticHash(content), content, proposalHash: semanticHash(proposal), proposal });
      }
    }
    return { ordinal: index + 1, componentHash: semanticHash(review), storedComponentHash: semanticHash(original), originalReviewer: review.reviewer, actions };
  });
}

export function inventoryFromBytes({ sourceBytes, extractionBytes, historyBytes }) {
  const source = JSON.parse(sourceBytes.toString('utf8'));
  const extraction = JSON.parse(extractionBytes.toString('utf8'));
  const history = JSON.parse(historyBytes.toString('utf8'));
  const { book, chapter } = extraction;
  if (typeof book !== 'string' || !/^[a-z0-9_-]+$/.test(book) || typeof chapter !== 'string' || !/^\d{3}$/.test(chapter)) throw new Error('Invalid extraction scope');
  if (source.meta?.book !== book || source.meta?.chapter !== chapter || history.book !== book || history.chapter !== chapter) throw new Error('Source, extraction, and history scopes differ');
  const packet = buildPeopleExtractionPacket(book, chapter, { chapterData: source });
  const validated = isCompactPeopleExtraction(extraction)
    ? validateCompactPeopleExtraction(extraction, packet, { strictAliasDispositions: true })
    : validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
  const reviews = inventoryHistory(history, validated.normalized);
  return {
    schemaVersion: 1, kind: 'legacy-editorial-independent-review-inventory', status: 'NOT_APPROVED', book, chapter,
    fingerprints: {
      sourceBytes: digest(sourceBytes), extractionBytes: digest(extractionBytes), historyBytes: digest(historyBytes),
      productionJsonHashConvention: 'sha256(JSON.stringify(value))',
      sourceSemantic: semanticHash(source), extractionSemantic: semanticHash(extraction), historySemantic: semanticHash(history),
      chapterFingerprint: packet.input.chapterFingerprint,
    }, reviews,
  };
}

function main(args) {
  if (args.length !== 6 || args[0] !== '--source' || args[2] !== '--extraction' || args[4] !== '--history') {
    throw new Error('Usage: node scripts/people-legacy-editorial-inventory.mjs --source PATH --extraction PATH --history PATH');
  }
  const result = inventoryFromBytes({ sourceBytes: fs.readFileSync(args[1]), extractionBytes: fs.readFileSync(args[3]), historyBytes: fs.readFileSync(args[5]) });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
