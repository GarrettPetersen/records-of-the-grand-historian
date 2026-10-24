import fs from 'node:fs';
import crypto from 'node:crypto';

const dir = new URL('.', import.meta.url);
const read = name => fs.readFileSync(new URL(name, dir));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const dossierBytes = read('review-dossier.json');
const seedBytes = read('blank-decision-seed.json');
const receipt = JSON.parse(read('receipt.json'));
if (sha(dossierBytes) !== receipt.outputSha256['review-dossier.json'] || sha(seedBytes) !== receipt.outputSha256['blank-decision-seed.json']) throw Error('Input hash mismatch');
const dossier = JSON.parse(dossierBytes);
const seed = JSON.parse(seedBytes);
if (seed.decisions.length !== 12 || dossier.items.length !== 12) throw Error('Unexpected proposal count');
const comments = {
  r0019: '漢 modifies 城陽景王 as the Han prince; it is not a place named Hancheng. This accepts only that correction, not the remaining translation.',
  r0020: '漢 modifies 城陽景王 as the Han prince; it is not a place named Hancheng. The rest remains awkward and needs independent editorial work.',
  r0021: '冶 is smelting, not specifically iron; 鹽官 is a salt administration rather than necessarily monopolies; 軍國 includes both military and state.',
  r0022: '遜進 is the attendant’s name and 進舍 his residence. 德 is the plausible implicit subject of 隱, supported by his later return to the palace in s0215.',
  r0023: '遜進 is the attendant’s name and 進舍 his residence. 德 is the plausible implicit subject of 隱, supported by his later return to the palace in s0215.',
  r0024: '西並強秦 makes Qin the object of expansion to the west, not an equal partner in merger. Accept the scoped correction, leaving other style untouched.',
  r0025: '西並強秦 makes Qin the object of expansion to the west, not an equal partner in merger. Accept the scoped correction, leaving other style untouched.',
  r0026: '三十七萬 foot, 一萬七千 vehicles, 五萬三千 armored horse and the visual and sound imagery are all explicitly reported; these are textual figures, not independently verified troop counts.',
  r0027: '仇齊 treats Qi as the object of Xi Ke’s hostility, not the beneficiary of revenge. Acceptance is restricted to that correction.',
  r0028: '仇齊 treats Qi as the object of Xi Ke’s hostility, not the beneficiary of revenge. Acceptance is restricted to that correction.',
  r0029: '兄子 explicitly establishes De’s elder brother’s son. 迎 can mean go to meet or fetch; summoned is too definite, so use sought to bring without deciding who traveled.',
  r0030: '子為父後者 identifies sons succeeding fathers, and 人爵二級 grants each two grades of rank. Increase could suggest everyone already held rank, which the text does not say.'
};
const revisions = {
  r0029: "De's nephew Murong Chao, whom De had earlier sought to bring from Chang'an, now arrived.",
  r0030: 'He issued an edict naming Murong Chao crown prince and granting a general amnesty throughout the realm; sons succeeding their fathers were each granted two grades of rank.'
};
const units = {};
for (const {proposal, context} of dossier.items) {
  const focus = context.filter(c => c.focus);
  if (focus.length !== 1 || focus[0].id !== proposal.unit.id) throw Error(`Bad focus ${proposal.id}`);
  if (focus[0][proposal.field] !== proposal.before) throw Error(`Before mismatch ${proposal.id}`);
  units[proposal.id] = focus[0].zh;
}
seed.reviewer = {kind:'cursor-agent', name:'Codex independent focused editorial reviewer /root/master_gate', model:null, agentId:'/root/master_gate', runId:null, completedAt:new Date().toISOString()};
seed.decisions = seed.decisions.map(d => {
  const id = d.repairId.split(':').at(-1);
  if (!comments[id] || !units[d.repairId]) throw Error(`Missing decision ${id}`);
  return {...d, decision:revisions[id] ? 'revise' : 'accept', after:revisions[id] ?? null, reason:`${comments[id]} Source: ${units[d.repairId]}`, sourceWitness:null};
});
fs.writeFileSync(new URL('independent-decisions-master-gate.json', dir), `${JSON.stringify(seed, null, 2)}\n`, {flag:'wx'});
