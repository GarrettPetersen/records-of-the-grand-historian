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
    repairContract: 'A finding label is a coverage indicator, not necessarily a claim-row ID: target only IDs actually present in claims. For attestation, birth, death, or age rows, chronology changes MUST use kind "replace" with before copied verbatim from claims[id] and a complete after claim row; never use date-context. Claim certainty is exactly one of "explicit", "explicit-event-contextual-date", "strongly-inferred", "uncertain", "derived", or "textual-variant"; never write informal labels such as "inferred" or "contextual". For an explicitly undated source attestation, set undatedSourceAttestation:true directly on that complete after claim value—never use an invented undated field. Its event MUST be one source-specific English string of at least 20 characters (not an object), and it may carry no sourceDate, western date, unresolved field, or other temporal field. For any other row, replace or remove also copy before verbatim from claims[id]. date-context is permitted only for non-life rows: before must be exactly claims[id][2].dateContext (or null) and after must be only the replacement dateContext object. Copy any existing non-temporal dateContext fields, including event, verbatim into after; only sourceDate, westernYear, westernInterval, westernBounds, unresolved, and unresolvedReason may be added, removed, or changed. Put research explanation in reason, never in custom keys such as competingSourceDate, westernCalendar, or conversionEvidence. An add-reception-event MUST be an event-participation row with a nonempty kind such as retrospective-reference or posthumous-reference, plus the receptionType and any role/action supported by the source. A westernInterval is exactly {start:{era:"AD"|"BC",year:positive integer,precision:"year"|"month"|"day"},end:{era:"AD"|"BC",year:positive integer,precision:"year"|"month"|"day"}}; use no westernYear or westernBounds alongside it. Every western bound is {era:"AD"|"BC",year:positive integer,precision:"year"|"month"|"day"}; never use an ad field. Non-legendary people with active-date hints require a matching AD/BC hint and a Western attestation unless the sealed source is genuinely undated. The host preserves every non-date claim field; never send a full claim row for date-context.',
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
      const input = dateWorkerInput(task);
      const payload = JSON.stringify(input);
      const maxWorkerBytes=task.maxWorkerBytes??options.maxWorkerBytes;
      if (Buffer.byteLength(payload) > maxWorkerBytes) throw new Error(`Date ${task.kind} packet exceeds ${maxWorkerBytes} bytes; inspect or split the assignment before spending`);
      const blockerFile = task.kind === 'repair' && typeof task.directory === 'string'
        ? path.join(task.directory, 'research-blocker.json') : null;
      // A retained repair chat gets one chance to continue after a host-side
      // invariant repair. If it still returns a persisted blocker, preserve its
      // identity and replace only that exhausted repair context.
      if (blockerFile && fs.existsSync(blockerFile) && task.state.agentId && task.state.status === 'returned' && !task.state.replacementUsed) {
        const priorAgentId = task.state.agentId;
        await save({ priorAgentId, replacementUsed: true, agentId: null, runId: null, sent: false, status: 'replacement' });
        Object.assign(task.state, { priorAgentId, replacementUsed: true, agentId: null, runId: null, sent: false, status: 'replacement' });
      }
      if (task.state.agentId) {
        agent = await agentClient.resume(task.state.agentId,{apiKey:options.apiKey});
        const runs = await agentClient.listRuns(agent.agentId,{runtime:'cloud',apiKey:options.apiKey,limit:20});
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
        if (retained && (!task.state.validationError || (task.state.artifactHash && retained.artifactHash !== task.state.artifactHash))) return await returned(retained);
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
      const resolvedInvariant = blockerFile && fs.existsSync(blockerFile)
        ? 'The host has resolved the prior active-hint invariant: an empty active-date hint is valid when every dated row is a death, death-place, deceased participation, death attestation, or separately classified later reception. Do not report this as a research hold; return the complete repair artifact.'
        : '';
      const message = task.state.sent
        ? `${revisedRepairPacket ? `${payload}\nThis supersedes every earlier repair packet. ` : ''}Continue your existing date work; do not restart research. ${task.state.validationError ?? ''} ${resolvedInvariant} Publish the complete current artifact at /opt/cursor/artifacts/${output}.`
        : `${payload}\nWrite only the requested JSON artifact to /opt/cursor/artifacts/${output}. You have no repository assignment: do not clone the corpus, inspect a prior extraction, commit, push, or spend through another model API.`;
      assertLaunchAllowed();
      await save({status:'sending'});
      assertLaunchAllowed();
      // The shared send helper retries asynchronously. Recheck the stop on each
      // actual send, including retries that wake after another job hits quota.
      const guardedAgent = new Proxy(agent, { get(target, key, receiver) {
        if (key === 'send') return (...args) => { assertLaunchAllowed(); return target.send(...args); };
        return Reflect.get(target, key, receiver);
      } });
      const run = await send(guardedAgent,message,{label:task.key});
      await save({sent:true,runId:run.id,status:'running'});
      const result = await wait(run);
      const artifact = await download();
      if (!artifact) throw new Error(`Date worker ended ${result.status} without ${output}${result.error ? `: ${result.error.message ?? JSON.stringify(result.error)}` : ''}`, { cause: result.error });
      return await returned(artifact);
    } catch(error) {
      requestCursorUsageLimitStop(control,error);
      const message = String(error.message ?? error);
      const restarts = Number(task.state.agentRestarts ?? 0);
      // Cloud runs sometimes end with "Agent not found" after a few cents.
      // Drop that agent and start another one; do not discard returned jobs.
      if (restarts < 2 && message.includes('Agent not found') && !control.stopRequested) {
        await save({ status: 'retry', lastError: message, agentRestarts: restarts + 1, agentId: null, runId: null, sent: false });
        task.state.agentId = null;
        task.state.runId = null;
        task.state.sent = false;
        return runTask(task);
      }
      await save({status:'interrupted',lastError:message,
        ...(error instanceof DateArtifactValidationError ? {validationError:error.message,artifactHash:error.artifactHash} : {})});
      throw error;
    } finally {
      await save({ usage: await usageCheckpoint() });
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
  request }) {
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
    const artifact = await runOpenRouterDateTools(task, { input, key, model, timeoutMs, recoverOnly, ...(request ? { request } : {}) });
    if (task.kind === 'review') artifact.reviewer = { name: model, agentId, independentOfExtractor: true };
    if (task.kind === 'repair') artifact.author = { name: model, agentId };
    writeJsonAtomic(output, artifact);
    await save({ status: 'returned', validationError: null });
    return artifact;
  };
}
