// Isolated genuine review assembly. Does not apply to canonical files.
import fs from 'node:fs';
import { validateEditorialDecisions } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/lib/people-editorial-decisions.mjs';
import { buildPeopleExtractionPacket } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu053-strict-5ce.NuGR9k1r/scripts/validate-people-extraction.mjs';

const root = new URL('./', import.meta.url);
const input = new URL('jinshu053-letter-reviewed-proposals-v1-incomplete-20261020/', root);
const read = (name) => JSON.parse(fs.readFileSync(new URL(name, input), 'utf8'));
const seed = read('decision-seed.json');
const source = read('source.json');
const proposed = read('proposed-extraction.json');
const dossier = read('dossier.json');
const packet = buildPeopleExtractionPacket('jinshu', '053', { chapterData: source, chapterFile: new URL('source.json', input).pathname });
const expanded = validateCompactPeopleExtraction(proposed, packet).normalized;
const units = new Map(source.content.flatMap((part) => part.sentences ?? []).map((unit) => [unit.id, unit]));
const notes = {
  s0079: 'The speaker says he petitioned for an honorific title and was refused; first-person narration restores the letter voice.',
  s0080: 'He says he sought favor and blessings when the illness was serious, without evil intent; the proposal restores his own voice.',
  s0083: 'He says he immediately made a memorial asking to enter; first-person speech is required by the enclosing letter.',
  s0085: 'Chen Wu is an attendant of the inner palace and says the empress has vomited and been unwell since morning.',
  s0086: 'He was made to sit in an empty room; no named agent or second-person addressee is stated in this sentence.',
  s0089: 'He is given three sheng of wine and a large plate of jujubes and made to drink and eat them all.',
  s0090: 'He says he ordinarily did not drink and sent Wu to explain he could not tolerate three sheng.',
  s0094: 'He says he had not eaten and feared he could not tolerate it; the first-person letter voice is required.',
  s0096: 'Chen Wu transmits an exclamation of unfilial conduct; the source does not make her its author.',
  s0099: 'Pressed with no alternative, he drank another sheng; the enclosing letter is first person.',
  s0100: 'Although the first-person correction is needed, the proposed wording narrows his loss of self-awareness to not knowing what he was doing; retain for fresh review.',
  s0101: 'A young maid brings a sealed case and reports the edict ordering the document copied; the quotation is within the letter.',
  s0102: 'He starts up in alarm, looks, and sees one white and one green sheet; the original idiom omitted the start and counts.',
  s0103: 'He is pressed on the grounds that His Majesty is waiting; the source does not identify the prompter as runners.',
  s0105: 'The haste prevented looking again, and he did not realize the import of the words; the direct letter voice matters.',
  s0106: 'He trusted his parents as closest kin, says he was falsely accused, and hopes others will see the truth; this closes the letter.',
  s0107: 'The crown prince was deposed without fault and people resented it; the source does not restrict them to the capital.',
  s0108: 'The source names Sima Ya, his distant imperial-clan relationship, Xu Chao, their offices, their grief, Sun Xiu and Prince of Zhao Lun, and their direct warning.',
  s0109: 'Their warning is directly addressed to Sun Xiu and concerns his ties to Jia and claims he knew of the deposition; it is not a claim Jia would scapegoat allies.',
  s0110: 'The speakers urge advance planning and close their direct quotation; the proposed diction avoids implying a particular plot.',
  s0111: 'Xiu tells Lun, Prince of Zhao, who readily accepts; the original Prince Zhao of Lun inverts title and name.',
  s0113: 'Xiu directly tells Lun that street talk calls him a Jia partisan because he has long served Empress Jia.',
  s0114: 'Xiu says that even if the prince suppresses resentment, he will not reward Lun and will think he switched sides to escape punishment under popular pressure.',
};
// Do not approve literal nested single quotation marks while the encompassing
// literal letter itself uses single quotes. These rows need coordinated quoting.
const reject = new Set(['jinshu:053:r0021','jinshu:053:r0030','jinshu:053:r0034','jinshu:053:r0035','jinshu:053:r0038']);
seed.reviewer = { kind: 'codex', name: 'Codex independent editorial reviewer /root/editorial_back', model: null, agentId: '/root/editorial_back', runId: null, completedAt: new Date().toISOString() };
seed.decisions = seed.proposals.map((p) => {
  const unit = units.get(p.unit.id);
  if (!unit || !notes[p.unit.id]) throw new Error(`Missing source or assessment for ${p.id}`);
  const isReject = reject.has(p.id);
  const quoteIssue = ['jinshu:053:r0021','jinshu:053:r0030','jinshu:053:r0038'].includes(p.id);
  return {
    repairId: p.id,
    decision: isReject ? 'reject' : 'accept',
    after: null,
    reason: notes[p.unit.id] + (quoteIssue ? ' Reject this exact literal field pending coordination of nested single quotes with the enclosing single-quoted letter.' : ''),
    sourceWitness: { source: 'chapter-text', citation: `jinshu:053:${p.unit.id}`, excerpt: unit.zh },
  };
});
if (dossier.input.chapterFingerprint !== packet.input.chapterFingerprint) throw new Error('Dossier and packet fingerprints differ');
validateEditorialDecisions(seed, expanded, packet);
const out = new URL('jinshu053-letter-editorial-decisions-20261020-incomplete.json', root);
if (fs.existsSync(out)) throw new Error('Refusing to overwrite an existing review artifact');
fs.writeFileSync(out, JSON.stringify(seed, null, 2) + '\n', {flag:'wx'});
console.log(JSON.stringify({validated:true, artifact:out.pathname, accepted:seed.decisions.filter(d=>d.decision==='accept').length, rejected:seed.decisions.filter(d=>d.decision==='reject').length, chapterFingerprint:seed.input.chapterFingerprint, proposalsFingerprint:seed.input.proposalsFingerprint}));
