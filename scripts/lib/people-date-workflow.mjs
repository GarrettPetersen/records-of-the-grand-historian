import fs from 'node:fs';
import path from 'node:path';
import { PEOPLE_DIR, readJson, sha256, writeJsonAtomic, writeTextAtomic } from './people-content.mjs';
import { serializeCompactPeopleExtraction } from './people-compact.mjs';
import { buildDateAuditPacket, dateAuditItems, dateAuditStatus, recordDateAudit, validateDateAuditReport, dateAuditReferencesCurrent } from './people-date-audit.mjs';
import { personClaimReception, personReceptionErrors } from './people-reception.mjs';

export const DATE_WORKFLOW_VERSION = 1;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const hash = value => sha256(JSON.stringify(value));
const lifePredicates = new Set(['attestation', 'birth', 'death', 'age']);
const dateFields = new Set(['westernYear', 'westernInterval', 'westernBounds', 'sourceDate', 'dateContext', 'startDate', 'endDate', 'unresolved', 'unresolvedReason']);
const withoutDates = value => Array.isArray(value) ? value.map(withoutDates) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).filter(([key])=>!dateFields.has(key)).map(([key,v])=>[key,withoutDates(v)])) : value;
const isReceptionEvent = row => Array.isArray(row) && row.length === 5 && row[1] === 'event-participation'
  && Boolean(personClaimReception({ predicate: row[1], value: row[2] }))
  && personReceptionErrors({ predicate: row[1], value: row[2] }).length === 0;
const sameNonDateClaim = (before, after) => before[0] === after[0] && before[1] === after[1]
  && same(withoutDates(before[2]), withoutDates(after[2]));

export function dateWorkflowDirectory(book, chapter, peopleDir = PEOPLE_DIR) {
  return path.join(peopleDir, 'generated', 'date-workflow', book, chapter);
}

// Jobs own disjoint checks. All source units are read once for omissions; remote
// evidence and adjacent narrative remain read-only context for each owned check.
export function dateReviewJobs(packet, { maxUnits = 40, maxBytes = 48 * 1024 } = {}) {
  if (!Number.isInteger(maxUnits) || maxUnits < 1 || !Number.isInteger(maxBytes) || maxBytes < 1024) throw new Error('Invalid date chunk ceilings');
  const units = packet.units;
  const indices = new Map(units.map((u, i) => [u.id, i]));
  const personAnchor = new Map(packet.people.map(p => [p.id, packet.items.find(i => i.personId === p.id && i.evidence.length)?.evidence[0] ?? units.find(u=>packet.unitPeople?.[u.id]?.includes(p.id))?.id ?? units[0]?.id]));
  const itemAnchor = i => i.evidence[0] ?? personAnchor.get(i.personId);
  const make = (start, end) => {
    const owned = new Set(units.slice(start, end).map(u => u.id));
    const items = packet.items.filter(i => owned.has(itemAnchor(i)));
    const people = packet.people.filter(p => owned.has(personAnchor.get(p.id)));
    const ownedPeople = new Set(people.map(p=>p.id));
    const contextItems = packet.items.filter(i=>ownedPeople.has(i.personId) && !items.includes(i));
    const context = new Set(units.slice(Math.max(0, start - 3), Math.min(units.length, end + 3)).map(u => u.id));
    for (const item of [...items,...contextItems]) for (const id of item.evidence) context.add(id);
    // Include the closest preceding dated heading, without treating it as a
    // semantic date assignment. The reviewer must establish inheritance.
    for (let i = start - 1; i >= 0; i -= 1) if (/年|即位|受禪/.test(units[i].zh)) { context.add(units[i].id); break; }
    const identities = new Set([...items.map(i => i.personId), ...people.map(p => p.id)]);
    for(const id of context) for(const person of packet.unitPeople?.[id]??[])identities.add(person);
    const job = { schemaVersion: 1, workflowVersion: DATE_WORKFLOW_VERSION, book: packet.book, chapter: packet.chapter,
      sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, sourceUrl: packet.sourceUrl,
      ownedUnits: [...owned], ownedItems: items.map(i => i.id), ownedPeople: people.map(p => p.id),
      people: packet.people.filter(p => identities.has(p.id)), items, contextItems,
      unitPeople:Object.fromEntries([...context].map(id=>[id,packet.unitPeople?.[id]??[]])),
      units: [...context].sort((a,b) => indices.get(a)-indices.get(b)).map(id => {const {literal,...unit}=units[indices.get(id)];return unit;}) };
    job.id = hash(job).slice(7, 27);
    return job;
  };
  const jobs = [];
  const split = (start, end) => {
    const job = make(start, end);
    if (Buffer.byteLength(JSON.stringify(job)) <= maxBytes && end - start <= maxUnits) { jobs.push(job); return; }
    if (end - start === 1) throw new Error(`Date evidence at ${units[start].id} exceeds ${maxBytes} bytes; increase the explicit ceiling after inspecting this packet`);
    const middle = start + Math.floor((end-start)/2); split(start, middle); split(middle, end);
  };
  if (!units.length) throw new Error('Cannot audit an empty source chapter');
  split(0, units.length);
  for (const [field, expected] of [['ownedUnits', units.length], ['ownedItems', packet.items.length], ['ownedPeople', packet.people.length]]) {
    const ids = jobs.flatMap(j => j[field]);
    if (ids.length !== expected || new Set(ids).size !== expected) throw new Error(`Date job partition lost ${field}`);
  }
  return jobs;
}

