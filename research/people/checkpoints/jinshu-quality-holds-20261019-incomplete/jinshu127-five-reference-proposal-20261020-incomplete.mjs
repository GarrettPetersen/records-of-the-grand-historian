// Reproducible research candidate only. No queue, workflow state, canonical
// data, editorial approval, date approval, or publication is modified.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { buildDateAuditPacket } from '../../scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '../../scripts/lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { loadProperNounMatcher } from '../../scripts/lib/people-candidates.mjs';

const source = 'data/jinshu/127.json';
const extractionFile = 'data/people/extractions/jinshu/127.json';
const expected = {
  [source]: 'ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a',
  [extractionFile]: 'e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6',
};
for (const [file, hash] of Object.entries(expected)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (actual !== hash) throw new Error(`Input drift: ${file}: ${actual}`);
}
const extraction = JSON.parse(fs.readFileSync(extractionFile, 'utf8'));
const packet = buildDateAuditPacket('jinshu', '127');
const entries = [
  {index: 78, person: 'p009', unit: 's0011', role: 'recalled-example', action: 'Chui compares the addressee to the earlier figure known as Wu xia A Meng.', reason: 'The cited comparison does not itself establish Lü Meng’s living activity in AD 200–219.'},
  {index: 81, person: 'p012', unit: 's0016', role: 'recalled-adviser', action: 'De recalls that King Zhuang accepted Wu Chen’s remonstrance.', reason: 'The later example recalls Wu Chen’s advice without giving the stored BC 584 date.'},
  {index: 82, person: 'p013', unit: 's0016', role: 'person-referred-to', action: 'De recalls that King Zhuang set Xia Ji aside after Wu Chen’s advice.', reason: 'The later example refers to Xia Ji without giving the stored BC 584 date.'},
  {index: 384, person: 'p163', unit: 's0272', role: 'person-referred-to', action: 'Chao arrives after De summons him and is described as De’s elder brother’s son.', reason: 'Chao’s arrival does not establish living activity for his father in AD 403–405.'},
  {index: 385, person: 'p164', unit: 's0273', role: 'dream-figure', action: 'De dreams of his father speaking to him.', reason: 'The dream reference does not establish the father’s living activity in AD 337–348.'},
];
const changes = [];
for (const entry of entries) {
  const before = extraction.claims[entry.index - 1];
  if (before[0] !== entry.person || before[1] !== 'attestation' || !before[4].includes(entry.unit)) throw new Error(`Unexpected sealed row claim-${entry.index}`);
  changes.push({kind:'remove', id:`claim-${entry.index}`, before, reason:entry.reason});
  changes.push({kind:'add-reception-event', after:[entry.person,'event-participation',{kind:'retrospective-reference',receptionType:'retrospective',role:entry.role,action:entry.action},'strongly-inferred',[entry.unit]], reason:`Preserve the later reference without presenting it as living activity: ${entry.reason}`});
  const person = extraction.people.find(row => row[0] === entry.person);
  changes.push({kind:'hints', personId:entry.person, before:person[4].a, after:[], reason:`Withdraw unsupported life-activity hints for separate research: ${entry.reason}`});
}
const proposal = {sourceHash:packet.sourceHash, extractionHash:packet.extractionHash, changes};
const candidate = applyDateRepairProposal(extraction, proposal, packet);
const freshExtractionPacket = buildPeopleExtractionPacket('jinshu','127',{properNounMatcher:loadProperNounMatcher()});
let validation;
try {
  validateCompactPeopleExtraction(candidate, freshExtractionPacket, {strictAliasDispositions:true});
  validation = {ok:true, scope:'fresh extraction packet; strict alias dispositions'};
} catch (error) {
  validation = {ok:false, scope:'fresh extraction packet; strict alias dispositions', error:String(error.stack ?? error)};
}
const freshDatePacket = buildDateAuditPacket('jinshu','127',{extraction:candidate});
const dir = 'data/people/generated/date-workflow/jinshu/127';
const out = {
  'five-reference-proposal-20261020-incomplete.json': proposal,
  'five-reference-candidate-20261020-incomplete.json': candidate,
  'five-reference-diagnostics-20261020-incomplete.json': {validation, sourceHash:packet.sourceHash, originalExtractionHash:packet.extractionHash, candidateExtractionHash:freshDatePacket.extractionHash, warning:'Unreviewed partial candidate; not a complete audit or publication approval. Other findings, hint research, editorial and identity remain open.'},
};
for (const name of Object.keys(out)) if (fs.existsSync(`${dir}/${name}`)) throw new Error(`Refusing to replace existing artifact ${dir}/${name}`);
for (const [name, value] of Object.entries(out)) fs.writeFileSync(`${dir}/${name}`, `${JSON.stringify(value,null,2)}\n`, {flag:'wx'});
console.log(JSON.stringify(out['five-reference-diagnostics-20261020-incomplete.json'],null,2));
