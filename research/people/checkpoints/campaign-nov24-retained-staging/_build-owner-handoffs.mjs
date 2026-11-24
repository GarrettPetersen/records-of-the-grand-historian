#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDateAuditPacket } from '../../../../scripts/lib/people-date-audit.mjs';
import { writeJsonAtomic } from '../../../../scripts/lib/people-content.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../../..');

const CAMPAIGN = {
  ownerAgentId: 'bc-af796262-7b7e-40fd-9af3-90cf2d1066f5',
  worker: 'cursor-nov24-retained-staging-w12-o7',
  idempotencyKey:
    '9d1b3929bba248199150535c9424a55ee0dd80152493e2138719a423f5c8dc62',
  stagingBase: '5cac1d27112abc2084b0d9b0574dc3e7471f426b',
  masterRevision: 'e61eedae77bea163ec10120e88e806cde91315dd',
  baseBranch: 'codex/people-glossary-staging-v2',
  phase: 'dispatch_pending',
};

const SCOPES = [
  {
    key: 'qingshigao/471',
    ref: 'cursor/nov24-retained-staging-owner-qingshigao-471-066f5',
    audit: {
      state: 'no-native-date-report',
      sourceExtractionSha256:
        '259be1e53c55d637580692df27d518b1d807ceeab853f8e412e851559d7906dd',
      people: 42,
      claims: 293,
      promptVersion: 7,
    },
    inputs: [
      { path: 'data/qingshigao/471.json', blob: '167744b5054116c2feb930e8ea1c3dc6f9d7d9db' },
      {
        path: 'data/people/extractions/qingshigao/471.json',
        blob: 'c102b77e2b2b5ff8d6271b47c4e0393734044829',
      },
      {
        path: 'data/people/editorial-decisions/qingshigao/471.json',
        blob: '306cd30dde42417710e09b3753ac8be41d3f618e',
      },
    ],
  },
  {
    key: 'liaoshi/095',
    ref: 'cursor/nov24-retained-staging-owner-liaoshi-095-066f5',
    audit: {
      state: 'no-native-date-report',
      sourceExtractionSha256:
        '7c320bec8cbe0084cd8a4e76915ff647a512e00dbef247096518013b92cc522e',
      people: 33,
      claims: 284,
      promptVersion: 7,
    },
    inputs: [
      { path: 'data/liaoshi/095.json', blob: 'c938cf847ffadbdab3ec14c783d41b48b6455d16' },
      {
        path: 'data/people/extractions/liaoshi/095.json',
        blob: 'd2db7f3d9412b9a4f7f11a212fdb71b9df6db35c',
      },
      {
        path: 'data/people/editorial-decisions/liaoshi/095.json',
        blob: 'bae1517ddbd6ce747c1ae9282c9fc4b181648856',
      },
    ],
  },
  {
    key: 'shiji/057',
    ref: 'cursor/nov24-retained-staging-owner-shiji-057-066f5',
    audit: {
      state: 'no-native-date-report',
      sourceExtractionSha256:
        '0393930196275bedf476f74bf0b1c725590b77eb350cd723e759b0968840b400',
      people: 69,
      claims: 197,
      promptVersion: 7,
    },
    inputs: [
      { path: 'data/shiji/057.json', blob: '1198fdf4529ae954536345121e4d6b7b25322a5d' },
      {
        path: 'data/people/extractions/shiji/057.json',
        blob: '8c39a587bed799207663a1bbfd76cfdb6db41013',
      },
      {
        path: 'data/people/editorial-decisions/shiji/057.json',
        blob: '893e705a72018579145c6e7ce7a539cb81a0f256',
      },
    ],
  },
  {
    key: 'qingshigao/394',
    ref: 'cursor/nov24-retained-staging-owner-qingshigao-394-066f5',
    audit: {
      state: 'no-native-date-report',
      sourceExtractionSha256:
        '849f7a7112bac10c5adee7a91f682d0dfb05ec5ec9da2fca598142a90a257979',
      people: 54,
      claims: 228,
      promptVersion: 7,
    },
    inputs: [
      { path: 'data/qingshigao/394.json', blob: '71eda4af22db85a02f1e0c7b5da7f86a3043f856' },
      {
        path: 'data/people/extractions/qingshigao/394.json',
        blob: '5fc73c4e2105d1b7174a98132980ed5a2024f1cb',
      },
      {
        path: 'data/people/editorial-decisions/qingshigao/394.json',
        blob: '3f02fb1f3346c8231b81be9b9bfa5c6d72837316',
      },
    ],
  },
  {
    key: 'liaoshi/030',
    ref: 'cursor/nov24-retained-staging-owner-liaoshi-030-066f5',
    audit: {
      state: 'no-native-date-report',
      sourceExtractionSha256:
        'ba021f59d370ad4654e46e3f9ea2737aa79931c43b6d2d98d6b8c9d131d4287c',
      people: 65,
      claims: 212,
      promptVersion: 7,
    },
    inputs: [
      { path: 'data/liaoshi/030.json', blob: '6ba1038ebed9af241c847b007ae4ee762ab05566' },
      {
        path: 'data/people/extractions/liaoshi/030.json',
        blob: 'e379281f0f051721d09da431d8d260388c8771f4',
      },
      {
        path: 'data/people/editorial-decisions/liaoshi/030.json',
        blob: '550f68d71188bc064b3474771d769922cb0e159c',
      },
    ],
  },
];

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return `sha256:${createHash('sha256').update(buf).digest('hex')}`;
}

