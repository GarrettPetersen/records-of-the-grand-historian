// Read-only independent research check. No report, queue, or canonical writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {buildDateAuditPacket,validateDateAuditReport} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-date-audit.mjs';
import {buildPeopleExtractionPacket} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import {validateCompactPeopleExtraction} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';
import {validateAppliedEditorialDecisions} from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';

const rev='f6e1588ed0a2b426c19e6902a208d59f7f87dce4';
const repo='/Users/garrettpetersen/records-of-the-grand-historian';
const fixture='/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=path=>execFileSync('git',['show',`${rev}:${path}`],{cwd:repo,maxBuffer:64*1024*1024});
const inputPath='data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-claim110-upper-bound-research-proposal-20261020-incomplete.json';
const proposalBytes=fs.readFileSync(inputPath);
assert.equal(sha(proposalBytes),'faabd19a220afd1777f0040da35642ea965701c57ca5cf9135768bf37cb50de1');
const proposal=JSON.parse(proposalBytes);
const sourceBytes=read('data/jinshu/053.json');assert.equal(sha(sourceBytes),'85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407');
assert.equal(sha(fs.readFileSync('data/jinshu/053.json')),sha(sourceBytes),'local source mismatch');
const extractionBytes=read('data/people/extractions/jinshu/053.json');
assert.equal(sha(extractionBytes),'464b3ed3765bb67971793b7fb03fa3aaa50d78c8302d320521e408dba94d1e69');
const extraction=JSON.parse(extractionBytes), source=JSON.parse(sourceBytes);
const history=JSON.parse(read('data/people/editorial-decisions/jinshu/053.json'));
const reportBytes=read('data/people/date-audits/jinshu/053.json');
assert.equal(sha(reportBytes),'d3bb12dbc7db670357affb2e216790baffb359db62ce78478ff3d37c1ba93073');
const report=JSON.parse(reportBytes);
let workflow=read('scripts/lib/people-date-workflow.mjs').toString();
assert.equal(sha(workflow),'42f6c82575432af453a89cd5292867104ef3edace8327e4fbb2f1372ae0c9d9e');
// Every static direct local dependency is verified against the same Git tree.
const dependencies=[...workflow.matchAll(/from\s+['"](\.\/[^'"]+)['"]/g)].map(m=>m[1]);
for(const relative of dependencies){
  const filename=relative.slice(2), bytes=fs.readFileSync(`${fixture}${filename}`);
  assert.equal(sha(bytes),sha(read(`scripts/lib/${filename}`)),`fixture ${filename}`);
  workflow=workflow.replaceAll(`'${relative}'`,`'${pathToFileURL(`${fixture}${filename}`).href}'`);
}
const {applyDateRepairProposal}=await import(`data:text/javascript;base64,${Buffer.from(workflow).toString('base64')}`);
const packet=buildDateAuditPacket('jinshu','053',{dataDir:'data',extraction});
assert.equal(packet.sourceHash,proposal.sourceHash);assert.equal(packet.extractionHash,proposal.extractionHash);
validateDateAuditReport(report,packet);assert.equal(report.status,'research-blocked');
const result=applyDateRepairProposal(extraction,proposal,packet);
assert.equal(result.claims.length,extraction.claims.length);
for(let i=0;i<extraction.claims.length;i++){
  if(i===109)assert.deepEqual(result.claims[i],proposal.changes[0].after);
  else assert.deepEqual(result.claims[i],extraction.claims[i],`claim ${i+1}`);
}
for(const key of Object.keys(extraction).filter(k=>k!=='claims'))assert.deepEqual(result[key],extraction[key],key);
const stale=structuredClone(proposal);stale.changes[0].before[2].age=6;
let staleMessage;assert.throws(()=>applyDateRepairProposal(extraction,stale,packet),e=>{assert.match(e.message,/before|stale|mismatch/i);staleMessage=e.message;return true;});
const validated=validateCompactPeopleExtraction(result,buildPeopleExtractionPacket('jinshu','053',{chapterData:source}),{strictAliasDispositions:true});
validateAppliedEditorialDecisions(history,validated.normalized);
const next=buildDateAuditPacket('jinshu','053',{dataDir:'data',extraction:result});
assert.equal(next.extractionHash,'sha256:d4b810ce58a1e2da9578cc9e87433f1dbde11ac8b5dcf55627885fbd77128e82');
let staleReport;assert.throws(()=>validateDateAuditReport(report,next),e=>{assert.match(e.message,/stale/i);staleReport=e.message;return true;});
// Negative-only simulation: changing status and fingerprint cannot resolve
// existing substantive review holds. This object is never recorded or accepted.
const fake=structuredClone(report);fake.status='audited';fake.extractionHash=next.extractionHash;
let fakeMessage;assert.throws(()=>validateDateAuditReport(fake,next),e=>{assert.match(e.message,/failed check|unresolved|unsupported|incomplete/i);fakeMessage=e.message;return true;});
console.log(JSON.stringify({rev,proposalSha256:sha(proposalBytes),sourceHash:packet.sourceHash,originalExtractionHash:packet.extractionHash,candidateExtractionHash:next.extractionHash,exactChangedClaims:[110],mismatchedBeforeRejected:staleMessage,oldReportRejected:staleReport,artificialAuditedReportRejected:fakeMessage,retainedFailedItems:report.itemChecks.filter(c=>c.verdict!=='supported').map(c=>c.id),retainedFailedPeople:report.personChecks.filter(c=>c.verdict!=='supported').map(c=>c.id),stats:validated.stats,historyValidated:true,fixtureDirectDependencies:dependencies,limitations:'Static direct dependency bytes checked; transitive dependencies and external runtime dependencies not fully verified. No new independent date review or audit approval.'},null,2));
