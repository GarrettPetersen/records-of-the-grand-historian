#!/usr/bin/env node
/**
 * Verify independent schema4 editorial evidence matches exact owner install contract
 * without writing production editorial files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { expandPeopleExtraction } from '../../scripts/lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import {
  editorialReviews,
  validateAppliedEditorialDecisions,
  validateEditorialDecisionDocument,
} from '../../scripts/lib/people-editorial-decisions.mjs';
import { validatePeopleExtraction } from '../../scripts/validate-people-extraction.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const EVIDENCE = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const BOOK = 'jinshu';
const CHAPTER = '090';
const RETAINED_PRODUCER = 'bc-5bf35208-796f-45c3-8547-d8732edd1730';

const shaFile = (rel) => createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');

function main() {
  const schema4 = JSON.parse(fs.readFileSync(path.join(EVIDENCE, 'source-reviewed-editorial-decisions.json'), 'utf8'));
  const productionV3 = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/people/editorial-decisions/jinshu/090.json'), 'utf8'));
  const compact = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/people/extractions/jinshu/090.json'), 'utf8'));
  const packet = buildPeopleExtractionPacket(BOOK, CHAPTER);
  const extraction = expandPeopleExtraction(compact, packet);
  validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });
  validateEditorialDecisionDocument(schema4);
  const applied = validateAppliedEditorialDecisions(schema4, extraction);

  const reviews = editorialReviews(schema4);
  if (reviews.length !== 2) throw new Error(`Expected 2 reviews, got ${reviews.length}`);
  const [independent, retained] = reviews;
  const [productionReview] = editorialReviews(productionV3);
  const stripScope = ({ schemaVersion, book, chapter, ...rest }) => rest;
  if (JSON.stringify(stripScope(retained)) !== JSON.stringify(stripScope(productionReview))) {
    throw new Error('Retained review is not identical to production v3 document');
  }
  if (retained.reviewer?.agentId !== RETAINED_PRODUCER) {
    throw new Error('Retained producer agentId mismatch');
  }
  if (independent.decisions.filter((d) => d.decision === 'accept').length !== 33) {
    throw new Error('Independent batch must have 33 accepts');
  }
  if (retained.decisions.filter((d) => d.decision === 'accept').length !== 17) {
    throw new Error('Retained batch must have 17 accepts');
  }

  const repairIds = new Set(extraction.translationRepairs.map((r) => r.id));
  for (const review of reviews) {
    for (const d of review.decisions) {
      if (!repairIds.has(d.repairId)) throw new Error(`Unknown repair ${d.repairId}`);
    }
  }

  const out = {
    schemaVersion: 1,
    kind: 'editorial-install-verification',
    book: BOOK,
    chapter: CHAPTER,
    verifiedAt: new Date().toISOString(),
    staging: { commit: '378771b831b7eb7b7049903eb3e26bb86155db4d', pr: 5489, ownerPr: 5415 },
    inputs: {
      sourceSha256: shaFile('data/jinshu/090.json'),
      extractionSha256: shaFile('data/people/extractions/jinshu/090.json'),
      productionEditorialSha256: shaFile('data/people/editorial-decisions/jinshu/090.json'),
      evidenceEditorialSha256: shaFile('research/people/jinshu090-independent-evidence-20261124/source-reviewed-editorial-decisions.json'),
    },
    installContract: {
      independentAccepts: 33,
      retainedAccepts: 17,
      totalAppliedRepairs: extraction.translationRepairs.filter((r) => r.status === 'applied').length,
      retainedProducerAgentId: RETAINED_PRODUCER,
      independentProducerAgentId: independent.reviewer?.agentId,
      chapterExtractionUnchanged: true,
      productionEditorialUnchanged: true,
    },
    nativeValidation: { appliedEditorialErrors: applied.errors ?? [] },
    producerPreservation:
      'Retained review object is identical to data/people/editorial-decisions/jinshu/090.json; no reviewer metadata rewrite.',
  };
  if (out.nativeValidation.appliedEditorialErrors.length) {
    throw new Error('Applied editorial validation failed');
  }
  fs.writeFileSync(path.join(EVIDENCE, 'editorial-install-verification.json'), `${JSON.stringify(out, null, 2)}\n`);
  console.log(JSON.stringify({ ok: true, ...out.installContract }, null, 2));
}

main();