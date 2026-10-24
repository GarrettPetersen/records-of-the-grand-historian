import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Agent } from '@cursor/sdk';
import { REPO_ROOT, writeJsonAtomic, readJson } from './people-content.mjs';
import { sendCursorAgentWhenReady, waitForCursorRun } from './cursor-run-wait.mjs';
import { requestCursorUsageLimitStop } from './cursor-run-control.mjs';
import { runOpenRouterDateTools } from './openrouter-date-tools.mjs';

const prompt = fs.readFileSync(path.join(REPO_ROOT, 'prompt-people-date-review.txt'),'utf8');

function repairReferences(references, people) {
  // The audit report's bibliography belongs to the whole chapter.  Repeating
  // all of it for each sealed finding can crowd out the actual source packet.
  // Keep every citation which names a Chinese term in this finding's source
  // context.  Small reports remain whole, so no evidence is needlessly split.
  if (references.length <= 16) return references;
  const terms = new Set(people.flatMap(person => JSON.stringify(person).match(/[\u3400-\u9fff]{2,}/g) ?? []));
  return references.filter(reference => {
    const text = JSON.stringify(reference);
    return [...terms].some(term => text.includes(term));
  });
}

export function dateWorkerInput(task) {
  if (task.kind === 'review') return { instructions: prompt, phase: 'independent-review', ...task.job };
  if (task.kind !== 'repair') throw new Error(`Unknown date worker phase: ${task.kind}`);
  // Repairs are intentionally submitted in small, independently resumable
  // finding groups.  A whole review report can contain every temporal claim in
  // a long chapter; sending that report with each repair both duplicates source
  // context and can exceed the sealed packet ceiling.  The orchestrator owns
  // the complete report and supplies the exact group this task must resolve.
  const findings = task.findings ?? task.report.findings;
  if (!Array.isArray(findings) || findings.length === 0) throw new Error('Date repair requires at least one assigned finding');
  const relevant = new Set(findings.flatMap(f=>f.items));
  // Finding IDs belong to the packet which the independent reviewer saw.
  // Earlier valid removals can renumber the candidate claim array, so never
  // use a current packet's claim-N label to infer the finding's person or
  // evidence. The current packet still supplies the only legal repair IDs.
  const baselinePacket = task.baselinePacket ?? task.packet;
  const baselineItems = baselinePacket.items ?? [];
  const affectedPeople = new Set(baselinePacket.people.filter(p=>relevant.has(p.id)).map(p=>p.id));
  for (const item of baselineItems) if (relevant.has(item.id)) affectedPeople.add(item.personId);
  // The raw-row fallback is only for a deliberately supplied finding label
  // absent from the reviewer packet. Use the round's sealed baseline, never
  // the mutable candidate extraction whose rows may already have shifted.
  const baselineExtraction = task.baselineExtraction ?? task.extraction;
  for (const id of relevant) {
    if (!/^claim-[1-9]\d*$/.test(id)) continue;
    const row = baselineExtraction.claims[Number(id.slice(6)) - 1];
    if (Array.isArray(row) && typeof row[0] === 'string') affectedPeople.add(row[0]);
  }
  // A repair must reconcile the person's whole chronology, including hints,
  // without pulling in every other person's claims from the chapter.
  const items = task.packet.items.filter(i=>affectedPeople.has(i.personId));
  // Keep the full affected-person claim chronology below, but attach source
  // text only for the finding's stated targets.  Including the evidence for
  // every other date claim of a frequently mentioned ruler duplicates an
  // entire chapter into one repair packet and makes an otherwise focused
  // correction impossible to review within the hard ceiling.
  const targetedItems = new Set([...relevant].filter(id => !id.startsWith('hints-') && !/^p\d+$/u.test(id)));
  const targetedPeople = new Set([...relevant]
    .filter(id => id.startsWith('hints-'))
    .map(id => id.slice(6)));
  for (const id of relevant) if (/^p\d+$/u.test(id)) targetedPeople.add(id);
  // Bibliography is support for the finding itself, not for every person whose
  // chronology happens to be adjacent to an affected claim.  A dense ruler
  // packet can otherwise pull in a chapter-scale reference list solely because
  // its full chronology is retained below.  Keep that chronology, but scope
  // supplementary references to the explicitly targeted people.
  const referencePeople = new Set(targetedPeople);
  const unitIds = new Set(baselineItems
    .filter(item => affectedPeople.has(item.personId))
    .flatMap(item => item.evidence));
  for (const check of [...task.report.itemChecks, ...task.report.personChecks]) {
    if (targetedItems.has(check.id) || affectedPeople.has(check.id) || baselineItems.some(item=>item.id===check.id && affectedPeople.has(item.personId))) {
      for (const evidence of check.evidence) unitIds.add(evidence.unit);
    }
  }
  const selected = new Set();
  // The sealed claim rows and cited units carry the evidence; keep precisely
  // those units so broad findings remain within the hard packet ceiling.
  for (let i=0;i<task.packet.units.length;i++) if (unitIds.has(task.packet.units[i].id)) selected.add(i);
  const selectedUnits=[...selected].sort((a,b)=>a-b).map(i=>task.packet.units[i]);
  // Claim rows below preserve the affected people's complete chronology. Keep
  // the item list as an index into those rows rather than serializing every
  // claim value twice; large biographies otherwise exceed the packet limit
  // solely through redundant JSON, not through additional evidence.
  const repairItems=items.map(item=>item.claimIndex === undefined ? item : {
    id:item.id, personId:item.personId, claimIndex:item.claimIndex, evidence:item.evidence,
  });
  return { instructions: prompt, phase: 'repair-proposal', sourceHash:task.packet.sourceHash, extractionHash:task.packet.extractionHash,
    book: task.packet.book, chapter:task.packet.chapter, sourceUrl:task.packet.sourceUrl,
    repairContract: 'A finding label is a coverage indicator, not necessarily a claim-row ID: target only IDs actually present in claims. For attestation, birth, death, or age rows, chronology changes MUST use kind "replace" with before copied verbatim from claims[id] and a complete after claim row; never use date-context. Claim certainty is exactly one of "explicit", "explicit-event-contextual-date", "strongly-inferred", "uncertain", "derived", or "textual-variant"; never write informal labels such as "inferred" or "contextual". For an explicitly undated source attestation, set undatedSourceAttestation:true directly on that complete after claim value—never use an invented undated field. Its event MUST be one source-specific English string of at least 20 characters (not an object), and it may carry no sourceDate, western date, unresolved field, or other temporal field. For any other row, replace or remove also copy before verbatim from claims[id]. date-context is permitted only for non-life rows: before must be exactly claims[id][2].dateContext (or null) and after must be only the replacement dateContext object. Copy any existing non-temporal dateContext fields, including event, verbatim into after; only sourceDate, westernYear, westernInterval, westernBounds, unresolved, and unresolvedReason may be added, removed, or changed. Put research explanation in reason, never in custom keys such as competingSourceDate, westernCalendar, or conversionEvidence. An add-reception-event MUST be an event-participation row with a nonempty kind such as retrospective-reference. If it supplies receptionType, its value must literally be "retrospective"; "posthumous" is not a valid receptionType. Include any role/action supported by the source. A westernInterval is exactly {start:{era:"AD"|"BC",year:positive integer,precision:"year"|"month"|"day"},end:{era:"AD"|"BC",year:positive integer,precision:"year"|"month"|"day"}}; use no westernYear or westernBounds alongside it. Every western bound is {era:"AD"|"BC",year:positive integer,precision:"year"|"month"|"day"}; never use an ad field. Non-legendary people with active-date hints require a matching AD/BC hint and a Western attestation unless the sealed source is genuinely undated. The host preserves every non-date claim field; never send a full claim row for date-context.',
    findings, references:repairReferences(task.report.references,task.packet.people.filter(p=>referencePeople.has(p.id))).map(reference=>
      Object.fromEntries(Object.entries(reference).filter(([key,value])=>['kind','url','title','quote','reason'].includes(key) && value !== undefined))),
    people:task.packet.people.filter(p=>affectedPeople.has(p.id)), items:repairItems,
    claims:Object.fromEntries(items.filter(i=>i.claimIndex !== undefined).map(i=>[i.id,task.extraction.claims[i.claimIndex]])),
    units:selectedUnits };
}

