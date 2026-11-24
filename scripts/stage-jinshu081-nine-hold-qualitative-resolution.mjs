#!/usr/bin/env node
/**
 * Resolve only the nine retained Jinshu 081 unresolved holds using native
 * sourceDate.text + qualitative (094 永康初 pattern) or honest undated /
 * event-only forms. No Western invention; no validator edits; no audit approval.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { applyDateRepairProposal } from './lib/people-date-workflow.mjs';
import { buildDateAuditPacket } from './lib/people-date-audit.mjs';
import { PEOPLE_DIR, readJson, writeJsonAtomic, writeTextAtomic } from './lib/people-content.mjs';
import { serializeCompactPeopleExtraction } from './lib/people-compact.mjs';
import { validateCompactPeopleExtraction } from './validate-people-extraction.mjs';
import { buildPeopleExtractionPacket } from './build-people-extraction-packet.mjs';
import { loadProperNounMatcher } from './lib/people-candidates.mjs';

const book = 'jinshu';
const chapter = '081';
const extractionPath = path.join(PEOPLE_DIR, 'extractions', book, `${chapter}.json`);
const extraction = readJson(extractionPath);
const packet = buildDateAuditPacket(book, chapter, { extraction });

const PRESERVE_WESTERN = {
  44: { era: 'AD', year: 310, precision: 'year' },
  1202: { era: 'AD', year: 326, precision: 'year' },
  1342: { era: 'AD', year: 393, precision: 'year' },
};

function claimRow(n) {
  return extraction.claims[n - 1];
}

function rebuildHints(claims) {
  const westernLabels = [];
  let qualitativeLabel = null;
  let unresolved = false;
  for (const claim of claims) {
    const value = claim[2];
    if (!value || value.undatedSourceAttestation) continue;
    const containers = [];
    if (claim[1] === 'attestation') containers.push(value);
    if (value.dateContext) containers.push(value.dateContext);
    for (const ctx of containers) {
      if (ctx.unresolved) unresolved = true;
      if (ctx.westernYear) westernLabels.push(`${ctx.westernYear.era} ${ctx.westernYear.year}`);
      if (ctx.westernInterval) {
        const start = ctx.westernInterval.start;
        const end = ctx.westernInterval.end;
        westernLabels.push(start.year === end.year && start.era === end.era
          ? `${start.era} ${start.year}`
          : `${start.era} ${start.year}-${end.era} ${end.year}`);
      }
      if (ctx.qualitative && ctx.sourceDate?.text) {
        qualitativeLabel = `During ${ctx.sourceDate.text} as stated in the source`;
      }
    }
  }
  const unique = [...new Set(westernLabels)];
  if (unique.length) return unique;
  if (unresolved) return ['Chapter cite lacks a convertible reign-year Western date for this person'];
  if (qualitativeLabel) return [qualitativeLabel];
  return [];
}

const plan = [];
const changes = [];

function revise(claimId, after, reason, notes) {
  const before = claimRow(claimId);
  changes.push({
    kind: 'replace',
    id: `claim-${claimId}`,
    before,
    after,
    reason,
  });
  plan.push({
    claimId: `claim-${claimId}`,
    person: before[0],
    kind: before[1],
    treatment: notes.treatment,
    chinese: notes.chinese,
    schema: notes.schema,
    witness: notes.witness,
  });
}

// --- Group 1: p002 太寧末 + 遜在州十四年 ---
// Relative tenure is a supported qualitative attestation; death is event-only
// with 太寧末 preserved in the event text (schema rejects qualitative/unresolved death without Western).
revise(4, [
  'p002',
  'attestation',
  {
    sourceDate: { text: '遜在州十四年' },
    qualitative: 'Relative provincial tenure of fourteen years as stated by 遜在州十四年, marking Wang Jian’s installation as acting inspector, with no Western conversion asserted.',
    event: 'After Wang Xun’s fourteen years in Ningzhou, the people install his middle son Jian to run provincial affairs, as stated at s0036.',
  },
  'explicit',
  ['s0036'],
], 'Convert relative tenure sourceDate 遜在州十四年 to source-quoted qualitative attestation (no Western year).', {
  treatment: 'qualitative-relative-attestation',
  chinese: '遜在州十四年',
  schema: 'attestation.sourceDate+qualitative',
  witness: 's0036 遜在州十四年，州人復立遜中子堅行州府事。',
});

revise(168, [
  'p002',
  'death',
  {
    event: 'Died of illness while being recalled to the capital after the late-Taining (太寧末) replacement of Ningzhou leadership at s0038; death fact retained, source milieu kept in the event text without a Western year or unresolved death dateContext.',
  },
  'explicit',
  ['s0038'],
], 'Event-only death: 太寧末 dates the recall/death sequence but cannot carry qualitative/unresolved death chronology without Western under native gates.', {
  treatment: 'event-only-death-preserving-太寧末-in-event',
  chinese: '太寧末',
  schema: 'death.event (no dateContext)',
  witness: 's0038 …太寧末，表以零陵太守尹奉為寧州，征堅還京，病卒。',
});

// --- Group 2: p026 惠帝末 ---
revise(52, [
  'p026',
  'attestation',
  {
    sourceDate: { text: '惠帝末' },
    qualitative: 'Late Emperor Hui milieu, exactly as stated by the source phrase 惠帝末, with no Western year conversion asserted.',
    event: 'Li Yi dies defending Ningzhou amid the southwestern revolt dated 惠帝末 at s0016.',
  },
  'explicit',
  ['s0016'],
], 'Convert 惠帝末 attestation to source-quoted qualitative form (094 永康初 pattern).', {
  treatment: 'qualitative-era-attestation',
  chinese: '惠帝末',
  schema: 'attestation.sourceDate+qualitative',
  witness: 's0016 惠帝末，西南夷叛，甯州刺史李毅卒…',
});

revise(169, [
  'p026',
  'death',
  {
    event: 'Died as Inspector of Ningzhou during the southwestern revolt dated 惠帝末 at s0016; death fact retained, era phrase preserved on the paired qualitative attestation without a Western death year.',
  },
  'explicit',
  ['s0016'],
], 'Event-only death paired with qualitative 惠帝末 attestation; avoids unsupported Western conversion.', {
  treatment: 'event-only-death',
  chinese: '惠帝末',
  schema: 'death.event (no dateContext); era on attestation',
  witness: 's0016 惠帝末…李毅卒',
});

// --- Group 3: p060 成帝即位 / 羊鑒 ---
// 成帝即位 dates anti-Sujun service, not the death; 羊鑒 on s0607 is not a dating claim.
revise(196, [
  'p060',
  'attestation',
  {
    sourceDate: { text: '成帝即位' },
    qualitative: 'Activity under Emperor Cheng’s accession, exactly as stated by the source phrase 成帝即位, with no Western year conversion asserted.',
    event: 'Yang Jian joins the campaign against Su Jun after Emperor Cheng’s accession, later receives Fengcheng marquisate and dies, as narrated at s0619.',
  },
  'explicit',
  ['s0619'],
], 'Retarget attestation to s0619 成帝即位 as qualitative activity dating; s0607 羊鑒 is name-only and not a dated assertion.', {
  treatment: 'qualitative-era-attestation',
  chinese: '成帝即位',
  schema: 'attestation.sourceDate+qualitative on s0619',
  witness: 's0619 及成帝即位，豫討蘇峻…卒。',
});

revise(295, [
  'p060',
  'death',
  {
    event: 'Died after enfeoffment and transfer to superintendent of the imperial household following the anti-Sujun campaign narrated at s0619; 成帝即位 dates that service, not a convertible death year, so death remains event-only.',
  },
  'explicit',
  ['s0619'],
], 'Remove misattributed 成帝即位 death dateContext; preserve death fact as event-only.', {
  treatment: 'event-only-death-era-not-death-date',
  chinese: '成帝即位',
  schema: 'death.event (no dateContext)',
  witness: 's0619 …徙光祿勳，卒。 (成帝即位 opens the career clause, not the death)',
});

// --- Group 4: p266 安帝反正 / 俄而季子 ---
revise(882, [
  'p266',
  'attestation',
  {
    undatedSourceAttestation: true,
    event: 'Narrative at s0454 places Huan Zhen in the plot around Jizi’s and Shu’s illness without supplying a personal calendar date on that unit (俄而季子 is narrative sequence, not a reign/year).',
  },
  'explicit',
  ['s0454'],
], 'Honest undated attestation: 俄而季子 carries no supported dating claim.', {
  treatment: 'undated-attestation',
  chinese: '俄而季子',
  schema: 'attestation.undatedSourceAttestation',
  witness: 's0454 俄而季子、述皆病…',
});

revise(964, [
  'p266',
  'death',
  {
    event: 'Huan Zhen dies before the restoration edict at s0459 (振死，安帝反正，詔曰…); 安帝反正 follows the death and is not a convertible Western death year, so death remains event-only.',
  },
  'explicit',
  ['s0459'],
], 'Event-only death: 安帝反正 postdates 振死 and does not date the death.', {
  treatment: 'event-only-death-era-postdates-death',
  chinese: '安帝反正',
  schema: 'death.event (no dateContext)',
  witness: 's0459 振死，安帝反正，詔曰…',
});

// --- Group 5: p160 永嘉中 ---
revise(521, [
  'p160',
  'attestation',
  {
    sourceDate: { text: '永嘉中' },
    qualitative: 'Mid-Yongjia era activity, exactly as stated by the source phrase 永嘉中, with no Western year conversion asserted.',
    event: 'Shi Le smashes Jiangxia in mid-Yongjia, as stated at s0277.',
  },
  'explicit',
  ['s0277'],
], 'Convert 永嘉中 to source-quoted qualitative attestation (094 永康初 pattern); no single-year Western asserted.', {
  treatment: 'qualitative-era-attestation',
  chinese: '永嘉中',
  schema: 'attestation.sourceDate+qualitative',
  witness: 's0277 永嘉中，石勒破江夏…',
});

const proposal = {
  schemaVersion: 1,
  kind: 'date-repair-proposal',
  book,
  chapter,
  sourceHash: packet.sourceHash,
  extractionHash: packet.extractionHash,
  author: {
    name: 'Jinshu 081 owner nine-hold qualitative resolution',
    agentId: 'bc-1d294055-ba1a-4edb-9343-adeb9881920a',
  },
  changes,
};

const mid = applyDateRepairProposal(extraction, proposal, packet);
const touched = [...new Set(changes.map((change) => change.after[0]))];
const hintChanges = [];
for (const personId of touched) {
  const person = mid.people.find((row) => row[0] === personId);
  const before = person[4]?.a;
  const after = rebuildHints(mid.claims.filter((claim) => claim[0] === personId));
  if (JSON.stringify(before) === JSON.stringify(after)) continue;
  hintChanges.push({
    kind: 'hints',
    personId,
    before,
    after,
    reason: `Rebuild active-date hints for ${personId} after nine-hold qualitative/undated/event-only resolution.`,
  });
}

const midPacket = buildDateAuditPacket(book, chapter, { extraction: mid });
const final = hintChanges.length
  ? applyDateRepairProposal(mid, {
    schemaVersion: 1,
    kind: 'date-repair-proposal',
    book,
    chapter,
    sourceHash: midPacket.sourceHash,
    extractionHash: midPacket.extractionHash,
    author: proposal.author,
    changes: hintChanges,
  }, midPacket)
  : mid;

// Preservation gates
const appliedRepairs = final.translationRepairs.filter((row) => row[6] === 'applied').length;
if (appliedRepairs !== 15) throw new Error(`Expected 15 applied repairs, found ${appliedRepairs}`);
for (const [id, year] of Object.entries(PRESERVE_WESTERN)) {
  const claim = final.claims[Number(id) - 1];
  const got = claim[1] === 'death' ? claim[2]?.dateContext?.westernYear : claim[2]?.westernYear;
  if (!got || got.era !== year.era || got.year !== year.year) {
    throw new Error(`Western year drift on claim-${id}: ${JSON.stringify(got)}`);
  }
}
for (const id of [4, 52, 168, 169, 196, 295, 521, 882, 964]) {
  const ctx = final.claims[id - 1][2];
  if (ctx?.unresolved || ctx?.dateContext?.unresolved) {
    throw new Error(`claim-${id} still unresolved after resolution`);
  }
}
if (final.people.some((person) => (person[4]?.a || []).some((hint) => /outside-knowledge/i.test(hint)))) {
  throw new Error('outside-knowledge hints reappeared');
}

const extPacket = buildPeopleExtractionPacket(book, chapter, { properNounMatcher: loadProperNounMatcher() });
validateCompactPeopleExtraction(final, extPacket, { strictAliasDispositions: true });
writeTextAtomic(extractionPath, serializeCompactPeopleExtraction(final));
const finalPacket = buildDateAuditPacket(book, chapter);

const unresolvedLeft = [];
final.claims.forEach((claim, index) => {
  const ctx = claim[2];
  if (claim[1] === 'attestation' && ctx?.unresolved) unresolvedLeft.push(`claim-${index + 1}`);
  if (ctx?.dateContext?.unresolved) unresolvedLeft.push(`claim-${index + 1}`);
});

const receipt = {
  schemaVersion: 1,
  kind: 'owner-nine-hold-qualitative-resolution',
  book,
  chapter,
  pullRequest: 5478,
  independentNotesCommit: '19b654dc78d7c6e8990847adf7a6dc9067e8aa7d',
  independentNotes: 'research/people/jinshu081-grouped-residuals-20261124.json',
  stagingHeadBefore: '18d7d171637d04eef757b715bb265b4d5bc09a3f',
  beforeExtractionHash: packet.extractionHash,
  afterExtractionHash: finalPacket.extractionHash,
  sourceHash: finalPacket.sourceHash,
  claimChanges: changes.length,
  hintChanges: hintChanges.length,
  unresolvedRemaining: unresolvedLeft,
  preserved: {
    appliedEnglishRepairs: appliedRepairs,
    westernYears: Object.keys(PRESERVE_WESTERN).map((id) => `claim-${id}`),
    coveredRowsOutsideGroup: '840 independently covered rows left untouched except these nine and their person hint rebuilds',
  },
  plan,
  approvals: {
    selfApproved: false,
    auditRerun: false,
    qualityGatesChanged: false,
  },
};

writeFileSync(
  path.join('research/people/jinshu081-nine-hold-qualitative-resolution-20261124.json'),
  `${JSON.stringify(receipt, null, 2)}\n`,
);
writeFileSync(
  path.join('research/people/jinshu081-nine-hold-plan-20261124.json'),
  `${JSON.stringify({ schemaVersion: 1, groups: plan }, null, 2)}\n`,
);

console.log(JSON.stringify({
  claimChanges: changes.length,
  hintChanges: hintChanges.length,
  unresolvedRemaining: unresolvedLeft.length,
  afterExtractionHash: finalPacket.extractionHash,
  appliedRepairs,
}, null, 2));
console.log('PASS');
