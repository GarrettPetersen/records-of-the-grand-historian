const inputKeys = ['source', 'extraction', 'editorial', 'dateAudit'];
const digest = /^sha256:[a-f0-9]{64}$/;

function checkpoint(value) {
  if (!value || typeof value.scope?.book !== 'string' || typeof value.scope?.chapter !== 'string' || !/^[a-z0-9_-]+$/.test(value.scope?.book ?? '') || !/^\d{3}$/.test(value.scope?.chapter ?? '')) {
    throw new Error('Completion checkpoint requires one explicit book/chapter scope');
  }
  if (!Number.isSafeInteger(value.personCount) || value.personCount < 0) throw new Error('Invalid checkpoint personCount');
  for (const key of inputKeys) {
    if (typeof value.inputs?.[key] !== 'string' || !digest.test(value.inputs?.[key] ?? '')) throw new Error(`Missing or invalid pinned ${key} byte digest`);
  }
  if (!Array.isArray(value.unresolvedPairs)) throw new Error('Checkpoint requires exact unresolvedPairs, not a count');
  const pairs = new Map();
  for (const pair of value.unresolvedPairs) {
    if (!Array.isArray(pair) || pair.length !== 2 || pair.some(id => typeof id !== 'string' || !id.trim() || id !== id.trim()) || pair[0] === pair[1]) {
      throw new Error('Invalid canonical identity review pair');
    }
    const normalized = [...pair].sort();
    const key = JSON.stringify(normalized);
    if (pairs.has(key)) throw new Error('Duplicate identity review pair (including reversed pairs)');
    pairs.set(key, normalized);
  }
  return { value, pairs };
}

export function compareCompletionCheckpoints(baseline, current) {
  const a = checkpoint(baseline), b = checkpoint(current);
  if (baseline.scope.book !== current.scope.book || baseline.scope.chapter !== current.scope.chapter) {
    throw new Error('Cannot compare different chapter completion scopes');
  }
  const changedInputs = inputKeys.filter(key => baseline.inputs[key] !== current.inputs[key]);
  const addedPairs = [...b.pairs].filter(([key]) => !a.pairs.has(key)).map(([,pair]) => pair);
  const removedPairs = [...a.pairs].filter(([key]) => !b.pairs.has(key)).map(([,pair]) => pair);
  const changedPeople = baseline.personCount !== current.personCount;
  const empty = baseline.personCount === 0 || current.personCount === 0;
  const state = empty ? 'empty-scope' : changedInputs.length || changedPeople || addedPairs.length
    ? 'replan-required' : b.pairs.size ? 'identity-work' : 'ready-for-release-checks';
  return {
    diagnosticOnly: true, scope: current.scope, state,
    personCount: current.personCount, initialPairs: a.pairs.size, remainingPairs: b.pairs.size,
    removedPairs, addedPairs, changedInputs, changedPeople,
    nextAction: state === 'empty-scope' ? 'Report zero-person review separately; this cannot prove nonempty completion.'
      : state === 'replan-required' ? 'Preserve both checkpoints. Reconcile new evidence or identity-ID changes with the host; do not silently grow scope or reuse stale approvals.'
        : state === 'identity-work' ? 'Continue the remaining source-complete touching pairs, preserving accepted decisions.'
          : 'Run current scoped qualification, production build/verifiers and live deployment checks. This diagnostic is not approval or completion.',
  };
}
