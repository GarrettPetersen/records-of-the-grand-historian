#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import {
  PEOPLE_DIR,
  REPO_ROOT,
  extractionPath,
  readJson,
} from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { isCompactPeopleExtraction } from './lib/people-compact.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';
import {
  editorialDecisionPath,
  validateEditorialDecisions,
  validateEditorialDecisionDocument,
} from './lib/people-editorial-decisions.mjs';
import {
  validateCompactPeopleExtraction,
  validatePeopleExtraction,
} from './validate-people-extraction.mjs';

function assertUnique(items, key, label, errors) {
  const seen = new Set();
  for (const item of items) {
    const value = item[key];
    if (seen.has(value)) errors.push(`duplicate ${label} ${value}`);
    seen.add(value);
  }
  return seen;
}

function claimFactContract(claim) {
  const { id: _id, ...contract } = claim;
  return JSON.stringify(contract);
}

function extractionFiles() {
  const root = path.join(PEOPLE_DIR, 'extractions');
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const book of fs.readdirSync(root).sort()) {
    const directory = path.join(root, book);
    if (!fs.statSync(directory).isDirectory()) continue;
    for (const name of fs.readdirSync(directory).filter((file) => /^\d{3}\.json$/u.test(file)).sort()) {
      files.push(path.join(directory, name));
    }
  }
  return files;
}

function editorialDecisionFiles() {
  const root = path.join(PEOPLE_DIR, 'editorial-decisions');
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const book of fs.readdirSync(root).sort()) {
    const directory = path.join(root, book);
    if (!fs.statSync(directory).isDirectory()) continue;
    for (const name of fs.readdirSync(directory).filter((file) => /^\d{3}\.json$/u.test(file)).sort()) {
      files.push(path.join(directory, name));
    }
  }
  return files;
}

function validateChronology(ajv, errors) {
  const validate = ajv.getSchema('https://24histories.com/schema/people/chronology-v1.json');
  const polityData = readJson(path.join(PEOPLE_DIR, 'chronology', 'polities.json'));
  const reignData = readJson(path.join(PEOPLE_DIR, 'chronology', 'reigns.json'));
  for (const [label, value] of [['polities.json', polityData], ['reigns.json', reignData]]) {
    if (!validate(value)) errors.push(...formatSchemaErrors(validate.errors).map((item) => `${label}: ${item}`));
  }
  const polityIds = assertUnique(polityData.polities, 'id', 'polity ID', errors);
  assertUnique(reignData.reigns, 'id', 'reign ID', errors);
  for (const reign of reignData.reigns) {
    if (!polityIds.has(reign.polityId)) errors.push(`${reign.id} refers to unknown polity ${reign.polityId}`);
    const mapping = reign.yearMapping;
    const mappedEnd = mapping.westernYearStart + mapping.regnalYearEnd - mapping.regnalYearStart;
    if (reign.startYear.era === 'AD' && reign.startYear.year !== mapping.westernYearStart) {
      errors.push(`${reign.id} start year does not match its linear mapping`);
    }
    if (reign.endYear.era === 'AD' && reign.endYear.year !== mappedEnd) {
      errors.push(`${reign.id} end year does not match its linear mapping`);
    }
  }
}

function validateConfiguration(errors) {
  const config = readJson(path.join(PEOPLE_DIR, 'config.json'));
  const expectedVersions = {
    schemaVersion: 1,
    extractionSchemaVersion: 1,
    packetSchemaVersion: 1,
    promptVersion: 4,
    candidateScannerVersion: 2,
  };
  for (const [key, expected] of Object.entries(expectedVersions)) {
    if (config[key] !== expected) errors.push(`config ${key} must be ${expected} for the current implementation`);
  }
  if (config.westernEraStyle !== 'BC_AD') errors.push('config westernEraStyle must be BC_AD');
  const roleData = readJson(path.join(PEOPLE_DIR, 'curation', 'role-vocabulary.json'));
  if (roleData.schemaVersion !== 1 || !Array.isArray(roleData.roles)) errors.push('invalid role vocabulary envelope');
  assertUnique(roleData.roles, 'id', 'role ID', errors);
  for (const role of roleData.roles) {
    if (!/^[a-z0-9-]+$/u.test(role.id) || !role.label?.trim()) errors.push(`invalid role vocabulary entry ${JSON.stringify(role)}`);
  }
}

