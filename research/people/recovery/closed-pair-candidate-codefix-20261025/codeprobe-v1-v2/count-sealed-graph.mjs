process.argv.splice(1);
const {sealedMetadata,loadCurrentClosedContext}=await import('/tmp/validate-next-five-current7b6-20261025-whole-decisions-v2.mjs');
const ctx=await loadCurrentClosedContext(sealedMetadata()),key=p=>[...p].sort().join('\0'),sep=new Map();
for(const k of ctx.current.keepSeparate){const ends=k.split('\0'),s=key(ends.map(id=>ctx.byLocal.get(id).canonicalPersonId));if(!sep.has(s))sep.set(s,[]);sep.get(s).push(ends)}
const closed=ctx.meta.selected.remainingDistinctReviewPairs.filter(p=>sep.has(key(p)));
console.log(JSON.stringify({canonicalRevision:ctx.meta.graph.canonicalRevision,selectedPairs:1081,alreadyClosedCount:closed.length,alreadyClosed:closed.map(p=>({pair:p,localConstraints:sep.get(key(p))})),technicalOnly:true,current000d85RemainingCountNotComputed:true},null,2));
