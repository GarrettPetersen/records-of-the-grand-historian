import {isDeepStrictEqual} from 'node:util';
import {createHash} from 'node:crypto';
const need=(ok,message)=>{if(!ok)throw Error('Current curation provenance: '+message);};
// Describe the actual CURRENT full-chapter curation, without assigning invented
// UUIDs to old anonymous chunks. The host must archive the old candidate and this
// receipt, preserve all original chunks/reports, and request the normal independent
// review of the new generation. This is not an extraction or approval shortcut.
export function recordCurrentChapterCuration({sourceBytes,extractionBytes,job,operations,validation,model}){
 const hash=bytes=>'sha256:'+createHash('sha256').update(bytes).digest('hex');
 const raw=JSON.parse(extractionBytes),sourceByteHash=hash(sourceBytes),extractionByteHash=hash(extractionBytes);
 need(job.status==='ready-for-review'&&raw.book===job.book&&raw.chapter===job.chapter,'Idle coherent candidate required');
 need(typeof job.ownerAgentId==='string'&&/^(?:grokbot:|bc-)/.test(job.ownerAgentId)&&job.reviewAgentId!==job.ownerAgentId&&job.authors.includes(job.ownerAgentId),'Actual captured current owner required');
 need(new Set(job.unitIds).size===job.unitIds.length&&isDeepStrictEqual([...new Set(job.coveredUnits)].sort(),[...job.unitIds].sort()),'Current owner must have covered every source unit');
 need(validation.passed===true&&validation.sourceSha256===sourceByteHash&&validation.extractionSha256===extractionByteHash,'Exact current passing native validation required');
 const finish=operations.filter(o=>o.role==='owner'&&o.operation==='finish').at(-1);
 need(finish&&Number.isSafeInteger(finish.resultRevision)&&finish.resultRevision<=job.revision&&Number.isFinite(Date.parse(finish.at)),'Actual retained owner finish required');
 need(typeof model==='string'&&model.trim()===model&&model.length>0,'Declare actual exposed model or explicit provider non-disclosure');
 need(raw.run?.agentId===null&&Array.isArray(raw.run.chunks)&&raw.run.chunks.length>0&&raw.run.chunks.every(c=>c.agentId===null),'This narrow reconciliation requires entirely anonymous historical chunks; identified contributors must stay on the native run');
 need(raw.run.model==='Grok Bot-chunked'&&raw.run.chunks.every(c=>c.model==='Grok Bot')&&job.ownerAgentId.startsWith('grokbot:')&&job.reviewAgentId?.startsWith('bc-'),'Current supported reconciliation requires captured Grok owner and independent Cursor reviewer of historical Grok output');
 const known=[raw.run.agentId,...raw.run.chunks.map(c=>c.agentId)].filter(id=>typeof id==='string'&&id.trim());
 need(!known.includes(job.reviewAgentId),'Reviewer contributed to the original extraction');
 const candidate=structuredClone(raw),historicalRun=structuredClone(raw.run);
 candidate.run={model,promptVersion:raw.run.promptVersion,agentId:job.ownerAgentId,runId:job.ownerRunId??null,completedAt:finish.at};
 return{candidate,receipt:{kind:'host-recorded-current-full-chapter-curation',historicalRun,historicalKnownAuthors:[...new Set(known)],historicalUnknownChunkIds:raw.run.chunks.filter(c=>c.agentId===null).map(c=>c.chunkId),currentRun:structuredClone(candidate.run),actualOwner:job.ownerAgentId,actualFinish:structuredClone(finish),sourceByteHash,oldExtractionByteHash:extractionByteHash,fullSourceUnits:job.unitIds.length,oldChunksReattributed:false,newSourceFactsCreated:false,independentReviewOfNewGenerationRequired:true,approvalGranted:false}};
}