async function main() {
  const errors = [];
  const ajv = createPeopleSchemaValidator();
  validateConfiguration(errors);
  validateChronology(ajv, errors);
  if (errors.length > 0) throw new Error(`Person data validation failed:\n${errors.map((item) => `- ${item}`).join('\n')}`);

  const files = extractionFiles();
  const matcher = files.length > 0 ? loadProperNounMatcher() : null;
  let people = 0;
  let mentions = 0;
  let claims = 0;
  let proposedRepairs = 0;
  let appliedRepairs = 0;
  const extractionByScope = new Map();
  for (const file of files) {
    const extraction = readJson(file);
    const packet = buildPeopleExtractionPacket(extraction.book, extraction.chapter, { properNounMatcher: matcher });
    const result = isCompactPeopleExtraction(extraction)
      ? validateCompactPeopleExtraction(extraction, packet)
      : validatePeopleExtraction(extraction, packet);
    people += result.stats.people;
    mentions += result.stats.mentions;
    claims += result.stats.claims;
    for (const repair of result.normalized.translationRepairs) {
      if (repair.status === 'proposed') proposedRepairs += 1;
      else if (repair.status === 'applied') appliedRepairs += 1;
    }
    extractionByScope.set(`${extraction.book}/${extraction.chapter}`, {
      extraction: result.normalized,
      packet,
    });
  }

  let editorialDecisions = 0;
  let claimRetractions = 0;
  let claimRevisions = 0;
  for (const file of editorialDecisionFiles()) {
    const document = readJson(file);
    try {
      validateEditorialDecisionDocument(document);
    } catch (error) {
      errors.push(...(error.errors ?? [error.message]).map((item) => `${path.relative(REPO_ROOT, file)}: ${item}`));
      continue;
    }
    const expected = path.resolve(extractionPath(document.book, document.chapter));
    const scope = `${document.book}/${document.chapter}`;
    const loaded = extractionByScope.get(scope);
    if (!fs.existsSync(expected) || !loaded) {
      errors.push(`${path.relative(REPO_ROOT, file)} has no corresponding extraction`);
    }
    if (path.resolve(file) !== path.resolve(editorialDecisionPath(document.book, document.chapter))) {
      errors.push(`${path.relative(REPO_ROOT, file)} path does not match its book and chapter scope`);
    }
    if (loaded) {
      const statuses = new Set(loaded.extraction.translationRepairs.map((repair) => repair.status));
      if (statuses.has('proposed')) {
        try {
          validateEditorialDecisions(document, loaded.extraction, loaded.packet);
        } catch (error) {
          errors.push(...(error.errors ?? [error.message]).map((item) => `${path.relative(REPO_ROOT, file)}: ${item}`));
        }
      } else {
        if (
          document.reviewer.agentId &&
          loaded.extraction.run.agentId &&
          document.reviewer.agentId === loaded.extraction.run.agentId
        ) {
          errors.push(`${path.relative(REPO_ROOT, file)} was self-reviewed by the extraction agent`);
        }
        const appliedByTarget = new Map(loaded.extraction.translationRepairs.map((repair) => [
          `${repair.unit.id}:${repair.field}`,
          repair,
        ]));
        const proposalById = new Map(document.proposals.map((proposal) => [proposal.id, proposal]));
        for (const decision of document.decisions) {
          const proposal = proposalById.get(decision.repairId);
          const target = `${proposal.unit.id}:${proposal.field}`;
          const applied = appliedByTarget.get(target);
          if (decision.decision === 'reject') {
            if (applied?.before === proposal.before) {
              errors.push(`${path.relative(REPO_ROOT, file)} rejected ${decision.repairId}, but it is applied`);
            }
            continue;
          }
          const expectedAfter = decision.decision === 'revise' ? decision.after : proposal.after;
          if (!applied || applied.before !== proposal.before || applied.after !== expectedAfter) {
            errors.push(`${path.relative(REPO_ROOT, file)} does not match applied decision ${decision.repairId}`);
          } else if (applied.reason !== decision.reason) {
            errors.push(`${path.relative(REPO_ROOT, file)} lost review reasoning for ${decision.repairId}`);
          }
        }
        const currentClaimFacts = new Set(loaded.extraction.claims.map(claimFactContract));
        for (const retraction of document.claimRetractions) {
          if (currentClaimFacts.has(claimFactContract(retraction.claim))) {
            errors.push(
              `${path.relative(REPO_ROOT, file)} retracted ${retraction.claim.id}, but its fact remains applied`,
            );
          }
        }
        for (const revision of document.claimRevisions) {
          if (currentClaimFacts.has(claimFactContract(revision.before))) {
            errors.push(
              `${path.relative(REPO_ROOT, file)} revised ${revision.before.id}, but its old fact remains applied`,
            );
          }
          if (!currentClaimFacts.has(claimFactContract(revision.after))) {
            errors.push(
              `${path.relative(REPO_ROOT, file)} revised ${revision.before.id}, but its replacement fact is missing`,
            );
          }
        }
      }
    }
    editorialDecisions += document.decisions.length;
    claimRetractions += document.claimRetractions.length;
    claimRevisions += document.claimRevisions.length;
  }
  if (errors.length > 0) {
    throw new Error(`Person data validation failed:\n${errors.map((item) => `- ${item}`).join('\n')}`);
  }
  console.log(
    `Person data validation passed: ${files.length} extraction(s), ${people} local people, ` +
    `${mentions} mentions, ${claims} claims, ${proposedRepairs} proposed repair(s), ` +
    `${appliedRepairs} applied repair(s), ${editorialDecisions} editorial decision(s), ` +
    `${claimRetractions} claim retraction(s), ${claimRevisions} claim revision(s).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