class DateArtifactValidationError extends Error {
  constructor(message, artifactHash, cause) {
    super(message, { cause });
    this.name = 'DateArtifactValidationError';
    this.artifactHash = artifactHash;
  }
}

function preserveDateBytes(directory, prefix, bytes) {
  const digest = createHash('sha256').update(bytes).digest('hex');
  const file = path.join(directory, `${prefix}-${digest}.json`);
  const temporaryDirectory = fs.mkdtempSync(path.join(directory, '.date-evidence-'));
  const temporary = path.join(temporaryDirectory, 'artifact');
  try {
    const descriptor = fs.openSync(temporary, 'wx', 0o600);
    try { fs.writeFileSync(descriptor, bytes); fs.fsyncSync(descriptor); }
    finally { fs.closeSync(descriptor); }
    try { fs.linkSync(temporary, file); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    if (!fs.readFileSync(file).equals(bytes)) throw new Error(`Conflicting immutable date evidence: ${file}`);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    fs.rmdirSync(temporaryDirectory);
  }
  return digest;
}

function validateResearchSupplement(task, blockerFile) {
  const supplement = task.researchSupplement;
  if (!supplement || typeof supplement !== 'object' || Array.isArray(supplement) || supplement.schemaVersion !== 1 ||
      typeof supplement.evidence !== 'string' || !supplement.evidence.trim()) throw new Error('A valid research supplement is required for this blocked repair');
  const blockerHash = typeof supplement.blockerHash === 'string' && supplement.blockerHash.startsWith('sha256:') ? supplement.blockerHash.slice(7) : '';
  if (blockerHash !== task.state.researchBlockerHash && blockerHash !== task.state.artifactHash) throw new Error('Research supplement blockerHash does not match the retained repair');
  for (const [field, expected] of Object.entries({ book: task.packet.book, chapter: task.packet.chapter,
    jobKey: task.key, sourceHash: task.packet.sourceHash, extractionHash: task.packet.extractionHash,
    originalSourceHash: task.workflowSourceHash, originalExtractionHash: task.workflowExtractionHash,
    blockerHash: `sha256:${blockerHash}` })) {
    if (typeof expected !== 'string' || !expected || supplement[field] !== expected) throw new Error(`Research supplement ${field} does not match the retained repair`);
  }
  if (!/^[a-f0-9]{64}$/.test(blockerHash ?? '')) throw new Error('Retained blocker has no valid artifact hash');
  if (!task.state.agentId || !task.state.sent) throw new Error('Research supplement requires the retained repair conversation');
  const legacy = blockerFile && fs.existsSync(blockerFile) ? fs.readFileSync(blockerFile) : null;
  const archived = path.join(task.directory, `raw-research-blocker-${blockerHash}.json`);
  const evidence = legacy && createHash('sha256').update(legacy).digest('hex') === blockerHash
    ? legacy : fs.existsSync(archived) ? fs.readFileSync(archived) : null;
  if (!evidence || createHash('sha256').update(evidence).digest('hex') !== blockerHash) throw new Error('Retained blocker bytes do not match its artifact hash');
  let blocker;
  try { blocker = JSON.parse(evidence.toString('utf8')); } catch { throw new Error('Retained blocker bytes are not JSON'); }
  if (blocker?.blocked !== true) throw new Error('Research supplement must bind an actual blocked artifact');
  const suppliedHash = createHash('sha256').update(JSON.stringify(supplement)).digest('hex');
  if (task.state.researchBlockerHash === blockerHash && task.state.researchSupplementHash && task.state.researchSupplementHash !== suppliedHash) throw new Error('Research supplement changed for the retained blocker');
  preserveDateBytes(task.directory, 'raw-research-blocker', evidence);
  return supplement;
}

export function cursorDateWorker(options, control, {
  Agent: agentClient = Agent,
  send = sendCursorAgentWhenReady,
  wait: waitRun = waitForCursorRun,
} = {}) {
  const runTask = async task => {
    const output = `date-${task.key}.json`;
    const save = async patch => {
      await task.save(patch);
      Object.assign(task.state, patch);
      await options.saveRemoteJob(task.key, { ...task.state });
    };
    const assertLaunchAllowed = () => {
      if (options.recoverOnly) throw new Error('Artifact-only recovery cannot start or continue a model turn');
      if (control.stopRequested) throw new Error('Date worker launch stopped; saved work is resumable');
    };
    let agent;
    let priorRunIds = new Set();
    let delegatedRetry = false;
    let usageSaved = false;
    const wait = async run => {
      control.activeRuns?.set(run.id, {
        run, agentId: agent.agentId, label: task.key,
        cancel: () => typeof run.supports === 'function' && run.supports('cancel')
          ? run.cancel()
          : agentClient.cancelRun(run.id, { runtime: 'cloud', agentId: agent.agentId, apiKey: options.apiKey }),
      });
      try {
        const result = await waitRun(run, { agentId:agent.agentId, apiKey:options.apiKey, label:task.key,
          pollMs:15000, timeoutMs:options.timeoutMs, maxRawCostCents:options.maxRunCostCents, maxTotalTokens:options.maxRunTokens });
        requestCursorUsageLimitStop(control, result.error);
        return result;
      } finally {
        control.activeRuns?.delete(run.id);
      }
    };
    const download = async () => {
      const artifacts = await agent.listArtifacts();
      const found = artifacts.find(a=>a.path===output || a.path.endsWith(`/${output}`));
      if (!found) return null;
      const bytes = await agent.downloadArtifact(found.path);
      const artifactHash = createHash('sha256').update(bytes).digest('hex');
      let artifact;
      try {
        artifact = JSON.parse(bytes.toString('utf8'));
        if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) throw new Error('Expected a JSON object');
      } catch (error) {
        throw new DateArtifactValidationError(`Invalid date artifact ${output}: ${error.message}`, artifactHash, error);
      }
      if (task.kind === 'repair' && task.directory) {
        preserveDateBytes(task.directory, 'raw-repair-artifact', bytes);
        if (artifact.blocked) preserveDateBytes(task.directory, 'raw-research-blocker', bytes);
      }
      return { artifact, artifactHash };
    };
    const returned = async ({ artifact, artifactHash }) => {
      await save({ status: 'returned', validationError: null, lastError: null, artifactHash });
      if (task.kind === 'review') artifact.reviewer = {
        name: task.state.model ?? options.model, agentId: agent.agentId, independentOfExtractor: true,
      };
      return artifact;
    };
    const usageCheckpoint = async () => {
      const agentId = agent?.agentId ?? task.state.agentId ?? null;
      const runId = task.state.runId ?? null;
      const metadata = { agentId, runId, recordedAt: new Date().toISOString() };
      try {
        if (!agentId) throw new Error('No retained agent available for usage lookup');
        const data = await agentClient.getUsage(agentId, { apiKey: options.apiKey, ...(runId ? { runId } : {}) });
        if (data == null) throw new Error('Usage lookup returned no telemetry');
        return { ...metadata, status: 'available', data };
      } catch (error) {
        requestCursorUsageLimitStop(control, error);
        return { ...metadata, status: 'unavailable', error: String(error.message ?? error) };
      }
    };
    try {
      const blockerFile = task.kind === 'repair' && typeof task.directory === 'string'
        ? path.join(task.directory, 'research-blocker.json') : null;
      if (task.kind === 'repair' && task.state.researchSupplementHash && !task.researchSupplement) throw new Error('Retained research continuation requires its original research supplement for recovery');
      const supplement = task.researchSupplement ? validateResearchSupplement(task, blockerFile) : null;
      const input = dateWorkerInput(task);
      if (supplement) input.researchSupplement = supplement;
      const payload = JSON.stringify(input);
      const maxWorkerBytes=task.maxWorkerBytes??options.maxWorkerBytes;
      if (Buffer.byteLength(payload) > maxWorkerBytes) throw new Error(`Date ${task.kind} packet exceeds ${maxWorkerBytes} bytes; inspect or split the assignment before spending`);
      const oldBlockerHash = supplement ? supplement.blockerHash.slice(7) : null;
      const verifyAttempt = () => {
        const supplementHash = createHash('sha256').update(JSON.stringify(supplement)).digest('hex');
        const attempts = task.state.researchAttempts;
        if (!Array.isArray(attempts) || task.state.researchBlockerHash !== oldBlockerHash || task.state.researchSupplementHash !== supplementHash ||
            !attempts.some(attempt => attempt.blockerHash === oldBlockerHash && attempt.supplementHash === supplementHash &&
              attempt.agentId === task.state.agentId && typeof task.state.runId === 'string' && task.state.runId &&
              typeof attempt.priorRunId === 'string' && attempt.priorRunId.trim() === attempt.priorRunId && attempt.priorRunId &&
              attempt.priorRunId !== task.state.runId)) {
          throw new Error('No post-dispatch run proves this research supplement continuation');
        }
      };
      if (task.state.agentId) {
        agent = await agentClient.resume(task.state.agentId,{apiKey:options.apiKey});
        const runs = await agentClient.listRuns(agent.agentId,{runtime:'cloud',apiKey:options.apiKey,limit:20});
        priorRunIds = new Set(runs.items.map(run => run.id));
        await save({sent:Boolean(task.state.sent || runs.items.length)});
        const active = runs.items.find(r=>r.status==='running');
        if (active) {
          await save({runId:active.id,status:'running'});
          await wait(active);
        } else if (runs.items.length) await save({runId:runs.items[0].id});
        let retained;
        try { retained = await download(); }
        catch (error) {
          if (!(error instanceof DateArtifactValidationError)) throw error;
          await save({validationError:error.message,artifactHash:error.artifactHash});
        }
        // A changed artifact may be a completed correction from an interrupted
        // continuation; an unchanged rejected artifact still needs that chat.
        if (retained && supplement && retained.artifactHash !== oldBlockerHash &&
            (!task.state.validationError || retained.artifactHash !== task.state.artifactHash)) {
          verifyAttempt();
          return await returned(retained);
        }
        if (retained && !supplement && retained.artifact.blocked && !options.recoverOnly && !control.stopRequested) throw new Error('A research supplement is required before continuing this blocked repair');
        if (retained && !supplement && (!task.state.validationError || (task.state.artifactHash && retained.artifactHash !== task.state.artifactHash))) return await returned(retained);
      } else {
        assertLaunchAllowed();
        agent = await agentClient.create({apiKey:options.apiKey,name:`Dates ${task.kind} ${task.packet.book}/${task.packet.chapter}`,
          model:{id:options.model,params:[]}, cloud:{metadata:{purpose:'people-date-audit',workerMode:'sealed',phase:task.kind}}});
        await save({agentId:agent.agentId,model:options.model,status:'created'});
      }
      // Repair packets are sealed inputs.  When host validation rejects a
      // repair after its first turn, resend the current packet: its exact row
      // encoding may have changed while the retained conversation was active.
      // A bare error string otherwise leaves the reviewer reasoning from a
      // stale attachment and repeatedly publishing an incompatible artifact.
      const revisedRepairPacket = task.state.sent && task.kind === 'repair' && task.state.validationError;
      const message = task.state.sent
        ? `${revisedRepairPacket || supplement ? `${payload}\nThis supersedes every earlier repair packet. ` : ''}Continue your existing date work; do not restart research. ${task.state.validationError ?? ''} Publish the complete current artifact at /opt/cursor/artifacts/${output}.`
        : `${payload}\nWrite only the requested JSON artifact to /opt/cursor/artifacts/${output}. You have no repository assignment: do not clone the corpus, inspect a prior extraction, commit, push, or spend through another model API.`;
      if (Buffer.byteLength(message) > maxWorkerBytes) throw new Error(`Date ${task.kind} message exceeds ${maxWorkerBytes} bytes; inspect or split the assignment before spending`);
      assertLaunchAllowed();
      if (supplement) {
        if (typeof task.state.runId !== 'string' || !task.state.runId || task.state.runId !== task.state.runId.trim()) throw new Error('Retained research blocker has no prior run identity');
        const researchSupplementHash = preserveDateBytes(task.directory, 'research-supplement', Buffer.from(JSON.stringify(supplement)));
        if (task.state.researchBlockerHash === oldBlockerHash && task.state.researchSupplementHash && task.state.researchSupplementHash !== researchSupplementHash) throw new Error('Research supplement changed for the retained blocker');
        const researchAttempts = [...(task.state.researchAttempts ?? [])];
        if (!researchAttempts.some(attempt => attempt.blockerHash === oldBlockerHash && attempt.supplementHash === researchSupplementHash)) {
          researchAttempts.push({ blockerHash: oldBlockerHash, supplementHash: researchSupplementHash, agentId: task.state.agentId, priorRunId: task.state.runId ?? null });
        }
        await save({ researchSupplementHash, researchBlockerHash: oldBlockerHash, researchAttempts });
      }
      await save({status:'sending'});
      assertLaunchAllowed();
      // The shared send helper retries asynchronously. Recheck the stop on each
      // actual send, including retries that wake after another job hits quota.
      let dispatchAttempted = false;
      let dispatchError;
      const guardedAgent = new Proxy(agent, { get(target, key, receiver) {
        if (key === 'send') return async (...args) => {
          assertLaunchAllowed();
          // A read timeout does not abort the SDK request. Dispatch once,
          // before any await; retries only reconcile that accepted run. A late
          // lookup can therefore never start a turn after the helper exits.
          if (!dispatchAttempted) {
            dispatchAttempted = true;
            try {
              return await target.send(...args);
            } catch (error) {
              dispatchError = error;
              requestCursorUsageLimitStop(control, error);
            }
          }
          const listed = await agentClient.listRuns(agent.agentId, {
            runtime: 'cloud', apiKey: options.apiKey, limit: 20,
          });
          const accepted = listed.items.filter(run => !priorRunIds.has(run.id));
          if (accepted.length > 1) throw new Error('Multiple unexpected date runs; preserve the conversation and inspect dispatch ownership');
          if (accepted.length === 1) return accepted[0];
          throw dispatchError ?? Object.assign(new Error('Network request acknowledgement is still pending; preserve the date conversation'), { isRetryable: true });
        };
        return Reflect.get(target, key, receiver);
      } });
      // Treat dispatch as part of the bounded worker operation.  A stalled
      // SDK send used to inherit the helper's 45-minute retry budget even
      // when this date worker was explicitly capped at 20 minutes, pinning
      // the sole host executor and preventing resumable recovery.
      const run = await send(guardedAgent,message,{label:task.key,timeoutMs:options.timeoutMs});
      await save({sent:true,runId:run.id,status:'running'});
      const result = await wait(run);
      const artifact = await download();
      if (!artifact) throw new Error(`Date worker ended ${result.status} without ${output}${result.error ? `: ${result.error.message ?? JSON.stringify(result.error)}` : ''}`, { cause: result.error });
      if (supplement && artifact.artifactHash === oldBlockerHash) throw new Error('Retained research blocker was returned unchanged after continuation');
      if (supplement) verifyAttempt();
      return await returned(artifact);
    } catch(error) {
      requestCursorUsageLimitStop(control,error);
      const message = String(error.message ?? error);
      const restarts = Number(task.state.agentRestarts ?? 0);
      // Cloud runs sometimes end with "Agent not found" after a few cents.
      // Drop that agent and start another one; do not discard returned jobs.
      if (!task.researchSupplement && !options.recoverOnly && restarts < 2 && message.includes('Agent not found') && !control.stopRequested) {
        const priorUsage = await usageCheckpoint();
        if (control.stopRequested) {
          await save({ status: 'interrupted', lastError: message, usage: priorUsage });
          usageSaved = true;
          throw error;
        }
        await save({ status: 'retry', lastError: message, agentRestarts: restarts + 1, agentId: null, runId: null, sent: false,
          priorUsages: [...(task.state.priorUsages ?? []), priorUsage] });
        task.state.agentId = null;
        task.state.runId = null;
        task.state.sent = false;
        // Await the retry before entering this invocation's asynchronous
        // finally block; otherwise an early rejection can go unhandled while
        // usage checkpointing is still running.
        delegatedRetry = true;
        return await runTask(task);
      }
      await save({status:'interrupted',lastError:message,
        ...(error instanceof DateArtifactValidationError ? {validationError:error.message,artifactHash:error.artifactHash} : {})});
      throw error;
    } finally {
      if (!delegatedRetry && !usageSaved) await save({ usage: await usageCheckpoint() });
    }
  };
  return runTask;
}