export function retainedDateReviewJobs(packet,state,options={}) {
  const key=`${state.phase}-${state.round}`;
  state.reviewPlans??={};
  const prior=state.reviewPlans[key];
  const ceilings=prior??{maxUnits:options.maxUnits??40,maxBytes:options.maxBytes??48*1024};
  const jobs=dateReviewJobs(packet,ceilings),jobIds=jobs.map(job=>job.id);
  if(prior && !same(prior.jobIds,jobIds))throw new Error('Retained date ownership changed; reconcile protocol before restarting');
  const existing=Object.keys(state.jobs).filter(id=>id.startsWith(`${key}-`)).map(id=>id.slice(key.length+1));
  if(existing.some(id=>!jobIds.includes(id)))throw new Error('Current ceilings do not match retained date jobs; restore their original limits');
  state.reviewPlans[key]={maxUnits:ceilings.maxUnits,maxBytes:ceilings.maxBytes,jobIds};
  return {key,plan:state.reviewPlans[key],jobs};
}

export function validateDateJobResult(result, job, packet) {
  if (result.jobId !== job.id || result.sourceHash !== job.sourceHash || result.extractionHash !== job.extractionHash) throw new Error('Stale date job artifact');
  for (const [field, expected] of [['reviewedUnits',job.ownedUnits],['itemChecks',job.ownedItems],['personChecks',job.ownedPeople]]) {
    const actual = (result[field] ?? []).map(v => typeof v === 'string' ? v : v.id);
    if (!same([...actual].sort(), [...expected].sort())) throw new Error(`Job ${job.id} must cover exactly its ${field}`);
  }
  const report = { ...result, schemaVersion: 1, auditVersion: 1, book: packet.book, chapter: packet.chapter,
    status: result.findings?.length ? 'needs-revision' : 'audited' };
  // Validate a partition against its own owned IDs, with the full chapter's
  // source evidence available. Full coverage is enforced by assembly below.
  const scope = { ...packet, people: packet.people.filter(p => job.ownedPeople.includes(p.id)), items: packet.items.filter(i => job.ownedItems.includes(i.id)),
    units: packet.units };
  if (report.status === 'audited') report.reviewedUnits = packet.units.map(u => u.id);
  else scope.people = packet.people;
  if (report.status !== 'audited') scope.items = packet.items;
  validateDateAuditReport(report, scope);
  return result;
}

