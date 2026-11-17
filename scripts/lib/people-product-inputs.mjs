import path from 'node:path';
import {PEOPLE_DIR, readJson} from './people-content.mjs';
import {peopleDigest} from './people-identity-seal.mjs';
import {projectPeopleProduct} from '../compile-people-catalog.mjs';
import {dateAuditStatus} from './people-date-audit.mjs';

// Website, ebook qualification and bounded host preflights must use the same
// required curation. Missing inputs are errors, never an uncurated projection.
export function loadPeopleProductInputs(peopleDirectory = PEOPLE_DIR) {
  const rolesFile = path.join(peopleDirectory, 'curation/role-vocabulary.json');
  const overridesFile = path.join(peopleDirectory, 'curation/overrides.json');
  const roles = readJson(rolesFile), overrides = readJson(overridesFile);
  if (!Array.isArray(roles.roles) || !overrides.people || typeof overrides.people !== 'object' || Array.isArray(overrides.people)) {
    throw new Error('Invalid required people product curation inputs');
  }
  const roleLabels = new Map();
  for (const role of roles.roles) {
    if (typeof role.id !== 'string' || typeof role.label !== 'string' || roleLabels.has(role.id)) throw new Error('Invalid or duplicate product role');
    roleLabels.set(role.id, role.label);
  }
  return {roleLabels, overrides: overrides.people,
    evidence: {rolesFile, overridesFile, roles: peopleDigest(roles), overrides: peopleDigest(overrides)}};
}

export function projectQualifiedPeopleProduct(corpus, catalog, certificates, {peopleDirectory = PEOPLE_DIR, getDateStatus = dateAuditStatus} = {}) {
  const inputs = loadPeopleProductInputs(peopleDirectory);
  const projected = projectPeopleProduct(corpus, catalog, inputs.roleLabels, inputs.overrides, getDateStatus, certificates);
  return {...projected, productInputs: inputs.evidence};
}
