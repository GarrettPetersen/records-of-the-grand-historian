#!/usr/bin/env node
import { buildIdentityDossierRegistry } from './lib/people-identity-registry-workflow.mjs';
import path from 'node:path';
import { assertRemotePeopleGeneration, assertSharedPeopleRegistry, assertNoDuplicatePeopleRegistry } from './lib/people-generation-policy.mjs';
import { identityDossierInputs } from './lib/people-identity-seal.mjs';
import { REPO_ROOT } from './lib/people-content.mjs';
const options = {}, args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 2) {
  const name = args[index].slice(2);
  if (!args[index].startsWith('--') || !['out','revision'].includes(name) || !args[index+1] || Object.hasOwn(options,name)) throw new Error('Usage: --out ABSOLUTE_NEW_DIRECTORY --revision FULL_GIT_SHA');
  options[name] = args[index+1];
}
assertRemotePeopleGeneration('Full identity registry generation');
assertSharedPeopleRegistry(options.out, REPO_ROOT);
assertNoDuplicatePeopleRegistry(path.dirname(options.out), identityDossierInputs());
console.log(JSON.stringify(buildIdentityDossierRegistry(options), null, 2));
