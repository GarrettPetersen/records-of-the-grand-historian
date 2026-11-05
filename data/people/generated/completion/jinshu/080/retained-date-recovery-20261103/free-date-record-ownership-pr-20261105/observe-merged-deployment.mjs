import fs from 'node:fs';
import {loadDotenv} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/load-dotenv.mjs';
import {inspectLocalDisk} from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
const root='/Users/garrettpetersen/records-of-the-grand-historian',dir=new URL('.',import.meta.url).pathname,revision='c991cf12d80fda1d1375d729f6f3553cc212bbcb',id='9fe302ed-cb9a-4ca9-8ae5-ee4fe66dac4d';
const guard=inspectLocalDisk(root);if(guard.errors.length)throw Error('Resource hold');
if(fs.statSync(root+'/.env').mode&0o077)throw Error('Private credentials required');loadDotenv(root);
const token=process.env.PRODUCTION_CLOUDFLARE_API_TOKEN,account=process.env.PRODUCTION_CLOUDFLARE_ACCOUNT_ID;
if(!token||!account)throw Error('Production observation credentials missing');
const request=async suffix=>{const r=await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/records-of-the-grand-historian${suffix}`,{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(25000)}),body=await r.json();if(!r.ok||!body.success)throw Error('Production observation failed '+r.status);return body.result;};
const d=await request('/deployments/'+id);
if(d.environment!=='production'||d.deployment_trigger?.metadata?.commit_hash!==revision)throw Error('Deployment provenance mismatch');
const succeeded=d.latest_stage.name==='deploy'&&d.latest_stage.status==='success',project=succeeded?await request(''):null;
const observation={at:new Date().toISOString(),revision,id,url:d.url,environment:d.environment,latestStage:d.latest_stage,stages:d.stages,canonicalDeploymentId:project?.canonical_deployment?.id??null,canonicalMatches:succeeded&&project?.canonical_deployment?.id===id,liveVerified:false,guard};
fs.appendFileSync(dir+'merged-deployment-observations.jsonl',JSON.stringify(observation)+'\n');
if(observation.canonicalMatches){const file=dir+'merged-deployment-ready.json';if(!fs.existsSync(file))fs.writeFileSync(file,JSON.stringify(observation,null,2)+'\n',{flag:'wx'});else{const old=JSON.parse(fs.readFileSync(file));if(old.id!==id||old.revision!==revision)throw Error('Preserve conflicting deployment receipt');}}
console.log(JSON.stringify({at:observation.at,id,latestStage:d.latest_stage,canonicalMatches:observation.canonicalMatches,guardErrors:guard.errors}));
if(d.latest_stage.status==='failure')throw Error('Production deployment failed; preserve handle and inspect logs');
