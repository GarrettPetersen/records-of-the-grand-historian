import fs from 'node:fs';
import {loadDotenv} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/load-dotenv.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname;
const stateFile=root+'/data/people/generated/completion/jinshu/072/bounded-dossiers-20261103/CURRENT-STATE.json';
const revision='a366058eaf47f2bb88684a9d8acf6432f489fd1a';
if(fs.statSync(root+'/.env').mode&0o077)throw Error('Private credentials required');
loadDotenv(root);
const base=`https://api.cloudflare.com/client/v4/accounts/${process.env.PRODUCTION_CLOUDFLARE_ACCOUNT_ID}/pages/projects/records-of-the-grand-historian`;
async function request(suffix){const r=await fetch(base+suffix,{headers:{Authorization:'Bearer '+process.env.PRODUCTION_CLOUDFLARE_API_TOKEN},signal:AbortSignal.timeout(25000)}),b=await r.json();if(!r.ok||!b.success)throw Error('Production observation failed; preserve current deployment: HTTP'+r.status);return b.result;}
let last=null;
for(let i=0;i<60;i++){
 const guard=inspectLocalDisk(root);if(guard.errors.length)throw Error('Resource guard hold: '+JSON.stringify(guard.errors));
 const rows=await request('/deployments?env=production&per_page=10');
 const matches=rows.filter(d=>d.environment==='production'&&d.deployment_trigger?.metadata?.commit_hash===revision&&!d.is_skipped);
 if(matches.length>1)throw Error('Multiple production deployments for the reviewed merge; inspect before continuing');
 const d=matches[0]??null,project=d?.latest_stage?.name==='deploy'&&d.latest_stage.status==='success'?await request(''):null;
 const canonicalMatches=Boolean(d&&project?.canonical_deployment?.id===d.id);
 const observation={at:new Date().toISOString(),revision,deploymentId:d?.id??null,latestStage:d?.latest_stage??null,stages:d?.stages??null,canonicalMatches,readyForFullLiveVerification:canonicalMatches,publicationVerified:false,guard};
 fs.writeFileSync(dir+'single-pass-production-observation.json',JSON.stringify(observation,null,2)+'\n');
 fs.appendFileSync(dir+'single-pass-production-observations.jsonl',JSON.stringify(observation)+'\n');
 const s=JSON.parse(fs.readFileSync(stateFile));if(s.acceptedMaster!==revision)throw Error('Release owner changed');
 Object.assign(s,{productionDeploymentId:observation.deploymentId,deploymentLatestStage:observation.latestStage,deploymentObservedAt:observation.at,deploymentReadyForLiveVerification:canonicalMatches,productionDeploymentFailed:d?.latest_stage?.status==='failure',publicationVerified:false});
 fs.writeFileSync(stateFile,JSON.stringify(s,null,2)+'\n');
 const key=JSON.stringify([d?.id,d?.latest_stage?.name,d?.latest_stage?.status]);
 if(key!==last){console.log(JSON.stringify({at:observation.at,revision,deploymentId:observation.deploymentId,latestStage:observation.latestStage,canonicalMatches}));last=key;}
 if(d?.latest_stage?.status==='failure'||canonicalMatches||process.argv.includes('--once'))break;
 await new Promise(resolve=>setTimeout(resolve,45000));
}
