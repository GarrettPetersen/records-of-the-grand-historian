import path from 'node:path';
import {
  PEOPLE_DIR,
  sha256,
} from './people-content.mjs';
import {
  createPeopleSchemaValidator,
  formatSchemaErrors,
} from './people-schema.mjs';

const SCHEMA_ID = 'https://24histories.com/schema/people/editorial-decision-v1.json';

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
    schemaVersion: 1,
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

  return { errors, proposalById, decisionById };
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

  if (errors.length > 0) throw new EditorialDecisionValidationError(errors);
  return { reviewedRepairs, decisions: documentResult.decisionById };
}
