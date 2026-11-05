import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { extractionAuthorAgentIds } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-extraction-authorship.mjs';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import { propertySpan } from '../../093/bounded-independent-parts-eb9a-20261105/host-part-validation.mjs';

const dir=new URL('.',import.meta.url).pathname,root='/Users/garrettpetersen/records-of-the-grand-historian';
const hash=b=>createHash('sha256').update(b).digest('hex'),read=name=>JSON.parse(fs.readFileSync(dir+name));
assert.equal(inspectLocalDisk(root).errors.length,0);
assert(!fs.existsSync(dir+'derived-part-capture-author-journal.json'),'Preserve the existing derived journal');
const packetBytes=fs.readFileSync(dir+'source-review-packet.json'),packet=JSON.parse(packetBytes),stateBytes=fs.readFileSync(dir+'review-state.json'),state=JSON.parse(stateBytes);
const preparation=read('preparation-receipt.json'),sourceRevision=packet.registryReuse.sourceRevision;
assert.equal(hash(packetBytes),state.sourcePacketSha256);assert.equal(state.sourcePacketSha256,preparation.sourcePacketSha256);
const extractionBytes=execFileSync('git',['-C',root,'show',sourceRevision+':data/people/extractions/jinshu/109.json'],{maxBuffer:4*1024*1024});
assert.equal('sha256:'+hash(extractionBytes),packet.plan.inputs.extraction);
const extractionAuthors=extractionAuthorAgentIds(JSON.parse(extractionBytes));
assert.deepEqual([...packet.authorAgentIds].sort(),[...extractionAuthors].sort());
assert.equal(state.worker,'jinshu-completion-109-identity');assert.equal(state.activeModelJobs,0);
assert.equal(state.parts.length,preparation.reviewParts.length);assert.equal(state.parts.length,11);
const existingParents=[];
for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.json'))){
 const object=read(name);if(object.kind==='captured-independent-identity-review-parts')existingParents.push(name);
}
assert.deepEqual(existingParents,[],'An actual existing parent journal must be recovered rather than replaced');
const allowed=new Set(['schemaVersion','kind','phase','scope','agentId','runId','providerKind','providerConversationId','providerMessageId','providerCompletedAt','providerObservation','capturedAt','sourcePacketSha256','transportFile','transportSha256','reportFile','reportSha256','providerMessageFile','providerMessageSha256','approvedCases','holds','editorialRepairs','chapterApproved','auxiliaryDisplay','editorialContextDerivation','authorAgentIds']);
const parts=[],evidence=[],authors=new Set(packet.authorAgentIds);
for(let i=0;i<state.parts.length;i++){
 const frontier=state.parts[i];
 if(i>=3){assert.equal(frontier.phase,'unstarted');assert(!frontier.agentId);continue;}
 const stem='part-'+String(i+1).padStart(3,'0'),captureBytes=fs.readFileSync(dir+stem+'-capture.json'),capture=JSON.parse(captureBytes);
 assert(Object.keys(capture).every(k=>allowed.has(k)),'Unrecognized capture provenance requires its actual journal');
 assert.equal(capture.kind,'captured-independent-identity-review-part');assert.equal(capture.phase,'report-recorded');assert.equal(frontier.phase,'report-recorded');
 assert.equal(frontier.agentId,capture.agentId);assert.equal(frontier.runId,capture.runId);assert.equal(capture.sourcePacketSha256,hash(packetBytes));
 assert.equal(capture.providerConversationId,capture.agentId);assert.equal(capture.providerMessageId,capture.runId);
 const providerBytes=fs.readFileSync(capture.providerMessageFile),reportBytes=fs.readFileSync(capture.reportFile),transportBytes=fs.readFileSync(capture.transportFile);
 assert.equal(hash(providerBytes),capture.providerMessageSha256);assert.equal(hash(reportBytes),capture.reportSha256);assert.equal(hash(transportBytes),capture.transportSha256);
 assert.equal(capture.transportSha256,preparation.reviewParts[i].sha256);
 // This rules out a host-authored identity-row/witness supplement: the entire
 // report is exactly the provider's original JSON value, not a reconstruction.
 assert(propertySpan(providerBytes.toString('utf8'),'identityReport').bytes.equals(reportBytes),'Identity report was edited after its actual provider response');
 const report=JSON.parse(reportBytes);assert.equal(report.reviewer.agentId,capture.agentId);assert.equal(report.planFingerprint,packet.plan.fingerprint);
 if(capture.authorAgentIds!==undefined){assert(Array.isArray(capture.authorAgentIds));for(const id of capture.authorAgentIds){assert.equal(typeof id,'string');assert(id);authors.add(id);}}
 if(capture.editorialContextDerivation){const d=JSON.parse(fs.readFileSync(capture.editorialContextDerivation.file));assert(d.identityReportBytesUnchanged);assert.equal(d.providerMessageSha256,capture.providerMessageSha256);}
 parts.push(capture);evidence.push({captureFile:dir+stem+'-capture.json',captureSha256:hash(captureBytes),providerFile:capture.providerMessageFile,providerSha256:capture.providerMessageSha256,
   reportFile:capture.reportFile,reportSha256:capture.reportSha256,reportIsVerbatimProviderValue:true,agentId:capture.agentId,runId:capture.runId,
   transportSha256:capture.transportSha256,packetAuthorExclusionPassed:!packet.authorAgentIds.includes(capture.agentId)});
}
for(const part of parts)assert(!authors.has(part.agentId),'An actual input author cannot be an independent reviewer');
const oldAssembler=execFileSync('git',['-C',root,'show','5a79118e3c66f6b01ff39b242091a93ae1fc207c:scripts/lib/people-identity-review-transport.mjs'],{maxBuffer:128*1024}).toString();
assert(oldAssembler.includes("if (seen.size !== plan.cases.length || plan.cases.some(c => !seen.has(c.id)))"),'Original native workflow did not enforce full aggregate coverage');
const derivation={schemaVersion:1,kind:'explicit-derived-partial-capture-author-evidence',at:new Date().toISOString(),sourceRevision,
 sourcePacketSha256:hash(packetBytes),originalExtractionSha256:hash(extractionBytes),actualExtractionAuthors:extractionAuthors,
 retainedOwner:state.worker,retainedStateSha256:hash(stateBytes),originalParts:11,capturedParts:parts.length,neverStartedParts:8,
 noExistingParentInOwnedArtifactDirectory:true,nativeOriginalAggregateRequiresAllCases:true,originalAssemblerSha256:hash(oldAssembler),
 authorContract:'Original native packet extractor authors plus every explicit part-journal author. Identity reports are verbatim original provider values: no host identity-row or primary-witness supplements participated.',
 evidence,derivedNow:true,historicalAggregateClaimed:false,independentProvenanceReviewPending:true,chapterApproved:false,publicationApproval:false};
