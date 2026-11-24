// Aggregate extractions have actual chunk authors, not an invented aggregate
// agent. All contributing agents must be excluded from independent review.
export function extractionAuthorAgentIds(extraction) {
  const run = extraction?.run, ids = [];
  if (typeof run?.agentId === 'string' && run.agentId.trim()) ids.push(run.agentId);
  if (run?.chunks !== undefined) {
    if (!Array.isArray(run.chunks) || !run.chunks.length) throw new Error('Current extractor chunk provenance required');
    for (const chunk of run.chunks) {
      if (typeof chunk?.agentId !== 'string' || !chunk.agentId.trim()) throw new Error('Actual extractor identity required for every chunk');
      ids.push(chunk.agentId);
    }
  }
  if (!ids.length) throw new Error('Current extractor provenance required');
  return [...new Set(ids)];
}
