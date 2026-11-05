import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { inspectLocalDisk } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/check-local-disk.mjs';
import { buildPeopleExtractionPacket } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-candidates.mjs';
import { expandPeopleExtraction, compactPeopleExtraction, serializeCompactPeopleExtraction } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-compact.mjs';
import { applyTranslationRepairs, reconcileExtractionAfterRepairs, assignExplicitCandidatePeople } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-translation-repairs.mjs';
import { exactSpanAt } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-content.mjs';
import { editorialDecisionSeed, mergeEditorialDecisionReview, validateEditorialDecisions, validateAppliedEditorialDecisions } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/lib/people-editorial-decisions.mjs';
import { validatePeopleExtraction, validateCompactPeopleExtraction } from '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime/scripts/validate-people-extraction.mjs';
const root = '/Users/garrettpetersen/records-of-the-grand-historian', runtime = '/Users/garrettpetersen/.codex/worktrees/people-canonical-runtime';
const dir = new URL('.', import.meta.url).pathname, hash = bytes => createHash('sha256').update(bytes).digest('hex');
const need = (ok, message) => { if (!ok) throw Error(message); }, read = file => JSON.parse(fs.readFileSync(dir + file));
const sealed = (file, bytes) => { const value = Buffer.from(bytes); if (fs.existsSync(file)) need(fs.readFileSync(file).equals(value), 'Retained prepared artifact changed: ' + file); else fs.writeFileSync(file, value, { flag: 'wx' }); };
need(!inspectLocalDisk(root).errors.length, 'Resource guard rejected amendment preparation');
const accepted = read('focused-english-accepted-review.json'), state = read('review-state.json');
need(accepted.sourceApproved && !accepted.sourceApplied && state.repairReview.phase === 'report-recorded' &&
  accepted.reportSha256 === hash(fs.readFileSync(dir + 'focused-english-review.raw.json')) &&
  accepted.amendmentSha256 === hash(fs.readFileSync(dir + 'focused-return-clause-amendment.raw.json')), 'Independent source approval changed');
need(!fs.existsSync(dir + 'reviewed-amendments-manifest.json'), 'Retained preparation exists; preserve it');
const matcher = loadProperNounMatcher(), chapters = [...new Set(accepted.repairs.map(r => r.chapter))].sort();
const result = { schemaVersion: 1, kind: 'prepared-reviewed-chapter-amendments', at: new Date().toISOString(),
  sourceRevision: accepted.sourceRevision, acceptedReviewSha256: hash(fs.readFileSync(dir + 'focused-english-accepted-review.json')),
  sourceApproved: true, canonicalWrites: 0, dateApproval: false, identityApproval: false, chapterApproved: false, chapters: [] };

