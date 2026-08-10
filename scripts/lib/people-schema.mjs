import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { PEOPLE_DIR, readJson } from './people-content.mjs';

const SCHEMA_DIR = path.join(PEOPLE_DIR, 'schema');

export function createPeopleSchemaValidator() {
  const ajv = new Ajv2020({
    allErrors: true,
    allowUnionTypes: true,
    strict: true,
    strictRequired: false,
  });
  addFormats(ajv);
  for (const name of fs.readdirSync(SCHEMA_DIR).filter((file) => file.endsWith('.schema.json')).sort()) {
    ajv.addSchema(readJson(path.join(SCHEMA_DIR, name)));
  }
  return ajv;
}

export function formatSchemaErrors(errors) {
  return (errors ?? []).map((error) => {
    const location = error.instancePath || '/';
    return `${location} ${error.message}`;
  });
}
