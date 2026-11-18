import test from 'node:test';
import assert from 'node:assert/strict';
import { journalStates, acceptedRepairContracts, assembleOwnerRepairChain, assertAcceptedRepairsPreserved } from './lib/people-owner-repair-chain.mjs';

// EXACT from the 032/087 reproducers: canonical prefix size, the accepted row's
// ID and the later row's ID, both preserved rows, the source journal entries,
// the accepted proposal/decision and the bad compiled row. Other rows are
// labelled FILLER stand-ins for the remaining owner rows.
const SHAPES = {
  '032': {"canonicalPrefix":17,"savedCount":50,"acceptedId":"jinshu:032:r0037","preservedRows":[["s0313","idiomatic","Each escaped the stain that befell Yang Zhi of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","Each escaped the reproach of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","s0313 各免華陽之釁 names only 華陽, and nothing in the chapter equates it with Yang Zhi, so removing that identification is right. Residual, filed separately: the same idiomatic sentence still renders 和熹 as \"Deng Sui\", a personal name absent from the chapter.","high","applied"],["s0313","idiomatic","Each escaped the reproach of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","Each escaped the reproach of Huayang, trod instead in Empress Hexi's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","竟躡和熹之蹤 gives only the posthumous title 和熹; the personal name Deng Sui 鄧綏 is outside knowledge. Matches the literal (Hexi's tracks) and the corrected name claims for p187.","high","applied"]],"badCompiledRow":["s0313","idiomatic","Each escaped the stain that befell Yang Zhi of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","Each escaped the reproach of Huayang, trod instead in Empress Hexi's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","竟躡和熹之蹤 gives only the posthumous title 和熹; the personal name Deng Sui 鄧綏 is outside knowledge. Matches the literal (Hexi's tracks) and the corrected name claims for p187.","high","applied"],"actualSourceJournal":[{"unitId":"s0313","field":"idiomatic","before":"Each escaped the stain that befell Yang Zhi of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","after":"Each escaped the reproach of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","reason":"The source says only 華陽之釁; it does not name Yang Zhi, and Huayang is not a known designation of Empress Yang Zhi. The idiomatic identification is unsupported; keep the source designation Huayang.","confidence":"medium"},{"unitId":"s0313","field":"idiomatic","before":"Each escaped the reproach of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","after":"Each escaped the reproach of Huayang, trod instead in Empress Hexi's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","reason":"竟躡和熹之蹤 gives only the posthumous title 和熹; the personal name Deng Sui 鄧綏 is outside knowledge. Matches the literal (Hexi's tracks) and the corrected name claims for p187.","confidence":"high"}],"acceptedOriginalReview":{"repairId":"jinshu:032:r0037","decision":"accept","after":null,"reason":"s0313 各免華陽之釁 names only 華陽, and nothing in the chapter equates it with Yang Zhi, so removing that identification is right. Residual, filed separately: the same idiomatic sentence still renders 和熹 as \"Deng Sui\", a personal name absent from the chapter.","sourceWitness":{"source":"chapter-text","citation":"s0313","excerpt":"各免華陽之釁，竟躡和熹之蹤，保陵遲以克終，所幸實為多矣。"}},"originalProposal":{"id":"jinshu:032:r0037","unit":{"id":"s0313","kind":"paragraph-sentence","blockIndex":43,"collection":"sentences","itemIndex":18},"field":"idiomatic","before":"Each escaped the stain that befell Yang Zhi of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","after":"Each escaped the reproach of Huayang, trod instead in Deng Sui's footsteps, and steered a fading court to a peaceful close—more good fortune than anyone might expect.","reason":"The source says only 華陽之釁; it does not name Yang Zhi, and Huayang is not a known designation of Empress Yang Zhi. The idiomatic identification is unsupported; keep the source designation Huayang.","confidence":"medium"}},
  '087': {"canonicalPrefix":24,"savedCount":83,"acceptedId":"jinshu:087:r0041","preservedRows":[["s0061","literal","When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Ji'tu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","踐土 is Jiantu. The idiomatic field already has it right.","high","applied"],["s0061","literal","When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","Duke Huan of Qi raised the army at Shaoling; when the lords were disrespectful, Duke Wen of Jin launched the campaign at Chengpu; thereby they were able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on their great plans; the Spring and Autumn Annals forgave their acting on their own authority.","Same misparse as the idiomatic field. (G33 round-1 finding applied as proposed.)","high","applied"]],"badCompiledRow":["s0061","literal","When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Ji'tu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","Duke Huan of Qi raised the army at Shaoling; when the lords were disrespectful, Duke Wen of Jin launched the campaign at Chengpu; thereby they were able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on their great plans; the Spring and Autumn Annals forgave their acting on their own authority.","Same misparse as the idiomatic field. (G33 round-1 finding applied as proposed.)","high","applied"],"actualSourceJournal":[{"unitId":"s0061","field":"literal","before":"When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Ji'tu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","after":"When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","reason":"踐土 is Jiantu. The idiomatic field already has it right.","confidence":"high"},{"unitId":"s0061","field":"literal","before":"When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","after":"Duke Huan of Qi raised the army at Shaoling; when the lords were disrespectful, Duke Wen of Jin launched the campaign at Chengpu; thereby they were able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on their great plans; the Spring and Autumn Annals forgave their acting on their own authority.","reason":"Same misparse as the idiomatic field. (G33 round-1 finding applied as proposed.)","confidence":"high"}],"acceptedOriginalReview":{"repairId":"jinshu:087:r0041","decision":"accept","after":null,"reason":"踐土 is Jiantu. The idiomatic field already has it right.","sourceWitness":{"source":"chapter-text","citation":"s0061","excerpt":"齊桓興召陵之師，諸侯不恭，晉文起城濮之役，用能勳光踐土，業隆一匡，九域賴其弘猷，《春為》恕其專命。"}},"originalProposal":{"id":"jinshu:087:r0041","unit":{"id":"s0061","kind":"paragraph-sentence","blockIndex":8,"collection":"sentences","itemIndex":8},"field":"literal","before":"When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Ji'tu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","after":"When Duke Huan of Qi raised the army at Shaoling, the lords were disrespectful; when Duke Wen of Jin launched the campaign at Chengpu, thereby he was able to make merit shine at Jiantu and enterprise rise in the single rectification; the nine regions relied on his great plan; the Spring and Autumn Annals forgave his acting on his own authority.","reason":"踐土 is Jiantu. The idiomatic field already has it right.","confidence":"high"}},
};
const REVIEWER = 'grokbot:independent-reviewer', AUTHORS = ['codex:owner'];
// Test stand-in for the native validateEditorialDecisionDocument (the compiler passes the real one).
const validateReview = review => { for (const d of review.decisions) if (!review.proposals.some(p => p.id === d.repairId)) throw new Error('decision refers to unknown proposal'); };

