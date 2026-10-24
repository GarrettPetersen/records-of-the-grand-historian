// Research-only loader: apply a single source transformation in memory.
import { readFile, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const target = await realpath('/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-translation-repairs.mjs');
const expectedSha256 = 'ce87a452f7d3640add38cc7d502eabc540e25d44679f8adc86e90d785c28b8e4';
export async function load(url, context, nextLoad) {
  if (!url.startsWith('file:') || !url.endsWith('/scripts/lib/people-translation-repairs.mjs') || process.env.PEOPLE_TRANSFER_PROTOTYPE !== '1' || await realpath(new URL(url)) !== target) return nextLoad(url, context);
  const source = await readFile(new URL(url), 'utf8');
  const sha = createHash('sha256').update(source).digest('hex');
  if (sha !== expectedSha256) throw new Error(`Unexpected fixture source SHA ${sha}`);
  const start = source.indexOf('    const priorSurfaceDispositions = previousDispositions.filter((disposition) => {');
  const end = source.indexOf('    const counterpartDispositions = reconciled.candidateDispositions.filter((disposition) => {', start);
  if (start < 0 || end < 0 || source.indexOf('    const priorSurfaceDispositions =', start + 1) !== -1) throw new Error('Expected exact unique transfer block');
  return { format: 'module', shortCircuit: true, source: source.slice(0, start) + source.slice(end) };
}
