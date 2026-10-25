import fs from 'node:fs';
const R='/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/independent-identity-recovery/jinshu053-source106-identity-reconciliation-20261025';
const ids=[20,21],folder=n=>R+'/renewals-v2/renew-merge-'+String(n).padStart(3,'0')+'/author-current/source-batch-j-20261025';
const read=p=>JSON.parse(fs.readFileSync(p)),write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n',{flag:'wx'});
const {loadCurrentClosedContext}=await import(R+'/host-closure-abe22-20261025/current-closed-context.mjs');
const ctx=await loadCurrentClosedContext();
write(folder(20)+'/batch-closed-context-proof.json',ctx.proof);
const orders=[],proposals=[],scopes=[];
for(const n of ids){
 const order=read(R+'/renewals-v2/renew-merge-'+String(n).padStart(3,'0')+'/work-order.json'),proposal=read(folder(n)+'/resolution.json');
 const scope=ctx.scopeForWorkOrder(order),validation=ctx.validateProposal(proposal,order);
 write(folder(n)+'/actual-current-closed-validation.json',{status:'actual-current-closed-structural-validation-only',contextProofFile:folder(20)+'/batch-closed-context-proof.json',scope:{ids:scope.ids,currentClusters:scope.currentClusters.map(c=>({canonicalPersonId:c.canonicalPersonId,localPeople:c.localPeople})),actualSourceAndExtractionPins:scope.actualSourceAndExtractionPins,explicitConstraints:scope.explicitConstraints,touchingWholePriorDecisions:scope.touchingPriorDecisions},validation,independentSourceApproval:false,fullCI:false});
 console.log(JSON.stringify({renewal:n,validation}));orders.push(order);proposals.push(proposal);scopes.push(scope);
}
const overlappingIds=scopes.flatMap((s,i)=>s.ids.filter(id=>scopes.slice(i+1).some(t=>t.ids.includes(id))));
const unionOrder={scope:{completeEndpointClusters:orders.flatMap(o=>o.scope.completeEndpointClusters),reviewPairs:orders.flatMap(o=>o.scope.reviewPairs)}};
const combined={schemaVersion:1,batch:'jinshu053-source-batch-j-020-021-20261025-validation-only',authority:'model',decisions:proposals.flatMap(p=>p.decisions)};
const validation=ctx.validateProposal(combined,unionOrder);
write(folder(20)+'/combined-batch-validation.json',{status:'strict-combined-validation-only-not-a-canonical-proposal',overlappingIds,validation,inputBatches:proposals.map(p=>p.batch),independentSourceApproval:false,fullCI:false});
console.log(JSON.stringify({combined:validation,overlappingIds}));
