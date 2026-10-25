import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

export const hash = bytes => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const json = x => JSON.stringify(x);
const same = (a, b, label) => { if (json(a) !== json(b)) throw new Error(label); };
const requireTrue = (x, label) => { if (!x) throw new Error(label); };
const copy = x => JSON.parse(json(x));
const ordered = xs => xs.map(json).sort();
const reference = (x, ids) => typeof x === 'string' ? ids.has(x) : Array.isArray(x) ? x.some(v => reference(v, ids)) : x && typeof x === 'object' ? Object.values(x).some(v => reference(v, ids)) : false;

/** No checkout materialization. All repository reads (including schemas and
 * scanner inputs) resolve to the same commit; all writes are denied. */
const baselines = new Map();
export async function baselineApi(root, commit) {
  const key = `${root}\0${commit}`;
  if (!baselines.has(key)) baselines.set(key, createBaselineApi(root, commit));
  return baselines.get(key);
}
async function createBaselineApi(root, commit) {
  requireTrue(path.isAbsolute(root), 'Repository root must be absolute');
  requireTrue(/^[a-f0-9]{40}$/.test(commit), 'A full pinned commit is required');
  requireTrue(vm.SourceTextModule, 'Run Node with --experimental-vm-modules');
  const git = args => execFileSync('git', ['-C', root, ...args], { maxBuffer: 64 * 1024 * 1024 });
  same(git(['rev-parse', `${commit}^{commit}`]).toString().trim(), commit, 'Commit pin mismatch');
  const files = git(['ls-tree', '-r', '--name-only', commit]).toString().trim().split('\n');
  const tracked = new Set(files), reads = new Map();
  const read = name => {
    requireTrue(tracked.has(name), `Missing pinned baseline file: ${name}`);
    if (!reads.has(name)) reads.set(name, git(['show', `${commit}:${name}`]));
    return reads.get(name);
  };
  const relative = file => {
    const name = path.relative(root, file instanceof URL ? fileURLToPath(file) : String(file));
    requireTrue(name && !name.startsWith('../') && !path.isAbsolute(name), 'Repository read escapes baseline');
    return name;
  };
  const denied = () => { throw new Error('Baseline module filesystem mutation denied'); };
  const fs = { readFileSync(file, encoding) { const b = read(relative(file)); return encoding ? b.toString(typeof encoding === 'string' ? encoding : encoding.encoding) : Buffer.from(b); },
    existsSync(file) { const p = relative(file); return tracked.has(p) || files.some(f => f.startsWith(`${p}/`)); },
    readdirSync(file) { const prefix = `${relative(file)}/`; return [...new Set(files.filter(f => f.startsWith(prefix)).map(f => f.slice(prefix.length).split('/')[0]))]; },
    writeFileSync: denied, mkdirSync: denied, renameSync: denied, unlinkSync: denied, rmSync: denied };
  const context = vm.createContext({ console, Buffer, URL, process: { argv: [], env: { PEOPLE_REPO_ROOT: root }, pid: process.pid }, structuredClone });
  const modules = new Map(), require = createRequire(path.join(root, 'package.json'));
  const synthetic = (key, values) => {
    if (!modules.has(key)) modules.set(key, new vm.SyntheticModule(Object.keys(values), function() { for (const [k, v] of Object.entries(values)) this.setExport(k, v); }, { context, identifier: key }));
    return modules.get(key);
  };
  const load = name => {
    if (modules.has(name)) return modules.get(name);
    const module = new vm.SourceTextModule(read(name).toString(), { context, identifier: name,
      initializeImportMeta(meta) { meta.url = pathToFileURL(path.join(root, name)).href; } });
    modules.set(name, module); return module;
  };
  const linker = async (specifier, from) => {
    if (specifier === 'node:fs') return synthetic(specifier, { default: fs, ...fs });
    if (specifier.startsWith('.')) return load(path.posix.normalize(path.posix.join(path.posix.dirname(from.identifier), specifier)));
    const imported = specifier.startsWith('node:') ? await import(specifier) : await import(pathToFileURL(require.resolve(specifier)).href);
    return synthetic(specifier, { ...imported });
  };
  // Link one synthetic entry so shared transitive modules are linked once.
  const entry = new vm.SourceTextModule(`import * as p from './scripts/build-people-extraction-packet.mjs'; import * as v from './scripts/validate-people-extraction.mjs'; import * as e from './scripts/lib/people-editorial-decisions.mjs'; import * as d from './scripts/lib/people-curation-drift.mjs'; export {p,v,e,d};`, { context, identifier: 'entry.mjs' });
  await entry.link(linker); await entry.evaluate();
  const resolutionFilesFor = ids => {
    try { return git(['grep', '-l', '-F', ...ids.flatMap(id => ['-e', id]), commit, '--', 'data/people/resolutions/']).toString().trim().split('\n').filter(Boolean).map(line => line.slice(commit.length + 1)).sort(); }
    catch (error) { if (error.status === 1) return []; throw error; }
  };
  return { read, files, resolutionFilesFor, ...entry.namespace, inputPins: included => [...reads].filter(([file]) => !(file.startsWith('data/people/extractions/') || file.startsWith('data/people/editorial-decisions/') || file.startsWith('data/people/resolutions/') || /^data\/[^/]+\/\d{3}\.json$/.test(file)) || included.includes(file)).sort(([a], [b]) => a.localeCompare(b)).map(([file, bytes]) => ({ file, sha256: hash(bytes) })) };
}

