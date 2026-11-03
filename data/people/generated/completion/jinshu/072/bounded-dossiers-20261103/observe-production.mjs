import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDotenv } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/load-dotenv.mjs';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root = '/Users/garrettpetersen/records-of-the-grand-historian';
const job = path.dirname(fileURLToPath(import.meta.url));
const state = JSON.parse(fs.readFileSync(path.join(job, 'CURRENT-STATE.json')));
if ((fs.statSync(root + '/.env').mode & 0o077) !== 0) throw new Error('Private credentials required');
loadDotenv(root);
const token = process.env.PRODUCTION_CLOUDFLARE_API_TOKEN;
const account = process.env.PRODUCTION_CLOUDFLARE_ACCOUNT_ID;
if (!token || !account) throw new Error('Production observation credentials missing');
const request = async suffix => {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/records-of-the-grand-historian${suffix}`,
    { headers: { Authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(25000) });
  const body = await response.json();
  if (!response.ok || !body.success) throw new Error('Cloudflare observation failed: HTTP ' + response.status + '; preserve existing deployment handle');
  return body.result;
};
const d = await request('/deployments/' + state.productionDeploymentId);
if (d.environment !== 'production' || d.deployment_trigger?.metadata?.commit_hash !== state.acceptedMaster) throw new Error('Deployment provenance mismatch');
const stageSucceeded = d.latest_stage.name === 'deploy' && d.latest_stage.status === 'success';
const project = stageSucceeded ? await request('') : null;
const canonicalMatches = stageSucceeded && project.canonical_deployment?.id === d.id;
const guard = inspectLocalDisk(root);
const observation = { observedAt: new Date().toISOString(), revision: state.acceptedMaster,
  deployment: { id: d.id, url: d.url, environment: d.environment, commit: state.acceptedMaster,
    latestStage: d.latest_stage, stages: d.stages, createdOn: d.created_on },
  canonicalDeploymentId: project?.canonical_deployment?.id ?? null, canonicalMatches,
  deploymentReadyForLiveVerification: canonicalMatches, publicationVerified: false, guard };
fs.writeFileSync(path.join(job, 'deployment-observation.json'), JSON.stringify(observation, null, 2) + '\n');
fs.appendFileSync(path.join(job, 'deployment-observations.jsonl'), JSON.stringify(observation) + '\n');
state.deploymentLatestStage = d.latest_stage; state.deploymentObservedAt = observation.observedAt;
state.deploymentReadyForLiveVerification = canonicalMatches;
fs.writeFileSync(path.join(job, 'CURRENT-STATE.json'), JSON.stringify(state, null, 2) + '\n');
console.log(JSON.stringify({ id: d.id, latestStage: d.latest_stage, canonicalMatches,
  deploymentReadyForLiveVerification: canonicalMatches, guardErrors: guard.errors }));
