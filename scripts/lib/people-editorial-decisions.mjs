import path from 'node:path';
import {
  PEOPLE_DIR,
  sha256,
} from './people-content.mjs';
import {
  createPeopleSchemaValidator,
  formatSchemaErrors,
} from './people-schema.mjs';

const SCHEMA_ID = 'https://24histories.com/schema/people/editorial-decision-v3.json';

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

function proposalContract(repair) {
  const { status: _status, ...contract } = repair;
  return contract;
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
  };
}

function editorialDocumentErrors(document) {
  const errors = [];
  const ajv = createPeopleSchemaValidator();
  const validate = ajv.getSchema(SCHEMA_ID);
  if (!validate(document)) {
    errors.push(...formatSchemaErrors(validate.errors).map((error) => `schema: ${error}`));
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
    if (!proposal || decision.decision !== 'revise') continue;
    if (decision.after === proposal.before) {
      errors.push(`${proposal.id} revised replacement is identical to its original text`);
    }
    if (decision.after === proposal.after) {
      errors.push(`${proposal.id} uses revise without changing the proposal; use accept`);
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

  return { errors, proposalById, decisionById, retractedClaimIds, revisedClaimIds };
}

export function validateEditorialDecisionDocument(document) {
  const result = editorialDocumentErrors(document);
  if (result.errors.length > 0) throw new EditorialDecisionValidationError(result.errors);
  return result;
}

export function validateEditorialDecisions(document, extraction, packet) {
  const documentResult = editorialDocumentErrors(document);
  const errors = [...documentResult.errors];

  if (document.book !== extraction.book || document.chapter !== extraction.chapter) {
    errors.push(
      `decision scope ${document.book}/${document.chapter} does not match extraction ` +
      `${extraction.book}/${extraction.chapter}`,
    );
  }
  if (document.input?.chapterFingerprint !== packet.input.chapterFingerprint) {
    errors.push('chapter fingerprint does not match the current chapter');
  }
  const expectedProposals = proposalContracts(extraction);
  const expectedProposalFingerprint = proposalSetFingerprint(expectedProposals);
  if (
    document.input?.proposalsFingerprint !== expectedProposalFingerprint ||
    JSON.stringify(document.proposals) !== JSON.stringify(expectedProposals)
  ) {
    errors.push('proposal fingerprint does not match the current proposed repairs');
  }
  if (
    document.reviewer?.agentId &&
    extraction.run?.agentId &&
    document.reviewer.agentId === extraction.run.agentId
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
  for (const retraction of document.claimRetractions ?? []) {
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
  for (const revision of document.claimRevisions ?? []) {
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

  if (errors.length > 0) throw new EditorialDecisionValidationError(errors);
  return { reviewedRepairs, decisions: documentResult.decisionById, retractedClaimIds, revisedClaims };
}
