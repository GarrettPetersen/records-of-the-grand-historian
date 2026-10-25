import fs from 'node:fs';
const R='/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025';
const D=R+'/renewals-v2/renew-merge-019/author-current/source-batch-i-v2-jin059-abe22-20261025';
const read=p=>JSON.parse(fs.readFileSync(p));
const {loadCurrentClosedContext}=await import(R+'/host-closure-abe22-20261025/current-closed-context.mjs');
const ctx=await loadCurrentClosedContext();
const order=read(R+'/renewals-v2/renew-merge-019/work-order.json'),proposal=read(D+'/resolution.json'),scope=ctx.scopeForWorkOrder(order),validation=ctx.validateProposal(proposal,order);
fs.writeFileSync(D+'/actual-current-closed-validation.json',JSON.stringify({status:'exact-revised-proposal-structural-validation-only',contextProof:ctx.proof,scope:{ids:scope.ids,currentClusters:scope.currentClusters.map(c=>({canonicalPersonId:c.canonicalPersonId,localPeople:c.localPeople})),actualSourceAndExtractionPins:scope.actualSourceAndExtractionPins,explicitConstraints:scope.explicitConstraints,touchingWholePriorDecisions:scope.touchingPriorDecisions},validation,independentSourceApproval:false,fullCI:false},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(validation));
