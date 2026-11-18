// Jinshu 129 reproducer. EXACT from the packets: the r0022 historical revision,
// current p098 name claims, the three s0180 repair rows, G25 reviewer identity,
// production English repair id r0051. SYNTHETIC (not supplied): the earlier
// reviewer, r0025/c1477 (420 -> bounds 417-420) and r0028/c1502 (dated ->
// undated allusion) values and units, literal repair id r0050, extraction run
// agent and the s0180 unit text beyond the exact excerpt. Fingerprints and
// component hashes use the test stand-ins of the harness.
import { createHash } from 'node:crypto';

export const documentHash = value => 'sha256:' + createHash('sha256').update(JSON.stringify(value)).digest('hex');
export const proposalSetFingerprint = proposals => documentHash(proposals);
export const G25 = 'grokbot:04811f86-4236-4507-a9a1-08340fa2ec8a';
export const AUTHOR = 'codex:synthetic-extraction-author';
const C = id => `jinshu:129:${id}`;

const r0022Revision = {"repairId":"jinshu:129:r0022","before":{"id":"jinshu:129:c0396","subject":"jinshu:129:p098","predicate":"name","value":{"kind":"personal-name","en":"Qifu Kuini Yin","zh":"乞伏魋尼寅"},"certainty":"explicit","evidence":["jinshu:129:s0180"]},"after":{"id":"jinshu:129:c0396","subject":"jinshu:129:p098","predicate":"name","value":{"kind":"personal-name","en":"Qifu Tuiniiyin","zh":"乞伏魋尼寅"},"certainty":"explicit","evidence":["jinshu:129:s0180"]},"reason":"The name claim preserves the invented split Kuini Yin; the source is one personal name 魋尼寅.","sourceWitness":{"source":"chapter-text","citation":"s0180","excerpt":"乞伏魋尼寅"}};
const rows = [["s0180","idiomatic","Chipan sent Qifu Kuini Yin to block him; Mengxun attacked and killed him.","Chipan sent Qifu Tuiniiyin to block him; Mengxun attacked and killed him.","乞伏魋尼寅 is one personal name; splitting it as Kuini Yin invents a word-break the Chinese does not mark.","medium","applied"],["s0180","literal","Chipan sent general Qifu Kuini Yin to oppose Mengxun; Mengxun struck and beheaded him.","Chipan sent general Qifu Tuiniyin to oppose Mengxun; Mengxun struck and beheaded him.","The accepted repair r0022 fixed only the idiomatic field; the literal still has the invented split and misreading 'Kuini Yin'. 魋尼寅 is one personal name, tuí-ní-yín.","high","applied"],["s0180","idiomatic","Chipan sent Qifu Tuiniiyin to block him; Mengxun attacked and killed him.","Chipan sent Qifu Tuiniyin to block him; Mengxun attacked and killed him.","Accepted repair r0022 introduced a doubled 'i': 魋尼寅 is tuí + ní + yín = Tuiniyin, not 'Tuiniiyin'.","high","applied"]];
const dateRows = [['s0201', 'literal', 'SYNTHETIC r0025 before.', 'SYNTHETIC r0025 after.', 'SYNTHETIC independent r0025 English repair reason.', 'high', 'applied'],
  ['s0230', 'literal', 'SYNTHETIC r0028 before.', 'SYNTHETIC r0028 after.', 'SYNTHETIC independent r0028 English repair reason.', 'high', 'applied']];

const proposal = (id, row) => ({ id, unit: { id: row[0] }, field: row[1], before: row[2], after: row[3], reason: row[4], confidence: row[5] });
const repair = (id, row) => ({ ...proposal(id, row), status: row[6] });
const review = (reviewer, chapterFingerprint, proposals, claimRevisions = []) => ({
  input: { chapterFingerprint, proposalsFingerprint: proposalSetFingerprint(proposals) }, reviewer, proposals,
  decisions: proposals.map(p => ({ repairId: p.id, decision: 'accept', reason: p.reason })),
  claimRetractions: [], claimRevisions, claimAdditions: [] });
