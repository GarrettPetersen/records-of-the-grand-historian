// Revised partial candidate: retain p163 and p164 untouched after independent
// review; preserve the earlier five-reference proposal and candidate unchanged.
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildDateAuditPacket } from '../../scripts/lib/people-date-audit.mjs';
import { applyDateRepairProposal } from '../../scripts/lib/people-date-workflow.mjs';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '../../scripts/validate-people-extraction.mjs';
import { loadProperNounMatcher } from '../../scripts/lib/people-candidates.mjs';
import { validateAppliedEditorialDecisions } from '../../scripts/lib/people-editorial-decisions.mjs';

function pinned(file, expected) {
  const bytes = fs.readFileSync(file);
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== expected) throw new Error(`Input drift in ${file}: ${actual}`);
  return JSON.parse(bytes);
}
const dir = 'data/people/generated/date-workflow/jinshu/127';
const extraction = pinned('data/people/extractions/jinshu/127.json','e55bb752bbe33b0fb5492616933c6c32645d47cdc296673f43e55ea9bc54caf6');
pinned('data/jinshu/127.json','ae7e45ebf47268878ac456cacf2cca892b2abd080129f921015f13cdc9b1732a');
const prior = pinned(`${dir}/five-reference-proposal-20261020-incomplete.json`,'2cf1449ddf2361e44b5f774dc8e3d053ae8ddcd4e267541c852ae9eced0033ba');
const proposals = prior.changes.filter(change => change.id ? ['claim-78','claim-81','claim-82'].includes(change.id) : change.personId ? ['p009','p012','p013'].includes(change.personId) : ['p009','p012','p013'].includes(change.after?.[0]));
if (proposals.length !== 9) throw new Error('Unexpected retained three-person repair inventory');
const proposal = {...prior,changes:proposals};
const packet = buildDateAuditPacket('jinshu','127');
const candidate = applyDateRepairProposal(extraction,proposal,packet);
const xp = buildPeopleExtractionPacket('jinshu','127',{properNounMatcher:loadProperNounMatcher()});
const normalized = validateCompactPeopleExtraction(candidate,xp,{strictAliasDispositions:true}).normalized;
const editorial = pinned('data/people/editorial-decisions/jinshu/127.json','5d707ac70687ae595bec5106e95ffcfca0bc20ecf14d051fc92779598022542e');
validateAppliedEditorialDecisions(editorial,normalized);
const revisedPacket = buildDateAuditPacket('jinshu','127',{extraction:candidate});
const output = {
  'three-allusion-proposal-20261020-incomplete.json':proposal,
  'three-allusion-candidate-20261020-incomplete.json':candidate,
  'three-allusion-diagnostics-20261020-incomplete.json':{strictExtractionValidation:true,appliedEditorialCompatibility:true,sourceHash:packet.sourceHash,originalExtractionHash:packet.extractionHash,candidateExtractionHash:revisedPacket.extractionHash,warning:'Partial unapproved candidate: p163 and p164, other date findings, hint research and all chapter gates remain open.'},
};
for (const name of Object.keys(output)) if (fs.existsSync(`${dir}/${name}`)) throw new Error(`Refusing to overwrite ${dir}/${name}`);
for (const [name,value] of Object.entries(output)) fs.writeFileSync(`${dir}/${name}`,`${JSON.stringify(value,null,2)}\n`,{flag:'wx'});
console.log(JSON.stringify(output['three-allusion-diagnostics-20261020-incomplete.json'],null,2));
