import fs from 'node:fs';
import { REPO_ROOT, buildInputFingerprint, contentUnits } from './people-content.mjs';
import { peopleDigest, stableJson } from './people-identity-seal.mjs';

export function assertCertifiedEbookRoot(root, label) {
  const actual = fs.realpathSync(root);
  const certified = fs.realpathSync(REPO_ROOT);
  if (actual !== certified) {
    throw new Error(`Required ebook ${label} ${actual} differs from certified people root ${certified}`);
  }
}

export function assertCertifiedEbookChapterSource(context, book, chapter, data) {
  const certificate = context?.certificate;
  if (certificate?.schemaVersion !== 1 || certificate.kind !== 'certified-ebook-people' ||
      certificate.scope?.book !== book || !certificate.scope.chapters?.includes(chapter) ||
      !Array.isArray(certificate.gates)) throw new Error('Missing certified ebook source scope');
  const gates = certificate.gates.filter(gate => gate.chapter === chapter);
  if (gates.length !== 1 || !data) throw new Error(`Missing unique certified source gate for ${book}:${chapter}`);
  const gate = gates[0];
  const input = buildInputFingerprint(contentUnits(data));
  if (gate.source !== peopleDigest(data) || gate.inputFingerprint !== input.chapterFingerprint ||
      gate.inputUnitCount !== input.unitCount) {
    throw new Error(`Actual ebook source differs from certified chapter ${book}:${chapter}`);
  }
}

export function assertCertifiedEbookSources(context, product, chapters) {
  const scope = context?.certificate?.scope;
  if (scope?.slug !== product.slug || scope?.book !== product.book ||
      stableJson(scope?.chapters) !== stableJson(product.chapters) ||
      stableJson(chapters.map(item => item.chapter)) !== stableJson(product.chapters)) {
    throw new Error('Actual ebook chapters differ from certified ordered product scope');
  }
  for (const { chapter, data } of chapters) assertCertifiedEbookChapterSource(context, product.book, chapter, data);
}
