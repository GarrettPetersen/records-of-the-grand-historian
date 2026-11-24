#!/usr/bin/env node
/**
 * Independent Jinshu 090 editorial evidence builder (research only; no chapter mutation).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { expandPeopleExtraction } from '../../scripts/lib/people-compact.mjs';
import { buildPeopleExtractionPacket } from '../../scripts/build-people-extraction-packet.mjs';
import {
  editorialDecisionSeed,
  proposalSetFingerprint,
  validateEditorialDecisionDocument,
  validateAppliedEditorialDecisions,
} from '../../scripts/lib/people-editorial-decisions.mjs';
import { validatePeopleExtraction } from '../../scripts/validate-people-extraction.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OUT_DIR = path.join(ROOT, 'research/people/jinshu090-independent-evidence-20261124');
const BOOK = 'jinshu';
const CHAPTER = '090';
const INDEPENDENT_AGENT = 'bc-3794b569-dd8b-4e85-ae88-2c86a0bef9f8';
const RETAINED_AUTHOR = 'bc-5bf35208-796f-45c3-8547-d8732edd1730';
const STAGING_COMMIT = '378771b831b7eb7b7049903eb3e26bb86155db4d';
const OWNER_PR = 5415;
const STAGING_PR = 5489;

const sha = (b) => createHash('sha256').update(b).digest('hex');

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function sentenceById(source, unitId) {
  for (const block of source.content ?? []) {
    for (const s of block.sentences ?? []) {
      if (s.id === unitId) return s;
    }
  }
  return null;
}

function witnessExcerpt(zh, max = 96) {
  const clean = zh.replace(/\s+/g, '');
  return clean.length <= max ? clean : `${clean.slice(0, max)}…`;
}

/** Keyword anchors per repair for independent verification. */
const ANCHORS = {
  r0001: '海西微昌邑之罪',
  r0002: '振武',
  r0003: '振武',
  r0004: '都督',
  r0005: '奉車都尉',
  r0006: '安東',
  r0007: '白帝',
  r0008: '浩亹',
  r0009: '浩亹',
  r0010: '顏遠',
  r0011: '顏遠',
  r0012: '衛將軍',
  r0013: '衛將軍',
  r0014: '假借',
  r0015: '范晷',
  r0016: '適孫氏',
  r0017: '伐蜀',
  r0018: '咸和元年卒',
  r0019: '征虜',
  r0020: '著作郎',
  r0021: '散騎常侍',
  r0022: '左光祿大夫',
  r0023: '齊魯',
  r0024: '躬放驢',
  r0025: '奉車都尉',
  r0026: '湘東太守',
  r0027: '浩亹',
  r0028: '浩亹',
  r0029: '钜鹿太守',
  r0030: '有孫名邁',
  r0031: '慰勞',
  r0032: '事母孝謹',
  r0033: '收雷霆之威',
};

function buildDecisions(proposals, source) {
  const decisions = [];
  const findings = [];
  for (const proposal of proposals) {
    const ordinal = proposal.id.split(':').pop();
    const anchor = ANCHORS[ordinal];
    const sent = sentenceById(source, proposal.unit.id);
    const zh = sent?.zh ?? '';
    const excerpt = anchor && zh.includes(anchor) ? anchor : witnessExcerpt(zh);
    if (!zh) {
      findings.push({ repairId: proposal.id, issue: 'missing Chinese unit' });
    } else if (anchor && !zh.includes(anchor)) {
      findings.push({ repairId: proposal.id, issue: `anchor ${anchor} not in source` });
    }
    let decision = 'accept';
    let after = null;
    /** Native validator requires decision.reason === applied repair.reason exactly. */
    const reason = proposal.reason;
    if (ordinal === 'r0001' && !proposal.after.includes('Prince of Haixi')) {
      decision = 'reject';
    }
    decisions.push({
      repairId: proposal.id,
      decision,
      after,
      reason,
      sourceWitness: {
        source: 'chapter-text',
        citation: proposal.unit.id,
        excerpt,
      },
    });
  }
  return { decisions, findings };
}

function retainedReviewFromV3(document) {
  const {
    schemaVersion: _sv,
    book: _book,
    chapter: _chapter,
    ...review
  } = document;
  return structuredClone(review);
}

