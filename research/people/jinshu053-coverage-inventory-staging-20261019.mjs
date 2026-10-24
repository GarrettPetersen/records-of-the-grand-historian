// Read-only reproducible inventory; run from repository root and capture stdout.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const inputRev = process.env.JINSHU053_RESEARCH_REF || '6c7a2451029aa77f91b333bb9038dd3a497e2f42';
const dir = 'research/people/';
const rev = '54eb5a3c50281bf71a42464b913f194f56753fd0';
const digest = b => createHash('sha256').update(b).digest('hex');
const source = execFileSync('git', ['show', `${rev}:data/jinshu/053.json`]);
if (digest(source) !== '85bc5ea59ed954d7a8543981b3d2c778802e08bf6505ea2c79dcaedc98af4407') throw Error('Pinned chapter bytes changed');
const available = new Set(execFileSync('git', ['ls-tree', '-r', '--name-only', inputRev, dir], { encoding: 'utf8' }).trim().split('\n'));
const file = name => execFileSync('git', ['show', `${inputRev}:${dir}${name}`]);
const openingName = 'jinshu053-opening-editorial-draft-54eb5a3-v4.json';
const middleName = 'jinshu053-middle-editorial-proposals-v4-54eb5a3.json';
const middleReviewName = 'jinshu053-middle-v4-independent-review-20261019.md';
const openingReviewName = 'jinshu053-opening-independent-crosscheck-54eb5a3.json';
const refs = [openingName, openingReviewName, middleName, middleReviewName,
  'jinshu053-middle-editorial-source-review-54eb5a3.md',
  'jinshu053-bilingual-editorial-repair-draft-20261019.md',
  'jinshu053-independent-editorial-crosscheck-20261019.md',
  'jinshu053-additional-editorial-draft-20261019.md',
  'jinshu053-additional-independent-review-20261019.md',
  'jinshu053-final-units-editorial-draft-20261019.md',
  'jinshu053-final-units-independent-review-20261019.md',
  'jinshu053-independent-source-and-editorial-review-20261019.md',
  'jinshu053-independent-candidate-review-20261019.md'];
const missing = refs.filter(name => !available.has(dir + name));
if (missing.length) throw Error(`Missing checkpointed inputs at ${inputRev}:\n${missing.map(name => `${dir}${name}`).join('\n')}`);
const opening = JSON.parse(file(openingName));
const middle = JSON.parse(file(middleName));
const openingReview = JSON.parse(file(openingReviewName));
if (openingReview.draftSha256 !== digest(file(openingName)) || openingReview.sourceSha256 !== digest(source) || openingReview.results.length !== 65) throw Error('Opening review evidence does not match pinned draft and source');
const openingReviews = new Map(openingReview.results.map(r => [r.id, r]));
if (openingReviews.size !== 65) throw Error('Duplicate opening review units');
const openingMap = new Map(opening.rows.map(r => [r.id, r]));
const middleMap = new Map(middle.proposals.map(r => [r.id, r]));
const middleReview = file(middleReviewName).toString();
const statuses = new Map([...middleReview.matchAll(/^- \*\*(s\d{4}) (ACCEPT(?: WITH CAUTION)?|HOLD):/gm)].map(m => [m[1], m[2]]));
if (middleMap.size !== 53 || statuses.size !== 53) throw Error('Middle proposal/review no longer matches expected scope');
const units = JSON.parse(source).content.flatMap(p => p.sentences ?? []);
const ids = new Set(units.map(u => u.id));
if (ids.size !== units.length) throw Error('Duplicate IDs');
const addHold = new Set('0131 0132 0134 0135 0139 0140 0141 0143 0170 0171 0177 0186 0188'.split(' ').map(s => `s${s}`));
const finalHold = new Set('0166 0189 0190 0191 0192 0196 0197 0202 0203 0204 0205'.split(' ').map(s => `s${s}`));
const funeralHold = new Set('0153 0158 0160 0163 0164'.split(' ').map(s => `s${s}`));
const uncoveredHold = new Set('0069 0070 0087 0104 0126'.split(' ').map(s => `s${s}`));
const lines = [];
lines.push('# Jinshu 053: reproducible coverage and hold inventory', '',
  `Source: Git ${rev}:data/jinshu/053.json; byte SHA-256 ${digest(source)}.`,
  'This is a noncanonical evidence inventory, not a chapter approval, formal decision set, proof of completed review, or publication authorization. Rows follow chapter physical order, not sorted IDs. The labels concern only the identified draft fields: unchanged fields require independent review, as do joined quotation and terminology. “Supported” means provisional support by a separate reviewer, not an approved or applied repair.', '',
  '## Physical-order inventory', '',
  '| Unit | Drafted fields | Evidence / remaining review |', '| --- | --- | --- |');
