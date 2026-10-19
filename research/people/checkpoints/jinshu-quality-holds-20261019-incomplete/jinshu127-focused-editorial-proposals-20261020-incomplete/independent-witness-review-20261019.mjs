// Research-only focused review: never writes canonical chapter or extraction files.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from '/tmp/jinshu127-focused-fixture.WGYoeH/scripts/build-people-extraction-packet.mjs';
import { validateCompactPeopleExtraction } from '/tmp/jinshu127-focused-fixture.WGYoeH/scripts/validate-people-extraction.mjs';
import { validateEditorialDecisions } from '/tmp/jinshu127-focused-fixture.WGYoeH/scripts/lib/people-editorial-decisions.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
function pinned(file, expected) {
  const bytes = fs.readFileSync(file);
  if (sha(bytes) !== expected) throw new Error(`Changed input ${file}`);
  return JSON.parse(bytes);
}
const sourceFile = path.resolve(here, '../jinshu127-s0177-two-dates-reconciled-20261020-incomplete/jinshu/127.json');
const source = pinned(sourceFile, 'cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264');
const proposal = pinned(path.join(here, 'proposed-extraction.json'), '72ba1c64e3cdf3acd3a243e463702e0e1131243b84ae2cf3e471ef372488c57d');
const prior = pinned(path.join(here, 'independent-decisions-master-gate.json'), '59c82846b9eb1ac29edcd4c7e1e11cc21ddabcc47fb1bb3484add7bf7cf95ec0');
const dossier = pinned(path.join(here, 'review-dossier.json'), '8a16dd153a06b8d91491217921fdd1efa216a341c47f6db3b285796d19d40f37');
const packet = buildPeopleExtractionPacket('jinshu', '127', { chapterData: source, chapterFile: sourceFile });
const checked = validateCompactPeopleExtraction(proposal, packet, { strictAliasDispositions: true });
const byUnit = new Map(packet.units.map(unit => [unit.id, unit]));
const observations = {
  s0205: ['遂以謨從至漢城陽景王廟，宴庶老于申池，北登社首山，東望鼎足，因目牛山而歎曰：「古無不死！」', '漢 before 城陽景王 identifies the Han prince rather than a place called Hancheng; this is a limited correction, not an endorsement of the rest.'],
  s0210: ['立冶于商山，置鹽官于烏常澤，以廣軍國之用。', '冶 does not specify iron, 鹽官 is a salt office, and 軍國 includes military and state use; the existing idiom adds unsupported details.'],
  s0213: ['中黃門遜進扶德逾城，隱於進舍。', '遜進 is the attendant’s name and 進舍 his residence; the understood subject of hiding is plausibly De, the person rescued.'],
  s0255: ['跨地數千，眾逾十萬，可以西並強秦，北抗大魏。', '西並強秦 describes expansion by absorbing Qin to the west, in contrast with resistance to Wei to the north.'],
  s0267: ['於是講武於城西，步兵三十七萬，車一萬七千乘，鐵騎五萬三千，周亙山澤，旌旗彌漫，鉦鼓之聲，振動天地。', 'The figures and the mountain, banner, gong, and drum imagery are explicitly present; these are reported figures, not verified headcounts.'],
  s0268: ['德登高望之，顧謂劉軌、高雅之曰：「昔郤克仇齊，子胥怨楚，終能暢其剛烈，名流千載。', 'In 仇齊 Qi is the object of Xi Ke’s hostility, as 楚 is the object of Zixu’s resentment, not the party he avenged.'],
  s0272: ['初，德迎其兄子超于長安，及是而至。', '兄子 identifies Chao as De’s elder brother’s son. 迎 does not by itself establish the precise means, so the narrower reviewed wording avoids asserting a summons.'],
  s0275: ['乃下書以超為皇太子，大赦境內，子為父後者人爵二級。', '子為父後者人爵二級 grants two grades to sons succeeding their fathers; an increase would imply an existing rank that the wording does not require.'],
};
if (prior.decisions.length !== 12 || prior.proposals.length !== 12 || dossier.items.length !== 12) throw new Error('Unexpected review scope');
const result = structuredClone(prior);
result.reviewer = { kind: 'codex', name: 'Independent focused source-witness reviewer /root/repair_witness_review_20', model: null, agentId: '/root/repair_witness_review_20', runId: null, completedAt: '2026-10-19T04:52:44Z' };
for (const [i, decision] of result.decisions.entries()) {
  const p = result.proposals[i];
  if (decision.repairId !== p.id || dossier.items[i].proposal.id !== p.id) throw new Error('Mismatched proposal and decision order');
  const [excerpt, reason] = observations[p.unit.id] ?? [];
  if (!excerpt || byUnit.get(p.unit.id)?.zh !== excerpt || dossier.items[i].context.find(x => x.focus)?.zh !== excerpt) throw new Error(`Source mismatch ${p.id}`);
  if ((p.id === 'jinshu:127:r0029' || p.id === 'jinshu:127:r0030') !== (decision.decision === 'revise')) throw new Error(`Unexpected decision ${p.id}`);
  if (decision.decision !== 'revise' && decision.decision !== 'accept') throw new Error(`Unexpected decision ${p.id}`);
  decision.reason = reason;
  decision.sourceWitness = { source: 'chapter-text', citation: `Jinshu 127, ${p.unit.id}; source candidate SHA-256 cf2d789947d99dbd56ed75c96eb7e097d85e2699cf73e96268cf2fd22b90c264`, excerpt };
}
const validation = validateEditorialDecisions(result, checked.normalized, packet);
if (validation.reviewedRepairs.length !== 12) throw new Error('Incomplete reviewed repairs');
const bytes = Buffer.from(`${JSON.stringify(result, null, 2)}\n`);
const target = path.join(here, 'independent-decisions-witness-review-20261019.json');
if (fs.existsSync(target)) {
  if (!fs.readFileSync(target).equals(bytes)) throw new Error('Existing output differs; not overwriting');
} else fs.writeFileSync(target, bytes, { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ target, sha256: sha(bytes), decisions: validation.reviewedRepairs.length, extractionStats: checked.stats, sourceSha256: sha(fs.readFileSync(sourceFile)), priorSha256: '59c82846b9eb1ac29edcd4c7e1e11cc21ddabcc47fb1bb3484add7bf7cf95ec0', limits: 'Focused proposal review only; no chapter-wide, date, identity, publication or claim approval.' }, null, 2));
