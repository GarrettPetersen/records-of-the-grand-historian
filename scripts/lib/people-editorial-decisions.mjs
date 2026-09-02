import path from 'node:path';
import {
  PEOPLE_DIR,
  sha256,
} from './people-content.mjs';
import {
  createPeopleSchemaValidator,
  formatSchemaErrors,
} from './people-schema.mjs';

const SCHEMA_V3_ID = 'https://24histories.com/schema/people/editorial-decision-v3.json';
const SCHEMA_V4_ID = 'https://24histories.com/schema/people/editorial-decision-v4.json';
const HANZI_RE = /\p{Script=Han}/u;

export class EditorialDecisionValidationError extends Error {
  constructor(errors) {
    super(`Editorial decision validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
    this.name = 'EditorialDecisionValidationError';
    this.errors = errors;
  }
}

export function editorialDecisionPath(book, chapter) {
  return path.join(PEOPLE_DIR, 'editorial-decisions', book, `${chapter}.json`);
}

function reviewDocument(book, chapter, review) {
  return {
    schemaVersion: 3,
    book,
    chapter,
    ...structuredClone(review),
  };
}

function reviewRecord(document) {
  const {
    schemaVersion: _schemaVersion,
    book: _book,
    chapter: _chapter,
    ...review
  } = document;
  return structuredClone(review);
}

export function editorialReviews(document) {
  if (document?.schemaVersion === 3) return [document];
  if (document?.schemaVersion === 4 && Array.isArray(document.reviews)) {
    return document.reviews.map((review) => reviewDocument(document.book, document.chapter, review));
  }
  return [];
}

function proposalContract(repair) {
  const { status: _status, ...contract } = repair;
  return contract;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
  );
}

function claimCoreContract(claim) {
  const { id: _id, evidence: _evidence, ...contract } = claim;
  return JSON.stringify(canonicalize(contract));
}

function evidenceIncludes(current, reviewed) {
  return reviewed.every((item) => current.includes(item));
}

function reviewedNameValue(language, value) {
  const text = String(value ?? '').normalize('NFKC').trim();
  if (language === 'zh') return text;
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim()
    .replace(/\s+/gu, ' ');
}

function containsReviewedClaim(extraction, reviewedClaim) {
  const reviewedCore = claimCoreContract(reviewedClaim);
  if (extraction.claims.some((current) =>
    claimCoreContract(current) === reviewedCore &&
    evidenceIncludes(current.evidence, reviewedClaim.evidence)
  )) return true;
  if (reviewedClaim.predicate !== 'name') return false;

  const currentNames = extraction.claims.filter((claim) =>
    claim.subject === reviewedClaim.subject &&
    claim.predicate === 'name' &&
    evidenceIncludes(claim.evidence, reviewedClaim.evidence)
  );
  const reviewedValues = ['en', 'zh', 'pinyin']
    .map((language) => [language, reviewedClaim.value?.[language]])
    .filter(([, value]) => typeof value === 'string' && value.length > 0);
  if (currentNames.length === 0 || reviewedValues.length === 0) return false;
  const person = extraction.people.find((item) => item.localId === reviewedClaim.subject);
  const valueIsPresent = ([language, value]) =>
    reviewedNameValue(language, person?.preferredNameSuggestion?.[language]) ===
      reviewedNameValue(language, value) ||
    currentNames.some((claim) =>
      reviewedNameValue(language, claim.value?.[language]) === reviewedNameValue(language, value)
    );
  return reviewedValues.every(valueIsPresent) && currentNames.some((claim) =>
    claim.certainty === reviewedClaim.certainty &&
    reviewedValues.some(([language, value]) => claim.value?.[language] === value)
  );
}

export function proposalContracts(extraction) {
  return extraction.translationRepairs
    .filter((repair) => repair.status === 'proposed')
    .map(proposalContract);
}

export function proposalSetFingerprint(proposals) {
  return sha256(JSON.stringify(proposals));
}

export function proposalsFingerprint(extraction) {
  return proposalSetFingerprint(proposalContracts(extraction));
}

export function editorialDecisionSeed(extraction) {
  const proposals = proposalContracts(extraction);
  return {
    schemaVersion: 3,
    book: extraction.book,
    chapter: extraction.chapter,
    input: {
      chapterFingerprint: extraction.input.chapterFingerprint,
      proposalsFingerprint: proposalSetFingerprint(proposals),
    },
    reviewer: {
      kind: 'cursor-agent',
      name: '',
      model: null,
      agentId: null,
      runId: null,
      completedAt: new Date(0).toISOString(),
    },
    proposals,
    decisions: proposals.map((repair) => ({
      repairId: repair.id,
      decision: 'reject',
      after: null,
      reason: '',
      sourceWitness: null,
    })),
    claimRetractions: [],
    claimRevisions: [],
    claimAdditions: [],
  };
}

function singleEditorialDocumentErrors(document, { validateSchema = true } = {}) {
  const errors = [];
  if (validateSchema) {
    const ajv = createPeopleSchemaValidator();
    const validate = ajv.getSchema(SCHEMA_V3_ID);
    if (!validate(document)) {
      errors.push(...formatSchemaErrors(validate.errors).map((error) => `schema: ${error}`));
    }
  }

  const embeddedProposalFingerprint = proposalSetFingerprint(document.proposals ?? []);
  if (document.input?.proposalsFingerprint !== embeddedProposalFingerprint) {
    errors.push('proposal fingerprint does not match the embedded proposals');
  }

  const proposals = document.proposals ?? [];
  const proposalById = new Map(proposals.map((repair) => [repair.id, repair]));
  if (proposalById.size !== proposals.length) errors.push('proposal IDs must be unique');
  const decisionById = new Map();
  for (const decision of document.decisions ?? []) {
    if (decisionById.has(decision.repairId)) errors.push(`duplicate decision for ${decision.repairId}`);
    decisionById.set(decision.repairId, decision);
    if (!proposalById.has(decision.repairId)) errors.push(`decision refers to unknown proposal ${decision.repairId}`);
  }
  for (const proposal of proposals) {
    if (!decisionById.has(proposal.id)) errors.push(`missing decision for ${proposal.id}`);
  }
  for (const decision of document.decisions ?? []) {
    const proposal = proposalById.get(decision.repairId);
    if (!proposal || decision.decision === 'reject') continue;
    const reviewedAfter = decision.decision === 'revise' ? decision.after : proposal.after;
    if (HANZI_RE.test(reviewedAfter)) {
      errors.push(`${proposal.id} reviewed English replacement contains Chinese characters`);
    }
    if (decision.decision === 'revise') {
      if (decision.after === proposal.before) {
        errors.push(`${proposal.id} revised replacement is identical to its original text`);
      }
      if (decision.after === proposal.after) {
        errors.push(`${proposal.id} uses revise without changing the proposal; use accept`);
      }
    }
  }

  const retractedClaimIds = new Set();
  for (const retraction of document.claimRetractions ?? []) {
    const claimId = retraction.claim?.id;
    if (retractedClaimIds.has(claimId)) errors.push(`duplicate claim retraction for ${claimId}`);
    retractedClaimIds.add(claimId);
    const proposal = proposalById.get(retraction.repairId);
    if (!proposal) {
      errors.push(`claim retraction refers to unknown proposal ${retraction.repairId}`);
      continue;
    }
    const decision = decisionById.get(retraction.repairId);
    if (!decision || decision.decision === 'reject') {
      errors.push(`claim retraction ${claimId} is tied to a rejected repair ${retraction.repairId}`);
    }
  }

  const revisedClaimIds = new Set();
  for (const revision of document.claimRevisions ?? []) {
    const claimId = revision.before?.id;
    if (revisedClaimIds.has(claimId)) errors.push(`duplicate claim revision for ${claimId}`);
    if (retractedClaimIds.has(claimId)) errors.push(`claim ${claimId} cannot be both retracted and revised`);
    revisedClaimIds.add(claimId);
    const proposal = proposalById.get(revision.repairId);
    if (!proposal) {
      errors.push(`claim revision refers to unknown proposal ${revision.repairId}`);
      continue;
    }
    const decision = decisionById.get(revision.repairId);
    if (!decision || decision.decision === 'reject') {
      errors.push(`claim revision ${claimId} is tied to a rejected repair ${revision.repairId}`);
    }
    if (revision.after?.id !== claimId) errors.push(`claim revision ${claimId} must preserve its claim ID`);
    for (const key of ['subject', 'predicate']) {
      if (JSON.stringify(revision.before?.[key]) !== JSON.stringify(revision.after?.[key])) {
        errors.push(`claim revision ${claimId} must preserve ${key}`);
      }
    }
    const repairedEvidence = proposal
      ? `${document.book}:${document.chapter}:${proposal.unit.id}`
      : null;
    const beforeEvidence = revision.before?.evidence ?? [];
    const afterEvidence = revision.after?.evidence ?? [];
    const removesOnlyRepairedEvidence =
      repairedEvidence &&
      beforeEvidence.includes(repairedEvidence) &&
      afterEvidence.length > 0 &&
      JSON.stringify(afterEvidence) === JSON.stringify(
        beforeEvidence.filter((evidence) => evidence !== repairedEvidence),
      );
    if (
      JSON.stringify(beforeEvidence) !== JSON.stringify(afterEvidence) &&
      !removesOnlyRepairedEvidence
    ) {
      errors.push(
        `claim revision ${claimId} may only remove the repaired unit from evidence ` +
        'while preserving at least one other citation',
      );
    }
    if (JSON.stringify(revision.before) === JSON.stringify(revision.after)) {
      errors.push(`claim revision ${claimId} does not change the claim`);
    }
  }

  const addedClaimIds = new Set();
  for (const addition of document.claimAdditions ?? []) {
    const claimId = addition.claim?.id;
    if (addedClaimIds.has(claimId)) errors.push(`duplicate claim addition for ${claimId}`);
    if (retractedClaimIds.has(claimId) || revisedClaimIds.has(claimId)) {
      errors.push(`claim ${claimId} cannot be added and also retracted or revised`);
    }
    addedClaimIds.add(claimId);
    const proposal = proposalById.get(addition.repairId);
    if (!proposal) {
      errors.push(`claim addition refers to unknown proposal ${addition.repairId}`);
      continue;
    }
    const decision = decisionById.get(addition.repairId);
    if (!decision || decision.decision === 'reject') {
      errors.push(`claim addition ${claimId} is tied to a rejected repair ${addition.repairId}`);
    }
  }

  return {
    errors,
    proposalById,
    decisionById,
    retractedClaimIds,
    revisedClaimIds,
    addedClaimIds,
  };
}

function editorialDocumentErrors(document) {
  if (document?.schemaVersion === 3) return singleEditorialDocumentErrors(document);

  const errors = [];
  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema(SCHEMA_V4_ID);
  if (!validate?.(document)) {
    errors.push(...formatSchemaErrors(validate?.errors).map((error) => `schema: ${error}`));
  }
  const proposalIds = new Set();
  const reviewFingerprints = new Set();
  for (const [index, review] of editorialReviews(document).entries()) {
    const result = singleEditorialDocumentErrors(review, { validateSchema: false });
    errors.push(...result.errors.map((error) => `review ${index + 1}: ${error}`));
    const fingerprint = review.input?.proposalsFingerprint;
    if (reviewFingerprints.has(fingerprint)) {
      errors.push(`review ${index + 1}: duplicate proposal-set fingerprint ${fingerprint}`);
    }
    reviewFingerprints.add(fingerprint);
    for (const proposal of review.proposals ?? []) {
      if (proposalIds.has(proposal.id)) {
        errors.push(`review ${index + 1}: proposal ID ${proposal.id} was already reviewed`);
      }
      proposalIds.add(proposal.id);
    }
  }
  return { errors };
}

export function validateEditorialDecisionDocument(document) {
  const result = editorialDocumentErrors(document);
  if (result.errors.length > 0) throw new EditorialDecisionValidationError(result.errors);
  return result;
}

function currentReview(document, extraction) {
  const proposals = proposalContracts(extraction);
  const fingerprint = proposalSetFingerprint(proposals);
  return editorialReviews(document).find((review) =>
    review.input?.proposalsFingerprint === fingerprint &&
    JSON.stringify(review.proposals) === JSON.stringify(proposals)
  ) ?? null;
}

export function hasEditorialReviewForProposals(document, extraction) {
  return currentReview(document, extraction) !== null;
}

export function mergeEditorialDecisionReview(existing, incoming) {
  validateEditorialDecisionDocument(existing);
  validateEditorialDecisionDocument(incoming);
  if (existing.book !== incoming.book || existing.chapter !== incoming.chapter) {
    throw new EditorialDecisionValidationError([
      `cannot merge ${incoming.book}/${incoming.chapter} review into ${existing.book}/${existing.chapter}`,
    ]);
  }
  const incomingReview = editorialReviews(incoming)[0];
  const reviews = editorialReviews(existing)
    .filter((review) => review.input.proposalsFingerprint !== incomingReview.input.proposalsFingerprint)
    .map(reviewRecord);
  reviews.push(reviewRecord(incomingReview));
  const merged = {
    schemaVersion: 4,
    book: existing.book,
    chapter: existing.chapter,
    reviews,
  };
  validateEditorialDecisionDocument(merged);
  return merged;
}

export function validateAppliedEditorialDecisions(document, extraction) {
  const documentResult = editorialDocumentErrors(document);
  const errors = [...documentResult.errors];
  const pendingReview = currentReview(document, extraction);
  const pendingFingerprint = pendingReview?.input.proposalsFingerprint ?? null;
  const repairsByTarget = new Map();
  for (const repair of extraction.translationRepairs) {
    const target = `${repair.unit.id}:${repair.field}`;
    const repairs = repairsByTarget.get(target) ?? [];
    repairs.push(repair);
    repairsByTarget.set(target, repairs);
  }
  for (const [index, review] of editorialReviews(document).entries()) {
    if (pendingFingerprint && review.input.proposalsFingerprint === pendingFingerprint) continue;
    const prefix = document.schemaVersion === 4 ? `review ${index + 1}: ` : '';
    const reviewResult = singleEditorialDocumentErrors(review, { validateSchema: false });
    if (
      review.reviewer?.agentId &&
      extraction.run?.agentId &&
      review.reviewer.agentId === extraction.run.agentId
    ) {
      errors.push(`${prefix}the extraction agent cannot review its own editorial proposals`);
    }
    for (const decision of review.decisions ?? []) {
      const proposal = reviewResult.proposalById.get(decision.repairId);
      if (!proposal) continue;
      const target = `${proposal.unit.id}:${proposal.field}`;
      if (decision.decision === 'reject') {
        if ((repairsByTarget.get(target) ?? []).some((repair) =>
          repair.status === 'applied' && repair.before === proposal.before
        )) {
          errors.push(`${prefix}rejected ${decision.repairId}, but it is applied`);
        }
        continue;
      }
      const expectedAfter = decision.decision === 'revise' ? decision.after : proposal.after;
      const applied = (repairsByTarget.get(target) ?? []).find((repair) =>
        repair.status === 'applied' &&
        repair.before === proposal.before &&
        repair.after === expectedAfter
      );
      if (!applied) {
        errors.push(`${prefix}does not match applied decision ${decision.repairId}`);
      } else if (applied.reason !== decision.reason) {
        errors.push(`${prefix}lost review reasoning for ${decision.repairId}`);
      }
    }
    for (const retraction of review.claimRetractions ?? []) {
      if (exactReviewedClaimMatches(extraction, retraction.claim).length > 0) {
        errors.push(`${prefix}retracted ${retraction.claim.id}, but its fact remains applied`);
      }
    }
    for (const revision of review.claimRevisions ?? []) {
      const replacementPresent = containsReviewedClaim(extraction, revision.after);
      if (exactReviewedClaimMatches(extraction, revision.before).length > 0) {
        errors.push(`${prefix}revised ${revision.before.id}, but its old fact remains applied`);
      }
      if (!replacementPresent) {
        errors.push(`${prefix}revised ${revision.before.id}, but its replacement fact is missing`);
      }
    }
    for (const addition of review.claimAdditions ?? []) {
      if (!containsReviewedClaim(extraction, addition.claim)) {
        errors.push(`${prefix}added ${addition.claim.id}, but its fact is missing`);
      }
    }
  }

  if (errors.length > 0) throw new EditorialDecisionValidationError(errors);
  return documentResult;
}

function exactReviewedClaimMatches(extraction, reviewedClaim) {
  const reviewedCore = claimCoreContract(reviewedClaim);
  return extraction.claims.filter((claim) =>
    claimCoreContract(claim) === reviewedCore &&
    evidenceIncludes(claim.evidence, reviewedClaim.evidence)
  );
}

function nextPreservedClaimId(extraction) {
  const namespace = `${extraction.book}:${extraction.chapter}:c`;
  const used = new Set(extraction.claims.map((claim) => claim.id));
  let ordinal = Math.max(0, ...[...used]
    .filter((id) => id.startsWith(namespace))
    .map((id) => Number(id.slice(namespace.length)))
    .filter(Number.isInteger)) + 1;
  return () => {
    let id;
    do id = `${namespace}${String(ordinal++).padStart(4, '0')}`;
    while (used.has(id));
    used.add(id);
    return id;
  };
}

export function preserveAppliedEditorialClaims(document, extraction) {
  const result = editorialDocumentErrors(document);
  if (result.errors.length > 0) throw new EditorialDecisionValidationError(result.errors);
  const nextClaimId = nextPreservedClaimId(extraction);
  let removed = 0;
  let restored = 0;

  const removeExact = (reviewedClaim) => {
    const matches = new Set(exactReviewedClaimMatches(extraction, reviewedClaim));
    if (matches.size === 0) return;
    extraction.claims = extraction.claims.filter((claim) => !matches.has(claim));
    removed += matches.size;
  };
  const restore = (reviewedClaim) => {
    if (containsReviewedClaim(extraction, reviewedClaim)) return;
    if (!extraction.people.some((person) => person.localId === reviewedClaim.subject)) {
      throw new EditorialDecisionValidationError([
        `cannot preserve reviewed claim ${reviewedClaim.id}: subject ${reviewedClaim.subject} is missing`,
      ]);
    }
    const claim = { ...structuredClone(reviewedClaim), id: nextClaimId() };
    extraction.claims.push(claim);
    restored += 1;
    if (claim.predicate !== 'name') return;
    const person = extraction.people.find((item) => item.localId === claim.subject);
    for (const field of ['en', 'zh', 'pinyin']) {
      if (typeof claim.value?.[field] === 'string' && claim.value[field].length > 0) {
        person.preferredNameSuggestion[field] = claim.value[field];
      }
    }
  };

  for (const review of editorialReviews(document)) {
    for (const retraction of review.claimRetractions ?? []) removeExact(retraction.claim);
    for (const revision of review.claimRevisions ?? []) {
      removeExact(revision.before);
      restore(revision.after);
    }
    for (const addition of review.claimAdditions ?? []) restore(addition.claim);
  }
  return { removed, restored };
}

export function validateEditorialDecisions(document, extraction, packet) {
  const allResults = editorialDocumentErrors(document);
  const errors = [...allResults.errors];
  const review = currentReview(document, extraction);
  if (!review) {
    errors.push('no review batch matches the current proposed repairs');
    throw new EditorialDecisionValidationError(errors);
  }
  const documentResult = singleEditorialDocumentErrors(review, { validateSchema: false });
  errors.push(...documentResult.errors);

  if (review.book !== extraction.book || review.chapter !== extraction.chapter) {
    errors.push(
      `decision scope ${review.book}/${review.chapter} does not match extraction ` +
      `${extraction.book}/${extraction.chapter}`,
    );
  }
  if (review.input?.chapterFingerprint !== packet.input.chapterFingerprint) {
    errors.push('chapter fingerprint does not match the current chapter');
  }
  const expectedProposals = proposalContracts(extraction);
  const expectedProposalFingerprint = proposalSetFingerprint(expectedProposals);
  if (
    review.input?.proposalsFingerprint !== expectedProposalFingerprint ||
    JSON.stringify(review.proposals) !== JSON.stringify(expectedProposals)
  ) {
    errors.push('proposal fingerprint does not match the current proposed repairs');
  }
  if (
    review.reviewer?.agentId &&
    extraction.run?.agentId &&
    review.reviewer.agentId === extraction.run.agentId
  ) {
    errors.push('the extraction agent cannot review its own editorial proposals');
  }

  const reviewedRepairs = [];
  for (const proposal of extraction.translationRepairs.filter((repair) => repair.status === 'proposed')) {
    const decision = documentResult.decisionById.get(proposal.id);
    if (!decision || decision.decision === 'reject') continue;
    const after = decision.decision === 'revise' ? decision.after : proposal.after;
    if (after === proposal.before) errors.push(`${proposal.id} reviewed replacement is identical to its original text`);
    reviewedRepairs.push({
      ...proposal,
      after,
      reason: decision.reason,
    });
  }

  const claimById = new Map(extraction.claims.map((claim) => [claim.id, claim]));
  const retractedClaimIds = new Set();
  for (const retraction of review.claimRetractions ?? []) {
    const current = claimById.get(retraction.claim.id);
    if (!current) {
      errors.push(`claim retraction refers to missing claim ${retraction.claim.id}`);
      continue;
    }
    if (JSON.stringify(current) !== JSON.stringify(retraction.claim)) {
      errors.push(`claim retraction contract is stale for ${retraction.claim.id}`);
    }
    const proposal = documentResult.proposalById.get(retraction.repairId);
    const expectedEvidence = `${extraction.book}:${extraction.chapter}:${proposal?.unit.id}`;
    if (!retraction.claim.evidence.includes(expectedEvidence)) {
      errors.push(
        `claim retraction ${retraction.claim.id} is not evidenced in repaired unit ${proposal?.unit.id}`,
      );
    }
    retractedClaimIds.add(retraction.claim.id);
  }

  const revisedClaims = new Map();
  for (const revision of review.claimRevisions ?? []) {
    const current = claimById.get(revision.before.id);
    if (!current) {
      errors.push(`claim revision refers to missing claim ${revision.before.id}`);
      continue;
    }
    if (JSON.stringify(current) !== JSON.stringify(revision.before)) {
      errors.push(`claim revision contract is stale for ${revision.before.id}`);
    }
    const proposal = documentResult.proposalById.get(revision.repairId);
    const expectedEvidence = `${extraction.book}:${extraction.chapter}:${proposal?.unit.id}`;
    if (!revision.before.evidence.includes(expectedEvidence)) {
      errors.push(
        `claim revision ${revision.before.id} is not evidenced in repaired unit ${proposal?.unit.id}`,
      );
    }
    revisedClaims.set(revision.before.id, structuredClone(revision.after));
  }

  const people = new Set(extraction.people.map((person) => person.localId));
  const addedClaims = [];
  for (const addition of review.claimAdditions ?? []) {
    const claim = addition.claim;
    if (claimById.has(claim.id)) {
      errors.push(`claim addition reuses existing claim ID ${claim.id}`);
      continue;
    }
    if (!people.has(claim.subject)) {
      errors.push(`claim addition ${claim.id} refers to missing subject ${claim.subject}`);
    }
    const proposal = documentResult.proposalById.get(addition.repairId);
    const expectedEvidence = `${extraction.book}:${extraction.chapter}:${proposal?.unit.id}`;
    if (!claim.evidence.includes(expectedEvidence)) {
      errors.push(
        `claim addition ${claim.id} is not evidenced in repaired unit ${proposal?.unit.id}`,
      );
    }
    addedClaims.push(structuredClone(claim));
  }

  if (errors.length > 0) throw new EditorialDecisionValidationError(errors);
  return {
    reviewedRepairs,
    decisions: documentResult.decisionById,
    retractedClaimIds,
    revisedClaims,
    addedClaims,
  };
}
