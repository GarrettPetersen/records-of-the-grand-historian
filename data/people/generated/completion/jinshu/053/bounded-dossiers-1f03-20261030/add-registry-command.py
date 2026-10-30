from pathlib import Path
J=Path(__file__).resolve().parent;C=J/'candidate'
p=C/'scripts/lib/people-identity-seal.mjs';s=p.read_text();s=s.replace('export function identityInputSeal(root = REPO_ROOT) {','function identityInputFiles(root) {')
old="""  return peopleDigest(files.sort().map(file => [file.split(path.sep).join('/'),
    crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
}"""
new="""  return files.sort();
}

function fingerprintInputFiles(root, files) {
  return peopleDigest(files.map(file => [file.split(path.sep).join('/'),
    crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
}

export function identityInputSeal(root = REPO_ROOT) {
  return fingerprintInputFiles(root, identityInputFiles(root));
}

// Recording a retained-identity review changes publication authority, not name
// retrieval or accepted canonical membership. Reuse the immutable index then.
export function identityDossierInputs(root = REPO_ROOT) {
  return fingerprintInputFiles(root, identityInputFiles(root).filter(file =>
    !file.split(path.sep).join('/').startsWith('data/people/identity-reviews/')));
}"""
assert s.count(old)==1;s=s.replace(old,new);p.write_text(s)
p=C/'scripts/lib/people-resource-job.mjs';p.write_text(r'''import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { inspectLocalDisk } from '../check-local-disk.mjs';

// Monitor in a separate process so synchronous corpus validation cannot prevent
// the required host measurements. Preserve active work on a resource stop.
export async function runGuardedPeopleScript(script, args) {
  const hostRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  let resourceHold = false;
  const sample = () => {
    const result = inspectLocalDisk(hostRoot);
    if (result.errors.length) { resourceHold = true; console.error(JSON.stringify({ peopleResourceHold: true, errors: result.errors, preserveActiveWork: true })); }
    return result;
  };
  if (sample().errors.length) throw new Error('Host resource guard rejected the new job');
  const child = spawn(process.execPath, ['--max-old-space-size=3072', fileURLToPath(script), ...args], { cwd: hostRoot, stdio: 'inherit' });
  const timer = setInterval(() => { try { sample(); } catch (error) { resourceHold = true; console.error(`Host measurement failed; no new work: ${error.message}`); } }, 45_000);
  try {
    const code = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', (status, signal) => signal ? reject(new Error(`People job terminated by ${signal}`)) : resolve(status)); });
    sample();
    if (resourceHold) throw new Error('Host resource hold; preserve completed artifacts and do not dispatch more work');
    if (code !== 0) throw new Error(`People job exited with status ${code}`);
  } finally { clearInterval(timer); }
}
''')
p=C/'scripts/lib/people-identity-registry-workflow.mjs';p.write_text(r'''import fs from 'node:fs';
import path from 'node:path';
import { identityDossierInputs } from './people-identity-seal.mjs';
import { loadValidatedPeopleCorpus, loadValidatedResolutionDocuments } from './people-corpus.mjs';
import { localNameKeys, resolveAcceptedPeopleClusters } from './people-resolution.mjs';
import { buildIdentityDossierIndex } from './people-identity-dossiers.mjs';
import { writeIdentityDossierStore } from './people-identity-dossier-store.mjs';
import { REPO_ROOT, PEOPLE_DIR } from './people-content.mjs';
import { acquireProcessRunLock } from './process-run-lock.mjs';

export function buildIdentityDossierRegistry({ out, revision }) {
  if (!path.isAbsolute(out ?? '') || !/^[a-f0-9]{40}$/u.test(revision ?? '')) throw new Error('An absolute new registry directory and exact --revision are required');
  if (fs.existsSync(out)) throw new Error('Immutable dossier generation already exists; reuse it or choose a new generation');
  const release = acquireProcessRunLock(path.join(PEOPLE_DIR, 'generated/resolution-run.lock'), { label: 'Canonical dossier registry generation', failIfExists: true });
  try {
    const inputs = identityDossierInputs(REPO_ROOT), corpus = loadValidatedPeopleCorpus();
    const documents = loadValidatedResolutionDocuments(corpus.localPeople), accepted = resolveAcceptedPeopleClusters(corpus.localPeople, documents);
    const index = buildIdentityDossierIndex(corpus.localPeople, accepted.clusters, localNameKeys);
    if (identityDossierInputs(REPO_ROOT) !== inputs) throw new Error('Identity inputs changed during registry construction; no generation published');
    const manifest = writeIdentityDossierStore(out, index, { revision, identityInputs: inputs,
      acceptedResolutionDocuments: documents.length, sourceChapters: corpus.coverage.sourceChapters,
      extractedChapters: corpus.chapters.length, normalizedLocalPeople: corpus.localPeople.size,
      matching: 'native-source-name-keys', generatedPairs: 0 });
    if (identityDossierInputs(REPO_ROOT) !== inputs) throw new Error('Identity inputs changed while writing the generation; preserve it and do not use it for new work');
    return { manifest, metrics: accepted.metrics, sourceChapters: corpus.coverage.sourceChapters,
      extractedChapters: corpus.chapters.length, canonicalPeople: accepted.clusters.length, generatedPairs: 0 };
  } finally { release(); }
}
''')
p=C/'scripts/people-identity-registry.mjs';p.write_text(r'''#!/usr/bin/env node
import { runGuardedPeopleScript } from './lib/people-resource-job.mjs';
await runGuardedPeopleScript(new URL('./people-identity-registry-worker.mjs', import.meta.url), process.argv.slice(2));
''')
p=C/'scripts/people-identity-registry-worker.mjs';p.write_text(r'''#!/usr/bin/env node
import { buildIdentityDossierRegistry } from './lib/people-identity-registry-workflow.mjs';
const options = {}, args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 2) {
  const name = args[index].slice(2);
  if (!args[index].startsWith('--') || !['out','revision'].includes(name) || !args[index+1] || Object.hasOwn(options,name)) throw new Error('Usage: --out ABSOLUTE_NEW_DIRECTORY --revision FULL_GIT_SHA');
  options[name] = args[index+1];
}
console.log(JSON.stringify(buildIdentityDossierRegistry(options), null, 2));
''')