export function assembleDateReview(packet, jobs, results) {
  if (jobs.length !== results.length) throw new Error('Missing date review chunks');
  results.forEach((r,i) => validateDateJobResult(r, jobs[i], packet));
  const findings = results.flatMap(r => r.findings);
  const report = { schemaVersion: 1, auditVersion: 1, book: packet.book, chapter: packet.chapter,
    sourceHash: packet.sourceHash, extractionHash: packet.extractionHash,
    status: findings.length ? (results.some(r => [...r.itemChecks,...r.personChecks].some(c => c.verdict === 'incorrect')) ? 'needs-revision' : 'research-blocked') : 'audited',
    reviewer: { name: [...new Set(results.map(r=>r.reviewer.name))].join('; '), independentOfExtractor: true,
      workers: results.map(r=>r.reviewer) }, reviewedAt: new Date().toISOString(),
    summary: results.map(r => r.summary).join('\n'), reviewedUnits: results.flatMap(r=>r.reviewedUnits),
    itemChecks: results.flatMap(r=>r.itemChecks), personChecks: results.flatMap(r=>r.personChecks), findings,
    references: results.flatMap(r=>r.references) };
  validateDateAuditReport(report, packet);
  return report;
}

export function applyDateRepairProposal(stored, proposal, packet) {
  if (stored.schemaVersion !== 2) throw new Error('Date repair requires the current compact extraction format');
  if (proposal.sourceHash !== packet.sourceHash || proposal.extractionHash !== packet.extractionHash || hash(stored) !== packet.extractionHash) throw new Error('Stale date repair proposal');
  if (!Array.isArray(proposal.changes) || !proposal.changes.length) throw new Error('Repair must contain scoped changes');
  if (proposal.blocked || ['hostRequiredChanges', 'requiredReceptionEvents', 'requiredHostCuration'].some(key => proposal[key] !== undefined)) throw new Error('Incomplete repair: resolve required host work inside supported changes before staging');
  const candidate = structuredClone(stored);
  const seen = new Set();
  const temporal = new Set(dateAuditItems(stored).items.filter(i=>i.claimIndex !== undefined).map(i=>i.id));
  const removed = new Set();
  for (const change of proposal.changes) {
    if (typeof change.reason !== 'string' || change.reason.trim().length < 20) throw new Error('Repair requires source-based reasoning');
    if (change.kind === 'hints') {
      const key = `hints-${change.personId}`;
      if (seen.has(key)) throw new Error('Duplicate date repair target'); seen.add(key);
      const person = candidate.people.find(p => p[0] === change.personId);
      // A person mentioned solely in a dated retrospective or posthumous event
      // must not retain invented life-date hints just to satisfy the ordinary
      // extraction invariant. The separately classified reception record is
      // still required, so an empty hint list cannot hide an ordinary person.
      const receptionOnly = change.after?.length === 0 && candidate.claims.some(claim => claim[0] === change.personId && isReceptionEvent(claim));
      if (!person || !Array.isArray(change.after) || (!change.after.length && !receptionOnly) || change.after.some(s=>typeof s !== 'string' || !s.trim()) || !same(person[4]?.a ?? [], change.before)) throw new Error('Invalid or stale active-hint repair');
      person[4] = { ...person[4], a: change.after };
    } else if (change.kind === 'replace' || change.kind === 'remove' || change.kind === 'date-context') {
      if (!/^claim-[1-9]\d*$/.test(change.id) || seen.has(change.id)) throw new Error('Repair must target a unique temporal claim');
      const index = Number(change.id.slice(6))-1;
      if (change.kind !== 'date-context' && !temporal.has(change.id)) throw new Error('Repair must target a unique temporal claim');
      if (change.kind === 'date-context' && (!stored.claims[index] || lifePredicates.has(stored.claims[index][1]))) throw new Error('Date-context repair requires an existing non-life claim');
      seen.add(change.id);
      if (!same(stored.claims[index], change.before)) throw new Error('Date repair before-value mismatch');
      if (change.kind === 'remove') {
        removed.add(index);
      }
      else {
        if (!Array.isArray(change.after) || change.after.length !== 5 || change.after[0] !== change.before[0] || change.after[1] !== change.before[1]) throw new Error('Date repair cannot change a claim subject or predicate');
        if (!lifePredicates.has(change.before[1]) && !same(withoutDates(change.before[2]),withoutDates(change.after[2]))) throw new Error('Date repair altered non-temporal event fields');
        if (change.kind === 'date-context' && !dateAuditItems({ ...stored, claims: [change.after] }).items.some(item=>item.claimIndex===0)) throw new Error('Date-context repair must supply auditable chronology');
        candidate.claims[index] = change.after;
      }
    } else if (change.kind === 'add' || change.kind === 'add-reception-event') {
      const validKind = change.kind === 'add-reception-event' ? isReceptionEvent(change.after)
        : Array.isArray(change.after) && change.after.length === 5 && lifePredicates.has(change.after[1]);
      if (!validKind || !stored.people.some(p=>p[0]===change.after[0])) throw new Error('Only life/date claims or explicitly classified reception events for existing people may be added');
      if (!Array.isArray(change.after[4]) || !change.after[4].length || change.after[4].some(id=>!packet.units.some(unit=>unit.id===id))) throw new Error('Added claim requires known source-unit evidence');
      if (candidate.claims.some(c=>same(c,change.after))) throw new Error('Duplicate date claim addition');
      candidate.claims.push(change.after);
    } else throw new Error('Unknown date repair operation');
  }
  candidate.claims = candidate.claims.filter((c,i)=>!removed.has(i));
  if (same(candidate, stored)) throw new Error('Date repair has no changes');
  return candidate;
}