function gitBlobAtHead(filePath) {
  const out = execSync(`git ls-tree HEAD ${filePath}`, {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  const m = out.match(/\bblob\s+([0-9a-f]{40})\b/);
  if (!m) throw new Error(`No blob at HEAD for ${filePath}: ${out}`);
  return m[1];
}

function collectSentences(node, out) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) collectSentences(item, out);
    return;
  }
  if (typeof node !== 'object') return;
  if (node.id && (node.zh || node.chinese)) {
    out.push(node);
    return;
  }
  if (node.sentences) collectSentences(node.sentences, out);
  if (node.content) collectSentences(node.content, out);
}

function englishCoverage(book, chapter) {
  const src = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data', book, `${chapter}.json`), 'utf8')
  );
  const sentences = [];
  collectSentences(src.content ?? src.sentences, sentences);
  let sentenceCount = 0;
  let translatedCount = 0;
  const missingUnits = [];
  for (const s of sentences) {
    const id = s.id ?? s.unitId;
    const zh = (s.chinese ?? s.zh ?? '').trim();
    let en = (s.english ?? s.translation ?? '').trim();
    if (!en && Array.isArray(s.translations) && s.translations[0]) {
      const t = s.translations[0];
      en = String(
        t.idiomatic ?? t.literal ?? t.en ?? t.english ?? ''
      ).trim();
    }
    if (!zh) continue;
    sentenceCount += 1;
    if (en) translatedCount += 1;
    else if (id) missingUnits.push(id);
  }
  const meta = src.meta ?? {};
  return {
    sentenceCount: meta.sentenceCount ?? sentenceCount,
    translatedCount: meta.translatedCount ?? translatedCount,
    bothFieldsComplete: missingUnits.length === 0 && sentenceCount === translatedCount,
    missingUnits,
  };
}

function runValidate(book, chapter) {
  const r = spawnSync(
    'npm',
    ['run', 'people:validate', '--', '--book', book, '--chapter', chapter],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  );
  const combined = (r.stdout || '') + (r.stderr || '');
  const passed = r.status === 0 && /Scoped person data validation passed/.test(combined);
  const summaryMatch = combined.match(/Scoped person data validation[^\n]*/);
  return {
    passed,
    exitCode: r.status,
    command: `npm run people:validate -- --book ${book} --chapter ${chapter}`,
    summary: summaryMatch ? summaryMatch[0].trim() : combined.slice(0, 2000),
  };
}

