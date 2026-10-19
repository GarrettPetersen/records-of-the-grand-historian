// Research-only in-memory experiment: no canonical, queue or artifact writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../../../scripts/validate-people-extraction.mjs';
import { buildDateAuditPacket } from '../../../../scripts/lib/people-date-audit.mjs';

const read = (path, hash) => {
  const bytes = fs.readFileSync(path);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `Unexpected bytes: ${path}`);
  return JSON.parse(bytes);
};
const candidate = read('data/people/generated/date-workflow/jinshu/025/candidate-3.json', '7753af40712ce48b855e7c798f571701716789c02dc0c48ae1d2e83691785981');
read('data/jinshu/025.json', 'e53efc427e7a19c038d54ccf5f3253ce68bb5cb5c121b8bc9ab4e615f673ef60');
read('data/jinshu/047.json', '77557d28b176fcac176822606e68f5fa3c01eeb3fee28fe6a93be927eb97b3ae');
const p = candidate.people.find(row => row[0] === 'p051');
assert.deepEqual(p, ['p051', ['Fu Xuan','傅玄','Fu Xuan'], 'historical', 'Jin scholar; author of Fu Zi', {n:[],r:[],a:[],p:['Jin'],x:null}, [[{kind:'personal',en:'Fu Xuan',zh:'傅玄',pinyin:'Fu Xuan'},'explicit',['s0444']]], [['scholar','explicit',['s0444']],['writer','explicit',['s0444']]]]);
p[3] = 'Attributed author of Fu Zi';
p[4].p = [];
p[5][0][1] = 'strongly-inferred';
p[6] = [['writer','strongly-inferred',['s0444']]];
const matches = candidate.claims.map((row, i) => row[0] === 'p051' ? i : -1).filter(i => i >= 0);
assert.deepEqual(matches, [159, 160, 181]);
assert.deepEqual(candidate.claims[159], ['p051','attestation',{undatedSourceAttestation:true,event:'Fu Zi attributed to Fu Xuan; AD 217-AD 278 (outside-knowledge conversion)'},'explicit',['s0444']]);
assert.deepEqual(candidate.claims[160], ['p051','authorship',{work:{en:'Fu Zi',zh:'傅子'},relation:'author'},'strongly-inferred',['s0444']]);
assert.deepEqual(candidate.claims[181], ['p051','sex',{sex:'male'},'strongly-inferred',['s0444']]);
candidate.claims[159] = ['p051','event-participation',{kind:'retrospective-reference',role:'quoted-author',action:'The Fu Zi is quoted on Emperor Ming of Wei ordering the high-mountain cap made lower.'},'strongly-inferred',['s0444']];
candidate.claims.splice(181, 1);
const result = validateCompactPeopleExtraction(candidate, buildPeopleExtractionPacket('jinshu','025'), {strictAliasDispositions:true});
const datePacket = buildDateAuditPacket('jinshu','025',{extraction:candidate});
assert.equal(datePacket.extractionHash,'sha256:db4d1aad64f55425f97041c59c1cb6c91988f9b3cdb2129159c165f39d866f9e');
console.log(JSON.stringify({status:'incomplete research only',stats:result.stats,extractionHash:datePacket.extractionHash},null,2));
