#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { PEOPLE_DIR, REPO_ROOT, readJson } from './lib/people-content.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';
import { createPeopleSchemaValidator, formatSchemaErrors } from './lib/people-schema.mjs';
import { validatePeopleExtraction } from './validate-people-extraction.mjs';

function assertUnique(items, key, label, errors) {
  const seen = new Set();
  for (const item of items) {
    const value = item[key];
    if (seen.has(value)) errors.push(`duplicate ${label} ${value}`);
    seen.add(value);
  }
  return seen;
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
    promptVersion: 2,
    candidateScannerVersion: 1,
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
  for (const file of files) {
    const extraction = readJson(file);
    const packet = buildPeopleExtractionPacket(extraction.book, extraction.chapter, { properNounMatcher: matcher });
    const result = validatePeopleExtraction(extraction, packet);
    people += result.stats.people;
    mentions += result.stats.mentions;
    claims += result.stats.claims;
  }
  console.log(
    `Person data validation passed: ${files.length} extraction(s), ${people} local people, ` +
    `${mentions} mentions, ${claims} claims.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