// The source extraction is replaced only after independent approval. A durable
// receipt precedes the replacement so a crash between files can be recovered.
export function publishDateRepair({ proposal, candidate, report, rounds = [], priorReviews = [] }, options = {}) {
  const peopleDir = options.peopleDir ?? PEOPLE_DIR;
  const { book, chapter } = report;
  const currentPacket = buildDateAuditPacket(book, chapter, options);
  const file = path.join(peopleDir, 'extractions', book, `${chapter}.json`);
  const current = readJson(file);
  const repairedPacket = buildDateAuditPacket(book, chapter, { ...options, extraction: candidate });
  validateDateAuditReport(report, repairedPacket);
  if (report.status !== 'audited' || !dateAuditReferencesCurrent(report, options)) throw new Error('Repair requires current independent date approval');
  if (currentPacket.extractionHash !== repairedPacket.extractionHash) {
    const expected = applyDateRepairProposal(current, proposal, currentPacket);
    if (!same(expected, candidate)) throw new Error('Candidate differs from scoped repair');
    if (typeof options.validateExtraction !== 'function') throw new Error('Publishing requires the production extraction validator');
    options.validateExtraction(candidate);
    const serialized=serializeCompactPeopleExtraction(candidate);
    if(hash(JSON.parse(serialized))!==repairedPacket.extractionHash)throw new Error('Compact serialization changed the reviewed extraction');
    writeJsonAtomic(path.join(peopleDir, 'date-repairs', book, chapter, `${repairedPacket.extractionHash.slice(7)}.json`), { schemaVersion: 1, proposal, rounds, priorReviews, candidateHash: repairedPacket.extractionHash, report });
    writeTextAtomic(file, serialized);
  } else {
    const receipt = path.join(peopleDir, 'date-repairs', book, chapter, `${repairedPacket.extractionHash.slice(7)}.json`);
    if (!fs.existsSync(receipt) || !same(readJson(receipt).proposal, proposal) || !same(readJson(receipt).report,report)) throw new Error('No matching repair receipt for recovery');
  }
  return recordDateAudit(report, options);
}

