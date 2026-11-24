import assert from 'node:assert/strict';
import { exactSpanAt } from './lib/people-content.mjs';
import { reconcileReviewedNameMentionSpans } from './lib/people-translation-repairs.mjs';

const book = 'fixture', chapter = '001', id = value => `${book}:${chapter}:${value}`;
const unit = (unitId, zh, en) => ({ id: unitId, kind: 'sentence', blockIndex: 0,
  collection: 'sentences', itemIndex: Number(unitId.slice(1)), zh, en, literal: en });
const units = [unit('s0001', '妻率眾。泓將妻子詣壘門而降。', 'Hong led his wife and children to surrender.'),
  unit('s0002', '景茂因仲襄之緒，躡苻亡之會。', 'Jingmao inherited the legacy of Yao Yizhong and Yao Xiang.'),
  unit('s0003', '挫雷惡之鋒。', 'He broke Lei Edi’s advance.')];
const packet = { book, chapter, units, preflight: { candidates: [] }, input: {} };
const claim = (claimId, person, zh, evidence, kind = 'personal') => ({ id: id(claimId),
  subject: id(person), predicate: 'name', value: { kind, zh }, certainty: 'explicit', evidence: [id(evidence)] });
const mention = (person, source, zh, occurrence, en) => ({ id: id('m' + person), person: id(person),
  unit: Object.fromEntries(['id','kind','blockIndex','collection','itemIndex'].map(key => [key, source[key]])),
  kind: 'personal-name', candidateRefs: [], spans: {
    zh: zh ? [exactSpanAt(source.zh, zh, occurrence)] : [],
    en: en ? [exactSpanAt(source.en, en, 0)] : [],
  } });
const wife = claim('c0001','p001','妻子','s0001','descriptive-kinship');
const expanded = claim('c0002','p004','雷惡','s0003');
const retracted = claim('c0003','p002','仲襄','s0002');
const claims = [wife, expanded, retracted,
  { id: id('c0004'), subject: id('p001'), predicate: 'family-relationship',
    value: { relationship: 'spouse', personId: id('p005') }, evidence: [id('s0001')] }];
const reviewed = { retractedClaimIds: new Set([retracted.id]), revisedClaims: new Map([
  [wife.id, { ...wife, value: { ...wife.value, zh: '妻' } }],
  [expanded.id, { ...expanded, value: { ...expanded.value, zh: '雷惡地' } }],
]), addedClaims: [claim('c0005','p002','仲','s0002','alternate'), claim('c0006','p003','襄','s0002','given')] };
const mentions = [mention('p001',units[0],'妻子',0,'wife'),
  mention('p002',units[1],'仲襄',0,'Yao Yizhong'), mention('p003',units[1],null,0,'Yao Xiang'),
  mention('p004',units[2],'雷惡',0,'Lei Edi')];
const people = [{ localId: id('p001'), identityHints: { mother: id('p006') } },
  ...['p002','p003','p004','p005'].map(p => ({ localId: id(p) })),
  ...['p006','p007'].map(p => ({ localId: id(p), mentionException: { reason: 'unnamed-mother' },
    identityHints: { activeDateHints: [] } }))];
const snapshot = structuredClone({ mentions, claims, units, people });
const result = reconcileReviewedNameMentionSpans(mentions, claims, reviewed, packet);
const spans = (person, language) => result.filter(m => m.person === id(person)).flatMap(m => m.spans[language]);
assert.deepEqual(spans('p001','zh'), [exactSpanAt(units[0].zh,'妻',1)], 'narrow within the original span, not the first wife in the unit');
assert.deepEqual(spans('p001','en'), mentions[0].spans.en);
assert.deepEqual(spans('p002','zh'), [exactSpanAt(units[1].zh,'仲',0)]);
assert.deepEqual(spans('p003','zh'), [exactSpanAt(units[1].zh,'襄',0)]);
assert.deepEqual(spans('p002','en'), mentions[1].spans.en);
assert.deepEqual(spans('p003','en'), mentions[2].spans.en);
assert.deepEqual(spans('p004','zh'), mentions[3].spans.zh, 'expanded canonical name preserves the literal source abbreviation');
assert.deepEqual({ mentions, claims, units, people }, snapshot, 'inputs, family claims, unnamed mothers and identity assignments remain unchanged');
assert.equal(new Set(result.map(m => m.id)).size, result.length);
assert.deepEqual(reconcileReviewedNameMentionSpans(result, claims, reviewed, packet), result, 'replay creates no duplicate spans');

const shared = { ...retracted, id: id('c0007') };
const retained = reconcileReviewedNameMentionSpans(mentions,[...claims,shared],{...reviewed,addedClaims:[]},packet);
assert.ok(retained.some(m => m.spans.zh.some(s => s.exact === '仲襄')), 'another accepted same-person claim retains its surface');
const absent = { ...reviewed, addedClaims: [claim('c0008','p002','姚弋仲','s0002')] };
assert.doesNotThrow(() => reconcileReviewedNameMentionSpans(mentions,claims,absent,packet), 'canonical full name need not be literal Chinese');
const repeatedPacket = { ...packet, units: [unit('s0002','仲問仲。','Zhong asked Zhong.')] };
const repeated = { retractedClaimIds: new Set(), revisedClaims: new Map(), addedClaims: [reviewed.addedClaims[0]] };
assert.throws(() => reconcileReviewedNameMentionSpans([],[],repeated,repeatedPacket), /Ambiguous reviewed Chinese name/);
assert.throws(() => reconcileReviewedNameMentionSpans([mention('p009',units[1],'仲',0,null)],[],repeated,packet), /conflicts/);
const stale = structuredClone(mentions); stale[0].spans.zh[0].startCodePoint = 0;
assert.throws(() => reconcileReviewedNameMentionSpans(stale,claims,reviewed,packet), /stale geometry/);
assert.throws(() => reconcileReviewedNameMentionSpans(mentions,claims,reviewed,{...packet,units:[]}), /lost source unit/);
const ambiguousUnit = unit('s0001','妻妻','wife');
const ambiguousBefore = claim('c0009','p001','妻妻','s0001','descriptive-kinship');
assert.throws(() => reconcileReviewedNameMentionSpans([mention('p001',ambiguousUnit,'妻妻',0,'wife')],[ambiguousBefore],
  { retractedClaimIds:new Set(), revisedClaims:new Map([[ambiguousBefore.id,{...ambiguousBefore,value:{...ambiguousBefore.value,zh:'妻'}}]]),addedClaims:[] },
  {...packet,units:[ambiguousUnit]}), /Ambiguous reviewed name narrowing/);
console.log('people reviewed name spans: preservation, narrowing, separate aliases, replay and fail-fast checks passed');