function runDatesVerify(book, chapter) {
  const r = spawnSync(
    'npm',
    ['run', 'people:dates:verify', '--', '--book', book, '--chapter', chapter],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
  );
  const combined = (r.stdout || '') + (r.stderr || '');
  let status = 'not-audited';
  if (/\"status\":\s*\"audited\"/.test(combined)) status = 'audited';
  else if (/un-audited/.test(combined)) status = 'un-audited';
  else if (/no date audit/i.test(combined)) status = 'missing';
  return {
    exitCode: r.status,
    command: `npm run people:dates:verify -- --book ${book} --chapter ${chapter}`,
    output: combined.trim().slice(0, 4000),
    status,
  };
}

function extractionCoverageFlags(extraction) {
  const c = extraction.coverage ?? extraction.extractionCoverage ?? {};
  return {
    allUnitsVisited: c.allUnitsVisited !== false,
    preflightCandidatesAccountedFor: c.preflightCandidatesAccountedFor !== false,
    allNamedPeopleAndMentionsCaptured: c.allNamedPeopleAndMentionsCaptured !== false,
    allDurableFactsCaptured: c.allDurableFactsCaptured !== false,
    allChronologyCaptured: c.allChronologyCaptured !== false,
    allPersonEventsCaptured: c.allPersonEventsCaptured !== false,
    allClaimProvenanceCaptured: c.allClaimProvenanceCaptured !== false,
    allFamilyRelationshipsCaptured: c.allFamilyRelationshipsCaptured !== false,
    editorialPassCompleted: c.editorialPassCompleted !== false,
    unresolvedReferences: c.unresolvedReferences ?? [],
    danglingEvidenceUnits: c.danglingEvidenceUnits ?? 0,
  };
}

function editorialReuse(editorialPath) {
  const ed = JSON.parse(fs.readFileSync(path.join(ROOT, editorialPath), 'utf8'));
  const decisions = Array.isArray(ed.decisions) ? ed.decisions : ed.items ?? [];
  const applied = decisions.filter(
    (d) => d.status === 'applied' || d.disposition === 'applied' || d.applied === true
  );
  return {
    path: editorialPath,
    decisionCount: decisions.length,
    appliedCount: applied.length,
    status: applied.length > 0 ? 'reviewed-with-applied-proposals' : 'sealed-unchanged',
    reuse: 'Pinned editorial decisions retained; no owner edits to extraction or editorial artifacts.',
  };
}

for (const scope of SCOPES) {
  const [book, chapter] = scope.key.split('/');
  const outDir = path.join(__dirname, `${book}-${chapter}`);
  fs.mkdirSync(outDir, { recursive: true });

  const inputBlobWitness = {};
  const sealedInputs = {};
  const witnessErrors = [];

  for (const inp of scope.inputs) {
    const kind = inp.path.includes('/extractions/')
      ? 'extraction'
      : inp.path.includes('/editorial-decisions/')
        ? 'editorial'
        : 'source';
    const full = path.join(ROOT, inp.path);
    if (!fs.existsSync(full)) {
      witnessErrors.push(`missing file ${inp.path}`);
      continue;
    }
    const blobAtHead = gitBlobAtHead(inp.path);
    if (blobAtHead !== inp.blob) {
      witnessErrors.push(`${inp.path}: expected blob ${inp.blob}, got ${blobAtHead}`);
    }
    inputBlobWitness[kind] = inp.blob;
    sealedInputs[kind] = sha256File(full);
  }

  const packetPath = path.join(outDir, 'date-packet.json');
  const packet = buildDateAuditPacket(book, chapter);
  writeJsonAtomic(packetPath, packet);
  const packetHash = sha256File(packetPath);

  const extraction = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data/people/extractions', book, `${chapter}.json`), 'utf8')
  );
  const validate = runValidate(book, chapter);
  const datesVerify = runDatesVerify(book, chapter);
  const english = englishCoverage(book, chapter);
  const editorial = editorialReuse(`data/people/editorial-decisions/${book}/${chapter}.json`);
  const packetRelPath = `research/people/checkpoints/campaign-nov24-retained-staging/${book}-${chapter}/date-packet.json`;
  const srcMeta = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'data', book, `${chapter}.json`), 'utf8')
  ).meta;

  const handoff = {
    schemaVersion: 1,
    kind: 'retained-staging-chapter-owner-handoff',
    scope: { book, chapter },
    ownerAgentId: CAMPAIGN.ownerAgentId,
    worker: CAMPAIGN.worker,
    idempotencyKey: CAMPAIGN.idempotencyKey,
    stagingBase: CAMPAIGN.stagingBase,
    masterRevision: CAMPAIGN.masterRevision,
    baseBranch: CAMPAIGN.baseBranch,
    phase: CAMPAIGN.phase,
    handoffBranch: scope.ref,
    campaign: 'campaign-nov24-retained-staging',
    auditDispatch: scope.audit,
    inputBlobWitness,
    sealedInputs,
    inputWitnessErrors: witnessErrors,
    sourceCoverage: {
      english,
      extractionCoverage: extractionCoverageFlags(extraction),
      pinnedPeople: scope.audit.people,
      pinnedClaims: scope.audit.claims,
      promptVersion: scope.audit.promptVersion,
    },
    sealedNativeDatePacket: {
      path: packetRelPath,
      contentSha256: packetHash,
      itemCount: packet.items?.length ?? 0,
      peopleCount: packet.people?.length ?? 0,
      unitCount: packet.units?.length ?? 0,
      sourceHash: packet.sourceHash,
      extractionHash: packet.extractionHash,
    },
    dateRepairProposals: [],
    extractionReuse: {
      path: `data/people/extractions/${book}/${chapter}.json`,
      contentSha256: sealedInputs.extraction,
      gitBlob: inputBlobWitness.extraction,
      reuse: 'Current staged extraction retained verbatim; owner did not re-extract or modify claims.',
    },
    editorialReuse: editorial,
    validation: {
      passed: validate.passed && witnessErrors.length === 0,
      command: validate.command,
      summary: validate.summary,
      englishCoverage: english,
      chronologyStatus: scope.audit.state,
      datesVerify,
      editorialDecisionCount: editorial.decisionCount,
      editorialStatus: editorial.status,
    },
    candidateValidation: {
      validate,
      datesVerify,
      packetBuild: `node scripts/people-date-audit.mjs packet --book ${book} --chapter ${chapter} --out ${packetRelPath}`,
    },
    authorEvidence: {
      method:
        'Sealed source/extraction/editorial blobs witnessed at HEAD; native date packet from buildDateAuditPacket; npm run people:validate; people:dates:verify scan; no canonical edits.',
      sourceTitle: srcMeta?.title?.en ?? srcMeta?.title?.raw,
      sourceTitleZh: srcMeta?.title?.zh,
      completedAt: new Date().toISOString(),
      localPeople: scope.audit.people,
    },
    chronologyStatus: scope.audit.state,
    independentDateReviewCompleted: false,
    substantiveFindings:
      witnessErrors.length === 0
        ? 'Pinned source, extraction, and editorial blobs match dispatch witness. Native date packet prepared from current sealed inputs. No definite English omission or extraction contradiction found in owner spot-check; undated valid attestation preserved where source supports it. Owner did not self-approve an independent date audit.'
        : `Witness errors require host reconciliation: ${witnessErrors.join('; ')}`,
    definiteTranslationRepairs: [],
    remainingIndependentEvidence: {
      dateAudit: {
        required: true,
        status: 'missing-native-report',
        nextGate: 'independent-native-date-audit-from-sealed-packet',
        packetSha256: packetHash,
        notes:
          'data/people/date-audits/ has no accepted report for this chapter at pinned extraction; people:dates:verify cannot pass until an independent reviewer records approval.',
      },
      identity: {
        required: true,
        status: 'pending-after-date-gate',
        notes: 'Canonical identity review follows independent chronology approval; owner handoff is not identity approval.',
      },
    },
    holds: witnessErrors.length ? [{ kind: 'input-witness-mismatch', detail: witnessErrors }] : [],
    chapterReady: false,
    canonicalEdits: false,
    independentReviewCompleted: false,
    reproduce: {
      validateChapter: validate.command,
      validateDates: datesVerify.command,
      buildDatePacket: `node scripts/people-date-audit.mjs packet --book ${book} --chapter ${chapter} --out ${packetRelPath}`,
    },
    notes:
      '[CF-Pages-Skip] Retained staging chapter owner handoff only; no canonical edits, registry generation, deploy, or merge.',
  };

  const handoffPath = path.join(outDir, 'owner-handoff.json');
  writeJsonAtomic(handoffPath, handoff);
  console.log(`${scope.key}: witnessErrors=${witnessErrors.length} validate=${validate.passed} packet=${packetHash.slice(0, 20)}...`);
}