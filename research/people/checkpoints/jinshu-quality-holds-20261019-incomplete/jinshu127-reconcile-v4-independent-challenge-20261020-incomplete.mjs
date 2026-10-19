// Synthetic research-only regression challenge. Run with V4_FIXTURE pointing
// to a script-only fixture containing the reviewed v4 patch; never canonical data.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const fixture = process.env.V4_FIXTURE;
if (!fixture || !path.isAbsolute(fixture)) throw new Error('Set V4_FIXTURE to the absolute patched script fixture');
const load = name => import(pathToFileURL(path.join(fixture, 'scripts', 'lib', name)).href);
const { exactSpanAt } = await load('people-content.mjs');
const { reconcileExtractionAfterRepairs } = await load('people-translation-repairs.mjs');
const unit = { id:'s0001',kind:'paragraph-sentence',blockIndex:0,collection:'sentences',itemIndex:0,zh:'段宏至。',en:'Duan Hong arrived.',literal:'Duan Hong arrived.' };
const cand = { id:'fixture:001:cand_1',unit:unit.id,language:'en',...exactSpanAt(unit.en,'Hong',0),detectors:[] };
const packet={book:'fixture',chapter:'001',input:{chapterFingerprint:'sha256:same'},units:[unit],preflight:{candidates:[cand]}};
const extraction={book:'fixture',chapter:'001',input:{chapterFingerprint:'sha256:same'},people:[{localId:'fixture:001:p001',preferredNameSuggestion:{en:'Duan Hong',zh:'段宏'},identityHints:{polityHints:[],activeDateHints:[],relatedLocalPeople:[]}}],mentions:[],claims:[{id:'fixture:001:c0001',subject:'fixture:001:p001',predicate:'name',value:{kind:'personal-name',en:'Duan Hong',zh:'段宏'},certainty:'explicit',evidence:['fixture:001:s0001']}],translationRepairs:[],candidateDispositions:[{candidate:cand.id,disposition:'not-person',reason:'other',note:'Existing erroneous disposition; requires source review.'}],coverage:{allUnitsVisited:true,preflightCandidatesAccountedFor:true,unresolvedReferences:[]}};
const result=reconcileExtractionAfterRepairs(extraction,packet,{previousPacket:packet,markRepairsApplied:false,unscannedReviewExcludedReviewerIds:['author']});
console.log(JSON.stringify({unresolvedCandidates:result.unresolvedCandidates,unresolvedSpans:result.unresolvedSpans,mentions:result.extraction.mentions,dispositions:result.extraction.candidateDispositions},null,2));
const fresh=structuredClone(extraction);
fresh.candidateDispositions=[];
const unscanned=structuredClone(packet);
unscanned.preflight.candidates=[];
let reviewPacket;
try { reconcileExtractionAfterRepairs(fresh,unscanned,{unscannedReviewExcludedReviewerIds:['author']}); }
catch(e) { if (!e.unscannedReviewPacket) throw e; reviewPacket=e.unscannedReviewPacket; }
const item=reviewPacket.items[0];
const review={reviewerId:'author ',packetFingerprint:reviewPacket.packetFingerprint,decisions:[{id:item.id,kind:'person',person:'fixture:001:p001',mentionKind:'personal-name',note:'段宏 is the named person.',sourceWitness:item.source}]};
const replay=reconcileExtractionAfterRepairs(fresh,unscanned,{unscannedReviewExcludedReviewerIds:['author'],unscannedReview:review});
console.log(JSON.stringify({excluded:reviewPacket.excludedReviewerIds,acceptedReviewer:review.reviewerId,mentions:replay.extraction.mentions.length}));