export async function runDateWorkflow({ book, chapter }, worker, options = {}) {
  if(typeof options.validateExtraction!=='function')throw new Error('Date workflow requires a production validator before worker execution');
  options.validateExtraction(readJson(path.join(options.peopleDir??PEOPLE_DIR,'extractions',book,`${chapter}.json`)));
  const directory = dateWorkflowDirectory(book, chapter, options.peopleDir);
  const stateFile = path.join(directory, 'state.json');
  const packet = buildDateAuditPacket(book, chapter, options);
  let state = fs.existsSync(stateFile) ? readJson(stateFile) : { schemaVersion: 1, workflowVersion: DATE_WORKFLOW_VERSION,
    sourceHash: packet.sourceHash, extractionHash: packet.extractionHash, round: 0, phase: 'audit', jobs: {} };
  const save = () => writeJsonAtomic(stateFile, state);
  if (state.workflowVersion !== DATE_WORKFLOW_VERSION) throw new Error('Date workflow protocol changed; reconcile retained work before restarting');
  const priorReport = path.join(options.peopleDir ?? PEOPLE_DIR, 'date-audits', book, `${chapter}.json`);
  if ((!fs.existsSync(stateFile)||state.restoredFromLedger) && state.phase==='audit' && state.round===0 && fs.existsSync(priorReport) && ['needs-revision','research-blocked'].includes(dateAuditStatus(book,chapter,options).status)) {
    const report = readJson(priorReport);
    validateDateAuditReport(report,packet);
    writeJsonAtomic(path.join(directory,'review-0.json'),report);
    state.review='review-0.json';state.phase='repair';save();
  }
  if(state.restoredFromLedger){delete state.restoredFromLedger;save();}
  if (state.phase === 'complete') {
    const current=dateAuditStatus(book,chapter,options);
    if(current.status==='audited')return current;
    fs.renameSync(directory,`${directory}.completed-${hash(state).slice(7,27)}`);
    state={schemaVersion:1,workflowVersion:DATE_WORKFLOW_VERSION,sourceHash:packet.sourceHash,extractionHash:packet.extractionHash,round:0,phase:'audit',jobs:{}};
    save();
  }
  const perform = async (task, validate) => {
    for (let attempt=0;attempt<(options.maxAttempts ?? 3);attempt++) {
      const result=await worker({...task,state:state.jobs[task.key]??{},save:patch=>{state.jobs[task.key]={...state.jobs[task.key],...patch};save();}});
      try { validate(result); return result; }
      catch(error) {
        writeJsonAtomic(path.join(directory,`rejected-${task.key}-${hash(result).slice(7)}.json`),result);
        state.jobs[task.key]={...state.jobs[task.key],validationError:error.message,status:'rejected'};save();
        if(attempt+1 >= (options.maxAttempts??3))throw error;
      }
    }
    throw new Error('No date validation attempts configured');
  };
  if (state.phase === 'publish') {
    const result = publishDateRepair(readJson(path.join(directory, 'publication.json')), options);
    state.phase = 'complete'; save(); return result;
  }
  if (packet.sourceHash !== state.sourceHash || packet.extractionHash !== state.extractionHash) {
    if (state.phase === 'complete') return { status: 'stale' };
    throw new Error('Source or extraction changed during date work; retain artifacts and reconcile before resuming');
  }
  if (state.phase === 'complete') return { status: 'audited' };
  const original = readJson(path.join(options.peopleDir ?? PEOPLE_DIR, 'extractions', book, `${chapter}.json`));
  for (; state.round <= (options.maxRounds ?? 3);) {
    let active = state.candidate ? buildDateAuditPacket(book, chapter, { ...options, extraction: readJson(path.join(directory, state.candidate)) }) : packet;
    if (state.phase === 'audit' || state.phase === 'reaudit') {
      const {key:planKey,plan,jobs} = retainedDateReviewJobs(active,state,options);
      save();
      if(options.saveReviewPlan)await options.saveReviewPlan(planKey,plan);
      const results = [];
      for (const job of jobs) {
        const key = `${state.phase}-${state.round}-${job.id}`;
        const artifact = path.join(directory, `${key}.json`);
        if (!fs.existsSync(artifact)) {
          const result = await perform({ kind: 'review', key, job, packet: active, directory, maxWorkerBytes:plan.maxBytes+8192 },r=>validateDateJobResult(r,job,active));
          validateDateJobResult(result, job, active); writeJsonAtomic(artifact, result);
        }
        const result = readJson(artifact); validateDateJobResult(result, job, active); results.push(result);
      }
      const report = assembleDateReview(active, jobs, results);
      writeJsonAtomic(path.join(directory, `review-${state.round}.json`), report);
      state.review = `review-${state.round}.json`;
      if (report.status === 'audited') {
        const rounds=fs.readdirSync(directory).filter(name=>/^repair-\d+-[a-f0-9]+\.json$/.test(name)).sort().map(name=>readJson(path.join(directory,name)));
        const repairAgents=new Set(Object.entries(state.jobs).filter(([key])=>key.startsWith('repair-')).map(([,job])=>job.agentId).filter(Boolean));
        for(const proposal of rounds)if(proposal.author?.agentId)repairAgents.add(proposal.author.agentId);
        if(report.reviewer.workers.some(w=>w.agentId && repairAgents.has(w.agentId)))throw new Error('A repair conversation cannot approve its own candidate');
        if (!state.candidate) { recordDateAudit(report, options); state.phase = 'complete'; save(); return report; }
        const publication = { proposal: readJson(path.join(directory, 'combined-proposal.json')), candidate: readJson(path.join(directory, state.candidate)), report,
          rounds,priorReviews:fs.readdirSync(directory).filter(name=>/^review-\d+\.json$/.test(name)).sort().map(name=>readJson(path.join(directory,name))).filter(r=>r.status!=='audited') };
        writeJsonAtomic(path.join(directory, 'publication.json'), publication); state.phase = 'publish'; save();
        const result = publishDateRepair(publication, options); state.phase = 'complete'; save(); return result;
      }
      if (!state.candidate) recordDateAudit(report, options);
      state.phase = 'repair'; save();
    }
    if (state.round >= (options.maxRounds ?? 3)) return { status: 'needs-revision', reason: 'Repair-round ceiling reached; resume with a larger explicit ceiling after reviewing failures' };
    const key = `repair-${state.round}-${active.extractionHash.slice(7,27)}`;
    const artifact = path.join(directory, `${key}.json`);
    if (!fs.existsSync(artifact)) {
      const result = await perform({ kind: 'repair', key, packet: active, extraction: state.candidate ? readJson(path.join(directory,state.candidate)) : original,
        report: readJson(path.join(directory,state.review)), directory },r=>{
          if(r.blocked){if(typeof r.reason!=='string'||r.reason.trim().length<20)throw new Error('Research blocker needs a substantive reason');return;}
          const staged=applyDateRepairProposal(state.candidate?readJson(path.join(directory,state.candidate)):original,r,active);
          options.validateExtraction(staged);
        });
      if (result.blocked) { writeJsonAtomic(path.join(directory, 'research-blocker.json'), result); return { status: 'research-blocked', reason: result.reason }; }
      writeJsonAtomic(artifact, result);
    }
    const proposal = readJson(artifact);
    if(proposal.author?.agentId) { state.jobs[key]={...state.jobs[key],agentId:proposal.author.agentId};save(); }
    let candidate = applyDateRepairProposal(state.candidate ? readJson(path.join(directory,state.candidate)) : original, proposal, active);
    if (typeof options.validateExtraction !== 'function') throw new Error('Date workflow requires a production validator');
    options.validateExtraction(candidate);
    // Collapse multiple repair rounds into a single original-to-final scoped
    // proposal; stable original indices prevent drift after removals.
    const combined = dateRepairDifference(original, candidate, packet);
    candidate = applyDateRepairProposal(original, combined, packet);
    options.validateExtraction(candidate);
    writeJsonAtomic(path.join(directory, 'combined-proposal.json'), combined);
    state.round += 1; state.candidate = `candidate-${state.round}.json`;
    writeJsonAtomic(path.join(directory, state.candidate), candidate);
    state.phase = 'reaudit'; save();
  }
  throw new Error('Unreachable date workflow state');
}

