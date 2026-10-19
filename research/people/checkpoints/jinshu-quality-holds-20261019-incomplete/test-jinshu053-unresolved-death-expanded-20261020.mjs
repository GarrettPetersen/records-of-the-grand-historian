// Isolated regression research only. Synthetic date reports below are not
// historical audits, endorsements of dates, or production approvals.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
const fixture = process.argv[2];
assert.ok(fixture && path.isAbsolute(fixture));
const base = '/Users/garrettpetersen/records-of-the-grand-historian/data/people/generated/jinshu-identity-ref-64521198-20261018/jinshu053-anonymous-son-proposal-v3-20261019-incomplete';
const pins = {'source.json':'a1fe01f4178470c5328f84ce651327df84042f11165cd45587bd16e5ce700d7d','extraction.json':'9fd9057a444fef6b50119009fe7e113c1956ea0abc8f74217e9998ef052938ec'};
const read = name => {const b=fs.readFileSync(path.join(base,name));assert.equal(createHash('sha256').update(b).digest('hex'),pins[name]);return JSON.parse(b);};
const imp = file => import(pathToFileURL(path.join(fixture,file)).href);
const {buildPeopleExtractionPacket} = await imp('scripts/build-people-extraction-packet.mjs');
const {validatePeopleExtraction,validateCompactPeopleExtraction} = await imp('scripts/validate-people-extraction.mjs');
const {compactPeopleExtraction} = await imp('scripts/lib/people-compact.mjs');
const {buildDateAuditPacket,validateDateAuditReport,dateAuditStatus} = await imp('scripts/lib/people-date-audit.mjs');
const {ebookCurrentDateErrors} = await imp('scripts/lib/ebook-current-date-audits.mjs');
const {assessEbookPeopleReadiness} = await imp('scripts/lib/ebook-people-readiness.mjs');
const source = read('source.json'), extraction = read('extraction.json');
const packet = buildPeopleExtractionPacket('jinshu','053',{chapterData:source});
const get = (x,id) => {const c=x.claims.find(c=>c.id===`jinshu:053:${id}`);assert.ok(c);return c;};
const clone = () => structuredClone(extraction);
const run = x => validatePeopleExtraction(x,packet,{strictAliasDispositions:true});
const year = n => ({era:'AD',year:n,precision:'year'});
const hold = () => ({sourceDate:{text:'十二月'},unresolved:true,unresolvedReason:'A source-based review has not established whether this date applies.'});
const rejects = (name,mutate) => {const x=clone();mutate(x);assert.throws(()=>run(x),/p027 has no (?:active-date hint|evidence-backed attestation) required|unresolved chronology|sourceDate/);console.log(`PASS ${name}`);};

for(const ver of [5,7]) {
  const x=clone();x.run.promptVersion=ver;const n=run(x).normalized;
  const compact=compactPeopleExtraction(n,packet);
  validateCompactPeopleExtraction(compact,packet,{strictAliasDispositions:true});
  const mixed=structuredClone(compact), death=mixed.claims.find(row=>row[0]==='p027'&&row[1]==='death');assert.ok(death);
  death[2].endDate={sourceDate:{text:'十二月'},westernYear:year(299)};
  assert.throws(()=>validateCompactPeopleExtraction(mixed,packet,{strictAliasDispositions:true}),/p027 has no active-date hint required/);
  console.log(`PASS prompt ${ver} in expanded and compact form`);
}
for(const [name,value] of [
  ['nested Western year',{sourceDate:{text:'十二月'},westernYear:year(299)}],
  ['nested Western interval',{sourceDate:{text:'十二月'},westernInterval:{start:year(298),end:year(299)}}],
  ['nested one-sided bounds',{sourceDate:{text:'十二月'},westernBounds:{before:year(300)}}],
  ['nested hold without source date',{unresolved:true,unresolvedReason:'A source-based review has not established this date.'}],
  ['nested hold with short reason',{sourceDate:{text:'十二月'},unresolved:true,unresolvedReason:'unknown'}],
]) rejects(name,x=>{get(x,'c0528').value.endDate=value;});
rejects('unresolved and independently concrete life context mixed',x=>{get(x,'c0528').value.startDate={sourceDate:{text:'十二月'},westernYear:year(299)};});
rejects('death-place association stays excluded',x=>{const c=get(x,'c0528');c.predicate='place-association';c.value={relation:'died-at',place:'Jinyong',dateContext:c.value.dateContext};});
rejects('deceased participation stays excluded',x=>{const c=get(x,'c0528');c.predicate='event-participation';c.value={kind:'death',role:'deceased',event:'death',dateContext:c.value.dateContext};});
rejects('another person cannot supply the held attestation',x=>{get(x,'c0543').subject='jinshu:053:p001';});
const undated = clone();get(undated,'c0543').value={undatedSourceAttestation:true,event:'A person is named without a specified activity date.'};run(undated);
console.log('PASS independent undated attestation plus held death');
const disjoint = clone();get(disjoint,'c0543').evidence=['jinshu:053:s0001'];run(disjoint);
console.log('OBSERVED disjoint but valid evidence is accepted; source-entailment remains independent-review responsibility');

