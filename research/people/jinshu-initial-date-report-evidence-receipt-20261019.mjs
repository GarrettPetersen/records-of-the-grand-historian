// Read-only, Git-object-pinned inspection; no queue, checkout, or report writes.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const ref = '9d298a5da59ce222e88d973b9285a62173c5ba97';
const chapters = ['072', '080', '093', '101', '109', '117', '119', '128', '129', '130'];
const sha = (buffer) => `sha256:${createHash('sha256').update(buffer).digest('hex')}`;
const readAtRef = (path) => execFileSync('git', ['show', `${ref}:${path}`], { maxBuffer: 64 * 1024 * 1024 });
const entries = chapters.map((chapter) => {
  const reportPath = `data/people/date-audits/jinshu/${chapter}.json`;
  const extractionPath = `data/people/extractions/jinshu/${chapter}.json`;
  const sourcePath = `data/jinshu/${chapter}.json`;
  const reportBytes = readAtRef(reportPath);
  const extractionBytes = readAtRef(extractionPath);
  const sourceBytes = readAtRef(sourcePath);
  const report = JSON.parse(reportBytes);
  const extraction = JSON.parse(extractionBytes);
  const source = JSON.parse(sourceBytes);
  const sourceUnits = source.content.flatMap((part) => part.sentences || []);
  const unit = (id) => sourceUnits.find((row) => row.id === id)?.zh ?? null;
  const firstPersonCheck = report.personChecks[0];
  const evidenceSignatures = new Set(report.personChecks.map((c) => JSON.stringify(c.evidence)));
  const personReasons = new Set(report.personChecks.map((c) => c.reason));
  const itemReasons = new Set(report.itemChecks.map((c) => c.reason));
  const result = {
    chapter, status: report.status, reportPath, reportByteHash: sha(reportBytes),
    extractionPath, extractionByteHash: sha(extractionBytes), sourcePath, sourceByteHash: sha(sourceBytes),
    declaredSourceHash: report.sourceHash, declaredExtractionHash: report.extractionHash,
    reviewer: report.reviewer, reviewedAt: report.reviewedAt, summary: report.summary,
    personChecks: report.personChecks.length, itemChecks: report.itemChecks.length,
    distinctPersonEvidenceArrays: evidenceSignatures.size,
    distinctPersonReasons: personReasons.size, distinctItemReasons: itemReasons.size,
    firstPersonCheck, firstEvidenceActualUnit: unit(firstPersonCheck?.evidence?.[0]?.unit),
    references: report.references.length, findings: report.findings.length,
  };
  if (chapter === '129') {
    result.examples = ['p002', 'p003'].map((id) => {
      const person = extraction.people.find((row) => row[0] === id);
      const check = report.personChecks.find((row) => row.id === id);
      const relevantClaim = report.itemChecks.find((row) => row.event?.includes(`for ${id}.`));
      return { id, extractionNames: person[1], reportedPersonCheck: check,
        reportedEvidenceActualUnit: unit(check.evidence[0].unit), itemCheck: relevantClaim,
        itemEvidenceActualUnit: unit(relevantClaim.evidence[0].unit) };
    });
  }
  return result;
});
const receipt = {
  ref, generatedAt: new Date().toISOString(), scope: 'Ten Jinshu reports mechanically classified audited at 817645; re-read exact inputs at 9d298a5',
  limitations: 'Mechanical status is not semantic approval. Repeated or mismatched evidence does not itself prove a date wrong, or prove a single technical or human cause. This inspection does not identify every flawed report and does not itself establish complete audits or completion.',
  entries,
};
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
