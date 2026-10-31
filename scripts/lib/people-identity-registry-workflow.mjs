import fs from 'node:fs';
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
