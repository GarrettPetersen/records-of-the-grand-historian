export const SOURCE_EPOCH_CHECKS=['exact-independent-English-proofs','complete-source-and-repeated-use-context','exact-reviewed-field-source-delta','mention-geometry-and-candidate-accounting','editorial-history-and-strict-production-validation','unchanged-603-date-items-and-366-change-replay','source-epoch-history-round-cap-and-positive-report-absence','shared-ownership-and-fail-closed-current-pins','reviewed-code-and-clean-runtime-boundaries','durable-intent-and-post-application-verification'];
export function validateEditorialReview(r,input,{caseId,sha,id,canonicalHash,candidateHash}){
 const need=(v,m)=>{if(!v)throw Error(m)},proposals=[...input.proposals,...input.extractionProposals];
 need(input.canonicalExtractionHash===canonicalHash&&input.stagedExtractionHash===candidateHash,'Sealed editorial extraction pins changed');
 need(r.kind==='independent-supplemental-English-and-record-wording-review'&&r.book==='jinshu'&&r.chapter==='109'&&r.packetSha256===sha&&r.sourceHash===input.sourceHash&&r.canonicalExtractionHash===canonicalHash&&r.stagedExtractionHash===candidateHash&&r.reviewer?.agentId===id&&r.reviewer.independentOfAuthors===true&&!input.excludedReviewerIds.includes(id),'Exact independent editorial report required: '+caseId);
 need(Array.isArray(r.checks)&&r.checks.length===proposals.length&&new Set(r.checks.map(c=>c.id)).size===proposals.length&&proposals.every(p=>r.checks.some(c=>c.id===p.id)),'Complete unique editorial target coverage required');
 for(const c of r.checks){const p=proposals.find(p=>p.id===c.id);need(['approve','amend','reject'].includes(c.verdict)&&c.reason?.trim().length>=20&&typeof c.after==='string'&&c.after.length>0,'Complete substantive editorial decision required');need(c.verdict!=='approve'||c.after===p.after,'Approved editorial replacement differs');need(c.verdict!=='reject'||c.after===p.before,'Rejected editorial replacement must preserve before');}
 need(['approve','needs-revision'].includes(r.verdict)&&Array.isArray(r.additionalCorrections)&&Array.isArray(r.cautions),'Malformed editorial outcome');
 need(r.additionalCorrections.every(c=>c.book==='jinshu'&&c.chapter==='109'&&typeof c.unit==='string'&&['en','literal'].includes(c.field)&&typeof c.before==='string'&&typeof c.after==='string'&&c.before!==c.after&&c.sourceReason?.trim().length>=20),'Additional corrections require complete exact evidence');
 need(r.verdict!=='approve'||r.checks.every(c=>c.verdict==='approve')&&!r.additionalCorrections.length,'Contradictory editorial approval');
}

export function validateSourceCodeReview(r,input,{sha,id}){
 const need=(v,m)=>{if(!v)throw Error(m)};
 need(r.kind==='independent-source-epoch-transition-review'&&r.packetSha256===sha&&r.sourceHash===input.sourceHash&&r.extractionHash===input.extractionHash&&r.manifestSha256===input.manifestSha256&&r.applierSha256===input.applierSha256&&r.reviewer?.agentId===id&&r.reviewer.independentOfAuthor===true&&!input.excludedReviewerIds.includes(id),'Exact independent source-code report required');
 need(Array.isArray(r.checks)&&r.checks.length===input.requiredChecks.length&&new Set(r.checks.map(c=>c.id)).size===r.checks.length&&input.requiredChecks.every(id=>r.checks.some(c=>c.id===id)),'Complete unique source-code checks required');
 need(r.checks.every(c=>['approve','needs-revision'].includes(c.verdict)&&c.reason?.trim().length>=20)&&Array.isArray(r.findings)&&['approve','needs-revision'].includes(r.verdict),'Malformed source-code review');
 need(r.verdict!=='approve'||r.checks.every(c=>c.verdict==='approve')&&!r.findings.length,'Contradictory source-code approval');
 need(r.verdict!=='needs-revision'||r.findings.length>0,'A source-code hold needs actionable findings');
}