fs.writeFileSync(dir+'derived-part-author-evidence.json',JSON.stringify(derivation,null,2)+'\n',{flag:'wx'});
const journal={schemaVersion:1,kind:'captured-independent-identity-review-parts',phase:'report-recorded',scope:packet.scope,
 sourcePacketSha256:hash(packetBytes),agentId:parts[0].agentId,runId:parts[0].runId,authorAgentIds:[...authors],parts,
 transportPolicy:preparation.transportPolicy,derivation:{file:dir+'derived-part-author-evidence.json',sha256:hash(fs.readFileSync(dir+'derived-part-author-evidence.json'))},
 derivedNow:true,historicalAggregateClaimed:false,coverageComplete:false,chapterApproved:false,publicationApproval:false};
fs.writeFileSync(dir+'derived-part-capture-author-journal.json',JSON.stringify(journal,null,2)+'\n',{flag:'wx'});
const history=read('native-proof-capture-history.json').map(entry=>({...entry,aggregateJob:dir+'derived-part-capture-author-journal.json'}));
fs.writeFileSync(dir+'native-proof-capture-history-with-author-journal.json',JSON.stringify(history,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({capturedParts:parts.length,sourceAuthors:authors.size,verbatimProviderReports:evidence.length,historicalAggregateClaimed:false,independentReviewPending:true,chapterApproved:false}));