export function dateRepairDifference(before, after, packet) {
  const changes = [];
  const remaining = [...after.claims];
  const temporalItems = dateAuditItems(before).items.filter(i=>i.claimIndex !== undefined);
  const temporalIndices = new Set(temporalItems.map(i=>i.claimIndex));
  for (const item of temporalItems) {
    const claim = before.claims[item.claimIndex];
    const match = remaining.findIndex(c=>same(c,claim));
    if (match >= 0) { remaining.splice(match,1); continue; }
    changes.push({ kind: 'remove', id: item.id, before: claim, reason: 'Superseded by independently re-audited chronology in the retained repair rounds.' });
  }
  for (const [index, claim] of before.claims.entries()) {
    if (temporalIndices.has(index)) continue;
    const match = remaining.findIndex(c=>same(c,claim));
    if (match >= 0) { remaining.splice(match,1); continue; }
    const dated = remaining.findIndex(c=>sameNonDateClaim(claim,c));
    if (dated < 0) throw new Error('Date repair altered a non-temporal claim');
    changes.push({kind:'date-context',id:`claim-${index+1}`,before:claim,after:remaining.splice(dated,1)[0],
      reason:'Attach independently reviewed chronology without changing the existing claim identity or non-date content.'});
  }
  // Replacements of dated non-life events must stay replacements, not additions.
  for (const claim of remaining) {
    const removed = changes.find(c=>c.kind==='remove' && c.before[0]===claim[0] && c.before[1]===claim[1]
      && (lifePredicates.has(claim[1]) || same(withoutDates(c.before[2]),withoutDates(claim[2]))));
    if (removed) { removed.kind = 'replace'; removed.after = claim; }
    else changes.push({ kind:isReceptionEvent(claim)?'add-reception-event':'add', after:claim, reason:'Added source-backed chronology or separate later reception after independent re-audit.' });
  }
  for (const p of before.people) {
    const updated = after.people.find(q=>q[0]===p[0]);
    if (!updated) throw new Error('Date repair removed a person');
    if (!same(p[4]?.a,updated[4]?.a)) changes.push({ kind:'hints', personId:p[0], before:p[4]?.a??[], after:updated[4]?.a??[], reason:'Synchronize active hints with independently reviewed personal chronology.' });
  }
  const proposal = { sourceHash:packet.sourceHash, extractionHash:packet.extractionHash, changes };
  // Preserve order: applying a collapsed proposal can move added claims. The
  // candidate that is subsequently reviewed must be this exact reconstructed form.
  return proposal;
}

