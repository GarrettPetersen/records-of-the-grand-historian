#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPeopleExtractionPacket } from '../../../../scripts/build-people-extraction-packet.mjs';
import {
  editorialDecisionSeed,
  validateEditorialDecisions,
} from '../../../../scripts/lib/people-editorial-decisions.mjs';
import { readJson, sha256, REPO_ROOT } from '../../../../scripts/lib/people-content.mjs';
import { expandPeopleExtraction } from '../../../../scripts/lib/people-compact.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const completedAt = '2026-11-24T06:50:00.000Z';

const packet = buildPeopleExtractionPacket('shiji', '027');
let extraction = readJson(path.join(REPO_ROOT, 'data/people/extractions/shiji/027.json'));
extraction = expandPeopleExtraction(extraction, packet);
const seed = editorialDecisionSeed(extraction);

const decisionSpecs = {
  'shiji:027:r0001': {
    decision: 'accept',
    reason:
      '華 in 自華以西南 is Mount Hua (华山), consistent with s0631 自華以南 rendered as Mount Hua; Huazhi is unsupported.',
    witness: { id: 's0011', excerpt: '杓，自華以西南。' },
  },
  'shiji:027:r0002': {
    decision: 'accept',
    reason:
      'Same place name as r0001; idiomatic Huazhi must become Mount Hua to match the Chinese.',
    witness: { id: 's0011', excerpt: '杓，自華以西南。' },
  },
  'shiji:027:r0003': {
    decision: 'reject',
    after: null,
    reason:
      '將亡 is auxiliary “about to perish,” parallel to 國傾敗 (state collapse); the literal “will perish” already tracks the Chinese. The idiomatic “the general will perish” is the error — not grounds to import 將 as a general into literal.',
    witness: { id: 's0168', excerpt: '縮，其國有憂，將亡，國傾敗。' },
  },
  'shiji:027:r0004': {
    decision: 'accept',
    reason:
      'Chinese 有夏，昆吾 lists Xia-era Kunwu; English duplicated s0765 楚，唐眛 (Tang Mei). Extraction already binds Kunwu to s0759.',
    witness: { id: 's0759', excerpt: '有夏，昆吾；' },
    extractionImpact:
      'Aligns English with existing p012 name evidence on s0759; no claim or date edits required.',
  },
  'shiji:027:r0005': {
    decision: 'accept',
    reason: 'Same as r0004 for the literal field.',
    witness: { id: 's0759', excerpt: '有夏，昆吾；' },
    extractionImpact:
      'Aligns English with existing p012 name evidence on s0759; no claim or date edits required.',
  },
  'shiji:027:r0006': {
    decision: 'accept',
    reason:
      's0779 Chinese is 二十八舍主十二州，斗秉兼之，所從來久矣; current English is misplaced s0789 northwest-barbarian text.',
    witness: { id: 's0779', excerpt: '二十八舍主十二州，斗秉兼之，所從來久矣。' },
  },
  'shiji:027:r0007': {
    decision: 'accept',
    reason: 'Same as r0006 for the literal field.',
    witness: { id: 's0779', excerpt: '二十八舍主十二州，斗秉兼之，所從來久矣。' },
  },
};

const document = {
  ...seed,
  reviewer: {
    kind: 'cursor-agent',
    name: 'Independent Shiji 027 editorial reviewer',
    model: 'composer-2.5-fast',
    agentId: 'bc-846df7da-16df-49e5-b4ac-eef19ac70d51',
    runId: null,
    completedAt,
  },
  decisions: seed.decisions.map((row) => {
    const spec = decisionSpecs[row.repairId];
  if (!spec) throw new Error(`missing spec for ${row.repairId}`);
    return {
      repairId: row.repairId,
      decision: spec.decision,
      after: spec.after ?? null,
      reason: spec.reason,
      sourceWitness: {
        source: 'chapter-text',
        citation: `shiji/027 ${spec.witness.id}`,
        excerpt: spec.witness.excerpt,
      },
    };
  }),
};

validateEditorialDecisions(document, extraction, packet);

const outPath = path.join(__dirname, 'independent-editorial-decisions.json');
fs.writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
const digest = sha256(fs.readFileSync(outPath));
console.log('wrote', outPath);
console.log('decisionsSha256', digest);
console.log(
  'summary',
  document.decisions.map((d) => `${d.repairId}:${d.decision}`).join(', '),
);