function build(chapter, { acceptedReviewer = REVIEWER, decision = 'accept' } = {}) {
  const s = structuredClone(SHAPES[chapter]), accepted = Number(s.acceptedId.slice(-4)) - 1, last = s.savedCount - 1;
  const prefix = Array.from({ length: s.canonicalPrefix }, (_, i) => [`c${i}`, 'literal', `canonical ${i}`, `canonical ${i} fixed`, `FILLER canonical reason ${i}`, 'high', 'applied']);
  const manual = [], journal = [];
  for (let i = s.canonicalPrefix; i < s.savedCount; i++) {
    if (i === accepted) { manual.push(s.preservedRows[0]); journal.push(s.actualSourceJournal[0]); }
    else if (i === last) { manual.push(s.preservedRows[1]); journal.push(s.actualSourceJournal[1]); }
    else {
      const step = { unitId: `f${i}`, field: 'idiomatic', before: `FILLER old ${i}`, after: `FILLER new ${i}`, reason: `FILLER journal reason ${i}`, confidence: 'high' };
      journal.push(step); manual.push([step.unitId, step.field, step.before, step.after, step.reason, 'high', 'applied']);
    }
  }
  const review = { reviewer: { agentId: acceptedReviewer }, proposals: [s.originalProposal], decisions: [{ ...s.acceptedOriginalReview, decision }] };
  const book = 'jinshu', contracts = acceptedRepairContracts([review], { book, chapter, authors: AUTHORS, validateReview });
  return { s, accepted, last, prefix, manual, journal, contracts, review };
}
const compile = (x, manualRows = x.manual, journal = x.journal, contracts = x.contracts, repairConfidence = {}) => {
  const chain = assembleOwnerRepairChain({ journal, manualRows, repairConfidence, contracts });
  const rows = [...x.prefix, ...chain.rows];
  return { ...chain, all: rows, accepted: assertAcceptedRepairsPreserved(rows, contracts) };
};

