// Research-only: transform one hash-pinned fixture module in memory.
import { readFile, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const target = await realpath('/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs');
const expectedSha256 = 'ce87a452f7d3640add38cc7d502eabc540e25d44679f8adc86e90d785c28b8e4';
export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && url.endsWith('/scripts/apply-people-translation-repairs.mjs') && process.env.PEOPLE_TRANSFER_TRACE === '1') {
    const driver = await readFile(new URL(url), 'utf8');
    const before = "throw new Error('Fragment reconciliation fixture left unresolved candidates');";
    if (!driver.includes(before)) throw new Error('Missing expected diagnostic anchor');
    const traced = driver.replace(before, "throw new Error('Fragment reconciliation unresolved: ' + JSON.stringify(fragments.unresolvedCandidates));");
    return { format: 'module', shortCircuit: true, source: traced.replace("throw new Error('Fixture left unresolved candidates');", "throw new Error('Fixture unresolved: ' + JSON.stringify(revisedPacket.preflight.candidates.filter(c => reconciled.unresolvedCandidates.includes(c.id))));") };
  }
  if (!url.startsWith('file:') || !url.endsWith('/scripts/lib/people-translation-repairs.mjs') || process.env.PEOPLE_TRANSFER_PROTOTYPE !== '2' || await realpath(new URL(url)) !== target) return nextLoad(url, context);
  let source = await readFile(new URL(url), 'utf8');
  const sha = createHash('sha256').update(source).digest('hex');
  if (sha !== expectedSha256) throw new Error(`Unexpected fixture source SHA ${sha}`);
  const remove = (startText, endText) => {
    const start = source.indexOf(startText), end = source.indexOf(endText, start);
    if (start < 0 || end < 0 || source.indexOf(startText, start + 1) !== -1) throw new Error(`Expected unique transformation: ${startText}`);
    source = source.slice(0, start) + source.slice(end);
  };
  remove('    const priorSurfaceDispositions = previousDispositions.filter((disposition) => {', '    const counterpartDispositions = reconciled.candidateDispositions.filter((disposition) => {');
  remove("    if (\n      aliasMatches.length === 0 &&\n      candidate.language === 'en' &&", '    const matchingPeople = new Set(aliasMatches.map((item) => item.person));');
  remove("    if (candidate.language === 'en') {\n      const unitIndex = revisedPacket.units.findIndex((unit) => unit.id === candidate.unit);", '    const overlapPeople = new Set(partialOverlaps.map(({ mention }) => mention.person));');
  const anchor = '    const matchingPeople = new Set(aliasMatches.map((item) => item.person));';
  if (source.indexOf(anchor) < 0 || source.indexOf(anchor, source.indexOf(anchor) + 1) >= 0) throw new Error('Expected unique alias-match anchor');
  source = source.replace(anchor, `    // Restrict inferred alias restoration to a unique local occurrence with an exact local name claim.\n    const localText = unitById.get(candidate.unit)[candidate.language];\n    if (exactOccurrences(localText, candidate.exact, candidate.language).length !== 1) {\n      aliasMatches = [];\n    } else {\n      aliasMatches = aliasMatches.filter(({ person }) => reconciled.claims.some((claim) =>\n        claim.subject === person && claim.predicate === 'name' &&\n        claim.value?.[candidate.language] === candidate.exact && claimEvidenceUnit(claim, candidate.unit)\n      ));\n    }\n${anchor}`);
  const lateAnchor = "      for (const span of exactOccurrences(unit.en, exact, 'en')) {";
  if (source.indexOf(lateAnchor) < 0 || source.indexOf(lateAnchor, source.indexOf(lateAnchor) + 1) >= 0) throw new Error('Expected unique late restoration anchor');
  source = source.replace(lateAnchor, "      const localOccurrences = exactOccurrences(unit.en, exact, 'en');\n      const locallyNamed = reconciled.claims.some((claim) => claim.subject === person.localId && claim.predicate === 'name' && claim.value?.en === exact && claimEvidenceUnit(claim, unitId));\n      if (localOccurrences.length !== 1 || !locallyNamed) continue;\n      for (const span of localOccurrences) {");
  return { format: 'module', shortCircuit: true, source };
}