const claimContract = c => ({ subject: c.subject, predicate: c.predicate, value: c.value, certainty: c.certainty, evidence: c.evidence });
const mentionContract = m => ({ person: m.person, unit: m.unit.id, kind: m.kind, spans: m.spans, candidateRefs: m.candidateRefs });
function records(expanded) {
  return [...expanded.claims.map(c => ({ locator: `claim:${c.id}`, kind: 'claim', value: claimContract(c) })),
    ...expanded.mentions.map(m => ({ locator: `mention:${m.id}`, kind: 'mention', value: mentionContract(m) }))];
}
export function changedRecords(before, after) {
  const a = records(before), b = records(after);
  // Numeric expanded IDs are locators, never stable identity contracts.
  const left = a.filter(x => !b.some(y => x.kind === y.kind && json(x.value) === json(y.value)));
  const right = b.filter(x => !a.some(y => x.kind === y.kind && json(x.value) === json(y.value)));
  return { before: left, after: right };
}
function occurrences(expanded) {
  return expanded.mentions.flatMap(m => Object.entries(m.spans).flatMap(([language, spans]) => spans.map(s => [m.unit.id, language, s.exact, s.occurrence, s.startCodePoint, s.endCodePoint, s.unitTextHash])));
}
/** Exception only for an exact removed mention span retained as an existing
 * enclosing non-person/title candidate. Both contracts are sealed by review. */