for (const chapter of ['032', '087']) {
  test(`${chapter}: owner-preserved accepted chain compiles idempotently with stable IDs`, () => {
    const x = build(chapter), first = compile(x);
    assert.equal(first.all.length, x.s.savedCount);
    assert.deepEqual(first.appended, []);
    assert.deepEqual(first.all[x.accepted], x.s.preservedRows[0]);
    assert.deepEqual(first.all[x.last], x.s.preservedRows[1]);
    assert.equal(first.accepted, 1);
    assert.deepEqual(compile(x, first.all.slice(x.prefix.length)).all, first.all, 'second run is a no-op');
  });

  test(`${chapter}: the defective folded output is rejected as a changed accepted row, not adopted`, () => {
    const x = build(chapter), folded = [...x.manual];
    folded[x.accepted - x.prefix.length] = x.s.badCompiledRow; folded.pop();
    assert.throws(() => compile(x, folded), new RegExp(`accepted repair ${x.s.acceptedId} was changed or dropped`));
  });

  test(`${chapter}: a partial chain gets only its missing new row appended`, () => {
    const x = build(chapter), result = compile(x, x.manual.slice(0, -1));
    assert.deepEqual(result.appended, [x.s.preservedRows[1]]);
    assert.deepEqual(result.all.slice(x.prefix.length), x.manual);
  });

  test(`${chapter}: changed or dropped accepted rows fail; only an actual independent acceptance protects`, () => {
    const x = build(chapter), i = x.accepted - x.prefix.length;
    const reworded = structuredClone(x.manual); reworded[i][4] = 'Owner rewrote the independently accepted reasoning.';
    assert.throws(() => compile(x, reworded), /reason is bound to neither/);
    assert.throws(() => compile(x, x.manual.slice(0, i)), new RegExp(`accepted repair ${x.s.acceptedId} was changed or dropped`), 'dropped, then refolded');
    const otherReview = build(chapter).review; otherReview.proposals[0].after += ' (different accepted text)';
    const otherContracts = acceptedRepairContracts([otherReview], { book: 'jinshu', chapter, authors: AUTHORS, validateReview });
    assert.throws(() => compile(x, x.manual, x.journal, otherContracts), /was changed or dropped|reason is bound to neither/, 'acceptance of different text');
    const folded = [...x.manual]; folded[i] = x.s.badCompiledRow; folded.pop();
    for (const notProof of [{ acceptedReviewer: AUTHORS[0] }, { decision: 'reject' }]) {
      const y = build(chapter, notProof);
      assert.deepEqual(y.contracts, [], JSON.stringify(notProof));
      assert.equal(compile(y, folded).accepted, 0, 'an author or rejecting review is not acceptance proof');
    }
    const forged = { reviewer: { agentId: REVIEWER }, proposals: [], decisions: [x.s.acceptedOriginalReview] };
    assert.throws(() => acceptedRepairContracts([forged], { book: 'jinshu', chapter, authors: AUTHORS, validateReview }), /unknown proposal/);
    assert.throws(() => acceptedRepairContracts([forged], { book: 'jinshu', chapter, authors: AUTHORS, validateReview: () => {} }), /no matching reviewed proposal/, 'proof even if a validator were permissive');
    const foreign = build(chapter).review; foreign.decisions[0].repairId = foreign.proposals[0].id = 'jinshu:999:r0037';
    assert.throws(() => acceptedRepairContracts([foreign], { book: 'jinshu', chapter, authors: AUTHORS, validateReview }), /no matching reviewed proposal/, 'other chapter ID');
    const inPrefix = build(chapter).review; inPrefix.decisions[0].repairId = inPrefix.proposals[0].id = `jinshu:${chapter}:r0001`;
    assert.throws(() => compile(x, x.manual, x.journal, [...x.contracts, ...acceptedRepairContracts([inPrefix], { book: 'jinshu', chapter, authors: AUTHORS, validateReview })]), /r0001 was changed or dropped/, 'acceptance inside the canonical prefix must match exactly');
    const twice = { ...otherReview };
    assert.throws(() => assertAcceptedRepairsPreserved([...x.prefix, ...x.manual], [...x.contracts,
      ...acceptedRepairContracts([twice], { book: 'jinshu', chapter, authors: AUTHORS, validateReview })]), /contradictory accepted approvals/);
  });
}

