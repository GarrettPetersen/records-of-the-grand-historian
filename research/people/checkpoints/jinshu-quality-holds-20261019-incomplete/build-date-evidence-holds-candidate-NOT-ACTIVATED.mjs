// Research-only manifest proposal. Reads committed objects; never edits Git or reports.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const staging = '0b3364d';
const master = 'e2a3f340d4e53aed243e989e8005007ba42d4f2b';
const group = 'research/people/checkpoints/jinshu-quality-holds-20261019-incomplete/';
const sha = b => 'sha256:' + createHash('sha256').update(b).digest('hex');
const show = (ref, file) => execFileSync('git', ['show', `${ref}:${file}`], { cwd: root, maxBuffer: 200 * 1024 * 1024 });
const seven = ['072','080','093','109','117','119','130'];
const generatedAt = new Date().toISOString();
const rows = [...seven.map(chapter => ({ chapter, base: '6b3fe7a8c4f5072b9fd44e5e74140d8a1fd88b17', docs: ['jinshu-audited-citation-counterexamples-20261020-incomplete.md','jinshu-seven-citation-counterexamples-independent-verification-6b3fe7a.md'], reason: 'An independently checked supported active-date hint cites a unit that does not establish the named person or the asserted dates; unrecorded evidence and the historical date remain unresolved.' })),
  { chapter: '101', base: '1da4e6a2ca9df03d780ab18762e43e5e50b787a2', docs: ['jinshu101-date-audit-evidence-hold-20261020.md','jinshu101-date-audit-evidence-hold-independent-verification-20261020.md'], reason: 'Independent verification found three supported active-date hints cite a unit naming different people and supplying no dates; the historical dates are not asserted false.' },
  { chapter: '128', base: '1da4e6a2ca9df03d780ab18762e43e5e50b787a2', docs: ['jinshu128-identity-date-evidence-hold-20261020.md','jinshu128-identity-date-evidence-independent-review-20261020.md'], reason: 'Independent verification found two supported active-date hints cite a unit naming another person and supplying no dates; the historical dates are not asserted false.' }];
const holds = []; const notes = [];
for (const row of rows) {
  const paths = [`data/jinshu/${row.chapter}.json`, `data/people/extractions/jinshu/${row.chapter}.json`, `data/people/date-audits/jinshu/${row.chapter}.json`];
  const inputs = paths.map(file => show(row.base, file));
  const report = JSON.parse(inputs[2]);
  if (report.status !== 'audited' || report.book !== 'jinshu' || report.chapter !== row.chapter || report.auditVersion !== 1) throw Error(`Unexpected original audit: ${row.chapter}`);
  const currentMaster = paths.map(file => sha(show(master, file)));
  const original = inputs.map(sha);
  if (currentMaster.some((value, i) => value !== original[i])) { notes.push({chapter: row.chapter, excluded: 'master input differs from independently verified snapshot', original, currentMaster}); continue; }
  const evidence = row.docs.map(name => ({ path: group + name, sha256: sha(show(staging, group + name)) }));
  holds.push({ status: 'active', book: 'jinshu', chapter: row.chapter, auditVersion: 1,
    reportFileHash: original[2], sourceHash: report.sourceHash, extractionHash: report.extractionHash,
    reason: row.reason, reportedBy: 'Independent source-verification reports cited below',
    createdAt: generatedAt, evidence });
  notes.push({ chapter: row.chapter, base: row.base, master, originalSourceFileHash: original[0], originalExtractionFileHash: original[1], originalReportFileHash: original[2], sourceHash: report.sourceHash, extractionHash: report.extractionHash, evidence });
}
const output = { schemaVersion: 1, holds };
const dir = path.dirname(new URL(import.meta.url).pathname);
for (const [file, data] of [['candidate-manifest.json',output],['candidate-manifest-notes.json',notes]]) fs.writeFileSync(path.join(dir, file), `${JSON.stringify(data,null,2)}\n`, {flag:'wx'});
console.log(JSON.stringify({ holds: holds.map(h => h.chapter), exclusions: notes.filter(n => n.excluded) }, null, 2));
