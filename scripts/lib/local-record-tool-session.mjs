import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJsonAtomic } from './people-content.mjs';
import { getPeopleSchemaValidator, formatSchemaErrors } from './people-schema.mjs';

// Raw responses precede transcript/tool-state commits. Interrupted turns replay
// their saved response without another request; tool mutations commit together.
export async function runLocalRecordToolSession({ directory, fingerprint, initialState,
  tools, request, execute, maxTurns, maxTotalTokens, recoverOnly = false, checkpoint, prepare, compact }) {
  const file = path.join(directory, 'state.json');
  let state = fs.existsSync(file) ? readJson(file) : initialState();
  if (state.fingerprint !== fingerprint) throw new Error('Retained record-tool input changed');
  if (prepare) prepare(state);
  if (!Number.isSafeInteger(state.nextTurn) || state.nextTurn < 1) throw new Error('Invalid retained turn counter');
  writeJsonAtomic(file, state);
  const lastTurn = state.nextTurn + maxTurns - 1;
  let tokens = 0;
  let firstTurn = true;
  const validators = new Map(tools.map(tool => [tool.function.name,
    getPeopleSchemaValidator().compile(tool.function.parameters)]));
  while (!state.finished && state.nextTurn <= lastTurn && tokens < maxTotalTokens) {
    const turn = state.nextTurn;
    if (compact && ((firstTurn && turn > 1) || Buffer.byteLength(JSON.stringify(state.messages)) > 128000)) {
      writeJsonAtomic(path.join(directory, 'context-archives', `before-${turn}.json`), state);
      state.messages = compact(state);
      writeJsonAtomic(file, state);
      console.log(`Record context ${path.basename(directory)}: archived and compacted from saved records`);
    }
    firstTurn = false;
    const responseFile = path.join(directory, `response-${turn}.json`);
    let response;
    if (fs.existsSync(responseFile)) response = readJson(responseFile);
    else {
      if (recoverOnly) throw new Error('Artifact recovery cannot start a model turn');
      console.log(`Date ${path.basename(directory)} turn ${turn}: submitting`);
      response = await request({ messages: state.messages, tools });
      writeJsonAtomic(responseFile, response);
      tokens += response.usage.total_tokens;
    }
    const choice = response.choices?.[0];
    if (!choice?.message) throw new Error('Record-tool response has no assistant message');
    const next = structuredClone(state);
    if (choice.finish_reason === 'length') {
      next.messages.push({ role: 'user', content: 'The last response was truncated and no tool call executed. Use shorter calls; saved records remain intact.' });
    } else {
      next.messages.push(choice.message);
      const calls = choice.message.tool_calls ?? [];
      next.noToolTurns = calls.length ? 0 : (next.noToolTurns ?? 0) + 1;
      for (const call of calls) {
        let result;
        try {
          const args = JSON.parse(call.function.arguments);
          const validate = validators.get(call.function.name);
          if (!validate) throw new Error('Unknown record tool');
          if (!validate(args)) throw new Error(formatSchemaErrors(validate.errors).join('\n'));
          result = await execute(next, call.function.name, args);
        }
        catch (error) { result = { ok: false, error: error.message }; }
        next.failedTools = result.ok === false ? (next.failedTools ?? 0) + 1 : 0;
        next.messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) });
        console.log(`Date ${call.function.name}: ${result.ok === false ? result.error : 'saved/read'}`);
      }
      if (!calls.length) next.messages.push({ role: 'user', content: 'Use the record tools for the next check or correction. Finish only after complete source and check coverage.' });
    }
    next.nextTurn++;
    writeJsonAtomic(file, next);
    state = next;
    if (checkpoint) await checkpoint({ nextTurn: state.nextTurn, tokenUsage: tokens, finished: state.finished });
    if (state.noToolTurns >= 2 || state.failedTools >= 5) throw new Error('Repeated invalid or missing tool actions; inspect retained records before resuming');
  }
  if (!state.finished) throw new Error(`Record-tool job paused at turn ${state.nextTurn}; retained records are in ${directory}`);
  return state.artifact;
}
