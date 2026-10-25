// One pool per host invocation, shared by every chapter and workflow phase.
export function createDateWorkerPool(limit, { shouldStop = () => false } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 8) throw new Error('Date worker concurrency must be an integer from 1 to 8');
  let active = 0, peak = 0, completed = 0;
  const queue = [];
  const pump = () => {
    while (active < limit && queue.length) {
      const { run, resolve, reject } = queue.shift();
      if (shouldStop()) { reject(new Error('Date worker launch stopped; saved work is resumable')); continue; }
      active += 1; peak = Math.max(peak, active);
      const finish = () => { active -= 1; completed += 1; pump(); };
      Promise.resolve().then(run).then(value => { finish(); resolve(value); }, error => { finish(); reject(error); });
    }
  };
  return {
    run: run => new Promise((resolve, reject) => { queue.push({ run, resolve, reject }); pump(); }),
    summary: () => ({ limit, peak, completed, active, queued: queue.length }),
  };
}

// Do not reject early: successful siblings must finish and checkpoint before a
// phase can return, release its lease, or move on to repair/publication.
export async function mapDateReviewJobs(jobs, concurrency, run) {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 8) throw new Error('Date review concurrency must be an integer from 1 to 8');
  let next = 0;
  const results = new Array(jobs.length), errors = [];
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (next < jobs.length) {
      const index = next++;
      try { results[index] = await run(jobs[index], index); }
      catch (error) { errors.push(error); }
    }
  }));
  if (errors.length) throw new AggregateError(errors, errors.map(error => error.message).join('\n'));
  return results;
}