// A researcher may amend a staged proposal before its independent review starts.
// Retain both rounds; never replace artifacts already owned by a reviewer.
export function revisePendingDateRepair({book,chapter},proposal,options={}) {
  const directory=dateWorkflowDirectory(book,chapter,options.peopleDir),stateFile=path.join(directory,'state.json');
  const state=readJson(stateFile),prefix=`reaudit-${state.round}-`;
  if(state.phase!=='reaudit' || Object.keys(state.jobs).some(key=>key.startsWith(prefix)) || fs.readdirSync(directory).some(name=>name.startsWith(prefix)))throw new Error('Cannot amend a candidate after independent review has started');
  const original=readJson(path.join(options.peopleDir??PEOPLE_DIR,'extractions',book,`${chapter}.json`));
  const originalPacket=buildDateAuditPacket(book,chapter,options);
  if(originalPacket.sourceHash!==state.sourceHash||originalPacket.extractionHash!==state.extractionHash)throw new Error('Stale pending date revision');
  const active=readJson(path.join(directory,state.candidate));
  const activePacket=buildDateAuditPacket(book,chapter,{...options,extraction:active});
  let candidate=applyDateRepairProposal(active,proposal,activePacket);
  const combined=dateRepairDifference(original,candidate,originalPacket);
  candidate=applyDateRepairProposal(original,combined,originalPacket);
  if(typeof options.validateExtraction!=='function')throw new Error('Pending date revision requires production validation');
  options.validateExtraction(candidate);
  const key=`repair-${state.round}-${activePacket.extractionHash.slice(7,27)}`;
  writeJsonAtomic(path.join(directory,`${key}.json`),proposal);
  state.jobs[key]={agentId:proposal.author?.agentId??null};
  writeJsonAtomic(path.join(directory,'combined-proposal.json'),combined);
  state.round+=1;state.candidate=`candidate-${state.round}.json`;
  writeJsonAtomic(path.join(directory,state.candidate),candidate);writeJsonAtomic(stateFile,state);
  return buildDateAuditPacket(book,chapter,{...options,extraction:candidate});
}