for (const unit of units) {
  const id = unit.id, n = Number(id.slice(1));
  const en = unit.translations?.find(t => t.lang === 'en');
  if (!en) throw Error(`Missing English fields: ${id}`);
  const o = openingMap.get(id), m = middleMap.get(id);
  let fields = 'none identified', status = 'No row-level independent editorial review established by these artifacts; check both existing fields.';
  if (o) {
    if (o.zh !== unit.zh || o.before.literal !== en.literal || o.before.idiomatic !== en.idiomatic) throw Error(`Opening source/before mismatch: ${id}`);
    fields = ['literal', 'idiomatic'].filter(f => o.before[f] !== o.after[f]).join(', ') || 'no change';
    const review = openingReviews.get(id);
    if (!review || JSON.stringify([...review.changedFields].sort()) !== JSON.stringify(fields === 'no change' ? [] : fields.split(', ').sort())) throw Error(`Opening review changed-field mismatch: ${id}`);
    status = `Opening independent crosscheck: ${review.verdict}. ${review.note} Unchanged sibling fields require complete review.`;
  } else if (openingReviews.has(id)) {
    const review = openingReviews.get(id);
    if (review.changedFields.length) throw Error(`Unexpected opening changed fields: ${id}`);
    status = `Opening independent crosscheck: ${review.verdict}. ${review.note} Limited review is not chapter approval.`;
  } else if (m) {
    if (m.zh !== unit.zh) throw Error(`Middle Chinese mismatch: ${id}`);
    for (const f of m.fields) if (f.before !== en[f.field]) throw Error(`Middle before mismatch: ${id}/${f.field}`);
    fields = m.fields.map(f => f.field).join(', ');
    status = `Middle v4 independent review: ${statuses.get(id)} (see exact row objections); unchanged sibling requires separate completeness check.`;
  } else if (n >= 131 && n <= 143 || n >= 167 && n <= 188) {
    fields = 'both proposed in additional draft';
    status = addHold.has(id) ? 'Independent reviewer: HOLD or revision, at least one field; see exact row.' : 'Independent reviewer: selected replacements provisionally supported; quote continuity and exact handoff remain.';
  } else if (n >= 144 && n <= 165) {
    fields = 'both proposed in bilingual draft';
    status = funeralHold.has(id) ? 'Independent reviewer: objection / qualified wording; see exact row.' : 'Independent reviewer: replacement locally defensible, not chapter approval.';
  } else if (n === 166 || n >= 189 && n <= 209) {
    fields = n === 203 ? 'separate bilingual draft' : 'final-units draft (inspect exact fields)';
    status = finalHold.has(id) ? 'Independent final-units review: HOLD, qualification or separate reviewer required; see exact row.' : 'Independent reviewer: selected wording provisionally supported, with stated terminology/allusion cautions.';
  } else if (uncoveredHold.has(id)) {
    status = 'Known unresolved middle source / translation problem; independently resolve both existing fields.';
  }
  lines.push(`| ${id} | ${fields} | ${status} |`);
}
lines.push('', '## Critical dependencies and remaining work', '',
  '- Opening v4 has a separate, limited 65-unit crosscheck: 40 provisionally supported, 11 revise-or-hold, four research-hold, four additional repairs needed and six no-proposal-reviewed. Resolve all objections, independently review revised exact fields and assess unchanged fields; this is not chapter approval. Review physical-order interruptions s0199–s0205 and s0206–s0209 in context.',
  '- Middle: resolve the HOLD rows, difficult s0069–s0070, s0087, s0104 and s0126; review unchanged sibling fields and quote boundaries s0072, s0074, s0110, s0116, s0117, s0125 and s0129. See the independent review for exact alternate wording and qualifications.',
  '- Additional/funeral/final drafts have scoped independent reviews, not accepted handoffs. Resolve every marked hold and qualification, then independently re-review revised exact-field text. Address s0131 identity, ritual and mourning s0139–s0143, allusions s0154–s0164 and s0190–s0197, the s0166 closing, s0177 identity, s0188 omissions, and s0202–s0205.',
  '- Source variants need distinct, source-pinned decisions: both missing 虨 at s0170 and s0171; 乙/以 at s0139; 隆祚/降祚 at s0160; 華暠/華廙 at s0205. Wikisource and Shidianguji transcriptions are evidence, not proven independent editions; obtain edition/scan provenance before emendation. Jinshu 044 cross-chapter evidence supports Hua Yi as Heng’s father but does not itself authorize modifying the pinned source.',
  '- Coordinate source/extraction fingerprints and separately assess affected identity decisions. The pinned hold note identifies 80 potential resolution files and 595 decisions involving 45 local persons, not 595 established errors or automatically invalidated decisions. Resolve the 武帝 alias classification and avoid assigning unsupported Yi or Consort Wang identities.',
  '- Preserve the prior research-blocked date report and draft candidates. Inferred age-five fire year is conditional on age convention, death chronology and calendar mapping; the provenance must remain auditable and reader-visible. Validate exact resulting extraction, conduct a fresh independent complete date audit, reconcile identity as applicable, and check generated person pages, backlinks, search and ebook glossary. No draft or focused review alone closes editorial, date or publication gates.', '',
  '## Artifact byte hashes', '');
for (const name of refs) lines.push(`- ${name}: ${digest(file(name))}`);
lines.push('', 'The generator checks both English before-fields for every opening proposal and the Chinese and proposed before-fields for every middle proposal. It does not independently validate prose draft quotations or infer formal review decisions. Consult the hashed reports for exact evidence and row-specific qualifications.', '');
process.stdout.write(lines.join('\n'));
