// Read-only snapshot comparison. No queue, working tree, or recovery writes.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const queueRef = '4aca09929f40d88b55271e75e780d6423d494b2c';
const masterRef = '26ebf8c830a43c3eb0a15e361c72436bd946c83e';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 30_000_000 });
const queue = JSON.parse(git('show', `${queueRef}:people-work-queue.json`));
const state = JSON.parse(readFileSync('data/people/generated/extraction-state.json', 'utf8'));
const masterFiles = new Set(git('ls-tree', '-r', '--name-only', masterRef, 'data/people/extractions').trim().split('\n'));
const closed = Object.entries(queue.claims).filter(([, claim]) => ['ready', 'submitted'].includes(claim.status));
const present = closed.filter(([key]) => masterFiles.has(`data/people/extractions/${key}.json`));
const details = present.map(([key, claim]) => {
  const extractionPath = `data/people/extractions/${key}.json`;
  const master = JSON.parse(git('show', `${masterRef}:${extractionPath}`));
  const local = state.chapters?.[key];
  return {
    key, lane: claim.lane, worker: claim.worker, status: claim.status,
    claimFingerprint: claim.chapterFingerprint, claimedAt: claim.claimedAt,
    master: {
      commit: git('log', '-1', '--format=%H %aI', masterRef, '--', extractionPath).trim(),
      fingerprint: master.input?.chapterFingerprint, promptVersion: master.run?.promptVersion,
      model: master.run?.model, completedAt: master.run?.completedAt,
      agents: master.run?.chunks?.map(chunk => chunk.agentId) ?? [],
    },
    retainedState: local && {
      status: local.status, fingerprint: local.chapterFingerprint, updatedAt: local.updatedAt,
      chunks: Object.entries(local.chunks ?? {}).map(([id, chunk]) => ({
        id, status: chunk.status, agentId: chunk.agentId,
      })),
    },
  };
});
console.log(JSON.stringify({ queueRef, masterRef, readyOrSubmitted: closed.length,
  masterHasExtraction: present.length, details }, null, 2));
