import fs from 'node:fs';
import path from 'node:path';
import { DATA_DIR } from './people-content.mjs';
import { loadQualifiedPeopleScope } from './people-qualified-scope.mjs';
import { peopleDigest, stableJson } from './people-identity-seal.mjs';

export function websiteChapterInventory() {
  return fs.readdirSync(DATA_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== 'people')
    .flatMap(entry => fs.readdirSync(path.join(DATA_DIR, entry.name))
      .filter(name => /^\d{3}\.json$/u.test(name))
      .map(name => ({ book: entry.name, chapter: name.slice(0, -5) })))
    .sort((a, b) => `${a.book}:${a.chapter}`.localeCompare(`${b.book}:${b.chapter}`, 'en'));
}

export function loadCertifiedPeopleSite({ expectedInputs = null } = {}) {
  const scopes = websiteChapterInventory();
  const qualified = loadQualifiedPeopleScope(scopes, {
    skipUnqualified: true, expectedInputs,
  });
  const { catalog, siteIndex, globalCatalog, gateEvidence, holds, inputs, identity } = qualified;
  const complete = globalCatalog.complete && holds.length === 0 && gateEvidence.length === scopes.length;
  catalog.complete = complete;
  siteIndex.complete = complete;
  // Global blocker metrics retain their original meaning. Published counts are separate.
  catalog.stats = { ...globalCatalog.stats, chapters: gateEvidence.length };
  const certificate = { schemaVersion: 1, kind: 'certified-website-people', inputs, identity,
    scope: scopes, gates: gateEvidence, holds, projection: peopleDigest({ catalog, siteIndex }) };
  const active = gateEvidence.length > 0 && catalog.people.length > 0;
  return { active, preview: false, reason: active ? null : 'no-qualified-people-chapters',
    catalog, siteIndex, certificate, globalStats: globalCatalog.stats,
    publication: { mode: 'certified-scope', qualifiedChapters: gateEvidence.length,
      publishedChapters: active ? Object.keys(siteIndex.chapters).length : 0,
      publishedPeople: active ? catalog.people.length : 0, sourceChapters: scopes.length,
      heldChapters: holds.length, holds, qualificationWorkload: qualified.workload },
    peopleById: new Map(catalog.people.map(person => [person.id, person])),
    familyEdgesById: new Map(catalog.familyEdges.map(edge => [edge.id, edge])) };
}

export function assertPeopleSiteCertificate(certificate) {
  const fresh = loadCertifiedPeopleSite({ expectedInputs: certificate?.inputs });
  if (!certificate || stableJson(certificate) !== stableJson(fresh.certificate)) {
    throw new Error('Website people certificate is missing or stale; regenerate the certified publication');
  }
  return fresh;
}