test('untouched single unreviewed consolidation keeps the original one-net-row behavior', () => {
  const [a, b] = SHAPES['032'].actualSourceJournal;
  const noOp = [{ unitId: 's9', field: 'literal', before: 'x', after: 'y', reason: 'r1 reason', confidence: 'low' }, { unitId: 's9', field: 'literal', before: 'y', after: 'x', reason: 'r2 reason', confidence: 'low' }];
  const result = assembleOwnerRepairChain({ journal: [a, ...noOp, b], manualRows: [] });
  assert.deepEqual(result.rows, [[a.unitId, a.field, a.before, b.after, b.reason, 'high', 'applied']]);
});

test('source-before mismatch fails loud in the journal and in owner rows', () => {
  const x = build('032');
  const swapped = [...x.manual], i = x.accepted - x.prefix.length;
  [swapped[i], swapped[swapped.length - 1]] = [swapped[swapped.length - 1], swapped[i]];
  assert.throws(() => compile(x, swapped), /source-before mismatch/);
  const [a, b] = x.s.actualSourceJournal;
  assert.throws(() => journalStates([b, a]), /does not start from the current s0313\/idiomatic text/);
  assert.throws(() => journalStates([a, { ...b, before: a.before }]), /does not start from the current/);
});

test('unrecorded or contradictory manual rows fail loud', () => {
  const x = build('087'), invented = structuredClone(x.manual);
  invented.push(['s0061', 'literal', x.s.preservedRows[1][3], 'An invented later wording.', 'Unrecorded.', 'high', 'applied']);
  assert.throws(() => compile(x, invented), /is not a recorded source journal change/);
  assert.throws(() => compile(x, [...x.manual, ['s9999', 'literal', 'a', 'b', 'Unrecorded.', 'high', 'applied']]), /has no source journal record/);
  assert.throws(() => compile(x, [...x.manual, [...x.manual[0]]]), /source-before mismatch/, 'duplicated row');
  assert.throws(() => compile(x, [...x.manual.slice(0, -1), [...x.manual.at(-1).slice(0, 6), 'proposed']]), /malformed/);
});

test('missing or invalid confidence fails loud; journal-index confidence map still works for appended rows', () => {
  const x = build('087');
  for (const bad of ['certain', '']) {
    const rows = structuredClone(x.manual); rows[0][5] = bad;
    assert.throws(() => compile(x, rows), /missing or invalid confidence/, JSON.stringify(bad));
  }
  const journal = structuredClone(x.journal); delete journal.at(-1).confidence;
  assert.deepEqual(compile(x, x.manual.slice(0, -1), journal).missing, [journal.length - 1]);
  const mapped = compile(x, x.manual.slice(0, -1), journal, x.contracts, { [String(journal.length - 1)]: 'high' });
  assert.deepEqual(mapped.missing, []);
  assert.deepEqual(mapped.appended, [x.s.preservedRows[1]]);
});