const claim = (id, predicate, value, unit, certainty = 'explicit') => ({ id: C(id), subject: C('p098'), predicate, value, certainty, evidence: [C(unit)] });
const c1477 = years => claim('c1477', 'attestation', { sourceDate: 'SYNTHETIC', ...years }, 's0201');
const c1502Dated = claim('c1502', 'attestation', { sourceDate: 'SYNTHETIC', westernYear: 230 }, 's0230');
const c1502Undated = claim('c1502', 'attestation', { undatedSourceAttestation: true, event: 'SYNTHETIC allusion to an earlier ruler; the source gives no datable event.' }, 's0230');
const currentName = {"id":"jinshu:129:c0396","subject":"jinshu:129:p098","predicate":"name","value":{"kind":"personal-name","en":"Qifu Tuiniyin","zh":"乞伏魋尼寅"},"certainty":"explicit","evidence":["jinshu:129:s0180"]};
const surname = {"id":"jinshu:129:c0397","subject":"jinshu:129:p098","predicate":"name","value":{"kind":"surname","en":"Qifu","zh":"乞伏"},"certainty":"explicit","evidence":["jinshu:129:s0180"]};
const g25 = completedAt => ({ kind: 'cursor-agent', name: 'Grok Bot independent chapter reviewer (grokbot-25 worker)', model: null, agentId: G25, runId: null, completedAt });

export function makeFixture() {
  const historical = review({ kind: 'cursor-agent', name: 'SYNTHETIC earlier reviewer', model: null, agentId: 'reviewer:synthetic-r0022', runId: null, completedAt: '2026-10-01T00:00:00.000Z' },
    'sha256:synthetic-old', [proposal(C('r0022'), rows[0]), proposal(C('r0025'), dateRows[0]), proposal(C('r0028'), dateRows[1])], [
      structuredClone(r0022Revision),
      { repairId: C('r0025'), before: c1477({ westernYear: 419 }), after: c1477({ westernYear: 420 }), reason: 'SYNTHETIC reviewed chronology revision of c1477.', sourceWitness: { source: 'chapter-text', citation: 's0201', excerpt: '合成' } },
      { repairId: C('r0028'), before: claim('c1502', 'attestation', { sourceDate: 'SYNTHETIC', westernYear: 229 }, 's0230'), after: structuredClone(c1502Dated), reason: 'SYNTHETIC reviewed chronology revision of c1502.', sourceWitness: { source: 'chapter-text', citation: 's0230', excerpt: '合成' } },
    ]);
  const beforeEditorial = { schemaVersion: 4, book: 'jinshu', chapter: '129', reviews: [historical] };
  const literalReview = review(g25('2026-11-17T18:00:00.000Z'), 'sha256:c9016dc1f1fe2fb5a68a8b711e62f90fc17869c19687ac4e60f330d9c535c800', [proposal(C('r0050'), rows[1])]);
  const nameReview = review(g25('2026-11-18T06:30:00.000Z'), 'sha256:3f789270fffd3374c80e7100e06aeadeaaef8675d5db3c2d1a68724123fa66bd', [proposal(C('r0051'), rows[2])]);
  const historicalRepairs = [repair(C('r0022'), rows[0]), repair(C('r0025'), dateRows[0]), repair(C('r0028'), dateRows[1])];
  const accepted = { book: 'jinshu', chapter: '129', run: { agentId: AUTHOR },
    claims: [structuredClone(r0022Revision.after), structuredClone(surname), c1477({ westernYear: 420 }), structuredClone(c1502Dated)], translationRepairs: historicalRepairs };
  const expanded = { book: 'jinshu', chapter: '129', run: { agentId: AUTHOR },
    claims: [structuredClone(currentName), structuredClone(surname), c1477({ westernBounds: { earliest: 417, latest: 420 } }), structuredClone(c1502Undated)],
    translationRepairs: [...structuredClone(historicalRepairs), repair(C('r0050'), rows[1]), repair(C('r0051'), rows[2])] };
  // The ordinary row the SAME G25 adds to its own r0051 review in the continuation.
  const g25NameRevision = { repairId: C('r0051'), before: structuredClone(r0022Revision.after), after: structuredClone(currentName),
    reason: rows[2][4], sourceWitness: structuredClone(r0022Revision.sourceWitness) };
  return { beforeEditorial, literalReview, nameReview, accepted, expanded, g25NameRevision, r0022Revision: structuredClone(r0022Revision), priorRepairCount: 3 };
}