export function attachmentDateWorker({ outputDir, saveRemoteJob }) {
  return async task => {
    const identityField = task.kind === 'repair' ? 'author' : task.kind === 'review' ? 'reviewer' : null;
    if (!identityField) throw new Error(`Unknown date worker phase: ${task.kind}`);
    const identityShape = `${identityField}:{name,agentId${task.kind === 'review' ? ',independentOfExtractor:true' : ''}}`;
    const jobFile = path.join(outputDir, `${task.key}.input.json`);
    const outputFile = path.join(outputDir, `${task.key}.result.json`);
    if (!fs.existsSync(outputFile)) {
      const input = dateWorkerInput(task);
      writeJsonAtomic(jobFile, { ...input, instructions: `${input.instructions}\nThe returned attachment must include ${identityShape}. Use your actual stable conversation/context ID as agentId. This identity is a human attestation, not machine proof; a repair context cannot independently review its own changes.` });
      throw new Error(`Attachment required: review ${jobFile} and return ${outputFile}`);
    }
    const artifact = readJson(outputFile);
    const identity = artifact?.[identityField];
    if (!identity || typeof identity.name !== 'string' || !identity.name.trim() ||
        typeof identity.agentId !== 'string' || !identity.agentId.trim() || identity.agentId !== identity.agentId.trim() ||
        (task.kind === 'review' && identity.independentOfExtractor !== true)) {
      throw new Error(`Date ${task.kind} attachment requires ${identityShape}`);
    }
    // Attachment identities are human attestations, but must still be persisted
    // so the host can reject a repair conversation approving its own changes.
    await task.save({ agentId: identity.agentId });
    Object.assign(task.state, { agentId: identity.agentId });
    if (saveRemoteJob) await saveRemoteJob(task.key,task.state);
    return artifact;
  };
}
export function openRouterDateWorker({ key, model, maxWorkerBytes, timeoutMs, recoverOnly = false, saveRemoteJob,
  request, maxToolTurns = 20 }) {
  return async task => {
    const input = dateWorkerInput(task);
    const payload = JSON.stringify(input);
    if (Buffer.byteLength(payload) > (task.maxWorkerBytes ?? maxWorkerBytes)) {
      throw new Error('OpenRouter date packet exceeds the sealed worker byte ceiling');
    }
    const output = path.join(task.directory, `openrouter-${task.key}.json`);
    const agentId = `openrouter:${model}:${task.kind}:${task.key}`;
    const save = async patch => {
      await task.save(patch);
      Object.assign(task.state, patch);
      await saveRemoteJob(task.key, { ...task.state });
    };
    if (fs.existsSync(output) && !task.state.validationError) {
      return readJson(output);
    }
    await save({ agentId, model, status: 'running-tools' });
    let artifact;
    try {
      artifact = await runOpenRouterDateTools(task, {
        input,
        key,
        model,
        timeoutMs,
        recoverOnly,
        maxTurns: maxToolTurns,
        ...(request ? { request } : {}),
      });
    } catch (error) {
      // A bounded or artifact-only run must not leave a durable job appearing
      // live after its runner has exited. The saved tool transcript remains
      // the recovery source; this explicit state merely prevents an operator
      // from mistaking a stopped run for an active inference call.
      await save({ status: "interrupted", lastError: String(error?.message ?? error) });
      throw error;
    }
    if (task.kind === 'review') artifact.reviewer = { name: model, agentId, independentOfExtractor: true };
    if (task.kind === 'repair') artifact.author = { name: model, agentId };
    writeJsonAtomic(output, artifact);
    await save({ status: 'returned', validationError: null });
    return artifact;
  };
}