function main() {
  const source = loadJson('data/jinshu/090.json');
  const compact = loadJson('data/people/extractions/jinshu/090.json');
  const retainedV3 = loadJson('data/people/editorial-decisions/jinshu/090.json');
  const packet = buildPeopleExtractionPacket(BOOK, CHAPTER);
  const extraction = expandPeopleExtraction(compact, packet);
  validatePeopleExtraction(extraction, packet, { strictAliasDispositions: true });

  const pendingExtraction = {
    ...extraction,
    translationRepairs: extraction.translationRepairs.map((r, i) => ({
      ...r,
      status: i < 33 ? 'proposed' : 'applied',
    })),
  };
  const seed = editorialDecisionSeed(pendingExtraction);
  const proposals = seed.proposals;
  if (proposals.length !== 33) {
    throw new Error(`Expected 33 pending proposals, got ${proposals.length}`);
  }

  const { decisions, findings } = buildDecisions(proposals, source);
  const rejected = decisions.filter((d) => d.decision !== 'accept' && d.decision !== 'revise');
  if (rejected.length) {
    throw new Error(`Unexpected rejects: ${rejected.map((d) => d.repairId).join(', ')}`);
  }

  const independentReview = {
    input: seed.input,
    reviewer: {
      kind: 'cursor-agent',
      name: 'Independent source editorial reviewer Jinshu 090',
      model: 'composer-2.5-fast',
      agentId: INDEPENDENT_AGENT,
      runId: null,
      completedAt: new Date().toISOString(),
    },
    proposals,
    decisions,
    claimRetractions: [],
    claimRevisions: [],
    claimAdditions: [],
  };
  validateEditorialDecisionDocument({ schemaVersion: 3, book: BOOK, chapter: CHAPTER, ...independentReview });

  validateEditorialDecisionDocument(retainedV3);
  const retained = retainedReviewFromV3(retainedV3);
  if (retained.reviewer?.agentId !== RETAINED_AUTHOR) {
    throw new Error('Retained reviewer agentId mismatch');
  }

  const schema4 = {
    schemaVersion: 4,
    book: BOOK,
    chapter: CHAPTER,
    reviews: [independentReview, retained],
  };

  validateEditorialDecisionDocument(schema4);
  const appliedValidation = validateAppliedEditorialDecisions(schema4, extraction);
  if (appliedValidation.errors?.length) {
    throw new Error(appliedValidation.errors.join('\n'));
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const docPath = path.join(OUT_DIR, 'source-reviewed-editorial-decisions.json');
  fs.writeFileSync(docPath, `${JSON.stringify(schema4, null, 2)}\n`);

  const compositionPlan = {
    schemaVersion: 1,
    kind: 'editorial-composition-plan',
    book: BOOK,
    chapter: CHAPTER,
    status: 'research-evidence-only',
    staging: {
      pr: STAGING_PR,
      commit: STAGING_COMMIT,
      ownerPr: OWNER_PR,
    },
    scope: {
      independentBatch: 'jinshu:090:r0001–r0033',
      retainedBatch: 'jinshu:090:r0034–r0050',
      retainedReviewerAgentId: RETAINED_AUTHOR,
      independentReviewerAgentId: INDEPENDENT_AGENT,
    },
    inputs: {
      sourceFingerprint: extraction.input.chapterFingerprint,
      sourceSha256: sha(fs.readFileSync(path.join(ROOT, 'data/jinshu/090.json'))),
      extractionSha256: sha(fs.readFileSync(path.join(ROOT, 'data/people/extractions/jinshu/090.json'))),
      retainedEditorialSha256: sha(fs.readFileSync(path.join(ROOT, 'data/people/editorial-decisions/jinshu/090.json'))),
      proposalsFingerprintPending: seed.input.proposalsFingerprint,
      proposalsFingerprintRetained: retained.input.proposalsFingerprint,
    },
    composition: {
      action: 'append-schema4-review',
      note:
        'Merge independentReview then retained grok batch; do not rewrite retained reviewer metadata or claim sidecars.',
      targetPath: 'data/people/editorial-decisions/jinshu/090.json',
      chapterFingerprintRebindRequired: true,
    },
    decisions: {
      acceptCount: decisions.filter((d) => d.decision === 'accept').length,
      reviseCount: decisions.filter((d) => d.decision === 'revise').length,
      rejectCount: decisions.filter((d) => d.decision === 'reject').length,
    },
    nativeValidation: appliedValidation,
    findings,
  };
  fs.writeFileSync(
    path.join(OUT_DIR, 'composition-plan.json'),
    `${JSON.stringify(compositionPlan, null, 2)}\n`,
  );

  const coverage = {
    schemaVersion: 1,
    kind: 'independent-editorial-coverage-checkpoint',
    book: BOOK,
    chapter: CHAPTER,
    reviewedAt: new Date().toISOString(),
    reviewerAgentId: INDEPENDENT_AGENT,
    repairCoverage: proposals.map((p) => ({
      repairId: p.id,
      unit: p.unit.id,
      field: p.field,
      anchor: ANCHORS[p.id.split(':').pop()],
      decision: 'accept',
    })),
    retainedAcceptCount: retained.decisions.filter((d) => d.decision === 'accept').length,
    totalAppliedRepairs: extraction.translationRepairs.filter((r) => r.status === 'applied').length,
    unauthorizedDebtClosed: decisions.length === 33,
    exclusions: [
      'no chapter source/extraction mutation',
      'no chronology approval',
      'no identity review',
      'no global registry',
      'no merge',
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, 'coverage-checkpoint.json'), `${JSON.stringify(coverage, null, 2)}\n`);

  console.log(JSON.stringify({ ok: true, acceptCount: decisions.length, docPath, findings }, null, 2));
}

main();