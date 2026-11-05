import fs from 'node:fs';
import {mutateRemotePeopleWorkLedger} from '/Users/garrettpetersen/records-of-the-grand-historian/scripts/lib/people-work-queue.mjs';
const dir=new URL('.',import.meta.url).pathname,state=JSON.parse(fs.readFileSync(dir+'review-state.json'));
const activeAgents=[...state.parts.filter(p=>p.phase==='running').map(p=>p.agentId),...(state.repairReview?.phase==='running'?[state.repairReview.agentId]:[])];
const result=mutateRemotePeopleWorkLedger(ledger=>{
 const claim=ledger.identityReviews['jinshu/093'];
 if(!claim||claim.worker!==state.worker||claim.sourcePacketSha256!==state.sourcePacketSha256||claim.planFingerprint!==state.planFingerprint)throw Error('Source ownership changed');
 Object.assign(claim,state,{sticky:true,activeRun:activeAgents.length>0,updatedAt:new Date().toISOString()});
 return {approvedCases:state.approvedCases,activeAgents};
},{message:'Checkpoint actual093 source reports and independent review handles'});
const latest=JSON.parse(fs.readFileSync(dir+'review-state.json'));latest.queueCommit=result.commit;
fs.writeFileSync(dir+'review-state.tmp',JSON.stringify(latest,null,2)+'\n');fs.renameSync(dir+'review-state.tmp',dir+'review-state.json');
console.log(JSON.stringify({commit:result.commit,...result.result}));
