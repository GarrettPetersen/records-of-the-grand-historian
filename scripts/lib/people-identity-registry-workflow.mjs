import fs from 'node:fs';
import path from 'node:path';
import { identityDossierInputs } from './people-identity-seal.mjs';
import { visitValidatedPeopleCorpus, loadValidatedResolutionDocuments } from './people-corpus.mjs';
import { localNameKeys, resolveAcceptedPeopleClusters } from './people-resolution.mjs';
import { streamIdentityDossierIndex } from './people-identity-dossiers.mjs';
import { writeValidatedIdentityMembers } from './people-identity-member-store.mjs';
import { writeIdentityDossierStore } from './people-identity-dossier-store.mjs';
import { REPO_ROOT, PEOPLE_DIR } from './people-content.mjs';
import { acquireProcessRunLock } from './process-run-lock.mjs';

export function buildIdentityDossierRegistry({ out, revision }) {
  if (!path.isAbsolute(out ?? '') || !/^[a-f0-9]{40}$/u.test(revision ?? '')) throw new Error('An absolute new registry directory and exact --revision are required');
  if (fs.existsSync(out)) throw new Error('Immutable dossier generation already exists; reuse it or choose a new generation');
  const release = acquireProcessRunLock(path.join(PEOPLE_DIR, 'generated/resolution-run.lock'), { label: 'Canonical dossier registry generation', failIfExists: true });
  const membersDirectory = `${out}.members`;
  let members;
  try {
    const inputs = identityDossierInputs(REPO_ROOT);
    members = writeValidatedIdentityMembers(membersDirectory, visitValidatedPeopleCorpus);
    const documents = loadValidatedResolutionDocuments(members.constraints);
    const accepted = resolveAcceptedPeopleClusters(members.constraints, documents);
    members.constraints.clear();
    const index = streamIdentityDossierIndex(members.people, accepted.clusters, localNameKeys);
    if (identityDossierInputs(REPO_ROOT) !== inputs) throw new Error('Identity inputs changed during registry construction; no generation published');
    const manifest = writeIdentityDossierStore(out, index, { revision, identityInputs: inputs,
      acceptedResolutionDocuments: documents.length, sourceChapters: members.coverage.sourceChapters,
      extractedChapters: members.coverage.extractedChapters, normalizedLocalPeople: members.people.size,
      matching: 'native-source-name-keys', generatedPairs: 0 });
    if (identityDossierInputs(REPO_ROOT) !== inputs) throw new Error('Identity inputs changed while writing the generation; preserve it and do not use it for new work');
    // Only a successful, source-pinned published generation makes this scratch
    // spool disposable. Interrupted validation/build spools remain for diagnosis.
    members.close();
    fs.rmSync(membersDirectory, { recursive: true });
    return { manifest, metrics: accepted.metrics, sourceChapters: members.coverage.sourceChapters,
      extractedChapters: members.coverage.extractedChapters, canonicalPeople: accepted.clusters.length, generatedPairs: 0 };
  } finally { members?.close(); release(); }
}