export function reviewedNonPersonOccurrences(before, after, packet, reclassifications) {
  requireTrue(Array.isArray(reclassifications), 'Mention reclassifications must be an array');
  const remaining = occurrences(before), seen = new Set();
  for (const row of reclassifications) {
    const mention = before.mentions.find(m => `mention:${m.id}` === row.before?.locator);
    requireTrue(mention && row.before.kind === 'mention', 'Unknown reclassification mention');
    same(row.before.value, mentionContract(mention), 'Forged reclassification mention contract');
    requireTrue(['zh', 'en'].includes(row.language), 'Invalid reclassification language');
    requireTrue(mention.spans[row.language].some(span => json(span) === json(row.span)), 'Forged reclassification span');
    const candidate = packet?.preflight.candidates.find(c => c.id === row.candidate?.id);
    same(row.candidate, candidate, 'Forged reclassification candidate');
    requireTrue(candidate && candidate.unit === mention.unit.id && candidate.language === row.language && candidate.startCodePoint <= row.span.startCodePoint && candidate.endCodePoint >= row.span.endCodePoint, 'Reclassification requires same-unit enclosing candidate span');
    const unit = packet.units.find(u => u.id === candidate.unit), text = unit?.[row.language === 'zh' ? 'zh' : 'en'];
    requireTrue(typeof text === 'string' && [...text].slice(candidate.startCodePoint, candidate.endCodePoint).join('') === candidate.exact, 'Candidate span/text mismatch');
    requireTrue(typeof row.sourceQuote === 'string' && row.sourceQuote.includes(candidate.exact) && text.includes(row.sourceQuote) && typeof row.reason === 'string' && row.reason.trim().length >= 20, 'Source-specific reclassification reasoning required');
    const oldDisposition = before.candidateDispositions.find(d => d.candidate === candidate.id), nextDisposition = after.candidateDispositions.find(d => d.candidate === candidate.id);
    same(row.beforeDisposition, oldDisposition, 'Forged/missing original non-person disposition');
    same(row.afterDisposition, nextDisposition, 'Forged/missing after non-person disposition');
    requireTrue(oldDisposition?.disposition === 'not-person' && oldDisposition.reason === 'title' && nextDisposition?.disposition === 'not-person' && nextDisposition.reason === 'title' && typeof nextDisposition.note === 'string' && nextDisposition.note.trim().length >= 20 && nextDisposition.note.includes(candidate.exact), 'Existing source-specific non-person/title disposition required');
    requireTrue(!mention.candidateRefs.some(ref => ref !== candidate.id), 'Removed mention has other candidate references');
    requireTrue(!after.mentions.some(m => m.unit.id === candidate.unit && m.spans[row.language].some(span => span.startCodePoint < candidate.endCodePoint && span.endCodePoint > candidate.startCodePoint)), 'Non-person candidate still overlaps a person mention');
    const occurrence = [mention.unit.id, row.language, row.span.exact, row.span.occurrence, row.span.startCodePoint, row.span.endCodePoint, row.span.unitTextHash], key = json(occurrence);
    requireTrue(!seen.has(key), 'Duplicate occurrence reclassification'); seen.add(key);
    const index = remaining.findIndex(item => json(item) === key);
    requireTrue(index >= 0, 'Reclassification occurrence missing'); remaining.splice(index, 1);
  }
  return remaining;
}
export function invalidateWholeDecisions(document, affected) {
  requireTrue(Array.isArray(document.decisions), 'Resolution document lacks decisions');
  const removed = document.decisions.filter(d => d.localPeople.some(id => affected.has(id)));
  return { document: { ...document, decisions: document.decisions.filter(d => !d.localPeople.some(id => affected.has(id))) }, removed };
}
export function guardOwnershipDelta(before, after, affected, expandedBefore, expandedAfter, { packet, reclassifications = [] } = {}) {
  const oldIds = new Set(before.people.map(p => p[0])), newIds = new Set(after.people.map(p => p[0]));
  requireTrue(newIds.size === after.people.length, 'Duplicate person IDs');
  for (const id of oldIds) requireTrue(newIds.has(id), `Existing person ID lost: ${id}`);
  for (const id of newIds) requireTrue(/^p\d{3,}$/.test(id), `Unsupported person ID: ${id}`);
  for (const id of affected) requireTrue(oldIds.has(id), `Affected person is not an existing ID: ${id}`);
  const targets = new Set([...affected, ...[...newIds].filter(id => !oldIds.has(id))]);
  const own = (rows, id) => rows.filter(r => r[0] === id);
  for (const p of before.people) {
    if (targets.has(p[0])) continue;
    const next = after.people.find(q => q[0] === p[0]);
    const withoutTargetHints = row => { const value = copy(row); value[4].r = value[4].r.filter(id => !targets.has(id)); return value; };
    same(withoutTargetHints(p), withoutTargetHints(next), `Unrelated person/identity hints changed: ${p[0]}`);
    same(own(before.surfaces, p[0]), own(after.surfaces, p[0]), `Unrelated surfaces changed: ${p[0]}`);
    const stable = rows => own(rows, p[0]).filter(c => !reference(c[2], targets));
    same(stable(before.claims), stable(after.claims), `Unrelated assertions changed: ${p[0]}`);
    for (const c of [...own(before.claims, p[0]), ...own(after.claims, p[0])].filter(c => reference(c[2], targets))) requireTrue(['relationship', 'family-relationship'].includes(c[1]), 'Only inbound relationships may change on unrelated people');
  }
  for (const row of reclassifications) requireTrue(targets.has(row.before?.value.person?.split(':').at(-1)), 'Reclassification person must be affected');
  same(ordered(reviewedNonPersonOccurrences(expandedBefore, expandedAfter, packet, reclassifications)), ordered(occurrences(expandedAfter)), 'Lost, added or duplicated source occurrences');
  const explained = new Set(reclassifications.map(row => row.candidate.id.split(':').at(-1)));
  const maskReviewedNotes = groups => groups.map(([disposition, reason, entries]) => [disposition, reason, entries.map(([id, note]) => [id, explained.has(id) ? '<reviewed-non-person-note>' : note])]);
  same(maskReviewedNotes(before.candidateDispositions), maskReviewedNotes(after.candidateDispositions), 'Candidate dispositions changed outside reviewed note');
  for (const field of ['schemaVersion', 'book', 'chapter', 'input', 'run', 'translationRepairs', 'coverage']) same(before[field], after[field], `Changed source/provenance/coverage: ${field}`);
  same(Object.keys(before).sort(), Object.keys(after).sort(), 'Unexpected extraction fields');
}

