import fs from 'node:fs';
import { loadDotenv } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/load-dotenv.mjs';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root = '/Users/garrettpetersen/records-of-the-grand-historian', dir = new URL('.', import.meta.url).pathname;
const revision = process.argv[2], label = process.argv[3];
if (process.argv.length !== 4 || !/^[a-f0-9]{40}$/.test(revision ?? '') || !/^[a-z0-9-]{1,64}$/.test(label ?? '')) throw Error('Exact reviewed revision and safe artifact label required');
const before = inspectLocalDisk(root);
if (before.errors.length) throw Error('Resource guard rejected deployment observation');
if (fs.statSync(root + '/.env').mode & 0o077) throw Error('Private credentials required');
loadDotenv(root);
const base = 'https://api.cloudflare.com/client/v4/accounts/' + process.env.PRODUCTION_CLOUDFLARE_ACCOUNT_ID + '/pages/projects/records-of-the-grand-historian';
async function request(suffix) {
  const response = await fetch(base + suffix, { headers: { Authorization: 'Bearer ' + process.env.PRODUCTION_CLOUDFLARE_API_TOKEN }, signal: AbortSignal.timeout(25_000) });
  const body = await response.json();
  if (!response.ok || !body.success) throw Error('Production observation failed: HTTP ' + response.status);
  return body.result;
}
const rows = await request('/deployments?env=production&per_page=20');
const matches = rows.filter(row => row.environment === 'production' && row.deployment_trigger?.metadata?.commit_hash === revision && !row.is_skipped);
if (matches.length > 1) throw Error('Multiple production deployments for reviewed revision; preserve handles and inspect');
const deployment = matches[0] ?? null, project = await request('');
const observation = { at: new Date().toISOString(), revision, deploymentId: deployment?.id ?? null,
  latestStage: deployment?.latest_stage ?? null, stages: deployment?.stages ?? [],
  canonicalDeploymentId: project.canonical_deployment?.id ?? null,
  readyForFullLiveVerification: Boolean(deployment && project.canonical_deployment?.id === deployment.id &&
    deployment.latest_stage?.name === 'deploy' && deployment.latest_stage?.status === 'success'),
  publicationVerified: false, guard: inspectLocalDisk(root) };
fs.writeFileSync(dir + label + '-production-observation.json', JSON.stringify(observation, null, 2) + '\n');
fs.appendFileSync(dir + label + '-production-observations.jsonl', JSON.stringify(observation) + '\n');
if (observation.guard.errors.length) throw Error('Resource guard failed after deployment observation; preserve receipt');
console.log(JSON.stringify({ at: observation.at, revision, deploymentId: observation.deploymentId,
  latestStage: observation.latestStage, readyForFullLiveVerification: observation.readyForFullLiveVerification }));
