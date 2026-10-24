// Read-only signals for human review; this is not a date-audit validator.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { contentUnits, validateUnitIds } from '../../scripts/lib/people-content.mjs';

const digest = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
export function triage(report, extraction, source) {
  if (report.book !== extraction.book || report.chapter !== extraction.chapter) throw new Error('Report/extraction scope mismatch');
  if (!Array.isArray(report.personChecks) || !Array.isArray(report.itemChecks) || !Array.isArray(extraction.people)) throw new Error('Missing checks or people');
  if (![1, 2].includes(extraction.schemaVersion)) throw new Error('Unsupported extraction schema version');
  if (extraction.schemaVersion === 2 && !Array.isArray(extraction.surfaces)) throw new Error('Compact extraction requires surfaces array');
  if (extraction.schemaVersion === 1 && !Array.isArray(extraction.mentions)) throw new Error('Extraction requires mentions array');
  const sourceScope = {};
  for (const field of ['book', 'chapter']) {
    const value = source.meta?.[field];
    if (value !== undefined && value !== null && value !== report[field]) throw new Error(`Source ${field} scope mismatch`);
    sourceScope[field] = value === undefined || value === null ? 'unverified-missing' : 'metadata-matches';
  }
  const sourceUnits = contentUnits(source);
  validateUnitIds(sourceUnits, 'triage source');
  const units = new Map(sourceUnits.map(unit => [unit.id, unit.zh]));
  const mentions = new Map();
  const add = (person, unit) => { if (!mentions.has(person)) mentions.set(person, new Set()); mentions.get(person).add(unit); };
  if (extraction.schemaVersion === 2) {
    for (const row of extraction.surfaces) for (const occurrence of row[4]) add(row[0], occurrence[0]);
  } else {
    for (const row of extraction.mentions) add(row.person, row.unit.id.split(':').at(-1));
  }
  const knownPeople = new Set(extraction.people.map(person => extraction.schemaVersion === 2 ? person[0] : person.localId));
  const signals = report.personChecks.map(check => {
    if (!knownPeople.has(check.id) || !Array.isArray(check.evidence)) throw new Error(`Invalid person check ${check.id}`);
    const associations = mentions.get(check.id);
    const citations = check.evidence.map(e => ({ unit: e.unit, quote: e.quote,
      occursInUnit: typeof e.quote === 'string' && !!e.quote && typeof units.get(e.unit) === 'string' && units.get(e.unit).includes(e.quote),
      isKnownMentionUnit: associations ? associations.has(e.unit) : null }));
    return { id: check.id, knownMentionUnits: associations ? [...associations].sort() : [],
      associationStatus: !associations ? 'no-recorded-association' : citations.some(c => c.isKnownMentionUnit) ? 'has-associated-citation' : 'no-associated-citation', citations };
  });
  const frequencies = checks => {
    const groups = new Map();
    for (const check of checks) { const signature = JSON.stringify(check.evidence); const ids = groups.get(signature) ?? []; ids.push(check.id); groups.set(signature, ids); }
    return [...groups.entries()].filter(([, ids]) => ids.length > 1).map(([signature, ids]) => ({ evidence: JSON.parse(signature), count: ids.length, ids })).sort((a, b) => b.count - a.count);
  };
  return { scope: `${report.book}/${report.chapter}`, sourceScope, storedStatus: report.status,
    limitation: 'Triage only: metadata matches do not prove source identity or current fingerprints. No source or extraction fingerprint, factual accuracy, independent review, chronology, item-evidence alignment, or publication approval is verified. A citation without a recorded association can still be valid context; repetition can be legitimate. Repeated evidence groups require exact JSON array and object-key order; lack of grouping does not establish independent evidence. All signals require human review.',
    personChecks: report.personChecks.length, itemChecks: report.itemChecks.length,
    repeatedPersonEvidence: frequencies(report.personChecks), repeatedItemEvidence: frequencies(report.itemChecks), personSignals: signals };
}

function main(argv) {
  if (argv.length !== 6 || argv[0] !== '--report' || argv[2] !== '--extraction' || argv[4] !== '--source') throw new Error('Usage: node research/people/date-evidence-triage.mjs --report FILE --extraction FILE --source FILE');
  const bytes = [argv[1], argv[3], argv[5]].map(file => fs.readFileSync(file));
  const output = triage(...bytes.map(data => JSON.parse(data)));
  output.inputByteHashes = { report: digest(bytes[0]), extraction: digest(bytes[1]), source: digest(bytes[2]) };
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