for (const chapter of chapters) {
  const files = { source: 'data/jinshu/' + chapter + '.json', extraction: 'data/people/extractions/jinshu/' + chapter + '.json',
    editorial: 'data/people/editorial-decisions/jinshu/' + chapter + '.json' };
  const inputs = {};
  for (const [kind, file] of Object.entries(files)) {
    const bytes = execFileSync('git', ['-C', root, 'show', accepted.sourceRevision + ':' + file], { maxBuffer: 4 * 1024 * 1024 });
    need(hash(fs.readFileSync(root + '/' + file)) === hash(bytes), 'Current canonical input changed: ' + file);
    inputs[kind] = { path: file, sha256: hash(bytes), bytes };
  }
  const source = JSON.parse(inputs.source.bytes), packet = buildPeopleExtractionPacket('jinshu', chapter,
    { chapterData: source, chapterFile: runtime + '/' + files.source, properNounMatcher: matcher });
  const extraction = expandPeopleExtraction(JSON.parse(inputs.extraction.bytes), packet);
  need(!extraction.translationRepairs.some(r => r.status === 'proposed'), 'Existing pending English repairs require ownership reconciliation');
  let editorial = JSON.parse(inputs.editorial.bytes);
  const repairs = accepted.repairs.filter(r => r.chapter === chapter), added = [], nameAmendments = [], reasonRenderings = [], derivedClaimAmendments = [];
  for (const row of repairs) {
    const unit = packet.units.find(u => u.id === row.unitId);
    need(unit && row.before === (row.field === 'literal' ? unit.literal : unit.en) &&
      row.pairedFieldChecked === (row.field === 'literal' ? unit.en : unit.literal) && unit.zh.includes(row.sourceQuote), 'Exact reviewed repair source changed');
    const id = 'jinshu:' + chapter + ':r' + String(extraction.translationRepairs.length + 1).padStart(4, '0');
    let reason = row.reason;
    if (reason.length < 10) {
      need(row.verdict === 'approve' && row.originalProposalReason?.length >= 10 && row.originalProposalReason.length <= 500,
        'Short review rationale lacks the independently accepted original rationale');
      reason = row.originalProposalReason;
    }
    if (reason.length > 500) {
      need(chapter === '109' && row.unitId === 's0096' && row.field === 'idiomatic' && row.sourceApproval.amendmentReportSha256,
        'A concise source rationale must be prepared explicitly');
      reason = 'The Chinese explicitly records Huang returning (而歸). Retain the independently accepted Zhao spelling and restore the return event in the idiomatic field, matching the literal field and primary text.';
    }
    if (reason !== row.reason) reasonRenderings.push({ proposalId: row.proposalId, fullIndependentRationale: row.reason,
      nativeRationale: reason, fullEvidencePreserved: true });
    const repair = { id, unit: Object.fromEntries(['id', 'kind', 'blockIndex', 'collection', 'itemIndex'].map(k => [k, unit[k]])),
      field: row.field, before: row.before, after: row.after, reason, confidence: 'high', status: 'proposed' };
    extraction.translationRepairs.push(repair); added.push(repair);
    const reviewed = structuredClone(extraction); reviewed.translationRepairs = reviewed.translationRepairs.filter(r => r.status !== 'proposed' || r.id === id);
    const incoming = editorialDecisionSeed(reviewed); need(incoming.decisions.length === 1, 'One reviewed proposal expected');
    incoming.reviewer = { kind: 'cursor-agent', name: 'Grok Bot independent English source reviewer', model: 'Grok Bot (provider model not exposed)',
      agentId: accepted.agentId, runId: row.sourceApproval?.amendmentReportSha256 ? accepted.finalAmendmentRunId : null,
      completedAt: accepted.at };
    incoming.decisions[0] = { repairId: id, decision: 'accept', after: null, reason,
      sourceWitness: { source: 'chapter-text', citation: 'Jinshu' + chapter + ' ' + row.unitId, excerpt: row.sourceQuote } };
    validateEditorialDecisions(incoming, reviewed, packet); editorial = mergeEditorialDecisionReview(editorial, incoming);
  }
  for (const correction of accepted.nameCorrections.filter(row => row.localId.startsWith('jinshu:' + chapter + ':'))) {
    const person = extraction.people.find(p => p.localId === correction.localId);
    need(person?.preferredNameSuggestion.en === correction.before, 'Reviewed preferred name changed');
    const before = structuredClone(person); person.preferredNameSuggestion.en = correction.after;
    const claims = [];
    for (const [id, en] of Object.entries(correction.nameClaimCorrections)) {
      const claim = extraction.claims.find(c => c.id === id);
      need(claim?.subject === person.localId && claim.predicate === 'name' && en === claim.value.en.replaceAll('Zhen', 'Zhao'), 'Reviewed personal-name claim changed');
      const prior = structuredClone(claim); claim.value.en = en; claims.push({ before: prior, after: structuredClone(claim) });
    }
    nameAmendments.push({ before, after: structuredClone(person), claims, independentDecision: correction });
  }
  if (chapter === '109') {
    const claim = extraction.claims.find(c => c.id === 'jinshu:109:c0617');
    need(claim?.subject === 'jinshu:109:p168' && claim.value.en === 'Prince Wang' && claim.value.zh === '王公' &&
      repairs.some(r => r.unitId === 's0189' && r.after.includes('Duke Wang') && r.sourceQuote.includes('王公')),
      'Reviewed bilingual title rendering no longer matches the existing name claim');
    const before = structuredClone(claim); claim.value.en = 'Duke Wang';
    derivedClaimAmendments.push({ before, after: structuredClone(claim), authority: 'Same independently approved Duke Wang rendering of 王公 in s0189/s0190; Chinese identity and claim evidence unchanged' });
  }
  const applied = applyTranslationRepairs(source, added), nextPacket = buildPeopleExtractionPacket('jinshu', chapter,
    { chapterData: applied.chapter, chapterFile: runtime + '/' + files.source, properNounMatcher: matcher });
  let reconciled = reconcileExtractionAfterRepairs(extraction, nextPacket, { previousPacket: packet });
  const candidateDecisions = [];
  if (chapter === '108') {
    const unit = nextPacket.units.find(u => u.id === 's0142');
    const decisions = [
      { exact: 'Eastern Yi Colonel Feng', disposition: 'duplicate-hint', reason: 'duplicate-candidate',
        note: 'Truncated title-and-surname detector expression overlaps the fully linked Feng Chou mention; 封抽 remains linked to jinshu:108:p038.',
        witness: '封抽', person: 'jinshu:108:p038', englishMention: 'Feng Chou' },
      { exact: 'Liaodong', disposition: 'not-person', reason: 'office',
        note: 'Office jurisdiction in Han Jiao’s acting Liaodong chancellorship (行遼東相), not another individual.',
        witness: '行遼東相韓矯', person: 'jinshu:108:p087', englishMention: 'Han Jiao' },
    ];
    for (const decision of decisions) {
      const candidates = nextPacket.preflight.candidates.filter(c => reconciled.unresolvedCandidates.includes(c.id) &&
        c.unit === 's0142' && c.language === 'en' && c.exact === decision.exact);
      need(candidates.length === 1 && unit.zh.includes(decision.witness) &&
        reconciled.extraction.mentions.some(m => m.person === decision.person && m.unit.id === 's0142' &&
          m.spans.en.some(span => span.exact === decision.englishMention)), 'Exact source-backed candidate context changed');
      const candidate = candidates[0];
      reconciled.extraction.candidateDispositions.push({ candidate: candidate.id, disposition: decision.disposition,
        reason: decision.reason, note: decision.note });
      reconciled.unresolvedCandidates = reconciled.unresolvedCandidates.filter(id => id !== candidate.id);
      candidateDecisions.push({ candidate, ...decision, sourceQuote: unit.zh });
    }
  }
  if (chapter === '109') {
    const jurisdiction = nextPacket.preflight.candidates.filter(c => reconciled.unresolvedCandidates.includes(c.id) &&
      c.unit === 's0018' && c.language === 'en' && c.exact === 'Liaodong' && c.occurrence === 1);
    need(jurisdiction.length === 1 && nextPacket.units.find(u => u.id === 's0018').zh.includes('遼東相韓矯'), 'Exact office jurisdiction changed');
    reconciled.extraction.candidateDispositions.push({ candidate: jurisdiction[0].id, disposition: 'not-person', reason: 'office',
      note: 'Liaodong is the jurisdiction of Han Jiao’s office 遼東相, not a separate individual.' });
    reconciled.unresolvedCandidates = reconciled.unresolvedCandidates.filter(id => id !== jurisdiction[0].id);
    candidateDecisions.push({ candidate: jurisdiction[0], disposition: 'not-person', reason: 'office', sourceQuote: '遼東相韓矯' });
    const requested = [
      { unit: 's0095', exact: 'Zhao', occurrence: 0, person: 'jinshu:109:p124', kind: 'personal-name', witness: '釗單馬而遁' },
      { unit: 's0096', exact: 'Zhao', occurrence: 1, person: 'jinshu:109:p124', kind: 'personal-name', witness: '釗父利' },
      { unit: 's0189', exact: 'Duke Wang', occurrence: 0, person: 'jinshu:109:p168', kind: 'title-reference', witness: '王公何以不任' },
    ].map(row => {
      const matches = nextPacket.preflight.candidates.filter(c =>
        c.unit === row.unit && c.language === 'en' && c.exact === row.exact && c.occurrence === row.occurrence);
      need(matches.length === 1 && nextPacket.units.find(u => u.id === row.unit).zh.includes(row.witness) &&
        (reconciled.extraction.mentions.some(m => m.person === row.person && m.unit.id === row.unit && m.spans.zh.length) ||
          reconciled.extraction.claims.some(c => c.subject === row.person && c.predicate === 'name' &&
            c.evidence.includes('jinshu:109:' + row.unit))),
        'Reviewed English callback lacks its existing Chinese person witness: ' + row.unit + ':' + row.exact);
      if (!reconciled.unresolvedCandidates.includes(matches[0].id)) {
        need(reconciled.extraction.mentions.some(m => m.person === row.person && m.unit.id === row.unit &&
          m.candidateRefs.includes(matches[0].id)), 'Native callback was accounted for by a different assignment');
        candidateDecisions.push({ candidate: matches[0], person: row.person, kind: row.kind, sourceQuote: row.witness,
          nativeAlreadyLinked: true });
        return null;
      }
      candidateDecisions.push({ candidate: matches[0], person: row.person, kind: row.kind, sourceQuote: row.witness });
      return { candidate: matches[0].id, person: row.person, kind: row.kind };
    }).filter(row => row !== null);
    reconciled = assignExplicitCandidatePeople(reconciled, nextPacket, requested);
    const fleeing = nextPacket.units.find(u => u.id === 's0095');
    need(fleeing.zh === '翰與釗戰於木底，大敗之，乘勝遂入丸都，釗單馬而遁。', 'Repeated Chinese name context changed');
    const mention = reconciled.extraction.mentions.find(m => m.person === 'jinshu:109:p124' && m.unit.id === 's0095' && m.spans.zh.length);
    const second = exactSpanAt(fleeing.zh, '釗', 1);
    if (!mention.spans.zh.some(s => s.startCodePoint === second.startCodePoint)) {
      mention.spans.zh.push(second);
      candidateDecisions.push({ person: mention.person, unit: 's0095', language: 'zh', addedSpan: second,
        sourceQuote: '釗單馬而遁', authority: 'Same independently reviewed king and source event; preserve the explicit repeated Chinese name backlink' });
    }
  }
  fs.writeFileSync(dir + 'amendments-' + chapter + '-prospective-packet.json', JSON.stringify(nextPacket, null, 2) + '\n');
  fs.writeFileSync(dir + 'amendments-' + chapter + '-prospective-extraction.json', JSON.stringify(reconciled.extraction, null, 2) + '\n');
  fs.writeFileSync(dir + 'amendments-' + chapter + '-reconciliation.json', JSON.stringify({ unresolvedSpans: reconciled.unresolvedSpans,
    unresolvedCandidates: reconciled.unresolvedCandidates }, null, 2) + '\n');
  need(!reconciled.unresolvedSpans.length && !reconciled.unresolvedCandidates.length, 'Amended English requires explicit span/candidate reconciliation: ' + chapter);
  const options = { strictAliasDispositions: chapter === '109' };
  const validated = validatePeopleExtraction(reconciled.extraction, nextPacket, options);
  validateAppliedEditorialDecisions(editorial, validated.normalized);
  const compact = compactPeopleExtraction(validated.normalized, nextPacket); validateCompactPeopleExtraction(compact, nextPacket, options);
  const outputs = { source: JSON.stringify(applied.chapter, null, 2) + '\n', extraction: serializeCompactPeopleExtraction(compact),
    editorial: JSON.stringify(editorial, null, 2) + '\n' }, savedInputs = {}, savedOutputs = {};
  for (const [kind, text] of Object.entries(outputs)) {
    const inputFile = dir + 'before-amendments-' + chapter + '-' + kind + '.json', outputFile = dir + 'reviewed-amendments-' + chapter + '-' + kind + '.json';
    sealed(inputFile, inputs[kind].bytes); sealed(outputFile, text);
    savedInputs[kind] = { path: inputs[kind].path, saved: inputFile, sha256: inputs[kind].sha256 };
    savedOutputs[kind] = { path: outputFile, sha256: hash(Buffer.from(text)) };
  }
  result.chapters.push({ book: 'jinshu', chapter, repairs: repairs.length, nameAmendments, derivedClaimAmendments, reasonRenderings, candidateDecisions, inputs: savedInputs, outputs: savedOutputs,
    productionValidation: true, appliedEditorialValidation: true, strictAliasDispositions: options.strictAliasDispositions, stats: validated.stats });
}
need(!inspectLocalDisk(root).errors.length, 'Resource guard failed after preparation; preserve artifacts');
fs.writeFileSync(dir + 'reviewed-amendments-manifest.json', JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ prepared: true, chapters: result.chapters.map(c => ({ chapter: c.chapter, repairs: c.repairs,
  names: c.nameAmendments.length, stats: c.stats })), canonicalWrites: 0 }));
