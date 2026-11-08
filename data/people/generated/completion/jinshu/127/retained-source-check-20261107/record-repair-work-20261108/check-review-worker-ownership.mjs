export function checkReviewWorkerOwnership(ledger, worker) {
  for (const [chapter, claim] of Object.entries(ledger.claims)) {
    if (claim.worker === worker && claim.lane === 'grokbot' && claim.status === 'claimed') {
      throw new Error('Transport reviewer owns an extraction for ' + chapter);
    }
  }
  for (const [chapter, audit] of Object.entries(ledger.dateAudits ?? {})) {
    if (audit.worker === worker && (audit.status !== 'ready' || audit.executorToken)) {
      throw new Error('Transport reviewer owns date work for ' + chapter);
    }
  }
  for (const [chapter, review] of Object.entries(ledger.identityReviews ?? {})) {
    if (review.worker === worker && review.activeRun) {
      throw new Error('Transport reviewer owns an active identity review for ' + chapter);
    }
  }
}
