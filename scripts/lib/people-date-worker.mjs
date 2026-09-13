import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { Agent } from '@cursor/sdk';
import { REPO_ROOT, writeJsonAtomic, readJson } from './people-content.mjs';
import { sendCursorAgentWhenReady, waitForCursorRun } from './cursor-run-wait.mjs';
import { requestCursorUsageLimitStop } from './cursor-run-control.mjs';

const prompt = fs.readFileSync(path.join(REPO_ROOT, 'prompt-people-date-review.txt'),'utf8');

export function dateWorkerInput(task) {
  if (task.kind === 'review') return { instructions: prompt, phase: 'independent-review', ...task.job };
  if (task.kind !== 'repair') throw new Error(`Unknown date worker phase: ${task.kind}`);
  const relevant = new Set(task.report.findings.flatMap(f=>f.items));
  const affectedPeople = new Set(task.packet.people.filter(p=>relevant.has(p.id)).map(p=>p.id));
  for (const item of task.packet.items) if (relevant.has(item.id)) affectedPeople.add(item.personId);
  // A repair must reconcile the person's whole chronology, including hints,
  // without pulling in every other person's claims from the chapter.
  const items = task.packet.items.filter(i=>affectedPeople.has(i.personId));
  const relevantChecks = new Set([...affectedPeople, ...items.map(i=>i.id)]);
  const unitIds = new Set(items.flatMap(i=>i.evidence));
  for (const check of [...task.report.itemChecks,...task.report.personChecks]) if (relevantChecks.has(check.id)) for (const e of check.evidence) unitIds.add(e.unit);
  const selected = new Set();
  for (let i=0;i<task.packet.units.length;i++) if (unitIds.has(task.packet.units[i].id)) for (let j=Math.max(0,i-3);j<Math.min(task.packet.units.length,i+4);j++) selected.add(j);
  return { instructions: prompt, phase: 'repair-proposal', sourceHash:task.packet.sourceHash, extractionHash:task.packet.extractionHash,
    book: task.packet.book, chapter:task.packet.chapter, sourceUrl:task.packet.sourceUrl,
    findings: task.report.findings, references:task.report.references,
    people:task.packet.people.filter(p=>affectedPeople.has(p.id)), items,
    claims:items.filter(i=>i.claimIndex !== undefined).map(i=>({id:i.id,row:task.extraction.claims[i.claimIndex]})),
    units:[...selected].sort((a,b)=>a-b).map(i=>task.packet.units[i]) };
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
  return async task => {
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
      const message = task.state.sent
        ? `Continue your existing date work; do not restart research. ${task.state.validationError ?? ''} Publish the complete current artifact at /opt/cursor/artifacts/${output}.`
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
      await save({status:'interrupted',lastError:String(error.message ?? error),
        ...(error instanceof DateArtifactValidationError ? {validationError:error.message,artifactHash:error.artifactHash} : {})});
      throw error;
    } finally {
      await save({ usage: await usageCheckpoint() });
    }
  };
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