// Real current-source/extraction packet and genuine fingerprint checks. The
// report contents are intentionally fabricated for a negative regression test.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'jinshu053-fingerprint-test-'));
try {
  const dataDir=path.join(temp,'data'), peopleDir=path.join(temp,'people');
  const write=(file,obj)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(obj));};
  write(path.join(dataDir,'jinshu/053.json'),source);write(path.join(peopleDir,'extractions/jinshu/053.json'),extraction);
  const options={dataDir,peopleDir};const datePacket=buildDateAuditPacket('jinshu','053',options);
  const witness=datePacket.units.find(u=>typeof u.zh==='string'&&u.zh.length);
  const check=id=>({id,verdict:'supported',event:'Synthetic testing event only.',reason:'Synthetic testing reason; not a historical source review.',evidence:[{unit:witness.id,quote:witness.zh}]});
  const report={schemaVersion:1,auditVersion:1,book:'jinshu',chapter:'053',sourceHash:datePacket.sourceHash,extractionHash:datePacket.extractionHash,status:'audited',reviewer:{name:'Synthetic test reviewer',independentOfExtractor:true},reviewedAt:'2026-10-20T00:00:00Z',summary:'Synthetic report for negative testing only.',reviewedUnits:datePacket.units.map(u=>u.id),itemChecks:datePacket.items.map(i=>check(i.id)),personChecks:datePacket.people.map(p=>check(p.id)),findings:[],references:[]};
  assert.throws(()=>validateDateAuditReport(report,datePacket),/Unresolved chronology cannot be approved/);
  console.log(`PASS complete forged report rejects unresolved current packet (${datePacket.units.length} units, ${datePacket.items.length} temporal items, ${datePacket.people.length} people)`);
  // Store invalid synthetic metadata solely to exercise fingerprint ordering.
  write(path.join(peopleDir,'date-audits/jinshu/053.json'),report);
  const changed=clone();get(changed,'c0528').value.dateContext.unresolvedReason+=' Additional research is needed.';
  write(path.join(peopleDir,'extractions/jinshu/053.json'),changed);
  assert.equal(dateAuditStatus('jinshu','053',options).status,'stale');
  const product={book:'jinshu',chapters:['053']};
  assert.match(ebookCurrentDateErrors(product,{getStatus:(b,c)=>dateAuditStatus(b,c,options)}).join(' '),/stale/);
  const ctx={active:true,catalog:{people:[{localPeople:['jinshu:053:p027'],curation:{status:'clear'}}]},siteIndex:{currentPromptVersion:7,chapters:{'jinshu:053':{promptVersion:7,dateAudit:dateAuditStatus('jinshu','053',options)}}}};
  assert.equal(assessEbookPeopleReadiness(ctx,product).ready,false);
  console.log('PASS changed extraction marks former report stale and blocks both ebook date checks');
} finally {fs.rmSync(temp,{recursive:true,force:true});}