/** Produces a content-addressed staging plan only. Never writes canonical files. */
export async function prepareOwnershipPlan({ root, commit, book, chapter, candidateBytes, proposalBytes, reviewBytes, pins }) {
  requireTrue(/^[a-z][a-z0-9_-]*$/.test(book) && /^\d{3}$/.test(chapter), 'Invalid scope');
  for (const [role, bytes] of Object.entries({ candidate: candidateBytes, proposal: proposalBytes, review: reviewBytes })) same(hash(bytes), pins[`${role}Sha256`], `Stale ${role} pin`);
  const api = await baselineApi(root, commit);
  const parse = bytes => { api.d.parseCurationDriftJson(bytes.toString()); return JSON.parse(bytes.toString()); };
  const sourcePath = `data/${book}/${chapter}.json`, extractionPath = `data/people/extractions/${book}/${chapter}.json`;
  const sourceBytes = api.read(sourcePath), beforeBytes = api.read(extractionPath);
  same(hash(sourceBytes), pins.sourceSha256, 'Stale source pin'); same(hash(beforeBytes), pins.extractionSha256, 'Stale extraction pin');
  const before = parse(beforeBytes), candidate = parse(candidateBytes), proposal = parse(proposalBytes), review = parse(reviewBytes);
  const scope = { commit, book, chapter, sourceSha256: hash(sourceBytes), extractionSha256: hash(beforeBytes), candidateSha256: hash(candidateBytes) };
  same(proposal.input, scope, 'Proposal scope/pins mismatch'); same(review.input, { ...scope, proposalSha256: hash(proposalBytes) }, 'Review scope/pins mismatch');
  requireTrue(proposal.schemaVersion === 1 && review.schemaVersion === 1, 'Unsupported proposal/review schema');
  requireTrue(typeof proposal.authorId === 'string' && proposal.authorId.trim() === proposal.authorId && proposal.authorId.length > 0, 'Missing author');
  const extractors = [before.run, ...(before.run.chunks ?? [])].map(r => r.agentId).filter(Boolean);
  requireTrue(typeof review.reviewerId === 'string' && review.reviewerId.trim() === review.reviewerId && review.reviewerId.length > 0 && ![proposal.authorId, ...extractors].includes(review.reviewerId), 'Independent source reviewer required');
  requireTrue(review.status === 'approved' && Array.isArray(review.findings) && review.findings.length === 0 && Number.isFinite(Date.parse(review.reviewedAt)), 'Review not approved');
  const packet = api.p.buildPeopleExtractionPacket(book, chapter, { chapterData: parse(sourceBytes) });
  const expandedBefore = api.v.validateCompactPeopleExtraction(before, packet, { strictAliasDispositions: true }).normalized;
  const expandedAfter = api.v.validateCompactPeopleExtraction(candidate, packet, { strictAliasDispositions: true }).normalized;
  const editorialPath = `data/people/editorial-decisions/${book}/${chapter}.json`;
  if (api.files.includes(editorialPath)) api.e.validateAppliedEditorialDecisions(parse(api.read(editorialPath)), expandedAfter);
  requireTrue(Array.isArray(proposal.affectedPeople) && proposal.affectedPeople.length && new Set(proposal.affectedPeople).size === proposal.affectedPeople.length, 'Explicit existing affected IDs required');
  const reclassifications = proposal.mentionReclassifications ?? [];
  same(review.mentionReclassifications ?? [], reclassifications, 'Source review lacks exact mention reclassifications');
  guardOwnershipDelta(before, candidate, new Set(proposal.affectedPeople), expandedBefore, expandedAfter, { packet, reclassifications });
  const deltas = copy(api.d.computeCurationDrift(api.d.parseCurationDriftJson(json(before)), api.d.parseCurationDriftJson(json(candidate))));
  requireTrue(deltas.length > 0, 'Empty ownership repair');
  same(proposal.deltas, deltas, 'Unreviewed or inaccurate semantic delta'); same(review.deltas, deltas, 'Source review does not cover exact deltas');
  requireTrue(Array.isArray(review.deltaChecks) && review.deltaChecks.length === deltas.length, 'Every semantic delta requires source review');
  for (const [i, check] of review.deltaChecks.entries()) {
    same(check.delta, deltas[i], 'Delta source check mismatch');
    requireTrue(typeof check.reason === 'string' && check.reason.trim().length >= 20 && Array.isArray(check.units) && check.units.length > 0 && Array.isArray(check.quotes) && check.quotes.length === check.units.length, 'Substantive pinned delta evidence required');
    for (let j = 0; j < check.units.length; j++) requireTrue(typeof check.quotes[j] === 'string' && check.quotes[j].trim().length > 0 && packet.units.find(u => u.id === check.units[j])?.zh.includes(check.quotes[j]), 'Unsupported delta source quote');
  }
  const mappings = changedRecords(expandedBefore, expandedAfter);
  same(proposal.changedRecords, mappings, 'Incomplete semantic/locator mapping'); same(review.changedRecords, mappings, 'Source review lacks exact changed records');
  requireTrue(Array.isArray(proposal.lineage), 'Explicit ownership lineage required');
  same(review.lineage, proposal.lineage, 'Source review lacks exact ownership lineage');
  const seenBefore = [], seenAfter = [];
  for (const group of proposal.lineage) {
    requireTrue(['claim', 'mention'].includes(group.kind) && typeof group.reason === 'string' && group.reason.trim().length >= 20 && Array.isArray(group.before) && group.before.length > 0 && Array.isArray(group.after), 'Invalid ownership lineage group');
    const old = group.before.map(locator => mappings.before.find(r => r.locator === locator && r.kind === group.kind));
    const next = group.after.map(locator => mappings.after.find(r => r.locator === locator && r.kind === group.kind));
    requireTrue([...old, ...next].every(Boolean), 'Unknown lineage locator');
    if (group.kind === 'claim') {
      requireTrue(new Set([...old, ...next].map(r => r.value.predicate)).size === 1, 'Claim lineage must preserve predicate');
      const evidence = new Set(old.flatMap(r => r.value.evidence));
      requireTrue(next.every(r => r.value.evidence.every(unit => evidence.has(unit))), 'Lineage introduces unowned evidence');
    }
    seenBefore.push(...group.before); seenAfter.push(...group.after);
  }
  same([...seenBefore].sort(), mappings.before.map(r => r.locator).sort(), 'Every changed input needs exactly one lineage assignment');
  same([...seenAfter].sort(), mappings.after.map(r => r.locator).sort(), 'Every changed output needs exactly one lineage assignment');

  requireTrue(Array.isArray(review.evidenceChecks) && review.evidenceChecks.length === mappings.after.length, 'Review must check every changed output assertion/mention');
  for (const [i, check] of review.evidenceChecks.entries()) {
    const record = mappings.after[i]; same(check.record, record, 'Review evidence record mismatch');
    requireTrue(typeof check.reason === 'string' && check.reason.trim().length >= 20, 'Substantive source reasoning required');
    const units = record.kind === 'claim' ? record.value.evidence.map(id => id.split(':').at(-1)) : [record.value.unit];
    same(check.units, units, 'Evidence ownership check must cover exact assertion evidence');
    requireTrue(Array.isArray(check.quotes) && check.quotes.length === units.length, 'Every owned evidence unit needs a source quote');
    for (let j = 0; j < units.length; j++) {
      const unit = packet.units.find(u => u.id === units[j]);
      requireTrue(unit && typeof check.quotes[j] === 'string' && check.quotes[j].trim().length > 0 && unit.zh.includes(check.quotes[j]), 'Unsupported source quote');
    }
  }
  const affected = new Set(proposal.affectedPeople.map(id => `${book}:${chapter}:${id}`));
  const removedDecisions = [], changes = [{ path: extractionPath, beforeSha256: hash(beforeBytes), afterSha256: hash(candidateBytes), contentBase64: Buffer.from(candidateBytes).toString('base64') }];
  for (const file of api.resolutionFilesFor([...affected]).filter(f => f.endsWith('.json'))) {
    const bytes = api.read(file), document = parse(bytes), result = invalidateWholeDecisions(document, affected);
    if (!result.removed.length) continue;
    removedDecisions.push({ path: file, beforeSha256: hash(bytes), decisions: result.removed });
    const afterBytes = result.document.decisions.length ? Buffer.from(`${JSON.stringify(result.document, null, 2)}\n`) : null;
    changes.push({ path: file, beforeSha256: hash(bytes), afterSha256: afterBytes ? hash(afterBytes) : null, contentBase64: afterBytes?.toString('base64') ?? null });
  }
  const receipt = { schemaVersion: 1, kind: 'reviewed-ownership-staging-plan', input: scope, proposalSha256: hash(proposalBytes), reviewSha256: hash(reviewBytes), proposalBase64: Buffer.from(proposalBytes).toString('base64'), reviewBase64: Buffer.from(reviewBytes).toString('base64'), proposal, review, removedDecisions,
    status: 'extraction-ready-only', requires: ['fresh-date-approval', 'identity-resolution', 'host-staging-review', 'normal-publication-gates'], baselineInputs: api.inputPins([sourcePath, extractionPath, editorialPath, ...removedDecisions.map(x => x.path)]) };
  const receiptBytes = Buffer.from(json(receipt)), receiptSha256 = hash(receiptBytes);
  const receiptPath = `data/people/ownership-repairs/${book}/${chapter}/${receiptSha256.slice(7)}.json`;
  requireTrue(!api.files.includes(receiptPath), 'Review receipt path already exists in baseline');
  changes.push({ path: receiptPath, beforeSha256: null, afterSha256: receiptSha256, contentBase64: receiptBytes.toString('base64') });
  return { schemaVersion: 1, baselineCommit: commit, status: 'extraction-ready-only', changes, receipt, receiptSha256 };
}
